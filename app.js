const request = require("request");
const cheerio = require("cheerio");
const iconv = require('iconv-lite');

var requestOptions = {
    method: "GET",
    uri: "https://news.naver.com/",
    headers: {
        "User-Agent": "Mozilla/5.0"
    },
    encoding: null
}

request(requestOptions, function (err, res, body) {

    var htmlDocs = Buffer.from(body);
    var decodedDocs = iconv.decode(htmlDocs, 'euc-kr');

    const $ = cheerio.load(decodedDocs, {
        decodeEntities: false
    });

    const $newsList = $('ul[class=hdline_article_list]').children().eq(0).children('div[class=hdline_article_tit]').text();

    log($newsList.trim());

});
