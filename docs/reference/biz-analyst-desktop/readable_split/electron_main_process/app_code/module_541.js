// webpack module #541 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(213),
    a = r(59),
    o = r(27),
    s = r(29);
  ((t.GET_ADDED_COMPANIES = "get_added_companies"),
    (t.getAddedCompanies = o.createAliasedAction(t.GET_ADDED_COMPANIES, function (e) {
      return {
        type: t.GET_ADDED_COMPANIES,
        payload: i.getCompanies(i.ADDED_COMPANIES, e).catch(function (e) {
          return { addedCompanyError: s.formatError(e) };
        }),
      };
    })),
    (t.GET_TALLY_COMPANIES = "get_tally_companies"),
    (t.getTallyCompanies = o.createAliasedAction(t.GET_TALLY_COMPANIES, function (e) {
      return {
        type: t.GET_TALLY_COMPANIES,
        payload: i.getCompanies(i.TALLY_COMPANIES, e).catch(function (e) {
          return { tallyCompanyError: s.formatError(e) };
        }),
      };
    })),
    (t.GET_ALL_TALLY_COMPANIES = "get_all_tally_companies"),
    (t.getAllTallyCompanies = o.createAliasedAction(t.GET_ALL_TALLY_COMPANIES, function () {
      return {
        type: t.GET_ALL_TALLY_COMPANIES,
        payload: i.getAllCompanies().catch(function (e) {
          return { tallyCompanyError: s.formatError(e) };
        }),
      };
    })),
    (t.ADD_COMPANY = "add_company"),
    (t.addNewCompany = o.createAliasedAction(t.ADD_COMPANY, function (e, r) {
      return {
        type: t.ADD_COMPANY,
        payload: a.addMultipleCompanies(e, r).catch(function (e) {
          return { addCompanyError: s.formatError(e) };
        }),
      };
    })),
    (t.EDIT_COMPANY = "edit_company"),
    (t.editCompany = o.createAliasedAction(t.EDIT_COMPANY, function (e, r, i) {
      return (
        void 0 === i && (i = !1),
        {
          type: t.EDIT_COMPANY,
          payload: a.updateCompany(e, r, i).catch(function (e) {
            return { editCompanyError: s.formatError(e) };
          }),
        }
      );
    })),
    (t.DELETE_COMPANY = "delete_company"),
    (t.performDeleteCompany = o.createAliasedAction(t.DELETE_COMPANY, function (e, r) {
      return {
        type: t.DELETE_COMPANY,
        payload: a.deleteCompanyAndDirectory(e, r).catch(function (e) {
          return { deleteCompanyError: s.formatError(e) };
        }),
      };
    })),
    (t.DELETE_DATA = "delete_data"),
    (t.performDeleteData = o.createAliasedAction(t.DELETE_DATA, function (e, r, i, o) {
      return {
        type: t.DELETE_DATA,
        payload: a.deleteDataAndDirectory(e, r, i, o).catch(function (e) {
          return { deleteDataError: s.formatError(e) };
        }),
      };
    })),
    (t.SET_FETCHING_COMPANY = "set_fetching_company"),
    (t.setFetchingCompany = o.createAliasedAction(t.SET_FETCHING_COMPANY, function (e) {
      return { type: t.SET_FETCHING_COMPANY, payload: e };
    })),
    (t.UPDATE_LABEL = "update_label"),
    (t.updateSubscriptionLabel = o.createAliasedAction(t.UPDATE_LABEL, function (e, r) {
      return {
        type: t.UPDATE_LABEL,
        payload: a.updateLabel(e, r).catch(function (e) {
          return { updateLabelError: s.formatError(e) };
        }),
      };
    })),
    (t.CLEAR_COMPANY_STATE = "clear_company_state"),
    (t.clearCompanyState = o.createAliasedAction(t.CLEAR_COMPANY_STATE, function () {
      return { type: t.CLEAR_COMPANY_STATE, payload: null };
    })),
    (t.AUTO_REMINDER_SYNC = "auto_reminder_sync"),
    (t.setAutoReminderSync = o.createAliasedAction(t.AUTO_REMINDER_SYNC, function (e) {
      return { type: t.AUTO_REMINDER_SYNC, payload: e };
    })),
    (t.TRIAL_INSTALLATION_COMPLETE = "trial_installation_complete"),
    (t.trialInstallationComplete = o.createAliasedAction(
      t.TRIAL_INSTALLATION_COMPLETE,
      function (e) {
        return { type: t.TRIAL_INSTALLATION_COMPLETE, payload: { company: e } };
      },
    )));
};
