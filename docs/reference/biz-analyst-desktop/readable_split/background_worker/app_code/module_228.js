// webpack module #228 (from background_worker, BA Mobile Connector 8.4.41)
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
  var i = r(30),
    o = r(0),
    s = (function () {
      function e(e, t) {
        ((this.userId = e), (this.company = t));
      }
      return (
        (e.prototype.bulkInsert = function (e) {
          return n(this, void 0, void 0, function () {
            return a(this, function (t) {
              switch (t.label) {
                case 0:
                  return o.Util.isFilledArray(e)
                    ? [
                        4,
                        i.default
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
          return n(this, void 0, void 0, function () {
            var e, t, r, n, s, u, p;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (e = i.default.getV1(this.getModel(), this.userId, this.company)),
                    [4, this.getDeletedMasterId(e)]
                  );
                case 1:
                  return (
                    (t = a.sent()),
                    o.Util.isFilledArray(t)
                      ? ((r = this.getParentModel()),
                        (n = t.map(function (e) {
                          return e.masterId;
                        })),
                        (s = o.DateUtil.now()),
                        (u = "_id"),
                        [4, r.findAll({ where: { masterId: { $in: n } } })])
                      : [3, 4]
                  );
                case 2:
                  return (
                    (p = (p = a.sent()).map(function (e) {
                      return (
                        !0 !== e.isDeleted && (e.isDeleted = !0),
                        (e.tallyUpdatedAt = s),
                        (e.uptoDate = !1),
                        e
                      );
                    })),
                    [4, r.updateTransaction(p, u)]
                  );
                case 3:
                  (a.sent(), o.Log.info(this.getParent() + " Deleted: " + p.length), (a.label = 4));
                case 4:
                  return [4, this.truncateData()];
                case 5:
                  return (a.sent(), [2]);
              }
            });
          });
        }),
        (e.prototype.truncateData = function () {
          return n(this, void 0, void 0, function () {
            return a(this, function (e) {
              switch (e.label) {
                case 0:
                  return [
                    4,
                    i.default.getV1(this.getModel(), this.userId, this.company).truncate(),
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
  t.DeleteMaster = s;
};
