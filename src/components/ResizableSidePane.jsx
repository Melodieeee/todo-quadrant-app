import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const MIN = 100;

const ResizableSidePane = ({ left, right }) => {
  const { t } = useTranslation();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [splitValue, setSplitValue] = useState(window.innerWidth < 640 ? 250 : 300);

  const dragging = useRef(false);

  const showOverlay = useCallback((msg) => {
    setShowTip(msg);
    setTimeout(() => setShowTip(false), 1200);
  }, []);

  const updateSplitValueAndCollapse = useCallback(
    (pos) => {
      const maxSplit = isMobile ? window.innerHeight - MIN : window.innerWidth - MIN;

      setSplitValue(pos);

      if (pos < MIN) {
        setIsCollapsed('left');
        showOverlay(t('todoListCollapsed'));
      } else if (pos > maxSplit) {
        setIsCollapsed('right');
        showOverlay(t('quadrantCollapsed'));
      } else {
        setIsCollapsed(false);
      }
    },
    [isMobile, showOverlay, t]
  );

  const onMove = useCallback(
    (e) => {
      if (!dragging.current) return;

      let pos = isMobile
        ? (e.touches?.[0]?.clientY ?? e.clientY)
        : (e.touches?.[0]?.clientX ?? e.clientX);

      if (typeof pos !== 'number') return;

      updateSplitValueAndCollapse(pos);
    },
    [isMobile, updateSplitValueAndCollapse]
  );

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

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);

      // 當視窗變化，重新計算最大寬度限制與 splitValue
      const newMax = mobile ? window.innerHeight - MIN : window.innerWidth - MIN;

      if (splitValue > newMax) {
        setSplitValue(newMax);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', stopDragging);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [onMove, stopDragging, splitValue]);

  const splitStyle = isMobile
    ? { height: splitValue, width: '100%', overflow: 'hidden' }
    : { width: splitValue, height: '100%', overflow: 'hidden' };

  const dividerStyle = {
    backgroundColor: isDragging ? '#999' : isCollapsed ? '#bbb' : 'transparent',
    width: isMobile ? '100%' : '6px',
    height: isMobile ? '6px' : '100%',
    cursor: isMobile ? 'row-resize' : 'col-resize',
    zIndex: 10,
    alignSelf: isCollapsed ? 'center' : 'stretch',
    margin: isCollapsed ? 'auto' : '0',
    borderRadius: '3px',
    touchAction: 'none',
    transition: 'background-color 0.3s',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    height: '100%',
    width: '100%',
  };

  const remainingStyle = {
    flex: 1,
    overflow: 'hidden',
  };

  return (
    <div style={containerStyle}>
      <div style={splitStyle}>{left}</div>
      <div
        title={
          isCollapsed === 'left'
            ? t('todoListDragToExpand')
            : isCollapsed === 'right'
              ? t('quadrantDragToExpand')
              : t('dragToResize')
        }
        style={dividerStyle}
        onMouseDown={startDragging}
        onTouchStart={startDragging}
      />
      <div style={remainingStyle}>{right}</div>

      {showTip && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            opacity: 0.9,
            zIndex: 1000,
          }}
        >
          {showTip}
        </div>
      )}
    </div>
  );
};

export default ResizableSidePane;
