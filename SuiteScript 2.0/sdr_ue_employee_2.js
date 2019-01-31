/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @returns
 */

// User event run in server side

// define([],		// this can also be used. this can be used for module array 
// define(['N/record', 'N/email'])


define(['N/record'],
// JS Doc Tag		
/**
 * @param {record} record
 */
function(record) {	
    return {    	    	            	
        afterSubmit	:	function(context){
//        	log.debug('Hello World');
        	
        	//get values from current record context
        	//accessing current record on server side
        	
        	var employee = context.newRecord;
//        	var empCode = employee.getValue('custentity_sdr_employee_code');
//        	var supervisorName = employee.getText('supervisor');
//        	var supervisorID = employee.getValue('supervisor');
        	
        	// for setting the value
        	//employee.setValue('custentity_sdr_employee_code', 'Emp0002');
        	
        	//logging to the Script Execution Log
//        	log.debug('Employee Code', empCode);
//        	log.debug('Supervisor ID', supervisorID);
//        	log.debug('Supervisor Name', supervisorName);
        	
        	//we can't access Console log for server side SuiteScript 
        	//console.log('Employee Code ' | empCode | ' Supervisor ID ' | supervisorID | ' Supervisor Name ' | supervisorName)
        	//console.log(empCode);
        	
        	
        	// Module section - Creating a record
        	// Creating a new row (record) to the existing PHONE CALL table from employee form
        	// Check if user is creating a new record
        	
        	if(context.type == context.UserEventType.CREATE){
        		
        		//create phone call record while creating employee record
        		var phoneCall = record.create({
        			type : record.Type.PHONE_CALL,
        			defaultValues : {
        				//using standard version of form by default
        				customform : -150
        			}
        		});
        		
        		phoneCall.setValue('title', 'Call HR for benefits');
        		phoneCall.setValue('assigned', employee.id);
        		
        		phoneCall.save(); 
        		
        		// Create an event record
        		// Create line in sublist
        		
        		var event = record.create({
        			type : record.Type.CALENDAR_EVENT,
        			isDynamic : true
        		});
        		
        		event.setValue('title', 'Welcome meeting with supervisor');
        		
        		// access new line of sublist while creating record - server side
        		event.selectNewLine({
        			sublistId : 'attendee'
        		});
        		
        		event.setCurrentSublistValue({
        			sublistId : 'attendee',
        			fieldId   : 'attendee',
        			value     : employee.id
        		});
        		
        		event.commitLine({
        			sublistId : 'attendee'
        		});
        		
        		//add more attendee (supervisor as attendee) to the meeting
        		// add new row
        		event.selectNewLine({
        			sublistId : 'attendee'
        		});
        		
        		event.setCurrentSublistValue({
        			sublistId : 'attendee',
        			fieldId   : 'attendee',
        			value     : employee.getValue('supervisor')
        		});
        		
        		event.commitLine({
        			sublistId : 'attendee'
        		});
        		
        		event.save();        		        	
        	}
        }
    };    
});
