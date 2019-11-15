/**
 * Module Description
 * 
 * NSVersion    Date                    Author         
 * 1.00         2018-03-09 10:49:03         Ankith 
 *
 * Remarks:         
 * 
 * @Last Modified by:   mailplusar
 * @Last Modified time: 2018-03-22 09:01:17
 *
 */
var baseURL = 'https://system.na2.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
	baseURL = 'https://system.sandbox.netsuite.com';
}

var delete_freq_array = [];
var freq_change = false;

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

function pageInit() {

}


$(".nav-pills").on("click", "a", function(e) {
	console.log($(this).attr('data-addstop'))
	if (isNullorEmpty($(this).attr('data-addstop'))) {
		console.log('inside');
		$(this).tab('show');
		$('.add_stop_li').removeClass('active');
	} else {
		console.log('23')
		$('.add_stop_li').removeClass('active');
	}

});


$(document).on("click", ".close", function() {

	var divid = $(this).attr('data-stopid');
	$(this).parents('li').remove();
	$('#' + divid).remove();
	$(".nav-pills li").children('a').first().click();
});

//Onclick of the Add Stop button and add new tab
$(document).on("click", ".add_stop", function() {
	$(".add_stop_link").trigger("click");
});

//To add new tab with all the details.
$('.add_stop_link').click(function(e) {
	e.preventDefault();
	var id = $(".nav-pills").children().length; //think about it ;)
	$(this).closest('li').before('<li class="stop' + id + ' "><a href="#new_stop_' + id + '" class="stop' + id + '" data-toggle="tab">Stop ' + id + ' <button type="button" class="close" aria-label="Close" data-stopid="stop' + id + '"><span aria-hidden="" style="color: red;position: absolute;">×</span></button></a></li>');

	var inlineQty = '<div role="tabpanel" class="tab-pane " id="new_stop_' + id + '">';
	inlineQty += '<div class="form-group container stop_name_row ">';
	inlineQty += '<div class="row">';
	inlineQty += '<div class="col-xs-6 stop_name_section"><div class="input-group"><span class="input-group-addon" id="descp_text">STOP NAME</span><input id="stop_name" class="form-control stop_name" /></div></div>';
	inlineQty += '</div>';
	inlineQty += '</div>';

	inlineQty += '<div class="form-group container stop_type_row ">';
	inlineQty += '<div class="row">';
	inlineQty += '<div class="col-xs-6 stop_name_section"><div class="input-group"><span class="input-group-addon" id="descp_text">STOP TYPE</span><select id="stop_type" class="form-control stop_type" ><option value="0"></option><option value="3">Transfer In</option><option value="4">Transfer Out</option></select></div></div>';
	inlineQty += '</div>';
	inlineQty += '</div>';

	inlineQty += '<div class="form-group container duration_row ">';
	inlineQty += '<div class="row">';
	inlineQty += '<div class="col-xs-6 duration_section"><div class="input-group"><span class="input-group-addon" id="descp_text">DURATION</span><input id="duration" class="form-control duration" /></div></div>';
	inlineQty += '</div>';
	inlineQty += '</div>';

	inlineQty += '<div class="form-group container notes_row ">';
	inlineQty += '<div class="row">';
	inlineQty += '<div class="col-xs-6 notes_section"><div class="input-group"><span class="input-group-addon" id="descp_text">NOTES</span><textarea id="notes" class="form-control notes"  rows="4" cols="50" ></textarea></div></div>';
	inlineQty += '</div>';
	inlineQty += '</div>';


	inlineQty += '<div class="form-group container difference_row ">';
	inlineQty += '<div class="row">';
	inlineQty += '<div class="col-xs-6 difference_section"><div class="input-group"><input type="text" readonly value="DIFFERENT FOR EACH DAY?" class="form-control input-group-addon"/> <span class="input-group-addon"><input type="checkbox" id="different_each_day" class=" different_each_day" data-stopid="' + id + '" /></span></div></div>';
	inlineQty += '</div>';
	inlineQty += '</div>';

	inlineQty += '<div class="form-group container run_row ">';
	inlineQty += '<div class="row">';
	inlineQty += '<div class="col-xs-6 run_section"><div class="input-group"><span class="input-group-addon" id="run_text">SELECT RUN</span><input id="run" class="form-control run" type="textbox" /></div></div>';
	inlineQty += '</div>';
	inlineQty += '</div>';

	inlineQty += '<div class="form-group container time_row ">';
	inlineQty += '<div class="row">';
	inlineQty += '<div class="col-xs-6 service_time_section"><div class="input-group"><span class="input-group-addon" id="service_time_text">SERVICE TIME</span><input id="service_time" class="form-control service_time" type="time" /></div></div>';
	inlineQty += '</div>';
	inlineQty += '</div>';

	inlineQty += '<div class="form-group container time_window_row ">';
	inlineQty += '<div class="row">';
	inlineQty += '<div class="col-xs-3 earliest_time_section"><div class="input-group"><span class="input-group-addon" id="earliest_time_text">EARLIEST TIME</span><input id="earliest_time" class="form-control earliest_time" type="time" /></div></div>';
	inlineQty += '<div class="col-xs-3 latest_time_section"><div class="input-group"><span class="input-group-addon" id="latest_time_text">LATEST TIME</span><input id="latest_time" class="form-control latest_time" type="time" /></div></div>';
	inlineQty += '</div>';
	inlineQty += '</div>';

	inlineQty += '<table border="0" cellpadding="15" id="services' + id + '" class="table table-responsive table-striped services tablesorter hide" cellspacing="0" style="width: 100%;"><thead style="color: white;background-color: #607799;"><tr class="text-center">';

	/**
	 * DAYS OF WEEK ROW
	 */
	inlineQty += '<th style="vertical-align: middle;text-align: center;"><b></b></th>';

	/**
	 * SELECT RUN ROW
	 */
	inlineQty += '<th style="vertical-align: middle;text-align: center;"><b>SELECT RUN</b></th>';
	/**
	 * SERVICE TIME ROW
	 */
	inlineQty += '<th style="vertical-align: middle;text-align: center;"><b>SERVICE TIME<span class="modal_display glyphicon glyphicon-info-sign" style="padding: 3px 3px 3px 3px;color: orange;cursor: pointer;" data-whatever=""></span></b></th>';
	/**
	 * TIME WINDOW ROW
	 */

	inlineQty += '<th style="vertical-align: middle;text-align: center;"><b>EARLIEST TIME <span class="modal_display glyphicon glyphicon-info-sign" style="padding: 3px 3px 3px 3px;color: orange;cursor: pointer;" data-whatever=""></span></b></th>';

	inlineQty += '<th style="vertical-align: middle;text-align: center;"><b>LATEST TIME <span class="modal_display glyphicon glyphicon-info-sign" style="padding: 3px 3px 3px 3px;color: orange;cursor: pointer;" data-whatever=""></span></b></th>';

	inlineQty += '</tr></thead><tbody>';

	inlineQty += '</tbody></table>';

	inlineQty += '<div class="form-group container add_stop_row ">';
	inlineQty += '<div class="row">';
	inlineQty += '<div class="col-xs-3 add_stop_section"><button id="add_stop" class="form-control btn btn-primary add_stop" > ADD STOP</button></div>';
	inlineQty += '</div>';
	inlineQty += '</div>';


	inlineQty += '</div>';

	$('.tab-content').append(inlineQty);
	$('.' + id).trigger("click");
	// $('.add_stop_li').removeClass('active');
	// $(".nav-pills li").children('a').first().click();
});

