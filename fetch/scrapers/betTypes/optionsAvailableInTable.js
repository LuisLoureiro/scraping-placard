const OptionsAvailableInColumns = require('./optionsAvailableInColumns')

module.exports = class OptionsAvailableInTable extends OptionsAvailableInColumns {
  getOptionsElem () {
    return this.$('.wide-table .new_wide_table')
  }

  buildOptions (options) {
    return options.map(option => {
      return OptionsAvailableInColumns.transformElemsIntoNameValueObjects(option.children
        .filter(isElemOfTypeTag)
        .filter(doesElemContainClass('outcome'))
        .map(child => child.children
          .filter(isElemOfTypeTag)
          .filter(doesElemContainClass('outcome-wrapper'))[0]
        ))
    })
  }
}

function isElemOfTypeTag (elem) {
  return elem.type === 'tag'
}

function doesElemContainClass (klass) {
  return elem => (elem.attribs.class || '').split(' ').filter(elemKlass => elemKlass === klass).length > 0
}
