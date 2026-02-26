🚀 Playwright E2E Tests – SauceDemo

This project contains end-to-end automated tests for the SauceDemo web application using Playwright + TypeScript.

📌 Project Overview

The test suite covers:

🔐 Login negative scenarios

🛒 Checkout positive flow

❌ Checkout validation (negative cases)

UI error handling

Cancel navigation behavior

The goal of this project is to demonstrate practical automation testing skills and E2E test structure.

🛠 Tech Stack

Playwright

TypeScript

Node.js

GitHub Actions (CI ready)

📂 Project Structure
tests/
  ├── saucedemo-login-negative.spec.ts
  ├── saucedemo-checkout-negative.spec.ts
  ├── saucedemo-checkout-positive.spec.ts
playwright.config.ts
▶️ How to Run Tests

Install dependencies:

npm install

Run tests:

npx playwright test

Run in headed mode:

npx playwright test --headed

Open HTML report:

npx playwright show-report
🧪 Example Covered Scenarios

Required field validation

Error message appearance and close behavior

Navigation between checkout steps

Successful order completion

Cancel button functionality

📊 Reporting

HTML Reporter

Trace Viewer

Debug mode support

👨‍💻 Author

Andrii Mota
QA Automation Engineer (Playwright / TypeScript)
