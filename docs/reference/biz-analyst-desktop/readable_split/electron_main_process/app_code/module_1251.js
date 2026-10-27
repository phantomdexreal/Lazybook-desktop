// webpack module #1251 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(2),
    a = r(5),
    o = r(32),
    s = (function () {
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
            (i.Util.assign(r, t), i.Util.isNotNull(t.priceLevelList) && t.priceLevelList.length > 0)
          ) {
            r.priceLevelList = [];
            for (var a = 0, s = t.priceLevelList; a < s.length; a++) {
              var n = s[a];
              r.priceLevelList.push(o.PriceLevel.toObject(n));
            }
          }
          return r;
        }),
        (e.convert = function (t, r) {
          var a = new e();
          (i.Util.isNotNull(r) &&
          i.Util.isNotNull(r.company) &&
          i.Util.isNotNull(r.company.timezone)
            ? (a.applicableFrom = i.TallyUtil.parseDate(
                i.TallyUtil.getStringValue(t, "date"),
                i.DateUtil.FORMAT_YYYYMMDD,
                r.company.timezone,
              ))
            : (a.applicableFrom = i.TallyUtil.parseDate(
                i.TallyUtil.getStringValue(t, "date"),
                i.DateUtil.FORMAT_YYYYMMDD,
              )),
            (a.priceLevel = i.TallyUtil.getStringValue(t, "pricelevel")));
          var s = i.TallyUtil.parseArray(i.TallyUtil.getJsonValue(t, "pricelevellist.list"));
          if (s.length > 0) {
            for (var n = [], u = 0; u < s.length; ++u)
              null !== s[u] && void 0 !== s[u] && n.push(o.PriceLevel.convert(s[u], r));
            a.priceLevelList = n;
          }
          return a;
        }),
        e
      );
    })();
  t.default = s;
};