function uncheckDailyAdhocFreq() {
	$('#daily').prop('checked', false);
	$('#adhoc').prop('checked', false);
}

$(document).on('click', '.monday', function() {
	if (!$(this).is(':checked')) {
		uncheckDailyAdhocFreq();
		checkIfMultiFreq('mon', 'T');
	} else {
		checkIfMultiFreq('mon', 'F');
	}
	freq_change = true;
});

$(document).on('click', '.tuesday', function() {
	if (!$(this).is(':checked')) {
		uncheckDailyAdhocFreq();
		checkIfMultiFreq('tue', 'T');
	} else {
		checkIfMultiFreq('tue', 'F');
	}
	freq_change = true;
});

$(document).on('click', '.wednesday', function() {
	if (!$(this).is(':checked')) {
		uncheckDailyAdhocFreq();
		checkIfMultiFreq('wed', 'T');
	} else {
		checkIfMultiFreq('wed', 'F');
	}
	freq_change = true;
});

$(document).on('click', '.thursday', function() {
	if (!$(this).is(':checked')) {
		uncheckDailyAdhocFreq();
		checkIfMultiFreq('thu', 'T');
	} else {
		checkIfMultiFreq('thu', 'F');
	}
	freq_change = true;
});

$(document).on('click', '.friday', function() {
	if (!$(this).is(':checked')) {
		uncheckDailyAdhocFreq();
		checkIfMultiFreq('fri', 'T');
	} else {
		checkIfMultiFreq('fri', 'F');
	}
	freq_change = true;
});

