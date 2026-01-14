// Google Sheets Configuration
const CONFIG = {
  // Spreadsheet ID
  SHEET_ID: "1ej5da-A-kHbnrUA0fKqy3bGo_Y6rlHMdhy1GPcV55RA",
  
  // Sheet GIDs
  GID: {
    PLAYERS: "0",
    ROUNDS: "3588714",
    TEAMS: "980069661",
    MATCHES: "1415380546",
    SCORES: "794606399",
    ANNOUNCEMENTS: "1479866467",
    SETTINGS: "68465225"
  },
  
  // Google Apps Script Web App URL (待設定)
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxuMiXH2ozbJcspZLARBxEybTURPZBx57GPl9jYobV-EmMfjDGE5gzgnEo_PwJ-DzTC4A/exec", // 稍後從 Google Apps Script 取得
  
  ADMIN_PASSWORD_HASH: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
  
  // Auth Settings
  AUTH_EXPIRY_HOURS: 24,
  
  // Player Settings
  MAX_PLAYERS: 24
};

// CSV Export URLs
const CSV_URLS = {
  PLAYERS: `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&gid=${CONFIG.GID.PLAYERS}`,
  ROUNDS: `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&gid=${CONFIG.GID.ROUNDS}`,
  TEAMS: `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&gid=${CONFIG.GID.TEAMS}`,
  MATCHES: `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&gid=${CONFIG.GID.MATCHES}`,
  SCORES: `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&gid=${CONFIG.GID.SCORES}`,
  ANNOUNCEMENTS: `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&gid=${CONFIG.GID.ANNOUNCEMENTS}`,
  SETTINGS: `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&gid=${CONFIG.GID.SETTINGS}`
};
