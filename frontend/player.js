import 'xterm/xterm.css'
import Terminal from 'xterm/xterm'
import { clearInterval, setTimeout } from 'timers';
import 'player.css';
import base64 from 'base64.js'


const DEBUG = 2;

function nolog() {}
let DBG1 = nolog, DBG2 = nolog, DBG3 = nolog;
if (DEBUG > 2) {
    DBG1 = DBG2 = DBG3 = console.log;
} else if (DEBUG > 1) {
    DBG1 = DBG2 = console.log;
} else if (DEBUG > 0) {
    DBG1 = console.log;
}

function _setupPlayerElement(container, player) {
    // Dilema: to use React and pay for the extra size in eacy typescript? Or not?
    container.innerHTML += `
        <div id="terminal"></div>
		<div id="progressbar-container">
            <div id=play-button> </div>
            <div id=range-container>
                <input type="range" min="1" max="1000" value="0" class="progressbar" id="progressbar">
            </div>
        </div>
    `
    player.terminalElement = document.getElementById("terminal");
    player.progressBarElement = document.getElementById("progressbar");
    player.playButtonElement = document.getElementById("play-button")

    let thiz = player.progressBarElement;
    let thizPlayer = player;
    player.progressBarElement.oninput = function() {
        let newTs = (thiz.value * thizPlayer.getDuration()) / 1000;
        thizPlayer.seek(newTs);
    }

    player.playButtonElement.onclick = function() {
        thizPlayer.togglePause();
    }
}

let PlayerState = {
    PAUSED: 1,
    PLAYING: 2
}

class PlayerImpl {
    constructor(containerElement, playbackData) {
        _setupPlayerElement(containerElement, this);

        this.playbackData = playbackData;
        this.currentPlaybackDataIdx = 0;
        this.terminal = new Terminal({
            scrollback: 100,
            cursorBlink: false,
        });
        this.terminal.open(this.terminalElement, true);
        this.terminal.blur();
        this.setState(PlayerState.PAUSED);
        this.currentTimePosition = 0;
        this.frameRate = 30;
        this.frameInterval = (1000) / this.frameRate;
        this.positionCallback = null;
    }

    getDuration() {
        return this.playbackData[this.playbackData.length - 1].ts;
    }

    renderEvent(frameEvent) {
        if (frameEvent.tp == 1) { // data msg
            try  {
                this.terminal.write(base64.decode(frameEvent.dt));
            } catch (e) {
                console.log("Couldnt' write data. Error: ", e);
            }
        } else { // resize msg
            this.terminal.resize(frameEvent.cols, frameEvent.rows)
        }
    }


    framesLeft() {
        return this.playbackData.length - this.currentPlaybackDataIdx - 1;
    }

    getCurrentEvent() {
        if (this.framesLeft() > 0) {
            return this.playbackData[this.currentPlaybackDataIdx];
        } else {
            return null;
        }
    }

    // TODO: Perhaps get rid of these util functions and optimise the code to avoid so many
    // function calls
    getNextEvent() {
        if (this.framesLeft() > 1) {
            return this.playbackData[this.currentPlaybackDataIdx + 1];
        } else {
            return null;
        }
    }

    maybeRenderEvents(realTime) {
        // No more frames, so pause.
        if (this.framesLeft() < 1) {
            this.pause();
            return;
        }

        // Render all the events that are supposed to be played back by this time
        // Not that there might be more than just one, given that terminal commands might
        // produce data faster than the player frame rate.
        while (true) {
            const event = this.getCurrentEvent();
            if (event == null || event.ts > realTime) {
                break;
            }

            DBG3("Rendering event, with idx ", this.currentPlaybackDataIdx, " out of ", this.playbackData.length, ", and ts ", event.ts);
            this.renderEvent(event);
            this.currentPlaybackDataIdx++;
        }
    }

    tick() {
        // Don't do anything, if we are not supposed to be playing.
        if (this.state != PlayerState.PLAYING) {
            return
        }

        this.currentTimePosition += this.frameInterval;
        DBG3("Tick: ", this.currentTimePosition);

        this.maybeRenderEvents(this.currentTimePosition);
        this.progressBarElement.value = (this.currentTimePosition * 1000) / this.getDuration();
        if (this.positionCallback != null) {
            this.positionCallback(this.currentTimePosition);
        }
    }

    play() {
        DBG1("Play called");
        this.setState(PlayerState.PLAYING);

        let player = this;
        this.realTickID = window.setInterval(function(){
            player.tick();
        }, this.frameInterval)
    }

    pause() {
        DBG1("Pause called");
        this.setState(PlayerState.PAUSED);
        window.clearInterval(this.realTickID);
    }

    setState(state) {
        switch (state) {
            case PlayerState.PAUSED:
                this.playButtonElement.classList.remove('pause-state')
                this.playButtonElement.classList.add('play-state')
            break;
            case PlayerState.PLAYING:
                this.playButtonElement.classList.remove('play-state')
                this.playButtonElement.classList.add('pause-state')
            break;
        }
        this.state = state;
    }

    togglePause() {
        switch (this.state) {
            case PlayerState.PAUSED:
                this.play();
                break;
            case PlayerState.PLAYING:
                this.pause();
                break;
        }
    }

    stop() {
        DBG1("Stop called");
        this.pause()
        this.currentPlaybackDataIdx = 0;
        this.currentTimePosition = 0;
    }

    seek(position) {
        let prevState = this.state;
        DBG1("Seeking to ", position, ", previous state was: ", prevState);

        this.reset();

        // TODO: this is a very naive seek, which resets everything, and plays back all the events
        // until it got to the seek position. Unfortunately there's no simple way of doing this,
        // unless the tool that saves the terminal events, will save from time to time the full
        // terminal buffer, which then the player can build upon.
        // WIthout that, the player cannot just just simply render new events starting with the
        // seek position, since it doesn't have the terminal buffer state/content at that seek
        // point.
        // In other words, the result of rendering the current event is dependent on all the previous
        // events, since the terminal buffer/state is building up with every new event/data.
        // The normal data events are not idempotent, unlike the resize ones.
        for (let event of this.playbackData) {
            if (event.ts > position) {
                break;
            }
            this.renderEvent(event);
            this.currentTimePosition = position;
            this.currentPlaybackDataIdx++;
        }

        // If the player was playing, continue the playback
        if (prevState == PlayerState.PLAYING) {
            this.play();
        }
    }

    setPositionUpdater(positionUpdateCallback) {
        this.positionCallback = positionUpdateCallback;
    }

    reset() {
        this.stop();
        this.terminal.reset()
    }
}

// Does this class layer add a significant overhead?
class Player {
    constructor(containerElm, data) {
        this.impl = new PlayerImpl(containerElm, data);
    }

    getDuration() {
        return this.impl.getDuration();
    }

    pause() {
        return this.impl.pause();
    }

    play() {
        return this.impl.play();
    }

    togglePause() {
        return this.impl.togglePause();
    }

    setPositionUpdater(updateCB) {
        return this.impl.setPositionUpdater(updateCB);
    }

    seek(position) {
        return this.impl.seek(position)
    }
}

export {Player, PlayerState};
