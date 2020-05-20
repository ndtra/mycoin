var validateMessage = {};
var homesMessage = {};
var dasMessage = {};

function getValidateMessage(code) {
	if ($.isEmptyObject(validateMessage)) {
		validateMessage = JSON.parse(localStorage.getItem('validateMessage'));
	}
	if (code == undefined) {
		return validateMessage;
	}
	return validateMessage[code];
}
function getHomesErrMessage(code) {
	if ($.isEmptyObject(homesMessage)) {
		homesMessage = JSON.parse(localStorage.getItem('homesMessage'));
	}
	if (code == undefined) {
		return homesMessage;
	}
	return homesMessage[code];
}
function getDasMessage(code) {
	if ($.isEmptyObject(dasMessage)) {
		dasMessage = JSON.parse(localStorage.getItem('dasMessage'));
	}
	if (code == undefined) {
		return dasMessage;
	}
	return dasMessage[code];
}

var message = {
	validate: function(code) {
		return  getValidateMessage(code);
	},
	home: function(code) {
		return getHomesErrMessage(code);
	},
	das: function(code) {
		return getDasMessage(code);
	}
}

/**
 * 
 * @param _val
 * @param defaltVal
 * @returns INT
 */
//function parseInt(_val, defaltVal){
//	if(typeof _val === 'undefined'){
//		if(typeof defaltVal === 'undefined'){
//			return 0
//		}else{
//			return defaltVal
//		}
//	}else{
//		return _val
//	}
//}

/**
 *
 * @param divId
 * @returns TRUE|FALSE
 */
function checkValidDiv(divId){
    var divOrg = divId.replace('#','').replace('.','');
    var elements = $(`div#${divOrg} .require-field`);
    $.each(elements, function(index, element) {
        $(element).trigger("focusout")
    });

    var countError = $(`div#${divOrg} :input[class~=error]`).length;
    if(countError > 0){
        return false;
    }else{
        return true;
    }
}

/**
 * 
 * @param formId
 * @param action
 * @param cb
 * @param cbError
 * @returns
 * @desc when recieve data json, incudle  datatype="json" in form 
 * EX: <form id="syscommoncode" datatype="json"></form>
 */
function submitForm(formId, action, cb, cbError, customValidate){
	var formOrg = formId.replace('#','').replace('.','');
	if(checkValidForm(formId)){
		if (customValidate != 'undefined' && customValidate != undefined && customValidate != null) {
			if (customValidate() == false) {
				return;
			}
		}
		// form valid, continuous process
		var eleForm = $(formId);
		var dataForm = eleForm.serializeObject();
		eleForm.find("input[type=checkbox]").each(function() {
			if ($(this).is(':checked')) {
				dataForm[this.name] = this.defaultValue; 
			} else {
				dataForm[this.name] = ''; 
			}
		});
		var _opt = {
                url: action,
                contentType : "application/json",
                type: 'POST',
                data: JSON.stringify(dataForm),
                success: cb,
                error: cbError
            }
		var _datatype = eleForm.attr('datatype');
		if(typeof _datatype != undefined){
			_opt['dataType'] = _datatype
		}
		$.ajax(_opt);
	}else{
		// form invalid, continuous process => need handle valid
//		cbError({error:'invalid form', message:'invalid form'});
		return;
	}
}

function submitData(dataForm, formId, action, cb, cbError, customValidate){
	var formOrg = formId.replace('#','').replace('.','');
	if (checkValidForm(formId)) {
		if (customValidate != 'undefined' && customValidate != undefined && customValidate != null) {
			if (customValidate() == false) {
				return;
			}
		}
		var eleForm = $(formId);
		var _opt = {
				url: action,
				contentType : "application/json",
				type: 'POST',
				data: JSON.stringify(dataForm),
				success: cb,
				error: cbError
		}
		var _datatype = eleForm.attr('datatype');
		if (typeof _datatype != undefined) {
			_opt['dataType'] = _datatype
		}
		$.ajax(_opt);
	}
}

