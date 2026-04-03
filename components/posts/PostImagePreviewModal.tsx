'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { Box } from '@mantine/core';

const SWIPE_PX = 56;
const SUPPRESS_AFTER_SWIPE_MS = 450;
const MAX_SCALE = 4;
const OPEN_ANIM_MS = 340;
const SLIDE_MS = 320;

export type ImageViewerOriginRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type Props = {
  urls: string[];
  initialIndex: number;
  opened: boolean;
  onClose: () => void;
  alt: string;
  originRect?: ImageViewerOriginRect | null;
};

function touchDistance(a: { clientX: number; clientY: number }, b: { clientX: number; clientY: number }) {
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return Math.hypot(dx, dy);
}

const RUBBER_FACTOR = 0.32;
/** 初始两指间距过小时用作分母下限，避免首帧缩放比例爆炸 / 几乎不缩放 */
const PINCH_MIN_DIST_PX = 28;

/**
 * 全屏看图：滑动切图（三相轨道、跟手与微信式过渡）、双指缩放与平移、单击关闭、可选缩略图展开动画。
 */
export default function PostImagePreviewModal({
  urls,
  initialIndex,
  opened,
  onClose,
  alt,
  originRect,
}: Props): ReactElement | null {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [enterProgress, setEnterProgress] = useState(0);
  const [openAnimComplete, setOpenAnimComplete] = useState(false);

  const [slideW, setSlideW] = useState(0);
  const [swipeOffsetX, setSwipeOffsetX] = useState(0);
  const [slideFingerDown, setSlideFingerDown] = useState(false);
  /** 切页完成后保持关闭 strip 的 transition，避免复位后再次用 CSS 插值产生「回弹」感 */
  const [stripTransitionLocked, setStripTransitionLocked] = useState(false);
  /** 只要曾经双指按下直到全部手指离开：期间固定单图容器，避免首次捏合时 scale 刚过 1.02 就拆掉三相轨道导致重挂载卡顿 */
  const [pinchSessionActive, setPinchSessionActive] = useState(false);

  const scaleRef = useRef(1);
  const txRef = useRef(0);
  const tyRef = useRef(0);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const slideContainerRef = useRef<HTMLDivElement | null>(null);
  const pendingStripCommitRef = useRef<null | 'prev' | 'next'>(null);
  const wasZoomedRef = useRef(false);

  const touchStartX = useRef<number | null>(null);
  const suppressCloseUntil = useRef(0);

  const gestureRef = useRef<'none' | 'pinch' | 'pan' | 'swipe'>('none');
  const pinchRef = useRef<{ baseDist: number; baseScale: number } | null>(null);
  const panRef = useRef<{ startX: number; startY: number; startTx: number; startTy: number } | null>(null);

  const canCarousel = urls.length > 1;
  const useCarouselLayout = canCarousel && slideW > 0;

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);
  useEffect(() => {
    txRef.current = tx;
  }, [tx]);
  useEffect(() => {
    tyRef.current = ty;
  }, [ty]);

  useLayoutEffect(() => {
    if (!opened || !slideContainerRef.current) return;
    const el = slideContainerRef.current;
    const read = () => {
      const w = el.clientWidth;
      if (w > 0) setSlideW(w);
    };
    read();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(read) : null;
    ro?.observe(el);
    window.addEventListener('resize', read);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', read);
    };
  }, [opened]);

  useEffect(() => {
    if (!opened || urls.length === 0) return;
    const i = Math.max(0, Math.min(initialIndex, urls.length - 1));
    setIndex(i);
    setScale(1);
    setTx(0);
    setTy(0);
    setSwipeOffsetX(0);
    setSlideFingerDown(false);
    setStripTransitionLocked(false);
    setPinchSessionActive(false);
    pendingStripCommitRef.current = null;
    wasZoomedRef.current = false;
    gestureRef.current = 'none';
    pinchRef.current = null;
    panRef.current = null;
    setEnterProgress(0);
    setOpenAnimComplete(false);
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEnterProgress(1));
    });
    return () => cancelAnimationFrame(t);
  }, [opened, initialIndex, urls.length]);

  useEffect(() => {
    if (!opened) return;
    const el = stageRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        e.preventDefault();
      }
      if (gestureRef.current === 'pinch' || gestureRef.current === 'pan') {
        e.preventDefault();
      }
      if (
        gestureRef.current === 'swipe' &&
        scaleRef.current <= 1.02 &&
        canCarousel &&
        useCarouselLayout
      ) {
        e.preventDefault();
      }
    };
    el.addEventListener('touchmove', prevent, { passive: false });
    return () => el.removeEventListener('touchmove', prevent);
  }, [opened, canCarousel, useCarouselLayout]);

  useEffect(() => {
    if (!opened) return;
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setOpenAnimComplete(true);
      return;
    }
    if (enterProgress !== 1) return;
    const t = window.setTimeout(() => setOpenAnimComplete(true), OPEN_ANIM_MS + 20);
    return () => clearTimeout(t);
  }, [opened, enterProgress]);

  useEffect(() => {
    if (!opened) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [opened]);

  /** 仅从放大态缩回 1 时归零横向偏移，避免每次 scale=1 渲染都触发扰动 */
  useEffect(() => {
    if (scale > 1.02) {
      wasZoomedRef.current = true;
      return;
    }
    if (wasZoomedRef.current) {
      wasZoomedRef.current = false;
      setSwipeOffsetX(0);
    }
  }, [scale]);

  const goPrev = useCallback(() => {
    setStripTransitionLocked(false);
    setIndex((i) => (i > 0 ? i - 1 : i));
    setScale(1);
    setTx(0);
    setTy(0);
    setSwipeOffsetX(0);
  }, []);

  const goNext = useCallback(() => {
    setStripTransitionLocked(false);
    setIndex((i) => (i < urls.length - 1 ? i + 1 : i));
    setScale(1);
    setTx(0);
    setTy(0);
    setSwipeOffsetX(0);
  }, [urls.length]);

  useEffect(() => {
    if (!opened) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [opened, onClose, goPrev, goNext]);

  const bumpSwipeSuppress = () => {
    suppressCloseUntil.current = Date.now() + SUPPRESS_AFTER_SWIPE_MS;
  };

  const finishSwipeSlide = useCallback(
    (rawDelta: number, i: number, w: number, len: number) => {
      if (!canCarousel || w <= 0) return;

      const motionReduce =
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (motionReduce) {
        setSlideFingerDown(false);
        if (rawDelta > SWIPE_PX && i > 0) {
          bumpSwipeSuppress();
          setIndex((x) => Math.max(0, x - 1));
        } else if (rawDelta < -SWIPE_PX && i < len - 1) {
          bumpSwipeSuppress();
          setIndex((x) => Math.min(len - 1, x + 1));
        }
        setSwipeOffsetX(0);
        pendingStripCommitRef.current = null;
        return;
      }

      const runSnap = (target: number, commit: 'prev' | 'next' | null) => {
        setSlideFingerDown(false);
        bumpSwipeSuppress();
        if (commit) pendingStripCommitRef.current = commit;
        window.requestAnimationFrame(() => {
          setSwipeOffsetX(target);
        });
      };

      if (rawDelta > SWIPE_PX && i > 0) {
        runSnap(w, 'prev');
        return;
      }
      if (rawDelta < -SWIPE_PX && i < len - 1) {
        runSnap(-w, 'next');
        return;
      }
      setSlideFingerDown(false);
      pendingStripCommitRef.current = null;
      window.requestAnimationFrame(() => {
        setSwipeOffsetX(0);
      });
    },
    [canCarousel],
  );

  const onStripTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName !== 'transform') return;
    const commit = pendingStripCommitRef.current;
    if (!commit) return;
    pendingStripCommitRef.current = null;
    if (commit === 'prev') {
      setIndex((x) => Math.max(0, x - 1));
    } else {
      setIndex((x) => Math.min(urls.length - 1, x + 1));
    }
    setSwipeOffsetX(0);
    setStripTransitionLocked(true);
  };

  const onTouchStartCapture = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setPinchSessionActive(true);
      gestureRef.current = 'pinch';
      panRef.current = null;
      touchStartX.current = null;
      setSlideFingerDown(false);
      const d0 = touchDistance(e.touches[0], e.touches[1]);
      pinchRef.current = {
        baseDist: Math.max(d0, PINCH_MIN_DIST_PX),
        baseScale: scaleRef.current,
      };
      return;
    }
    if (e.touches.length === 1) {
      const t = e.touches[0];
      if (scaleRef.current > 1.02) {
        gestureRef.current = 'pan';
        setSlideFingerDown(false);
        panRef.current = {
          startX: t.clientX,
          startY: t.clientY,
          startTx: txRef.current,
          startTy: tyRef.current,
        };
        touchStartX.current = null;
        pinchRef.current = null;
      } else {
        gestureRef.current = 'swipe';
        touchStartX.current = t.clientX;
        if (canCarousel && useCarouselLayout) {
          pendingStripCommitRef.current = null;
          setStripTransitionLocked(false);
          setSlideFingerDown(true);
          setSwipeOffsetX(0);
        }
        panRef.current = null;
        pinchRef.current = null;
      }
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) {
      e.preventDefault();
    }
    if (e.touches.length === 2 && pinchRef.current) {
      const d = Math.max(touchDistance(e.touches[0], e.touches[1]), 1);
      const { baseDist, baseScale } = pinchRef.current;
      if (baseDist >= PINCH_MIN_DIST_PX * 0.5) {
        const next = Math.min(MAX_SCALE, Math.max(1, (baseScale * d) / baseDist));
        setScale(next);
        pinchRef.current = { baseDist: d, baseScale: next };
      }
      return;
    }
    if (e.touches.length === 1 && gestureRef.current === 'pan' && panRef.current) {
      const t = e.touches[0];
      const { startX, startY, startTx, startTy } = panRef.current;
      setTx(startTx + (t.clientX - startX));
      setTy(startTy + (t.clientY - startY));
      return;
    }
    if (
      e.touches.length === 1 &&
      gestureRef.current === 'swipe' &&
      scaleRef.current <= 1.02 &&
      canCarousel &&
      useCarouselLayout &&
      touchStartX.current !== null
    ) {
      const t = e.touches[0];
      let o = t.clientX - touchStartX.current;
      if (index === 0 && o > 0) o *= RUBBER_FACTOR;
      if (index >= urls.length - 1 && o < 0) o *= RUBBER_FACTOR;
      setSwipeOffsetX(o);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    try {
      if (gestureRef.current === 'pinch') {
        if (e.touches.length >= 2) return;
        gestureRef.current = 'none';
        pinchRef.current = null;
        touchStartX.current = null;
        return;
      }

      if (gestureRef.current === 'pan') {
        if (e.touches.length === 0) {
          gestureRef.current = 'none';
          panRef.current = null;
        }
        return;
      }

      if (gestureRef.current === 'swipe' && touchStartX.current !== null && scaleRef.current <= 1.02) {
        const x = e.changedTouches[0]?.clientX ?? touchStartX.current;
        const delta = x - touchStartX.current;
        touchStartX.current = null;

        if (canCarousel && useCarouselLayout && slideW > 0) {
          finishSwipeSlide(delta, index, slideW, urls.length);
        } else if (delta > SWIPE_PX) {
          bumpSwipeSuppress();
          goPrev();
        } else if (delta < -SWIPE_PX) {
          bumpSwipeSuppress();
          goNext();
        } else {
          setSlideFingerDown(false);
        }
      } else {
        touchStartX.current = null;
        setSlideFingerDown(false);
      }
      gestureRef.current = 'none';
      panRef.current = null;
    } finally {
      if (e.touches.length === 0) {
        setPinchSessionActive(false);
      }
    }
  };

  const handleOverlayClick = () => {
    if (Date.now() < suppressCloseUntil.current) return;
    if (scale > 1.02) {
      setScale(1);
      setTx(0);
      setTy(0);
      return;
    }
    onClose();
  };

  if (!mounted || !opened || urls.length === 0) return null;

  const src = urls[index];
  if (!src) return null;

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 1;

  let transformOriginPct = '50% 50%';
  let openScaleFrom = 0.88;
  if (originRect && vw > 0 && vh > 0) {
    const ox = ((originRect.left + originRect.width / 2) / vw) * 100;
    const oy = ((originRect.top + originRect.height / 2) / vh) * 100;
    transformOriginPct = `${ox}% ${oy}%`;
    const cover = Math.max(originRect.width / vw, originRect.height / vh);
    openScaleFrom = Math.min(0.92, Math.max(0.22, cover * 0.92));
  }

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stageScale = prefersReducedMotion ? 1 : 1 + (openScaleFrom - 1) * (1 - enterProgress);
  const stageOpacity = prefersReducedMotion ? 1 : 0.72 + 0.28 * enterProgress;

  const originForTransform = openAnimComplete ? '50% 50%' : transformOriginPct;

  const stripTranslateX = -slideW + swipeOffsetX;
  const slideTransition =
    prefersReducedMotion || stripTransitionLocked || slideFingerDown
      ? 'none'
      : `transform ${SLIDE_MS}ms cubic-bezier(0.25, 0.8, 0.25, 1)`;

  const prevSrc = index > 0 ? urls[index - 1] ?? null : null;
  const nextSrc = index < urls.length - 1 ? urls[index + 1] ?? null : null;

  const imgStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain' as const,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    WebkitTouchCallout: 'none' as const,
    pointerEvents: 'none' as const,
    display: 'block' as const,
  };

  const showCarousel = useCarouselLayout && scale <= 1.02 && !pinchSessionActive;

  const overlay = (
    <Box
      role="dialog"
      aria-modal="true"
      aria-label={`大图浏览，${alt}，单击空白或图片关闭`}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: '#000',
        touchAction: 'none',
        width: '100vw',
        height: '100dvh',
        minHeight: '-webkit-fill-available',
        paddingTop: 'env(safe-area-inset-top)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Box
        ref={stageRef}
        onTouchStartCapture={onTouchStartCapture}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          transform: `translate(${tx}px, ${ty}px) scale(${scale * stageScale})`,
          transformOrigin: originForTransform,
          transition: prefersReducedMotion
            ? 'none'
            : openAnimComplete
              ? 'none'
              : enterProgress === 0
                ? 'none'
                : `transform ${OPEN_ANIM_MS}ms cubic-bezier(0.25, 0.8, 0.25, 1), opacity ${OPEN_ANIM_MS}ms ease`,
          opacity: stageOpacity,
        }}
      >
        {showCarousel ? (
          <Box
            ref={slideContainerRef}
            style={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'flex-start',
            }}
          >
            <Box
              onTransitionEnd={onStripTransitionEnd}
              style={{
                display: 'flex',
                flexDirection: 'row',
                height: '100%',
                width: slideW * 3,
                flexShrink: 0,
                transform: `translateX(${stripTranslateX}px)`,
                transition: slideTransition,
                willChange: 'transform',
              }}
            >
              <Box
                style={{
                  width: slideW,
                  flexShrink: 0,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {prevSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={prevSrc} alt="" style={imgStyle} />
                ) : (
                  <Box style={{ width: 1, height: 1, opacity: 0 }} />
                )}
              </Box>
              <Box
                style={{
                  width: slideW,
                  flexShrink: 0,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} draggable={false} style={imgStyle} />
              </Box>
              <Box
                style={{
                  width: slideW,
                  flexShrink: 0,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {nextSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={nextSrc} alt="" style={imgStyle} />
                ) : (
                  <Box style={{ width: 1, height: 1, opacity: 0 }} />
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            ref={slideContainerRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} draggable={false} style={imgStyle} />
          </Box>
        )}
      </Box>

      {urls.length > 1 && (
        <Box
          style={{
            position: 'absolute',
            bottom: `calc(16px + env(safe-area-inset-bottom))`,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.65)',
            fontSize: 13,
            letterSpacing: '0.06em',
            pointerEvents: 'none',
          }}
        >
          {index + 1} / {urls.length}
        </Box>
      )}
    </Box>
  );

  return createPortal(overlay, document.body) as ReactElement;
}
