const _1X2TR = require('./1X2TR')
const _1X2INT = require('./1X2INT')
const _1X2DV = require('./1X2DV')
const DoublePossibility = require('./doublePossibility')
const ScoringFirst = require('./scoringFirst')

const scrapers = {
  '1X2 TR': _1X2TR,
  '1X2 INT': _1X2INT,
  '1X2 DV': _1X2DV,
  // 'Mais/Menos': () => {},
  // 'Resultado exato': () => {},
  // 'Ambas marcam': () => {},
  // 'INT/TR': () => {},
  'Dupla possibilidade': DoublePossibility,
  '1ª a marcar': ScoringFirst
}

module.exports = {
  getBetLine: (betTypeName, betLineElem) => {
    if (!scrapers.hasOwnProperty(betTypeName)) {
      return {}
    }

    return new scrapers[betTypeName](betLineElem).getBetLine()
  }
}
