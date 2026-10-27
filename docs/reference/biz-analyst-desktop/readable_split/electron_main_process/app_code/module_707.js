// webpack module #707 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(12),
    a = r(10),
    o = r(171),
    s =
      (r(2),
      new Set([
        "date",
        "tallyUpdatedAt",
        "serverUpdatedAt",
        "createdAt",
        "updatedAt",
        "deletedAt",
        "dataUpdateAt",
        "masterId",
        "alterId",
        "itemMasterId",
        "partyMasterId",
        "accountMasterId",
        "dataVersion",
        "syncType",
        "masterType",
        "lastCompleteSyncAt",
        "gstApplicableDate",
        "lastSaleDate",
        "minOrderBase",
        "reOrderBase",
        "conversion",
        "denominator",
        "subQuantity",
        "alternateQuantity",
        "refDate",
        "subOpeningStock",
        "subClosingStock",
        "dueOn",
        "onAccountAmount",
        "recommendedSyncTime",
        "creditPeriod",
        "lrRrDate",
        "igst",
        "cgst",
        "sgst",
        "cess",
        "cessOnRate",
        "rateOfTax",
        "lastFileUploadedAtServer",
        "lastFileUploadedAtLocal",
        "noOfDaysCycleAfterDueDate",
        "weekOftheYear",
        "frequencyOfWeek",
        "eInvoiceDefaultPeriod",
        "roundingLimit",
        "lastDeletedAlterId",
      ]));
  function n(e) {
    var t = i.createCipher("aes-256-ctr", "d6F3Efeq"),
      r = t.update(e, "utf8", "hex");
    r += t.final("hex");
    try {
      JSON.parse(u(r));
    } catch (t) {
      var a = "Encription error Orignal => " + e + " Crash object " + u(r);
      o.captureException(new Error(a));
    }
    return r;
  }
  function u(e) {
    var t = i.createDecipher("aes-256-ctr", "d6F3Efeq"),
      r = t.update(e, "hex", "utf8");
    return (r += t.final("utf8"));
  }
  function p(e) {
    var t = {};
    for (var r in e)
      if (a.isNotNull(e[r]) && "boolean" != typeof e[r])
        if (s.has(r)) t[r] = e[r];
        else {
          var i = JSON.stringify(e[r]);
          t[r] = n(i);
        }
      else t[r] = e[r];
    return t;
  }
  function c(e) {
    if (a.isArray(e))
      for (var t = 0; t < e.length; t++)
        a.isArray(e[t]) || a.isObject(e[t]) ? (e[t] = c(e[t])) : (e[t] = n(e[t].toString()));
    else if (a.isObject(e)) {
      var r = Object.keys(e).length;
      for (var i in e)
        if (!s.has(i))
          if (a.isArray(e[i]))
            for (t = 0; t < e[i].length; t++)
              if (a.isArray(e[i][t]) || a.isObject(e[i][t])) {
                var o = c(e[i][t]);
                e[i][t] = o;
              } else e[i][t] = n(e[i][t].toString());
          else if (a.isObject(e[i]))
            for (var u in e[i]) {
              if (!s.has(u)) (((m = {})[u] = e[i][u]), (m = c(m)), (e[i][u] = m[u]));
            }
          else {
            var m;
            if (1 === r) e = p(e);
            else (((m = {})[i] = e[i]), (m = p(m)), (e[i] = m[i]));
          }
    } else console.log("Where object is neither array nor object: This is wrong");
    return e;
  }
  ((t.encrypt = n),
    (t.decrypt = u),
    (t.encryptObject = p),
    (t.decryptObject = function (e) {
      var t = {};
      for (var r in e)
        try {
          if (a.isNotNull(e[r]) && "string" == typeof e[r])
            if (s.has(r)) t[r] = e[r];
            else {
              var i = JSON.parse(u(e[r]));
              t[r] = i;
            }
          else t[r] = e[r];
        } catch (t) {
          if (
            (t instanceof SyntaxError || t instanceof TypeError) &&
            a.isNotNull(t.message) &&
            (t.message.includes("Unexpected") || t.message.includes("Bad input string"))
          )
            throw { instance: e, error: t };
          throw t;
        }
      return t;
    }),
    (t.encryptWhere = c),
    (t.encryptOptions = function (e) {
      if (a.isNull(e)) return e;
      for (var t in e)
        if ("where" === t) {
          var r = e[t];
          e[t] = c(r);
        }
      return e;
    }));
};
