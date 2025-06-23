# Azure CRUD API - Full Stack Solution

## Overview
This project provides a full-stack CRUD solution on Azure, inspired by the [aws-crud-api](https://github.com/SishuZhang/aws-crud-api) project. It includes:
- Azure Functions for CRUD operations on orders and product initialization
- Azure Cosmos DB for NoSQL storage
- Azure API Management for API gateway features
- Application Insights for monitoring
- A React (TypeScript) frontend for interacting with the API
- Infrastructure as Code (IaC) using a single Bicep file

---

## Infrastructure Deployment

All Azure resources are provisioned using the root `main.bicep` file. This includes Cosmos DB, Function App, Storage, Application Insights, and API Management.

### Deploy with Azure CLI
```bash
az deployment group create \
  --resource-group <your-rg> \
  --template-file main.bicep \
  --parameters prefix=mycrud
```

---

## Azure Functions

- **CreateOrderFunction**: POST `/orders`
- **GetOrderFunction**: GET `/orders/{orderId}`
- **ListOrdersFunction**: GET `/orders`
- **UpdateOrderFunction**: PUT `/orders/{orderId}`
- **DeleteOrderFunction**: DELETE `/orders/{orderId}`
- **InitializeProductsFunction**: POST `/products/init`

All functions use Cosmos DB for storage. The connection string is set via app settings.

---

## Frontend (React + TypeScript)

A React app is provided in the `frontend/` directory. It allows you to:
- Create an order
- View an order by ID
- Update an order
- Delete an order

### Running the Frontend Locally
```bash
cd frontend
npm install
npm start
```
The app will prompt for your API base URL (from API Management or Function App).

---

## Notes
- Only the root `main.bicep` is needed for deployment. The `Azure_CURD_API/main.bicep` is not required.
- Update your Azure Pipeline and Function App settings as needed.
- For local development, set your Cosmos DB connection string in `local.settings.json`. 