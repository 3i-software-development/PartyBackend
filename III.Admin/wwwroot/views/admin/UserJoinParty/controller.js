var ctxfolderJoinParty = "/views/admin/UserJoinParty";
var ctxfolderMessage = "/views/message-box";

var app = angular.module('App_ESEIM_USER_JOIN_PARTY', ['App_ESEIM', "ui.bootstrap", "ngRoute", "ngValidate", "datatables", "datatables.bootstrap",
    'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', "ngJsTree", "treeGrid", "ui.select", "ngCookies", "pascalprecht.translate", 'dynamicNumber', 'ngFileUpload', 'FBAngular']);

app.factory('dataserviceJoinParty', function ($http) {
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
    return {
        UpdateOrCreateJson: function (data, callback) {
            $http.post('/admin/UserJoinParty/UpdateOrCreateJson?ResumeNumber=' + data.ResumeNumber, data.json).then(callback);
        },
        //địa chỉ 
        getProvince: function (callback) {
            $http.get('/UserProfile/GetProvince').then(callback);
        },
        getDistrictByProvinceId: function (data, callback) {
            $http.get('/UserProfile/GetDistrictByProvinceId?provinceId=' + data).then(callback);
        },
        getWardByDistrictId: function (data, callback) {
            $http.get('/UserProfile/GetWardByDistrictId?districtId=' + data).then(callback);
        },
        GetGroupUser: function (callback) {
            $http.get('/UserProfile/GetGroupUser').then(callback);
        },
        Import: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/Import?ressumeNumber=' + data).then(callback)
        },
        //WF
        getActivity: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetActivityInsGrid?wfCode=' + data).then(callback)
        },

        getItemFile: function (data, data1, data2, callback) {
            $http.get('/Admin/EDMSRepository/GetItemFile?id=' + data + '&&IsEdit=' + data1 + '&mode=' + data2).then(callback);
        },
        viewFileOnline: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/ViewFileOnline', data).then(callback);
        },
        //InsertFamily
        insertFamily: function (data, callback) {
            $http.post('/UserProfile/InsertFamily/', data).then(callback);
        },
        getFamilyByProfileCode: function (data, callback) {
            $http.post('/UserProfile/GetFamilyByProfileCode/', data).then(callback);
        },

        updateFamily: function (data, callback) {
            $http.post('/UserProfile/UpdateFamily/', data).then(callback);
        },
        //PartyAdmissionProfile

        getPersonalHistoryByResumeNumber: function (data, callback) {
            // console.log($http.get('/UserProfile/GetPersonalHistoryByProfileCode?profileCode=' + data))
            $http.post('/UserProfile/GetPersonalHistoryById?Id=' + data).then(callback);
        },
        GetPartyAdmissionProfileByResumeNumber: function (data, callback) {
            $http.get('/UserProfile/GetPartyAdmissionProfileByResumeNumber?resumeNumber=' + data).then(callback);
        },
        insert: function (data, callback) {
            $http.post('/UserProfile/InsertPartyAdmissionProfile/', data).then(callback);

        },
        update: function (data, callback) {
            $http.put('/UserProfile/UpdatePartyAdmissionProfile/', data).then(callback);

        },
        delete: function (data, callback) {
            $http.delete('/UserProfile/DeletePartyAdmissionProfile?Id=' + data).then(callback);
        },


        //BusinessNDuty
        getBusinessNDutyById: function (data, callback) {
            $http.post('/UserProfile/GetWorkingTrackingById?id=', data).then(callback);
        },
        insertBusinessNDuty: function (data, callback) {
            $http.post('/UserProfile/InsertWorkingTracking/', data).then(callback);
        },
        updateWorkingTracking: function (data, callback) {
            $http.post('/UserProfile/UpdateWorkingTracking/', data).then(callback);
        },
        deleteBusinessNDuty: function (data, callback) {
            $http.delete('/UserProfile/DeleteWorkingTracking/', data).then(callback);
        },

        //HistorySpecialist
        getHistorySpecialistById: function (data, callback) {
            $http.post('/UserProfile/GetHistorySpecialistById?id=', data).then(callback);
        },
        insertHistorySpecialist: function (data, callback) {
            $http.post('/UserProfile/InsertHistorysSpecialist/', data).then(callback);
        },
        updateHistorySpecialist: function (data, callback) {
            $http.post('/UserProfile/UpdateHistorySpecialist/', data).then(callback);
        },
        deleteHistorySpecialist: function (data, callback) {
            $http.delete('/UserProfile/DeleteHistorysSpecialist/', data).then(callback);
        },

        //award 
        getAwardById: function (data, callback) {
            $http.post('/UserProfile/GetAwardById?id=', data).then(callback);
        },
        getAwardByProfileCode: function (data, callback) {
            $http.post('/UserProfile/GetAwardByProfileCode?profileCode=', data).then(callback);
        },
        insertAwards: function (data, callback) {
            $http.post('/UserProfile/InsertAward/', data).then(callback);
        },
        updateAward: function (data, callback) {
            $http.post('/UserProfile/UpdateAward/', data).then(callback);
        },
        deleteAward: function (data, callback) {
            $http.delete('/UserProfile/DeleteAward/', data).then(callback);
        },

        //WarningDisciplined
        getWarningDisciplinedById: function (data, callback) {
            $http.post('/UserProfile/GetWarningDisciplinedById?id=', data).then(callback);
        },
        updateWarningDisciplined: function (data, callback) {
            $http.post('/UserProfile/UpdateWarningDisciplined/', data).then(callback);
        },
        deleteWarningDisciplined: function (data, callback) {
            $http.delete('/UserProfile/DeleteWarningDisciplined/', data).then(callback);
        },

        //TrainingCertificatedPass
        getTrainingCertificatedPassById: function (data, callback) {
            $http.post('/UserProfile/GetTrainingCertificatedPassById?id=', data).then(callback);
        },
        insertTrainingCertificatedPass: function (data, callback) {
            $http.post('/UserProfile/InsertTrainingCertificatedPass/', data).then(callback);
        },
        updateTrainingCertificatedPass: function (data, callback) {
            $http.post('/UserProfile/UpdateTrainingCertificatedPass/', data).then(callback);
        },
        deleteTrainingCertificatedPass: function (data, callback) {
            $http.delete('/UserProfile/DeleteTrainingCertificatedPass/', data).then(callback);
        },

        //Ngưới giới thiệu
        insertIntroducer: function (data, callback) {
            $http.post('/UserProfile/InsertIntroduceOfParty/', data).then(callback);
        },


        //lịch sử bản thân
        insertPersonalHistory: function (data, callback) {
            $http.post('/Admin/UserJoinParty/InsertPersonalHistory', data).then(callback);
        },
        insertPersonalHistorys: function (data, callback) {
            $http.post('/UserProfile/InsertPersonalHistory', data).then(callback);
        },
        updatePersonalHistory: function (data, callback) {
            $http.post('/Admin/UserJoinParty/UpdatePersonalHistory', data).then(callback);
        },
        getPersonalHistoryByProfileCode: function (data, callback) {
            $http.post('/UserProfile/GetPersonalHistoryByProfileCode?profileCode=', data).then(callback);
        },

        //WarningDisciplined
        insertWarningDisciplined: function (data, callback) {
            $http.post('/UserProfile/InsertWarningDisciplined/', data).then(callback);

        },

        //Đi du lịch

        insertGoAboards: function (data, callback) {
            $http.post('/UserProfile/InsertGoAboard/', data).then(callback);
        },

        insertGoAboard: function (data, callback) {
            $http.post('/UserProfile/InsertGoAboardOnly/', data).then(callback);
        },

        updateGoAboard: function (data, callback) {
            $http.post('/UserProfile/UpdateGoAboard/', data).then(callback);

        },

        //Khen hưởng
        insertAwardAndUpdate: function (data, callback) {
            $http.post('/Admin/UserJoinParty/InsertAwardOnly', data).then(callback);
        },


        getListFile: function (data, callback) {
            $http.get('/UserProfile/GetListProfile?ResumeNumber=' + data).then(callback);
        },
        deleteFile: function (fileName, ResumeNumber, callback) {
            $http.get('/UserProfile/DeleteFile?ResumeNumber=' + ResumeNumber + '&fileName=' + fileName).then(callback);
        },
        //Khởi tạo luồng hoạt động

        createWfInstance: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/CreateWfInstance', data).then(callback)
        },
        UpdateWfInstByResumeCode: function (WfInstCode, ResumeNumber, callback) {
            $http.get(`/UserProfile/UpdateWfInstByResumeCode?WfInstCode=${WfInstCode}&ResumeNumber=${ResumeNumber}`).then(callback)
        },
        DeleteWfInstance: function (WfInstCode, callback) {
            $http.get(`/Admin/WorkflowActivity/DeleteWfInstance?wfInstCode=${WfInstCode}`).then(callback)
        },
        GetActInstArranged: function (data, callback) {
            $http.post(`/Admin/WorkflowActivity/GetActInstArranged?objInst=${data}&objType=TEST_JOIN_PARTY`).then(callback)
        },
        GetLogStatusOfWFInst: function (data, callback) {
            $http.get(`/Admin/WorkflowActivity/GetLogStatusOfWFInst?wfCode=${data}`).then(callback)
        },

        UpdateOrCreateUserfileJson: function (data, callback) {
            $http.post('/Admin/UserJoinParty/UpdateOrCreateUserfileJson', data).then(callback);
        },
    }
});
app.controller("ConvertJson", function ($scope, $rootScope, dataserviceJoinParty) {
    $scope.listNote = []
    $scope.model = {
        comment: '',
        id: ''
    }
    //Hàm lấy file json gán vào listNote (nếu có)

    //Hàm submit gọi api
    $scope.submit = function () {


    }
});

app.controller('Ctrl_USER_JOIN_PARTY', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, dataserviceJoinParty, $cookies, $translate) {
    $rootScope.go = function (path) {
        $location.path(path); return false;
    };
    var culture = $cookies.get('_CULTURE') || 'vi-VN';
    $translate.use(culture);
    $rootScope.$on('$translateChangeSuccess', function () {
        caption = caption[culture];
        $.extend($.validator.messages, {
            min: caption.COM_VALIDATE_VALUE_MIN,
            //max: 'Max some message {0}'
        });
        $rootScope.checkData = function (data) {
            var partternCode = /^[a-zA-Z0-9]+[^Đđ!@#$%^&*<>?\s]*$/;
            var partternName = /^(^[ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z.0-9\s]+$)|^(^[0-9]+[ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z.\s][ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z.0-9\s]*$)/
            var mess = { Status: false, Title: "" }
            if (!partternCode.test(data.CatCode)) {
                mess.Status = true;
                mess.Title = mess.Title.CatCode(" - ", "{{'CEF_MSG_TITLE_ERR' | translate}}", "<br/>");
            }
            //if (!partternName.test(data.CatName)) {
            //    mess.Status = true;
            //    mess.Title += caption.COM_VALIDATE_ITEM_NAME.replace('{0}', caption.AA_CURD_LBL_AA_ACTTITLE) + "<br/>";
            //    //mess.Title += " - " + caption.VALIDATE_ITEM_NAME.replace('{0}', caption.USER_USERNAME) + "<br/>";
            //}
            return mess;
        }
        $rootScope.validationOptions = {
            rules: {
                Title: {
                    required: true,
                },
                InventoryCode: {
                    required: true,
                },
                AuditFrom: {
                    required: true,
                },
                AuditTo: {
                    required: true,
                },
                Auditors: {
                    required: true,
                },
                Status: {
                    required: true,
                },
            },
            messages: {
                Name: {
                    required: caption.AU_VALIDATE_NAME_INPUT,
                    //required: caption.CEF_VALIDATE_NAME,
                },
                Title: {
                    required: caption.AU_VALIDATE_TITLE_INPUT,
                },
                InventoryCode: {
                    required: caption.AU_VALIDATE_INVENTORY_INPUT,
                },
                AuditFrom: {
                    required: caption.AU_VALIDATE_TIME_INPUT,
                },
                AuditTo: {
                    required: caption.AU_VALIDATE_TIME_INPUT,
                },
                Auditors: {
                    required: caption.AU_VALIDATE_STAFF_INPUT,
                },
                Status: {
                    required: caption.AU_VALIDATE_STATUS_INPUT,
                },
            }
        }
        $rootScope.validation2Options = {
            rules: {
                Quantity: {
                    required: true,
                },
            },
            messages: {
                Quantity: {
                    required: "Số lượng không được bỏ trống ",
                },
            }
        }
        $rootScope.IsTranslate = true;
    });
});

