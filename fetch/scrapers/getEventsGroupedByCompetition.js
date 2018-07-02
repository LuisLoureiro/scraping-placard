const cheerio = require('cheerio')
const moment = require('moment-timezone')

const Competition = require('../../models/competition')
const Event = require('../../models/event')
const Bet = require('../../models/bet')
const NameValue = require('../../models/nameValue')

module.exports = function getEventsGroupedByCompetition (sport, country, document) {
  const $ = cheerio.load(document)

  return getCompetitions($, sport, country)
}

function getCompetitions ($, sport, country) {
  const competitions = []

  return $('body > .wrapper > .contentMain > .main.sport > .section')
    .children('.header')
    .each(setCompetitionName.bind(null, $, competitions, sport, country))
    .end()
    .children('.competition')
    .map(setCompetitionEvents.bind(null, $, competitions))
    .get()
}

function setCompetitionName ($, competitions, sport, country, idx, elem) {
  const $elem = $(elem)
  const competition = new Competition()

  competition.name = $elem.children('h2')
    .text()
    .trim()

  competition.sport = sport
  competition.country = country

  competitions.push(competition)

  return competition
}

function setCompetitionEvents ($, competitions, idx, elem) {
  const $elem = $(elem)
  const events = []

  $elem.children('.dates')
    .each(getEventsForBet.bind(null, $, events, competitions[idx]))

  return events
}

function getEventsForBet ($, events, competition, idx, elem) {
  const $elem = $(elem)
  const betName = getBetName($elem)

  if (betName === 'Resultado exato' || betName === 'INT/TR') {
    return
  }

  $elem.find('.events table tr')
    .each(createOrUpdateEvent.bind(null, $, events, betName, competition))
}

function createOrUpdateEvent ($, events, betName, competition, idx, elem) {
  const $elem = $(elem)
  const code = Number.parseInt($elem.children('.marketIndex')
    .text()
    .trim(), 10)
  let event

  if (!(event = getEvent(code, events))) {
    events.push(event = createEvent(code, competition, $elem))
  }

  event.bets.push(
    getBets(betName, $elem.children('.outcome')))

  return event
}

function getEvent (code, events) {
  return events.find(event => event.code === code)
}

function createEvent (code, competition, $elem) {
  const event = new Event(code)
  const eventDayAndMonthArray = $elem.children('.date')
    .text()
    .split(' / ')
  const eventHoursAndMinutesArray = $elem.children('.time')
    .text()
    .split('h')
  const keysValues = $elem.children('.outcome')

  event.sport = competition.sport
  event.country = competition.country
  event.competition = competition.name

  event.date = moment().tz('Europe/Lisbon')
  event.date.month(Number.parseInt(eventDayAndMonthArray[1], 10) - 1)
  event.date.date(Number.parseInt(eventDayAndMonthArray[0], 10))
  event.date.hours(Number.parseInt(eventHoursAndMinutesArray[0], 10))
  event.date.minutes(Number.parseInt(eventHoursAndMinutesArray[1], 10))
  event.date.seconds(0)
  event.date.milliseconds(0)
  event.date = event.date.valueOf()

  event.home = keysValues.first()
    .children('.outcome-wrapper')
    .first()
    .children()
    .first()
    .text()
    .trim()

  event.away = keysValues.last()
    .children('.outcome-wrapper')
    .first()
    .children()
    .first()
    .text()
    .trim()

  return event
}

function getBetName ($context) {
  return $context.prev()
    .children('h3')
    .text()
    .trim()
}

function getBets (betName, $keysValues) {
  const bet = new Bet(betName)
  const homeName = $keysValues.first()
    .children('.outcome-wrapper')
    .first()
    .children()
    .first()
    .text()
    .trim()
  const awayName = $keysValues.last()
    .children('.outcome-wrapper')
    .first()
    .children()
    .first()
    .text()
    .trim()
  const homeValue = $keysValues.first()
    .find('.price')
    .text()
    .trim()
  const awayValue = $keysValues.last()
    .find('.price')
    .text()
    .trim()
  let drawName
  let drawValue

  if ($keysValues.length === 3) {
    drawName = $keysValues.eq(1)
      .children('.outcome-wrapper')
      .first()
      .children()
      .first()
      .text()
      .trim()
    drawValue = $keysValues.eq(1)
      .find('.price')
      .text()
      .trim()
  }

  bet.home = new NameValue(homeName, homeValue)
  bet.away = new NameValue(awayName, awayValue)
  bet.draw = new NameValue(drawName, drawValue)

  return bet
}
