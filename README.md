# no-api-twitter-tracker-n8n 🚀

A no-code/low-code workflow built using **n8n** that monitors Twitter (without using the Twitter API) for tweets related to **Podha Protocol** and **RWA narratives**, and sends filtered results to a **Discord** channel every hour.

---

## 🔍 Use Case

Track important narratives like:
- `Podha AND (RWA OR Real World Assets OR Yield)`
- `Solana AND (Smart Vaults OR Safe Yield OR Podha)`
- `Bitcoin AND (tokenized treasury OR credit protocol OR RWA on-chain)`
- `DeFi AND (custodial vault OR delta neutral)`

---

## 🛠️ Features

- ✅ Scrapes Twitter using Puppeteer (no API)
- ✅ Filters blue-verified tweets with ≥ 3 likes
- ✅ Supports complex keyword logic (AND / OR)
- ✅ Deduplicates tweets via Airtable
- ✅ Sends formatted previews to Discord
- ✅ Runs automatically every hour
- ✅ Graceful error handling + retries

---

## 📂 Folder Structure

n8n-twitter-listener/
├── scrape-twitter.js # Puppeteer-based scraper script
├── .env # Environment variables (cookies etc.)
├── output.json # Output for debugging
└──My workflow.json # Exported n8n workflow (import this in n8n)


---

## ⚙️ Requirements

- Node.js + npm
- n8n (local or cloud)
- Puppeteer (core)
- Airtable account & base
- Discord webhook URL
- Twitter session cookies

---

## 🔧 Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/ritika-chaudhary-21/no-api-twitter-tracker-n8n.git
   cd no-api-twitter-tracker-n8n
2. Install Dependencies
   ```bash
   npm install
3. Create a .env file
   ```env
   TWITTER_COOKIES=[PASTE_YOUR_SESSION_COOKIES_HERE]
4. Import the My workflow.json into n8n

---

## 📤 How It Works (Short Summary)
1. The Execute Command node runs scrape-twitter.js with each query.
2. Output is parsed via Code node.
3. Tweets are checked against Airtable (deduplication).
4. New tweets are stored + formatted.
5. Sent to Discord using HTTP Request node.
6. Runs every hour with Schedule Trigger.

---

## 📸 Screenshots

<img width="1841" height="781" alt="image" src="https://github.com/user-attachments/assets/3da050aa-2323-4d41-9aa6-a66b445200f7" />
<img width="1912" height="895" alt="image" src="https://github.com/user-attachments/assets/b69d8db9-9d44-4013-b80b-20042a9091e8" />

