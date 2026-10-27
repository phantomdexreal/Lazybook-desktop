// webpack module #936 (from electron_main_process, BA Mobile Connector 8.4.41)
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
  var o = r(17),
    s = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this;
      }
      return (
        a(t, e),
        (t.prototype.getModelName = function () {
          return "stockCategory";
        }),
        (t.prototype.getAttributes = function () {
          return {
            name: { type: o.STRING, required: !1 },
            parentGroup: { type: o.STRING, required: !1 },
            _id: { type: o.UUID, primaryKey: !0, defaultValue: o.UUIDV4 },
            tallyUpdatedAt: { type: o.INTEGER, required: !0 },
            uptoDate: { type: o.BOOLEAN, required: !0 },
            masterId: { type: o.INTEGER, required: !0 },
            alterId: { type: o.INTEGER, required: !0 },
            oldName: { type: o.STRING, required: !0 },
            isDeleted: { type: o.BOOLEAN, required: !0 },
          };
        }),
        (t.prototype.runMigration = function () {}),
        t
      );
    })(r(18).ModelBase);
  t.default = s;
};