app.config(function ($routeProvider, $validatorProvider, $translateProvider) {
    $translateProvider.useUrlLoader('/Admin/WorkflowActivity/Translation');
    //$translateProvider.preferredLanguage('en-US');
    caption = $translateProvider.translations();
    $routeProvider
        .when('/', {
            templateUrl: ctxfolderJoinParty + '/index.html',
            controller: 'index'
        })
        .when('/edit-user/:resumeNumber', {
            templateUrl: ctxfolderJoinParty + '/edit.html',
            controller: 'edit-user-join-party'
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
app.controller('index', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceJoinParty, $location, $translate) {



    var vm = $scope;
    $scope.tabnav = 'Section3'; // Initialize tabnav variable

    $scope.ImportFile = function (data) {
        dataserviceJoinParty.Import(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
                $uibModalInstance.close('cancel');
            } else {
                console.log(rs.Object);
                $scope.downloadFile(rs.Object, data)
                //window.open('/Admin/Docman#', '_blank');
            }
        });
    }
    $scope.downloadFile = function (file, ResumeNumber) {
        // Tạo một phần tử a để tạo ra một liên kết tới tệp Word
        var link = document.createElement("a");
        link.href = file; // Đặt đường dẫn đến tệp Word
        link.download = "Profile_" + ResumeNumber + ".docx"; // Đặt tên cho tệp khi được tải xuống
        // Kích hoạt sự kiện nhấp vào liên kết
        link.click();
    }
    $scope.callApi = function () {
        requestData = '12645';

        // Gọi hàm trong service dataserviceJoinParty để thực hiện yêu cầu API
        dataserviceJoinParty.GetLogStatusOfWFInst(requestData, function (response) {
            // Xử lý phản hồi từ API ở đây
            console.log(response.data); // In ra dữ liệu trả về từ API
        });
    };
    $scope.callApi()

    $scope.viewLogStatus = function (resumeNumber) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderJoinParty + '/view-status-log.html',
            controller: 'log-status-wf-full',
            size: '40',
            resolve: {
                para: function () {
                    return resumeNumber;
                }
            }
        });
        modalInstance.result.then(function (d) {
        });
    }

    $scope.saveTabNav = function (href) {
        $scope.tabnav = href; // Save href to tabnav variable
    };

    $scope.showSearch = function () {
        if (!$scope.isSearch) {
            $scope.isSearch = true;
        } else {
            $scope.isSearch = false;
        }
    }

    $scope.isEditWorkflow = false;
    $scope.editWorkflow = function (resumeNumber) {
        if (resumeNumber == 0 || resumeNumber == '' || resumeNumber == null || resumeNumber == undefined) {
            $scope.isEditWorkflow = false
            fixContent()
        } else {
            //gọi api lấy dữ liệu theo WfInstCode
            formatActIns(resumeNumber);
        }

    }
    function formatActIns(resumeNumber) {
        dataserviceJoinParty.GetActInstArranged(resumeNumber, function (rs) {
            console.log(rs.data)
            if (rs.data.ActArranged == []) {
                $scope.isEditWorkflow = false
                fixContent()
                return
            }
            $scope.listActs = rs.data.ActArranged;
            $scope.isEditWorkflow = true
            fixContent()
        })
    }

    function fixContent() {
        if ($scope.isEditWorkflow == true) {
            $('#tblData_wrapper').css('width', '50%');

        } else {
            $('#tblData_wrapper').css('width', '');
            return
        }
    }

    $scope.listActs = []

    $scope.moreFile = function (wfCode, ActInsCode) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + "/more-file.html",
            controller: 'more-file',
            size: '40',
            windowClass: "message-center",
            backdrop: 'static',
            resolve: {
                para: function () {
                    return {
                        wfInstCode: wfCode,
                        ActInsCode: ActInsCode
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {

        }, function () { });
    }


    $scope.CloseAll = function (act1) {
        if (!act1.IsApprovable) {
            act1.checkHiddenActWf = false;
            App.toastrError(caption.WFAI_MSG_U_NOT_PER_APPROVE_ACT);
            return
        }
        var actCheck = act1.checkHiddenActWf
        $scope.listActs.forEach(function (act) {
            act.checkHiddenActWf = false;
        });
        act1.checkHiddenActWf = !actCheck;
    }
    $scope.createWfInstance = function (ResumeNumber) {
        $scope.modelWfInst = {
            WorkflowCode: "PARTY_ADMISSION_PROFILE",
            ObjectType: "TEST_JOIN_PARTY",
            ObjectInst: ResumeNumber,
            WfInstName: "Quy trình khai báo và xét duyệt vào Đảng của Đảng uỷ Thành Phố Hà Nội",
            WfDesc: "",
            WfType: "WF_TYPE20240226102033",
            WfGroup: "WF_GROUP20240226092621"
        };
        console.log($scope.modelWfInst);
        console.log(ResumeNumber);
        if (ResumeNumber != null && ResumeNumber != undefined && ResumeNumber != "") {
            console.log(ResumeNumber);
            dataserviceJoinParty.createWfInstance($scope.modelWfInst, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    $scope.WfCode = rs.Code;
                    reloadData()
                    $scope.editWorkflow(ResumeNumber)
                }
            });
        }
    }

    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;

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

    $scope.ListStatus = [{
        Name: 'Chọn trạng thái',
        Code: ''
    },
    {
        Name: 'Mới đẩy lên',
        Code: 'Mới đẩy lên'
    },
    {
        Name: 'Mới cập nhật',
        Code: 'Mới cập nhật'
    },
    {
        Name: 'Đã duyệt',
        Code: 'Đã duyệt'
    }]
    $scope.ListGender = [{
        Name: 'Chọn giới tính',
        Code: null
    },
    {
        Name: 'Nam',
        Code: 0
    },
    {
        Name: 'Nữ',
        Code: 1
    }]
    $scope.delete = function (id) {
        var isDeleted = confirm("Ban co muon xoa?");
        if (isDeleted) {
            dataserviceJoinParty.delete(id, function (result) {
                result = result.data;
                console.log(result);
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                    $scope.reload();
                }
            })
        }
    }

    $scope.reload = function () {
        reloadData(true);
        ("th").addClass('text-center fw600')
    }
    $rootScope.reloadNoResetPage = function () {
        reloadData(false);
    }
    $scope.search = function () {
        reloadData(true);
    }
    $scope.searchModel = {
        FromDate: '',
        ToDate: '',
        FromAge: null,
        ToAge: null,
        Name: '',
        HomeTown: '',
        Username: '',
        Status: '',
        Nation: '',
        Religion: '',
        ItDegree: '',
        Job: '',
        ForeignLanguage: '',
        UnderPostGraduateEducation: '',
        MinorityLanguages: '',
        JobEducation: '',
        Degree: '',
        PoliticalTheory: '',
        GeneralEducation: '',
        Gender: null,
        KeyWord: ''
    }
    $scope.initData = function () {
        if ($rootScope.WorkflowInstCode != undefined && $rootScope.WorkflowInstCode != null && $rootScope.WorkflowInstCode != '') {
            $scope.editWorkflow($rootScope.WorkflowInstCode);
            $rootScope.WorkflowInstCode = ''
        }
        reloadData();
    };

    $scope.edit = function (id) {
        $location.path('/edit-user/' + id);
    }

    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/UserJoinParty/JTable2",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.FromDate = $scope.searchModel.FromDate,
                    d.ToDate = $scope.searchModel.ToDate,
                    d.FromAge = $scope.searchModel.FromAge,
                    d.ToAge = $scope.searchModel.ToAge,
                    d.Name = $scope.searchModel.Name,
                    d.Username = $scope.searchModel.Username,
                    d.HomeTown = $scope.searchModel.HomeTown,
                    d.Status = $scope.searchModel.Status,
                    d.Nation = $scope.searchModel.Nation,
                    d.Religion = $scope.searchModel.Religion,
                    d.ItDegree = $scope.searchModel.ItDegree,
                    d.Job = $scope.searchModel.Job,
                    d.ForeignLanguage = $scope.searchModel.ForeignLanguage,
                    d.UnderPostGraduateEducation = $scope.searchModel.UnderPostGraduateEducation,
                    d.MinorityLanguages = $scope.searchModel.MinorityLanguages,
                    d.Gender = $scope.searchModel.Gender,
                    d.KeyWord = $scope.searchModel.KeyWord,
                    d.JobEducation = $scope.searchModel.JobEducation,
                    d.Degree = $scope.searchModel.Degree,
                    d.PoliticalTheory = $scope.searchModel.PoliticalTheory,
                    d.GeneralEducation = $scope.searchModel.GeneralEducation
            },
            complete: function () {
                App.unblockUI("#contentMain");
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

                $scope.initData()
            }
        })
        .withOption('initComplete', function (settings, json) {
        })
        .withOption('createdRow', function (row, data, dataIndex) {
            $compile(angular.element(row))($scope);
            $(row).find('td:not(.listaction)').on('click', function (evt) {
                if (data.WfInstCode != '' && data.WfInstCode != null && data.WfInstCode != undefined) {
                    // Xóa lớp active khỏi tất cả các hàng
                    $(this).closest('table').find('tr').removeClass('active');

                    // Thêm lớp active vào hàng đã được click
                    $(this).closest('tr').addClass('active');
                    $scope.editWorkflow(data.resumeNumber)
                    $scope.WfCode = data.WfInstCode;
                    $scope.model.checkHiddenFileWfActivity = false;
                }

            });
            // if ($rootScope.WorkflowInstCode!=null&&$rootScope.WorkflowInstCode!=undefined&&$rootScope.WorkflowInstCode!='' 
            //     && data.WfInstCode === $rootScope.WorkflowInstCode) {
            //     $(this).closest('table').find('tr').removeClass('active');
            //     $(row).addClass('active').css('font-size', '16px !impotant');;
            // }
        });
    vm.dtColumns = [];

    vm.dtColumns.push(DTColumnBuilder.newColumn('Id').withOption('sClass', 'hidden').withTitle(titleHtml).renderWith(function (data, type) {
        $scope.selected[data] = false;
        return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + data + ']" ng-click="toggleOne(selected)"/><span></span></label>';
    }));

    vm.dtColumns.push(DTColumnBuilder.newColumn('stt').withOption('sClass', 'wpercent1').withTitle('{{"Stt" | translate}}').renderWith(function (data, type, full) {
        return data;
    }));

    vm.dtColumns.push(DTColumnBuilder.newColumn('CurrentName').withOption('sClass', '').withTitle('{{"Mã và tên người" | translate}}')
        .renderWith(function (data, type, full) {
            var res1 = ``;
            if (full.WfInstCode != null && full.WfInstCode != undefined && full.WfInstCode != '') {
                res1 = `<span style='color: green'>[Đã tạo luồng hoạt động]</span>`
            }

            var res = `<p class="bold isEdit"><span style="color: blue">[Mã: ${full.Username}]</span>${res1}<br><span>${data}</span></p>`;
            return res;
        }));

    vm.dtColumns.push(DTColumnBuilder.newColumn('BirthYear').withOption('sClass', '').withTitle('{{"Năm sinh" | translate}}').renderWith(function (data, type) {
        return data
    }));

    vm.dtColumns.push(DTColumnBuilder.newColumn('Gender').withOption('sClass', '').withTitle('{{"Giới tính" | translate}}').renderWith(function (data, type) {
        return data == 0 ? "Nam" : "Nữ";
    }));

    vm.dtColumns.push(DTColumnBuilder.newColumn('TemporaryAddress').withOption('sClass', '').withTitle('{{"Địa chỉ" | translate}}').renderWith(function (data, type) {
        return data
    }));

    vm.dtColumns.push(DTColumnBuilder.newColumn('UnderPostGraduateEducation').withOption('sClass', '')
        .withTitle('{{"Trình độ" | translate}}').renderWith(function (data, type, full) {
            return `<ul>
            <li>${data}</li>
            <li>${full.Degree}</li>
            <li>${full.GeneralEducation}</li>
        </ul>`
        }));

    vm.dtColumns.push(DTColumnBuilder.newColumn('resumeNumber').withOption('sClass', 'listaction').withTitle('{{"Trạng thái" | translate}}')
        .renderWith(function (data, type, full) {
            var wfbtn = '';
            wfbtn = `
        <a ng-click="viewLogStatus('${data}')"> Xem danh sách trạng thái</a>
        `
            return wfbtn
        }));

    // vm.dtColumns.push(DTColumnBuilder.newColumn('resumeNumber').withOption('sClass', '').withTitle('{{"Mã hồ sơ" | translate}}').renderWith(function (data, type) {
    //     return data
    // }));<i class="fs24 h-25 fa-solid fa-diagram-project" style="font-size: 25px; padding-left: 25px;"></i>

    vm.dtColumns.push(DTColumnBuilder.newColumn('action').notSortable().withOption('sClass', 'listaction w50 nowrap')
        .withTitle('{{ "COM_LIST_COL_ACTION" | translate }}').renderWith(function (data, type, full, meta) {
            var wfbtn = '';
            if (full.WfInstCode == null || full.WfInstCode == undefined || full.WfInstCode == '') {
                wfbtn = `<a title="{{'Tạo luồng'| translate}}" style="width: 25px; height: 25px; padding: 0px; color: #008000"
                            ng-click="createWfInstance('${full.resumeNumber}')">
                                <i class="fa-regular fa-light fa-circle-play fs25"></i>
                        </a>`
            }
            else {
                wfbtn = `<a title="{{'Xóa luồng'| translate}}" style="width: 25px; height: 25px; padding: 0px;color: #FF0000"
                            ng-click="DeleteWFIns('${full.resumeNumber}')">
                                <i class="fa-regular fa-light fa-circle-stop fs25 "></i>
                        </a>`
            }
            return `
            <a title="{{&quot;COM_BTN_EDIT&quot; | translate}}" class="width: 25px; height: 25px; padding: 0px" 
                ng-click="edit('${full.resumeNumber}')"><i class="fa-solid fa-edit  fs25"></i>
            </a>
            <a title="{{&quot;COM_BTN_DELETE&quot; | translate}}" class="width: 25px; height: 25px; padding: 0px"
                ng-click="delete('${full.Id}')"><i class="fa-solid fa-trash  fs25"></i>
            </a>
            
            <a title="{{&quot;Import File&quot; | translate}}" class="width: 25px; height: 25px; padding: 0px"
                ng-click="ImportFile('${full.resumeNumber}')"><i class="fa fa-file-word-o  fs25"></i>
            </a>
            ${wfbtn}
            `
                ;

        }));
    vm.reloadData = reloadData;
    vm.dtInstance = {};
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
});

app.controller('file-version', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataserviceJoinParty, $filter) {
    var vm = $scope;
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    $scope.model = {
        FromDate: '',
        ToDate: '',
    };
    $scope.ObjCode = $rootScope.ObjCode;

    $scope.viewWord = function (id, mode) {
        var userModel = {};
        var listdata = $('#tblDataContractFile').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id === id) {
                userModel = listdata[i];
                break;
            }
        }

        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {

            if (userModel.SizeOfFile < 20971520) {
                dataserviceJoinParty.getItemFile(id, true, mode, function (rs) {
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
            } else {
                App.toastrError(caption.CONTRACT_LBL_FILE_LIMIT_SIZE);
            }
        }
    };

    $scope.viewFile = function (id) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }

        var model = {};
        var listdata = $('#tblDataFileVersion').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].ID === id + '') {
                model = listdata[i];
                break;
            }
        }

        var data = {
            ActInstCode: $rootScope.ObjCode,
            FileCode: model.FileID,
            Url: model.Url,
            IsSign: false,
            Mode: 1
        };

        var extension = data.Url.substr(data.Url.lastIndexOf('.') + 1);
        var word = ['DOCX', 'DOC'];
        var pdf = ['PDF'];
        var excel = ['XLS', 'XLSX'];
        if (word.indexOf(extension.toUpperCase()) !== -1) {
            dataserviceJoinParty.viewFileOnline(data, function (rs) {
                window.open('/Admin/Docman#', '_blank');
            });
        }
        else if (pdf.indexOf(extension.toUpperCase()) !== -1) {
            dataserviceJoinParty.viewFileOnline(data, function (rs) {
                window.open('/Admin/PDF#', '_blank');
            });
        }
        else if (excel.indexOf(extension.toUpperCase()) !== -1) {
            dataserviceJoinParty.viewFileOnline(data, function (rs) {
                window.open('/Admin/Excel#', '_blank');
            });
        }
        else {
            window.open(url, '_blank');
        }
    };
});

