import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import TooltipToggle from './TooltipToggle';
import { useTranslation } from 'react-i18next';

// 安全解析日期
const safeParseDate = (input) => {
  if (!input) return null;
  const parsed = new Date(input);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const toLocalInputValue = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - tzOffset);
  return localDate.toISOString().slice(0, 16);
};

const Task = ({ task, index, updateTask, deleteTask }) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  // const [dueDateState, setDueDateState] = useState(
  //   task.dueDate ? safeParseDate(task.dueDate)?.toISOString().slice(0, 16) : ""
  // );
  const [dueDateState, setDueDateState] = useState(toLocalInputValue(task.dueDate));

  const handleSave = () => {
    const utcDate = dueDateState ? new Date(dueDateState).toISOString() : null;

    updateTask(task.id, {
      title,
      description,
      dueDate: utcDate,
    });
    setEditing(false);
  };

  const createdAt = safeParseDate(task.createdAt);
  const dueDate = safeParseDate(task.dueDate);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) =>
        snapshot.isDragging ? (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="no-expand p-3 mb-2 rounded bg-white shadow-lg"
          >
            {task.title}
          </div>
        ) : (
          <Motion.div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`no-expand p-3 mb-2 rounded bg-white shadow-lg ${
              task.completed ? 'opacity-50' : ''
            }`}
            onDoubleClick={(e) => {
              const tag = e.target.tagName.toLowerCase();
              if (!['input', 'textarea', 'button', 'svg', 'path'].includes(tag)) {
                setEditing(true);
                e.stopPropagation();
              }
            }}
            layout
          >
            <AnimatePresence mode="wait">
              {editing ? (
                <Motion.div
                  key="edit"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  onDoubleClick={(e) => {
                    const tag = e.target.tagName.toLowerCase();
                    if (!['input', 'textarea', 'button', 'svg', 'path'].includes(tag)) {
                      handleSave();
                      e.stopPropagation();
                    }
                  }}
                >
                  <label className="block text-sm font-semibold mb-1">{t('title')}</label>
                  <input
                    name="taskTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mb-2 border rounded px-2 py-1"
                    placeholder={t('enterTitle')}
                  />
                  <label className="block text-sm font-semibold mb-1">{t('description')}</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mb-2 border rounded px-2 py-1"
                    placeholder={t('enterDescription')}
                  />
                  <label className="block text-sm font-semibold mb-1">{t('dueTime')}</label>
                  <input
                    name="dueDate"
                    type="datetime-local"
                    value={dueDateState}
                    onChange={(e) => setDueDateState(e.target.value)}
                    className="w-full mb-2 border rounded px-2 py-1"
                  />
                  <div className="flex justify-between mt-2">
                    <Motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={handleSave}
                      className="bg-green-400 text-white px-3 py-1 rounded"
                    >
                      {t('save')}
                    </Motion.button>
                    <Motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setEditing(false)}
                      className="bg-gray-300 text-black px-3 py-1 rounded"
                    >
                      {t('cancel')}
                    </Motion.button>
                  </div>
                </Motion.div>
              ) : (
                <Motion.div
                  key="view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-center">
                    <h4
                      className={`font-semibold text-base ${task.completed ? 'line-through' : ''}`}
                    >
                      {task.title}
                    </h4>
                    <input
                      name="taskCompleted"
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => updateTask(task.id, { completed: e.target.checked })}
                    />
                  </div>

                  {task.description && (
                    <div
                      className={`text-sm text-gray-700 mt-1 ${
                        task.completed ? 'line-through' : ''
                      }`}
                    >
                      {task.description}
                    </div>
                  )}

                  {createdAt && (
                    <div
                      className={`text-xs text-gray-500 mt-1 ${
                        task.completed ? 'line-through' : ''
                      }`}
                    >
                      <span>{t('join')}：</span>
                      <TooltipToggle
                        defaultValue={formatDistanceToNow(createdAt, {
                          addSuffix: true,
                        })}
                        tooltip={createdAt.toLocaleString()}
                        className={task.completed ? 'line-through text-gray-500' : ''}
                      />
                    </div>
                  )}

                  {dueDate && (
                    <div
                      className={`text-xs text-gray-500 mt-1 ${
                        task.completed ? 'line-through' : ''
                      }`}
                    >
                      <span>{t('due')}：</span>
                      <TooltipToggle
                        defaultValue={formatDistanceToNow(dueDate, {
                          addSuffix: true,
                        })}
                        tooltip={dueDate.toLocaleString()}
                        className={task.completed ? 'line-through text-gray-500' : ''}
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2 mt-2">
                    <Motion.button
                      onClick={() => setEditing(true)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Pencil size={18} className="text-teal-400 hover:text-blue-500" />
                    </Motion.button>
                    <Motion.button
                      onClick={() => deleteTask(task.id)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={18} className="text-pink-500 hover:text-pink-700" />
                    </Motion.button>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </Motion.div>
        )
      }
    </Draggable>
  );
};

export default Task;
