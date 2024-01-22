﻿var ctxfolderImpStore = "/views/admin/materialImpStore";
var ctxfolderMessage = "/views/message-box";
var ctxfolderQrCode = "/views/admin/edmsQRCodeManager";
var ctxfolderCommonSetting = "/views/admin/commonSetting";
var app = angular.module('App_ESEIM_IMP_STORE', ['App_ESEIM_DASHBOARD', 'App_ESEIM_MATERIAL_PROD', 'App_ESEIM', "ui.bootstrap", "ngRoute", "ngValidate", "datatables", "datatables.bootstrap", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', "ngJsTree", "treeGrid", "ui.select", "ngCookies", "pascalprecht.translate", 'dynamicNumber', 'ng.jsoneditor', 'monospaced.qrcode'])
    .directive('customOnChange', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeHandler = scope.$eval(attrs.customOnChange);
                element.on('change', onChangeHandler);
                element.on('$destroy', function () {
                    element.off();
                });

            }
        };
    });

app.factory("interceptors", [function () {
    return {
        // if beforeSend is defined call it
        'request': function (request) {
            if (request.beforeSend)
                request.beforeSend();

            return request;
        },
        // if complete is defined call it
        'response': function (response) {
            if (response.config.complete)
                response.config.complete(response);
            return response;
        }
    };
}]);

app.service('myService', function () {
    var data;
    this.setData = function (d) {
        data = d;
    }
    this.getData = function () {
        return data;
    }
});

app.factory('dataserviceImpStore', function ($http) {
    $http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    var headers = {
        "Content-Type": "application/json;odata=verbose",
        "Accept": "application/json;odata=verbose",
    }
    return {
        getUnit: function (data, callback) {
            $http.get('/Admin/MaterialImpStore/GetUnit?impCode=' + data).then(callback);
        },
        getStore: function (callback) {
            $http.post('/Admin/MaterialImpStore/GetStore').then(callback);
        },
        getUser: function (callback) {
            $http.post('/Admin/MaterialImpStore/GetUser').then(callback);
        },
        getSupplier: function (callback) {
            $http.post('/Admin/MaterialImpStore/Getsupplier').then(callback);
        },
        getItem: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/GetItem', data).then(callback);
        },
        insert: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/Insert', data, {
                beforeSend: function () {
                    App.blockUI({
                        target: ".modal-content",
                        boxed: true,
                        message: 'loading...'
                    });
                },
                complete: function () {
                    App.unblockUI(".modal-content");
                }
            }).then(callback);
        },
        update: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/Update', data, {
                beforeSend: function () {
                    App.blockUI({
                        target: ".modal-content",
                        boxed: true,
                        message: 'loading...'
                    });
                },
                complete: function () {
                    App.unblockUI(".modal-content");
                }
            }).then(callback);
        },
        delete: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/Delete', data, {
                beforeSend: function () {
                    App.blockUI({
                        target: ".message-body",
                        boxed: true,
                        message: 'loading...'
                    });
                },
                complete: function () {
                    App.unblockUI(".message-body");
                }
            }).then(callback);
        },

        getListLotProduct: function (callback) {
            $http.post('/Admin/MaterialImpStore/GetListLotProduct').then(callback);
        },
        getListLotProduct4Update: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/GetListLotProduct4Update?lotProductCode=' + data).then(callback);
        },
        getListStore: function (callback) {
            $http.post('/Admin/MaterialImpStore/GetListStore').then(callback);
        },
        getListCustomer: function (callback) {
            $http.post('/Admin/MaterialImpStore/GetListCustomer').then(callback);
        },
        getListUserImport: function (callback) {
            $http.post('/Admin/MaterialImpStore/GetListUserImport').then(callback);
        },
        getListReason: function (callback) {
            $http.post('/Admin/MaterialImpStore/GetListReason').then(callback);
        },
        getListCurrency: function (callback) {
            $http.post('/Admin/MaterialImpStore/GetListCurrency').then(callback);
        },
        getListProduct: function (callback) {
            $http.post('/Admin/MaterialImpStore/GetListProduct').then(callback);
        },
        getListUnit: function (callback) {
            $http.post('/Admin/MaterialImpStore/GetListUnit').then(callback);
        },
        getListPaymentStatus: function (callback) {
            $http.post('/Admin/MaterialImpStore/GetListPaymentStatus').then(callback);
        },
        getLotProduct: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/GetLotProduct?lotProductCode=' + data).then(callback);
        },
        ////lấy giá của 1 sản phẩm
        //getSalePrice: function (data, callback) {
        //    $http.post('/Admin/MaterialImpStore/GetSalePrice?qrCode=' + data).then(callback);
        //},
        //tạo mã QR_Code
        generatorQRCode: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/GeneratorQRCode?code=' + data).then(callback);
        },

        getListLine: function (data, callback) {
            $http.get('/Admin/MaterialImpStore/GetListLine?storeCode=' + data, callback).then(callback);
        },
        getListRackByLineCode: function (data, callback) {
            $http.get('/Admin/MaterialImpStore/GetListRackByLineCode?lineCode=' + data, callback).then(callback);
        },
        getListProductInStore: function (data, callback) {
            $http.get('/Admin/MaterialImpStore/GetListProductInStore?rackCode=' + data, callback).then(callback);
        },
        getQuantityEmptyInRack: function (data, callback) {
            $http.get('/Admin/MaterialImpStore/GetQuantityEmptyInRack?rackCode=' + data, callback).then(callback);
        },
        orderingProductInStore: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/OrderingProductInStore', data, {
                beforeSend: function () {
                    App.blockUI({
                        target: "#modal-body",
                        boxed: true,
                        message: 'loading...'
                    });
                },
                complete: function () {
                    App.unblockUI("#modal-body");
                }
            }).then(callback);
        },
        deleteProductInStore: function (data, callback) {
            $http.get('/Admin/MaterialImpStore/DeleteProductInStore?id=' + data, {
                beforeSend: function () {
                    App.blockUI({
                        target: "#modal-body",
                        boxed: true,
                        message: 'loading...'
                    });
                },
                complete: function () {
                    App.unblockUI("#modal-body");
                }
            }).then(callback);
        },
        checkProductInStore: function (data, callback) {
            $http.get('/Admin/MaterialImpStore/CheckProductInStore?productQrCode=' + data, callback).then(callback);
        },
        checkProductInStoreCoil: function (productQrCode, coilCode, callback) {
            $http.get('/Admin/MaterialImpStore/CheckProductInStoreCoil?productQrCode=' + productQrCode + '&&coilCode=' + coilCode, callback).then(callback);
        },
        checkProductCoilOrderingStore: function (productQrCode, callback) {
            $http.get('/Admin/MaterialImpStore/CheckProductCoilOrderingStore?productQrCode=' + productQrCode, callback).then(callback);
        },
        checkQuantityMaxProductInStore: function (data, callback) {
            $http.get('/Admin/MaterialImpStore/CheckQuantityMaxProductInStore?productQrCode=' + data, callback).then(callback);
        },
        getPositionProduct: function (productQrCode, productCoil, callback) {
            $http.get('/Admin/MaterialImpStore/GetPositionProduct?productQrCode=' + productQrCode + '&&productCoil=' + productCoil, callback).then(callback);
        },
        getProductNotInStore: function (productQrCode, productCoil, callback) {
            $http.get('/Admin/MaterialImpStore/GetProductNotInStore?productQrCode=' + productQrCode + '&&productCoil=' + productCoil, callback).then(callback);
        },
        checkProductInExpTicket: function (data, callback) {
            $http.get('/Admin/MaterialImpStore/CheckProductInExpTicket?productQrCode=' + data, callback).then(callback);
        },
        getUpdateLog: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/GetUpdateLog?ticketCode=' + data).then(callback);
        },

        getListProductRelative: function (callback) {
            $http.post('/Admin/MaterialImpStore/GetListProductRelative').then(callback);
        },

        //Tạo mã ticket code
        createTicketCode: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/CreateTicketCode?type=' + data).then(callback);
        },
        countCoil: function (callback) {
            $http.post('/Admin/MaterialImpStore/CountCoil').then(callback);
        },
        setCoilInStore: function (id, data, callback) {
            $http.get('/Admin/MaterialImpStore/SetCoilInStore?id=' + id + "&&rackCode=" + data).then(callback);
        },
        setCoilInStore: function (id, data, callback) {
            $http.get('/Admin/MaterialImpStore/GetPositionInfo?rackCode=' + data).then(callback);
        },

        getListCoilByProdQrCode: function (ticketCode, productQrCode, callback) {
            $http.get('/Admin/MaterialImpStore/GetListCoilByProdQrCode?ticketCode=' + ticketCode + '&&productQrCode=' + productQrCode).then(callback);
        },
        getListCustomers: function (callback) {
            $http.post('/Admin/Project/GetListCustomers/').then(callback);
        },
        getContractPoBuyer: function (callback) {
            $http.post('/Admin/Project/GetContractPoBuyer/').then(callback);
        },

        //Commonseting reason
        getDataTypeCommon: function (callback) {
            $http.get('/Admin/CommonSetting/GetDataType').then(callback);
        },
        insertCommonSetting: function (data, callback) {
            $http.post('/Admin/CommonSetting/Insert/', data).then(callback);
        },
        updateCommonSetting: function (data, callback) {
            $http.post('/Admin/CommonSetting/Update/', data).then(callback);
        },
        deleteCommonSetting: function (data, callback) {
            $http.post('/Admin/CommonSetting/Delete', data).then(callback);
        },
        getCurrency: function (callback) {
            $http.post('/Admin/CardJob/GetCurrency').then(callback);
        },
        getProductUnit: function (callback) {
            $http.post('/Admin/materialProduct/GetProductUnit/').then(callback);
        },

        //Insert detail
        insertDetail: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/InsertDetail', data).then(callback);
        },
        getProductDetail: function (data, callback) {
            $http.get('/Admin/MaterialImpStore/GetProductDetail?ticketCode=' + data).then(callback);
        },
        deleteDetail: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/DeleteDetail?id=' + data).then(callback);
        },
        getAttrProduct: function (data, callback) {
            $http.get('/Admin/MaterialImpStore/GetAttrProduct?product=' + data).then(callback);
        },
        insertAttrValue: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/InsertAttrValue', data).then(callback);
        },
        getAttrUnit: function (callback) {
            $http.post('/Admin/AttributeManager/GetAttrUnit').then(callback);
        },
        getAttrValue: function (data, data1, callback) {
            $http.get('/Admin/MaterialImpStore/GetAttrValue?ticketCode=' + data + "&product=" + data1).then(callback);
        },
        deleteAttrValue: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/DeleteAttrValue?id=' + data).then(callback);
        },
        getItemAttrValue: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/GetItemAttrValue?id=' + data).then(callback);
        },
        orderProductVatco: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/OrderProductVatco', data).then(callback);
        },
        getPositionProductVatco: function (data, data1, callback) {
            $http.post('/Admin/MaterialImpStore/GetPositionProductVatco?product=' + data + "&ticketCode=" + data1).then(callback);
        },
        deleteOrderProduct: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/DeleteOrderProduct?id=' + data).then(callback);
        },
        getInfoProduct: function (data, data1, callback) {
            $http.get('/Admin/MaterialImpStore/GetInfoProduct?product=' + data + '&ticket=' + data1).then(callback);
        },
        insertDetailByLot: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/InsertDetailByLot', data).then(callback);
        },
        unitFromPack: function (data, callback) {
            $http.get('/Admin/MaterialImpStore/UnitFromPack?json=' + data).then(callback);
        },
        getWorkFlow: function (callback) {
            $http.post('/Admin/PayDecision/GetWorkFlow').then(callback);
        },
        getStepWorkFlow: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/GetStepWorkFlow?code=' + data).then(callback);
        },
        getStatusAct: function (callback) {
            $http.post('/Admin/PayDecision/GetStatusAct').then(callback);
        },
        //Workflow
        createWfInstance: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/CreateWfInstance', data).then(callback)
        },
        insertInstRunning: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/InsertInstRunning?wfInstCode=' + data + '&wfCode=' + data1).then(callback);
        },
        getItemHeaderWithCode: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/GetItemHeaderWithCode?code=' + data).then(callback);
        },
        getActionStatus: function (data, callback) {
            $http.get('/Admin/MaterialImpStore/GetActionStatus?code=' + data).then(callback);
        },
        getItemHeader: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/GetItemHeader?id=' + data).then(callback);
        },
        getListRepeat: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/GetListRepeat?code=' + data).then(callback);
        },
        updateStatusWF: function (data, data1, data2, data3, callback) {
            $http.post('/Admin/WorkflowActivity/UpdateStatusWF?objType=' + data + '&objCode=' + data1 + '&status=' + data2 + '&actRepeat=' + data3).then(callback);
        },

        //Print
        getInfoUserImport: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/GetInfoUserImport?userName=' + data).then(callback);
        },

        //New design
        getTreePack: function (data, data1, callback) {
            $http.post('/Admin/WarehousePackManager/GetTreePack?packType=' + data + '&packLevel=' + data1).then(callback);
        },
        gonvertRecords2Packing: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/ConvertRecords2Packing?packCode=' + data).then(callback);
        },
        getTreeZone: function (callback) {
            $http.post('/Admin/WarehouseZoneManager/GetTreeZone').then(callback);
        },
        getInfoZone: function (data, callback) {
            $http.post('/Admin/WarehouseZoneManager/GetInfoZone?zoneCode=' + data).then(callback);
        },

        getLogStatus: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/GetLogStatus?code=' + data).then(callback);
        },
        checkPermissionEditActivityById: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/CheckPermissionEditActivityById?id=' + data).then(callback);
        },
        getItemActInst: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetItemActInst?id=' + data).then(callback)
        },
        suggestWF: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/SuggestWF?type=' + data).then(callback);
        },
        //New Mapping
        getListWareHouse: function (callback) {
            $http.get('/Admin/EDMSDiagramWarehouse/GetListMappingType?type=AREA').then(callback);
        },
        getListMapping: function (data, callback) {
            $http.get('/Admin/EDMSDiagramWarehouse/GetListMappingFilter?start=' + data).then(callback);
        },

        //Export
        insertFromWord: function (data, callback) {
            $http.post('/Admin/MaterialImpStore/InsertFromWord', data, {
                beforeSend: function () {
                    //App.blockUI({
                    //    target: ".modal-content",
                    //    boxed: true,
                    //    message: 'loading...'
                    //});
                },
                complete: function () {
                    //App.unblockUI(".modal-content");
                }
            }).then(callback);
        },
    }
});

app.controller('Ctrl_ESEIM_IMP_STORE', function ($scope, $rootScope, $compile, $uibModal, $cookies, $translate, dataserviceImpStore) {
    $rootScope.go = function (path) {
        $location.path(path); return false;
    };

    $rootScope.permissionMaterialImpStore = PERMISSION_MaterialImpStore;
    var culture = $cookies.get('_CULTURE') || 'vi-VN';
    $translate.use(culture);
    $rootScope.$on('$translateChangeSuccess', function () {
        caption = caption[culture];
        $.extend($.validator.messages, {
            min: caption.COM_VALIDATE_VALUE_MIN,
        });

        $rootScope.checkData = function (data) {
            var partternCode = /^[a-zA-Z0-9._äöüÄÖÜ]*$/g;
            var mess = { Status: false, Title: "" }
            if (!partternCode.test(data.TicketCode)) {
                mess.Status = true;
                mess.Title = mess.Title.concat(" - ", caption.COM_VALIDATE_ITEM_CODE.replace('{0}', caption.MIS_MSG_CODE), "<br/>");
            }
            return mess;
        }
        $rootScope.validationOptions = {
            rules: {
                ImpCode: {
                    required: true,
                    maxlength: 100
                },
                CreatedTime: {
                    required: true,
                },
                Note: {
                    maxlength: 1000
                },
                Title: {
                    required: true,
                    maxlength: 255
                },
            },
            messages: {
                ImpCode: {
                    required: caption.COM_ERR_REQUIRED.replace("{0}", caption.MIS_CURD_LBL_MIS_CODE),
                    maxlength: caption.COM_ERR_EXCEED_CHARACTERS.replace("{0}", caption.MIS_CURD_LBL_MIS_CODE).replace("{1}", "100")
                },
                CreatedTime: {
                    required: caption.COM_ERR_REQUIRED.replace("{0}", caption.MIS_CURD_LBL_MIS_CREATE),
                },
                Note: {
                    maxlength: caption.COM_ERR_EXCEED_CHARACTERS.replace("{0}", caption.MIS_CURD_LBL_MIS_NOTE).replace("{1}", "1000"),
                },
                Title: {
                    required: caption.COM_ERR_REQUIRED.replace("{0}", caption.MIS_LIST_COL_TITLE_IMPORT),
                    maxlength: "Tiêu đề vượt quá 255 ký tự"
                },
            }
        }
    });
    $rootScope.patternPacking = /^[ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z]*(\sx?\s[1-9]{1}[0-9]* [ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z]*)*$/

    $rootScope.ImpCode = '';
    $rootScope.showListFloor = true;
    $rootScope.showListLine = true;
    $rootScope.showListRack = true;

    $rootScope.listWareHouse = [];
    $rootScope.listFloor = [];
    $rootScope.listLine = [];
    $rootScope.listRack = [];

    $rootScope.wareHouseID = null;
    $rootScope.floorID = null;
    $rootScope.lineID = null;
    $rootScope.rackID = null;

    $rootScope.wareHouseCode = 0;
    $rootScope.floorCode = 0;
    $rootScope.lineCode = 0;
    $rootScope.rackCode = 0;

    $rootScope.positionBox = 'Chưa có vị trí';
    $rootScope.cntBox = null;
    $rootScope.chooseBoxObj = {};

    $rootScope.storeCode = '';

    $rootScope.jsonSpecification = function (str) {
        var A = {
            Key: '',
            Value: ''
        };
        var B = {
            Key: '',
            Value: ''
        };
        var C = {
            Key: '',
            Value: ''
        };
        var D = {
            Key: '',
            Value: ''
        };

        if (str !== undefined && str !== null && str !== '') {
            debugger
            var arr = str.split('x');

            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].trim();
            }

            if (arr[0].split(' ')[0] !== undefined && arr[0].split(' ')[0] !== null)
                //A.Key = arr[0].split(' ')[0];
                A.Key = arr[0];

            if (arr.length >= 2)
                if (arr[1].split(' ')[1] !== undefined && arr[1].split(' ')[1] !== null) {
                    var arrB = arr[1].split(' ');
                    var key = "";
                    for (var i = 1; i < arrB.length; i++) {
                        if (key == "") {
                            key = arrB[i];
                        }
                        else {
                            key += " " + arrB[i];
                        }
                    }

                    B.Key = key;
                    B.Value = arr[1].split(' ')[0];
                }
            if (arr.length >= 3)
                if (arr[2].split(' ')[1] !== undefined && arr[2].split(' ')[1] !== null) {

                    var arrC = arr[2].split(' ');
                    var key = "";
                    for (var i = 1; i < arrC.length; i++) {
                        if (key == "") {
                            key = arrC[i];
                        }
                        else {
                            key += " " + arrC[i];
                        }
                    }

                    C.Key = key;
                    C.Value = arr[2].split(' ')[0];
                }
            if (arr.length >= 4)
                if (arr[3].split(' ')[1] !== undefined && arr[3].split(' ')[1] !== null) {
                    var arrD = arr[3].split(' ');
                    var key = "";
                    for (var i = 1; i < arrD.length; i++) {
                        if (key == "") {
                            key = arrD[i];
                        }
                        else {
                            key += " " + arrD[i];
                        }
                    }

                    D.Key = key;
                    D.Value = arr[3].split(' ')[0];
                }
        }

        var obj = {
            A: A,
            B: B,
            C: C,
            D: D
        };

        return obj;
    }

});

app.config(function ($routeProvider, $validatorProvider, $translateProvider, $httpProvider) {
    $translateProvider.useUrlLoader('/Admin/MaterialImpStore/Translation');
    caption = $translateProvider.translations();
    $routeProvider
        .when('/', {
            templateUrl: ctxfolderImpStore + '/index.html',
            controller: 'index'
        })
        .when('/add', {
            templateUrl: ctxfolderImpStore + '/add.html',
            controller: 'add'
        })
        .when('/edit', {
            templateUrl: ctxfolderImpStore + '/edit.html',
            controller: 'edit'
        })

    $validatorProvider.setDefaults({
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            if (element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else if (element.prop('type') === 'radio' && element.parent('.radio-inline').length) {
                error.insertAfter(element.parent().parent());
            } else if (element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
                error.appendTo(element.parent().parent());
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
        }
    });
    $httpProvider.interceptors.push('interceptors');
});

app.controller('index', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceImpStore, $filter, $window, myService, $location) {
    var vm = $scope;
    $scope.model = {
        Title: '',
        CusCode: '',
        StoreCode: '',
        UserImport: '',
        FromDate: '',
        ToDate: '',
        TimeTicketCreate: '',
        ReasonName: ''
    };
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: $rootScope.permissionMaterialImpStore.LIST,
            beforeSend: function (jqXHR, settings) {
                resetCheckbox();
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.Title = $scope.model.Title;
                d.CusCode = $scope.model.CusCode;
                d.StoreCode = $scope.model.StoreCode;
                d.UserImport = $scope.model.UserImport;
                d.FromDate = $scope.model.FromDate;
                d.ToDate = $scope.model.ToDate;
                d.ReasonName = $scope.model.ReasonName;
            },
            complete: function () {
                App.unblockUI("#contentMain");
                heightTableAuto();
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(pageLength)
        .withOption('order', [0, 'desc'])
        .withOption('serverSide', true)
        .withOption('headerCallback', function (header) {
            if (!$scope.headerCompiled) {
                $scope.headerCompiled = true;
                $compile(angular.element(header).contents())($scope);
            }
        })
        .withOption('initComplete', function (settings, json) {
        })
        .withOption('createdRow', function (row, data, dataIndex) {
            const contextScope = $scope.$new(true);
            contextScope.data = data;
            contextScope.contextMenu = $scope.contextMenu;
            $compile(angular.element(row).contents())($scope);
            $compile(angular.element(row).attr('context-menu', 'contextMenu'))(contextScope);

            $(row).find('td:not(:has(label.mt-checkbox))').on('click', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {
                    $scope.selected[data.Id] = !$scope.selected[data.Id];
                } else {
                    var self = $(this).parent();
                    if ($(self).hasClass('selected')) {
                        $(self).removeClass('selected');
                        $scope.selected[data.Id] = false;
                    } else {
                        $('#tblData').DataTable().$('tr.selected').removeClass('selected');
                        $scope.selected.forEach(function (obj, index) {
                            if ($scope.selected[index])
                                $scope.selected[index] = false;
                        });
                        $(self).addClass('selected');
                        $scope.selected[data.Id] = true;
                    }
                }

                vm.selectAll = false;
                $scope.$apply();
            });
            if ($rootScope.permissionMaterialImpStore.Update) {
                $(row).find('td:not(:has(label.mt-checkbox))').on('dblclick', function (evt) {
                    if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {

                    } else {
                        var Id = data.Id;
                        $scope.edit(Id);
                    }
                });
            }
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle(titleHtml).notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full.Id] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.Id + ']" ng-click="toggleOne(selected)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('QrTicketCode').withTitle('{{"MIS_LIST_COL_MIS_CODE_QR" | translate}}').renderWith(function (data, type, full, meta) {
        return '<qrcode role="button" ng-click="viewQrCode(\'' + full.TicketCode + '\')" data=' + full.TicketCode + ' size="35"></qrcode>'
        //return '<img ng-click="viewQrCode(\'' + full.TicketCode + '\')"  src="../../../images/default/ic_qrcode.png" role="button" class="h-50 w50">';
    }));
    //vm.dtColumns.push(DTColumnBuilder.newColumn('TicketCode').withTitle('{{"MES_LIST_COL_ESTORE_CODE" | translate}}').renderWith(function (data, type, full, meta) {
    //    return data;
    //}));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Title').withTitle('{{"MIS_LIST_COL_MIS_TITLE" | translate }}').renderWith(function (data) {
        return data;
    }));
    //vm.dtColumns.push(DTColumnBuilder.newColumn('CusName').withTitle('{{"MIST_COL_CUSTOMER" | translate }}').renderWith(function (data) {
    //    return data;
    //}));
    vm.dtColumns.push(DTColumnBuilder.newColumn('StoreName').withTitle('{{"MIS_LIST_COL_MIS_NAME_WAREHOUSE" | translate }}').renderWith(function (data) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('UserImportName').withTitle('{{"MIS_LIST_COL_MIS_STAFT_ENTER" | translate }}').renderWith(function (data) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ReasonName').withTitle('{{"MIS_LIST_COL_MIS_REASON" | translate }}').renderWith(function (data) {
        return data;
    }));
    //vm.dtColumns.push(DTColumnBuilder.newColumn('CostTotal').withTitle('{{"MES_LIST_COL_ESTORE_TOTAL_MONEY" | translate }}').renderWith(function (data) {
    //    return data != "" ? $filter('currency')(data, '', 2) : null;
    //}));
    //vm.dtColumns.push(DTColumnBuilder.newColumn('CurrencyName').withTitle('{{"MIT_COL_CURRENCY" | translate }}').renderWith(function (data) {
    //    return data;
    //}));
    //vm.dtColumns.push(DTColumnBuilder.newColumn('Discount').withTitle('{{"MIS_LIST_COL_DISCOUNT" | translate }}').renderWith(function (data) {
    //    return data != "" ? $filter('currency')(data, '', 2) : null;
    //}));
    //vm.dtColumns.push(DTColumnBuilder.newColumn('Commission').withTitle('{{"Hoa hồng" | translate }}').renderWith(function (data) {
    //    return data != "" ? $filter('currency')(data, '', 2) : null;
    //}));
    //vm.dtColumns.push(DTColumnBuilder.newColumn('TaxTotal').withTitle('{{"Thuế" | translate }}').renderWith(function (data) {
    //    return data != "" ? $filter('currency')(data, '', 2) : null;
    //}));
    //vm.dtColumns.push(DTColumnBuilder.newColumn('TotalMustPayment').withTitle('{{"Tổng phải trả" | translate }}').renderWith(function (data) {
    //    return data != "" ? $filter('currency')(data, '', 2) : null;
    //}));
    //vm.dtColumns.push(DTColumnBuilder.newColumn('TotalPayed').withTitle('{{"Tổng đã trả" | translate }}').renderWith(function (data) {
    //    return data != "" ? $filter('currency')(data, '', 2) : null;
    //}));
    //vm.dtColumns.push(DTColumnBuilder.newColumn('NextTimePayment').withTitle('{{"Ngày trả tiếp" | translate }}').renderWith(function (data) {
    //    return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy') : null;
    //}));
    vm.dtColumns.push(DTColumnBuilder.newColumn('TimeTicketCreate').withTitle('{{"MIS_LIST_COL_MIS_DATE_TO_MIS" | translate }}').renderWith(function (data) {
        return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy') : null;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Note').withTitle('{{"MIS_LIST_COL_MIS_NOTE" | translate }}').renderWith(function (data) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').notSortable().withOption('sClass', 'w50 nowrap').withTitle('{{"MIS_LIST_COL_MIS_ACTION" | translate }}').renderWith(function (data, type, full) {
        var listButton = '';
        if ($rootScope.permissionMaterialImpStore.Update) {
            listButton += '<a ng-click="edit(' + full.Id + ')" style = "width: 25px; height: 25px; padding-right: 5px;" class=""><i style="--fa-primary-color: green;" class="fa-solid fa-pen-to-square fs25"></i></a>';
        }
        if ($rootScope.permissionMaterialImpStore.Delete) {
            listButton += '<a title="Xoá" ng-click="delete(' + full.Id + ')" style="width: 25px; height: 25px; padding: 0px;" class=""><i style="--fa-primary-color: red;" class="fa-solid fa-trash  fs25"></i></a>';
        }
        return listButton;
    }));
    vm.reloadData = reloadData;
    vm.dtInstance = {};
    function reloadData(resetPaging) {
        vm.dtInstance.reloadData(callback, resetPaging);
    }
    function callback(json) {

    }
    function toggleAll(selectAll, selectedItems) {
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                selectedItems[id] = selectAll;
            }
        }
    }
    function toggleOne(selectedItems) {
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                if (!selectedItems[id]) {
                    vm.selectAll = false;
                    return;
                }
            }
        }
        vm.selectAll = true;
    }
    function resetCheckbox() {
        $scope.selected = [];
        vm.selectAll = false;
    }

    $scope.initLoad = function () {
        dataserviceImpStore.getListWareHouse(function (rs) {
            rs = rs.data;
            $scope.listStore = rs;
        });
        dataserviceImpStore.getListCustomer(function (rs) {
            rs = rs.data;
            $scope.listCustomer = rs;
        });
        dataserviceImpStore.getListUserImport(function (rs) {
            rs = rs.data;
            $scope.listUserImport = rs;
        });
        dataserviceImpStore.getListReason(function (rs) {
            rs = rs.data;
            $scope.listReason = rs;
        });
    }
    $scope.initLoad();
    $scope.search = function () {
        reloadData(true);
    }
    $scope.reload = function () {
        reloadData(true);
    }
    $rootScope.reloadRoot = function () {
        $scope.reload();
    }
    $scope.reloadNoResetPage = function () {
        reloadData(false);
    };

    $scope.viewQrCode = function (code) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderQrCode + '/qrViewer.html',
            controller: function ($scope, $uibModalInstance) {
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.qrcodeString = code;
                setTimeout(function () {
                    setModalDraggable('.modal-dialog');
                }, 200);
            },
            backdrop: 'static',
            size: '25',
        });
    }

    // view help detail
    $scope.viewCmsDetail = function (helpId) {
        //item, bookMark
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderDashBoard + '/viewItem.html',
            controller: 'viewItemHelp',
            backdrop: 'static',
            windowClass: 'message-avoid-header',
            size: '65',
            resolve: {
                para: function () {
                    return {
                        helpId
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {

        }, function () {
        });
    };


    //$scope.add = function () {
    //    var modalInstance = $uibModal.open({
    //        animation: true,
    //        templateUrl: ctxfolderImpStore + '/add.html',
    //        controller: 'add',
    //        backdrop: 'static',
    //        size: '65',
    //        resolve: {
    //            para: function () {
    //                return '';
    //            }
    //        }
    //    });
    //    modalInstance.result.then(function (d) {
    //        $scope.reload();
    //    }, function () {
    //    });
    //}
    //$scope.edit = function (id) {
    //    var modalInstance = $uibModal.open({
    //        animation: true,
    //        templateUrl: ctxfolderImpStore + '/edit.html',
    //        controller: 'edit',
    //        backdrop: 'static',
    //        size: '65',
    //        resolve: {
    //            para: function () {
    //                return id;
    //            }
    //        }
    //    });
    //    modalInstance.result.then(function (d) {
    //        $scope.reloadNoResetPage();
    //    }, function () { });
    //};

    $scope.add = function () {
        $location.path('/add');
    }

    $scope.edit = function (id) {
        myService.setData(data = id);
        $location.path('/edit');
    }


    $scope.delete = function (id) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = caption.COM_MSG_DELETE_CONFIRM_COM;
                $scope.ok = function () {
                    dataserviceImpStore.delete(id, function (rs) {
                        rs = rs.data;
                        if (rs.Error) {
                            App.toastrError(rs.Title);
                            $uibModalInstance.close();
                        } else {
                            App.toastrSuccess(rs.Title);
                            $uibModalInstance.close();
                        }
                    });
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: '25',
        });
        modalInstance.result.then(function (d) {
            $scope.reloadNoResetPage();
        }, function () {
        });
    }
    $scope.isSearch = false;
    $scope.showSearch = function () {
        if (!$scope.isSearch) {
            $scope.isSearch = true;
        } else {
            $scope.isSearch = false;
        }
    }
    function loadDate() {
        $("#FromTo").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
            $('#DateTo').datepicker('setStartDate', maxDate);
        });
        $("#DateTo").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
            $('#FromTo').datepicker('setEndDate', maxDate);
        });
        $('.end-date').click(function () {
            if ($scope.model.FromDate != undefined && $scope.model.FromDate != '' && $scope.model.FromDate != null) {
                var from = $scope.model.FromDate.split("/");
                var date = new Date(from[2], from[1] - 1, from[0])
                $('#DateTo').datepicker('setStartDate', date);
            }
            $('#FromTo').datepicker('setEndDate', null);
        });
        $('.start-date').click(function () {
            if ($scope.model.ToDate != undefined && $scope.model.ToDate != '' && $scope.model.ToDate != null) {
                var from = $scope.model.ToDate.split("/");
                var date = new Date(from[2], from[1] - 1, from[0])
                $('#FromTo').datepicker('setEndDate', $scope.model.ToDate);
            }
            $('#DateTo').datepicker('setStartDate', null);
        });
    }
    setTimeout(function () {
        loadDate();
    }, 200);
});

