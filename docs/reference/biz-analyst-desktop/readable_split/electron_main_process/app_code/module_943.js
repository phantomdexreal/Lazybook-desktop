// webpack module #943 (from electron_main_process, BA Mobile Connector 8.4.41)
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
      });
  Object.defineProperty(t, "__esModule", { value: !0 });
  var o = r(22),
    s = r(17),
    n = r(10),
    u = r(2),
    p = r(18),
    c = r(34),
    m = (function (e) {
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
            _id: { type: s.STRING, required: !0, primaryKey: !0 },
            date: { type: s.INTEGER, required: !1 },
            partyId: { type: s.STRING, required: !1 },
            bankName: { type: s.STRING, required: !1 },
            mode: { type: s.STRING, required: !1 },
            customId: { type: s.STRING, required: !1 },
            type: { type: s.STRING, required: !1 },
            customType: { type: s.STRING, required: !1 },
            total: { type: s.STRING, required: !1 },
            userId: { type: s.STRING, required: !1 },
            userName: { type: s.STRING, required: !1 },
            events: { type: s.ABSTRACT, required: !1 },
            partyAddress: { type: s.STRING, required: !1 },
            status: { type: s.STRING, required: !1 },
            companyId: { type: s.STRING, required: !1 },
            narration: { type: s.STRING, required: !1 },
            isOptional: { type: s.BOOLEAN, required: !1 },
            isOrderSelected: { type: s.BOOLEAN, required: !1 },
            serverUpdatedAt: { type: s.INTEGER, required: !1 },
            tallyUpdatedAt: { type: s.INTEGER, required: !1 },
            updatedAt: { type: s.INTEGER, required: !1 },
            createdAt: { type: s.INTEGER, required: !1 },
            tallyMasterId: { type: s.STRING, required: !1 },
            tallyInsertSuccess: { type: s.BOOLEAN, required: !1 },
            tallyErrorMessage: { type: s.STRING, required: !1 },
            bankMasterId: { type: s.STRING, required: !1 },
            dataVersion: { type: s.INTEGER, required: !1 },
            isDeleted: { type: s.BOOLEAN, required: !1 },
            isMailSent: { type: s.BOOLEAN, required: !1 },
            partyMasterId: { type: s.STRING, required: !1 },
            billEntries: { type: s.ABSTRACT, required: !1 },
            bankAllocation: { type: s.ABSTRACT, required: !1 },
            costCenterName: { type: s.STRING, required: !1 },
          };
        }),
        (t.prototype.runMigration = function () {
          var e = u.PathUtil.getDbPath(this.userId, this.company),
            t = new c.SQLConfig();
          o.open(e, "r", function (r, i) {
            if (r && "ENOENT" == r.code);
            else {
              var a = t.connect(e);
              a.serialize(function () {
                a.all(
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='transactions'",
                  function (e, t) {
                    e
                      ? u.Log.error(e)
                      : n.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(transactions)", function (e, t) {
                          if (e) u.Log.error(e);
                          else {
                            for (
                              var r =
                                  "CREATE TABLE `transactions_back` (`_id` VARCHAR(255) PRIMARY KEY, `date` DECIMAL, `partyId` VARCHAR(255), `bankName` VARCHAR(255),`mode` VARCHAR(255), `customId` VARCHAR(255), `type` VARCHAR(255), `customType` VARCHAR(255), `total` VARCHAR(255), `userId` VARCHAR(255), `userName` VARCHAR(255),`events` , `partyAddress` VARCHAR(255), `status` VARCHAR(255), `companyId` VARCHAR(255), `narration` VARCHAR(255), `isOptional` TINYINT(1),`isOrderSelected` TINYINT(1), `serverUpdatedAt` INTEGER, `tallyUpdatedAt` INTEGER, `updatedAt` INTEGER, `createdAt` INTEGER, `tallyMasterId` VARCHAR(255),`tallyInsertSuccess` TINYINT(1), `tallyErrorMessage` VARCHAR(255), `bankMasterId` VARCHAR(255), `dataVersion` INTEGER, `isDeleted` TINYINT(1), `isMailSent` TINYINT(1), `partyMasterId` VARCHAR(255))",
                                i = !1,
                                o = !1,
                                s = !1,
                                n = !1,
                                p = !1,
                                c = !1,
                                m = 0,
                                l = t;
                              m < l.length;
                              m++
                            ) {
                              var d = l[m];
                              "dataVersion" !== d.name || "VARCHAR(255)" !== d.type
                                ? "total" !== d.name || "INTEGER" !== d.type
                                  ? "customType" !== d.name
                                    ? "billEntries" !== d.name
                                      ? "bankAllocation" !== d.name
                                        ? "costCenterName" === d.name && (c = !0)
                                        : (p = !0)
                                      : (n = !0)
                                    : (s = !0)
                                  : (o = !0)
                                : (i = !0);
                            }
                            if (!0 === i) {
                              var y =
                                "BEGIN TRANSACTION;\n                                            " +
                                r +
                                ";\n                                            INSERT INTO transactions_back SELECT * FROM transactions;\n                                            DROP TABLE transactions;\n                                            ALTER TABLE transactions_back RENAME TO transactions;\n                                            COMMIT";
                              a.exec(y);
                            }
                            if (!0 === o) {
                              y =
                                "BEGIN TRANSACTION;\n                                            " +
                                r +
                                ";\n                                            INSERT INTO transactions_back SELECT * FROM transactions;\n                                            DROP TABLE transactions;\n                                            ALTER TABLE transactions_back RENAME TO transactions;\n                                            COMMIT";
                              a.exec(y);
                            }
                            (!1 === s && a.run("ALTER TABLE transactions ADD customType TEXT"),
                              !1 === n &&
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
  t.default = m;
};
