@description('The name of the app service resource within the current resource group scope')
param name string

@description('The app settings to be applied to the app service')
@secure()
param appSettings object

resource swa 'Microsoft.Web/staticSites@2022-03-01' existing = {
  name: name
}

resource symbolicname 'Microsoft.Web/staticSites/config@2022-03-01' = {
  name: 'appsettings'
  kind: 'string'
  parent: swa
  properties: appSettings
}
