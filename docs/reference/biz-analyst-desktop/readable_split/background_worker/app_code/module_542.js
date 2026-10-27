// webpack module #542 (from background_worker, BA Mobile Connector 8.4.41)
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
  var i = r(1140),
    o = r(1141),
    s = r(1151),
    u = r(21),
    p = r(1564),
    c = r(0),
    l = new Buffer([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6]),
    m = c.Util.getServerCredentials().IdentityPoolId,
    d = c.Util.getServerCredentials().s3BucketName;
  s.config.region = "eu-west-1";
  var y = new s.CognitoIdentityCredentials(
    { IdentityPoolId: m },
    { region: "eu-west-1", httpOptions: { connectTimeout: 12e4, timeout: 18e4 } },
  );
  s.config.update({
    credentials: y,
    maxRetries: 3,
    httpOptions: { connectTimeout: 12e4, timeout: 18e4 },
  });
  var b = (function () {
    function e() {}
    return (
      (e.prototype.put = function (e, t, r) {
        var i = this;
        return new Promise(function (o, p) {
          return n(i, void 0, void 0, function () {
            var n, i, l, m, y;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.zip(JSON.stringify(r))];
                case 1:
                  return (
                    (n = a.sent()),
                    (i = this.encrypt(n)),
                    e || (e = d),
                    (l = u.createHash("md5")),
                    (m = l.update(i).digest("base64")),
                    (y = { Bucket: e, Key: t, ContentType: "zip", ContentMD5: m, Body: i }),
                    new s.S3().upload(y, function (e, t) {
                      e
                        ? (c.Log.error("Error uploading to s3"), c.Log.error(e), p(e))
                        : o(t.Location);
                    }),
                    [2]
                  );
              }
            });
          });
        });
      }),
      (e.prototype.zip = function (e) {
        return new Promise(function (t, r) {
          if (c.Util.isNull(e)) r("Specified object for zipping is undefined");
          else {
            var n = new p.ZipWriter();
            (n.addData("zip", e),
              n.toBuffer(function (e) {
                t(e);
              }));
          }
        });
      }),
      (e.prototype.unzip = function (e) {
        for (var t = new o(e), r = 0, n = t.getEntries(); r < n.length; r++) {
          var a = n[r];
          return t.readAsText(a);
        }
        return null;
      }),
      (e.prototype.encrypt = function (e) {
        return i.encBytes(e, l);
      }),
      (e.prototype.checkDataExceedingChunkSize = function (e) {
        return n(this, void 0, void 0, function () {
          var t, r;
          return a(this, function (n) {
            switch (n.label) {
              case 0:
                return (n.trys.push([0, 2, , 3]), [4, this.zip(JSON.stringify(e))]);
              case 1:
                return ((t = n.sent()), this.encrypt(t).byteLength > 5e6 ? [2, !0] : [2, !1]);
              case 2:
                throw (
                  (r = n.sent()),
                  c.Log.info(
                    "Crypto Error(checkDataExceedingChunkSize function): " + JSON.stringify(r),
                  ),
                  r
                );
              case 3:
                return [2];
            }
          });
        });
      }),
      (e.prototype.createMd5Digest = function (e) {
        return u.createHash("md5").update(e).digest("base64");
      }),
      e
    );
  })();
  t.default = b;
};
