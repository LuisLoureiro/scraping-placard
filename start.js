const Storage = require('./storage')
const {
  getCountryCompetitionsWithBets,
  getSportsAndCountries
} = require('./fetch')
const Event = require('./models/event')

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
    .then(transformIntoEvents)
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

function transformIntoEvents (competitions) {
  const events = []

  goThroughEveryCompetition(
    goThroughEveryBetType.bind(null,
      goThroughEveryBetLine.bind(null,
        getOrCreateEvent.bind(null,
          addBetType,
          events
        )
      )
    ), competitions
  )

  return events
}

function goThroughEveryCompetition (next, competitions) {
  competitions.forEach(competition => {
    next(competition.betTypes, competition)
  })
}

function goThroughEveryBetType (next, betTypes, competition) {
  betTypes.forEach(betType => {
    next(betType.betLines, competition, betType)
  })
}

function goThroughEveryBetLine (next, betLines, competition, betType) {
  betLines.forEach(betLine => {
    next(betLine.optionsAvailable, competition, betType, betLine)
  })
}

function getOrCreateEvent (next, events, options, competition, betType, betLine) {
  // Encontrar o objeto Event a que corresponde o code que está na betLine
  const idx = events.findIndex(event => event.code === betLine.code)
  let event

  if (idx === -1) {
    event = new Event(betLine.code)
    event.date = betLine.date
    event.home = options[0].name
    event.away = options[options.length - 1].name
    event.competition = competition.name
    event.country = competition.country
    event.sport = competition.sport

    events.push(event)
  } else {
    event = events[idx]
  }

  return next(event, betType, options)
}

function addBetType (event, betType, options) {
  event.betTypes.push({
    name: betType.name,
    options
  })
}

function emptyThenSave (storage, collectionName, data) {
  return storage.empty(collectionName)
    .then(() => storage.save(collectionName, data))
}

function reducer (array) {
  return array.reduce((prev, current) => prev.concat(current), [])
}
