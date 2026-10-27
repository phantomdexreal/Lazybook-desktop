// webpack module #232 (from electron_main_process, BA Mobile Connector 8.4.41)
// Cross-module refs appear as r(<id>). Names are mangled by the minifier.

module.exports_wrapper = function (e, t, r) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var i = r(559);
  t.CreateDataEntryResponse = i.default;
  var a = r(1146);
  t.CreateInventoryVoucherRequest = a.default;
  var o = r(1148);
  t.CreateInventoryVoucherResponse = o.default;
  var s = r(560);
  t.CreateInvoiceEntryRequest = s.default;
  var n = r(568);
  t.CreateInvoiceResponse = n.default;
  var u = r(1149);
  t.CreateJournalEntryRequest = u.default;
  var p = r(1150);
  t.CreateJournalEntryResponse = p.default;
  var c = r(1151);
  t.CreateOrderRequest = c.default;
  var m = r(1216);
  t.CreateTransactionRequest = m.default;
  var l = r(1217);
  t.GetCompaniesRequest = l.default;
  var d = r(1218);
  t.GetCompaniesResponse = d.default;
  var y = r(1219);
  t.GstEInvoiceConfigRequest = y.default;
  var b = r(1220);
  t.GetGSTRequest = b.default;
  var h = r(1221);
  t.GetGSTResponse = h.default;
  var g = r(1222);
  t.GetMastersRequest = g.default;
  var S = r(1223);
  t.GetMastersResponse = S.default;
  var f = r(1224);
  t.GetTallyLicenseRequest = f.default;
  var A = r(1225);
  t.GetTallyLicenseResponse = A.default;
  var N = r(588);
  t.GetTallyProductRequest = N.default;
  var I = r(1226);
  t.GetTallyProductResponse = I.default;
  var T = r(1227);
  t.LedgerClosingRequest = T.default;
  var M = r(1228);
  t.LedgerClosingResponse = M.default;
  var v = r(1230);
  t.OrderEnterResponse = v.default;
  var k = r(1231);
  t.VoucherStatisticsRequest = k.default;
  var C = r(1232);
  t.VoucherStatisticsResponse = C.default;
  var q = r(240);
  ((t.Filter = q.Filter),
    (t.FilterValue = q.FilterValue),
    (t.GetMastersOptions = q.GetMastersOptions),
    (t.Operators = q.Operators),
    (t.Range = q.Range),
    (t.RequestOptions = q.RequestOptions));
  var R = r(1233);
  t.GetGSTOptions = R.GetGSTOptions;
};
