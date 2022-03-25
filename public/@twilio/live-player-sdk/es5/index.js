"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var mediaplayer_1 = require("./mediaplayer");
var player_1 = require("./player");
Object.defineProperty(exports, "Player", { enumerable: true, get: function () { return player_1.Player; } });
player_1.setDerivedPlayer(mediaplayer_1.MediaPlayer);
player_1.setIsPlayerSupported(mediaplayer_1.isSupported);
window.Twilio = window.Twilio || {};
window.Twilio.Live = window.Twilio.Live || { Player: player_1.Player };
window.Twilio.Live.Player = window.Twilio.Live.Player || player_1.Player;
//# sourceMappingURL=index.js.map