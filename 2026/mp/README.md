# USI Badminton 2026 - 羽球賽事管理系統

## 📋 完成狀態

### ✅ Phase 1-4: 基礎架構 (已完成)
- [x] `index.html` - 首頁（含統計卡片、登出功能）
- [x] `login.html` - 管理員登入頁面
- [x] `config.js` - 設定檔（Sheet ID、GID、MAX_PLAYERS）
- [x] `auth.js` - 驗證登入狀態
- [x] `utils.js` - 通用工具函式
- [x] `roster.html` - 名單管理（動態人數）
- [x] `team-assign.html` - 分組登記（標籤切換）
- [x] `matches.html` - 賽程表頁面

### ✅ Phase 5: 計分系統 (已完成)
- [x] `scoring.html` - 計分頁面
  - 21分制驗證 + Deuce 規則
  - 快速輸入按鈕
  - 歷史紀錄顯示
  - 下一場快速跳轉

### ✅ Phase 6: 歷史查詢 (已完成)
- [x] `history.html` - 歷史查詢頁面
  - 分組結果 Tab
  - 賽程表 Tab
  - 比分紀錄 Tab（可篩選）

### ✅ Phase 7: 優化與細節 (已完成)
- [x] UI/UX 優化（統一配色、載入動畫、Toast 通知）
- [x] 登出功能（首頁顯示剩餘時間）
- [x] 首頁統計卡片（總場次、最近比賽、總戰績）
- [x] 錯誤處理機制

### ✅ Phase 8: 進階功能 (已完成)
- [x] `statistics.html` - 統計分析頁面
  - 球員個人戰績（參賽次數、勝敗場、勝率）
  - 隊伍戰績分析
  - 多種排序方式

### 📄 其他檔案
- [x] `AppsScript.gs` - Google Apps Script 範本
- [x] `debug.html` - 資料檢查工具
- [x] `SHEETS_STRUCTURE.md` - 工作表結構說明
- [x] `PHASE_5-6_SUMMARY.md` - Phase 5-6 完成清單
- [x] `PHASE_7-8_SUMMARY.md` - Phase 7-8 完成清單

---

## 🚀 快速開始

### Step 1: 設定 Google Sheets
1. 開啟你的 Google Sheets: https://docs.google.com/spreadsheets/d/1ej5da-A-kHbnrUA0fKqy3bGo_Y6rlHMdhy1GPcV55RA/edit
2. 點選「擴充功能」→「Apps Script」

### Step 2: 貼上程式碼
1. 刪除預設的 `myFunction()`
2. 複製 `AppsScript.gs` 的內容
3. 貼到編輯器中
4. 點選「儲存」（磁碟圖示）

### Step 3: 部署為網頁應用程式
1. 點選「部署」→「新增部署作業」
2. 類型：選擇「網頁應用程式」
3. 說明：填寫 "USI Badminton 2026 API"
4. 執行身分：選擇「我」
5. 存取權：選擇「所有人」
6. 點選「部署」
7. 授權存取（第一次需要）
8. 複製「網頁應用程式網址」

### Step 4: 更新 config.js
1. 開啟 `config.js`
2. 找到 `SCRIPT_URL: ""`
3. 將複製的網址貼上：
   ```javascript
   SCRIPT_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
   ```
4. 儲存檔案

---

## 🧪 測試功能

### 測試1: 首頁
1. 開啟 `index.html`
2. 應該可以看到「尚無比賽場次」
3. 點選「管理員登入」
4. 輸入密碼：`usi2026`

### 測試2: 名單管理
1. 登入後點選「管理名單」
2. 應該可以看到 Players 工作表中的球員
3. 測試新增/編輯/刪除功能
4. **注意**：在設定 Apps Script 前，資料不會同步到 Google Sheets

### 測試3: 分組功能
1. 從首頁點選「開始新場次」
2. 應該會跳轉到分組頁面（場次 Match-001）
3. 從下拉選單選擇24位球員
4. 選過的人不會重複出現
5. 選滿24人後，「確認分組」按鈕會啟用
6. 點選確認後會跳轉到賽程頁面

### 測試4: 賽程表
1. 應該會看到6場雙打配對
2. 配對規則：黑桃1,2 vs 紅心1,2 / 黑桃3,4 vs 紅心3,4 ...
3. 點選「開始計分」會跳轉到計分頁面（Phase 5 尚未實作）

---

## ⚠️ 目前限制

### 資料同步問題
- **在設定 Apps Script 前，資料不會寫入 Google Sheets**
- 名單管理：資料僅在前端更新
- 分組登記：資料僅在前端更新
- 賽程生成：資料僅在前端更新

### 解決方式
設定完 Apps Script 後，所有寫入功能就會正常運作！

---

## 📱 頁面功能說明

### index.html - 首頁
- 顯示登入狀態
- 快速功能按鈕
- 歷史場次列表

### login.html - 登入頁面
- 密碼驗證（預設：usi2026）
- 24小時自動登出

### roster.html - 名單管理（需登入）
- 顯示24位球員
- 新增/編輯/刪除球員
- 顯示人數統計

### team-assign.html - 分組登記（需登入）
- 24個下拉選單
- 防止重複選擇
- 即時更新可選名單
- 必須選滿24人才能送出

### matches.html - 賽程表（公開）
- 顯示6場雙打配對
- 顯示勝場數（黑桃 vs 紅心）
- 已計分的場次顯示比分
- 未計分的場次顯示「開始計分」按鈕

---

## 🔧 技術資訊

### 使用技術
- **前端框架**：原生 JavaScript
- **CSS 框架**：Tailwind CSS（CDN）
- **CSV 解析**：PapaParse
- **資料儲存**：Google Sheets + Apps Script

### 瀏覽器支援
- Chrome / Edge（推薦）
- Firefox
- Safari

### RWD 斷點
- 手機：< 768px
- 平板：768px - 1024px
- 桌面：> 1024px

---

## 📝 更新紀錄

### 2025-12-30
- ✅ 完成 Phase 0-4
- ✅ 建立基礎架構
- ✅ 完成名單管理
- ✅ 完成分組功能
- ✅ 完成賽程生成

---