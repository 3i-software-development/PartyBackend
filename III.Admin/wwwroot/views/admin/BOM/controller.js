var ctxfolderBOM = "/views/admin/BOM";

var app = angular.module('App_ESEIM', ["ngRoute", "ngCookies", "ngValidate", "datatables", "datatables.bootstrap", "pascalprecht.translate", "ngJsTree", "treeGrid", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', 'ui.select', 'dynamicNumber', 'ng.jsoneditor']);

app.controller('Ctrl_ESEIM', function ($scope, $rootScope, $cookies, $filter, $translate) {
    $rootScope.UserName=$scope.username
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
        GetItemActInst:function (data, callback) {
            $http.get(`/Admin/WorkflowActivity/GetItemActInst/`+data).then(callback)
        },
        GetAttrOfAct: function (data, callback) {
            $http.get(`/Admin/WorkflowActivity/GetAttrOfAct?actCode=`+data).then(callback)
        },
        InsertAttrData: function (data, callback) {
            $http.post(`/Admin/WorkflowActivity/InsertAttrData`,data).then(callback)
        },
        GetAttrByGroup:function (data, callback) {
            $http.post(`/Admin/WorkflowActivity/GetAttrByGroup?attrGroup=`+data).then(callback)
        },
        GetBomItem:function (data,io, callback) {
            $http.get(`/Admin/BOM/GetBomItem?activityCode=${data}&io=${io}`).then(callback)
        },
        PostBomRt:function (data, callback) {
            $http.post(`/Admin/BOM/PostBomRt`,data).then(callback)
        },
        PutBomRt:function (data, callback) {
            $http.put(`/Admin/BOM/PutBomRt`,data).then(callback)
        },
        PutBomInChannel:function (data, callback) {
            $http.put(`/Admin/BOM/PutBomInChannel`,data).then(callback)
        },
        PutBomHistory:function (activityCode,userName, callback) {
            $http.put(`/Admin/BOM/PutBomHistory?activityCode=${activityCode}&userName=${userName}`).then(callback)
        },
        GetWarehouseListHds:function (callback) {
            $http.get(`/Admin/BOM/GetWarehouseListHdByCode`).then(callback)
        },
        GetWarehouseListDtByCode:function (data,callback) {
            $http.get(`/Admin/BOM/GetWarehouseListDtByCode?code=${data}`).then(callback)
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
        }).when('/input/:id', {
            templateUrl: ctxfolderBOM + '/input.html',
            controller: 'input'
        }).when('/output/:id', {
            templateUrl: ctxfolderBOM + '/input.html',
            controller: 'output'
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

app.controller('index', function ($scope, $rootScope, $cookies, $filter, $translate,dataservice,$location){
    $scope.isEditWorkflow=false;
    $scope.CloseAll=function(act1){
        console.log(act1);
        $location.path("/input/"+act1.Id)
        // if(!act1.IsApprovable){
        //     act1.checkHiddenActWf = false;
        //     App.toastrError(caption.WFAI_MSG_U_NOT_PER_APPROVE_ACT);
        //     return
        // }
        // var actCheck=act1.checkHiddenActWf
        // $scope.listActs.forEach(function(act) {
        //     act.checkHiddenActWf = false;
        // });
        // act1.checkHiddenActWf=!actCheck;
    }
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

app.controller('input', function ($scope, $rootScope, $cookies, $filter, $translate,dataservice,$routeParams,$location){
    $scope.DetailCode=0
    $scope.increase=function() {
        $scope.DetailCode++
    }

    $scope.decrease=function() {
        $scope.DetailCode--
    }
    $scope.submit=function(){
        console.log($scope.bomDataModel);
        return;
        dataservice.PostBomRt($scope.bomDataModel,function(rs){
            rs=rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
                $uibModalInstance.close();
            } else {
                App.toastrSuccess(rs.Title);
                $uibModalInstance.close();
            }
        })
    }
    $scope.bomDataModel = {
        ListBom: [],
        UserName: window.userName
    };

    // Thêm một mục BomRtModel vào ListBom
    $scope.addBomItem = function(GroupAttr,ActivityCode) {
        var newItem = {
            Id: null,
            ItemCode: '',
            ItemName: '',
            Quantity: 0,
            QuantityRemain: null,
            Unit: GroupAttr.Unit,
            Specification: '',
            Io: 'in',
            ActivityCode: ActivityCode,
            ShiftCode: '',
            WordOrderCode: '',
            ObjectType: '',
            ObjectCode: '',
            ParentId: ''
        };
        $scope.bomDataModel.ListBom.push(newItem);
    };
    
    $scope.output=function(){
        $location.path("/output/"+$routeParams.Id)
    }

    $scope.init=function(){
        dataservice.GetWarehouseListHds(function(rs){
            rs=rs.data;
            $scope.ListHd=rs;
            console.log(rs);
        })
        dataservice.GetItemActInst($routeParams.id,function(rs){
            rs=rs.data
            console.log(rs);
            $scope.ActIns=rs.DataActInst
            dataservice.GetBomItem($scope.ActIns.ActivityCode,"in",function(rs){
                rs=rs.data
                console.log(rs);
            })
            dataservice.GetAttrByGroup('CARD_DATA_LOGGER20240328200210',function(rs){
                rs=rs.data
                console.log(rs);
                $scope.GroupAttr=rs.filter(item => item.Code.endsWith("_I"));
                $scope.GroupAttr.forEach(function(item){
                    $scope.addBomItem(item)
                })
            })
        })
    }
    $scope.init()
})

app.controller('output', function ($scope, $rootScope, $cookies, $filter, $translate,dataservice,$routeParams,$location){
    $scope.output=function(){
        $location.path("/input/"+$routeParams.Id)
    }
    $scope.init=function(){
        dataservice.GetItemActInst($routeParams.id,function(rs){
            rs=rs.data
            console.log(rs);
            $scope.ActIns=rs.DataActInst 
            dataservice.GetBomItem($scope.ActIns.ActivityCode,"out",function(rs){
                rs=rs.data
                console.log(rs);
            })
            dataservice.GetAttrByGroup('CARD_DATA_LOGGER20240328200210',function(rs){
                rs=rs.data
                $scope.GroupAttr=rs.filter(item => item.Code.endsWith("_O"));
                console.log($scope.GroupAttr);
            })
        })
    }
    $scope.init()
})

app.filter('threeDigitString', function() {
    return function(input) {
      var str = String(input);
      while (str.length < 3) {
        str = '0' + str;
      }
      return str;
    };
});