/**
 * 
 * @returns
 */
function handleCancelDialog(idDlg, callback){
	$(idDlg).on('hidden.bs.modal', function (e) {
		callback();
	});
}

function renderStatus(item){
	if(item.status == true || item.status == 'A'){
		return 'Yes';
	}else{
		return 'No';
	}
}

function renderStatusIcon(item) {
	if(item.status == true || item.status == 'A'){
		return '<span class="sgds-icon sgds-icon-check is-size-4"></span>';
	}else{
		return '<span class="sgds-icon sgds-icon-cross is-size-4"></span>';
	}
}

/**
 * 
 * @returns
 */
function handleCancelResetDialog(idDlg, idForm, callback){
	$(idDlg).on('hidden.bs.modal', function (e) {
		$(idForm).dasForm().clearError();
		$('form'+idForm)[0].reset();
		//$('form'+idForm+' input[type=hidden]').val('');
		if(callback)
			callback();
	});
}
function resetDialogIgnoreHidden(idDlg, idForm, callback){
	$(idDlg).on('hidden.bs.modal', function (e) {
		$(idForm).dasForm().clearError();
		$('form'+idForm)[0].reset();
		//$('form'+idForm+' input[type=hidden]').val('');
		if(callback)
			callback();
	});
}

function handleOpenDialog(idDlg, cb){
	$(idDlg).on('show.bs.modal', cb);
}

$.fn.serializeObject = function() {
   var o = {};
   var inputs = this.find(':disabled');
   inputs.prop('disabled', false);
   var a = this.serializeArray();
   inputs.prop('disabled', true);
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           if ($(this).is("input[type='checkbox']")) {
        	   o[this.name].push(this.value || '');
           } else {
        	   o[this.name].push(this.value || '');
           }
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};

$.fn.toJson = function() {

    var self = this,
        json = {},
        push_counters = {},
        patterns = {
            "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
            "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
            "push":     /^$/,
            "fixed":    /^\d+$/,
            "named":    /^[a-zA-Z0-9_]+$/
        };

    this.build = function(base, key, value){
        base[key] = value;
        return base;
    };

    this.push_counter = function(key){
        if(push_counters[key] === undefined){
            push_counters[key] = 0;
        }
        return push_counters[key]++;
    };

    $.each($(this).serializeArray(), function(){

        // skip invalid keys
        if(!patterns.validate.test(this.name)){
            return;
        }

        var k,
            keys = this.name.match(patterns.key),
            merge = this.value,
            reverse_key = this.name;

        while((k = keys.pop()) !== undefined){

            // adjust reverse_key
            reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

            // push
            if(k.match(patterns.push)){
                merge = self.build([], self.push_counter(reverse_key), merge);
            }

            // fixed
            else if(k.match(patterns.fixed)){
                merge = self.build([], k, merge);
            }

            // named
            else if(k.match(patterns.named)){
                merge = self.build({}, k, merge);
            }
        }

        json = $.extend(true, json, merge);
    });

    return json;
};

/**
 * input only enter integer
 */
$.fn.OnlyFloat = function() {
	$(this).on("keypress keyup blur",function (event) {
		$(this).val($(this).val().replace(/[^0-9\.]/g,''));
		if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
			event.preventDefault();
		}
	});
};


/**
 * input just enter float
 */
$.fn.OnlyInteger = function(){
	$(this).on("keypress keyup blur",function (event) {  
	    $(this).val($(this).val().replace(/[^\d].+/, ""));
	    if ((event.which < 48 || event.which > 57)) {
	        event.preventDefault();
	    }
	});
}

function makeArray(nodeList) {
    var arr = [];
    for (var i = 0; i < nodeList.length; i++) {
        arr.push(nodeList[i]);
    }
    return arr;
}

