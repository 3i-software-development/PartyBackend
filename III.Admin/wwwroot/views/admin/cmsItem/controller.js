var ctxfolderCmsItem = "/views/admin/cmsItem";
var ctxfolderCkFinder = "/lib/assets/glo";
var ctxfolderMessage = "/views/message-box";

var app = angular.module('App_ESEIM_CMS_ITEM', ['App_ESEIM_FILE_PLUGIN', "ui.bootstrap", "ngRoute", "ngValidate", "datatables", "datatables.bootstrap", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', "ngJsTree", "treeGrid", "ui.select", "ngCookies", "pascalprecht.translate"])
    .directive("filesInput", function () {
        return {
            require: "ngModel",
            link: function postLink(scope, elem, attrs, ngModel) {
                elem.on("change", function (e) {
                    var files = elem[0].files;
                    ngModel.$setViewValue(files);
                });
            }
        }
    });

app.directive('customOnChangeSupplier', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChangeSupplier);
            element.on('change', onChangeHandler);
            element.on('$destroy', function () {
                element.off();
            });

        }
    };
});

app.factory('dataserviceCmsItem', function ($http) {
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
            data: data
        }
        $http(req).then(callback);
    };
    var submitFormUpload1 = function (url, data, callback) {
        var formData = new FormData();
        formData.append("FileUpload", data.FileUpload);
        formData.append("file_name", data.FileName);
        formData.append("file_type", data.FileType);
        formData.append("title", data.title);
        formData.append("title_attribute", data.title_attribute);
        formData.append("item_id", data.item_id);
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
            data: formData
        }
        $http(req).then(callback);
    };
    return {
        insert: function (data, callback) {
            $http.post('/Admin/CMSItem/Insert/', data).then(callback);
        },
        update: function (data, callback) {
            $http.post('/Admin/CMSItem/Update/', data).then(callback);
        },
        updateHashTag: function (data, callback) {                               //
            $http.post('/Admin/CMSItem/UpdateHashTag/', data).then(callback);
        },

        getTemplate: function (callback) {
            $http.post('/Admin/CMSCategory/GetTemplate').then(callback);
        },
        getCatId: function (callback) {
            $http.post('/Admin/CMSItem/GetCatID/').then(callback);
        },
        getTypeCMA: function (callback) {
            $http.post('/Admin/CMSItem/GetTypeCMA').then(callback);
        },
        getItem: function (data, callback) {
            $http.post('/Admin/CMSItem/GetItem', data).then(callback);
        },
        getlistLanguage: function (callback) {
            $http.post('/Admin/CMSItem/GetListLanguage').then(callback);
        },
        delete: function (data, callback) {
            $http.post('/Admin/CMSItem/Delete?id=' + data).then(callback);
        },
        aprrove: function (data, callback) {
            $http.post('/Admin/CMSItem/Approve?id=' + data).then(callback);
        },
        insertFile: function (data, callback) {
            submitFormUpload1('/Admin/CMSItem/InsertFile', data, callback);

        },
        deleteFile: function (data, callback) {
            $http.post('/Admin/CMSItem/DeleteFile/' + data).then(callback);
        },
        insertImage: function (data, callback) {
            submitFormUpload('/Admin/CMSItem/InsertImage', data, callback);
        },

        insertCSA: function (data, callback) {
            $http.post('/Admin/CMSItem/InsertCSA/', data).then(callback);
        },
        updateCSA: function (data, callback) {
            $http.post('/Admin/CMSItem/UpdateCSA/', data).then(callback);
        },
        deleteCSA: function (data, callback) {
            $http.post('/Admin/CMSItem/DeleteCSA/' + data).then(callback);
        },
        getItemCSA: function (data, callback) {
            $http.post('/Admin/CMSItem/GetItemCSA', data).then(callback);
        },

        gettreedata: function (callback) {
            $http.post('/Admin/CMSCategory/GetTreeData/').then(callback);
        },
        getContentCms: function (data, callback) {
            $http.get('/Admin/UserManual/GetContentCms?id=' + data).then(callback);
        },
    }
});

