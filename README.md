# Government Land Portal (Web + C++ Backend)

This project contains everything you need to run your web-based Land Management System.

## Files
1. `index.html` - The main UI structure.
2. `style.css` - Design and layout styling.
3. `script.js` - Dynamic UI and communication with the C++ backend.
4. `server.cpp` - The C++ web server (using Crow framework) carrying the logic from your terminal app.

## How to Run

### Step 1: Set up the Backend (C++)
1. You will need the **Crow Framework**. Download `crow_all.h` from the official Crow GitHub repo:
   https://github.com/CrowCpp/Crow/releases
2. Place `crow_all.h` in this folder alongside `server.cpp`.
3. Compile the server:
   ```bash
   g++ server.cpp -o server -lpthread
   ```
4. Run the compiled executable:
   ```bash
   ./server
   ```
   *(The server will start listening on http://localhost:18080)*

### Step 2: Start the Frontend (Website)
1. Simply double-click `index.html` to open it in your browser.
2. Login credentials:
   - Username: **MOFASA**
   - Password: **MOFASA123**
3. Once logged in, the website will fetch data from your running C++ backend via the API.
