// webpack module #1232 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var i =
    (this && this.__assign) ||
    function () {
      return (i =
        Object.assign ||
        function (e) {
          for (var t, r = 1, i = arguments.length; r < i; r++)
            for (var a in (t = arguments[r]))
              Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
          return e;
        }).apply(this, arguments);
    };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var a = r(64),
    o = r(2),
    s = (function () {
      function e() {}
      return (
        (e.prototype.getStatsNames = function (e) {
          var t = [];
          return (
            Array.isArray(e.statname) &&
              e.statname.forEach(function (e) {
                t.push(o.TallyUtil.getStringValue(e, "$"));
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
                  (o.Util.isNotNull(e.statcancelled) &&
                    (r = (r = o.TallyUtil.getStringValue(e.statcancelled, "$")).match(/\d+/)[0]),
                  o.Util.isNotNull(e.statdirect))
                ) {
                  var i = o.TallyUtil.getFloatValue(e.statdirect, "$");
                  (o.Util.isNotNull(r) && (i -= parseInt(r, 10)), t.push(i));
                }
              }),
            t
          );
        }),
        (e.prototype.mapStatsNameWithValue = function (e, t) {
          for (var r = [], i = [], s = o.Util.deepClone(t), n = t.length / e.length; s.length > 0;)
            i.push(s.splice(0, n));
          return (
            i.forEach(function (t, i) {
              t.forEach(function (t, s) {
                var n,
                  u = r[s],
                  p = o.TallyUtil.removeNoiseChars(e[i]);
                a.isUndefined(u) ? (((n = {})[p] = t), (u = n), r.push(u)) : (u[p] = t);
              });
            }),
            r
          );
        }),
        (e.prototype.filterKeysThatAllowToProccess = function (e, t, r) {
          var s = [];
          return (
            e.map(function (e, n) {
              var u = {};
              (o.Util.isFilledArray(r)
                ? r.map(function (t) {
                    e[t] > 0 && (u[t] = e[t]);
                  })
                : (u = i({}, e)),
                a.isEmpty(u) || s.push({ date: t[n], stats: u }));
            }),
            s
          );
        }),
        (e.prototype.parseVoucher = function (e, t, r) {
          if (!o.Util.isNotNull(t) || !o.Util.isNotNull(t.envelope))
            throw new Error(
              "Couldnt parse the response for tally Voucher statics " + JSON.stringify(t),
            );
          var i = t.envelope;
          if (
            o.Util.isNotNull(i) &&
            o.Util.isNotNull(i.statname) &&
            o.Util.isNotNull(i.statvalue)
          ) {
            var a, s, n;
            if (
              ((a = this.getStatsNames(i)),
              (s = this.getStatsValues(i)).length / e.length !== a.length)
            )
              throw new Error("Data mismatch");
            return (
              (n = this.mapStatsNameWithValue(a, s)),
              this.filterKeysThatAllowToProccess(n, e, r)
            );
          }
        }),
        e
      );
    })();
  t.default = s;
};
