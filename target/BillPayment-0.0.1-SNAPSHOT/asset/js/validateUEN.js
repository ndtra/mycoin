/**
 * validates UEN of businesses in Singapore
 * https://www.uen.gov.sg/ueninternet/faces/pages/admin/aboutUEN.jspx
 * @param uen
 * @returns {boolean}
 */
function validString(input){
	if (!(/[\\/&;!{},=|?><@#$%^~`:*+ -.(_)]/.test(input))){
    	if(input.search('"')>=0 || input.search("'")>=0){
    		return false;
    	}
    	else{
    		return true;
    	}
    }
    return false;
}

function validateUEN (uen) {
    var debug = true;
    const entityTypeIndicator = [
        'LP', 'LL', 'FC', 'PF', 'RF', 'MQ', 'MM', 'NB', 'CC', 'CS', 'MB', 'FM', 'GS', 'GA',
        'GB', 'DP', 'CP', 'NR', 'CM', 'CD', 'MD', 'HS', 'VH', 'CH', 'MH', 'CL', 'XL', 'CX',
        'RP', 'TU', 'TC', 'FB', 'FN', 'PA', 'PB', 'SS', 'MC', 'SM'
    ];
    const ineligible = ['FM','DP','CP','NR','PA','PB','GA','GB','GS','UF'];

    if (debug) {
        console.log('(A) Businesses registered with ACRA');
        console.log('(B) Local companies registered with ACRA');
        console.log('(C) All other entities which will be issued new UEN');
    }

    // check that uen is not empty
    if (!uen || String(uen) === '') {
        if (debug) { console.log('UEN is empty'); }
        return [false,'UEN is empty'];
    }

    // check if uen is 9 or 10 digits
    if (uen.length < 9 || uen.length > 10) {
        if (debug) { console.log('UEN is not 9 or 10 digits'); }
        return [false,'UEN is invalid'];
    }

    uen = uen.toUpperCase();
    var uenStrArray = uen.split('');

    // (A) Businesses registered with ACRA
    if (uenStrArray.length === 9) {
        // check that last character is a letter
        if (!isNaN(uenStrArray[uenStrArray.length - 1])) {
            if (debug) { console.log('(A) last character is not an alphabet'); }
            return [false,'UEN is invalid'];
        }

        for (var i = 0; i < uenStrArray.length - 1; i++) {
            // check that first 8 letters are all numbers
            if (isNaN(uenStrArray[i])) {
                if (debug) { console.log('(A) there are non-numbers in 1st to 8th letters'); }
                return [false,'UEN is invalid'];
            }
        }

        // (A) Businesses registered with ACRA (SUCCESS)
        if (debug) { console.log('valid (A) Businesses registered with ACRA'); }
        return [true,'valid'];
    }
    else if (uenStrArray.length === 10) {
        // check that last character is a letter
        if (!isNaN(uenStrArray[uenStrArray.length - 1])) {
            if (debug) { console.log('(B)(C) last character is not an alphabet'); }
            return [false,'UEN is invalid'];
        }

        // (B) Local companies registered with ACRA
        if (!isNaN(uenStrArray[0]) && !isNaN(uenStrArray[1]) && !isNaN(uenStrArray[2]) && !isNaN(uenStrArray[3])) {
            // check that 5th to 9th letters are all numbers
            if (!isNaN(uenStrArray[4]) && !isNaN(uenStrArray[5]) && !isNaN(uenStrArray[6]) &&
                !isNaN(uenStrArray[7]) && !isNaN(uenStrArray[8])) {
                // (B) Local companies registered with ACRA (SUCCESS)
                if (debug) { console.log('valid (B) Local companies registered with ACRA'); }
                return [true,'valid'];
            } else {
                if (debug) { console.log('(B) there are non-numbers in 5th to 9th letters'); }
                return [false,'UEN is invalid'];
            }
        }
        // (C) All other entities which will be issued new UEN
        else {
            // check that 1st letter is either T or S or R
            if (uenStrArray[0] !== 'T' && uenStrArray[0] !== 'S' && uenStrArray[0] !== 'R') {
                if (debug) { console.log('(C) 1st letter is incorrect'); }
                return [false,'UEN is invalid'];
            }

            // check that 2nd and 3rd letters are numbers only
            if (isNaN(uenStrArray[1]) || isNaN(uenStrArray[2])) {
                if (debug) { console.log('(C) 2nd and 3rd letter is incorrect'); }
                return [false,'UEN is invalid'];
            }

            // check that 4th letter is an alphabet
            if (!isNaN(uenStrArray[3])) {
                if (debug) { console.log('(C) 4th letter is not an alphabet'); }
                return [false,'UEN is invalid'];
            }

            // check entity-type indicator
            var entityTypeMatch = false,
                entityType = String(uenStrArray[3]) + String(uenStrArray[4]);
            for (var i = 0; i < entityTypeIndicator.length; i++) {
                if (String(entityTypeIndicator[i]) === String(entityType)) {
                    entityTypeMatch = true;
                }
            }
            if (!entityTypeMatch) {
                if (debug) { console.log('(C) entity-type indicator is invalid'); }
                return [false,'UEN is invalid'];
            }

            // check that 6th to 9th letters are numbers only
            if (isNaN(uenStrArray[5]) || isNaN(uenStrArray[6]) || isNaN(uenStrArray[7]) || isNaN(uenStrArray[8])) {
                if (debug) { console.log('(C) 2nd and 3rd letter is incorrect'); }
                return [false,'UEN is invalid'];
            }
            for (var i = 0; i < ineligible.length; i++) {
                if (String(ineligible[i]) === String(entityType)) {
                	return [false,'This uen is not eligible for this e-invoincing'];
                }
            }
            // (C) All other entities which will be issued new UEN (SUCCESS)
            if (debug) { console.log('valid (C) All other entities which will be issued new UEN'); }
            
            return [true,'valid'];
        }
    }

    return [false,'UEN is invalid'];
}