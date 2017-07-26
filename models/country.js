class Country {
  constructor (name, url, competitions) {
    this.name = name
    this.url = url
    this.competitions = competitions || []
  }
}

module.exports = Country
