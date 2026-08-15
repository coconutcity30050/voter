# voter

社區區權會議表決票之製票與驗票系統

## 檔案說明
- `voter.html` : 表決票產生器，讀取持分檔 `household_db.json` 產生帶 QR 的表決票
- `qr_server.js` : Node.js 驗證伺服器，讀 `household_db.json` 驗證 QR
- `qr_verifier.html` : 相機掃描驗證介面
- `household_db.json` : 伺服器用 JSON 資料庫
- `verified_ballots.json` : 表決票驗證紀錄檔

## 資料庫維護流程
- 伺服器會自動熱重載 `household_db.json`

## 安全改動
- 密碼僅存在伺服器端，不暴露於前端
- 簽章驗證在伺服器內部完成

## 啟動
```bash
node qr_server.js
# 前往 http://localhost:3000/qr_verifier.html 使用掃描介面
```

