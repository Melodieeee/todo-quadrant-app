// App.jsx
import React, { useState, useRef } from "react";
import Task from "./components/Task";
import Quadrant from "./components/Quadrant";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import ResizableSplitPane from "./components/ResizableSplitPane";
import QuadrantGrid from "./components/QuadrantGrid";

const App = () => {
  const [tasks, setTasks] = useState([]);

  const [sortOptions, _setSortOptions] = useState({
    IN: null,
    IU: null,
    NU: null,
    NN: null,
  });
  const sortOptionsRef = useRef(sortOptions);
  const setSortOptions = (newOptions) => {
    sortOptionsRef.current = newOptions;
    _setSortOptions(newOptions);
  };

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
      orderIndex: tasks.filter(t => t.list === "inbox").length,
      movedToQuadrantAt: null,
    };
    setTasks((prev) => [...prev, newTask]);
    // print add for debugging
    console.log("Added Task:", newTask.title, "Order Index:", newTask.orderIndex);
    // print tasks title and orderIndex for debugging
    console.log("Tasks:", tasks.map(t => ({ title: t.title, orderIndex: t.orderIndex })));
  };

  const updateTask = (id, updatedFields) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updatedFields } : task))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateOrderIndices = (taskList, listId) => {
    return taskList.map((task, index) => ({
      ...task,
      orderIndex: listId === task.list ? index : task.orderIndex,
    }));
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
  
    const destId = destination.droppableId;
    const sourceId = source.droppableId;
    if (!destId || !sourceId) return;
  
    const draggedTask = tasks.find((t) => t.id === draggableId);
    if (!draggedTask) return;
  
    const filteredTasks = tasks.filter((t) => t.id !== draggableId);
    const sameListTasks = filteredTasks.filter((t) => t.list === destId);
    const otherTasks = filteredTasks.filter((t) => t.list !== destId);
  
    let updatedTask = { ...draggedTask };
  
    // 是否跨 quadrant
    const movedToNewList = sourceId !== destId;
  
    if (movedToNewList) {
      updatedTask = {
        ...updatedTask,
        list: destId,
        important: destId === "IU" || destId === "IN",
        urgent: destId === "IU" || destId === "NU",
        movedToQuadrantAt: destId === "inbox" ? null : new Date().toISOString(),
      };
    }
  
    // 插入新的位置
    sameListTasks.splice(destination.index, 0, updatedTask);
  
    // 重新建立該 quadrant 的排序
    const reindexed = sameListTasks.map((t, i) => ({
      ...t,
      orderIndex: i,
    }));
  
    setTasks([...otherTasks, ...reindexed]);
  
    // 若跨 quadrant，清除排序條件
    if (movedToNewList) {
      setSortOptions((prev) => ({
        ...prev,
        [sourceId]: null,
        [destId]: null,
      }));
    }
    // print sort options for debugging
    console.log("Sort Options:", sortOptions);
    // print tasks title and orderIndex for debugging
    console.log("Tasks:", tasks.map(t => ({ title: t.title, orderIndex: t.orderIndex })));
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
        key={id}
        id={id}
        title={meta.title}
        hint={meta.hint}
        bgColor={meta.bgColor}
        tasks={tasks}
        updateTask={updateTask}
        deleteTask={deleteTask}
        sortOption={sortOptions[id]}
        setSortOption={(option) => {
          const quadrantTasks = tasks.filter((t) => t.list === id);
          let sorted;
          switch (option) {
            case "createdNewFirst":
              sorted = [...quadrantTasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              break;
            case "createdOldFirst":
              sorted = [...quadrantTasks].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
              break;
            case "dueSoon":
              sorted = [...quadrantTasks].sort((a, b) => new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity));
              break;
            case "dueLater":
              sorted = [...quadrantTasks].sort((a, b) => new Date(b.dueDate || 0) - new Date(a.dueDate || 0));
              break;
            default:
              sorted = quadrantTasks;
              break;
          }
          const updated = updateOrderIndices(sorted, id);
          setTasks((prev) => [
            ...prev.filter((t) => t.list !== id),
            ...updated,
          ]);
          setSortOptions({ ...sortOptionsRef.current, [id]: option });
          // print sort option
          console.log(`Sort option for ${id}:`, option);
          // print tasks title and orderIndex for debugging
          console.log("Tasks after sorting:", updated.map(t => ({ title: t.title, orderIndex: t.orderIndex })));

        }}
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
            .sort((a, b) => a.orderIndex - b.orderIndex)
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
