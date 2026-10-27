// webpack module #60 (from electron_main_process, BA Mobile Connector 8.4.41)
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
      }),
    o =
      (this && this.__awaiter) ||
      function (e, t, r, i) {
        return new (r || (r = Promise))(function (a, o) {
          function s(e) {
            try {
              u(i.next(e));
            } catch (e) {
              o(e);
            }
          }
          function n(e) {
            try {
              u(i.throw(e));
            } catch (e) {
              o(e);
            }
          }
          function u(e) {
            e.done
              ? a(e.value)
              : new r(function (t) {
                  t(e.value);
                }).then(s, n);
          }
          u((i = i.apply(e, t || [])).next());
        });
      },
    s =
      (this && this.__generator) ||
      function (e, t) {
        var r,
          i,
          a,
          o,
          s = {
            label: 0,
            sent: function () {
              if (1 & a[0]) throw a[1];
              return a[1];
            },
            trys: [],
            ops: [],
          };
        return (
          (o = { next: n(0), throw: n(1), return: n(2) }),
          "function" == typeof Symbol &&
            (o[Symbol.iterator] = function () {
              return this;
            }),
          o
        );
        function n(o) {
          return function (n) {
            return (function (o) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; s;)
                try {
                  if (
                    ((r = 1),
                    i &&
                      (a =
                        2 & o[0]
                          ? i.return
                          : o[0]
                            ? i.throw || ((a = i.return) && a.call(i), 0)
                            : i.next) &&
                      !(a = a.call(i, o[1])).done)
                  )
                    return a;
                  switch (((i = 0), a && (o = [2 & o[0], a.value]), o[0])) {
                    case 0:
                    case 1:
                      a = o;
                      break;
                    case 4:
                      return (s.label++, { value: o[1], done: !1 });
                    case 5:
                      (s.label++, (i = o[1]), (o = [0]));
                      continue;
                    case 7:
                      ((o = s.ops.pop()), s.trys.pop());
                      continue;
                    default:
                      if (
                        !((a = s.trys),
                        (a = a.length > 0 && a[a.length - 1]) || (6 !== o[0] && 2 !== o[0]))
                      ) {
                        s = 0;
                        continue;
                      }
                      if (3 === o[0] && (!a || (o[1] > a[0] && o[1] < a[3]))) {
                        s.label = o[1];
                        break;
                      }
                      if (6 === o[0] && s.label < a[1]) {
                        ((s.label = a[1]), (a = o));
                        break;
                      }
                      if (a && s.label < a[2]) {
                        ((s.label = a[2]), s.ops.push(o));
                        break;
                      }
                      (a[2] && s.ops.pop(), s.trys.pop());
                      continue;
                  }
                  o = t.call(e, s);
                } catch (e) {
                  ((o = [6, e]), (i = 0));
                } finally {
                  r = a = 0;
                }
              if (5 & o[0]) throw o[1];
              return { value: o[0] ? o[1] : void 0, done: !0 };
            })([o, n]);
          };
        }
      };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(543),
    u = r(102),
    p = r(49),
    c = r(2),
    m = r(52),
    l = r(51),
    d = r(232),
    y = r(5),
    b = r(28),
    h = r(1269),
    g = r(1270),
    S = r(545),
    f = r(90),
    A = r(120),
    N = r(243),
    I = (function (e) {
      function t() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        return (
          (t.dataUpdateAt = -1),
          (t.update = function (e) {
            ((t.companyId = e.companyId),
              (t.dataVersion = e.dataVersion),
              (t.name = e.name),
              (t.desc = e.desc),
              (t.isSync = e.isSync),
              (t.userId = e.userId),
              (t.userEmail = e.userEmail),
              (t.subscriptionExp = e.subscriptionExp),
              (t.subscriptionId = e.subscriptionId),
              (t.tallyLicense = e.tallyLicense),
              (t.tallyLicenseEmail = e.tallyLicenseEmail),
              (t.tallyLicenseIsInternational = e.tallyLicenseIsInternational),
              (t.isDataEntrySyncEnable = e.isDataEntrySyncEnable),
              (t.syncDetails = e.syncDetails),
              (t.fileUploadLimit = e.fileUploadLimit),
              (t.isResyncRequired = e.isResyncRequired),
              (t.dataDeleteTime = e.dataDeleteTime),
              (t.metaData = e.metaData),
              (t.lastSyncMetaData = e.lastSyncMetaData),
              (t._id = e._id),
              (t.tallyCompanyName = e.tallyCompanyName),
              (t.startingFrom = e.startingFrom),
              (t.booksFrom = e.booksFrom),
              (t.endingAt = e.endingAt),
              (t.lastVoucherDate = e.lastVoucherDate),
              (t.cmpVchId = e.cmpVchId),
              (t.altVchId = e.altVchId),
              (t.altMstId = e.altMstId),
              (t.companyChequeName = e.companyChequeName),
              (t.companyContactPerson = e.companyContactPerson),
              (t.companyContactNumber = e.companyContactNumber),
              (t.companyMailingName = e.companyMailingName),
              (t.email = e.email),
              (t.website = e.website),
              (t.phoneNumber = e.phoneNumber),
              (t.mobileNo = e.mobileNo),
              (t.cmpMobNo = e.cmpMobNo),
              (t.address = e.address),
              (t.addressList = e.addressList),
              (t.state = e.state),
              (t.pincode = e.pincode),
              (t.countryName = e.countryName),
              (t.vatTinNumber = e.vatTinNumber),
              (t.corporateIdentityNo = e.corporateIdentityNo),
              (t.interStateStNumber = e.interStateStNumber),
              (t.tanumber = e.tanumber),
              (t.stRegNumber = e.stRegNumber),
              (t.cmppfCode = e.cmppfCode),
              (t.panNumber = e.panNumber),
              (t.gstRegistrationType = e.gstRegistrationType),
              (t.gstApplicableDate = e.gstApplicableDate),
              (t.isGstCesson = e.isGstCesson),
              (t.gstDetails = e.gstDetails),
              (t.hsnDetails = e.hsnDetails),
              c.Util.isNotNull(e.gstin) && (t.gstin = e.gstin),
              (t.isMultiGstRegistration = e.isMultiGstRegistration),
              (t.destination = e.destination),
              (t.timezone = e.timezone),
              (t.syncFrom = e.syncFrom),
              (t.dataSyncDetails = e.dataSyncDetails),
              (t.isCompanyAlterIdNegative = e.isCompanyAlterIdNegative),
              c.Util.isNotNull(e.companySettings) && (t.companySettings = e.companySettings),
              (t.eInvoiceConfig = e.eInvoiceConfig),
              (t.eWayBillConfig = e.eWayBillConfig));
          }),
          t
        );
      }
      return (
        a(t, e),
        (t.prototype.getName = function () {
          return t.masterName;
        }),
        (t.prototype.getKeys = function () {
          return y.Master.keys.concat(t.keys);
        }),
        (t.prototype.parse = function (e, r) {
          return o(this, void 0, void 0, function () {
            var i, a, o;
            return s(this, function (s) {
              switch (s.label) {
                case 0:
                  return ((o = (a = i = []).push), [4, t.convert(e, r)]);
                case 1:
                  return (o.apply(a, [s.sent()]), [2, i]);
              }
            });
          });
        }),
        (t.prototype.getSyncConfig = function () {
          return t.syncconfig;
        }),
        (t.prototype.equals = function (e) {
          return !!(
            y.Master.compare(this.companyId, e.companyId) &&
            y.Master.compare(this._id, e._id) &&
            y.Master.compare(this.tallyCompanyName, e.tallyCompanyName) &&
            y.Master.compare(this.companyChequeName, e.companyChequeName) &&
            y.Master.compare(this.companyContactPerson, e.companyContactPerson) &&
            y.Master.compare(this.companyContactNumber, e.companyContactNumber) &&
            y.Master.compare(this.companyMailingName, e.companyMailingName) &&
            y.Master.compare(this.email, e.email) &&
            y.Master.compare(this.website, e.website) &&
            y.Master.compare(this.phoneNumber, e.phoneNumber) &&
            y.Master.compare(this.mobileNo, e.mobileNo) &&
            y.Master.compare(this.cmpMobNo, e.cmpMobNo) &&
            y.Master.compare(this.address, e.address) &&
            y.Master.compare(this.addressList, e.addressList) &&
            y.Master.compare(this.state, e.state) &&
            y.Master.compare(this.pincode, e.pincode) &&
            y.Master.compare(this.countryName, e.countryName) &&
            y.Master.compare(this.vatTinNumber, e.vatTinNumber) &&
            y.Master.compare(this.corporateIdentityNo, e.corporateIdentityNo) &&
            y.Master.compare(this.interStateStNumber, e.interStateStNumber) &&
            y.Master.compare(this.tanumber, e.tanumber) &&
            y.Master.compare(this.stRegNumber, e.stRegNumber) &&
            y.Master.compare(this.cmppfCode, e.cmppfCode) &&
            y.Master.compare(this.panNumber, e.panNumber) &&
            y.Master.compare(this.gstRegistrationType, e.gstRegistrationType) &&
            y.Master.compare(this.gstApplicableDate, e.gstApplicableDate) &&
            y.Master.compare(this.isGstCesson, e.isGstCesson) &&
            y.Master.compare(this.gstDetails, e.gstDetails) &&
            y.Master.compare(this.hsnDetails, e.hsnDetails) &&
            y.Master.compare(this.gstin, e.gstin) &&
            y.Master.compare(this.isMultiGstRegistration, e.isMultiGstRegistration) &&
            y.Master.compare(this.eInvoiceConfig, e.eInvoiceConfig) &&
            y.Master.compare(this.eWayBillConfig, e.eWayBillConfig)
          );
        }),
        (t.prototype.getEndDate = function () {
          var e;
          return (
            (e =
              c.Util.isNotNull(this.endingAt) && c.Util.isNotNull(this.lastVoucherDate)
                ? Math.max(this.endingAt, this.lastVoucherDate)
                : c.Util.isNotNull(this.lastVoucherDate)
                  ? this.lastVoucherDate
                  : this.endingAt) > c.DateUtil.addDate(c.DateUtil.now(), 2, m.Duration.YEAR) &&
              c.Log.warn(
                "Company End date is greater than 2 years from now: " +
                  c.DateUtil.formatDDMMMYYYY(e),
              ),
            e
          );
        }),
        (t.append = function (e, t) {
          return (void 0 !== t && (e += "" !== e ? "," + t : t), e);
        }),
        (t.prototype.updateFromTally = function (e) {
          ((this._id = e._id),
            (this.isDeleted = e.isDeleted),
            (this.tallyCompanyName = e.tallyCompanyName),
            (this.startingFrom = e.startingFrom),
            (this.booksFrom = e.booksFrom),
            (this.endingAt = e.endingAt),
            (this.lastVoucherDate = e.lastVoucherDate),
            (this.cmpVchId = e.cmpVchId),
            (this.altVchId = e.altVchId),
            (this.altMstId = e.altMstId),
            (this.companyChequeName = e.companyChequeName),
            (this.companyContactPerson = e.companyContactPerson),
            (this.companyContactNumber = e.companyContactNumber),
            (this.companyMailingName = e.companyMailingName),
            (this.email = e.email),
            (this.website = e.website),
            (this.phoneNumber = e.phoneNumber),
            (this.mobileNo = e.mobileNo),
            (this.cmpMobNo = e.cmpMobNo),
            (this.address = e.address),
            (this.addressList = e.addressList),
            (this.state = e.state),
            (this.pincode = e.pincode),
            (this.countryName = e.countryName),
            (this.vatTinNumber = e.vatTinNumber),
            (this.corporateIdentityNo = e.corporateIdentityNo),
            (this.interStateStNumber = e.interStateStNumber),
            (this.tanumber = e.tanumber),
            (this.stRegNumber = e.stRegNumber),
            (this.cmppfCode = e.cmppfCode),
            (this.panNumber = e.panNumber),
            (this.gstRegistrationType = e.gstRegistrationType),
            (this.gstApplicableDate = e.gstApplicableDate),
            (this.isGstCesson = e.isGstCesson),
            (this.gstDetails = e.gstDetails),
            (this.hsnDetails = e.hsnDetails),
            c.Util.isNotNull(e.gstin) && (this.gstin = e.gstin),
            (this.isMultiGstRegistration = e.isMultiGstRegistration),
            (this.destination = e.destination),
            (this.eInvoiceConfig = e.eInvoiceConfig),
            (this.eWayBillConfig = e.eWayBillConfig));
        }),
        (t.toObject = function (e) {
          var r = new t();
          if ((c.Util.assign(r, e), c.Util.isNotNull(e.gstDetails) && e.gstDetails.length > 0)) {
            r.gstDetails = [];
            for (var i = 0, a = e.gstDetails; i < a.length; i++) {
              var o = a[i];
              r.gstDetails.push(u.default.toObject(o));
            }
          }
          if (c.Util.isNotNull(e.hsnDetails) && e.hsnDetails.length > 0) {
            r.hsnDetails = [];
            for (var s = 0, p = e.hsnDetails; s < p.length; s++) {
              var m = p[s];
              r.hsnDetails.push(A.default.toObject(m));
            }
          }
          if (c.Util.isNotNull(e.addressList) && e.addressList.length > 0) {
            r.addressList = [];
            for (var l = 0, d = e.addressList; l < d.length; l++) {
              var y = d[l];
              r.addressList.push(b.StringItem.toObject(y));
            }
          }
          if (c.Util.isNotNull(e.dataSyncDetails) && e.dataSyncDetails.length > 0) {
            r.dataSyncDetails = [];
            for (var S = 0, f = e.dataSyncDetails; S < f.length; S++) {
              var N = f[S];
              r.dataSyncDetails.push(n.default.toObject(N));
            }
          }
          return (
            c.Util.isNotNull(e.eInvoiceConfig) &&
              (r.eInvoiceConfig = h.default.toObject(e.eInvoiceConfig)),
            c.Util.isNotNull(e.eWayBillConfig) &&
              (r.eWayBillConfig = g.default.toObject(e.eWayBillConfig)),
            r
          );
        }),
        (t.prototype.toObject = function (e) {
          return t.toObject(e);
        }),
        (t.convert = function (e, r) {
          return o(this, void 0, void 0, function () {
            var i,
              a,
              o,
              n,
              m,
              l,
              y,
              I,
              T,
              M,
              v,
              k,
              C,
              q,
              R,
              D,
              E,
              x,
              O,
              z,
              P,
              L,
              w,
              _,
              U,
              B,
              F,
              G,
              V,
              W,
              j,
              H,
              K,
              Y,
              Q,
              J,
              X;
            return s(this, function (s) {
              switch (s.label) {
                case 0:
                  if (
                    ((i = new t()),
                    c.Util.isNotNull(r) &&
                      c.Util.isNotNull(r.company) &&
                      c.Util.isNotNull(r.company.companyId) &&
                      (i.companyId = r.company.companyId),
                    (i.tallyCompanyName = c.TallyUtil.getStringValue(e, "name")),
                    (i._id =
                      c.TallyUtil.getStringValue(e, "guid") +
                      "_" +
                      i.tallyCompanyName.replace(/\s/g, "")),
                    c.Util.isNotNull(i) && c.Util.isNotNull(i.timezone)
                      ? ((i.startingFrom = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "startingfrom"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          i.timezone,
                        )),
                        (i.booksFrom = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "booksfrom"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          i.timezone,
                        )),
                        (i.endingAt = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "endingat"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          i.timezone,
                        )),
                        (i.lastVoucherDate = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "lastvoucherdate"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          i.timezone,
                        )))
                      : ((a = t.localComanyMap[i._id]),
                        (o = null),
                        c.Util.isNotNull(a) && (o = a.timezone),
                        (i.startingFrom = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "startingfrom"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          o,
                        )),
                        (i.booksFrom = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "booksfrom"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          o,
                        )),
                        (i.endingAt = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "endingat"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          o,
                        )),
                        (i.lastVoucherDate = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "lastvoucherdate"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          o,
                        ))),
                    (i.cmpVchId = c.TallyUtil.getIntValue(e, "cmpvchid")),
                    (i.altVchId = c.TallyUtil.getIntValue(e, "altvchid")),
                    (i.altMstId = c.TallyUtil.getIntValue(e, "altmstid")),
                    (i.companyChequeName = c.TallyUtil.getStringValue(e, "companychequename")),
                    (i.companyContactPerson = c.TallyUtil.getStringValue(
                      e,
                      "companycontactperson",
                    )),
                    (i.companyContactNumber = c.TallyUtil.getStringValue(
                      e,
                      "companycontactnumber",
                    )),
                    (i.companyMailingName = c.TallyUtil.getStringValue(
                      e,
                      "basiccompanyformalname",
                    )),
                    (i.email = c.TallyUtil.getStringValue(e, "email")),
                    (i.website = c.TallyUtil.getStringValue(e, "website")),
                    (i.phoneNumber = c.TallyUtil.getStringValue(e, "phonenumber")),
                    (i.mobileNo = c.TallyUtil.getStringValue(e, "mobileno")),
                    (i.cmpMobNo = c.TallyUtil.getStringValue(e, "cmpmobno")),
                    (n = c.TallyUtil.getStringValue(e, "_address1")),
                    (m = c.TallyUtil.getStringValue(e, "_address2")),
                    (l = c.TallyUtil.getStringValue(e, "_address3")),
                    (y = c.TallyUtil.getStringValue(e, "_address4")),
                    (I = c.TallyUtil.getStringValue(e, "_address5")),
                    (i.address = ""),
                    (i.address = t.append(i.address, n)),
                    (i.address = t.append(i.address, m)),
                    (i.address = t.append(i.address, l)),
                    (i.address = t.append(i.address, y)),
                    (i.address = t.append(i.address, I)),
                    (T = []),
                    c.Util.isNotNull(n) && c.Util.isNotEmpty(n) && T.push(new b.StringItem(n)),
                    c.Util.isNotNull(m) && c.Util.isNotEmpty(m) && T.push(new b.StringItem(m)),
                    c.Util.isNotNull(l) && c.Util.isNotEmpty(l) && T.push(new b.StringItem(l)),
                    c.Util.isNotNull(y) && c.Util.isNotEmpty(y) && T.push(new b.StringItem(y)),
                    c.Util.isNotNull(I) && c.Util.isNotEmpty(I) && T.push(new b.StringItem(I)),
                    (i.addressList = T),
                    (i.state = c.TallyUtil.getStringValue(e, "statename")),
                    (i.pincode = c.TallyUtil.getStringValue(e, "pincode")),
                    (i.countryName = c.TallyUtil.getStringValue(e, "countryname")),
                    (i.vatTinNumber = c.TallyUtil.getStringValue(e, "vattinnumber")),
                    (i.corporateIdentityNo = c.TallyUtil.getStringValue(
                      e,
                      "udf:corporateidentityno",
                    )),
                    c.Util.isEmptyString(i.corporateIdentityNo) &&
                      (i.corporateIdentityNo = c.TallyUtil.getStringValue(
                        e,
                        "corporateidentityno",
                      )),
                    (i.interStateStNumber = c.TallyUtil.getStringValue(e, "interstatestnumber")),
                    (i.tanumber = c.TallyUtil.getStringValue(e, "tanumber")),
                    (i.stRegNumber = c.TallyUtil.getStringValue(e, "stregnumber")),
                    (i.cmppfCode = c.TallyUtil.getStringValue(e, "cmppfcode")),
                    (i.panNumber = c.TallyUtil.getStringValue(e, "incometaxnumber")),
                    (i.gstRegistrationType = c.TallyUtil.getStringValue(e, "gstregistrationtype")),
                    c.Util.isNotNull(i) && c.Util.isNotNull(i.timezone)
                      ? (i.gstApplicableDate = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "gstapplicabledate"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          i.timezone,
                        ))
                      : (i.gstApplicableDate = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "gstapplicabledate"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                        )),
                    (i.isGstCesson = c.TallyUtil.getStringValue(e, "isgstcesson")),
                    (M = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "hsndetails.list"))),
                    c.Util.isFilledArray(M))
                  ) {
                    for (v = [], q = 0; q < M.length; ++q)
                      null !== M[q] && void 0 !== M[q] && v.push(A.default.convert(M[q], r));
                    i.hsnDetails = v;
                  }
                  if (
                    ((k = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "gstdetails.list"))),
                    c.Util.isFilledArray(k))
                  ) {
                    for (C = [], q = 0; q < k.length; ++q)
                      null !== k[q] &&
                        void 0 !== k[q] &&
                        (c.Util.isFilledArray(i.hsnDetails)
                          ? ((R = u.default.convert(k[q], r)),
                            C.push(N.default.modifyGstDetail(R, i.hsnDetails)))
                          : C.push(u.default.convert(k[q], r)));
                    i.gstDetails = C;
                  }
                  if (((D = !1), !0 !== r.updateGstIn)) return [3, 5];
                  ((D = !0), (s.label = 1));
                case 1:
                  return (
                    s.trys.push([1, 3, , 4]),
                    [4, (x = p.default.getInstance()).getGSTNumber(i)]
                  );
                case 2:
                  return ((L = s.sent()), !1 === c.Util.isEmptyString(L) && (i.gstin = L), [3, 4]);
                case 3:
                  return (
                    (E = s.sent()),
                    c.Log.warn("Failed to fetch GSTIN number: " + JSON.stringify(E)),
                    [3, 4]
                  );
                case 4:
                  return [3, 5];
                case 5:
                  return (
                    s.trys.push([5, 13, , 14]),
                    [
                      4,
                      (x = p.default.getInstance()).getTallyProdInfo(
                        d.GetTallyProductRequest.PARAM_BUILD_NUMBER,
                      ),
                    ]
                  );
                case 6:
                  return (
                    (O = s.sent()),
                    c.Util.isNotEmptyString(O) && !1 === isNaN(parseInt(O)) && parseInt(O) > 12460
                      ? [4, x.getEInvoiceConfig(i)]
                      : [3, 12]
                  );
                case 7:
                  if (
                    ((z = s.sent()),
                    !(
                      c.Util.isNotNull(z) &&
                      c.Util.isNotNull(z.envelope) &&
                      c.Util.isNotNull(z.envelope.body) &&
                      c.Util.isNotNull(z.envelope.body.data) &&
                      c.Util.isNotNull(z.envelope.body.data.collection) &&
                      c.Util.isNotNull(z.envelope.body.data.collection.taxunit)
                    ))
                  )
                    return [3, 12];
                  if (
                    ((P = z.envelope.body.data.collection.taxunit),
                    (i.isMultiGstRegistration = !1),
                    (L = void 0),
                    (w = void 0),
                    (_ = void 0),
                    (U = void 0),
                    c.Util.isFilledArray(P))
                  )
                    for (B = 0, F = P; B < F.length; B++)
                      ((G = F[B]),
                        c.TallyUtil.getBoolean(G.einvappl, "$") && (w = G),
                        c.TallyUtil.getBoolean(G.isewaybillapplicable, "$") && (_ = G),
                        c.Util.isNotEmptyString(G.gstregnumber) &&
                          (L = c.TallyUtil.getStringValue(G.gstregnumber, "$")),
                        c.Util.isNotNull(G.usedfor) &&
                          ((V = c.TallyUtil.getStringValue(G.usedfor, "$")),
                          c.Util.isNotEmptyString(V) &&
                            "gst" === V.toLowerCase() &&
                            (c.Util.isNotEmptyString(U)
                              ? c.TallyUtil.getStringValue(G.gstregnumber, "$") !== U &&
                                (i.isMultiGstRegistration = !0)
                              : (U = c.TallyUtil.getStringValue(G.gstregnumber, "$")))));
                  else
                    c.Util.isObject(P) &&
                      (c.TallyUtil.getBoolean(P.einvappl, "$") && (w = P),
                      c.TallyUtil.getBoolean(P.isewaybillapplicable, "$") && (_ = P),
                      c.Util.isNotEmptyString(P.gstregnumber) &&
                        (L = c.TallyUtil.getStringValue(P.gstregnumber, "$")));
                  return (
                    c.Util.isEmptyString(i.gstin) && c.Util.isNotEmptyString(L) && (i.gstin = L),
                    c.Util.isNotNull(w)
                      ? ((W = b.User.get()),
                        (j = S.default.EINVOICE_DATE_SYNCED + "_" + i.companyId),
                        [4, (H = new f.default(W.id)).get(j)])
                      : [3, 11]
                  );
                case 8:
                  return (
                    (K = s.sent()),
                    (Y = c.DateUtil.now()),
                    (Q = !0),
                    c.Util.isNotNull(K) &&
                      c.Util.isNotNull(K.data) &&
                      c.Util.isNumber(K.data) &&
                      ((Y = K.data), (Q = !1)),
                    (i.eInvoiceConfig = h.default.convert(w, i, D, Y)),
                    i.eInvoiceConfig.dateOfSync !== Y || Q
                      ? ((J = new S.default(j, i.eInvoiceConfig.dateOfSync)), [4, H.set(J)])
                      : [3, 10]
                  );
                case 9:
                  (s.sent(), (s.label = 10));
                case 10:
                  return ((i.eWayBillConfig = g.default.convert(w, i, D, Y)), [3, 12]);
                case 11:
                  (c.Util.isNotNull(_) &&
                    (i.eWayBillConfig = g.default.convert(_, i, D, c.DateUtil.now())),
                    (s.label = 12));
                case 12:
                  return [3, 14];
                case 13:
                  return (
                    (X = s.sent()),
                    c.Log.warn("Failed to fetch eInvoice Config: " + JSON.stringify(X)),
                    [3, 14]
                  );
                case 14:
                  return ((i.destination = c.TallyUtil.getStringValue(e, "destination")), [2, i]);
              }
            });
          });
        }),
        (t.getServerObjects = function (e) {
          return (
            delete e.startingFrom,
            delete e.booksFrom,
            delete e.endingAt,
            delete e.lastVoucherDate,
            delete e.cmpVchId,
            delete e.altVchId,
            delete e.altMstId,
            delete e.dataUpdateAt,
            delete e.companyChequeName,
            delete e.companyContactPerson,
            delete e.companyContactNumber,
            delete e.companyMailingName,
            delete e.email,
            delete e.website,
            delete e.phoneNumber,
            delete e.mobileNo,
            delete e.cmpMobNo,
            delete e.address,
            delete e.addressList,
            delete e.pincode,
            delete e.countryName,
            delete e.vatTinNumber,
            delete e.corporateIdentityNo,
            delete e.interStateStNumber,
            delete e.tanumber,
            delete e.stRegNumber,
            delete e.cmppfCode,
            delete e.panNumber,
            delete e.gstin,
            delete e.gstRegistrationType,
            delete e.gstApplicableDate,
            delete e.isGstCesson,
            delete e.gstDetails,
            delete e.isSyncing,
            delete e.lastSync,
            delete e.syncPercent,
            delete e.err,
            delete e.isOpenInTally,
            delete e.isDeleted,
            delete e.eInvoiceConfig,
            delete e.eWayBillConfig,
            e
          );
        }),
        (t.prototype.getTallyCompanyName = function () {
          if (c.Util.isNotNull(this.tallyCompanyName)) return this.tallyCompanyName.trim();
          throw new Error("Company name not found");
        }),
        (t.prototype.isPendingBillSync = function () {
          return !(c.Util.isNull(this.syncFrom) || this.syncFrom <= this.startingFrom);
        }),
        (t.prototype.getStartDate = function () {
          return c.Util.isNotNull(this.syncFrom) && this.syncFrom > this.startingFrom
            ? this.syncFrom
            : this.startingFrom;
        }),
        (t.setLocalCompany = function (e) {
          ((t.localComanyMap = {}),
            c.Util.isFilledArray(e) &&
              e.forEach(function (e) {
                t.localComanyMap[e._id] = e;
              }));
        }),
        (t.initializeLastSyncMeta = function (e) {
          return e.map(function (e) {
            if (c.Util.isNotNull(e))
              return (
                c.Util.isNull(e.lastSyncMetaData) && (e.lastSyncMetaData = {}),
                c.Util.isNull(e.lastSyncMetaData.lastFileUploadedAtServer) &&
                  (e.lastSyncMetaData.lastFileUploadedAtServer = 0),
                c.Util.isNull(e.lastSyncMetaData.startValidatingLastSyncDate) &&
                  (e.lastSyncMetaData.startValidatingLastSyncDate = !1),
                c.Util.isNull(e.lastSyncMetaData.lastFileUploadedDeviceId) &&
                  (e.lastSyncMetaData.lastFileUploadedDeviceId = null),
                e
              );
          });
        }),
        (t.localComanyMap = {}),
        (t.masterName = "Company"),
        (t.syncconfig = new l.SyncConfig(t.masterName, 6e4, 0)),
        (t.keys = [
          "GUID",
          "NAME",
          "STATE",
          "STARTINGFROM",
          "BOOKSFROM",
          "ENDINGAT",
          "LASTVOUCHERDATE",
          "CMPVCHID",
          "ALTVCHID",
          "ALTMSTID",
          "ISAGGREGATE",
          "BASICCOMPANYFORMALNAME",
          "COMPANYCHEQUENAME",
          "COMPANYCONTACTPERSON",
          "COMPANYCONTACTNUMBER",
          "EMAIL",
          "WEBSITE",
          "PHONENUMBER",
          "CMPMOBNO",
          "MOBILENO",
          "_ADDRESS1",
          "_ADDRESS2",
          "_ADDRESS3",
          "_ADDRESS4",
          "_ADDRESS5",
          "STATENAME",
          "PINCODE",
          "COUNTRYNAME",
          "VATTINNUMBER",
          "CORPORATEIDENTITYNO",
          "UDF:CORPORATEIDENTITYNO",
          "INTERSTATESTNUMBER",
          "TANUMBER",
          "STREGNUMBER",
          "CMPPFCODE",
          "INCOMETAXNUMBER",
          "GSTREGISTRATIONTYPE",
          "GSTAPPLICABLEDATE",
          "ISGSTCESSON",
          "GSTDETAILS.LIST",
          "HSNDETAILS.LIST",
          "DESTINATION",
        ]),
        t
      );
    })(y.Master);
  ((t.default = I),
    (function (e) {
      ((e.BA_DESKTOP_APP_NOT_OPEN = "BA_DESKTOP_APP_NOT_OPEN"),
        (e.TALLY_NOT_OPEN_SAME_COMPUTER = "TALLY_NOT_OPEN_SAME_COMPUTER"),
        (e.TALLY_ODBC_PORT_NOT_OPEN = "TALLY_ODBC_PORT_NOT_OPEN"),
        (e.TALLY_NOT_OPEN_DIFF_COMPUTER = "TALLY_NOT_OPEN_DIFF_COMPUTER"),
        (e.COMPANY_NOT_OPEN = "COMPANY_NOT_OPEN"),
        (e.SYNC_ERROR = "SYNC_ERROR"),
        (e.SYNC_SUCCESS = "SUCCESS"));
    })(t.SYNC_STATUS_CODE || (t.SYNC_STATUS_CODE = {})));
};
