// webpack module #1266 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = r(5),
    o = r(1267),
    s = r(96),
    n = r(1268),
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
            (i.Util.assign(r, t),
            i.Util.isNotNull(t.includeGroupList) && t.includeGroupList.length > 0)
          ) {
            r.includeGroupList = [];
            for (var a = 0, u = t.includeGroupList; a < u.length; a++) {
              var p = u[a];
              r.includeGroupList.push(s.default.toObject(p));
            }
          }
          if (i.Util.isNotNull(t.excludeGroupList) && t.excludeGroupList.length > 0) {
            r.excludeGroupList = [];
            for (var c = 0, m = t.excludeGroupList; c < m.length; c++) {
              var l = m[c];
              r.excludeGroupList.push(s.default.toObject(l));
            }
          }
          if (
            (i.Util.isNotNull(t.defaultAccountLedger) &&
              (r.defaultAccountLedger = o.default.toObject(t.defaultAccountLedger)),
            i.Util.isNotNull(t.additionalLedgerList) && t.additionalLedgerList.length > 0)
          ) {
            r.additionalLedgerList = [];
            for (var d = 0, y = t.additionalLedgerList; d < y.length; d++) {
              var b = y[d];
              r.additionalLedgerList.push(n.default.toObject(b));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          ((a.name = i.TallyUtil.getStringValue(t, "classname")),
            (a.defaultAccountLedger = o.default.convert(
              i.TallyUtil.getJsonValue(t, "ledgerforinventorylist.list"),
              r,
            )));
          var u = i.TallyUtil.getJsonValue(t, "includelist.list");
          if (i.Util.isNotNull(u)) {
            var p = u.includelist;
            if (((a.includeGroupList = []), i.Util.isFilledArray(p)))
              for (var c = 0, m = p; c < m.length; c++) {
                var l = m[c];
                i.Util.isNotNull(l) && a.includeGroupList.push(new s.default(l.$));
              }
            else
              i.Util.isNotNull(p) &&
                i.Util.isNotNull(p.$) &&
                a.includeGroupList.push(new s.default(p.$));
          }
          var d = i.TallyUtil.getJsonValue(t, "excludelist.list");
          if (i.Util.isNotNull(d)) {
            var y = d.excludelist;
            if (((a.excludeGroupList = []), i.Util.isFilledArray(y)))
              for (var b = 0, h = y; b < h.length; b++) {
                var g = h[b];
                i.Util.isNotNull(g) && a.excludeGroupList.push(new s.default(g.$));
              }
            else
              i.Util.isNotNull(y) &&
                i.Util.isNotNull(y.$) &&
                a.excludeGroupList.push(new s.default(y.$));
          }
          var S = i.TallyUtil.parseArray(i.TallyUtil.getJsonValue(t, "ledgerentrieslist.list"));
          if (i.Util.isFilledArray(S)) {
            a.additionalLedgerList = [];
            for (var f = 0, A = S; f < A.length; f++) {
              var N = A[f];
              if (i.Util.isNotNull(N)) {
                var I = n.default.convert(N, r);
                a.additionalLedgerList.push(I);
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
