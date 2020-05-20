
/**
 * config: {message: _meessage, timeout: _timeout}
 */
$.fn.sgdsNotification = function(config){
	var timeout= -1;
	var mess = '';
	
	if(config && config.message){
		mess = message;
	}
	if(config && config.timeout){
		timeout = config._timeout
	}
	let template = 
		$(`<div class="row">
            <div class="col">
                <div class="sgds-notification row " id="notificationClose" style="display: none;z-index: 2000">
                    <div class="col is-12 padding--right--lg">
                    	<div id="notifyMessage">
                    	</div>
                    </div>
                    <div class="col das-close">
                        <div class="icon-container has-text-right">
                            <span class="sgds-icon sgds-icon-cross"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);
	$(document).ready(function(){	
		var elementPosition = $('#notificationClose').offset();
	
		$(window).scroll(function(){
		        if($(window).scrollTop() > elementPosition.top){
		              $('#notificationClose').css('position','fixed').css('top','50px');
		        } else {
		            $('#notificationClose').css('position','fixed');
		        }    
		});
	});
		
	$(this).append($(template));
	
	$('.das-close > .icon-container').click(function(){
		fnClose();
	});
	
	var fnClose  = function(){
		$('#notificationClose').hide();
	}
	
	var fnOpen = function(_mess, _timeout, _class){
		$('#notifyMessage').empty();
		mess = _mess;
		timeout = _timeout;
		
		if(_class != undefined){
			$('#notificationClose').removeClass();
			$('#notificationClose').addClass('sgds-notification row');
			$('#notificationClose').addClass(_class);
			$('#notificationClose').css("z-index: 99999 !important;");
		}
		
		if(mess != undefined){
			if (Array.isArray(mess)) {
				$.each(mess, function(index, value) {
					var h5 = $('<h5>').append(value);
					$('#notifyMessage').append(h5);					
				});
			} else {
				var h5 = $('<h5>').append(mess);
				$('#notifyMessage').append(h5);
			}
		} 
		$('#notificationClose').show();
		if(timeout > 0){
			//dcao25 set timeout 10s
			setTimeout(function(){ fnClose() }, 10000); 
		}
	}
	
	fnSuccess = function(_mess, _timeout){
		fnOpen(_mess,_timeout,'is-success');
	}
	fnWarning = function(_mess, _timeout){
		fnOpen(_mess,_timeout,'is-warning');
	}
	fnDanger = function(_mess, _timeout){
		fnOpen(_mess,_timeout,'is-danger');
	}
	fnInfo = function(_mess, _timeout){
		fnOpen(_mess,_timeout,'is-info');
	}
	fnSecondary = function(_mess, _timeout){
		fnOpen(_mess,_timeout,'is-secondary');
	}
	fnPrimary = function(_mess, _timeout){
		fnOpen(_mess,_timeout,'is-primary');
	}
	fnDark = function(_mess, _timeout){
		fnOpen(_mess,_timeout,'is-dark');
	}
	fnLight = function(_mess, _timeout){
		fnOpen(_mess,_timeout,'is-light');
	}
	fnBlack = function(_mess, _timeout){
		fnOpen(_mess,_timeout,'is-black');
	}
	fnWhite = function(_mess, _timeout){
		fnOpen(_mess,_timeout,'is-white');
	}
	fnLink = function(_mess, _timeout){
		fnOpen(_mess,_timeout,'is-link');
	}
	fnUnknown = function() {
		fnOpen(getValidateMessage('error.unknown'),3000,'is-warning');
	}
	return {
		close: fnClose,
		open: fnOpen,
		success: fnSuccess,
		warning: fnWarning,
		danger: fnDanger,
		info: fnInfo,
		secondary: fnSecondary,
		primary: fnPrimary,
		dark: fnDark,
		light: fnLight,
		black: fnBlack,
		white: fnWhite,
		link: fnLink,
		unknown: fnUnknown,
	};
}
