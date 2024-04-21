async function createExpense(event) {
  event.preventDefault();
  const name = document.getElementById("expenseName").value;
  const amount = document.getElementById("expenseAmount").value;
  const date = document.getElementById("expenseDate").value;

  try {
      const response = await fetch('/api/expenses', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ name, amount, date }),
      });

      const data = await response.json();
      if (response.ok) {
          console.log('Expense created:', data);
          alert('Expense successfully created');
          loadExpenses();
      } else {
          throw new Error(data.message || 'Failed to create expense');
      }
  } catch (error) {
      console.error('Expense creation failed:', error);
      alert(error.message);  
  }
}

  
  async function loadExpenses() {
    try {
        const response = await fetch('/api/expenses', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        const expenses = await response.json();
        if (response.ok) {
            const expensesList = document.getElementById("expensesList");
            expensesList.innerHTML = expenses.map(expense => `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${expense.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${expense.amount}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(expense.date).toLocaleDateString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick="deleteExpense('${expense._id}')" class="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                </tr>
            `).join('');
        } else {
            throw new Error(expenses.message || 'Failed to load expenses');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}

async function deleteExpense(expenseId) {
    try {
        const response = await fetch(`/api/expenses/${expenseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        if (response.ok) {
            console.log('Expense deleted');
            loadExpenses();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete expense');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}
