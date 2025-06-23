import React, { useState } from 'react';
import './App.css';

const defaultApiBase = '';

function App() {
  const [apiBase, setApiBase] = useState(defaultApiBase);
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState('');
  const [result, setResult] = useState('');
  const [createOrder, setCreateOrder] = useState('');
  const [updateOrder, setUpdateOrder] = useState('');

  // Helper to handle API calls
  const callApi = async (method: string, path: string, body?: any) => {
    setResult('Loading...');
    try {
      const res = await fetch(`${apiBase}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const text = await res.text();
      setResult(`${res.status}: ${text}`);
    } catch (err) {
      setResult('Error: ' + err);
    }
  };

  return (
    <div className="App">
      <h1>Azure CRUD Orders Frontend</h1>
      <div style={{ marginBottom: 16 }}>
        <label>API Base URL: </label>
        <input
          style={{ width: 400 }}
          value={apiBase}
          onChange={e => setApiBase(e.target.value)}
          placeholder="https://<your-apim>.azure-api.net/crudapi"
        />
      </div>
      <hr />
      <h2>Create Order</h2>
      <textarea
        rows={4}
        cols={60}
        value={createOrder}
        onChange={e => setCreateOrder(e.target.value)}
        placeholder='{"id":"order1","customer":"Alice","items":[{"productName":"Apple","qty":2}]}'
      />
      <br />
      <button onClick={() => callApi('POST', '/orders', createOrder ? JSON.parse(createOrder) : undefined)}>
        Create Order
      </button>
      <hr />
      <h2>Get Order</h2>
      <input
        value={orderId}
        onChange={e => setOrderId(e.target.value)}
        placeholder="Order ID"
      />
      <button onClick={() => callApi('GET', `/orders/${orderId}`)}>Get Order</button>
      <hr />
      <h2>Update Order</h2>
      <input
        value={orderId}
        onChange={e => setOrderId(e.target.value)}
        placeholder="Order ID"
      />
      <textarea
        rows={4}
        cols={60}
        value={updateOrder}
        onChange={e => setUpdateOrder(e.target.value)}
        placeholder='{"customer":"Bob","items":[{"productName":"Banana","qty":3}]}'
      />
      <br />
      <button onClick={() => callApi('PUT', `/orders/${orderId}`, updateOrder ? JSON.parse(updateOrder) : undefined)}>
        Update Order
      </button>
      <hr />
      <h2>Delete Order</h2>
      <input
        value={orderId}
        onChange={e => setOrderId(e.target.value)}
        placeholder="Order ID"
      />
      <button onClick={() => callApi('DELETE', `/orders/${orderId}`)}>Delete Order</button>
      <hr />
      <h2>Result</h2>
      <pre style={{ background: '#eee', padding: 8 }}>{result}</pre>
    </div>
  );
}

export default App;
