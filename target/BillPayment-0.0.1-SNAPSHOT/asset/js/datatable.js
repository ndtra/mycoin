$.fn.sgdsTable = function(config){
	var tbl = this[0];
	var columnDefs = config.columnDefs;
	var _ajax = config.ajax;
	if(tbl.localName != 'table') return;
	var tableId = "#"+tbl.id;
	var element = $("table"+tableId);
	var $table = element;
	var elementTBody;
	var totalRecords = maxNavigationPage = maxResult = totalPages = maxResult = sizeResult = 0
	var currentPage = 1;
	var leftFoot = rightFoot = locklFootLeft = locklFootRight = '';
	var navigationPages;
	var templatePagging;
	var dataList = [];
	var params;
	var orderByCol = "";
	var orderType = "";
	var currentRecord = 1;
	
	var arrHeaders = document.querySelectorAll("table#"+tbl.id+" thead th");
	
	var isRender = false;
	
	var onNext = function(){
		currentPage++;
		_resetTable();
		_table();
		renderHeaderTable();
	}
	
	var onPrevious = function(){
		currentPage--;
		_resetTable();
		_table();
		renderHeaderTable();
	}
	
	var goto = function(){
		var page = $(this).text(); 
		if (page == '...') {
			return;
		}
		currentPage = page;
		_resetTable();
		_table();
		renderHeaderTable();
	}
	
	var _resetTable = function(){
		$("#tblNext").unbind( "click" );
		$("#tblPrevious").unbind( "click" );
		$("span[id^=tblPage").unbind( "click" );
		totalRecords = maxNavigationPage = maxResult = totalPages = 0;
		leftFoot = rightFoot = locklFootLeft = locklFootRight = '';
		dataList = [];
	}
	
	var _clean = function() {
		$table.children('tbody').empty();
		_resetTable();
	}
	
	var loading = function(){
		iconLoading();
	} 
	
	var iconLoading = function(){
		var elePi = '<div id="loadingParent" class="row loaderParent"> <div class="loaderChild loader-center"><span class="pi"></span> <div class="pis">   <span></span> <span></span> <span></span></div></div> </div>';          
		 
		$(tableId).after(elePi);
	}
	
	var renderHeaderTable = function(){
		loading();
		var arrSort = element.children('thead').children('tr').children('th[sort=true]');
		if(arrSort.length){
			arrSort.unbind( "click" );
			arrSort.removeClass();
			$.each(arrSort, (index,item) =>{
				$(item).addClass('das-sort');
				if($(item).attr('order')){
					$(item).addClass($(item).attr('order'));
				}
			});
			arrSort.click(function(){
				index = 0;
				for (; index < arrHeaders.length; index++) {
					if (arrHeaders[index] == this) {
						break;
					}
				}
				trs = document.querySelectorAll(tableId + " tbody tr");
				df = document.createDocumentFragment();
				trsArr = makeArray(trs);
				order = 'das-sort-asc';
				orderType = "asc";
				if($(this).hasClass("das-sort-asc")){
					order = 'das-sort-desc';
					orderType = "desc";
				}
				orderByCol = $(this).attr("orderBy");
				params.orderBy = orderByCol;
				params.order = orderType;
				currentPage = 1;
				_resetTable();
				_table();
				this.className = 'das-sort ' + order;
				
			});
		}
	}
	
	
	var _table = function(_params){
		if (params == undefined && config['params'] != undefined) {
			params = config['params'];
		} else {
			if (_params != undefined) {
				params = _params;
			}
		}
		if (params == undefined) {
			params = {};
			params.orderBy = orderByCol;
			params.order = orderType;
		}
		
		var removeIconLoading = function(){
			return $("#loadingParent .loaderChild").addClass("display-none");
		}
		
		var processTable = function(resp){
			removeIconLoading(); 
			dataList = resp.list;
			sizeResult = dataList.length
			totalRecords = resp.totalRecords;
			currentPage = resp.currentPage;
			totalPages = resp.totalPages;
			maxNavigationPage = resp.maxNavigationPage;
			maxResult = resp.maxResult;
			navigationPages = resp.navigationPages;
			rawData();
			buildFooter();
			$("#tblNext").click(onNext);
			$("#tblPrevious").click(onPrevious);
			$("span[id^=tblPage").click(goto);
			
		}
		
		var renderRowCount = function renderRowCount() {
			return currentRecord++;
		}
		
		var rawData = function(){
			$table = element;
			elementTBody = $table.children('tbody');
			if(dataList.length < 1){
				$.each(elementTBody, ($ind,$row) => {
					$row.remove();
				})
				return;
			}
			currentRecord = (currentPage-1) * maxResult + 1;
			if(elementTBody.length < 1 ){
				elementTBody = document.createElement('tbody');	
				dataList.forEach(function(item){
					var _row = document.createElement("tr");
					Object.keys(columnDefs).forEach(col => {
						var customRender = columnDefs[col]['customRender']
						var hide = columnDefs[col]['hide']
						var property = columnDefs[col]['property']
						var type = columnDefs[col]['type']
						var _col = document.createElement("td");
						if(customRender != undefined){
							if ('renderRowCount' == customRender) {
								txtContent = renderRowCount();
							} else {
								txtContent = customRender(item);
							}
							_col.insertAdjacentHTML( 'beforeend', txtContent );
						}else{
							_col.textContent = getContentCol(property, item[col]);
						}
						if (type != undefined && type == 'date') {
							//_col.textContent = formatDate(getContentCol(property, item[col]));
							_col.textContent = getDateLocale(getContentCol(property, item[col]));
						}
						if (hide != undefined && hide == true) {
							_col.className = " display-none";
						}
						_row.appendChild(_col);
					});
					$(elementTBody).append(_row); 
				});
				element.append(elementTBody);
			}else{
				var keyObjects = Object.keys(columnDefs);
				var _rows = elementTBody.children('tr');
				let trCloneConstant =  $(_rows[0]);
				for (var i = 0; i < maxResult; i++) {
					var $row = $(_rows[i]);
					var $rowData = dataList[i];
					if($rowData == undefined && $row.length != 0){
						$row.remove();
						continue;
					}else if($rowData != undefined && $row.length == 0){
						let trClone = trCloneConstant.clone();
						let tdClone = trClone.children('td');
						for (var j = 0; j < tdClone.length; j++) {
							var $col = tdClone[j];
							var $propertyCol = keyObjects[j];
							var $colData = $rowData[$propertyCol]
							var customRender = columnDefs[$propertyCol]['customRender']
							var property = columnDefs[$propertyCol]['property']
							var type = columnDefs[$propertyCol]['type']
							if(customRender != undefined){
								$col.textContent = '';
								if ('renderRowCount' == customRender) {
									txtContent = renderRowCount();
								} else {
									txtContent = customRender($rowData);
								}
								$col.insertAdjacentHTML( 'beforeend', txtContent );
							}else{
								$col.textContent = getContentCol(property, $colData);
							}
							if (type != undefined && type == 'date') {
								//$col.textContent = formatDate(getContentCol(property, $colData));
								$col.textContent = getDateLocale(getContentCol(property, $colData));
							}
						}
						elementTBody.append($(trClone));
					}else{
						for (var j = 0; j < $row.children('td').length; j++) {
							var $col = $row.children('td')[j];
							var $propertyCol = keyObjects[j];
							var $colData = $rowData[$propertyCol]
							var customRender = columnDefs[$propertyCol]['customRender']
							var property = columnDefs[$propertyCol]['property']
							var type = columnDefs[$propertyCol]['type']
							
							if(customRender != undefined){
								$col.textContent = '';
								if ('renderRowCount' == customRender) {
									txtContent = renderRowCount();
								} else {
									txtContent = customRender($rowData);
								}
								$col.insertAdjacentHTML( 'beforeend', txtContent );
							}else{
								$col.textContent = getContentCol(property, $colData);
							}
							if (type != undefined && type == 'date') {
								//$col.textContent = formatDate(getContentCol(property, $colData));
								$col.textContent = getDateLocale(getContentCol(property, $colData));
							}
						}
					}
				}
			}
		}
		
		var getContentCol = function(property, _data){
			if (_data == null) {
				return '';
			}
			if(typeof _data == 'object' && _data != undefined){
				var subKey = property.split('.');
				if(subKey != undefined && subKey.length > 0){
					subKey = subKey[1]
					return _data[subKey];
				} else {
					return '';
				}
			} else {
				return _data;
			}
		}
		
		var buildLeftFooterTbl = function(){
			if(totalRecords == 0){
//				leftFoot = 'Page 0 of 0 ';
				leftFoot = getValidateMessage('mess.table.noRecord');
			}else{
				leftFoot = `Page ${currentPage} of ${totalPages}`;
			}
		}
		var buildRightFooterTbl = function() {
			if(currentPage == 1 && totalPages == 1){
				locklFootLeft = locklFootRight = 'sgds-icon-disabled sgds-pointer-events'
			}else if(currentPage == 1){
				locklFootLeft = 'sgds-icon-disabled sgds-pointer-events'
			}else if(currentPage == totalPages){
				locklFootRight = 'sgds-icon-disabled sgds-pointer-events'
			}
			navigationPages.forEach(function(item) {
				/* EX:
				 * <span class="selected-page" style="display: inline-block; pointer-events: none;">1</span>
				 * <span class="" style="display: inline-block;">2</span>
				 * <span class="is-hidden-mobile" style="display: inline-block;">5</span>
				 */
				var clockedClass = ''
				var curr = '';
				if(item == currentPage){
					clockedClass = 'class="selected-page sgds-pointer-events"'
				}
				if(item != -1){
					var tmpRow =`<span ${clockedClass} style="display: inline-block;" id="tblPage">${item}</span>`
						rightFoot += tmpRow
				}else{
					var tmpRow =`<span class="sgds-pointer-events" style="display: inline-block;" id="tblPage">...</span>`
						rightFoot += tmpRow
				}
			});
		}
		
		var buildFooter = function(){
			var $tblFooter = $("#tblPagging");
			buildLeftFooterTbl();
			if($tblFooter.length < 1){
				buildRightFooterTbl();
				templatePagging = `
				<div class="row" id="tblPagging">
					<div class="col is-2" id="tbl_info_page">
						<span>${leftFoot}</span>
					</div>
					<div class="col is-10">
						<div class="search pagination padding--bottom--xl" style="display: flex;float:right">
							<span class="sgds-icon sgds-icon-arrow-left is-size-4 ${locklFootLeft}" id="tblPrevious"></span>
							<div id="paginator-pages">
								${rightFoot}
							</div>
							<span class="sgds-icon sgds-icon-arrow-right is-size-4 ${locklFootRight}" id="tblNext"></span>
						</div>
					</div>
				</div>`
					var jDom = $(templatePagging);
				element.after(jDom);
			}else{
				$tblFooter.children('div[id=tbl_info_page]').children('span').text(leftFoot);
				$pagination = $tblFooter.children('div').children('div[class~=pagination]');
				
				$tblFooterArrowLeft = $pagination.children('span[class~="sgds-icon-arrow-left"]')
				$tblFooterArrowRight = $pagination.children('span[class~="sgds-icon-arrow-right"]')
				if(totalPages == 0){
					$tblFooterArrowRight.hide();
					$tblFooterArrowLeft.hide();
					$pagination.children('div[id=paginator-pages]').children('span').remove();
				}else{
					$tblFooterArrowRight.show();
					$tblFooterArrowLeft.show();
					$tblFooterPagintor = $pagination.children('div[id=paginator-pages]').children('span');
					let tmpCount = 0;
					if( navigationPages.length > $tblFooterPagintor.length){
						tmpCount = navigationPages.length;
					}else{
						tmpCount = $tblFooterPagintor.length;
					}
					for (var i = 0; i < tmpCount; i++) {
						let page = navigationPages[i];
						$pageDom = $($tblFooterPagintor[i]);
						var classClocked = '';
						if($pageDom.length == 0){
							if(page == -1){
								page ='...';
								classClocked = 'sgds-pointer-events';
							}
							let tmpRow =`<span class="${classClocked}" style="display: inline-block;" id="tblPage">${page}</span>`
								$pagination.children('div[id=paginator-pages]').append($(tmpRow));
						}else if(page == undefined){
							$pageDom.remove();
						}else{
							if(page == -1){
								$pageDom.text('...').removeClass('selected-page sgds-pointer-events');
							} else {
								$pageDom.text(page);
							}
						}
					}
					
					$tblFooterPagintor.removeClass('selected-page sgds-pointer-events');
					$tblFooterPagintorSelected = $tblFooterPagintor.filter(function() { return $(this).text() == currentPage;});
					$tblFooterPagintorSelected.addClass('selected-page sgds-pointer-events');
					$tblFooterPagintorOther = $tblFooterPagintor.filter(function() { return $(this).text() == '...';});
					$tblFooterPagintorOther.addClass('sgds-pointer-events');
					
					if(currentPage == 1){
						$tblFooterArrowLeft.addClass('sgds-icon-disabled sgds-pointer-events');
					}else{
						$tblFooterArrowLeft.removeClass('sgds-icon-disabled sgds-pointer-events');
					}
					if(currentPage == totalPages){
						$tblFooterArrowRight.addClass('sgds-icon-disabled sgds-pointer-events');
					}else{
						$tblFooterArrowRight.removeClass('sgds-icon-disabled sgds-pointer-events');
					}
				}
			}
		}
		
		var pagging = {
			page: currentPage
		}
		
		if(params != undefined){
			params.page = currentPage;
			pagging = params;
		}
		
		var _opt = {
				url: _ajax.url,
				contentType : "application/json",
				type: 'GET',
				dataType: 'json',
				success: processTable,
				data: pagging
		}
		if(_ajax.type != undefined){
			_opt = _ajax.type
		}
		
		if(config && config.cbAfterRender){
			$.ajax(_opt).done(config.cbAfterRender);
		}else{
			$.ajax(_opt);
		}
	}
	
	renderHeaderTable();
	_table();
	
	var reload = function(param){
		 currentPage = 1;// reset current page
		_resetTable();
		_table(param);
	}
	
	
	var _getAllData = function() {
		return dataList;
	}
	
	var _getData = function(_val){
		var _data = dataList.filter(item =>{
			return item[_val.property] == _val.value
		})
		if(_data.length > 0){
			return _data[0];
		}else{
			return null;
		}
	}
	return {
		reload: reload,
		getData: _getData,
		reset: _clean,
		getAllData: _getAllData
	}

}

