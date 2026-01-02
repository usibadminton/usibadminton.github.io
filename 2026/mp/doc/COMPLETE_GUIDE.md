# 🏸 USI Badminton 2026 - 完整專案說明

## 📱 系統簡介

一個完整的羽球賽事管理系統，用於管理球員名單、分組、計分和統計分析。

### 核心功能
- ✅ 球員名單管理（動態人數）
- ✅ 自動分組登記（黑桃隊 vs 紅心隊）
- ✅ 賽程自動生成（6場雙打）
- ✅ 計分系統（21分制 + Deuce 規則）
- ✅ 歷史查詢（分組/賽程/比分）
- ✅ 統計分析（球員戰績/隊伍勝率）

---

## 🎯 使用流程

```
1. 管理員登入
   ↓
2. 管理名單（新增/編輯球員）
   ↓
3. 開始新場次（自動生成場次ID）
   ↓
4. 分組登記（選擇24位球員分配到兩隊）
   ↓
5. 自動生成賽程（6場雙打配對）
   ↓
6. 計分系統（記錄每場比分）
   ↓
7. 查看歷史/統計
```

---

## 📂 檔案結構

```
2026/mp/
├── index.html           # 首頁（統計卡片、場次列表）
├── login.html           # 登入頁面
├── roster.html          # 名單管理
├── team-assign.html     # 分組登記
├── matches.html         # 賽程表
├── scoring.html         # 計分系統
├── history.html         # 歷史查詢
├── statistics.html      # 統計分析
├── debug.html           # 資料檢查工具
│
├── config.js            # 設定檔
├── auth.js              # 驗證管理
├── utils.js             # 通用工具
├── AppsScript.gs        # Google Apps Script
│
├── README.md            # 專案說明
├── SHEETS_STRUCTURE.md  # 工作表結構
├── PHASE_5-6_SUMMARY.md # Phase 5-6 清單
└── PHASE_7-8_SUMMARY.md # Phase 7-8 清單
```

---

## ⚙️ 安裝設定

### 1. Google Sheets 設定

#### 建立工作表
在你的 Google Sheets 中建立以下 5 個工作表：

1. **Players** - 球員名單
2. **Rounds** - 場次記錄
3. **Teams** - 分組資料
4. **Matches** - 賽程表
5. **Scores** - 比分記錄

#### 設定欄位標題（重要！）
每個工作表的第一行（Row 1）必須設定正確的欄位標題：

**Players Sheet (A1:B1)**
```
姓名 | 簽到狀態
```

**Rounds Sheet (A1:C1)**
```
場次ID | 日期 | 備註
```

**Teams Sheet (A1:D1)**
```
場次ID | 隊伍 | 編號 | 姓名
```

**Matches Sheet (A1:F1)**
```
場次ID | 局數 | 黑桃1 | 黑桃2 | 紅心1 | 紅心2
```

**Scores Sheet (A1:E1)**
```
場次ID | 局數 | 黑桃分數 | 紅心分數 | 記錄時間
```

#### 設定分享權限
- 點選「共用」按鈕
- 設為：**知道連結的任何人都可以檢視**

---

### 2. Google Apps Script 設定

#### 部署步驟
1. 開啟 Google Sheets
2. 點選「擴充功能」→「Apps Script」
3. 刪除預設程式碼
4. 複製 `AppsScript.gs` 的全部內容
5. 貼到編輯器中
6. **修改第 14 行**：將 SPREADSHEET_ID 改為你的 Sheet ID
   ```javascript
   const SPREADSHEET_ID = '你的 Sheet ID';
   ```
7. 點選「部署」→「新增部署作業」
8. 類型：選擇「網頁應用程式」
9. 執行身分：選擇「我」
10. 存取權：選擇「所有人」
11. 點選「部署」
12. **複製「網頁應用程式網址」**

---

### 3. config.js 設定

開啟 `config.js`，更新以下設定：

```javascript
const CONFIG = {
  // 替換成你的 Spreadsheet ID
  SHEET_ID: "你的_Spreadsheet_ID",
  
  // 如果 GID 不同，請更新（通常不需要改）
  GID: {
    PLAYERS: "0",
    ROUNDS: "3588714",
    TEAMS: "980069661",
    MATCHES: "1415380546",
    SCORES: "794606399"
  },
  
  // 貼上從 Apps Script 複製的網址
  SCRIPT_URL: "https://script.google.com/macros/s/你的_Script_ID/exec",
  
  // 管理員密碼（可自訂）
  ADMIN_PASSWORD: "usi2026",
  
  // 登入有效時間（小時）
  AUTH_EXPIRY_HOURS: 24,
  
  // 球員人數上限（可自訂）
  MAX_PLAYERS: 24
};
```

#### 如何取得 Spreadsheet ID？
從 Google Sheets 網址中取得：
```
https://docs.google.com/spreadsheets/d/[這裡是_SHEET_ID]/edit
```

#### 如何取得 GID？
1. 點選工作表分頁
2. 查看網址中的 `gid=` 參數
```
https://docs.google.com/spreadsheets/d/.../edit#gid=[這裡是_GID]
```

---

## 🧪 測試流程

### 使用 debug.html 檢查資料
1. 開啟 `debug.html`
2. 依序點擊按鈕檢查各工作表：
   - Check Players
   - Check Rounds
   - Check Teams
   - Check Matches
   - Check Scores
3. 確認欄位名稱正確（中文標題）

