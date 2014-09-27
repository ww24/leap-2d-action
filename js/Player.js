/* globals enchant, leap2dAction */
/* exported Player */
var Player = enchant.Sprite.Player = enchant.Class.create(enchant.Sprite, {
  initialize: function (x, y) {
    enchant.Sprite.call(this, 32, 32);
    this.image = leap2dAction.core.assets.chara;
    this.frame = 5;
    this.x = x;
    this.y = y;
    this.dy = 0;

    var frame = 0;
    this.addEventListener(enchant.Event.ENTER_FRAME, function () {
      var player = this;
      leap2dAction.goals.forEach(function (goal) {
        player.intersect(goal) && leap2dAction.goal();
      });
      leap2dAction.enemies.forEach(function (enemy) {
        player.intersect(enemy) && leap2dAction.gameover();
      });
      var dx = 0;
      if (leap2dAction.core.input.up && this.dy === 0) {
        frame = 0;
        this.dy = -16;
      }
      if (leap2dAction.core.input.left) {
        dx = -8;
        this.scaleX = -1;
      }
      if (leap2dAction.core.input.right) {
        dx = 8;
        this.scaleX = 1;
      }

      // y 軸障害物判定
      if (leap2dAction.collisionMap.hitTest(this.y + this.dy, this.x)) {
        this.dy = 0;
      }

      // 真下のブロック判定
      if (! leap2dAction.collisionMap.hitTest(this.y + 32, this.x)) {
        this.dy = 0.2 * Math.pow(frame, 2) + this.dy;
        var limit = this.dy / 16;
        for (var i = 1; i < limit; i++) {
          if (leap2dAction.collisionMap.hitTest(this.y + 32 + 16 * i, this.x)) {
            break;
          }
        }
        if (i < limit) {
          this.dy = 16 * (i - 1);
          frame = 0;
        }
      } else if (this.dy > 0) {
        this.y += this.dy - (this.y + this.dy) % 16 - 16;
        this.dy = 0;
        frame = 0;
      }

      // x 軸障害物判定
      if (leap2dAction.collisionMap.hitTest(this.y, this.x + dx) ||
          leap2dAction.collisionMap.hitTest(this.y, this.x + dx + 32)) {
        dx = 0;
      }

      // update player position
      this.y += this.dy;
      this.x += dx;
      frame++;

      if (dx) {
        this.frame = [6, 6, 7, 7][frame % 4];
      } else {
        this.frame = 5;
      }

      if (this.y > 640) {
        leap2dAction.gameover();
      }
    });
  },
  remove: function () {
    if (this.parentNode != null) {
      this.parentNode.removeChild(this);
    }
  }
});
