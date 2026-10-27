// webpack module #1119 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
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
            n.Master.compare(this.name, e.name) &&
            n.Master.compare(this.addressList, e.addressList) &&
            n.Master.compare(this.state, e.state) &&
            n.Master.compare(this.country, e.country) &&
            n.Master.compare(this.pincode, e.pincode) &&
            n.Master.compare(this.phone, e.phone) &&
            n.Master.compare(this.mobile, e.mobile) &&
            n.Master.compare(this.email, e.email) &&
            n.Master.compare(this.emailCC, e.emailCC)
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
        (e.prototype.updateFromTally = function (e) {
          (this.name = e.name),
            (this.addressList = e.addressList),
            (this.state = e.state),
            (this.country = e.country),
            (this.pincode = e.pincode),
            (this.phone = e.phone),
            (this.mobile = e.mobile),
            (this.email = e.email),
            (this.emailCC = e.emailCC);
        }),
        (e.convert = function (t, r) {
          var n = new e();
          return (
            (n.name = i.TallyUtil.getStringValue(t, "ledgercontact")),
            (n.addressList = i.TallyUtil.getAddressValue(t, "address.list")),
            (n.state = i.TallyUtil.getStringValue(t, "statename")),
            (n.country = i.TallyUtil.getStringValue(t, "countryname")),
            (n.pincode = i.TallyUtil.getStringValue(t, "pincode")),
            (n.phone = i.TallyUtil.getStringValue(t, "ledgerphone")),
            (n.mobile = i.TallyUtil.getStringValue(t, "ledgermobile")),
            (n.email = i.TallyUtil.getStringValue(t, "email")),
            (n.emailCC = i.TallyUtil.getStringValue(t, "emailcc")),
            (void 0 !== n.state && null !== n.state) ||
              (n.state = i.TallyUtil.getStringValue(t, "ledstatename")),
            n
          );
        }),
        e
      );
    })();
  t.default = o;
};
