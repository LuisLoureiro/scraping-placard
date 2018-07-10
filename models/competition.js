module.exports = class Competition {
  constructor (name, betTypes, sport, country) {
    this.name = name
    this.sport = sport
    this.country = country
    this.betTypes = betTypes || []
  }
}
