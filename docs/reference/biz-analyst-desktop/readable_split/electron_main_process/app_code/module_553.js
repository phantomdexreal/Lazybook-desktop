// webpack module #553 (from electron_main_process, BA Mobile Connector 8.4.41)
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
            i.Master.compare(this.addressList, e.addressList) &&
            i.Master.compare(this.vatNo, e.vatNo) &&
            i.Master.compare(this.cstNo, e.cstNo) &&
            i.Master.compare(this.pincode, e.pincode) &&
            i.Master.compare(this.state, e.state) &&
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
          return r;
        }),
        (e.convert = function (t, r, i) {
          var a,
            s = new e();
          null != (a = o.TallyUtil.getAddressValue(t, "address.list")) && (s.addressList = a);
          var n = o.TallyUtil.getStringValue(t, "buyerscstnumber");
          null != n && (s.cstNo = n);
          var u = o.TallyUtil.getStringValue(t, "basicbuyerssalestaxno");
          null != u && (s.vatNo = u);
          var p = o.TallyUtil.getStringValue(t, "partypincode");
          return (
            null != p && (s.pincode = p),
            (s.state = o.TallyUtil.getStringValue(t, "statename")),
            (s.country = o.TallyUtil.getStringValue(t, "countryofresidence")),
            s
          );
        }),
        e
      );
    })();
  t.default = s;
};
