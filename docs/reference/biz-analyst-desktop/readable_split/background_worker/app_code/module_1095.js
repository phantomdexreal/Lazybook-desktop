// webpack module #1095 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var n =
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
    a =
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
  var i = r(0),
    o = (function () {
      function e() {}
      return (
        (e.prototype.parse = function (e, t, r) {
          return n(this, void 0, void 0, function () {
            var n, o, s, u, p, c, l, m, d;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  if (
                    ((n =
                      i.Util.isNotNull(r) &&
                      i.Util.isNotNull(r.fileFormat) &&
                      "EXPORT" === r.fileFormat
                        ? this.getCollectionFromExportFormat(t, e.getName().toLowerCase())
                        : this.getCollectionFromApiFormat(t, e.getName().toLowerCase())),
                    (o = []),
                    !i.Util.isNotNull(n))
                  )
                    return [3, 4];
                  ((s = 0), (u = n), (a.label = 1));
                case 1:
                  return s < u.length ? ((p = u[s]), [4, e.parse(p, r)]) : [3, 4];
                case 2:
                  if (((c = a.sent()), "[object Array]" === Object.prototype.toString.call(c)))
                    for (l = 0, m = c; l < m.length; l++) ((d = m[l]), o.push(d));
                  a.label = 3;
                case 3:
                  return (s++, [3, 1]);
                case 4:
                  return [2, o];
              }
            });
          });
        }),
        (e.prototype.getCollectionFromApiFormat = function (e, t) {
          var r;
          if (i.Util.isNull(e) || i.Util.isNull(e.envelope) || i.Util.isNull(e.envelope.body))
            throw new Error(
              "Unable to parse the response received from tally: " + JSON.stringify(e),
            );
          if (
            i.Util.isNotNull(e.envelope.body.data) &&
            i.Util.isNotNull(e.envelope.body.data.collection)
          ) {
            var n = e.envelope.body.data.collection[t];
            r = i.TallyUtil.parseArray(n);
          }
          return r;
        }),
        (e.prototype.getCollectionFromExportFormat = function (e, t) {
          var r;
          if (
            i.Util.isNull(e) ||
            i.Util.isNull(e.envelope) ||
            i.Util.isNull(e.envelope.body) ||
            i.Util.isNull(e.envelope.body.importdata)
          )
            throw new Error(
              "Unable to parse the response received from tally: " + JSON.stringify(e),
            );
          if (
            i.Util.isNotNull(e.envelope.body.importdata.requestdata) &&
            i.Util.isNotNull(e.envelope.body.importdata.requestdata.tallymessage)
          ) {
            r = [];
            for (
              var n = 0,
                a = i.TallyUtil.parseArray(e.envelope.body.importdata.requestdata.tallymessage);
              n < a.length;
              n++
            ) {
              var o = a[n];
              if (void 0 !== o[t.toLowerCase()])
                for (var s = 0, u = i.TallyUtil.parseArray(o[t.toLowerCase()]); s < u.length; s++) {
                  var p = u[s];
                  r.push(p);
                }
            }
          }
          return r;
        }),
        e
      );
    })();
  t.default = o;
};
