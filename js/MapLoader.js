/**
 * stage map loader
 * require jquery
 */

// mv = new MapLoader("01");
function MapLoader() {}

MapLoader.prototype.load = function (stage, callback) {
  this.stage = stage;

  var instance = this;

  $.ajax({
    method: "get",
    url: "stages/" + stage + ".map.js",
    dataType: "jsonp",
    jsonpCallback: "map",
    crossDomain: true
  }).done(function (res) {
    var rows = res.trim().split("\n");
    rows = rows.map(function (row) {
      return row.split("");
    });
    // 行列入れ替え
    var map = [];
    rows.forEach(function (row, y) {
      row.forEach(function (column, x) {
        map[x] || (map[x] = []);
        map[x][y] = column;
      });
    });
    callback.call(instance, null, map);
  }).fail(function () {
    var error = new Error("loading failed");
    callback && callback.call(instance, error);
  });
};
