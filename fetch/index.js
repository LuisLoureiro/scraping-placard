const axios = require('axios')

const getSportsAndCountries = require('./scrapers/getSportsAndCountries')
const getBetsGroupedByCompetition = require('./scrapers/getBetsGroupedByCompetition')
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

module.exports = {
  getSportsAndCountries () {
    const path = 'web/Placard/placard'

    return request
      .get(path)
      .then(response => response.data)
      .then(getSportsAndCountries)
  },
  getCountryCompetitionsWithBets (country, sportName) {
    return request
      .get(country.url)
      .then(response => response.data)
      .then(getBetsGroupedByCompetition.bind(null, sportName, country.name))
  }
}
