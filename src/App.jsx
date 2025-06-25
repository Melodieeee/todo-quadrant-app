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
import LocalTaskWarningModal from "./components/LocalTaskWarningModal";
import MergeLocalTasksModal from "./components/MergeLocalTasksModal";

const getListId = (task) => {
  if (task.important === true && task.urgent === true) return "IU";
  if (task.important === true && task.urgent === false) return "IN";
  if (task.important === false && task.urgent === true) return "NU";
  if (task.important === false && task.urgent === false) return "NN";
  return "inbox";
};

const toSerializableTask = (task) => ({
  ...task,
  dueDate: task.dueDate instanceof Date ? task.dueDate.toISOString() : task.dueDate,
  createdAt: task.createdAt instanceof Date ? task.createdAt.toISOString() : task.createdAt,
});

const App = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showLocalWarning, setShowLocalWarning] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);

  const [sortOptions, _setSortOptions] = useState({
    IN: null, IU: null, NU: null, NN: null,
  });
  const sortOptionsRef = useRef(sortOptions);
  const setSortOptions = (newOptions) => {
    sortOptionsRef.current = newOptions;
    _setSortOptions(newOptions);
  };
  const { t, i18n } = useTranslation();
  const hasShownLocalWarning = useRef(false);

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

  useEffect(() => {
    fetch("/api/user/info", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!user) return;

    const savedLocal = localStorage.getItem("localTasks");
    const parsed = savedLocal ? JSON.parse(savedLocal) : [];
  
    if (parsed.length > 0) {
      console.log("Local tasks detected, prompting merge.");
      setTasks(parsed);
      setShowMergeModal(true);
    } else {
      fetchServerTasks();
    }
  }, [user]);
  
  const fetchServerTasks = () => {
    fetch("/api/tasks/user", { credentials: "include" })
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Fetch failed:", err));
  };

  const confirmMergeTasks = async () => {
    localStorage.removeItem("localTasks");
    let remoteTasks = [];
    try {
      const res = await fetch("/api/tasks/user", { credentials: "include" });
      if (!res.ok) throw new Error("Fetch failed");
      remoteTasks = await res.json();
    } catch (err) {
      console.error("Failed to fetch remote tasks:", err);
      return;
    }

    const maxOrderMap = {};
    for (const task of remoteTasks) {
      const listId = getListId(task);
      maxOrderMap[listId] = Math.max(maxOrderMap[listId] ?? -1, task.orderIndex ?? -1);
    }

    const tasksToPost = tasks.map((task) => {
      const listId = getListId(task);
      const newOrder = (maxOrderMap[listId] ?? -1) + 1;
      maxOrderMap[listId] = newOrder;
      return { ...task, orderIndex: newOrder };
    });

    for (const task of tasksToPost) {
      try {
        await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(toSerializableTask(task)),
        });
      } catch (err) {
        console.error("Post task failed:", err);
      }
    }

    fetchServerTasks();
    setShowMergeModal(false);
  };

  const skipMergeTasks = () => {
    localStorage.removeItem("localTasks");
    fetchServerTasks();
    setShowMergeModal(false);
  };

  const addTask = async () => {
    const inboxTasks = tasks.filter((t) => getListId(t) === "inbox");
    const tempId = uuidv4();
    const baseTask = {
      id: tempId,
      title: t("newTask"),
      description: "",
      important: null,
      urgent: null,
      dueDate: null,
      completed: false,
      createdAt: new Date().toISOString(),
      orderIndex: inboxTasks.length,
    };

    if (!user && !hasShownLocalWarning.current) {
      setShowLocalWarning(true);
      hasShownLocalWarning.current = true;
    }
    
    if (user) {
      try {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(baseTask),
        });
        if (!res.ok) throw new Error("Failed to create task");
        const savedTask = await res.json();
        setTasks((prev) => [...prev, savedTask]);
        return;
      } catch (err) {
        console.error("Backend task creation failed:", err);
      }
    }

    setTasks((prev) => [...prev, baseTask]);
    console.log("Local task created:", baseTask);
  };

  const updateTask = async (id, updatedFields) => {
    setTasks((prev) => {
      const updatedList = prev.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
      );
      const updatedTask = updatedList.find((t) => t.id === id);

      if (user && updatedTask) {
        fetch(`/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(toSerializableTask(updatedTask)),
        }).catch((err) => console.error("Update task failed:", err));
      }

      return updatedList;
    });
  };

  const deleteTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (user) {
      try {
        await fetch(`/api/tasks/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
      } catch (err) {
        console.error("Delete task failed:", err);
      }
    }
  };

  const updateOrderIndices = (taskList) =>
    taskList.map((task, index) => ({ ...task, orderIndex: index }));

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const draggedTask = tasks.find((t) => t.id === draggableId);
    if (!draggedTask) return;

    const destId = destination.droppableId;
    const sourceId = source.droppableId;
    const movedToNewList = destId !== sourceId;

    let updatedTask = { ...draggedTask };
    if (movedToNewList) {
      if (destId === "inbox") {
        updatedTask.important = null;
        updatedTask.urgent = null;
      } else {
        updatedTask.important = ["IU", "IN"].includes(destId);
        updatedTask.urgent = ["IU", "NU"].includes(destId);
      }
    }

    const filtered = tasks.filter((t) => t.id !== draggedTask.id);
    const sameListTasks = filtered.filter((t) => getListId(t) === destId);
    const otherTasks = filtered.filter((t) => getListId(t) !== destId);

    sameListTasks.splice(destination.index, 0, updatedTask);
    const reindexed = updateOrderIndices(sameListTasks);

    setTasks([...otherTasks, ...reindexed]);

    reindexed.forEach((task) => {
      updateTask(task.id, {
        orderIndex: task.orderIndex,
        important: task.important,
        urgent: task.urgent,
      });
    });
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
        quadrantTasks={tasks.filter((t) => getListId(t) === id)}
        updateTask={updateTask}
        deleteTask={deleteTask}
        setSortOption={(option) => {
          const quadrantTasks = tasks.filter((t) => getListId(t) === id);
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
          const updated = updateOrderIndices(sorted);
          setTasks((prev) => [
            ...prev.filter((t) => getListId(t) !== id),
            ...updated,
          ]);
          updated.forEach((task) =>
            updateTask(task.id, {
              orderIndex: task.orderIndex,
            })
          );
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
                onLogin={() => {
                  localStorage.setItem("localTasks", JSON.stringify(tasks));
                  window.location.href = "/oauth2/authorization/google";
                }}
              />
              <button
                title={t("addTask")}
                onClick={addTask}
                className="no-expand p-1 rounded text-gray-700 hover:text-orange-400 transition-colors duration-200"
              >
                <FiPlusCircle />
              </button>
            </div>
          </div>
          {tasks
            .filter((t) => getListId(t) === "inbox")
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((task, index) => (
              <Task
                key={task.id || `fallback-${index}`}
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
    <>
      {showLocalWarning && (
        <LocalTaskWarningModal
          onClose={() => setShowLocalWarning(false)}
          onLogin={() => {
            window.location.href = "/oauth2/authorization/google";
          }}
        />
      )}
      {showMergeModal && (
        <MergeLocalTasksModal
          onConfirmMerge={confirmMergeTasks}
          onSkipMerge={skipMergeTasks}
        />
      )}
      <div className="bg-gray-100 h-screen w-screen m-0 p-6 overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <ResizableSplitPane left={leftPanel} right={rightPanel} />
        </DragDropContext>
      </div>
    </>
  );
};

export default App;