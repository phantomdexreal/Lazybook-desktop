// webpack module #647 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

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
        (n(e, t),
          (e.prototype = null === t ? Object.create(t) : ((r.prototype = t.prototype), new r())));
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
  var s = r(27),
    u = r(13),
    p = r(0),
    c = r(14),
    l = r(32),
    m = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        a(t, e),
        (t.prototype.getModelName = function () {
          return "gstClassifications";
        }),
        (t.prototype.getAttributes = function () {
          return {
            _id: { type: u.UUID, primaryKey: !0, defaultValue: u.UUIDV4 },
            name: { type: u.STRING, required: !1 },
            reservedName: { type: u.STRING, required: !1 },
            tallyUpdatedAt: { type: u.INTEGER, required: !0 },
            uptoDate: { type: u.BOOLEAN, required: !0 },
            masterId: { type: u.INTEGER, required: !0 },
            alterId: { type: u.INTEGER, required: !0 },
            oldName: { type: u.STRING, required: !0 },
            isDeleted: { type: u.BOOLEAN, required: !0 },
            isActive: { type: u.BOOLEAN, required: !1 },
            gstDetails: { type: u.ABSTRACT, required: !1 },
            hsnDetails: { type: u.ABSTRACT, required: !1 },
          };
        }),
        (t.prototype.runMigration = function () {
          var e = this,
            t = p.PathUtil.getDbPath(this.userId, this.company),
            r = new l.SQLConfig();
          s.open(t, "r", function (n, a) {
            if (n && "ENOENT" == n.code) p.Log.error(n);
            else {
              var s = r.connect(t);
              s.serialize(function () {
                return i(this, void 0, void 0, function () {
                  var t, r, n, a;
                  return o(this, function (i) {
                    switch (i.label) {
                      case 0:
                        ((t = e.getModelName()), (i.label = 1));
                      case 1:
                        return (i.trys.push([1, 6, , 7]), [4, e.checkTableExist(s, t)]);
                      case 2:
                        return (
                          (r = i.sent()),
                          p.Util.isFilledArray(r) ? [4, e.getTableInfo(s, t)] : [3, 5]
                        );
                      case 3:
                        return ((n = i.sent()), [4, d(s, n)]);
                      case 4:
                        (i.sent(), (i.label = 5));
                      case 5:
                        return [3, 7];
                      case 6:
                        return ((a = i.sent()), p.Log.error(JSON.stringify(a)), [3, 7]);
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
    return i(this, void 0, void 0, function () {
      var r, n, a;
      return o(this, function (i) {
        for (r = !1, n = 0, a = t; n < a.length; n++)
          ("hsnDetails" === a[n].name && (r = !0),
            !1 === r && e.run("ALTER TABLE gstClassifications ADD hsnDetails ABSTRACT"));
        return [2];
      });
    });
  }
  t.default = m;
};
