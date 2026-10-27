// webpack module #1223 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var i =
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
    a =
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
  var o = r(2),
    s = (function () {
      function e() {}
      return (
        (e.prototype.parse = function (e, t, r) {
          return i(this, void 0, void 0, function () {
            var i, s, n, u, p, c, m, l, d;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  if (
                    ((i =
                      o.Util.isNotNull(r) &&
                      o.Util.isNotNull(r.fileFormat) &&
                      "EXPORT" === r.fileFormat
                        ? this.getCollectionFromExportFormat(t, e.getName().toLowerCase())
                        : this.getCollectionFromApiFormat(t, e.getName().toLowerCase())),
                    (s = []),
                    !o.Util.isNotNull(i))
                  )
                    return [3, 4];
                  ((n = 0), (u = i), (a.label = 1));
                case 1:
                  return n < u.length ? ((p = u[n]), [4, e.parse(p, r)]) : [3, 4];
                case 2:
                  if (((c = a.sent()), "[object Array]" === Object.prototype.toString.call(c)))
                    for (m = 0, l = c; m < l.length; m++) ((d = l[m]), s.push(d));
                  a.label = 3;
                case 3:
                  return (n++, [3, 1]);
                case 4:
                  return [2, s];
              }
            });
          });
        }),
        (e.prototype.getCollectionFromApiFormat = function (e, t) {
          var r;
          if (o.Util.isNull(e) || o.Util.isNull(e.envelope) || o.Util.isNull(e.envelope.body))
            throw new Error(
              "Unable to parse the response received from tally: " + JSON.stringify(e),
            );
          if (
            o.Util.isNotNull(e.envelope.body.data) &&
            o.Util.isNotNull(e.envelope.body.data.collection)
          ) {
            var i = e.envelope.body.data.collection[t];
            r = o.TallyUtil.parseArray(i);
          }
          return r;
        }),
        (e.prototype.getCollectionFromExportFormat = function (e, t) {
          var r;
          if (
            o.Util.isNull(e) ||
            o.Util.isNull(e.envelope) ||
            o.Util.isNull(e.envelope.body) ||
            o.Util.isNull(e.envelope.body.importdata)
          )
            throw new Error(
              "Unable to parse the response received from tally: " + JSON.stringify(e),
            );
          if (
            o.Util.isNotNull(e.envelope.body.importdata.requestdata) &&
            o.Util.isNotNull(e.envelope.body.importdata.requestdata.tallymessage)
          ) {
            r = [];
            for (
              var i = 0,
                a = o.TallyUtil.parseArray(e.envelope.body.importdata.requestdata.tallymessage);
              i < a.length;
              i++
            ) {
              var s = a[i];
              if (void 0 !== s[t.toLowerCase()])
                for (var n = 0, u = o.TallyUtil.parseArray(s[t.toLowerCase()]); n < u.length; n++) {
                  var p = u[n];
                  r.push(p);
                }
            }
          }
          return r;
        }),
        e
      );
    })();
  t.default = s;
};
