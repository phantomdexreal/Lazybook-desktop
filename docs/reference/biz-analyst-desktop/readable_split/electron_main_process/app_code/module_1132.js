// webpack module #1132 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var i =
    (this && this.__assign) ||
    function () {
      return (i =
        Object.assign ||
        function (e) {
          for (var t, r = 1, i = arguments.length; r < i; r++)
            for (var a in (t = arguments[r]))
              Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
          return e;
        }).apply(this, arguments);
    };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var a = r(2),
    o = r(65),
    s = (function () {
      function e() {}
      return (
        (e.prototype.getBody = function (e, t, r) {
          if (a.Util.isEmptyString(e.name) || a.Util.isEmptyString(e.parentGroup))
            throw new Error("Ledger name or parent group can not be null");
          var s = "",
            n = { PARENT: e.parentGroup };
          if (a.Util.isNotNull(e.contactDetails)) {
            var u = e.contactDetails;
            if (r) {
              a.Util.isNotEmptyString(u.state) && (s = u.state);
              c = void 0;
              a.Util.isNotEmptyString(u.address) && (c = u.address.match(/.{1,50}/g));
              var p = a.DateUtil.now();
              (a.Util.isNotNull(t.booksFrom)
                ? (p = t.booksFrom)
                : a.Util.isNotNull(t.startingFrom) && (p = t.startingFrom),
                (n["LEDMAILINGDETAILS.LIST"] = {
                  APPLICABLEFROM: a.DateUtil.format(p, a.DateUtil.FORMAT_YYYYMMDD),
                  PINCODE: a.Util.isNotEmptyString(u.pincode) ? u.pincode : "",
                  STATE: s,
                  COUNTRY: a.Util.isNotEmptyString(u.country) ? u.country : "",
                  "ADDRESS.LIST": { "@TYPE": "String", ADDRESS: a.Util.isFilledArray(c) ? c : [] },
                }));
            } else {
              if (a.Util.isNotEmptyString(u.address)) {
                var c = u.address.match(/.{1,50}/g);
                a.Util.isFilledArray(c) && (n["ADDRESS.LIST"] = { "@TYPE": "String", ADDRESS: c });
              }
              (a.Util.isNotEmptyString(u.state) && (n.LEDSTATENAME = u.state),
                a.Util.isNotEmptyString(u.country) &&
                  ((n.COUNTRYNAME = u.country), (n.COUNTRYOFRESIDENCE = u.country)),
                a.Util.isNotEmptyString(u.pincode) && (n.PINCODE = u.pincode));
            }
            (a.Util.isNotEmptyString(u.contactPerson) && (n.LEDGERCONTACT = u.contactPerson),
              a.Util.isFilledArray(u.phone) && (n.LEDGERPHONE = u.phone.join(",")),
              a.Util.isFilledArray(u.mobile) && (n.LEDGERMOBILE = u.mobile.join(",")),
              a.Util.isNotEmptyString(u.email) && (n.EMAIL = u.email),
              a.Util.isNotEmptyString(u.emailcc) && (n.EMAILCC = u.emailcc));
          }
          (r &&
            (n["LEDGSTREGDETAILS.LIST"] = {
              APPLICABLEFROM: a.DateUtil.format(a.DateUtil.now(), a.DateUtil.FORMAT_YYYYMMDD),
              GSTREGISTRATIONTYPE: a.Util.isNotEmptyString(e.gstRegistrationType)
                ? e.gstRegistrationType
                : "",
              PLACEOFSUPPLY: s,
              STATE: s,
              GSTIN: a.Util.isNotEmptyString(e.gstIn) ? e.gstIn : "",
            }),
            a.Util.isNumber(e.creditPeriod) &&
              e.creditPeriod > 0 &&
              (n.BILLCREDITPERIOD = e.creditPeriod + " Day"),
            a.Util.isNumber(e.creditLimit) &&
            e.creditLimit > 0 &&
            a.Util.isNotEmpty(e.creditLimitType)
              ? (n.CREDITLIMIT = e.creditLimit + " " + e.creditLimitType)
              : a.Util.isNumber(e.creditLimit) &&
                e.creditLimit > 0 &&
                (n.CREDITLIMIT = e.creditLimit),
            a.Util.isNotEmptyString(e.cstNumber) && (n.INTERSTATESTNUMBER = e.cstNumber),
            a.Util.isNotEmptyString(e.vatTinNumber) && (n.VATTINNUMBER = e.vatTinNumber),
            a.Util.isNotEmptyString(e.panNumber) && (n.INCOMETAXNUMBER = e.panNumber),
            a.Util.isNotEmptyString(e.priceLevel) && (n.PRICELEVEL = e.priceLevel),
            a.Util.isNotNull(e.isBillwiseOn) && !1 === e.isBillwiseOn
              ? (n.ISBILLWISEON = "No")
              : (n.ISBILLWISEON = "Yes"),
            a.Util.isNotEmptyString(e.gstIn) && (n.PARTYGSTIN = e.gstIn),
            a.Util.isNotEmptyString(e.gstRegistrationType) &&
              (n.GSTREGISTRATIONTYPE = e.gstRegistrationType));
          var m = {
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
                      LEDGER: i(
                        {
                          "@NAME": e.name,
                          "MAILINGNAME.LIST": { "@TYPE": "String", MAILINGNAME: e.name },
                          "LANGUAGENAME.LIST": {
                            "NAME.LIST": { "@TYPE": "String", NAME: e.name },
                            LANGUAGEID: 1033,
                          },
                        },
                        n,
                      ),
                    },
                  },
                },
              },
            },
          };
          return o.create(m).end({ pretty: !0 });
        }),
        e
      );
    })();
  t.default = s;
};
