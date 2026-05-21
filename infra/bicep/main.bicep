targetScope = 'subscription'

@description('Prefix applied to resource names')
param prefix string = 'portfolio'
@description('Optional explicit resource group name. If empty, rg-{prefix}-{env} is used')
param resourceGroupName string = ''
@description('Azure location')
param location string = 'francecentral'
@description('Repository URL (optional)')
param repositoryUrl string = ''
@description('Environment used by Cosmos firewall rules')
@allowed(['prod', 'staging'])
param env string = 'prod'
@description('Reuse an existing Cosmos Mongo vCore cluster from another resource group')
param useExistingCosmos bool = true
@description('Resource group name of the existing Cosmos cluster (required when useExistingCosmos=true)')
param existingCosmosResourceGroupName string = ''
@description('Cluster name of the existing Cosmos cluster (required when useExistingCosmos=true)')
param existingCosmosClusterName string = ''
@description('Cosmos Mongo admin username')
param cosmosAdminUsername string = 'kayonapp'
@secure()
@description('Cosmos Mongo admin password (required only when useExistingCosmos=false)')
param cosmosAdminPassword string = ''
@description('Common resource tags')
param tags object = {}
@description('Deploy Key Vault (set true only if needed)')
param deployKeyVault bool = false

var rgName = empty(resourceGroupName) ? 'rg-${prefix}-${env}' : resourceGroupName
var existingCosmosConnectionString = existingCosmos.?properties.?connectionString ?? ''

// Create or ensure resource group (subscription scope deploys can create RG)
module rg './modules/rg.bicep' = {
  name: 'rg'
  scope: subscription()
  params: {
    rgName: rgName
    location: location
  }
}

module keyVault './modules/keyvault.bicep' = if (deployKeyVault) {
  name: 'keyvault'
  scope: resourceGroup(rgName)
  params: {
    prefix: prefix
    location: location
  }
}

resource existingCosmos 'Microsoft.DocumentDB/mongoClusters@2025-09-01' existing = if (useExistingCosmos) {
  scope: resourceGroup(existingCosmosResourceGroupName)
  name: existingCosmosClusterName
}

module cosmos './modules/cosmos.bicep' = if (!useExistingCosmos) {
  name: 'cosmos'
  scope: resourceGroup(rgName)
  params: {
    location: location
    clusterName: '${prefix}-mongo'
    env: env
    adminUsername: cosmosAdminUsername
    adminPassword: cosmosAdminPassword
    tags: tags
  }
}

module staticApp './modules/staticwebapp.bicep' = {
  name: 'staticApp'
  scope: resourceGroup(rgName)
  params: {
    prefix: prefix
    location: location
    repositoryUrl: repositoryUrl
  }
}

output cosmosClusterName string = useExistingCosmos ? existingCosmos.name : (cosmos.?outputs.?clusterName ?? '')
output cosmosHost string = useExistingCosmos
  ? (empty(existingCosmosConnectionString) ? '' : split(split(existingCosmosConnectionString, '@')[1], '/')[0])
  : (cosmos.?outputs.?host ?? '')
output staticSiteName string = staticApp.outputs.staticSiteName
output keyVaultName string = keyVault.?outputs.?keyVaultName ?? ''
