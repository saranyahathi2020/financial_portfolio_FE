async function fetchStockData() {
  const response = await fetch('http://localhost:3000/stock_transactions/all');
  const data = await response.json();
  return data;
}

function updateTable(data) {
  const tbody = document.querySelector('table tbody');
  tbody.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.transaction_date}</td>
      <td>${row.ticker}</td>
      <td>${row.company}</td>
      <td>${row.action}</td>
      <td>${row.quantity}</td>
      <td>$${row.buy_price}</td>
      <td>$${row.total_cost}</td>
      <td>$${row.current_price}</td>
      <td>$${row.market_value}</td>
      <td>${row.gain_loss}</td>
    `;
    tbody.appendChild(tr);
  });
}

function updateChart(data) {
  const labels = data.map(row => row.ticker);
  const costValues = data.map(row => row.total_cost);
  const marketValues = data.map(row => row.market_value);

  chart.data.labels = labels;
  chart.data.datasets[0].data = costValues;
  chart.data.datasets[1].data = marketValues;
  chart.update();
}

// Initial load
fetchStockData().then(data => {
  updateTable(data);
  updateChart(data);
});



// Fetch all stock data from backend
async function fetchStockData() {
  const response = await fetch('http://localhost:3000/stock_transactions/all');
  const data = await response.json();
  return data;
}

// Render table with fetched data
function updateTable(data) {
  const tbody = document.querySelector('table tbody');
  tbody.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.transaction_date}</td>
      <td>${row.ticker}</td>
      <td>${row.company}</td>
      <td>${row.action}</td>
      <td>${row.quantity}</td>
      <td>$${row.buy_price}</td>
      <td>$${row.total_cost}</td>
      <td>$${row.current_price}</td>
      <td>$${row.market_value}</td>
      <td>$${row.gain_loss}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Update the bar chart
function updateChart(data) {
  const labels = data.map(row => row.ticker);
  const costValues = data.map(row => row.total_cost);
  const marketValues = data.map(row => row.market_value);

  chart.data.labels = labels;
  chart.data.datasets[0].data = costValues;
  chart.data.datasets[1].data = marketValues;
  chart.update();
}

// This function will be called after submit to refresh UI
async function fetchTransactionLog() {
  const data = await fetchStockData();
  updateTable(data);
  updateChart(data);
}

// Submit Buy/Sell transaction
async function submitTransaction(type) {
  const tickerMap = {
    AAPL: 'Apple Inc.',
    GOOGL: 'Alphabet Inc.',
    TSLA: 'Tesla Inc.',
    INFY: 'Infosys Ltd.',
    HDFC: 'HDFC Bank',
    MSFT: 'Microsoft Corp.',
    AMZN: 'Amazon.com Inc.',
    RELI: 'Reliance Industries'
  };

  const ticker = document.getElementById('stock-select').value;
  const company = tickerMap[ticker];
  const quantity = parseInt(document.getElementById('quantity-input').value);

  if (!company || isNaN(quantity) || quantity <= 0) {
    alert('Please select a stock and enter a valid quantity.');
    return;
  }

  const endpoint = `http://localhost:3000/transactions/${type}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company, quantity })
    });

    const result = await response.json();
    alert(result.message || 'Transaction completed.');

    // ✅ This refreshes table + chart immediately
    await fetchTransactionLog();

  } catch (err) {
    console.error(err);
    alert('Error connecting to backend.');
  }
}

// Setup buttons
document.addEventListener('DOMContentLoaded', () => {
  const buyBtn = document.querySelector('.buy');
  const sellBtn = document.querySelector('.sell');

  buyBtn.addEventListener('click', () => submitTransaction('buy'));
  sellBtn.addEventListener('click', () => submitTransaction('sell'));

  // Initial load
  fetchTransactionLog();
});

// Chart.js config
const ctx = document.getElementById('barChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Cost Value',
        backgroundColor: 'blue',
        data: []
      },
      {
        label: 'Market Value',
        backgroundColor: 'green',
        data: []
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Cost vs Market Value' }
    }
  }
});