app.controller('add', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $filter, dataserviceImpStore, dataserviceMaterial, $window, myService, $location) {
    //Khởi tạo
    $scope.isDisable = false;
    $scope.isNotSave = true;
    $scope.isEdit = false;
    $scope.isDelete = true;
    $scope.isEditCoil = false;

    $scope.modelWf = {
        WorkflowCode: "",
        ObjectType: "IMPORT_STORE",
        ObjectInst: "",
    };

    $scope.IsEnabledImportLot = false;
    $rootScope.IsEnabledImportLot = false;
    $scope.modelDisable = true;
    $scope.model = {
        Title: '',
        StoreCode: '',
        CusCode: '',
        Reason: 'IMP_FROM_BUY',
        StoreCodeSend: '',
        Currency: 'CURRENCY_VND',
        PaymentStatus: '',
        UserImport: '',
        Note: '',
        UserSend: '',
        InsurantTime: '',
        LotProductCode: '',
        TicketCode: '',
        TimeTicketCreate: $filter('date')(new Date(), 'dd/MM/yyyy'),
        ListProduct: [],
        ListCoil: []
    }
    $scope.modelList = {
        Id: '',
        ProductCode: '',
        ProductName: '',
        ProductQrCode: '',
        sProductQrCode: '',
        QuantityOrder: null,
        Quantity: null,
        Unit: '',
        UnitName: '',
        ImpType: '',
        QuantityImp: null,
        IsCustomized: false,
        ProdCustomJson: ''
    };

    $scope.isShowListCoil = true;
    $scope.isShow = true;
    $scope.isODD = true;//Kiểm tra hình thức nhập
    $scope.isInsertCoil = false;
    $scope.isShowDetail = false; //show chi tiết

    $scope.modelUpdate = {};
    $scope.modelUpdateCoil = {};
    $scope.disableProductCode = false;
    $scope.disableProductCoil = false;
    $scope.disableProductRelative = false;
    $scope.disableListCoil = false;

    $scope.disableProductImpType = false;
    $scope.disableValueCoil = false;
    $scope.disableUnitCoil = true;
    $scope.disableQuantityCoil = false;

    $scope.isCoil = true;
    $scope.showCoil = false;
    $scope.allowAddCoil = false;
    $scope.listProductType = [];

    $scope.listProductRelative = [];
    $scope.chooseCoilInStore = false;

    $scope.initLoad = function () {
        $scope.$on('RELOAD_LIST_MATERIAL_IMPORT_DETAIL', function (event, ticketCode) {
            console.log('reload triggered');
            $scope.model.TicketCode = ticketCode;
            dataserviceImpStore.getProductDetail($scope.model.TicketCode, function (rs) {
                rs = rs.data;
                $scope.listProdDetail = rs;
                if ($scope.listProdDetail.length > 0) {
                    $scope.disabledReason = true;
                }
            })
        });
        dataserviceImpStore.getWorkFlow(function (result) {
            result = result.data;
            $rootScope.lstWorkflow = result;
        });
        dataserviceImpStore.getListLotProduct(function (rs) {
            rs = rs.data;
            $scope.listLotProduct = rs;
        });
        //dataserviceImpStore.getListUnit(function (rs) {
        //    rs = rs.data;
        //    $scope.listUnit = rs;
        //});
        dataserviceImpStore.getListWareHouse(function (rs) {
            rs = rs.data;
            $scope.listStore = rs;
            $scope.listStoreSend = rs;
        });
        dataserviceImpStore.getListCustomer(function (rs) {
            rs = rs.data;
            $scope.listCustomer = rs;
        });
        dataserviceImpStore.getListUserImport(function (rs) {
            rs = rs.data;
            $scope.listUserImport = rs;
        });
        dataserviceImpStore.getListReason(function (rs) {
            rs = rs.data;
            $scope.listReason = rs;
        });
        dataserviceImpStore.getListProduct(function (rs) {
            rs = rs.data;
            $scope.listProduct = rs;
        });
        dataserviceImpStore.getListProductRelative(function (rs) {
            rs = rs.data;
            $scope.listProductRelative = rs;
        });
        dataserviceImpStore.getListCustomers(function (rs) {
            rs = rs.data;
            $scope.customers = rs;
        })
        dataserviceImpStore.getContractPoBuyer(function (rs) {
            rs = rs.data;
            $scope.contractPO = rs;
        })
        dataserviceImpStore.getCurrency(function (rs) {
            rs = rs.data;
            $scope.listCurrentcy = rs;
            if ($scope.listCurrentcy.length > 0) {
                $scope.modelList.Currency = $scope.listCurrentcy[0].Code;
            }
        })
        dataserviceImpStore.getProductUnit(function (rs) {
            rs = rs.data;
            $scope.listUnit = rs;
        })

        $scope.errorLotProductCode = false;
        if ($rootScope.IsEnabledImportLot) {
        } else {
            $scope.model.LotProductCode = '';
        };
        dataserviceImpStore.getStatusAct(function (rs) {
            rs = rs.data;
            $scope.lstStatus = rs;
        })

        dataserviceImpStore.suggestWF($scope.modelWf.ObjectType, function (rs) {
            rs = rs.data;
            $scope.model.WorkflowCat = rs;
            setTimeout(function () {
                $rootScope.loadDiagramWF($scope.model.WorkflowCat);
            }, 400)
        })
    }
    $scope.initLoad();
    $scope.initLoadTicketCode = function () {
        var type = "ODD";
        if ($rootScope.IsEnabledImportLot) {
            type = "PO";
        }
        dataserviceImpStore.createTicketCode(type, function (rs) {
            rs = rs.data;
            $scope.model.TicketCode = rs.Object;
            createCoilCode("", "", "");
        });
    }
    $scope.initLoadTicketCode();

    $scope.changeStatus = function () {
        if ($scope.model.Status != undefined && $scope.model.Status != null && $scope.model.Status != '') {
            $scope.errorStatus = false;
        }
        if ($scope.model.Status == "REPEAT_REQUIRE_REWORK" || $scope.model.Status == "FINAL_REQUIRE_REWORK") {
            dataserviceImpStore.getListRepeat($scope.model.TicketCode, function (rs) {
                rs = rs.data;
                var arr = [];
                if (rs.list != undefined && rs.list != null && rs.list != "") {
                    for (var i = 0; i < rs.list.length; i++) {
                        if (rs.list[i].IntsCode == rs.current) {
                            for (var j = 0; j < i; j++) {
                                arr.push(rs.list[j]);
                            }
                        }
                    }
                    $scope.lstActRepeat = arr;
                    $scope.showAct = true;
                }
            })
        }
        else {
            $scope.showAct = false;
        }
    }

    $rootScope.refeshData = function (id) {
        dataserviceImpStore.getItem(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                $scope.model = rs.Object.Header;
                $scope.model.ListProduct = rs.Object.ListProduct;
                $scope.model.ListCoil = [];
                for (var i = 0; i < $scope.model.ListProduct.length; i++) {
                    if ($scope.model.ListProduct[i].ListCoil.length > 0) {
                        for (var j = 0; j < $scope.model.ListProduct[i].ListCoil.length; j++) {
                            $scope.model.ListProduct[i].ListCoil[j].ValueCoil = $scope.model.ListProduct[i].ListCoil[j].Size;

                            var productCoil = $scope.model.ListProduct[i].ListCoil[j].ProductCoil;
                            $scope.model.ListProduct[i].ListCoil[j].RuleCoil = productCoil.split("_")[productCoil.split("_").length - 2];
                        }
                    }
                    $scope.model.ListProduct[i].sQuantityCoil = $scope.model.ListProduct[i].ListCoil.length;
                    $scope.model.ListProduct[i].QuantityOrder = $scope.model.ListProduct[i].Quantity - $scope.model.ListProduct[i].QuantityIsSet;
                }
                $rootScope.storeCode = $scope.model.StoreCode;
                if ($scope.model.LotProductCode != '') {
                    $scope.IsEnabledImportLot = true;
                    $rootScope.IsEnabledImportLot = true;

                    dataserviceImpStore.getListLotProduct4Update($scope.model.LotProductCode, function (rs) {
                        rs = rs.data;
                        $scope.listLotProduct = rs;
                    });
                }
                else {
                    dataserviceImpStore.getListLotProduct(function (rs) {
                        rs = rs.data;
                        $scope.listLotProduct = rs;
                    });
                }

                createCoilCode("", "", "");
            }
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        $rootScope.reloadRoot();
    }
    $scope.changeWorkFlowInts = function (a) {
        if ($scope.model.WorkflowCat != undefined && $scope.model.WorkflowCat != null && $scope.model.WorkflowCat != '') {
            $scope.errorWorkflowCat = false;
        }
        dataserviceImpStore.getStepWorkFlow(a, function (rs) {
            data = rs.data;
            $scope.lstStep = data.list;
            setTimeout(function () {
                $('#progressbar li').css('width', 'calc(100%/' + data.list.length + ')');
            }, 10);
        })
    }
    $scope.checkedImportLot = function (chk) {
        //$scope.initLoad();
        $rootScope.IsEnabledImportLot = chk;
        $scope.errorLotProductCode = false;
        var type = "ODD";
        if ($rootScope.IsEnabledImportLot) {
            type = "PO";
        } else {
            $scope.model.LotProductCode = '';
            $scope.model.ListProduct = [];
        };

        dataserviceImpStore.createTicketCode(type, function (rs) {
            rs = rs.data;
            $scope.model.TicketCode = rs.Object;
        });
    }
    $scope.add = function () {
        if ($scope.isNotSave) {
            App.toastrError(caption.MIST_VALIDATE_SAVE_ADD_PRODUCT);
            return;
        }

        var msg = validationProduct($scope.modelList);
        if (msg.Status) {
            return;
        }
        if ($scope.model.ListCoil.length == 0) {
            App.toastrError(caption.MIST_VALIDATE_ROLL_BOX_BLANK);
            return;
        }
        //Check null
        if ($scope.modelList.ProductCode == undefined || $scope.modelList.ProductCode == null || $scope.modelList.ProductCode == '' ||
            $scope.modelList.SalePrice == undefined || $scope.modelList.SalePrice == null) {
            App.toastrError(caption.MIST_VALIDATE_REQUIRE_INFORMATION);
        }
        else {
            var indexCheck = -1;
            var elementCheck = $scope.model.ListProduct.find(function (element) {
                if (element.ProductCode == $scope.modelList.ProductCode && element.ProductType == $scope.modelList.ProductType && element.ProductCoil == $scope.modelList.ProductCoil) {
                    indexCheck = 0;
                    return element;
                }
            });
            if (indexCheck > -1) {
                App.toastrError(caption.MES_MSG_PRODUCT_ADD_CATEGORY);
            }
            else {
                createProductQrCode();
                var addItem = {
                    ProductCode: $scope.modelList.ProductCode,
                    ProductName: $scope.modelList.ProductName,
                    ProductType: $scope.modelList.ProductType,
                    ProductQrCode: $scope.modelList.ProductQrCode,
                    sProductQrCode: $scope.modelList.sProductQrCode,
                    Quantity: $scope.modelList.Quantity,
                    Unit: $scope.modelList.Unit,
                    UnitName: $scope.modelList.UnitName,

                    SalePrice: $scope.modelList.SalePrice,

                    QuantityIsSet: 0,
                    QuantityNeedSet: $scope.modelList.Quantity,
                    QuantityOrder: $scope.modelList.Quantity,

                    ProductCoil: $scope.modelList.ProductCoil,
                    sProductCoil: $scope.modelList.sProductCoil,
                    ProductLot: $scope.modelList.ProductLot,
                    ImpType: $scope.modelList.ImpType,
                    ProductCoilRelative: $scope.modelList.ProductCoilRelative,
                    ////Tính toán
                    Total: $scope.modelList.Quantity * $scope.modelList.SalePrice,
                    ListCoil: $scope.model.ListCoil,
                    QuantityCoil: $scope.model.ListCoil.length,
                    sQuantityCoil: $scope.model.ListCoil.length,
                };
                $scope.model.ListProduct.push(addItem);
                App.toastrSuccess(caption.COM_ADD_SUCCESS);
                $scope.model.ListCoil = [];
            }
        }
    }
    $scope.addCoil = function () {
        if ($scope.isNotSave) {
            App.toastrError(caption.MIST_VALIDATE_SAVE_ADD_ROLL_BOX);
            return;
        }
        //Check null
        if ($scope.modelList.ValueCoil == undefined || $scope.modelList.ValueCoil == null || $scope.modelList.ValueCoil == '' ||
            $scope.modelList.QuantityCoil == undefined || $scope.modelList.QuantityCoil == null || $scope.modelList.QuantityCoil == ''
            || $scope.modelList.RuleCoil == undefined || $scope.modelList.RuleCoil == null || $scope.modelList.RuleCoil == ''
            || $scope.modelList.ProductLot == undefined || $scope.modelList.ProductLot == null || $scope.modelList.ProductLot == ''
        ) {
            App.toastrError(caption.MIST_VALIDATE_REQUIRE_INFORMATION);
            $scope.isInsertCoil = false;
            return;
        }
        else {
            $scope.modelList.QuantityCoil = parseInt($scope.modelList.QuantityCoil);
            if ($scope.modelList.QuantityCoil > 100) {
                App.toastrError(caption.MIST_VALIDATE_ADD_LIMIT100);
                return;
            }

            createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.RuleCoil);

            var quantityAdd = $scope.modelList.QuantityCoil;
            for (var i = 0; i < quantityAdd; i++) {
                var addItem = {
                    ProductCode: $scope.modelList.ProductCode,
                    ProductName: $scope.modelList.ProductName,
                    ProductType: $scope.modelList.ProductType,
                    ProductQrCode: $scope.modelList.ProductQrCode,
                    //sProductQrCode: $scope.modelList.sProductQrCode,
                    Quantity: $scope.modelList.Quantity,
                    Unit: $scope.modelList.Unit,
                    UnitName: $scope.modelList.UnitName,

                    SalePrice: $scope.modelList.SalePrice,

                    QuantityIsSet: 0,
                    QuantityNeedSet: $scope.modelList.QuantityNeedSet,

                    ProductCoil: $scope.modelList.ProductCoil,
                    sProductCoil: $scope.modelList.sProductCoil,
                    ProductLot: $scope.modelList.ProductLot,
                    ImpType: $scope.modelList.ImpType,
                    ProductImpType: $scope.modelList.ProductImpType,
                    ValueCoil: $scope.modelList.ValueCoil,
                    UnitCoil: $scope.modelList.UnitCoil,
                    QuantityCoil: $scope.modelList.QuantityCoil,
                    RuleCoil: $scope.modelList.RuleCoil,
                    ProductCoilRelative: $scope.modelList.ProductCoilRelative,
                    IsOrder: false,
                };
                $scope.model.ListCoil.push(addItem);
                $scope.isInsertCoil = true;
            }

            if ($scope.isInsertCoil) {
                App.toastrSuccess(caption.MIST_BTN_SAVE_INFORMATION);
            }

            //Cập nhật lại giá trị ở trên
            $scope.modelList.Quantity = 0;
            for (var i = 0; i < $scope.model.ListCoil.length; i++) {
                $scope.modelList.Quantity = $scope.modelList.Quantity + parseFloat($scope.model.ListCoil[i].ValueCoil);
            }
        }
    }

    //Vatco: import from Excel
    $scope.importWord = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderImpStore + '/word.html',
            controller: 'word',
            backdrop: 'static',
            size: '80',
            resolve: {
                para: function () {
                    return {
                        TicketCode: $scope.model.TicketCode,
                        //PortType: $scope.model.PortType
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    }

    //Vatco: new detail product
    $scope.addDetail = function () {
        if ($scope.isNotSave) {
            App.toastrError(caption.MIS_MSG_ADD_IMP_TICKET_FIRST);
            return;
        }

        var msg = validationProduct($scope.modelList);
        if (msg.Status) {
            return;
        }
        if ($scope.packing == "" || $scope.packing == null || $scope.packing == undefined) {
            return App.toastrError(caption.MIS_MSG_PLS_ENTER_PACKING_FOR_PROD);
        }
        //Tạo QrCode cho sản phẩm
        createProductQrCode();
        var addItem = {
            ProductCode: $scope.modelList.ProductCode,
            ProductType: $scope.modelList.ProductType,
            ProductQrCode: $scope.modelList.ProductQrCode,
            sProductQrCode: $scope.modelList.sProductQrCode,
            Quantity: $scope.modelList.QuantityImp,
            Unit: $scope.modelList.Unit,
            SalePrice: $scope.modelList.SalePrice,
            Currency: $scope.modelList.Currency,
            TicketCode: $scope.model.TicketCode,
            StoreCode: $scope.model.StoreCode,
            PackType: $scope.modelList.PackType,
            IsCustomized: $scope.modelList.IsCustomized,
            ProdCustomJson: $scope.modelList.ProdCustomJson
        };
        dataserviceImpStore.insertDetail(addItem, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataserviceImpStore.getProductDetail($scope.model.TicketCode, function (rs) {
                    rs = rs.data;
                    $scope.listProdDetail = rs;
                    if ($scope.listProdDetail.length > 0) {
                        $scope.disabledReason = true;
                    }

                })
            }
        })
    }
    $scope.deleteDetail = function (id) {
        dataserviceImpStore.deleteDetail(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataserviceImpStore.getProductDetail($scope.model.TicketCode, function (rs) {
                    rs = rs.data;
                    $scope.listProdDetail = rs;
                    if ($scope.listProdDetail.length == 0) {
                        $scope.disabledReason = false;
                    }
                })
            }
        })
    }

    $scope.editProd = function () {
        if ($scope.modelList.ProductCode == null || $scope.modelList.ProductCode == "" || $scope.modelList.ProductCode == undefined) {
            App.toastrError(caption.MIS_VALIDATE_CHOOSE_PRODUCT);
            return;
        }
        var id = $scope.modelList.Id;
        dataserviceMaterial.getItem(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                var object = rs;
                $rootScope.ProductID = $scope.modelList.Id;
                $rootScope.ProductCode = $scope.modelList.ProductCode;
                $rootScope.ObjCode = $scope.modelList.ProductCode;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: ctxfolderMaterialProd + '/edit.html',
                    controller: 'editProdCustom',
                    backdrop: 'static',
                    size: '65',
                    resolve: {
                        para: function () {
                            return object;
                        }
                    }
                });
                modalInstance.result.then(function (d) {
                    console.log(d);
                    if (Object.keys(d).length === 0) {
                        console.log('no update');
                    }
                    else {
                        $scope.modelList.ProdCustomJson = JSON.stringify(d, null, 2);
                        $scope.modelList.IsCustomized = true;
                    }
                    //$scope.reloadNoResetPage();
                }, function () {
                    console.log('exit');
                });
            }
        });
    }
    $scope.viewProdCustom = function (index) {
        //if ($scope.modelList.ProductCode == null || $scope.modelList.ProductCode == "" || $scope.modelList.ProductCode == undefined) {
        //    App.toastrError(caption.MIS_VALIDATE_CHOOSE_PRODUCT);
        //    return;
        //}
        var item = $scope.listProdDetail[index];
        if (item != null) {
            var id = item.IdProduct;
        }
        else {
            return App.toastrError(caption.MIST_ADD_PRODUCT_SAVE_BEFORE_SORT);
        }
        dataserviceMaterial.getItem(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                var object = rs;
                $rootScope.ProductID = $scope.modelList.Id;
                $rootScope.ProductCode = $scope.modelList.ProductCode;
                $rootScope.ObjCode = $scope.modelList.ProductCode;
                object.ProdCustomJson = item.ProdCustomJson;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: ctxfolderMaterialProd + '/edit.html',
                    controller: 'viewProdCustom',
                    backdrop: 'static',
                    size: '65',
                    resolve: {
                        para: function () {
                            return object;
                        }
                    }
                });
                modalInstance.result.then(function (d) {
                    console.log(d);
                    if (Object.keys(d).length === 0) {
                        console.log('no update');
                    }
                    else {
                        $scope.modelList.ProdCustomJson = JSON.stringify(d, null, 2);
                        $scope.modelList.IsCustomized = true;
                    }
                    //$scope.reloadNoResetPage();
                }, function () {
                    console.log('exit');
                });
            }
        });
    }

    $scope.attrValue = function () {
        if ($scope.isNotSave) {
            App.toastrError(caption.MIST_VALIDATE_SAVE_ADD_PRODUCT);
            return;
        }

        if ($scope.modelList.ProductCode == null || $scope.modelList.ProductCode == "" || $scope.modelList.ProductCode == undefined) {
            App.toastrError(caption.MIS_VALIDATE_CHOOSE_PRODUCT);
            return;
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderImpStore + '/ticket-imp-attr-value.html',
            controller: 'ticket-imp-attr-value',
            backdrop: 'static',
            size: '65',
            resolve: {
                para: function () {
                    return {
                        TicketCode: $scope.model.TicketCode,
                        ProductCode: $scope.modelList.ProductCode
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataserviceImpStore.getListProduct(function (rs) {
                rs = rs.data;
                $scope.listProduct = rs;
                dataserviceImpStore.getInfoProduct($scope.modelList.ProductCode, $scope.model.TicketCode, function (rs) {
                    rs = rs.data;
                    $scope.long = rs.Long;
                    $scope.high = rs.High;
                    $scope.wide = rs.Wide;
                    $scope.weight = rs.Weight;
                    $scope.weight = rs.Weight;
                    $scope.packing = rs.Packing;
                    $scope.unitWeight = rs.UnitWeight;
                    $scope.modelList.PackType = rs.Packing;
                    var jsonPacking = JSON.stringify($rootScope.jsonSpecification($scope.packing));
                    dataserviceImpStore.unitFromPack(jsonPacking, function (rs) {
                        rs = rs.data;
                        $scope.listUnit = rs.Object;
                        try {
                            if ($scope.listUnit.length == 0) {
                                dataserviceImpStore.getProductUnit(function (rs) {
                                    rs = rs.data;
                                    $scope.listUnit = rs;
                                })
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        $scope.modelList.Unit = '';
                    })
                })
            });
        }, function () { });
    }
    $scope.changeProduct = function () {
        if ($scope.modelList.ProductCode != "" && $scope.modelList.ProductCode != null && $scope.modelList.ProductCode != undefined) {
            var product = $scope.listProduct.find(function (element) {
                if (element.Code == $scope.modelList.ProductCode) return true;
            });
            $scope.modelList.Unit = '';
            $scope.modelList.ProductType = product.ProductType;
            $scope.modelList.Id = product.Id;
            dataserviceImpStore.getInfoProduct($scope.modelList.ProductCode, $scope.model.TicketCode, function (rs) {
                rs = rs.data;
                $scope.long = rs.Long;
                $scope.high = rs.High;
                $scope.wide = rs.Wide;
                $scope.weight = rs.Weight;
                $scope.packing = rs.Packing;
                $scope.unitWeight = rs.UnitWeight;
                $scope.modelList.PackType = rs.Packing;
                if ($scope.packing == "" || $scope.packing == null || $scope.packing == undefined) {
                    $scope.modelList.ProductCode = "";
                    return App.toastrError(caption.MIS_MSG_PLS_ENTER_PACKING_FOR_PROD);
                }
                var jsonPacking = JSON.stringify($rootScope.jsonSpecification($scope.packing));
                dataserviceImpStore.unitFromPack(jsonPacking, function (rs) {
                    rs = rs.data;
                    $scope.listUnit = rs.Object;
                    try {
                        if ($scope.listUnit.length == 0) {
                            dataserviceImpStore.getProductUnit(function (rs) {
                                rs = rs.data;
                                $scope.listUnit = rs;
                            })
                        }
                    } catch (e) {
                        console.log(e);
                    }
                })
            })
        }
    }

    //Vatco: new order product warehouser
    $scope.orderProductVatCo = function (index) {
        var item = $scope.listProdDetail[index];
        if (item != null) {
            dataserviceImpStore.checkProductInStore(item.ProductQRCode, function (rs) {
                rs = rs.data;
                if (rs) {
                    var getStore = $scope.listStore.find(function (element) {
                        if (element.Code == $scope.model.StoreCode) return true;
                    });
                    var objPara = {
                        item: item,
                        rootId: $rootScope.rootId,
                        productName: item.ProductName,
                        productCoil: '',
                        storeName: getStore ? getStore.Name : ''
                    }
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: ctxfolderImpStore + '/orderProduct.html',
                        controller: 'orderProduct',
                        backdrop: 'static',
                        size: '60',
                        resolve: {
                            para: function () {
                                return {
                                    objPara
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (id) {
                        $scope.initLoad();
                        dataserviceImpStore.getProductDetail($scope.model.TicketCode, function (rs) {
                            rs = rs.data;
                            $scope.listProdDetail = rs;
                        })
                    }, function () {
                    });
                } else {
                    App.toastrError(caption.MIS_MSG_PRODUCT_NON_ADD_REQUEST_CHOSE_ADD);
                }
            });
        } else {
            App.toastrError(caption.MIST_ADD_PRODUCT_SAVE_BEFORE_SORT);
        }
    }

    $scope.editCoil = function (item, index) {
        $scope.modelUpdateCoil = item;
    }
    $scope.saveCoil = function () {
        //Check null
        if ($scope.modelList.ValueCoil == undefined || $scope.modelList.ValueCoil == null || $scope.modelList.ValueCoil == '' ||
            $scope.modelList.QuantityCoil == undefined || $scope.modelList.QuantityCoil == null || $scope.modelList.QuantityCoil == ''
            || $scope.modelList.RuleCoil == undefined || $scope.modelList.RuleCoil == null || $scope.modelList.RuleCoil == ''
            || $scope.modelList.ProductLot == undefined || $scope.modelList.ProductLot == null || $scope.modelList.ProductLot == ''
        ) {
            App.toastrError(caption.MIST_VALIDATE_REQUIRE_INFORMATION);
            return;
        }
        else {
            $scope.model.ListCoil = [];

            createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.RuleCoil);

            var quantityAdd = $scope.modelList.QuantityCoil;
            $scope.modelList.Quantity = $scope.modelList.Quantity;
            for (var i = 0; i < quantityAdd; i++) {

                var addItem = {
                    ProductCode: $scope.modelList.ProductCode,
                    ProductName: $scope.modelList.ProductName,
                    ProductType: $scope.modelList.ProductType,
                    ProductQrCode: $scope.modelList.ProductQrCode,
                    Quantity: $scope.modelList.Quantity,
                    Unit: $scope.modelList.Unit,
                    UnitName: $scope.modelList.UnitName,

                    SalePrice: $scope.modelList.SalePrice,

                    QuantityIsSet: 0,
                    QuantityNeedSet: $scope.modelList.QuantityNeedSet,
                    ProductCoil: $scope.modelList.ProductCoil,
                    sProductCoil: $scope.modelList.sProductCoil,
                    ProductLot: $scope.modelList.ProductLot,
                    ImpType: $scope.modelList.ImpType,
                    ProductImpType: $scope.modelList.ProductImpType,
                    ValueCoil: $scope.modelList.ValueCoil,
                    UnitCoil: $scope.modelList.UnitCoil,
                    QuantityCoil: $scope.modelList.QuantityCoil,
                    RuleCoil: $scope.modelList.RuleCoil,
                    ProductCoilRelative: $scope.modelList.ProductCoilRelative,
                };
                $scope.model.ListCoil.push(addItem);
            }
        }
    }
    $scope.editItem = function (item, index) {
        $scope.disableProductCode = true;
        $scope.modelUpdate = item;
        $scope.isEdit = true;
        $scope.isEditCoil = true;

        //if (item.ImpType != null && item.ImpType != '' && item.ImpType != undefined) {
        //    var listUnit = item.ImpType.split(',');
        //    if (listUnit.length == 1) {
        //        $scope.isDelete = false;
        //    } else if (listUnit.length > 1) {
        //        $scope.isDelete = true;
        //    }
        //}

        $scope.modelList.ProductCode = item.ProductCode;
        $scope.modelList.ProductType = item.ProductType;
        $scope.modelList.ProductName = item.ProductName;
        //$scope.modelList.ProductQrCode = item.ProductQrCode;
        //$scope.modelList.sProductQrCode = item.sProductQrCode;
        $scope.modelList.Quantity = item.Quantity;
        $scope.modelList.Unit = item.Unit;
        $scope.modelList.UnitName = item.UnitName;
        $scope.modelList.ProductLot = item.ProductLot;
        $scope.modelList.SalePrice = item.SalePrice;
        $scope.modelList.ImpType = item.ImpType;
        //$scope.modelList.PackType = packType;
        $scope.modelList.ProductCoilRelative = item.ProductCoilRelative;
        $scope.model.ListCoil = item.ListCoil;

        var quantityCoil = 0;
        for (var i = 0; i < $scope.model.ListCoil.length; i++) {
            quantityCoil = quantityCoil + $scope.model.ListCoil[i].ValueCoil;
        }
        $scope.modelList.Quantity = quantityCoil;

        if (item.ImpType != '' && item.ImpType != null && item.ImpType != undefined) {
            $scope.listProductType = item.ImpType.split(",");
            if ($scope.listProductType.length > 0) {
                $scope.showCoil = true;
                $scope.modelList.UnitCoil = $scope.listProductType[$scope.listProductType.length - 1];
                if ($scope.listProductType.length == 1) {
                    $scope.disableProductImpType = true;
                    $scope.disableValueCoil = true;
                    $scope.disableUnitCoil = true;
                    //$scope.disableQuantityCoil = true;
                    //$scope.isODD = true;
                    //$scope.isDelete = false;

                    $scope.modelList.ProductImpType = $scope.modelList.UnitCoil;
                    $scope.modelList.ValueCoil = 1;
                    $scope.modelList.QuantityCoil = item.Quantity;
                    $scope.modelList.RuleCoil = 1;
                    $scope.modelList.ProductLot = 1;
                    //if ($scope.model.ListCoil.length == 0)
                    //    $scope.addCoil();
                } else {
                    //$scope.isODD = false;
                    $scope.isDelete = true;
                    $scope.disableProductImpType = false;
                    $scope.disableValueCoil = false;
                    $scope.disableUnitCoil = true;
                    $scope.disableQuantityCoil = false;

                    $scope.modelList.ProductImpType = '';
                    $scope.modelList.ValueCoil = '';
                    $scope.modelList.QuantityCoil = '';
                    $scope.modelList.RuleCoil = '';
                    $scope.modelList.ProductLot = '';
                }
            } else {
                //$scope.isODD = false;
                $scope.showCoil = false;
                //$scope.isDelete = false;
            }
        } else {
            App.toastrError(caption.MIST_VALIDATE_IN_PRODUCT_TYPE);
        }

        $scope.disableFiled(item.ImpType);
    }
    $scope.save = function () {
        if ($scope.model.ListCoil.length == 0) {
            App.toastrError(caption.MIST_VALIDATE_ROLL_BOX_BLANK);
            return;
        }

        $scope.disableProductCode = false;
        $scope.isEditCoil = false;

        $scope.modelUpdate.ProductCode = $scope.modelList.ProductCode;
        $scope.modelUpdate.ProductType = $scope.modelList.ProductType;
        $scope.modelUpdate.ProductName = $scope.modelList.ProductName;
        //$scope.modelUpdate.ProductQrCode = $scope.modelList.ProductQrCode;
        //$scope.modelUpdate.sProductQrCode = $scope.modelList.sProductQrCode;
        $scope.modelUpdate.Quantity = $scope.modelList.Quantity;
        $scope.modelUpdate.Unit = $scope.modelList.Unit;
        $scope.modelUpdate.UnitName = $scope.modelList.UnitName;
        $scope.modelUpdate.ProductLot = $scope.modelList.ProductLot;
        $scope.modelUpdate.SalePrice = $scope.modelList.SalePrice;
        $scope.modelUpdate.ImpType = $scope.modelList.ImpType;
        $scope.modelUpdate.ProductCoilRelative = $scope.modelList.ProductCoilRelative;
        $scope.modelUpdate.ListCoil = $scope.model.ListCoil;
        $scope.modelUpdate.QuantityCoil = $scope.model.ListCoil.length;
        $scope.modelUpdate.sQuantityCoil = $scope.model.ListCoil.length;
        $scope.modelUpdate.QuantityImp = $scope.modelList.QuantityImp;
        $scope.modelUpdate.CusCode = $scope.modelList.CusCode;
        $scope.modelUpdate.PoSupCode = $scope.modelList.PoSuppCode;
        $scope.modelUpdate.Section = $scope.modelList.Section;
        App.toastrSuccess(caption.COM_UPDATE_SUCCESS);
        $scope.model.ListCoil = [];

        dataserviceImpStore.update($scope.model, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                $rootScope.refeshData($rootScope.rootId);
                App.toastrSuccess(caption.COM_UPDATE_SUCCESS);
            }
        });
    }

    $scope.removeItem = function (item, index) {
        if (item.QuantityIsSet > 0) {
            App.toastrError(caption.MIST_SORT_PRODUCT_CANNOT_DELETE);
        }
        else {
            dataserviceImpStore.checkProductInExpTicket(item.ProductQrCode, function (rs) {
                rs = rs.data;
                if (!rs.Error) {
                    //Lấy lại giá trị model vừa xóa đưa lên chỗ add
                    $scope.modelList.ProductCode = item.ProductCode;
                    $scope.modelList.ProductType = item.ProductType;
                    $scope.modelList.ProductName = item.ProductName;
                    $scope.modelList.ProductQrCode = item.ProductQrCode;
                    $scope.modelList.sProductQrCode = item.sProductQrCode;
                    $scope.modelList.Quantity = item.Quantity;
                    $scope.modelList.Unit = item.Unit;
                    $scope.modelList.UnitName = item.UnitName;
                    $scope.modelList.SalePrice = item.SalePrice;
                    $scope.modelList.ProductLot = item.ProductLot;

                    //Check xem đã có trong list chưa
                    $scope.model.ListProduct.splice(index, 1);
                    App.toastrSuccess(caption.COM_DELETE_SUCCESS);
                } else {
                    App.toastrError(rs.Title);
                }
            });
        }
    }
    $scope.removeCoil = function (item) {
        if (item.IsOrder) {
            App.toastrError(caption.MIST_SORT_CANNOT_DELETE);
        } else {
            var index = $scope.model.ListCoil.indexOf(item);
            if (index < -1) {
                App.toastrError(caption.MIST_NOT_FOUND_DEL_PRODUCT);
                return;
            }
            $scope.model.ListCoil.splice(index, 1);
            $scope.modelList.Quantity = 0;
            for (var i = 0; i < $scope.model.ListCoil.length; i++) {
                $scope.modelList.Quantity = $scope.modelList.Quantity + (parseFloat(item.ValueCoil));
            }
            App.toastrSuccess(caption.MIST_BTN_SAVE_INFORMATION);
        }
    }
    $scope.changleSelect = function (SelectType, item) {
        //Hàm chọn 1 lô để nhập
        if (SelectType == "LotProductCode") {
            $rootScope.LotProductCode = item.Code;
            $scope.model.Reason = 'IMP_FROM_BUY';
            $scope.model.StoreCodeSend = '';

            dataserviceImpStore.getLotProduct(item.Code, function (rs) {
                rs = rs.data;
                $scope.model.CusCode = rs.SupCode;
                //$scope.model.CostTotal = rs.CostTotal;
                //$scope.model.TaxTotal = rs.TaxTotal;
                //$scope.model.Discount = rs.Discount;
                //$scope.model.Commission = rs.Commission;
                //$scope.model.TotalMustPayment = rs.TotalMustPayment;
                //$scope.model.Currency = rs.Currency;
                createTicketCode($scope.model.LotProductCode, $scope.model.StoreCode, $scope.model.UserImport);
                $scope.model.ListProduct = rs.ListProduct;
                $scope.listProdDetail = rs.ListProduct;
            });

            //Bỏ validate
            if ($scope.model.LotProductCode != undefined && $scope.model.LotProductCode != null && $scope.model.LotProductCode != '') {
                $scope.errorLotProductCode = false;
            }
        }
        if (SelectType == "ProductCode") {
            if ($scope.modelList.ProductCode == null || $scope.modelList.ProductCode == '' || $scope.modelList.ProductCode == undefined) {
                $scope.errorProductCode = true;
            } else {
                $scope.errorProductCode = false;
            }
            $scope.model.ListCoil = [];
            $scope.modelList.Unit = item.Unit;
            $scope.modelList.UnitName = item.UnitName;
            $scope.modelList.ProductName = item.Name;
            $scope.modelList.ProductType = item.ProductType;
            $scope.modelList.ImpType = item.ImpType;
            createProductQrCode();
            if (item.ImpType != '' && item.ImpType != null && item.ImpType != undefined) {
                $scope.modelList.Quantity = 0;
                $scope.listProductType = item.ImpType.split(",");
                if ($scope.listProductType.length > 0) {
                    $scope.showCoil = true;
                    $scope.modelList.UnitCoil = $scope.listProductType[$scope.listProductType.length - 1];
                    if ($scope.listProductType.length == 1) {
                        $scope.disableProductImpType = true;
                        $scope.disableValueCoil = true;
                        $scope.disableUnitCoil = true;
                        //$scope.disableQuantityCoil = true;//Phần này cho phép nhập số lượng

                        //$scope.isODD = true;
                        $scope.modelList.ProductImpType = $scope.modelList.UnitCoil;
                        $scope.modelList.ValueCoil = 1;
                        $scope.modelList.QuantityCoil = 1;
                        $scope.modelList.RuleCoil = 1;
                        $scope.modelList.ProductLot = 1;
                        //if ($scope.model.ListCoil.length == 0) {
                        //    $scope.modelList.Quantity = 0;
                        //    $scope.addCoil();
                        //}

                        //Kiểm tra giá trị có null hay không
                        //if ($scope.modelList.Quantity == null || $scope.modelList.Quantity == '' || $scope.modelList.Quantity == undefined) {
                        //    $scope.errorQuantity = true;
                        //} else {
                        //    $scope.errorQuantity = false;
                        //}
                    } else {
                        //$scope.isODD = false;
                        $scope.disableProductImpType = false;
                        $scope.disableValueCoil = false;
                        $scope.disableUnitCoil = true;
                        $scope.disableQuantityCoil = false;

                        $scope.modelList.ProductImpType = '';
                        $scope.modelList.ValueCoil = '';
                        $scope.modelList.QuantityCoil = '';
                        $scope.modelList.RuleCoil = '';
                        $scope.modelList.ProductLot = '';
                    }
                } else {
                    //$scope.isODD = false;
                    $scope.showCoil = false;
                }
            } else {
                App.toastrError(caption.MIST_VALIDATE_IN_PRODUCT_TYPE);
            }

            $scope.disableFiled(item.ImpType);

            createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.sProductCoil);
        }
        if (SelectType == "ProductRelative") {
            $scope.chooseCoilInStore = true;
            var check = $scope.listProduct.filter(k => k.Code === item.ProductCode);
            if (check.length == 1) {
                $scope.modelList.ProductCode = item.ProductCode;
                $scope.modelList.SalePrice = item.SalePrice;
                $scope.modelList.Quantity = item.Quantity;
                $scope.modelList.Unit = check[0].Unit;
                $scope.modelList.UnitName = check[0].UnitName;
                $scope.modelList.ProductName = check[0].Name;
                $scope.modelList.ProductType = check[0].ProductType;
                $scope.modelList.ImpType = check[0].ImpType;
                $scope.modelList.ProductLot = item.ProductLot;
                validationProduct($scope.modelList);
                createProductQrCode();
            }

            //var listRelative = $scope.listProductRelative.filter(k => k.CoilRelative === item.Code);
            //var no = listRelative.length + 1;
            //$scope.modelList.ProductCoil = item.Code + "_" + no;

            createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.sProductCoil);
        }
        if (SelectType == "StoreCode") {
            if ($scope.model.StoreCodeSend == $scope.model.StoreCode) {
                $scope.model.StoreCodeSend = '';
                App.toastrError(caption.MIS_MSG_OTHER_IMPORT_WAREHOUSE_TRANSFER);
            }
            createTicketCode($scope.model.LotProductCode, $scope.model.StoreCode, $scope.model.UserImport);
            //$scope.model.ListProduct = [];
            //$scope.modelList = {
            //    ProductCode: '',
            //    ProductName: '',
            //    ProductQrCode: '',
            //    sProductQrCode: '',
            //    Quantity: null,
            //    Unit: '',
            //    UnitName: '',
            //    SalePrice: null,
            //    TaxRate: 10,
            //    Discount: 0,
            //    Commission: 0,
            //};
            if ($scope.model.StoreCode != undefined && $scope.model.StoreCode != null && $scope.model.StoreCode != '') {
                $scope.errorStoreCode = false;
            }
        }
        if (SelectType == "Reason") {
            if ($scope.model.Reason != undefined && $scope.model.Reason != null && $scope.model.Reason != '') {
                $scope.errorReason = false;
            }
            if ($scope.model.Reason == 'IMP_FROM_BUY') {
                $scope.model.StoreCodeSend = '';
            }
            else {
                $scope.model.CusCode = '';
            }
        }
        if (SelectType == "StoreCodeSend") {
            if ($scope.model.StoreCodeSend == $scope.model.StoreCode) {
                $scope.model.StoreCodeSend = '';
                App.toastrError(caption.MIS_MSG_OTHER_IMPORT_WAREHOUSE_TRANSFER);
            }
            if ($scope.model.StoreCodeSend != undefined && $scope.model.StoreCodeSend != null && $scope.model.StoreCodeSend != '') {
                $scope.errorStoreCodeSend = false;
            }
        }
        if (SelectType == "UserImport") {
            createTicketCode($scope.model.LotProductCode, $scope.model.StoreCode, $scope.model.UserImport);
            if ($scope.model.UserImport != undefined && $scope.model.UserImport != null && $scope.model.UserImport != '') {
                $scope.errorUserImport = false;
            }
        }
        if (SelectType == "CusCode") {
            if ($scope.model.CusCode != undefined && $scope.model.CusCode != null && $scope.model.CusCode != '') {
                $scope.errorCusCode = false;
            }
        }
        if (SelectType == "PoSuppCode") {
            if ($scope.model.PoSuppCode != undefined && $scope.model.PoSuppCode != null && $scope.model.PoSuppCode != '') {
                $scope.errorPoSuppCode = false;
            }
        }
        if (SelectType == "Unit") {
            if ($scope.modelList.Unit != undefined && $scope.modelList.Unit != null && $scope.modelList.Unit != '') {
                $scope.errorUnit = false;
            }
            if ($scope.packing == undefined || $scope.packing == null || $scope.packing == '') {
                $scope.packing = item.Name;
                $scope.modelList.PackType = item.Name;
            }
        }
    }
    $scope.changeCoil = function () {
        createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.sProductCoil);
    }
    $scope.change = function (type) {
        switch (type) {
            //Quy cách
            case 'ruleCoil':
                createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.RuleCoil);
                break;
            case 'quantity':
                if ($scope.modelList.Quantity == null || $scope.modelList.Quantity == '' || $scope.modelList.Quantity == undefined) {
                    $scope.errorQuantity = true;
                } else {
                    $scope.errorQuantity = false;
                }
                break;
            //case 'price':
            //    if ($scope.modelList.SalePrice == null || $scope.modelList.SalePrice == '' || $scope.modelList.SalePrice == undefined) {
            //        $scope.errorSalePrice = true;
            //    } else {
            //        $scope.errorSalePrice = false;
            //    }
            //    break;
            case 'quantityImp':
                if ($scope.modelList.QuantityImp == null || $scope.modelList.QuantityImp == '' || $scope.modelList.QuantityImp == undefined) {
                    $scope.errorQuantityImp = true;
                } else {
                    $scope.errorQuantityImp = false;
                }
                break;
            default:
        }
    }
    $scope.changeTilte = function () {
        if ($scope.model.Title != undefined && $scope.model.Title != null && $scope.model.Title != '') {
            $scope.errorTitle = false;
        } else {
            $scope.errorTitle = true;
        }

    }
    $scope.openLog = function () {
        dataserviceImpStore.getUpdateLog($scope.model.TicketCode, function (rs) {
            rs = rs.data;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: ctxfolderImpStore + '/showLog.html',
                controller: 'showLog',
                backdrop: 'static',
                size: '70',
                resolve: {
                    para: function () {
                        return rs.Object;
                    }
                }
            });
            modalInstance.result.then(function (d) {
            }, function () { });
        });
    }
    $scope.showAddCoil = function (item, index) {
        if ($scope.isNotSave) {
            App.toastrError(caption.MIST_VALIDATE_SAVE_ADD_ROLL_BOX);
            return;
        }
        var objPara = {
            item: item,
            rootId: $rootScope.rootId,
            productName: item.ProductName,
            ticketCode: $scope.model.TicketCode,
            model: $scope.model
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderImpStore + '/showAddCoil.html',
            controller: 'showAddCoil',
            backdrop: 'static',
            size: '65',
            resolve: {
                para: function () {
                    return {
                        objPara
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.initLoad();
        }, function () {
        });
    }
    $scope.showListCoil = function () {
        if ($scope.isShow == true) {
            $scope.isShow = false;
            $scope.isShowListCoil = true;
        }
        else {
            $scope.isShow = true;
            $scope.isShowListCoil = false;
        }
    }

    //Xử lý phần disable khi danh mục sản phẩm có hình thức nhập là cuộn, thùng
    $scope.disableFiled = function (type) {

        if (type != "Thùng" && type != "Cuộn") {
            $scope.disableProductCoil = true;
            $scope.disableProductRelative = true;
            $scope.disableListCoil = true;
        } else {
            $scope.disableProductCoil = false;
            $scope.disableProductRelative = false;
            $scope.disableListCoil = false;
            $scope.allowAddCoil = true;
        }
    }

    $scope.submit = function () {
        validationSelect($scope.model);
        if ($scope.IsEnabledImportLot == true) {
            var chk = false;
            var countQuantity = 0;
        }
        if ($scope.addform.validate() && !validationSelect($scope.model).Status) {
            var msg = $rootScope.checkData($scope.model);
            if (msg.Status) {
                App.toastrError(msg.Title);
                return;
            } else {
                if (!$scope.isEdit) {
                    dataserviceImpStore.insert($scope.model, function (rs) {
                        rs = rs.data;
                        if (rs.Error) {
                            var type = "ODD";
                            if ($rootScope.IsEnabledImportLot) {
                                type = "PO";
                            } else {
                                $scope.model.LotProductCode = '';
                            };
                            dataserviceImpStore.createTicketCode(type, function (rs) {
                                rs = rs.data;
                                $scope.model.TicketCode = rs.Object;
                                createCoilCode("", "", "");
                                $scope.confirmCodeExits($scope.model.TicketCode);
                            });
                        } else {
                            $scope.isNotSave = false;
                            $scope.isDisable = true;
                            $scope.isEdit = true;
                            $rootScope.storeCode = $scope.model.StoreCode;
                            App.toastrSuccess(rs.Title);
                            $rootScope.rootId = rs.ID;
                            if ($scope.IsEnabledImportLot) {
                                if ($scope.model.ListProduct.length > 0) {
                                    dataserviceImpStore.insertDetailByLot($scope.model, function (rs) {
                                        rs = rs.data;
                                        if (rs.Error) {

                                        }
                                        else {
                                            dataserviceImpStore.getProductDetail($scope.model.TicketCode, function (rs) {
                                                rs = rs.data;
                                                $scope.listProdDetail = rs;
                                            })
                                        }
                                    })
                                }
                            }

                            //Workflow
                            $scope.modelWf.ObjectInst = $scope.model.TicketCode;
                            $scope.modelWf.WorkflowCode = $scope.model.WorkflowCat;
                            $scope.modelWf.ObjectName = $scope.model.Title;
                            dataserviceImpStore.createWfInstance($scope.modelWf, function (rs) {
                                rs = rs.data;
                                if (rs.Error) {
                                    App.toastrError(rs.Title);
                                } else {
                                    //App.toastrSuccess(rs.Title);
                                    var wfInstCode = rs.Object.WfInstCode;
                                    $scope.WfInstCode = wfInstCode;
                                    $location.path("/");
                                }
                            })
                        }
                    });
                } else {
                    dataserviceImpStore.update($scope.model, function (rs) {
                        rs = rs.data;
                        if (rs.Error) {
                            App.toastrError(rs.Title);
                        } else {
                            $scope.isDisable = true;
                            App.toastrSuccess(rs.Title);
                            $location.path("/");
                        }
                    });
                }
            }
        }
    }
    $scope.orderingItemCoil = function (item) {
        //var item = $scope.model.ListCoil[index];
        if (item != null) {
            dataserviceImpStore.checkProductInStoreCoil(item.ProductQrCode, item.ProductCoil, function (rs) {
                rs = rs.data;
                if (rs) {
                    var getStore = $scope.listStore.find(function (element) {
                        if (element.Code == $scope.model.StoreCode) return true;
                    });
                    var objPara = {
                        item: item,
                        rootId: $rootScope.rootId,
                        productName: item.ProductName,
                        productCoil: item.ProductCoil,
                        storeName: getStore ? getStore.Name : ''
                    }

                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: ctxfolderImpStore + '/orderProduct.html',
                        controller: 'orderProduct',
                        backdrop: 'static',
                        size: '70',
                        resolve: {
                            para: function () {
                                return {
                                    objPara
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (id) {
                        //$scope.initLoad();
                    }, function () {
                    });
                } else {
                    App.toastrError(caption.MIS_MSG_PRODUCT_NON_ADD_REQUEST_CHOSE_ADD);
                }
            });
        } else {
            App.toastrError(caption.MIST_ADD_PRODUCT_SAVE_BEFORE_SORT);
        }
    }
    $rootScope.updateOrderItemCoil = function (id) {
        var item = $scope.model.ListCoil.find(function (element) {
            if (element.Id == id) return true;
        });
        if (item) {
            if (item.IsOrder == false) {
                item.IsOrder = true;
            } else {
                item.IsOrder = false;
            }
        }
    }
    $rootScope.reloadData = function () {
        if ($rootScope.rootId != null && $rootScope.rootId != undefined && $rootScope.rootId != '') {
            var id = parseFloat($rootScope.rootId);
            dataserviceImpStore.getItem(id, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    $scope.model = rs.Object.Header;
                    $scope.model.ListProduct = rs.Object.ListProduct;
                    $scope.model.ListCoil = [];
                    for (var i = 0; i < $scope.model.ListProduct.length; i++) {
                        if ($scope.model.ListProduct[i].ListCoil.length > 0) {
                            for (var j = 0; j < $scope.model.ListProduct[i].ListCoil.length; j++) {
                                $scope.model.ListProduct[i].ListCoil[j].ValueCoil = $scope.model.ListProduct[i].ListCoil[j].Size;

                                var productCoil = $scope.model.ListProduct[i].ListCoil[j].ProductCoil;
                                $scope.model.ListProduct[i].ListCoil[j].RuleCoil = productCoil.split("_")[productCoil.split("_").length - 2];
                            }
                        }
                        $scope.model.ListProduct[i].sQuantityCoil = $scope.model.ListProduct[i].ListCoil.length;
                        $scope.model.ListProduct[i].QuantityOrder = $scope.model.ListProduct[i].Quantity - $scope.model.ListProduct[i].QuantityIsSet;
                    }
                    $rootScope.storeCode = $scope.model.StoreCode;
                    if ($scope.model.LotProductCode != '') {
                        $scope.IsEnabledImportLot = true;
                        $rootScope.IsEnabledImportLot = true;

                        dataserviceImpStore.getListLotProduct4Update($scope.model.LotProductCode, function (rs) {
                            rs = rs.data;
                            $scope.listLotProduct = rs;
                        });
                    }
                    else {
                        dataserviceImpStore.getListLotProduct(function (rs) {
                            rs = rs.data;
                            $scope.listLotProduct = rs;
                        });
                    }

                    createCoilCode("", "", "");
                }
            });
        }
    }

    $scope.orderingItem = function (index) {
        var item = $scope.model.ListProduct[index];
        if (item != null) {
            dataserviceImpStore.checkProductInStore(item.ProductQrCode, function (rs) {
                rs = rs.data;

                if (rs) {
                    var getStore = $scope.listStore.find(function (element) {
                        if (element.Code == $scope.model.StoreCode) return true;
                    });
                    var objPara = {
                        item: item,
                        rootId: $rootScope.rootId,
                        productName: item.ProductName,
                        productCoil: '',
                        storeName: getStore ? getStore.Name : ''
                    }
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: ctxfolderImpStore + '/orderProduct.html',
                        controller: 'orderProduct',
                        backdrop: 'static',
                        size: '60',
                        resolve: {
                            para: function () {
                                return {
                                    objPara
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (id) {
                        $rootScope.reloadData();
                    }, function () {
                    });
                } else {
                    App.toastrError(caption.MIS_MSG_PRODUCT_NON_ADD_REQUEST_CHOSE_ADD);
                }
            });
        } else {
            App.toastrError(caption.MIST_ADD_PRODUCT_SAVE_BEFORE_SORT);
        }
    }
    $scope.viewQrCode = function (code) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderQrCode + '/qrViewerBase64.html',
            controller: function ($scope, $uibModalInstance) {
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.data = code;
                setTimeout(function () {
                    setModalDraggable('.modal-dialog');
                }, 200);
            },
            backdrop: 'static',
            size: '25',
        });
    }

    $scope.confirmCodeExits = function (ticketCode) {
        var model = $scope.model;
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmQuestion.html',
            windowClass: "message-center",
            resolve: {
                para: function () {
                    return {
                        model
                    };
                }
            },
            controller: function ($scope, $uibModalInstance, para) {
                $scope.message = caption.MIST_VALIDATE_ALREADY_EXIST_THEN + ticketCode;
                $scope.ok = function () {
                    dataserviceImpStore.insert(para.model, function (rs) {
                        rs = rs.data;
                        if (rs.Error) {
                            App.toastrError(rs.Title);
                        } else {
                            App.toastrSuccess(rs.Title);
                            $uibModalInstance.close(rs.ID);
                        }
                    });
                };

                $scope.cancel = function () {
                    $uibModalInstance.close(false, null);
                };
            },
            size: '25'
        });
        modalInstance.result.then(function (d) {
            if (d != undefined) {
                $scope.isNotSave = false;
                $scope.isDisable = true;
                $scope.isEdit = true;
                $rootScope.storeCode = $scope.model.StoreCode;
                $rootScope.rootId = d;
            }
        }, function () {
        });
    }

    //Add new reason
    $scope.addReason = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCommonSetting + "/detail.html",
            controller: 'detail',
            size: '50',
            backdrop: 'static',
            resolve: {
                para: function () {
                    return {
                        Group: 'IMP_REASON',
                        GroupNote: 'Lý do nhập',
                        AssetCode: 'PUBLISH'
                    }
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataserviceImpStore.getListReason(function (rs) {
                rs = rs.data;
                $scope.listReason = rs;
            });
        }, function () { });
    }

    $scope.showDetail = function () {
        if ($scope.isShowDetail) {
            $scope.isShowDetail = false;
        } else {
            $scope.isShowDetail = true;
        }
    }

    function loadDate() {
        //$("#NextTimePayment").datepicker({
        //    inline: false,
        //    autoclose: true,
        //    format: "dd/mm/yyyy",
        //    fontAwesome: true,
        //});
        $("#InsurantTime").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        });
        $("#TimeTicketCreate").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        });
        //var today = new Date(new Date());
        //// tạm chú thích để test phần dự báo: Hoàng
        //$('#TimeTicketCreate').datepicker('setStartDate', today);
        //$('#TimeTicketCreate').datepicker('update', new Date());
        //$('#TimeTicketCreate').datepicker('setEndDate', today);
        //$scope.model.TimeTicketCreate = $filter('date')(new Date(today), 'dd/MM/yyyy');
        //$('#NextTimePayment').datepicker('setStartDate', today);
        //$('#InsurantTime').datepicker('setStartDate', today);

        setModalMaxHeight('.modal');
        setModalDraggable('.modal-dialog');
    }
    function createTicketCode(lot, store, user) {

    }
    function createProductQrCode() {
        var today = moment().format('DDMMYYYY-HHmm');
        //$scope.modelList.ProductQrCode = "LE_SP." + $scope.modelList.ProductCode + "_SL." + $scope.modelList.Quantity + "_T." + today;
        $scope.modelList.ProductQrCode = $scope.modelList.ProductCode + "_SL." + $scope.modelList.Quantity + "_T." + today;
        dataserviceImpStore.generatorQRCode($scope.modelList.ProductQrCode, function (result) {
            result = result.data;
            $scope.modelList.sProductQrCode = result;
        });
    }
    function createCoilCode(productCode, lot, rule) {
        if (productCode == "" || productCode == undefined || productCode == null)
            productCode = "";

        if (lot == "" || lot == undefined || lot == null)
            lot = "";

        if (rule == "" || rule == undefined || rule == null)
            rule = "";

        var no = 1;
        $scope.modelList.ProductCoil = $scope.model.TicketCode + "_" + productCode + "_" + rule + "_";
    }
    function validationProduct(data) {
        var mess = { Status: false, Title: "" }
        //Check null lô hàng khi chọn nhập theo lô
        if ($scope.modelList.ProductCode == undefined || $scope.modelList.ProductCode == null || $scope.modelList.ProductCode == '') {
            $scope.errorProductCode = true;
            mess.Status = true;
            mess.Title = caption.MIS_VALIDATE_CHOOSE_PRODUCT;
        } else {
            $scope.errorProductCode = false;
        }
        //if ($scope.modelList.Quantity == undefined || $scope.modelList.Quantity == null || $scope.modelList.Quantity == '') {
        //    $scope.errorQuantity = true;
        //    mess.Status = true;
        //    if (mess.Title != "")
        //        mess.Title = mess.Title + "</br>caption.MIS_VALIDATE_ENTER_VALUE";
        //    else
        //        mess.Title = caption.MIS_VALIDATE_ENTER_VALUE;
        //} else {
        //    $scope.errorQuantity = false;
        //}
        if ($scope.modelList.QuantityImp == undefined || $scope.modelList.QuantityImp == null || $scope.modelList.QuantityImp == '') {
            $scope.errorQuantityImp = true;
            mess.Status = true;
            mess.Title = "Số lượng không được bỏ trống";
        } else {
            $scope.errorQuantityImp = false;
        }

        if ($scope.modelList.Unit == undefined || $scope.modelList.Unit == null || $scope.modelList.Unit == '') {
            $scope.errorUnit = true;
            mess.Status = true;
            if (mess.Title != "")
                mess.Title = mess.Title + "</br>caption.MIS_VALIDATE_ENTER_PRICE";
            else
                mess.Title = caption.MIS_VALIDATE_ENTER_PRICE;
        }
        else {
            $scope.errorUnit = false;
        }
        //if ($scope.modelList.SalePrice == undefined || $scope.modelList.SalePrice == null || $scope.modelList.SalePrice == '') {
        //    $scope.errorSalePrice = true;
        //    mess.Status = true;
        //    if (mess.Title != "")
        //        mess.Title = mess.Title + "</br>caption.MIS_VALIDATE_ENTER_PRICE";
        //    else
        //        mess.Title = caption.MIS_VALIDATE_ENTER_PRICE;
        //} else {
        //    $scope.errorSalePrice = false;
        //}
        return mess;
    }
    function validationProductCoil(data) {
        var mess = { Status: false, Title: "" }
        if ($scope.modelList.ProductCoil == undefined || $scope.modelList.ProductCoil == null || $scope.modelList.ProductCoil == '') {
            $scope.errorProductCoil = true;
            mess.Status = true;
            if (mess.Title != "")
                mess.Title = mess.Title + "</br>caption.MIST_VALDIATE_ADD_ROLL_BOX";
            else
                mess.Title = caption.MIST_VALDIATE_ADD_ROLL_BOX;
        } else {
            $scope.errorProductCoil = false;
        }

        return mess;
    }
    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        //Check null lô hàng khi chọn nhập theo lô
        if ($scope.IsEnabledImportLot == true && (data.LotProductCode == undefined || data.LotProductCode == null || data.LotProductCode == '')) {
            $scope.errorLotProductCode = true;
            mess.Status = true;
        } else {
            $scope.errorLotProductCode = false;
        }

        //Check null kho hàng
        if (data.StoreCode == undefined || data.StoreCode == null || data.StoreCode == '') {
            $scope.errorStoreCode = true;
            mess.Status = true;
        } else {
            $scope.errorStoreCode = false;
        }

        //Check null lý do
        if (data.Reason == undefined || data.Reason == null || data.Reason == '') {
            $scope.errorReason = true;
            mess.Status = true;
        } else {
            $scope.errorReason = false;
        }

        //Check null kho chuyển đến
        if ($scope.model.Reason == 'IMP_FROM_MOVE_STORE' && (data.StoreCodeSend == undefined || data.StoreCodeSend == null || data.StoreCodeSend == '')) {
            $scope.errorStoreCodeSend = true;
            mess.Status = true;
        } else {
            $scope.errorStoreCodeSend = false;
        }

        //Check null nhân viên nhập
        if (data.UserImport == undefined || data.UserImport == null || data.UserImport == '') {
            $scope.errorUserImport = true;
            mess.Status = true;
        } else {
            $scope.errorUserImport = false;
        }

        //Check title
        if (data.Title == undefined || data.Title == null || data.Title == '') {
            $scope.errorTitle = true;
            mess.Status = true;
        } else {
            $scope.errorTitle = false;
        }

        if (data.WorkflowCat == undefined || data.WorkflowCat == null || data.WorkflowCat == '') {
            $scope.errorWorkflowCat = true;
            mess.Status = true;
        } else {
            $scope.errorWorkflowCat = false;
        }

        return mess;
    };
    function loadPoper() {
        $('[data-toggle="popover"]').popover()
    }

    //Show, hide header
    $scope.isShowHeader = true;
    $scope.showHeaderCard = function () {
        $scope.isShowHeader = true;
    }
    $scope.hideHeader = function () {
        $scope.isShowHeader = false;
    }

    //End show, hide header

    setTimeout(function () {
        loadDate();
        loadPoper();
    }, 200);
});

