'use client';

import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { Box } from '@mantine/core';

const SWIPE_PX = 56;

type Props = {
  urls: string[];
  initialIndex: number;
  opened: boolean;
  onClose: () => void;
  alt: string;
};

/**
 * 全屏直接展示图片；单击屏幕退出；手机端左右滑动切换；桌面端可用键盘 ← →。
 */
export default function PostImagePreviewModal({
  urls,
  initialIndex,
  opened,
  onClose,
  alt,
}: Props): ReactElement | null {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  /** 滑动切图后浏览器会派发 click，需忽略以免误关 */
  const suppressClickAfterSwipeRef = useRef(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!opened || urls.length === 0) return;
    const i = Math.max(0, Math.min(initialIndex, urls.length - 1));
    setIndex(i);
  }, [opened, initialIndex, urls.length]);

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
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => (i < urls.length - 1 ? i + 1 : i));
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

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const x = e.changedTouches[0].clientX;
    const delta = x - touchStartX.current;
    touchStartX.current = null;
    if (delta > SWIPE_PX) {
      suppressClickAfterSwipeRef.current = true;
      goPrev();
    } else if (delta < -SWIPE_PX) {
      suppressClickAfterSwipeRef.current = true;
      goNext();
    }
  };

  const onOverlayClick = () => {
    if (suppressClickAfterSwipeRef.current) {
      suppressClickAfterSwipeRef.current = false;
      return;
    }
    onClose();
  };

  if (!mounted || !opened || urls.length === 0) return null;

  const src = urls[index];
  if (!src) return null;

  const overlay = (
    <Box
      role="dialog"
      aria-modal="true"
      aria-label={`大图浏览，${alt}，单击屏幕关闭`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={onOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: '#000',
        touchAction: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
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
          padding: '24px 12px 40px',
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      />

      {urls.length > 1 && (
        <Box
          style={{
            position: 'absolute',
            bottom: 16,
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
