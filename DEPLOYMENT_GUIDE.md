# Health Vault Deployment Guide

This guide explains how to deploy the **Health Vault** application using a split-deployment strategy:
- **Backend (Node.js)** & **AI Server (Python)** -> **Render** (Supports WebSockets/Socket.io)
- **Frontend (React)** -> **Vercel** (Optimized for static sites)

## Repository Setup (Monorepo)
**You do NOT need separate repositories.**
Keep your current structure (`frontend` and `backend` folders in one repo).
1.  Initialize git in the root `health_vault` folder.
2.  Push the **entire project** to a single GitHub repository.
3.  Both Render and Vercel are smart enough to deploy just the specific folder they need.

---

## Part 1: Deploying Backends to Render

We will use the `render.yaml` file to deploy both backend services automatically.

### Steps:
1.  **Push your code to GitHub/GitLab**.
2.  **Sign up/Log in to [Render](https://render.com)**.
3.  Go to **Blueprints** and click **New Blueprint Instance**.
4.  Connect your repository.
5.  Render will detect the `render.yaml` file and show you two services:
    - `health-vault-backend` (Node.js)
    - `health-vault-ai` (Python)
6.  **Environment Variables**: You will be prompted to enter the values for your environment variables (from your `.env` file).
    - `MONGO_URI`
    - `JWT_SECRET`
    - `GEMINI_API`
    - `CLOUD_NAME`, `API_KEY`, `API_SECRET` (Cloudinary)
    - `EMAIL_USER`, `EMAIL_PASS`

    **Copy and Paste these values:**
    ```env
    MONGO_URI=mongodb+srv://mufaddaltopiwala15:xKN8RHGctkCiTX0U@arogya-vault.3bg8o.mongodb.net/arogya-vault
    JWT_SECRET=abcdef
    GEMINI_API=AIzaSyB2lZuc6BOL9cK4u9TARsv_BMsw24hmVnY
    CLOUD_NAME=dhrz9ra0a
    API_KEY=757831154726931
    API_SECRET=i5d_bdMuFRzv_wbDMujRMuNSyJw
    EMAIL_USER=pathfinderoffical5@gmail.com
    EMAIL_PASS=yzmx qqrj iiec trgs
    ```
7.  Click **Apply**. Render will start building and deploying both services.

### Post-Deployment:
- Once deployed, Render will provide you with **URLs** for both services (e.g., `https://health-vault-backend.onrender.com` and `https://health-vault-ai.onrender.com`).
- **Copy these URLs**, you will need them for the Frontend configuration.

---

## Part 2: Deploying Frontend to Vercel

### Steps:
1.  **Sign up/Log in to [Vercel](https://vercel.com)**.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    - **Framework Preset**: Vite
    - **Root Directory**: Click `Edit` and select `frontend`.
5.  **Environment Variables**: Add the following variables:
    - `VITE_API_URL`: The URL of your **Node.js Backend** from Render (e.g., `https://health-vault-backend.onrender.com/api/v1`).
    - `VITE_AI_API_URL`: The URL of your **Python AI Server** from Render (e.g., `https://health-vault-ai.onrender.com`).
6.  Click **Deploy**.

---

## Part 3: Final Configuration

### Update CORS on Backend
Once you have your **Frontend URL** from Vercel (e.g., `https://health-vault-frontend.vercel.app`), you need to update your Backend to allow requests from this URL.

1.  Go to your **Render Dashboard**.
2.  Select `health-vault-backend`.
3.  Go to **Environment** variables.
4.  Add/Update a variable `FRONTEND_URL` with your Vercel URL.
    The code is already set up to use this variable automatically.

### Update Socket.io Client
Ensure your frontend `socket.js` connects to the Render backend URL.
- The `VITE_API_URL` env var handles the Axios requests.
- For Socket.io, you might need to ensure it uses the same base URL.

---

## Troubleshooting
- **Socket.io Connection Issues**: Ensure your Render backend service type is "Web Service" (which it is in `render.yaml`).
- **Build Fails**: Check the logs in Render/Vercel. Ensure all dependencies are in `package.json`.
