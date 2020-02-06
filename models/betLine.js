module.exports = class BetLine {
  constructor (code, date, optionsAvailable) {
    this.code = code
    this.date = date
    this.optionsAvailable = optionsAvailable || []
  }
}
