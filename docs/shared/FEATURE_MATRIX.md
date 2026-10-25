# FEATURE_MATRIX — every legacy feature → LazyBooks module → phase

Generated from the extracted legacy app (153 screens, 114 fragments/sheets, 28 feature packages, 92 API routes). **Nothing in the legacy app is unaccounted for.**
Disposition: **BUILD** = rebuild as-is behaviour; **REPLACED** = same user outcome via a free/our-own mechanism; **DEFERRED** = needs a paid/third-party service, parked on purpose; **NA** = vendor-business item, not a product feature.

If you believe an NA/DEFERRED item must be built, say so in `PHASE_STATUS.md` → Open questions; the owner decides.

## 1. Module summary (this is also the structure of the in-app 'More' launcher)

| Launcher group | Module | Disposition | PWA phase | Other repos' phases | Legacy items |
|---|---|---|---|---|---|
| Entries | E-INV — Invoice entry | BUILD | Phase 61 (`entry-invoice`) | — | 12 |
| Entries | E-INVV — Inventory voucher entry | BUILD | Phase 64 (`entry-inventory`) | — | 5 |
| Entries | E-JRN — Journal entry | BUILD | Phase 63 (`entry-journal`) | — | 3 |
| Entries | E-LED — Ledger entry | BUILD | Phase 66 (`entry-masters`) | lazybooks-pwa Phase 67 (`entry-lists`) | 4 |
| Entries | E-ORD — Order entry | BUILD | Phase 65 (`entry-orders`) | — | 1 |
| Entries | E-SET — Entry settings + permissions | BUILD | Phase 68 (`entry-settings`) | lazybooks-pwa Phase 74 (`permissions-engine`) | 7 |
| Entries | E-STK — Stock item entry | BUILD | Phase 66 (`entry-masters`) | — | 2 |
| Entries | E-STK2 — Item entry list | BUILD | Phase 67 (`entry-lists`) | — | 1 |
| Entries | E-TXN — Receipt/payment entry | BUILD | Phase 62 (`entry-transaction`) | — | 3 |
| Entries | EWAY — E-invoice / e-way | BUILD | Phase 69 (`einvoice-eway`) | lazybooks-desktop Phase 29 (`einvoice-actions`) | 12 |
| Entries | EWAY2 — E-way/e-invoice cancel | BUILD | Phase 69 (`einvoice-eway`) | lazybooks-desktop Phase 29 (`einvoice-actions`) | 1 |
| Money | BANK — UPI QR + banks + currency | BUILD | Phase 44 (`upi-qr-banks`) | lazybooks-pwa Phase 78 (`settings-hub`) | 5 |
| Money | BILL — Bills | BUILD | Phase 42 (`bills`) | — | 5 |
| Money | COLL — Payment collection | BUILD | Phase 43 (`collections`) | — | 3 |
| Money | OUT — Outstanding + ageing | BUILD | Phase 41 (`outstanding`) | — | 4 |
| Orders | ORD — Orders | BUILD | Phase 56 (`orders`) | lazybooks-pwa Phase 65 (`entry-orders`) | 7 |
| Orders | PEND — Pending orders | BUILD | Phase 57 (`pending-orders`) | — | 5 |
| Orders | QUOTE — Quotations | BUILD | Phase 65 (`entry-orders`) | lazybooks-pwa Phase 58 (`quotations-read`) | 1 |
| Parties | AUTOSHARE — Invoice auto-share | REPLACED | Phase 47 (`auto-share`) | — | 2 |
| Parties | CONTACT — Ledger contacts | BUILD | Phase 48 (`ledger-contacts`) | lazybooks-mobile Phase 10 (`contacts-import`) | 3 |
| Parties | CUST — Customer pages | BUILD | Phase 36 (`customer-pages`) | — | 6 |
| Parties | FU — Follow-ups | BUILD | Phase 45 (`followups`) | — | 3 |
| Parties | LEDGER — Ledgers + statement | BUILD | Phase 30 (`ledger-statement`) | lazybooks-pwa Phase 67 (`entry-lists`) | 4 |
| Parties | LEDGERSET — Ledger/share settings | BUILD | Phase 39 (`export-share`) | — | 3 |
| Parties | MSG — Greetings + message templates | BUILD | Phase 49 (`greetings-messages`) | — | 7 |
| Parties | REM — Reminders / auto-reminders | REPLACED | Phase 46 (`reminders`) | lazybooks-pwa Phase 47 (`auto-share`) | 10 |
| Reports | GST — HSN detail | BUILD | Phase 37 (`gst-reports`) | — | 1 |
| Reports | GSTV — GST validation | BUILD | Phase 60 (`entry-engine`) | — | 1 |
| Reports | REP-ACC — Account balances | BUILD | Phase 31 (`account-balances`) | — | 2 |
| Reports | REP-BS — Balance sheet | BUILD | Phase 32 (`balance-sheet`) | — | 2 |
| Reports | REP-IE — Income & expense | BUILD | Phase 34 (`income-expense`) | — | 5 |
| Reports | REP-PL — Profit & loss | BUILD | Phase 33 (`profit-loss`) | — | 3 |
| Reports | REP-TOP — Top reports / graphs / report hub | BUILD | Phase 35 (`top-reports`) | lazybooks-pwa Phase 40 (`reports-hub`) | 3 |
| Reports | VCH — Vouchers (view) | BUILD | Phase 29 (`voucher-detail`) | lazybooks-pwa Phase 28 (`daybook`) | 11 |
| Reports | VCH2 — Voucher lists by kind | BUILD | Phase 29 (`voucher-detail`) | lazybooks-pwa Phase 28 (`daybook`) | 2 |
| Settings | COMPANY — Companies + main shell | BUILD | Phase 24 (`multi-company`) | lazybooks-pwa Phase 4 (`app-shell`) | 4 |
| Settings | CONNECT — Connect to desktop connector | BUILD | Phase 17 (`crypto`) | lazybooks-desktop Phase 36 (`ui-pairing`), lazybooks-mobile Phase 13 (`deeplinks-qr`) | 1 |
| Settings | DEV — Debug tools | BUILD | Phase 22 (`sync-ui`) | — | 4 |
| Settings | DEVICES — Devices | BUILD | Phase 11 (`device-registration`) | lazybooks-admin Phase 17 (`devices-health`) | 2 |
| Settings | LOCK — Passcode / lock | BUILD | Phase 79 (`app-lock`) | lazybooks-mobile Phase 12 (`app-lock-native`) | 1 |
| Settings | PERIOD — Period / FY / default screen | BUILD | Phase 38 (`periods-fy`) | — | 4 |
| Settings | PROFILE — Profile + images | BUILD | Phase 78 (`settings-hub`) | lazybooks-mobile Phase 8 (`barcode-camera`) | 6 |
| Settings | SET — Settings hub | BUILD | Phase 78 (`settings-hub`) | lazybooks-pwa Phase 80 (`web-push`) | 2 |
| Settings | SHARE — Share / print / PDF | BUILD | Phase 39 (`export-share`) | lazybooks-pwa Phase 72 (`entry-share`) | 16 |
| Settings | SUB — Subscription / license status | REPLACED | Phase 12 (`flags-gate`) | lazybooks-admin Phase 8 (`licenses`), lazybooks-admin Phase 7 (`plans-flags`) | 1 |
| Settings | SUPPORT — Support tickets | BUILD | Phase 78 (`settings-hub`) | lazybooks-admin Phase 27 (`support-queue`) | 2 |
| Stock | BARCODE — Barcode | BUILD | Phase 55 (`barcode-web`) | lazybooks-mobile Phase 8 (`barcode-camera`) | 1 |
| Stock | BATCH — Godown + batch | BUILD | Phase 52 (`godown-batch`) | — | 2 |
| Stock | ITEM — Item detail | BUILD | Phase 51 (`item-detail`) | — | 9 |
| Stock | PHYS — Physical stock / stock journal | BUILD | Phase 53 (`physical-stock-journal`) | — | 2 |
| Stock | STOCK — Stock items/groups | BUILD | Phase 50 (`stock-items`) | lazybooks-pwa Phase 67 (`entry-lists`) | 8 |
| System | AUTH — Login / OTP / forgot password | REPLACED | Phase 10 (`activate-login`) | lazybooks-admin Phase 27 (`support-queue`), lazybooks-admin Phase 15 (`user-provisioning`) | 3 |
| System | BOOT — Splash | BUILD | Phase 5 (`pwa-shell`) | lazybooks-mobile Phase 6 (`android-config`) | 7 |
| System | GROWTH — Vendor growth / marketplace | NA | Phase 78 (`settings-hub`) | lazybooks-admin Phase 25 (`announcements`) | 8 |
| System | HOME — Home / dashboard | BUILD | Phase 27 (`dashboard`) | lazybooks-pwa Phase 4 (`app-shell`) | 2 |
| System | LANG — Language selection | BUILD | Phase 81 (`i18n-a11y`) | lazybooks-pwa Phase 78 (`settings-hub`) | 1 |
| System | NA1 — Marketing onboarding questionnaire | NA | Phase 10 (`activate-login`) | — | 10 |
| System | UIKIT — Generic sheets / pickers | BUILD | Phase 3 (`ui-primitives`) | — | 11 |
| System | WALLET — Vendor wallet / paid credits | DEFERRED | Phase 12 (`flags-gate`) | — | 1 |
| Team | PAYROLL — Payroll | BUILD | Phase 77 (`payroll-view`) | — | 1 |
| Team | PUNCH — Punch in/out | BUILD | Phase 76 (`punch-in-out`) | lazybooks-mobile Phase 9 (`geo-punch`) | 5 |
| Team | SALES — Salespersons | BUILD | Phase 75 (`salespersons`) | — | 1 |
| Team | TEAM — Users + permissions | BUILD | Phase 73 (`team-users`) | lazybooks-admin Phase 15 (`user-provisioning`) | 3 |

