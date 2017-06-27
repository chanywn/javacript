$(function(){
	var username;
  	var connected = false;
  	var typing = false;
  	var lastTypingTime;

  	var socket = io('http://101.200.187.190:3000');
	
	var $main = $('#main');
	var $login = $('#login');
	var $chat = $('#chat');
	init();
	function init(){
		var u = localStorage.getItem('username'); 
		if(u !=null){
			$('#login').animate({
		    		'opacity':'0'
		    	},1000,function(){
		    		$('#login').css('display','none');
		    	});
			username = u;
			log(username+'加入群聊');
			socket.emit('add user', username);
		}
	}

	function log (message) {
		$main.append($('<li>').addClass('log').html('<span>'+message+'</span>'));
		scrollToBottom();
	}
	function message (data,self) {
		if(self == undefined){
			self = '';
		}
		console.log(self);
		$main.append($('<li>').addClass('message '+self).html('<p class="name">'+data.username+'</p><p><span class="speak">'+data.message+'</span></p>'));
		scrollToBottom();
	}
	function register(){
		username = $('#newname').val();
		$('#newname').val('');
		console.log(username);
		log(username+'加入群聊');
		localStorage.setItem('username', username);
		socket.emit('add user', username);
	}
	function sendMessage(){
		var msg = $('.usernameInput').val();
		if(msg =='') return;
		socket.emit('new message', msg);
		$('.usernameInput').val('');
		msg = html_encode(msg);
		var data = {'username':username,'message':msg};
		message(data,'right');
	}
	function scrollToBottom(){
		$('#body').animate({scrollTop: $('#main').height()}, 1000); 
	}
	function html_encode(str)   
	{   
	  var s = "";   
	  if (str.length == 0) return "";   
	  s = str.replace(/&/g, "&gt;");   
	  s = s.replace(/</g, "&lt;");   
	  s = s.replace(/>/g, "&gt;");   
	  s = s.replace(/\'/g, "&#39;");   
	  s = s.replace(/\"/g, "&quot;");   
	  s = s.replace(/\n/g, "<br>");   
	  return s;   
	}   
	 
	function html_decode(str)   
	{   
	  var s = "";   
	  if (str.length == 0) return "";   
	  s = str.replace(/&gt;/g, "&");   
	  s = s.replace(/&lt;/g, "<");   
	  s = s.replace(/&gt;/g, ">");   
	  s = s.replace(/&#39;/g, "\'");   
	  s = s.replace(/&quot;/g, "\"");   
	  s = s.replace(/<br>/g, "\n");   
	  return s;   
	}

	$login.keydown(function(e){
		if(e && e.keyCode==13){
			register();
	    	$('#login').animate({
	    		'opacity':'0'
	    	},1000,function(){
	    		$('#login').css('display','none');
	    	});
		}
	});
	$chat.keydown(function(e){
		if(e && e.keyCode == 13){
			sendMessage();
		}
	});
    

    socket.on('login', function (data) {
	    connected = true;
	    console.log('login: '+data.numUsers);
	});

	socket.on('user joined', function (data) {
		console.info(data.username +'joined')
	    log(data.username + '加入群聊');
	});
	socket.on('new message', function (data) {
	    message(data);
	});
	socket.on('user left', function (data) {
    	log(data.username + ' 离开群聊');
	});

	socket.on('disconnect', function () {
	    log('you have been disconnected');
	});
	socket.on('reconnect', function () {
	    log('you have been reconnected');
	    if (username) {
	      socket.emit('add user', username);
	    }
	  });

  socket.on('reconnect_error', function () {
    log('attempt to reconnect has failed');
  });
});