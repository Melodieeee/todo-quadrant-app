import React from "react";
import { useTranslation } from "react-i18next";

const MergeLocalTasksModal = ({ onConfirmMerge, onSkipMerge }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{t("mergeTasksTitle")}</h2>
        <p className="text-gray-700 mb-6">
          {t("mergeTasksMessage")}
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
            onClick={onSkipMerge}
          >
            {t("skip")}
          </button>
          <button
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
            onClick={onConfirmMerge}
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MergeLocalTasksModal;
