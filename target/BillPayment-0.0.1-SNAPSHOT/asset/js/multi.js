function showSelectBox(element){
		var selectBox = $(element).find('.multi-select-option');
    	selectBox.show();
   		selectBox.focus();
    	$(selectBox).blur(function(e) {
			$(selectBox).css("display","none");
		});
   	}
	//Multi-select Dropdown
	$('option.option-multi').mousedown(function(e) {
		var optionAll = $(this).parent().find('option.option-all');
		$(this).prop('selected', $(this).prop('selected') ? false : true );
		e.preventDefault();
		var selected = $(this).parent().find('option.option-multi:selected');
		textDiv = $(this).parent().parent().find('.multi-select-text');
		if(selected.length == 0){
			optionAll.prop('selected',true );
			textDiv.text(optionAll.text());
			textDiv.append('<span class = "sgds-icon sgds-icon-chevron-down">');
		}
		else{
			var textDisplay="";
			for (i = 0; i < selected.length-1; i++) {
				textDisplay = textDisplay +  selected[i].text + ", ";
			}
			textDisplay = textDisplay +  selected[selected.length-1].text;
			optionAll.prop('selected',false );
			textDiv.text(textDisplay);
			textDiv.append('<span class = "sgds-icon sgds-icon-chevron-down">');
		}
		});
	$('option.option-all').mousedown(function(e) {
		$(this).prop('selected', true );
		e.preventDefault();
		textDiv = $(this).parent().parent().find('.multi-select-text');
		$(this).parent().find('option.option-multi');
		if($(this).prop('selected')){
			textDiv.text($(this).text());
			textDiv.append('<span class = "sgds-icon sgds-icon-chevron-down">');
			$(this).parent().find('option.option-multi').prop('selected',false);
		}
		});
	//Multi-select Dropdown