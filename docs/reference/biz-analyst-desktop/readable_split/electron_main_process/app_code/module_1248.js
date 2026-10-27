// webpack module #1248 (from electron_main_process, BA Mobile Connector 8.4.41)
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
            i.Master.compare(this.name, e.name) &&
            i.Master.compare(this.addressList, e.addressList) &&
            i.Master.compare(this.state, e.state) &&
            i.Master.compare(this.country, e.country) &&
            i.Master.compare(this.pincode, e.pincode) &&
            i.Master.compare(this.phone, e.phone) &&
            i.Master.compare(this.mobile, e.mobile) &&
            i.Master.compare(this.email, e.email) &&
            i.Master.compare(this.emailCC, e.emailCC)
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
        (e.prototype.updateFromTally = function (e) {
          ((this.name = e.name),
            (this.addressList = e.addressList),
            (this.state = e.state),
            (this.country = e.country),
            (this.pincode = e.pincode),
            (this.phone = e.phone),
            (this.mobile = e.mobile),
            (this.email = e.email),
            (this.emailCC = e.emailCC));
        }),
        (e.convert = function (t, r) {
          var i = new e();
          return (
            (i.name = o.TallyUtil.getStringValue(t, "ledgercontact")),
            (i.addressList = o.TallyUtil.getAddressValue(t, "address.list")),
            (i.state = o.TallyUtil.getStringValue(t, "statename")),
            (i.country = o.TallyUtil.getStringValue(t, "countryname")),
            (i.pincode = o.TallyUtil.getStringValue(t, "pincode")),
            (i.phone = o.TallyUtil.getStringValue(t, "ledgerphone")),
            (i.mobile = o.TallyUtil.getStringValue(t, "ledgermobile")),
            (i.email = o.TallyUtil.getStringValue(t, "email")),
            (i.emailCC = o.TallyUtil.getStringValue(t, "emailcc")),
            (void 0 !== i.state && null !== i.state) ||
              (i.state = o.TallyUtil.getStringValue(t, "ledstatename")),
            i
          );
        }),
        e
      );
    })();
  t.default = s;
};
