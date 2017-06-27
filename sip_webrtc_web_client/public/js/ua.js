var user = {
    'name': '',
    'url': ''
}

function gettime() {
    var oDate = new Date();
    var h = oDate.getHours();
    var m = oDate.getMinutes();
    var s = oDate.getSeconds();
    return h + ':' + m + ':' + s;
}
peerconnection_config = {
    'iceServers': [{
        'urls': ['stun:101.200.187.190:19302']
    },
    {
        'urls': 'turn:101.200.187.190:19302',
        'username': '700',
        'credential': ' 700'
    }]
};


var configuration = {
    'ws_servers': 'ws://101.200.187.190:5080',
    'uri': '',
    'password': '',
    'realm': '',
    'register': false
};
var ua = null;
var init = function(configuration) {
    ua = new JsSIP.UA(configuration);
    setUaEventHandlers(ua);
    ua.start();
}

var setUaEventHandlers = function(ua) {
    ua.on('connecting',
    function(e) {
        $('#status div').append('<p>' + gettime() + ' 正在建立连接</p>');
    });

    ua.on('connected',
    function(e) {
        $('#status div').append('<p>' + gettime() + ' 成功建立连接</p>');
        
    });

    ua.on('disconnected',
    function(e) {
        $('#status div').append('<p>' + gettime() + ' 无法连接服务器</p>');
    });

    ua.on('newRTCSession',function(e) {
        newcall(e);
    });

    ua.on('newMessage',function(e) {
        console.log(e)
    });

    ua.on('registered',
    function(e) {
        console.info('registered');
        $('#status div').append('<p>' + gettime() + ' 已注册</p>');
        
         $('#loginpanal').animate({
            'opacity': '0'
        },
        500,
        function() {
            $(this).css('display', 'none');
            $('#username').text(user.name);
            $('#sipurl').text(user.url);
        });
    });

    ua.on('unregistered',
    function(e) {
        $('#status div').append('<p>' + gettime() + ' 未注册</p>');
    });

    ua.on('registrationFailed',
    function(e) {
        $('#status div').append('<p>' + gettime() + ' 注册失败</p>');
    });
}

var session = null;
var session_call = null;

var selfView = document.getElementById('video-local');
var remoteView = document.getElementById('video-remote');

var videoEventHandlers = {
    'progress': function(e) {
        console.log('call is in progress');
        $('#call-info').text('progress...');
    },
    'failed': function(e) {
        console.log('call failed with cause');
        $('#call-info').text('failed');
    },
    'ended': function(e) {
        console.log('call ended with cause');
        $('#call-info').text('ended');
    },
    'confirmed': function(e) {
        var local_stream = session.connection.getLocalStreams()[0];

        console.log('call confirmed');
        $('#call-info').text('confirmed');
        selfView = JsSIP.rtcninja.attachMediaStream(selfView, local_stream);
    },
    'addstream': function(e) {
        var stream = e.stream;

        console.log('remote stream added');

        remoteView = JsSIP.rtcninja.attachMediaStream(remoteView, stream);
    }
};

var options = {
    'eventHandlers': videoEventHandlers,
    'mediaConstraints': {
        'audio': true,
        'video': true
    },
    'pcConfig': peerconnection_config
};

var answer = function(call) {
    call.answer({
        pcConfig: peerconnection_config,
        // TMP:
        mediaConstraints: {
            audio: true,
            video: true
        },
        extraHeaders: ['X-Can-Renegotiate: ' + String(localCanRenegotiateRTC())],
        rtcOfferConstraints: {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        },
    })
}

