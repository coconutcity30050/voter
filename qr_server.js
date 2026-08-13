// server.js
const express = require('express');
const QRCode = require('qrcode');
const app = express();
app.use(express.json());

// 模擬資料庫：儲存票券編號與其狀態 (false = 未領/未驗, true = 已核銷)
const ticketDB = {
  "TICKET-12345": { used: false, owner: "王小明", event: "音樂會" },
  "TICKET-67890": { used: false, owner: "李小華", event: "音樂會" }
};

// 1. 領票 API：產生票券的 QR 碼圖片 (Data URL)
app.get('/api/get-ticket/:ticketId', async (req, res) => {
  const ticketId = req.params.ticketId;
  if (!ticketDB[ticketId]) {
    return res.status(404).json({ error: "查無此票券" });
  }
  
  try {
    // 將票券編號轉為 QR 碼 Base64 圖片
    const qrCodeImage = await QRCode.toDataURL(ticketId);
    res.json({ 
      ticketId, 
      info: ticketDB[ticketId], 
      qrCodeImage 
    });
  } catch (err) {
    res.status(500).json({ error: "產生 QR 碼失敗" });
  }
});

// 2. 驗票/核銷 API：掃描後送出驗證
app.post('/api/verify-ticket', (req, res) => {
  const { ticketId } = req.body;
  
  if (!ticketDB[ticketId]) {
    return res.json({ success: false, message: "❌ 驗票失敗：無效的票券代碼！" });
  }
  
  if (ticketDB[ticketId].used) {
    return res.json({ success: false, message: `⚠️ 警告：此票券已於先前被使用過！` });
  }
  
  // 標記為已使用（核銷）
  ticketDB[ticketId].used = true;
  return res.json({ 
    success: true, 
    message: `✅ 驗票成功！歡迎 ${ticketDB[ticketId].owner} 入場 (${ticketDB[ticketId].event})` 
  });
});

app.listen(3000, () => {
  console.log('伺服器執行於 http://localhost:3000');
});

