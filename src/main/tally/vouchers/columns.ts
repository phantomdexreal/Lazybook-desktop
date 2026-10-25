/*
LazyBooks | src/main/tally/vouchers/columns.ts
Responsibility: tag-to-column map of the voucher tables (GENERATED from docs/shared/data_model.json; do not edit by hand)
Introduced by: Phase 11 (tally-vouchers)
STATUS: IMPLEMENTED (Phase 11)
Regenerate: node tools/gen-master-columns.mjs
*/

import type { MasterTableSpec } from '../masters/columns';

export const VOUCHER_TABLES: Record<string, MasterTableSpec> = {
 "tx_voucher": {
  "request": "LBVouchers",
  "type": "Voucher",
  "object": "VOUCHER",
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
    "n": "alter_id",
    "t": "int",
    "d": 0,
    "tag": "ALTERID",
    "h": "int"
   },
   {
    "n": "master_id",
    "t": "int",
    "d": 0,
    "tag": "MASTERID",
    "h": "int"
   },
   {
    "n": "voucher_type_name",
    "t": "text",
    "d": "",
    "tag": "VOUCHERTYPENAME",
    "h": "text"
   },
   {
    "n": "voucher_type_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "kind",
    "t": "text",
    "d": ""
   },
   {
    "n": "date",
    "t": "date",
    "d": "1900-01-01",
    "tag": "DATE",
    "h": "tally_date"
   },
   {
    "n": "effective_date",
    "t": "date",
    "d": null,
    "tag": "EFFECTIVEDATE",
    "h": "tally_date"
   },
   {
    "n": "number",
    "t": "text",
    "d": "",
    "tag": "VOUCHERNUMBER",
    "h": "text"
   },
   {
    "n": "reference",
    "t": "text",
    "d": "",
    "tag": "REFERENCE",
    "h": "text"
   },
   {
    "n": "reference_date",
    "t": "date",
    "d": null,
    "tag": "REFERENCEDATE",
    "h": "tally_date"
   },
   {
    "n": "narration",
    "t": "text",
    "d": "",
    "tag": "NARRATION",
    "h": "text"
   },
   {
    "n": "party_name",
    "t": "text",
    "d": "",
    "tag": "PARTYLEDGERNAME",
    "h": "text"
   },
   {
    "n": "party_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "party_gstin",
    "t": "text",
    "d": "",
    "tag": "PARTYGSTIN",
    "h": "text"
   },
   {
    "n": "company_gstin",
    "t": "text",
    "d": "",
    "tag": "CMPGSTIN",
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
    "n": "state_name",
    "t": "text",
    "d": "",
    "tag": "STATENAME",
    "h": "text"
   },
   {
    "n": "consignee_name",
    "t": "text",
    "d": "",
    "tag": "CONSIGNEEMAILINGNAME",
    "h": "text"
   },
   {
    "n": "consignee_gstin",
    "t": "text",
    "d": "",
    "tag": "CONSIGNEEGSTIN",
    "h": "text"
   },
   {
    "n": "consignee_state",
    "t": "text",
    "d": "",
    "tag": "CONSIGNEESTATENAME",
    "h": "text"
   },
   {
    "n": "buyer_name",
    "t": "text",
    "d": "",
    "tag": "BASICBUYERNAME",
    "h": "text"
   },
   {
    "n": "address",
    "t": "json",
    "d": null,
    "tag": "ADDRESS.LIST",
    "h": "list_text"
   },
   {
    "n": "is_invoice",
    "t": "bool",
    "d": false,
    "tag": "ISINVOICE",
    "h": "yesno"
   },
   {
    "n": "is_optional",
    "t": "bool",
    "d": false,
    "tag": "ISOPTIONAL",
    "h": "yesno"
   },
   {
    "n": "is_cancelled",
    "t": "bool",
    "d": false,
    "tag": "ISCANCELLED",
    "h": "yesno"
   },
   {
    "n": "is_void",
    "t": "bool",
    "d": false,
    "tag": "ISVOID",
    "h": "yesno"
   },
   {
    "n": "is_postdated",
    "t": "bool",
    "d": false,
    "tag": "ISPOSTDATED",
    "h": "yesno"
   },
   {
    "n": "is_on_hold",
    "t": "bool",
    "d": false,
    "tag": "ISONHOLD",
    "h": "yesno"
   },
   {
    "n": "is_reverse_charge",
    "t": "bool",
    "d": false,
    "tag": "ISREVERSECHARGEAPPLICABLE",
    "h": "yesno"
   },
   {
    "n": "gst_registration_type",
    "t": "text",
    "d": "",
    "tag": "GSTREGISTRATIONTYPE",
    "h": "text"
   },
   {
    "n": "counts_in_books",
    "t": "bool",
    "d": false
   },
   {
    "n": "amount",
    "t": "decimal",
    "d": "0.00"
   },
   {
    "n": "due_days",
    "t": "int",
    "d": 0,
    "tag": "BASICDUEDATEOFPYMT",
    "h": "days"
   },
   {
    "n": "order_ref",
    "t": "text",
    "d": "",
    "tag": "BASICORDERREF",
    "h": "text"
   },
   {
    "n": "remote_id",
    "t": "text",
    "d": "",
    "tag": "@REMOTEID",
    "h": "text"
   },
   {
    "n": "entered_by",
    "t": "text",
    "d": "",
    "tag": "ENTEREDBY",
    "h": "text"
   },
   {
    "n": "irn",
    "t": "text",
    "d": "",
    "tag": "IRN",
    "h": "text"
   },
   {
    "n": "irn_ack_no",
    "t": "text",
    "d": "",
    "tag": "IRNACKNO",
    "h": "text"
   },
   {
    "n": "irn_ack_date",
    "t": "text",
    "d": "",
    "tag": "IRNACKDATE",
    "h": "text"
   },
   {
    "n": "irn_cancelled",
    "t": "bool",
    "d": false,
    "tag": "IRNCANCELLED",
    "h": "yesno"
   },
   {
    "n": "eway_bill_no",
    "t": "text",
    "d": "",
    "tag": "EWAYBILLDETAILS.LIST/EWAYBILLNO",
    "h": "text"
   },
   {
    "n": "eway",
    "t": "json",
    "d": null,
    "tag": "EWAYBILLDETAILS.LIST",
    "h": "json_list"
   },
   {
    "n": "godown_source",
    "t": "text",
    "d": "",
    "tag": "VOUCHERSOURCEGODOWN",
    "h": "text"
   },
   {
    "n": "godown_destination",
    "t": "text",
    "d": "",
    "tag": "VOUCHERDESTINATIONGODOWN",
    "h": "text"
   }
  ]
 },
 "tx_ledger_line": {
  "request": "LBVouchers",
  "type": "Voucher",
  "object": "VOUCHER",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "voucher_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "line_index",
    "t": "int",
    "d": 0
   },
   {
    "n": "source",
    "t": "text",
    "d": ""
   },
   {
    "n": "inv_line_index",
    "t": "int",
    "d": -1
   },
   {
    "n": "ledger_name",
    "t": "text",
    "d": "",
    "tag": "LEDGERNAME",
    "h": "text"
   },
   {
    "n": "ledger_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "amount",
    "t": "decimal",
    "d": "0.00",
    "tag": "AMOUNT",
    "h": "amount"
   },
   {
    "n": "is_deemed_positive",
    "t": "bool",
    "d": false,
    "tag": "ISDEEMEDPOSITIVE",
    "h": "yesno"
   },
   {
    "n": "is_party_ledger",
    "t": "bool",
    "d": false,
    "tag": "ISPARTYLEDGER",
    "h": "yesno"
   },
   {
    "n": "voucher_date",
    "t": "date",
    "d": "1900-01-01"
   },
   {
    "n": "voucher_kind",
    "t": "text",
    "d": ""
   },
   {
    "n": "counts_in_books",
    "t": "bool",
    "d": false
   }
  ]
 },
 "tx_inventory_line": {
  "request": "LBVouchers",
  "type": "Voucher",
  "object": "VOUCHER",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "voucher_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "line_index",
    "t": "int",
    "d": 0
   },
   {
    "n": "stock_item_name",
    "t": "text",
    "d": "",
    "tag": "STOCKITEMNAME",
    "h": "text"
   },
   {
    "n": "stock_item_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "billed_qty",
    "t": "decimal",
    "d": "0.00",
    "tag": "BILLEDQTY",
    "h": "qty"
   },
   {
    "n": "actual_qty",
    "t": "decimal",
    "d": "0.00",
    "tag": "ACTUALQTY",
    "h": "qty"
   },
   {
    "n": "unit",
    "t": "text",
    "d": "",
    "tag": "BILLEDQTY",
    "h": "qty_unit"
   },
   {
    "n": "rate",
    "t": "decimal",
    "d": "0.00",
    "tag": "RATE",
    "h": "rate"
   },
   {
    "n": "rate_unit",
    "t": "text",
    "d": "",
    "tag": "RATE",
    "h": "rate_unit"
   },
   {
    "n": "discount_pct",
    "t": "decimal",
    "d": "0.00",
    "tag": "DISCOUNT",
    "h": "amount"
   },
   {
    "n": "amount",
    "t": "decimal",
    "d": "0.00",
    "tag": "AMOUNT",
    "h": "amount"
   },
   {
    "n": "is_deemed_positive",
    "t": "bool",
    "d": false,
    "tag": "ISDEEMEDPOSITIVE",
    "h": "yesno"
   },
   {
    "n": "hsn_code",
    "t": "text",
    "d": "",
    "tag": "GSTHSNNAME",
    "h": "text"
   },
   {
    "n": "description",
    "t": "text",
    "d": "",
    "tag": "BASICUSERDESCRIPTION.LIST",
    "h": "list_text_join"
   },
   {
    "n": "gst_taxability",
    "t": "text",
    "d": "",
    "tag": "GSTOVRDNTAXABILITY",
    "h": "text"
   },
   {
    "n": "godown_name",
    "t": "text",
    "d": "",
    "tag": "BATCHALLOCATIONS.LIST/GODOWNNAME",
    "h": "text"
   },
   {
    "n": "godown_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "voucher_date",
    "t": "date",
    "d": "1900-01-01"
   },
   {
    "n": "voucher_kind",
    "t": "text",
    "d": ""
   },
   {
    "n": "counts_in_books",
    "t": "bool",
    "d": false
   }
  ]
 },
 "tx_batch_alloc": {
  "request": "LBVouchers",
  "type": "Voucher",
  "object": "VOUCHER",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "voucher_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "line_index",
    "t": "int",
    "d": 0
   },
   {
    "n": "alloc_index",
    "t": "int",
    "d": 0
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
    "n": "billed_qty",
    "t": "decimal",
    "d": "0.00",
    "tag": "BILLEDQTY",
    "h": "qty"
   },
   {
    "n": "actual_qty",
    "t": "decimal",
    "d": "0.00",
    "tag": "ACTUALQTY",
    "h": "qty"
   },
   {
    "n": "amount",
    "t": "decimal",
    "d": "0.00",
    "tag": "AMOUNT",
    "h": "amount"
   },
   {
    "n": "order_no",
    "t": "text",
    "d": "",
    "tag": "ORDERNO",
    "h": "text"
   },
   {
    "n": "order_due_date",
    "t": "date",
    "d": null,
    "tag": "ORDERDUEDATE",
    "h": "tally_date"
   },
   {
    "n": "tracking_no",
    "t": "text",
    "d": "",
    "tag": "TRACKINGNUMBER",
    "h": "text"
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
   },
   {
    "n": "is_destination",
    "t": "bool",
    "d": false
   },
   {
    "n": "voucher_date",
    "t": "date",
    "d": "1900-01-01"
   },
   {
    "n": "voucher_kind",
    "t": "text",
    "d": ""
   },
   {
    "n": "counts_in_books",
    "t": "bool",
    "d": false
   }
  ]
 },
 "tx_bill_alloc": {
  "request": "LBVouchers",
  "type": "Voucher",
  "object": "VOUCHER",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "voucher_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "line_index",
    "t": "int",
    "d": 0
   },
   {
    "n": "alloc_index",
    "t": "int",
    "d": 0
   },
   {
    "n": "ledger_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "ledger_name",
    "t": "text",
    "d": ""
   },
   {
    "n": "bill_name",
    "t": "text",
    "d": "",
    "tag": "NAME",
    "h": "text"
   },
   {
    "n": "bill_type",
    "t": "text",
    "d": "",
    "tag": "BILLTYPE",
    "h": "text"
   },
   {
    "n": "amount",
    "t": "decimal",
    "d": "0.00",
    "tag": "AMOUNT",
    "h": "amount"
   },
   {
    "n": "credit_period_days",
    "t": "int",
    "d": 0,
    "tag": "BILLCREDITPERIOD",
    "h": "days"
   },
   {
    "n": "voucher_date",
    "t": "date",
    "d": "1900-01-01"
   },
   {
    "n": "voucher_kind",
    "t": "text",
    "d": ""
   },
   {
    "n": "counts_in_books",
    "t": "bool",
    "d": false
   }
  ]
 },
 "tx_tax_line": {
  "request": "LBVouchers",
  "type": "Voucher",
  "object": "VOUCHER",
  "columns": [
   {
    "n": "company_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "voucher_guid",
    "t": "text",
    "d": ""
   },
   {
    "n": "source",
    "t": "text",
    "d": ""
   },
   {
    "n": "line_index",
    "t": "int",
    "d": 0
   },
   {
    "n": "tax_head",
    "t": "text",
    "d": "",
    "tag": "GSTRATEDUTYHEAD",
    "h": "text"
   },
   {
    "n": "rate",
    "t": "decimal",
    "d": "0.00",
    "tag": "GSTRATE",
    "h": "amount"
   },
   {
    "n": "taxable_amount",
    "t": "decimal",
    "d": "0.00"
   },
   {
    "n": "tax_amount",
    "t": "decimal",
    "d": "0.00"
   },
   {
    "n": "hsn_code",
    "t": "text",
    "d": ""
   },
   {
    "n": "voucher_date",
    "t": "date",
    "d": "1900-01-01"
   },
   {
    "n": "voucher_kind",
    "t": "text",
    "d": ""
   },
   {
    "n": "counts_in_books",
    "t": "bool",
    "d": false
   }
  ]
 }
};
