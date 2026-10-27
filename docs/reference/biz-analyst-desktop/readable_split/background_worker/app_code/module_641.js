// webpack module #641 (from background_worker, BA Mobile Connector 8.4.41)
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
  var i = r(13),
    o = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        a(t, e),
        (t.prototype.getModelName = function () {
          return "currency";
        }),
        (t.prototype.getAttributes = function () {
          return {
            _id: { type: i.UUID, primaryKey: !0, defaultValue: i.UUIDV4 },
            name: { type: i.STRING, required: !1 },
            tallyUpdatedAt: { type: i.INTEGER, required: !0 },
            uptoDate: { type: i.BOOLEAN, required: !0 },
            masterId: { type: i.INTEGER, required: !0 },
            alterId: { type: i.INTEGER, required: !0 },
            oldName: { type: i.STRING, required: !0 },
            isDeleted: { type: i.BOOLEAN, required: !0 },
          };
        }),
        (t.prototype.runMigration = function () {}),
        t
      );
    })(r(14).ModelBase);
  t.default = o;
};
