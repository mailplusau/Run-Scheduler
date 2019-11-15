/**
 * Module Description
 * 
 * NSVersion    Date            		Author         
 * 1.00       	2018-03-08 09:48:39   		Ankith 
 *
 * Remarks:         
 * 
 * @Last Modified by:   mailplusar
 * @Last Modified time: 2018-03-20 11:50:40
 *
 */

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

var baseURL = 'https://system.na2.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
	baseURL = 'https://system.sandbox.netsuite.com';
}

function pageInit() {

	var serviceLegSearch = nlapiLoadSearch('customrecord_service_leg', 'customsearch_rp_leg_freq_all');

	var newFilters = new Array();
	newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_service_leg_franchisee', null, 'is', zee);

	serviceLegSearch.addFilters(newFilters);

	var resultSet = serviceLegSearch.runSearch();

	var old_stop_id;

	var stop_count = 0;
	var freq_count = 0;
	var stop_freq_json = '{ "data": [';

	resultSet.forEachResult(function(searchResult) {
		var stop_id = searchResult.getValue('internalid');
		var stop_name = searchResult.getValue('name');
		var stop_duration = parseInt(searchResult.getValue('custrecord_service_leg_duration'));
		var stop_notes = searchResult.getValue('custrecord_service_leg_notes');
		var service_id = searchResult.getValue('custrecord_service_leg_service');
		var customer_id = searchResult.getValue('custrecord_service_leg_customer');

		var freq_id = searchResult.getValue("internalid", "CUSTRECORD_SERVICE_FREQ_STOP", null);
		var freq_mon = searchResult.getValue("custrecord_service_freq_day_mon", "CUSTRECORD_SERVICE_FREQ_STOP", null);
		var freq_tue = searchResult.getValue("custrecord_service_freq_day_tue", "CUSTRECORD_SERVICE_FREQ_STOP", null);
		var freq_wed = searchResult.getValue("custrecord_service_freq_day_wed", "CUSTRECORD_SERVICE_FREQ_STOP", null);
		var freq_thu = searchResult.getValue("custrecord_service_freq_day_thu", "CUSTRECORD_SERVICE_FREQ_STOP", null);
		var freq_fri = searchResult.getValue("custrecord_service_freq_day_fri", "CUSTRECORD_SERVICE_FREQ_STOP", null);
		var freq_adhoc = searchResult.getValue("custrecord_service_freq_day_adhoc", "CUSTRECORD_SERVICE_FREQ_STOP", null);
		var freq_time_current = convertTo24Hour(searchResult.getValue("custrecord_service_freq_time_current", "CUSTRECORD_SERVICE_FREQ_STOP", null));
		var freq_time_start = convertTo24Hour(searchResult.getValue("custrecord_service_freq_time_start", "CUSTRECORD_SERVICE_FREQ_STOP", null));
		var freq_time_end = convertTo24Hour(searchResult.getValue("custrecord_service_freq_time_end", "CUSTRECORD_SERVICE_FREQ_STOP", null));
		var freq_run_plan = searchResult.getValue("custrecord_service_freq_run_plan", "CUSTRECORD_SERVICE_FREQ_STOP", null);

		if (!isNullorEmpty(freq_id)) {
			var freq_time_current_array = freq_time_current.split(':');

			var min_array = convertSecondsToMinutes(stop_duration);

			min_array[0] = min_array[0] + parseInt(freq_time_current_array[1]);


			if (freq_mon == 'T') {
				stop_freq_json += '{"id": "' + stop_id + '",';
				stop_freq_json += '"title": "' + stop_name + '",';

				var start_time = moment().day(1).hours(freq_time_current_array[0]).minutes(freq_time_current_array[1]).seconds(0).format();
				var end_time = moment().add({
					seconds: min_array[1]
				}).day(1).hours(freq_time_current_array[0]).minutes(min_array[0]).format();

				stop_freq_json += '"start": "' + start_time + '",';
				stop_freq_json += '"end": "' + end_time + '",';
				stop_freq_json += '"description": "' + stop_notes + '",';
				stop_freq_json += '"customer_id": "' + customer_id + '",';
				stop_freq_json += '"service_id": "' + service_id + '",';
				stop_freq_json += '"freq_id": "' + freq_id + '"},';
			}
			if (freq_tue == 'T') {
				stop_freq_json += '{"id": "' + stop_id + '",';
				stop_freq_json += '"title": "' + stop_name + '",';
				var start_time = moment().day(2).hours(freq_time_current_array[0]).minutes(freq_time_current_array[1]).seconds(0).format();
				var end_time = moment().add({
					seconds: min_array[1]
				}).day(2).hours(freq_time_current_array[0]).minutes(min_array[0]).format();

				stop_freq_json += '"start": "' + start_time + '",';
				stop_freq_json += '"end": "' + end_time + '",';
				stop_freq_json += '"description": "' + stop_notes + '",';
				stop_freq_json += '"customer_id": "' + customer_id + '",';
				stop_freq_json += '"service_id": "' + service_id + '",';
				stop_freq_json += '"freq_id": "' + freq_id + '"},';
			}
			if (freq_wed == 'T') {
				stop_freq_json += '{"id": "' + stop_id + '",';
				stop_freq_json += '"title": "' + stop_name + '",';

				var start_time = moment().day(3).hours(freq_time_current_array[0]).minutes(freq_time_current_array[1]).seconds(0).format();
				var end_time = moment().add({
					seconds: min_array[1]
				}).day(3).hours(freq_time_current_array[0]).minutes(min_array[0]).format();

				stop_freq_json += '"start": "' + start_time + '",';
				stop_freq_json += '"end": "' + end_time + '",';
				stop_freq_json += '"description": "' + stop_notes + '",';
				stop_freq_json += '"customer_id": "' + customer_id + '",';
				stop_freq_json += '"service_id": "' + service_id + '",';
				stop_freq_json += '"freq_id": "' + freq_id + '"},';
			}
			if (freq_thu == 'T') {
				stop_freq_json += '{"id": "' + stop_id + '",';
				stop_freq_json += '"title": "' + stop_name + '",';

				var start_time = moment().day(4).hours(freq_time_current_array[0]).minutes(freq_time_current_array[1]).seconds(0).format();
				var end_time = moment().add({
					seconds: min_array[1]
				}).day(4).hours(freq_time_current_array[0]).minutes(min_array[0]).format();

				stop_freq_json += '"start": "' + start_time + '",';
				stop_freq_json += '"end": "' + end_time + '",';
				stop_freq_json += '"description": "' + stop_notes + '",';
				stop_freq_json += '"customer_id": "' + customer_id + '",';
				stop_freq_json += '"service_id": "' + service_id + '",';
				stop_freq_json += '"freq_id": "' + freq_id + '"},';
			}
			if (freq_fri == 'T') {
				stop_freq_json += '{"id": "' + stop_id + '",';
				stop_freq_json += '"title": "' + stop_name + '",';

				var start_time = moment().day(5).hours(freq_time_current_array[0]).minutes(freq_time_current_array[1]).seconds(0).format();
				var end_time = moment().add({
					seconds: min_array[1]
				}).day(5).hours(freq_time_current_array[0]).minutes(min_array[0]).format();

				stop_freq_json += '"start": "' + start_time + '",';
				stop_freq_json += '"end": "' + end_time + '",';
				stop_freq_json += '"description": "' + stop_notes + '",';
				stop_freq_json += '"customer_id": "' + customer_id + '",';
				stop_freq_json += '"service_id": "' + service_id + '",';
				stop_freq_json += '"freq_id": "' + freq_id + '"},';
			}


			old_stop_id = stop_id;
		}


		stop_count++;
		return true;
	});

	stop_freq_json = stop_freq_json.substring(0, stop_freq_json.length - 1);
	stop_freq_json += ']}';

	console.log(stop_freq_json);

	var parsedStopFreq = JSON.parse(stop_freq_json);

	console.log(parsedStopFreq);


	$('#calendar').fullCalendar({
		themeSystem: 'bootstrap3',
		header: {
			left: '',
			center: '',
			right: 'agendaWeek,listWeek,agendaDay,listDay'
		},
		hiddenDays: [0],
		defaultView: "agendaWeek",
		weekNumbers: true,
		eventLimit: true,
		slotDuration: "00:01:00",
		minTime: "05:00:00",
		maxTime: "18:00:00",
		contentHeight: "auto",
		views: {
			listWeek: {
				buttonText: 'List Week'
			},
			listDay: {
				buttonText: 'List Day'
			},
			week: {
				buttonText: 'Week',
				columnHeaderHtml: function(mom) {
					if (mom.weekday() === 6) {
						return '<b>Adhoc Events</b>';
					} else {
						return '<b>' + mom.format('dddd') + '</b>';
					}
				}
			},
			day: {
				buttonText: 'Day',
				columnHeaderHtml: function(mom) {
					if (mom.weekday() === 6) {
						return '<b>Adhoc Events</b>';
					} else {
						return '<b>' + mom.format('dddd') + '</b>';
					}
				}
			}
		},
		navLinks: true,
		allDayText: "Adhoc Events",
		allDaySlot: false,
		events: parsedStopFreq.data,
		eventRender: function(event, element) {
			element.qtip({
				content: event.description2
			});
			element.find('.fc-title').append("<br/>" + event.description);
		},
		eventClick: function(eventObj) {
			var upload_url = baseURL + nlapiResolveURL('SUITELET', 'customscript_sl_schedule_service', 'customdeploy_sl_schedule_service') + '&customerid=' + eventObj.customer_id + '&serviceid=' + eventObj.service_id;
			window.open(upload_url, "_self", "height=750,width=650,modal=yes,alwaysRaised=yes");
		}

		// allow "more" link when too many events
		// events: 'https://fullcalendar.io/demo-events.json'
	});
}

