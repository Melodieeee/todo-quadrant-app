import React, { useState, useEffect, useRef } from "react";
import { FiSettings, FiGlobe } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "react-i18next";

const SettingsDropdown = ({ language, setLanguage, user }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleLogout = () => {
    fetch("/api/user/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      user = null;
      window.location.reload();
    });
  };

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
        title={t("settings")}
      >
        <FiSettings size={15} />
      </button>
      {open && (
        <div className="no-expand absolute z-20 right-0 top-5 bg-[#fff7e6] text-[#5c3a1e] rounded shadow-md text-sm mt-1 min-w-[10rem] py-2 px-3">
          {/* 登入狀態區塊 */}
          <div className="mb-2">
            {user ? (
              <>
                <div className="block mb-1 font-medium truncate flex items-center gap-1">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-5 h-5 rounded-full"
                  />
                  {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-left text-sm hover:text-orange-400 transition-colors duration-200"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  window.location.href = "/oauth2/authorization/google";
                }}
                className="text-sm hover:text-orange-400 transition-colors duration-200 flex items-center gap-1"
              >
                <FcGoogle />
                {t("loginWithGoogle")}
              </button>
            )}
          </div>

          {/* 語言選擇器 */}
          <label className="block font-medium mb-1 flex items-center gap-1">
            <FiGlobe />
            {t("language")}
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-yellow-800 rounded px-2 py-1 text-sm hover:text-orange-400 transition-colors duration-200"
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