// webpack module #2606 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var i =
    (this && this.__assign) ||
    function () {
      return (i =
        Object.assign ||
        function (e) {
          for (var t, r = 1, i = arguments.length; r < i; r++)
            for (var a in (t = arguments[r]))
              Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
          return e;
        }).apply(this, arguments);
    };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var a = r(69),
    o = r(2607);
  ((t.initialSubscriptionState = {
    subscriptionService: null,
    lastActiveSubscription: null,
    getLastActiveSubscriptionError: null,
    transferUserSubscriptionError: null,
  }),
    (t.default = function (e, r) {
      switch ((void 0 === e && (e = t.initialSubscriptionState), r.type)) {
        case o.GET_SUBSCRIPTION_BY_TALLYLICENSE:
          return a.checkErrorIsNotNull(r, "getLastActiveSubscriptionError")
            ? i({}, e, {
                subscriptionService: o.GET_SUBSCRIPTION_BY_TALLYLICENSE,
                getLastActiveSubscriptionError: r.payload.getLastActiveSubscriptionError,
              })
            : i({}, e, {
                subscriptionService: o.GET_SUBSCRIPTION_BY_TALLYLICENSE,
                lastActiveSubscription: r.payload,
                getLastActiveSubscriptionError: null,
              });
        case o.TRANSFER_SUBSCRIPTION:
          return a.checkErrorIsNotNull(r, "transferUserSubscriptionError")
            ? i({}, e, {
                subscriptionService: o.TRANSFER_SUBSCRIPTION,
                transferUserSubscriptionError: r.payload.transferUserSubscriptionError,
              })
            : i({}, e, {
                subscriptionService: o.TRANSFER_SUBSCRIPTION,
                transferUserSubscriptionError: null,
              });
        case o.CLEAR_STATE:
          return t.initialSubscriptionState;
        default:
          return e;
      }
    }));
};
