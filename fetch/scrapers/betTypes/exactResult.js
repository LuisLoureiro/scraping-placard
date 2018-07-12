const OptionsAvailableInTable = require('./optionsAvailableInTable')

module.exports = class ExactResult extends OptionsAvailableInTable {
  getCodeElem () {
    return this.$('.marketIndex_correct_score')
  }

  getDateElem () {
    return this.$('.date_correct_score')
  }

  getTimeElem () {
    return this.$('.time_correct_score')
  }
}
