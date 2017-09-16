#!/bin/bash
# simples bash script for begin the service
# check mongodb service
# install npm packages
# starting the main file in node

# simples function that will start more down with the text "mongodb"
function checkIt()
{
 ps auxw | grep $1 | grep -v grep > /dev/null

 if [ $? != 0 ]
then
   echo $1" no service, try systemctl start mongodb and then mongod";
   exit 1
 else
   echo $1" is ready!";
 fi;
}

echo
echo
echo "(ง'̀-'́)ง STARTING BASH SCRIPT FOR scraping-placard"
echo
echo checking for mongodb service
echo
checkIt "mongodb";
echo
echo going to ../ start searching for package.json
echo
echo "change directry and install npm: cd .. && npm install"
echo
echo running: npm install
cd .. && npm install # && equal to AND
echo
echo hey npm just finish
echo
echo
echo starting to scrapy some data!
echo running: node index.js -a mongodb://127.0.0.1:27017/$(date)
echo
node index.js -a mongodb://127.0.0.1:27017/$(date) #other way $(cmd)
echo
echo the database name is: `date +"%d-%m-%y"` #other way `command`
echo "(っ◔◡◔)っ ♥ go for it!!!"
