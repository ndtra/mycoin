/**
* Description: Count and set max length for component
*
*
*/

$(document).ready(function() {
	das_validate();
});

function das_validate() {
	rd_requireField();
	rd_requireNum();
	rd_requirePositiveNum();
	rd_compareDate();
	rd_validateEmail();
	rd_requireInt();
	rd_formatNric(); 
	rd_requirePhoneNumber();
	rd_requireSelect();
	rd_compareDateBetween();
	rd_compareDateBetweenCurrent();
	rd_compareDateBigger();
	rd_formatUen();
	rd_compareDateBiggerChangeRequest();
	rd_compareDateBiggerChangeRequestOrderV();
	setMaxInputDate();
}


function rd_formatUen() {
	var elements = $('.format-uen');
	$.each(elements, function(index, element){
		$(element).formatUen();
	});
}


function rd_requireNum() {
	var elements = $('.require-number');
	$.each(elements, function(index, element){
		$(element).requireNumber();
	});
}

function rd_requirePositiveNum() {
	var elements = $('.require-positive-number');
	$.each(elements, function(index, element){
		$(element).requirePositiveNumber();
	});
}

function rd_requireInt() {
	var elements = $('.require-integer');
	$.each(elements, function(index, element){
		$(element).requireInteger();
	});
}

function rd_requireField() {
	var elements = $('.require-field');
	$.each(elements, function(index, element){
		$(element).requireField();
	});
}

function rd_requireSelect() {
	var elements = $('.select-have-value');
	$.each(elements, function(index, element){
		$(element).haveValue();
	});
}

function rd_compareDate() {
	var elements = $('input[type=date].validate-date-lesser');
	$.each(elements, function(index, element){
		var other = $(element).attr('data-target');
		$(element).lesser(other);
	});
}

function setMaxInputDate() {
	var elements = $('input[type=date]');
	$.each(elements, function(index, element){
		$(element).attr('max', '9999-12-31');
	});
}

function rd_compareDateBigger() {
	var elements = $('input[type=date].validate-date-bigger');
	$.each(elements, function(index, element){
		var other = $(element).attr('data-target');
		$(element).bigger(other);
	});
}

function rd_compareDateBiggerChangeRequest() {
	var elements = $('input[type=date].validate-date-bigger-change-request');
	$.each(elements, function(index, element){
		var other = $(element).attr('data-target');
		$(element).biggerChangeRequest(other);
	});
}

function rd_compareDateBiggerChangeRequestOrderV() {
	var elements = $('input[type=date].validate-date-bigger-change-request-order');
	$.each(elements, function(index, element){
		var other = $(element).attr('data-target');
		$(element).biggerChangeRequestOrderV(other);
	});
}

function rd_compareDateBetween() {
	var elements = $('input[type=date].validate-date-between');
	$.each(elements, function(index, element){
		var minId = $(element).attr('data-target-min');
		var maxId = $(element).attr('data-target-max');
		$(element).between(minId, maxId);
	});
}

function rd_compareDateBetweenCurrent() {
	var elements = $('input[type=date].validate-date-between-current');
	$.each(elements, function(index, element){
		var minId = $(element).attr('data-target-min');
		var maxId = $(element).attr('data-target-max');
		$(element).betweenCurrent(minId, maxId);
	});
}

function rd_validateEmail() {
	var elements = $('input[type=email]');
	$.each(elements, function(index, element) {
		$(element).validEmail();
	});
}

function rd_requirePhoneNumber(){
	var elements = $('.require-phone-number');
	$.each(elements, function(index, element){
		$(element).requirePhoneNumber();
	});
}

function rd_formatNric(){
	var elements = $('.format-nric');
	$.each(elements, function(index, element){
		$(element).formatNric();
	});
}

$.fn.requireField = function requireField() {
	return requireValidate("#"+$(this).attr('id'));
}

$.fn.sgdsSetMaxLengthWithCounter = function setMaxLengthWithCounter(){
	var ele = $(this);
	var element = this
	var maxLength = parseInt(element.attr('maxlength'));
	var eleOrg = ele.attr('id');
	eleOrg = eleOrg.replace('#','').replace('.','');
	$('.'+eleOrg+'-counter').remove();
	
	var _v = ele.val();
	var _l = _v.length;
	$('.'+eleOrg+'-counter').remove();
	var total = maxLength;
	var remain = _l;
	var template = `<p class='${eleOrg}-counter'>${remain}/${total} characters</p>`;
	ele.after(template);
}

