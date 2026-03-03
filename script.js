/* ==============================================
   PayRole Management System — script.js
   - Change Calculator (original logic, enhanced)
   - Employee Management
   - Payroll / Pay Slip Generator
   - Records / History
   ============================================== */

'use strict';

// ─────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────
let employees = JSON.parse(localStorage.getItem('prm_employees') || '[]');
let payrollRecords = JSON.parse(localStorage.getItem('prm_records') || '[]');

// Philippine Peso denominations (bills + coins)
const NOTES = [1000, 500, 200, 100, 50, 20, 10, 5, 1];
const NOTE_LABELS = {
    1000: { label: '₱1,000', type: 'Bill' },
    500: { label: '₱500', type: 'Bill' },
    200: { label: '₱200', type: 'Bill' },
    100: { label: '₱100', type: 'Bill' },
    50: { label: '₱50', type: 'Bill' },
    20: { label: '₱20', type: 'Bill' },
    10: { label: '₱10', type: 'Coin' },
    5: { label: '₱5', type: 'Coin' },
    1: { label: '₱1', type: 'Coin' },
};

// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    setHeaderDate();
    renderEmpTable();
    renderEmpDropdown();
    renderRecordsTable();
    updateStats();
    liveCalc();

    // Enter key triggers calculator
    document.getElementById('bill').addEventListener('keydown', e => {
        if (e.key === 'Enter') clickHandler();
    });
    document.getElementById('cash').addEventListener('keydown', e => {
        if (e.key === 'Enter') clickHandler();
    });
    document.getElementById('btn').addEventListener('click', clickHandler);

    // Live recalc on payslip inputs
    ['psBasic', 'psAllowance', 'psOvertime', 'psOtherDed'].forEach(id => {
        document.getElementById(id).addEventListener('input', liveCalc);
    });
});

// ─────────────────────────────────────────────
//  TAB SWITCHING
// ─────────────────────────────────────────────
function switchTab(tabName, linkEl) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById('tab-' + tabName).classList.add('active');
    linkEl.classList.add('active');
}

// ─────────────────────────────────────────────
//  HEADER DATE
// ─────────────────────────────────────────────
function setHeaderDate() {
    const now = new Date();
    const opts = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById('headerDate').textContent = now.toLocaleDateString('en-PH', opts);
}

// ─────────────────────────────────────────────
//  CHANGE CALCULATOR  (original logic, enhanced)
// ─────────────────────────────────────────────
const inputBillEl = () => document.getElementById('bill');
const cashGivenEl = () => document.getElementById('cash');
const errMsgEl = () => document.getElementById('error');
const resultCardEl = () => document.getElementById('result-card');
const notesGridEl = () => document.getElementById('notesGrid');
const noOfNotesEls = () => document.querySelectorAll('.no-of-notes');

function showError(msg) {
    const el = errMsgEl();
    el.textContent = msg;
    el.style.display = 'block';
}

function hideError() {
    errMsgEl().style.display = 'none';
}

function clickHandler() {
    hideError();

    const billVal = parseFloat(inputBillEl().value);
    const cashVal = parseFloat(cashGivenEl().value);

    if (isNaN(billVal)) {
        showError('⚠ Please enter a bill amount.');
        return;
    }
    if (billVal < 0) {
        showError('⚠ Please enter a positive bill amount.');
        return;
    }
    if (isNaN(cashVal)) {
        showError('⚠ Please enter the cash given by the customer.');
        return;
    }
    if (cashVal < billVal) {
        showError('⚠ Cash given is less than the bill amount. Please give more.');
        return;
    }

    let remaining = Math.round((cashVal - billVal) * 100) / 100;

    // Update change-summary bar
    document.getElementById('summary-bill').textContent = formatPeso(billVal);
    document.getElementById('summary-cash').textContent = formatPeso(cashVal);
    document.getElementById('summary-change').textContent = formatPeso(remaining);

    // Build the notes grid
    const grid = notesGridEl();
    grid.innerHTML = '';

    const notesCells = noOfNotesEls();

    NOTES.forEach((denom, i) => {
        const count = Math.trunc(remaining / denom);
        remaining = Math.round((remaining % denom) * 100) / 100;

        // Update original table cell
        if (notesCells[i]) notesCells[i].textContent = count;

        // Modern note chip
        const chip = document.createElement('div');
        chip.className = 'note-chip' + (count > 0 ? ' active' : '');
        chip.innerHTML = `
            <div class="note-denom">${NOTE_LABELS[denom].label}</div>
            <div class="note-count">${count}</div>
            <div class="note-type-badge">${NOTE_LABELS[denom].type}</div>
        `;
        grid.appendChild(chip);
    });

    // Show result card with animation
    const card = resultCardEl();
    card.classList.remove('hidden');
    card.style.animation = 'none';
    card.offsetHeight; // force reflow
    card.style.animation = 'fadeUp 0.3s ease both';

    showToast('Change calculated successfully!');
}

