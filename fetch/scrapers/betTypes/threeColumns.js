const cheerio = require('cheerio')
const moment = require('moment-timezone')

const BetLine = require('../../../models/betLine')
const NameValue = require('../../../models/nameValue')

module.exports = class ThreeColumns {
  constructor (betLineElem) {
    this.$ = cheerio.load(betLineElem)
  }

  getBetLine () {
    const betLine = new BetLine()

    betLine.code = Number.parseInt(this.$('.marketIndex').text().trim(), 10)
    betLine.date = buildDateTime(this.$('.date'), this.$('.time'))
    betLine.optionsAvailable = buildOptions(this.$('.outcome > .outcome-wrapper'))

    return betLine
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

function buildOptions ($options) {
  return $options.map((idx, option) => {
    const children = filterChildrenTags(option)
    const name = children[0].firstChild
    const odd = filterChildrenTags(children[1])[0].firstChild

    return new NameValue(name.data.trim(), odd.data.trim())
  }).get()
}

function filterChildrenTags (elem) {
  return elem.children.filter(child => child.type === 'tag')
}
