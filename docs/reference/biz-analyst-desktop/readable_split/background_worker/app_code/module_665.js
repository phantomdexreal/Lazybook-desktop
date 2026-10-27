// webpack module #665 (from background_worker, BA Mobile Connector 8.4.41)
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
      });
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(27),
    o = r(13),
    s = r(11),
    u = r(0),
    p = r(14),
    c = r(32),
    l = (function (e) {
      function t(t, r) {
        return e.call(this, t, r) || this;
      }
      return (
        a(t, e),
        (t.prototype.getModelName = function () {
          return "transactions";
        }),
        (t.prototype.getAttributes = function () {
          return {
            _id: { type: o.STRING, required: !0, primaryKey: !0 },
            date: { type: o.INTEGER, required: !1 },
            partyId: { type: o.STRING, required: !1 },
            bankName: { type: o.STRING, required: !1 },
            mode: { type: o.STRING, required: !1 },
            customId: { type: o.STRING, required: !1 },
            type: { type: o.STRING, required: !1 },
            customType: { type: o.STRING, required: !1 },
            total: { type: o.STRING, required: !1 },
            userId: { type: o.STRING, required: !1 },
            userName: { type: o.STRING, required: !1 },
            events: { type: o.ABSTRACT, required: !1 },
            partyAddress: { type: o.STRING, required: !1 },
            status: { type: o.STRING, required: !1 },
            companyId: { type: o.STRING, required: !1 },
            narration: { type: o.STRING, required: !1 },
            isOptional: { type: o.BOOLEAN, required: !1 },
            isOrderSelected: { type: o.BOOLEAN, required: !1 },
            serverUpdatedAt: { type: o.INTEGER, required: !1 },
            tallyUpdatedAt: { type: o.INTEGER, required: !1 },
            updatedAt: { type: o.INTEGER, required: !1 },
            createdAt: { type: o.INTEGER, required: !1 },
            tallyMasterId: { type: o.STRING, required: !1 },
            tallyInsertSuccess: { type: o.BOOLEAN, required: !1 },
            tallyErrorMessage: { type: o.STRING, required: !1 },
            bankMasterId: { type: o.STRING, required: !1 },
            dataVersion: { type: o.INTEGER, required: !1 },
            isDeleted: { type: o.BOOLEAN, required: !1 },
            isMailSent: { type: o.BOOLEAN, required: !1 },
            partyMasterId: { type: o.STRING, required: !1 },
            billEntries: { type: o.ABSTRACT, required: !1 },
            bankAllocation: { type: o.ABSTRACT, required: !1 },
            costCenterName: { type: o.STRING, required: !1 },
          };
        }),
        (t.prototype.runMigration = function () {
          var e = u.PathUtil.getDbPath(this.userId, this.company),
            t = new c.SQLConfig();
          i.open(e, "r", function (r, n) {
            if (r && "ENOENT" == r.code);
            else {
              var a = t.connect(e);
              a.serialize(function () {
                a.all(
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='transactions'",
                  function (e, t) {
                    e
                      ? u.Log.error(e)
                      : s.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(transactions)", function (e, t) {
                          if (e) u.Log.error(e);
                          else {
                            for (
                              var r =
                                  "CREATE TABLE `transactions_back` (`_id` VARCHAR(255) PRIMARY KEY, `date` DECIMAL, `partyId` VARCHAR(255), `bankName` VARCHAR(255),`mode` VARCHAR(255), `customId` VARCHAR(255), `type` VARCHAR(255), `customType` VARCHAR(255), `total` VARCHAR(255), `userId` VARCHAR(255), `userName` VARCHAR(255),`events` , `partyAddress` VARCHAR(255), `status` VARCHAR(255), `companyId` VARCHAR(255), `narration` VARCHAR(255), `isOptional` TINYINT(1),`isOrderSelected` TINYINT(1), `serverUpdatedAt` INTEGER, `tallyUpdatedAt` INTEGER, `updatedAt` INTEGER, `createdAt` INTEGER, `tallyMasterId` VARCHAR(255),`tallyInsertSuccess` TINYINT(1), `tallyErrorMessage` VARCHAR(255), `bankMasterId` VARCHAR(255), `dataVersion` INTEGER, `isDeleted` TINYINT(1), `isMailSent` TINYINT(1), `partyMasterId` VARCHAR(255))",
                                n = !1,
                                i = !1,
                                o = !1,
                                s = !1,
                                p = !1,
                                c = !1,
                                l = 0,
                                m = t;
                              l < m.length;
                              l++
                            ) {
                              var d = m[l];
                              "dataVersion" !== d.name || "VARCHAR(255)" !== d.type
                                ? "total" !== d.name || "INTEGER" !== d.type
                                  ? "customType" !== d.name
                                    ? "billEntries" !== d.name
                                      ? "bankAllocation" !== d.name
                                        ? "costCenterName" === d.name && (c = !0)
                                        : (p = !0)
                                      : (s = !0)
                                    : (o = !0)
                                  : (i = !0)
                                : (n = !0);
                            }
                            if (!0 === n) {
                              var y =
                                "BEGIN TRANSACTION;\n                                            " +
                                r +
                                ";\n                                            INSERT INTO transactions_back SELECT * FROM transactions;\n                                            DROP TABLE transactions;\n                                            ALTER TABLE transactions_back RENAME TO transactions;\n                                            COMMIT";
                              a.exec(y);
                            }
                            if (!0 === i) {
                              y =
                                "BEGIN TRANSACTION;\n                                            " +
                                r +
                                ";\n                                            INSERT INTO transactions_back SELECT * FROM transactions;\n                                            DROP TABLE transactions;\n                                            ALTER TABLE transactions_back RENAME TO transactions;\n                                            COMMIT";
                              a.exec(y);
                            }
                            (!1 === o && a.run("ALTER TABLE transactions ADD customType TEXT"),
                              !1 === s &&
                                a.run("ALTER TABLE transactions ADD billEntries ABSTRACT"),
                              !1 === p &&
                                a.run("ALTER TABLE transactions ADD bankAllocation ABSTRACT"),
                              !1 === c &&
                                a.run("ALTER TABLE transactions ADD costCenterName TEXT"));
                          }
                        });
                  },
                );
              });
            }
          });
        }),
        t
      );
    })(p.ModelBase);
  t.default = l;
};
