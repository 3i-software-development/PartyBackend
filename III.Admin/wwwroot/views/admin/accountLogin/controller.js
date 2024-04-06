var ctxfolder = "/views/admin/accountLogin";
var ctxfolderMessage = "/views/message-box";
var ctxfolderQrCode = "/views/admin/edmsQRCodeManager";

var app = angular.module('App_ESEIM', ["ui.bootstrap", "ngRoute", "ngValidate", "datatables", "datatables.bootstrap", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', "ngJsTree", "treeGrid", "ui.select", "ngCookies", "pascalprecht.translate"]);

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
            data: data
        }

        $http(req).then(callback);
    };
    return {
        insert: function (data, callback) {
            submitFormUpload('/Admin/User/Insert', data, callback);
        },
        update: function (data, callback) {
            submitFormUpload('/Admin/User/Update', data, callback);
        },
        UploadImageAsync:function (data, callback) {
            $http.post('/Admin/User/UploadImageAsync', data).then(callback);
        },
        getItem: function (callback) {
            $http.post('/Admin/AccountLogin/Getitem/').then(callback);
        },
        resort: function (data, callback) {
            $http.post('/Admin/User/Resort', data).then(callback);
        },
        getAll: function (callback) {
            $http.post('/Admin/User/GetAll/').then(callback);
        },
        loadGroupResource: function (callback) {
            $http.post('/Admin/User/GetGroupResource/').then(callback);
        },
        loadCompany: function (callback) {
            $http.post('/Admin/User/GetCompany/').then(callback);
        },
        loadOrganization: function (callback) {
            $http.post('/Admin/User/GetOrganization/').then(callback);
        },
        loadDepartment: function (callback) {
            $http.post('/Admin/User/GetDepartment/').then(callback);
        },
        loadRole: function (callback) {
            $http.post('/Admin/User/GetRole/').then(callback);
        },
        loadBranch: function (callback) {
            $http.post('/Admin/User/GetBranch/').then(callback);
        },
        loadProfitCenter: function (callback) {
            $http.post('/Admin/User/GetProfitCenter/').then(callback);
        },
        loadAccountExecutive: function (callback) {
            $http.post('/Admin/User/GetAccountExecutive/').then(callback);
        },
        deleteGUser: function (data, callback) {
            $http.post('/Admin/User/DeleteGUser', data).then(callback);
        },
        getListGroupRole: function (data, callback) {
            $http.get('/Admin/User/GetListGroupRole/' + data).then(callback);
        },
        deactive: function (data, callback) {
            $http.post('/Admin/User/Deactive', data).then(callback);
        },
        active: function (data, callback) {
            $http.post('/Admin/User/Active', data).then(callback);
        },
        checkUser: function (data, callback) {
            $http.get('/Admin/User/checkUser?userName=' + data).then(callback);
        },
        submitUpload: function (data, callback) {
            submitFormUpload('/Admin/User/UploadUser', data, callback);
        },
        submitInsertUser: function (data, callback) {
            $http.post('/Admin/User/InsertUsers', data).then(callback);
        },
        getAllApplication: function (callback) {
            $http.post('/Admin/PermissionResource/GetApplication/').then(callback);
        },
        getAllBranch: function (data, callback) {
            $http.post('/Admin/PermissionResource/GetAllBranch', data).then(callback);
        },
        getDepartmentByApp: function (data, callback) {
            $http.post('/Admin/User/GetDepartmentByApp', data).then(callback);
        },
        getResourceOfGroup: function (data, callback) {
            $http.post('/Admin/User/GetResourceOfGroup', data).then(callback);
        },
        updatePermission: function (data, callback) {
            $http.post('/Admin/User/UpdateUserPermission', data).then(callback);
        },
        getArea: function (callback) {
            $http.post('/Admin/User/GetArea/').then(callback);
        },
        getGroupUser: function (callback) {
            $http.post('/Admin/User/GetGroupUser/').then(callback);
        },
        getListEmployeeCode: function (data, callback) {
            $http.get('/Admin/User/GetListEmployeeCode?id=' + data).then(callback);
        },
        getListRoleCombination: function (callback) {
            $http.post('/Admin/User/GetListRoleCombination/').then(callback);
        },
        deleteUserGroupRole: function (data, callback) {
            $http.post('/Admin/User/DeleteUserGroupRole?id=' + data).then(callback);
        },
        insertUserGroupRole: function (data, callback) {
            $http.post('/Admin/User/InsertUserGroupRole', data).then(callback);
        },
        insertUserDepartmentRole: function (data, callback) {
            $http.post('/Admin/User/InsertUserDepartmentRole', data).then(callback);
        },
        deleteUserDepartmentRole: function (data, callback) {
            $http.post('/Admin/User/DeleteUserDepartmentRole?id=' + data).then(callback);
        },
        getHrEmployee: function (callback) {
            $http.get('/Admin/User/GetHrEmployee/').then(callback);
        },
        getBranch: function (callback) {
            $http.post('/Admin/Project/GetBranch').then(callback);
        },
        getDepartmentInBranch: function (data, callback) {
            $http.get('/Admin/User/GetDepartmentInBranch?branch=' + data).then(callback);
        },
        getShift: function (callback) {
            $http.post('/Admin/User/GetShift').then(callback);
        },
        // TFA BackEnd
        getTfaSetup: function (data, callback) {
            $http.get('/MobileTfa/GetTfaSetup?userName=' + data).then(callback);
        },
        postTfaSetup: function (data, callback) {
            $http.post('/MobileTfa/PostTfaSetup', data).then(callback);
        },
        disableTfaSetup: function (data, callback) {
            $http.delete('/MobileTfa/DeleteTfaSetup?userName=' + data).then(callback);
        },
        getQrCodeFromString: function (data, callback) {
            $http.post('/Admin/ProductImport/GeneratorQRCode?code=' + data).then(callback);
        },
    }
});

