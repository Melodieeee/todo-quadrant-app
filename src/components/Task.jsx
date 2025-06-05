// Task.jsx
import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Pencil, Trash2 } from "lucide-react";
import {
  format,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInYears,
  formatDistanceToNow,
  parseISO,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const Task = ({ task, index, updateTask, deleteTask }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDateState, setDueDateState] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""
  );

  const handleSave = () => {
    updateTask(task.id, {
      title,
      description,
      dueDate: dueDateState ? new Date(dueDateState).toISOString() : null,
    });
    setEditing(false);
  };

  const createdAtDate =
    typeof task.createdAt === "string"
      ? parseISO(task.createdAt)
      : task.createdAt;

  const dueDate = task.dueDate
    ? typeof task.dueDate === "string"
      ? parseISO(task.dueDate)
      : task.dueDate
    : null;

  const formatRelativeTime = (fromDate, toDate = new Date()) => {
    const minutes = differenceInMinutes(toDate, fromDate);
    if (minutes < 60) return `${minutes} 分鐘前`;

    const hours = differenceInHours(toDate, fromDate);
    if (hours < 24) return `${hours} 小時前`;

    const days = differenceInDays(toDate, fromDate);
    if (days < 365) return `${days} 天前`;

    const years = differenceInYears(toDate, fromDate);
    return `${years} 年前`;
  };

  const formatTimeUntil = (futureDate, now = new Date()) => {
    const minutes = differenceInMinutes(futureDate, now);
    if (minutes < 0) return `已過期 ${formatRelativeTime(futureDate, now)}`;

    if (minutes < 60) return `還有 ${minutes} 分鐘`;
    const hours = differenceInHours(futureDate, now);
    if (hours < 24) return `還有 ${hours} 小時`;
    const days = differenceInDays(futureDate, now);
    if (days < 365) return `還有 ${days} 天`;
    const years = differenceInYears(futureDate, now);
    return `還有 ${years} 年`;
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onDoubleClick={() => setEditing(true)}
          className={`border p-2 mb-2 rounded bg-white shadow ${
            task.completed ? "opacity-50 line-through" : ""
          }`}
        >
          {editing ? (
            <div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="輸入任務標題..."
                className="w-full mb-1 border rounded px-2 py-1"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="輸入描述內容..."
                className="w-full mb-1 border rounded px-2 py-1"
              />
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  到期時間
                </label>
                <input
                  type="datetime-local"
                  value={dueDateState}
                  onChange={(e) => setDueDateState(e.target.value)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  儲存
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-300 text-black px-2 py-1 rounded"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">{task.title}</h4>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) =>
                    updateTask(task.id, { completed: e.target.checked })
                  }
                />
              </div>
              {task.description && (
                <p className="text-sm text-gray-700">{task.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                加入時間：{formatRelativeTime(createdAtDate)}
              </p>

              {dueDate && (
                <p className="text-xs text-gray-500 mt-1">
                  Due: {format(dueDate, "yyyy/MM/dd HH:mm")}&nbsp;&nbsp;
                  {formatTimeUntil(dueDate)}
                </p>
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setEditing(true)}
                  className="p-2 rounded hover:bg-blue-100 active:scale-95 transition-transform"
                >
                  <Pencil size={16} className="text-blue-600" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded hover:bg-red-100 active:scale-95 transition-transform"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