app.controller('edit', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $filter, dataserviceImpStore, dataserviceMaterial, $window, myService, $location) {
    $rootScope.rootId = para;
    $scope.isDisable = false;
    $scope.isEdit = false;
    $scope.IsEnabledImportLot = false;
    $rootScope.IsEnabledImportLot = false;
    $scope.modelDisable = true;
    $scope.isDelete = true;
    $scope.model = {
        Title: '',
        StoreCode: '',
        CusCode: '',
        Reason: 'IMP_FROM_BUY',
        StoreCodeSend: '',
        Currency: 'VND',
        PaymentStatus: '',
        UserImport: '',
        Note: '',
        UserSend: '',
        InsurantTime: '',
        LotProductCode: '',
        TicketCode: '',
        TimeTicketCreate: $filter('date')(new Date(), 'dd/MM/yyyy'),
        ListProduct: [],
        ListCoil: []
    }
    $scope.modelList = {
        ProductCode: '',
        ProductName: '',
        ProductQrCode: '',
        sProductQrCode: '',
        QuantityOrder: null,
        Quantity: null,
        Unit: '',
        UnitName: '',
        ImpType: '',
        IsCustomized: false,
        ProdCustomJson: ''
    };
    $scope.modelWf = {
        WorkflowCode: "",
        ObjectType: "IMPORT_STORE",
        ObjectInst: "",
    };
    $scope.isShowListCoil = true;
    $scope.isShow = true;
    $scope.isInsertCoil = false;

    $scope.modelUpdate = {};
    $scope.disableProductCode = false;
    $scope.disableProductCoil = false;
    $scope.disableProductRelative = false;
    $scope.disableListCoil = false;

    $scope.disableProductImpCoil = false;
    $scope.disableValueCoil = false;
    $scope.disableUnitCoil = true;
    $scope.disableQuantityCoil = false;

    $scope.isCoil = true;
    $scope.allowAddCoil = false;

    $scope.listProductRelative = [];
    $scope.chooseCoilInStore = false;

    $scope.listProdDetail = [];

    var para = myService.getData();
    if (para == undefined) {
        para = $location.search().id;
    }
    if (para == undefined || para <= 0) {
        location.href = "/Admin/MaterialImpStore";
    }

    if (para != undefined) {
        $scope.initLoad = function () {
            dataserviceImpStore.getProductUnit(function (rs) {
                rs = rs.data;
                $scope.listUnit = rs;
            })
            dataserviceImpStore.getListWareHouse(function (rs) {
                rs = rs.data;
                $scope.listStore = rs;
                $scope.listStoreSend = rs;
            });
            dataserviceImpStore.getListCustomer(function (rs) {
                rs = rs.data;
                $scope.listCustomer = rs;
            });
            dataserviceImpStore.getListUserImport(function (rs) {
                rs = rs.data;
                $scope.listUserImport = rs;
            });
            dataserviceImpStore.getListReason(function (rs) {
                rs = rs.data;
                $scope.listReason = rs;
            });
            dataserviceImpStore.getListProduct(function (rs) {
                rs = rs.data;
                $scope.listProduct = rs;
            });

            dataserviceImpStore.getItem(para, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    $scope.model = rs.Object.Header;
                    $scope.model.ListProduct = rs.Object.ListProduct;
                    $scope.model.ListCoil = [];
                    for (var i = 0; i < $scope.model.ListProduct.length; i++) {
                        if ($scope.model.ListProduct[i].ListCoil.length > 0) {
                            for (var j = 0; j < $scope.model.ListProduct[i].ListCoil.length; j++) {
                                $scope.model.ListProduct[i].ListCoil[j].ValueCoil = $scope.model.ListProduct[i].ListCoil[j].Size;

                                var productCoil = $scope.model.ListProduct[i].ListCoil[j].ProductCoil;
                                $scope.model.ListProduct[i].ListCoil[j].RuleCoil = productCoil.split("_")[productCoil.split("_").length - 2];
                            }
                        }
                        $scope.model.ListProduct[i].sQuantityCoil = $scope.model.ListProduct[i].ListCoil.length;
                        $scope.model.ListProduct[i].QuantityOrder = $scope.model.ListProduct[i].Quantity - $scope.model.ListProduct[i].QuantityIsSet;
                    }
                    $rootScope.storeCode = $scope.model.StoreCode;
                    if ($scope.model.LotProductCode != '') {
                        $scope.IsEnabledImportLot = true;
                        $rootScope.IsEnabledImportLot = true;

                        dataserviceImpStore.getListLotProduct4Update($scope.model.LotProductCode, function (rs) {
                            rs = rs.data;
                            $scope.listLotProduct = rs;
                        });
                    }
                    else {
                        dataserviceImpStore.getListLotProduct(function (rs) {
                            rs = rs.data;
                            $scope.listLotProduct = rs;
                        });
                    }

                    createCoilCode("", "", "");
                    dataserviceImpStore.getProductDetail($scope.model.TicketCode, function (rs) {
                        rs = rs.data;
                        $scope.listProdDetail = rs;
                        if ($scope.listProdDetail.length > 0) {
                            $scope.disabledReason = true;
                        }
                    })
                    dataserviceImpStore.getInfoUserImport($scope.model.UserImport, function (rs) {
                        rs = rs.data;
                        $scope.infoUserImport = rs;
                    })
                    try {
                        var lstStatus = JSON.parse($scope.model.Status);
                    } catch (e) {
                        console.log(e);
                        lstStatus = [];
                    }
                    if (lstStatus.length > 0) {
                        $scope.model.Status = lstStatus[lstStatus.length - 1].Code;
                        $scope.model.StatusDefault = lstStatus[lstStatus.length - 1].Code;
                        $scope.model.StatusTemp = lstStatus[lstStatus.length - 1].Code;
                        $scope.listStatusLog = lstStatus;
                    }
                    setTimeout(function () {
                        $rootScope.loadDiagramWfInst($scope.model.TicketCode, $scope.modelWf.ObjectType);
                    }, 800)
                }
            });
            dataserviceImpStore.getCurrency(function (rs) {
                rs = rs.data;
                $scope.listCurrentcy = rs;
                if ($scope.listCurrentcy.length > 0) {
                    $scope.modelList.Currency = $scope.listCurrentcy[0].Code;
                }
            })

            dataserviceImpStore.getListProductRelative(function (rs) {
                rs = rs.data;
                $scope.listProductRelative = rs;
            });
            dataserviceImpStore.getWorkFlow(function (result) {
                result = result.data;
                $rootScope.lstWorkflow = result;
            });
        }
        $scope.initLoad();
    }
    else {
        $location.path("/");
    }

    //Edit Activity Instance
    $scope.editInstAct = function (id, objCode) {
        dataserviceImpStore.checkPermissionEditActivityById(id, function (rs) {
            rs = rs.data;
            if (!rs) {
                return App.toastrError(caption.COM_MSG_PERMISSION_EDIT_ACT);
            }
            dataserviceImpStore.getItemActInst(id, function (rs) {
                $rootScope.IsLock = rs.data.IsLock;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: ctxfolder + '/add-activity-instance.html',
                    controller: 'edit-activity-instance',
                    backdrop: 'static',
                    keyboard: false,
                    size: '60',
                    resolve: {
                        para: function () {
                            return {
                                Data: rs.data,
                                ObjCode: objCode
                            }
                        }
                    }
                });
                modalInstance.result.then(function (d) {
                    $rootScope.loadDiagramWfInst($scope.model.TicketCode, $scope.modelWf.ObjectType);
                    dataserviceImpStore.getLogStatus($scope.model.TicketCode, function (rs) {
                        rs = rs.data;
                        try {
                            var lstStatus = JSON.parse(rs.Status);
                        } catch (e) {
                            console.log(e);
                            lstStatus = [];
                        }
                        if (lstStatus.length > 0) {
                            $scope.model.Status = lstStatus[lstStatus.length - 1].Code;
                            $scope.model.StatusDefault = lstStatus[lstStatus.length - 1].Code;
                            $scope.model.StatusTemp = lstStatus[lstStatus.length - 1].Code;
                            $scope.listStatusLog = lstStatus;
                        }
                    })
                }, function () {
                });
            })
        })
    }
    //End

    $scope.changeStatus = function () {
        if ($scope.model.Status == "REPEAT_REQUIRE_REWORK" || $scope.model.Status == "FINAL_REQUIRE_REWORK") {
            dataserviceImpStore.getListRepeat($scope.model.TicketCode, function (rs) {
                rs = rs.data;
                var arr = [];
                if (rs.list != undefined && rs.list != null && rs.list != "") {
                    for (var i = 0; i < rs.list.length; i++) {
                        if (rs.list[i].IntsCode == rs.current) {
                            for (var j = 0; j < i; j++) {
                                arr.push(rs.list[j]);
                            }
                        }
                    }
                    $scope.lstActRepeat = arr;
                    $scope.showAct = true;
                }
            })
        }
        else {
            $scope.showAct = false;
        }
    }

    $rootScope.refeshData = function (id) {
        dataserviceImpStore.getItem(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                $scope.model = rs.Object.Header;
                $scope.model.ListProduct = rs.Object.ListProduct;
                $scope.model.ListCoil = [];
                for (var i = 0; i < $scope.model.ListProduct.length; i++) {
                    if ($scope.model.ListProduct[i].ListCoil.length > 0) {
                        for (var j = 0; j < $scope.model.ListProduct[i].ListCoil.length; j++) {
                            $scope.model.ListProduct[i].ListCoil[j].ValueCoil = $scope.model.ListProduct[i].ListCoil[j].Size;

                            var productCoil = $scope.model.ListProduct[i].ListCoil[j].ProductCoil;
                            $scope.model.ListProduct[i].ListCoil[j].RuleCoil = productCoil.split("_")[productCoil.split("_").length - 2];
                        }
                    }
                    $scope.model.ListProduct[i].sQuantityCoil = $scope.model.ListProduct[i].ListCoil.length;
                    $scope.model.ListProduct[i].QuantityOrder = $scope.model.ListProduct[i].Quantity - $scope.model.ListProduct[i].QuantityIsSet;
                }
                $rootScope.storeCode = $scope.model.StoreCode;
                if ($scope.model.LotProductCode != '') {
                    $scope.IsEnabledImportLot = true;
                    $rootScope.IsEnabledImportLot = true;

                    dataserviceImpStore.getListLotProduct4Update($scope.model.LotProductCode, function (rs) {
                        rs = rs.data;
                        $scope.listLotProduct = rs;
                    });
                }
                else {
                    dataserviceImpStore.getListLotProduct(function (rs) {
                        rs = rs.data;
                        $scope.listLotProduct = rs;
                    });
                }

                createCoilCode("", "", "");
            }
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        $rootScope.reloadRoot();
    }

    $scope.checkedImportLot = function (chk) {
        $scope.init();
        $rootScope.IsEnabledImportLot = chk;
        $scope.errorLotProductCode = false;

    }

    $scope.add = function () {

        var msg = validationProduct($scope.modelList);
        if (msg.Status) {
            return;
        }
        if ($scope.model.ListCoil.length == 0) {
            App.toastrError(caption.MIST_VALIDATE_ROLL_BOX_BLANK);
            return;
        }
        //Check null
        if ($scope.modelList.ProductCode == undefined || $scope.modelList.ProductCode == null || $scope.modelList.ProductCode == '' ||
            $scope.modelList.Quantity == undefined || $scope.modelList.Quantity == null || $scope.modelList.Quantity == 0
            || $scope.modelList.SalePrice == undefined || $scope.modelList.SalePrice == null
        ) {
            App.toastrError(caption.MIST_VALIDATE_REQUIRE_INFORMATION);
        }
        else {
            var indexCheck = -1;
            var elementCheck = $scope.model.ListProduct.find(function (element) {
                if (element.ProductCode == $scope.modelList.ProductCode && element.ProductType == $scope.modelList.ProductType && element.ProductCoil == $scope.modelList.ProductCoil) {
                    indexCheck = 0;
                    return element;
                }
            });
            if (indexCheck > -1) {
                App.toastrError(caption.MES_MSG_PRODUCT_ADD_CATEGORY);
            }
            else {
                //Tạo QrCode cho sản phẩm
                createProductQrCode();

                var addItem = {
                    ProductCode: $scope.modelList.ProductCode,
                    ProductName: $scope.modelList.ProductName,
                    ProductType: $scope.modelList.ProductType,
                    ProductQrCode: $scope.modelList.ProductQrCode,
                    sProductQrCode: $scope.modelList.sProductQrCode,
                    Quantity: $scope.modelList.Quantity,
                    Unit: $scope.modelList.Unit,
                    UnitName: $scope.modelList.UnitName,

                    SalePrice: $scope.modelList.SalePrice,

                    QuantityIsSet: 0,
                    QuantityNeedSet: $scope.modelList.QuantityNeedSet,
                    QuantityOrder: $scope.modelList.Quantity,//Số lượng cần xếp kho 
                    ProductCoil: $scope.modelList.ProductCoil,
                    sProductCoil: $scope.modelList.sProductCoil,
                    ProductLot: $scope.modelList.ProductLot,
                    ImpType: $scope.modelList.ImpType,
                    ProductCoilRelative: $scope.modelList.ProductCoilRelative,
                    ////Tính toán
                    Total: $scope.modelList.Quantity * $scope.modelList.SalePrice,
                    ListCoil: $scope.model.ListCoil,
                    QuantityCoil: $scope.model.ListCoil.length,
                    sQuantityCoil: $scope.model.ListCoil.length,
                };
                $scope.model.ListProduct.push(addItem);
                $scope.model.ListCoil = [];
                App.toastrSuccess(caption.COM_ADD_SUCCESS);
            }
        }
    }

    //Vatco: new detail product
    $scope.addDetail = function () {
        if ($scope.packing == "" || $scope.packing == null || $scope.packing == undefined) {
            return App.toastrError(caption.MIS_MSG_PLS_ENTER_PACKING_FOR_PROD);
        }
        var msg = validationProduct($scope.modelList);
        if (msg.Status) {
            return;
        }
        //Tạo QrCode cho sản phẩm
        createProductQrCode();
        var addItem = {
            ProductCode: $scope.modelList.ProductCode,
            ProductType: $scope.modelList.ProductType,
            ProductQrCode: $scope.modelList.ProductQrCode,
            sProductQrCode: $scope.modelList.sProductQrCode,
            Quantity: $scope.modelList.QuantityImp,
            Unit: $scope.modelList.Unit,
            SalePrice: $scope.modelList.SalePrice,
            Currency: $scope.modelList.Currency,
            TicketCode: $scope.model.TicketCode,
            StoreCode: $scope.model.StoreCode,
            PackType: $scope.modelList.PackType,
            IsCustomized: $scope.modelList.IsCustomized,
            ProdCustomJson: $scope.modelList.ProdCustomJson
        };
        dataserviceImpStore.insertDetail(addItem, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataserviceImpStore.getProductDetail($scope.model.TicketCode, function (rs) {
                    rs = rs.data;
                    $scope.listProdDetail = rs;
                    if ($scope.listProdDetail.length > 0) {
                        $scope.disabledReason = true;
                    }
                })
            }
        })
    }

    $scope.deleteDetail = function (id) {
        dataserviceImpStore.deleteDetail(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataserviceImpStore.getProductDetail($scope.model.TicketCode, function (rs) {
                    rs = rs.data;
                    $scope.listProdDetail = rs;
                    if ($scope.listProdDetail.length == 0) {
                        $scope.disabledReason = false;
                    }
                })
            }
        })
    }

    $scope.editProd = function () {
        if ($scope.modelList.ProductCode == null || $scope.modelList.ProductCode == "" || $scope.modelList.ProductCode == undefined) {
            App.toastrError(caption.MIS_VALIDATE_CHOOSE_PRODUCT);
            return;
        }
        var id = $scope.modelList.Id;
        dataserviceMaterial.getItem(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                var object = rs;
                $rootScope.ProductID = $scope.modelList.Id;
                $rootScope.ProductCode = $scope.modelList.ProductCode;
                $rootScope.ObjCode = $scope.modelList.ProductCode;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: ctxfolderMaterialProd + '/edit.html',
                    controller: 'editProdCustom',
                    backdrop: 'static',
                    size: '65',
                    resolve: {
                        para: function () {
                            return object;
                        }
                    }
                });
                modalInstance.result.then(function (d) {
                    console.log(d);
                    if (Object.keys(d).length === 0) {
                        console.log('no update');
                    }
                    else {
                        $scope.modelList.ProdCustomJson = JSON.stringify(d, null, 2);
                        $scope.modelList.IsCustomized = true;
                    }
                    //$scope.reloadNoResetPage();
                }, function () {
                    console.log('exit');
                });
            }
        });
    }

    $scope.viewProdCustom = function (index) {
        //if ($scope.modelList.ProductCode == null || $scope.modelList.ProductCode == "" || $scope.modelList.ProductCode == undefined) {
        //    App.toastrError(caption.MIS_VALIDATE_CHOOSE_PRODUCT);
        //    return;
        //}
        var item = $scope.listProdDetail[index];
        if (item != null) {
            var id = item.IdProduct;
        }
        else {
            return App.toastrError(caption.MIST_ADD_PRODUCT_SAVE_BEFORE_SORT);
        }
        dataserviceMaterial.getItem(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                var object = rs;
                object.ProdCustomJson = item.ProdCustomJson;
                $rootScope.ProductID = $scope.modelList.Id;
                $rootScope.ProductCode = $scope.modelList.ProductCode;
                $rootScope.ObjCode = $scope.modelList.ProductCode;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: ctxfolderMaterialProd + '/edit.html',
                    controller: 'viewProdCustom',
                    backdrop: 'static',
                    size: '65',
                    resolve: {
                        para: function () {
                            return object;
                        }
                    }
                });
                modalInstance.result.then(function (d) {
                    console.log(d);
                    if (Object.keys(d).length === 0) {
                        console.log('no update');
                    }
                    else {
                        $scope.modelList.ProdCustomJson = JSON.stringify(d, null, 2);
                        $scope.modelList.IsCustomized = true;
                    }
                    //$scope.reloadNoResetPage();
                }, function () {
                    console.log('exit');
                });
            }
        });
    }
    $scope.attrValue = function () {
        if ($scope.modelList.ProductCode == null || $scope.modelList.ProductCode == "" || $scope.modelList.ProductCode == undefined) {
            App.toastrError(caption.MIS_VALIDATE_CHOOSE_PRODUCT);
            return;
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderImpStore + '/ticket-imp-attr-value.html',
            controller: 'ticket-imp-attr-value',
            backdrop: 'static',
            size: '65',
            resolve: {
                para: function () {
                    return {
                        TicketCode: $scope.model.TicketCode,
                        ProductCode: $scope.modelList.ProductCode
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataserviceImpStore.getListProduct(function (rs) {
                rs = rs.data;
                $scope.listProduct = rs;
                dataserviceImpStore.getInfoProduct($scope.modelList.ProductCode, $scope.model.TicketCode, function (rs) {
                    rs = rs.data;
                    $scope.long = rs.Long;
                    $scope.high = rs.High;
                    $scope.wide = rs.Wide;
                    $scope.weight = rs.Weight;
                    $scope.weight = rs.Weight;
                    $scope.packing = rs.Packing;
                    $scope.unitWeight = rs.UnitWeight;
                    $scope.modelList.PackType = rs.Packing;
                    var jsonPacking = JSON.stringify($rootScope.jsonSpecification($scope.packing));
                    dataserviceImpStore.unitFromPack(jsonPacking, function (rs) {
                        rs = rs.data;
                        $scope.listUnit = rs.Object;
                        try {
                            if ($scope.listUnit.length == 0) {
                                dataserviceImpStore.getProductUnit(function (rs) {
                                    rs = rs.data;
                                    $scope.listUnit = rs;
                                })
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        $scope.modelList.Unit = '';
                    })
                })
            });
        }, function () { });
    }

    $scope.changeProduct = function () {
        if ($scope.modelList.ProductCode != "" && $scope.modelList.ProductCode != null && $scope.modelList.ProductCode != undefined) {
            var product = $scope.listProduct.find(function (element) {
                if (element.Code == $scope.modelList.ProductCode) return true;
            });

            $scope.modelList.Unit = '';
            $scope.modelList.ProductType = product.ProductType;
            $scope.modelList.Id = product.Id;
            dataserviceImpStore.getInfoProduct($scope.modelList.ProductCode, $scope.model.TicketCode, function (rs) {
                rs = rs.data;
                $scope.long = rs.Long;
                $scope.high = rs.High;
                $scope.wide = rs.Wide;
                $scope.weight = rs.Weight;
                $scope.weight = rs.Weight;
                $scope.packing = rs.Packing;
                $scope.unitWeight = rs.UnitWeight;
                $scope.modelList.PackType = rs.Packing;
                var jsonPacking = JSON.stringify($rootScope.jsonSpecification($scope.packing));
                dataserviceImpStore.unitFromPack(jsonPacking, function (rs) {
                    rs = rs.data;
                    $scope.listUnit = rs.Object;
                    try {
                        if ($scope.listUnit.length == 0) {
                            dataserviceImpStore.getProductUnit(function (rs) {
                                rs = rs.data;
                                $scope.listUnit = rs;
                            })
                        }
                    } catch (e) {
                        console.log(e);
                    }
                })
            })
        }
    }

    $scope.addCoil = function () {
        //Check null
        if ($scope.modelList.ValueCoil == undefined || $scope.modelList.ValueCoil == null || $scope.modelList.ValueCoil == '' ||
            $scope.modelList.QuantityCoil == undefined || $scope.modelList.QuantityCoil == null || $scope.modelList.QuantityCoil == ''
            || $scope.modelList.RuleCoil == undefined || $scope.modelList.RuleCoil == null || $scope.modelList.RuleCoil == ''
            || $scope.modelList.ProductLot == undefined || $scope.modelList.ProductLot == null || $scope.modelList.ProductLot == ''
        ) {
            App.toastrError(caption.MIST_VALIDATE_REQUIRE_INFORMATION);
            $scope.isInsertCoil = false;
            return;
        }
        else {
            $scope.modelList.QuantityCoil = parseInt($scope.modelList.QuantityCoil);
            if ($scope.modelList.QuantityCoil > 100) {
                App.toastrError(caption.MIST_VALIDATE_ADD_LIMIT100);
                return;
            }

            createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.RuleCoil);

            var quantityAdd = $scope.modelList.QuantityCoil;
            $scope.modelList.Quantity = $scope.modelList.Quantity + ($scope.modelList.QuantityCoil * $scope.modelList.ValueCoil);
            for (var i = 0; i < quantityAdd; i++) {

                var addItem = {
                    ProductCode: $scope.modelList.ProductCode,
                    ProductName: $scope.modelList.ProductName,
                    ProductType: $scope.modelList.ProductType,
                    ProductQrCode: $scope.modelList.ProductQrCode,
                    //sProductQrCode: $scope.modelList.sProductQrCode,
                    Quantity: $scope.modelList.Quantity,
                    Unit: $scope.modelList.Unit,
                    UnitName: $scope.modelList.UnitName,

                    SalePrice: $scope.modelList.SalePrice,

                    QuantityIsSet: 0,
                    QuantityNeedSet: $scope.modelList.QuantityNeedSet,

                    ProductCoil: $scope.modelList.ProductCoil,
                    sProductCoil: $scope.modelList.sProductCoil,
                    ProductLot: $scope.modelList.ProductLot,
                    ImpType: $scope.modelList.ImpType,
                    ProductImpType: $scope.modelList.ProductImpType,
                    ValueCoil: $scope.modelList.ValueCoil,
                    UnitCoil: $scope.modelList.UnitCoil,
                    QuantityCoil: $scope.modelList.QuantityCoil,
                    RuleCoil: $scope.modelList.RuleCoil,
                    ProductCoilRelative: $scope.modelList.ProductCoilRelative,
                    IsOrder: false,
                };
                $scope.model.ListCoil.push(addItem);
                $scope.isInsertCoil = true;
            }

            if ($scope.isInsertCoil) {
                App.toastrSuccess(caption.COM_ADD_SUCCESS);
            }
        }
    }

    $scope.editCoil = function (item, index) {
        $scope.modelUpdateCoil = item;
    }

    $scope.saveCoil = function () {
        //Check null
        if ($scope.modelList.ValueCoil == undefined || $scope.modelList.ValueCoil == null || $scope.modelList.ValueCoil == '' ||
            $scope.modelList.QuantityCoil == undefined || $scope.modelList.QuantityCoil == null || $scope.modelList.QuantityCoil == ''
            || $scope.modelList.RuleCoil == undefined || $scope.modelList.RuleCoil == null || $scope.modelList.RuleCoil == ''
            || $scope.modelList.ProductLot == undefined || $scope.modelList.ProductLot == null || $scope.modelList.ProductLot == ''
        ) {
            App.toastrError(caption.MIST_VALIDATE_REQUIRE_INFORMATION);
            return;
        }
        else {
            $scope.model.ListCoil = [];

            createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.RuleCoil);

            var quantityAdd = $scope.modelList.QuantityCoil;
            $scope.modelList.Quantity = $scope.modelList.Quantity;
            for (var i = 0; i < quantityAdd; i++) {

                var addItem = {
                    ProductCode: $scope.modelList.ProductCode,
                    ProductName: $scope.modelList.ProductName,
                    ProductType: $scope.modelList.ProductType,
                    ProductQrCode: $scope.modelList.ProductQrCode,
                    Quantity: $scope.modelList.Quantity,
                    Unit: $scope.modelList.Unit,
                    UnitName: $scope.modelList.UnitName,

                    SalePrice: $scope.modelList.SalePrice,

                    QuantityIsSet: 0,
                    QuantityNeedSet: $scope.modelList.QuantityNeedSet,
                    ProductCoil: $scope.modelList.ProductCoil,
                    sProductCoil: $scope.modelList.sProductCoil,
                    ProductLot: $scope.modelList.ProductLot,
                    ImpType: $scope.modelList.ImpType,
                    ProductImpType: $scope.modelList.ProductImpType,
                    ValueCoil: $scope.modelList.ValueCoil,
                    UnitCoil: $scope.modelList.UnitCoil,
                    QuantityCoil: $scope.modelList.QuantityCoil,
                    RuleCoil: $scope.modelList.RuleCoil,
                    ProductCoilRelative: $scope.modelList.ProductCoilRelative,
                };
                $scope.model.ListCoil.push(addItem);
            }
        }
    }

    $scope.editItem = function (item, index) {
        $scope.disableProductCode = true;
        $scope.modelUpdate = item;
        $scope.isEdit = true;

        //if (item.ImpType != null && item.ImpType != '' && item.ImpType != undefined) {
        //    var listUnit = item.ImpType.split(',');
        //    if (listUnit.length == 1) {
        //        $scope.isDelete = false;
        //    } else if (listUnit.length > 1) {
        //        $scope.isDelete = true;
        //    }
        //}

        $scope.modelList.ProductCode = item.ProductCode;
        $scope.modelList.ProductType = item.ProductType;
        $scope.modelList.ProductName = item.ProductName;
        //$scope.modelList.ProductQrCode = item.ProductQrCode;
        //$scope.modelList.sProductQrCode = item.sProductQrCode;
        $scope.modelList.Quantity = item.Quantity;
        $scope.modelList.Unit = item.Unit;
        $scope.modelList.UnitName = item.UnitName;
        $scope.modelList.ProductLot = item.ProductLot;
        $scope.modelList.SalePrice = item.SalePrice;
        $scope.modelList.ImpType = item.ImpType;
        //$scope.modelList.PackType = packType;
        $scope.modelList.ProductCoilRelative = item.ProductCoilRelative;
        $scope.model.ListCoil = item.ListCoil;

        var quantityCoil = 0;
        for (var i = 0; i < $scope.model.ListCoil.length; i++) {
            quantityCoil = quantityCoil + $scope.model.ListCoil[i].ValueCoil;
        }
        $scope.modelList.Quantity = quantityCoil;

        if (item.ImpType != '' && item.ImpType != null && item.ImpType != undefined) {
            $scope.listProductType = item.ImpType.split(",");
            if ($scope.listProductType.length > 0) {
                $scope.showCoil = true;
                $scope.modelList.UnitCoil = $scope.listProductType[$scope.listProductType.length - 1];
                if ($scope.listProductType.length == 1) {
                    $scope.disableProductImpType = true;
                    $scope.disableValueCoil = true;
                    $scope.disableUnitCoil = true;
                    //$scope.disableQuantityCoil = true;
                    //$scope.isODD = true;
                    //$scope.isDelete = false;

                    $scope.modelList.ProductImpType = $scope.modelList.UnitCoil;
                    $scope.modelList.ValueCoil = 1;
                    $scope.modelList.QuantityCoil = item.Quantity;
                    $scope.modelList.RuleCoil = 1;
                    $scope.modelList.ProductLot = 1;
                    //if ($scope.model.ListCoil.length == 0)
                    //    $scope.addCoil();
                } else {
                    //$scope.isODD = false;
                    $scope.isDelete = true;
                    $scope.disableProductImpType = false;
                    $scope.disableValueCoil = false;
                    $scope.disableUnitCoil = true;
                    $scope.disableQuantityCoil = false;

                    $scope.modelList.ProductImpType = '';
                    $scope.modelList.ValueCoil = '';
                    $scope.modelList.QuantityCoil = '';
                    $scope.modelList.RuleCoil = '';
                    $scope.modelList.ProductLot = '';
                }
            } else {
                //$scope.isODD = false;
                $scope.showCoil = false;
                //$scope.isDelete = false;
            }
        } else {
            App.toastrError(caption.MIST_VALIDATE_IN_PRODUCT_TYPE);
        }

        $scope.disableFiled(item.ImpType);
    }

    $scope.save = function () {
        if ($scope.model.ListCoil.length == 0) {
            App.toastrError(caption.MIST_VALIDATE_ROLL_BOX_BLANK);
            return;
        }

        $scope.disableProductCode = false;
        $scope.isEdit = false;

        $scope.modelUpdate.ProductCode = $scope.modelList.ProductCode;
        $scope.modelUpdate.ProductType = $scope.modelList.ProductType;
        $scope.modelUpdate.ProductName = $scope.modelList.ProductName;
        //$scope.modelUpdate.ProductQrCode = $scope.modelList.ProductQrCode;
        //$scope.modelUpdate.sProductQrCode = $scope.modelList.sProductQrCode;
        $scope.modelUpdate.Quantity = $scope.modelList.Quantity;
        $scope.modelUpdate.QuantityOrder = $scope.modelList.Quantity - $scope.modelUpdate.QuantityIsSet;//Số lượng cần xếp kho 
        $scope.modelUpdate.Unit = $scope.modelList.Unit;
        $scope.modelUpdate.UnitName = $scope.modelList.UnitName;
        $scope.modelUpdate.ProductLot = $scope.modelList.ProductLot;
        $scope.modelUpdate.SalePrice = $scope.modelList.SalePrice;
        $scope.modelUpdate.ImpType = $scope.modelList.ImpType;
        $scope.modelUpdate.ProductCoilRelative = $scope.modelList.ProductCoilRelative;
        $scope.modelUpdate.ListCoil = $scope.model.ListCoil;
        $scope.modelUpdate.QuantityCoil = $scope.model.ListCoil.length;
        $scope.modelUpdate.sQuantityCoil = $scope.model.ListCoil.length;
        $scope.model.ListCoil = [];
        dataserviceImpStore.update($scope.model, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                $rootScope.refeshData($rootScope.rootId);
                App.toastrSuccess(caption.COM_UPDATE_SUCCESS);
            }
        });
    }

    $scope.removeItem = function (item, index) {
        if (item.QuantityIsSet > 0) {
            App.toastrError(caption.MIST_SORT_PRODUCT_CANNOT_DELETE);
        }
        else {
            dataserviceImpStore.checkProductInExpTicket(item.ProductQrCode, function (rs) {
                rs = rs.data;
                if (!rs.Error) {
                    //Lấy lại giá trị model vừa xóa đưa lên chỗ add
                    $scope.modelList.ProductCode = item.ProductCode;
                    $scope.modelList.ProductType = item.ProductType;
                    $scope.modelList.ProductName = item.ProductName;
                    $scope.modelList.ProductQrCode = item.ProductQrCode;
                    $scope.modelList.sProductQrCode = item.sProductQrCode;
                    $scope.modelList.Quantity = item.Quantity;
                    $scope.modelList.Unit = item.Unit;
                    $scope.modelList.UnitName = item.UnitName;
                    $scope.modelList.SalePrice = item.SalePrice;
                    $scope.modelList.ProductLot = item.ProductLot;

                    //Check xem đã có trong list chưa
                    $scope.model.ListProduct.splice(index, 1);
                    App.toastrSuccess(caption.COM_DELETE_SUCCESS);
                } else {
                    App.toastrError(rs.Title);
                }
            });
        }
    }

    $scope.removeCoil = function (item) {
        if (item.IsOrder) {
            App.toastrError(caption.MIST_SORT_CANNOT_DELETE);
        } else {
            var index = $scope.model.ListCoil.indexOf(item);
            if (index < -1) {
                App.toastrError(caption.MIST_NOT_FOUND_DEL_PRODUCT);
                return;
            }

            $scope.model.ListCoil.splice(index, 1);
            $scope.modelList.Quantity = 0;
            for (var i = 0; i < $scope.model.ListCoil.length; i++) {
                $scope.modelList.Quantity = $scope.modelList.Quantity + (parseFloat(item.ValueCoil));
            }
            App.toastrSuccess(caption.MIST_BTN_SAVE_INFORMATION);
        }
    }

    $scope.changleSelect = function (SelectType, item) {
        //Hàm chọn 1 lô để nhập
        if (SelectType == "LotProductCode") {
            $rootScope.LotProductCode = item.Code;
            $scope.model.Reason = 'IMP_FROM_BUY';
            $scope.model.StoreCodeSend = '';

            dataserviceImpStore.getLotProduct(item.Code, function (rs) {
                rs = rs.data;
                $scope.model.CusCode = rs.SupCode;
                //$scope.model.CostTotal = rs.CostTotal;
                //$scope.model.TaxTotal = rs.TaxTotal;
                //$scope.model.Discount = rs.Discount;
                //$scope.model.Commission = rs.Commission;
                //$scope.model.TotalMustPayment = rs.TotalMustPayment;
                //$scope.model.Currency = rs.Currency;
                createTicketCode($scope.model.LotProductCode, $scope.model.StoreCode, $scope.model.UserImport);

                $scope.model.ListProduct = rs.ListProduct;
            });

            //Bỏ validate
            if ($scope.model.LotProductCode != undefined && $scope.model.LotProductCode != null && $scope.model.LotProductCode != '') {
                $scope.errorLotProductCode = false;
            }
        }
        if (SelectType == "ProductCode") {
            if ($scope.modelList.ProductCode == null || $scope.modelList.ProductCode == '' || $scope.modelList.ProductCode == undefined) {
                $scope.errorProductCode = true;
            } else {
                $scope.errorProductCode = false;
            }
            $scope.model.ListCoil = [];
            $scope.modelList.Unit = item.Unit;
            $scope.modelList.UnitName = item.UnitName;
            $scope.modelList.ProductName = item.Name;
            $scope.modelList.ProductType = item.ProductType;
            $scope.modelList.ImpType = item.ImpType;
            createProductQrCode();
            if (item.ImpType != '' && item.ImpType != null && item.ImpType != undefined) {
                $scope.modelList.Quantity = 0;
                $scope.listProductType = item.ImpType.split(",");
                if ($scope.listProductType.length > 0) {
                    $scope.showCoil = true;
                    $scope.modelList.UnitCoil = $scope.listProductType[$scope.listProductType.length - 1];
                    if ($scope.listProductType.length == 1) {
                        $scope.disableProductImpType = true;
                        $scope.disableValueCoil = true;
                        $scope.disableUnitCoil = true;
                        //$scope.disableQuantityCoil = true;//Phần này cho phép nhập số lượng

                        //$scope.isODD = true;
                        $scope.modelList.ProductImpType = $scope.modelList.UnitCoil;
                        $scope.modelList.ValueCoil = 1;
                        $scope.modelList.QuantityCoil = 1;
                        $scope.modelList.RuleCoil = 1;
                        $scope.modelList.ProductLot = 1;
                        //if ($scope.model.ListCoil.length == 0) {
                        //    $scope.modelList.Quantity = 0;
                        //    $scope.addCoil();
                        //}

                        //Kiểm tra giá trị có null hay không
                        //if ($scope.modelList.Quantity == null || $scope.modelList.Quantity == '' || $scope.modelList.Quantity == undefined) {
                        //    $scope.errorQuantity = true;
                        //} else {
                        //    $scope.errorQuantity = false;
                        //}
                    } else {
                        $scope.disableProductImpType = false;
                        $scope.disableValueCoil = false;
                        $scope.disableUnitCoil = true;
                        $scope.disableQuantityCoil = false;

                        $scope.modelList.ProductImpType = '';
                        $scope.modelList.ValueCoil = '';
                        $scope.modelList.QuantityCoil = '';
                        $scope.modelList.RuleCoil = '';
                        $scope.modelList.ProductLot = '';
                        //$scope.isODD = false;
                    }
                } else {
                    //$scope.isODD = false;
                    $scope.showCoil = false;
                }
            } else {
                App.toastrError(caption.MIST_VALIDATE_IN_PRODUCT_TYPE);
            }

            $scope.disableFiled(item.ImpType);

            createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.sProductCoil);
        }
        if (SelectType == "Unit") {
            if ($scope.modelList.Unit != undefined && $scope.modelList.Unit != null && $scope.modelList.Unit != '') {
                $scope.errorUnit = false;
            }
            if ($scope.packing == undefined || $scope.packing == null || $scope.packing == '') {
                $scope.packing = item.Name;
                $scope.modelList.PackType = item.Name;
            }
        }
        if (SelectType == "ProductRelative") {
            $scope.chooseCoilInStore = true;
            var check = $scope.listProduct.filter(k => k.Code === item.ProductCode);
            if (check.length == 1) {
                $scope.modelList.ProductCode = item.ProductCode;
                $scope.modelList.SalePrice = item.SalePrice;
                $scope.modelList.Quantity = item.Quantity;
                $scope.modelList.Unit = check[0].Unit;
                $scope.modelList.UnitName = check[0].UnitName;
                $scope.modelList.ProductName = check[0].Name;
                $scope.modelList.ProductType = check[0].ProductType;
                $scope.modelList.ImpType = check[0].ImpType;
                $scope.modelList.ProductLot = item.ProductLot;
                validationProduct($scope.modelList);
                createProductQrCode();
            }

            //var listRelative = $scope.listProductRelative.filter(k => k.CoilRelative === item.Code);
            //var no = listRelative.length + 1;
            //$scope.modelList.ProductCoil = item.Code + "_" + no;

            createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.sProductCoil);
        }
        if (SelectType == "StoreCode") {
            if ($scope.model.StoreCodeSend == $scope.model.StoreCode) {
                $scope.model.StoreCodeSend = '';
                App.toastrError(caption.MIS_MSG_OTHER_IMPORT_WAREHOUSE_TRANSFER);
            }
            createTicketCode($scope.model.LotProductCode, $scope.model.StoreCode, $scope.model.UserImport);
            //$scope.model.ListProduct = [];
            //$scope.modelList = {
            //    ProductCode: '',
            //    ProductName: '',
            //    ProductQrCode: '',
            //    sProductQrCode: '',
            //    Quantity: null,
            //    Unit: '',
            //    UnitName: '',
            //    SalePrice: null,
            //    TaxRate: 10,
            //    Discount: 0,
            //    Commission: 0,
            //};
            if ($scope.model.StoreCode != undefined && $scope.model.StoreCode != null && $scope.model.StoreCode != '') {
                $scope.errorStoreCode = false;
            }
        }
        if (SelectType == "Reason") {
            if ($scope.model.Reason != undefined && $scope.model.Reason != null && $scope.model.Reason != '') {
                $scope.errorReason = false;
            }
            if ($scope.model.Reason == 'IMP_FROM_BUY') {
                $scope.model.StoreCodeSend = '';
            }
            else {
                $scope.model.CusCode = '';
            }
        }
        if (SelectType == "StoreCodeSend") {
            if ($scope.model.StoreCodeSend == $scope.model.StoreCode) {
                $scope.model.StoreCodeSend = '';
                App.toastrError(caption.MIS_MSG_OTHER_IMPORT_WAREHOUSE_TRANSFER);
            }
            if ($scope.model.StoreCodeSend != undefined && $scope.model.StoreCodeSend != null && $scope.model.StoreCodeSend != '') {
                $scope.errorStoreCodeSend = false;


            }
        }
        if (SelectType == "UserImport") {
            createTicketCode($scope.model.LotProductCode, $scope.model.StoreCode, $scope.model.UserImport);
            if ($scope.model.UserImport != undefined && $scope.model.UserImport != null && $scope.model.UserImport != '') {
                $scope.errorUserImport = false;
            }
        }
    }

    $scope.changeCoil = function () {
        createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.sProductCoil);
    }

    $scope.change = function (type) {
        switch (type) {
            //Quy cách
            case 'ruleCoil':
                createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.RuleCoil);
                break;
            //case 'price':
            //    if ($scope.modelList.SalePrice == null || $scope.modelList.SalePrice == '' || $scope.modelList.SalePrice == undefined) {
            //        $scope.errorSalePrice = true;
            //    } else {
            //        $scope.errorSalePrice = false;
            //    }
            //    break;
            case 'quantityImp':
                if ($scope.modelList.QuantityImp == null || $scope.modelList.QuantityImp == '' || $scope.modelList.QuantityImp == undefined) {
                    $scope.errorQuantityImp = true;
                } else {
                    $scope.errorQuantityImp = false;
                }
                break;
            default:
        }
    }

    $scope.changeTilte = function () {
        if ($scope.model.Title != undefined && $scope.model.Title != null && $scope.model.Title != '') {
            $scope.errorTitle = false;
        } else {
            $scope.errorTitle = true;
        }

    }

    $scope.openLog = function () {
        dataserviceImpStore.getUpdateLog($scope.model.TicketCode, function (rs) {
            rs = rs.data;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: ctxfolderImpStore + '/showLog.html',
                controller: 'showLog',
                backdrop: 'static',
                size: '70',
                resolve: {
                    para: function () {
                        return rs.Object;
                    }
                }
            });
            modalInstance.result.then(function (d) {
            }, function () { });
        });
    }

    $scope.showAddCoil = function (item, index) {
        var objPara = {
            item: item,
            rootId: $rootScope.rootId,
            productName: item.ProductName,
            ticketCode: $scope.model.TicketCode,
            model: $scope.model
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderImpStore + '/showAddCoil.html',
            controller: 'showAddCoil',
            backdrop: 'static',
            size: '65',
            resolve: {
                para: function () {
                    return {
                        objPara
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.initLoad();
        }, function () {
        });
    }

    $scope.showListCoil = function () {
        if ($scope.isShow == true) {
            $scope.isShow = false;
            $scope.isShowListCoil = true;
        }
        else {
            $scope.isShow = true;
            $scope.isShowListCoil = false;
        }
    }

    //Xử lý phần disable khi danh mục sản phẩm có hình thức nhập là cuộn, thùng
    $scope.disableFiled = function (type) {

        if (type != "Thùng" && type != "Cuộn") {
            $scope.disableProductCoil = true;
            $scope.disableProductRelative = true;
            $scope.disableListCoil = true;
        } else {
            $scope.disableProductCoil = false;
            $scope.disableProductRelative = false;
            $scope.disableListCoil = false;
            $scope.allowAddCoil = true;
        }
    }

    $scope.submit = function () {
        validationSelect($scope.model);
        if ($scope.addform.validate() && !validationSelect($scope.model).Status) {
            var msg = $rootScope.checkData($scope.model);
            if (msg.Status) {
                App.toastrError(msg.Title);
                return;
            } else {

                dataserviceImpStore.update($scope.model, function (rs) {
                    rs = rs.data;
                    if (rs.Error) {
                        App.toastrError(rs.Title);
                    } else {
                        $scope.isDisable = true;
                        App.toastrSuccess(rs.Title);
                        dataserviceImpStore.updateStatusWF("IMPORT_STORE", $scope.model.TicketCode, $scope.model.Status, $scope.model.ActRepeat, function (rs) {
                            if ($scope.model.Status != "FINAL_DONE") {
                                dataserviceImpStore.getActionStatus($scope.model.TicketCode, function (rs) {
                                    rs = rs.data;
                                    var json = JSON.parse(rs[0].StatusLog);
                                    var arr = [];
                                    arr.push(json[json.length - 1]);
                                    $scope.loghis = arr;
                                    $scope.model.Status = $scope.loghis[0].StatusCode;
                                })
                                dataserviceImpStore.getItemHeaderWithCode($scope.model.TicketCode, function (rs) {
                                    data = rs.data;
                                    $scope.lstStep = data.list;
                                    if (data.editrole != undefined && data.editrole != "" && data.editrole != null && data.editrole == true) {
                                        $('.detail').removeClass('dis');
                                    }
                                    else {
                                        $scope.roleedit = false;
                                        $('.detail').addClass('dis');
                                    }
                                    setTimeout(function () {
                                        $('#progressbar li').css('width', 'calc(100%/' + data.list.length + ')');
                                        $('.' + $scope.lstStep[$scope.lstStep.length - 1].IntsCode + '').addClass('end');
                                        for (var i = 0; i < $scope.lstStep.length; i++) {
                                            if ($scope.lstStep[i].Status == "STATUS_ACTIVITY_APPROVED") {
                                                $('.' + $scope.lstStep[i].IntsCode + '').addClass('active');
                                            }
                                        }
                                        if (data.current != undefined && data.current != "" && data.current != null) {
                                            setTimeout(function () {
                                                $('.' + data.current + '').addClass('active2');
                                            }, 5);
                                        }
                                    }, 5);

                                    if (data.com != undefined && data.com != "" && data.com != null) {
                                        $scope.lstStatus = data.com
                                    }
                                    else {
                                        $scope.check = true;
                                    }
                                })
                                $scope.showAct = false;
                            }
                        })
                    }
                });
            }
        }
    }

    $rootScope.reloadData = function () {
        if ($rootScope.rootId != null && $rootScope.rootId != undefined && $rootScope.rootId != '') {
            var id = parseFloat($rootScope.rootId);
            dataserviceImpStore.getItem(id, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    $scope.model = rs.Object.Header;
                    $scope.model.ListProduct = rs.Object.ListProduct;
                    $scope.model.ListCoil = [];
                    for (var i = 0; i < $scope.model.ListProduct.length; i++) {
                        if ($scope.model.ListProduct[i].ListCoil.length > 0) {
                            for (var j = 0; j < $scope.model.ListProduct[i].ListCoil.length; j++) {
                                $scope.model.ListProduct[i].ListCoil[j].ValueCoil = $scope.model.ListProduct[i].ListCoil[j].Size;

                                var productCoil = $scope.model.ListProduct[i].ListCoil[j].ProductCoil;
                                $scope.model.ListProduct[i].ListCoil[j].RuleCoil = productCoil.split("_")[productCoil.split("_").length - 2];
                            }
                        }
                        $scope.model.ListProduct[i].sQuantityCoil = $scope.model.ListProduct[i].ListCoil.length;
                        $scope.model.ListProduct[i].QuantityOrder = $scope.model.ListProduct[i].Quantity - $scope.model.ListProduct[i].QuantityIsSet;
                    }
                    $rootScope.storeCode = $scope.model.StoreCode;
                    if ($scope.model.LotProductCode != '') {
                        $scope.IsEnabledImportLot = true;
                        $rootScope.IsEnabledImportLot = true;

                        dataserviceImpStore.getListLotProduct4Update($scope.model.LotProductCode, function (rs) {
                            rs = rs.data;
                            $scope.listLotProduct = rs;
                        });
                    }
                    else {
                        dataserviceImpStore.getListLotProduct(function (rs) {
                            rs = rs.data;
                            $scope.listLotProduct = rs;
                        });
                    }

                    createCoilCode("", "", "");
                }
            });
        }
    }

    $rootScope.updateOrderItemCoil = function (id) {
        var item = $scope.model.ListCoil.find(function (element) {
            if (element.Id == id) return true;
        });
        if (item) {
            if (item.IsOrder == false) {
                item.IsOrder = true;
            } else {
                item.IsOrder = false;
            }
        }
    }

    $scope.orderingItemCoil = function (item) {
        //var item = $scope.model.ListCoil[index];
        if (item != null) {
            dataserviceImpStore.checkProductInStoreCoil(item.ProductQrCode, item.ProductCoil, function (rs) {
                rs = rs.data;
                if (rs) {
                    var getStore = $scope.listStore.find(function (element) {
                        if (element.Code == $scope.model.StoreCode) return true;
                    });
                    var objPara = {
                        item: item,
                        rootId: $rootScope.rootId,
                        productName: item.ProductName,
                        productCoil: item.ProductCoil,
                        storeName: getStore ? getStore.Name : ''
                    }

                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: ctxfolderImpStore + '/orderProduct.html',
                        controller: 'orderProduct',
                        backdrop: 'static',
                        size: '70',
                        resolve: {
                            para: function () {
                                return {
                                    objPara
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (id) {
                        //$rootScope.reloadData();
                        $rootScope.refeshData(id);
                    }, function () {
                    });
                } else {
                    App.toastrError(caption.MIS_MSG_PRODUCT_NON_ADD_REQUEST_CHOSE_ADD);
                }
            });
        } else {
            App.toastrError(caption.MIST_ADD_PRODUCT_SAVE_BEFORE_SORT);
        }
    }

    $scope.orderingItem = function (index) {
        var item = $scope.model.ListProduct[index];
        for (var i = 0; i < item.ListCoil.length; i++) {
            if (item.ListCoil[i].Id == undefined) {
                App.toastrError(caption.MIST_LIST_ROLL_BOX_SAVE);
                return;
            }
        }
        if (item != null) {
            dataserviceImpStore.checkProductInStore(item.ProductQrCode, function (rs) {
                rs = rs.data;

                if (rs) {
                    var getStore = $scope.listStore.find(function (element) {
                        if (element.Code == $scope.model.StoreCode) return true;
                    });
                    var objPara = {
                        item: item,
                        rootId: $rootScope.rootId,
                        productName: item.ProductName,
                        productCoil: '',
                        storeName: getStore ? getStore.Name : ''
                    }
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: ctxfolderImpStore + '/orderProduct.html',
                        controller: 'orderProduct',
                        backdrop: 'static',
                        size: '60',
                        resolve: {
                            para: function () {
                                return {
                                    objPara
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (id) {
                        $scope.initLoad();
                    }, function () {
                    });
                } else {
                    App.toastrError(caption.MIS_MSG_PRODUCT_NON_ADD_REQUEST_CHOSE_ADD);
                }
            });
        } else {
            App.toastrError(caption.MIST_ADD_PRODUCT_SAVE_BEFORE_SORT);
        }
    }

    //Vatco: new order product warehouser
    $scope.orderProductVatCo = function (index) {
        var item = $scope.listProdDetail[index];
        if (item != null) {
            dataserviceImpStore.checkProductInStore(item.ProductQRCode, function (rs) {
                rs = rs.data;
                if (rs) {
                    var getStore = $scope.listStore.find(function (element) {
                        if (element.Code == $scope.model.StoreCode) return true;
                    });
                    var objPara = {
                        item: item,
                        rootId: $rootScope.rootId,
                        productName: item.ProductName,
                        productCoil: '',
                        storeName: getStore ? getStore.Name : ''
                    }
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: ctxfolderImpStore + '/orderProduct.html',
                        controller: 'orderProduct',
                        backdrop: 'static',
                        size: '60',
                        resolve: {
                            para: function () {
                                return {
                                    objPara
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (id) {
                        $scope.initLoad();
                        dataserviceImpStore.getProductDetail($scope.model.TicketCode, function (rs) {
                            rs = rs.data;
                            $scope.listProdDetail = rs;
                        })
                    }, function () {
                    });
                } else {
                    App.toastrError(caption.MIS_MSG_PRODUCT_NON_ADD_REQUEST_CHOSE_ADD);
                }
            });
        } else {
            App.toastrError(caption.MIST_ADD_PRODUCT_SAVE_BEFORE_SORT);
        }
    }

    $scope.viewQrCode = function (code) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderQrCode + '/qrViewerBase64.html',
            controller: function ($scope, $uibModalInstance) {
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.data = code;
                setTimeout(function () {
                    setModalDraggable('.modal-dialog');
                }, 200);
            },
            backdrop: 'static',
            size: '25',
        });
    }

    function createTicketCode(lot, store, user) {

    }

    function createProductQrCode() {
        var today = moment().format('DDMMYYYY-HHmm');
        //$scope.modelList.ProductQrCode = "LE_SP." + $scope.modelList.ProductCode + "_SL." + $scope.modelList.Quantity + "_T." + today;
        $scope.modelList.ProductQrCode = $scope.modelList.ProductCode + "_SL." + $scope.modelList.Quantity + "_T." + today;
        dataserviceImpStore.generatorQRCode($scope.modelList.ProductQrCode, function (result) {
            result = result.data;
            $scope.modelList.sProductQrCode = result;
        });
    }

    function createCoilCode(productCode, lot, rule) {
        if (productCode == "" || productCode == undefined || productCode == null)
            productCode = "";

        if (lot == "" || lot == undefined || lot == null)
            lot = "";

        if (rule == "" || rule == undefined || rule == null)
            rule = "";

        var no = 1;
        $scope.modelList.ProductCoil = $scope.model.TicketCode + "_" + productCode + "_" + rule + "_";
    }

    function validationProduct(data) {
        var mess = { Status: false, Title: "" }
        //Check null lô hàng khi chọn nhập theo lô
        if ($scope.modelList.ProductCode == undefined || $scope.modelList.ProductCode == null || $scope.modelList.ProductCode == '') {
            $scope.errorProductCode = true;
            mess.Status = true;
            mess.Title = caption.MIS_VALIDATE_CHOOSE_PRODUCT;
        } else {
            $scope.errorProductCode = false;
        }
        //if ($scope.modelList.Quantity == undefined || $scope.modelList.Quantity == null || $scope.modelList.Quantity == '') {
        //    $scope.errorQuantity = true;
        //    mess.Status = true;
        //    if (mess.Title != "")
        //        mess.Title = mess.Title + "</br>caption.MIS_VALIDATE_ENTER_VALUE";
        //    else
        //        mess.Title = caption.MIS_VALIDATE_ENTER_VALUE;
        //} else {
        //    $scope.errorQuantity = false;
        //}
        if ($scope.modelList.QuantityImp == undefined || $scope.modelList.QuantityImp == null || $scope.modelList.QuantityImp == '') {
            $scope.errorQuantityImp = true;
            mess.Status = true;
            mess.Title = "Số lượng không được bỏ trống";
        } else {
            $scope.errorQuantityImp = false;
        }

        if ($scope.modelList.Unit == undefined || $scope.modelList.Unit == null || $scope.modelList.Unit == '') {
            $scope.errorUnit = true;
            mess.Status = true;
            if (mess.Title != "")
                mess.Title = mess.Title + "</br>caption.MIS_VALIDATE_ENTER_PRICE";
            else
                mess.Title = caption.MIS_VALIDATE_ENTER_PRICE;
        }
        else {
            $scope.errorUnit = false;
        }
        //if ($scope.modelList.SalePrice == undefined || $scope.modelList.SalePrice == null || $scope.modelList.SalePrice == '') {
        //    $scope.errorSalePrice = true;
        //    mess.Status = true;
        //    if (mess.Title != "")
        //        mess.Title = mess.Title + "</br>caption.MIS_VALIDATE_ENTER_PRICE";
        //    else
        //        mess.Title = caption.MIS_VALIDATE_ENTER_PRICE;
        //} else {
        //    $scope.errorSalePrice = false;
        //}
        return mess;
    }

    function validationProductCoil(data) {
        var mess = { Status: false, Title: "" }
        if ($scope.modelList.ProductCoil == undefined || $scope.modelList.ProductCoil == null || $scope.modelList.ProductCoil == '') {
            $scope.errorProductCoil = true;
            mess.Status = true;
            if (mess.Title != "")
                mess.Title = mess.Title + "</br>MIST_VALDIATE_ADD_ROLL_BOX";
            else
                mess.Title = caption.MIST_VALDIATE_ADD_ROLL_BOX;
        } else {
            $scope.errorProductCoil = false;
        }

        return mess;
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        //Check null lô hàng khi chọn nhập theo lô
        if ($scope.IsEnabledImportLot == true && (data.LotProductCode == undefined || data.LotProductCode == null || data.LotProductCode == '')) {
            $scope.errorLotProductCode = true;
            mess.Status = true;
        } else {
            $scope.errorLotProductCode = false;
        }

        //Check null kho hàng
        if (data.StoreCode == undefined || data.StoreCode == null || data.StoreCode == '') {
            $scope.errorStoreCode = true;
            mess.Status = true;
        } else {
            $scope.errorStoreCode = false;
        }

        //Check null lý do
        if (data.Reason == undefined || data.Reason == null || data.Reason == '') {
            $scope.errorReason = true;
            mess.Status = true;
        } else {
            $scope.errorReason = false;
        }

        //Check null kho chuyển đến
        if ($scope.model.Reason == 'IMP_FROM_MOVE_STORE' && (data.StoreCodeSend == undefined || data.StoreCodeSend == null || data.StoreCodeSend == '')) {
            $scope.errorStoreCodeSend = true;
            mess.Status = true;
        } else {
            $scope.errorStoreCodeSend = false;
        }

        //Check null nhân viên nhập
        if (data.UserImport == undefined || data.UserImport == null || data.UserImport == '') {
            $scope.errorUserImport = true;
            mess.Status = true;
        } else {
            $scope.errorUserImport = false;
        }

        //Check title
        if (data.Title == undefined || data.Title == null || data.Title == '') {
            $scope.errorTitle = true;
            mess.Status = true;
        } else {
            $scope.errorTitle = false;
        }

        return mess;
    };

    function loadDate() {
        //$("#NextTimePayment").datepicker({
        //    inline: false,
        //    autoclose: true,
        //    format: "dd/mm/yyyy",
        //    fontAwesome: true,
        //});
        $("#InsurantTime").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        });
        $("#TimeTicketCreate").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        });
        //var today = new Date(new Date());
        //$('#TimeTicketCreate').datepicker('setStartDate', today);
        //$('#TimeTicketCreate').datepicker('setEndDate', today);
        //$('#NextTimePayment').datepicker('setStartDate', today);
        //$('#InsurantTime').datepicker('setStartDate', today);

        setModalMaxHeight('.modal');
        setModalDraggable('.modal-dialog');
    }

    function loadPoper() {
        $('[data-toggle="popover"]').popover()
    }

    setTimeout(function () {
        loadDate();
        loadPoper();
    }, 200);

    $scope.export = function () {
        location.href = "/Admin/MaterialImpStore/ExportExcelProduct?"
            + "ticketCode=" + $scope.model.TicketCode
    }

    //Print pdf
    $scope.print = function () {
        var department = "<table >" +
            "<tbody >" +
            "<tr>" +
            '<td style="width: 237px; ">' +
            "<p><strong>Chi nhánh: " + $scope.infoUserImport.BranchName + "</strong></p>" +
            "<p><strong>Phòng ban: " + $scope.infoUserImport.Department + "</strong></p>" +
            "</td>" +
            '<td style="width: 335px; ">&nbsp;</td>' +
            "</tr>" +
            "</tbody>" +
            "</table> ";

        var infoTime = $scope.model.TimeTicketCreate.split("/");
        var header = "<table>" +
            "<tbody>" +
            "<tr>" +
            '<td style="width: 134px;">' +
            "<p>&nbsp;</p>" +
            "</td>" +
            '<td style="width: 225px;">' +
            '<p style="text-align: right; margin-right: -40px;"><strong>PHIẾU NHẬP KHO</strong></p>' +
            '<p>Ngày ' + infoTime[0] + ' tháng ' + infoTime[1] + ' năm ' + infoTime[2] + '</p>' +
            '<p><strong>Số: ' + $scope.model.TicketCode + '</strong></p>' +
            '</td>' +
            '<td style="width: 207px;">' +
            '<p style= ""><em>Nợ..........................</em><em>Có..........................</em></p>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>';

        //$scope.listUserImport
        var givenName = "";
        for (var i = 0; i < $scope.listUserImport.length; i++) {
            if ($scope.listUserImport[i].Code === $scope.model.UserImport) {
                givenName = $scope.listUserImport[i].Name;
                break;
            }
        }
        var storeName = "";
        for (var i = 0; i < $scope.listStore.length; i++) {
            if ($scope.listStore[i].Code === $scope.model.StoreCode) {
                storeName = $scope.listStore[i].Name;
                break;
            }
        }
        var infor = '<p>- Người nhập: <strong>' + givenName + '</strong></p>' +
            '<p>- Ghi chú: ' + $scope.model.Note + '</p>' +
            '<p>Nhập tại kho: <strong>' + storeName + '</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Địa điểm.............................................</p>';

        var beginProduct = '<table style="border-collapse: collapse;height: auto; width: 100%;" border="1">' +
            '<tbody>' +
            '<tr>' +
            '<td rowspan="2" width="39">' +
            '<p>STT</p>' +
            '</td>' +
            '<td rowspan="2" width="169">' +
            '<p>Tên vật tư, hàng hóa</p>' +
            '</td>' +
            '<td rowspan="2" width="41">' +
            '<p>Mã số</p>' +
            '</td>' +
            '<td rowspan="2" width="50">' +
            '<p>Đơn vị tính</p>' +
            '</td>' +
            '<td colspan="2" width="132">' +
            '<p>Số lượng</p>' +
            '</td>' +
            '<td rowspan="2" width="47">' +
            '<p>Đơn giá</p>' +
            '</td>' +
            '<td rowspan="2" width="104">' +
            '<p>Thành tiền</p>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td width="70">' +
            '<p>Theo chứng từ</p>' +
            '</td>' +
            '<td width="62">' +
            '<p>Thực nhập</p>' +
            '</td>' +
            '</tr>';


        var dataProduct = "";
        var stt = 1;
        for (var i = 0; i < $scope.listProdDetail.length; i++) {
            var salePrice = $scope.listProdDetail[i].SalePrice + "";
            var totalPrice = ($scope.listProdDetail[i].SalePrice * $scope.listProdDetail[i].Quantity) + "";
            dataProduct += '<tr>' +
                '<td width="39">' +
                '<p>' + stt + '</p>' +
                '</td>' +
                '<td width="169">' +
                '<p>' + $scope.listProdDetail[i].ProductName + '</p>' +
                '</td>' +
                '<td width="41">' +
                '<p>' + $scope.listProdDetail[i].ProductCode + '</p>' +
                '</td>' +
                '<td width="50">' +
                '<p>' + $scope.listProdDetail[i].Unit + '</p>' +
                '</td>' +
                '<td width="70">' +
                '<p>' + $scope.listProdDetail[i].Quantity + '</p>' +
                '</td>' +
                '<td width="62">' +
                '<p>' + $scope.listProdDetail[i].Quantity + '</p>' +
                '</td>' +
                '<td width="47">' +
                '<p>' + formatNumber(salePrice) + '</p>' +
                '</td>' +
                '<td width="104">' +
                '<p>' + formatNumber(totalPrice) + '</p>' +
                '</td>' +
                '</tr>';
            stt++;
        }

        var endDataProduct = '</tbody>' +
            '</table >';

        var sign = '<p>- Tổng số tiền (viết bằng chữ):..................................................................</p>' +
            '<p>- Số chứng từ gốc kèm theo:....................................................................</p>' +
            '<table style="width: 100%; height: 60px;">' +
            '<tbody>' +
            '<tr style="height: 45px;">' +
            '<td style="width: 296.008px; height: 85px; padding-left: 10px;">' +
            '<p><strong>Người lập phiếu</strong><br /><em>(Ký, họ tên)</em></p>' +
            '</td>' +
            '<td style="width: 296.008px; height: 85px;">' +
            '<p><strong>Người giao hàng</strong><br /><em>(Ký, họ tên)</em></p>' +
            '</td>' +
            '<td style="width: 186.758px; height: 85px;">' +
            '<p><strong>Thủ kho</strong><br /><em>(Ký, họ tên)</em></p>' +
            '</td>' +
            '<td style="width: 296.758px; height: 85px; margin-top: 15px;">' +
            '<p><strong>Kế toán trưởng</strong><br /><em>(Ký, họ tên)</em></p>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>';

        var frame1 = document.createElement('iframe');
        document.body.appendChild(frame1);
        var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;

        var content = department + header + infor + beginProduct + dataProduct + endDataProduct + sign;

        frameDoc.document.write('<style>@page{margin: 30px;size: auto;}</style>' +
            '<body onload="window.print()">' + content + '</body>');
        frameDoc.document.close();
        setTimeout(function () {
            document.body.removeChild(frame1);
        }, 1500);
    }

    //Print
    $scope.printProd = function () {
        $rootScope.listQRCode = [];
        $rootScope.listQRCode = $scope.listProdDetail;
        if ($rootScope.listQRCode.length > 0) {
            var listQrCode = "";
            for (var j = 0; j < $rootScope.listQRCode.length; j++) {
                var margin_bottom = -14;
                listQrCode = listQrCode + '<div class="col-md-2" style="text-align: center;margin-bottom:10px;"> ' +
                    '<img src="data:image/png;base64,' + $rootScope.listQRCode[j].sProductQrCode + '"width="125" height="125" style="margin-bottom:' + margin_bottom + 'px;" /> ' +
                    '<p class="textQr">' + $rootScope.listQRCode[j].ProductName + '<p/>' +
                    '</div>';
            }
            var mainWindow = window.open('', '');
            mainWindow.document.write('<html><head><title></title>');
            mainWindow.document.write('<style type="text/css" media="print">@page {size: auto; margin: 0mm;}' +
                '.col-md-2{width: 16.66667%;float: left;} .textQr{font-family:verdana, arial, sans-serif;font-size:6px;word-break:break-all;}</style >');
            mainWindow.document.write('</head><body onload="window.print();window.close()">');
            mainWindow.document.write(listQrCode);
            mainWindow.document.write('</body></html>');
            mainWindow.document.close();
        } else {
            App.toastrError("Chưa có sản phẩm trong phiếu nhập kho");
        }
    };

    function formatNumber(n) {
        return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
});

