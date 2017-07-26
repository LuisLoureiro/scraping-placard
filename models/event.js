class Event {
  constructor (code, home, away, date, bets) {
    this.code = code
    this.home = home
    this.away = away
    this.date = date
    this.bets = bets || []
  }

  getName () {
    return `${this.date} ${this.code} - ${this.home} X ${this.away}`
  }
}

module.exports = Event
