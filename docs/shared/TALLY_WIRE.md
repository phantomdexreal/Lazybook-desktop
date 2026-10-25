# TALLY_WIRE - how the connector talks to Tally, and how Tally data maps to tables

Target: **TallyPrime only** (owner decision 2026-10-21). Tally ERP 9 is out of scope and not tested or supported.

Original LazyBooks definitions, written from Tally's public XML interface behaviour. Nothing here was confirmed against a real Tally unless a line says so; **everything in this file is `assumed` until the "real Tally" items in `INTEGRATION_CHECKLIST.md` (group TW) pass.** The tag-to-column map is `data_model.json` (per column: `tally` tag, `hint`, `verify`), rendered in `DATA_MODEL_COLUMNS.md`. The mock Tally responses in `fixtures/tally_xml/` and the reference parser `fixtures/tools/tally_xml_io.py` prove the map is self-consistent: parsing those files reproduces `fixtures/tables/*.json` exactly (`fixtures/tools/check_fixtures.py`).

## 1. Transport
- HTTP POST of an XML body to `http://<tally_host>:<tally_port>/` (defaults `localhost`, `9000`, `constants.json` `desktop`). Header `Content-Type: text/xml; charset=utf-8`. Timeout `desktop.tally_timeout_s`, retries `desktop.tally_retries` (connection errors only, never after a response was received for an import).
- One request at a time (single-threaded queue in the connector). Tally is not safe for parallel requests; entries and syncs share the same queue, entries first.
- Encoding (confirmed in Tally's help): send `Content-Type: text/xml` with the charset you actually use; UTF-8 is the default response format, UTF-16 exists for special characters (the response follows the request encoding), ASCII requires an ASCII request. Always send UTF-8 and also check the response for a BOM. Strip characters that are illegal in XML 1.0 (for example `&#4;` and other C0 controls) before parsing; keep a counter in the log.
- `ping`: an export request for the company name list; success means Tally is reachable and returns its version/company. Errors: connection refused -> `LB_TALLY_UNREACHABLE`; a response with `<LINEERROR>` -> `LB_TALLY_REJECTED`.
- The selected company is set per request with `SVCURRENTCOMPANY` (exact company name from `tm_company.name`). A company not loaded gives the detail `TALLY_COMPANY_NOT_LOADED` (retryable).

## 2. Export request template (collections)
```
<ENVELOPE>
 <HEADER><VERSION>1</VERSION><TALLYREQUEST>Export</TALLYREQUEST><TYPE>Collection</TYPE><ID>LBLedgers</ID></HEADER>
 <BODY><DESC>
  <STATICVARIABLES><SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT><SVCURRENTCOMPANY>Demo Traders Pvt Ltd</SVCURRENTCOMPANY></STATICVARIABLES>
  <TDL><TDLMESSAGE>
   <COLLECTION NAME="LBLedgers" ISMODIFY="No"><TYPE>Ledger</TYPE><NATIVEMETHOD>GUID</NATIVEMETHOD><NATIVEMETHOD>AlterID</NATIVEMETHOD> ... <FETCH>LedMailingDetails.*</FETCH><FILTERS>LBChanged</FILTERS></COLLECTION>
   <SYSTEM TYPE="Formulae" NAME="LBChanged">$AlterID > 1200</SYSTEM>
  </TDLMESSAGE></TDL>
 </DESC></BODY>
</ENVELOPE>
```
- Request names are in `data_model.json` `tables.<t>.tally.request` (`LBCompany`, `LBGroups`, `LBLedgers`, `LBVoucherTypes`, `LBStockGroups`, `LBStockCategories`, `LBUnits`, `LBGodowns`, `LBStockItems`, `LBCostCentres`, `LBCurrencies`, `LBEmployees`, `LBTaxUnits`, `LBVouchers`); the collection `TYPE` is `tally.type`. Child tables (`follows_parent`) come from the same request as their parent.
- Collection syntax is `TYPE` + one `NATIVEMETHOD` per simple field + `FILTERS` (plural) naming a formula, as in Tally's published collection example; `FETCH` for nested sub-objects is standard TDL but not shown on the pages checked (section 11), so confirm it (TW-FETCH). The list below says "FETCH" for "the fields to request". The request lists every `tally` tag of the table and its child tables (nested list tags are fetched by their list name, for example `LEDMAILINGDETAILS.LIST`, `BILLALLOCATIONS.LIST`, `RATEDETAILS.LIST`). Derived columns (`verify: derived`) have no tag.
- Expected response shape: `<ENVELOPE><BODY><DATA><COLLECTION><OBJECT ...>` where the object element name is `tally.object`; masters carry `NAME` as an attribute (columns whose tag starts with `@`). See `fixtures/tally_xml/*.xml` for one complete example per request.
- Parsing rules by hint (`data_model.json` column `hint`): `text` as-is trimmed; `int`; `amount` decimal with optional sign and unit text stripped; `qty`/`rate` and `qty_unit`/`rate_unit` (text such as `10 Nos` or `83.00/Nos` split into number and unit); `yesno` Yes/No to boolean; `yesno_applicable` Applicable/Not Applicable/empty to boolean; `tally_date` `YYYYMMDD` to ISO; `list_text` repeated tags to a JSON array; `list_text_join` joined with newline; `days` text such as `30 Days` to an integer; `json_list` the list of child objects as JSON. The reference parser is the executable definition.
- Required Tally features the connector depends on (partly confirmed, section 11): collections with `NATIVEMETHOD`/`FILTERS` and an `$AlterID` formula (the formula itself is assumed); `$$SysName:XML` export format; the `GUID`, `ALTERID`, `MASTERID` fields on vouchers and masters.

## 3. What each request returns (scopes)
`data_model.json` `tables.<t>.scope`: `full_refresh` (all masters, small; replaced wholesale on each master refresh), `follows_parent` (replaced together with the parent), `date_windowed` (vouchers: pulled by date window and by AlterID), `static` (`ref_voucher_kind`, shipped with the app).
Masters are re-read in full whenever the company `alter_id_master` changed (they are small). Vouchers are pulled incrementally (section 4).

## 4. AlterID rules (cursors)
- `tm_company.alter_id_master` / `alter_id_voucher` come from the company object (`ALTMSTID`, `ALTVCHID`). The connector compares them with its stored values per company: unchanged -> nothing to pull.
- Vouchers: request `LBVouchers` filtered with `$AlterID > <cursor>` where cursor = highest voucher `alter_id` stored in the vault for the company, inside the requested date window; additionally always re-read the lookback window (`constants.json` `sync.lookback_days_default`) by date to catch edits that kept an old AlterID (assumed necessary on some builds). Stored cursor moves to the maximum AlterID seen after a successful commit to the vault.
- A voucher whose `alter_id` changed is re-sent as `delete_children` + `upsert` (`SYNC_SPEC.md` section 4).
- Master edits change the master's `alter_id`; a rename keeps the `guid`. Because every row stores both `*_name` and `*_guid`, a rename is handled by re-sending the master and re-resolving names in affected child rows on the next full voucher window refresh (assumed acceptable; the delta example in `sync_examples` renames a ledger).

## 5. Deletions
Tally does not list deleted vouchers in an incremental pull. Every `desktop.deleted_check_interval_h` hours (and on every manual full sync) the connector requests the guid list of all vouchers in the synced window (`fixtures/tally_xml/voucher_guid_list.xml` shows the response) and compares it with the vault: guids in the vault but not in Tally are deleted (vault and, through `delete_children` then `delete` chunks, devices). Cancelled vouchers are not deleted; they stay with `is_cancelled = true` and `counts_in_books = false`. A voucher moved out of the window is not "deleted" (the window is part of the comparison).

## 6. Closing balances
Ledger, group and stock closing values come from Tally as of the company's last voucher date or the book end (`closing_balance` and stock `closing_qty`/`closing_value`). They are refreshed every `desktop.closing_balance_interval_h` hours and after any sync that changed vouchers, and sent as upserts of `tm_ledger`, `tm_group`, `tm_stock_item` (the delta example shows this). Closing is for the whole financial year, not as of an arbitrary date; reports "as of a date" are derived from lines by calculators.

## 7. Derivations done by the connector (columns marked `derived`)
- `company_guid` on every row; `*_guid` of every `*_name` reference through the shared resolver (case-insensitive exact name match per table within the company; empty string when not found; never fuzzy).
- `tm_group.reserved_name`, `reserved_root`, `nature`, `is_revenue`: walk the parent chain to the primary group; Tally's reserved parent names identify the semantic group (`Sundry Debtors`, `Sundry Creditors`, `Sales Accounts`, ...). `tm_ledger.reserved_root` copies the root of its group. `tm_voucher_type.base_kind`: walk parent voucher types to a reserved type name and map through `ref_voucher_kind.tally_name`; unresolved gives `unknown`.
- `tx_voucher.kind`, `party_guid`, `counts_in_books`, `amount` (`data_model.json` derive notes), and the denormalised `voucher_date`, `voucher_kind`, `counts_in_books` copied onto every child row.
- `tx_tax_line`: for every inventory line, one row per `RATEDETAILS.LIST` head (`GSTRATEDUTYHEAD`, `GSTRATE`): `taxable_amount` = the item line amount (absolute, net of discount), `tax_amount` = taxable x rate / 100 rounded to currency decimals with half away from zero when Tally gives no figure; for charge ledgers with a GST duty head, one row per duty ledger line with `source = 'ledger'`. Tax head names are normalised to lower case (`igst|cgst|sgst|cess|other`). Whether Tally's own duty ledger amounts differ by rounding from per-line figures is **assumed** to be absorbed by the voucher's duty ledger lines; the stored `tx_ledger_line` amounts are always the truth for accounts.
- Sign: voucher line `AMOUNT` is stored as given (debit negative). Inventory quantities are stored positive (`BILLEDQTY`); `ISDEEMEDPOSITIVE` on stock journal lines marks the destination (`tx_batch_alloc.is_destination`).
- GUID fallback: `n:<name>` when Tally returns an empty GUID (godown, cost centre, employee).

## 8. Import (entries) templates
Used by `ENTRY_PAYLOADS.md`. All amounts follow the Tally sign convention: ledger lines for the party on a sales invoice are debit (`ISDEEMEDPOSITIVE` Yes, negative amount), the sales and tax ledgers are credit (`ISDEEMEDPOSITIVE` No, positive); purchase is the mirror image; receipt debits the cash/bank ledger and credits the party; payment mirrors it; contra debits the destination; journal lines use the side given. The template for a voucher:
```
<ENVELOPE>
 <HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER>
 <BODY><IMPORTDATA>
  <REQUESTDESC><REPORTNAME>Vouchers</REPORTNAME><STATICVARIABLES><SVCURRENTCOMPANY>...</SVCURRENTCOMPANY></STATICVARIABLES></REQUESTDESC>
  <REQUESTDATA><TALLYMESSAGE xmlns:UDF="TallyUDF">
   <VOUCHER REMOTEID="11111111-1111-4111-8111-111111111111" VCHTYPE="Sales" ACTION="Create" OBJVIEW="Invoice Voucher View">
    <DATE>20260925</DATE><VOUCHERTYPENAME>Sales</VOUCHERTYPENAME><VOUCHERNUMBER>S-002</VOUCHERNUMBER>
    <REFERENCE/><NARRATION/>
    <PARTYLEDGERNAME>Alpha Retail</PARTYLEDGERNAME><PLACEOFSUPPLY>Maharashtra</PLACEOFSUPPLY><ISINVOICE>Yes</ISINVOICE>
    <ALLLEDGERENTRIES.LIST> party line with BILLALLOCATIONS.LIST </ALLLEDGERENTRIES.LIST>
    <ALLINVENTORYENTRIES.LIST> STOCKITEMNAME, RATE, BILLEDQTY, ACTUALQTY, AMOUNT, BATCHALLOCATIONS.LIST, ACCOUNTINGALLOCATIONS.LIST (item ledger) </ALLINVENTORYENTRIES.LIST>
    <LEDGERENTRIES.LIST> tax and round-off ledger lines </LEDGERENTRIES.LIST>
   </VOUCHER>
  </TALLYMESSAGE></REQUESTDATA>
 </IMPORTDATA></BODY>
</ENVELOPE>
```
- `REMOTEID` is an ATTRIBUTE of `<VOUCHER>` (confirmed in Tally's help; the data model already stores it as `@REMOTEID`). Tally documents that two imported vouchers with the same REMOTEID overwrite each other, so it must be unique per voucher: the `client_request_id` (a UUID) is exactly that, which also makes a re-sent entry overwrite instead of duplicating.
- `ACTION`: `Create` (confirmed) for new; `Alter` (confirmed) for `alter`, where Tally's own example identifies the voucher with `TAGNAME="MASTER ID"` and `TAGVALUE=<master id>` on the `<VOUCHER>` element (use `tx_voucher.master_id`; guid-based alter is assumed); `Cancel` and `Delete` for `cancel`/`delete` are **assumed** (not shown on the help pages checked). Cancel keeps the number and marks the voucher cancelled; delete removes it.
- Import configuration in Tally ("Overwrite voucher when a voucher with same GUID exists") affects what happens when a GUID or REMOTEID already exists; the user setup guide must say which setting to use (TW-ENTRY-REMOTEID).
- Names (ledger, item, godown, voucher type) are looked up by guid in the vault and written as Tally names. A guid of the form `n:<name>` is used as the name.
- Masters (`ledger`, `stock_item`): `<LEDGER NAME="..." ACTION="Create">` with `PARENT`, address list, GST fields, opening balance (`OPENINGBALANCE`, debit negative) and, for stock items, `BASEUNITS`, `OPENINGBALANCE` / `OPENINGVALUE` / `OPENINGRATE`.
- Response (confirmed shape): a voucher import returns `ENVELOPE > HEADER > STATUS` then `BODY > DATA > IMPORTRESULT` with `CREATED`, `ALTERED`, `LASTVCHID`, `LASTMID`, `COMBINED`, `IGNORED`, `ERRORS`; a master import returns a `RESPONSE` element with the same counters. Tally's own sample code treats the presence of a `<LINEERROR>` element as failure and reads `LASTVCHID` (the master id) after a create. Rule: success = no `LINEERROR`, `ERRORS` = 0 and `CREATED` + `ALTERED` > 0; `IGNORED` > 0 or `COMBINED` > 0 with no create is treated as `AMBIGUOUS_RESULT`. Map `LINEERROR` text with `entry_rules.json` `result.tally_message_map` (patterns assumed). A request-level failure returns `STATUS` 0 with `STATUS.LIST` (`CODE`, `DESC`).
- After a success the connector reads the voucher back by `REMOTEID`/`GUID` to return `guid`, `voucher_number`, `alter_id`. If that read fails or finds nothing, the result is `AMBIGUOUS_RESULT` (`needs_review`), never a blind retry.
- Whether `REMOTEID` is preserved on import and exported on read is **assumed** (item TW-ENTRY-REMOTEID in the checklist). Fallback if it is not: write the `client_request_id` into the voucher's `REFERENCE` suffix or a UDF `LBREQUEST` and search that field; record the decision in the desktop `PHASE_STATUS.md`.
- E-invoice and e-way actions (`alter.action`): the connector sets the voucher's e-invoice/e-way details through Tally's own functionality where available; the exact tags depend on the Tally release and its GST portal setup and are **assumed**; if unsupported the result is `EINVOICE_REJECTED` with the Tally text.

## 9. Error handling summary
| Situation | Result |
|---|---|
| connection refused or timeout | `TALLY_UNREACHABLE`, retry with backoff, entry stays `queued` |
| company not open | `TALLY_COMPANY_NOT_LOADED`, retryable |
| `LINEERROR` on import | mapped detail, status `failed` |
| import success but read-back empty | `AMBIGUOUS_RESULT`, `needs_review` |
| malformed XML in a response | strip illegal characters once, retry parse; else log `LB_TALLY_REJECTED` for that request and continue with the next table |

## 11. Checked against Tally's public documentation (2026-10-21)
Pages read: help.tallysolutions.com (XML message formats, XML interface, pre-requisites for integrations, Understanding Tally XML tags, Case Study I and II, voucher GUID/REMOTEID help). Result:
- **Confirmed:** HTTP POST of XML to the chosen port (9000 is the documented example, and the user must enable TallyPrime as server and have a company loaded); envelope header tags `VERSION`, `TALLYREQUEST` (Export, Import Data), `TYPE` (DATA, COLLECTION, OBJECT, ...), `ID`; `STATICVARIABLES` with `SVCURRENTCOMPANY`, `SVFROMDATE`, `SVTODATE`; `SVEXPORTFORMAT` value `$$SysName:XML`; collection requests with `TDL/TDLMESSAGE/COLLECTION`, `TYPE`, `NATIVEMETHOD`, `FILTERS` plus a formula; import template with `IMPORTDATA/REQUESTDESC/REPORTNAME/REQUESTDATA/TALLYMESSAGE/VOUCHER VCHTYPE ACTION`; `YYYYMMDD` dates; `ALLLEDGERENTRIES.LIST` with `LEDGERNAME`, `AMOUNT`, `ISDEEMEDPOSITIVE` (bank/debit side Yes with the negated amount, matching our sign rule); `REMOTEID` as a voucher attribute; `ACTION` Create and Alter; import result tags; `STATUS` 1/0.
- **Not on those pages, still assumed:** every data tag name in `data_model.json` marked `A` or `L` (the pages do not list export fields), `FETCH` for nested lists, the `$AlterID` formula, Cancel and Delete actions, e-invoice tags, error message texts, ERP 9 (out of scope, TallyPrime only), and behaviour on real company data. The pages do not state which Tally versions the XML interface covers beyond TallyPrime.
- **Corrected after this check:** `REMOTEID` is an attribute (the earlier import template wrongly showed a child tag); `FILTER` is `FILTERS`; the import response is `IMPORTRESULT` (voucher) or `RESPONSE` (master); alter is by master id.

## 10. Mock Tally
`fixtures/tally_xml/*.xml` are complete responses for the demo company, one file per request name (plus `voucher_guid_list.xml`). A mock Tally server serves them by request `ID`. It must also accept a voucher import and answer with the response in section 8 (for tests, a canned success is enough). Voucher-level filters (`$AlterID`) are not applied by the mock; the connector filters in memory when running against the mock.
