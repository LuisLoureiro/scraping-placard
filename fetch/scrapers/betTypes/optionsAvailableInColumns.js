const cheerio = require('cheerio')
const moment = require('moment-timezone')

const BetLine = require('../../../models/betLine')
const NameValue = require('../../../models/nameValue')

module.exports = class OptionsAvailableInColumns {
  constructor (betLineElem) {
    this.$ = cheerio.load(betLineElem)
  }

  getCodeElem () {
    return this.$('.marketIndex')
  }

  getDateElem () {
    return this.$('.date')
  }

  getTimeElem () {
    return this.$('.time')
  }

  getOptionsElem () {
    return this.$('.outcome > .outcome-wrapper')
  }

  getBetLine () {
    const betLine = new BetLine()

    betLine.code = Number.parseInt(this.getCodeElem().text().trim(), 10)
    betLine.date = buildDateTime(this.getDateElem(), this.getTimeElem())
    betLine.optionsAvailable = this.buildOptions(this.getOptionsElem().get())

    return betLine
  }

  buildOptions (options) {
    return OptionsAvailableInColumns.transformElemsIntoNameValueObjects(options)
  }

  static transformElemsIntoNameValueObjects (options) {
    return options.map(option => {
      const children = option.children.filter(isElemOfTypeTag)
      const name = children[0].firstChild
      const odd = children[1].children.filter(isElemOfTypeTag)[0].firstChild

      return new NameValue(name.data.trim(), odd.data.trim())
    })
  }
}

function buildDateTime ($date, $time) {
  const dayAndMonthArray = $date.text().split(' / ')
  const hoursAndMinutesArray = $time.text().split('h')
  const date = moment().tz('Europe/Lisbon')

  date.month(Number.parseInt(dayAndMonthArray[1], 10) - 1)
  date.date(Number.parseInt(dayAndMonthArray[0], 10))
  date.hours(Number.parseInt(hoursAndMinutesArray[0], 10))
  date.minutes(Number.parseInt(hoursAndMinutesArray[1], 10))
  date.seconds(0)
  date.milliseconds(0)

  return date.valueOf()
}

function isElemOfTypeTag (elem) {
  return elem.type === 'tag'
}
