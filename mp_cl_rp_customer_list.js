var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://system.sandbox.netsuite.com';
}

//To show loader while the page is laoding
$(window).load(function() {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");;
});

var table;

/**
 * [pageInit description] - On page initialization, load the Dynatable CSS and sort the table based on the customer name and align the table to the center of the page. 
 */
function pageInit() {

    //Search: RP - Services
    var serviceSearch = nlapiLoadSearch('customrecord_service', 'customsearch_rp_services');

    var addFilterExpression = new nlobjSearchFilter('custrecord_service_franchisee', null, 'anyof', nlapiGetFieldValue('zee'));
    serviceSearch.addFilter(addFilterExpression);

    var resultSetCustomer = serviceSearch.runSearch();
    var old_customer_id;
    var old_service_id;
    var old_entity_id;
    var old_company_name;

    var count = 0;
    var customer_count = 0;

    var service_id_array = [];
    var service_name_array = [];
    var service_descp_array = [];
    var service_price_array = [];
    var service_freq_count_array = [];
    var service_leg_count_array = [];
    var service_no_of_legs_array = [];

    var reviewed = false;

    var dataSet = '{"data":[';

    resultSetCustomer.forEachResult(function(searchResult) {

        var custid = searchResult.getValue("custrecord_service_customer", null, "GROUP");
        var entityid = searchResult.getValue("entityid", "CUSTRECORD_SERVICE_CUSTOMER", "GROUP");
        var companyname = searchResult.getValue("companyname", "CUSTRECORD_SERVICE_CUSTOMER", "GROUP");

        var service_id = searchResult.getValue("internalid", null, "GROUP");
        var service_name = searchResult.getText('custrecord_service', null, "GROUP");
        var service_descp = searchResult.getValue('custrecord_service_description', null, "GROUP");
        var service_price = searchResult.getValue("custrecord_service_price", null, "GROUP");
        var service_leg_freq_count = searchResult.getValue("internalid", "CUSTRECORD_SERVICE_FREQ_SERVICE", "COUNT");
        var service_leg_count = searchResult.getValue("internalid", "CUSTRECORD_SERVICE_LEG_SERVICE", "COUNT");
        var no_of_legs = searchResult.getValue("custrecord_service_type_leg_no", "CUSTRECORD_SERVICE", "GROUP");
        /*
                var legSearch = nlapiLoadSearch('customrecord_service', 'customsearch_inactive_legs');

                var newFilters = new Array();
                newFilters[newFilters.length] = new nlobjSearchFilter('internalid', null, 'is', service_id);
                newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_service_franchisee', null, 'is', nlapiGetFieldValue('zee'));
                newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_service_leg_customer', null, 'is', custid);
                legSearch.addFilters(newFilters);

                var resultSetLeg_inactive = legSearch.runSearch();
                resultSetLeg_inactive.forEachResult(function(searchResult) {
                    var no_of_legs_inactive = searchResult.getValue("internalid", "CUSTRECORD_SERVICE_LEG_SERVICE", "COUNT");
                    var customer = searchResult.getValue("custrecord_service_customer", null, "GROUP");
                    console.log(no_of_legs_inactive);
                    console.log(customer);
                    return true
            rp - services    });*/

        if (count != 0 && old_customer_id != custid) {


            dataSet += '{"cust_id":"' + old_customer_id + '", "entity_id":"' + old_entity_id + '", "company_name":"' + old_company_name + '","reviewed": "' + reviewed + '",'

            dataSet += '"services": ['

            for (var i = 0; i < service_id_array.length; i++) {


                dataSet += '{';

                dataSet += '"service_name": "' + service_name_array[i] + '", "service_descp": "' + service_descp_array[i] + '", "freq_count": "' + service_freq_count_array[i] + '", "leg_count": "' + service_leg_count_array[i] + '", "no_of_legs": "' + service_no_of_legs_array[i] + '", "service_price": "' + service_price_array[i] + '","service_id": "' + service_id_array[i] + '"'

                dataSet += '},'
            }
            dataSet = dataSet.substring(0, dataSet.length - 1);
            dataSet += ']},'

            customer_count++;

            service_id_array = [];
            service_name_array = [];
            service_descp_array = [];
            service_price_array = [];
            service_freq_count_array = [];
            service_leg_count_array = [];
            service_no_of_legs_array = [];

            reivewed = false;

            service_id_array[service_id_array.length] = service_id;
            service_name_array[service_name_array.length] = service_name;
            service_descp_array[service_descp_array.length] = service_descp;
            service_price_array[service_price_array.length] = service_price;
            service_freq_count_array[service_freq_count_array.length] = service_leg_freq_count;
            service_leg_count_array[service_leg_count_array.length] = service_leg_count;
            service_no_of_legs_array[service_no_of_legs_array.length] = no_of_legs;

            if (service_leg_freq_count == service_leg_count && service_leg_count == no_of_legs) {
                reviewed = true;
            } else {
                reviewed = false;
            }
        } else {
            service_id_array[service_id_array.length] = service_id;
            service_name_array[service_name_array.length] = service_name;
            service_descp_array[service_descp_array.length] = service_descp;
            service_price_array[service_price_array.length] = service_price;
            service_freq_count_array[service_freq_count_array.length] = service_leg_freq_count;
            service_leg_count_array[service_leg_count_array.length] = service_leg_count;
            service_no_of_legs_array[service_no_of_legs_array.length] = no_of_legs;
            if (service_leg_freq_count == service_leg_count && service_leg_count == no_of_legs) {
                reviewed = true;
            } else {
                reviewed = false;
            }
        }

        old_customer_id = custid;
        old_service_id = service_id;
        old_entity_id = entityid;
        old_company_name = companyname;

        count++;
        return true;
    });

    if (count > 0) {
        dataSet += '{"cust_id":"' + old_customer_id + '", "entity_id":"' + old_entity_id + '", "company_name":"' + old_company_name + '","reviewed": "' + reviewed + '",'

        dataSet += '"services": ['

        for (var i = 0; i < service_id_array.length; i++) {


            dataSet += '{';

            dataSet += '"service_name": "' + service_name_array[i] + '", "service_descp": "' + service_descp_array[i] + '", "freq_count": "' + service_freq_count_array[i] + '", "leg_count": "' + service_leg_count_array[i] + '", "no_of_legs": "' + service_no_of_legs_array[i] + '", "service_price": "' + service_price_array[i] + '","service_id": "' + service_id_array[i] + '"'

            dataSet += '},'
        }
        dataSet = dataSet.substring(0, dataSet.length - 1);
        dataSet += ']},'
    }

    dataSet = dataSet.substring(0, dataSet.length - 1);
    dataSet += ']}';
    var parsedData = JSON.parse(dataSet);
    console.log(parsedData.data);

    // AddStyle('https://1048144.app.netsuite.com/core/media/media.nl?id=1988776&c=1048144&h=58352d0b4544df20b40f&_xt=.css', 'head');

    //JQuery to sort table based on click of header. Attached library  
    $(document).ready(function() {
        table = $("#customer").DataTable({
            "data": parsedData.data,
            "columns": [{
                "orderable": false,
                "data": null,
                "defaultContent": '<button type="button" class="details-control form-control btn-xs btn-success " ><span class="span_class glyphicon glyphicon-plus"></span></button>'
            }, {
                "data": null,
                "render": function(data, type, row) {
                    return '<button type="button" data-custid="' + data.cust_id + '" class="edit_customer form-control btn-xs btn-warning " ><span class="span_class glyphicon glyphicon-pencil"></span></button>';
                }
            }, {
                "data": "entity_id"
            }, {
                "data": "company_name"
            }, {
                "data": null,
                "defaultContent": ''
            }, ],
            "columnDefs": [{

                "render": function(data, type, row) {
                    if (data.reviewed == 'true') {
                        return '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=1990778&c=1048144&h=e7f4f60576de531265f7" height="25" width="25">';
                    }
                },
                "targets": [4]
            }],
            "order": [
                [1, 'asc']
            ],
            "pageLength": 100
        });
    });
    var main_table = document.getElementsByClassName("uir-outside-fields-table");
    var main_table2 = document.getElementsByClassName("uir-inline-tag");


    for (var i = 0; i < main_table.length; i++) {
        main_table[i].style.width = "50%";
    }

    for (var i = 0; i < main_table2.length; i++) {
        main_table2[i].style.position = "absolute";
        main_table2[i].style.left = "10%";
        main_table2[i].style.width = "80%";
        main_table2[i].style.top = "275px";
    }


}

