const OptionsAvailableInTable = require('./optionsAvailableInTable')

module.exports = class ExactResult extends OptionsAvailableInTable {
  getCodeElem () {
    return this.$('.marketIndex_correct_score, .marketIndex')
  }

  getDateElem () {
    return this.$('.date_correct_score, .date')
  }

  getTimeElem () {
    return this.$('.time_correct_score, .time')
  }
}