### 完整功能測試
1. **登入測試**
   - 開啟 `index.html`
   - 點選「管理員登入」
   - 輸入密碼：`usi2026`（或你設定的密碼）

2. **名單管理**
   - 點選「管理名單」
   - 新增至少 24 位球員
   - 測試編輯/刪除功能
   - 測試簽到功能

3. **分組登記**
   - 點選「開始新場次」
   - 使用下拉選單選擇 24 位球員
   - 黑桃隊 12 人
   - 紅心隊 12 人
   - 點選「確認分組」

4. **賽程生成**
   - 自動跳轉到賽程頁面
   - 應該顯示 6 場雙打配對

5. **計分系統**
   - 點選任一場次的「開始計分」
   - 輸入比分（測試 21 分制驗證）
   - 測試 Deuce 規則（21-21 需贏 2 分）
   - 測試快速輸入按鈕
   - 點選「下一場」測試跳轉

6. **歷史查詢**
   - 點選「查看完整記錄」
   - 切換三個標籤頁
   - 測試比分篩選功能

7. **統計分析**
   - 點選首頁「查看統計」
   - 查看隊伍戰績
   - 查看球員個人戰績
   - 測試排序功能

---

## 🎨 UI 設計說明

### 配色方案
- **黑桃隊**：藍色系（blue-600）
- **紅心隊**：紅色系（red-600）
- **主題色**：紫色/靛藍（purple-600, indigo-600）
- **成功提示**：綠色（green-600）
- **警告提示**：黃色（yellow-600）
- **錯誤提示**：紅色（red-600）

### 圖示使用
- 🏸 羽球
- 👥 球員/名單
- ➕ 新增
- 📋 賽程
- 🏆 獲勝
- 📊 統計
- 📚 歷史
- ✓ 完成/簽到
- ← 返回

---

## 📱 響應式設計 (RWD)

### 斷點
- **手機**：< 768px
- **平板**：768px - 1024px
- **桌面**：> 1024px

### 測試建議
使用 Chrome DevTools 測試以下裝置：
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPad (768px)
- Desktop (1920px)

---

## 🔧 常見問題排解

### Q1: 載入失敗，顯示「載入資料失敗」
**可能原因：**
- Google Sheets 未設為公開檢視
- Sheet ID 或 GID 錯誤
- 欄位標題不正確

**解決方法：**
1. 確認 Google Sheets 分享設定
2. 使用 `debug.html` 檢查資料
3. 檢查 `config.js` 設定

### Q2: 資料未同步到 Google Sheets
**可能原因：**
- SCRIPT_URL 未設定或錯誤
- Apps Script 未正確部署

**解決方法：**
1. 確認 `config.js` 中的 SCRIPT_URL 已填寫
2. 重新部署 Apps Script
3. 開啟瀏覽器 Console 查看錯誤訊息

### Q3: 計分驗證失敗
**規則說明：**
- 至少一方要達到 21 分
- 雙方都 >= 21 分時需贏 2 分以上
- 分數上限 30 分

### Q4: 登入後又要求重新登入
**可能原因：**
- 登入已過期（預設 24 小時）
- localStorage 被清除

**解決方法：**
- 重新登入
- 修改 `config.js` 中的 AUTH_EXPIRY_HOURS

### Q5: 球員下拉選單是空的
**可能原因：**
- Players 工作表沒有資料
- 欄位標題錯誤（必須是「姓名」）

**解決方法：**
1. 確認 Players 工作表第一行是「姓名」
2. 確認有球員資料
3. 使用 `debug.html` 檢查

---

## 🚀 部署到 GitHub Pages

### 上傳檔案
```bash
cd /home/harper/Desktop/usibadminton.github.io
git add 2026/mp/*
git commit -m "Add USI Badminton 2026 system"
git push origin test
```

### 訪問網址
```
https://usibadminton.github.io/2026/mp/index.html
```

---

## 📊 資料流程圖

```
┌─────────────────┐
│  登入 (login)   │
└────────┬────────┘
         │
         v
┌─────────────────┐
│ 名單管理(roster)│
│  新增球員      │
└────────┬────────┘
         │
         v
┌─────────────────┐
│分組登記(assign) │
│  選擇24位球員  │
└────────┬────────┘
         │
         v
┌─────────────────┐
│賽程生成(matches)│
│  自動配對6場   │
└────────┬────────┘
         │
         v
┌─────────────────┐
│ 計分系統(score) │
│  記錄比分      │
└────────┬────────┘
         │
         v
┌─────────────────┐
│歷史查詢(history)│
│統計分析(stats)  │
└─────────────────┘
```

---

## 📝 更新紀錄

### 2025-12-31
- ✅ 完成 Phase 1-8 所有功能
- ✅ 新增統計分析頁面
- ✅ 首頁統計卡片
- ✅ 登出功能
- ✅ 完整文件撰寫

### 2025-12-30
- ✅ 完成 Phase 0-4
- ✅ 建立基礎架構
- ✅ 完成名單管理
- ✅ 完成分組功能
- ✅ 完成賽程生成

---

## 👥 開發團隊

- **開發者**: Harper + GitHub Copilot
- **專案類型**: 羽球賽事管理系統
- **技術棧**: HTML + JavaScript + Tailwind CSS + Google Sheets

---

## 📄 授權

此專案為 USI Badminton 內部使用系統。

---

## 🙏 致謝

感謝所有參與測試和提供意見的球友們！

---

**祝比賽順利！🏸🎉**
