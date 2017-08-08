const program = require('yargs')

const start = require('./start')

const argv = program
  .command(['start', '*'],
    'Executes the service that fetches Placard website and saves data on the provided storage.')
  .option('a', {
    alias: 'storage-address',
    demandOption: true,
    describe: 'The protocol, host, port and path of the storage.',
    type: 'string'
  })
  .demandOption(['a'])
  .help()
  .argv

start(argv)