$(document).on('click', '.service_time_window_button', function() {
	var previous_time_window = $(this).attr('data-timewindow');
	var stop_id = $(this).attr('data-stopid');

	var split_time_window = previous_time_window.split(' - ');

	console.log(split_time_window);

	var earliest_time = convertTo24Hour(split_time_window[0]);
	var latest_time = convertTo24Hour(split_time_window[1]);

	console.log(earliest_time);
	console.log(latest_time);

	$('#earliest_time' + stop_id).val(earliest_time);
	$('#latest_time' + stop_id).val(latest_time);

});

$(document).on('click', '.service_time_button', function() {
	var previous_time = $(this).attr('data-time');
	var stop_id = $(this).attr('data-stopid');

	console.log(previous_time);
	$('#service_time' + stop_id).val(previous_time);

});

//If Different For Each Day is checked
$(document).on('click', '.different_each_day', function() {
	if ($(this).is(':checked')) {
		var id = $(this).attr('data-stopid');
		var table_id = '#services' + id;
		var loaded_multifreq = $(this).attr('data-multifreq');
		var freq_id = $(this).attr('data-freqid');
		if (!isNullorEmpty(freq_id)) {
			delete_freq_array[delete_freq_array.length] = freq_id;
		}
		$('#run' + id).addClass('hide');
		$('#service_time' + id).addClass('hide');
		$('#earliest_time' + id).addClass('hide');
		$('#latest_time' + id).addClass('hide');
		$('.run_row' + id).addClass('hide');
		$('.time_row' + id).addClass('hide');
		$('.previous_time_row' + id).addClass('hide');
		$('.time_window_row' + id).addClass('hide');
		$('.previous_time_window_row' + id).addClass('hide');
		if (loaded_multifreq == 'T') {
			$(table_id).removeClass('hide');
			var table_id_rows = '#services' + id + ' > tbody > tr';
			var rows;
			if (!isNullorEmpty($(table_id_rows))) {
				rows = $(table_id_rows);
			}
			console.log(rows);
			if (rows.length == 1) {

			} else {
				$(table_id).each(function(i, row) {
					if (i >= 1) {
						var $row = $(row);
						var freq_id = $row.find('.run').attr('data-freqid');

						var index = delete_freq_array.indexOf(freq_id);
						if (index > -1) {
							delete_freq_array.splice(index, 1);
						}
					}
				})
			}
		} else {
			var runPlanSearch = nlapiLoadSearch('customrecord_run_plan', 'customsearch_app_run_plan_active');

			var newFilters_runPlan = new Array();
			newFilters_runPlan[newFilters_runPlan.length] = new nlobjSearchFilter('custrecord_run_franchisee', null, 'is', zee);

			runPlanSearch.addFilters(newFilters_runPlan);

			var resultSet_runPlan = runPlanSearch.runSearch();


			var create_run_html = '';
			$(table_id).find("tr:not(:nth-child(1))").remove();

			var run_selection_html = '';
			resultSet_runPlan.forEachResult(function(searchResult_runPlan) {

				run_selection_html += '<option value="' + searchResult_runPlan.getValue('internalid') + '">' + searchResult_runPlan.getValue('name') + '</option>'
				return true;
			});

			if ($('#monday').is(':checked')) {
				create_run_html += '<tr><td style="vertical-align: middle;text-align: center;color: white;background-color: #607799;" class="day" data-freqid="">MONDAY</td><td><select id="table_run" data-day="mon" class="form-control run" type="textbox" data-oldrun="" data-stopid="' + id + '" data-freqid=""><option value="0"></option>';
				create_run_html += run_selection_html;
				create_run_html += '</select></td><td><input id="table_service_time" class="form-control service_time" data-oldtime="" type="time" /></td><td><input id="table_earliest_time" data-oldearliesttime="" class="form-control earliest_time" type="time" /></td><td><input id="table_latest_time" class="form-control latest_time" data-oldlatesttime="" type="time" /></td></tr>';
			}

			if ($('#tuesday').is(':checked')) {
				create_run_html += '<tr><td style="vertical-align: middle;text-align: center;color: white;background-color: #607799;" class="day" data-freqid="">TUESDAY</td><td><select id="table_run" data-day="tue" class="form-control run" type="textbox" data-oldrun="" data-stopid="' + id + '" data-freqid=""><option value="0"></option>';
				create_run_html += run_selection_html;
				create_run_html += '</select></td><td><input id="table_service_time" class="form-control service_time" data-oldtime="" type="time" /></td><td><input id="table_earliest_time" data-oldearliesttime="" class="form-control earliest_time" type="time" /></td><td><input id="table_latest_time" class="form-control latest_time" data-oldlatesttime="" type="time" /></td></tr>';
			}

			if ($('#wednesday').is(':checked')) {
				create_run_html += '<tr><td style="vertical-align: middle;text-align: center;color: white;background-color: #607799;" class="day" data-freqid="">WEDNESDAY</td><td><select id="table_run" data-day="wed" class="form-control run" type="textbox" data-oldrun="" data-stopid="' + id + '" data-freqid=""><option value="0"></option>';
				create_run_html += run_selection_html;
				create_run_html += '</select></td><td><input id="table_service_time" class="form-control service_time" data-oldtime="" type="time" /></td><td><input id="table_earliest_time" data-oldearliesttime="" class="form-control earliest_time" type="time" /></td><td><input id="table_latest_time" class="form-control latest_time" data-oldlatesttime="" type="time" /></td></tr>';
			}

			if ($('#thursday').is(':checked')) {
				create_run_html += '<tr><td style="vertical-align: middle;text-align: center;color: white;background-color: #607799;" class="day" data-freqid="">THURSDAY</td><td><select id="table_run" data-day="thu" class="form-control run" type="textbox" data-oldrun="" data-stopid="' + id + '" data-freqid=""><option value="0"></option>';
				create_run_html += run_selection_html;
				create_run_html += '</select></td><td><input id="table_service_time" class="form-control service_time" data-oldtime="" type="time" /></td><td><input id="table_earliest_time" data-oldearliesttime="" class="form-control earliest_time" type="time" /></td><td><input id="table_latest_time" class="form-control latest_time" data-oldlatesttime="" type="time" /></td></tr>';
			}

			if ($('#friday').is(':checked')) {
				create_run_html += '<tr><td style="vertical-align: middle;text-align: center;color: white;background-color: #607799;" class="day" data-freqid="">FRIDAY</td><td><select id="table_run" data-day="fri" class="form-control run" type="textbox" data-oldrun="" data-stopid="' + id + '" data-freqid=""><option value="0"></option>';
				create_run_html += run_selection_html;
				create_run_html += '</select></td><td><input id="table_service_time" class="form-control service_time" data-oldtime="" type="time" /></td><td><input id="table_earliest_time" data-oldearliesttime="" class="form-control earliest_time" type="time" /></td><td><input id="table_latest_time" class="form-control latest_time" data-oldlatesttime="" type="time" /></td></tr>';

			}
			$(table_id + ' tr:last').after(create_run_html);
			$(table_id).removeClass('hide');
		}


	} else {
		var id = $(this).attr('data-stopid');
		var table_id = '#services' + id;
		var freq_id = $(this).attr('data-freqid');
		var loaded_multifreq = $(this).attr('data-multifreq');
		if (!isNullorEmpty(freq_id)) {
			var index = delete_freq_array.indexOf(freq_id);
			if (index > -1) {
				delete_freq_array.splice(index, 1);
			}
		}
		if (loaded_multifreq == 'T') {
			var table_id_rows = '#services' + id + ' > tbody > tr';
			var rows;
			if (!isNullorEmpty($(table_id_rows))) {
				rows = $(table_id_rows);
			}
			console.log(rows);
			if (rows.length == 1) {

			} else {
				$(table_id).each(function(i, row) {
					if (i >= 1) {
						var $row = $(row);
						var freq_id = $row.find('.run').attr('data-freqid');

						delete_freq_array[delete_freq_array.length] = freq_id;
					}
				})
			}
		}
		$(table_id).addClass('hide');
		$('#run' + id).removeClass('hide');
		$('#service_time' + id).removeClass('hide');
		$('#earliest_time' + id).removeClass('hide');
		$('#latest_time' + id).removeClass('hide');
		$('.run_row' + id).removeClass('hide');
		$('.time_row' + id).removeClass('hide');
		$('.previous_time_row' + id).removeClass('hide');
		$('.time_window_row' + id).removeClass('hide');
		$('.previous_time_window_row' + id).removeClass('hide');
	}
});

