$('#a').click(function () {
    alert('jQuery.click()');
    return true;
   });
$.ajax({
            type:"GET",
            contentType: 'text/plain',
            crossDomain:true,
            xhrFields: { withCredentials: false},
            url: "http://polfc.esy.es/mafia/webservice.php",
            data: {Function: "getAllRooms"}}).done(function( data ) {
    console.log(data);
  });

