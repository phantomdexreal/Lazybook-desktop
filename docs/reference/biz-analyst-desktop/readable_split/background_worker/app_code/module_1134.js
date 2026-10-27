// webpack module #1134 (from background_worker, BA Mobile Connector 8.4.41)
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
  var s = r(86),
    u = r(49),
    p = r(5),
    c = r(0),
    l = r(1135),
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
          return p.Master.keys.concat(t.keys);
        }),
        (t.prototype.parse = function (e) {
          return i(this, void 0, void 0, function () {
            var r;
            return o(this, function (n) {
              return ((r = []).push(t.convert(e)), [2, r]);
            });
          });
        }),
        (t.prototype.getSyncConfig = function () {
          return t.syncconfig;
        }),
        (t.prototype.equals = function (e) {
          return !!(
            p.Master.compare(this._id, e._id) &&
            p.Master.compare(this.isDeleted, e.isDeleted) &&
            p.Master.compare(this.name, e.name) &&
            p.Master.compare(this.reservedName, e.reservedName) &&
            p.Master.compare(this.aliases, e.aliases) &&
            p.Master.compare(this.useForPosInvoice, e.useForPosInvoice) &&
            p.Master.compare(this.parent, e.parent) &&
            p.Master.compare(this.numberingMethod, e.numberingMethod) &&
            p.Master.compare(this.preventDuplicates, e.preventDuplicates) &&
            p.Master.compare(this.voucherClassList, e.voucherClassList)
          );
        }),
        (t.prototype.updateFromTally = function (e) {
          ((this.isDeleted = e.isDeleted),
            (this._id = e._id),
            (this.name = e.name),
            (this.reservedName = e.reservedName),
            (this.aliases = e.aliases),
            (this.useForPosInvoice = e.useForPosInvoice),
            (this.parent = e.parent),
            (this.numberingMethod = e.numberingMethod),
            (this.preventDuplicates = e.preventDuplicates),
            (this.voucherClassList = e.voucherClassList));
        }),
        (t.prototype.updateOldName = function (e) {
          p.Master.compare(this.name, e.name) || (this.oldName = this.name);
        }),
        (t.toObject = function (e) {
          var r = new t();
          if ((c.Util.assign(r, e), c.Util.isNotNull(e.aliases) && e.aliases.length > 0)) {
            r.aliases = [];
            for (var n = 0, a = e.aliases; n < a.length; n++) {
              var i = a[n];
              r.aliases.push(s.default.toObject(i));
            }
          }
          if (c.Util.isNotNull(e.voucherClassList) && e.voucherClassList.length > 0) {
            r.voucherClassList = [];
            for (var o = 0, u = e.voucherClassList; o < u.length; o++) {
              var p = u[o];
              r.voucherClassList.push(l.default.toObject(p));
            }
          }
          return r;
        }),
        (t.masterName = "VoucherType"),
        (t.keys = [
          "NAME",
          "PARENT",
          "USEFORPOSINVOICE",
          "LANGUAGENAME.LIST",
          "NUMBERINGMETHOD",
          "PREVENTDUPLICATES",
          "VOUCHERCLASSLIST.LIST",
          "VOUCHERNUMBERSERIES.LIST",
        ]),
        (t.syncconfig = new u.SyncConfig(t.masterName, 6e4, 0)),
        (t.convert = function (e) {
          var r = new t();
          ((r._id = c.TallyUtil.getStringValue(e, "guid")),
            (r.masterId = c.TallyUtil.getIntValue(e, "masterid")),
            (r.alterId = c.TallyUtil.getIntValue(e, "alterid")),
            (r.name = c.TallyUtil.getStringValue(e, "name", !0)),
            c.Util.isEmptyString(r._id) && (r._id = r.name),
            (r.reservedName = c.TallyUtil.getStringValue(e, "reservedname", !0)),
            (r.parent = c.TallyUtil.getStringValue(e, "parent")),
            (r.useForPosInvoice = c.TallyUtil.getBoolean(e, "useforposinvoice")),
            (r.numberingMethod = c.TallyUtil.getStringValue(e, "numberingmethod")),
            (r.preventDuplicates = c.TallyUtil.getBoolean(e, "preventduplicates")));
          var n = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "vouchernumberseries.list"));
          if (c.Util.isFilledArray(n)) {
            var a = n[0];
            c.Util.isNotNull(a) &&
              ((r.numberingMethod = c.TallyUtil.getStringValue(a, "numberingmethod")),
              (r.preventDuplicates = c.TallyUtil.getBoolean(a, "preventduplicates")));
          }
          var i = c.TallyUtil.getAliasList(e, "languagename.list", "name.list", "name");
          r.aliases = s.default.convertStringArray(i, r.name);
          var o = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "voucherclasslist.list"));
          if (c.Util.isFilledArray(o)) {
            r.voucherClassList = [];
            for (var u = 0, p = o; u < p.length; u++) {
              var m = p[u];
              if (c.Util.isNotNull(m)) {
                var d = l.default.convert(m);
                r.voucherClassList.push(d);
              }
            }
          }
          return r;
        }),
        t
      );
    })(p.Master);
  t.default = m;
};
