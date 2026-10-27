// webpack module #2695 (from electron_main_process, BA Mobile Connector 8.4.41)
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
      },
    o = this;
  Object.defineProperty(t, "__esModule", { value: !0 });
  var s = r(59),
    n = r(254),
    u = r(10),
    p = r(24),
    c = r(11),
    m = r(2),
    l = r(122),
    d = r(185);
  function y(e, t) {
    return i(this, void 0, void 0, function () {
      var r, i, o, n;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            (m.Log.info("performing device migration"), (a.label = 1));
          case 1:
            return (
              a.trys.push([1, 11, , 12]),
              (r = void 0),
              u.isFilledArray(t.versions) && (r = t.versions[t.versions.length - 1].version),
              m.Log.info("Last version: " + r),
              "4.0.1" !== r
                ? [3, 4]
                : (m.Log.info("Last version: " + r + ". Resyncing data because of migration.."),
                  [4, s.getAllCompanies(e)])
            );
          case 2:
            return ((o = a.sent()), [4, s.deleteDataAndDirectoryForCompanies(e, o, r)]);
          case 3:
            return (
              a.sent(),
              m.Log.info("Successfully completed device migration."),
              p.default.set(p.default.RESYNC_COMPACT_DATA_BUG, !1),
              [2, !0]
            );
          case 4:
            return (
              (i = u.parseVersion(c.default.APP_VERSION)),
              m.Log.info("current version: " + i),
              404 === i && u.isNotNull(r)
                ? p.default.get(p.default.RESYNC_COMPACT_DATA_BUG, !0)
                  ? (m.Log.info("Resyncing data because of compact data issue migration."),
                    [4, s.getAllCompanies(e)])
                  : [3, 7]
                : [3, 9]
            );
          case 5:
            return (
              (o = a.sent()),
              [4, s.deleteDataAndDirectoryForCompanies(e, o, c.default.APP_VERSION)]
            );
          case 6:
            return (
              a.sent(),
              m.Log.info("Successfully completed device migration because of compact data issue"),
              p.default.set(p.default.RESYNC_COMPACT_DATA_BUG, !1),
              [2, !0]
            );
          case 7:
            (m.Log.info("Not resyncing data because of compact data issue migration."),
              (a.label = 8));
          case 8:
            return [3, 10];
          case 9:
            (m.Log.info("new installation. setting resync as false."),
              p.default.set(p.default.RESYNC_COMPACT_DATA_BUG, !1),
              (a.label = 10));
          case 10:
            return [3, 12];
          case 11:
            return (
              (n = a.sent()),
              m.Log.error("Failed to migrate device: " + JSON.stringify(t)),
              m.Log.error(n),
              [3, 12]
            );
          case 12:
            return [2, !1];
        }
      });
    });
  }
  t.getDeviceRequestInfo = function (e, t) {
    return i(o, void 0, void 0, function () {
      var r, i, o, s, c, b, h, g, S, f, A, N;
      return a(this, function (a) {
        switch (a.label) {
          case 0:
            return !u.isNotNull(t) || u.isEmpty(t)
              ? [3, 6]
              : u.isNotNull(t) && u.isNotNull(t.id)
                ? ((r = p.default.get(p.default.DEVICE)),
                  u.isNull(r) || r.userId !== t.id
                    ? (e.dispatch(n.registerDevice(t.id)),
                      m.Log.info("Setting resync to false, since device is not registered"),
                      p.default.set(p.default.RESYNC_COMPACT_DATA_BUG, !1),
                      [3, 6])
                    : [3, 1])
                : [3, 6];
          case 1:
            return [4, l.getSystemHardware()];
          case 2:
            if (((i = a.sent()), (r.system = i.system), (o = !1), u.isNotEmpty(r.versions)))
              for (s = 0, c = r.versions; s < c.length; s++)
                if (c[s].version === d.version) {
                  o = !0;
                  break;
                }
            if (
              ((b = p.default.get(p.default.TALLY_VERSION_INFO)),
              (h = !1),
              u.isNotEmpty(b) && u.isNotNull(b.buildNumber) && u.isNotNull(r.tallyProductInfo))
            )
              for (g = 0, S = r.tallyProductInfo; g < S.length; g++)
                if (((f = S[g]), String(f.buildNumber) === String(b.buildNumber))) {
                  h = !0;
                  break;
                }
            return !1 === o || (!1 === h && u.isNotEmpty(b) && u.isNotNull(b.buildNumber))
              ? !1 !== o
                ? [3, 4]
                : [4, y(t, r)]
              : [3, 5];
          case 3:
            (a.sent(),
              (A = { date: new Date().getTime(), version: d.version }),
              r.versions.push(A),
              (a.label = 4));
          case 4:
            return (
              !1 === h &&
                u.isNotEmpty(b) &&
                u.isNotNull(b.buildNumber) &&
                ((b.date = m.DateUtil.now()),
                u.isNotNull(r.tallyProductInfo)
                  ? ((N = r.tallyProductInfo).push(b), (r.tallyProductInfo = N))
                  : (r.tallyProductInfo = [b])),
              e.dispatch(n.updateDevice(r, t.id)),
              [3, 6]
            );
          case 5:
            (m.Log.info("Setting resync to false, since device is already registered"),
              p.default.set(p.default.RESYNC_COMPACT_DATA_BUG, !1),
              (a.label = 6));
          case 6:
            return [2];
        }
      });
    });
  };
};