function resetCalculator() {
    inputBillEl().value = '';
    cashGivenEl().value = '';
    hideError();
    resultCardEl().classList.add('hidden');
}

// ─────────────────────────────────────────────
//  EMPLOYEE MANAGEMENT
// ─────────────────────────────────────────────
function addEmployee() {
    const errEl = document.getElementById('emp-error');
    const succEl = document.getElementById('emp-success');
    errEl.style.display = 'none';
    succEl.style.display = 'none';

    const name = document.getElementById('empName').value.trim();
    const empId = document.getElementById('empId').value.trim();
    const dept = document.getElementById('empDept').value;
    const salary = parseFloat(document.getElementById('empSalary').value);

    if (!name) { showFieldError(errEl, '⚠ Please enter the employee name.'); return; }
    if (!empId) { showFieldError(errEl, '⚠ Please enter an Employee ID.'); return; }
    if (!dept) { showFieldError(errEl, '⚠ Please select a department.'); return; }
    if (isNaN(salary) || salary < 0) { showFieldError(errEl, '⚠ Please enter a valid basic salary.'); return; }

    if (employees.find(e => e.empId === empId)) {
        showFieldError(errEl, `⚠ Employee ID "${empId}" already exists.`);
        return;
    }

    employees.push({ name, empId, dept, salary });
    saveEmployees();

    ['empName', 'empId', 'empSalary'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('empDept').value = '';

    renderEmpTable();
    renderEmpDropdown();
    updateStats();

    showFieldSuccess(succEl, `✓ Employee "${name}" added successfully.`);
    showToast(`Employee "${name}" added!`);
}

function deleteEmployee(empId) {
    employees = employees.filter(e => e.empId !== empId);
    saveEmployees();
    renderEmpTable();
    renderEmpDropdown();
    updateStats();
    showToast('Employee removed.');
}

function renderEmpTable() {
    const tbody = document.getElementById('empTbody');
    const search = (document.getElementById('empSearch')?.value || '').toLowerCase();

    const filtered = employees.filter(e =>
        e.name.toLowerCase().includes(search) ||
        e.empId.toLowerCase().includes(search) ||
        e.dept.toLowerCase().includes(search)
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-td">${search ? 'No matching employees.' : 'No employees yet. Add one above.'}</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(e => `
        <tr>
          <td><strong>${e.empId}</strong></td>
          <td>${e.name}</td>
          <td>${e.dept}</td>
          <td>${formatPeso(e.salary)}</td>
          <td>
            <button class="tbl-btn del" onclick="deleteEmployee('${e.empId}')">Remove</button>
          </td>
        </tr>
    `).join('');
}

function renderEmpDropdown() {
    const sel = document.getElementById('selEmp');
    const selected = sel.value;
    sel.innerHTML = '<option value="">-- Select Employee --</option>' +
        employees.map(e => `<option value="${e.empId}">${e.name} (${e.empId})</option>`).join('');
    sel.value = selected;
}

function saveEmployees() {
    localStorage.setItem('prm_employees', JSON.stringify(employees));
}

// ─────────────────────────────────────────────
//  PAYROLL CALCULATOR
// ─────────────────────────────────────────────
function autoFillBasic() {
    const sel = document.getElementById('selEmp');
    const emp = employees.find(e => e.empId === sel.value);
    document.getElementById('psBasic').value = emp ? emp.salary : '';
    liveCalc();
}

function liveCalc() {
    const basic = parseFloat(document.getElementById('psBasic')?.value) || 0;
    const allowance = parseFloat(document.getElementById('psAllowance')?.value) || 0;
    const overtime = parseFloat(document.getElementById('psOvertime')?.value) || 0;
    const otherDed = parseFloat(document.getElementById('psOtherDed')?.value) || 0;

    const gross = basic + allowance + overtime;
    const sss = calcSSS(basic);
    const philhealth = calcPhilHealth(basic);
    const pagibig = calcPagIBIG(basic);
    const tax = calcWithholdingTax(basic);
    const totalDed = sss + philhealth + pagibig + tax + otherDed;
    const netPay = Math.max(0, gross - totalDed);

    setText('psShowBasic', basic);
    setText('psShowAllow', allowance);
    setText('psShowOT', overtime);
    setText('psShowGross', gross);
    setText('psShowSSS', sss);
    setText('psShowPH', philhealth);
    setText('psShowPI', pagibig);
    setText('psShowTax', tax);
    setText('psShowOther', otherDed);
    setText('psShowTotalDed', totalDed);
    setText('psShowNet', netPay);

    const selEmp = document.getElementById('selEmp');
    const emp = employees.find(e => e.empId === selEmp?.value);
    document.getElementById('psEmpName').textContent = emp ? emp.name : '—';
    document.getElementById('psEmpId').textContent = emp ? emp.empId : '—';
    document.getElementById('psEmpDept').textContent = emp ? emp.dept : '—';

    const now = new Date();
    document.getElementById('psPeriod').textContent =
        now.toLocaleDateString('en-PH', { year: 'numeric', month: 'long' });

    return { basic, allowance, overtime, gross, sss, philhealth, pagibig, tax, otherDed, totalDed, netPay };
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = formatPeso(val);
}

// Simplified SSS contribution (monthly)
function calcSSS(salary) {
    if (salary <= 0) return 0;
    if (salary <= 4249) return 180;
    if (salary <= 29749) return Math.min(Math.round(salary * 0.045), 1350);
    return 1350;
}

// PhilHealth: employee share 2.5%, min ₱250, max ₱2,500
function calcPhilHealth(salary) {
    if (salary <= 0) return 0;
    return Math.min(Math.max(salary * 0.025, 250), 2500);
}

// Pag-IBIG: 2% of salary, max ₱100
function calcPagIBIG(salary) {
    if (salary <= 0) return 0;
    return Math.min(salary * 0.02, 100);
}

// Withholding tax (TRAIN law brackets, monthly)
function calcWithholdingTax(basic) {
    const annual = basic * 12;
    if (annual <= 250000) return 0;
    if (annual <= 400000) return ((annual - 250000) * 0.20) / 12;
    if (annual <= 800000) return (30000 + (annual - 400000) * 0.25) / 12;
    if (annual <= 2000000) return (130000 + (annual - 800000) * 0.30) / 12;
    if (annual <= 8000000) return (490000 + (annual - 2000000) * 0.32) / 12;
    return (2410000 + (annual - 8000000) * 0.35) / 12;
}

// ─────────────────────────────────────────────
//  SAVE PAYROLL RECORD
// ─────────────────────────────────────────────
function savePayroll() {
    const succEl = document.getElementById('pay-success');
    succEl.style.display = 'none';

    const selEmp = document.getElementById('selEmp');
    if (!selEmp.value) { showToast('⚠ Please select an employee first.'); return; }

    const emp = employees.find(e => e.empId === selEmp.value);
    const data = liveCalc();

    if (data.basic <= 0) { showToast('⚠ Please enter a salary amount.'); return; }

    const record = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-PH'),
        empName: emp.name,
        empId: emp.empId,
        dept: emp.dept,
        ...data,
    };

    payrollRecords.unshift(record);
    localStorage.setItem('prm_records', JSON.stringify(payrollRecords));
    renderRecordsTable();
    updateStats();

    showFieldSuccess(succEl, `✓ Payroll for "${emp.name}" saved!`);
    showToast(`Payroll for "${emp.name}" saved!`);
}

// ─────────────────────────────────────────────
//  PRINT PAY SLIP
// ─────────────────────────────────────────────
function printPayslip() {
    const doc = document.getElementById('payslipDoc');
    if (!doc) return;
    document.getElementById('printArea').innerHTML = doc.outerHTML;
    window.print();
}

// ─────────────────────────────────────────────
//  RECORDS TABLE
// ─────────────────────────────────────────────
function renderRecordsTable() {
    const tbody = document.getElementById('recordsTbody');

    if (payrollRecords.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-td">No records yet. Save a payroll entry first.</td></tr>`;
        return;
    }

    tbody.innerHTML = payrollRecords.map((r, i) => `
        <tr>
          <td>${payrollRecords.length - i}</td>
          <td>${r.date}</td>
          <td><strong>${r.empName}</strong><br><span class="emp-id-small">${r.empId}</span></td>
          <td>${r.dept}</td>
          <td>${formatPeso(r.gross)}</td>
          <td class="td-deduction">${formatPeso(r.totalDed)}</td>
          <td class="td-netpay">${formatPeso(r.netPay)}</td>
        </tr>
    `).join('');
}

function clearRecords() {
    if (!confirm('Clear all payroll records? This cannot be undone.')) return;
    payrollRecords = [];
    localStorage.setItem('prm_records', JSON.stringify(payrollRecords));
    renderRecordsTable();
    updateStats();
    showToast('All records cleared.');
}

// ─────────────────────────────────────────────
//  STATS
// ─────────────────────────────────────────────
function updateStats() {
    const totalGross = payrollRecords.reduce((s, r) => s + r.gross, 0);
    const totalDed = payrollRecords.reduce((s, r) => s + r.totalDed, 0);
    const totalNet = payrollRecords.reduce((s, r) => s + r.netPay, 0);

    setVal('statEmpCount', employees.length);
    setValPeso('statGross', totalGross);
    setValPeso('statDed', totalDed);
    setValPeso('statNet', totalNet);
}

function setVal(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function setValPeso(id, val) { const el = document.getElementById(id); if (el) el.textContent = formatPeso(val); }

// ─────────────────────────────────────────────
//  UTILITIES
// ─────────────────────────────────────────────
function formatPeso(val) {
    return '₱' + (parseFloat(val) || 0).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function showFieldError(el, msg) {
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 5000);
}

function showFieldSuccess(el, msg) {
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 4000);
}

let toastTimer;
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
