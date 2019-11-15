/**
 * Module Description
 * 
 * NSVersion    Date            			Author         
 * 1.00       	2019-04-10 13:22:17   		ankith.ravindran
 *
 * Description:  Change the Daily Job Creation field on the App Service Leg record to "NO"       
 * 
 * @Last Modified by:   ankith.ravindran
 * @Last Modified time: 2019-04-11 15:57:44
 *
 */

var usage_threshold = 30; //20
var usage_threshold_invoice = 1000; //1000
var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();

function main() {

	nlapiLogExecution('AUDIT', 'prev_deployment', ctx.getSetting('SCRIPT', 'custscript_rp_prev_deployment'));
	if (!isNullorEmpty(ctx.getSetting('SCRIPT', 'custscript_rp_prev_deployment'))) {
		prev_inv_deploy = ctx.getSetting('SCRIPT', 'custscript_rp_prev_deployment');
	} else {
		prev_inv_deploy = ctx.getDeploymentId();
	}

	//SEARCH: APP Service Leg - App Job Created
	var runPlanSearch = nlapiLoadSearch('customrecord_service_leg', 'customsearch_app_ser_leg_app_job_created');

	var resultRunPlan = runPlanSearch.runSearch();
	resultRunPlan.forEachResult(function(searchResult) {

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
		}

		var service_leg_id = searchResult.getValue("internalid");
		var service_leg_record = nlapiLoadRecord('customrecord_service_leg', service_leg_id);
		service_leg_record.setFieldValue('custrecord_app_ser_leg_daily_job_create', 2);
		nlapiSubmitRecord(service_leg_record);
		return true;
	});
}