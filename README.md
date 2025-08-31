# 🚀 OpenFGA RBAC Demo (Node.js + Express + React)

This project demonstrates **Role-Based Access Control (RBAC)** using **[OpenFGA](https://openfga.dev/)** with a Node.js backend and React frontend.  
Users can be assigned roles (`admin`, `viewer`) to manage **dashboard access** dynamically.

---

## 📂 Project Structure
```
/src
  /routes      → Express routes (auth, dashboard)
  /services    → OpenFGA service (assign/check roles)
  server.js    → Express server entry
/frontend      → React client (optional)
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repo
```bash
git clone https://github.com/your-username/openfga-rbac-demo.git
cd openfga-rbac-demo
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Create `.env` file
Create a `.env` file in the project root:

```env
# OpenFGA API
OPENFGA_API_URL=http://localhost:8080
OPENFGA_STORE_ID=your_store_id_here
OPENFGA_MODEL_ID=your_model_id_here

# Auth (Client Credentials)
OPENFGA_API_ISSUER=https://your-issuer-url
OPENFGA_API_AUDIENCE=https://api.openfga.dev
OPENFGA_CLIENT_ID=your_client_id
OPENFGA_CLIENT_SECRET=your_client_secret

# Server
PORT=4000
```

👉 If you’re running **OpenFGA locally with Docker**, the default API URL is `http://localhost:8080`.

---

## ▶️ Running the App

### Start backend server
```bash
npm run dev
```

Server will run at:
```
http://localhost:4000
```

---

## 📡 Sample API Calls

### ✅ Assign a Role
```bash
POST http://localhost:4000/auth/assign
Content-Type: application/json

{
  "userId": "alice",
  "role": "admin"
}
```

### ✅ Check Dashboard Access
```bash
GET http://localhost:4000/dashboard?userId=alice
```

Response:
```json
{ "access": true }
```

---

## 🛠️ Tech Stack
- **Node.js + Express** – Backend API  
- **OpenFGA SDK** – Role/permission checks  
- **Dotenv** – Environment variables  
- **React (optional)** – Dashboard frontend  

---

## 📌 Notes
- For **simple apps** → use DB-based roles.  
- For **complex org/team hierarchies** → use OpenFGA.  

---
