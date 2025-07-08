import React from 'react';
import { useTranslation } from 'react-i18next';

const LocalTaskWarningModal = ({ onClose, onLogin }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{t('localTaskWarningTitle')}</h2>
        <p className="text-gray-700 mb-6">{t('localTaskWarningMessage')}</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
            onClick={onClose}
          >
            {t('addMoreUnsavedTasks')}
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={onLogin}
          >
            {t('loginWithGoogle')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalTaskWarningModal;
