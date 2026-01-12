// Utility Functions

/**
 * 顯示 Toast 通知
 * @param {string} message - 訊息內容
 * @param {string} type - 類型: 'success', 'error', 'info', 'warning'
 * @param {number} duration - 顯示時間（毫秒），預設 3000
 */
function showToast(message, type = 'info', duration = 3000) {
  // 移除現有的 toast
  const existingToast = document.getElementById('toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // 建立 toast 元素
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = `fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 max-w-md`;
  
  // 根據類型設定樣式
  const styles = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  };
  
  toast.className += ` ${styles[type] || styles.info}`;
  toast.textContent = message;
  
  // 加入到 body
  document.body.appendChild(toast);
  
  // 淡入動畫
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);
  
  // 自動移除
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

/**
 * 顯示載入中狀態
 * @param {string} elementId - 要顯示載入狀態的元素 ID
 * @param {string} message - 載入訊息
 */
function showLoading(elementId, message = '載入中...') {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `
      <div class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <div class="text-gray-600">${message}</div>
      </div>
    `;
  }
}

/**
 * 隱藏元素
 * @param {string} elementId - 元素 ID
 */
function hideElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add('hidden');
  }
}

/**
 * 顯示元素
 * @param {string} elementId - 元素 ID
 */
function showElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.remove('hidden');
  }
}

/**
 * 格式化日期
 * @param {Date|string} date - 日期物件或字串
 * @param {string} format - 格式: 'date', 'datetime', 'time'
 * @returns {string} 格式化後的日期字串
 */
