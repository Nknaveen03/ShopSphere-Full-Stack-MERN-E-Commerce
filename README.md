   # ◈ ShopSphere — Full-Stack MERN E-Commerce

A complete, production-ready e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js).

---

## 🚀 Live Demo

- **Frontend:** `https://shopsphere-client.vercel.app`
- **Backend:**  `https://shopsphere-api.onrender.com`

---

## ✨ Features

### Frontend
- 🏠 Responsive landing page with hero banner & featured products
- 🔍 Product listing with search, category filter, price filter & pagination
- 📦 Product detail page with image gallery, quantity selector & reviews
- 🛒 Full shopping cart (add, update qty, remove)
- 💳 Two-step checkout with shipping form & payment method selection
- 🔐 JWT authentication — Register, Login, Logout
- 📊 User dashboard — Profile management & order history
- 📋 Order detail page with live status tracker
- 📱 Fully mobile-responsive design

### Backend
- 🔑 JWT-based auth with bcrypt password hashing
- 📦 Full CRUD for products (admin-protected)
- 🛒 Cart CRUD with stock validation
- 🧾 Order creation with auto stock deduction
- 🌱 Database seeder with 30 sample products

---

## 🛠 Tech Stack

| Layer       | Technology |
|-------------|------------|
| Frontend    | React 18, Vite, React Router v6 |
| Styling     | Pure CSS (no framework) |
| HTTP Client | Axios |
| State       | Context API |
| Backend     | Node.js, Express.js |
| Database    | MongoDB Atlas + Mongoose |
| Auth        | JWT + bcryptjs |
| Deployment  | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
shopsphere/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── product/       # ProductCard
│   │   │   └── common/        # ProtectedRoute
│   │   ├── context/           # AuthContext, CartContext
│   │   ├── pages/             # All page components
│   │   ├── services/          # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── vercel.json
│
└── server/                    # Express backend
    ├── config/
    │   └── db.js              # MongoDB connection
    ├── controllers/           # Business logic
    ├── middleware/
    │   └── authMiddleware.js  # JWT protect + adminOnly
    ├── models/                # Mongoose schemas
    ├── routes/                # Express routers
    ├── utils/
    │   └── seedData.js        # DB seeder
    └── server.js              # Entry point
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (free tier works fine)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/shopsphere.git
cd shopsphere
```

### 2. Set up the Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/shopsphere?retryWrites=true&w=majority
JWT_SECRET=your_very_long_random_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Seed the database with sample products:
```bash
npm run seed
```

Start the server:
```bash
npm run dev
```
Server runs at `http://localhost:5000`

### 3. Set up the Frontend

```bash
cd ../client
npm install
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:
```bash
npm run dev
```
App runs at `http://localhost:5173`

---

## 🔑 API Endpoints

### Auth & User Management
| Method | Endpoint            | Access  | Description |
|--------|---------------------|---------|-------------|
| POST   | /api/auth/register  | Public  | Register new user |
| POST   | /api/auth/login     | Public  | Login & get token |
| GET    | /api/auth/profile   | Private | Get own profile |
| PUT    | /api/auth/profile   | Private | Update profile |
| GET    | /api/users          | Admin   | Get all registered users |
| DELETE | /api/users/:id      | Admin   | Delete user account |

### Products
| Method | Endpoint              | Access       | Description |
|--------|-----------------------|--------------|-------------|
| GET    | /api/products         | Public       | Get all (filter/search/paginate) |
| GET    | /api/products/featured| Public       | Get featured products |
| GET    | /api/products/categories | Public    | Get category list |
| GET    | /api/products/:id     | Public       | Get product by ID |
| POST   | /api/products         | Admin        | Create product |
| PUT    | /api/products/:id     | Admin        | Update product |
| DELETE | /api/products/:id     | Admin        | Delete product |

### Cart
| Method | Endpoint               | Access  | Description |
|--------|------------------------|---------|-------------|
| GET    | /api/cart              | Private | Get user's cart |
| POST   | /api/cart/add          | Private | Add product to cart |
| PUT    | /api/cart/update       | Private | Update item quantity |
| DELETE | /api/cart/remove/:id   | Private | Remove item from cart |
| DELETE | /api/cart/clear        | Private | Empty cart |

### Orders & Admin Stats
| Method | Endpoint             | Access  | Description |
|--------|----------------------|---------|-------------|
| POST   | /api/orders          | Private | Place new order |
| GET    | /api/orders/my-orders| Private | View personal orders |
| GET    | /api/orders/:id      | Private | View order by ID |
| GET    | /api/orders          | Admin   | View all orders |
| PUT    | /api/orders/:id      | Admin   | Update order status |
| DELETE | /api/orders/:id      | Admin   | Delete order entry |
| GET    | /api/admin/stats     | Admin   | Get overview stats |

---

## 🗃 MongoDB Atlas Setup (Fix Common Issues)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **M0** cluster
3. Click **Database Access** → Add user → set username & password (no special chars)
4. Click **Network Access** → Add IP → choose **Allow Access from Anywhere** (`0.0.0.0/0`)
   - ⚠️ This is the most common issue! Without this, your app can't connect from Render/Vercel
5. Click **Connect** → **Drivers** → copy the URI
6. Replace `<password>` in the URI with your actual password
7. Paste into `MONGO_URI` in `.env`

---

## 🌐 Deployment Guide

### Deploy Backend to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = your MongoDB Atlas URI
   - `JWT_SECRET` = any long random string (min 32 chars)
   - `JWT_EXPIRES_IN` = `7d`
   - `CLIENT_URL` = your Vercel URL (add after deploying frontend)
6. Click **Create Web Service** — wait ~3 minutes
7. Copy the Render URL (e.g. `https://shopsphere-api.onrender.com`)

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Settings:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-render-url.onrender.com/api`
5. Click **Deploy** — done!
6. Copy your Vercel URL and add it to Render's `CLIENT_URL` env var

### Seed Production Database
After deploying, run the seeder once:
```bash
cd server
MONGO_URI="your_atlas_uri" node utils/seedData.js
```

---

## 👤 Demo Credentials

After running the seed script:
- **Admin:** admin@shopsphere.com / Admin@123
- Use the **Demo User / Demo Admin** buttons on the login page

---

## 📝 License

MIT — free to use for personal & commercial projects.
