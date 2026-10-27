// webpack module #394 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(679),
    a = r(0),
    i = n.default({ encryptionKey: "g}![o0&*M&Pa`Q" }),
    o = (function () {
      function e() {}
      return (
        (e.get = function () {
          if (a.Util.isNotNull(e.userCache)) return e.userCache;
          var t = i.get("user");
          return a.Util.isNotNull(t) ? ((e.userCache = t), e.userCache) : null;
        }),
        (e.save = function (t) {
          if (a.Util.isNotNull(t)) {
            i.set("user", t);
            var r = i.get("user");
            (e.userCache = r),
              a.Util.isNotNull(r)
                ? a.Log.info("User saved successfully")
                : a.Log.warn("[WARNING]: Error saving user as user already exists.");
          }
        }),
        (e.delete = function () {
          i.delete("user");
          var t = i.get("user");
          (e.userCache = null),
            a.Util.isNotNull(t)
              ? a.Log.warn("[WARNING]: Error deleting user")
              : a.Log.info("User deleted successfully");
        }),
        (e.getToken = function () {
          if (a.Util.isNotNull(e.tokenCache)) return e.tokenCache;
          var t = i.get(e.USER_TOKEN);
          return a.Util.isNotNull(t) ? ((e.tokenCache = t), e.tokenCache) : null;
        }),
        (e.saveToken = function (t) {
          if (a.Util.isNotNull(t)) {
            i.set(e.USER_TOKEN, { time: a.DateUtil.now(), token: t });
            var r = i.get(e.USER_TOKEN);
            (e.tokenCache = r),
              a.Util.isNotNull(r)
                ? a.Log.info("Token saved successfully")
                : a.Log.warn("[WARNING]: Error saving user token");
          }
        }),
        (e.deleteToken = function () {
          i.delete(e.USER_TOKEN);
          var t = i.get(e.USER_TOKEN);
          (e.tokenCache = null),
            a.Util.isNotNull(t)
              ? a.Log.warn("[WARNING]: Error deleting token")
              : a.Log.info("User token deleted successfully");
        }),
        (e.userCache = null),
        (e.tokenCache = null),
        (e.USER_TOKEN = "userToken"),
        e
      );
    })();
  t.default = o;
};