## 2. Full item list by module

### E-INV — Invoice entry  [BUILD]  → PWA Phase 61 (`entry-invoice`)
`AddItemEntryWithTax`, `AddItemEntryWithTax`, `BuyerConsigneeDetailBottomSheet`, `CreateInvoice`, `DataEntryDefaultItemRateBottomSheet`, `DispatchDetailBottomSheet`, `InvoiceEntryList`, `InvoiceEntryList`, `InvoiceEntrySetting`, `PosDetailsBottomSheet`, `SalesPersonInvoice`, `SalesPersonInvoice`

### E-INVV — Inventory voucher entry  [BUILD]  → PWA Phase 64 (`entry-inventory`)
`CreateInventoryVoucher`, `EntryVoucherTypeSelect`, `InventoryVoucherEntryList`, `InventoryVoucherEntryList`, `InventoryVoucherEntrySetting`

### E-JRN — Journal entry  [BUILD]  → PWA Phase 63 (`entry-journal`)
`CreateJournalEntry`, `JournalEntryList`, `JournalEntryList`

### E-LED — Ledger entry  [BUILD]  → PWA Phase 66 (`entry-masters`)
`AddLedgerBottomSheet`, `AddPartyBottomSheet`, `CreateLedger`, `EntryList`

### E-ORD — Order entry  [BUILD]  → PWA Phase 65 (`entry-orders`)
`CreateOrder`

