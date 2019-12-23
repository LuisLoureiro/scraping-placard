# scraping-placard
NodeJS service that fetches the Placard website, extracts events and bets from the HTML responses and stores the data in a database.

### Development
    npm start

This script only works with MongoDB, so one must ensure a running instance before executing the above command.

One must have the `MONGODB_URI` environment variable exported in order for `npm start` work as expected.
The value for this environment variable should follow the following connection string format:

* `mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[database][?options]]`

