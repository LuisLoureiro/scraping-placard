const _1X2TR = require('./1X2TR')
const _1X2INT = require('./1X2INT')
const _1X2DV = require('./1X2DV')
const BothScore = require('./bothScore')
const DoublePossibility = require('./doublePossibility')
const ExactResult = require('./exactResult')
const INT_TR = require('./INT_TR')
const MoreLess = require('./moreLess')
const ScoringFirst = require('./scoringFirst')

const scrapers = {
  '1X2 TR': _1X2TR,
  '1X2 INT': _1X2INT,
  '1X2 DV': _1X2DV,
  'Mais/Menos': MoreLess,
  'Resultado exato': ExactResult,
  'Ambas marcam': BothScore,
  'INT/TR': INT_TR,
  'Dupla possibilidade': DoublePossibility,
  '1ª a marcar': ScoringFirst
}

module.exports = {
  getBetLine: (betTypeName, betLineElem) => {
    if (!Object.prototype.hasOwnProperty.call(scrapers, betTypeName)) {
      return {}
    }

    return new scrapers[betTypeName](betLineElem).getBetLine()
  }
}
