import React, { useState, useRef, useEffect } from "react";

const Tooltip = ({ content, children }) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState("right");
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (show && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const buffer = 40;
      const shouldShowLeft = rect.right + buffer > window.innerWidth;
      setPosition(shouldShowLeft ? "left" : "right");
    }
  }, [show]);

  return (
    <div
      className="relative inline-block"
      ref={wrapperRef}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <div
        className={`absolute z-10 px-3 py-2 text-sm rounded shadow-lg transition-opacity duration-200
        ${show ? "opacity-100" : "opacity-0 pointer-events-none"}
        ${position === "right" ? "left-full ml-2 top-0" : "right-full mr-2 top-0"}
        bg-[#fff7e6] text-[#5c3a1e]`}
        style={{
          whiteSpace: "normal",
          width: "fit-content",
          minWidth: "5rem",         // 最小寬度，大約可容納 4–5 個中文字
          maxWidth: "20rem",        // 最大寬度，超過會自動換行
          wordBreak: "break-word",  // 讓長單字能換行
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;