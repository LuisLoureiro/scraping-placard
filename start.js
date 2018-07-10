const Storage = require('./storage')
const {
  getCountryCompetitionsWithBets,
  getSportsAndCountries
} = require('./fetch')

module.exports = function handler (args) {
  const storage = new Storage(args.storageAddress)

  return setImmediate(start, storage)
}

function start (storage) {
  return storage
    .checkConnection()
    .then(getSportsAndCountries)
    .then(emptyThenSave.bind(null, storage, 'sportsAndCountries'))
    .then(getSportsAndCountriesCompetitionsWithBets)
    // Reduce to an array of countries with competitions
    .then(reducer)
    // Reduce to an array of competitions
    .then(reducer)
    .then(emptyThenSave.bind(null, storage, 'events'))
    .catch(err => {
      console.log(err)
    })
}

function getSportsAndCountriesCompetitionsWithBets (sports) {
  return Promise.all(sports.map(sport => {
    return new Promise((resolve, reject) => {
      resolve(Promise.all(sport.countries.map(country => {
        return getCountryCompetitionsWithBets(country, sport.name)
          .catch(error => reject(error))
      })))
    })
  }))
}

function emptyThenSave (storage, collectionName, data) {
  return storage.empty(collectionName)
    .then(() => storage.save(collectionName, data))
}

function reducer (array) {
  return array.reduce((prev, current) => prev.concat(current), [])
}