### E-SET — Entry settings + permissions  [BUILD]  → PWA Phase 68 (`entry-settings`)
`DataEntryDeclaration`, `DataEntryPermission`, `DataEntrySetting`, `ForbiddenHandling`, `GenericPermission`, `OptionalEntrySettingBottomSheet`, `ScreenWisePermission`

### E-STK — Stock item entry  [BUILD]  → PWA Phase 66 (`entry-masters`)
`CreateStockItem`, `StockItemSetting`

### E-STK2 — Item entry list  [BUILD]  → PWA Phase 67 (`entry-lists`)
`ItemEntryList`

### E-TXN — Receipt/payment entry  [BUILD]  → PWA Phase 62 (`entry-transaction`)
`CreateTransaction`, `TransactionEntryList`, `TransactionEntryList`

### EWAY — E-invoice / e-way  [BUILD]  → PWA Phase 69 (`einvoice-eway`)
`ChooseEWayEInvoiceCreateEntryBottomSheet`, `EInvoiceCancelledBottomSheet`, `EInvoiceEwayReportList`, `EInvoiceLoginBottomSheet`, `EWayBillDetailsBottomSheet`, `EwayBillEntryBottomSheet`, `EwayDetail`, `GenerateEWayEInvoiceErrorBottomSheet`, `GenerateEWayEInvoiceLoadingBottomSheet`, `GenerateEWayEInvoiceSuccessBottomSheet`, `IASPartialSuccessBottomSheet`, `SelectEWayEInvoiceOptionBottomSheet`

### EWAY2 — E-way/e-invoice cancel  [BUILD]  → PWA Phase 69 (`einvoice-eway`)
`EwayEinvoiceCancelBottomSheet`

### BANK — UPI QR + banks + currency  [BUILD]  → PWA Phase 44 (`upi-qr-banks`)
`BankDetail`, `CurrencyFormatDecimalSettingsBottomSheet`, `CurrencySettings`, `DefaultCurrencySettingsBottomSheet`, `QRCodePayments`

### BILL — Bills  [BUILD]  → PWA Phase 42 (`bills`)
`AddBillEntryList`, `BillsList`, `PaymentDetails`, `PaymentStatus`, `PendingSalesBill`

### COLL — Payment collection  [BUILD]  → PWA Phase 43 (`collections`)
`PaymentCollectionHelp`, `PaymentCollectionHistory`, `PaymentCollectionSettings`

### OUT — Outstanding + ageing  [BUILD]  → PWA Phase 41 (`outstanding`)
`AgeingSettings`, `OutstandingMessageShareBottomSheet`, `OutstandingSettings`, `OutstandingShareSettings`

### ORD — Orders  [BUILD]  → PWA Phase 56 (`orders`)
`Order`, `OrderDetail`, `OrderDetailBottomSheet`, `OrderEntryList`, `OrderEntryList`, `OrderItemDetail`, `OrdersSetting`

### PEND — Pending orders  [BUILD]  → PWA Phase 57 (`pending-orders`)
`ItemPendingOrder`, `PendingOrder`, `PendingOrderDetail`, `PendingOrderList`, `PendingOrderSelection`

### QUOTE — Quotations  [BUILD]  → PWA Phase 65 (`entry-orders`)
`CreateQuotation`

### AUTOSHARE — Invoice auto-share  [REPLACED]  → PWA Phase 47 (`auto-share`)
*Share prompts instead of server-side sending*
`AutoShareHistory`, `InvoiceAutoShareSetting`

### CONTACT — Ledger contacts  [BUILD]  → PWA Phase 48 (`ledger-contacts`)
`AddContactDetailsInfoBottomSheet`, `SelectedLedgerInfoBottomSheet`, `UpdateContactDetailsBottomSheet`

### CUST — Customer pages  [BUILD]  → PWA Phase 36 (`customer-pages`)
`CustomerItemInvoices`, `CustomerItems`, `CustomerSalesPurchase`, `CustomerSummary`, `CustomerTransactions`, `ItemLastSale`

### FU — Follow-ups  [BUILD]  → PWA Phase 45 (`followups`)
`AddFollowUp`, `CheckInCheckOutBottomSheet`, `FollowUpList`

### LEDGER — Ledgers + statement  [BUILD]  → PWA Phase 30 (`ledger-statement`)
`LedgerEntryList`, `LedgerEntryList`, `LedgerList`, `LedgerReport`

### LEDGERSET — Ledger/share settings  [BUILD]  → PWA Phase 39 (`export-share`)
`LedgerReportShareSettings`, `LedgerSetting`, `ShareSettings`

### MSG — Greetings + message templates  [BUILD]  → PWA Phase 49 (`greetings-messages`)
`AddGreeting`, `DataEntryEmailConfigurationBottomSheet`, `EmailMessageSetting`, `RegardMessageBottomSheet`, `SMSSettings`, `WhatsAppMessageSetting`, `WhatsAppOptInBottomSheet`

### REM — Reminders / auto-reminders  [REPLACED]  → PWA Phase 46 (`reminders`)
*Delivery via local notification + share intent instead of server-sent WhatsApp/SMS*
`AddEditReminderBottomSheet`, `AutoReminderCommunicationSettingBottomSheet`, `AutoReminderJobDetail`, `AutoReminderLedgerDetailBottomSheet`, `EditRecurringFrequencyBottomSheet`, `ManualReminderBottomSheet`, `RecurringFrequency`, `RemindLaterBottomSheet`, `RemindersBottomSheet`, `RemindersSuccessBottomSheet`

### GST — HSN detail  [BUILD]  → PWA Phase 37 (`gst-reports`)
`HsnDetail`

