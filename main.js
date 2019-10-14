const cheerio = require("cheerio");
const request = require("request");
const fs = require('fs');

const scrape = url => {
  return new Promise((resolve, reject) => {
    request.get(url, (err, res) => {
      if (!err && res.statusCode == 200) {
        const $ = cheerio.load(res.body);
        const movies = $("tbody.lister-list").children("tr");
        const movieList = [];

        for (let i = 0; i < movies.length; i++) {
          const poster = $(movies[i])
            .children("td.posterColumn")
            .children("a")
            .children("img")
            .attr("src")
            .replace("_UX45_", "_UX182_")
            .replace("45,67", "182,268");
          const name = $(movies[i])
            .children("td.titleColumn")
            .children("a")
            .text();

          const rating = $(movies[i])
            .children("td.ratingColumn")
            .children("strong")
            .text();

          movieList.push({
            poster,
            name,
            rating
          });
        }

        resolve(movieList);
      } else {
        reject(err);
      }
    });
  });
};

(async() => {
    console.log('Getting the list of top movies...');
    const moviesList = await scrape("http://www.imdb.com/chart/top");
    console.log('Getting the list of top tv...');
    const tvList = await scrape("https://www.imdb.com/chart/toptv");

    const list = [
        ...moviesList,
        ...tvList
    ];
    
    console.log('Writing results to file...');
    fs.writeFileSync('imdb-results.json', JSON.stringify(list));
    console.log('Done');
})();

