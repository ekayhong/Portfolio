param location string
param clusterName string
param tags object = {}

@secure()
param adminPassword string
param adminUsername string = 'kayonapp'

@description('Environnement cible — conditionne les règles firewall')
@allowed(['prod', 'staging'])
param env string = 'prod'

resource cosmosCluster 'Microsoft.DocumentDB/mongoClusters@2025-09-01' = {
  name: clusterName
  location: location
  tags: tags
  properties: {
    administrator: {
      userName: adminUsername
      password: adminPassword
    }
    serverVersion: '7.0'
    sharding: {
      shardCount: 1
    }
    storage: {
      sizeGb: 32
    }
    highAvailability: {
      targetMode: 'Disabled'
    }
    compute: {
      tier: 'Free'
    }
  }
}

resource allowAzureServices 'Microsoft.DocumentDB/mongoClusters/firewallRules@2025-09-01' = {
  parent: cosmosCluster
  name: 'allow-azure-services'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource allowAllDev 'Microsoft.DocumentDB/mongoClusters/firewallRules@2025-09-01' = if (env == 'staging') {
  parent: cosmosCluster
  name: 'allow-all-dev'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '255.255.255.255'
  }
}

var connectionStringFull = cosmosCluster.properties.connectionString
var hostOnly = split(split(connectionStringFull, '@')[1], '/')[0]
var encodedPassword = replace(replace(replace(adminPassword, '@', '%40'), '!', '%21'), '#', '%23')
var connectionString = 'mongodb+srv://${adminUsername}:${encodedPassword}@${hostOnly}/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000'

output clusterName string = cosmosCluster.name
output connectionString string = connectionString
output host string = hostOnly
