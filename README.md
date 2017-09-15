# scraping-placard :soccer: :basketball: :rugby_football: :tennis:
NodeJS service that fetches the Placard website, extracts events and bets from the HTML responses and stores the data in a database.

~~~EU APENAS ESCREVO EM PORTUGUES!!! KOSSAK31~~

## TOOLS
* website <https://www.jogossantacasa.pt/web/Placard>
* nodejs
* mongodb
---


# Project tree
* [fetch](./fetch)
  * [scrapers](./fetch/scrapers)
    * [getEventsGroupedByCompetition.js](./fetch/scrapers/getEventsGroupedByCompetition.js)
    * [getSportsAndCountries.js](./getSportsAndCountries.js)
  * [transformers](./fetch/transformers)
    * [arrayBufferToString.js](./fetch/transformers/arrayBufferToString.js)
   	* [iso88591ToUTF8.js](./fetch/transformers/iso88591ToUTF8.js)
  * [index.js](./fetch/index.js)
* [models](./models)
    * [bet.js](./models/bet.js)
    * [competition.js](./models/competition)
    * [country.js](./models/country.js)
    * [event.js](./models/event.js)
    * [nameValue.js](./models/nameValue.js)
    * [sport.js](./models/sport.js)
* [storage](./storage)
    * [index.js](./index.js)
* [.gitignore](./.gitignore)
* [README.md](./README.md)
* [index.js](./index.js)
* [package.json](./package.json)
* [start.js](./start.js)

---

# :bomb: Ignition the code :bomb:
```bash
$ npm install
$ node index.js -a mongodb://127.0.0.1:27017/<name>
```

## mongodb cheat sheet
```bash
$ mongod
$ mongo
$ show dbs
$ use <name>
```

---

## npm packages :package:
NPM Package Name  | website npm https://www.npmjs.com/package
------------- | -------------
axios  | <https://www.npmjs.com/package/axios>
iconv | <https://www.npmjs.com/package/iconv>
cheerio | <https://www.npmjs.com/package/cheerio>
moment | <https://www.npmjs.com/package/moment>
moment-timezone | <https://www.npmjs.com/package/moment-timezone>
mongodb | <https://www.npmjs.com/package/mongodb>
yargs | <https://www.npmjs.com/package/yargs>