//If Daily is checked
$(document).on('click', '#daily', function() {
	if ($(this).is(':checked')) {
		$('#monday').prop('disabled', true);
		$('#tuesday').prop('disabled', true);
		$('#wednesday').prop('disabled', true);
		$('#thursday').prop('disabled', true);
		$('#friday').prop('disabled', true);
		$('#adhoc').prop('disabled', true);
		$('#monday').prop('checked', true);
		$('#tuesday').prop('checked', true);
		$('#wednesday').prop('checked', true);
		$('#thursday').prop('checked', true);
		$('#friday').prop('checked', true);
	} else {
		$('#monday').prop('disabled', false);
		$('#tuesday').prop('disabled', false);
		$('#wednesday').prop('disabled', false);
		$('#thursday').prop('disabled', false);
		$('#friday').prop('disabled', false);
		$('#adhoc').prop('disabled', false);
		$('#monday').prop('checked', false);
		$('#tuesday').prop('checked', false);
		$('#wednesday').prop('checked', false);
		$('#thursday').prop('checked', false);
		$('#friday').prop('checked', false);
	}
	freq_change = true;
});

//If Adhoc is checked
$(document).on('click', '#adhoc', function() {
	if ($(this).is(':checked')) {
		$('#monday').prop('disabled', true);
		$('#tuesday').prop('disabled', true);
		$('#wednesday').prop('disabled', true);
		$('#thursday').prop('disabled', true);
		$('#friday').prop('disabled', true);
		$('#daily').prop('disabled', true);
		$('#monday').prop('checked', false);
		$('#tuesday').prop('checked', false);
		$('#wednesday').prop('checked', false);
		$('#thursday').prop('checked', false);
		$('#friday').prop('checked', false);
		$('#daily').prop('checked', false);
	} else {
		$('#monday').prop('disabled', false);
		$('#tuesday').prop('disabled', false);
		$('#wednesday').prop('disabled', false);
		$('#thursday').prop('disabled', false);
		$('#friday').prop('disabled', false);
		$('#daily').prop('disabled', false);

	}
	freq_change = true;
});

