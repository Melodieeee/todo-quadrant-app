import React, { useState, useRef } from "react";
import { FiSettings, FiGlobe } from "react-icons/fi";

import { useTranslation } from "react-i18next";

const SettingsDropdown = ({ language, setLanguage }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  return (
<div
  className="relative flex items-center"
  onMouseEnter={() => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  }}
  onMouseLeave={() => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 100);
  }}
>
  <button
    className="no-expand text-gray-700 hover:text-gray-400 transition-colors duration-200"
    title={t('settings')}
  >
    <FiSettings size={15} />
  </button>
  {open && (
    <div className="no-expand absolute z-20 right-0 top-5 bg-[#fff7e6] text-[#5c3a1e] rounded shadow-md text-sm mt-1 min-w-[8rem] py-2 px-3">
      <label className="block font-medium mb-1 flex items-center gap-1">
        <FiGlobe />
        {t('language')}
      </label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full border border-yellow-800 rounded px-2 py-1"
      >
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>
    </div>
  )}
</div>

  );
};

export default SettingsDropdown;