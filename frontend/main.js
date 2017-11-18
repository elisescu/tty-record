import {Player, PlayerState} from './player.js'
const player = new Player(document.getElementById('player'), scriptData);

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        player.togglePause()
    }
}

player.play();