function checkIfMultiFreq(value, unchecked) {
	$(".tabs").each(function() {
		$(this).find(".nav-pills li").each(function(index, element) {
			var stop_id = $(this).children('a').attr('href');
			stop_id = stop_id.split('#');
			if (!isNullorEmpty(stop_id[1])) {

				// To check if a new stop has been created. -1 = NO / 0 = YES
				var new_stop = stop_id[1].indexOf('new_stop_');

				var table_id = '#services' + stop_id[1] + ' > tbody > tr';
				var rows;
				if (!isNullorEmpty($(table_id))) {
					rows = $(table_id);
				}
				console.log(rows);
				if (rows.length == 1) {

				} else {
					$(table_id).each(function(i, row) {
						if (i >= 1) {
							var $row = $(row);
							var freq_id = $row.find('.run').attr('data-freqid');

							if (unchecked == 'T') {
								if ($row.find('#table_run').attr('data-day') == value) {
									$row.hide();
									delete_freq_array[delete_freq_array.length] = freq_id;
								}
							} else {
								if ($row.find('#table_run').attr('data-day') == value) {
									$row.show();
									var index = delete_freq_array.indexOf(freq_id);
									if (index > -1) {
										delete_freq_array.splice(index, 1);
									}
								}
							}

						}
					})
				}

			}
		});
	});
}


