$(document).ready(function () {
    var waiting = 0;
    var waitingPlayers;
    var checkStatus;
    var click = 0;
    var target;
    var discovered = [];
    var discoveredRole = [];
    var generatedDay = 0;
    var generatedNight = 0;
    var clickDay = 0;
    var clickNight = 0;
    var previousTarget = 0;
    var previousPhoto = null;
    var previousPhoto1 = null;
    var help = 0;
    var show;
    $("input[name='playerId']").val();
    $("input[name='roomId']").val();
    $("input[name='previous']").val("day");

    $('#createGame #start').click(function () {
        //CREATE GAME
        var data = {};
        var bool = 0;
        data["Function"] = "createRoom";
        data["roomName"] = $('#createGame #room-name').val();
        data["password"] = $('#createGame #password').val();
        data["playerName"] = $('#createGame #master-name').val();
        data["mafia"] = $('#settings #mafia').val();
        //data["doctor"] = $('#settings #doctor').val();
        //data["detective"] = $('#settings #detective').val();
        data["time"] = $('#settings #time').val();
        for (key in data) {
            if ([key] != "password") {
                if (data[key] == "") {
                    bool = 1;
                }
            }
        }
        if (!bool) {
            doRequest(data);
        } else {
            //TODO show error message
        }

    });
    $('#enterGame #join').click(function () {
        //JOIN GAME
        console.log("test");
        var data = {};
        var bool = 0;
        data["Function"] = "joinRoom";
        data["roomId"] = $("input[name='roomId']").val();
        data["password"] = $('#enterGame #password').val();
        data["playerName"] = $('#enterGame #userName').val();
        console.log(data);
        for (key in data) {
            if ([key] != "password") {
                if (data[key] == "") {
                    bool = 1;
                }
            }
        }
        if (!bool) {
            doRequest(data);
        } else {
            //TODO show error message
        }
    });

    $('#waiting #leave').click(function () {
        //LEAVE GAME
        stopWaiting();
        var data = {};
        var bool = 0;
        data["Function"] = "leaveRoom";
        data["playerId"] = $("input[name='playerId']").val();
        console.log(data);
        for (key in data) {
            if ([key] != "password") {
                if (data[key] == "") {
                    bool = 1;
                }
            }
        }
        if (!bool) {
            doRequest(data);
        } else {
            //TODO show error message
        }
    });

    $('#waiting #start').click(function () {
        //ADMIN START GAME
        var data = {};
        var bool = 0;
        data["Function"] = "setRoles";
        data["roomId"] = $("input[name='roomId']").val();
        console.log(data);
        for (key in data) {
            if ([key] != "password") {
                if (data[key] == "") {
                    bool = 1;
                }
            }
        }
        if (!bool) {
            doRequest(data);
        } else {
            //TODO show error message
        }
    });

    /*$('#day #test').click(function () {
     var data = {};
     data["Function"] = "getRoomPlayers";
     data["roomId"] = "97";//$("input[name='roomId']").val();
     doRequest(data);
     });*/

    $('#info #bla').click(function () {
        /*var data = {};
         var bool = 0;
         data["Function"] = "playGame";
         data["roomId"] = "98";//$("input[name='roomId']").val();
         doRequest(data);*/
        //show = setTimeout(showButton, 1000);
    });

    $('#info #info_OK').click(function () {
        var data = {};
        data["Function"] = "killPlayer";
        data["roomId"] = $("input[name='roomId']").val();
        doRequest(data);
    });

    $('#night #ok-kill').click(function () {
        var data = {};
        //test = test + 1;
        //$("#testppp").html(test);
        if ($("input[name='role']").val() == "villager" && $("input[name='previous']").val() == "night") {
            data["Function"] = "updatePlayerReady";
            data["playerId"] = $("input[name='playerId']").val();
            doRequest(data);
            $("#night #ok-kill").addClass("btn-voted");
        } else {
            if (target != null) {
                data["Function"] = "updatePlayerReady";
                data["playerId"] = $("input[name='playerId']").val();
                doRequest(data);
                data = {};
                data["Function"] = "updatePlayerTarget";
                data["playerId"] = $("input[name='playerId']").val();
                data["target"] = target;
                doRequest(data);
                $("#night #ok-kill").addClass("btn-voted");


            }
        }

    });

    $('#day #continue').click(function () {
        var data = {};
        /*if ($("input[name='role']").val() == "villager" && $("input[name='previous']").val() == "night") {
         console.log("in villager");
         data["Function"] = "updatePlayerReady";
         data["playerId"] = $("input[name='playerId']").val();
         doRequest(data);
         } else {*/
        if (target != null) {
            data["Function"] = "updatePlayerReady";
            data["playerId"] = $("input[name='playerId']").val();
            doRequest(data);
            data = {};
            data["Function"] = "updatePlayerTarget";
            data["playerId"] = $("input[name='playerId']").val();
            data["target"] = target;
            doRequest(data);
            $("#day #continue").addClass("btn-voted");
        }


    });
    $(document).on("click", ".tableElement", function () {
        //CLICK BINDING ON GAME LIST
        var id = $(this).last().parent().prop('id');
        $("input[name='roomId']").val(id);
    });

    $('#homepage #joinGameButton').click(function () {
        //CREATE GAME LIST
        var data = {};
        var bool = 0;
        data["Function"] = "getAllRooms";
        for (key in data) {
            if ([key] != "password") {
                if (data[key] == "") {
                    bool = 1;
                }
            }
        }
        if (!bool) {

            doRequest(data);

        } else {
            //TODO show error message
        }

    });

    $('#pregame #gameScreen').click(function () {
        //PRE GAME SCREEN
        var data = {};
        data["Function"] = "getRoomPlayers";
        data["roomId"] = $("input[name='roomId']").val();
        doRequest(data);
    });

    function doRequest(data) {
        $.ajax({
            type: "GET",
            contentType: 'text/plain',
            crossDomain: true,
            xhrFields: {withCredentials: false},
            url: "http://188.166.44.160/mafia/webservice.php",
            data: data
        }).done(function (data) {
            var obj = jQuery.parseJSON(data);
            console.log(obj);
            if (obj.MessageCode == 201) {
                //RESPONSE AFTER CREATING A GAME
                window.location = "#waiting";
                $("input[name='roomId']").val(obj.roomId);
                $("input[name='playerId']").val(obj.playerId);
                $("#waiting #start").removeAttr("style");
                waitingPlayers = setInterval(function () {
                    var data1 = {};
                    data1["Function"] = "getWaiting";
                    data1["roomId"] = obj.roomId;
                    doRequest(data1);
                }, 10000);
            } else if (obj.MessageCode == 202) {
                //RESPONSE AFTER CREATING GAME LIST
                $("#joinGame #list").empty();
                for (var i = 0; i < obj.Data.length; i++) {
                    var game = obj.Data[i];
                    $('<li/>', {
                        'id': game.id,
                        'class': 'general'
                    }).append($('<a/>', {
                        'href': "#enterGame",
                        'data-transition': 'pop',
                        'class': "ui-btn ui-btn-icon-right ui-icon-carat-r tableElement",
                        'text': game.name
                    })).appendTo('#joinGame #list');
                }
            } else if (obj.MessageCode == 203) {
                //RESPONSE TO FILL WAITING LIST
                $("#waiting #players").empty();
                for (var i = 0; i < obj.Players.length; i++) {
                    var player = obj.Players[i];
                    $('<p/>', {
                        'text': player.name,
                        'class': 'general'
                    }).appendTo('#waiting #players');
                }
                if (obj.Ready == "1") {
                    stopWaiting();
                    var data1 = {};
                    data1["Function"] = "getPlayer";
                    data1["playerId"] = $("input[name='playerId']").val();
                    doRequest(data1);
                    window.location = "#pregame";
                }
            } else if (obj.MessageCode == 204) {
                //RESPONSE TO PUT YOU IN THE WAITING SCREEN
                window.location = "#waiting";
                $("input[name='playerId']").val(obj.PlayerId);
                waitingPlayers = setInterval(function () {
                    var data1 = {};
                    data1["Function"] = "getWaiting";
                    data1["roomId"] = $("input[name='roomId']").val();
                    doRequest(data1);
                }, 10000);
            } else if (obj.MessageCode == 205) {
                //RESPONSE AFTER LEAVING A GAME
                if (obj.RoomDeleted == 1) {
                    window.location = "#createGame";
                } else {
                    window.location = "#enterGame";
                }

            } else if (obj.MessageCode == 206) {
                //SET ROLES
                console.log("206");
            } else if (obj.MessageCode == 207) {
                //RESPONSE TO FILL THE PRE GAME SCREEN
                $("p#role").html(obj.Data[0].role);
                $("input[name='role']").val(obj.Data[0].role);
                console.log($("input[name='role']").val());
                switch (obj.Data[0].role) {
                    case "villager":
                        $("#roleImage").attr("src", "./img/citizen-icon128.png");
                        $("#night #playerRole1").attr("src", "./img/citizen-icon64.png");
                        $("#day #playerRole").attr("src", "./img/citizen-icon64.png");
                        break;
                    case "mafia":
                        $("#roleImage").attr("src", "./img/mafia-icon128.png");
                        $("#night #playerRole1").attr("src", "./img/mafia-icon64.png");
                        $("#day #playerRole").attr("src", "./img/mafia-icon64.png");
                        break;
                    case "doctor":
                        $("#roleImage").attr("src", "./img/doctor-icon128.png");
                        $("#night #playerRole1").attr("src", "./img/doctor-icon64.png");
                        $("#day #playerRole").attr("src", "./img/doctor-icon64.png");
                        break;
                    case "detective":
                        $("#roleImage").attr("src", "./img/detective-icon128.png");
                        $("#night #playerRole1").attr("src", "./img/detective-icon64.png");
                        $("#day #playerRole").attr("src", "./img/detective-icon64.png");
                        break;
                }
            } else if (obj.MessageCode == 208) {
                //RESPONSE TO POPULATE THE GAME SCREENS
                //var endTime = obj.EndTime;
                //var gmt = new Date(Date.now());
                //var tz = gmt.getTimezoneOffset();
                //gmt = new Date(gmt.valueOf() + gmt.getTimezoneOffset() * 60 * 1000);
                //gmt = Math.floor(gmt.valueOf() / 1000);
                if ($("input[name='previous']").val() == "day") {
                    window.location = "#night";
                    $("input[name='previous']").val('night');
                    $("#night #players").empty();
                    //$("input[name='role']").val(obj.Data[0].role);
                    /*switch ($("input[name='role']").val()) {
                     case "villager":
                     $("#night #playerRole1").attr("src", "./img/citizin-icon64.png");
                     break;
                     case "mafia":
                     $("#night #playerRole1").attr("src", "./img/mafia-icon64.png");
                     break;
                     case "doctor":
                     $("#night #playerRole1").attr("src", "./img/doctor-icon64.png");
                     break;
                     case "detective":
                     $("#night #playerRole1").attr("src", "./img/detective-icon64.png");
                     break;
                     }*/
                    for (var i = 0; i < obj.Data.length; i++) {
                        var player = obj.Data[i];
                        var src = "img/head-icon64.png";
                        if (player.status == 0) {
                            src = "img/head-icon64-red-dead.png";
                        } else if (player.role == "mafia" && $("input[name='role']").val() == "mafia") {
                            src = "./img/mafia-icon64.png";
                        }
                        if (i % 3 == 0) {
                            $('<div/>', {
                                'id': i / 3,
                                'class': 'row player-icon-row'
                            }).appendTo('#night #players');
                        }
                        $('<div/>', {
                            'id': player.id,
                            'class': 'clickable-div'
                        }).append($('<img/>', {
                            'id': player.id,
                            'class': 'char-icon',
                            'src': src,
                            'css': 'z-index:100'
                        })).appendTo('#night #players #' + Math.floor(i / 3));
                        $('#night div#' + player.id).append($('<p/>', {
                            'text': player.name
                        }));
                        $('#night div#' + player.id).append($('<p/>', {
                            'text': "",
                            'id': player.id
                        }));
                        if (!clickNight) {
                            $(document).on("click", "#night img#" + player.id, function () {
                                if ($("input[name='role']").val() != "villager") {
                                    target = $(this).parent().attr("id");
                                    $("#night #ok-kill").removeClass("btn-voted");
                                    if (help == 0) {
                                        previousTarget = target;
                                        previousPhoto = $("#night img#" + target).attr("src");
                                        $("#night img#" + target).attr("src", "./img/head-icon64-green.png");
                                        console.log(previousTarget);

                                        console.log(previousPhoto);
                                        help = 1;
                                    } else {
                                        previousPhoto1 = $("#night img#" + target).attr("src");
                                        $("#night img#" + target).attr("src", "./img/head-icon64-green.png");
                                        $("#night img#" + previousTarget).attr("src", previousPhoto);
                                        previousTarget = target;
                                        previousPhoto = previousPhoto1;
                                        console.log(previousTarget);

                                        console.log(previousPhoto);
                                        console.log("#night img#" + previousTarget);

                                    }
                                }
                            });
                        }

                    }
                    clickNight = 1;
                    //click = click + 1;
                    /*if (endTime - gmt > 0) {
                     
                     jQuery(function ($) {
                     var diference = endTime - gmt;
                     display = $('#night #time');
                     startTimer(diference, display);
                     });
                     }*/
                } else {
                    window.location = "#day";
                    $("input[name='previous']").val('day');
                    $("#day #players").empty();
                    /*switch ($("input[name='role']").val()) {
                     case "villager":
                     $("#day #playerRole").attr("src", "./img/citizin-icon64.png");
                     break;
                     case "mafia":
                     $("#day #playerRole").attr("src", "./img/mafia-icon64.png");
                     break;
                     case "doctor":
                     $("#day #playerRole").attr("src", "./img/doctor-icon64.png");
                     break;
                     case "detective":
                     $("#day #playerRole").attr("src", "./img/detective-icon64.png");
                     break;
                     }*/
                    for (var i = 0; i < obj.Data.length; i++) {
                        var player = obj.Data[i];
                        var src = "img/head-icon64.png";

                        if (player.status == 0) {
                            src = "img/head-icon64-red-dead.png";
                        }
                        if (i % 3 == 0) {
                            $('<div/>', {
                                'id': i / 3,
                                'class': 'row player-icon-row'
                            }).appendTo('#day #players');
                        }
                        $('<div/>', {
                            'id': player.id,
                            'class': 'clickable-div'
                        }).append($('<img/>', {
                            'id': player.id,
                            'class': 'char-icon',
                            'src': src
                        })).appendTo('#day #players #' + Math.floor(i / 3));
                        $('#day div#' + player.id).append($('<p/>', {
                            'text': player.name
                        }));
                        $('#day div#' + player.id).append($('<p/>', {
                            'text': "",
                            'id': player.id
                        }));

                        if (!clickDay) {
                            $(document).on("click", "#day img#" + player.id, function () {
                                target = $(this).parent().attr("id");
                                $("#day #continue").removeClass("btn-voted");
                                if (help == 0) {
                                    previousTarget = target;
                                    previousPhoto = $("#day img#" + target).attr("src");
                                    $("#day img#" + target).attr("src", "./img/head-icon64-green.png");
                                    console.log(previousTarget);

                                    console.log(previousPhoto);
                                    help = 1;
                                } else {
                                    previousPhoto1 = $("#day img#" + target).attr("src");
                                    $("#day img#" + target).attr("src", "./img/head-icon64-green.png");
                                    $("#day img#" + previousTarget).attr("src", previousPhoto);
                                    previousTarget = target;
                                    previousPhoto = previousPhoto1;
                                    console.log(previousTarget);

                                    console.log(previousPhoto);
                                    console.log("#day img#" + previousTarget);

                                }
                            });

                        }

                    }
                    clickDay = 1;

                    if ($("input[name='role']").val() == "detective") {
                        for (var l = 0; l < discovered.length; l++) {
                            console.log(discovered[l]);
                            console.log(discoveredRole[l]);
                            console.log("#day img#" + discovered[l]);
                            //$("img#" + discovered[l]).attr("src");
                            switch (discoveredRole[l]) {
                                case "villager":
                                    $("#day img#" + discovered[l]).attr("src", "./img/citizen-icon64.png");
                                    break;
                                case "mafia":
                                    $("#day img#" + discovered[l]).attr("src", "./img/mafia-icon64.png");
                                    break;
                                case "doctor":
                                    $("#day img#" + discovered[l]).attr("src", "./img/doctor-icon64.png");
                                    break;
                                case "detective":
                                    $("#day img#" + discovered[l]).attr("src", "./img/detective-icon64.png");
                                    break;
                            }
                        }
                    }
                    click = click + 1;
                }
                checkStatus = setInterval(function () {
                    var data1 = {};
                    data1["Function"] = "getPlayersReady";
                    data1["roomId"] = $("input[name='roomId']").val();
                    doRequest(data1);
                }, 10000);


            } else if (obj.MessageCode == 209) {
                if (obj.Ready == 1 && obj.Tie == 0) {
                    var data1 = {};
                    data1["Function"] = "playGame";
                    data1["roomId"] = $("input[name='roomId']").val();
                    doRequest(data1);
                } else {
                    if ($("input[name='previous']").val() == "day") {
                        for (var i = 0; i < obj.Votes.length; i++) {
                            var vote = obj.Votes[i];
                            for (var prop in vote) {
                                $("#day p#" + prop).empty();
                                $("#day p#" + prop).html("votes : " + vote[prop]);
                            }
                        }
                    } else {
                        for (var i = 0; i < obj.Players.length; i++) {
                            var player = obj.Players[i];
                            //if ($("input[name='role']").val() == "mafia") {
                            $("#night p#" + player.id).empty();
                            //}
                        }
                        for (var i = 0; i < obj.Mafia.length; i++) {
                            var vote = obj.Mafia[i];
                            //NEED ALL THE PLAYERS TO RESET THE HTML
                            for (var prop in vote) {
                                if ($("input[name='role']").val() == "mafia") {
                                    $("#night p#" + prop).html("votes : " + vote[prop]);
                                }
                            }
                        }

                    }


                }
            } else if (obj.MessageCode == 212) {
                stopHating();
                window.location = "#info";
                if ($("input[name='previous']").val() == "night") {
                    $("#info #killed").html();
                    if (obj.Healed == 0) {
                        $("#info #killed").html(obj.Killed + " Has been killed by the mafia");
                        $("#killedIcon").attr("src", "img/head-icon64-red-gun.png");
                    } else {
                        $("#info #killed").html(obj.Healed + " Was healed back to life!");
                        $("#killedIcon").attr("src", "img/head-icon64-green.png");
                    }
                    $('#votesHide').addClass('hide');
                    show = setTimeout(showButton, 10000);

                    if (obj.Discovered != 0) {
                        discovered.push(obj.Discovered);
                        discoveredRole.push(obj.DiscoveredRole);
                    }
                } else {
                    $("#info #killed").html();
                    $("#info #killed").html(obj.Killed + " Has been lynched by the mob");
                    $("#killedIcon").attr("src", "img/head-icon64-red-gun.png");
                    $('#votesHide').removeClass('hide');
                    $('#votes').empty();
                    show = setTimeout(showButton, 10000);
                    for (var i = 0; i < obj.Targets.length; i++) {
                        var vote = obj.Targets[i];
                        for (var prop in vote) {
                            playerVoted = 0;
                            playerVotedOn = "did not vote";
                            for (var j = 0; j < obj.Players.length; j++) {
                                objPlayer = obj.Players[j];
                                if (prop == objPlayer.id) {
                                    playerVoted = objPlayer.name;
                                }
                                if (vote[prop] == objPlayer.id) {
                                    playerVotedOn = objPlayer.name;
                                }
                            }
                            $('#votes').append($('<p/>', {
                                'text': playerVoted + " -> " + playerVotedOn
                            }));
                        }
                    }
                }
                for (i = 0; i < discovered.length; i++) {
                    console.log(discovered[i]);
                }

            } else if (obj.MessageCode == 215) {
                console.log("in 215");
                if (obj.Game == 0) {
                    var data = {};
                    data["Function"] = "getRoomPlayers";
                    data["roomId"] = $("input[name='roomId']").val();
                    doRequest(data);
                    help = 0;
                    previousTarget = 0;
                    previousPhoto = null;
                    previousPhoto1 = null;
                    $('#info_OK').addClass('hide');
                    $("#night #ok-kill").removeClass("btn-voted");
                    $("#day #continue").removeClass("btn-voted");
                } else if (obj.Game == 1) {
                    window.location = "#endGame";
                    $("#endGame #winner").html("Villagers");
                    if ($("input[name='role']").val() != "Mafia") {
                        $("#endGame #result").html("You won!");

                    } else {
                        $("#endGame #result").html("you lost!");
                    }
                    $('#endGame #image').append($('<img/>', {
                        'src': "http://image005.flaticon.com/1/svg/42/42175.svg",
                        'class': "center img img-circle"
                    }));
                } else if (obj.Game == 2) {
                    window.location = "#endGame";
                    $("#endGame #winner").html("Mafia");
                    if ($("input[name='role']").val() == "mafia") {
                        $("#endGame #result").html("You won!");

                    } else {
                        $("#endGame #result").html("You lost!");
                    }
                    $('#endGame #image').append($('<img/>', {
                        'src': "img/mafia200.png",
                        'class': "center img img-circle"
                    }));
                }

            } else if (obj.MessageCode == 220) {
                var data = {};
                data["Function"] = "checkGame";
                data["roomId"] = $("input[name='roomId']").val();
                doRequest(data);
            } else {
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
                var data1 = {};
                data1["Function"] = "playGame";
                data1["roomId"] = $("input[name='roomId']").val();
                doRequest(data1);
                //timer = duration;
            }
        }, 1000);
    }



    function stopWaiting() {
        clearInterval(waitingPlayers);
    }

    function showButton() {
        $('#info_OK').removeClass('hide');
        clearInterval(show);
    }

    function stopHating() {
        clearInterval(checkStatus);
    }

    showAndhideRole();

});

// Disable Back button
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
    }, false);


}

// Show and hide your role icon
function showAndhideRole() {
    $(".hidden-icon").on('click', function () {
        $('.hidden-icon').addClass('hide');
        $('.char-icon-main').removeClass('hide');
    });
    $(".char-icon-main").on('click', function () {
        $('.char-icon-main').addClass('hide');
        $('.hidden-icon').removeClass('hide');
    });
}
