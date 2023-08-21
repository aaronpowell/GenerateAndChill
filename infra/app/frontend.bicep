param name string
param location string = resourceGroup().location
param tags object = {}
param serviceName string = 'web'

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

output SERVICE_WEB_NAME string = web.outputs.name
output SERVICE_WEB_URI string = web.outputs.uri
