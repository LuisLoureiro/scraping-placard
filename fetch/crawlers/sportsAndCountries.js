const cheerio = require('cheerio')

class Crawler {
  constructor (document) {
    this.$ = cheerio.load(document)
  }

  findList () {
    return this.$('#nav > li:not(.disabled)')
  }

  findCountries (sport = '') {
    return this.$(sport).find('ul > li > a')
  }

  findSportElem (sport = '') {
    return this.$(sport).children('.first').first()
  }
}

module.exports = Crawler
