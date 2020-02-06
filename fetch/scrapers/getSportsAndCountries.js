const SportsAndCountriesCrawler = require('../crawlers/sportsAndCountries')
const Sport = require('../../models/sport')
const Country = require('../../models/country')

module.exports = function getSportsAndCountries (document) {
  const crawler = new SportsAndCountriesCrawler(document)

  return crawler.findList()
    .map(mapSport.bind(null, crawler))
    .get()
}

function mapSport (crawler, idx, elem) {
  const sport = new Sport()

  sport.name = crawler.findSportElem(elem).text().trim()
  sport.countries = crawler.findCountries(elem)
    .map(mapCountry)
    .get()

  return sport
}

function mapCountry (idx, elem) {
  const country = new Country()

  country.name = elem.firstChild.data.trim()
  country.url = elem.attribs.href

  return country
}
