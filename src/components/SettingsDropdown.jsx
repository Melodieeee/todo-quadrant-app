import React, { useState } from "react";
import { FiSettings } from "react-icons/fi";

const SettingsDropdown = ({ theme, setTheme, language, setLanguage }) => {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen(!open);

  const handleColorChange = (e) => {
    const { name, value } = e.target;
    setTheme((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative mr-2">
      <button
        onClick={toggleDropdown}
        className="text-gray-700 hover:text-black"
        title="Settings"
      >
        <FiSettings size={20} />
      </button>
      {open && (
        <div className="absolute z-50 right-0 mt-2 w-64 p-4 bg-white rounded shadow-lg">
          <div className="mb-4">
            <label className="block font-medium mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block font-medium">Task Background</label>
            <input
              type="color"
              name="taskBg"
              value={theme.taskBg}
              onChange={handleColorChange}
              className="w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium">Todo List BG</label>
            <input
              type="color"
              name="inboxBg"
              value={theme.inboxBg}
              onChange={handleColorChange}
              className="w-full"
            />
          </div>
          {['IN', 'IU', 'NU', 'NN'].map((key) => (
            <div key={key} className="mb-2">
              <label className="block font-medium">Quadrant {key}</label>
              <input
                type="color"
                name={`quadrant_${key}`}
                value={theme[`quadrant_${key}`]}
                onChange={handleColorChange}
                className="w-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;