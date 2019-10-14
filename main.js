const cheerio = require("cheerio");
const request = require("request");

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

scrape("http://www.imdb.com/chart/top").then(topMovieList => {
  console.log(topMovieList);
});
