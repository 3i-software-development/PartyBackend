var ctxfolderRepository = "/views/admin/edmsRepository";
var ctxfolderMessage = "/views/message-box";
var ctxfolderCommonSetting = "/views/admin/commonSetting";
var app = angular.module('App_ESEIM_REPOSITORY', ['App_ESEIM_DASHBOARD', 'App_ESEIM_FILE_PLUGIN', "ui.bootstrap", "ngRoute", "ngValidate",
 "datatables", "datatables.bootstrap", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', "ngJsTree",
  "treeGrid", "ui.select", "ngCookies", "pascalprecht.translate", 'ngTagsInput', 'ngFileUpload','monospaced.qrcode'])
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
    })
    .directive('fileDropzone', function () {
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
app.directive("dropzone", function () {
    return {
        restrict: "A",
        link: function (scope, elem, attrs) {
            /*elem.bind('dragover', processDragOverOrEnter);
            elem.bind('dragenter', processDragOverOrEnter);
            elem.bind('dragend', endDragOver);
            elem.bind('dragleave', endDragOver);
            elem.bind('drop', dropHandler);

            function dropHandler(angularEvent) {
                var event = angularEvent.originalEvent || angularEvent;
                var file = event.dataTransfer.files[0];
                event.preventDefault();
                scope.$eval(attrs.onFileDrop)(file);

            }
            function processDragOverOrEnter(angularEvent) {
                var event = angularEvent.originalEvent || angularEvent;
                if (event) {
                    event.preventDefault();
                }
                event.dataTransfer.effectAllowed = 'copy';
                elem.addClass('dragging');
                return false;
            }

            function endDragOver() {
                elem.removeClass('dragging');
            }*/
            elem.bind('drop', function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                var files = evt.originalEvent.dataTransfer.files;
                for (var i = 0, f; f = files[i]; i++) {
                    var reader = new FileReader();
                    /*reader.onload = (function (theFile) {
                        return function (e) {
                            console.log("drop success");
                            //scope.file = theFile;
                            scope.uploadFile(theFile);
                        };
                    })(f);*/
                    reader.onload = (function (theFile) {
                        return function (e) {
                            scope.content = e.target.result;
                            scope.uploadFile(theFile);
                        };
                    })(f);
                    reader.readAsArrayBuffer(f);
                }
            });
        }
    }
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
app.factory('dataserviceRepository', function ($http, /*$upload*/) {
    $http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    var headers = {
        "Content-Type": "application/json;odata=verbose",
        "Accept": "application/json;odata=verbose",
    }
    var submitFormUpload = function (url, data, callback) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': undefined
            },
            beforeSend: function () {
                App.blockUI({
                    target: "#modal-body",
                    boxed: true,
                    message: 'loading...'
                });
            },
            complete: function () {
                App.unblockUI("#modal-body");
            },
            data: data
        }
        $http(req).then(callback);
    };
    var submitFormUploadNew = function (url, data, callback) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': undefined
            },
            data: data,
        }
        $http(req).then(callback);
    };
    return {
        //category
        getTreeInNode: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GetTreeInNode?parentId=' + data).then(callback);
        },
        getParentCategory: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GetParentCategory', data).then(callback);
        },
        getItemCategory: function (data, callback) {
            $http.get('/Admin/EDMSRepository/GetItemCategory?id=' + data).then(callback);
        },
        insertCategory: function (data, callback) {
            $http.post('/Admin/EDMSRepository/InsertCategory', data).then(callback);
        },
        updateCategory: function (data, callback) {
            $http.post('/Admin/EDMSRepository/UpdateCategory', data).then(callback);
        },
        deleteCategory: function (data, callback) {
            $http.post('/Admin/EDMSRepository/DeleteCategory?catCode=' + data).then(callback);
        },

        //repository
        getTreeRepository: function (callback) {
            $http.post('/Admin/EDMSRepository/GetTreeRepository').then(callback);
        },
        getGoogleApiTokens: function (callback) {
            $http.post('/Admin/EDMSRepository/GetGoogleApiTokens').then(callback);
        },
        getItemRepository: function (data, callback) {
            $http.get('/Admin/EDMSRepository/GetItemRepository?reposCode=' + data, {
                beforeSend: function () {
                    App.blockUI({
                        target: "#contentMain",
                        boxed: true,
                        message: 'loading...'
                    });
                },
                complete: function () {
                    App.unblockUI("#contentMain");
                }
            }).then(callback);
        },
        insertRepository: function (data, callback) {
            $http.post('/Admin/EDMSRepository/InsertRepository', data).then(callback);
        },
        updateRepository: function (data, callback) {
            $http.post('/Admin/EDMSRepository/UpdateRepository', data).then(callback);
        },
        deleteRepository: function (data, callback) {
            $http.post('/Admin/EDMSRepository/DeleteRepository?respos=' + data).then(callback);
        },

        //file
        checkPermissionFileNoShare: function (data, callback) {
            $http.post('/Admin/EDMSRepository/CheckPermissionFileNoShare?fileCode=' + data).then(callback);
        },
        deleteFile: function (data, callback) {
            $http.post('/Admin/EDMSRepository/DeleteFile', data).then(callback);
        },
        getContract: function (callback) {
            $http.post('/Admin/EDMSRepository/GetContract').then(callback);
        },
        getFileImage: function (data, callback) {
            $http.get('/Admin/EDMSRepository/GetFileImage?id=' + data, {
                beforeSend: function () {
                    App.blockUI({
                        target: "#contentMain",
                        boxed: true,
                        message: 'loading...'
                    });
                },
                complete: function () {
                    App.unblockUI("#contentMain");
                }
            }).then(callback);
        },
        getObjectsType: function (callback) {
            $http.post('/Admin/EDMSRepository/GetObjectsType').then(callback);
        },
        getListObject: function (data, callback) {
            $http.get('/Admin/EDMSRepository/GetListObject?objectType=' + data).then(callback);
        },
        getItem: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GetItem?id=' + data).then(callback);
        },
        getItemFile: function (data, data1, data2, callback) {
            $http.get('/Admin/EDMSRepository/GetItemFile?id=' + data + '&&IsEdit=' + data1 + '&mode=' + data2).then(callback);
        },

        JtableFileWithRepository: function (data, callback) {
            $http.post('/Admin/EDMSRepository/JtableFileWithRepository', data).then(callback);
        },
        getUsers: function (callback) {
            $http.post('/Admin/EDMSRepository/GetUsers').then(callback);
        },
        createTempFile: function (data, data1, data2, callback) {
            $http.post('/Admin/EDMSRepository/CreateTempFile?Id=' + data + "&isSearch=" + data1 + "&content=" + data2).then(callback);
        },
        getSupportCategory: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GetSupportCategory?CatCode=' + data).then(callback);
        },
        getTotal: function (callback) {
            $http.get('/Admin/EDMSRepository/GetTotal').then(callback);
        },

        //File && Meta Data
        getTreeCategory: function (callback) {
            $http.post('/Admin/EDMSRepository/GetTreeCategory').then(callback);
        },
        insertFile: function (data, callback) {
            submitFormUpload('/Admin/EDMSRepository/InsertFile', data, callback);
        },
        insertDriveFileToDb: function (data, callback) {
            $http.post('/Admin/EDMSRepository/InsertDriveFileToDb', data).then(callback);
        },
        dropFile: function (data, /*file,*/ callback) {
            submitFormUploadNew('/Admin/EDMSRepository/DropFile', data, /*file,*/ callback);
        },
        getListMetaType: function (callback) {
            $http.post('/Admin/EDMSRepository/GetListMetaType').then(callback);
        },
        getListMetaGroup: function (callback) {
            $http.post('/Admin/EDMSRepository/GetListMetaGroup').then(callback);
        },
        updateMetaData: function (data1, data2, callback) {
            $http.post('/Admin/EDMSRepository/UpdateMetaData?fileId=' + data1 + '&metaDataExt=' + data2).then(callback);
        },
        getMetaData: function (data1, callback) {
            $http.post('/Admin/EDMSRepository/GetMetaData?fileId=' + data1).then(callback);
        },

        //OrderDocument & Pack
        getListRack: function (callback) {
            $http.post('/Admin/EDMSRepository/GetListRack').then(callback);
        },
        getListPack: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GetListPack?rackCode=' + data).then(callback);
        },
        insertPack: function (data, callback) {
            $http.post('/Admin/EDMSRepository/InsertPack', data).then(callback);
        },
        getItemPack: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GetItemPack?id=' + data).then(callback);
        },
        updatePack: function (data, callback) {
            $http.post('/Admin/EDMSRepository/UpdatePack', data).then(callback);
        },
        deletePack: function (data, callback) {
            $http.post('/Admin/EDMSRepository/DeletePack?id=' + data).then(callback);
        },

        //paste File
        pasteFile: function (data, callback) {
            $http.post('/Admin/EDMSRepository/PasteFile', data).then(callback);
        },

        //ShareFile
        getListUser: function (callback) {
            $http.post('/Admin/EDMSRepository/GetListUser').then(callback);
        },
        insertFileShare: function (data, callback) {
            $http.post('/Admin/EDMSRepository/InsertFileShare', data).then(callback);
        },
        getFileShare: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GetFileShare?id=' + data).then(callback);
        },
        //audio book
        getTextContentReading: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GetTextContentReading?filePath=' + data).then(callback);
        },
        getWordContentReading: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GetWordContentReading?filePath=' + data).then(callback);
        },
        getExcelContentReading: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GetExcelContentReading?filePath=' + data).then(callback);
        },
        getPdfContentReading: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GetPdfContentReading?filePath=' + data).then(callback);
        },
        getPptxContentReading: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GetPptxContentReading?filePath=' + data).then(callback);
        },
        getEpubContentReading: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GetEpubContentReading?filePath=' + data).then(callback);
        },
        createTempFileAudioBook: function (data, callback) {
            $http.post('/MobileLogin/CreateTempFile?Id=' + data).then(callback);
        },
        deleteFileTemp: function (data, callback) {
            $http.post('/Admin/EDMSRepository/DeleteFileTemp?filePath=' + data).then(callback);
        },
        generateAudioBookUrls: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GenerateAudioBookUrls', data).then(callback);
        },

        //Commonsetting
        insertCommonSetting: function (data, callback) {
            $http.post('/Admin/CommonSetting/Insert/', data).then(callback);
        },
        updateCommonSetting: function (data, callback) {
            $http.post('/Admin/CommonSetting/Update/', data).then(callback);
        },
        deleteCommonSetting: function (data, callback) {
            $http.post('/Admin/CommonSetting/Delete', data).then(callback);
        },
        getDataTypeCommonSetting: function (callback) {
            $http.get('/Admin/CommonSetting/GetDataType').then(callback);
        },

        //Records Pack
        getTreeRecordsPack: function (callback) {
            $http.post('/Admin/PackManager/GetTreeRecordsPack').then(callback);
        },
        getPackOfFile: function (data, callback) {
            $http.post('/Admin/PackManager/GetPackOfFile?fileCode=' + data).then(callback);
        },
        fileToPack: function (data, callback) {
            $http.post('/Admin/PackManager/FileToPack', data).then(callback);
        },
        getInfoRecordsPack: function (data, callback) {
            $http.post('/Admin/PackManager/GetInfoRecordsPack?packCode=' + data).then(callback);
        },
        getTreeZone: function (callback) {
            $http.post('/Admin/EDMSRepository/GetTreeZone').then(callback);
        },
        arrangeRecordsPack: function (data, callback) {
            $http.post('/Admin/PackManager/ArrangeRecordsPack', data).then(callback);
        },
        autoUpdateHierarchy: function (callback) {
            $http.post('/Admin/PackManager/AutoUpdateHierarchy').then(callback);
        },
        getZoneFileInPack: function (data, callback) {
            $http.post('/Admin/PackManager/GetZoneFileInPack?packCode=' + data).then(callback);
        },
        getInfoZone: function (data, callback) {
            $http.post('/Admin/ZoneManager/GetInfoZone?zoneCode=' + data).then(callback);
        },
    };
});
app.controller('Ctrl_ESEIM_REPOSITORY', function ($scope, $rootScope, $filter, $location, $cookies, $translate) {
    $rootScope.go = function (path) {
        $location.path(path); return false;
    };
    var culture = $cookies.get('_CULTURE') || 'vi-VN';
    $translate.use(culture);
    $rootScope.IsTranslate = false;
    $rootScope.$on('$translateChangeSuccess', function () {
        caption = caption[culture] ? caption[culture] : caption;
        $rootScope.IsTranslate = true;
        $.extend($.validator.messages, {
            min: caption.COM_VALIDATE_VALUE_MIN,
        });
        $rootScope.validationOptionsCategory = {
            rules: {
                CatCode: {
                    required: true,
                    regx: /^[a-zA-Z0-9_äöüÄÖÜ]*$/,
                },
                CatName: {
                    required: true
                }
            },
            messages: {
                CatCode: {
                    required: caption.EDMSR_VALIDATE_RQ_CODE_CATE,
                    regx: caption.COM_VALIDATE_ITEM_CODE.replace("{0}", caption.EDMSR_CURD_LBL_CATEGORY_CODE),
                },
                CatName: {
                    required: caption.EDMSR_VALIDATE_RQ_CAT_NAME
                }
            }
        }
        $rootScope.validationOptionsRepository = {
            rules: {
                ReposName: {
                    required: true
                },
                Server: {
                    required: true
                },
                Account: {
                    required: true
                },
                PassWord: {
                    required: true
                },
            },
            messages: {
                ReposName: {
                    required: caption.EDMSR_VALIDATE_NAME_SERVER
                },
                Server: {
                    required: caption.EDMSR_VALIDATE_SERVER
                },
                Account: {
                    required: caption.EDMSR_VALIDATE_USER
                },
                PassWord: {
                    required: caption.EDMSR_VALIDATE_PASS
                },
            }
        }
        $rootScope.checkData = function (data) {
            var partternCode = /^[a-zA-Z0-9_äöüÄÖÜ]*$/;
            var partternName = /^(^[ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z.0-9\s]+$)|^(^[0-9]+[ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z.\s][ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z.0-9\s]*$)/
            //var partternDescription = /^[ĂăĐđĨĩŨũƠơƯưẠ-ỹa-zA-Z0-9]*[^Đđ!@#$%^&*<>?]*$/; //Có thể null, và có chứa được khoảng trắng
            //var partternNumber = /^\d+$/;
            //var partternPremiumTerm = /^\d+(\+)?/
            //var partternFloat = /^-?\d*(\.\d+)?$/;
            var mess = { Status: false, Title: "" }
            if (!partternCode.test(data.ReposCode)) {
                mess.Status = true;
                mess.Title = mess.Title.concat(" - ", caption.EDMSR_VALIDATE_REPOS_CODE, "<br/>");
            }
            return mess;
        }
    });
    $scope.FileType = [{
        Code: 1,
        Name: 'Ảnh',
    }, {
        Code: 2,
        Name: 'Word'
    }, {
        Code: 3,
        Name: 'Excel'
    }, {
        Code: 4,
        Name: 'Powerpoint'
    }, {
        Code: 5,
        Name: 'Pdf'
    }, {
        Code: 6,
        Name: 'Tệp tin'
    }];
    $rootScope.RepoType = [{
        Code: "DRIVER",
        Name: "Google Drive",
    }, {
        Code: "SERVER",
        Name: "FPT Server",
    },];
    $rootScope.listUnit = [{
        Code: '1',
        Name: 'Tập'
    }, {
        Code: '2',
        Name: 'Cuốn'
    }, {
        Code: '3',
        Name: 'Thùng'
    }];
});
app.config(function ($routeProvider, $validatorProvider, $httpProvider, $translateProvider) {
    $translateProvider.useUrlLoader('/Admin/EDMSRepository/Translation');
    caption = $translateProvider.translations();
    $routeProvider
        .when('/', {
            templateUrl: ctxfolderRepository + '/index.html',
            controller: 'index'
        })
    //.when('/pdfViewer', {
    //    templateUrl: ctxfolderRepository + '/pdfViewer.html',
    //    controller: 'pdfViewer'
    //});
    $validatorProvider.setDefaults({
        errorElement: 'span',
        errorClass: 'help-block',
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
app.controller('index', function ($scope, $rootScope, $confirm, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceRepository, $filter, $window, Upload) {
    $rootScope.isAllData = isAllData;
    var vm = $scope;
    //$scope.objects = [];
    //$scope.objectDetails = [];
    //$scope.users = [];
    //progress obj = { name: 'file X', uuid: '', progress: '50%', style: { 'width': '50%' } }
    $rootScope.progress = [];
    $scope.progressModal = {};
    $scope.isProgressModelOpen = false;
    $scope.model = {
        ObjectType: 'All',
        ObjectCode: '',
        FromDate: '',
        ToDate: '',
        Name: '',
        FileType: '',
        Content: '',
        Tags: '',
        ListRepository: [],
        UserUpload: ''
        //ObjectDetailCode: '',
    };
    $scope.recentFile = false;
    $scope.currentPath = "";
    $scope.totalFile = 0;
    $scope.totalCapacity = "0M";
    $scope.isSearchContent = false;
    $scope.content = "";
    $scope.treeData = [];
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/EDMSRepository/JTableFile",
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
                d.ObjectType = $scope.model.ObjectType;
                d.ObjectCode = $scope.model.ObjectCode;
                d.FromDate = $scope.model.FromDate;
                d.ToDate = $scope.model.ToDate;
                d.Name = $scope.model.Name;
                d.FileType = $scope.model.FileType;
                d.Content = $scope.model.Content;
                d.Tags = $scope.model.Tags;
                d.UserUpload = $scope.model.UserUpload;
                //d.TypeTab = type;
                d.ListRepository = $scope.model.ListRepository;
                d.RecentFile = $scope.recentFile;
                //d.ObjectType = $scope.model.ObjectType;
                //d.ContractCode = null;
                //d.CustomerCode = null;
                //d.SupplierCode = null;
                //d.ProjectCode = null;
                //if ($scope.model.ObjectCode == "FILE_OBJ_CONTRACT")
                //    d.ContractCode = $scope.model.ObjectDetailCode;
                //if ($scope.model.ObjectCode == "FILE_OBJ_CUSTOMMER")
                //    d.CustomerCode = $scope.model.ObjectDetailCode;
                //if ($scope.model.ObjectCode == "FILE_OBJ_SUPPLIER")
                //    d.SupplierCode = $scope.model.ObjectDetailCode;
                //if ($scope.model.ObjectCode == "FILE_OBJ_PROJECT")
                //    d.ProjectCode = $scope.model.ObjectDetailCode;
                if ($scope.model.Content != null && $scope.model.Content != "") {
                    $scope.isSearchContent = true;
                }
                else
                    $scope.isSearchContent = false;
                $scope.content = $scope.model.Content;
            },
            complete: function (json) {
                App.unblockUI("#contentMain");
                heightTableViewportManual(220, "#tblData");
                //var listdata = $('#tblData').DataTable().data();
                //if (listdata.length > 0) {
                //    var item = listdata[0];
                //    var capacity = item.FileSize;
                //    //$scope.totalCapacity = (capacity / 1024000).toFixed(0) + "MB";
                //    var kb = 1024;
                //    var mb = 1024 * kb;
                //    var gb = 1024 * mb;
                //    var dt = capacity / gb;
                //    if (capacity / gb > 1) {
                //        $scope.totalCapacity = Math.floor(capacity / gb) + " GB";
                //    }
                //    else if (capacity / mb > 1) {
                //        $scope.totalCapacity = Math.floor(capacity / mb) + " MB";
                //    }
                //    else if (capacity / kb > 1) {
                //        $scope.totalCapacity = Math.floor(capacity / kb) + " KB";
                //    }
                //    else {
                //        $scope.totalCapacity = capacity + " Byte";
                //    }
                //}
                //else
                //    $scope.totalCapacity = "0 byte";

                //var files = [];
                //for (var indx = 0; indx < listdata.length; ++indx) {
                //    var item = listdata[indx];
                //    console.log(item.Url);
                //    var file = document.getElementById('id-' + item.FileID);
                //    file.downloadUrl = item.Url;
                //    file.downloadName = item.FileName;
                //    file.downloadMimeType = item.MimeType;
                //    file.addEventListener("dragstart", function (evt) {
                //        //console.log('application/ pdf:HTML5CheatSheet.pdf:https://facco.s-work.vn/' + this.downloadUrl + '');
                //        var url = window.location.origin + "/" + window.encodeURIComponent(this.downloadUrl);
                //        evt.dataTransfer.setData("DownloadURL", this.downloadMimeType + ':' + this.downloadName + ':' + url);
                //        console.log(this.downloadMimeType + ':' + this.downloadName + ':' + url);
                //        //var a = document.createElement("a");
                //        //a.href = this.downloadUrl;
                //        //a.setAttribute("download", this.downloadName);
                //        //a.click();
                //        //return false;
                //    }, false);
                //    files.push(file);
                //}
                //$scope.totalFile = json.responseJSON.recordsTotal;
                //$scope.$apply();
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(9)
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
            $compile(angular.element(row).attr('context-menu', 'contextMenu'))(contextScope);

            $compile(angular.element(row)
                .attr('context-menu', 'contextMenu')
                .attr('id', 'id-' + data.FileID)
                .attr('draggable', true)
                .attr('data-downloadurl', 'application/pdf:HTML5CheatSheet.pdf:http://www.thecssninja.com/demo/gmail_dragout/html5-cheat-sheet.pdf')
            )(contextScope);
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("FileID").withTitle(titleHtml).notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full.FileID] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.FileID + ']" ng-click="toggleOne(selected)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileName').withOption('sClass', 'nowrap').withTitle('{{"EDMSR_LIST_COL_FILE_NAME" |translate}}').renderWith(function (data, type, full) {
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
        var downloadSearch = "/ &nbsp;<a ng-click='downloadSearch(" + full.Id + ")'> Search_" + data + "</a>\n";

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

            fileSize = '<div><span class="badge-customer badge-customer-success">' + fileSize + '</span>';
        }

        var isScan = '';
        if (full.FileType != "Y") {
            isScan = '<div class="pt5"><span class="">&bull;Bản cứng: ' + '<span class="text-danger">' + full.FileType + '</span></span></div>';
        }
        else {
            isScan = '<div class="pt5"><span class="">&bull;Bản cứng: ' + '<span class="text-green">' + full.FileType + '</span></span>' + 
                '<a ng-click="recordPack(\'' + full.FileCode + '\', \'' + full.FileType + '\')" target="_blank" style="width: 25px;height: 25px;padding: 0px;float: right;" title="{{&quot; Đóng gói &quot; | translate}} - ' + full.FileName + '"><i class="fas fa-cubes fs15 pt5 text-green"></i></a></div>';
        }
        var hierachyPack = "";
        if (full.PackHierarchy != "Chưa đóng gói") {
            if (full.FileType == "Y") {
                hierachyPack = '<div class="pt10"><span class="">&bull;Đóng gói: ' + '<span class="text-green">' + full.PackHierarchy +
                    '</span></span><a ng-click="arrangeFile(\'' + full.FileCode + '\', \'' + full.FileType + '\', \'' + full.PackHierarchy + '\')" target="_blank" style="width: 25px;height: 25px;padding: 0px;float: right;" title="{{&quot; Xếp lại &quot; | translate}} - ' + full.FileName + '"><i class="fas fa-map-marker fs15 pt5 text-green"></i></a></div>';
            }
        }
        else {
            if (full.FileType == "Y") {
                hierachyPack = '<div class="pt10"><span class="">&bull;Đóng gói: ' + '<span class="text-danger">' + full.PackHierarchy +
                    '</span></span><a ng-click="arrangeFile(\'' + full.FileCode + '\', \'' + full.FileType + '\', \'' + full.PackHierarchy + '\')" target="_blank" style="width: 25px;height: 25px;padding: 0px;float: right;" title="{{&quot; Xếp lại &quot; | translate}} - ' + full.FileName + '"><i class="fas fa-map-marker fs15 pt5 text-green"></i></a></div>';
            }
        }

        var hirarchyZone = ""
        if (full.ZoneHierarchy != "Chưa xếp") {
            if (full.FileType == "Y") {
                hirarchyZone = '<div class="pt10"><span class="">&bull;Vị trí: ' + '<span class="text-green">' + full.ZoneHierarchy +
                    '</span></span>  <a ng-click="locateFile(\'' + full.PackHierarchy + '\', \'' + full.FileType + '\', \'' + full.ZoneHierarchy + '\')" target="_blank" style="width: 25px;height: 25px;padding: 0px;float: right;" title="{{&quot; Tìm bản cứng &quot; | translate}} - ' + full.FileName + '"><i class="fa fa-sitemap fs15 pt5 text-green"></i></a></div>';
            }
        }
        else {
            if (full.FileType == "Y") {
                hirarchyZone = '<div class="pt10"><span class="">&bull;Vị trí: ' + '<span class="text-danger">' + full.ZoneHierarchy +
                    '</span></span>  <a ng-click="locateFile(\'' + full.PackHierarchy + '\', \'' + full.FileType + '\', \'' + full.ZoneHierarchy + '\')" target="_blank" style="width: 25px;height: 25px;padding: 0px;float: right;" title="{{&quot; Tìm bản cứng &quot; | translate}} - ' + full.FileName + '"><i class="fa fa-sitemap fs15 pt5 text-green"></i></a></div>';
            }
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
                    if ($scope.isSearchContent)
                        file = file + downloadSearch;
                    var content = "<div>" + full.Content + "</div>";
                    return icon + file + content + updateTime + fileSize + isScan + hierachyPack + hirarchyZone;
                } else {
                    return icon + '<a ng-click="viewExcel(' + full.Id + ', 1' + ')" >' + data + '</a>' + updateTime + fileSize + isScan + hierachyPack + hirarchyZone;
                }
            }
            else if (word.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
                typefile = 'Syncfusion';
                var file = '<a ng-click="viewWord(' + full.Id + ', 1' + ')" >' + data + '</a>';
                if (full.Content != undefined) {
                    if ($scope.isSearchContent)
                        file = file + downloadSearch;
                    var content = "<div>" + full.Content + "</div>";
                    return icon + file + content + updateTime + fileSize;
                } else {
                    return icon + '<a ng-click="viewWord(' + full.Id + ', 1' + ')" >' + data + '</a>' + updateTime + fileSize + isScan + hierachyPack + hirarchyZone;
                }
            }
            else if (pdf.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
                typefile = 'pdf';
                var file = '<a ng-click="viewPDF(' + full.Id + ', 1' + ')">' + data + '</a>';
                if (full.Content != undefined) {
                    if ($scope.isSearchContent)
                        file = file + downloadSearch;
                    var content = "<div>" + full.Content + "</div>";
                    return icon + file + content + updateTime + isScan + hierachyPack + hirarchyZone;
                } else {
                    return icon + '<a ng-click="viewPDF(' + full.Id + ', 1' + ')">' + data + '</a>' + updateTime + fileSize + isScan + hierachyPack + hirarchyZone;
                }
            }
            else {
                return icon + '<a ng-click="getObjectFile(0)">' + data + '</a>' + updateTime + fileSize + isScan + hierachyPack + hirarchyZone;
            }
            if (full.Content != undefined) {
                var file = icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>\n";
                if ($scope.isSearchContent)
                    file = file + downloadSearch;
                var content = "<div>" + full.Content + "</div>";

                return icon + file + content + updateTime + fileSize + isScan + hierachyPack + hirarchyZone;
            } else {
                return icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>" + updateTime + fileSize + isScan + hierachyPack + hirarchyZone;
            }
        }
        else if (document.indexOf(full.FileTypePhysic.toUpperCase()) != -1) {
            if (full.Content != undefined) {
                var file = icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>\n";
                var content = "<div>" + full.Content + "</div>";
                return file + content + updateTime + fileSize + isScan + hierachyPack + hirarchyZone;
            } else {
                return icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>" + updateTime + fileSize + isScan + hierachyPack + hirarchyZone;
            }
        }
        else if (image.indexOf(full.FileTypePhysic.toUpperCase()) != -1) {
            if (full.Content != undefined) {
                var file = icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>\n";
                var content = "<div>" + full.Content + "</div>";
                return file + content + updateTime + fileSize + isScan + hierachyPack + hirarchyZone;
            } else {
                return icon + "&nbsp;<a ng-click='view(" + full.Id + ")'>" + data + "</a>" + updateTime + fileSize + isScan + hierachyPack + hirarchyZone;
            }
        }
        else {
            return data + updateTime + fileSize + isScan + hierachyPack + hirarchyZone;
        }
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ReposName').withOption('sClass', '').withTitle('{{"EDMSR_LIST_COL_SERVER" | translate}}').renderWith(function (data, type, full) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CatName').withOption('sClass', 'dataTable-w80').withTitle('{{"EDMSR_LBL_PATH" | translate}}').renderWith(function (data, type, full) {
        var currentPath = "";
        if (full.CloudFileId != null && full.CloudFileId != "") {
            currentPath = full.CatName;
        }
        else {
            currentPath = full.CatName;
        }
        return currentPath;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedTime').withOption('sClass', 'dataTable-createdDate').withTitle('{{"EDMSR_LIST_COL_CREATED_TIME" | translate}}').renderWith(function (data, type, full) {
        if (data) {
            data = moment(data).format("DD/MM/YYYY HH:mm");
        }
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('').notSortable().withOption('sClass', 'nowrap dataTable-w80 text-center').withTitle('{{"COM_LIST_COL_NOTE" | translate}}').renderWith(function (data, type, full) {
        return '<button title="{{&quot; EDMSR_TAB_FILE_CURD_LBL_WHS_NOTE &quot; | translate}}" ng-click="extension(' + full.FileID + ')" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-info-circle"></i></button>';
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileID').withOption('sClass', 'nowrap dataTable-w80 text-center').withTitle('{{"EDMSR_BTN_EDIT_FILE" | translate }}').renderWith(function (data, type, full) {
        var excel = ['.XLSM', '.XLSX', '.XLS'];
        var document = ['.TXT'];
        var word = ['.DOCX', '.DOC'];
        var pdf = ['.PDF'];
        var powerPoint = ['.PPS', '.PPTX', '.PPT'];
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        var icon = "";
        var typefile = "#";
        if (excel.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            typefile = 'excel';
            return '<a ng-click="tabFileHistory(' + full.FileID + ')"  title="{{&quot; EDMSR_TITLE_FILE_EDIT_HISTORY &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline red"><i class="fa fa-history pt5"></i></a>' +
                '<a ng-click="viewExcel(' + full.Id + ', 2' + ')" title="{{&quot;EDMSR_BTN_EDIT_FILE &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit pt5"></i></a>';
        } else if (word.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            typefile = 'Syncfusion';
            return '<a ng-click="tabFileHistory(' + full.FileID + ')"  title="{{&quot; EDMSR_TITLE_FILE_EDIT_HISTORY &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline red"><i class="fa fa-history pt5"></i></a>' +
                '<a ng-click="viewWord(' + full.Id + ', 2' + ')" title="{{&quot; EDMSR_BTN_EDIT_FILE &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit pt5"></i></a>';
        } else if (pdf.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            typefile = 'pdf';
            return '<a ng-click="tabFileHistory(' + full.FileID + ')"  title="{{&quot; EDMSR_TITLE_FILE_EDIT_HISTORY &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline red"><i class="fa fa-history pt5"></i></a>' +
                '<a ng-click="viewPDF(' + full.Id + ', 2' + ')" title="{{&quot; EDMSR_BTN_EDIT_FILE &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit pt5"></i></a>';
        } else if (document.indexOf(full.FileTypePhysic.toUpperCase()) !== -1 || image.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            return '<a ng-click="tabFileHistory(0)"  title="{{&quot; EDMSR_TITLE_FILE_EDIT_HISTORY &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline red"><i class="fa fa-history pt5"></i></a>' +
                '<a ng-click="view(' + full.Id + ')" title="{{&quot; EDMSR_BTN_EDIT_FILE &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit pt5"></i></a>';
        } else {
            return '<a ng-click="tabFileHistory(0)"  title="{{&quot; EDMSR_TITLE_FILE_EDIT_HISTORY &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline red"><i class="fa fa-history pt5"></i></a>' +
                '<a ng-click="getObjectFile(' + full.FileID + ')" title="{{&quot; EDMSR_BTN_EDIT_FILE &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit pt5"></i></a>';
        }
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').notSortable().withOption('sClass', 'nowrap dataTable-w80 text-center').withTitle('{{"EDMSR_LIST_COL_ACTION" | translate}}').renderWith(function (data, type, full) {
        var typeAudioBook = getType(full.FileTypePhysic.toLowerCase(), full.MimeType.toLowerCase())
        if (typeAudioBook != 'image' && typeAudioBook != 'video' && typeAudioBook != 'audio' && typeAudioBook != 'zip' && typeAudioBook != 'other') {
            var buttonGen = '<a ng-click="generateAudioBookUrls(' + full.FileID + ',' + full.Id + ',\'' + typeAudioBook + '\')"  style="width: 25px; height: 25px; padding: 0px" title="Tạo file ebook - ' + full.FileName + '" class="btn btn-icon-only btn-circle btn-outline green"><i class="fa fa-file-audio pt5"></i></a>';
        }
        else {
            buttonGen = '';
        }
        return buttonGen + '<a ng-click="share(' + full.Id + ')" style="width: 25px; height: 25px; padding: 0px" title="{{&quot; EDMSR_SHARE &quot; | translate}} - ' + full.FileName + '" class="btn btn-icon-only btn-circle btn-outline blue "><i class="fa fa-share-alt pt5"></i></a>' +
            '<a ng-click="download(' + full.Id + ')" target="_blank" style="width: 25px; height: 25px; padding: 0px" title="{{&quot; EDMSR_DOWNLOAD &quot; | translate}} - ' + full.FileName + '" class="btn btn-icon-only btn-circle btn-outline green " download><i class="fa fa-download pt5"></i></a>' +
            '<button title="{{&quot; EDMSR_DELETE &quot; | translate}}" ng-click="deleteFile(' + full.Id + ')" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline red"><i class="fa fa-trash"></i></button>';
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

    $scope.fileManage = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + '/fileManage.html',
            controller: 'fileManage',
            backdrop: 'static',
            size: '60'
        });
        modalInstance.result.then(function (d) {

        }, function () {
        });
    }

    $scope.initData = function () {
        //var date = new Date();
        //var priorDate = new Date().setDate(date.getDate() - 30)
        //$scope.model.ToDate = $filter('date')((date), 'dd/MM/yyyy')
        //$scope.model.FromDate = $filter('date')((priorDate), 'dd/MM/yyyy')
        dataserviceRepository.getTotal(function (rs) {
            rs = rs.data;
            $scope.totalFile = rs.TotalFile;
            $scope.totalSize = rs.TotalSize;
        })
    }

    $scope.initData();

    $scope.initDataTemp = function () {
        $scope.dataTemp = {
            action: '',
            data: {}
        };
    };

    $scope.initDataTemp();

    $scope.recentFileLoad = function () {
        $scope.recentFile = true;
        $scope.reload();
    }

    $scope.addFile = function () {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + '/addFile.html',
            controller: 'addFile',
            backdrop: 'static',
            size: '65',
            resolve: {
                para: function () {
                    return $scope.model.ListRepository;
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    }

    $scope.deleteFile = function (id) {
        var userModel = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }
        dataserviceRepository.checkPermissionFileNoShare(userModel.FileCode, function (rs) {
            rs = rs.data;
            if (rs == true) {
                var modalInstance = $uibModal.open({
                    templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
                    windowClass: "message-center",
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = caption.EDMSR_MSG_DELETE_FILE;
                        $scope.ok = function () {
                            dataserviceRepository.deleteFile(id, function (rs) {
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
                    $scope.reload();
                }, function () {
                });
            }
            else {
                App.toastrError(caption.COM_MSG_NO_PERMISSION);
            }
        })
    }

    $scope.viewFile = function (id) {

        var userModel = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].FileID == id) {
                userModel = listdata[i];
                break;
            }
        }
        var url = window.encodeURIComponent(userModel.Url);
        console.log(window.location.origin + '' + url);
        //window.open(url);
        window.open('https://docs.google.com/gview?url=' + window.location.origin + '' + url + ' & embedded=true', '_blank');
    }

    $scope.viewImage = function (id) {
        var userModel = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }
        toDataUrl(window.location.origin + userModel.Url, function (myBase64) {
            var modalInstance = $uibModal.open({
                templateUrl: ctxfolderRepository + '/imageViewer.html',
                controller: 'imageViewerFile',
                backdrop: 'static',
                size: '40',
                resolve: {
                    para: function () {
                        return myBase64;
                    }
                }
            });
            modalInstance.result.then(function (d) {
            }, function () {
            });
        });
    }

    $scope.view_old = function (id) {
        var isImage = false;
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        var userModel = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }
        if (userModel.SizeOfFile < 20971520) {
            if (image.indexOf(userModel.FileTypePhysic.toUpperCase()) !== -1) {
                isImage = true;
                $scope.openViewer(rs.Object, isImage);
            }
            var dt = null;
            for (var i = 0; i < $scope.treeData.length; ++i) {
                var item = $scope.treeData[i];
                if (item.id == userModel.Category) {
                    dt = item;
                    break;
                }
            }
            if (userModel.CloudFileId != null && userModel.CloudFileId != "") {
                if (dt != null)
                    $scope.currentPath = "Google Driver/" + dt.text + "/" + userModel.FolderName + "/" + userModel.FileName;
                else
                    $scope.currentPath = "Google Driver/" + userModel.FileName;
                //SHOW LÊN MÀN HÌNH LUÔN
                // window.open(" https://drive.google.com/file/d/" + userModel.CloudFileId + "/view", "_blank");
                //$scope.openViewer("https://drive.google.com/file/d/"+userModel.CloudFileId + "/view");3
                dataserviceRepository.createTempFile(id, $scope.isSearchContent, $scope.content, function (rs) {
                    rs = rs.data;
                    rs.Object = encodeURI(rs.Object);
                    if (rs.Error == false) {
                        if (isImage == false)
                            $scope.openViewer("https://docs.google.com/gview?url=" + window.location.origin + '/' + rs.Object + '&embedded=true', isImage);
                        else
                            $scope.openViewer(rs.Object, isImage);
                        //window.open('https://docs.google.com/gview?url=' + window.location.origin + '/' + rs.Object + '&embedded=true', '_blank');
                    }
                    else {

                    }
                });
            }
            else {
                if (dt != null)
                    $scope.currentPath = userModel.ServerAddress + "/" + dt.text + "" + userModel.Url;
                else
                    $scope.currentPath = userModel.ServerAddress + "/" + userModel.Url;
                dataserviceRepository.createTempFile(id, $scope.isSearchContent, $scope.content, function (rs) {
                    rs = rs.data;
                    rs.Object = encodeURI(rs.Object);
                    if (rs.Error == false) {
                        if (isImage == false)
                            $scope.openViewer("https://docs.google.com/gview?url=" + window.location.origin + '/' + rs.Object + '&embedded=true', isImage);
                        else
                            $scope.openViewer(rs.Object, isImage);
                        //window.open('https://docs.google.com/gview?url=' + window.location.origin + '/' + rs.Object + '&embedded=true', '_blank');
                    }
                    else {

                    }
                });
            }
        } else {
            App.toastrError(caption.EDMSR_MSG_FILE_SIZE_LIMIT_EDIT);
        }

    }

    $scope.openViewer = function (url, isImage) {
        var data = {};
        data.url = url;
        data.isImage = isImage;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + '/viewer.html',
            controller: 'viewer',
            backdrop: 'false',
            size: '60',
            resolve: {
                para: function () {
                    return data;
                }
            }
        });
    }

    $scope.addCategory = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + '/addCategory.html',
            controller: 'addCategory',
            backdrop: 'static',
            size: '80'
        });
        modalInstance.result.then(function (d) {
            $('#treeDiv').jstree(true).refresh();
            setTimeout(function () {
                $scope.readyCB();
            }, 200);
        }, function () {
        });
    }

    $scope.editCategory = function () {
        if ((isAllData !== 'True')) {
            return App.toastrError('Bạn không có quyền được sửa danh mục');
        }

        var listNoteSelect = $scope.treeInstance.jstree(true).get_checked(true);
        if (listNoteSelect.length == 0) {
            App.toastrError(caption.EDMSR_MSG_SELECT_CATEGORIES);
        } else if (listNoteSelect.length > 1) {
            App.toastrError(caption.EDMSR_MSG_SELECT_A_REPOSITORY);
        } else {
            dataserviceRepository.getItemCategory(listNoteSelect[0].original.catId, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: ctxfolderRepository + '/editCategory.html',
                        controller: 'editCategory',
                        backdrop: 'static',
                        size: '80',
                        resolve: {
                            para: function () {
                                return rs.Object;
                            }
                        }
                    });
                    modalInstance.result.then(function (d) {
                        $('#treeDiv').jstree(true).refresh();
                        setTimeout(function () {
                            $scope.readyCB();
                        }, 200);
                    }, function () {
                    });
                }
            })
        }
    }

    $scope.deleteCategory = function () {
        var listSelect = [];
        var listNoteSelect = $scope.treeInstance.jstree(true).get_checked(true);
        for (var i = 0; i < listNoteSelect.length; i++) {
            listSelect.push(listNoteSelect[i].id);
        }
        if (listSelect.length == 0) {
            App.toastrError(caption.EDMSR_MSG_SELECT_CATEGORIES);
        } else if (listSelect.length > 1) {
            App.toastrError(caption.EDMSR_MSG_SELECT_A_CATEGORIES);
        } else {
            var modalInstance = $uibModal.open({
                templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
                windowClass: "message-center",
                resolve: {
                    para: function () {
                        return listSelect[0];
                    }
                },
                controller: function ($scope, $uibModalInstance, para) {
                    $scope.message = caption.EDMSR_MSG_DELETE_CATEGORIES;
                    $scope.ok = function () {
                        dataserviceRepository.deleteCategory(para, function (rs) {
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
                $('#treeDiv').jstree(true).refresh();
                setTimeout(function () {
                    $scope.readyCB();
                    $scope.reload();
                }, 200);
            }, function () {
            });
        }
    }

    $scope.getObjectFile = function (id) {
        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            dataserviceRepository.getItemFile(id, true, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                var object = rs.Object;
                if (object != null && object.Type == "DRIVER") {
                    console.log(object.Link);
                    $window.open(object.Link, '_blank');
                } else {
                    return null;
                }
            });
        }
    };

    $scope.viewExcel = function (id, mode) {
        var userModel = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }
        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            if (userModel.SizeOfFile < 20971520) {
                dataserviceRepository.checkPermissionFileNoShare(userModel.FileCode, function (rs) {
                    rs = rs.data;
                    if (rs == true) {
                        dataserviceRepository.getItemFile(id, true, mode, function (rs) {
                            rs = rs.data;
                            if (rs.Error) {
                                if (rs.ID === -1) {
                                    App.toastrError(rs.Title);
                                    var object = rs.Object;
                                    if (object != null && object.Type == "DRIVER") {
                                        $window.open(object.Link, '_blank');
                                    } else {
                                        setTimeout(function () {
                                            window.open('/Admin/Excel#', '_blank');
                                        }, 2000);
                                    }
                                } else {
                                    App.toastrError(rs.Title);
                                }
                                return null;
                            } else {
                                var object = rs.Object;
                                if (object != null && object.Type == "DRIVER") {
                                    $window.open(object.Link, '_blank');
                                } else {
                                    window.open('/Admin/Excel#', '_blank');
                                }
                            }
                        });
                    }
                    else {
                        App.toastrError(caption.COM_MSG_NO_PERMISSION);
                    }
                })
            } else {
                App.toastrError(caption.EDMSR_MSG_FILE_SIZE_LIMIT_EDIT);
            }

        }
    };

    $scope.viewWord = function (id, mode) {
        var userModel = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }

        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            if (userModel.SizeOfFile < 20971520) {
                dataserviceRepository.checkPermissionFileNoShare(userModel.FileCode, function (rs) {
                    rs = rs.data;
                    if (rs == true) {
                        dataserviceRepository.getItemFile(id, true, mode, function (rs) {
                            rs = rs.data;
                            if (rs.Error) {
                                if (rs.ID === -1) {
                                    App.toastrError(rs.Title);
                                    var object = rs.Object;
                                    if (object != null && object.Type == "DRIVER") {
                                        console.log(object.Link);
                                        $window.open(object.Link, '_blank');
                                    } else {
                                        setTimeout(function () {
                                            window.open('/Admin/Docman#', '_blank');
                                        }, 2000);
                                    }
                                } else {
                                    App.toastrError(rs.Title);
                                }
                                return null;
                            } else {
                                var object = rs.Object;
                                if (object != null && object.Type == "DRIVER") {
                                    $window.open(object.Link, '_blank');
                                } else {
                                    window.open('/Admin/Docman#', '_blank');
                                }
                            }
                        });
                    }
                    else {
                        App.toastrError(caption.COM_MSG_NO_PERMISSION);
                    }
                })
            } else {
                App.toastrError(caption.EDMSR_MSG_FILE_SIZE_LIMIT_EDIT);
            }
        }
    };

    $scope.viewPDF = function (id, mode) {
        var userModel = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }
        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            if (userModel.SizeOfFile < 20971520) {
                dataserviceRepository.checkPermissionFileNoShare(userModel.FileCode, function (rs) {
                    rs = rs.data;
                    if (rs == true) {
                        dataserviceRepository.getItemFile(id, true, mode, function (rs) {
                            rs = rs.data;
                            if (rs.Error) {
                                if (rs.ID === -1) {
                                    App.toastrError(rs.Title);
                                    var object = rs.Object;
                                    if (object != null && object.Type == "DRIVER") {
                                        console.log(object.Link);
                                        $window.open(object.Link, '_blank');
                                    } else {
                                        setTimeout(function () {
                                            window.open('/Admin/PDF#', '_blank');
                                        }, 2000);
                                    }
                                } else {
                                    App.toastrError(rs.Title);
                                }
                                return null;
                            } else {
                                var object = rs.Object;
                                if (object != null && object.Type == "DRIVER") {
                                    $window.open(object.Link, '_blank');
                                } else {
                                    window.open('/Admin/PDF#', '_blank');
                                }
                            }
                        });
                    }
                    else {
                        App.toastrError(caption.COM_MSG_NO_PERMISSION);
                    }
                })
            } else {
                App.toastrError(caption.EDMSR_MSG_FILE_SIZE_LIMIT_EDIT);
            }
        }
    };

    $scope.view = function (id) {

        var isImage = false;
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        var userModel = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }
        if (image.indexOf(userModel.FileTypePhysic.toUpperCase()) !== -1) {
            isImage = true;
        }
        var dt = null;
        for (var i = 0; i < $scope.treeData.length; ++i) {
            var item = $scope.treeData[i];
            if (item.id == userModel.Category) {
                dt = item;
                break;
            }
        }
        if (userModel.CloudFileId != null && userModel.CloudFileId != "") {
            if (dt != null)
                $scope.currentPath = "Google Driver/" + dt.text + "/" + userModel.FolderName + "/" + userModel.FileName;
            else
                $scope.currentPath = "Google Driver/" + userModel.FileName;
            //SHOW LÊN MÀN HÌNH LUÔN
            // window.open(" https://drive.google.com/file/d/" + userModel.CloudFileId + "/view", "_blank");
            //$scope.openViewer("https://drive.google.com/file/d/"+userModel.CloudFileId + "/view");3
            dataserviceRepository.checkPermissionFileNoShare(userModel.FileCode, function (rs) {
                rs = rs.data;
                if (rs == true) {
                    dataserviceRepository.createTempFile(id, $scope.isSearchContent, $scope.content, function (rs) {
                        rs = rs.data;
                        rs.Object = encodeURI(rs.Object);
                        if (rs.Error == false) {
                            if (isImage == false) {
                                window.open(rs.Object, '_blank')
                                //$scope.openViewer("https://docs.google.com/gview?url=" + window.location.origin + '/' + rs.Object + '&embedded=true', isImage);
                            } else
                                $scope.openViewer(rs.Object, isImage);
                            //window.open('https://docs.google.com/gview?url=' + window.location.origin + '/' + rs.Object + '&embedded=true', '_blank');
                        }
                        else {

                        }
                    });
                }
                else {
                    App.toastrError(caption.COM_MSG_NO_PERMISSION);
                }
            })
        }
        else {
            if (dt != null)
                $scope.currentPath = userModel.ServerAddress + "/" + dt.text + "" + userModel.Url;
            else
                $scope.currentPath = userModel.ServerAddress + "/" + userModel.Url;
            //check permission
            dataserviceRepository.checkPermissionFileNoShare(userModel.FileCode, function (rs) {
                rs = rs.data;
                if (rs == true) {
                    dataserviceRepository.createTempFile(id, $scope.isSearchContent, $scope.content, function (rs) {
                        rs = rs.data;
                        rs.Object = encodeURI(rs.Object);
                        if (rs.Error == false) {
                            if (isImage == false) {

                                var url = window.location.origin + '/' + rs.Object;
                                window.open(url, '_blank')
                                //$scope.openViewer("https://docs.google.com/gview?url=" + window.location.origin + '/' + rs.Object + '&embedded=true', isImage);
                            }
                            else
                                $scope.openViewer(rs.Object, isImage);
                            //window.open('https://docs.google.com/gview?url=' + window.location.origin + '/' + rs.Object + '&embedded=true', '_blank');
                        }
                        else {

                        }
                    });
                }
                else {
                    App.toastrError(caption.COM_MSG_NO_PERMISSION);
                }
            })
        }
    }

    $scope.openViewer = function (url, isImage) {
        var data = {};
        data.url = url;
        data.isImage = isImage;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + '/viewer.html',
            controller: 'viewer',
            backdrop: 'false',
            size: '60',
            resolve: {
                para: function () {
                    return data;
                }
            }
        });
    }
    $scope.generateAudioBookUrls = function (id, catId, type) {
        var userModel = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].FileID == id) {
                userModel = listdata[i];
                break;
            }
        }
        dataserviceRepository.checkPermissionFileNoShare(userModel.FileCode, function (rs) {
            rs = rs.data;
            if (rs == true) {
                dataserviceRepository.createTempFileAudioBook(catId, function (rs) {
                    rs = rs.data;
                    if (rs.Error == false && rs.Object != null) {
                        $scope.getDataWithType(type, rs.Object, id);
                    }
                    else {
                        App.toastrError(caption.COM_MSG_ERR);
                    }
                });
            }
            else {
                App.toastrError(caption.COM_MSG_NO_PERMISSION);
            }
        })
    }

    function getType(typePhysic, mimeType) {
        if (typePhysic == '.doc' || typePhysic == '.docx') {
            return 'word';
        }
        else if (typePhysic == '.xlsx' || typePhysic == '.xlsm' || typePhysic == '.xls') {
            return 'excel';
        }
        else if (typePhysic == '.pptx' || typePhysic == '.pptm' || typePhysic == '.ppt') {
            return 'pptx';
        }
        else if (typePhysic == '.pdf') {
            return 'pdf';
        }
        else if (typePhysic == '.epub') {
            return 'epub';
        }
        else if (typePhysic == '.txt') {
            return 'text';
        }
        else if (typePhysic == '.zip' || typePhysic == '.rar') {
            return 'zip';
        }
        else if (mimeType.indexOf('image/') != -1) {
            return 'image';
        }
        else if (mimeType.indexOf('audio/') != -1) {
            return 'audio';
        }
        else if (mimeType.indexOf('video/') != -1) {
            return 'video';
        }
        else {
            return 'other';
        }
    }

    $scope.getDataWithType = function (type, url, id) {
        if (type == "text") {
            $scope.GetTextContentReading(url, id);
        }
        else if (type == "word") {
            $scope.GetWordContentReading(url, id);
        }
        else if (type == "epub") {
            $scope.GetEpubContentReading(url, id);
        }
        else if (type == "excel") {
            $scope.GetExcelContentReading(url, id);
        }
        else if (type == "pdf") {
            $scope.GetPdfContentReading(url, id);
        }
        else if (type == "pptx") {
            $scope.GetPptxContentReading(url, id);
        }
    }

    function splitStringByChunk(source, length) {
        var match = `.{1,${length}}`;
        const regx = new RegExp(match, "g");
        return source.match(regx);
    }
    function getSafehtml(html) {
        var span = document.createElement('span');
        span.innerHTML = html;
        return span.textContent || span.innerText;
    }
    function processContent(rs) {
        var newStory = [];
        for (const page of rs) {
            if (page.content.length > 5000) {
                var lString = splitStringByChunk(page.content, 5000);
            }
            else {
                lString = [page.content];
            }
            for (const string of lString) {
                var trimContent = string.replace(/\s\s+/g, ' ');
                if (trimContent == ' ' || trimContent == '' || trimContent == null || trimContent == undefined) {
                    continue;
                }
                newStory.push({
                    content: trimContent,
                    languageCode: page.languageCode
                });
            }
        }
        return newStory;
    }

    $scope.checkAndGenerateAudioBookUrls = function (id, story) {
        var isVN = story.filter(x => x.languageCode == "vi").length > 0;
        if (isVN) {
            var model = {
                id: id,
                contents: JSON.stringify(story.map(x => x.content))
            };
            dataserviceRepository.generateAudioBookUrls(model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                }
            });
        }
        else {
            App.toastrError("File văn bản không phải ngôn ngữ Việt");
        }
    }

    $scope.deleteFileTempAndPrepare = function (url, id, story) {
        dataserviceRepository.deleteFileTemp(url, function (rs) {
            rs = rs.data;
            if (rs.Error == false) {
                $scope.checkAndGenerateAudioBookUrls(id, story);
            }
        });
    }

    $scope.GetTextContentReading = function (url, id) {
        dataserviceRepository.getTextContentReading(url, function (rs) {
            rs = rs.data;
            var story = processContent(rs);
            $scope.deleteFileTempAndPrepare(url, id, story);
        });
    }

    $scope.GetEpubContentReading = function (url, id) {
        dataserviceRepository.getEpubContentReading(url, function (rs) {
            rs = rs.data;
            let result = rs;
            let newStory = [];
            for (const page of result) {
                page.content = getSafehtml(page.content);
                var lString = page.content.split(/\r?\n/);
                for (const string of lString) {
                    newStory.push({
                        content: string,
                        languageCode: page.languageCode
                    });
                }
            }
            var story = processContent(rs);
            $scope.deleteFileTempAndPrepare(url, id, story);
        });
    }

    $scope.GetWordContentReading = function (url, id) {
        dataserviceRepository.getWordContentReading(url, function (rs) {
            rs = rs.data;
            var story = processContent(rs);
            $scope.deleteFileTempAndPrepare(url, id, story);
        });
    }

    $scope.GetExcelContentReading = function (url, id) {
        dataserviceRepository.getExcelContentReading(url, function (rs) {
            rs = rs.data;
            var story = processContent(rs);
            $scope.deleteFileTempAndPrepare(url, id, story);
        });
    }

    $scope.GetPdfContentReading = function (url, id) {
        dataserviceRepository.getPdfContentReading(url, function (rs) {
            rs = rs.data;
            var story = processContent(rs);
            $scope.deleteFileTempAndPrepare(url, id, story);
        });
    }

    $scope.GetPptxContentReading = function (url, id) {
        dataserviceRepository.getPptxContentReading(url, function (rs) {
            rs = rs.data;
            var story = processContent(rs);
            $scope.deleteFileTempAndPrepare(url, id, story);
        });
    }

    //Begin Record Pack
    $scope.recordPack = function (fileCode, isFileScan) {
        if (isFileScan == "N") {
            return App.toastrError("Tệp tin là bản mềm không thể đóng gói");
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + '/records-pack.html',
            controller: 'records-pack',
            backdrop: 'static',
            size: '40',
            resolve: {
                para: function () {
                    return fileCode;
                }
            },
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    }

    $scope.arrangeFile = function (fileCode, isFileScan, hierachyPack) {
        debugger
        if (isFileScan == "N") {
            return App.toastrError("Tệp tin là bản mềm không thể xếp");
        }
        if (hierachyPack == "Chưa đóng gói") {
            return App.toastrError("Vui lòng đóng gói tệp tin trước");
        }

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + '/arrange-file-to-pack.html',
            controller: 'arrange-file-to-pack',
            backdrop: 'static',
            size: '40',
            resolve: {
                para: function () {
                    return fileCode;
                }
            },
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    }

    $scope.locateFile = function (hierachyPack, isFileScan, zoneHierarchy) {
        debugger
        if (isFileScan == "N") {
            return App.toastrError("Tệp tin là bản mềm không thể xếp");
        }
        if (hierachyPack == "Chưa đóng gói") {
            return App.toastrError("Vui lòng đóng gói tệp tin trước");
        }
        if (zoneHierarchy == "Chưa xếp") {
            return App.toastrError("Vui lòng xếp lại tệp tin trước");
        }

        location.href = "/Admin/EDMSDiagramWarehouseDocument?mapping=" + zoneHierarchy;
    }

    //End Record Pack

    $scope.share = function (id) {
        var userModel = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }
        debugger
        if (userModel.CreatedBy != userName) {
            return App.toastrError(caption.COM_MSG_NO_PERMISSION);
        }

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderFilePlugin + '/shareFile.html',
            controller: 'share-file-object',
            backdrop: 'static',
            size: '40',
            resolve: {
                para: function () {
                    return {
                        Id: id
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    };

    $scope.contextMenu = [
        [function ($itemScope) {
            return '<i class="fa fa-copy"></i> ' + caption.COM_LBL_COPY;
        }, function ($itemScope, $event, model) {
            $scope.dataTemp = {
                action: 'Copy',
                data: $itemScope.data
            };

        }, function ($itemScope, $event, model) {
            return true;
        }],
        [function ($itemScope) {
            return '<i class="fa fa-cut"></i> ' + caption.COM_LBL_MOVE;
        }, function ($itemScope, $event, model) {
            $scope.dataTemp = {
                action: 'Move',
                data: $itemScope.data
            };
        }, function ($itemScope, $event, model) {
            return true;
        }],
        /*[function ($itemScope) {
            return '<i class="fa fa-upload"></i> ' + "Tải lên";
        }, function ($itemScope, $event, model) {
            $scope.dataTemp = {
                action: 'Upload',
                data: $itemScope.data
            };
        }, function ($itemScope, $event, model) {
            return true;
        }],*/
    ];

    //treeview
    var nodeBefore = "";
    $scope.readyCB = function () {
        App.blockUI({
            target: "#contentMainRepository",
            boxed: true,
            message: 'loading...'
        });
        dataserviceRepository.getTreeCategory(function (result) {
            result = result.data;

            if (!result.Error) {
                var root = {
                    id: 'root',
                    parent: "#",
                    text: caption.EDMSR_LBL_ALL_CATEGORY,//"Tất cả kho dữ liệu"
                    state: { selected: false, opened: true, checkbox_disabled: true, disabled: true }
                }
                $scope.treeData.push(root);
                var index = 0;
                $scope.ListParent = result.filter(function (item) {
                    return (item.ParentCode == '#');
                });
                for (var i = 0; i < result.length; i++) {
                    if (result[i].ParentCode == '#') {
                        var stt = $scope.ListParent.length - index;
                        if (stt.toString().length == 1) {
                            stt = "0" + stt;
                        }
                        index = index + 1;
                        var data = {
                            id: result[i].Code,
                            parent: 'root',
                            text: stt + ' - ' + result[i].Title,
                            catId: result[i].Id,
                            catCode: result[i].Code,
                            catName: result[i].Title,
                            catParent: result[i].ParentCode,
                            listRepository: result[i].ListRepository,
                            state: { selected: false, opened: true }
                        }
                        $scope.treeData.push(data);
                    } else {
                        var data = {
                            id: result[i].Code,
                            parent: result[i].ParentCode,
                            text: result[i].Code + ' - ' + result[i].Title,
                            catId: result[i].Id,
                            catCode: result[i].Code,
                            catName: result[i].Title,
                            catParent: result[i].ParentCode,
                            listRepository: result[i].ListRepository,
                            state: { selected: false, opened: true }
                        }
                        $scope.treeData.push(data);
                    }
                }
                App.unblockUI("#contentMainRepository");
            }
        });
    }

    $scope.selectNodeRepository = function (e, data) {
        var listSelect = [];
        var idCurrentNode = data.node.id;
        if (nodeBefore != idCurrentNode) {
            $("#" + nodeBefore + "_anchor").removeClass('bold');

            nodeBefore = idCurrentNode;
            $scope.recentFile = false;
            var listNoteSelect = $scope.treeInstance.jstree(true).get_checked(true);
            for (var i = 0; i < listNoteSelect.length; i++) {
                listSelect.push(listNoteSelect[i].id);
            }
            $scope.model.ListRepository = listSelect;
            $scope.reload();
        }
        else {
            $scope.recentFile = false;
            listSelect = [];
            $("#" + idCurrentNode + "_anchor").addClass('bold');
            listSelect.push(idCurrentNode);
            $scope.model.ListRepository = listSelect;
            $scope.reload();
        }
    }

    $scope.deselectNodeRepository = function (e, data) {
        $scope.recentFile = false;
        var listSelect = [];
        var listNoteSelect = $scope.treeInstance.jstree(true).get_checked(true);
        if (listNoteSelect.length > 0) {
            for (var i = 0; i < listNoteSelect.length; i++) {
                listSelect.push(listNoteSelect[i].id);
                dataserviceRepository.getTreeInNode(listNoteSelect[i].id, function (rs) {
                    rs = rs.data;
                    if (rs.length > 0) {
                        for (var i = 0; i < rs.length; i++) {
                            listSelect.push(rs[i].Code);
                        }
                    }
                    $scope.model.ListRepository = listSelect;
                    $scope.reload();
                })
            }
        } else {
            $scope.model.ListRepository = listSelect;
            $scope.reload();
        }


    }
    $scope.treeConfig = {
        core: {
            multiple: true,
            animation: true,
            error: function (error) {
                //$log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
            },
            check_callback: true,
            worker: true,

        },
        types: {
            default: {
                icon: 'fa fa-folder icon-state-warning'
            }
        },
        version: 1,
        plugins: ['checkbox', 'types', 'contextmenu'],
        checkbox: {
            "three_state": false,
            "whole_node": false,
            "keep_selected_style": false,
            "cascade": "undetermined",
        },
        contextmenu: {
            items: customMenu
        }
    };

    $scope.treeEvents = {
        'ready': $scope.readyCB,
        'select_node': $scope.selectNodeRepository,
        'deselect_node': $scope.deselectNodeRepository,
    };

    $scope.ac = function () {
        return true;
    }

    function customMenu(node) {
        var items = {};

        if (isAllData === 'True') {
            items = {
                'item1': {
                    'label': caption.COM_BTN_EDIT,
                    'icon': "fa fa-edit",
                    'action': function (data) {
                        if ((isAllData !== 'True')) {
                            return App.toastrError('Bạn không có quyền được sửa danh mục');
                        }

                        dataserviceRepository.getItemCategory(node.original.catId, function (rs) {
                            rs = rs.data;
                            if (rs.Error) {
                                App.toastrError(rs.Title);
                            } else {
                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: ctxfolderRepository + '/editCategory.html',
                                    controller: 'editCategory',
                                    backdrop: 'static',
                                    size: '80',
                                    resolve: {
                                        para: function () {
                                            return rs.Object;
                                        }
                                    }
                                });
                                modalInstance.result.then(function (d) {
                                    $('#treeDiv').jstree(true).refresh();
                                    setTimeout(function () {
                                        $scope.readyCB();
                                    }, 200);
                                }, function () {
                                });
                            }
                        })
                    }
                },
                'item2': {
                    'label': caption.COM_BTN_DELETE,
                    'icon': "fa fa-trash",
                    'action': function (data) {
                        var modalInstance = $uibModal.open({
                            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
                            windowClass: "message-center",
                            resolve: {
                                para: function () {
                                    return node.original.catCode;
                                }
                            },
                            controller: function ($scope, $uibModalInstance, para) {
                                $scope.message = caption.EDMSR_MSG_DELETE_CATEGORIES;
                                $scope.ok = function () {
                                    dataserviceRepository.deleteCategory(para, function (rs) {
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
                            $('#treeDiv').jstree(true).refresh();
                            setTimeout(function () {
                                $scope.readyCB();
                                $scope.reload();
                            }, 200);
                        }, function () {
                        });
                    }
                }
            };

            if ($scope.dataTemp.action === 'Copy' || $scope.dataTemp.action === 'Move') {
                items = {
                    'item1': {
                        'label': caption.COM_BTN_EDIT,
                        'icon': "fa fa-edit",
                        'action': function (data) {
                            dataserviceRepository.getItemCategory(node.original.catId, function (rs) {
                                rs = rs.data;
                                if (rs.Error) {
                                    App.toastrError(rs.Title);
                                } else {
                                    var modalInstance = $uibModal.open({
                                        animation: true,
                                        templateUrl: ctxfolderRepository + '/editCategory.html',
                                        controller: 'editCategory',
                                        backdrop: 'static',
                                        size: '70',
                                        resolve: {
                                            para: function () {
                                                return rs.Object;
                                            }
                                        }
                                    });
                                    modalInstance.result.then(function (d) {
                                        $('#treeDiv').jstree(true).refresh();
                                        setTimeout(function () {
                                            $scope.readyCB();
                                        }, 200);
                                    }, function () {
                                    });
                                }
                            })
                        }
                    },
                    'item2': {
                        'label': caption.COM_BTN_DELETE,
                        'icon': "fa fa-trash",
                        'action': function (data) {
                            var modalInstance = $uibModal.open({
                                templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
                                windowClass: "message-center",
                                resolve: {
                                    para: function () {
                                        return node.original.catCode;
                                    }
                                },
                                controller: function ($scope, $uibModalInstance, para) {
                                    $scope.message = caption.EDMSR_MSG_DELETE_CATEGORIES;
                                    $scope.ok = function () {
                                        dataserviceRepository.deleteCategory(para, function (rs) {
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
                                $('#treeDiv').jstree(true).refresh();
                                setTimeout(function () {
                                    $scope.readyCB();
                                    $scope.reload();
                                }, 200);
                            }, function () {
                            });
                        }
                    },
                    'item3': {
                        'label': caption.COM_LBL_PASTE,
                        'icon': "fa fa-paste",
                        'action': function (data) {
                            switch ($scope.dataTemp.action) {
                                case 'Copy':
                                    copy($scope.dataTemp, node);
                                    break;

                                case 'Move':
                                    move($scope.dataTemp, node);
                                    break;
                            }
                        }
                    }
                };
            }
        }

        return items;
    }

    function copy(item, node) {
        var actionData = {
            Action: 'Copy',
            FileIdFrom: item.data.FileID,
            CatIdTo: node.original.catId
        };

        if (item.data.Category === node.original.catCode) {
            return App.toastrError(caption.EDMSR_MSG_PLS_CHOOSE_ANOTHER);
        }

        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmQuestion.html',
            windowClass: "message-center",
            resolve: {
                para: function () {
                    return actionData;
                }
            },
            controller: function ($scope, $uibModalInstance, para) {
                $scope.message = caption.EDMSR_MSG_PASTE_CATEGORIES;
                $scope.ok = function () {
                    dataserviceRepository.pasteFile(para, function (rs) {
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
            //$('#treeDiv').jstree(true).refresh();
            setTimeout(function () {
                //$scope.readyCB();
                $scope.reload();
            }, 200);
        }, function () {
        });

        $scope.initDataTemp();
    }

    function move(item, node) {
        var actionData = {
            Action: 'Move',
            FileIdFrom: item.data.FileID,
            CatIdTo: node.original.catId
        };

        if (item.data.Category === node.original.catCode) {
            return App.toastrError(caption.EDMSR_MSG_PLS_CHOOSE_ANOTHER);
        }

        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmQuestion.html',
            windowClass: "message-center",
            resolve: {
                para: function () {
                    return actionData;
                }
            },
            controller: function ($scope, $uibModalInstance, para) {
                $scope.message = caption.EDMSR_MSG_PASTE_CATEGORIES;
                $scope.ok = function () {
                    dataserviceRepository.pasteFile(para, function (rs) {
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
            //$('#treeDiv').jstree(true).refresh();
            setTimeout(function () {
                //$scope.readyCB();
                $scope.reload();
            }, 200);
        }, function () {
        });

        $scope.initDataTemp();
    }

    $scope.search = function () {
        reloadData(true);
    }

    $scope.init = function () {
        dataserviceRepository.getObjectsType(function (rs) {
            rs = rs.data;
            $scope.objects = rs;
        });
        reloadObject('');
        dataserviceRepository.getUsers(function (rs) {
            rs = rs.data;
            $scope.users = rs;
            var all = {
                UserName: '',
                Name: caption.EDMSR_LBL_ALL
            }
            $scope.users.unshift(all)
        });
    }

    $scope.init();

    $scope.selectObjectType = function (objectType) {
        //$scope.objectDetails = [];
        //$scope.model.ObjectDetailCode = null;

        //if ($scope.model.ObjectCode == "FILE_OBJ_CONTRACT") {
        //    dataserviceRepository.getAllContract(function (rs) {rs=rs.data;
        //        $scope.objectDetails = rs.Object;
        //    });
        //}
        //if ($scope.model.ObjectCode == "FILE_OBJ_CUSTOMMER") {
        //    dataserviceRepository.getAllCustomer(function (rs) {rs=rs.data;
        //        $scope.objectDetails = rs.Object;
        //    });
        //}
        //if ($scope.model.ObjectCode == "FILE_OBJ_PROJECT") {
        //    dataserviceRepository.getAllProject(function (rs) {rs=rs.data;
        //        $scope.objectDetails = rs.Object;
        //    });

        //}
        //if ($scope.model.ObjectCode == "FILE_OBJ_SUPPLIER") {
        //    dataserviceRepository.getAllSupplier(function (rs) {rs=rs.data;
        //        $scope.objectDetails = rs.Object;
        //    });
        //}
        reloadObject(objectType);
        reloadData(true);
    }

    $scope.selectObjectCode = function (item) {
        $scope.model.ObjectType = item.ObjectType;
        reloadData(true);
    }

    $scope.resetObjectType = function () {
        reloadObject('');
        reloadData(true);
    }

    $scope.downloadSearch = function (id) {
        var userModel = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }
        var dt = null;
        for (var i = 0; i < $scope.treeData.length; ++i) {
            var item = $scope.treeData[i];
            if (item.id == userModel.Category) {
                dt = item;
                break;
            }
        }
        if (userModel.CloudFileId != null && userModel.CloudFileId != "") {
            if (dt != null)
                $scope.currentPath = "Google Driver/" + dt.text + "/" + userModel.FolderName + "/" + userModel.FileName;
            else
                $scope.currentPath = "Google Driver/" + userModel.FileName;
        }
        else {

            if (dt != null)
                $scope.currentPath = userModel.ServerAddress + "/" + dt.text + "" + userModel.Url;
            else
                $scope.currentPath = userModel.ServerAddress + "/" + userModel.Url;
        }
        location.href = "/Admin/EDMSRepository/DownloadSearch?"
            + "Id=" + id + "&content=" + $scope.content;
    }

    $scope.download = function (id) {
        var userModel = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }
        var dt = null;
        for (var i = 0; i < $scope.treeData.length; ++i) {
            var item = $scope.treeData[i];
            if (item.id == userModel.Category) {
                dt = item;
                break;
            }
        }
        dataserviceRepository.checkPermissionFileNoShare(userModel.FileCode, function (rs) {
            rs = rs.data;
            if (rs == true) {
                if (userModel.CloudFileId != null && userModel.CloudFileId != "") {
                    if (dt != null)
                        $scope.currentPath = "Google Driver/" + dt.text + "/" + userModel.FolderName + "/" + userModel.FileName;
                    else
                        $scope.currentPath = "Google Driver/" + userModel.FileName;
                }
                else {

                    if (dt != null)
                        $scope.currentPath = userModel.ServerAddress + "/" + dt.text + "" + userModel.Url;
                    else
                        $scope.currentPath = userModel.ServerAddress + "/" + userModel.Url;
                }
                location.href = "/Admin/EDMSRepository/Download?"
                    + "Id=" + id;
            }
            else {
                App.toastrError(caption.COM_MSG_NO_PERMISSION);
            }
        })
    }

    $scope.tabFileHistory = function (fileId) {
        if (fileId === 0) {
            App.toastrError(caption.COM_MSG_FILE_NOT_HISTORY);
            return null;
        }
        var userModel = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].FileID == fileId) {
                userModel = listdata[i];
                break;
            }
        }
        dataserviceRepository.checkPermissionFileNoShare(userModel.FileCode, function (rs) {
            rs = rs.data;
            if (rs == true) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: ctxfolderRepository + '/tabFileHistory.html',
                    controller: 'tabFileHistory',
                    backdrop: 'static',
                    size: '60',
                    resolve: {
                        para: function () {
                            return fileId;
                        }
                    }
                });
                modalInstance.result.then(function (d) {

                }, function () { });
            }
            else {
                App.toastrError(caption.COM_MSG_NO_PERMISSION);
            }
        })
    };

    $scope.extension = function (item) {
        var userModel = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].FileID == item) {
                userModel = listdata[i];
                break;
            }
        }
        dataserviceRepository.checkPermissionFileNoShare(userModel.FileCode, function (rs) {
            rs = rs.data;
            if (rs == true) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: ctxfolderRepository + '/extension.html',
                    controller: 'extension',
                    backdrop: 'static',
                    size: '40',
                    resolve: {
                        para: function () {
                            return {
                                Type: 'LIST',
                                Object: item
                            };
                        }
                    }
                });
                modalInstance.result.then(function (d) {

                }, function () {
                });
            }
            else {
                App.toastrError(caption.COM_MSG_NO_PERMISSION);
            }
        })
    };

    function showHideSearch() {
        $(".btnSearch").click(function () {
            $(".input-search").removeClass('hidden');
            $(".btnSearch").hide();
        });
        $(".close-input-search").click(function () {
            $(".input-search").addClass('hidden');
            $(".btnSearch").show();
        });
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
            $('#FromTo').datepicker('setEndDate', null);
        });
        $('.start-date').click(function () {
            $('#DateTo').datepicker('setStartDate', null);
        });
    }

    function handlerFunction(event) {
        if (event !== null) {
            event.preventDefault();
        }
        event.dataTransfer.effectAllowed = 'copy';
        console.log(event);
    }

    function handlerFunction1(event) {
        if (event !== null) {
            event.preventDefault();
        }
        var file = event.dataTransfer.files;
        if ($scope.model.ListRepository.length === 0) {
            App.toastrError(caption.EDMSR_MSG_PLS_SELECT_CATE_ADD_FILE);
        }
        else if ($scope.model.ListRepository.length > 1) {
            App.toastrError(caption.EDMSR_MSG_PLS_ONLY_CATE_ADD_FILE);
        }
        else {
            dataserviceRepository.getSupportCategory($scope.model.ListRepository[0], function (rs) {
                rs = rs.data;
                if (rs.Error == true) {
                    App.toastrError(rs.Title);
                }
                else {
                    if (rs.Object != null) {
                        var obj = rs.Object;
                        for (var i = 0; i < file.length; ++i) {
                            var data = {};
                            data.CateRepoSettingId = obj.Id;
                            data.FileUpload = file[i];
                            data.FileName = file[i].name;

                            var formData = new FormData();
                            formData.append("FileUpload", data.FileUpload);

                            formData.append("FileName", data.FileName);
                            formData.append("CateRepoSettingId", data.CateRepoSettingId);

                            dataserviceRepository.insertFile(formData, function (result) {
                                result = result.data;
                                if (result.Error) {
                                    App.toastrError(result.Title);
                                } else {
                                    App.toastrSuccess(result.Title);
                                    $scope.reload();
                                }
                            });
                        }
                    }
                    else {
                        App.toastrError(caption.EDMSR_MSG_NO_SUGGESST_FORDER);
                    }
                }
            });
        }

    }

    function reloadObject(objectType) {
        dataserviceRepository.getListObject(objectType, function (rs) {
            rs = rs.data;
            $scope.listObjects = rs;
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

    function create_UUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    $scope.uploadFile = function (files) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            //var file = $rootScope.fileUpload;
            var listNoteSelect = $scope.treeInstance.jstree(true).get_checked(true);
            if (listNoteSelect.length == 0) {
                App.toastrError(caption.EDMSR_MSG_SELECT_CATEGORIES);
            } else if (listNoteSelect.length > 1) {
                App.toastrError(caption.EDMSR_MSG_SELECT_A_REPOSITORY);
            } else {
                if ((file.size / 1048576) < 1000) {
                    var data = {};
                    data.CatId = /*itemSelect.length !== 0 ? itemSelect[0] : ""*/ listNoteSelect[0].original.catId;
                    console.log(file);
                    data.FileUpload = file;
                    data.FileName = file.name;
                    data.Desc = /*$scope.model.Desc*/ "";
                    data.Tags = /*$scope.model.Tags*/ "";
                    data.NumberDocument = /*$scope.model.NumberDocument*/ "";
                    data.IsScan = /*$scope.model.IsScan*/ false;
                    data.uuid = create_UUID();
                    if ($rootScope.RackInfo !== undefined && $rootScope.RackInfo !== null) {
                        data.RackCode = $rootScope.RackInfo.RackCode;
                        data.RackPosition = $rootScope.RackInfo.RackPosition;
                        data.ObjPackCode = $rootScope.RackInfo.ObjPackCode;
                    }

                    if ($rootScope.DocumentExt !== undefined && $rootScope.DocumentExt !== null && $rootScope.DocumentExt !== '') {
                        data.MetaDataExt = JSON.stringify($rootScope.DocumentExt);
                    }

                    if (!$scope.isProgressModelOpen) {
                        $scope.viewProgress();
                    }
                    $rootScope.progress.push({ name: data.FileName, uuid: data.uuid, progress: '0%', style: { 'width': '0%' } });

                    Upload.upload({
                        url: '/Admin/EDMSRepository/DropFile',
                        data: data
                    }).then(function (result) {
                        result = result.data;
                        if (result.Error) {
                            App.toastrError(result.Title);
                        } else {
                            App.toastrSuccess(result.Title);
                            $scope.reload();
                        }
                        var index = $rootScope.progress.findIndex(x => x.uuid == result.Object);
                        $rootScope.progress.splice(index, 1);
                        if ($rootScope.progress.length == 0) {
                            $scope.progressModal.close("End uploading");
                            $scope.isProgressModelOpen = false;
                        }
                    }, function (resp) {
                        console.log('Error status: ' + resp.status);
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        var data = evt.config.data;
                        var index = $rootScope.progress.findIndex(x => x.uuid == data.uuid);
                        $rootScope.progress[index].progress = progressPercentage + '% ';
                        $rootScope.progress[index].style.width = progressPercentage + '% ';
                    });
                } else {
                    App.toastrError(caption.EDMSR_MSG_FILE_SIZE_LIMIT_UPLOAD);
                }
            }
        }
    }

    $scope.viewProgress = function () {
        $scope.progressModal = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageProgressUpload.html',
            backdrop: false,
            windowClass: "progress-modal",
            appendTo: angular.element(document).find('#dropzone'),
            controller: function ($scope, $uibModalInstance) {
                $scope.cancelUpload = function () {

                };

                //$scope.cancel = function () {
                //    $uibModalInstance.dismiss('cancel');
                //};
            },
            size: '100',
        });
        $scope.progressModal.opened.then(function (d) {
            $scope.isProgressModelOpen = true;
        }, function () {
        });
        $scope.progressModal.result.then(function (d) {
        }, function () {
        });
    }

    //$scope.viewProgress();

    setTimeout(function () {
        //showHideSearch();
        loadDate();
        //let dropArea = document.getElementById('dropzone1')
        //dropArea.addEventListener('dragover', handlerFunction, false)
        //dropArea.addEventListener('dragenter', handlerFunction, false)
        //dropArea.addEventListener('drop', handlerFunction1, false)
    }, 200);
});
//file
app.controller('imageViewerFile', function ($scope, $rootScope, $compile, $uibModal, dataserviceRepository, $filter, $uibModalInstance, para) {
    $scope.Image = para;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});
