## 🚀 Deployment Guide (Backend)

### 🛠️ Requirements
- MongoDB Atlas URI in `.env`
- Redis (Upstash) keys in `.env`
- Set `NODE_ENV=production` for live deployment

---

### 🔁 Deployment Platform (Recommended)
**Render** - https://render.com

- Create a new Web Service
- Connect to your GitHub repo
- Set build command: `npm install`
- Set start command: `npm run dev` or `node src/server.js`
- Add Environment Variables from `.env`

---

### 🔌 API Base URL
Once deployed, your API will be available at:
