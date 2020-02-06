const getBetTypesWithBetLines = require('./getBetTypesWithBetLines')

const CompetitionsCrawler = require('../crawlers/competitions')

const Competition = require('../../models/competition')

module.exports = function getBetsGroupedByCompetition (sport, country, document) {
  const crawler = new CompetitionsCrawler(document)

  return getCompetitions(crawler, sport, country)
}

function getCompetitions (crawler, sport, country) {
  const competitionsBlock = crawler.findBlock()
  const competitions = competitionsBlock
    .map(getCompetitionsHeadings.bind(null, crawler))
    .map(createCompetition.bind(null, sport, country))
    .get()

  return competitionsBlock
    .map(getCompetitionsBets.bind(null, crawler))
    .map(updateCompetitionWithBets.bind(null, competitions))
    .get()
}

function getCompetitionsHeadings (crawler, idx, block) {
  return crawler.findHeading(block).get()
}

function createCompetition (sport, country, idx, elem) {
  const competition = new Competition()

  competition.name = elem.firstChild.data.trim()

  competition.sport = sport
  competition.country = country

  return competition
}

function getCompetitionsBets (crawler, idx, block) {
  return crawler.findBetsBlock(block).get()
}

function updateCompetitionWithBets (competitions, idx, betsBlock) {
  competitions[idx].betTypes = getBetTypesWithBetLines(betsBlock)

  return competitions[idx]
}
