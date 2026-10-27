// webpack module #1108 (from electron_main_process, BA Mobile Connector 8.4.41)
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
    o = r(541),
    s = r(541);
  ((t.initialCompanyState = {
    companyService: null,
    addedCompanyError: null,
    tallyCompanyError: null,
    addCompanyError: null,
    editCompanyError: null,
    addedSubscriptionCompanies: null,
    tallySubscriptionCompanies: null,
    companyMessage: null,
    deleteCompanyError: null,
    deleteCompanySuccess: null,
    deleteDataError: null,
    deleteDataSuccess: null,
    updateLabelError: null,
    updateLabelSuccess: null,
    isFetchingCompanies: !1,
    trialInstallationComplete: null,
  }),
    (t.default = function (e, r) {
      switch ((void 0 === e && (e = t.initialCompanyState), r.type)) {
        case o.GET_ADDED_COMPANIES:
          return a.checkErrorIsNotNull(r, "addedCompanyError")
            ? i({}, e, {
                companyService: o.GET_ADDED_COMPANIES,
                isFetchingCompanies: !1,
                addedCompanyError: r.payload.addedCompanyError,
              })
            : i({}, e, {
                companyService: o.GET_ADDED_COMPANIES,
                isFetchingCompanies: !1,
                addedSubscriptionCompanies: r.payload,
                addedCompanyError: null,
              });
        case o.GET_TALLY_COMPANIES:
          return a.checkErrorIsNotNull(r, "tallyCompanyError")
            ? i({}, e, {
                companyService: o.GET_TALLY_COMPANIES,
                isFetchingCompanies: !1,
                tallyCompanyError: r.payload.tallyCompanyError,
              })
            : i({}, e, {
                companyService: o.GET_TALLY_COMPANIES,
                isFetchingCompanies: !1,
                tallySubscriptionCompanies: r.payload,
                tallyCompanyError: null,
              });
        case o.GET_ALL_TALLY_COMPANIES:
          return a.checkErrorIsNotNull(r, "tallyCompanyError")
            ? i({}, e, {
                companyService: o.GET_ALL_TALLY_COMPANIES,
                isFetchingCompanies: !1,
                tallyCompanyError: r.payload.tallyCompanyError,
              })
            : i({}, e, {
                companyService: o.GET_ALL_TALLY_COMPANIES,
                isFetchingCompanies: !1,
                tallySubscriptionCompanies: r.payload,
                tallyCompanyError: null,
              });
        case o.ADD_COMPANY:
          return a.checkErrorIsNotNull(r, "addCompanyError")
            ? i({}, e, {
                companyService: o.ADD_COMPANY,
                addCompanyError: r.payload.addCompanyError,
              })
            : i({}, e, {
                companyService: o.ADD_COMPANY,
                companyMessage: r.payload,
                addCompanyError: null,
              });
        case o.EDIT_COMPANY:
          return a.checkErrorIsNotNull(r, "editCompanyError")
            ? i({}, e, {
                companyService: o.EDIT_COMPANY,
                editCompanyError: r.payload.editCompanyError,
              })
            : i({}, e, {
                companyService: o.EDIT_COMPANY,
                companyMessage: r.payload,
                editCompanyError: null,
              });
        case o.DELETE_COMPANY:
          return a.checkErrorIsNotNull(r, "deleteCompanyError")
            ? i({}, e, {
                companyService: o.DELETE_COMPANY,
                deleteCompanyError: r.payload.deleteCompanyError,
              })
            : i({}, e, {
                companyService: o.DELETE_COMPANY,
                deleteCompanySuccess: r.payload,
                deleteCompanyError: null,
              });
        case o.DELETE_DATA:
          return a.checkErrorIsNotNull(r, "deleteDataError")
            ? i({}, e, {
                companyService: o.DELETE_DATA,
                deleteDataError: r.payload.deleteDataError,
              })
            : i({}, e, {
                companyService: o.DELETE_DATA,
                deleteDataSuccess: r.payload,
                deleteDataError: null,
              });
        case s.UPDATE_LABEL:
          return a.checkErrorIsNotNull(r, "updateLabelError")
            ? i({}, e, {
                companyService: s.UPDATE_LABEL,
                updateLabelError: r.payload.updateLabelError,
              })
            : i({}, e, {
                companyService: s.UPDATE_LABEL,
                updateLabelSuccess: r.payload,
                updateLabelError: null,
              });
        case o.SET_FETCHING_COMPANY:
          return i({}, e, { isFetchingCompanies: r.payload });
        case o.AUTO_REMINDER_SYNC:
          return i({}, e, { isAutoReminderSyncActive: r.payload });
        case o.CLEAR_COMPANY_STATE:
          return i({}, e, { companyService: null });
        case o.TRIAL_INSTALLATION_COMPLETE:
          return i({}, e, {
            companyService: o.TRIAL_INSTALLATION_COMPLETE,
            trialInstallationComplete: r.payload,
          });
        default:
          return e;
      }
    }));
};
