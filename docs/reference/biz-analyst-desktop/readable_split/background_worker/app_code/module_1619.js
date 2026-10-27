// webpack module #1619 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(35),
    a = r(24);
  ((t.CHECK_AND_SAVE_TALLY_CONFIG = "check_and_save_tally_config"),
    (t.checkAndSaveTallyConfig = a.createAliasedAction(t.CHECK_AND_SAVE_TALLY_CONFIG, function (e) {
      return {
        type: t.CHECK_AND_SAVE_TALLY_CONFIG,
        payload: n.default.checkSaveTallySettings(e).catch(function (e) {
          return { tallyCheckError: e };
        }),
      };
    })),
    (t.TALLY_STATUS = "tally_status"),
    (t.isTallyConnectedAction = a.createAliasedAction(t.TALLY_STATUS, function (e, r) {
      return { type: t.TALLY_STATUS, payload: { isTallyAvailable: e, tallyPingError: r } };
    })));
};