app.controller('Ctrl_ESEIM_CMS_ITEM', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceCmsItem, $cookies, $translate) {
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
            //min: caption.COM_VALIDATE_VALUE_MIN,
            //max: 'Max some message {0}'
        });
        $rootScope.checkData = function (data) {
            var partternCode = /^[a-zA-Z0-9]+[^Đđ!@#$%^&*<>?\s]*$/;
            var partternName = /^(^[ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z.0-9\s]+$)|^(^[0-9]+[ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z.\s][ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z.0-9\s]*$)/
            var mess = { Status: false, Title: "" }
            if (!partternCode.test(data.CurrencyCode)) {
                mess.Status = true;
                mess.Title = mess.Title.concat(" - ", caption.FCC_MSG_ITEM_CODE, "<br/>");
            }
            return mess;
        }
        $rootScope.validationOptionsCmsItem = {
            rules: {
                Title: {
                    required: true
                },
                Alias: {
                    required: true
                },
                //Category: {
                //    required: true
                //},
                //Created: {
                //    required: true
                //}

            },
            messages: {
                Title: {
                    //required: "Tiêu đề không được bỏ trống",
                    required: caption.CMS_ITEM_VALIDATE_TITLE,
                },
                Alias: {
                    //required: "Đường dẫn không được bỏ trống",
                    required: caption.CMS_ITEM_VALIDATE_ALIAS,
                },
                //Category: {
                //    required: "Danh mục không được bỏ trống",
                //},
                //Created: {
                //    required: "Ngày đăng không được bỏ trống",
                //}
            }
        }
        $rootScope.validationOptionsCSA = {
            rules: {
                Title: {
                    required: true
                },
                ValueSet: {
                    required: true
                },


                CodeSet: {
                    required: true
                },
                Type: {
                    required: true
                },


            },
            messages: {
                Title: {
                    //required: "Tiêu đề không được bỏ trống",
                    required: caption.CMS_ITEM_VALIDATE_EMPTY.replace("{0}", caption.CMS_ITEM_CURD_TXT_TITLE),
                },
                ValueSet: {

                    required: caption.CMS_ITEM_VALIDATE_EMPTY.replace("{0}", caption.CMS_ITEM_CURD_LBL_VALUE),
                },

                CodeSet: {

                    required: caption.CMS_ITEM_VALIDATE_EMPTY.replace("{0}", caption.CMS_ITEM_CURD_LBL_CODESET),
                },
                Type: {

                    required: caption.CMS_ITEM_VALIDATE_EMPTY.replace("{0}", caption.CMS_ITEM_CURD_LBL_TYPE),
                },
            }
        }
    });
    $rootScope.isAdded = false;

    $rootScope.ObjectTypeFile = "CMS_ITEM";
    $rootScope.moduleName = "CMS";

    var url_string = window.location.href;
    var url = new URL(url_string);
    var catId = url.searchParams.get("catId");
    $rootScope.catId = '';
    if (catId !== '' && catId !== null && catId !== undefined) {
        $rootScope.catId = catId;
    }
    dataserviceCmsItem.getlistLanguage(function (rs) {
        rs = rs.data;
        $rootScope.listLanguage = rs;
    });
});

app.config(function ($routeProvider, $validatorProvider, $translateProvider, $httpProvider) {
    $translateProvider.useUrlLoader('/Admin/CMSItem/Translation');
    caption = $translateProvider.translations();
    $routeProvider
        .when('/', {
            templateUrl: ctxfolderCmsItem + '/index.html',
            controller: 'indexCmsItm'
        });
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
});

