# 🚀 Playwright UI + API Tests – SauceDemo, DummyJSON & Certificate App

This project contains automated UI and API tests using Playwright + TypeScript, as well as an E2E test created as part of a QA test assignment.

---

## 📌 Project Overview

The test suite covers:

### 🔐 UI Tests (SauceDemo)

- Login negative scenarios
- Checkout positive flow
- Checkout validation (negative cases)
- UI error handling
- Cancel navigation behavior

### 🌐 API Tests (DummyJSON)

- Get all users
- Get user by ID
- Create user

---

## 🧾 Test Task – Certificate Storage App

As part of the QA test assignment, an additional E2E test was implemented for the certificate storage application.

### ✅ Covered Scenario

- Open application (StackBlitz preview)
- Handle "Run this project" gate screen
- Upload certificate via drag & drop
- Verify certificate appears in the list
- Select certificate
- Verify certificate details:
  - Subject (Common Name)
  - Issuer
  - Valid From / Valid To

---

## ⚠️ Notes

- The application is hosted on StackBlitz, which introduces an intermediate anti-phishing screen ("Run this project")
- This may affect test stability
- Retry logic is implemented in the test to handle this behavior
- Drag & drop upload is handled programmatically via DataTransfer

---

## 🛠 Tech Stack

- Playwright
- TypeScript
- Node.js
- GitHub Actions (CI ready)

---

## 📂 Project Structure

tests/
  api/
    users/
      get-users.spec.ts
      get-user-by-id.spec.ts
      create-user.spec.ts
  ui/
    saucedemo-login-negative.spec.ts
    saucedemo-checkout-negative.spec.ts
    saucedemo-checkout-positive.spec.ts
  certificate.spec.ts

fixtures/
  cert.cer

playwright.config.ts

---

## ▶️ How to Run Tests

Install dependencies:

npm install
npx playwright install

Run all tests:

npx playwright test

Run UI tests only:

npx playwright test tests/ui

Run API tests only:

npx playwright test tests/api

Run certificate E2E test:

npx playwright test tests/certificate.spec.ts --project=chromium --workers=1 --headed

---

## 📊 Reporting

HTML Reporter:

npx playwright show-report

Trace Viewer is available for debugging failed tests.

---

## 🧪 Example Covered Scenarios

### UI

- Required field validation
- Error message behavior
- Navigation between checkout steps
- Successful order completion
- Cancel flow

### API

- Validate response status codes
- Verify response structure
- Validate returned user data
- Create new user and verify response

---

## 🎯 Highlights

- E2E automation with Playwright + TypeScript
- File upload via drag & drop
- Handling unstable UI (StackBlitz preview gate)
- Combined UI + API testing in one project
- Scalable and structured test architecture

---

## 👨‍💻 Author

Andrii Mota  
QA Automation Engineer (Playwright / TypeScript)