function add_Selecbox(selectFrom, selectTo, callback) {
	var options = $('select#' + selectFrom + ' option:selected').sort().clone();
    $('select#' + selectTo).append(options);
    $('select#' + selectFrom + ' option:selected').remove();
    if (callback != 'reset') {
    	$('select#'+selectFrom).trigger('focusout');
    	$('select#'+selectTo).trigger('focusout');
    	if (callback != undefined && typeof callback == 'function' ) {
    		callback();
    	}    	
    }
    sortSelectBox(selectFrom);
    sortSelectBox(selectTo);
}

function sortSelectBox(id){
	var options = $('#'+id+' option');
	var arr = options.map(function(_, o) { return { t: $(o).text(), v: o.value }; }).get();
	arr.sort(function(o1, o2) {
	  var t1 = o1.t.toLowerCase(), t2 = o2.t.toLowerCase();

	  return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
	});
	options.each(function(i, o) {
	  o.value = arr[i].v;
	  $(o).text(arr[i].t);
	});
}

function formatDate(value) {
	if (value == null || value == undefined || value == "" ) {
		return "-";
	}
	var d = new Date(value);
	let formatted_date = pad(d.getDate(), 2) + "/" + pad((d.getMonth() + 1), 2) + "/" + d.getFullYear(); 
	return formatted_date;
}

function getDate(value) {
	if (value == null) {
		return "";
	}
	var d = new Date(value);
	let formatted_date = d.getFullYear() + "-" +  pad((d.getMonth() + 1), 2) + "-" + pad(d.getDate(), 2);
	return formatted_date;
}

function compareDate(date1, date2) {
	 if (parseInt(date1.length) <= 0 || parseInt(date2.length) <= 0) {
		 return 1;
	 }
	 return new Date(date1) - new Date(date2);
}

function pad(str, max) {
	str = str.toString();
	return str.length < max ? pad("0" + str, max) : str;
}

function appendInfoIcon() {
    var elements = $('.tooltip-icon-info');
    $.each(elements, function(index, element) {
        var flag = $(element).attr('tooltip-appended');
        if (flag == undefined || flag == false || typeof flag == "undefined") {
            var dataTooltip = $(element).attr('data-tooltip');
            var tooltip = $('<a class="sgds-card-header-icon sgds-tooltip icon-info">');
            tooltip.attr('data-tooltip', dataTooltip);
            tooltip.html('<i class="sgds-icon sgds-icon-circle-info"></i>');
           
            $(element).wrap('<div class="field is-grouped mb-0">');
            $(element).after(tooltip);
            $(element).attr('tooltip-appended', true);
        }
    });
}
//function appendInfoIcon() {
//	var elements = $('.tooltip-icon-info');
//	$.each(elements, function(index, element) {
//		var flag = $(element).attr('tooltip-appended');
//		if (flag == undefined || flag == false || typeof flag == "undefined") {
//			var dataTooltip = $(element).attr('data-tooltip');
//			var tooltip = $('<span class="sgds-tag is-rounded sgds-tooltip has-background-tooltip icon-info ml-1">');
//			tooltip.attr('data-tooltip', dataTooltip);
//			tooltip.html('<span class="sgds-icon sgds-icon-info is-size-5"></span>');
//			
//			$(element).wrap('<div class="field is-grouped mb-0">');
//			$(element).after(tooltip);
//			$(element).attr('tooltip-appended', true);
//		}
//	});
//}

function appendCalendarIcon() {
	var elements = $('input[type=date].has-icon');
	$.each(elements, function(index, element){
		var icon = '<div class="control" style="top : 12px;left: -10px"><a id="datepicker-trigger" class="sgds-button"> <i class="sgds-icon sgds-icon-calendar"></i></a></div>';
		$(element).parent().after(icon);
	});
}

