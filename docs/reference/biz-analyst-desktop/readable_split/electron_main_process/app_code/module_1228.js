// webpack module #1228 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(1229),
    a = r(2),
    o = (function () {
      function e() {}
      return (
        (e.prototype.convertDataIfGroupSMSOutKeyFound = function (e) {
          if (a.Util.isFilledArray(e.groupsmsoutstandingdetails)) {
            ((e.dspaccinfo = []), (e.dspaccname = []));
            for (var t = 0, r = e.groupsmsoutstandingdetails; t < r.length; t++) {
              var i = r[t];
              (a.Util.isNotNull(i.dspaccname) && e.dspaccname.push(i.dspaccname),
                a.Util.isNotNull(i.dspaccinfo) && e.dspaccinfo.push(i.dspaccinfo));
            }
          }
          return e;
        }),
        (e.prototype.parseLedgerDetails = function (e, t) {
          var r = "Ledger closing sync ";
          a.Log.debug(r + " Date " + JSON.stringify(e) + " Parse JSON " + JSON.stringify(t));
          var o = [];
          if (a.Util.isNotNull(t) && a.Util.isNotNull(t.envelope)) {
            var s = t.envelope;
            this.convertDataIfGroupSMSOutKeyFound(s);
            var n = [],
              u = [];
            if (
              (a.Util.isNotNull(s) &&
                a.Util.isNotNull(s.dspaccinfo) &&
                a.Util.isNotNull(s.dspaccname) &&
                (Array.isArray(s.dspaccname) &&
                  s.dspaccname.forEach(function (e) {
                    a.Util.isNotNull(e.dspdispname) && a.Util.isNotNull(e.dspdispname.flddispname)
                      ? n.push(a.TallyUtil.getStringValue(e.dspdispname.flddispname, "$"))
                      : n.push(a.TallyUtil.getStringValue(e.dspdispname, "$"));
                  }),
                Array.isArray(s.dspaccinfo) &&
                  s.dspaccinfo.forEach(function (e) {
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
              n.length !== u.length)
            )
              throw new Error("Data mismatch for ledger closing");
            return (
              n.forEach(function (t, r) {
                var a = u[r],
                  s = new i.default();
                ((s.name = t),
                  (s.startDate = e.startDate),
                  (s.endDate = e.endDate),
                  (s.closingBalance = a),
                  o.push(s));
              }),
              o
            );
          }
          return (a.Log.debug(r + " ledgerClosingDetails " + JSON.stringify(o)), o);
        }),
        e
      );
    })();
  t.default = o;
};
