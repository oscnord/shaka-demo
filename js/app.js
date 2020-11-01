"use strict";

var manifestUri =
  "https://storage.googleapis.com/shaka-demo-assets/sintel/dash.mpd";

Object.defineProperty(HTMLMediaElement.prototype, "playing", {
  get: function () {
    return !!(
      this.currentTime > 0 &&
      !this.paused &&
      !this.ended &&
      this.readyState > 2
    );
  },
});

function initVideo() {
  // Install built-in polyfills to patch browser incompatibilities
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs
  if (shaka.Player.isBrowserSupported()) {
    // Game on!
    initPlayer();
  } else {
    // This browser does not have the minimum set of APIs
    console.error("Browser not supported!");
  }
}

async function initPlayer() {
  // Create a Player instance
  const video = document.getElementById("video");
  const player = new shaka.Player(video);
  // Set Player configs
  player.configure({
    streaming: {
      bufferingGoal: 50,
    },
  });

  // Attach player to the window to be able to access it in console
  window.player = player;
  player.addEventListener("error", onErrorEvent);

  // Try loading manifest
  try {
    await player.load(manifestUri);
    console.log("The video has been loaded!");
  } catch (e) {
    // onError if the asynchronous load fails
    onError(e);
  }
}

function onErrorEvent(event) {
  onError(event.detail);
}

function onError(e) {
  console.error("Error code", e.code, "object", e);
}
document.addEventListener("DOMContentLoaded", initVideo);
const eventManager = new shaka.util.EventManager();
