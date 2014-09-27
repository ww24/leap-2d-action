/* globals enchant, leap2dAction */
/* exported Block */
var Block = enchant.Sprite.Block = enchant.Class.create(enchant.Sprite, {
  initialize: function (x, y) {
    enchant.Sprite.call(this, 16, 16);
    this.image = leap2dAction.core.assets.map;
    this.frame = 2;
    this.x = x;
    this.y = y;
  },
  destroy: function (index, callback) {
    if (this.parentNode != null) {
      this.remove();
      leap2dAction.collision[this.x / 16][this.y / 16] = 0;

      var frame = 0;
      var block = new this.constructor(this.x, this.y);
      leap2dAction.enemies.push(block);
      var k = 0.1;
      if (index % 2 === 0) {
        k = 0.2;
      }

      block.addEventListener(enchant.Event.ENTER_FRAME, function () {
        frame++;
        this.y = k * Math.pow(frame, 2) + this.y;
        if (index < 2) {
          this.x -= frame;
        } else {
          this.x += frame;
        }
        if (this.y >= 640) {
          this.remove();
        }
      });

      callback && callback.call(block);
    }
  },
  remove: function () {
    // remove enemies element
    var index = leap2dAction.enemies.indexOf(this);
    if (~ index) {
      leap2dAction.enemies.splice(index, 1);
    }

    // remove instance from parent node
    if (this.parentNode != null) {
      this.parentNode.removeChild(this);
    }
  }
});
