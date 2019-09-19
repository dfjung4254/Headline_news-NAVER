var headline = require('headline-news-naver');

/*

    newsObject = {

        "news_array" : [

            {
                // 뉴스1 Obj
                "title"     : "뉴스1 제목",
                "summary"   : "뉴스1 요약",
                "contents"  : "뉴스1 내용",
                "imageUrl"  : "뉴스1 섬네일 이미지 주소"
            },
            {
                // 뉴스2 Obj ...
            },
            
            ...
            
        ]

    };

*/

async function test() {

    var newsObject = await headline.getNaverNews();
    var arr = newsObject['news_array'];

    var idx = 1;
    arr.forEach(thisNews => {

        console.log("\n\n--------------------NAVER HEADLINE NEWS NO."+idx++ + "----------------------------------\n\n");
        console.log("[TITLE] \n" + thisNews['title'] + "\n\n");
        console.log("[SUMMARY] \n" + thisNews['summary'] + "\n\n");
        console.log("[CONTENTS] \n" + thisNews['contents'] + "\n\n");
        console.log("[IMAGEURL] \n" + thisNews['imageUrl'] + "\n\n");
        console.log("------------------------------------------------------------------------------");

    });

}

test();