// webpack module #1049 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var n =
    (this && this.__assign) ||
    function () {
      return (n =
        Object.assign ||
        function (e) {
          for (var t, r = 1, n = arguments.length; r < n; r++)
            for (var a in (t = arguments[r]))
              Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
          return e;
        }).apply(this, arguments);
    };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var a = r(0),
    i = r(70),
    o = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e, t, r) {
          if (a.Util.isEmptyString(e.name) || a.Util.isEmptyString(e.parentGroup))
            throw new Error("Ledger name or parent group can not be null");
          var o = "",
            s = { PARENT: e.parentGroup };
          if (a.Util.isNotNull(e.contactDetails)) {
            var u = e.contactDetails;
            if (r) {
              a.Util.isNotEmptyString(u.state) && (o = u.state);
              c = void 0;
              a.Util.isNotEmptyString(u.address) && (c = u.address.match(/.{1,50}/g));
              var p = a.DateUtil.now();
              (a.Util.isNotNull(t.booksFrom)
                ? (p = t.booksFrom)
                : a.Util.isNotNull(t.startingFrom) && (p = t.startingFrom),
                (s["LEDMAILINGDETAILS.LIST"] = {
                  APPLICABLEFROM: a.DateUtil.format(p, a.DateUtil.FORMAT_YYYYMMDD),
                  PINCODE: a.Util.isNotEmptyString(u.pincode) ? u.pincode : "",
                  STATE: o,
                  COUNTRY: a.Util.isNotEmptyString(u.country) ? u.country : "",
                  "ADDRESS.LIST": { "@TYPE": "String", ADDRESS: a.Util.isFilledArray(c) ? c : [] },
                }));
            } else {
              if (a.Util.isNotEmptyString(u.address)) {
                var c = u.address.match(/.{1,50}/g);
                a.Util.isFilledArray(c) && (s["ADDRESS.LIST"] = { "@TYPE": "String", ADDRESS: c });
              }
              (a.Util.isNotEmptyString(u.state) && (s.LEDSTATENAME = u.state),
                a.Util.isNotEmptyString(u.country) &&
                  ((s.COUNTRYNAME = u.country), (s.COUNTRYOFRESIDENCE = u.country)),
                a.Util.isNotEmptyString(u.pincode) && (s.PINCODE = u.pincode));
            }
            (a.Util.isNotEmptyString(u.contactPerson) && (s.LEDGERCONTACT = u.contactPerson),
              a.Util.isFilledArray(u.phone) && (s.LEDGERPHONE = u.phone.join(",")),
              a.Util.isFilledArray(u.mobile) && (s.LEDGERMOBILE = u.mobile.join(",")),
              a.Util.isNotEmptyString(u.email) && (s.EMAIL = u.email),
              a.Util.isNotEmptyString(u.emailcc) && (s.EMAILCC = u.emailcc));
          }
          (r &&
            (s["LEDGSTREGDETAILS.LIST"] = {
              APPLICABLEFROM: a.DateUtil.format(a.DateUtil.now(), a.DateUtil.FORMAT_YYYYMMDD),
              GSTREGISTRATIONTYPE: a.Util.isNotEmptyString(e.gstRegistrationType)
                ? e.gstRegistrationType
                : "",
              PLACEOFSUPPLY: o,
              STATE: o,
              GSTIN: a.Util.isNotEmptyString(e.gstIn) ? e.gstIn : "",
            }),
            a.Util.isNumber(e.creditPeriod) &&
              e.creditPeriod > 0 &&
              (s.BILLCREDITPERIOD = e.creditPeriod + " Day"),
            a.Util.isNumber(e.creditLimit) &&
            e.creditLimit > 0 &&
            a.Util.isNotEmpty(e.creditLimitType)
              ? (s.CREDITLIMIT = e.creditLimit + " " + e.creditLimitType)
              : a.Util.isNumber(e.creditLimit) &&
                e.creditLimit > 0 &&
                (s.CREDITLIMIT = e.creditLimit),
            a.Util.isNotEmptyString(e.cstNumber) && (s.INTERSTATESTNUMBER = e.cstNumber),
            a.Util.isNotEmptyString(e.vatTinNumber) && (s.VATTINNUMBER = e.vatTinNumber),
            a.Util.isNotEmptyString(e.panNumber) && (s.INCOMETAXNUMBER = e.panNumber),
            a.Util.isNotEmptyString(e.priceLevel) && (s.PRICELEVEL = e.priceLevel),
            a.Util.isNotNull(e.isBillwiseOn) && !1 === e.isBillwiseOn
              ? (s.ISBILLWISEON = "No")
              : (s.ISBILLWISEON = "Yes"),
            a.Util.isNotEmptyString(e.gstIn) && (s.PARTYGSTIN = e.gstIn),
            a.Util.isNotEmptyString(e.gstRegistrationType) &&
              (s.GSTREGISTRATIONTYPE = e.gstRegistrationType));
          var l = {
            ENVELOPE: {
              HEADER: { TALLYREQUEST: "Import Data" },
              BODY: {
                IMPORTDATA: {
                  REQUESTDESC: {
                    REPORTNAME: "All Masters",
                    STATICVARIABLES: { SVCURRENTCOMPANY: t.tallyCompanyName.trim() },
                  },
                  REQUESTDATA: {
                    TALLYMESSAGE: {
                      "@xmlns:UDF": "TallyUDF",
                      LEDGER: n(
                        {
                          "@NAME": e.name,
                          "MAILINGNAME.LIST": { "@TYPE": "String", MAILINGNAME: e.name },
                          "LANGUAGENAME.LIST": {
                            "NAME.LIST": { "@TYPE": "String", NAME: e.name },
                            LANGUAGEID: 1033,
                          },
                        },
                        s,
                      ),
                    },
                  },
                },
              },
            },
          };
          return i.create(l).end({ pretty: !0 });
        }),
        e
      );
    })();
  t.default = o;
};
