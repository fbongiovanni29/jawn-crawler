var queries = require('./input.json')
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true })

var query = queries[0].query
nightmare
  .goto(queries[0].url)
    .evaluate(function (selector) {
      var i;
      data = document.querySelectorAll(selector[0].query)
      arr = []
      obj = {}
      obj.company = selector[0].company
      nestedArr = []
      for (i = 0; i < data.length; i++) {
	  nestedObj = {}
	  nestedObj.title = data[i].innerText.trim()
	  nestedObj.url = data[i].href
	  nestedArr.push(nestedObj)
      }
      obj.positions = nestedArr
      arr.push(obj)
      return arr
    }, queries)
  .end()
  .then(function (arr) {
    console.log(arr[0])
    console.log('done')
  })
  .catch(function (error) {
    console.error('error', error);
  });
