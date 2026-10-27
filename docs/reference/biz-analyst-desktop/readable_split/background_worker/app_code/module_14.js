// webpack module #14 (from background_worker, BA Mobile Connector 8.4.41)
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
    o = r(13),
    s = (function () {
      function e(e, t) {
        ((this.userId = e), (this.company = t));
        var r = this.getDBPassword(),
          s = i.PathUtil.getDbPath(e, t),
          u = {
            $eq: o.Op.eq,
            $ne: o.Op.ne,
            $any: o.Op.any,
            $all: o.Op.all,
            $values: o.Op.values,
            $col: o.Op.col,
            $between: o.Op.between,
            $lte: o.Op.lte,
            $in: o.Op.in,
            $gt: o.Op.gt,
            $gte: o.Op.gte,
          };
        try {
          this.sequelize = new o.Sequelize("bizanalystdb", e, r, {
            dialect: "sqlite",
            logging: !1,
            omitNull: !1,
            storage: s,
            operatorsAliases: u,
          });
        } catch (e) {
          throw (i.Log.error("Failed to open database at : " + s), i.Log.error(e), e);
        }
        ((this.model = this.sequelize.define(
          this.getModelName(),
          this.getAttributes(this.sequelize),
          { timestamps: !0, underscored: !1 },
        )),
          this.model.beforeBulkUpdate(function (e) {
            return n(this, void 0, void 0, function () {
              var t, r, n;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    return (((t = {}).where = e.where), [4, i.EncryptUtil.encryptOptions(t)]);
                  case 1:
                    return (
                      (r = a.sent()),
                      (e.where = r.where),
                      [4, i.EncryptUtil.encryptObject(e.attributes)]
                    );
                  case 2:
                    return ((n = a.sent()), (e.attributes = n), [2]);
                }
              });
            });
          }));
        var p = function (e) {
          return n(this, void 0, void 0, function () {
            var t;
            return a(this, function (r) {
              switch (r.label) {
                case 0:
                  return ((t = e), [4, i.EncryptUtil.encryptObject(e.dataValues)]);
                case 1:
                  return ((t.dataValues = r.sent()), [2]);
              }
            });
          });
        };
        (this.model.beforeCreate(p), this.model.beforeUpdate(p));
        var c = function (e) {
          return n(this, void 0, void 0, function () {
            var t;
            return a(this, function (r) {
              switch (r.label) {
                case 0:
                  return ((t = e), [4, i.EncryptUtil.decryptObject(e.dataValues)]);
                case 1:
                  return ((t.dataValues = r.sent()), [2]);
              }
            });
          });
        };
        (this.model.afterCreate(c),
          this.model.afterUpdate(c),
          this.model.beforeBulkCreate(function (e) {
            return n(this, void 0, void 0, function () {
              var t, r, n, o;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    ((t = 0), (r = e), (a.label = 1));
                  case 1:
                    return t < r.length
                      ? ((n = r[t]), [4, i.EncryptUtil.encryptObject(n.dataValues)])
                      : [3, 4];
                  case 2:
                    ((o = a.sent()), (n.dataValues = o), (a.label = 3));
                  case 3:
                    return (t++, [3, 1]);
                  case 4:
                    return [2];
                }
              });
            });
          }),
          this.model.afterBulkCreate(function (e) {
            return n(this, void 0, void 0, function () {
              var t, r, n, o;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    ((t = 0), (r = e), (a.label = 1));
                  case 1:
                    return t < r.length
                      ? ((n = r[t]), [4, i.EncryptUtil.decryptObject(n.dataValues)])
                      : [3, 4];
                  case 2:
                    ((o = a.sent()), (n.dataValues = o), (a.label = 3));
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
          return n(this, void 0, void 0, function () {
            var t;
            return a(this, function (r) {
              switch (r.label) {
                case 0:
                  return [4, this.bulkCreate([e])];
                case 1:
                  return ((t = r.sent()), i.Util.isNull(t) || t.length > 0 ? [2, t[0]] : [2, null]);
              }
            });
          });
        }),
        (e.prototype.upsert = function (e) {
          var t = this;
          return new Promise(function (r, o) {
            return n(t, void 0, void 0, function () {
              var t,
                n = this;
              return a(this, function (a) {
                switch (a.label) {
                  case 0:
                    return ((t = { where: { _id: e._id } }), [4, i.EncryptUtil.encryptOptions(t)]);
                  case 1:
                    return (
                      (t = a.sent()),
                      this.sequelize.sync().then(function () {
                        return n.model
                          .findOne(t)
                          .then(function (t) {
                            if (null != t)
                              return t.updateAttributes(e).then(function (e) {
                                r(e.get({ plain: !0 }));
                              });
                            var a = [];
                            return (
                              a.push(e),
                              n.model.bulkCreate(a).then(function (e) {
                                r(e[0].dataValues);
                              })
                            );
                          })
                          .catch(function (e) {
                            (i.Log.error(e), o(e));
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
          return new Promise(function (r, n) {
            t.sequelize.sync().then(function () {
              return t.model
                .bulkCreate(e)
                .then(function (e) {
                  var t = [];
                  if (i.Util.isNotNull(e))
                    for (var n = 0, a = e; n < a.length; n++) {
                      var o = a[n];
                      t.push(o.dataValues);
                    }
                  r(t);
                })
                .catch(function (e) {
                  (i.Log.error(e), n(e));
                });
            });
          });
        }),
        (e.prototype.findOne = function (e) {
          var t = this;
          return new Promise(function (r, o) {
            return n(t, void 0, void 0, function () {
              var t = this;
              return a(this, function (s) {
                switch (s.label) {
                  case 0:
                    return (i.Util.isNull(e) && (e = {}), [4, i.EncryptUtil.encryptOptions(e)]);
                  case 1:
                    return (
                      (e = s.sent()),
                      this.sequelize.sync().then(function () {
                        return t.model
                          .findOne(e)
                          .then(function (e) {
                            return n(t, void 0, void 0, function () {
                              var t;
                              return a(this, function (n) {
                                switch (n.label) {
                                  case 0:
                                    return i.Util.isNull(e) ? (r(null), [3, 3]) : [3, 1];
                                  case 1:
                                    return [4, i.EncryptUtil.decryptObject(e.dataValues)];
                                  case 2:
                                    ((t = n.sent()), r(t), (n.label = 3));
                                  case 3:
                                    return [2];
                                }
                              });
                            });
                          })
                          .catch(function (e) {
                            (i.Log.error(e), o(e));
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
          return new Promise(function (r, o) {
            return n(t, void 0, void 0, function () {
              var t = this;
              return a(this, function (s) {
                switch (s.label) {
                  case 0:
                    return (i.Util.isNull(e) && (e = {}), [4, i.EncryptUtil.encryptOptions(e)]);
                  case 1:
                    return (
                      (e = s.sent()),
                      this.sequelize.sync().then(function () {
                        return t.model
                          .findAll(e)
                          .then(function (e) {
                            return n(t, void 0, void 0, function () {
                              var t, n, o, s, u, p;
                              return a(this, function (a) {
                                switch (a.label) {
                                  case 0:
                                    return i.Util.isNull(e) ? (r(null), [3, 10]) : [3, 1];
                                  case 1:
                                    ((t = []), (n = 0), (o = e), (a.label = 2));
                                  case 2:
                                    if (!(n < o.length)) return [3, 9];
                                    ((s = o[n]), (a.label = 3));
                                  case 3:
                                    return (
                                      a.trys.push([3, 4, , 8]),
                                      (u = i.EncryptUtil.decryptObject(s.dataValues)),
                                      t.push(u),
                                      [3, 8]
                                    );
                                  case 4:
                                    return (
                                      (p = a.sent()),
                                      i.Util.isNotNull(p) &&
                                      i.Util.isNotNull(p.instance) &&
                                      i.Util.isNotNull(p.instance.masterId)
                                        ? (i.Log.info(
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
                                    return (n++, [3, 2]);
                                  case 9:
                                    (r(t), (a.label = 10));
                                  case 10:
                                    return [2];
                                }
                              });
                            });
                          })
                          .catch(function (e) {
                            (i.Log.error(e), o(e));
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
            i.Util.isEmptyString(t) && (t = e),
            i.Util.isNull(r) && (r = {}),
            this.findAll({ attributes: [[o.Sequelize.fn("MAX", o.Sequelize.col(e)), t]], where: r })
          );
        }),
        (e.prototype.min = function (e, t, r) {
          return (
            i.Util.isEmptyString(t) && (t = e),
            i.Util.isNull(r) && (r = {}),
            this.findAll({ attributes: [[o.Sequelize.fn("MIN", o.Sequelize.col(e)), t]], where: r })
          );
        }),
        (e.prototype.count = function (e) {
          var t = this;
          return new Promise(function (r, o) {
            return n(t, void 0, void 0, function () {
              var t = this;
              return a(this, function (s) {
                switch (s.label) {
                  case 0:
                    return (i.Util.isNull(e) && (e = {}), [4, i.EncryptUtil.encryptOptions(e)]);
                  case 1:
                    return (
                      (e = s.sent()),
                      this.sequelize.sync().then(function () {
                        return t.model
                          .count(e)
                          .then(function (e) {
                            return n(t, void 0, void 0, function () {
                              return a(this, function (t) {
                                return (r(e), [2]);
                              });
                            });
                          })
                          .catch(function (e) {
                            (i.Log.error(e), o(e));
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
          return n(this, void 0, void 0, function () {
            var r;
            return a(this, function (n) {
              switch (n.label) {
                case 0:
                  return (
                    n.trys.push([0, 3, , 4]),
                    i.Util.isNull(t)
                      ? [2, Promise.reject(new Error("Update condition not specified"))]
                      : [4, this.sequelize.sync()]
                  );
                case 1:
                  return (n.sent(), [4, this.model.update(e, t)]);
                case 2:
                  return [2, n.sent()];
                case 3:
                  return ((r = n.sent()), i.Log.error(r), [2, Promise.reject(r)]);
                case 4:
                  return [2];
              }
            });
          });
        }),
        (e.prototype.destroy = function (e) {
          var t = this;
          return new Promise(function (r, o) {
            return n(t, void 0, void 0, function () {
              var t = this;
              return a(this, function (n) {
                switch (n.label) {
                  case 0:
                    return [4, i.EncryptUtil.encryptOptions(e)];
                  case 1:
                    return (
                      (e = n.sent()),
                      this.sequelize.sync().then(function () {
                        return t.model
                          .destroy(e)
                          .then(function (e) {
                            r(e);
                          })
                          .catch(function (e) {
                            (i.Log.error(e), o(e));
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
                  (i.Log.error(e), r(e));
                });
            });
          });
        }),
        (e.prototype.updateTransaction = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r = this;
            return a(this, function (o) {
              return [
                2,
                this.sequelize
                  .transaction(function (i) {
                    return n(r, void 0, void 0, function () {
                      var r, n, i, o, s, u;
                      return a(this, function (a) {
                        switch (a.label) {
                          case 0:
                            ((r = []), (n = {}), (i = 0), (o = e), (a.label = 1));
                          case 1:
                            return i < o.length
                              ? ((s = o[i]), (n[t] = s[t]), [4, this.update(s, { where: n })])
                              : [3, 4];
                          case 2:
                            ((u = a.sent()), r.push(u), (a.label = 3));
                          case 3:
                            return (i++, [3, 1]);
                          case 4:
                            return [2, r];
                        }
                      });
                    });
                  })
                  .catch(function (e) {
                    return (i.Log.error("Transaction error: "), i.Log.error(e), Promise.reject(e));
                  }),
              ];
            });
          });
        }),
        (e.prototype.getDBPassword = function () {
          return "pass";
        }),
        (e.prototype.checkTableExist = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r;
            return a(this, function (n) {
              switch (n.label) {
                case 0:
                  return (
                    (r = "SELECT name FROM sqlite_master WHERE type='table' AND name='" + t + "'"),
                    [4, i.Util.promisifyFunction(e.all.bind(e), r)]
                  );
                case 1:
                  return [2, n.sent()];
              }
            });
          });
        }),
        (e.prototype.getTableInfo = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r;
            return a(this, function (n) {
              switch (n.label) {
                case 0:
                  return (
                    (r = "PRAGMA table_info('" + t + "')"),
                    [4, i.Util.promisifyFunction(e.all.bind(e), r)]
                  );
                case 1:
                  return [2, n.sent()];
              }
            });
          });
        }),
        (e.prototype.getTableIndexInfo = function (e, t) {
          return n(this, void 0, void 0, function () {
            var r;
            return a(this, function (n) {
              switch (n.label) {
                case 0:
                  return (
                    (r = "PRAGMA index_list('" + t + "')"),
                    [4, i.Util.promisifyFunction(e.all.bind(e), r)]
                  );
                case 1:
                  return [2, n.sent()];
              }
            });
          });
        }),
        (e.prototype.executeRawQuery = function (e) {
          return n(this, void 0, void 0, function () {
            var t, r, n, o, s, u;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return ((t = []), [4, this.sequelize.query(e)]);
                case 1:
                  if (((r = (r = a.sent())[0]), !i.Util.isFilledArray(r))) return [3, 5];
                  ((n = 0), (o = r), (a.label = 2));
                case 2:
                  return n < o.length ? ((s = o[n]), [4, i.EncryptUtil.decryptObject(s)]) : [3, 5];
                case 3:
                  ((u = a.sent()), t.push(u), (a.label = 4));
                case 4:
                  return (n++, [3, 2]);
                case 5:
                  return [2, t];
              }
            });
          });
        }),
        (e.prototype.checkColumnExist = function (e) {
          return n(this, void 0, void 0, function () {
            var t, r, n;
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
                    (n = -1),
                    i.Util.isFilledArray(r) &&
                      (n = r.findIndex(function (t) {
                        return t.name === e;
                      })),
                    [2, n > -1]
                  );
              }
            });
          });
        }),
        e
      );
    })();
  t.ModelBase = s;
};
