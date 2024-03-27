var ctxfolder = "/views/admin/edmsWarehouseManagerDocument";
var ctxfolderDiagram = "/views/admin/edmsDiagramWarehouseDocument";
var ctxfolderMessage = "/views/message-box";
var app = angular.module('App_ESEIM', ["ui.bootstrap", "ngRoute", "ngCookies", "ngValidate", "datatables", "datatables.bootstrap", "ngJsTree", "treeGrid", "pascalprecht.translate", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', 'ui.select', 'ngTagsInput', 'dynamicNumber']);
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
app.factory('dataservice', function ($http) {
    $http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    var headers = {
        "Content-Type": "application/json;odata=verbose",
        "Accept": "application/json;odata=verbose",
    }
    var submitFormUpload = function (url, data, callback) {
        var req = {
            method: 'POST',
            url: url,
            beforeSend: function () {
                App.blockUI({
                    target: "#modal-body",
                    boxed: true,
                    message: 'loading...'
                });
            },
            headers: {
                'Content-Type': undefined
            },
            complete: function () {
                App.unblockUI("#modal-body");
            },
            data: data
        }
        $http(req).then(callback);
    };
    return {
        //Sinh mã QR_CODE
        generatorQRCode: function (data, callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/GenQRCode?code=' + data, callback).then(callback);
        },
        getObjectsType: function (callback) {
            $http.post('/Admin/EDMSRepository/GetObjectsType').then(callback);
        },
        getListObject: function (data, callback) {
            $http.get('/Admin/EDMSRepository/GetListObject?objectType=' + data).then(callback);
        },
        //Deprecated
        //getListWareHouse: function (callback) {
        //    $http.get('/Admin/EDMSDiagramWarehouseDocument/GetListWareHouseOld').then(callback);
        //},
        //getListFloorByWareHouseCode: function (data, callback) {
        //    $http.get('/Admin/EDMSDiagramWarehouseDocument/GetListFloorByWareHouseCodeOld?wareHouseCode=' + data).then(callback);
        //},
        //getListLineByFloorCode: function (data, callback) {
        //    $http.get('/Admin/EDMSDiagramWarehouseDocument/GetListLineByFloorCodeOld?floorCode=' + data).then(callback);
        //},
        //getListRackByLineCode: function (data, callback) {
        //    $http.get('/Admin/EDMSDiagramWarehouseDocument/GetListRackByLineCode?lineCode=' + data).then(callback);
        //},
        getListChildByFloorCode: function (data, callback) {
            $http.get('/Admin/EDMSDiagramWarehouseDocument/GetListChildByFloorCode?floorCode=' + data).then(callback);
        },
        //New Dynamic
        getListWareHouse: function (callback) {
            $http.get('/Admin/EDMSDiagramWarehouseDocument/GetListAreaCategory?type=AREA&parentCode=').then(callback);
        },
        getListFloorByWareHouseCode: function (data, callback) {
            $http.get('/Admin/EDMSDiagramWarehouseDocument/GetListAreaCategory?type=FLOOR&parentCode=' + data).then(callback);
        },
        getListLineByFloorCode: function (data, callback) {
            $http.get('/Admin/EDMSDiagramWarehouseDocument/GetListAreaCategory?type=LINE&parentCode=' + data).then(callback);
        },
        getListRackByLineCode: function (data, callback) {
            $http.get('/Admin/EDMSDiagramWarehouseDocument/GetListAreaCategory?type=RACK&parentCode=' + data).then(callback);
        },
        getListAreaByParentCode: function (data, data1, callback) {
            $http.get(`/Admin/EDMSDiagramWarehouseDocument/GetListAreaCategory?type=${data}&parentCode=${data1}`).then(callback);
        },
        // End New Dynamic
        getZoneDetail: function (data, callback) {
            $http.get('/Admin/EDMSDiagramWarehouseDocument/GetZoneDetail?zoneCode=' + data).then(callback);
        },
        getListCabinet: function (data, callback) {
            $http.get('/Admin/EDMSDiagramWarehouseDocument/GetListCabinet?floorCode=' + data).then(callback);
        },
        getPositionByFileID: function (data, callback) {
            $http.post('/Admin/EDMSDiagramWarehouseDocument/GetPositionByFileIdNew?id=' + data).then(callback);
        },
        getListUser: function (callback) {
            $http.post('/Admin/EDMSDiagramWarehouseDocument/GetListUser').then(callback);
        },
        getRackDetail: function (data, callback) {
            $http.get('/Admin/EDMSDiagramWarehouseDocument/GetRackDetail?rackCode=' + data).then(callback);
        },
        getPackDetail: function (data, callback) {
            $http.get('/Admin/EDMSDiagramWarehouseDocument/GetPackDetail?cabinetCode=' + data).then(callback);
        },
        saveData: function (data, callback) {
            $http.post('/Admin/EDMSDiagramWarehouseDocument/SaveData', data).then(callback);
        },
        loadData: function (data, callback) {
            $http.post('/Admin/EDMSDiagramWarehouseDocument/LoadData?floorCode=' + data).then(callback);
        },
        //Danh sách kho, tầng, dãy
        getListWareHouseWithType: function (data, callback) {
            $http.get('/Admin/edmsWarehouseManagerDocument/GetListWareHouse?type=' + data, callback).then(callback);
        },
        getListFloor: function (callback) {
            $http.get('/Admin/edmsWarehouseManagerDocument/GetListFloor', callback).then(callback);
        },
        getListLine: function (callback) {
            $http.get('/Admin/edmsWarehouseManagerDocument/GetListLine', callback).then(callback);
        },

        //Chi tiết 1 kho
        getDetailWareHouse: function (data, callback) {
            $http.get('/Admin/edmsWarehouseManagerDocument/GetDetailWareHouse?wareHouseCode=' + data).then(callback);
        },

        //Danh sách người quản lý
        getListManager: function (callback) {
            $http.get('/Admin/edmsWarehouseManagerDocument/GetListManager', callback).then(callback);
        },
        //List danh sách nhân viên (người quản lý)
        getListStaffBranch: function (callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/GetListStaffBranch/', callback).then(callback);
        },
        //Sinh mã tầng tự động
        genFloorCode: function (wareHouseCode, floorName, callback) {
            $http.get('/Admin/edmsWarehouseManagerDocument/GenFloorCode?wareHouseCode=' + wareHouseCode + '&floorName=' + floorName, callback).then(callback);
        },
        genLineCode: function (floorCode, lineName, callback) {
            $http.get('/Admin/edmsWarehouseManagerDocument/GenLineCode?floorCode=' + floorCode + '&lineName=' + lineName, callback).then(callback);
        },
        genRackCode: function (lineCode, rackName, callback) {
            $http.get('/Admin/edmsWarehouseManagerDocument/GenRackCode?lineCode=' + lineCode + '&rackName=' + rackName, callback).then(callback);
        },

        //Sinh mã QR_CODE
        generatorQRCode: function (data, callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/GenQRCode?code=' + data, callback).then(callback);
        },

        //Thêm sửa xóa tầng
        insertFloor: function (data, callback) {
            submitFormUpload('/Admin/edmsWarehouseManagerDocument/InsertFloor', data, callback);
        },
        getFloorInfo: function (data, callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/GetFloorInfo?floorId=' + data).then(callback);
        },
        updateFloor: function (data, callback) {
            submitFormUpload('/Admin/edmsWarehouseManagerDocument/UpdateFloor', data, callback);
        },
        deleteFloor: function (data, callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/DeleteFloor?floorId=' + data).then(callback);
        },

        //Thêm sửa xóa dãy
        insertLine: function (data, callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/InsertLine', data, callback).then(callback);
        },
        getLineInfo: function (data, callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/GetLineInfo?lineId=' + data).then(callback);
        },
        updateLine: function (data, callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/UpdateLine', data).then(callback);
        },
        deleteLine: function (data, callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/DeleteLine?lineId=' + data).then(callback);
        },

        //Thêm sửa xóa kệ
        insertRack: function (data, callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/InsertRack', data, callback).then(callback);
        },
        getRackInfo: function (data, callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/GetRackInfo?rackId=' + data).then(callback);
        },
        updateRack: function (data, callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/UpdateRack', data).then(callback);
        },
        deleteRack: function (data, callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/DeleteRack?rackId=' + data).then(callback);
        },

        //Thêm sửa xóa thùng
        insertBox: function (data, callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/InsertBox', data, callback).then(callback);
        },
        updateBox: function (data, callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/UpdateBox', data).then(callback);
        },
        deleteItemBoxs: function (data, callback) {
            $http.post('/Admin/edmsWarehouseManagerDocument/DeleteItemBoxs', data).then(callback);
        },

        //Thêm sửa xóa danh mục khu vực
        insertCategory: function (data, callback) {
            $http.post('/Admin/EDMSDiagramWarehouseDocument/InsertCategory', data).then(callback);
        },
        getCategory: function (data, callback) {
            $http.post('/Admin/EDMSDiagramWarehouseDocument/GetCategory?id=' + data).then(callback);
        },
        updateCategory: function (data, callback) {
            $http.post('/Admin/EDMSDiagramWarehouseDocument/UpdateCategory', data).then(callback);
        },
        deleteCategory: function (data, callback) {
            $http.post('/Admin/EDMSDiagramWarehouseDocument/DeleteCategory?id=' + data).then(callback);
        },

        //Thêm sửa xóa neo
        insertMapping: function (data, callback) {
            $http.post('/Admin/EDMSDiagramWarehouseDocument/InsertMapping', data).then(callback);
        },
        updateMapping: function (data, callback) {
            $http.post('/Admin/EDMSDiagramWarehouseDocument/UpdateMapping', data).then(callback);
        },
        updateMappingShape: function (data, callback) {
            $http.post('/Admin/EDMSDiagramWarehouseDocument/UpdateMappingShape', data).then(callback);
        },
        saveMappingShape: function (data, callback) {
            $http.post('/Admin/EDMSDiagramWarehouseDocument/SaveMappingShape', data).then(callback);
        },
        getMapping: function (data, callback) {
            $http.post('/Admin/EDMSDiagramWarehouseDocument/GetMapping?position=' + data).then(callback);
        },
        deleteMapping: function (data, callback) {
            $http.post('/Admin/EDMSDiagramWarehouseDocument/DeleteMapping?id=' + data).then(callback);
        },
        getListMapping: function (data, callback) {
            $http.get('/Admin/EDMSDiagramWarehouseDocument/GetListMapping?start=' + data).then(callback);
        },
        // upload image
        uploadImage: function (data, callback) {
            submitFormUpload('/Admin/materialProduct/UploadImage/', data, callback);
        },
        // data type
        getListATTRTYPE: function (callback) {
            $http.post('/Admin/AttributeSetup/GetListATTRTYPE').then(callback);
        },
    };
});
app.directive('autoLoad', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var src = scope.$eval(attrs.autoLoad);
            //element.on('change', onChangeHandler);
            //element.on('$destroy', function () {
            //    element.off();
            //});
            scope.$watch($parse(attrs.autoLoad), function (newval) {
                var src = newval;
                if (element.length && element.length > 0 && src != '' && src != null) {
                    element[0].src = src;
                    element.css('background', 'white');
                }
            });
        }
    };
});
app.directive('customOnChange', function () {
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

app.directive('fabricCanvas', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {
            var innerCanvas = el[0].querySelector('canvas');
            var outerWidth = attrs.width;
            var outerHeight = attrs.height;
            var canvas = new fabric.Canvas(innerCanvas, {
                width: outerWidth, height: outerHeight,
                fireRightClick: true,  // <-- enable firing of right click events
                // fireMiddleClick: true, // <-- enable firing of middle click events
                stopContextMenu: true, // <--  prevent context menu from showing 
                getScale: () => canvas.viewportTransform[0],
                getLeft: () => canvas.viewportTransform[4],
                getTop: () => canvas.viewportTransform[5],
            });
            scope.canvas = canvas;
        }
    };
});
app.controller('Ctrl_ESEIM', function ($scope, $rootScope, $compile, $cookies, $translate) {
    $scope.mobilePortletVisible = false;
    $scope.showBtn = true;

    $scope.toggleMobilePortlet = function () {
        $scope.mobilePortletVisible = !$scope.mobilePortletVisible;
        $scope.showBtn = false;
    };

    $scope.toggleMobileBtn = function () {
        $scope.mobilePortletVisible = false;
        $scope.showBtn = true;
    };

    $rootScope.go = function (path) {
        $location.path(path); return false;
    };
    var culture = $cookies.get('_CULTURE') || 'vi-VN';
    $translate.use(culture);
    $rootScope.IsTranslate = false;
    $rootScope.$on('$translateChangeSuccess', function () {
        $rootScope.IsTranslate = true;
        caption = caption[culture] ? caption[culture] : caption;
        $rootScope.checkDataDiagram = function (data) {
            var partternCode = /^[a-zA-Z0-9._äöüÄÖÜ]*$/g;
            var partternTelephone = /[0-9]/g;
            var partternVersion = /^\d+(\.\d+)*$/g;
            var mess = { Status: false, Title: "" }
            if (!partternCode.test(data.WHS_Code) && data.WHS_Code != null && data.WHS_Code != '' && data.WHS_Code != undefined) {
                mess.Status = true;
                mess.Title = mess.Title.concat(" - ", "Mã không được chứa ký tự đặc biệt và khoảng trắng.", "<br/>");
            }
            return mess;
        }
        $.extend($.validator.messages, {
            min: caption.COM_VALIDATE_VALUE_MIN,
            //max: 'Max some message {0}'
        });
        $rootScope.validationOptionsCategory = {
            rules: {
                PAreaCode: {
                    required: true
                },
            },
            messages: {
                PAreaCode: {
                    required: caption.EDMSWM_VALIDATE_AREA_CODE,
                },
            }
        }
        $rootScope.validationOptionsFile = {
            rules: {
                FileName: {
                    required: true
                },
            },
            messages: {
                FileName: {
                    required: caption.EDMSWHPV_VALIDATE_NAME_FILE,
                },
            }
        }
        $rootScope.validationOptionsmore = {
            rules: {
                ext_code: {
                    required: true,
                    maxlength: 100
                },
                ext_value: {
                    required: true,
                    maxlength: 500
                },
            },
            messages: {
                ext_code: {
                    required: caption.COM_ERR_REQUIRED.replace("{0}", caption.EDMSWHPV_CURD_LBL_EXT_CODE),
                    maxlength: caption.COM_ERR_EXCEED_CHARACTERS.replace("{0}", caption.EDMSWHPV_CURD_LBL_EXT_CODE).replace("{1}", "50")
                },
                ext_value: {
                    required: caption.COM_ERR_REQUIRED.replace("{0}", caption.EDMSWHPV_CURD_LBL_EXT_VALUE),
                    maxlength: caption.COM_ERR_EXCEED_CHARACTERS.replace("{0}", caption.EDMSWHPV_CURD_LBL_EXT_VALUE).replace("{1}", "50")
                },
            }
        }
        $rootScope.validationOptionsSearch = {
            rules: {
                Code: {
                    required: true
                },
                Name: {
                    required: true
                },
                Address: {
                    required: true
                },
                AreaSquare: {
                    required: true
                },
                Floor: {
                    required: true
                }
            },
            messages: {
                Code: {
                    required: caption.EDMSWHPV_VALIDATE_CODE,
                },
                Name: {
                    required: caption.EDMSWHPV_VALIDATE_NAME,
                },
                Address: {
                    required: caption.EDMSWHPV_VALIDATE_ADDRESS,
                },
                AreaSquare: {
                    required: caption.EDMSWHPV_VALIDATE_AREA,
                },
                Floor: {
                    required: caption.EDMSWHPV_VALIDATE_CNT_FLOOR,
                }
            }
        }
        $rootScope.checkData = function (data) {
            var partternNumber = /^[1-9]\d*(\\d+)?$/;
            var mess = { Status: false, Title: "" }
            if (!partternNumber.test(data.CNT_Box)) {
                mess.Status = true;
                mess.Title = mess.Title.concat(" - ", caption.EDMSWM_VALIDATE_BOX_NUMBER, "<br/>");
            }
            return mess;
        }
        $rootScope.validationOptions = {
            rules: {
                CNT_Line: {
                    required: true
                },
                FloorCode: {
                    required: true
                },
                FloorName: {
                    required: true
                },
                AreaSquare: {
                    required: true
                },
                LineCode: {
                    required: true
                },
                CNT_Rack: {
                    required: true
                },
                L_Text: {
                    required: true
                },
                RackCode: {
                    required: true
                },
                RackName: {
                    required: true
                },
                CNT_Box: {
                    required: true
                }
            },
            messages: {
                CNT_Line: {
                    required: caption.EDMSWM_VALIDATE_CNT_LINE
                },
                FloorCode: {
                    required: 'Tầng yêu cầu bắt buộc!'
                },
                FloorName: {
                    required: caption.EDMSWM_VALIDATE_FLOOR_NAME
                },
                AreaSquare: {
                    required: caption.EDMSWM_VALIDATE_AREA_SQUARE
                },
                LineCode: {
                    required: caption.EDMSWM_VALIDATE_LINE_CODE
                },
                CNT_Rack: {
                    required: caption.EDMSWM_VALIDATE_CNT_RACK
                },
                L_Text: {
                    required: caption.EDMSWM_VALIDATE_LINE_TEXT
                },
                RackCode: {
                    required: 'Mã kệ yêu cầu bắt buộc!'
                },
                RackName: {
                    required: caption.EDMSWM_VALIDATE_RACK_NAME
                },
                CNT_Box: {
                    required: caption.EDMSWM_VALIDATE_CNT_BOX
                }
            }
        }
        $rootScope.IsTranslate = true;
        $rootScope.listWareHouse = [{ Code: '', Name: caption.COM_TXT_ALL }];
        $rootScope.listFloor = [{ Code: '', Name: caption.COM_TXT_ALL }];
        $rootScope.listLine = [{ Code: '', Name: caption.COM_TXT_ALL }];
        $rootScope.listRack = [{ Code: '', Name: caption.COM_TXT_ALL }];
        $rootScope.listPosition = [{ Code: '', Name: caption.COM_TXT_ALL }];
    });

    $rootScope.zoomMapDefault = 16;
    $rootScope.latDefault = 21.0277644;
    $rootScope.lngDefault = 105.83415979999995;
    $rootScope.addressDefault = 'Hanoi, Hoàn Kiếm, Hanoi, Vietnam';
    $rootScope.type = type;
    $rootScope.Object = {
        WHS_Code: '',
    }

    $rootScope.listType = [{
        Code: '1',
        Name: 'Tập'
    }, {
        Code: '2',
        Name: 'Cuốn'
    }, {
        Code: '3',
        Name: 'Thùng'
    }];
    //manager
    $rootScope.listWareHouse = [];
    $rootScope.listFloor = [];
    $rootScope.listLine = [];
    $rootScope.listRack = [];
    $rootScope.listPosition = [];

    $rootScope.wareHouseID = null;
    $rootScope.floorID = null;
    $rootScope.lineID = null;
    $rootScope.rackID = null;
    $rootScope.positionID = null;

    $rootScope.wareHouseCode = null;
    $rootScope.floorCode = null;
    $rootScope.lineCode = null;
    $rootScope.rackCode = null;
    $rootScope.positionCode = null;

    $rootScope.wareHouseReload = false;
    $rootScope.floorReload = false;
    $rootScope.lineReload = false;
    $rootScope.rackReload = false;
    $rootScope.positionReload = false;

    $rootScope.StatusFloor = [{
        Value: '1',
        Name: 'Hoạt động'
    }, {
        Value: '0',
        Name: 'Không hoạt động'
    }];

    $rootScope.StatusLine = [{
        Value: '1',
        Name: 'Hoạt động'
    }, {
        Value: '0',
        Name: 'Không hoạt động'
    }];

    $rootScope.StatusRack = [{
        Value: '1',
        Name: 'Hoạt động'
    }, {
        Value: '0',
        Name: 'Không hoạt động'
    }];
    $rootScope.Type = type;
    $rootScope.change_alias = function (alias) {
        var str = alias;
        str = str.toLowerCase();
        str = str.replace(/ /g, "");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, "");
        str = str.replace(/ + /g, "");
        str = str.trim();
        return str.toUpperCase();
    }
});

