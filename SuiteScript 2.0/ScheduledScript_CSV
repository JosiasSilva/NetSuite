/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/file', 'N/record', 'N/log'],
/**
 * @param {file}
 *            file
 * @param {record}
 *            record
 * @param {log}
 *            log
 */
function(file, record, log) {
   
    /**
	 * Definition of the Scheduled script trigger point.
	 * 
	 * @param {Object}
	 *            scriptContext
	 * @param {string}
	 *            scriptContext.type - The context in which the script is
	 *            executed. It is one of the values from the
	 *            scriptContext.InvocationType enum.
	 * @Since 2015.2
	 */
    function execute(context) {
    	// load csv file from file cabinet
    	log.audit('Status', 'into the Scheduled Script, before file reading');
    	
    	// var arrLines = nlapiLoadFile(3124).getValue().split(/\n|\n\r/);
    	
    	var fileCSV = file.load({
    	    id: 'Test/Employees411.csv'
    	});
    	
    	fileCSV.getContents();
    	
// file.load({
// id: 'Images/myImageFile.jpg'
// });
    	
    	
    	log.audit('Status', 'File read complete');
    	log.audit('File length', fileCSV.fileType);
    	log.audit('File Size', fileCSV.size);
    	// loop to get all employees
// for (var i = 1; i < fileCSV.length - 1; i++) {
//    		
// var content = fileCSV[i].split(',');
    	
    	var iterator = fileCSV.lines.iterator();
    	
    	// Skip the first line (CSV header)
        iterator.each(function () {return false;});
        
        log.audit('Row', 'Skipped 1st row');
        
        iterator.each(function (line){                        	
                
        	log.audit('Line', line);
        	var lineValues = line.value.split(',');
        	
        	log.audit('Columns', lineValues[0] +' '+ lineValues[1] + ' ' + lineValues[2] + ' '+ lineValues[3]);
    		// add the columns of the CSV file here
    		var arrName = lineValues[2].split(' '); // first column
    		var phone = lineValues[1]; // second column
    		var email =  lineValues[4];
    		var supervisor = lineValues[5];
    		var subsidiary = lineValues[8];
    		
    		// create new employee using fields from csv
    		//var newEmployee = nlapiCreateRecord('employee', {recordmode:'dynamic'});
    		
    		var newEmployee = record.create({
    			type : record.Type.EMPLOYEE    			
    			});
    		
    		newEmployee.setValue('firstname', arrName[0]);
    		newEmployee.setValue('middlename', arrName[1]);
    		newEmployee.setValue('lastname', arrName[2]);
    		
    		newEmployee.setValue('phone', phone);
    		newEmployee.setValue('email', email);
    		//newEmployee.setValue('supervisor', supervisor);
    		newEmployee.setValue('subsidiary', subsidiary);
    		
    		newEmployee.save();   		
                    // submit record
    		//nlapiSubmitRecord(newEmployee);
    		
    		log.audit('Status', 'Created a new employee record');
    		return true;
    	});
    }

    return {
        execute: execute
    };
    
});