function setMaxLengthWithCounter(element, max){
	var maxLength = parseInt(max);
	var maxChar = parseInt(max);
	var ele = $(element);
	var eleOrg = element.replace('#','').replace('.','');
	$('.'+eleOrg+'-counter').remove();
	ele.attr('maxlength', maxLength);
	
	// init
	var template = `<p class='${eleOrg}-counter'>0/${maxLength} characters</p>`;
	ele.after(template);
	
	ele.keyup(function() {
		var _v = ele.val();
		var _l = count(_v);
		$('.'+eleOrg+'-counter').remove();
		var total = maxChar;
		var remain = _l;
		var template = `<p class='${eleOrg}-counter'>${remain}/${total} characters</p>`;
		ele.after(template);
		ele.attr('maxlength', maxLength);
	});
	
	ele.keydown(function(event) {
		if (event.keyCode == 13) {
			if (count(ele.val()) > maxLength) {
				event.preventDefault();
			}
		}
	});
	ele.on('paste', function() {
		setTimeout(function () { //workaround for catching the pasted input
			var _v = ele.val();
			var _l = count(_v);
			if (_l > maxLength) {
				ele.val((_v).substring(0, maxLength));
			}
			$('.'+eleOrg+'-counter').remove();
			var total = maxChar;
			var remain = count(ele.val());
			var template = `<p class='${eleOrg}-counter'>${remain}/${total} characters</p>`;
			ele.after(template);
			ele.attr('maxlength', maxLength);
	    }, 100);
		
	});
	
	function count(str) {
		// For chrome
		let strAttr = str.split('\r\n');
		// For other
		let strAttr2 = str.split('\n');
		
		if (strAttr.length == 1 && strAttr2.length == 1) {
			return str.length;
		}
		
		if (strAttr.length > 1) {
			let count = (strAttr.length - 1) * 4;
			maxLength = maxChar - count + (strAttr.length - 1);
			for (var i = 0; i < strAttr.length; i++) {
				count += strAttr[i].length;
			}
			return count;
		}
		// For other
		let count = (strAttr2.length - 1) * 2;
		maxLength = maxChar - count + (strAttr2.length - 1);
		for (var i = 0; i < strAttr2.length; i++) {
			count += strAttr2[i].length;
		}
		return count;
	}
	
	ele.keyup();
}

function setMaxLengthWithCounterForRequire(element, max, char){
	var maxLength = parseInt(max);
	var maxChar = parseInt(max);
	var ele = $(element);
	var eleOrg = element.replace('#','').replace('.','');
	$('.'+eleOrg+'-counter').remove();
	ele.attr('maxlength', maxLength);
	
	// init
	var template = `<p class='${eleOrg}-counter'>0/${maxLength} characters</p>`;
	if(char > 0){
		var template = `<p class='${eleOrg}-counter'>${char}/${maxLength} characters</p>`;
	}
	ele.after(template);
	
	ele.keyup(function() {
		var _v = ele.val();
		var _l = count(_v); 
		$('.'+eleOrg+'-counter').remove();
		var total = maxChar;
		var remain = _l;
		var template = `<p class='${eleOrg}-counter'>${remain}/${total} characters</p>`;
		ele.after(template);
		ele.attr('maxlength', maxLength);
	});
	
	
	ele.keydown(function(event) {
		if (event.keyCode == 13) {
			if (count(ele.val()) > maxLength) {
				event.preventDefault();
			}
		}
	});
	ele.on('paste', function() {
		setTimeout(function () { //workaround for catching the pasted input
			var _v = ele.val();
			var _l = count(_v);
			if (_l > maxLength) {
				ele.val((_v).substring(0, maxLength));
			}
			$('.'+eleOrg+'-counter').remove(); 
			var total = maxChar;
			var remain = count(ele.val());
			var template = `<p class='${eleOrg}-counter'>${remain}/${total} characters</p>`;
			ele.after(template);
			ele.attr('maxlength', maxLength); 
	    }, 100);
		
	}); 
	
	function count(str) {
		// For chrome
		let strAttr = str.split('\r\n');
		// For other
		let strAttr2 = str.split('\n');
		
		if (strAttr.length == 1 && strAttr2.length == 1) {
			return str.length;
		}
		
		if (strAttr.length > 1) {
			let count = (strAttr.length - 1) * 4;
			maxLength = maxChar - count + (strAttr.length - 1);
			for (var i = 0; i < strAttr.length; i++) {
				count += strAttr[i].length;
			}
			return count;
		}
		// For other
		let count = (strAttr2.length - 1) * 2;
		maxLength = maxChar - count + (strAttr2.length - 1);
		for (var i = 0; i < strAttr2.length; i++) {
			count += strAttr2[i].length;
		}
		return count;
	}
	
}

/**
 * 
 * @param element
 * @returns
 */
