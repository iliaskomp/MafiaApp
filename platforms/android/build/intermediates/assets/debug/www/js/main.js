$(document).ready(function(){
    var waiting = 0;
    var waitingPlayers;
    var milliseconds = Math.floor((new Date).getTime()/1000);
    console.log(milliseconds);
    $('#createGame #start').click(function () {
        var data = {};
        var bool = 0;
        data["Function"] = "createRoom";
        data["roomName"] = $('#createGame #room-name').val();
        data["password"] = $('#createGame #password').val();
        data["playerName"] = $('#createGame #master-name').val();
        data["mafia"] = $('#settings #mafia').val();
        data["doctor"] = $('#settings #doctor').val();
        data["detective"] = $('#settings #detective').val();
        data["time"] = $('#settings #time').val();
        for( key in data ) {
            if([key] != "password"){
                if(data[key] == ""){
                    bool = 1;
                }
            }
        }
        if(!bool){
           doRequest(data); 
        }else{
            //TODO show error message
        }
        
    });
    
    $('#enterGame #join').click(function () {
        console.log("test");
        var data = {};
        var bool = 0;
        data["Function"] = "joinRoom";
        data["roomId"] = $("input[name='roomId']").val();
        data["password"] = $('#enterGame #password').val();
        data["playerName"] = $('#enterGame #userName').val();
        console.log(data);
        for( key in data ) {
            if([key] != "password"){
                if(data[key] == ""){
                    bool = 1;
                }
            }
        }
        if(!bool){
           doRequest(data); 
        }else{
            //TODO show error message
        }
    });
    
    $('#waiting #leave').click(function () {
        console.log("test");
        var data = {};
        var bool = 0;
        data["Function"] = "leaveRoom";
        data["playerId"] = $("input[name='playerId']").val();
        console.log(data);
        for( key in data ) {
            if([key] != "password"){
                if(data[key] == ""){
                    bool = 1;
                }
            }
        }
        if(!bool){
           doRequest(data); 
        }else{
            //TODO show error message
        }
    });
    
    $('#waiting #start').click(function () {
        console.log("test");
        var data = {};
        var bool = 0;
        data["Function"] = "setRoles";
        data["roomId"] = $("input[name='roomId']").val();
        console.log(data);
        for( key in data ) {
            if([key] != "password"){
                if(data[key] == ""){
                    bool = 1;
                }
            }
        }
        if(!bool){
           doRequest(data); 
        }else{
            //TODO show error message
        }
    });
    
    $('#waiting #leave').click(function () {
        stopWaiting();
        
    });
    
    
    $(document).on("click",".tableElement" , function(){
        var id = $(this).last().parent().prop('id');
        $("input[name='roomId']").val(id);
    });

$('.TableElement').click(function () {
        console.log("in click");
        //var id = $(this).closest("li").attr("id");
        
    });  
   
   $('#homepage #joinGame').click(function () {
        var data = {};
        var bool = 0;
        data["Function"] = "getAllRooms";
        for( key in data ) {
            if([key] != "password"){
                if(data[key] == ""){
                    bool = 1;
                }
            }
        }
        if(!bool){
           doRequest(data); 
        }else{
            //TODO show error message
        }
        
    });
    
     $('#pregame #gameScreen').click(function () {
        var data = {};
        var bool = 0;
        data["Function"] = "getRoomPlayers";
        data["roomId"] = $("input[name='roomId']").val();
           doRequest(data); 
    });
   
   function doRequest(data){
    $.ajax({
            type:"GET",
            contentType: 'text/plain',
            crossDomain:true,
            xhrFields: { withCredentials: false},
            url: "http://polfc.esy.es/mafia/webservice.php",
            data: data
            }).done(function( data ) {
                console.log(data);
                var obj = jQuery.parseJSON(data);
                console.log(obj);
                if(obj.MessageCode == 201){
                    //CREATING GAME
                    window.location = "#waiting";
                    $("input[name='roomId']").val(obj.roomId);
                    $("input[name='playerId']").val(obj.playerId);
                    $("#waiting #start").removeAttr("style");
                    waitingPlayers = setInterval(function () {
                        var data1 = {};
                        data1["Function"] = "getWaiting";
                        data1["roomId"] = obj.roomId;
                        doRequest(data1);
                    },10000);  
                }else if(obj.MessageCode == 202){
                    //CREATING GAME LIST
                    $( "#joinGame #list" ).empty();
                    for(var i = 0; i < obj.Data.length; i++) {
                        var game = obj.Data[i];
                        $('<li/>', {
                            'id': game.id,
                            'class':'general'
                        }).append($('<a/>', {
                            'href': "#enterGame",
                            'data-transition':'pop',
                            'class': "ui-btn ui-btn-icon-right ui-icon-carat-r tableElement",
                            'text':game.name
                        })).appendTo('#joinGame #list');
                    }
                }else if (obj.MessageCode == 203){
                    //CREATING PLAYER LIST
                    $( "#waiting #players" ).empty();
                    for(var i = 0; i < obj.Players.length; i++) {
                        var player = obj.Players[i];
                    $('<p/>', {
                            'text': player.name,
                            'class':'general'
                        }).appendTo('#waiting #players');
                    }
                    if(obj.Ready == "1"){
                        stopWaiting();
                        var data1 = {};
                        data1["Function"] = "getPlayer";
                        data1["playerId"] = $("input[name='playerId']").val();
                        doRequest(data1);
                        window.location = "#pregame";   
                    }
                }else if(obj.MessageCode == 204){
                    //JOIN GAME
                    window.location = "#waiting";
                    $("input[name='playerId']").val(obj.PlayerId);
                    waitingPlayers = setInterval(function () {
                        var data1 = {};
                        data1["Function"] = "getWaiting";
                        data1["roomId"] = $("input[name='roomId']").val();
                        doRequest(data1);
                    },10000);  
                }else if(obj.MessageCode == 205){
                    //DELETE USER/GAME
                    if(obj.RoomDeleted == 1){
                        window.location = "#createGame";
                    }else{
                        window.location = "#enterGame";  
                    }
                    
                }else if(obj.MessageCode == 206){
                    //SET ROLES
                    console.log("test");             
                }else if(obj.MessageCode == 207){
                    $( "p#role" ).html(obj.role);
                }
                
                else{
                    //TODO ERROR 504
                }
    });
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

jQuery(function ($) {
    var fiveMinutes = 60 * 5,
        display = $('#time');
    startTimer(fiveMinutes, display);
});

function stopWaiting() {
    clearInterval(waitingPlayers);
}

});