function saveRecord() {


	var customer_id = nlapiGetFieldValue('customer_id');
	var service_id = nlapiGetFieldValue('service_id');
	var stops_ids = nlapiGetFieldValue('stop_ids');

	$(".tabs").each(function() {
		$(this).find(".nav-pills li").each(function(index, element) {
			var stop_id = $(this).children('a').attr('href');
			stop_id = stop_id.split('#');
			if (!isNullorEmpty(stop_id[1])) {

				// To check if a new stop has been created. -1 = NO / 0 = YES
				var new_stop = stop_id[1].indexOf('new_stop_');

				var table_id = '#services' + stop_id[1] + ' > tbody > tr';
				var rows;
				if (!isNullorEmpty($(table_id))) {
					rows = $(table_id);
				}
				console.log(rows);
				if (rows.length == 1) {
					var run = $('#' + stop_id[1]).find('#run' + stop_id[1]).val();
					var old_run = $('#' + stop_id[1]).find('#run' + stop_id[1]).attr('data-oldrun');
					var run_freq_id = $('#' + stop_id[1]).find('#run' + stop_id[1]).attr('data-freqid');
					var service_time = onTimeChange($('#' + stop_id[1]).find('#service_time' + stop_id[1]).val());
					var old_service_time = onTimeChange($('#' + stop_id[1]).find('#service_time' + stop_id[1]).attr('data-oldtime'));
					var earliest_time = onTimeChange($('#' + stop_id[1]).find('#earliest_time' + stop_id[1]).val());
					var old_earliest_time = onTimeChange($('#' + stop_id[1]).find('#earliest_time' + stop_id[1]).attr('data-oldearliesttime'));
					var latest_time = onTimeChange($('#' + stop_id[1]).find('#latest_time' + stop_id[1]).val());
					var old_latest_time = onTimeChange($('#' + stop_id[1]).find('#latest_time' + stop_id[1]).attr('data-oldlatesttime'));

					if (freq_change == true || (run != old_run) || (service_time != old_service_time) || (earliest_time != old_earliest_time) || (latest_time != old_latest_time)) {
						if (isNullorEmpty(run_freq_id)) {
							var freq_record = nlapiCreateRecord('customrecord_service_freq');
						} else {
							var freq_record = nlapiLoadRecord('customrecord_service_freq', run_freq_id);
						}

						freq_record.setFieldValue('custrecord_service_freq_franchisee', zee);
						freq_record.setFieldValue('custrecord_service_freq_customer', nlapiGetFieldValue('customer_id'));
						freq_record.setFieldValue('custrecord_service_freq_run_plan', run);
						freq_record.setFieldValue('custrecord_service_freq_service', nlapiGetFieldValue('service_id'));
						freq_record.setFieldValue('custrecord_service_freq_stop', stop_id[1]);
						freq_record.setFieldValue('custrecord_service_freq_time_start', earliest_time);
						freq_record.setFieldValue('custrecord_service_freq_time_end', latest_time);
						freq_record.setFieldValue('custrecord_service_freq_time_current', service_time);

						if ($('#monday').is(':checked')) {
							freq_record.setFieldValue('custrecord_service_freq_day_mon', 'T');
						} else {
							freq_record.setFieldValue('custrecord_service_freq_day_mon', 'F');
						}
						if ($('#tuesday').is(':checked')) {
							freq_record.setFieldValue('custrecord_service_freq_day_tue', 'T');
						} else {
							freq_record.setFieldValue('custrecord_service_freq_day_tue', 'F');
						}
						if ($('#wednesday').is(':checked')) {
							freq_record.setFieldValue('custrecord_service_freq_day_wed', 'T');
						} else {
							freq_record.setFieldValue('custrecord_service_freq_day_wed', 'F');
						}
						if ($('#thursday').is(':checked')) {
							freq_record.setFieldValue('custrecord_service_freq_day_thu', 'T');
						} else {
							freq_record.setFieldValue('custrecord_service_freq_day_thu', 'F');
						}
						if ($('#friday').is(':checked')) {
							freq_record.setFieldValue('custrecord_service_freq_day_fri', 'T');
						} else {
							freq_record.setFieldValue('custrecord_service_freq_day_fri', 'F');
						}

						nlapiSubmitRecord(freq_record);
					}

				} else {
					$(table_id).each(function(i, row) {
						if (i >= 1) {
							var $row = $(row);
							var freq_id = $row.find('.run').attr('data-freqid');

							var run = $row.find('#table_run').val();
							var old_run = $row.find('#table_run').attr('data-oldrun');
							var service_time = onTimeChange($row.find('#table_service_time').val());
							var old_service_time = onTimeChange($row.find('#table_service_time').attr('data-oldtime'));
							var earliest_time = onTimeChange($row.find('#table_earliest_time').val());
							var old_earliest_time = onTimeChange($row.find('#table_earliest_time').attr('data-oldearliesttime'));
							var latest_time = onTimeChange($row.find('#table_latest_time').val());
							var old_latest_time = onTimeChange($row.find('#table_latest_time').attr('data-oldlatesttime'));

							if (freq_change == true || (run != old_run) || (service_time != old_service_time) || (earliest_time != old_earliest_time) || (latest_time != old_latest_time)) {
								if (isNullorEmpty(freq_id)) {
									var freq_record = nlapiCreateRecord('customrecord_service_freq');
								} else {
									var freq_record = nlapiLoadRecord('customrecord_service_freq', freq_id);
								}
								freq_record.setFieldValue('custrecord_service_freq_franchisee', zee);
								freq_record.setFieldValue('custrecord_service_freq_customer', nlapiGetFieldValue('customer_id'));
								freq_record.setFieldValue('custrecord_service_freq_run_plan', run);
								freq_record.setFieldValue('custrecord_service_freq_service', nlapiGetFieldValue('service_id'));
								freq_record.setFieldValue('custrecord_service_freq_stop', stop_id[1]);

								freq_record.setFieldValue('custrecord_service_freq_time_start', earliest_time);
								freq_record.setFieldValue('custrecord_service_freq_time_end', latest_time);
								freq_record.setFieldValue('custrecord_service_freq_time_current', service_time);
								if ($row.find('#table_run').attr('data-day') == 'mon') {
									freq_record.setFieldValue('custrecord_service_freq_day_mon', 'T');
								}
								if ($row.find('#table_run').attr('data-day') == 'tue') {
									freq_record.setFieldValue('custrecord_service_freq_day_tue', 'T');
								}
								if ($row.find('#table_run').attr('data-day') == 'wed') {
									freq_record.setFieldValue('custrecord_service_freq_day_wed', 'T');
								}
								if ($row.find('#table_run').attr('data-day') == 'thu') {
									freq_record.setFieldValue('custrecord_service_freq_day_thu', 'T');
								}
								if ($row.find('#table_run').attr('data-day') == 'fri') {
									freq_record.setFieldValue('custrecord_service_freq_day_fri', 'T');
								}

								nlapiSubmitRecord(freq_record);

							}
						}
					})
				}

			}
		});
	});

	if (!isNullorEmpty(delete_freq_array)) {
		var delete_freq_string = delete_freq_array.join();
		nlapiSetFieldValue('delete_freq', delete_freq_string)
	}

	return true;
}

