// webpack module #1614 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(24),
    a = r(23),
    i = r(48);
  ((t.GET_SUBSCRIPTION_BY_TALLYLICENSE = "get_subscription_by_tallylicence"),
    (t.getSubscriptionByTallylicense = n.createAliasedAction(
      t.GET_SUBSCRIPTION_BY_TALLYLICENSE,
      function (e) {
        return {
          type: t.GET_SUBSCRIPTION_BY_TALLYLICENSE,
          payload: i.getLastActiveSubscription(e).catch(function (e) {
            return { getLastActiveSubscriptionError: a.formatError(e) };
          }),
        };
      },
    )),
    (t.TRANSFER_SUBSCRIPTION = "transfer_subscription"),
    (t.transferSubscription = n.createAliasedAction(t.TRANSFER_SUBSCRIPTION, function (e, r, n) {
      return {
        type: t.TRANSFER_SUBSCRIPTION,
        payload: i.transferUserSubscription(e, r, n).catch(function (e) {
          return { transferUserSubscriptionError: a.formatError(e) };
        }),
      };
    })),
    (t.CLEAR_STATE = "clear_state"),
    (t.clearSubscriptionState = n.createAliasedAction(t.CLEAR_STATE, function () {
      return { type: t.CLEAR_STATE, payload: null };
    })));
};
