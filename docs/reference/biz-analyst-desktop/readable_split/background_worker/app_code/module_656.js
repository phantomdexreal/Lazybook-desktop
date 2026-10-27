// webpack module #656 (from background_worker, BA Mobile Connector 8.4.41)
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
          return "order";
        }),
        (t.prototype.getAttributes = function () {
          return {
            _id: { type: o.STRING, required: !0, primaryKey: !0 },
            date: { type: o.INTEGER, required: !1 },
            dueOn: { type: o.INTEGER, required: !1 },
            partyId: { type: o.STRING, required: !1 },
            customId: { type: o.STRING, required: !1 },
            orderType: { type: o.STRING, required: !1 },
            customType: { type: o.STRING, required: !1 },
            total: { type: o.STRING, required: !1 },
            isDeleted: { type: o.BOOLEAN, required: !1 },
            isMailSent: { type: o.BOOLEAN, required: !1 },
            userId: { type: o.STRING, required: !1 },
            userName: { type: o.STRING, required: !1 },
            items: { type: o.ABSTRACT, required: !1 },
            events: { type: o.ABSTRACT, required: !1 },
            companyId: { type: o.STRING, required: !1 },
            partyAddress: { type: o.STRING, required: !1 },
            orderNo: { type: o.STRING, required: !1 },
            status: { type: o.BOOLEAN, required: !1 },
            charges: { type: o.ABSTRACT, required: !1 },
            entryLocation: { type: o.ABSTRACT, required: !1 },
            isOptional: { type: o.BOOLEAN, required: !1 },
            dataVersion: { type: o.INTEGER, required: !1 },
            narration: { type: o.STRING, required: !1 },
            serverUpdatedAt: { type: o.INTEGER, required: !1 },
            tallyUpdatedAt: { type: o.INTEGER, required: !1 },
            updatedAt: { type: o.INTEGER, required: !1 },
            createdAt: { type: o.INTEGER, required: !1 },
            tallyMasterId: { type: o.STRING, required: !1 },
            tallyInsertSuccess: { type: o.BOOLEAN, required: !1 },
            tallyErrorMessage: { type: o.STRING, required: !1 },
            partyMasterId: { type: o.STRING, required: !1 },
            partyGstNo: { type: o.STRING, required: !1 },
            accountLedgerName: { type: o.STRING, required: !1 },
            costCenterName: { type: o.STRING, required: !1 },
            priceLevel: { type: o.STRING, required: !1 },
            voucherClassName: { type: o.STRING, required: !1 },
            orderDetail: { type: o.ABSTRACT, required: !1 },
            dispatchDetail: { type: o.ABSTRACT, required: !1 },
            consigneeDetail: { type: o.ABSTRACT, required: !1 },
            buyerDetail: { type: o.ABSTRACT, required: !1 },
            source: { type: o.TEXT, required: !1 },
            partyStateName: { type: o.STRING, required: !1 },
            placeOfSupply: { type: o.STRING, required: !1 },
            companyGstIn: { type: o.STRING, required: !1 },
            companyGstState: { type: o.STRING, required: !1 },
            orderEntryId: { type: o.STRING, required: !1 },
            orderStatusTag: { type: o.STRING, required: !1 },
            quotationEntryId: { type: o.STRING, required: !1 },
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
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='orders'",
                  function (e, t) {
                    e
                      ? u.Log.error(e)
                      : s.isNotNull(t) &&
                        t.length > 0 &&
                        a.all("PRAGMA table_info(orders)", function (e, t) {
                          if (e) u.Log.error(e);
                          else {
                            for (
                              var r = !1,
                                n = !1,
                                i = !1,
                                o = !1,
                                s = !1,
                                p = !1,
                                c = !1,
                                l = !1,
                                m = !1,
                                d = !1,
                                y = !1,
                                b = !1,
                                h = !1,
                                f = !1,
                                g = !1,
                                M = !1,
                                S = !1,
                                A = !1,
                                O = 0,
                                N = t;
                              O < N.length;
                              O++
                            ) {
                              var v = N[O];
                              "total" === v.name && "INTEGER" === v.type
                                ? (r = !0)
                                : "customType" === v.name
                                  ? (n = !0)
                                  : "costCenterName" === v.name
                                    ? (o = !0)
                                    : "accountLedgerName" === v.name
                                      ? (i = !0)
                                      : "priceLevel" === v.name
                                        ? (s = !0)
                                        : "orderDetail" === v.name
                                          ? (p = !0)
                                          : "dispatchDetail" === v.name
                                            ? (c = !0)
                                            : "consigneeDetail" === v.name
                                              ? (l = !0)
                                              : "buyerDetail" === v.name
                                                ? (m = !0)
                                                : "source" === v.name
                                                  ? (d = !0)
                                                  : "voucherClassName" === v.name
                                                    ? (y = !0)
                                                    : "partyStateName" === v.name
                                                      ? (b = !0)
                                                      : "placeOfSupply" === v.name
                                                        ? (h = !0)
                                                        : "companyGstIn" === v.name
                                                          ? (f = !0)
                                                          : "companyGstState" === v.name
                                                            ? (g = !0)
                                                            : "orderEntryId" === v.name
                                                              ? (M = !0)
                                                              : "orderStatusTag" === v.name
                                                                ? (S = !0)
                                                                : "quotationEntryId" === v.name &&
                                                                  (A = !0);
                            }
                            if (!0 === r) {
                              a.exec(
                                "BEGIN TRANSACTION;\n                                        CREATE TABLE `orders_back` (`_id` VARCHAR(255) PRIMARY KEY, `date` DECIMAL, `dueOn` DECIMAL, `partyId` VARCHAR(255), `customId` VARCHAR(255),  `orderType` VARCHAR(255), `customType` VARCHAR(255), `total` VARCHAR(255), `isDeleted` TINYINT(1), `isMailSent` TINYINT(1), `userId` VARCHAR(255),  `userName` VARCHAR(255), `items` , `events` , `companyId` VARCHAR(255), `partyAddress` VARCHAR(255), `orderNo` VARCHAR(255),  `status` TINYINT(1), `charges` , `entryLocation` , `isOptional` TINYINT(1), `dataVersion` INTEGER, `narration` VARCHAR(255),  `serverUpdatedAt` INTEGER, `tallyUpdatedAt` INTEGER, `updatedAt` INTEGER, `createdAt` INTEGER, `tallyMasterId` VARCHAR(255),  `tallyInsertSuccess` TINYINT(1), `tallyErrorMessage` VARCHAR(255), `partyMasterId` VARCHAR(255), `partyGstNo` VARCHAR(255)) ;\n                                        INSERT INTO orders_back SELECT * FROM orders;\n                                        DROP TABLE orders;\n                                        ALTER TABLE orders_back RENAME TO orders;\n                                        COMMIT",
                              );
                            }
                            (!1 === n && a.run("ALTER TABLE orders ADD customType TEXT"),
                              !1 === i && a.run("ALTER TABLE orders ADD accountLedgerName TEXT"),
                              !1 === s && a.run("ALTER TABLE orders ADD priceLevel TEXT"),
                              !1 === p && a.run("ALTER TABLE orders ADD orderDetail ABSTRACT"),
                              !1 === c && a.run("ALTER TABLE orders ADD dispatchDetail ABSTRACT"),
                              !1 === l && a.run("ALTER TABLE orders ADD consigneeDetail ABSTRACT"),
                              !1 === m && a.run("ALTER TABLE orders ADD buyerDetail ABSTRACT"),
                              !1 === o && a.run("ALTER TABLE orders ADD costCenterName TEXT"),
                              !1 === d && a.run("ALTER TABLE orders ADD source TEXT"),
                              !1 === y && a.run("ALTER TABLE orders ADD voucherClassName TEXT"),
                              !1 === b && a.run("ALTER TABLE orders ADD partyStateName TEXT"),
                              !1 === h && a.run("ALTER TABLE orders ADD placeOfSupply TEXT"),
                              !1 === f && a.run("ALTER TABLE orders ADD companyGstIn TEXT"),
                              !1 === g && a.run("ALTER TABLE orders ADD companyGstState TEXT"),
                              !1 === M && a.run("ALTER TABLE orders ADD orderEntryId TEXT"),
                              !1 === S && a.run("ALTER TABLE orders ADD orderStatusTag TEXT"),
                              !1 === A && a.run("ALTER TABLE orders ADD quotationEntryId TEXT"));
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
