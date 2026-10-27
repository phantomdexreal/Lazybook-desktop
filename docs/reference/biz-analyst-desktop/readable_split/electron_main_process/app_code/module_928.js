// webpack module #928 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var n = r(22),
    u = r(17),
    p = r(2),
    c = r(18),
    m = r(34),
    l = (function (e) {
      function t(t, r) {
        return e.call(this, t, r) || this;
      }
      return (
        a(t, e),
        (t.prototype.getModelName = function () {
          return "invoice_entries";
        }),
        (t.prototype.getAttributes = function () {
          return {
            _id: { type: u.STRING, required: !0, primaryKey: !0 },
            date: { type: u.INTEGER, required: !1 },
            partyId: { type: u.STRING, required: !1 },
            total: { type: u.INTEGER, required: !1 },
            type: { type: u.STRING, required: !1 },
            items: { type: u.ABSTRACT, required: !1 },
            isOptional: { type: u.BOOLEAN, required: !1 },
            partyMasterId: { type: u.STRING, required: !1 },
            partyAddress: { type: u.STRING, required: !1 },
            partyGstNo: { type: u.STRING, required: !1 },
            customId: { type: u.STRING, required: !1 },
            customType: { type: u.STRING, required: !1 },
            isMailSent: { type: u.BOOLEAN, required: !1 },
            charges: { type: u.ABSTRACT, required: !1 },
            entryLocation: { type: u.ABSTRACT, required: !1 },
            narration: { type: u.STRING, required: !1 },
            accountLedgerName: { type: u.STRING, required: !1 },
            userId: { type: u.STRING, required: !1 },
            userName: { type: u.STRING, required: !1 },
            userEmail: { type: u.STRING, required: !1 },
            companyId: { type: u.STRING, required: !1 },
            isDeleted: { type: u.BOOLEAN, required: !1 },
            createdAt: { type: u.INTEGER, required: !1 },
            updatedAt: { type: u.INTEGER, required: !1 },
            serverUpdatedAt: { type: u.INTEGER, required: !1 },
            tallyUpdatedAt: { type: u.INTEGER, required: !1 },
            tallyErrorMessage: { type: u.STRING, required: !1 },
            tallyMasterId: { type: u.STRING, required: !1 },
            status: { type: u.STRING, required: !1 },
            orderDetail: { type: u.ABSTRACT, required: !1 },
            dispatchDetail: { type: u.ABSTRACT, required: !1 },
            consigneeDetail: { type: u.ABSTRACT, required: !1 },
            buyerDetail: { type: u.ABSTRACT, required: !1 },
            ewayBillDetail: { type: u.ABSTRACT, required: !1 },
            eInvoiceDetail: { type: u.ABSTRACT, required: !1 },
            costCenterName: { type: u.STRING, required: !1 },
            referenceNumber: { type: u.STRING, required: !1 },
            originalVoucherNumber: { type: u.STRING, required: !1 },
            originalVoucherDate: { type: u.INTEGER, required: !1 },
            priceLevel: { type: u.STRING, required: !1 },
            posDetails: { type: u.ABSTRACT, required: !1 },
            billEntries: { type: u.ABSTRACT, required: !1 },
            voucherClassName: { type: u.STRING, required: !1 },
            partyStateName: { type: u.STRING, required: !1 },
            placeOfSupply: { type: u.STRING, required: !1 },
            companyGstIn: { type: u.STRING, required: !1 },
            companyGstState: { type: u.STRING, required: !1 },
          };
        }),
        (t.prototype.runMigration = function () {
          var e = this,
            t = p.PathUtil.getDbPath(this.userId, this.company),
            r = new m.SQLConfig();
          n.open(t, "r", function (i, a) {
            if (i && "ENOENT" == i.code) p.Log.error(i);
            else {
              var n = r.connect(t);
              n.serialize(function () {
                return o(this, void 0, void 0, function () {
                  var t, r, i, a;
                  return s(this, function (o) {
                    switch (o.label) {
                      case 0:
                        ((t = e.getModelName()), (o.label = 1));
                      case 1:
                        return (o.trys.push([1, 6, , 7]), [4, e.checkTableExist(n, t)]);
                      case 2:
                        return (
                          (r = o.sent()),
                          p.Util.isFilledArray(r) ? [4, e.getTableInfo(n, t)] : [3, 5]
                        );
                      case 3:
                        return ((i = o.sent()), [4, d(n, i)]);
                      case 4:
                        (o.sent(), (o.label = 5));
                      case 5:
                        return [3, 7];
                      case 6:
                        return ((a = o.sent()), p.Log.error(JSON.stringify(a)), [3, 7]);
                      case 7:
                        return [2];
                    }
                  });
                });
              });
            }
          });
        }),
        t
      );
    })(c.ModelBase);
  function d(e, t) {
    return o(this, void 0, void 0, function () {
      var r, i, a, o, n, u, p, c, m, l, d, y, b, h, g, S, f, A, N, I, T;
      return s(this, function (s) {
        for (
          r = !1,
            i = !1,
            a = !1,
            o = !1,
            n = !1,
            u = !1,
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
            N = 0,
            I = t;
          N < I.length;
          N++
        )
          "orderDetail" === (T = I[N]).name
            ? (r = !0)
            : "dispatchDetail" === T.name
              ? (i = !0)
              : "consigneeDetail" === T.name
                ? (a = !0)
                : "buyerDetail" === T.name
                  ? (o = !0)
                  : "ewayBillDetail" === T.name
                    ? (n = !0)
                    : "eInvoiceDetail" === T.name
                      ? (u = !0)
                      : "costCenterName" === T.name
                        ? (p = !0)
                        : "referenceNumber" === T.name
                          ? (c = !0)
                          : "originalVoucherNumber" === T.name
                            ? (m = !0)
                            : "originalVoucherDate" === T.name
                              ? (l = !0)
                              : "priceLevel" === T.name
                                ? (d = !0)
                                : "posDetails" === T.name
                                  ? (y = !0)
                                  : "billEntries" === T.name
                                    ? (b = !0)
                                    : "voucherClassName" === T.name
                                      ? (h = !0)
                                      : "partyStateName" === T.name
                                        ? (g = !0)
                                        : "placeOfSupply" === T.name
                                          ? (S = !0)
                                          : "companyGstIn" === T.name
                                            ? (f = !0)
                                            : "companyGstState" === T.name && (A = !0);
        return (
          !1 === r && e.run("ALTER TABLE invoice_entries ADD orderDetail ABSTRACT"),
          !1 === i && e.run("ALTER TABLE invoice_entries ADD dispatchDetail ABSTRACT"),
          !1 === a && e.run("ALTER TABLE invoice_entries ADD consigneeDetail ABSTRACT"),
          !1 === o && e.run("ALTER TABLE invoice_entries ADD buyerDetail ABSTRACT"),
          !1 === n && e.run("ALTER TABLE invoice_entries ADD ewayBillDetail ABSTRACT"),
          !1 === u && e.run("ALTER TABLE invoice_entries ADD eInvoiceDetail ABSTRACT"),
          !1 === p && e.run("ALTER TABLE invoice_entries ADD costCenterName TEXT"),
          !1 === c && e.run("ALTER TABLE invoice_entries ADD referenceNumber TEXT"),
          !1 === m && e.run("ALTER TABLE invoice_entries ADD originalVoucherNumber TEXT"),
          !1 === l && e.run("ALTER TABLE invoice_entries ADD originalVoucherDate INTEGER"),
          !1 === d && e.run("ALTER TABLE invoice_entries ADD priceLevel TEXT"),
          !1 === y && e.run("ALTER TABLE invoice_entries ADD posDetails ABSTRACT"),
          !1 === b && e.run("ALTER TABLE invoice_entries ADD billEntries ABSTRACT"),
          !1 === h && e.run("ALTER TABLE invoice_entries ADD voucherClassName TEXT"),
          !1 === g && e.run("ALTER TABLE invoice_entries ADD partyStateName TEXT"),
          !1 === S && e.run("ALTER TABLE invoice_entries ADD placeOfSupply TEXT"),
          !1 === f && e.run("ALTER TABLE invoice_entries ADD companyGstIn TEXT"),
          !1 === A && e.run("ALTER TABLE invoice_entries ADD companyGstState TEXT"),
          [2]
        );
      });
    });
  }
  t.default = l;
};