$.fn.jsonTable = function(config){
	var tbl = this[0];
	var columnDefs = config.columnDefs;
	if(tbl.localName != 'table') return;
	var tableId = "#"+tbl.id;
	var element = $("table"+tableId);
	var $table = element;
	var elementTBody;
	var dataList = config.dataSource;
	var params;
	var totalRecords = 0;
	var navigationPages = [];
	var sortFunc = config.sort;
	var key = config.key;
	var leftFoot = rightFoot = locklFootLeft = locklFootRight = '';
	
	var arrHeaders = document.querySelectorAll("table#"+tbl.id+" thead th");
	
	var isRender = false
	
	var _resetTable = function(){
		$table.children('tbody').empty();
		$("#tblNext").unbind( "click" );
		$("#tblPrevious").unbind( "click" );
		$("span[id^=tblPage").unbind( "click" );
		totalRecords = maxNavigationPage = maxResult = totalPages = 0;
		leftFoot = rightFoot = locklFootLeft = locklFootRight = '';
		dataList = [];
	}

	var renderHeaderTable = function(){
		var arrSort = element.children('thead').children('tr').children('th[sort=true]');
		if(arrSort.length){
			arrSort.unbind( "click" );
			arrSort.removeClass();
			$.each(arrSort, (index,item) =>{
				$(item).addClass('das-sort');
				if($(item).attr('order')){
					$(item).addClass($(item).attr('order'));
				}
			});
			arrSort.click(function() {
				_clean();
				order = 'das-sort-asc';
				if($(this).hasClass("das-sort-asc")){
					order = 'das-sort-desc';
				}
				orderByCol = $(this).attr("orderBy");
				sortFunc = sortJsonData; 
				reload(dataList);
			    this.className = 'das-sort ' + order;
			    currentPage = 1;
			});
		}
	}
	
	var sortJsonData = function(a, b) {
		
		if([orderByCol][0] == "citizenship"){
			if(a[orderByCol] == null){
				a[orderByCol] = ""; 
			}  
			if(b[orderByCol] == null ){
				b[orderByCol] = "";
			}
		}
		
		if(typeof a[orderByCol] == "string"){
			if (a[orderByCol].toLowerCase() < b[orderByCol].toLowerCase()) {
				return order === "das-sort-asc" ? -1 : 1;
			} else if (a[orderByCol].toLowerCase() > b[orderByCol].toLowerCase()) {
				return order === "das-sort-asc" ? 1 : -1;
			} else {
				return 0;
			}
		}else{
			if (a[orderByCol] < b[orderByCol]) {
				return order === "das-sort-asc" ? -1 : 1;
			} else if (a[orderByCol] > b[orderByCol]) {
				return order === "das-sort-asc" ? 1 : -1;
			} else {
				return 0;
			}
		}
		
		
	}
	
	var _table = function(_params){
		if(params == undefined && config['params'] != undefined){
			params = config['params'];
		}else{
			if(_params != undefined)
				params = _params;
		}
		
		var processTable = function(){
			$table.children('tbody').empty();
			sortData();
			rawData();
			currentPage = 1;
			totalRecords = dataList.length + 1;
			totalPages = (parseInt(totalRecords) % 10 == 0) ? (parseInt(totalRecords) / 10) : ((parseInt(totalRecords / 10)) + 1);
			if(totalRecords <= 10){
				navigationPages = [1]; 
			}else if (totalRecords > 10 && totalRecords <= 20){
				navigationPages = [1, 2]; 
			}
			
			buildFooter();
			$("#tblNext").click(onNext);
			$("#tblPrevious").click(onPrevious);
			$("span[id^=tblPage").click(goto);
		}
		
		var buildFooter = function(){
			var $tblFooter = $("#tblPagging");
			buildLeftFooterTbl();
			if($tblFooter.length < 1){
				buildRightFooterTbl();
				templatePagging = `
				<div class="row" id="tblPagging">
					<div class="col is-2" id="tbl_info_page">
						<span>${leftFoot}</span>
					</div>
					<div class="col is-10">
						<div class="search pagination padding--bottom--xl" style="display: flex;float:right">
							<span class="sgds-icon sgds-icon-arrow-left is-size-4 ${locklFootLeft}" id="tblPrevious"></span>
							<div id="paginator-pages">
								${rightFoot}
							</div>
							<span class="sgds-icon sgds-icon-arrow-right is-size-4 ${locklFootRight}" id="tblNext"></span>
						</div>
					</div>
				</div>`
					var jDom = $(templatePagging);
				element.after(jDom);
			}else{
				$tblFooter.children('div[id=tbl_info_page]').children('span').text(leftFoot);
				$pagination = $tblFooter.children('div').children('div[class~=pagination]');
				
				$tblFooterArrowLeft = $pagination.children('span[class~="sgds-icon-arrow-left"]')
				$tblFooterArrowRight = $pagination.children('span[class~="sgds-icon-arrow-right"]')
				if(totalPages == 0){
					$tblFooterArrowRight.hide();
					$tblFooterArrowLeft.hide();
					$pagination.children('div[id=paginator-pages]').children('span').remove();
				}else{
					$tblFooterArrowRight.show();
					$tblFooterArrowLeft.show();
					$tblFooterPagintor = $pagination.children('div[id=paginator-pages]').children('span');
					let tmpCount = 0;
					if( navigationPages.length > $tblFooterPagintor.length){
						tmpCount = navigationPages.length;
					}else{
						tmpCount = $tblFooterPagintor.length;
					}
					for (var i = 0; i < tmpCount; i++) {
						let page = navigationPages[i];
						$pageDom = $($tblFooterPagintor[i]);
						var classClocked = '';
						if($pageDom.length == 0){
							if(page == -1){
								page ='...';
								classClocked = 'sgds-pointer-events';
							}
							let tmpRow =`<span class="${classClocked}" style="display: inline-block;" id="tblPage">${page}</span>`
							$pagination.children('div[id=paginator-pages]').append($(tmpRow));
						}else if(page == undefined){
							$pageDom.remove();
						}else{
							if(page == -1){
								$pageDom.text('...').removeClass('selected-page sgds-pointer-events');
							} else {
								$pageDom.text(page);
							}
						}
					}
					
					$tblFooterPagintor.removeClass('selected-page sgds-pointer-events');
					$tblFooterPagintorSelected = $tblFooterPagintor.filter(function() { return $(this).text() == currentPage;});
					$tblFooterPagintorSelected.addClass('selected-page sgds-pointer-events');
					$tblFooterPagintorOther = $tblFooterPagintor.filter(function() { return $(this).text() == '...';});
					$tblFooterPagintorOther.addClass('sgds-pointer-events');
					
					if(currentPage == 1){
						$tblFooterArrowLeft.addClass('sgds-icon-disabled sgds-pointer-events');
					}else{
						$tblFooterArrowLeft.removeClass('sgds-icon-disabled sgds-pointer-events');
					}
					if(currentPage == totalPages){
						$tblFooterArrowRight.addClass('sgds-icon-disabled sgds-pointer-events');
					}else{
						$tblFooterArrowRight.removeClass('sgds-icon-disabled sgds-pointer-events');
					}
				}
			}
		}
		
		var buildLeftFooterTbl = function(){
			if(totalRecords == 0){
				leftFoot = getValidateMessage('mess.table.noRecord');
			}else{
				leftFoot = `Page ${currentPage} of ${totalPages}`;
			}
		}
		var onNext = function(){
			currentPage++;
			_resetTable();
			_table();
			renderHeaderTable();
		}
		
		var onPrevious = function(){
			currentPage--;
			_resetTable();
			_table();
			renderHeaderTable();
		}
		
		var goto = function(){
			var page = $(this).text(); 
			if (page == '...') {
				return;
			}
			currentPage = page;
			_resetTable();
			_table();
			renderHeaderTable();
		}
		
		var sortData = function() {
			if (sortFunc != undefined && dataList.length > 1) {
				dataList.sort( function(a,b) {
					return sortFunc(a,b);
				});
			}
		}
		
		var rawData = function() {
			$table = element;
			elementTBody = $table.children('tbody');
			if(dataList.length < 1){
				$.each(elementTBody, ($ind,$row) => {
					$row.remove();
				})
				return;
			}
			if (elementTBody.length < 1) {
				elementTBody = document.createElement('tbody');
			}
			dataList.forEach(function(item){
				var _row = document.createElement("tr");
				Object.keys(columnDefs).forEach(col => {
					
					var customRender = columnDefs[col]['customRender'];
					var hide = columnDefs[col]['hide'];
					var property = columnDefs[col]['property'];
					var _col = document.createElement("td");
					if(customRender != undefined){
						txtContent = customRender(item);
						_col.insertAdjacentHTML( 'beforeend', txtContent );
					}else{
						_col.textContent = getContentCol(property, item[col]);
					}
					if (hide != undefined && hide == true) {
						_col.className = " display-none";
					}
					_row.appendChild(_col);
					
				}); 
				$(elementTBody).append(_row); 
			});
			if ($table.children('tbody').length < 1) {
				element.append(elementTBody);				
			}
		}
		
		var buildRightFooterTbl = function() {
			if(currentPage == 1 && totalPages == 1){
				locklFootLeft = locklFootRight = 'sgds-icon-disabled sgds-pointer-events'
			}else if(currentPage == 1){
				locklFootLeft = 'sgds-icon-disabled sgds-pointer-events'
			}else if(currentPage == totalPages){
				locklFootRight = 'sgds-icon-disabled sgds-pointer-events'
			}
			navigationPages.forEach(function(item) {
				/* EX:
				 * <span class="selected-page" style="display: inline-block; pointer-events: none;">1</span>
				 * <span class="" style="display: inline-block;">2</span>
				 * <span class="is-hidden-mobile" style="display: inline-block;">5</span>
				 */
				var clockedClass = ''
				var curr = '';
				if(item == currentPage){
					clockedClass = 'class="selected-page sgds-pointer-events"'
				}
				if(item != -1){
					var tmpRow =`<span ${clockedClass} style="display: inline-block;" id="tblPage">${item}</span>`
						rightFoot += tmpRow
				}else{
					var tmpRow =`<span class="sgds-pointer-events" style="display: inline-block;" id="tblPage">...</span>`
						rightFoot += tmpRow
				}
			});
		}
		
		var getContentCol = function(property, _data){
			if(typeof _data == 'object' && _data != undefined){
				var subKey = property.split('.');
				if(subKey != undefined && subKey.length > 0){
					subKey = subKey[1]
					return _data[subKey];
				}else{
					return '';
				}
			}else{
				return _data
			}
		}
		
		processTable();
		if (config && config.cbAfterRender) {
			var render = config.cbAfterRender;
			render();
		}
	}
	
	renderHeaderTable();
	_table();
	
	
	var reload = function(data){
		if (data != undefined) {
			_resetTable();
			dataList = data; 
		}else{
			//_clean();
		} 
		_table();
		
	}
	
	var _add = function(data) {
		dataList.push(data);
		reload();
	}
	
	var _update = function(data) {
		var index = dataList.findIndex(item => {
			return item[key] == data[key];
		});
		
		if (index == -1) {
			_add(data);
		} else {
			dataList[index] = data;
			reload();
		}
	}
	
	var _getAllData = function() {
		return dataList;
	}
	
	var _getData = function(_val){
		var _data = dataList.filter(item =>{
			return item[_val.property] == _val.value
		});
		if (_data.length > 0) {
			return _data[0];
		} else {
			return null;
		}
	}
	
	var _clean = function() {
		$table.children('tbody').empty();
	}
	
	return {
		clean : _clean,
		reload: reload,
		getData: _getData,
		add: _add,
		update: _update,
		getAllData: _getAllData
	}
}