app.controller('fileViewer', function ($scope, $rootScope, $compile, $uibModal, dataserviceRepository, $filter, $uibModalInstance, para) {
    $scope.url = para;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
});
app.controller('fileManage', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceRepository, $filter, $translate) {
    var vm = $scope;
    $scope.breadcrumb = [];
    $scope.treeDataRepository = [];
    $scope.repository = {
        TypeRepos: '',
        ReposCode: '',
        Folder: '',
        ParentId: ''
    }
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/EDMSRepository/JtableFileWithRepository",
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
                d.ReposCode = $scope.repository.ReposCode;
                d.Folder = $scope.repository.Folder;
                d.ParentId = $scope.repository.ParentId;
            },
            complete: function () {
                App.unblockUI("#contentMain");
                $(".dataTables_scrollBody").addClass('scroller-sm-fade');
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(30)
        .withOption('order', [1, 'desc'])
        .withOption('serverSide', true)
        .withOption('scrollY', "200px")
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
                    if (data.IsDirectory == 'True') {
                        $scope.breadcrumb.push({ Id: data.Id, Path: data.FileName, Name: data.FileName });
                        $scope.$apply();
                        //(2:Server, 1:Google driver)
                        if ($scope.repository.TypeRepos == 'SERVER') {
                            var folder = '';
                            for (var i = 0; i < $scope.breadcrumb.length; i++) {
                                if ($scope.breadcrumb[i].Path != '') {
                                    folder += "/" + $scope.breadcrumb[i].Path;
                                }
                            }
                            $scope.repository.Folder = folder;
                        } else if ($scope.repository.TypeRepos == 'DRIVER') {
                            $scope.repository.ParentId = data.Id;
                        }
                        $scope.reload();
                    }
                }
            });
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("FileID").withTitle('').notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full._STT] = false;
        }).withOption('sWidth', '30px').withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileName').withOption('sClass', '').withTitle($translate('EDMSR_LIST_COL_FILE_NAME')).withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
        var dataSubstr = data.length > 35 ? data.substr(0, 35) + " ..." : data;
        if (full.IsDirectory == 'True') {
            return '<i class="jstree-icon jstree-themeicon fa fa-folder icon-state-warning jstree-themeicon-custom" aria-hidden="true"></i>&nbsp;' + dataSubstr;
        } else {
            if ($scope.repository.TypeRepos == 'SERVER') {
                var idxDot = data.lastIndexOf(".") + 1;
                var extFile = data.substr(idxDot, data.length).toLowerCase();
                var excel = ['XLSM', 'XLSX', 'XLS'];
                var document = ['TXT'];
                var word = ['DOCX', 'DOC'];
                var pdf = ['PDF'];
                var powerPoint = ['PPS', 'PPTX', 'PPT'];
                var image = ['JPG', 'PNG', 'TIF', 'TIFF'];
                if (excel.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(106,170,89);font-size: 15px;" class="fa fa-file-excel-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (word.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (document.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(0,0,0);font-size: 15px;" class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (pdf.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (powerPoint.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-powerpoint-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (image.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fa fa-picture-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fas fa-align-justify" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                }
            } else {
                var txtMimetypes = ["text/plain"];
                var wordMimetypes = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/vnd.google-apps.document"];
                var excelMimetypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.google-apps.spreadsheet"];
                var pdfMimetypes = ["application/pdf"];
                var powerPointMimetypes = ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
                var imageMimetypes = ["image/jpeg", "image/tiff", "image/ief", "image/png", "image/svg+xml", "image/webp", "image/vnd.microsoft.icon", "image/bmp"];
                if (excelMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(106,170,89);font-size: 15px;" class="fa fa-file-excel-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (wordMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (txtMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(0,0,0);font-size: 15px;" class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (pdfMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (powerPointMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-powerpoint-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (imageMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fa fa-picture-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fas fa-align-justify" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                }
            }
        }
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileSize').withTitle($translate('EDMSR_LIST_COL_SIZE')).withOption('sClass', 'nowrap dataTable-100').renderWith(function (data, type, full) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (data == '') {
            return '';
        } else if (data == 0) {
            return '0 Byte';
        } else {
            var i = parseInt(Math.floor(Math.log(data) / Math.log(1024)));
            return Math.round(data / Math.pow(1024, i), 2) + ' ' + sizes[i];
        }
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('LastModifiedDate').withTitle($translate('EDMSR_LIST_COL_MODIFIED_DATE')).withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
        return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy HH:mm') : null;
    }));
    vm.reloadData = reloadData;
    vm.dtInstance = {};
    function reloadData(resetPaging) {
        vm.dtInstance.reloadData(callback, resetPaging);
    }
    function callback(json) {

    }
    function toggleAll(selectAll, selectedItems) {
        if (selectAll)
            $('#tblDataDetailRepository').DataTable().$('tr:not(.selected)').addClass('selected');
        else
            $('#tblDataDetailRepository').DataTable().$('tr.selected').removeClass('selected');
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                selectedItems[id] = selectAll;
            }
        }
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
    function resetCheckbox() {
        $scope.selected = [];
        vm.selectAll = false;
    }

    $scope.init = function () {
        dataserviceRepository.getGoogleApiTokens(function (rs) {
            rs = rs.data;
            if (!rs.Error) {
                $rootScope.listGoogleApiToken = rs.Object;
            }
        })
    }
    $scope.init();
    $scope.reload = function () {
        reloadData(true);
    }
    $scope.addRepository = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + '/addRepository.html',
            controller: 'addRepository',
            backdrop: 'static',
            size: '35'
        });
        modalInstance.result.then(function (d) {
            $('#treeDivFileManage').jstree(true).refresh();
            setTimeout(function () {
                $scope.readyCB();
            }, 200);
        }, function () {
        });
    }
    $scope.editRepository = function () {
        var listSelect = [];
        var listNoteSelect = $scope.treeInstance.jstree(true).get_checked(true);
        for (var i = 0; i < listNoteSelect.length; i++) {
            listSelect.push(listNoteSelect[i].id);
        }
        if (listSelect.length == 0) {
            App.toastrError(caption.EDMSR_MSG_PLS_SELECT_SERVER);
        } else if (listSelect.length > 1) {
            App.toastrError(caption.EDMSR_MSG_SELECT_A_SERVER);
        } else {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: ctxfolderRepository + '/editRepository.html',
                controller: 'editRepository',
                backdrop: 'static',
                size: '35',
                resolve: {
                    para: function () {
                        return listSelect[0];
                    }
                },
            });
            modalInstance.result.then(function (d) {
                $('#treeDivFileManage').jstree(true).refresh();
                setTimeout(function () {
                    $scope.readyCB();
                }, 200);
            }, function () {
            });
        }
    }
    $scope.deleteRepository = function () {
        var listSelect = [];
        var listNoteSelect = $scope.treeInstance.jstree(true).get_checked(true);
        for (var i = 0; i < listNoteSelect.length; i++) {
            listSelect.push(listNoteSelect[i].id);
        }
        if (listSelect.length == 0) {
            App.toastrError(caption.EDMSR_MSG_PLS_SELECT_SERVER);
        } else if (listSelect.length > 1) {
            App.toastrError(caption.EDMSR_MSG_SELECT_A_SERVER);
        } else {
            var modalInstance = $uibModal.open({
                templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
                windowClass: "message-center",
                resolve: {
                    para: function () {
                        return listSelect[0];
                    }
                },
                controller: function ($scope, $uibModalInstance, para) {
                    $scope.message = caption.EDMSR_MSG_SURE_DEL_SERVER;
                    $scope.ok = function () {
                        dataserviceRepository.deleteRepository(para, function (rs) {
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
                size: '20',
            });
            modalInstance.result.then(function (d) {
                $('#treeDivFileManage').jstree(true).refresh();
                setTimeout(function () {
                    $scope.readyCB();
                    $scope.reload();
                }, 200);
            }, function () {
            });
        }
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.readyCB = function () {
        App.blockUI({
            target: "#contentMainRepository",
            boxed: true,
            message: 'loading...'
        });
        dataserviceRepository.getTreeRepository(function (result) {
            result = result.data;
            if (!result.Error) {
                var root = {
                    id: 'root',
                    parent: "#",
                    text: "Danh sách",
                    state: { selected: false, opened: true, checkbox_disabled: true, disabled: true }
                }
                $scope.treeDataRepository.push(root);
                var index = 0;
                $scope.ListParent = result.filter(function (item) {
                    return (item.ParentCode == '#');
                });
                for (var i = 0; i < result.length; i++) {
                    if (result[i].ParentCode == '#') {
                        var stt = $scope.ListParent.length - index;
                        if (stt.toString().length == 1) {
                            stt = "0" + stt;
                        }
                        index = index + 1;
                        var data = {
                            id: result[i].Code,
                            parent: 'root',
                            text: stt + ' - ' + result[i].Title,
                            resId: result[i].Id,
                            resCode: result[i].Code,
                            resName: result[i].Title,
                            resParent: result[i].ParentCode,
                            typeRepos: result[i].TypeRepos,
                            state: { selected: false, opened: true }
                        }
                        $scope.treeDataRepository.push(data);
                    } else {
                        var data = {
                            id: result[i].Code,
                            parent: result[i].ParentCode,
                            text: result[i].Code + ' - ' + result[i].Title,
                            resId: result[i].Id,
                            resCode: result[i].Code,
                            resName: result[i].Title,
                            resParent: result[i].ParentCode,
                            typeRepos: result[i].TypeRepos,
                            state: { selected: false, opened: true }
                        }
                        $scope.treeDataRepository.push(data);
                    }
                }
                App.unblockUI("#contentMainRepository");
            }
        });
    }
    $scope.selectNodeFileManage = function () {
        var listSelect = [];
        var listNoteSelect = $scope.treeInstance.jstree(true).get_checked(true);
        listSelect.push(listNoteSelect[0].id);
        $scope.breadcrumb = [];
        $scope.breadcrumb.push({ Id: "", Path: "", Name: listNoteSelect[0].original.resName });
        $scope.repository.ReposCode = listNoteSelect[0].original.resCode;
        $scope.repository.TypeRepos = listNoteSelect[0].original.typeRepos;
        if ($scope.repository.TypeRepos == "DRIVER") {
            $scope.showFolderIdInput = true;
        }
        else {
            $scope.showFolderIdInput = false;
        }
        $scope.repository.Folder = "";
        $scope.repository.ParentId = "";
        $scope.reload();
    }
    $scope.deselectNodeRepository = function () {
        $scope.breadcrumb = [];
        $scope.repository.ReposCode = '';
        $scope.repository.TypeRepos = '';
        $scope.repository.Folder = "";
        $scope.repository.ParentId = "";
        $scope.showFolderIdInput = false;
        $scope.reload();
    }
    $scope.selectBreadcrumbRepository = function (index, listBreadcrumb) {
        var folder = '';
        for (var i = 0; i < listBreadcrumb.length; i++) {
            if (i == index) {
                folder += "/" + $scope.breadcrumb[i].Path;
                $scope.repository.ParentId = listBreadcrumb[i].Id;

            } else if (i > index) {
                listBreadcrumb.splice(i, 1);
                i--;
            } else if (i < index) {
                folder += "/" + $scope.breadcrumb[i].Path;
            }
        }
        $scope.repository.Folder = folder;
        $scope.reload();
    }
    $scope.treeConfig = {
        core: {
            multiple: false,
            animation: true,
            error: function (error) {
                $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
            },
            check_callback: true,
            worker: true,

        },
        types: {
            default: {
                icon: 'fas fa-store',
            }
        },
        version: 1,
        plugins: ['checkbox', 'types', 'search'],
        checkbox: {
            "three_state": false,
            "whole_node": true,
            "keep_selected_style": true,
            "cascade": "undetermined",
        }
    };
    $scope.treeEvents = {
        'ready': $scope.readyCB,
        'select_node': $scope.selectNodeFileManage,
        'deselect_node': $scope.deselectNodeRepository,
    }

    $scope.uploadMass = function () {
        var repoCode = $scope.repository.ReposCode;
        var parentId = $scope.repository.ParentId;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + '/uploadMass.html',
            controller: 'uploadMass',
            backdrop: 'static',
            size: '65',
            resolve: {
                para: function () {
                    var obj =
                    {
                        RepoCode: repoCode,
                        ParentId: parentId,
                    };
                    return obj;
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    }
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});
app.controller('tabFileHistory', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceRepository, $filter, para) {
    var vm = $scope;
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    $scope.model = {
        FromDate: '',
        ToDate: '',
    };
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/EDMSRepository/JTableFileHistory",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.FileId = para;
            },
            complete: function () {
                App.unblockUI("#contentMain");
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(5)
        .withOption('order', [0, 'asc'])
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
            $compile(angular.element(row))($scope);
            $compile(angular.element(row).attr('context-menu', 'contextMenu'))(contextScope);
        });
    //end option table
    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle(titleHtml).notSortable().renderWith(function (data, type, full, meta) {
        $scope.selected[full.id] = false;
        return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.ContractFileID + ']" ng-click="toggleOne(selected)"/><span></span></label>';
    }).withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileName').withOption('sClass', 'w75').withTitle('{{"CONTRACT_CURD_TAB_FILE_LIST_COL_NAME" | translate}}').renderWith(function (data, type, full) {
        var excel = ['.XLSM', '.XLSX', '.XLS'];
        var document = ['.TXT'];
        var word = ['.DOCX', '.DOC'];
        var pdf = ['.PDF'];
        var powerPoint = ['.PPS', '.PPTX', '.PPT'];
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        var icon = "";
        if (excel.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(106,170,89);font-size: 15px;" class="fa fa-file-excel-o" aria-hidden="true"></i>&nbsp;';
        } else if (word.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o" aria-hidden="true"></i>&nbsp;';
        } else if (document.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(0,0,0);font-size: 15px;" class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;';
        } else if (pdf.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;';
        } else if (powerPoint.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-powerpoint-o" aria-hidden="true"></i>&nbsp;';
        } else if (image.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(42,42,42);font-size: 15px;" class="fa fa-picture-o" aria-hidden="true"></i>&nbsp;';
        } else {
            icon = '<i style="color: rgb(42,42,42);font-size: 15px;" class="fas fa-align-justify" aria-hidden="true"></i>&nbsp;';
        }

        if (full.IsFileMaster == "False") {
            data = '<span class="text-warning">' + data + '<span>';
        } else {
            data = '<span class="text-primary">' + data + '<span>';
        }

        return icon + data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ReposName').withTitle('{{"CONTRACT_CURD_TAB_FILE_LIST_COL_CATEGORY_NAME" | translate}}').renderWith(function (data, type, full) {
        return '<i class="fa fa-folder-open icon-state-warning"></i>&nbsp' + data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Desc').withTitle('{{"CONTRACT_CURD_TAB_FILE_LIST_COL_DESCRIPTION" | translate}}').notSortable().renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('EditedFileTime').withTitle('{{"CONTRACT_CURD_TAB_FILE_LIST_COL_EDITED_TIME" | translate}}').renderWith(function (data, type, full) {
        return data != "" ? $filter('date')(new Date(data), 'HH:mm dd/MM/yyyy') : null;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('EditedFileBy').withTitle('{{"CONTRACT_CURD_TAB_FILE_LIST_COL_EDITED_BY" | translate}}').renderWith(function (data, type, full) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').withTitle('{{"CONTRACT_CURD_TAB_FILE_COL_ACTION" | translate}}').withOption('sClass', 'w75 nowrap text-center').renderWith(function (data, type, full) {
        var excel = ['.XLSM', '.XLSX', '.XLS'];
        var document = ['.TXT'];
        var word = ['.DOCX', '.DOC'];
        var pdf = ['.PDF'];
        var powerPoint = ['.PPS', '.PPTX', '.PPT'];
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        var icon = "";
        var typefile = "#";
        if (excel.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            typefile = 'excel';
            return '<a ng-click="dowload(\'' + full.FileCode + '\')"  style="width: 25px; height: 25px; padding: 0px" title="{{&quot; EDMSR_DOWNLOAD &quot; | translate}} - ' + full.FileName + '" class="btn btn-icon-only btn-circle btn-outline green"><i class="fa fa-download pt5"></i></a>' +
                '<a ng-click="viewExcel(' + full.Id + ', 1' + ')" title="{{&quot;EDMSR_BTN_EDIT_FILE &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-eye pt5"></i></a>';
        } else if (word.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            typefile = 'Syncfusion';
            return '<a ng-click="dowload(\'' + full.FileCode + '\')"  style="width: 25px; height: 25px; padding: 0px" title="{{&quot; EDMSR_DOWNLOAD &quot; | translate}} - ' + full.FileName + '" class="btn btn-icon-only btn-circle btn-outline green"><i class="fa fa-download pt5"></i></a>' +
                '<a ng-click="viewWord(' + full.Id + ', 1' + ')" title="{{&quot; EDMSR_BTN_EDIT_FILE &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-eye pt5"></i></a>';
        } else if (pdf.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            typefile = 'pdf';
            return '<a ng-click="dowload(\'' + full.FileCode + '\')"  style="width: 25px; height: 25px; padding: 0px" title="{{&quot; EDMSR_DOWNLOAD &quot; | translate}} - ' + full.FileName + '" class="btn btn-icon-only btn-circle btn-outline green"><i class="fa fa-download pt5"></i></a>' +
                '<a ng-click="viewPDF(' + full.Id + ', 1' + ')" title="{{&quot; EDMSR_BTN_EDIT_FILE &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-eye pt5"></i></a>';
        } else if (document.indexOf(full.FileTypePhysic.toUpperCase()) !== -1 || image.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            return '<a ng-click="dowload(\'' + full.FileCode + '\')"  style="width: 25px; height: 25px; padding: 0px" title="{{&quot; EDMSR_DOWNLOAD &quot; | translate}} - ' + full.FileName + '" class="btn btn-icon-only btn-circle btn-outline green"><i class="fa fa-download pt5"></i></a>' +
                '<a ng-click="view(' + full.Id + ')" title="{{&quot; EDMSR_BTN_EDIT_FILE &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-eye pt5"></i></a>';
        } else {
            return '<a ng-click="dowload(\'' + full.FileCode + '\')"  style="width: 25px; height: 25px; padding: 0px" title="{{&quot; EDMSR_DOWNLOAD &quot; | translate}} - ' + full.FileName + '" class="btn btn-icon-only btn-circle btn-outline green"><i class="fa fa-download pt5"></i></a>' +
                '<a ng-click="getObjectFile(0)" title="{{&quot; EDMSR_BTN_EDIT_FILE &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-eye pt5"></i></a>';
        }

        if (full.TypeFile == "SHARE") {
            return '<a ng-click="dowload(\'' + full.FileCode + '\')" target="_blank" style="width: 25px; height: 25px; padding: 0px" title="{{&quot; EDMSR_DOWNLOAD &quot; | translate}} - ' + full.FileName + '" class="btn btn-icon-only btn-circle btn-outline green " download><i class="fa fa-download pt5"></i></a>';
        } else {
            return '<a ng-click="getObjectFile(' + full.Id + ')" target="_blank" href=' + typefile + ' title="{{&quot; EDMSR_SEE &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-eye pt5"></i></a>' +
                '<a ng-click="dowload(\'' + full.FileCode + '\')"  style="width: 25px; height: 25px; padding: 0px" title="{{&quot; EDMSR_DOWNLOAD &quot; | translate}} - ' + full.FileName + '" class="btn btn-icon-only btn-circle btn-outline green"><i class="fa fa-download pt5"></i></a>';
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
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
    $scope.reload = function () {
        reloadData(true);
    }
    $rootScope.reloadFile = function () {
        $scope.reload();
    }

    $scope.search = function () {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderRepository + '/contractTabFileSearch.html',
            windowClass: 'modal-file',
            backdrop: 'static',
            controller: function ($scope, $uibModalInstance) {
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: '30',
        });
        modalInstance.result.then(function (d) {
            reloadData()
        }, function () { });
    }
    $scope.add = function () {
        if ($scope.file == '' || $scope.file == undefined) {
            App.toastrError(caption.COM_MSG_CHOSE_FILE);
        } else {
            var data = new FormData();
            data.append("FileUpload", $scope.file);
            data.append("RequestCode", $rootScope.RequestCode);
            data.append("IsMore", false);
            dataserviceRepository.insertContractFile(data, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                    $scope.reload();
                }
            });
        }
    }
    $scope.edit = function (fileName, id) {
        dataserviceRepository.getContractFile(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                rs.Object.FileName = fileName;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: ctxfolderRepository + '/tabFileEdit.html',
                    controller: 'tabFileEdit',
                    windowClass: "modal-file",
                    backdrop: 'static',
                    size: '55',
                    resolve: {
                        para: function () {
                            return rs.Object;
                        }
                    }
                });
                modalInstance.result.then(function (d) {
                    reloadData()
                }, function () { });
            }
        })
    }
    $scope.delete = function (id) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = caption.COM_MSG_DELETE_CONFIRM_COM;
                $scope.ok = function () {
                    dataserviceRepository.deleteContractFile(id, function (result) {
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
            $scope.reload();
        }, function () {
        });
    }
    $scope.share = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderFileShare + '/fileShare.html',
            controller: 'tabFileShare',
            windowClass: 'modal-center',
            backdrop: 'static',
            size: '60',
        });
        modalInstance.result.then(function (d) {
            reloadData()
        }, function () { });
    }
    $scope.viewFile = function (id) {
        //dataserviceRepository.getByteFile(id, function (rs) {rs=rs.data;
        //    
        //    var blob = new Blob([rs.Object], { type: "application/msword;charset=utf-8" });
        //    var blobUrl = URL.createObjectURL(blob);
        //    var url = window.encodeURIComponent(blobUrl);
        //    window.open('https://docs.google.com/gview?url=' + "https://facco.s-work.vn" + '' + url + '&embedded=true', '_blank');
        //})
        //var userModel = {};
        //var listdata = $('#tblDataFile').DataTable().data();
        //for (var i = 0; i < listdata.length; i++) {
        //    if (listdata[i].Id == id) {
        //        userModel = listdata[i];
        //        break;
        //    }
        //}
        //
        //var dt = userModel.Url;
        //dt = dt.replace("\/", "\\");
        //var url1 = "upload\\repository" + dt;
        //url1 = "\\uploads\\repository\\3.THÔNG TIN CHUNG\\mail vib.docx";
        //var url = window.encodeURIComponent(url1);
        //window.open('https://docs.google.com/gview?url=' + "https://facco.s-work.vn" + '' + url + '&embedded=true', '_blank');
    }
    $scope.viewImage = function (id) {
        //var userModel = {};
        //var listdata = $('#tblDataFile').DataTable().data();
        //for (var i = 0; i < listdata.length; i++) {
        //    if (listdata[i].Id == id) {
        //        userModel = listdata[i];
        //        break;
        //    }
        //}
        //toDataUrl(window.location.origin + userModel.Url, function (myBase64) {
        //    var modalInstance = $uibModal.open({
        //        templateUrl: '/views/admin/edmsRepository/imageViewer.html',
        //        controller: 'contractTabFileImageViewer',
        //        backdrop: 'static',
        //        size: '40',
        //        resolve: {
        //            para: function () {
        //                return myBase64;
        //            }
        //        }
        //    });
        //    modalInstance.result.then(function (d) {
        //    }, function () {
        //    });
        //});
    }
    $scope.dowload = function (fileCode) {
        location.href = "/Admin/EDMSRepository/DownloadFile?fileCode="
            + fileCode;
    }
    $scope.extend = function (id) {
        dataserviceRepository.getSuggestionsContractFile($rootScope.RequestCode, function (rs) {
            rs = rs.data;
            var data = rs != '' ? rs : {};
            var modalInstance = $uibModal.open({
                templateUrl: ctxfolderRepository + '/tabFileAdd.html',
                controller: 'tabFileAdd',
                windowClass: 'modal-file',
                backdrop: 'static',
                size: '55',
                resolve: {
                    para: function () {
                        return data;
                    }
                }
            });
            modalInstance.result.then(function (d) {
                reloadData()
            }, function () { });
        })
    }
    $scope.loadFile = function (event) {
        $scope.file = event.target.files[0];
    }
    $scope.getObjectFile = function (id) {
        var userModel = {};
        var listdata = $('#tblData').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].FileID == id) {
                userModel = listdata[i];
                break;
            }
        }
        dataserviceRepository.checkPermissionFileNoShare(userModel.FileCode, function (rs) {
            rs = rs.data;
            if (rs == true) {
                dataserviceRepository.getItemFile(id, false, 0, function (rs) {

                });
            }
            else {
                App.toastrError(caption.COM_MSG_NO_PERMISSION);
            }
        })
    };
    $scope.viewExcel = function (id, mode) {
        var userModel = {};
        var listdata = $('#tblDataContractFile').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }
        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            dataserviceRepository.getItemFile(id, true, mode, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    if (rs.ID === -1) {
                        App.toastrError(rs.Title);
                        setTimeout(function () {
                            window.open('/Admin/Excel#', '_blank');
                        }, 2000);
                    } else {
                        App.toastrError(rs.Title);
                    }
                    return null;
                } else {
                    window.open('/Admin/Excel#', '_blank');
                }
            });
        }
    };
    $scope.viewWord = function (id, mode) {
        var userModel = {};
        var listdata = $('#tblDataContractFile').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }

        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            dataserviceRepository.getItemFile(id, true, mode, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    if (rs.ID === -1) {
                        App.toastrError(rs.Title);
                        setTimeout(function () {
                            window.open('/Admin/Docman#', '_blank');
                        }, 2000);
                    } else {
                        App.toastrError(rs.Title);
                    }
                    return null;
                } else {
                    window.open('/Admin/Docman#', '_blank');
                }
            });
        }
    };
    $scope.viewPDF = function (id, mode) {
        var userModel = {};
        var listdata = $('#tblDataContractFile').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }
        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            dataserviceRepository.getItemFile(id, true, mode, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    if (rs.ID === -1) {
                        App.toastrError(rs.Title);
                        setTimeout(function () {
                            window.open('/Admin/PDF#', '_blank');
                        }, 2000);
                    } else {
                        App.toastrError(rs.Title);
                    }
                    return null;
                } else {
                    window.open('/Admin/PDF#', '_blank');
                }
            });
        }
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
    }, 200);
});

