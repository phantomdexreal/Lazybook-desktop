// webpack module #59 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

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
        n(e, t),
          (e.prototype = null === t ? Object.create(t) : ((r.prototype = t.prototype), new r()));
      }),
    i =
      (this && this.__awaiter) ||
      function (e, t, r, n) {
        return new (r || (r = Promise))(function (a, i) {
          function o(e) {
            try {
              u(n.next(e));
            } catch (e) {
              i(e);
            }
          }
          function s(e) {
            try {
              u(n.throw(e));
            } catch (e) {
              i(e);
            }
          }
          function u(e) {
            e.done
              ? a(e.value)
              : new r(function (t) {
                  t(e.value);
                }).then(o, s);
          }
          u((n = n.apply(e, t || [])).next());
        });
      },
    o =
      (this && this.__generator) ||
      function (e, t) {
        var r,
          n,
          a,
          i,
          o = {
            label: 0,
            sent: function () {
              if (1 & a[0]) throw a[1];
              return a[1];
            },
            trys: [],
            ops: [],
          };
        return (
          (i = { next: s(0), throw: s(1), return: s(2) }),
          "function" == typeof Symbol &&
            (i[Symbol.iterator] = function () {
              return this;
            }),
          i
        );
        function s(i) {
          return function (s) {
            return (function (i) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; o; )
                try {
                  if (
                    ((r = 1),
                    n &&
                      (a =
                        2 & i[0]
                          ? n.return
                          : i[0]
                          ? n.throw || ((a = n.return) && a.call(n), 0)
                          : n.next) &&
                      !(a = a.call(n, i[1])).done)
                  )
                    return a;
                  switch (((n = 0), a && (i = [2 & i[0], a.value]), i[0])) {
                    case 0:
                    case 1:
                      a = i;
                      break;
                    case 4:
                      return o.label++, { value: i[1], done: !1 };
                    case 5:
                      o.label++, (n = i[1]), (i = [0]);
                      continue;
                    case 7:
                      (i = o.ops.pop()), o.trys.pop();
                      continue;
                    default:
                      if (
                        !((a = o.trys),
                        (a = a.length > 0 && a[a.length - 1]) || (6 !== i[0] && 2 !== i[0]))
                      ) {
                        o = 0;
                        continue;
                      }
                      if (3 === i[0] && (!a || (i[1] > a[0] && i[1] < a[3]))) {
                        o.label = i[1];
                        break;
                      }
                      if (6 === i[0] && o.label < a[1]) {
                        (o.label = a[1]), (a = i);
                        break;
                      }
                      if (a && o.label < a[2]) {
                        (o.label = a[2]), o.ops.push(i);
                        break;
                      }
                      a[2] && o.ops.pop(), o.trys.pop();
                      continue;
                  }
                  i = t.call(e, o);
                } catch (e) {
                  (i = [6, e]), (n = 0);
                } finally {
                  r = a = 0;
                }
              if (5 & i[0]) throw i[1];
              return { value: i[0] ? i[1] : void 0, done: !0 };
            })([i, s]);
          };
        }
      };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var s = r(506),
    u = r(94),
    p = r(35),
    c = r(0),
    l = r(45),
    m = r(49),
    d = r(143),
    y = r(5),
    b = r(29),
    h = r(1138),
    f = r(1139),
    g = r(201),
    M = r(83),
    S = r(111),
    A = r(229),
    O = (function (e) {
      function t() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        return (
          (t.dataUpdateAt = -1),
          (t.update = function (e) {
            (t.companyId = e.companyId),
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
              (t.eWayBillConfig = e.eWayBillConfig);
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
          return i(this, void 0, void 0, function () {
            var n, a, i;
            return o(this, function (o) {
              switch (o.label) {
                case 0:
                  return (i = (a = n = []).push), [4, t.convert(e, r)];
                case 1:
                  return i.apply(a, [o.sent()]), [2, n];
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
                : this.endingAt) > c.DateUtil.addDate(c.DateUtil.now(), 2, l.Duration.YEAR) &&
              c.Log.warn(
                "Company End date is greater than 2 years from now: " +
                  c.DateUtil.formatDDMMMYYYY(e)
              ),
            e
          );
        }),
        (t.append = function (e, t) {
          return void 0 !== t && (e += "" !== e ? "," + t : t), e;
        }),
        (t.prototype.updateFromTally = function (e) {
          (this._id = e._id),
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
            (this.eWayBillConfig = e.eWayBillConfig);
        }),
        (t.toObject = function (e) {
          var r = new t();
          if ((c.Util.assign(r, e), c.Util.isNotNull(e.gstDetails) && e.gstDetails.length > 0)) {
            r.gstDetails = [];
            for (var n = 0, a = e.gstDetails; n < a.length; n++) {
              var i = a[n];
              r.gstDetails.push(u.default.toObject(i));
            }
          }
          if (c.Util.isNotNull(e.hsnDetails) && e.hsnDetails.length > 0) {
            r.hsnDetails = [];
            for (var o = 0, p = e.hsnDetails; o < p.length; o++) {
              var l = p[o];
              r.hsnDetails.push(S.default.toObject(l));
            }
          }
          if (c.Util.isNotNull(e.addressList) && e.addressList.length > 0) {
            r.addressList = [];
            for (var m = 0, d = e.addressList; m < d.length; m++) {
              var y = d[m];
              r.addressList.push(b.StringItem.toObject(y));
            }
          }
          if (c.Util.isNotNull(e.dataSyncDetails) && e.dataSyncDetails.length > 0) {
            r.dataSyncDetails = [];
            for (var g = 0, M = e.dataSyncDetails; g < M.length; g++) {
              var A = M[g];
              r.dataSyncDetails.push(s.default.toObject(A));
            }
          }
          return (
            c.Util.isNotNull(e.eInvoiceConfig) &&
              (r.eInvoiceConfig = h.default.toObject(e.eInvoiceConfig)),
            c.Util.isNotNull(e.eWayBillConfig) &&
              (r.eWayBillConfig = f.default.toObject(e.eWayBillConfig)),
            r
          );
        }),
        (t.prototype.toObject = function (e) {
          return t.toObject(e);
        }),
        (t.convert = function (e, r) {
          return i(this, void 0, void 0, function () {
            var n,
              a,
              i,
              s,
              l,
              m,
              y,
              O,
              N,
              v,
              T,
              z,
              I,
              q,
              k,
              R,
              C,
              E,
              _,
              D,
              L,
              x,
              w,
              P,
              W,
              B,
              U,
              F,
              G,
              j,
              V,
              Y,
              H,
              K,
              X,
              J,
              Q;
            return o(this, function (o) {
              switch (o.label) {
                case 0:
                  if (
                    ((n = new t()),
                    c.Util.isNotNull(r) &&
                      c.Util.isNotNull(r.company) &&
                      c.Util.isNotNull(r.company.companyId) &&
                      (n.companyId = r.company.companyId),
                    (n.tallyCompanyName = c.TallyUtil.getStringValue(e, "name")),
                    (n._id =
                      c.TallyUtil.getStringValue(e, "guid") +
                      "_" +
                      n.tallyCompanyName.replace(/\s/g, "")),
                    c.Util.isNotNull(n) && c.Util.isNotNull(n.timezone)
                      ? ((n.startingFrom = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "startingfrom"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          n.timezone
                        )),
                        (n.booksFrom = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "booksfrom"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          n.timezone
                        )),
                        (n.endingAt = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "endingat"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          n.timezone
                        )),
                        (n.lastVoucherDate = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "lastvoucherdate"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          n.timezone
                        )))
                      : ((a = t.localComanyMap[n._id]),
                        (i = null),
                        c.Util.isNotNull(a) && (i = a.timezone),
                        (n.startingFrom = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "startingfrom"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          i
                        )),
                        (n.booksFrom = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "booksfrom"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          i
                        )),
                        (n.endingAt = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "endingat"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          i
                        )),
                        (n.lastVoucherDate = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "lastvoucherdate"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          i
                        ))),
                    (n.cmpVchId = c.TallyUtil.getIntValue(e, "cmpvchid")),
                    (n.altVchId = c.TallyUtil.getIntValue(e, "altvchid")),
                    (n.altMstId = c.TallyUtil.getIntValue(e, "altmstid")),
                    (n.companyChequeName = c.TallyUtil.getStringValue(e, "companychequename")),
                    (n.companyContactPerson = c.TallyUtil.getStringValue(
                      e,
                      "companycontactperson"
                    )),
                    (n.companyContactNumber = c.TallyUtil.getStringValue(
                      e,
                      "companycontactnumber"
                    )),
                    (n.companyMailingName = c.TallyUtil.getStringValue(
                      e,
                      "basiccompanyformalname"
                    )),
                    (n.email = c.TallyUtil.getStringValue(e, "email")),
                    (n.website = c.TallyUtil.getStringValue(e, "website")),
                    (n.phoneNumber = c.TallyUtil.getStringValue(e, "phonenumber")),
                    (n.mobileNo = c.TallyUtil.getStringValue(e, "mobileno")),
                    (n.cmpMobNo = c.TallyUtil.getStringValue(e, "cmpmobno")),
                    (s = c.TallyUtil.getStringValue(e, "_address1")),
                    (l = c.TallyUtil.getStringValue(e, "_address2")),
                    (m = c.TallyUtil.getStringValue(e, "_address3")),
                    (y = c.TallyUtil.getStringValue(e, "_address4")),
                    (O = c.TallyUtil.getStringValue(e, "_address5")),
                    (n.address = ""),
                    (n.address = t.append(n.address, s)),
                    (n.address = t.append(n.address, l)),
                    (n.address = t.append(n.address, m)),
                    (n.address = t.append(n.address, y)),
                    (n.address = t.append(n.address, O)),
                    (N = []),
                    c.Util.isNotNull(s) && c.Util.isNotEmpty(s) && N.push(new b.StringItem(s)),
                    c.Util.isNotNull(l) && c.Util.isNotEmpty(l) && N.push(new b.StringItem(l)),
                    c.Util.isNotNull(m) && c.Util.isNotEmpty(m) && N.push(new b.StringItem(m)),
                    c.Util.isNotNull(y) && c.Util.isNotEmpty(y) && N.push(new b.StringItem(y)),
                    c.Util.isNotNull(O) && c.Util.isNotEmpty(O) && N.push(new b.StringItem(O)),
                    (n.addressList = N),
                    (n.state = c.TallyUtil.getStringValue(e, "statename")),
                    (n.pincode = c.TallyUtil.getStringValue(e, "pincode")),
                    (n.countryName = c.TallyUtil.getStringValue(e, "countryname")),
                    (n.vatTinNumber = c.TallyUtil.getStringValue(e, "vattinnumber")),
                    (n.corporateIdentityNo = c.TallyUtil.getStringValue(
                      e,
                      "udf:corporateidentityno"
                    )),
                    c.Util.isEmptyString(n.corporateIdentityNo) &&
                      (n.corporateIdentityNo = c.TallyUtil.getStringValue(
                        e,
                        "corporateidentityno"
                      )),
                    (n.interStateStNumber = c.TallyUtil.getStringValue(e, "interstatestnumber")),
                    (n.tanumber = c.TallyUtil.getStringValue(e, "tanumber")),
                    (n.stRegNumber = c.TallyUtil.getStringValue(e, "stregnumber")),
                    (n.cmppfCode = c.TallyUtil.getStringValue(e, "cmppfcode")),
                    (n.panNumber = c.TallyUtil.getStringValue(e, "incometaxnumber")),
                    (n.gstRegistrationType = c.TallyUtil.getStringValue(e, "gstregistrationtype")),
                    c.Util.isNotNull(n) && c.Util.isNotNull(n.timezone)
                      ? (n.gstApplicableDate = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "gstapplicabledate"),
                          c.DateUtil.FORMAT_YYYYMMDD,
                          n.timezone
                        ))
                      : (n.gstApplicableDate = c.TallyUtil.parseDate(
                          c.TallyUtil.getJsonValue(e, "gstapplicabledate"),
                          c.DateUtil.FORMAT_YYYYMMDD
                        )),
                    (n.isGstCesson = c.TallyUtil.getStringValue(e, "isgstcesson")),
                    (v = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "hsndetails.list"))),
                    c.Util.isFilledArray(v))
                  ) {
                    for (T = [], q = 0; q < v.length; ++q)
                      null !== v[q] && void 0 !== v[q] && T.push(S.default.convert(v[q], r));
                    n.hsnDetails = T;
                  }
                  if (
                    ((z = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "gstdetails.list"))),
                    c.Util.isFilledArray(z))
                  ) {
                    for (I = [], q = 0; q < z.length; ++q)
                      null !== z[q] &&
                        void 0 !== z[q] &&
                        (c.Util.isFilledArray(n.hsnDetails)
                          ? ((k = u.default.convert(z[q], r)),
                            I.push(A.default.modifyGstDetail(k, n.hsnDetails)))
                          : I.push(u.default.convert(z[q], r)));
                    n.gstDetails = I;
                  }
                  if (((R = !1), !0 !== r.updateGstIn)) return [3, 5];
                  (R = !0), (o.label = 1);
                case 1:
                  return (
                    o.trys.push([1, 3, , 4]), [4, (E = p.default.getInstance()).getGSTNumber(n)]
                  );
                case 2:
                  return (x = o.sent()), !1 === c.Util.isEmptyString(x) && (n.gstin = x), [3, 4];
                case 3:
                  return (
                    (C = o.sent()),
                    c.Log.warn("Failed to fetch GSTIN number: " + JSON.stringify(C)),
                    [3, 4]
                  );
                case 4:
                  return [3, 5];
                case 5:
                  return (
                    o.trys.push([5, 13, , 14]),
                    [
                      4,
                      (E = p.default.getInstance()).getTallyProdInfo(
                        d.GetTallyProductRequest.PARAM_BUILD_NUMBER
                      ),
                    ]
                  );
                case 6:
                  return (
                    (_ = o.sent()),
                    c.Util.isNotEmptyString(_) && !1 === isNaN(parseInt(_)) && parseInt(_) > 12460
                      ? [4, E.getEInvoiceConfig(n)]
                      : [3, 12]
                  );
                case 7:
                  if (
                    ((D = o.sent()),
                    !(
                      c.Util.isNotNull(D) &&
                      c.Util.isNotNull(D.envelope) &&
                      c.Util.isNotNull(D.envelope.body) &&
                      c.Util.isNotNull(D.envelope.body.data) &&
                      c.Util.isNotNull(D.envelope.body.data.collection) &&
                      c.Util.isNotNull(D.envelope.body.data.collection.taxunit)
                    ))
                  )
                    return [3, 12];
                  if (
                    ((L = D.envelope.body.data.collection.taxunit),
                    (n.isMultiGstRegistration = !1),
                    (x = void 0),
                    (w = void 0),
                    (P = void 0),
                    (W = void 0),
                    c.Util.isFilledArray(L))
                  )
                    for (B = 0, U = L; B < U.length; B++)
                      (F = U[B]),
                        c.TallyUtil.getBoolean(F.einvappl, "$") && (w = F),
                        c.TallyUtil.getBoolean(F.isewaybillapplicable, "$") && (P = F),
                        c.Util.isNotEmptyString(F.gstregnumber) &&
                          (x = c.TallyUtil.getStringValue(F.gstregnumber, "$")),
                        c.Util.isNotNull(F.usedfor) &&
                          ((G = c.TallyUtil.getStringValue(F.usedfor, "$")),
                          c.Util.isNotEmptyString(G) &&
                            "gst" === G.toLowerCase() &&
                            (c.Util.isNotEmptyString(W)
                              ? c.TallyUtil.getStringValue(F.gstregnumber, "$") !== W &&
                                (n.isMultiGstRegistration = !0)
                              : (W = c.TallyUtil.getStringValue(F.gstregnumber, "$"))));
                  else
                    c.Util.isObject(L) &&
                      (c.TallyUtil.getBoolean(L.einvappl, "$") && (w = L),
                      c.TallyUtil.getBoolean(L.isewaybillapplicable, "$") && (P = L),
                      c.Util.isNotEmptyString(L.gstregnumber) &&
                        (x = c.TallyUtil.getStringValue(L.gstregnumber, "$")));
                  return (
                    c.Util.isEmptyString(n.gstin) && c.Util.isNotEmptyString(x) && (n.gstin = x),
                    c.Util.isNotNull(w)
                      ? ((j = b.User.get()),
                        (V = g.default.EINVOICE_DATE_SYNCED + "_" + n.companyId),
                        [4, (Y = new M.default(j.id)).get(V)])
                      : [3, 11]
                  );
                case 8:
                  return (
                    (H = o.sent()),
                    (K = c.DateUtil.now()),
                    (X = !0),
                    c.Util.isNotNull(H) &&
                      c.Util.isNotNull(H.data) &&
                      c.Util.isNumber(H.data) &&
                      ((K = H.data), (X = !1)),
                    (n.eInvoiceConfig = h.default.convert(w, n, R, K)),
                    n.eInvoiceConfig.dateOfSync !== K || X
                      ? ((J = new g.default(V, n.eInvoiceConfig.dateOfSync)), [4, Y.set(J)])
                      : [3, 10]
                  );
                case 9:
                  o.sent(), (o.label = 10);
                case 10:
                  return (n.eWayBillConfig = f.default.convert(w, n, R, K)), [3, 12];
                case 11:
                  c.Util.isNotNull(P) &&
                    (n.eWayBillConfig = f.default.convert(P, n, R, c.DateUtil.now())),
                    (o.label = 12);
                case 12:
                  return [3, 14];
                case 13:
                  return (
                    (Q = o.sent()),
                    c.Log.warn("Failed to fetch eInvoice Config: " + JSON.stringify(Q)),
                    [3, 14]
                  );
                case 14:
                  return (n.destination = c.TallyUtil.getStringValue(e, "destination")), [2, n];
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
          (t.localComanyMap = {}),
            c.Util.isFilledArray(e) &&
              e.forEach(function (e) {
                t.localComanyMap[e._id] = e;
              });
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
        (t.syncconfig = new m.SyncConfig(t.masterName, 6e4, 0)),
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
  (t.default = O),
    (function (e) {
      (e.BA_DESKTOP_APP_NOT_OPEN = "BA_DESKTOP_APP_NOT_OPEN"),
        (e.TALLY_NOT_OPEN_SAME_COMPUTER = "TALLY_NOT_OPEN_SAME_COMPUTER"),
        (e.TALLY_ODBC_PORT_NOT_OPEN = "TALLY_ODBC_PORT_NOT_OPEN"),
        (e.TALLY_NOT_OPEN_DIFF_COMPUTER = "TALLY_NOT_OPEN_DIFF_COMPUTER"),
        (e.COMPANY_NOT_OPEN = "COMPANY_NOT_OPEN"),
        (e.SYNC_ERROR = "SYNC_ERROR"),
        (e.SYNC_SUCCESS = "SUCCESS");
    })(t.SYNC_STATUS_CODE || (t.SYNC_STATUS_CODE = {}));
};
