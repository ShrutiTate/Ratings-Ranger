
# 🏪 Rating Ranger

Rating Ranger is a simple store rating application where:  
- **Admins** can manage users and stores  
- **Store Owners** can add and manage their stores  
- **Users** can rate stores (1–5 stars)  

---

## 🚀 Features
- User authentication (Admin, Store Owner, Normal User)
- Store management (add, update, delete)
- Ratings system (1–5 stars, one rating per user per store)
- PostgreSQL database with constraints & indexes
- Secure password storage (bcrypt)
- JSON Web Token (JWT) authentication

---

## 📂 Project Structure

```

rating-ranger-backend/
│── server.js          # Entry point
│── routes/            # API routes
│── controllers/       # Route controllers
│── models/            # Database queries
│── db/                # Database connection
│── package.json       # Dependencies & scripts
│── .env.example       # Example environment variables
│── README.md          # Project documentation

rating-ranger-frontend/
│── src/               # React source code
│── public/            # Public assets
│── package.json       # Frontend dependencies & scripts
│── README.md          # Frontend documentation

````

---

## ⚙️ Setup

### 1. Clone repository
```bash
git clone https://github.com/ShrutiTate/Ratings-Ranger.git
cd Ratings-Ranger
````

### 2. Install dependencies

For backend:

```bash
cd backend
npm install
```

For frontend:

```bash
cd frontend
npm install
```

### 3. Configure environment

Create a `.env` file in the `backend/` root:

```env
DB_USER=your_db_user
DB_PASS=your_db_pass
DB_NAME=rating_ranger
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_secret_key
PORT=5000
```

### 4. Setup Database

Run the SQL scripts in PostgreSQL:

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (char_length(name) BETWEEN 20 AND 60),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_role VARCHAR(20) NOT NULL CHECK (user_role IN ('admin', 'normal', 'store_owner')),
    address VARCHAR(400) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores Table
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ratings Table
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, store_id)
);
```

### 5. Run the server

From `backend/`:

```bash
npm start
```

Server will run at:
👉 `http://localhost:5000`

---

## 🧪 API Endpoints

### Auth

* `POST /register` → Register new user
* `POST /login` → Login and get JWT token

### Stores

* `POST /stores` → Add a store (store owner only)
* `GET /stores` → List all stores
* `GET /stores/:id` → Get store details

### Ratings

* `POST /ratings` → Rate a store
* `GET /ratings/:storeId` → Get ratings for a store

---

## 📌 Tech Stack

* **Backend:** Node.js, Express.js
* **Frontend:** React.js
* **Database:** PostgreSQL
* **Auth:** JWT + bcrypt
* **ORM/Queries:** Native SQL queries with `pg`

---

## 🤝 Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

---

## 📜 License

MIT License © 2025 ShrutiTate

```

