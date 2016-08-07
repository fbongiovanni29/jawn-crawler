var queries = require('./input.json')
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true })

nightmare
  .goto(queries[11].url) // go to JSON specified url
    .wait(queries[11].query) // wait until CSS selector loads
    .evaluate(function (selector) {
      positionsArr = []
      obj = {}
      obj.company = selector.company
      query = document.querySelectorAll(selector.query)
      link = document.querySelectorAll(selector.link)
	/* Set query and link equal to all elements with selector
	itearte through appending text (innerText) from each element
	with job url to obj*/
      var i;
      for (i = 0; i < query.length; i++) {
	nestedObj = {}
	nestedObj.title = query[i].innerText.trim()
	  // if each position has individual page
	  if (selector.link !== null) {
	    nestedObj.url = link[i].href
	  } else {
	      nestedObj.url = selector.url
	  }
	positionsArr.push(nestedObj)
      }
      obj.positions = positionsArr
      return obj
    }, queries[11])
  .end()
  .then(function (obj) {
    console.log(obj)
    console.log('done')
  })
  .catch(function (error) {
    console.error('error', error);
  });
