// webpack module #891 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(86),
    a = r(0),
    i = r(45),
    o = [" ", "=", "-", "&", "(", ")", "+", ",", "/", ".", ";", "?", "{", "}", "~", "*"];
  function s(e) {
    return a.Util.isArray(e) ? e : a.Util.isObject(e) ? [e] : [];
  }
  function u(e) {
    var t = 0;
    return a.Util.isNotNull(e) && (t = Number(parseFloat(e).toFixed(4))), t;
  }
  function p(e, t, r) {
    var n;
    return (
      r
        ? a.Util.isNotNull(e) && a.Util.isNotNull(e._) && (n = e._[t])
        : a.Util.isNotNull(e) &&
          a.Util.isNotNull(e[t]) &&
          (n = a.Util.isObject(e[t]) && e[t].hasOwnProperty("$") ? e[t].$ : e[t]),
      a.Util.isNotNull(n) && a.Util.isString(n) && (n = n.replace(/\s+/g, " ").trim()),
      n
    );
  }
  function c(e, t, r, n) {
    var i = p(e, t, r);
    if (a.Util.isString(i)) {
      for (var o = "", s = 0; s < i.length; s++) l(i.charCodeAt(s)) && (o += i[s]);
      return o;
    }
    return null;
  }
  function l(e) {
    return (
      (e >= 0 && e <= 127) ||
      (e >= 1536 && e <= 1791) ||
      (e >= 2304 && e <= 3455) ||
      (e >= 8216 && e <= 8223) ||
      (e >= 8242 && e <= 8247) ||
      (e >= 8352 && e <= 8399) ||
      (e >= 8704 && e <= 8959)
    );
  }
  function m(e, t, r) {
    return a.DateUtil.parse(e, t, r);
  }
  (t.parseArray = s),
    (t.parseRate = function (e) {
      if (a.Util.isNotNull(e) && (a.Util.isString(e) || a.Util.isNumber(e))) {
        var t = e.split("="),
          r = void 0;
        (t = (r = a.Util.isNotNull(t) && 2 === t.length ? t[1] : e).split("/")),
          a.Util.isNotNull(t) && 2 === t.length && (r = t[0]);
        var n = r.trim().match(/[\d,-\.]+/g);
        if (a.Util.isNotNull(n)) {
          var i = n.join(""),
            o = i.substring(i.length - 1, i.length);
          ("." != o && "," != o) || (i = i.substring(0, i.length - 1));
          var s = i.split(".");
          return (
            a.Util.isNotNull(s) &&
              s.length > 1 &&
              (i = s.slice(0, -1).join("") + "." + s.slice(-1)),
            u(i)
          );
        }
      }
      return 0;
    }),
    (t.parseRateUnit = function (e) {
      var t = "";
      if (a.Util.isNotNull(e) && (a.Util.isString(e) || a.Util.isNumber(e))) {
        var r = e.split("=");
        (r = (a.Util.isNotNull(r) && 2 === r.length ? r[1] : e).split("/")),
          a.Util.isNotNull(r) && 2 === r.length && (t = r[1]);
      }
      return t;
    }),
    (t.parseAmount = function (e) {
      if (a.Util.isNotNull(e) && (a.Util.isString(e) || a.Util.isNumber(e))) {
        var t = e.split("="),
          r = (a.Util.isNotNull(t) && 2 === t.length ? t[1] : e).trim().match(/[\d,-\.]+/g);
        if (a.Util.isNotNull(r)) {
          var n = r.join(""),
            i = n.substring(n.length - 1, n.length);
          ("." != i && "," != i) || (n = n.substring(0, n.length - 1));
          var o = n.split(".");
          return (
            a.Util.isNotNull(o) &&
              o.length > 1 &&
              (n = o.slice(0, -1).join("") + "." + o.slice(-1)),
            u(n)
          );
        }
      }
      return 0;
    }),
    (t.parseNumber = u),
    (t.parseQuantity = function (e) {
      var t = 0;
      return a.Util.isNotNull(e) && (t = Number(parseFloat(e).toFixed(4))), t;
    }),
    (t.parseAdditionalQuantity = function (e) {
      var t = 0;
      if (a.Util.isNotNull(e) && a.Util.isString(e)) {
        var r = e.split("=");
        if (a.Util.isNotNull(r) && r.length >= 1) {
          var n = r[0],
            i = (n = n.trim()).split(" ");
          4 === i.length || 6 === i.length
            ? ((t = Number(parseFloat(i[2]).toFixed(4))),
              i[0].startsWith("-") && t > 0 && (t *= -1))
            : 5 === i.length ||
              (i.length > 5
                ? a.Log.info(
                    "Found a string of array length > 5 while parsing additionaly quantity: " + e
                  )
                : 3 === i.length &&
                  a.Log.info(
                    "Found a string of array length 3 while parsing additionaly quantity: " + e
                  ));
        } else a.Log.info(e);
      }
      return (a.Util.isNull(t) || a.Util.isNaN(t)) && (t = 0), t;
    }),
    (t.parseAlternateQuantity = function (e) {
      var t = 0;
      if (a.Util.isNotNull(e) && a.Util.isString(e)) {
        var r = e.split("=");
        2 == r.length
          ? (t = Number(parseFloat(r[1]).toFixed(4)))
          : r.length > 2 &&
            a.Log.info("Found a string of array length > 2 while parsing alternate quantity: " + e);
      }
      return (a.Util.isNull(t) || a.Util.isNaN(t)) && (t = 0), t;
    }),
    (t.getTag = function (e, t) {
      var r = p(e, t);
      return !(!a.Util.isNotNull(r) || "Yes" !== r);
    }),
    (t.getBoolean = function (e, t, r) {
      var n = p(e, t, r);
      return !(!a.Util.isNotNull(n) || "Yes" !== n);
    }),
    (t.getJsonValue = p),
    (t.getJsonValueOfTag = function (e) {
      var t;
      return (
        (t = a.Util.isObject(e) && e.hasOwnProperty("$") ? e.$ : e),
        a.Util.isNotNull(t) && a.Util.isString(t) && (t = t.replace(/\s+/g, " ").trim()),
        t
      );
    }),
    (t.getStringValue = c),
    (t.validCharacter = l),
    (t.getIntValue = function (e, t, r) {
      var n,
        i = p(e, t, r);
      return (
        a.Util.isNumber(i)
          ? (n = ~~i)
          : a.Util.isString(i) && ((i = parseInt(i)), isNaN(i) || (n = i)),
        n
      );
    }),
    (t.getFloatValue = function (e, t, r) {
      var n,
        i = p(e, t, r);
      return (
        a.Util.isNumber(i)
          ? (n = i)
          : a.Util.isString(i) && ((i = Number(parseFloat(i).toFixed(4))), isNaN(i) || (n = i)),
        n
      );
    }),
    (t.getAliasList = function (e, t, r, n) {
      var i = [],
        o = s(p(e, t));
      if (o.length > 0)
        for (var u = 0; u < o.length; ++u)
          if (null !== o[u] && void 0 !== o[u]) {
            var c = s(p(o[u], r));
            if (c.length > 0)
              for (var l = 0; l < c.length; ++l)
                if (null !== c[l] && void 0 !== c[l]) {
                  var m = p(c[l], n);
                  if (a.Util.isArray(m) || a.Util.isObject(m)) {
                    if (((m = s(m)), a.Util.isNotNull(m)))
                      for (var d = 0, y = m; d < y.length; d++) {
                        var b = y[d];
                        a.Util.isNotNull(b) &&
                          a.Util.isObject(b) &&
                          b.hasOwnProperty("$") &&
                          i.push(b.$);
                      }
                  } else a.Util.isNotNull(m) && i.push(m);
                }
          }
      return i;
    }),
    (t.getAddressValue = function (e, t, r) {
      var i,
        o = s(p(e, t));
      if (
        a.Util.isNotNull(o) &&
        o.length > 0 &&
        ((o =
          "address.list" === t
            ? o[0].address
            : "dispatchfromaddress.list" === t
            ? o[0].dispatchfromaddress
            : o[0].basicbuyeraddress),
        a.Util.isNotNull(o))
      )
        if (a.Util.isArray(o)) {
          i = [];
          for (var u = 0, c = o; u < c.length; u++) {
            var l = c[u];
            a.Util.isNotNull(l) &&
              a.Util.isObject(l) &&
              l.hasOwnProperty("$") &&
              i.push(new n.default(l.$));
          }
        } else a.Util.isObject(o) && o.hasOwnProperty("$") && (i = []).push(new n.default(o.$));
      return i;
    }),
    (t.getChargeDescription = function (e, t) {
      var r,
        n = s(p(e, t));
      return (
        a.Util.isFilledArray(n) &&
          ((n = n[0]["udf:userdescription"]),
          a.Util.isObject(n) && n.hasOwnProperty("$") && (r = n.$)),
        r
      );
    }),
    (t.getChargeDescriptionList = function (e, t) {
      var r,
        n = s(p(e, t));
      if (a.Util.isFilledArray(n) && ((n = n[0]["udf:userdescription"]), a.Util.isNotNull(n)))
        if (a.Util.isFilledArray(n))
          for (var i = 0, o = n; i < o.length; i++) {
            var u = o[i];
            a.Util.isNotNull(u) &&
              "object" == typeof u &&
              u.hasOwnProperty("$") &&
              (a.Util.isNull(r) && (r = []), r.push(u.$));
          }
        else "object" == typeof n && n.hasOwnProperty("$") && (r = []).push(n.$);
      return r;
    }),
    (t.getConsigneeVatNo = function (e, t, r) {
      var i,
        o = s(p(e, t));
      if (
        a.Util.isNotNull(o) &&
        o.length > 0 &&
        ((o = o[0]["udf:traderconsvattinno"]), a.Util.isNotNull(o) && o.length > 0)
      )
        if (a.Util.isArray(o)) {
          i = [];
          for (var u = 0, c = o; u < c.length; u++) {
            var l = c[u];
            a.Util.isNotNull(l) &&
              a.Util.isObject(l) &&
              l.hasOwnProperty("$") &&
              i.push(new n.default(l.$));
          }
        } else a.Util.isObject(o) && o.hasOwnProperty("$") && (i = []).push(new n.default(o.$));
      return i;
    }),
    (t.parseDate = m),
    (t.getDateValue = function (e, t, r, n, o) {
      var s = c(e, t);
      a.Util.isNull(n) && (n = a.DateUtil.FORMAT_DD_MMM_YYYY);
      var p = r;
      return (
        a.Util.isNotNull(s) &&
          "" !== s.trim() &&
          (p =
            -1 !== s.indexOf("Day")
              ? a.DateUtil.addDate(r, u(s), i.Duration.DAY, o)
              : -1 !== s.indexOf("Week")
              ? a.DateUtil.addDate(r, u(s), i.Duration.WEEK, o)
              : -1 !== s.indexOf("Month")
              ? a.DateUtil.addDate(r, u(s), i.Duration.MONTH, o)
              : -1 !== s.indexOf("Year")
              ? a.DateUtil.addDate(r, u(s), i.Duration.YEAR, o)
              : m(s, a.DateUtil.FORMAT_DD_MMM_YYYY, o)),
        a.Util.isNumber(p) ? p : 0
      );
    }),
    (t.getDateValueForCreditPeriod = function (e, t, r, n, o) {
      var s = c(e, t);
      a.Util.isNull(n) && (n = a.DateUtil.FORMAT_DD_MMM_YYYY);
      var p = r;
      return (
        a.Util.isNotNull(s) &&
          "" !== s.trim() &&
          (p =
            -1 !== s.indexOf("Week")
              ? a.DateUtil.addDate(r, u(s), i.Duration.WEEK, o)
              : -1 !== s.indexOf("Month")
              ? a.DateUtil.addDate(r, u(s), i.Duration.MONTH, o)
              : -1 !== s.indexOf("Year")
              ? a.DateUtil.addDate(r, u(s), i.Duration.YEAR, o)
              : a.DateUtil.addDate(r, u(s), i.Duration.DAY, o)),
        a.Util.isNumber(p) ? p : 0
      );
    }),
    (t.encode = function (e) {
      return a.Util.isNull(e)
        ? ""
        : e
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    }),
    (t.removeNoiseChars = function (e) {
      if (a.Util.isNotNull(e))
        return (e = (e = e.replace(new RegExp("[" + o + "]", "g"), "").toLowerCase()).replace(
          /-/g,
          ""
        ));
    });
};
