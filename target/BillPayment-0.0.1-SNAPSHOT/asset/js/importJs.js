/**
 * Import javascript base on browser
 */

var contextPath = encodeURIComponent(window.location.pathname).split('%2F')[1];

var domain = '/'+contextPath+'/';

//var domain = '/payment/home/';

var isIE = /*@cc_on!@*/false || !!document.documentMode;

if(typeof jQuery == 'undefined'){
	document.write('<script type="text/javascript" src="'+domain+'asset/js/jquery/dist/jquery.min.js"></script>');
}
document.write('<script type="text/javascript" src="'+domain+'asset/js/jquery/dist/jquery.loadTemplate-1.4.4.js"></script>');
document.write('<script type="text/javascript" src="'+domain+'asset/js/jquery/dist/jquery-ui.js"></script>');
document.write('<script type="text/javascript" src="'+domain+'asset/js/modal.js"></script>');
document.write('<script type="text/javascript" src="'+domain+'asset/js/sgds-v1.3.2.js"></script>');
document.write('<script type="text/javascript" src="'+domain+'asset/js/sort.js"></script>');
document.write('<script type="text/javascript" src="'+domain+'asset/js/pseudo.jquery.js"></script>');
if (isIE) {
	document.write('<script type="text/javascript" src="'+domain+'asset/js/ie/commons.js"></script>');
	document.write('<script type="text/javascript" src="'+domain+'asset/js/ie/validate.js"></script>');
	document.write('<script type="text/javascript" src="'+domain+'asset/js/ie/notification.js"></script>');
	document.write('<script type="text/javascript" src="'+domain+'asset/js/ie/datatable.js"></script>');
} else {
	document.write('<script type="text/javascript" src="'+domain+'asset/js/commons.js"></script>');
	document.write('<script type="text/javascript" src="'+domain+'asset/js/validate.js"></script>');
	document.write('<script type="text/javascript" src="'+domain+'asset/js/notification.js"></script>');
	document.write('<script type="text/javascript" src="'+domain+'asset/js/datatable.js"></script>');
}