function formatNumber(n) {
  // format number 1000000 to 1,234,567
//	return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return n.replace(/[,.]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function formatCurrencyView(value) {
	
	 if (value === "") { return ""; }
	 
	 var originalLength = value.length;
	 
	 if (value.indexOf(".") >= 0) {

		    var decimalPos = value.indexOf(".");

		    // split number by decimal point
		    var left = value.substring(0, decimalPos);
		    var right = value.substring(decimalPos);

		    // add commas to left side of number
		    left = formatNumber(left);

		    // validate right side
		    right = formatNumber(right);
		    
		    // Limit decimal to only 2 digits
		    right = right.substring(0, 2);

		    // join number by .
		    value = left + "." + right ;

		  } else {
		    value = formatNumber(value);
		    value = value;
		    
		  }
	 
	 	return value;
		  
		  // put caret back in the right position
		  //var updated_len = value.length;
		//  caret_pos = updated_len - originalLength + caret_pos;
		  //input[0].setSelectionRange(caret_pos, caret_pos);
	 
}

function formatCurrency(input, blur) {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.
  
  // get input value
  var input_val = input.val();
  
  // don't validate empty input
  if (input_val === "") { return; }
  
  // original length
  var original_len = input_val.length;

  // initial caret position 
  var caret_pos = input.prop("selectionStart");
    
  // check for decimal
  if (input_val.indexOf(".") >= 0) {

    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // validate right side
    right_side = formatNumber(right_side);
    
    // On blur make sure 2 numbers after decimal
    if (blur === "blur") {
      right_side += "";
    }
    
    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    input_val = left_side + "." + right_side;

  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);
    input_val = input_val;
    
    // final formatting
//    if (blur === "blur") {
//      input_val += ".00";
//    }
  }
  
  // send updated string to input
  input.val(input_val);

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}

