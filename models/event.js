module.exports = class Event {
  constructor (code, home, away, date, betTypes, sport, country, competition) {
    this.code = code
    this.home = home
    this.away = away
    this.date = date
    this.betTypes = betTypes || []
    this.sport = sport
    this.country = country
    this.competition = competition
  }

  getName () {
    return `${this.date} ${this.code} - ${this.home} X ${this.away}`
  }
}