app.controller('edit-user-join-party', function ($scope, $rootScope, $compile, $routeParams, dataserviceJoinParty, $filter, $http) {

    $scope.popoverLabels = [
        {
            "id": "currentName",
            "labelText": "Họ và tên",
        },
        {
            "id": "dateOfBird",
            "labelText": "Ngày sinh",
        },
        {
            "id": "gender",
            "labelText": "Giới tính",
        },
        {
            "id": "phone",
            "labelText": "Số điện thoại",
        },
        {
            "id": "noiSinh",
            "labelText": "Nơi sinh",
        },
        {
            "id": "queQuan",
            "labelText": "Quê quán",
        },
        {
            "id": "diaChiThuongTru",
            "labelText": "Thường trú",
        },
        {
            "id": "diaChiTamTru",
            "labelText": "Tam trú",
        },
        {
            "id": "job",
            "labelText": "Công việc hiện tại",
        },
        {
            "id": "nation",
            "labelText": "Dân tộc",
        },
        {
            "id": "religion",
            "labelText": "Tôn giáo",
        },
        {
            "id": "firstName",
            "labelText": "Họ và tên khai sinh",
        },
        {
            "id": "generalEducation",
            "labelText": "Giáo dục phổ thông",
        },
        {
            "id": "undergraduate",
            "labelText": "Giáo dục đại học",
        },
        {
            "id": "rankAcademic",
            "labelText": "Học hàm",
        },
        {
            "id": "vocationalTraining",
            "labelText": "Giáo dục nghề nghiệp",
        },
        {
            "id": "foreignLanguage",
            "labelText": "Ngoại ngữ",
        },
        {
            "id": "minorityLanguage",
            "labelText": "Tiếng dân tộc thiểu số",
        },
        {
            "id": "politicalTheory",
            "labelText": "Lý luận chính trị",
        },
        {
            "id": "it",
            "labelText": "Tin học",
        },
        {
            "id": "place",
            "labelText": "Nơi tạo",
        },
        {
            "id": "selfComment",
            "labelText": "Tự nhận xét",
        },
        {
            "id": "Relationship",
            "labelText": "Quan hệ",
        },
        {
            "id": "MenberFamilyName",
            "labelText": "Họ và tên",
        },
        {
            "id": "dateOfBirdRelation",
            "labelText": "Năm sinh",
        },
        {
            "id": "PoliticalAttitude",
            "labelText": "Thái độ chính trị",
        },
        {
            "id": "homeTown",
            "labelText": "Quê quán",
        },
        {
            "id": "residence",
            "labelText": "Nơi cư trú",
        },
        {
            "id": "career",
            "labelText": "Nghề nghiệp",
        },
        {
            "id": "working",
            "labelText": "Quá trình công tác",
        },
        {
            "id": "startDate",
            "labelText": "Từ ngày",
        },
        {
            "id": "endDate",
            "labelText": "Đến ngày",
        },
        {
            "id": "content",
            "labelText": "Nội dung",
        },
        {
            "id": "startDateAboard",
            "labelText": "Từ ngày",
        },
        {
            "id": "endDateAboard",
            "labelText": "Đến ngày",
        },
        {
            "id": "contact",
            "labelText": "Nội dung đi",
        },
        {
            "id": "country",
            "labelText": "Nước nào",
        },
        {
            "id": "personIntroduced",
            "labelText": "Người giới thiệu",
        },
        {
            "id": "placeTimeJoinUnion",
            "labelText": "Ngày và nơi vào Đoàn",
        },
        {
            "id": "placeTimeJoinParty",
            "labelText": "Ngày và nơi vào Đảng lần thứ nhất",
        },
        {
            "id": "placeTimeJoinParty",
            "labelText": "Ngày và nơi vào Đảng lần thứ nhất",
        },
        {
            "id": "placeTimeRecognize",
            "labelText": "Ngày và nơi công nhận chính thức lần thứ nhất",
        },
        {
            "id": "certificate",
            "labelText": "Văn bằng chứng chỉ",
        },
        {
            "id": "class",
            "labelText": "Ngành học hoặc tên lớp học",
        },
        {
            "id": "schoolName",
            "labelText": "Tên trường",
        },
        {
            "id": "to",
            "labelText": "Đến ngày",
        },
        {
            "id": "from",
            "labelText": "Từ ngày",
        },
        {
            "id": "disciplineReason",
            "labelText": "Lý do, hình thức",
        },
        {
            "id": "grantOfDecision",
            "labelText": "Cấp quyết định",
        },
        {
            "id": "monthYear",
            "labelText": "Tháng, năm",
        },
        {
            "id": "begin",
            "labelText": "Từ ngày",
        },
        {
            "id": "end",
            "labelText": "Đến ngày",
        },
        {
            "id": "content",
            "labelText": "Nội dung",
        },
        {
            "id": "work",
            "labelText": "Nội dung",
        },
        {
            "id": "reason",
            "labelText": "Lý do, hình thức",
        },
        {
            "id": "grantOfDecision",
            "labelText": "Cấp quyết định",
        },
        {
            "id": "role",
            "labelText": "Chức vụ",
        },
    ];

    $scope.popoverLabel = '';
    $scope.popoverid = '';
    $scope.commentTextarea = '';
    var matchedLabel = [];
    $scope.openPopover = function (popoverId) {
        matchedLabel = $scope.popoverLabels.find(function (item) {
            return item.id === popoverId;
        });
        $scope.pp.id = matchedLabel.id;
        $scope.popoverid = matchedLabel.id;
        if (matchedLabel) {
            $scope.popoverLabel = matchedLabel.labelText;
            $scope.commentTextarea = matchedLabel.comment;
        }
    };

    $scope.submit = function () {
        if ($scope.pp.id !== '' && $scope.pp.comment !== '') {
            $scope.addJson();
        }
    };

    $scope.ImportFile = function (data) {
        $scope.Json = {
            Profile: data,
            PersonalHistories: [],
            TrainingCertificatedPasses: [],
            WarningDisciplineds: [],
            Awards: [],
            Families: [],
            GoAboards: [],
            HistorySpecialist: [],
            IntroducerOfParty: {},
            WorkingTracking: []
        }

        $scope.PersonalHistory.forEach(function (personalHistory) {
            var obj = {};
            obj.Begin = personalHistory.Begin;
            obj.End = personalHistory.End;
            obj.Content = personalHistory.Content;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            obj.Id = personalHistory.Id;
            $scope.Json.PersonalHistories.push(obj)
        });
        $scope.PassedTrainingClasses.forEach(function (passedTrainingClasses) {
            var obj = {};
            obj.SchoolName = passedTrainingClasses.SchoolName;
            obj.Class = passedTrainingClasses.Class;
            obj.From = passedTrainingClasses.From;
            obj.To = passedTrainingClasses.To;
            obj.Certificate = passedTrainingClasses.Certificate;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            //obj.Id = passedTrainingClasses.Id;
            $scope.Json.TrainingCertificatedPasses.push(obj)
        });

        $scope.Disciplined.forEach(function (e) {
            var obj = {};
            obj.MonthYear = e.MonthYear;
            obj.Reason = e.Reason;
            obj.GrantOfDecision = e.GrantOfDecision;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            //obj.Id=e.Id;
            $scope.Json.WarningDisciplineds.push(obj)
        });

        $scope.Laudatory.forEach(function (laudatory) {
            var obj = {};
            obj.MonthYear = laudatory.MonthYear;
            obj.Reason = laudatory.Reason;
            obj.GrantOfDecision = laudatory.GrantOfDecision;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            //obj.Id = laudatory.Id;
            $scope.Json.Awards.push(obj)
        });

        $scope.Relationship.forEach(function (e) {
            var obj = {};
            obj.Relation = e.Relation;
            obj.PartyMember = e.PartyMember;
            obj.Name = e.Name;
            obj.BirthYear = e.BirthYear;
            obj.Residence = e.Residence;
            obj.PoliticalAttitude = e.PoliticalAttitude;
            obj.HomeTown = e.HomeTown;
            obj.Job = e.Job;
            obj.WorkingProgress = e.WorkingProgress;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            //bj.Id=e.Id;
            $scope.Json.Families.push(obj)
        });

        $scope.GoAboard.forEach(function (e) {
            var obj = {};
            obj.From = e.From;
            obj.To = e.To;
            obj.Contact = e.Contact;
            obj.Country = e.Country;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            //obj.Id = e.Id;
            $scope.Json.GoAboards.push(obj)
        });

        $scope.HistoricalFeatures.forEach(function (historicalFeatures) {
            var obj = {};
            obj.MonthYear = historicalFeatures.MonthYear;
            obj.Content = historicalFeatures.Content;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            //obj.Id = historicalFeatures.Id;
            $scope.Json.HistorySpecialist.push(obj)
        });

        $scope.Json.IntroducerOfParty.PersonIntroduced = $scope.Introducer.PersonIntroduced;
        $scope.Json.IntroducerOfParty.PlaceTimeJoinUnion = $scope.Introducer.PlaceTimeJoinUnion;
        $scope.Json.IntroducerOfParty.PlaceTimeJoinParty = $scope.Introducer.PlaceTimeJoinParty;
        $scope.Json.IntroducerOfParty.PlaceTimeRecognize = $scope.Introducer.PlaceTimeRecognize;
        $scope.Json.IntroducerOfParty.ProfileCode = $scope.infUser.ResumeNumber;

        $scope.BusinessNDuty.forEach(function (businessNDuty) {
            var obj = {};
            obj.From = businessNDuty.From;
            obj.To = businessNDuty.To;
            obj.Work = businessNDuty.Work;
            obj.Role = businessNDuty.Role;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            //obj.Id = businessNDuty.Id;
            $scope.Json.WorkingTracking.push(obj)
        });

        dataserviceJoinParty.UpdateOrCreateUserfileJson($scope.Json, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                console.log(rs.Object);
                $scope.downloadFile(rs.Title)
                //window.open('/Admin/Docman#', '_blank');
            }
        });
    }
    $scope.ImportJsonFile = function (data) {
        $scope.infUser.LastName = data.Profile.CurrentName;
        $scope.infUser.Birthday = data.Profile.Birthday;
        $scope.infUser.FirstName = data.Profile.BirthName;
        $scope.infUser.Sex = data.Profile.Gender;
        $scope.infUser.Nation = data.Profile.Nation;
        $scope.infUser.Religion = data.Profile.Religion;
        $scope.infUser.Residence = data.Profile.PermanentResidence;
        $scope.infUser.Phone = data.Profile.Phone;
        $scope.infUser.PlaceofBirth = data.Profile.PlaceBirth;
        $scope.infUser.NowEmployee = data.Profile.Job;
        $scope.infUser.HomeTown = data.Profile.HomeTown;
        $scope.infUser.TemporaryAddress = data.Profile.TemporaryAddress;
        $scope.infUser.LevelEducation.GeneralEducation = data.Profile.GeneralEducation;
        $scope.infUser.LevelEducation.VocationalTraining = data.Profile.JobEducation;
        $scope.infUser.LevelEducation.Undergraduate = data.Profile.UnderPostGraduateEducation;
        $scope.infUser.LevelEducation.RankAcademic = data.Profile.Degree;
        $scope.infUser.LevelEducation.ForeignLanguage = data.Profile.ForeignLanguage;
        $scope.infUser.LevelEducation.MinorityLanguage = data.Profile.MinorityLanguages;
        $scope.infUser.LevelEducation.It = data.Profile.ItDegree;
        $scope.infUser.LevelEducation.PoliticalTheory = data.Profile.PoliticalTheory;
        $scope.SelfComment.context = data.Profile.SelfComment;
        $scope.PlaceCreatedTime.place = data.Profile.CreatedPlace;
        $scope.infUser.ResumeNumber = data.Profile.ResumeNumber;
        $scope.infUser.Status = data.Profile.Status;
        $scope.Username = data.Profile.Username;
        $scope.infUser.WfInstCode = data.Profile.WfInstCode;
        $scope.GroupUser = data.Profile.GroupUserCode;
        $scope.infUser.PlaceWorking = data.Profile.PlaceWorking;


        data.Awards.forEach(function (laudatory) {
            var obj = {};
            obj.MonthYear = laudatory.MonthYear;
            obj.Reason = laudatory.Reason;
            obj.GrantOfDecision = laudatory.GrantOfDecision;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            //obj.Id = laudatory.Id;
            $scope.Laudatory.push(obj)
        });
        data.PersonalHistories.forEach(function (personalHistory) {
            var obj = {};
            obj.Begin = personalHistory.Begin;
            obj.End = personalHistory.End;
            obj.Content = personalHistory.Content;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            obj.Id = personalHistory.Id;
            $scope.PersonalHistory.push(obj)
        });
        data.TrainingCertificatedPasses
            .forEach(function (passedTrainingClasses) {
                var obj = {};
                obj.SchoolName = passedTrainingClasses.SchoolName;
                obj.Class = passedTrainingClasses.Class;
                obj.From = passedTrainingClasses.From;
                obj.To = passedTrainingClasses.To;
                obj.Certificate = passedTrainingClasses.Certificate;
                obj.ProfileCode = $scope.infUser.ResumeNumber;
                //obj.Id = passedTrainingClasses.Id;
                $scope.PassedTrainingClasses.push(obj)
            });
        data.WarningDisciplineds
            .forEach(function (e) {
                var obj = {};
                obj.MonthYear = e.MonthYear;
                obj.Reason = e.Reason;
                obj.GrantOfDecision = e.GrantOfDecision;
                obj.ProfileCode = $scope.infUser.ResumeNumber;
                //obj.Id=e.Id;
                $scope.Disciplined.push(obj)
            });
        data.Families
            .forEach(function (e) {
                var obj = {};
                obj.Relation = e.Relation;
                obj.PartyMember = e.PartyMember;
                obj.Name = e.Name;
                obj.BirthYear = e.BirthYear;
                obj.Residence = e.Residence;
                obj.PoliticalAttitude = e.PoliticalAttitude;
                obj.HomeTown = e.HomeTown;
                obj.Job = e.Job;
                obj.WorkingProgress = e.WorkingProgress;
                obj.ProfileCode = $scope.infUser.ResumeNumber;
                //bj.Id=e.Id;
                $scope.Relationship.push(obj)
            });
        data.GoAboards.forEach(function (e) {
            var obj = {};
            obj.From = e.From;
            obj.To = e.To;
            obj.Contact = e.Contact;
            obj.Country = e.Country;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            //obj.Id = e.Id;
            $scope.GoAboard.push(obj)
        });
        data.HistorySpecialist
            .forEach(function (historicalFeatures) {
                var obj = {};
                obj.MonthYear = historicalFeatures.MonthYear;
                obj.Content = historicalFeatures.Content;
                obj.ProfileCode = $scope.infUser.ResumeNumber;
                //obj.Id = historicalFeatures.Id;
                $scope.HistoricalFeatures.push(obj)
            });
        data.WorkingTracking.forEach(function (businessNDuty) {
            var obj = {};
            obj.From = businessNDuty.From;
            obj.To = businessNDuty.To;
            obj.Work = businessNDuty.Work;
            obj.Role = businessNDuty.Role;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            //obj.Id = businessNDuty.Id;
            $scope.BusinessNDuty.push(obj)
        });
        $scope.Introducer.PersonIntroduced = data.IntroducerOfParty.PersonIntroduced
        $scope.Introducer.PlaceTimeJoinUnion = data.IntroducerOfParty.PlaceTimeJoinUnion
        $scope.Introducer.PlaceTimeJoinParty = data.IntroducerOfParty.PlaceTimeJoinParty
        $scope.Introducer.PlaceTimeRecognize = data.IntroducerOfParty.PlaceTimeRecognize

        $scope.$apply()
    }

    $scope.uploadJsonFile = async function () {
        var file = document.getElementById("FileItem").files[0];
        if (file == null || file == undefined || file == "") {
            App.toastrError("Bạn chưa chọn file");
        } else {
            // Check if the selected file is not a JSON file
            if (file.type !== "application/json") {
                App.toastrError("File bạn tải không phải là file JSON");
                return;
            }
            var reader = new FileReader();
            reader.onload = function (event) {
                try {
                    var jsonData = JSON.parse(event.target.result);
                    console.log(jsonData); // Hoặc thực hiện các thao tác khác với dữ liệu JSON ở đây
                    $scope.ImportJsonFile(jsonData);
                } catch (error) {
                    console.error("Đã xảy ra lỗi khi đọc file JSON:", error);
                }
            };
            reader.onerror = function (event) {
                console.error("Đã xảy ra lỗi khi đọc file:", event.target.error);
            };

            reader.readAsText(file);

        }
    };

    $scope.ImportFile = function (data) {
        dataserviceJoinParty.UpdateOrCreateUserfileJson(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                console.log(rs.Object);
                $scope.downloadFile(rs.Title)
                //window.open('/Admin/Docman#', '_blank');
            }
        });
    }

    $scope.userGroup = [];
    $scope.fetchUserGroup = function () {
        dataserviceJoinParty.GetGroupUser(function (rs) {
            console.log(rs);
            $scope.userGroup = rs.data;
        });

        var currentUrl = window.location.href;

        function getFileNameFromUrl(url) {
            var parts = url.split('/');
            return parts[parts.length - 1];
        }

        var fileName = getFileNameFromUrl(currentUrl);

        // Tạo đường dẫn đến tệp JSON
        var jsonUrl = `/uploads/json/reviewprofile_${fileName}.json`;

        $http.get(jsonUrl).then(function (response) {
            $scope.jsonGuide = response.data;
            console.log($scope.jsonGuide);
            $.each($scope.jsonGuide, function (index, item) {
                // Tìm thẻ <i> có id trùng với id của phần tử
                var $icon = $('#' + item.id + '.fa.fa-info-circle');
                // Nếu thẻ <i> được tìm thấy, đổi màu chúng thành đỏ
                if ($icon.length > 0) {
                    $icon.css('color', 'red');
                }
            });
        }).catch(function (error) {
            console.error('Lỗi khi tải dữ liệu JSON:', error);
        });
    };

    $scope.selectItem = function (item) {
        $scope.selectedGroupUser = item.Code;
    };

    $scope.fetchUserGroup();

    $('.icon-clickable').click(function () {
        var id = $(this).attr('id');
        $scope.handleUserClick(id);
    });

    $scope.handleUserClick = function (id) {
        if (!Array.isArray($scope.jsonGuide)) {
            $scope.jsonGuide = [];
            console.warn('$scope.jsonGuide không phải là một mảng. Đã gán thành một mảng trống.');
        }

        $scope.matchedItemss = $scope.jsonGuide.filter(function (item) {
            return item.id === id;
        });
        console.log('$scope.matchedItemss:', $scope.matchedItemss)
        $scope.$apply();
    };

    $scope.downloadFile = function (file) {
        // Tạo một phần tử a để tạo ra một liên kết tới tệp Word
        var link = document.createElement("a");
        link.href = file; // Đặt đường dẫn đến tệp Word
        link.download = "Profile.json"
        // Kích hoạt sự kiện nhấp vào liên kết
        link.click();
    }
    $scope.initData = function () {
        $scope.ProfileList = [];
        dataserviceJoinParty.getProvince(function (rs) {
            $scope.ListProvince = rs.data;
            console.log($scope.ListProvince);
        })
        $scope.ListStatus = [{
            Name: 'Mới đẩy lên',
            Code: 'Mới đẩy lên'
        },
        {
            Name: 'Đang xử lý',
            Code: 'Đang xử lý'
        },
        {
            Name: 'Đã duyệt',
            Code: 'Đã duyệt'
        }]

        //Thêm data vào PersonalHistory
        $scope.PersonalHistory = [];

        $scope.infUser = {
            LevelEducation: {
                Undergraduate: [],
                PoliticalTheory: [],
                ForeignLanguage: [],
                It: [],
                MinorityLanguage: []
            },
        }
        //lịch sử bản thân
        $scope.PersonalHistory = [];
        //quá trình công tác
        $scope.BusinessNDuty = [];
        //di nước ngoài
        $scope.GoAboard = [];
        //Những lớp đào tạo
        $scope.PassedTrainingClasses = [];
        //đạc điểm lịch sử
        $scope.HistoricalFeatures = [];
        //khen thưởng
        $scope.Laudatory = [];
        //Kỷ luật
        $scope.Disciplined = [];
        //quan hệ gia đình
        $scope.Relationship = [];
        $scope.Introducer = {};
        $scope.SelfComment = {};
        $scope.fileList = [];
        function DateParse(rs) {
            var date = new Date(rs);
            var day = date.getDate();
            var month = date.getMonth() + 1; // Tháng bắt đầu từ 0
            var year = date.getFullYear();
            if (day < 10) {
                day = '0' + day;
            }
            if (month < 10) {
                month = '0' + month;
            }
            return day + '-' + month + '-' + year;
        }
        $scope.PlaceCreatedTime = {}
        dataserviceJoinParty.GetPartyAdmissionProfileByResumeNumber($routeParams.resumeNumber, function (rs) {
            rs = rs.data;
            $scope.infUser.LastName = rs.CurrentName;

            $scope.infUser.Birthday = DateParse(rs.Birthday)
            $scope.infUser.FirstName = rs.BirthName;

            $scope.infUser.Sex = rs.Gender == 0 ? "Nam" : "Nữ";
            $scope.infUser.Nation = rs.Nation;
            $scope.infUser.Religion = rs.Religion;
            $scope.infUser.Residence = rs.PermanentResidence;
            $scope.infUser.Phone = rs.Phone;
            $scope.infUser.PlaceofBirth = rs.PlaceBirth;
            $scope.infUser.NowEmployee = rs.Job;
            $scope.infUser.HomeTown = rs.HomeTown;
            $scope.infUser.TemporaryAddress = rs.TemporaryAddress;
            $scope.infUser.LevelEducation.GeneralEducation = rs.GeneralEducation;
            $scope.infUser.LevelEducation.VocationalTraining = rs.JobEducation;
            $scope.infUser.LevelEducation.Undergraduate = rs.UnderPostGraduateEducation;
            $scope.infUser.LevelEducation.RankAcademic = rs.Degree;

            $scope.infUser.LevelEducation.ForeignLanguage = rs.ForeignLanguage;
            $scope.infUser.LevelEducation.MinorityLanguage = rs.MinorityLanguages.trim();
            $scope.infUser.LevelEducation.It = rs.ItDegree;
            $scope.infUser.LevelEducation.PoliticalTheory = rs.PoliticalTheory;
            $scope.SelfComment.context = rs.SelfComment;
            $scope.PlaceCreatedTime.place = rs.CreatedPlace;
            $scope.infUser.ResumeNumber = rs.ResumeNumber;
            //$scope.infUser.Status =  rs.Status;
            $scope.infUser.WfInstCode = rs.WfInstCode;
            $scope.GroupUser = rs.GroupUserCode;
            $scope.infUser.PlaceWorking = rs.PlaceWorking;

            $scope.Username = rs.Username;
            console.log($scope.infUser);
            //Get By Profilecode
            $scope.getFamilyByProfileCode()
            $scope.getPersonalHistoryByProfileCode()

            $scope.getGoAboardByProfileCode()
            $scope.getAwardByProfileCode()

            $scope.getWorkingTrackingByProfileCode()
            $scope.getHistorySpecialistByProfileCode()

            $scope.getTrainingCertificatedPassByProfileCode()

            $scope.getWarningDisciplinedByProfileCode()

            $scope.getIntroducerOfPartyByProfileCode()

            $scope.getListFile();

            setTimeout(function () {
                $("#PersonalHistorysFromDate").datepicker({
                    inline: false,
                    autoclose: true,
                    format: "dd-mm-yyyy",
                    fontAwesome: true,
                }).on('changeDate', function (selected) {
                    var maxDate = new Date(selected.date.valueOf());
                    $('#PersonalHistorysToDate').datepicker('setStartDate', maxDate);
                });
                $("#PersonalHistorysToDate").datepicker({
                    inline: false,
                    autoclose: true,
                    format: "dd-mm-yyyy",
                    fontAwesome: true,
                }).on('changeDate', function (selected) {
                    var maxDate = new Date(selected.date.valueOf());
                    $('#PersonalHistorysFromDate').datepicker('setEndDate', maxDate);
                });

            }, 500);

        })

    }

    $scope.pp = {
        id: '',
        comment: ''
    }

    $scope.addJson = function () {
        console.log($scope.pp);
        if ($scope.pp.id != null && $scope.pp.id != '' &&
            $scope.pp.comment != null && $scope.pp.comment != ''
        ) {
            var data = {
                ResumeNumber: $scope.infUser.ResumeNumber,
                json: $scope.pp
            }
            dataserviceJoinParty.UpdateOrCreateJson(data, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                    var $icon = $('#' + $scope.pp.id + '.fa.fa-info-circle');
                    // Nếu thẻ <i> được tìm thấy, đổi màu chúng thành đỏ
                    if ($icon.length > 0) {
                        $icon.css('color', 'red');
                    }
                }
                else {
                    App.toastrSuccess(rs.Title);
                }
            })
        }
    }
    $scope.initData();

    $scope.GroupUsers = [];

    $scope.getGroupUsers = function () {
        dataserviceJoinParty.GetGroupUser(function (rs) {
            console.log(rs)
            $scope.GroupUsers = rs.data;
        })
        $http.get('../views/front-end/user/Guide.json').then(function (response) {
            $scope.jsonParse = response.data;
            console.log($scope.jsonParse);
        }).catch(function (error) {
            console.error('Lỗi khi tải dữ liệu JSON:', error);
        });

    }
    $scope.onItemSelect = function (item) {
        $scope.GroupUser = item.Code;
    }
    $scope.getGroupUsers();

    $('.fa-info-circle').click(function () {
        var id = $(this).attr('id');
        $scope.handleClick(id);
        $scope.$apply();
    });
    $scope.handleClick = function (id) {
        if (!Array.isArray($scope.jsonParse)) {
            $scope.jsonParse = [];
            console.warn('$scope.jsonParse không phải là một mảng. Đã gán thành một mảng trống.');
        }

        // Tiếp tục xử lý như bình thường
        $scope.matchedItems = $scope.jsonParse.filter(function (item) {
            return item.id === id;
        });
    };

    $scope.createWfInstance = function () {
        $scope.modelWfInst = {
            WorkflowCode: "PARTY_ADMISSION_PROFILE",
            ObjectType: "CUSTOMER",
            ObjectInst: "",
            WfInstName: "Quy trình khai báo và xét duyệt vào Đảng của Đảng uỷ Thành Phố Hà Nội",
            WfDesc: "",
            WfType: "WF_TYPE20240226102033",
            WfGroup: "WF_GROUP20240226092621"
        };
        console.log($scope.modelWfInst);
        //validationSelect($scope.model);
        if ($scope.infUser.WfInstCode == null || $scope.infUser.WfInstCode == undefined || $scope.infUser.WfInstCode == "") {
            dataserviceJoinParty.createWfInstance($scope.modelWfInst, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    $scope.infUser.WfInstCode = rs.Code;
                    $rootScope.WorkflowInstCode = rs.Code;
                }
                console.log(rs.data);
                $scope.submitPartyAdmissionProfile();

            })
        }
    }
    $scope.getListFile = function () {
        dataserviceJoinParty.getListFile($scope.infUser.ResumeNumber, function (rs) {
            rs = rs.data;
            $scope.fileList = rs.JsonProfileLinks;
            //$scope.$apply();
            console.log(rs);
        })
    }
    $scope.deleteFile = function (x) {
        dataserviceJoinParty.deleteFile(x.FileName, $scope.infUser.ResumeNumber, function (txt) {
            txt = txt.data;
            console.log(txt);
            if (txt.Error) {
                App.toastrError(txt.Title);
            } else {
                App.toastrSuccess(txt.Title);
                $scope.getListFile();
            }
        })
    }
    $scope.uploadExtensionFile = async function () {
        var file = document.getElementById("file").files[0];
        if (file == null || file == undefined || file == "") {
            App.toastrError("Bạn chưa chọn file để gửi");
        }
        else {
            var formdata = new FormData();
            formdata.append("file", file);
            formdata.append("ResumeNumber", $scope.infUser.ResumeNumber);

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            var resultImp = await fetch("/UserProfile/fileUpload", requestOptions);
            var txt = JSON.parse(await resultImp.text());
            console.log(txt);
            if (txt.Error) {
                App.toastrError(txt.Title);
            } else {
                App.toastrSuccess(txt.Title);
                $scope.getListFile();
            }
        }
    };

    $scope.fileList = [];

    $scope.senddata = function () {
        var data = $rootScope.ProjectCode;
        $rootScope.$emit('eventName', data);
    }

    //Lịch sử bản thân
    $scope.selectedPersonHistory = {}

    $scope.selectPersonHistory = function (x) {
        $scope.selectedPersonHistory = x;
    };

    $scope.addToPersonalHistory = function () {
        $scope.err = false
        if ($scope.selectedPersonHistory.Begin == null || $scope.selectedPersonHistory.Begin == undefined || $scope.selectedPersonHistory.Begin == '') {
            $scope.err = true
        }
        if ($scope.selectedPersonHistory.End == null || $scope.selectedPersonHistory.End == undefined || $scope.selectedPersonHistory.End == '') {
            $scope.err = true
        }
        if ($scope.selectedPersonHistory.Content == null || $scope.selectedPersonHistory.Content == undefined || $scope.selectedPersonHistory.Content == '') {
            $scope.err = true
        }

        if ($scope.err) {
            App.toastrError("Bạn chưa nhập đủ thông tin")
            return
        }
        var model = {}
        model.Begin = $scope.selectedPersonHistory.Begin
        model.End = $scope.selectedPersonHistory.End
        model.Content = $scope.selectedPersonHistory.Content
        model.Id = 0;
        model.ProfileCode = $scope.selectedPersonHistory.ProfileCode;

        $scope.PersonalHistory.push(model);
    }

    $scope.submitPersonalHistorys = function () {
        $scope.model = [];
        $scope.PersonalHistory.forEach(function (personalHistory) {
            var obj = {};
            obj.Begin = personalHistory.Begin;
            obj.End = personalHistory.End;
            obj.Content = personalHistory.Content;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            obj.Id = personalHistory.Id;
            $scope.model.push(obj)
        });
        dataserviceJoinParty.insertPersonalHistorys($scope.model, function (result) {
            result = result.data;
            if (result.Error) {
                App.toastrError(result.Title);
            } else {
                App.toastrSuccess(result.Title);
            }
        });

        console.log($scope.model);
    }
    $scope.deletePesonalHistory = function (index) {
        if ($scope.PersonalHistory[index].Id == undefined || $scope.PersonalHistory[index].Id == 0) {
            $scope.PersonalHistory.splice(index, 1);
        }
        else {
            $.ajax({
                type: "DELETE",
                url: "/UserProfile/DeletePersonalHistory?id=" + $scope.PersonalHistory[index].Id,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
                success: function (result) {
                    console.log(result.Title);
                    if (result.Error) {
                        App.toastrError(result.Title);
                    } else {
                        App.toastrSuccess(result.Title);
                        $scope.PersonalHistory.splice(index, 1);
                        $scope.$apply()
                    }
                },
                error: function (error) {
                    console.log(error.Title);
                }
            });
        }
    }
    $scope.submitDisciplined = function () {
        console.log($scope.Disciplined)
        $scope.model = [];

        $scope.Disciplined.forEach(function (e) {
            var obj = {};
            obj.MonthYear = e.MonthYear;
            obj.Reason = e.Reason;
            obj.GrantOfDecision = e.GrantOfDecision;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            obj.Id = e.Id;
            $scope.model.push(obj)
        });

        dataserviceJoinParty.insertWarningDisciplined($scope.model, function (result) {
            result = result.data;
            if (result.Error) {
                App.toastrError(result.Title);
            } else {
                App.toastrSuccess(result.Title);
                $scope.getGoAboardByProfileCode();
            }
        })
    }
    $scope.submitTrainingCertificatedPass = function () {
        $scope.model = [];
        $scope.PassedTrainingClasses.forEach(function (passedTrainingClasses) {
            var obj = {};
            obj.SchoolName = passedTrainingClasses.SchoolName;
            obj.Class = passedTrainingClasses.Class;
            obj.From = passedTrainingClasses.From;
            obj.To = passedTrainingClasses.To;
            obj.Certificate = passedTrainingClasses.Certificate;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            obj.Id = passedTrainingClasses.Id;
            $scope.model.push(obj)
        });


        dataserviceJoinParty.insertTrainingCertificatedPass($scope.model, function (result) {
            result = result.data;
            if (result.Error) {
                App.toastrError(result.Title);
            } else {
                App.toastrSuccess(result.Title);
                $scope.getGoAboardByProfileCode();
            }
        })

        console.log($scope.model);
    }
    $scope.getPersonalHistoryByProfileCode = function () {
        var requestData = { id: $scope.id };
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetPersonalHistoryByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
            success: function (result) {
                $scope.PersonalHistory = result;
                $scope.$apply()
                setTimeout(function () {

                }, 500)
            },
            error: function (error) {
                console.log(error);
            }
        });
        console.log("Vào");
    }

    //Đi nước ngoài
    $scope.selectedGoAboard = {}


    $scope.getGoAboardByProfileCode = function () {
        $.ajax({
            type: "GET",
            url: "/UserProfile/GetGoAboardByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $scope.GoAboard = result;
                $scope.$apply();
                console.log($scope.GoAboard);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    $scope.deleteGoAboard = function (index) {
        if ($scope.GoAboard[index].Id == undefined || $scope.GoAboard[index].Id == 0) {
            $scope.GoAboard.splice(index, 1);
        }
        else {
            $.ajax({
                type: "DELETE",
                url: "/UserProfile/DeleteGoAboard?id=" + $scope.GoAboard[index].Id,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
                success: function (result) {
                    if (result.Error) {
                        App.toastrError(result.Title);
                    } else {
                        App.toastrSuccess(result.Title);
                        $scope.GoAboard.splice(index, 1);
                        $scope.$apply()
                    }
                },
                error: function (error) {
                    console.log(error.Title);
                }
            });
        }

    }

    //Khen thưởng

    $scope.selectedLaudatory = {};

    $scope.selectLaudatory = function (x) {
        $scope.selectedLaudatory = x;
    };

    $scope.getAwardByProfileCode = function () {
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetAwardByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $scope.Laudatory = result;
                $scope.$apply();
                console.log($scope.Laudatory);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    //submit

    $scope.insertFamily = function () {
        $scope.model = [];

        $scope.Relationship.forEach(function (e) {
            var obj = {};
            obj.Relation = e.Relation;
            obj.PartyMember = e.PartyMember;
            obj.Name = e.Name;
            obj.BirthYear = e.BirthYear;
            obj.Residence = e.Residence;
            obj.PoliticalAttitude = e.PoliticalAttitude;
            obj.HomeTown = e.HomeTown;
            obj.Job = e.Job;
            obj.WorkingProgress = e.WorkingProgress;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            obj.Id = e.Id;
            $scope.model.push(obj)

        });
        dataserviceJoinParty.insertFamily($scope.model, function (result) {
            result = result.data;
            if (result.Error) {
                App.toastrError(result.Title);
            } else {
                App.toastrSuccess(result.Title);
                $scope.getFamilyByProfileCode();
                $scope.selectedFamily = {}
            }
        })

        console.log($scope.model);
    }
    $scope.submitGoAboard = function () {
        $scope.model = [];
        $scope.GoAboard.forEach(function (e) {
            var obj = {};
            obj.From = e.From;
            obj.To = e.To;
            obj.Contact = e.Contact;
            obj.Country = e.Country;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            obj.Id = e.Id;
            $scope.model.push(obj)
        });
        dataserviceJoinParty.insertGoAboards($scope.model, function (result) {
            result = result.data;
            if (result.Error) {
                App.toastrError(result.Title);
            } else {
                App.toastrSuccess(result.Title);
                $scope.getGoAboardByProfileCode()
            }
        })
    }
    $scope.submitBusinessNDuty = function () {
        $scope.model = [];
        $scope.BusinessNDuty.forEach(function (businessNDuty) {
            var obj = {};
            obj.From = businessNDuty.From;
            obj.To = businessNDuty.To;
            obj.Work = businessNDuty.Work;
            obj.Role = businessNDuty.Role;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            obj.Id = businessNDuty.Id;
            $scope.model.push(obj)
        });
        dataserviceJoinParty.insertBusinessNDuty($scope.model, function (result) {
            result = result.data;
            if (result.Error) {
                App.toastrError(result.Title);
            } else {
                App.toastrSuccess(result.Title);
                $scope.getWorkingTrackingByProfileCode()
            }

        })

        console.log($scope.model);
    }

    $scope.submitHistorySpecialist = function () {
        $scope.model = [];
        $scope.HistoricalFeatures.forEach(function (historicalFeatures) {
            var obj = {};
            obj.MonthYear = historicalFeatures.MonthYear;
            obj.Content = historicalFeatures.Content;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            obj.Id = historicalFeatures.Id;
            $scope.model.push(obj)
        });
        dataserviceJoinParty.insertHistorySpecialist($scope.model, function (result) {
            result = result.data;
            if (result.Error) {
                App.toastrError(result.Title);
            } else {
                App.toastrSuccess(result.Title);
                $scope.getHistorySpecialistByProfileCode()
            }
        })
        console.log($scope.model);
    }

    $scope.submitAward = function () {
        $scope.model = [];
        $scope.Laudatory.forEach(function (laudatory) {
            var obj = {};
            obj.MonthYear = laudatory.MonthYear;
            obj.Reason = laudatory.Reason;
            obj.GrantOfDecision = laudatory.GrantOfDecision;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            obj.Id = laudatory.Id;
            $scope.model.push(obj)
        });
        dataserviceJoinParty.insertAwards($scope.model, function (result) {
            result = result.data;
            if (result.Error) {
                App.toastrError(result.Title);
            } else {
                App.toastrSuccess(result.Title);
                $scope.getAwardByProfileCode()
            }
        })
        console.log($scope.model);
    }
    // AdmissionProfile
    $scope.submitPartyAdmissionProfile = function () {
        $scope.err = false
        if ($scope.infUser.LastName == "" || $scope.infUser.LastName == null || $scope.infUser.LastName == undefined) {
            $scope.err = true
            App.toastrError("Không được để trường Họ và tên trống")
        } if ($scope.infUser.Birthday == "" || $scope.infUser.Birthday == null || $scope.infUser.Birthday == undefined) {
            $scope.err = true
            App.toastrError("Không được để trường Ngày sinh trống")
        } if ($scope.infUser.FirstName == "" || $scope.infUser.FirstName == null || $scope.infUser.FirstName == undefined) {
            $scope.err = true
            App.toastrError("Không được để trường Họ và tên khai sinh trống")
        } if ($scope.infUser.Sex == "" || $scope.infUser.Sex == null || $scope.infUser.Sex == undefined) {
            $scope.err = true
            App.toastrError("Không được để trường Giới tính trống")
        } if ($scope.infUser.Nation == "" || $scope.infUser.Nation == null || $scope.infUser.Nation == undefined) {
            $scope.err = true
            App.toastrError("Không được để trường Dân tộc trống")
        } if ($scope.infUser.Religion == "" || $scope.infUser.Religion == null || $scope.infUser.Religion == undefined) {
            $scope.err = true
            App.toastrError("Không được để trường Tôn giáo trống")
        } if ($scope.infUser.Residence == "" || $scope.infUser.Residence == null || $scope.infUser.Residence == undefined) {
            $scope.err = true
            App.toastrError("Không được để trường Địa chỉ thường trú trống")
        } if ($scope.infUser.PlaceofBirth == "" || $scope.infUser.PlaceofBirth == null || $scope.infUser.PlaceofBirth == undefined) {
            $scope.err = true
            App.toastrError("Không được để trường Nơi sinh trống")
        } if ($scope.infUser.NowEmployee == "" || $scope.infUser.NowEmployee == null || $scope.infUser.NowEmployee == undefined) {
            $scope.err = true
            App.toastrError("Không được để trường Công việc hiện tại trống")
        } if ($scope.infUser.HomeTown == "" || $scope.infUser.HomeTown == null || $scope.infUser.HomeTown == undefined) {
            $scope.err = true
            App.toastrError("Không được để trường Quê quán trống")
        } if ($scope.infUser.TemporaryAddress == "" || $scope.infUser.TemporaryAddress == null || $scope.infUser.TemporaryAddress == undefined) {
            $scope.err = true
            App.toastrError("Không được để trường Địa chỉ tạm trú trống")
        } if ($scope.infUser.LevelEducation.GeneralEducation == "" || $scope.infUser.LevelEducation.GeneralEducation == null || $scope.infUser.LevelEducation.GeneralEducation == undefined) {
            $scope.err = true
            App.toastrError("Không được để trường Giáo dục phổ thông trống")
        } if ($scope.infUser.Phone == "" || $scope.infUser.Phone == null || $scope.infUser.Phone == undefined) {
            $scope.err = true
            App.toastrError("Không được để trường Số điện thoại trống")
        }
        //$http.post('/UserProfile/UpdatePartyAdmissionProfile/', model)
        if ($scope.err == true) {
            return
        }
        //$http.post('/UserProfile/UpdatePartyAdmissionProfile/', model)
        if ($scope.Username != null && $scope.Username != undefined) {
            $scope.model = {}
            $scope.model.CurrentName = $scope.infUser.LastName;
            $scope.model.Birthday = $scope.infUser.Birthday;
            $scope.model.BirthName = $scope.infUser.FirstName;
            $scope.model.Gender = $scope.infUser.Sex;
            $scope.model.Nation = $scope.infUser.Nation;
            $scope.model.Religion = $scope.infUser.Religion;
            $scope.model.PermanentResidence = $scope.infUser.Residence;
            $scope.model.Phone = $scope.infUser.Phone;
            $scope.model.PlaceBirth = $scope.infUser.PlaceofBirth;
            $scope.model.Job = $scope.infUser.NowEmployee;
            $scope.model.HomeTown = $scope.infUser.HomeTown;
            $scope.model.TemporaryAddress = $scope.infUser.TemporaryAddress;
            $scope.model.GeneralEducation = $scope.infUser.LevelEducation.GeneralEducation;
            $scope.model.JobEducation = $scope.infUser.LevelEducation.VocationalTraining;
            $scope.model.UnderPostGraduateEducation = $scope.infUser.LevelEducation.Undergraduate;
            $scope.model.Degree = $scope.infUser.LevelEducation.RankAcademic;
            $scope.model.Picture = '';
            $scope.model.ForeignLanguage = $scope.infUser.LevelEducation.ForeignLanguage;
            $scope.model.MinorityLanguages = $scope.infUser.LevelEducation.MinorityLanguage;
            $scope.model.ItDegree = $scope.infUser.LevelEducation.It;
            $scope.model.PoliticalTheory = $scope.infUser.LevelEducation.PoliticalTheory;
            $scope.model.SelfComment = $scope.SelfComment.context;
            $scope.model.CreatedPlace = $scope.PlaceCreatedTime.place;
            $scope.model.ResumeNumber = $scope.infUser.ResumeNumber;
            $scope.model.Status = $scope.infUser.Status;
            $scope.model.Username = $scope.Username;
            $scope.model.WfInstCode = $scope.infUser.WfInstCode;
            $scope.model.GroupUserCode = $scope.GroupUser;
            $scope.model.PlaceWorking = $scope.infUser.PlaceWorking

            if ($scope.infUser.ResumeNumber != '' && $scope.infUser.ResumeNumber != undefined &&
                $scope.Username != '' && $scope.Username != undefined) {
                console.log($scope.model);
                if ($scope.SaveJson == true) {
                    $scope.ImportFile($scope.model);
                    return
                }
                dataserviceJoinParty.update($scope.model, function (result) {
                    result = result.data;
                    if (result.Error) {
                        App.toastrError(result.Title);
                    } else {
                        App.toastrSuccess(result.Title);

                    }
                });
            }

            console.log($scope.model);
        }
    }


    $scope.submitIntroducer = function () {
        if ($scope.Username != null && $scope.Username != undefined) {
            $scope.model = {};
            $scope.model.PersonIntroduced = $scope.Introducer.PersonIntroduced;
            $scope.model.PlaceTimeJoinUnion = $scope.Introducer.PlaceTimeJoinUnion;
            $scope.model.PlaceTimeJoinParty = $scope.Introducer.PlaceTimeJoinParty;
            $scope.model.PlaceTimeRecognize = $scope.Introducer.PlaceTimeRecognize;
            $scope.model.ProfileCode = $scope.infUser.ResumeNumber;
            $scope.model.Id = $scope.Introducer.Id;

        };
        dataserviceJoinParty.insertIntroducer($scope.model, function (result) {
            result = result.data;
            if (result.Error) {
                App.toastrError(result.Title);
            } else {
                App.toastrSuccess(result.Title);
                $scope.getIntroducerOfPartyByProfileCode()
            }
        })
        console.log($scope.model);
    }
    // //getById
    // $scope.getBusinessNDutyById = function () {
    //     $scope.id = 2;
    //     dataserviceJoinParty.getBusinessNDutyById($scope.id, function (rs) {
    //             rs = rs.data;
    //             console.log(rs.data);
    //         })
    //     console.log($scope.id);
    // }

    // $scope.getHistorySpecialistById = function () {
    //     $scope.id = 2;
    //     dataserviceJoinParty.getHistorySpecialistById($scope.id, function (rs) {
    //             rs = rs.data;
    //             console.log(rs.data);
    //         })
    //     console.log($scope.id);
    // }

    // $scope.getAwardById = function () {
    //     $scope.id = 2;
    //     dataserviceJoinParty.getAwardById($scope.id, function (rs) {
    //             rs = rs.data;
    //             console.log(rs.data);
    //         })
    //     console.log($scope.id);
    // }

    // $scope.getWarningDisciplinedById = function () {
    //     $scope.id = 2;
    //     dataserviceJoinParty.getWarningDisciplinedById($scope.id, function (rs) {
    //             rs = rs.data;
    //             console.log(rs.data);
    //         })
    //     console.log($scope.id);
    // }

    //Get By Profilecode
    $scope.getFamilyByProfileCode = function () {
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetFamilyByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                $scope.Relationship = result;
                console.log($scope.Relationship);
            },
            error: function (error) {
                console.log(error);
            }
        });
        console.log("Vào");
    }

    $scope.getGoAboardByProfileCode = function () {
        var requestData = { id: $scope.id };
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetGoAboardByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
            success: function (result) {
                $scope.GoAboard = result;
                console.log($scope.GoAboard);
            },
            error: function (error) {
                console.log(error);
            }
        });
        console.log("Vào");
    }
    $scope.getWorkingTrackingByProfileCode = function () {
        var requestData = { id: $scope.id };
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetWorkingTrackingByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
            success: function (result) {
                $scope.BusinessNDuty = result;
                console.log($scope.BusinessNDuty);
            },
            error: function (error) {
                console.log(error);
            }
        });
        console.log("Vào");
    }
    $scope.getHistorySpecialistByProfileCode = function () {
        var requestData = { id: $scope.id };
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetHistorySpecialistByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
            success: function (result) {
                $scope.HistoricalFeatures = result;
                console.log($scope.HistoricalFeatures);
            },
            error: function (error) {
                console.log(error);
            }
        });
        console.log("Vào");
    }
    $scope.getTrainingCertificatedPassByProfileCode = function () {
        var requestData = { id: $scope.id };
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetTrainingCertificatedPassByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
            success: function (result) {
                $scope.PassedTrainingClasses = result;
                console.log($scope.PassedTrainingClasses);
            },
            error: function (error) {
                console.log(error);
            }
        });
        console.log("Vào");
    }
    $scope.getWarningDisciplinedByProfileCode = function () {
        var requestData = { id: $scope.id };
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetWarningDisciplinedByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
            success: function (result) {
                $scope.Disciplined = result;
                console.log($scope.Disciplined);
            },
            error: function (error) {
                console.log(error);
            }
        });
        console.log("Vào");
    }
    $scope.Introducer = {
        PersonIntroduced: '',
        PlaceTimeJoinUnion: '',
        PlaceTimeJoinParty: '',
        PlaceTimeRecognize: ''
    };
    $scope.getIntroducerOfPartyByProfileCode = function () {
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetIntroducerOfPartyByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                $scope.Introducer = result;
                console.log($scope.Introducer);
            },
            error: function (error) {
                console.log(error);
            }
        });
        console.log("Vào");
    }
    //add
    $scope.addToFamily = function () {
        $scope.addToFamily = function () {
            $scope.err = false
            if ($scope.selectedFamily.Relation == null || $scope.selectedFamily.Relation == undefined || $scope.selectedFamily.Relation == '') {
                $scope.err = true
            }
            if ($scope.selectedFamily.Residence == null || $scope.selectedFamily.Residence == undefined || $scope.selectedFamily.Residence == '') {
                $scope.err = true
            }
            if ($scope.selectedFamily.Name == null || $scope.selectedFamily.Name == undefined || $scope.selectedFamily.Name == '') {
                $scope.err = true
            }
            if ($scope.selectedFamily.BirthYear == null || $scope.selectedFamily.BirthYear == undefined || $scope.selectedFamily.BirthYear == '') {
                $scope.err = true
            }
            if ($scope.selectedFamily.PoliticalAttitude == null || $scope.selectedFamily.PoliticalAttitude == undefined || $scope.selectedFamily.PoliticalAttitude == '') {
                $scope.err = true
            }
            if ($scope.selectedFamily.HomeTown == null || $scope.selectedFamily.HomeTown == undefined || $scope.selectedFamily.HomeTown == '') {
                $scope.err = true
            }
            if ($scope.selectedFamily.Job == null || $scope.selectedFamily.Job == undefined || $scope.selectedFamily.Job == '') {
                $scope.err = true
            }
            if ($scope.selectedFamily.WorkingProgress == null || $scope.selectedFamily.WorkingProgress == undefined || $scope.selectedFamily.WorkingProgress == '') {
                $scope.err = true
            }
            if ($scope.err) {
                App.toastrError("Bạn chưa nhập đủ thông tin")
                return
            }
            var model = {}
            model.Relation = $scope.selectedFamily.Relation;
            model.Residence = $scope.selectedFamily.Residence;
            model.PartyMember = $scope.selectedFamily.PartyMember;
            model.Name = $scope.selectedFamily.Name;
            model.BirthYear = $scope.selectedFamily.BirthYear;
            model.PoliticalAttitude = $scope.selectedFamily.PoliticalAttitude;
            model.HomeTown = $scope.selectedFamily.HomeTown;
            model.Job = $scope.selectedFamily.Job;
            model.WorkingProgress = $scope.selectedFamily.WorkingProgress;
            model.Id = 0;
            $scope.Relationship.push(model);
            $scope.selectedFamily = {}
        }
        $scope.addToAward = function () {
            $scope.err = false
            if ($scope.selectedLaudatory.MonthYear == null || $scope.selectedLaudatory.MonthYear == undefined || $scope.selectedLaudatory.MonthYear == '') {
                $scope.err = true
            }
            if ($scope.selectedLaudatory.GrantOfDecision == null || $scope.selectedLaudatory.GrantOfDecision == undefined || $scope.selectedLaudatory.GrantOfDecision == '') {
                $scope.err = true
            }
            if ($scope.selectedLaudatory.Reason == null || $scope.selectedLaudatory.Reason == undefined || $scope.selectedLaudatory.Reason == '') {
                $scope.err = true
            }

            if ($scope.err) {
                App.toastrError("Bạn chưa nhập đủ thông tin")
                return
            }
            var model = {}
            model.MonthYear = $scope.selectedLaudatory.MonthYear
            model.GrantOfDecision = $scope.selectedLaudatory.GrantOfDecision
            model.Reason = $scope.selectedLaudatory.Reason
            model.ProfileCode = $scope.infUser.ResumeNumber;
            $scope.Laudatory.push(model)
        }
        $scope.addToBusinessNDuty = function () {
            $scope.err = false
            if ($scope.selectedWorkingTracking.From == null || $scope.selectedWorkingTracking.From == undefined || $scope.selectedWorkingTracking.From == '') {
                $scope.err = true
            }
            if ($scope.selectedWorkingTracking.To == null || $scope.selectedWorkingTracking.To == undefined || $scope.selectedWorkingTracking.To == '') {
                $scope.err = true
            }
            if ($scope.selectedWorkingTracking.Work == null || $scope.selectedWorkingTracking.Work == undefined || $scope.selectedWorkingTracking.Work == '') {
                $scope.err = true
            }
            if ($scope.selectedWorkingTracking.Role == null || $scope.selectedWorkingTracking.Role == undefined || $scope.selectedWorkingTracking.Role == '') {
                $scope.err = true
            }

            if ($scope.err) {
                App.toastrError("Bạn chưa nhập đủ thông tin")
                return
            }
            var model = {}
            model.From = $scope.selectedWorkingTracking.From
            model.To = $scope.selectedWorkingTracking.To
            model.Work = $scope.selectedWorkingTracking.Work
            model.Role = $scope.selectedWorkingTracking.Role

            model.Id = 0;
            $scope.BusinessNDuty.push(model)
        }
        $scope.addToHistorySpecialist = function () {
            $scope.err = false
            if ($scope.selectedHistorySpecialist.MonthYear == null || $scope.selectedHistorySpecialist.MonthYear == undefined || $scope.selectedHistorySpecialist.MonthYear == '') {
                $scope.err = true
            }
            if ($scope.selectedHistorySpecialist.Content == null || $scope.selectedHistorySpecialist.Content == undefined || $scope.selectedHistorySpecialist.Content == '') {
                $scope.err = true
            }

            if ($scope.err) {
                App.toastrError("Bạn chưa nhập đủ thông tin")
                return
            }
            var obj = {};
            obj.MonthYear = $scope.selectedHistorySpecialist.MonthYear;
            obj.Content = $scope.selectedHistorySpecialist.Content;
            obj.ProfileCode = $scope.infUser.ResumeNumber;

            obj.Id = 0;
            $scope.HistoricalFeatures.push(obj)
        }
        $scope.addToDisciplined = function () {
            $scope.err = false
            if ($scope.selectedWarningDisciplined.MonthYear == null || $scope.selectedWarningDisciplined.MonthYear == undefined || $scope.selectedWarningDisciplined.MonthYear == '') {
                $scope.err = true
            }
            if ($scope.selectedWarningDisciplined.Reason == null || $scope.selectedWarningDisciplined.Reason == undefined || $scope.selectedWarningDisciplined.Reason == '') {
                $scope.err = true
            }
            if ($scope.selectedWarningDisciplined.GrantOfDecision == null || $scope.selectedWarningDisciplined.GrantOfDecision == undefined || $scope.selectedWarningDisciplined.GrantOfDecision == '') {
                $scope.err = true
            }

            if ($scope.err) {
                App.toastrError("Bạn chưa nhập đủ thông tin")
                return
            }
            var obj = {};
            obj.MonthYear = $scope.selectedWarningDisciplined.MonthYear;
            obj.Reason = $scope.selectedWarningDisciplined.Reason;
            obj.GrantOfDecision = $scope.selectedWarningDisciplined.GrantOfDecision;

            obj.ProfileCode = $scope.infUser.ResumeNumber;
            obj.Id = 0;
            $scope.Disciplined.push(obj)
        }
        $scope.addToTrainingCertificatedPass = function () {
            $scope.err = false
            if ($scope.selectedTrainingCertificatedPass.From == null || $scope.selectedTrainingCertificatedPass.From == undefined || $scope.selectedTrainingCertificatedPass.From == '') {
                $scope.err = true
            }
            if ($scope.selectedTrainingCertificatedPass.To == null || $scope.selectedTrainingCertificatedPass.To == undefined || $scope.selectedTrainingCertificatedPass.To == '') {
                $scope.err = true
            }
            if ($scope.selectedTrainingCertificatedPass.SchoolName == null || $scope.selectedTrainingCertificatedPass.SchoolName == undefined || $scope.selectedTrainingCertificatedPass.SchoolName == '') {
                $scope.err = true
            }
            if ($scope.selectedTrainingCertificatedPass.Certificate == null || $scope.selectedTrainingCertificatedPass.Certificate == undefined || $scope.selectedTrainingCertificatedPass.Certificate == '') {
                $scope.err = true
            }
            if ($scope.err) {
                App.toastrError("Bạn chưa nhập đủ thông tin")
                return
            }
            var obj = {};
            obj.From = $scope.selectedTrainingCertificatedPass.From;
            obj.To = $scope.selectedTrainingCertificatedPass.To;
            obj.SchoolName = $scope.selectedTrainingCertificatedPass.SchoolName;
            obj.Class = $scope.selectedTrainingCertificatedPass.Class;
            obj.Certificate = $scope.selectedTrainingCertificatedPass.Certificate;

            obj.ProfileCode = $scope.infUser.ResumeNumber;
            obj.Id = 0;
            $scope.PassedTrainingClasses.push(obj)
        }
        $scope.addToGoAboard = function () {
            $scope.err = false
            if ($scope.selectedGoAboard.From == null || $scope.selectedGoAboard.From == undefined || $scope.selectedGoAboard.From == '') {
                $scope.err = true
            }
            if ($scope.selectedGoAboard.To == null || $scope.selectedGoAboard.To == undefined || $scope.selectedGoAboard.To == '') {
                $scope.err = true
            }
            if ($scope.selectedGoAboard.Contact == null || $scope.selectedGoAboard.Contact == undefined || $scope.selectedGoAboard.Contact == '') {
                $scope.err = true
            }
            if ($scope.selectedGoAboard.Country == null || $scope.selectedGoAboard.Country == undefined || $scope.selectedGoAboard.Country == '') {
                $scope.err = true
            }
            if ($scope.err) {
                App.toastrError("Bạn chưa nhập đủ thông tin")
                return
            }
            var obj = {};
            obj.From = $scope.selectedGoAboard.From;
            obj.To = $scope.selectedGoAboard.To;
            obj.Contact = $scope.selectedGoAboard.Contact;
            obj.Country = $scope.selectedGoAboard.Country;

            obj.ProfileCode = $scope.infUser.ResumeNumber;
            obj.Id = 0;
            $scope.GoAboard.push(obj)
        }

        //Update
        $scope.selectedFamily = {};
        $scope.selectedWarningDisciplined = {};
        $scope.selectedHistorySpecialist = {};
        $scope.selectedWorkingTracking = {};
        $scope.selectedTrainingCertificatedPass = {};
        $scope.selectedGoAboard = {};

        $scope.selectFamily = function (x) {
            $scope.selectedFamily = x;
        };
        $scope.selectWarningDisciplined = function (x) {
            $scope.selectedWarningDisciplined = x;
        };
        $scope.selectHistorySpecialist = function (x) {
            $scope.selectedHistorySpecialist = x;
        };
        $scope.selectWorkingTracking = function (x) {
            $scope.selectedWorkingTracking = x;
        };
        $scope.selectTrainingCertificatedPass = function (x) {
            $scope.selectedTrainingCertificatedPass = x;
        };
        $scope.selectGoAboard = function (x) {
            $scope.selectedGoAboard = x;
        };

        //Delete

        $scope.deleteFamily = function (index) {
            if ($scope.Relationship[index].Id == undefined || $scope.Relationship[index].Id == 0) {
                $scope.Relationship.splice(index, 1);
            }
            else {
                $.ajax({
                    type: "DELETE",
                    url: "/UserProfile/DeleteFamily?Id=" + $scope.Relationship[index].Id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
                    success: function (result) {
                        if (result.Error) {
                            App.toastrError(result.Title);
                        } else {
                            App.toastrSuccess(result.Title);
                            $scope.Relationship.splice(index, 1);
                            $scope.$apply()
                        }

                    },
                    error: function (error) {
                        App.toastrSuccess(error);
                    }
                });
            }
        }
        $scope.deleteHistorySpecialist = function (index) {
            if ($scope.HistoricalFeatures[index].Id == undefined || $scope.HistoricalFeatures[index].Id == 0) {
                $scope.HistoricalFeatures.splice(index, 1);
            } else {
                $.ajax({
                    type: "DELETE",
                    url: "/UserProfile/DeleteHistorySpecialist?id=" + $scope.HistoricalFeatures[index].Id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
                    success: function (result) {
                        console.log(result.Title);
                        if (result.Error) {
                            App.toastrError(result.Title);
                        } else {
                            App.toastrSuccess(result.Title);
                            $scope.HistoricalFeatures.splice(index, 1);
                            $scope.$apply()
                        }
                    },
                    error: function (error) {
                        App.toastrSuccess(error);
                    }
                });
            }
        }
        $scope.deleteWarningDisciplined = function (index) {
            if ($scope.Disciplined[index].Id == undefined || $scope.Disciplined[index].Id == 0) {
                $scope.Disciplined.splice(index, 1);
            } else {
                $.ajax({
                    type: "DELETE",
                    url: "/UserProfile/DeleteWarningDisciplined?id=" + $scope.Disciplined[index].Id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
                    success: function (result) {
                        console.log(result.Title);
                        if (result.Error) {
                            App.toastrError(result.Title);
                        } else {
                            App.toastrSuccess(result.Title);
                            $scope.Disciplined.splice(index, 1);
                            $scope.$apply()
                        }
                    },
                    error: function (error) {
                        console.log(error.Title);
                    }
                });
            }
        }
        $scope.deleteTrainingCertificatedPass = function (index) {
            if ($scope.PassedTrainingClasses[index].Id == undefined || $scope.PassedTrainingClasses[index].Id == 0) {
                $scope.PassedTrainingClasses.splice(index, 1);
            } else {
                $.ajax({
                    type: "DELETE",
                    url: "/UserProfile/DeleteTrainingCertificatedPass?id=" + $scope.PassedTrainingClasses[index].Id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        if (result.Error) {
                            App.toastrError(result.Title);
                        } else {
                            App.toastrSuccess(result.Title);
                            $scope.PassedTrainingClasses.splice(index, 1);
                            $scope.$apply()
                        }
                    },
                    error: function (error) {
                        console.log(error.Title);
                    }
                });
            }
        }
        $scope.deleteWorkingTracking = function (index) {
            if ($scope.BusinessNDuty[index].Id == undefined || $scope.BusinessNDuty[index].Id == 0) {
                $scope.BusinessNDuty.splice(index, 1);
            } else {
                $.ajax({
                    type: "DELETE",
                    url: "/UserProfile/DeleteWorkingTracking?id=" + $scope.BusinessNDuty[index].Id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
                    success: function (result) {
                        console.log(result.Title);
                        if (result.Error) {
                            App.toastrError(result.Title);
                        } else {
                            App.toastrSuccess(result.Title);
                            $scope.BusinessNDuty.splice(index, 1);
                            $scope.$apply();
                        }
                    },
                    error: function (error) {
                        console.log(error.Title);
                    }
                });
            }
        }
        $scope.deleteIntroducer = function (e) {
            console.log(e);
            var isDeleted = confirm("Ban co muon xoa?");
            if (isDeleted) {
                $.ajax({
                    type: "DELETE",
                    url: "/UserProfile/DeleteIntroducerOfParty?profileCode=" + $scope.infUser.ResumeNumber,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
                    success: function (result) {
                        console.log(result.Title);
                        if (result.Error) {
                            App.toastrError(result.Title);
                        } else {
                            App.toastrSuccess(result.Title);
                        }
                    },
                    error: function (error) {
                        console.log(error.Title);
                    }
                });
            }
        }
        $scope.deleteAward = function (index) {
            if ($scope.Laudatory[index].Id == undefined || $scope.Laudatory[index].Id == 0) {
                $scope.Laudatory.splice(index, 1);
            } else {
                $.ajax({
                    type: "DELETE",
                    url: "/UserProfile/DeleteAward?id=" + $scope.Laudatory[index].Id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
                    success: function (result) {
                        if (result.Error) {
                            App.toastrError(result.Title);
                        } else {
                            App.toastrSuccess(result.Title);
                            $scope.Laudatory.splice(index, 1);
                            $scope.$apply();
                        }
                    },
                    error: function (result) {
                        App.toastrError(result.Title);
                    }
                });
            }
        }
        //getGoAboardById
        $scope.getGoAboardById = function () {
            $scope.id = 2;
            dataserviceJoinParty.getGoAboardById($scope.id, function (rs) {
                rs = rs.data;
                console.log(rs.data);

            })

            console.log($scope.id);
        }
        $scope.getTrainingCertificatedPassById = function () {
            $scope.id = 2;
            dataserviceJoinParty.getTrainingCertificatedPassById($scope.id, function (rs) {
                rs = rs.data;
                console.log(rs.data);
            })
            console.log($scope.id);
        }
        //getGetPersonalHistoryById
        $scope.getPersonalHistoryById = function () {
            $scope.id = 2;
            dataserviceJoinParty.getPersonalHistoryById($scope.id, function (rs) {
                rs = rs.data;
                console.log(rs.data);
            })
            console.log($scope.id);
        }

        //getGoAboardById
        $scope.getGoAboardById = function () {
            $scope.id = 2;
            dataserviceJoinParty.getGoAboardById($scope.id, function (rs) {
                rs = rs.data;
                console.log(rs.data);

            })

            console.log($scope.id);
        }

        $scope.uploadFile = async function () {
            var file = document.getElementById("FileItem").files[0];
            if (file == null || file == undefined || file == "") {
                App.toastrError("Bạn chưa chọn file");
            }
            else {
                var formdata = new FormData();
                formdata.append("files", file);

                var requestOptions = {
                    method: 'POST',
                    body: formdata,
                    redirect: 'follow'
                };
                var resultImp = await fetch("/UserProfile/Import", requestOptions);
                var txt = await resultImp.text();

                $scope.JSONobjj = handleTextUpload(txt);
                if ($scope.JSONobjj = []) {
                    App.toastrError("File bạn tải không hợp lệ");
                } else {
                    App.toastrSuccess("Tải file thành công")
                }
                console.log($scope.JSONobj);
            }
        };

        function handleTextUpload(txt) {
            $scope.defaultRTE.value = txt;
            setTimeout(function () {
                var listPage = document.querySelectorAll(".Section0 > div > table");
                //Page2 Lịch sử bản thân
                var listTagpinPage1 = listPage[1].querySelectorAll("tbody > tr > td > p");
                var objPage1 = Array.from(listTagpinPage1).filter(function (element) {
                    // Kiểm tra xem thuộc tính của thẻ <p> có chứa văn bản không
                    var textContent = element.textContent.trim();
                    return textContent.length > 0 && /\+/.test(textContent);
                });

                //đối tượng lưu thông tin lịch sử bản thân dưới bằng mảng

                for (let i = 0; i < objPage1.length; i++) {
                    var PersonHis = {};
                    // Sửa lỗi ở đây, sử dụng indexOf thay vì search và sửa lỗi về cú pháp của biểu thức chấm phẩy
                    PersonHis['Begin'] = objPage1[i].innerText.split(':')[0].substr(objPage1[i].innerText.indexOf('-') - 8, 7).trim(),
                        PersonHis['End'] = objPage1[i].innerText.split(':')[0].substr(objPage1[i].innerText.indexOf('-') + 1, 7).trim(),
                        // Sửa lỗi ở đây, sử dụng split(':') để tách thời gian và thông tin
                        PersonHis['Content'] = objPage1[i].innerText.split(':')[1];
                    $scope.PersonalHistory.push(PersonHis);
                }
                console.log('PersonalHistory', $scope.PersonalHistory)



                //Page3 Những nơi công tác và chức vụ đã qua
                var datapage2 = Array.from(listPage[2].querySelectorAll('tr:nth-child(2) > td > p'))
                    .filter(function (element) {
                        return element.textContent.trim().length > 0;
                    })
                    .map(function (element) {
                        return element.innerText.trim();
                    });

                var datapage2 = Array.from(listPage[2].querySelectorAll("tr:nth-child(n+2)"));
                var pElementP2s = [];
                datapage2.forEach(function (datapage2Element) {
                    var pInTr = Array.from(datapage2Element.querySelectorAll("td > p")).filter(function (ele) {
                        return ele.innerText.trim().length > 0;
                    }).map(function (element) {
                        return element.innerText.trim();
                    });;
                    pElementP2s.push(pInTr);
                })

                for (let i = 0; i < pElementP2s.length; i++) {
                    if (pElementP2s[i].length != 0) {
                        var begin = pElementP2s[i][0].substr(pElementP2s[i][0].indexOf('-') - 2, 7);
                        var end = pElementP2s[i][0].substr(pElementP2s[i][0].lastIndexOf('-') - 2, 7);
                        var BusinessNDutyObj = {
                            From: begin,
                            To: end,
                            Work: pElementP2s[i][1],
                            Role: pElementP2s[i][2]
                        };
                        $scope.BusinessNDuty.push(BusinessNDutyObj);
                    }
                }
                console.log('BusinessNDuty', pElementP2s)

                //pag4: những lớp đào tạo bồi dưỡng đã qa
                var datapage4 = Array.from(listPage[4].querySelectorAll('tr:nth-child(n+2)'));
                var pElementP4s = [];
                datapage4.forEach(function (e) {
                    var pInTr = Array.from(e.querySelectorAll("td > p")).filter(function (ele) {
                        return ele.innerText.trim().length > 0;
                    }).map(function (element) {
                        return element.innerText.trim();
                    });
                    pElementP4s.push(pInTr);
                });

                console.log(pElementP4s)

                let check = 0;

                for (let i = 0; i < pElementP4s.length; i++) {
                    if (pElementP4s[i].length == 4) {
                        var obj = {
                            SchoolName: pElementP4s[i][0],
                            Class: pElementP4s[i][1],
                            From: pElementP4s[i][2].substring(0, pElementP4s[i][2].indexOf('đến')),
                            To: pElementP4s[i][2].substring(pElementP4s[i][2].lastIndexOf('đến') + 4).trim(),
                            Certificate: pElementP4s[i][1]
                        };
                        $scope.PassedTrainingClasses.push(obj);
                    }
                    //check = 1;
                }
                // if (check === 1) {
                //     var ttpd = document.getElementById("TTPD")
                //     var llgd = document.getElementById("LLGD")
                //     var lsbt = document.getElementById("LSBT")
                //     var gtvd = document.getElementById("GTVD")

                //     console.log(llgd)

                //     llgd.style.opacity = 1;
                //     llgd.style.pointerEvents = "auto";

                //     lsbt.style.opacity = 1;
                //     lsbt.style.pointerEvents = "auto";

                //     gtvd.style.opacity = 1;
                //     gtvd.style.pointerEvents = "auto";

                //     ttpd.style.display = "block";

                //     check = 0;
                // }
                console.log('PassedTrainingClasses', $scope.PassedTrainingClasses)



                var data = Array.from(listPage[3].querySelectorAll('td > p')).filter(function (ele) {
                    return ele.innerText.trim().length > 0;
                }).map(function (element) {
                    return element.innerText.trim();
                });
                function isTime(e) {
                    return (e.includes('Ngày') && e.includes('tháng') && e.includes('năm')) ? true : false;
                }

                for (let i = 0; i < data.length; i++) {
                    var obj = {
                        time: null,
                        content: null
                    };
                    if (isTime(data[i])) {
                        obj.MonthYear = data[i].substr(data[i].indexOf("Ngày") + 4, 4).trim() + '-' +
                            data[i].substr(data[i].indexOf("tháng") + 5, 4).trim() + '-' +
                            data[i].substr(data[i].indexOf("năm") + 4, 5),
                            obj.Content = data[i + 1];
                    }
                    if (obj.MonthYear != null && obj.Content != null) {
                        $scope.HistoricalFeatures.push(obj);
                    }
                }
                console.log("HistoricalFeatures:", $scope.HistoricalFeatures);
                //Page 5 Di nuoc nguoai
                var datapage5 = Array.from(listPage[5].querySelectorAll("tr:nth-child(n+2)"));
                var pElementP5s = [];
                datapage5.forEach(function (datapage5Elemnt) {
                    var pInTr = Array.from(datapage5Elemnt.querySelectorAll("td > p")).filter(function (ele) {
                        return ele.innerText.trim().length > 0;
                    }).map(function (element) {
                        return element.innerText.trim();
                    });
                    pElementP5s.push(pInTr);
                })
                for (let i = 0; i < pElementP5s.length; i++) {
                    if (pElementP5s[i].length == 3) {
                        var GoAboardObj = {
                            From: pElementP5s[i][0].substring(pElementP5s[i][0].indexOf("Từ") + 2, pElementP5s[i][0].indexOf("đến")).trim(),
                            To: pElementP5s[i][0].substring(pElementP5s[i][0].indexOf("đến") + 3).trim(),
                            Contact: pElementP5s[i][1],
                            Country: pElementP5s[i][2]
                        };
                        $scope.GoAboard.push(GoAboardObj);
                    }
                }
                console.log('GoAboard', $scope.GoAboard)
                //Page6 Khen thuong
                var datapage6 = Array.from(listPage[6].querySelectorAll("tr:nth-child(n+2)"));
                var pElementP6s = [];
                datapage6.forEach(function (datapage6Elemnt) {
                    var pInTr = Array.from(datapage6Elemnt.querySelectorAll("td > p")).filter(function (ele) {
                        return ele.innerText.trim().length > 0;
                    }).map(function (element) {
                        return element.innerText.trim();
                    });
                    pElementP6s.push(pInTr);
                })
                for (let i = 0; i < pElementP6s.length; i++) {
                    if (pElementP6s[i].length == 3) {
                        var obj = {
                            MonthYear: pElementP6s[i][0].trim(),
                            Reason: pElementP6s[i][1],
                            GrantOfDecision: pElementP6s[i][2]
                        };
                        $scope.Laudatory.push(obj);
                    }
                }
                console.log('Laudatory', $scope.Laudatory)
                //Page7 ki luat
                //phan van giua 2 truong hop: neu bi ki luat thi lay binh thuonng con neeu ko bij thi se de trong
                var datapage7 = Array.from(listPage[7].querySelectorAll("tr:nth-child(n+2)"));
                var pElementP7s = [];
                datapage7.forEach(function (datapage7Elemnt) {
                    var pInTr = Array.from(datapage7Elemnt.querySelectorAll("td > p")).filter(function (ele) {
                        return ele.innerText.trim().length > 0;
                    }).map(function (element) {
                        return element.innerText.trim();
                    });
                    if (pInTr.length == 3) {
                        pElementP7s.push(pInTr);
                    }
                })

                for (let i = 0; i < pElementP7s.length; i++) {
                    var DisciplinedObj = {
                        MonthYear: pElementP7s[i][0] ? pElementP7s[i][0] : 'None',
                        Reason: pElementP7s[i][0] ? pElementP7s[i][1] : "None",
                        GrantOfDecision: pElementP7s[i][0] ? pElementP7s[i][2] : "None",
                    };
                    $scope.Disciplined.push(DisciplinedObj);
                }
                console.log('Disciplined', $scope.Disciplined)
                //Page8 Hoan canh gia dinh
                var datapage8 = Array.from(listPage[8].querySelectorAll("tr:first-child>td"));
                var pE8 = [];
                datapage8.forEach(function (datapage8Elemnt) {
                    var pInTr = Array.from(datapage8Elemnt.querySelectorAll("p")).filter(function (ele) {
                        return ele.innerText.trim().length > 0;
                    }).map(function (element) {
                        return element.innerText.trim();
                    });
                    pE8.push(pInTr);
                })

                let RelationshipIndex = 0;
                for (let y = 0; y < pE8.length; y++) {
                    for (let i = 0; i < pE8[y].length; i++) {
                        if (pE8[y][i].startsWith('- Họ và tên:')) {
                            $scope.Relationship[RelationshipIndex].Name = pE8[y][i].slice(('- Họ và tên:').length).trim()
                        }
                        if (pE8[y][i].startsWith('- Năm sinh:')) {
                            //let regex = /^(\d{4})-(\d{4})(?:\(([^)]*)\))?$/;
                            let match = pE8[y][i].slice(('- Năm sinh:').length).trim()//.match(regex);

                            // if (match) {
                            //     $scope.Relationship[RelationshipIndex].Year = {
                            //         YearBirth: match[1],
                            //         YearDeath: match[2],
                            //         Reason: match[3] ? match[3].trim() : ''  // Kiểm tra xem có thông tin lý do không
                            //     };
                            // }
                            $scope.Relationship[RelationshipIndex].BirthYear = match;
                        }
                        if (pE8[y][i].startsWith("- Quê quán:")) {
                            $scope.Relationship[RelationshipIndex].HomeTown = pE8[y][i].slice(('- Quê quán:').length).trim()
                        }
                        if (pE8[y][i].startsWith("- Nơi cư trú:")) {
                            $scope.Relationship[RelationshipIndex].Residence = pE8[y][i].slice(('- Nơi cư trú:').length).trim()
                        }
                        if (pE8[y][i].startsWith("- Nghề nghiệp:")) {
                            $scope.Relationship[RelationshipIndex].Job = pE8[y][i].slice(('- Nghề nghiệp:').length).trim()
                        }
                        if (pE8[y][i].startsWith("- Đảng viên:")) {
                            var partyMember = pE8[y][i].slice(('- Đảng viên:').length).trim()
                            if (partyMember.toLowerCase() == "không") {
                                $scope.Relationship[RelationshipIndex].PartyMember = false;
                            }
                            else $scope.Relationship[RelationshipIndex].PartyMember = true;
                        }
                        if (pE8[y][i].startsWith("- Quá trình công tác:")) {
                            // let regex = /^(\d{4})-(.*)$/;

                            $scope.Relationship[RelationshipIndex].WorkingProgress = '';
                            for (j = i + 1; j <= pE8[y].length - 1 && !pE8[y][j].startsWith('-') && !pE8[y][j].startsWith('*'); j++) {
                                let inputString = pE8[y][j];
                                //let match = inputString.match(regex);

                                //if (match) {
                                //   let resultObject = {
                                //     Year: match[1],
                                //     Job: match[2].trim()  // Loại bỏ khoảng trắng ở đầu và cuối của công việc
                                //   };
                                //  $scope.Relationship[RelationshipIndex].WorkingProgress.push(resultObject);
                                $scope.Relationship[RelationshipIndex].WorkingProgress += inputString + ',';
                                i = j;
                                //}
                            }
                        }
                        if (pE8[y][i].startsWith("- Thái độ chính trị:")) {
                            $scope.Relationship[RelationshipIndex].PoliticalAttitude = '';
                            try {
                                for (j = i + 1; j <= pE8[y].length - 1 && pE8[y][j].startsWith('+'); j++) {
                                    $scope.Relationship[RelationshipIndex].PoliticalAttitude += (pE8[y][j].slice(1).trim()) + ',';
                                    i = j;
                                }
                            }
                            catch {
                                console.log(pE8[y]);
                            }
                        }
                        if ((pE8[y][i].startsWith('*'))) {
                            let regex = /^\*(.+?):$/;
                            let match = pE8[y][i].match(regex);

                            if (match) {
                                let relationship = match[1];
                                RelationshipIndex = $scope.Relationship.length;
                                $scope.Relationship[RelationshipIndex] = {
                                    Relation: relationship.trim(),
                                    ClassComposition: '',
                                    PartyMember: false,
                                }
                            }
                        }
                    }
                }
                console.log("Relationship:", $scope.Relationship);
                //Page 9 Tự nhận xét
                $scope.SelfComment = {
                    context: Array.from(listPage[9].querySelectorAll("tr:first-child > td > p:first-child"))[0].innerText
                };
                //Page 9 ket don
                var datapage9 = Array.from(listPage[9].querySelectorAll("tr:last-child > td > p")).filter(function (element) {
                    return element.innerText.trim().length > 0 && element.innerText.includes("ngày") && element.innerText.includes("tháng") && element.innerText.includes("năm");
                }).map(function (element) {
                    return element.innerText.trim();
                });
                $scope.PlaceCreatedTime = {
                    place: datapage9[0].trim()
                    // createdTime: datapage9[0].substring(datapage9[0].indexOf('ngày') + 4, datapage9[0].indexOf('tháng')).trim() + '-'
                    //     + datapage9[0].substring(datapage9[0].indexOf('tháng') + 5, datapage9[0].indexOf('năm')).trim() + '-'
                    //     + datapage9[0].substring(datapage9[0].indexOf('năm') + 4).trim()
                };
                var obj = $scope.defaultRTE.getContent();
                console.log(datapage9);
                $scope.listPage = $(obj).find('> div > div > div').toArray();
                $scope.listInfo1 = $($scope.listPage[0]).find('table > tbody > tr > td > p').toArray()
                    .map(y => $(y).find('> span').toArray().map(t => $(t).text()));
                //Lấy sdt 
                $scope.listDetail8 = $($scope.listPage[0])
                    .find('table > tbody > tr:nth-child(1) > td > p:nth-child(27)').text();
                console.log($scope.listDetail8);
                $scope.listDetail1 = $($scope.listPage[0])
                    .find('table > tbody > tr:nth-child(2) > td > p:nth-child(n+7):nth-child(-n+15)').toArray()
                    .map(t => $(t).text());
                console.log($scope.listDetail1);

                $scope.Detail1 = $($scope.listPage[0])
                    .find('table > tbody > tr:nth-child(2) > td > p:nth-child(16) > span:nth-child(2)').text()
                //.map(z => $(z).text());

                console.log($scope.listDetail2)
                $scope.Detail2 = $($scope.listPage[0])
                    .find('table > tbody > tr:nth-child(2) > td > p:nth-child(16) > span:nth-child(4)').text()
                console.log($scope.Detail1 + $scope.Detail2);
                $scope.listDetail3 = $($scope.listPage[0])
                    .find('table > tbody > tr:nth-child(2) > td > p:nth-child(17)').text()

                $scope.listDetail4 = $($scope.listPage[0])
                    .find('table > tbody > tr:nth-child(2) > td > p:nth-child(27) > span:last-child').text().split(',')

                $scope.listDetail5 = $($scope.listPage[0])
                    .find('table > tbody > tr:nth-child(2) > td > p:nth-child(28) > span:nth-child(even)').toArray()
                    .map(z => $(z).text());

                $scope.listDetail6 = $($scope.listPage[0])
                    .find('table > tbody > tr:nth-child(2) > td > p:nth-child(n+19):nth-child(-n+26)').toArray()
                    .map(t => $(t).text());
                console.log($scope.listDetail6);
                $scope.listDetail7 = $($scope.listPage[0])
                    .find('table > tbody > tr:nth-child(2) > td > p:nth-child(28) > span:nth-child(5)').toArray()
                    .map(z => $(z).text());

                $scope.listDetail9 = $($scope.listPage[0])
                    .find('table > tbody > tr:nth-child(1) > td > p:nth-child(29)').text();

                $scope.infUser.FirstName = $scope.listDetail1[0].split(":")[1] ? $scope.listDetail1[0].split(":")[1].trim() : "";
                $scope.infUser.Sex = $scope.listDetail1[1].split(":")[1] ? $scope.listDetail1[1].split(":")[1].trim() : "";
                $scope.infUser.LastName = $scope.listDetail1[2].split(":")[1] ? $scope.listDetail1[2].split(":")[1].trim() : "";
                $scope.infUser.Birthday = $scope.listDetail1[3].split(":")[1] ? $scope.listDetail1[3].split(":")[1].trim() : "";
                $scope.infUser.HomeTown = $scope.listDetail1[5].split(":")[1] ? $scope.listDetail1[5].split(":")[1].trim() : "";
                $scope.infUser.PlaceofBirth = $scope.listDetail1[4].split(":")[1] ? $scope.listDetail1[4].split(":")[1].trim() : "";
                $scope.infUser.Residence = $scope.listDetail1[7].split(":")[1] ? $scope.listDetail1[7].split(":")[1].trim() : "";
                $scope.infUser.TemporaryAddress = $scope.listDetail1[8].split(":")[1] ? $scope.listDetail1[8].split(":")[1].trim() : "";

                $scope.infUser.Nation = $scope.Detail1.trim();
                $scope.infUser.Religion = $scope.Detail2.trim();

                $scope.infUser.NowEmployee = $scope.listDetail3.split(":")[1] ? $scope.listDetail3.split(":")[1].trim() : "";

                $scope.infUser.PlaceinGroup = $scope.listDetail4[0];
                $scope.infUser.DateInGroup = $scope.listDetail4[1]//.match(/\d+/g).join('-');

                $scope.infUser.PlaceInParty = $scope.listDetail5[0];
                $scope.infUser.DateInParty = $scope.listDetail5[0]//.split(',')[1]//.match(/\d+/g).join('-');
                $scope.infUser.PlaceRecognize = $scope.listDetail7[0]//.split(',')[0];
                $scope.infUser.DateRecognize = $scope.listDetail7[0]//.split(',')[1]//.match(/\d+/g).join('-');
                $scope.infUser.Presenter = $scope.listDetail5[2]//.trim();

                $scope.infUser.Phone = $scope.listDetail8.split(":")[1] ? $scope.listDetail8.split(":")[1].trim() : "";
                $scope.infUser.PhoneContact = $scope.listDetail9.split(":")[1] ? $scope.listDetail9.split(":")[1].trim() : "";
                console.log($scope.infUser.Phone);
                $scope.infUser.LevelEducation.GeneralEducation = $scope.listDetail6[0].split(":")[1] ? $scope.listDetail6[0].split(":")[1].trim() : "";
                $scope.infUser.LevelEducation.VocationalTraining = $scope.listDetail6[1].split(":")[1] ? $scope.listDetail6[1].split(":")[1].trim() : "";
                $scope.infUser.LevelEducation.Undergraduate = $scope.listDetail6[2].split(":")[1] ? $scope.listDetail6[2].split(":")[1].trim() : "";//.split(',');
                $scope.infUser.LevelEducation.RankAcademic = $scope.listDetail6[3].split(":")[1] ? $scope.listDetail6[3].split(":")[1].trim() : "";
                $scope.infUser.LevelEducation.PoliticalTheory = $scope.listDetail6[4].split(":")[1] ? $scope.listDetail6[4].split(":")[1].trim() : "";//.split(',');

                $scope.infUser.LevelEducation.ForeignLanguage = $scope.listDetail6[5].split(":")[1] ? $scope.listDetail6[5].split(":")[1].trim() : "";
                $scope.infUser.LevelEducation.It = $scope.listDetail6[6].split(":")[1] ? $scope.listDetail6[6].split(":")[1].trim() : "";//.split(',');
                $scope.infUser.LevelEducation.MinorityLanguage = $scope.listDetail6[7].split(":")[1] ? $scope.listDetail6[7].split(":")[1].trim() : "";//.split(',');

                //Nguoi gioi thieu
                $scope.Introducer = {
                    PersonIntroduced: $scope.infUser.Presenter,
                    PlaceTimeJoinUnion: $scope.infUser.PlaceinGroup,
                    PlaceTimeJoinParty: $scope.infUser.PlaceInParty,
                    PlaceTimeRecognize: $scope.infUser.PlaceRecognize
                };
                console.log($scope.infUser);
                var JSONobj = {
                    InformationUser: $scope.infUser,
                    Create: $scope.PlaceCreatedTime,
                    PersonalHistory: $scope.PersonalHistory,
                    BusinessNDuty: $scope.BusinessNDuty,
                    PassedTrainingClasses: $scope.PassedTrainingClasses,
                    GoAboard: $scope.GoAboard,
                    Disciplined: $scope.Disciplined,
                    SelfComment: $scope.SelfComment,
                    Relationship: $scope.Relationship
                }

                console.log($scope.listDetail1[0])
                setTimeout(function () {
                    $scope.$apply();
                }, 100);
            }, 100);
        }
        setTimeout(async function () {
            //  loadDate();
            // initialize Rich Text Editor component
            $scope.defaultRTE = new ej.richtexteditor.RichTextEditor({
                height: '850px'
            });
            // Render initialized Rich Text Editor.
            $scope.defaultRTE.appendTo('#defaultRTE');
            var obj = $scope.defaultRTE.getContent();
            obj.firstChild.contentEditable = 'false'

        }, 50);
    }
});

