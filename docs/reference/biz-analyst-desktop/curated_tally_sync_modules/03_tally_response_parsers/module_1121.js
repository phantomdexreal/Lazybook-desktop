// webpack module #1121 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(0),
    a = r(5),
    i = r(28),
    o = (function () {
      function e() {}
      return (
        (e.prototype.equals = function (e, t) {
          return !!(
            a.Master.compare(this.applicableFrom, e.applicableFrom) &&
            a.Master.compare(this.priceLevel, e.priceLevel) &&
            a.Master.compare(this.priceLevelList, e.priceLevelList)
          );
        }),
        (e.toObject = function (t) {
          var r = new e();
          if (
            (n.Util.assign(r, t), n.Util.isNotNull(t.priceLevelList) && t.priceLevelList.length > 0)
          ) {
            r.priceLevelList = [];
            for (var a = 0, o = t.priceLevelList; a < o.length; a++) {
              var s = o[a];
              r.priceLevelList.push(i.PriceLevel.toObject(s));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          n.Util.isNotNull(r) && n.Util.isNotNull(r.company) && n.Util.isNotNull(r.company.timezone)
            ? (a.applicableFrom = n.TallyUtil.parseDate(
                n.TallyUtil.getStringValue(t, "date"),
                n.DateUtil.FORMAT_YYYYMMDD,
                r.company.timezone
              ))
            : (a.applicableFrom = n.TallyUtil.parseDate(
                n.TallyUtil.getStringValue(t, "date"),
                n.DateUtil.FORMAT_YYYYMMDD
              )),
            (a.priceLevel = n.TallyUtil.getStringValue(t, "pricelevel"));
          var o = n.TallyUtil.parseArray(n.TallyUtil.getJsonValue(t, "pricelevellist.list"));
          if (o.length > 0) {
            for (var s = [], u = 0; u < o.length; ++u)
              null !== o[u] && void 0 !== o[u] && s.push(i.PriceLevel.convert(o[u], r));
            a.priceLevelList = s;
          }
          return a;
        }),
        e
      );
    })();
  t.default = o;
};
