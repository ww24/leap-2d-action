/**
 * Audio Element Wrapper
 *
 */

function AudioController() {
  var ac = this;

  this.ready = false;
  var urls = [].slice.call(arguments);

  var audio = this.element = document.createElement("audio");
  audio.preload = "auto";
  urls.forEach(function (url) {
    var source = document.createElement("source");
    source.src = url;
    audio.appendChild(source);
  });
  audio.onload = function () {
    console.log("loaded");
    ac.ready = true;
  };
}

AudioController.prototype.play = function () {
  this.element.pause();
  this.element.currentTime = 0;
  this.element.play();
};
