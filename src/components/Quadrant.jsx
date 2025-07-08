import React, { useState, useRef } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Task from './Task';
import Tooltip from './Tooltip';
import { MdSort } from 'react-icons/md';
import { FiFilter } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const Quadrant = ({
  id,
  title,
  hint,
  bgColor,
  quadrantTasks,
  updateTask,
  deleteTask,
  setSortOption,
}) => {
  const { t } = useTranslation();

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDue, setFilterDue] = useState('all');

  const [isSortHovered, setIsSortHovered] = useState(false);
  const [isFilterHovered, setIsFilterHovered] = useState(false);
  const sortTimeoutRef = useRef(null);
  const filterTimeoutRef = useRef(null);

  const filterTasks = (taskList) => {
    let filtered = taskList;

    if (filterStatus === 'completed') {
      filtered = filtered.filter((t) => t.completed);
    } else if (filterStatus === 'incomplete') {
      filtered = filtered.filter((t) => !t.completed);
    }

    const now = new Date();

    if (filterDue === 'overdue') {
      filtered = filtered.filter((t) => t.dueDate && new Date(t.dueDate) < now);
    } else if (filterDue === 'notOverdue') {
      filtered = filtered.filter((t) => !t.dueDate || new Date(t.dueDate) >= now);
    }

    return filtered;
  };

  //const quadrantTasks = tasks.filter((t) => t.list === id);
  const filteredTasks = filterTasks(quadrantTasks);

  const sortedTasks = [...filteredTasks].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  return (
    <div className={`rounded-lg p-4 shadow ${bgColor} flex flex-col relative h-full`}>
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
              className="no-expand p-1 text-gray-700 hover:text-orange-400 transition-colors duration-200 rounded"
              title={t('filter')}
            >
              <FiFilter />
            </button>
            {isFilterHovered && (
              <div className="no-expand absolute right-0 z-20 bg-[#fff7e6] text-[#5c3a1e] rounded shadow-md text-sm mt-1 min-w-[8rem]">
                <div className="px-4 pt-2 pb-1 font-semibold">{t('completion')}</div>
                {['all', 'completed', 'incomplete'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`block px-4 py-1 hover:bg-yellow-100 w-full text-left ${
                      filterStatus === status ? 'bg-yellow-200' : ''
                    }`}
                  >
                    {t(status)}
                  </button>
                ))}

                <div className="px-4 pt-2 pb-1 border-t font-semibold">{t('dueOrNot')}</div>
                {['all', 'overdue', 'notOverdue'].map((due) => (
                  <button
                    key={due}
                    onClick={() => setFilterDue(due)}
                    className={`block px-4 py-1 hover:bg-yellow-100 w-full text-left ${
                      filterDue === due ? 'bg-yellow-200' : ''
                    }`}
                  >
                    {t(due)}
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
              className="no-expand p-1 text-gray-700 hover:text-orange-400 transition-colors duration-200 rounded"
              title={t('sort')}
            >
              <MdSort />
            </button>
            {isSortHovered && (
              <div className="no-expand absolute right-0 z-20 bg-[#fff7e6] text-[#5c3a1e] rounded shadow-md text-sm mt-1 min-w-[10rem]">
                <button
                  onClick={() => setSortOption('createdNewFirst')}
                  className="block px-4 py-2 hover:bg-yellow-100 w-full text-left"
                >
                  {t('joinTimeNewToOld')}
                </button>
                <button
                  onClick={() => setSortOption('createdOldFirst')}
                  className="block px-4 py-2 hover:bg-yellow-100 w-full text-left"
                >
                  {t('joinTimeOldToNew')}
                </button>
                <button
                  onClick={() => setSortOption('dueSoon')}
                  className="block px-4 py-2 hover:bg-yellow-100 w-full text-left"
                >
                  {t('dueTimeNewToOld')}
                </button>
                <button
                  onClick={() => setSortOption('dueLater')}
                  className="block px-4 py-2 hover:bg-yellow-100 w-full text-left"
                >
                  {t('dueTimeOldToNew')}
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