function requireValidate(element){
	var ele = $(element);
	var eleOrg = element.replace('#','').replace('.','');
	var mes = getValidateMessage('validate.required');
	var isSelectTag = ele.is('select');
	var key = 'require';
	function process() {
		if (isSelectTag) {
			$('.'+eleOrg+'-'+key).remove();
			if (fnIsValid() === false) {
				ele.dataError().addError(key, mes);
			} else {
				ele.dataError().removeError(key);
			}
		} else {
			if (fnIsValid() === false) {
				ele.dataError().addError(key, mes);
			} else {
				ele.dataError().removeError(key);
			}
		}
		
	}
	
	function fnClear() {
		ele.dataError().clear();
		ele.unbind('keyup', process);
		ele.unbind('focusout', process);
	}
	
	function fnIsValid() {
		var _v = ele.val();
		if (_v != null) {
			if (parseInt(_v.length) > 0 && !ele.is('select')) {
				_v = _v.trim();				
			}			
			if (parseInt(_v.length) <= 0) {
				return false;
			} else if (ele.is('select')) {
				if (_v == "" || _v == "-1" || _v == "NAN") {
					return false;
				}
			}
		}
		return true;
	}	
	if (!ele.is('input[type=date]')) {
		ele.keyup(function(){
			process();
		});		
	}
	ele.focusout(function(){
		process();
	});
	
	if (ele.is('select')) {
		ele.change(function(){
			process();
		});
	}
	
	return {
		isValid: fnIsValid,
		clear: fnClear
	}
}


$.fn.haveValue = function haveValue() {
	var ele = $(this);
	var eleOrg = ele.attr('id');
	var mes = getValidateMessage('validate.required');
	var key = 'have-value';
	
	function process(event) {
		$('.'+eleOrg+'-'+key).remove();
		if (fnIsValid() === false) {
			ele.dataError().addError(key, mes);
		} else {
			ele.dataError().removeError(key);
		}
	}
	
	ele.focusout(function(){
		process();
	});
	
	ele.change(function(){
		process();
	});
	
	function fnIsValid() {
		var options = $('#'+eleOrg+'>option');
		if (options.length > 0) {
			return true;
		}
		return false;
	}
	
	function fnClearMessage() {
		ele.dataError().clear();
		$('.'+eleOrg+'-'+key).remove();
	}
	
	return {
		isValid: fnIsValid,
		validate: process,
		clearError: fnClearMessage
	}
}

$.fn.requireNumber = function requireNumber() { 
	var ele = $(this);
	var eleOrg = ele.attr('id');
	var mes = getValidateMessage('validate.invaledFormat');
	var key = 'number';
	
	function process(event) {
		if (fnIsValid() === false) {
			ele.dataError().addError(key, mes);
		} else {
			ele.dataError().removeError(key);
		}
	}
	
	ele.keyup(function(event){
		process(event);
	});
	
	function fnIsValid() {
		var value = ele.val();
		value = value.replace(/[,.]/g, "");
		if(isNaN(value) || hasWhiteSpace(value)) {
			return false;
		} 
		return true;
	}
	
	return {
		isValid: fnIsValid,
		validate: process
	}
}

$.fn.requirePositiveNumber = function requirePositiveNumber() {
	var ele = $(this);
	var eleOrg = ele.attr('id');
	var mes = getValidateMessage('validate.invaledFormat');
	var key = 'positiveNumber';
	
	function process(event) {
		if(fnIsValid() === false) {
			ele.dataError().addError(key, mes);
		} else {
			ele.dataError().removeError(key);			
		}
	}
	
	ele.keyup(function(event){
		process(event);
	});
	
	function fnIsValid() {
		var value = ele.val();
		value = value.replace(/[,.]/g, "");
		if (isNaN(value) || hasWhiteSpace(value) || Math.sign(value) < 0) {
			return false;
		}
		return true;
	}
	
	return {
		isValid: fnIsValid,
		validate: process
	}
}

$.fn.requirePhoneNumber = function requirePhoneNumber() {
	var ele = $(this);
	var eleOrg = ele.attr('id');
	var mess = ele.attr('message');
	var mes = getValidateMessage('mobile.invalid.format');
	var key = 'phoneNumber';
	function process(event) {
		if(mess != undefined){
			mes = getValidateMessage('phone.office.invalid');
		}
		if(fnIsValid() === false) {
			ele.dataError().addError(key, mes);
		} else {
			ele.dataError().removeError(key);			
		}
	}
	ele.blur(function(event){
		process(event); 
	});
	
	function fnIsValid() {
		var value = ele.val();
		var number = Number(value);
		var numberLength = value.length;
		var re = new RegExp(/\D/);
		 
		return Number.isInteger(number) && !re.test(value) && (numberLength == 8 || numberLength == 0);
	}
	
	return {
		isValid: fnIsValid,
		validate: process
	}
}

