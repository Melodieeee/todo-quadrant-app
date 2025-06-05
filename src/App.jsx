// App.jsx
import React, { useState } from "react";
import Task from "./components/Task";
import Quadrant from "./components/Quadrant";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [sortStates, setSortStates] = useState({});

  const addTask = () => {
    const newTask = {
      id: uuidv4(),
      title: "New Task",
      description: "",
      important: false,
      urgent: false,
      createdAt: new Date().toISOString(),
      dueDate: null,
      completed: false,
      list: "inbox",
      movedToQuadrantAt: null,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id, updatedFields) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updatedFields } : task))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    const draggedTask = tasks.find((t) => t.id === draggableId);
    if (!draggedTask) return;

    const updatedTask = {
      ...draggedTask,
      list: destId,
      important: destId === "IU" || destId === "IN",
      urgent: destId === "IU" || destId === "NU",
      movedToQuadrantAt: destId === "inbox" ? null : new Date().toISOString(),
    };

    const filteredTasks = tasks.filter((t) => t.id !== draggableId);
    const sameListTasks = filteredTasks.filter((t) => t.list === destId);
    const otherTasks = filteredTasks.filter((t) => t.list !== destId);

    sameListTasks.splice(destination.index, 0, updatedTask);

    setTasks([...otherTasks, ...sameListTasks]);
  };

  const handleSortByQuadrantTime = (listId) => {
    const quadrantTasks = tasks.filter((t) => t.list === listId);
    const sorted = [...quadrantTasks].sort(
      (a, b) => new Date(b.movedToQuadrantAt) - new Date(a.movedToQuadrantAt)
    );
    const otherTasks = tasks.filter((t) => t.list !== listId);
    setTasks([...otherTasks, ...sorted]);
    setSortStates((prev) => ({ ...prev, [listId]: !prev[listId] }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-screen p-4 gap-4 bg-gray-100">
        {/* Left task inbox */}
        <Droppable droppableId="inbox">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="w-3/12 bg-white rounded-lg p-4 shadow overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Todo List</h2>
                <button
                  onClick={addTask}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  +
                </button>
              </div>
              {tasks
                .filter((t) => t.list === "inbox")
                .map((task, index) => (
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

        {/* Right quadrants */}
        <div className="w-9/12 grid grid-cols-2 grid-rows-2 gap-4">
          {[
            { id: "IN", title: "重要&不緊急", color: "bg-blue-100" },
            { id: "IU", title: "緊急&重要", color: "bg-red-100" },
            { id: "NN", title: "不重要&不緊急", color: "bg-green-100" },
            { id: "NU", title: "緊急&不重要", color: "bg-yellow-100" },
          ].map((q) => (
            <Quadrant
              key={q.id}
              id={q.id}
              title={q.title}
              bgColor={q.color}
              tasks={tasks}
              updateTask={updateTask}
              deleteTask={deleteTask}
              onSort={() => handleSortByQuadrantTime(q.id)}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default App;
