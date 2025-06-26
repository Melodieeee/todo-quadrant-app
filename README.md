# Quadrant Task Manager

> A productivity-focused **Eisenhower Matrix** style to-do list web app.

![Screenshot of the App](./screenshots/overview.png)

## 📌 Overview

This is a web-based **Quadrant To-Do List** app that helps you manage your tasks using the **Eisenhower Matrix** (a 2x2 quadrant system that categorizes tasks by importance and urgency).

### ✅ Benefits of Using the Quadrant System

The Eisenhower Matrix helps you:

* Focus on what truly matters
* Reduce time spent on distractions
* Improve long-term planning by separating **Important** from **Urgent**

## 🛠️ Tech Stack

* **Frontend**: React, Tailwind CSS, React DnD, i18next, Vite
* **Backend**: Java + Spring Boot
* **Authentication**: Google OAuth2
* **Database**: MongoDB Atlas
* **Deployment**:

  * Frontend: [Vercel](https://vercel.com/)
  * Backend: [Render](https://render.com/)

## 🔐 Usage

* You can use the app **without logging in** — tasks are stored locally.
* Or you can **log in via Google**, and your tasks will be saved in the cloud.

## 🧩 Features

* Five task sections:

  * Inbox (unclassified)
  * Important + Urgent
  * Important + Not Urgent
  * Not Important + Urgent
  * Not Important + Not Urgent
* Fully **draggable/resizable** quadrant layout
* **Double-click a quadrant** to expand and focus
* **Double-click a task** to edit; double-click again to save
* **Drag-and-drop** tasks across quadrants
* Supports **sorting and filtering** by due date, creation time, or completion

## 📸 Screenshots

### 🔲 Main View

![Main Quadrant View](./src/assets/main.png)

### ✏️ Task Editing

![Task Editing](./src/assets/taskEditing.png)

### 🔄 Merge Prompt on Login

![Merge Prompt](./src/assets/mergeWarning.png)

## 開發指南

```bash
# 安裝相關套件
npm install

# 啟動開發服務器
npm run dev
```

需要 `.env`檔：

```
VITE_API_BASE_URL=https://todo-quadrant-app-back.onrender.com
```


---

# 四象限任務管理器

> 一個基於 **艾森豪矩陣 (Eisenhower Matrix)** 的待辦事項管理應用

![應用程式畫面截圖](./screenshots/overview.png)

## 📌 概覽

這是一個基於網頁的 **四象限 To-Do List 應用程式**，使用艾森豪矩陣的原則，協助你分類與管理代辦事項。

### ✅ 使用四象限系統的好處

艾森豪矩陣能幫助你：

* 專注在真正重要的事情上
* 減少時間浪費在瑣碎任務
* 長遠規劃與決策更加清晰

## 🛠️ 技術堆疊

* **前端**：React、Tailwind CSS、React DnD、i18next、Vite
* **後端**：Java + Spring Boot
* **登入機制**：Google OAuth2
* **資料庫**：MongoDB Atlas
* **部署平台**：

  * 前端： [Vercel](https://vercel.com/)
  * 後端： [Render](https://render.com/)

## 🔐 使用方式

* 不登入：資料只會儲存在本機瀏覽器中
* 登入 Google 帳號後：可將任務儲存至雲端

## 🧩 功能特色

* 共五個區塊：

  * 收件匣（未分類）
  * 重要且緊急
  * 重要但不緊急
  * 不重要但緊急
  * 不重要也不緊急
* 任務可自由拖拉移動、雙擊編輯與儲存
* 區塊可調整大小、雙擊放大檢視
* 支援排序與完成狀態篩選
* 拖拉調整任務順序會同步儲存到後端

## 📸 截圖

### 🔲 主畫面

![主畫面](./src/assets/main.png)

### ✏️ 任務編輯畫面

![任務編輯](./src/assets/taskEditing.png)

### 🔄 登入後合併提示

![合併提示彈窗](./src/assets/mergeWarning.png)

## 開發指南

```bash
# 安裝相關套件
npm install

# 啟動開發服務器
npm run dev
```

需要 `.env`檔：

```
VITE_API_BASE_URL=https://todo-quadrant-app-back.onrender.com
```
