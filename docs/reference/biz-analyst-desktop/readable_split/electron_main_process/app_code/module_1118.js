// webpack module #1118 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(5),
    a = r(2),
    o = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e) {
          return !!(
            i.Master.compare(this.name, e.name) &&
            i.Master.compare(this.gstin, e.gstin) &&
            i.Master.compare(this.state, e.state) &&
            i.Master.compare(this.address, e.address) &&
            i.Master.compare(this.place, e.place) &&
            i.Master.compare(this.pinCode, e.pinCode)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          return (a.Util.assign(r, t), r);
        }),
        (e.getAddressList = function (e, t, r) {
          var i;
          void 0 === r && (r = !1);
          var o = a.TallyUtil.parseArray(a.TallyUtil.getJsonValue(e, t));
          if (
            a.Util.isFilledArray(o) &&
            ((o = r ? o[0].consigneeaddress : o[0].consignoraddress), a.Util.isNotNull(o))
          )
            if (a.Util.isFilledArray(o))
              for (var s = 0, n = o; s < n.length; s++) {
                var u = n[s];
                a.Util.isNotNull(u) &&
                  "object" == typeof u &&
                  u.hasOwnProperty("$") &&
                  (a.Util.isNull(i) && (i = []), i.push(u.$));
              }
            else "object" == typeof o && o.hasOwnProperty("$") && (i = []).push(o.$);
          return i;
        }),
        (e.convert = function (t, r, i) {
          var o = new e();
          return (
            i
              ? ((o.name = a.TallyUtil.getStringValue(t, "consigneename")),
                (o.gstin = a.TallyUtil.getStringValue(t, "consigneegstin")),
                (o.state = a.TallyUtil.getStringValue(t, "consigneestatename")),
                (o.place = a.TallyUtil.getStringValue(t, "consigneeplace")),
                (o.pinCode = a.TallyUtil.getStringValue(t, "consigneepincode")),
                (o.address = e.getAddressList(t, "consigneeaddress.list", !0)))
              : ((o.name = a.TallyUtil.getStringValue(t, "consignorname")),
                (o.gstin = a.TallyUtil.getStringValue(t, "consignorgstin")),
                (o.state = a.TallyUtil.getStringValue(t, "consignorstatename")),
                (o.place = a.TallyUtil.getStringValue(t, "consignorplace")),
                (o.pinCode = a.TallyUtil.getStringValue(t, "consignorpincode")),
                (o.address = e.getAddressList(t, "consignoraddress.list"))),
            o
          );
        }),
        e
      );
    })();
  t.default = o;
};
