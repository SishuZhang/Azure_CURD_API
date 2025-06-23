# Azure CRUD API - Service Principal Setup

## Steps Taken

1. **Set the Azure Subscription**
   ```bash
   az account set --subscription "91ee12cc-5981-4847-b0ff-aec7e0db244e"
   ```

2. **Create the Service Principal**
   ```bash
   az ad sp create-for-rbac --name "cursor-azure-app" --role Contributor --scopes "/subscriptions/91ee12cc-5981-4847-b0ff-aec7e0db244e" --years 1
   ```

## Issue Encountered

- When running the above command, the following error occurred:
  > (MissingSubscription) The request did not have a subscription or a valid tenant level resource provider.
- The error message also showed the scope as a Windows path (e.g., `D:/software/Git/subscriptions/...`), which is incorrect.

## Solution

- The issue was resolved by:
  1. **Replacing `/` with `\` in the scope path** (for Windows compatibility)
  2. **Adding quotes around the scope argument** to ensure it is parsed correctly

- The working command:
  ```bash
  az ad sp create-for-rbac --name "cursor-azure-app" --role Contributor --scopes "\\subscriptions\\91ee12cc-5981-4847-b0ff-aec7e0db244e" --years 1
  ```

- Alternatively, for some environments, keeping the forward slashes but quoting the scope also works:
  ```bash
  az ad sp create-for-rbac --name "cursor-azure-app" --role Contributor --scopes "/subscriptions/91ee12cc-5981-4847-b0ff-aec7e0db244e" --years 1
  ```

## Notes
- Always ensure the scope is quoted and uses the correct path separator for your environment.
- If you encounter subscription errors, double-check your active subscription and the format of your scope argument. 