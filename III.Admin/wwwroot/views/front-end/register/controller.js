var ctxfolder = "/views/front-end/register";
var app = angular.module('App_ESEIM', [ "ngRoute", 'ui.select'])
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
        Register:function(data,callback){
            $http.post('/UserProfile/Register2',data).then(callback);
        },
        
        GetGroupUser: function (callback) {
            $http.get('/UserProfile/GetGroupUser').then(callback);
        },
    }
});

app.controller('Ctrl_ESEIM', function ($scope, $rootScope, $compile, dataservice) {
    
});

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: ctxfolder + '/index.html',
            controller: 'index'
        })
});

app.controller('index', function ($scope, $rootScope, $compile, dataservice, $filter) {
    $scope.model={
        UserName:'',
        GivenName:'',
        PhoneNumber:'',
        Gender: true,
        Email: '',
        Password:'',
        ConfrimPassword:'',
        RegisterJoinGroupCode:''
    }
    $scope.GroupUsers = []
    $scope.getGrupUsers = function () {
        dataservice.GetGroupUser(function (rs) {
            console.log(rs)
            $scope.GroupUsers = rs.data;
        })
    }
    $scope.getGrupUsers ()
    $scope.onItemSelect = function (item) {
        $scope.model.RegisterJoinGroupCode = item.Code;
    }
    $scope.Gender="Nam"
    $scope.Register=function(){
        var msg=ValidityState($scope.model)
        if(msg.Error){
            App.toastrError(msg.Title)
            return
        }
        $scope.model.Gender=$scope.Gender=="Nam"?true:false
        dataservice.Register($scope.model,function(rs){
            rs=rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title)
            } else {
                App.toastrSuccess(rs.Title)
            }
        })
    }
    function ValidityState(model){
        var msg={
            Error:false,
            Title:``
        }
        var Title=``;
        if(!/^\d{12}$/.test(model.UserName)){
            msg.Error=true;
            $scope.PasswordError=true;  
            Title+=`<p style="font-size:13px;">CCCD gồm 12 số</p></br>`
        }
        if(model.GivenName==''||model.GivenName==undefined||model.GivenName==null){
            msg.Error=true;
            $scope.GivenNameError=true;
            Title+=`<p style="font-size:13px;">Tên người dùng không được để trống</p></br>`
            
        }if(model.PhoneNumber==''||model.PhoneNumber==undefined||model.PhoneNumber==null){
            msg.Error=true;
            $scope.PhoneNumberError=true;
            Title+=`<p style="font-size:13px;">Số điện thoại không được để trống</p></br>`
            
        }if (!isValidEmail(model.Email)) {
            msg.Error=true;
            $scope.EmailError=true;
            
            Title+=`<p style="font-size:13px;">Email sai định dạng</p></br>`
        }if(model.Password==''||model.Password==undefined||model.Password==null){
            msg.Error=true;
            $scope.PasswordError=true;  
            Title+=`<p style="font-size:13px;">Mật khẩu không được để trống</p></br>`

        }if(model.Password.length < 8){
            msg.Error=true;
            $scope.PasswordError=true;  
            Title+=`<p style="font-size:13px;">Mật khẩu có ít nhất 8 ký tự</p></br>`

        }
        if(model.ConfrimPassword!=model.Password){            
            msg.Error=true;
            $scope.ConfrimPasswordError=true;
            
            Title+=`<p style="font-size:13px;">Xác nhận mật khẩu chưa trùng khớp</p></br>`
        }if(model.RegisterJoinGroupCode==''||model.RegisterJoinGroupCode==undefined||model.RegisterJoinGroupCode==null){
            msg.Error=true;
            $scope.RegisterJoinGroupCodeError=true;  
            Title+=`<p style="font-size:13px;">Mật khẩu không được để trống</p></br>`
        }
        msg.Title=Title
        return msg;
    }
    function isValidEmail(email) {
        // Biểu thức chính quy kiểm tra định dạng email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
});

