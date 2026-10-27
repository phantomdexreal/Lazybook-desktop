// webpack module #63 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

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
  var i = r(30),
    o = r(0),
    s = (function () {
      function e(t) {
        this.BackgroundDao = i.default.getV1(e, t);
      }
      return (
        (e.getName = function () {
          return e.masterName;
        }),
        (e.prototype.createTempData = function (e, t, r, n) {
          return (
            (t = t.map(function (t) {
              return { data: t, actionType: e, user: r, company: n };
            })),
            this.BackgroundDao.bulkCreate(t)
          );
        }),
        (e.prototype.getAllTempData = function () {
          return n(this, void 0, void 0, function () {
            var e;
            return a(this, function (t) {
              switch (t.label) {
                case 0:
                  return [4, this.BackgroundDao.findAll({ attributes: ["data"] })];
                case 1:
                  return (
                    (e = t.sent()),
                    o.Util.isFilledArray(e)
                      ? [
                          2,
                          e.map(function (e) {
                            return e.data;
                          }),
                        ]
                      : [2, e]
                  );
              }
            });
          });
        }),
        (e.prototype.getLastRow = function () {
          return n(this, void 0, void 0, function () {
            var e;
            return a(this, function (t) {
              switch (t.label) {
                case 0:
                  return [
                    4,
                    this.BackgroundDao.findAll({ limit: 1, order: [["createdAt", "DESC"]] }),
                  ];
                case 1:
                  return (e = t.sent()), o.Util.isNotNull(e) ? [2, e[0]] : [2, e];
              }
            });
          });
        }),
        (e.prototype.deleteAllData = function () {
          return this.BackgroundDao.truncate();
        }),
        (e.masterName = "BackgroundTempData"),
        e
      );
    })();
  t.default = s;
};
