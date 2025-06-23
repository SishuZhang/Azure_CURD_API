resource apiManagement 'Microsoft.ApiManagement/service@2022-08-01' = {
  name: '${prefix}apim'
  location: location
  sku: {
    name: 'Consumption'
    capacity: 0
  }
  properties: {
    publisherEmail: 'admin@contoso.com'
    publisherName: 'Contoso'
  }
}

resource api 'Microsoft.ApiManagement/service/apis@2022-08-01' = {
  name: '${apiManagement.name}/crudapi'
  properties: {
    displayName: 'CRUD API'
    path: 'crudapi'
    protocols: [ 'https' ]
    serviceUrl: 'https://${functionApp.name}.azurewebsites.net/api'
    apiRevision: '1'
    subscriptionRequired: false
    isCurrent: true
    format: 'swagger-link-json'
    value: 'https://${functionApp.name}.azurewebsites.net/api/swagger.json'
  }
  dependsOn: [ functionApp ]
}

output apiManagementName string = apiManagement.name
output apiManagementEndpoint string = 'https://${apiManagement.name}.azure-api.net/crudapi' 