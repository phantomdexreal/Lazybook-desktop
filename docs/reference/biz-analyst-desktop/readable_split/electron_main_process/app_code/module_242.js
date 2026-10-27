// webpack module #242 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var o = r(43),
    s = r(2),
    n = (function () {
      function e(e, t) {
        ((this.userId = e), (this.company = t));
      }
      return (
        (e.prototype.bulkInsert = function (e) {
          return i(this, void 0, void 0, function () {
            return a(this, function (t) {
              switch (t.label) {
                case 0:
                  return s.Util.isFilledArray(e)
                    ? [
                        4,
                        o.default
                          .getV1(this.getModel(), this.userId, this.company)
                          .bulkCreate(this.convertToObject(e)),
                      ]
                    : [3, 2];
                case 1:
                  (t.sent(), (t.label = 2));
                case 2:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.syncDeletedMaster = function () {
          return i(this, void 0, void 0, function () {
            var e, t, r, i, n, u, p;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (e = o.default.getV1(this.getModel(), this.userId, this.company)),
                    [4, this.getDeletedMasterId(e)]
                  );
                case 1:
                  return (
                    (t = a.sent()),
                    s.Util.isFilledArray(t)
                      ? ((r = this.getParentModel()),
                        (i = t.map(function (e) {
                          return e.masterId;
                        })),
                        (n = s.DateUtil.now()),
                        (u = "_id"),
                        [4, r.findAll({ where: { masterId: { $in: i } } })])
                      : [3, 4]
                  );
                case 2:
                  return (
                    (p = (p = a.sent()).map(function (e) {
                      return (
                        !0 !== e.isDeleted && (e.isDeleted = !0),
                        (e.tallyUpdatedAt = n),
                        (e.uptoDate = !1),
                        e
                      );
                    })),
                    [4, r.updateTransaction(p, u)]
                  );
                case 3:
                  (a.sent(), s.Log.info(this.getParent() + " Deleted: " + p.length), (a.label = 4));
                case 4:
                  return [4, this.truncateData()];
                case 5:
                  return (a.sent(), [2]);
              }
            });
          });
        }),
        (e.prototype.truncateData = function () {
          return i(this, void 0, void 0, function () {
            return a(this, function (e) {
              switch (e.label) {
                case 0:
                  return [
                    4,
                    o.default.getV1(this.getModel(), this.userId, this.company).truncate(),
                  ];
                case 1:
                  return (e.sent(), [2]);
              }
            });
          });
        }),
        e
      );
    })();
  t.DeleteMaster = n;
};
