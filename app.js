const request = require("request");
const cheerio = require("cheerio");
const iconv = require('iconv-lite');

/*

    네이버 헤드라인 뉴스 크롤링 테스트
    현재 네이버가 헤드라인에 올린 5개의 뉴스의 링크를
    다시 크롤링 하여 메타데이터와 본문내용을 가져온다.

    title, summary, contents, imageUrl

    본 단위 프로젝트는 E-ink-display 프로젝트를
    위한 모듈화 용도입니다.

    공모전작품 및 스터디를 위하여 크롤링 하였으며
    상업적 목적은 일체 없음을 밝힙니다.

    NAME  : 정근화(Jung keun-hwa)
    EMAIL : rmsghk4254@naver.com
    소속   : Hongik University

*/
async function getNews(uri_naver) {

    var requestOptions = {
        method: "GET",
        uri: uri_naver,

        /*
        
            헤더를 Mozilla 브라우저에서 요청한 것처럼 하여
            크롤링할 웹사이트의 접근을 우회한다.
    
        */
        headers: {
            "User-Agent": "Mozilla/5.0"
        },

        /* 인코딩은 null의 상태에서 받아와야 추후 iconv로 decode 가능 */
        encoding: null
    }

    request(requestOptions, function (err, res, body) {

        /*
    
            request 모듈을 통해 해당 uri의 html 소스를 body 로 가져온다.
    
        */

        /* Buffer 로 body 정제 */
        var htmlDocs = Buffer.from(body);

        /* 디코딩 - euckr to utf8 */
        var decodedDocs = iconv.decode(htmlDocs, 'euc-kr');

        /* cheerio 모듈을 활용하여 해당 웹페이지를 $로 로드 */
        const $ = cheerio.load(decodedDocs, {
            /* decodeEntities를 사용하지 않아야 텍스트가 제대로 넘어온다. */
            decodeEntities: false
        });

        /* 헤드라인뉴스 부분 접근 */
        const $newsList = $('ul[class=hdline_article_list]').children();

        /* 헤드라인 뉴스 5개 for 문 통해 개별 접근 */
        $newsList.each(async function (idx, element) {
            var tp = $(this).children('div[class=hdline_article_tit]');

            /*
            
                해당 Uri 로 다시 들어가 각 뉴스의 이미지와 제목, 요약, 내용을 가져온다.
            
            */
            var reqUri = tp.find('a').attr('href');
            var reqOpt = {
                method: "GET",
                uri: uri_naver + reqUri,
                headers: {
                    "User-Agent": "Mozilla/5.0"
                },
                encoding: null
            }

            await request(reqOpt, function (err, res, sub_body) {
                var sub_htmlDocs = Buffer.from(sub_body);
                var sub_decodedDocs = iconv.decode(sub_htmlDocs, 'euc-kr');
                const $sub = cheerio.load(sub_decodedDocs, {
                    decodeEntities : false
                });

                var _title = $sub("meta[property='og:title']").attr('content');
                var _summary = $sub("meta[property='og:description']").attr('content');
                var _contents = $sub('div[class=_article_body_contents]').text();
                var _imageUrl = $sub("meta[property='og:image']").attr('content');

                console.log("------------------------------------");
                console.log(_title);
                console.log(_summary);
                console.log(_contents);
                console.log(_imageUrl);
                console.log("------------------------------------");

            });
        });
    });
}

getNews("https://news.naver.com");