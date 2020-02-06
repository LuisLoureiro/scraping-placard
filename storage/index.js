const MongoClient = require('mongodb').MongoClient

module.exports = class MongoDB {
  constructor (address) {
    this.URL = address
  }

  checkConnection () {
    // Use connect method to connect to the server
    return connect(this.URL)
      .then(client => {
        const db = client.db()

        console.log(`Connected successfully to server. Database name = ${db.databaseName}.`)

        client.close()
      })
  }

  save (collectionName, data) {
    return connect(this.URL)
      .then(client => {
        const db = client.db()

        return insertData(db, collectionName, data)
          .then(result => {
            client.close()

            return result.ops
          })
          .catch(err => {
            client.close()

            throw err
          })
      })
  }

  empty (collectionName) {
    return connect(this.URL)
      .then(client => {
        const db = client.db()

        return removeData(db, collectionName, {})
          .then(result => {
            client.close()

            return result.acknowledged
          })
          .catch(err => {
            client.close()

            throw err
          })
      })
  }
}

function connect (url) {
  return MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
}

function insertData (db, collectionName, data) {
  // Get the collection
  const collection = db.collection(collectionName)
  // Insert data
  return collection.insertMany(data)
    .then(result => {
      console.log(`Inserted ${result.result.n} documents in the "${collectionName}" collection`)

      return result
    })
}

function removeData (db, collectionName, filter) {
  // Get the collection
  const collection = db.collection(collectionName)
  // Remove data
  return collection.deleteMany(filter)
    .then(result => {
      console.log(`Removed ${result.result.n} documents in the "${collectionName}" collection`)

      return result
    })
}
