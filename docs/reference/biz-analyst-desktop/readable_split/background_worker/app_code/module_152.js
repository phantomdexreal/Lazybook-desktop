// webpack module #152 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var n = r(150),
    a = r(48),
    i = r(24),
    o = r(23);
  ((t.GET_ADDED_COMPANIES = "get_added_companies"),
    (t.getAddedCompanies = i.createAliasedAction(t.GET_ADDED_COMPANIES, function (e) {
      return {
        type: t.GET_ADDED_COMPANIES,
        payload: n.getCompanies(n.ADDED_COMPANIES, e).catch(function (e) {
          return { addedCompanyError: o.formatError(e) };
        }),
      };
    })),
    (t.GET_TALLY_COMPANIES = "get_tally_companies"),
    (t.getTallyCompanies = i.createAliasedAction(t.GET_TALLY_COMPANIES, function (e) {
      return {
        type: t.GET_TALLY_COMPANIES,
        payload: n.getCompanies(n.TALLY_COMPANIES, e).catch(function (e) {
          return { tallyCompanyError: o.formatError(e) };
        }),
      };
    })),
    (t.GET_ALL_TALLY_COMPANIES = "get_all_tally_companies"),
    (t.getAllTallyCompanies = i.createAliasedAction(t.GET_ALL_TALLY_COMPANIES, function () {
      return {
        type: t.GET_ALL_TALLY_COMPANIES,
        payload: n.getAllCompanies().catch(function (e) {
          return { tallyCompanyError: o.formatError(e) };
        }),
      };
    })),
    (t.ADD_COMPANY = "add_company"),
    (t.addNewCompany = i.createAliasedAction(t.ADD_COMPANY, function (e, r) {
      return {
        type: t.ADD_COMPANY,
        payload: a.addMultipleCompanies(e, r).catch(function (e) {
          return { addCompanyError: o.formatError(e) };
        }),
      };
    })),
    (t.EDIT_COMPANY = "edit_company"),
    (t.editCompany = i.createAliasedAction(t.EDIT_COMPANY, function (e, r, n) {
      return (
        void 0 === n && (n = !1),
        {
          type: t.EDIT_COMPANY,
          payload: a.updateCompany(e, r, n).catch(function (e) {
            return { editCompanyError: o.formatError(e) };
          }),
        }
      );
    })),
    (t.DELETE_COMPANY = "delete_company"),
    (t.performDeleteCompany = i.createAliasedAction(t.DELETE_COMPANY, function (e, r) {
      return {
        type: t.DELETE_COMPANY,
        payload: a.deleteCompanyAndDirectory(e, r).catch(function (e) {
          return { deleteCompanyError: o.formatError(e) };
        }),
      };
    })),
    (t.DELETE_DATA = "delete_data"),
    (t.performDeleteData = i.createAliasedAction(t.DELETE_DATA, function (e, r, n, i) {
      return {
        type: t.DELETE_DATA,
        payload: a.deleteDataAndDirectory(e, r, n, i).catch(function (e) {
          return { deleteDataError: o.formatError(e) };
        }),
      };
    })),
    (t.SET_FETCHING_COMPANY = "set_fetching_company"),
    (t.setFetchingCompany = i.createAliasedAction(t.SET_FETCHING_COMPANY, function (e) {
      return { type: t.SET_FETCHING_COMPANY, payload: e };
    })),
    (t.UPDATE_LABEL = "update_label"),
    (t.updateSubscriptionLabel = i.createAliasedAction(t.UPDATE_LABEL, function (e, r) {
      return {
        type: t.UPDATE_LABEL,
        payload: a.updateLabel(e, r).catch(function (e) {
          return { updateLabelError: o.formatError(e) };
        }),
      };
    })),
    (t.CLEAR_COMPANY_STATE = "clear_company_state"),
    (t.clearCompanyState = i.createAliasedAction(t.CLEAR_COMPANY_STATE, function () {
      return { type: t.CLEAR_COMPANY_STATE, payload: null };
    })),
    (t.AUTO_REMINDER_SYNC = "auto_reminder_sync"),
    (t.setAutoReminderSync = i.createAliasedAction(t.AUTO_REMINDER_SYNC, function (e) {
      return { type: t.AUTO_REMINDER_SYNC, payload: e };
    })),
    (t.TRIAL_INSTALLATION_COMPLETE = "trial_installation_complete"),
    (t.trialInstallationComplete = i.createAliasedAction(
      t.TRIAL_INSTALLATION_COMPLETE,
      function (e) {
        return { type: t.TRIAL_INSTALLATION_COMPLETE, payload: { company: e } };
      },
    )));
};
