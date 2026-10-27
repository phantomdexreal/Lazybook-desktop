// webpack module #28 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(674);
  t.AppVersion = i.default;
  var a = r(675);
  t.AuthObject = a.default;
  var o = r(676);
  t.BackgroundSync = o.default;
  var s = r(503);
  t.ChunkData = s.default;
  var n = r(948);
  t.CommonResponse = n.default;
  var u = r(949);
  t.CompanyLastSync = u.default;
  var p = r(950);
  t.DataUploadLog = p.default;
  var c = r(195);
  t.Device = c.default;
  var m = r(504);
  t.ErrorMessage = m.default;
  var l = r(505);
  t.NotificationSettings = l.default;
  var d = r(951);
  t.Partner = d.default;
  var y = r(196);
  t.ProxySetting = y.default;
  var b = r(952);
  t.Response = b.default;
  var h = r(506);
  t.RestartApp = h.default;
  var g = r(953);
  t.ServerTime = g.default;
  var S = r(96);
  t.StringItem = S.default;
  var f = r(507);
  t.Subscription = f.default;
  var A = r(955);
  t.SyncingCompany = A.default;
  var N = r(143);
  t.SyncSettings = N.default;
  var I = r(508);
  t.TallySettings = I.default;
  var T = r(144);
  t.User = T.default;
  var M = r(195);
  t.VersionUpdate = M.default;
  var v = r(976);
  ((t.CompanySyncEvent = v.CompanySyncEvent),
    (t.MasterStats = v.MasterStats),
    (t.SyncEventPayload = v.SyncEventPayload),
    (t.VoucherStats = v.VoucherStats));
};