app.controller('editProdCustom', function ($scope, $rootScope, $compile, $controller, $uibModal, $uibModalInstance, dataserviceMaterial, para) {
    $scope.isCustom = true;
    $rootScope.prodCustomUuid = generateUUID();
    $controller('editProd', { $scope: $scope, para: para, $uibModalInstance: $uibModalInstance });
    $scope.header = "Tùy chỉnh thiết bị nhập";
    $scope.originModel = angular.copy($scope.model);
    $scope.submit = function () {
        console.log('submit custom');
        if ($rootScope.listProductAttributes) {
            $scope.model.ListProductAttributes = $rootScope.listProductAttributes;
        }
        if ($rootScope.listProductComponents) {
            $scope.model.listProductComponents = $rootScope.listProductComponents;
        }
        var diffObj = diff($scope.originModel, $scope.model);
        $uibModalInstance.close(diffObj);
    }
    function diff(obj1, obj2) {
        const result = {};
        if (Object.is(obj1, obj2)) {
            return undefined;
        }
        if (!obj2 || typeof obj2 !== 'object') {
            return obj2;
        }
        Object.keys(obj1 || {}).concat(Object.keys(obj2 || {})).forEach(key => {
            if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
                result[key] = obj2[key];
            }
            if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
                const value = diff(obj1[key], obj2[key]);
                if (value !== undefined) {
                    result[key] = value;
                }
            }
        });
        return result;
    }
    //Load init date
    function validationSelect(data) {
        var mess = { Status: false, Title: "" };

        if (data.Unit == "") {
            $scope.errorUnit = true;
            mess.Status = true;
        } else {
            $scope.errorUnit = false;

        }
        if (data.ImpType == "" || data.ImpType == null) {
            $scope.errorImpType = true;
            mess.Status = true;
        } else {
            $scope.errorImpType = false;
        }
        if (data.GroupCode == "") {
            $scope.errorGroupCode = true;
            mess.Status = true;
        } else {
            $scope.errorGroupCode = false;

        }
        if (data.TypeCode == "") {
            $scope.errorTypeCode = true;
            mess.Status = true;
        } else {
            $scope.errorTypeCode = false;
        }
        if ($rootScope.patternPacking.test(data.Packing)) {
            $scope.errorPacking = false;
        } else {
            mess.Status = true;
            $scope.errorPacking = true;
        }
        //if (data.Size != null && data.Size != '' && data.Size != undefined) {
        //    var partternSize = /^[0-9]*(\s)?(x|X|\*)(\s)?[0-9]*$/;
        //    if (!partternSize.test(data.Size)) {
        //        mess.Title = mess.Title.concat(" - ", caption.MLP_VALIDATE_SIZE_FORMAT, "<br/>");
        //        $scope.errorSize = true;
        //        mess.Status = true;
        //    } else {
        //        $scope.errorSize = false;
        //    }
        //} else {
        //    $scope.errorSize = false;
        //}
        return mess;
    };
    function loadDate() {
        $("#ForeCastTime").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        });
        //var today = new Date(new Date());
        //$('#ForeCastTime').datepicker('setStartDate', today);
        //$('#ForeCastTime').datepicker('update', new Date());
        //$('#ForeCastTime').datepicker('setEndDate', today);
        //$scope.model.TimeTicketCreate = $filter('date')(new Date(today), 'dd/MM/yyyy');
        //$('#ForeCastTime').datepicker('setStartDate', today);

        setModalMaxHeight('.modal');
        setModalDraggable('.modal-dialog');
    }
    function ckEditer() {
        var editor = CKEDITOR.replace('ckEditorItem', {
            cloudServices_tokenUrl: '/MobileApp/Token',
            cloudServices_uploadUrl: '/MobileApp/UploadFile',
            filebrowserBrowseUrl: '',
            filebrowserUploadUrl: '/MobileApp/Upload',
            embed_provider: '/uploader/upload.php'
        });
    }

    setTimeout(function () {
        //loadDate();
        //ckEditer();
    }, 200);
});

