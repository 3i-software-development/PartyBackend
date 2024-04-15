var ctxfolder = "/views/admin/GuilineManager";
var ctxfolderMessage = "/views/message-box";
var app = angular.module('App_ESEIM', ['App_ESEIM_DASHBOARD',"ui.bootstrap", "ngRoute", "ngValidate", "datatables", "datatables.bootstrap", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', "ui.select", "ngCookies", "pascalprecht.translate"]);
app.factory('dataservice', function ($http) {
    $http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    var headers = {
        "Content-Type": "application/json;odata=verbose",
        "Accept": "application/json;odata=verbose",
    }
    return {
        insert: function (data, callback) {
            $http.post('/Admin/GuilineManager/AddGuideline', data).then(callback).catch(function(error) {
                // Xử lý lỗi
                App.toastrError("Có lỗi xảy ra")
            });
        },
        update: function (data, callback) {
            $http.put('/Admin/GuilineManager/UpdateGuideline', data).then(callback).catch(function(error) {
                // Xử lý lỗi
                App.toastrError("Có lỗi xảy ra")
            });
        },
        delete: function (data, callback) {
            $http.delete('/Admin/GuilineManager/DeleteGuideline/' + data).then(callback).catch(function(error) {
                // Xử lý lỗi
                App.toastrError("Có lỗi xảy ra")
            });
        },
        getItem: function (data, callback) {
            $http.post('/Admin/GuilineManager/Getitem/' + data).then(callback).catch(function(error) {
                // Xử lý lỗi
                App.toastrError("Có lỗi xảy ra")
            });
        },
        getAll: function(callback){
            $http.get('/Admin/GuilineManager/GetGuidelines/').then(callback).catch(function(error) {
                // Xử lý lỗi
                App.toastrError("Có lỗi xảy ra")
            });
        }
    }
});
app.controller('Ctrl_ESEIM', function ($scope, $rootScope, $compile, $uibModal, dataservice, $cookies, $translate) {
    $rootScope.go = function (path) {
        $location.path(path); return false;
    };
    var culture = $cookies.get('.AspNetCore.Culture') || 'vi-VN';
    $translate.use(culture);

    $rootScope.$on('$translateChangeSuccess',
        function () {
            caption = caption[culture];
            $rootScope.checkData = function (data) {
                var partternCode = /^[a-zA-Z0-9_äöüÄÖÜ]*$/;
                var partternName = /^[ĂăĐđĨĩŨũƠơƯưẠ-ỹa-zA-Z0-9]+[^!@#$%^&*<>?]*$/; //Có chứa được khoảng trắng
                var partternDescription = /^[ĂăĐđĨĩŨũƠơƯưẠ-ỹa-zA-Z0-9]*[^Đđ!@#$%^&*<>?]*$/; //Có thể null, và có chứa được khoảng trắng
                var mess = { Status: false, Title: "" }
                if (!partternCode.test(data.Guide)) {
                    mess.Status = true;
                    mess.Title = mess.Title.concat(" - ", caption.COM_VALIDATE_ITEM_CODE.replace('{0}', 'Mã nhóm người dùng'), "<br/>");
                }
                return mess;
            }
            $rootScope.validationOptions = {
                rules: {
                    Title: {
                        required: true,
                        maxlength: 255
                    },
                    GroupUserCode: {
                        required: true,
                        maxlength: 50
                    },
                    Description: {
                        maxlength: 500
                    }
                },
                messages: {
                    GroupUserCode: {
                        required: caption.COM_ERR_REQUIRED.replace('{0}', 'Mã nhóm người dùng'),
                        maxlength: caption.COM_ERR_EXCEED_CHARACTERS.replace('{0}', 'Mã nhóm người dùng').replace('{1}', '50')
                    },
                    Title: {
                        required: caption.COM_ERR_REQUIRED.replace('{0}', 'Tên nhóm người dùng'),
                        maxlength: caption.COM_ERR_EXCEED_CHARACTERS.replace('{0}', 'Tên nhóm người dùng').replace('{1}', '255')
                    },
                    Description: {
                        maxlength: caption.COM_ERR_EXCEED_CHARACTERS.replace('{0}', 'Mô tả').replace('{1}', '500')
                    }
                }
            }
            $rootScope.StatusData = [
                {
                    Value: '',
                    Name: 'Tất cả'
                },
                {
                Value: true,
                Name: 'Hoạt động'
                },
                {
                Value: false,
                Name: 'Không hoạt động'
            }];
        });


});
app.config(function ($routeProvider, $validatorProvider, $translateProvider) {
    $translateProvider.useUrlLoader('/Admin/GroupUser/Translation');
    //$translateProvider.preferredLanguage('en-US');
    caption = $translateProvider.translations();
    $routeProvider
        .when('/',
            {
                templateUrl: ctxfolder + '/index.html',
                controller: 'index'
            })

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
});
app.controller('index', function ($scope, $rootScope, $compile, $confirm, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, $translate) {
    $scope.ListGuide=[];

    $scope.init=function(){
        dataservice.getAll(function(rs){
            rs=rs.data;
            console.log(rs);
            $scope.ListGuide=rs
        })
    }
    $scope.init()
    $scope.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/add.html',
            controller: 'add',
            backdrop: 'static',
            size: '40'
        });
        modalInstance.result.then(function (d) {
            $scope.init()
        }, function () {
        });
    }


    $scope.edit = function (Item) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/edit.html',
            controller: 'edit',
            backdrop: 'static',
            size: '40',
            resolve: {
                para: function(){
                    return Item;
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.init()
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

    setTimeout(function () {
    }, 50);
});

app.controller('add', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice) {
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
    $scope.submit = function () {
        if ($scope.addform.validate()) {
            var temp = $rootScope.checkData($scope.model);
            if (temp.Status) {
                App.toastrError(temp.Title);
                return;
            }

            dataservice.insert($scope.model, function (rs) {rs=rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.close();
                }
            });
        }
    }
    
});
app.controller('edit', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice, para) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
    $scope.initData = function () {
        console.log(para);
        $scope.Id=para.Id;
        $scope.model = para;
    }
    $scope.initData();

    $scope.submit = function () {
        dataservice.update($scope.model, function (rs) {rs=rs.data;
            App.toastrSuccess("Sửa thành công");
            $uibModalInstance.close();
        });
    }
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

