/**
 * Google Apps Script for USI Badminton 2026
 * 
 * 設定步驟：
 * 1. 在 Google Sheets 中，點選「擴充功能」>「Apps Script」
 * 2. 將此檔案的內容貼到編輯器中
 * 3. 點選「部署」>「新增部署作業」
 * 4. 選擇類型：「網頁應用程式」
 * 5. 執行身分：「我」
 * 6. 存取權：「所有人」
 * 7. 複製「網頁應用程式網址」
 * 8. 將網址貼到 config.js 的 SCRIPT_URL
 */

// Spreadsheet ID (請替換成你的 Spreadsheet ID)
const SPREADSHEET_ID = '1ej5da-A-kHbnrUA0fKqy3bGo_Y6rlHMdhy1GPcV55RA';

// Sheet Names
const SHEET_NAMES = {
  PLAYERS: 'Players',
  ROUNDS: 'Rounds',
  TEAMS: 'Teams',
  MATCHES: 'Matches',
  SCORES: 'Scores',
  SETTINGS: 'Settings'
};

/**
 * 處理 POST 請求
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const payload = data.data;
    
    let result;
    
    switch (action) {
      case 'updatePlayers':
        result = updatePlayers(payload);
        break;
      case 'addRound':
        result = addRound(payload);
        break;
      case 'saveTeams':
        result = saveTeams(payload);
        break;
      case 'updateTeams':
        result = updateTeams(payload);
        break;
      case 'saveMatches':
        result = saveMatches(payload);
        break;
      case 'addScore':
        result = addScore(payload);
        break;
      case 'updateMatchStatus':
        result = updateMatchStatus(payload);
        break;
      case 'deleteScore':
        result = deleteScore(payload);
        break;
      case 'deleteRound':
        result = deleteRound(payload);
        break;
      case 'getSettings':
        result = getSettings();
        break;
      case 'saveSettings':
        result = saveSettings(payload);
        break;
      default:
        result = { success: false, message: 'Unknown action' };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 處理 GET 請求（測試用）
 */
function doGet() {
  return ContentService.createTextOutput('USI Badminton 2026 API is running');
}

/**
 * 更新球員名單
 */
function updatePlayers(players) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAMES.PLAYERS);
  
  // 清空現有資料（保留標題）
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  
  // 寫入新資料
  if (players.length > 0) {
    const values = players.map(p => [
      p['name'] || p.name || '',
      p['checked'] === true ? 'true' : 'false',
      p['order'] || p.order || ''
    ]);
    sheet.getRange(2, 1, values.length, 3).setValues(values);
  }
  
  return { success: true, count: players.length };
}

/**
 * 新增場次
 */
function addRound(round) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAMES.ROUNDS);
  
  sheet.appendRow([
    round.roundId,
    round.date,
    round.note
  ]);
  
  return { success: true };
}

/**
 * 儲存分組
 */
function saveTeams(teams) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAMES.TEAMS);
  
  // 刪除該場次的舊資料
  const roundId = teams[0].roundId;
  const data = sheet.getDataRange().getValues();
  
  for (let i = data.length - 1; i > 0; i--) {
    if (data[i][0] === roundId) {
      sheet.deleteRow(i + 1);
    }
  }
  
  // 寫入新資料
  const values = teams.map(t => [
    t.roundId,
    t.team,
    t.number,
    t.name
  ]);
  
  sheet.getRange(sheet.getLastRow() + 1, 1, values.length, 4).setValues(values);
  
  return { success: true, count: teams.length };
}

/**
 * 更新分組（部分更新，不刪除其他人的分配）
 * 用於多人同時編輯時，只更新自己修改的位置
 */
