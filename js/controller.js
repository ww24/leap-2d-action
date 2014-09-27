/* globals Leap, leap2dAction */
/**
 * 2D Action Game: Leap Motion Controller
 * with enchant.js
 * require V2 SDK
 * namespace leap2dAction
 */

// var fpsDisplay = document.getElementById('leapFPS');
// var handCountDisplay = document.getElementById('handCount');

var controller = new Leap.Controller();
//controller.use("screenPosition", {scale: 0.2});

// capture event listener
controller.on("frame", function (frame) {
  // fpsDisplay.innerText = frame.currentFrameRate;
  // handCountDisplay.innerText = frame.hands.length;

  // 手の数分走査
  frame.hands.forEach(function (hand) {
    // 伸びている指の数を取得
    var extendedFingerSize = hand.fingers.filter(function (finger) {
      // 指の伸びフラグ
      return finger.extended;
    }).length;

    if (leap2dAction.bomb.frame === 24) {
      // 手を握った状態
      if (extendedFingerSize === 0) {
        // 爆発
        leap2dAction.bomb.explode(leap2dAction.afterExplode);
      }

      // 手の位置取得
      var pos = hand.palmPosition.slice(0, 2);
      var screenPos = {
        x: Math.floor(300 + pos[0]),
        y: Math.floor(640 - pos[1])
      };

      // 位置反映
      if (screenPos.x >= 0 && screenPos.x < leap2dAction.core.width - 16 && screenPos.y >= 0 && screenPos.y < leap2dAction.core.height - 16) {
        leap2dAction.bomb.x = screenPos.x;
        leap2dAction.bomb.y = screenPos.y;
      }
    }
  });
});

controller.connect();
