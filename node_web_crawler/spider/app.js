const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const db = require('./model/mysql');

var domain = 'http://www.open-open.com';
var tag ='mysql';
var tag1 ='MySQL';
fetchUrl(35,37);

function fetchUrl(curPage,endPage) {
	var url = 'http://www.open-open.com/lib/tag/'+tag1+'?pn=' + curPage;
	request(url, function(error, response, body){
		if(!error && response.statusCode == 200) {
			console.log('=================正在爬 '+ curPage+' 页==================');
			var $ = cheerio.load(response.body.toString());
			
            //循环遍历li节点
            $('.list li').each(function () {
                var href = $(this).find('h3').find('a').attr('href');
                fetchArticle(domain+href);
            });

            setTimeout(function(){
            	//爬取下一页数据
	            if(curPage == endPage){
	            	return console.log('==============END==============');
	            }
                curPage++;
	            fetchUrl(curPage, endPage);
            },5000);

		} else {
			console.log('主循环END')
		}
	})
}

function fetchArticle(url) {
	request(url, function (error, response){
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(response.body.toString(), { decodeEntities: false });
			var title = $('h1').text();
            
            $('#readercontainer article').find('img').each(function(){
            	//下载，改名
            	var imgSrc = $(this).attr('src'); 
            	//获得文件扩展名
              if(imgSrc != 'undefined' || imgSrc != null ||imgSrc.length < 100){
              	var extName = path.extname(imgSrc);
              	var newName = reNeme()+extName;
              	saveImg(imgSrc,newName);
              	
              	$(this).attr('src','/upload/images/'+newName);
              }
            })
            var c = $('#readercontainer article').html();
            var cc = c.replace('<html>', '').replace('</html>', '').replace('<head></head>', '').replace('<body>', '').replace('</body>', '');
            var content = cc.trim();
            
            var model = {
                article_tag: tag,
                article_title: title,
                article_content: content
            };
            db.Save(model);
		}
	})
}


function saveImg(src,newName) {
	request(src).pipe(fs.createWriteStream('E:/xampp/htdocs/upload/images/'+newName));
}

function reNeme(){
	var dd = new Date();
    var y = dd.getYear();
    var m = dd.getMonth();
    var h= dd.getHours();
    var mi = dd.getMinutes();
    var s = dd.getSeconds();
    var r = parseInt(Math.random()*1000000000000000000000);
    return ''+y+m+h+mi+s+r;
}


