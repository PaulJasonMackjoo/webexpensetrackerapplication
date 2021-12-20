var state = {
    balance: 1000,
    income: 400,
    expense: 100,
    transactions: [
        
    ]
}
// Declare variables
var balanceEl = document.querySelector('#balance');
var incomeEl = document.querySelector('#income');
var expenseEl = document.querySelector('#expense');
var transactionsEl = document.querySelector('#transaction');
var incomeBtnEl = document.querySelector('#incomeBtn');
var expenseBtnEl = document.querySelector('#expenseBtn');
var nameInputEl = document.querySelector('#name');
var amountInputEl = document.querySelector('#amount');

// Initiate local storage
function init() {
    var localState = JSON.parse(localStorage.getItem('expenseTrackerState'));

    if (localState !== null) {
        state = localState;
    }
    
    updateState();
    initListeners();
}

function uniqueId() {
    return Math.round(Math.random() * 1000000);
}

function initListeners() {
    incomeBtnEl.addEventListener('click', onAddIncomeClick);
    expenseBtnEl.addEventListener('click', onAddExpenseClick);
}

// Define action for click of button expense or income
function onAddIncomeClick() {
    addTransaction(nameInputEl.value, amountInputEl.value, 'income');
}

function addTransaction(name, amount, type) {
    if (name !== '' && amount !== '') {
        var transaction = { 
            id: uniqueId(),
            name: name, 
            amount: parseInt(amount), 
            type: type
        };

        state.transactions.push(transaction);

        updateState();
    } else {
        alert('Please enter valid data');
    }

    nameInputEl.value = '';
    amountInputEl.value = '';
}

function onAddExpenseClick() {
    addTransaction(nameInputEl.value, amountInputEl.value, 'expense');
}

// Define action for delete of expense or income
function onDeleteClick(event) {
    var id = parseInt(event.target.getAttribute('data-id'));
    var deleteIndex;
    for (var i = 0; i < state.transactions.length; i++) {
        if (state.transactions[i].id === id) {
            deleteIndex = i;
            break;
        }
    }

    state.transactions.splice(deleteIndex, 1);

    updateState();
}

// Update balance after transaction
function updateState() {
    var balance = 0,
        income = 0,
        expense = 0,
        item;

    for (var i = 0; i < state.transactions.length; i++) {
        item = state.transactions[i];

        if (item.type === 'income') {
            income += item.amount;
        } else if (item.type === 'expense') {
            expense += item.amount;
        }
    }

    balance = income - expense;

    state.balance = balance;
    state.income = income;
    state.expense = expense;

    localStorage.setItem('expenseTrackerState', JSON.stringify(state))

    render();
}

// Display balance
function render() {
    balanceEl.innerHTML = `$${state.balance}`;
    incomeEl.innerHTML = `$${state.income}`;
    expenseEl.innerHTML = `$${state.expense}`;

    var transactionEl, containerEl, amountEl, item, btnEl;

    transactionsEl.innerHTML = '';

    for (var i = 0; i < state.transactions.length; i++) {
        item = state.transactions[i];
        transactionEl = document.createElement('li');
		transactionEl.append(item.name);

        transactionsEl.appendChild(transactionEl);

        containerEl = document.createElement('div');
        amountEl = document.createElement('span');
        if (item.type === 'income') {
            amountEl.classList.add('income-amt');
        } else if (item.type === 'expense') {
            amountEl.classList.add('expense-amt');
        }
        amountEl.innerHTML = `$${item.amount}`;

        containerEl.appendChild(amountEl);

        btnEl = document.createElement('button');
        btnEl.setAttribute('data-id', item.id);
        btnEl.innerHTML = 'X';

        btnEl.addEventListener('click', onDeleteClick);

        containerEl.appendChild(btnEl);

        transactionEl.appendChild(containerEl);
    }
}

init();

// Create piechart
anychart.onDocumentReady(function() {

  // set the data
  var data = [
      {x: "Income", value: state.income},
      {x: "Expenses", value: state.expense}
  ];

  // create the chart
  var chart = anychart.pie();

  // set the chart title
  chart.title("Income v/s Expense piechart");

  // add the data
  chart.data(data);

  // display the chart in the container
  chart.container('container');
  chart.draw();

});
