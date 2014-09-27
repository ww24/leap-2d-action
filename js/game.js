/* globals enchant, AudioController, MapLoader */
/**
 * 2D Action Game
 * require enchant.js v0.8
 */

// namespace
var leap2dAction = {
  se: {
    explode: new AudioController("sound/explosion06.wav", "sound/explosion06.mp3")
  },
  map: new MapLoader()
};

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
    chara: "img/chara1.png",
    explode: "img/effect0.png",
    explode_se: "sound/explosion06.wav"
  });
  game.fps = 30;
  game.onload = onload;
  game.start();

  leap2dAction.goal = function () {
    console.log("goal");
  };
  leap2dAction.gameover = function () {
    console.log("gameover");
  };
})(function () { // call before load event
  var core = this;
  // create scene
  var gameScene = new enchant.Scene();
  core.pushScene(gameScene);

  // create bomb
  var bomb = leap2dAction.bomb = new enchant.Sprite.Bomb();
  var block = [];
  var goals = leap2dAction.goals = [];
  var enemies = leap2dAction.enemies = [];

  var collisionMap = leap2dAction.collisionMap = new Map(16, 16);
  collisionMap.image = core.assets.map;

  leap2dAction.map.load("01", function (err, map) {
    // create block wall
    var collision = leap2dAction.collision = map.map(function (row, x) {
      block[x] = [];
      return row.map(function (column, y) {
        var res = 0;
        switch (column) {
          case "#":
            column = new enchant.Sprite.Block(x * 16, y * 16);
            block[x][y] = column;
            res = 1;
            break;
          case "G":
            column = new enchant.Sprite.Goal(x * 16, y * 16);
            goals.push(column);
            break;
          case "C":
            column = new enchant.Sprite.Player(x * 16, y * 16);
            leap2dAction.player = column;
            return 0;
          default:
            return 0;
        }
        gameScene.addChild(column);
        return res;
      });
    });

    collisionMap.loadData(collision);
    collisionMap.collisionData = collision;

    gameScene.addChild(leap2dAction.player);
    gameScene.addChild(bomb);
  });

  // for touch control
  gameScene.on(enchant.Event.TOUCH_MOVE, function (e) {
    if (bomb.frame === 24 && e.localX >= 0 && e.localX < core.width - 16 && e.localY >= 0 && e.localY < core.height - 16) {
      bomb.y = e.localY;
      bomb.x = e.localX;
    }
  });

  leap2dAction.afterExplode = function () {
    var x1 = Math.floor(this.x / 16);
    var x2 = Math.ceil(this.x / 16);
    var y1 = Math.floor(this.y / 16);
    var y2 = Math.ceil(this.y / 16);

    function addChild() {
      gameScene.addChild(this);
    }

    // left top
    block[x1][y1] && block[x1][y1].destroy(0, addChild);
    // left bottom
    block[x1][y2] && block[x1][y2].destroy(1, addChild);
    // right top
    block[x2][y1] && block[x2][y1].destroy(2, addChild);
    // right bottom
    block[x2][y2] && block[x2][y2].destroy(3, addChild);
  };

  core.keybind(32, "space");
  gameScene.on(enchant.Event.ENTER_FRAME, function () {
    if (core.input.space) {
      bomb.explode(leap2dAction.afterExplode);
    }
  });
});
