const cheerio = require('cheerio')

class Crawler {
  constructor (document) {
    this.$ = cheerio.load(document)
  }

  findList () {
    return this.$('body > .wrapper > .contentMain > .main.sport > .section')
  }

  findHeading (competition = '') {
    return this.$(competition).find('.header > h2')
  }

  findBetsBlock (competition = '') {
    return this.$(competition).children('.competition')
  }
}

module.exports = Crawler