app.controller('viewProdCustom', function ($scope, $rootScope, $compile, $controller, $uibModal, $uibModalInstance, dataserviceMaterial, para) {
    $scope.isCustom = true;
    $scope.viewCustom = true;
    $controller('editProd', { $scope: $scope, para: para, $uibModalInstance: $uibModalInstance });
    $scope.header = "Xem tùy chỉnh thiết bị nhập";
    $scope.originModel = angular.copy($scope.model);
    $scope.prodCustomJson = para.ProdCustomJson;
    $scope.submit = function () {
        //console.log('submit custom');
        //var diffObj = diff($scope.originModel, $scope.model);
        //$uibModalInstance.close(diffObj);
    }
    function diff(obj1, obj2) {
        const result = {};
        if (Object.is(obj1, obj2)) {
            return undefined;
        }
        if (!obj2 || typeof obj2 !== 'object') {
            return obj2;
        }
        Object.keys(obj1 || {}).concat(Object.keys(obj2 || {})).forEach(key => {
            if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
                result[key] = obj2[key];
            }
            if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
                const value = diff(obj1[key], obj2[key]);
                if (value !== undefined) {
                    result[key] = value;
                }
            }
        });
        return result;
    }
    //Load init date
    function validationSelect(data) {
        var mess = { Status: false, Title: "" };

        if (data.Unit == "") {
            $scope.errorUnit = true;
            mess.Status = true;
        } else {
            $scope.errorUnit = false;

        }
        if (data.ImpType == "" || data.ImpType == null) {
            $scope.errorImpType = true;
            mess.Status = true;
        } else {
            $scope.errorImpType = false;
        }
        if (data.GroupCode == "") {
            $scope.errorGroupCode = true;
            mess.Status = true;
        } else {
            $scope.errorGroupCode = false;

        }
        if (data.TypeCode == "") {
            $scope.errorTypeCode = true;
            mess.Status = true;
        } else {
            $scope.errorTypeCode = false;
        }
        if ($rootScope.patternPacking.test(data.Packing)) {
            $scope.errorPacking = false;
        } else {
            mess.Status = true;
            $scope.errorPacking = true;
        }
        //if (data.Size != null && data.Size != '' && data.Size != undefined) {
        //    var partternSize = /^[0-9]*(\s)?(x|X|\*)(\s)?[0-9]*$/;
        //    if (!partternSize.test(data.Size)) {
        //        mess.Title = mess.Title.concat(" - ", caption.MLP_VALIDATE_SIZE_FORMAT, "<br/>");
        //        $scope.errorSize = true;
        //        mess.Status = true;
        //    } else {
        //        $scope.errorSize = false;
        //    }
        //} else {
        //    $scope.errorSize = false;
        //}
        return mess;
    };
    function loadDate() {
        $("#ForeCastTime").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        });
        //var today = new Date(new Date());
        //$('#ForeCastTime').datepicker('setStartDate', today);
        //$('#ForeCastTime').datepicker('update', new Date());
        //$('#ForeCastTime').datepicker('setEndDate', today);
        //$scope.model.TimeTicketCreate = $filter('date')(new Date(today), 'dd/MM/yyyy');
        //$('#ForeCastTime').datepicker('setStartDate', today);

        setModalMaxHeight('.modal');
        setModalDraggable('.modal-dialog');
    }
    function ckEditer() {
        var editor = CKEDITOR.replace('ckEditorItem', {
            cloudServices_tokenUrl: '/MobileApp/Token',
            cloudServices_uploadUrl: '/MobileApp/UploadFile',
            filebrowserBrowseUrl: '',
            filebrowserUploadUrl: '/MobileApp/Upload',
            embed_provider: '/uploader/upload.php'
        });
    }

    setTimeout(function () {
        //loadDate();
        //ckEditer();
    }, 200);
});

