// webpack module #85 (from background_worker, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  var n =
      (this && this.__awaiter) ||
      function (e, t, r, n) {
        return new (r || (r = Promise))(function (a, i) {
          function o(e) {
            try {
              u(n.next(e));
            } catch (e) {
              i(e);
            }
          }
          function s(e) {
            try {
              u(n.throw(e));
            } catch (e) {
              i(e);
            }
          }
          function u(e) {
            e.done
              ? a(e.value)
              : new r(function (t) {
                  t(e.value);
                }).then(o, s);
          }
          u((n = n.apply(e, t || [])).next());
        });
      },
    a =
      (this && this.__generator) ||
      function (e, t) {
        var r,
          n,
          a,
          i,
          o = {
            label: 0,
            sent: function () {
              if (1 & a[0]) throw a[1];
              return a[1];
            },
            trys: [],
            ops: [],
          };
        return (
          (i = { next: s(0), throw: s(1), return: s(2) }),
          "function" == typeof Symbol &&
            (i[Symbol.iterator] = function () {
              return this;
            }),
          i
        );
        function s(i) {
          return function (s) {
            return (function (i) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; o;)
                try {
                  if (
                    ((r = 1),
                    n &&
                      (a =
                        2 & i[0]
                          ? n.return
                          : i[0]
                            ? n.throw || ((a = n.return) && a.call(n), 0)
                            : n.next) &&
                      !(a = a.call(n, i[1])).done)
                  )
                    return a;
                  switch (((n = 0), a && (i = [2 & i[0], a.value]), i[0])) {
                    case 0:
                    case 1:
                      a = i;
                      break;
                    case 4:
                      return (o.label++, { value: i[1], done: !1 });
                    case 5:
                      (o.label++, (n = i[1]), (i = [0]));
                      continue;
                    case 7:
                      ((i = o.ops.pop()), o.trys.pop());
                      continue;
                    default:
                      if (
                        !((a = o.trys),
                        (a = a.length > 0 && a[a.length - 1]) || (6 !== i[0] && 2 !== i[0]))
                      ) {
                        o = 0;
                        continue;
                      }
                      if (3 === i[0] && (!a || (i[1] > a[0] && i[1] < a[3]))) {
                        o.label = i[1];
                        break;
                      }
                      if (6 === i[0] && o.label < a[1]) {
                        ((o.label = a[1]), (a = i));
                        break;
                      }
                      if (a && o.label < a[2]) {
                        ((o.label = a[2]), o.ops.push(i));
                        break;
                      }
                      (a[2] && o.ops.pop(), o.trys.pop());
                      continue;
                  }
                  i = t.call(e, o);
                } catch (e) {
                  ((i = [6, e]), (n = 0));
                } finally {
                  r = a = 0;
                }
              if (5 & i[0]) throw i[1];
              return { value: i[0] ? i[1] : void 0, done: !0 };
            })([i, s]);
          };
        }
      };
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(598),
    o = r(8),
    s = r(101),
    u = r(903),
    p = r(473),
    c = r(474),
    l = r(29),
    m = r(0),
    d = r(904),
    y = r(23),
    b = (function () {
      function e() {
        ((this.firebaseInstance = u.default.getInstance()),
          (this.singularInstance = c.default.getInstance()),
          (this.analyticsServices = [
            i.default.getInstance(),
            d.default.getInstance(),
            p.default.getInstance(),
            this.singularInstance,
            this.firebaseInstance,
          ]));
      }
      return (
        (e.getInstance = function () {
          return (e.instance || (e.instance = new e()), e.instance);
        }),
        (e.getCompanyNAddedEventName = function (t) {
          return e.EVENT.N_COMPANY_ADDED + t;
        }),
        (e.invokeAnalyticsEventFromBackground = function (e, t) {
          s.default.sendToUIWindow(o.default.EVENTS.ANALYTICS_EVENT, { action: e, data: t });
        }),
        (e.invokeAnalyticsEventFromMain = function (e, t) {
          s.default.send(o.default.EVENTS.ANALYTICS_EVENT, { action: e, data: t });
        }),
        (e.prototype.initialize = function (e, t, r) {
          var n = this;
          void 0 === r && (r = []);
          var a = this.getCurrentCDP(),
            i = "";
          a.then(function (e) {
            e == p.default.SERVICE_NAME
              ? (i = d.default.SERVICE_NAME)
              : e == d.default.SERVICE_NAME && (i = p.default.SERVICE_NAME);
            for (var t = [], r = 0, a = n.analyticsServices; r < a.length; r++) {
              var o = a[r];
              o.getServiceName() != i && t.push(o);
            }
            n.analyticsServices = t;
          })
            .catch(function (e) {
              console.log("Error Occured while fetching current CDP", e);
            })
            .finally(function () {
              for (var a = 0, i = n.analyticsServices; a < i.length; a++) {
                var o = i[a];
                -1 === r.indexOf(o.getServiceName()) && o.setUpUser(e, t);
              }
            });
        }),
        (e.prototype.setupWithoutUser = function () {
          this.singularInstance.setupDevice();
        }),
        (e.prototype.publishEvent = function (e, t) {
          if (o.default.STAGE === o.default.STAGE_PRODUCTION)
            for (var r = 0, n = this.analyticsServices; r < n.length; r++) {
              var a = n[r];
              try {
                -1 === a.excludedEvent().indexOf(e) && a.publishEvent(e, t);
              } catch (e) {
                (m.Log.error("Error in publish event"), m.Log.error(JSON.stringify(e)));
              }
            }
        }),
        (e.prototype.changeSetting = function (t) {
          this.publishEvent(e.EVENT.SETTING_CHANGE, {
            type: "Auto Import Vouchers",
            value: t.isDataEntrySyncEnable,
            source: "desktop",
          });
        }),
        (e.prototype.signin = function (t) {
          this.singularInstance.publishEvent(e.EVENT.USER_SIGNIN, {
            user: { userId: t.id, email: t.email, phone: t.phone },
            source: o.default.DESKTOP,
          });
        }),
        (e.prototype.addDataEntryImport = function (t) {
          var r = {
            autoSyncSetting: t.company.isDataEntrySyncEnable,
            companyId: t.company.companyId,
            subscriptionId: t.company.subscriptionId,
            type: t.type,
            successCount: t.successCount,
            failureCount: t.failureCount,
            rejectCount: t.rejectCount,
            syncFrom: t.syncFrom,
            voucherName: t.voucherName,
          };
          this.publishEvent(e.EVENT.DATA_ENTER_IMPORT, r);
        }),
        (e.prototype.duplicateMasterIds = function (t, r) {
          this.publishEvent(e.EVENT.DATA_MISMATCH, {
            type: "DuplicateMasterId",
            companyId: r.companyId,
            masterIds: JSON.stringify(t),
          });
        }),
        (e.prototype.companyResynced = function (t, r) {
          var n = { companyId: t.companyId, companyName: t.name };
          (m.Util.isNotEmptyString(r) && (n.type = r),
            this.publishEvent(e.EVENT.COMPANY_RESYNCED, n));
        }),
        (e.prototype.companyDeleted = function (t) {
          this.publishEvent(e.EVENT.COMPANY_DELETED, {
            companyId: t.companyId,
            companyName: t.name,
          });
        }),
        (e.prototype.firstCompanySynced = function (t) {
          var r = {
            eventType: e.EVENT_TYPE.SERVER,
            Platform: e.PLATFORM_DESKTOP,
            feature: e.FLOW.FLOW_ONBOARDING,
            companyId: t.companyId,
            companyName: t.name,
          };
          this.publishEvent(e.EVENT.COMPANY_FIRST_TIME_SYNC, r);
        }),
        (e.prototype.companyNAdded = function (t, r) {
          this.singularInstance.publishEvent(e.getCompanyNAddedEventName(r), {
            companyId: t.companyId,
            companyName: t.name,
            tallyLicense: t.tallyLicense,
          });
        }),
        (e.prototype.signupComplete = function (t, r, n) {
          (void 0 === r && (r = 200), void 0 === n && (n = null));
          var a = {
            Platform: o.default.DESKTOP,
            eventType: "Server",
            currentScreen: "CreateAccount",
            feature: "OnboardingFlow",
            status: t,
          };
          (t == o.default.STATUS_FAILURE && ((a.errorCode = r), (a.errorMessage = n)),
            this.publishEvent(e.EVENT.EVENT_SIGN_UP_COMPLETE, a),
            this.firebaseInstance.publishEvent(e.EVENT.EVENT_DESKTOP_SIGNUP, { status: t }));
        }),
        (e.prototype.trialInstallationComplete = function (t) {
          [
            this.singularInstance,
            this.firebaseInstance,
            i.default.getInstance(),
            p.default.getInstance(),
          ].forEach(function (r) {
            r.publishEvent(e.EVENT.TRIAL_INSTALLATION_COMPLETE, {
              companyId: t.companyId,
              companyName: t.name,
              tallyLicense: t.tallyLicense,
              eventType: e.EVENT_TYPE.SERVER,
              Platform: e.PLATFORM_DESKTOP,
              feature: e.FLOW.FLOW_ONBOARDING,
            });
          });
        }),
        (e.prototype.alterIdNotFoundInCompany = function (t) {
          this.publishEvent(e.EVENT.EVENT_ALTER_ID_NOT_FOUND, { companyId: t });
        }),
        (e.prototype.applicationFirstTimeOpen = function () {
          this.singularInstance.publishEvent(e.EVENT.APP_FIRST_OPEN, { source: o.default.DESKTOP });
        }),
        (e.prototype.logout = function () {
          this.singularInstance.logout();
        }),
        (e.prototype.invokeFromEvent = function (e, t) {
          if (!m.Util.isEmptyString(e))
            switch (e) {
              case o.default.ANALYTICS_ACTION.FIRST_FIVE_COMPANY_ADDED:
                return this.companyNAdded(t.company, t.index);
            }
        }),
        (e.prototype.addCompanyScreenEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_SCREENVIEW, t);
        }),
        (e.prototype.addCompanySuccessScreenEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_SCREENVIEW, t);
        }),
        (e.prototype.companySelectToAddEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_SELECT_COMPANY, t);
        }),
        (e.prototype.companyClickOnAddEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_ADD_COMPANY, t);
        }),
        (e.prototype.addMoreCompanyClickEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_ADD_MORE_COMPANIES, t);
        }),
        (e.prototype.addCompanyDoneClickEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_SUBMIT, t);
        }),
        (e.prototype.addCompanySyncDetailsClickEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_ADD_SYNC_DETAILS, t);
        }),
        (e.prototype.editCompanyClickEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_EDIT_COMPANY, t);
        }),
        (e.prototype.settingsSelectedClickEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_SETTINGS_SELECTED, t);
        }),
        (e.prototype.saveSyncIntervalEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_SUBMIT, t);
        }),
        (e.prototype.saveSyncDeleteVoucherIntervalEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_SUBMIT, t);
        }),
        (e.prototype.saveLedgerClosingIntervalEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_SUBMIT, t);
        }),
        (e.prototype.saveTallyRetryCountEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_SUBMIT, t);
        }),
        (e.prototype.tallySettingsScreenEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_SCREENVIEW, t);
        }),
        (e.prototype.saveTallySettingsEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_SUBMIT, t);
        }),
        (e.prototype.saveEnableNotificationEvent = function (t) {
          var r = {
            eventType: e.EVENT_TYPE.CLICK,
            currentScreen: e.CURRENT_SCREEN.ADDITIONAL_SETTINGS,
            Platform: e.PLATFORM_DESKTOP,
            Type: "EnableNotification",
            Value: t,
          };
          this.publishEvent(e.EVENT.EVENT_SUBMIT, r);
        }),
        (e.prototype.saveChunkDataEvent = function (t, r) {
          var n = {
            eventType: e.EVENT_TYPE.CLICK,
            currentScreen: e.CURRENT_SCREEN.ADDITIONAL_SETTINGS,
            Platform: e.PLATFORM_DESKTOP,
            Type: "ChunkData",
            IsChunkEnabled: t,
            ChunkUnit: "number",
            Value: r,
          };
          this.publishEvent(e.EVENT.EVENT_SUBMIT, n);
        }),
        (e.prototype.saveNonadminAccessEvent = function (t) {
          var r = {
            eventType: e.EVENT_TYPE.CLICK,
            currentScreen: e.CURRENT_SCREEN.ADDITIONAL_SETTINGS,
            Platform: e.PLATFORM_DESKTOP,
            Type: "NonAdminTallyUser",
            Value: t,
          };
          this.publishEvent(e.EVENT.EVENT_SUBMIT, r);
        }),
        (e.prototype.saveMasterChunkSizeEvent = function (t) {
          var r = {
            eventType: e.EVENT_TYPE.CLICK,
            currentScreen: e.CURRENT_SCREEN.ADDITIONAL_SETTINGS,
            Platform: e.PLATFORM_DESKTOP,
            Type: "MasterChunkSizeEnable",
            Value: t,
          };
          this.publishEvent(e.EVENT.EVENT_SUBMIT, r);
        }),
        (e.prototype.saveProxyEvent = function (t, r) {
          var n = {
            eventType: e.EVENT_TYPE.CLICK,
            currentScreen: e.CURRENT_SCREEN.ADDITIONAL_SETTINGS,
            Platform: e.PLATFORM_DESKTOP,
            Type: "ProxyUrl",
            IsProxyEnabled: t,
            Value: r,
          };
          this.publishEvent(e.EVENT.EVENT_SUBMIT, n);
        }),
        (e.prototype.leftNavOptionClickEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_ONBOARDING_LEFT_NAV, t);
        }),
        (e.prototype.signInClickEvent = function (t) {
          this.publishEvent(e.EVENT.USER_SIGNIN, t);
        }),
        (e.prototype.signUpScreenEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_SCREENVIEW, t);
        }),
        (e.prototype.signUpClickEvent = function (t) {
          this.publishEvent(e.EVENT.USER_SIGNUP, t);
        }),
        (e.prototype.signUpFieldFocusOutEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_FILL_PERSONAL_INFO, t);
        }),
        (e.prototype.signUpTncClickEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_CHECKS_TNC, t);
        }),
        (e.prototype.closeAppClickEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_CLOSE, t);
        }),
        (e.prototype.minimizeAppClickEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_MINIMIZE, t);
        }),
        (e.prototype.restartAppClickEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_RESTART, t);
        }),
        (e.prototype.emailScreenEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_SCREENVIEW, t);
        }),
        (e.prototype.signUpCompleteEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_SIGN_UP_COMPLETE, t);
        }),
        (e.prototype.emailFocusOutEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_FILL_EMAIL, t);
        }),
        (e.prototype.checkEmailClickEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_SUBMIT, t);
        }),
        (e.prototype.addSyncSettingRestartEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_RESTART, t);
        }),
        (e.prototype.firstCompanySyncStartEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_FIRST_SYNC_START, t);
        }),
        (e.prototype.addCompanyRefreshEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_RESTART, t);
        }),
        (e.prototype.odbcPortNotOpenEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_OBDC_NOT_OPEN, t);
        }),
        (e.prototype.tallyNotOpenEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_TALLY_NOT_OPEN, t);
        }),
        (e.prototype.companyNotSelectedEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_COMPANY_NOT_SELECTED, t);
        }),
        (e.prototype.internetNotConectedEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_INTERNET_NOT_CONNECTED, t);
        }),
        (e.prototype.tallyRunningOnDifferentComputerEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_TALLY_RUNNING_ON_DIFFERENT_COMPUTER, t);
        }),
        (e.prototype.editTallyLicenceEvent = function (t) {
          this.publishEvent(e.EVENT.EVENT_EDIT_TALLY, t);
        }),
        (e.prototype.getCurrentCDP = function () {
          return n(this, void 0, void 0, function () {
            var e, t, r, n, i, s;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  return (
                    (e = ""),
                    (t = m.Util.getServerCredentials().API_BASE_URL),
                    (r = l.User.get()),
                    (n = t + "/miscellaneous/metadata"),
                    (i = y.getRequestOptions(n, { key: o.default.CURRENT_CDP_KEY }, null, r)),
                    [4, y.getRequest(i)]
                  );
                case 1:
                  return ((s = a.sent()) && (e = s.value), [2, e]);
              }
            });
          });
        }),
        (e.instance = null),
        (e.EVENT = {
          DATA_ENTER_IMPORT: "Data Entry Import",
          SETTING_CHANGE: "Settings Changed",
          DATA_MISMATCH: "DataMismatch",
          COMPANY_RESYNCED: "CompanyResynced",
          COMPANY_DELETED: "CompanyDeleted",
          COMPANY_FIRST_TIME_SYNC: "FirstCompanySynced",
          EVENT_SIGN_UP_COMPLETE: "SignUpComplete",
          EVENT_DESKTOP_SIGNUP: "LoginDesktop",
          EVENT_ALTER_ID_NOT_FOUND: "AlterIdNotFound",
          TRIAL_INSTALLATION_COMPLETE: "Trial_Installation_Complete",
          USER_SIGNIN: "SignIn",
          USER_SIGNUP: "SignUp",
          N_COMPANY_ADDED: "CompanyAdded",
          APP_FIRST_OPEN: "AppFirstOpen",
          SYNC_STATUS: "SyncStatus",
          EVENT_SCREENVIEW: "Screenview",
          EVENT_SELECT_COMPANY: "SelectCompany",
          EVENT_ADD_MORE_COMPANIES: "AddMoreCompanies",
          EVENT_SUBMIT: "Submit",
          EVENT_ADD_SYNC_DETAILS: "AddSyncDetails",
          EVENT_EDIT_COMPANY: "EditCompany",
          EVENT_SETTINGS_SELECTED: "SettingsSelected",
          EVENT_ONBOARDING_LEFT_NAV: "OnboardingLeftNav",
          EVENT_FILL_PERSONAL_INFO: "FillPersonalInfo",
          EVENT_CHECKS_TNC: "ChecksTnC",
          EVENT_CLOSE: "Close",
          EVENT_MINIMIZE: "Minimize",
          EVENT_RESTART: "Restart",
          EVENT_FILL_EMAIL: "FillEmail",
          EVENT_FIRST_SYNC_START: "FirstSyncStart",
          EVENT_EDIT_TALLY: "EditTally",
          EVENT_ADD_COMPANY: "AddCompany",
          EVENT_OBDC_NOT_OPEN: "odbcPortNotOpenEvent",
          EVENT_TALLY_NOT_OPEN: "tallyNotOpenEvent",
          EVENT_COMPANY_NOT_SELECTED: "companyNotSelectedEvent",
          EVENT_INTERNET_NOT_CONNECTED: "internetNotConectedEvent",
          EVENT_TALLY_RUNNING_ON_DIFFERENT_COMPUTER: "tallyRunningOnDifferentComputerEvent",
        }),
        (e.FLOW = { FLOW_ONBOARDING: "OnboardingFlow" }),
        (e.EVENT_TYPE = {
          CLICK: "Click",
          SCREENVIEW: "Screenview",
          FOCUSOUT: "FocusOut",
          SERVER: "Server",
        }),
        (e.CURRENT_SCREEN = {
          ADD_COMPANY: "AddCompany",
          ADD_COMPANY_SUCCESS: "AddCompanySuccess",
          MY_COMPANY: "MyCompany",
          SETTINGS: "Settings",
          SYNC_SETTINGS: "SyncSettings",
          TALLY_SETTINGS: "TallySettings",
          CREATE_ACCOUNT: "CreateAccount",
          ENTER_EMAIL: "EnterEmail",
          SYNC_TALLY_RETRY_ATTEMPTS: "SyncTallyRetryAttempts",
          SETTINGS_TALLY: "SettingsTally",
          ADDITIONAL_SETTINGS: "AdditionalSettings",
        }),
        (e.PLATFORM_DESKTOP = "Desktop"),
        e
      );
    })();
  t.default = b;
};
