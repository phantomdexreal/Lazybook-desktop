// webpack module #541 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(26),
    a = r(109),
    i = r(0),
    o = r(15),
    s = (function () {
      function e() {}
      return (
        (e.getInstance = function () {
          return (i.Util.isNull(e.instance) && (e.instance = new e()), e.instance);
        }),
        (e.prototype.saveNotificationSettings = function (e) {
          return (n.default.set(n.default.NOTIFICATION_SETTINGS, e), e);
        }),
        (e.sendNotification = function (e) {
          o.Notification.isSupported()
            ? new o.Notification(e).show()
            : i.Log.info("Notification api is not supported on this platform");
        }),
        (e.prototype.setInternetNotConnectedInterval = function () {
          var t = a.default.getInstance().getStoreState().notification.notificationSettings;
          if (
            i.Util.isNotNull(t) &&
            !0 === t.enableNotifications &&
            i.Util.isNull(this.internetNotConnectedInterval)
          ) {
            var r = {
              title: "Biz Analyst not able to sync data",
              body: "Your internet is acting up. Please check your internet connection for Biz Analyst to start syncing again.",
            };
            (e.sendNotification(r),
              (this.internetNotConnectedInterval = setInterval(function () {
                e.sendNotification(r);
              }, t.notifyInterval)));
          }
        }),
        (e.prototype.clearInternetNotConnectedInterval = function () {
          i.Util.isNotNull(this.internetNotConnectedInterval) &&
            (clearInterval(this.internetNotConnectedInterval),
            (this.internetNotConnectedInterval = null));
        }),
        (e.prototype.setDateTimeErrorInterval = function () {
          var t = a.default.getInstance().getStoreState().notification.notificationSettings;
          if (
            i.Util.isNotNull(t) &&
            !0 === t.enableNotifications &&
            i.Util.isNull(this.dateTimeErrorInterval)
          ) {
            var r = {
              title: "Biz Analyst not able to sync data",
              body: "Your computer's date and time settings are not right. Please open Biz Analyst application to find instructions to fix it.",
            };
            (e.sendNotification(r),
              (this.dateTimeErrorInterval = setInterval(function () {
                e.sendNotification(r);
              }, t.notifyInterval)));
          }
        }),
        (e.prototype.clearDateTimeErrorInterval = function () {
          i.Util.isNotNull(this.dateTimeErrorInterval) &&
            (clearInterval(this.dateTimeErrorInterval), (this.dateTimeErrorInterval = null));
        }),
        (e.prototype.setTallyNotConnectedInterval = function () {
          var t = a.default.getInstance().getStoreState(),
            r = t.notification.notificationSettings,
            n = t.tally.tallyConfig;
          if (
            i.Util.isNotNull(r) &&
            !0 === r.enableNotifications &&
            i.Util.isNull(this.tallyNotConnectedInterval)
          ) {
            var o = {
              title: "Biz Analyst not able to sync data",
              body:
                "Biz Analyst is not connected to your Tally ERP 9 on host: " +
                n.host +
                " and port: " +
                n.port,
            };
            (e.sendNotification(o),
              (this.tallyNotConnectedInterval = setInterval(function () {
                e.sendNotification(o);
              }, r.notifyInterval)));
          }
        }),
        (e.prototype.clearTallyNotConnectedInterval = function () {
          i.Util.isNotNull(this.tallyNotConnectedInterval) &&
            (clearInterval(this.tallyNotConnectedInterval),
            (this.tallyNotConnectedInterval = null));
        }),
        e
      );
    })();
  t.default = s;
};