$.fn.jsonTable1 = function(config){
	let tbl = this[0];
	let columnDefs = config.columnDefs;
	if(tbl.localName != 'table') return;
	let tableId = "#"+tbl.id;
	let element = $("table"+tableId);
	let $table = element;
	let elementTBody;
	let dataList = config.dataSource;
	let params;
	let totalRecords = 0;
	let navigationPages = [];
	let sortFunc = config.sort;
	let key = config.key;
	let leftFoot = rightFoot = locklFootLeft = locklFootRight = '';
	
	let arrHeaders = document.querySelectorAll("table#"+tbl.id+" thead th");
	
	let isRender = false;
	
	let _resetTable = function(){
		$table.children('tbody').empty();
		$("#tblNext").unbind( "click" );
		$("#tblPrevious").unbind( "click" );
		$("span[id^=tblPage").unbind( "click" );
		totalRecords = maxNavigationPage = maxResult = totalPages = 0;
		leftFoot = rightFoot = locklFootLeft = locklFootRight = '';
		dataList = [];
	}

	let renderHeaderTable = function(){
		let arrSort = element.children('thead').children('tr').children('th[sort=true]');
		if(arrSort.length){
			arrSort.unbind( "click" );
			arrSort.removeClass();
			$.each(arrSort, (index,item) =>{
				$(item).addClass('das-sort');
				if($(item).attr('order')){
					$(item).addClass($(item).attr('order'));
				}
			});
			arrSort.click(function() {
				_clean();
				order = 'das-sort-asc';
				if($(this).hasClass("das-sort-asc")){
					order = 'das-sort-desc';
				}
				orderByCol = $(this).attr("orderBy");
				sortFunc = sortJsonData; 
				reload(dataList);
			    this.className = 'das-sort ' + order;
			    currentPage = 1;
			});
		}
	}
	
	let sortJsonData = function(a, b) {
		
		if([orderByCol][0] == "citizenship"){
			if(a[orderByCol] == null){
				a[orderByCol] = ""; 
			}  
			if(b[orderByCol] == null ){
				b[orderByCol] = "";
			}
		}
		
		if(typeof a[orderByCol] == "string"){
			if (a[orderByCol].toLowerCase() < b[orderByCol].toLowerCase()) {
				return order === "das-sort-asc" ? -1 : 1;
			} else if (a[orderByCol].toLowerCase() > b[orderByCol].toLowerCase()) {
				return order === "das-sort-asc" ? 1 : -1;
			} else {
				return 0;
			}
		}else{
			if (a[orderByCol] < b[orderByCol]) {
				return order === "das-sort-asc" ? -1 : 1;
			} else if (a[orderByCol] > b[orderByCol]) {
				return order === "das-sort-asc" ? 1 : -1;
			} else {
				return 0;
			}
		}
		
		
	}
	
	let _table = function(_params){
		if(params == undefined && config['params'] != undefined){
			params = config['params'];
		}else{
			if(_params != undefined)
				params = _params;
		}
		
		let processTable = function(){
			$table.children('tbody').empty();
			sortData();
			rawData();
			currentPage = 1;
			totalRecords = dataList.length + 1;
			totalPages = (parseInt(totalRecords) % 10 == 0) ? (parseInt(totalRecords) / 10) : ((parseInt(totalRecords / 10)) + 1);
			if(totalRecords <= 10){
				navigationPages = [1]; 
			}else if (totalRecords > 10 && totalRecords <= 20){
				navigationPages = [1, 2]; 
			}
			
			buildFooter();
			$("#tblNext").click(onNext);
			$("#tblPrevious").click(onPrevious);
			$("span[id^=tblPage").click(goto);
		}
		
		let buildFooter = function(){
			let $tblFooter = $("#tblPagging1");
			buildLeftFooterTbl();
			if($tblFooter.length < 1){
				buildRightFooterTbl();
				templatePagging = `
				<div class="row" id="tblPagging1">
					<div class="col is-2" id="tbl_info_page">
						<span>${leftFoot}</span>
					</div>
					<div class="col is-10">
						<div class="search pagination padding--bottom--xl" style="display: flex;float:right">
							<span class="sgds-icon sgds-icon-arrow-left is-size-4 ${locklFootLeft}" id="tblPrevious"></span>
							<div id="paginator-pages">
								${rightFoot}
							</div>
							<span class="sgds-icon sgds-icon-arrow-right is-size-4 ${locklFootRight}" id="tblNext"></span>
						</div>
					</div>
				</div>`
					let jDom = $(templatePagging);
				element.after(jDom);
			}else{
				$tblFooter.children('div[id=tbl_info_page]').children('span').text(leftFoot);
				$pagination = $tblFooter.children('div').children('div[class~=pagination]');
				
				$tblFooterArrowLeft = $pagination.children('span[class~="sgds-icon-arrow-left"]')
				$tblFooterArrowRight = $pagination.children('span[class~="sgds-icon-arrow-right"]')
				if(totalPages == 0){
					$tblFooterArrowRight.hide();
					$tblFooterArrowLeft.hide();
					$pagination.children('div[id=paginator-pages]').children('span').remove();
				}else{
					$tblFooterArrowRight.show();
					$tblFooterArrowLeft.show();
					$tblFooterPagintor = $pagination.children('div[id=paginator-pages]').children('span');
					let tmpCount = 0;
					if( navigationPages.length > $tblFooterPagintor.length){
						tmpCount = navigationPages.length;
					}else{
						tmpCount = $tblFooterPagintor.length;
					}
					for (var i = 0; i < tmpCount; i++) {
						let page = navigationPages[i];
						$pageDom = $($tblFooterPagintor[i]);
						let classClocked = '';
						if($pageDom.length == 0){
							if(page == -1){
								page ='...';
								classClocked = 'sgds-pointer-events';
							}
							let tmpRow =`<span class="${classClocked}" style="display: inline-block;" id="tblPage">${page}</span>`
							$pagination.children('div[id=paginator-pages]').append($(tmpRow));
						}else if(page == undefined){
							$pageDom.remove();
						}else{
							if(page == -1){
								$pageDom.text('...').removeClass('selected-page sgds-pointer-events');
							} else {
								$pageDom.text(page);
							}
						}
					}
					
					$tblFooterPagintor.removeClass('selected-page sgds-pointer-events');
					$tblFooterPagintorSelected = $tblFooterPagintor.filter(function() { return $(this).text() == currentPage;});
					$tblFooterPagintorSelected.addClass('selected-page sgds-pointer-events');
					$tblFooterPagintorOther = $tblFooterPagintor.filter(function() { return $(this).text() == '...';});
					$tblFooterPagintorOther.addClass('sgds-pointer-events');
					
					if(currentPage == 1){
						$tblFooterArrowLeft.addClass('sgds-icon-disabled sgds-pointer-events');
					}else{
						$tblFooterArrowLeft.removeClass('sgds-icon-disabled sgds-pointer-events');
					}
					if(currentPage == totalPages){
						$tblFooterArrowRight.addClass('sgds-icon-disabled sgds-pointer-events');
					}else{
						$tblFooterArrowRight.removeClass('sgds-icon-disabled sgds-pointer-events');
					}
				}
			}
		}
		
		let buildLeftFooterTbl = function(){
			if(totalRecords == 0){
				leftFoot = getValidateMessage('mess.table.noRecord');
			}else{
				leftFoot = `Page ${currentPage} of ${totalPages}`;
			}
		}
		let onNext = function(){
			currentPage++;
			_resetTable();
			_table();
			renderHeaderTable();
		}
		
		let onPrevious = function(){
			currentPage--;
			_resetTable();
			_table();
			renderHeaderTable();
		}
		
		let goto = function(){
			var page = $(this).text(); 
			if (page == '...') {
				return;
			}
			currentPage = page;
			_resetTable();
			_table();
			renderHeaderTable();
		}
		
		let sortData = function() {
			if (sortFunc != undefined && dataList.length > 1) {
				dataList.sort( function(a,b) {
					return sortFunc(a,b);
				});
			}
		}
		
		let rawData = function() {
			$table = element;
			elementTBody = $table.children('tbody');
			if(dataList.length < 1){
				$.each(elementTBody, ($ind,$row) => {
					$row.remove();
				})
				return;
			}
			if (elementTBody.length < 1) {
				elementTBody = document.createElement('tbody');
			}
			dataList.forEach(function(item){
				var _row = document.createElement("tr");
				Object.keys(columnDefs).forEach(col => {
					
					var customRender = columnDefs[col]['customRender'];
					var hide = columnDefs[col]['hide'];
					var property = columnDefs[col]['property'];
					var _col = document.createElement("td");
					if(customRender != undefined){
						txtContent = customRender(item);
						_col.insertAdjacentHTML( 'beforeend', txtContent );
					}else{
						_col.textContent = getContentCol(property, item[col]);
					}
					if (hide != undefined && hide == true) {
						_col.className = " display-none";
					}
					_row.appendChild(_col);
					
				}); 
				elementTBody.append(_row);
			});
			if ($table.children('tbody').length < 1) {
				element.append(elementTBody);				
			}
		}
		
		let buildRightFooterTbl = function() {
			if(currentPage == 1 && totalPages == 1){
				locklFootLeft = locklFootRight = 'sgds-icon-disabled sgds-pointer-events'
			}else if(currentPage == 1){
				locklFootLeft = 'sgds-icon-disabled sgds-pointer-events'
			}else if(currentPage == totalPages){
				locklFootRight = 'sgds-icon-disabled sgds-pointer-events'
			}
			navigationPages.forEach(function(item) {
				/* EX:
				 * <span class="selected-page" style="display: inline-block; pointer-events: none;">1</span>
				 * <span class="" style="display: inline-block;">2</span>
				 * <span class="is-hidden-mobile" style="display: inline-block;">5</span>
				 */
				var clockedClass = ''
				var curr = '';
				if(item == currentPage){
					clockedClass = 'class="selected-page sgds-pointer-events"'
				}
				if(item != -1){
					var tmpRow =`<span ${clockedClass} style="display: inline-block;" id="tblPage">${item}</span>`
						rightFoot += tmpRow
				}else{
					var tmpRow =`<span class="sgds-pointer-events" style="display: inline-block;" id="tblPage">...</span>`
						rightFoot += tmpRow
				}
			});
		}
		
		let getContentCol = function(property, _data){
			if(typeof _data == 'object' && _data != undefined){
				var subKey = property.split('.');
				if(subKey != undefined && subKey.length > 0){
					subKey = subKey[1]
					return _data[subKey];
				}else{
					return '';
				}
			}else{
				return _data
			}
		}
		
		processTable();
		if (config && config.cbAfterRender) {
			var render = config.cbAfterRender;
			render();
		}
	}
	
	renderHeaderTable();
	_table();
	
	
	let reload = function(data){
		if (data != undefined) {
			_resetTable();
			dataList = data; 
		}else{
			//_clean();
		} 
		_table();
		
	}
	
	let _add = function(data) {
		dataList.push(data);
		reload();
	}
	
	let _update = function(data) {
		let index = dataList.findIndex(item => {
			return item[key] == data[key];
		});
		
		if (index == -1) {
			_add(data);
		} else {
			dataList[index] = data;
			reload();
		}
	}
	
	let _getAllData = function() {
		return dataList;
	}
	
	let _getData = function(_val){
		let _data = dataList.filter(item =>{
			return item[_val.property] == _val.value
		});
		if (_data.length > 0) {
			return _data[0];
		} else {
			return null;
		}
	}
	
	let _clean = function() { 
		$table.children('tbody').empty();
	}
	
	return {
		clean : _clean,
		reload: reload,
		getData: _getData,
		add: _add,
		update: _update,
		getAllData: _getAllData
	}
}


