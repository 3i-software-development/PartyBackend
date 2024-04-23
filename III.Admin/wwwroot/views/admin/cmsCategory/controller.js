var ctxfolderCmsCat = "/views/admin/cmsCategory";
var ctxfolderMessage = "/views/message-box";

var app = angular.module('App_ESEIM_CMS_CAT', ["ui.bootstrap", "ngRoute", "ngValidate", "datatables", "datatables.bootstrap", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', "ngJsTree", "treeGrid", "ui.select", "ngCookies", "pascalprecht.translate", 'dynamicNumber']);

app.directive('treeGrid', function ($parse) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, el, attrs) {
            scope.$watch(attrs['ngModel'], function (v) {
                setTimeout(function () {
                    el.treegrid({
                        expanderExpandedClass: 'fa fa-caret-up pull-right pt5',
                        expanderCollapsedClass: 'fa fa-caret-down pull-right pt5'
                    });
                    /*el.treegrid('collapseAll');*/
                }, 1000);
            });
        }
    };
})

app.factory('dataserviceCmsCat', function ($http) {
    $http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    var headers = {
        "Content-Type": "application/json;odata=verbose",
        "Accept": "application/json;odata=verbose",
    };
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
    return {
        getUser: function (callback) {
            $http.post('/Admin/cms_categories/GetUser').then(callback);
        },
        insert: function (data, callback) {
            submitFormUpload('/Admin/CMSCategory/Insert/', data, callback);
        },
        update: function (data, callback) {
            submitFormUpload('/Admin/CMSCategory/Update/', data, callback);
        },
        delete: function (data, callback) {
            $http.post('/Admin/CMSCategory/Delete/' + data).then(callback);
        },
        getParenCat: function (callback) {
            $http.post('/Admin/CMSCategory/GetParenCat/').then(callback);
        },
        getExtraFiled: function (callback) {
            $http.post('/Admin/CMSCategory/GetExtraFiled/').then(callback);
        },
        getlistGroup: function (callback) {
            $http.post('/Admin/CMSCategory/GetExtraGroup').then(callback);
        },
        getlistLanguage: function (callback) {
            $http.post('/Admin/CMSCategory/GetListLanguage').then(callback);
        },
        getTemplate: function (callback) {
            $http.post('/Admin/CMSCategory/GetTemplate').then(callback);
        },
        gettreedata: function (callback) {
            $http.post('/Admin/CMSCategory/GetTreeData').then(callback);
        },
        getItem: function (data, callback) {
            $http.post('/Admin/CMSCategory/GetItem/', data).then(callback);
        },
        approve: function (data, callback) {
            $http.post('/Admin/CMSCategory/Approve/' + data).then(callback);
        }
    };
});
app.controller('Ctrl_ESEIM_CMS_CAT', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceCmsCat, $cookies, $translate) {
    $rootScope.go = function (path) {
        $location.path(path); return false;
    };
    var culture = $cookies.get('_CULTURE') || 'vi-VN';
    $translate.use(culture);
    $rootScope.IsTranslate = false;
    $rootScope.$on('$translateChangeSuccess', function () {
        caption = caption[culture] ? caption[culture] : caption;
        $.extend($.validator.messages, {
            //min: caption.COM_VALIDATE_VALUE_MIN,
            //max: 'Max some message {0}'
        });
        $rootScope.checkData = function (data) {
            var partternCode = /^[a-zA-Z0-9]+[^Đđ!@#$%^&*<>?\s]*$/;
            var partternName = /^(^[ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z.0-9\s]+$)|^(^[0-9]+[ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z.\s][ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z.0-9\s]*$)/
            var mess = { Status: false, Title: "" }
            if (!partternCode.test(data.ActCode)) {
                mess.Status = true;
                mess.Title = mess.Title.concat(" - ", caption.COM_VALIDATE_ITEM_CODE.replace('{0}', caption.AA_CURD_LBL_AA_ACTCODE), "<br/>");
            }
            if (!partternName.test(data.ActTitle)) {
                mess.Status = true;
                mess.Title += caption.COM_VALIDATE_ITEM_NAME.replace('{0}', caption.AA_CURD_LBL_AA_ACTTITLE) + "<br/>";
                //mess.Title += " - " + caption.VALIDATE_ITEM_NAME.replace('{0}', caption.USER_USERNAME) + "<br/>";
            }
            return mess;
        }
        $rootScope.validationOptionsCmsCat = {
            rules: {
                Name: {
                    required: true
                },
                Alias: {
                    required: true
                },
            },
            messages: {
                Name: {
                    //required: "Tên danh mục không được bỏ trống",
                    required: caption.CMS_CAT_VALIDATE_CATEGORY_NAME,
                },
                Alias: {
                    //required: "Alias không được bỏ trống",
                    required: caption.CMS_CAT_VALIDATE_ALIAS,
                },
            }
        }
        $rootScope.IsTranslate = true;
    });
    dataserviceCmsCat.getUser(function (rs) {
        rs = rs.data;
        $rootScope.listUser = rs;
    });
    var url_string = window.location.href;
    var url = new URL(url_string);
    var group = url.searchParams.get("group");
    if (group !== '' && group !== null && group !== undefined) {
        $rootScope.group = group;
    }
});
app.config(function ($routeProvider, $validatorProvider, $translateProvider) {
    $translateProvider.useUrlLoader('/Admin/CMSCategory/Translation');
    caption = $translateProvider.translations();
    $routeProvider
        .when('/', {
            templateUrl: ctxfolderCmsCat + '/index.html',
            controller: 'indexCmsCat'
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
});
app.controller('indexCmsCat', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceCmsCat, $translate, $window) {
    var vm = $scope;
    $scope.model = {
        categoryName: '',
        published: '',
        extra_field_group: '',
    };
    $scope.listCms = [];
    $scope.isGroupLocked = false;
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    $scope.listPublished = [
        { code: '', name: 'Tất cả' },
        {
            code: false,
            name: "Không hiển thị"
        }, {
            code: true,
            name: "Hiển thị"
        }
    ];
    $scope.initData = function () {
        if ($rootScope.group == "USER_MANUAL") {
            $scope.model.extra_field_group = 32;
            //$scope.isGroupLocked = true;
        }
        dataserviceCmsCat.getlistGroup(function (rs) {
            rs = rs.data;
            $scope.listGroup = rs;
            var all = {
                Id: '',
                Name: 'Tất cả'
            }
            $scope.listGroup.unshift(all)
        });

        dataserviceCmsCat.gettreedata(function (result) {
            result = result.data;
            $scope.listCms = result;
            for (var i = 0; i < $scope.listCms.length; i++) {
                if ($scope.listCms[i].Level == 0) {
                    $scope.listCms[i].IsExpand = true;
                } else {
                    $scope.listCms[i].IsExpand = false;
                }
            }
        });
    };
    $scope.initData();
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/CMSCategory/Jtable",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.extra_field_group = $scope.model.extra_field_group;
                d.categoryName = $scope.model.categoryName;
                d.published = $scope.model.published;
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
            $scope.selected[full.Id] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.Id + ']" ng-click="toggleOne(selected)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', 'tcenter hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('name').withTitle('{{"CMS_CAT_COL_NAME" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ordering').withTitle('{{"CMS_CAT_COL_ORDER" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('published').withTitle('{{"CMS_CAT_COL_PUBLISH" | translate}}').renderWith(function (data, type, full) {

        if (data == "True") {
            return '<span class="cursor glyphicon glyphicon-ok-sign text-success fs20 pTip-right btn-publish-inline" ng-click="publish(' + full.Id + ')" ></span> '
        }
        else {
            return '<span class="cursor glyphicon glyphicon-ban-circle text-danger fs20 pTip-right btn-publish-inline" ng-click="publish(' + full.Id + ')"></span> '
        }

    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').notSortable().withOption('sClass', 'nowrap').withTitle('{{"COM_LIST_COL_ACTION" | translate}}').renderWith(function (data, type, full, meta) {
        return '<button title="{{&quot;COM_BTN_EDIT&quot; | translate}}" ng-click="edit(' + full.Id + ')" style = "width: 25px; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgba(85,168,253,0.45);" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit"></i></button>' +
            '<button title="{{&quot;COM_BTN_DELETE&quot; | translate}}" ng-click="delete(' + full.Id + ')" style="width: 25px; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgba(230,60,95,0.45)" class="btn btn-icon-only btn-circle btn-outline red"><i class="fa fa-trash"></i></button>';
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
        dataserviceCmsCat.gettreedata(function (result) {
            result = result.data;
            $scope.listCms = result;
            for (var i = 0; i < $scope.listCms.length; i++) {
                if ($scope.listCms[i].Level == 0) {
                    $scope.listCms[i].IsExpand = true;
                } else {
                    $scope.listCms[i].IsExpand = false;
                }
            }
        });
        /*reloadData(true);*/
    };
    $scope.reloadNoResetPage = function () {
        dataserviceCmsCat.gettreedata(function (result) {
            result = result.data;
            $scope.listCms = result;
            for (var i = 0; i < $scope.listCms.length; i++) {
                if ($scope.listCms[i].Level == 0) {
                    $scope.listCms[i].IsExpand = true;
                } else {
                    $scope.listCms[i].IsExpand = false;
                }
            }
        });
        /*reloadData(false);*/
    };
    $scope.search = function () {
        reloadData(true);
    };
    $scope.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCmsCat + '/add.html',
            controller: 'addCmsCat',
            backdrop: 'static',
            size: '50',
            resolve: {
                para: function () {
                    return '';
                }
            },
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    };

    $scope.edit = function (id) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCmsCat + '/edit.html',
            controller: 'editCmsCat',
            backdrop: 'static',
            size: '50',
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
    };

    $scope.publish = function (id) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmUpdate.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = "Bạn muốn thay đổi trạng thái hiển thị?";
                $scope.ok = function () {

                    dataserviceCmsCat.approve(id, function (rs) {
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
                    dataserviceCmsCat.delete(id, function (rs) {
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

    $scope.isSearch = false;
    $scope.showSearch = function () {
        if (!$scope.isSearch) {
            $scope.isSearch = true;
        } else {
            $scope.isSearch = false;
        }
    };
    setTimeout(function () {
    }, 500);
});
app.controller('addCmsCat', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, dataserviceCmsCat, para) {
    $scope.model = {
        name: '',
        alias: '',
        ordering: '',
        published: '',
        parent: '',
        extra_fields_group: '',
        description: '',
        language: '',
        template: '',

    };
    $scope.modelJson = {
        lgn: '',
        title: '',
        content: ''
    };
    $rootScope.isShow = '';
    $scope.isGroupLocked = false;
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
        var json = $scope.jsonMultipleLanguage.find(x => x.lgn == code);
        if (json != null && code != 'CMS_LANGUAGE20211027001') {
            $scope.modelJson = angular.copy(json);
        }
        $scope.modelJson.lgn = code;
        if (code != 'CMS_LANGUAGE20211027001') {
            $scope.modelJson.title = "";
        }
        dataEditor.setData("");
    }
    //$scope.listLanguage = [
    //    {
    //        Code: "all",
    //        Name: "Tất cả"
    //    }, {
    //        Code: "vi_VN",
    //        Name: "Tiếng việt"
    //    },
    //    {
    //        Code: "en_US",
    //        Name: "English"
    //    }];

    $scope.chkSubTab = function () {
        if ($rootScope.isShow == '') {
            App.toastrError(caption.CMS_ITEM_MSG_NOT_BLANK);
        }
    }
    $scope.submit = function () {
        var check = dataEditor;
        if (check !== undefined && $scope.model.language == "CMS_LANGUAGE20211027001") {
            var data = dataEditor.getData();
            $scope.model.description = data;
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
        if ($scope.addform.validate()) {
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
                    //reader.readAsDataURL(files[0]);

                }
            }
            var formData = new FormData();
            formData.append("images", $scope.file);
            formData.append("name", $scope.model.name);
            formData.append("template", $scope.model.template);
            formData.append("alias", $scope.model.alias);
            formData.append("ordering", $scope.model.ordering);
            formData.append("parent", $scope.model.parent);
            formData.append("extra_fields_group", $scope.model.extra_fields_group);
            formData.append("published", $scope.model.published);
            formData.append("language", $scope.model.language);
            formData.append("description", $scope.model.description);
            formData.append("multiple_language", $scope.model.multiple_language);

            dataserviceCmsCat.insert(formData, function (rs) {
                rs = rs.data;
                if (!rs.Error) {
                    App.toastrSuccess(rs.Title);

                    $uibModalInstance.close();
                }
                else {
                    App.toastrError(rs.Title);

                }
            });
        }

    };
    $scope.initData = function () {
        if (para != '') {
            $scope.model.parent = para;
        }
        dataserviceCmsCat.getExtraFiled(function (rs) {
            rs = rs.data;
            $scope.listExtraFiled = rs;
        });
        dataserviceCmsCat.getTemplate(function (rs) {
            rs = rs.data;
            $scope.listTemplate = rs;
        });
        dataserviceCmsCat.gettreedata(function (result) {
            result = result.data;
            $scope.listParenCat = result;
        });
        dataserviceCmsCat.getlistLanguage(function (rs) {
            rs = rs.data;
            $rootScope.listLanguage = rs;
            if ($rootScope.listLanguage.length > 0) {
                $scope.model.language = $rootScope.listLanguage[0].Code;
            }
        });
    }
    $scope.initData();
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
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
                App.toastrError("Định dạng ảnh không hợp lệ!");
                return;
            }
            reader.readAsDataURL(files[0]);
        });
        fileuploader.trigger('click')
    }

    function ckEditer() {
        var editor = CKEDITOR.replace('ckEditorItemCategory', {
            cloudServices_tokenUrl: '/MobileApp/Token',
            cloudServices_uploadUrl: '/MobileApp/UploadFile',
            filebrowserBrowseUrl: '',
            filebrowserUploadUrl: '/MobileApp/Upload',
            embed_provider: '/uploader/upload.php'
        });
        CKEDITOR.instances['ckEditorItemCategory'].config.height = 250;
    }

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
        //ckEditer();
    }, 500);
});
app.controller('editCmsCat', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, dataserviceCmsCat, para) {
    $scope.model = {
        name: '',
        alias: '',
        ordering: '',
        published: '',
        parent: '',
        extra_fields_group: '',
        description: '',
        language: '',
        template: '',

    };
    $scope.modelJson = {
        lgn: '',
        title: '',
        content: ''
    };
    $scope.isGroupLocked = false;
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
            }
            if (code != 'CMS_LANGUAGE20211027001') {
                dataEditor.setData($scope.modelJson.content);
            }
            else {
                dataEditor.setData($scope.model.description);
            }
        }
        else {
            $scope.modelJson.content = "";
            $scope.modelJson.title = "";
            if (code !== 'CMS_LANGUAGE20211027001') {
                dataEditor.setData('');
            }
            else {
                dataEditor.setData($scope.model.full_text);
            }
        }
        $scope.modelJson.lgn = code;
    }
    //$scope.listLanguage = [
    //    {
    //        Code: "all",
    //        Name: "Tất cả"
    //    }, {
    //        Code: "vi_VN",
    //        Name: "Tiếng việt"
    //    },
    //    {
    //        Code: "en_US",
    //        Name: "English"
    //    }];
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
    $scope.initData = function () {
        if ($rootScope.group == "USER_MANUAL") {
            $scope.isGroupLocked = true;
        }
        dataserviceCmsCat.getItem(para, function (rs) {
            rs = rs.data;
            $scope.model = rs;
            try {
                $scope.jsonMultipleLanguage = JSON.parse($scope.model.multiple_language);
            } catch (e) {
                console.log(e);
            }
            dataEditor.setData($scope.model.description);
        });
        dataserviceCmsCat.getExtraFiled(function (rs) {
            rs = rs.data;
            $scope.listExtraFiled = rs;
        });
        dataserviceCmsCat.getTemplate(function (rs) {
            rs = rs.data;
            $scope.listTemplate = rs;
        });
        dataserviceCmsCat.gettreedata(function (result) {
            result = result.data;
            $scope.listParenCat = result;
        });
    }
    $scope.initData();

    $scope.submit = function () {
        var check = dataEditor;
        if (check !== undefined && $scope.model.language == "CMS_LANGUAGE20211027001") {
            var data = dataEditor.getData();
            $scope.model.description = data;
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
        if ($scope.editform.validate()) {
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
            formData.append("id", para);
            formData.append("images", $scope.file);
            formData.append("name", $scope.model.name);
            formData.append("template", $scope.model.template == null ? "" : $scope.model.template);
            formData.append("alias", $scope.model.alias);
            formData.append("ordering", $scope.model.ordering == null ? "" : $scope.model.ordering);
            formData.append("parent", $scope.model.parent == null ? "" : $scope.model.parent);
            formData.append("extra_fields_group", $scope.model.extra_fields_group == null ? "" : $scope.model.extra_fields_group);
            formData.append("published", $scope.model.published == null ? "" : $scope.model.published);
            formData.append("language", $scope.model.language == null ? "" : $scope.model.language);
            formData.append("description", $scope.model.description == null ? "" : $scope.model.description);
            formData.append("multiple_language", $scope.model.multiple_language == null ? "" : $scope.model.multiple_language);
            dataserviceCmsCat.update(formData, function (rs) {
                rs = rs.data;
                if (!rs.Error) {
                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.close();
                }
                else {
                    App.toastrError(rs.Title);
                }
            });
        }

    }

    $scope.delete = function (id) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = caption.COM_MSG_DELETE_CONFIRM_COM;
                $scope.ok = function () {
                    dataserviceCmsCat.delete(id, function (rs) {
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
                App.toastrError("Định dạng ảnh không hợp lệ!");
                return;
            }
            reader.readAsDataURL(files[0]);
        });
        fileuploader.trigger('click')
    };
    function ckEditer() {
        var editor = CKEDITOR.replace('ckEditorItemCategory', {
            cloudServices_tokenUrl: '/MobileApp/Token',
            cloudServices_uploadUrl: '/MobileApp/UploadFile',
            filebrowserBrowseUrl: '',
            filebrowserUploadUrl: '/MobileApp/Upload',
            embed_provider: '/uploader/upload.php'
        });
    }

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
        //ckEditer();
    }, 500);
});