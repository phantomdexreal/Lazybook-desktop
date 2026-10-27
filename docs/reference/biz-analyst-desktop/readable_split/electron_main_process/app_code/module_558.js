// webpack module #558 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var n = r(49),
    u = r(32),
    p = r(2),
    c = r(240),
    m = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        a(t, e),
        (t.prototype.getName = function () {
          return t.masterName;
        }),
        (t.prototype.getKeys = function () {
          return t.keys;
        }),
        (t.prototype.parse = function (e, r) {
          return o(this, void 0, void 0, function () {
            var i;
            return s(this, function (a) {
              return ((i = []).push(t.convert(e, r)), [2, i]);
            });
          });
        }),
        (t.prototype.getPendingBills = function (e, t) {
          return o(this, void 0, void 0, function () {
            var r, i;
            return s(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (r = n.default.getInstance()),
                    ((i = new c.GetMastersOptions()).userId = e),
                    (i.company = t),
                    (i.dateRange = new c.Range(t.startingFrom, p.DateUtil.addDays(t.syncFrom, -1))),
                    (i.keys = this.getKeys()),
                    [4, r.getPendingBill(this, i)]
                  );
                case 1:
                  return [2, a.sent()];
              }
            });
          });
        }),
        (t.prototype.getAutoReminderPendingBills = function (e, t, r) {
          return o(this, void 0, void 0, function () {
            var i, a;
            return s(this, function (o) {
              switch (o.label) {
                case 0:
                  return (
                    (i = n.default.getInstance()),
                    ((a = new c.GetMastersOptions()).userId = e),
                    (a.company = t),
                    (a.dateRange = new c.Range(r.startDate, r.endDate)),
                    (a.keys = this.getKeys()),
                    [4, i.getPendingBill(this, a)]
                  );
                case 1:
                  return [2, o.sent()];
              }
            });
          });
        }),
        (t.prototype.getSyncConfig = function () {
          throw new Error("Method not implemented.");
        }),
        (t.prototype.equals = function (e) {
          throw new Error("Method not implemented.");
        }),
        (t.prototype.updateFromTally = function (e) {
          throw new Error("Method not implemented.");
        }),
        (t.masterName = "bill"),
        (t.keys = [
          "LEDGERNAME",
          "NAME",
          "BILLDATE",
          "BILLCREDITPERIOD",
          "CLOSINGBALANCE",
          "BILLTYPE",
        ]),
        (t.convert = function (e, r) {
          var i = new t();
          ((i.customId = p.TallyUtil.getStringValue(e, "name")),
            p.Util.isNotNull(r) &&
            p.Util.isNotNull(r.company) &&
            p.Util.isNotNull(r.company.timezone)
              ? (i.date = p.TallyUtil.parseDate(
                  p.TallyUtil.getJsonValue(e, "billdate"),
                  p.DateUtil.FORMAT_YYYYMMDD,
                  r.company.timezone,
                ))
              : (i.date = p.TallyUtil.parseDate(
                  p.TallyUtil.getJsonValue(e, "billdate"),
                  p.DateUtil.FORMAT_YYYYMMDD,
                )));
          var a = p.TallyUtil.getJsonValue(e, "billcreditperiod");
          ((i.dueDate = u.Bill.parseBillCreditPeriod(a, i.date, r)),
            (i.amount =
              -1 * p.TallyUtil.parseAmount(p.TallyUtil.getJsonValue(e, "closingbalance"))),
            (i.ledgerName = p.TallyUtil.getStringValue(e, "ledgername")));
          var o = p.TallyUtil.getStringValue(e, "billtype");
          return (o && (i.desc = o), i);
        }),
        t
      );
    })(r(5).Master);
  t.default = m;
};
