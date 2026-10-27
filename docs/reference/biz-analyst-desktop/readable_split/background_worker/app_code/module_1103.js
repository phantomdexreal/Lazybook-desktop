// webpack module #1103 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var n =
    (this && this.__assign) ||
    function () {
      return (n =
        Object.assign ||
        function (e) {
          for (var t, r = 1, n = arguments.length; r < n; r++)
            for (var a in (t = arguments[r]))
              Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
          return e;
        }).apply(this, arguments);
    };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var a = r(46),
    i = r(0),
    o = (function () {
      function e() {}
      return (
        (e.prototype.getStatsNames = function (e) {
          var t = [];
          return (
            Array.isArray(e.statname) &&
              e.statname.forEach(function (e) {
                t.push(i.TallyUtil.getStringValue(e, "$"));
              }),
            t
          );
        }),
        (e.prototype.getStatsValues = function (e) {
          var t = [];
          return (
            Array.isArray(e.statvalue) &&
              e.statvalue.forEach(function (e) {
                var r = null;
                if (
                  (i.Util.isNotNull(e.statcancelled) &&
                    (r = (r = i.TallyUtil.getStringValue(e.statcancelled, "$")).match(/\d+/)[0]),
                  i.Util.isNotNull(e.statdirect))
                ) {
                  var n = i.TallyUtil.getFloatValue(e.statdirect, "$");
                  (i.Util.isNotNull(r) && (n -= parseInt(r, 10)), t.push(n));
                }
              }),
            t
          );
        }),
        (e.prototype.mapStatsNameWithValue = function (e, t) {
          for (var r = [], n = [], o = i.Util.deepClone(t), s = t.length / e.length; o.length > 0;)
            n.push(o.splice(0, s));
          return (
            n.forEach(function (t, n) {
              t.forEach(function (t, o) {
                var s,
                  u = r[o],
                  p = i.TallyUtil.removeNoiseChars(e[n]);
                a.isUndefined(u) ? (((s = {})[p] = t), (u = s), r.push(u)) : (u[p] = t);
              });
            }),
            r
          );
        }),
        (e.prototype.filterKeysThatAllowToProccess = function (e, t, r) {
          var o = [];
          return (
            e.map(function (e, s) {
              var u = {};
              (i.Util.isFilledArray(r)
                ? r.map(function (t) {
                    e[t] > 0 && (u[t] = e[t]);
                  })
                : (u = n({}, e)),
                a.isEmpty(u) || o.push({ date: t[s], stats: u }));
            }),
            o
          );
        }),
        (e.prototype.parseVoucher = function (e, t, r) {
          if (!i.Util.isNotNull(t) || !i.Util.isNotNull(t.envelope))
            throw new Error(
              "Couldnt parse the response for tally Voucher statics " + JSON.stringify(t),
            );
          var n = t.envelope;
          if (
            i.Util.isNotNull(n) &&
            i.Util.isNotNull(n.statname) &&
            i.Util.isNotNull(n.statvalue)
          ) {
            var a, o, s;
            if (
              ((a = this.getStatsNames(n)),
              (o = this.getStatsValues(n)).length / e.length !== a.length)
            )
              throw new Error("Data mismatch");
            return (
              (s = this.mapStatsNameWithValue(a, o)),
              this.filterKeysThatAllowToProccess(s, e, r)
            );
          }
        }),
        e
      );
    })();
  t.default = o;
};
