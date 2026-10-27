// webpack module #934 (from electron_main_process, BA Mobile Connector 8.4.41)
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
          return "order";
        }),
        (t.prototype.getAttributes = function () {
          return {
            _id: { type: s.STRING, required: !0, primaryKey: !0 },
            date: { type: s.INTEGER, required: !1 },
            dueOn: { type: s.INTEGER, required: !1 },
            partyId: { type: s.STRING, required: !1 },
            customId: { type: s.STRING, required: !1 },
            orderType: { type: s.STRING, required: !1 },
            customType: { type: s.STRING, required: !1 },
            total: { type: s.STRING, required: !1 },
            isDeleted: { type: s.BOOLEAN, required: !1 },
            isMailSent: { type: s.BOOLEAN, required: !1 },
            userId: { type: s.STRING, required: !1 },
            userName: { type: s.STRING, required: !1 },
            items: { type: s.ABSTRACT, required: !1 },
            events: { type: s.ABSTRACT, required: !1 },
            companyId: { type: s.STRING, required: !1 },
            partyAddress: { type: s.STRING, required: !1 },
            orderNo: { type: s.STRING, required: !1 },
            status: { type: s.BOOLEAN, required: !1 },
            charges: { type: s.ABSTRACT, required: !1 },
            entryLocation: { type: s.ABSTRACT, required: !1 },
            isOptional: { type: s.BOOLEAN, required: !1 },
            dataVersion: { type: s.INTEGER, required: !1 },
            narration: { type: s.STRING, required: !1 },
            serverUpdatedAt: { type: s.INTEGER, required: !1 },
            tallyUpdatedAt: { type: s.INTEGER, required: !1 },
            updatedAt: { type: s.INTEGER, required: !1 },
            createdAt: { type: s.INTEGER, required: !1 },
            tallyMasterId: { type: s.STRING, required: !1 },
            tallyInsertSuccess: { type: s.BOOLEAN, required: !1 },
            tallyErrorMessage: { type: s.STRING, required: !1 },
            partyMasterId: { type: s.STRING, required: !1 },
            partyGstNo: { type: s.STRING, required: !1 },
            accountLedgerName: { type: s.STRING, required: !1 },
            costCenterName: { type: s.STRING, required: !1 },
            priceLevel: { type: s.STRING, required: !1 },
            voucherClassName: { type: s.STRING, required: !1 },
            orderDetail: { type: s.ABSTRACT, required: !1 },
            dispatchDetail: { type: s.ABSTRACT, required: !1 },
            consigneeDetail: { type: s.ABSTRACT, required: !1 },
            buyerDetail: { type: s.ABSTRACT, required: !1 },
            source: { type: s.TEXT, required: !1 },
            partyStateName: { type: s.STRING, required: !1 },
            placeOfSupply: { type: s.STRING, required: !1 },
            companyGstIn: { type: s.STRING, required: !1 },
            companyGstState: { type: s.STRING, required: !1 },
            orderEntryId: { type: s.STRING, required: !1 },
            orderStatusTag: { type: s.STRING, required: !1 },
            quotationEntryId: { type: s.STRING, required: !1 },
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
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='orders'",
                  function (e, t) {
                    e
                      ? u.Log.error(e)
                      : n.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(orders)", function (e, t) {
                          if (e) u.Log.error(e);
                          else {
                            for (
                              var r = !1,
                                i = !1,
                                o = !1,
                                s = !1,
                                n = !1,
                                p = !1,
                                c = !1,
                                m = !1,
                                l = !1,
                                d = !1,
                                y = !1,
                                b = !1,
                                h = !1,
                                g = !1,
                                S = !1,
                                f = !1,
                                A = !1,
                                N = !1,
                                I = 0,
                                T = t;
                              I < T.length;
                              I++
                            ) {
                              var M = T[I];
                              "total" === M.name && "INTEGER" === M.type
                                ? (r = !0)
                                : "customType" === M.name
                                  ? (i = !0)
                                  : "costCenterName" === M.name
                                    ? (s = !0)
                                    : "accountLedgerName" === M.name
                                      ? (o = !0)
                                      : "priceLevel" === M.name
                                        ? (n = !0)
                                        : "orderDetail" === M.name
                                          ? (p = !0)
                                          : "dispatchDetail" === M.name
                                            ? (c = !0)
                                            : "consigneeDetail" === M.name
                                              ? (m = !0)
                                              : "buyerDetail" === M.name
                                                ? (l = !0)
                                                : "source" === M.name
                                                  ? (d = !0)
                                                  : "voucherClassName" === M.name
                                                    ? (y = !0)
                                                    : "partyStateName" === M.name
                                                      ? (b = !0)
                                                      : "placeOfSupply" === M.name
                                                        ? (h = !0)
                                                        : "companyGstIn" === M.name
                                                          ? (g = !0)
                                                          : "companyGstState" === M.name
                                                            ? (S = !0)
                                                            : "orderEntryId" === M.name
                                                              ? (f = !0)
                                                              : "orderStatusTag" === M.name
                                                                ? (A = !0)
                                                                : "quotationEntryId" === M.name &&
                                                                  (N = !0);
                            }
                            if (!0 === r) {
                              a.exec(
                                "BEGIN TRANSACTION;\n                                        CREATE TABLE `orders_back` (`_id` VARCHAR(255) PRIMARY KEY, `date` DECIMAL, `dueOn` DECIMAL, `partyId` VARCHAR(255), `customId` VARCHAR(255),  `orderType` VARCHAR(255), `customType` VARCHAR(255), `total` VARCHAR(255), `isDeleted` TINYINT(1), `isMailSent` TINYINT(1), `userId` VARCHAR(255),  `userName` VARCHAR(255), `items` , `events` , `companyId` VARCHAR(255), `partyAddress` VARCHAR(255), `orderNo` VARCHAR(255),  `status` TINYINT(1), `charges` , `entryLocation` , `isOptional` TINYINT(1), `dataVersion` INTEGER, `narration` VARCHAR(255),  `serverUpdatedAt` INTEGER, `tallyUpdatedAt` INTEGER, `updatedAt` INTEGER, `createdAt` INTEGER, `tallyMasterId` VARCHAR(255),  `tallyInsertSuccess` TINYINT(1), `tallyErrorMessage` VARCHAR(255), `partyMasterId` VARCHAR(255), `partyGstNo` VARCHAR(255)) ;\n                                        INSERT INTO orders_back SELECT * FROM orders;\n                                        DROP TABLE orders;\n                                        ALTER TABLE orders_back RENAME TO orders;\n                                        COMMIT",
                              );
                            }
                            (!1 === i && a.run("ALTER TABLE orders ADD customType TEXT"),
                              !1 === o && a.run("ALTER TABLE orders ADD accountLedgerName TEXT"),
                              !1 === n && a.run("ALTER TABLE orders ADD priceLevel TEXT"),
                              !1 === p && a.run("ALTER TABLE orders ADD orderDetail ABSTRACT"),
                              !1 === c && a.run("ALTER TABLE orders ADD dispatchDetail ABSTRACT"),
                              !1 === m && a.run("ALTER TABLE orders ADD consigneeDetail ABSTRACT"),
                              !1 === l && a.run("ALTER TABLE orders ADD buyerDetail ABSTRACT"),
                              !1 === s && a.run("ALTER TABLE orders ADD costCenterName TEXT"),
                              !1 === d && a.run("ALTER TABLE orders ADD source TEXT"),
                              !1 === y && a.run("ALTER TABLE orders ADD voucherClassName TEXT"),
                              !1 === b && a.run("ALTER TABLE orders ADD partyStateName TEXT"),
                              !1 === h && a.run("ALTER TABLE orders ADD placeOfSupply TEXT"),
                              !1 === g && a.run("ALTER TABLE orders ADD companyGstIn TEXT"),
                              !1 === S && a.run("ALTER TABLE orders ADD companyGstState TEXT"),
                              !1 === f && a.run("ALTER TABLE orders ADD orderEntryId TEXT"),
                              !1 === A && a.run("ALTER TABLE orders ADD orderStatusTag TEXT"),
                              !1 === N && a.run("ALTER TABLE orders ADD quotationEntryId TEXT"));
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
