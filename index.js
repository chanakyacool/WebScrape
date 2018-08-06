const express = require('express');
const cheerio = require('cheerio');
const app = express();
const rp = require('request-promise');
const baseUrl = 'http://mycricket.cricket.com.au'

//
// const options1 = {
//   uri: `http://mycricket.cricket.com.au/pages/quickentitysearch.aspx?searchText=Balmain%20South%20Sydney%20Cricket%20Club`,
//   transform: function (body) {
//     return cheerio.load(body);
//   }
// };
//
// const options2 = {
//   uri: `http://mycricket.cricket.com.au/pages/quickentitysearch.aspx?searchText=Balmain%20South%20Sydney%20Cricket%20Club`,
//   transform: function (body) {
//     return cheerio.load(body);
//   }
// };

const generateOptions = (url) => {
 return {
   uri: url,
   transform: function (body) {
     return cheerio.load(body);
   }
 }
}


app.get('/scrape', function(req, res){
  var options = generateOptions(`${baseUrl}/pages/quickentitysearch.aspx?searchText=Balmain%20South%20Sydney%20Cricket%20Club`)
  rp(options)
  .then(($) => {
    var results = $('#club-results-container').find('table.search-table tbody tr.RVDataGridItem');
    var arr = []

    results.each(function(i, elem) {
      var currentRow = $(this);
      var entityID = currentRow.find("td").eq(3).find('a[id=dgClubResults_ctl03_lnkView]').attr('href').match(/[0-9]\w+/)
      arr.push({
        clubName: currentRow.find("td").eq(0).text(),
        facebookUrl: currentRow.find("td").eq(1).find('a[title=Facebook]').attr('href'),
        twitterURl: currentRow.find("td").eq(1).find('a[title=Twitter]').attr('href'),
        state: currentRow.find("td").eq(2).text(),
        clubDetails: clubDetails(entityID)
      })
    })
    res.send(arr);
  })
  .catch((err) => {
    console.log(err);
  });
})


var clubDetails = (entityID) => {
  var options = generateOptions(`${baseUrl}/common/pages/public/entitydetails.aspx?save=0&entityID=${entityID}`);
  rp(options)
  .then(($) => {
    var arra = []
    // var results =  $('#club_details #ed1_DataGridMain table tr td.tblRuleLight');
    arra.push({test: 'test'})
  })
}

app.listen('8081')
console.log('Running on port 8081');
exports = module.exports = app;



// http://mycricket.cricket.com.au/common/pages/public/entitydetails.aspx?entityID=2413
// http://mycricket.cricket.com.au/common/pages/public/entitydetails.aspx?save=0&entityID=3406
// http://mycricket.cricket.com.au/home.aspx?entityID=2413

// result.each(function(i, td){
//   currentRow = $(this);
//   console.log(currentRow.find("td:eq(0)").text());
//  })
