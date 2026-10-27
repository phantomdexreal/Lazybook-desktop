// webpack module #1121 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = r(5),
    o = r(96),
    s = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !!(
            a.Master.compare(this.addressList, e.addressList) &&
            a.Master.compare(this.applicableFrom, e.applicableFrom) &&
            a.Master.compare(this.pinCode, e.pinCode) &&
            a.Master.compare(this.name, e.name) &&
            a.Master.compare(this.state, e.state) &&
            a.Master.compare(this.country, e.country)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if ((i.Util.assign(r, t), i.Util.isNotNull(t.addressList) && t.addressList.length > 0)) {
            r.addressList = [];
            for (var a = 0, s = t.addressList; a < s.length; a++) {
              var n = s[a];
              r.addressList.push(o.default.toObject(n));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
            (a.addressList = i.TallyUtil.getAddressValue(t, "address.list")),
            i.Util.isNotNull(r) &&
            i.Util.isNotNull(r.company) &&
            i.Util.isNotNull(r.company.timezone)
              ? (a.applicableFrom = i.TallyUtil.parseDate(
                  i.TallyUtil.getJsonValue(t, "applicablefrom"),
                  i.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone,
                ))
              : (a.applicableFrom = i.TallyUtil.parseDate(
                  i.TallyUtil.getJsonValue(t, "applicablefrom"),
                  i.DateUtil.FORMAT_YYYYMMDD,
                )),
            (a.pinCode = i.TallyUtil.getStringValue(t, "pincode")),
            (a.name = i.TallyUtil.getStringValue(t, "mailingname")),
            (a.state = i.TallyUtil.getStringValue(t, "state")),
            (a.country = i.TallyUtil.getStringValue(t, "country")),
            a
          );
        }),
        e
      );
    })();
  t.default = s;
};
