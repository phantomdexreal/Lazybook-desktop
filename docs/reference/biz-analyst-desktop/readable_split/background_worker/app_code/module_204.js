// webpack module #204 (from background_worker, BA Mobile Connector 8.4.41)
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
              for (; o;)
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
                      return (o.label++, { value: i[1], done: !1 });
                    case 5:
                      (o.label++, (n = i[1]), (i = [0]));
                      continue;
                    case 7:
                      ((i = o.ops.pop()), o.trys.pop());
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
                        ((o.label = a[1]), (a = i));
                        break;
                      }
                      if (a && o.label < a[2]) {
                        ((o.label = a[2]), o.ops.push(i));
                        break;
                      }
                      (a[2] && o.ops.pop(), o.trys.pop());
                      continue;
                  }
                  i = t.call(e, o);
                } catch (e) {
                  ((i = [6, e]), (n = 0));
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
  var s = r(8),
    u = r(94),
    p = r(28),
    c = r(0),
    l = r(49),
    m = r(5),
    d = r(29),
    y = r(111),
    b = r(1037),
    h = r(1038),
    f = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        a(t, e),
        (t.prototype.getName = function () {
          return t.masterName;
        }),
        (t.prototype.getKeys = function () {
          return m.Master.keys.concat(t.keys);
        }),
        (t.prototype.parse = function (e, r) {
          return i(this, void 0, void 0, function () {
            var n;
            return o(this, function (a) {
              return ((n = []).push(t.convert(e, r)), [2, n]);
            });
          });
        }),
        (t.prototype.getSyncConfig = function () {
          return t.syncconfig;
        }),
        (t.prototype.equals = function (e) {
          return !!(
            m.Master.compare(this._id, e._id) &&
            m.Master.compare(this.isDeleted, e.isDeleted) &&
            m.Master.compare(this.name, e.name) &&
            m.Master.compare(this.parentGroup, e.parentGroup) &&
            m.Master.compare(this.aliases, e.aliases) &&
            m.Master.compare(this.openingAmount, e.openingAmount) &&
            m.Master.compare(this.creditPeriodMs, e.creditPeriodMs) &&
            m.Master.compare(this.creditLimit, e.creditLimit) &&
            m.Master.compare(this.contact, e.contact) &&
            m.Master.compare(this.mailingDetails, e.mailingDetails) &&
            m.Master.compare(this.vatNo, e.vatNo) &&
            m.Master.compare(this.cstNo, e.cstNo) &&
            m.Master.compare(this.taxType, e.taxType) &&
            m.Master.compare(this.exciseNo, e.exciseNo) &&
            m.Master.compare(this.pendingBills, e.pendingBills) &&
            m.Master.compare(this.groupList, e.groupList) &&
            m.Master.compare(this.bank, e.bank) &&
            m.Master.compare(this.performance, e.performance) &&
            m.Master.compare(this.partyGstIn, e.partyGstIn) &&
            m.Master.compare(this.gstDutyHead, e.gstDutyHead) &&
            m.Master.compare(this.gstDutyHeadNew, e.gstDutyHeadNew) &&
            m.Master.compare(this.gstApplicable, e.gstApplicable) &&
            m.Master.compare(this.alias, e.alias) &&
            m.Master.compare(this.gstDetails, e.gstDetails) &&
            m.Master.compare(this.hsnDetails, e.hsnDetails) &&
            m.Master.compare(this.gstRegDetails, e.gstRegDetails) &&
            m.Master.compare(this.gstAppropriateTo, e.gstAppropriateTo) &&
            m.Master.compare(this.appropriateFor, e.appropriateFor) &&
            m.Master.compare(this.isBillWiseOff, e.isBillWiseOff) &&
            m.Master.compare(this.desc, e.desc) &&
            m.Master.compare(this.priceLevel, e.priceLevel) &&
            m.Master.compare(this.rateOfTax, e.rateOfTax) &&
            m.Master.compare(this.gstRegistrationType, e.gstRegistrationType) &&
            m.Master.compare(this.exciseAllocType, e.exciseAllocType) &&
            m.Master.compare(this.gstNatureOfSupply, e.gstNatureOfSupply) &&
            m.Master.compare(this.gstTypeOfSupply, e.gstTypeOfSupply) &&
            m.Master.compare(this.roundingMethod, e.roundingMethod) &&
            m.Master.compare(this.roundingLimit, e.roundingLimit) &&
            m.Master.compare(this.typeOfLedger, e.typeOfLedger)
          );
        }),
        (t.prototype.updateFromTally = function (e) {
          ((this._id = e._id),
            (this.isDeleted = e.isDeleted),
            (this.name = e.name),
            (this.parentGroup = e.parentGroup),
            (this.aliases = e.aliases),
            (this.openingAmount = e.openingAmount),
            (this.creditPeriodMs = e.creditPeriodMs),
            (this.creditLimit = e.creditLimit),
            (this.contact = e.contact),
            (this.mailingDetails = e.mailingDetails),
            (this.vatNo = e.vatNo),
            (this.cstNo = e.cstNo),
            (this.taxType = e.taxType),
            (this.exciseNo = e.exciseNo),
            (this.pendingBills = e.pendingBills),
            (this.groupList = e.groupList),
            (this.bank = e.bank),
            (this.performance = e.performance),
            (this.gstNatureOfSupply = e.gstNatureOfSupply),
            (this.gstTypeOfSupply = e.gstTypeOfSupply),
            (this.partyGstIn = e.partyGstIn),
            (this.gstDutyHead = e.gstDutyHead),
            (this.gstDutyHeadNew = e.gstDutyHeadNew),
            (this.gstDetails = e.gstDetails),
            (this.hsnDetails = e.hsnDetails),
            (this.gstRegDetails = e.gstRegDetails),
            (this.gstAppropriateTo = e.gstAppropriateTo),
            (this.appropriateFor = e.appropriateFor),
            (this.gstApplicable = e.gstApplicable),
            (this.rateOfTax = e.rateOfTax),
            (this.exciseAllocType = e.exciseAllocType),
            (this.alias = e.alias),
            (this.isBillWiseOff = e.isBillWiseOff),
            (this.desc = e.desc),
            (this.priceLevel = e.priceLevel),
            (this.gstRegistrationType = e.gstRegistrationType),
            (this.roundingMethod = e.roundingMethod),
            (this.roundingLimit = e.roundingLimit),
            (this.typeOfLedger = e.typeOfLedger));
        }),
        (t.prototype.updateOldName = function (e) {
          m.Master.compare(this.name, e.name) || (this.oldName = this.name);
        }),
        (t.toObject = function (e) {
          var r = new t();
          if (
            (c.Util.assign(r, e), c.Util.isNotNull(e.pendingBills) && e.pendingBills.length > 0)
          ) {
            r.pendingBills = [];
            for (var n = 0, a = e.pendingBills; n < a.length; n++) {
              var i = a[n];
              r.pendingBills.push(p.Bill.toObject(i));
            }
          }
          if (
            (c.Util.isNotNull(e.contact) && (r.contact = p.LedgerContact.toObject(e.contact)),
            c.Util.isNotNull(e.mailingDetails) && e.mailingDetails.length > 0)
          ) {
            r.mailingDetails = [];
            for (var o = 0, s = e.mailingDetails; o < s.length; o++) {
              var l = s[o];
              r.mailingDetails.push(h.default.toObject(l));
            }
          }
          if (c.Util.isNotNull(e.groupList) && e.groupList.length > 0) {
            r.groupList = [];
            for (var m = 0, f = e.groupList; m < f.length; m++) {
              var g = f[m];
              r.groupList.push(d.StringItem.toObject(g));
            }
          }
          if (c.Util.isNotNull(e.aliases) && e.aliases.length > 0) {
            r.aliases = [];
            for (var M = 0, S = e.aliases; M < S.length; M++) {
              var A = S[M];
              r.aliases.push(d.StringItem.toObject(A));
            }
          }
          if (
            (c.Util.isNotNull(e.bank) && (r.bank = p.LedgerBank.toObject(e.bank)),
            c.Util.isNotNull(e.gstDetails) && e.gstDetails.length > 0)
          ) {
            r.gstDetails = [];
            for (var O = 0, N = e.gstDetails; O < N.length; O++) {
              var v = N[O];
              r.gstDetails.push(u.default.toObject(v));
            }
          }
          if (c.Util.isNotNull(e.hsnDetails) && e.hsnDetails.length > 0) {
            r.hsnDetails = [];
            for (var T = 0, z = e.hsnDetails; T < z.length; T++) {
              var I = z[T];
              r.hsnDetails.push(y.default.toObject(I));
            }
          }
          if (c.Util.isNotNull(e.gstRegDetails) && e.gstRegDetails.length > 0) {
            r.gstRegDetails = [];
            for (var q = 0, k = e.gstRegDetails; q < k.length; q++) {
              var R = k[q];
              r.gstRegDetails.push(b.default.toObject(R));
            }
          }
          return r;
        }),
        (t.masterName = "Ledger"),
        (t.keys = [
          "NAME",
          "GUID",
          "PARENT",
          "LANGUAGENAME.LIST",
          "ADDRESS.LIST",
          "STATENAME",
          "COUNTRYNAME",
          "PINCODE",
          "EMAIL",
          "EMAILCC",
          "LEDGERPHONE",
          "LEDGERMOBILE",
          "LEDGERCONTACT",
          "LEDMAILINGDETAILS.LIST",
          "LEDGSTREGDETAILS.LIST",
          "LEDSTATENAME",
          "OPENINGBALANCE",
          "BILLALLOCATIONS.LIST",
          "GSTREGISTRATIONTYPE",
          "VATTINNUMBER",
          "INTERSTATESTNUMBER",
          "EXCISEREGNO",
          "PARTYGSTIN",
          "GSTDUTYHEAD",
          "GSTDETAILS.LIST",
          "HSNDETAILS.LIST",
          "GSTAPPROPRIATETO",
          "TAXTYPE",
          "GSTAPPLICABLE",
          "APPROPRIATEFOR",
          "GSTNATUREOFSUPPLY",
          "GSTTYPEOFSUPPLY",
          "RATEOFTAXCALCULATION",
          "ISBILLWISEON",
          "BILLCREDITPERIOD",
          "CREDITLIMIT",
          "PERFORMANCE",
          "BANKDETAILS",
          "BANKBRANCHNAME",
          "BRANCHNAME",
          "BANKACCHOLDERNAME",
          "BANKBSRCODE",
          "IFSCODE",
          "BRANCHCODE",
          "BANKINGCONFIGBANK",
          "DESCRIPTION",
          "PRICELEVEL",
          "ROUNDINGMETHOD",
          "ROUNDINGLIMIT",
          "EXCISEALLOCTYPE",
          "VATDEALERNATURE",
        ]),
        (t.syncconfig = new l.SyncConfig(t.masterName, 6e5, 0)),
        (t.convert = function (e, r) {
          var n = new t();
          ((n._id = c.TallyUtil.getStringValue(e, "guid")),
            (n.masterId = c.TallyUtil.getIntValue(e, "masterid")),
            (n.alterId = c.TallyUtil.getIntValue(e, "alterid")),
            (n.name = c.TallyUtil.getStringValue(e, "name", !0)),
            c.Util.isEmptyString(n._id) && (n._id = n.name),
            (n.parentGroup = c.TallyUtil.getStringValue(e, "parent")),
            (n.openingAmount =
              -1 * c.TallyUtil.parseAmount(c.TallyUtil.getJsonValue(e, "openingbalance"))),
            c.Util.isNotNull(r) &&
            c.Util.isNotNull(r.company) &&
            c.Util.isNotNull(r.company.timezone)
              ? (n.creditPeriodMs = c.TallyUtil.getDateValueForCreditPeriod(
                  e,
                  "billcreditperiod",
                  0,
                  c.DateUtil.FORMAT_DD_MMM_YYYY,
                  r.company.timezone,
                ))
              : (n.creditPeriodMs = c.TallyUtil.getDateValueForCreditPeriod(
                  e,
                  "billcreditperiod",
                  0,
                  c.DateUtil.FORMAT_DD_MMM_YYYY,
                )),
            (n.creditLimit =
              -1 * c.TallyUtil.parseNumber(c.TallyUtil.getJsonValue(e, "creditlimit"))),
            (n.gstRegistrationType = c.TallyUtil.getStringValue(e, "gstregistrationtype")),
            (n.vatNo = c.TallyUtil.getStringValue(e, "vattinnumber")),
            (n.cstNo = c.TallyUtil.getStringValue(e, "interstatestnumber")),
            (n.exciseNo = c.TallyUtil.getStringValue(e, "exciseregno")),
            (n.gstNatureOfSupply = c.TallyUtil.getStringValue(e, "gstnatureofsupply")),
            (n.gstTypeOfSupply = c.TallyUtil.getStringValue(e, "gsttypeofsupply")),
            (n.partyGstIn = c.TallyUtil.getStringValue(e, "partygstin")),
            (n.typeOfLedger = c.TallyUtil.getStringValue(e, "vatdealernature")),
            (n.taxType = c.TallyUtil.getStringValue(e, "taxtype")),
            (n.gstDutyHeadNew = c.TallyUtil.getStringValue(e, "gstdutyhead")),
            c.Util.isNotEmptyString(n.gstDutyHeadNew) &&
              (s.default.DUTY_HEADS_NEW.CENTRAL_TAX === n.gstDutyHeadNew
                ? (n.gstDutyHead = s.default.DUTY_HEADS_OLD.CENTRAL_TAX)
                : s.default.DUTY_HEADS_NEW.STATE_TAX === n.gstDutyHeadNew
                  ? (n.gstDutyHead = s.default.DUTY_HEADS_OLD.STATE_TAX)
                  : s.default.DUTY_HEADS_NEW.INTEGRATED_TAX === n.gstDutyHeadNew
                    ? (n.gstDutyHead = s.default.DUTY_HEADS_OLD.INTEGRATED_TAX)
                    : s.default.DUTY_HEADS_NEW.CESS === n.gstDutyHeadNew
                      ? (n.gstDutyHead = s.default.DUTY_HEADS_OLD.CESS)
                      : (n.gstDutyHead = c.TallyUtil.getStringValue(e, "gstdutyhead"))),
            (n.gstAppropriateTo = c.TallyUtil.getStringValue(e, "gstappropriateto")),
            c.Util.isNotEmptyString(n.gstAppropriateTo) &&
              s.default.GST_APPROPRIATE_TO_NEW === n.gstAppropriateTo &&
              (n.gstAppropriateTo = s.default.GST_APPROPRIATE_TO_OLD),
            (n.appropriateFor = c.TallyUtil.getStringValue(e, "appropriatefor")),
            c.Util.isEmptyString(n.appropriateFor) && (n.appropriateFor = s.default.NOT_APPLICABLE),
            (n.rateOfTax = c.TallyUtil.parseNumber(
              c.TallyUtil.getJsonValue(e, "rateoftaxcalculation"),
            )),
            (n.exciseAllocType = c.TallyUtil.getStringValue(e, "excisealloctype")));
          var a,
            i,
            o,
            l,
            m = c.TallyUtil.getStringValue(e, "gstapplicable");
          (c.Util.isNotEmpty(m) && m.toLowerCase().includes("not applicable")
            ? (n.gstApplicable = !1)
            : (n.gstApplicable = !0),
            (n.contact = p.LedgerContact.convert(e, r)));
          var f = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "ledmailingdetails.list"));
          if (c.Util.isFilledArray(f)) {
            for (var g = [], M = 0, S = 0; S < f.length; ++S)
              if (null !== f[S] && void 0 !== f[S]) {
                var A = h.default.convert(f[S], r);
                (null != A &&
                  M < A.applicableFrom &&
                  ((a = A.addressList),
                  (i = A.pinCode),
                  (o = A.name),
                  (l = A.country),
                  (M = A.applicableFrom)),
                  g.push(h.default.convert(f[S], r)));
              }
            n.mailingDetails = g;
          }
          null != n.contact &&
            (c.Util.isEmpty(n.contact.addressList) && (n.contact.addressList = a),
            c.Util.isEmptyString(n.contact.pincode) && (n.contact.pincode = i),
            c.Util.isEmptyString(n.contact.name) && (n.contact.name = o),
            c.Util.isEmptyString(n.contact.country) && (n.contact.country = l));
          var O = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "billallocations.list"));
          if (O.length > 0) {
            n.pendingBills = [];
            for (var N = 0, v = O; N < v.length; N++) {
              var T = v[N];
              null != T && n.pendingBills.push(p.Bill.convertPendingBill(T, r));
            }
          }
          var z = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "hsndetails.list"));
          if (c.Util.isFilledArray(z)) {
            var I = [];
            for (S = 0; S < z.length; ++S)
              null !== z[S] && void 0 !== z[S] && I.push(y.default.convert(z[S], r));
            n.hsnDetails = I;
          }
          var q,
            k,
            R,
            C = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "gstdetails.list"));
          if (c.Util.isFilledArray(C)) {
            var E = [];
            for (S = 0; S < C.length; ++S)
              if (null !== C[S] && void 0 !== C[S])
                if (c.Util.isFilledArray(n.hsnDetails)) {
                  var _ = u.default.convert(C[S], r);
                  E.push(p.GstClassification.modifyGstDetail(_, n.hsnDetails));
                } else E.push(u.default.convert(C[S], r));
            n.gstDetails = E;
          }
          var D = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "ledgstregdetails.list"));
          if (c.Util.isFilledArray(D)) {
            var L = [];
            for (M = 0, S = 0; S < D.length; ++S)
              if (null !== D[S] && void 0 !== D[S]) {
                var x = b.default.convert(D[S], r);
                (M < x.applicableFrom &&
                  ((q = x.gstIn),
                  (k = x.gstRegistrationType),
                  (R = x.placeOfSupply),
                  (M = x.applicableFrom)),
                  L.push(x));
              }
            n.gstRegDetails = L;
          }
          (c.Util.isNotEmptyString(q) && (n.partyGstIn = q),
            c.Util.isNotEmptyString(k) &&
              c.Util.isEmptyString(n.gstRegistrationType) &&
              (n.gstRegistrationType = k),
            c.Util.isNotEmptyString(R) &&
              null != n.contact &&
              c.Util.isEmptyString(n.contact.state) &&
              (n.contact.state = R),
            (n.bank = p.LedgerBank.convert(e, r)),
            (n.performance = c.TallyUtil.parseNumber(c.TallyUtil.getJsonValue(e, "performance"))));
          var w = c.TallyUtil.getAliasList(e, "languagename.list", "name.list", "name");
          return (
            (n.aliases = d.StringItem.convertStringArray(w, n.name)),
            (n.alias = t.getAliasString(w, n.name)),
            (n.isBillWiseOff = !c.TallyUtil.getTag(e, "isbillwiseon")),
            (n.desc = c.TallyUtil.getStringValue(e, "description")),
            (n.priceLevel = c.TallyUtil.getStringValue(e, "pricelevel")),
            (n.roundingMethod = c.TallyUtil.getStringValue(e, "roundingmethod")),
            (n.roundingLimit = c.TallyUtil.parseNumber(
              c.TallyUtil.getJsonValue(e, "roundinglimit"),
            )),
            n
          );
        }),
        (t.getAliasString = function (e, t) {
          var r = [];
          if (c.Util.isNotNull(e))
            for (var n = 0, a = e; n < a.length; n++) {
              var i = a[n];
              i !== t && r.push(i);
            }
          return r.join("!@#$%");
        }),
        t
      );
    })(m.Master);
  t.default = f;
};