app.controller('showAddCoil', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceImpStore, $location, para, $filter) {
    $scope.isDisable = false;
    $scope.isEdit = false;
    $scope.IsEnabledImportLot = false;
    $scope.modelDisable = true;
    $scope.isDelete = true;

    $scope.modelUpdate = {};
    $scope.disableProductCode = false;
    $scope.disableProductCoil = false;
    $scope.disableProductRelative = false;
    $scope.disableListCoil = false;
    $scope.isCoil = true;
    $scope.allowAddCoil = false;
    $scope.isShowListCoil = true;
    $scope.isShow = true;
    $scope.showCoil = true;

    $scope.listProductType = [];
    $scope.isShowListCoil = true;
    $scope.isShow = true;
    $scope.isInsertCoil = false;

    $scope.listProductRelative = [];
    $scope.chooseCoilInStore = false;
    $scope.quantityCheck = 0;
    $scope.quantityLimit = 0;
    $scope.model = {
        Title: '',
        StoreCode: '',
        CusCode: '',
        Reason: 'IMP_FROM_BUY',
        StoreCodeSend: '',
        Currency: 'CURRENCY_VND',
        PaymentStatus: '',
        UserImport: '',
        Note: '',
        UserSend: '',
        InsurantTime: '',
        LotProductCode: '',
        TicketCode: para.objPara.ticketCode,
        TimeTicketCreate: $filter('date')(new Date(), 'dd/MM/yyyy'),
        ListProduct: [],
        ListCoil: []
    }
    $scope.modelList = {
        ProductCode: '',
        ProductName: '',
        ProductQrCode: '',
        sProductQrCode: '',
        QuantityOrder: null,
        Quantity: null,
        Unit: '',
        UnitName: '',
        SalePrice: null,
        ImpType: '',
        ListCoil: []
    };

    $scope.cancel = function () {
        $uibModalInstance.close('');
        $rootScope.refeshData($rootScope.rootId);
    }
    $scope.addCoil = function () {
        //Check null
        if ($scope.modelList.ValueCoil == undefined || $scope.modelList.ValueCoil == null || $scope.modelList.ValueCoil == '' ||
            $scope.modelList.QuantityCoil == undefined || $scope.modelList.QuantityCoil == null || $scope.modelList.QuantityCoil == ''
            || $scope.modelList.RuleCoil == undefined || $scope.modelList.RuleCoil == null || $scope.modelList.RuleCoil == ''
            || $scope.modelList.ProductLot == undefined || $scope.modelList.ProductLot == null || $scope.modelList.ProductLot == ''
        ) {
            App.toastrError(caption.MIST_VALIDATE_REQUIRE_INFORMATION);
        }
        else {
            var indexCheck = -1;
            if (indexCheck > -1) {
                App.toastrError(caption.MES_MSG_PRODUCT_ADD_CATEGORY);
            }
            else {
                $scope.modelList.QuantityCoil = parseInt($scope.modelList.QuantityCoil);
                if ($scope.modelList.QuantityCoil > 100) {
                    App.toastrError(caption.MIST_VALIDATE_ADD_LIMIT100);
                    return;
                }

                createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.RuleCoil);
                var quantityAdd = $scope.modelList.QuantityCoil;
                $scope.quantityCheck = $scope.quantityCheck + (quantityAdd * parseFloat($scope.modelList.ValueCoil));
                if ($scope.quantityLimit < $scope.quantityCheck) {
                    $scope.quantityCheck = $scope.quantityCheck - (quantityAdd * parseFloat($scope.modelList.ValueCoil));
                    App.toastrError(caption.MIS_MSG_AMOUNT_EXCEED1);
                    $scope.isInsertCoil = false;
                    return;
                }
                for (var i = 0; i < quantityAdd; i++) {
                    var addItem = {
                        ProductCode: $scope.modelList.ProductCode,
                        ProductName: $scope.modelList.ProductName,
                        ProductType: $scope.modelList.ProductType,
                        ProductQrCode: $scope.modelList.ProductQrCode,
                        //sProductQrCode: $scope.modelList.sProductQrCode,
                        Quantity: $scope.modelList.Quantity,
                        Unit: $scope.modelList.Unit,
                        UnitName: $scope.modelList.UnitName,

                        SalePrice: $scope.modelList.SalePrice,

                        QuantityIsSet: 0,
                        QuantityNeedSet: $scope.modelList.QuantityNeedSet,

                        ProductCoil: $scope.modelList.ProductCoil,
                        sProductCoil: $scope.modelList.sProductCoil,
                        ProductLot: $scope.modelList.ProductLot,
                        ImpType: $scope.modelList.ImpType,
                        ProductImpType: $scope.modelList.ProductImpType,
                        ValueCoil: $scope.modelList.ValueCoil,
                        UnitCoil: $scope.modelList.UnitCoil,
                        QuantityCoil: $scope.modelList.QuantityCoil,
                        RuleCoil: $scope.modelList.RuleCoil,
                        ProductCoilRelative: $scope.modelList.ProductCoilRelative,
                        IsOrder: false,
                    };
                    $scope.model.ListCoil.push(addItem);
                    $scope.modelList.Quantity = $scope.modelList.Quantity + $scope.modelList.ValueCoil;
                    $scope.isInsertCoil = true;
                }

                if ($scope.isInsertCoil) {
                    App.toastrSuccess(caption.COM_ADD_SUCCESS);
                }
            }
        }
    }
    $scope.initItem = function (item) {
        $scope.disableProductCode = true;
        $scope.modelUpdate = item;
        $scope.isEdit = true;
        $scope.modelList.ProductCode = item.ProductCode;
        $scope.modelList.ProductType = item.ProductType;
        $scope.modelList.ProductName = item.ProductName;
        //$scope.modelList.ProductQrCode = item.ProductQrCode;
        //$scope.modelList.sProductQrCode = item.sProductQrCode;
        $scope.modelList.Quantity = item.Quantity;
        $scope.modelList.QuantityPoCount = item.QuantityPoCount;
        $scope.modelList.QuantityNeedSet = item.QuantityNeedSet;
        $scope.modelList.Unit = item.Unit;
        $scope.modelList.UnitName = item.UnitName;
        $scope.modelList.ProductLot = item.ProductLot;
        $scope.modelList.SalePrice = item.SalePrice;
        $scope.modelList.ImpType = item.ImpType;
        //$scope.modelList.PackType = packType;
        $scope.modelList.ProductCoilRelative = item.ProductCoilRelative;
        $scope.model.ListCoil = item.ListCoil;

        var quantityCoil = 0;
        $scope.quantityLimit = $scope.modelList.QuantityNeedSet;
        for (var i = 0; i < $scope.model.ListCoil.length; i++) {
            $scope.quantityLimit = $scope.quantityLimit + $scope.model.ListCoil[i].ValueCoil;
            $scope.quantityCheck = $scope.quantityCheck + $scope.model.ListCoil[i].ValueCoil;
            quantityCoil = quantityCoil + $scope.model.ListCoil[i].ValueCoil;
        }

        if (quantityCoil < $scope.modelList.Quantity)
            $scope.modelList.Quantity = quantityCoil;

        if (item.ImpType != '' && item.ImpType != null && item.ImpType != undefined) {
            $scope.listProductType = item.ImpType.split(",");
            if ($scope.listProductType.length > 0) {
                $scope.showCoil = true;
                $scope.modelList.UnitCoil = $scope.listProductType[$scope.listProductType.length - 1];
                if ($scope.listProductType.length == 1) {
                    $scope.disableProductImpType = true;
                    $scope.disableValueCoil = true;
                    $scope.disableUnitCoil = true;
                    //$scope.disableQuantityCoil = true;
                    //$scope.isODD = true;
                    //$scope.isDelete = false;

                    $scope.modelList.ProductImpType = $scope.modelList.UnitCoil;
                    $scope.modelList.ValueCoil = 1;
                    $scope.modelList.QuantityCoil = item.Quantity;
                    $scope.modelList.RuleCoil = 1;
                    $scope.modelList.ProductLot = 1;
                    //if ($scope.model.ListCoil.length == 0)
                    //    $scope.addCoil();
                } else {
                    //$scope.isODD = false;
                    $scope.isDelete = true;
                    $scope.disableProductImpType = false;
                    $scope.disableValueCoil = false;
                    $scope.disableUnitCoil = true;
                    $scope.disableQuantityCoil = false;

                    $scope.modelList.ProductImpType = '';
                    $scope.modelList.ValueCoil = '';
                    $scope.modelList.QuantityCoil = '';
                    $scope.modelList.RuleCoil = '';
                    $scope.modelList.ProductLot = '';
                }
            } else {
                //$scope.isODD = false;
                $scope.showCoil = false;
                //$scope.isDelete = false;
            }
        } else {
            App.toastrError(caption.MIST_VALIDATE_IN_PRODUCT_TYPE);
        }

        $scope.disableFiled(item.ImpType);
    }
    //Xử lý phần disable khi danh mục sản phẩm có hình thức nhập là cuộn, thùng
    $scope.disableFiled = function (type) {
        if (type != "Thùng" && type != "Cuộn") {
            $scope.disableProductCoil = true;
            $scope.disableProductRelative = true;
            $scope.disableListCoil = true;
        } else {
            $scope.disableProductCoil = false;
            $scope.disableProductRelative = false;
            $scope.disableListCoil = false;
            $scope.allowAddCoil = true;
        }
    }
    $scope.initLoad = function () {
        $scope.modelList = para.objPara.item;
        $scope.model = para.objPara.model;
        //dataserviceImpStore.getListUnit(function (rs) {
        //    rs = rs.data;
        //    $scope.listUnit = rs;
        //});
        dataserviceImpStore.getProductUnit(function (rs) {
            rs = rs.data;
            $scope.listUnit = rs;
        })

        dataserviceImpStore.getListProduct(function (rs) {
            rs = rs.data;
            $scope.listProduct = rs;
        });
        dataserviceImpStore.getListProductRelative(function (rs) {
            rs = rs.data;
            $scope.listProductRelative = rs;
        });

        createCoilCode("", "", "");

        $scope.initItem(para.objPara.item);
    }
    $scope.initLoad();

    $scope.add = function () {
        var msg = validationProduct($scope.modelList);
        if (msg.Status) {
            //App.toastrError(msg.Title);
            return;
        }
        if ($scope.model.ListCoil.length == 0) {
            App.toastrError(caption.MIST_VALIDATE_ROLL_BOX_BLANK);
            return;
        }
        //Check null
        if ($scope.modelList.ProductCode == undefined || $scope.modelList.ProductCode == null || $scope.modelList.ProductCode == '' ||
            $scope.modelList.Quantity == undefined || $scope.modelList.Quantity == null || $scope.modelList.Quantity == 0
            || $scope.modelList.SalePrice == undefined || $scope.modelList.SalePrice == null || $scope.modelList.SalePrice == ''
            //|| $scope.modelList.ProductLot == undefined || $scope.modelList.ProductLot == null
        ) {
            App.toastrError(caption.MIST_VALIDATE_REQUIRE_INFORMATION);
        }
        else {
            var indexCheck = -1;
            var elementCheck = $scope.model.ListProduct.find(function (element) {
                if (element.ProductCode == $scope.modelList.ProductCode && element.ProductType == $scope.modelList.ProductType && element.ProductCoil == $scope.modelList.ProductCoil) {
                    indexCheck = 0;
                    return element;
                }
            });
            if (indexCheck > -1) {
                App.toastrError(caption.MES_MSG_PRODUCT_ADD_CATEGORY);
            }
            else {

                //Tạo QrCode cho sản phẩm
                createProductQrCode();
                var addItem = {
                    ProductCode: $scope.modelList.ProductCode,
                    ProductName: $scope.modelList.ProductName,
                    ProductType: $scope.modelList.ProductType,
                    ProductQrCode: $scope.modelList.ProductQrCode,
                    sProductQrCode: $scope.modelList.sProductQrCode,
                    Quantity: $scope.modelList.Quantity,
                    Unit: $scope.modelList.Unit,
                    UnitName: $scope.modelList.UnitName,

                    SalePrice: $scope.modelList.SalePrice,

                    QuantityIsSet: 0,
                    QuantityNeedSet: $scope.modelList.QuantityNeedSet,

                    //TaxRate: $scope.modelList.TaxRate,
                    //Discount: $scope.modelList.Discount,
                    //Commission: $scope.modelList.Commission,
                    ProductCoil: $scope.modelList.ProductCoil,
                    sProductCoil: $scope.modelList.sProductCoil,
                    ProductLot: $scope.modelList.ProductLot,
                    ImpType: $scope.modelList.ImpType,
                    ImpType: $scope.modelList.ImpType,
                    ProductCoilRelative: $scope.modelList.ProductCoilRelative,
                    ////Tính toán
                    Total: $scope.modelList.Quantity * $scope.modelList.SalePrice,
                    //TaxTotal: ($scope.modelList.Quantity * $scope.modelList.SalePrice) * $scope.modelList.TaxRate / 100,
                    //DiscountTotal: ($scope.modelList.Quantity * $scope.modelList.SalePrice) * $scope.modelList.Discount / 100,
                    //CommissionTotal: ($scope.modelList.Quantity * $scope.modelList.SalePrice) * $scope.modelList.Commission / 100,
                    ListCoil: $scope.model.ListCoil,
                    QuantityCoil: $scope.model.ListCoil.length,
                    sQuantityCoil: $scope.model.ListCoil.length,
                    //PackType: packType
                };
                $scope.model.ListProduct.push(addItem);
            }
        }
    }
    $scope.editItem = function (item, index) {
        $scope.disableProductCode = true;
        $scope.modelUpdate = item;
        $scope.isEdit = true;
        $scope.modelList.ProductCode = item.ProductCode;
        $scope.modelList.ProductType = item.ProductType;
        $scope.modelList.ProductName = item.ProductName;
        //$scope.modelList.ProductQrCode = item.ProductQrCode;
        //$scope.modelList.sProductQrCode = item.sProductQrCode;
        $scope.modelList.Quantity = item.Quantity;
        $scope.modelList.QuantityPoCount = item.QuantityPoCount;
        $scope.modelList.QuantityNeedSet = item.QuantityNeedSet;
        $scope.modelList.Unit = item.Unit;
        $scope.modelList.UnitName = item.UnitName;
        $scope.modelList.ProductLot = item.ProductLot;
        $scope.modelList.SalePrice = item.SalePrice;
        $scope.modelList.ImpType = item.ImpType;
        $scope.modelList.ProductCoilRelative = item.ProductCoilRelative;
        $scope.model.ListCoil = item.ListCoil;

        var quantityCoil = 0;
        for (var i = 0; i < $scope.model.ListCoil.length; i++) {
            quantityCoil = quantityCoil + $scope.model.ListCoil[i].ValueCoil;
        }
        if (quantityCoil < $scope.modelList.Quantity)
            $scope.modelList.Quantity = quantityCoil;

        $scope.disableFiled(item.ImpType);
    }
    $scope.save = function () {
        if ($scope.model.ListCoil.length == 0) {
            App.toastrError(caption.MIST_VALIDATE_ROLL_BOX_BLANK);
            return;
        }
        //$scope.disableProductCode = false;
        $scope.isEdit = false;

        var msg = validationProduct($scope.modelList);
        if (msg.Status) {
            return;
        }
        //Check null
        if ($scope.modelList.ProductCode == undefined || $scope.modelList.ProductCode == null || $scope.modelList.ProductCode == '' ||
            $scope.modelList.Quantity == undefined || $scope.modelList.Quantity == null || $scope.modelList.Quantity == 0
            || $scope.modelList.SalePrice == undefined || $scope.modelList.SalePrice == null || $scope.modelList.SalePrice == ''
            //|| $scope.modelList.ProductLot == undefined || $scope.modelList.ProductLot == null
        ) {
            App.toastrError(caption.MIST_VALIDATE_REQUIRE_INFORMATION);
        }

        $scope.modelUpdate.ProductCode = $scope.modelList.ProductCode;
        $scope.modelUpdate.ProductType = $scope.modelList.ProductType;
        $scope.modelUpdate.ProductName = $scope.modelList.ProductName;
        //$scope.modelUpdate.ProductQrCode = $scope.modelList.ProductQrCode;
        //$scope.modelUpdate.sProductQrCode = $scope.modelList.sProductQrCode;
        $scope.modelUpdate.Quantity = $scope.modelList.Quantity;
        $scope.modelUpdate.QuantityPoCount = $scope.modelList.QuantityPoCount;
        $scope.modelUpdate.QuantityNeedSet = $scope.modelList.QuantityNeedSet;
        $scope.modelUpdate.Unit = $scope.modelList.Unit;
        $scope.modelUpdate.UnitName = $scope.modelList.UnitName;
        $scope.modelUpdate.ProductLot = $scope.modelList.ProductLot;
        $scope.modelUpdate.SalePrice = $scope.modelList.SalePrice;
        $scope.modelUpdate.ImpType = $scope.modelList.ImpType;
        //$scope.modelUpdate.PackType = packType;
        $scope.modelUpdate.ProductCoilRelative = $scope.modelList.ProductCoilRelative;
        $scope.modelUpdate.ListCoil = $scope.model.ListCoil;
        $scope.modelUpdate.QuantityCoil = $scope.model.ListCoil.length;
        $scope.modelUpdate.sQuantityCoil = $scope.model.ListCoil.length;
        dataserviceImpStore.update($scope.model, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(caption.COM_UPDATE_SUCCESS);
                $rootScope.refeshData($rootScope.rootId);
                dataserviceImpStore.getListCoilByProdQrCode($scope.model.TicketCode, $scope.modelUpdate.ProductQrCode, function (rs) {
                    rs = rs.data;
                    if (!rs.Error) {
                        if (rs.Object.ListCoil != null && rs.Object.ListCoil.length > 0) {
                            $scope.model.ListCoil = rs.Object.ListCoil;
                            if ($scope.model.ListCoil.length > 0) {
                                for (var j = 0; j < $scope.model.ListCoil.length; j++) {
                                    $scope.model.ListCoil[j].ValueCoil = $scope.model.ListCoil[j].Size;

                                    var productCoil = $scope.model.ListCoil[j].ProductCoil;
                                    $scope.model.ListCoil[j].RuleCoil = productCoil.split("_")[productCoil.split("_").length - 2];
                                }
                            }
                        }
                    }
                });
            }
        });

        //$uibModalInstance.dismiss('cancel');
    }
    $scope.saveCoil = function () {
        //Kiểm tra xem sản phẩm này được xếp kho chưa nếu save thì không thay đổi được quy cách
        dataserviceImpStore.checkProductCoilOrderingStore($scope.modelList.ProductQrCode, function (rs) {
            rs = rs.data;
            if (rs) {
                App.toastrError(caption.MIST_SORT_PRODUCT_CANNOT_EDIT);
                return;
            }
        });

        //Check null
        if ($scope.modelList.ValueCoil == undefined || $scope.modelList.ValueCoil == null || $scope.modelList.ValueCoil == '' ||
            $scope.modelList.QuantityCoil == undefined || $scope.modelList.QuantityCoil == null || $scope.modelList.QuantityCoil == ''
            || $scope.modelList.RuleCoil == undefined || $scope.modelList.RuleCoil == null || $scope.modelList.RuleCoil == ''
            || $scope.modelList.ProductLot == undefined || $scope.modelList.ProductLot == null || $scope.modelList.ProductLot == ''
        ) {
            App.toastrError(caption.MIST_VALIDATE_REQUIRE_INFORMATION);
            return;
        }
        else {
            $scope.modelList.QuantityCoil = parseInt($scope.modelList.QuantityCoil);
            $scope.model.ListCoil = [];

            createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.RuleCoil);

            var quantityAdd = $scope.modelList.QuantityCoil;
            $scope.modelList.Quantity = $scope.modelList.Quantity;
            for (var i = 0; i < quantityAdd; i++) {

                var addItem = {
                    ProductCode: $scope.modelList.ProductCode,
                    ProductName: $scope.modelList.ProductName,
                    ProductType: $scope.modelList.ProductType,
                    ProductQrCode: $scope.modelList.ProductQrCode,
                    Quantity: $scope.modelList.Quantity,
                    Unit: $scope.modelList.Unit,
                    UnitName: $scope.modelList.UnitName,

                    SalePrice: $scope.modelList.SalePrice,

                    QuantityIsSet: 0,
                    QuantityNeedSet: $scope.modelList.QuantityNeedSet,
                    ProductCoil: $scope.modelList.ProductCoil,
                    sProductCoil: $scope.modelList.sProductCoil,
                    ProductLot: $scope.modelList.ProductLot,
                    ImpType: $scope.modelList.ImpType,
                    ProductImpType: $scope.modelList.ProductImpType,
                    ValueCoil: $scope.modelList.ValueCoil,
                    UnitCoil: $scope.modelList.UnitCoil,
                    QuantityCoil: $scope.modelList.QuantityCoil,
                    RuleCoil: $scope.modelList.RuleCoil,
                    ProductCoilRelative: $scope.modelList.ProductCoilRelative,
                };
                $scope.model.ListCoil.push(addItem);
            }
        }
    }
    $scope.removeItem = function (item, index) {
        if (item.IsOrder) {
            App.toastrError(caption.MIST_SORT_PRODUCT_CANNOT_DELETE);
        }
        else {
            dataserviceImpStore.checkProductInExpTicket(item.ProductQrCode, function (rs) {
                rs = rs.data;
                if (!rs.Error) {
                    //Lấy lại giá trị model vừa xóa đưa lên chỗ add
                    $scope.modelList.ProductCode = item.ProductCode;
                    $scope.modelList.ProductType = item.ProductType;
                    $scope.modelList.ProductName = item.ProductName;
                    $scope.modelList.ProductQrCode = item.ProductQrCode;
                    $scope.modelList.sProductQrCode = item.sProductQrCode;
                    $scope.modelList.Quantity = item.Quantity;
                    $scope.modelList.Unit = item.Unit;
                    $scope.modelList.UnitName = item.UnitName;
                    $scope.modelList.SalePrice = item.SalePrice;
                    $scope.modelList.ProductLot = item.ProductLot;

                    //Check xem đã có trong list chưa
                    $scope.model.ListProduct.splice(index, 1);
                } else {
                    App.toastrError(rs.Title);
                }
            });
        }
    }
    $scope.removeCoil = function (item) {
        if (item.IsOrder) {
            App.toastrError(caption.MIST_SORT_CANNOT_DELETE);
        } else {
            $scope.quantityCheck = $scope.quantityCheck - parseFloat(item.ValueCoil);
            var index = $scope.model.ListCoil.indexOf(item);
            if (index < -1) {
                App.toastrError(caption.MIST_CANNOT_FOUND_DEL_PRODUCT);
                return;
            }
            $scope.model.ListCoil.splice(index, 1);
            //if ($scope.modelList.QuantityCoil != '') {
            //    $scope.modelList.QuantityCoil = $scope.modelList.QuantityCoil - 1;
            //    $scope.modelList.Quantity = $scope.modelList.Quantity + $scope.modelList.ValueCoil;
            //}

            //Cập nhật lại giá trị ở trên
            $scope.modelList.Quantity = 0;
            for (var i = 0; i < $scope.model.ListCoil.length; i++) {
                $scope.modelList.Quantity = $scope.modelList.Quantity + (parseFloat($scope.model.ListCoil[i].ValueCoil));
            }

            App.toastrSuccess(caption.MIST_BTN_SAVE_INFORMATION);
        }
    }
    $scope.changleSelect = function (SelectType, item) {
        //Hàm chọn 1 lô để nhập
        if (SelectType == "LotProductCode") {
            $rootScope.LotProductCode = item.Code;
            $scope.model.Reason = 'IMP_FROM_BUY';
            $scope.model.StoreCodeSend = '';

            dataserviceImpStore.getLotProduct(item.Code, function (rs) {
                rs = rs.data;
                $scope.model.CusCode = rs.SupCode;
                //$scope.model.CostTotal = rs.CostTotal;
                //$scope.model.TaxTotal = rs.TaxTotal;
                //$scope.model.Discount = rs.Discount;
                //$scope.model.Commission = rs.Commission;
                //$scope.model.TotalMustPayment = rs.TotalMustPayment;
                //$scope.model.Currency = rs.Currency;
                createTicketCode($scope.model.LotProductCode, $scope.model.StoreCode, $scope.model.UserImport);

                $scope.model.ListProduct = rs.ListProduct;
            });

            //Bỏ validate
            if ($scope.model.LotProductCode != undefined && $scope.model.LotProductCode != null && $scope.model.LotProductCode != '') {
                $scope.errorLotProductCode = false;
            }
        }
        if (SelectType == "ProductCode") {
            $scope.modelList.Unit = item.Unit;
            $scope.modelList.UnitName = item.UnitName;
            $scope.modelList.ProductName = item.Name;
            $scope.modelList.ProductType = item.ProductType;
            $scope.modelList.ImpType = item.ImpType;
            createProductQrCode();
            if (item.ImpType != '' && item.ImpType != null && item.ImpType != undefined) {
                $scope.modelList.Quantity = 0;
                $scope.listProductType = item.ImpType.split(",");
                if ($scope.listProductType.length > 1) {
                    $scope.showCoil = true;
                    $scope.modelList.UnitCoil = $scope.listProductType[$scope.listProductType.length - 1];
                } else {
                    $scope.showCoil = false;
                }
            } else {
                App.toastrError(caption.MIST_VALIDATE_IN_PRODUCT_TYPE);
            }

            $scope.disableFiled(item.ImpType);

            createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.sProductCoil);
        }
        if (SelectType == "ProductRelative") {
            $scope.chooseCoilInStore = true;
            var check = $scope.listProduct.filter(k => k.Code === item.ProductCode);
            if (check.length == 1) {
                $scope.modelList.ProductCode = item.ProductCode;
                $scope.modelList.SalePrice = item.SalePrice;
                $scope.modelList.Quantity = item.Quantity;
                $scope.modelList.Unit = check[0].Unit;
                $scope.modelList.UnitName = check[0].UnitName;
                $scope.modelList.ProductName = check[0].Name;
                $scope.modelList.ProductType = check[0].ProductType;
                $scope.modelList.ImpType = check[0].ImpType;
                $scope.modelList.ProductLot = item.ProductLot;
                validationProduct($scope.modelList);
                createProductQrCode();
            }

            //var listRelative = $scope.listProductRelative.filter(k => k.CoilRelative === item.Code);
            //var no = listRelative.length + 1;
            //$scope.modelList.ProductCoil = item.Code + "_" + no;

            createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.sProductCoil);
        }
        if (SelectType == "StoreCode") {
            if ($scope.model.StoreCodeSend == $scope.model.StoreCode) {
                $scope.model.StoreCodeSend = '';
                App.toastrError(caption.MIS_MSG_OTHER_IMPORT_WAREHOUSE_TRANSFER);
            }
            createTicketCode($scope.model.LotProductCode, $scope.model.StoreCode, $scope.model.UserImport);
            //$scope.model.ListProduct = [];
            //$scope.modelList = {
            //    ProductCode: '',
            //    ProductName: '',
            //    ProductQrCode: '',
            //    sProductQrCode: '',
            //    Quantity: null,
            //    Unit: '',
            //    UnitName: '',
            //    SalePrice: null,
            //    TaxRate: 10,
            //    Discount: 0,
            //    Commission: 0,
            //};
            if ($scope.model.StoreCode != undefined && $scope.model.StoreCode != null && $scope.model.StoreCode != '') {
                $scope.errorStoreCode = false;
            }
        }
        if (SelectType == "Reason") {
            if ($scope.model.Reason != undefined && $scope.model.Reason != null && $scope.model.Reason != '') {
                $scope.errorReason = false;
            }
            if ($scope.model.Reason == 'IMP_FROM_BUY') {
                $scope.model.StoreCodeSend = '';
            }
            else {
                $scope.model.CusCode = '';
            }
        }
        if (SelectType == "StoreCodeSend") {
            if ($scope.model.StoreCodeSend == $scope.model.StoreCode) {
                $scope.model.StoreCodeSend = '';
                App.toastrError(caption.MIS_MSG_OTHER_IMPORT_WAREHOUSE_TRANSFER);
            }
            if ($scope.model.StoreCodeSend != undefined && $scope.model.StoreCodeSend != null && $scope.model.StoreCodeSend != '') {
                $scope.errorStoreCodeSend = false;
            }
        }
        if (SelectType == "UserImport") {
            createTicketCode($scope.model.LotProductCode, $scope.model.StoreCode, $scope.model.UserImport);
            if ($scope.model.UserImport != undefined && $scope.model.UserImport != null && $scope.model.UserImport != '') {
                $scope.errorUserImport = false;
            }
        }
    }
    $scope.changeCoil = function () {
        createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.sProductCoil);
    }
    $scope.change = function (type) {
        switch (type) {
            //Quy cách
            case 'ruleCoil':
                createCoilCode($scope.modelList.ProductCode, $scope.modelList.ProductLot, $scope.modelList.RuleCoil);
                break;
            case 'quantity':
                if ($scope.modelList.Quantity == null || $scope.modelList.Quantity == '' || $scope.modelList.Quantity == undefined) {
                    $scope.errorQuantity = true;
                } else {
                    $scope.errorQuantity = false;
                }
                break;
            //case 'price':
            //    if ($scope.modelList.SalePrice == null || $scope.modelList.SalePrice == '' || $scope.modelList.SalePrice == undefined) {
            //        $scope.errorSalePrice = true;
            //    } else {
            //        $scope.errorSalePrice = false;
            //    }
            //    break;
            default:
        }
    }

    $scope.showListCoil = function () {
        if ($scope.isShow == true) {
            $scope.isShow = false;
            $scope.isShowListCoil = true;
        }
        else {
            $scope.isShow = true;
            $scope.isShowListCoil = false;
        }
    }

    $scope.orderingItemCoil = function (item) {
        //var item = $scope.model.ListCoil[index];
        if (item != null) {
            dataserviceImpStore.checkProductInStoreCoil(item.ProductQrCode, item.ProductCoil, function (rs) {
                rs = rs.data;
                if (rs) {
                    var objPara = {
                        item: item,
                        rootId: $rootScope.rootId,
                        productName: item.ProductName,
                        productCoil: item.ProductCoil
                    }

                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: ctxfolderImpStore + '/orderProduct.html',
                        controller: 'orderProduct',
                        backdrop: 'static',
                        size: '70',
                        resolve: {
                            para: function () {
                                return {
                                    objPara
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (id) {
                    }, function () {
                    });
                } else {
                    App.toastrError(caption.MIS_MSG_PRODUCT_NON_ADD_REQUEST_CHOSE_ADD);
                }
            });
        } else {
            App.toastrError(caption.MIST_ADD_PRODUCT_SAVE_BEFORE_SORT);
        }
    }
    $scope.orderingItem = function (index) {
        var item = $scope.model.ListProduct[index];
        if (item != null) {
            dataserviceImpStore.checkProductInStore(item.ProductQrCode, function (rs) {
                rs = rs.data;
                if (rs) {
                    var objPara = {
                        item: item,
                        rootId: $rootScope.rootId,
                        productName: item.ProductName,
                        productCoil: ''
                    }

                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: ctxfolderImpStore + '/orderProduct.html',
                        controller: 'orderProduct',
                        backdrop: 'static',
                        size: '70',
                        resolve: {
                            para: function () {
                                return {
                                    objPara
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (id) {
                        $scope.initLoad();
                    }, function () {
                    });
                } else {
                    App.toastrError(caption.MIS_MSG_PRODUCT_NON_ADD_REQUEST_CHOSE_ADD);
                }
            });
        } else {
            App.toastrError(caption.MIST_ADD_PRODUCT_SAVE_BEFORE_SORT);
        }
    }
    $rootScope.updateOrderItemCoil = function (id) {
        var item = $scope.model.ListCoil.find(function (element) {
            if (element.Id == id) return true;
        });
        if (item) {
            if (item.IsOrder == false) {
                item.IsOrder = true;
            } else {
                item.IsOrder = false;
            }
        }
    }
    function createTicketCode(lot, store, user) {

    }
    function createProductQrCode() {
        var today = moment().format('DDMMYYYY-HHmm');
        $scope.modelList.ProductQrCode = $scope.modelList.ProductCode + "_SL." + $scope.modelList.Quantity + "_T." + today;
        dataserviceImpStore.generatorQRCode($scope.modelList.ProductQrCode, function (result) {
            result = result.data;
            $scope.modelList.sProductQrCode = result;
        });
    }
    function createCoilCode(productCode, lot, coil) {
        if (productCode == "" || productCode == undefined || productCode == null)
            productCode = "";

        if (lot == "" || lot == undefined || lot == null)
            lot = "";

        if (coil == "" || coil == undefined || coil == null)
            coil = "";

        var no = 1;
        $scope.modelList.ProductCoil = $scope.model.TicketCode + "_" + productCode + "_" + coil + "_";
    }
    function validationProduct(data) {
        var mess = { Status: false, Title: "" }
        //Check null lô hàng khi chọn nhập theo lô
        if ($scope.modelList.ProductCode == undefined || $scope.modelList.ProductCode == null || $scope.modelList.ProductCode == '') {
            $scope.errorProductCode = true;
            mess.Status = true;
            mess.Title = caption.MIS_VALIDATE_CHOOSE_PRODUCT;
        } else {
            $scope.errorProductCode = false;
        }
        if ($scope.modelList.Quantity == undefined || $scope.modelList.Quantity == null || $scope.modelList.Quantity == '') {
            $scope.errorQuantity = true;
            mess.Status = true;
            if (mess.Title != "")
                mess.Title = mess.Title + "</br>caption.MIS_VALIDATE_ENTER_VALUE";
            else
                mess.Title = "Vui lòng nhập giá trị";
        } else {
            $scope.errorQuantity = false;
        }
        if ($scope.modelList.SalePrice == undefined || $scope.modelList.SalePrice == null || $scope.modelList.SalePrice == '') {
            $scope.errorSalePrice = true;
            mess.Status = true;
            if (mess.Title != "")
                mess.Title = mess.Title + "</br>caption.MIS_VALIDATE_ENTER_PRICE";
            else
                mess.Title = caption.MIS_VALIDATE_ENTER_PRICE;
        } else {
            $scope.errorSalePrice = false;
        }
        return mess;
    }
    function validationProductCoil(data) {
        var mess = { Status: false, Title: "" }
        if ($scope.modelList.ProductCoil == undefined || $scope.modelList.ProductCoil == null || $scope.modelList.ProductCoil == '') {
            $scope.errorProductCoil = true;
            mess.Status = true;
            if (mess.Title != "")
                mess.Title = mess.Title + "</br>MIST_VALDIATE_ADD_ROLL_BOX";
            else
                mess.Title = caption.MIST_VALDIATE_ADD_ROLL_BOX;
        } else {
            $scope.errorProductCoil = false;
        }

        return mess;
    }
    function loadPoper() {
        $('[data-toggle="popover"]').popover()
    }

    setTimeout(function () {
        setModalMaxHeight('.modal');
        setModalDraggable('.modal-dialog');
        loadPoper();
    }, 200);
});

app.controller('orderProduct', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceImpStore, $location, $uibModalInstance, para) {
    $scope.QuantityEmpty = "...";
    $scope.isCoil = false;

    $scope.ImpType = para.objPara.item.ImpType;
    if ($scope.ImpType == "Cuộn")
        $scope.isCoil = true;

    $scope.model = {
        ProductCode: '',
        ProductName: para.objPara.productName,
        LineCode: '',
        RackCode: '',
        RackPosition: '',
        Quantity: 0,
        Unit: para.objPara.item.Unit,
        ListCoil: []
    }

    $scope.RackPosition = '';
    $scope.listSelect = [];
    $scope.listLine = [];
    $scope.listRack = [];
    $scope.listCoil = [];

    $scope.obj = {
        WareHouseCode: '',
        FloorCode: '',
        LineCode: '',
        RackCode: '',
        WareHouseName: '',
        FloorName: '',
        LineName: '',
        RackName: '',
        CNTBox: '',
        NumBox: '',
    }

    $scope.listProducts = [];
    $scope.listSelect = [];

    $scope.QuantityMax = '';

    $scope.cancel = function () {
        $uibModalInstance.close($rootScope.rootId);
    }

    $scope.selectOrder = function (position, entities) {
        angular.forEach(entities, function (subscription, index) {
            if (position == index) {
                subscription.Checked = true;
                $rootScope.cntBox = subscription.Text;
            } else {
                subscription.Checked = false;
            }
        });
    }

    $scope.selectBox = function (position, boxs) {
        angular.forEach(boxs, function (subscription, index) {
            if (position == index) {
                if (subscription.Checked) {
                    subscription.Checked = false;
                    var indexRemove = $scope.listSelect.indexOf(boxs[index]);
                    $scope.listSelect.splice(indexRemove, 1);
                    boxs[index].WHS_Code = 0;
                    boxs[index].FloorCode = 0;
                    boxs[index].LineCode = 0;
                    boxs[index].RackCode = 0;
                    boxs[index].Ordering = 0;
                    boxs[index].RackPosition = '';
                    boxs[index].IsStored = false;
                } else {
                    boxs[index].WHS_Code = $rootScope.wareHouseCode;
                    boxs[index].FloorCode = $rootScope.floorCode;
                    boxs[index].LineCode = $rootScope.lineCode;
                    boxs[index].RackCode = $rootScope.rackCode;
                    boxs[index].Ordering = $rootScope.cntBox;
                    boxs[index].RackPosition = $scope.RackPosition;
                    boxs[index].IsStored = true;

                    if (boxs[index].FloorCode == 0) {
                        App.toastrError(caption.MIS_MSG_REQUEST_CHOSE_FLOOR_BEFORE_CHOSE_BOX);
                        return;
                    }

                    if (boxs[index].LineCode == 0) {
                        App.toastrError(caption.MIS_MSG_REQUEST_CHOSE_LINE_BEFORE_CHOSE_BOX);
                        return;
                    }

                    if (boxs[index].RackCode == 0) {
                        App.toastrError(caption.MIS_MSG_REQUEST_CHOSE_RACK_BEFORE_CHOSE_BOX);
                        return;
                    }

                    if (boxs[index].RackPosition == "") {
                        App.toastrError(caption.MIS_MSG_REQUEST_ENTER_LOCATION_RACK_BEFORE_CHOSE_BOX);
                        return;
                    }

                    if (boxs[index].Ordering == null) {
                        App.toastrError(caption.MIS_MSG_REQUEST_CHOSE_ORDERING_BEFORE_CHOSE_BOX);
                        return;
                    }

                    subscription.Checked = true;
                    $scope.listSelect.push(boxs[index]);
                }
            }
        });
    }
    $scope.listMapping = [];
    $scope.initLoad = function () {
        var itemProduct = para.objPara.item;
        $scope.model.ProductQrCode = itemProduct.ProductQrCode;
        $scope.model.Quantity = itemProduct.ValueCoil;
        $scope.model.sProductCoil = para.objPara.productCoil;
        dataserviceImpStore.getListMapping($rootScope.storeCode, function (rs) {
            rs = rs.data;
            $scope.listMapping = rs;
            //$scope.listRack = [];
            //$scope.model.RackCode = '';
            //if (rs.length > 0) {
            //    $scope.model.LineCode = rs[0].LineCode;
            //    dataserviceImpStore.getListRackByLineCode(rs[0].LineCode, function (result) {
            //        result = result.data;
            //        $scope.listRack = result;
            //        if (result.length > 0) {
            //            $scope.model.RackCode = result[0].RackCode;
            //            dataserviceImpStore.getQuantityEmptyInRack($scope.model.RackCode, function (rs) {
            //                rs = rs.data;
            //                $scope.QuantityEmpty = rs;
            //            });
            //        }
            //    });
            //} else {
            //    // App.toastrError("Không tìm thấy đường line trong" + ' ' + para.objPara.storeName);
            //}
        });
        //dataserviceImpStore.getPositionProduct($scope.model.ProductQrCode, $scope.model.sProductCoil, function (rs) {
        //    rs = rs.data;
        //    if (!rs.Error) {
        //        $scope.model.ListCoil = rs.Object;
        //        for (var i = 0; i < $scope.model.ListCoil.length; i++) {
        //            $scope.model.ListCoil[i].sProductCoil = $scope.model.ListCoil[i].ProductCoil.split("_")[$scope.model.ListCoil[i].ProductCoil.split("_").length - 2];
        //            $scope.model.ListCoil[i].CoilCode = $scope.model.ListCoil[i].ProductCoil;
        //        }
        //    }
        //});
        dataserviceImpStore.getProductNotInStore($scope.model.ProductQrCode, $scope.model.sProductCoil, function (rs) {
            rs = rs.data;
            if (!rs.Error) {
                $scope.listCoil = rs.Object;
                for (var i = 0; i < $scope.listCoil.length; i++) {
                    $scope.listCoil[i].sProductCoil = $scope.listCoil[i].ProductCoil.split("_")[$scope.listCoil[i].ProductCoil.split("_").length - 2];
                }
            }
        });
        dataserviceImpStore.getPositionProductVatco(para.objPara.item.ProductQRCode, para.objPara.item.TicketCode, function (rs) {
            rs = rs.data;
            $scope.lstProduct = rs;
        })
        dataserviceImpStore.getTreeZone(function (rs) {
            rs = rs.data;
            $scope.lstTreeZone = rs;
        })
    }

    $scope.initLoad();

    $scope.setPositionBox = function () {
        $scope.obj.WareHouseCode = $rootScope.wareHouseCode;
        $scope.obj.FloorCode = $rootScope.floorCode;
        $scope.obj.LineCode = $rootScope.lineCode;
        $scope.obj.RackCode = $rootScope.rackCode;
        $scope.obj.CNTBox = $rootScope.cntBox;
        $scope.obj.NumBox = $rootScope.chooseBoxObj.NumBoxth;

        var objBox = $rootScope.chooseBoxObj;
        objBox.WHS_Code = $rootScope.wareHouseCode;
        objBox.FloorCode = $rootScope.floorCode;
        objBox.LineCode = $rootScope.lineCode;
        objBox.RackCode = $rootScope.rackCode;
        dataserviceImpStore.getNameObjectType($scope.obj, function (rs) {
            rs = rs.data;
            $scope.obj = rs;
            $rootScope.positionBox = rs.PositionBox;
            App.toastrSuccess("caption.MIST_SORT_SUCCESS <br/>" + "Vị trí: " + $rootScope.positionBox);

            $uibModalInstance.close();
        });
    }

    $scope.validate = function () {
        if ($scope.model.MappingCode != '' && $scope.model.MappingCode != '' && $scope.model.MappingCode != '') {
            return false;
        } else {
            App.toastrError(caption.MIST_VALIDATE_ADD_REQUIRE_INFO_RB);
            return true;
        }
    }

    $scope.changeSelect = function (type, id) {
        switch (type) {
            case "LINE":
                dataserviceImpStore.getListRackByLineCode(id, function (rs) {
                    rs = rs.data;
                    $scope.listRack = rs;
                    $scope.model.RackCode = '';
                });
            case "RACK":
                dataserviceImpStore.getListProductInStore(id, function (rs) {
                    rs = rs.data;
                    $scope.listProducts = rs;
                });
                dataserviceImpStore.getQuantityEmptyInRack(id, function (rs) {
                    rs = rs.data;
                    $scope.QuantityEmpty = rs;
                });
                break;
        }
    };

    $scope.item = [];

    $scope.changeCoil = function (item) {
        $scope.item = item;
        var check = $scope.model.ListCoil.filter(k => k.ProductCoil === item.ProductCoil);
        if (check.length > 0) {
            //App.toastrError(caption.MIST_LIST_EXIST);
            var position = '';
            var line = $scope.listLine.filter(k => k.LineCode === $scope.model.LineCode);
            var rack = $scope.listRack.filter(k => k.RackCode === $scope.model.RackCode);
            if (rack.length === 1 && line.length === 1) {
                position = $scope.model.RackPosition + ", " + rack[0].RackName + ", " + line[0].L_Text;
                item.PositionInStore = position;
                item.CoilRelative = item.ProductCoilRelative;
                item.CoilCode = item.ProductCoil;
                item.LineCode = $scope.model.LineCode;
                item.RackCode = $scope.model.RackCode;
                item.RackPosition = $scope.model.RackPosition;
            }
        } else {
            var position = '';
            var line = $scope.listLine.filter(k => k.LineCode === $scope.model.LineCode);
            var rack = $scope.listRack.filter(k => k.RackCode === $scope.model.RackCode);
            if (rack.length === 1 && line.length === 1) {
                position = $scope.model.RackPosition + ", " + rack[0].RackName + ", " + line[0].L_Text;
                item.PositionInStore = position;
                item.CoilRelative = item.ProductCoilRelative;
                item.CoilCode = item.ProductCoil;
                item.LineCode = $scope.model.LineCode;
                item.RackCode = $scope.model.RackCode;
                item.RackPosition = $scope.model.RackPosition;
            }

            if (!$scope.validate()) {
                $scope.model.Quantity = parseFloat(item.Remain);

                //$scope.model.ListCoil.push(item);
                //var index = $scope.listCoil.indexOf(item);
                //$scope.listCoil.splice(index, 1);
            } else {
                $scope.model.ProductCoil = '';
            }
        }
    };

    $scope.add = function (item) {

        if (!$scope.validate()) {
            for (var i = 0; i < $scope.model.Quantity; i++) {
                item = $scope.listCoil[i];
                var check = $scope.model.ListCoil.filter(k => k.ProductCoil === item.ProductCoil);
                if (check.length > 0) {
                    App.toastrError(caption.MIST_LIST_EXIST);
                } else {
                    var position = '';
                    var line = $scope.listLine.filter(k => k.LineCode === $scope.model.LineCode);
                    var rack = $scope.listRack.filter(k => k.RackCode === $scope.model.RackCode);
                    if (rack.length === 1 && line.length === 1) {
                        position = $scope.model.RackPosition + ", " + rack[0].RackName + ", " + line[0].L_Text;
                        item.PositionInStore = position;
                        item.CoilRelative = item.ProductCoilRelative;
                        item.CoilCode = item.ProductCoil;
                        item.LineCode = $scope.model.LineCode;
                        item.RackCode = $scope.model.RackCode;
                        item.RackPosition = $scope.model.RackPosition;
                    }

                    $scope.model.ListCoil.push(item);
                }
            }

            for (var j = 0; j < $scope.model.ListCoil.length; j++) {
                var index = $scope.listCoil.indexOf($scope.model.ListCoil[j]);
                $scope.listCoil.splice(index, 1);
            }
        }
    };

    $scope.orderingProduct = function () {
        if ($scope.model.RackCode != '' && $scope.model.RackPosition != '' && $scope.model.Size != '') {
            //var itemProduct = para.objPara.item;
            //$scope.changeCoil(itemProduct);
            dataserviceImpStore.orderingProductInStore($scope.model, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                    $rootScope.reloadData();
                }
            });
        } else {
            App.toastrError(caption.MIS_MSG_REQUEST_ENTER_INFORMATION_REQUIRE)
        }
    }

    var remain = para.objPara.item.Remain;
    //Vatco: add product to order
    $scope.addToOrder = function () {
        debugger
        if (!$scope.validate()) {
            if ($scope.model.Quantity <= 0) {
                return App.toastrError("Vui lòng nhập số lượng lớn hơn 0");
            }
            //if (parseInt($scope.QuantityEmpty) < $scope.model.Quantity) {
            //    App.toastrError("Số lượng xếp lớn hơn sức chứa của kệ");
            //    return;
            //}
            //var line = $scope.listLine.filter(k => k.LineCode === $scope.model.LineCode);
            //var rack = $scope.listRack.filter(k => k.RackCode === $scope.model.RackCode);
            //$scope.model.PositionInStore = $scope.model.RackPosition + ", " + rack[0].RackName + ", " + line[0].L_Text;
            $scope.model.ProductQrCode = para.objPara.item.ProductQRCode;
            $scope.model.ProductCode = para.objPara.item.ProductCode;
            $scope.model.TicketCode = para.objPara.item.TicketCode;
            $scope.model.Size = para.objPara.item.Quantity;
            $scope.model.UnitCode = para.objPara.item.UnitCode;
            if ($scope.model.Quantity <= remain) {
                $scope.model.Remain = remain - $scope.model.Quantity;
            }
            else {
                App.toastrError(caption.MIS_MSG_QUANTITY_EXIST);
                return;
            }
            remain = $scope.model.Remain;
            if (remain >= 0) {

            }
            else {
                App.toastrError(caption.MIS_MSG_PROD_ALREADY_SET);
            }
            dataserviceImpStore.orderProductVatco($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    if (para.objPara.item.TicketCode) {
                        dataserviceImpStore.getPositionProductVatco(para.objPara.item.ProductQRCode, para.objPara.item.TicketCode, function (rs) {
                            rs = rs.data;
                            $scope.lstProduct = rs;
                        })
                    }
                    //dataserviceImpStore.getQuantityEmptyInRack($scope.model.RackCode, function (rs) {
                    //    rs = rs.data;
                    //    $scope.QuantityEmpty = rs;
                    //});
                }
            })
        }
    };

    $scope.deleteOrder = function (id) {
        dataserviceImpStore.deleteOrderProduct(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                remain = rs.Object;
                dataserviceImpStore.getPositionProductVatco(para.objPara.item.ProductQRCode, para.objPara.item.TicketCode, function (rs) {
                    rs = rs.data;
                    $scope.lstProduct = rs;
                })
                dataserviceImpStore.getQuantityEmptyInRack($scope.model.RackCode, function (rs) {
                    rs = rs.data;
                    $scope.QuantityEmpty = rs;
                });
            }
        })
    }

    //Hàm remove sản phẩm
    $scope.removeItem = function (index) {
        var productCoil = $scope.model.ListCoil[index];
        dataserviceImpStore.deleteProductInStore(productCoil.Id, function (result) {
            result = result.data;
            if (result.Error) {
                App.toastrError(result.Title);
            } else {
                if (para.objPara.item.Id != null && para.objPara.item.Id != '' && para.objPara.item.Id != undefined) {
                    $rootScope.updateOrderItemCoil(para.objPara.item.Id);
                    $rootScope.reloadData();
                }
                $scope.listCoil.push(productCoil);
                $scope.model.ListCoil.splice(index, 1);
                App.toastrSuccess(caption.MIST_DEL_LOCA_SUCESS);
            }
        });
    }

    setTimeout(function () {
        setModalMaxHeight('.modal');
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('listFloor', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceImpStore, $location, $timeout) {
    var vm = $scope;
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/EDMSWarehouseManager/JTableFloor",
            beforeSend: function (jqXHR, settings) {
                resetCheckbox();
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.WareHouseCode = $rootScope.wareHouseCode;
            },
            complete: function (data) {
                $rootScope.listFloor = data.responseJSON.data;
                App.unblockUI("#contentMain");
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(pageLength)
        .withOption('order', [2, 'asc'])
        .withOption('scrollY', "110px")
        .withOption('scrollCollapse', false)
        .withOption('serverSide', true)
        .withOption('headerCallback', function (header) {
            if (!$scope.headerCompiled) {
                $scope.headerCompiled = true;
                $compile(angular.element(header).contents())($scope);
            }
        })
        .withOption('initComplete', function (settings, json) {
        })
        .withOption('createdRow', function (row, data, dataIndex) {
            const contextScope = $scope.$new(true);
            contextScope.data = data;
            contextScope.contextMenu = $scope.contextMenu;
            $compile(angular.element(row).contents())($scope);
            $compile(angular.element(row).attr('context-menu', 'contextMenu'))(contextScope);
            $(row).find('td:not(:has(label.mt-checkbox))').on('click', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {

                } else {
                    var Id = data.Id;
                    var floorCode = data.FloorCode;
                    $rootScope.floorID = Id;
                    $rootScope.floorCode = floorCode;
                    if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {
                        $scope.selected[data.Id] = !$scope.selected[data.Id];
                    } else {
                        var self = $(this).parent();
                        $('#tblDataFloor').DataTable().$('tr.selected').removeClass('selected');
                        $('#tblDataFloor').DataTable().$('tr>td.fa-check').removeClass('fa-check');
                        $(self).addClass('selected');
                    }
                }
            });
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle(titleHtml).notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full.Id] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.Id + ']" ng-click="toggleOne(selected)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('QR_Code').withTitle('{{"EDWHR_LIST_COL_CODE" | translate}}').renderWith(function (data, type) {
        //return '<img src="data:image/png;base64,' + data + '" height="40" width="40">';
        //return '<img src="data:image/png;base64,' + data + '" onerror =' + "'" + 'this.src="' + '/images/default/no_image.png' + '"' + "'" + 'height="40" width="40">';
        return '<img src="../../../images/default/qrCode.png" height="40" width="40">';
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FloorName').withTitle('{{"MIS_LIST_COL_TILTE" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('MapDesgin').withTitle('{{"MIS_LIST_COL_DESIGN" | translate}}').renderWith(function (data, type, full) {
        //return '<img src="' + data + '" height="40" width="40">';
        return '<img src="' + data + '" onerror =' + "'" + 'this.src="' + '/images/default/no_image.png' + '"' + "'" + 'height="40" width="40">';
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').notSortable().withOption('sClass', 'nowrap').withTitle('{{"MIS_LIST_COL_ACTION" | translate}}').renderWith(function (data, type, full) {
        return '<button title="Sửa" ng-click="edit(' + full.Id + ')" style = "width: 25px; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgba(85,168,253,0.45);" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-check"></i></button>' +
            '<button title="Xoá" ng-click="delete(' + full.Id + ')" style="width: 25px; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgba(230,60,95,0.45)" class=""><i style="--fa-primary-color: red;" class="fas fs30 fa-trash-alt"></i></a>';
    }));
    vm.reloadData = reloadData;
    vm.dtInstance = {};
    function reloadData(resetPaging) {
        vm.dtInstance.reloadData(callback, resetPaging);
    }
    function callback(json) {

    }
    function toggleAll(selectAll, selectedItems) {
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                selectedItems[id] = selectAll;
            }
        }
    }
    function toggleOne(selectedItems) {
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                if (!selectedItems[id]) {
                    vm.selectAll = false;
                    return;
                }
            }
        }
        vm.selectAll = true;
    }
    function resetCheckbox() {
        $scope.selected = [];
        vm.selectAll = false;
    }
    $scope.reload = function () {
        reloadData(true);
    }
    $scope.reloadNoResetPage = function () {
        reloadData(false);
    }
    $scope.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderImpStore + '/addFloor.html',
            controller: 'addFloor',
            backdrop: 'static',
            size: '65'
        });
        modalInstance.result.then(function (d) {

        }, function () {
        });
    }
    $scope.edit = function (id) {
        var model = {};
        var listdata = $('#tblDataFloor').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id + "") {
                model = listdata[i];
                break;
            }
        }
        $rootScope.floorID = id;
        $rootScope.floorCode = model.FloorCode;
        $rootScope.showListFloor = true;
        $rootScope.showListLine = true;
        $rootScope.showListRack = false;

        $rootScope.reloadLine();
    }

    $rootScope.reloadFloor = function () {
        reloadData(false);
    }

    $rootScope.floorReload = true;
});

