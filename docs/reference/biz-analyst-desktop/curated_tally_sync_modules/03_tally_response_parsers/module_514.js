// webpack module #514 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

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
            n.Master.compare(this.addressList, e.addressList) &&
            n.Master.compare(this.vatNo, e.vatNo) &&
            n.Master.compare(this.cstNo, e.cstNo) &&
            n.Master.compare(this.pincode, e.pincode) &&
            n.Master.compare(this.state, e.state) &&
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
          return r;
        }),
        (e.convert = function (t, r, n) {
          var a,
            o = new e();
          null != (a = i.TallyUtil.getAddressValue(t, "address.list")) && (o.addressList = a);
          var s = i.TallyUtil.getStringValue(t, "buyerscstnumber");
          null != s && (o.cstNo = s);
          var u = i.TallyUtil.getStringValue(t, "basicbuyerssalestaxno");
          null != u && (o.vatNo = u);
          var p = i.TallyUtil.getStringValue(t, "partypincode");
          return (
            null != p && (o.pincode = p),
            (o.state = i.TallyUtil.getStringValue(t, "statename")),
            (o.country = i.TallyUtil.getStringValue(t, "countryofresidence")),
            o
          );
        }),
        e
      );
    })();
  t.default = o;
};
