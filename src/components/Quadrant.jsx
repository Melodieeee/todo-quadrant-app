// Quadrant.jsx
import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import Task from "./Task";

const Quadrant = ({ id, title, bgColor, tasks, updateTask, deleteTask, onSort }) => {
  const quadrantTasks = tasks
    .filter((t) => t.list === id)
    .sort((a, b) => a.manualOrderIndex - b.manualOrderIndex || 0);

  return (
    <div className={`rounded-lg p-4 shadow ${bgColor} flex flex-col overflow-hidden`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <button
          onClick={onSort}
          className="text-sm px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded"
        >
          排序
        </button>
      </div>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="overflow-y-auto h-full"
          >
            {quadrantTasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Quadrant;