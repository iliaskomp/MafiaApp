$(document).ready(function(){
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
   
   function doRequest(data){
    $.ajax({
            type:"GET",
            contentType: 'text/plain',
            crossDomain:true,
            xhrFields: { withCredentials: false},
            url: "http://polfc.esy.es/mafia/webservice.php",
            data: data
            }).done(function( data ) {
                var obj = jQuery.parseJSON(data);
                console.log(obj.MessageCode);
                if(obj.MessageCode == 200){
                    window.location = "#waiting";
                }else{
                    //TODO ERROR
                }
    });
}

});

  
   



