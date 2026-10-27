// webpack module #1243 (from electron_main_process, BA Mobile Connector 8.4.41)
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
          return !!(
            u.Master.compare(this._id, e._id) &&
            u.Master.compare(this.isDeleted, e.isDeleted) &&
            u.Master.compare(this.name, e.name) &&
            u.Master.compare(this.parent, e.parent) &&
            u.Master.compare(this.pinCode, e.pinCode) &&
            u.Master.compare(this.phoneNumber, e.phoneNumber) &&
            u.Master.compare(this.exciseRangeCode, e.exciseRangeCode) &&
            u.Master.compare(this.exciseDivisionCode, e.exciseDivisionCode) &&
            u.Master.compare(this.exciseRegNo, e.exciseRegNo) &&
            u.Master.compare(this.addressList, e.addressList)
          );
        }),
        (t.prototype.updateFromTally = function (e) {
          ((this.isDeleted = e.isDeleted),
            (this.name = e.name),
            (this.parent = e.parent),
            (this.addressList = e.addressList),
            (this.pinCode = e.pinCode),
            (this.phoneNumber = e.phoneNumber),
            (this.exciseRangeCode = e.exciseRangeCode),
            (this.exciseDivisionCode = e.exciseDivisionCode),
            (this.exciseRegNo = e.exciseRegNo));
        }),
        (t.prototype.updateOldName = function (e) {
          u.Master.compare(this.name, e.name) || (this.oldName = this.name);
        }),
        (t.toObject = function (e) {
          var r = new t();
          if ((c.Util.assign(r, e), c.Util.isNotNull(e.addressList) && e.addressList.length > 0)) {
            r.addressList = [];
            for (var i = 0, a = e.addressList; i < a.length; i++) {
              var o = a[i];
              r.addressList.push(p.StringItem.toObject(o));
            }
          }
          return r;
        }),
        (t.masterName = "Godown"),
        (t.keys = [
          "NAME",
          "ADDRESS.LIST",
          "PINCODE",
          "PHONENUMBER",
          "EXCISERANGECODE",
          "EXCISEDIVISIONCODE",
          "EXCISEREGNO",
          "PARENT",
        ]),
        (t.syncconfig = new n.SyncConfig(t.masterName, 6e5, 0)),
        (t.convert = function (e, r) {
          var i = new t();
          ((i._id = c.TallyUtil.getStringValue(e, "guid")),
            (i.masterId = c.TallyUtil.getIntValue(e, "masterid")),
            (i.alterId = c.TallyUtil.getIntValue(e, "alterid")),
            (i.name = c.TallyUtil.getStringValue(e, "name", !0)),
            c.Util.isEmptyString(i._id) && (i._id = i.name),
            (i.parent = c.TallyUtil.getStringValue(e, "parent")));
          var a = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "address.list"));
          if (
            void 0 !== a &&
            a.length > 0 &&
            ((a = a[0].address), (i.addressList = []), c.Util.isFilledArray(a))
          )
            for (var o = 0, s = a; o < s.length; o++) {
              var n = s[o];
              c.Util.isNotNull(n) && i.addressList.push(new p.StringItem(n.$));
            }
          return (
            (i.pinCode = c.TallyUtil.getStringValue(e, "pincode")),
            (i.phoneNumber = c.TallyUtil.getStringValue(e, "phonenumber")),
            (i.exciseRangeCode = c.TallyUtil.getStringValue(e, "exciserangecode")),
            (i.exciseDivisionCode = c.TallyUtil.getStringValue(e, "excisedivisioncode")),
            (i.exciseRegNo = c.TallyUtil.getStringValue(e, "exciseregno")),
            i
          );
        }),
        t
      );
    })(u.Master);
  t.default = m;
};
