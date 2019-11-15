var ctx = nlapiGetContext();

var zee = 0;
var role = ctx.getRole();

if (role == 1000) {
  //Franchisee
  zee = ctx.getUser();
} else if (role == 3) { //Administrator
  zee = 6; //test
} else if (role == 1032) { // System Support
  zee = 425904; //test-AR
}

var ctx = nlapiGetContext();

var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
  baseURL = 'https://system.sandbox.netsuite.com';
}



function main(request, response) {


  if (request.getMethod() == "GET") {

    var form = nlapiCreateForm('Run Scheduler - Scheduled Customer Holiday Closure');

    var inlineQty = '';
    var inlinehtml2 = '';

    inlinehtml2 += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://1048144.app.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css">';

    var params = request.getParameter('custparam_params');

    params = JSON.parse(params);

    zee = params.zee

    form.addField('zee', 'text', 'zee').setDisplayType('hidden').setDefaultValue(zee);
    form.addField('custpage_suitlet', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.scriptid);
    form.addField('custpage_deploy', 'textarea', 'Latitude').setDisplayType('hidden').setDefaultValue(params.deployid);

    form.addField('custpage_html2', 'inlinehtml').setPadding(1).setLayoutType('outsideabove').setDefaultValue(inlinehtml2);

    var serviceFreqSearch = nlapiLoadSearch('customrecord_service_leg', 'customsearch_rp_cust_hol_closure_dates');

    var addFilterExpression = new nlobjSearchFilter('custrecord_service_leg_franchisee', null, 'anyof', zee);
    serviceFreqSearch.addFilter(addFilterExpression);

    var resultSetCustomer = serviceFreqSearch.runSearch();
    var old_customer_id;
    var old_service_id;
    var old_entity_id;
    var old_company_name;
    var old_closing_date;
    var old_opening_date;

    var count = 0;
    var customer_count = 0;


    inlineQty += '<div class="se-pre-con"></div><br><br><style>table#customer {font-size:12px; font-weight:bold; border-color: #24385b;} </style><table border="0" cellpadding="15" id="customer" class="tablesorter table table-striped table-condensed" cellspacing="0" style="width: 100%;"><thead style="color: white;background-color: #607799;"><tr><th class="col-xs-1"><b>ID</b></th><th class="col-xs-2"><b>CUSTOMER NAME</b></th><th class="col-xs-1"><b>CLOSING DATE</b></th><th class="col-xs-1"><b>OPENING DATE</b></th><th class="col-xs-1"><b>SAME AS ABOVE</b></th></tr></thead>';


    inlineQty += '<tbody>';

    resultSetCustomer.forEachResult(function(searchResult) {

      // var service_freq_id = searchResult.getValue("id");
      var service_leg_internalid = searchResult.getValue("internalid");
      var customer_id = searchResult.getValue("internalid", "CUSTRECORD_SERVICE_LEG_CUSTOMER", null);
      var entity_id = searchResult.getValue("entityid", "CUSTRECORD_SERVICE_LEG_CUSTOMER", null);
      var companyname = searchResult.getValue("companyname", "CUSTRECORD_SERVICE_LEG_CUSTOMER", null);

      var opening_date = searchResult.getValue("custrecord_service_leg_opening_date");
      var closing_date = searchResult.getValue("custrecord_service_leg_closing_date");
      // var operator = searchResult.getValue("custrecord_service_freq_operator");
      // var run_plan = searchResult.getValue("custrecord_service_freq_run_plan");



      if (count != 0 && old_customer_id != customer_id) {
        inlineQty += '<tr><td><input type="text" class="form-control entity_id" readonly value="' + old_entity_id + '" /></td><td><input type"text" class="form-control company_name" value="' + old_company_name + '" data-custid="' + old_customer_id + '" readonly /></td>';
        if (!isNullorEmpty(old_closing_date) && !isNullorEmpty(old_opening_date)) {
          var closingdate = GetFormattedDate(old_closing_date);
          var openingdate = GetFormattedDate(old_opening_date);

          inlineQty += '<td><input type="date" class="form-control closing_date" value="' + closingdate + '" data-custid="' + old_customer_id + '" /></td><td><input type="date" class="form-control opening_date" value="' + openingdate + '" data-custid="' + old_customer_id + '" /></td>';
        } else {
          inlineQty += '<td><input type="date" class="form-control closing_date" data-custid="' + old_customer_id + '" /></td><td><input type="date" class="form-control opening_date" data-custid="' + old_customer_id + '" /></td>';
        }
        if (customer_count > 0) {
          inlineQty += '<td><input type="checkbox" class="form-control same_as_above" /></td></tr>';

        } else {
          inlineQty += '<td></td></tr>';

        }

        customer_count++;
      }

      old_customer_id = customer_id;
      old_entity_id = entity_id;
      old_company_name = companyname;
      old_closing_date = closing_date;
      old_opening_date = opening_date;

      count++;
      return true;
    });

    if (count > 0) {
      inlineQty += '<tr><td><input type="text" class="form-control entity_id" readonly value="' + old_entity_id + '" /></td><td><input type"text" class="form-control company_name" value="' + old_company_name + '" data-custid="' + old_customer_id + '" readonly /></td><td><input type="date" class="form-control closing_date" data-custid="' + old_customer_id + '" /></td><td><input type="date" class="form-control opening_date" data-custid="' + old_customer_id + '" /></td><td><input type="checkbox" class="form-control same_as_above" /></td></tr>'
    }

    inlineQty += '</tbody>';

    inlineQty += '</table><br/>';

    form.addField('preview_table', 'inlinehtml', '').setLayoutType('outsidebelow', 'startrow').setDefaultValue(inlineQty);

    form.addSubmitButton('SAVE');
    form.addButton('back', 'Back', 'onclick_back()');
    form.setScript('customscript_cl_scheduled_cust_closure');
    response.writePage(form);


  } else {
    nlapiSetRedirectURL('SUITELET', 'customscript_sl_full_calendar', 'customdeploy_sl_full_calender', null, null);
  }
}

function GetFormattedDate(stringDate) {

  var todayDate = nlapiStringToDate(stringDate);
  var month = pad(todayDate.getMonth() + 1);
  var day = pad(todayDate.getDate());
  var year = (todayDate.getFullYear());
  return year + "-" + month + "-" + day;
}

function pad(s) {
  return (s < 10) ? '0' + s : s;
}