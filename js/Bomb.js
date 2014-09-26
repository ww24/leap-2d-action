/* globals enchant, leap2dAction */
/* exported Bomb */
var Bomb = enchant.Sprite.Bomb = enchant.Class.create(enchant.Sprite, {
  initialize: function () {
    enchant.Sprite.call(this, 16, 16);
    this.init();
  },
  init: function () {
    this.image = leap2dAction.core.assets.icons;
    this.frame = 24;
    // 透過率 0%
    this.opacity = 1;
  },
  explode: function (callback) {
    if (this.frame !== 24) return;

    // 爆破音の再生 (上が enchant.js 標準、下が独自実装)
    //leap2dAction.core.assets.explode_se.clone().play();
    leap2dAction.se.explode.play();

    // callback
    callback && callback.call(this);

    var that = this;

    // 透過 100%
    this.opacity = 0;
    // 爆破エフェクトに切り替え
    this.frame = 0;
    this.image = leap2dAction.core.assets.explode;
    // 爆破エフェクト
    var tl = this.tl.fadeIn(5);
    for (var i = 0; i < 4; i++) {
      tl = tl.then(this.gainFrame).delay(5);
    }
    tl.fadeOut(5)
      .delay(10)
      .then(this.init)
      .then(function () {
        that.explode_lock = false;
      });
  },
  gainFrame: function () {
    this.frame++;
  }
});
