// webpack module #594 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var o = r(1271),
    s = r(1272),
    n = r(1282),
    u = r(12),
    p = r(2557),
    c = r(2),
    m = new Buffer([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6]),
    l = c.Util.getServerCredentials().IdentityPoolId,
    d = c.Util.getServerCredentials().s3BucketName;
  n.config.region = "eu-west-1";
  var y = new n.CognitoIdentityCredentials(
    { IdentityPoolId: l },
    { region: "eu-west-1", httpOptions: { connectTimeout: 12e4, timeout: 18e4 } },
  );
  n.config.update({
    credentials: y,
    maxRetries: 3,
    httpOptions: { connectTimeout: 12e4, timeout: 18e4 },
  });
  var b = (function () {
    function e() {}
    return (
      (e.prototype.put = function (e, t, r) {
        var o = this;
        return new Promise(function (s, p) {
          return i(o, void 0, void 0, function () {
            var i, o, m, l, y;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return [4, this.zip(JSON.stringify(r))];
                case 1:
                  return (
                    (i = a.sent()),
                    (o = this.encrypt(i)),
                    e || (e = d),
                    (m = u.createHash("md5")),
                    (l = m.update(o).digest("base64")),
                    (y = { Bucket: e, Key: t, ContentType: "zip", ContentMD5: l, Body: o }),
                    new n.S3().upload(y, function (e, t) {
                      e
                        ? (c.Log.error("Error uploading to s3"), c.Log.error(e), p(e))
                        : s(t.Location);
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
            var i = new p.ZipWriter();
            (i.addData("zip", e),
              i.toBuffer(function (e) {
                t(e);
              }));
          }
        });
      }),
      (e.prototype.unzip = function (e) {
        for (var t = new s(e), r = 0, i = t.getEntries(); r < i.length; r++) {
          var a = i[r];
          return t.readAsText(a);
        }
        return null;
      }),
      (e.prototype.encrypt = function (e) {
        return o.encBytes(e, m);
      }),
      (e.prototype.checkDataExceedingChunkSize = function (e) {
        return i(this, void 0, void 0, function () {
          var t, r;
          return a(this, function (i) {
            switch (i.label) {
              case 0:
                return (i.trys.push([0, 2, , 3]), [4, this.zip(JSON.stringify(e))]);
              case 1:
                return ((t = i.sent()), this.encrypt(t).byteLength > 5e6 ? [2, !0] : [2, !1]);
              case 2:
                throw (
                  (r = i.sent()),
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