app.config(function ($routeProvider, $validatorProvider, $translateProvider, $httpProvider) {
    $translateProvider.useUrlLoader('/Admin/EDMSDiagramWarehouseDocument/Translation');
    caption = $translateProvider.translations();
    $routeProvider
        .when('/', {
            templateUrl: ctxfolderDiagram + '/index.html',
            controller: 'index'
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
app.controller('index', function ($scope, $rootScope, $compile, $http, $q, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice) {
    $scope.model = {
        WhsCode: '',
        FloorCode: '',
        LineCode: '',
        RackCode: '',
        PositionCode: '',
        Mapping: ''
    };
    $scope.cancel = function () {
        $scope.setsize = false;
        /* $scope.momo = false;*/
    };

    $scope.hidelst = function () {
        $scope.setsize = true;
        var canvas = $rootScope.canvas2;
    }
    $scope.redesign = function (data) {
        var jsont = $rootScope.shapeData;


        var canvas = $rootScope.canvas2;
        canvas.clear();
        var arrJson = [];

        for (var i = 0; i < jsont.length; i++) {
            t = jsont[i];
            if (t.type == "RACK") {
                if (data.showrack == true) {
                    if (data.rack == 1) {
                        t.width = 300;
                        t.height = 100;
                        t.path = "/images/wareHouse/rack_ngang.svg"
                        t.labels[0].y = 100;
                        t.labels[0].x = 0;
                        t.labels[1].x = 135;
                        t.labels[1].y = 5;
                        t.labels[2].y = 100;
                        t.labels[2].x = 0;
                        t.labels[3].y = 100;
                        t.labels[3].x = 150;
                        t.labels[4].x = 0;
                        t.labels[4].y = 120;
                        t.labels[5].x = 150;
                        t.labels[5].y = 120;
                        t.labels[6].x = 150;
                        t.labels[6].y = 120;
                        t.labels[7].x = 303;
                        t.labels[7].y = 80;
                        arrJson.push(t);
                    }
                    if (data.rack == 2) {
                        t.path = "/images/wareHouse/rack_ngang.svg";
                        t.width = 240;
                        t.height = 80;
                        t.labels[0].y = 80;
                        t.labels[2].y = 80;
                        t.labels[3].y = 80;
                        t.labels[4].y = 100;
                        t.labels[5].y = 100;
                        t.labels[6].y = 100;
                        t.labels[1].x = 110;
                        arrJson.push(t);
                    }
                    if (data.rack == 3) {
                        t.path = "/images/wareHouse/rack_ngang.svg";
                        t.width = 150;
                        t.height = 50;
                        t.labels[0].y = 55;
                        t.labels[0].x = -75;
                        t.labels[1].x = 65;
                        t.labels[1].y = -5;
                        t.labels[2].y = 55;
                        t.labels[2].x = -75;
                        t.labels[3].y = 55;
                        t.labels[3].x = 75;
                        t.labels[4].x = -75;
                        t.labels[4].y = 75;
                        t.labels[5].x = 75;
                        t.labels[5].y = 75;
                        t.labels[6].x = 75;
                        t.labels[6].y = 75;
                        t.labels[7].x = 225;
                        arrJson.push(t);
                    }
                    if (data.rack == 4) {
                        t.width = 90;
                        t.height = 30;
                        t.path = "/images/wareHouse/covayden.svg"
                        t.labels[0].y = 50;
                        t.labels[0].x = -110;
                        t.labels[1].x = 30;
                        t.labels[1].y = -10;
                        t.labels[2].y = 65;
                        t.labels[2].x = -110;
                        t.labels[3].y = 65;
                        t.labels[3].x = 40;
                        t.labels[4].x = -110;
                        t.labels[4].y = 85;
                        t.labels[5].x = 40;
                        t.labels[5].y = 85;
                        t.labels[6].x = 40;
                        t.labels[6].y = 85;
                        t.labels[7].x = 190;
                        t.labels[7].y = 95;
                        //
                        t.labels[0].cssClass = "hide";
                        t.labels[1].cssClass = t.labels[1].cssClass + " " + "hide";
                        t.labels[2].cssClass = t.labels[2].cssClass + " " + "hide";
                        t.labels[3].cssClass = t.labels[3].cssClass + " " + "hide";
                        t.labels[4].cssClass = t.labels[4].cssClass + " " + "hide";
                        t.labels[5].cssClass = t.labels[5].cssClass + " " + "hide";
                        t.labels[6].cssClass = t.labels[6].cssClass + " " + "hide";
                        t.labels[7].cssClass = t.labels[7].cssClass + " " + "hide";
                        arrJson.push(t);
                    }
                }
            }

            if (t.type == "CABINET") {
                if (data.showcabin == true) {
                    if (data.cabin == 1) {
                        t.path = "/images/wareHouse/cabinet_doc.svg";

                        t.width = 100;
                        t.height = 100;
                        t.labels[0].x = 0;
                        t.labels[0].x = 102;
                        t.labels[1].x = 35;
                        t.labels[1].y = 0;
                        t.labels[2].y = 0.4;
                        t.labels[2].y = 102;
                        arrJson.push(t);
                    }
                    if (data.cabin == 2) {
                        t.path = "/images/wareHouse/cabinet_doc.svg";

                        t.width = 80;
                        t.height = 80;

                        t.labels[1].x = 27;
                        t.labels[1].y = -5;
                        arrJson.push(t);
                    }
                    if (data.cabin == 3) {
                        t.path = "/images/wareHouse/cabinet_doc.svg";

                        t.width = 50;
                        t.height = 50;
                        t.labels[1].x = 12;
                        t.labels[1].y = -7;
                        arrJson.push(t);
                    }
                    if (data.cabin == 4) {

                        t.width = 90;
                        t.height = 30;
                        t.path = "/images/wareHouse/covayxam.svg"

                        t.labels[1].x = -8;
                        t.labels[1].y = -10;
                        //
                        t.labels[0].cssClass = t.labels[0].cssClass + " " + "hide";
                        t.labels[1].cssClass = t.labels[1].cssClass + " " + "hide";
                        /* t.labels[2].cssClass = t.labels[2].cssClass + " " + "hide";*/
                        arrJson.push(t);


                    }
                }
            }

            if (t.type == "LINE") {
                if (data.showline == true) {
                    if (data.line == 1) {
                        t.vertex[1].x = t.vertex[0].x + 1000;
                        t.vertex[1].y = t.vertex[0].y;
                        t.stroke = 5;

                        arrJson.push(t);
                    }
                    if (data.line == 2) {
                        t.vertex[1].x = t.vertex[0].x + 600;
                        t.vertex[1].y = t.vertex[0].y;
                        t.stroke = 3;
                        arrJson.push(t);

                        /*if (t.vertex[1].y >= t.vertex[0].y) {
                            t.vertex[1].x = t.vertex[0].x +200;
                            t.vertex[1].y = t.vertex[0].y + 400;
                            arrJson.push(t);
                        }
                        if (t.vertex[1].y < t.vertex[0].y) {
                            t.vertex[1].x = t.vertex[0].x;
                            t.vertex[1].y = t.vertex[0].y - 400;
                            arrJson.push(t);
                        }*/


                    }
                    if (data.line == 3) {
                        t.vertex[1].x = t.vertex[0].x + 200;
                        t.vertex[1].y = t.vertex[0].y;
                        t.stroke = 2;
                        arrJson.push(t);

                        /* if (t.vertex[1].y >= t.vertex[0].y) {
                             t.vertex[1].x = t.vertex[0].x + 100;
                             t.vertex[1].y = t.vertex[0].y + 200;
                             t.stroke = 3;
                             arrJson.push(t);
                         }
                         if (t.vertex[1].y < t.vertex[0].y) {
                             t.vertex[1].x = t.vertex[0].x ;
                             t.vertex[1].y = t.vertex[0].y - 200;
                             t.stroke = 3;
 
                             arrJson.push(t);
                         }*/
                    }
                    if (data.line == 4) {
                        t.vertex[1].x = t.vertex[0].x + 30;
                        t.vertex[1].y = t.vertex[0].y;
                        t.stroke = 1;
                        arrJson.push(t);

                        /* if (t.vertex[1].y >= t.vertex[0].y) {
                             t.vertex[1].x = t.vertex[0].x + 30;
                             t.vertex[1].y = t.vertex[0].y + 30;
                             t.stroke = 1;
 
                             arrJson.push(t);
                         }
                         if (t.vertex[1].y < t.vertex[0].y) {
                             t.vertex[1].x = t.vertex[0].x;
                             t.stroke = 1;
 
                             t.vertex[1].y = t.vertex[0].y -30;
                             arrJson.push(t);
                         }*/
                    }
                }
            }

        }
        var reader = new Reader();
        reader.unmarshal(canvas, arrJson);
        displayJSON(canvas);
        $scope.update();
        $scope.setsize = false;

        $(".RACK").click(function () {
            var node = canvas.getPrimarySelection();
            node.children.data[0].figure.addCssClass('value');
            node.children.data[0].figure.removeCssClass('hide');
            node.children.data[1].figure.removeCssClass('hide');
            node.children.data[2].figure.removeCssClass('hide');
            node.children.data[3].figure.removeCssClass('hide');
            node.children.data[4].figure.removeCssClass('hide');
            node.children.data[5].figure.removeCssClass('hide');
            node.children.data[6].figure.removeCssClass('hide');
            node.children.data[7].figure.removeCssClass('hide');
        })
    }

    $scope.shapeData = [];
    $scope.listData = [];

    $scope.hidejson = function () {
        $(".json_div").toggleClass('jsonhide');
    }

    $scope.obj = {

    };

    var url_string = window.location.href;

    var url = new URL(url_string);
    $scope.isDraging = false;
    $scope.init_position = [];
    //$scope.isSelecting = false;
    $scope.init = function () {
        dataservice.getListWareHouse(function (rs) {
            rs = rs.data;
            $rootScope.listWareHouse = [{ Code: '', Name: caption.COM_TXT_ALL }];
            $rootScope.listWareHouse = $rootScope.listWareHouse.concat(rs);
        });

        $(".baolo").draggable();
        $(".menu-3").draggable();
        $scope.model.Mapping = url.searchParams.get("mapping");
        setTimeout(function () {
            $rootScope.drawObject();

            $scope.canvas.on('mouse:down', function (e) {
                if (e.button === 1) {
                    $scope.isDraging = true;
                    $scope.init_position[0] = e.pointer.x;
                    $scope.init_position[1] = e.pointer.y;
                }
                // if(e.button === 2) {
                //     console.log("middle click");
                // }
                if (e.button === 3) {
                }
            })

            $scope.canvas.on('mouse:up', function (e) {
                $scope.isDraging = false;
            })

            $scope.canvas.on('mouse:move', function (options) {
                if ($scope.isDraging
                    //&& !drawing
                    //&& !isMoving
                    //&& !isScaling
                    //&& !isRotating
                    && !options.target
                    //&& !$scope.isSelecting
                    //&& !isDrawLine
                ) {
                    const x = options.pointer.x - $scope.init_position[0];
                    const y = options.pointer.y - $scope.init_position[1];

                    hidePopupMenu();

                    let delta = new fabric.Point(x, y);
                    $scope.canvas.relativePan(delta);

                    $scope.init_position[0] = options.pointer.x;
                    $scope.init_position[1] = options.pointer.y;
                    // }
                }
            })
        }, 1000);
    };
    $scope.init();
    $scope.update = function () {
        $scope.canvas.on('object:added', displayJSON);
        $scope.canvas.on('object:removed', displayJSON);
        $scope.canvas.on('object:modified', displayJSON);
        //setTimeout(function () {
        //    $(".RACK").dblclick(function () {
        //        var node = canvas.getPrimarySelection();
        //        if (node !== null) {
        //            $scope.rackDetail(node.id);
        //        }
        //    });

        //    $(".CABINET").dblclick(function () {
        //        var node = canvas.getPrimarySelection();
        //        if (node !== null) {
        //            $scope.packDetail(node.id);
        //        }
        //    });

        //    $(".rotate").click(function (rs) {
        //        var node = canvas.getPrimarySelection();
        //        var x = node.getX();
        //        var y = node.getY();
        //        if (node.path === "/images/wareHouse/rack_ngang.svg") {
        //            canvas.remove(node);
        //            var name = node.children.data[2].figure.text;
        //            var light = new draw2d.shape.basic.Image({ path: "/images/wareHouse/linght.svg", width: 30, height: 12, x: 35, y: 7, bgColor: "lime", stroke: 0.1, color: "#000" });
        //            var figure3 = new draw2d.shape.basic.Rectangle({ width: 40, height: 300, x: -40, y: 0, bgColor: "#fff", stroke: 0.1, color: "#000" });
        //            figure3.addCssClass('value');

        //            if ((node.children.data[2].figure.text).length < 15) {
        //                var txt11 = new draw2d.shape.basic.Label({ text: "" + node.children.data[2].figure.text, height: 10, x: -43, angle: 90, y: 20, stroke: 0 });
        //                txt11.addCssClass("txt1");
        //            }
        //            if ((node.children.data[2].figure.text).length >= 15 && (node.children.data[2].figure.text).length < 25) {
        //                var txt11 = new draw2d.shape.basic.Label({ text: "" + node.children.data[2].figure.text, height: 10, x: -66, angle: 90, y: 47, stroke: 0 });
        //                txt11.addCssClass("txt1");
        //            }
        //            else {
        //                if ((node.children.data[2].figure.text).length > 25) {
        //                    var txt11 = new draw2d.shape.basic.Label({ text: "" + node.children.data[2].figure.text, height: 10, x: -90, angle: 90, y: 70, stroke: 0 });
        //                    txt11.addCssClass("txt1");
        //                }
        //            }
        //            if ((node.children.data[3].figure.text).length < 10) {
        //                var txt22 = new draw2d.shape.basic.Label({ text: "" + node.children.data[3].figure.text, height: 10, x: -30, y: 180, angle: 90, stroke: 0, });
        //                txt22.addCssClass("txt2");
        //            }
        //            if ((node.children.data[3].figure.text).length < 15 && (node.children.data[3].figure.text).length > 10) {
        //                var txt22 = new draw2d.shape.basic.Label({ text: "" + node.children.data[3].figure.text, height: 10, x: -47, angle: 90, y: 195, stroke: 0 });
        //                txt22.addCssClass("txt2");
        //            }
        //            if ((node.children.data[3].figure.text).length >= 15 && (node.children.data[3].figure.text).length < 25) {
        //                var txt22 = new draw2d.shape.basic.Label({ text: "" + node.children.data[3].figure.text, height: 10, x: -55, angle: 90, y: 200, stroke: 0 });
        //                txt22.addCssClass("txt2");
        //            }

        //            var txt33 = new draw2d.shape.basic.Label({ text: "" + node.children.data[4].figure.text, height: 10, angle: 90, x: -65, y: 27, stroke: 0 });

        //            txt33.addCssClass("txt3");

        //            var txt55 = new draw2d.shape.basic.Label({ text: "" + node.children.data[5].figure.text, height: 10, x: -70, angle: 90, y: 200, stroke: 0 });

        //            txt55.addCssClass("txt5");
        //            var rotate2 = new draw2d.shape.basic.Image({ path: "/images/wareHouse/rotate.png", width: 20, height: 20, y: 280, x: 80, visible: true });
        //            rotate2.addCssClass('rotate');
        //            var rack_doc = new Rack({ height: 300, width: 100, stroke: 1, x: 100, y: 100, visible: true });
        //            rack_doc.setMinWidth(100);
        //            rack_doc.setMinHeight(280);
        //            rack_doc.attr({
        //                path: "/images/wareHouse/rack_doc.svg"
        //            });
        //            rack_doc.setId(node.id);
        //            rack_doc.addCssClass("RACK");
        //            rack_doc.add(figure3, new draw2d.layout.locator.Locator());
        //            rack_doc.add(light, new draw2d.layout.locator.Locator());

        //            rack_doc.add(txt11, new draw2d.layout.locator.Locator());
        //            rack_doc.add(txt22, new draw2d.layout.locator.Locator());
        //            rack_doc.add(txt33, new draw2d.layout.locator.Locator());

        //            rack_doc.add(txt55, new draw2d.layout.locator.Locator());
        //            rack_doc.add(rotate2, new draw2d.layout.locator.Locator());
        //            canvas.add(rack_doc, x, y);

        //            rotate2.on('click', function () {
        //                var node2 = canvas.getPrimarySelection();
        //                canvas.remove(node2);
        //                node.x = node2.x;
        //                node.y = node2.y;
        //                canvas.add(node);

        //                $scope.update();
        //                displayJSON(canvas);
        //            });
        //            displayJSON(canvas);
        //        }
        //        if (node.path == "/images/wareHouse/rack_doc.svg") {
        //            canvas.remove(node);
        //            var figure4 = new draw2d.shape.basic.Image({ path: "/images/wareHouse/linght.svg", width: 30, height: 12, x: 135, y: 5, bgColor: "lime", stroke: 0.1, color: "#000" });

        //            var figure1 = new draw2d.shape.basic.Rectangle({ width: 300, height: 40, x: 0, y: 100, bgColor: "#fff", stroke: 0.1, color: "#000" });
        //            figure1.addCssClass('value');
        //            var txt1 = new draw2d.shape.basic.Label({ text: "" + node.children.data[2].figure.text, height: 10, x: 0, y: 100, stroke: 0 });
        //            txt1.addCssClass("txt1");
        //            var txt2 = new draw2d.shape.basic.Label({ text: "" + node.children.data[3].figure.text, height: 10, x: 150, y: 100, stroke: 0, color: "#fff" });
        //            txt2.addCssClass("txt2");
        //            var txt3 = new draw2d.shape.basic.Label({ text: "" + node.children.data[4].figure.text, height: 10, x: 0, y: 120, stroke: 0 });

        //            txt3.addCssClass("txt3");

        //            var txt5 = new draw2d.shape.basic.Label({ text: "" + node.children.data[5].figure.text, height: 10, x: 150, y: 120, stroke: 0 });

        //            txt5.addCssClass("txt5");
        //            var rotate = new draw2d.shape.basic.Image({ path: "/images/wareHouse/rotate.png", width: 20, height: 20, y: 80, x: 303, visible: true });
        //            rotate.addCssClass('rotate');
        //            var rack_ngang = new Rack({ height: 100, width: 300, stroke: 1, x: 100, angle: 89, y: 100, visible: true });

        //            canvas.add(rack_ngang, x, y);
        //            rack_ngang.setId(node.id);
        //            rack_ngang.setMinWidth(300);
        //            rack_ngang.setMinHeight(100);

        //            rack_ngang.attr({
        //                path: "/images/wareHouse/rack_ngang.svg"
        //            });
        //            rack_ngang.addCssClass("RACK");
        //            rack_ngang.add(figure1, new draw2d.layout.locator.Locator());
        //            rack_ngang.add(figure4, new draw2d.layout.locator.Locator());
        //            rack_ngang.add(txt1, new draw2d.layout.locator.Locator());
        //            rack_ngang.add(txt2, new draw2d.layout.locator.Locator());
        //            rack_ngang.add(txt3, new draw2d.layout.locator.Locator());
        //            rack_ngang.add(txt5, new draw2d.layout.locator.Locator());
        //            rack_ngang.add(txt5, new draw2d.layout.locator.Locator());
        //            rack_ngang.add(rotate, new draw2d.layout.locator.Locator());

        //            rotate.on('click', function () {
        //                var node2 = canvas.getPrimarySelection();
        //                canvas.remove(node2);
        //                node.x = node2.x;
        //                node.y = node2.y;
        //                canvas.add(node);
        //                $scope.update();
        //                displayJSON(canvas);
        //            });
        //            displayJSON(canvas);
        //        }
        //    });
        //}, 100);

    }
    $scope.Clear = function (rs) {
        $scope.model.WhsCode = "";
        $scope.listFloor = "";
        var canvas = $rootScope.canvas2;
        canvas.clear();
    }
    $scope.isLockObject = true;
    $scope.toggleLock = function () {
        $scope.isLockObject = !$scope.isLockObject;
        $rootScope.drawObject();
    }
    $scope.zoomout = function (rs) {
        //var canvas = $rootScope.canvas2;
        //canvas.setZoom(canvas.getZoom() * 1.1, true);
        $scope.canvas.setZoom($scope.canvas.getZoom() / 1.1);
    }
    $scope.zoomin = function (rs) {
        //var canvas = $rootScope.canvas2;
        //canvas.setZoom(canvas.getZoom() * 0.9, true);
        $scope.canvas.setZoom($scope.canvas.getZoom() * 1.1);
    }
    $scope.zoomInit = function () {
        $scope.canvas.setZoom(0.18);
        console.log('zoomInit');
    }
    $rootScope.maxFloorHeight = 500;
    $rootScope.reloadCategory = function (type) {
        switch (type) {
            case "AREA": {
                dataservice.getListWareHouse(function (rs) {
                    rs = rs.data;
                    $rootScope.listWareHouse = [{ Code: '', Name: caption.COM_TXT_ALL }];
                    $rootScope.listWareHouse = $rootScope.listWareHouse.concat(rs);
                });
                break;
            }
            case "FLOOR": {
                $rootScope.reloadFloor();
                break;
            }
            case "LINE": {
                $rootScope.reloadLine();
                break;
            }
            case "RACK": {
                $rootScope.reloadRack();
                break;
            }
            case "POSITION": {
                $rootScope.reloadPosition();
                break;
            }
        }
        $rootScope.drawObject();
    }
    $scope.changeWareHouse = function (item) {
        $rootScope.wareHouseID = item.Id;
        $rootScope.wareHouseCode = $scope.model.WhsCode;
        $scope.model.Mapping = "A_" + $scope.model.WhsCode;
        $rootScope.floorCode = '';
        $rootScope.lineCode = '';
        $rootScope.rackCode = '';
        $rootScope.positionCode = '';
        $scope.model.FloorCode = '';
        $scope.model.LineCode = '';
        $scope.model.RackCode = '';
        $scope.model.PositionCode = '';
        $rootScope.reloadFloor();
    };
    $rootScope.reloadFloor = function () {
        dataservice.getListFloorByWareHouseCode($rootScope.wareHouseCode, function (rs) {
            rs = rs.data;
            $scope.listFloor = [{ Code: '', Name: caption.COM_TXT_ALL }];
            $scope.listFloor = $scope.listFloor.concat(rs);
            //var div = "";
            //if (rs.length > 0) {
            //    var height = 2450 / rs.length <= $rootScope.maxFloorHeight ? 2450 / rs.length : $rootScope.maxFloorHeight;
            //    for (var i = 0; i < rs.length; i++) {
            //        div += '<div class ="' + rs[i].Code + '" style="text-align:center;width: 2000px;  border: 1px solid red; margin:10px ;height:' + height + 'px"><label style = "z-index: 2000;font-weight: 600;font-size:15px; margin-top: 50px; z-index: 999;">' + rs[i].Name + '</label></div>';
            //        $(".milestone").html(div);
            //    }
            //}
            //else {
            //    $(".milestone").html("");
            //}
        });
    };
    $scope.changeFloor = function (item) {
        $rootScope.floorID = item.Id;
        $rootScope.floorCode = $scope.model.FloorCode;
        $scope.model.Mapping = "A_" + $rootScope.wareHouseCode + "_F_" + $scope.model.FloorCode;
        $rootScope.lineCode = '';
        $rootScope.rackCode = '';
        $rootScope.positionCode = '';
        $scope.model.LineCode = '';
        $scope.model.RackCode = '';
        $scope.model.PositionCode = '';
        var div = "";
        div += '<div class ="' + item.Code + '" style="text-align:center;width: 2000px;  border: 1px solid red; margin:10px ;height:' + $rootScope.maxFloorHeight + 'px"><label style = "z-index: 2000;font-weight: 600;font-size:15px; margin-top: 50px; z-index: 999;">' + item.Name + '</label></div>';
        $(".milestone").html(div);
        $rootScope.reloadLine();
    };
    $rootScope.reloadLine = function () {
        dataservice.getListLineByFloorCode($rootScope.floorCode, function (rs) {
            rs = rs.data;
            $scope.listLine = [{ Code: '', Name: caption.COM_TXT_ALL }];
            $scope.listLine = $scope.listLine.concat(rs);
        });
    };
    $scope.changeLine = function (item) {
        $rootScope.lineID = item.Id;
        $rootScope.lineCode = $scope.model.LineCode;
        $scope.model.Mapping = "A_" + $rootScope.wareHouseCode + "_F_" + $rootScope.floorCode + "_L_" + $scope.model.LineCode;
        $rootScope.rackCode = '';
        $rootScope.positionCode = '';
        $scope.model.RackCode = '';
        $scope.model.PositionCode = '';
        $rootScope.reloadRack();
    };
    $rootScope.reloadRack = function () {
        dataservice.getListRackByLineCode($rootScope.lineCode, function (rs) {
            rs = rs.data;
            $scope.listRack = [{ Code: '', Name: caption.COM_TXT_ALL }];
            $scope.listRack = $scope.listRack.concat(rs);
        });
    };
    $scope.changeRack = function (item) {
        $rootScope.rackID = item.Id;
        $rootScope.rackCode = $scope.model.RackCode;
        $scope.model.Mapping = "A_" + $rootScope.wareHouseCode + "_F_" + $rootScope.floorCode + "_L_" + $rootScope.lineCode + "_R_" + $scope.model.RackCode;
        $rootScope.positionCode = '';
        $scope.model.PositionCode = '';
        $rootScope.reloadPosition();
    };
    $rootScope.reloadPosition = function () {
        dataservice.getListAreaByParentCode("POSITION", $rootScope.rackCode, function (rs) {
            rs = rs.data;
            $scope.listPosition = [{ Code: '', Name: caption.COM_TXT_ALL }];
            $scope.listPosition = $scope.listPosition.concat(rs);
        });
    };
    $scope.changePosition = function (item) {
        $rootScope.positionID = item.Id;
        $rootScope.positionCode = $scope.model.PositionCode;
        $scope.model.Mapping = "A_" + $rootScope.wareHouseCode + "_F_" + $rootScope.floorCode + "_L_" + $rootScope.lineCode + "_R_" + $rootScope.rackCode + "_P_" + $scope.model.RackCode;
    };

    var count = 0;
    $scope.chooseFloor = function (item) {
        count = 0;
        App.blockUI({
            target: "#contentMain",
            boxed: true,
            message: 'loading...'
        });
        $scope.setActive(item);

        var canvas = $rootScope.canvas2;
        canvas.setZoom(1, true);

        canvas.clear();
        canvas.getCommandStack().addEventListener(function (e) {
            if (e.isPostChangeEvent()) {
                displayJSON(canvas);
            }
        });
        var json_data = [];

        dataservice.getListChildByFloorCode(item.Code, function (res) {
            res = res.data;
            for (var i = 0; i < res.length; i++) {
                var type = res[i].ZoneType;
                var item = res[i];

                var dataObj = JSON.parse(res[i].ShapeData);
                if (dataObj != null && dataObj != undefined) {
                    if (dataObj.labels.length > 5)
                        dataObj.labels[5].text = "Số tài liệu : " + item.FileCount;
                    json_data.push(dataObj);
                } else {
                    $scope.initObject(type, item, false);
                }
            }

            var reader = new Reader();
            reader.unmarshal(canvas, json_data);
            $scope.update();
        });

        App.unblockUI("#contentMain");
    };

    $scope.initObject = function (type, item, search) {
        switch (type) {
            case 'AREA':
                return $scope.initArea(item);

            case 'FLOOR':
                return $scope.initFloor(item);

            case 'LINE':
                return $scope.initLine(item);

            case 'RACK':
                return $scope.initRack(item);

            case 'POSITION':
                return $scope.initPosition(item, search);
            default:
                return null;

            //case 'CABINET':
            //    $scope.initCabinet(item);
            //    break;
        }
    }
    $scope.strokeWidthArea = 25;
    $scope.strokeWidthFloor = 25;
    $scope.strokeWidthLine = 25;
    $scope.strokeWidthRack = 25;
    $scope.strokeWidthPosition = 12;

    $scope.initArea = function (item) {
        //var area = new Area({ x: 40, y: 10, stroke: 5 });
        //area.attr({
        //    color: "#FF0000",
        //    bgColor: "#FFFFFF",
        //    height: 2500,
        //    width: 2100
        //});
        //area.setId(item.Code);
        //canvas.add(area);
        //var name = new draw2d.shape.basic.Label({ text: item.Name + " - " + item.Mapping, height: 10, x: 5, y: 5, stroke: 0, fontSize: 20 });
        ////area.setWidth(150);
        //area.addCssClass("txt");
        //area.add(name, new draw2d.layout.locator.BottomLocator());
        //area.attr({ userData: item });
        return iconRect({ Width: 2100, Height: 2500, Stroke: '#000', StrokeWidth: $scope.strokeWidthArea, Text: item.Name, Map: item.Mapping, FontSize: 32, TextY: 0, Fill: 'rgba(0,0,0,0)', IsDashed: true, UserData: item });
    }
    $scope.initFloor = function (item) {
        //var floor = new Floor({ x: 40, y: 10, stroke: 3 });
        //floor.attr({
        //    color: "#FF0000",
        //    bgColor: "#FFFFFF",
        //    height: 800,
        //    width: 2000
        //});
        //floor.setId(item.Code);
        //canvas.add(floor);
        //var name = new draw2d.shape.basic.Label({ text: item.Name + " - " + item.Mapping, height: 10, x: 5, y: 5, stroke: 0, fontSize: 15 });
        //floor.setWidth(150);
        //floor.addCssClass("txt");
        //floor.add(name, new draw2d.layout.locator.BottomLocator());
        //floor.attr({ userData: item });
        return iconRect({ Width: 2000, Height: 800, Stroke: '#000', StrokeWidth: $scope.strokeWidthFloor, Text: item.Name, Map: item.Mapping, FontSize: 24, TextY: 0, Fill: 'rgba(0,0,0,0)', IsDashed: true, UserData: item });
    }
    $scope.initLine = function (item) {
        //var x = 50;
        //var line = new Line({});
        //line.attr({
        //    startX: 50,
        //    startY: 250 + x,
        //    endX: 1000,
        //    endY: 250 + x,
        //    stroke: 5,
        //    color: "grey"
        //});
        //line.setId(item.Code);
        //x = x + 200;
        //canvas.add(line);
        //var name = new draw2d.shape.basic.Label({ text: item.Name + " - " + item.Mapping, height: 10, x: 5, y: 5, stroke: 0 });
        //name.setWidth(150);
        //name.addCssClass("txt");
        //line.add(name, new draw2d.layout.locator.BottomLocator());
        //line.attr({ userData: item });
        return iconRect({ Width: 800, Height: 5, Stroke: '#183153', StrokeWidth: $scope.strokeWidthLine, Text: item.Name, Map: item.Mapping, FontSize: 18, TextY: 25, Fill: '#fff', IsDashed: false, UserData: item });
    }
    $scope.initRack = function (item) {
        return iconRect({ Width: 250, Height: 200, Stroke: 'green', StrokeWidth: $scope.strokeWidthRack, Text: item.Name, Map: item.Mapping, FontSize: 14, TextY: 0, Fill: '#fff', IsDashed: false, UserData: item });
    }
    $scope.initPosition = function (item) {
        return iconCircle({ Radius: 10, Text: item.Name, Map: item.Mapping, FontSize: 10, TextY: 15, UserData: item })
    }
    $scope.initCabinet = function () {

    }

    $scope.setActive = function (item) {
        for (var i = 0; i < $scope.listFloor.length; i++) {
            if ($scope.listFloor[i].Code === item.Code) {
                $scope.listFloor[i].Active = true;
            } else {
                $scope.listFloor[i].Active = false;
            }
        }
    }
    $scope.mapSearch = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderDiagram + '/mapSearch.html',
            controller: 'map-search',
            backdrop: 'static',
            size: '65'
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    };
    $scope.objectDetail = function () {
        var item = $scope.activeObject;
        dataservice.getZoneDetail(item.userData.Mapping, function (rs) {
            rs = rs.data;
            rs.object = item.userData;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: ctxfolderDiagram + '/viewRackDetail.html',
                controller: 'view-object-detail',
                backdrop: 'static',
                size: '40',
                resolve: {
                    para: function () {
                        return rs;
                    }
                }
            });
            modalInstance.result.then(function (d) {
                $scope.reload();
            }, function () {
            });
        });
    };
    $scope.deleteObject = function () {
        if (!isAllData) {
            return App.toastrError('Không có quyền xóa đối tượng');
        }
        var item = $scope.activeObject;
        dataservice.deleteMapping(item.userData.IdMapping, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess("Xóa thành công");
                $rootScope.drawObject();
                hidePopupMenu();
            }
            console.log(rs);
        });
    };
    $scope.rackDetail = function (rackCode) {
        //dataservice.getZoneDetail(rackCode, function (rs) {
        //    rs = rs.data;

        //    var modalInstance = $uibModal.open({
        //        animation: true,
        //        templateUrl: ctxfolderDiagram + '/viewRackDetail.html',
        //        controller: 'view-rack-detail',
        //        backdrop: 'static',
        //        size: '40',
        //        resolve: {
        //            para: function () {
        //                return rs;
        //            }
        //        }
        //    });
        //    modalInstance.result.then(function (d) {
        //        $scope.reload();
        //    }, function () {
        //    });
        //});
    };
    $scope.packDetail = function (packCode) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderDiagram + '/viewPackDetail.html',
            controller: 'view-pack-detail',
            backdrop: 'static',
            size: '50',
            resolve: {
                para: function () {
                    return packCode;
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    };

    $scope.saveShapeData = function () {
        $scope.listData = [];
        for (var i = 0; i < $scope.canvas._objects.length; i++) {
            var obj = {
                Type: $scope.canvas._objects[i].userData.Type,
                ShapeData: JSON.stringify($scope.canvas._objects[i]),
                ObjectCode: $scope.canvas._objects[i].userData.Mapping
            };

            $scope.listData.push(obj);
        }

        if ($scope.listData.length === 0) {
            return App.toastrError(caption.EDMSDWC_MSG_NO_DATA);
        }
        //var listPromise = [];
        //for (var i = 0; i < $scope.listData.length; i++) {
        //    listPromise.push($http.post('/Admin/EDMSDiagramWarehouseDocument/UpdateMappingShape', $scope.listData[i]));
        //}
        //$q.all(listPromise).then(result => {
        //    console.log(result);
        //});
        App.blockUI({
            target: "#contentMain",
            boxed: true,
            message: 'loading...'
        });
        dataservice.saveMappingShape($scope.listData, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
            }
            App.unblockUI("#contentMain");
        });
    };

    $scope.activeObject;
    $scope.delayMenu = false;
    // canvas handle function
    // Vẽ hình chữ nhật
    function iconRect(item) {
        var rect = new fabric.Rect({
            width: item.Width,
            height: item.Height,
            stroke: item.Stroke,
            strokeWidth: item.StrokeWidth,
            fill: item.Fill,
            originX: 'center',
            originY: 'center',
            rx: 0,
            ry: 0
        });
        rect.on('scaling', function () {
            console.log('scaling');
            this.set({
                width: this.width * this.scaleX,
                height: this.height * this.scaleY,
                scaleX: 1,
                scaleY: 1
            })
        })
        if (item.IsDashed) {
            rect.set({ strokeDashArray: [5, 5] });
        }
        console.log(rect);

        return createTextBox(rect, item);
    }
    //Fabric cho đối tượng hình học (Geometric)
    function iconCircle(item) {
        //Vẽ hình tròn
        var circle = new fabric.Circle({
            radius: item.Radius,
            stroke: '#000',
            strokeWidth: $scope.strokeWidthPosition,
            fill: '#fff',
            originX: 'center',
            originY: 'center'
        });

        return createTextBox(circle, item);
    }

    function createTextBox(obj, item) {
        var textbox = new fabric.Text(item.Text, {
            fontSize: item.FontSize,
            fontFamily: 'Time New Roman',
            originX: 'center',
            originY: 'center',
            left: obj.left,
            top: obj.top,
            width: obj.width,
            fill: '#333',
            textAlign: 'center',
            fontWidth: 600
        });

        if (item.TextY) {
            textbox.originY = 'bottom';
            textbox.top = -item.TextY;
        }

        let group = new fabric.Group([obj, textbox], {
            top: 100,
            left: 100,
            name: obj.type,
            subTargetCheck: false,
            fontSize: item.FontSize,
            fontFamily: 'Time New Roman',
            textAlign: 'center',
            fontWeight: 'normal',
            fontStyle: 'normal',
            underline: false
        });

        setDefaultAttributes(group, item.UserData);
        startActiveObject(group);
        console.log(group);
        return group;
    }
    function setDefaultAttributes(obj, userData) {
        obj.set({
            // isChoosePort: false,
            // port: [],

            groupID: null,

            colorBorder: '#000',
            widthBorder: 1,
            curve: 0,
            hasShadow: false,
            shadow: null,
            shadowObj: new fabric.Shadow({
                blur: 30,
                color: '#999',
                offsetX: 0,
                offsetY: 0
            }),
            fixed: false,
            position: 'front',

            isMoving: false,
            isRepeat: false,
            isDrawingPath: false,
            speedMoving: 1,
            pathObj: null,
            soundMoving: '',
            nameSoundMoving: '',

            blink: false,
            lineStyle: 'solid',

            select: false,
            status: false,
            colorText: '#000',
            colorTextSelected: '#000',
            colorSelected: '#ccc',
            colorUnselected: '#fff',
            isFullText: false,

            userData: userData
        });
    }

    //function getTextForObject(obj, item) {
    //    // startActiveTextbox(obj);
    //    $scope.canvas.add(obj);
    //}

    // call this function to create attributes and event for object
    function startActiveObject(obj) {
        if (obj.blink) blink(obj);

        obj.on('mouseup', function (e) {
            if (e.button === 3 && $scope.delayMenu == false) {
                showPopUpMenu(obj);
                $scope.delayMenu = true;
                setTimeout(function() {
                    $scope.delayMenu = false;
                }, 500);
            }
        });
        console.log(obj.userData);
        if (obj.userData.Type == "AREA") {
            obj._objects[0].strokeWidth = $scope.strokeWidthArea;
        }
        if (obj.userData.Type == "FLOOR") {
            obj._objects[0].strokeWidth = $scope.strokeWidthFloor;
        }
        if (obj.userData.Type == "LINE") {
            obj._objects[0].strokeWidth = $scope.strokeWidthLine;
        }
        if (obj.userData.Type == "RACK") {
            obj._objects[0].strokeWidth = $scope.strokeWidthRack;
        }
        if (obj.userData.Type == "POSITION") {
            obj._objects[0].strokeWidth = $scope.strokeWidthPosition;
        }
    }

    // blink object animation
    function blink(obj) {
        if (obj.blink && obj.opacity == 1) {
            obj.animate('opacity', '0.3', {
                duration: 300,
                onChange: $scope.canvas.renderAll.bind($scope.canvas),
                onComplete: function () {
                    blink(obj);
                }
            });
        } else {
            obj.animate('opacity', '1', {
                duration: 300,
                onChange: $scope.canvas.renderAll.bind($scope.canvas),
                onComplete: function () {
                    blink(obj);
                }
            });
        }
    }

    function showPopUpMenu(obj) {
        const editForm = $('#menu-object')[0];

        console.log('show popup menu');

        if (editForm.style.visibility === 'hidden' || $scope.activeObject !== obj) {
            $scope.activeObject = obj;
            $scope.fontSize = obj.fontSize;
            $scope.fontColor = obj.colorText;
            $scope.isObjectFront = obj.pos == 'front';
            $scope.isTextFull = obj.isFullText == true;
            $scope.isObjectBlink = obj.blink == true;
            setTimeout(function () { $scope.$apply() });
            const zoom = $scope.canvas.getZoom();
            let top = (obj.top) * zoom + $scope.canvas.getTop() + 20;
            let left = (obj.left + (obj.width / 2) * obj.scaleX) * zoom + $scope.canvas.getLeft();

            if (obj.lineType == 'waving') {
                top = Math.cos(obj.angle) * (obj.top) * zoom + $scope.canvas.viewportTransform[5] + 20;
                left = Math.cos(obj.angle) * (obj.left + (obj.width / 2) * obj.scaleX) * zoom + $scope.canvas.viewportTransform[4];
            }

            if (top < 0) top = 20
            if (left < -50) left = -50
            if (left > 2500) left = 2500


            $('#menu-object').css({ 'visibility': 'visible', 'top': top + 'px', 'left': left + 'px' });
        } else {
            hidePopupMenu();
        }
    }
    function hidePopupMenu() {
        $('#menu-object').css({ 'visibility': 'hidden' });
    }

    function randomID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
    function loadCanvasJsonNew(listObjects) {
        console.log(listObjects);
        fabric.util.enlivenObjects(listObjects.filter(x => x.isFromDb), function (enlivenedObjects) {
            console.log(enlivenedObjects);
            for (var i = 0; i < listObjects.length; i++) {
                var obj = listObjects[i];
                if (obj.isFromDb) {
                    var obj = enlivenedObjects.find(x => x.userData.Mapping == obj.userData.Mapping);
                }
                if (obj.isFromDb == true) {
                    if (obj.name == 'lineConnect') {
                        var line = new fabric.Path('M 65 0 Q 100 100 200 0', {
                            //  M 65 0 L 73 6 M 65 0 L 62 6 z 
                            fill: '',
                            stroke: '#000',
                            objectCaching: false,
                            originX: 'center',
                            originY: 'center',
                            name: 'lineConnect',
                            idObject1: obj.idObject1,
                            idObject2: obj.idObject2,
                            port1: obj.port1,
                            port2: obj.port2,
                            objectID: obj.objectID
                        });

                        line.selectable = false;
                        line.path = obj.path;

                        $scope.canvas.add(line);
                    } else if (obj.type === 'group') {
                        if (obj.name != 'custom-group') {
                            if (obj.name == 'line-style' && obj.lineType == 'curve') {
                                obj._objects.forEach(obj => obj._setPath(obj.path));
                            }
                            if (obj._objects.length > 0) {
                                obj._objects.forEach(child => {
                                    if (child.id == 'answer-correct-textbox') {
                                        correctAnswerBox = child;
                                        if (quizType == 'quiz-3') {
                                            console.log(correctAnswerBox);
                                            correctAnswerBox.text = correctAnswerMatch.map(item => item).join(', ');
                                        }
                                        const title = new fabric.Text('User Answer', {
                                            top: 0,
                                            left: 30,
                                            fontSize: 16,
                                            fontFamily: 'Times New Roman',
                                        });

                                        userAnswerBox = new fabric.Textbox('', {
                                            left: 0,
                                            top: 40,
                                            width: 200,
                                            fontSize: 10,
                                            fontFamily: 'Times New Roman',
                                            id: 'answer-correct-textbox'
                                        });

                                        const group = new fabric.Group([title, userAnswerBox], {
                                            top: 150,
                                            left: 50,
                                            selectable: false
                                        })

                                        $scope.canvas.add(group);
                                        isCreateDoquiz = true;
                                    }
                                });
                            }

                            if (obj.name == 'grid') {
                                obj.set({
                                    evented: false,
                                    selectable: false,
                                    renderOnAddRemove: false,
                                    objectCaching: false,
                                })
                            }
                            obj.isFullText = false;
                            startActiveObject(obj);
                        }
                        else {
                            makeChildSelectable(obj);
                        }
                        if ($scope.isLockObject) {
                            obj.set({
                                "selectable": false,
                                lockMovementX: false,
                                lockMovementY: false,
                            });
                        }
                        if (obj._objects?.length > 0) {
                            obj.forEachObject(o => {
                                if (o.type === 'text') {
                                    o.set({
                                        text: obj.userData.Name
                                    })
                                }
                            })
                        }
                        obj.set({
                            isFullText: false
                        });
                        $scope.canvas.add(obj);
                    } else if (obj.type === 'image') {
                        fabric.Image.fromURL(obj.src, function (img) {
                            console.log(obj);
                            img.set({
                                top: obj.top,
                                left: obj.left,
                                width: obj.width,
                                height: obj.height,
                                scaleX: obj.scaleX,
                                scaleY: obj.scaleY,
                                isBackground: obj.isBackground,
                            })
                            if (quizType == 'quiz-3') {
                                img.set({
                                    name: obj.name,
                                    id: obj.id,
                                    port1: obj.port1,
                                    port2: obj.port2,
                                    idObject1: obj.idObject1,
                                    idObject2: obj.idObject2,
                                    objectID: obj.objectID,
                                    port: obj.port,
                                    lineID: obj.lineID,
                                    hasShadow: obj.hasShadow,
                                    shadowObj: obj.shadowObj,
                                    pos: obj.pos,
                                    snap: obj.snap,
                                    readySound: obj.readySound,
                                    sound: obj.sound,
                                    line2: obj.line2,
                                    isDrop: obj.isDrop,
                                    isDrag: obj.isDrag,
                                    isBackground: obj.isBackground,
                                    answerId: obj.answerId,
                                })
                            }
                            startActiveObject(img);

                            if ($scope.isLockObject) {
                                img.set({
                                    "selectable": false,
                                    lockMovementX: false,
                                    lockMovementY: false,
                                });
                            }
                            $scope.canvas.add(img);
                            repositionBackground();
                        });
                    } else if (obj.name == 'line-style') {
                        if (obj.type == 'wavy-line-with-arrow') {
                            console.log(obj);
                            obj._objects = [];
                            obj.objects = [];
                            obj.updateInternalPointsData();
                        }

                        startActiveObject(obj);
                        $scope.canvas.add(obj);
                    } else {
                        obj.hasBorders = obj.hasControls = false;

                        if (obj.name === 'curve-point') {
                            obj.on('moving', function () {
                                const line = $scope.canvas.getObjects().find(item =>
                                    item.type === 'path' &&
                                    item.objectID === obj.lineID
                                );

                                if (line) {
                                    line.path[1][1] = obj.left;
                                    line.path[1][2] = obj.top;
                                }
                            })
                        } else if (obj.type === 'path') {
                            obj._setPath(obj.path);
                            obj.selectable = false;

                            if (obj.name == 'svg') {
                                startActiveObject(obj);
                            }
                        }
                        $scope.canvas.add(obj);
                    }
                }
                else {
                    console.log(obj);
                    $scope.canvas.add(obj);
                }
            }
            //enlivenedObjects.forEach(function (obj) {

            //});
        });
    };

    $scope.listSize = [4, 8, 10, 12, 14, 18, 24, 32, 48, 64];
    $scope.fontSize = '';
    $scope.fontColor = '#000000';
    $scope.isObjectFront = false;
    $scope.isTextFull = false;
    $scope.isObjectBlink = false;

    $scope.changeFrontBack = function () {
        if ($scope.activeObject.pos === 'back') {
            $scope.activeObject.set({
                pos: 'front'
            })
            $scope.canvas.bringToFront($scope.activeObject);
            $scope.canvas.requestRenderAll();
        }
        else {
            $scope.activeObject.set({
                pos: 'back'
            })
            $scope.canvas.sendToBack($scope.activeObject);
            $scope.canvas.requestRenderAll();
        }
    }

    $scope.changeFontSize = function (font_size) {
        $scope.activeObject.set({
            fontSize: font_size
        })
        if ($scope.activeObject._objects?.length > 0) {
            if ($scope.activeObject.name === 'latex') {
                $scope.activeObject.item(0).set({
                    scaleX: (font_size + 16) / 12,
                    scaleY: (font_size + 16) / 12,
                })
                // activeObject.item(1).set({
                //     fontSize: font_size
                // })

                $scope.activeObject.addWithUpdate()
            }
            else {
                $scope.activeObject._objects.forEach(obj => {
                    if (obj.type == 'text') {
                        obj.set({
                            fontSize: font_size
                        })
                    }
                })
            }
        }
        if ($scope.activeObject.type === 'text') {
            $scope.activeObject.set({
                width: (font_size + 10) * 4
            })
        }

        console.log('font size', $scope.activeObject);
        $scope.canvas.requestRenderAll();
    }
    $scope.changeFontColor = function (value) {
        if ($scope.activeObject._objects?.length > 0) {
            $scope.activeObject.forEachObject(o => {
                if (o.type === 'text') {
                    o.set({
                        fill: value
                    })
                }
            })
        }
        $scope.activeObject.set({
            colorText: value,
            fill: value,
        });
        $scope.canvas.requestRenderAll();
    }
    $scope.changeTextFull = function () {
        //var userData = $scope.activeObject.userData;
        for (var item of $scope.canvas._objects) {
            var userData = item.userData;
            if (item.isFullText == false) {
                if (item._objects?.length > 0) {
                    item.forEachObject(o => {
                        if (o.type === 'text') {
                            o.set({
                                text: userData.Mapping
                            })
                        }
                    })
                }
                item.set({
                    isFullText: true
                });
            }
            else {
                if (item._objects?.length > 0) {
                    item.forEachObject(o => {
                        if (o.type === 'text') {
                            o.set({
                                text: userData.Name
                            })
                        }
                    })
                }
                item.set({
                    isFullText: false
                });
            }
        }
        $scope.canvas.requestRenderAll();
    }
    $scope.changeObjectBlink = function () {
        $scope.activeObject.blink = !$scope.activeObject.blink;
        if ($scope.activeObject.blink) {
            blink($scope.activeObject);
        }
        $scope.isObjectBlink = $scope.activeObject.blink;
    }
    $scope.group = function () {
        if (!$scope.canvas.getActiveObject()) {
            return;
        }
        if ($scope.canvas.getActiveObject().type !== 'activeSelection') {
            return;
        }
        const group = $scope.canvas.getActiveObject().toGroup()
        const objID = randomID();
        group.set({
            subTargetCheck: false,
            name: 'custom-group',
            objectID: objID,
        })

        group._objects.forEach(o => {
            o.groupID = objID
        })

        $scope.canvas.requestRenderAll();
    }
    $scope.ungroup = function () {
        if (!$scope.canvas.getActiveObject()) {
            return;
        }
        if ($scope.canvas.getActiveObject().type !== 'group') {
            return;
        }
        const group = $scope.canvas.getActiveObject()

        group.forEachObject((i) => {
            group.removeWithUpdate(i);
            $scope.canvas.add(i);
        });
        $scope.canvas.remove(group)

        $scope.canvas.requestRenderAll();
    }
    $rootScope.drawObject = function () {
        //if (!$rootScope.wareHouseCode || !$rootScope.floorCode) {
        //    return App.toastrError("Phải chọn một kho và một tầng");
        //}
        //canvas.getCommandStack().addEventListener(function (e) {
        //    if (e.isPostChangeEvent()) {
        //        displayJSON(canvas);
        //    }
        //});

        //if ($rootScope.floorCode != "" && $rootScope.floorCode != null) {

        //}
        var position = "";
        position += $rootScope.wareHouseCode ? 'A_' + $rootScope.wareHouseCode : "";
        position += $rootScope.floorCode ? '_F_' + $rootScope.floorCode : "";
        position += $rootScope.lineCode ? '_L_' + $rootScope.lineCode : "";
        position += $rootScope.rackCode ? '_R_' + $rootScope.rackCode : "";
        position += $rootScope.positionCode ? '_P_' + $rootScope.positionCode : "";
        dataservice.getListMapping(position, function (res) {
            $scope.canvas.clear();

            var json_data = [];
            res = res.data;
            for (var i = 0; i < res.length; i++) {
                var type = res[i].Type;
                var item = res[i];
                var code = res[i].Code;
                var dataObj = JSON.parse(res[i].ShapeData);
                if (dataObj != null && dataObj != undefined) {
                    //if ($rootScope.positionCode == res[i].Code && res[i].Type == "POSITION") {
                    //    json_data.push(dataObj);
                    //}
                    //else if (res[i].Type != "POSITION") {
                    //    json_data.push(dataObj);
                    //}
                    //if (code === rackCode) {
                    //    if (dataObj.labels.length > 5)
                    //        dataObj.labels[5].text = "Số tài liệu : " + item.FileCount;

                    //    dataObj.labels[1].path = "/images/wareHouse/linghtgif.svg";
                    //    var labelPosition = JSON.parse(JSON.stringify(dataObj.labels[2]));
                    //    labelPosition.text = "Vị trí :  " + positionPack;
                    //    labelPosition.x = 100;
                    //    labelPosition.y = -15;
                    //    dataObj.labels.push(labelPosition);
                    //}
                    console.log(res[i].ShapeData);
                    var data = JSON.parse(res[i].ShapeData);
                    data.userData = res[i];
                    if (res[i].Mapping == $scope.model.Mapping) {
                        data.blink = true;
                    }
                    data.isFromDb = true;
                    json_data.push(data);
                } else {
                    var data = $scope.initObject(type, item, true);
                    if (res[i].Mapping == $scope.model.Mapping) {
                        data.blink = true;
                    }
                    data.isFromDb = false;
                    json_data.push(data);
                }
            }

            //var reader = new Reader();
            //reader.unmarshal(canvas, json_data);
            $scope.update();
            loadCanvasJsonNew(json_data);
            displayJSON();
            $scope.canvas.renderAll();
            $scope.zoomInit();
        });
    }
    $rootScope.searchObjectNew = function (position, categoryCode) {
        if (!$rootScope.wareHouseCode || !$rootScope.floorCode) {
            return App.toastrError("Phải chọn một kho và một tầng");
        }
        canvas.getCommandStack().addEventListener(function (e) {
            if (e.isPostChangeEvent()) {
                displayJSON(canvas);
            }
        });

        if ($rootScope.floorCode != "" && $rootScope.floorCode != null) {
            dataservice.getListMapping(position, function (res) {
                canvas.clear();

                var json_data = [];
                res = res.data;
                for (var i = 0; i < res.length; i++) {
                    var type = res[i].Type;
                    var item = res[i];
                    var code = res[i].Code;
                    var dataObj = JSON.parse(res[i].ShapeData);
                    if (dataObj != null && dataObj != undefined) {
                        if (code === categoryCode) {
                            if (dataObj.labels.length > 5)
                                dataObj.labels[5].text = "Số tài liệu : " + item.FileCount;

                            dataObj.labels[1].path = "/images/wareHouse/linghtgif.svg";
                            var labelPosition = JSON.parse(JSON.stringify(dataObj.labels[2]));
                            labelPosition.text = "Vị trí :  " + positionPack;
                            labelPosition.x = 100;
                            labelPosition.y = -15;
                            dataObj.labels.push(labelPosition);
                        }
                        json_data.push(dataObj);
                    } else {
                        $scope.initObject(type, item, true);
                    }
                }

                var reader = new Reader();
                reader.unmarshal(canvas, json_data);
                $scope.update();
            });
        }
    }
    $rootScope.searchObject = function (WhsCode, FloorCode, LineCode, rackCode, cabinetCode, positionPack) {
        App.blockUI({
            target: "#contentMain",
            boxed: true,
            message: 'loading...'
        });
        $('#contentMain ').scrollTop(0);
        $('#contentMain ').scrollLeft(0);
        var canvas = $rootScope.canvas2;
        canvas.getCommandStack().addEventListener(function (e) {
            if (e.isPostChangeEvent()) {
                displayJSON(canvas);
            }
        });
        $scope.model.WhsCode = "";
        if ($scope.model.WhsCode == '') {
            if (count < 1) {
                canvas.setZoom(canvas.getZoom() * 0.8, true);
            }

            $scope.model.WhsCode = WhsCode;
            dataservice.getListFloorByWareHouseCode(WhsCode, function (rs) {
                rs = rs.data;
                $scope.listFloor = rs;
                for (var i = 0; i < $scope.listFloor.length; i++) {
                    if ($scope.listFloor[i].Code === FloorCode) {
                        $scope.listFloor[i].Active = true;
                    } else {
                        $scope.listFloor[i].Active = false;
                    }
                }
            });

            var json_data = [];
            canvas.clear();
            dataservice.getListChildByFloorCode(FloorCode, function (res) {
                res = res.data;
                for (var i = 0; i < res.length; i++) {
                    var type = res[i].ZoneType;
                    var item = res[i];
                    var code = res[i].ZoneCode;
                    var dataObj = JSON.parse(res[i].ShapeData);
                    if (dataObj != null && dataObj != undefined) {
                        if (code === rackCode) {
                            if (dataObj.labels.length > 5)
                                dataObj.labels[5].text = "Số tài liệu : " + item.FileCount;

                            dataObj.labels[1].path = "/images/wareHouse/linghtgif.svg";
                            var labelPosition = JSON.parse(JSON.stringify(dataObj.labels[2]));
                            labelPosition.text = "Vị trí :  " + positionPack;
                            labelPosition.x = 100;
                            labelPosition.y = -15;
                            dataObj.labels.push(labelPosition);
                        }
                        json_data.push(dataObj);
                    } else {
                        $scope.initObject(type, item, true);
                    }
                }

                var reader = new Reader();
                reader.unmarshal(canvas, json_data);
                $scope.update();
            });
        }
        else {
            if ($scope.model.WhsCode != WhsCode) {
                if (count < 1) {
                    canvas.setZoom(canvas.getZoom() * 0.8, true);
                }

                $scope.model.WhsCode = WhsCode;
                dataservice.getListFloorByWareHouseCode(WhsCode, function (rs) {
                    rs = rs.data;
                    $scope.listFloor = rs;

                    for (var i = 0; i < $scope.listFloor.length; i++) {
                        if ($scope.listFloor[i].Code === FloorCode) {
                            $scope.listFloor[i].Active = true;
                        } else {
                            $scope.listFloor[i].Active = false;
                        }
                    }
                });
                canvas.clear();

                var json_data = [];
                dataservice.getListChildByFloorCode(FloorCode, function (res) {
                    res = res.data;
                    for (var i = 0; i < res.length; i++) {
                        var type = res[i].ZoneType;
                        var item = res[i];

                        var dataObj = JSON.parse(res[i].ShapeData);
                        if (dataObj != null && dataObj != undefined) {
                            json_data.push(dataObj);
                        } else {
                            $scope.initObject(type, item, true);
                        }
                    }

                    var reader = new Reader();
                    reader.unmarshal(canvas, json_data);
                    $scope.update();
                });
            }
            else {
                if (rackCode !== undefined && rackCode != null && rackCode !== '') {
                    if (count < 1) {
                        canvas.setZoom(canvas.getZoom() * 0.8, true);
                    }

                    var node = $rootScope.canvas2.getFigure(rackCode);
                    if (node != null) {
                        $('#contentMain ').scrollTop(node.y);
                        $('#contentMain ').scrollLeft(node.x);
                        node.children.data[1].figure.attr({
                            "path": "/images/wareHouse/linghtgif.svg"
                        });
                    }
                    var full = $rootScope.canvas2.getFigures();
                    if (full != null) {
                        for (var i = 0; i < full.data.length; i++) {
                            if (full.data[i].id != rackCode) {
                                full.data[i].children.data[1].figure.attr({
                                    "path": "/images/wareHouse/linght.svg"
                                });
                            }
                        }
                    }
                }

                if (cabinetCode !== undefined && cabinetCode !== null && cabinetCode !== '') {
                    var node2 = $rootScope.canvas2.getFigure(cabinetCode);
                    node2.children.data[1].figure.attr({
                        "path": "/images/wareHouse/linghtgif.svg"
                    });
                    $('#contentMain ').scrollTop(node2.y);
                    $('#contentMain ').scrollLeft(node2.x);
                    var full = $rootScope.canvas2.getFigures();
                    for (var i = 0; i < full.data.length; i++) {
                        if (full.data[i].id != rackCode && full.data[i].id != cabinetCode) {
                            full.data[i].children.data[1].figure.attr({
                                "path": "/images/wareHouse/linght.svg"
                            });
                        }
                    }
                }
            }
        }

        App.unblockUI("#contentMain");
        displayJSON(canvas);
        count++;
    };
    function displayJSON() {
        //var writer = new draw2d.io.json.Writer();
        //writer.marshal(canvas, function (json) {

        //});
        var json = $scope.canvas._objects;
        $("#json").text(JSON.stringify(json, null, 2));
        $scope.shapeData = json;
        $rootScope.shapeData = json;
    }
    // manager

    $scope.addArea = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderDiagram + '/addCategory.html',
            controller: 'addCategory',
            keyboard: true,
            backdrop: false,
            //backdrop: 'static',
            size: '35',
            resolve: {
                para: function () {
                    return {
                        Parent: "",
                        Title: caption.EDMSWM_CURD_TITLE_ADD_AREA,
                        Type: "AREA",
                        ParentType: "AREA",
                        LockParent: false
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {

        }, function () {
        });
    };

    $scope.editArea = function () {
        var id = $rootScope.wareHouseID;
        if (id != null) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: ctxfolderDiagram + '/editCategory.html',
                controller: 'editCategory',
                keyboard: true,
                backdrop: false,
                //backdrop: 'static',
                size: '35',
                resolve: {
                    para: function () {
                        return {
                            Parent: "",
                            Title: caption.EDMSWM_CURD_TITLE_EDIT_AREA,
                            Type: "AREA",
                            ParentType: "AREA",
                            LockParent: false,
                            Id: $rootScope.wareHouseID
                        };
                    }
                }
            });
            modalInstance.result.then(function (d) {

            }, function () {
            });
        } else {
            App.toastrError(caption.EDMSWM_VALIDATE_CHOOSE_CATEGORY_EDIT);
        }
    };

    $scope.deleteArea = function () {
        if (!isAllData) {
            return App.toastrError('Không có quyền xóa đối tượng');
        }
        var id = $rootScope.wareHouseID;
        if (id != null) {
            var modalInstance = $uibModal.open({
                templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
                windowClass: "message-center",
                controller: function ($scope, $uibModalInstance) {
                    $scope.message = caption.EDMSW_MSG_CLEAR_CATEGORY;
                    $scope.ok = function () {
                        dataservice.deleteCategory(id, function (result) {
                            result = result.data;
                            if (result.Error) {
                                App.toastrError(result.Title);
                            } else {
                                App.toastrSuccess(result.Title);
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
                //$rootScope.reloadFloor();
                $rootScope.reloadCategory('AREA');
                $rootScope.wareHouseCode = '';
                $rootScope.floorCode = '';
                $rootScope.lineCode = '';
                $rootScope.rackCode = '';
                $rootScope.positionCode = '';
                $scope.model.WhsCode = '';
                $scope.model.FloorCode = '';
                $scope.model.LineCode = '';
                $scope.model.RackCode = '';
                $scope.model.PositionCode = '';
            }, function () {
            });
        } else {
            App.toastrError(caption.EDMSWM_VALIDATE_CHOOSE_CATEGORY_EDIT);
        }
    };

    $scope.addFloor = function () {
        var floor = $scope.listFloor.find(x => x.Code == $rootScope.floorCode);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderDiagram + '/addCategory.html',
            controller: 'addCategory',
            keyboard: true,
            backdrop: false,
            //backdrop: 'static',
            size: '35',
            resolve: {
                para: function () {
                    return {
                        Code: $rootScope.floorCode ? $rootScope.floorCode : "",
                        Name: floor ? floor.Name : "",
                        Parent: $rootScope.wareHouseCode,
                        Title: caption.EDMSWM_CURD_TITLE_ADD_FLOOR,
                        Type: "FLOOR",
                        ParentType: "AREA",
                        LockParent: true
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {

        }, function () {
        });
    };

    $scope.editFloor = function () {
        var id = $rootScope.floorID;
        if (id != null) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: ctxfolderDiagram + '/editCategory.html',
                controller: 'editCategory',
                keyboard: true,
                backdrop: false,
                //backdrop: 'static',
                size: '35',
                resolve: {
                    para: function () {
                        return {
                            Parent: $rootScope.wareHouseCode,
                            Title: caption.EDMSWM_TITLE_EDIT_FLOOR,
                            Type: "FLOOR",
                            ParentType: "AREA",
                            LockParent: true,
                            Id: $rootScope.floorID
                        };
                    }
                }
            });
            modalInstance.result.then(function (d) {

            }, function () {
            });
        } else {
            App.toastrError(caption.EDMSWM_VALIDATE_CHOOSE_CATEGORY_EDIT);
        }
    };

    $scope.deleteFloor = function () {
        if (!isAllData) {
            return App.toastrError('Không có quyền xóa đối tượng');
        }
        var floorId = $rootScope.floorID;
        if (floorId != null) {
            var modalInstance = $uibModal.open({
                templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
                windowClass: "message-center",
                controller: function ($scope, $uibModalInstance) {
                    $scope.message = caption.EDMSW_MSG_CLEAR_CATEGORY;
                    $scope.ok = function () {
                        dataservice.deleteCategory(floorId, function (result) {
                            result = result.data;
                            if (result.Error) {
                                App.toastrError(result.Title);
                            } else {
                                App.toastrSuccess(result.Title);
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
                $rootScope.reloadFloor();
                $rootScope.floorCode = '';
                $rootScope.lineCode = '';
                $rootScope.rackCode = '';
                $rootScope.positionCode = '';
                $scope.model.FloorCode = '';
                $scope.model.LineCode = '';
                $scope.model.RackCode = '';
                $scope.model.PositionCode = '';
            }, function () {
            });
        } else {
            App.toastrError(caption.EDMSWM_VALIDATE_CHOOSE_CATEGORY_EDIT);
        }
    };

    $scope.addLine = function () {
        var line = $scope.listLine.find(x => x.Code == $rootScope.lineCode);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderDiagram + '/addCategory.html',
            controller: 'addCategory',
            keyboard: true,
            backdrop: false,
            //backdrop: 'static',
            size: '35',
            resolve: {
                para: function () {
                    return {
                        Code: $rootScope.lineCode ? $rootScope.lineCode : "",
                        Name: line ? line.Name : "",
                        Parent: $rootScope.floorCode,
                        Title: caption.EDMSWM_CURD_TITLE_ADD_LINE,
                        Type: "LINE",
                        ParentType: "FLOOR",
                        LockParent: true
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {

        }, function () {
        });
    }

    $scope.editLine = function () {
        var id = $rootScope.lineID;
        if (id != null) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: ctxfolderDiagram + '/editCategory.html',
                controller: 'editCategory',
                keyboard: true,
                backdrop: false,
                //backdrop: 'static',
                size: '35',
                resolve: {
                    para: function () {
                        return {
                            Parent: $rootScope.floorCode,
                            Title: caption.EDMSWM_TITLE_EDIT_LINE,
                            Type: "LINE",
                            ParentType: "FLOOR",
                            LockParent: true,
                            Id: $rootScope.lineID
                        };
                    }
                }
            });
            modalInstance.result.then(function (d) {

            }, function () {
            });
        } else {
            App.toastrError(caption.EDMSWM_VALIDATE_CHOOSE_CATEGORY_EDIT);
        }
    }

    $scope.deleteLine = function () {
        if (!isAllData) {
            return App.toastrError('Không có quyền xóa đối tượng');
        }
        var lineId = $rootScope.lineID;
        if (lineId != null) {
            var modalInstance = $uibModal.open({
                templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
                windowClass: "message-center",
                controller: function ($scope, $uibModalInstance) {
                    $scope.message = caption.EDMSWH_MSG_DEL_RANGE;
                    $scope.ok = function () {
                        dataservice.deleteCategory(lineId, function (result) {
                            result = result.data;
                            if (result.Error) {
                                App.toastrError(result.Title);
                            } else {
                                App.toastrSuccess(result.Title);
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
                $rootScope.reloadLine();
                $rootScope.lineCode = '';
                $rootScope.rackCode = '';
                $rootScope.positionCode = '';
                $scope.model.LineCode = '';
                $scope.model.RackCode = '';
                $scope.model.PositionCode = '';
            }, function () {
            });
        } else {
            App.toastrError(caption.EDMSWM_VALIDATE_CHOOSE_LINE_DELETE);
        }
    };

    $scope.addRack = function () {
        var rack = $scope.listRack.find(x => x.Code == $rootScope.rackCode);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderDiagram + '/addCategory.html',
            controller: 'addCategory',
            keyboard: true,
            backdrop: false,
            //backdrop: 'static',
            size: '35',
            resolve: {
                para: function () {
                    return {
                        Code: $rootScope.rackCode ? $rootScope.rackCode : "",
                        Name: rack ? rack.Name : "",
                        Parent: $rootScope.lineCode,
                        Title: caption.EDMSWM_CURD_TITLE_ADD_RACK,
                        Type: "RACK",
                        ParentType: "LINE",
                        LockParent: true
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {

        }, function () {
        });
    };

    $scope.editRack = function () {
        var rackId = $rootScope.rackID;
        if (rackId != null) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: ctxfolder + '/editRack.html',
                controller: 'editRack',
                backdrop: 'static',
                size: '50',
                resolve: {
                    para: function () {
                        return $rootScope.rackID;
                    }
                }
            });
            modalInstance.result.then(function (d) {
                $scope.reloadNoResetPage();
            }, function () {
            });
        } else {
            App.toastrError(caption.EDMSWM_VALIDATE_CHOOSE_RACK_EDIT);
        }
    };

    $scope.deleteRack = function () {
        if (!isAllData) {
            return App.toastrError('Không có quyền xóa đối tượng');
        }
        var rackId = $rootScope.rackID;
        if (rackId != null) {
            var modalInstance = $uibModal.open({
                templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
                windowClass: "message-center",
                controller: function ($scope, $uibModalInstance) {
                    $scope.message = caption.EDMSWH_MSG_DEL_SHELF;
                    $scope.ok = function () {
                        dataservice.deleteCategory(rackId, function (result) {
                            result = result.data;
                            if (result.Error) {
                                App.toastrError(result.Title);
                            } else {
                                App.toastrSuccess(result.Title);
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
                $rootScope.reloadRack();
                $rootScope.rackCode = '';
                $rootScope.positionCode = '';
                $scope.model.RackCode = '';
                $scope.model.PositionCode = '';
            }, function () {
            });
        } else {
            App.toastrError(caption.EDMSWM_VALIDATE_CHOOSE_RACK_DELETE);
        }
    };

    $scope.addPosition = function () {
        var position = $scope.listPosition.find(x => x.Code == $rootScope.positionCode);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderDiagram + '/addCategory.html',
            controller: 'addCategory',
            keyboard: true,
            backdrop: false,
            //backdrop: 'static',
            size: '35',
            resolve: {
                para: function () {
                    return {
                        Code: $rootScope.positionCode ? $rootScope.positionCode : "",
                        Name: position ? position.Name : "",
                        Parent: $rootScope.rackCode,
                        Title: caption.EDMSWM_CURD_TITLE_ADD_POSITION,
                        Type: "POSITION",
                        ParentType: "RACK",
                        LockParent: true
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {

        }, function () {
        });
    };

    $scope.editPosition = function () {
        var id = $rootScope.positionID;
        if (id != null) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: ctxfolder + '/editRack.html',
                controller: 'editRack',
                backdrop: 'static',
                size: '35',
                resolve: {
                    para: function () {
                        return $rootScope.rackID;
                    }
                }
            });
            modalInstance.result.then(function (d) {
                $scope.reloadNoResetPage();
            }, function () {
            });
        } else {
            App.toastrError(caption.EDMSWM_VALIDATE_CHOOSE_RACK_EDIT);
        }
    };

    $scope.deletePosition = function () {
        if (!isAllData) {
            return App.toastrError('Không có quyền xóa đối tượng');
        }
        var id = $rootScope.positionID;
        if (id != null) {
            var modalInstance = $uibModal.open({
                templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
                windowClass: "message-center",
                controller: function ($scope, $uibModalInstance) {
                    $scope.message = /*caption.EDMSWH_MSG_DEL_SHELF*/'Bạn có chắc chắn xóa vị trí';
                    $scope.ok = function () {
                        dataservice.deleteCategory(id, function (result) {
                            result = result.data;
                            if (result.Error) {
                                App.toastrError(result.Title);
                            } else {
                                App.toastrSuccess(result.Title);
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
                $rootScope.reloadPosition();
                $rootScope.positionCode = '';
                $scope.model.PositionCode = '';
            }, function () {
            });
        } else {
            App.toastrError(/*caption.EDMSWM_VALIDATE_CHOOSE_RACK_DELETE*/'');
        }
    };

    $scope.addBox = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/addBox.html',
            controller: 'addBox',
            backdrop: 'static',
            size: '65'
        });
        modalInstance.result.then(function (d) {

        }, function () {
        });
    }

    $scope.edit = function (id) {
        var model = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id + "") {
                model = listdata[i];
                break;
            }
        }
        $rootScope.wareHouseID = id;
        $rootScope.wareHouseCode = model.WHS_Code;
        $rootScope.floorCode = '';
        $rootScope.lineCode = '';
        //$rootScope.showListFloor = true;
        //$rootScope.showListLine = false;
        //$rootScope.showListRack = false;
        if ($rootScope.floorReload)
            $rootScope.reloadFloor();
    }
});
app.controller('map-search', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataservice, $translate) {
    var vm = $scope;
    $scope.isEdit = false;

    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;

    $scope.model = {
        Content: '',
        ObjectType: '',
        ObjectCode: '',
        WhsCode: '',
        FromDate: '',
        ToDate: '',
        Status: '',
        UserUpload: ''
    };

    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/EDMSDiagramWarehouseDocument/JTableFile",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.Content = $scope.model.Content;
                d.ObjectType = $scope.model.ObjectType;
                d.ObjectCode = $scope.model.ObjectCode;
                d.WhsCode = $scope.model.WhsCode;
                d.FromDate = $scope.model.FromDate;
                d.ToDate = $scope.model.ToDate;
                d.Status = $scope.model.Status;
                d.UserUpload = $scope.model.UserUpload;
            },
            complete: function () {
                App.unblockUI("#contentMain");
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(10)
        .withOption('order', [1, 'desc'])
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
            $(row).find('td:not(:has(label.mt-checkbox))').on('dblclick', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {

                } else {

                }
            });
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle('').notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full._STT] = false;
        }).withOption('sWidth', '30px').withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileName').withOption('sClass', '').withTitle($translate('EDMSDWC_TITLE_FILE_NAME')).renderWith(function (data, type, full) {
        var excel = ['.XLSM', '.XLSX', '.XLS'];
        var document = ['.TXT'];
        var word = ['.DOCX', '.DOC'];
        var pdf = ['.PDF'];
        var powerPoint = ['.PPS', '.PPTX', '.PPT'];
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        var icon = "";
        if (excel.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(106,170,89);font-size: 15px;" class="fa fa-file-excel-o pr5" aria-hidden="true"></i>';
        } else if (word.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o pr5" aria-hidden="true"></i>';
        } else if (document.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(0,0,0);font-size: 15px;" class="fa fa-file-text-o pr5" aria-hidden="true"></i>';
        } else if (pdf.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-pdf-o pr5" aria-hidden="true"></i>';
        } else if (powerPoint.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-powerpoint-o pr5" aria-hidden="true"></i>';
        } else if (image.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(42,42,42);font-size: 15px;" class="fa fa-picture-o pr5" aria-hidden="true"></i>';
        } else {
            icon = '<i style="color: rgb(42,42,42);font-size: 15px;" class="fas fa-align-justify pr5" aria-hidden="true"></i>';
        }
        var download = "/ &nbsp;<a ng-click='download(" + full.Id + ")'> _" + data + "</a>\n";
        var position = '\n<span class="text-green">' + full.Position + full.PositionPack + '</span>';
        var updateTime = '';
        var fileSize = 0;
        if (full.SizeOfFile != null) {
            var kb = 1024;
            var mb = 1024 * kb;
            var gb = 1024 * mb;
            var dt = full.SizeOfFile / gb;
            if (full.SizeOfFile / gb > 1) {
                fileSize = Math.floor(full.SizeOfFile / gb) + " GB";
            }
            else if (full.SizeOfFile / mb > 1) {
                fileSize = Math.floor(full.SizeOfFile / mb) + " MB";
            }
            else if (full.SizeOfFile / kb > 1) {
                fileSize = Math.floor(full.SizeOfFile / kb) + " KB";
            }
            else {
                fileSize = full.SizeOfFile + " Byte";
            }

            fileSize = '<div><span class="badge-customer badge-customer-success">' + fileSize + '</span></div>';
        }

        if (full.UpdateTime != "" && full.UpdateTime != null && full.UpdateTime != undefined) {
            updateTime = '<div><span class="badge-customer badge-customer-black">' + full.UpdateTime + '</span></div>'
        }
        if (excel.indexOf(full.FileTypePhysic.toUpperCase()) != -1 || word.indexOf(full.FileTypePhysic.toUpperCase()) != -1
            || pdf.indexOf(full.FileTypePhysic.toUpperCase()) != -1 || powerPoint.indexOf(full.FileTypePhysic.toUpperCase()) != -1) {
            if (excel.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
                typefile = 'excel';
                var file = '<a ng-click="viewExcel(' + full.Id + ', 1' + ')" >' + data + '</a>';
                if (full.Content != undefined) {
                    if ($scope.isContent)
                        file = file + download;
                    var content = "<div>" + full.Content + "</div>";
                    return icon + file + content + updateTime + fileSize + position;
                } else {
                    return icon + '<a ng-click="viewExcel(' + full.Id + ', 1' + ')" >' + data + '</a>' + updateTime + fileSize + position;
                }
            } else if (word.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
                typefile = 'Syncfusion';
                var file = '<a ng-click="viewWord(' + full.Id + ', 1' + ')" >' + data + '</a>';
                if (full.Content != undefined) {
                    if ($scope.isContent)
                        file = file + download;
                    var content = "<div>" + full.Content + "</div>";
                    return icon + file + content + updateTime + fileSize + position;
                } else {
                    return icon + '<a ng-click="viewWord(' + full.Id + ', 1' + ')" >' + data + '</a>' + updateTime + fileSize + position;
                }
            } else if (pdf.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
                typefile = 'pdf';
                var file = '<a ng-click="viewPDF(' + full.Id + ', 1' + ')">' + data + '</a>';
                if (full.Content != undefined) {
                    if ($scope.isContent)
                        file = file + download;
                    var content = "<div>" + full.Content + "</div>";
                    return icon + file + content + updateTime;
                } else {
                    return icon + '<a ng-click="viewPDF(' + full.Id + ', 1' + ')">' + data + '</a>' + updateTime + fileSize + position;
                }
            } else {
                return icon + '<a ng-click="getObjectFile(0)">' + data + '</a>' + updateTime + fileSize + position;
            }
            if (full.Content != undefined) {
                var file = icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>\n";
                if ($scope.isContent)
                    file = file + download;
                var content = "<div>" + full.Content + "</div>";

                return icon + file + content + updateTime + fileSize + position;
            } else {
                return icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>" + updateTime + fileSize + position;
            }
        }
        else if (document.indexOf(full.FileTypePhysic.toUpperCase()) != -1) {
            if (full.Content != undefined) {
                var file = icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>\n";
                var content = "<div>" + full.Content + "</div>";
                return file + content + updateTime + fileSize + position;
            } else {
                return icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>" + updateTime + fileSize + position;
            }
        }
        else if (image.indexOf(full.FileTypePhysic.toUpperCase()) != -1) {
            if (full.Content != undefined) {
                var file = icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>\n";
                var content = "<div>" + full.Content + "</div>";
                return file + content + updateTime + fileSize + position;
            } else {
                return icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>" + updateTime + fileSize + position;
            }
        }
        else {
            return data + updateTime + fileSize + position;
        }
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ReposName').withOption('sClass', '').withTitle($translate('EDMSDWC_TITLE_SERVER')).renderWith(function (data, type, full) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CatName').withOption('sClass', '').withTitle($translate('EDMSDWC_TITLE_PATH')).renderWith(function (data, type, full) {
        var currentPath = "";
        if (full.CloudFileId != null && full.CloudFileId != "") {
            currentPath = full.CatName;
        }
        else {
            currentPath = full.CatName;
        }
        return currentPath;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedTime').withOption('sClass', 'dataTable-w80').withTitle($translate('EDMSDWC_TITLE_DATE_CREATED')).renderWith(function (data, type, full) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('').notSortable().withOption('sClass', 'nowrap dataTable-w80 text-center').withTitle($translate('EDMSDWC_TITLE_PLACEMENT')).renderWith(function (data, type, full) {
        if (full.IsLocated === 'True') {
            return '<a ng-click="gotoDiagram(' + full.FileID + ')" target="_blank" style="width: 25px; height: 25px; padding: 0px" title="{{&quot; EDMSDWC_TITLE_UPDATE &quot; | translate}} - ' + full.FileName + '" class="btn btn-icon-only btn-circle btn-outline blue "><i class="fa fa-sitemap pt5"></i></a>';
        }
    }));
    vm.reloadData = reloadData;
    vm.dtInstance = {};

    function reloadData(resetPaging) {
        vm.dtInstance.reloadData(callback, resetPaging);
    }
    function callback(json) {

    }
    function toggleAll(selectAll, selectedItems) {

    }
    function toggleOne(selectedItems, evt) {
        $(evt.target).closest('tr').toggleClass('selected');
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

    $scope.reload = function () {
        reloadData(true);
    };

    $scope.search = function () {
        reloadData(true);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.gotoDiagram = function (fileID) {
        dataservice.getPositionByFileID(fileID, function (rs) {
            rs = rs.data;
            $scope.position = rs;
            $rootScope.searchObjectNew($scope.position.ObjectCode, $scope.position.CategoryCode);
            //$rootScope.searchObject($scope.position.WhsCode, $scope.position.FloorCode, $scope.position.LineCode, $scope.position.RackCode, $scope.position.CabinetCode, $scope.position.PositionPack);
            $uibModalInstance.dismiss('cancel');
        });
    };

    $scope.init = function () {
        dataservice.getObjectsType(function (rs) {
            rs = rs.data;
            $scope.objects = rs;
        });
        dataservice.getListUser(function (rs) {
            rs = rs.data;
            $rootScope.listUser = rs;
        });
    };
    $scope.init();

    $scope.selectObjectType = function (objectType) {
        dataservice.getListObject(objectType, function (rs) {
            rs = rs.data;
            $scope.listObjects = rs;
        });
    };

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
            $('#FromTo').datepicker('setEndDate', null);
        });
        $('.start-date').click(function () {
            $('#DateTo').datepicker('setStartDate', null);
        });
    }

    setTimeout(function () {
        loadDate();
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('view-rack-detail', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataservice, para, $translate) {
    var vm = $scope;
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;

    $scope.QR_Code = '';

    $scope.model = para;
    $scope.rack = para.Zone;

    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/ZoneManager/JtableAttributeEx",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.ZoneType = para.Zone.ZoneType;
                d.ZoneGroup = para.Zone.ZoneGroup;
            },
            complete: function () {
                App.unblockUI("#contentMain");
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(10)
        .withOption('order', [1, 'desc'])
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
            $(row).find('td:not(:has(label.mt-checkbox))').on('dblclick', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {

                } else {

                }
            });
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle('')
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full.Id] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.Id + ']" ng-click="toggleOne(selected)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', ' hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ZoneAttrCode').withTitle('Mã thuộc tính & tên thuộc tính').renderWith(function (data, type, full) {
        return data + ' - ' + full.ZoneAttrName;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ZoneAttrValue').withTitle('Giá trị(Đơn vị)').renderWith(function (data, type, full) {
        return data + ' (' + full.ZoneAttrUnitName + ')';
    }));
    vm.reloadData = reloadData;
    vm.dtInstance = {};

    function reloadData(resetPaging) {
        vm.dtInstance.reloadData(callback, resetPaging);
    }
    function callback(json) {

    }
    function toggleAll(selectAll, selectedItems) {

    }
    function toggleOne(selectedItems, evt) {
        $(evt.target).closest('tr').toggleClass('selected');
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

    $scope.reload = function () {
        reloadData(true);
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        dataservice.generatorQRCode($scope.rack.ZoneCode, function (rs) {
            rs = rs.data;
            $scope.QR_Code = rs;
        });
    };

    $scope.init();

    $scope.print = function (qrCode) {
        if (qrCode !== '') {
            var image = '<img src="data:image/png;base64,' + qrCode + '" width="125" height="125" /> ';
            var mainWindow = window.open('', '');
            mainWindow.document.write('<html><head><title></title>');
            mainWindow.document.write('<style type="text/css" media="print">@page {size: auto; margin: 0mm;}' +
                '.col-md-2{width: 16.66667%;float: left;} .textQr{font-family:verdana, arial, sans-serif;font-size:6px;word-break:break-all;}</style >');
            mainWindow.document.write('</head><body onload="window.print();window.close()">');
            mainWindow.document.write(image);
            mainWindow.document.write('</body></html>');
            mainWindow.document.close();
        } else {
            App.toastrError(caption.EDMSWM_MSG_ERR_PRINT);
        }
    };

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});
app.controller('view-pack-detail', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataservice, para) {
    var vm = $scope;
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;

    $scope.QR_Code = '';

    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/EDMSDiagramWarehouseDocument/JTableFile",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.PackCode = para;
            },
            complete: function () {
                App.unblockUI("#contentMain");
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(10)
        .withOption('order', [1, 'desc'])
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
            $(row).find('td:not(:has(label.mt-checkbox))').on('dblclick', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {

                } else {

                }
            });
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle('').notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full._STT] = false;
        }).withOption('sWidth', '30px').withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileName').withOption('sClass', '').withTitle('{{"EDMSDWC_TITLE_FILE_NAME" | translate}}').renderWith(function (data, type, full) {
        var excel = ['.XLSM', '.XLSX', '.XLS'];
        var document = ['.TXT'];
        var word = ['.DOCX', '.DOC'];
        var pdf = ['.PDF'];
        var powerPoint = ['.PPS', '.PPTX', '.PPT'];
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        var icon = "";
        if (excel.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(106,170,89);font-size: 15px;" class="fa fa-file-excel-o pr5" aria-hidden="true"></i>';
        } else if (word.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o pr5" aria-hidden="true"></i>';
        } else if (document.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(0,0,0);font-size: 15px;" class="fa fa-file-text-o pr5" aria-hidden="true"></i>';
        } else if (pdf.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-pdf-o pr5" aria-hidden="true"></i>';
        } else if (powerPoint.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-powerpoint-o pr5" aria-hidden="true"></i>';
        } else if (image.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(42,42,42);font-size: 15px;" class="fa fa-picture-o pr5" aria-hidden="true"></i>';
        } else {
            icon = '<i style="color: rgb(42,42,42);font-size: 15px;" class="fas fa-align-justify pr5" aria-hidden="true"></i>';
        }
        var download = "/ &nbsp;<a ng-click='download(" + full.Id + ")'> _" + data + "</a>\n";
        var position = '\n<span class="text-green">' + full.Position + '</span>';
        var updateTime = '';
        var fileSize = 0;
        if (full.SizeOfFile != null) {
            //fileSize = (full.SizeOfFile / 1024000).toFixed(0);
            var kb = 1024;
            var mb = 1024 * kb;
            var gb = 1024 * mb;
            var dt = full.SizeOfFile / gb;
            if (full.SizeOfFile / gb > 1) {
                fileSize = Math.floor(full.SizeOfFile / gb) + " GB";
            }
            else if (full.SizeOfFile / mb > 1) {
                fileSize = Math.floor(full.SizeOfFile / mb) + " MB";
            }
            else if (full.SizeOfFile / kb > 1) {
                fileSize = Math.floor(full.SizeOfFile / kb) + " KB";
            }
            else {
                fileSize = full.SizeOfFile + " Byte";
            }

            fileSize = '<div><span class="badge-customer badge-customer-success">' + fileSize + '</span></div>';
        }

        if (full.UpdateTime != "" && full.UpdateTime != null && full.UpdateTime != undefined) {
            updateTime = '<div><span class="badge-customer badge-customer-black">' + full.UpdateTime + '</span></div>'
        }
        if (excel.indexOf(full.FileTypePhysic.toUpperCase()) != -1 || word.indexOf(full.FileTypePhysic.toUpperCase()) != -1
            || pdf.indexOf(full.FileTypePhysic.toUpperCase()) != -1 || powerPoint.indexOf(full.FileTypePhysic.toUpperCase()) != -1) {
            if (excel.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
                typefile = 'excel';
                var file = '<a ng-click="viewExcel(' + full.Id + ', 1' + ')" >' + data + '</a>';
                if (full.Content != undefined) {
                    if ($scope.isContent)
                        file = file + download;
                    var content = "<div>" + full.Content + "</div>";
                    return icon + file + content + updateTime + fileSize + position;
                } else {
                    return icon + '<a ng-click="viewExcel(' + full.Id + ', 1' + ')" >' + data + '</a>' + updateTime + fileSize + position;
                }
            } else if (word.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
                typefile = 'Syncfusion';
                var file = '<a ng-click="viewWord(' + full.Id + ', 1' + ')" >' + data + '</a>';
                if (full.Content != undefined) {
                    if ($scope.isContent)
                        file = file + download;
                    var content = "<div>" + full.Content + "</div>";
                    return icon + file + content + updateTime + fileSize + position;
                } else {
                    return icon + '<a ng-click="viewWord(' + full.Id + ', 1' + ')" >' + data + '</a>' + updateTime + fileSize + position;
                }
            } else if (pdf.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
                typefile = 'pdf';
                var file = '<a ng-click="viewPDF(' + full.Id + ', 1' + ')">' + data + '</a>';
                if (full.Content != undefined) {
                    if ($scope.isContent)
                        file = file + download;
                    var content = "<div>" + full.Content + "</div>";
                    return icon + file + content + updateTime;
                } else {
                    return icon + '<a ng-click="viewPDF(' + full.Id + ', 1' + ')">' + data + '</a>' + updateTime + fileSize + position;
                }
            } else {
                return icon + '<a ng-click="getObjectFile(0)">' + data + '</a>' + updateTime + fileSize + position;
            }
            if (full.Content != undefined) {
                var file = icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>\n";
                if ($scope.isContent)
                    file = file + download;
                var content = "<div>" + full.Content + "</div>";

                return icon + file + content + updateTime + fileSize + position;
            } else {
                return icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>" + updateTime + fileSize + position;
            }
        }
        else if (document.indexOf(full.FileTypePhysic.toUpperCase()) != -1) {
            if (full.Content != undefined) {
                var file = icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>\n";
                var content = "<div>" + full.Content + "</div>";
                return file + content + updateTime + fileSize + position;
            } else {
                return icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>" + updateTime + fileSize + position;
            }
        }
        else if (image.indexOf(full.FileTypePhysic.toUpperCase()) != -1) {
            if (full.Content != undefined) {
                var file = icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>\n";
                var content = "<div>" + full.Content + "</div>";
                return file + content + updateTime + fileSize + position;
            } else {
                return icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>" + updateTime + fileSize + position;
            }
        }
        else {
            return data + updateTime + fileSize + position;
        }
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ReposName').withOption('sClass', '').withTitle('{{"EDMSDWC_TITLE_SERVER" | translate}}').renderWith(function (data, type, full) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CatName').withOption('sClass', '').withTitle('{{"EDMSDWC_TITLE_PATH" | translate}}').renderWith(function (data, type, full) {
        var currentPath = "";
        if (full.CloudFileId != null && full.CloudFileId != "") {
            currentPath = full.CatName;
        }
        else {
            currentPath = full.CatName;
        }
        return currentPath;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedTime').withOption('sClass', 'dataTable-w80').withTitle('{{"EDMSDWC_TITLE_DATE_CREATED" | translate}}').renderWith(function (data, type, full) {
        return data;
    }));

    vm.reloadData = reloadData;
    vm.dtInstance = {};

    function reloadData(resetPaging) {
        vm.dtInstance.reloadData(callback, resetPaging);
    }
    function callback(json) {

    }
    function toggleAll(selectAll, selectedItems) {

    }
    function toggleOne(selectedItems, evt) {
        $(evt.target).closest('tr').toggleClass('selected');
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

    $scope.reload = function () {
        reloadData(true);
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        dataservice.generatorQRCode(para, function (rs) {
            rs = rs.data;
            $scope.QR_Code = rs;
        });

        dataservice.getPackDetail(para, function (rs) {
            rs = rs.data;
            $scope.pack = rs;
        });
    };

    $scope.init();

    $scope.print = function (qrCode) {
        if (qrCode !== '') {
            var image = '<img src="data:image/png;base64,' + qrCode + '" width="125" height="125" /> ';
            var mainWindow = window.open('', '');
            mainWindow.document.write('<html><head><title></title>');
            mainWindow.document.write('<style type="text/css" media="print">@page {size: auto; margin: 0mm;}' +
                '.col-md-2{width: 16.66667%;float: left;} .textQr{font-family:verdana, arial, sans-serif;font-size:6px;word-break:break-all;}</style >');
            mainWindow.document.write('</head><body onload="window.print();window.close()">');
            mainWindow.document.write(image);
            mainWindow.document.write('</body></html>');
            mainWindow.document.close();
        } else {
            App.toastrError(caption.EDMSWM_MSG_ERR_PRINT);
        }
    };

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('view-object-detail', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataservice, para, $translate) {
    var vm = $scope;
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;

    $scope.QR_Code = '';

    $scope.model = para;
    $scope.object = para.object;

    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/EDMSDiagramWarehouseDocument/JTableFileNew",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.MappingCode = $scope.object.Mapping;
            },
            complete: function () {
                App.unblockUI("#contentMain");
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(10)
        .withOption('order', [1, 'desc'])
        .withOption('serverSide', true)
        .withOption('headerCallback', function (header) {
            if (!$scope.headerCompiled) {
                $scope.headerCompiled = true;
                $compile(angular.element(header).contents())($scope);
            }
            setTimeout(function () { $scope.$apply() });
        })
        .withOption('initComplete', function (settings, json) {
        })
        .withOption('createdRow', function (row, data, dataIndex) {
            const contextScope = $scope.$new(true);
            contextScope.data = data;
            contextScope.contextMenu = $scope.contextMenu;
            $compile(angular.element(row).contents())($scope);
            $(row).find('td:not(:has(label.mt-checkbox))').on('dblclick', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {

                } else {

                }
            });
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle('').notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full._STT] = false;
        }).withOption('sWidth', '30px').withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileName').withOption('sClass', '').withTitle('{{"EDMSDWC_TITLE_FILE_NAME" | translate}}').renderWith(function (data, type, full) {
        var excel = ['.XLSM', '.XLSX', '.XLS'];
        var document = ['.TXT'];
        var word = ['.DOCX', '.DOC'];
        var pdf = ['.PDF'];
        var powerPoint = ['.PPS', '.PPTX', '.PPT'];
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        var icon = "";
        if (excel.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(106,170,89);font-size: 15px;" class="fa fa-file-excel-o pr5" aria-hidden="true"></i>';
        } else if (word.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o pr5" aria-hidden="true"></i>';
        } else if (document.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(0,0,0);font-size: 15px;" class="fa fa-file-text-o pr5" aria-hidden="true"></i>';
        } else if (pdf.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-pdf-o pr5" aria-hidden="true"></i>';
        } else if (powerPoint.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-powerpoint-o pr5" aria-hidden="true"></i>';
        } else if (image.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(42,42,42);font-size: 15px;" class="fa fa-picture-o pr5" aria-hidden="true"></i>';
        } else {
            icon = '<i style="color: rgb(42,42,42);font-size: 15px;" class="fas fa-align-justify pr5" aria-hidden="true"></i>';
        }
        var download = "/ &nbsp;<a ng-click='download(" + full.Id + ")'> _" + data + "</a>\n";
        var position = '\n<span class="text-green">' + full.Position + '</span>';
        var updateTime = '';
        var fileSize = 0;
        if (full.SizeOfFile != null) {
            //fileSize = (full.SizeOfFile / 1024000).toFixed(0);
            var kb = 1024;
            var mb = 1024 * kb;
            var gb = 1024 * mb;
            var dt = full.SizeOfFile / gb;
            if (full.SizeOfFile / gb > 1) {
                fileSize = Math.floor(full.SizeOfFile / gb) + " GB";
            }
            else if (full.SizeOfFile / mb > 1) {
                fileSize = Math.floor(full.SizeOfFile / mb) + " MB";
            }
            else if (full.SizeOfFile / kb > 1) {
                fileSize = Math.floor(full.SizeOfFile / kb) + " KB";
            }
            else {
                fileSize = full.SizeOfFile + " Byte";
            }

            fileSize = '<div><span class="badge-customer badge-customer-success">' + fileSize + '</span></div>';
        }

        if (full.UpdateTime != "" && full.UpdateTime != null && full.UpdateTime != undefined) {
            updateTime = '<div><span class="badge-customer badge-customer-black">' + full.UpdateTime + '</span></div>'
        }
        if (excel.indexOf(full.FileTypePhysic.toUpperCase()) != -1 || word.indexOf(full.FileTypePhysic.toUpperCase()) != -1
            || pdf.indexOf(full.FileTypePhysic.toUpperCase()) != -1 || powerPoint.indexOf(full.FileTypePhysic.toUpperCase()) != -1) {
            if (excel.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
                typefile = 'excel';
                var file = '<a ng-click="viewExcel(' + full.Id + ', 1' + ')" >' + data + '</a>';
                if (full.Content != undefined) {
                    if ($scope.isContent)
                        file = file + download;
                    var content = "<div>" + full.Content + "</div>";
                    return icon + file + content + updateTime + fileSize + position;
                } else {
                    return icon + '<a ng-click="viewExcel(' + full.Id + ', 1' + ')" >' + data + '</a>' + updateTime + fileSize + position;
                }
            } else if (word.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
                typefile = 'Syncfusion';
                var file = '<a ng-click="viewWord(' + full.Id + ', 1' + ')" >' + data + '</a>';
                if (full.Content != undefined) {
                    if ($scope.isContent)
                        file = file + download;
                    var content = "<div>" + full.Content + "</div>";
                    return icon + file + content + updateTime + fileSize + position;
                } else {
                    return icon + '<a ng-click="viewWord(' + full.Id + ', 1' + ')" >' + data + '</a>' + updateTime + fileSize + position;
                }
            } else if (pdf.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
                typefile = 'pdf';
                var file = '<a ng-click="viewPDF(' + full.Id + ', 1' + ')">' + data + '</a>';
                if (full.Content != undefined) {
                    if ($scope.isContent)
                        file = file + download;
                    var content = "<div>" + full.Content + "</div>";
                    return icon + file + content + updateTime;
                } else {
                    return icon + '<a ng-click="viewPDF(' + full.Id + ', 1' + ')">' + data + '</a>' + updateTime + fileSize + position;
                }
            } else {
                return icon + '<a ng-click="getObjectFile(0)">' + data + '</a>' + updateTime + fileSize + position;
            }
            if (full.Content != undefined) {
                var file = icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>\n";
                if ($scope.isContent)
                    file = file + download;
                var content = "<div>" + full.Content + "</div>";

                return icon + file + content + updateTime + fileSize + position;
            } else {
                return icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>" + updateTime + fileSize + position;
            }
        }
        else if (document.indexOf(full.FileTypePhysic.toUpperCase()) != -1) {
            if (full.Content != undefined) {
                var file = icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>\n";
                var content = "<div>" + full.Content + "</div>";
                return file + content + updateTime + fileSize + position;
            } else {
                return icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>" + updateTime + fileSize + position;
            }
        }
        else if (image.indexOf(full.FileTypePhysic.toUpperCase()) != -1) {
            if (full.Content != undefined) {
                var file = icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>\n";
                var content = "<div>" + full.Content + "</div>";
                return file + content + updateTime + fileSize + position;
            } else {
                return icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>" + updateTime + fileSize + position;
            }
        }
        else {
            return data + updateTime + fileSize + position;
        }
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ReposName').withOption('sClass', '').withTitle('{{"EDMSDWC_TITLE_SERVER" | translate}}').renderWith(function (data, type, full) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CatName').withOption('sClass', '').withTitle('{{"EDMSDWC_TITLE_PATH" | translate}}').renderWith(function (data, type, full) {
        var currentPath = "";
        if (full.CloudFileId != null && full.CloudFileId != "") {
            currentPath = full.CatName;
        }
        else {
            currentPath = full.CatName;
        }
        return currentPath;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedTime').withOption('sClass', 'dataTable-w80').withTitle('{{"EDMSDWC_TITLE_DATE_CREATED" | translate}}').renderWith(function (data, type, full) {
        return data;
    }));
    vm.reloadData = reloadData;
    vm.dtInstance = {};

    function reloadData(resetPaging) {
        vm.dtInstance.reloadData(callback, resetPaging);
    }
    function callback(json) {

    }
    function toggleAll(selectAll, selectedItems) {

    }
    function toggleOne(selectedItems, evt) {
        $(evt.target).closest('tr').toggleClass('selected');
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

    $scope.reload = function () {
        reloadData(true);
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        dataservice.generatorQRCode($scope.object.Mapping, function (rs) {
            rs = rs.data;
            $scope.QR_Code = rs;
        });
    };

    $scope.init();

    $scope.print = function (qrCode) {
        if (qrCode !== '') {
            var image = '<img src="data:image/png;base64,' + qrCode + '" width="125" height="125" /> ';
            var mainWindow = window.open('', '');
            mainWindow.document.write('<html><head><title></title>');
            mainWindow.document.write('<style type="text/css" media="print">@page {size: auto; margin: 0mm;}' +
                '.col-md-2{width: 16.66667%;float: left;} .textQr{font-family:verdana, arial, sans-serif;font-size:6px;word-break:break-all;}</style >');
            mainWindow.document.write('</head><body onload="window.print();window.close()">');
            mainWindow.document.write(image);
            mainWindow.document.write('</body></html>');
            mainWindow.document.close();
        } else {
            App.toastrError(caption.EDMSWM_MSG_ERR_PRINT);
        }
    };

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

//Hiển thị ảnh khi click double vào Kho
app.controller('viewImage', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice, para) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.initLoad = function () {
        var mapDesgin = document.getElementById("mapDesgin").files[0];
        if (mapDesgin != undefined) {
            var fileName = mapDesgin.name;
            var idxDot = fileName.lastIndexOf(".") + 1;
            var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
            if (extFile !== "jpg" && extFile !== "jpeg" && extFile !== "png" && extFile !== "gif" && extFile !== "bmp") {
                App.toastrError(caption.EDMSWM_MSG_ERR_IMG_FOMAT);
                return;
            } else {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#viewImage').attr('src', e.target.result);
                }

                reader.readAsDataURL(mapDesgin);
            }
        } else {
            if (para != '') {
                $scope.image = para;
            } else {
                $scope.image = "/images/default/no_image.png";
            }
        }
    }
    $scope.initLoad();
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

