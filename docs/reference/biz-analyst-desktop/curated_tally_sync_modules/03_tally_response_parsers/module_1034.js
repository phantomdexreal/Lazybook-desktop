// webpack module #1034 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(1035),
    a = r(1036),
    i = r(0),
    o = r(5),
    s = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            o.Master.compare(this.billNo, e.billNo) &&
            o.Master.compare(this.date, e.date) &&
            o.Master.compare(this.subType, e.subType) &&
            o.Master.compare(this.documentType, e.documentType) &&
            o.Master.compare(this.status, e.status) &&
            o.Master.compare(this.consignorDetail, e.consignorDetail) &&
            o.Master.compare(this.consigneeDetail, e.consigneeDetail) &&
            o.Master.compare(this.transportDetails, e.transportDetails)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((i.Util.assign(r, t), i.Util.isFilledArray(t.transportDetails))) {
            r.transportDetails = [];
            for (var o = 0, s = t.transportDetails; o < s.length; o++) {
              var u = s[o];
              r.transportDetails.push(a.default.toObject(u));
            }
          }
          return (
            i.Util.isNotNull(t.consigneeDetail) &&
              (r.consigneeDetail = n.default.toObject(t.consigneeDetail)),
            i.Util.isNotNull(t.consignorDetail) &&
              (r.consignorDetail = n.default.toObject(t.consignorDetail)),
            r
          );
        }),
        (e.convert = function (t, r) {
          var o = new e();
          (o.billNo = i.TallyUtil.getStringValue(t, "billnumber")),
            (o.date = i.TallyUtil.parseDate(
              i.TallyUtil.getJsonValue(t, "billdate"),
              i.DateUtil.FORMAT_YYYYMMDD
            )),
            (o.subType = i.TallyUtil.getStringValue(t, "subtype")),
            (o.documentType = i.TallyUtil.getStringValue(t, "documenttype")),
            (o.status = i.TallyUtil.getStringValue(t, "billstatus")),
            (o.consigneeDetail = n.default.convert(t, r, !0)),
            (o.consignorDetail = n.default.convert(t, r));
          var s = i.TallyUtil.parseArray(i.TallyUtil.getJsonValue(t, "transportdetails.list"));
          if (i.Util.isFilledArray(s)) {
            o.transportDetails = [];
            for (var u = 0, p = s; u < p.length; u++) {
              var c = p[u];
              if (i.Util.isNotNull(c)) {
                var l = a.default.convert(c, r);
                o.transportDetails.push(l);
              }
            }
          }
          return o;
        }),
        e
      );
    })();
  t.default = s;
};
