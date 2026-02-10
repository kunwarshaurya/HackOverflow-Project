# 🚀 Unified Campus Resource & Event Management System (Backend)

This is the backend API for the HackOverflow 2026 project. It handles user authentication, event management, resource conflict detection, and analytics.

## 🛠 Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose)
* **Auth:** JWT (JSON Web Tokens)
* **File Uploads:** Multer

---

## ⚙️ Setup & Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    PORT=9999
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    ```

3.  **Run the Server**
    ```bash
    npm run dev
    ```

---

## 📡 API Endpoints

### 1. Authentication (`/api/auth`)
| Method | Endpoint    | Description             | Auth Required |
| :---   | :---        | :---                    | :---          |
| POST   | `/register` | Register new user       | ❌            |
| POST   | `/login`    | Login & get Token       | ❌            |

### 2. Events (`/api/events`)
| Method | Endpoint       | Description                  | Auth Required |
| :---   | :---           | :---                         | :---          |
| GET    | `/`            | Get all events               | ✅ (Any)      |
| POST   | `/`            | Create new event request     | ✅ (Any)      |
| PUT    | `/:id/status`  | Approve/Reject (Admin only)  | ✅ (Admin)    |
| POST   | `/:id/settle`  | Upload Receipts (Organizer)  | ✅ (Owner)    |

### 3. Analytics (`/api/analytics`)
| Method | Endpoint     | Description             | Auth Required |
| :---   | :---         | :---                    | :---          |
| GET    | `/dashboard` | Get charts & budget data| ✅ (Admin)    |

---

## 📂 Key Features

* **Conflict Detection:** The system automatically rejects event requests if the venue is already booked for that time slot.
* **RBAC (Role-Based Access Control):**
    * **Students:** Can view approved events.
    * **Club Leads:** Can create events and upload receipts.
    * **Admins:** Can approve requests and view financial analytics.

## 🧪 Testing with Postman
1.  **Login** as a user to get the `token`.
2.  Add the token to the **Authorization** tab (Select `Bearer Token`).
3.  Hit the endpoints!

**https://drive.google.com/drive/folders/1R0Yt0MG49FtQhT-BTkxgvHyMbOKacnnM**