app.controller('demoCmsItm', function ($scope, $rootScope, $compile, dataserviceCmsItem, $translate, $window, $filter) {
    var editor;
    setTimeout(function () {
        //editor = new EditorJS({
        //    holder: "editorjs",
        //    tools:tool,
        //    data:$rootScope.JsonEdit
        //});
    },3000);

    $scope.saveCms = function () {
        editor
            .save()
            .then((outputData) => {
                console.log("Article data: ", outputData);
                $rootScope.JsonEdit=outputData
            })
            .catch((error) => {
                console.log("Saving failed: ", error);
            });
    };
});
app.controller('indexCmsItm', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceCmsItem, $translate, $window, $filter) {
    var vm = $scope;
    $scope.model = {
        Title: '',
        PostFromDate: '',
        PostToDate: '',
        CreFromDate: '',
        CreToDate: '',
        Category: '',
        Status: '',
        TypeItem: '',
    };
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;

    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/CMSItem/JTable",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.Title = $scope.model.Title;
                d.PostFromDate = $scope.model.PostFromDate;
                d.PostToDate = $scope.model.PostToDate;
                d.CreFromDate = $scope.model.CreFromDate;
                d.CreToDate = $scope.model.CreToDate;
                d.Category = $scope.model.Category;
                d.Status = $scope.model.Status;
                d.TypeItem = $scope.model.TypeItem;
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
        .withOption('rowCallback', function (row, data) {
            if (data.IsRead == 'False') {
                $(row).addClass('row-no-read');
            }
        })
        .withOption('createdRow', function (row, data, dataIndex) {
            const contextScope = $scope.$new(true);
            contextScope.data = data;
            contextScope.contextMenu = $scope.contextMenu;
            $compile(angular.element(row).contents())($scope);
            $compile(angular.element(row).attr('context-menu', 'contextMenu'))(contextScope);
            $(row).find('td:not(:has(label.mt-checkbox))').on('dblclick', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {

                } else {
                    var Id = data.Id;
                    $scope.edit(Id);
                }
            });
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle(titleHtml).notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full.id] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.Id + ']" ng-click="toggleOne(selected)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', 'tcenter hidden'));
    //vm.dtColumns.push(DTColumnBuilder.newColumn('Name').withTitle('{{"CMS_ITEM_LIST_COL_CATEGORY" | translate}}').renderWith(function (data, type) {
    //    return data;
    //}));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Title').withTitle('{{"CMS_ITEM_LIST_COL_TITLE" | translate}}').renderWith(function (data, type, full) {
        return '<span class="bold">' + data + '</span>' + '<br/>' + '<span class="text-purple fs10">' + full.Name + '</span>';
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Published').withOption('sClass', 'dataTable-w80').withTitle('{{"CMS_ITEM_LIST_COL_PUBLISHED" | translate}}').renderWith(function (data, type, full) {
        if (data == "True") {
            return '<span class="cursor glyphicon glyphicon-ok-sign text-success fs20 pTip-right btn-publish-inline" ng-click="approve(' + full.Id + ')"></span> '
        }
        else {
            return '<span class="cursor glyphicon glyphicon-ban-circle text-danger fs20 pTip-right btn-publish-inline" ng-click="approve(' + full.Id + ')"></span> '
        }

    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('DatePost').withOption('sClass', 'dataTable-10per').withTitle('{{"CMS_ITEM_LIST_COL_DATE_POST" | translate}}').renderWith(function (data, type) {
        return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy HH:mm:ss') : null;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Created').withOption('sClass', 'dataTable-10per').withTitle('{{"CMS_ITEM_LIST_COL_DATE_CREATED" | translate}}').renderWith(function (data, type) {
        return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy HH:mm:ss') : null;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Modified').withOption('sClass', 'dataTable-10per').withTitle('{{"CMS_ITEM_LIST_COL_TITLE_DATE_MODIFIED" | translate}}').renderWith(function (data, type) {
        return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy') : null;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').notSortable().withOption('sClass', 'nowrap dataTable-w80').withTitle('{{"COM_LIST_COL_ACTION" | translate}}').renderWith(function (data, type, full, meta) {
        return '<a title="{{&quot;COM_BTN_PREVIEW&quot; | translate}}" ng-click="view(\'' + full.Id + '\',\'' + full.Title + '\')" style1= "width: 25px; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgba(85,168,253,0.45);" class1="btn btn-icon-only btn-circle btn-outline blue"><i class="fas fa-eye fs25 pr20"></i></a>' +
            '<a title="{{&quot;COM_BTN_EDIT&quot; | translate}}" ng-click="edit(' + full.Id + ')" style1= "width: 25px; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgba(85,168,253,0.45);" class1="btn btn-icon-only btn-circle btn-outline blue"><i class="fas fa-edit fs25 pr20"></i></a>' +
            '<a title="{{&quot;COM_BTN_DELETE&quot; | translate}}" ng-click="delete(' + full.Id + ')" style1="width: 25px; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgba(230,60,95,0.45)" class1="btn btn-icon-only btn-circle btn-outline red"><i class="fas fa-trash-alt fs25 text-danger"></i></a>';
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

    $scope.reload = function () {
        reloadData(true);
    }
    $rootScope.reloadNoResetPage = function () {
        reloadData(false);
    }
    $scope.search = function () {
        reloadData(true);
    }

    $scope.add = function () {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCmsItem + '/add.html',
            controller: 'addCmsItm',
            backdrop: 'static',
            size: '65',
            resolve: {
                para: function () {
                    return '';
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
            $rootScope.isAdded = false;
        }, function () {
        });
    }

    $scope.edit = function (id) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCmsItem + '/add.html',
            controller: 'editCmsItm',
            backdrop: 'static',
            size: '65',
            resolve: {
                para: function () {
                    return id;
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.reloadNoResetPage();
        }, function () {
        });
    }

    $scope.approve = function (id) {

        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmUpdate.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = caption.CMS_ITEM_VALIDATE_STATE_DISPLAY;
                $scope.ok = function () {

                    dataserviceCmsItem.aprrove(id, function (rs) {
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
    $scope.share = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderFileShare + '/fileShare.html',
            controller: 'fileShare',
            windowClass: 'modal-center',
            backdrop: 'static',
            size: '60',
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () { });
    }
    $scope.delete = function (id) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = caption.COM_MSG_DELETE_CONFIRM_COM;
                $scope.ok = function () {
                    dataserviceCmsItem.delete(id, function (rs) {
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
    $scope.listPublished = [
        {
            Code: 1,
            Name: 'Hiển thị'

        }, {
            Code: 0,
            Name: 'Không hiển thị'
        },
    ];
    $scope.listFeaturedOrdering = [
        {
            Code: 0,
            Name: 'Bài viết thường'

        }, {
            Code: 1,
            Name: 'Tiêu điểm',
        },
        {
            Code: 2,
            Name: 'Tiếng anh'
        },

    ];
    $scope.initData = function () {
        dataserviceCmsItem.getCatId(function (rs) {
            rs = rs.data;
            $scope.listCatId = rs;
        });
        dataserviceCmsItem.gettreedata(function (result) {
            result = result.data;
            $scope.listParenCat = result;
            for (var i = 0; i < $scope.listParenCat.length; i++) {
                $scope.listParenCat[i].Active = false;
            }
        });
    };

    $scope.initData();

    $scope.view = function (id, title) {
        var item = {
            Id: id,
            Title: title
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCmsItem + '/viewItem.html',
            controller: 'viewItem',
            backdrop: 'static',
            size: '80',
            resolve: {
                para: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (d) {

        }, function () {
        });
    }

    $scope.chooseCategory = function (item) {
        $rootScope.catId = item;
        for (var i = 0; i < $scope.listParenCat.length; i++) {
            if ($scope.listParenCat[i].Id == item) {
                $scope.listParenCat[i].Active = true;
            } else {
                $scope.listParenCat[i].Active = false;
            }
        }

        $scope.reload();
    }

    $scope.isSearch = false;
    $scope.showSearch = function () {
        if (!$scope.isSearch) {
            $scope.isSearch = true;
        } else {
            $scope.isSearch = false;
        }
    }
    setTimeout(function () {
    }, 200);
    $("#PostFromDate").datepicker({
        inline: false,
        autoclose: true,
        format: "dd/mm/yyyy",
        fontAwesome: true,
    }).on('changeDate', function (selected) {
        var maxDate = new Date(selected.date.valueOf());
        $('#PostToDate').datepicker('setStartDate', maxDate);
    });
    $("#PostToDate").datepicker({
        inline: false,
        autoclose: true,
        format: "dd/mm/yyyy",
        fontAwesome: true,
    }).on('changeDate', function (selected) {
        var maxDate = new Date(selected.date.valueOf());
        $('#PostFromDate').datepicker('setEndDate', maxDate);
    });
    $("#CreFromDate").datepicker({
        inline: false,
        autoclose: true,
        format: "dd/mm/yyyy",
        fontAwesome: true,
    }).on('changeDate', function (selected) {
        var maxDate = new Date(selected.date.valueOf());
        $('#CreToDate').datepicker('setStartDate', maxDate);
    });
    $("#CreToDate").datepicker({
        inline: false,
        autoclose: true,
        format: "dd/mm/yyyy",
        fontAwesome: true,
    }).on('changeDate', function (selected) {
        var maxDate = new Date(selected.date.valueOf());
        $('#CreFromDate').datepicker('setEndDate', maxDate);
    });
    $('.end-post-date').click(function () {
        $('#PostFromDate').datepicker('setEndDate', null);
    });
    $('.start-post-date').click(function () {

        $('#PostToDate').datepicker('setStartDate', null);
    });
    $('.end-create-date').click(function () {
        $('#CreFromDate').datepicker('setEndDate', null);
    });
    $('.start-create-date').click(function () {

        $('#CreToDate').datepicker('setStartDate', null);
    });
});

app.controller('addCmsItm', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, dataserviceCmsItem, para) {
    $scope.entities = [{
        name: caption.CMS_ITEM_ARC_NORMAL,
        checked: true,
        value: 0,
    }, {
        name: caption.CMS_ITEM_ARC_FOCAL,
        checked: false,
        value: 1,
    }, {
        name: caption.CMS_ITEM_ARC_IMPRESSIVE_ARC,
        checked: false,
        value: 2,
    }];
    $scope.isEdit = false;
    //$scope.listLanguage = [
    //    {
    //        Code: "all",
    //        Name: caption.CMS_ITEM_ARC_ALL

    //    }, {
    //        Code: "vi_VN",
    //        Name: caption.CMS_ITEM_ARC_VN
    //    },
    //    {
    //        Code: "en_US",
    //        Name: caption.CMS_ITEM_ARC_EN
    //    },

    //];
    $rootScope.listHashTag = [];           //
    function validationSelect(data) {

        var mess = { Status: false, Title: "" }
        if (data.cat_id == "" || data.cat_id == null) {
            $scope.errorCatID = true;
            mess.Status = true;
        } else {
            $scope.errorCatID = false;

        }
        if (data.template == "" || data.template == null) {
            $scope.errorTemplate = true;
            mess.Status = true;
        } else {
            $scope.errorTemplate = false;

        }
        return mess;
    }

    $scope.model = {
        featured_ordering: 0,
        template: '',
        created: '',
        intro_text: '',
        cat_id: '',
        alias: '',
        title: '',
        language: '',
    }
    $scope.modelJson = {
        lgn: '',
        title: '',
        content: '',
        short_content: '',
    };
    $scope.jsonMultipleLanguage = [];

    $scope.ConvertToAlias = function (strInput) {
        strInput = strInput.toLowerCase().trim();
        strInput = strInput.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        strInput = strInput.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        strInput = strInput.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        strInput = strInput.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        strInput = strInput.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        strInput = strInput.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        strInput = strInput.replace(/đ/g, "d");
        strInput = strInput.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g, "-");
        strInput = strInput.replace(/-+-/g, "-"); //thay thế 2- thành 1-
        strInput = strInput.replace(/^\-+|\-+$/g, "");//cắt bỏ ký tự - ở đầu và cuối chuỗi
        $scope.model.alias = strInput;

    };

    $scope.loadImage = function () {
        var fileuploader = angular.element("#File");
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
            if (extFile != "jpg" && extFile != "jpeg" && extFile != "png" && extFile != "gif" && extFile != "bmp") {
                App.toastrError("caption.CMS_ITEM_MSG_IMG_FORMAT");
                return;
            }
            reader.readAsDataURL(files[0]);
        });
        fileuploader.trigger('click')
    }
    $rootScope.isShow = '';
    $scope.updateSelection = function (position, entities) {
        entities[position].checked = !entities[position].checked;
        $scope.model.featured_ordering = '';
        angular.forEach(entities, function (subscription, index) {
            if (position != index) {
                subscription.checked = false;
                $scope.model.featured_ordering = position;
            }
        });
        console.log($scope.entities);
    }
    $scope.changeLanguage = function (code) {
        var json = $scope.jsonMultipleLanguage.find(x => x.lgn == code);
        if (json != null && code != 'CMS_LANGUAGE20211027001') {
            $scope.modelJson = angular.copy(json);
        }
        $scope.modelJson.lgn = code;
        if (code != 'CMS_LANGUAGE20211027001') {
            $scope.modelJson.title = "";
            $scope.modelJson.short_content = "";
        }
        dataEditor.setData("");
        $rootScope.language = code;
        //$rootScope.changeLanguageAttribute(code);
    }
    $scope.initData = function () {
        if (para != '') {
            $scope.model.cat_id = para;
        }
        dataserviceCmsItem.getCatId(function (rs) {
            rs = rs.data;
            $scope.listCatId = rs;
        });
        dataserviceCmsItem.getTemplate(function (rs) {
            rs = rs.data;
            $scope.listTemplate = rs;
        });
        dataserviceCmsItem.getlistLanguage(function (rs) {
            rs = rs.data;
            $rootScope.listLanguage = rs;
        });
    };
    $scope.initData();
    $scope.cancel = function () {
        var check = dataEditor;
        if (check !== undefined) {
            dataEditor.destroy();
        }
        $uibModalInstance.close();
        $rootScope.alias = null;
        $rootScope.id = -1;
    }
    $scope.submit = function () {
        var check = dataEditor;
        if (check !== undefined && $scope.model.language == "CMS_LANGUAGE20211027001") {
            var data = dataEditor.getData();
            $scope.model.full_text = data;
        }
        else if (check !== undefined && $scope.model.language != "CMS_LANGUAGE20211027001") {
            var data = dataEditor.getData();
            $scope.modelJson.content = data;
        }
        var json = null;
        if ($scope.model.language != "CMS_LANGUAGE20211027001") {
            if ($scope.jsonMultipleLanguage != null) {
                json = $scope.jsonMultipleLanguage.find(x => x.lgn == $scope.modelJson.lgn);
                if (json == null) {
                    $scope.jsonMultipleLanguage.push($scope.modelJson);
                }
                else {
                    var index = $scope.jsonMultipleLanguage.findIndex(x => x.lgn == $scope.modelJson.lgn);
                    $scope.jsonMultipleLanguage[index] = angular.copy($scope.modelJson);
                }
            }
            else {
                $scope.jsonMultipleLanguage = [];
                $scope.jsonMultipleLanguage.push($scope.modelJson);
            }
        }
        $scope.model.multiple_language = JSON.stringify($scope.jsonMultipleLanguage);
        $scope.model.json_editor=JSON.stringify($rootScope.JsonEdit);
        validationSelect($scope.model);
        if ($scope.addform.validate() && !validationSelect($scope.model).Status) {
            var model = angular.copy($scope.model);
            model.date_post = moment($scope.model.date_post, 'DD/MM/YYYY HH:mm');
            dataserviceCmsItem.insert(model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    $rootScope.isShow = "1";
                    $rootScope.id = rs.ID;
                    $rootScope.alias = rs.ID;
                    $rootScope.item_id = { id: rs.ID };
                    $rootScope.ObjCode = $rootScope.item_id;
                    var file = document.getElementById("File").files[0]
                    if (file != undefined) {
                        $rootScope.submitImage();
                    }
                    //$rootScope.alias = $scope.model.alias;
                    $scope.reloadNoResetPage();
                    //$uibModalInstance.close();
                }
            });
        }
    };

    $scope.changeSelect = function (SelectType) {
        if (SelectType == "cat_id" && $scope.model.cat_id != "" && $scope.model.cat_id != null) {
            $scope.errorCatID = false;
        }
        if (SelectType == "template" && $scope.model.template != "" && $scope.model.template != null) {
            $scope.errorTemplate = false;
        }
    }
    $scope.chkItem = function () {
        if ($rootScope.isShow == '') {
            App.toastrError(caption.CMS_ITEM_MSG_NOT_BLANK);
        }
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
        $("#DatePost").datetimepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy hh:ii",
            fontAwesome: true,
            pickerPosition: "bottom-left"
        });
        //ckEditer();
    });
});

