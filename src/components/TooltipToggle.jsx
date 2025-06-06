import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TooltipToggle = ({ defaultValue, tooltip }) => {
  const [toggled, setToggled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState("top");
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (hovered && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const buffer = 40;
      setPosition(rect.bottom + buffer > window.innerHeight ? "top" : "bottom");
    }
  }, [hovered]);

  const handleClick = () => {
    setToggled(!toggled);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const current = toggled ? tooltip : defaultValue;
  const tip = toggled ? defaultValue : tooltip;

  return (
    <span
      ref={wrapperRef}
      className="relative inline-block cursor-pointer"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="underline decoration-dotted">{current}</span>
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, y: position === "top" ? 5 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === "top" ? 5 : -5 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-10 px-2 py-1 bg-black text-white text-xs rounded shadow-md whitespace-nowrap ${
              position === "top" ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            
            {tip}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

export default TooltipToggle;
