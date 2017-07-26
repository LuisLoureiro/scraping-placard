const program = require('yargs')

const start = require('./start')

const argv = program
  .command(['start', '*'],
    'Initializes the service that fetches Placard website and saves data on the provided storage.')
  .option('a', {
    alias: 'storage-address',
    demandOption: true,
    describe: 'The host and port of the storage.',
    type: 'string'
  })
  .option('d', {
    alias: 'fetch-delay',
    default: 5 * 60 * 1000,
    describe: 'The number of milliseconds to wait before fetching the Placard website',
    type: 'number'
  })
  .option('p', {
    alias: 'storage-path',
    demandOption: true,
    describe: 'The path to the storage',
    type: 'string'
  })
  .demandOption(['a', 'p'])
  .help()
  .argv

start(argv)
