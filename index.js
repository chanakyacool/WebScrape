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

var arr= []

app.get('/scrape', function(req, res){
  rp(options)
  .then(($) => {
    var results = $('#club-results-container').find('table.search-table tbody tr.RVDataGridItem');
    // var i;
    // for (i = 0; i < results.length; i++) { 
      
    // }

    results.each(function(i, elem) {
      var currentRow = $(this);

      // console.log(currentRow.find("td").eq(0).text());
      arr.push({
        col1_value: currentRow.find("td").eq(0).text()
      })
    })
    res.send(arr);
  })
  .catch((err) => {
    console.log(err);
  });
})

app.listen('8081')
console.log('Running on port 8081');
exports = module.exports = app;



// http://mycricket.cricket.com.au/common/pages/public/entitydetails.aspx?entityID=2413
// http://mycricket.cricket.com.au/home.aspx?entityID=2413

// result.each(function(i, td){
//   currentRow = $(this);
//   console.log(currentRow.find("td:eq(0)").text());
//  })