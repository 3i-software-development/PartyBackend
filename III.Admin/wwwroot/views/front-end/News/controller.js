var ctxfolder = "/views/front-end/News";
var app = angular.module('App_ESEIM', ["ngRoute"])

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
        getNews: function (callback) {
            $http.get('/Admin/CMSVideo/GetNews').then(callback);
        },
        getCMSItems: function (data, callback) {
            $http.get('/Admin/CMSItem/GetListItemByCateId?catId=' + data).then(callback);
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

app.controller('index', function ($scope, $rootScope, $compile, dataservice, $filter, $http) {
    var listNew = document.getElementById("listTitle");
    console.log(listNew)
    var render = "";

    $scope.getNews = function () {
        dataservice.getNews(function (rs) {
            rs = rs.data;
            console.log(rs);
            for (var i = 0; i < rs.length; i++) {

                var arrayTitle = rs[i].field_value.split(',');
                var day = chuyenDoiNgayThang(rs[i].date_post);
                for (var j = 0; j < arrayTitle.length; j++) {
                    var splitTitle = arrayTitle[j].split(':');
                    console.log(splitTitle[1]);
                    var title = splitTitle[1].replace(/"/g, '');
                    render += `
                        <div class="my-3 px-5 pt-3 pb-2 w-50" style="background-color: #f5f5f5; border-radius: 10px;   ">
                            <p style="color: black"><a href="">${title}</a></p>
                            <p style="color: #8F969C;">Ngày ${day}</p>
                        </div>
                    `;
                    break;
                }
                listNew.innerHTML = render;
            }
        })
    }
    $scope.CmsItems = [];
    $scope.getCMSItems = function () {
        var catId = 1420;
        dataservice.getCMSItems(catId, function (rs) {
            //    console.log($scope.modelPersonal );
            rs = rs.data;
            $scope.CmsItems = rs;
            console.log(rs);
        })
    }
    $scope.getCMSItems();
})

function chuyenDoiNgayThang(chuoiNgay) {
    // Tạo một đối tượng Date từ chuỗi ngày tháng
    var ngayThang = new Date(chuoiNgay);

    // Lấy thông tin về ngày, tháng và năm
    var ngay = ngayThang.getDate();
    var thang = ngayThang.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
    var nam = ngayThang.getFullYear();

    // Định dạng lại chuỗi ngày tháng theo "dd-mm-yyyy"
    var ngayThangFormatted = `${ngay < 10 ? '0' : ''}${ngay}/${thang < 10 ? '0' : ''}${thang}/${nam}`;

    return ngayThangFormatted;
}
