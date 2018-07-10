const getBetTypesWithBetLines = require('./getBetTypesWithBetLines')

const CompetitionsCrawler = require('../crawlers/competitions')

const Competition = require('../../models/competition')

module.exports = function getBetsGroupedByCompetition (sport, country, document) {
  const crawler = new CompetitionsCrawler(document)

  return getCompetitions(crawler, sport, country)
}

function getCompetitions (crawler, sport, country) {
  const listOfCompetitionBlocks = crawler.findList()
  const competitions = listOfCompetitionBlocks
    .map(getCompetitionHeading.bind(null, crawler))
    .map(createCompetition.bind(null, sport, country))
    .get()

  return listOfCompetitionBlocks
    .map(getCompetitionBets.bind(null, crawler))
    .map(updateCompetitionWithBets.bind(null, competitions))
    .get()
}

function getCompetitionHeading (crawler, idx, block) {
  return crawler.findHeading(block).get(0)
}

function createCompetition (sport, country, idx, elem) {
  const competition = new Competition()

  competition.name = elem.firstChild.data.trim()

  competition.sport = sport
  competition.country = country

  return competition
}

function getCompetitionBets (crawler, idx, block) {
  return crawler.findBetsBlock(block).get(0)
}

function updateCompetitionWithBets (competitions, idx, betsBlock) {
  competitions[idx].betTypes = getBetTypesWithBetLines(betsBlock)

  return competitions[idx]
}
