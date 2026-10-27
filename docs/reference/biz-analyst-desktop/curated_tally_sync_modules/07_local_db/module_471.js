// webpack module #471 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(27),
    a = r(20),
    i = r(11),
    o = r(8);
  function s() {
    var e = a.platform(),
      t = "C:\\Users\\Public\\BizAnalystDesktop\\Data";
    return (
      e === o.default.OS_PLATFORM.linux
        ? (t = "/home/" + a.userInfo().username + "/Desktop/BizAnalystData")
        : e === o.default.OS_PLATFORM.macos &&
          (t = "/Users/" + a.userInfo().username + "/Desktop/BizAnalystData"),
      n.ensureDirSync(t),
      t
    );
  }
  function u() {
    var e = a.platform(),
      t = "\\";
    return (e !== o.default.OS_PLATFORM.linux && e !== o.default.OS_PLATFORM.macos) || (t = "/"), t;
  }
  (t.getDbPath = function (e, t) {
    var r = a.platform(),
      s = "C:\\Users\\Public\\BizAnalystDesktop\\Data",
      p = u();
    return (
      r === o.default.OS_PLATFORM.linux
        ? (s = "/home/" + a.userInfo().username + "/Desktop/BizAnalystData")
        : r === o.default.OS_PLATFORM.macos &&
          (s = "/Users/" + a.userInfo().username + "/Desktop/BizAnalystData"),
      i.isNotNull(e) && (s += p + e),
      i.isNotNull(t) &&
        (i.isNotNull(t.companyId) && (s += p + t.companyId),
        i.isNotNull(t.dataVersion) && (s += p + t.dataVersion)),
      n.ensureDirSync(s),
      i.isNotNull(t) ? (s += p + t.companyId) : (s += p + e),
      s
    );
  }),
    (t.getUserDataDir = function (e) {
      var t,
        r = a.platform(),
        s = "/";
      return (
        r === o.default.OS_PLATFORM.linux
          ? (t = "/home/" + a.userInfo().username + "/Desktop/BizAnalystData")
          : r === o.default.OS_PLATFORM.macos
          ? (t = "/Users/" + a.userInfo().username + "/Desktop/BizAnalystData")
          : r === o.default.OS_PLATFORM.windows &&
            ((s = "\\"), (t = "C:\\Users\\Public\\BizAnalystDesktop\\Data")),
        n.ensureDirSync(t),
        i.isNotNull(e) && (t += s + e),
        t
      );
    }),
    (t.getDataDir = s),
    (t.getLogDirectory = function () {
      var e = a.platform(),
        t = process.env.USERPROFILE + "\\AppData\\Roaming\\BizAnalystDesktop\\";
      return (
        e === o.default.OS_PLATFORM.linux
          ? (t = process.env.HOME + "/.config/BizAnalystDesktop/")
          : e === o.default.OS_PLATFORM.macos &&
            (t = "/Users/" + a.userInfo().username + "/Library/Logs/BizAnalystDesktop/"),
        n.ensureDirSync(t),
        t
      );
    }),
    (t.getAppDirectory = function () {
      return process.env.USERPROFILE + "\\AppData\\Local\\Programs\\BizAnalystDesktop\\";
    }),
    (t.getSeparator = u),
    (t.getCompanyDbFilePath = function (e, t) {
      return s() + u() + e.id + u() + t.companyId;
    });
};