function checkIfContainDifferent(list, value){
	let check = 0
	if(list.length==0){
		return false
	}
	$.each( list, function( key, s ) {
		  if(s!=value){
			  check++;
		  };
	});
	if(check>0){
		return false
	}else{
		return true
	}
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

$(document).ready(function(){
	var buttonFixTop = $('.button-fixed-top');
	buttonFixTop.addClass("mb-2");
	if ($('.button-fixed-top').length) {
		positionButton = $('.button-fixed-top').offset().top;
		$(window).scroll(function () {
			if($('.button-fixed-top').length > 1 && $('.button-fixed-top').eq(0).has("button").length > 0){
				if ($(this).scrollTop() > positionButton) {
					buttonFixTop.addClass("sticky");
					if($('.button-fixed-top:eq(0) button').length > 1){
						//$('.button-fixed-top').eq(1).css("margin-left", "1rem");  
						$('.button-fixed-top').eq(1).css("margin-top", "60px");  
					}else{
						//$('.button-fixed-top').eq(1).css("margin-left", "1rem");  
						//$('.button-fixed-top').eq(1).css("margin-top", "60px"); 
					}
					
				}else { 
					buttonFixTop.removeClass("sticky"); 
					$('.button-fixed-top').eq(1).css("margin-left", "0rem"); 
					$('.button-fixed-top').eq(1).css("margin-top", "0px");
				}
			}else{
				$('.button-fixed-top').eq(0).removeClass('modal-header');
				if ($(this).scrollTop() > positionButton) {
					buttonFixTop.addClass("sticky"); 
				}else {
					//$('.button-fixed-top').eq(0).addClass('modal-header');
					buttonFixTop.removeClass("sticky");
				}
			}
		});
	}
	appendInfoIcon();
//	appendCalendarIcon();
	
	$("input[data-type='currency']").on({
	    keyup: function() {
	    	formatCurrency($(this));
	    },
	    blur: function() { 
	    	formatCurrency($(this), "blur");
	    },
	    change: function() {
	    	formatCurrency($(this));
	    }
	});
	
	/* fix for tooltip */
	$(".sgds-tooltip").hover(function(){
		$(this).pseudoCss(":before" , "width", 
				$(this).textWidth($(this).attr("data-tooltip"), $(this).css("font-family"), "1.25rem", "1rem") + "px");
	});
});

$.fn.textWidth = function(text, fontFamily, fontSize, padding){
	var org = $(this)
	var html = $('<span style="postion:absolute;width:auto;left:-9999px">' + (text || org.html()) + '</span>');
	html.css("font-family", fontFamily);
	html.css("font-size", fontSize);
	html.css("padding", padding);
	$('body').append(html);
	var width = html.outerWidth();
	html.remove();
	return width;
}

$.fn.dasHide = function dasHide() {
	var ele = $(this);
	ele.addClass('hide');
}

$.fn.dasShow = function dasShow() {
	var ele = $(this);
	ele.removeClass('hide');
}

function generateActionBar(url, container, appStatus,agencyId, callback) {
	var jsonData = {'appStatus':appStatus,'appAgencyId':agencyId};
	$.post(url, jsonData, function(){}).done(function(data) {
		var json = JSON.parse(data);
		if(json.length>0){
			renderActionBar(container, json);
			if (typeof callback === 'function'){
				callback();
		    }
		}
	});
	
}

function renderActionBar(container, data) {
	var actionBar = $(container);
	
	var fixedTop = $('<div class="col button-fixed-top">');
	for(i=0; i< data.length; i++) {
		var btnData = JSON.parse(data[i].button);
		var btn = $('<button type="button" class="sgds-button is-link is-rounded ml-1 mt-2">');
		btn.attr('id', btnData.id); 
		btn.attr('onclick', btnData.function);
		if (btnData.icon != null) {
			var span = $('<span class="das-icons icon">');
			var icon = $('<i>');
			icon.addClass(btnData.icon);
			span.append(icon);
			btn.append(span);
		}
		if (btnData.dataToggle != null) {
			btn.attr('data-toggle', btnData.dataToggle);			
		}
		if (btnData.dataTarget != null) {
			btn.attr('data-target', btnData.dataTarget);			
		}
		btn.append(btnData.name);
		
		fixedTop.append(btn);
	}
	actionBar.append(fixedTop);
	var buttonFixTop = $('.button-fixed-top');
	buttonFixTop.addClass("mb-2");
	if ($('.button-fixed-top').length) {
		positionButton = $('.button-fixed-top').offset().top;
		$(window).scroll(function () {
			if ($(this).scrollTop() > positionButton) {
				buttonFixTop.addClass("sticky");
			}else {
				buttonFixTop.removeClass("sticky");
			}
		});
	}
}

//Source: http://stackoverflow.com/questions/497790
var dates = {
    convert:function(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year,d.month,d.date) :
            NaN
        );
    },
    compare:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a=this.convert(a).valueOf()) &&
            isFinite(b=this.convert(b).valueOf()) ?
            (a>b)-(a<b) :
            NaN
        );
    },
    inRange:function(d,start,end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
       return (
            isFinite(d=this.convert(d).valueOf()) &&
            isFinite(start=this.convert(start).valueOf()) &&
            isFinite(end=this.convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
        );
    }
}
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

//Merged main.js
function closeNotification() {
    document.getElementById("notificationClose").style.display = "none";
}
String.prototype.insert = function (index, string) {
    if (index > 0)
      return this.substring(0, index) + string + this.substring(index, this.length);
    
    return string + this;
};

function getAge(dateString) {
	  var today = new Date();
	  var birthDate = new Date(dateString);
	  var age = today.getFullYear() - birthDate.getFullYear();
	  var m = today.getMonth() - birthDate.getMonth();
	  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
	    age--;
	  }
	  return age>0?age:0;
	}

function getDateLocale(date){
	
//	var element = document.createElement('input');
//	element.type = 'date';
//	element.setAttribute("value", getDate(new Date()));
////	
////	$('body').append(element);  
//	console.log($(element));
	
	if(date != "" && date != null && date != undefined){
		var localDate = new Date(date).toLocaleDateString().split("/");
		
		localDate = localDate.map(function (item){ 
			if(item.length == 1){ 
				return "0" + item ;
			}
			return item;
		});
		
		return localDate.join("/");
	}else{
		return "-"; 
	}
}

function maskedNric(nric){
	  if(nric != ""){
		  return nric.replace(nric.slice(0,5), "xxxxx");
	  }
	  return "";
}

