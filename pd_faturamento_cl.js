/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * @author Project Dome - Josias Silva
 * @date: 15/03/2023
 */
define(
    ['N/record', 'N/search', 'N/ui/dialog', 'N/format'],
    function (record, search, dialog, format) {

        function fieldChanged(context) {

            if (context.fieldId == 'custbody_pd_projeto_cliente') {
                var currentRecord = context.currentRecord;
                var fieldName = context.fieldId;
                var idProject = currentRecord.getValue({ fieldId: 'job' });

                if (idProject != "") {
                  var loadProject = r.load({//objRecord
  				   type: r.Type.JOB,
  				   id: idProject,
					});
                    var amountProject = loadProject.getValue('custentity_pd_valor_venda_atualizado');

                    var invoiceSearchObj = search.create({
                        type: "invoice",
                        filters:
                            [
                                ["type", "anyof", "CustInvc"],
                                "AND",
                                ["custbody_pd_projeto_cliente", "anyof", idProject],
                                "AND",
                                ["mainline", "is", "T"]
                            ],
                        columns:
                            [
                                search.createColumn({
                                    name: "amount",
                                    summary: "SUM",
                                    label: "Valor"
                                })
                            ]
                    });

                    var searchResultCount = invoiceSearchObj.runPaged().count;
                    log.debug("invoiceSearchObj result count", searchResultCount);
                    invoiceSearchObj.run().each(function (result) {

                        function parseToValue() {
                            var amountConsumed = result.getValue({ name: 'amount', summary: 'SUM' });
                            return format.parse({ value: amountConsumed, type: format.Type.FLOAT })
                        }
                        var amountConsumedF = parseToValue();
                        var sale = format.format({ value: amountConsumedF, type: format.Type.FLOAT });


                        var updateSale = amountProject - amountConsumedF;
                        var sale = format.format({ value: updateSale, type: format.Type.FLOAT });

                      if(updateSale > 0){
                        dialog.alert({
                            title: 'Saldo',
                            message: 'O saldo atual é de R$ ' + sale + ' !'
                        });
                        } else {
                          dialog.alert({
                          title: 'Saldo',
                            message: 'O saldo do projeto está negativo em R$ ' + sale + ' !'
                            });
                        }

                    });

                }

                return true;
            }
        }

        function saveRecord(context) {
            var currentRecord = context.currentRecord;
            var idProject = currentRecord.getValue({ fieldId: 'job' });
            var amountCurrent = currentRecord.getValue({ fieldId: 'total' });

                if (idProject != "") {
                  var loadProject = r.load({//objRecord
  				   type: r.Type.JOB,
  				   id: idProject,
					});
                    var amountProject = loadProject.getValue('custentity_pd_valor_venda_atualizado');

                    var invoiceSearchObj = search.create({
                        type: "invoice",
                        filters:
                            [
                                ["type", "anyof", "CustInvc"],
                                "AND",
                                ["custbody_pd_projeto_cliente", "anyof", idProject],
                                "AND",
                                ["mainline", "is", "T"]
                            ],
                        columns:
                            [
                                search.createColumn({
                                    name: "amount",
                                    summary: "SUM",
                                    label: "Valor"
                                })
                            ]
                    });

                    var searchResultCount = invoiceSearchObj.runPaged().count;
                    log.debug("invoiceSearchObj result count", searchResultCount);
                    invoiceSearchObj.run().each(function (result) {

                        function parseToValue() {
                            var amountConsumed = result.getValue({ name: 'amount', summary: 'SUM' });
                            return format.parse({ value: amountConsumed, type: format.Type.FLOAT })
                        }
                        var amountConsumedF = parseToValue();
                        var sale = format.format({ value: amountConsumedF, type: format.Type.FLOAT });

                        var updateSale = amountProject - amountConsumedF - amountCurrent;
                        var sale = format.format({ value: updateSale, type: format.Type.FLOAT });

                      if(updateSale > 0){
                        dialog.alert({
                            title: 'Saldo',
                            message: 'O saldo atual é de R$ ' + sale + ' !'
                        });
                        } else {
                          currentRecord.setValue({ fieldId: 'approvalstatus', value: 1 });
                          dialog.alert({
                          title: 'Saldo',
                            message: 'O saldo do projeto está negativo em R$ ' + sale + ' !'
                            });
                        }

                    });

                }
            return true;
        }

        return {
            fieldChanged: fieldChanged,
            saveRecord: saveRecord
        };
    }
);
