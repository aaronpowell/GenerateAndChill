param name string
param location string = resourceGroup().location
param tags object = {}
param serviceName string = 'web'
param backendAppName string

module web '../core/host/staticwebapp.bicep' = {
  name: '${name}-deployment'
  params: {
    name: name
    location: location
    sku: {
      name: 'Standard'
      size: 'Standard'
    }
    tags: union(tags, { 'azd-service-name': serviceName })
  }
}

resource backend 'Microsoft.Web/sites@2022-03-01' existing = {
  name: backendAppName
}

resource swa 'Microsoft.Web/staticSites@2022-03-01' existing = {
  name: web.name
}

resource customBackend 'Microsoft.Web/staticSites/linkedBackends@2022-03-01' = {
  name: 'api'
  parent: swa
  properties: {
    backendResourceId: backend.id
    region: backend.location
  }
}

output SERVICE_WEB_NAME string = web.outputs.name
output SERVICE_WEB_URI string = web.outputs.uri
