// webpack module #18 (from electron_main_process, BA Mobile Connector 8.4.41)
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
    s = r(17),
    n = (function () {
      function e(e, t) {
        ((this.userId = e), (this.company = t));
        var r = this.getDBPassword(),
          n = o.PathUtil.getDbPath(e, t),
          u = {
            $eq: s.Op.eq,
            $ne: s.Op.ne,
            $any: s.Op.any,
            $all: s.Op.all,
            $values: s.Op.values,
            $col: s.Op.col,
            $between: s.Op.between,
            $lte: s.Op.lte,
            $in: s.Op.in,
            $gt: s.Op.gt,
            $gte: s.Op.gte,
          };
        try {
          this.sequelize = new s.Sequelize("bizanalystdb", e, r, {
            dialect: "sqlite",
            logging: !1,
            omitNull: !1,
            storage: n,
            operatorsAliases: u,
          });
        } catch (e) {
          throw (o.Log.error("Failed to open database at : " + n), o.Log.error(e), e);
        }
        ((this.model = this.sequelize.define(
          this.getModelName(),
          this.getAttributes(this.sequelize),
          { timestamps: !0, underscored: !1 },
        )),
          this.model.beforeBulkUpdate(function (e) {
            return i(this, void 0, void 0, function () {
              var t, r, i;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    return (((t = {}).where = e.where), [4, o.EncryptUtil.encryptOptions(t)]);
                  case 1:
                    return (
                      (r = a.sent()),
                      (e.where = r.where),
                      [4, o.EncryptUtil.encryptObject(e.attributes)]
                    );
                  case 2:
                    return ((i = a.sent()), (e.attributes = i), [2]);
                }
              });
            });
          }));
        var p = function (e) {
          return i(this, void 0, void 0, function () {
            var t;
            return a(this, function (r) {
              switch (r.label) {
                case 0:
                  return ((t = e), [4, o.EncryptUtil.encryptObject(e.dataValues)]);
                case 1:
                  return ((t.dataValues = r.sent()), [2]);
              }
            });
          });
        };
        (this.model.beforeCreate(p), this.model.beforeUpdate(p));
        var c = function (e) {
          return i(this, void 0, void 0, function () {
            var t;
            return a(this, function (r) {
              switch (r.label) {
                case 0:
                  return ((t = e), [4, o.EncryptUtil.decryptObject(e.dataValues)]);
                case 1:
                  return ((t.dataValues = r.sent()), [2]);
              }
            });
          });
        };
        (this.model.afterCreate(c),
          this.model.afterUpdate(c),
          this.model.beforeBulkCreate(function (e) {
            return i(this, void 0, void 0, function () {
              var t, r, i, s;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    ((t = 0), (r = e), (a.label = 1));
                  case 1:
                    return t < r.length
                      ? ((i = r[t]), [4, o.EncryptUtil.encryptObject(i.dataValues)])
                      : [3, 4];
                  case 2:
                    ((s = a.sent()), (i.dataValues = s), (a.label = 3));
                  case 3:
                    return (t++, [3, 1]);
                  case 4:
                    return [2];
                }
              });
            });
          }),
          this.model.afterBulkCreate(function (e) {
            return i(this, void 0, void 0, function () {
              var t, r, i, s;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    ((t = 0), (r = e), (a.label = 1));
                  case 1:
                    return t < r.length
                      ? ((i = r[t]), [4, o.EncryptUtil.decryptObject(i.dataValues)])
                      : [3, 4];
                  case 2:
                    ((s = a.sent()), (i.dataValues = s), (a.label = 3));
                  case 3:
                    return (t++, [3, 1]);
                  case 4:
                    return [2];
                }
              });
            });
          }),
          this.sequelize.sync(),
          this.runMigration());
      }
      return (
        (e.prototype.getModel = function () {
          return this.model;
        }),
        (e.prototype.create = function (e) {
          return i(this, void 0, void 0, function () {
            var t;
            return a(this, function (r) {
              switch (r.label) {
                case 0:
                  return [4, this.bulkCreate([e])];
                case 1:
                  return ((t = r.sent()), o.Util.isNull(t) || t.length > 0 ? [2, t[0]] : [2, null]);
              }
            });
          });
        }),
        (e.prototype.upsert = function (e) {
          var t = this;
          return new Promise(function (r, s) {
            return i(t, void 0, void 0, function () {
              var t,
                i = this;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    return ((t = { where: { _id: e._id } }), [4, o.EncryptUtil.encryptOptions(t)]);
                  case 1:
                    return (
                      (t = a.sent()),
                      this.sequelize.sync().then(function () {
                        return i.model
                          .findOne(t)
                          .then(function (t) {
                            if (null != t)
                              return t.updateAttributes(e).then(function (e) {
                                r(e.get({ plain: !0 }));
                              });
                            var a = [];
                            return (
                              a.push(e),
                              i.model.bulkCreate(a).then(function (e) {
                                r(e[0].dataValues);
                              })
                            );
                          })
                          .catch(function (e) {
                            (o.Log.error(e), s(e));
                          });
                      }),
                      [2]
                    );
                }
              });
            });
          });
        }),
        (e.prototype.bulkCreate = function (e) {
          var t = this;
          return new Promise(function (r, i) {
            t.sequelize.sync().then(function () {
              return t.model
                .bulkCreate(e)
                .then(function (e) {
                  var t = [];
                  if (o.Util.isNotNull(e))
                    for (var i = 0, a = e; i < a.length; i++) {
                      var s = a[i];
                      t.push(s.dataValues);
                    }
                  r(t);
                })
                .catch(function (e) {
                  (o.Log.error(e), i(e));
                });
            });
          });
        }),
        (e.prototype.findOne = function (e) {
          var t = this;
          return new Promise(function (r, s) {
            return i(t, void 0, void 0, function () {
              var t = this;
              return a(this, function (n) {
                switch (n.label) {
                  case 0:
                    return (o.Util.isNull(e) && (e = {}), [4, o.EncryptUtil.encryptOptions(e)]);
                  case 1:
                    return (
                      (e = n.sent()),
                      this.sequelize.sync().then(function () {
                        return t.model
                          .findOne(e)
                          .then(function (e) {
                            return i(t, void 0, void 0, function () {
                              var t;
                              return a(this, function (i) {
                                switch (i.label) {
                                  case 0:
                                    return o.Util.isNull(e) ? (r(null), [3, 3]) : [3, 1];
                                  case 1:
                                    return [4, o.EncryptUtil.decryptObject(e.dataValues)];
                                  case 2:
                                    ((t = i.sent()), r(t), (i.label = 3));
                                  case 3:
                                    return [2];
                                }
                              });
                            });
                          })
                          .catch(function (e) {
                            (o.Log.error(e), s(e));
                          });
                      }),
                      [2]
                    );
                }
              });
            });
          });
        }),
        (e.prototype.findAll = function (e) {
          var t = this;
          return new Promise(function (r, s) {
            return i(t, void 0, void 0, function () {
              var t = this;
              return a(this, function (n) {
                switch (n.label) {
                  case 0:
                    return (o.Util.isNull(e) && (e = {}), [4, o.EncryptUtil.encryptOptions(e)]);
                  case 1:
                    return (
                      (e = n.sent()),
                      this.sequelize.sync().then(function () {
                        return t.model
                          .findAll(e)
                          .then(function (e) {
                            return i(t, void 0, void 0, function () {
                              var t, i, s, n, u, p;
                              return a(this, function (a) {
                                switch (a.label) {
                                  case 0:
                                    return o.Util.isNull(e) ? (r(null), [3, 10]) : [3, 1];
                                  case 1:
                                    ((t = []), (i = 0), (s = e), (a.label = 2));
                                  case 2:
                                    if (!(i < s.length)) return [3, 9];
                                    ((n = s[i]), (a.label = 3));
                                  case 3:
                                    return (
                                      a.trys.push([3, 4, , 8]),
                                      (u = o.EncryptUtil.decryptObject(n.dataValues)),
                                      t.push(u),
                                      [3, 8]
                                    );
                                  case 4:
                                    return (
                                      (p = a.sent()),
                                      o.Util.isNotNull(p) &&
                                      o.Util.isNotNull(p.instance) &&
                                      o.Util.isNotNull(p.instance.masterId)
                                        ? (o.Log.info(
                                            "JSON error found for masterId: " + p.instance.masterId,
                                          ),
                                          [
                                            4,
                                            this.destroy({
                                              where: { masterId: p.instance.masterId },
                                            }),
                                          ])
                                        : [3, 6]
                                    );
                                  case 5:
                                    return (a.sent(), [3, 7]);
                                  case 6:
                                    throw p;
                                  case 7:
                                    return [3, 8];
                                  case 8:
                                    return (i++, [3, 2]);
                                  case 9:
                                    (r(t), (a.label = 10));
                                  case 10:
                                    return [2];
                                }
                              });
                            });
                          })
                          .catch(function (e) {
                            (o.Log.error(e), s(e));
                          });
                      }),
                      [2]
                    );
                }
              });
            });
          });
        }),
        (e.prototype.max = function (e, t, r) {
          return (
            o.Util.isEmptyString(t) && (t = e),
            o.Util.isNull(r) && (r = {}),
            this.findAll({ attributes: [[s.Sequelize.fn("MAX", s.Sequelize.col(e)), t]], where: r })
          );
        }),
        (e.prototype.min = function (e, t, r) {
          return (
            o.Util.isEmptyString(t) && (t = e),
            o.Util.isNull(r) && (r = {}),
            this.findAll({ attributes: [[s.Sequelize.fn("MIN", s.Sequelize.col(e)), t]], where: r })
          );
        }),
        (e.prototype.count = function (e) {
          var t = this;
          return new Promise(function (r, s) {
            return i(t, void 0, void 0, function () {
              var t = this;
              return a(this, function (n) {
                switch (n.label) {
                  case 0:
                    return (o.Util.isNull(e) && (e = {}), [4, o.EncryptUtil.encryptOptions(e)]);
                  case 1:
                    return (
                      (e = n.sent()),
                      this.sequelize.sync().then(function () {
                        return t.model
                          .count(e)
                          .then(function (e) {
                            return i(t, void 0, void 0, function () {
                              return a(this, function (t) {
                                return (r(e), [2]);
                              });
                            });
                          })
                          .catch(function (e) {
                            (o.Log.error(e), s(e));
                          });
                      }),
                      [2]
                    );
                }
              });
            });
          });
        }),
        (e.prototype.update = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r;
            return a(this, function (i) {
              switch (i.label) {
                case 0:
                  return (
                    i.trys.push([0, 3, , 4]),
                    o.Util.isNull(t)
                      ? [2, Promise.reject(new Error("Update condition not specified"))]
                      : [4, this.sequelize.sync()]
                  );
                case 1:
                  return (i.sent(), [4, this.model.update(e, t)]);
                case 2:
                  return [2, i.sent()];
                case 3:
                  return ((r = i.sent()), o.Log.error(r), [2, Promise.reject(r)]);
                case 4:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.destroy = function (e) {
          var t = this;
          return new Promise(function (r, s) {
            return i(t, void 0, void 0, function () {
              var t = this;
              return a(this, function (i) {
                switch (i.label) {
                  case 0:
                    return [4, o.EncryptUtil.encryptOptions(e)];
                  case 1:
                    return (
                      (e = i.sent()),
                      this.sequelize.sync().then(function () {
                        return t.model
                          .destroy(e)
                          .then(function (e) {
                            r(e);
                          })
                          .catch(function (e) {
                            (o.Log.error(e), s(e));
                          });
                      }),
                      [2]
                    );
                }
              });
            });
          });
        }),
        (e.prototype.truncate = function () {
          var e = this;
          return new Promise(function (t, r) {
            e.sequelize.sync().then(function () {
              return e.model
                .truncate()
                .then(function (e) {
                  t(e);
                })
                .catch(function (e) {
                  (o.Log.error(e), r(e));
                });
            });
          });
        }),
        (e.prototype.updateTransaction = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r = this;
            return a(this, function (s) {
              return [
                2,
                this.sequelize
                  .transaction(function (o) {
                    return i(r, void 0, void 0, function () {
                      var r, i, o, s, n, u;
                      return a(this, function (a) {
                        switch (a.label) {
                          case 0:
                            ((r = []), (i = {}), (o = 0), (s = e), (a.label = 1));
                          case 1:
                            return o < s.length
                              ? ((n = s[o]), (i[t] = n[t]), [4, this.update(n, { where: i })])
                              : [3, 4];
                          case 2:
                            ((u = a.sent()), r.push(u), (a.label = 3));
                          case 3:
                            return (o++, [3, 1]);
                          case 4:
                            return [2, r];
                        }
                      });
                    });
                  })
                  .catch(function (e) {
                    return (o.Log.error("Transaction error: "), o.Log.error(e), Promise.reject(e));
                  }),
              ];
            });
          });
        }),
        (e.prototype.getDBPassword = function () {
          return "pass";
        }),
        (e.prototype.checkTableExist = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r;
            return a(this, function (i) {
              switch (i.label) {
                case 0:
                  return (
                    (r = "SELECT name FROM sqlite_master WHERE type='table' AND name='" + t + "'"),
                    [4, o.Util.promisifyFunction(e.all.bind(e), r)]
                  );
                case 1:
                  return [2, i.sent()];
              }
            });
          });
        }),
        (e.prototype.getTableInfo = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r;
            return a(this, function (i) {
              switch (i.label) {
                case 0:
                  return (
                    (r = "PRAGMA table_info('" + t + "')"),
                    [4, o.Util.promisifyFunction(e.all.bind(e), r)]
                  );
                case 1:
                  return [2, i.sent()];
              }
            });
          });
        }),
        (e.prototype.getTableIndexInfo = function (e, t) {
          return i(this, void 0, void 0, function () {
            var r;
            return a(this, function (i) {
              switch (i.label) {
                case 0:
                  return (
                    (r = "PRAGMA index_list('" + t + "')"),
                    [4, o.Util.promisifyFunction(e.all.bind(e), r)]
                  );
                case 1:
                  return [2, i.sent()];
              }
            });
          });
        }),
        (e.prototype.executeRawQuery = function (e) {
          return i(this, void 0, void 0, function () {
            var t, r, i, s, n, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return ((t = []), [4, this.sequelize.query(e)]);
                case 1:
                  if (((r = (r = a.sent())[0]), !o.Util.isFilledArray(r))) return [3, 5];
                  ((i = 0), (s = r), (a.label = 2));
                case 2:
                  return i < s.length ? ((n = s[i]), [4, o.EncryptUtil.decryptObject(n)]) : [3, 5];
                case 3:
                  ((u = a.sent()), t.push(u), (a.label = 4));
                case 4:
                  return (i++, [3, 2]);
                case 5:
                  return [2, t];
              }
            });
          });
        }),
        (e.prototype.checkColumnExist = function (e) {
          return i(this, void 0, void 0, function () {
            var t, r, i;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (t = "PRAGMA table_info('" + this.getModelName() + "')"),
                    [4, this.sequelize.query(t)]
                  );
                case 1:
                  return (
                    (r = (r = a.sent())[0]),
                    (i = -1),
                    o.Util.isFilledArray(r) &&
                      (i = r.findIndex(function (t) {
                        return t.name === e;
                      })),
                    [2, i > -1]
                  );
              }
            });
          });
        }),
        e
      );
    })();
  t.ModelBase = n;
};
