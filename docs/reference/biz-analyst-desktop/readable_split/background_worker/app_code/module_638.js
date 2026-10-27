// webpack module #638 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var n,
    a =
      (this && this.__extends) ||
      ((n = function (e, t) {
        return (n =
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
        (n(e, t),
          (e.prototype = null === t ? Object.create(t) : ((r.prototype = t.prototype), new r())));
      });
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(27),
    o = r(13),
    s = r(11),
    u = r(0),
    p = r(14),
    c = r(32),
    l = (function (e) {
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
            companyId: { type: o.STRING, required: !0, primaryKey: !0 },
            _id: { type: o.STRING, required: !0 },
            name: { type: o.STRING, required: !0 },
            desc: { type: o.STRING, required: !1 },
            startingFrom: { type: o.TEXT, required: !1 },
            booksFrom: { type: o.TEXT, required: !1 },
            endingAt: { type: o.TEXT, required: !1 },
            lastVoucherDate: { type: o.TEXT, required: !1 },
            isSync: { type: o.BOOLEAN, required: !1 },
            userId: { type: o.STRING, required: !0 },
            userEmail: { type: o.STRING, required: !0 },
            tallyCompanyName: { type: o.STRING, required: !0 },
            companyChequeName: { type: o.STRING, required: !1 },
            companyContactPerson: { type: o.STRING, required: !1 },
            companyContactNumber: { type: o.STRING, required: !1 },
            companyMailingName: { type: o.STRING, required: !1 },
            email: { type: o.STRING, required: !1 },
            website: { type: o.STRING, required: !1 },
            phoneNumber: { type: o.STRING, required: !1 },
            mobileNo: { type: o.STRING, required: !1 },
            cmpMobNo: { type: o.STRING, required: !1 },
            address: { type: o.STRING, required: !1 },
            addressList: { type: o.ABSTRACT, required: !1 },
            state: { type: o.STRING, required: !1 },
            pincode: { type: o.STRING, required: !1 },
            countryName: { type: o.STRING, required: !1 },
            vatTinNumber: { type: o.STRING, required: !1 },
            corporateIdentityNo: { type: o.STRING, required: !1 },
            interStateStNumber: { type: o.STRING, required: !1 },
            tanumber: { type: o.STRING, required: !1 },
            stRegNumber: { type: o.STRING, required: !1 },
            cmppfCode: { type: o.STRING, required: !1 },
            panNumber: { type: o.STRING, required: !1 },
            dataVersion: { type: o.INTEGER, required: !1 },
            tallyUpdatedAt: { type: o.INTEGER, required: !0 },
            uptoDate: { type: o.BOOLEAN, required: !0 },
            masterId: { type: o.INTEGER, required: !0 },
            alterId: { type: o.INTEGER, required: !0 },
            dataUpdateAt: { type: o.INTEGER, required: !0 },
            gstRegistrationType: { type: o.STRING, required: !0 },
            gstApplicableDate: { type: o.INTEGER, required: !0 },
            isGstCesson: { type: o.STRING, required: !0 },
            gstin: { type: o.STRING, required: !0 },
            gstDetails: { type: o.ABSTRACT, required: !1 },
            hsnDetails: { type: o.ABSTRACT, required: !1 },
            isDeleted: { type: o.BOOLEAN, required: !0 },
            timezone: { type: o.STRING, required: !1 },
            tallyLicense: { type: o.STRING, required: !1 },
            tallyCompanyId: { type: o.STRING, required: !0 },
            subscriptionExp: { type: o.INTEGER, required: !0 },
            subscriptionId: { type: o.STRING, required: !1 },
            syncFrom: { type: o.INTEGER, required: !1 },
            tallyLicenseEmail: { type: o.STRING, required: !1 },
            tallyLicenseIsInternational: { type: o.BOOLEAN, required: !1 },
            dataSyncDetails: { type: o.ABSTRACT, required: !1 },
            isDataEntrySyncEnable: { type: o.BOOLEAN, required: !0, defaultValue: !0 },
            isCompanyAlterIdNegative: { type: o.BOOLEAN, required: !0, defaultValue: !1 },
            syncDetails: { type: o.ABSTRACT, required: !1 },
            fileUploadLimit: { type: o.INTEGER, required: !1 },
            isResyncRequired: { type: o.BOOLEAN, required: !0, defaultValue: !1 },
            companySettings: { type: o.ABSTRACT, required: !1 },
            serverUpdatedAt: { type: o.STRING, required: !1 },
            dataDeleteTime: { type: o.INTEGER, required: !1 },
            metaData: { type: o.ABSTRACT, required: !1 },
            lastSyncMetaData: { type: o.ABSTRACT, required: !1 },
            eInvoiceConfig: { type: o.ABSTRACT, required: !1 },
            eWayBillConfig: { type: o.ABSTRACT, required: !1 },
            isMultiGstRegistration: { type: o.BOOLEAN, required: !1 },
          };
        }),
        (t.prototype.runMigration = function () {
          var e = u.PathUtil.getDbPath(this.userId, this.company),
            t = new c.SQLConfig();
          i.open(e, "r", function (r, n) {
            if (r && "ENOENT" == r.code) u.Log.error(r);
            else {
              var a = t.connect(e);
              a.serialize(function () {
                a.all(
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='companies'",
                  function (e, t) {
                    e
                      ? u.Log.error(e)
                      : s.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(companies)", function (e, t) {
                          if (e) u.Log.error(e);
                          else {
                            for (
                              var r = !1,
                                n = !1,
                                i = !1,
                                o = !1,
                                s = !1,
                                p = !1,
                                c = !1,
                                l = !1,
                                m = !1,
                                d = !1,
                                y = !1,
                                b = !1,
                                h = !1,
                                f = !1,
                                g = !1,
                                M = !1,
                                S = !1,
                                A = !1,
                                O = !1,
                                N = !1,
                                v = !1,
                                T = !1,
                                z = !1,
                                I = !1,
                                q = !1,
                                k = !1,
                                R = !1,
                                C = !1,
                                E = !1,
                                _ = !1,
                                D = 0,
                                L = t;
                              D < L.length;
                              D++
                            ) {
                              var x = L[D];
                              "addressList" === x.name
                                ? (r = !0)
                                : "panNumber" === x.name
                                  ? (n = !0)
                                  : "companyMailingName" === x.name
                                    ? (i = !0)
                                    : "gstin" === x.name
                                      ? (o = !0)
                                      : "lastVoucherDate" === x.name
                                        ? (s = !0)
                                        : "timezone" === x.name
                                          ? (p = !0)
                                          : "tallyLicense" === x.name
                                            ? (c = !0)
                                            : "subscriptionExp" === x.name
                                              ? (l = !0)
                                              : "syncFrom" === x.name
                                                ? (d = !0)
                                                : "tallyLicenseEmail" === x.name
                                                  ? (y = !0)
                                                  : "tallyLicenseIsInternational" === x.name
                                                    ? (b = !0)
                                                    : "dataSyncDetails" === x.name
                                                      ? (h = !0)
                                                      : "subscriptionId" === x.name
                                                        ? (m = !0)
                                                        : "isDataEntrySyncEnable" === x.name
                                                          ? (f = !0)
                                                          : "isCompanyAlterIdNegative" === x.name
                                                            ? (g = !0)
                                                            : "syncDetails" === x.name
                                                              ? (M = !0)
                                                              : "fileUploadLimit" === x.name
                                                                ? (S = !0)
                                                                : "tallyCompanyId" === x.name
                                                                  ? (A = !0)
                                                                  : "isResyncRequired" === x.name
                                                                    ? (O = !0)
                                                                    : "serverUpdatedAt" === x.name
                                                                      ? (N = !0)
                                                                      : "companySettings" === x.name
                                                                        ? (v = !0)
                                                                        : "dataDeleteTime" ===
                                                                            x.name
                                                                          ? (T = !0)
                                                                          : "metaData" === x.name
                                                                            ? (z = !0)
                                                                            : "mobileNo" === x.name
                                                                              ? (I = !0)
                                                                              : "cmpMobNo" ===
                                                                                  x.name
                                                                                ? (q = !0)
                                                                                : "lastSyncMetaData" ===
                                                                                    x.name
                                                                                  ? (k = !0)
                                                                                  : "eInvoiceConfig" ===
                                                                                      x.name
                                                                                    ? (R = !0)
                                                                                    : "eWayBillConfig" ===
                                                                                        x.name
                                                                                      ? (C = !0)
                                                                                      : "hsnDetails" ===
                                                                                          x.name
                                                                                        ? (E = !0)
                                                                                        : "isMultiGstRegistration" ===
                                                                                            x.name &&
                                                                                          (_ = !0);
                            }
                            (!1 === r && a.run("ALTER TABLE companies ADD addressList ABSTRACT"),
                              !1 === n && a.run("ALTER TABLE companies ADD panNumber TEXT"),
                              !1 === i &&
                                a.run("ALTER TABLE companies ADD companyMailingName TEXT"),
                              !1 === o && a.run("ALTER TABLE companies ADD gstin TEXT"),
                              !1 === s &&
                                a.run("ALTER TABLE companies ADD lastVoucherDate ABSTRACT"),
                              !1 === p && a.run("ALTER TABLE companies ADD timezone TEXT"),
                              !1 === c && a.run("ALTER TABLE companies ADD tallyLicense TEXT"),
                              !1 === l &&
                                a.run("ALTER TABLE companies ADD subscriptionExp NUMERIC"),
                              !1 === d && a.run("ALTER TABLE companies ADD syncFrom NUMERIC"),
                              !1 === y && a.run("ALTER TABLE companies ADD tallyLicenseEmail TEXT"),
                              !1 === b &&
                                a.run(
                                  "ALTER TABLE companies ADD tallyLicenseIsInternational BOOLEAN",
                                ),
                              !1 === h &&
                                a.run("ALTER TABLE companies ADD dataSyncDetails ABSTRACT"),
                              !1 === m && a.run("ALTER TABLE companies ADD subscriptionId TEXT"),
                              !1 === f &&
                                a.run("ALTER TABLE companies ADD isDataEntrySyncEnable BOOLEAN"),
                              !1 === g &&
                                a.run("ALTER TABLE companies ADD isCompanyAlterIdNegative BOOLEAN"),
                              !1 === M && a.run("ALTER TABLE companies ADD syncDetails ABSTRACT"),
                              !1 === S &&
                                a.run("ALTER TABLE companies ADD fileUploadLimit NUMERIC"),
                              !1 === A && a.run("ALTER TABLE companies ADD tallyCompanyId TEXT"),
                              !1 === O &&
                                a.run("ALTER TABLE companies ADD isResyncRequired BOOLEAN"),
                              !1 === N && a.run("ALTER TABLE companies ADD serverUpdatedAt TEXT"),
                              !1 === v &&
                                a.run("ALTER TABLE companies ADD companySettings ABSTRACT"),
                              !1 === T && a.run("ALTER TABLE companies ADD dataDeleteTime NUMERIC"),
                              !1 === z && a.run("ALTER TABLE companies ADD metaData ABSTRACT"),
                              !1 === I && a.run("ALTER TABLE companies ADD mobileNo TEXT"),
                              !1 === q && a.run("ALTER TABLE companies ADD cmpMobNo TEXT"),
                              !1 === k && a.run("ALTER TABLE companies ADD lastSyncMetaData TEXT"),
                              !1 === R &&
                                a.run("ALTER TABLE companies ADD eInvoiceConfig ABSTRACT"),
                              !1 === C &&
                                a.run("ALTER TABLE companies ADD eWayBillConfig ABSTRACT"),
                              !1 === E && a.run("ALTER TABLE companies ADD hsnDetails ABSTRACT"),
                              !1 === _ &&
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
  t.default = l;
};
