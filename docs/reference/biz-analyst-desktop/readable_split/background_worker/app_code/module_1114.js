// webpack module #1114 (from background_worker, BA Mobile Connector 8.4.41)
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
  var s = r(49),
    u = r(5),
    p = r(29),
    c = r(0),
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
          return u.Master.keys.concat(t.keys);
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
            for (var n = 0, a = e.addressList; n < a.length; n++) {
              var i = a[n];
              r.addressList.push(p.StringItem.toObject(i));
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
        (t.syncconfig = new s.SyncConfig(t.masterName, 6e5, 0)),
        (t.convert = function (e, r) {
          var n = new t();
          ((n._id = c.TallyUtil.getStringValue(e, "guid")),
            (n.masterId = c.TallyUtil.getIntValue(e, "masterid")),
            (n.alterId = c.TallyUtil.getIntValue(e, "alterid")),
            (n.name = c.TallyUtil.getStringValue(e, "name", !0)),
            c.Util.isEmptyString(n._id) && (n._id = n.name),
            (n.parent = c.TallyUtil.getStringValue(e, "parent")));
          var a = c.TallyUtil.parseArray(c.TallyUtil.getJsonValue(e, "address.list"));
          if (
            void 0 !== a &&
            a.length > 0 &&
            ((a = a[0].address), (n.addressList = []), c.Util.isFilledArray(a))
          )
            for (var i = 0, o = a; i < o.length; i++) {
              var s = o[i];
              c.Util.isNotNull(s) && n.addressList.push(new p.StringItem(s.$));
            }
          return (
            (n.pinCode = c.TallyUtil.getStringValue(e, "pincode")),
            (n.phoneNumber = c.TallyUtil.getStringValue(e, "phonenumber")),
            (n.exciseRangeCode = c.TallyUtil.getStringValue(e, "exciserangecode")),
            (n.exciseDivisionCode = c.TallyUtil.getStringValue(e, "excisedivisioncode")),
            (n.exciseRegNo = c.TallyUtil.getStringValue(e, "exciseregno")),
            n
          );
        }),
        t
      );
    })(u.Master);
  t.default = l;
};
