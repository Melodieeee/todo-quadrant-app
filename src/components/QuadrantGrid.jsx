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
      <div
        className="h-full"
        style={{ flex: firstSize, overflow: "hidden", position: "relative" }}
      >
        {first}
      </div>
      <div
        title="Drag to resize quadrants"
        onMouseDown={onMouseDown}
        style={{
          width: isHorizontal ? "100%" : "6px",
          height: isHorizontal ? "6px" : "100%",
          cursor: isHorizontal ? "row-resize" : "col-resize",
          zIndex: 10,
          backgroundColor: "transparent",
          borderRadius: "3px",
          alignSelf: "center",
        }}
      />
      <div
        className="h-full"
        style={{ flex: secondSize, overflow: "hidden", position: "relative" }}
      >
        {second}
      </div>
    </div>
  );
};

const QuadrantGrid = ({ renderQuadrant }) => {
  const [verticalSplit, setVerticalSplit] = useState([0.5, 0.5]);
  const [topSplit, setTopSplit] = useState([0.5, 0.5]);
  const [bottomSplit, setBottomSplit] = useState([0.5, 0.5]);
  const [fullscreenQuadrant, setFullscreenQuadrant] = useState(null);

  const handleDoubleClick = (quadrant) => {
    setFullscreenQuadrant((prev) => (prev === quadrant ? null : quadrant));
  };

  const renderWithDoubleClick = (quadrantKey) => (
    <div
      style={{ width: "100%", height: "100%" }}
      onDoubleClick={() => handleDoubleClick(quadrantKey)}
    >
      {renderQuadrant(quadrantKey)}
    </div>
  );

  if (fullscreenQuadrant) {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        {renderWithDoubleClick(fullscreenQuadrant)}
      </div>
    );
  }

  return (
    <Split
      direction="horizontal"
      sizes={verticalSplit}
      setSizes={setVerticalSplit}
    >
      <Split direction="vertical" sizes={topSplit} setSizes={setTopSplit}>
        {renderWithDoubleClick("IN")}
        {renderWithDoubleClick("IU")}
      </Split>
      <Split direction="vertical" sizes={bottomSplit} setSizes={setBottomSplit}>
        {renderWithDoubleClick("NN")}
        {renderWithDoubleClick("NU")}
      </Split>
    </Split>
  );
};

export default QuadrantGrid;
