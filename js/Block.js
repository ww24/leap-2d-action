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
  enemy: false,
  destroy: function (index, callback) {
    if (this.parentNode != null) {
      this.remove();

      var frame = 0;
      var block = new this.constructor(this.x, this.y);
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
        if (this.y > 600) {
          this.remove();
        }
      });

      callback && callback.call(block);
    }
  },
  remove: function () {
    if (this.parentNode != null) {
      this.parentNode.removeChild(this);
    }
  }
});
