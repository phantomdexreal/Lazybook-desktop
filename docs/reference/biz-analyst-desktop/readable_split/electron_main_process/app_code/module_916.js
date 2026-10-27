// webpack module #916 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var i,
    a =
      (this && this.__extends) ||
      ((i = function (e, t) {
        return (i =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (e, t) {
              e.__proto__ = t;
            }) ||
          function (e, t) {
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
          })(e, t);
      }),
      function (e, t) {
        function r() {
          this.constructor = e;
        }
        (i(e, t),
          (e.prototype = null === t ? Object.create(t) : ((r.prototype = t.prototype), new r())));
      });
  Object.defineProperty(t, "__esModule", { value: !0 });
  var o = r(22),
    s = r(17),
    n = r(10),
    u = r(2),
    p = r(18),
    c = r(34),
    m = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        a(t, e),
        (t.prototype.getModelName = function () {
          return "company";
        }),
        (t.prototype.getAttributes = function () {
          return {
            companyId: { type: s.STRING, required: !0, primaryKey: !0 },
            _id: { type: s.STRING, required: !0 },
            name: { type: s.STRING, required: !0 },
            desc: { type: s.STRING, required: !1 },
            startingFrom: { type: s.TEXT, required: !1 },
            booksFrom: { type: s.TEXT, required: !1 },
            endingAt: { type: s.TEXT, required: !1 },
            lastVoucherDate: { type: s.TEXT, required: !1 },
            isSync: { type: s.BOOLEAN, required: !1 },
            userId: { type: s.STRING, required: !0 },
            userEmail: { type: s.STRING, required: !0 },
            tallyCompanyName: { type: s.STRING, required: !0 },
            companyChequeName: { type: s.STRING, required: !1 },
            companyContactPerson: { type: s.STRING, required: !1 },
            companyContactNumber: { type: s.STRING, required: !1 },
            companyMailingName: { type: s.STRING, required: !1 },
            email: { type: s.STRING, required: !1 },
            website: { type: s.STRING, required: !1 },
            phoneNumber: { type: s.STRING, required: !1 },
            mobileNo: { type: s.STRING, required: !1 },
            cmpMobNo: { type: s.STRING, required: !1 },
            address: { type: s.STRING, required: !1 },
            addressList: { type: s.ABSTRACT, required: !1 },
            state: { type: s.STRING, required: !1 },
            pincode: { type: s.STRING, required: !1 },
            countryName: { type: s.STRING, required: !1 },
            vatTinNumber: { type: s.STRING, required: !1 },
            corporateIdentityNo: { type: s.STRING, required: !1 },
            interStateStNumber: { type: s.STRING, required: !1 },
            tanumber: { type: s.STRING, required: !1 },
            stRegNumber: { type: s.STRING, required: !1 },
            cmppfCode: { type: s.STRING, required: !1 },
            panNumber: { type: s.STRING, required: !1 },
            dataVersion: { type: s.INTEGER, required: !1 },
            tallyUpdatedAt: { type: s.INTEGER, required: !0 },
            uptoDate: { type: s.BOOLEAN, required: !0 },
            masterId: { type: s.INTEGER, required: !0 },
            alterId: { type: s.INTEGER, required: !0 },
            dataUpdateAt: { type: s.INTEGER, required: !0 },
            gstRegistrationType: { type: s.STRING, required: !0 },
            gstApplicableDate: { type: s.INTEGER, required: !0 },
            isGstCesson: { type: s.STRING, required: !0 },
            gstin: { type: s.STRING, required: !0 },
            gstDetails: { type: s.ABSTRACT, required: !1 },
            hsnDetails: { type: s.ABSTRACT, required: !1 },
            isDeleted: { type: s.BOOLEAN, required: !0 },
            timezone: { type: s.STRING, required: !1 },
            tallyLicense: { type: s.STRING, required: !1 },
            tallyCompanyId: { type: s.STRING, required: !0 },
            subscriptionExp: { type: s.INTEGER, required: !0 },
            subscriptionId: { type: s.STRING, required: !1 },
            syncFrom: { type: s.INTEGER, required: !1 },
            tallyLicenseEmail: { type: s.STRING, required: !1 },
            tallyLicenseIsInternational: { type: s.BOOLEAN, required: !1 },
            dataSyncDetails: { type: s.ABSTRACT, required: !1 },
            isDataEntrySyncEnable: { type: s.BOOLEAN, required: !0, defaultValue: !0 },
            isCompanyAlterIdNegative: { type: s.BOOLEAN, required: !0, defaultValue: !1 },
            syncDetails: { type: s.ABSTRACT, required: !1 },
            fileUploadLimit: { type: s.INTEGER, required: !1 },
            isResyncRequired: { type: s.BOOLEAN, required: !0, defaultValue: !1 },
            companySettings: { type: s.ABSTRACT, required: !1 },
            serverUpdatedAt: { type: s.STRING, required: !1 },
            dataDeleteTime: { type: s.INTEGER, required: !1 },
            metaData: { type: s.ABSTRACT, required: !1 },
            lastSyncMetaData: { type: s.ABSTRACT, required: !1 },
            eInvoiceConfig: { type: s.ABSTRACT, required: !1 },
            eWayBillConfig: { type: s.ABSTRACT, required: !1 },
            isMultiGstRegistration: { type: s.BOOLEAN, required: !1 },
          };
        }),
        (t.prototype.runMigration = function () {
          var e = u.PathUtil.getDbPath(this.userId, this.company),
            t = new c.SQLConfig();
          o.open(e, "r", function (r, i) {
            if (r && "ENOENT" == r.code) u.Log.error(r);
            else {
              var a = t.connect(e);
              a.serialize(function () {
                a.all(
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='companies'",
                  function (e, t) {
                    e
                      ? u.Log.error(e)
                      : n.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(companies)", function (e, t) {
                          if (e) u.Log.error(e);
                          else {
                            for (
                              var r = !1,
                                i = !1,
                                o = !1,
                                s = !1,
                                n = !1,
                                p = !1,
                                c = !1,
                                m = !1,
                                l = !1,
                                d = !1,
                                y = !1,
                                b = !1,
                                h = !1,
                                g = !1,
                                S = !1,
                                f = !1,
                                A = !1,
                                N = !1,
                                I = !1,
                                T = !1,
                                M = !1,
                                v = !1,
                                k = !1,
                                C = !1,
                                q = !1,
                                R = !1,
                                D = !1,
                                E = !1,
                                x = !1,
                                O = !1,
                                z = 0,
                                P = t;
                              z < P.length;
                              z++
                            ) {
                              var L = P[z];
                              "addressList" === L.name
                                ? (r = !0)
                                : "panNumber" === L.name
                                  ? (i = !0)
                                  : "companyMailingName" === L.name
                                    ? (o = !0)
                                    : "gstin" === L.name
                                      ? (s = !0)
                                      : "lastVoucherDate" === L.name
                                        ? (n = !0)
                                        : "timezone" === L.name
                                          ? (p = !0)
                                          : "tallyLicense" === L.name
                                            ? (c = !0)
                                            : "subscriptionExp" === L.name
                                              ? (m = !0)
                                              : "syncFrom" === L.name
                                                ? (d = !0)
                                                : "tallyLicenseEmail" === L.name
                                                  ? (y = !0)
                                                  : "tallyLicenseIsInternational" === L.name
                                                    ? (b = !0)
                                                    : "dataSyncDetails" === L.name
                                                      ? (h = !0)
                                                      : "subscriptionId" === L.name
                                                        ? (l = !0)
                                                        : "isDataEntrySyncEnable" === L.name
                                                          ? (g = !0)
                                                          : "isCompanyAlterIdNegative" === L.name
                                                            ? (S = !0)
                                                            : "syncDetails" === L.name
                                                              ? (f = !0)
                                                              : "fileUploadLimit" === L.name
                                                                ? (A = !0)
                                                                : "tallyCompanyId" === L.name
                                                                  ? (N = !0)
                                                                  : "isResyncRequired" === L.name
                                                                    ? (I = !0)
                                                                    : "serverUpdatedAt" === L.name
                                                                      ? (T = !0)
                                                                      : "companySettings" === L.name
                                                                        ? (M = !0)
                                                                        : "dataDeleteTime" ===
                                                                            L.name
                                                                          ? (v = !0)
                                                                          : "metaData" === L.name
                                                                            ? (k = !0)
                                                                            : "mobileNo" === L.name
                                                                              ? (C = !0)
                                                                              : "cmpMobNo" ===
                                                                                  L.name
                                                                                ? (q = !0)
                                                                                : "lastSyncMetaData" ===
                                                                                    L.name
                                                                                  ? (R = !0)
                                                                                  : "eInvoiceConfig" ===
                                                                                      L.name
                                                                                    ? (D = !0)
                                                                                    : "eWayBillConfig" ===
                                                                                        L.name
                                                                                      ? (E = !0)
                                                                                      : "hsnDetails" ===
                                                                                          L.name
                                                                                        ? (x = !0)
                                                                                        : "isMultiGstRegistration" ===
                                                                                            L.name &&
                                                                                          (O = !0);
                            }
                            (!1 === r && a.run("ALTER TABLE companies ADD addressList ABSTRACT"),
                              !1 === i && a.run("ALTER TABLE companies ADD panNumber TEXT"),
                              !1 === o &&
                                a.run("ALTER TABLE companies ADD companyMailingName TEXT"),
                              !1 === s && a.run("ALTER TABLE companies ADD gstin TEXT"),
                              !1 === n &&
                                a.run("ALTER TABLE companies ADD lastVoucherDate ABSTRACT"),
                              !1 === p && a.run("ALTER TABLE companies ADD timezone TEXT"),
                              !1 === c && a.run("ALTER TABLE companies ADD tallyLicense TEXT"),
                              !1 === m &&
                                a.run("ALTER TABLE companies ADD subscriptionExp NUMERIC"),
                              !1 === d && a.run("ALTER TABLE companies ADD syncFrom NUMERIC"),
                              !1 === y && a.run("ALTER TABLE companies ADD tallyLicenseEmail TEXT"),
                              !1 === b &&
                                a.run(
                                  "ALTER TABLE companies ADD tallyLicenseIsInternational BOOLEAN",
                                ),
                              !1 === h &&
                                a.run("ALTER TABLE companies ADD dataSyncDetails ABSTRACT"),
                              !1 === l && a.run("ALTER TABLE companies ADD subscriptionId TEXT"),
                              !1 === g &&
                                a.run("ALTER TABLE companies ADD isDataEntrySyncEnable BOOLEAN"),
                              !1 === S &&
                                a.run("ALTER TABLE companies ADD isCompanyAlterIdNegative BOOLEAN"),
                              !1 === f && a.run("ALTER TABLE companies ADD syncDetails ABSTRACT"),
                              !1 === A &&
                                a.run("ALTER TABLE companies ADD fileUploadLimit NUMERIC"),
                              !1 === N && a.run("ALTER TABLE companies ADD tallyCompanyId TEXT"),
                              !1 === I &&
                                a.run("ALTER TABLE companies ADD isResyncRequired BOOLEAN"),
                              !1 === T && a.run("ALTER TABLE companies ADD serverUpdatedAt TEXT"),
                              !1 === M &&
                                a.run("ALTER TABLE companies ADD companySettings ABSTRACT"),
                              !1 === v && a.run("ALTER TABLE companies ADD dataDeleteTime NUMERIC"),
                              !1 === k && a.run("ALTER TABLE companies ADD metaData ABSTRACT"),
                              !1 === C && a.run("ALTER TABLE companies ADD mobileNo TEXT"),
                              !1 === q && a.run("ALTER TABLE companies ADD cmpMobNo TEXT"),
                              !1 === R && a.run("ALTER TABLE companies ADD lastSyncMetaData TEXT"),
                              !1 === D &&
                                a.run("ALTER TABLE companies ADD eInvoiceConfig ABSTRACT"),
                              !1 === E &&
                                a.run("ALTER TABLE companies ADD eWayBillConfig ABSTRACT"),
                              !1 === x && a.run("ALTER TABLE companies ADD hsnDetails ABSTRACT"),
                              !1 === O &&
                                a.run("ALTER TABLE companies ADD isMultiGstRegistration BOOLEAN"));
                          }
                        });
                  },
                );
              });
            }
          });
        }),
        t
      );
    })(p.ModelBase);
  t.default = m;
};
