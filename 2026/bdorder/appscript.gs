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
    
    if (!statusSheet) {
      return createResponse(false, '請先建立 order_status sheet');
    }
    
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'update') {
      return updateOrder(orderSheet, statusSheet, data);
    } else if (action === 'add') {
      return addOrder(orderSheet, statusSheet, data);
    } else if (action === 'payment') {
      return registerPayment(statusSheet, data);
    } else if (action === 'confirmPayment') {
      return confirmPayment(statusSheet, data);
    } else if (action === 'delivery') {
      return confirmDelivery(statusSheet, data);
    } else {
      return createResponse(false, '未知的操作');
    }
    
  } catch (error) {
    Logger.log('錯誤: ' + error.toString());
    return createResponse(false, error.toString());
  }
}

// 更新訂單（編輯確認）
function updateOrder(orderSheet, statusSheet, data) {
  const orderData = orderSheet.getDataRange().getValues();
  const headers = orderData[0];
  
  const idCol = headers.indexOf('Id');
  const quantityCol = findColumnIndex(headers, ['Quantity', 'No']);
  
  let rowIndex = findRowByValue(orderData, idCol, data.id);
  
  if (rowIndex === -1) {
    return createResponse(false, '找不到對應的訂單');
  }
  
  if (quantityCol >= 0 && data.quantity !== undefined) {
    orderSheet.getRange(rowIndex, quantityCol + 1).setValue(data.quantity);
  }
  
  const status = data.status || 'confirmed';
  const confirmAt = (status === 'confirmed') ? new Date() : undefined;
  updateStatusSheet(statusSheet, data.id, status, data.paymentMethod, data.bankCode, data.product1, data.product2, data.pickup, undefined, confirmAt);
  
  return createResponse(true, '訂單已更新');
}

// 新增訂單
function addOrder(orderSheet, statusSheet, data) {
  const orderData = orderSheet.getDataRange().getValues();
  const headers = orderData[0];
  
  const idCol = headers.indexOf('Id');
  let maxId = 0;
  for (let i = 1; i < orderData.length; i++) {
    const currentId = parseInt(orderData[i][idCol]) || 0;
    if (currentId > maxId) maxId = currentId;
  }
  const newId = maxId + 1;
  
  const newRow = new Array(headers.length).fill('');
  newRow[idCol] = newId;
  newRow[headers.indexOf('Name')] = data.name || '';
  newRow[headers.indexOf('Phone')] = data.phone || '';
  
  const quantityCol = findColumnIndex(headers, ['Quantity', 'No']);
  if (quantityCol >= 0) newRow[quantityCol] = data.quantity || 0;
  
  orderSheet.appendRow(newRow);
  
  const status = data.status || 'confirmed';
  const confirmAt = (status === 'confirmed') ? new Date() : undefined;
  updateStatusSheet(statusSheet, newId, status, null, null, data.product1, data.product2, null, undefined, confirmAt);

  return createResponse(true, '新增成功', { newId: newId });
}

// 登記付款
function registerPayment(statusSheet, data) {
  const status = data.status || 'paid';
  updateStatusSheet(statusSheet, data.id, status, data.paymentMethod, data.bankCode, undefined, undefined, data.pickup, data.note, undefined);
  
  return createResponse(true, '付款資訊已登記');
}

// 確認付款（管理員功能）
function confirmPayment(statusSheet, data) {
  updateStatusSheet(statusSheet, data.id, 'checked', undefined, undefined, undefined, undefined, undefined, undefined, undefined);
  
  return createResponse(true, '已確認付款');
}

// 確認交貨
function confirmDelivery(statusSheet, data) {
  updateStatusSheet(statusSheet, data.id, 'completed', undefined, undefined, undefined, undefined, undefined, undefined, undefined);
  
  return createResponse(true, '已確認交貨');
}

// 更新或新增狀態記錄到 order_status sheet
function updateStatusSheet(statusSheet, orderId, status, paymentMethod, bankCode, product1, product2, pickup, note, confirmAt) {
  const statusData = statusSheet.getDataRange().getValues();
  
  // 如果是空的 sheet，先建立標題
  if (statusData.length === 0 || !statusData[0][0]) {
    statusSheet.appendRow(['Id', 'Status', 'Product1', 'Product2', 'Pickup', 'PaymentMethod', 'BankCode', 'Note', 'ConfirmAt', 'UpdatedAt']);
    statusSheet.appendRow([orderId, status, product1 || '', product2 || '', pickup || '', paymentMethod || '', bankCode || '', note || '', confirmAt || '', new Date()]);
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
  let noteCol = headers.indexOf('Note');
  let confirmAtCol = headers.indexOf('ConfirmAt');
  const updatedAtCol = headers.indexOf('UpdatedAt');
  
  // 如果沒有 Note 欄位，自動添加
  if (noteCol === -1) {
    noteCol = headers.length;
    statusSheet.getRange(1, noteCol + 1).setValue('Note');
  }
  
  // 如果沒有 ConfirmAt 欄位，自動添加
  if (confirmAtCol === -1) {
    confirmAtCol = headers.length;
    statusSheet.getRange(1, confirmAtCol + 1).setValue('ConfirmAt');
  }
  
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
    if (noteCol >= 0 && note !== undefined) statusSheet.getRange(rowIndex, noteCol + 1).setValue(note);
    if (confirmAtCol >= 0 && confirmAt !== undefined) statusSheet.getRange(rowIndex, confirmAtCol + 1).setValue(confirmAt);
    if (updatedAtCol >= 0) statusSheet.getRange(rowIndex, updatedAtCol + 1).setValue(new Date());
  } else {
    // 新增記錄
    statusSheet.appendRow([orderId, status, product1 || '', product2 || '', pickup || '', paymentMethod || '', bankCode || '', note || '', confirmAt || '', new Date()]);
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
