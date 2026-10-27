// webpack module #550 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var n = r(51),
    u = r(5),
    p = r(28),
    c = r(2),
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
          return u.Master.keys.concat(t.keys);
        }),
        (t.prototype.parse = function (e, r) {
          return o(this, void 0, void 0, function () {
            var i;
            return s(this, function (a) {
              return ((i = []).push(t.convert(e, r)), [2, i]);
            });
          });
        }),
        (t.prototype.getSyncConfig = function () {
          return t.syncconfig;
        }),
        (t.prototype.equals = function (e) {
          return (
            u.Master.compare(this._id, e._id) &&
            u.Master.compare(this.isDeleted, e.isDeleted) &&
            u.Master.compare(this.name, e.name) &&
            u.Master.compare(this.reservedName, e.reservedName) &&
            u.Master.compare(this.parentGroup, e.parentGroup) &&
            u.Master.compare(this.tags, e.tags) &&
            u.Master.compare(this.aliases, e.aliases)
          );
        }),
        (t.prototype.updateFromTally = function (e) {
          ((this.isDeleted = e.isDeleted),
            (this.name = e.name),
            (this.reservedName = e.reservedName),
            (this.parentGroup = e.parentGroup),
            (this.tags = e.tags),
            (this.aliases = e.aliases));
        }),
        (t.prototype.updateOldName = function (e) {
          u.Master.compare(this.name, e.name) || (this.oldName = this.name);
        }),
        (t.toObject = function (e) {
          var r = new t();
          if ((c.Util.assign(r, e), c.Util.isNotNull(e.tags) && e.tags.length > 0)) {
            r.tags = [];
            for (var i = 0, a = e.tags; i < a.length; i++) {
              var o = a[i];
              r.tags.push(p.StringItem.toObject(o));
            }
          }
          if (c.Util.isNotNull(e.aliases) && e.aliases.length > 0) {
            r.aliases = [];
            for (var s = 0, n = e.aliases; s < n.length; s++) {
              var u = n[s];
              r.aliases.push(p.StringItem.toObject(u));
            }
          }
          return r;
        }),
        (t.getGroupsByParent = function (e, t) {
          return o(this, void 0, void 0, function () {
            var r, i, a, o, n, u, p, m, l, d, y, b;
            return s(this, function (s) {
              if (((r = new Map()), c.Util.isFilledArray(t)))
                for (i = 0, a = t; i < a.length; i++)
                  ((p = a[i]),
                    c.Util.isNotNull(p.name) && r.set(p.name, p),
                    c.Util.isNotNull(p.reservedName) && r.set(p.reservedName, p));
              if (((o = []), c.Util.isFilledArray(t)))
                for (n = 0, u = t; n < u.length; n++)
                  if (((p = u[n]), c.Util.isFilledArray(e)))
                    for (m = 0, l = e; m < l.length; m++)
                      if (((d = l[m]), c.Util.isNotNull(d)))
                        if (
                          d.toLowerCase() === p.name.toLowerCase() ||
                          d.toLowerCase() === p.reservedName.toLowerCase()
                        )
                          o.push(p);
                        else if (c.Util.isNotNull(p.parentGroup))
                          for (
                            y = r.get(p.parentGroup), b = 0;
                            c.Util.isNotNull(y) && 1e3 != ++b;
                          ) {
                            if (
                              (c.Util.isNotNull(y.name) &&
                                d.toLowerCase() === y.name.toLowerCase()) ||
                              (c.Util.isNotNull(y.reservedName) &&
                                d.toLowerCase() === y.reservedName.toLowerCase()) ||
                              (c.Util.isNotNull(y.name) &&
                                c.Util.isNotNull(y.parentGroup) &&
                                y.name.toLowerCase() === y.parentGroup.toLowerCase())
                            ) {
                              o.push(p);
                              break;
                            }
                            y = c.Util.isNotNull(y.parentGroup) ? r.get(y.parentGroup) : null;
                          }
              return [2, o];
            });
          });
        }),
        (t.masterName = "Group"),
        (t.keys = [
          "NAME",
          "GUID",
          "PARENT",
          "LANGUAGENAME.LIST",
          "ISREVENUE",
          "AFFECTSGROSSPROFIT",
          "ISDEEMEDPOSITIVE",
          "AFFECTSSTOCK",
          "TRACKNEGATIVEBALANCES",
          "ISSUBLEDGER",
          "ISBILLWISEON",
          "ISCOSTCENTRESON",
        ]),
        (t.syncconfig = new n.SyncConfig(t.masterName, 6e4, 0)),
        (t.convert = function (e, r) {
          var i = new t();
          ((i._id = c.TallyUtil.getStringValue(e, "guid")),
            (i.masterId = c.TallyUtil.getIntValue(e, "masterid")),
            (i.alterId = c.TallyUtil.getIntValue(e, "alterid")),
            (i.name = c.TallyUtil.getStringValue(e, "name", !0)),
            c.Util.isEmptyString(i._id) && (i._id = i.name),
            (i.reservedName = c.TallyUtil.getStringValue(e, "reservedname", !0)),
            (i.parentGroup = c.TallyUtil.getStringValue(e, "parent")),
            (i.name !== i.parentGroup && i.reservedName !== i.parentGroup) ||
              (i.parentGroup = void 0),
            (i.tags = []),
            c.TallyUtil.getTag(e, "isrevenue") && i.tags.push(new p.StringItem("revenue")),
            c.TallyUtil.getTag(e, "affectsgrossprofit") &&
              i.tags.push(new p.StringItem("grossProfit")),
            c.TallyUtil.getTag(e, "affectsstock") && i.tags.push(new p.StringItem("stock")),
            c.TallyUtil.getTag(e, "isdeemedpositive") &&
              i.tags.push(new p.StringItem("deemedPositive")),
            c.TallyUtil.getTag(e, "iscostcentreson") &&
              i.tags.push(new p.StringItem("costcentre")));
          var a = c.TallyUtil.getAliasList(e, "languagename.list", "name.list", "name");
          return ((i.aliases = p.StringItem.convertStringArray(a, i.name)), i);
        }),
        t
      );
    })(u.Master);
  t.default = m;
};
