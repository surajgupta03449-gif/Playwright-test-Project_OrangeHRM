# OrangeHRM Playwright POM Framework

A ready-to-run Playwright JavaScript automation framework for the public OrangeHRM demo using Page Object Model (POM), fixtures, data generation, screenshots/video/traces on failure, HTML/JUnit reporting, GitHub Actions and Jenkins.

## Application

- Base URL: `https://opensource-demo.orangehrmlive.com`
- Default demo credentials: `Admin / admin123`
- Override with `ORANGEHRM_USERNAME` and `ORANGEHRM_PASSWORD`.

## Covered 12 OrangeHRM sections

1. Dashboard
2. Admin
3. PIM
4. Leave
5. Time
6. Recruitment
7. My Info
8. Performance
9. Directory
10. Maintenance
11. Claim
12. Buzz

## 15 tests

- TC01 valid login
- TC02 invalid login
- TC03 empty login validation
- TC04 Dashboard verification
- TC05 Admin: open + search Admin user
- TC06 PIM: open + add + search + delete employee
  TC07 - PIM: reset employee search
- TC08 Leave: open + verify Leave List/search controls
- TC09 My Info: open + verify Personal Details + Save
- TC10 Time: open + verify breadcrumb
- TC11 Recruitment: open + verify breadcrumb
- TC12 Performance: open + verify breadcrumb
- TC13 Directory: open + verify breadcrumb
- TC14 Maintenance: open + verify breadcrumb
- TC15 Claim: open + verify breadcrumb
- TC16 Buzz: open + verify breadcrumb

## Important fixes from the first version

### Admin search
The old code used `getByPlaceholder('Username')`. On the current OrangeHRM UI the Username input does not reliably expose that placeholder, so the framework now locates the input from its `Username` field group.

### PIM Add Employee
The old code waited for `Employee Information` after clicking Add. That heading belongs to the employee list/filter screen, not the Add Employee form. The fixed code waits for the `First Name` field and then verifies `Personal Details` after Save.

### PIM search/delete
The fixed code searches through the Employee Name field group, waits for autocomplete when available, scopes delete actions to the matching employee row, and verifies the success toast.

### 12-section coverage
The framework now explicitly clicks and verifies every sidebar section visible to the Admin demo account. Modules with destructive/business-changing workflows are not mutated just to prove navigation; they are opened and verified. PIM and Admin receive deeper form/action coverage.

## Install

```powershell
npm install
npx playwright install chromium
```

## Run all 15 tests

```powershell
npx playwright test --project=chromium
```

Headed:

```powershell
npx playwright test --project=chromium --headed
```

Debug:

```powershell
npx playwright test --debug
```

HTML report:

```powershell
npx playwright show-report playwright-report
```

## Environment variables

```powershell
$env:BASE_URL='https://opensource-demo.orangehrmlive.com'
$env:ORANGEHRM_USERNAME='Admin'
$env:ORANGEHRM_PASSWORD='admin123'
```

## CI

GitHub Actions workflow: `.github/workflows/playwright.yml`

Windows Jenkins pipeline: `Jenkinsfile`

Linux Jenkins pipeline: `Jenkinsfile.linux`

Jenkins should preferably store `orangehrm-username` and `orangehrm-password` as credentials instead of hard-coding them.

## Artifacts

- `playwright-report/` - HTML report
- `test-results/` - JUnit XML, screenshots, videos and traces from failed/retried tests
- `screenshots/` - reserved for custom screenshot utilities
