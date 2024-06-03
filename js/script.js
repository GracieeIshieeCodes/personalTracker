document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('payment-form');
    const tableBody = document.querySelector('#payment-table tbody');
    const totalElement = document.getElementById('total');
    const printTotalButton = document.getElementById('print-total-button');
    const modal = document.getElementById('receipt-modal');
    const modalContent = document.getElementById('modal-content');
    const closeModal = document.getElementById('close-modal');

    let total = 0;
    let payments = JSON.parse(localStorage.getItem('payments')) || [];

    const updateTable = () => {
        tableBody.innerHTML = '';
        total = 0;
        payments.forEach((payment, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.date}</td>
                <td>${payment.amount} PESOS</td>
                <td>
                    <button onclick="editPayment(${index})">Edit</button>
                    <button onclick="deletePayment(${index})">Delete</button>
                    <button onclick="printReceipt(${index})">Print Receipt</button>
                </td>
            `;
            tableBody.appendChild(row);
            total += payment.amount;
        });
        totalElement.textContent = `TOTAL: ${total} PESOS`;
    };

    const savePayments = () => {
        localStorage.setItem('payments', JSON.stringify(payments));
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const date = document.getElementById('date').value;
        const amount = parseFloat(document.getElementById('amount').value);

        if (date && amount) {
            payments.push({ date, amount });
            savePayments();
            updateTable();

            // Clear the form
            form.reset();
        }
    });

    window.editPayment = (index) => {
        const payment = payments[index];
        document.getElementById('date').value = payment.date;
        document.getElementById('amount').value = payment.amount;
        form.onsubmit = (e) => {
            e.preventDefault();
            payments[index] = {
                date: document.getElementById('date').value,
                amount: parseFloat(document.getElementById('amount').value),
            };
            savePayments();
            updateTable();
            form.onsubmit = null;  // Reset form submission
            form.reset();
        };
    };

    window.deletePayment = (index) => {
        payments.splice(index, 1);
        savePayments();
        updateTable();
    };

    window.printReceipt = (index) => {
        const payment = payments[index];
        modalContent.innerHTML = `
            <h3>Payment Receipt</h3>
            <p>Date: ${payment.date}</p>
            <p>Amount: ${payment.amount} PESOS</p>
            <button onclick="window.print()">Print</button>
        `;
        modal.style.display = 'block';
    };

    printTotalButton.addEventListener('click', () => {
        let receiptContent = `
            <h3>Total Payment Receipt</h3>
            <table>
                <tr>
                    <th>Date</th>
                    <th>Amount</th>
                </tr>
        `;
        payments.forEach(payment => {
            receiptContent += `
                <tr>
                    <td>${payment.date}</td>
                    <td>${payment.amount} PESOS</td>
                </tr>
            `;
        });
        receiptContent += `
                <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>${total} PESOS</strong></td>
                </tr>
            </table>
            <button onclick="window.print()">Print</button>
        `;
        modalContent.innerHTML = receiptContent;
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    updateTable();
});
