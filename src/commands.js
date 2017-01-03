"use strict";
var Command = (function () {
    function Command(engine, rotation, tick) {
        this.engine = engine;
        this.rotation = rotation;
        this.tick = tick;
    }
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=commands.js.map