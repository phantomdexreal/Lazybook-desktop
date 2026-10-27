// webpack module #110 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
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
  var s = r(507),
    u = r(202),
    p = r(509),
    c = r(59),
    l = r(510),
    m = r(1032),
    d = r(511),
    y = r(1034),
    b = r(512),
    h = r(203),
    f = r(204),
    g = r(30),
    M = r(1039),
    S = r(513),
    A = r(514),
    O = r(515),
    N = r(516),
    v = r(1040),
    T = r(517),
    z = r(205),
    I = r(536),
    q = r(0),
    k = r(49),
    R = r(5),
    C = r(29),
    E = (function (e) {
      function t() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        return (t.isPosInvoice = !1), (t.isUpdated = !1), t;
      }
      return (
        a(t, e),
        (t.prototype.getName = function () {
          return t.masterName;
        }),
        (t.prototype.getKeys = function () {
          return R.Master.keys.concat(t.keys);
        }),
        (t.prototype.parse = function (e, r) {
          return i(this, void 0, void 0, function () {
            return o(this, function (n) {
              switch (n.label) {
                case 0:
                  return [4, t.convert(e, r)];
                case 1:
                  return [2, n.sent()];
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
            for (var n = 0, a = e.tags; n < a.length; n++) {
              var i = a[n];
              r.tags.push(C.StringItem.toObject(i));
            }
          }
          if (q.Util.isNotNull(e.items) && e.items.length > 0) {
            r.items = [];
            for (var o = 0, c = e.items; o < c.length; o++) {
              var b = c[o];
              r.items.push(h.default.toObject(b));
            }
          }
          if (q.Util.isNotNull(e.ewayBills) && e.ewayBills.length > 0) {
            r.ewayBills = [];
            for (var f = 0, g = e.ewayBills; f < g.length; f++) {
              var z = g[f];
              r.ewayBills.push(y.default.toObject(z));
            }
          }
          if (q.Util.isNotNull(e.itemsIn) && e.itemsIn.length > 0) {
            r.itemsIn = [];
            for (var k = 0, R = e.itemsIn; k < R.length; k++) {
              var E = R[k];
              r.itemsIn.push(h.default.toObject(E));
            }
          }
          if (q.Util.isNotNull(e.itemsOut) && e.itemsOut.length > 0) {
            r.itemsOut = [];
            for (var _ = 0, D = e.itemsOut; _ < D.length; _++) {
              var L = D[_];
              r.itemsOut.push(h.default.toObject(L));
            }
          }
          if (q.Util.isNotNull(e.charges) && e.charges.length > 0) {
            r.charges = [];
            for (var x = 0, w = e.charges; x < w.length; x++) {
              var P = w[x];
              r.charges.push(p.default.toObject(P));
            }
          }
          if (
            (q.Util.isNotNull(e.shipping) && (r.shipping = T.default.toObject(e.shipping)),
            q.Util.isNotNull(e.terms) && (r.terms = I.default.toObject(e.terms)),
            q.Util.isNotNull(e.partyDetail) && (r.partyDetail = A.default.toObject(e.partyDetail)),
            q.Util.isNotNull(e.consigneeDetail) &&
              (r.consigneeDetail = l.default.toObject(e.consigneeDetail)),
            q.Util.isNotNull(e.eInvoiceDetail) &&
              (r.eInvoiceDetail = m.default.toObject(e.eInvoiceDetail)),
            q.Util.isNotNull(e.bills) && e.bills.length > 0)
          ) {
            r.bills = [];
            for (var W = 0, B = e.bills; W < B.length; W++) {
              var U = B[W];
              r.bills.push(u.default.toObject(U));
            }
          }
          if (q.Util.isNotNull(e.orderList) && e.orderList.length > 0) {
            r.orderList = [];
            for (var F = 0, G = e.orderList; F < G.length; F++) {
              var j = G[F];
              r.orderList.push(C.StringItem.toObject(j));
            }
          }
          if (q.Util.isNotNull(e.orderListNew) && e.orderListNew.length > 0) {
            r.orderListNew = [];
            for (var V = 0, Y = e.orderListNew; V < Y.length; V++) {
              j = Y[V];
              r.orderListNew.push(M.default.toObject(j));
            }
          }
          if (q.Util.isNotNull(e.paymentDetails) && e.paymentDetails.length > 0) {
            r.paymentDetails = [];
            for (var H = 0, K = e.paymentDetails; H < K.length; H++) {
              var X = K[H];
              r.paymentDetails.push(N.default.toObject(X));
            }
          }
          if (q.Util.isNotNull(e.deliveryNoteDetails) && e.deliveryNoteDetails.length > 0) {
            r.deliveryNoteDetails = [];
            for (var J = 0, Q = e.deliveryNoteDetails; J < Q.length; J++) {
              var $ = Q[J];
              r.deliveryNoteDetails.push(d.default.toObject($));
            }
          }
          if (q.Util.isNotNull(e.parties) && e.parties.length > 0) {
            r.parties = [];
            for (var Z = 0, ee = e.parties; Z < ee.length; Z++) {
              var te = ee[Z];
              r.parties.push(S.default.toObject(te));
            }
          }
          if (q.Util.isNotNull(e.accounts) && e.accounts.length > 0) {
            r.accounts = [];
            for (var re = 0, ne = e.accounts; re < ne.length; re++) {
              var ae = ne[re];
              r.accounts.push(s.default.toObject(ae));
            }
          }
          if (q.Util.isNotNull(e.payList) && e.payList.length > 0) {
            r.payList = [];
            for (var ie = 0, oe = e.payList; ie < oe.length; ie++) {
              var se = oe[ie];
              r.payList.push(O.default.toObject(se));
            }
          }
          if (q.Util.isNotNull(e.posInvoiceDetails) && e.posInvoiceDetails.length > 0) {
            r.posInvoiceDetails = [];
            for (var ue = 0, pe = e.posInvoiceDetails; ue < pe.length; ue++) {
              var ce = pe[ue];
              r.posInvoiceDetails.push(v.default.toObject(ce));
            }
          }
          return r;
        }),
        (t.prototype.equals = function (e) {
          return !!(
            R.Master.compare(this._id, e._id) &&
            R.Master.compare(this.isDeleted, e.isDeleted) &&
            R.Master.compare(this.isUpdated, e.isUpdated) &&
            R.Master.compare(this.customId, e.customId) &&
            R.Master.compare(this.type, e.type) &&
            R.Master.compare(this.customType, e.customType) &&
            R.Master.compare(this.category, e.category) &&
            R.Master.compare(this.date, e.date) &&
            R.Master.compare(this.desc, e.desc) &&
            R.Master.compare(this.partyId, e.partyId) &&
            R.Master.compare(this.partyName, e.partyName) &&
            R.Master.compare(this.partyMasterId, e.partyMasterId) &&
            R.Master.compare(this.partyDetail, e.partyDetail) &&
            R.Master.compare(this.consigneeDetail, e.consigneeDetail) &&
            R.Master.compare(this.enteredBy, e.enteredBy) &&
            R.Master.compare(this.tallyReference, e.tallyReference) &&
            R.Master.compare(this.refDate, e.refDate) &&
            R.Master.compare(this.tags, e.tags) &&
            R.Master.compare(this.partyMailingName, e.partyMailingName) &&
            R.Master.compare(this.total, e.total) &&
            R.Master.compare(this.items, e.items) &&
            R.Master.compare(this.ewayBills, e.ewayBills) &&
            R.Master.compare(this.itemsIn, e.itemsIn) &&
            R.Master.compare(this.itemsOut, e.itemsOut) &&
            R.Master.compare(this.charges, e.charges) &&
            R.Master.compare(this.shipping, e.shipping) &&
            R.Master.compare(this.terms, e.terms) &&
            R.Master.compare(this.bills, e.bills) &&
            R.Master.compare(this.orderList, e.orderList) &&
            R.Master.compare(this.orderListNew, e.orderListNew) &&
            R.Master.compare(this.paymentDetails, e.paymentDetails) &&
            R.Master.compare(this.deliveryNoteDetails, e.deliveryNoteDetails) &&
            R.Master.compare(this.accountId, e.accountId) &&
            R.Master.compare(this.accountMasterId, e.accountMasterId) &&
            R.Master.compare(this.parentId, e.parentId) &&
            R.Master.compare(this.parties, e.parties) &&
            R.Master.compare(this.accounts, e.accounts) &&
            R.Master.compare(this.costCentreName, e.costCentreName) &&
            R.Master.compare(this.placeOfSupply, e.placeOfSupply) &&
            R.Master.compare(this.effectiveDate, e.effectiveDate) &&
            R.Master.compare(this.payList, e.payList) &&
            R.Master.compare(this.destinationGodown, e.destinationGodown) &&
            R.Master.compare(this.sourceGodown, e.sourceGodown) &&
            R.Master.compare(this.partyGstIn, e.partyGstIn) &&
            R.Master.compare(this.companyGstIn, e.companyGstIn) &&
            R.Master.compare(this.gstRegistrationType, e.gstRegistrationType) &&
            R.Master.compare(this.companyGstRegistrationType, e.companyGstRegistrationType) &&
            R.Master.compare(this.isReverseChargeApplicable, e.isReverseChargeApplicable) &&
            R.Master.compare(this.companyGstRegistration, e.companyGstRegistration) &&
            R.Master.compare(this.companyGstState, e.companyGstState) &&
            R.Master.compare(this.consigneeGstIn, e.consigneeGstIn) &&
            R.Master.compare(this.motorVehicleNumber, e.motorVehicleNumber) &&
            R.Master.compare(this.lrRrNo, e.lrRrNo) &&
            R.Master.compare(this.lrRrDate, e.lrRrDate) &&
            R.Master.compare(this.isPosInvoice, e.isPosInvoice) &&
            R.Master.compare(this.posInvoiceDetails, e.posInvoiceDetails) &&
            R.Master.compare(this.eInvoiceDetail, e.eInvoiceDetail)
          );
        }),
        (t.prototype.updateFromTally = function (e) {
          (this._id = e._id),
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
            (this.eInvoiceDetail = e.eInvoiceDetail);
        }),
        (t.convert = function (e, r) {
          return i(this, void 0, void 0, function () {
            var n,
              a,
              i,
              k,
              R,
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
              Q,
              $,
              Z,
              ee,
              te,
              re,
              ne,
              ae,
              ie,
              oe,
              se,
              ue,
              pe,
              ce,
              le,
              me,
              de,
              ye,
              be,
              he,
              fe,
              ge,
              Me,
              Se,
              Ae,
              Oe,
              Ne,
              ve,
              Te,
              ze,
              Ie,
              qe,
              ke,
              Re,
              Ce,
              Ee,
              _e,
              De,
              Le,
              xe,
              we,
              Pe,
              We,
              Be,
              Ue,
              Fe,
              Ge,
              je,
              Ve,
              Ye,
              He,
              Ke,
              Xe,
              Je,
              Qe,
              $e,
              Ze,
              et,
              tt,
              rt,
              nt,
              at,
              it,
              ot,
              st,
              ut,
              pt,
              ct,
              lt,
              mt,
              dt,
              yt,
              bt,
              ht,
              ft,
              gt,
              Mt,
              St,
              At,
              Ot,
              Nt,
              vt,
              Tt,
              zt,
              It,
              qt,
              kt,
              Rt,
              Ct,
              Et,
              _t,
              Dt,
              Lt,
              xt,
              wt,
              Pt,
              Wt,
              Bt,
              Ut,
              Ft,
              Gt,
              jt,
              Vt,
              Yt,
              Ht,
              Kt,
              Xt,
              Jt,
              Qt,
              $t,
              Zt,
              er,
              tr,
              rr,
              nr,
              ar,
              ir,
              or,
              sr,
              ur,
              pr;
            return o(this, function (o) {
              switch (o.label) {
                case 0:
                  if (
                    ((n = []),
                    (a = new t()),
                    q.Util.isNotNull(r) && ((i = r.company), (k = r.userId)),
                    (a._id = q.TallyUtil.getStringValue(e, "guid")),
                    (a.masterId = q.TallyUtil.getIntValue(e, "masterid")),
                    (a.alterId = q.TallyUtil.getIntValue(e, "alterid")),
                    (a.customId = q.TallyUtil.getStringValue(e, "vouchernumber")),
                    (a.customType = q.TallyUtil.getStringValue(e, "vchtype", !0)),
                    q.Util.isNotNull(
                      t.voucherTypesByName[q.TallyUtil.removeNoiseChars(a.customType)]
                    ) &&
                      (a.isPosInvoice =
                        t.voucherTypesByName[
                          q.TallyUtil.removeNoiseChars(a.customType)
                        ].useForPosInvoice),
                    (a.type = t.getRootVoucherType(a.customType)),
                    q.Util.isNotNull(i) && q.Util.isNotNull(i.timezone)
                      ? (a.date = q.TallyUtil.parseDate(
                          q.TallyUtil.getStringValue(e, "date"),
                          q.DateUtil.FORMAT_YYYYMMDD,
                          i.timezone
                        ))
                      : (a.date = q.TallyUtil.parseDate(
                          q.TallyUtil.getStringValue(e, "date"),
                          q.DateUtil.FORMAT_YYYYMMDD
                        )),
                    (a.desc = q.TallyUtil.getStringValue(e, "narration")),
                    (a.partyId = q.TallyUtil.getStringValue(e, "partyledgername")),
                    (R = q.TallyUtil.getStringValue(e, "partyname")),
                    (a.partyName = R),
                    (void 0 === a.partyId ||
                      null === a.partyId ||
                      "" === a.partyId.trim() ||
                      (a.isPosInvoice && q.Util.isNotEmpty(R))) &&
                      (a.partyId = R),
                    (a.partyMailingName = q.TallyUtil.getStringValue(e, "partymailingname")),
                    (a.enteredBy = q.TallyUtil.getStringValue(e, "enteredBy")),
                    (a.tallyReference = q.TallyUtil.getStringValue(e, "reference")),
                    q.Util.isNotNull(i) && q.Util.isNotNull(i.timezone)
                      ? (a.refDate = q.TallyUtil.parseDate(
                          q.TallyUtil.getStringValue(e, "referencedate"),
                          "YYYYMMDD",
                          i.timezone
                        ))
                      : (a.refDate = q.TallyUtil.parseDate(
                          q.TallyUtil.getStringValue(e, "referencedate"),
                          "YYYYMMDD"
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
                      "cmpgstregistrationtype"
                    )),
                    (a.isReverseChargeApplicable = q.TallyUtil.getBoolean(
                      e,
                      "isreversechargeapplicable"
                    )),
                    q.Util.isNotNull(i) && q.Util.isNotNull(i.timezone)
                      ? (a.effectiveDate = q.TallyUtil.parseDate(
                          q.TallyUtil.getStringValue(e, "effectivedate"),
                          q.DateUtil.FORMAT_YYYYMMDD,
                          i.timezone
                        ))
                      : (a.effectiveDate = q.TallyUtil.parseDate(
                          q.TallyUtil.getStringValue(e, "effectivedate"),
                          q.DateUtil.FORMAT_YYYYMMDD
                        )),
                    q.TallyUtil.getTag(e, "iscancelled"))
                  )
                    return (a.isDeleted = !0), n.push(a), [2, n];
                  if (q.TallyUtil.getTag(e, "isdeleted") || q.TallyUtil.getTag(e, "isoptional"))
                    return (a.isDeleted = !0), n.push(a), [2, n];
                  if (
                    ((a.tags = []),
                    q.TallyUtil.getTag(e, "hascashflow") &&
                      a.tags.push(new C.StringItem("cashFlow")),
                    q.TallyUtil.getTag(e, "isinvoice") && a.tags.push(new C.StringItem("invoice")),
                    q.TallyUtil.getTag(e, "hasdiscounts") &&
                      a.tags.push(new C.StringItem("discounts")),
                    q.TallyUtil.getTag(e, "isvoid") && a.tags.push(new C.StringItem("void")),
                    q.TallyUtil.getTag(e, "isonhold") && a.tags.push(new C.StringItem("onhold")),
                    q.TallyUtil.getTag(e, "iscostcentre") &&
                      a.tags.push(new C.StringItem("costcentre")),
                    q.TallyUtil.getTag(e, "isdeemedpositive") &&
                      a.tags.push(new C.StringItem("deemedpositive")),
                    q.TallyUtil.getTag(e, "ispostdated") &&
                      a.tags.push(new C.StringItem("postdated")),
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
                            JSON.stringify(a)
                        ),
                        [2, n]
                      );
                  } else a.partyMasterId = t.getLedgerMasterId(a.partyId);
                  for (
                    0 ===
                      (E = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "allledgerentries.list")
                      )).length &&
                      (E = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "ledgerentries.list")
                      )),
                      a.accounts = [],
                      _ = 0,
                      D = E;
                    _ < D.length;
                    _++
                  )
                    (L = D[_]),
                      q.Util.isNotNull(L) && ((Ft = s.default.convert(L, r)), a.accounts.push(Ft));
                  return a.type !== t.TYPE_MATERIAL_IN && a.type !== t.TYPE_MATERIAL_OUT
                    ? [3, 1]
                    : ((a.category = t.CATEGORY_MATERIAL),
                      (a.destinationGodown = q.TallyUtil.getStringValue(
                        e,
                        "voucherdestinationgodown"
                      )),
                      (a.sourceGodown = q.TallyUtil.getStringValue(e, "vouchersourcegodown")),
                      (x = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "inventoryentriesin.list")
                      )),
                      (a.itemsIn = t.getInventories(x, 1, r)),
                      (x = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "inventoryentriesout.list")
                      )),
                      (a.itemsOut = t.getInventories(x, 1, r)),
                      n.push(a),
                      [3, 19]);
                case 1:
                  if (a.type !== t.TYPE_PAYROLL) return [3, 2];
                  for (
                    a.category = t.CATEGORY_PAYROLL,
                      ze = 0,
                      w = [],
                      P = [],
                      W = q.TallyUtil.parseArray(q.TallyUtil.getJsonValue(e, "categoryentry.list")),
                      B = 0,
                      U = W;
                    B < U.length;
                    B++
                  )
                    if (null != (F = U[B]))
                      for (
                        ee = O.default.convert(F, r), w.push(ee), G = 0, j = ee.employees;
                        G < j.length;
                        G++
                      )
                        (ne = j[G]), (ze += ne.amount);
                  for (a.payList = w, V = 0, Y = E; V < Y.length; V++)
                    if (null != (H = Y[V])) {
                      if (
                        (lt = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(H, "bankallocations.list")
                        )).length > 0
                      )
                        for (a.paymentDetails = [], K = 0, X = lt; K < X.length; K++)
                          null != (yt = X[K]) &&
                            ((bt = N.default.convert(yt, r)), a.paymentDetails.push(bt));
                      if (0 == ze) {
                        for (
                          J = q.TallyUtil.parseArray(
                            q.TallyUtil.getJsonValue(H, "categoryallocations.list")
                          ),
                            Q = 0,
                            $ = J;
                          Q < $.length;
                          Q++
                        )
                          if (null != (Z = $[Q]))
                            for (
                              ee = O.default.convert(Z, r), P.push(ee), te = 0, re = ee.employees;
                              te < re.length;
                              te++
                            )
                              (ne = re[te]), (ze += ne.amount);
                        0 != ze && (a.payList = P);
                      }
                    }
                  return (a.total = ze), n.push(a), [3, 19];
                case 2:
                  return a.type !== t.TYPE_PHYSICAL_STOCK
                    ? [3, 3]
                    : ((a.category = t.CATEGORY_PHYSICAL_STOCK_VOUCHERS),
                      (void 0 !== a.items && 0 !== a.items.length) ||
                        ((x = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(e, "allinventoryentries.list")
                        )),
                        (a.items = t.getInventories(x, 1, r))),
                      (void 0 !== a.items && 0 !== a.items.length) ||
                        ((x = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(e, "inventoryentries.list")
                        )),
                        (a.items = t.getInventories(x, 1, r))),
                      n.push(a),
                      [3, 19]);
                case 3:
                  return a.type !== t.TYPE_STOCK_JOURNAL
                    ? [3, 4]
                    : ((a.category = t.CATEGORY_STOCK_JOURNAL),
                      (x = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "inventoryentriesin.list")
                      )),
                      (a.itemsIn = t.getInventories(x, 1, r)),
                      (x = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "inventoryentriesout.list")
                      )),
                      (a.itemsOut = t.getInventories(x, 1, r)),
                      n.push(a),
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
                      a.shipping = T.default.convert(e, r),
                      a.terms = I.default.convert(e, r),
                      Qt = 1,
                      $t = 1,
                      a.type === t.TYPE_RECEIPT_NOTE && (Qt = -1),
                      a.charges = [],
                      ae = 0,
                      ie = E;
                    ae < ie.length;
                    ae++
                  )
                    if (((oe = ie[ae]), q.Util.isNotNull(oe)))
                      if ((!1, "Yes" === q.TallyUtil.getJsonValue(oe, "ispartyledger")))
                        !0,
                          (a.total =
                            q.TallyUtil.parseAmount(q.TallyUtil.getJsonValue(oe, "amount")) * $t);
                      else if (
                        ((x = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(oe, "inventoryallocations.list")
                        )),
                        q.Util.isNotNull(x) && x.length > 0)
                      )
                        for (
                          (void 0 !== a.items && null !== a.items) || (a.items = []),
                            se = 0,
                            ue = x;
                          se < ue.length;
                          se++
                        )
                          null != (ar = ue[se]) && a.items.push(h.default.convert(ar, Qt, 1, r));
                      else ((ir = p.default.convert(oe, r)).amount *= Qt), a.charges.push(ir);
                  for (
                    (q.Util.isNull(a.items) || 0 === a.items.length) &&
                      ((a.items = []),
                      (x = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "allinventoryentries.list")
                      )),
                      (a.items = t.getInventories(x, Qt, r))),
                      (q.Util.isNull(a.items) || 0 === a.items.length) &&
                        ((a.items = []),
                        (x = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(e, "inventoryentries.list")
                        )),
                        (a.items = t.getInventories(x, Qt, r))),
                      a.lrRrNo = q.TallyUtil.getStringValue(e, "billofladingno"),
                      or = q.TallyUtil.parseDate(
                        q.TallyUtil.getStringValue(e, "billofladingdate"),
                        q.DateUtil.FORMAT_YYYYMMDD,
                        r.company.timezone
                      ),
                      isNaN(a.lrRrDate)
                        ? q.Log.info(
                            "lrrrdate is NaN. Returned data from tally is" +
                              q.TallyUtil.getStringValue(e, "billofladingdate")
                          )
                        : (a.lrRrDate = or),
                      a.motorVehicleNumber = q.TallyUtil.getStringValue(e, "basicshipvesselno"),
                      a.placeOfSupply = q.TallyUtil.getStringValue(e, "placeofsupply"),
                      q.Util.isNull(a.orderListNew) && (a.orderListNew = []),
                      We = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "invoiceorderlist.list")
                      ),
                      pe = 0,
                      ce = We;
                    pe < ce.length;
                    pe++
                  )
                    null != (Fe = ce[pe]) &&
                      ((Ge = M.default.convert(Fe, r)), a.orderListNew.push(Ge));
                  return n.push(a), [3, 19];
                case 5:
                  if (a.type !== t.TYPE_SALES_ORDER && a.type !== t.TYPE_PURCHASE_ORDER)
                    return [3, 6];
                  for (
                    a.category = t.CATEGORY_ORDERS,
                      a.shipping = T.default.convert(e, r),
                      a.terms = I.default.convert(e, r),
                      Qt = 1,
                      $t = 1,
                      a.type === t.TYPE_SALES_ORDER
                        ? ($t = -1)
                        : a.type === t.TYPE_PURCHASE_ORDER && (Qt = -1),
                      a.charges = [],
                      le = 0,
                      me = E;
                    le < me.length;
                    le++
                  )
                    if (((de = me[le]), q.Util.isNotNull(de)))
                      if ((!1, "Yes" === q.TallyUtil.getJsonValue(de, "ispartyledger")))
                        !0,
                          (a.total =
                            q.TallyUtil.parseAmount(q.TallyUtil.getJsonValue(de, "amount")) * $t);
                      else if (
                        (x = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(de, "inventoryallocations.list")
                        )).length > 0
                      ) {
                        if (
                          ((void 0 !== a.items && null !== a.items) || (a.items = []),
                          (void 0 !== a.orderList && null !== a.orderList) || (a.orderList = []),
                          (a.orderList = t.getOrderList(x)),
                          (ge = t.getInventories(x, Qt, r)),
                          q.Util.isNotNull(ge))
                        )
                          for (ye = 0, be = ge; ye < be.length; ye++)
                            (Xe = be[ye]), a.items.push(Xe);
                      } else ((ir = p.default.convert(de, r)).amount *= Qt), a.charges.push(ir);
                  if (
                    (void 0 === a.items || 0 === a.items.length) &&
                    ((void 0 !== a.items && null !== a.items) || (a.items = []),
                    (x = q.TallyUtil.parseArray(
                      q.TallyUtil.getJsonValue(e, "allinventoryentries.list")
                    )),
                    (void 0 !== a.orderList && null !== a.orderList) || (a.orderList = []),
                    (a.orderList = t.getOrderList(x)),
                    (ge = t.getInventories(x, Qt, r)),
                    q.Util.isNotNull(ge))
                  )
                    for (he = 0, fe = ge; he < fe.length; he++) (Xe = fe[he]), a.items.push(Xe);
                  if (
                    (void 0 === a.items || 0 === a.items.length) &&
                    ((void 0 !== a.items && null !== a.items) || (a.items = []),
                    (x = q.TallyUtil.parseArray(
                      q.TallyUtil.getJsonValue(e, "inventoryentries.list")
                    )),
                    (void 0 !== a.orderList && null !== a.orderList) || (a.orderList = []),
                    (a.orderList = t.getOrderList(x)),
                    (ge = t.getInventories(x, Qt, r)),
                    q.Util.isNotNull(ge))
                  )
                    for (Me = 0, Se = ge; Me < Se.length; Me++) (Xe = Se[Me]), a.items.push(Xe);
                  return (
                    (a.lrRrNo = q.TallyUtil.getStringValue(e, "billofladingno")),
                    (or = q.TallyUtil.parseDate(
                      q.TallyUtil.getStringValue(e, "billofladingdate"),
                      q.DateUtil.FORMAT_YYYYMMDD,
                      r.company.timezone
                    )),
                    isNaN(a.lrRrDate)
                      ? q.Log.info(
                          "lrrrdate is NaN. Returned data from tally is" +
                            q.TallyUtil.getStringValue(e, "billofladingdate")
                        )
                      : (a.lrRrDate = or),
                    (a.motorVehicleNumber = q.TallyUtil.getStringValue(e, "basicshipvesselno")),
                    (a.placeOfSupply = q.TallyUtil.getStringValue(e, "placeofsupply")),
                    n.push(a),
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
                      a.shipping = T.default.convert(e, r),
                      a.terms = I.default.convert(e, r),
                      ot = 1,
                      $t = 1,
                      Bt = 1,
                      "Credit Note" === a.type
                        ? ((Bt = -1), (a.type = t.TYPE_SALES))
                        : "Debit Note" === a.type && ((Bt = -1), (a.type = t.TYPE_PURCHASE)),
                      "Sales Account" === a.type
                        ? (a.type = t.TYPE_SALES)
                        : "Purchase Account" === a.type && (a.type = t.TYPE_PURCHASE),
                      a.type === t.TYPE_SALES ? ($t = -1) : a.type === t.TYPE_PURCHASE && (ot = -1),
                      a.charges = [],
                      a.bills = [],
                      Ae = 0,
                      Oe = !1,
                      Ne = 0,
                      ve = E;
                    Ne < ve.length;
                    Ne++
                  )
                    if (null != (Te = ve[Ne]))
                      if ((!1, "Yes" === q.TallyUtil.getJsonValue(Te, "ispartyledger"))) {
                        if (
                          (!0,
                          (a.partyId !== q.TallyUtil.getJsonValue(Te, "ledgername") &&
                            a.partyId !== q.TallyUtil.getStringValue(Te, "ledgername")) ||
                            ((ze =
                              q.TallyUtil.parseAmount(q.TallyUtil.getJsonValue(Te, "amount")) * $t),
                            (0 !== a.total && 0 === ze && !0 === Oe) ||
                              ((a.total = ze), (Oe = !0))),
                          a.isPosInvoice &&
                            ((Ie = v.default.convert(Te, r)),
                            q.Util.isNull(a.posInvoiceDetails) && (a.posInvoiceDetails = []),
                            (Ae += Ie.amount),
                            a.posInvoiceDetails.push(Ie)),
                          (Gt = q.TallyUtil.parseArray(
                            q.TallyUtil.getJsonValue(Te, "billallocations.list")
                          )).length > 0)
                        )
                          for (
                            q.Util.isNull(a.bills) && (a.bills = []),
                              jt = q.TallyUtil.getJsonValue(Te, "ledgername"),
                              qe = 0,
                              ke = Gt;
                            qe < ke.length;
                            qe++
                          )
                            null != (Re = ke[qe]) &&
                              (jt === a.partyId && (jt = void 0),
                              (Ht = u.default.convertVoucherBill(Re, a.date, $t, r, jt)),
                              a.bills.push(Ht));
                      } else if (
                        (x = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(Te, "inventoryallocations.list")
                        )).length > 0
                      )
                        for (
                          (void 0 !== a.items && null !== a.items) || (a.items = []),
                            Ce = 0,
                            Ee = x;
                          Ce < Ee.length;
                          Ce++
                        )
                          null != (ar = Ee[Ce]) && a.items.push(h.default.convert(ar, ot, Bt, r));
                      else ((ir = p.default.convert(Te, r)).amount *= ot), a.charges.push(ir);
                  if (
                    (a.isPosInvoice && (a.total = Ae), void 0 === a.items || 0 === a.items.length)
                  )
                    for (
                      x = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "allinventoryentries.list")
                      ),
                        a.items = [],
                        _e = 0,
                        De = x;
                      _e < De.length;
                      _e++
                    )
                      null != (ar = De[_e]) && a.items.push(h.default.convert(ar, ot, Bt, r));
                  if (
                    !q.Util.isFilledArray(a.ewayBills) &&
                    ((Le = q.TallyUtil.parseArray(
                      q.TallyUtil.getJsonValue(e, "ewaybilldetails.list")
                    )),
                    (a.ewayBills = []),
                    q.Util.isFilledArray(Le))
                  )
                    for (xe = 0, we = Le; xe < we.length; xe++)
                      (Pe = we[xe]),
                        q.Util.isNotNull(Pe) && a.ewayBills.push(y.default.convert(Pe, r));
                  for (
                    a.partyDetail = A.default.convert(e),
                      a.consigneeDetail = l.default.convert(e, r),
                      a.eInvoiceDetail = m.default.convert(e, r),
                      (void 0 !== a.orderList && null !== a.orderList) || (a.orderList = []),
                      a.orderList = this.getInvoiceOrderList(e, "invoiceorderlist.list"),
                      q.Util.isNull(a.orderListNew) && (a.orderListNew = []),
                      We = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "invoiceorderlist.list")
                      ),
                      Be = 0,
                      Ue = We;
                    Be < Ue.length;
                    Be++
                  )
                    null != (Fe = Ue[Be]) &&
                      ((Ge = M.default.convert(Fe, r)), a.orderListNew.push(Ge));
                  if (
                    (je = q.TallyUtil.parseArray(
                      q.TallyUtil.getJsonValue(e, "invoicedelnotes.list")
                    )).length > 0
                  ) {
                    for (Ve = [], Ut = 0; Ut < je.length; ++Ut)
                      null !== je[Ut] && void 0 !== je[Ut] && Ve.push(d.default.convert(je[Ut], r));
                    a.deliveryNoteDetails = Ve;
                  }
                  for (Ye = void 0, He = 0, Ke = a.items; He < Ke.length; He++) {
                    if (
                      ((Xe = Ke[He]),
                      q.Util.isNotNull(Xe.batchAllocations) && q.Util.isArray(Xe.batchAllocations))
                    )
                      for (Je = 0, Qe = Xe.batchAllocations; Je < Qe.length; Je++)
                        null != ($e = Qe[Je]) &&
                          (($e.accQuantity = $e.accQuantity * Bt),
                          q.Util.isNumber($e.invQuantity) &&
                            !q.Util.isNaN($e.invQuantity) &&
                            ($e.invQuantity = $e.invQuantity * Bt),
                          q.Util.isNumber($e.subQuantity) &&
                            !q.Util.isNaN($e.subQuantity) &&
                            ($e.subQuantity = $e.subQuantity * Bt));
                    if (
                      !q.Util.isFilledArray(Xe.accounts) &&
                      (q.Util.isNull(Ye) &&
                        (Ye = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(e, "allinventoryentries.list")
                        )),
                      q.Util.isFilledArray(Ye))
                    )
                      for (Ze = 0, et = Ye; Ze < et.length; Ze++)
                        if (
                          ((ar = et[Ze]),
                          q.Util.isNotNull(ar) &&
                            q.TallyUtil.getStringValue(ar, "stockitemname") === Xe.id &&
                            (tt = q.TallyUtil.parseArray(
                              q.TallyUtil.getJsonValue(ar, "accountingallocations.list")
                            )).length > 0)
                        ) {
                          for (rt = [], Ut = 0; Ut < tt.length; ++Ut)
                            null !== tt[Ut] &&
                              void 0 !== tt[Ut] &&
                              rt.push(s.default.convert(tt[Ut], r));
                          Xe.accounts = rt;
                        }
                  }
                  return (
                    (a.lrRrNo = q.TallyUtil.getStringValue(e, "billofladingno")),
                    (or = q.TallyUtil.parseDate(
                      q.TallyUtil.getStringValue(e, "billofladingdate"),
                      q.DateUtil.FORMAT_YYYYMMDD,
                      r.company.timezone
                    )),
                    isNaN(a.lrRrDate)
                      ? q.Log.info(
                          "lrrrdate is NaN. Returned data from tally is" +
                            q.TallyUtil.getStringValue(e, "billofladingdate")
                        )
                      : (a.lrRrDate = or),
                    (a.motorVehicleNumber = q.TallyUtil.getStringValue(e, "basicshipvesselno")),
                    (a.placeOfSupply = q.TallyUtil.getStringValue(e, "placeofsupply")),
                    n.push(a),
                    [3, 19]
                  );
                case 7:
                  if (a.type !== t.TYPE_PAYMENT && a.type !== t.TYPE_RECEIPT) return [3, 18];
                  (a.category = t.CATEGORY_TRANSACTIONS),
                    (nt = {}),
                    (at = []),
                    (it = 1),
                    a.type === t.TYPE_PAYMENT && (it *= -1),
                    (ot = 1),
                    a.type === t.TYPE_RECEIPT && (ot *= -1),
                    (st = 0),
                    (ut = E),
                    (o.label = 8);
                case 8:
                  if (!(st < ut.length)) return [3, 17];
                  if (null == (pt = ut[st])) return [3, 16];
                  if (
                    ((ct = q.TallyUtil.parseAmount(q.TallyUtil.getJsonValue(pt, "amount"))),
                    (jt = q.TallyUtil.getStringValue(pt, "ledgername")),
                    (lt = q.TallyUtil.parseArray(
                      q.TallyUtil.getJsonValue(pt, "bankallocations.list")
                    )).length > 0)
                  )
                    for (a.paymentDetails = [], mt = 0, dt = lt; mt < dt.length; mt++)
                      null != (yt = dt[mt]) &&
                        (((bt = N.default.convert(yt, r)).amount *= -1 * it),
                        a.paymentDetails.push(bt));
                  return (
                    (ht = t.ledgerGroupByName.get(jt)),
                    q.Util.isNull(ht)
                      ? (q.Log.info(
                          "Ledger group not found for ledger: " +
                            jt +
                            " in voucher: " +
                            JSON.stringify(a)
                        ),
                        [4, new z.default(k, new c.default()).syncCompaniesWithTally()])
                      : [3, 15]
                  );
                case 9:
                  return o.sent(), [4, g.default.get(new c.default(), k).findAll()];
                case 10:
                  for (ft = o.sent(), gt = 0, Mt = ft; gt < Mt.length; gt++)
                    if ((St = Mt[gt])._id.trim() === i._id.trim()) {
                      i.update(St);
                      break;
                    }
                  return [4, new z.default(k, new b.default(), i).syncMastersWithTally()];
                case 11:
                  return o.sent(), [4, g.default.get(new b.default(), k, i).findAll()];
                case 12:
                  return (
                    (At = o.sent()),
                    t.setGroups(At),
                    q.Log.debug("Groups set"),
                    [4, new z.default(k, new f.default(), i).syncMastersWithTally()]
                  );
                case 13:
                  return o.sent(), [4, g.default.get(new f.default(), k, i).findAll()];
                case 14:
                  if (
                    ((Ot = o.sent()),
                    t.setLedgers(Ot),
                    (Ot = void 0),
                    q.Log.debug("Ledgers set"),
                    (ht = t.ledgerGroupByName.get(jt)),
                    q.Util.isNull(ht))
                  )
                    return (
                      q.Log.warn(
                        "[WARNING] Ledger group for ledger not found: " +
                          jt +
                          " in voucher: " +
                          JSON.stringify(a)
                      ),
                      [2, n]
                    );
                  o.label = 15;
                case 15:
                  if (
                    ((Nt = t.getGroupList(ht)),
                    (vt = !1),
                    void 0 !== Nt &&
                      (Nt["Bank Accounts".toLowerCase()] ||
                        Nt["Cash-in-hand".toLowerCase()] ||
                        Nt["Bank OD A/c".toLowerCase()]) &&
                      (void 0 === (Tt = nt[jt]) && (Tt = new S.default()),
                      (Tt.partyId = jt),
                      (Tt.partyMasterId = t.getLedgerMasterId(jt)),
                      (Tt.amount += ct * ot),
                      (nt[jt] = Tt),
                      (vt = !0)),
                    !1 === vt)
                  ) {
                    for (
                      zt = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(pt, "billallocations.list")
                      ),
                        It = [],
                        qt = 0,
                        kt = zt;
                      qt < kt.length;
                      qt++
                    )
                      null != (Ht = kt[qt]) &&
                        ((Rt = u.default.convertVoucherBill(Ht, a.date, it, r, jt)), It.push(Rt));
                    at.push({
                      partyId: jt,
                      partyMasterId: t.getLedgerMasterId(jt),
                      amount: ct * it,
                      bills: It,
                    });
                  }
                  o.label = 16;
                case 16:
                  return st++, [3, 8];
                case 17:
                  for (Ft in ((Ct = []), nt)) null != Ft && Ct.push(nt[Ft]);
                  if (0 === (Et = Ct.length))
                    return (
                      q.Log.warn(
                        "[WARNING]: No account present in transaction: " + JSON.stringify(a)
                      ),
                      [2, n]
                    );
                  if (0 === at.length)
                    for (_t = 0; _t < Ct.length; ++_t)
                      null !== Ct[_t] &&
                        void 0 !== Ct[_t] &&
                        (((Wt = t.toObject(a))._id = a._id + ":" + _t),
                        (Wt.parentId = a._id),
                        (Wt.partyId = Ct[_t].partyId),
                        (Wt.partyMasterId = t.getLedgerMasterId(Wt.partyId)),
                        (Wt.accountId = Ct[_t].partyId),
                        (Wt.accountMasterId = t.getLedgerMasterId(Wt.accountId)),
                        (Wt.total = Ct[_t].amount),
                        n.push(Wt));
                  else if (1 === at.length && 1 === Et)
                    (a.accountId = Ct[0].partyId),
                      (a.accountMasterId = t.getLedgerMasterId(a.accountId)),
                      (a.partyId = at[0].partyId),
                      (a.partyMasterId = t.getLedgerMasterId(a.partyId)),
                      (a.total = at[0].amount),
                      (a.bills = at[0].bills),
                      n.push(a);
                  else if (1 === Et && at.length > 1)
                    for (_t = 0; _t < at.length; ++_t)
                      null !== at[_t] &&
                        void 0 !== at[_t] &&
                        (((Wt = t.toObject(a))._id = a._id + ":" + _t),
                        (Wt.parentId = a._id),
                        (Wt.accountId = Ct[0].partyId),
                        (Wt.accountMasterId = t.getLedgerMasterId(Wt.accountId)),
                        (Wt.partyId = at[_t].partyId),
                        (Wt.partyMasterId = t.getLedgerMasterId(Wt.partyId)),
                        (Wt.total = at[_t].amount),
                        (Wt.bills = at[_t].bills),
                        n.push(Wt));
                  else if (Et > 1 && 1 === at.length)
                    for (_t = 0; _t < Ct.length; ++_t)
                      null !== Ct[_t] &&
                        void 0 !== Ct[_t] &&
                        (((Wt = t.toObject(a))._id = a._id + ":" + _t),
                        (Wt.parentId = a._id),
                        (Wt.accountId = Ct[_t].partyId),
                        (Wt.accountMasterId = t.getLedgerMasterId(Wt.accountId)),
                        (Wt.partyId = at[0].partyId),
                        (Wt.partyMasterId = t.getLedgerMasterId(Wt.partyId)),
                        (Wt.total = Ct[_t].amount),
                        0 === _t && (Wt.bills = at[0].bills),
                        n.push(Wt));
                  else if (Et > 1 && at.length > 1) {
                    for (Ut = 0, Dt = 0, Lt = at; Dt < Lt.length; Dt++)
                      (xt = Lt[Dt]),
                        ((Wt = t.toObject(a))._id = a._id + ":" + Ut++),
                        (Wt.parentId = a._id),
                        (Wt.partyId = xt.partyId),
                        (Wt.partyMasterId = t.getLedgerMasterId(Wt.partyId)),
                        (Wt.accountId = void 0),
                        (Wt.total = xt.amount),
                        (Wt.bills = xt.bills),
                        n.push(Wt);
                    for (wt = 0, Pt = Ct; wt < Pt.length; wt++)
                      (Ft = Pt[wt]),
                        ((Wt = t.toObject(a))._id = a._id + ":" + Ut++),
                        (Wt.parentId = a._id),
                        (Wt.accountId = Ft.partyId),
                        (Wt.accountMasterId = t.getLedgerMasterId(Wt.accountId)),
                        (Wt.partyId = void 0),
                        (Wt.total = Ft.amount),
                        n.push(Wt);
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
                        Ut = 0;
                      Ut < E.length;
                      ++Ut
                    )
                      if (null !== E[Ut] && void 0 !== E[Ut]) {
                        if (
                          (((Ft = new S.default()).partyId = q.TallyUtil.getStringValue(
                            E[Ut],
                            "ledgername"
                          )),
                          (Ft.partyMasterId = t.getLedgerMasterId(Ft.partyId)),
                          (Ft.amount =
                            -1 *
                            q.TallyUtil.parseAmount(q.TallyUtil.getJsonValue(E[Ut], "amount"))),
                          (Gt = q.TallyUtil.parseArray(
                            q.TallyUtil.getJsonValue(E[Ut], "billallocations.list")
                          )).length > 0)
                        ) {
                          for (
                            jt = q.TallyUtil.getStringValue(E[Ut], "ledgername"), Vt = [], Yt = 0;
                            Yt < Gt.length;
                            ++Yt
                          )
                            null !== Gt[Yt] &&
                              void 0 !== Gt[Yt] &&
                              (void 0,
                              "Yes" === q.TallyUtil.getStringValue(E[Ut], "isdeemedpositive") &&
                                "debit",
                              (Ht = u.default.convertVoucherBill(Gt[Yt], a.date, -1, r, jt)),
                              Vt.push(Ht));
                          Ft.bills = Vt;
                        }
                        if (
                          ((Kt = []),
                          (x = q.TallyUtil.parseArray(
                            q.TallyUtil.getJsonValue(E[Ut], "inventoryallocations.list")
                          )),
                          q.Util.isNotNull(x) && x.length > 0)
                        ) {
                          for (Xt = 0, Jt = x; Xt < Jt.length; Xt++)
                            (ar = Jt[Xt]),
                              q.Util.isNotNull(ar) && Kt.push(h.default.convert(ar, 1, Bt, r));
                          Ft.items = Kt;
                        }
                        a.parties.push(Ft);
                      }
                    n.push(a);
                  } else {
                    if (a.type !== t.TYPE_JOB_WORK_IN_ORDER && a.type !== t.TYPE_JOB_WORK_OUT_ORDER)
                      return (
                        q.Log.warn(
                          "[WARNING]: Ignoring voucher with unknown voucher type: " +
                            JSON.stringify(a)
                        ),
                        [2, n]
                      );
                    for (
                      a.category = t.CATEGORY_JOB_WORK,
                        a.shipping = T.default.convert(e, r),
                        a.terms = I.default.convert(e, r),
                        Qt = 1,
                        $t = 1,
                        a.type === t.TYPE_JOB_WORK_IN_ORDER
                          ? ($t = -1)
                          : a.type === t.TYPE_JOB_WORK_OUT_ORDER && (Qt = -1),
                        a.charges = [],
                        Zt = 0,
                        er = E;
                      Zt < er.length;
                      Zt++
                    )
                      if (((tr = er[Zt]), q.Util.isNotNull(tr)))
                        if (!0 === q.TallyUtil.getBoolean(e, "ispartyledger"))
                          a.total =
                            q.TallyUtil.parseAmount(q.TallyUtil.getJsonValue(tr, "amount")) * $t;
                        else if (
                          ((x = q.TallyUtil.parseArray(
                            q.TallyUtil.getJsonValue(tr, "inventoryallocations.list")
                          )),
                          q.Util.isNotNull(x) && x.length > 0)
                        )
                          for (
                            (void 0 !== a.items && null !== a.items) || (a.items = []),
                              rr = 0,
                              nr = x;
                            rr < nr.length;
                            rr++
                          )
                            null != (ar = nr[rr]) && a.items.push(h.default.convert(ar, Qt, 1, r));
                        else ((ir = p.default.convert(tr, r)).amount *= Qt), a.charges.push(ir);
                    (q.Util.isNull(a.items) || 0 === a.items.length) &&
                      ((a.items = []),
                      (x = q.TallyUtil.parseArray(
                        q.TallyUtil.getJsonValue(e, "allinventoryentries.list")
                      )),
                      (a.items = t.getInventories(x, Qt, r))),
                      (q.Util.isNull(a.items) || 0 === a.items.length) &&
                        ((a.items = []),
                        (x = q.TallyUtil.parseArray(
                          q.TallyUtil.getJsonValue(e, "inventoryentries.list")
                        )),
                        (a.items = t.getInventories(x, Qt, r))),
                      (a.lrRrNo = q.TallyUtil.getStringValue(e, "billofladingno")),
                      (or = q.TallyUtil.parseDate(
                        q.TallyUtil.getStringValue(e, "billofladingdate"),
                        q.DateUtil.FORMAT_YYYYMMDD,
                        r.company.timezone
                      )),
                      isNaN(a.lrRrDate)
                        ? q.Log.info(
                            "lrrrdate is NaN. Returned data from tally is" +
                              q.TallyUtil.getStringValue(e, "billofladingdate")
                          )
                        : (a.lrRrDate = or),
                      (a.motorVehicleNumber = q.TallyUtil.getStringValue(e, "basicshipvesselno")),
                      (a.placeOfSupply = q.TallyUtil.getStringValue(e, "placeofsupply")),
                      n.push(a);
                  }
                  o.label = 19;
                case 19:
                  for (ur = 0, pr = n; ur < pr.length; ur++)
                    0 === (sr = pr[ur]).total &&
                      t.TYPE_DELIVERY_NOTE !== sr.type &&
                      t.TYPE_RECEIPT_NOTE !== sr.type &&
                      t.TYPE_SALES_ORDER !== sr.type &&
                      t.TYPE_PURCHASE_ORDER !== sr.type &&
                      q.Log.warn("[WARNING] Total is 0 for voucher: " + JSON.stringify(sr));
                  return [2, n];
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
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY52, -4719, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY51, -4629, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY50, -4539, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY49, -4449, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY48, -4359, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY47, -4269, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY46, -4179, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY45, -4089, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY44, -3999, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY43, -3909, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY42, -3819, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY41, -3729, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY40, -3639, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY39, -3549, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY38, -3459, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY37, -3369, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY36, -3279, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY35, -3189, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY34, -3099, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY33, -3009, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY32, -2919, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY31, -2829, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY30, -2739, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY29, -2649, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY28, -2559, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY27, -2469, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY26, -2379, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY25, -2289, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY24, -2199, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY23, -2109, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY22, -2019, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY21, -1929, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY20, -1839, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY19, -1749, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY18, -1659, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY17, -1569, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY16, -1479, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY15, -1389, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY14, -1299, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY13, -1209, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY12, -1119, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY11, -1029, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY10, -939, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY9, -849, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY8, -759, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY7, -669, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY6, -579, 90, 220752e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY5, -489, 90, 2592e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY4, -399, 90, 2592e6, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY3, -309, 90, 864e5, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY2, -219, 90, 864e5, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY1, -129, 90, 864e5, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.QUARTERLY, -39, 90, 36e5, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.MONTHLY, -9, 30, 6e5, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.WEEKLY, -2, 7, 6e5, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.DAILY, 1, 3, 6e4, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.FUTURE, 31, 30, 36e5, 0),
          new k.VoucherSyncConfig(k.VoucherSyncConfig.FUTUREYEAR, 366, 365, 864e5, 0),
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
          (t.voucherTypesByName = {}), t.voucherTypeMasterIdByName.clear();
          for (var r = 0, n = e; r < n.length; r++) {
            var a = n[r];
            if (
              ((t.voucherTypesByName[q.TallyUtil.removeNoiseChars(a.name)] = a),
              t.voucherTypeMasterIdByName.set(a.name, a.masterId),
              q.Util.isNotNull(a.aliases))
            )
              for (var i = 0, o = a.aliases; i < o.length; i++) {
                var s = o[i];
                q.Util.isNotNull(s.val) &&
                  ((t.voucherTypesByName[q.TallyUtil.removeNoiseChars(s.val)] = a),
                  t.voucherTypeMasterIdByName.set(s.val, a.masterId));
              }
          }
        }),
        (t.setGroups = function (e) {
          (t.groupsByName = {}), t.groupMasterIdByName.clear();
          for (var r = 0, n = e; r < n.length; r++) {
            var a = n[r];
            if (
              ((t.groupsByName[a.name] = a),
              t.groupMasterIdByName.set(a.name, a.masterId),
              q.Util.isNotNull(a.aliases))
            )
              for (var i = 0, o = a.aliases; i < o.length; i++) {
                var s = o[i];
                q.Util.isNotNull(s.val) &&
                  ((t.groupsByName[s.val] = a), t.groupMasterIdByName.set(s.val, a.masterId));
              }
          }
        }),
        (t.setLedgers = function (e) {
          t.ledgerGroupByName.clear(), t.ledgerMasterIdByName.clear();
          for (var r = 0, n = e; r < n.length; r++) {
            var a = n[r];
            if (
              (t.ledgerGroupByName.set(a.name, a.parentGroup),
              t.ledgerMasterIdByName.set(a.name, a.masterId),
              q.Util.isNotNull(a.aliases))
            )
              for (var i = 0, o = a.aliases; i < o.length; i++) {
                var s = o[i];
                q.Util.isNotNull(s.val) &&
                  (t.ledgerGroupByName.set(s.val, a.parentGroup),
                  t.ledgerMasterIdByName.set(s.val, a.masterId));
              }
          }
        }),
        (t.setStockItems = function (e) {
          t.stockItemMasterIdByName.clear(),
            t.stockItemUnitByName.clear(),
            t.stockItemAlternateUnitByName.clear();
          for (var r = 0, n = e; r < n.length; r++) {
            var a = n[r];
            if (
              (t.stockItemMasterIdByName.set(a.name, a.masterId),
              t.stockItemUnitByName.set(a.name, a.unit),
              t.stockItemAlternateUnitByName.set(a.name, a.alternateUnit),
              q.Util.isNotNull(a.aliases))
            )
              for (var i = 0, o = a.aliases; i < o.length; i++) {
                var s = o[i];
                q.Util.isNotNull(s.val) &&
                  (t.stockItemMasterIdByName.set(s.val, a.masterId),
                  t.stockItemUnitByName.set(s.val, a.unit),
                  t.stockItemAlternateUnitByName.set(s.val, a.alternateUnit));
              }
          }
        }),
        (t.setUnits = function (e) {
          t.unitByName.clear();
          for (var r = 0, n = e; r < n.length; r++) {
            var a = n[r];
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
          for (var n = [], a = 0, i = e; a < i.length; a++) {
            var o = i[a];
            null != o && n.push(h.default.convert(o, t, 1, r));
          }
          return n;
        }),
        (t.getOrderList = function (e) {
          for (var t = [], r = 0, n = e; r < n.length; r++) {
            var a = n[r];
            if (null != a)
              for (
                var i = 0,
                  o = q.TallyUtil.parseArray(q.TallyUtil.getJsonValue(a, "batchallocations.list"));
                i < o.length;
                i++
              ) {
                var s = o[i];
                if (null != s) {
                  var u = q.TallyUtil.getStringValue(s, "orderno");
                  null != u &&
                    "" !== u.trim() &&
                    "not applicable" !== u.trim().toLowerCase() &&
                    t.push(new C.StringItem(u));
                }
              }
          }
          return t;
        }),
        (t.getInvoiceOrderList = function (e, t) {
          for (
            var r = [], n = 0, a = q.TallyUtil.parseArray(q.TallyUtil.getJsonValue(e, t));
            n < a.length;
            n++
          ) {
            var i = a[n];
            if (null != i) {
              var o = q.TallyUtil.getStringValue(i, "basicpurchaseorderno");
              null != o &&
                "" !== o.trim() &&
                "not applicable" !== o.trim().toLowerCase() &&
                r.push(new C.StringItem(o));
            }
          }
          return r;
        }),
        (t.getRootVoucherType = function (e) {
          var r = t.voucherTypesByName[q.TallyUtil.removeNoiseChars(e)];
          void 0 !== r &&
            void 0 !== r.parent &&
            (r = t.voucherTypesByName[q.TallyUtil.removeNoiseChars(r.parent)]);
          var n = "";
          return (
            void 0 !== r &&
              (n =
                void 0 !== r.reservedName && null !== r.reservedName && "" !== r.reservedName
                  ? r.reservedName
                  : r.name),
            n
          );
        }),
        (t.getGroupList = function (e) {
          var r = {};
          if (e) {
            for (
              var n = 0, a = t.groupsByName[e], i = void 0;
              q.Util.isNotNull(a) && a.name !== i && n < 500;

            )
              n++,
                q.Util.isNotEmpty(a.reservedName)
                  ? (r[a.reservedName.toLowerCase()] = a.name)
                  : (r[a.name.toLowerCase()] = a.name),
                (i = a.name),
                (a = t.groupsByName[a.parentGroup]);
            500 === n &&
              q.Log.warn(
                '[WARNING] Infinite loop detected in finding parent groups for group: "' + e + '"'
              );
          }
          return r;
        }),
        t
      );
    })(R.Master);
  t.default = E;
};
