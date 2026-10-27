// webpack module #602 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(21),
    a = r(11),
    i = r(161),
    o =
      (r(0),
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
  function s(e) {
    var t = n.createCipher("aes-256-ctr", "d6F3Efeq"),
      r = t.update(e, "utf8", "hex");
    r += t.final("hex");
    try {
      JSON.parse(u(r));
    } catch (t) {
      var a = "Encription error Orignal => " + e + " Crash object " + u(r);
      i.captureException(new Error(a));
    }
    return r;
  }
  function u(e) {
    var t = n.createDecipher("aes-256-ctr", "d6F3Efeq"),
      r = t.update(e, "hex", "utf8");
    return (r += t.final("utf8"));
  }
  function p(e) {
    var t = {};
    for (var r in e)
      if (a.isNotNull(e[r]) && "boolean" != typeof e[r])
        if (o.has(r)) t[r] = e[r];
        else {
          var n = JSON.stringify(e[r]);
          t[r] = s(n);
        }
      else t[r] = e[r];
    return t;
  }
  function c(e) {
    if (a.isArray(e))
      for (var t = 0; t < e.length; t++)
        a.isArray(e[t]) || a.isObject(e[t]) ? (e[t] = c(e[t])) : (e[t] = s(e[t].toString()));
    else if (a.isObject(e)) {
      var r = Object.keys(e).length;
      for (var n in e)
        if (!o.has(n))
          if (a.isArray(e[n]))
            for (t = 0; t < e[n].length; t++)
              if (a.isArray(e[n][t]) || a.isObject(e[n][t])) {
                var i = c(e[n][t]);
                e[n][t] = i;
              } else e[n][t] = s(e[n][t].toString());
          else if (a.isObject(e[n]))
            for (var u in e[n]) {
              if (!o.has(u)) (((l = {})[u] = e[n][u]), (l = c(l)), (e[n][u] = l[u]));
            }
          else {
            var l;
            if (1 === r) e = p(e);
            else (((l = {})[n] = e[n]), (l = p(l)), (e[n] = l[n]));
          }
    } else console.log("Where object is neither array nor object: This is wrong");
    return e;
  }
  ((t.encrypt = s),
    (t.decrypt = u),
    (t.encryptObject = p),
    (t.decryptObject = function (e) {
      var t = {};
      for (var r in e)
        try {
          if (a.isNotNull(e[r]) && "string" == typeof e[r])
            if (o.has(r)) t[r] = e[r];
            else {
              var n = JSON.parse(u(e[r]));
              t[r] = n;
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
