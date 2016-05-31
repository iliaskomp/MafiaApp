$(document).ready(function () {
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
     });
     
     $('#info #bla').click(function () {
     var data = {};
     var bool = 0;
     data["Function"] = "playGame";
     data["roomId"] = "98";//$("input[name='roomId']").val();
     doRequest(data);
     });*/

    $('#info #info_OK').click(function () {
        var data = {};
        data["Function"] = "checkGame";
        data["roomId"] = $("input[name='roomId']").val();
        doRequest(data);
    });

    $('#night #ok-kill').click(function () {
        var data = {};
        //test = test + 1;
        //$("#testppp").html(test);
        if ($("input[name='role']").val() == "villager" && $("input[name='previous']").val() == "night") {
            console.log("in villager");
            data["Function"] = "updatePlayerReady";
            data["playerId"] = $("input[name='playerId']").val();
            doRequest(data);
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
        }
    

    });
    $(document).on("click", ".tableElement", function () {
        //CLICK BINDING ON GAME LIST
        var id = $(this).last().parent().prop('id');
        $("input[name='roomId']").val(id);
    });

    $('#homepage #joinGame').click(function () {
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
                switch (obj.Data[0].role) {
                    case "villager":
                        $("#roleImage").attr("src", "./img/citizen-icon128.png");
                        break;
                    case "mafia":
                        $("#roleImage").attr("src", "./img/mafia-icon128.png");
                        break;
                    case "doctor":
                        $("#roleImage").attr("src", "./img/doctor-icon128.png");
                        break;
                    case "detective":
                        $("#roleImage").attr("src", "./img/detective-icon128.png");
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
                    for (var i = 0; i < obj.Data.length; i++) {
                        var player = obj.Data[i];
                        var src = "img/head-icon64.png";
                        if (player.status == 0) {
                            src = "img/head-icon64-red-dead.png";
                        }
                        /*if (i % 3 == 0) {
                         $('<div/>', {
                         'id': i / 3,
                         'class': 'row player-icon-row'
                         }).appendTo('#night #players');
                         }*/
                        $('<div/>', {
                         'id': player.id
                         }).append($('<img/>', {
                         'id': player.id,
                         'class': 'char-icon',
                         'src': src,
                         'css' : 'z-index:100'
                         })).appendTo('#night #players');// + Math.floor(i / 3)
                         /*$('#night div#' + player.id).append($('<p/>', {
                         'text': player.name
                         }));
                         $('#night div#' + player.id).append($('<p/>', {
                         'text': "",
                         'id': player.id
                         }));*/
                        /*$('<img/>', {
                            'id': player.id,
                            'class': 'char-icon',
                            'src': src
                        }).appendTo('#night #players');*/
                        if (!clickDay) {
                            console.log("in click day");
                            $(document).on("click", "#night div#" + player.id, function () {
                                if ($("input[name='role']").val() != "villager") {
                                    target = $(this).parent().attr("id");
                                    console.log(target);
                                }
                            });
                        }

                    }
                    clickDay = 1;
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
                            'id': player.id
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

                        if (click < 2) {
                            $(document).on("click", "#day img#" + player.id, function () {
                                target = $(this).parent().attr("id");
                            });

                        }

                    }

                    if ($("input[name='role']").val() == "detective") {
                        for (var l = 0; l < discovered.length; l++) {
                            console.log(discovered[i]);
                            $("img#" + discovered[l]).attr("src");
                            switch (discoveredRole[l]) {
                                case "villager":
                                    $("img#" + discovered[l]).attr("src", "./img/citizen-icon128.png");
                                    break;
                                case "mafia":
                                    $("img#" + discovered[l]).attr("src", "./img/mafia-icon128.png");
                                    break;
                                case "doctor":
                                    $("img#" + discovered[l]).attr("src", "./img/doctor-icon128.png");
                                    break;
                                case "detective":
                                    $("img#" + discovered[l]).attr("src", "./img/detective-icon128.png");
                                    break;
                            }
                        }
                    }
                    click = click + 1;
                    if (endTime - gmt > 0) {

                        jQuery(function ($) {
                            var diference = endTime - gmt;
                            display = $('#day #time');
                            startTimer(diference, display);
                        });
                    }
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
                                $("#day p#" + prop).html();
                                $("#day p#" + prop).html("votes : " + vote[prop]);
                            }
                        }
                    } else {
                        for (var i = 0; i < obj.Players.length; i++) {
                            var player = obj.Players[i];
                            if ($("input[name='role']").val() == "mafia") {
                                $("#night p#" + player.id).html();
                            }
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
                    if (obj.Discovered != 0) {
                        discovered.push(obj.Discovered);
                        discoveredRole.push(obj.DiscoveredRole);
                    }
                } else {
                    $("#info #killed").html();
                    $("#info #killed").html(obj.Killed + " Has been lynched by the mob");
                    $("#killedIcon").attr("src", "img/head-icon64-red-gun.png");
                    $('#votesHide').removeClass('hide');
                    /*for (var i = 0; i < obj.Targets.length; i++) {
                     var vote = obj.Targets[i];
                     $('#votes').html();
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
                     }*/
                }
                for (i = 0; i < discovered.length; i++) {
                    console.log(discovered[i]);
                }

            } else if (obj.MessageCode == 215) {
                if (obj.Game == 0) {
                    var data = {};
                    data["Function"] = "getRoomPlayers";
                    data["roomId"] = $("input[name='roomId']").val();
                    doRequest(data);
                }

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

    function stopHating() {
        clearInterval(checkStatus);
    }

});