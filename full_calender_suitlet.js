/**
 * Module Description
 * 
 * NSVersion    Date            		Author         
 * 1.00       	2018-03-08 09:48:39   		Ankith 
 *
 * Remarks:         
 * 
 * @Last Modified by:   mailplusar
 * @Last Modified time: 2018-03-17 10:53:48
 *
 */

var baseURL = 'https://system.na2.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
	baseURL = 'https://system.sandbox.netsuite.com';
}

function runPlanner(request, response) {
	if (request.getMethod() == "GET") {

		var form = nlapiCreateForm('Run Planner');


		var inlineQty = '';

		inlineQty += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"><script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.1/jquery.min.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script>';

		inlineQty += ' <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.css"><link rel="stylesheet" type="text/css" media="print" href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.print.css"><script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/moment.min.js"></script><script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.js"></script>';

		
		inlineQty += '<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/jquery.qtip.min.css"><script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/jquery.qtip.min.js"></script>'

		inlineQty += '<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm" role="document"><div class="modal-content" style="width: max-content;"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title panel panel-info" id="exampleModalLabel">Information</h4><br> </div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-primary save_run" data-dismiss="modal">SAVE</button><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div><div id="calendar"></div>';


		form.addField('preview_table', 'inlinehtml', '').setLayoutType('outsidebelow', 'startrow').setDefaultValue(inlineQty);


		form.addSubmitButton('SCHEDULE SERVICE');
		form.addButton('create_run', 'CREATE RUN', 'onclick_createRun()');
		form.addButton('back', 'RESET', 'onclick_reset()');
		form.setScript('customscript_cl_full_calendar');

		response.writePage(form);

	} else {
		nlapiSetRedirectURL('SUITELET', 'customscript_sl_rp_customer_list', 'customdeploy_sl_rp_customer_list', null, null);
	}
}