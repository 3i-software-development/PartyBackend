var ctxfolder = "/views/front-end/user";
var app = angular.module('App_ESEIM', ["ngRoute", 'ui.select', "ngAnimate", "ngSanitize", "ui.bootstrap", "ngValidate"])
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
        GetGroupUser: function (callback) {
            $http.get('/UserProfile/GetGroupUser').then(callback);
        },
        //InsertFamily
        insertFamily: function (data, callback) {
            $http.post('/UserProfile/InsertFamily/', data).then(callback);
        },
        getFamilyByProfileCode: function (data, callback) {
            $http.post('/UserProfile/GetFamilyByProfileCode?profileCode=', data).then(callback);
        },

        updateFamily: function (data, callback) {
            $http.post('/UserProfile/UpdateFamily/', data).then(callback);
        },
        //PartyAdmissionProfile
        getPartyAdmissionProfileByUsername: function (data, callback) {
            $http.get('/UserProfile/GetPartyAdmissionProfileByUsername?Username=' + data).then(callback);
        },


        insert: function (data, callback) {
            $http.post('/UserProfile/InsertPartyAdmissionProfile/', data).then(callback);

        },
        update: function (data, callback) {
            $http.put('/UserProfile/UpdatePartyAdmissionProfile/', data).then(callback);

        },
        deletePartyAdmissionProfile: function (data, callback) {
            $http.delete('/UserProfile/DeletePartyAdmissionProfile?Id=', data).then(callback);
        },
        //PersonalHistory
        getPersonalHistoryByProfileCode: function (data, callback) {
            $http.post('/UserProfile/GetPersonalHistoryByProfileCode?profileCode=', data).then(callback);
        },

        getPersonalHistoryById: function (data, callback) {
            $http.post('/UserProfile/GetPersonalHistoryById?id=', data).then(callback);
        },

        updatePersonalHistories: function (data, callback) {
            $http.post('/UserProfile/UpdatePersonalHistories/', data).then(callback);
        },
        updatePersonalHistory: function (data, callback) {
            $http.post('/UserProfile/UpdatePersonalHistory/', data).then(callback);
        },
        deletePersonalHistory: function (data, callback) {
            $http.delete('/UserProfile/DeletePersonalHistory/', data).then(callback);
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
        getPartyAdmissionProfileByUserCode: function (data, callback) {
            $http.post('"/UserProfile/GetPartyAdmissionProfileByUserCode?Id="', data).then(callback);
        },

        //award 
        getAwardById: function (data, callback) {
            $http.post('/UserProfile/GetAwardById?id=', data).then(callback);
        },
        getAwardByProfileCode: function (data, callback) {
            $http.post('/UserProfile/GetAwardByProfileCode?profileCode=', data).then(callback);
        },
        insertAward: function (data, callback) {
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
        updateIntroducer: function (data, callback) {
            $http.post('/UserProfile/UpdateIntroduceOfParty/', data).then(callback);

        },
        insertPersonalHistory: function (data, callback) {
            $http.post('/UserProfile/InsertPersonalHistory/', data).then(callback);

        },
        insertWarningDisciplined: function (data, callback) {
            $http.post('/UserProfile/InsertWarningDisciplined/', data).then(callback);

        },

        //Đi du lịch
        getGoAboardById: function (data, callback) {
            $http.post('/UserProfile/GetGoAboardById?id=', data).then(callback);
        },
        insertGoAboards: function (data, callback) {
            $http.post('/UserProfile/InsertGoAboard/', data).then(callback);
        },

        insertGoAboard: function (data, callback) {
            $http.post('/UserProfile/InsertGoAboardOnly/', data).then(callback);
        },
        updateGoAboard: function (data, callback) {
            $http.post('/UserProfile/UpdateGoAboard/', data).then(callback);

        },
        //
        getListFile: function (data, callback) {
            $http.get('/UserProfile/GetListProfile?ResumeNumber=' + data).then(callback);
        },
        deleteFile: function (fileName, ResumeNumber, callback) {
            $http.get('/UserProfile/DeleteFile?ResumeNumber=' + ResumeNumber + '&fileName=' + fileName).then(callback);
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

        GetXa: function (data, callback) {
            $http.get('/UserProfile/GetXa?id=' + data).then(callback);
        },
        GetHuyen: function (data, callback) {
            $http.get('/UserProfile/GetHuyen?id=' + data).then(callback);
        },
        GetTinh: function (data, callback) {
            $http.get('/UserProfile/GetTinh?id=' + data).then(callback);
        },
        GetXaName: function (data, callback) {
            $http.get('/UserProfile/GetXaName?name=' + data).then(callback);
        },
        GetHuyenName: function (data, callback) {
            $http.get('/UserProfile/GetHuyenName?name=' + data).then(callback);
        },
        GetTinhName: function (data, callback) {
            $http.get('/UserProfile/GetTinhName?name=' + data).then(callback);
        },

        getWardsName: function (name, DistrictsName, ProvincesName, callback) {
            $http.get('/UserProfile/GetWardsName?name=' + name + '&DistrictsName=' + DistrictsName + '&ProvincesName=' + ProvincesName).then(callback);
        },
        getDistrictsName: function (name, ProvincesName, callback) {
            $http.get('/UserProfile/GetDistrictsName?name=' + name + '&ProvincesName=' + ProvincesName).then(callback);
        },
        GetMemberPartyProfile: function (data, callback) {
            $http.get('/Admin/UserJoinParty/GetMemberPartyProfile?ressumeNumber=' + data).then(callback);
        },
        //Quá trình liền kề
        updatePartyFamilyTime: function (data, callback) {
            $http.put('/Admin/UserJoinParty/UpdatePartyFamilyTime', data).then(callback);
        },
        getPartyFamilyTime: function (resumeCode, relationship, callback) {
            $http.get(`/Admin/UserJoinParty/GetPartyFamilyTime?resumeCode=${resumeCode}&relationship=${relationship}`).then(callback);
        },

    }
});

app.controller('Ctrl_ESEIM', function ($scope, $rootScope, $compile, dataservice) {
    $rootScope.regexDate = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
    $rootScope.regexWorkingProgressStart = /^(T(0?[1-9]|1[0-2])\/\d{4}|năm \d{4}|\d{4})$/;

    $rootScope.$on('$translateChangeSuccess', function () {
        caption = caption[culture];
        $.extend($.validator.messages, {
            min: caption.COM_VALIDATE_VALUE_MIN,
            //max: 'Max some message {0}'
        });
    })
    $rootScope.validationOptions = {
        rules: {
            LastName: {
                required: true,
            },
            Birthday: {
                required: true,
            },
            Sex: {
                required: true,
            },
            Phone: {
                required: true,
            },
            thon_PlaceofBirth: {
                required: true,
            },
            thon_HomeTown: {
                required: true,
            },
            thon_Residence: {
                required: true,
            },
            NowEmployee: {
                required: true,
            },
            Nation: {
                required: true,
            },
            Religion: {
                required: true,
            },
            marriedStatus: {
                required: true,
            },
            FirstName: {
                required: true,
            },
            GeneralEducation: {
                required: true,
            },
            GroupUser: {
                required: true,
            },
            location: {
                required: true,
            },
            decisionDate: {
                required: true,
            },
            decisionNumber: {
                required: true,
            },
            SelfCommentcontext: {
                required: true
            }
            /*    PlaceofBirth: {
                    required: true,
                },*/

        },
        messages: {
            LastName: {
                required: "Bạn phải nhập đầy đủ Họ và tên",
            },
            Birthday: {
                required: "Bạn không được để trống trường ngày sinh"
            },
            Sex: {
                required: "Bạn không được để trống trường giới tính"
            },
            Phone: {
                required: "Bạn không được bỏ trống trường số điện thoại "
            },
            thon_PlaceofBirth: {
                required: "Bạn không được bỏ trống trường nơi sinh"
            },
            thon_HomeTown: {
                required: "Bạn không được bỏ trống trường Quê quán"
            },
            thon_Residence: {
                required: "Bạn không được bỏ trống trường Địa chỉ thường chú "
            },
            NowEmployee: {
                required: "Bạn không được bỏ trống trường Công việc hiện tại"
            },
            Nation: {
                required: "Bạn không được bỏ trống trường Dân tộc"
            },
            Religion: {
                required: "Bạn không được bỏ trống trường Tôn giáo"
            },
            marriedStatus: {
                required: "Bạn không được bỏ trống trường Tình trạng hôn nhân ",
            },
            FirstName: {
                required: "Bạn không được bỏ trống trường họ và tên khai sinh"
            },
            GeneralEducation: {
                required: "Bạn không được bỏ trống trường Giáo dục phổ thông",
            },
            GroupUser: {
                required: "Bạn không được bỏ trống trường nhóm chi bộ"
            },
            location: {
                required: "Bạn không được bỏ trống trường địa điểm ly hôn",
            },
            decisionDate: {
                required: "Bạn không được bỏ trống trường ngày ly hôn",
            },
            decisionNumber: {
                required: "Bạn không được bỏ trống trường số quyết định ly hôn",
            },
            SelfCommentcontext: {
                required: "Bạn không được bỏ trống trường tự nhận xét"
            }
            /*      GroupUser: {
                      required: "Bạn không được để trống",
                  },*/


        }
    }

    $rootScope.validationOptionsFamily = {
        rules: {
            selectedFamilyRelation: {
                required: true,
            },
            selectedFamilyName: {
                required: true,
            },
            selectedFamilyBirthYear: {
                required: true,
            },
            selectedFamilyPoliticalAttitude: {
                required: true,
            },
            selectedFamilyHomeTownVillage: {
                required: true,
            },
            selectedFamilyResidence: {
                required: true,
            },
            selectedFamilyJob: {
                required: true,
            },
            selectedFamilyWorkingProgress: {
                required: true,
            },
            selectedFamilyAddressDie: {
                required: true,
            },
            selectedFamilyReason: {
                required: true,
            },
            selectedFamilyParty: {
                required: true,
            },
            selectedFamilywordAt: {
                required: true,
            },
            selectedFamilyBirthPlace: {
                required: true,
            },
            selectedFamilyBirthDie: {
                required: true,
            },
            selectedFamilyResidence: {
                required: true,
            }

        },
        messages: {
            selectedFamilyRelation: {
                required: "Bạn không được để trống trường này",
            },
            selectedFamilyName: {
                required: "Bạn không được để trống trường này",
            },
            selectedFamilyBirthYear: {
                required: "Bạn không được để trống trường này",
            },
            selectedFamilyPoliticalAttitude: {
                required: "Bạn không được để trống trường này",
            },
            selectedFamilyHomeTownVillage: {
                required: "Bạn không được để trống trường này",
            },
            selectedFamilyResidence: {
                required: "Bạn không được để trống trường này",
            },
            selectedFamilyJob: {
                required: "Bạn không được để trống trường này",
            },
            selectedFamilyWorkingProgress: {
                required: "Bạn không được để trống trường này",
            },
            selectedFamilyAddressDie: {
                required: "Bạn không được để trống trường này",
            },
            selectedFamilyReason: {
                required: "Bạn không được để trống trường này",
            },
            selectedFamilyParty: {
                required: "Bạn không được để trống trường này",
            },
            selectedFamilywordAt: {
                required: "Bạn không được để trống trường này",
            },
            selectedFamilyBirthPlace: {
                required: "Bạn không được để trống trường này",
            },
            selectedFamilyBirthDie: {
                required: "Bạn không được để trống trường này",
            },
            selectedFamilyResidence: {
                required: "Bạn không được để trống trường này",
            }
        }
    }

    $rootScope.validationOptionsPersonalHistory = {
        rules: {
            selectedPersonHistoryBegin: {
                required: true,
            },
            selectedPersonHistoryEnd: {
                required: true,
            },
            selectedPersonHistoryContent: {
                required: true,
            }

        },
        messages: {
            selectedPersonHistoryBegin: {
                required: "Bạn không được để trống trường này",
            },
            selectedPersonHistoryEnd: {
                required: "Bạn không được để trống trường này",
            },
            selectedPersonHistoryContent: {
                required: "Bạn không được để trống trường này",
            }
        }
    }

    $rootScope.validationOptionBusinessNDuty = {
        rules: {
            selectedWorkingTrackingFrom: {
                required: true,
            },
            selectedWorkingTrackingTo: {
                required: true,
            },
            selectedWorkingTrackingWork: {
                required: true,
            },
            selectedWorkingTrackingRole: {
                required: true,
            }

        },
        messages: {
            selectedWorkingTrackingFrom: {
                required: "Bạn không được để trống trường này",
            },
            selectedWorkingTrackingTo: {
                required: "Bạn không được để trống trường này",
            },
            selectedWorkingTrackingWork: {
                required: "Bạn không được để trống trường này",
            },
            selectedWorkingTrackingRole: {
                required: "Bạn không được để trống trường này",
            }
        }
    }

    $rootScope.validationOptionsHistorySpecialist = {
        rules: {
            selectedHistorySpecialistMonthYear: {
                required: true,
            },
            selectedHistorySpecialistContent: {
                required: true,
            }

        },
        messages: {
            selectedHistorySpecialistMonthYear: {
                required: "Bạn không được để trống trường này",
            },
            selectedHistorySpecialistContent: {
                required: "Bạn không được để trống trường này",
            }
        }
    }


    $rootScope.validationOptionsAward = {
        rules: {
            selectedLaudatoryMonthYear: {
                required: true,
            },
            selectedLaudatoryGrantOfDecision: {
                required: true,
            },
            selectedLaudatoryReason: {
                required: true,
            }

        },
        messages: {
            selectedLaudatoryMonthYear: {
                required: "Bạn không được để trống trường này",
            },
            selectedLaudatoryGrantOfDecision: {
                required: "Bạn không được để trống trường này",
            },
            selectedLaudatoryReason: {
                required: "Bạn không được để trống trường này",
            }
        }
    }


    $rootScope.validationOptionsDisciplined = {
        rules: {
            selectedWarningDisciplinedMonthYear: {
                required: true,
            },
            selectedWarningDisciplinedGrantOfDecision: {
                required: true,
            },
            selectedWarningDisciplinedReason: {
                required: true,
            }

        },
        messages: {
            selectedWarningDisciplinedMonthYear: {
                required: "Bạn không được để trống trường này",
            },
            selectedWarningDisciplinedGrantOfDecision: {
                required: "Bạn không được để trống trường này",
            },
            selectedWarningDisciplinedReason: {
                required: "Bạn không được để trống trường này",
            }
        }
    }


    $rootScope.validationOptionsCertificatedPass = {
        rules: {
            selectedTrainingCertificatedPassFrom: {
                required: true,
            },
            selectedTrainingCertificatedPassTo: {
                required: true,
            },
            selectedTrainingCertificatedPassSchoolName: {
                required: true,
            },
            selectedTrainingCertificatedPassClass: {
                required: true,
            },
            selectedTrainingCertificatedPassCertificate: {
                required: true,
            }
        },
        messages: {
            selectedTrainingCertificatedPassFrom: {
                required: "Bạn không được để trống trường này",
            },
            selectedTrainingCertificatedPassTo: {
                required: "Bạn không được để trống trường này",
            },
            selectedTrainingCertificatedPassSchoolName: {
                required: "Bạn không được để trống trường này",
            },
            selectedTrainingCertificatedPassClass: {
                required: "Bạn không được để trống trường này",
            },
            selectedTrainingCertificatedPassCertificate: {
                required: "Bạn không được để trống trường này",
            }
        }
    }


    $rootScope.validationOptionsGoAboard = {
        rules: {
            selectedGoAboardFrom: {
                required: true,
            },
            selectedGoAboardTo: {
                required: true,
            },
            selectedGoAboardContact: {
                required: true,
            },
            selectedGoAboardCountry: {
                required: true,
            }
        },
        messages: {
            selectedGoAboardFrom: {
                required: "Bạn không được để trống trường này",
            },
            selectedGoAboardTo: {
                required: "Bạn không được để trống trường này",
            },
            selectedGoAboardContact: {
                required: "Bạn không được để trống trường này",
            },
            selectedGoAboardCountry: {
                required: "Bạn không được để trống trường này",
            }
        }
    }
    $rootScope.validationOptionsIntroducer = {
        rules: {
            IntroducerPersonIntroduced: {
                required: true,
            },
            IntroducerPlaceTimeJoinUnion: {
                required: true,
            },
            IntroducerPlaceTimeRecognize: {
                required: true,
            },
            IntroducerPlaceTimeJoinParty: {
                required: true,
            }
        },
        messages: {
            IntroducerPersonIntroduced: {
                required: "Bạn không được để trống trường này",
            },
            IntroducerPlaceTimeJoinUnion: {
                required: "Bạn không được để trống trường này",
            },
            IntroducerPlaceTimeRecognize: {
                required: "Bạn không được để trống trường này",
            },
            IntroducerPlaceTimeJoinParty: {
                required: "Bạn không được để trống trường này",
            }
        }
    }

});