app.controller('editCmsItm', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, dataserviceCmsItem, para) {
    $scope.model1 = {
        listMember: []
    }
    $scope.model = para;
    $scope.modelJson = {
        lgn: '',
        title: '',
        content: '',
        short_content: ''
    };
    $rootScope.listHashTag = [];        //

    $scope.isEdit = true;
    //$rootScope.id = $scope.model.id;
    $rootScope.item_id = para;
    $rootScope.ObjCode = $rootScope.item_id;
    $scope.entities = [{
        name: caption.CMS_ITEM_ARC_NORMAL,
        checked: true,
        value: 0,
    }, {
        name: caption.CMS_ITEM_ARC_FOCAL,
        checked: false,
        value: 1,
    }, {
        name: caption.CMS_ITEM_ARC_IMPRESSIVE_ARC,
        checked: false,
        value: 2,
    }]

    //$scope.listLanguage = [
    //    {
    //        Code: "all",
    //        Name: caption.CMS_ITEM_ARC_ALL

    //    }, {
    //        Code: "vi_VN",
    //        Name: caption.CMS_ITEM_ARC_VN
    //    },
    //    {
    //        Code: "en_US",
    //        Name: caption.CMS_ITEM_ARC_EN
    //    },

    //];

    $scope.cancel = function () {
        var check = dataEditor;
        if (check !== undefined) {
            dataEditor.destroy();
        }
        $uibModalInstance.close();
        $rootScope.isAdded = false;
        $rootScope.alias = null;
        $rootScope.id = -1;
    }

    $scope.ConvertToAlias = function (strInput) {
        strInput = strInput.toLowerCase().trim();
        strInput = strInput.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        strInput = strInput.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        strInput = strInput.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        strInput = strInput.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        strInput = strInput.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        strInput = strInput.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        strInput = strInput.replace(/đ/g, "d");
        strInput = strInput.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g, "-");
        strInput = strInput.replace(/-+-/g, "-"); //thay thế 2- thành 1-
        strInput = strInput.replace(/^\-+|\-+$/g, "");//cắt bỏ ký tự - ở đầu và cuối chuỗi
        $scope.model.alias = strInput;

    };

    $scope.changeLanguage = function (code) {
        if ($scope.jsonMultipleLanguage != null) {
            var json = $scope.jsonMultipleLanguage.find(x => x.lgn == code);
            if (json != null && code != 'CMS_LANGUAGE20211027001') {
                $scope.modelJson = angular.copy(json);
            }
            else {
                $scope.modelJson.content = "";
                $scope.modelJson.title = "";
                $scope.modelJson.short_content = "";
            }
            if (code !== 'CMS_LANGUAGE20211027001') {
                dataEditor.setData($scope.modelJson.content);
            }
            else {
                dataEditor.setData($scope.model.full_text);
            }
        }
        else {
            $scope.modelJson.content = "";
            $scope.modelJson.title = "";
            $scope.modelJson.short_content = "";
            if (code !== 'CMS_LANGUAGE20211027001') {
                dataEditor.setData('');
            }
            else {
                dataEditor.setData($scope.model.full_text);
            }
        }
        $scope.modelJson.lgn = code;
        $rootScope.language = code;
        //$rootScope.changeLanguageAttribute(code);
        //setTimeout(function () {
        //    ckEditer();
        //}, 500);
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        if (data.cat_id == "" || data.cat_id == null) {
            $scope.errorCatID = true;
            mess.Status = true;
        } else {
            $scope.errorCatID = false;

        }
        if (data.template == "" || data.template == null) {
            $scope.errorTemplate = true;
            mess.Status = true;
        } else {
            $scope.errorTemplate = false;

        }
        return mess;
    }

    $scope.initData = function () {
        dataserviceCmsItem.getItem(para, function (rs) {
            rs = rs.data;
            if (rs === undefined || rs === null || rs === '') {
                App.toastrError(caption.CMS_ITEM_MSG_ERR_GET_DATA);
            } else {
                $scope.model = rs;
                if ($scope.model.hash_tag != null && $scope.model.hash_tag != '' && $scope.model.hash_tag != undefined) {
                    $rootScope.listHashTag = JSON.parse($scope.model.hash_tag);
                }
                try {
                    if ($scope.model.date_post != null && $scope.model.date_post != '' && $scope.model.date_post != undefined) {
                        $scope.model.date_post = moment($scope.model.date_post).format("DD/MM/YYYY HH:mm");
                    }
                    else {
                        $scope.model.date_post = '';
                    }
                    $rootScope.JsonEdit=JSON.parse(rs.json_editor);
                } catch (e) {
                    console.log(e);
                    $scope.model.date_post = '';
                }
                $rootScope.ArticleCode = $scope.model.id;
                $rootScope.alias = $scope.model.id;
                refreshData();
                $scope.jsonMultipleLanguage = JSON.parse($scope.model.multiple_language);
                dataserviceCmsItem.getlistLanguage(function (rs) {
                    rs = rs.data;
                    $rootScope.listLanguage = rs;
                    if ($rootScope.listLanguage.length > 0) {
                        $scope.model.language = $rootScope.listLanguage[0].Code;
                        $rootScope.language = $rootScope.listLanguage[0].Code;
                    }
                });
            }
        });
        dataserviceCmsItem.getCatId(function (rs) {
            rs = rs.data;
            $scope.listCatId = rs;

            for (var i = 0; i < $scope.entities.length; i++) {
                if ($scope.entities[i].value == $scope.model.featured_ordering) {
                    $scope.entities[i].checked = true;
                }
                else {
                    $scope.entities[i].checked = false;
                }
            }
        });
        dataserviceCmsItem.getTemplate(function (rs) {
            rs = rs.data;
            $scope.listTemplate = rs;
        });
    }

    $scope.initData();

    $scope.loadImage = function () {
        var fileuploader = angular.element("#File");
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
            if (extFile != "jpg" && extFile != "jpeg" && extFile != "png" && extFile != "gif" && extFile != "bmp") {
                App.toastrError("caption.CMS_ITEM_MSG_IMG_FORMAT");

                return;
            }
            reader.readAsDataURL(files[0]);
        });
        fileuploader.trigger('click')
    }

    $scope.updateSelection = function (position, entities) {
        entities[position].checked = !entities[position].checked;
        $scope.model.featured_ordering = '';
        angular.forEach(entities, function (subscription, index) {
            if (position != index) {
                subscription.checked = false;
                $scope.model.featured_ordering = position;
            }
        });
        console.log($scope.entities);
    }

    $scope.submit = function () {
        var check = dataEditor;
        console.log(dataEditor.getData());
        if (check !== undefined && $scope.model.language == "CMS_LANGUAGE20211027001") {
            var data = dataEditor.getData();
            $scope.model.full_text = data;
        }
        else if (check !== undefined && $scope.model.language != "CMS_LANGUAGE20211027001") {
            var data = dataEditor.getData();
            $scope.modelJson.content = data;
        }
        var json = null;
        if ($scope.model.language != "CMS_LANGUAGE20211027001") {
            if ($scope.jsonMultipleLanguage != null) {
                json = $scope.jsonMultipleLanguage.find(x => x.lgn == $scope.modelJson.lgn);
                if (json == null) {
                    $scope.jsonMultipleLanguage.push($scope.modelJson);
                }
                else {
                    var index = $scope.jsonMultipleLanguage.findIndex(x => x.lgn == $scope.modelJson.lgn);
                    $scope.jsonMultipleLanguage[index] = angular.copy($scope.modelJson);
                }
            }
            else {
                $scope.jsonMultipleLanguage = [];
                $scope.jsonMultipleLanguage.push($scope.modelJson);
            }
        }
        $scope.model.multiple_language = JSON.stringify($scope.jsonMultipleLanguage);

        $scope.model.json_editor=JSON.stringify($rootScope.JsonEdit);
        validationSelect($scope.model);
        if ($scope.editform.validate() && !validationSelect($scope.model).Status) {
            var model = angular.copy($scope.model);
            model.date_post = moment($scope.model.date_post, 'DD/MM/YYYY HH:mm');
            dataserviceCmsItem.update(model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    var file = document.getElementById("File").files[0]
                    if (file != undefined) {
                        $rootScope.submitImage();
                    }
                    $uibModalInstance.close();
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
                    dataserviceCmsItem.delete(id, function (rs) {
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
            $uibModalInstance.close();
            //$scope.reloadNoResetPage();
        }, function () {
        });
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

    function refreshData() {
        var check = dataEditor;
        if (check !== undefined) {
            check.setData($scope.model.full_text);
        }
    }

    setTimeout(function () {
        $("#DatePost").datetimepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy hh:ii",
            fontAwesome: true,
            pickerPosition: "bottom-left"
        });
        //ckEditer();
    }, 500);
});

