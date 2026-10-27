// webpack module #667 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
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
  var s = r(27),
    u = r(13),
    p = r(11),
    c = r(0),
    l = r(14),
    m = r(32),
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
            r = new m.SQLConfig();
          s.open(t, "r", function (n, a) {
            if (n && "ENOENT" == n.code);
            else {
              var s = r.connect(t);
              s.serialize(function () {
                return i(this, void 0, void 0, function () {
                  var t, r, n, a, i;
                  return o(this, function (o) {
                    switch (o.label) {
                      case 0:
                        (t = "vouchers"), (o.label = 1);
                      case 1:
                        return o.trys.push([1, 8, , 9]), [4, e.checkTableExist(s, t)];
                      case 2:
                        return (
                          (r = o.sent()), p.isFilledArray(r) ? [4, e.getTableInfo(s, t)] : [3, 7]
                        );
                      case 3:
                        return (n = o.sent()), [4, y(s, n)];
                      case 4:
                        return o.sent(), [4, e.getTableIndexInfo(s, t)];
                      case 5:
                        return (a = o.sent()), [4, b(s, a)];
                      case 6:
                        o.sent(), (o.label = 7);
                      case 7:
                        return [3, 9];
                      case 8:
                        return (i = o.sent()), c.Log.error(JSON.stringify(i)), [3, 9];
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
    })(l.ModelBase);
  function y(e, t) {
    return i(this, void 0, void 0, function () {
      var r, n, a, i, s, u, p, c, l, m, d, y, b, h, f, g, M, S, A, O, N, v, T;
      return o(this, function (o) {
        for (
          r = !1,
            n = !1,
            a = !1,
            i = !1,
            s = !1,
            u = !1,
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
            N = 0,
            v = t;
          N < v.length;
          N++
        )
          "motorVehicleNumber" === (T = v[N]).name && (r = !0),
            "lrRrNo" === T.name && (n = !0),
            "refDate" === T.name && (a = !0),
            "isUpdated" === T.name && (i = !0),
            "placeOfSupply" === T.name && (s = !0),
            "orderListNew" === T.name && (u = !0),
            "consigneeDetail" === T.name && (p = !0),
            "isPosInvoice" === T.name && (c = !0),
            "posInvoiceDetails" == T.name && (l = !0),
            "partyName" == T.name && (m = !0),
            "lrRrDate" == T.name && (d = !0),
            "ewayBills" == T.name && (y = !0),
            "eInvoiceDetail" === T.name && (b = !0),
            "companyGstIn" == T.name && (h = !0),
            "companyGstRegistration" == T.name && (f = !0),
            "companyGstState" === T.name && (g = !0),
            "gstRegistrationType" === T.name && (M = !0),
            "companyGstRegistrationType" === T.name && (S = !0),
            "isReverseChargeApplicable" === T.name && (A = !0),
            "partyMailingName" === T.name && (O = !0);
        return (
          !1 === r && e.run("ALTER TABLE vouchers ADD motorVehicleNumber TEXT"),
          !1 === n && e.run("ALTER TABLE vouchers ADD lrRrNo TEXT"),
          !1 === a && e.run("ALTER TABLE vouchers ADD refDate NUMERIC"),
          !1 === i && e.run("ALTER TABLE vouchers ADD isUpdated INTEGER"),
          !1 === s && e.run("ALTER TABLE vouchers ADD placeOfSupply TEXT"),
          !1 === u && e.run("ALTER TABLE vouchers ADD orderListNew ABSTRACT"),
          !1 === p && e.run("ALTER TABLE vouchers ADD consigneeDetail ABSTRACT"),
          !1 === c && e.run("ALTER TABLE vouchers ADD isPosInvoice BOOLEAN"),
          !1 === l && e.run("ALTER TABLE vouchers ADD posInvoiceDetails ABSTRACT"),
          !1 === m && e.run("ALTER TABLE vouchers ADD partyName TEXT"),
          !1 === d && e.run("ALTER TABLE vouchers ADD lrRrDate NUMERIC"),
          !1 === y && e.run("ALTER TABLE vouchers ADD ewayBills ABSTRACT"),
          !1 === b && e.run("ALTER TABLE vouchers ADD eInvoiceDetail ABSTRACT"),
          !1 === h && e.run("ALTER TABLE vouchers ADD companyGstIn TEXT"),
          !1 === f && e.run("ALTER TABLE vouchers ADD companyGstRegistration TEXT"),
          !1 === g && e.run("ALTER TABLE vouchers ADD companyGstState TEXT"),
          !1 === M && e.run("ALTER TABLE vouchers ADD gstRegistrationType TEXT"),
          !1 === S && e.run("ALTER TABLE vouchers ADD companyGstRegistrationType TEXT"),
          !1 === A && e.run("ALTER TABLE vouchers ADD isReverseChargeApplicable BOOLEAN"),
          !1 === O && e.run("ALTER TABLE vouchers ADD partyMailingName TEXT"),
          [2]
        );
      });
    });
  }
  function b(e, t) {
    return i(this, void 0, void 0, function () {
      var r, n, a, i, s, u;
      return o(this, function (o) {
        if (
          ((r = !1),
          (n = !1),
          (a = !1),
          "idx_date",
          "idx_alter_id",
          "idx_master_id",
          p.isFilledArray(t))
        )
          for (i = 0, s = t; i < s.length; i++)
            "idx_date" === (u = s[i]).name && (r = !0),
              "idx_alter_id" === u.name && (n = !0),
              "idx_master_id" === u.name && (a = !0);
        return (
          !1 === r && e.run("CREATE INDEX idx_date ON vouchers(date)"),
          !1 === n && e.run("CREATE INDEX idx_alter_id ON vouchers(alterId)"),
          !1 === a && e.run("CREATE INDEX idx_master_id ON vouchers(masterId)"),
          [2]
        );
      });
    });
  }
  t.default = d;
};
