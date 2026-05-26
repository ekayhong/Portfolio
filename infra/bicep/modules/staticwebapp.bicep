@description('Prefix')
param prefix string
param location string

resource swa 'Microsoft.Web/staticSites@2022-03-01' = {
  name: '${prefix}-swa'
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
  }
}

output staticSiteName string = swa.name
