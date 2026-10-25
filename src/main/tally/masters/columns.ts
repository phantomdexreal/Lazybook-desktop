/*
LazyBooks | src/main/tally/masters/columns.ts
Responsibility: tag-to-column map of the master tables (GENERATED from docs/shared/data_model.json; do not edit by hand)
Introduced by: Phase 10 (tally-masters)
STATUS: IMPLEMENTED (Phase 10)
Regenerate: node tools/gen-master-columns.mjs
*/

export interface ColumnSpec {
  /** column name */ n: string;
  /** column type from data_model */ t: string;
  /** default value */ d: string | number | boolean | null;
  /** Tally tag (`@NAME` = attribute, `A/B` = nested) */ tag?: string;
  /** parse hint */ h?: string;
}
export interface MasterTableSpec {
  request: string | null;
  type: string | null;
  object: string | null;
  columns: ColumnSpec[];
}

export const MASTER_TABLES: Record<string, MasterTableSpec> = {
 "tm_group": {
  "request": "LBGroups",
  "type": "Group",
  "object": "GROUP",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "guid",
    "t": "text",
    "d": "",
    "tag": "GUID",
    "h": "text"
   },
   {
    "n": "name",
    "t": "text",
    "d": "",
    "tag": "@NAME",
    "h": "text"
   },
   {
    "n": "name_lc",
    "t": "text",
    "d": ""
   },
   {
    "n": "parent_name",
    "t": "text",
    "d": "",
    "tag": "PARENT",
    "h": "text"
   },
   {
    "n": "parent_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "reserved_name",
    "t": "text",
    "d": "",
    "tag": "RESERVEDNAME",
    "h": "text"
   },
   {
    "n": "reserved_root",
    "t": "text",
    "d": ""
   },
   {
    "n": "is_revenue",
    "t": "bool",
    "d": false,
    "tag": "ISREVENUE",
    "h": "yesno"
   },
   {
    "n": "is_deemed_positive",
    "t": "bool",
    "d": false,
    "tag": "ISDEEMEDPOSITIVE",
    "h": "yesno"
   },
   {
    "n": "affects_gross_profit",
    "t": "bool",
    "d": false,
    "tag": "AFFECTSGROSSPROFIT",
    "h": "yesno"
   },
   {
    "n": "affects_stock",
    "t": "bool",
    "d": false,
    "tag": "AFFECTSSTOCK",
    "h": "yesno"
   },
   {
    "n": "is_billwise_on",
    "t": "bool",
    "d": false,
    "tag": "ISBILLWISEON",
    "h": "yesno"
   },
   {
    "n": "is_cost_centres_on",
    "t": "bool",
    "d": false,
    "tag": "ISCOSTCENTRESON",
    "h": "yesno"
   },
   {
    "n": "is_subledger",
    "t": "bool",
    "d": false,
    "tag": "ISSUBLEDGER",
    "h": "yesno"
   },
   {
    "n": "track_negative_balances",
    "t": "bool",
    "d": false,
    "tag": "TRACKNEGATIVEBALANCES",
    "h": "yesno"
   },
   {
    "n": "nature",
    "t": "text",
    "d": ""
   },
   {
    "n": "closing_balance",
    "t": "decimal",
    "d": "0.00",
    "tag": "CLOSINGBALANCE",
    "h": "amount"
   },
   {
    "n": "opening_balance",
    "t": "decimal",
    "d": "0.00",
    "tag": "OPENINGBALANCE",
    "h": "amount"
   },
   {
    "n": "closing_as_of",
    "t": "date",
    "d": null
   },
   {
    "n": "alter_id",
    "t": "int",
    "d": 0,
    "tag": "ALTERID",
    "h": "int"
   }
  ]
 },
 "tm_ledger": {
  "request": "LBLedgers",
  "type": "Ledger",
  "object": "LEDGER",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "guid",
    "t": "text",
    "d": "",
    "tag": "GUID",
    "h": "text"
   },
   {
    "n": "name",
    "t": "text",
    "d": "",
    "tag": "@NAME",
    "h": "text"
   },
   {
    "n": "name_lc",
    "t": "text",
    "d": ""
   },
   {
    "n": "aliases",
    "t": "json",
    "d": null,
    "tag": "LANGUAGENAME.LIST/NAME.LIST/NAME",
    "h": "list_text_tail"
   },
   {
    "n": "parent_name",
    "t": "text",
    "d": "",
    "tag": "PARENT",
    "h": "text"
   },
   {
    "n": "group_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "reserved_root",
    "t": "text",
    "d": ""
   },
   {
    "n": "opening_balance",
    "t": "decimal",
    "d": "0.00",
    "tag": "OPENINGBALANCE",
    "h": "amount"
   },
   {
    "n": "closing_balance",
    "t": "decimal",
    "d": "0.00",
    "tag": "CLOSINGBALANCE",
    "h": "amount"
   },
   {
    "n": "closing_as_of",
    "t": "date",
    "d": null
   },
   {
    "n": "is_billwise_on",
    "t": "bool",
    "d": false,
    "tag": "ISBILLWISEON",
    "h": "yesno"
   },
   {
    "n": "credit_period_days",
    "t": "int",
    "d": 0,
    "tag": "BILLCREDITPERIOD",
    "h": "days"
   },
   {
    "n": "credit_limit",
    "t": "decimal",
    "d": "0.00",
    "tag": "CREDITLIMIT",
    "h": "amount"
   },
   {
    "n": "gst_registration_type",
    "t": "text",
    "d": "",
    "tag": "GSTREGISTRATIONTYPE",
    "h": "text"
   },
   {
    "n": "gstin",
    "t": "text",
    "d": "",
    "tag": "PARTYGSTIN",
    "h": "text"
   },
   {
    "n": "state_name",
    "t": "text",
    "d": "",
    "tag": "LEDSTATENAME",
    "h": "text"
   },
   {
    "n": "country",
    "t": "text",
    "d": "",
    "tag": "COUNTRYNAME",
    "h": "text"
   },
   {
    "n": "pincode",
    "t": "text",
    "d": "",
    "tag": "PINCODE",
    "h": "text"
   },
   {
    "n": "email",
    "t": "text",
    "d": "",
    "tag": "EMAIL",
    "h": "text"
   },
   {
    "n": "email_cc",
    "t": "text",
    "d": "",
    "tag": "EMAILCC",
    "h": "text"
   },
   {
    "n": "phone",
    "t": "text",
    "d": "",
    "tag": "LEDGERPHONE",
    "h": "text"
   },
   {
    "n": "mobile",
    "t": "text",
    "d": "",
    "tag": "LEDGERMOBILE",
    "h": "text"
   },
   {
    "n": "contact_person",
    "t": "text",
    "d": "",
    "tag": "LEDGERCONTACT",
    "h": "text"
   },
   {
    "n": "pan",
    "t": "text",
    "d": "",
    "tag": "INCOMETAXNUMBER",
    "h": "text"
   },
   {
    "n": "description",
    "t": "text",
    "d": "",
    "tag": "DESCRIPTION",
    "h": "text"
   },
   {
    "n": "price_level",
    "t": "text",
    "d": "",
    "tag": "PRICELEVEL",
    "h": "text"
   },
   {
    "n": "bank_name",
    "t": "text",
    "d": "",
    "tag": "BANKINGCONFIGBANK",
    "h": "text"
   },
   {
    "n": "bank_account_no",
    "t": "text",
    "d": "",
    "tag": "BANKDETAILS",
    "h": "text"
   },
   {
    "n": "bank_branch",
    "t": "text",
    "d": "",
    "tag": "BANKBRANCHNAME",
    "h": "text"
   },
   {
    "n": "bank_ifsc",
    "t": "text",
    "d": "",
    "tag": "IFSCODE",
    "h": "text"
   },
   {
    "n": "bank_acc_holder",
    "t": "text",
    "d": "",
    "tag": "BANKACCHOLDERNAME",
    "h": "text"
   },
   {
    "n": "tax_type",
    "t": "text",
    "d": "",
    "tag": "TAXTYPE",
    "h": "text"
   },
   {
    "n": "gst_duty_head",
    "t": "text",
    "d": "",
    "tag": "GSTDUTYHEAD",
    "h": "text"
   },
   {
    "n": "gst_rate",
    "t": "decimal",
    "d": "0.00",
    "tag": "RATEOFTAXCALCULATION",
    "h": "amount"
   },
   {
    "n": "gst_type_of_supply",
    "t": "text",
    "d": "",
    "tag": "GSTTYPEOFSUPPLY",
    "h": "text"
   },
   {
    "n": "rounding_method",
    "t": "text",
    "d": "",
    "tag": "ROUNDINGMETHOD",
    "h": "text"
   },
   {
    "n": "rounding_limit",
    "t": "decimal",
    "d": "0.00",
    "tag": "ROUNDINGLIMIT",
    "h": "amount"
   },
   {
    "n": "is_cost_centres_on",
    "t": "bool",
    "d": false,
    "tag": "ISCOSTCENTRESON",
    "h": "yesno"
   },
   {
    "n": "address",
    "t": "json",
    "d": null,
    "tag": "ADDRESS.LIST",
    "h": "list_text"
   },
   {
    "n": "alter_id",
    "t": "int",
    "d": 0,
    "tag": "ALTERID",
    "h": "int"
   }
  ]
 },
 "tm_ledger_address": {
  "request": "LBLedgers",
  "type": "Ledger",
  "object": "LEDGER",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "ledger_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "addr_index",
    "t": "int",
    "d": 0
   },
   {
    "n": "applicable_from",
    "t": "date",
    "d": null,
    "tag": "APPLICABLEFROM",
    "h": "tally_date"
   },
   {
    "n": "mailing_name",
    "t": "text",
    "d": "",
    "tag": "MAILINGNAME",
    "h": "text"
   },
   {
    "n": "lines",
    "t": "json",
    "d": null,
    "tag": "ADDRESS.LIST",
    "h": "list_text"
   },
   {
    "n": "state_name",
    "t": "text",
    "d": "",
    "tag": "STATE",
    "h": "text"
   },
   {
    "n": "country",
    "t": "text",
    "d": "",
    "tag": "COUNTRY",
    "h": "text"
   },
   {
    "n": "pincode",
    "t": "text",
    "d": "",
    "tag": "PINCODE",
    "h": "text"
   }
  ]
 },
 "tm_ledger_contact": {
  "request": "LBLedgers",
  "type": "Ledger",
  "object": "LEDGER",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "ledger_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "contact_index",
    "t": "int",
    "d": 0
   },
   {
    "n": "name",
    "t": "text",
    "d": "",
    "tag": "LEDGERCONTACT",
    "h": "text"
   },
   {
    "n": "phone",
    "t": "text",
    "d": "",
    "tag": "LEDGERPHONE",
    "h": "text"
   },
   {
    "n": "mobile",
    "t": "text",
    "d": "",
    "tag": "LEDGERMOBILE",
    "h": "text"
   },
   {
    "n": "email",
    "t": "text",
    "d": "",
    "tag": "EMAIL",
    "h": "text"
   },
   {
    "n": "designation",
    "t": "text",
    "d": "",
    "tag": "DESIGNATION",
    "h": "text"
   },
   {
    "n": "is_primary",
    "t": "bool",
    "d": false
   }
  ]
 },
 "tm_ledger_gst": {
  "request": "LBLedgers",
  "type": "Ledger",
  "object": "LEDGER",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "ledger_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "applicable_from",
    "t": "date",
    "d": "1900-01-01",
    "tag": "APPLICABLEFROM",
    "h": "tally_date"
   },
   {
    "n": "gst_registration_type",
    "t": "text",
    "d": "",
    "tag": "GSTREGISTRATIONTYPE",
    "h": "text"
   },
   {
    "n": "gstin",
    "t": "text",
    "d": "",
    "tag": "GSTIN",
    "h": "text"
   },
   {
    "n": "place_of_supply",
    "t": "text",
    "d": "",
    "tag": "PLACEOFSUPPLY",
    "h": "text"
   },
   {
    "n": "is_other_territory",
    "t": "bool",
    "d": false,
    "tag": "ISOTHTERRITORYASSESSEE",
    "h": "yesno"
   },
   {
    "n": "is_transporter",
    "t": "bool",
    "d": false,
    "tag": "ISTRANSPORTER",
    "h": "yesno"
   },
   {
    "n": "transporter_id",
    "t": "text",
    "d": "",
    "tag": "TRANSPORTERID",
    "h": "text"
   }
  ]
 },
 "tm_ledger_opening_bill": {
  "request": "LBLedgers",
  "type": "Ledger",
  "object": "LEDGER",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "ledger_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "bill_index",
    "t": "int",
    "d": 0
   },
   {
    "n": "bill_name",
    "t": "text",
    "d": "",
    "tag": "NAME",
    "h": "text"
   },
   {
    "n": "bill_date",
    "t": "date",
    "d": "1900-01-01",
    "tag": "BILLDATE",
    "h": "tally_date"
   },
   {
    "n": "credit_period_days",
    "t": "int",
    "d": 0,
    "tag": "BILLCREDITPERIOD",
    "h": "days"
   },
   {
    "n": "amount",
    "t": "decimal",
    "d": "0.00",
    "tag": "OPENINGBALANCE",
    "h": "amount"
   }
  ]
 },
 "tm_voucher_type": {
  "request": "LBVoucherTypes",
  "type": "VoucherType",
  "object": "VOUCHERTYPE",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "guid",
    "t": "text",
    "d": "",
    "tag": "GUID",
    "h": "text"
   },
   {
    "n": "name",
    "t": "text",
    "d": "",
    "tag": "@NAME",
    "h": "text"
   },
   {
    "n": "name_lc",
    "t": "text",
    "d": ""
   },
   {
    "n": "parent_name",
    "t": "text",
    "d": "",
    "tag": "PARENT",
    "h": "text"
   },
   {
    "n": "base_kind",
    "t": "text",
    "d": ""
   },
   {
    "n": "numbering_method",
    "t": "text",
    "d": "",
    "tag": "NUMBERINGMETHOD",
    "h": "text"
   },
   {
    "n": "prevent_duplicates",
    "t": "bool",
    "d": false,
    "tag": "PREVENTDUPLICATES",
    "h": "yesno"
   },
   {
    "n": "use_for_pos_invoice",
    "t": "bool",
    "d": false,
    "tag": "USEFORPOSINVOICE",
    "h": "yesno"
   },
   {
    "n": "classes",
    "t": "json",
    "d": null,
    "tag": "VOUCHERCLASSLIST.LIST",
    "h": "json_list"
   },
   {
    "n": "number_series",
    "t": "json",
    "d": null,
    "tag": "VOUCHERNUMBERSERIES.LIST",
    "h": "json_list"
   },
   {
    "n": "alter_id",
    "t": "int",
    "d": 0,
    "tag": "ALTERID",
    "h": "int"
   }
  ]
 },
 "tm_stock_group": {
  "request": "LBStockGroups",
  "type": "StockGroup",
  "object": "STOCKGROUP",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "guid",
    "t": "text",
    "d": "",
    "tag": "GUID",
    "h": "text"
   },
   {
    "n": "name",
    "t": "text",
    "d": "",
    "tag": "@NAME",
    "h": "text"
   },
   {
    "n": "name_lc",
    "t": "text",
    "d": ""
   },
   {
    "n": "parent_name",
    "t": "text",
    "d": "",
    "tag": "PARENT",
    "h": "text"
   },
   {
    "n": "parent_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "base_units",
    "t": "text",
    "d": "",
    "tag": "BASEUNITS",
    "h": "text"
   },
   {
    "n": "costing_method",
    "t": "text",
    "d": "",
    "tag": "COSTINGMETHOD",
    "h": "text"
   },
   {
    "n": "valuation_method",
    "t": "text",
    "d": "",
    "tag": "VALUATIONMETHOD",
    "h": "text"
   },
   {
    "n": "is_batch_wise",
    "t": "bool",
    "d": false,
    "tag": "ISBATCHWISEON",
    "h": "yesno"
   },
   {
    "n": "is_perishable",
    "t": "bool",
    "d": false,
    "tag": "ISPERISHABLEON",
    "h": "yesno"
   },
   {
    "n": "ignore_negative_stock",
    "t": "bool",
    "d": false,
    "tag": "IGNORENEGATIVESTOCK",
    "h": "yesno"
   },
   {
    "n": "alter_id",
    "t": "int",
    "d": 0,
    "tag": "ALTERID",
    "h": "int"
   }
  ]
 },
 "tm_stock_category": {
  "request": "LBStockCategories",
  "type": "StockCategory",
  "object": "STOCKCATEGORY",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "guid",
    "t": "text",
    "d": "",
    "tag": "GUID",
    "h": "text"
   },
   {
    "n": "name",
    "t": "text",
    "d": "",
    "tag": "@NAME",
    "h": "text"
   },
   {
    "n": "name_lc",
    "t": "text",
    "d": ""
   },
   {
    "n": "parent_name",
    "t": "text",
    "d": "",
    "tag": "PARENT",
    "h": "text"
   },
   {
    "n": "parent_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "alter_id",
    "t": "int",
    "d": 0,
    "tag": "ALTERID",
    "h": "int"
   }
  ]
 },
 "tm_unit": {
  "request": "LBUnits",
  "type": "Unit",
  "object": "UNIT",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "guid",
    "t": "text",
    "d": "",
    "tag": "GUID",
    "h": "text"
   },
   {
    "n": "name",
    "t": "text",
    "d": "",
    "tag": "@NAME",
    "h": "text"
   },
   {
    "n": "is_simple_unit",
    "t": "bool",
    "d": false,
    "tag": "ISSIMPLEUNIT",
    "h": "yesno"
   },
   {
    "n": "base_unit",
    "t": "text",
    "d": "",
    "tag": "BASEUNITS",
    "h": "text"
   },
   {
    "n": "additional_unit",
    "t": "text",
    "d": "",
    "tag": "ADDITIONALUNITS",
    "h": "text"
   },
   {
    "n": "conversion",
    "t": "decimal",
    "d": "0.00",
    "tag": "CONVERSION",
    "h": "amount"
   },
   {
    "n": "decimal_places",
    "t": "int",
    "d": 0,
    "tag": "DECIMALPLACES",
    "h": "int"
   },
   {
    "n": "gst_uqc",
    "t": "text",
    "d": "",
    "tag": "GSTREPUOM",
    "h": "text"
   },
   {
    "n": "alter_id",
    "t": "int",
    "d": 0,
    "tag": "ALTERID",
    "h": "int"
   }
  ]
 },
 "tm_godown": {
  "request": "LBGodowns",
  "type": "Godown",
  "object": "GODOWN",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "guid",
    "t": "text",
    "d": "",
    "tag": "GUID",
    "h": "text"
   },
   {
    "n": "name",
    "t": "text",
    "d": "",
    "tag": "@NAME",
    "h": "text"
   },
   {
    "n": "name_lc",
    "t": "text",
    "d": ""
   },
   {
    "n": "parent_name",
    "t": "text",
    "d": "",
    "tag": "PARENT",
    "h": "text"
   },
   {
    "n": "parent_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "address",
    "t": "json",
    "d": null,
    "tag": "ADDRESS.LIST",
    "h": "list_text"
   },
   {
    "n": "pincode",
    "t": "text",
    "d": "",
    "tag": "PINCODE",
    "h": "text"
   },
   {
    "n": "phone",
    "t": "text",
    "d": "",
    "tag": "PHONENUMBER",
    "h": "text"
   },
   {
    "n": "alter_id",
    "t": "int",
    "d": 0,
    "tag": "ALTERID",
    "h": "int"
   }
  ]
 },
 "tm_stock_item": {
  "request": "LBStockItems",
  "type": "StockItem",
  "object": "STOCKITEM",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "guid",
    "t": "text",
    "d": "",
    "tag": "GUID",
    "h": "text"
   },
   {
    "n": "name",
    "t": "text",
    "d": "",
    "tag": "@NAME",
    "h": "text"
   },
   {
    "n": "name_lc",
    "t": "text",
    "d": ""
   },
   {
    "n": "aliases",
    "t": "json",
    "d": null,
    "tag": "LANGUAGENAME.LIST/NAME.LIST/NAME",
    "h": "list_text_tail"
   },
   {
    "n": "parent_name",
    "t": "text",
    "d": "",
    "tag": "PARENT",
    "h": "text"
   },
   {
    "n": "parent_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "category_name",
    "t": "text",
    "d": "",
    "tag": "CATEGORY",
    "h": "text"
   },
   {
    "n": "category_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "base_unit",
    "t": "text",
    "d": "",
    "tag": "BASEUNITS",
    "h": "text"
   },
   {
    "n": "additional_unit",
    "t": "text",
    "d": "",
    "tag": "ADDITIONALUNITS",
    "h": "text"
   },
   {
    "n": "denominator",
    "t": "decimal",
    "d": "0.00",
    "tag": "DENOMINATOR",
    "h": "amount"
   },
   {
    "n": "conversion",
    "t": "decimal",
    "d": "0.00",
    "tag": "CONVERSION",
    "h": "amount"
   },
   {
    "n": "opening_qty",
    "t": "decimal",
    "d": "0.00",
    "tag": "OPENINGBALANCE",
    "h": "qty"
   },
   {
    "n": "opening_value",
    "t": "decimal",
    "d": "0.00",
    "tag": "OPENINGVALUE",
    "h": "amount"
   },
   {
    "n": "closing_qty",
    "t": "decimal",
    "d": "0.00",
    "tag": "CLOSINGBALANCE",
    "h": "qty"
   },
   {
    "n": "closing_value",
    "t": "decimal",
    "d": "0.00",
    "tag": "CLOSINGVALUE",
    "h": "amount"
   },
   {
    "n": "closing_rate",
    "t": "decimal",
    "d": "0.00"
   },
   {
    "n": "closing_as_of",
    "t": "date",
    "d": null
   },
   {
    "n": "last_sale_date",
    "t": "date",
    "d": null,
    "tag": "LASTSALEDATE",
    "h": "tally_date"
   },
   {
    "n": "gst_applicable",
    "t": "bool",
    "d": false,
    "tag": "GSTAPPLICABLE",
    "h": "yesno_applicable"
   },
   {
    "n": "gst_type_of_supply",
    "t": "text",
    "d": "",
    "tag": "GSTTYPEOFSUPPLY",
    "h": "text"
   },
   {
    "n": "hsn_code",
    "t": "text",
    "d": "",
    "tag": "HSNDETAILS.LIST/HSNCODE",
    "h": "text"
   },
   {
    "n": "description",
    "t": "text",
    "d": "",
    "tag": "DESCRIPTION",
    "h": "text"
   },
   {
    "n": "part_no",
    "t": "text",
    "d": "",
    "tag": "PARTNO",
    "h": "text"
   },
   {
    "n": "costing_method",
    "t": "text",
    "d": "",
    "tag": "COSTINGMETHOD",
    "h": "text"
   },
   {
    "n": "valuation_method",
    "t": "text",
    "d": "",
    "tag": "VALUATIONMETHOD",
    "h": "text"
   },
   {
    "n": "is_batch_wise",
    "t": "bool",
    "d": false,
    "tag": "ISBATCHWISEON",
    "h": "yesno"
   },
   {
    "n": "is_perishable",
    "t": "bool",
    "d": false,
    "tag": "ISPERISHABLEON",
    "h": "yesno"
   },
   {
    "n": "reorder_level",
    "t": "decimal",
    "d": "0.00",
    "tag": "REORDERBASE",
    "h": "qty"
   },
   {
    "n": "min_order_qty",
    "t": "decimal",
    "d": "0.00",
    "tag": "MINIMUMORDERBASE",
    "h": "qty"
   },
   {
    "n": "mrp",
    "t": "json",
    "d": null,
    "tag": "MRPDETAILS.LIST",
    "h": "json_list"
   },
   {
    "n": "price_lists",
    "t": "json",
    "d": null,
    "tag": "FULLPRICELIST.LIST",
    "h": "json_list"
   },
   {
    "n": "standard_cost",
    "t": "json",
    "d": null,
    "tag": "STANDARDCOSTLIST.LIST",
    "h": "json_list"
   },
   {
    "n": "alter_id",
    "t": "int",
    "d": 0,
    "tag": "ALTERID",
    "h": "int"
   }
  ]
 },
 "tm_stock_item_gst": {
  "request": "LBStockItems",
  "type": "StockItem",
  "object": "STOCKITEM",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "stock_item_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "applicable_from",
    "t": "date",
    "d": "1900-01-01",
    "tag": "APPLICABLEFROM",
    "h": "tally_date"
   },
   {
    "n": "hsn_code",
    "t": "text",
    "d": "",
    "tag": "HSNCODE",
    "h": "text"
   },
   {
    "n": "taxability",
    "t": "text",
    "d": "",
    "tag": "TAXABILITY",
    "h": "text"
   },
   {
    "n": "calc_type",
    "t": "text",
    "d": "",
    "tag": "GSTCALCSLABONMRP",
    "h": "text"
   },
   {
    "n": "is_reverse_charge",
    "t": "bool",
    "d": false,
    "tag": "REVERSECHARGEAPPLICABLE",
    "h": "yesno"
   },
   {
    "n": "igst_rate",
    "t": "decimal",
    "d": "0.00"
   },
   {
    "n": "cgst_rate",
    "t": "decimal",
    "d": "0.00"
   },
   {
    "n": "sgst_rate",
    "t": "decimal",
    "d": "0.00"
   },
   {
    "n": "cess_rate",
    "t": "decimal",
    "d": "0.00"
   }
  ]
 },
 "tm_stock_batch_opening": {
  "request": "LBStockItems",
  "type": "StockItem",
  "object": "STOCKITEM",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "stock_item_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "godown_name",
    "t": "text",
    "d": "",
    "tag": "GODOWNNAME",
    "h": "text"
   },
   {
    "n": "godown_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "batch_name",
    "t": "text",
    "d": "",
    "tag": "BATCHNAME",
    "h": "text"
   },
   {
    "n": "opening_qty",
    "t": "decimal",
    "d": "0.00",
    "tag": "OPENINGBALANCE",
    "h": "qty"
   },
   {
    "n": "opening_value",
    "t": "decimal",
    "d": "0.00",
    "tag": "OPENINGVALUE",
    "h": "amount"
   },
   {
    "n": "mfg_date",
    "t": "date",
    "d": null,
    "tag": "MFDON",
    "h": "tally_date"
   },
   {
    "n": "expiry_date",
    "t": "date",
    "d": null,
    "tag": "EXPIRYPERIOD",
    "h": "tally_date"
   }
  ]
 },
 "tm_cost_centre": {
  "request": "LBCostCentres",
  "type": "CostCentre",
  "object": "COSTCENTRE",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "guid",
    "t": "text",
    "d": "",
    "tag": "GUID",
    "h": "text"
   },
   {
    "n": "name",
    "t": "text",
    "d": "",
    "tag": "@NAME",
    "h": "text"
   },
   {
    "n": "name_lc",
    "t": "text",
    "d": ""
   },
   {
    "n": "parent_name",
    "t": "text",
    "d": "",
    "tag": "PARENT",
    "h": "text"
   },
   {
    "n": "category_name",
    "t": "text",
    "d": "",
    "tag": "CATEGORY",
    "h": "text"
   },
   {
    "n": "for_payroll",
    "t": "bool",
    "d": false,
    "tag": "FORPAYROLL",
    "h": "yesno"
   },
   {
    "n": "is_employee_group",
    "t": "bool",
    "d": false,
    "tag": "ISEMPLOYEEGROUP",
    "h": "yesno"
   },
   {
    "n": "alter_id",
    "t": "int",
    "d": 0,
    "tag": "ALTERID",
    "h": "int"
   }
  ]
 },
 "tm_currency": {
  "request": "LBCurrencies",
  "type": "Currency",
  "object": "CURRENCY",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "guid",
    "t": "text",
    "d": "",
    "tag": "GUID",
    "h": "text"
   },
   {
    "n": "name",
    "t": "text",
    "d": "",
    "tag": "@NAME",
    "h": "text"
   },
   {
    "n": "formal_name",
    "t": "text",
    "d": "",
    "tag": "MAILINGNAME",
    "h": "text"
   },
   {
    "n": "symbol",
    "t": "text",
    "d": "",
    "tag": "ORIGINALSYMBOL",
    "h": "text"
   },
   {
    "n": "decimal_places",
    "t": "int",
    "d": 2,
    "tag": "DECIMALPLACES",
    "h": "int"
   },
   {
    "n": "alter_id",
    "t": "int",
    "d": 0,
    "tag": "ALTERID",
    "h": "int"
   }
  ]
 },
 "tm_employee": {
  "request": "LBEmployees",
  "type": "Employee",
  "object": "EMPLOYEE",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "guid",
    "t": "text",
    "d": "",
    "tag": "GUID",
    "h": "text"
   },
   {
    "n": "name",
    "t": "text",
    "d": "",
    "tag": "@NAME",
    "h": "text"
   },
   {
    "n": "name_lc",
    "t": "text",
    "d": ""
   },
   {
    "n": "parent_name",
    "t": "text",
    "d": "",
    "tag": "PARENT",
    "h": "text"
   },
   {
    "n": "employee_number",
    "t": "text",
    "d": "",
    "tag": "EMPLOYEENUMBER",
    "h": "text"
   },
   {
    "n": "designation",
    "t": "text",
    "d": "",
    "tag": "DESIGNATION",
    "h": "text"
   },
   {
    "n": "date_of_joining",
    "t": "date",
    "d": null,
    "tag": "DATEOFJOINING",
    "h": "tally_date"
   },
   {
    "n": "pan",
    "t": "text",
    "d": "",
    "tag": "INCOMETAXNUMBER",
    "h": "text"
   },
   {
    "n": "mobile",
    "t": "text",
    "d": "",
    "tag": "CONTACTNUMBERS",
    "h": "text"
   },
   {
    "n": "alter_id",
    "t": "int",
    "d": 0,
    "tag": "ALTERID",
    "h": "int"
   }
  ]
 },
 "tm_gst_registration": {
  "request": "LBTaxUnits",
  "type": "TaxUnit",
  "object": "TAXUNIT",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "guid",
    "t": "text",
    "d": "",
    "tag": "GUID",
    "h": "text"
   },
   {
    "n": "name",
    "t": "text",
    "d": "",
    "tag": "@NAME",
    "h": "text"
   },
   {
    "n": "gstin",
    "t": "text",
    "d": "",
    "tag": "GSTREGNUMBER",
    "h": "text"
   },
   {
    "n": "state_name",
    "t": "text",
    "d": "",
    "tag": "GSTDETAILS.LIST/STATENAME",
    "h": "text"
   },
   {
    "n": "registration_type",
    "t": "text",
    "d": "",
    "tag": "GSTDETAILS.LIST/GSTREGISTRATIONTYPE",
    "h": "text"
   },
   {
    "n": "applicable_from",
    "t": "date",
    "d": null,
    "tag": "GSTDETAILS.LIST/APPLICABLEFROM",
    "h": "tally_date"
   },
   {
    "n": "alter_id",
    "t": "int",
    "d": 0,
    "tag": "ALTERID",
    "h": "int"
   }
  ]
 }
};

/** ref_voucher_kind: [Tally reserved voucher type name, kind]; used for the parent walk of voucher types. */
export const VOUCHER_KIND_BY_TALLY_NAME: Array<[string, string]> = [["Sales","sales"],["Purchase","purchase"],["Receipt","receipt"],["Payment","payment"],["Contra","contra"],["Journal","journal"],["Credit Note","credit_note"],["Debit Note","debit_note"],["Delivery Note","delivery_note"],["Receipt Note","receipt_note"],["Rejections In","rejections_in"],["Rejections Out","rejections_out"],["Sales Order","sales_order"],["Purchase Order","purchase_order"],["Job Work In Order","job_work_in_order"],["Job Work Out Order","job_work_out_order"],["Stock Journal","stock_journal"],["Physical Stock","physical_stock"],["Material In","material_in"],["Material Out","material_out"],["Memorandum","memorandum"],["Reversing Journal","reversing_journal"],["Payroll","payroll"],["Attendance","attendance"]];