app.config(function ($routeProvider, $locationProvider, $validatorProvider) {
    $routeProvider
        .when('/', {
            templateUrl: ctxfolder + '/index.html',
            controller: 'index'
        })
        .when('/err', {
            templateUrl: ctxfolder + '/index.html',
            controller: 'err'
        })
    $validatorProvider.setDefaults({
        errorElement: 'p',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            if (element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else if (element.prop('type') === 'radio' && element.parent('.radio-inline').length) {
                error.insertAfter(element.parent().parent());
            } else if (element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
                error.appendTo(element.parent().parent());
            } else {
                error.insertAfter(element.closest('.form-control'));

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
    $validatorProvider.addMethod("date", function (value, element) {
        const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
        return this.optional(element) || regex.test(value?.toString() ?? "");
    }, "Vui lòng nhập theo định dạng dd/MM/yyyy, ví dụ: 02/10/1996.");

    $validatorProvider.addMethod("year", function (value, element) {
        const regex = /^\d+$/;
        return this.optional(element) || regex.test(value?.toString() ?? "") || value?.toLowerCase() === 'không nhớ';
    }, "Vui lòng nhập năm hoặc không nhớ, ví dụ: 1967");

    $validatorProvider.addMethod("monthOrDate", function (value, element) {
        // Regular expressions to match "M/YYYY" and "D/M/YYYY" formats
        const regexMonthYear = /^(0?[1-9]|1[0-2])\/\d{4}$/;
        const regexDayMonthYear = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;

        return this.optional(element) || regexMonthYear.test(value) || regexDayMonthYear.test(value);
    }, "Vui lòng nhập định dạng ngày hợp lệ, ví dụ: 8/2006 hoặc 20/9/2006");


    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    $validatorProvider.addMethod("validateDateNow", function (value, element) {
        const rsTime = value.split("/").map(Number);
        if (rsTime.length == 2) {
            if (rsTime[1] > currentYear || (rsTime[1] === currentYear && rsTime[0] > currentMonth)) {
                return false;
            }
        } else if (rsTime.length == 3) {
            if (rsTime[1] < 1 || rsTime[1] > 12) {
                return false;
            }
            if (rsTime[0] < 1 || rsTime[0] > 31) {
                return false;
            }
            if (rsTime[2] > currentYear ||
                (rsTime[2] === currentYear && rsTime[1] > currentMonth) ||
                (rsTime[2] === currentYear && rsTime[1] === currentMonth && rsTime[0] > currentDay)) {
                return false;
            }
        }

        return true;
    }, "Thời gian không được lớn hơn thời gian hiện tại");

    // $validatorProvider.addMethod("regexWorkingProgressEnd", function (value, element) {
    //     // Regular expressions to match "T1/2012", "năm 2012", and "2012" formats
    //     const regex = /^(T(0?[1-9]|1[0-2])\/\d{4}|năm \d{4}|\d{4})$/;
    //     if (!regex.test(value)) {
    //         return false;
    //     }
    //     // Extracting the year, month, and day
    //     const currentDate = new Date();
    //     const currentYear = currentDate.getFullYear();
    //     const currentMonth = currentDate.getMonth() + 1; // Months are 0-based

    //     let year, month = 0;

    //     if (value.startsWith('T')) {
    //         // Case "T1/2012"
    //         [month, year] = value.substring(1).split('/').map(Number);
    //     } else if (value.startsWith('năm ')) {
    //         // Case "năm 2012"
    //         year = parseInt(value.split(' ')[1], 10);
    //     } else {
    //         // Case "2012"
    //         year = parseInt(value, 10);
    //     }

    //     if (year > currentYear) {
    //         return false;
    //     }
    //     if (year === currentYear && month > currentMonth) {
    //         return false;
    //     }

    //     return true;
    // }, "Thời gian của bạn không được lớn hơn thời gian hiện tại");

});
app.directive("voiceRecognition", function () {
    return {
        restrict: "AE",
        require: "ngModel",
        link: function (scope, element, attrs, ngModelCtrl) {
            console.log(ngModelCtrl);
            if ("webkitSpeechRecognition" in window) {
                var spokenText = "";

                var recognition = new webkitSpeechRecognition();
                recognition.lang = "vi-VN";
                recognition.continuous = false;
                recognition.interimResults = false;

                recognition.onstart = function () { };

                recognition.onend = function () {
                    console.log("Spoken text:", spokenText);
                };

                recognition.onresult = function (event) {
                    var transcript = event.results[0][0].transcript;
                    spokenText = transcript;
                    if (spokenText != "") {
                        ngModelCtrl.$setViewValue(transcript);

                        ngModelCtrl.$render();
                        // Cập nhật giá trị trong ng-model
                        console.log(ngModelCtrl);
                    }
                };

                element.on("pointerdown", function (event) {
                    event.preventDefault();
                    scope.startRecognition(recognition);
                    element.css("color", "red");
                });

                element.on("mouseup", function () {
                    scope.stopRecognition(recognition);
                    element.css("color", "");
                });
                element.on("pointerout", function (event) {
                    event.preventDefault();
                    scope.stopRecognition(recognition);
                    element.css("color", "");
                });
                element.on("contextmenu", function (event) {
                    event.preventDefault();
                });
            }

            scope.startRecognition = function (recognition) {
                if (recognition) {
                    recognition.start();
                }
            };

            scope.stopRecognition = function (recognition) {
                if (recognition) {
                    recognition.stop();
                }
            };
        },
    };
});
app.controller('index', function ($scope, $rootScope, $compile, dataservice, $filter, $http) {
    console.log("indeeeeee");

    $scope.GroupUsers = [];
    $scope.getGroupUsers = function () {
        dataservice.GetGroupUser(function (rs) {
            console.log(rs)
            $scope.GroupUsers = rs.data;
        })
        $http.get('/Admin/GuilineManager/GetGuidelines/').then(function (response) {
            $scope.jsonParse = response.data; // Gán dữ liệu từ tệp JSON vào biến $scope.jsonParse

        }).catch(function (error) {
            console.error('Lỗi khi tải dữ liệu JSON');
        });
    }
    $scope.onItemSelect = function (item) {
        $scope.GroupUser = item.Code;
    }
    $scope.getGroupUsers();


    $scope.$watch('Voice', function (newValue, oldValue) {
        //nếu có sự thay đổi thì dựa vào $scope.input để thêm 
    });

    //
    //
    //
    //Autocomplete
    $scope.itemEmployees = ['Kinh doanh quần áo', 'Kinh doanh thực phẩm', 'Kinh doanh thiết bị máy móc', 'Làm việc ở ngân hàng', 'Grapes', 'Pineapple'];
    $scope.itemReligions = ['Không', 'Thiên Chúa giáo', 'Hồi giáo', 'Ấn Độ giáo', 'Do Thái giáo', 'Phật giáo', 'Đạo Cao Đài', 'Đạo Hoà Hảo']
    $scope.filteredItems = [];
    //Autocomplete công việc
    $scope.filterItems = function () {
        $scope.filteredItems = $scope.itemEmployees.filter(function (item) {
            return item.toLowerCase().includes($scope.infUser.NowEmployee.toLowerCase());
        });
    };

    $scope.selectItem = function (item) {
        $scope.infUser.NowEmployee = item;
        $scope.filteredItems = [];
    };

    $('body').on('click', function (event) {
        // Nếu click vào ô input, trả về ngay
        if ($(event.target).is('input[type="text"]')) {
            return;
        }

        // Kiểm tra xem phần tử được click có là con của ul.autocomplete-list hay không
        if (!$(event.target).closest('ul.autocomplete-list').length) {
            // Xử lý sự kiện click ở đây cho các phần tử không phải là con của ul.autocomplete-list

            $scope.filteredItemReligions = [];
            $scope.FilterGender = [];
            $scope.filteredItems = [];
            $scope.FilterNation = [];
            $scope.FilterGeneralEducation = [];
            $scope.filterMarriedStatus = []
            $scope.FilterUndergraduate = [];
            $scope.FilterRankAcademic = [];
            $scope.FilterForeignLanguage = [];
            $scope.FilterMinorityLanguage = [];
            $scope.FilterPoliticalTheory = [];
            $scope.FilterIt = [];
            $scope.Filterplace = [];
            $scope.FilterRelation = [];
            $scope.FilterCountry = [];
            $scope.$digest();
        }

    });
    //Autocomplete tôn giáo
    $scope.filteredItemReligions = [];
    $scope.filterItemReligions = function () {
        $scope.filteredItemReligions = $scope.itemReligions.filter(function (item) {
            return item.toLowerCase().includes($scope.infUser.Religion.toLowerCase());
        });
    };

    $scope.selectItemReligion = function (item) {
        $scope.infUser.Religion = item;
        $scope.filteredItemReligions = [];
    };

    $scope.Gender = ['Nam', 'Nữ', 'Khác'];
    $scope.itemEmployees = [
        'Bác sĩ', 'Luật sư', 'Giáo viên', 'Kỹ sư', 'Nhân viên kinh doanh', 'Quản lý dự án', 'Nhân viên bán hàng', 'Chuyên viên tài chính', 'Kỹ thuật viên IT', 'Nhân viên marketing', 'Nhà hàng khách sạn', 'Thợ xây', 'Nghệ sĩ/ nghệ nhân', 'Nhân viên quản lý nhân sự', 'Chuyên viên tư vấn', 'Nhân viên kế toán', 'Y tá/ điều dưỡng',
        'Chuyên viên tài sản', 'Nhân viên chăm sóc khách hàng', 'Nhân viên sản xuất/ vận hành máy', 'Nhà thiết kế đồ họa', 'Nhân viên văn phòng', 'Nhà khoa học dữ liệu', 'Chuyên viên bảo mật mạng', 'Nhà hàng trưởng', 'Nhân viên dịch vụ khách hàng', 'Công an', 'Nhà xuất bản/ biên tập viên', 'Nhà đào tạo/ huấn luyện viên', 'Nhân viên quản lý sản xuất'];
    $scope.itemReligions = ['Không', 'Thiên Chúa giáo', 'Hồi giáo', 'Ấn Độ giáo', 'Do Thái giáo', 'Phật giáo', 'Đạo Cao Đài', 'Đạo Hoà Hảo'];
    $scope.Nation = ['Kinh', 'Tày', 'Thái', 'Mường', 'HMông', 'Dao', 'Khơ Me', 'Nùng', 'Hoa', 'Gia Rai', 'Ê Đê', 'Ba Na', 'Xơ Đăng', 'Sán Chay', 'Cơ Tu', 'Chăm', 'Sán Dìu', 'Cống', 'Bố Y', 'Giáy', 'Lào', 'Sán Rìu', 'Hrê', 'MNông', 'XTiêng', 'Bru-Vân Kiều', 'Thổ', 'Gié-Triêng', 'Co Lao', 'Tà Ôi', 'Mạ', 'Hà Nhì', 'Chơ Ro', 'La Chí', 'Phù Lá', 'La Ha', 'La Hủ', 'Lự', 'Lô Lô', 'Chứt', 'Mảng', 'Pà Thẻn', 'Cờ Lao', 'Bốn', 'Cống', 'Si La', 'Pu Péo', 'Rơ Măm', 'La Hu', 'Kháng', 'Ô Đu', 'Sách', 'Lô Lô Chóe', 'Chứt'];
    $scope.ForeignLanguage = [
        'Không', 'TOEIC - 0 đến 150', 'TOEIC - 150 đến 300', 'TOEIC - 300 đến 450', 'TOEIC - 450 đến 600', 'TOEIC - 600 đến 750', 'TOEIC - 750 đến 900', 'IELTS - Dưới 4.0', 'IELTS - 4.0 đến 4.5', 'IELTS - 4.5 đến 5.0', 'IELTS - 5.0 đến 5.5', 'IELTS - 5.5 đến 6.0', 'IELTS - 6.0 đến 6.5', 'IELTS - 6.5 đến 7.0', 'IELTS - 7.0 đến 7.5', 'IELTS - 7.5 đến 8.0', 'IELTS - 8.0 đến 8.5', 'IELTS - 8.5 đến 9.0', 'Tiếng Nhật - N1', 'Tiếng Nhật - N2', 'Tiếng Nhật - N3', 'Tiếng Nhật - N4', 'Tiếng Nhật - N5', 'Tiếng Trung - HSK 1', 'Tiếng Trung - HSK 2', 'Tiếng Trung - HSK 3', 'Tiếng Trung - HSK 4', 'Tiếng Trung - HSK 5', 'Tiếng Trung - HSK 6',
        'Tiếng Đức - Goethe-Zertifikat A1', 'Tiếng Đức - Goethe-Zertifikat A2', 'Tiếng Đức - Goethe-Zertifikat B1', 'Tiếng Đức - Goethe-Zertifikat B2', 'Tiếng Đức - Goethe-Zertifikat C1', 'Tiếng Đức - Goethe-Zertifikat C2', 'Tiếng Pháp - DELF A1', 'Tiếng Pháp - DELF A2', 'Tiếng Pháp - DELF B1', 'Tiếng Pháp - DELF B2', 'Tiếng Pháp - DALF C1', 'Tiếng Pháp - DALF C2', 'Tiếng Tây Ban Nha - DELE A1', 'Tiếng Tây Ban Nha - DELE A2', 'Tiếng Tây Ban Nha - DELE B1', 'Tiếng Tây Ban Nha - DELE B2', 'Tiếng Tây Ban Nha - DELE C1', 'Tiếng Tây Ban Nha - DELE C2', 'Tiếng Ý - CELI A1', 'Tiếng Ý - CELI A2', 'Tiếng Ý - CELI 1', 'Tiếng Ý - CELI 2', 'Tiếng Ý - CELI 3', 'Tiếng Ý - CELI 4', 'Tiếng Ý - CELI 5',
        'Tiếng Hàn - TOPIK 1', 'Tiếng Hàn - TOPIK 2', 'Tiếng Hàn - TOPIK 3', 'Tiếng Hàn - TOPIK 4', 'Tiếng Hàn - TOPIK 5', 'Tiếng Hàn - TOPIK 6', 'Tiếng Nga - ТРКИ 1', 'Tiếng Nga - ТРКИ 2', 'Tiếng Nga - ТРКИ 3', 'Tiếng Nga - ТРКИ 4', 'Tiếng Nga - ТРКИ 5'
    ];
    $scope.Undergraduate = [
        "Đại học Quốc gia Hà Nội",
        "Đại học Quốc gia TP.Hồ Chí Minh",
        "Đại học Bách khoa Hà Nội",
        "Đại học Khoa học Xã hội và Nhân văn TP.Hồ Chí Minh",
        "Đại học Ngoại thương",
        "Đại học Y Hà Nội",
        "Đại học Sư phạm Hà Nội",
        "Đại học Công nghệ",
        "Đại học Nông nghiệp",
        "Đại học Tôn Đức Thắng",
        "Đại học Sư phạm TP.Hồ Chí Minh",
        "Đại học Tài chính - Marketing",
        "Đại học Y dược TP.Hồ Chí Minh",
        "Đại học Mở TP.Hồ Chí Minh",
        "Đại học Giao thông Vận tải",
        "Cao đẳng Công nghệ Thủ Đức",
        "Cao đẳng Kinh tế - Công nghệ Hà Nội",
        "Cao đẳng Sư phạm Đà Nẵng",
        "Cao đẳng Kỹ thuật Công nghệ Cần Thơ",
        "Cao đẳng Công nghệ Thông tin TP.Hồ Chí Minh",
        "Cao đẳng Sư phạm TP.Hồ Chí Minh",
        "Cao đẳng Y dược Huế",
        "Cao đẳng Nghệ thuật Hà Nội",
        "Cao đẳng Thương mại và Du lịch Hà Nội",
        "RMIT University Việt Nam",
        "British University Vietnam",
        "University of London - Royal Holloway",
        "Troy University",
        "Fulbright University Vietnam",
        "Vietnam National University - International School",
        "Hanoi University of Science and Technology - School of International Education",
        "Hoa Sen University - International School",
        "Foreign Trade University - International School",
        "University of Science - Vietnam National University, HCMC - International School"
    ];
    $scope.RankAcademic = [
        "Không",
        "Cử nhân",
        "Thạc sĩ",
        "Tiến sĩ",
        "Cử nhân cao học",
        "Thạc sĩ chuyên sâu",
        "Chứng chỉ chuyên ngành",
        "Cử nhân khoa học",
        "Cử nhân xã hội",
        "Phó giáo sư",
        "Giáo sư"
    ];
    $scope.PoliticalTheory = ["Không", "Cao cấp lý luận chính trị", "Trung cấp lý luận chính trị", "Sơ cấp lý luận chính trị"];
    $scope.It = ["Không", "Chứng chỉ CNTT cơ bản", "Chứng chỉ CNTT cao cấp", "chứng chỉ tin học MOS", "Chứng chỉ tin học IC3"];
    $scope.place = ["An Giang", "Bà Rịa - Vũng Tàu", "Bạc Liêu", "Bắc Giang", "Bắc Kạn", "Bắc Ninh",
        "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau",
        "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai",
        "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương",
        "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang",
        "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
        "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình",
        "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La",
        "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế",
        "Tiền Giang", "TP. Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long",
        "Vĩnh Phúc", "Yên Bái"];

    $scope.MinorityLanguage = ["Không", "Tiếng Tày", "Tiếng Nùng", "Tiếng Mông", "Tiếng Dao", "Tiếng H'Mông", "Tiếng Khơ Mú", "Tiếng Xơ Đăng", "Tiếng Chăm", "Tiếng Bru-Vân Kiều", "Tiếng Ê Đê", "Tiếng Sán Dìu", "Tiếng Hrê", "Tiếng Co Tu", "Tiếng Ra Glai", "Tiếng Xtiêng", "Tiếng Giáy", "Tiếng Cơ Ho", "Tiếng M'Nông", "Tiếng Thổ", "Tiếng Chơ Ro", "Tiếng Hà Nhì", "Tiếng La Hu", "Tiếng Ô Đu", "Tiếng X'áng", "Tiếng Kháng",
        "Tiếng Cống", "Tiếng Si La", "Tiếng Chứt", "Tiếng Hà Lang", "Tiếng Xinh Mun", "Tiếng Maa", "Tiếng Sơ Rục", "Tiếng Hơ Lô", "Tiếng Mảng", "Tiếng Ơ Đu", "Tiếng Hà Nhì", "Tiếng Jơ Lơng", "Tiếng Bố Y", "Tiếng Lự", "Tiếng Sán Chay", "Tiếng Sán Dìu", "Tiếng Hán Nôm", "Tiếng Hoa", "Tiếng Khmer", "Tiếng Bahnar", "Tiếng Jrai", "Tiếng Raglai", "Tiếng Bru", "Tiếng Hre", "Tiếng Mnong", "Tiếng Chru", "Tiếng Halang", "Tiếng Pu Peo",
        "Tiếng Pà Thẻn", "Tiếng Arem", "Tiếng Xinh Mun", "Tiếng Puoc", "Tiếng Ta Oi", "Tiếng Pa Then", "Tiếng Tày Thanh"];
    $scope.GeneralEducation = ["Không", "10/10", "12/12", "9/12"];

    $scope.Relation = ["Ông nội", "Bà nội", "Bà ngoại", "Ông ngoại", "Bố đẻ", "Mẹ đẻ", "Em trai", "Vợ (Chồng)", "Con trai", "Con gái", "Ông nội vợ (Chồng)", "Bà nội vợ (Chồng)", "Ông ngoại vợ (chồng)",
        "Bà ngoại vợ (chồng)", "Bố vợ (chồng)", "Mẹ vợ (chồng)", "Em trai vợ (chồng)"];

    $scope.Country = ["Afghanistan", "Albania",
        "Algeria", "Andorra", "Angola", "Antigua và Barbuda", "Argentina", "Armenia", "Úc", "Áo", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Bỉ", "Belize", "Bénin", "Bhutan", "Bolivia", "Bosnia và Herzegovina", "Botswana", "Brasil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Campuchia", "Cameroon", "Canada",
        "Cộng hòa Trung Phi", "Chad", "Chile", "Trung Quốc", "Colombia", "Comoros", "Cộng hòa Congo", "Cộng hòa Dân chủ Congo", "Costa Rica", "Croatia", "Cuba", "Síp", "Cộng hòa Séc", "Đan Mạch", "Djibouti", "Dominica", "Cộng hòa Dominica", "Đông Timor", "Ecuador", "Ai Cập", "El Salvador", "Guinea Xích Đạo", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Phần Lan", "Pháp", "Gabon", "Gambia", "Georgia", "Đức", "Ghana", "Hy Lạp", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "Ấn Độ", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Ý", "Jamaica", "Nhật Bản", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Triều Tiên", "Hàn Quốc", "Kosovo",
        "Kuwait", "Kyrgyzstan", "Lào", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Quần đảo Marshall", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
        "Morocco", "Mozambique", "Myanmar (Miến Điện)", "Namibia", "Nauru", "Nepal", "Hà Lan", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Na Uy", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Ba Lan", "Bồ Đào Nha", "Qatar", "Romania", "Nga", "Rwanda", "Saint Kitts và Nevis", "Saint Lucia", "Saint Vincent và Grenadines", "Samoa", "San Marino", "Sao Tome và Principe",
        "Ả Rập Saudi", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Quần đảo Solomon", "Somalia", "Nam Phi", "Nam Sudan", "Tây Ban Nha", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Thụy Điển", "Thụy Sĩ", "Syria", "Tajikistan", "Tanzania", "Thái Lan", "Đông Timor", "Togo", "Tonga", "Trinidad và Tobago", "Tunisia", "Thổ Nhĩ Kỳ", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
        "Các Tiểu vương quốc Ả Rập Thống nhất", "Vương quốc Anh", "Hoa Kỳ", "Uruguay", "Uzbekistan", "Vanuatu", "Thành Vatican", "Venezuela", "Việt Nam", "Yemen", "Zambia", "Zimbabwe"];
    // ===================================
    $scope.filteredItems = [];
    //Autocomplete công việc
    $scope.filterItems = function () {
        $scope.filteredItems = $scope.itemEmployees.filter(function (item) {
            return item.toLowerCase().includes($scope.infUser.NowEmployee.toLowerCase());
        });
    };

    $scope.selectItem = function (item) {
        $scope.infUser.NowEmployee = item;
        $scope.filteredItems = [];
    };
    //Autocomplete tôn giáo
    $scope.filteredItemReligions = [];
    $scope.filterItemReligions = function () {
        $scope.filteredItemReligions = $scope.itemReligions.filter(function (item) {
            return item.toLowerCase().includes($scope.infUser.Religion.toLowerCase());
        });
    };

    $scope.selectItemReligion = function (item) {
        $scope.infUser.Religion = item;
        $scope.filteredItemReligions = [];
    };
    //Autocomplete dân tộc
    $scope.FilterNation = [];
    $scope.filterNation = function () {
        // Dân tộc
        $scope.FilterNation = $scope.Nation.filter(function (item) {
            return item.toLowerCase().includes($scope.infUser.Nation.toLowerCase());
        });
    };
    $scope.SelectNation = function (item) {
        $scope.infUser.Nation = item;
        $scope.FilterNation = [];

    };
    //Autocomplete ngoại ngữ
    $scope.FilterForeignLanguage = [];
    $scope.filterForeignLanguage = function () {
        // Ngoại ngữ
        $scope.FilterForeignLanguage = $scope.ForeignLanguage.filter(function (item) {
            return item.toLowerCase().includes($scope.infUser.LevelEducation.ForeignLanguage.toLowerCase());
        });
    };
    $scope.SelectForeignLanguage = function (item) {
        $scope.infUser.LevelEducation.ForeignLanguage = item;
        $scope.FilterForeignLanguage = [];

    };

    //Autocomplete giáo dục  đại học
    $scope.FilterUndergraduate = [];
    $scope.filterUndergraduate = function () {
        // đại học - cao đẳng
        $scope.FilterUndergraduate = $scope.Undergraduate.filter(function (item) {
            return item.toLowerCase().includes($scope.infUser.LevelEducation.Undergraduate.toLowerCase());
        });
    };
    $scope.SelectUndergraduate = function (item) {
        $scope.infUser.LevelEducation.Undergraduate = item;
        $scope.FilterUndergraduate = [];

    };

    //Autocomplete giới tính
    $scope.FilterGender = [];

    $scope.filterSex = function () {
        // giới tính
        $scope.FilterGender = $scope.Gender.filter(function (item) {
            return item.toLowerCase().includes($scope.infUser.Sex.toLowerCase());
        });
    };

    $scope.SelectSex = function (item) {
        $scope.infUser.Sex = item;
        $scope.FilterGender = [];

    };
    //Autocomplete hàm học
    $scope.FilterRankAcademic = [];
    $scope.filterRankAcademic = function () {
        // hàm học
        $scope.FilterRankAcademic = $scope.RankAcademic.filter(function (item) {
            return item.toLowerCase().includes($scope.infUser.LevelEducation.RankAcademic.toLowerCase());
        });
    };
    $scope.SelectRankAcademic = function (item) {
        $scope.infUser.LevelEducation.RankAcademic = item;
        $scope.FilterRankAcademic = [];

    };

    //Autocomplete lý luận chính trị
    $scope.FilterPoliticalTheory = [];
    $scope.filterPoliticalTheory = function () {
        // lý luận chính trị
        $scope.FilterPoliticalTheory = $scope.PoliticalTheory.filter(function (item) {
            return item.toLowerCase().includes($scope.infUser.LevelEducation.PoliticalTheory.toLowerCase());
        });
    };
    $scope.SelectPoliticalTheory = function (item) {
        $scope.infUser.LevelEducation.PoliticalTheory = item;
        $scope.FilterPoliticalTheory = [];

    };
    //Autocomplete tin học
    $scope.FilterIt = [];
    $scope.filterIt = function () {
        // lý luận chính trị
        $scope.FilterIt = $scope.It.filter(function (item) {
            return item.toLowerCase().includes($scope.infUser.LevelEducation.It.toLowerCase());
        });
    };
    $scope.SelectIt = function (item) {
        $scope.infUser.LevelEducation.It = item;
        $scope.FilterIt = [];

    };

    //Autocomplete nơi tạo
    $scope.Filterplace = [];

    $scope.filterplace = function () {
        if ($rootScope.regexDate.test($scope.placeAddress)) {
            $scope.placeAddress = convertDateFormat($scope.placeAddress);
        }
        // giới tính
        $scope.Filterplace = $scope.place.filter(function (item) {
            return item.toLowerCase().includes($scope.PlaceCreatedTime.place.toLowerCase());
        });
    };

    $scope.Selectplace = function (item) {
        $scope.PlaceCreatedTime.place = item;
        $scope.Filterplace = [];

    };
    //Autocomplete tiếng dân tộc thiểu số
    $scope.FilterMinorityLanguage = [];
    $scope.filterMinorityLanguage = function () {
        //tiếng dân tộc thiểu số
        $scope.FilterMinorityLanguage = $scope.MinorityLanguage.filter(function (item) {
            return item.toLowerCase().includes($scope.infUser.LevelEducation.MinorityLanguage.toLowerCase());
        });
    };
    $scope.SelectMinorityLanguage = function (item) {
        $scope.infUser.LevelEducation.MinorityLanguage = item;
        $scope.FilterMinorityLanguage = [];
    };
    //Autocomplete giáo dục phổ thông
    $scope.FilterGeneralEducation = [];
    $scope.filterGeneralEducation = function () {
        // phổ thông
        $scope.FilterGeneralEducation = $scope.GeneralEducation.filter(function (item) {
            return item.toLowerCase().includes($scope.infUser.LevelEducation.GeneralEducation.toLowerCase());
        });
    };
    $scope.SelectGeneralEducation = function (item) {
        $scope.infUser.LevelEducation.GeneralEducation = item;
        $scope.FilterGeneralEducation = [];

    };

    $scope.filterMarriedStatus = []
    $scope.selectedMarriedStatus = ""
    $scope.filterMarriedStatus = function () {
        $scope.infUser.MaritalStatus.decisionNumber
        $scope.infUser.MaritalStatus.decisionDate
        $scope.infUser.MaritalStatus.location

        $scope.filterMarriedStatus = $scope.marriedStatus.filter(function (item) {
            return item.toLowerCase().includes($scope.infUser.MaritalStatus.marriedStatus.toLowerCase());
        });
    }
    //Autocomplete quan hệ
    $scope.FilterRelation = [];

    $scope.filterRelation = function () {
        //tiếng dân tộc thiểu số 
        if ($scope.selectedFamily && $scope.selectedFamily.Relation) {
            $scope.FilterRelation = $scope.Relation.filter(function (item) {
                return item.toLowerCase().includes($scope.selectedFamily.Relation.toLowerCase());
            });

            $scope.biologicalParents = ["bố đẻ", "mẹ đẻ", "bố ruột", "mẹ ruột", "bố", "mẹ", "bố vợ", "mẹ vợ", "bố chồng", "mẹ chồng"];
            if ($scope.biologicalParents.includes($scope.selectedFamily.Relation.toLowerCase())) {
                $scope.changedisHistory = true

            } else {
                $scope.changedisHistory = false
            }


            $scope.biologicalParents = ["vợ", "chồng"];
            if ($scope.biologicalParents.includes($scope.selectedFamily.Relation.toLowerCase())) {
                $scope.changedisHistoryVC = true

            } else {
                $scope.changedisHistoryVC = false
            }


            if ($scope.selectedFamily.Relation.toLowerCase().includes("con")) {
                $scope.changedisHistoryCC = false;
            } else {
                $scope.changedisHistoryCC = true;
            }
        }
        $scope.changeBirthYear();
    };
    $scope.SelectRelation = function (item) {
        $scope.selectedFamily.Relation = item;
        $scope.FilterRelation = [];
    };
    //Autocomplete nước ngoài
    $scope.FilterCountry = [];
    $scope.filterCountry = function () {
        //tiếng dân tộc thiểu số
        $scope.FilterCountry = $scope.Country.filter(function (item) {
            return item.toLowerCase().includes($scope.selectedGoAboard.Country.toLowerCase());
        });
    };
    $scope.SelectCountry = function (item) {
        $scope.selectedGoAboard.Country = item;
        $scope.FilterCountry = [];
    };

    $('.fa-info-circle').click(function () {
        var id = $(this).attr('id');
        $scope.handleClick(id);
        $scope.$apply(); // Cần sử dụng $apply() để cập nhật scope
    });
    $scope.handleClick = function (id) {
        // Kiểm tra nếu $scope.jsonParse không phải là một mảng
        if (!Array.isArray($scope.jsonParse)) {
            // Nếu không phải mảng, gán $scope.jsonParse thành một mảng trống
            $scope.jsonParse = [];
            console.warn('$scope.jsonParse không phải là một mảng. Đã gán thành một mảng trống.');
        }

        // Tiếp tục xử lý như bình thường
        $scope.matchedItems = $scope.jsonParse.filter(function (item) {
            return item.Id === id;
        });
        // $scope.matchedItems[0].guide = $scope.matchedItems[0].Guide 
    };
    $scope.downloadFile = function () {
        // Tạo một phần tử a để tạo ra một liên kết tới tệp Word
        var link = document.createElement("a");
        // link.href = "/files/Mẫu 2- KNĐ năm 2023.docx"; // Đặt đường dẫn đến tệp Word
        link.href = "/files/File_mau.docx"; // Đặt đường dẫn đến tệp Word
        link.download = "Mẫu 1 - KNĐ năm 2023.docx"; // Đặt tên cho tệp khi được tải xuống
        // Kích hoạt sự kiện nhấp vào liên kết
        link.click();
    }

    $scope.deleteFile = function (x) {
        dataservice.deleteFile(x.FileName, $scope.infUser.ResumeNumber, function (txt) {
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
    $scope.fileNameChanged = function () {
        $scope.openExcel = true;
        setTimeout(function () {
            $scope.$apply();
        });
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
            $scope.defaultRTE
            // console.log($scope.defaultRTE)
            $scope.JSONobjj = handleTextUpload(txt);

            console.log($scope.JSONobj);
        }
    };

    $scope.fileList = [];
    $scope.uploadExtensionFile = async function () {
        var file = document.getElementById("file").files[0];
        if (file == null || file == undefined || file == "") {
            App.toastrError(caption.COM_MSG_CHOSE_FILE);
        }
        else {
            var formdata = new FormData();
            formdata.append("file", file);

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };
            var resultImp = await fetch("/UserProfile/fileUpload", requestOptions);
            var txt = await resultImp.text();
            console.log(resultImp);
            $scope.defaultRTE
            // console.log($scope.defaultRTE)
            $scope.JSONobjj = handleTextUpload(txt)
            if ($scope.infUser = {}) {
                App.toastrError("File bạn tải không hợp lệ");
            } else {
                App.toastrSuccess("Tải file thành công")
            }
            console.log($scope.infUser);
        }
    };
    //lấy dữ liệu từ data lưu vào fileJson
    $scope.saveToJson = function () {
        // Lấy dữ liệu từ form
        var data = $scope.infUser;

        // Kiểm tra trạng thái của toggle switch
        var jsonToggle = document.getElementById("jsonToggle");
        if (jsonToggle.checked) {
            // Nếu toggle switch được chọn, lưu dữ liệu vào file JSON
            saveDataToJson(data);
        } else {
            // Nếu toggle switch không được chọn, không thực hiện gì cả hoặc thực hiện hành động khác
            console.log("Không lưu vào file JSON vì toggle switch không được chọn.");
        }
    };
    function saveDataToJson(data) {
        // Chuyển đổi dữ liệu sang định dạng JSON
        var jsonData = JSON.stringify(data);

        // Tạo một đường dẫn cho tệp JSON, bạn có thể thay đổi tên tệp và đường dẫn tùy thích
        var fileName = "data.json";

        // Tạo một URL cho dữ liệu JSON
        var fileURL = "data:text/json;charset=utf-8," + encodeURIComponent(jsonData);

        // Tạo một phần tử `<a>` để tạo một liên kết tải xuống
        var downloadLink = document.createElement("a");
        downloadLink.href = fileURL;
        downloadLink.download = fileName;

        // Kích hoạt sự kiện click trên phần tử `<a>` để tải xuống tệp JSON
        downloadLink.click();
    }



    //Thêm data vào PersonalHistory
    $scope.PersonalHistory = [];

    $scope.infUser = {
        MarriedStatus: [
            {
                id: 1,
                marriedStatus: 'DOC_THAN'
            },
            {
                id: 2,
                marriedStatus: 'LY_HON',
                decisionNumber: '1234',
                decisionDate: '25/04/2024',
                location: 'Ha Noi'
            },
            {
                id: 3,
                marriedStatus: 'KET_HON'
            },
        ],
        LevelEducation: {
            Undergraduate: [],
            PoliticalTheory: [],
            ForeignLanguage: [],
            It: [],
            MinorityLanguage: []
        },
    }
    var today = new Date();

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
    $scope.SelfComment = {};
    $scope.GroupUser = '';
    function handleTextUpload(txt) {
        $scope.Relationship = []
        $scope.PersonalHistory = []
        $scope.defaultRTE.value = txt;
        setTimeout(function () {
            var listPage = document.querySelectorAll(".Section0 > div > table");
            console.log(listPage);
            //Page2 Lịch sử bản thân
            var listTagpinPage1 = listPage[1].querySelectorAll("tbody > tr > td > p");
            $scope.pageInfo = document.querySelectorAll(".Section0 > div > table")[0].querySelectorAll("td > p");

            for (var i = 0; i < $scope.pageInfo.length; i++) {
                var text = $scope.pageInfo[i].innerText.trim();
                console.log(i + ": " + text);
            }
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
                for (let y = 0; y < pE8.length; y++) {
                    for (let i = 0; i < pE8[y].length; i++) {
                        if (pE8[y][i].startsWith('- Họ và tên:')) {
                            $scope.Relationship[RelationshipIndex].Name = pE8[y][i].slice(('- Họ và tên:').length).trim()
                        }
                        if (pE8[y][i].startsWith('- Năm sinh:')) {
                            //let regex = /^(\d{4})-(\d{4})(?:\(([^)]*)\))?$/;
                            let match1 = pE8[y][i].slice(('- Năm sinh:').length).trim()//.match(regex);
                            var match = match1.split("(");
                            if (match[1] === ('Đã mất)')) {
                                $scope.Relationship[RelationshipIndex].die = true;
                                $scope.Relationship[RelationshipIndex].BirthYear = match[0];
                            } else {
                                $scope.Relationship[RelationshipIndex].die = false;
                                $scope.Relationship[RelationshipIndex].BirthYear = match1;

                            }

                            // if (match) {
                            //     $scope.Relationship[RelationshipIndex].Year = {
                            //         YearBirth: match[1],
                            //         YearDeath: match[2],
                            //         Reason: match[3] ? match[3].trim() : ''  // Kiểm tra xem có thông tin lý do không
                            //     };
                            // }
                            /*$scope.Relationship[RelationshipIndex].BirthYear = match;*/
                        }
                        if (pE8[y][i].startsWith("- Nơi mất:")) {
                            $scope.Relationship[RelationshipIndex].AddressDie = pE8[y][i].slice(('- Nơi mất:').length).trim()
                        }
                        if (pE8[y][i].startsWith("- Nơi sinh:")) {
                            $scope.Relationship[RelationshipIndex].BirthPlace = pE8[y][i].slice(('- Nơi sinh:').length).trim()
                        }
                        if (pE8[y][i].startsWith("- Thành phần giai cấp:")) {
                            $scope.Relationship[RelationshipIndex].class = pE8[y][i].slice(('- Thành phần giai cấp:').length).trim()
                        }
                        if (pE8[y][i].startsWith("- Lý do mất:")) {
                            $scope.Relationship[RelationshipIndex].Reason = pE8[y][i].slice(('- Lý do mất:').length).trim()
                        }
                        if (pE8[y][i].startsWith("- Quê quán:")) {
                            $scope.Relationship[RelationshipIndex].HomeTown = pE8[y][i].slice(('- Quê quán:').length).trim()
                            if ($scope.Relationship[RelationshipIndex].HomeTown = pE8[y][i].slice(('- Quê quán:').length).trim()) {
                                var PlaceofBirthWord5 = pE8[y][i].slice(('- Quê quán:').length).trim();
                                var PlaceofBirth5 = PlaceofBirthWord5.split(',');
                                if (PlaceofBirth5.length == 4) {
                                    let tempIndex = RelationshipIndex;
                                    let tempPlaceofBirth5 = PlaceofBirth5;

                                    Promise.all([
                                        new Promise((resolve, reject) => {
                                            dataservice.GetTinhName(tempPlaceofBirth5[3], function (rs) {
                                                if (rs.data && rs.data[0]) {
                                                    $scope.Relationship[tempIndex].PlaceofBirthTinh_id5 = rs.data[0].provinceId;
                                                    resolve();
                                                } else {
                                                    reject('TinhName not found');
                                                }
                                            });
                                        }),
                                        new Promise((resolve, reject) => {
                                            dataservice.getDistrictsName(tempPlaceofBirth5[2], tempPlaceofBirth5[3], function (rs) {
                                                if (rs.data && rs.data[0]) {
                                                    $scope.Relationship[tempIndex].PlaceofBirthHuyen_id5 = rs.data[0].districtId;
                                                    resolve();
                                                } else {
                                                    reject('DistrictsName not found');
                                                }
                                            });
                                        }),
                                        new Promise((resolve, reject) => {
                                            dataservice.getWardsName(tempPlaceofBirth5[1], tempPlaceofBirth5[2], tempPlaceofBirth5[3], function (rs) {
                                                if (rs.data && rs.data[0]) {
                                                    $scope.Relationship[tempIndex].PlaceofBirthXa_id5 = rs.data[0].wardsId;
                                                    resolve();
                                                } else {
                                                    reject('WardsName not found');
                                                }
                                            });
                                        })
                                    ]).then(() => {
                                        setTimeout(function () {
                                            $scope.$apply(() => {
                                                $scope.Relationship[tempIndex].HomeTown = [
                                                    $scope.Relationship[tempIndex].PlaceofBirthTinh_id5,
                                                    $scope.Relationship[tempIndex].PlaceofBirthHuyen_id5,
                                                    $scope.Relationship[tempIndex].PlaceofBirthXa_id5,
                                                    tempPlaceofBirth5[0]
                                                ].join("_");
                                                $scope.Relationship[tempIndex].HomeTownVillage = tempPlaceofBirth5[0];
                                            });
                                        }, 100);
                                    }).catch(error => {
                                        console.error(error);
                                    });
                                }


                            }
                        }
                        if (pE8[y][i].startsWith("- Nơi cư trú:")) {
                            $scope.Relationship[RelationshipIndex].Residence = pE8[y][i].slice(('- Nơi cư trú:').length).trim()
                        }
                        if (pE8[y][i].startsWith("- Nghề nghiệp:")) {
                            $scope.Relationship[RelationshipIndex].Job = pE8[y][i].slice(('- Nghề nghiệp:').length).trim()
                        }
                        if (pE8[y][i].startsWith("- Đảng viên:")) {
                            var partyMember = pE8[y][i].slice(('- Đảng viên:').length).trim()

                            /*var parts = partyMember.split(/[(,)]/);*/
                            /*$scope.Relationship[RelationshipIndex].PartyMember = parts[0]*/
                            var PMember = partyMember.trim()
                            console.log($scope.Relationship[RelationshipIndex].PartyMember);
                            if (PMember === "Có") {
                                $scope.Relationship[RelationshipIndex].PartyMember = true;

                            }
                            else {
                                $scope.Relationship[RelationshipIndex].PartyMember = false
                            }
                            /*if (parts.length > 1 && parts[1].includes(':')) {
                                $scope.Relationship[RelationshipIndex].wordAt = "" + parts[1].split(':')[1].trim();
                            }*/
                            console.log($scope.Relationship[RelationshipIndex].die);
                        }

                        if (pE8[y][i].startsWith("- Thuộc đảng bộ:")) {
                            $scope.Relationship[RelationshipIndex].Party = pE8[y][i].slice(('- Thuộc đảng bộ:').length).trim()
                        }
                        if (pE8[y][i].startsWith("- Sinh hoạt tại chi bộ:")) {
                            $scope.Relationship[RelationshipIndex].wordAt = pE8[y][i].slice(('- Sinh hoạt tại chi bộ:').length).trim()
                        }
                        if (pE8[y][i].startsWith("- Quá trình công tác:")) {
                            $scope.Relationship[RelationshipIndex].WorkingProgress = '';
                            for (j = i + 1; j <= pE8[y].length - 1 && !pE8[y][j].startsWith('-') && !pE8[y][j].startsWith('*'); j++) {
                                let inputString = pE8[y][j];
                                $scope.Relationship[RelationshipIndex].WorkingProgress += inputString + ', \n';
                                i = j;
                            }
                        }
                        if (pE8[y][i].startsWith("- Thái độ chính trị:")) {
                            $scope.Relationship[RelationshipIndex].PoliticalAttitude = pE8[y][i].slice(('- Thái độ chính trị:').length).trim();
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
            }
            console.log("Relationship:", $scope.Relationship);
            //Page 9 Tự nhận xét
            $scope.SelfComment = {
                context: listPage[9].innerText
            };
            $scope.getFirstNonEmptyLine = function (innerText) {
                if (!innerText) return "";

                // Tách các dòng từ văn bản
                var lines = innerText.split('\n');

                // Lọc bỏ các dòng trống
                var nonEmptyLines = lines.filter(function (line) {
                    return line.trim() !== "";
                });

                // Lấy dòng đầu tiên
                return nonEmptyLines.length > 0 ? nonEmptyLines[0].trim() : "";
            };

            // Lấy kết quả cho phần tử thứ 10 (chỉ số 9)
            $scope.firstNonEmptyLine = $scope.getFirstNonEmptyLine($scope.SelfComment.context);
            $scope.SelfComment.context = $scope.firstNonEmptyLine
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


            for (let i = 0; i < $scope.pageInfo.length; i++) {
                if ($scope.pageInfo[i].innerText.trim().startsWith('Họ và tên đang dùng:')) {
                    // $scope.Relationship[RelationshipIndex].Name = pE8[y][i].slice(('- Họ và tên:').length).trim()
                    $scope.infUser.LastName = $scope.pageInfo[i].innerText.trim().slice(('Họ và tên đang dùng:').length).trim();
                }
                if ($scope.pageInfo[i].innerText.trim().startsWith('Nam, nữ:')) {
                    $scope.infUser.Sex = $scope.pageInfo[i].innerText.trim().slice(('Nam, nữ:').length).trim();
                }
                if ($scope.pageInfo[i].innerText.trim().startsWith('Họ và tên khai sinh:')) {
                    $scope.infUser.FirstName = $scope.pageInfo[i].innerText.trim().slice(('Họ và tên khai sinh:').length).trim();
                }

                if ($scope.pageInfo[i].innerText.trim().startsWith('Số điện thoại:')) {
                    $scope.infUser.Phone = $scope.pageInfo[i].innerText.trim().slice(('Số điện thoại:').length).trim();
                }
                if ($scope.pageInfo[i].innerText.trim().startsWith('Ngày, tháng, năm sinh :')) {
                    $scope.infUser.Birthday = ""
                    var birthđay = $scope.pageInfo[i].innerText.trim().slice(('Ngày, tháng, năm sinh :').length).trim();

                    var parts = birthđay.split("-");
                    if (parts.length === 3) {
                        var formattedBirthday = parts[0] + "/" + parts[1] + "/" + parts[2];
                        $scope.infUser.Birthday = formattedBirthday;
                    } else {
                        $scope.infUser.Birthday = $scope.pageInfo[i].innerText.trim().slice(('Ngày, tháng, năm sinh :').length).trim();
                    }
                }

                if ($scope.pageInfo[i].innerText.trim().startsWith('Nơi sinh:')) {
                    var PlaceofBirthWord1 = $scope.pageInfo[i].innerText.trim().slice(('Nơi sinh:').length).trim();
                    var PlaceofBirth1 = PlaceofBirthWord1.split(',');
                    if (PlaceofBirth1.length == 4) {
                        Promise.all([
                            new Promise((resolve, reject) => {
                                dataservice.GetTinhName(PlaceofBirth1[3], function (rs) {
                                    if (rs.data && rs.data[0]) {
                                        $scope.PlaceofBirthTinh_id1 = rs.data[0].provinceId;
                                        resolve();
                                    }
                                });
                            }),
                            new Promise((resolve, reject) => {
                                dataservice.getDistrictsName(PlaceofBirth1[2], PlaceofBirth1[3], function (rs) {
                                    if (rs.data && rs.data[0]) {
                                        $scope.PlaceofBirthHuyen_id1 = rs.data[0].districtId;
                                        resolve();
                                    }
                                });
                            }),
                            new Promise((resolve, reject) => {
                                dataservice.getWardsName(PlaceofBirth1[1], PlaceofBirth1[2], PlaceofBirth1[3], function (rs) {
                                    if (rs.data && rs.data[0]) {
                                        $scope.PlaceofBirthXa_id1 = rs.data[0].wardsId;
                                        resolve();
                                    }
                                });
                            })
                        ]).then(() => {
                            setTimeout(function () {
                                $scope.$apply(() => {
                                    $scope.infUser.PlaceofBirth = [$scope.PlaceofBirthTinh_id1, $scope.PlaceofBirthHuyen_id1, $scope.PlaceofBirthXa_id1, PlaceofBirth1[0]].join("_");
                                    $scope.thon_PlaceofBirth = PlaceofBirth1[0];
                                    console.log($scope.infUser.PlaceofBirth1);
                                });
                            }, 100);
                        }).catch(error => {
                            console.error(error);
                        });
                    }
                }

                if ($scope.pageInfo[i].innerText.trim().startsWith('Quê quán:')) {
                    // $scope.infUser.HomeTown = $scope.pageInfo[i].innerText.trim().slice(('Quê quán:').length).trim();
                    var PlaceofBirthWord2 = $scope.pageInfo[i].innerText.trim().slice(('Quê quán:').length).trim();
                    var PlaceofBirth2 = PlaceofBirthWord2.split(',');
                    if (PlaceofBirth2.length == 4) {
                        Promise.all([
                            new Promise((resolve, reject) => {
                                dataservice.GetTinhName(PlaceofBirth2[3], function (rs) {
                                    if (rs.data && rs.data[0]) {
                                        $scope.PlaceofBirthTinh_id2 = rs.data[0].provinceId;
                                        resolve();
                                    }
                                });
                            }),
                            new Promise((resolve, reject) => {
                                dataservice.getDistrictsName(PlaceofBirth2[2], PlaceofBirth2[3], function (rs) {
                                    if (rs.data && rs.data[0]) {
                                        $scope.PlaceofBirthHuyen_id2 = rs.data[0].districtId;
                                        resolve();
                                    }
                                });
                            }),
                            new Promise((resolve, reject) => {
                                dataservice.getWardsName(PlaceofBirth2[1], PlaceofBirth2[2], PlaceofBirth2[3], function (rs) {
                                    if (rs.data && rs.data[0]) {
                                        $scope.PlaceofBirthXa_id2 = rs.data[0].wardsId;
                                        resolve();
                                    }
                                });
                            })
                        ]).then(() => {
                            setTimeout(function () {
                                $scope.$apply(() => {
                                    $scope.infUser.HomeTown = [$scope.PlaceofBirthTinh_id2, $scope.PlaceofBirthHuyen_id2, $scope.PlaceofBirthXa_id2, PlaceofBirth2[0]].join("_");
                                    $scope.thon_HomeTown = PlaceofBirth2[0];
                                });
                            }, 100);
                        }).catch(error => {
                            console.error(error);
                        });
                    }
                }

                if ($scope.pageInfo[i].innerText.trim().startsWith('- Nơi thường trú :')) {
                    // $scope.infUser.Residence = $scope.pageInfo[i].innerText.trim().slice(('- Nơi thường trú :').length).trim();
                    var PlaceofBirthWord3 = $scope.pageInfo[i].innerText.trim().slice(('- Nơi thường trú :').length).trim();
                    var PlaceofBirth3 = PlaceofBirthWord3.split(',');
                    if (PlaceofBirth3.length == 4) {
                        Promise.all([
                            new Promise((resolve, reject) => {
                                dataservice.GetTinhName(PlaceofBirth3[3], function (rs) {
                                    if (rs.data && rs.data[0]) {
                                        $scope.PlaceofBirthTinh_id3 = rs.data[0].provinceId;
                                        resolve();
                                    }
                                });
                            }),
                            new Promise((resolve, reject) => {
                                dataservice.getDistrictsName(PlaceofBirth3[2], PlaceofBirth3[3], function (rs) {
                                    if (rs.data && rs.data[0]) {
                                        $scope.PlaceofBirthHuyen_id3 = rs.data[0].districtId;
                                        resolve();
                                    }
                                });
                            }),
                            new Promise((resolve, reject) => {
                                dataservice.getWardsName(PlaceofBirth3[1], PlaceofBirth3[2], PlaceofBirth3[3], function (rs) {
                                    if (rs.data && rs.data[0]) {
                                        $scope.PlaceofBirthXa_id3 = rs.data[0].wardsId;
                                        resolve();
                                    }
                                });
                            })
                        ]).then(() => {
                            setTimeout(function () {
                                $scope.$apply(() => {
                                    $scope.infUser.Residence = [$scope.PlaceofBirthTinh_id3, $scope.PlaceofBirthHuyen_id3, $scope.PlaceofBirthXa_id3, PlaceofBirth3[0]].join("_");
                                    $scope.thon_Residence = PlaceofBirth3[0];
                                });
                            }, 100);
                        }).catch(error => {
                            console.error(error);
                        });
                    }
                }

                if ($scope.pageInfo[i].innerText.trim().startsWith('- Nơi tạm trú :')) {
                    // $scope.infUser.TemporaryAddress = $scope.pageInfo[i].innerText.trim().slice(('- Nơi tạm trú :').length).trim();
                    var PlaceofBirthWord4 = $scope.pageInfo[i].innerText.trim().slice(('- Nơi tạm trú :').length).trim();
                    try {

                        var PlaceofBirth4 = PlaceofBirthWord4.split(',');
                        if (PlaceofBirth4.length == 4) {
                            Promise.all([
                                new Promise((resolve, reject) => {
                                    dataservice.GetTinhName(PlaceofBirth4[3], function (rs) {
                                        if (rs.data && rs.data[0]) {
                                            $scope.PlaceofBirthTinh_id4 = rs.data[0].provinceId;
                                            resolve();
                                        }
                                    });
                                }),
                                new Promise((resolve, reject) => {
                                    dataservice.getDistrictsName(PlaceofBirth4[2], PlaceofBirth4[3], function (rs) {
                                        if (rs.data && rs.data[0]) {
                                            $scope.PlaceofBirthHuyen_id4 = rs.data[0].districtId;
                                            resolve();
                                        }
                                    });
                                }),
                                new Promise((resolve, reject) => {
                                    dataservice.getWardsName(PlaceofBirth4[1], PlaceofBirth4[2], PlaceofBirth4[3], function (rs) {
                                        if (rs.data && rs.data[0]) {
                                            $scope.PlaceofBirthXa_id4 = rs.data[0].wardsId;
                                            resolve();
                                        }
                                    });
                                })
                            ]).then(() => {
                                setTimeout(function () {
                                    $scope.$apply(() => {
                                        $scope.infUser.TemporaryAddress = [$scope.PlaceofBirthTinh_id4, $scope.PlaceofBirthHuyen_id4, $scope.PlaceofBirthXa_id4, PlaceofBirth4[0]].join("_");
                                        $scope.thon_TemporaryAddress = PlaceofBirth4[0];
                                    });
                                }, 100);
                            }).catch(error => {
                                console.error(error);
                            });
                        }
                    } catch (error) {
                        $scope.infUser.TemporaryAddress = $scope.pageInfo[i].innerText.trim().slice(('- Nơi tạm trú :').length).trim();
                    }
                }

                if ($scope.pageInfo[i].innerText.trim().startsWith('Nghề nghiệp hiện nay:')) {
                    $scope.infUser.NowEmployee = $scope.pageInfo[i].innerText.trim().slice(('Nghề nghiệp hiện nay:').length).trim();
                }

                if ($scope.pageInfo[i].innerText.trim().startsWith('Dân tộc:')) {
                    $scope.infUser.Nation = $scope.pageInfo[i].innerText.trim().slice(('Dân tộc:').length).trim();
                }
                if ($scope.pageInfo[i].innerText.trim().startsWith('Tôn giáo:')) {
                    $scope.infUser.Religion = $scope.pageInfo[i].innerText.trim().slice(('Tôn giáo:').length).trim();
                }
                if ($scope.pageInfo[i].innerText.trim().startsWith('- Giáo dục phổ thông:')) {
                    $scope.infUser.LevelEducation.GeneralEducation = $scope.pageInfo[i].innerText.trim().slice(('- Giáo dục phổ thông:').length).trim();
                }
                if ($scope.pageInfo[i].innerText.trim().startsWith('- Giáo dục đại học và sau đại học:')) {
                    $scope.infUser.LevelEducation.Undergraduate = $scope.pageInfo[i].innerText.trim().slice(('- Giáo dục đại học và sau đại học:').length).trim();
                }
                if ($scope.pageInfo[i].innerText.trim().startsWith('- Học hàm:')) {
                    $scope.infUser.LevelEducation.RankAcademic = $scope.pageInfo[i].innerText.trim().slice(('- Học hàm:').length).trim();
                }
                if ($scope.pageInfo[i].innerText.trim().startsWith('- Giáo dục nghề nghiệp :')) {
                    $scope.infUser.LevelEducation.VocationalTraining = $scope.pageInfo[i].innerText.trim().slice(('- Giáo dục nghề nghiệp :').length).trim();
                }
                if ($scope.pageInfo[i].innerText.trim().startsWith('- Ngoại ngữ:')) {
                    $scope.infUser.LevelEducation.ForeignLanguage = $scope.pageInfo[i].innerText.trim().slice(('- Ngoại ngữ:').length).trim();
                }
                if ($scope.pageInfo[i].innerText.trim().startsWith('- Tiếng dân tộc thiểu số:')) {
                    $scope.infUser.LevelEducation.MinorityLanguage = $scope.pageInfo[i].innerText.trim().slice(('- Tiếng dân tộc thiểu số:').length).trim();
                }
                if ($scope.pageInfo[i].innerText.trim().startsWith('- Lý luận chính trị:')) {
                    $scope.infUser.LevelEducation.PoliticalTheory = $scope.pageInfo[i].innerText.trim().slice(('- Lý luận chính trị:').length).trim();
                }
                if ($scope.pageInfo[i].innerText.trim().startsWith('- Tin học:')) {
                    $scope.infUser.LevelEducation.It = $scope.pageInfo[i].innerText.trim().slice(('- Tin học:').length).trim();
                }
                if ($scope.pageInfo[i].innerText.trim().startsWith('- Tình trạng hôn nhân :')) {
                    // Loại bỏ phần tiêu đề và khoảng trắng dư thừa
                    var info = $scope.pageInfo[i].innerText.trim().slice('- Tình trạng hôn nhân :'.length).trim();

                    // Tách thông tin thành các phần con
                    var parts = info.split(/[(,)]/);

                    if (parts[0].trim() === 'LY_HON') {
                        $scope.infUser.MaritalStatus.marriedStatus = "" + 2;
                    } else if (parts[0].trim() === 'DOC_THAN') {
                        $scope.infUser.MaritalStatus.marriedStatus = "" + 1;
                    } else if (parts[0].trim() === 'KET_HON') {
                        $scope.infUser.MaritalStatus.marriedStatus = "" + 3;
                    } else {
                        $scope.infUser.MaritalStatus = [];
                        $scope.infUser.MaritalStatus.marriedStatus = "" + 1;
                    }

                    if (parts.length > 1 && parts[1].includes(':')) {
                        $scope.infUser.MaritalStatus.decisionNumber = "" + parts[1].split(':')[1].trim(); // 123
                    }

                    // Kiểm tra xem phần tử parts[2] có chứa dấu ':' hay không trước khi sử dụng split
                    if (parts.length > 2 && parts[2].includes(':')) {
                        $scope.infUser.MaritalStatus.decisionDate = "" + parts[2].split(':')[1].trim(); // 10/03/2009
                    }

                    // Kiểm tra xem phần tử parts[3] có chứa dấu ':' hay không trước khi sử dụng split
                    if (parts.length > 3 && parts[3].includes(':')) {
                        $scope.infUser.MaritalStatus.location = "" + parts[3].split(':')[1].trim(); // HA noi
                    }
                }
                if ($scope.pageInfo[i].innerText.trim().startsWith('Ngày và nơi vào Đoàn TNCSHCM:')) {
                    // Loại bỏ phần tiêu đề và khoảng trắng dư thừa
                    var info = $scope.pageInfo[i].innerText.trim().slice('Ngày và nơi vào Đoàn TNCSHCM:'.length).trim();
                    try {

                        var parts = info.split(",");
                        if (parts.length === 1) {
                            $scope.placeAddress = parts[0]
                        }

                        if (parts.length = 2) {
                            $scope.placeAddress = parts[0]
                            var cleanPlace = parts[1].replace("tại ", "").trim();
                            $scope.PlaceCreatedTime.place = cleanPlace;
                        }
                    } catch (error) {
                        $scope.placeAddress = ""
                        $scope.PlaceCreatedTime.place = ""
                    }

                }

                // if ($scope.pageInfo[i].innerText.trim().startsWith('Ngày và nơi vào Đoàn TNCSHCM:')) {
                //     var a = $scope.pageInfo[i].innerText.trim().slice(('Ngày và nơi vào Đoàn TNCSHCM:').length).trim();
                //     try {

                //         var b = a.split(",");
                //         if (b.length === 1) {
                //             $scope.placeAddress = b[0]
                //         }

                //         if (b.length > 2 && b[2].includes(':')) {
                //             $scope.placeAddress = b[0]
                //             $scope.PlaceCreatedTime.place = b[1]
                //         }
                //     } catch (error) {
                //         $scope.placeAddress = ""
                //         $scope.PlaceCreatedTime.place = ""
                //     }
                // }
                $scope.SelfComment.context = $scope.SelfComment.context
                // $scope.PlaceCreatedTime.place = datapage9[0]
                console.log($scope.infUser.Birthday);
                console.log($scope.infUser.MaritalStatus);
            }







            // $scope.infUser.FirstName = $scope.listDetail1[0].split(":")[1] ? $scope.listDetail1[0].split(":")[1].trim() : "";
            // $scope.infUser.Sex = $scope.listDetail1[1].split(":")[1] ? $scope.listDetail1[1].split(":")[1].trim() : "";
            // $scope.infUser.LastName = $scope.listDetail1[2].split(":")[1] ? $scope.listDetail1[2].split(":")[1].trim() : "";
            // $scope.infUser.Birthday = $scope.listDetail1[3].split(":")[1] ? $scope.listDetail1[3].split(":")[1].trim() : "";
            // $scope.infUser.HomeTown = $scope.listDetail1[5].split(":")[1] ? $scope.listDetail1[5].split(":")[1].trim() : "";
            // $scope.infUser.PlaceofBirth = $scope.listDetail1[4].split(":")[1] ? $scope.listDetail1[4].split(":")[1].trim() : "";
            // $scope.infUser.Residence = $scope.listDetail1[7].split(":")[1] ? $scope.listDetail1[7].split(":")[1].trim() : "";
            // $scope.infUser.TemporaryAddress = $scope.listDetail1[8].split(":")[1] ? $scope.listDetail1[8].split(":")[1].trim() : "";

            // $scope.infUser.Nation = $scope.Detail1.trim();
            // $scope.infUser.Religion = $scope.Detail2.trim();

            // $scope.infUser.NowEmployee = $scope.listDetail3.split(":")[1] ? $scope.listDetail3.split(":")[1].trim() : "";

            // $scope.infUser.PlaceinGroup = $scope.listDetail4[0];
            // $scope.infUser.DateInGroup = $scope.listDetail4[1]//.match(/\d+/g).join('-');

            // $scope.infUser.PlaceInParty = $scope.listDetail5[0];
            // $scope.infUser.DateInParty = $scope.listDetail5[0]//.split(',')[1]//.match(/\d+/g).join('-');
            // $scope.infUser.PlaceRecognize = $scope.listDetail7[0]//.split(',')[0];
            // $scope.infUser.DateRecognize = $scope.listDetail7[0]//.split(',')[1]//.match(/\d+/g).join('-');
            // $scope.infUser.Presenter = $scope.listDetail5[2]//.trim();

            // $scope.infUser.Phone = $scope.listDetail8.split(":")[1] ? $scope.listDetail8.split(":")[1].trim() : "";
            // $scope.infUser.PhoneContact = $scope.listDetail9.split(":")[1] ? $scope.listDetail9.split(":")[1].trim() : "";
            // console.log($scope.infUser.Phone);
            // $scope.infUser.LevelEducation.GeneralEducation = $scope.listDetail6[0].split(":")[1] ? $scope.listDetail6[0].split(":")[1].trim() : "";
            // $scope.infUser.LevelEducation.VocationalTraining = $scope.listDetail6[1].split(":")[1] ? $scope.listDetail6[1].split(":")[1].trim() : "";
            // $scope.infUser.LevelEducation.Undergraduate = $scope.listDetail6[2].split(":")[1] ? $scope.listDetail6[2].split(":")[1].trim() : "";//.split(',');
            // $scope.infUser.LevelEducation.RankAcademic = $scope.listDetail6[3].split(":")[1] ? $scope.listDetail6[3].split(":")[1].trim() : "";
            // $scope.infUser.LevelEducation.PoliticalTheory = $scope.listDetail6[4].split(":")[1] ? $scope.listDetail6[4].split(":")[1].trim() : "";//.split(',');

            // $scope.infUser.LevelEducation.ForeignLanguage = $scope.listDetail6[5].split(":")[1] ? $scope.listDetail6[5].split(":")[1].trim() : "";
            // $scope.infUser.LevelEducation.It = $scope.listDetail6[6].split(":")[1] ? $scope.listDetail6[6].split(":")[1].trim() : "";//.split(',');
            // $scope.infUser.LevelEducation.MinorityLanguage = $scope.listDetail6[7].split(":")[1] ? $scope.listDetail6[7].split(":")[1].trim() : "";//.split(',');

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
    // $scope.insertAllData = function () {
    //     $scope.
    ;
    //     $scope.submitPersonalHistorys();
    //     $scope.submitAward();
    //     $scope.submitBusinessNDuty();
    //     $scope.submitGoAboard();
    //     $scope.submitIntroducer();
    //     $scope.submitDisciplined();
    //     $scope.submitHistorySpecialist();
    //     $scope.insertFamily();
    // }

    $('.icon-clickable').click(function () {
        var id = $(this).attr('id');
        $scope.handleUserClick(id);
    });

    $scope.check = function (id) {
        /* var id = $(this).attr('id');*/
        var id2 = id
        $scope.handleUserClick(id2);
    }

    $scope.handleUserClick = function (id) {
        if (!Array.isArray($scope.jsonGuide)) {
            $scope.jsonGuide = [];
            console.warn('$scope.jsonGuide không phải là một mảng. Đã gán thành một mảng trống.');
        }
        var id3 = "" + id
        /*        return $scope.jsonGuide.find(function (item) {
                    return item.id ===id3;
                });*/

        $scope.matchedItemss = $scope.jsonGuide.filter(function (item) {
            return item.id === id3;
        });
        console.log('$scope.matchedItemss:', $scope.matchedItemss)
        /*        $timeout(function () {
                    // Các thay đổi cần áp dụng vào scope
                    $scope.$apply();
        
                });*/
    };
    $scope.handerClickIconChild = function (tabId, id) {
        if (!Array.isArray($scope.jsonGuide)) {
            $scope.jsonGuide = [];
            console.warn('$scope.jsonGuide không phải là một mảng. Đã gán thành một mảng trống.');
        }
        let pp = null;
        switch (tabId) {
            case "family":
                pp = $scope.jsonGuide.find(x => x.id === `${tabId}_${$scope.selectedFamily.Id}`);
                break;
            default:
                break;
        }
        if (pp != null) {
            pp.comment = pp.idFamily[id];
            $scope.matchedItemss = [pp];
        }
    }
    $scope.handerClickIconChild6 = function (tabId, id) {
        if (!Array.isArray($scope.jsonGuide)) {
            $scope.jsonGuide = [];
            console.warn('$scope.jsonGuide không phải là một mảng. Đã gán thành một mảng trống.');
        }
        let pp = null;
        switch (tabId) {
            case "historyspecialist":
                console.log(`${tabId}_${$scope.selectedHistorySpecialist.Id}`);
                pp = $scope.jsonGuide.find(x => x.id === `${tabId}_${$scope.selectedHistorySpecialist.Id}`);
                break;
            default:
                break;
        }
        if (pp != null) {
            pp.comment = pp.idFamily[id];
            $scope.matchedItemss = [pp];
        }
    }
    $scope.handerClickIconChild7 = function (tabId, id) {
        if (!Array.isArray($scope.jsonGuide)) {
            $scope.jsonGuide = [];
            console.warn('$scope.jsonGuide không phải là một mảng. Đã gán thành một mảng trống.');
        }
        let pp = null;
        switch (tabId) {
            case "laudatory":
                pp = $scope.jsonGuide.find(x => x.id === `${tabId}_${$scope.selectedLaudatory.Id}`);
                break;
            default:
                break;
        }
        if (pp != null) {
            pp.comment = pp.idFamily[id];
            $scope.matchedItemss = [pp];
        }
    }

    $scope.getPartyAdmissionProfileByUsername = function () {
        if ($scope.UserName == null || $scope.UserName == undefined) {
            //thông báo không lấy được username
        }
        else {
            dataservice.getPartyAdmissionProfileByUsername($scope.UserName, function (rs) {
                rs = rs.data;
                console.log(rs);
                if (rs.Error) {

                }
                else {
                    rs = rs.Object;
                    $scope.infUser.LastName = rs.CurrentName;
                    var date = new Date(rs.Birthday);
                    var day = date.getDate();
                    var month = date.getMonth() + 1; // Tháng bắt đầu từ 0
                    var year = date.getFullYear();
                    if (day < 10) {
                        day = '0' + day;
                    }
                    if (month < 10) {
                        month = '0' + month;
                    }
                    $scope.infUser.Birthday = day + '-' + month + '-' + year;
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
                    $scope.infUser.LevelEducation.MinorityLanguage = rs.MinorityLanguages;
                    $scope.infUser.LevelEducation.It = rs.ItDegree;
                    $scope.infUser.LevelEducation.PoliticalTheory = rs.PoliticalTheory;
                    $scope.PlaceCreatedTime = { place: rs.CreatedPlace };
                    $scope.SelfComment.context = rs.SelfComment;
                    $scope.status = JSON.parse(rs.Status).slice(-4);
                    $scope.infUser.ResumeNumber = rs.ResumeNumber;
                    $scope.GroupUser = rs.GroupUserCode;

                    console.log($scope.status);

                    // Tạo đường dẫn đến tệp JSON
                    var jsonUrl = `/uploads/json/reviewprofile_${$scope.infUser.ResumeNumber}.json`;

                    $http.get(jsonUrl).then(function (response) {
                        $scope.jsonGuide = response.data;
                        $.each($scope.jsonGuide, function (index, item) {
                            // Tìm thẻ <i> có id trùng với id của phần tử
                            var $icon = $('#' + item.id + '.fa.fa-info-circle');
                            // Nếu thẻ <i> được tìm thấy, đổi màu chúng thành đỏ
                            if ($icon.length > 0) {
                                $icon.css('color', 'red');
                            }
                        });
                    }).catch(function (error) {
                        console.error('Lỗi khi tải dữ liệu JSON');
                    });

                    if ($scope.infUser.ResumeNumber) {
                        $scope.getFamilyByProfileCode();
                        $scope.getPersonalHistoryByProfileCode();
                        $scope.getGoAboardByProfileCode();
                        $scope.getAwardByProfileCode();
                        $scope.getWorkingTrackingByProfileCode();
                        $scope.getHistorySpecialistByProfileCode();
                        $scope.getTrainingCertificatedPassByProfileCode();
                        $scope.getWarningDisciplinedByProfileCode();
                        $scope.getIntroducerOfPartyByProfileCode();
                        $scope.getListFile();
                    }

                }
            })
        }
    }

    $scope.ProfileList = [];

    $scope.initdata = function () {
        dataservice.getProvince(function (rs) {
            $scope.ListProvince = rs.data;
            console.log($scope.ListProvince);
        })
        $scope.getPartyAdmissionProfileByUsername()
    }
    $scope.initdata()
    $scope.getPartyAdmissionProfile = function () {
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetPartyAdmissionProfile",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                console.log(result);
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                }
            },
            error: function (error) {
                App.toastrError(error);
            }
        });

    }
    $scope.senddata = function () {
        var data = $rootScope.ProjectCode;
        $rootScope.$emit('eventName', data);
    }

    //insertFamily


    $scope.PartyMember = false
    $scope.changedisable = function () {
        if ($scope.selectedFamily.disableAddress === true) {
            $scope.selectedFamily.disableAddress = true;
            $scope.selectedFamily.die = true
        } else if ($scope.selectedFamily.disableAddress === false) {
            $scope.selectedFamily.disableAddress = false;
            $scope.selectedFamily.die = false
        }
    }
    $scope.changedis = function () {
        /*$scope.PartyMember = !$scope.PartyMember*/
        if ($scope.selectedFamily.PartyMember === true) {

            $scope.PartyMember = true;
        } else {
            $scope.PartyMember = false;
        }
    }
    $scope.addToFamily = function () {
        if ($scope.forms.addFamily.validate()) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            // var match = $scope.WorkingProgressEnd.match(/\d{4}/);
            // if (match) {
            //     if (match[0] > currentYear) {
            //         App.toastrError("Năm đến trong quá trình công tác không hợp lệ")
            //         $scope.err = true
            //         return
            //     }

            //     if (match[0] > $scope.selectedFamily.BirthDie && $scope.selectedFamily.disableAddress == true) {
            //         App.toastrError("Năm đến trong quá trình công tác không hợp lệ không được vượt qua năm mất")
            //         $scope.err = true
            //         return
            //     }
            // }
            $scope.err = false
            if ($scope.selectedFamily.Relation == null || $scope.selectedFamily.Relation == undefined || $scope.selectedFamily.Relation === '') {
                $scope.err = true
                App.toastrError("Bạn cần nhập thông tin quan hệ")
                return
            }

            if ($scope.selectedFamily.Name == null || $scope.selectedFamily.Name == undefined || $scope.selectedFamily.Name === '') {
                $scope.err = true
                App.toastrError("Bạn cần nhập thông tin Họ và tên")
                return
            }
            if ($scope.selectedFamily.BirthYear == null || $scope.selectedFamily.BirthYear == undefined || $scope.selectedFamily.BirthYear === '') {
                $scope.err = true
                App.toastrError("Bạn cần nhập thông tin năm sinh")
                return
            }
            if ($scope.selectedFamily.disableAddress == true) {
                if ($scope.selectedFamily.AddressDie == null || $scope.selectedFamily.AddressDie == undefined || $scope.selectedFamily.AddressDie === '') {
                    $scope.err = true
                    App.toastrError("Bạn chưa nhập đủ thông tin ( địa chỉ người mất)")
                    return

                }
                if ($scope.selectedFamily.Reason == null || $scope.selectedFamily.Reason == undefined || $scope.selectedFamily.Reason === '') {
                    $scope.err = true
                    App.toastrError("Bạn chưa nhập đủ thông tin (Lí do mất)")
                    return

                }
            } else {
                if ($scope.selectedFamily.Residence == null || $scope.selectedFamily.Residence == undefined || $scope.selectedFamily.Residence === '') {
                    $scope.err = true
                    App.toastrError("Bạn chưa nhập thông tin nơi cư trú")
                    return
                }
            }
            if ($scope.PartyMember == true) {
                // $scope.err = true
                if ($scope.selectedFamily.wordAt == null || $scope.selectedFamily.wordAt == undefined || $scope.selectedFamily.wordAt === '') {
                    $scope.err = true
                    App.toastrError("Bạn chưa nhập đủ thông tin (Nơi công tác)")
                } else {
                    $scope.err = false
                    if ($scope.selectedFamily.Party == null || $scope.selectedFamily.Party == undefined || $scope.selectedFamily.Party === '') {
                        $scope.err = true
                        App.toastrError("Bạn chưa nhập đủ thông tin (Thuộc đảng bộ nào ? )")
                    } else {
                        $scope.err = false

                    }
                }
            }
            $scope.biologicalParents = ["bố đẻ", "mẹ đẻ", "bố ruột", "mẹ ruột", "bố", "mẹ"];
            if ($scope.biologicalParents.includes($scope.selectedFamily.Relation.toLowerCase())) {
                if ($scope.selectedFamily.BirthPlace == null || $scope.selectedFamily.BirthPlace == undefined || $scope.selectedFamily.BirthPlace === '') {
                    $scope.err = true;
                    App.toastrError("Bạn cần nhập thông tin nơi sinh vào trường hợp này")
                    return
                }
                if ($scope.selectedFamily.class == null || $scope.selectedFamily.class == undefined || $scope.selectedFamily.class === '') {
                    $scope.err = true;
                    App.toastrError("Bạn cần nhập thông tin thành phần giao cấp vào trường hợp này")
                    return
                }

            }


            $scope.biologicalParents1 = ["vợ", "chồng"];
            if ($scope.biologicalParents1.includes($scope.selectedFamily.Relation.toLowerCase())) {
                if ($scope.selectedFamily.BirthPlace == null || $scope.selectedFamily.BirthPlace == undefined || $scope.selectedFamily.BirthPlace === '') {
                    $scope.err = true;
                    App.toastrError("Bạn cần nhập thông tin nơi sinh vào trường hợp này")
                    return
                }
            }
            // if ($scope.selectedFamily.HomeTown == null || $scope.selectedFamily.HomeTown == undefined || $scope.selectedFamily.HomeTown === '') {
            //     let part2 = $scope.selectedFamily.HomeTown.split("_");
            //     if (part2[0] == '' || part2[1] == '' || part2[2] === '') {
            //         $scope.err = true;
            //         App.toastrError("Bạn cần nhập thông tin quê quán trường hợp này")
            //         return
            //     }
            // }


            console.log($scope.selectedFamily.disableAddress);

            if ($scope.selectedFamily.BirthYear === null || $scope.selectedFamily.BirthYear === undefined || $scope.selectedFamily.BirthYear === '') {
                $scope.err = true
            }

            if ($scope.selectedFamily.PoliticalAttitude === null || $scope.selectedFamily.PoliticalAttitude === undefined || $scope.selectedFamily.PoliticalAttitude === '') {
                $scope.err = true
            }
            // if ($scope.selectedFamily.HomeTown === null || $scope.selectedFamily.HomeTown === undefined || $scope.selectedFamily.HomeTown === '') {
            //     $scope.err = true
            // }
            if ($scope.selectedFamily.Job === null || $scope.selectedFamily.Job === undefined || $scope.selectedFamily.Job === '') {
                $scope.err = true
            }
            // if ($scope.selectedFamily.WorkingProgress === null || $scope.selectedFamily.WorkingProgress === undefined || $scope.selectedFamily.WorkingProgress === '') {
            //     $scope.err = true
            // }

            if ($scope.infUser.MaritalStatus.marriedStatus === "2" && $scope.infUser.Sex.toLowerCase() == "nam") {
                const relationsToRestrict = ["bố vợ", "mẹ vợ", "anh vợ", "chị vợ", "em vợ", "ông ngoại vợ", "bà ngoại vợ", "ông nội vợ", "bà nội vợ", "cậu vợ",
                    "dì vợ", "bác vợ", "chú vợ", "thím vợ", "cô vợ", "dượng vợ"];
                if (relationsToRestrict.includes($scope.selectedFamily.Relation.toLowerCase())) {
                    $scope.err = true
                    App.toastrError("Đã ly hôn không cần nhập thành viên gia đình vợ cũ")
                    return;
                }
            }
            if ($scope.infUser.MaritalStatus.marriedStatus === "2" && $scope.infUser.Sex.toLowerCase() == "nữ") {
                const relationsToRestrict = ["bố chồng", "mẹ chồng", "anh chồng", "chị chồng", "em chồng", "ông nội chồng", "bà nội chồng", "ông ngoại chồng", "bà ngoại chồng", "cậu chồng",
                    "dì chồng", "bác chồng", "chú chồng", "thím chồng", "cô chồng", "dượng chồng"];
                if (relationsToRestrict.includes($scope.selectedFamily.Relation.toLowerCase())) {
                    $scope.err = true
                    App.toastrError("Đã ly hôn không cần nhập thành viên gia đình chồng cũ")
                    return;
                }
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
            if ($scope.selectedFamily.BirthDie) {
                model.BirthYear = "" + $scope.selectedFamily.BirthYear + " - " + $scope.selectedFamily.BirthDie;
            } else {
                model.BirthYear = $scope.selectedFamily.BirthYear;
            }
            model.PoliticalAttitude = $scope.selectedFamily.PoliticalAttitude;
            model.HomeTown = $scope.selectedFamily.HomeTown;
            model.HomeTownVillage = $scope.selectedFamily.HomeTownVillage;
            model.HomeTownValue = $scope.selectedFamily.HomeTownValue;
            model.HomeTownJson = $scope.selectedFamily.HomeTownJson;
            model.Job = $scope.selectedFamily.Job;
            model.WorkingProgress = $scope.selectedFamily.WorkingProgress;
            model.Id = 0;
            model.wordAt = $scope.selectedFamily.wordAt;
            model.AddressDie = $scope.selectedFamily.AddressDie;
            model.Reason = $scope.selectedFamily.Reason;
            model.Party = $scope.selectedFamily.Party;
            model.die = $scope.selectedFamily.disableAddress;
            model.BirthPlace = $scope.selectedFamily.BirthPlace;
            model.class = $scope.selectedFamily.class
            $scope.Relationship.push(model);
            const body = {
                LastTime: $scope.WorkingProgressEnd,
                ResumeCode: $scope.infUser.ResumeNumber,
                Relationship: $scope.selectedFamily.Relation
            };
            dataservice.updatePartyFamilyTime(body, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess("Cập nhật thành công");
                }
            });
            $scope.selectedFamily.disableAddress = false
            $scope.disableWorkingProgressYear = false;
            $scope.selectedFamily = {};
            $scope.selectedFamily.HomeTown = "";
            $scope.PartyMember = false;
            $scope.resetFamilyHomeTown();
        }
    };

    $scope.showFamilyHomeTown = true;
    $scope.resetFamilyHomeTown = function () {
        $scope.showFamilyHomeTown = false;
        $scope.selectedFamily.HomeTownValue = '';
        $scope.selectedFamily.HomeTown = '';
        $scope.selectedFamily.HomeTownJson = '';
        setTimeout(() => {
            $scope.showFamilyHomeTown = true;
            $scope.$apply();
        }, 100);
    }

    $scope.FamilyWorkTracking = [];
    $scope.selectedFamilyWorkTracking = '';
    $scope.addToFamilyWorkTracking = function () {
        if ($scope.selectedFamilyWorkTracking == undefined || $scope.selectedFamilyWorkTracking == null || $scope.selectedFamilyWorkTracking == '') {
            return
        }
        var model = {};
        model.str = $scope.selectedFamilyWorkTracking;
        $scope.FamilyWorkTracking.push(model);
        $scope.selectedFamilyWorkTracking = '';
    }

    $scope.insertFamily = function () {
        $scope.model = [];

        $scope.Relationship.forEach(function (e) {
            var obj = {};
            obj.Relation = e.Relation;
            obj.PartyMember = [e.wordAt, e.PartyMember, e.Party].join('_');
            obj.Name = e.Name;
            /*obj.BirthYear = [e.die, e.BirthYear, e.AddressDie, e.Reason].join('_');*/
            if (e.BirthDie) {
                obj.BirthYear = [e.die, ("" + e.BirthYear + "-" + e.BirthDie), e.AddressDie, e.Reason].join('_');
            } else {
                obj.BirthYear = [e.die, e.BirthYear, e.AddressDie, e.Reason].join('_');
            }
            obj.Residence = e.Residence;
            obj.PoliticalAttitude = e.PoliticalAttitude;
            obj.HomeTown = e.HomeTown;
            obj.HomeTownVillage = e.HomeTownVillage;
            obj.HomeTownValue = e.HomeTownValue;
            obj.HomeTownJson = e.HomeTownJson;
            obj.Job = e.Job;
            obj.WorkingProgress = e.WorkingProgress;
            obj.ProfileCode = $scope.infUser.ResumeNumber;
            obj.Id = e.Id;
            obj.ClassComposition = e.class;
            obj.BirthPlace = e.BirthPlace;
            $scope.model.push(obj)

        });
        dataservice.insertFamily($scope.model, function (result) {
            result = result.data;
            if (result.Error) {
                App.toastrError(result.Title);
            } else {
                App.toastrSuccess(result.Title);
                $scope.getFamilyByProfileCode();
                /*$scope.selectedFamily = {
                    WorkingProgress: `Từ năm 18 tuổi đến năm`
                };*/
            }
        })

        console.log($scope.model);
    }
    function insertFamily2(familyArray, index) {
        if (index < familyArray.length) {
            var relation = familyArray[index];
            $scope.model = [
                {
                    Relation: relation,
                    ProfileCode: $scope.infUser.ResumeNumber
                }
            ];

            dataservice.insertFamily($scope.model, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    $scope.getFamilyByProfileCode();
                    // Gọi đệ qui để chuyển sang lưu thông tin gia đình tiếp theo trong mảng
                    insertFamily2(familyArray, index + 1);
                }
            });

            console.log($scope.model);
        }
    }


    $scope.updateFamily = function (x) {
        $scope.modelPersonal = x;

        dataservice.updateFamily($scope.modelPersonal, function (rs) {
            console.log($scope.modelPersonal);
            rs = rs.data;
            console.log(rs);
        })
        $scope.selectedPersonHistory = {};
        console.log($scope.modelPersonal);
    }
    //

    // AdmissionProfile


    //Những công tác và chức vụ đã qua
    $scope.getBusinessNDutyById = function () {
        $scope.id = 2;
        dataservice.getBusinessNDutyById($scope.id, function (rs) {
            rs = rs.data;
            console.log(rs.data);
        })
        console.log($scope.id);
    }
    //ĐẶC ĐIỂM LỊCH SỬ

    $scope.setIsUpdateForPartyAdmissionProfile = function (user) {
        if (isHadProfile(user)) {
            $scope.isUpdate = true;
        }
        else $scope.isUpdate = false;
    }
    $scope.submitPartyAdmissionProfile = function () {
        if ($scope.GroupUser == NaN || $scope.GroupUser == '') {
            $scope.errorGroupUser = true;
        }
        else {
            $scope.errorGroupUser = false;

        }
        if ($scope.infUser.MaritalStatus == undefined || $scope.infUser.MaritalStatus.marriedStatus == '') {
            $scope.errorMarital = true;
        }
        else {
            $scope.errorMarital = false;

        }
        if ($scope.forms.edit.validate()) {
            if ($rootScope.regexDate.test($scope.infUser.Birthday)) {
                $scope.infUser.Birthday = convertDateFormat($scope.infUser.Birthday);
            }
            $scope.err = false
            var pattern = /^[0-9]+$/;
            var datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
            var datePattern2 = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
            if ($scope.infUser.LastName == "" || $scope.infUser.LastName == null || $scope.infUser.LastName == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường Họ và tên trống")
                return;

            } if ($scope.infUser.Birthday == "" || $scope.infUser.Birthday == null || $scope.infUser.Birthday == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường Ngày sinh trống")
                return;



                /*        } if (!datePattern.test($scope.infUser.Birthday) || !datePattern2.test($scope.infUser.Birthday)) {
                            $scope.err = true
                            App.toastrError("Ngày tháng năm sinh không đúng định dạng")
                            return;*/
            }
            if ($scope.infUser.FirstName == "" || $scope.infUser.FirstName == null || $scope.infUser.FirstName == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường Họ và tên khai sinh trống")
                return;

            } if ($scope.infUser.Sex == "" || $scope.infUser.Sex == null || $scope.infUser.Sex == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường Giới tính trống")
                return;

            } if ($scope.infUser.Nation == "" || $scope.infUser.Nation == null || $scope.infUser.Nation == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường Dân tộc trống")
                return;

            } if ($scope.infUser.Religion == "" || $scope.infUser.Religion == null || $scope.infUser.Religion == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường Tôn giáo trống")
                return;

            } if ($scope.infUser.Residence == "" || $scope.infUser.Residence == null || $scope.infUser.Residence == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường Địa chỉ thường trú trống")
                return;
            }
            if ($scope.infUser.PlaceofBirth == "" || $scope.infUser.PlaceofBirth == null || $scope.infUser.PlaceofBirth == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường Nơi sinh trống")
                return;

            } if ($scope.infUser.NowEmployee == "" || $scope.infUser.NowEmployee == null || $scope.infUser.NowEmployee == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường Công việc hiện tại trống")
                return;

            } if ($scope.infUser.HomeTown == "" || $scope.infUser.HomeTown == null || $scope.infUser.HomeTown == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường Quê quán trống")
                return;

                // } if ($scope.infUser.TemporaryAddress == "" || $scope.infUser.TemporaryAddress == null || $scope.infUser.TemporaryAddress == undefined) {
                //     $scope.err = true
                //     App.toastrError("Không được để trường Địa chỉ tạm trú trống")
                //     return;

            } if ($scope.infUser.LevelEducation.GeneralEducation == "" || $scope.infUser.LevelEducation.GeneralEducation == null || $scope.infUser.LevelEducation.GeneralEducation == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường Giáo dục phổ thông trống")
                return;
            } if ($scope.infUser.Phone == "" || $scope.infUser.Phone == null || $scope.infUser.Phone == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường Số điện thoại trống")
                return;

            } if ($scope.GroupUser == "" || $scope.GroupUser == null || $scope.GroupUser == undefined) {
                $scope.err = true
                App.toastrError("Bạn chưa chọn nhóm chi bộ để xử lý")
                return;

            } if ($scope.infUser.Phone.length != 10 || !pattern.test($scope.infUser.Phone)) {
                $scope.err = true
                App.toastrError("Vui lòng nhập số điện thoại hợp lệ")
                return;
            }
            if ($scope.SelfComment.context === "" || $scope.SelfComment.context == null || $scope.SelfComment.context == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường tự nhận xét trống")
                return;
            }


            if ($scope.infUser.MaritalStatus.marriedStatus === "" || $scope.infUser.MaritalStatus.marriedStatus == null || $scope.infUser.MaritalStatus.marriedStatus == undefined) {
                $scope.infUser.MaritalStatus.marriedStatus === '1'
            } else if ($scope.infUser.MaritalStatus.marriedStatus === '2') {
                if ($scope.infUser.MaritalStatus.decisionNumber === "" || $scope.infUser.MaritalStatus.decisionNumber == null || $scope.infUser.MaritalStatus.decisionNumber == undefined) {
                    $scope.err = true
                    App.toastrError("Không được để trường số quyết định trống")
                    return;
                }
                if ($scope.infUser.MaritalStatus.decisionDate === "" || $scope.infUser.MaritalStatus.decisionDate == null || $scope.infUser.MaritalStatus.decisionDate == undefined) {
                    $scope.err = true
                    App.toastrError("Không được để trường ngày quyết định trống")
                    return;
                }
                if ($scope.infUser.MaritalStatus.location === "" || $scope.infUser.MaritalStatus.location == null || $scope.infUser.MaritalStatus.location == undefined) {
                    $scope.err = true
                    App.toastrError("Không được để trường địa điểm quyết định trống")
                    return;
                }
            }


            if ($scope.thon_Residence === "" || $scope.thon_Residence == null || $scope.thon_Residence == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường địa chỉ thôn trong địa chỉ thường chú trống")
                return;
            }
            if ($scope.thon_PlaceofBirth === "" || $scope.thon_PlaceofBirth == null || $scope.thon_PlaceofBirth == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường địa chỉ thôn trong nơi sinh trống")
                return;
            }
            if ($scope.thon_HomeTown === "" || $scope.thon_HomeTown == null || $scope.thon_HomeTown == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường địa chỉ thôn trong quê quán trống")
                return;
            }
            //if ($scope.placeAddress === "" || $scope.placeAddress == null || $scope.placeAddress == undefined) {
            //    $scope.err = true
            //    App.toastrError("Không được để trường Ngày kết nạp đoàn trống")
            //    return;
            //}

            if ($scope.err == true) {
                return
            }

            var parts = $scope.infUser.Birthday.split("/");
            if (parts.length === 3) {
                var formattedBirthday = parts[0] + "-" + parts[1] + "-" + parts[2];
                $scope.infUser.Birthday = formattedBirthday;
            }

            var parts = $scope.infUser.Birthday.split("-");
            if (parts.length === 3) {
                $scope.infUser.Birthday
            }
            else {
                $scope.err = true
                App.toastrError("Sai định dạng ngày sinh DD/MM/YYYY")
                return;
            }


            if ($scope.placeAddress) {
                var partsPlaceAddress = $scope.placeAddress.split("/");
                var partsJoinDate = $scope.placeAddress.split("-");
                if (partsPlaceAddress.length === 3) {
                    var formattedPlaceAddress = partsPlaceAddress[0] + "-" + partsPlaceAddress[1] + "-" + partsPlaceAddress[2];
                    $scope.placeAddress = formattedPlaceAddress;
                }
                else if (partsJoinDate.length !== 3) {
                    $scope.err = true
                    App.toastrError("Sai định dạng ngày kết nạp đoàn DD/MM/YYYY")
                    return;
                }

                var partsPlaceAddress = $scope.placeAddress.split("-");
                if (partsPlaceAddress.length === 3) {
                    $scope.placeAddress
                }
                else {
                    $scope.err = true
                    App.toastrError("Sai định dạng ngày kết nạp đoàn DD/MM/YYYY")
                    return;
                }
            }
            if ($scope.err == false) {
                if ($scope.UserName != null && $scope.UserName != undefined) {
                    if ($scope.forms.edit.validate()) {
                        $scope.model = {}
                        $scope.model.CurrentName = $scope.infUser.LastName;
                        $scope.model.Birthday = $scope.infUser.Birthday;
                        $scope.model.BirthName = $scope.infUser.FirstName;
                        $scope.model.Gender = $scope.infUser.Sex;
                        $scope.model.Nation = $scope.infUser.Nation;
                        $scope.model.Religion = $scope.infUser.Religion;
                        $scope.model.PermanentResidence = [$scope.infUser.Residence, $scope.thon_Residence].join('_');
                        $scope.model.Phone = $scope.infUser.Phone;
                        $scope.model.PlaceBirth = [$scope.infUser.PlaceofBirth, $scope.thon_PlaceofBirth].join('_');
                        $scope.model.BirthPlaceValue = $scope.infUser.BirthPlaceValue;
                        $scope.model.BirthPlaceVillage = $scope.thon_PlaceofBirth;
                        $scope.model.HomeTownValue = $scope.infUser.HomeTownValue;
                        $scope.model.HomeTownVillage = $scope.thon_HomeTown;
                        $scope.model.PermanentResidenceValue = $scope.infUser.ResidenceValue;
                        $scope.model.PermanentResidenceVillage = $scope.thon_Residence;
                        $scope.model.TemporaryAddressValue = $scope.infUser.TemporaryAddressValue;
                        $scope.model.TemporaryAddressVillage = $scope.thon_TemporaryAddress;
                        $scope.model.Job = $scope.infUser.NowEmployee;
                        $scope.model.HomeTown = [$scope.infUser.HomeTown, $scope.thon_HomeTown].join('_');
                        $scope.model.TemporaryAddress = [$scope.infUser.TemporaryAddress, $scope.thon_TemporaryAddress].join('_');
                        $scope.model.GeneralEducation = $scope.infUser.LevelEducation.GeneralEducation;
                        $scope.model.JobEducation = $scope.infUser.LevelEducation.VocationalTraining;
                        const educations = $scope.infUser.LevelEducation.Undergraduate;
                        $scope.model.UnderPostGraduateEducation = educations && educations.constructor === Array ? '' : educations;
                        $scope.model.Degree = $scope.infUser.LevelEducation.RankAcademic;
                        $scope.model.Picture = '';
                        const fLanguages = $scope.infUser.LevelEducation.ForeignLanguage;
                        $scope.model.ForeignLanguage = fLanguages && fLanguages.constructor === Array ? '' : fLanguages;
                        const mLanguages = $scope.infUser.LevelEducation.MinorityLanguage;
                        $scope.model.MinorityLanguages = mLanguages && mLanguages.constructor === Array ? '' : mLanguages;
                        const its = $scope.infUser.LevelEducation.It;
                        $scope.model.ItDegree = its && its.constructor === Array ? '' : its;
                        const theories = $scope.infUser.LevelEducation.PoliticalTheory;
                        $scope.model.PoliticalTheory = theories && theories.constructor === Array ? '' : theories;
                        $scope.model.SelfComment = $scope.SelfComment.context;
                        $scope.model.CreatedPlace = [($scope.PlaceCreatedTime?.place ?? ''), $scope.placeAddress].join('_');
                        $scope.model.ResumeNumber = $scope.infUser.ResumeNumber;
                        $scope.model.Status = $scope.infUser.Status;
                        $scope.model.UserName = $scope.UserName;
                        $scope.model.WfInstCode = $scope.infUser.WfInstCode;
                        $scope.model.GroupUserCode = $scope.GroupUser;
                        if ($scope.infUser.MaritalStatus.marriedStatus === "1" || $scope.infUser.MaritalStatus.marriedStatus === "3") {
                            $scope.infUser.MaritalStatus.marriedStatus = $scope.infUser.MaritalStatus.marriedStatus
                            $scope.infUser.MaritalStatus.decisionNumber = "1"
                            $scope.infUser.MaritalStatus.decisionDate = "30/12/2023"
                            $scope.infUser.MaritalStatus.location = ""

                        }
                        $scope.model.MarriedStatus = Object.values($scope.infUser.MaritalStatus).join('_');
                        console.log($scope.model.MarriedStatus);
                        var promises = [];

                        var PermanentResidence = $scope.infUser.Residence.split('_');
                        if (PermanentResidence.length >= 3) {
                            var permanentResidencePromise = Promise.all([
                                new Promise((resolve, reject) => {
                                    try {
                                        dataservice.GetTinh(PermanentResidence[0], function (rs) {
                                            if (rs.data && rs.data[0]) {
                                                $scope.PermanentResidenceTinh = rs.data[0].name;
                                                resolve();
                                            }
                                        });
                                    } catch (e) {
                                        console.log(e);
                                        resolve();
                                    }
                                }),
                                new Promise((resolve, reject) => {
                                    try {
                                        dataservice.GetHuyen(PermanentResidence[1], function (rs) {
                                            if (rs.data && rs.data[0]) {
                                                $scope.PermanentResidenceHuyen = rs.data[0].name;
                                                resolve();
                                            }
                                        });
                                    } catch (e) {
                                        console.log(e);
                                        resolve();
                                    }
                                }),
                                new Promise((resolve, reject) => {
                                    try {
                                        dataservice.GetXa(PermanentResidence[2], function (rs) {
                                            if (rs.data && rs.data[0]) {
                                                $scope.PermanentResidenceXa = rs.data[0].name;
                                                resolve();
                                            }
                                        });
                                    } catch (e) {
                                        console.log(e);
                                        resolve();
                                    }
                                })
                            ]);

                            promises.push(permanentResidencePromise);

                            permanentResidencePromise
                                .then(() => console.log('permanentResidencePromise ok'))
                                .catch((e) => console.log('permanentResidencePromise', e));
                        }

                        var TemporaryAddress = $scope.infUser.TemporaryAddress.split('_');
                        if (TemporaryAddress.length >= 3) {
                            const listPromise = [];
                            if (TemporaryAddress[0]) {
                                listPromise.push(new Promise((resolve, reject) => {
                                    try {
                                        dataservice.GetTinh(TemporaryAddress[0], function (rs) {
                                            if (rs.data && rs.data[0]) {
                                                $scope.TemporaryAddressTinh = rs.data[0].name;
                                                resolve();
                                            }
                                        });
                                    } catch (e) {
                                        console.log(e);
                                        resolve();
                                    }
                                }));
                            }
                            if (TemporaryAddress[1]) {
                                listPromise.push(new Promise((resolve, reject) => {
                                    try {
                                        dataservice.GetHuyen(TemporaryAddress[1], function (rs) {
                                            if (rs.data && rs.data[0]) {
                                                $scope.TemporaryAddressHuyen = rs.data[0].name;
                                                resolve();
                                            }
                                        });
                                    } catch (e) {
                                        console.log(e);
                                        resolve();
                                    }
                                }));
                            }
                            if (TemporaryAddress[2]) {
                                listPromise.push(new Promise((resolve, reject) => {
                                    try {
                                        dataservice.GetXa(TemporaryAddress[2], function (rs) {
                                            if (rs.data && rs.data[0]) {
                                                $scope.TemporaryAddressXa = rs.data[0].name;
                                                resolve();
                                            }
                                        });
                                    } catch (e) {
                                        console.log(e);
                                        resolve();
                                    }
                                }));
                            }
                            if (listPromise.length > 0) {
                                var temporaryAddressPromise = Promise.all(listPromise);

                                promises.push(temporaryAddressPromise);

                                temporaryAddressPromise
                                    .then(() => console.log('temporaryAddressPromise ok'))
                                    .catch((e) => console.log('temporaryAddressPromise', e));
                            }
                        }

                        var HomeTown = $scope.infUser.HomeTown.split('_');
                        if (HomeTown.length >= 3) {
                            var homeTownPromise = Promise.all([
                                new Promise((resolve, reject) => {
                                    try {
                                        dataservice.GetTinh(HomeTown[0], function (rs) {
                                            if (rs.data && rs.data[0]) {
                                                $scope.HomeTownTinh = rs.data[0].name;
                                                resolve();
                                            }
                                        });
                                    } catch (e) {
                                        console.log(e);
                                        resolve();
                                    }
                                }),
                                new Promise((resolve, reject) => {
                                    try {
                                        dataservice.GetHuyen(HomeTown[1], function (rs) {
                                            if (rs.data && rs.data[0]) {
                                                $scope.HomeTownHuyen = rs.data[0].name;
                                                resolve();
                                            }
                                        });
                                    } catch (e) {
                                        console.log(e);
                                        resolve();
                                    }
                                }),
                                new Promise((resolve, reject) => {
                                    try {
                                        dataservice.GetXa(HomeTown[2], function (rs) {
                                            if (rs.data && rs.data[0]) {
                                                $scope.HomeTownXa = rs.data[0].name;
                                                resolve();
                                            }
                                        });
                                    } catch (e) {
                                        console.log(e);
                                        resolve();
                                    }
                                })
                            ]);

                            promises.push(homeTownPromise);

                            homeTownPromise
                                .then(() => console.log('homeTownPromise ok'))
                                .catch((e) => console.log('homeTownPromise', e));
                        }

                        var PlaceofBirth = $scope.infUser.PlaceofBirth.split('_');
                        if (PlaceofBirth.length >= 3) {
                            var placeofBirthPromise = Promise.all([
                                new Promise((resolve, reject) => {
                                    try {
                                        dataservice.GetTinh(PlaceofBirth[0], function (rs) {
                                            if (rs.data && rs.data[0]) {
                                                $scope.PlaceofBirthTinh = rs.data[0].name;
                                                resolve();
                                            }
                                        });
                                    } catch (e) {
                                        console.log(e);
                                        resolve();
                                    }
                                }),
                                new Promise((resolve, reject) => {
                                    try {
                                        dataservice.GetHuyen(PlaceofBirth[1], function (rs) {
                                            if (rs.data && rs.data[0]) {
                                                $scope.PlaceofBirthHuyen = rs.data[0].name;
                                                resolve();
                                            }
                                        });
                                    } catch (e) {
                                        console.log(e);
                                        resolve();
                                    }
                                }),
                                new Promise((resolve, reject) => {
                                    try {
                                        dataservice.GetXa(PlaceofBirth[2], function (rs) {
                                            if (rs.data && rs.data[0]) {
                                                $scope.PlaceofBirthXa = rs.data[0].name;
                                                resolve();
                                            }
                                        });
                                    } catch (e) {
                                        console.log(e);
                                        resolve();
                                    }
                                })
                            ]);

                            promises.push(placeofBirthPromise);

                            placeofBirthPromise
                                .then(() => console.log('placeofBirthPromise ok'))
                                .catch((e) => console.log('placeofBirthPromise', e));
                        }

                        Promise.all(promises).then(() => {
                            $scope.AddressTextPermanentResidence = [$scope.PermanentResidenceXa, $scope.PermanentResidenceHuyen, $scope.PermanentResidenceTinh].join(",")
                            $scope.AddressTextTemporaryAddress = [$scope.TemporaryAddressXa, $scope.TemporaryAddressHuyen, $scope.TemporaryAddressTinh].join(",")
                            $scope.AddressTextHomeTown = [$scope.HomeTownXa, $scope.HomeTownHuyen, $scope.HomeTownTinh].join(",")
                            $scope.AddressTextPlaceofBirth = [$scope.PlaceofBirthXa, $scope.PlaceofBirthHuyen, $scope.PlaceofBirthTinh].join(",")

                            $scope.model.AddressText = [$scope.AddressTextPermanentResidence, $scope.AddressTextTemporaryAddress, $scope.AddressTextHomeTown, $scope.AddressTextPlaceofBirth].join("_");
                            if ($scope.infUser.ResumeNumber != '' && $scope.infUser.ResumeNumber != undefined) {
                                console.log($scope.model);
                                dataservice.update($scope.model, function (result) {
                                    result = result.data;
                                    if (result.Error) {
                                        App.toastrError(result.Title);
                                    } else {
                                        App.toastrSuccess(result.Title);
                                        $scope.getPartyAdmissionProfileByUsername();
                                    }

                                });
                            } else {

                                dataservice.insert($scope.model, function (result) {
                                    result = result.data;
                                    if (result.Error) {
                                        App.toastrError(result.Title);
                                    } else {
                                        App.toastrSuccess(result.Title);
                                        $scope.infUser.ResumeNumber = result.Object.ResumeNumber;
                                        $scope.getPartyAdmissionProfileByUsername();
                                        var family = ["Ông nội", "Bà nội", "Ông ngoại", "Bà ngoại", "Bố đẻ", "Mẹ đẻ"]
                                        // for (let index = 0; index < family.length; index++) {
                                        insertFamily2(family, 0);

                                        // }

                                    }

                                });

                            }
                        })
                    }


                }
            }
        }

        /*if ($scope.infUser.MaritalStatus.marriedStatus === "" || $scope.infUser.MaritalStatus.marriedStatus == null || $scope.infUser.MaritalStatus.marriedStatus == undefined) {
            $scope.infUser.MaritalStatus.marriedStatus === '1'
        } else if ($scope.infUser.MaritalStatus.marriedStatus === '2') {
            if ($scope.infUser.MaritalStatus.decisionNumber === "" || $scope.infUser.MaritalStatus.decisionNumber == null || $scope.infUser.MaritalStatus.decisionNumber == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường số quyết định trống")
                return;
            }
            if ($scope.infUser.MaritalStatus.decisionDate === "" || $scope.infUser.MaritalStatus.decisionDate == null || $scope.infUser.MaritalStatus.decisionDate == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường ngày quyết định trống")
                return;
            }
            if ($scope.infUser.MaritalStatus.location === "" || $scope.infUser.MaritalStatus.location == null || $scope.infUser.MaritalStatus.location == undefined) {
                $scope.err = true
                App.toastrError("Không được để trường địa điểm quyết định trống")
                return;
            }
        }
    
        if ($scope.err == true) {
            return
        }
    
        var parts = $scope.infUser.Birthday.split("/");
        if (parts.length === 3) {
            var formattedBirthday = parts[0] + "-" + parts[1] + "-" + parts[2];
            $scope.infUser.Birthday = formattedBirthday;
        }
    
        var parts = $scope.infUser.Birthday.split("-");
        if (parts.length === 3) {
            $scope.infUser.Birthday
        }
        else {
            $scope.err = true
            App.toastrError("Sai định dạng ngày sinh DD/MM/YYYY")
            return;
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
            $scope.model.PlaceWorking = $scope.infUser.PlaceWorking;
            $scope.model.MarriedStatus = Object.values($scope.infUser.MaritalStatus).join('_');
            // $scope.model.MarriedStatus = $scope.infUser.MarriedStatus;
            console.log($scope.model.MaritalStatus);
    
            if ($scope.infUser.ResumeNumber != '' && $scope.infUser.ResumeNumber != undefined &&
                $scope.Username != '' && $scope.Username != undefined) {
                console.log($scope.model);
                if ($scope.SaveJson == true) {
                    const body = {
                        Profile: $scope.model,
                        Families: $scope.Relationship,
                        PersonalHistories: $scope.PersonalHistory,
                        WorkingTracking: $scope.BusinessNDuty,
                        HistorySpecialist: $scope.HistoricalFeatures,
                        Awards: $scope.Laudatory,
                        WarningDisciplineds: $scope.Disciplined,
                        TrainingCertificatedPasses: $scope.PassedTrainingClasses,
                        GoAboards: $scope.GoAboard,
                        IntroducerOfParty: $scope.Introducer,
                    };
                    console.log(body);
                    $scope.ImportFile(body);
                    return
                }
                dataservice.update($scope.model, function (result) {
                    result = result.data;
                    if (result.Error) {
                        App.toastrError(result.Title);
                    } else {
                        App.toastrSuccess(result.Title);
                        $scope.getListFile()
    
                    }
                });
            }
    
            console.log($scope.model);
        }*/

    }

    $scope.addToPersonalHistory = function () {
        if ($scope.forms.personalHis.validate()) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
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
            /*  if ($scope.selectedPersonHistory.End > currentYear || $scope.selectedPersonHistory.Begin > currentYear || $scope.selectedPersonHistory.Begin > $scope.selectedPersonHistory.End) {
                  App.toastrError("Năm nhập vào không hợp lệ")
                  $scope.err = true
                  return
              }*/
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
            model.Type = $scope.selectedPersonHistory.Type;

            $scope.PersonalHistory.push(model);
            $scope.deleteselectPersonHistory();
        }
    }


    $scope.deleteselectPersonHistory = function () {
        $scope.selectedPersonHistory = {};
        for (var i = 0; i < $scope.PersonalHistory.length; i++) {
            $scope.PersonalHistory[i].selected = false;
        }
        $scope.changeHistory()
        $scope.resetValidateFamily()
    };

    $scope.submitPersonalHistorys = function () {
        $scope.model = [];
        if ($scope.PersonalHistory.length > 0) {
            $scope.PersonalHistory.forEach(function (personalHistory) {
                var obj = {};
                obj.Begin = personalHistory.Begin;
                obj.End = personalHistory.End;
                obj.Content = personalHistory.Content;
                obj.ProfileCode = $scope.infUser.ResumeNumber;
                obj.Id = personalHistory.Id;
                $scope.model.push(obj)
            });
            dataservice.insertPersonalHistory($scope.model, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                    $scope.getPersonalHistoryByProfileCode();
                }
            });
        } else {
            App.toastrError("Bạn chưa thêm nội dung vào trường này");
        }


        console.log($scope.model);
    }

    $scope.addToDisciplined = function () {
        if ($scope.forms.Disciplined.validate()) {

            if ($scope.selectedWarningDisciplined.MonthYear == null || $scope.selectedWarningDisciplined.MonthYear == undefined || $scope.selectedWarningDisciplined.MonthYear == '') {
                return
            }
            if ($scope.selectedWarningDisciplined.Reason == null || $scope.selectedWarningDisciplined.Reason == undefined || $scope.selectedWarningDisciplined.Reason == '') {
                return
            }
            if ($scope.selectedWarningDisciplined.GrantOfDecision == null || $scope.selectedWarningDisciplined.GrantOfDecision == undefined || $scope.selectedWarningDisciplined.GrantOfDecision == '') {
                return
            }
            var model = {}
            model.MonthYear = $scope.selectedWarningDisciplined.MonthYear
            model.GrantOfDecision = $scope.selectedWarningDisciplined.GrantOfDecision
            model.Reason = $scope.selectedWarningDisciplined.Reason
            model.Id = 0;
            $scope.Disciplined.push(model)
            $scope.deleteSelectaddToDisciplined();
        }

    }

    $scope.deleteSelectaddToDisciplined = function () {
        $scope.selectedWarningDisciplined = {};
        $scope.resetValidateFamily()
    }

    $scope.submitDisciplined = function () {
        console.log($scope.Disciplined)
        $scope.model = [];
        if ($scope.Disciplined.length > 0) {
            $scope.Disciplined.forEach(function (e) {
                var obj = {};
                obj.MonthYear = e.MonthYear;
                obj.Reason = e.Reason;
                obj.GrantOfDecision = e.GrantOfDecision;
                obj.ProfileCode = $scope.infUser.ResumeNumber;
                obj.Id = e.Id;
                $scope.model.push(obj)
            });
            dataservice.insertWarningDisciplined($scope.model, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                    $scope.getWarningDisciplinedByProfileCode();
                }
            })
        } else {
            App.toastrError("Bạn chưa thêm nội dung vào trường này");
        }

    }
    $scope.addToBusinessNDuty = function () {
        if ($scope.forms.BusinessNDuty.validate()) {
            if ($scope.selectedWorkingTracking.From == null || $scope.selectedWorkingTracking.From == undefined || $scope.selectedWorkingTracking.From == '') {
                return
            }
            if ($scope.selectedWorkingTracking.To == null || $scope.selectedWorkingTracking.To == undefined || $scope.selectedWorkingTracking.To == '') {
                return
            }
            if ($scope.selectedWorkingTracking.Work == null || $scope.selectedWorkingTracking.Work == undefined || $scope.selectedWorkingTracking.Work == '') {
                return
            }
            if ($scope.selectedWorkingTracking.Role == null || $scope.selectedWorkingTracking.Role == undefined || $scope.selectedWorkingTracking.Role == '') {
                return
            }
            var model = {}
            model.From = $scope.selectedWorkingTracking.From
            model.To = $scope.selectedWorkingTracking.To
            model.Work = $scope.selectedWorkingTracking.Work
            model.Role = $scope.selectedWorkingTracking.Role

            model.Id = 0;
            $scope.BusinessNDuty.push(model)
            $scope.deleteSelectToBusinessNDuty();
        }


    }

    $scope.deleteSelectToBusinessNDuty = function () {
        $scope.selectedWorkingTracking = {};
        $scope.resetValidateFamily()

    }

    $scope.submitBusinessNDuty = function () {
        $scope.model = [];
        if ($scope.BusinessNDuty.length > 0) {
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
            dataservice.insertBusinessNDuty($scope.model, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                    $scope.getWorkingTrackingByProfileCode();
                }
            })
        } else {
            App.toastrError("Bạn chưa thêm nội dung vào trường này");
        }

        console.log($scope.model);
    }

    $scope.addToHistorySpecialist = function () {
        if ($scope.forms.HistorySpecialist.validate()) {

            if ($scope.selectedHistorySpecialist.MonthYear == null || $scope.selectedHistorySpecialist.MonthYear == undefined || $scope.selectedHistorySpecialist.MonthYear == '') {
                return
            }
            if ($scope.selectedHistorySpecialist.Content == null || $scope.selectedHistorySpecialist.Content == undefined || $scope.selectedHistorySpecialist.Content == '') {
                return
            }
            var model = {}
            model.MonthYear = $scope.selectedHistorySpecialist.MonthYear
            model.Content = $scope.selectedHistorySpecialist.Content

            model.Id = 0;
            $scope.HistoricalFeatures.push(model)
            $scope.deleteSelectToHistorySpecialist();
        }
    }

    $scope.deleteSelectToHistorySpecialist = function () {
        $scope.selectedHistorySpecialist = {};
        $scope.resetValidateFamily()

    }

    $scope.submitHistorySpecialist = function () {
        $scope.model = [];
        if ($scope.HistoricalFeatures.length > 0) {
            $scope.HistoricalFeatures.forEach(function (historicalFeatures) {
                var obj = {};
                obj.MonthYear = historicalFeatures.MonthYear;
                obj.Content = historicalFeatures.Content;
                obj.ProfileCode = $scope.infUser.ResumeNumber;
                obj.Id = historicalFeatures.Id;
                $scope.model.push(obj)
            });
            dataservice.insertHistorySpecialist($scope.model, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                    $scope.getHistorySpecialistByProfileCode();
                }
            })
        } else {
            App.toastrError("Bạn chưa thêm nội dung vào trường này");

        }

        console.log($scope.model);
    }


    $scope.addToTrainingCertificatedPass = function () {
        if ($scope.forms.CertificatedPass.validate()) {

            if ($scope.selectedTrainingCertificatedPass.From == null || $scope.selectedTrainingCertificatedPass.From == undefined || $scope.selectedTrainingCertificatedPass.From == '') {
                return
            }
            if ($scope.selectedTrainingCertificatedPass.To == null || $scope.selectedTrainingCertificatedPass.To == undefined || $scope.selectedTrainingCertificatedPass.To == '') {
                return
            }
            if ($scope.selectedTrainingCertificatedPass.SchoolName == null || $scope.selectedTrainingCertificatedPass.SchoolName == undefined || $scope.selectedTrainingCertificatedPass.SchoolName == '') {
                return
            }
            if ($scope.selectedTrainingCertificatedPass.Certificate == null || $scope.selectedTrainingCertificatedPass.Certificate == undefined || $scope.selectedTrainingCertificatedPass.Certificate == '') {
                return
            }
            var model = {}
            model.SchoolName = $scope.selectedTrainingCertificatedPass.SchoolName
            model.Class = $scope.selectedTrainingCertificatedPass.Class
            model.From = $scope.selectedTrainingCertificatedPass.From
            model.To = $scope.selectedTrainingCertificatedPass.To
            model.Certificate = $scope.selectedTrainingCertificatedPass.Certificate
            model.Id = 0;
            $scope.PassedTrainingClasses.push(model)
            $scope.deleteSelectToTrainingCertificatedPass()
        }

    }


    $scope.deleteSelectToTrainingCertificatedPass = function () {
        $scope.selectedTrainingCertificatedPass = {};
        $scope.resetValidateFamily()

    }
    $scope.submitTrainingCertificatedPass = function () {

        $scope.model = [];
        if ($scope.PassedTrainingClasses.length > 0) {
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
            dataservice.insertTrainingCertificatedPass($scope.model, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                    $scope.getTrainingCertificatedPassByProfileCode();
                }
            })
        } else {
            App.toastrError("Bạn chưa thêm nội dung vào trường này");

        }

        console.log($scope.model);
    }

    $scope.addToAward = function () {
        if ($scope.forms.Award.validate()) {

            if ($scope.selectedLaudatory.MonthYear == null || $scope.selectedLaudatory.MonthYear == undefined || $scope.selectedLaudatory.MonthYear == '') {
                return
            }
            if ($scope.selectedLaudatory.GrantOfDecision == null || $scope.selectedLaudatory.GrantOfDecision == undefined || $scope.selectedLaudatory.GrantOfDecision == '') {
                return
            }
            if ($scope.selectedLaudatory.Reason == null || $scope.selectedLaudatory.Reason == undefined || $scope.selectedLaudatory.Reason == '') {
                return
            }
            var model = {}
            model.MonthYear = $scope.selectedLaudatory.MonthYear
            model.GrantOfDecision = $scope.selectedLaudatory.GrantOfDecision
            model.Reason = $scope.selectedLaudatory.Reason
            model.Id = 0;
            $scope.Laudatory.push(model)
            $scope.deleteSelectToAward();
        }

    }

    $scope.deleteSelectToAward = function () {
        $scope.selectedLaudatory = {}
        $scope.resetValidateFamily()

    }

    $scope.submitAward = function () {
        $scope.model = [];
        if ($scope.Laudatory.length > 0) {
            $scope.Laudatory.forEach(function (laudatory) {
                var obj = {};
                obj.MonthYear = laudatory.MonthYear;
                obj.Reason = laudatory.Reason;
                obj.GrantOfDecision = laudatory.GrantOfDecision;
                obj.ProfileCode = $scope.infUser.ResumeNumber;
                obj.Id = laudatory.Id;
                $scope.model.push(obj)
            });
            dataservice.insertAward($scope.model, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                    $scope.getAwardByProfileCode();
                }
            })
        } else {
            App.toastrError("Bạn chưa thêm nội dung vào trường này");
        }



        console.log($scope.model);
    }

    $scope.addToGoAboard = function () {
        if ($scope.forms.GoAboard.validate()) {

            if ($scope.selectedGoAboard.From == null || $scope.selectedGoAboard.From == undefined || $scope.selectedGoAboard.From == '') {
                return
            }
            if ($scope.selectedGoAboard.To == null || $scope.selectedGoAboard.To == undefined || $scope.selectedGoAboard.To == '') {
                return
            }
            if ($scope.selectedGoAboard.Contact == null || $scope.selectedGoAboard.Contact == undefined || $scope.selectedGoAboard.Contact == '') {
                return
            }
            if ($scope.selectedGoAboard.Country == null || $scope.selectedGoAboard.Country == undefined || $scope.selectedGoAboard.Country == '') {
                return
            }
            var obj = {};
            var model = {}
            model.From = $scope.selectedGoAboard.From;
            model.To = $scope.selectedGoAboard.To;
            model.Contact = $scope.selectedGoAboard.Contact;
            model.Country = $scope.selectedGoAboard.Country;

            model.ProfileCode = $scope.infUser.ResumeNumber;
            model.Id = 0;
            dataservice.insertGoAboard(model, function (rs) {
                rs = rs.data;
                $scope.getGoAboardByProfileCode()
                console.log(rs);
            })
            console.log(model);
            $scope.deleteSelectToGoAboard();
        }

    }


    $scope.deleteSelectToGoAboard = function () {
        $scope.selectedGoAboard = {};
        $scope.resetValidateFamily()
    }

    $scope.submitGoAboard = function () {
        $scope.model = [];
        if ($scope.GoAboard.length > 0) {
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
            dataservice.insertGoAboards($scope.model, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                    $scope.getGoAboardByProfileCode();
                }
            })
        } else {
            App.toastrError("Bạn chưa thêm nội dung vào trường này");
        }
    }


    $scope.submitIntroducer = function () {
        if ($scope.forms.Introducer.validate()) {
            $scope.model = {};
            if ($scope.UserName != null && $scope.UserName != undefined) {
                $scope.model.PersonIntroduced = $scope.Introducer.PersonIntroduced;
                $scope.model.PlaceTimeJoinUnion = $scope.Introducer.PlaceTimeJoinUnion;
                $scope.model.PlaceTimeJoinParty = $scope.Introducer.PlaceTimeJoinParty;
                $scope.model.PlaceTimeRecognize = $scope.Introducer.PlaceTimeRecognize;
                $scope.model.ProfileCode = $scope.infUser.ResumeNumber;
                $scope.model.Id = $scope.Introducer.Id;
            };
            dataservice.insertIntroducer($scope.model, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                    $scope.getIntroducerOfPartyByProfileCode()
                }
            })
        }
    }
    //getById
    $scope.getBusinessNDutyById = function () {
        $scope.id = 2;
        dataservice.getBusinessNDutyById($scope.id, function (rs) {
            rs = rs.data;
            console.log(rs.data);
        })
        console.log($scope.id);
    }

    $scope.getHistorySpecialistById = function () {
        $scope.id = 2;
        dataservice.getHistorySpecialistById($scope.id, function (rs) {
            rs = rs.data;
            console.log(rs.data);
        })
        console.log($scope.id);
    }

    $scope.getAwardById = function () {
        $scope.id = 2;
        dataservice.getAwardById($scope.id, function (rs) {
            rs = rs.data;
            console.log(rs.data);
        })
        console.log($scope.id);
    }
    $scope.getWarningDisciplinedById = function () {
        $scope.id = 2;
        dataservice.getWarningDisciplinedById($scope.id, function (rs) {
            rs = rs.data;
            console.log(rs.data);
        })
        console.log($scope.id);
    }

    //Get By Profilecode
    $scope.getFamilyByProfileCode = function () {
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetFamilyByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                $scope.Relationship = response;
                console.log($scope.Relation);
                response.forEach(obj => {
                    const parts = obj.BirthYear.split('_');
                    if (parts.length === 2) {
                        obj.die = parts[0];
                        obj.BirthYear = parts[1];
                    } else if (parts.length >= 4) {
                        obj.die = parts[0];
                        obj.BirthYear = parts[1];
                        obj.AddressDie = parts[2];
                        obj.Reason = parts[3];
                    } else {
                        obj.die = parts[0];
                        obj.BirthYear = parts[1];
                    }

                    const partMember = obj.PartyMember.split('_');
                    partMember[0]
                    partMember[1]
                    partMember[2]
                    if (partMember) {
                        if (partMember.length < 3) {
                            obj.wordAt = partMember[0];
                            obj.PartyMember = true;
                        }

                        if (partMember.length === 3 && partMember[1] === "true") {
                            obj.wordAt = partMember[0];
                            obj.PartyMember = true;
                            obj.Party = partMember[2]
                        }
                    } else {
                        obj.wordAt = false;
                        obj.PartyMember = partMember[1];
                    }
                    if (obj.die === "true") {
                        obj.die = true;
                    } else if (obj.die === "false") {
                        obj.die = false;
                    } else {
                        obj.die = false;
                    }

                    // if (obj.ClassComposition) {
                    //     const partsClassComposition = obj.ClassComposition.split('_');
                    //     if (partsClassComposition.length === 2) {
                    //         obj.AddressBirth = partsClassComposition[0];
                    //         obj.class = partsClassComposition[1];
                    //     }
                    // }

                    obj.class = obj.ClassComposition;

                    if (obj.PartyMember === "true") {
                        obj.PartyMember = true;
                    } else if (obj.PartyMember === "false") {
                        obj.PartyMember = false;
                    }
                })
            },
            error: function (error) {
                console.log(error);
            }
        });

    }

    // $scope.getFamilyByProfileCode = function () {
    //     dataservice.getFamilyByProfileCode($scope.infUser.ResumeNumber, function (rs) {
    //         rs = rs.data;
    //         $scope.Relation = rs;
    //         console.log($scope.infUser.ResumeNumber);
    //     })
    //     
    // }

    $scope.getPersonalHistoryByProfileCode = function () {
        var requestData = { id: $scope.id };
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetPersonalHistoryByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
            success: function (response) {
                $scope.PersonalHistory = response;
                $scope.selectedPersonHistory = {};
                var parts = $scope.infUser.Birthday.split("-");
                const year2 = Number(parts[2]);
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                if (year2 && year2 >= 1945 && year2 + 18 < currentYear) {

                    if ($scope.PersonalHistory.length === 0) {
                        $scope.selectedPersonHistory.Begin = `9/${year2 + 6}`;

                    } else {
                        const year3 = $scope.PersonalHistory[$scope.PersonalHistory.length - 1].End.split("/")
                        if (year3.length == 2) {
                            var yearEnd = Number(year3[1]);
                            var monthEnd = Number(year3[0]);
                        } else if (year3.length == 3) {
                            var yearEnd = Number(year3[2]);
                            var monthEnd = Number(year3[1]);
                        } else if (year3.length == 1) {
                            var yearEnd = Number(year3);
                            var monthEnd = "";
                        } else {
                            $scope.selectedPersonHistory.Begin = `9/${year2 + 6}`;
                            return
                        }
                        const currentDate = new Date();
                        const currentYear = currentDate.getFullYear();
                        if (monthEnd === 12) {
                            $scope.selectedPersonHistory.Begin = `1/${yearEnd + 1}`;
                        } else {
                            $scope.selectedPersonHistory.Begin = `${monthEnd + 1}/${yearEnd}`;
                        }

                    }
                } else {

                }
                //$scope.$apply();
                console.log($scope.PersonalHistory);
            },
            error: function (error) {
                console.log(error);
            }
        });

    }

    $scope.getGoAboardByProfileCode = function () {
        $.ajax({
            type: "GET",
            url: "/UserProfile/GetGoAboardByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $scope.GoAboard = response;
                //$scope.$apply();
                console.log($scope.GoAboard);
                setTimeout(() => $scope.$apply());
            },
            error: function (error) {
                console.log(error);
            }
        });

    }
    $scope.getAwardByProfileCode = function () {
        var requestData = { id: $scope.id };
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetAwardByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
            success: function (response) {
                $scope.Laudatory = response;
                //$scope.$apply();
                console.log($scope.Laudatory);
            },
            error: function (error) {
                console.log(error);
            }
        });

    }

    $scope.getWorkingTrackingByProfileCode = function () {
        var requestData = { id: $scope.id };
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetWorkingTrackingByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
            success: function (response) {
                $scope.BusinessNDuty = response;
                //$scope.$apply();
                console.log($scope.BusinessNDuty);
            },
            error: function (error) {
                console.log(error);
            }
        });

    }
    $scope.getHistorySpecialistByProfileCode = function () {
        var requestData = { id: $scope.id };
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetHistorySpecialistByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
            success: function (response) {
                $scope.HistoricalFeatures = response;
                //$scope.$apply();
                console.log($scope.HistoricalFeatures);
            },
            error: function (error) {
                console.log(error);
            }
        });

    }

    $scope.getTrainingCertificatedPassByProfileCode = function () {
        var requestData = { id: $scope.id };
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetTrainingCertificatedPassByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
            success: function (response) {
                $scope.PassedTrainingClasses = response;
                //$scope.$apply();
                console.log($scope.PassedTrainingClasses);
            },
            error: function (error) {
                console.log(error);
            }
        });

    }

    $scope.getWarningDisciplinedByProfileCode = function () {
        var requestData = { id: $scope.id };
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetWarningDisciplinedByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
            success: function (response) {
                $scope.Disciplined = response;
                //$scope.$apply();
                console.log($scope.Disciplined);
            },
            error: function (error) {
                console.log(error);
            }
        });

    }
    $scope.Introducer = {};

    $scope.getIntroducerOfPartyByProfileCode = function () {
        $.ajax({
            type: "POST",
            url: "/UserProfile/GetIntroducerOfPartyByProfileCode?profileCode=" + $scope.infUser.ResumeNumber,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                $scope.Introducer = response;
                //$scope.$apply();
                console.log($scope.Introducer);
            },
            error: function (error) {
                console.log(error);
            }
        });

    }

    //Insert

    //Update

    $scope.selectedWarningDisciplined = {};
    $scope.selectedHistorySpecialist = {};
    $scope.selectedWorkingTracking = {};
    $scope.selectedTrainingCertificatedPass = {};
    $scope.selectedGoAboard = {};
    $scope.selectFamily = function (x) {
        if (x) {
            $scope.selectedFamily = x;
            $scope.Relationship.forEach(function (Relationship) {
                Relationship.selected = false;
            });

            // Set selected family
            $scope.selectedFamily = x;
            $scope.selectedFamily.selected = true;
            //const pp = $scope.jsonGuide.find(x => x.id === `family_${$scope.selectedFamily.Id}`);
            //const keys = Object.keys(pp.idFamily);
            //$.each(keys, function (index, item) {
            //    // Tìm thẻ <i> có id trùng với id của phần tử
            //    var $icon = $('#' + item + '.fa.fa-info-circle');
            //    // Nếu thẻ <i> được tìm thấy, đổi màu chúng thành đỏ
            //    if ($icon.length > 0) {
            //        $icon.css('color', 'red');
            //    }
            //});
            //var years = $scope.selectedFamily.WorkingProgress.match(/\b\d{4}\b/g);
            //$scope.WorkingProgressStart = years[0];
            //$scope.WorkingProgressEnd = years[1];
            //$scope.selectedFamily.WorkingProgress = $scope.selectedFamily.WorkingProgress.split(": ")[1].trim();
            var BirthYear = $scope.selectedFamily.BirthYear ? $scope.selectedFamily.BirthYear.split("-") : "";
            if (BirthYear.length === 2) {
                $scope.selectedFamily.BirthYear = BirthYear[0];
                $scope.selectedFamily.BirthDie = BirthYear[1];
                $scope.disableWorkingProgressYear = true;
            }
            if ($scope.selectedFamily.die === true) {
                $scope.selectedFamily.disableAddress = true;
                $scope.selectedFamily.die = true
            } else if ($scope.selectedFamily.die === false) {
                $scope.selectedFamily.disableAddress = false;
                $scope.selectedFamily.die = false
            }
            if ($scope.selectedFamily.BirthPlace) {
                $scope.selectedFamily.BirthPlace = $scope.selectedFamily.BirthPlace
            }
            $scope.bienTam = angular.copy(x);
            $scope.changedisable();
            $scope.changedis();
            $scope.filterRelation();
            $scope.pp = {};
            $scope.matchedItemss = [];
            setTimeout(() => $scope.resetValidateFamily(), 150);
        }
        $scope.deleteS = false;
    };

    $scope.resetValidateFamily = function () {
        $scope.forms.addFamily.validate();
    }

    $scope.selectedFamilyHomeTownComp = {};
    $scope.deleteSelect = function () {
        $scope.selectFamily($scope.selectedFamily);
        $scope.disableWorkingProgressYear = false;
        $scope.WorkingProgressStart = "";
        $scope.WorkingProgressEnd = "";
        $scope.selectedFamily = {};
        $scope.selectedFamily.disableAddress = false;
        $scope.PartyMember = false;
        $scope.changedisable();
        $scope.changedis();
        $scope.pp = {};
        $scope.matchedItemss = [];
        //var $icon = $('.fa.fa-info-circle.icon-family');
        //console.log($icon.length);
        //if ($icon.length > 0) {
        //    $icon.css('color', 'unset');
        //}
        for (var i = 0; i < $scope.Relationship.length; i++) {
            $scope.Relationship[i].selected = false;
        }
        //$scope.filterRelation();
        //$scope.resetFamilyHomeTown();

        if ($scope.selectedFamilyHomeTownComp) {
            $scope.selectedFamilyHomeTownComp.resetModel();
        }
        $scope.resetValidateFamily()
        setTimeout(() => $scope.$apply());
    }


    $scope.resetValidateFamily = function () {
        var helpBlocks = document.querySelectorAll('.help-block');
        var hasError = document.querySelectorAll('.has-error');
        helpBlocks.forEach(function (element) {
            element.parentNode.removeChild(element);
        });
        if (hasError) {
            hasError.forEach(function (element) {
                element.classList.remove('has-error');
            });
        }
    }

    $scope.selectPersonHistory = function (x) {
        $scope.selectedPersonHistory = x;
        for (var i = 0; i < $scope.PersonalHistory.length; i++) {
            $scope.PersonalHistory[i].selected = false;
        }
        $scope.selectedPersonHistory.selected = true;
    };
    $scope.selectWarningDisciplined = function (x) {
        $scope.selectedWarningDisciplined = x;
    };
    $scope.selectHistorySpecialist = function (x) {
        $scope.selectedHistorySpecialist = x;
    };
    $scope.selectWorkingTracking = function (x) {
        $scope.selectedWorkingTracking = x;
        for (var i = 0; i < $scope.BusinessNDuty.length; i++) {
            $scope.BusinessNDuty[i].selected = false;
        }
        $scope.selectedWorkingTracking.selected = true;
    };
    $scope.selectTrainingCertificatedPass = function (x) {
        $scope.selectedTrainingCertificatedPass = x;
    };
    $scope.selectLaudatory = function (x) {
        $scope.selectedLaudatory = x;
    };
    $scope.selectGoAboard = function (x) {
        $scope.selectedGoAboard = x;
    };
    $scope.updatePartyAdmissionProfile = function () {
        $scope.modelPartyAdmissionProfile = $scope.infUser;

        dataservice.updatePartyAdmissionProfile($scope.modelPartyAdmissionProfile, function (rs) {
            console.log($scope.modelPartyAdmissionProfile);
            rs = rs.data;
            console.log(rs);
        })
        $scope.selectedPersonHistory = {};
        console.log($scope.modelPersonal);
    }
    $scope.updateFamily = function (x) {
        $scope.modelPersonal = x;

        dataservice.updateFamily($scope.modelPersonal, function (rs) {
            console.log($scope.modelPersonal);
            rs = rs.data;
            console.log(rs);
        })
        $scope.selectedPersonHistory = {};
        console.log($scope.modelPersonal);
    }

    $scope.updatePersonalHistory = function () {

        dataservice.updatePersonalHistory($scope.selectedPersonHistory, function (rs) {
            console.log($scope.selectedPersonHistory);
            rs = rs.data;
            console.log(rs);
            $scope.selectedPersonHistory = {};

        })
    }

    $scope.updateWarningDisciplined = function () {
        $scope.modelPersonal = $scope.selectedWarningDisciplined;

        dataservice.updateWarningDisciplined($scope.modelPersonal, function (rs) {
            console.log($scope.modelPersonal);
            rs = rs.data;
            console.log(rs);
        })
        $scope.selectedWarningDisciplined = {};
        console.log($scope.modelPersonal);
    }

    $scope.updateHistorySpecialist = function () {
        $scope.modelPersonal = $scope.selectedHistorySpecialist;

        dataservice.updateHistorySpecialist($scope.modelPersonal, function (rs) {
            console.log($scope.modelPersonal);
            rs = rs.data;
            console.log(rs);
        })
        $scope.selectedHistorySpecialist = {};
        console.log($scope.modelPersonal);
    }

    $scope.updateWorkingTracking = function () {
        $scope.modelPersonal = $scope.selectedWorkingTracking;

        dataservice.updateWorkingTracking($scope.modelPersonal, function (rs) {
            console.log($scope.modelPersonal);
            rs = rs.data;
            console.log(rs);
        })
        $scope.selectedWorkingTracking = {};
        console.log($scope.modelPersonal);
    }

    $scope.updateLaudatory = function () {
        $scope.modelPersonal = $scope.selectedLaudatory;

        dataservice.updateAward($scope.modelPersonal, function (rs) {
            console.log($scope.modelPersonal);
            rs = rs.data;
            console.log(rs);
        })
        $scope.selectedLaudatory = {};
        console.log($scope.modelPersonal);
    }

    $scope.updateTrainingCertificatedPass = function () {
        $scope.modelTrainingCertificate = $scope.selectedTrainingCertificatedPass;

        dataservice.updateTrainingCertificatedPass($scope.modelTrainingCertificate, function (rs) {
            console.log($scope.modelPersonal);
            rs = rs.data;
            console.log(rs);
        })
        $scope.selectedTrainingCertificatedPass = {};
        console.log($scope.modelTrainingCertificate);
    }

    $scope.updateGoAboard = function () {
        $scope.modelPersonal = $scope.selectedGoAboard;

        dataservice.updateGoAboard($scope.modelPersonal, function (rs) {
            console.log($scope.modelPersonal);
            rs = rs.data;
            console.log(rs);
        })
        $scope.selectedGoAboard = {};
        console.log($scope.modelPersonal);
    }

    //Delete
    $scope.deletePartyAdmissionProfile = function () {

        var isDeleted = confirm("Ban co muon xoa?");
        if (isDeleted) {
            $.ajax({
                type: "DELETE",
                url: "/UserProfile/DeletePartyAdmissionProfile?id=" + Id,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
                success: function (result) {
                    result = result.data;
                    if (result.Error) {
                        App.toastrError(result.Title);
                    } else {
                        App.toastrSuccess(result.Title);
                    }
                },
                error: function (result) {
                    App.toastrError(result.Title);
                }
            });
        }
    }


    $scope.deletePesonalHistory = function (index) {

        var isDeleted = confirm("Ban co muon xoa?");
        if (isDeleted) {
            if ($scope.PersonalHistory[index].Id == undefined || $scope.PersonalHistory[index].Id == 0) {
                $scope.PersonalHistory.splice(index, 1);
            }
            else
                $.ajax({
                    type: "DELETE",
                    url: "/UserProfile/DeletePersonalHistory?id=" + $scope.PersonalHistory[index].Id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
                    success: function (result) {

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
    $scope.deleteHistorySpecialist = function (index) {

        var isDeleted = confirm("Ban co muon xoa?");
        if (isDeleted) {
            if ($scope.HistoricalFeatures[index].Id == undefined || $scope.HistoricalFeatures[index].Id == 0) {
                $scope.HistoricalFeatures.splice(index, 1);
            }
            else {
                $.ajax({
                    type: "DELETE",
                    url: "/UserProfile/DeleteHistorySpecialist?id=" + $scope.HistoricalFeatures[index].Id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
                    success: function (result) {

                        if (result.Error) {
                            App.toastrError(result.Title);
                        } else {
                            App.toastrSuccess(result.Title);
                            $scope.HistoricalFeatures.splice(index, 1);
                            $scope.$apply()
                        }
                    },
                    error: function (error) {
                        App.toastrError(error.Title);
                    }
                });
            }
        }
    }
    $scope.deleteAward = function (index) {

        var isDeleted = confirm("Ban co muon xoa?");
        if (isDeleted) {
            if ($scope.Laudatory[index].Id == undefined || $scope.Laudatory[index].Id == 0) {
                $scope.Laudatory.splice(index, 1);
            }
            else
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
                            $scope.$apply()
                        }
                    },
                    error: function (error) {
                        console.log(error.Title);
                    }
                });
        }
    }
    $scope.deleteWarningDisciplined = function (index) {

        var isDeleted = confirm("Ban co muon xoa?");
        if (isDeleted) {
            if ($scope.Disciplined[index].Id == undefined || $scope.Disciplined[index].Id == 0) {
                $scope.Disciplined.splice(index, 1);
            }
            else
                $.ajax({
                    type: "DELETE",
                    url: "/UserProfile/DeleteWarningDisciplined?id=" + $scope.Disciplined[index].Id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
                    success: function (result) {

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
    $scope.deleteGoAboard = function (index) {

        var isDeleted = confirm("Ban co muon xoa?");
        if (isDeleted) {
            if ($scope.GoAboard[index].Id == undefined || $scope.GoAboard[index].Id == 0) {
                $scope.GoAboard.splice(index, 1);
            }
            else
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
    $scope.deleteTrainingCertificatedPass = function (index) {

        var isDeleted = confirm("Ban co muon xoa?");
        if (isDeleted) {
            if ($scope.PassedTrainingClasses[index].Id == undefined || $scope.PassedTrainingClasses[index].Id == 0) {
                $scope.PassedTrainingClasses.splice(index, 1);
            }
            else
                $.ajax({
                    type: "DELETE",
                    url: "/UserProfile/DeleteTrainingCertificatedPass?id=" + $scope.PassedTrainingClasses[index].Id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
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

        var isDeleted = confirm("Ban co muon xoa?");
        if (isDeleted) {
            if ($scope.BusinessNDuty[index].Id == undefined || $scope.BusinessNDuty[index].Id == 0) {
                $scope.BusinessNDuty.splice(index, 1);
            }
            else
                $.ajax({
                    type: "DELETE",
                    url: "/UserProfile/DeleteWorkingTracking?id=" + $scope.BusinessNDuty[index].Id,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
                    success: function (result) {

                        if (result.Error) {
                            App.toastrError(result.Title);
                        } else {
                            App.toastrSuccess(result.Title);
                            $scope.BusinessNDuty.splice(index, 1);
                            $scope.$apply()
                        }
                    },
                    error: function (error) {
                        console.log(error.Title);
                    }
                });
        }
    }
    $scope.deleteIntroducer = function () {

        var isDeleted = confirm("Ban co muon xoa?");
        if (isDeleted) {

            $.ajax({
                type: "DELETE",
                url: "/UserProfile/DeleteIntroducerOfParty?profileCode=" + $scope.infUser.ResumeNumber,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
                success: function (result) {

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

    $scope.deletePartyAdmissionProfile = function (e) {

        var isDeleted = confirm("Ban co muon xoa?");
        if (isDeleted) {
            $.ajax({
                type: "DELETE",
                url: "/UserProfile/DeletePartyAdmissionProfile?id=" + e.Id,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                // data: JSON.stringify(requestData), // Chuyển đổi dữ liệu thành chuỗi JSON
                success: function (result) {

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

    $scope.deleteFamily = function (index) {

        var isDeleted = confirm("Ban co muon xoa?");
        if (isDeleted) {
            if ($scope.Relationship[index].Id == undefined || $scope.Relationship[index].Id == 0) {
                $scope.Relationship.splice(index, 1);
            }
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
                    console.log(error.Title);
                }
            });
        }
    }

    //getGoAboardById
    $scope.getGoAboardById = function () {
        $scope.id = 2;
        dataservice.getGoAboardById($scope.id, function (rs) {
            rs = rs.data;
            console.log(rs.data);

        })

        console.log($scope.id);
    }
    $scope.getTrainingCertificatedPassById = function () {
        $scope.id = 2;
        dataservice.getTrainingCertificatedPassById($scope.id, function (rs) {
            rs = rs.data;
            console.log(rs.data);
        })
        console.log($scope.id);
    }



    //getGetPersonalHistoryById
    $scope.getPersonalHistoryById = function () {
        $scope.id = 2;
        dataservice.getPersonalHistoryById($scope.id, function (rs) {
            rs = rs.data;
            console.log(rs.data);
        })
        console.log($scope.id);
    }

    //getGoAboardById
    $scope.getGoAboardById = function () {
        $scope.id = 2;
        dataservice.getGoAboardById($scope.id, function (rs) {
            rs = rs.data;
            console.log(rs.data);

        })

        console.log($scope.id);
    }
    // handle birth year logic
    $scope.changeBirthYear = function () {
        var part = $scope.selectedFamily.BirthYear ? $scope.selectedFamily.BirthYear.trim().split("-") : "";
        const year = Number(part[0]);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        if (year && year >= 1945 && year < currentYear) {
            $scope.selectedFamily.PoliticalAttitude = `Luôn chấp hành tốt mọi đường lối chủ trương của Đảng và nhà nước`;
        }
        else {
            $scope.selectedFamily.PoliticalAttitude = `Không làm gì cho địch, chấp hành tốt mọi đường lối chủ trương của Đảng và nhà nước`;
        }
        if (year && year < currentYear) {
            if ($scope.selectedFamily.Relation.toLowerCase() !== 'vợ' && $scope.selectedFamily.Relation.toLowerCase() !== 'chồng') {
                $scope.WorkingProgressStart = `năm ${year + 18}`;
            }
            else {
                $scope.WorkingProgressStart = `T1/${year + 18}`;
            }
        }
        else {
            $scope.WorkingProgressStart = 'năm 18 tuổi';
        }
        // $scope.forms.addFamily.validate();

    }


    $scope.saveWorkingProgressYear = function () {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        if ($scope.selectedFamily.BirthDie && extractYear($scope.WorkingProgressEnd) > $scope.selectedFamily.BirthDie || extractYear($scope.WorkingProgressEnd) > currentYear) {
            App.toastrError("Thời gian của bạn lớn hơn thời gian mất hoặc lớn hơn năm hiện tại")
            return;
        }
        if (!isValidDateFormat($scope.WorkingProgressEnd)) {
            App.toastrError('Giá trị của bạn không đúng định dạng.');
            return;
        }
        if ($scope.selectedFamily.WorkingProgress) {
            $scope.selectedFamily.WorkingProgress += `\n`;
        }
        if ($scope.WorkingProgressStart && $scope.WorkingProgressEnd) {
            if ($scope.selectedFamily.WorkingProgress) {
                $scope.selectedFamily.WorkingProgress += `Từ ${$scope.WorkingProgressStart} đến ${$scope.WorkingProgressEnd ?? ''}`;
            } else {
                $scope.selectedFamily.WorkingProgress = `Từ ${$scope.WorkingProgressStart} đến ${$scope.WorkingProgressEnd ?? ''}`;
            }
        }
        $scope.WorkingProgressStart = $scope.WorkingProgressEnd;
        if ($scope.selectedFamily.Relation.toLowerCase() !== 'vợ' && $scope.selectedFamily.Relation.toLowerCase() !== 'chồng') {
            $scope.WorkingProgressEnd = 'năm ';
        }
        else {
            $scope.WorkingProgressEnd = 'T1/';
        }
    }

    function extractYear(dateString) {
        // Tìm tất cả các số có 4 chữ số (có thể là năm)
        var yearMatch = dateString.match(/\b\d{4}\b/);
        if (yearMatch) {
            return parseInt(yearMatch[0]);
        }
        return null;
    }

    function isValidDateFormat(value) {
        const regex = /^(T(0?[1-9]|1[0-2])\/\d{4}|năm \d{4}|\d{4})$/;
        return regex.test(value);
    }

    $scope.changeHistory = function () {
        if ($rootScope.regexDate.test($scope.infUser.Birthday)) {
            $scope.infUser.Birthday = convertDateFormat($scope.infUser.Birthday);
        }
        var parts = $scope.infUser.Birthday.split("/");
        const year2 = Number(parts[2]);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        if (year2 && year2 >= 1945 && year2 + 18 < currentYear && $scope.PersonalHistory.length >= 1) {
            const year3 = $scope.PersonalHistory[$scope.PersonalHistory.length - 1].End.split("/")
            if (year3.length == 2) {
                var yearEnd = Number(year3[1]);
                var monthEnd = Number(year3[0]);
            } else if (year3.length == 3) {
                var yearEnd = Number(year3[2]);
                var monthEnd = Number(year3[1]);
            } else {
                $scope.selectedPersonHistory.Begin = `9/${year2 + 6}`;
                return
            }
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            if (monthEnd === 12) {
                $scope.selectedPersonHistory.Begin = `1/${yearEnd + 1}`;
            } else {
                $scope.selectedPersonHistory.Begin = `${monthEnd + 1}/${yearEnd}`;
            }
            $scope.selectedPersonHistory.End = '';
        }
        else {
            $scope.selectedPersonHistory.Begin = $scope.selectedPersonHistory.End;
        }
    }

    $scope.autoFormat = function (field) {
        if (field === 'Birthday') {
            if ($rootScope.regexDate.test($scope.infUser.Birthday)) {
                $scope.infUser.Birthday = convertDateFormat($scope.infUser.Birthday);
            }
        }
        if (field === 'placeAddress') {
            if ($rootScope.regexDate.test($scope.placeAddress)) {
                $scope.placeAddress = convertDateFormat($scope.placeAddress);
            }
        }

        if (field === 'selectedLaudatoryMonthYear') {
            if ($rootScope.regexDate.test($scope.selectedLaudatory.MonthYear)) {
                $scope.selectedLaudatory.MonthYear = convertDateFormat($scope.selectedLaudatory.MonthYear);
            }
        }

        if (field === 'selectedWarningDisciplinedMonthYear') {
            if ($rootScope.regexDate.test($scope.selectedWarningDisciplined.MonthYear)) {
                $scope.selectedWarningDisciplined.MonthYear = convertDateFormat($scope.selectedWarningDisciplined.MonthYear);
            }
        }

        if (field === 'decisionDate') {
            if ($rootScope.regexDate.test($scope.infUser.MaritalStatus.decisionDate)) {
                $scope.infUser.MaritalStatus.decisionDate = convertDateFormat($scope.infUser.MaritalStatus.decisionDate);
            }
        }
    }
    function convertDateFormat(dateString) {
        var datePart = dateString.split('/');

        // Reformat the date
        var newDateString = datePart[0].padStart(2, '0') + '/' +
            datePart[1].padStart(2, '0') + '/' +
            datePart[2];

        return newDateString;
    }
    //Add file
    $scope.getListFile = function () {
        dataservice.getListFile($scope.infUser.ResumeNumber, function (rs) {
            rs = rs.data;
            const parts = rs.MarriedStatus.split('_');
            if (rs.PermanentResidence != "" || rs.PermanentResidence != null || rs.PermanentResidence != undefined) {
                var thon_Residence = rs.PermanentResidence.split('_');
            }
            if (rs.HomeTown != "" || rs.HomeTown != null || rs.HomeTown != undefined) {
                var thon_HomeTown = rs.HomeTown.split('_');
            }
            if (rs.PlaceBirth != "" || rs.PlaceBirth != null || rs.PlaceBirth != undefined) {
                var thon_PlaceofBirth = rs.PlaceBirth.split('_');
            }
            if (rs.TemporaryAddress != "" || rs.TemporaryAddress != null || rs.TemporaryAddress != undefined) {
                var thon_TemporaryAddress = rs.TemporaryAddress.split('_');
            }
            if (rs.CreatedPlace != "" || rs.CreatedPlace != null || rs.CreatedPlace != undefined) {
                var place = rs.CreatedPlace.split('_');
            }
            $scope.thon_Residence = thon_Residence[3];
            $scope.thon_HomeTown = thon_HomeTown[3];
            $scope.thon_PlaceofBirth = thon_PlaceofBirth[3];
            if (thon_TemporaryAddress && thon_TemporaryAddress.length === 4) {
                $scope.thon_TemporaryAddress = thon_TemporaryAddress[3];
            }
            if (place && place.length === 2) {
                $scope.PlaceCreatedTime.place = place[0];
                $scope.placeAddress = place[1];
            }

            const decisionDate = new Date(parts[2]);

            // Lấy ngày, tháng và năm từ đối tượng Date
            const month = (decisionDate.getMonth() + 1).toString().padStart(2).trim(); // Tháng bắt đầu từ 0, nên cộng thêm 1 và định dạng lại
            const day = decisionDate.getDate().toString().padStart(2).trim();
            const year = decisionDate.getFullYear();

            const formattedDecisionDate = `${day}/${month}/${year}`;
            if (parts.length === 4) {
                const MaritalStatus = {
                    marriedStatus: parts[0],
                    decisionNumber: parts[1],
                    decisionDate: formattedDecisionDate.trim(),
                    location: parts[3]
                };
                $scope.infUser.MaritalStatus = MaritalStatus;

            } else if (parts.length === 1) {
                const MaritalStatus = {
                    marriedStatus: parts[0],
                };
                $scope.infUser.MaritalStatus = MaritalStatus;
            } else {
                const MaritalStatus = {
                    marriedStatus: parts[1],
                    decisionNumber: parts[2],
                    decisionDate: formattedDecisionDate.trim(),
                    location: parts[4]
                };
                $scope.infUser.MaritalStatus = MaritalStatus;
            }

            var part = $scope.infUser.Birthday.split("-");
            if (part.length >= 3) {
                var formattedBirthday = part[0] + "/" + part[1] + "/" + part[2];
                $scope.infUser.Birthday = formattedBirthday;
            }


            var placeAddress = $scope.placeAddress.split("-");
            if (placeAddress.length >= 3) {
                var formattedBirthday = placeAddress[0] + "/" + placeAddress[1] + "/" + placeAddress[2];
                $scope.placeAddress = formattedBirthday;
            }
            // Gán đối tượng JSON vào $scope.infUser.MaritalStatus
            // $scope.infUser.MaritalStatus = MaritalStatus;
            $scope.fileList = rs.JsonProfileLinks;
            console.log(rs);
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

});
app.directive("choosePosition", function (dataservice) {
    return {
        restrict: "AE",
        require: "ngModel",
        templateUrl: ctxfolder + '/Posision.html',
        scope: {
            ngModelCtrl: '=',// Tạo một scope riêng để nhận giá trị ngModelCtrl từ bên ngoài
            provinces: '=',
            value: '=?',
            json: '=?',
            component: '=?',
            required: '=?'
        },
        link: function (scope, element, attrs, ngModelCtrl) {
            console.log(scope.provinces);
            scope.ditrict = [
            ];
            scope.Ward = [
            ];
            scope.component = {
            };
            scope.errorProvince = false;
            scope.errorDistrict = false;
            scope.errorWard = false;
            // Hàm phân tích ngModelCtrl
            function parseNgModelValue(value) {
                var parts = value.split('_'); // Tách giá trị thành các phần
                var result = {
                    tinh_id: parts[0] ? parseInt(parts[0]) : '',
                    huyen_id: parts[1] ? parseInt(parts[1]) : '',
                    xaPhuong_id: parts[2] ? parseInt(parts[2]) : ''
                };
                return result;
            }

            // Hàm cập nhật giá trị ngModelCtrl
            async function updateNgModelValue() {
                var value = scope.model.tinh_id + '_' + scope.model.huyen_id + '_' + scope.model.xaPhuong_id;
                ngModelCtrl.$setViewValue(value);
                ngModelCtrl.$render();
                if (parseInt(scope.model.tinh_id) != NaN)
                    await getDistrict();
                if (parseInt(scope.model.huyen_id) != NaN)
                    await getWard();
                console.log(ngModelCtrl.$modelValue);
                if (!scope.component) {
                    scope.component = {};
                }
                scope.component.resetModel = resetModel;
                setTimeout(() => {
                    const tinh = scope.provinces.find(x => x.provinceId === scope.model.tinh_id);
                    scope.model.tinh_value = tinh?.name ?? '';
                    const huyen = scope.ditrict.find(x => x.districtId === scope.model.huyen_id);
                    scope.model.huyen_value = huyen?.name ?? '';
                    const xa = scope.Ward.find(x => x.wardsId === scope.model.xaPhuong_id);
                    scope.model.xa_value = xa?.name ?? '';
                    scope.value = `${scope.model.xa_value ?? ''} ${scope.model.huyen_value ? `, ${scope.model.huyen_value}` : ''} ${scope.model.tinh_value ? `, ${scope.model.tinh_value}` : ''}`;
                    const json = {
                        tinh: {
                            id: scope.model.tinh_id,
                            name: scope.model.tinh_value
                        },
                        huyen: {
                            id: scope.model.huyen_id,
                            name: scope.model.huyen_value
                        },
                        xa: {
                            id: scope.model.xaPhuong_id,
                            name: scope.model.xa_value
                        },
                    };
                    scope.json = JSON.stringify(json);
                    if (scope.required == true) {
                        if (scope.model.tinh_id == NaN || scope.model.tinh_id == '') {
                            scope.errorProvince = true;
                        }
                        else {
                            scope.errorProvince = false;
                        }
                        if (scope.model.huyen_id == NaN || scope.model.huyen_id == '') {
                            scope.errorDistrict = true;
                        }
                        else {
                            scope.errorDistrict = false;
                        }
                        if (scope.model.xaPhuong_id == NaN || scope.model.xaPhuong_id == '') {
                            scope.errorWard = true;
                        }
                        else {
                            scope.errorWard = false;
                        }
                    }
                    setTimeout(() => scope.$apply());
                }, 100);
            }
            function getDistrict() {
                return new Promise((resolve, reject) => {
                    dataservice.getDistrictByProvinceId(scope.model.tinh_id, function (rs) {
                        rs = rs.data
                        scope.ditrict = rs;
                        resolve();
                    })
                });
            }
            function getWard() {
                return new Promise((resolve, reject) => {
                    dataservice.getWardByDistrictId(scope.model.huyen_id, function (rs) {
                        rs = rs.data
                        scope.Ward = rs;
                        resolve();
                    })
                });
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
                    updateNgModelValue();
                }
                if (!scope.component) {
                    scope.component = {};
                }
                scope.component.resetModel = resetModel;
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
                    scope.model.tinh_value = selected.name;

                } else if (level === 'huyen') {
                    scope.disableXa = false
                    scope.model.xaPhuong_id = ''; // Xóa giá trị xã/phường khi chọn một huyện mới
                    scope.model.huyen_value = selected.name;

                } else {
                    scope.model.xa_value = selected.name;
                }
            };
            function resetModel() {
                scope.model = {
                    tinh_id: '',
                    huyen_id: '',
                    xaPhuong_id: ''
                };
            }
            if (!scope.component) {
                scope.component = {};
            }
            scope.component.resetModel = resetModel;
        },
    };
});

app.directive('iconChildTab', function () {
    return {
        restrict: 'A',
        scope: {
            rowId: '=',
            childTab: '@',
            jsonGuide: '=',
            controlId: '@'
        },
        link: function (scope, element) {
            scope.$watchGroup(['jsonGuide', 'childTab', 'rowId', 'controlId'], function () {
                if (!Array.isArray(scope.jsonGuide)) {
                    scope.jsonGuide = [];
                    console.warn('scope.jsonGuide không phải là một mảng. Đã gán thành một mảng trống.');
                }
                console.log(`${scope.childTab}_${scope.rowId}`);
                const pp = scope.jsonGuide.find(x => x.id === `${scope.childTab}_${scope.rowId}`);
                const hasComment = pp?.idFamily ? pp?.idFamily[scope.controlId] : false;

                if (hasComment) {
                    element.css('color', 'red');
                } else {
                    element.css('color', 'unset');
                }
            });
        }
    };
});