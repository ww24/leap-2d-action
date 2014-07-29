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

  var game = new Core(640, 640);
  game.preload({
    "icons": "img/icon0.png",
    "explode": "img/effect0.png",
    "explode.se": "sound/explosion06.wav",
  });
  game.fps = 30;

  game.onload = onload;
  game.start();
})(function () { // call before load event
  var core = this;

  var Bomb = enchant.Class.create(Sprite, {
    initialize: function () {
      Sprite.call(this, 16, 16);
      this.init();
    },
    init: function () {
      this.image = core.assets["icons"];
      this.frame = 24;
      // 透過率 0%
      this.opacity = 1;
    },
    explode: function () {
      // 爆破音の再生 (上が enchant.js 標準、下が独自実装)
      //core.assets["explode.se"].clone().play();
      leap2dAction.se.explode.play();

      // 透過 100%
      this.opacity = 0;
      // 爆破エフェクトに切り替え
      this.frame = 0;
      this.image = core.assets["explode"];
      // 爆破エフェクト
      var tl = this.tl.fadeIn(5);
      for (var i = 0; i < 4; i++) {
        tl = tl.then(this.gainFrame).delay(5);
      } 
      tl.fadeOut(5)
        .delay(10)
        .then(this.init);
    },
    gainFrame: function () {
      this.frame++;
    }
  });

  var bomb = leap2dAction.bomb = new Bomb();

  var gameScene = new Scene();
  gameScene.addChild(bomb);
  core.pushScene(gameScene);

  gameScene.on(enchant.Event.ENTER_FRAME, function () {
    var scale = 10;

    if (core.input.up) {
      bomb.y -= scale;
    } else if (core.input.down) {
      bomb.y += scale;
    }
    if (core.input.right) {
      bomb.x += scale;
    } else if (core.input.left) {
      bomb.x -= scale;
    }
  });
});