$.fn.formatNric = function formatNric() {
	var ele = $(this);
	var eleOrg = ele.attr('id');
	var mes = getValidateMessage('nric.invalid.format');
	var key = 'nric';
	 
	function process(event) {
		if(fnIsValid() === false) {
			ele.dataError().addError(key, mes);
		} else { 
			ele.dataError().removeError(key); 
			upperCaseNric();
		}
	} 
	
	ele.blur(function(event){
		process(event);
	});
	
	ele.focusout(function(event){
		process(event);
	});
	
	function fnIsValid() {
		var value = ele.val();  
		var regexp = /^[A-Za-z]\d{7}[A-Za-z]$/;
		return value.match(regexp) != null || value.length==0;
		//return value.length === 9 || value.length === 0; 
	}
	
	function fnClear() {
		ele.dataError().clear();
		ele.unbind('keyup', process);
		ele.unbind('focusout', process);
	}
	
	function upperCaseNric(){
		ele.val(ele.val().toUpperCase()); 
	}
	
	return {
		isValid: fnIsValid,
		validate: process, 
		clear: fnClear,
		upperCaseNric: upperCaseNric,
	}
}

$.fn.requireInteger = function requireInteger() {
	var ele = $(this);
	var eleOrg = ele.attr('id');
	var mes = getValidateMessage('validate.invaledFormat');
	var key = 'integer';
	
	function process(event) {
		if(fnIsValid() === false) {
			ele.dataError().addError(key, mes);
		} else { 
			ele.dataError().removeError(key);
		}
	}
	
	ele.keyup(function(event){
		process(event);
	});
	
	function fnIsValid() {
		var value = ele.val();
		var re = new RegExp(/\D/);
		return !re.test(value);
	}
	
	return {
		isValid: fnIsValid,
		validate: process
	}
}

$.fn.inputFilter = function(inputFilter) {
    return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      }
    });
  };

function requireAll(formId) {
	var requireFields = $(formId + ' .require-field');
	$.each(requireFields, function(index, field){
		requireValidate("#"+$(field).attr('id'));
	});
}

$.fn.clearErrorForm = function clearErrorForm() {
	var ele = $(this);
	var eleOrg = ele.attr('id');
	var requireFields = $('#' + eleOrg + ' .require-field');
	$.each(requireFields, function(index, field){
		var fieldId = $(field).attr('id');
		$('.' + fieldId + '-require').remove();
		$(field).removeClass('validate-text');
		$(field).removeClass('error');
	});
	
}

/**
 * 
 * @param element
 * @returns
 */
 $.fn.sgdsCustomError = function(_mess){
	 var message = _mess
	 var ele = $(this);
	 var eleOrg = ele.attr('id');
	 
	 var fnAddMessage = function(_mess){
		 message = _mess;
		 clearMessage();
		 var template = `<p class='${eleOrg}-custom-error help is-danger'>${message}</p>`;
		 ele.addClass('validate-custom error');
		 ele.after(template);
	 }
	 
	 var fnRemoveMessage = function(type){
		 clearMessage(type);
	 }
	 
	 function clearMessage(type){
		 if (type == undefined) {
			 if($('.'+eleOrg+'-custom-error').length > 0){
				 $('.'+eleOrg+'-custom-error').remove();
				 ele.removeClass('validate-custom error')
			 }
		 } else {
			 if($('.' + eleOrg + type).length > 0){
				 $('.' + eleOrg + type).remove();
				 ele.removeClass('validate-custom error')
			 }
			 
		 }
	 }
	 return {
		addError: fnAddMessage,
	 	removeError: fnRemoveMessage
	 };
 }
 
 $.fn.validator = function() {
	 return checkValidForm($(this).attr('id'));
 }
 
// $.fn.compareDate = function(other) {
//	 
// }
 
 
 /**
  * Add validate message if endDate < startDate
  * @param element
  * @param withElement
  * @returns
  */
 function validateTimeThenWithOther(startDate, endDate, message) {
	var ele = $(endDate);
	var eleOrg = ele.attr('id');
	if (message == undefined) {
		message = getValidateMessage('validate.date.startEnd');
	}
	
	function process() {
		var eleVal = ele.val();
		var weleVal = $(startDate).val();
		if (dates.compare(eleVal, weleVal) < 0) {
			ele.dataError().addError('date', message);
		} else {
			ele.dataError().removeError('date');			
		}
	}
	
	ele.change(()=>{
		process();
	});
}
 
 function processValidate(element) {
	var ele = $(element);
	var eleOrg = element.replace('#','').replace('.','');
	var _v = ele.val();
	var mes = getValidateMessage('validate.required');
	if (parseInt(_v.length) <= 0) {
		ele.dataError().addError('required', mes);
	} else {
		ele.dataError().removeError('required');
	}
}
 
