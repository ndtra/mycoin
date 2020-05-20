
$(function() {
	addActionRow();
});

function addActionRow() {
	$(".table-action tr").each(function(index) {
		$(this).attr('onclick', 'RowClick(event,this,false);');
	});
}

var lastSelectedRow;
var trs;

// disable text selection
document.onselectstart = function() {
    return false;
}

function RowClick(e, currenttr, lock) {
    var event = window.event || e;
	var tableID = $(currenttr).closest('table').attr('id');
    trs = document.getElementById(tableID).tBodies[0].getElementsByTagName('tr');
	
    if (event.ctrlKey) {
        toggleRow(currenttr);
    }

    if (event.button === 0) {
        if (!event.ctrlKey && !event.shiftKey) {
            clearAll();
            toggleRow(currenttr);
        }

        if (event.shiftKey) {
            selectRowsBetweenIndexes([lastSelectedRow.rowIndex, currenttr.rowIndex])
        }
    }
}

function toggleRow(row) {
    row.className = row.className == 'selected' ? '' : 'selected';
    lastSelectedRow = row;
}

function selectRowsBetweenIndexes(indexes) {
    indexes.sort(function(a, b) {
        return a - b;
    });

    for (var i = indexes[0]; i <= indexes[1]; i++) {
    	element = trs[i];
    	style = window.getComputedStyle(element);
    	pro = style.getPropertyValue('display');
    	if (pro != 'none') {
    		element.className = 'selected';
    	}
    }
}

function clearAll() {
    for (var i = 0; i < trs.length; i++) {
        trs[i].className = '';
    }
}

function cloneRow(fromTableID, toTableID) {
	var row = $("#" + fromTableID +" .selected")
		.filter( function(index) {
			return $(this).attr("id") != "blocked";
		}).clone().removeClass("selected");
	
	$("#" + toTableID + " tbody").append(row);
}

function cloneAllRow(fromTableID, toTableID) {
	var cloneRow = $('#' + fromTableID + ' tbody tr').filter( function(index) {
		return $(this).attr("id") != "blocked" && $(this).css('display') != 'none';
	}).clone().removeClass("selected");
	
	$("#" + toTableID + " tbody").append(cloneRow);
}

function removeSelectedRow(tableID) {
	$('#' + tableID + ' .selected')
		.filter( function(index) {
			return $(this).attr("id") != "blocked";
		}).remove();
}

function removeAll(tableID) {
	$('#' + tableID +  ' tr').filter( function(index) {
			return $(this).attr("id") != "blocked";
		}).remove();
}

function add_Click(fromTableID, toTableID) {
	cloneRow(fromTableID, toTableID);
	removeSelectedRow(fromTableID);
	repareData();
}

function remove_Click(fromTableID, toTableID) {
	var check = true;
	$('#' + fromTableID + ' .selected').each( function(index) {
		if ($(this).attr("id") == "blocked") {
			check = false;
			return false;
		}
	});
	
	add_Click(fromTableID, toTableID);
}