app.controller('listLine', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceImpStore, $location) {
    var vm = $scope;
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/EDMSWarehouseManager/JTableLine",
            beforeSend: function (jqXHR, settings) {
                resetCheckbox();
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.FloorCode = $rootScope.floorCode;
            },
            complete: function (data) {
                $rootScope.listLine = data.responseJSON.data;
                App.unblockUI("#contentMain");
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(pageLength)
        .withOption('order', [2, 'asc'])
        .withOption('scrollY', "110px")
        //.withOption('scrollCollapse', true)
        .withOption('serverSide', true)
        .withOption('headerCallback', function (header) {
            if (!$scope.headerCompiled) {
                $scope.headerCompiled = true;
                $compile(angular.element(header).contents())($scope);
            }
        })
        .withOption('initComplete', function (settings, json) {
        })
        .withOption('createdRow', function (row, data, dataIndex) {
            const contextScope = $scope.$new(true);
            contextScope.data = data;
            contextScope.contextMenu = $scope.contextMenu;
            $compile(angular.element(row).contents())($scope);
            $compile(angular.element(row).attr('context-menu', 'contextMenu'))(contextScope);
            $(row).find('td:not(:has(label.mt-checkbox))').on('click', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {

                } else {
                    var Id = data.Id;
                    var lineCode = data.LineCode;
                    $rootScope.lineID = Id;
                    $rootScope.lineCode = lineCode;
                    if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {
                        $scope.selected[data.Id] = !$scope.selected[data.Id];
                    } else {
                        var self = $(this).parent();
                        $('#tblDataLine').DataTable().$('tr.selected').removeClass('selected');
                        $('#tblDataLine').DataTable().$('tr>td.fa-check').removeClass('fa-check');
                        $(self).addClass('selected');
                    }
                }
            });
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle(titleHtml).notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full.FileID] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.FileID + ']" ng-click="toggleOne(selected)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('QR_Code').withTitle('{{"EDWHR_LIST_COL_CODE" | translate}}').renderWith(function (data, type) {
        //return '<img src="data:image/png;base64,' + data + '" onerror =' + "'" + 'this.src="' + '/images/default/no_image.png' + '"' + "'" + 'height="40" width="40">';
        //return '<img src="' + qrCode + '" height="40" width="40">';
        return '<img src="../../../images/default/qrCode.png" height="40" width="40">';
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('L_Text').withTitle('{{"MIS_LIST_COL_TILTE" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Note').withTitle('{{"MIS_LIST_COL_DESCEPTION" | translate}}').renderWith(function (data, type, full) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').notSortable().withOption('sClass', 'nowrap').withTitle('{{"MIS_LIST_COL_ACTION" | translate}}').renderWith(function (data, type, full) {
        return '<button title="Sửa" ng-click="edit(' + full.Id + ')" style = "width: 25px; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgba(85,168,253,0.45);" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-check"></i></button>' +
            '<button title="Xoá" ng-click="delete(' + full.Id + ')" style="width: 25px; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgba(230,60,95,0.45)" class=""><i style="--fa-primary-color: red;" class="fas fs30 fa-trash-alt"></i></a>';
    }));
    vm.reloadData = reloadData;
    vm.dtInstance = {};
    function reloadData(resetPaging) {
        vm.dtInstance.reloadData(callback, resetPaging);
    }
    function callback(json) {

    }
    function toggleAll(selectAll, selectedItems) {
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                selectedItems[id] = selectAll;
            }
        }
    }
    function toggleOne(selectedItems) {

        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                if (!selectedItems[id]) {
                    vm.selectAll = false;
                    return;
                }
            }
        }
        vm.selectAll = true;
    }
    function resetCheckbox() {
        $scope.selected = [];
        vm.selectAll = false;
    }
    $scope.reload = function () {
        reloadData(true);
    }
    $scope.reloadNoResetPage = function () {
        reloadData(false);
    }
    $scope.add = function () {
    }
    $scope.edit = function (id) {
        var model = {};
        var listdata = $('#tblDataLine').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id + "") {
                model = listdata[i];
                break;
            }
        }

        $rootScope.lineID = id;
        $rootScope.lineCode = model.LineCode;
        $rootScope.showListFloor = true;
        $rootScope.showListLine = true;
        $rootScope.showListRack = true;

        $rootScope.reloadRack();
    }

    $rootScope.reloadLine = function () {
        reloadData(false);
    }
});

