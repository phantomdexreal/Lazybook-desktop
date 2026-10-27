// webpack module #229 (extracted from electron/background/background.bundle.js, BA Mobile Connector 8.4.41)
// Minified original; identifiers are mangled. Cross-module refs appear as r(<id>).

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
        n(e, t),
          (e.prototype = null === t ? Object.create(t) : ((r.prototype = t.prototype), new r()));
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
  var s = r(49),
    u = r(5),
    p = r(0),
    c = r(94),
    l = r(111),
    m = r(8),
    d = (function (e) {
      function t() {
        var t = (null !== e && e.apply(this, arguments)) || this;
        return (
          (t.update = function (e) {
            (t._id = e._id),
              (t.name = e.name),
              (t.reservedName = e.reservedName),
              (t.isActive = e.isActive),
              (t.gstDetails = e.gstDetails),
              (t.hsnDetails = e.hsnDetails);
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
          return i(this, void 0, void 0, function () {
            var n;
            return o(this, function (a) {
              return (n = []).push(t.convert(e, r)), [2, n];
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
          (this._id = e._id),
            (this.name = e.name),
            (this.reservedName = e.reservedName),
            (this.isActive = e.isActive),
            (this.gstDetails = e.gstDetails),
            (this.hsnDetails = e.hsnDetails);
        }),
        (t.toObject = function (e) {
          var r = new t();
          if ((p.Util.assign(r, e), p.Util.isNotNull(e))) {
            if (p.Util.isFilledArray(e.gstDetails)) {
              r.gstDetails = [];
              for (var n = 0, a = e.gstDetails; n < a.length; n++) {
                var i = a[n];
                r.gstDetails.push(c.default.toObject(i));
              }
            }
            if (p.Util.isFilledArray(e.hsnDetails)) {
              r.hsnDetails = [];
              for (var o = 0, s = e.hsnDetails; o < s.length; o++) {
                var u = s[o];
                r.hsnDetails.push(l.default.toObject(u));
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
            m.default.HSN_SOURCE_TYPES.SPECIFY_DETAILS_HERE === r.sourceOfHsnDetails &&
              p.Util.isEmptyString(e.hsnCode) &&
              p.Util.isNotEmptyString(r.hsnCode) &&
              ((e.hsnCode = r.hsnCode), (e.hsn = r.hsn));
          else {
            t.sort(function (e, t) {
              return t.applicableFrom - e.applicableFrom;
            });
            for (var n = 0, a = t; n < a.length; n++) {
              var i = a[n];
              if (
                null != i &&
                i.applicableFrom <= e.applicableFrom &&
                m.default.HSN_SOURCE_TYPES.SPECIFY_DETAILS_HERE === i.sourceOfHsnDetails &&
                p.Util.isEmptyString(e.hsnCode) &&
                p.Util.isNotEmptyString(i.hsnCode)
              ) {
                (e.hsnCode = i.hsnCode), (e.hsn = i.hsn);
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
        (t.syncconfig = new s.SyncConfig(t.masterName, 6e5, 0)),
        (t.convert = function (e, r) {
          var n = new t();
          (n._id = p.TallyUtil.getStringValue(e, "guid")),
            (n.masterId = p.TallyUtil.getIntValue(e, "masterid")),
            (n.alterId = p.TallyUtil.getIntValue(e, "alterid")),
            (n.name = p.TallyUtil.getStringValue(e, "name", !0)),
            p.Util.isEmptyString(n._id) && (n._id = n.name),
            (n.reservedName = p.TallyUtil.getStringValue(e, "reservedname", !0)),
            (n.isActive = p.TallyUtil.getBoolean(e, "isactive"));
          var a = p.TallyUtil.parseArray(p.TallyUtil.getJsonValue(e, "hsndetails.list"));
          if (p.Util.isFilledArray(a)) {
            for (var i = [], o = 0; o < a.length; ++o)
              null !== a[o] && void 0 !== a[o] && i.push(l.default.convert(a[o], r));
            n.hsnDetails = i;
          }
          var s = p.TallyUtil.parseArray(p.TallyUtil.getJsonValue(e, "gstdetails.list"));
          if (p.Util.isFilledArray(s)) {
            var u = [];
            for (o = 0; o < s.length; ++o)
              if (null !== s[o] && void 0 !== s[o])
                if (p.Util.isFilledArray(n.hsnDetails)) {
                  var m = c.default.convert(s[o], r);
                  u.push(t.modifyGstDetail(m, n.hsnDetails));
                } else u.push(c.default.convert(s[o], r));
            n.gstDetails = u;
          }
          return n;
        }),
        t
      );
    })(u.Master);
  t.default = d;
};