### GSTV — GST validation  [BUILD]  → PWA Phase 60 (`entry-engine`)
`GstValidationBottomSheet`

### REP-ACC — Account balances  [BUILD]  → PWA Phase 31 (`account-balances`)
`AccountBalance`, `AccountBalances`

### REP-BS — Balance sheet  [BUILD]  → PWA Phase 32 (`balance-sheet`)
`BalanceSheet`, `BalanceSheetByGroup`

### REP-IE — Income & expense  [BUILD]  → PWA Phase 34 (`income-expense`)
`ExpenseByGroup`, `ExpenseDetail`, `Expenses`, `IncomeByGroup`, `IncomeDetail`

### REP-PL — Profit & loss  [BUILD]  → PWA Phase 33 (`profit-loss`)
`ProfitAndLoss`, `ProfitAndLossActivityOld`, `ProfitAndLossByGroup`

### REP-TOP — Top reports / graphs / report hub  [BUILD]  → PWA Phase 35 (`top-reports`)
`Graph`, `ReportList`, `TopReport`

### VCH — Vouchers (view)  [BUILD]  → PWA Phase 29 (`voucher-detail`)
`InventoryVoucherDetail`, `InventoryVoucherItemDetail`, `Invoice`, `InvoiceDeclaration`, `InvoiceHeaderTitle`, `JournalDetail`, `Transaction`, `TransactionBillDetail`, `TransactionDetail`, `VoucherType`, `VouchersSetting`

### VCH2 — Voucher lists by kind  [BUILD]  → PWA Phase 29 (`voucher-detail`)
`InventoryVoucherList`, `Purchase`

### COMPANY — Companies + main shell  [BUILD]  → PWA Phase 24 (`multi-company`)
`AddCompanyBottomSheet`, `ChangeCompany`, `NewFrequency`, `SubscriptionCompanies`

### CONNECT — Connect to desktop connector  [BUILD]  → PWA Phase 17 (`crypto`)
`ConnectWithTally`

### DEV — Debug tools  [BUILD]  → PWA Phase 22 (`sync-ui`)
*SyncDebugPanel + settings debug mode*
`BizAnalystDebugData`, `DebugDataOptions`, `DebugModeSettings`, `FileSyncDebugData`

### DEVICES — Devices  [BUILD]  → PWA Phase 11 (`device-registration`)
`DeviceList`, `ExtraDevices`

### LOCK — Passcode / lock  [BUILD]  → PWA Phase 79 (`app-lock`)
`PassCode`

### PERIOD — Period / FY / default screen  [BUILD]  → PWA Phase 38 (`periods-fy`)
`DefaultScreenSettingsBottomSheetFragment`, `DefaultTimeSettings`, `FinancialYearSettingsBottomSheet`, `TimePeriodSettingsBottomSheet`

### PROFILE — Profile + images  [BUILD]  → PWA Phase 78 (`settings-hub`)
`Camera`, `ChangeProfilePic`, `CompanyLogoNSignatureImageUpload`, `FullScreenImagePreview`, `ImageCrop`, `UserProfile`

### SET — Settings hub  [BUILD]  → PWA Phase 78 (`settings-hub`)
`NotificationSettingsBottomSheetFragment`, `Settings`

### SHARE — Share / print / PDF  [BUILD]  → PWA Phase 39 (`export-share`)
`AssetSharingBottomSheet`, `AssetSharingMoreOptionsBottomSheet`, `CustomizeInvoiceShareBottomSheet`, `InventoryVoucherShareSetting`, `InvoiceShareBodySetting`, `InvoiceShareFooterSetting`, `InvoiceShareHeaderSetting`, `InvoiceShareSettings`, `ListPrintSizeBottomSheet`, `OrderDetailShareSetting`, `PDFPreview`, `ShareBankDetailsBottomSheet`, `ShareCategoryBottomSheet`, `ShareColumnSettingBottomSheet`, `TransactionSuccessfulShareBottomSheet`, `VoucherShareSettings`

### SUB — Subscription / license status  [REPLACED]  → PWA Phase 12 (`flags-gate`)
*Admin-managed licenses and plan flags; no in-app purchase*
`SubscriptionAudit`

### SUPPORT — Support tickets  [BUILD]  → PWA Phase 78 (`settings-hub`)
`ContactUs`, `CreateTicketBottomSheet`

### BARCODE — Barcode  [BUILD]  → PWA Phase 55 (`barcode-web`)
`BarcodeReader`

### BATCH — Godown + batch  [BUILD]  → PWA Phase 52 (`godown-batch`)
`BatchClosing`, `ItemGodownBatchList`

### ITEM — Item detail  [BUILD]  → PWA Phase 51 (`item-detail`)
`ItemConsumer`, `ItemEdit`, `ItemLedgerReport`, `ItemPriceList`, `ItemShareSettings`, `ItemSummary`, `ItemSummary`, `ItemSupplier`, `MaterialItemDetail`

### PHYS — Physical stock / stock journal  [BUILD]  → PWA Phase 53 (`physical-stock-journal`)
`PhysicalStockItemDetail`, `StockJournalDetail`

### STOCK — Stock items/groups  [BUILD]  → PWA Phase 50 (`stock-items`)
`InventoryGroupCategory`, `ItemFilter`, `ProductItemList`, `StockCategory`, `StockGroup`, `StockItemEntryList`, `StockItemEntryList`, `StockItemSettingsBottomSheet`

### AUTH — Login / OTP / forgot password  [REPLACED]  → PWA Phase 10 (`activate-login`)
*No OTP: admin issues email+password; forgot-password becomes a support request*
`ForgotPassword`, `LoginSignUp`, `OtpVerification`