$(document).on('click', '.edit_customer', function() {

    var custid = $(this).attr('data-custid')
    console.log(custid);
    var params = {
        custid: custid,
    }
    params = JSON.stringify(params);

    var upload_url = baseURL + nlapiResolveURL('SUITELET', 'customscript_sl_smc_main', 'customdeploy_sl_smc_main') + '&unlayered=T&custparam_params=' + params;
    window.open(upload_url, "_blank", "height=750,width=650,modal=yes,alwaysRaised=yes");

});

$('.collapse').on('shown.bs.collapse', function() {
    $("#customer_wrapper").css({
        "padding-top": "300px"
    });
    $(".admin_section").css({
        "padding-top": "300px"
    });
})

$('.collapse').on('hide.bs.collapse', function() {
    $("#customer_wrapper").css({
        "padding-top": "0px"
    });
    $(".admin_section").css({
        "padding-top": "0px"
    });
})

/*$(document).on('click', '.instruction_button', function() {
    console.log('collapse', $('.collapse').collapse());
    $("#customer_wrapper").css({
        "padding-top": "400px"
    });
    $(".admin_section").css({
        "padding-top": "400px"
    });
    console.log(document.getElementsByClassName('instruction_button'));
});*/

function onclick_back() {
    var params = {

    }
    params = JSON.stringify(params);
    var upload_url = baseURL + nlapiResolveURL('SUITELET', 'customscript_sl_full_calendar', 'customdeploy_sl_full_calender') + '&unlayered=T&zee=' + parseInt(nlapiGetFieldValue('zee')) + '&custparam_params=' + params;
    window.open(upload_url, "_self", "height=750,width=650,modal=yes,alwaysRaised=yes");
}

