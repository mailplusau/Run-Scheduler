/*
 * @Author: ankith.ravindran
 * @Date:   2018-09-19 13:20:56
 * @Last Modified by:   Ankith
 * @Last Modified time: 2020-04-02 09:19:11
 */
var days_of_week = [];
days_of_week[0] = 0;
days_of_week[1] = 'custrecord_service_freq_stop.custrecord_service_freq_day_mon';
days_of_week[2] = 'custrecord_service_freq_stop.custrecord_service_freq_day_tue';
days_of_week[3] = 'custrecord_service_freq_stop.custrecord_service_freq_day_wed';
days_of_week[4] = 'custrecord_service_freq_stop.custrecord_service_freq_day_thu';
days_of_week[5] = 'custrecord_service_freq_stop.custrecord_service_freq_day_fri';
days_of_week[6] = 6;

var usage_threshold = 200; //20
var usage_threshold_invoice = 1000; //1000
var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();

var date_of_week;

function main() {

    var day = moment().utc().day();
    var date = moment().utc().add(1, 'days').date();
    var month = moment().utc().month();
    var year = moment().utc().year();

    var startDate = moment([year, month]);
    var endDate = moment(startDate).endOf('month').date();

    nlapiLogExecution('DEBUG', 'day', day);
    nlapiLogExecution('DEBUG', 'original date', moment().utc().date());
    nlapiLogExecution('DEBUG', 'date', date);
    nlapiLogExecution('DEBUG', 'Last Day of Month', endDate);
    nlapiLogExecution('DEBUG', 'month', month);
    nlapiLogExecution('DEBUG', 'year', year);

    nlapiLogExecution('AUDIT', 'prev_deployment', ctx.getSetting('SCRIPT', 'custscript_rp_prev_deployment'));
    if (!isNullorEmpty(ctx.getSetting('SCRIPT', 'custscript_rp_prev_deployment'))) {
        prev_inv_deploy = ctx.getSetting('SCRIPT', 'custscript_rp_prev_deployment');
    } else {
        prev_inv_deploy = ctx.getDeploymentId();
    }

    var zeeSearch = nlapiLoadSearch('partner', 'customsearch_rp_zee_no_job_created');

    var resultZee = zeeSearch.runSearch();

    resultZee.forEachResult(function(searchResultZee) {

        var zee_id = searchResultZee.getValue("internalid");
        var zee_name = searchResultZee.getValue("entityid");

        nlapiLogExecution('DEBUG', 'date_of_week', date_of_week);
        //SEARCH: RP - Service Leg Frequency - All - Create App Jobs
        var runPlanSearch = nlapiLoadSearch('customrecord_service_leg', 'customsearch_rp_leg_freq_create_app_jobs');

        nlapiLogExecution('DEBUG', days_of_week[day]);
        // nlapiLogExecution('DEBUG', service_leg_customer);


        if (day != 0 && day != 6) {
            var filterExpression = [
                [
                    [days_of_week[day], "is", 'T'], // customer id
                    "OR", ["custrecord_service_freq_stop.custrecord_service_freq_day_adhoc", "is", 'T']
                ],
                "AND", ["isinactive", "is", "F"],
                //"AND", ["custrecord_service_leg_franchisee", "is", zee_id],
                //"AND", ["custrecord_service_leg_franchisee", "is", 228330],
                "AND", ["custrecord_service_leg_customer.partner", "is", zee_id],
                "AND", ["custrecord_service_leg_customer.status", "anyof", "32", "13"],
                "AND", ["custrecord_service_leg_service.isinactive", "is", "F"],
                "AND", ["custrecord_service_freq_stop.internalid", "noneof", "@NONE@"],
                "AND", [
                    ["formulatext: CASE WHEN TO_CHAR({custrecord_service_leg_closing_date}, 'DD/MM/YYYY') <= TO_CHAR(SYSDATE, 'DD/MM/YYYY') THEN 'T' ELSE 'F' END", "is", "F"], "AND", ["formulatext: CASE WHEN TO_CHAR({custrecord_service_leg_opening_date}, 'DD/MM/YYYY') > TO_CHAR(SYSDATE, 'DD/MM/YYYY') THEN 'T' ELSE 'F' END", "is", "F"]
                ],
                "AND", ["custrecord_app_ser_leg_daily_job_create", "anyof", "2", "@NONE@"],
                //"AND", ["custrecord_service_leg_franchisee.custentity_zee_app_job_created", "anyof", "@NONE@", "2"]
            ];
            // var newFiltersRunPlan = new Array();
            // newFiltersRunPlan[newFiltersRunPlan.length] = new nlobjSearchFilter(days_of_week[day], 'custrecord_service_freq_stop', 'is', 'T');
            //  newFiltersRunPlan[newFiltersRunPlan.length] = new nlobjSearchFilter('custrecord_service_freq_day_adhoc', 'custrecord_service_freq_stop', 'is', 'T');
            // runPlanSearch.addFilters(newFiltersRunPlan);
            // nlapiLogExecution('DEBUG', 'Filter Expression', filterExpression)
            runPlanSearch.setFilterExpression(filterExpression);
        }



        var resultRunPlan = runPlanSearch.runSearch();

        // var runPlanResult = resultRunPlan.getResults()

        // nlapiLogExecution('DEBUG', 'Length', runPlanResult.length)

        if (!isNullorEmpty(ctx.getSetting('SCRIPT', 'custscript_rp_old_service_id'))) {
            var old_service_id = ctx.getSetting('SCRIPT', 'custscript_rp_old_service_id');
        } else {
            var old_service_id;
        }

        if (!isNullorEmpty(ctx.getSetting('SCRIPT', 'custscript_rp_app_job_group_id'))) {
            var app_job_group_id2 = ctx.getSetting('SCRIPT', 'custscript_rp_app_job_group_id');
        } else {
            var app_job_group_id2;
        }

        var count = 0;
        var exit = false;
        resultRunPlan.forEachResult(function(searchResult) {


            var service_leg_id = searchResult.getValue("internalid", null, "GROUP");
            var service_leg_name = searchResult.getValue("name", null, "GROUP");
            var service_leg_zee = searchResult.getValue("custrecord_service_leg_franchisee", null, "GROUP");
            var service_leg_customer = searchResult.getValue("custrecord_service_leg_customer", null, "GROUP");
            var service_leg_customer_text = searchResult.getText("custrecord_service_leg_customer", null, "GROUP");
            var service_id = searchResult.getValue("internalid", "CUSTRECORD_SERVICE_LEG_SERVICE", "GROUP");
            var service_leg_service = searchResult.getValue("custrecord_service_leg_service", null, "GROUP");
            var service_leg_service_text = searchResult.getText("custrecord_service_leg_service", null, "GROUP");
            var service_price = searchResult.getValue("custrecord_service_price", "CUSTRECORD_SERVICE_LEG_SERVICE", "GROUP");
            var service_cat = searchResult.getValue("custrecord_service_category", "CUSTRECORD_SERVICE_LEG_SERVICE", "GROUP");
            var service_leg_no = searchResult.getValue("custrecord_service_leg_number", null, "GROUP");
            var service_leg_ncl = searchResult.getValue("custrecord_service_leg_non_cust_location", null, "GROUP");
            var service_leg_addr = searchResult.getValue("custrecord_service_leg_addr", null, "GROUP");
            var service_leg_addr_postal = searchResult.getValue("custrecord_service_leg_addr_postal", null, "GROUP");
            var service_leg_addr_subdwelling = searchResult.getValue("custrecord_service_leg_addr_subdwelling", null, "GROUP");
            var service_leg_addr_st_num = searchResult.getValue("custrecord_service_leg_addr_st_num_name", null, "GROUP");
            var service_leg_addr_suburb = searchResult.getValue("custrecord_service_leg_addr_suburb", null, "GROUP");
            var service_leg_addr_state = searchResult.getValue("custrecord_service_leg_addr_state", null, "GROUP");
            var service_leg_addr_postcode = searchResult.getValue("custrecord_service_leg_addr_postcode", null, "GROUP");
            var service_leg_addr_lat = searchResult.getValue("custrecord_service_leg_addr_lat", null, "GROUP");
            var service_leg_addr_lon = searchResult.getValue("custrecord_service_leg_addr_lon", null, "GROUP");
            var service_leg_type = searchResult.getValue("custrecord_service_leg_type", null, "GROUP");
            var service_leg_duration = searchResult.getValue("custrecord_service_leg_duration", null, "GROUP");
            var service_leg_notes = searchResult.getValue("custrecord_service_leg_notes", null, "GROUP");
            var service_leg_location_type = searchResult.getValue("custrecord_service_leg_location_type", null, "GROUP");
            var service_leg_transfer_type = searchResult.getValue("custrecord_service_leg_trf_type", null, "GROUP");
            var service_leg_transfer_linked_stop = searchResult.getValue("custrecord_service_leg_trf_linked_stop", null, "GROUP");
            var service_freq_id = searchResult.getValue("internalid", "CUSTRECORD_SERVICE_FREQ_STOP", "GROUP");
            var service_freq_mon = searchResult.getValue("custrecord_service_freq_day_mon", "CUSTRECORD_SERVICE_FREQ_STOP", "GROUP");
            var service_freq_tue = searchResult.getValue("custrecord_service_freq_day_tue", "CUSTRECORD_SERVICE_FREQ_STOP", "GROUP");
            var service_freq_wed = searchResult.getValue("custrecord_service_freq_day_wed", "CUSTRECORD_SERVICE_FREQ_STOP", "GROUP");
            var service_freq_thu = searchResult.getValue("custrecord_service_freq_day_thu", "CUSTRECORD_SERVICE_FREQ_STOP", "GROUP");
            var service_freq_fri = searchResult.getValue("custrecord_service_freq_day_fri", "CUSTRECORD_SERVICE_FREQ_STOP", "GROUP");
            var service_freq_adhoc = searchResult.getValue("custrecord_service_freq_day_adhoc", "CUSTRECORD_SERVICE_FREQ_STOP", "GROUP");
            var service_freq_time_current = searchResult.getValue("custrecord_service_freq_time_current", "CUSTRECORD_SERVICE_FREQ_STOP", "GROUP");
            var service_freq_time_start = searchResult.getValue("custrecord_service_freq_time_start", "CUSTRECORD_SERVICE_FREQ_STOP", "GROUP");
            var service_freq_time_end = searchResult.getValue("custrecord_service_freq_time_end", "CUSTRECORD_SERVICE_FREQ_STOP", "GROUP");
            var service_freq_run_plan_id = searchResult.getValue("custrecord_service_freq_run_plan", "CUSTRECORD_SERVICE_FREQ_STOP", "GROUP");
            var service_freq_operator = searchResult.getValue("custrecord_service_freq_operator", "CUSTRECORD_SERVICE_FREQ_STOP", "GROUP");
            var service_freq_zee = searchResult.getValue("custrecord_service_freq_franchisee", "CUSTRECORD_SERVICE_FREQ_STOP", "GROUP");

            var service_multiple_operators = searchResult.getValue("custrecord_multiple_operators","CUSTRECORD_SERVICE_LEG_SERVICE","GROUP");

            var street_no_name = null;

            nlapiLogExecution('DEBUG', 'service_leg_id', service_leg_id);
            try {
                // statements

                if (!isNullorEmpty(service_freq_run_plan_id)) {
                    var run_plan_record = nlapiLoadRecord('customrecord_run_plan', service_freq_run_plan_id);
                    var run_plan_inactive = run_plan_record.getFieldValue('isinactive');



                    if (run_plan_inactive == 'F') {

                        if (isNullorEmpty(service_leg_addr_subdwelling) && !isNullorEmpty(service_leg_addr_st_num)) {
                            street_no_name = service_leg_addr_st_num;
                        } else if (!isNullorEmpty(service_leg_addr_subdwelling) && isNullorEmpty(service_leg_addr_st_num)) {

                            street_no_name = service_leg_addr_subdwelling;
                        } else {

                            street_no_name = service_leg_addr_subdwelling + ', ' + service_leg_addr_st_num;
                        }

                        service_leg_addr_st_num = street_no_name;

                        if (old_service_id != service_id) {

                            var usage_loopstart_cust = ctx.getRemainingUsage();

                            nlapiLogExecution('DEBUG', 'usage_loopstart_cust', usage_loopstart_cust);
                            nlapiLogExecution('DEBUG', 'usage_threshold', usage_threshold);

                            if (usage_loopstart_cust < usage_threshold) {

                                var params = {
                                    custscript_rp_prev_deployment: ctx.getDeploymentId(),
                                    custscript_rp_old_service_id: old_service_id,
                                    custscript_rp_app_job_group_id: app_job_group_id2
                                }

                                reschedule = rescheduleScript(prev_inv_deploy, adhoc_inv_deploy, params);
                                nlapiLogExecution('AUDIT', 'Reschedule Return', reschedule);
                                if (reschedule == false) {
                                    exit = true;
                                    return false;
                                }
                            }

                            var service_leg_record = nlapiLoadRecord('customrecord_service_leg', service_leg_id);
                            service_leg_record.setFieldValue('custrecord_app_ser_leg_daily_job_create', 1);
                            nlapiSubmitRecord(service_leg_record);

                            app_job_group_id2 = createAppJobGroup(service_leg_service_text, service_leg_customer, service_leg_zee, service_id);

                            createAppJobs(service_leg_id, service_leg_customer, service_leg_name,
                                service_id,
                                service_price,
                                service_freq_time_current,
                                service_freq_time_end,
                                service_freq_time_start,
                                service_leg_no,
                                app_job_group_id2,
                                service_leg_addr_st_num,
                                service_leg_addr_suburb,
                                service_leg_addr_state,
                                service_leg_addr_postcode,
                                service_leg_addr_lat,
                                service_leg_addr_lon, service_leg_zee, service_id, service_leg_notes, service_freq_run_plan_id, service_leg_location_type, service_freq_adhoc, service_leg_customer_text, service_multiple_operators);

                        } else {
                            var service_leg_record = nlapiLoadRecord('customrecord_service_leg', service_leg_id);
                            service_leg_record.setFieldValue('custrecord_app_ser_leg_daily_job_create', 1);
                            nlapiSubmitRecord(service_leg_record);

                            createAppJobs(service_leg_id, service_leg_customer, service_leg_name,
                                service_id,
                                service_price,
                                service_freq_time_current,
                                service_freq_time_end,
                                service_freq_time_start,
                                service_leg_no,
                                app_job_group_id2,
                                service_leg_addr_st_num,
                                service_leg_addr_suburb,
                                service_leg_addr_state,
                                service_leg_addr_postcode,
                                service_leg_addr_lat,
                                service_leg_addr_lon, service_leg_zee, service_id, service_leg_notes, service_freq_run_plan_id, service_leg_location_type, service_freq_adhoc, service_leg_customer_text, service_multiple_operators);
                        }
                    }
                }
            } catch (e) {
                // statements
                var body = 'Error on one of the following: \n';
                body += 'Service Leg ID: ' + service_leg_id + '\n';
                body += 'Service Leg Freq ID: ' + service_freq_id + '\n';
                body += 'Run Plan: ' + service_freq_run_plan_id + '\n';
                body += 'e: ' + e + '\n';
                nlapiSendEmail(112209, 'ankith.ravindran@mailplus.com.au', 'Create App Jobs', body);
            }

            old_service_id = service_id;
            count++;
            return true;
        });

        nlapiLogExecution('AUDIT', 'Total Count for ' + zee_name, count);
        if (exit == false) {
            var zee_record = nlapiLoadRecord('partner', zee_id);
            zee_record.setFieldValue('custentity_zee_app_job_created', 1);
            nlapiSubmitRecord(zee_record, false, true);
            reschedule = rescheduleScript(prev_inv_deploy, adhoc_inv_deploy, null);
            if (reschedule == false) {

                return false;
            }
        }

        return true;
    });

}