function formatDate(date, format = 'date') {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  switch (format) {
    case 'date':
      return `${year}-${month}-${day}`;
    case 'datetime':
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    case 'time':
      return `${hours}:${minutes}:${seconds}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

/**
 * 取得 URL 參數
 * @param {string} param - 參數名稱
 * @returns {string|null} 參數值
 */
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * 確認對話框 (使用自訂 Modal)
 * @param {string} message - 確認訊息
 * @returns {Promise<boolean>} 使用者是否確認
 */
function confirmAction(message) {
  return new Promise((resolve) => {
    // 移除現有的確認框
    const existingModal = document.getElementById('confirmModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // 建立確認框
    const modal = document.createElement('div');
    modal.id = 'confirmModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999;';
    
    // Check if message contains HTML tags
    const isHTML = /<[^>]*>/.test(message);
    
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 transform transition-all animate-fadeIn">
        <div class="mb-6">${isHTML ? message : `<h3 class="text-xl font-bold text-gray-800 mb-4">確認操作</h3><p class="text-gray-600 whitespace-pre-wrap">${message}</p>`}</div>
        <div class="flex gap-3">
          <button 
            id="confirmCancel"
            class="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition"
          >
            取消
          </button>
          <button 
            id="confirmOk"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
          >
            確認
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // 處理按鈕點擊
    const confirmOk = document.getElementById('confirmOk');
    const confirmCancel = document.getElementById('confirmCancel');
    
    confirmOk.addEventListener('click', () => {
      modal.remove();
      resolve(true);
    });
    
    confirmCancel.addEventListener('click', () => {
      modal.remove();
      resolve(false);
    });
    
    // 點擊背景關閉
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        resolve(false);
      }
    });
    
    // ESC 鍵關閉
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        resolve(false);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  });
}

/**
 * 提示對話框 (只有確定按鈕)
 * @param {string} message - 提示訊息
 * @returns {Promise<void>} 使用者點擊確定後 resolve
 */
function alertAction(message) {
  return new Promise((resolve) => {
    // 移除現有的提示框
    const existingModal = document.getElementById('alertModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // 建立提示框
    const modal = document.createElement('div');
    modal.id = 'alertModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999;';
    
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 transform transition-all animate-fadeIn">
        <div class="mb-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">提示</h3>
          <p class="text-gray-600 whitespace-pre-wrap">${message}</p>
        </div>
        <div class="flex justify-end">
          <button 
            id="alertOk"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            確定
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // 處理按鈕點擊
    const alertOk = document.getElementById('alertOk');
    
    alertOk.addEventListener('click', () => {
      modal.remove();
      resolve();
    });
    
    // ESC 鍵關閉
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        resolve();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  });
}

/**
 * 讀取 CSV 資料
 * @param {string} url - CSV URL
 * @returns {Promise<Array>} CSV 資料陣列
 */
async function fetchCSV(url) {
  try {
    const response = await fetch(url);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText.trim(), {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error)
      });
    });
  } catch (error) {
    console.error('讀取 CSV 失敗:', error);
    throw error;
  }
}

/**
 * 寫入資料到 Google Sheets (透過 Apps Script)
 * @param {string} action - 動作名稱
 * @param {Object} data - 要寫入的資料
 * @returns {Promise<Object>} 回應資料
 */
async function writeToSheet(action, data) {
  if (!CONFIG.SCRIPT_URL) {
    console.warn('Google Apps Script URL 尚未設定');
    showToast('資料儲存功能尚未設定', 'warning');
    return { success: false, message: 'SCRIPT_URL not configured' };
  }
  
  try {
    const response = await fetch(CONFIG.SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, data })
    });
    
    // 注意: no-cors 模式下無法讀取 response
    // 假設成功
    return { success: true };
  } catch (error) {
    console.error('寫入失敗:', error);
    throw error;
  }
}

/**
 * 生成matchID
 * @param {number} roundNumber - 場次編號
 * @returns {string} matchID (例如: Match-001)
 */
function generateRoundId(roundNumber) {
  return `Match-${String(roundNumber).padStart(3, '0')}`;
}

/**
 * 解析matchID
 * @param {string} roundId - matchID (例如: Match-001)
 * @returns {number} 場次編號
 */
function parseRoundId(roundId) {
  return parseInt(roundId.replace('Match-', ''));
}

/**
 * 取得隊伍名稱（從設定中讀取，如果沒有則使用默認值）
 * 優先從 localStorage 讀取（快取），如果需要最新資料請呼叫 loadTeamNames()
 * @param {string} team - 隊伍代號 'teamA' 或 'teamB'
 * @returns {string} 隊伍名稱
 */
function getTeamName(team) {
  const defaultNames = {
    teamA: 'Team A',
    teamB: 'Team B'
  };
  
  if (team === 'teamA') {
    const name = localStorage.getItem('teamAName');
    return (name && name.trim()) ? name : defaultNames.teamA;
  } else if (team === 'teamB') {
    const name = localStorage.getItem('teamBName');
    return (name && name.trim()) ? name : defaultNames.teamB;
  }
  
  return defaultNames[team] || '未知隊伍';
}

/**
 * 從 CSV 解析設定資料
 * @param {string} csvText - CSV 文字內容
 * @returns {Object} 設定物件
 */
function parseSettingsCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const settings = {};
  
  // 跳過標題行（第一行）
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // 簡單的 CSV 解析（處理可能的引號）
    const parts = line.split(',').map(part => part.replace(/^"|"$/g, '').trim());
    
    if (parts.length >= 3) {
      const category = parts[0];
      const key = parts[1];
      const value = parts[2];
      
      if (key) {
        settings[key] = value || '';
      }
    }
  }
  
  return settings;
}

/**
 * 從雲端載入隊伍名稱設定（更新 localStorage 快取）
 * @returns {Promise<Object>} 包含 teamAName 和 teamBName 的物件
 */
async function loadTeamNames() {
  try {
    // 優先從 CSV 讀取（無 CORS 問題）
    const response = await fetch(CSV_URLS.SETTINGS);
    
    if (response.ok) {
      const csvText = await response.text();
      const settings = parseSettingsCSV(csvText);
      const teamAName = (settings.teamAName && settings.teamAName.trim()) ? settings.teamAName : '';
      const teamBName = (settings.teamBName && settings.teamBName.trim()) ? settings.teamBName : '';
      
      // 只有非空時才更新 localStorage
      if (teamAName) {
        localStorage.setItem('teamAName', teamAName);
      }
      if (teamBName) {
        localStorage.setItem('teamBName', teamBName);
      }
      
      console.log('✅ 從 CSV 載入隊伍名稱成功:', { teamAName, teamBName });
      return { teamAName, teamBName };
    }
  } catch (error) {
    console.error('載入隊伍名稱失敗:', error);
  }
  
  // 失敗時返回 localStorage 中的值
  return {
    teamAName: localStorage.getItem('teamAName') || '',
    teamBName: localStorage.getItem('teamBName') || ''
  };
}

/**
 * 取得隊伍圖標 SVG
 * @param {string} team - 隊伍代號 'teamA' 或 'teamB'
 * @returns {string} SVG HTML
 */
function getTeamIcon(team) {
  const icons = {
    teamA: '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L8.5 8.5C7 10 4 12 4 15C4 17.5 6 19 8 19C9 19 10 18.5 10.5 17.5C11 16.5 11 15 11 14H13C13 15 13 16.5 13.5 17.5C14 18.5 15 19 16 19C18 19 20 17.5 20 15C20 12 17 10 15.5 8.5L12 2Z"/><path d="M9 19C9 20.5 9.5 22 12 22C14.5 22 15 20.5 15 19H9Z"/></svg>',
    teamB: '<svg class="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
  };
  
  return icons[team] || '';
}
