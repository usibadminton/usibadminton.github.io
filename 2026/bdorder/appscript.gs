// Google Apps Script for managing order data
// 部署為 Web App 後，將 URL 貼到 HTML 中使用
// 架構：使用兩張 sheet
// - order: 存放原始訂單資料（不改動）
// - order_status: 存放狀態和付款資訊

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById('15u-afHAZzSFtccX4o8Nge02qPjDbE0-VoIVMWmlMPQs');
    const orderSheet = ss.getSheetByName('order');
    const statusSheet = ss.getSheetByName('order_status');
    
    // 確保 order_status sheet 存在
    if (!statusSheet) {
      return createResponse(false, '請先建立 order_status sheet');
    }
    
    // 從 POST 參數讀取資料（支援 form data 和 JSON）
    let data;
    if (e.postData && e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else {
      // Form data
      data = e.parameter;
    }
    
    const action = data.action;
    
    // 根據不同動作執行對應功能
    if (action === 'update') {
      return updateOrder(orderSheet, statusSheet, data);
    } else if (action === 'add') {
      return addOrder(orderSheet, statusSheet, data);
    } else if (action === 'payment') {
      return registerPayment(statusSheet, data);
    } else if (action === 'delivery') {
      return confirmDelivery(orderSheet, statusSheet, data);
    } else {
      return createResponse(false, '未知的操作');
    }
    
  } catch (error) {
    return createResponse(false, error.toString());
  }
}

// 更新訂單（編輯確認）
function updateOrder(orderSheet, statusSheet, data) {
  const orderData = orderSheet.getDataRange().getValues();
  const headers = orderData[0];
  
  // 找到欄位索引
  const idCol = headers.indexOf('Id');
  const quantityCol = findColumnIndex(headers, ['Quantity', 'No']);
  
  // 找到對應的行
  let rowIndex = findRowByValue(orderData, idCol, data.id);
  
  if (rowIndex === -1) {
    return createResponse(false, '找不到對應的訂單');
  }
  
  // 只更新 order sheet 的 Quantity（如果有變動）
  if (quantityCol >= 0 && data.quantity !== undefined) {
    orderSheet.getRange(rowIndex, quantityCol + 1).setValue(data.quantity);
  }
  
  // 所有其他資料（Product1, Product2, Pickup）和狀態都寫入 order_status
  updateStatusSheet(statusSheet, data.id, 'confirmed', null, null, data.product1, data.product2, data.pickup);
  
  return createResponse(true, '訂單已確認');
}

// 新增訂單
function addOrder(orderSheet, statusSheet, data) {
  const orderData = orderSheet.getDataRange().getValues();
  const headers = orderData[0];
  
  // 計算新的 Id
  const idCol = headers.indexOf('Id');
  let maxId = 0;
  for (let i = 1; i < orderData.length; i++) {
    const currentId = parseInt(orderData[i][idCol]) || 0;
    if (currentId > maxId) maxId = currentId;
  }
  const newId = maxId + 1;
  
  // 準備新行資料（只有基本資訊）
  const newRow = new Array(headers.length).fill('');
  newRow[idCol] = newId;
  newRow[headers.indexOf('Name')] = data.name || '';
  newRow[headers.indexOf('Phone')] = data.phone || '';
  
  const quantityCol = findColumnIndex(headers, ['Quantity', 'No']);
  if (quantityCol >= 0) newRow[quantityCol] = data.quantity || 0;
  
  // 新增到 order sheet
  orderSheet.appendRow(newRow);
  
  // 在 order_status sheet 新增狀態記錄
  updateStatusSheet(statusSheet, newId, 'unconfirmed', null, null, null, null, null);
  
  return createResponse(true, '新增成功', { newId: newId });
}

// 登記付款
function registerPayment(statusSheet, data) {
  // 更新 order_status sheet
  updateStatusSheet(statusSheet, data.id, 'paid', data.paymentMethod, data.bankCode);
  
  return createResponse(true, '付款資訊已登記');
}