app.controller('image', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceCmsItem, $filter) {
    $scope.loadImage = function () {
        var fileuploader = angular.element("#File");
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
            if (extFile != "jpg" && extFile != "jpeg" && extFile != "png" && extFile != "gif" && extFile != "bmp") {
                App.toastrError("caption.CMS_ITEM_MSG_IMG_FORMAT");
                return;
            }
            reader.readAsDataURL(files[0]);
        });
        fileuploader.trigger('click')
    }
    $rootScope.submitImage = function () {
        var file = document.getElementById("File").files[0]
        if (file != undefined) {
            var idxDot = file.name.lastIndexOf(".") + 1;
            var extFile = file.name.substr(idxDot, file.name.length).toLowerCase();
            if (extFile != "jpg" && extFile != "jpeg" && extFile != "png" && extFile != "gif" && extFile != "bmp") {
                App.toastrError(caption.ADM_USER_VALIDATE_ITEM_IMAGE);
                return;
            }
            else {
                $scope.file = file;

            }
        }
        var formData = new FormData();
        formData.append("images", $scope.file);
        formData.append("id", $rootScope.alias);
        formData.append("image_caption", $scope.model.image_caption);
        formData.append("image_credits", $scope.model.image_credits);
        dataserviceCmsItem.insertImage(formData, function (rs) {
            rs = rs.data;

            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
            }
        })
    }
});

