const betTypesScrapy = require('./betTypes/index')

const BetsCrawler = require('../crawlers/bets')

const BetType = require('../../models/betType')

module.exports = function getBetTypesWithBetLines (betsBlockElem) {
  const betsCrawler = new BetsCrawler(betsBlockElem)

  return betsCrawler.findHeadings()
    .map(getBetLines.bind(null, betsCrawler))
    .get()
}

function getBetLines (betsCrawler, idx, headingElem) {
  const betTypeName = headingElem.firstChild.data.trim()
  const betLines = betsCrawler.findBetLines(headingElem)
    .map((idx, betLine) => betTypesScrapy.getBetLine(betTypeName, betLine))
    .get()

  return new BetType(betTypeName, betLines)
}