$(document).on('click', '.details-control', function() {
    var tr = $(this).closest('tr');
    var row = table.row(tr);

    if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        $(this).removeClass('btn-danger');
        $(this).addClass('btn-success');
        $(this).find('.span_class').removeClass('glyphicon-minus');
        $(this).find('.span_class').addClass('glyphicon-plus');

    } else {
        // Open this row
        console.log(row.data());
        row.child(format(row.data())).show();
        $(this).addClass('btn-danger');
        $(this).removeClass('btn-success');
        $(this).find('.span_class').removeClass('glyphicon-plus');
        $(this).find('.span_class').addClass('glyphicon-minus');
    }


    $(".row_service").each(function() {
        if ($(this).find(".setup_service").val() == 'SETUP STOP') {
            $(this).find(".service_summary").prop('disabled', true);
        }
    });
});

$(document).on('click', '.setup_service', function() {
    var service_id = $(this).attr('data-serviceid');

    zee = nlapiGetFieldValue('zee');

    var params = {
        serviceid: service_id,
        scriptid: 'customscript_sl_rp_customer_list',
        deployid: 'customdeploy_sl_rp_customer_list',
        zee: zee
    }
    params = JSON.stringify(params);

    var upload_url = baseURL + nlapiResolveURL('SUITELET', 'customscript_sl_rp_create_stops', 'customdeploy_sl_rp_create_stops') + '&unlayered=T&custparam_params=' + params;
    window.open(upload_url, "_blank", "height=750,width=650,modal=yes,alwaysRaised=yes");
});

