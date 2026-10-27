// webpack module #1127 (from background_worker, BA Mobile Connector 8.4.41)
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
  var s = r(94),
    u = r(539),
    p = r(49),
    c = r(5),
    l = r(0),
    m = r(111),
    d = r(229),
    y = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        a(t, e),
        (t.prototype.getName = function () {
          return t.masterName;
        }),
        (t.prototype.getKeys = function () {
          return c.Master.keys.concat(t.keys);
        }),
        (t.prototype.parse = function (e, r) {
          return i(this, void 0, void 0, function () {
            var n;
            return o(this, function (a) {
              return ((n = []).push(t.convert(e, r)), [2, n]);
            });
          });
        }),
        (t.prototype.getSyncConfig = function () {
          return t.syncconfig;
        }),
        (t.prototype.equals = function (e) {
          return !!(
            c.Master.compare(this._id, e._id) &&
            c.Master.compare(this.isDeleted, e.isDeleted) &&
            c.Master.compare(this.name, e.name) &&
            c.Master.compare(this.parentGroup, e.parentGroup) &&
            c.Master.compare(this.unit, e.unit) &&
            c.Master.compare(this.gstDetails, e.gstDetails) &&
            c.Master.compare(this.hsnDetails, e.hsnDetails) &&
            c.Master.compare(this.vatDetails, e.vatDetails)
          );
        }),
        (t.prototype.updateFromTally = function (e) {
          ((this.isDeleted = e.isDeleted),
            (this.name = e.name),
            (this.parentGroup = e.parentGroup),
            (this.unit = e.unit),
            (this.gstDetails = e.gstDetails),
            (this.hsnDetails = e.hsnDetails),
            (this.vatDetails = e.vatDetails));
        }),
        (t.prototype.updateOldName = function (e) {
          c.Master.compare(this.name, e.name) || (this.oldName = this.name);
        }),
        (t.toObject = function (e) {
          var r = new t();
          if ((l.Util.assign(r, e), l.Util.isNotNull(e.gstDetails) && e.gstDetails.length > 0)) {
            r.gstDetails = [];
            for (var n = 0, a = e.gstDetails; n < a.length; n++) {
              var i = a[n];
              r.gstDetails.push(s.default.toObject(i));
            }
          }
          if (l.Util.isNotNull(e.hsnDetails) && e.hsnDetails.length > 0) {
            r.hsnDetails = [];
            for (var o = 0, p = e.hsnDetails; o < p.length; o++) {
              var c = p[o];
              r.hsnDetails.push(m.default.toObject(c));
            }
          }
          if (l.Util.isNotNull(e.vatDetails) && e.vatDetails.length > 0) {
            r.vatDetails = [];
            for (var d = 0, y = e.vatDetails; d < y.length; d++) {
              var b = y[d];
              r.vatDetails.push(u.default.toObject(b));
            }
          }
          return r;
        }),
        (t.masterName = "StockGroup"),
        (t.keys = [
          "NAME",
          "GUID",
          "PARENT",
          "BASEUNITS",
          "COSTINGMETHOD",
          "VALUATIONMETHOD",
          "ISCOSTCENTRESON",
          "ISBATCHWISEON",
          "ISPERISHABLEON",
          "ISADDABLE",
          "IGNOREPHYSICALDIFFERENCE",
          "IGNORENEGATIVESTOCK",
          "ALLOWUSEOFEXPIREDITEMS",
          "HASMFGDATE",
          "IGNOREBATCHES",
          "IGNOREGODOWNS",
          "GSTDETAILS.LIST",
          "HSNDETAILS.LIST",
          "VATDETAILS.LIST",
        ]),
        (t.syncconfig = new p.SyncConfig(t.masterName, 36e5, 0)),
        (t.convert = function (e, r) {
          var n = new t();
          ((n._id = l.TallyUtil.getStringValue(e, "guid")),
            (n.masterId = l.TallyUtil.getIntValue(e, "masterid")),
            (n.alterId = l.TallyUtil.getIntValue(e, "alterid")),
            (n.name = l.TallyUtil.getStringValue(e, "name", !0)),
            l.Util.isEmptyString(n._id) && (n._id = n.name),
            (n.parentGroup = l.TallyUtil.getStringValue(e, "parent")),
            (n.unit = l.TallyUtil.getStringValue(e, "baseunits")));
          var a = l.TallyUtil.parseArray(l.TallyUtil.getJsonValue(e, "hsndetails.list"));
          if (l.Util.isFilledArray(a)) {
            for (var i = [], o = 0; o < a.length; ++o)
              null !== a[o] && void 0 !== a[o] && i.push(m.default.convert(a[o], r));
            n.hsnDetails = i;
          }
          var p = l.TallyUtil.parseArray(l.TallyUtil.getJsonValue(e, "gstdetails.list"));
          if (l.Util.isFilledArray(p)) {
            var c = [];
            for (o = 0; o < p.length; ++o)
              if (null !== p[o] && void 0 !== p[o])
                if (l.Util.isFilledArray(n.hsnDetails)) {
                  var y = s.default.convert(p[o], r);
                  c.push(d.default.modifyGstDetail(y, n.hsnDetails));
                } else c.push(s.default.convert(p[o], r));
            n.gstDetails = c;
          }
          var b = l.TallyUtil.parseArray(l.TallyUtil.getJsonValue(e, "vatdetails.list"));
          if (b.length > 0) {
            var h = [];
            for (o = 0; o < b.length; ++o)
              null !== b[o] && void 0 !== b[o] && h.push(u.default.convert(b[o], r));
            n.vatDetails = h;
          }
          return n;
        }),
        t
      );
    })(c.Master);
  t.default = y;
};
