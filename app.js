const cheerio = require("cheerio");
const iconv = require('iconv-lite');
const request_promise = require('request-promise');

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

module.exports = async function getNews() {

    const uri_naver = "https://news.naver.com";
    var newsList = [];
    var $;
    var $newsList;

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

    await request_promise(requestOptions)
        .then(function (body) {

            /*

                request 모듈을 통해 해당 uri의 html 소스를 body 로 가져온다.

            */

            /* Buffer 로 body 정제 */
            var htmlDocs = Buffer.from(body);

            /* 디코딩 - euckr to utf8 */
            var decodedDocs = iconv.decode(htmlDocs, 'euc-kr');

            /* cheerio 모듈을 활용하여 해당 웹페이지를 $로 로드 */
            $ = cheerio.load(decodedDocs, {
                /* decodeEntities를 사용하지 않아야 텍스트가 제대로 넘어온다. */
                decodeEntities: false
            });

            /* 헤드라인뉴스 부분 접근 */
            $newsList = $('ul[class=hdline_article_list]').children();

        });

    var reqOpts = [];

    $newsList.each(function (idx, element) {

        var tp = $(this).children('div[class=hdline_article_tit]');
        var newsObj;

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

        reqOpts.push(reqOpt);

    });

    /* 각 헤드라인 뉴스기사의 Uri를 병렬적으로 크롤링 한다 */
    var idx = 0;
    const requestLoopAsync = reqOpts.map(async function (thisReqOpt) {
        await request_promise(thisReqOpt).then(function (sub_body) {
            var sub_htmlDocs = Buffer.from(sub_body);
            var sub_decodedDocs = iconv.decode(sub_htmlDocs, 'euc-kr');
            const $sub = cheerio.load(sub_decodedDocs, {
                decodeEntities: false
            });

            var _title = $sub("meta[property='og:title']").attr('content').trim();
            var _summary = $sub("meta[property='og:description']").attr('content').trim();
            var _contents = $sub('div[class=_article_body_contents]').text().trim();
            var _imageUrl = $sub("meta[property='og:image']").attr('content').trim();

            var newsObj = {
                title: _title,
                summary: _summary,
                contents: _contents,
                imageUrl: _imageUrl
            };
            newsList.push(newsObj);
        });
    });

    /* 위의 for문의 병렬 처리가 완료될 때 까지 기다린다 */
    await Promise.all(requestLoopAsync);

    /* 리턴할 객체 설정 */
    var retObj = {
        news_array: newsList
    }

    return retObj;

}
