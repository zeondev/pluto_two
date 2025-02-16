let lib = {};
let core = {};
if (!core.windowsList) core.windowsList = [];

export default {
  setStatus: function (data) {
    let player = {};
    if (sessionStorage.getItem("player")) {
      player = JSON.parse(sessionStorage.getItem("player"));
    }
    player = {
      pid: data.pid,
      coverArt: data.coverArt,
      mediaName: data.mediaName,
      mediaAuthor: data.mediaAuthor,
      appName: data.appName,
      controls: data.controls,
    };
    console.log(player);
    sessionStorage.setItem("player", JSON.stringify(player));
    addEventListener("beforeunload", () => {
      player = {};
      console.log(player);
      sessionStorage.setItem("player", JSON.stringify(player));
    });
  },
  disposePlayer: function () {
    let player = {};
    player = {};
    console.log(player);
    sessionStorage.setItem("player", JSON.stringify(player));
  },
};
