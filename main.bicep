@description('Name prefix for all resources')
param prefix string = 'crudapi'

@description('Azure region')
param location string = resourceGroup().location

@description('Cosmos DB account name')
param cosmosAccountName string = '${prefix}cosmos'

@description('Function App name')
param functionAppName string = '${prefix}func'

@description('App Insights name')
param appInsightsName string = '${prefix}ai'

@description('Storage Account name')
param storageAccountName string = toLower('${prefix}storage${uniqueString(resourceGroup().id)}')

resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: cosmosAccountName
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
      }
    ]
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    capabilities: [
      {
        name: 'EnableServerless'
      }
    ]
  }
}

resource cosmosDbDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  name: '${cosmosDb.name}/shop'
  properties: {
    resource: {
      id: 'shop'
    }
  }
}

resource ordersContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  name: '${cosmosDb.name}/shop/orders'
  properties: {
    resource: {
      id: 'orders'
      partitionKey: {
        paths: ['/id']
        kind: 'Hash'
      }
    }
  }
}

resource productsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  name: '${cosmosDb.name}/shop/products'
  properties: {
    resource: {
      id: 'products'
      partitionKey: {
        paths: ['/productName']
        kind: 'Hash'
      }
    }
  }
}

resource storage 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {}
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
  }
}

resource functionApp 'Microsoft.Web/sites@2022-09-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: ''
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: storage.properties.primaryEndpoints.blob
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
        {
          name: 'COSMOS_CONNECTION_STRING'
          value: listKeys(cosmosDb.name, cosmosDb.apiVersion).primaryMasterKey
        }
      ]
    }
    httpsOnly: true
  }
  identity: {
    type: 'SystemAssigned'
  }
  dependsOn: [
    storage
    appInsights
    cosmosDb
  ]
}

output cosmosDbEndpoint string = cosmosDb.properties.documentEndpoint
output cosmosDbKey string = listKeys(cosmosDb.name, cosmosDb.apiVersion).primaryMasterKey
output functionAppName string = functionApp.name
output appInsightsName string = appInsights.name