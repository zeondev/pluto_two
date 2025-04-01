const oldConsole = console;

let log = [];
window.log = log;

let pushEvent = () => {
  document.dispatchEvent(
    new CustomEvent("pluto.consoleEvent", {
      detail: "refreshList",
    })
  );
};

const newConsole = {
  assert: (a) => {
    oldConsole.assert(a);
    log.push({
      type: "",
      content: a,
    });
    pushEvent();
  },
  clear: (a) => {
    oldConsole.clear(a);
    log.push({
      type: "clear",
      content: a,
    });
    pushEvent();
  },
  count: (a) => {
    oldConsole.count(a);
    log.push({
      type: "count",
      content: a,
    });
    pushEvent();
  },
  countReset: (a) => {
    oldConsole.countReset(a);
    log.push({
      type: "countReset",
      content: a,
    });
    pushEvent();
  },
  debug: (a) => {
    oldConsole.debug(a);
    log.push({
      type: "debug",
      content: a,
    });
    pushEvent();
  },
  dir: (a) => {
    oldConsole.dir(a);
    log.push({
      type: "dir",
      content: a,
    });
    pushEvent();
  },
  dirxml: (a) => {
    oldConsole.dirxml(a);
    log.push({
      type: "dirxml",
      content: a,
    });
    pushEvent();
  },
  error: (a) => {
    oldConsole.error(a);
    log.push({
      type: "error",
      content: a,
    });
    pushEvent();
  },
  exception: (a) => {
    oldConsole.exception(a);
    log.push({
      type: "exception",
      content: a,
    });
    pushEvent();
  },
  group: (a) => {
    oldConsole.group(a);
    log.push({
      type: "group",
      content: a,
    });
    pushEvent();
  },
  groupCollapsed: (a) => {
    oldConsole.groupCollapsed(a);
    log.push({
      type: "groupCollapsed",
      content: a,
    });
    pushEvent();
  },
  groupEnd: (a) => {
    oldConsole.groupEnd(a);
    log.push({
      type: "groupEnd",
      content: a,
    });
    pushEvent();
  },
  info: (a) => {
    oldConsole.info(a);
    log.push({
      type: "info",
      content: a,
    });
    pushEvent();
  },
  log: (a) => {
    oldConsole.log(a);
    log.push({
      type: "log",
      content: a,
    });
    pushEvent();
  },
  profile: (a) => {
    oldConsole.profile(a);
    log.push({
      type: "profile",
      content: a,
    });
    pushEvent();
  },
  profileEnd: (a) => {
    oldConsole.profileEnd(a);
    log.push({
      type: "profileEnd",
      content: a,
    });
    pushEvent();
  },
  table: (a) => {
    oldConsole.table(a);
    log.push({
      type: "table",
      content: a,
    });
    pushEvent();
  },
  time: (a) => {
    oldConsole.time(a);
    log.push({
      type: "time",
      content: a,
    });
    pushEvent();
  },
  timeEnd: (a) => {
    oldConsole.timeEnd(a);
    log.push({
      type: "timeEnd",
      content: a,
    });
    pushEvent();
  },
  timeLog: (a) => {
    oldConsole.timeLog(a);
    log.push({
      type: "timeLog",
      content: a,
    });
    pushEvent();
  },
  timeStamp: (a) => {
    oldConsole.timeStamp(a);
    log.push({
      type: "timeStamp",
      content: a,
    });
    pushEvent();
  },
  trace: (a) => {
    oldConsole.trace(a);
    log.push({
      type: "trace",
      content: a,
    });
    pushEvent();
  },
  warn: (a) => {
    oldConsole.warn(a);
    log.push({
      type: "warn",
      content: a,
    });
    pushEvent();
  },
};

window.console = newConsole;