$.fn.bigger = function validateDateBigger(_otherId) {
	var element = $(this);
	var other = $(_otherId);
	var elementId = element.attr('id');
	var otherId = other.attr('id');                                                                                                                                                    
	var message = getValidateMessage('validate.date.startEnd');
	var messageCode = element.attr('messageCode');
	if (messageCode == undefined || messageCode == "") {
		var message = getValidateMessage('validate.date.startEnd');
	} else {
		var message = getValidateMessage(messageCode);
	}
	
	function process(trueElement) {
		element.attr("min", other.val());
		element.dataError().removeError('invalidDate');
		
		other.dataError().removeError('invalidDate');
		
		var eleVal = element.val();
		var otherVal = other.val();
		if (dates.compare(eleVal, otherVal) < 0) {
			trueElement.dataError().addError('invalidDate', message);
		} else {
			
		}
	}
	
	element.change(function(event) {
		other.attr("max", element.val());
		process(element);
	});
	other.change(function(event) {
		element.attr("min", other.val());
		process(other);
	});
}

$.fn.biggerChangeRequest = function validateDateBiggerChangRequest(_otherId){
	var element = $(this);
	var other = $(_otherId);
	var elementId = element.attr('id');
	var otherId = other.attr('id');                                                                                                                                                    
	var message = getValidateMessage('validate.date.startEnd');
	var messageCode = element.attr('messageCode');
	if (messageCode == undefined || messageCode == "") {
		var message = getValidateMessage('validate.date.startEnd');
	} else {
		var message = getValidateMessage(messageCode);
	}
	
	function process(trueElement) {
		element.attr("min", other.val());
		element.dataError().removeError('invalidDate');
		
		other.dataError().removeError('invalidDate');
		
		var eleVal = element.val();
		var otherVal = other.val();
		var e1 = $('#apprExtReqDate').val();
		var e2 = $('#apprValdExpDate').val();
		if (dates.compare(eleVal, otherVal) < 0) {
			trueElement.dataError().addError('invalidDate', message);
		} 
		if(dates.compare(e2, e1) < 0){
			$('#apprValdExpDate').dataError().addError('invalidDate', getValidateMessage($('#apprValdExpDate').attr('messageCode')));
		}else{
			$('#apprValdExpDate').dataError().removeError('invalidDate');
		}
	}
	
	element.blur(function(event) {
		other.attr("max", element.val());
		process(element);
	});
	other.change(function(event) {
		element.attr("min", other.val());
		process(other);
	});
}

$.fn.biggerChangeRequestOrderV = function validateDateBiggerChangRequestOrderV(_otherId){
	var element = $(this);
	var other = $(_otherId);
	
	var elementId = element.attr('id');
	var otherId = other.attr('id');                                                                                                                                                    
	var message = getValidateMessage('validate.date.startEnd');
	var messageCode = element.attr('messageCode');
	if (messageCode == undefined || messageCode == "") {
		var message = getValidateMessage('validate.date.startEnd');
	} else {
		var message = getValidateMessage(messageCode);
	}
	
	function process(trueElement) {
		element.attr("min", other.val());
		element.dataError().removeError('invalidDate');
		
		other.dataError().removeError('invalidDate');
		
		var eleVal = element.val();
		var otherVal = other.val();
		var e1 = $('#orderExtReqDate').val();
		var e2 = $('#orderValdExpDate').val();
		
		if (dates.compare(eleVal, otherVal) < 0) {
			trueElement.dataError().addError('invalidDate', message);
		} 
		if(dates.compare(e2, e1) < 0){
			$('#orderValdExpDate').dataError().addError('invalidDate', getValidateMessage($('#orderValdExpDate').attr('messageCode')));
		}else{
			$('#orderValdExpDate').dataError().removeError('invalidDate');
		}
	}
	
	element.blur(function(event) {
		other.attr("max", element.val());
		process(element);
	});
	other.change(function(event) {
		element.attr("min", other.val());
		process(other);
	});
}

$.fn.lesser = function validateDateLesser(_otherId) {
	var element = $(this);
	var other = $(_otherId);
	var elementId = element.attr('id');
	var otherId = other.attr('id');
	var messageCode = element.attr('messageCode');
	if (messageCode == undefined || messageCode == "") {
		var message = getValidateMessage('validate.date.startEnd');
	} else {
		var message = getValidateMessage(messageCode);
	}
	var key = 'invalidDate';
	
	function process(trueElement) {
		if (other.val() != "") {
			element.attr("max", other.val());			
		}
		element.dataError().removeError(key);
		other.dataError().removeError(key);
		
		if (fnIsValid() === false) {
			trueElement.dataError().addError(key, message);
		} else {
			
		}
	}
	
	function fnIsValid() {
		var eleVal = element.val();
		var otherVal = other.val();
		if (parseInt(eleVal.length) <= 0 || parseInt(otherVal.length) <= 0) {
			return true;
		}
		return dates.compare(eleVal, otherVal) <= 0;
	}
	
	element.focusout(function(event) {
		other.attr("min", element.val());
		process(element);
	});
	other.focusout(function(event) {
		element.attr("max", other.val());
		process(other);
	});
	
	return {
		isValid: fnIsValid
	}
	
}

