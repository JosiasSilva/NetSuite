/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search'],

function(search) {
   
    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
    function getInputData() {
    	// invoice search
    	var invSearch = search.create({
    		type : search.type.TRANSACTION,
    		filters : [
    		      ['type', search.Operator.ANY_OF, 'CustInvc'], 'and',
    		      ['mainline', search.Operator.IS, true]
    		           ],
    		           
    		      columns : ['entity', 'total']    	
    	});
    	
    	return invSearch;		// data will be returned in JSON format
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	// access the 'invSearch' result using context object
    		var searchResult = JSON.parse(context.value);
    		
    		var customer = searchResult.values.entity.text;
    		var total = searchResult.values.total;
    		
    		context.write({
    			key : customer,
    			value : total
    		});
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {
    	var total =0;
    	
    	for(var i in context.values){
    		total += parseFloat(context.values[i]);
    	}
    	
    	log.debug('Totals', 'Customer: ' + context.key + '\n' + 
    										'Total: ' + total);
    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {
    	log.audit('Number of queues', summary.concurrency);
    	
    	// will execute only once, while loading the data
    	log.error('Input error', summary.inputSummary.error);
    	
    	// Iterating through each Reduce errors
    	// Things to do for each errors
    	// Same can be done for 'MAP ERROR'
    	summary.reduceSummary.errors.iterators().each(function(code, message){
    		log.error('Reduce Error: ' + code, message);
    		return true;
    	});
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