app.factory('httpResponseInterceptor', ['$q', '$rootScope', '$location', function ($q, $rootScope, $location) {
    return {
        responseError: function (rejection) {
            if (rejection.status === 401) {
                var url = "/Home/Logout";
                location.href = url;
            }
            return $q.reject(rejection);
        }
    };
}]);

app.controller('Ctrl_ESEIM', function ($scope, $rootScope, $compile, $uibModal, $cookies, $translate, dataservice) {
    $rootScope.go = function (path) {
        $location.path(path); return false;
    };

    var culture = $cookies.get('_CULTURE') || 'vi-VN';
    $translate.use(culture);
    $rootScope.IsTranslate = false;

    $rootScope.$on('$translateChangeSuccess', function () {
        $rootScope.IsTranslate = true;
        caption = caption[culture];
        $rootScope.validationOptions = {
            rules: {
                UserName: {
                    required: true,
                    maxlength: 255,
                    regx: /^[a-zA-Z0-9]+[^êĂăĐđĨĩŨũƠơƯưẠ-ỹ!@#$%^&*<>?\s]*$/,
                },
                GivenName: {
                    required: true,
                    maxlength: 255
                },
                Email: {
                    //required: true,
                    //maxlength: 255,
                    regx: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
                },
                Note: {
                    maxlength: 2000
                },
                Reason: {
                    maxlength: 2000
                },
                Password: {
                    required: true,
                    maxlength: 50
                },
                PhoneNumber: {
                    //required: true,
                    regx: /^(0)+([0-9]{9,10})\b$/
                },
                //EmployeeCode: {
                //    required: true,
                //    maxlength: 50
                //},
                BranchId: {
                    required: true
                },
                DepartmentId: {
                    required: true
                }
                //ProfitCenterId: {
                //    required: true
                //},
                //AccountExecutiveId: {
                //    required: true
                //}
            },
            messages: {
                UserName: {
                    required: caption.COM_ERR_REQUIRED.replace('{0}', caption.ADM_USER_CURD_LBL_ACCOUNT_NAME),
                    maxlength: caption.COM_ERR_EXCEED_CHARACTERS.replace('{0}', caption.ADM_USER_CURD_LBL_ACCOUNT_NAME).replace('{1}', '255'),
                    regx: caption.ADM_USER_VALIDATE_USERNAME
                },
                GivenName: {
                    required: caption.COM_ERR_REQUIRED.replace('{0}', caption.ADM_USER_CURD_LBL_NAME),
                    maxlength: caption.COM_ERR_EXCEED_CHARACTERS.replace('{0}', caption.ADM_USER_CURD_LBL_NAME).replace('{1}', '255')
                },
                Email: {
                    regx: caption.ADM_USER_VALIDATE_EMAIL
                    //required: caption.COM_ERR_REQUIRED.replace('{0}', caption.ADM_USER_CURD_LBL_EMAIL),
                    //maxlength: caption.COM_ERR_EXCEED_CHARACTERS.replace('{0}', caption.ADM_USER_CURD_LBL_EMAIL).replace('{1}', '255')
                },
                Note: {
                    maxlength: caption.COM_ERR_EXCEED_CHARACTERS.replace('{0}', caption.ADM_USER_CURD_LBL_NOTE).replace('{1}', '2000')
                },
                Reason: {
                    maxlength: caption.COM_ERR_EXCEED_CHARACTERS.replace('{0}', caption.ADM_USER_CURD_LBL_REASON).replace('{1}', '2000')
                },
                Password: {
                    required: caption.COM_ERR_REQUIRED.replace('{0}', caption.ADM_USER_CURD_LBL_PASSWORD),
                    maxlength: caption.COM_ERR_EXCEED_CHARACTERS.replace('{0}', caption.ADM_USER_CURD_LBL_PASSWORD).replace('{1}', '50')
                },
                //OfficeNumber: {
                //    required: caption.COM_ERR_REQUIRED.replace('{0}', caption.PHONE_NUMBER),
                //    maxlength: caption.COM_ERR_EXCEED_CHARACTERS.replace('{0}', caption.PHONE_NUMBER).replace('{1}', '10')
                //},
                //EmployeeCode: {
                //    required: caption.COM_ERR_REQUIRED.replace('{0}', caption.ADM_USER_CURD_LBL_EMPLOYEES_CODE),
                //    maxlength: caption.COM_ERR_EXCEED_CHARACTERS.replace('{0}', caption.ADM_USER_CURD_LBL_EMPLOYEES_CODE).replace('{1}', '50')
                //},
                BranchId: {
                    required: caption.COM_ERR_REQUIRED.replace('{0}', caption.ADM_USER_CURD_LBL_BRANCH)
                },
                DepartmentId: {
                    required: caption.COM_ERR_REQUIRED.replace('{0}', caption.ADM_USER_CURD_LBL_DEPARTMENT)
                },
                PhoneNumber: {
                    //required: caption.COM_ERR_REQUIRED.replace('{0}', caption.ADM_USER_CURD_LBL_PHONE)
                    regx: caption.ADM_USER_CURD_MSG_ERR_PHONE
                },
            }
        }
        $rootScope.StatusData = [
            { Value: null, Name: 'Tất cả' },
            {
                Value: true,
                Name: "Hoạt động"
            }, {
                Value: false,
                Name: "Không hoạt động"
            }];
        $rootScope.TypeStaffData = [{
            Code: 0,
            Name: "Nhân viên thị trường"
        }, {
            Code: 10,
            Name: "Cán bộ duyệt"
        }, {
            Code: 5,
            Name: "NPP/ĐLý/Cửa hàng"
        }];

        $rootScope.checkData = function (data) {
            var partternCode = /^[a-zA-Z0-9_äöüÄÖÜ]*$/;
            var partternName = /^[ĂăĐđĨĩŨũƠơƯưẠ-ỹa-zA-Z0-9]+[^!@#$%^&*<>?]*$/; //Có chứa được khoảng trắng
            var partternDescription = /^[ĂăĐđĨĩŨũƠơƯưẠ-ỹa-zA-Z0-9]*[^Đđ!@#$%^&*<>?]*$/; //Có thể null, và có chứa được khoảng trắng
            //var partternPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}/;
            var partternPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;
            var partternEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var mess = { Status: false, Title: "" }
            if (data.EmployeeCode != null && data.EmployeeCode != '' && !partternCode.test(data.EmployeeCode)) {
                mess.Status = true;
                mess.Title = mess.Title.concat(" - ", caption.VALIDATE_ITEM_CODE.replace('{0}', caption.EMPLOYEE_CODE), "<br/>");
            }
            if (!partternName.test(data.FullName)) {
                mess.Status = true;
                mess.Title += " - " + caption.VALIDATE_ITEM_NAME.replace('{0}', caption.USER_FULLNAME) + "<br/>";
            }
            if (!partternDescription.test(data.Note)) {
                mess.Status = true;
                mess.Title += " - " + caption.VALIDATE_ITEM.replace('{0}', caption.NOTE) + "<br/>";
            }
            if (data.Password != undefined && data.Password != "" && data.Password.length < 6) {
                mess.Status = true;
                mess.Title += "Mật khẩu phải có ít nhất 6 ký tự" + "<br/>";
            }
            if (data.Email != '' && data.Email != null && !partternEmail.test(data.Email)) {
                mess.Status = true;
                mess.Title += caption.ADM_USER_VALIDATE_EMAIL + "<br/>";
            }
            return mess;
        }
    });

    $rootScope.typeWork = [{
        Code: 'P',
        Name: 'PartTime'
    }, {
        Code: 'F',
        Name: 'FullTime'
    }]
    $rootScope.UserId = '';
    $rootScope.isAllData = isAllData;
    $rootScope.UserId = userId;
});

app.config(function ($routeProvider, $validatorProvider, $translateProvider, $httpProvider) {
    $translateProvider.useUrlLoader('/Admin/AccountLogin/Translation');
    caption = $translateProvider.translations();

    $routeProvider
        .when('/', {
            templateUrl: ctxfolder + '/infoAccount.html',
            controller: 'infoAccount'
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
    $httpProvider.interceptors.push('httpResponseInterceptor');
});

app.controller('infoAccount', function ($scope, $rootScope, $timeout, $compile, $uibModal, $confirm, dataservice) {
    $scope.TempSub = {
        IdI: [],
        IdS: [],
    };
    $scope.TempSubTemp = {
        IdI: [],
        IdS: [],
    };
    $scope.model = {
        TempSub: {
            IdI: [],
            IdS: [],
        },
        OrgId: 0,
        VIBUserInGroups: [],
        AspNetUserRoles: [],
        Organizations: 0,
        Password: '',
    };
    $scope.liBranch = [];
    $scope.initData = function () {
        dataservice.getItem(function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                $scope.model = rs;
                $rootScope.UserId = $scope.model.Id;
                $rootScope.UserName = $scope.model.UserName;
                $scope.model.ApplicationCode = 'ADMIN';
                $scope.model.Password = '';
                $scope.model.Area = $scope.model.Area != '' && $scope.model.Area != null ? $scope.model.Area.split(';') : [];
                //$scope.model.GroupUserCode = $scope.model.GroupUserCode != null ? $scope.model.GroupUserCode : [];
                $scope.model.TempSub = {
                    IdI: [],
                    IdS: [],
                };
                dataservice.getListRoleCombination(function (rs) {
                    rs = rs.data;
                    var listRoleCombination = $scope.model.RoleCombination != null ? JSON.parse($scope.model.RoleCombination) : [];
                    for (var i = 0; i < rs.length; i++) {
                        for (var j = 0; j < listRoleCombination.length; j++) {
                            if (rs[i].Code == listRoleCombination[j].Code) {
                                rs[i].Check = true;
                                break;
                            }
                        }
                    }
                    $scope.entities = rs;
                })
                dataservice.loadRole(function (rs1) {
                    rs1 = rs1.data;
                    if (rs1.Error) { }
                    else {
                        $scope.listRoles = rs1;
                    }
                });
                dataservice.loadDepartment(function (rs1) {
                    rs1 = rs1.data;
                    if (rs1.Error) {
                        //App.toastrError(rs1.Title);
                    }
                    else {
                        $scope.liDepartment = rs1;
                    }
                });
                dataservice.loadBranch(function (rs1) {
                    rs1 = rs1.data;
                    if (rs1.Error) { }
                    else {
                        $scope.liBranch = rs1;
                        var allBranch = {
                            OrgCode: "ALL",
                            OrgName: "Tất cả",
                            OrgAddonCode: "b_ALL"
                        }
                        $scope.liBranch.push(allBranch);
                    }
                });
                dataservice.getListGroupRole($scope.model.Id, function (rs1) {
                    rs1 = rs1.data;
                    if (rs1.Error) { }
                    else {
                        $scope.listGroupRole = rs1;
                    }
                });
                dataservice.getAllApplication(function (rs1) {
                    rs1 = rs1.data;
                    if (rs1.Error) { }
                    else {
                        $scope.listApplication = rs1;
                    }
                });
                dataservice.getArea(function (rs) {
                    rs = rs.data;
                    $scope.listArea = rs;
                });
                dataservice.getGroupUser(function (rs) {
                    rs = rs.data;
                    $scope.listGroupUser = rs;
                });
                $scope.model.EmployeeCode = $scope.model.EmployeeCode == null ? '' : $scope.model.EmployeeCode;
                dataservice.getShift(function (rs) {
                    rs = rs.data;
                    var shifts = $scope.model.ShiftList != null ? JSON.parse($scope.model.ShiftList) : [];
                    for (var i = 0; i < rs.length; i++) {
                        for (var j = 0; j < shifts.length; j++) {
                            if (rs[i].Code == shifts[j].Code) {
                                rs[i].IsChecked = true;
                            }
                        }
                    }

                    $scope.lstShift = rs;
                })

            }
        });
        dataservice.getHrEmployee(function (rs) {
            rs = rs.data;
            if (rs.Error) { }
            else {
                $scope.listEmployeeCode = rs.Object;
            }
        });
    }
    $scope.initData();

    $scope.submit = function () {

        $scope.model.ApplicationCode = 'ADMIN';
        if ($scope.editform.validate() && !validationSelect($scope.model).Status) {
            var temp = $rootScope.checkData($scope.model);
            if (temp.Status) {
                App.toastrError(temp.Title);
                return;
            }
            var file = document.getElementById("File").files[0]
            if (file != undefined) {
                var idxDot = file.name.lastIndexOf(".") + 1;
                var extFile = file.name.substr(idxDot, file.name.length).toLowerCase();
                if (extFile != "jpg" && extFile != "jpeg" && extFile != "png" && extFile != "gif" && extFile != "bmp") {
                    App.toastrError(caption.ADM_USER_VALIDATE_ITEM_IMAGE);
                    return;
                }
            }

            var fileSign = document.getElementById("FileSign").files[0]
            if (fileSign != undefined) {
                var idxDot = fileSign.name.lastIndexOf(".") + 1;
                var extFile = fileSign.name.substr(idxDot, fileSign.name.length).toLowerCase();
                if (extFile != "jpg" && extFile != "jpeg" && extFile != "png" && extFile != "gif" && extFile != "bmp") {
                    App.toastrError(caption.ADM_USER_VALIDATE_ITEM_IMAGE);
                    return;
                }
            }

            var formData = new FormData();
            formData.append("image", file != undefined ? file : null);
            formData.append("imageSign", fileSign != undefined ? fileSign : null);
            formData.append("Id", $scope.model.Id);
            formData.append("UserName", $scope.model.UserName);
            formData.append("Password", $scope.model.Password);
            formData.append("GivenName", $scope.model.GivenName);
            formData.append("Email", $scope.model.Email == null ? '' : $scope.model.Email);
            formData.append("PhoneNumber", $scope.model.PhoneNumber == null ? '' : $scope.model.PhoneNumber);
            formData.append("BranchId", $scope.model.BranchId == null ? '' : $scope.model.BranchId);
            formData.append("DepartmentId", $scope.model.DepartmentId == null ? '' : $scope.model.DepartmentId);
            formData.append("RoleId", $scope.model.RoleId == null ? '' : $scope.model.RoleId);
            formData.append("ApplicationCode", $scope.model.ApplicationCode == null ? '' : $scope.model.ApplicationCode);
            formData.append("EmployeeCode", $scope.model.EmployeeCode == null ? '' : $scope.model.EmployeeCode);
            formData.append("UserType", $scope.model.UserType);
            formData.append("Active", $scope.model.Active);
            formData.append("Note", $scope.model.Note == null ? '' : $scope.model.Note);
            formData.append("TypeStaff", $scope.model.TypeStaff == null ? '' : $scope.model.TypeStaff);
            formData.append("Reason", $scope.model.Reason);
            formData.append("Area", $scope.model.Area.length != 0 ? $scope.model.Area.join(';') : '');
            //formData.append("GroupUserCode", $scope.model.GroupUserCode.length != 0 ? $scope.model.GroupUserCode.join(';') : '');
            var roleCombination = [];
            for (var i = 0; i < $scope.entities.length; i++) {
                if ($scope.entities[i].Check) {
                    var obj = {
                        Code: $scope.entities[i].Code
                    }
                    roleCombination.push(obj);
                }
            }
            formData.append("RoleCombination", JSON.stringify(roleCombination));
            $scope.ShiftList = [];
            for (var i = 0; i < $scope.lstShift.length; i++) {
                if ($scope.lstShift[i].IsChecked) {
                    var obj = {
                        Code: $scope.lstShift[i].Code
                    }
                    $scope.ShiftList.push(obj);
                }
            }
            formData.append("ShiftList", JSON.stringify($scope.ShiftList))
            dataservice.update(formData, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                }
            });
        }
    }
    $scope.changleSelect = function (SelectType) {
        if (SelectType == "Branch" && $scope.model.BranchId != "") {
            $scope.errorBranch = false;
        }
        //if (SelectType == "Department" && $scope.model.DepartmentId != "") {
        //    $scope.errorDepartment = false;
        //}
        if (SelectType == "ApplicationCode" && $scope.model.ApplicationCode != "") {
            $scope.errorApplicationCode = false;
        }
        if (SelectType == "RoleId" && $scope.model.RoleId != "") {
            $scope.errorRoleId = false;
        }
        if ($scope.model.PhoneNumber != "") {
            if (SelectType == "PhoneNumber" && $rootScope.partternPhone.test($scope.model.PhoneNumber)) {
                $scope.errorPhoneNumber = false;
            }
        } else {
            $scope.errorPhoneNumber = false;
        }
        if (SelectType == "Area") {
            if ($scope.model.Area.length > 0) {
                $scope.errorArea = false;
            } else {
                $scope.errorArea = true;
            }
        }
        //if (SelectType == "GroupUserCode") {
        //    if ($scope.model.GroupUserCode.length > 0) {
        //        $scope.errorGroupUserCode = false;
        //    } else {
        //        $scope.errorGroupUserCode = true;
        //    }
        //}
    }
    $scope.selectTypeStaff = function (type) {
        $scope.errorBranch = false;
        $scope.errorDepartment = false;
        $scope.errorRoleId = false;
        $scope.errorApplicationCode = false;
    }
    $scope.selectEmployeeCode = function (item) {

        if (item != null) {
            $scope.model.GivenName = item.Name;
            $scope.model.Email = item.Email;
            $scope.model.PhoneNumber = item.PhoneNumber;
            $scope.model.DepartmentId = item.DepartmentId;
            $scope.model.RoleId = item.RoleId;
        }
        else {
            $scope.model.GivenName = '';
            $scope.model.Email = '';
            $scope.model.PhoneNumber = '';
            $scope.model.DepartmentId = '';
            $scope.model.RoleId = '';
        }
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
                App.toastrError(caption.COM_MSG_INVALID_FORMAT);
                return;
            }
            reader.readAsDataURL(files[0]);
        });
        fileuploader.trigger('click')
    }
    $scope.loadImageSign = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + "/Signature.html",
            controller: "signature",
            size: "50",
            backdrop: "static",
          });
          modalInstance.result.then(
            function (imageData) {
                var base64String = imageData.replace("data:image/png;base64,", "");
                const imageDataModel = {
                    Base64Data: base64String, // Dữ liệu base64 của hình ảnh
                    Id:  $scope.model.Id // Id của người dùng
                };
              dataservice.UploadImageAsync(imageDataModel,function(){
                document.getElementById("imageIdSign").src = imageData
              });
            },
            function () {}
          );

    }
    //Validate UiSelect
    function validationSelect(data) {

        var mess = { Status: false, Title: "" }
        if ($scope.model.TypeStaff === "" || $scope.model.TypeStaff === null || $scope.model.TypeStaff === 10) {
            //Check null Branch
            if (data.BranchId == "" || data.BranchId == null) {
                $scope.errorBranch = true;
                mess.Status = true;
            } else {
                $scope.errorBranch = false;
            }
            //Check null Department
            if (data.DepartmentId == "" || data.DepartmentId == null) {
                $scope.errorDepartment = true;
                mess.Status = true;
            } else {
                $scope.errorDepartment = false;
            }
            //Check null Application
            if (data.ApplicationCode == "" || data.ApplicationCode == null) {
                $scope.errorApplicationCode = true;
                mess.Status = true;
            } else {
                $scope.errorApplicationCode = false;
            }
            //Check null role
            if (data.RoleId == "" || data.RoleId == null) {
                $scope.errorRoleId = true;
                mess.Status = true;
            } else {
                $scope.errorRoleId = false;
            }
        } else {
            $scope.errorBranch = false;
            $scope.errorDepartment = false;
            $scope.errorRoleId = false;
            $scope.errorApplicationCode = false;
        }
        //if (data.PhoneNumber && !$rootScope.partternPhone.test(data.PhoneNumber)) {
        //    $scope.errorPhoneNumber = true;
        //    mess.Status = true;
        //} else {
        //    $scope.errorPhoneNumber = false;
        //}
        return mess;
    };
    function showPassWord() {
        $(".toggle-password").click(function () {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $($(this).attr("toggle"));
            if (input.attr("type") == "password") {
                input.attr("type", "text");
            } else {
                input.attr("type", "password");
            }
        });
    }

    $scope.log = {};
    $scope.system = {};
    var vmLog = $scope.log;
    $scope.system = {
        DepartmentCode: '',
        GroupUserCode: '',
        UserName: '',
        FromDate: '',
        ToDate: ''
    };

    $timeout(function () {
        showPassWord();
        setModalDraggable('.modal-dialog');
    }, 100);
});

