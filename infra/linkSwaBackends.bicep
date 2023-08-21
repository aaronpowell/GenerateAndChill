param backendAppName string
param swaAppName string

resource backend 'Microsoft.Web/sites@2022-03-01' existing = {
  name: backendAppName
}

resource swa 'Microsoft.Web/staticSites@2022-03-01' existing = {
  name: swaAppName
}

resource customBackend 'Microsoft.Web/staticSites/linkedBackends@2022-03-01' = {
  name: 'api'
  parent: swa
  properties: {
    backendResourceId: backend.id
    region: backend.location
  }
}