//category
app.controller('addCategory', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataserviceRepository, $filter, $translate) {
    var vm = $scope;
    $scope.breadcrumb = [];
    $scope.treeDataRepository = [];
    $scope.listModule = [{
        Code: 'PROJECT', Name: 'Dự án'
    }, {
        Code: 'CARD_ASSIGN', Name: 'Thẻ việc'
    }, {
        Code: 'EMPLOYEES', Name: 'Nhân sự'
    }, {
        Code: 'PRODUCT', Name: 'Sản phẩm'
    }, {
        Code: 'WORKFLOW', Name: 'Luồng việc'
    },]
    $scope.model = {
        CatCode: '',
        CatName: '',
        CatParent: '',
        ModuleFileUploadDefault: '',
        ListRepository: []
    };
    $scope.repository = {
        TypeRepos: '',
        ReposCode: '',
        Folder: '',
        ParentId: ''
    }
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/EDMSRepository/JtableFolderWithRepository",
            beforeSend: function (jqXHR, settings) {
                resetCheckbox();
                App.blockUI({
                    target: "#modal-body",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.ReposCode = $scope.repository.ReposCode;
                d.Folder = $scope.repository.Folder;
                d.ParentId = $scope.repository.ParentId;
            },
            complete: function () {
                App.unblockUI("#modal-body");
                $(".dataTables_scrollBody").addClass('scroller-sm-fade');
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(30)
        .withOption('order', [1, 'desc'])
        .withOption('serverSide', true)
        .withOption('scrollY', "50vh")
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
            if ($scope.selected[data._STT]) {
                $(row).addClass('selected');
            }
            $(row).find('td:not(:has(label.mt-checkbox))').on('dblclick', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {

                } else {
                    if (data.IsDirectory == 'True') {
                        $scope.breadcrumb.push({ Id: data.Id, Path: data.FileName, Name: data.FileName });
                        $scope.$apply();
                        //(2:Server, 1:Google driver)
                        if ($scope.repository.TypeRepos == 'SERVER') {
                            var folder = '';
                            for (var i = 0; i < $scope.breadcrumb.length; i++) {
                                if ($scope.breadcrumb[i].Path != '') {
                                    folder += "/" + $scope.breadcrumb[i].Path;
                                }
                            }
                            $scope.repository.Folder = folder;
                        } else if ($scope.repository.TypeRepos == 'DRIVER') {
                            $scope.repository.ParentId = data.Id;
                        }
                        $scope.reload();
                    }
                }
            });
            $(row).find('td:not(:has(label.mt-checkbox))').on('click', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {
                    for (var i = 0; i < $scope.selected.length; i++) {
                        $scope.selected[i] = false;
                    }
                    $scope.selected[data.Id] = !$scope.selected[data.Id];
                } else {
                    if (data.IsDirectory == 'True') {
                        for (var i = 0; i < $scope.selected.length; i++) {
                            $scope.selected[i] = false;
                        }
                        $scope.model.ListRepository.splice(0);
                        var self = $(this).parent();
                        var isSelected = $(self).hasClass('selected');
                        $('#tblDataDetailRepository').DataTable().$('tr.selected').removeClass('selected');
                        if (isSelected) {
                            $(self).removeClass('selected');
                            $scope.selected[data._STT] = false;
                        } else {
                            $(self).addClass('selected');
                            $scope.selected[data._STT] = true;
                            var obj = {
                                Path: $scope.repository.TypeRepos == 'SERVER' ? $scope.repository.Folder + "/" + data.FileName : "",
                                FolderId: data.Id,
                                FolderName: data.FileName
                            }
                            $scope.model.ListRepository.push(obj);
                        }
                    } else {
                        App.toastrError(caption.EDMSR_MSG_SELECT_FORDER)
                    }
                }

                vm.selectAll = false;
                $scope.$apply();
            });
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("FileID").withTitle('').notSortable()
        .renderWith(function (data, type, full, meta) {
            if (($scope.model.ListRepository.findIndex(x => x.FolderId == full.Id) != -1 && full.Id != "") ||
                $scope.model.ListRepository.findIndex(x => x.Path == $scope.repository.Folder + "/" + full.FileName) != -1) {
                $scope.selected[full._STT] = true;
            }
            else {
                $scope.selected[full._STT] = false;
            }
            if (full.IsDirectory == 'True') {
                return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full._STT + ']" ng-click="toggleOne(selected,$event,\'' + full.Id + '\',\'' + full.FileName + '\')"/><span></span></label>';
            }
        }).withOption('sWidth', '30px').withOption('sClass', ''));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileName').withOption('sClass', '').withTitle($translate('EDMSR_LIST_COL_FILE_NAME')).withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
        var dataSubstr = data.length > 35 ? data.substr(0, 35) + " ..." : data;
        if (full.IsDirectory == 'True') {
            return '<i class="jstree-icon jstree-themeicon fa fa-folder icon-state-warning jstree-themeicon-custom" aria-hidden="true"></i>&nbsp;' + dataSubstr;
        } else {
            if ($scope.repository.TypeRepos == 'SERVER') {
                var idxDot = data.lastIndexOf(".") + 1;
                var extFile = data.substr(idxDot, data.length).toLowerCase();
                var excel = ['XLSM', 'XLSX', 'XLS'];
                var document = ['TXT'];
                var word = ['DOCX', 'DOC'];
                var pdf = ['PDF'];
                var powerPoint = ['PPS', 'PPTX', 'PPT'];
                var image = ['JPG', 'PNG', 'TIF', 'TIFF'];
                if (excel.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(106,170,89);font-size: 15px;" class="fa fa-file-excel-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (word.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (document.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(0,0,0);font-size: 15px;" class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (pdf.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (powerPoint.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-powerpoint-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (image.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fa fa-picture-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fas fa-align-justify" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                }
            } else {
                var txtMimetypes = ["text/plain"];
                var wordMimetypes = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/vnd.google-apps.document"];
                var excelMimetypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.google-apps.spreadsheet"];
                var pdfMimetypes = ["application/pdf"];
                var powerPointMimetypes = ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
                var imageMimetypes = ["image/jpeg", "image/tiff", "image/ief", "image/png", "image/svg+xml", "image/webp", "image/vnd.microsoft.icon", "image/bmp"];
                if (excelMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(106,170,89);font-size: 15px;" class="fa fa-file-excel-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (wordMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (txtMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(0,0,0);font-size: 15px;" class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (pdfMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (powerPointMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-powerpoint-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (imageMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fa fa-picture-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fas fa-align-justify" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                }
            }
        }
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileSize').withTitle($translate('EDMSR_LIST_COL_SIZE')).withOption('sClass', 'nowrap dataTable-100').renderWith(function (data, type, full) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (data == '') {
            return '';
        } else if (data == 0) {
            return '0 Byte';
        } else {
            var i = parseInt(Math.floor(Math.log(data) / Math.log(1024)));
            return Math.round(data / Math.pow(1024, i), 2) + ' ' + sizes[i];
        }
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('LastModifiedDate').withTitle($translate('EDMSR_LIST_COL_MODIFIED_DATE')).withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
        return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy HH:mm') : null;
    }));
    vm.reloadData = reloadData;
    vm.dtInstance = {};
    function reloadData(resetPaging) {
        vm.dtInstance.reloadData(callback, resetPaging);
    }
    function callback(json) {

    }
    function toggleAll(selectAll, selectedItems) {
        if (selectAll)
            $('#tblDataDetailRepository').DataTable().$('tr:not(.selected)').addClass('selected');
        else
            $('#tblDataDetailRepository').DataTable().$('tr.selected').removeClass('selected');
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                selectedItems[id] = selectAll;
            }
        }
    }
    function toggleOne(selectedItems, evt, fileId, fileName) {
        var isSelected = $(evt.target).closest('tr').hasClass('selected');
        $('#tblDataDetailRepository').DataTable().$('tr.selected').removeClass('selected');
        if (isSelected) {
            $(evt.target).closest('tr').removeClass('selected');
            $scope.model.ListRepository.splice(0);
        } else {
            $(evt.target).closest('tr').addClass('selected');
            $scope.model.ListRepository.splice(0);
            var obj = {
                Path: $scope.repository.TypeRepos == 'SERVER' ? $scope.repository.Folder + "/" + fileName : "",
                FolderId: fileId,
                FolderName: fileName
            }
            $scope.model.ListRepository.push(obj);
        }
        //$(evt.target).closest('tr').toggleClass('selected');
        for (var i = 0; i < $scope.selected.length; i++) {
            $scope.selected[i] = false;
        }
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
    $scope.init = function () {
        dataserviceRepository.getParentCategory({ IdI: null }, function (rs) {
            rs = rs.data;
            $scope.treeDataCategory = rs;
        });
    }
    $scope.init();
    $scope.submit = function () {
        var listNoteSelect = $scope.treeInstance.jstree(true).get_checked(true);
        if (listNoteSelect.length == 0) {
            App.toastrError(caption.EDMSR_MSG_PLS_SELECT_SERVER);
        }
        else {
            if ($scope.addformCategory.validate()) {
                var listRepository = $scope.model.ListRepository;
                var listdata = $('#tblDataDetailRepository').DataTable().data();
                var checkSelect = $scope.selected.find(function (element) {
                    if (element == true) return true;
                });
                if (checkSelect) {
                    //for (var j = 1; j < $scope.selected.length; j++) {
                    //    if ($scope.selected[j] == true) {
                    //        var obj = {
                    //            Path: $scope.repository.Folder + "/" + listdata[j - 1].FileName,
                    //            FolderId: listdata[j - 1].Id,
                    //            FolderName: listdata[j - 1].FileName
                    //        }
                    //        listRepository.push(obj);
                    //    }
                    //}
                    var obj = {
                        Category: $scope.model,
                        ReposCode: listNoteSelect[0].original.resCode,
                        TypeRepos: $scope.repository.TypeRepos,
                        ListRepository: listRepository
                    }
                    console.log(obj)
                    dataserviceRepository.insertCategory(obj, function (rs) {
                        rs = rs.data;
                        if (rs.Error) {
                            App.toastrError(rs.Title);
                        } else {
                            App.toastrSuccess(rs.Title);
                            $uibModalInstance.close();
                        }
                    });
                } else {
                    App.toastrError(caption.EDMSR_MSG_SELECT_FORDER_ABSO)
                }
            }
        }
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.readyCB = function () {
        App.blockUI({
            target: "#contentMainRepository",
            boxed: true,
            message: 'loading...'
        });
        dataserviceRepository.getTreeRepository(function (result) {
            result = result.data;
            if (!result.Error) {
                var root = {
                    id: 'root',
                    parent: "#",
                    text: "Danh sách",
                    state: { selected: false, opened: true, checkbox_disabled: true, disabled: true }
                }
                $scope.treeDataRepository.push(root);
                var index = 0;
                $scope.ListParent = result.filter(function (item) {
                    return (item.ParentCode == '#');
                });
                for (var i = 0; i < result.length; i++) {
                    if (result[i].ParentCode == '#') {
                        var stt = $scope.ListParent.length - index;
                        if (stt.toString().length == 1) {
                            stt = "0" + stt;
                        }
                        index = index + 1;
                        var data = {
                            id: result[i].Code,
                            parent: 'root',
                            text: stt + ' - ' + result[i].Title,
                            resId: result[i].Id,
                            resCode: result[i].Code,
                            resName: result[i].Title,
                            resParent: result[i].ParentCode,
                            typeRepos: result[i].TypeRepos,
                            state: { selected: false, opened: true }
                        }
                        $scope.treeDataRepository.push(data);
                    } else {
                        var data = {
                            id: result[i].Code,
                            parent: result[i].ParentCode,
                            text: result[i].Code + ' - ' + result[i].Title,
                            resId: result[i].Id,
                            resCode: result[i].Code,
                            resName: result[i].Title,
                            resParent: result[i].ParentCode,
                            typeRepos: result[i].TypeRepos,
                            state: { selected: false, opened: true }
                        }
                        $scope.treeDataRepository.push(data);
                    }
                }
                App.unblockUI("#contentMainRepository");
            }
        });
    }
    $scope.selectNodeFileManage = function () {
        var listSelect = [];
        var listNoteSelect = $scope.treeInstance.jstree(true).get_checked(true);
        listSelect.push(listNoteSelect[0].id);
        $scope.breadcrumb = [];
        $scope.breadcrumb.push({ Id: "", Path: "", Name: listNoteSelect[0].original.resName });
        $scope.repository.ReposCode = listNoteSelect[0].original.resCode;
        $scope.repository.TypeRepos = listNoteSelect[0].original.typeRepos;
        $scope.repository.Folder = "";
        $scope.repository.ParentId = "";
        $scope.reload();
    }
    $scope.deselectNodeRepository = function () {
        $scope.breadcrumb = [];
        $scope.repository.ReposCode = '';
        $scope.repository.TypeRepos = '';
        $scope.repository.Folder = "";
        $scope.repository.ParentId = "";
        $scope.reload();
    }
    $scope.selectBreadcrumbRepository = function (index, listBreadcrumb) {
        var folder = '';
        for (var i = 0; i < listBreadcrumb.length; i++) {
            if (i == index) {
                folder += "/" + $scope.breadcrumb[i].Path;
                $scope.repository.ParentId = listBreadcrumb[i].Id;

            } else if (i > index) {
                listBreadcrumb.splice(i, 1);
                i--;
            } else if (i < index) {
                folder += "/" + $scope.breadcrumb[i].Path;
            }
        }
        $scope.repository.Folder = folder;
        $scope.reload();
    }
    $scope.treeConfig = {
        core: {
            multiple: false,
            animation: true,
            error: function (error) {
                $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
            },
            check_callback: true,
            worker: true,

        },
        types: {
            default: {
                icon: 'fas fa-store',
            }
        },
        version: 1,
        plugins: ['checkbox', 'types', 'search'],
        checkbox: {
            "three_state": false,
            "whole_node": true,
            "keep_selected_style": true,
            "cascade": "undetermined",
        }
    };
    $scope.treeEvents = {
        'ready': $scope.readyCB,
        'select_node': $scope.selectNodeFileManage,
        'deselect_node': $scope.deselectNodeRepository,
    }
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});
app.controller('editCategory', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataserviceRepository, $filter, $translate, para) {
    var vm = $scope;
    $scope.breadcrumb = [];
    $scope.treeDataRepository = [];
    $scope.listModule = [{
        Code: 'PROJECT', Name: 'Dự án'
    }, {
        Code: 'CARD_ASSIGN', Name: 'Thẻ việc'
    }, {
        Code: 'EMPLOYEES', Name: 'Nhân sự'
    }, {
        Code: 'PRODUCT', Name: 'Sản phẩm'
    }, {
        Code: 'WORKFLOW', Name: 'Luồng việc'
    },]
    $scope.repository = {
        TypeRepos: '',
        ReposCode: para.ReposCode,
        Folder: '',
        ParentId: ''
    }
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/EDMSRepository/JtableFolderWithRepository",
            beforeSend: function (jqXHR, settings) {
                resetCheckbox();
                App.blockUI({
                    target: "#modal-body",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.ReposCode = $scope.repository.ReposCode;
                d.Folder = $scope.repository.Folder;
                d.ParentId = $scope.repository.ParentId;
            },
            complete: function () {
                App.unblockUI("#modal-body");
                $(".dataTables_scrollBody").addClass('scroller-sm-fade');
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(30)
        .withOption('order', [1, 'desc'])
        .withOption('serverSide', true)
        .withOption('scrollY', "50vh")
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
            if ($scope.selected[data._STT]) {
                $(row).addClass('selected');
            }
            $(row).find('td:not(:has(label.mt-checkbox))').on('dblclick', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {

                } else {
                    if (data.IsDirectory == 'True') {
                        $scope.breadcrumb.push({ Id: data.Id, Path: data.FileName, Name: data.FileName });
                        $scope.$apply();
                        //(2:Server, 1:Google driver)
                        if ($scope.repository.TypeRepos == 'SERVER') {
                            var folder = '';
                            for (var i = 0; i < $scope.breadcrumb.length; i++) {
                                if ($scope.breadcrumb[i].Path != '') {
                                    folder += "/" + $scope.breadcrumb[i].Path;
                                }
                            }
                            $scope.repository.Folder = folder;
                        } else if ($scope.repository.TypeRepos == 'DRIVER') {
                            $scope.repository.ParentId = data.Id;
                        }
                        $scope.reload();
                    }
                }
            }); // No effect
            $(row).find('td:not(:has(label.mt-checkbox))').on('click', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {
                    for (var i = 0; i < $scope.selected.length; i++) {
                        $scope.selected[i] = false;
                    }
                    $scope.selected[data.Id] = !$scope.selected[data.Id];
                } else {
                    if (data.IsDirectory == 'True') {
                        for (var i = 0; i < $scope.selected.length; i++) {
                            $scope.selected[i] = false;
                        }
                        $scope.model.ListRepository.splice(0);
                        var self = $(this).parent();
                        var isSelected = $(self).hasClass('selected');
                        $('#tblDataDetailRepository').DataTable().$('tr.selected').removeClass('selected');
                        if (isSelected) {
                            $(self).removeClass('selected');
                            $scope.selected[data._STT] = false;
                        } else {
                            $(self).addClass('selected');
                            $scope.selected[data._STT] = true;
                            var obj = {
                                Path: $scope.repository.TypeRepos == 'SERVER' ? $scope.repository.Folder + "/" + data.FileName : "",
                                FolderId: data.Id,
                                FolderName: data.FileName
                            }
                            $scope.model.ListRepository.push(obj);
                        }
                    } else {
                        App.toastrError(caption.EDMSR_MSG_SELECT_FORDER)
                    }
                }

                vm.selectAll = false;
                $scope.$apply();
            });
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("FileID").withTitle('').notSortable()
        .renderWith(function (data, type, full, meta) {
            if (($scope.model.ListRepository.findIndex(x => x.FolderId == full.Id) != -1 && full.Id != "") ||
                $scope.model.ListRepository.findIndex(x => x.Path == $scope.repository.Folder + "/" + full.FileName) != -1) {
                $scope.selected[full._STT] = true;
            }
            else {
                $scope.selected[full._STT] = false;
            }
            if (full.IsDirectory == 'True') {
                return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full._STT + ']" ng-click="toggleOne(selected,$event,\'' + full.Id + '\',\'' + full.FileName + '\')"/><span></span></label>';
            }
        }).withOption('sWidth', '30px').withOption('sClass', ''));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileName').withOption('sClass', '').withTitle($translate('EDMSR_LIST_COL_FILE_NAME')).withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
        var dataSubstr = data.length > 35 ? data.substr(0, 35) + " ..." : data;
        if (full.IsDirectory == 'True') {
            return '<i class="jstree-icon jstree-themeicon fa fa-folder icon-state-warning jstree-themeicon-custom" aria-hidden="true"></i>&nbsp;' + dataSubstr;
        } else {
            if ($scope.repository.TypeRepos == 'SERVER') {
                var idxDot = data.lastIndexOf(".") + 1;
                var extFile = data.substr(idxDot, data.length).toLowerCase();
                var excel = ['XLSM', 'XLSX', 'XLS'];
                var document = ['TXT'];
                var word = ['DOCX', 'DOC'];
                var pdf = ['PDF'];
                var powerPoint = ['PPS', 'PPTX', 'PPT'];
                var image = ['JPG', 'PNG', 'TIF', 'TIFF'];
                if (excel.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(106,170,89);font-size: 15px;" class="fa fa-file-excel-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (word.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (document.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(0,0,0);font-size: 15px;" class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (pdf.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (powerPoint.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-powerpoint-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (image.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fa fa-picture-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fas fa-align-justify" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                }
            } else {
                var txtMimetypes = ["text/plain"];
                var wordMimetypes = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/vnd.google-apps.document"];
                var excelMimetypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.google-apps.spreadsheet"];
                var pdfMimetypes = ["application/pdf"];
                var powerPointMimetypes = ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
                var imageMimetypes = ["image/jpeg", "image/tiff", "image/ief", "image/png", "image/svg+xml", "image/webp", "image/vnd.microsoft.icon", "image/bmp"];
                if (excelMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(106,170,89);font-size: 15px;" class="fa fa-file-excel-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (wordMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (txtMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(0,0,0);font-size: 15px;" class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (pdfMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (powerPointMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-powerpoint-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (imageMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fa fa-picture-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fas fa-align-justify" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                }
            }
        }
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileSize').withTitle($translate('EDMSR_LIST_COL_SIZE')).withOption('sClass', 'nowrap dataTable-100').renderWith(function (data, type, full) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (data == '') {
            return '';
        } else if (data == 0) {
            return '0 Byte';
        } else {
            var i = parseInt(Math.floor(Math.log(data) / Math.log(1024)));
            return Math.round(data / Math.pow(1024, i), 2) + ' ' + sizes[i];
        }
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('LastModifiedDate').withTitle($translate('EDMSR_LIST_COL_MODIFIED_DATE')).withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
        return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy HH:mm') : null;
    }));
    vm.reloadData = reloadData;
    vm.dtInstance = {};
    function reloadData(resetPaging) {
        vm.dtInstance.reloadData(callback, resetPaging);
    }
    function callback(json) {

    }
    function toggleAll(selectAll, selectedItems) {
        if (selectAll)
            $('#tblDataDetailRepository').DataTable().$('tr:not(.selected)').addClass('selected');
        else
            $('#tblDataDetailRepository').DataTable().$('tr.selected').removeClass('selected');
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                selectedItems[id] = selectAll;
            }
        }
    }
    function toggleOne(selectedItems, evt, fileId, fileName) {
        var isSelected = $(evt.target).closest('tr').hasClass('selected');
        $('#tblDataDetailRepository').DataTable().$('tr.selected').removeClass('selected');
        if (isSelected) {
            $(evt.target).closest('tr').removeClass('selected');
            $scope.model.ListRepository.splice(0);
        } else {
            $(evt.target).closest('tr').addClass('selected');
            $scope.model.ListRepository.splice(0);
            var obj = {
                Path: $scope.repository.TypeRepos == 'SERVER' ? $scope.repository.Folder + "/" + fileName : "",
                FolderId: fileId,
                FolderName: fileName
            }
            $scope.model.ListRepository.push(obj);
        }
        //$(evt.target).closest('tr').toggleClass('selected');
        for (var i = 0; i < $scope.selected.length; i++) {
            $scope.selected[i] = false;
        }
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
    $scope.initLoad = function () {
        $scope.model = para.Category;
        $scope.model.ListRepository = para.ListRepository;
        $scope.repository.TypeRepos = para.TypeRepos;
        dataserviceRepository.getParentCategory({ IdI: [para.Category.Id] }, function (rs) {
            rs = rs.data;
            $scope.treeDataCategory = rs;
        });
    }
    $scope.initLoad();
    $scope.submit = function () {
        var listNoteSelect = $scope.treeInstance.jstree(true).get_checked(true);
        if (listNoteSelect.length == 0) {
            App.toastrError(caption.EDMSR_MSG_PLS_SELECT_SERVER);
        } else {
            if ($scope.editformCategory.validate()) {
                var listRepository = $scope.model.ListRepository;
                var listdata = $('#tblDataDetailRepository').DataTable().data();
                var checkSelect = $scope.selected.find(function (element) {
                    if (element == true) return true;
                });
                if (checkSelect) {
                    //for (var j = 1; j < $scope.selected.length; j++) {
                    //    if ($scope.selected[j] == true) {
                    //        var obj = {
                    //            Path: $scope.repository.Folder + "/" + listdata[j - 1].FileName,
                    //            FolderId: listdata[j - 1].Id,
                    //            FolderName: listdata[j - 1].FileName
                    //        }
                    //        listRepository.push(obj);
                    //    }
                    //}
                    var obj = {
                        Category: $scope.model,
                        ReposCode: listNoteSelect[0].original.resCode,
                        TypeRepos: $scope.repository.TypeRepos,
                        ListRepository: listRepository
                    }
                    dataserviceRepository.updateCategory(obj, function (rs) {
                        rs = rs.data;
                        if (rs.Error) {
                            App.toastrError(rs.Title);
                        } else {
                            App.toastrSuccess(rs.Title);
                            $uibModalInstance.close();
                        }
                    });
                } else {
                    App.toastrError(caption.EDMSR_MSG_SELECT_FORDER_ABSO)
                }
            }
        }
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.readyCB = function () {
        App.blockUI({
            target: "#contentMainFileManage",
            boxed: true,
            message: 'loading...'
        });
        dataserviceRepository.getTreeRepository(function (result) {
            result = result.data;
            if (!result.Error) {
                var root = {
                    id: 'root',
                    parent: "#",
                    text: "Danh sách",
                    state: { selected: false, opened: true, checkbox_disabled: true, disabled: true }
                }
                $scope.breadcrumb = [];
                $scope.treeDataRepository.push(root);
                var index = 0;
                $scope.ListParent = result.filter(function (item) {
                    return (item.ParentCode == '#');
                });
                for (var i = 0; i < result.length; i++) {
                    if (result[i].ParentCode == '#') {
                        var stt = $scope.ListParent.length - index;
                        if (stt.toString().length == 1) {
                            stt = "0" + stt;
                        }
                        index = index + 1;
                        var data = {
                            id: result[i].Code,
                            parent: 'root',
                            text: stt + ' - ' + result[i].Title,
                            resId: result[i].Id,
                            resCode: result[i].Code,
                            resName: result[i].Title,
                            resParent: result[i].ParentCode,
                            typeRepos: result[i].TypeRepos,
                            state: { selected: para.ReposCode == result[i].Code ? true : false, opened: true }
                        }

                        if (para.ReposCode == result[i].Code) {
                            $scope.breadcrumb.push({ Id: "", Path: "", Name: result[i].Title });
                        }
                        $scope.treeDataRepository.push(data);
                    } else {
                        var data = {
                            id: result[i].Code,
                            parent: result[i].ParentCode,
                            text: result[i].Code + ' - ' + result[i].Title,
                            resId: result[i].Id,
                            resCode: result[i].Code,
                            resName: result[i].Title,
                            resParent: result[i].ParentCode,
                            typeRepos: result[i].TypeRepos,
                            state: { selected: para.ReposCode == result[i].Code ? true : false, opened: true }
                        }
                        $scope.treeDataRepository.push(data);
                    }
                }
                var listNoteSelect = $scope.treeInstance.jstree(true).get_checked(true);
                App.unblockUI("#contentMainRepository");
            }
        });
    }
    $scope.selectNodeFileManage = function () {
        var listSelect = [];
        var listNoteSelect = $scope.treeInstance.jstree(true).get_checked(true);
        listSelect.push(listNoteSelect[0].id);
        $scope.breadcrumb = [];
        $scope.breadcrumb.push({ Id: "", Path: "", Name: listNoteSelect[0].original.resName });
        $scope.repository.ReposCode = listNoteSelect[0].original.resCode;
        $scope.repository.TypeRepos = listNoteSelect[0].original.typeRepos;
        $scope.repository.Folder = "";
        $scope.repository.ParentId = "";
        $scope.reload();;
    }
    $scope.deselectNodeRepository = function () {
        $scope.breadcrumb = [];
        $scope.repository.ReposCode = '';
        $scope.repository.TypeRepos = '';
        $scope.repository.Folder = "";
        $scope.repository.ParentId = "";
        $scope.reload();
    }
    $scope.selectBreadcrumbRepository = function (index, listBreadcrumb) {
        var folder = '';
        for (var i = 0; i < listBreadcrumb.length; i++) {
            if (i == index) {
                folder += "/" + $scope.breadcrumb[i].Path;
                $scope.repository.ParentId = listBreadcrumb[i].Id;

            } else if (i > index) {
                listBreadcrumb.splice(i, 1);
                i--;
            } else if (i < index) {
                folder += "/" + $scope.breadcrumb[i].Path;
            }
        }
        $scope.repository.Folder = folder;
        $scope.reload();
    }
    $scope.treeConfig = {
        core: {
            multiple: false,
            animation: true,
            error: function (error) {
                $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
            },
            check_callback: true,
            worker: true,

        },
        types: {
            default: {
                icon: 'fas fa-store',
            }
        },
        version: 1,
        plugins: ['checkbox', 'types', 'search'],
        checkbox: {
            "three_state": false,
            "whole_node": true,
            "keep_selected_style": true,
            "cascade": "undetermined",
        }
    };
    $scope.treeEvents = {
        'ready': $scope.readyCB,
        'select_node': $scope.selectNodeFileManage,
        'deselect_node': $scope.deselectNodeRepository,
    }
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

//repository
app.controller('addRepository', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, dataserviceRepository, $filter) {
    $scope.model = {
        ReposName: '',
        Server: '',
        Account: '',
        PassWord: '',
        Token: '',
        Desc: ''
    };
    $scope.init = function () {
        dataserviceRepository.getParentCategory({ IdI: null }, function (rs) {
            rs = rs.data;
            $scope.treeData = rs;
        });
    }
    $scope.init();
    $scope.changleSelect = function (SelectType) {
        if (SelectType == "Type" && $scope.model.Type != "") {
            $scope.errorType = false;
        }
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        if (data.Type == "" || data.Type == undefined || data.Type == null) {
            $scope.errorType = true;
            mess.Status = true;
        } else {
            $scope.errorType = false;
        }
        return mess;
    };
    $scope.submit = function () {
        validationSelect($scope.model)
        if ($scope.addformRepository.validate() && !validationSelect($scope.model).Status) {
            dataserviceRepository.insertRepository($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.close();
                }
            });
        }
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});
app.controller('editRepository', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, dataserviceRepository, $filter, para) {
    $scope.init = function () {
        dataserviceRepository.getParentCategory({ IdI: null }, function (rs) {
            rs = rs.data;
            $scope.treeData = rs;
        });
        dataserviceRepository.getItemRepository(para, function (rs) {
            rs = rs.data;
            $scope.model = rs.Object;
            console.log($scope.model);
        });
    }
    $scope.init();
    $scope.changleSelect = function (SelectType) {
        if (SelectType == "Type" && $scope.model.Type != "") {
            $scope.errorType = false;
        }
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        if (data.Type == "" || data.Type == undefined || data.Type == null) {
            $scope.errorType = true;
            mess.Status = true;
        } else {
            $scope.errorType = false;
        }
        return mess;
    };
    $scope.submit = function () {
        validationSelect($scope.model)
        if ($scope.editformRepository.validate() && !validationSelect($scope.model).Status) {
            dataserviceRepository.updateRepository($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.close();
                }
            });
        }
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});
app.controller('viewer', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, para, $sce) {

    var data = para;
    $scope.url = data.url;
    $scope.isImage = data.isImage;
    if ($scope.isImage)
        $scope.url = "/" + $scope.url;
    $scope.currentProjectUrl = $sce.trustAsResourceUrl($scope.url);
    console.log($scope.currentProjectUrl);
    console.log(data);
});

