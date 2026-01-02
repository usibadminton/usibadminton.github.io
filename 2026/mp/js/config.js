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
    SCORES: "794606399"
  },
  
  // Google Apps Script Web App URL (待設定)
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycby79zrHxui49EhzWGggCVFKq3-X54l3dE3zRNVp-TW9RcV7_2Eb3ImHIE9f5kLKkXhxuw/exec", // 稍後從 Google Apps Script 取得
  
  // Admin Password
  ADMIN_PASSWORD: "usi2026",
  
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
  SCORES: `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&gid=${CONFIG.GID.SCORES}`
};