//Thêm, Sửa, Xóa Tầng
app.controller('addFloor', function ($scope, $rootScope, $compile, $uibModal, $location, $filter, $uibModalInstance, dataservice) {
    $scope.model = {
        FloorCode: '',
        FloorName: '',
        QR_Code: '',
        AreaSquare: '',
        MapDesgin: '',
        Note: '',
        Image: '',
        CNT_Line: '',
        Status: "1",
        WHS_Code: '',
        ManagerId: '',
        Temperature: '',
        Humidity: ''
    }
    $scope.QR_Code = '';
    $scope.mapDesgin = "";
    $scope.imageFloor = "";
    $scope.listWareHouse = [];
    $scope.listManager = [];

    $scope.init = function () {
        dataservice.getListWareHouseWithType($rootScope.Type, function (rs) {
            rs = rs.data;
            $scope.listWareHouse = rs;
            $scope.model.WHS_Code = $rootScope.wareHouseCode;
        });

        dataservice.getListStaffBranch(function (rs) {
            rs = rs.data;
            $scope.listManager = rs.Object;
        });
    }
    $scope.init();

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.submit = function () {
        validationSelect($scope.model);
        if ($scope.addform.validate() && !validationSelect($scope.model).Status) {
            var mapDesgin = document.getElementById("mapDesgin").files[0];
            if (mapDesgin != undefined) {
                var fileName = mapDesgin.name;
                var idxDot = fileName.lastIndexOf(".") + 1;
                var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
                if (extFile !== "jpg" && extFile !== "jpeg" && extFile !== "png" && extFile !== "gif" && extFile !== "bmp") {
                    App.toastrError(caption.EDMSWM_MSG_ERR_IMG_FOMAT);
                    return;
                } else {
                    $scope.mapDesgin = mapDesgin;
                }
            }

            var imageFloor = document.getElementById("imageFloor").files[0];
            if (imageFloor != undefined) {
                var fileName = imageFloor.name;
                var idxDot = fileName.lastIndexOf(".") + 1;
                var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
                if (extFile !== "jpg" && extFile !== "jpeg" && extFile !== "png" && extFile !== "gif" && extFile !== "bmp") {
                    App.toastrError(caption.EDMSWM_MSG_ERR_IMG_FOMAT);
                    return;
                } else {
                    $scope.imageFloor = imageFloor;
                }
            }
            var formData = new FormData();
            formData.append("imageFloor", imageFloor != undefined ? $scope.imageFloor : null);
            formData.append("mapDesgin", mapDesgin != undefined ? $scope.mapDesgin : null);
            formData.append("FloorCode", $scope.model.FloorCode);
            formData.append("FloorName", $scope.model.FloorName);
            formData.append("QR_Code", $scope.model.QR_Code);
            formData.append("AreaSquare", $scope.model.AreaSquare);
            formData.append("MapDesgin", $scope.model.MapDesgin);
            formData.append("Note", $scope.model.Note);
            formData.append("Image", $scope.model.Image);
            formData.append("CNT_Line", $scope.model.CNT_Line);
            formData.append("Status", $scope.model.Status);
            formData.append("WHS_Code", $scope.model.WHS_Code);
            formData.append("ManagerId", $scope.model.ManagerId);
            formData.append("Temperature", $scope.model.Temperature);
            formData.append("Humidity", $scope.model.Humidity);
            dataservice.insertFloor(formData, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    //$uibModalInstance.close();
                    $uibModalInstance.dismiss('cancel');
                    $rootScope.reloadFloor();
                }
            });
        }
    }
    $scope.uploadImageMapDesgin = function () {
        var fileuploader = angular.element("#mapDesgin");
        fileuploader.on('click', function () {
        });
        fileuploader.on('change', function (e) {
            var reader = new FileReader();
            reader.onload = function () {
                document.getElementById('mapDesginId').src = reader.result;
            }
            var files = fileuploader[0].files;
            reader.readAsDataURL(files[0]);
        });
        fileuploader.trigger('click');
    }
    $scope.uploadImageFloor = function () {
        var fileuploader = angular.element("#imageFloor");
        fileuploader.on('click', function () {
        });
        fileuploader.on('change', function (e) {
            var reader = new FileReader();
            reader.onload = function () {
                document.getElementById('imageFloorId').src = reader.result;
            }
            var files = fileuploader[0].files;
            reader.readAsDataURL(files[0]);
        });
        fileuploader.trigger('click');
    }

    $scope.changeFloorCode = function () {
        if ($('#FloorCode').valid()) {
            $('#FloorCode').removeClass('invalid').addClass('success');
        }
    }
    $scope.changeFloorName = function (floorName) {
        floorName = $rootScope.change_alias(floorName);

        dataservice.genFloorCode($rootScope.wareHouseCode, floorName, function (rs) {
            rs = rs.data;
            $scope.model.FloorCode = rs;
            $("#FloorCode").val(rs);
            $scope.changeFloorCode();
            dataservice.generatorQRCode($scope.model.FloorCode, function (result) {
                result = result.data;
                $scope.QR_Code = result;
            });
        });
    };

    //Action khi chọn 1 combobox
    $scope.changleSelect = function (SelectType, item) {
        if (SelectType == "ManagerId") {
            if ($scope.model.ManagerId != undefined && $scope.model.ManagerId != null && $scope.model.ManagerId != '') {
                $scope.errorManagerId = false;
            }
        }
    }

    //Validate UiSelect
    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        if (data.ManagerId == undefined || data.ManagerId == null || data.ManagerId == '') {
            $scope.errorManagerId = true;
            mess.Status = true;
        } else {
            $scope.errorManagerId = false;
        }

        return mess;
    };

    $scope.viewImage = function () {
        var url = $scope.model.MapDesgin;
        if (url != null) {
            var image = "https://www.kientrucadong.com/diendan/wp-content/uploads/2017/04/1-MAT-BANG-TANG-1-2.jpg";
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: ctxfolder + '/viewImage.html',
                controller: 'viewImage',
                backdrop: 'static',
                size: '60',
                resolve: {
                    para: function () {
                        return url;
                    }
                }
            });
            modalInstance.result.then(function (d) {
                $scope.reloadNoResetPage();
            }, function () {
            });
        }
    }
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);

    $scope.print = function (qrCode) {
        if (qrCode != '') {
            var image = '<img src="data:image/png;base64,' + qrCode + '" width="125" height="125" /> ';
            var mainWindow = window.open('', '');
            mainWindow.document.write('<html><head><title></title>');
            mainWindow.document.write('<style type="text/css" media="print">@page {size: auto; margin: 0mm;}' +
                '.col-md-2{width: 16.66667%;float: left;} .textQr{font-family:verdana, arial, sans-serif;font-size:6px;word-break:break-all;}</style >');
            mainWindow.document.write('</head><body onload="window.print();window.close()">');
            mainWindow.document.write(image);
            mainWindow.document.write('</body></html>');
            mainWindow.document.close();
        } else {
            App.toastrError(caption.EDMSWM_MSG_ERR_PRINT)
        }
    }
});
app.controller('editFloor', function ($scope, $rootScope, $compile, $uibModal, $location, $filter, $uibModalInstance, para, dataservice) {
    $scope.model = {
        FloorCode: '',
        FloorName: '',
        QR_Code: '',
        AreaSquare: '',
        MapDesgin: '',
        Note: '',
        Image: '',
        CNT_Line: '',
        Status: '',
        WHS_Code: '',
        ManagerId: '',
        Temperature: '',
        Humidity: ''
    }
    $scope.QR_Code = '';
    $scope.mapDesgin = "";
    $scope.imageFloor = "";
    $scope.listWareHouse = [];
    $scope.listManager = [];

    $scope.init = function () {
        var floorId = parseInt(para);
        dataservice.getFloorInfo(floorId, function (result) {
            result = result.data;
            $scope.model = result.Object;
            dataservice.generatorQRCode($scope.model.FloorCode, function (result) {
                result = result.data;
                $scope.QR_Code = result;
            });
        });

        dataservice.getListWareHouseWithType($rootScope.Type, function (rs) {
            rs = rs.data;
            $scope.listWareHouse = rs;
        });

        dataservice.getListStaffBranch(function (rs) {
            rs = rs.data;
            $scope.listManager = rs.Object;
        });
    }
    $scope.init();

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.submit = function () {
        if ($scope.editform.validate()) {
            var mapDesgin = document.getElementById("mapDesgin").files[0];
            if (mapDesgin != undefined) {
                var fileName = mapDesgin.name;
                var idxDot = fileName.lastIndexOf(".") + 1;
                var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
                if (extFile !== "jpg" && extFile !== "jpeg" && extFile !== "png" && extFile !== "gif" && extFile !== "bmp") {
                    App.toastrError(caption.EDMSWM_MSG_ERR_IMG_FOMAT);
                    return;
                } else {
                    $scope.mapDesgin = mapDesgin;
                }
            }

            var imageFloor = document.getElementById("imageFloor").files[0];
            if (imageFloor != undefined) {
                var fileName = imageFloor.name;
                var idxDot = fileName.lastIndexOf(".") + 1;
                var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
                if (extFile !== "jpg" && extFile !== "jpeg" && extFile !== "png" && extFile !== "gif" && extFile !== "bmp") {
                    App.toastrError(caption.EDMSWM_MSG_ERR_IMG_FOMAT);
                    return;
                } else {
                    $scope.imageFloor = imageFloor;
                }
            }
            var formData = new FormData();
            formData.append("imageFloor", imageFloor != undefined ? $scope.imageFloor : null);
            formData.append("mapDesgin", mapDesgin != undefined ? $scope.mapDesgin : null);
            formData.append("FloorCode", $scope.model.FloorCode);
            formData.append("FloorName", $scope.model.FloorName);
            formData.append("QR_Code", $scope.model.QR_Code);
            formData.append("AreaSquare", $scope.model.AreaSquare);
            formData.append("MapDesgin", $scope.model.MapDesgin);
            if ($scope.model.Note != null)
                formData.append("Note", $scope.model.Note);
            formData.append("Image", $scope.model.Image);
            formData.append("CNT_Line", $scope.model.CNT_Line);
            formData.append("Status", $scope.model.Status);
            formData.append("WHS_Code", $scope.model.WHS_Code);
            formData.append("ManagerId", $scope.model.ManagerId);
            if ($scope.model.Temperature != null)
                formData.append("Temperature", $scope.model.Temperature);
            if ($scope.model.Humidity != null)
                formData.append("Humidity", $scope.model.Humidity);
            dataservice.updateFloor(formData, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    //$uibModalInstance.close();
                    $uibModalInstance.dismiss('cancel');
                    $rootScope.reloadFloor();
                }
            });
        }
    }
    $scope.uploadImageMapDesgin = function () {
        var fileuploader = angular.element("#mapDesgin");
        fileuploader.on('click', function () {
        });
        fileuploader.on('change', function (e) {
            var reader = new FileReader();
            reader.onload = function () {
                document.getElementById('mapDesginId').src = reader.result;
            }
            var files = fileuploader[0].files;
            reader.readAsDataURL(files[0]);
        });
        fileuploader.trigger('click');
    }
    $scope.uploadImageFloor = function () {
        var fileuploader = angular.element("#imageFloor");
        fileuploader.on('click', function () {
        });
        fileuploader.on('change', function (e) {
            var reader = new FileReader();
            reader.onload = function () {
                document.getElementById('imageFloorId').src = reader.result;
            }
            var files = fileuploader[0].files;
            reader.readAsDataURL(files[0]);
        });
        fileuploader.trigger('click');
    }

    $scope.viewImage = function () {
        var input = $('#mapDesgin');
        var url = $scope.model.MapDesgin;



        if (url != null) {
            var image = "https://www.kientrucadong.com/diendan/wp-content/uploads/2017/04/1-MAT-BANG-TANG-1-2.jpg";
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: ctxfolder + '/viewImage.html',
                controller: 'viewImage',
                backdrop: 'static',
                size: '60',
                resolve: {
                    para: function () {
                        return url;
                    }
                }
            });
            modalInstance.result.then(function (d) {
                $scope.reloadNoResetPage();
            }, function () {
            });
        }
    }
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);

    $scope.print = function (qrCode) {
        if (qrCode != '') {
            var image = '<img src="data:image/png;base64,' + qrCode + '" width="125" height="125" /> ';
            var mainWindow = window.open('', '');
            mainWindow.document.write('<html><head><title></title>');
            mainWindow.document.write('<style type="text/css" media="print">@page {size: auto; margin: 0mm;}' +
                '.col-md-2{width: 16.66667%;float: left;} .textQr{font-family:verdana, arial, sans-serif;font-size:6px;word-break:break-all;}</style >');
            mainWindow.document.write('</head><body onload="window.print();window.close()">');
            mainWindow.document.write(image);
            mainWindow.document.write('</body></html>');
            mainWindow.document.close();
        } else {
            App.toastrError(caption.EDMSWM_MSG_ERR_PRINT)
        }
    }
});

