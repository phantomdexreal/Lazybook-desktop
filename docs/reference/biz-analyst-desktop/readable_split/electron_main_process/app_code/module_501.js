// webpack module #501 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(22),
    a = r(15),
    o = r(10),
    s = r(11);
  function n() {
    var e = a.platform(),
      t = "C:\\Users\\Public\\BizAnalystDesktop\\Data";
    return (
      e === s.default.OS_PLATFORM.linux
        ? (t = "/home/" + a.userInfo().username + "/Desktop/BizAnalystData")
        : e === s.default.OS_PLATFORM.macos &&
          (t = "/Users/" + a.userInfo().username + "/Desktop/BizAnalystData"),
      i.ensureDirSync(t),
      t
    );
  }
  function u() {
    var e = a.platform(),
      t = "\\";
    return (
      (e !== s.default.OS_PLATFORM.linux && e !== s.default.OS_PLATFORM.macos) || (t = "/"),
      t
    );
  }
  ((t.getDbPath = function (e, t) {
    var r = a.platform(),
      n = "C:\\Users\\Public\\BizAnalystDesktop\\Data",
      p = u();
    return (
      r === s.default.OS_PLATFORM.linux
        ? (n = "/home/" + a.userInfo().username + "/Desktop/BizAnalystData")
        : r === s.default.OS_PLATFORM.macos &&
          (n = "/Users/" + a.userInfo().username + "/Desktop/BizAnalystData"),
      o.isNotNull(e) && (n += p + e),
      o.isNotNull(t) &&
        (o.isNotNull(t.companyId) && (n += p + t.companyId),
        o.isNotNull(t.dataVersion) && (n += p + t.dataVersion)),
      i.ensureDirSync(n),
      o.isNotNull(t) ? (n += p + t.companyId) : (n += p + e),
      n
    );
  }),
    (t.getUserDataDir = function (e) {
      var t,
        r = a.platform(),
        n = "/";
      return (
        r === s.default.OS_PLATFORM.linux
          ? (t = "/home/" + a.userInfo().username + "/Desktop/BizAnalystData")
          : r === s.default.OS_PLATFORM.macos
            ? (t = "/Users/" + a.userInfo().username + "/Desktop/BizAnalystData")
            : r === s.default.OS_PLATFORM.windows &&
              ((n = "\\"), (t = "C:\\Users\\Public\\BizAnalystDesktop\\Data")),
        i.ensureDirSync(t),
        o.isNotNull(e) && (t += n + e),
        t
      );
    }),
    (t.getDataDir = n),
    (t.getLogDirectory = function () {
      var e = a.platform(),
        t = process.env.USERPROFILE + "\\AppData\\Roaming\\BizAnalystDesktop\\";
      return (
        e === s.default.OS_PLATFORM.linux
          ? (t = process.env.HOME + "/.config/BizAnalystDesktop/")
          : e === s.default.OS_PLATFORM.macos &&
            (t = "/Users/" + a.userInfo().username + "/Library/Logs/BizAnalystDesktop/"),
        i.ensureDirSync(t),
        t
      );
    }),
    (t.getAppDirectory = function () {
      return process.env.USERPROFILE + "\\AppData\\Local\\Programs\\BizAnalystDesktop\\";
    }),
    (t.getSeparator = u),
    (t.getCompanyDbFilePath = function (e, t) {
      return n() + u() + e.id + u() + t.companyId;
    }));
};
