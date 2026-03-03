
**Test Deployment is here: https://pay-role-general-payroll-web-app.vercel.app/#
##  Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [How to Use](#-how-to-use)
  - [Change Calculator](#1-change-calculator)
  - [Employee Payroll](#2-employee-payroll)
  - [Payroll Records](#3-payroll-records)
- [Payroll Deduction Rates](#-payroll-deduction-rates)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📌 About the Project

**PayRole** is a lightweight, browser-based Payroll Management System designed specifically for Philippine-based payroll processing. It requires **no installation, no backend server, and no database** — everything runs directly in your browser.

The system was built as an enhanced and redesigned version of the classic pay role management concept, extended with:

- A **multi-tab UI** with clean navigation
- A **live Pay Slip generator** with real PH government-mandated deductions
- A **Change Calculator** for cash transaction management
- Persistent **localStorage** data storage across sessions
- A **premium white/blue/dark-navy design** system

> 💡 All data is stored locally in your browser's `localStorage`. No data is sent to any server.

---

## ✨ Features

### 🧮 Change Calculator
- Enter a **bill amount** and **cash given** to calculate the exact **change to return**
- Displays the **minimum number of bills and coins** using all current Philippine Peso denominations:
  - **Bills:** ₱1,000 · ₱500 · ₱200 · ₱100 · ₱50 · ₱20
  - **Coins:** ₱10 · ₱5 · ₱1
- Shows a **visual summary bar** with Bill Amount → Cash Given → Change to Return
- Input **validation** with friendly error messages
- **Reset** button to clear fields

### 👥 Employee Management
- Add employees with:
  - Full Name
  - Employee ID (must be unique)
  - Department (HR, Finance, Engineering, Marketing, Operations, Sales)
  - Monthly Basic Salary
- **Search/Filter** employees by name, ID, or department in real-time
- **Remove** employees with one click
- All employee data persists via **localStorage**

### 📄 Pay Slip Generator (Live Preview)
- Select an employee → salary **auto-fills** from records
- Add **Allowances**, **Overtime Pay**, and **Other Deductions**
- **Live calculation** updates the pay slip preview in real-time with:
  - Gross Pay
  - SSS Contribution
  - PhilHealth Contribution
  - Pag-IBIG Contribution
  - Withholding Tax (TRAIN Law)
  - Total Deductions
  - **Net Pay**
- **Save** payroll records for history tracking
- **Print** the pay slip directly from the browser

### 📊 Payroll Records & Reports
- View all saved payroll entries in a sortable table
- Summary statistics at a glance:
  - Total Employees
  - Total Gross Pay
  - Total Deductions
  - Total Net Pay
- **Clear All** records with confirmation

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic page structure |
| **CSS3** | Styling, animations, responsive layout |
| **Vanilla JavaScript (ES6+)** | Logic, calculations, DOM manipulation |
| **localStorage API** | Client-side data persistence |
| **Google Fonts (Inter)** | Typography |
| **CSS Custom Properties** | Design system / theming |

> No frameworks. No dependencies. No build step required.

---

## 🚀 Getting Started

### Option 1 — Open Directly (Simplest)
1. **Download** or **clone** this repository
2. **Double-click** `index.html` to open it in your browser

```bash
git clone https://github.com/theSleepingKnight/PayRole-General-Payroll-Web-App.git
cd PayRole-General-Payroll-Web-App
# Then open index.html in your browser
```

### Option 2 — Via Command Line (Windows Edge)
```powershell
Start-Process msedge -ArgumentList "`"file:///C:/path/to/PayRole-General-Payroll-Web-App/index.html`""
```

### Option 3 — Live Server (VS Code)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **"Open with Live Server"**
3. App will open at `http://127.0.0.1:5500`

### Option 4 — GitHub Pages
If deployed via GitHub Pages, visit:
```
https://theSleepingKnight.github.io/PayRole-General-Payroll-Web-App/
```

> ✅ **No npm install, no build, no server required.**

---

## 📖 How to Use

### 1. Change Calculator

The **Change Calculator** tab is the default landing page.

| Step | Action |
|---|---|
| 1 | Enter the **Bill Amount** (amount the customer owes) |
| 2 | Enter the **Cash Given** (amount the customer paid) |
| 3 | Click **Calculate Change** or press `Enter` |
| 4 | View the change breakdown in the **Minimum Bills & Coins** grid |

**Example:**
- Bill Amount: ₱750.00
- Cash Given: ₱2,000.00
- **Change: ₱1,250.00** → 2× ₱500 + 2× ₱100 + 1× ₱50

**Error Handling:**
- ⚠ Empty or negative bill/cash values are rejected
- ⚠ Cash less than bill amount shows `"Cash given is less than the bill amount"`

---

### 2. Employee Payroll

#### Adding an Employee
1. Go to the **Employee Payroll** tab
2. Fill in: Full Name, Employee ID, Department, Monthly Basic Salary
3. Click **Add Employee**
4. The employee appears in the **Employee List** table below

#### Generating a Pay Slip
1. In the **Generate Pay Slip** card (right side), select an employee from the dropdown
2. The **Basic Salary** auto-fills from the employee record
3. Optionally enter **Allowances**, **Overtime Pay**, and **Other Deductions**
4. The **Pay Slip Preview** updates live at the bottom
5. Click **Save Record** to store it in Payroll Records
6. Click **Print Pay Slip** to print or save as PDF

---

### 3. Payroll Records

1. Go to the **Records** tab
2. View summary cards: Employees, Total Gross, Total Deductions, Total Net Pay
3. See the full **Payroll History** table with all saved entries
4. Use **Clear All** to reset records (with confirmation)

---

## 🇵🇭 Payroll Deduction Rates

PayRole uses **simplified Philippine government-mandated deduction rates** based on current law:

### SSS (Social Security System)
| Monthly Salary | Monthly Contribution (Employee) |
|---|---|
| ≤ ₱4,249 | ₱180.00 flat |
| ₱4,250 – ₱29,749 | 4.5% of basic salary (max ₱1,350) |
| > ₱29,750 | ₱1,350.00 flat (maximum) |

### PhilHealth (Philippine Health Insurance)
| | Rate |
|---|---|
| Contribution Rate | 5% of basic salary |
| Employee Share | 2.5% |
| Minimum | ₱250.00 |
| Maximum | ₱2,500.00 |

### Pag-IBIG (HDMF)
| | Rate |
|---|---|
| Contribution Rate | 2% of basic salary |
| Maximum | ₱100.00 |

### Withholding Tax (TRAIN Law — RA 10963)
| Annual Income | Tax Rate |
|---|---|
| ≤ ₱250,000 | 0% (tax exempt) |
| ₱250,001 – ₱400,000 | 20% of excess over ₱250,000 |
| ₱400,001 – ₱800,000 | ₱30,000 + 25% of excess over ₱400,000 |
| ₱800,001 – ₱2,000,000 | ₱130,000 + 30% of excess over ₱800,000 |
| ₱2,000,001 – ₱8,000,000 | ₱490,000 + 32% of excess over ₱2,000,000 |
| > ₱8,000,000 | ₱2,410,000 + 35% of excess over ₱8,000,000 |

> ⚠️ **Disclaimer:** These rates are simplified approximations for educational purposes. Always consult a licensed accountant or the official BIR, SSS, PhilHealth, and Pag-IBIG websites for the most accurate and updated contribution tables.

---

## 📁 Project Structure

```
PayRole-General-Payroll-Web-App/
│
├── index.html        # Main HTML file — all UI structure & layout
├── style.css         # Full CSS design system (variables, components, layout)
├── script.js         # All JavaScript logic (calculator, payroll, localStorage)
└── README.md         # This documentation file
```

### Key Code Sections

#### `index.html`
- `#tab-calculator` — Change Calculator tab
- `#tab-employee` — Employee Payroll tab (Add Employee + Pay Slip Generator)
- `#tab-records` — Payroll Records & Stats tab

#### `style.css`
- CSS Custom Properties (`:root`) — color system, spacing, shadows
- Component styles — cards, buttons, tables, payslip, toast
- Responsive breakpoints — `@media (max-width: 900px)` and `640px`

#### `script.js`
- `clickHandler()` — Change calculator core logic
- `addEmployee()` — Employee form validation & storage
- `liveCalc()` — Real-time pay slip calculation
- `savePayroll()` — Record a payroll entry to localStorage
- `calcSSS()` / `calcPhilHealth()` / `calcPagIBIG()` / `calcWithholdingTax()` — PH deduction formulas
- `renderEmpTable()` / `renderRecordsTable()` — Dynamic table rendering

---

## 🎨 Design System

PayRole uses a consistent design system built entirely with **CSS Custom Properties**:

| Token | Value | Usage |
|---|---|---|
| `--dark-blue` | `#0f2044` | Header background, table headers |
| `--navy` | `#091530` | Deepest shadows |
| `--blue-600` | `#2563eb` | Primary buttons, active states |
| `--blue-800` | `#1e3a8a` | Pay slip header |
| `--blue-50` | `#eff6ff` | Card backgrounds, highlights |
| `--white` | `#ffffff` | Main content background |
| `--off-white` | `#f5f8ff` | Page background |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a **Pull Request**

### Ideas for Future Improvements
- [ ] Export payroll records to CSV or PDF
- [ ] Multiple payroll periods (bi-monthly, weekly)
- [ ] Dark mode toggle
- [ ] Employee profile photos
- [ ] Leave and attendance tracking
- [ ] Tax form generation (BIR 2316)
- [ ] Cloud sync / Firebase integration

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Author

**theSleepingKnight**
- GitHub: [@theSleepingKnight](https://github.com/theSleepingKnight)
- Repository: [PayRole-General-Payroll-Web-App](https://github.com/theSleepingKnight/PayRole-General-Payroll-Web-App)

---

<div align="center">

Made with ❤️ and ☕ | © 2026 PayRole Management System

⭐ **Star this repo if you found it helpful!** ⭐

</div>
