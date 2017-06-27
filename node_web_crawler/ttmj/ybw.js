const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const db = require('./model/mysql');
//79
FetchUrl(126,450);
var domain = 'http://www.yunbow.cn';
function FetchUrl(i,len)
{
    var url = 'http://www.yunbow.cn/type/movie/1-'+i+'.html';
    request(url, function(error, response)
    {
        if(!error && response.statusCode == 200)
        {
            console.log('=================正在爬 '+ i+' 页==================');
            var $ = cheerio.load(response.body.toString());
            $('.movie-item-in').each(function(){
                var href = $(this).find('h1').find('a').attr('href');
                FetchArticle(domain+href);
            });
            setTimeout(function(){
                if(i == len){
                    return console.log('Page End');
                }
                i++;
                FetchUrl(i,len);
            },5000)
        } else {
			console.log('Main Loop End');
		}
    });
}

function FetchArticle(url)
{
    request(url, function(error, response ){
        if(!error && response.statusCode == 200) {
            var $ = cheerio.load(response.body.toString(), { decodeEntities: false });
            //  标题
            var nameArr = ($('h1').text()).split('(');
            var _name = nameArr[0];
            //海报
            var imgsrc = $('.movie-post').find('img.img-thumbnail').attr('src');
            var _poster;
            if(imgsrc === undefined){
                _poster = '';
            }else{
                var imgsplit = imgsrc.split('/');
                var posterUrl = imgsplit[imgsplit.length-1];
                _poster = '/poster/'+posterUrl;
                saveImg(imgsrc,posterUrl);
            }
            //资源
            var resource = new Array();
            $('.resource-list').find('table').find('a').each(function(){
            	var _title = $(this).text();
	            var _url = $(this).attr('href');
            	if(_title != '' && _url != 'javascript:;'){
	                try{
	                    if(_url.indexOf("http") < 0){
	                        var a = {title:_title,url:_url}
	                        resource.push(a);
	                    }
	                }catch(err){
	                    console.log(err.description);
	                }
            	}
            });
            _resource =JSON.stringify(resource);
            //标签
            var _tag = '';

            //时间
            var _cdate = Date.parse(new Date());
            var model = {
                name : _name,
                type : 1,
                tag  : _tag,
                resource: _resource,
                poster: _poster,
                cdate: _cdate
            }
            db.Save(model);
        }
    });
}

function saveImg(src,name) {
	request(src).on('error', function(err) {
        console.log('img err');
     }).pipe(fs.createWriteStream('poster/'+name)).on('error', function(err) {
        console.log('img err');
     });
}