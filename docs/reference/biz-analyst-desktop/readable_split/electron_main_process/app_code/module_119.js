// webpack module #119 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var n = r(544),
    u = r(214),
    p = r(547),
    c = r(60),
    m = r(548),
    l = r(1115),
    d = r(549),
    y = r(1117),
    b = r(550),
    h = r(215),
    g = r(551),
    S = r(43),
    f = r(1122),
    A = r(552),
    N = r(553),
    I = r(554),
    T = r(555),
    M = r(1123),
    v = r(556),
    k = r(557),
    C = r(591),
    q = r(2),
    R = r(51),
    D = r(5),
    E = r(28),
    x = (function (e) {
      function t() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        return ((t.isPosInvoice = !1), (t.isUpdated = !1), t);
      }
      return (
        a(t, e),
        (t.prototype.getName = function () {
          return t.masterName;
        }),
        (t.prototype.getKeys = function () {
          return D.Master.keys.concat(t.keys);
        }),
        (t.prototype.parse = function (e, r) {
          return o(this, void 0, void 0, function () {
            return s(this, function (i) {
              switch (i.label) {
                case 0:
                  return [4, t.convert(e, r)];
                case 1:
                  return [2, i.sent()];
              }
            });
          });
        }),
        (t.prototype.getSyncConfig = function () {
          throw new Error("Sync config for vouchers is deprecated");
        }),
        (t.toObject = function (e) {
          var r = new t();
          if ((q.Util.assign(r, e), q.Util.isNotNull(e.tags) && e.tags.length > 0)) {
            r.tags = [];
            for (var i = 0, a = e.tags; i < a.length; i++) {
              var o = a[i];
              r.tags.push(E.StringItem.toObject(o));
            }
          }
          if (q.Util.isNotNull(e.items) && e.items.length > 0) {
            r.items = [];
            for (var s = 0, c = e.items; s < c.length; s++) {
              var b = c[s];
              r.items.push(h.default.toObject(b));
            }
          }
          if (q.Util.isNotNull(e.ewayBills) && e.ewayBills.length > 0) {
            r.ewayBills = [];
            for (var g = 0, S = e.ewayBills; g < S.length; g++) {
              var k = S[g];
              r.ewayBills.push(y.default.toObject(k));
            }
          }
          if (q.Util.isNotNull(e.itemsIn) && e.itemsIn.length > 0) {
            r.itemsIn = [];
            for (var R = 0, D = e.itemsIn; R < D.length; R++) {
              var x = D[R];
              r.itemsIn.push(h.default.toObject(x));
            }
          }
          if (q.Util.isNotNull(e.itemsOut) && e.itemsOut.length > 0) {
            r.itemsOut = [];
            for (var O = 0, z = e.itemsOut; O < z.length; O++) {
              var P = z[O];
              r.itemsOut.push(h.default.toObject(P));
            }
          }
          if (q.Util.isNotNull(e.charges) && e.charges.length > 0) {
            r.charges = [];
            for (var L = 0, w = e.charges; L < w.length; L++) {
              var _ = w[L];
              r.charges.push(p.default.toObject(_));
            }
          }
          if (
            (q.Util.isNotNull(e.shipping) && (r.shipping = v.default.toObject(e.shipping)),
            q.Util.isNotNull(e.terms) && (r.terms = C.default.toObject(e.terms)),
            q.Util.isNotNull(e.partyDetail) && (r.partyDetail = N.default.toObject(e.partyDetail)),
            q.Util.isNotNull(e.consigneeDetail) &&
              (r.consigneeDetail = m.default.toObject(e.consigneeDetail)),
            q.Util.isNotNull(e.eInvoiceDetail) &&
              (r.eInvoiceDetail = l.default.toObject(e.eInvoiceDetail)),
            q.Util.isNotNull(e.bills) && e.bills.length > 0)
          ) {
            r.bills = [];
            for (var U = 0, B = e.bills; U < B.length; U++) {
              var F = B[U];
              r.bills.push(u.default.toObject(F));
            }
          }
          if (q.Util.isNotNull(e.orderList) && e.orderList.length > 0) {
            r.orderList = [];
            for (var G = 0, V = e.orderList; G < V.length; G++) {
              var W = V[G];
              r.orderList.push(E.StringItem.toObject(W));
            }
          }
          if (q.Util.isNotNull(e.orderListNew) && e.orderListNew.length > 0) {
            r.orderListNew = [];
            for (var j = 0, H = e.orderListNew; j < H.length; j++) {
              W = H[j];
              r.orderListNew.push(f.default.toObject(W));
            }
          }
          if (q.Util.isNotNull(e.paymentDetails) && e.paymentDetails.length > 0) {
            r.paymentDetails = [];
            for (var K = 0, Y = e.paymentDetails; K < Y.length; K++) {
              var Q = Y[K];
              r.paymentDetails.push(T.default.toObject(Q));
            }
          }
          if (q.Util.isNotNull(e.deliveryNoteDetails) && e.deliveryNoteDetails.length > 0) {
            r.deliveryNoteDetails = [];
            for (var J = 0, X = e.deliveryNoteDetails; J < X.length; J++) {
              var Z = X[J];
              r.deliveryNoteDetails.push(d.default.toObject(Z));
            }
          }
          if (q.Util.isNotNull(e.parties) && e.parties.length > 0) {
            r.parties = [];
            for (var $ = 0, ee = e.parties; $ < ee.length; $++) {
              var te = ee[$];
              r.parties.push(A.default.toObject(te));
            }
          }
          if (q.Util.isNotNull(e.accounts) && e.accounts.length > 0) {
            r.accounts = [];
            for (var re = 0, ie = e.accounts; re < ie.length; re++) {
              var ae = ie[re];
              r.accounts.push(n.default.toObject(ae));
            }
          }
          if (q.Util.isNotNull(e.payList) && e.payList.length > 0) {
            r.payList = [];
            for (var oe = 0, se = e.payList; oe < se.length; oe++) {
              var ne = se[oe];
              r.payList.push(I.default.toObject(ne));
            }
          }
          if (q.Util.isNotNull(e.posInvoiceDetails) && e.posInvoiceDetails.length > 0) {
            r.posInvoiceDetails = [];
            for (var ue = 0, pe = e.posInvoiceDetails; ue < pe.length; ue++) {
              var ce = pe[ue];
              r.posInvoiceDetails.push(M.default.toObject(ce));
            }
          }
          return r;
        }),
        (t.prototype.equals = function (e) {
          return !!(
            D.Master.compare(this._id, e._id) &&
            D.Master.compare(this.isDeleted, e.isDeleted) &&
            D.Master.compare(this.isUpdated, e.isUpdated) &&
            D.Master.compare(this.customId, e.customId) &&
            D.Master.compare(this.type, e.type) &&
            D.Master.compare(this.customType, e.customType) &&
            D.Master.compare(this.category, e.category) &&
            D.Master.compare(this.date, e.date) &&
            D.Master.compare(this.desc, e.desc) &&
            D.Master.compare(this.partyId, e.partyId) &&
            D.Master.compare(this.partyName, e.partyName) &&
            D.Master.compare(this.partyMasterId, e.partyMasterId) &&
            D.Master.compare(this.partyDetail, e.partyDetail) &&
            D.Master.compare(this.consigneeDetail, e.consigneeDetail) &&
            D.Master.compare(this.enteredBy, e.enteredBy) &&
            D.Master.compare(this.tallyReference, e.tallyReference) &&
            D.Master.compare(this.refDate, e.refDate) &&
            D.Master.compare(this.tags, e.tags) &&
            D.Master.compare(this.partyMailingName, e.partyMailingName) &&
            D.Master.compare(this.total, e.total) &&
            D.Master.compare(this.items, e.items) &&
            D.Master.compare(this.ewayBills, e.ewayBills) &&
            D.Master.compare(this.itemsIn, e.itemsIn) &&
            D.Master.compare(this.itemsOut, e.itemsOut) &&
            D.Master.compare(this.charges, e.charges) &&
            D.Master.compare(this.shipping, e.shipping) &&
            D.Master.compare(this.terms, e.terms) &&
            D.Master.compare(this.bills, e.bills) &&
            D.Master.compare(this.orderList, e.orderList) &&
            D.Master.compare(this.orderListNew, e.orderListNew) &&
            D.Master.compare(this.paymentDetails, e.paymentDetails) &&
            D.Master.compare(this.deliveryNoteDetails, e.deliveryNoteDetails) &&
            D.Master.compare(this.accountId, e.accountId) &&
            D.Master.compare(this.accountMasterId, e.accountMasterId) &&
            D.Master.compare(this.parentId, e.parentId) &&
            D.Master.compare(this.parties, e.parties) &&
            D.Master.compare(this.accounts, e.accounts) &&
            D.Master.compare(this.costCentreName, e.costCentreName) &&
            D.Master.compare(this.placeOfSupply, e.placeOfSupply) &&
            D.Master.compare(this.effectiveDate, e.effectiveDate) &&
            D.Master.compare(this.payList, e.payList) &&
            D.Master.compare(this.destinationGodown, e.destinationGodown) &&
            D.Master.compare(this.sourceGodown, e.sourceGodown) &&
            D.Master.compare(this.partyGstIn, e.partyGstIn) &&
            D.Master.compare(this.companyGstIn, e.companyGstIn) &&
            D.Master.compare(this.gstRegistrationType, e.gstRegistrationType) &&
            D.Master.compare(this.companyGstRegistrationType, e.companyGstRegistrationType) &&
            D.Master.compare(this.isReverseChargeApplicable, e.isReverseChargeApplicable) &&
            D.Master.compare(this.companyGstRegistration, e.companyGstRegistration) &&
            D.Master.compare(this.companyGstState, e.companyGstState) &&
            D.Master.compare(this.consigneeGstIn, e.consigneeGstIn) &&
            D.Master.compare(this.motorVehicleNumber, e.motorVehicleNumber) &&
            D.Master.compare(this.lrRrNo, e.lrRrNo) &&
            D.Master.compare(this.lrRrDate, e.lrRrDate) &&
            D.Master.compare(this.isPosInvoice, e.isPosInvoice) &&
            D.Master.compare(this.posInvoiceDetails, e.posInvoiceDetails) &&
            D.Master.compare(this.eInvoiceDetail, e.eInvoiceDetail)
          );
        }),
        (t.prototype.updateFromTally = function (e) {
          ((this._id = e._id),
            (this.isDeleted = e.isDeleted),
            (this.masterId = e.masterId),
            (this.alterId = e.alterId),
            this.customType !== e.customType ? (this.isUpdated = !0) : (this.isUpdated = !1),
            (this.customId = e.customId),
            (this.type = e.type),
            (this.customType = e.customType),
            (this.category = e.category),
            (this.date = e.date),
            (this.desc = e.desc),
            (this.partyId = e.partyId),
            (this.partyName = e.partyName),
            (this.partyMasterId = e.partyMasterId),
            (this.partyDetail = e.partyDetail),
            (this.consigneeDetail = e.consigneeDetail),
            (this.deliveryNoteDetails = e.deliveryNoteDetails),
            (this.enteredBy = e.enteredBy),
            (this.tallyReference = e.tallyReference),
            (this.refDate = e.refDate),
            (this.tags = e.tags),
            (this.partyMailingName = e.partyMailingName),
            (this.total = e.total),
            (this.items = e.items),
            (this.ewayBills = e.ewayBills),
            (this.itemsIn = e.itemsIn),
            (this.itemsOut = e.itemsOut),
            (this.charges = e.charges),
            (this.shipping = e.shipping),
            (this.terms = e.terms),
            (this.bills = e.bills),
            (this.orderList = e.orderList),
            (this.orderListNew = e.orderListNew),
            (this.paymentDetails = e.paymentDetails),
            (this.accountId = e.accountId),
            (this.accountMasterId = e.accountMasterId),
            (this.parentId = e.parentId),
            (this.parties = e.parties),
            (this.accounts = e.accounts),
            (this.costCentreName = e.costCentreName),
            (this.placeOfSupply = e.placeOfSupply),
            (this.effectiveDate = e.effectiveDate),
            (this.payList = e.payList),
            (this.destinationGodown = e.destinationGodown),
            (this.sourceGodown = e.sourceGodown),
            (this.partyGstIn = e.partyGstIn),
            (this.companyGstIn = e.companyGstIn),
            (this.companyGstRegistration = e.companyGstRegistration),
            (this.companyGstState = e.companyGstState),
            (this.consigneeGstIn = e.consigneeGstIn),
            (this.gstRegistrationType = e.gstRegistrationType),
            (this.companyGstRegistrationType = e.companyGstRegistrationType),
            (this.isReverseChargeApplicable = e.isReverseChargeApplicable),
            (this.motorVehicleNumber = e.motorVehicleNumber),
            (this.lrRrNo = e.lrRrNo),
            (this.lrRrDate = e.lrRrDate),
            (this.isPosInvoice = e.isPosInvoice),
            (this.posInvoiceDetails = e.posInvoiceDetails),
            (this.eInvoiceDetail = e.eInvoiceDetail));
        }),
        (t.convert = function (e, r) {
          return o(this, void 0, void 0, function () {
            var i,
              a,
              o,
              R,
              D,
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
              X,
              Z,
              $,
              ee,
              te,
              re,
              ie,
              ae,
              oe,
              se,
              ne,
              ue,
              pe,
              ce,
              me,
              le,
              de,
              ye,
              be,
              he,
              ge,
              Se,
              fe,
              Ae,
              Ne,
              Ie,
              Te,
              Me,
              ve,
              ke,
              Ce,
              qe,
              Re,
              De,
              Ee,
              xe,
              Oe,
              ze,
              Pe,
              Le,
              we,
              _e,
              Ue,
              Be,
              Fe,
              Ge,
              Ve,
              We,
              je,
              He,
              Ke,
              Ye,
              Qe,
              Je,
              Xe,
              Ze,
              $e,
              et,
              tt,
              rt,
              it,
              at,
              ot,
              st,
              nt,
              ut,
              pt,
              ct,
              mt,
              lt,
              dt,
              yt,
              bt,
              ht,
              gt,
              St,
              ft,
              At,
              Nt,
              It,
              Tt,
              Mt,
              vt,
              kt,
              Ct,
              qt,
              Rt,
              Dt,
              Et,
              xt,
              Ot,
              zt,
              Pt,
              Lt,
              wt,
              _t,
              Ut,
              Bt,
              Ft,
              Gt,
              Vt,
              Wt,
              jt,
              Ht,
              Kt,
              Yt,
              Qt,
              Jt,
              Xt,
              Zt,
              $t,
              er,
              tr,
              rr,
              ir,
              ar,
              or,
              sr,
              nr,
              ur,
              pr;
            return s(this, function (s) {
              switch (s.label) {
                case 0:
                  if (
                    ((i = []),
                    (a = new t()),
                    q.Util.isNotNull(r) && ((o = r.company), (R = r.userId)),
                    (a._id = q.TallyUtil.getStringValue(e, "guid")),
                    (a.masterId = q.TallyUtil.getIntValue(e, "masterid")),
                    (a.alterId = q.TallyUtil.getIntValue(e, "alterid")),
                    (a.customId = q.TallyUtil.getStringValue(e, "vouchernumber")),
                    (a.customType = q.TallyUtil.getStringValue(e, "vchtype", !0)),
                    q.Util.isNotNull(
                      t.voucherTypesByName[q.TallyUtil.removeNoiseChars(a.customType)],
                    ) &&
                      (a.isPosInvoice =
                        t.voucherTypesByName[
                          q.TallyUtil.removeNoiseChars(a.customType)
                        ].useForPosInvoice),
                    (a.type = t.getRootVoucherType(a.customType)),
                    q.Util.isNotNull(o) && q.Util.isNotNull(o.timezone)
                      ? (a.date = q.TallyUtil.parseDate(
                          q.TallyUtil.getStringValue(e, "date"),
                          q.DateUtil.FORMAT_YYYYMMDD,
                          o.timezone,
                        ))
                      : (a.date = q.TallyUtil.parseDate(
                          q.TallyUtil.getStringValue(e, "date"),
                          q.DateUtil.FORMAT_YYYYMMDD,
                        )),
                    (a.desc = q.TallyUtil.getStringValue(e, "narration")),
                    (a.partyId = q.TallyUtil.getStringValue(e, "partyledgername")),
                    (D = q.TallyUtil.getStringValue(e, "partyname")),
                    (a.partyName = D),
                    (void 0 === a.partyId ||
                      null === a.partyId ||
                      "" === a.partyId.trim() ||
                      (a.isPosInvoice && q.Util.isNotEmpty(D))) &&
                      (a.partyId = D),
                    (a.partyMailingName = q.TallyUtil.getStringValue(e, "partymailingname")),
                    (a.enteredBy = q.TallyUtil.getStringValue(e, "enteredBy")),
                    (a.tallyReference = q.TallyUtil.getStringValue(e, "reference")),
                    q.Util.isNotNull(o) && q.Util.isNotNull(o.timezone)
                      ? (a.refDate = q.TallyUtil.parseDate(
                          q.TallyUtil.getStringValue(e, "referencedate"),
                          "YYYYMMDD",
                          o.timezone,
                        ))
                      : (a.refDate = q.TallyUtil.parseDate(
                          q.TallyUtil.getStringValue(e, "referencedate"),
                          "YYYYMMDD",
                        )),
                    (a.costCentreName = q.TallyUtil.getStringValue(e, "costcentrename")),
                    (q.Util.isNull(a.costCentreName) || q.Util.isEmptyString(a.costCentreName)) &&
                      (a.costCentreName = q.TallyUtil.getStringValue(e, "autocostlevel")),
                    (a.partyGstIn = q.TallyUtil.getStringValue(e, "partygstin")),
                    (a.consigneeGstIn = q.TallyUtil.getStringValue(e, "consigneegstin")),
                    (a.companyGstIn = q.TallyUtil.getStringValue(e, "cmpgstin")),
                    (a.companyGstRegistration = q.TallyUtil.getStringValue(e, "gstregistration")),
                    (a.companyGstState = q.TallyUtil.getStringValue(e, "cmpgststate")),
                    (a.gstRegistrationType = q.TallyUtil.getStringValue(e, "gstregistrationtype")),
                    (a.companyGstRegistrationType = q.TallyUtil.getStringValue(
                      e,
                      "cmpgstregistrationtype",
                    )),
                    (a.isReverseChargeApplicable = q.TallyUtil.getBoolean(
                      e,
                      "isreversechargeapplicable",
                    )),
                    q.Util.isNotNull(o) && q.Util.isNotNull(o.timezone)
                      ? (a.effectiveDate = q.TallyUtil.parseDate(
                          q.TallyUtil.getStringValue(e, "effectivedate"),
                          q.DateUtil.FORMAT_YYYYMMDD,
                          o.timezone,
                        ))
                      : (a.effectiveDate = q.TallyUtil.parseDate(
                          q.TallyUtil.getStringValue(e, "effectivedate"),
                          q.DateUtil.FORMAT_YYYYMMDD,
                        )),
                    q.TallyUtil.getTag(e, "iscancelled"))
                  )
                    return ((a.isDeleted = !0), i.push(a), [2, i]);
                  if (q.TallyUtil.getTag(e, "isdeleted") || q.TallyUtil.getTag(e, "isoptional"))
                    return ((a.isDeleted = !0), i.push(a), [2, i]);
                  if (
                    ((a.tags = []),
                    q.TallyUtil.getTag(e, "hascashflow") &&
                      a.tags.push(new E.StringItem("cashFlow")),
                    q.TallyUtil.getTag(e, "isinvoice") && a.tags.push(new E.StringItem("invoice")),
                    q.TallyUtil.getTag(e, "hasdiscounts") &&
                      a.tags.push(new E.StringItem("discounts")),
                    q.TallyUtil.getTag(e, "isvoid") && a.tags.push(new E.StringItem("void")),
                    q.TallyUtil.getTag(e, "isonhold") && a.tags.push(new E.StringItem("onhold")),
                    q.TallyUtil.getTag(e, "iscostcentre") &&
                      a.tags.push(new E.StringItem("costcentre")),
                    q.TallyUtil.getTag(e, "isdeemedpositive") &&
                      a.tags.push(new E.StringItem("deemedpositive")),
                    q.TallyUtil.getTag(e, "ispostdated") &&
                      a.tags.push(new E.StringItem("postdated")),
                    q.Util.isNull(a.partyId) || "" === a.partyId.trim())
                  ) {
                    if (
                      a.type !== t.TYPE_PAYROLL &&
                      a.type !== t.TYPE_JOURNAL &&
                      a.type !== t.TYPE_CONTRA &&
                      a.type !== t.TYPE_STOCK_JOURNAL &&
                      a.type !== t.TYPE_PHYSICAL_STOCK
                    )
                      return (
                        q.Log.warn(
                          "[WARNING] Party id is null for bill: " +
                            a.customId +
                            " of voucher type: " +
                            a.customType +
                            ". Details: " +
                            JSON.stringify(a),
                        ),
                        [2, i]
                      );
                  } else a.partyMasterId = t.getLedgerMasterId(a.partyId);
                  for (
                    0 ===
                      (x = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "allledgerentries.list"),
                      )).length &&
                      (x = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "ledgerentries.list"),
                      )),
                      a.accounts = [],
                      O = 0,
                      z = x;
                    O < z.length;
                    O++
                  )
                    ((P = z[O]),
                      q.Util.isNotNull(P) && ((Gt = n.default.convert(P, r)), a.accounts.push(Gt)));
                  return a.type !== t.TYPE_MATERIAL_IN && a.type !== t.TYPE_MATERIAL_OUT
                    ? [3, 1]
                    : ((a.category = t.CATEGORY_MATERIAL),
                      (a.destinationGodown = q.TallyUtil.getStringValue(
                        e,
                        "voucherdestinationgodown",
                      )),
                      (a.sourceGodown = q.TallyUtil.getStringValue(e, "vouchersourcegodown")),
                      (L = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "inventoryentriesin.list"),
                      )),
                      (a.itemsIn = t.getInventories(L, 1, r)),
                      (L = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "inventoryentriesout.list"),
                      )),
                      (a.itemsOut = t.getInventories(L, 1, r)),
                      i.push(a),
                      [3, 19]);
                case 1:
                  if (a.type !== t.TYPE_PAYROLL) return [3, 2];
                  for (
                    a.category = t.CATEGORY_PAYROLL,
                      ke = 0,
                      w = [],
                      _ = [],
                      U = q.TallyUtil.parseArray(q.TallyUtil.getJsonValue(e, "categoryentry.list")),
                      B = 0,
                      F = U;
                    B < F.length;
                    B++
                  )
                    if (null != (G = F[B]))
                      for (
                        ee = I.default.convert(G, r), w.push(ee), V = 0, W = ee.employees;
                        V < W.length;
                        V++
                      )
                        ((ie = W[V]), (ke += ie.amount));
                  for (a.payList = w, j = 0, H = x; j < H.length; j++)
                    if (null != (K = H[j])) {
                      if (
                        (mt = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(K, "bankallocations.list"),
                        )).length > 0
                      )
                        for (a.paymentDetails = [], Y = 0, Q = mt; Y < Q.length; Y++)
                          null != (yt = Q[Y]) &&
                            ((bt = T.default.convert(yt, r)), a.paymentDetails.push(bt));
                      if (0 == ke) {
                        for (
                          J = q.TallyUtil.parseArray(
                            q.TallyUtil.getJsonValue(K, "categoryallocations.list"),
                          ),
                            X = 0,
                            Z = J;
                          X < Z.length;
                          X++
                        )
                          if (null != ($ = Z[X]))
                            for (
                              ee = I.default.convert($, r), _.push(ee), te = 0, re = ee.employees;
                              te < re.length;
                              te++
                            )
                              ((ie = re[te]), (ke += ie.amount));
                        0 != ke && (a.payList = _);
                      }
                    }
                  return ((a.total = ke), i.push(a), [3, 19]);
                case 2:
                  return a.type !== t.TYPE_PHYSICAL_STOCK
                    ? [3, 3]
                    : ((a.category = t.CATEGORY_PHYSICAL_STOCK_VOUCHERS),
                      (void 0 !== a.items && 0 !== a.items.length) ||
                        ((L = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(e, "allinventoryentries.list"),
                        )),
                        (a.items = t.getInventories(L, 1, r))),
                      (void 0 !== a.items && 0 !== a.items.length) ||
                        ((L = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(e, "inventoryentries.list"),
                        )),
                        (a.items = t.getInventories(L, 1, r))),
                      i.push(a),
                      [3, 19]);
                case 3:
                  return a.type !== t.TYPE_STOCK_JOURNAL
                    ? [3, 4]
                    : ((a.category = t.CATEGORY_STOCK_JOURNAL),
                      (L = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "inventoryentriesin.list"),
                      )),
                      (a.itemsIn = t.getInventories(L, 1, r)),
                      (L = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "inventoryentriesout.list"),
                      )),
                      (a.itemsOut = t.getInventories(L, 1, r)),
                      i.push(a),
                      [3, 19]);
                case 4:
                  if (
                    a.type !== t.TYPE_REJECTION_IN &&
                    a.type !== t.TYPE_REJECTION_OUT &&
                    a.type !== t.TYPE_RECEIPT_NOTE &&
                    a.type !== t.TYPE_DELIVERY_NOTE
                  )
                    return [3, 5];
                  for (
                    a.category = t.CATEGORY_INVENTORY_VOUCHERS,
                      a.shipping = v.default.convert(e, r),
                      a.terms = C.default.convert(e, r),
                      Xt = 1,
                      Zt = 1,
                      a.type === t.TYPE_RECEIPT_NOTE && (Xt = -1),
                      a.charges = [],
                      ae = 0,
                      oe = x;
                    ae < oe.length;
                    ae++
                  )
                    if (((se = oe[ae]), q.Util.isNotNull(se)))
                      if ((!1, "Yes" === q.TallyUtil.getJsonValue(se, "ispartyledger")))
                        (!0,
                          (a.total =
                            q.TallyUtil.parseAmount(q.TallyUtil.getJsonValue(se, "amount")) * Zt));
                      else if (
                        ((L = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(se, "inventoryallocations.list"),
                        )),
                        q.Util.isNotNull(L) && L.length > 0)
                      )
                        for (
                          (void 0 !== a.items && null !== a.items) || (a.items = []),
                            ne = 0,
                            ue = L;
                          ne < ue.length;
                          ne++
                        )
                          null != (ar = ue[ne]) && a.items.push(h.default.convert(ar, Xt, 1, r));
                      else (((or = p.default.convert(se, r)).amount *= Xt), a.charges.push(or));
                  for (
                    (q.Util.isNull(a.items) || 0 === a.items.length) &&
                      ((a.items = []),
                      (L = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "allinventoryentries.list"),
                      )),
                      (a.items = t.getInventories(L, Xt, r))),
                      (q.Util.isNull(a.items) || 0 === a.items.length) &&
                        ((a.items = []),
                        (L = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(e, "inventoryentries.list"),
                        )),
                        (a.items = t.getInventories(L, Xt, r))),
                      a.lrRrNo = q.TallyUtil.getStringValue(e, "billofladingno"),
                      sr = q.TallyUtil.parseDate(
                        q.TallyUtil.getStringValue(e, "billofladingdate"),
                        q.DateUtil.FORMAT_YYYYMMDD,
                        r.company.timezone,
                      ),
                      isNaN(a.lrRrDate)
                        ? q.Log.info(
                            "lrrrdate is NaN. Returned data from tally is" +
                              q.TallyUtil.getStringValue(e, "billofladingdate"),
                          )
                        : (a.lrRrDate = sr),
                      a.motorVehicleNumber = q.TallyUtil.getStringValue(e, "basicshipvesselno"),
                      a.placeOfSupply = q.TallyUtil.getStringValue(e, "placeofsupply"),
                      q.Util.isNull(a.orderListNew) && (a.orderListNew = []),
                      Ue = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "invoiceorderlist.list"),
                      ),
                      pe = 0,
                      ce = Ue;
                    pe < ce.length;
                    pe++
                  )
                    null != (Ge = ce[pe]) &&
                      ((Ve = f.default.convert(Ge, r)), a.orderListNew.push(Ve));
                  return (i.push(a), [3, 19]);
                case 5:
                  if (a.type !== t.TYPE_SALES_ORDER && a.type !== t.TYPE_PURCHASE_ORDER)
                    return [3, 6];
                  for (
                    a.category = t.CATEGORY_ORDERS,
                      a.shipping = v.default.convert(e, r),
                      a.terms = C.default.convert(e, r),
                      Xt = 1,
                      Zt = 1,
                      a.type === t.TYPE_SALES_ORDER
                        ? (Zt = -1)
                        : a.type === t.TYPE_PURCHASE_ORDER && (Xt = -1),
                      a.charges = [],
                      me = 0,
                      le = x;
                    me < le.length;
                    me++
                  )
                    if (((de = le[me]), q.Util.isNotNull(de)))
                      if ((!1, "Yes" === q.TallyUtil.getJsonValue(de, "ispartyledger")))
                        (!0,
                          (a.total =
                            q.TallyUtil.parseAmount(q.TallyUtil.getJsonValue(de, "amount")) * Zt));
                      else if (
                        (L = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(de, "inventoryallocations.list"),
                        )).length > 0
                      ) {
                        if (
                          ((void 0 !== a.items && null !== a.items) || (a.items = []),
                          (void 0 !== a.orderList && null !== a.orderList) || (a.orderList = []),
                          (a.orderList = t.getOrderList(L)),
                          (Se = t.getInventories(L, Xt, r)),
                          q.Util.isNotNull(Se))
                        )
                          for (ye = 0, be = Se; ye < be.length; ye++)
                            ((Qe = be[ye]), a.items.push(Qe));
                      } else (((or = p.default.convert(de, r)).amount *= Xt), a.charges.push(or));
                  if (
                    (void 0 === a.items || 0 === a.items.length) &&
                    ((void 0 !== a.items && null !== a.items) || (a.items = []),
                    (L = q.TallyUtil.parseArray(
                      q.TallyUtil.getJsonValue(e, "allinventoryentries.list"),
                    )),
                    (void 0 !== a.orderList && null !== a.orderList) || (a.orderList = []),
                    (a.orderList = t.getOrderList(L)),
                    (Se = t.getInventories(L, Xt, r)),
                    q.Util.isNotNull(Se))
                  )
                    for (he = 0, ge = Se; he < ge.length; he++) ((Qe = ge[he]), a.items.push(Qe));
                  if (
                    (void 0 === a.items || 0 === a.items.length) &&
                    ((void 0 !== a.items && null !== a.items) || (a.items = []),
                    (L = q.TallyUtil.parseArray(
                      q.TallyUtil.getJsonValue(e, "inventoryentries.list"),
                    )),
                    (void 0 !== a.orderList && null !== a.orderList) || (a.orderList = []),
                    (a.orderList = t.getOrderList(L)),
                    (Se = t.getInventories(L, Xt, r)),
                    q.Util.isNotNull(Se))
                  )
                    for (fe = 0, Ae = Se; fe < Ae.length; fe++) ((Qe = Ae[fe]), a.items.push(Qe));
                  return (
                    (a.lrRrNo = q.TallyUtil.getStringValue(e, "billofladingno")),
                    (sr = q.TallyUtil.parseDate(
                      q.TallyUtil.getStringValue(e, "billofladingdate"),
                      q.DateUtil.FORMAT_YYYYMMDD,
                      r.company.timezone,
                    )),
                    isNaN(a.lrRrDate)
                      ? q.Log.info(
                          "lrrrdate is NaN. Returned data from tally is" +
                            q.TallyUtil.getStringValue(e, "billofladingdate"),
                        )
                      : (a.lrRrDate = sr),
                    (a.motorVehicleNumber = q.TallyUtil.getStringValue(e, "basicshipvesselno")),
                    (a.placeOfSupply = q.TallyUtil.getStringValue(e, "placeofsupply")),
                    i.push(a),
                    [3, 19]
                  );
                case 6:
                  if (
                    a.type !== t.TYPE_SALES &&
                    a.type !== t.TYPE_PURCHASE &&
                    "Sales Account" !== a.type &&
                    "Purchase Account" !== a.type &&
                    "Credit Note" !== a.type &&
                    "Debit Note" !== a.type
                  )
                    return [3, 7];
                  for (
                    a.category = t.CATEGORY_INVOICES,
                      a.shipping = v.default.convert(e, r),
                      a.terms = C.default.convert(e, r),
                      st = 1,
                      Zt = 1,
                      Bt = 1,
                      "Credit Note" === a.type
                        ? ((Bt = -1), (a.type = t.TYPE_SALES))
                        : "Debit Note" === a.type && ((Bt = -1), (a.type = t.TYPE_PURCHASE)),
                      "Sales Account" === a.type
                        ? (a.type = t.TYPE_SALES)
                        : "Purchase Account" === a.type && (a.type = t.TYPE_PURCHASE),
                      a.type === t.TYPE_SALES ? (Zt = -1) : a.type === t.TYPE_PURCHASE && (st = -1),
                      a.charges = [],
                      a.bills = [],
                      Ne = 0,
                      Ie = !1,
                      Te = 0,
                      Me = x;
                    Te < Me.length;
                    Te++
                  )
                    if (null != (ve = Me[Te]))
                      if ((!1, "Yes" === q.TallyUtil.getJsonValue(ve, "ispartyledger"))) {
                        if (
                          (!0,
                          (a.partyId !== q.TallyUtil.getJsonValue(ve, "ledgername") &&
                            a.partyId !== q.TallyUtil.getStringValue(ve, "ledgername")) ||
                            ((ke =
                              q.TallyUtil.parseAmount(q.TallyUtil.getJsonValue(ve, "amount")) * Zt),
                            (0 !== a.total && 0 === ke && !0 === Ie) ||
                              ((a.total = ke), (Ie = !0))),
                          a.isPosInvoice &&
                            ((Ce = M.default.convert(ve, r)),
                            q.Util.isNull(a.posInvoiceDetails) && (a.posInvoiceDetails = []),
                            (Ne += Ce.amount),
                            a.posInvoiceDetails.push(Ce)),
                          (Vt = q.TallyUtil.parseArray(
                            q.TallyUtil.getJsonValue(ve, "billallocations.list"),
                          )).length > 0)
                        )
                          for (
                            q.Util.isNull(a.bills) && (a.bills = []),
                              Wt = q.TallyUtil.getJsonValue(ve, "ledgername"),
                              qe = 0,
                              Re = Vt;
                            qe < Re.length;
                            qe++
                          )
                            null != (De = Re[qe]) &&
                              (Wt === a.partyId && (Wt = void 0),
                              (Kt = u.default.convertVoucherBill(De, a.date, Zt, r, Wt)),
                              a.bills.push(Kt));
                      } else if (
                        (L = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(ve, "inventoryallocations.list"),
                        )).length > 0
                      )
                        for (
                          (void 0 !== a.items && null !== a.items) || (a.items = []),
                            Ee = 0,
                            xe = L;
                          Ee < xe.length;
                          Ee++
                        )
                          null != (ar = xe[Ee]) && a.items.push(h.default.convert(ar, st, Bt, r));
                      else (((or = p.default.convert(ve, r)).amount *= st), a.charges.push(or));
                  if (
                    (a.isPosInvoice && (a.total = Ne), void 0 === a.items || 0 === a.items.length)
                  )
                    for (
                      L = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "allinventoryentries.list"),
                      ),
                        a.items = [],
                        Oe = 0,
                        ze = L;
                      Oe < ze.length;
                      Oe++
                    )
                      null != (ar = ze[Oe]) && a.items.push(h.default.convert(ar, st, Bt, r));
                  if (
                    !q.Util.isFilledArray(a.ewayBills) &&
                    ((Pe = q.TallyUtil.parseArray(
                      q.TallyUtil.getJsonValue(e, "ewaybilldetails.list"),
                    )),
                    (a.ewayBills = []),
                    q.Util.isFilledArray(Pe))
                  )
                    for (Le = 0, we = Pe; Le < we.length; Le++)
                      ((_e = we[Le]),
                        q.Util.isNotNull(_e) && a.ewayBills.push(y.default.convert(_e, r)));
                  for (
                    a.partyDetail = N.default.convert(e),
                      a.consigneeDetail = m.default.convert(e, r),
                      a.eInvoiceDetail = l.default.convert(e, r),
                      (void 0 !== a.orderList && null !== a.orderList) || (a.orderList = []),
                      a.orderList = this.getInvoiceOrderList(e, "invoiceorderlist.list"),
                      q.Util.isNull(a.orderListNew) && (a.orderListNew = []),
                      Ue = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "invoiceorderlist.list"),
                      ),
                      Be = 0,
                      Fe = Ue;
                    Be < Fe.length;
                    Be++
                  )
                    null != (Ge = Fe[Be]) &&
                      ((Ve = f.default.convert(Ge, r)), a.orderListNew.push(Ve));
                  if (
                    (We = q.TallyUtil.parseArray(
                      q.TallyUtil.getJsonValue(e, "invoicedelnotes.list"),
                    )).length > 0
                  ) {
                    for (je = [], Ft = 0; Ft < We.length; ++Ft)
                      null !== We[Ft] && void 0 !== We[Ft] && je.push(d.default.convert(We[Ft], r));
                    a.deliveryNoteDetails = je;
                  }
                  for (He = void 0, Ke = 0, Ye = a.items; Ke < Ye.length; Ke++) {
                    if (
                      ((Qe = Ye[Ke]),
                      q.Util.isNotNull(Qe.batchAllocations) && q.Util.isArray(Qe.batchAllocations))
                    )
                      for (Je = 0, Xe = Qe.batchAllocations; Je < Xe.length; Je++)
                        null != (Ze = Xe[Je]) &&
                          ((Ze.accQuantity = Ze.accQuantity * Bt),
                          q.Util.isNumber(Ze.invQuantity) &&
                            !q.Util.isNaN(Ze.invQuantity) &&
                            (Ze.invQuantity = Ze.invQuantity * Bt),
                          q.Util.isNumber(Ze.subQuantity) &&
                            !q.Util.isNaN(Ze.subQuantity) &&
                            (Ze.subQuantity = Ze.subQuantity * Bt));
                    if (
                      !q.Util.isFilledArray(Qe.accounts) &&
                      (q.Util.isNull(He) &&
                        (He = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(e, "allinventoryentries.list"),
                        )),
                      q.Util.isFilledArray(He))
                    )
                      for ($e = 0, et = He; $e < et.length; $e++)
                        if (
                          ((ar = et[$e]),
                          q.Util.isNotNull(ar) &&
                            q.TallyUtil.getStringValue(ar, "stockitemname") === Qe.id &&
                            (tt = q.TallyUtil.parseArray(
                              q.TallyUtil.getJsonValue(ar, "accountingallocations.list"),
                            )).length > 0)
                        ) {
                          for (rt = [], Ft = 0; Ft < tt.length; ++Ft)
                            null !== tt[Ft] &&
                              void 0 !== tt[Ft] &&
                              rt.push(n.default.convert(tt[Ft], r));
                          Qe.accounts = rt;
                        }
                  }
                  return (
                    (a.lrRrNo = q.TallyUtil.getStringValue(e, "billofladingno")),
                    (sr = q.TallyUtil.parseDate(
                      q.TallyUtil.getStringValue(e, "billofladingdate"),
                      q.DateUtil.FORMAT_YYYYMMDD,
                      r.company.timezone,
                    )),
                    isNaN(a.lrRrDate)
                      ? q.Log.info(
                          "lrrrdate is NaN. Returned data from tally is" +
                            q.TallyUtil.getStringValue(e, "billofladingdate"),
                        )
                      : (a.lrRrDate = sr),
                    (a.motorVehicleNumber = q.TallyUtil.getStringValue(e, "basicshipvesselno")),
                    (a.placeOfSupply = q.TallyUtil.getStringValue(e, "placeofsupply")),
                    i.push(a),
                    [3, 19]
                  );
                case 7:
                  if (a.type !== t.TYPE_PAYMENT && a.type !== t.TYPE_RECEIPT) return [3, 18];
                  ((a.category = t.CATEGORY_TRANSACTIONS),
                    (it = {}),
                    (at = []),
                    (ot = 1),
                    a.type === t.TYPE_PAYMENT && (ot *= -1),
                    (st = 1),
                    a.type === t.TYPE_RECEIPT && (st *= -1),
                    (nt = 0),
                    (ut = x),
                    (s.label = 8));
                case 8:
                  if (!(nt < ut.length)) return [3, 17];
                  if (null == (pt = ut[nt])) return [3, 16];
                  if (
                    ((ct = q.TallyUtil.parseAmount(q.TallyUtil.getJsonValue(pt, "amount"))),
                    (Wt = q.TallyUtil.getStringValue(pt, "ledgername")),
                    (mt = q.TallyUtil.parseArray(
                      q.TallyUtil.getJsonValue(pt, "bankallocations.list"),
                    )).length > 0)
                  )
                    for (a.paymentDetails = [], lt = 0, dt = mt; lt < dt.length; lt++)
                      null != (yt = dt[lt]) &&
                        (((bt = T.default.convert(yt, r)).amount *= -1 * ot),
                        a.paymentDetails.push(bt));
                  return (
                    (ht = t.ledgerGroupByName.get(Wt)),
                    q.Util.isNull(ht)
                      ? (q.Log.info(
                          "Ledger group not found for ledger: " +
                            Wt +
                            " in voucher: " +
                            JSON.stringify(a),
                        ),
                        [4, new k.default(R, new c.default()).syncCompaniesWithTally()])
                      : [3, 15]
                  );
                case 9:
                  return (s.sent(), [4, S.default.get(new c.default(), R).findAll()]);
                case 10:
                  for (gt = s.sent(), St = 0, ft = gt; St < ft.length; St++)
                    if ((At = ft[St])._id.trim() === o._id.trim()) {
                      o.update(At);
                      break;
                    }
                  return [4, new k.default(R, new b.default(), o).syncMastersWithTally()];
                case 11:
                  return (s.sent(), [4, S.default.get(new b.default(), R, o).findAll()]);
                case 12:
                  return (
                    (Nt = s.sent()),
                    t.setGroups(Nt),
                    q.Log.debug("Groups set"),
                    [4, new k.default(R, new g.default(), o).syncMastersWithTally()]
                  );
                case 13:
                  return (s.sent(), [4, S.default.get(new g.default(), R, o).findAll()]);
                case 14:
                  if (
                    ((It = s.sent()),
                    t.setLedgers(It),
                    (It = void 0),
                    q.Log.debug("Ledgers set"),
                    (ht = t.ledgerGroupByName.get(Wt)),
                    q.Util.isNull(ht))
                  )
                    return (
                      q.Log.warn(
                        "[WARNING] Ledger group for ledger not found: " +
                          Wt +
                          " in voucher: " +
                          JSON.stringify(a),
                      ),
                      [2, i]
                    );
                  s.label = 15;
                case 15:
                  if (
                    ((Tt = t.getGroupList(ht)),
                    (Mt = !1),
                    void 0 !== Tt &&
                      (Tt["Bank Accounts".toLowerCase()] ||
                        Tt["Cash-in-hand".toLowerCase()] ||
                        Tt["Bank OD A/c".toLowerCase()]) &&
                      (void 0 === (vt = it[Wt]) && (vt = new A.default()),
                      (vt.partyId = Wt),
                      (vt.partyMasterId = t.getLedgerMasterId(Wt)),
                      (vt.amount += ct * st),
                      (it[Wt] = vt),
                      (Mt = !0)),
                    !1 === Mt)
                  ) {
                    for (
                      kt = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(pt, "billallocations.list"),
                      ),
                        Ct = [],
                        qt = 0,
                        Rt = kt;
                      qt < Rt.length;
                      qt++
                    )
                      null != (Kt = Rt[qt]) &&
                        ((Dt = u.default.convertVoucherBill(Kt, a.date, ot, r, Wt)), Ct.push(Dt));
                    at.push({
                      partyId: Wt,
                      partyMasterId: t.getLedgerMasterId(Wt),
                      amount: ct * ot,
                      bills: Ct,
                    });
                  }
                  s.label = 16;
                case 16:
                  return (nt++, [3, 8]);
                case 17:
                  for (Gt in ((Et = []), it)) null != Gt && Et.push(it[Gt]);
                  if (0 === (xt = Et.length))
                    return (
                      q.Log.warn(
                        "[WARNING]: No account present in transaction: " + JSON.stringify(a),
                      ),
                      [2, i]
                    );
                  if (0 === at.length)
                    for (Ot = 0; Ot < Et.length; ++Ot)
                      null !== Et[Ot] &&
                        void 0 !== Et[Ot] &&
                        (((Ut = t.toObject(a))._id = a._id + ":" + Ot),
                        (Ut.parentId = a._id),
                        (Ut.partyId = Et[Ot].partyId),
                        (Ut.partyMasterId = t.getLedgerMasterId(Ut.partyId)),
                        (Ut.accountId = Et[Ot].partyId),
                        (Ut.accountMasterId = t.getLedgerMasterId(Ut.accountId)),
                        (Ut.total = Et[Ot].amount),
                        i.push(Ut));
                  else if (1 === at.length && 1 === xt)
                    ((a.accountId = Et[0].partyId),
                      (a.accountMasterId = t.getLedgerMasterId(a.accountId)),
                      (a.partyId = at[0].partyId),
                      (a.partyMasterId = t.getLedgerMasterId(a.partyId)),
                      (a.total = at[0].amount),
                      (a.bills = at[0].bills),
                      i.push(a));
                  else if (1 === xt && at.length > 1)
                    for (Ot = 0; Ot < at.length; ++Ot)
                      null !== at[Ot] &&
                        void 0 !== at[Ot] &&
                        (((Ut = t.toObject(a))._id = a._id + ":" + Ot),
                        (Ut.parentId = a._id),
                        (Ut.accountId = Et[0].partyId),
                        (Ut.accountMasterId = t.getLedgerMasterId(Ut.accountId)),
                        (Ut.partyId = at[Ot].partyId),
                        (Ut.partyMasterId = t.getLedgerMasterId(Ut.partyId)),
                        (Ut.total = at[Ot].amount),
                        (Ut.bills = at[Ot].bills),
                        i.push(Ut));
                  else if (xt > 1 && 1 === at.length)
                    for (Ot = 0; Ot < Et.length; ++Ot)
                      null !== Et[Ot] &&
                        void 0 !== Et[Ot] &&
                        (((Ut = t.toObject(a))._id = a._id + ":" + Ot),
                        (Ut.parentId = a._id),
                        (Ut.accountId = Et[Ot].partyId),
                        (Ut.accountMasterId = t.getLedgerMasterId(Ut.accountId)),
                        (Ut.partyId = at[0].partyId),
                        (Ut.partyMasterId = t.getLedgerMasterId(Ut.partyId)),
                        (Ut.total = Et[Ot].amount),
                        0 === Ot && (Ut.bills = at[0].bills),
                        i.push(Ut));
                  else if (xt > 1 && at.length > 1) {
                    for (Ft = 0, zt = 0, Pt = at; zt < Pt.length; zt++)
                      ((Lt = Pt[zt]),
                        ((Ut = t.toObject(a))._id = a._id + ":" + Ft++),
                        (Ut.parentId = a._id),
                        (Ut.partyId = Lt.partyId),
                        (Ut.partyMasterId = t.getLedgerMasterId(Ut.partyId)),
                        (Ut.accountId = void 0),
                        (Ut.total = Lt.amount),
                        (Ut.bills = Lt.bills),
                        i.push(Ut));
                    for (wt = 0, _t = Et; wt < _t.length; wt++)
                      ((Gt = _t[wt]),
                        ((Ut = t.toObject(a))._id = a._id + ":" + Ft++),
                        (Ut.parentId = a._id),
                        (Ut.accountId = Gt.partyId),
                        (Ut.accountMasterId = t.getLedgerMasterId(Ut.accountId)),
                        (Ut.partyId = void 0),
                        (Ut.total = Gt.amount),
                        i.push(Ut));
                  }
                  return [3, 19];
                case 18:
                  if ("Contra" === a.type || a.type === t.TYPE_JOURNAL) {
                    for (
                      -1,
                        1,
                        Bt = 1,
                        a.category = t.CATEGORY_JOURNALS,
                        a.type = t.TYPE_JOURNAL,
                        a.parties = [],
                        Ft = 0;
                      Ft < x.length;
                      ++Ft
                    )
                      if (null !== x[Ft] && void 0 !== x[Ft]) {
                        if (
                          (((Gt = new A.default()).partyId = q.TallyUtil.getStringValue(
                            x[Ft],
                            "ledgername",
                          )),
                          (Gt.partyMasterId = t.getLedgerMasterId(Gt.partyId)),
                          (Gt.amount =
                            -1 *
                            q.TallyUtil.parseAmount(q.TallyUtil.getJsonValue(x[Ft], "amount"))),
                          (Vt = q.TallyUtil.parseArray(
                            q.TallyUtil.getJsonValue(x[Ft], "billallocations.list"),
                          )).length > 0)
                        ) {
                          for (
                            Wt = q.TallyUtil.getStringValue(x[Ft], "ledgername"), jt = [], Ht = 0;
                            Ht < Vt.length;
                            ++Ht
                          )
                            null !== Vt[Ht] &&
                              void 0 !== Vt[Ht] &&
                              (void 0,
                              "Yes" === q.TallyUtil.getStringValue(x[Ft], "isdeemedpositive") &&
                                "debit",
                              (Kt = u.default.convertVoucherBill(Vt[Ht], a.date, -1, r, Wt)),
                              jt.push(Kt));
                          Gt.bills = jt;
                        }
                        if (
                          ((Yt = []),
                          (L = q.TallyUtil.parseArray(
                            q.TallyUtil.getJsonValue(x[Ft], "inventoryallocations.list"),
                          )),
                          q.Util.isNotNull(L) && L.length > 0)
                        ) {
                          for (Qt = 0, Jt = L; Qt < Jt.length; Qt++)
                            ((ar = Jt[Qt]),
                              q.Util.isNotNull(ar) && Yt.push(h.default.convert(ar, 1, Bt, r)));
                          Gt.items = Yt;
                        }
                        a.parties.push(Gt);
                      }
                    i.push(a);
                  } else {
                    if (a.type !== t.TYPE_JOB_WORK_IN_ORDER && a.type !== t.TYPE_JOB_WORK_OUT_ORDER)
                      return (
                        q.Log.warn(
                          "[WARNING]: Ignoring voucher with unknown voucher type: " +
                            JSON.stringify(a),
                        ),
                        [2, i]
                      );
                    for (
                      a.category = t.CATEGORY_JOB_WORK,
                        a.shipping = v.default.convert(e, r),
                        a.terms = C.default.convert(e, r),
                        Xt = 1,
                        Zt = 1,
                        a.type === t.TYPE_JOB_WORK_IN_ORDER
                          ? (Zt = -1)
                          : a.type === t.TYPE_JOB_WORK_OUT_ORDER && (Xt = -1),
                        a.charges = [],
                        $t = 0,
                        er = x;
                      $t < er.length;
                      $t++
                    )
                      if (((tr = er[$t]), q.Util.isNotNull(tr)))
                        if (!0 === q.TallyUtil.getBoolean(e, "ispartyledger"))
                          a.total =
                            q.TallyUtil.parseAmount(q.TallyUtil.getJsonValue(tr, "amount")) * Zt;
                        else if (
                          ((L = q.TallyUtil.parseArray(
                            q.TallyUtil.getJsonValue(tr, "inventoryallocations.list"),
                          )),
                          q.Util.isNotNull(L) && L.length > 0)
                        )
                          for (
                            (void 0 !== a.items && null !== a.items) || (a.items = []),
                              rr = 0,
                              ir = L;
                            rr < ir.length;
                            rr++
                          )
                            null != (ar = ir[rr]) && a.items.push(h.default.convert(ar, Xt, 1, r));
                        else (((or = p.default.convert(tr, r)).amount *= Xt), a.charges.push(or));
                    ((q.Util.isNull(a.items) || 0 === a.items.length) &&
                      ((a.items = []),
                      (L = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "allinventoryentries.list"),
                      )),
                      (a.items = t.getInventories(L, Xt, r))),
                      (q.Util.isNull(a.items) || 0 === a.items.length) &&
                        ((a.items = []),
                        (L = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(e, "inventoryentries.list"),
                        )),
                        (a.items = t.getInventories(L, Xt, r))),
                      (a.lrRrNo = q.TallyUtil.getStringValue(e, "billofladingno")),
                      (sr = q.TallyUtil.parseDate(
                        q.TallyUtil.getStringValue(e, "billofladingdate"),
                        q.DateUtil.FORMAT_YYYYMMDD,
                        r.company.timezone,
                      )),
                      isNaN(a.lrRrDate)
                        ? q.Log.info(
                            "lrrrdate is NaN. Returned data from tally is" +
                              q.TallyUtil.getStringValue(e, "billofladingdate"),
                          )
                        : (a.lrRrDate = sr),
                      (a.motorVehicleNumber = q.TallyUtil.getStringValue(e, "basicshipvesselno")),
                      (a.placeOfSupply = q.TallyUtil.getStringValue(e, "placeofsupply")),
                      i.push(a));
                  }
                  s.label = 19;
                case 19:
                  for (ur = 0, pr = i; ur < pr.length; ur++)
                    0 === (nr = pr[ur]).total &&
                      t.TYPE_DELIVERY_NOTE !== nr.type &&
                      t.TYPE_RECEIPT_NOTE !== nr.type &&
                      t.TYPE_SALES_ORDER !== nr.type &&
                      t.TYPE_PURCHASE_ORDER !== nr.type &&
                      q.Log.warn("[WARNING] Total is 0 for voucher: " + JSON.stringify(nr));
                  return [2, i];
              }
            });
          });
        }),
        (t.masterName = "Voucher"),
        (t.TYPE_PHYSICAL_STOCK = "Physical Stock"),
        (t.TYPE_STOCK_JOURNAL = "Stock Journal"),
        (t.TYPE_REJECTION_OUT = "Rejections Out"),
        (t.TYPE_REJECTION_IN = "Rejections In"),
        (t.TYPE_DELIVERY_NOTE = "Delivery Note"),
        (t.TYPE_RECEIPT_NOTE = "Receipt Note"),
        (t.TYPE_SALES_ORDER = "Sales Order"),
        (t.TYPE_PURCHASE_ORDER = "Purchase Order"),
        (t.TYPE_MATERIAL_IN = "Material In"),
        (t.TYPE_MATERIAL_OUT = "Material Out"),
        (t.TYPE_JOB_WORK_IN_ORDER = "Job Work In Order"),
        (t.TYPE_JOB_WORK_OUT_ORDER = "Job Work Out Order"),
        (t.TYPE_SALES = "Sales"),
        (t.TYPE_PURCHASE = "Purchase"),
        (t.TYPE_RECEIPT = "Receipt"),
        (t.TYPE_PAYMENT = "Payment"),
        (t.TYPE_JOURNAL = "Journal"),
        (t.TYPE_CONTRA = "Contra"),
        (t.TYPE_PAYROLL = "Payroll"),
        (t.VOUCHER_TYPE_ALLOWED = []),
        (t.CATEGORY_PHYSICAL_STOCK_VOUCHERS = "physicalStockVouchers"),
        (t.CATEGORY_INVENTORY_VOUCHERS = "inventoryVouchers"),
        (t.CATEGORY_STOCK_JOURNAL = "stockJournals"),
        (t.CATEGORY_ORDERS = "orders"),
        (t.CATEGORY_PAYROLL = "payroll"),
        (t.CATEGORY_MATERIAL = "material"),
        (t.CATEGORY_JOB_WORK = "jobwork"),
        (t.CATEGORY_INVOICES = "invoices"),
        (t.CATEGORY_TRANSACTIONS = "transactions"),
        (t.CATEGORY_JOURNALS = "journals"),
        (t.LR_RR_DATE = "lrRrDate"),
        (t.TALLY_ALL_MASTER_NAMES = [
          "Currencies",
          "Cost Categories",
          "Cost Centres",
          "Groups",
          "Voucher Types",
          "Godowns",
          "Units",
          "Stock Groups",
          "Stock Categories",
          "Stock Items",
          "Ledgers",
          "Budgets & Scenarios",
          "Attendance/Production Types",
          "Employee Groups",
          "Employees",
        ]),
        (t.keys = [
          "ISOPTIONAL",
          "ISDELETED",
          "ISCANCELLED",
          "DATE",
          "REFERENCEDATE",
          "VOUCHERTYPENAME",
          "VOUCHERNUMBER",
          "REFERENCE",
          "NARRATION",
          "PARTYNAME",
          "PARTYLEDGERNAME",
          "ENTEREDBY",
          "EFFECTIVEDATE",
          "COSTCENTRENAME",
          "AUTOCOSTLEVEL",
          "PARTYGSTIN",
          "CMPGSTIN",
          "GSTREGISTRATION",
          "CMPGSTSTATE",
          "GSTREGISTRATIONTYPE",
          "CMPGSTREGISTRATIONTYPE",
          "ISREVERSECHARGEAPPLICABLE",
          "PARTYMAILINGNAME",
          "STATENAME",
          "CONSIGNEESTATENAME",
          "CONSIGNEEMAILINGNAME",
          "COUNTRYOFRESIDENCE",
          "CONSIGNEECOUNTRYNAME",
          "BILLOFLADINGNO",
          "BILLOFLADINGDATE",
          "BASICSHIPVESSELNO",
          "PLACEOFSUPPLY",
          "BASICSHIPPEDBY",
          "BASICSHIPDOCUMENTNO",
          "BASICFINALDESTINATION",
          "BASICORDERTERMS.LIST",
          "BASICDUEDATEOFPYMT",
          "BASICORDERREF",
          "ISPOSTDATED",
          "HASCASHFLOW",
          "ISINVOICE",
          "ISCOSTCENTRE",
          "HASDISCOUNTS",
          "ISVOID",
          "ISONHOLD",
          "ISDEEMEDPOSITIVE",
          "ALLLEDGERENTRIES.LIST",
          "LEDGERENTRIES.LIST",
          "ALLINVENTORYENTRIES.LIST",
          "INVENTORYENTRIES.LIST",
          "BASICBUYERADDRESS.LIST",
          "BASICBUYERNAME",
          "CONSIGNEECSTNUMBER",
          "CONSIGNEEGSTIN",
          "CONSIGNEEPINCODE",
          "ADDRESS.LIST",
          "BUYERSCSTNUMBER",
          "BASICBUYERSSALESTAXNO",
          "TRADERCONSVATTINNO.LIST",
          "PARTYPINCODE",
          "VOUCHERDESTINATIONGODOWN",
          "VOUCHERSOURCEGODOWN",
          "INVOICEDELNOTES.LIST",
          "CATEGORYENTRY.LIST",
          "CATEGORYALLOCATIONS.LIST",
          "INVENTORYENTRIESIN.LIST",
          "INVENTORYENTRIESOUT.LIST",
          "INVOICEORDERLIST.LIST",
          "EWAYBILLDETAILS.LIST",
          "IRN",
          "IRNACKNO",
          "IRNACKDATE",
          "IRNQRCODE",
          "IRNCANCELLED",
          "BILLTOPLACE",
          "SHIPTOPLACE",
          "DISPATCHFROMNAME",
          "DISPATCHFROMADDRESS.LIST",
          "DISPATCHFROMSTATENAME",
          "DISPATCHFROMPINCODE",
          "DISPATCHFROMPLACE",
        ]),
        (t.syncconfigs = [
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY52, -4719, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY51, -4629, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY50, -4539, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY49, -4449, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY48, -4359, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY47, -4269, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY46, -4179, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY45, -4089, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY44, -3999, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY43, -3909, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY42, -3819, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY41, -3729, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY40, -3639, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY39, -3549, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY38, -3459, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY37, -3369, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY36, -3279, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY35, -3189, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY34, -3099, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY33, -3009, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY32, -2919, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY31, -2829, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY30, -2739, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY29, -2649, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY28, -2559, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY27, -2469, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY26, -2379, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY25, -2289, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY24, -2199, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY23, -2109, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY22, -2019, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY21, -1929, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY20, -1839, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY19, -1749, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY18, -1659, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY17, -1569, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY16, -1479, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY15, -1389, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY14, -1299, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY13, -1209, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY12, -1119, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY11, -1029, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY10, -939, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY9, -849, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY8, -759, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY7, -669, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY6, -579, 90, 220752e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY5, -489, 90, 2592e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY4, -399, 90, 2592e6, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY3, -309, 90, 864e5, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY2, -219, 90, 864e5, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY1, -129, 90, 864e5, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.QUARTERLY, -39, 90, 36e5, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.MONTHLY, -9, 30, 6e5, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.WEEKLY, -2, 7, 6e5, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.DAILY, 1, 3, 6e4, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.FUTURE, 31, 30, 36e5, 0),
          new R.VoucherSyncConfig(R.VoucherSyncConfig.FUTUREYEAR, 366, 365, 864e5, 0),
        ]),
        (t.voucherTypesByName = {}),
        (t.voucherTypeMasterIdByName = new Map()),
        (t.groupsByName = {}),
        (t.groupMasterIdByName = new Map()),
        (t.ledgerGroupByName = new Map()),
        (t.ledgerMasterIdByName = new Map()),
        (t.stockItemMasterIdByName = new Map()),
        (t.stockItemUnitByName = new Map()),
        (t.stockItemAlternateUnitByName = new Map()),
        (t.unitByName = new Map()),
        (t.setVoucherTypes = function (e) {
          ((t.voucherTypesByName = {}), t.voucherTypeMasterIdByName.clear());
          for (var r = 0, i = e; r < i.length; r++) {
            var a = i[r];
            if (
              ((t.voucherTypesByName[q.TallyUtil.removeNoiseChars(a.name)] = a),
              t.voucherTypeMasterIdByName.set(a.name, a.masterId),
              q.Util.isNotNull(a.aliases))
            )
              for (var o = 0, s = a.aliases; o < s.length; o++) {
                var n = s[o];
                q.Util.isNotNull(n.val) &&
                  ((t.voucherTypesByName[q.TallyUtil.removeNoiseChars(n.val)] = a),
                  t.voucherTypeMasterIdByName.set(n.val, a.masterId));
              }
          }
        }),
        (t.setGroups = function (e) {
          ((t.groupsByName = {}), t.groupMasterIdByName.clear());
          for (var r = 0, i = e; r < i.length; r++) {
            var a = i[r];
            if (
              ((t.groupsByName[a.name] = a),
              t.groupMasterIdByName.set(a.name, a.masterId),
              q.Util.isNotNull(a.aliases))
            )
              for (var o = 0, s = a.aliases; o < s.length; o++) {
                var n = s[o];
                q.Util.isNotNull(n.val) &&
                  ((t.groupsByName[n.val] = a), t.groupMasterIdByName.set(n.val, a.masterId));
              }
          }
        }),
        (t.setLedgers = function (e) {
          (t.ledgerGroupByName.clear(), t.ledgerMasterIdByName.clear());
          for (var r = 0, i = e; r < i.length; r++) {
            var a = i[r];
            if (
              (t.ledgerGroupByName.set(a.name, a.parentGroup),
              t.ledgerMasterIdByName.set(a.name, a.masterId),
              q.Util.isNotNull(a.aliases))
            )
              for (var o = 0, s = a.aliases; o < s.length; o++) {
                var n = s[o];
                q.Util.isNotNull(n.val) &&
                  (t.ledgerGroupByName.set(n.val, a.parentGroup),
                  t.ledgerMasterIdByName.set(n.val, a.masterId));
              }
          }
        }),
        (t.setStockItems = function (e) {
          (t.stockItemMasterIdByName.clear(),
            t.stockItemUnitByName.clear(),
            t.stockItemAlternateUnitByName.clear());
          for (var r = 0, i = e; r < i.length; r++) {
            var a = i[r];
            if (
              (t.stockItemMasterIdByName.set(a.name, a.masterId),
              t.stockItemUnitByName.set(a.name, a.unit),
              t.stockItemAlternateUnitByName.set(a.name, a.alternateUnit),
              q.Util.isNotNull(a.aliases))
            )
              for (var o = 0, s = a.aliases; o < s.length; o++) {
                var n = s[o];
                q.Util.isNotNull(n.val) &&
                  (t.stockItemMasterIdByName.set(n.val, a.masterId),
                  t.stockItemUnitByName.set(n.val, a.unit),
                  t.stockItemAlternateUnitByName.set(n.val, a.alternateUnit));
              }
          }
        }),
        (t.setUnits = function (e) {
          t.unitByName.clear();
          for (var r = 0, i = e; r < i.length; r++) {
            var a = i[r];
            t.unitByName.set(a.name, a);
          }
        }),
        (t.getLedgerMasterId = function (e) {
          if (q.Util.isNotNull(e)) return t.ledgerMasterIdByName.get(e);
        }),
        (t.getStockItemMasterId = function (e) {
          if (q.Util.isNotNull(e)) return t.stockItemMasterIdByName.get(e);
        }),
        (t.getStockItemAlternateUnit = function (e) {
          if (q.Util.isNotNull(e)) return t.stockItemAlternateUnitByName.get(e);
        }),
        (t.getStockItemUnit = function (e) {
          if (q.Util.isNotNull(e)) return t.stockItemUnitByName.get(e);
        }),
        (t.getUnitByName = function (e) {
          if (q.Util.isNotNull(e)) return t.unitByName.get(e);
        }),
        (t.getInventories = function (e, t, r) {
          for (var i = [], a = 0, o = e; a < o.length; a++) {
            var s = o[a];
            null != s && i.push(h.default.convert(s, t, 1, r));
          }
          return i;
        }),
        (t.getOrderList = function (e) {
          for (var t = [], r = 0, i = e; r < i.length; r++) {
            var a = i[r];
            if (null != a)
              for (
                var o = 0,
                  s = q.TallyUtil.parseArray(q.TallyUtil.getJsonValue(a, "batchallocations.list"));
                o < s.length;
                o++
              ) {
                var n = s[o];
                if (null != n) {
                  var u = q.TallyUtil.getStringValue(n, "orderno");
                  null != u &&
                    "" !== u.trim() &&
                    "not applicable" !== u.trim().toLowerCase() &&
                    t.push(new E.StringItem(u));
                }
              }
          }
          return t;
        }),
        (t.getInvoiceOrderList = function (e, t) {
          for (
            var r = [], i = 0, a = q.TallyUtil.parseArray(q.TallyUtil.getJsonValue(e, t));
            i < a.length;
            i++
          ) {
            var o = a[i];
            if (null != o) {
              var s = q.TallyUtil.getStringValue(o, "basicpurchaseorderno");
              null != s &&
                "" !== s.trim() &&
                "not applicable" !== s.trim().toLowerCase() &&
                r.push(new E.StringItem(s));
            }
          }
          return r;
        }),
        (t.getRootVoucherType = function (e) {
          var r = t.voucherTypesByName[q.TallyUtil.removeNoiseChars(e)];
          void 0 !== r &&
            void 0 !== r.parent &&
            (r = t.voucherTypesByName[q.TallyUtil.removeNoiseChars(r.parent)]);
          var i = "";
          return (
            void 0 !== r &&
              (i =
                void 0 !== r.reservedName && null !== r.reservedName && "" !== r.reservedName
                  ? r.reservedName
                  : r.name),
            i
          );
        }),
        (t.getGroupList = function (e) {
          var r = {};
          if (e) {
            for (
              var i = 0, a = t.groupsByName[e], o = void 0;
              q.Util.isNotNull(a) && a.name !== o && i < 500;
            )
              (i++,
                q.Util.isNotEmpty(a.reservedName)
                  ? (r[a.reservedName.toLowerCase()] = a.name)
                  : (r[a.name.toLowerCase()] = a.name),
                (o = a.name),
                (a = t.groupsByName[a.parentGroup]));
            500 === i &&
              q.Log.warn(
                '[WARNING] Infinite loop detected in finding parent groups for group: "' + e + '"',
              );
          }
          return r;
        }),
        t
      );
    })(D.Master);
  t.default = x;
};
