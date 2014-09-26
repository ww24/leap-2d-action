/* globals enchant, AudioController */
/**
 * 2D Action Game
 * require enchant.js v0.8
 */

// namespace
var leap2dAction = {};

enchant();

(function (onload) {
  // 音声を読み込む .mp3 は IE 対応
  leap2dAction.se = {
    explode: new AudioController("sound/explosion06.wav", "sound/explosion06.mp3")
  };

  var game = leap2dAction.core = new enchant.Core(640, 640);
  game.preload({
    map: "img/map2.png",
    icons: "img/icon0.png",
    explode: "img/effect0.png",
    explode_se: "sound/explosion06.wav"
  });
  game.fps = 30;

  game.onload = onload;
  game.start();
})(function () { // call before load event
  var core = this;
  // create scene
  var gameScene = new enchant.Scene();

  // create block wall
  var block = [];
  for (var i = 0; i < 40; i++) {
    block[i] = [];
    for (var j = 0; j < 40; j++) {
      block[i][j] = new enchant.Sprite.Block(i * 16, j * 16);
      gameScene.addChild(block[i][j]);
    }
  }

  // create bomb
  var bomb = leap2dAction.bomb = new enchant.Sprite.Bomb();
  gameScene.addChild(bomb);

  // publish scene
  core.pushScene(gameScene);

  // for touch control
  gameScene.on(enchant.Event.TOUCH_MOVE, function (e) {
    if (bomb.frame === 24 && e.localX >= 0 && e.localX <= core.width && e.localY >= 0 && e.localY <= core.height) {
      bomb.y = e.localY;
      bomb.x = e.localX;
    }
  });

  core.keybind(32, "space");
  gameScene.on(enchant.Event.ENTER_FRAME, function () {
    if (core.input.space) {
      bomb.explode(function () {
        var x1 = Math.floor(this.x / 16);
        var x2 = Math.floor((this.x + 16) / 16);
        var y1 = Math.floor(this.y / 16);
        var y2 = Math.floor((this.y + 16) / 16);

        function addChild() {
          gameScene.addChild(this);
        }

        // left top
        block[x1][y1].destroy(0, addChild);
        // left bottom
        block[x1][y2].destroy(1, addChild);
        // right top
        block[x2][y1].destroy(2, addChild);
        // right bottom
        block[x2][y2].destroy(3, addChild);
      });
    }
  });
});
