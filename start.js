const Storage = require('./storage')
const {
  getCountryEvents,
  getSportsAndCountries
} = require('./fetch')

module.exports = function handler (args) {
  const storage = new Storage(args.storageAddress, args.storagePath)

  return setImmediate(start, storage)
}

function start (storage) {
  return storage
    .checkConnection()
    .then(getSportsAndCountries)
    .then(emptyThenSave.bind(null, storage, 'sportsAndCountries'))
    .then(getSportsAndCountriesEvents)
    // Merge sports
    .then(merge)
    // Merge countries
    .then(merge)
    // Merge competitions
    .then(merge)
    .then(emptyThenSave.bind(null, storage, 'events'))
    .catch(err => {
      console.log(err)
    })
}

function getSportsAndCountriesEvents (sports) {
  return Promise.all(sports.map(sport => {
    return new Promise((resolve, reject) => {
      resolve(Promise.all(sport.countries.map(country => {
        return getCountryEvents(country, sport.name)
          .catch(error => reject(error))
      })))
    })
  }))
}

function emptyThenSave (storage, collectionName, data) {
  return storage.empty(collectionName)
    .then(() => storage.save(collectionName, data))
}

function merge (array) {
  return array.reduce((prev, current) => prev.concat(current), [])
}