$.fn.betweenCurrent = function validateDateBetweenCurrent(_minId, _maxId) {
	var element = $(this);
	var elementId = element.attr('id');
	
	var minId = _minId;
	var min = $(minId);
	
	var maxId = _maxId;
	var max = $(maxId);
	
	var messageCode = element.attr('messageCode');
	var message = getValidateMessage(messageCode);
	
	function process(event) {
		
		if (max.val() != "") {
			element.attr("max", max.val());			
		}
		if (min.val() != "") {
			element.attr("min", min.val());			
		}
		element.dataError().removeError('invalidDate');
		
		if(fnIsLesser() || fnIsBigger()){
			element.dataError().addError('invalidDate', message);
		}
		
	}
	
	function fnIsLesser() {
		var eleVal = element.val();
		var maxVal = max.val();
		if (parseInt(eleVal.length) <= 0 || parseInt(maxVal.length) <= 0) {
			return false;
		}
		return dates.compare(eleVal, maxVal) >= 0;
	}
	
	function fnIsBigger() {
		var eleVal = element.val();
		var minVal = min.val();
		if (parseInt(eleVal.length) <= 0 || parseInt(minVal.length) <= 0) {
			return false; 
		}
		return dates.compare(eleVal, minVal) <= 0;
	}
	
	element.focusout(function(event) {
		process(event);
	});
	
	return {
		isValid: !(fnIsLesser || fnIsBigger)
	}
}

$.fn.between = function validateDateBetween(_minId, _maxId) {
	var element = $(this);
	var elementId = element.attr('id');
	
	var minId = _minId;
	var min = $(minId);
	
	var maxId = _maxId;
	var max = $(maxId);
	
	/*var messageCodeLesser = element.attr('messageCodeLesser');
	var messageLesser = getValidateMessage(messageCodeLesser);
	
	var messageCodeBigger = element.attr('messageCodeBigger');
	var messageBigger = getValidateMessage(messageCodeBigger);*/
	
	var messageCode = element.attr('messageCode');
	var message = getValidateMessage(messageCode);
	
	function process(event) {
		if(!element.val()){ 
			element.removeAttr("max", max.val());
			element.removeAttr("min", min.val());		 	
			element.dataError().removeError('invalidDate');
		}else{
			if (max.val() != "") {
				element.attr("max", max.val());
			}
			if (min.val() != "") {
				element.attr("min", min.val());			
			}
			element.dataError().removeError('invalidDate');
			 
			if(fnIsLesser() || fnIsBigger()){
				element.dataError().addError('invalidDate', message);
			} 
		}
//		if (element.val() === undefined || element.val() === null || element.val() === '') {
//			return;
//		}
	}
	
	function fnIsLesser() {
		var eleVal = element.val();
		var maxVal = max.val();
		if (parseInt(eleVal.length) <= 0 || parseInt(maxVal.length) <= 0) {
			return false;
		}
		return dates.compare(eleVal, maxVal) > 0;
	}
	
	function fnIsBigger() {
		var eleVal = element.val();
		var minVal = min.val();
		if (parseInt(eleVal.length) <= 0 || parseInt(minVal.length) <= 0) {
			return false;
		}
		return dates.compare(eleVal, minVal) < 0;
	}
	
	element.focusout(function(event) {
		process(event);
	});
	
//	element.change( function(event) {
//		if (element.val() === undefined || element.val() === null || element.val() === '') {
//			element.removeAttr("max");
//			element.removeAttr("min");
//		}
//	});
	
	return {
		isValid: !(fnIsLesser || fnIsBigger)
	}
}

$.fn.validEmail = function validEmail() {
	var element = $(this);
	var elementId = element.attr('id');
	var message = getValidateMessage('validate.invaledFormat');
	var key = 'invalidEmail';
	
	function process() {
		if (fnIsValid() === false) {
			element.dataError().addError(key, message);
		} else {
			element.dataError().removeError(key);
		}		
	}
	
	function fnIsValid() {
		return validateEmail(element.val());
	}
	
	element.focusout(function() {
		process();
	});
	
	return {
		isValid: fnIsValid
	}
}

$.fn.validateEqual = function validateEqualDate(_otherId){

	var element = $(this);
	var other = $(_otherId);
	var messageCode = element.attr('messageCode');
	var message = getValidateMessage(messageCode);
	function process() {
		element.dataError().removeError('oldDate');
		
		if(fnIsDateEqual()){
			element.dataError().addError('oldDate', message);
		}
	}
    function fnIsDateEqual() {
		var eleVal = element.val();
		var otherVal = getDate(other.val());
		if (parseInt(eleVal.length) <= 0 || parseInt(otherVal.length) <= 0) {
			return false;
		}
		return dates.compare(eleVal, otherVal) == 0;
    }
    element.focusout(function() {
		process();
	});
    return{
    	isEqual:fnIsDateEqual
    }
}

