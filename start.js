const Storage = require('./storage')
const {
  getCountryEvents,
  getSportsAndCountries
} = require('./fetch')

function handler (args) {
  const storage = new Storage(args.storageAddress, args.storagePath)

  return setImmediate(start, storage)
}

function start (storage) {
  return storage
    .checkConnection()
    .then(getSportsAndCountries)
    .then(getSportsAndCountriesEvents)
    .then(data => {
      return storage.empty('sports')
        .then(() => storage.save('sports', data))
    })
    .catch(err => {
      console.log(err)
    })
}

function getSportsAndCountriesEvents (sports) {
  const promises = sports.map(sportAndCountries => {
    return new Promise((resolve, reject) => {
      sportAndCountries.countries.forEach(country => {
        resolve(getCountryEvents(country)
          .then(events => {
            country.competitions = events
            return events
          })
          .catch(error => reject(error)))
      })
    })
  })

  return Promise.all(promises)
    .then(resolvedPromises => sports)
}

module.exports = handler
