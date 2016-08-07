var chalk = require('chalk')
var async = require ('async')
var data = require('./companies/blackfynn.json')
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false })

function crawl(data, cb) {
    console.log(chalk.blue("Starting: " + data.company)) // When async.each will iterate all items then error
    console.log(data.location)
    console.log(data.query)
  var nightmare = new Nightmare()
  nightmare
    .goto(data.url) // go to JSON specified url
    .wait() // wait until CSS selector loads
    .evaluate(function (data) {
      positionsArr = []
      obj = {}
      obj.company = data.company
      query = document.querySelectorAll(data.query)
      links = document.querySelectorAll(data.links)
      locations = document.querySelectorAll(data.locations)
	/* Set query and link equal to all elements with selector
	itearte through appending text (innerText) from each element
	with job url to obj*/
      var i;
      for (i = 0; i < query.length; i++) {
      	positionsObj = {}
      	positionsObj.title = query[i].innerText.trim()
      	positionsObj.location = locations[i].innerText.trim()
      	  // if each position has individual page
      	  if (data.link !== null) {
      	    positionsObj.url = links[i].href
      	  } else {
      	    positionsObj.url = data.url
      	  }
      	positionsArr.push(positionsObj)
      }
      obj.positions = positionsArr
      return obj
    }, data)
  .end()
  .then(function (obj) {
    console.log(obj)
    console.log(chalk.green('Finished: ' + data.url))
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