### BOOT — Splash  [BUILD]  → PWA Phase 5 (`pwa-shell`)
*Branded splash from admin branding set*
`HowARWorksInfoBottomSheet`, `HowToSetupBottomSheet`, `IntroSplashScreen`, `InvoiceAutoShareInfoBottomSheet`, `InvoiceAutoShareInfoBottomSheetFragmentVM`, `SplashScreen`, `WelcomeScreen`

### GROWTH — Vendor growth / marketplace  [NA]  → PWA Phase 78 (`settings-hub`)
*Vendor referral/marketplace/testimonials; LanguageList maps to i18n selector*
`AboutPartner`, `AppShareFragment`, `BizAnalystSelectionBottomSheet`, `BizAnalystTestimonial`, `BizMartBottomSheet`, `ReferAndEarn`, `ReferNEarnShareBottomSheet`, `ReferralsFragment`

### HOME — Home / dashboard  [BUILD]  → PWA Phase 27 (`dashboard`)
`Main`, `Main`

### LANG — Language selection  [BUILD]  → PWA Phase 81 (`i18n-a11y`)
`LanguageListBottomSheet`

### NA1 — Marketing onboarding questionnaire  [NA]  → PWA Phase 10 (`activate-login`)
*Vendor lead-qualification questionnaire; LazyBooks activation is license + admin-issued login*
`BoardingThankYou`, `NewSFA`, `OnBoard`, `OnBoardOtherQuestions`, `OnBoardQuestions`, `OnBoardQuestionsHolder`, `OnBoardQuestionsViewPager`, `OnBoardTallyQuestion`, `OtherOnBoardingQuestions`, `SetNotSet`

### UIKIT — Generic sheets / pickers  [BUILD]  → PWA Phase 3 (`ui-primitives`)
`ActionListBottomList`, `AdditionalSetting`, `BasicConfirmationBottomSheet`, `BasicStateBottomSheet`, `CancelReasonBottomSheet`, `ConfirmationBottomSheet`, `ConfirmationBottomSheet`, `CustomBottomSheetDialog`, `CustomizeBottomSheet`, `DatePicker`, `GroupSelectionBottomSheet`

### WALLET — Vendor wallet / paid credits  [DEFERRED]  → PWA Phase 12 (`flags-gate`)
*Paid messaging credits; replaced by free share-intent reminders. Revisit if a paid provider is added*
`StartPaymentBottomSheet`

### PAYROLL — Payroll  [BUILD]  → PWA Phase 77 (`payroll-view`)
`PayrollPayDetail`

### PUNCH — Punch in/out  [BUILD]  → PWA Phase 76 (`punch-in-out`)
`LedgerCheckInOutReport`, `PunchInOutBottomSheetDialog`, `PunchInOutUserDetail`, `PunchInOutUserDetailMap`, `PunchInOutUserList`

### SALES — Salespersons  [BUILD]  → PWA Phase 75 (`salespersons`)
`SalesPersonList`

### TEAM — Users + permissions  [BUILD]  → PWA Phase 73 (`team-users`)
`SelectManager`, `UserList`, `UserPermissions`

## 3. Feature packages (legacy app internals)

| Package | Meaning | Disposition | PWA phase | Note |
|---|---|---|---|---|
| `abexperiment` | A/B experiments SDK | NA | Phase 78 (`settings-hub`) | Vendor experimentation; feature flags replace it |
| `addbank` | Bank accounts for collections | BUILD | Phase 44 (`upi-qr-banks`) |  |
| `analytics` | Vendor analytics SDKs | NA | Phase 78 (`settings-hub`) | No third-party trackers; optional privacy-respecting health pings via bootstrap only |
| `ar_add_remove_ledger` | Auto-reminder ledger selection | REPLACED | Phase 46 (`reminders`) |  |
| `ar_frequency_detail` | Auto-reminder frequency | REPLACED | Phase 46 (`reminders`) |  |
| `ar_frequency_reminder` | Auto-reminder frequency | REPLACED | Phase 46 (`reminders`) |  |
| `ar_reports` | Auto-reminder reports | REPLACED | Phase 46 (`reminders`) |  |
| `ar_scheduler_settings` | Auto-reminder scheduler | REPLACED | Phase 46 (`reminders`) |  |
| `ar_settings_flow` | Auto-reminder wizard | REPLACED | Phase 46 (`reminders`) |  |
| `ar_view_add_edit_frequency` | Auto-reminder frequency edit | REPLACED | Phase 46 (`reminders`) |  |
| `customer_last_sale` | Customer last sale | BUILD | Phase 36 (`customer-pages`) |  |
| `customer_list` | Customer list | BUILD | Phase 36 (`customer-pages`) |  |
| `dataentry` | Data entry core | BUILD | Phase 60 (`entry-engine`) |  |
| `daybook` | Day book | BUILD | Phase 28 (`daybook`) |  |
| `erp_launch` | Desktop launch promo | NA | Phase 10 (`activate-login`) | Vendor promotion for its desktop product |
| `item_party_pending_orders` | Pending orders | BUILD | Phase 57 (`pending-orders`) |  |
| `ledger_contacts` | Ledger contacts | BUILD | Phase 48 (`ledger-contacts`) |  |
| `notification` | Notifications | BUILD | Phase 80 (`web-push`) | Daily summary, pending bills, invoice auto-share, entry results |
| `outstanding` | Outstanding | BUILD | Phase 41 (`outstanding`) |  |
| `outstanding_details` | Outstanding details | BUILD | Phase 41 (`outstanding`) |  |
| `party_pending_orders` | Pending orders by party | BUILD | Phase 57 (`pending-orders`) |  |
| `paymentgst` | Merchant GST onboarding for gateway | DEFERRED | Phase 44 (`upi-qr-banks`) | Gateway onboarding; UPI QR replaces it |
| `phoneinput` | Phone-number input for OTP | NA | Phase 10 (`activate-login`) | OTP removed |
| `refactor` | Payment detail refactor | BUILD | Phase 43 (`collections`) |  |
| `settingsmigration` | Settings migrations | BUILD | Phase 78 (`settings-hub`) | Dexie/app_settings migrations |
| `subscriptionsheet` | Subscription plans UI | REPLACED | Phase 12 (`flags-gate`) | Admin-managed licenses |
| `wallet` | Vendor wallet | DEFERRED | Phase 12 (`flags-gate`) | Paid credits |

