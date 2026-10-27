// webpack module #551 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var n = r(11),
    u = r(102),
    p = r(32),
    c = r(2),
    m = r(51),
    l = r(5),
    d = r(28),
    y = r(120),
    b = r(1120),
    h = r(1121),
    g = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        a(t, e),
        (t.prototype.getName = function () {
          return t.masterName;
        }),
        (t.prototype.getKeys = function () {
          return l.Master.keys.concat(t.keys);
        }),
        (t.prototype.parse = function (e, r) {
          return o(this, void 0, void 0, function () {
            var i;
            return s(this, function (a) {
              return ((i = []).push(t.convert(e, r)), [2, i]);
            });
          });
        }),
        (t.prototype.getSyncConfig = function () {
          return t.syncconfig;
        }),
        (t.prototype.equals = function (e) {
          return !!(
            l.Master.compare(this._id, e._id) &&
            l.Master.compare(this.isDeleted, e.isDeleted) &&
            l.Master.compare(this.name, e.name) &&
            l.Master.compare(this.parentGroup, e.parentGroup) &&
            l.Master.compare(this.aliases, e.aliases) &&
            l.Master.compare(this.openingAmount, e.openingAmount) &&
            l.Master.compare(this.creditPeriodMs, e.creditPeriodMs) &&
            l.Master.compare(this.creditLimit, e.creditLimit) &&
            l.Master.compare(this.contact, e.contact) &&
            l.Master.compare(this.mailingDetails, e.mailingDetails) &&
            l.Master.compare(this.vatNo, e.vatNo) &&
            l.Master.compare(this.cstNo, e.cstNo) &&
            l.Master.compare(this.taxType, e.taxType) &&
            l.Master.compare(this.exciseNo, e.exciseNo) &&
            l.Master.compare(this.pendingBills, e.pendingBills) &&
            l.Master.compare(this.groupList, e.groupList) &&
            l.Master.compare(this.bank, e.bank) &&
            l.Master.compare(this.performance, e.performance) &&
            l.Master.compare(this.partyGstIn, e.partyGstIn) &&
            l.Master.compare(this.gstDutyHead, e.gstDutyHead) &&
            l.Master.compare(this.gstDutyHeadNew, e.gstDutyHeadNew) &&
            l.Master.compare(this.gstApplicable, e.gstApplicable) &&
            l.Master.compare(this.alias, e.alias) &&
            l.Master.compare(this.gstDetails, e.gstDetails) &&
            l.Master.compare(this.hsnDetails, e.hsnDetails) &&
            l.Master.compare(this.gstRegDetails, e.gstRegDetails) &&
            l.Master.compare(this.gstAppropriateTo, e.gstAppropriateTo) &&
            l.Master.compare(this.appropriateFor, e.appropriateFor) &&
            l.Master.compare(this.isBillWiseOff, e.isBillWiseOff) &&
            l.Master.compare(this.desc, e.desc) &&
            l.Master.compare(this.priceLevel, e.priceLevel) &&
            l.Master.compare(this.rateOfTax, e.rateOfTax) &&
            l.Master.compare(this.gstRegistrationType, e.gstRegistrationType) &&
            l.Master.compare(this.exciseAllocType, e.exciseAllocType) &&
            l.Master.compare(this.gstNatureOfSupply, e.gstNatureOfSupply) &&
            l.Master.compare(this.gstTypeOfSupply, e.gstTypeOfSupply) &&
            l.Master.compare(this.roundingMethod, e.roundingMethod) &&
            l.Master.compare(this.roundingLimit, e.roundingLimit) &&
            l.Master.compare(this.typeOfLedger, e.typeOfLedger)
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
          l.Master.compare(this.name, e.name) || (this.oldName = this.name);
        }),
        (t.toObject = function (e) {
          var r = new t();
          if (
            (c.Util.assign(r, e), c.Util.isNotNull(e.pendingBills) && e.pendingBills.length > 0)
          ) {
            r.pendingBills = [];
            for (var i = 0, a = e.pendingBills; i < a.length; i++) {
              var o = a[i];
              r.pendingBills.push(p.Bill.toObject(o));
            }
          }
          if (
            (c.Util.isNotNull(e.contact) && (r.contact = p.LedgerContact.toObject(e.contact)),
            c.Util.isNotNull(e.mailingDetails) && e.mailingDetails.length > 0)
          ) {
            r.mailingDetails = [];
            for (var s = 0, n = e.mailingDetails; s < n.length; s++) {
              var m = n[s];
              r.mailingDetails.push(h.default.toObject(m));
            }
          }
          if (c.Util.isNotNull(e.groupList) && e.groupList.length > 0) {
            r.groupList = [];
            for (var l = 0, g = e.groupList; l < g.length; l++) {
              var S = g[l];
              r.groupList.push(d.StringItem.toObject(S));
            }
          }
          if (c.Util.isNotNull(e.aliases) && e.aliases.length > 0) {
            r.aliases = [];
            for (var f = 0, A = e.aliases; f < A.length; f++) {
              var N = A[f];
              r.aliases.push(d.StringItem.toObject(N));
            }
          }
          if (
            (c.Util.isNotNull(e.bank) && (r.bank = p.LedgerBank.toObject(e.bank)),
            c.Util.isNotNull(e.gstDetails) && e.gstDetails.length > 0)
          ) {
            r.gstDetails = [];
            for (var I = 0, T = e.gstDetails; I < T.length; I++) {
              var M = T[I];
              r.gstDetails.push(u.default.toObject(M));
            }
          }
          if (c.Util.isNotNull(e.hsnDetails) && e.hsnDetails.length > 0) {
            r.hsnDetails = [];
            for (var v = 0, k = e.hsnDetails; v < k.length; v++) {
              var C = k[v];
              r.hsnDetails.push(y.default.toObject(C));
            }
          }
          if (c.Util.isNotNull(e.gstRegDetails) && e.gstRegDetails.length > 0) {
            r.gstRegDetails = [];
            for (var q = 0, R = e.gstRegDetails; q < R.length; q++) {
              var D = R[q];
              r.gstRegDetails.push(b.default.toObject(D));
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
        (t.syncconfig = new m.SyncConfig(t.masterName, 6e5, 0)),
        (t.convert = function (e, r) {
          var i = new t();
          ((i._id = c.TallyUtil.getStringValue(e, "guid")),
            (i.masterId = c.TallyUtil.getIntValue(e, "masterid")),
            (i.alterId = c.TallyUtil.getIntValue(e, "alterid")),
            (i.name = c.TallyUtil.getStringValue(e, "name", !0)),
            c.Util.isEmptyString(i._id) && (i._id = i.name),
            (i.parentGroup = c.TallyUtil.getStringValue(e, "parent")),
            (i.openingAmount =
              -1 * c.TallyUtil.parseAmount(c.TallyUtil.getJsonValue(e, "openingbalance"))),
            c.Util.isNotNull(r) &&
            c.Util.isNotNull(r.company) &&
            c.Util.isNotNull(r.company.timezone)
              ? (i.creditPeriodMs = c.TallyUtil.getDateValueForCreditPeriod(
                  e,
                  "billcreditperiod",
                  0,
                  c.DateUtil.FORMAT_DD_MMM_YYYY,
                  r.company.timezone,
                ))
              : (i.creditPeriodMs = c.TallyUtil.getDateValueForCreditPeriod(
                  e,
                  "billcreditperiod",
                  0,
                  c.DateUtil.FORMAT_DD_MMM_YYYY,
                )),
            (i.creditLimit =
              -1 * c.TallyUtil.parseNumber(c.TallyUtil.getJsonValue(e, "creditlimit"))),
            (i.gstRegistrationType = c.TallyUtil.getStringValue(e, "gstregistrationtype")),
            (i.vatNo = c.TallyUtil.getStringValue(e, "vattinnumber")),
            (i.cstNo = c.TallyUtil.getStringValue(e, "interstatestnumber")),
            (i.exciseNo = c.TallyUtil.getStringValue(e, "exciseregno")),
            (i.gstNatureOfSupply = c.TallyUtil.getStringValue(e, "gstnatureofsupply")),
            (i.gstTypeOfSupply = c.TallyUtil.getStringValue(e, "gsttypeofsupply")),
            (i.partyGstIn = c.TallyUtil.getStringValue(e, "partygstin")),
            (i.typeOfLedger = c.TallyUtil.getStringValue(e, "vatdealernature")),
            (i.taxType = c.TallyUtil.getStringValue(e, "taxtype")),
            (i.gstDutyHeadNew = c.TallyUtil.getStringValue(e, "gstdutyhead")),
            c.Util.isNotEmptyString(i.gstDutyHeadNew) &&
              (n.default.DUTY_HEADS_NEW.CENTRAL_TAX === i.gstDutyHeadNew
                ? (i.gstDutyHead = n.default.DUTY_HEADS_OLD.CENTRAL_TAX)
                : n.default.DUTY_HEADS_NEW.STATE_TAX === i.gstDutyHeadNew
                  ? (i.gstDutyHead = n.default.DUTY_HEADS_OLD.STATE_TAX)
                  : n.default.DUTY_HEADS_NEW.INTEGRATED_TAX === i.gstDutyHeadNew
                    ? (i.gstDutyHead = n.default.DUTY_HEADS_OLD.INTEGRATED_TAX)
                    : n.default.DUTY_HEADS_NEW.CESS === i.gstDutyHeadNew
                      ? (i.gstDutyHead = n.default.DUTY_HEADS_OLD.CESS)
                      : (i.gstDutyHead = c.TallyUtil.getStringValue(e, "gstdutyhead"))),
            (i.gstAppropriateTo = c.TallyUtil.getStringValue(e, "gstappropriateto")),
            c.Util.isNotEmptyString(i.gstAppropriateTo) &&
              n.default.GST_APPROPRIATE_TO_NEW === i.gstAppropriateTo &&
              (i.gstAppropriateTo = n.default.GST_APPROPRIATE_TO_OLD),
            (i.appropriateFor = c.TallyUtil.getStringValue(e, "appropriatefor")),
            c.Util.isEmptyString(i.appropriateFor) && (i.appropriateFor = n.default.NOT_APPLICABLE),
            (i.rateOfTax = c.TallyUtil.parseNumber(
              c.TallyUtil.getJsonValue(e, "rateoftaxcalculation"),
            )),
            (i.exciseAllocType = c.TallyUtil.getStringValue(e, "excisealloctype")));
          var a,
            o,
            s,
            m,
            l = c.TallyUtil.getStringValue(e, "gstapplicable");
          (c.Util.isNotEmpty(l) && l.toLowerCase().includes("not applicable")
            ? (i.gstApplicable = !1)
            : (i.gstApplicable = !0),
            (i.contact = p.LedgerContact.convert(e, r)));
          var g = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "ledmailingdetails.list"));
          if (c.Util.isFilledArray(g)) {
            for (var S = [], f = 0, A = 0; A < g.length; ++A)
              if (null !== g[A] && void 0 !== g[A]) {
                var N = h.default.convert(g[A], r);
                (null != N &&
                  f < N.applicableFrom &&
                  ((a = N.addressList),
                  (o = N.pinCode),
                  (s = N.name),
                  (m = N.country),
                  (f = N.applicableFrom)),
                  S.push(h.default.convert(g[A], r)));
              }
            i.mailingDetails = S;
          }
          null != i.contact &&
            (c.Util.isEmpty(i.contact.addressList) && (i.contact.addressList = a),
            c.Util.isEmptyString(i.contact.pincode) && (i.contact.pincode = o),
            c.Util.isEmptyString(i.contact.name) && (i.contact.name = s),
            c.Util.isEmptyString(i.contact.country) && (i.contact.country = m));
          var I = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "billallocations.list"));
          if (I.length > 0) {
            i.pendingBills = [];
            for (var T = 0, M = I; T < M.length; T++) {
              var v = M[T];
              null != v && i.pendingBills.push(p.Bill.convertPendingBill(v, r));
            }
          }
          var k = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "hsndetails.list"));
          if (c.Util.isFilledArray(k)) {
            var C = [];
            for (A = 0; A < k.length; ++A)
              null !== k[A] && void 0 !== k[A] && C.push(y.default.convert(k[A], r));
            i.hsnDetails = C;
          }
          var q,
            R,
            D,
            E = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "gstdetails.list"));
          if (c.Util.isFilledArray(E)) {
            var x = [];
            for (A = 0; A < E.length; ++A)
              if (null !== E[A] && void 0 !== E[A])
                if (c.Util.isFilledArray(i.hsnDetails)) {
                  var O = u.default.convert(E[A], r);
                  x.push(p.GstClassification.modifyGstDetail(O, i.hsnDetails));
                } else x.push(u.default.convert(E[A], r));
            i.gstDetails = x;
          }
          var z = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "ledgstregdetails.list"));
          if (c.Util.isFilledArray(z)) {
            var P = [];
            for (f = 0, A = 0; A < z.length; ++A)
              if (null !== z[A] && void 0 !== z[A]) {
                var L = b.default.convert(z[A], r);
                (f < L.applicableFrom &&
                  ((q = L.gstIn),
                  (R = L.gstRegistrationType),
                  (D = L.placeOfSupply),
                  (f = L.applicableFrom)),
                  P.push(L));
              }
            i.gstRegDetails = P;
          }
          (c.Util.isNotEmptyString(q) && (i.partyGstIn = q),
            c.Util.isNotEmptyString(R) &&
              c.Util.isEmptyString(i.gstRegistrationType) &&
              (i.gstRegistrationType = R),
            c.Util.isNotEmptyString(D) &&
              null != i.contact &&
              c.Util.isEmptyString(i.contact.state) &&
              (i.contact.state = D),
            (i.bank = p.LedgerBank.convert(e, r)),
            (i.performance = c.TallyUtil.parseNumber(c.TallyUtil.getJsonValue(e, "performance"))));
          var w = c.TallyUtil.getAliasList(e, "languagename.list", "name.list", "name");
          return (
            (i.aliases = d.StringItem.convertStringArray(w, i.name)),
            (i.alias = t.getAliasString(w, i.name)),
            (i.isBillWiseOff = !c.TallyUtil.getTag(e, "isbillwiseon")),
            (i.desc = c.TallyUtil.getStringValue(e, "description")),
            (i.priceLevel = c.TallyUtil.getStringValue(e, "pricelevel")),
            (i.roundingMethod = c.TallyUtil.getStringValue(e, "roundingmethod")),
            (i.roundingLimit = c.TallyUtil.parseNumber(
              c.TallyUtil.getJsonValue(e, "roundinglimit"),
            )),
            i
          );
        }),
        (t.getAliasString = function (e, t) {
          var r = [];
          if (c.Util.isNotNull(e))
            for (var i = 0, a = e; i < a.length; i++) {
              var o = a[i];
              o !== t && r.push(o);
            }
          return r.join("!@#$%");
        }),
        t
      );
    })(l.Master);
  t.default = g;
};
