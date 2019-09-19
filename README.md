# headline-news-naver

***To test web crawling in nodejs using cheerio library***





## About

#### This NPM module extracts the top five news metadata from NAVER headlines.

>  네이버 헤드라인 뉴스 상위 5개 기사 메타데이터를 크롤링해주는 NPM 모듈입니다.



## Installation

```
$ npm i headline-news-naver
```



## Testing Demo

- examples 디렉토리에서 모듈을 설치 및 실행 

```
$ git clone https://github.com/dfjung4254/headline-news-naver.git
$ cd headline-news-naver
$ cd examples
$ npm i headline-news-naver
$ node test.js
```





## Usage

```js
var headline = require('headline-news-naver');

async function test() {

    var newsObject = await headline.getNaverNews();
    var arr = newsObject['news_array'];

    arr.forEach(thisNews => {

        console.log(thisNews['title']);
        console.log(thisNews['summary']);
        console.log(thisNews['contents']);
        console.log(thisNews['imageUrl']);

    });
    
}

test();

```






## Notice

>  본 단위 프로젝트는 E-ink-display 프로젝트를
> 위한 모듈화 용도입니다.

>  공모전작품 및 스터디를 위하여 크롤링 하였으며
> ***상업적 목적은 일체 없음을 밝힙니다.***

- NAME  : 정근화(Jung keun-hwa)
- EMAIL : rmsghk4254@naver.com