$.fn.formatUen = function formatUen(){
	var element = $(this);
	var elementId = element.attr('id');
	var message = getValidateMessage('validate.invaledFormat');
	var key = 'invalidUen';
	
	function process() {
		if (fnIsValid() === false) {
			element.dataError().addError(key, message);
		} else {
			element.dataError().removeError(key);
		}		
	}
	
	function fnIsValid() {
		var uen = $('#'+elementId).val();
        uen = uen.trim(); 
        var arr = uen.split(';');
        arr = arr.map(item => item.trim()); 
        arr1 = new Set(arr);
        arr1 = Array.from(arr1);
        var isValid = true;
        if(arr1.length == arr.length){
        	var valid = arr1.map(item =>{
            	//return $.isNumeric(item) ? isValid = true : isValid = false;
        		return isValid;
            });
            return valid.indexOf(false) < 0 ? true : false;
        }else{
        	return false;
        } 
        	
	}
	
	element.focusout(function() {
		process();
	});
	
	return {
		isValid: fnIsValid
	}

}


function validateEmail($email) {
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return emailReg.test( $email );
}

function hasWhiteSpace(string) {
	return string.indexOf(' ') >= 0; 
}

$.fn.dataError = function() {
	var ele = $(this);
	var eleOrg = ele.attr('id');
	
	function init() {
		var value = ele.data('error');
		if (value == undefined) {
			ele.data('error', {});
		}
	}
	
	function clear() {
		var data = ele.data('error');
		for (var key in data) {
			removeMessage(key);
		}
		ele.removeData('error');
		ele.removeClass('is-danger');
	}
	
	function hasError() {
		var data = ele.data('error');
		for (var key in data) {
		    if (data.hasOwnProperty(key)) {
		    	var value = data[key];
		    	if (value == true) {
		    		return true;
		    	}
		    }
		}
		return false;
	}
	
	function checkError(key) {
		var data = ele.data('error');
		if (data.hasOwnProperty(key)) {
			var value = data[key];
			if (value == true) {
				return true;
			}
		}
		return false;
	}
	
	function _addError(key, value, message) {
		init();
		var errors = ele.data('error');
		errors[key] = value;
		ele.data('error', errors);
		if (value == true) {
			addMessage(key, message);
		} else {
			removeMessage(key)
		}
		processError();
	}
	
	function addError(key, message) {
		_addError(key, true, message);
	}
	
	function removeError(key) {
		_addError(key, false);
	}
	
	function processError() {
		if (hasError()) {
			ele.addClass('is-danger');
		} else {
			ele.removeClass('is-danger');
		}
	}
	
	function addMessage(key, message) {
		if (message != undefined) {
			if (hasMessage(key) == false) {
				var template = $('<p class="help is-danger">');
				template.attr("id", eleOrg+'-'+key);
				template.text(message);
				if (ele.is("select")) {
					ele.parent().after(template);
					ele.closest('.is-grouped').removeClass('is-grouped');
				} else {
					ele.after(template);
				}
			}
		}
	}
	
	function removeMessage(key) {
		var mess = $('#' +  eleOrg+'-'+key);
		mess.remove();
	}
	
	function hasMessage(key) {
		var mess = $('#' +  eleOrg+'-'+key);
		if (mess.length > 0) {
			return true;
		}
		return false;
	}
	
	return {
		init: init,
		clear: clear,
		addError: addError,
		hasError: hasError,
		removeError: removeError,
		checkError: checkError
	}
}

$.fn.dasForm = function() {
	var ele = $(this);
	var eleOrg = ele.attr('id');
	
	function validate() {
		return checkValidForm(eleOrg);
	} 
	  
	function clearError() { 
		var lstInput = $(`form#${eleOrg} :input`); 
		for (inp of lstInput) {
			$(inp).dataError().clear();
		}
		  
		var lstSelectMess = $('form#' + eleOrg + ' .selectTagErr');
		for (inp of lstSelectMess) {
			$(inp).remove();
		}
	}
	
	return {
		isValid: validate,
		clearError: clearError
	}
}

$.fn.dasDataSegment = function() {
	var ele = $(this);
	var eleOrg = ele.attr('id');
	
	function validate() {
		return checkValidSegment(eleOrg);
	}
	
	function clearError() {
		var lstInput = $(`#${eleOrg} :input`);
		for (ele of lstInput) {
			$(ele).dataError().clear();
		}
		
		var lstSelect = $('#' + eleOrg + ' .selectTagErr');
		for (ele of lstSelect) {
			$(ele).remove();
		}
	}
	
	return {
		isValid: validate,
		clearError: clearError
	}
}