Infrastructure packages (no user-facing feature of their own): `activity, adapter, async, common, core, dao, databinding, enums, fragment, framework, generated, impl, interfaces, listener, main_activity, pojo, presenters, realm, receiver, reports, request, response, room, service, utils, view, viewmodel, widgets, wrapper`.
Mapping of the infrastructure that carries real logic: `async/*` (the on-device calculators: outstanding, invoice payment status, customer last sale, pending orders, batch closing, stock closing) → PWA `local-calc-layer` (Phase 26); `dao/pojo/realm/room` → PWA `dexie-schema` (Phase 6); `request/response/service/impl` (HTTP to the vendor server) → replaced by the postbox (Phase 16 `postbox-client`); `receiver/service` (alarms, FCM, location) → `reminders`, `web-push`, `punch-in-out` and the Mobile kit.

## 4. Legacy server API routes → LazyBooks replacement

The legacy server is not available and is NOT being reproduced. Each route's purpose is served by the mechanism shown.

| Legacy route | Replacement in LazyBooks | Disposition | PWA phase |
|---|---|---|---|
| `POST /ab-experiment/get-experiments-for-entity` | Review | BUILD | Phase 78 (`settings-hub`) |
| `GET /company/autoshare/settings/invoice` | Tables reminder_jobs/reminder_log + local delivery | REPLACED | Phase 46 (`reminders`) |
| `PUT /company/autoshare/settings/invoice/{status}` | Tables reminder_jobs/reminder_log + local delivery | REPLACED | Phase 46 (`reminders`) |
| `GET /company/ledger/contacts` | Ledger contacts in app_settings + synced ledger data | BUILD | Phase 48 (`ledger-contacts`) |
| `PUT /company/ledger/contacts` | Ledger contacts in app_settings + synced ledger data | BUILD | Phase 48 (`ledger-contacts`) |
| `GET /company/partydetails` | devices table + companies via sync | BUILD | Phase 24 (`multi-company`) |
| `PUT /company/partydetails` | devices table + companies via sync | BUILD | Phase 24 (`multi-company`) |
| `GET /dataentry/get_order_entries/{companyId}` | Table entry_queue (device -> connector -> Tally) | BUILD | Phase 59 (`entry-queue`) |
| `GET /dataentry/get_transaction_entries/{companyId}` | Table entry_queue (device -> connector -> Tally) | BUILD | Phase 59 (`entry-queue`) |
| `GET /dataentry/ledgerentries/{companyId}` | Table entry_queue (device -> connector -> Tally) | BUILD | Phase 59 (`entry-queue`) |
| `GET /dataentryduo/inventory/{companyId}` | Table entry_queue (device -> connector -> Tally) | BUILD | Phase 59 (`entry-queue`) |
| `GET /dataentryduo/invoice/{companyId}` | Table entry_queue (device -> connector -> Tally) | BUILD | Phase 59 (`entry-queue`) |
| `GET /dataentryduo/ledger/followups/{companyId}` | Table followups in license project | BUILD | Phase 45 (`followups`) |
| `GET /dataentryduo/ledger/user/followups/{companyId}` | Table followups in license project | BUILD | Phase 45 (`followups`) |
| `GET /dataentryduo/stockitem/{companyId}` | Table entry_queue (device -> connector -> Tally) | BUILD | Phase 59 (`entry-queue`) |
| `POST /dataentrytrio/journal` | Table entry_queue (device -> connector -> Tally) | BUILD | Phase 59 (`entry-queue`) |
| `GET /dataentrytrio/journal/{companyId}` | Table entry_queue (device -> connector -> Tally) | BUILD | Phase 59 (`entry-queue`) |
| `GET /device/installation` | devices table + companies via sync | BUILD | Phase 24 (`multi-company`) |
| `GET /invoice/autoshare/history` | Tables reminder_jobs/reminder_log + local delivery | REPLACED | Phase 46 (`reminders`) |
| `GET /invoice/autoshare/history/invoice?version=1` | Tables reminder_jobs/reminder_log + local delivery | REPLACED | Phase 46 (`reminders`) |
| `GET /invoice/autoshare/missingcontact?version=1` | Tables reminder_jobs/reminder_log + local delivery | REPLACED | Phase 46 (`reminders`) |
| `GET /merchant/v3/payment/detail/{payId}` | UPI QR (client side); gateway deferred | DEFERRED | Phase 44 (`upi-qr-banks`) |
| `POST /merchant/v3/payment/search` | UPI QR (client side); gateway deferred | DEFERRED | Phase 44 (`upi-qr-banks`) |
| `GET /merchant/v3/payment/status/{payId}` | UPI QR (client side); gateway deferred | DEFERRED | Phase 44 (`upi-qr-banks`) |
| `PUT /merchant/v3/payment/status/{payId}` | UPI QR (client side); gateway deferred | DEFERRED | Phase 44 (`upi-qr-banks`) |
| `GET /merchant/v4/accounts/{companyId}` | UPI QR (client side); gateway deferred | DEFERRED | Phase 44 (`upi-qr-banks`) |
| `POST /merchant/v4/accounts/{companyId}` | UPI QR (client side); gateway deferred | DEFERRED | Phase 44 (`upi-qr-banks`) |
| `POST /merchant/v4/enable/{companyId}` | UPI QR (client side); gateway deferred | DEFERRED | Phase 44 (`upi-qr-banks`) |
| `PUT /merchant/v4/gstDetails/confirm/{companyId}` | UPI QR (client side); gateway deferred | DEFERRED | Phase 44 (`upi-qr-banks`) |
| `PUT /merchant/v4/gstDetails/{companyId}` | UPI QR (client side); gateway deferred | DEFERRED | Phase 44 (`upi-qr-banks`) |
| `GET /merchant/v4/onboardingflow/{companyId}` | UPI QR (client side); gateway deferred | DEFERRED | Phase 44 (`upi-qr-banks`) |
| `POST /merchant/v4/payment/order` | UPI QR (client side); gateway deferred | DEFERRED | Phase 44 (`upi-qr-banks`) |
| `GET /merchant/v4/payment/settings/{companyId}` | UPI QR (client side); gateway deferred | DEFERRED | Phase 44 (`upi-qr-banks`) |
| `PUT /merchant/v4/payment/settings/{companyId}` | UPI QR (client side); gateway deferred | DEFERRED | Phase 44 (`upi-qr-banks`) |
| `GET /miscellaneous/claimed/rewards` | submit_request RPC / static help | REPLACED | Phase 78 (`settings-hub`) |
| `GET /miscellaneous/content/autoshareinvoice/faq` | Tables reminder_jobs/reminder_log + local delivery | REPLACED | Phase 46 (`reminders`) |
| `GET /miscellaneous/gets3presignedurl` | sync_requests + sync_chunks (+ snapshots when cloud_copy) | REPLACED | Phase 16 (`postbox-client`) |
| `POST /miscellaneous/redeem/reward` | submit_request RPC / static help | REPLACED | Phase 78 (`settings-hub`) |
| `GET /miscellaneous/referrals/v2` | Not needed | NA | — |
| `GET /miscellaneous/rewards` | submit_request RPC / static help | REPLACED | Phase 78 (`settings-hub`) |
| `GET /miscellaneous/templates` | submit_request RPC / static help | REPLACED | Phase 78 (`settings-hub`) |
| `POST /miscellaneous/whatsapp-optin` | Not needed (wa.me links) | REPLACED | Phase 49 (`greetings-messages`) |
| `GET /miscellaneousduo/erp-launch-data` | sync_requests + sync_chunks (+ snapshots when cloud_copy) | REPLACED | Phase 16 (`postbox-client`) |
| `GET /plan/details` | Master licenses/plans via bootstrap | REPLACED | Phase 12 (`flags-gate`) |
| `POST /reminder/auto` | Tables reminder_jobs/reminder_log + local delivery | REPLACED | Phase 46 (`reminders`) |
| `PUT /reminder/auto/disable/` | Tables reminder_jobs/reminder_log + local delivery | REPLACED | Phase 46 (`reminders`) |
| `GET /reminder/auto/ledgers` | Tables reminder_jobs/reminder_log + local delivery | REPLACED | Phase 46 (`reminders`) |
| `GET /reminder/auto/recent-invalid-contacts` | Tables reminder_jobs/reminder_log + local delivery | REPLACED | Phase 46 (`reminders`) |
| `GET /reminder/report` | Tables reminder_jobs/reminder_log + local delivery | REPLACED | Phase 46 (`reminders`) |
| `GET /reminder/report/job` | Tables reminder_jobs/reminder_log + local delivery | REPLACED | Phase 46 (`reminders`) |
| `GET /user/appsettings/{entity}` | Table app_settings | BUILD | Phase 78 (`settings-hub`) |
| `POST /user/appsettings/{entity}` | Table app_settings | BUILD | Phase 78 (`settings-hub`) |
| `POST /user/desktopsetup/email` | Supabase Auth (admin-issued email+password) | REPLACED | Phase 10 (`activate-login`) |
| `GET /user/manager/users` | Supabase Auth (admin-issued email+password) | REPLACED | Phase 10 (`activate-login`) |
| `GET /user/possible/managers` | Supabase Auth (admin-issued email+password) | REPLACED | Phase 10 (`activate-login`) |
| `POST /user/send-otp` | Supabase Auth (admin-issued email+password) | REPLACED | Phase 10 (`activate-login`) |
| `GET /wallet/v1/balance/{subscriptionId}` | Master licenses/plans via bootstrap | REPLACED | Phase 12 (`flags-gate`) |
| `POST /wallet/v1/purchase_history/{subscriptionId}` | Master licenses/plans via bootstrap | REPLACED | Phase 12 (`flags-gate`) |
| `POST /wallet/v1/transaction_history/{subscriptionId}` | Master licenses/plans via bootstrap | REPLACED | Phase 12 (`flags-gate`) |
| `CONST /user/referral/add` | Not needed | NA | — |
| `CONST /dataentryduo/inventory` | Table entry_queue (device -> connector -> Tally) | BUILD | Phase 59 (`entry-queue`) |
| `CONST /dataentryduo/invoice` | Table entry_queue (device -> connector -> Tally) | BUILD | Phase 59 (`entry-queue`) |
| `CONST /dataentry/ledgerentry` | Table entry_queue (device -> connector -> Tally) | BUILD | Phase 59 (`entry-queue`) |
| `CONST /dataentryduo/stockitem` | Table entry_queue (device -> connector -> Tally) | BUILD | Phase 59 (`entry-queue`) |
| `CONST /device/deactivate` | devices table + companies via sync | BUILD | Phase 24 (`multi-company`) |
| `CONST /Failed to connect to server. Please try again.` | Review | BUILD | Phase 78 (`settings-hub`) |
| `CONST /company/delete/imageurl` | devices table + companies via sync | BUILD | Phase 24 (`multi-company`) |
| `CONST /company/subscription/all` | Master licenses/plans via bootstrap | REPLACED | Phase 12 (`flags-gate`) |
| `CONST /dataentryduo/ledger/followup` | Table followups in license project | BUILD | Phase 45 (`followups`) |
| `CONST /device/active` | devices table + companies via sync | BUILD | Phase 24 (`multi-company`) |
| `CONST /https://api.ipify.org/?format=json` | Review | BUILD | Phase 78 (`settings-hub`) |
| `CONST /dataentry/punchinout/ledger/efficiency` | Table punch_logs in license project | BUILD | Phase 76 (`punch-in-out`) |
| `CONST /dataentry/user/punchinout/meetingreport` | Table punch_logs in license project | BUILD | Phase 76 (`punch-in-out`) |
| `CONST /miscellaneous/referrals` | Not needed | NA | — |
| `CONST /subscription` | Master licenses/plans via bootstrap | REPLACED | Phase 12 (`flags-gate`) |
| `CONST /device/user` | devices table + companies via sync | BUILD | Phase 24 (`multi-company`) |
| `CONST /services/gstinfo` | Read from local Dexie (synced data) | BUILD | Phase 40 (`reports-hub`) |
| `CONST /company/imageurl` | devices table + companies via sync | BUILD | Phase 24 (`multi-company`) |
| `CONST /merchant/v4/payment/invoice` | UPI QR (client side); gateway deferred | DEFERRED | Phase 44 (`upi-qr-banks`) |
| `CONST /merchant/v4/payment/link` | UPI QR (client side); gateway deferred | DEFERRED | Phase 44 (`upi-qr-banks`) |
| `CONST /dataentry/user/punchinout` | Table punch_logs in license project | BUILD | Phase 76 (`punch-in-out`) |
| `CONST /dataentry/user/punchinout/monthlyreport` | Table punch_logs in license project | BUILD | Phase 76 (`punch-in-out`) |
| `CONST /dataentry/allusers/punchinout/report` | Table punch_logs in license project | BUILD | Phase 76 (`punch-in-out`) |
| `CONST /reminder/manual` | Tables reminder_jobs/reminder_log + local delivery | REPLACED | Phase 46 (`reminders`) |
| `CONST /device/signout/subscription` | Master licenses/plans via bootstrap | REPLACED | Phase 12 (`flags-gate`) |
| `CONST /dataentry/update_order_entries` | Table entry_queue (device -> connector -> Tally) | BUILD | Phase 59 (`entry-queue`) |
| `CONST /dataentry/save_order_entry` | Table entry_queue (device -> connector -> Tally) | BUILD | Phase 59 (`entry-queue`) |
| `CONST /dataentry/save_transaction_entry` | Table entry_queue (device -> connector -> Tally) | BUILD | Phase 59 (`entry-queue`) |
| `CONST /dataentryduo/users/meeting/summary` | Table punch_logs in license project | BUILD | Phase 76 (`punch-in-out`) |
| `CONST /user/verify/otp` | Supabase Auth (admin-issued email+password) | REPLACED | Phase 10 (`activate-login`) |
| `CONST /miscellaneous/video` | submit_request RPC / static help | REPLACED | Phase 78 (`settings-hub`) |

