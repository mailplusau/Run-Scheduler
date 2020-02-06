/*var usage_threshold = 30; //20
var usage_threshold_invoice = 1000; //1000
var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;*/
var ctx = nlapiGetContext();

function main() {
    /*    nlapiLogExecution('AUDIT', 'prev_deployment', ctx.getSetting('SCRIPT', 'custscript_rp_prev_deployment'));
        if (!isNullorEmpty(ctx.getSetting('SCRIPT', 'custscript_rp_prev_deployment'))) {
            prev_inv_deploy = ctx.getSetting('SCRIPT', 'custscript_rp_prev_deployment');
        } else {
            prev_inv_deploy = ctx.getDeploymentId();
        }*/

    var count = 0;
    var old_leg_id;
    var job_id_array = [];
    var freq_id_array = [];

    //SEARCH : App Service Leg - Unlink Stop/Job
    var stopSearch = nlapiLoadSearch('customrecord_service_leg', 'customsearch_unlink_stop_job');
    var resultSetStop = stopSearch.runSearch();
    resultSetStop.forEachResult(function(searchResult) {

        /*
                var usage_loopstart_cust = ctx.getRemainingUsage();


                if (usage_loopstart_cust < usage_threshold) {

                    var params = {
                        custscript_rp_prev_deployment: ctx.getDeploymentId()
                    }

                    reschedule = rescheduleScript(prev_inv_deploy, adhoc_inv_deploy, params);
                    nlapiLogExecution('AUDIT', 'Reschedule Return', reschedule);
                    if (reschedule == false) {

                        return false;
                    }
                }*/

        var leg_id = searchResult.getValue("internalid");
        var job_id = searchResult.getValue("internalid", "CUSTRECORD159", null);
        var freq_id = searchResult.getValue("internalid", "CUSTRECORD_SERVICE_FREQ_STOP", null);
        if (count == 0) {
            if (!isNullorEmpty(job_id)) {
                job_id_array[0] = job_id;
            }
            if (!isNullorEmpty(freq_id)) {
                freq_id_array[0] = freq_id;
            }
        } else {
            if (leg_id == old_leg_id) {
                if (!isNullorEmpty(job_id)) {
                    job_id_array[job_id_array.length] = job_id;
                }
                if (!isNullorEmpty(freq_id)) {
                    freq_id_array[freq_id_array.length] = freq_id;
                }
            } else if (leg_id != old_leg_id) {
                nlapiLogExecution('DEBUG', 'leg_id', leg_id);
                nlapiLogExecution('DEBUG', 'old_leg_id', old_leg_id);
                nlapiLogExecution('DEBUG', 'job_id_array', job_id_array);
                nlapiLogExecution('DEBUG', 'freq_id_array', freq_id_array);
                for (i = 0; i < job_id_array.length; i++) {
                    nlapiLogExecution('DEBUG', 'job_id_array[i]', job_id_array[i]);
                    var jobRecord = nlapiLoadRecord('customrecord_job', job_id_array[i]);
                    jobRecord.setFieldValue('custrecord_job_stop', null);
                    jobRecord.setFieldValue('custrecord159', null);
                    nlapiSubmitRecord(jobRecord);
                }
                for (i = 0; i < freq_id_array.length; i++) {
                    nlapiLogExecution('DEBUG', 'freq_id_array[i]', freq_id_array[i]);
                    nlapiDeleteRecord('customrecord_service_freq', freq_id_array[i]);
                }
                nlapiLogExecution('DEBUG', 'old_leg_id', old_leg_id);
                nlapiDeleteRecord('customrecord_service_leg', old_leg_id);

                job_id_array = [];
                freq_id_array = [];

                if (!isNullorEmpty(job_id)) {
                    job_id_array[job_id_array.length] = job_id;
                }
                if (!isNullorEmpty(freq_id)) {
                    freq_id_array[freq_id_array.length] = freq_id;
                }

            }
        }
        old_leg_id = leg_id;
        count++;
        return true;

    });

    if (count > 0) {
        for (i = 0; i < job_id_array.length; i++) {
            nlapiLogExecution('DEBUG', 'job_id_array[i]', job_id_array[i]);
            var jobRecord = nlapiLoadRecord('customrecord_job', job_id_array[i]);
            jobRecord.setFieldValue('custrecord_job_stop', null);
            jobRecord.setFieldValue('custrecord159', null);
            nlapiSubmitRecord(jobRecord);
        }
        for (i = 0; i < freq_id_array.length; i++) {
            nlapiLogExecution('DEBUG', 'freq_id_array[i]', freq_id_array[i]);
            nlapiDeleteRecord('customrecord_service_freq', freq_id_array[i]);
        }
        nlapiLogExecution('DEBUG', 'old_leg_id', old_leg_id);
        nlapiDeleteRecord('customrecord_service_leg', old_leg_id);
    }


}