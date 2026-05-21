@description('Prefix')
param prefix string
param location string
param repositoryUrl string = ''

resource swa 'Microsoft.Web/staticSites@2022-03-01' = {
  name: '${prefix}-swa'
  location: location
  sku: {
    name: 'Free'
  }
  properties: {
    repositoryUrl: repositoryUrl
  }
}

output staticSiteName string = swa.name
