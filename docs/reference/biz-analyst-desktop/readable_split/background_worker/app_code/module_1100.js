// webpack module #1100 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(535),
    a = r(0),
    i = (function () {
      function e() {}
      return (
        (e.prototype.convertDataIfGroupSMSOutKeyFound = function (e) {
          if (a.Util.isFilledArray(e.groupsmsoutstandingdetails)) {
            ((e.dspaccinfo = []), (e.dspaccname = []));
            for (var t = 0, r = e.groupsmsoutstandingdetails; t < r.length; t++) {
              var n = r[t];
              (a.Util.isNotNull(n.dspaccname) && e.dspaccname.push(n.dspaccname),
                a.Util.isNotNull(n.dspaccinfo) && e.dspaccinfo.push(n.dspaccinfo));
            }
          }
          return e;
        }),
        (e.prototype.parseLedgerDetails = function (e, t) {
          var r = "Ledger closing sync ";
          a.Log.debug(r + " Date " + JSON.stringify(e) + " Parse JSON " + JSON.stringify(t));
          var i = [];
          if (a.Util.isNotNull(t) && a.Util.isNotNull(t.envelope)) {
            var o = t.envelope;
            this.convertDataIfGroupSMSOutKeyFound(o);
            var s = [],
              u = [];
            if (
              (a.Util.isNotNull(o) &&
                a.Util.isNotNull(o.dspaccinfo) &&
                a.Util.isNotNull(o.dspaccname) &&
                (Array.isArray(o.dspaccname) &&
                  o.dspaccname.forEach(function (e) {
                    a.Util.isNotNull(e.dspdispname) && a.Util.isNotNull(e.dspdispname.flddispname)
                      ? s.push(a.TallyUtil.getStringValue(e.dspdispname.flddispname, "$"))
                      : s.push(a.TallyUtil.getStringValue(e.dspdispname, "$"));
                  }),
                Array.isArray(o.dspaccinfo) &&
                  o.dspaccinfo.forEach(function (e) {
                    var t = null;
                    (a.Util.isNotNull(e.dspclcramt) &&
                      a.Util.isNotNull(e.dspclcramt.dspclcramta) &&
                      (t = a.TallyUtil.getFloatValue(e.dspclcramt.dspclcramta, "$")),
                      a.Util.isNotNull(e.dspcldramt) &&
                        a.Util.isNotNull(e.dspcldramt.dspcldramta) &&
                        (a.Util.isNotNull(t) && a.Util.isNumber(t)
                          ? (t += a.TallyUtil.getFloatValue(e.dspcldramt.dspcldramta, "$"))
                          : (t = a.TallyUtil.getFloatValue(e.dspcldramt.dspcldramta, "$"))),
                      u.push(t));
                  })),
              s.length !== u.length)
            )
              throw new Error("Data mismatch for ledger closing");
            return (
              s.forEach(function (t, r) {
                var a = u[r],
                  o = new n.default();
                ((o.name = t),
                  (o.startDate = e.startDate),
                  (o.endDate = e.endDate),
                  (o.closingBalance = a),
                  i.push(o));
              }),
              i
            );
          }
          return (a.Log.debug(r + " ledgerClosingDetails " + JSON.stringify(i)), i);
        }),
        e
      );
    })();
  t.default = i;
};
