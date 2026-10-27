// webpack module #1116 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(5),
    a = r(2),
    o = r(96),
    s = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            i.Master.compare(this.name, e.name) &&
            i.Master.compare(this.addressList, e.addressList) &&
            i.Master.compare(this.state, e.state) &&
            i.Master.compare(this.pincode, e.pincode) &&
            i.Master.compare(this.place, e.place)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((a.Util.assign(r, t), a.Util.isNotNull(t.addressList) && t.addressList.length > 0)) {
            r.addressList = [];
            for (var i = 0, s = t.addressList; i < s.length; i++) {
              var n = s[i];
              r.addressList.push(o.default.toObject(n));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var i = new e();
          return (
            (i.name = a.TallyUtil.getStringValue(t, "dispatchfromname")),
            (i.addressList = a.TallyUtil.getAddressValue(t, "dispatchfromaddress.list")),
            (i.state = a.TallyUtil.getStringValue(t, "dispatchfromstatename")),
            (i.pincode = a.TallyUtil.getStringValue(t, "dispatchfrompincode")),
            (i.place = a.TallyUtil.getStringValue(t, "dispatchfromplace")),
            i
          );
        }),
        e
      );
    })();
  t.default = s;
};
