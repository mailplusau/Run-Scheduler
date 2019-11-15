/*
* @Author: ankith.ravindran
* @Date:   2018-12-18 10:20:07
* @Last Modified by:   ankith.ravindran
* @Last Modified time: 2019-01-03 08:55:31
*/



function main() {
	var openingDateSearch = nlapiLoadSearch('customrecord_service_leg', 'customsearch_rp_customer_opening_date');
	var resultOpeningDate = openingDateSearch.runSearch();

	resultOpeningDate.forEachResult(function(searchResult) {

			var service_leg_id = searchResult.getValue("internalid");

			var serviceLegRecord = nlapiLoadRecord('customrecord_service_leg', service_leg_id);

			serviceLegRecord.setFieldValue('custrecord_service_leg_closing_date', null);
			serviceLegRecord.setFieldValue('custrecord_service_leg_opening_date', null);

			nlapiSubmitRecord(serviceLegRecord);

		return true;
	});
}