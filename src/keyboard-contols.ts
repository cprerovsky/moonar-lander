import Lander from './lander';
export default class KeyboardControls {
    constructor(private lander: Lander) {
        this.lander = lander;
        document.addEventListener('keyup', (e) => this.keyup(e));
        document.addEventListener('keydown', (e) => this.keydown(e));
    }

    private keyup(event) {
        switch (event.keyCode) {
            case 37:
            case 39:
                // Right Arrow key
                this.lander.rotation = "off";
                break;
            case 38:
            case 40:
                // Up Arrow key
                this.lander.engine = "off";
                break;
        }
    }

    keydown(event) {
        switch (event.keyCode) {
            case 37:
                // Left Arrow key
                this.lander.rotation = "ccw";
                break;
            case 39:
                // Right Arrow key
                this.lander.rotation = "cw";
                break;
            case 38:
                // Up Arrow key
                this.lander.engine = "full";
                break;
            case 40:
                // Down
                this.lander.engine = "half";
                break;
        }

    }
}