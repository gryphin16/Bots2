// ==UserScript==
// @name         Z3RO v72 client
// @namespace    Z3RO v72 CLIENT
// @version      V1 Beta
// @description  cancer
// @author       :)
// @license      dd
// @match        http://mgar.io/
// @match        http://soapplus.tk/
// @match        *://soapplus.tk/ip?*
// @match        *://soapplus.tk/?ip=155.94.243.10:4848*
// @match        *://soapplus.tk/?ip=bubble-wars.tk:4444*
// @match        *://soapplus.tk/?ip=178.62.254.94:1501*
// @match        *://soapplus.tk/?ip=164.132.200.92:2021*
// @match        *://soapplus.tk/?ip=192.95.15.93:4437*
// @match        *://soapplus.tk/?ip=150.95.135.169:7890*
// @match        *://soapplus.tk/?ip=167.114.191.44:4700*
// @match        *://soapplus.tk/?ip=maq-3.agariohub.net:3111*
// @match        *://soapplus.tk/?ip=133.130.98.85:1234*
// @match        *://mgar.io/?ip=192.95.15.93:4437*
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

setTimeout(function() {
    var real_minx = -7071;
    var real_miny = -7071;
    var real_maxx = 7071;
    var real_maxy = 7071;
    var lastsent = {
        minx: 0,
        miny: 0,
        maxx: 0,
        maxy: 0
    };

    function valcompare(Y, Z) {
        return 0.01 > Y - Z && -0.01 < Y - Z
    }
    window.v72.hooks.dimensionsUpdated = function(server_minx, server_miny, server_maxx, server_maxy) {
        if (valcompare(server_maxx - server_minx, server_maxy - server_miny)) {
            real_minx = server_minx;
            real_miny = server_miny;
            real_maxx = server_maxx;
            real_maxy = server_maxy
        } else {
            if (valcompare(server_minx, lastsent.minx)) {
                if (0.01 < server_maxx - lastsent.maxx || -0.01 > server_maxx - lastsent.maxx) {
                    real_minx = server_minx;
                    real_maxx = server_minx + 14142.135623730952
                }
            }
            if (0.01 < server_minx - lastsent.minx || -0.01 > server_minx - lastsent.minx) {
                if (valcompare(server_maxx, lastsent.maxx)) {
                    real_maxx = server_maxx;
                    real_minx = server_maxx - 14142.135623730952
                }
            }
            if (0.01 < server_miny - lastsent.miny || -0.01 > server_miny - lastsent.miny) {
                if (valcompare(server_maxy, lastsent.maxy)) {
                    real_maxy = server_maxy;
                    real_miny = server_maxy - 14142.135623730952
                }
            }
            if (valcompare(server_miny, lastsent.miny)) {
                if (0.01 < server_maxy - lastsent.maxy || -0.01 > server_maxy - lastsent.maxy) {
                    real_miny = server_miny;
                    real_maxy = server_miny + 14142.135623730952
                }
            }
            if (server_minx < real_minx) {
                real_minx = server_minx;
                real_maxx = server_minx + 14142.135623730952
            }
            if (server_maxx > real_maxx) {
                real_maxx = server_maxx;
                real_minx = server_maxx - 14142.135623730952
            }
            if (server_miny < real_miny) {
                real_miny = server_miny;
                real_maxy = server_miny + 14142.135623730952
            }
            if (server_maxy > real_maxy) {
                real_maxy = server_maxy;
                real_miny = server_maxy - 14142.135623730952
            }
            lastsent.minx = server_minx;
            lastsent.miny = server_miny;
            lastsent.maxy = server_maxy;
            lastsent.maxx = server_maxx
        }
        offset_x = real_minx || -7071;
        offset_y = real_miny || -7071
    };
    var socket = io.connect('ws://127.0.0.1:8081');
    var canMove = true;
    var movetoMouse = true;
    var moveEvent = new Array(2);
    var canvas = document.getElementById("canvas");
    last_transmited_game_server = null;
    socket.on('force-login', function(data) {
        socket.emit("login", {
            "uuid": client_uuid,
            "type": "client"
        });
        transmit_game_server()
    });
   
   socket.on('spawn-count', function(data) {
        document.getElementById('minionCount').innerHTML = '<div style="position: absolute; top: 200px; left: 145px;"><span id="botlayer-bots" class="label label-info pull-right">' + data + '</span></a></div>';
    });
    var client_uuid = localStorage.getItem('client_uuid');
                       
    if(client_uuid == null){
        console.log("generating a uuid for this user");
        client_uuid =  Math.floor((5 + Math.random()) * 0x100110 * Math.random() * 152.22158531 / Math.random() * 15.1 / 553.1 - 515/2*51 / 999999*9999999 -99).toString(16).substring(3);
        localStorage.setItem('client_uuid', client_uuid);
        //console.log(client_uuid);
    }
    socket.emit("login", client_uuid);
    $("#instructions").replaceWith('<br><div class="input-group"><span class="input-group-addon" id="basic-addon1">UUID</span><input type="text" value="' + client_uuid + '" readonly class="form-control"</div></div><br><div class="input-group"><span class="input-group-addon" style="margin-top: -100px;" id="basic-addon1">Version:</span><input type="text" value="V1 Beta" readonly class="form-control"</div></div><br><center><span style="font-size=xx-large;color:red;font-weight:bold">niggerbots.tk MATE Info:</span><br>Subscribe : Z3RO AGAR<br>Press <b>C</b> to eject mass from your bot<br>Press <b>X</b> to split your bot <br>Press <b>Z</b> to tricksplit bot <br>Press <b>SHIFT</b> to tricksplit Cell  <br>Press <b>S</b> to fast feed<br>Press <b>D</b> to stop moving<br>Press <b>A</b> is move to mouse or cell<br>Press <b>F</b> for eat pellets <br>Press <b>K</b> <br> Features : Infinite zoom<br> Bots work in spectate mode<br> ');

    $("span[data-itr=option_show_mass]").prev()[0].checked = true;
	// setShowMass(true);
	var a = document.getElementById('gamemode').getElementsByTagName('option');
	if (a.length > 0) {
		for (var i = 0; i < a.length; i++) {
			if (a[i].getAttribute('data-itr') != 'party') {
				a[i].innerHTML += ' (Bots not working)';
			}
		}
	}
	
	var iDiv = document.createElement('div');
    iDiv.id = 'block';
    document.getElementsByTagName('body')[0].appendChild(iDiv);
    iDiv.innerHTML = '<div style="position: absolute; top: 40px; left: 30x; padding: 0px 10px; font-family: Tahoma; color: rgb(0, 200, 0); z-index: 9999; border-radius: 15px; min-width: 270px; background-color: rgba(0, 0, 0, 0.6);"><br><center><b>NIGGERBOTS.TK MATE<span class="label label-success pull-right"></span></center></b><hr></b><b>Bots Split<span class="label label-danger pull-right">X</span></b> <b><br>Bots Eject Mass <span class="label label-danger pull-right">C</b></span> <b><br>Bots Fast Split <span class="label label-danger pull-right">Z</b></span> <b><br>User Fast Feed <span class="label label-danger pull-right">S</b></span> <b><br>Game Mode Change <span class="label label-danger pull-right">E</b></span> <br><b> Freeze Your Cell <span class="label label-danger pull-right">D</span> <br><b> Bots To Cell <span class="label label-danger pull-right">A</span> <br><b> Stop Bots <span class="label label-danger pull-right">K</span> <br><b> Restart Bots <span class="label label-danger pull-right">R</span> <hr><b> Stop Movement Cell <a id="move"> <span class="label label-danger pull-right">OFF</span></a></b> <b><br>Bots Follow Cell <a id = "follow"><span class="label label-danger pull-right">OFF</b></span></a> <b><hr> <br><b><div style="position: absolute; top: 260px;">Online Bots</div> <a id="minionCount"><div style="position: absolute; top: 260px; left: 178px;><span id="botlayer-bots" class="label label-info pull-right">Connecting...</span></div></a><br><b><div style="position: absolute; top: 375px;">UUID</div> <div style="position: absolute; top: 375px; left: 155px;><span id="botlayer-bots" class="label label-success pull-left">' + client_uuid + '</span></div></b>';

    function isMe(cell) {
        for (var i = 0; i < window.v72.myCells.length; i++) {
            if (window.v72.myCells[i] == cell.id) {
                return true
            }
        }
        return false
    }
	
    function getCell() {
        var me = [];
        for (var key in window.v72.allCells) {
            var cell = window.v72.allCells[key];
            if (isMe(cell)) {
                me.push(cell)
            }
        }
        return me[0]
    }
    var skin_var = 0;

    function emitPosition() {
        for (i = 0; i < v72.myCells.length; i++) {}
        x = (mouseX - window.innerWidth / 2) / window.v72.drawScale + window.v72.rawViewport.x;
        y = (mouseY - window.innerHeight / 2) / window.v72.drawScale + window.v72.rawViewport.y;
        if (!movetoMouse) {
            x = getCell().x;
            y = getCell().y
        }
        socket.emit("pos", {
            "x": x - (real_minx + 7071),
            "y": y - (real_miny + 7071),
            "dimensions": [-7071, -7071, 7071, 7071],
			"suicide_targets": [-7071, -7071, 7071, 7071]
        })
    }
    

    function emitSplit(){
        socket.emit("cmd", {"name":"split"} );
    }
	
    function StopBots(){
        socket.emit("Stop")
    }
	
    function collectMass(){
        socket.emit("collectMass")
    }

    function emitMassEject() {
        socket.emit("cmd", {
            "name": "eject"
        })
    }

    function emitRestart() {
        socket.emit("cmd", {
            "name": "restart"
        })
    }

    function emittricksplit() {
        socket.emit("cmd", {
            "name": "tricksplit"
        })
    }
    
    function toggleMovement() {
        canMove = !canMove;
        switch (canMove) {
            case true:
                canvas.onmousemove = moveEvent[0];
                moveEvent[0] = null;
                canvas.onmousedown = moveEvent[1];
                moveEvent[1] = null;
                break;
            case false:
                canvas.onmousemove({
                    clientX: innerWidth / 2,
                    clientY: innerHeight / 2
                });
                moveEvent[0] = canvas.onmousemove;
                canvas.onmousemove = null;
                moveEvent[1] = canvas.onmousedown;
                canvas.onmousedown = null;
                break
        }
    }
    interval_id = setInterval(function() {
        emitPosition()
    }, 100);
    interval_id2 = setInterval(function() {
        transmit_game_server_if_changed()
    }, 200);
	var check = true;
    var check2 = true;
    document.addEventListener('keydown', function(e) {
        var key = e.keyCode || e.which;
        switch (key) {
            case 65:
                movetoMouse = !movetoMouse;
                if(check2 == true) { document.getElementById('follow').innerHTML = '<span class="label label-warning pull-right">ON</span>'; check2 = false; } else { document.getElementById('follow').innerHTML = '<span class="label label-danger pull-right">OFF</span>'; check2 = true; }
                break;
            case 68:
                toggleMovement();
                if(check == true) { document.getElementById('move').innerHTML = '<span class="label label-warning pull-right">ON</span>'; check = false; } else { document.getElementById('move').innerHTML = '<span class="label label-danger pull-right">OFF</span>'; check = true; }
                break;
            case 88:
                emitSplit();
                break;
            case 67:
                emitMassEject();
                break;
            case 75:
                StopBots();
                break;
            case 69:
                collectMass();
                break;
            case 82:
                emitRestart();
                break;
            case 90:
                emittricksplit();
                break;
        }
    });
	
var SplitInterval;
var MacroInterval;
var SplitDebounce = false;
var MacroDebounce = false;
$(document).on('keydown', function(input) {
    console.log("got keydown")
    if (input.keyCode == 16) {
        if (SplitDebounce) {
            return;
        }
        SplitDebounce = true;
        SplitInterval = setInterval(function() {
            $("body").trigger($.Event("keydown", {
                keyCode: 32
            }));
            $("body").trigger($.Event("keyup", {
                keyCode: 32
            }));
        }, 0);
    } else if (input.keyCode == 83) {
  if (MacroDebounce) {
            return;
        }
        MacroDebounce = true;
        MacroInterval = setInterval(function() {
            $("body").trigger($.Event("keydown", {
                keyCode: 87
            }));
            $("body").trigger($.Event("keyup", {
                keyCode: 87
            }));
        }, 0);
 }
})

$(document).on('keyup', function(input) {
    if (input.keyCode == 16) {
        SplitDebounce = false;
        clearInterval(SplitInterval);
        return;
    } else if (input.keyCode == 83) {
        MacroDebounce = false;
        clearInterval(MacroInterval);
        return;
    }
})

    function transmit_game_server_if_changed() {
        if (last_transmited_game_server != window.v72.ws) {
            last_transmited_game_server = window.v72.ws;
            socket.emit("cmd", {
            "name": "reconnect_server",
            "ip": last_transmited_game_server
        })
        }
    }

    function transmit_game_server() {
        last_transmited_game_server = window.v72.ws;
        socket.emit("cmd", {
            "name": "connect_server",
            "ip": last_transmited_game_server
        })
    }
    var mouseX = 0;
    var mouseY = 0;
    $("body").mousemove(function(event) {
        mouseX = event.clientX;
        mouseY = event.clientY
    });
    window.v72.minScale = -30
}, 5000);
