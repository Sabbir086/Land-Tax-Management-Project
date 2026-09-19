# Government Land Tax Management Portal

## 📖 Overview
The **Government Land Tax Management Portal** is a full-stack web application designed to digitize and streamline the process of managing land records (Khotiyan) and tax payments (Dakhila). Originally conceptualized as a console-based application, it has been transformed into a modern, responsive web application backed by a high-performance C++ server.

This system empowers administrators to seamlessly add new land records, automatically calculate appropriate land taxes based on location and area, process payments, and search for specific land identifiers in real-time.

## 🚀 Key Features

*   **Secure Authentication:** Dedicated administrative login interface to protect sensitive government data.
*   **Dynamic Dashboard:** Real-time statistics displaying total records, collected payments, due amounts, and deleted records.
*   **Khotiyan Management:** Easily add new land records with automated tax calculations based on:
    *   Land Area (Decimals)
    *   Land Type (Residential, Agricultural, Commercial, Industrial)
    *   Location (Urban / Rural)
*   **Payment Processing:** Process tax payments and instantly update due balances.
*   **Search Functionality:** Quickly fetch land records and tax statuses using a unique Khotiyan ID.
*   **Responsive UI:** A modern, blue-themed user interface that adapts to various screen sizes.
*   **Interactive Developer Credits:** A quick-access popup displaying the core development team.

## 🛠️ Technology Stack

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript
*   **Backend:** C++ (using the [Crow Microframework](https://github.com/CrowCpp/Crow))
*   **Communication:** RESTful API with JSON data formatting
*   **Core Logic:** Data structures and algorithms implemented in C++

## 👥 Development Team
*   **Sabbir Hosen Joy**
*   **Fatin Sarhad**
*   **Monira Akter Payel**

## ⚙️ Installation & Setup Guide

### Prerequisites
1.  A C++ Compiler (e.g., GCC/G++) installed on your system.
2.  The `crow_all.h` header file downloaded from the Crow Framework repository.

### Step 1: Run the Backend Server
1. Place the `server.cpp` file and `crow_all.h` in the same directory.
2. Open your terminal or command prompt in that directory.
3. Compile the server code:
   ```bash
   g++ server.cpp -o server -lpthread
   ```
4. Execute the compiled server:
   ```bash
   ./server
   ```
   *The server will start listening for API requests on `http://localhost:18080`.*

### Step 2: Launch the Frontend App
1. Ensure the `index.html`, `style.css`, and `script.js` files are in the same directory.
2. Double-click the `index.html` file to open it in your preferred web browser.

## 🔐 Demo Credentials
To access the system, use the following administrator credentials:
*   **Username:** MOFASA
*   **Password:** MOFASA123

## 📡 API Endpoints (For Developers)
*   `GET /api/stats` - Fetches dashboard statistics.
*   `GET /api/records` - Retrieves all active land records.
*   `POST /api/records` - Adds a new land record to the system.
*   `DELETE /api/records/<id>` - Deletes a specific land record.
*   `GET /api/search/<id>` - Fetches details for a specific Khotiyan ID.