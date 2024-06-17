var ctxfolder = "/views/front-end/register";
var app = angular.module('App_ESEIM', ["ngRoute", 'ui.select', "ngValidate"])
app.factory('dataservice', function ($http) {
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
        Register: function (data, callback) {
            $http.post('/UserProfile/Register2', data).then(callback);
        },

        GetGroupUser: function (callback) {
            $http.get('/UserProfile/GetGroupUser').then(callback);
        },
    }
});

app.controller('Ctrl_ESEIM', function ($scope, $rootScope, $compile, dataservice) {

    $rootScope.validationOptions = {
        rules: {
            PhoneNumber: {
                required: true,
                phoneVN: true // Custom rule for Vietnamese phone numbers
            },
            Password: {
                required: true,
                minlength: 8 // Password must be at least 8 characters long
            },
            UserName: {
                required: true,
                idVN: true // Custom rule for Vietnamese ID numbers (CCCD)
            },
            ConfrimPassword: {
                required: true,
                equalTo: "#Password" // Check if it matches the Password field
            },
            GivenName: {
                required: true
            }
        },
        messages: {
            PhoneNumber: {
                required: 'Số điện thoại không được bỏ trống',
                phoneVN: 'Số điện thoại không hợp lệ', // Custom message for invalid phone number
                minlength: "Số điện thoại phải có ít nhất {0} ký tự"
            },
            Password: {
                required: "Mật khẩu không được bỏ trống",
                minlength: "Mật khẩu phải có ít nhất 8 ký tự" // Message for short passwords
            },
            UserName: {
                required: "Không được bỏ trống số CCCD",
                idVN: "Số CCCD không hợp lệ" // Custom message for invalid ID
            },
            ConfrimPassword: {
                required: "Không được bỏ trống xác nhận mật khẩu",
                equalTo: "Xác nhận mật khẩu không khớp với mật khẩu" // Message for mismatch
            },
            GivenName: {
                required: "Không được bỏ trống họ tên"
            }
        }
    };
});

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: ctxfolder + '/index.html',
            controller: 'index'
        })
    $.validator.addMethod("phoneVN", function (value, element) {
        return this.optional(element) || /^(0|\+84)[1-9][0-9]{8,9}$/.test(value);
    }, "Số điện thoại không hợp lệ");

    $.validator.addMethod("idVN", function (value, element) {
        return this.optional(element) || /^[0-9]{9,12}$/.test(value);
    }, "Số CCCD không hợp lệ");
});

app.controller('index', function ($scope, $rootScope, $compile, dataservice, $filter) {
    $scope.model = {
        UserName: '',
        GivenName: '',
        PhoneNumber: '',
        Gender: true,
        Email: '',
        Password: '',
        ConfrimPassword: '',
        RegisterJoinGroupCode: ''
    }
    $scope.GroupUsers = []
    $scope.getGrupUsers = function () {
        dataservice.GetGroupUser(function (rs) {
            console.log(rs)
            $scope.GroupUsers = rs.data;
        })
    }
    $scope.getGrupUsers()
    $scope.onItemSelect = function (item) {
        $scope.model.RegisterJoinGroupCode = item.Code;
    }
    $scope.Gender = "Nam"
    $scope.Register = function () {
        if ($scope.model.RegisterJoinGroupCode == NaN || $scope.model.RegisterJoinGroupCode == '') {
            $scope.errorGroupUser = true;
        }
        else {
            $scope.errorGroupUser = false;

        }
        if ($scope.validateForm.validate()) {

            var msg = ValidityState($scope.model)
            if (msg.Error) {
                App.toastrError(msg.Title)
                return
            }
            $scope.model.Gender = $scope.Gender == "Nam" ? true : false
            dataservice.Register($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title)
                } else {
                    App.toastrSuccess(rs.Title)
                    var loginUrl = "/UserProfile/Login";
                    var username = $scope.model.UserName; // Assuming this is the username entered during registration
                    var password = $scope.model.Password; // Assuming this is the password entered during registration

                    // Construct query string parameters for autofill
                    var queryParams = "?username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);

                    // Redirect to login page with autofill parameters
                    window.location.href = loginUrl + queryParams;
                }
            })
        }
    }
    function ValidityState(model) {
        var msg = {
            Error: false,
            Title: ``
        }
        var Title = ``;
        if (!/^\d{12}$/.test(model.UserName)) {
            msg.Error = true;
            $scope.PasswordError = true;
            Title += `<p style="font-size:13px;">CCCD gồm 12 số</p></br>`
        }
        if (model.GivenName == '' || model.GivenName == undefined || model.GivenName == null) {
            msg.Error = true;
            $scope.GivenNameError = true;
            Title += `<p style="font-size:13px;">Tên người dùng không được để trống</p></br>`

        } if (model.PhoneNumber == '' || model.PhoneNumber == undefined || model.PhoneNumber == null) {
            msg.Error = true;
            $scope.PhoneNumberError = true;
            Title += `<p style="font-size:13px;">Số điện thoại không được để trống</p></br>`

        }
        if (!/^[0|+|+84]+([\s0-9]{9,15})([\s#0-9]{5})?\b$/.test(model.PhoneNumber)) {
            msg.Error = true;
            $scope.PhoneNumberError = true;
            Title += `<p style="font-size:13px;">Số điện thoại sai định dạng</p></br>`
        }
        if (!(model.Email == '' || model.Email == undefined || model.Email == null)
            && !isValidEmail(model.Email)) {
            msg.Error = true;
            $scope.EmailError = true;

            Title += `<p style="font-size:13px;">Email sai định dạng</p></br>`
        }
        if (model.Password == '' || model.Password == undefined || model.Password == null) {
            msg.Error = true;
            $scope.PasswordError = true;
            Title += `<p style="font-size:13px;">Mật khẩu không được để trống</p></br>`

        } if (model.Password.length < 8) {
            msg.Error = true;
            $scope.PasswordError = true;
            Title += `<p style="font-size:13px;">Mật khẩu có ít nhất 8 ký tự</p></br>`

        }
        if (model.ConfrimPassword != model.Password) {
            msg.Error = true;
            $scope.ConfrimPasswordError = true;

            Title += `<p style="font-size:13px;">Xác nhận mật khẩu chưa trùng khớp</p></br>`
        } if (model.RegisterJoinGroupCode == '' || model.RegisterJoinGroupCode == undefined || model.RegisterJoinGroupCode == null) {
            msg.Error = true;
            $scope.RegisterJoinGroupCodeError = true;
            Title += `<p style="font-size:13px;">Nhóm chi bộ không được để trống</p></br>`
        }
        msg.Title = Title
        return msg;
    }
    function isValidEmail(email) {
        // Biểu thức chính quy kiểm tra định dạng email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
});

