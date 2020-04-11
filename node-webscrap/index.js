const request = require("request-promise")
const cheerio = require("cheerio")
const fs = require("fs")
const json2csv = require("json2csv").Parser;

const movies = [
  "https://www.rottentomatoes.com/m/the_last_full_measure",
  "https://www.rottentomatoes.com/m/stray_dolls"
];

const dataRepresent = async() => {
  let rottenTomatoData = []

  for (let movie of movies) {
    const response = await request({
      uri: movie,
      headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9,es;q=0.8"
      },
      gzip: true,
    })

    let $ = cheerio.load(response);
    let title = $("h1[class='mop-ratings-wrap__title mop-ratings-wrap__title--top']").text().trim()
    let tomatoMeterObj = $('#tomato_meter_link > .mop-ratings-wrap__percentage');
    let tomatoMeter = tomatoMeterObj && tomatoMeterObj.text().trim();
    let audMeterObj = $('.audience-score > .mop-ratings-wrap__score >  .articleLink  > .mop-ratings-wrap__percentage');
    let audMeter = audMeterObj && audMeterObj.text().trim();
    let summary = $('.mop-ratings-wrap__text').text().trim()

    rottenTomatoData.push({
      title,
      tomatoMeter,
      audMeter,
      summary,
    });
  }
  const j2cp = new json2csv()
  const csv = j2cp.parse(rottenTomatoData);

  fs.writeFileSync('./rottenTomatoes.csv', csv, "utf-8")
}

dataRepresent();