$(document).on('click', '.service_summary', function() {
    console.log('click');

    var header = '<div><h3><label class="control-label">Summary Page</label></h3></div>';
    var body = '<div class="container-fluid"><div class="row">';
    var bodyService = '<div class="col col-sm" id="servicedetails"><h3 style="color: rgb(50, 122, 183);">Service Details</h3>'
    var bodyStop = '<div class="col col-sm" id="stopsdetails"><h3 style="color: rgb(50, 122, 183);">Stops Details</h3>';

    var service_id = $(this).attr('data-serviceid');

    // BodyStop
    var serviceLegSearch = nlapiLoadSearch('customrecord_service_leg', 'customsearch_rp_leg_freq_all');
    var newFilters = new Array();
    newFilters[newFilters.length] = new nlobjSearchFilter('internalid', 'custrecord_service_leg_service', 'is', service_id);
    newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_service_leg_franchisee', null, 'is', zee);
    newFilters[newFilters.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

    serviceLegSearch.addFilters(newFilters);

    var resultSet = serviceLegSearch.runSearch();
    var old_stop_id;
    var old_freq_id;

    var stop_count = 0;
    var freq_id_count = 0;
    var freq_count = 0;
    var stop_freq_json = '{ "data": [';
    resultSet.forEachResult(function(searchResult) {
        var customer_name = searchResult.getText('custrecord_service_leg_customer');
        var service = searchResult.getText('custrecord_service_leg_service');
        var stop_id = searchResult.getValue('internalid');
        var stop_name = searchResult.getValue('name');
        var stop_duration = searchResult.getValue('custrecord_service_leg_duration');
        var stop_notes = searchResult.getValue('custrecord_service_leg_notes');
        var service_leg_ncl = searchResult.getValue("custrecord_service_leg_non_cust_location");
        var service_leg_addr_id = searchResult.getValue("custrecord_service_leg_addr");
        var transfer_type = searchResult.getValue("custrecord_service_leg_trf_type");
        var transfer_zee = searchResult.getValue("custrecord_service_leg_trf_franchisee");
        var freq_id = searchResult.getValue("internalid", "CUSTRECORD_SERVICE_FREQ_STOP", null);
        var freq_mon = searchResult.getValue("custrecord_service_freq_day_mon", "CUSTRECORD_SERVICE_FREQ_STOP", null);
        var freq_tue = searchResult.getValue("custrecord_service_freq_day_tue", "CUSTRECORD_SERVICE_FREQ_STOP", null);
        var freq_wed = searchResult.getValue("custrecord_service_freq_day_wed", "CUSTRECORD_SERVICE_FREQ_STOP", null);
        var freq_thu = searchResult.getValue("custrecord_service_freq_day_thu", "CUSTRECORD_SERVICE_FREQ_STOP", null);
        var freq_fri = searchResult.getValue("custrecord_service_freq_day_fri", "CUSTRECORD_SERVICE_FREQ_STOP", null);
        var freq_adhoc = searchResult.getValue("custrecord_service_freq_day_adhoc", "CUSTRECORD_SERVICE_FREQ_STOP", null);
        var freq_time_current = searchResult.getValue("custrecord_service_freq_time_current", "CUSTRECORD_SERVICE_FREQ_STOP", null);
        var freq_time_start = searchResult.getValue("custrecord_service_freq_time_start", "CUSTRECORD_SERVICE_FREQ_STOP", null);
        var freq_time_end = searchResult.getValue("custrecord_service_freq_time_end", "CUSTRECORD_SERVICE_FREQ_STOP", null);
        var freq_run_plan = searchResult.getText("custrecord_service_freq_run_plan", "CUSTRECORD_SERVICE_FREQ_STOP", null);

        if (stop_count == 0) {
            stop_freq_json += '{"customer_name": "' + customer_name + '",';
            stop_freq_json += '"service": "' + service + '",';
            stop_freq_json += '"stop_id": "' + stop_id + '",';
            stop_freq_json += '"stop_name": "' + stop_name + '",';
            stop_freq_json += '"stop_duration": "' + stop_duration + '",';
            stop_freq_json += '"stop_notes": "' + stop_notes + '",';
            stop_freq_json += '"stop_ncl_id": "' + service_leg_ncl + '",';
            stop_freq_json += '"stop_addr_id": "' + service_leg_addr_id + '",';
            stop_freq_json += '"transfer_type": "' + transfer_type + '",';
            stop_freq_json += '"transfer_zee": "' + transfer_zee + '",';
            stop_freq_json += '"stop_freq": [';
            stop_freq_json += '{"freq_id": "' + freq_id + '",';
            stop_freq_json += '"freq_mon": "' + freq_mon + '",';
            stop_freq_json += '"freq_tue": "' + freq_tue + '",';
            stop_freq_json += '"freq_wed": "' + freq_wed + '",';
            stop_freq_json += '"freq_thu": "' + freq_thu + '",';
            stop_freq_json += '"freq_fri": "' + freq_fri + '",';
            stop_freq_json += '"freq_adhoc": "' + freq_adhoc + '",';
            stop_freq_json += '"freq_time_current": "' + freq_time_current + '",';
            stop_freq_json += '"freq_time_start": "' + freq_time_start + '",';
            stop_freq_json += '"freq_time_end": "' + freq_time_end + '",';
            stop_freq_json += '"freq_run_plan": "' + freq_run_plan + '"},';
        } else {
            if (old_stop_id == stop_id && old_freq_id == freq_id) {
                stop_freq_json += '{"freq_id": "' + freq_id + '",';
                stop_freq_json += '"freq_mon": "' + freq_mon + '",';
                stop_freq_json += '"freq_tue": "' + freq_tue + '",';
                stop_freq_json += '"freq_wed": "' + freq_wed + '",';
                stop_freq_json += '"freq_thu": "' + freq_thu + '",';
                stop_freq_json += '"freq_fri": "' + freq_fri + '",';
                stop_freq_json += '"freq_adhoc": "' + freq_adhoc + '",';
                stop_freq_json += '"freq_time_current": "' + freq_time_current + '",';
                stop_freq_json += '"freq_time_start": "' + freq_time_start + '",';
                stop_freq_json += '"freq_time_end": "' + freq_time_end + '",';
                stop_freq_json += '"freq_run_plan": "' + freq_run_plan + '"},';
            } else if (old_stop_id == stop_id && old_freq_id != freq_id) {
                stop_freq_json += '{"freq_id": "' + freq_id + '",';
                stop_freq_json += '"freq_mon": "' + freq_mon + '",';
                stop_freq_json += '"freq_tue": "' + freq_tue + '",';
                stop_freq_json += '"freq_wed": "' + freq_wed + '",';
                stop_freq_json += '"freq_thu": "' + freq_thu + '",';
                stop_freq_json += '"freq_fri": "' + freq_fri + '",';
                stop_freq_json += '"freq_adhoc": "' + freq_adhoc + '",';
                stop_freq_json += '"freq_time_current": "' + freq_time_current + '",';
                stop_freq_json += '"freq_time_start": "' + freq_time_start + '",';
                stop_freq_json += '"freq_time_end": "' + freq_time_end + '",';
                stop_freq_json += '"freq_run_plan": "' + freq_run_plan + '"},';

            } else if (old_stop_id != stop_id) {
                stop_freq_json = stop_freq_json.substring(0, stop_freq_json.length - 1);
                stop_freq_json += ']},';

                freq_id_count = 0;

                stop_freq_json += '{"customer_name": "' + customer_name + '",';
                stop_freq_json += '"service": "' + service + '",';
                stop_freq_json += '"stop_id": "' + stop_id + '",';
                stop_freq_json += '"stop_name": "' + stop_name + '",';
                stop_freq_json += '"stop_duration": "' + stop_duration + '",';
                stop_freq_json += '"stop_notes": "' + stop_notes + '",';
                stop_freq_json += '"stop_ncl_id": "' + service_leg_ncl + '",';
                stop_freq_json += '"stop_addr_id": "' + service_leg_addr_id + '",';
                stop_freq_json += '"transfer_type": "' + transfer_type + '",';
                stop_freq_json += '"transfer_zee": "' + transfer_zee + '",';
                stop_freq_json += '"stop_freq": [';
                stop_freq_json += '{"freq_id": "' + freq_id + '",';
                stop_freq_json += '"freq_mon": "' + freq_mon + '",';
                stop_freq_json += '"freq_tue": "' + freq_tue + '",';
                stop_freq_json += '"freq_wed": "' + freq_wed + '",';
                stop_freq_json += '"freq_thu": "' + freq_thu + '",';
                stop_freq_json += '"freq_fri": "' + freq_fri + '",';
                stop_freq_json += '"freq_adhoc": "' + freq_adhoc + '",';
                stop_freq_json += '"freq_time_current": "' + freq_time_current + '",';
                stop_freq_json += '"freq_time_start": "' + freq_time_start + '",';
                stop_freq_json += '"freq_time_end": "' + freq_time_end + '",';
                stop_freq_json += '"freq_run_plan": "' + freq_run_plan + '"},';

            }
        }

        //console.log('stop_freq_json', stop_freq_json);

        old_stop_id = stop_id;
        old_freq_id = freq_id;
        stop_count++;
        freq_id_count++;
        return true;
    });

    if (freq_id_count > 0) {
        stop_freq_json = stop_freq_json.substring(0, stop_freq_json.length - 1);
        stop_freq_json += ']}';
        stop_freq_json += ']}';
    } else {
        stop_freq_json += ']}';
    }

    console.log('stop_freq_json', stop_freq_json);
    var parsedStopFreq = JSON.parse(stop_freq_json);
    var obj = parsedStopFreq.data[0];
    console.log('obj', obj);
    var frequency = '';
    /*    if (obj_freq[y]['freq_mon'] == 'T' && obj_freq[y]['freq_tue'] == 'T' && obj_freq[y]['freq_wed'] == 'T' && obj_freq[y]['freq_thu'] == 'T' && obj_freq[y]['freq_fri'] == 'T') {
            frequency = 'Daily';
        } else if (obj_freq[y]['freq_adhoc'] == 'T') {
            frequency = 'ADHOC';
        } else {
            if (obj_freq[y]['freq_mon'] == 'T') {
                frequency += '<Mon, >'
            }
            if (obj_freq[y]['freq_tue'] == 'T') {
                frequency += '<Tue, >'
            }
            if (obj_freq[y]['freq_wed'] == 'T') {
                frequency += '<Wed, >'
            }
            if (obj_freq[y]['freq_thu'] == 'T') {
                frequency += '<Thu, >'
            }
            if (obj_freq[y]['freq_fri'] == 'T') {
                frequency += '<Fri, >'
            }
            frequency = frequency.substring(0, frequency.length - 2);
        }*/




    bodyStop += '<ol class="list-group">';
    console.log('parsedStopFreq.data.length', parsedStopFreq.data.length);
    for (var i = 0; i < parsedStopFreq.data.length; i++) {
        var freq_array = [null, null, null, null, null, null];
        var obj = parsedStopFreq.data[i];
        //console.log('obj_i', obj);
        bodyStop += '<li><h5>' + obj['stop_name'] + '</h5>';
        var obj_freq = obj['stop_freq'];
        for (y = 0; y < obj_freq.length; y++) {
            if (obj_freq[y]['freq_mon'] == 'T') {
                var warning = '';
                if (!isNullorEmpty(freq_array[0])) {
                    warning = '<em style="color: red;">WARNING : Duplicates</em>';
                }
                freq_array[0] = '<strong>Mon : </strong>' + obj_freq[y]['freq_time_current'] + ' - ' + obj_freq[y]['freq_run_plan'] + ' ' + warning + '</br>';

            }
            if (obj_freq[y]['freq_tue'] == 'T') {
                var warning = '';
                if (!isNullorEmpty(freq_array[1])) {
                    warning = '<em style="color: red;">WARNING : Duplicates</em>';
                }
                freq_array[1] = '<strong>Tue : </strong>' + obj_freq[y]['freq_time_current'] + ' - ' + obj_freq[y]['freq_run_plan'] + ' ' + warning + '</br>';
            }
            if (obj_freq[y]['freq_wed'] == 'T') {
                var warning = '';
                if (!isNullorEmpty(freq_array[2])) {
                    warning = '<em style="color: red;">WARNING : Duplicates</em>';
                }
                freq_array[2] = '<strong>Wed : </strong>' + obj_freq[y]['freq_time_current'] + ' - ' + obj_freq[y]['freq_run_plan'] + ' ' + warning + '</br>';
            }
            if (obj_freq[y]['freq_thu'] == 'T') {
                var warning = '';
                if (!isNullorEmpty(freq_array[3])) {
                    warning = '<em style="color: red;">WARNING : Duplicates</em>';
                }
                freq_array[3] = '<strong>Thu : </strong>' + obj_freq[y]['freq_time_current'] + ' - ' + obj_freq[y]['freq_run_plan'] + ' ' + warning + '</br>';
            }
            if (obj_freq[y]['freq_fri'] == 'T') {
                var warning = '';
                if (!isNullorEmpty(freq_array[4])) {
                    warning = '<em style="color: red;">WARNING : Duplicates</em>';
                }
                freq_array[4] = '<strong>Fri : </strong>' + obj_freq[y]['freq_time_current'] + ' - ' + obj_freq[y]['freq_run_plan'] + ' ' + warning + '</br>';
            }
            if (obj_freq[y]['freq_adhoc'] == 'T') {
                var warning = '';
                if (!isNullorEmpty(freq_array[5])) {
                    warning = '<em style="color: red;">WARNING : Duplicates</em>';
                }
                freq_array[5] = '<strong>ADHOC : </strong>' + obj_freq[y]['freq_time_current'] + ' - ' + obj_freq[y]['freq_run_plan'] + ' ' + warning + '</br>';
            }
        }
        for (k = 0; k < 6; k++) {
            if (!isNullorEmpty(freq_array[k])) {
                bodyStop += freq_array[k];
            }
        }
        bodyStop += '<div class="stopinfo" style="color: gray;padding-top: 5px;">';
        bodyStop += '<div><strong>Stop duration : </strong>' + obj['stop_duration'] + 's<div>';
        if (!isNullorEmpty(obj['stop_notes'])) {
            bodyStop += '<div style="word-break: normal;"><strong> Notes :</strong> ' + obj['stop_notes'] + '</div>';
        }
        bodyStop += '</div>';
        bodyStop += '</li>';


    }
    bodyStop += '</ol>';
    bodyStop += '</div>';

    // BodyService
    var serviceSearch = nlapiLoadSearch('customrecord_service', 'customsearch_rp_services');
    var newFilters = new Array();
    console.log(service_id);
    newFilters[newFilters.length] = new nlobjSearchFilter('internalid', null, 'is', service_id);
    newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_service_franchisee', null, 'is', zee);
    //newFilters[newFilters.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

    serviceSearch.addFilters(newFilters);

    var serviceResultSet = serviceSearch.runSearch();
    serviceResultSet.forEachResult(function(searchResult) {
        var customer_name = searchResult.getText('custrecord_service_customer', null, "GROUP");
        console.log(customer_name);
        var service_type = searchResult.getText('custrecord_service', null, "GROUP");
        var mon = searchResult.getValue("custrecord_service_freq_day_mon", "CUSTRECORD_SERVICE_FREQ_SERVICE", "GROUP");
        var tue = searchResult.getValue("custrecord_service_freq_day_tue", "CUSTRECORD_SERVICE_FREQ_SERVICE", "GROUP");
        var wed = searchResult.getValue("custrecord_service_freq_day_wed", "CUSTRECORD_SERVICE_FREQ_SERVICE", "GROUP");
        var thu = searchResult.getValue("custrecord_service_freq_day_thu", "CUSTRECORD_SERVICE_FREQ_SERVICE", "GROUP");
        var fri = searchResult.getValue("custrecord_service_freq_day_fri", "CUSTRECORD_SERVICE_FREQ_SERVICE", "GROUP");
        var adhoc = searchResult.getValue("custrecord_service_freq_day_adhoc", "CUSTRECORD_SERVICE_FREQ_SERVICE", "GROUP");

        if (mon == 'T' && tue == 'T' && wed == 'T' && thu == 'T' && fri == 'T') {
            frequency = 'Daily';
        } else if (adhoc == 'T') {
            frequency = 'ADHOC';
        } else {
            if (mon == 'T') {
                frequency += 'Mon, ';
            }
            if (tue == 'T') {
                frequency += 'Tue, ';
            }
            if (wed == 'T') {
                frequency += 'Wed, ';
            }
            if (thu == 'T') {
                frequency += 'Thu, ';
            }
            if (fri == 'T') {
                frequency += 'Fri, ';
            }
            frequency = frequency.substring(0, frequency.length - 2);
        }



        bodyService += '<div style="font-size: medium;"><ul style="list-style: none;"><li style="padding-top: 5px;"><span class="glyphicon glyphicon-user"></span>  ' + customer_name + '</li><li style="padding-top: 5px;"><span class="glyphicon glyphicon-list-alt"></span>  ' + service_type + '</li><li style="padding-top: 5px;">'
        if (!isNullorEmpty(frequency)) {
            bodyService += '<span class="glyphicon glyphicon-calendar"></span> ' + frequency + '';
        }
        bodyService += '</ul>';
        return true
    });


    bodyService += '</div>';

    //console.log('bodyService', bodyService);
    //console.log('bodyStops', bodyStop);

    body += bodyService;
    body += bodyStop;
    body += '</div>';
    //body += '<div class="row"><div class="col">Test</div></div>';
    body += '</div>';
    //console.log('body', body);


    $('#myModal .modal-header').html(header);
    $('#myModal .modal-body').html("");
    $('#myModal .modal-body').html(body);
    $('#myModal').modal("show");

});

function format(index) {
    // var json_data = data[parseInt(index)];
    var html = '<table class="table table-responsive" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';

    $.each(index.services, function(i, service) {
        console.log('service', service);
        if (i == 0) {
            html += '<thead><tr style="color:white;background-color: grey;"><th style="text-align: center;"></th><th style="text-align: center;">Service Name</th><th style="text-align: center;">Description</th><th style="text-align: center;">Price</th><th class="col-sm-4" style="text-align: center;">Action</th></tr></thead>';
        }
        html += '<tr class="row_service">'
        html += '<td><button type="button" class="form-control btn-xs btn-secondary service_summary" data-toggle="modal" data-target="#myModal" data-serviceid="' + service.service_id + '"><span class="glyphicon glyphicon-eye-open"></span></button></td>';
        var no_of_legs;
        var service_leg_count;
        var service_leg_count_active;
        var service_freq_count;
        var service_freq_count_active;
        var count = 0;
        $.each(service, function(key, value) {
            if (key == "leg_count") {
                service_leg_count = parseInt(value);
            }

            if (key == "freq_count") {
                service_freq_count = parseInt(value);
            }

            if (key == "no_of_legs") {
                no_of_legs = parseInt(value);
            }

            console.log(key)

            service_leg_count_active = service_leg_count;
            service_freq_count_active = service_freq_count;


            if (key == "service_id") {
                console.log('value', value);
                var legSearch = nlapiLoadSearch('customrecord_service', 'customsearch_inactive_legs');

                var newFilters = new Array();
                newFilters[newFilters.length] = new nlobjSearchFilter('internalid', null, 'anyof', value);
                //newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_service_franchisee', null, 'is', nlapiGetFieldValue('zee'));
                //newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_service_customer', null, 'is', service.custid);
                legSearch.addFilters(newFilters);

                var resultSetLeg_inactive = legSearch.runSearch();
                resultSetLeg_inactive.forEachResult(function(searchResult) {
                    var service_leg_count_inactive = searchResult.getValue("internalid", "CUSTRECORD_SERVICE_LEG_SERVICE", "COUNT");
                    var service_freq_count_inactive = searchResult.getValue("internalid", "CUSTRECORD_SERVICE_FREQ_SERVICE", "COUNT");
                    var serv_id = searchResult.getValue("internalid", null, "GROUP");
                    console.log('service_leg_count_inactive', service_leg_count_inactive);
                    console.log('service_freq_count_inactive', service_freq_count_inactive);
                    console.log('serv_id', serv_id);

                    service_leg_count_active = service_leg_count - service_leg_count_inactive;
                    service_freq_count_active = service_freq_count - service_freq_count_inactive;
                    console.log('service_leg_count_active', service_leg_count_active);
                    console.log('service_freq_count_active', service_freq_count_active);
                    count++;
                    return true
                });
                console.log('count', count);
                console.log('service_leg_count_active', service_leg_count_active);
                console.log('service_freq_count_active', service_freq_count_active);
                //html += '<td><button type="button" class="form-control btn-xs btn-secondary service_summary" data-toggle="modal" data-target="#myModal" data-serviceid="' + value + '"><span class="glyphicon glyphicon-eye-open"></span></button></td>';
                if (no_of_legs <= service_leg_count_active || no_of_legs <= service_freq_count_active) {
                    html += '<td style="text-align: center;"><div class="col-sm-6"><input type="button" class="form-control btn-xs btn-primary setup_service" data-serviceid="' + value + '" value="EDIT STOP" /></div><div class="col-sm-6"><input type="button" class="form-control btn-xs btn-danger remove_service" data-serviceid="' + value + '" value="REMOVE FROM RUN" /></div></td>';
                } else {
                    html += '<td style="text-align: center;"><div class="col-sm-3"></div><div class="col-sm-6"><input type="button" class="form-control btn-xs btn-danger setup_service" data-serviceid="' + value + '" value="SETUP STOP" /></div></td>';
                }


            } else if (key == "freq_count" || key == "leg_count" || key == "no_of_legs") {

            } else {
                html += '<td style="text-align: center;">' + value + '</td>';
            }

        });
        html += '</tr>';


    });


    html += '</table>';

    return html;

}

//On selecting zee, reload the SMC - Summary page with selected Zee parameter
$(document).on("change", ".zee_dropdown", function(e) {

    var zee = $(this).val();

    var url = baseURL + "/app/site/hosting/scriptlet.nl?script=735&deploy=1&compid=1048144";

    url += "&zee=" + zee + "";

    window.location.href = url;
});

$(document).on("click", ".remove_service", function(e) {
    if (confirm('Are you sure you want to remove this service from run?\n\nThis action cannot be undone.')) {
        var service_id = $(this).attr('data-serviceid');
        var serviceLegSearch = nlapiLoadSearch('customrecord_service_leg', 'customsearch_rp_leg_freq_all');

        var newFilters = new Array();
        newFilters[newFilters.length] = new nlobjSearchFilter('internalid', 'custrecord_service_leg_service', 'is', service_id);
        newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_service_leg_franchisee', null, 'is', zee);
        newFilters[newFilters.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

        serviceLegSearch.addFilters(newFilters);

        var resultSet = serviceLegSearch.runSearch();
        var leg_toinactivate = [];
        var freq_toinactivate = [];
        resultSet.forEachResult(function(searchResult) {
            if (leg_toinactivate[leg_toinactivate.length - 1] != searchResult.getValue('internalid')) {
                leg_toinactivate[leg_toinactivate.length] = searchResult.getValue('internalid');
            }
            freq_toinactivate[freq_toinactivate.length] = searchResult.getValue("internalid", "CUSTRECORD_SERVICE_FREQ_STOP", null);
            console.log('leg_toinactivate', leg_toinactivate);
            console.log('freq_toinactivate', freq_toinactivate);
            return true
        });

        for (i = 0; i < leg_toinactivate.length; i++) {
            var leg_id = leg_toinactivate[i];
            console.log('delete leg', leg_id);
            var legRecord = nlapiLoadRecord('customrecord_service_leg', leg_id);
            legRecord.setFieldValue('isinactive', 'T');
            nlapiSubmitRecord(legRecord);
        }

        for (i = 0; i < freq_toinactivate.length; i++) {
            var freq_id = freq_toinactivate[i];
            console.log('delete leg', leg_id);
            var freqRecord = nlapiLoadRecord('customrecord_service_freq', freq_id);
            freqRecord.setFieldValue('isinactive', 'T');
            console.log('delete freq', freq_id);
            nlapiSubmitRecord(freqRecord);
        }

        $(this).prop('hidden', true);
        //console.log($(this).attr('hidden'));
        console.log($(this).closest('button'));
    }


});



/**
 * [AddJavascript description] - Add the JS to the postion specified in the page.
 * @param {[type]} jsname [description]
 * @param {[type]} pos    [description]
 */
function AddJavascript(jsname, pos) {
    var tag = document.getElementsByTagName(pos)[0];
    var addScript = document.createElement('script');
    addScript.setAttribute('type', 'text/javascript');
    addScript.setAttribute('src', jsname);
    tag.appendChild(addScript);
}

/**
 * [AddStyle description] - Add the CSS to the position specified in the page
 * @param {[type]} cssLink [description]
 * @param {[type]} pos     [description]
 */
function AddStyle(cssLink, pos) {
    var tag = document.getElementsByTagName(pos)[0];
    var addLink = document.createElement('link');
    addLink.setAttribute('type', 'text/css');
    addLink.setAttribute('rel', 'stylesheet');
    addLink.setAttribute('href', cssLink);
    tag.appendChild(addLink);
}