const _1X2TR = require('./1X2TR')

const scrapers = {
  '1X2 TR': _1X2TR
  // '1X2 INT': () => {},
  // '1X2 DV': () => {},
  // 'Mais/Menos': () => {},
  // 'Resultado exato': () => {},
  // 'Ambas marcam': () => {},
  // 'INT/TR': () => {},
  // 'Dupla possibilidade': () => {},
  // '1ª a marcar': () => {}
}

module.exports = {
  getBetLine: (betTypeName, betLineElem) => {
    if (!scrapers.hasOwnProperty(betTypeName)) {
      return {}
    }

    return new scrapers[betTypeName](betLineElem).getBetLine()
  }
}
