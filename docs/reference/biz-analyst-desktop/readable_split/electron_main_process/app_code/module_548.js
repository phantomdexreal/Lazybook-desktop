// webpack module #548 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(5),
    a = r(28),
    o = r(2),
    s = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            i.Master.compare(this.partyName, e.partyName) &&
            i.Master.compare(this.addressList, e.addressList) &&
            i.Master.compare(this.vatNoList, e.vatNoList) &&
            i.Master.compare(this.cstNo, e.cstNo) &&
            i.Master.compare(this.gstNo, e.gstNo) &&
            i.Master.compare(this.stateName, e.stateName) &&
            i.Master.compare(this.pincode, e.pincode) &&
            i.Master.compare(this.consigneeMailingName, e.consigneeMailingName) &&
            i.Master.compare(this.country, e.country)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((o.Util.assign(r, t), o.Util.isNotNull(t.addressList) && t.addressList.length > 0)) {
            r.addressList = [];
            for (var i = 0, s = t.addressList; i < s.length; i++) {
              var n = s[i];
              r.addressList.push(a.StringItem.toObject(n));
            }
          }
          if (o.Util.isNotNull(t.vatNoList) && t.vatNoList.length > 0) {
            r.vatNoList = [];
            for (var u = 0, p = t.vatNoList; u < p.length; u++) {
              var c = p[u];
              r.vatNoList.push(a.StringItem.toObject(c));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var i = new e(),
            a = o.TallyUtil.getStringValue(t, "basicbuyername");
          null != a && (i.partyName = a);
          var s;
          null != (s = o.TallyUtil.getAddressValue(t, "basicbuyeraddress.list")) &&
            (i.addressList = s);
          var n;
          null != (n = o.TallyUtil.getConsigneeVatNo(t, "udf:traderconsvattinno.list")) &&
            (i.vatNoList = n);
          var u = o.TallyUtil.getStringValue(t, "consigneecstnumber");
          null != u && (i.cstNo = u);
          var p = o.TallyUtil.getStringValue(t, "consigneegstin");
          null != p && (i.gstNo = p);
          var c = o.TallyUtil.getStringValue(t, "consigneestatename");
          null != c && (i.stateName = c);
          var m = o.TallyUtil.getStringValue(t, "consigneepincode");
          return (
            null != m && (i.pincode = m),
            (i.consigneeMailingName = o.TallyUtil.getStringValue(t, "consigneemailingname")),
            (i.country = o.TallyUtil.getStringValue(t, "consigneecountryname")),
            i
          );
        }),
        e
      );
    })();
  t.default = s;
};
