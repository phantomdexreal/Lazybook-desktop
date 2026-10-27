// webpack module #1035 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(5),
    a = r(0),
    i = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            n.Master.compare(this.name, e.name) &&
            n.Master.compare(this.gstin, e.gstin) &&
            n.Master.compare(this.state, e.state) &&
            n.Master.compare(this.address, e.address) &&
            n.Master.compare(this.place, e.place) &&
            n.Master.compare(this.pinCode, e.pinCode)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (a.Util.assign(r, t), r);
        }),
        (e.getAddressList = function (e, t, r) {
          var n;
          void 0 === r && (r = !1);
          var i = a.TallyUtil.parseArray(a.TallyUtil.getJsonValue(e, t));
          if (
            a.Util.isFilledArray(i) &&
            ((i = r ? i[0].consigneeaddress : i[0].consignoraddress), a.Util.isNotNull(i))
          )
            if (a.Util.isFilledArray(i))
              for (var o = 0, s = i; o < s.length; o++) {
                var u = s[o];
                a.Util.isNotNull(u) &&
                  "object" == typeof u &&
                  u.hasOwnProperty("$") &&
                  (a.Util.isNull(n) && (n = []), n.push(u.$));
              }
            else "object" == typeof i && i.hasOwnProperty("$") && (n = []).push(i.$);
          return n;
        }),
        (e.convert = function (t, r, n) {
          var i = new e();
          return (
            n
              ? ((i.name = a.TallyUtil.getStringValue(t, "consigneename")),
                (i.gstin = a.TallyUtil.getStringValue(t, "consigneegstin")),
                (i.state = a.TallyUtil.getStringValue(t, "consigneestatename")),
                (i.place = a.TallyUtil.getStringValue(t, "consigneeplace")),
                (i.pinCode = a.TallyUtil.getStringValue(t, "consigneepincode")),
                (i.address = e.getAddressList(t, "consigneeaddress.list", !0)))
              : ((i.name = a.TallyUtil.getStringValue(t, "consignorname")),
                (i.gstin = a.TallyUtil.getStringValue(t, "consignorgstin")),
                (i.state = a.TallyUtil.getStringValue(t, "consignorstatename")),
                (i.place = a.TallyUtil.getStringValue(t, "consignorplace")),
                (i.pinCode = a.TallyUtil.getStringValue(t, "consignorpincode")),
                (i.address = e.getAddressList(t, "consignoraddress.list"))),
            i
          );
        }),
        e
      );
    })();
  t.default = i;
};
