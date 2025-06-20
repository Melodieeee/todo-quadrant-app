import React, { useState, useRef, useEffect } from "react";
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
  sortOption,
  setSortOption,
}) => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDue, setFilterDue] = useState("all");

  const [isSortHovered, setIsSortHovered] = useState(false);
  const [isFilterHovered, setIsFilterHovered] = useState(false);
  const sortTimeoutRef = useRef(null);
  const filterTimeoutRef = useRef(null);

  const applySort = (option) => {
    setSortOption(option);
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

  const quadrantTasks = tasks.filter((t) => t.list === id);
  const filteredTasks = filterTasks(quadrantTasks);

  const sortedTasks = [...filteredTasks].sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
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
          {/* Filter button */}
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(filterTimeoutRef.current);
              setIsFilterHovered(true);
            }}
            onMouseLeave={() => {
              filterTimeoutRef.current = setTimeout(() => {
                setIsFilterHovered(false);
              }, 100);
            }}
          >
            <button
              className="no-expand p-1 hover:bg-gray-200 rounded"
              title="篩選"
            >
              <FiFilter />
            </button>
            {isFilterHovered && (
              <div className="no-expand absolute right-0 z-20 bg-white border rounded shadow-md text-sm mt-1 min-w-[8rem]">
                <div className="px-4 pt-2 pb-1 font-semibold">完成狀態</div>
                {["all", "completed", "incomplete"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`block px-4 py-1 hover:bg-gray-100 w-full text-left ${
                      filterStatus === status ? "bg-gray-200" : ""
                    }`}
                  >
                    {status === "all"
                      ? "全部"
                      : status === "completed"
                      ? "已完成"
                      : "未完成"}
                  </button>
                ))}

                <div className="px-4 pt-2 pb-1 border-t font-semibold">
                  到期狀態
                </div>
                {["all", "overdue", "notOverdue"].map((due) => (
                  <button
                    key={due}
                    onClick={() => setFilterDue(due)}
                    className={`block px-4 py-1 hover:bg-gray-100 w-full text-left ${
                      filterDue === due ? "bg-gray-200" : ""
                    }`}
                  >
                    {due === "all"
                      ? "全部"
                      : due === "overdue"
                      ? "已到期"
                      : "未到期"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort button */}
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(sortTimeoutRef.current);
              setIsSortHovered(true);
            }}
            onMouseLeave={() => {
              sortTimeoutRef.current = setTimeout(() => {
                setIsSortHovered(false);
              }, 100);
            }}
          >
            <button
              className="no-expand p-1 hover:bg-gray-200 rounded"
              title="排序"
            >
              <MdSort />
            </button>
            {isSortHovered && (
              <div className="no-expand absolute right-0 z-20 bg-white border rounded shadow-md text-sm mt-1 min-w-[10rem]">
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
            className="overflow-y-auto h-full"
          >
            {sortedTasks.map((task, index) => (
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