app.controller('groupUser', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, $filter, $translate) {
    var vm = $scope;
    $scope.modelGroupUser = {
        UserId: $rootScope.UserId
    }
    $scope.initLoad = function () {
        dataservice.getGroupUser(function (rs) {
            rs = rs.data;
            $scope.groupUserList = rs;
        })
        dataservice.loadRole(function (rs) {
            rs = rs.data;
            $scope.roleList = rs;
        })
        dataservice.loadBranch(function (rs) {
            rs = rs.data;
            if (rs.Error) { }
            else {
                $scope.lstBranch = rs;
            }
        });
    }
    $scope.initLoad();
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/User/JtableUserGroupRole",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.UserId = $scope.modelGroupUser.UserId;
            },
            complete: function () {
                App.unblockUI("#contentMain");
                heightTableManual(200, "#tblDataGroupUser");
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(10)
        .withOption('order', [1, 'asc'])
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
    //Tạo các cột của bảng để đổ dữ liệu vào
    vm.dtColumns = [];
    //vm.dtcolumns.push(dtcolumnbuilder.newcolumn("check").withtitle(titlehtml).notsortable().renderwith(function (data, type, full, meta) {
    //    $scope.selected[full.id] = false;
    //    return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.id + ']" ng-click="toggleone(selected)"/><span></span></label>';
    //}).withoption('sclass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn("ID").withTitle(titleHtml).notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full.ID] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.ID + ']" ng-click="toggleOne(selected)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Branch').withTitle($translate('ADM_USER_CURD_LBL_BRANCH')).renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('GroupTitle').withTitle($translate('ADM_USER_LIST_COL_GROUP_USER')).renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('UserName').withTitle($translate('ADM_USER_LIST_COL_USERNAME')).renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('RoleTitle').withTitle($translate('ADM_USER_LIST_COL_ROLE_USER')).renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').withTitle($translate('ADM_USER_LIST_COL_ACTION')).renderWith(function (data, type, full) {
        return '<button title="{{&quot; COM_BTN_DELETE &quot; | translate}}" ng-click="delete(' + full.ID + ')" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline red"><i class="fa fa-trash"></i></button>';
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
    $rootScope.reloadTabTicket = function () {
        reloadData(true);
    }
    $scope.addUserGroupRole = function () {
        if ($rootScope.isAllData != 'True') {
            return App.toastrError(caption.COM_MSG_PERMISSION_ADD);
        }
        validationSelect($scope.modelGroupUser);
        if (!validationSelect($scope.modelGroupUser).Status) {
            dataservice.insertUserGroupRole($scope.modelGroupUser, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    $scope.reload();
                    $rootScope.reloadNoResetPage();
                }
            });
        }
    }
    $scope.delete = function (id) {
        if ($rootScope.isAllData != 'True') {
            return App.toastrError(caption.COM_MSG_PERMISSION_DELETE);
        }
        dataservice.deleteUserGroupRole(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                $scope.reload();
                $rootScope.reloadNoResetPage();
            }
        })
    }
    $scope.changeSelect = function (selectType) {
        if (selectType == "GroupUserCode" && $scope.modelGroupUser.GroupUserCode != "") {
            $scope.errorGroupUserCode = false;
        }
        if (selectType == "RoleId" && $scope.modelGroupUser.RoleId != "") {
            $scope.errorRoleId = false;
        }
        if (selectType == "Branch" && $scope.modelGroupUser.Branch != "") {
            $scope.errorBranchExtGrp = false;
        }
    }
    function validationSelect(data) {

        var mess = { Status: false, Title: "" }
        //Check null Branch
        if (data.GroupUserCode == "" || data.GroupUserCode == null) {
            $scope.errorGroupUserCode = true;
            mess.Status = true;
        } else {
            $scope.errorGroupUserCode = false;
        }
        //Check null Department
        if (data.RoleId == "" || data.RoleId == null) {
            $scope.errorRoleId = true;
            mess.Status = true;
        } else {
            $scope.errorRoleId = false;
        }

        if (data.Branch == "" || data.Branch == null) {
            $scope.errorBranchExtGrp = true;
            mess.Status = true;
        } else {
            $scope.errorBranchExtGrp = false;
        }
        return mess;
    };
});

