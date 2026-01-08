// Authentication Management

/**
 * SHA-256 雜湊函數
 * @param {string} message - 要雜湊的訊息
 * @returns {Promise<string>} 雜湊值（十六進制字串）
 */
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * 檢查使用者是否已登入
 * @returns {boolean} 是否已登入
 */
function isAuthenticated() {
  const auth = localStorage.getItem('adminAuth');
  const authTime = localStorage.getItem('authTime');
  
  if (!auth || !authTime) {
    return false;
  }
  
  // 檢查是否過期 (24小時)
  const now = Date.now();
  const expiryTime = CONFIG.AUTH_EXPIRY_HOURS * 60 * 60 * 1000;
  
  if (now - parseInt(authTime) > expiryTime) {
    // 已過期，清除登入狀態
    logout();
    return false;
  }
  
  return auth === 'true';
}

/**
 * 登入（使用 SHA-256 雜湊比對）
 * @param {string} password - 密碼
 * @returns {Promise<boolean>} 登入是否成功
 */
async function login(password) {
  const passwordHash = await sha256(password);
  
  if (passwordHash === CONFIG.ADMIN_PASSWORD_HASH) {
    localStorage.setItem('adminAuth', 'true');
    localStorage.setItem('authTime', Date.now().toString());
    return true;
  }
  return false;
}

/**
 * 登出
 */
function logout() {
  localStorage.removeItem('adminAuth');
  localStorage.removeItem('authTime');
}

/**
 * 要求登入（用於需要權限的頁面）
 */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

/**
 * 取得剩餘登入時間（格式化為 hh:mm:ss）
 * @returns {string} 剩餘時間字串
 */
function getRemainingAuthTime() {
  const authTime = localStorage.getItem('authTime');
  if (!authTime) return '00:00:00';
  
  const now = Date.now();
  const elapsed = now - parseInt(authTime);
  const expiryTime = CONFIG.AUTH_EXPIRY_HOURS * 60 * 60 * 1000;
  const remaining = expiryTime - elapsed;
  
  if (remaining <= 0) return '00:00:00';
  
  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