// 確認交貨
function confirmDelivery(orderSheet, statusSheet, data) {
  const orderData = orderSheet.getDataRange().getValues();
  const headers = orderData[0];
  
  const idCol = headers.indexOf('Id');
  const quantityCol = findColumnIndex(headers, ['Quantity', 'No']);
  
  // 找到對應的行
  let rowIndex = findRowByValue(orderData, idCol, data.id);
  
  if (rowIndex === -1) {
    return createResponse(false, '找不到對應的訂單');
  }
  
  // 更新 order sheet 的 Quantity（如果有變動）
  if (quantityCol >= 0 && data.quantity !== undefined) {
    orderSheet.getRange(rowIndex, quantityCol + 1).setValue(data.quantity);
  }
  
  // 所有其他資料都更新到 order_status sheet
  updateStatusSheet(statusSheet, data.id, 'completed', data.paymentMethod, data.bankCode, data.product1, data.product2, data.pickup);
  
  return createResponse(true, '已確認交貨');
}

// 更新或新增狀態記錄到 order_status sheet
function updateStatusSheet(statusSheet, orderId, status, paymentMethod, bankCode, product1, product2, pickup) {
  const statusData = statusSheet.getDataRange().getValues();
  
  // 如果是空的 sheet，先建立標題
  if (statusData.length === 0 || !statusData[0][0]) {
    statusSheet.appendRow(['Id', 'Status', 'Product1', 'Product2', 'Pickup', 'PaymentMethod', 'BankCode', 'UpdatedAt']);
    statusSheet.appendRow([orderId, status, product1 || '', product2 || '', pickup || '', paymentMethod || '', bankCode || '', new Date()]);
    return;
  }
  
  const headers = statusData[0];
  const idCol = headers.indexOf('Id');
  const statusCol = headers.indexOf('Status');
  const product1Col = headers.indexOf('Product1');
  const product2Col = headers.indexOf('Product2');
  const pickupCol = headers.indexOf('Pickup');
  const paymentMethodCol = headers.indexOf('PaymentMethod');
  const bankCodeCol = headers.indexOf('BankCode');
  const updatedAtCol = headers.indexOf('UpdatedAt');
  
  // 找到對應的行
  let rowIndex = -1;
  for (let i = 1; i < statusData.length; i++) {
    if (statusData[i][idCol] == orderId) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex > 0) {
    // 更新現有記錄
    if (statusCol >= 0) statusSheet.getRange(rowIndex, statusCol + 1).setValue(status);
    if (product1Col >= 0 && product1 !== undefined) statusSheet.getRange(rowIndex, product1Col + 1).setValue(product1);
    if (product2Col >= 0 && product2 !== undefined) statusSheet.getRange(rowIndex, product2Col + 1).setValue(product2);
    if (pickupCol >= 0 && pickup !== undefined) statusSheet.getRange(rowIndex, pickupCol + 1).setValue(pickup);
    if (paymentMethodCol >= 0 && paymentMethod) statusSheet.getRange(rowIndex, paymentMethodCol + 1).setValue(paymentMethod);
    if (bankCodeCol >= 0 && bankCode) statusSheet.getRange(rowIndex, bankCodeCol + 1).setValue(bankCode);
    if (updatedAtCol >= 0) statusSheet.getRange(rowIndex, updatedAtCol + 1).setValue(new Date());
  } else {
    // 新增記錄
    statusSheet.appendRow([orderId, status, product1 || '', product2 || '', pickup || '', paymentMethod || '', bankCode || '', new Date()]);
  }
}

// 輔助函數：找到欄位索引（支援多個可能的欄位名稱）
function findColumnIndex(headers, possibleNames) {
  for (let name of possibleNames) {
    const index = headers.indexOf(name);
    if (index >= 0) return index;
  }
  return -1;
}

// 輔助函數：根據值找到行號
function findRowByValue(data, colIndex, value) {
  for (let i = 1; i < data.length; i++) {
    if (data[i][colIndex] == value) {
      return i + 1; // +1 因為 sheet 是從 1 開始
    }
  }
  return -1;
}

// 輔助函數：建立回應（包含 CORS headers）
function createResponse(success, message, extraData = {}) {
  return ContentService.createTextOutput(JSON.stringify({
    success: success,
    message: message,
    ...extraData
  })).setMimeType(ContentService.MimeType.JSON);
}

// 處理 OPTIONS 請求（CORS preflight）
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

// 測試用的 GET 請求
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'API is running',
    timestamp: new Date()
  })).setMimeType(ContentService.MimeType.JSON);
}