app.controller('userDepartment', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, $filter, $translate) {
    var vm = $scope;
    $scope.modelDepartmentUser = {
        UserId: $rootScope.UserId
    }
    $scope.initLoad = function () {
        dataservice.loadDepartment(function (rs) {
            rs = rs.data;
            $scope.departmentList = rs;
        });
        dataservice.loadRole(function (rs) {
            rs = rs.data;
            $scope.roleList = rs;
        });
        dataservice.loadBranch(function (rs) {
            rs = rs.data;
            if (rs.Error) { }
            else {
                $scope.lstBranch = rs;
            }
        });
    }
    $scope.initLoad();
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/User/JtableUserDepartmentRole",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.UserId = $rootScope.UserId;
            },
            complete: function () {
                App.unblockUI("#contentMain");
                heightTableManual(200, "#tblDataDepartment");
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(10)
        .withOption('order', [1, 'asc'])
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
    //Tạo các cột của bảng để đổ dữ liệu vào
    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("ID").withTitle(titleHtml).notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full.ID] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.ID + ']" ng-click="toggleOne(selected)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Branch').withTitle($translate('ADM_USER_CURD_LBL_BRANCH')).renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('DepartmentTitle').withTitle($translate('ADM_USER_CURD_TAP_DEPARTMENT')).renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('UserName').withTitle($translate('ADM_USER_LIST_COL_USERNAME')).renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('RoleTitle').withTitle($translate('ADM_USER_LIST_COL_ROLE')).renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').withTitle($translate('ADM_USER_LIST_COL_ACTION')).renderWith(function (data, type, full) {
        return '<button title="{{&quot; COM_BTN_DELETE &quot; | translate}}" ng-click="delete(' + full.ID + ')" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline red"><i class="fa fa-trash"></i></button>';
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
    $rootScope.reloadTabTicket = function () {
        reloadData(true);
    }
    $scope.addUserDepartRole = function () {
        if ($rootScope.isAllData != 'True') {
            return App.toastrError(caption.COM_MSG_PERMISSION_ADD);
        }
        validationSelect($scope.modelDepartmentUser);
        if (!validationSelect($scope.modelDepartmentUser).Status) {
            dataservice.insertUserDepartmentRole($scope.modelDepartmentUser, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    $scope.reload();
                    $rootScope.reloadNoResetPage();
                }
            });
        }
    }
    $scope.delete = function (id) {
        if ($rootScope.isAllData != 'True') {
            return App.toastrError(caption.COM_MSG_PERMISSION_DELETE);
        }
        dataservice.deleteUserDepartmentRole(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                $scope.reload();
                $rootScope.reloadNoResetPage();
            }
        })
    }
    $scope.changleSelect = function (selectType) {
        if (selectType == "DepartmentCode" && $scope.modelDepartmentUser.DepartmentCode != "") {
            $scope.errorDepartmentCode = false;
        }
        if (selectType == "RoleId" && $scope.modelDepartmentUser.RoleId != "") {
            $scope.errorRoleId = false;
        }
        if (selectType == "Branch" && $scope.modelDepartmentUser.Branch != "") {
            $scope.errorBranchExt = false;
            dataservice.getDepartmentInBranch($scope.modelDepartmentUser.Branch, function (rs) {
                rs = rs.data;
                $scope.departmentList = rs;
                $scope.modelDepartmentUser.DepartmentCode = "";
            })
        }
    }
    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        //Check null Branch
        if (data.DepartmentCode == "" || data.DepartmentCode == null) {
            $scope.errorDepartmentCode = true;
            mess.Status = true;
        } else {
            $scope.errorDepartmentCode = false;
        }
        //Check null Department
        if ($scope.modelDepartmentUser.RoleId == "" || $scope.modelDepartmentUser.RoleId == null) {
            $scope.errorRoleId = true;
            mess.Status = true;
        } else {
            $scope.errorRoleId = false;
        }

        if ($scope.modelDepartmentUser.Branch == "" || $scope.modelDepartmentUser.Branch == null) {
            $scope.errorBranchExt = true;
            mess.Status = true;
        } else {
            $scope.errorBranchExt = false;
        }
        return mess;
    };
});