var newcall = function(e) {
    var call = e.session,
    uri = call.remote_identity.uri,
    display_name = uri.user;
    session_call = call;
    setCallEventHandlers(e);
}
var setCallEventHandlers = function(e) {
    var request = e.request,
    call = e.session;

    if (call.direction === 'incoming') {
        $('#answer').css('display', 'inline-block');

        if (call.request.getHeader('X-Can-Renegotiate') === 'false') {
            call.data.remoteCanRenegotiateRTC = false;
        } else {
            call.data.remoteCanRenegotiateRTC = true;
        }
        $('.msg').css('display', 'block');
        console.log('ding ding ding.....');
    }
    call.on('connecting',
    function() {
        console.log('call connecting');
        // TMP
        if (call.connection.getLocalStreams().length > 0) {
            window.localStream = call.connection.getLocalStreams()[0];
        }
    });
    // Progress
    call.on('progress',
    function(e) {
        console.log('call progress');
    });
    // Started
    call.on('accepted',
    function(e) {
        if (call.connection.getLocalStreams().length > 0) {
            localStream = call.connection.getLocalStreams()[0];
            selfView = JsSIP.rtcninja.attachMediaStream(selfView, localStream);
            selfView.volume = 0;

            // TMP
            window.localStream = localStream;
        }

        if (e.originator === 'remote') {
            if (e.response.getHeader('X-Can-Renegotiate') === 'false') {
                call.data.remoteCanRenegotiateRTC = false;
            } else {
                call.data.remoteCanRenegotiateRTC = true;
            }
        }
        $('#callpanal').css('display','none');
        $('#chatwh').css('display', 'block');
    });

    call.on('addstream',
    function(e) {
        console.log('call addstream');
        $('#call-info').append('<p>call addstream</p>');
        remoteStream = e.stream;
        remoteView = JsSIP.rtcninja.attachMediaStream(remoteView, remoteStream);
    });
    // Failed
    call.on('failed',
    function(e) {
        console.log('call failed');
        $('#call-info').append('<p>call failed</p>');
    });

    // NewDTMF
    //多音双频的信号
    call.on('newDTMF',
    function(e) {
        //GUI.playSound("sounds/dialpad/" + e.dtmf.tone + ".ogg");
        console.log('call newDTMF');
        $('#call-info').append('<p>call newDTMF</p>');
    });

    call.on('hold',
    function(e) {
        //GUI.playSound("sounds/dialpad/pound.ogg");
        console.log('call hold');
        $('#call-info').append('<p>call hold</p>');
    });

    call.on('unhold',
    function(e) {
        //GUI.playSound("sounds/dialpad/pound.ogg");
        console.log('call unhold');
        $('#call-info').append('<p>call unhold</p>');
    });

    // Ended
    call.on('ended',
    function(e) {
        console.log('call ended');
        $('#call-info').append('<p>call ended</p>');
    });

    // received UPDATE
    call.on('update',
    function(e) {
        console.log('call update');
        $('#call-info').append('<p>call update</p>');
        var request = e.request;

        if (!request.body) {
            return;
        }

        if (!localCanRenegotiateRTC() || !call.data.remoteCanRenegotiateRTC) {
            console.warn('Tryit: UPDATE received, resetting PeerConnection');
            call.connection.reset();
            call.connection.addStream(localStream);
        }
    });

    call.on('reinvite',
    function(e) {
        console.log('call reinvite');
        $('#call-info').append('<p>call reinvite</p>');
    });

    // received REFER
    call.on('refer',
    function(e) {
        $('#call-info').append('<p>call refer</p>');
        console.error('accepting the refer');
        e.accept(function(session, request) {
            newcall({
                originator: 'remote',
                session: session,
                request: session.request
            });
        },
        {
            mediaStream: localStream
        });
    });

    // received INVITE replacing this session
    call.on('replaces',
    function(e) {
        console.error('accepting the replaces');
        e.accept(function(session, request) {
            newcall({
                originator: 'local',
                session: session,
                request: session.request
            });
        });
    });
}
var localCanRenegotiateRTC = function() {
    return JsSIP.rtcninja.canRenegotiate;
};





var msgEventHandlers = {
  'succeeded': function(data){console.log('succeeded');  },
  'failed':    function(data){console.log('failed');  }
};

var options = {
  'eventHandlers': msgEventHandlers
};