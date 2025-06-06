import React, { useState, useRef, useEffect } from "react";

const Split = ({ direction = "horizontal", children, sizes, setSizes }) => {
  const isHorizontal = direction === "horizontal";
  const dragging = useRef(false);

  const onMouseDown = () => (dragging.current = true);

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const pos = isHorizontal ? e.clientY : e.clientX;
    const total = isHorizontal ? window.innerHeight : window.innerWidth;
    const ratio = Math.max(0.2, Math.min(0.8, pos / total));
    setSizes([ratio, 1 - ratio]);
  };

  const onMouseUp = () => (dragging.current = false);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const [first, second] = children;
  const [firstSize, secondSize] = sizes;

  return (
    <div
      className="flex w-full h-full"
      style={{ flexDirection: isHorizontal ? "column" : "row" }}
    >
      <div className="h-full" style={{ flex: firstSize, overflow: "hidden" }}>{first}</div>
      <div
        onMouseDown={onMouseDown}
        style={{
          width: isHorizontal ? "100%" : "6px",
          height: isHorizontal ? "6px" : "100%",
          backgroundColor: "transparent",
          cursor: isHorizontal ? "row-resize" : "col-resize",
          zIndex: 10,
        }}
      />
      <div className="h-full" style={{ flex: secondSize, overflow: "hidden" }}>{second}</div>
    </div>
  );
};

const QuadrantGrid = ({ renderQuadrant }) => {
  const [verticalSplit, setVerticalSplit] = useState([0.5, 0.5]); // 上下比
  const [topSplit, setTopSplit] = useState([0.5, 0.5]); // 上面左右
  const [bottomSplit, setBottomSplit] = useState([0.5, 0.5]); // 下面左右

  return (
    <Split direction="horizontal" sizes={verticalSplit} setSizes={setVerticalSplit}>
      {/* 上半部：topRight, topLeft */}
      <Split direction="vertical" sizes={topSplit} setSizes={setTopSplit}>
        {renderQuadrant("IN")} 
        {renderQuadrant("IU")}        
      </Split>
      {/* 下半部：bottomRight bottomLeft */}
      <Split direction="vertical" sizes={bottomSplit} setSizes={setBottomSplit}>
        {renderQuadrant("NN")}
        {renderQuadrant("NU")}
      </Split>
    </Split>
  );
};

export default QuadrantGrid;
