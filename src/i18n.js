import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
          // list
          todoList: "Todo List",
          IU: "Urgent & Important",
          IN: "Important & Not Urgent",
          NU: "Urgent & Not Important",
          NN: "Not Important & Not Urgent",
          // quadrant actions
          makePlan: "Make a Plan",
          prioritize: "Prioritize First",
          findOneDo: "Delegate to Others",
          doWhenFree: "Do When Free",
          // add task
          addTask: "Add a Task",
          newTask: "New Task",
          join: "Joined",
          due: "Due",
          title: "Title",
          enterTitle: "Enter task title",
          description: "Description",
          enterDescription: "Enter task description",
          dueTime: "Due Time",
          save: "Save",
          cancel: "Cancel",
          // inbox btn
          settings: "Settings",
          language: "Language",
          // quadrant btn
          filter: "Filter",
          sort: "Sort",
          // filter options
          completion: "Completion",
          all: "All",
          completed: "Completed",
          incomplete: "Incomplete",
          dueOrNot: "Due Status",
          overdue: "Overdue",
          notOverdue: "Not Overdue",
          // sort options
          sortBy: "Sort By",
          joinTimeNewToOld: "Joined: New → Old",
          joinTimeOldToNew: "Joined: Old → New",
          dueTimeNewToOld: "Due Date: New → Old",
          dueTimeOldToNew: "Due Date: Old → New",
          // drag line
          dragToResize: "Drag to resize",
          todoListDragToExpand: "Drag to expand Todo List",
          quadrantDragToExpand: "Drag to expand Quadrants",
          todoListCollapsed: "Todo List is collapsed",
          quadrantCollapsed: "Quadrants are collapsed",
        },
    },      
    zh: {
        translation: {
            // list
            todoList: "待辦清單",
            IU: "緊急 & 重要",
            IN: "重要 & 不緊急",
            NU: "緊急 & 不重要",
            NN: "不重要 & 不緊急",
            // quadrant actions
            makePlan: "制定計劃", 
            prioritize: "優先解決", 
            findOneDo: "給別人做",
            doWhenFree: "有空再做",
            //add task
            addTask: "新增任務",
            newTask: "新任務",
            join: "加入",
            due: "截止",
            title: "標題",
            enterTitle: "輸入任務標題",
            description: "描述",
            enterDescription: "輸入任務描述",
            dueTime: "截止時間",
            save: "儲存",
            cancel: "取消",
            //inbox btn
            settings: "設定",
            language: "語言",
            //quadrant btn
            filter: "篩選",
            sort: "排序",
            //filter options
            completion: "完成狀態",
            all: "全部",
            completed: "已完成",
            incomplete: "未完成",
            dueOrNot: "截止狀態",
            overdue: "已到期",
            notOverdue: "未到期",
            // sort options
            sortBy: "排序方式",
            joinTimeNewToOld: "加入時間：新 → 舊",
            joinTimeOldToNew: "加入時間：舊 → 新",
            dueTimeNewToOld: "到期時間：新 → 舊",
            dueTimeOldToNew: "到期時間：舊 → 新",
            // drag line
            dragToResize: "拖動來調整大小",
            todoListDragToExpand: "拖動來展開待辦清單",
            quadrantDragToExpand: "拖動來展開象限",
            todoListCollapsed: "待辦清單已折疊",
            quadrantCollapsed: "象限已折疊",
        },
    },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;