const cheerio = require('cheerio');
const request = require('request');

request.get("http://www.imdb.com/chart/top", (err, res) => {
    if(!err && res.statusCode == 200) {
        const $ = cheerio.load(res.body);
        console.log($("table").html());
    }
    else {
        console.log(err);
    }
});

