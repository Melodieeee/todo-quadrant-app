import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import Task from "./Task";
import Tooltip from "./Tooltip";
import { MdSort } from "react-icons/md";
import { FiFilter } from "react-icons/fi";

const Quadrant = ({
  id,
  title,
  hint,
  bgColor,
  tasks,
  updateTask,
  deleteTask,
}) => {
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDue, setFilterDue] = useState("all");

  const toggleSortMenu = () => setSortMenuOpen((prev) => !prev);
  const toggleFilterMenu = () => setFilterMenuOpen((prev) => !prev);

  const applySort = (option) => {
    setSortOption(option);
    setSortMenuOpen(false);
  };

  const filterTasks = (taskList) => {
    let filtered = taskList;

    if (filterStatus === "completed") {
      filtered = filtered.filter((t) => t.completed);
    } else if (filterStatus === "incomplete") {
      filtered = filtered.filter((t) => !t.completed);
    }

    const now = new Date();

    if (filterDue === "overdue") {
      filtered = filtered.filter((t) => t.dueDate && new Date(t.dueDate) < now);
    } else if (filterDue === "notOverdue") {
      filtered = filtered.filter(
        (t) => !t.dueDate || new Date(t.dueDate) >= now
      );
    }

    return filtered;
  };

  const sortTasks = (taskList) => {
    const sorted = [...taskList];
    switch (sortOption) {
      case "createdNewFirst":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "createdOldFirst":
        return sorted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "dueSoon":
        return sorted.sort(
          (a, b) =>
            new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity)
        );
      case "dueLater":
        return sorted.sort(
          (a, b) => new Date(b.dueDate || 0) - new Date(a.dueDate || 0)
        );
      default:
        return sorted.sort(
          (a, b) => a.manualOrderIndex - b.manualOrderIndex || 0
        );
    }
  };

  const quadrantTasks = sortTasks(
    filterTasks(tasks.filter((t) => t.list === id))
  );

  return (
    <div
      className={`rounded-lg p-4 shadow ${bgColor} flex flex-col relative h-full`}
    >
      <div className="flex justify-between items-center mb-2 relative">
        <Tooltip content={hint}>
          <h3 className="text-xl font-semibold">{title}</h3>
        </Tooltip>
        <div className="flex gap-2">
          <div className="relative">
            <button
              className="no-expand p-1 hover:bg-gray-200 rounded"
              onClick={toggleFilterMenu}
              title="篩選"
            >
              <FiFilter />
            </button>
            {filterMenuOpen && (
              <div className="absolute right-0 z-20 bg-white border rounded shadow-md text-sm mt-1 w-48">
                <div className="px-4 py-2 border-b font-semibold">完成狀態</div>
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`block px-4 py-1 hover:bg-gray-100 w-full text-left ${
                    filterStatus === "all" ? "bg-gray-200 font-semibold" : ""
                  }`}
                >
                  全部
                </button>

                <button
                  onClick={() => setFilterStatus("completed")}
                  className="block px-4 py-1 hover:bg-gray-100 w-full text-left"
                >
                  已完成
                </button>
                <button
                  onClick={() => setFilterStatus("incomplete")}
                  className="block px-4 py-1 hover:bg-gray-100 w-full text-left"
                >
                  未完成
                </button>
                <div className="px-4 py-2 border-t font-semibold">到期狀態</div>
                <button
                  onClick={() => setFilterDue("all")}
                  className="block px-4 py-1 hover:bg-gray-100 w-full text-left"
                >
                  全部
                </button>
                <button
                  onClick={() => setFilterDue("overdue")}
                  className="block px-4 py-1 hover:bg-gray-100 w-full text-left"
                >
                  已到期
                </button>
                <button
                  onClick={() => setFilterDue("notOverdue")}
                  className="block px-4 py-1 hover:bg-gray-100 w-full text-left"
                >
                  未到期
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              className="no-expand p-1 hover:bg-gray-200 rounded"
              onClick={toggleSortMenu}
              title="排序"
            >
              <MdSort />
            </button>
            {sortMenuOpen && (
              <div className="absolute right-0 z-20 bg-white border rounded shadow-md text-sm mt-1">
                <button
                  onClick={() => applySort("createdNewFirst")}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  加入時間：新 → 舊
                </button>
                <button
                  onClick={() => applySort("createdOldFirst")}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  加入時間：舊 → 新
                </button>
                <button
                  onClick={() => applySort("dueSoon")}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  到期時間：近 → 遠
                </button>
                <button
                  onClick={() => applySort("dueLater")}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  到期時間：遠 → 近
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="overflow h-full"
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
