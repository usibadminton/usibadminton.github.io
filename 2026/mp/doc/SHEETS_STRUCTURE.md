# Google Sheets Structure - Column Headers

## 1. Players Sheet
| Column | Header Name | Example Value |
|--------|-------------|---------------|
| A | 姓名 | 王小明 |
| B | 簽到狀態 | TRUE / FALSE |

## 2. Rounds Sheet
| Column | Header Name | Example Value |
|--------|-------------|---------------|
| A | 場次ID | Match-001 |
| B | 日期 | 2025-12-31 |
| C | 備註 | 第1次比賽 |

## 3. Teams Sheet
| Column | Header Name | Example Value |
|--------|-------------|---------------|
| A | 場次ID | Match-001 |
| B | 隊伍 | 黑桃 / 紅心 |
| C | 編號 | 1, 2, 3... 12 |
| D | 姓名 | 王小明 |

## 4. Matches Sheet
| Column | Header Name | Example Value |
|--------|-------------|---------------|
| A | 場次ID | Match-001 |
| B | 局數 | 1, 2, 3... 6 |
| C | 黑桃1 | 王小明 |
| D | 黑桃2 | 李小華 |
| E | 紅心1 | 張大同 |
| F | 紅心2 | 陳小英 |

## 5. Scores Sheet
| Column | Header Name | Example Value |
|--------|-------------|---------------|
| A | 場次ID | Match-001 |
| B | 局數 | 1, 2, 3... 6 |
| C | 黑桃分數 | 21 |
| D | 紅心分數 | 19 |
| E | 記錄時間 | 2025-12-31 14:30:00 |

---

## Setup Instructions

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1ej5da-A-kHbnrUA0fKqy3bGo_Y6rlHMdhy1GPcV55RA/edit

2. Make sure each sheet has the correct name and column headers:
   - **Players** sheet with headers in row 1
   - **Rounds** sheet with headers in row 1
   - **Teams** sheet with headers in row 1
   - **Matches** sheet with headers in row 1
   - **Scores** sheet with headers in row 1

3. Copy the headers EXACTLY as shown above (including Chinese characters)

4. The data will start from row 2 onwards

---

## Troubleshooting

If matches.html shows nothing:
1. Check that Teams sheet has data for the round (場次ID = Match-001)
2. Check that Teams sheet has "黑桃" and "紅心" teams with 12 players each
3. Check that column headers match exactly (case-sensitive)
4. Open browser console (F12) to see any error messages
