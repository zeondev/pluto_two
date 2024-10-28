const oldConsole = console;

let log = [];
window.log = log;

const newConsole = {
  assert: (a) => {
    oldConsole.assert(a);
    log.push({
      type: "",
      content: a,
    });
  },
  clear: (a) => {
    oldConsole.clear(a);
    log.push({
      type: "clear",
      content: a,
    });
  },
  count: (a) => {
    oldConsole.count(a);
    log.push({
      type: "count",
      content: a,
    });
  },
  countReset: (a) => {
    oldConsole.countReset(a);
    log.push({
      type: "countReset",
      content: a,
    });
  },
  debug: (a) => {
    oldConsole.debug(a);
    log.push({
      type: "debug",
      content: a,
    });
  },
  dir: (a) => {
    oldConsole.dir(a);
    log.push({
      type: "dir",
      content: a,
    });
  },
  dirxml: (a) => {
    oldConsole.dirxml(a);
    log.push({
      type: "dirxml",
      content: a,
    });
  },
  error: (a) => {
    oldConsole.error(a);
    log.push({
      type: "error",
      content: a,
    });
  },
  exception: (a) => {
    oldConsole.exception(a);
    log.push({
      type: "exception",
      content: a,
    });
  },
  group: (a) => {
    oldConsole.group(a);
    log.push({
      type: "group",
      content: a,
    });
  },
  groupCollapsed: (a) => {
    oldConsole.groupCollapsed(a);
    log.push({
      type: "groupCollapsed",
      content: a,
    });
  },
  groupEnd: (a) => {
    oldConsole.groupEnd(a);
    log.push({
      type: "groupEnd",
      content: a,
    });
  },
  info: (a) => {
    oldConsole.info(a);
    log.push({
      type: "info",
      content: a,
    });
  },
  log: (a) => {
    oldConsole.log(a);
    log.push({
      type: "log",
      content: a,
    });
  },
  profile: (a) => {
    oldConsole.profile(a);
    log.push({
      type: "profile",
      content: a,
    });
  },
  profileEnd: (a) => {
    oldConsole.profileEnd(a);
    log.push({
      type: "profileEnd",
      content: a,
    });
  },
  table: (a) => {
    oldConsole.table(a);
    log.push({
      type: "table",
      content: a,
    });
  },
  time: (a) => {
    oldConsole.time(a);
    log.push({
      type: "time",
      content: a,
    });
  },
  timeEnd: (a) => {
    oldConsole.timeEnd(a);
    log.push({
      type: "timeEnd",
      content: a,
    });
  },
  timeLog: (a) => {
    oldConsole.timeLog(a);
    log.push({
      type: "timeLog",
      content: a,
    });
  },
  timeStamp: (a) => {
    oldConsole.timeStamp(a);
    log.push({
      type: "timeStamp",
      content: a,
    });
  },
  trace: (a) => {
    oldConsole.trace(a);
    log.push({
      type: "trace",
      content: a,
    });
  },
  warn: (a) => {
    oldConsole.warn(a);
    log.push({
      type: "warn",
      content: a,
    });
  },
};

window.console = newConsole;
