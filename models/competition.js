module.exports = class Competition {
  constructor (name, events, sport, country) {
    this.name = name
    this.events = events || []
    this.sport = sport
    this.country = country
  }
}
