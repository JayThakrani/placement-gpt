# PlacementGPT - Placement Preparation Portal

PlacementGPT is a full-stack web application designed for students to prepare for placement drives and for administrators to manage student statistics, aptitude practice, coding challenges, and mock assessments.

---

## 🚀 Quick Setup & How to Run

### 1. Database Setup (MySQL)
Ensure MySQL is running on `localhost:3306`.
Import the database schema and sample seed data using MySQL CLI or MySQL Workbench:

```bash
mysql -u root -p < database.sql
```

*(If your MySQL root password is empty as configured in [`DBConnection.java`](file:///Users/jay/Desktop/placement-gpt/backend/src/main/java/com/placementgpt/util/DBConnection.java), simply run: `mysql -u root < database.sql`)*

---

### 2. Build & Run the Server

#### Option A: Run directly with Maven Jetty Plugin (Recommended)
Navigate to the `backend` folder and run Jetty server:

```bash
cd backend
mvn clean jetty:run
```

Once started, open your browser and navigate to:
👉 **[http://localhost:8080/placementgpt/](http://localhost:8080/placementgpt/)**

---

#### Option B: Deploy WAR file to Tomcat
1. Build the WAR archive:
   ```bash
   cd backend
   mvn clean package
   ```
2. Copy `backend/target/placementgpt.war` into your Tomcat `webapps/` folder.
3. Start Tomcat and visit `http://localhost:8080/placementgpt/`.

---

## 🔑 Default Login Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Student** | `student@placementgpt.com` | `student123` | Student Dashboard, Aptitude, Coding Arena, Mock Tests |
| **Admin** | `admin@placementgpt.com` | `admin123` | Admin Portal, Student Metrics, System Stats |

---

## 📁 Key Components & Servlets

- **Authentication**: [`LoginServlet.java`](file:///Users/jay/Desktop/placement-gpt/backend/src/main/java/com/placementgpt/controller/LoginServlet.java), [`RegisterServlet.java`](file:///Users/jay/Desktop/placement-gpt/backend/src/main/java/com/placementgpt/controller/RegisterServlet.java)
- **Student Dashboard**: [`DashboardServlet.java`](file:///Users/jay/Desktop/placement-gpt/backend/src/main/java/com/placementgpt/controller/DashboardServlet.java)
- **Aptitude Practice**: [`AptitudeServlet.java`](file:///Users/jay/Desktop/placement-gpt/backend/src/main/java/com/placementgpt/controller/AptitudeServlet.java)
- **Coding Arena**: [`CodingServlet.java`](file:///Users/jay/Desktop/placement-gpt/backend/src/main/java/com/placementgpt/controller/CodingServlet.java)
- **Admin Management**: [`AdminDashboardServlet.java`](file:///Users/jay/Desktop/placement-gpt/backend/src/main/java/com/placementgpt/controller/AdminDashboardServlet.java), [`AdminStudentsServlet.java`](file:///Users/jay/Desktop/placement-gpt/backend/src/main/java/com/placementgpt/controller/AdminStudentsServlet.java)
- **Database Utilities**: [`DBConnection.java`](file:///Users/jay/Desktop/placement-gpt/backend/src/main/java/com/placementgpt/util/DBConnection.java)
