const axios = require('axios')

const getSportsAndCountries = require('./scrapers/getSportsAndCountries')
const getEventsGroupedByCompetition = require('./scrapers/getEventsGroupedByCompetition')
const transformISO88591toUTF8 = require('./transformers/iso88591ToUTF8')
const transformArrayBufferToString = require('./transformers/arrayBufferToString')

const config = {
  baseURL: 'https://www.jogossantacasa.pt/',
  responseType: 'arraybuffer',
  timeout: 30000,
  transformResponse: [
    transformISO88591toUTF8,
    transformArrayBufferToString
  ]
}
const request = axios.create(config)

const fetch = {
  getSportsAndCountries () {
    const path = 'web/Placard/placard'

    return request
      .get(path)
      .then(response => response.data)
      .then(getSportsAndCountries)
  },
  getCountryEvents (country, sportName) {
    return request
      .get(country.url)
      .then(response => response.data)
      .then(getEventsGroupedByCompetition.bind(null, sportName, country.name))
  }
}

module.exports = fetch