app.controller('listRack', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceImpStore, $location) {
    var vm = $scope;
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/EDMSWarehouseManager/JTableRack",
            beforeSend: function (jqXHR, settings) {
                resetCheckbox();
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                //d.LineCode = $rootScope.lineCode;
            },
            complete: function (data) {
                $rootScope.listRack = data.responseJSON.data;
                App.unblockUI("#contentMain");
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(pageLength)
        .withOption('order', [2, 'asc'])
        .withOption('scrollY', "110px")
        //.withOption('scrollCollapse', true)
        .withOption('serverSide', true)
        .withOption('headerCallback', function (header) {
            if (!$scope.headerCompiled) {
                $scope.headerCompiled = true;
                $compile(angular.element(header).contents())($scope);
            }
        })
        .withOption('initComplete', function (settings, json) {
        })
        .withOption('createdRow', function (row, data, dataIndex) {
            const contextScope = $scope.$new(true);
            contextScope.data = data;
            contextScope.contextMenu = $scope.contextMenu;
            $compile(angular.element(row).contents())($scope);
            $compile(angular.element(row).attr('context-menu', 'contextMenu'))(contextScope);
            $(row).find('td:not(:has(label.mt-checkbox))').on('click', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {

                } else {
                    var Id = data.Id;
                    var rackCode = data.RackCode;
                    $rootScope.rackID = Id;
                    $rootScope.rackCode = rackCode;
                    if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {
                        $scope.selected[data.Id] = !$scope.selected[data.Id];
                    } else {
                        var self = $(this).parent();
                        $('#tblDataRack').DataTable().$('tr.selected').removeClass('selected');
                        $('#tblDataRack').DataTable().$('tr>td.fa-check').removeClass('fa-check');
                        $(self).addClass('selected');
                    }
                }
            });
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle(titleHtml).notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full.FileID] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.FileID + ']" ng-click="toggleOne(selected)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('QR_Code').withTitle('{{"MIS_LIST_COL_QR_CODE" | translate}}').renderWith(function (data, type) {
        //return '<img src="data:image/png;base64,' + data + '" onerror =' + "'" + 'this.src="' + '/images/default/no_image.png' + '"' + "'" + 'height="40" width="40">';
        return '<img src="../../../images/default/qrCode.png" height="40" width="40">';
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('RackName').withTitle('{{"MIS_LIST_COL_NAME_LINE_PALLET" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('RackPositionText').withTitle('{{"MIS_LIST_COL_LOCATION" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').notSortable().withOption('sClass', 'nowrap').withTitle('{{"MIS_LIST_COL_ACTION" | translate}}').renderWith(function (data, type, full) {
        return '<a title="Sửa" ng-click="edit(' + full.Id + ')" style = "width: 25px; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgba(85,168,253,0.45);" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-check"></i></a>' +
            '<a title="Xoá" ng-click="delete(' + full.Id + ')" style="width: 25px; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgba(230,60,95,0.45)" class=""><i style="--fa-primary-color: red;" class="fas fs30 fa-trash-alt"></i></a>';
    }));
    vm.reloadData = reloadData;
    vm.dtInstance = {};
    function reloadData(resetPaging) {
        vm.dtInstance.reloadData(callback, resetPaging);
    }
    function callback(json) {

    }
    function toggleAll(selectAll, selectedItems) {
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                selectedItems[id] = selectAll;
            }
        }
    }
    function toggleOne(selectedItems) {

        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                if (!selectedItems[id]) {
                    vm.selectAll = false;
                    return;
                }
            }
        }
        vm.selectAll = true;
    }
    function resetCheckbox() {
        $scope.selected = [];
        vm.selectAll = false;
    }
    $scope.reload = function () {
        reloadData(true);
    }
    $scope.reloadNoResetPage = function () {
        reloadData(false);
    }
    $scope.add = function () {
        //var modalInstance = $uibModal.open({
        //    animation: true,
        //    templateUrl: ctxfolderImpStore + '/add.html',
        //    controller: 'add',
        //    backdrop: 'static',
        //    size: '65'
        //});
        //modalInstance.result.then(function (d) {

        //}, function () {
        //});
    }

    $scope.edit = function (id) {
        $rootScope.rackID = id;
    }

    $rootScope.reloadRack = function () {
        reloadData(false);
    }
});

app.controller('showLog', function ($scope, $rootScope, $compile, $uibModal, $location, $filter, $uibModalInstance, dataserviceImpStore, $timeout, para) {
    var data = JSON.parse(para);
    //$scope.logs = [];
    //if (data != null) {
    //    for (var i = 0; i < data.length; ++i) {
    //        var obj = {
    //            CreatedTime: data[i].Header.UpdatedTime != null ? $filter('date')(new Date(data[i].Header.UpdatedTime), 'dd/MM/yyyy HH:mm:ss') : $filter('date')(new Date(data[i].Header.CreatedTime), 'dd/MM/yyyy HH:mm:ss'),
    //            CreatedBy: data[i].Header.UpdatedBy != null ? data[i].Header.UpdatedBy : data[i].Header.CreatedBy,
    //            Body: data[i]
    //        }

    //        $scope.logs.push(obj);
    //    }
    //}
    $scope.obj = { data: data, options: { mode: 'code' } };
    $scope.onLoad = function (instance) {
        instance.expandAll();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    setTimeout(function () {
        setModalMaxHeight('.modal');
        setModalDraggable('.modal-dialog');
    }, 1);
});

app.controller('detail', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceImpStore, $filter, para) {
    var vm = $scope;
    $scope.model = {
        CodeSet: '',
        ValueSet: '',
        AssetCode: para.AssetCode,
        Group: para.Group,
        GroupNote: para.GroupNote
    }
    $scope.listDataType = [];
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/CommonSetting/JTableDetail/",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.SettingGroup = para.Group;
            },
            complete: function () {
                App.unblockUI("#contentMain");
                //heightTableManual(500, "#tblDataDetail");
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(pageLength)
        .withOption('order', [2, 'asc'])
        .withOption('serverSide', true)
        .withOption('headerCallback', function (header) {
            if (!$scope.headerCompiled) {
                $scope.headerCompiled = true;
                $compile(angular.element(header).contents())($scope);
            }
        })
        .withOption('initComplete', function (settings, json) {
        })
        .withOption('createdRow', function (row, data, dataIndex) {
            const contextScope = $scope.$new(true);
            contextScope.data = data;
            contextScope.contextMenu = $scope.contextMenu;
            $compile(angular.element(row).contents())($scope);
            $compile(angular.element(row).attr('context-menu', 'contextMenu'))(contextScope);
            $(row).find('td:not(:has(label.mt-checkbox))').on('click', function (evt) {
                var self = $(this).parent();
                if ($(self).hasClass('selected')) {
                    $(self).removeClass('selected');
                    resetInput();
                } else {
                    $('#tblDataDetail').DataTable().$('tr.selected').removeClass('selected');
                    $(self).addClass('selected');
                    $scope.model.CodeSet = data.CodeSet;
                    $scope.model.ValueSet = data.ValueSet;
                    $scope.model.Type = data.Type;
                }
                $scope.$apply();
            });
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("SettingID").withTitle(titleHtml).notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full.SettingID] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.SettingID + ']" ng-click="toggleOne(selected)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', 'tcenter hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('_STT').withTitle('{{"COM_SET_LIST_COL_ORDER" | translate}}').notSortable().withOption('sWidth', '30px').withOption('sClass', 'tcenter w50').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ValueSet').withTitle('{{"COM_SET_LIST_COL_VALUE_SET" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('TypeName').withTitle('{{"COM_SET_LIST_COL_TYPE_NAME" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedTime').withTitle('{{"COM_SET_LIST_COL_CREATE_TIME" | translate}}').renderWith(function (data, type) {
        return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy') : null;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedBy').withTitle('{{"COM_SET_LIST_COL_CREATE_BY" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').notSortable().withOption('sClass', 'nowrap').withTitle('{{"COM_SET_LIST_COL_ACTION" | translate}}').renderWith(function (data, type, full) {
        return '<a title="Xoá" ng-click="delete(' + full.SettingID + ')" style="width: 25px; height: 25px; padding: 0px" class=""><i style="--fa-primary-color: red;" class="fas fs30 fa-trash-alt"></i></a>';
    }));
    vm.reloadData = reloadData;
    vm.dtInstance = {};
    function reloadData(resetPaging) {
        vm.dtInstance.reloadData(callback, resetPaging);
    }
    function callback(json) {

    }
    function toggleAll(selectAll, selectedItems) {
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                selectedItems[id] = selectAll;
            }
        }
    }
    function toggleOne(selectedItems) {
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                if (!selectedItems[id]) {
                    vm.selectAll = false;
                    return;
                }
            }
        }
        vm.selectAll = true;
    }
    function resetInput() {
        $scope.model.CodeSet = '';
        $scope.model.ValueSet = ''
    }
    $scope.reload = function () {
        reloadData(true);
    }
    $scope.reloadNoResetPage = function () {
        reloadData(false);
    }
    $scope.init = function () {
        dataserviceImpStore.getDataTypeCommon(function (rs) {
            rs = rs.data;
            $scope.listDataType = rs;
        });
    }
    $scope.init();
    $scope.add = function () {

        if ($scope.model.ValueSet == '') {
            App.toastrError("Giá trị cài đặt không được bỏ trống");
        } else if ($scope.model.ValueSet.length > 255) {
            App.toastrError("Vui lòng nhập giá trị cài đặt nhỏ hơn 255 ký tự");
        } else {
            dataserviceImpStore.insertCommonSetting($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    reloadData(true);
                }
            })
        }
    }
    $scope.edit = function () {
        if ($scope.model.CodeSet == '') {
            App.toastrError(caption.CP_CURD_MSG_DATA_NOT_BLANK)
        } else if ($scope.model.ValueSet.length > 255) {
            App.toastrError("Vui lòng nhập giá trị cài đặt nhỏ hơn 255 ký tự");
        } else {
            dataserviceImpStore.updateCommonSetting($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    reloadData(true);
                    resetInput();
                }
            })
        }
    }
    $scope.delete = function (id) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = caption.COM_MSG_DELETE_CONFIRM_COM;
                $scope.ok = function () {
                    dataserviceImpStore.deleteCommonSetting(id, function (rs) {
                        rs = rs.data;
                        if (rs.Error) {
                            App.toastrError(rs.Title);
                        } else {
                            App.toastrSuccess(rs.Title);
                            $uibModalInstance.close();
                        }
                    });
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: '25',
        });
        modalInstance.result.then(function (d) {
            $scope.reloadNoResetPage();
        }, function () {
        });
    }
    $scope.cancel = function () {
        //$uibModalInstance.dismiss('cancel');
        $uibModalInstance.close();
    }
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('ticket-imp-attr-value', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceImpStore, $filter, para) {
    $scope.model = {
        AttrCode: "",
        Value: '',
        PackCode: ''
    }

    $scope.cancel = function () {
        $uibModalInstance.close();
    }

    $scope.initData = function () {
        dataserviceImpStore.getProductUnit(function (rs) {
            rs = rs.data;
            $scope.listUnit = rs;
        })

        dataserviceImpStore.getAttrProduct(para.ProductCode, function (rs) {
            rs = rs.data;
            $scope.listAttr = rs;
        })

        dataserviceImpStore.getAttrValue(para.TicketCode, para.ProductCode, function (rs) {
            rs = rs.data;
            $scope.lstAttrValue = rs;
        })
    }

    $scope.initData();

    $scope.submit = function () {
        validationSelect($scope.model);
        if (!validationSelect($scope.model).Status) {
            var data = {
                TicketImpCode: para.TicketCode,
                ProdCode: para.ProductCode,
                Code: $scope.model.AttrCode,
                Value: $scope.model.Value,
                Unit: $scope.model.Unit
            };

            dataserviceImpStore.insertAttrValue(data, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);

                    dataserviceImpStore.getAttrValue(para.TicketCode, para.ProductCode, function (rs) {
                        rs = rs.data;
                        $scope.lstAttrValue = rs;
                    })
                }
            })
        }
    }

    $scope.changeSelect = function (selectType) {
        if (selectType === "AttrCode") {
            if ($scope.model.AttrCode == "") {
                $scope.errorAttrCode = true;
            }
            else {
                $scope.errorAttrCode = false;
            }

            if ($scope.model.AttrCode === "PACK_ATTR") {
                dataserviceImpStore.getTreePack("", "", function (rs) {
                    rs = rs.data;
                    $scope.listAttrValue = rs;
                })
            }
        }
        if (selectType === "PackCode") {
            if ($scope.model.PackCode == "") {
                $scope.errorPackCode = true;
            }
            else {
                $scope.errorPackCode = false;
            }
            dataserviceImpStore.gonvertRecords2Packing($scope.model.PackCode, function (rs) {
                rs = rs.data;
                $scope.model.Value = rs;
                $scope.restrictUnit();
            })
        }
    }

    $scope.restrictUnit = function () {
        if ($scope.model.Value != "") {
            debugger
            $scope.model.Unit = "";
            var jsonPacking = JSON.stringify($rootScope.jsonSpecification($scope.model.Value));
            dataserviceImpStore.unitFromPack(jsonPacking, function (rs) {
                rs = rs.data;
                $scope.lstUnit = rs.Object;
            })
        }
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        if (data.AttrCode == "") {
            $scope.errorAttrCode = true;
            mess.Status = true;
        } else {
            $scope.errorAttrCode = false;
        }

        if (data.PackCode == "") {
            $scope.errorPackCode = true;
            mess.Status = true;
        } else {
            $scope.errorPackCode = false;

        }
        return mess;
    }

    $scope.delete = function (id) {
        dataserviceImpStore.deleteAttrValue(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataserviceImpStore.getAttrValue(para.TicketCode, para.ProductCode, function (rs) {
                    rs = rs.data;
                    $scope.lstAttrValue = rs;
                })
            }
        })
    }

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('word', function ($scope, $rootScope, $compile, $uibModal, $location, $filter, $uibModalInstance, dataserviceImpStore, $timeout, para) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    }
    $scope.IsEdit = false;
    //wflow
    $scope.modelWf = {
        WorkflowCode: "",
        ObjectType: "DECISION_END_CONTRACT",
        ObjectInst: "",
    };
    $scope.portType = para.PortType;
    $scope.initData = function () {

    }
    $scope.initData();
    $scope.changeUnit = function (data) {
        //dataserviceEndContract.getUserDepartment(data, function (rs) {
        //    rs = rs.data;
        //    $scope.lstUserinDpt = rs;
        //    if (rs != null && rs != undefined && rs != "") {
        //        var all = {
        //            Code: "",
        //            Name: caption.COM_TXT_ALL
        //        }
        //        $scope.lstUserinDpt.unshift(all)
        //    }
        //})
    }
    //$scope.changeEmployee = function (data) {
    //    for (var i = 0; i < $scope.lstUserinDpt.length; i++) {
    //        if ($scope.lstUserinDpt[i].Code == data) {
    //            $scope.model.NewRole = $scope.lstUserinDpt[i].OldRole;
    //        }
    //    }
    //}
    //$scope.checkloop = function () {
    //    $scope.ListEmp = [];
    //}

    $scope.uploadFile = async function () {
        var file = document.getElementById("FileItem").files[0];
        if (file == null || file == undefined || file == "") {
            App.toastrError(caption.COM_MSG_CHOSE_FILE);
        } else {
            var formdata = new FormData();
            formdata.append("files", file);

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            var resultImp = await fetch("/Admin/MaterialImpStore/Import", requestOptions);
            var txt = await resultImp.text();
            console.log(txt);
            $scope.defaultRTE.value = txt;
            setTimeout(function () {
                var obj = $scope.defaultRTE.getContent();
                $scope.listPage = $(obj).find("> div > div").toArray();
                $scope.ticketCode = $($scope.listPage[0]).find('*:nth-child(2) table > tbody > tr:nth-child(2) > td:nth-child(3) > p:nth-child(1) > span:nth-child(2)')?.text() ?? '';
                console.log('ticketCode', $scope.ticketCode);
                $scope.listNestedDetail = $($scope.listPage[0]).find('*:nth-child(2) table > tbody > tr:gt(7)').toArray()
                    .filter(y => $(y).find('> td > p').toArray().length === 10)
                    .map(y => $(y).find('> td > p').toArray().map(t => $(t).toArray().map(z => $(z).text())[0]));
                console.log($scope.listNestedDetail);
                $scope.listFlatDetail = $scope.listNestedDetail.filter(x => x[1] && x[1].trim() !== '')
                    .map(x => (
                        {
                            ProductCode: x[1],
                            ProductName: x[2],
                            UnitName: x[3],
                            Quantity: parseInt(x[4].split(',')[0].replaceAll(' ', '')),
                            Cost: parseInt(x[6].split(',')[0].replaceAll(' ', '')),
                            TicketCode: $scope.ticketCode
                        }
                    ));
                console.log($scope.listFlatDetail);
                setTimeout(function () {
                    $scope.$apply();
                });
            }, 100);
        }
    };
    var url = "";
    $scope.openExcel = false;
    $scope.fileNameChanged = function () {
        $scope.openExcel = true;
        setTimeout(function () {
            $scope.$apply();
        });
        //$('.openExcel').removeClass('hidden');
    }
    $scope.loadExcel = function () {
        var form = new FormData;
        var file = document.getElementById("FileItem").files[0];
        form.append("fileUpload", file);
        form.append("fileNameUpload", file.name);
        if (file === null || file === undefined || file === "") {
            App.toastrError(caption.COM_MSG_CHOSE_FILE);
        } else {
            var excel = ['.xlsm', '.xlsx', '.xlsb', '.xltx', '.xltm', '.xls', '.xlt', '.xls', '.xml', '.xml', '.xlam', '.xla', '.xlw', '.xlr'];

            window.open(url, '_blank');

        }
    };
    $scope.model = {
        ProductCode: '',
        Unit: '',
        Cost: 0,
        Quantity: 0
    };
    $scope.editDetails = function (data) {
        $scope.model.Id = data.Id;
        $scope.model.ProductCode = data.ProductCode;
        $scope.model.ProductName = data.ProductName;
        //$scope.changeUnit($scope.model.DepartmentCode);
        $scope.model.UnitName = data.UnitName;
        $scope.model.Unit = data.Unit;
        $scope.model.SCost = data.SCost;
        $scope.model.Cost = data.Cost;
        $scope.model.Quantity = data.Quantity;
        $scope.model.SQuantity = data.SQuantity;
        $scope.model.SupplierCode = data.SupplierCode;
        //$scope.changeEmployee($scope.model.EmployeeCode);
        $scope.IsEdit = true;
    }
    $scope.delete = function (data) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = caption.COM_MSG_DELETE_CONFIRM.replace('{0}', "");
                $scope.ok = function () {
                    rs = true;
                    $uibModalInstance.close();
                };
                $scope.cancel = function () {
                    rs = false;
                    $uibModalInstance.close();
                };
            },
            size: '25',
        });
        modalInstance.result.then(function () {
            if (rs) {
                $scope.Listdata.splice($scope.Listdata.findIndex(v => v.Id === data.Id), 1);
            }
        }, function () {
        });
    }
    $scope.submitEdit = function () {
        $scope.lstModel = [];
        //dataserviceEndContract.logInfomation($scope.model, function (rs) {
        //    rs = rs.data;
        //    if (rs.Error) {
        //        App.toastrError(rs.Title);
        //    } else {
        //        App.toastrSuccess(rs.Title);

        //    }
        //});
        $scope.lstModel = $scope.model;
        for (var i = 0; i < $scope.Listdata.length; i++) {
            if ($scope.Listdata[i].Id == $scope.lstModel.Id) {
                $scope.Listdata[i].ProductCode = $scope.lstModel.ProductCode;
                $scope.Listdata[i].ProductName = $scope.lstModel.ProductName;
                $scope.Listdata[i].UnitName = $scope.lstModel.UnitName;
                $scope.Listdata[i].Unit = $scope.lstModel.Unit;
                $scope.Listdata[i].SCost = $scope.lstModel.SCost;
                $scope.Listdata[i].Cost = $scope.lstModel.Cost;
                $scope.Listdata[i].SQuantity = $scope.lstModel.SQuantity;
                $scope.Listdata[i].Quantity = $scope.lstModel.Quantity;
                $scope.Listdata[i].SupplierCode = $scope.lstModel.SupplierCode;
                //$scope.Listdata[i].checkloop = $scope.lstModel.Reason;
            }
        }
        $scope.IsEdit = false;
        /*for (var i = 0; i < $scope.Listdata.length; i++) {
            if ($scope.lstUserinDpt[i].Id == data.Id) {
                $scope.model.OldRole = $scope.lstUserinDpt[i].OldRole;
            }
            $scope.ListEmp.push(obj);
        }*/
    }
    $scope.modelHeader = {
        SupplierCode: ''
    };
    $scope.valiteData = function () {
        if ($scope.modelHeader.SupplierCode === undefined || $scope.modelHeader.SupplierCode === null || $scope.modelHeader.SupplierCode === '') {
            return App.toastrError("Nhà cung cấp trống");
        }
        dataserviceProject.validateData({ ListEmp: $scope.Listdata, PortType: para.PortType, ProjectCode: $rootScope.ProjectCode }, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
                //$uibModalInstance.close();
            } else {
                App.toastrSuccess("Không có bản ghi lỗi, có thể lưu lại");
                $scope.showSubmit = true;
            }
            $scope.Listdata = rs.Object.ListEmp;
        });
    }
    $scope.submit = function () {
        if ($scope.listFlatDetail.length == 0) {
            App.toastrError("Danh sách trống, vui lòng nhập dữ liệu");
        }
        else {
            dataserviceImpStore.insertFromWord($scope.listFlatDetail, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    //$location.path('/');
                    $uibModalInstance.close();
                    $rootScope.$broadcast('RELOAD_LIST_MATERIAL_IMPORT_DETAIL', $scope.ticketCode);
                }
            });
        }
    }
    $scope.cancelEdit = function () {
        $scope.IsEdit = false;
    }
    $scope.defaultRTE = null;
    $scope.listPage = [];
    $scope.listNestedDetail = [];
    $scope.listFlatDetail = [];
    $scope.ticketCode = '';
    function loadDate() {
        //$("#Decisiondate").datepicker({
        //    inline: false,
        //    autoclose: true,
        //    format: "dd/mm/yyyy",
        //    fontAwesome: true,
        //});
        //$("#planDate").datepicker({
        //    inline: false,
        //    autoclose: true,
        //    format: "dd/mm/yyyy",
        //    fontAwesome: true,
        //    todayBtn: true,
        //    todayHighlight: true
        //});
    }
    setTimeout(async function () {
        loadDate();
        // initialize Rich Text Editor component
        $scope.defaultRTE = new ej.richtexteditor.RichTextEditor({
            height: '850px'
        });
        // Render initialized Rich Text Editor.
        $scope.defaultRTE.appendTo('#defaultRTE');
        var obj = $scope.defaultRTE.getContent();
        obj.firstChild.contentEditable = 'false'
        //var url = "/files/Template/PRODUCT_IMP/EVN_INV_TMP.rtf";
        //var result = await fetch(url);
        //var blob = await result.blob();
    }, 50);
});
