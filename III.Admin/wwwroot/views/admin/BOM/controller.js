var ctxfolderBOM = "/views/admin/BOM";

var app = angular.module('App_ESEIM', ["ngRoute", "ngCookies", "ngValidate", "datatables", "datatables.bootstrap", "pascalprecht.translate", "ngJsTree", "treeGrid", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', 'ui.select', 'dynamicNumber', 'ng.jsoneditor']);

app.controller('Ctrl_ESEIM', function ($scope, $rootScope, $cookies, $filter, $translate) {
    $rootScope.go = function (path) {
        $location.path(path); return false;
    };
    var culture = $cookies.get('_CULTURE') || 'vi-VN';
    $translate.use(culture);
    $rootScope.IsTranslate = false;
    $rootScope.$on('$translateChangeSuccess', function () {
        $rootScope.IsTranslate = true;
        caption = caption[culture] ? caption[culture] : caption;

        $rootScope.validationOptionsBonus = {
            rules: {
                DecisionNum: {
                    required: true,
                    regx: /^[a-zA-Z0-9]+[^êĂăĐđĨĩŨũƠơƯưẠ-ỹ!@#$%^&*<>?\s]*$/
                },
                Title: {
                    required: true,
                    regx: /^[^\s].*/
                },
            },
            messages: {
                DecisionNum: {
                    required: "Số quyết định không được để trống",
                    regx: 'Số quyết định không nhập ký tự đặc biệt'
                },
                Title: {
                    required: "Tên quyết định không được để trống",
                    regx: 'Không nhập khoảng trắng'
                },
            }
        }
    });
    //Lấy ra quyền admin hay user
    $rootScope.isAllData = false;
    if (isAllData != undefined && isAllData != null && isAllData != '') {
        $rootScope.isAllData = isAllData == 'True' ? true : false;
    }
});

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
    return{
        GetActInstArranged:function (data, callback) {
            $http.post(`/Admin/WorkflowActivity/GetActInstArranged?objInst=${data}&objType=BOM_ACTIVITY`).then(callback)
        },
    }
})

app.config(function ($routeProvider, $validatorProvider, $translateProvider, $httpProvider) {
    $translateProvider.useUrlLoader('/Admin/BonusDecision/Translation');
    caption = $translateProvider.translations();
    $routeProvider
        .when('/', {
            templateUrl: ctxfolderBOM + '/index.html',
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
    
});

app.controller('index', function ($scope, $rootScope, $cookies, $filter, $translate,dataservice){
    $scope.isEditWorkflow=false;
    function formatActIns(objIns) {
        dataservice.GetActInstArranged(objIns,function(rs){
            console.log(rs.data)
            if(rs.data.ActArranged==[]){
                $scope.isEditWorkflow = false
                fixContent()
                return
            }
            $scope.listActs=rs.data.ActArranged;
            $scope.isEditWorkflow = true
            fixContent()
        })
    }

    $scope.editWorkflow=function(){
        $scope.isEditWorkflow=false
        fixContent()
    }
    $scope.editWorkflow2=function(insCode){
        formatActIns(insCode)
        fixContent()
    }
    function fixContent(){
        if ($scope.isEditWorkflow == true) {
            $('#tblData_wrapper').css('width', '60%');
            
        }else{
            $('#tblData_wrapper').css('width', '');
            return
        }
    }


    $scope.ListOption=[{
        Name:'tùy chọn 1',
        Code: "1",
    },{
        Name:'tùy chọn 2',
        Code: "2",
    },{
        Name:'tùy chọn 3',
        Code: "3",
    }]
})