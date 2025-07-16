import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const ResizableSplit = ({
  direction = 'horizontal',
  children,
  sizes,
  setSizes,
  collapsedIndex,
  setCollapsedIndex,
}) => {
  const { t } = useTranslation();
  const isHorizontal = direction === 'horizontal';
  const dragging = useRef(false);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const startDragging = () => {
    dragging.current = true;
    setIsDragging(true);
    document.body.style.userSelect = 'none';
    document.body.style.touchAction = 'none';
  };

  const stopDragging = useCallback(() => {
    dragging.current = false;
    setIsDragging(false);
    document.body.style.userSelect = '';
    document.body.style.touchAction = '';
  }, []);

  const updateSize = useCallback(
    (pos) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const total = isHorizontal ? rect.height : rect.width;
      const offset = isHorizontal ? pos.clientY - rect.top : pos.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, offset / total));
      setSizes([ratio, 1 - ratio]);

      if (ratio < 0.1) {
        setCollapsedIndex(0);
      } else if (ratio > 0.9) {
        setCollapsedIndex(1);
      } else {
        setCollapsedIndex(null);
      }
    },
    [isHorizontal, setSizes, setCollapsedIndex]
  );

  const onMouseDown = (e) => {
    e.preventDefault();
    startDragging();
  };

  const onMouseMove = useCallback(
    (e) => {
      if (!dragging.current) return;
      updateSize(e);
    },
    [updateSize]
  );

  const onMouseUp = useCallback(() => {
    if (!dragging.current) return;
    stopDragging();
  }, [stopDragging]);

  const onTouchStart = () => {
    startDragging();
  };

  const onTouchMove = useCallback(
    (e) => {
      if (!dragging.current || !e.touches?.length) return;
      updateSize(e.touches[0]);
    },
    [updateSize]
  );

  const onTouchEnd = useCallback(() => {
    if (!dragging.current) return;
    stopDragging();
  }, [stopDragging]);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  const [first, second] = children;
  const [firstSize, secondSize] = sizes;

  const dividerStyle = {
    width: isHorizontal ? '100%' : '6px',
    height: isHorizontal ? '6px' : '100%',
    backgroundColor: isDragging ? '#999' : collapsedIndex !== null ? '#bbb' : 'transparent',
    cursor: isHorizontal ? 'row-resize' : 'col-resize',
    zIndex: 10,
    alignSelf: 'stretch',
    borderRadius: '3px',
    transition: 'background-color 0.3s',
    userSelect: 'none',
    touchAction: 'none',
  };

  return (
    <div
      ref={containerRef}
      className="flex w-full h-full"
      style={{ flexDirection: isHorizontal ? 'column' : 'row' }}
    >
      <div style={{ flex: firstSize, overflow: 'hidden', touchAction: 'manipulation' }}>
        {first}
      </div>

      <div
        title={t('dragToResize')}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={dividerStyle}
      />

      <div style={{ flex: secondSize, overflow: 'hidden', touchAction: 'manipulation' }}>
        {second}
      </div>
    </div>
  );
};

export default ResizableSplit;
