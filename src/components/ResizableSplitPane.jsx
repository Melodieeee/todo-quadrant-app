import React, { useState, useRef, useEffect } from "react";

const ResizableSplitPane = ({ left, right }) => {
  const [leftWidth, setLeftWidth] = useState(300); // 初始左側寬度
  const dragging = useRef(false);

  const onMouseDown = () => {
    dragging.current = true;
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const newWidth = Math.min(Math.max(e.clientX, 150), 800); // 限制寬度 150 ~ 800px
    setLeftWidth(newWidth);
  };

  const onMouseUp = () => {
    dragging.current = false;
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
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        userSelect: dragging.current ? "none" : "auto",
      }}
    >
      {/* 左側區塊 */}
      <div style={{ width: leftWidth, overflow: "auto" }}>{left}</div>

      {/* 分隔條 */}
      <div
        onMouseDown={onMouseDown}
        style={{
          width: "6px",
          cursor: "col-resize",
          backgroundColor: "transparent",
          zIndex: 10,
        }}
      />

      {/* 右側區塊 */}
      <div style={{ flex: 1, overflow: "auto" }}>{right}</div>
    </div>
  );
};

export default ResizableSplitPane;
