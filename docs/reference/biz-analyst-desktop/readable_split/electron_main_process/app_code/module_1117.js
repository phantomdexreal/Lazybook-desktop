// webpack module #1117 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(1118),
    a = r(1119),
    o = r(2),
    s = r(5),
    n = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            s.Master.compare(this.billNo, e.billNo) &&
            s.Master.compare(this.date, e.date) &&
            s.Master.compare(this.subType, e.subType) &&
            s.Master.compare(this.documentType, e.documentType) &&
            s.Master.compare(this.status, e.status) &&
            s.Master.compare(this.consignorDetail, e.consignorDetail) &&
            s.Master.compare(this.consigneeDetail, e.consigneeDetail) &&
            s.Master.compare(this.transportDetails, e.transportDetails)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((o.Util.assign(r, t), o.Util.isFilledArray(t.transportDetails))) {
            r.transportDetails = [];
            for (var s = 0, n = t.transportDetails; s < n.length; s++) {
              var u = n[s];
              r.transportDetails.push(a.default.toObject(u));
            }
          }
          return (
            o.Util.isNotNull(t.consigneeDetail) &&
              (r.consigneeDetail = i.default.toObject(t.consigneeDetail)),
            o.Util.isNotNull(t.consignorDetail) &&
              (r.consignorDetail = i.default.toObject(t.consignorDetail)),
            r
          );
        }),
        (e.convert = function (t, r) {
          var s = new e();
          ((s.billNo = o.TallyUtil.getStringValue(t, "billnumber")),
            (s.date = o.TallyUtil.parseDate(
              o.TallyUtil.getJsonValue(t, "billdate"),
              o.DateUtil.FORMAT_YYYYMMDD,
            )),
            (s.subType = o.TallyUtil.getStringValue(t, "subtype")),
            (s.documentType = o.TallyUtil.getStringValue(t, "documenttype")),
            (s.status = o.TallyUtil.getStringValue(t, "billstatus")),
            (s.consigneeDetail = i.default.convert(t, r, !0)),
            (s.consignorDetail = i.default.convert(t, r)));
          var n = o.TallyUtil.parseArray(o.TallyUtil.getJsonValue(t, "transportdetails.list"));
          if (o.Util.isFilledArray(n)) {
            s.transportDetails = [];
            for (var u = 0, p = n; u < p.length; u++) {
              var c = p[u];
              if (o.Util.isNotNull(c)) {
                var m = a.default.convert(c, r);
                s.transportDetails.push(m);
              }
            }
          }
          return s;
        }),
        e
      );
    })();
  t.default = n;
};
