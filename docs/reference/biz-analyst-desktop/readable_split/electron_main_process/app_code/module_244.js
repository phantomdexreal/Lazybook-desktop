// webpack module #244 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(24),
    a = r(101),
    o = r(2),
    s = r(13),
    n = (function () {
      function e() {}
      return (
        (e.getInstance = function () {
          return (o.Util.isNull(e.instance) && (e.instance = new e()), e.instance);
        }),
        (e.prototype.saveNotificationSettings = function (e) {
          return (i.default.set(i.default.NOTIFICATION_SETTINGS, e), e);
        }),
        (e.sendNotification = function (e) {
          s.Notification.isSupported()
            ? new s.Notification(e).show()
            : o.Log.info("Notification api is not supported on this platform");
        }),
        (e.prototype.setInternetNotConnectedInterval = function () {
          var t = a.default.getInstance().getStoreState().notification.notificationSettings;
          if (
            o.Util.isNotNull(t) &&
            !0 === t.enableNotifications &&
            o.Util.isNull(this.internetNotConnectedInterval)
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
          o.Util.isNotNull(this.internetNotConnectedInterval) &&
            (clearInterval(this.internetNotConnectedInterval),
            (this.internetNotConnectedInterval = null));
        }),
        (e.prototype.setDateTimeErrorInterval = function () {
          var t = a.default.getInstance().getStoreState().notification.notificationSettings;
          if (
            o.Util.isNotNull(t) &&
            !0 === t.enableNotifications &&
            o.Util.isNull(this.dateTimeErrorInterval)
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
          o.Util.isNotNull(this.dateTimeErrorInterval) &&
            (clearInterval(this.dateTimeErrorInterval), (this.dateTimeErrorInterval = null));
        }),
        (e.prototype.setTallyNotConnectedInterval = function () {
          var t = a.default.getInstance().getStoreState(),
            r = t.notification.notificationSettings,
            i = t.tally.tallyConfig;
          if (
            o.Util.isNotNull(r) &&
            !0 === r.enableNotifications &&
            o.Util.isNull(this.tallyNotConnectedInterval)
          ) {
            var s = {
              title: "Biz Analyst not able to sync data",
              body:
                "Biz Analyst is not connected to your Tally ERP 9 on host: " +
                i.host +
                " and port: " +
                i.port,
            };
            (e.sendNotification(s),
              (this.tallyNotConnectedInterval = setInterval(function () {
                e.sendNotification(s);
              }, r.notifyInterval)));
          }
        }),
        (e.prototype.clearTallyNotConnectedInterval = function () {
          o.Util.isNotNull(this.tallyNotConnectedInterval) &&
            (clearInterval(this.tallyNotConnectedInterval),
            (this.tallyNotConnectedInterval = null));
        }),
        e
      );
    })();
  t.default = n;
};
