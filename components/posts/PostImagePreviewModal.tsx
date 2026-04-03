'use client';

import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { Box } from '@mantine/core';

const SWIPE_PX = 56;
const SUPPRESS_AFTER_SWIPE_MS = 450;
const MAX_SCALE = 4;
const OPEN_ANIM_MS = 340;

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

/**
 * 全屏看图：安全区内铺满、滑动切图、双指缩放与平移、单击关闭（缩放为 1 时）、可选缩略图展开动画。
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

  const scaleRef = useRef(1);
  const txRef = useRef(0);
  const tyRef = useRef(0);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const touchStartX = useRef<number | null>(null);
  const suppressCloseUntil = useRef(0);

  const gestureRef = useRef<'none' | 'pinch' | 'pan' | 'swipe'>('none');
  const pinchRef = useRef<{ baseDist: number; baseScale: number } | null>(null);
  const panRef = useRef<{ startX: number; startY: number; startTx: number; startTy: number } | null>(null);

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

  useEffect(() => {
    if (!opened || urls.length === 0) return;
    const i = Math.max(0, Math.min(initialIndex, urls.length - 1));
    setIndex(i);
    setScale(1);
    setTx(0);
    setTy(0);
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
      if (gestureRef.current === 'pinch' || gestureRef.current === 'pan') {
        e.preventDefault();
      }
    };
    el.addEventListener('touchmove', prevent, { passive: false });
    return () => el.removeEventListener('touchmove', prevent);
  }, [opened]);

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

  const goPrev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i));
    setScale(1);
    setTx(0);
    setTy(0);
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => (i < urls.length - 1 ? i + 1 : i));
    setScale(1);
    setTx(0);
    setTy(0);
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

  const onTouchStartCapture = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      gestureRef.current = 'pinch';
      panRef.current = null;
      touchStartX.current = null;
      pinchRef.current = {
        baseDist: touchDistance(e.touches[0], e.touches[1]),
        baseScale: scaleRef.current,
      };
      return;
    }
    if (e.touches.length === 1) {
      const t = e.touches[0];
      if (scaleRef.current > 1.02) {
        gestureRef.current = 'pan';
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
        panRef.current = null;
        pinchRef.current = null;
      }
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const d = touchDistance(e.touches[0], e.touches[1]);
      const { baseDist, baseScale } = pinchRef.current;
      if (baseDist > 0) {
        const next = Math.min(MAX_SCALE, Math.max(1, (baseScale * d) / baseDist));
        setScale(next);
      }
      return;
    }
    if (e.touches.length === 1 && gestureRef.current === 'pan' && panRef.current) {
      const t = e.touches[0];
      const { startX, startY, startTx, startTy } = panRef.current;
      setTx(startTx + (t.clientX - startX));
      setTy(startTy + (t.clientY - startY));
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
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
      if (delta > SWIPE_PX) {
        bumpSwipeSuppress();
        goPrev();
      } else if (delta < -SWIPE_PX) {
        bumpSwipeSuppress();
        goNext();
      }
    } else {
      touchStartX.current = null;
    }
    gestureRef.current = 'none';
    panRef.current = null;
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            pointerEvents: 'none',
            display: 'block',
          }}
        />
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
