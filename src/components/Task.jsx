// Task.jsx
import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Pencil, Trash2 } from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";

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

  const createdAtDate = typeof task.createdAt === "string" ? parseISO(task.createdAt) : task.createdAt;
  const daysSinceCreated = differenceInDays(new Date(), createdAtDate);

  const dueDate = task.dueDate ? (typeof task.dueDate === "string" ? parseISO(task.dueDate) : task.dueDate) : null;
  const daysUntilDue = dueDate ? differenceInDays(dueDate, new Date()) : null;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`border p-2 mb-2 rounded bg-white shadow ${
            task.completed ? "opacity-50 line-through" : ""
          }`}
        >
          {editing ? (
            <div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-1 border rounded px-2 py-1"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-1 border rounded px-2 py-1"
              />
              <input
                type="datetime-local"
                value={dueDateState}
                onChange={(e) => setDueDateState(e.target.value)}
                className="w-full mb-1 border rounded px-2 py-1"
              />
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
              {task.description && <p className="text-sm text-gray-700">{task.description}</p>}
              <p className="text-xs text-gray-500 mt-1">
                    加入時間：{daysSinceCreated} 天前
              </p>
              {dueDate && (
                <p className="text-xs text-gray-500 mt-1">
                  Due: {new Date(dueDate).toLocaleString()}
                  還有{daysUntilDue >= 0 ? `${daysUntilDue} 天` : `已過期 ${Math.abs(daysUntilDue)} 天`}
                </p>
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setEditing(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  <Pencil size={16} className="text-blue-500 hover:text-blue-700" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  <Trash2 size={16} className="text-red-500 hover:text-red-700" />
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