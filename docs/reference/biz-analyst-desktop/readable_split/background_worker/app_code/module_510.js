// webpack module #510 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(5),
    a = r(29),
    i = r(0),
    o = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            n.Master.compare(this.partyName, e.partyName) &&
            n.Master.compare(this.addressList, e.addressList) &&
            n.Master.compare(this.vatNoList, e.vatNoList) &&
            n.Master.compare(this.cstNo, e.cstNo) &&
            n.Master.compare(this.gstNo, e.gstNo) &&
            n.Master.compare(this.stateName, e.stateName) &&
            n.Master.compare(this.pincode, e.pincode) &&
            n.Master.compare(this.consigneeMailingName, e.consigneeMailingName) &&
            n.Master.compare(this.country, e.country)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((i.Util.assign(r, t), i.Util.isNotNull(t.addressList) && t.addressList.length > 0)) {
            r.addressList = [];
            for (var n = 0, o = t.addressList; n < o.length; n++) {
              var s = o[n];
              r.addressList.push(a.StringItem.toObject(s));
            }
          }
          if (i.Util.isNotNull(t.vatNoList) && t.vatNoList.length > 0) {
            r.vatNoList = [];
            for (var u = 0, p = t.vatNoList; u < p.length; u++) {
              var c = p[u];
              r.vatNoList.push(a.StringItem.toObject(c));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var n = new e(),
            a = i.TallyUtil.getStringValue(t, "basicbuyername");
          null != a && (n.partyName = a);
          var o;
          null != (o = i.TallyUtil.getAddressValue(t, "basicbuyeraddress.list")) &&
            (n.addressList = o);
          var s;
          null != (s = i.TallyUtil.getConsigneeVatNo(t, "udf:traderconsvattinno.list")) &&
            (n.vatNoList = s);
          var u = i.TallyUtil.getStringValue(t, "consigneecstnumber");
          null != u && (n.cstNo = u);
          var p = i.TallyUtil.getStringValue(t, "consigneegstin");
          null != p && (n.gstNo = p);
          var c = i.TallyUtil.getStringValue(t, "consigneestatename");
          null != c && (n.stateName = c);
          var l = i.TallyUtil.getStringValue(t, "consigneepincode");
          return (
            null != l && (n.pincode = l),
            (n.consigneeMailingName = i.TallyUtil.getStringValue(t, "consigneemailingname")),
            (n.country = i.TallyUtil.getStringValue(t, "consigneecountryname")),
            n
          );
        }),
        e
      );
    })();
  t.default = o;
};
