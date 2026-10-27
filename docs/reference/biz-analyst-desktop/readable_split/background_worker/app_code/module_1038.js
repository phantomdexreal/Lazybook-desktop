// webpack module #1038 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = r(5),
    i = r(86),
    o = (function () {
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
          if ((n.Util.assign(r, t), n.Util.isNotNull(t.addressList) && t.addressList.length > 0)) {
            r.addressList = [];
            for (var a = 0, o = t.addressList; a < o.length; a++) {
              var s = o[a];
              r.addressList.push(i.default.toObject(s));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          return (
            (a.addressList = n.TallyUtil.getAddressValue(t, "address.list")),
            n.Util.isNotNull(r) &&
            n.Util.isNotNull(r.company) &&
            n.Util.isNotNull(r.company.timezone)
              ? (a.applicableFrom = n.TallyUtil.parseDate(
                  n.TallyUtil.getJsonValue(t, "applicablefrom"),
                  n.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone,
                ))
              : (a.applicableFrom = n.TallyUtil.parseDate(
                  n.TallyUtil.getJsonValue(t, "applicablefrom"),
                  n.DateUtil.FORMAT_YYYYMMDD,
                )),
            (a.pinCode = n.TallyUtil.getStringValue(t, "pincode")),
            (a.name = n.TallyUtil.getStringValue(t, "mailingname")),
            (a.state = n.TallyUtil.getStringValue(t, "state")),
            (a.country = n.TallyUtil.getStringValue(t, "country")),
            a
          );
        }),
        e
      );
    })();
  t.default = o;
};