function onclick_createRun() {

	var operatorSearch = nlapiLoadSearch('customrecord_operator', 'customsearch_app_operator_load');

	var newFilters = new Array();
	newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_operator_franchisee', null, 'is', zee);

	operatorSearch.addFilters(newFilters);

	var resultSet = operatorSearch.runSearch();

	var runPlanSearch = nlapiLoadSearch('customrecord_run_plan', 'customsearch_app_run_plan_active');

	var newFilters_runPlan = new Array();
	newFilters_runPlan[newFilters_runPlan.length] = new nlobjSearchFilter('custrecord_run_franchisee', null, 'is', zee);

	runPlanSearch.addFilters(newFilters_runPlan);

	var resultSet_runPlan = runPlanSearch.runSearch();

	var create_run_html = '<table id= "run_table" class="table table-responsive table-striped"><thead><tr class="info"><th><b>ACTION</b></th><th><b>RUN NAME</b></th><th><b>OPERATOR</b></th></thead><tbody>';

	resultSet_runPlan.forEachResult(function(searchResult_runPlan) {

		create_run_html += '<tr>';

		create_run_html += '<td class="first_col"><button class="btn btn-warning btn-sm edit_class glyphicon glyphicon-pencil" data-runplanid="' + searchResult_runPlan.getValue('internalid') + '" type="button" data-toggle="tooltip" data-placement="right" title="Edit"></button><button class="btn btn-danger btn-sm remove_class glyphicon glyphicon-trash" type="button" data-toggle="tooltip" data-placement="right" data-runplanid="' + searchResult_runPlan.getValue('internalid') + '" title="Delete"></button><input type="hidden" class="delete_run" value="F" /></td>';

		create_run_html += '<td><input class="form-control run_name" type="text" value="' + searchResult_runPlan.getValue('name') + '" readonly/></td>';
		create_run_html += '<td><select class="form-control operator" readonly>';
		resultSet.forEachResult(function(searchResult) {

			var operator_internal_id = searchResult.getValue("internalid");
			var operator_name = searchResult.getValue("name");

			if (searchResult_runPlan.getValue('custrecord_run_franchisee') == operator_internal_id) {
				create_run_html += '<option selected value="' + operator_internal_id + '">' + operator_name + '</option>';
			} else {
				create_run_html += '<option value="' + operator_internal_id + '">' + operator_name + '</option>';
			}


			return true;
		})
		create_run_html += '</select></td>';

		create_run_html += '</tr>';

		return true;
	});



	create_run_html += '<tr>';

	create_run_html += '<td class="first_col"><button class="btn btn-success btn-sm add_class glyphicon glyphicon-plus" type="button" data-toggle="tooltip" data-placement="right" title="Add New Package"></button><input type="hidden" class="delete_run" value="F" /></td>';

	create_run_html += '<td><input class="form-control run_name" type="text" /></td>';
	create_run_html += '<td><select class="form-control operator" >';
	resultSet.forEachResult(function(searchResult) {

		var operator_internal_id = searchResult.getValue("internalid");
		var operator_name = searchResult.getValue("name");

		create_run_html += '<option value="' + operator_internal_id + '">' + operator_name + '</option>';

		return true;
	})
	create_run_html += '</select></td>';

	create_run_html += '</tr>';

	create_run_html += '</tbody></table>';


	$('.modal .modal-header').html('<div class="form-group"><h4><label class="control-label" for="inputError1">Create Run</label></h4></div>');
	$('.modal .modal-body').html("");
	$('.modal .modal-body').html(create_run_html);
	$('.modal').modal("show");
}

