/* globals enchant, leap2dAction */
/* exported Goal */
var Goal = enchant.Sprite.Goal = enchant.Class.create(enchant.Sprite, {
  initialize: function (x, y) {
    enchant.Sprite.call(this, 16, 16);
    this.image = leap2dAction.core.assets.map;
    this.frame = 18;
    this.x = x;
    this.y = y;
  },
  remove: function () {
    if (this.parentNode != null) {
      this.parentNode.removeChild(this);
    }
  }
});
