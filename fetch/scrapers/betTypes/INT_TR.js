const OptionsAvailableInTable = require('./optionsAvailableInTable')

module.exports = class INT_TR extends OptionsAvailableInTable {
  getOptionsElem () {
    // We want to remove the odd rows because they have no values
    // They're just used for styling
    return this.$('.wide-table tr').filter(idx => idx % 2 === 0)
  }
}
