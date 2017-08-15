const cheerio = require('cheerio')

const Sport = require('../../models/sport')
const Country = require('../../models/country')

module.exports = function getSportsAndCountries (document) {
  const $ = cheerio.load(document)

  return $('#nav > li:not(.disabled)')
    .map(mapSport.bind(null, $))
    .get()
}

function mapSport ($, idx, elem) {
  const $elem = $(elem)
  const sport = new Sport()

  sport.name = $elem.children('.first')
    .text()
    .trim()
  sport.countries = $elem.find('ul > li > a')
    .map(mapCountry.bind(null, $))
    .get()

  return sport
}

function mapCountry ($, idx, elem) {
  const $elem = $(elem)
  const country = new Country()

  country.name = $elem.text().trim()
  country.url = $elem.attr('href')

  return country
}
