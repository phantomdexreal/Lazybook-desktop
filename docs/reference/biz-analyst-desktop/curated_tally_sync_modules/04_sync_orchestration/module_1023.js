// webpack module #1023 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(199),
    a = r(108),
    i = r(7),
    o = r(8),
    s = r(101),
    u = r(109),
    p = r(15),
    c = r(0),
    l = (function () {
      function e() {
        (this.isPinging = !1), (this.pingFailureCount = 0);
      }
      return (
        (e.getInstance = function () {
          return c.Util.isNull(e.instance) && (e.instance = new e()), e.instance;
        }),
        (e.prototype.startSync = function (e) {
          var t = this;
          (this.syncCallback = e),
            p.ipcMain.on("sync-completed-callback", function (e, r) {
              t.stopSync();
            }),
            (this.backgroundWin = new p.BrowserWindow({
              width: 250,
              height: 250,
              show: !1,
              webPreferences: { nodeIntegration: !0 },
            }));
          var r = i.join(__dirname, "./electron/background/background.html");
          this.backgroundWin.loadURL("file://" + r),
            p.ipcMain.on("ping-response", function (e, r) {
              t.pingResponse = r;
            }),
            this.pingBackgroudForever(),
            p.globalShortcut.register("CommandOrControl+Alt+Shift+B", function () {
              c.Util.isNotNull(t.backgroundWin) &&
                t.backgroundWin.webContents.openDevTools({ mode: "detach" });
            }),
            this.backgroundWin.on("closed", function () {
              t.backgroundWin = null;
            });
        }),
        (e.prototype.stopSync = function () {
          c.Log.info("Stopping the sync process"),
            (this.isPinging = !1),
            c.Util.isNotNull(this.backgroundWin) &&
              (this.backgroundWin.close(),
              p.globalShortcut.unregister("CommandOrControl+Shift+D+E+B")),
            c.Util.isNotNull(this.syncCallback) && this.syncCallback(void 0),
            p.ipcMain.removeAllListeners("ping-response"),
            p.ipcMain.removeAllListeners("sync-completed-callback"),
            u.default
              .getInstance()
              .getStore()
              .dispatch(a.setCurrentlySyncingCompany(void 0)),
            s.default.send(o.default.EVENTS.COMPANY_SYNC_STATUS_RESPONSE, void 0);
        }),
        (e.prototype.isSyncing = function () {
          return c.Util.isNotNull(this.backgroundWin);
        }),
        (e.prototype.pingBackgroudForever = function () {
          var e = this;
          (this.isPinging = !0),
            (this.pingFailureCount = 0),
            c.Log.info("Starting background ping"),
            n.forever(
              function (t) {
                setTimeout(function () {
                  !1 !== e.isPinging
                    ? (s.default.send("ping-request", "ping-response"),
                      setTimeout(function () {
                        e.checkPingResponse(), t(void 0);
                      }, 1e4))
                    : t("Stopping ping");
                }, 6e4);
              },
              function (e) {
                c.Log.info("Stopping background ping");
              }
            );
        }),
        (e.prototype.checkPingResponse = function () {
          c.Util.isNull(this.pingResponse)
            ? (this.pingFailureCount++,
              c.Log.info("Failed background ping: " + this.pingFailureCount),
              this.pingFailureCount > 4 &&
                (c.Log.info("Terminating the sync process since we are not able to ping it"),
                this.stopSync()))
            : (this.pingFailureCount = 0),
            (this.pingResponse = void 0);
        }),
        e
      );
    })();
  t.default = l;
};
