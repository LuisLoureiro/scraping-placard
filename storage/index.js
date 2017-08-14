const MongoClient = require('mongodb').MongoClient

function connect (url) {
  return MongoClient.connect(url)
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

class MongoDB {
  constructor (address) {
    this.URL = address
  }

  checkConnection () {
    // Use connect method to connect to the server
    return connect(this.URL)
      .then(db => {
        console.log(`Connected successfully to server. Database name = ${db.databaseName}.`)

        db.close()
      })
  }

  save (collectionName, data) {
    return connect(this.URL)
      .then(db => {
        return insertData(db, collectionName, data)
          .then(result => {
            db.close()

            return result.ops
          })
          .catch(err => {
            db.close()

            throw err
          })
      })
  }

  empty (collectionName) {
    return connect(this.URL)
      .then(db => {
        return removeData(db, collectionName, {})
          .then(result => {
            db.close()

            return result.acknowledged
          })
          .catch(err => {
            db.close()

            throw err
          })
      })
  }
}

module.exports = MongoDB
