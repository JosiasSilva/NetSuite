/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/https', 'N/url'],
		/**
		 * @param {runtime} runtime
		 * @param {https} https
		 * @param {url} url
		 */

function(runtime, https, url) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(context) {
    	
    	var employee = context.currentRecord;
    	
    	// Count of all reviews for employees - from sublist
    	// append sublist FIELD Id with 'recmach' preceding to access sublist field
    	// 'check' - allow child record editing, in custom record type for sublist, for accessing sublist record in parent record
    	var perfRevCount = employee.getLineCount({
    		sublistId : 'recmachcustrecord_sdr_perf_subordinate'
    	});
    	
    	var notes = 'This employee has ' + perfRevCount + ' performance reviews\n';
    	
    	var fRatingCount = 0;
    	//get sublist value
    	//for record/list - getSubListText
    	
    	for(var i=0; i<perfRevCount; i++){
    		var ratingCode = employee.getSublistValue({
    			sublistId : 'recmachcustrecord_sdr_perf_subordinate',
    			fieldId : 'custrecord_sdr_perf_rating_code',
    			line : i
    		});
    		
    		if(ratingCode = 'F'){
    			fRatingCount += 1;
    		}
    	}
    	
    	notes += 'This employee has ' + fRatingCount + ' F-rated reviews';
    	alert(notes);
    	
    	// Access field value from script parameter - present in custom preferences
    	var empCode = employee.getValue('custentity_sdr_employee_code');
    	
    	if(!empCode){
    		//references to script object (client or scheduled etc.)
    		
    		var defaultEmpCode = runtime.getCurrentScript().getParameter({
    			name : 'custscript_sdr_default_emp_code'
    		});
    		
    		employee.setValue('custentity_sdr_employee_code', defaultEmpCode);
    	}
    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(context) {
    	//accessing current record on client side
    	var employee = context.currentRecord;
    	
    	if(context.fieldId == 'phone'){
    		var fax = employee.getValue('fax');
    		
    		if(!fax){
    			var phone = employee.getValue('phone');
    			employee.setValue('fax', phone);
    		}
    	}      	
    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {
    	
    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(context) {
    	//set default value for new line - in sublist
    	var employee = context.currentRecord;
    	
    	if(context.sublistId = 'recmachcustrecord_sdr_perf_subordinate'){
    		var reviewType = employee.getCurrentSublistValue({
    			sublistId	:	'recmachcustrecord_sdr_perf_subordinate',
    			fieldId		:	'custrecord_sdr_perf_review_type'
    		});
    		
    		if(!reviewType){
    			employee.setCurrentSublistValue({
    				sublistId	:	'recmachcustrecord_sdr_perf_subordinate',
    				fieldId		:	'custrecord_sdr_perf_review_type',
    				value		:	1	// 1 = Salary Change
    			})
    		}
    	}
    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    // Restrict user from going out of field, if incorrect value is entered.
    // return false from the function, If don't want to execute next event
    function validateField(context) {
    	var employee = context.currentRecord;
    	
    	if(context.fieldId == 'custentity_sdr_employee_code'){
    		var empCode = employee.getValue('custentity_sdr_employee_code');
    		
    		if(empCode == 'x'){
        		alert('Invalid Employee Code');
        		// In Save Record, return boolean to allow or restrict the SAVE process
        		return false;
        	}
    		console.log('EmpCode', empCode);
        	return true;
    	}
    	return true;
    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(context) {
    	var employee = context.currentRecord;
    	
    	if(context.sublistId == 'recmachcustrecord_sdr_perf_subordinate'){
    		var increaseAmount = employee.getCurrentSublistValue({
    			sublistId : 'recmachcustrecord_sdr_perf_subordinate',
    			fieldId : 'custrecord_sdr_perf_sal_incr_amt'
    		});
    		
    		if(increaseAmount > 5000){
    			alert('Salary increase amount can\'t be grater than 5,000');
    			return false;
    		}
    	}    	
    	return true;
    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(context) {
    	var employee = context.currentRecord;
    	var empCode = employee.getValue('custentity_sdr_employee_code');
    	
    	// As url for restlet will change in different environment, access url using url module

    	var restletUrl = url.resolveScript({
    		scriptId	: 'customscript_sdr_rl_validate_emp_code',
    		deploymentId : 'customdeploy_sdr_rl_validate_emp_code'
    	});
    	
    	// RESTLet Call
    	//GET Request
    	//Request Parameter name should match the parameter name from doGet() of RESTLet
    	
    	var response = https.get({
    		// url : '/app/site/hosting/restlet.nl?script=102&deploy=1' + '&sdr_employee_code=' + empCode
    		
    		// Same as above, but it's for getting URL dynamically
    		
    		url : restletUrl + '&sdr_employee_code=' + empCode
    	});
    	
    	// Accessing RESPONSE body
    	
    	if(response.body == 'invalid'){
    		alert('Invalid Employee Code');
    		// In Save Record, return boolean to allow or restrict the SAVE process
    		return false;
    	}
    	return true;
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
//        postSourcing: postSourcing,
//        sublistChanged: sublistChanged,
        lineInit: lineInit,
//        validateField: validateField,
        validateLine: validateLine,
//        validateInsert: validateInsert,
//        validateDelete: validateDelete,
        saveRecord: saveRecord
    };
    
});