//File & Extension
app.controller('addFile', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataserviceRepository, para) {
    $scope.treeDataCategory = [];
    $scope.catCode = para.CatCode;
    $scope.objectCode = para.ObjectCodeJtableFileWithRepository
    $scope.objectType = para.ObjectType;
    $scope.model = {
        NumberDocument: '',
        Tags: '',
        Desc: '',
        IsScan: false
    };
    var vm = $scope;
    vm.dt = {};
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/EDMSRepository/JtableFolderSettingWithCategory",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.CatCode = $scope.catCode;
                $scope.selected = [];
            },
            complete: function () {
                App.unblockUI("#contentMain");
                $(".dataTables_scrollBody").addClass('scroller-sm-fade');
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(30)
        .withOption('order', [0, 'desc'])
        .withOption('serverSide', true)
        .withOption('scrollY', "340px")
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
            if (data.FolderId == '' || data.FolderId == null) {
                if (para.Path == data.Path) {
                    angular.element(row).addClass('selected');
                }
            } else {
                if (para.FolderId == data.FolderId) {
                    angular.element(row).addClass('selected');
                }
            }
            $(row).find('td:not(:has(label.mt-checkbox))').on('click', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {
                } else {
                    var self = $(this).parent();
                    if ($(self).hasClass('selected')) {
                        $(self).removeClass('selected');
                        $scope.selected[data.Id] = false;
                    } else {
                        $('#tblDataFolder').DataTable().$('tr.selected').removeClass('selected');
                        $scope.selected.forEach(function (obj, index) {
                            if ($scope.selected[index])
                                $scope.selected[index] = false;
                        });
                        $(self).addClass('selected');
                        $scope.selected[data.Id] = true;
                    }
                }
                $scope.$apply();
            });
        });
    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle('').notSortable()
        .renderWith(function (data, type, full, meta) {
            if (full.FolderId == '' || full.FolderId == null) {
                if (para.Path == full.Path) {
                    $scope.selected[full.Id] = true;
                } else {
                    $scope.selected[full.Id] = false;
                }
            } else {
                if (para.FolderId == full.FolderId) {
                    $scope.selected[full.Id] = true;
                } else {
                    $scope.selected[full.Id] = false;
                }
            }
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.Id + ']" ng-click="toggleOne(selected,$event,' + full.Id + ')"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', ''));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FolderName').withTitle('{{"EDMSR_LIST_COL_FOLDER_SAVE" | translate}}').withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
        return '<i class="jstree-icon jstree-themeicon fa fa-folder icon-state-warning jstree-themeicon-custom" aria-hidden="true"></i>&nbsp;' + data;
    }));
    vm.reloadData = reloadData;
    vm.dt.dtInstance = {};
    function reloadData(resetPaging) {
        vm.dt.dtInstance.reloadData(callback, resetPaging);
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
    function toggleOne(selectedItems, evt, itemId) {
        $('#tblDataFolder').DataTable().$('tr.selected').removeClass('selected');
        for (var id in selectedItems) {
            if (id != itemId) {
                selectedItems[id] = false;
            } else {
                if (selectedItems[id]) {
                    $(evt.target).closest('tr').toggleClass('selected');
                }
            }
        }
    }

    $scope.loadFile = function (event) {
        $scope.file = event.target.files[0];
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.submit = function () {
        if ($scope.file == '' || $scope.file == undefined) {
            App.toastrError(caption.COM_MSG_CHOSE_FILE);
        }
        else {
            //debugger
            var itemSelect = [];
            if (isAllData === 'True') {

                for (var id in $scope.selected) {
                    if ($scope.selected.hasOwnProperty(id)) {
                        if ($scope.selected[id]) {
                            itemSelect.push(id);
                        }
                    }
                }
                if (itemSelect.length == 0) {
                    App.toastrError(caption.EDMSR_MSG_CHOOSE_DOC_SAVE);
                    return;
                } else if (itemSelect.length > 1) {
                    App.toastrError(caption.EDMSR_MSG_PLS_SELECT_A_FORDER);
                    return;
                }
            }
            else {
                var listdata = $('#tblDataFolder').DataTable().data();
                if (listdata.length == 0) {
                    App.toastrError("Vui lòng liên hệ quản trị viên để thiết lập thư mục lưu trữ");
                    return;
                }
                itemSelect.push(listdata[0].Id);
            }

            if (($scope.file.size / 1048576) < 1000) {
                var data = {};
                data.CateRepoSettingId = itemSelect.length !== 0 ? itemSelect[0] : "";
                data.FileUpload = $scope.file;
                data.FileName = $scope.file.name;
                data.Desc = $scope.model.Desc;
                data.Tags = $scope.model.Tags;
                data.NumberDocument = $scope.model.NumberDocument;
                data.IsScan = $scope.model.IsScan;
                if ($rootScope.RackInfo !== undefined && $rootScope.RackInfo !== null) {
                    data.RackCode = $rootScope.RackInfo.RackCode;
                    data.RackPosition = $rootScope.RackInfo.RackPosition;
                    data.ObjPackCode = $rootScope.RackInfo.ObjPackCode;
                }

                if ($rootScope.DocumentExt !== undefined && $rootScope.DocumentExt !== null && $rootScope.DocumentExt !== '') {
                    data.MetaDataExt = JSON.stringify($rootScope.DocumentExt);
                }

                $rootScope.fileUpload = $scope.file;
                var formData = new FormData();

                formData.append("FileUpload", data.FileUpload);
                formData.append("FileCode", data.FileCode);
                formData.append("FileName", data.FileName);
                formData.append("FileType", data.FileType);
                formData.append("CateRepoSettingId", data.CateRepoSettingId);
                formData.append("Tags", data.Tags);
                formData.append("Desc", data.Desc);
                formData.append("IsScan", data.IsScan);
                formData.append("ObjectCode", $scope.objectCode);
                formData.append("ObjectType", $scope.objectType);
                console.log(formData);
                if (data.ObjPackCode !== undefined && data.ObjPackCode !== '' && data.ObjPackCode !== null)
                    formData.append("ObjPackCode", data.ObjPackCode);

                if (data.RackCode !== undefined && data.RackCode !== '' && data.RackCode !== null)
                    formData.append("RackCode", data.RackCode);

                if (data.RackPosition !== undefined && data.RackPosition !== '' && data.RackPosition !== null)
                    formData.append("RackPosition", data.RackPosition);

                if (data.MetaDataExt !== undefined && data.MetaDataExt !== '' && data.MetaDataExt !== null)
                    formData.append("MetaDataExt", data.MetaDataExt);

                dataserviceRepository.insertFile(formData, function (result) {
                    console.log(formData);
                    result = result.data;
                    if (result.Error) {
                        App.toastrError(result.Title);
                    } else {
                        App.toastrSuccess(result.Title);
                        $uibModalInstance.close(result.Object);
                    }
                });
            } else {
                App.toastrError(caption.EDMSR_MSG_FILE_SIZE_LIMIT_UPLOAD);
            }

        }
    };
    $scope.ordering = function () {
        if ($scope.file === undefined || $scope.file === null) {
            return App.toastrError(caption.EDMST_MSG_SELECT_FILE_BEFORE);
        };

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + '/orderDocument.html',
            controller: 'orderDocument',
            backdrop: 'static',
            size: '65',
            resolve: {
                para: function () {
                    return $scope.file;
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    };
    $scope.extension = function () {
        if ($scope.file === undefined || $scope.file === null) {
            return App.toastrError(caption.EDMST_MSG_SELECT_FILE_BEFORE);
        };

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + '/extension.html',
            controller: 'extension',
            backdrop: 'static',
            size: '40',
            resolve: {
                para: function () {
                    return {
                        Type: 'DETAIL',
                        Object: $scope.file
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    };

    //treeview
    $scope.ctr = {};
    $scope.readyCB = function () {
        if ($scope.treeDataCategory.length == 0) {
            App.blockUI({
                target: "#contentMainRepository",
                boxed: true,
                message: 'loading...'
            });
            dataserviceRepository.getTreeCategory(function (result) {
                result = result.data;
                if (!result.Error) {
                    var root = {
                        id: 'root',
                        parent: "#",
                        text: caption.EDMSR_LBL_ALL_CATEGORY,//"Tất cả kho dữ liệu"
                        state: { selected: false, opened: true, checkbox_disabled: true, disabled: true }
                    }
                    $scope.treeDataCategory.push(root);
                    var index = 0;
                    $scope.ListParent = result.filter(function (item) {
                        return (item.ParentCode == '#');
                    });
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].ParentCode == '#') {
                            var stt = $scope.ListParent.length - index;
                            if (stt.toString().length == 1) {
                                stt = "0" + stt;
                            }
                            index = index + 1;
                            var data = {
                                id: result[i].Code,
                                parent: 'root',
                                text: stt + ' - ' + result[i].Title,
                                catId: result[i].Id,
                                catCode: result[i].Code,
                                catName: result[i].Title,
                                catParent: result[i].ParentCode,
                                listRepository: result[i].ListRepository,
                                state: { selected: result[i].Code == para.CatCode ? true : false, opened: true }
                            }
                            $scope.treeDataCategory.push(data);
                        } else {
                            var data = {
                                id: result[i].Code,
                                parent: result[i].ParentCode,
                                text: result[i].Code + ' - ' + result[i].Title,
                                catId: result[i].Id,
                                catCode: result[i].Code,
                                catName: result[i].Title,
                                catParent: result[i].ParentCode,
                                listRepository: result[i].ListRepository,
                                state: { selected: result[i].Code == para.CatCode ? true : false, opened: true }
                            }
                            $scope.treeDataCategory.push(data);
                        }
                    }
                    App.unblockUI("#contentMainRepository");
                }
            });
        }
    }
    $scope.selectNodeCategory = function () {
        var listNoteSelect = $scope.ctr.treeInstance.jstree(true).get_checked(true);
        $scope.catCode = listNoteSelect[0].id;
        reloadData(true);
    }
    $scope.deselectNodeCategory = function () {
        $scope.catCode = "";
        reloadData(true);
    }
    $scope.treeConfig = {
        core: {
            multiple: false,
            animation: true,
            error: function (error) {
                $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
            },
            check_callback: true,
            worker: true,
        },
        types: {
            default: {
                icon: 'fa fa-folder icon-state-warning'
            }
        },
        version: 1,
        plugins: ['checkbox', 'types', 'sort'],
        checkbox: {
            "three_state": false,
            "whole_node": true,
            "keep_selected_style": true,
            "cascade": "undetermined",
        }
    };
    $scope.treeEvents = {
        'ready': $scope.readyCB,
        'select_node': $scope.selectNodeCategory,
        'deselect_node': $scope.deselectNodeCategory,
    };

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});
app.controller('uploadMass', function ($scope, $rootScope, $compile, $filter, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataserviceRepository, para) {
    $scope.treeDataCategory = [];
    $scope.catCode = '';
    $scope.objectCode = '';
    $scope.objectType = '';
    $scope.breadcrumb = [];
    $scope.model = {
        NumberDocument: '',
        Tags: '',
        Desc: '',
        IsScan: false
    };
    $scope.repository = {
        TypeRepos: 'DRIVER',
        ReposCode: para.RepoCode,
        Folder: '',
        ParentId: para.ParentId
    }
    $scope.breadcrumb.push({ Id: para.ParentId, Path: "", Name: "Origin" });
    $scope.selectBreadcrumbRepository = function (index, listBreadcrumb) {
        var folder = '';
        for (var i = 0; i < listBreadcrumb.length; i++) {
            if (i == index) {
                folder += "/" + $scope.breadcrumb[i].Path;
                $scope.repository.ParentId = listBreadcrumb[i].Id;

            } else if (i > index) {
                listBreadcrumb.splice(i, 1);
                i--;
            } else if (i < index) {
                folder += "/" + $scope.breadcrumb[i].Path;
            }
        }
        $scope.repository.Folder = folder;
        $scope.reload();
    }
    var vm = $scope;
    vm.dt2 = {};
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/EDMSRepository/JtableFileWithRepository",
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
                d.ReposCode = $scope.repository.ReposCode;
                d.Folder = $scope.repository.Folder;
                d.ParentId = $scope.repository.ParentId;
            },
            complete: function () {
                App.unblockUI("#contentMain");
                $(".dataTables_scrollBody").addClass('scroller-sm-fade');
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(30)
        .withOption('order', [1, 'desc'])
        .withOption('serverSide', true)
        .withOption('scrollY', "200px")
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
                    if (data.IsDirectory == 'True') {
                        $scope.breadcrumb.push({ Id: data.Id, Path: data.FileName, Name: data.FileName });
                        $scope.$apply();
                        //(2:Server, 1:Google driver)
                        if ($scope.repository.TypeRepos == 'SERVER') {
                            var folder = '';
                            for (var i = 0; i < $scope.breadcrumb.length; i++) {
                                if ($scope.breadcrumb[i].Path != '') {
                                    folder += "/" + $scope.breadcrumb[i].Path;
                                }
                            }
                            $scope.repository.Folder = folder;
                        } else if ($scope.repository.TypeRepos == 'DRIVER') {
                            $scope.repository.ParentId = data.Id;
                        }
                        $scope.reload();
                    }
                }
            });
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("FileID").withTitle('').notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full._STT] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[\'' + full.Id + '\']" ng-click="toggleOne(selected,$event)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', ''));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileName').withOption('sClass', '').withTitle(caption.EDMSR_LIST_COL_FILE_NAME).withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
        var dataSubstr = data.length > 35 ? data.substr(0, 35) + " ..." : data;
        if (full.IsDirectory == 'True') {
            return '<i class="jstree-icon jstree-themeicon fa fa-folder icon-state-warning jstree-themeicon-custom" aria-hidden="true"></i>&nbsp;' + dataSubstr;
        } else {
            if ($scope.repository.TypeRepos == 'SERVER') {
                var idxDot = data.lastIndexOf(".") + 1;
                var extFile = data.substr(idxDot, data.length).toLowerCase();
                var excel = ['XLSM', 'XLSX', 'XLS'];
                var document = ['TXT'];
                var word = ['DOCX', 'DOC'];
                var pdf = ['PDF'];
                var powerPoint = ['PPS', 'PPTX', 'PPT'];
                var image = ['JPG', 'PNG', 'TIF', 'TIFF'];
                if (excel.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(106,170,89);font-size: 15px;" class="fa fa-file-excel-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (word.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (document.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(0,0,0);font-size: 15px;" class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (pdf.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (powerPoint.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-powerpoint-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (image.indexOf(extFile.toUpperCase()) !== -1) {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fa fa-picture-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fas fa-align-justify" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                }
            } else {
                var txtMimetypes = ["text/plain"];
                var wordMimetypes = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/vnd.google-apps.document"];
                var excelMimetypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.google-apps.spreadsheet"];
                var pdfMimetypes = ["application/pdf"];
                var powerPointMimetypes = ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
                var imageMimetypes = ["image/jpeg", "image/tiff", "image/ief", "image/png", "image/svg+xml", "image/webp", "image/vnd.microsoft.icon", "image/bmp"];
                if (excelMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(106,170,89);font-size: 15px;" class="fa fa-file-excel-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (wordMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (txtMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(0,0,0);font-size: 15px;" class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (pdfMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (powerPointMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-powerpoint-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else if (imageMimetypes.indexOf(full.MimeType) !== -1) {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fa fa-picture-o" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                } else {
                    return '<i style="color: rgb(42,42,42);font-size: 15px;" class="fas fa-align-justify" aria-hidden="true"></i>&nbsp;' + dataSubstr;
                }
            }
        }
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileSize').withTitle(caption.EDMSR_LIST_COL_SIZE).withOption('sClass', 'nowrap dataTable-100').renderWith(function (data, type, full) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (data == '') {
            return '';
        } else if (data == 0) {
            return '0 Byte';
        } else {
            var i = parseInt(Math.floor(Math.log(data) / Math.log(1024)));
            return Math.round(data / Math.pow(1024, i), 2) + ' ' + sizes[i];
        }
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('LastModifiedDate').withTitle(caption.EDMSR_LIST_COL_MODIFIED_DATE).withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
        return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy HH:mm') : null;
    }));
    vm.reloadData = reloadData;
    vm.dtInstance = {};
    function reloadData(resetPaging) {
        vm.dtInstance.reloadData(callback, resetPaging);
    }
    function callback(json) {

    }
    function toggleAll(selectAll, selectedItems) {
        if (selectAll)
            $('#tblDataDetailUpload').DataTable().$('tr:not(.selected)').addClass('selected');
        else
            $('#tblDataDetailUpload').DataTable().$('tr.selected').removeClass('selected');
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                selectedItems[id] = selectAll;
            }
        }
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
    function resetCheckbox() {
        $scope.selected = [];
        vm.selectAll = false;
    }

    $scope.reload = function () {
        reloadData(true);
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.submit = function () {
        var itemSelect = [];
        if (isAllData === 'True') {
            for (var id in $scope.selected) {
                if ($scope.selected.hasOwnProperty(id)) {
                    if ($scope.selected[id]) {
                        itemSelect.push(id);
                    }
                }
            }
        }
        if (itemSelect.length == 0) {
            App.toastrError(caption.EDMSR_MSG_CHOOSE_DOC_SAVE);
            return;
        }
        var listdata = $('#tblDataDetailUpload').DataTable().data();
        var listData = [];
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i]) {
                listData.push(listdata[i]);
            }
        }
        var listObj = [];
        for (var i = 0; i < itemSelect.length; i++) {
            var indexData = listData.findIndex(x => x.Id == itemSelect[i]);
            if (indexData != -1) {
                var obj = listdata[indexData];
                var data = {};
                data.CatId = $scope.catId;
                data.FileName = obj.FileName;
                data.FileId = obj.Id;
                data.MimeType = obj.MimeType;
                data.Desc = $scope.model.Desc;
                data.Tags = $scope.model.Tags;
                data.NumberDocument = $scope.model.NumberDocument;
                data.IsScan = false;
                console.log(data);
                listObj.push(data);
            }
        }
        var dataPost = {
            ListObjString: JSON.stringify(listObj),
            RepoCode: $scope.repository.ReposCode
        }
        dataserviceRepository.insertDriveFileToDb(dataPost, function (result) {
            result = result.data;
            if (result.Error) {
                App.toastrError(result.Title);
            } else {
                App.toastrSuccess(result.Title);
                //$uibModalInstance.close(result.Object);
            }
        });
    };
    $scope.ordering = function () {
        if ($scope.file === undefined || $scope.file === null) {
            return App.toastrError(caption.EDMST_MSG_SELECT_FILE_BEFORE);
        };

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + '/orderDocument.html',
            controller: 'orderDocument',
            backdrop: 'static',
            size: '65',
            resolve: {
                para: function () {
                    return $scope.file;
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    };
    $scope.extension = function () {
        if ($scope.file === undefined || $scope.file === null) {
            return App.toastrError(caption.EDMST_MSG_SELECT_FILE_BEFORE);
        };

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + '/extension.html',
            controller: 'extension',
            backdrop: 'static',
            size: '40',
            resolve: {
                para: function () {
                    return {
                        Type: 'DETAIL',
                        Object: $scope.file
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    };

    //treeview
    $scope.ctr = {};
    $scope.readyCB = function () {
        if ($scope.treeDataCategory.length == 0) {
            App.blockUI({
                target: "#contentMainRepository",
                boxed: true,
                message: 'loading...'
            });
            dataserviceRepository.getTreeCategory(function (result) {
                result = result.data;
                if (!result.Error) {
                    var root = {
                        id: 'root',
                        parent: "#",
                        text: caption.EDMSR_LBL_ALL_CATEGORY,//"Tất cả kho dữ liệu"
                        state: { selected: false, opened: true, checkbox_disabled: true, disabled: true }
                    }
                    $scope.treeDataCategory.push(root);
                    var index = 0;
                    $scope.ListParent = result.filter(function (item) {
                        return (item.ParentCode == '#');
                    });
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].ParentCode == '#') {
                            var stt = $scope.ListParent.length - index;
                            if (stt.toString().length == 1) {
                                stt = "0" + stt;
                            }
                            index = index + 1;
                            var data = {
                                id: result[i].Code,
                                parent: 'root',
                                text: stt + ' - ' + result[i].Title,
                                catId: result[i].Id,
                                catCode: result[i].Code,
                                catName: result[i].Title,
                                catParent: result[i].ParentCode,
                                listRepository: result[i].ListRepository,
                                state: { selected: result[i].Code == para.CatCode ? true : false, opened: true }
                            }
                            $scope.treeDataCategory.push(data);
                        } else {
                            var data = {
                                id: result[i].Code,
                                parent: result[i].ParentCode,
                                text: result[i].Code + ' - ' + result[i].Title,
                                catId: result[i].Id,
                                catCode: result[i].Code,
                                catName: result[i].Title,
                                catParent: result[i].ParentCode,
                                listRepository: result[i].ListRepository,
                                state: { selected: result[i].Code == para.CatCode ? true : false, opened: true }
                            }
                            $scope.treeDataCategory.push(data);
                        }
                    }
                    App.unblockUI("#contentMainRepository");
                }
            });
        }
    }
    $scope.selectNodeCategory = function () {
        var listNoteSelect = $scope.ctr.treeInstance.jstree(true).get_checked(true);
        $scope.catCode = listNoteSelect[0].id;
        $scope.catId = listNoteSelect[0].original.catId;
        //reloadData(true);
    }
    $scope.deselectNodeCategory = function () {
        $scope.catCode = "";
        $scope.catId = "";
        //reloadData(true);
    }
    $scope.treeConfig = {
        core: {
            multiple: false,
            animation: true,
            error: function (error) {
                $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
            },
            check_callback: true,
            worker: true,
        },
        types: {
            default: {
                icon: 'fa fa-folder icon-state-warning'
            }
        },
        version: 1,
        plugins: ['checkbox', 'types', 'sort'],
        checkbox: {
            "three_state": false,
            "whole_node": true,
            "keep_selected_style": true,
            "cascade": "undetermined",
        }
    };
    $scope.treeEvents = {
        'ready': $scope.readyCB,
        'select_node': $scope.selectNodeCategory,
        'deselect_node': $scope.deselectNodeCategory,
    };

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('extension', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataserviceRepository, para) {
    $scope.IsDashBoard = false;
    $scope.FileId = 0;
    $scope.Type = '';
    $scope.model = {
        KeyWord: '',
        Subject: '',
        HashTag: '',
        Group: '',
        Type: '',
        HardFileAddress:'',
        HardFileCode:''
    };
    var data = para;
    if (data !== '' && data !== undefined && data !== null) {
        $scope.showQR=false;
        switch (data.Type) {
            case 'LIST':
                $scope.FileId = data.Object;
                dataserviceRepository.getMetaData($scope.FileId, function (rs) {
                    rs = rs.data;
                    if (!rs.Error) {
                        $scope.FileName = rs.Object.FileName;
                        if (rs.Object.MetaDataExt !== undefined && rs.Object.MetaDataExt !== null) {
                            $scope.model = JSON.parse(rs.Object.MetaDataExt);
                            
                            if($scope.model.HardFileAddress!=null&&$scope.model.HardFileAddress!=''&&$scope.model.HardFileAddress!=undefined){
                                $scope.showQR=true;
                            }
                        }
                    }
                });

                $scope.IsDashBoard = true;
                break;

            case 'DETAIL':
                $scope.FileName = data.Object.name;
                $scope.IsDashBoard = true;
                break;
        }
        $scope.Type = data.Type;
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        dataserviceRepository.getListMetaGroup(function (rs) {
            rs = rs.data;
            if (!rs.Error) {
                $scope.listGroup = rs.Object;
            }
        });

        dataserviceRepository.getListMetaType(function (rs) {
            rs = rs.data;
            if (!rs.Error) {
                $scope.listType = rs.Object;
            }
        });
    };

    $scope.init();

    $scope.addCommonSettingMetaGroup = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + "/detail.html",
            controller: 'detail',
            size: '50',
            backdrop: 'static',
            resolve: {
                para: function () {
                    return {
                        Group: 'META_GROUP',
                        GroupNote: 'Nhóm mô tả ngắn',
                        AssetCode: ''
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.init();
        }, function () {
            $scope.init();
        });
    };

    $scope.addCommonSettingMetaType = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + "/detail.html",
            controller: 'detail',
            size: '50',
            backdrop: 'static',
            resolve: {
                para: function () {
                    return {
                        Group: 'META_Type',
                        GroupNote: 'Loại mô tả ngắn',
                        AssetCode: ''
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.init();
        }, function () {
            $scope.init();
        });
    };

    $scope.save = function () {
        switch ($scope.Type) {
            case 'LIST':
                if ($scope.model.KeyWord !== '' || $scope.model.Subject !== '' || $scope.model.HashTag !== '' || $scope.model.Group !== '' || $scope.model.Type !== ''|| $scope.model.HardFileAddress !== ''|| $scope.model.HardFileCode !== '') {

                    var metaDataExt = JSON.stringify($scope.model);
                    dataserviceRepository.updateMetaData($scope.FileId, metaDataExt, function (rs) {
                        rs = rs.data;
                        if (!rs.Error) {
                            $scope.listType = rs.Object;
                        }
                    });
                }
                break;

            case 'DETAIL':
                if ($scope.model.KeyWord !== '' || $scope.model.Subject !== '' || $scope.model.HashTag !== '' || $scope.model.Group !== '' || $scope.model.HardFileAddress !== ''|| $scope.model.HardFileCode !== '') {
                    $rootScope.DocumentExt = $scope.model;
                }
                break;
        }

        $uibModalInstance.dismiss('cancel');
    };

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('orderDocument', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataserviceRepository, para) {
    var data = para;
    $scope.FileName = data.name;

    $scope.model = {
        RackCode: '',
        RackPosition: '',
        ObjPackCode: ''
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        dataserviceRepository.getListRack(function (rs) {
            rs = rs.data;
            $scope.listRackSearch = rs;
        });
    };

    $scope.init();

    $rootScope.loadPack = function () {
        dataserviceRepository.getListPack($scope.model.RackCode, function (rs) {
            rs = rs.data;
            $scope.listPack = rs;
        });
    };

    $scope.changeRack = function () {
        $rootScope.loadPack();
    };

    $scope.orderingDocument = function () {
        if ($scope.model.RackCode === undefined) {
            return App.toastrError(caption.EDMSR_MSG_SELECT_SHELF_CABINET);
        }

        if ($scope.model.ObjPackCode === undefined) {
            return App.toastrError(caption.EDMSR_MSG_SELECT_BOOK_VOLUME_BOX);
        }

        $rootScope.RackInfo = $scope.model;
        $uibModalInstance.dismiss('cancel');
    };

    $scope.viewPack = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + '/packCover.html',
            controller: 'packCover',
            backdrop: 'static',
            size: '65',
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    }
});

app.controller('packCover', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceRepository, $filter, $translate) {
    var vm = $scope;

    $scope.model = {
        ObjPackCode: generateUUID(),
        Name: ''
    };

    $scope.isEdit = false;

    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    vm.dtOptionsPackCover = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/EDMSRepository/JtablePack",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {

            },
            complete: function () {
                App.unblockUI("#contentMain");
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(30)
        .withOption('order', [1, 'desc'])
        .withOption('serverSide', true)
        .withOption('scrollY', "200px")
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

    vm.dtColumnsPackCover = [];
    vm.dtColumnsPackCover.push(DTColumnBuilder.newColumn("Id").withTitle('').notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full._STT] = false;
        }).withOption('sWidth', '30px').withOption('sClass', 'hidden'));
    vm.dtColumnsPackCover.push(DTColumnBuilder.newColumn('Name').withOption('sClass', '').withTitle('{{"EDMSR_TAB_PACKCOVER_CURD_NAME" | translate}}').withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
        return data;
    }));
    vm.dtColumnsPackCover.push(DTColumnBuilder.newColumn('SpecSize').withTitle('{{"EDMSR_TAB_PACKCOVER_CURD_SIZE" | translate}}').withOption('sClass', 'nowrap dataTable-100').renderWith(function (data, type, full) {
        return data;
    }));
    vm.dtColumnsPackCover.push(DTColumnBuilder.newColumn('Weight').withTitle('{{"EDMSR_TAB_PACKCOVER_CURD_WEIGHT" | translate}}').withOption('sClass', 'nowrap dataTable-100').renderWith(function (data, type, full) {
        return data;
    }));
    vm.dtColumnsPackCover.push(DTColumnBuilder.newColumn('Unit').withTitle('{{"EDMSR_TAB_PACKCOVER_CURD_UNIT" | translate}}').withOption('sClass', 'nowrap dataTable-100').renderWith(function (data, type, full) {
        switch (data) {
            case '1':
                data = $rootScope.listUnit[0].Name;
                break;
            case '2':
                data = $rootScope.listUnit[1].Name;
                break;
            case '3':
                data = $rootScope.listUnit[2].Name;
                break;
        }
        return data;
    }));
    vm.dtColumnsPackCover.push(DTColumnBuilder.newColumn('CreatedBy').withTitle('{{"COM_LIST_COL_CREATED_BY" | translate}}').withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
        return data;
    }));
    vm.dtColumnsPackCover.push(DTColumnBuilder.newColumn('CreatedTime').withTitle('{{"COM_LIST_COL_CREATED_TIME" | translate}}').withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
        return data;
    }));
    vm.dtColumnsPackCover.push(DTColumnBuilder.newColumn('action').notSortable().withOption('sClass', 'nowrap dataTable-w80 text-center').withTitle('{{"COM_LIST_COL_ACTION" | translate}}').renderWith(function (data, type, full) {
        return '<a ng-click="getItemPack(' + full.Id + ')" target="_blank" style="width: 25px; height: 25px; padding: 0px" title="{{&quot; EDMSR_TITLE_UPDATE &quot; | translate}} - ' + full.FileName + '" class="btn btn-icon-only btn-circle btn-outline blue "><i class="fa fa-edit pt5"></i></a>' +
            '<button title="{{&quot; EDMSR_DELETE &quot; | translate}}" ng-click="deletePack(' + full.Id + ')" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline red"><i class="fa fa-trash"></i></button>';
    }));
    vm.reloadData = reloadData;
    vm.dtInstancePackCover = {};
    function reloadData(resetPaging) {
        vm.dtInstancePackCover.reloadData(callback, resetPaging);
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
    $scope.addPack = function () {
        if ($scope.model.Name === '') {
            return App.toastrError(caption.EDMSR_MSG_PLS_ENTER_NAME);
        }

        dataserviceRepository.insertPack($scope.model, function (rs) {
            rs = rs.data;

            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                $scope.clearData();
                $scope.reload();
            }
        });
    };
    $scope.getItemPack = function (id) {
        dataserviceRepository.getItemPack(id, function (rs) {
            rs = rs.data;
            $scope.isEdit = true;

            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                $scope.model.Id = id;
                $scope.model.ObjPackCode = rs.Object.ObjPackCode;
                $scope.model.Name = rs.Object.Name;
                $scope.model.SpecSize = rs.Object.SpecSize;
                $scope.model.Weight = rs.Object.Weight;
                $scope.model.Unit = rs.Object.Unit;
            }
        });
    };
    $scope.editPack = function () {
        if ($scope.model.Name === '') {
            return App.toastrError(caption.EDMSR_MSG_PLS_ENTER_NAME);
        }

        dataserviceRepository.updatePack($scope.model, function (rs) {
            rs = rs.data;

            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                $rootScope.loadPack();
                $scope.clearData();
                $scope.reload();
            }
        });
    };
    $scope.deletePack = function (id) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            resolve: {
                para: function () {
                    return id;
                }
            },
            controller: function ($scope, $uibModalInstance, para) {
                $scope.message = caption.EDMSR_MSG_DELETE_CATEGORIES;
                $scope.ok = function () {
                    dataserviceRepository.deletePack(para, function (rs) {
                        rs = rs.data;

                        if (rs.Error) {
                            App.toastrError(rs.Title);
                        } else {
                            App.toastrSuccess(rs.Title);
                            $rootScope.loadPack();
                            $uibModalInstance.dismiss('cancel');
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

        }, function () {
            $scope.reload();
        });

    };

    $scope.cancelPack = function () {
        $scope.clearData();
    };

    $scope.clearData = function () {
        $scope.isEdit = false;

        $scope.model.Id = '';
        $scope.model.ObjPackCode = generateUUID();
        $scope.model.Name = '';
        $scope.model.SpecSize = '';
        $scope.model.Weight = '';
        $scope.model.Unit = '';
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('shareFile', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataserviceRepository, para) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.model = {
        Id: '',
        ListUserShare: ''
    };

    $scope.model1 = {
        ListUserShare: []
    };

    $scope.init = function () {
        $scope.model.Id = para;

        dataserviceRepository.getListUser(function (rs) {
            rs = rs.data;
            $scope.listUser = rs;
        });

        dataserviceRepository.getFileShare(para, function (rs) {
            rs = rs.data;
            if (!rs.Error && rs.Object !== undefined && rs.Object !== null && rs.Object !== '') {
                $scope.model1.ListUserShare = JSON.parse(rs.Object.ListUserShare);
            }
        });
    };

    $scope.init();

    $scope.share = function () {
        if ($scope.model1.ListUserShare.length === 0)
            return App.toastrError(caption.EDMSR_MSG_LIST_OF_EMPTY_PEOPLE);

        $scope.model.ListUserShare = JSON.stringify($scope.model1.ListUserShare);

        dataserviceRepository.insertFileShare($scope.model, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                $uibModalInstance.close();
            }
        });
    };

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('detail', function ($scope, $rootScope, $confirm, $compile, $uibModal, $uibModalInstance, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceRepository, $filter, para, $translate) {
    var vm = $scope;
    $scope.model = {
        CodeSet: '',
        ValueSet: '',
        AssetCode: para.AssetCode,
        Group: para.Group,
        GroupNote: para.GroupNote
    };
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
    //vm.dtColumnsCommon.push(DTColumnBuilder.newColumn('_STT').withTitle('STT').notSortable().withOption('sWidth', '30px').withOption('sClass', 'tcenter w50').renderWith(function (data, type) {
    //    return data;
    //}));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ValueSet').withTitle('{{"COM_SET_LIST_COL_VALUE_SET" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    //vm.dtColumnsCommon.push(DTColumnBuilder.newColumn('ValueSet').withTitle('Giá trị').renderWith(function (data, type) {
    //    return data;
    //}));
    vm.dtColumns.push(DTColumnBuilder.newColumn('TypeName').withTitle('{{"COM_SET_LIST_COL_TYPE_NAME" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    //vm.dtColumnsCommon.push(DTColumnBuilder.newColumn('TypeName').withTitle('Kiểu dữ liệu').renderWith(function (data, type) {
    //    return data;
    //}));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedTime').withTitle('{{"COM_SET_LIST_COL_CREATE_TIME" | translate}}').renderWith(function (data, type) {
        return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy') : null;
    }));
    //vm.dtColumnsCommon.push(DTColumnBuilder.newColumn('CreatedTime').withTitle('Ngày tạo').renderWith(function (data, type) {
    //    return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy') : null;
    //}));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedBy').withTitle('{{"COM_SET_LIST_COL_CREATE_BY" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    //vm.dtColumnsCommon.push(DTColumnBuilder.newColumn('CreatedBy').withTitle('Người tạo').renderWith(function (data, type) {
    //    return data;
    //}));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').notSortable().withOption('sClass', 'nowrap').withTitle('{{"COM_SET_LIST_COL_ACTION" | translate}}').renderWith(function (data, type, full) {
        return '<button title="{{&quot; EDMSR_DELETE &quot; | translate}}" ng-click="delete(' + full.SettingID + ')" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline red"><i class="fa fa-trash"></i></button>';
    }));
    //vm.dtColumnsCommon.push(DTColumnBuilder.newColumn('action').notSortable().withOption('sClass', 'nowrap').withTitle('Thao tác').renderWith(function (data, type, full) {
    //    return '<button title="Xoá" ng-click="delete(' + full.SettingID + ')" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline red"><i class="fa fa-trash"></i></button>';
    //}));
    vm.reloadData = reloadData;
    vm.dtInstance = {};
    function reloadData(resetPaging) {
        vm.dtInstanceCommon.reloadData(callback, resetPaging);
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
        $scope.model.ValueSet = '';
    }
    $scope.reload = function () {
        reloadData(true);
    };
    $scope.reloadNoResetPage = function () {
        reloadData(false);
    };
    $scope.init = function () {
        dataserviceRepository.getDataTypeCommonSetting(function (rs) {
            rs = rs.data;
            $scope.listDataType = rs;
        });
    };
    $scope.init();
    $scope.add = function () {
        if ($scope.model.ValueSet === '') {
            App.toastrError(caption.COM_SET_CURD_MSG_SETTING_NOT_BLANK);
        } else if ($scope.model.ValueSet.length > 255) {
            App.toastrError("Vui lòng nhập giá trị cài đặt nhỏ hơn 255 ký tự");
        } else {
            dataserviceRepository.insertCommonSetting($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    reloadData(true);
                }
            });
        }
    };
    $scope.edit = function () {
        if ($scope.model.ValueSet === '') {
            App.toastrError(caption.COM_SET_CURD_MSG_DATA_NOT_BLANK)
        } else if ($scope.model.ValueSet.length > 255) {
            App.toastrError("Vui lòng nhập giá trị cài đặt nhỏ hơn 255 ký tự");
        } else {
            dataserviceRepository.updateCommonSetting($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    reloadData(true);
                    resetInput();
                }
            });
        }
    };
    $scope.delete = function (id) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = caption.COM_MSG_DELETE_CONFIRM_COM;
                $scope.ok = function () {
                    dataserviceRepository.deleteCommonSetting(id, function (rs) {
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
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

//Records Pack
app.controller('records-pack', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataserviceRepository, para) {
    $scope.cancel = function () {
        $uibModalInstance.close('cancel');
    };

    $scope.model = {
        PackCode: "",
        FileCode: para
    };

    $scope.init = function () {
        dataserviceRepository.getTreeRecordsPack(function (rs) {
            rs = rs.data;
            $scope.lstRecordPack = rs;
        })

        dataserviceRepository.getPackOfFile(para, function (rs) {
            rs = rs.data;
            if (rs != null) {
                $scope.model.PackCode = rs.PackCode;
                dataserviceRepository.getInfoRecordsPack($scope.model.PackCode, function (rs) {
                    rs = rs.data;
                    $scope.hierachyPack = rs.PackHierarchyPath;
                })
            }
        })
    };

    $scope.init();

    $scope.submit = function () {
        debugger
        if ($scope.model.PackCode == "") {
            return App.toastrError("Vui lòng chọn hồ sơ");
        }
        dataserviceRepository.fileToPack($scope.model, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
            }
        })
    }

    $scope.selectChange = function () {
        dataserviceRepository.getInfoRecordsPack($scope.model.PackCode, function (rs) {
            rs = rs.data;
            $scope.hierachyPack = rs.PackHierarchyPath;
        })
    }

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('arrange-file-to-pack', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataserviceRepository, para) {
    $scope.cancel = function () {
        $uibModalInstance.close('cancel');
    };

    $scope.model = {
        PackCode: "",
        FileCode: para,
        ZoneCode: ""
    };

    $scope.init = function () {
        dataserviceRepository.getTreeZone(function (rs) {
            rs = rs.data;
            $scope.lstZone = rs;
        })

        dataserviceRepository.getPackOfFile(para, function (rs) {
            rs = rs.data;
            if (rs != null) {
                $scope.model.PackCode = rs.PackCode;
                dataserviceRepository.getZoneFileInPack($scope.model.PackCode, function (rs) {
                    rs = rs.data;
                    $scope.model.ZoneCode = rs != null ? rs.PackZoneLocation : "";
                    dataserviceRepository.getInfoZone($scope.model.ZoneCode, function (rs) {
                        $scope.zoneHierarchy = rs.data.ZoneHierachy;
                    })
                })
            }
        })
    };

    $scope.init();

    $scope.submit = function () {
        debugger
        if ($scope.model.ZoneCode == "") {
            return App.toastrError("Vui lòng chọn vị trí");
        }
        var obj = {
            ZoneCode: $scope.zoneHierarchy,
            ListRecordsPack: $scope.model.PackCode
        }
        dataserviceRepository.arrangeRecordsPack(obj, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataserviceRepository.autoUpdateHierarchy(function (rs) { })
            }
        })
    }

    $scope.selectChange = function (item) {
        //dataserviceRepository.getInfoZone($scope.model.ZoneCode, function (rs) {
        //    $scope.zoneHierarchy = rs.data.ZoneHierachy;
        //})
        $scope.zoneHierarchy = item.Mapping;
    }

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});