//Build the JSON string to get all the values from the tab
function buildRequestStringData(form, stop_id) {
	var select = form.find('select'),
		input = form.find('input'),
		textarea = form.find('textarea'),
		requestString = '{"stop_id":"' + stop_id + '",';
	var table_id = '#services' + stop_id + ' > tbody > tr';
	console.log(table_id)
	var rows;
	if (!isNullorEmpty($(table_id))) {
		rows = $(table_id);
	}
	console.log(rows);
	if (rows.length == 1) {

	} else {
		$(table_id).each(function(i, row) {
			if (i >= 1) {
				var $row = $(row);
				console.log($row.find('#table_run').val());
			}
		})
	}

	var different_checkbox = false;
	var days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

	for (var i = 0; i < select.length; i++) {
		requestString += '"' + $(select[i]).attr('id') + '": "' + $(select[i]).val() + '",';
	}
	for (var i = 0; i < textarea.length; i++) {
		requestString += '"' + $(textarea[i]).attr('id') + '": "' + $(textarea[i]).val() + '",';
	}
	if (textarea.length > 1) {
		requestString = requestString.substring(0, requestString.length - 1);
	}
	for (var i = 0; i < input.length; i++) {
		if (!isNullorEmpty($(input[i]).attr('id'))) {
			if ($(input[i]).attr('type') !== 'checkbox') {

				requestString += '"' + $(input[i]).attr('id') + '":"' + $(input[i]).val() + '",';
			} else {
				if ($(input[i]).is(':checked')) {
					requestString += '"' + $(input[i]).attr('id') + '":"true",';
					different_checkbox = true;
				} else {
					requestString += '"' + $(input[i]).attr('id') + '":"false",';
				}

			}
		}
	}
	if (input.length > 1) {
		requestString = requestString.substring(0, requestString.length - 1);
	}
	requestString += '}';
	return requestString;
}

function onTimeChange(value) {
	var timeSplit = value.split(':'),
		hours,
		minutes,
		meridian;
	hours = timeSplit[0];
	minutes = timeSplit[1];
	if (hours > 12) {
		meridian = 'PM';
		hours -= 12;
	} else if (hours < 12) {
		meridian = 'AM';
		if (hours == 0) {
			hours = 12;
		}
	} else {
		meridian = 'PM';
	}
	return (hours + ':' + minutes + ' ' + meridian);
}

function convertTo24Hour(time) {
	var hours_string = (time.substr(0, 2));
	var hours = parseInt(time.substr(0, 2));
	if (time.indexOf('AM') != -1 && hours == 12) {
		time = time.replace('12', '0');
	}
	// if (time.indexOf('AM') != -1 && hours < 10) {
	// 	time = time.replace(hours, ('0' + hours));
	// }
	if (time.indexOf('PM') != -1 && hours < 12) {
		console.log(hours + 12)
		time = time.replace(hours_string, (hours + 12));
	}
	return time.replace(/( AM| PM)/, '');
}