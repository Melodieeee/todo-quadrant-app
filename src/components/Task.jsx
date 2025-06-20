import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import TooltipToggle from "./TooltipToggle";

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

  const createdAt =
    typeof task.createdAt === "string"
      ? parseISO(task.createdAt)
      : task.createdAt;
  const dueDate = task.dueDate
    ? typeof task.dueDate === "string"
      ? parseISO(task.dueDate)
      : task.dueDate
    : null;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) =>
        snapshot.isDragging ? (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="no-expand border p-3 mb-2 rounded bg-white shadow"
          >
            {task.title}
          </div>
        ) : (
          <motion.div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`no-expand border p-3 mb-2 rounded bg-white shadow ${
              task.completed ? "opacity-50" : ""
            }`}
            onDoubleClick={(e) => {
              const tag = e.target.tagName.toLowerCase();
              if (
                !["input", "textarea", "button", "svg", "path"].includes(tag)
              ) {
                setEditing(true);
                e.stopPropagation();
              }
            }}
            layout
          >
            <AnimatePresence mode="wait">
              {editing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  onDoubleClick={(e) => {
                    const tag = e.target.tagName.toLowerCase();
                    if (
                      !["input", "textarea", "button", "svg", "path"].includes(
                        tag
                      )
                    ) {
                      handleSave();
                      e.stopPropagation();
                    }
                  }}
                >
                  <label className="block text-sm font-semibold mb-1">標題</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mb-2 border rounded px-2 py-1"
                    placeholder="輸入任務標題"
                  />
                  <label className="block text-sm font-semibold mb-1">描述</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mb-2 border rounded px-2 py-1"
                    placeholder="輸入任務描述"
                  />
                  <label className="block text-sm font-semibold mb-1">到期時間</label>
                  <input
                    type="datetime-local"
                    value={dueDateState}
                    onChange={(e) => setDueDateState(e.target.value)}
                    className="w-full mb-2 border rounded px-2 py-1"
                  />
                  <div className="flex justify-between mt-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={handleSave}
                      className="bg-green-400 text-white px-3 py-1 rounded"
                    >
                      儲存
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setEditing(false)}
                      className="bg-gray-300 text-black px-3 py-1 rounded"
                    >
                      取消
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-center">
                    <h4
                      className={`font-semibold text-base ${
                        task.completed ? "line-through" : ""
                      }`}
                    >
                      {task.title}
                    </h4>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) =>
                        updateTask(task.id, { completed: e.target.checked })
                      }
                    />
                  </div>

                  {task.description && (
                    <div
                      className={`text-sm text-gray-700 mt-1 ${
                        task.completed ? "line-through" : ""
                      }`}
                    >
                      {task.description}
                    </div>
                  )}

                  <div
                    className={`text-xs text-gray-500 mt-1 ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    <span>Join：</span>
                    <TooltipToggle
                      defaultValue={formatDistanceToNow(createdAt, {
                        addSuffix: true,
                      })}
                      tooltip={createdAt.toLocaleString()}
                      className={
                        task.completed ? "line-through text-gray-500" : ""
                      }
                    />
                  </div>

                  {dueDate && (
                    <div
                      className={`text-xs text-gray-500 mt-1 ${
                        task.completed ? "line-through" : ""
                      }`}
                    >
                      <span>Due：</span>
                      <TooltipToggle
                        defaultValue={formatDistanceToNow(dueDate, {
                          addSuffix: true,
                        })}
                        tooltip={dueDate.toLocaleString()}
                        className={
                          task.completed ? "line-through text-gray-500" : ""
                        }
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2 mt-2">
                    <motion.button
                      onClick={() => setEditing(true)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Pencil
                        size={18}
                        className="text-blue-500 hover:text-blue-700"
                      />
                    </motion.button>
                    <motion.button
                      onClick={() => deleteTask(task.id)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2
                        size={18}
                        className="text-red-500 hover:text-red-700"
                      />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      }
    </Draggable>
  );
};

export default Task;