/**
 * [description] - On click of the Add button
 */
$(document).on('click', '.add_class', function(event) {

	var operatorSearch = nlapiLoadSearch('customrecord_operator', 'customsearch_app_operator_load');

	var newFilters = new Array();
	newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_operator_franchisee', null, 'is', zee);

	operatorSearch.addFilters(newFilters);

	var resultSet = operatorSearch.runSearch();

	var row_count = $('#run_table tr').length;

	row_count++;

	var create_run_html = '';

	create_run_html += '<tr><td class="first_col"><button class="btn btn-success btn-sm add_class glyphicon glyphicon-plus" data-runplanid="" type="button" data-toggle="tooltip" data-placement="right" title="Add New Package"></button><input type="hidden" class="delete_run" value="F" /></td>';

	create_run_html += '<td><input class="form-control run_name" type="text" /></td>';
	create_run_html += '<td><select class="form-control operator" >';
	resultSet.forEachResult(function(searchResult) {

		var operator_internal_id = searchResult.getValue("internalid");
		var operator_name = searchResult.getValue("name");

		create_run_html += '<option value="' + operator_internal_id + '">' + operator_name + '</option>';

		return true;
	})
	create_run_html += '</select></td>';
	create_run_html += '</tr>';

	$('#run_table tr:last').after(create_run_html);

	$(this).toggleClass('btn-warning btn-success')
	$(this).toggleClass('glyphicon-pencil glyphicon-plus');
	$(this).toggleClass('edit_class add_class');
	$(this).find('edit_class').prop('title', 'Edit Package');
	$(this).closest('tr').find('.run_name').prop('disabled', function(i, v) {
		return !v;
	});
	$(this).closest('tr').find('.operator').prop('disabled', function(i, v) {
		return !v;
	});

	$(this).closest('tr').find('.first_col').append('<button class="btn btn-danger btn-sm remove_class glyphicon glyphicon-trash" type="button" data-toggle="tooltip" data-placement="right" data-runplanid="" title="Delete"></button>');


});

