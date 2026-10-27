// webpack module #981 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(509),
    a = r(15),
    o = r(11),
    s = r(85),
    n = r(2),
    u = (function () {
      function e() {}
      return (
        (e.prototype.update = function () {
          var e = this;
          try {
            var t = a.arch();
            (o.default.OS_ARCH.x64 !== t && o.default.OS_ARCH.ia32 !== t) ||
              s.autoUpdater.setFeedURL({
                provider: "spaces",
                name: "bizanalyst",
                region: "sgp1",
                path: t,
                acl: "public-read",
                channel: "latest",
              });
          } catch (e) {
            n.Log.exception(e, "Failed to set auto update url");
          }
          (this.check(),
            setInterval(function () {
              e.check();
            }, 72e5));
        }),
        (e.prototype.check = function () {
          (s.autoUpdater.addListener("update-available", function (e) {
            console.log("A new update is available");
          }),
            s.autoUpdater.addListener("update-downloaded", function (e, t, r, i, a) {
              (console.log("Update downloaded successfully"), s.autoUpdater.quitAndInstall());
            }),
            s.autoUpdater.addListener("error", function (e) {
              console.log("Error while auto updating: " + JSON.stringify(e));
            }),
            s.autoUpdater.addListener("checking-for-update", function (e) {
              console.log("checking-for-update");
            }),
            s.autoUpdater.addListener("update-not-available", function () {
              console.log("update-not-available");
            }),
            s.autoUpdater.checkForUpdates());
        }),
        (e.prototype.checkIfUpdateAvailable = function (e, t) {
          this.checkforUpdate(e, t);
        }),
        (e.prototype.checkforUpdate = function (e, t) {
          var r = this;
          !0 === t
            ? setTimeout(function () {
                (e.dispatch(i.checkForUpdate()), r.checkforUpdate(e, !1));
              }, 3e5)
            : (e.dispatch(i.checkForUpdate()),
              setInterval(function () {
                e.dispatch(i.checkForUpdate());
              }, 72e5));
        }),
        e
      );
    })();
  t.default = u;
};
