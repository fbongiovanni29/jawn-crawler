var fs = require('fs')
var logStream = fs.createWriteStream('errorlog.txt', {'flags': 'a'})
var dateTime = require('node-datetime')
var dt = dateTime.create().format('m/d/Y H:M:S')
var jsonfile = require('jsonfile')
var data = require('./crawl.json')
var chalk = require('chalk')
var async = require ('async')
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false }) // true displays popup electron window showing results must remove line #17

function crawl(data, cb) {
  // Visual output
  console.log(chalk.blue("Starting: " + data.company))
  var nightmare = new Nightmare()
  nightmare
    .goto(data.url) // go to JSON specified url
    .wait(data.query) // wait until CSS selector loads
    .evaluate(function (data) {
      arr = []
      // returns text in queried CSS selector
      query = document.querySelectorAll(data.query) // Job title query
      links = document.querySelectorAll(data.link)  // Link query
      locations = document.querySelectorAll(data.locations) // Location query
	/* Set query and link equal to all elements with selector
	itearte through appending text (innerText) from each element
	with job url to obj*/
      var i;
      for (i = 0; i < query.length; i++) {
	  var obj = new Object()
	  // if location is static or locations attribute contains correct location (e.g string locations contains "Philadelphia" not "San Francisco")
	if ("locations" in data === false || locations[i].innerText.trim() !== undefined && locations[i].innerText.trim().includes(data.parseLocation)){
	    obj.title =  query[i].innerText.trim()
	  // If jobLocation is static (created in input JSON) else add location based on HTML element that contains location
	  if ("jobLocation" in data === true) {
	    obj.jobLocation = data.jobLocation
	  } else {
	    obj.location = locations[i].innerText.trim()
	  }
	  // if url is picked up by HTML element or is declared in JSON
	  if (data.link !== null) {
	    obj.url = links[i].href
	  } else {
	    obj.url = data.url
	  }
	  arr.push(obj)
	}
      }
      return arr
    }, data)
  .end()
  .then(function (arr) {
    // Replace spaces with hyphen and write to json file
    var file = data.company.replace(/\s/g, "-")
    file = './data/output/' + file + '.json'
    jsonfile.writeFile(file, arr, {spaces: 2}, function(err) {
      if (err) {
	console.error(err)
      }
    })
    console.log(chalk.green('Finished: ' + data.company))
    cb()
  })
  .catch(function (error) {
    // Write error to log and print to console
    logStream.write('-----------------------------------------------' + '\n' + data.company + '\n' + error + '\n' + dt + '\n')
    console.log(chalk.red('Error: ' + data.company + '\n' + error))
    cb()
  })
}


async.eachSeries(data, crawl, function (err){
    console.log(chalk.magenta('done!'))
})