app.controller('log-status-wf-full', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, dataserviceJoinParty, para) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    }
    $scope.initData = function () {
        $scope.lstStatus = []
        dataserviceJoinParty.GetPartyAdmissionProfileByResumeNumber(para, function (rs) {
            rs = rs.data;
            $scope.lstStatus = JSON.parse(rs.Status);
            console.log($scope.lstStatus);
        });
    }
    $scope.initData();
    setTimeout(function () {
        setModalDraggable(".modal-dialog");
    }, 400);
});

app.directive("choosePosition", function (dataserviceJoinParty) {
    return {
        restrict: "AE",
        require: "ngModel",
        templateUrl: ctxfolderJoinParty + '/Posision.html',
        scope: {
            ngModelCtrl: '=',// Tạo một scope riêng để nhận giá trị ngModelCtrl từ bên ngoài
            provinces: '='
        },
        link: function (scope, element, attrs, ngModelCtrl) {
            console.log(scope.provinces);
            scope.ditrict = [
            ];
            scope.Ward = [
            ]
            // Hàm phân tích ngModelCtrl
            function parseNgModelValue(value) {
                var parts = value.split('_'); // Tách giá trị thành các phần
                var result = {
                    tinh_id: parseInt(parts[0]),
                    huyen_id: parseInt(parts[1]),
                    xaPhuong_id: parseInt(parts[2])
                };
                return result;
            }

            // Hàm cập nhật giá trị ngModelCtrl
            function updateNgModelValue() {
                var value = scope.model.tinh_id + '_' + scope.model.huyen_id + '_' + scope.model.xaPhuong_id;
                ngModelCtrl.$setViewValue(value);
                ngModelCtrl.$render();
                if (parseInt(scope.model.tinh_id) != NaN)
                    dataserviceJoinParty.getDistrictByProvinceId(scope.model.tinh_id, function (rs) {
                        rs = rs.data
                        scope.ditrict = rs;
                        console.log(rs)
                    })
                if (parseInt(scope.model.huyen_id) != NaN)
                    dataserviceJoinParty.getWardByDistrictId(scope.model.huyen_id, function (rs) {
                        rs = rs.data
                        scope.Ward = rs;
                        console.log(rs)
                    })
                console.log(ngModelCtrl.$modelValue)
            }

            // Watchers để theo dõi thay đổi trong giá trị ngModelCtrl
            scope.$watch(function () {
                return ngModelCtrl.$modelValue;
            }, function (newValue) {
                if (newValue) {
                    var parsedValue = parseNgModelValue(newValue);
                    scope.model.tinh_id = parsedValue.tinh_id;
                    scope.model.huyen_id = parsedValue.huyen_id;
                    scope.model.xaPhuong_id = parsedValue.xaPhuong_id;
                }
            });

            // Watchers để theo dõi thay đổi trong các mô hình tinh, huyen và xaPhuong
            scope.$watchGroup(['model.tinh_id', 'model.huyen_id', 'model.xaPhuong_id'], function () {
                updateNgModelValue();
            });

            // Khởi tạo model
            scope.model = {
                tinh_id: '',
                huyen_id: '',
                xaPhuong_id: ''
            };
            // Hàm được gọi khi một mục được chọn
            scope.onItemSelect = function (selected, level) {
                if (level === 'tinh') {
                    scope.model.huyen_id = ''; // Xóa giá trị huyện khi chọn một tỉnh mới
                    scope.model.xaPhuong_id = ''; // Xóa giá trị xã/phường khi chọn một tỉnh mới

                } else if (level === 'huyen') {
                    scope.disableXa = false
                    scope.model.xaPhuong_id = ''; // Xóa giá trị xã/phường khi chọn một huyện mới

                }
            };

        },
    };
});