// webpack module #243 (from electron_main_process, BA Mobile Connector 8.4.41)
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
    p = r(2),
    c = r(102),
    m = r(120),
    l = r(11),
    d = (function (e) {
      function t() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        return (
          (t.update = function (e) {
            ((t._id = e._id),
              (t.name = e.name),
              (t.reservedName = e.reservedName),
              (t.isActive = e.isActive),
              (t.gstDetails = e.gstDetails),
              (t.hsnDetails = e.hsnDetails));
          }),
          t
        );
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
          return !!(
            u.Master.compare(this._id, e._id) &&
            u.Master.compare(this.name, e.name) &&
            u.Master.compare(this.reservedName, e.reservedName) &&
            u.Master.compare(this.isActive, e.isActive) &&
            u.Master.compare(this.gstDetails, e.gstDetails) &&
            u.Master.compare(this.hsnDetails, e.hsnDetails)
          );
        }),
        (t.prototype.updateOldName = function (e) {
          u.Master.compare(this.name, e.name) || (this.oldName = this.name);
        }),
        (t.prototype.updateFromTally = function (e) {
          ((this._id = e._id),
            (this.name = e.name),
            (this.reservedName = e.reservedName),
            (this.isActive = e.isActive),
            (this.gstDetails = e.gstDetails),
            (this.hsnDetails = e.hsnDetails));
        }),
        (t.toObject = function (e) {
          var r = new t();
          if ((p.Util.assign(r, e), p.Util.isNotNull(e))) {
            if (p.Util.isFilledArray(e.gstDetails)) {
              r.gstDetails = [];
              for (var i = 0, a = e.gstDetails; i < a.length; i++) {
                var o = a[i];
                r.gstDetails.push(c.default.toObject(o));
              }
            }
            if (p.Util.isFilledArray(e.hsnDetails)) {
              r.hsnDetails = [];
              for (var s = 0, n = e.hsnDetails; s < n.length; s++) {
                var u = n[s];
                r.hsnDetails.push(m.default.toObject(u));
              }
            }
          }
          return r;
        }),
        (t.modifyGstDetail = function (e, t) {
          if (null == e) return e;
          var r = t.find(function (t) {
            return t.applicableFrom === e.applicableFrom;
          });
          if (null != r)
            l.default.HSN_SOURCE_TYPES.SPECIFY_DETAILS_HERE === r.sourceOfHsnDetails &&
              p.Util.isEmptyString(e.hsnCode) &&
              p.Util.isNotEmptyString(r.hsnCode) &&
              ((e.hsnCode = r.hsnCode), (e.hsn = r.hsn));
          else {
            t.sort(function (e, t) {
              return t.applicableFrom - e.applicableFrom;
            });
            for (var i = 0, a = t; i < a.length; i++) {
              var o = a[i];
              if (
                null != o &&
                o.applicableFrom <= e.applicableFrom &&
                l.default.HSN_SOURCE_TYPES.SPECIFY_DETAILS_HERE === o.sourceOfHsnDetails &&
                p.Util.isEmptyString(e.hsnCode) &&
                p.Util.isNotEmptyString(o.hsnCode)
              ) {
                ((e.hsnCode = o.hsnCode), (e.hsn = o.hsn));
                break;
              }
            }
          }
          return e;
        }),
        (t.masterName = "GstClassification"),
        (t.keys = [
          "GUID",
          "NAME",
          "RESERVEDNAME",
          "ISACTIVE",
          "GSTDETAILS.LIST",
          "HSNDETAILS.LIST",
        ]),
        (t.syncconfig = new n.SyncConfig(t.masterName, 6e5, 0)),
        (t.convert = function (e, r) {
          var i = new t();
          ((i._id = p.TallyUtil.getStringValue(e, "guid")),
            (i.masterId = p.TallyUtil.getIntValue(e, "masterid")),
            (i.alterId = p.TallyUtil.getIntValue(e, "alterid")),
            (i.name = p.TallyUtil.getStringValue(e, "name", !0)),
            p.Util.isEmptyString(i._id) && (i._id = i.name),
            (i.reservedName = p.TallyUtil.getStringValue(e, "reservedname", !0)),
            (i.isActive = p.TallyUtil.getBoolean(e, "isactive")));
          var a = p.TallyUtil.parseArray(p.TallyUtil.getJsonValue(e, "hsndetails.list"));
          if (p.Util.isFilledArray(a)) {
            for (var o = [], s = 0; s < a.length; ++s)
              null !== a[s] && void 0 !== a[s] && o.push(m.default.convert(a[s], r));
            i.hsnDetails = o;
          }
          var n = p.TallyUtil.parseArray(p.TallyUtil.getJsonValue(e, "gstdetails.list"));
          if (p.Util.isFilledArray(n)) {
            var u = [];
            for (s = 0; s < n.length; ++s)
              if (null !== n[s] && void 0 !== n[s])
                if (p.Util.isFilledArray(i.hsnDetails)) {
                  var l = c.default.convert(n[s], r);
                  u.push(t.modifyGstDetail(l, i.hsnDetails));
                } else u.push(c.default.convert(n[s], r));
            i.gstDetails = u;
          }
          return i;
        }),
        t
      );
    })(u.Master);
  t.default = d;
};
