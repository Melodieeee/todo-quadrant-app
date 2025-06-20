import React, { useState, useRef } from "react";
import Task from "./components/Task";
import Quadrant from "./components/Quadrant";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import ResizableSplitPane from "./components/ResizableSplitPane";
import QuadrantGrid from "./components/QuadrantGrid";

const App = () => {
  const [tasks, setTasks] = useState([]);

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
      manualOrderIndex: tasks.length,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id, updatedFields) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const sortOptionsRef = useRef({
    IN: null,
    IU: null,
    NU: null,
    NN: null,
  });
  const [sortOptions, _setSortOptions] = useState(sortOptionsRef.current);
  const setSortOptions = (newOptions) => {
    sortOptionsRef.current = newOptions;
    _setSortOptions(newOptions);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const destId = destination.droppableId;
    const sourceId = source.droppableId;

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

    const reindexedTasks = sameListTasks.map((t, i) => ({
      ...t,
      manualOrderIndex: i,
    }));

    setTasks([...otherTasks, ...reindexedTasks]);

    if (sourceId !== destId || source.index !== destination.index) {
      setSortOptions({
        ...sortOptionsRef.current,
        [sourceId]: null,
        [destId]: null,
      });
    }
    console.log(tasks);
    console.log(sortOptionsRef.current);
  };

  const quadrantMeta = {
    IN: { title: "重要&不緊急", hint: "制定計劃", bgColor: "bg-blue-100" },
    IU: { title: "緊急&重要", hint: "優先解決", bgColor: "bg-red-100" },
    NU: { title: "緊急&不重要", hint: "給別人做", bgColor: "bg-yellow-100" },
    NN: { title: "不重要&不緊急", hint: "有空再做", bgColor: "bg-green-100" },
  };

  const renderQuadrant = (id) => {
    const meta = quadrantMeta[id];
    return (
      <Quadrant
        id={id}
        title={meta.title}
        hint={meta.hint}
        bgColor={meta.bgColor}
        tasks={tasks}
        updateTask={updateTask}
        deleteTask={deleteTask}
        sortOption={sortOptions[id]}
        setSortOption={(option) =>
          setSortOptions({ ...sortOptionsRef.current, [id]: option })
        }
      />
    );
  };

  const leftPanel = (
    <Droppable droppableId="inbox">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-white rounded-lg p-4 shadow overflow-y-auto"
          style={{ height: "100%" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Todo List</h2>
            <button
              onClick={addTask}
              className="no-expand text-[#fff7e6] bg-[#5c3a1e] hover:bg-[#935629] px-3 py-1 rounded"
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
  );

  const rightPanel = (
    <div className="w-full h-full">
      <QuadrantGrid renderQuadrant={renderQuadrant} />
    </div>
  );

  return (
    <div className="bg-gray-100 h-full w-screen m-0 p-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <ResizableSplitPane left={leftPanel} right={rightPanel} />
      </DragDropContext>
    </div>
  );
};

export default App;
