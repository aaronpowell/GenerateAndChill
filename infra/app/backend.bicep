param name string
param location string = resourceGroup().location
param tags object = {}

param allowedOrigins array = []
param appCommandLine string = ''
param applicationInsightsName string = ''
param appServicePlanId string
param serviceName string = 'backend'

param storageName string
param openAiName string

resource imageStorage 'Microsoft.Storage/storageAccounts@2021-04-01' existing = {
  name: storageName
}

resource openAi 'Microsoft.CognitiveServices/accounts@2023-05-01' existing = {
  name: openAiName
}

var storageConnectionString = 'DefaultEndpointsProtocol=https;AccountName=${imageStorage.name};AccountKey=${imageStorage.listKeys().keys[0].value};EndpointSuffix=core.windows.net'

module api '../core/host/appservice.bicep' = {
  name: '${name}-app-module'
  params: {
    name: name
    location: location
    tags: union(tags, { 'azd-service-name': serviceName })
    allowedOrigins: allowedOrigins
    appCommandLine: appCommandLine
    applicationInsightsName: applicationInsightsName
    appServicePlanId: appServicePlanId
    appSettings: {
      Azure__OpenAIEndpoint: openAi.properties.endpoint
      Azure__OpenAIKey: openAi.listKeys().key1
      Azure__BlobStorageConnectionString: storageConnectionString
      Azure__TableStorageConnectionString: storageConnectionString
    }
    runtimeName: 'dotnetcore'
    runtimeVersion: '7.0'
    scmDoBuildDuringDeployment: false
  }
}

output SERVICE_API_IDENTITY_PRINCIPAL_ID string = api.outputs.identityPrincipalId
output SERVICE_API_NAME string = api.outputs.name
output SERVICE_API_URI string = api.outputs.uri
