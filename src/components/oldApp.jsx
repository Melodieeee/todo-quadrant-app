// App.jsx
import React, { useState, useRef, useEffect } from "react";
import Task from "./components/Task";
import Quadrant from "./components/Quadrant";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import ResizableSplitPane from "./components/ResizableSplitPane";
import QuadrantGrid from "./components/QuadrantGrid";
import SettingsDropdown from "./components/SettingsDropdown";
import { FiPlusCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const App = () => {

    // 取得登入使用者
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/user/info", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  // 初始化任務列表
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetch("/api/tasks/user")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
      });
  }, []);
  

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

  const { t, i18n } = useTranslation();
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  const addTask = () => {
    const newTask = {
      id: uuidv4(),
      title: t("newTask"),
      description: "",
      important: null,
      urgent: null,
      createdAt: new Date().toISOString(),
      dueDate: null,
      completed: false,
      list: "inbox",
      orderIndex: tasks.filter((t) => t.list === "inbox").length,
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
        important: destId === "inbox" ? null : (destId === "IU" || destId === "IN"),
        urgent: destId === "inbox" ? null : (destId === "IU" || destId === "NU"),
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
  };

  const quadrantMeta = {
    IN: { title: t("IN"), hint: t("makePlan"), bgColor: "bg-blue-100" },
    IU: { title: t("IU"), hint: t("prioritize"), bgColor: "bg-pink-100" },
    NU: { title: t("NU"), hint: t("findOneDo"), bgColor: "bg-yellow-100" },
    NN: { title: t("NN"), hint: t("doWhenFree"), bgColor: "bg-green-100" },
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
        setSortOption={(option) => {
          const quadrantTasks = tasks.filter((t) => t.list === id);
          let sorted;
          switch (option) {
            case "createdNewFirst":
              sorted = [...quadrantTasks].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
              break;
            case "createdOldFirst":
              sorted = [...quadrantTasks].sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
              );
              break;
            case "dueSoon":
              sorted = [...quadrantTasks].sort(
                (a, b) =>
                  new Date(a.dueDate || Infinity) -
                  new Date(b.dueDate || Infinity)
              );
              break;
            case "dueLater":
              sorted = [...quadrantTasks].sort(
                (a, b) => new Date(b.dueDate || 0) - new Date(a.dueDate || 0)
              );
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
            <h2 className="text-2xl font-bold">{t("todoList")}</h2>
            <div className="flex items-center space-x-3">
              <SettingsDropdown
                language={i18n.language}
                setLanguage={changeLanguage}
                user={user}
              />
              <button
                title={t("addTask")}
                onClick={addTask}
                className="no-expand p-1 rounded text-gray-700 hover:text-gray-400 transition-colors duration-200"
              >
                <FiPlusCircle />
              </button>
            </div>
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
    <div className="bg-gray-100 h-screen w-screen m-0 p-6 overflow-hidden">
      <DragDropContext onDragEnd={onDragEnd}>
        <ResizableSplitPane left={leftPanel} right={rightPanel} />
      </DragDropContext>
    </div>
  );
};

export default App;