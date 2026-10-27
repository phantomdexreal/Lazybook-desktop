// webpack module #1613 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var n =
    (this && this.__assign) ||
    function () {
      return (n =
        Object.assign ||
        function (e) {
          for (var t, r = 1, n = arguments.length; r < n; r++)
            for (var a in (t = arguments[r]))
              Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
          return e;
        }).apply(this, arguments);
    };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var a = r(69),
    i = r(1614);
  ((t.initialSubscriptionState = {
    subscriptionService: null,
    lastActiveSubscription: null,
    getLastActiveSubscriptionError: null,
    transferUserSubscriptionError: null,
  }),
    (t.default = function (e, r) {
      switch ((void 0 === e && (e = t.initialSubscriptionState), r.type)) {
        case i.GET_SUBSCRIPTION_BY_TALLYLICENSE:
          return a.checkErrorIsNotNull(r, "getLastActiveSubscriptionError")
            ? n({}, e, {
                subscriptionService: i.GET_SUBSCRIPTION_BY_TALLYLICENSE,
                getLastActiveSubscriptionError: r.payload.getLastActiveSubscriptionError,
              })
            : n({}, e, {
                subscriptionService: i.GET_SUBSCRIPTION_BY_TALLYLICENSE,
                lastActiveSubscription: r.payload,
                getLastActiveSubscriptionError: null,
              });
        case i.TRANSFER_SUBSCRIPTION:
          return a.checkErrorIsNotNull(r, "transferUserSubscriptionError")
            ? n({}, e, {
                subscriptionService: i.TRANSFER_SUBSCRIPTION,
                transferUserSubscriptionError: r.payload.transferUserSubscriptionError,
              })
            : n({}, e, {
                subscriptionService: i.TRANSFER_SUBSCRIPTION,
                transferUserSubscriptionError: null,
              });
        case i.CLEAR_STATE:
          return t.initialSubscriptionState;
        default:
          return e;
      }
    }));
};