function checkValidForm(formId){
	if (formId == null || formId == undefined || formId == "") {
		return true;
	}
	var formOrg = formId.replace('#','').replace('.','');
	var dateEles = $(`form#${formOrg} .validate-date-lesser`);
	$.each(dateEles, function(index, element) {
		let id = $(element).attr('id');
		$(`form#${formOrg} #${id}`).trigger("change");
	});
	
	var elements = $(`form#${formOrg} .require-positive-number`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`form#${formOrg} #${id}`).trigger("keyup");
	});
	
	var elements = $(`form#${formOrg} .require-integer`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`form#${formOrg} #${id}`).trigger("keyup");
	});
	
	var elements = $(`form#${formOrg} .require-phone-number`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`form#${formOrg} #${id}`).trigger("blur");
	});
	
	var elements = $(`form#${formOrg} :input[type=email]`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`form#${formOrg} #${id}`).trigger("focusout");
	});
	
	var elements = $(`#${formOrg} :input[type=date]`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`#${formOrg} #${id}`).trigger("focusout");
	});
	
	var elements = $(`form#${formOrg} .format-nric`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`form#${formOrg} #${id}`).trigger("blur");
	});
	
	var textareas = $(`form#${formOrg} textarea`);
	$.each(textareas, function(index, element) {
		let id = $(element).attr('id');
		$(`form#${formOrg} #${id}`).keyup();
	});
	
	var elements = $(`form#${formOrg} .select-have-value`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`#${formOrg} #${id}`).trigger("focusout");
	});
	
	var elements = $(`form#${formOrg} .format-uen`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`#${formOrg} #${id}`).trigger("focusout");
	});
	
	var dateElesBetween = $(`form#${formOrg} .validate-date-between`);
	$.each(dateEles, function(index, element) {
		let id = $(element).attr('id');
		$(`form#${formOrg} #${id}`).trigger("change");
	});
	
	var elements = $(`form#${formOrg} .require-field`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`form#${formOrg} #${id}`).trigger("focusout");
	});
	
	var lstInput = $(`form#${formOrg} :input`);
	for (ele of lstInput) {
		var err = $(ele).dataError().hasError();
		if (err == true) {
			ele.focus();
			return false;
		}
	}
	return true;
}

function checkValidSegment(formId){
	if (formId == null || formId == undefined || formId == "") {
		return true;
	}
	var formOrg = formId.replace('#','').replace('.','');
	var dateEles = $(`#${formOrg} .validate-date-lesser`);
	$.each(dateEles, function(index, element) {
		let id = $(element).attr('id');
		$(`#${formOrg} #${id}`).trigger("change");
	});
	
	var elements = $(`#${formOrg} .require-field`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`#${formOrg} #${id}`).trigger("focusout");
	});
	
	var elements = $(`#${formOrg} .require-positive-number`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`#${formOrg} #${id}`).trigger("keyup");
	});
	
	var elements = $(`#${formOrg} .require-integer`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`#${formOrg} #${id}`).trigger("keyup");
	});
	
	var elements = $(`form#${formOrg} .format-uen`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`#${formOrg} #${id}`).trigger("focusout");
	});
	
	var elements = $(`#${formOrg} .require-phone-number`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`#${formOrg} #${id}`).trigger("blur");
	});
	
	var elements = $(`#${formOrg} :input[type=email]`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`#${formOrg} #${id}`).trigger("focusout");
	});
	
	var elements = $(`#${formOrg} :input[type=date]`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`#${formOrg} #${id}`).trigger("focusout");
	});
	
	var elements = $(`#${formOrg} .format-nric`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`#${formOrg} #${id}`).trigger("blur");
	});
	
	var textareas = $(`#${formOrg} textarea`);
	$.each(textareas, function(index, element) {
		let id = $(element).attr('id');
		$(`form#${formOrg} #${id}`).keyup();
	});
	
	var elements = $(`#${formOrg} .select-have-value`);
	$.each(elements, function(index, element) {
		let id = $(element).attr('id');
		$(`#${formOrg} #${id}`).trigger("focusout");
	});
	
	var lstInput = $(`#${formOrg} :input`);
	for (ele of lstInput) {
		var err = $(ele).dataError().hasError();
		if (err == true) {
			ele.focus();
			return false;
		}
	}
	return true;
}

var PROMPT_MESSAGE  = "prompt";
function addErrors(errors) {
	var ms = "";
	errors.forEach(function(element) {
		if (PROMPT_MESSAGE != element.errorKey) {
			$("#"+element.fieldId).dataError().addError(element.errorKey, getValidateMessage(element.errorMessage));			
		}
	});
}