function updateTeams(teams) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAMES.TEAMS);
  
  if (teams.length === 0) {
    return { success: true, count: 0, message: 'No data to update' };
  }
  
  const roundId = teams[0].roundId;
  const data = sheet.getDataRange().getValues();
  
  // 建立位置索引 Map: "roundId-team-number" -> rowIndex
  const positionMap = new Map();
  for (let i = 1; i < data.length; i++) {
    const key = `${data[i][0]}-${data[i][1]}-${data[i][2]}`;
    positionMap.set(key, i + 1); // +1 因為 sheet 行號從 1 開始
  }
  
  let updatedCount = 0;
  let insertedCount = 0;
  
  // 處理每個更新的位置
  teams.forEach(t => {
    const key = `${t.roundId}-${t.team}-${t.number}`;
    const rowIndex = positionMap.get(key);
    
    if (t.name === null || t.name === '') {
      // 如果名字為空，表示要清除這個位置
      if (rowIndex) {
        sheet.deleteRow(rowIndex);
        updatedCount++;
        // 更新 map 中的行號（因為刪除後其他行會上移）
        positionMap.forEach((value, mapKey) => {
          if (value > rowIndex) {
            positionMap.set(mapKey, value - 1);
          }
        });
        positionMap.delete(key);
      }
    } else {
      // 更新或插入資料
      if (rowIndex) {
        // 位置已存在，更新該行
        sheet.getRange(rowIndex, 1, 1, 4).setValues([[
          t.roundId,
          t.team,
          t.number,
          t.name
        ]]);
        updatedCount++;
      } else {
        // 位置不存在，新增一行
        sheet.appendRow([
          t.roundId,
          t.team,
          t.number,
          t.name
        ]);
        insertedCount++;
      }
    }
  });
  
  return { 
    success: true, 
    updated: updatedCount,
    inserted: insertedCount,
    total: updatedCount + insertedCount
  };
}

/**
 * 儲存賽程
 */
function saveMatches(matches) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAMES.MATCHES);
  
  // 刪除該場次的舊資料
  const roundId = matches[0].roundId;
  const data = sheet.getDataRange().getValues();
  
  for (let i = data.length - 1; i > 0; i--) {
    if (data[i][0] === roundId) {
      sheet.deleteRow(i + 1);
    }
  }
  
  // 寫入新資料
  const values = matches.map(m => [
    m.roundId,
    m.matchNumber,
    m.spade1,
    m.spade2,
    m.heart1,
    m.heart2
  ]);
  
  sheet.getRange(sheet.getLastRow() + 1, 1, values.length, 6).setValues(values);
  
  return { success: true, count: matches.length };
}

/**
 * 新增比分
 */
function addScore(score) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAMES.SCORES);
  
  // 檢查是否已有該場次的比分
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === score.roundId && data[i][1] == score.matchNumber) {
      rowIndex = i + 1;
      break;
    }
  }
  
  const timestamp = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd HH:mm:ss');
  
  if (rowIndex > 0) {
    // 更新現有比分
    sheet.getRange(rowIndex, 1, 1, 5).setValues([[
      score.roundId,
      score.matchNumber,
      score.spadeScore,
      score.heartScore,
      timestamp
    ]]);
  } else {
    // 新增比分
    sheet.appendRow([
      score.roundId,
      score.matchNumber,
      score.spadeScore,
      score.heartScore,
      timestamp
    ]);
  }
  
  return { success: true };
}

/**
 * 更新比賽狀態
 */
function updateMatchStatus(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAMES.MATCHES);
  
  // 找到對應的比賽
  const dataRange = sheet.getDataRange().getValues();
  
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.roundId && dataRange[i][1] == data.matchNumber) {
      // 更新狀態欄（假設狀態在第7欄，如果還沒有這欄需要先添加）
      // 如果 Matches sheet 沒有狀態欄，需要先在 Google Sheets 手動添加 "狀態" 欄
      sheet.getRange(i + 1, 7).setValue(data.status);
      return { success: true };
    }
  }
  
  return { success: false, message: '找不到對應的比賽' };
}

/**
 * 刪除比分（用於重置比賽）
 */
