const express = require('express');
const cheerio = require('cheerio');
const app = express();
const rp = require('request-promise');

const options = {
  uri: `http://mycricket.cricket.com.au/pages/quickentitysearch.aspx?searchText=South%20Perth%20Junior%20Cricket%20Club`,
  transform: function (body) {
    return cheerio.load(body);
  }
};

app.get('/scrape', function(req, res){
  rp(options)
  .then(($) => {
    var result = $('#club-results-container').find('table.search-table');
    console.log(result);
    // result[0].children[0].each(function(i, elem) {
    //   console.log(elem);
    // });
  })
  .catch((err) => {
    console.log(err);
  });
})

app.listen('8081')
console.log('Running on port 8081');
exports = module.exports = app;