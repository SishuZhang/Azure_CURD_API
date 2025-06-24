import React, { useState, useEffect } from 'react';
import './App.css';

interface Order {
  id: string;
  customerName?: string;
  items?: Array<{ productName: string; qty: number }>;
  shippingAddress?: string;
  status?: string;
  total?: number;
}

interface Product {
  productName: string;
  price: number;
}

const defaultApiBase = '';

function App() {
  const [apiBase, setApiBase] = useState(defaultApiBase);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('list');

  // Form states
  const [createForm, setCreateForm] = useState({
    customerName: '',
    items: [{ productName: '', qty: 1 }],
    shippingAddress: ''
  });

  const [updateForm, setUpdateForm] = useState({
    customerName: '',
    items: [{ productName: '', qty: 1 }],
    shippingAddress: '',
    status: ''
  });

  // Helper to handle API calls
  const callApi = async (method: string, path: string, body?: any) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${apiBase}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      
      let data;
      try {
        data = await res.json();
      } catch (e) {
        data = { message: 'No JSON response' };
      }
      
      if (res.status === 500) {
        setMessage(`❌ Server Error (500): ${JSON.stringify(data, null, 2)}\n\n💡 This usually means the Cosmos DB connection string is not configured. Please check the Azure Portal > Function App > Configuration > Application Settings and add COSMOS_CONNECTION_STRING.`);
      } else if (res.status === 401) {
        setMessage(`❌ Unauthorized (401): ${JSON.stringify(data, null, 2)}\n\n💡 The function requires authentication. Please check if the function auth level is set to 'anonymous' in function.json files.`);
      } else if (res.status === 404) {
        setMessage(`❌ Not Found (404): ${JSON.stringify(data, null, 2)}\n\n💡 The function endpoint was not found. Please check the API URL and function routes.`);
      } else {
        setMessage(`${res.status}: ${JSON.stringify(data, null, 2)}`);
      }
      
      return { status: res.status, data };
    } catch (err) {
      setMessage(`❌ Network Error: ${err}\n\n💡 Please check:\n1. Your API Base URL is correct\n2. Azure Functions are deployed and running\n3. CORS settings allow your frontend domain\n4. Cosmos DB connection string is configured`);
      return { status: 0, data: null };
    } finally {
      setLoading(false);
    }
  };

  // Load orders
  const loadOrders = async () => {
    const result = await callApi('GET', '/orders');
    if (result.status === 200 && Array.isArray(result.data)) {
      setOrders(result.data);
    }
  };

  // Load products
  const loadProducts = async () => {
    const result = await callApi('GET', '/products');
    if (result.status === 200 && Array.isArray(result.data)) {
      setProducts(result.data);
    }
  };

  // Initialize products
  const initializeProducts = async () => {
    const result = await callApi('POST', '/products/init');
    if (result.status === 201) {
      setMessage('✅ Products initialized successfully!');
      loadProducts();
    }
  };

  // Create order
  const createOrder = async () => {
    const orderData = {
      id: Date.now().toString(),
      ...createForm
    };
    const result = await callApi('POST', '/orders', orderData);
    if (result.status === 201) {
      setMessage('✅ Order created successfully!');
      loadOrders();
      setCreateForm({ customerName: '', items: [{ productName: '', qty: 1 }], shippingAddress: '' });
    }
  };

  // Update order
  const updateOrder = async () => {
    if (!selectedOrder) return;
    const result = await callApi('PUT', `/orders/${selectedOrder.id}`, updateForm);
    if (result.status === 200) {
      setMessage('✅ Order updated successfully!');
      loadOrders();
      setSelectedOrder(null);
    }
  };

  // Delete order
  const deleteOrder = async (orderId: string) => {
    const result = await callApi('DELETE', `/orders/${orderId}`);
    if (result.status === 204) {
      setMessage('✅ Order deleted successfully!');
      loadOrders();
    }
  };

  // Get order by ID
  const getOrder = async (orderId: string) => {
    const result = await callApi('GET', `/orders/${orderId}`);
    if (result.status === 200) {
      setSelectedOrder(result.data);
      setUpdateForm({
        customerName: result.data.customerName || '',
        items: result.data.items || [{ productName: '', qty: 1 }],
        shippingAddress: result.data.shippingAddress || '',
        status: result.data.status || ''
      });
    }
  };

  // Add item to create form
  const addItemToCreate = () => {
    setCreateForm(prev => ({
      ...prev,
      items: [...prev.items, { productName: '', qty: 1 }]
    }));
  };

  // Remove item from create form
  const removeItemFromCreate = (index: number) => {
    setCreateForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Update create form item
  const updateCreateItem = (index: number, field: string, value: string | number) => {
    setCreateForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  useEffect(() => {
    if (apiBase) {
      loadOrders();
      loadProducts();
    }
  }, [apiBase]);

  return (
    <div className="App">
      <h1>Azure CRUD Orders Management</h1>
      
      {/* API Configuration */}
      <div className="api-config">
        <label>API Base URL: </label>
        <input
          type="text"
          value={apiBase}
          onChange={e => setApiBase(e.target.value)}
          placeholder="https://mycrudfunc.azurewebsites.net/api"
          style={{ width: 400 }}
        />
        <button onClick={initializeProducts} disabled={!apiBase || loading}>
          Initialize Products
        </button>
        <div className="api-help">
          <p><strong>💡 Quick Setup:</strong></p>
          <p>1. Enter your Azure Functions URL above</p>
          <p>2. Click "Initialize Products" to set up the database</p>
          <p>3. If you get errors, check the troubleshooting guide below</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button 
          className={activeTab === 'list' ? 'active' : ''} 
          onClick={() => setActiveTab('list')}
        >
          List Orders
        </button>
        <button 
          className={activeTab === 'create' ? 'active' : ''} 
          onClick={() => setActiveTab('create')}
        >
          Create Order
        </button>
        <button 
          className={activeTab === 'update' ? 'active' : ''} 
          onClick={() => setActiveTab('update')}
        >
          Update Order
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && <div className="loading">Loading...</div>}

      {/* Message Display */}
      {message && (
        <div className="message">
          <pre>{message}</pre>
          <button onClick={() => setMessage('')}>Clear</button>
        </div>
      )}

      {/* Troubleshooting Guide */}
      {!apiBase && (
        <div className="troubleshooting">
          <h3>🚀 Getting Started</h3>
          <ol>
            <li><strong>Deploy Azure Functions:</strong> Make sure your functions are deployed to Azure</li>
            <li><strong>Set Cosmos DB Connection:</strong> In Azure Portal &gt; Function App &gt; Configuration &gt; Application Settings, add:
              <br/><code>COSMOS_CONNECTION_STRING</code> = <code>AccountEndpoint=https://mycrudcosmos.documents.azure.com:443/;AccountKey=YOUR_KEY;</code>
            </li>
            <li><strong>Enter API URL:</strong> Use format: <code>https://mycrudfunc.azurewebsites.net/api</code></li>
            <li><strong>Initialize Products:</strong> Click the button above to set up sample products</li>
          </ol>
        </div>
      )}

      {/* List Orders Tab */}
      {activeTab === 'list' && (
        <div className="tab-content">
          <h2>Orders List</h2>
          <button onClick={loadOrders} disabled={!apiBase || loading}>
            Refresh Orders
          </button>
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-item">
                <h3>Order ID: {order.id}</h3>
                <p><strong>Customer:</strong> {order.customerName}</p>
                <p><strong>Address:</strong> {order.shippingAddress}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> ${order.total}</p>
                <div className="order-actions">
                  <button onClick={() => getOrder(order.id)}>View/Edit</button>
                  <button onClick={() => deleteOrder(order.id)} className="delete">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Order Tab */}
      {activeTab === 'create' && (
        <div className="tab-content">
          <h2>Create New Order</h2>
          <div className="form">
            <div>
              <label>Customer Name:</label>
              <input
                type="text"
                value={createForm.customerName}
                onChange={e => setCreateForm(prev => ({ ...prev, customerName: e.target.value }))}
              />
            </div>
            <div>
              <label>Shipping Address:</label>
              <textarea
                value={createForm.shippingAddress}
                onChange={e => setCreateForm(prev => ({ ...prev, shippingAddress: e.target.value }))}
              />
            </div>
            <div>
              <label>Items:</label>
              {createForm.items.map((item, index) => (
                <div key={index} className="item-row">
                  <select
                    value={item.productName}
                    onChange={e => updateCreateItem(index, 'productName', e.target.value)}
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product.productName} value={product.productName}>
                        {product.productName} - ${product.price}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={e => updateCreateItem(index, 'qty', parseInt(e.target.value))}
                    min="1"
                  />
                  <button onClick={() => removeItemFromCreate(index)}>Remove</button>
                </div>
              ))}
              <button onClick={addItemToCreate}>Add Item</button>
            </div>
            <button onClick={createOrder} disabled={!apiBase || loading}>
              Create Order
            </button>
          </div>
        </div>
      )}

      {/* Update Order Tab */}
      {activeTab === 'update' && (
        <div className="tab-content">
          <h2>Update Order</h2>
          {selectedOrder ? (
            <div className="form">
              <div>
                <label>Customer Name:</label>
                <input
                  type="text"
                  value={updateForm.customerName}
                  onChange={e => setUpdateForm(prev => ({ ...prev, customerName: e.target.value }))}
                />
              </div>
              <div>
                <label>Shipping Address:</label>
                <textarea
                  value={updateForm.shippingAddress}
                  onChange={e => setUpdateForm(prev => ({ ...prev, shippingAddress: e.target.value }))}
                />
              </div>
              <div>
                <label>Status:</label>
                <select
                  value={updateForm.status}
                  onChange={e => setUpdateForm(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">Select Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="button-group">
                <button onClick={updateOrder} disabled={!apiBase || loading}>
                  Update Order
                </button>
                <button onClick={() => setSelectedOrder(null)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p>Select an order from the list to update it.</p>
              <button onClick={() => setActiveTab('list')}>Go to Orders List</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