//Thêm, Sửa, Xóa Dãy
app.controller('addLine', function ($scope, $rootScope, $compile, $uibModal, $location, $filter, $uibModalInstance, dataservice) {
    $scope.model = {
        LineCode: '',
        L_Text: '',
        QR_Code: '',
        L_Color: '',
        L_Position: '',
        Note: '',
        L_Size: '',
        CNT_Rack: '',
        Status: '',
        L_Status: '1',
    }
    $scope.QR_Code = '';
    $scope.listManager = [];
    $scope.listFloor = [];
    $scope.init = function () {
        dataservice.getListFloor(function (rs) {
            rs = rs.data;
            $scope.listFloor = rs;
            $scope.model.FloorCode = $rootScope.floorCode;
        });
    }
    $scope.init();
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.submit = function () {
        validationSelect($scope.model)
        if ($scope.addform.validate() && !validationSelect($scope.model).Status) {
            dataservice.insertLine($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.dismiss('cancel');
                    $rootScope.reloadLine();
                }
            });
        }
    }
    $scope.changeLineCode = function () {
        if ($('#LineCode').valid()) {
            $('#LineCode').removeClass('invalid').addClass('success');
        }
    }
    $scope.changeLineName = function (lineName) {
        lineName = $rootScope.change_alias(lineName);
        dataservice.genLineCode($rootScope.floorCode, lineName, function (rs) {
            rs = rs.data;
            $scope.model.LineCode = rs;
            $("#LineCode").val(rs);
            $scope.changeLineCode();
            dataservice.generatorQRCode($scope.model.LineCode, function (result) {
                result = result.data;
                $scope.QR_Code = result;
            });
        });
    };
    $scope.print = function (qrCode) {
        if (qrCode != '') {
            var image = '<img src="data:image/png;base64,' + qrCode + '" width="125" height="125" /> ';
            var mainWindow = window.open('', '');
            mainWindow.document.write('<html><head><title></title>');
            mainWindow.document.write('<style type="text/css" media="print">@page {size: auto; margin: 0mm;}' +
                '.col-md-2{width: 16.66667%;float: left;} .textQr{font-family:verdana, arial, sans-serif;font-size:6px;word-break:break-all;}</style >');
            mainWindow.document.write('</head><body onload="window.print();window.close()">');
            mainWindow.document.write(image);
            mainWindow.document.write('</body></html>');
            mainWindow.document.close();
        } else {
            App.toastrError(caption.EDMSWM_MSG_ERR_PRINT)
        }
    }
    function validationSelect(data) {

        var mess = { Status: false, Title: "" }
        if (data.L_Status == undefined || data.L_Status == null || data.L_Status == "") {
            $scope.errorL_Status = true;
            mess.Status = true;
        } else {
            $scope.errorL_Status = false;
        }
        return mess;
    };
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});
app.controller('editLine', function ($scope, $rootScope, $compile, $uibModal, $location, $filter, $uibModalInstance, dataservice, para) {
    $scope.model = {
        LineCode: '',
        L_Text: '',
        QR_Code: '',
        L_Color: '',
        L_Position: '',
        Note: '',
        L_Size: '',
        CNT_Rack: '',
        Status: '',
        L_Status: '',
    }
    $scope.QR_Code = '';
    $scope.listFloor = [];

    $scope.init = function () {
        var lineId = parseInt(para);
        dataservice.getLineInfo(lineId, function (result) {
            result = result.data;
            $scope.model = result.Object;
            dataservice.generatorQRCode($scope.model.LineCode, function (result) {
                result = result.data;
                $scope.QR_Code = result;
            });
        });

        dataservice.getListFloor(function (rs) {
            rs = rs.data;
            $scope.listFloor = rs;
        });
    }
    $scope.init();

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.submit = function () {
        validationSelect($scope.model)
        if ($scope.editform.validate() && !validationSelect($scope.model).Status) {
            dataservice.updateLine($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.dismiss('cancel');
                    $rootScope.reloadLine();
                }
            });
        }
    }

    $scope.changeLineName = function (lineName) {

        dataservice.genLineCode($rootScope.floorCode, lineName, function (rs) {
            rs = rs.data;
            $scope.model.LineCode = rs;

            dataservice.generatorQRCode($scope.model.LineCode, function (result) {
                result = result.data;
                $scope.model.QR_Code = result;
            });
        });
    };
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);

    $scope.print = function (qrCode) {
        if (qrCode != '') {
            var image = '<img src="data:image/png;base64,' + qrCode + '" width="125" height="125" /> ';
            var mainWindow = window.open('', '');
            mainWindow.document.write('<html><head><title></title>');
            mainWindow.document.write('<style type="text/css" media="print">@page {size: auto; margin: 0mm;}' +
                '.col-md-2{width: 16.66667%;float: left;} .textQr{font-family:verdana, arial, sans-serif;font-size:6px;word-break:break-all;}</style >');
            mainWindow.document.write('</head><body onload="window.print();window.close()">');
            mainWindow.document.write(image);
            mainWindow.document.write('</body></html>');
            mainWindow.document.close();
        } else {
            App.toastrError(caption.EDMSWM_MSG_ERR_PRINT)
        }
    }
    function validationSelect(data) {

        var mess = { Status: false, Title: "" }
        if (data.L_Status == undefined || data.L_Status == null || data.L_Status == '') {
            $scope.errorL_Status = true;
            mess.Status = true;
        } else {
            $scope.errorL_Status = false;
        }
        return mess;
    };

});