$.fn.sgdsTableSecond = function(config){
	var tbl = this[0];
	var columnDefs = config.columnDefs;
	var _ajax = config.ajax;
	if(tbl.localName != 'table') return;
	var tableId = "#"+tbl.id;
	var element = $("table"+tableId);
	var $table = element;
	var elementTBody;
	var totalRecords = maxNavigationPage = maxResult = totalPages = maxResult = sizeResult = 0
	var currentPage = 1;
	var leftFoot = rightFoot = locklFootLeft = locklFootRight = '';
	var navigationPages;
	var templatePagging;
	var dataList = [];
	var params;
	var orderByCol = "";
	var orderType = "";
	var currentRecord = 1;
	
	var arrHeaders = document.querySelectorAll("table#"+tbl.id+" thead th");
	
	var isRender = false;
	
	var onNext = function(){
		currentPage++;
		_resetTable();
		_table();
		renderHeaderTable();
	}
	
	var onPrevious = function(){
		currentPage--;
		_resetTable();
		_table();
		renderHeaderTable();
	}
	
	var goto = function(){
		var page = $(this).text(); 
		if (page == '...') {
			return;
		}
		currentPage = page;
		_resetTable();
		_table();
		renderHeaderTable();
	}
	
	var _resetTable = function(){
		$("#tblNext").unbind( "click" );
		$("#tblPrevious").unbind( "click" );
		$("span[id^=tblPage").unbind( "click" );
		totalRecords = maxNavigationPage = maxResult = totalPages = 0;
		leftFoot = rightFoot = locklFootLeft = locklFootRight = '';
		dataList = [];
	}
	
	var _clean = function() {
		$table.children('tbody').empty();
		_resetTable();
	}
	
	var loading = function(){
		iconLoading();
	} 
	
	var iconLoading = function(){
		var elePi = '<div id="loadingParent" class="row loaderParent"> <div class="loaderChild loader-center"><span class="pi"></span> <div class="pis">   <span></span> <span></span> <span></span></div></div> </div>';          
		 
		$(tableId).after(elePi);
	}
	
	var renderHeaderTable = function(){
		loading();
		var arrSort = element.children('thead').children('tr').children('th[sort=true]');
		if(arrSort.length){
			arrSort.unbind( "click" );
			arrSort.removeClass();
			$.each(arrSort, (index,item) =>{
				$(item).addClass('das-sort');
				if($(item).attr('order')){
					$(item).addClass($(item).attr('order'));
				}
			});
			arrSort.click(function(){
				index = 0;
				for (; index < arrHeaders.length; index++) {
					if (arrHeaders[index] == this) {
						break;
					}
				}
				trs = document.querySelectorAll(tableId + " tbody tr");
				df = document.createDocumentFragment();
				trsArr = makeArray(trs);
				order = 'das-sort-asc';
				orderType = "asc";
				if($(this).hasClass("das-sort-asc")){
					order = 'das-sort-desc';
					orderType = "desc";
				}
				orderByCol = $(this).attr("orderBy");
				params.orderBy = orderByCol;
				params.order = orderType;
				currentPage = 1;
				_resetTable();
				_table();
				this.className = 'das-sort ' + order;
				
			});
		}
	}
	
	
	var _table = function(_params){
		if (params == undefined && config['params'] != undefined) {
			params = config['params'];
		} else {
			if (_params != undefined) {
				params = _params;
			}
		}
		if (params == undefined) {
			params = {};
			params.orderBy = orderByCol;
			params.order = orderType;
		}
		
		var removeIconLoading = function(){
			return $("#loadingParent .loaderChild").addClass("display-none");
		}
		
		var processTable = function(resp){
			removeIconLoading(); 
			dataList = resp.list;
			sizeResult = dataList.length
			totalRecords = resp.totalRecords;
			currentPage = resp.currentPage;
			totalPages = resp.totalPages;
			maxNavigationPage = resp.maxNavigationPage;
			maxResult = resp.maxResult;
			navigationPages = resp.navigationPages;
			rawData();
			buildFooter();
			$("#tblNext").click(onNext);
			$("#tblPrevious").click(onPrevious);
			$("span[id^=tblPage").click(goto);
			
		}
		
		var renderRowCount = function renderRowCount() {
			return currentRecord++;
		}
		
		var rawData = function(){
			$table = element;
			elementTBody = $table.children('tbody');
			if(dataList.length < 1){
				$.each(elementTBody, ($ind,$row) => {
					$row.remove();
				})
				return;
			}
			currentRecord = (currentPage-1) * maxResult + 1;
			if(elementTBody.length < 1 ){
				elementTBody = document.createElement('tbody');	
				dataList.forEach(function(item){
					var _row = document.createElement("tr");
					Object.keys(columnDefs).forEach(col => {
						var customRender = columnDefs[col]['customRender']
						var hide = columnDefs[col]['hide']
						var property = columnDefs[col]['property']
						var type = columnDefs[col]['type']
						var _col = document.createElement("td");
						if(customRender != undefined){
							if ('renderRowCount' == customRender) {
								txtContent = renderRowCount();
							} else {
								txtContent = customRender(item);
							}
							_col.insertAdjacentHTML( 'beforeend', txtContent );
						}else{
							_col.textContent = getContentCol(property, item[col]);
						}
						if (type != undefined && type == 'date') {
							//_col.textContent = formatDate(getContentCol(property, item[col]));
							_col.textContent = getDateLocale(getContentCol(property, item[col]));
						}
						if (hide != undefined && hide == true) {
							_col.className = " display-none";
						}
						_row.appendChild(_col);
					});
					elementTBody.append(_row);
				});
				element.append(elementTBody);
			}else{
				var keyObjects = Object.keys(columnDefs);
				var _rows = elementTBody.children('tr');
				let trCloneConstant =  $(_rows[0]);
				for (var i = 0; i < maxResult; i++) {
					var $row = $(_rows[i]);
					var $rowData = dataList[i];
					if($rowData == undefined && $row.length != 0){
						$row.remove();
						continue;
					}else if($rowData != undefined && $row.length == 0){
						let trClone = trCloneConstant.clone();
						let tdClone = trClone.children('td');
						for (var j = 0; j < tdClone.length; j++) {
							var $col = tdClone[j];
							var $propertyCol = keyObjects[j];
							var $colData = $rowData[$propertyCol]
							var customRender = columnDefs[$propertyCol]['customRender']
							var property = columnDefs[$propertyCol]['property']
							var type = columnDefs[$propertyCol]['type']
							if(customRender != undefined){
								$col.textContent = '';
								if ('renderRowCount' == customRender) {
									txtContent = renderRowCount();
								} else {
									txtContent = customRender($rowData);
								}
								$col.insertAdjacentHTML( 'beforeend', txtContent );
							}else{
								$col.textContent = getContentCol(property, $colData);
							}
							if (type != undefined && type == 'date') {
								//$col.textContent = formatDate(getContentCol(property, $colData));
								$col.textContent = getDateLocale(getContentCol(property, $colData));
							}
						}
						elementTBody.append($(trClone));
					}else{
						for (var j = 0; j < $row.children('td').length; j++) {
							var $col = $row.children('td')[j];
							var $propertyCol = keyObjects[j];
							var $colData = $rowData[$propertyCol]
							var customRender = columnDefs[$propertyCol]['customRender']
							var property = columnDefs[$propertyCol]['property']
							var type = columnDefs[$propertyCol]['type']
							
							if(customRender != undefined){
								$col.textContent = '';
								if ('renderRowCount' == customRender) {
									txtContent = renderRowCount();
								} else {
									txtContent = customRender($rowData);
								}
								$col.insertAdjacentHTML( 'beforeend', txtContent );
							}else{
								$col.textContent = getContentCol(property, $colData);
							}
							if (type != undefined && type == 'date') {
							//	$col.textContent = formatDate(getContentCol(property, $colData));
								$col.textContent = getDateLocale(getContentCol(property, $colData));
							}
						}
					}
				}
			}
		}
		
		var getContentCol = function(property, _data){
			if (_data == null) {
				return '';
			}
			if(typeof _data == 'object' && _data != undefined){
				var subKey = property.split('.');
				if(subKey != undefined && subKey.length > 0){
					subKey = subKey[1]
					return _data[subKey];
				} else {
					return '';
				}
			} else {
				return _data;
			}
		}
		
		var buildLeftFooterTbl = function(){
			if(totalRecords == 0){
//				leftFoot = 'Page 0 of 0 ';
				leftFoot = getValidateMessage('mess.table.noRecord');
			}else{
				leftFoot = `Page ${currentPage} of ${totalPages}`;
			}
		}
		var buildRightFooterTbl = function() {
			if(currentPage == 1 && totalPages == 1){
				locklFootLeft = locklFootRight = 'sgds-icon-disabled sgds-pointer-events'
			}else if(currentPage == 1){
				locklFootLeft = 'sgds-icon-disabled sgds-pointer-events'
			}else if(currentPage == totalPages){
				locklFootRight = 'sgds-icon-disabled sgds-pointer-events'
			}
			navigationPages.forEach(function(item) {
				/* EX:
				 * <span class="selected-page" style="display: inline-block; pointer-events: none;">1</span>
				 * <span class="" style="display: inline-block;">2</span>
				 * <span class="is-hidden-mobile" style="display: inline-block;">5</span>
				 */
				var clockedClass = ''
				var curr = '';
				if(item == currentPage){
					clockedClass = 'class="selected-page sgds-pointer-events"'
				}
				if(item != -1){
					var tmpRow =`<span ${clockedClass} style="display: inline-block;" id="tblPage">${item}</span>`
						rightFoot += tmpRow
				}else{
					var tmpRow =`<span class="sgds-pointer-events" style="display: inline-block;" id="tblPage">...</span>`
						rightFoot += tmpRow
				}
			});
		}
		
		var buildFooter = function(){
/*			if($("#tblPaggingSecond").length){
				$("#tblPaggingSecond").remove();
			}*/
			var $tblFooter = $("#tblPaggingSecond");
			buildLeftFooterTbl();
			if($tblFooter.length < 1){
				buildRightFooterTbl();
				templatePagging = `
				<div class="row" id="tblPaggingSecond">
					<div class="col is-2" id="tbl_info_page">
						<span>${leftFoot}</span>
					</div>
					<div class="col is-10">
						<div class="search pagination padding--bottom--xl" style="display: flex;float:right">
							<span class="sgds-icon sgds-icon-arrow-left is-size-4 ${locklFootLeft}" id="tblPrevious"></span>
							<div id="paginator-pages">
								${rightFoot}
							</div>
							<span class="sgds-icon sgds-icon-arrow-right is-size-4 ${locklFootRight}" id="tblNext"></span>
						</div>
					</div>
				</div>`
					var jDom = $(templatePagging);
				element.after(jDom);
			}else{
				$tblFooter.children('div[id=tbl_info_page]').children('span').text(leftFoot);
				$pagination = $tblFooter.children('div').children('div[class~=pagination]');
				
				$tblFooterArrowLeft = $pagination.children('span[class~="sgds-icon-arrow-left"]')
				$tblFooterArrowRight = $pagination.children('span[class~="sgds-icon-arrow-right"]')
				if(totalPages == 0){
					$tblFooterArrowRight.hide();
					$tblFooterArrowLeft.hide();
					$pagination.children('div[id=paginator-pages]').children('span').remove();
				}else{
					$tblFooterArrowRight.show();
					$tblFooterArrowLeft.show();
					$tblFooterPagintor = $pagination.children('div[id=paginator-pages]').children('span');
					let tmpCount = 0;
					if( navigationPages.length > $tblFooterPagintor.length){
						tmpCount = navigationPages.length;
					}else{
						tmpCount = $tblFooterPagintor.length;
					}
					for (var i = 0; i < tmpCount; i++) {
						let page = navigationPages[i];
						$pageDom = $($tblFooterPagintor[i]);
						var classClocked = '';
						if($pageDom.length == 0){
							if(page == -1){
								page ='...';
								classClocked = 'sgds-pointer-events';
							}
							let tmpRow =`<span class="${classClocked}" style="display: inline-block;" id="tblPage">${page}</span>`
								$pagination.children('div[id=paginator-pages]').append($(tmpRow));
						}else if(page == undefined){
							$pageDom.remove();
						}else{
							if(page == -1){
								$pageDom.text('...').removeClass('selected-page sgds-pointer-events');
							} else {
								$pageDom.text(page);
							}
						}
					}
					
					$tblFooterPagintor.removeClass('selected-page sgds-pointer-events');
					$tblFooterPagintorSelected = $tblFooterPagintor.filter(function() { return $(this).text() == currentPage;});
					$tblFooterPagintorSelected.addClass('selected-page sgds-pointer-events');
					$tblFooterPagintorOther = $tblFooterPagintor.filter(function() { return $(this).text() == '...';});
					$tblFooterPagintorOther.addClass('sgds-pointer-events');
					
					if(currentPage == 1){
						$tblFooterArrowLeft.addClass('sgds-icon-disabled sgds-pointer-events');
					}else{
						$tblFooterArrowLeft.removeClass('sgds-icon-disabled sgds-pointer-events');
					}
					if(currentPage == totalPages){
						$tblFooterArrowRight.addClass('sgds-icon-disabled sgds-pointer-events');
					}else{
						$tblFooterArrowRight.removeClass('sgds-icon-disabled sgds-pointer-events');
					}
				}
			}
		}
		
		var pagging = {
			page: currentPage
		}
		
		if(params != undefined){
			params.page = currentPage;
			pagging = params;
		}
		
		var _opt = {
				url: _ajax.url,
				contentType : "application/json",
				type: 'GET',
				dataType: 'json',
				success: processTable,
				data: pagging
		}
		if(_ajax.type != undefined){
			_opt = _ajax.type
		}
		
		if(config && config.cbAfterRender){
			$.ajax(_opt).done(config.cbAfterRender);
		}else{
			$.ajax(_opt);
		}
	}
	
	renderHeaderTable();
	_table();
	
	var reload = function(param){
		 currentPage = 1;// reset current page
		_resetTable();
		_table(param);
	}
	
	var _getAllData = function() {
		return dataList;
	}
	
	var _getData = function(_val){
		var _data = dataList.filter(item =>{
			return item[_val.property] == _val.value
		})
		if(_data.length > 0){
			return _data[0];
		}else{
			return null;
		}
	}
	return {
		reload: reload,
		getData: _getData,
		reset: _clean,
		getAllData: _getAllData
	}

}

