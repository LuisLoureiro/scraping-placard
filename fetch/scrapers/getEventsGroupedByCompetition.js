const cheerio = require('cheerio')

const Competition = require('../../models/competition')
const Event = require('../../models/event')
const Bet = require('../../models/bet')
const NameValue = require('../../models/nameValue')

function getEventsGroupedByCompetition (document) {
  const $ = cheerio.load(document)

  return getCompetitions($)
}

function getCompetitions ($) {
  const competitions = []

  $('body > .wrapper > .contentMain > .main.sport > .section')
    .children('.header')
    .each(setCompetitionName.bind(null, $, competitions))
    .end()
    .children('.competition')
    .each(setCompetitionEvents.bind(null, $, competitions))

  return competitions
}

function setCompetitionName ($, competitions, idx, elem) {
  const $elem = $(elem)
  const competition = new Competition()

  competition.name = $elem.children('h2')
    .text()
    .trim()

  competitions.push(competition)

  return competition
}

function setCompetitionEvents ($, competitions, idx, elem) {
  const $elem = $(elem)
  const events = []

  $elem.children('.dates')
    .each(getEventsForBet.bind(null, $, events))

  competitions[idx].events = events

  return competitions[idx]
}

function getEventsForBet ($, events, idx, elem) {
  const $elem = $(elem)
  const betName = getBetName($elem)

  $elem.find('.events table tr')
    .each(createOrUpdateEvent.bind(null, $, events, betName))
}

function createOrUpdateEvent ($, events, betName, idx, elem) {
  const $elem = $(elem)
  const code = Number.parseInt($elem.children('.marketIndex')
    .text()
    .trim(), 10)
  let event

  if (!(event = getEvent(code, events))) {
    events.push(event = createEvent(code, $elem))
  }

  event.bets.push(
    getBets(betName, $elem.children('.outcome')))

  return event
}

function getEvent (code, events) {
  return events.find(event => event.code === code)
}

function createEvent (code, $elem) {
  const event = new Event(code)
  const eventDayAndMonthArray = $elem.children('.date')
    .text()
    .split(' / ')
  const eventHoursAndMinutesArray = $elem.children('.time')
    .text()
    .split('h')
  const keysValues = $elem.children('.outcome')

  event.date = new Date()
  event.date.setMonth(
    Number.parseInt(eventDayAndMonthArray[1], 10) - 1,
    Number.parseInt(eventDayAndMonthArray[0], 10)
  )
  event.date.setHours(
    Number.parseInt(eventHoursAndMinutesArray[0], 10),
    Number.parseInt(eventHoursAndMinutesArray[1], 10),
    0,
    0)

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

module.exports = getEventsGroupedByCompetition