app.controller('tfaSetup', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, $filter, $translate) {
    $scope.model = {
        UserName: window.userName,
        Code: ''
    }
    $scope.tfaEnabled = false;
    $scope.showError = false;
    $scope.errorMessage = '';
    $scope.qrInfo = '';
    $scope.imageBase64 = '';
    $scope.authenticatorKey = '';
    console.log($scope.model);
    $scope.init = function () {
        const userName = window.userName;
        dataservice.getTfaSetup(userName, function (rs) {
            rs = rs.data;
            $scope.tfaEnabled = rs.IsTfaEnabled ?? false;
            $scope.qrInfo = rs.FormattedKey ?? '';
            $scope.authenticatorKey = rs.AuthenticatorKey ?? '';
            console.log($scope.qrInfo);
            //this.isLoading = false;
            dataservice.getQrCodeFromString($scope.qrInfo, function (rs) {
                if (rs) {
                    rs = rs.data;
                    if (rs == null || rs == "")
                        $scope.imageBase64 = "";
                    else
                        $scope.imageBase64 = rs;
                    console.log($scope.imageBase64);
                }
            });
        });
    }
    $scope.init();
    $scope.disableTfa = function () {
        const userName = window.userName;
        dataservice.disableTfaSetup(userName, function (rs) {
            $scope.tfaEnabled = false;
            App.toastrSuccess("Bảo mật 2 lớp đã tắt");
        });
    }
    $scope.enableTfa = function () {
        const model = angular.copy($scope.model);
        dataservice.postTfaSetup(model, function (rs) {
            $scope.tfaEnabled = true;
            App.toastrSuccess('Bảo mật 2 lớp được kích hoạt');
        });
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
});

app.controller('signature', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, dataservice, $filter) {
    
    $scope.cancel = function () {
        //$uibModalInstance.dismiss('cancel');
        $uibModalInstance.close();
    }
    var signature;
    var toolbarObj;
    var saveBtn

    let items = [
        {
            text: "Png",
        },
        {
            text: "Jpeg",
        },
        {
            text: "Svg",
        },
    ];

    $scope.init=function(){
        saveBtn = document.getElementById("save");
        saveBtn.disabled = true;
        signature = new ej.inputs.Signature(
            {
                maxStrokeWidth: 2,
                change: function () {
                    updateSaveBtn();
                },
            },
            "#signature"
        );
    }

    function updateSaveBtn() {
        if (!signature.isEmpty()) {
            saveBtn.disabled = false;
        }
    }

    $scope.Save = function ()  {
        // Lấy thẻ canvas từ Syncfusion EJ2
        var canvas = signature.element;
        // Lấy dữ liệu hình ảnh từ canvas dưới dạng base64
        var imageData = canvas.toDataURL();
        // Đóng modal
        $uibModalInstance.close(imageData);
    };

    setTimeout(function() {
        $scope.init()
    }, 3000); // Chờ 3 giây (1000 milliseconds)
});