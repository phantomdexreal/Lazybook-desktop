// webpack module #1594 (from background_worker, BA Mobile Connector 8.4.41)
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
    i = r(152),
    o = r(152);
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
        case i.GET_ADDED_COMPANIES:
          return a.checkErrorIsNotNull(r, "addedCompanyError")
            ? n({}, e, {
                companyService: i.GET_ADDED_COMPANIES,
                isFetchingCompanies: !1,
                addedCompanyError: r.payload.addedCompanyError,
              })
            : n({}, e, {
                companyService: i.GET_ADDED_COMPANIES,
                isFetchingCompanies: !1,
                addedSubscriptionCompanies: r.payload,
                addedCompanyError: null,
              });
        case i.GET_TALLY_COMPANIES:
          return a.checkErrorIsNotNull(r, "tallyCompanyError")
            ? n({}, e, {
                companyService: i.GET_TALLY_COMPANIES,
                isFetchingCompanies: !1,
                tallyCompanyError: r.payload.tallyCompanyError,
              })
            : n({}, e, {
                companyService: i.GET_TALLY_COMPANIES,
                isFetchingCompanies: !1,
                tallySubscriptionCompanies: r.payload,
                tallyCompanyError: null,
              });
        case i.GET_ALL_TALLY_COMPANIES:
          return a.checkErrorIsNotNull(r, "tallyCompanyError")
            ? n({}, e, {
                companyService: i.GET_ALL_TALLY_COMPANIES,
                isFetchingCompanies: !1,
                tallyCompanyError: r.payload.tallyCompanyError,
              })
            : n({}, e, {
                companyService: i.GET_ALL_TALLY_COMPANIES,
                isFetchingCompanies: !1,
                tallySubscriptionCompanies: r.payload,
                tallyCompanyError: null,
              });
        case i.ADD_COMPANY:
          return a.checkErrorIsNotNull(r, "addCompanyError")
            ? n({}, e, {
                companyService: i.ADD_COMPANY,
                addCompanyError: r.payload.addCompanyError,
              })
            : n({}, e, {
                companyService: i.ADD_COMPANY,
                companyMessage: r.payload,
                addCompanyError: null,
              });
        case i.EDIT_COMPANY:
          return a.checkErrorIsNotNull(r, "editCompanyError")
            ? n({}, e, {
                companyService: i.EDIT_COMPANY,
                editCompanyError: r.payload.editCompanyError,
              })
            : n({}, e, {
                companyService: i.EDIT_COMPANY,
                companyMessage: r.payload,
                editCompanyError: null,
              });
        case i.DELETE_COMPANY:
          return a.checkErrorIsNotNull(r, "deleteCompanyError")
            ? n({}, e, {
                companyService: i.DELETE_COMPANY,
                deleteCompanyError: r.payload.deleteCompanyError,
              })
            : n({}, e, {
                companyService: i.DELETE_COMPANY,
                deleteCompanySuccess: r.payload,
                deleteCompanyError: null,
              });
        case i.DELETE_DATA:
          return a.checkErrorIsNotNull(r, "deleteDataError")
            ? n({}, e, {
                companyService: i.DELETE_DATA,
                deleteDataError: r.payload.deleteDataError,
              })
            : n({}, e, {
                companyService: i.DELETE_DATA,
                deleteDataSuccess: r.payload,
                deleteDataError: null,
              });
        case o.UPDATE_LABEL:
          return a.checkErrorIsNotNull(r, "updateLabelError")
            ? n({}, e, {
                companyService: o.UPDATE_LABEL,
                updateLabelError: r.payload.updateLabelError,
              })
            : n({}, e, {
                companyService: o.UPDATE_LABEL,
                updateLabelSuccess: r.payload,
                updateLabelError: null,
              });
        case i.SET_FETCHING_COMPANY:
          return n({}, e, { isFetchingCompanies: r.payload });
        case i.AUTO_REMINDER_SYNC:
          return n({}, e, { isAutoReminderSyncActive: r.payload });
        case i.CLEAR_COMPANY_STATE:
          return n({}, e, { companyService: null });
        case i.TRIAL_INSTALLATION_COMPLETE:
          return n({}, e, {
            companyService: i.TRIAL_INSTALLATION_COMPLETE,
            trialInstallationComplete: r.payload,
          });
        default:
          return e;
      }
    }));
};