//Thêm, Sửa, Xóa Kệ
app.controller('addRack', function ($scope, $rootScope, $compile, $uibModal, $location, $filter, $uibModalInstance, dataservice) {
    $scope.model = {
        RackCode: '',
        RackName: '',
        QR_Code: '',
        Material: '',
        R_Position: 1,
        Note: '',
        R_Size: '',
        CNT_Box: '',
        R_Status: '1',
        Ordering: '',
        CNT_Cell: ''
    };
    $scope.QR_Code = '';
    $scope.listLine = [];

    $scope.init = function () {
        dataservice.getListLine(function (rs) {
            rs = rs.data;
            $scope.listLine = rs;
            $scope.model.LineCode = $rootScope.lineCode;
        });
    }
    $scope.init();

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.submit = function () {
        if ($scope.addform.validate()) {
            var msg = $rootScope.checkData($scope.model);
            if (msg.Status) {
                App.toastrError(msg.Title);
                return;
            }
            //Check Số thùng phải lớn hơn Số vị trí
            var numBox = parseInt($scope.model.CNT_Box);
            var numPosition = parseInt($scope.model.R_Position);
            if (numBox < numPosition) {
                App.toastrError(caption.EDMSWH_MSG_NUMBER_OF_POSITIONS);
                return;
            }


            var modalInstance = $uibModal.open({
                templateUrl: ctxfolderMessage + '/messageConfirmAdd.html',
                backdrop: 'static',
                resolve: {
                    para: function () {
                        return $scope.model;
                    }
                },
                controller: function ($scope, $uibModalInstance, para) {
                    $scope.message = caption.EDMSWH_MSG_ADD_SHELF;//"Bạn muốn thêm kệ này ?";
                    $scope.ok = function () {
                        dataservice.insertRack(para, function (rs) {
                            rs = rs.data;
                            if (rs.Error) {
                                App.toastrError(rs.Title);
                            } else {
                                App.toastrSuccess(rs.Title);
                                $uibModalInstance.close();
                                $rootScope.reloadRack();
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
                $uibModalInstance.close();
            }, function () {
            });
        }
    }

    $scope.changeRackCode = function () {
        if ($('#RackCode').valid()) {
            $('#RackCode').removeClass('invalid').addClass('success');
        }
    }
    $scope.changeRackName = function (rackName) {
        rackName = $rootScope.change_alias(rackName);
        dataservice.genRackCode($rootScope.lineCode, rackName, function (rs) {
            rs = rs.data;
            $scope.model.RackCode = rs;
            $("#RackCode").val(rs);
            $scope.changeRackCode();
            dataservice.generatorQRCode($scope.model.RackCode, function (rs) {
                rs = rs.data;
                $scope.QR_Code = rs;
            });
        });
    };
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);

    $scope.print = function (qrCode) {
        if (qrCode != '') {
            var image = '<img src="data:image/png;base64,' + qrCode + '" width="125" height="125" /> ';
            var mainWindow = window.open('', '');
            mainWindow.document.write('<html><head><title></title>');
            mainWindow.document.write('<style type="text/css" media="print">@page {size: auto; margin: 0mm;}' +
                '.col-md-2{width: 16.66667%;float: left;} .textQr{font-family:verdana, arial, sans-serif;font-size:6px;word-break:break-all;}</style >');
            mainWindow.document.write('</head><body onload="window.print();window.close()">');
            mainWindow.document.write(image);
            mainWindow.document.write('</body></html>');
            mainWindow.document.close();
        } else {
            App.toastrError(caption.EDMSWM_MSG_ERR_PRINT)
        }
    }
});
app.controller('editRack', function ($scope, $rootScope, $compile, $uibModal, $location, $filter, $uibModalInstance, dataservice, para) {
    $scope.model = {
        RackCode: '',
        RackName: '',
        QR_Code: '',
        Material: '',
        R_Position: '',
        Note: '',
        R_Size: '',
        CNT_Box: '',
        R_Status: '',
        Ordering: '',
        CNT_Cell: '',
    }
    $scope.QR_Code = '';
    $scope.listLine = [];

    $scope.init = function () {
        var rackId = parseInt(para);
        dataservice.getRackInfo(rackId, function (rs) {
            rs = rs.data;
            $scope.model = rs.Object;
            dataservice.generatorQRCode($scope.model.RackCode, function (rs) {
                rs = rs.data;
                $scope.QR_Code = rs;
            });
        });

        dataservice.getListLine(function (rs) {
            rs = rs.data;
            $scope.listLine = rs;
        });
    }
    $scope.init();

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.submit = function () {
        if ($scope.editform.validate()) {
            var msg = $rootScope.checkData($scope.model);
            if (msg.Status) {
                App.toastrError(msg.Title);
                return;
            }
            //Check Số thùng phải lớn hơn Số vị trí
            var numBox = parseInt($scope.model.CNT_Box);
            var numPosition = parseInt($scope.model.R_Position);
            if (numBox < numPosition) {
                App.toastrError(caption.EDMSWH_MSG_NUMBER_OF_POSITIONS);
                return;
            }

            dataservice.updateRack($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.dismiss('cancel');
                    $rootScope.reloadRack();
                }
            });
        }
    }

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);

    $scope.print = function (qrCode) {
        if (qrCode != '') {
            var image = '<img src="data:image/png;base64,' + qrCode + '" width="125" height="125" /> ';
            var mainWindow = window.open('', '');
            mainWindow.document.write('<html><head><title></title>');
            mainWindow.document.write('<style type="text/css" media="print">@page {size: auto; margin: 0mm;}' +
                '.col-md-2{width: 16.66667%;float: left;} .textQr{font-family:verdana, arial, sans-serif;font-size:6px;word-break:break-all;}</style >');
            mainWindow.document.write('</head><body onload="window.print();window.close()">');
            mainWindow.document.write(image);
            mainWindow.document.write('</body></html>');
            mainWindow.document.close();
        } else {
            App.toastrError(caption.EDMSWM_MSG_ERR_PRINT)
        }
    }
});

app.controller('addBox', function ($scope, $rootScope, $compile, $uibModal, $location, $filter, $uibModalInstance, dataservice, $timeout) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
    $timeout(function () {
        setModalMaxHeight('.modal');
        setModalDraggable('.modal-dialog');
    }, 100);
});
//Thêm, Sửa, Xóa Danh mục
app.controller('addCategory', function ($scope, $rootScope, $compile, $uibModal, $location, $filter, $uibModalInstance, para, dataservice) {
    $scope.model = {
        PAreaCode: para.Code,
        PAreaDescription: para.Name,
        PAreaParent: para.Parent,
        PAreaType: para.Type
    }
    $scope.title = para.Title;
    $scope.lockParent = para.LockParent;
    $scope.lockCode = para.Code != "" && para.Code != null && para.Code != undefined;
    $scope.listParent = [];

    $scope.init = function () {
        dataservice.getListAreaByParentCode(para.ParentType, "", function (rs) {
            rs = rs.data;
            $scope.listParent = rs;
            $scope.model.PAreaParent = para.Parent;
        });

        dataservice.getListATTRTYPE(function (result) {
            result = result.data;
            $scope.ListATTRTYPE = result.Object;
        });
        var position = "";
        var added = "";
        position += $rootScope.wareHouseCode ? 'A_' + $rootScope.wareHouseCode : (para.Type == "AREA" ? 'A_' + $scope.model.PAreaCode : "");
        if (para.Type != "AREA") {
            added = ` [${position}]`;
            position += $rootScope.floorCode ? '_F_' + $rootScope.floorCode : (para.Type == "FLOOR" ? '_F_' + $scope.model.PAreaCode : "");
        }
        if (para.Type != "AREA" && para.Type != "FLOOR") {
            added = ` [${position}]`;
            position += $rootScope.lineCode ? '_L_' + $rootScope.lineCode : (para.Type == "LINE" ? '_L_' + $scope.model.PAreaCode : "");
        }
        if (para.Type != "AREA" && para.Type != "FLOOR" && para.Type != "LINE") {
            added = ` [${position}]`;
            position += $rootScope.rackCode ? '_R_' + $rootScope.rackCode : (para.Type == "RACK" ? '_R_' + $scope.model.PAreaCode : "");
        }
        if (para.Type != "AREA" && para.Type != "FLOOR" && para.Type != "LINE" && para.Type != "RACK") {
            added = ` [${position}]`;
            position += $rootScope.positionCode ? '_P_' + $rootScope.positionCode : (para.Type == "POSITION" ? '_P_' + $scope.model.PAreaCode : "");
        }
        $scope.title += added;
        $scope.QR_Code = position;
    }
    $scope.init();

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //Action khi chọn 1 combobox
    $scope.changleSelect = function (SelectType) {
        if (SelectType == "PAreaParent" && $scope.model.PAreaParent != "") {
            $scope.errorPAreaParent = false;
        }
        if (SelectType == "PAreaCode" && $scope.model.PAreaCode != "") {
            var position = "";
            position += $rootScope.wareHouseCode ? 'A_' + $rootScope.wareHouseCode : (para.Type == "AREA" ? 'A_' + $scope.model.PAreaCode : "");
            if (para.Type != "AREA") {
                position += $rootScope.floorCode ? '_F_' + $rootScope.floorCode : (para.Type == "FLOOR" ? '_F_' + $scope.model.PAreaCode : "");
            }
            if (para.Type != "AREA" && para.Type != "FLOOR") {
                position += $rootScope.lineCode ? '_L_' + $rootScope.lineCode : (para.Type == "LINE" ? '_L_' + $scope.model.PAreaCode : "");
            }
            if (para.Type != "AREA" && para.Type != "FLOOR" && para.Type != "LINE") {
                position += $rootScope.rackCode ? '_R_' + $rootScope.rackCode : (para.Type == "RACK" ? '_R_' + $scope.model.PAreaCode : "");
            }
            if (para.Type != "AREA" && para.Type != "FLOOR" && para.Type != "LINE" && para.Type != "RACK") {
                position += $rootScope.positionCode ? '_P_' + $rootScope.positionCode : (para.Type == "POSITION" ? '_P_' + $scope.model.PAreaCode : "");
            }
            $scope.QR_Code = position;
        }
    }
    $scope.submit = function () {
        if ($scope.lockCode == false) {
            validationSelect($scope.model);
            if ($scope.addform.validate() && !validationSelect($scope.model).Status) {
                dataservice.insertCategory($scope.model, function (rs) {
                    rs = rs.data;
                    if (rs.Error) {
                        App.toastrError(rs.Title);
                    } else {
                        App.toastrSuccess(rs.Title);
                        //$uibModalInstance.close();
                        /*$uibModalInstance.dismiss('cancel');*/
                        $rootScope.reloadCategory(para.Type);
                        $scope.saveMapping();
                    }
                });
            }
        }
        else {
            $scope.saveMapping();
        }
    }
    $scope.modelMapping = {};
    $scope.saveMapping = function () {
        $scope.modelMapping = {
            ObjectCode: $scope.QR_Code,
            ObjectType: para.Type,
            CategoryCode: $scope.model.PAreaCode,
            Status: $scope.model.Status,
            SvgIconData: $scope.model.SvgIconData,
            Image: "",
            JsonAttr: JSON.stringify($scope.listNewAttr),
        };
        console.log($scope.modelMapping);
        $scope.insertImage(function () {
            dataservice.insertMapping($scope.modelMapping, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    $uibModalInstance.dismiss('cancel');
                }
            });
        })
    }

    //Validate UiSelect
    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        if (data.PAreaType != "AREA" && (data.PAreaParent == undefined || data.PAreaParent == null || data.PAreaParent == '')) {
            $scope.errorPAreaParent = true;
            mess.Status = true;
        } else {
            $scope.errorPAreaParent = false;
        }

        return mess;
    };

    //Mapping
    $scope.insertImage = function (callback) {
        var fileName = $('input[type=file]').val();
        var idxDot = fileName.lastIndexOf(".") + 1;
        var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
        if (extFile !== "") {
            if (extFile !== "jpg" && extFile !== "jpeg" && extFile !== "png" && extFile !== "gif" && extFile !== "bmp") {
                App.toastrError(caption.MLP_MSG_FORMAT_REQUIRED);
                callback();
            }
            else {
                var fi = document.getElementById('file');
                var fsize = (fi.files.item(0).size) / 1024;
                if (fsize > 1024) {
                    App.toastrError(caption.MLP_MSG_FILE_SIZE_MAXXIMUM);
                    callback();
                } else {
                    var fileUpload = $("#file").get(0);
                    var reader = new FileReader();
                    reader.readAsDataURL(fileUpload.files[0]);
                    reader.onload = function (e) {
                        ////
                        //Initiate the JavaScript Image object.
                        var image = new Image();
                        //Set the Base64 string return from FileReader as source.
                        image.src = e.target.result;
                        image.onload = function () {
                            //Determine the Height and Width.
                            var height = this.height;
                            var width = this.width;
                            if (width > 5000 || height > 5000) {
                                App.toastrError(caption.MLP_MSG_IMG_SIZE_MAXIMUM);
                                callback();
                            } else {
                                var data = new FormData();
                                file = fileUpload.files[0];
                                data.append("FileUpload", file);
                                dataservice.uploadImage(data, function (rs) {
                                    rs = rs.data;
                                    if (rs.Error) {
                                        App.toastrError(rs.Title);
                                        callback();
                                    }
                                    else {
                                        $scope.modelMapping.Image = '/uploads/images/' + rs.Object;
                                        ok = true;
                                        callback();
                                    }
                                })
                            }
                        };
                    }
                }
            }
        }
        else {
            callback();
        }
    }
    $scope.selectImage = function () {
        var fileuploader = angular.element("#file");
        fileuploader.on('click', function () {
        });
        fileuploader.on('change', function (e) {
            var reader = new FileReader();
            reader.onload = function () {
                document.getElementById('imageId').src = reader.result;
            }
            var files = fileuploader[0].files;
            var idxDot = files[0].name.lastIndexOf(".") + 1;
            var extFile = files[0].name.substr(idxDot, files[0].name.length).toLowerCase();
            if (extFile !== "jpg" && extFile !== "jpeg" && extFile !== "png" && extFile !== "gif" && extFile !== "bmp") {
                App.toastrError(caption.COM_MSG_INVALID_FORMAT);
                return;
            }
            reader.readAsDataURL(files[0]);
        });
        fileuploader.trigger('click');
    }
    $scope.listNewAttr = [];
    $scope.currentId = 0;

    $scope.addNewAttr = function () {
        var newAttr = {
            Id: $scope.currentId,
            AttrName: '',
            Value: '',
        };
        $scope.listNewAttr.push(newAttr);
        $scope.currentId = $scope.currentId + 1;
    }

    $scope.deleteNewAtt = function (id) {
        for (var i = 0; i < $scope.listNewAttr.length; i++) {
            if ($scope.listNewAttr[i].Id == id) {
                $scope.listNewAttr.splice(i, 1);
                break;
            }
        }
    }

    $scope.print = function (qrCode) {
        if (qrCode !== '') {
            var image = '<img src="data:image/png;base64,' + qrCode + '" width="125" height="125" /> ';
            var mainWindow = window.open('', '');
            mainWindow.document.write('<html><head><title></title>');
            mainWindow.document.write('<style type="text/css" media="print">@page {size: auto; margin: 0mm;}' +
                '.col-md-2{width: 16.66667%;float: left;} .textQr{font-family:verdana, arial, sans-serif;font-size:6px;word-break:break-all;}</style >');
            mainWindow.document.write('</head><body onload="window.print();window.close()">');
            mainWindow.document.write(image);
            mainWindow.document.write('</body></html>');
            mainWindow.document.close();
        } else {
            App.toastrError(caption.EDMSWM_MSG_ERR_PRINT);
        }
    };
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});
app.controller('editCategory', function ($scope, $rootScope, $compile, $uibModal, $location, $filter, $uibModalInstance, para, dataservice) {
    $scope.model = {
        PAreaCode: '',
        PAreaDescription: '',
        PAreaParent: para.Parent,
        PAreaType: para.Type
    }
    $scope.title = para.Title;
    $scope.lockParent = para.LockParent;
    $scope.listParent = [];

    $scope.init = function () {
        // $scope.model = para;

        dataservice.getListATTRTYPE(function (result) {
            result = result.data;
            $scope.ListATTRTYPE = result.Object;
        });
        dataservice.getCategory(para.Id, function (result) {
            result = result.data;
            $scope.model = result.Object;
            // dataservice.generatorQRCode($scope.model.FloorCode, function (result) {
            //     result = result.data;
            //     $scope.QR_Code = result;
            // });
            var position = "";
            position += $rootScope.wareHouseCode ? 'A_' + $rootScope.wareHouseCode : (para.Type == "AREA" ? 'A_' + $scope.model.PAreaCode : "");
            if (para.Type != "AREA") {
                position += $rootScope.floorCode ? '_F_' + $rootScope.floorCode : (para.Type == "FLOOR" ? '_F_' + $scope.model.PAreaCode : "");
            }
            if (para.Type != "AREA" && para.Type != "FLOOR") {
                position += $rootScope.lineCode ? '_L_' + $rootScope.lineCode : (para.Type == "LINE" ? '_L_' + $scope.model.PAreaCode : "");
            }
            if (para.Type != "AREA" && para.Type != "FLOOR" && para.Type != "LINE") {
                position += $rootScope.rackCode ? '_R_' + $rootScope.rackCode : (para.Type == "RACK" ? '_R_' + $scope.model.PAreaCode : "");
            }
            if (para.Type != "AREA" && para.Type != "FLOOR" && para.Type != "LINE" && para.Type != "RACK") {
                position += $rootScope.positionCode ? '_P_' + $rootScope.positionCode : (para.Type == "POSITION" ? '_P_' + $scope.model.PAreaCode : "");
            }
            $scope.QR_Code = position;
            $scope.initMapping();
        });

        dataservice.getListAreaByParentCode(para.ParentType, "", function (rs) {
            rs = rs.data;
            $scope.listParent = rs;
            $scope.model.PAreaParent = para.Parent;
        });
    }
    $scope.initMapping = function () {
        dataservice.getMapping($scope.QR_Code, function (result) {
            result = result.data;
            if (result.Error == false) {
                $scope.model.Image = result.Object.Image;
                $scope.model.SvgIconData = result.Object.SvgIconData;
                try {
                    $scope.listNewAttr = JSON.parse(result.Object.JsonAttr);
                    console.log($scope.listNewAttr.length);
                } catch (e) {
                    console.log(e);
                }
            }
            else {
                App.toastrError(result.Title);
            }
        });
    }
    $scope.init();

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.changleSelect = function (SelectType) {
        if (SelectType == "PAreaParent" && $scope.model.PAreaParent != "") {
            $scope.errorPAreaParent = false;
        }
        if (SelectType == "PAreaCode" && $scope.model.PAreaCode != "") {
            var position = "";
            position += $rootScope.wareHouseCode ? 'A_' + $rootScope.wareHouseCode : (para.Type == "AREA" ? 'A_' + $scope.model.PAreaCode : "");
            if (para.Type != "AREA") {
                position += $rootScope.floorCode ? '_F_' + $rootScope.floorCode : (para.Type == "FLOOR" ? '_F_' + $scope.model.PAreaCode : "");
            }
            if (para.Type != "AREA" && para.Type != "FLOOR") {
                position += $rootScope.lineCode ? '_L_' + $rootScope.lineCode : (para.Type == "LINE" ? '_L_' + $scope.model.PAreaCode : "");
            }
            if (para.Type != "AREA" && para.Type != "FLOOR" && para.Type != "LINE") {
                position += $rootScope.rackCode ? '_R_' + $rootScope.rackCode : (para.Type == "RACK" ? '_R_' + $scope.model.PAreaCode : "");
            }
            if (para.Type != "AREA" && para.Type != "FLOOR" && para.Type != "LINE" && para.Type != "RACK") {
                position += $rootScope.positionCode ? '_P_' + $rootScope.positionCode : (para.Type == "POSITION" ? '_P_' + $scope.model.PAreaCode : "");
            }
            $scope.QR_Code = position;
        }
    }
    $scope.submit = function () {
        validationSelect($scope.model);
        if ($scope.editform.validate() && !validationSelect($scope.model).Status) {
            dataservice.updateCategory($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    //$uibModalInstance.close();
                    /*$uibModalInstance.dismiss('cancel');*/
                    $rootScope.reloadCategory(para.Type);
                    $scope.saveMapping();
                }
            });
        }
    };
    $scope.modelMapping = {};
    $scope.saveMapping = function () {
        $scope.modelMapping = {
            ObjectCode: $scope.QR_Code,
            ObjectType: para.Type,
            CategoryCode: $scope.model.PAreaCode,
            Status: $scope.model.Status,
            SvgIconData: $scope.model.SvgIconData,
            Image: "",
            JsonAttr: JSON.stringify($scope.listNewAttr),
        };
        $scope.insertImage(function () {
            dataservice.insertMapping($scope.modelMapping, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    $uibModalInstance.dismiss('cancel');
                }
            });
        })
    }

    //Validate UiSelect
    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        if (data.PAreaType != "AREA" && (data.PAreaParent == undefined || data.PAreaParent == null || data.PAreaParent == '')) {
            $scope.errorPAreaParent = true;
            mess.Status = true;
        } else {
            $scope.errorPAreaParent = false;
        }

        return mess;
    };

    //Mapping
    $scope.insertImage = function (callback) {
        var fileName = $('input[type=file]').val();
        var idxDot = fileName.lastIndexOf(".") + 1;
        var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
        if (extFile !== "") {
            if (extFile !== "jpg" && extFile !== "jpeg" && extFile !== "png" && extFile !== "gif" && extFile !== "bmp") {
                App.toastrError(caption.MLP_MSG_FORMAT_REQUIRED);
                callback();
            }
            else {
                var fi = document.getElementById('file');
                var fsize = (fi.files.item(0).size) / 1024;
                if (fsize > 1024) {
                    App.toastrError(caption.MLP_MSG_FILE_SIZE_MAXXIMUM);
                    callback();
                } else {
                    var fileUpload = $("#file").get(0);
                    var reader = new FileReader();
                    reader.readAsDataURL(fileUpload.files[0]);
                    reader.onload = function (e) {
                        ////
                        //Initiate the JavaScript Image object.
                        var image = new Image();
                        //Set the Base64 string return from FileReader as source.
                        image.src = e.target.result;
                        image.onload = function () {
                            //Determine the Height and Width.
                            var height = this.height;
                            var width = this.width;
                            if (width > 5000 || height > 5000) {
                                App.toastrError(caption.MLP_MSG_IMG_SIZE_MAXIMUM);
                                callback();
                            } else {
                                var data = new FormData();
                                file = fileUpload.files[0];
                                data.append("FileUpload", file);
                                dataservice.uploadImage(data, function (rs) {
                                    rs = rs.data;
                                    if (rs.Error) {
                                        App.toastrError(rs.Title);
                                        callback();
                                    }
                                    else {
                                        $scope.modelMapping.Image = '/uploads/images/' + rs.Object;
                                        ok = true;
                                        callback();
                                    }
                                })
                            }
                        };
                    }
                }
            }
        }
        else {
            callback();
        }
    }
    $scope.selectImage = function () {
        var fileuploader = angular.element("#file");
        fileuploader.on('click', function () {
        });
        fileuploader.on('change', function (e) {
            var reader = new FileReader();
            reader.onload = function () {
                document.getElementById('imageId').src = reader.result;
            }
            var files = fileuploader[0].files;
            var idxDot = files[0].name.lastIndexOf(".") + 1;
            var extFile = files[0].name.substr(idxDot, files[0].name.length).toLowerCase();
            if (extFile !== "jpg" && extFile !== "jpeg" && extFile !== "png" && extFile !== "gif" && extFile !== "bmp") {
                App.toastrError(caption.COM_MSG_INVALID_FORMAT);
                return;
            }
            reader.readAsDataURL(files[0]);
        });
        fileuploader.trigger('click');
    };
    $scope.listNewAttr = [];
    $scope.currentId = 0;

    $scope.addNewAttr = function () {
        var newAttr = {
            Id: $scope.currentId,
            AttrName: '',
            Value: '',
        };
        $scope.listNewAttr.push(newAttr);
        $scope.currentId = $scope.currentId + 1;
    }

    $scope.deleteNewAtt = function (id) {
        for (var i = 0; i < $scope.listNewAttr.length; i++) {
            if ($scope.listNewAttr[i].Id == id) {
                $scope.listNewAttr.splice(i, 1);
                break;
            }
        }
    }

    $scope.print = function (qrCode) {
        if (qrCode !== '') {
            var image = '<img src="data:image/png;base64,' + qrCode + '" width="125" height="125" /> ';
            var mainWindow = window.open('', '');
            mainWindow.document.write('<html><head><title></title>');
            mainWindow.document.write('<style type="text/css" media="print">@page {size: auto; margin: 0mm;}' +
                '.col-md-2{width: 16.66667%;float: left;} .textQr{font-family:verdana, arial, sans-serif;font-size:6px;word-break:break-all;}</style >');
            mainWindow.document.write('</head><body onload="window.print();window.close()">');
            mainWindow.document.write(image);
            mainWindow.document.write('</body></html>');
            mainWindow.document.close();
        } else {
            App.toastrError(caption.EDMSWM_MSG_ERR_PRINT);
        }
    };
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('detail', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice, para) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
    $rootScope.Id = para;
    $scope.resultChoose = '';
    var warehouseName = '';
    var floorName = '';
    var lineName = '';
    var rackName = '';
    $scope.initData = function () {
        warehouseName = $rootScope.listWareHouse.find(x => x.Id === "" + $rootScope.wareHouseID).WHS_Name;
        floorName = $rootScope.listFloor.find(x => x.Id === "" + $rootScope.floorID).FloorName;
        lineName = $rootScope.listLine.find(x => x.Id === "" + $rootScope.lineID).L_Text;

        rackName = $rootScope.listRack.find(x => x.Id === "" + $rootScope.rackID).RackName;
        $scope.resultChoose = "Vị trí của hộp nằm trong " + warehouseName + " - " + floorName + " - " + lineName + " - " + rackName;
    }
    $scope.initData();
    $scope.initLoad = function () {
        $scope.model = para;
    }
    $scope.initLoad();
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});
app.controller('detailWareHouse', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice, para) {
    $scope.QR_Code = '';
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

    //Sức chứa tầng, dãy, kệ
    $scope.cntLine = 0;
    $scope.cntRack = 0;
    $scope.cntBox = 0;
    $scope.cntBoxEmty = 0;//Sức chứa còn lại

    //Lấy ra số tầng dãy kệ
    $scope.qtyFloor = 0;
    $scope.qtyLine = 0;
    $scope.qtyRack = 0;

    $scope.initData = function () {
        dataservice.getDetailWareHouse(para, function (rs) {
            rs = rs.data;

            $scope.model = rs.model;
            //Sức chứa tầng, dãy, kệ
            $scope.cntLine = rs.cntLine;
            $scope.cntRack = rs.cntRack;
            $scope.cntBox = rs.cntBox;
            $scope.cntBoxEmty = rs.cntBoxEmty;

            //Lấy ra số tầng dãy kệ
            $scope.qtyFloor = rs.qtyFloor;
            $scope.qtyLine = rs.qtyLine;
            $scope.qtyRack = rs.qtyRack;
            $scope.qtyBox = rs.qtyBox;

            dataservice.generatorQRCode($scope.model.WHS_Code, function (result) {
                result = result.data;
                $scope.QR_Code = result;
            });
        });
    }
    $scope.initData();
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});