function deleteScore(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAMES.SCORES);
  
  // 找到並刪除對應的比分記錄
  const dataRange = sheet.getDataRange().getValues();
  
  for (let i = dataRange.length - 1; i > 0; i--) {
    if (dataRange[i][0] === data.roundId && dataRange[i][1] == data.matchNumber) {
      sheet.deleteRow(i + 1);
    }
  }
  
  // 同時重置比賽狀態為 not-started
  const matchesSheet = ss.getSheetByName(SHEET_NAMES.MATCHES);
  const matchesData = matchesSheet.getDataRange().getValues();
  
  for (let i = 1; i < matchesData.length; i++) {
    if (matchesData[i][0] === data.roundId && matchesData[i][1] == data.matchNumber) {
      matchesSheet.getRange(i + 1, 7).setValue('not-started');
      break;
    }
  }
  
  return { success: true };
}

/**
 * 刪除整場比賽（包含所有相關資料）
 */
function deleteRound(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const roundId = data.roundId;
  
  // 1. 刪除 Scores 表中的所有比分
  const scoresSheet = ss.getSheetByName(SHEET_NAMES.SCORES);
  const scoresData = scoresSheet.getDataRange().getValues();
  for (let i = scoresData.length - 1; i > 0; i--) {
    if (scoresData[i][0] === roundId) {
      scoresSheet.deleteRow(i + 1);
    }
  }
  
  // 2. 刪除 Matches 表中的所有比賽
  const matchesSheet = ss.getSheetByName(SHEET_NAMES.MATCHES);
  const matchesData = matchesSheet.getDataRange().getValues();
  for (let i = matchesData.length - 1; i > 0; i--) {
    if (matchesData[i][0] === roundId) {
      matchesSheet.deleteRow(i + 1);
    }
  }
  
  // 3. 刪除 Teams 表中的所有分組
  const teamsSheet = ss.getSheetByName(SHEET_NAMES.TEAMS);
  const teamsData = teamsSheet.getDataRange().getValues();
  for (let i = teamsData.length - 1; i > 0; i--) {
    if (teamsData[i][0] === roundId) {
      teamsSheet.deleteRow(i + 1);
    }
  }
  
  // 4. 刪除 Rounds 表中的場次記錄
  const roundsSheet = ss.getSheetByName(SHEET_NAMES.ROUNDS);
  const roundsData = roundsSheet.getDataRange().getValues();
  for (let i = roundsData.length - 1; i > 0; i--) {
    if (roundsData[i][0] === roundId) {
      roundsSheet.deleteRow(i + 1);
      break;
    }
  }
  
  return { success: true, message: '已刪除整場比賽及相關資料' };
}

/**
 * 讀取系統設定
 */
function getSettings() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let settingsSheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
  
  // 如果 Settings 工作表不存在，建立它
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(SHEET_NAMES.SETTINGS);
    settingsSheet.appendRow(['category', 'item', 'value']);
    settingsSheet.getRange('A1:C1').setFontWeight('bold');
  }
  
  const data = settingsSheet.getDataRange().getValues();
  const settings = {};
  
  // 從第二列開始讀取（第一列是標題）
  for (let i = 1; i < data.length; i++) {
    const category = data[i][0];
    const key = data[i][1];
    const value = data[i][2];
    if (key) {
      settings[key] = value || '';
    }
  }
  
  return { 
    success: true, 
    settings: settings 
  };
}

/**
 * 儲存系統設定
 */
function saveSettings(settings) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let settingsSheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
  
  // 如果 Settings 工作表不存在，建立它
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(SHEET_NAMES.SETTINGS);
    settingsSheet.appendRow(['category', 'item', 'value']);
    settingsSheet.getRange('A1:C1').setFontWeight('bold');
  }
  
  const data = settingsSheet.getDataRange().getValues();
  
  // 定義設定項目的分類
  const categoryMap = {
    teamAName: '隊伍設定',
    teamBName: '隊伍設定'
  };
  
  // 更新每個設定項目
  for (const key in settings) {
    let found = false;
    const category = categoryMap[key] || '其他';
    
    // 檢查是否已存在
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === key) {
        settingsSheet.getRange(i + 1, 3).setValue(settings[key]);
        found = true;
        break;
      }
    }
    
    // 如果不存在，新增一列
    if (!found) {
      settingsSheet.appendRow([category, key, settings[key]]);
    }
  }
  
  return { 
    success: true, 
    message: '設定已儲存' 
  };
}