/**
 * [description] - On click of the delete button
 */
$(document).on('click', '.remove_class', function(event) {

	if (confirm('Are you sure you want to delete this item?\n\nThis action cannot be undone.')) {

		$(this).closest('tr').find('.delete_run').val("T");
		$(this).closest("tr").hide();
	}



});

/**
 * [description] - On click of the delete button
 */
$(document).on('click', '.save_run', function(event) {

	var delete_run_elem = document.getElementsByClassName("delete_run");
	var edit_class_elem = document.getElementsByClassName("edit_class");
	var run_name_elem = document.getElementsByClassName("run_name");
	var operator_elem = document.getElementsByClassName("operator");

	for (var i = 0; i < edit_class_elem.length; ++i) {

		if (delete_run_elem[i].value == 'T') {
			var runPlanID = edit_class_elem[i].getAttribute('data-runplanid');
			if (!isNullorEmpty(runPlanID)) {
				var run_plan_record = nlapiLoadRecord('customrecord_run_plan', runPlanID);
				run_plan_record.setFieldValue('isinactive', 'T');
				nlapiSubmitRecord(run_plan_record);
			}
		} else {
			var runPlanID = edit_class_elem[i].getAttribute('data-runplanid');
			if (isNullorEmpty(runPlanID)) {
				var run_plan_record = nlapiCreateRecord('customrecord_run_plan');
			} else {
				var run_plan_record = nlapiLoadRecord('customrecord_run_plan', runPlanID);
			}

			run_plan_record.setFieldValue('custrecord_run_franchisee', zee);
			run_plan_record.setFieldValue('name', run_name_elem[i].value);

			for (var y = 0, len = operator_elem[i].options.length; y < len; y++) {
				opt = operator_elem[i].options[y];

				if (opt.selected === true) {
					run_plan_record.setFieldValue('custrecord_run_operator', operator_elem[i].options[y].value);
				}
			}

			nlapiSubmitRecord(run_plan_record);
		}

	}

});

function saveRecord() {
	return true;
}

function convertSecondsToMinutes(seconds) {
	var min = Math.floor(seconds / 60);
	var sec = seconds % 60;

	var minutes_array = [];

	minutes_array[0] = min;
	minutes_array[1] = sec;

	return minutes_array;
}

function convertTo24Hour(time) {
	nlapiLogExecution('DEBUG', 'time', time);
	var hours = parseInt(time.substr(0, 2));
	if (time.indexOf('AM') != -1 && hours == 12) {
		time = time.replace('12', '0');
	}
	if (time.indexOf('AM') != -1 && hours < 10) {
		time = time.replace(hours, ('0' + hours));
	}
	if (time.indexOf('PM') != -1 && hours < 12) {
		time = time.replace(hours, (hours + 12));
	}
	return time.replace(/( AM| PM)/, '');
}