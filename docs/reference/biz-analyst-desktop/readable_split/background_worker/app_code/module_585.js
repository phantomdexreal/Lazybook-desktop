// webpack module #585 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var n =
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
    a =
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
  var i = r(151),
    o = r(8),
    s = r(0),
    u = r(23),
    p = s.Util.getServerCredentials().API_BASE_URL + "/reminder/auto",
    c = p + "/scheduled-ledgers",
    l = p + "/ledger-names",
    m = p + "/send",
    d = p + "/error-status",
    y = p + "/rejected-ledgers";
  ((t.getAutoReminderLedgerList = function (e, t, r) {
    return n(this, void 0, void 0, function () {
      var n, i, o, p;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            if (s.Util.isNull(e)) throw new Error("User is not defined");
            ((n = c),
              (i = { companyId: t, userId: e.id, reminderVersion: 1, desktopReminderTime: r }),
              (o = u.getRequestOptions(n, i, null, e)),
              (a.label = 1));
          case 1:
            return (a.trys.push([1, 3, , 4]), [4, u.getRequest(o)]);
          case 2:
            return [2, a.sent()];
          case 3:
            throw (
              (p = a.sent()),
              s.Log.info("Get AutoReminder Ledger List API Call Error : " + p),
              p
            );
          case 4:
            return [2];
        }
      });
    });
  }),
    (t.sendLedgerOutstandingBills = function (e) {
      return n(this, void 0, void 0, function () {
        var t, r, n, p, c, l, d, y, b, h;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              ((r = new i.S3Service()), (n = e.outstandingData), (a.label = 1));
            case 1:
              return (a.trys.push([1, 3, , 4]), [4, r.zip(JSON.stringify(n))]);
            case 2:
              return (
                (p = a.sent()),
                (t = r.encrypt(p)).byteLength > 5e6 ? [2, o.default.MAX_DATA_LENGTH_AT_API] : [3, 4]
              );
            case 3:
              throw (
                (c = a.sent()),
                s.Log.info("Crypto Error in sendLedgerOutstandingBills  function "),
                c
              );
            case 4:
              ((l = m),
                (d = { userId: e.user.id, companyId: e.company.companyId, reminderVersion: 1 }),
                (y = {
                  data: t.toString("base64"),
                  digest: r.createMd5Digest(t),
                  jobId: e.jobId,
                  endOfData: e.endOfData,
                }),
                (b = u.getRequestOptions(l, d, y, e.user)),
                (a.label = 5));
            case 5:
              return (a.trys.push([5, 7, , 8]), [4, u.postRequest(b)]);
            case 6:
              return [2, a.sent()];
            case 7:
              throw (
                (h = a.sent()),
                s.Log.info("Send Auto Reminder API Call Error : " + JSON.stringify(h)),
                h
              );
            case 8:
              return [2];
          }
        });
      });
    }),
    (t.updateMasterName = function (e, t, r) {
      return n(this, void 0, void 0, function () {
        var n, i, o;
        return a(this, function (a) {
          if (s.Util.isNull(e)) throw new Error("User is not defined");
          ((n = l),
            (i = { companyId: t }),
            (o = u.getRequestOptions(n, i, { ledgerNameChanges: r }, e)));
          try {
            return [2, u.putRequest(o)];
          } catch (e) {
            throw (s.Log.info("update Master Name API Call Error : " + e), e);
          }
          return [2];
        });
      });
    }),
    (t.saveAdditionalSettingRejectedLedgers = function (e, t, r, i, o) {
      return n(this, void 0, void 0, function () {
        var n;
        return a(this, function (a) {
          n = u.getRequestOptions(
            y,
            { companyId: t, jobId: r },
            { lastPaymentSettingLedgers: i, baseAmountSettingLedgers: o },
            e,
          );
          try {
            return [2, u.postRequest(n)];
          } catch (e) {
            throw (
              s.Log.info(
                "send ledger list which is not send due to additional settings API Call Error : " +
                  s.Util.getErrorMessage(e),
              ),
              e
            );
          }
          return [2];
        });
      });
    }),
    (t.sendNoOutstandingsForToday = function (e, t, r) {
      return n(this, void 0, void 0, function () {
        var n, i, o, p, c;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              ((n = m),
                (i = { userId: e.id, companyId: t, reminderVersion: 1, noBillsFound: "true" }),
                (o = { jobId: r }),
                (p = u.getRequestOptions(n, i, o, e)),
                (a.label = 1));
            case 1:
              return (a.trys.push([1, 3, , 4]), [4, u.postRequest(p)]);
            case 2:
              return [2, a.sent()];
            case 3:
              throw (
                (c = a.sent()),
                s.Log.info(
                  "Send Auto Reminder API for noBills found Call Error : " + JSON.stringify(c),
                ),
                c
              );
            case 4:
              return [2];
          }
        });
      });
    }),
    (t.reportAutoReminderIssue = function (e, t, r) {
      return n(this, void 0, void 0, function () {
        var n, i, o, s;
        return a(this, function (a) {
          return (
            (n = { companyId: t, userId: e.id }),
            (i = d),
            (o = { statusCode: r }),
            (s = u.getRequestOptions(i, n, o)),
            [2, u.putRequest(s)]
          );
        });
      });
    }));
};