function createAppJobGroup(service_leg_service_text,
    service_leg_customer, service_leg_zee, service_id) {
    var app_job_group_rec = nlapiCreateRecord('customrecord_jobgroup');
    app_job_group_rec.setFieldValue('name', service_leg_service_text + '_' + date_of_week);
    app_job_group_rec.setFieldValue('custrecord_jobgroup_ref', service_leg_service_text + '_' + date_of_week);
    app_job_group_rec.setFieldValue('custrecord_jobgroup_customer', service_leg_customer);
    app_job_group_rec.setFieldValue('custrecord_jobgroup_franchisee', service_leg_zee);
    app_job_group_rec.setFieldValue('custrecord_jobgroup_service', service_id);
    app_job_group_rec.setFieldValue('custrecord_jobgroup_status', 4);

    var app_job_group_id = nlapiSubmitRecord(app_job_group_rec);

    return app_job_group_id;
}

function createAppJobs(service_leg_id, service_leg_customer, service_leg_name,
    service_id,
    service_price,
    service_freq_time_current,
    service_freq_time_end,
    service_freq_time_start,
    service_leg_no,
    app_job_group_id,
    service_leg_addr_st_num,
    service_leg_addr_suburb,
    service_leg_addr_state,
    service_leg_addr_postcode,
    service_leg_addr_lat,
    service_leg_addr_lon, service_leg_zee, service_id, service_leg_notes, service_freq_run_plan_id, service_leg_location_type, service_freq_adhoc, service_leg_customer_text, service_multiple_operators) {
    var app_job_rec = nlapiCreateRecord('customrecord_job');
    app_job_rec.setFieldValue('custrecord_job_franchisee', service_leg_zee);
    nlapiLogExecution('DEBUG', 'Adhoc Value', service_freq_adhoc);
    if (service_freq_adhoc == 'T') {
        if (service_leg_location_type == 2) {
            app_job_rec.setFieldValue('custrecord_app_job_stop_name', 'ADHOC - ' + service_leg_name + ' - ' + service_leg_customer_text);
        } else {
            app_job_rec.setFieldValue('custrecord_app_job_stop_name', 'ADHOC - ' + service_leg_name);
        }

    } else {
        app_job_rec.setFieldValue('custrecord_app_job_stop_name', service_leg_name);
    }

    app_job_rec.setFieldValue('custrecord_job_customer', service_leg_customer);
    app_job_rec.setFieldValue('custrecord_job_source', 6);
    app_job_rec.setFieldValue('custrecord_job_service', service_id);
    app_job_rec.setFieldValue('custrecord_job_service_price', service_price);
    app_job_rec.setFieldValue('custrecord_job_stop', service_leg_id);
    app_job_rec.setFieldValue('custrecord159', service_leg_id);
    app_job_rec.setFieldValue('custrecord_job_status', 1);
    app_job_rec.setFieldValue('custrecord_job_date_scheduled', date_of_week);
    app_job_rec.setFieldValue('custrecord_job_time_scheduled', service_freq_time_current);
    app_job_rec.setFieldValue('custrecord_job_time_scheduled_after', service_freq_time_end);
    app_job_rec.setFieldValue('custrecord_job_time_scheduled_before', service_freq_time_start);
    app_job_rec.setFieldValue('custrecord_job_service_leg', service_leg_no);
    app_job_rec.setFieldValue('custrecord_job_group', app_job_group_id);
    // app_job_rec.setFieldValue('custrecord_job_group_status');
    app_job_rec.setFieldValue('custrecord_app_job_st_name_no', service_leg_addr_st_num);
    app_job_rec.setFieldValue('custrecord_app_job_suburb', service_leg_addr_suburb);
    app_job_rec.setFieldValue('custrecord_app_job_state', service_leg_addr_state);
    app_job_rec.setFieldValue('custrecord_app_job_post_code', service_leg_addr_postcode);
    app_job_rec.setFieldValue('custrecord_app_job_lat', service_leg_addr_lat);
    app_job_rec.setFieldValue('custrecord_app_job_lon', service_leg_addr_lon);
    app_job_rec.setFieldValue('custrecord_app_job_notes', service_leg_notes);
    app_job_rec.setFieldValue('custrecord_app_job_run', service_freq_run_plan_id);
    app_job_rec.setFieldValue('custrecord_app_job_location_type', service_leg_location_type);
    // app_job_rec.setFieldValue('');
    app_job_rec.setFieldValue('custrecord_job_multiple_operators', service_multiple_operators);

    nlapiSubmitRecord(app_job_rec);
}



function convertTo24Hour(time) {
    // nlapiLogExecution('DEBUG', 'time', time);
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


function onTimeChange(value) {
    if (!isNullorEmpty(value)) {
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
}

// function getDate() {
//     var date = new Date();
//     // if (date.getHours() > 6) {
//     date = nlapiAddDays(date, 1);
//     // }
//     nlapiLogExecution('DEBUG', 'Inside date function', date)
//     date = nlapiDateToString(date);

//     return date;
// }