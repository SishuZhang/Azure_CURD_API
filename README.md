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

## Prerequisites
- Azure CLI installed ([Install Guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli))
- Node.js and npm installed
- An Azure subscription
- (Optional) GitHub repository for CI/CD

---

## 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd <repo-directory>
```

---

## 2. Create an Azure Resource Group
```bash
az group create --name <your-resource-group> --location <your-azure-region>
```
Example:
```bash
az group create --name mycrud-rg --location eastus
```

---

## 3. Deploy Infrastructure with Bicep
The root `main.bicep` provisions Cosmos DB, Function App, Storage, Application Insights, and API Management.

```bash
az deployment group create \
  --resource-group <your-resource-group> \
  --template-file main.bicep \
  --parameters prefix=mycrud
```

---

## 4. Deploy Azure Functions

### Option 1: Azure CLI
1. Build and package your functions (if needed):
   ```bash
   cd <project-root>
   npm install
   # (Optional) npm run build
   ```
2. Deploy to Azure:
   ```bash
   func azure functionapp publish <your-function-app-name>
   ```
   - The function app name is output from the Bicep deployment (or find it in the Azure Portal).

### Option 2: GitHub Actions (CI/CD)
- The provided `azure-pipelines.yml` can be adapted for GitHub Actions or used in Azure DevOps for automated deployment.
- Set up your Azure credentials as repository secrets.

---

## 5. Configure API Management
- The Bicep file creates API Management and exposes your functions as an API.
- You can manage and test your API in the [Azure Portal > API Management](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.ApiManagement%2Fservice).
- The API endpoint will be:
  ```
  https://<your-apim-name>.azure-api.net/crudapi
  ```
- You can find the actual endpoint in the Bicep outputs or the Azure Portal.

---

## 6. Deploy and Run the Frontend

### Local Development
1. Go to the frontend directory:
   ```bash
   cd frontend
   npm install
   npm start
   ```
2. When prompted, enter your API Management endpoint (e.g., `https://<your-apim-name>.azure-api.net/crudapi`).

### Azure Static Web Apps (Optional)
- You can deploy the frontend to [Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/getting-started?tabs=react) for a fully managed experience.
- Follow the Azure Portal or CLI instructions to link your GitHub repo and deploy.

---

## 7. Test the Solution
- Use the frontend UI to create, view, update, and delete orders.
- You can also use tools like Postman or curl to test the API endpoints directly.

---

## 8. Monitoring and Management
- Use [Application Insights](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/microsoft.insights%2Fcomponents) for logs and telemetry.
- Use [Azure Monitor](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/microsoft.insights%2Fcomponents) for metrics and alerts.
- Manage your resources in the [Azure Portal](https://portal.azure.com/).

---

## Notes
- Only the root `main.bicep` is needed for deployment. The `Azure_CURD_API/main.bicep` is not required.
- For local development, set your Cosmos DB connection string in `local.settings.json` in the Azure Functions project.
- Update your Azure Pipeline and Function App settings as needed. 