app.controller('articlecommon', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceCmsItem, $translate, $window, $filter) {
    var vm = $scope;
    $scope.model = {
        alias: '',
        Type: ''
    };
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;

    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/CMSItem/JTableCSA",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.ArticleCode = $rootScope.alias;
            },
            complete: function () {
                App.unblockUI("#contentMain");
                heightTableManual(200, "#tblDataArticle");
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

        });
    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("SettingID").withTitle(titleHtml).notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full.SettingID] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.SettingID + ']" ng-change="toggleOne(selected)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', 'tcenter hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Title').withTitle('{{"CMS_ITEM_LIST_COL_TITLE" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ValueSet').withTitle('{{"CMS_ITEM_CURD_LBL_VALUE" | translate}}').renderWith(function (data, type) {
        return data;
    }));

    vm.dtColumns.push(DTColumnBuilder.newColumn('GroupNote').withTitle('{{"CMS_ITEM_CURD_LBL_NOTE" | translate}}').renderWith(function (data, type) {
        return data;
    }));

    vm.dtColumns.push(DTColumnBuilder.newColumn('action').notSortable().withOption('sClass', 'nowrap dataTable-w80').withTitle('{{"COM_LIST_COL_ACTION" | translate}}').renderWith(function (data, type, full, meta) {
        return '<a title="{{&quot;COM_BTN_EDIT&quot; | translate}}" ng-click="edit(' + full.SettingID + ')" style1= "width: 25px; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgba(85,168,253,0.45);" class1="btn btn-icon-only btn-circle btn-outline blue"><i class="fas fa-edit fs25 pr20"></i></a>' +
            '<a title="{{&quot;COM_BTN_DELETE&quot; | translate}}" ng-click="delete(' + full.SettingID + ')" style1="width: 25px; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgba(230,60,95,0.45)" class1="btn btn-icon-only btn-circle btn-outline red"><i class="fas fa-trash-alt fs25 text-danger"></i></a>';
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

    $scope.reload1 = function () {
        reloadData(true);
    }
    $scope.reloadNoResetPage1 = function () {
        reloadData(false);
    }
    $scope.search = function () {
        reloadData(true);
    }

    $scope.addCSA = function () {

        validationSelect($scope.model);
        if ($scope.addCSAform.validate() && !validationSelect($scope.model).Status) {
            $scope.model.alias = $rootScope.alias;
            if (!$rootScope.isAdded) {
                dataserviceCmsItem.insertCSA($scope.model, function (rs) {
                    rs = rs.data;
                    if (rs.Error) {
                        App.toastrError(rs.Title);
                    } else {
                        App.toastrSuccess(rs.Title);
                        $rootScope.isShow = "1";

                        $scope.reloadNoResetPage1();

                        //$uibModalInstance.close();
                    }
                });
            }
            else {
                dataserviceCmsItem.updateCSA($scope.model, function (rs) {
                    rs = rs.data;
                    if (rs.Error) {
                        App.toastrError(rs.Title);
                    } else {
                        App.toastrSuccess(rs.Title);
                        $rootScope.isShow = "1";

                        $scope.reloadNoResetPage1();

                        //$uibModalInstance.close();
                    }
                })

            }
        }
    }

    $scope.read = false;
    $scope.edit = function (id) {

        dataserviceCmsItem.getItemCSA(id, function (rs) {
            rs = rs.data;

            $scope.model = rs.Object;
            $scope.read = true;
            $rootScope.ArticleCode = $scope.model.ArticleCode;
        });

        $rootScope.isAdded = true;
    }
    //$rootScope.changeLanguageAttribute = function (code) {
    //    if ($scope.jsonMultipleLanguage != null) {
    //        var json = $scope.jsonMultipleLanguage.find(x => x.lgn == code);
    //        if (json != null && code != 'CMS_LANGUAGE20211027001') {
    //            $scope.modelJson = angular.copy(json);
    //        }
    //        else {
    //            $scope.modelJson.value = "";
    //            $scope.modelJson.title = "";
    //        }
    //        //if (code != 'CMS_LANGUAGE20211027001') {
    //        //    dataEditor.setData($scope.modelJson.content);
    //        //}
    //        //else {
    //        //    dataEditor.setData($scope.model.full_text);
    //        //}
    //    }
    //    $scope.modelJson.lgn = code;
    //    $rootScope.language = code;
    //}

    $scope.approve = function (id) {

        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmUpdate.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = caption.CMS_ITEM_VALIDATE_STATE_DISPLAY;
                $scope.ok = function () {

                    dataserviceCmsItem.aprrove(id, function (rs) {
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
    $scope.delete = function (id) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = caption.COM_MSG_DELETE_CONFIRM_COM;
                $scope.ok = function () {
                    dataserviceCmsItem.deleteCSA(id, function (rs) {
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
            $scope.reloadNoResetPage1();
        }, function () {
        });
    }

    $scope.initData = function () {

        dataserviceCmsItem.getCatId(function (rs) {
            rs = rs.data;

            $scope.listCatId = rs;
        });
        dataserviceCmsItem.getTypeCMA(function (rs) {
            rs = rs.data;

            $scope.listtTypeCMA = rs;
        });


    };
    $scope.initData();

    $scope.changleSelect = function (SelectType) {
        if (SelectType == "type" && $scope.model.Type != "" && $scope.model.Type != null) {
            $scope.errorType = false;
        }

    }

    function validationSelect(data) {

        var mess = { Status: false, Title: "" }
        if (data.Type == "" || data.Type == null) {
            $scope.errorType = true;
            mess.Status = true;
        } else {
            $scope.errorType = false;

        }

        return mess;
    }
    setTimeout(function () {
        //showHideSearch();
    }, 200);

});

app.controller('viewItem', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, $filter, $translate, dataserviceCmsItem, para) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    }

    $scope.model = {};

    dataserviceCmsItem.getContentCms(para.Id, function (rs) {
        rs = rs.data;
        $scope.model.Title = para.Title;
        $('#cmsViewItem').html(rs.Content);
    })

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200)
});
app.controller('addHashTag', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $filter, $translate, dataserviceCmsItem) {
    $scope.model = {
        Tag: ''
    };
    $scope.submit = function () {
        if (/*!validationSelect($scope.model).Status*/true) {
            if ($scope.model.Tag == '' || $scope.model.Tag == null || $scope.model.Tag == undefined) {
                return App.toastrError('Nhập nội dung tag');
            }

            var checkExit = $rootScope.listHashTag.find(function (element) {
                if (element == $scope.model.Tag) return true;
            });

            if (checkExit != '' && checkExit != null && checkExit != undefined) {
                return App.toastrError('Tag đã tồn tại');
            }

            $rootScope.listHashTag.push($scope.model.Tag);

            $rootScope.JsonData = JSON.stringify($rootScope.listHashTag);
            var data = {
                id: $rootScope.alias,
                hash_tag: $rootScope.JsonData
            }

            dataserviceCmsItem.updateHashTag(data, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    return App.toastrError(rs.Title);
                } else {
                    //$scope.reloadQuestion();
                    return App.toastrSuccess(rs.Title);
                }
            });
        }
    };
    $scope.deleteTag = function (data) {
        if ($rootScope.listHashTag.indexOf(data) == -1) {
            App.toastrError('Xóa thất bại')
        } else {
            $rootScope.listHashTag.splice($rootScope.listHashTag.indexOf(data), 1);

            $rootScope.JsonData = JSON.stringify($rootScope.listHashTag);
            var data = {
                id: $rootScope.alias,
                hash_tag: $rootScope.JsonData
            }

            dataserviceCmsItem.updateHashTag(data, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    return App.toastrError(rs.Title);
                } else {
                    return App.toastrSuccess(rs.Title);
                }
            });
        }
    }
});