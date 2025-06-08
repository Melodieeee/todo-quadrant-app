import React, { useState, useRef, useEffect } from "react";

const MIN_WIDTH = 150;
const MAX_WIDTH = window.innerWidth - 150;

const ResizableSplitPane = ({ left, right }) => {
  const [leftWidth, setLeftWidth] = useState(300);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const dragging = useRef(false);

  const onMouseDown = () => {
    dragging.current = true;
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;

    const newWidth = e.clientX;
    setLeftWidth(newWidth);

    if (newWidth < MIN_WIDTH) {
      setIsCollapsed("left");
      showOverlay("Left panel collapsed");
    } else if ( newWidth > MAX_WIDTH) {
      setIsCollapsed("right");
      showOverlay("Right panel collapsed");
    } else {
      setIsCollapsed(false);
    }
    
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  const showOverlay = (msg) => {
    setShowTip(msg);
    setTimeout(() => setShowTip(false), 1200);
  };

  const handleDoubleClickLeft = (e) => {
    if (e.target.closest(".no-expand")) {
      return;
    }
  
    const screenWidth = window.innerWidth;
  
    if (leftWidth >= screenWidth - 30) {
      setLeftWidth(300);
      setIsCollapsed(false);
    } else {
      setLeftWidth(screenWidth);
      setIsCollapsed("right");
    }
  };
  

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* 左側 */}
      <div
        onDoubleClick={handleDoubleClickLeft}
        style={{
          width: leftWidth,
          overflow: "auto",
        }}
      >
        {left}
      </div>

      {/* 分隔條或短線 */}
      <div
        title= {isCollapsed === "left"
          ? "Todo List - Drag to expand"
          : isCollapsed === "right"
          ? "Quadrants - Drag to expand"
          : "Drag to resize" }
        onMouseDown={onMouseDown}
        //onClick={isCollapsed ? handleExpand : null}
        style={{
          width:  "6px",
          height: isCollapsed ? "20%" : "100%",
          cursor:  "col-resize",
          backgroundColor: isCollapsed ? "#bbb" : "transparent",
          zIndex: 10,
          margin: isCollapsed ? "auto 0" : "0",  // 垂直置中
          alignSelf: isCollapsed ? "center" : "stretch",  // 支援垂直置中
          borderRadius: "3px",
        }}
      />

      {/* 右側 */}
      <div style={{ flex: 1, overflow: "auto" }}>{right}</div>

      {/* Overlay 提示 */}
      {showTip && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#333",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "14px",
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

export default ResizableSplitPane;
