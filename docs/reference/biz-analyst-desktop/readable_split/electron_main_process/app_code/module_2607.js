// webpack module #2607 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(27),
    a = r(29),
    o = r(59);
  ((t.GET_SUBSCRIPTION_BY_TALLYLICENSE = "get_subscription_by_tallylicence"),
    (t.getSubscriptionByTallylicense = i.createAliasedAction(
      t.GET_SUBSCRIPTION_BY_TALLYLICENSE,
      function (e) {
        return {
          type: t.GET_SUBSCRIPTION_BY_TALLYLICENSE,
          payload: o.getLastActiveSubscription(e).catch(function (e) {
            return { getLastActiveSubscriptionError: a.formatError(e) };
          }),
        };
      },
    )),
    (t.TRANSFER_SUBSCRIPTION = "transfer_subscription"),
    (t.transferSubscription = i.createAliasedAction(t.TRANSFER_SUBSCRIPTION, function (e, r, i) {
      return {
        type: t.TRANSFER_SUBSCRIPTION,
        payload: o.transferUserSubscription(e, r, i).catch(function (e) {
          return { transferUserSubscriptionError: a.formatError(e) };
        }),
      };
    })),
    (t.CLEAR_STATE = "clear_state"),
    (t.clearSubscriptionState = i.createAliasedAction(t.CLEAR_STATE, function () {
      return { type: t.CLEAR_STATE, payload: null };
    })));
};
