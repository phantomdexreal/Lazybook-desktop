// webpack module #945 (from electron_main_process, BA Mobile Connector 8.4.41)
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
    p = r(10),
    c = r(2),
    m = r(18),
    l = r(34),
    d = (function (e) {
      function t(t, r) {
        return e.call(this, t, r) || this;
      }
      return (
        a(t, e),
        (t.prototype.getModelName = function () {
          return "vouchers";
        }),
        (t.prototype.getAttributes = function (e) {
          return {
            partyDetail: { type: u.ABSTRACT, required: !0 },
            consigneeDetail: { type: u.ABSTRACT, required: !0 },
            deliveryNoteDetails: { type: u.ABSTRACT, required: !0 },
            tags: { type: u.ABSTRACT, required: !0 },
            items: { type: u.ABSTRACT, required: !0 },
            itemsIn: { type: u.ABSTRACT, required: !0 },
            itemsOut: { type: u.ABSTRACT, required: !0 },
            charges: { type: u.ABSTRACT, required: !0 },
            shipping: { type: u.ABSTRACT, required: !0 },
            terms: { type: u.ABSTRACT, required: !0 },
            bills: { type: u.ABSTRACT, required: !0 },
            orderList: { type: u.ABSTRACT, required: !0 },
            orderListNew: { type: u.ABSTRACT, required: !0 },
            paymentDetails: { type: u.ABSTRACT, required: !0 },
            parties: { type: u.ABSTRACT, required: !0 },
            accounts: { type: u.ABSTRACT, required: !0 },
            payList: { type: u.ABSTRACT, required: !0 },
            customId: { type: u.STRING, required: !0 },
            type: { type: u.STRING, required: !1 },
            customType: { type: u.STRING, required: !1 },
            category: { type: u.STRING, required: !1 },
            date: { type: u.INTEGER, required: !1 },
            desc: { type: u.STRING, required: !1 },
            partyId: { type: u.STRING, required: !1 },
            partyName: { type: u.STRING, required: !1 },
            partyMasterId: { type: u.INTEGER, required: !1 },
            enteredBy: { type: u.STRING, required: !1 },
            tallyReference: { type: u.STRING, required: !1 },
            total: { type: u.TEXT, required: !1 },
            accountId: { type: u.STRING, required: !1 },
            accountMasterId: { type: u.INTEGER, required: !1 },
            parentId: { type: u.STRING, required: !1 },
            grossProfit: { type: u.TEXT, required: !1 },
            grossRevenue: { type: u.TEXT, required: !1 },
            costCentreName: { type: u.STRING, required: !1 },
            challanType: { type: u.STRING, required: !1 },
            effectiveDate: { type: u.TEXT, required: !1 },
            destinationGodown: { type: u.STRING, required: !1 },
            sourceGodown: { type: u.STRING, required: !1 },
            _id: { type: u.UUID, primaryKey: !0, defaultValue: u.UUIDV4 },
            tallyUpdatedAt: { type: u.INTEGER, required: !0 },
            uptoDate: { type: u.BOOLEAN, required: !0 },
            masterId: { type: u.INTEGER, required: !0 },
            alterId: { type: u.INTEGER, required: !0 },
            partyGstIn: { type: u.STRING, required: !0 },
            consigneeGstIn: { type: u.STRING, required: !0 },
            motorVehicleNumber: { type: u.STRING, required: !0 },
            lrRrNo: { type: u.STRING, required: !0 },
            lrRrDate: { type: u.INTEGER, required: !0 },
            refDate: { type: u.INTEGER, required: !0 },
            isDeleted: { type: u.BOOLEAN, required: !0 },
            isUpdated: { type: u.BOOLEAN, required: !0 },
            placeOfSupply: { type: u.STRING, required: !0 },
            isPosInvoice: { type: u.BOOLEAN, required: !1 },
            posInvoiceDetails: { type: u.ABSTRACT, required: !0 },
            ewayBills: { type: u.ABSTRACT, required: !1 },
            eInvoiceDetail: { type: u.ABSTRACT, required: !1 },
            companyGstIn: { type: u.STRING, required: !1 },
            companyGstRegistration: { type: u.STRING, required: !1 },
            companyGstState: { type: u.STRING, required: !1 },
            gstRegistrationType: { type: u.STRING, required: !1 },
            companyGstRegistrationType: { type: u.STRING, required: !1 },
            isReverseChargeApplicable: { type: u.BOOLEAN, required: !1 },
            partyMailingName: { type: u.STRING, required: !1 },
          };
        }),
        (t.prototype.runMigration = function () {
          var e = this,
            t = c.PathUtil.getDbPath(this.userId, this.company),
            r = new l.SQLConfig();
          n.open(t, "r", function (i, a) {
            if (i && "ENOENT" == i.code);
            else {
              var n = r.connect(t);
              n.serialize(function () {
                return o(this, void 0, void 0, function () {
                  var t, r, i, a, o;
                  return s(this, function (s) {
                    switch (s.label) {
                      case 0:
                        ((t = "vouchers"), (s.label = 1));
                      case 1:
                        return (s.trys.push([1, 8, , 9]), [4, e.checkTableExist(n, t)]);
                      case 2:
                        return (
                          (r = s.sent()),
                          p.isFilledArray(r) ? [4, e.getTableInfo(n, t)] : [3, 7]
                        );
                      case 3:
                        return ((i = s.sent()), [4, y(n, i)]);
                      case 4:
                        return (s.sent(), [4, e.getTableIndexInfo(n, t)]);
                      case 5:
                        return ((a = s.sent()), [4, b(n, a)]);
                      case 6:
                        (s.sent(), (s.label = 7));
                      case 7:
                        return [3, 9];
                      case 8:
                        return ((o = s.sent()), c.Log.error(JSON.stringify(o)), [3, 9]);
                      case 9:
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
    })(m.ModelBase);
  function y(e, t) {
    return o(this, void 0, void 0, function () {
      var r, i, a, o, n, u, p, c, m, l, d, y, b, h, g, S, f, A, N, I, T, M, v;
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
            N = !1,
            I = !1,
            T = 0,
            M = t;
          T < M.length;
          T++
        )
          ("motorVehicleNumber" === (v = M[T]).name && (r = !0),
            "lrRrNo" === v.name && (i = !0),
            "refDate" === v.name && (a = !0),
            "isUpdated" === v.name && (o = !0),
            "placeOfSupply" === v.name && (n = !0),
            "orderListNew" === v.name && (u = !0),
            "consigneeDetail" === v.name && (p = !0),
            "isPosInvoice" === v.name && (c = !0),
            "posInvoiceDetails" == v.name && (m = !0),
            "partyName" == v.name && (l = !0),
            "lrRrDate" == v.name && (d = !0),
            "ewayBills" == v.name && (y = !0),
            "eInvoiceDetail" === v.name && (b = !0),
            "companyGstIn" == v.name && (h = !0),
            "companyGstRegistration" == v.name && (g = !0),
            "companyGstState" === v.name && (S = !0),
            "gstRegistrationType" === v.name && (f = !0),
            "companyGstRegistrationType" === v.name && (A = !0),
            "isReverseChargeApplicable" === v.name && (N = !0),
            "partyMailingName" === v.name && (I = !0));
        return (
          !1 === r && e.run("ALTER TABLE vouchers ADD motorVehicleNumber TEXT"),
          !1 === i && e.run("ALTER TABLE vouchers ADD lrRrNo TEXT"),
          !1 === a && e.run("ALTER TABLE vouchers ADD refDate NUMERIC"),
          !1 === o && e.run("ALTER TABLE vouchers ADD isUpdated INTEGER"),
          !1 === n && e.run("ALTER TABLE vouchers ADD placeOfSupply TEXT"),
          !1 === u && e.run("ALTER TABLE vouchers ADD orderListNew ABSTRACT"),
          !1 === p && e.run("ALTER TABLE vouchers ADD consigneeDetail ABSTRACT"),
          !1 === c && e.run("ALTER TABLE vouchers ADD isPosInvoice BOOLEAN"),
          !1 === m && e.run("ALTER TABLE vouchers ADD posInvoiceDetails ABSTRACT"),
          !1 === l && e.run("ALTER TABLE vouchers ADD partyName TEXT"),
          !1 === d && e.run("ALTER TABLE vouchers ADD lrRrDate NUMERIC"),
          !1 === y && e.run("ALTER TABLE vouchers ADD ewayBills ABSTRACT"),
          !1 === b && e.run("ALTER TABLE vouchers ADD eInvoiceDetail ABSTRACT"),
          !1 === h && e.run("ALTER TABLE vouchers ADD companyGstIn TEXT"),
          !1 === g && e.run("ALTER TABLE vouchers ADD companyGstRegistration TEXT"),
          !1 === S && e.run("ALTER TABLE vouchers ADD companyGstState TEXT"),
          !1 === f && e.run("ALTER TABLE vouchers ADD gstRegistrationType TEXT"),
          !1 === A && e.run("ALTER TABLE vouchers ADD companyGstRegistrationType TEXT"),
          !1 === N && e.run("ALTER TABLE vouchers ADD isReverseChargeApplicable BOOLEAN"),
          !1 === I && e.run("ALTER TABLE vouchers ADD partyMailingName TEXT"),
          [2]
        );
      });
    });
  }
  function b(e, t) {
    return o(this, void 0, void 0, function () {
      var r, i, a, o, n, u;
      return s(this, function (s) {
        if (
          ((r = !1),
          (i = !1),
          (a = !1),
          "idx_date",
          "idx_alter_id",
          "idx_master_id",
          p.isFilledArray(t))
        )
          for (o = 0, n = t; o < n.length; o++)
            ("idx_date" === (u = n[o]).name && (r = !0),
              "idx_alter_id" === u.name && (i = !0),
              "idx_master_id" === u.name && (a = !0));
        return (
          !1 === r && e.run("CREATE INDEX idx_date ON vouchers(date)"),
          !1 === i && e.run("CREATE INDEX idx_alter_id ON vouchers(alterId)"),
          !1 === a && e.run("CREATE INDEX idx_master_id ON vouchers(masterId)"),
          [2]
        );
      });
    });
  }
  t.default = d;
};
