import React, { useState, useRef, useEffect } from "react";

const Split = ({
  direction = "horizontal",
  children,
  sizes,
  setSizes,
  collapsedIndex,
  setCollapsedIndex,
}) => {
  const isHorizontal = direction === "horizontal";
  const dragging = useRef(false);

  const onMouseDown = () => (dragging.current = true);

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const pos = isHorizontal ? e.clientY : e.clientX;
    const total = isHorizontal ? window.innerHeight : window.innerWidth;
    const ratio = Math.max(0, Math.min(1, pos / total));
    setSizes([ratio, 1 - ratio]);

    if (ratio < 0.1) {
      setCollapsedIndex(0);
    } else if (ratio > 0.9) {
      setCollapsedIndex(1);
    } else {
      setCollapsedIndex(null);
    }
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
      <div className="h-full" style={{ flex: firstSize, overflow: "hidden" }}>
        {first}
      </div>

      {/* divider */}
      <div
        title="Drag to resize"
        onMouseDown={onMouseDown}
        style={{
          width: isHorizontal
            ? collapsedIndex !== null
              ? "40%"
              : "100%"
            : "6px",
          height: isHorizontal ? "6px" : (collapsedIndex !== null
            ? "20%"
            : "100%"),
          backgroundColor: collapsedIndex !== null ? "#bbb" : "transparent",
          cursor: isHorizontal ? "row-resize" : "col-resize",
          zIndex: 10,
          alignSelf: collapsedIndex !== null ? "center" : "stretch",
          margin: collapsedIndex !== null ? "auto 0" : "0",
          borderRadius: "3px",
          transition: "background-color 0.3s",
        }}
      />
      
      <div className="h-full" style={{ flex: secondSize, overflow: "hidden" }}>
        {second}
      </div>
    </div>
  );
};

const QuadrantGrid = ({ renderQuadrant }) => {
  const [verticalSplit, setVerticalSplit] = useState([0.5, 0.5]);
  const [topSplit, setTopSplit] = useState([0.5, 0.5]);
  const [bottomSplit, setBottomSplit] = useState([0.5, 0.5]);

  const [expandedQuadrant, setExpandedQuadrant] = useState(null);

  const [verticalCollapsed, setVerticalCollapsed] = useState(null);
  const [topCollapsed, setTopCollapsed] = useState(null);
  const [bottomCollapsed, setBottomCollapsed] = useState(null);

  const handleDoubleClick = (id) => {
    if (expandedQuadrant === id) {
      setExpandedQuadrant(null);
    } else {
      setExpandedQuadrant(id);
    }
  };

  const getQuadrantComponent = (id, component) => (
    <div
      onDoubleClick={(e) => {
        e.preventDefault();
        window.getSelection()?.removeAllRanges();
        if (e.target.closest(".no-expand")) {
          return;
        }
        handleDoubleClick(id);
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {component}
    </div>
  );

  if (expandedQuadrant) {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        {getQuadrantComponent(
          expandedQuadrant,
          renderQuadrant(expandedQuadrant)
        )}
      </div>
    );
  }

  return (
    <Split
      direction="horizontal"
      sizes={verticalSplit}
      setSizes={setVerticalSplit}
      collapsedIndex={verticalCollapsed}
      setCollapsedIndex={setVerticalCollapsed}
    >
      <Split
        direction="vertical"
        sizes={topSplit}
        setSizes={setTopSplit}
        collapsedIndex={topCollapsed}
        setCollapsedIndex={setTopCollapsed}
      >
        {getQuadrantComponent("IN", renderQuadrant("IN"))}
        {getQuadrantComponent("IU", renderQuadrant("IU"))}
      </Split>
      <Split
        direction="vertical"
        sizes={bottomSplit}
        setSizes={setBottomSplit}
        collapsedIndex={bottomCollapsed}
        setCollapsedIndex={setBottomCollapsed}
      >
        {getQuadrantComponent("NN", renderQuadrant("NN"))}
        {getQuadrantComponent("NU", renderQuadrant("NU"))}
      </Split>
    </Split>
  );
};

export default QuadrantGrid;
