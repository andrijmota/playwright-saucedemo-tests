# 🚀 Playwright UI + API Tests – SauceDemo & DummyJSON

This project contains automated UI and API tests using Playwright + TypeScript.

---

## 📌 Project Overview

The test suite covers both **UI (E2E)** and **API testing**:

### 🔐 UI Tests (SauceDemo)

* Login negative scenarios
* Checkout positive flow
* Checkout validation (negative cases)
* UI error handling
* Cancel navigation behavior

### 🌐 API Tests (DummyJSON)

* Get all users
* Get user by ID
* Create user

The goal of this project is to demonstrate practical automation testing skills, including UI and API testing, debugging, and test structure.

---

## 🛠 Tech Stack

* Playwright
* TypeScript
* Node.js
* GitHub Actions (CI ready)

---

## 📂 Project Structure

```text
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

playwright.config.ts
```

---

## ▶️ How to Run Tests

Install dependencies:

```bash
npm install
npx playwright install
```

Run all tests:

```bash
npx playwright test
```

Run UI tests only:

```bash
npx playwright test tests/ui
```

Run API tests only:

```bash
npx playwright test tests/api
```

Run in headed mode:

```bash
npx playwright test --headed
```

---

## 📊 Reporting

* HTML Reporter

```bash
npx playwright show-report
```

* Trace Viewer (for debugging failed tests)

---

## 🧪 Example Covered Scenarios

### UI

* Required field validation
* Error message behavior
* Navigation between checkout steps
* Successful order completion
* Cancel flow

### API

* Validate response status codes
* Verify response structure
* Validate returned user data
* Create new user and verify response

---

## 💡 Notes

* API tests use DummyJSON fake REST API
* Retries and trace are enabled for debugging
* Tests are structured for scalability

---

## 👨‍💻 Author

Andrii Mota
QA Automation Engineer (Playwright / TypeScript)
