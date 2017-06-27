$(document).ready(function(){

	$('#reg').click(function() {
		var reg = localStorage.getItem('reg');

		var name = $('input[name=name]').val();
		var sipurl = $('input[name=sipurl]').val();
		var sippassword = $('input[name=sippassword]').val();
		$('#user').text(name);
		user.name = name;
		user.url = sipurl;
		configuration.uri = sipurl;
		configuration.password = sippassword;
		configuration.register = true;
		init(configuration);
		$('.loginp').css('display','none');
		$('#status >p').text('......')
	});

	$('.nav a').click(function(){
		var oldMod = $('.active').attr('model');
		var mod = $(this).attr('model');

		$('.active').removeClass('active');
		$(this).addClass('active');
		var item = $('.mod-item');
		removeClass(item[oldMod],'mod-active');
		addClass(item[mod],'mod-active');
		
	});

	$('#ul li').dblclick(function(){
		var sipUrl  = $(this).attr('sip-url');
		$('.message').css('display','block');
		$('#chat-tar').text(sipUrl)
	});

	$('.call-ico').click(function(){
		var sipurl = $(this).attr('sip-url');
		var name = $(this).attr('sip-name');
		$('#callpanal').css('display','block');
		
		session = ua.call(sipurl, options);
		$('.callname').text('正在呼叫'+name);
	});

	$('#btn-chat').click(function(){
		var sipUrl = $('#chat-tar').text();
		var text = $('#text-chat').val();
		if(!text){return;}
		var msg = {
			'sipUrl':sipUrl,
			'text':text
		}
		console.log(msg);
		$('#text-chat').val('');
		ua.sendMessage(msg.sipUrl, msg.text, options);
	});
	

	$('#answer').click(function() {
		console.log('answer click');
		if(session_call != null){
			answer(session_call);
			$('#chatwh').css('display','block');
			$('#msgpanal').css('display','none');
		}else{
			alert('err');
		}
	});

	$('#serach').click(function(){
		console.log('serach');
		$('#addwh').css('display','block');
	});
	$('#add').click(function(){
		var name = $('input[name=addname]').val();
		var sipurl = $('input[name=addsipurl]').val();
		$('#callpanal').css('display','block');
		session = ua.call(sipurl, options);
		console.log(session);
		$('.callname').text('正在呼叫'+name);
		$('#addwh').css('display','none');
	});
});

var GUIinit  = function(){
	var pos = localStorage.getItem('pos');
	if(pos){
		pos = JSON.parse(pos);
		$('#app').css('left',pos.left);
		$('#app').css('top',pos.top);
	}
}

function hasClass(obj, cls) {  
	return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
} 
function addClass(obj, cls) {  
	if (!this.hasClass(obj, cls)) obj.className += " " + cls;  
}  

function removeClass(obj, cls) {  
	if (hasClass(obj, cls)) {  
	    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
	    obj.className = obj.className.replace(reg, ' ');  
	}  
}