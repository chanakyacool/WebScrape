const express = require('express');
const cheerio = require('cheerio');
const app = express();
const rp = require('request-promise');
const request = require('request');
const _ = require('underscore');
const baseUrl = 'http://mycricket.cricket.com.au'
const generateOptions = (url) => {
 return {
   uri: url,
   transform: function (body) {
     return cheerio.load(body);
   }
 }
}

app.get('/club-players', function(req, res) {
  var options = generateOptions(`${baseUrl}/common/pages/public/rv/cricket/ViewPlayer.aspx?entityid=3406`)
  var playerDetails = [];
  rp(options)
  .then(($) => {

  }).catch(function (err) {
      console.log(`errro faced: ${err}`);
  });
})

app.get('/club-details', function(req, res) {
  var options = generateOptions(`${baseUrl}/common/pages/public/entitydetails.aspx?save=0&entityID=1451`);
  var clubDetails = [];
  rp(options)
  .then(($) => {
     var results =  $('#club_details #ed1_DataGridMain table tr td.tblRuleLight');
     var officeBearerDetails = $('#ed1_pnlOB');
     function getDetails() {
       var result = [];
       var tableData = officeBearerDetails.find('table tbody tr')
       console.log('herer');
       for ( i=1; i < tableData.length; i ++) {
         var userEmail = $('#ed1_pnlOB').find('table tbody tr').eq(i).find('td').eq(2).text().trim().match(/^(?:[\w\.]+\@[\w]+(?:\.[\w]{3}\.[\w]{2}|\.[\w]{3}|\.[\w]{2}\.[\w]{2}))/)
         result.push({
           position: $('#ed1_pnlOB').find('table tbody tr').eq(i).find('td').eq(0).text().trim(),
           heldBy: $('#ed1_pnlOB').find('table tbody tr').eq(i).find('td').eq(1).text().trim(),
           contact: {
             email: userEmail == null ? "" : userEmail[0],
             phone: $('#ed1_pnlOB').find('table tbody tr').eq(i).find('td').eq(2).text().trim().split(/^(?:[\w\.]+\@[\w]+(?:\.[\w]{3}\.[\w]{2}|\.[\w]{3}|\.[\w]{2}\.[\w]{2}))/)[1]
           }
         })

       }
       return result;
     }

     function fetchAffliations() {
       var affArray = [];
       for ( i = 0; i < results.eq(5).find('td').length ; i ++) {
         affArray.push({
           clubName: results.eq(5).find('td').eq(i).text().trim(),
           clubUrl: results.eq(5).find('td').eq(i).find('a').attr('href')
         })
       }
       return affArray;
     }
     var clubHash = {
       clubName: results.eq(0).text().trim().replace(/\n|\r|\t/g, ""),
       website: results.eq(1).find('a').attr('href'),
       facebookUrl: results.eq(2).find('a').eq(0).attr('href'),
       twitterUrl: results.eq(2).find('a').eq(1).attr('href'),
       colours: results.eq(4).text().trim(),
       logo: `${baseUrl}${results.eq(3).find('img').attr('src')}`,
       affiliations: fetchAffliations(),
       contactDetails:{
         contactName: results.eq(6).find('div').eq(0).text().split('\n')[1].trim(),
         contactAddress: results.eq(6).find('div').eq(0).text().split('\n')[2].trim(),
         contactEmail: results.eq(6).find('div').eq(0).text().split('\n')[3].trim(),
         contactNumber: results.eq(6).find('div').eq(0).text().split('\n')[4].trim(),
       },
       principalUser: {
         name: results.eq(6).find('div').eq(1).text().split('\n')[2].trim(),
         email: results.eq(6).find('div').eq(0).text().split('\n')[3].trim(),
       },
       mainGround: results.eq(7).text().split('\n')[1].trim(),
       clubRooms: results.eq(7).text().split('\n')[2].trim(),
       headOfficeDetails: results.eq(7).text().split('\n')[3].trim(),
       description: results.eq(8).text().trim(),
       officeBearers: {
         year: officeBearerDetails.find('h2').eq(0).text().split(':')[1].trim(),
         officeBearerDetails: getDetails()
       }
     }

    clubDetails.push(clubHash);
    res.send(clubDetails);
  }).catch(function (err) {
      console.log(`errro faced: ${err}`);
  });
})


app.get('/scrape', function(req, res){
  var options = generateOptions(`${baseUrl}/pages/quickentitysearch.aspx?searchText=Balmain%20South%20Sydney%20Cricket%20Club`)
  rp(options)
  .then(($) => {
    var results = $('#club-results-container').find('table.search-table tbody tr.RVDataGridItem');
    var array = [];
    var entityID;
    var options = generateOptions(`${baseUrl}/common/pages/public/entitydetails.aspx?save=0&entityID=${entityID[0]}`);
    console.log("options", options);
    rp(options)
    .then(($) => {
      // var results =  $('#club_details #ed1_DataGridMain table tr td.tblRuleLight');
      array.push({test: 'test'})
    }).catch(function (err) {
        console.log(`errro faced: ${err}`);
    });
    res.send(array);
  // ============================

    // ==============================
    // results.each(function(i, elem) {
    //   var currentRow = $(this);
    //   var entityID = currentRow.find("td").eq(3).find('a[id=dgClubResults_ctl03_lnkView]').attr('href').match(/[0-9]\w+/)
    //   // Full Array
    //   arr.push({
    //     clubName: currentRow.find("td").eq(0).text(),
    //     facebookUrl: currentRow.find("td").eq(1).find('a[title=Facebook]').attr('href'),
    //     twitterURl: currentRow.find("td").eq(1).find('a[title=Twitter]').attr('href'),
    //     state: currentRow.find("td").eq(2).text(),
    //     entityID: entityID
    //   })
    // })

    // arr.forEach(function(obj) {
    //   var options = generateOptions(`${baseUrl}/common/pages/public/entitydetails.aspx?save=0&entityID=${obj.entityID[0]}`);
    //   rp(options)
    //   .then(($) => {
    //     // var results =  $('#club_details #ed1_DataGridMain table tr td.tblRuleLight');
    //     array.push({test: 'test'})
    //   }).catch(function (err) {
    //       console.log(`errro faced: ${err}`);
    //   });
    // });
    // ============================

  })
  .catch((err) => {
    console.log(err);
  });
})


var clubDetails = (entityID) => {
  var options = generateOptions(`${baseUrl}/common/pages/public/entitydetails.aspx?save=0&entityID=${entityID}`);
  var arra=[];
  console.log(options);
  rp(options)
  .then(($) => {
    // var results =  $('#club_details #ed1_DataGridMain table tr td.tblRuleLight');
    return arra.push({test: 'test'})
  })
  .catch(function (err) {
      console.log(`errro faced: ${err}`);
  });
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
