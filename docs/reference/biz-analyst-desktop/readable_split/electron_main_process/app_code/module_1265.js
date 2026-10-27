// webpack module #1265 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var n = r(96),
    u = r(51),
    p = r(5),
    c = r(2),
    m = r(1266),
    l = (function (e) {
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
          return o(this, void 0, void 0, function () {
            var r;
            return s(this, function (i) {
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
            for (var i = 0, a = e.aliases; i < a.length; i++) {
              var o = a[i];
              r.aliases.push(n.default.toObject(o));
            }
          }
          if (c.Util.isNotNull(e.voucherClassList) && e.voucherClassList.length > 0) {
            r.voucherClassList = [];
            for (var s = 0, u = e.voucherClassList; s < u.length; s++) {
              var p = u[s];
              r.voucherClassList.push(m.default.toObject(p));
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
          var i = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "vouchernumberseries.list"));
          if (c.Util.isFilledArray(i)) {
            var a = i[0];
            c.Util.isNotNull(a) &&
              ((r.numberingMethod = c.TallyUtil.getStringValue(a, "numberingmethod")),
              (r.preventDuplicates = c.TallyUtil.getBoolean(a, "preventduplicates")));
          }
          var o = c.TallyUtil.getAliasList(e, "languagename.list", "name.list", "name");
          r.aliases = n.default.convertStringArray(o, r.name);
          var s = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "voucherclasslist.list"));
          if (c.Util.isFilledArray(s)) {
            r.voucherClassList = [];
            for (var u = 0, p = s; u < p.length; u++) {
              var l = p[u];
              if (c.Util.isNotNull(l)) {
                var d = m.default.convert(l);
                r.voucherClassList.push(d);
              }
            }
          }
          return r;
        }),
        t
      );
    })(p.Master);
  t.default = l;
};
