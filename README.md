# Housing Disrepair Form

This is a web application designed to collect and process housing disrepair claims. The user-friendly frontend captures details regarding basic tenant information, damp/mould issues, leaks, and structural faults. A paired Node.js backend provides endpoints for saving submission data directly to an Excel (`.xlsx`) sheet.

## Features

- **Dynamic Form:** A responsive HTML/CSS form that toggles dynamic sections (e.g., Damp details, Leak details) based on user selections.
- **Client-Side Rendering:** Uses `localStorage` to quickly capture form submissions and display a summary on `result.html` without requiring a page reload to the server.
- **Data Export Server:** A lightweight Express.js server that can receive incoming payload data (at `/submit`) and append it to `data.xlsx`. Include an `/export` endpoint to download the spreadsheet payload directly.

## Project Structure

- `index.html`: The main user interface with dynamic JavaScript behaviors for form handling.
- `result.html`: Summarizes output stored on `localStorage` post form-submission.
- `style.css`: The stylesheet governing the frontend layout and design aesthetics.
- `server.js`: The Express.js backend that handles Excel data storage.

## Prerequisites

- Node.js (v14 or higher is recommended)
- npm (Node Package Manager)

## Installation

1. Clone or download this repository.
2. Open a terminal or Command Prompt at the project root (`housing-form`).
3. Install the dependencies based on `server.js` requirements:
   ```cmd
   npm install express body-parser xlsx
   ```

## Usage

1. **Start the backend server:**
   ```cmd
   node server.js
   ```
   The server will start running on `http://localhost:3000`.

2. **Access the Application:**
   Open a web browser and navigate to `http://localhost:3000/index.html`.

3. **Exporting Data:**
   You can easily download the aggregated data by visiting `http://localhost:3000/export` in your browser.

> **Note on Submission Flow:** Currently, the frontend `index.html` handles the final submission by persisting the form to local storage and redirecting to `result.html`. If you plan to fully integrate the backend, you can modify `index.html`'s submit listener to POST data to the `/submit` endpoint using the `fetch` API.
