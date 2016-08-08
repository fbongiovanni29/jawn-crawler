var chalk = require('chalk')
var async = require ('async')
var data = require('./crawl.json')
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true })

function crawl(data, cb) {
  // Visual output
  console.log(chalk.blue("Starting: " + data.company))
  console.log("jobLocation" in data)
  var nightmare = new Nightmare()
  nightmare
    .goto(data.url) // go to JSON specified url
    .wait(data.query) // wait until CSS selector loads
    .evaluate(function (data) {
      positionsArr = []
      obj = {}
      obj.company = data.company
      query = document.querySelectorAll(data.query) // Job title query
      links = document.querySelectorAll(data.link)  // Link query
      locations = document.querySelectorAll(data.locations) // Location query
	/* Set query and link equal to all elements with selector
	itearte through appending text (innerText) from each element
	with job url to obj*/
      var i;
      for (i = 0; i < query.length; i++) {
      	positionsObj = {}
	title = query[i].innerText.trim()
	  if ("parseLocation" in data === false || title.indexOf(data.parseLocation) !== -1){
	   positionsObj.title = title
	  if ("jobLocation" in data === true) {
	    positionsObj.jobLocation = data.jobLocation
	  } else {
	    positionsObj.location = locations[i].innerText.trim()
	  }
	  // if each position has individual page
	  if (data.link !== null) {
	    positionsObj.url = links[i].href
	  } else {
	    positionsObj.url = data.url
	  }
	  positionsArr.push(positionsObj)
	}
      }
      obj.positions = positionsArr
      return obj
    }, data)
  .end()
  .then(function (obj) {
    console.log(obj)
    console.log(chalk.green('Finished: ' + data.company))
    cb()
  })
  .catch(function (error) {
    console.error('error', error)
    cb(error)
  });
}


async.eachSeries(data, crawl, function (err){
    console.log('done!')
})
