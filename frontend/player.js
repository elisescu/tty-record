import 'xterm/dist/xterm.css'
import Terminal from 'xterm'
import { clearInterval, setTimeout } from 'timers';

class Player {
    constructor(terminalElementId, playbackData) {
        this.playbackData = playbackData;
        this.currentPlaybackDataIdx = 0;
        this.terminal = new Terminal();
        this.terminal.open(terminalElementId, true);
    }

    renderFrameEvent(frameEvent) {
        if (frameEvent.tp == 1) { // data msg
            this.terminal.write(atob(frameEvent.dt))
        } else { // resize msg
            this.terminal.resize(frameEvent.cols, frameEvent.rows)
        }
    }

    playAll() {
        this.stop();
        for (event of this.playbackData) {
            this.renderFrameEvent(event);
        }
    }

    framesLeft() {
        return this.playbackData.length - this.currentPlaybackDataIdx - 1;
    }

    renderFrames() {
        let thiz = this
        if (this.framesLeft() > 0) {
            const currentFrameEvent = this.playbackData[this.currentPlaybackDataIdx];
            this.renderFrameEvent(currentFrameEvent);

            // Schedule the next frame playback
            if (this.framesLeft() > 1) {
                const nextFrameEvent = this.playbackData[this.currentPlaybackDataIdx + 1];
                const deltaTs = nextFrameEvent.ts - currentFrameEvent.ts;
                console.log("Scheduling next frame after ", deltaTs, " ms")
                this.tickID = window.setTimeout(function () {
                    thiz.renderFrames();
                }, deltaTs);
            }
            this.currentPlaybackDataIdx++;
        }
    }

    play() {
        this.renderFrames();
    }

    pause() {
        window.clearInterval(this.tickID)
    }

    stop() {
        this.pause()
        this.currentPlaybackDataIdx = 0
    }

    seek(position) {
    }

    setPositionUpdater(positionUpdateCallback) {
    }
}

export default Player;
let playNowAction = function () {
}