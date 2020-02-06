const cheerio = require('cheerio')

class Crawler {
  constructor (document) {
    this.$ = cheerio.load(document)
  }

  findHeadings () {
    return this.$('.competition > .header.allmarkets > h3')
  }

  findDates () {
    return this.$('.competition > .dates > .events')
  }

  findDatesForBetType (betHeading = '') {
    return this.$(betHeading).parent().next('.dates').children('.events')
  }

  findEventLinesForDate (dateElem = '') {
    return this.$(dateElem).children('.wide-table').find('tbody > tr')
  }

  findBetLines (betHeading = '') {
    return this.$(betHeading).parent().next('.dates').find('.events > .wide-table > tbody > tr')
  }
}

module.exports = Crawler