## 5. Desktop (legacy connector) features

| Legacy desktop feature | LazyBooks desktop phase |
|---|---|
| Tally detection, license info (`$$LicenseInfo`/`$$ProdInfo`), company list | Phase 7 (`tally-detect`), Phase 9 (`tally-license-info`) |
| Masters + vouchers pull, alterId incremental | Phase 10 (`tally-masters`), Phase 11 (`tally-vouchers`) |
| Deleted-voucher check (daily), rename fix-ups | Phase 12 (`tally-deletes-renames`) |
| Ledger closing balance fetch (daily) | Phase 13 (`tally-closing`) |
| 5-minute sync scheduler, time-skew check | Phase 18 (`sync-scheduler`), Phase 14 (`tally-edge`) |
| Zip + AES + upload to vendor cloud | Phase 19 (`request-listener`), Phase 20 (`chunker`), Phase 21 (`encryption`),  serve-initial-delta (postbox) |
| Entry polling every 60 s + Import Data XML | Phase 24 (`entry-listener`), Phase 25 (`xml-builders`), Phase 26 (`master-writers`), Phase 27 (`idempotency`) |
| Angular UI: sign in/up, company add/edit, Tally config, home, voucher lists, settings, support, subscription transfer | Phase 33 (`ui-status`), Phase 35 (`ui-settings`), Phase 34 (`ui-logs`),  activation (license replaces sign-up), Phase 36 (`ui-pairing`) |
| Local SQLite (BizAnalystData) | Phase 15 (`sqlite-schema`), Phase 16 (`upsert-layer`) |
| Auto-update, installer | Phase 38 (`installer`), Phase 39 (`auto-update`) |
| Hourly health check/restart | Phase 2 (`tray-lifecycle`), Phase 41 (`hardening`) |

## 6. NEW in LazyBooks (not in the legacy app)

Admin panel (licenses, plans/flags, Supabase pool, user provisioning, themes, branding, GitHub release control, announcements, support queue, audit, backup) · light+dark theme JSON push · logo/icon push · per-license cloud-copy toggle · end-to-end encryption · Electron-embeddable PWA · app lock with WebAuthn · command palette · multi-theme user choice.
