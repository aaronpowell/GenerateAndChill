targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the the environment which is used to generate a short unique hash used in all resources.')
param environmentName string

param apiServiceName string = ''
param appServicePlanName string = ''
param resourceGroupName string = ''
param webServiceName string = ''

param chatGptDeploymentName string = 'gpt-35-turbo' // Set in main.parameters.json
param chatGptDeploymentCapacity int = 30
param chatGptModelName string = 'gpt-35-turbo'
param chatGptModelVersion string = '0613'

param openAiServiceName string = ''

@description('Id of the user or app to assign application roles')
param principalId string = ''

@description('Location for the OpenAI + API resource group')
@allowed([ 'canadaeast', 'eastus', 'eastus2', 'francecentral', 'japaneast', 'northcentralus' ])
@metadata({
  azd: {
    type: 'location'
  }
})
param location string

@description('Location for the frontend app resource group')
@allowed([ 'centralus', 'eastus2', 'eastasia', 'westeurope', 'westus2' ])
@metadata({
  azd: {
    type: 'location'
  }
})
param swaLocation string

var abbrs = loadJsonContent('./abbreviations.json')
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var tags = { 'azd-env-name': environmentName }

// Organize resources in a resource group
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: !empty(resourceGroupName) ? resourceGroupName : '${abbrs.resourcesResourceGroups}${environmentName}'
  location: location
  tags: tags
}

// The application frontend
module frontend './app/frontend.bicep' = {
  name: 'frontend'
  scope: rg
  params: {
    name: !empty(webServiceName) ? webServiceName : '${abbrs.webSitesAppService}web-${resourceToken}'
    location: swaLocation
    tags: tags
  }
}

module swaLink './linkSwaBackends.bicep' = {
  name: 'frontend-link'
  scope: rg
  params: {
    swaAppName: frontend.outputs.SERVICE_WEB_NAME
    backendAppName: api.outputs.SERVICE_API_NAME
  }
}

// The application backend
module api './app/backend.bicep' = {
  name: 'backend'
  scope: rg
  params: {
    name: !empty(apiServiceName) ? apiServiceName : '${abbrs.webSitesAppService}api-${resourceToken}'
    location: location
    tags: tags
    appServicePlanId: appServicePlan.outputs.id
    storageName: storage.outputs.name
    openAiName: openAi.outputs.name
    openAiModelName: chatGptDeploymentName
  }
}

// Create an App Service Plan to group applications under the same payment plan and SKU
module appServicePlan './core/host/appserviceplan.bicep' = {
  name: 'appserviceplan'
  scope: rg
  params: {
    name: !empty(appServicePlanName) ? appServicePlanName : '${abbrs.webServerFarms}${resourceToken}'
    location: location
    tags: tags
    sku: {
      name: 'B1'
    }
  }
}

module openAi 'core/ai/cognitiveservices.bicep' = {
  name: 'openai'
  scope: rg
  params: {
    name: !empty(openAiServiceName) ? openAiServiceName : 'cog-${resourceToken}'
    location: location
    tags: tags
    sku: {
      name: 'S0'
    }
    deployments: [
      {
        name: chatGptDeploymentName
        model: {
          format: 'OpenAI'
          name: chatGptModelName
          version: chatGptModelVersion
        }
        sku: {
          name: 'Standard'
          capacity: chatGptDeploymentCapacity
        }
      }
    ]
  }
}

module storage 'core/storage/storage-account.bicep' = {
  name: 'storage'
  scope: rg
  params: {
    name: '${abbrs.storageStorageAccounts}${resourceToken}'
    location: location
    tags: tags

    containers: [
      {
        name: 'image'
        publicAccess: 'Blob'
      }
    ]
  }
}

// App outputs
output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output REACT_APP_WEB_BASE_URL string = frontend.outputs.SERVICE_WEB_URI
