function send_sms_scheduled() {


    var zeeSearch = nlapiLoadSearch('partner', 'customsearch_rp_zee_no_job_created');

    var resultZee = zeeSearch.runSearch();

    resultZee.forEachResult(function(searchResultZee) {

        var message = '';
        var mobile = '0402712233';

        var encmessage = escape(message);

        var length = encmessage.length;

        if (length > 160) {

            var outputString = splitter(encmessage, 155);

            for (var i = 0; i < outputString.length; i++) {
                mobile = mobile.replace(/ /g, '');
                var final_message = '[' + (i + 1) + ' of ' + outputString.length + ' SMS] - ' + outputString[i]
                window.open("http://www.mplamp.net/mailplus_satchels/sms_relay_toll.php?a=" + mobile + "&m=" + final_message);
            }

        }
        return true;
    });

}