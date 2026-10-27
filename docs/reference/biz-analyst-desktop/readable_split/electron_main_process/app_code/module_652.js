// webpack module #652 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var i =
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
    a =
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
  var o = r(161),
    s = r(11),
    n = r(2),
    u = r(29),
    p = n.Util.getServerCredentials().API_BASE_URL + "/reminder/auto",
    c = p + "/scheduled-ledgers",
    m = p + "/ledger-names",
    l = p + "/send",
    d = p + "/error-status",
    y = p + "/rejected-ledgers";
  ((t.getAutoReminderLedgerList = function (e, t, r) {
    return i(this, void 0, void 0, function () {
      var i, o, s, p;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            if (n.Util.isNull(e)) throw new Error("User is not defined");
            ((i = c),
              (o = { companyId: t, userId: e.id, reminderVersion: 1, desktopReminderTime: r }),
              (s = u.getRequestOptions(i, o, null, e)),
              (a.label = 1));
          case 1:
            return (a.trys.push([1, 3, , 4]), [4, u.getRequest(s)]);
          case 2:
            return [2, a.sent()];
          case 3:
            throw (
              (p = a.sent()),
              n.Log.info("Get AutoReminder Ledger List API Call Error : " + p),
              p
            );
          case 4:
            return [2];
        }
      });
    });
  }),
    (t.sendLedgerOutstandingBills = function (e) {
      return i(this, void 0, void 0, function () {
        var t, r, i, p, c, m, d, y, b, h;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              ((r = new o.S3Service()), (i = e.outstandingData), (a.label = 1));
            case 1:
              return (a.trys.push([1, 3, , 4]), [4, r.zip(JSON.stringify(i))]);
            case 2:
              return (
                (p = a.sent()),
                (t = r.encrypt(p)).byteLength > 5e6 ? [2, s.default.MAX_DATA_LENGTH_AT_API] : [3, 4]
              );
            case 3:
              throw (
                (c = a.sent()),
                n.Log.info("Crypto Error in sendLedgerOutstandingBills  function "),
                c
              );
            case 4:
              ((m = l),
                (d = { userId: e.user.id, companyId: e.company.companyId, reminderVersion: 1 }),
                (y = {
                  data: t.toString("base64"),
                  digest: r.createMd5Digest(t),
                  jobId: e.jobId,
                  endOfData: e.endOfData,
                }),
                (b = u.getRequestOptions(m, d, y, e.user)),
                (a.label = 5));
            case 5:
              return (a.trys.push([5, 7, , 8]), [4, u.postRequest(b)]);
            case 6:
              return [2, a.sent()];
            case 7:
              throw (
                (h = a.sent()),
                n.Log.info("Send Auto Reminder API Call Error : " + JSON.stringify(h)),
                h
              );
            case 8:
              return [2];
          }
        });
      });
    }),
    (t.updateMasterName = function (e, t, r) {
      return i(this, void 0, void 0, function () {
        var i, o, s;
        return a(this, function (a) {
          if (n.Util.isNull(e)) throw new Error("User is not defined");
          ((i = m),
            (o = { companyId: t }),
            (s = u.getRequestOptions(i, o, { ledgerNameChanges: r }, e)));
          try {
            return [2, u.putRequest(s)];
          } catch (e) {
            throw (n.Log.info("update Master Name API Call Error : " + e), e);
          }
          return [2];
        });
      });
    }),
    (t.saveAdditionalSettingRejectedLedgers = function (e, t, r, o, s) {
      return i(this, void 0, void 0, function () {
        var i;
        return a(this, function (a) {
          i = u.getRequestOptions(
            y,
            { companyId: t, jobId: r },
            { lastPaymentSettingLedgers: o, baseAmountSettingLedgers: s },
            e,
          );
          try {
            return [2, u.postRequest(i)];
          } catch (e) {
            throw (
              n.Log.info(
                "send ledger list which is not send due to additional settings API Call Error : " +
                  n.Util.getErrorMessage(e),
              ),
              e
            );
          }
          return [2];
        });
      });
    }),
    (t.sendNoOutstandingsForToday = function (e, t, r) {
      return i(this, void 0, void 0, function () {
        var i, o, s, p, c;
        return a(this, function (a) {
          switch (a.label) {
            case 0:
              ((i = l),
                (o = { userId: e.id, companyId: t, reminderVersion: 1, noBillsFound: "true" }),
                (s = { jobId: r }),
                (p = u.getRequestOptions(i, o, s, e)),
                (a.label = 1));
            case 1:
              return (a.trys.push([1, 3, , 4]), [4, u.postRequest(p)]);
            case 2:
              return [2, a.sent()];
            case 3:
              throw (
                (c = a.sent()),
                n.Log.info(
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
      return i(this, void 0, void 0, function () {
        var i, o, s, n;
        return a(this, function (a) {
          return (
            (i = { companyId: t, userId: e.id }),
            (o = d),
            (s = { statusCode: r }),
            (n = u.getRequestOptions(o, i, s)),
            [2, u.putRequest(n)]
          );
        });
      });
    }));
};
