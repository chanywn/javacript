const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const db = require('./model/mysql');
//79
FetchUrl(0,155);

function FetchUrl(i,len)
{
    var url = 'http://cn163.net/ddc1/page/'+i+'/';
    request(url, function(error, response)
    {
        if(!error && response.statusCode == 200)
        {
            console.log('=================正在爬 '+ i+' 页==================');
            var $ = cheerio.load(response.body.toString());
            $('div.archive_title').each(function(){
                var href = $(this).find('h2').find('a').attr('href');
                FetchArticle(href);
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
            var nameArr = ($('h2.entry_title').text()).split('/');
            var _name = nameArr[0];
            //海报
            var imgsrc = $('#entry').find('img').attr('src');
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
            $('#entry').find('a').each(function(){
                var _title = $(this).text();
                var _url = $(this).attr('href');
                try{
                    if(_url.indexOf("http") < 0){
                        var a = {title:_title,url:_url}
                        resource.push(a);
                    }
                }catch(err){
                    console.log(err.description);
                }
            });
            _resource =JSON.stringify(resource);
            //标签
            var _tag = $('span.category').find('a').text();
            //时间
            var _cdate = Date.parse(new Date());
            var model = {
                name : _name,
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