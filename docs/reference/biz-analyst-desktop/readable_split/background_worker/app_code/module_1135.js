// webpack module #1135 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = r(5),
    i = r(1136),
    o = r(86),
    s = r(1137),
    u = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            a.Master.compare(this.name, e.name) &&
            a.Master.compare(this.includeGroupList, e.includeGroupList) &&
            a.Master.compare(this.excludeGroupList, e.excludeGroupList) &&
            a.Master.compare(this.defaultAccountLedger, e.defaultAccountLedger) &&
            a.Master.compare(this.additionalLedgerList, e.additionalLedgerList)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if (
            (n.Util.assign(r, t),
            n.Util.isNotNull(t.includeGroupList) && t.includeGroupList.length > 0)
          ) {
            r.includeGroupList = [];
            for (var a = 0, u = t.includeGroupList; a < u.length; a++) {
              var p = u[a];
              r.includeGroupList.push(o.default.toObject(p));
            }
          }
          if (n.Util.isNotNull(t.excludeGroupList) && t.excludeGroupList.length > 0) {
            r.excludeGroupList = [];
            for (var c = 0, l = t.excludeGroupList; c < l.length; c++) {
              var m = l[c];
              r.excludeGroupList.push(o.default.toObject(m));
            }
          }
          if (
            (n.Util.isNotNull(t.defaultAccountLedger) &&
              (r.defaultAccountLedger = i.default.toObject(t.defaultAccountLedger)),
            n.Util.isNotNull(t.additionalLedgerList) && t.additionalLedgerList.length > 0)
          ) {
            r.additionalLedgerList = [];
            for (var d = 0, y = t.additionalLedgerList; d < y.length; d++) {
              var b = y[d];
              r.additionalLedgerList.push(s.default.toObject(b));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          ((a.name = n.TallyUtil.getStringValue(t, "classname")),
            (a.defaultAccountLedger = i.default.convert(
              n.TallyUtil.getJsonValue(t, "ledgerforinventorylist.list"),
              r,
            )));
          var u = n.TallyUtil.getJsonValue(t, "includelist.list");
          if (n.Util.isNotNull(u)) {
            var p = u.includelist;
            if (((a.includeGroupList = []), n.Util.isFilledArray(p)))
              for (var c = 0, l = p; c < l.length; c++) {
                var m = l[c];
                n.Util.isNotNull(m) && a.includeGroupList.push(new o.default(m.$));
              }
            else
              n.Util.isNotNull(p) &&
                n.Util.isNotNull(p.$) &&
                a.includeGroupList.push(new o.default(p.$));
          }
          var d = n.TallyUtil.getJsonValue(t, "excludelist.list");
          if (n.Util.isNotNull(d)) {
            var y = d.excludelist;
            if (((a.excludeGroupList = []), n.Util.isFilledArray(y)))
              for (var b = 0, h = y; b < h.length; b++) {
                var f = h[b];
                n.Util.isNotNull(f) && a.excludeGroupList.push(new o.default(f.$));
              }
            else
              n.Util.isNotNull(y) &&
                n.Util.isNotNull(y.$) &&
                a.excludeGroupList.push(new o.default(y.$));
          }
          var g = n.TallyUtil.parseArray(n.TallyUtil.getJsonValue(t, "ledgerentrieslist.list"));
          if (n.Util.isFilledArray(g)) {
            a.additionalLedgerList = [];
            for (var M = 0, S = g; M < S.length; M++) {
              var A = S[M];
              if (n.Util.isNotNull(A)) {
                var O = s.default.convert(A, r);
                a.additionalLedgerList.push(O);
              }
            }
          }
          return a;
        }),
        e
      );
    })();
  t.default = u;
};
