// webpack module #1033 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(5),
    a = r(0),
    i = r(86),
    o = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            n.Master.compare(this.name, e.name) &&
            n.Master.compare(this.addressList, e.addressList) &&
            n.Master.compare(this.state, e.state) &&
            n.Master.compare(this.pincode, e.pincode) &&
            n.Master.compare(this.place, e.place)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((a.Util.assign(r, t), a.Util.isNotNull(t.addressList) && t.addressList.length > 0)) {
            r.addressList = [];
            for (var n = 0, o = t.addressList; n < o.length; n++) {
              var s = o[n];
              r.addressList.push(i.default.toObject(s));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var n = new e();
          return (
            (n.name = a.TallyUtil.getStringValue(t, "dispatchfromname")),
            (n.addressList = a.TallyUtil.getAddressValue(t, "dispatchfromaddress.list")),
            (n.state = a.TallyUtil.getStringValue(t, "dispatchfromstatename")),
            (n.pincode = a.TallyUtil.getStringValue(t, "dispatchfrompincode")),
            (n.place = a.TallyUtil.getStringValue(t, "dispatchfromplace")),
            n
          );
        }),
        e
      );
    })();
  t.default = o;
};
