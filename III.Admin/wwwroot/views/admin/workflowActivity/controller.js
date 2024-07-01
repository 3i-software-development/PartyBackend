var ctxfolder = "/views/admin/workflowActivity";
var ctxfolderCommonSetting = "/views/admin/commonSetting";
var ctxfolderCardJob = "/views/admin/cardJob";
var ctxfolderMessage = "/views/message-box";

var app = angular.module('App_ESEIM', ['App_ESEIM_DASHBOARD', "App_ESEIM_CARD_JOB", "App_ESEIM_PROJECT", 'App_ESEIM_CUSTOMER', 'App_ESEIM_CONTRACT', 'App_ESEIM_PRICE', 'App_ESEIM_CONTRACT_PO', 'App_ESEIM_SUPPLIER', 'App_ESEIM_ATTR_MANAGER', 'App_ESEIM_MATERIAL_PROD', 'App_ESEIM_PAY_DECISION', "ui.bootstrap", "ngRoute", "ngValidate", "datatables", "datatables.bootstrap", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', "ngJsTree", "treeGrid", "ui.select", "ngCookies", "pascalprecht.translate", 'dynamicNumber', 'ngFileUpload', 'FBAngular']).
    directive("filesInput", function () {
        return {
            require: "ngModel",
            link: function postLink(scope, elem, attrs, ngModel) {
                elem.on("change", function (e) {
                    var files = elem[0].files;
                    ngModel.$setViewValue(files);
                });
            }
        }
    });

app.directive('customOnChangeCustomer', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChangeCustomer);
            element.on('change', onChangeHandler);
            element.on('$destroy', function () {
                element.off();
            });

        }
    };
});

app.directive('customOnChangeCardjob', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChangeCardjob);
            element.on('change', onChangeHandler);
            element.on('$destroy', function () {
                element.off();
            });

        }
    };
});

app.directive('fullscreenWfAct', function ($parse) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, el, attrs) {
            scope.$watch(attrs['ngModel'], function (newValue) {
                if (newValue) {
                    if (document.cancelFullScreen) {
                        document.cancelFullScreen({ navigationUI: "show" });
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen({ navigationUI: "show" });
                    } else if (document.webkitExitFullscreen) {
                        document.webkitRequestFullscreen({ navigationUI: "show" });
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen({ navigationUI: "show" });
                    }
                }
                else {
                    if (document.cancelFullScreen) {
                        document.cancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                }
                //setTimeout(function () {
                //}, 1000);
            });
        }
    };
});

app.filter("fomartDateTime", function ($filter) {
    return function (date) {
        var dateNow = $filter('date')(new Date(), 'dd/MM/yyyy');
        var createDate = $filter('date')(new Date(date), 'dd/MM/yyyy');
        if (dateNow == createDate) {
            var today = new Date();
            var created = new Date(date);
            var diffMs = (today - created);
            var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
            if (diffHrs <= 0) {
                if (diffMins <= 0) {
                    return 'Vừa xong';
                } else {
                    return diffMins + ' phút trước';
                }
            } else {
                return diffHrs + ' giờ ' + diffMins + ' phút trước.';
            }
        } else {
            return $filter('date')(new Date(date), 'dd/MM/yyyy lúc h:mma');
        }
    }
});

app.service('myService', function () {
    var data;
    this.setData = function (d) {
        data = d;
    }
    this.getData = function () {
        return data;
    }
    var code;
    this.setCode = function (d) {
        code = d;
    }
    this.getCode = function () {
        return code;
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
            data: data
        }

        $http(req).then(callback);
    };
    var submitFormUpload1 = function (url, data, callback) {
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
        getWfGroup: function (callback) {
            $http.get('/Admin/WorkflowActivity/GetWfGroup').then(callback)
        },
        getWfType: function (callback) {
            $http.get('/Admin/WorkflowActivity/GetWfType').then(callback)
        },
        insertWorkFlow: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/InsertWorkFlow', data).then(callback)
        },
        getWorkflow: function (callback) {
            $http.get('/Admin/WorkflowActivity/GetWorkflow').then(callback)
        },
        getItemWf: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetItemWf?wfCode=' + data).then(callback)
        },
        updateWf: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/UpdateWf', data).then(callback)
        },
        deleteWf: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/DeleteWf?wfCode=' + data).then(callback)
        },
        settingWF: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/SettingWF', data).then(callback)
        },
        deleteSettingWF: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/DeleteSettingWF?transitionCode=' + data).then(callback)
        },
        getInstance: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetInstanceAct?wfCode=' + data).then(callback)
        },
        getItemActInst: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetItemActInst?id=' + data).then(callback)
        },
        getDurationUnit: function (callback) {
            $http.post('/Admin/CatActivity/GetDurationUnit').then(callback);
        },
        getGroupAct: function (callback) {
            $http.post('/Admin/CatActivity/GetGroupAct').then(callback);
        },
        getTypeAct: function (callback) {
            $http.post('/Admin/CatActivity/GetTypeAct').then(callback);
        },
        getStatusAct: function (callback) {
            $http.post('/Admin/CatActivity/GetStatusAct').then(callback);
        },
        getStatusAssign: function (callback) {
            $http.get('/Admin/CatActivity/GetStatusAssign').then(callback);
        },
        getListGroupUser: function (data, callback) {
            $http.post('/Admin/CardJob/GetListGroupUser?branch=' + data).then(callback);
        },
        getBranch: function (callback) {
            $http.post('/Admin/CatActivity/GetBranch').then(callback);
        },
        getMemberInGroupUser: function (groupUserCode, data, callback) {
            $http.post('/Admin/CatActivity/GetMemberInGroupUser/?groupUserCode=' + groupUserCode + '&branch=' + data).then(callback);
        },
        getListUserInDepartment: function (departmentCode, data, callback) {
            $http.get('/Admin/CatActivity/GetListUserInDepartment/?departmentCode=' + departmentCode + '&branch=' + data).then(callback);
        },
        getListUserOfBranch: function (data, callback) {
            $http.post('/Admin/CardJob/GetListUserOfBranch?branch=' + data).then(callback);
        },
        getListRoleAssign: function (callback) {
            $http.post('/Admin/CatActivity/GetListRoleAssign').then(callback);
        },
        getMilesStone: function (callback) {
            $http.post('/Admin/CatActivity/GetMilesStone').then(callback);
        },
        getDepartmentInBranch: function (data, callback) {
            $http.post('/Admin/CardJob/GetDepartmentInBranch?branch=' + data).then(callback);
        },
        updateActInst: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/UpdateActInst', data).then(callback);
        },
        assign: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/Assign', data).then(callback);
        },
        getAttrOfAct: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetAttrOfAct?actCode=' + data).then(callback);
        },
        insertAttrData: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/InsertAttrData', data).then(callback);
        },
        getAttrData: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetAttrData', data).then(callback);
        },
        getLstResultAttrData: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetLstResultAttrData', data).then(callback);
        },
        insertObjectProcess: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/InsertObjectProcess', data).then(callback);
        },
        deleteObjInstance: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/DeleteObjInstance?id=' + data).then(callback);
        },
        getMemberAssign: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetMemberAssign', data).then(callback);
        },
        updateRole: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/UpdateRole?id=' + data + '&role=' + data1).then(callback);
        },
        updateStatus: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/UpdateStatus?id=' + data + '&status=' + data1).then(callback);
        },
        getStatusAssign: function (callback) {
            $http.get('/Admin/WorkflowActivity/GetStatusAssign').then(callback);
        },
        deleteAssign: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/DeleteAssign?id=' + data).then(callback);
        },
        //File object share
        getTreeCategory: function (callback) {
            $http.post('/Admin/EDMSRepository/GetTreeCategory').then(callback);
        },
        getObjFileShare: function (callback) {
            $http.post('/Admin/WorkflowActivity/GetObjFileShare').then(callback);
        },
        insertFileShare: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/InsertFileShare', data).then(callback);
        },
        uploadAttachment: function (data, callback) {
            submitFormUpload('/Admin/WorkflowActivity/UploadFile/', data, callback);
        },
        addAttachment: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/AddAttachment', data).then(callback);
        },
        getAttachment: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetAttachment?actInstCode=' + data).then(callback);
        },
        deleteAttachment: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/DeleteAttachment', data).then(callback);
        },
        isFileEdms: function (data1, data2, callback) {
            $http.get('/Admin/WorkflowActivity/IsFileEdms?fileCode=' + data1 + '&url=' + data2).then(callback);
        },
        viewFileOnline: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/ViewFileOnline', data).then(callback);
        },
        getTemplate: function (callback) {
            $http.post('/Admin/WorkflowActivity/GetTemplate').then(callback);
        },
        isFileSign: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/IsFileSign?actInst=' + data).then(callback);
        },
        getActInstTo: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetActInstTo?actInst=' + data).then(callback);
        },
        addActShareOfFile: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/AddActShareOfFile', data).then(callback);
        },
        getLogSignFile: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/GetLogSignFile?fileCode=' + data + '&actInst=' + data1).then(callback);
        },

        //Command
        getStatusCommand: function (callback) {
            $http.post('/Admin/WorkflowActivity/GetStatusCommand').then(callback);
        },
        insertCommand: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/InsertCommand', data).then(callback);
        },
        getCommand: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetCommand?actInstCode=' + data).then(callback);
        },
        getConfirm: function (callback) {
            $http.post('/Admin/WorkflowActivity/GetConfirm').then(callback);
        },
        getApprove: function (callback) {
            $http.post('/Admin/WorkflowActivity/GetApprove').then(callback)
        },
        getDesActivity: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetDesActivity?actInstCode=' + data).then(callback)
        },
        runningOneCommand: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/RunningOneCommand', data).then(callback)
        },
        approve: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/Approve?actInstCode=' + data).then(callback)
        },
        unapprove: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/Unapprove?actInstCode=' + data + '&status=' + data1).then(callback)
        },
        confirmOneCommand: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/ConfirmOneCommand', data).then(callback)
        },
        setCommandRepeat: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/SetCommandRepeat?actInst=' + data).then(callback)
        },
        deleteCommand: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/DeleteCommand?actDes=' + data + '&actSrc=' + data1).then(callback)
        },


        // Work flow instance
        getWorkflowInstance: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetWorkflowInstance?wfInst=' + data).then(callback);
        },
        getAttachmentWfInstance: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetAttachmentWfInstance?wfInstCode=' + data).then(callback);
        },
        getResultAttrData: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetResultAttrData?wfInstCode=' + data).then(callback);
        },
        countMilestone: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/CountMilestone?wfCode=' + data).then(callback)
        },
        getActivity: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetActivity?wfCode=' + data).then(callback)
        },
        getTransition: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetTransition?wfCode=' + data).then(callback)
        },
        getWflow: function (callback) {
            $http.get('/Admin/WorkflowActivity/GetWflow').then(callback)
        },
        insertActivity: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/InsertActivity', data).then(callback)
        },
        getUnitName: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetUnitName?Code=' + data).then(callback)
        },
        getAllActInstance: function (callback) {
            $http.post('/Admin/WorkflowActivity/GetActInstance').then(callback)
        },
        lockOrUnLockWfInst: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/LockOrUnLockWfInst?wfInstCode=' + data + '&isLock=' + data1).then(callback)
        },

        //Object relative
        getObjFromObjType: function (data, callback) {
            $http.post('/Admin/CardJob/GetObjFromObjType?code=' + data).then(callback)
        },
        getObjTypeJC: function (callback) {
            $http.post('/Admin/WorkflowActivity/GetObjTypeJC').then(callback)
        },
        getObjectProcess: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetObjectProcess?actInstCode=' + data).then(callback)
        },
        getActRelaObject: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/GetActRelaObject?objType=' + data + '&objCode=' + data1).then(callback)
        },
        deleteObjectProcessingShare: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/DeleteObjectProcessingShare?id=' + data).then(callback)
        },

        //Form builder
        insertSharpLibrary: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/InsertSharpLibrary', data).then(callback)
        },
        getTypeLibrary: function (callback) {
            $http.get('/Admin/WorkflowActivity/GetTypeLibrary').then(callback)
        },
        insertFormCat: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/InsertFormCat', data).then(callback)
        },
        getFormCat: function (callback) {
            $http.get('/Admin/WorkflowActivity/GetFormCat').then(callback)
        },
        insertFormControl: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/InsertFormControl', data).then(callback)
        },
        getFormBuilder: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetFormBuilder?FormCode=' + data).then(callback)
        },
        getSharpLibraryImage: function (callback) {
            $http.get('/Admin/WorkflowActivity/GetSharpLibraryImage').then(callback)
        },
        getSharpLibraryItem: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetSharpLibraryItem?SharpCode=' + data).then(callback)
        },

        //Instance wf
        createWfInstance: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/CreateWfInstance', data).then(callback)
        },
        getWorkFlow: function (callback) {
            $http.post('/Admin/CardJob/GetWorkFlow').then(callback)
        },
        deleteWfInstance: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/DeleteWfInstance?wfInstCode=' + data).then(callback)
        },
        getItemWfInst: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetItemWfInst?wfInsCode=' + data).then(callback)
        },
        updateWfInst: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/UpdateWfInst', data).then(callback)
        },

        //Attr data
        getUnitAttr: function (callback) {
            $http.post('/Admin/WorkflowActivity/GetUnitAttr').then(callback)
        },
        getAttrByGroup: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/GetAttrByGroup?attrGroup=' + data + '&actCode=' + data1).then(callback);
        },
        getAttrDataLogger: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetAttrDataLogger', data).then(callback);
        },
        deleteAttrDataLogger: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/DeleteAttrDataLogger?sessionId=' + data).then(callback);
        },
        getCommand: function (callback) {
            $http.post('/Admin/WorkflowActivity/GetCommand').then(callback);
        },
        insertInstRunning: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/InsertInstRunning?wfInstCode=' + data + '&wfCode=' + data1).then(callback);
        },
        runningCommand: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/RunningCommand', data).then(callback);
        },
        roleUpdateCommand: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/RoleUpdateCommand?actInstCode=' + data).then(callback);
        },
        confirmCommand: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/ConfirmCommand', data).then(callback);
        },
        getListUser: function (callback) {
            $http.post('/Admin/WorkflowActivity/GetListUser').then(callback);
        },

        //Draw instance
        getActivityInstance: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetActivityInstance?wfInstCode=' + data).then(callback);
        },
        getTransitionInstance: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetTransitionInstance?WfInstCode=' + data).then(callback);
        },

        //Lock Act
        lockActivity: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/LockActivity?actInst=' + data + '&value=' + data1).then(callback);
        },

        getItemActInstByCode: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetItemActInstByCode?code=' + data).then(callback);
        },

        // COMMOMT
        getDataTypeCommon: function (callback) {
            $http.get('/Admin/CommonSetting/GetDataType').then(callback);
        },
        insertCommonSetting: function (data, callback) {
            $http.post('/Admin/CommonSetting/Insert/', data).then(callback);
        },
        updateCommonSetting: function (data, callback) {
            $http.post('/Admin/CommonSetting/Update/', data).then(callback);
        },
        deleteCommonSetting: function (data, callback) {
            $http.post('/Admin/CommonSetting/Delete', data).then(callback);
        },
        //change status

        updateStatusActInst: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/UpdateStatusActInst?actInst=' + data + '&status=' + data1).then(callback);
        },

        //Log down time
        insertLogCountDown: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/InsertLogCountDown?actInst=' + data + '&cnt=' + data1).then(callback);
        },
        getDetailActInst: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetDetailActInst?actInst=' + data).then(callback);
        },

        getFileSign: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetFileSign?actInst=' + data).then(callback);
        },
        getStartXLast: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetStartXLast?actInst=' + data).then(callback);
        },

        //LogChangeDocument
        getLogContent: function (data1, data2, data3, callback) {
            $http.post('/Admin/Docman/GetLogContent?fileCode=' + data1 + '&objCode=' + data2 + '&objType=' + data3).then(callback);
        },

        //Save diagram
        saveDiagram: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/SaveDiagram', data).then(callback);
        },

        //Command wf
        getLstActInst: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetLstActInst?wfInst=' + data).then(callback);
        },
        sendCommandFromLeader: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/SendCommandFromLeader', data).then(callback);
        },
        getCommandSendByLeader: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetCommandSendByLeader?wfInst=' + data).then(callback);
        },
        getCommandFromLeader: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetCommandFromLeader?actInstCode=' + data).then(callback);
        },
        deleteCmdLeader: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/DeleteCmdLeader?id=' + data).then(callback);
        },

        //Check status and file sign
        checkSignFileWithStatus: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/CheckSignFileWithStatus?actInstCode=' + data).then(callback);
        },

        //Member assign Workflow
        getMemberAssignWF: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetMemberAssignWF?wfInstCode=' + data).then(callback);
        },
        assignWF: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/AssignWF', data).then(callback);
        },
        deleteAssignWF: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/DeleteAssignWF?wfInstCode=' + data + '&userId=' + data1).then(callback);
        },
        updateRoleAssign: function (data, data1, data2, callback) {
            $http.post('/Admin/WorkflowActivity/UpdateRoleAssign?wfInstCode=' + data + '&userId=' + data1 + '&role=' + data2).then(callback);
        },
        getAllMemberAssignWF: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetAllMemberAssignWF?wfInstCode=' + data).then(callback);
        },

        //Object in WF
        insertObjectProcessWF: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/InsertObjectProcessWF', data).then(callback);
        },
        getObjectProcessWF: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetObjectProcessWF?wfInstCode=' + data).then(callback);
        },
        shareObject: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/ShareObject', data).then(callback);
        },
        getActInstByObj: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/GetActInstByObj?code=' + data + '&type=' + data1).then(callback);
        },
        //Permission edit workflow instance
        checkPermisstionEditWF: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/CheckPermisstionEditWF?wfInstCode=' + data).then(callback);
        },
        checkPermissionEditActivity: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/CheckPermissionEditActivity?actInstCode=' + data).then(callback);
        },
        checkPermissionEditActivityById: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/CheckPermissionEditActivityById?id=' + data).then(callback);
        },
        checkPermissionAssignWF: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/CheckPermissionAssignWF?wfInstCode=' + data).then(callback);
        },
        deleteObjectShare: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/DeleteObjectShare?id=' + data).then(callback);
        },

        //View card
        getCardOfWf: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetCardOfWf?wfInst=' + data).then(callback);
        },

        //File to edms
        insertActInstFile: function (data, callback) {
            submitFormUpload('/Admin/WorkflowActivity/InsertActInstFile', data, callback);
        },
        getListUserShareAct: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetListUserShareAct?actInstCode=' + data).then(callback);
        },
        insertFileShareActInst: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/InsertFileShareActInst', data).then(callback);
        },
        getActCatFile: function (data, callback) {
            $http.post('/Admin/CardJob/GetCardFile?id=' + data).then(callback);
        },
        deleteActInstFile: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/DeleteActInstFile?id=' + data).then(callback);
        },
        getSuggestionsActInstFile: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetSuggestionsActInstFile?actInstCode=' + data).then(callback);
        },
        getItemFile: function (data, data1, data2, callback) {
            $http.get('/Admin/EDMSRepository/GetItemFile?id=' + data + '&&IsEdit=' + data1 + '&mode=' + data2).then(callback);
        },
        createTempFile: function (data, data1, data2, callback) {
            $http.post('/Admin/EDMSRepository/CreateTempFile?Id=' + data + "&isSearch=" + data1 + "&content=" + data2).then(callback);
        },
        getFileShare: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GetFileShare?id=' + data).then(callback);
        },
        getTreeCategoryActFile: function (callback) {
            $http.post('/Admin/EDMSRepository/GetTreeCategory').then(callback);
        },
        updateActCatFile: function (data, callback) {
            submitFormUpload('/Admin/Activity/UpdateActCatFile', data, callback);
        },
        addFileActInst: function (data, data1, data2, callback) {
            $http.post('/Admin/WorkflowActivity/AddFileActInst?id=' + data + "&actInstCode=" + data1 + "&isRequireSign=" + data2).then(callback);
        },
        getUserShareFilePermission: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetUserShareFilePermission?id=' + data).then(callback);
        },
        deleteShareFile: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/DeleteShareFile?id=' + data + '&userName=' + data1).then(callback);
        },
        autoShareFilePermission: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/AutoShareFilePermission', data).then(callback);
        },

        getActivityByUser: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetActivityByUser?actInstCode=' + data).then(callback);
        },
        updateActivity: function (data, value, isCheck, callback) {
            $http.get('/Admin/WorkflowActivity/UpdateActivity/?actInstCode=' + data + '&Value=' + value + '&IsCheck=' + isCheck).then(callback);
        },
        logActivityUser: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/LogActivityUser?actInstCode=' + data).then(callback);
        },
        getPermission: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetPermission?actInstCode=' + data).then(callback);
        },

        //Send notify
        getMemberSendNotification: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetMemberSendNotification?actInstCode=' + data).then(callback);
        },
        sendNotify: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/SendNotify', data).then(callback);
        },

        //Count
        statiscalWf: function (callback) {
            $http.get('/Admin/WorkflowActivity/StatiscalWf').then(callback);
        },

        //File workflow
        getFileWfInst: function (data, callback) {

            var Activity = ''
            if (data.ActInsCode != '' && data.ActInsCode != null && data.ActInsCode != undefined) {
                Activity = '&ActInsCode=' + data.ActInsCode
            }
            $http.post('/Admin/WorkflowActivity/GetFileWfInst?wfInstCode=' + data.wfInstCode + Activity).then(callback);
        },

        //Command extra
        insertCommandExtra: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/InsertCommandExtra', data).then(callback);
        },
        getCommandTo: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetCommandTo?actInst=' + data).then(callback);
        },
        deleteCommandExtra: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/DeleteCommandExtra?id=' + data).then(callback);
        },
        getCommandFrom: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetCommandFrom?actInst=' + data).then(callback);
        },
        confirmCommandExtra: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/ConfirmCommandExtra?id=' + data + '&confirm=' + data1).then(callback);
        },

        //Real-time activity instance
        isUpdateNewData: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/IsUpdateNewData?actCode=' + data).then(callback);
        },
        autoUpdateLockShareJson: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/AutoUpdateLockShareJson?actCode=' + data).then(callback);
        },
        //Log action user
        getLastActionUser: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/GetLastActionUser?actCode=' + data).then(callback);
        },

        //Nested WF
        getNestedActCat: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivity/GetNestedActCat?actCode=' + data + '&actInstCode=' + data1).then(callback);
        },

        //Update Workflow
        getStatusWF: function (callback) {
            $http.post('/Admin/WorkflowActivity/GetStatusWF').then(callback);
        },
        updateWfInstance: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/UpdateWfInstance', data).then(callback);
        },
        statisWfByGroup: function (callback) {
            $http.post('/Admin/WorkflowActivity/StatisWfByGroup').then(callback);
        },

        //Upgrade attributes data
        getGroupAttrOfWf: function (data, data1, callback) {
            $http.get('/Admin/WorkflowActivity/GetGroupAttrOfWf?wfCode=' + data + '&actCode=' + data1).then(callback);
        },
        getListATTRUNIT: function (callback) {
            $http.post('/Admin/CatActivity/GetListATTRUNIT').then(callback);
        },
        getGroupAttr: function (callback) {
            $http.post('/Admin/Activity/GetGroupAttr').then(callback);
        },

        //New Design status
        getStatusByGroupSetting: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetStatusByGroupSetting?actCode=' + data).then(callback);
        },
        blink: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/Blink?actCode=' + data).then(callback);
        },

        //Redirect page
        redirectToObject: function (data, data1, callback) {
            $http.get('/Admin/WorkflowActivity/RedirectToObject?objectType=' + data + "&objectCode=" + data1).then(callback);
        },
        getItemStaffLate: function (data, callback) {
            $http.post('/Admin/StaffLate/GetItem/', data).then(callback);
        },

        //Log Status
        getLogStatusInst: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetLogStatusInst?actCode=' + data).then(callback);
        },
        //Check lock status
        checkLockStatus: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/CheckLockStatus?actCode=' + data).then(callback);
        }
    };
});

app.controller('Ctrl_ESEIM', function ($scope, $rootScope, $compile, $uibModal, dataservice, $cookies, $translate) {
    $rootScope.go = function (path) {
        $location.path(path); return false;
    };
    var culture = $cookies.get('_CULTURE') || 'vi-VN';
    $translate.use(culture);
    $rootScope.$on('$translateChangeSuccess', function () {
        caption = caption[culture] ? caption[culture] : caption;

        $.extend($.validator.messages, {
            min: caption.COM_VALIDATE_VALUE_MIN,
        })

        $rootScope.checkData = function (data) {
            var partternCode = /^[a-zA-Z0-9]+[^!@#$%^&*<>?\s]*$/;
            var partternName = /^(^[ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z.0-9\s]+$)|^(^[0-9]+[ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z.\s][ĂăĐđĨĩŨũƠơƯưÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẠ-ỹa-zA-Z.0-9\s]*$)/
            var mess = { Status: false, Title: "" }
            if (!partternCode.test(data.AssetCode)) {
                mess.Status = true;
                mess.Title = mess.Title.concat(" - ", caption.ASSET_VALIDATE_ITEM_CODE.replace("{0}", caption.ASSET_CURD_LBL_ASSET_CODE), "<br/>");//"Mã tài sản bao gồm chữ cái và số"
            }
            if (!partternName.test(data.AssetName)) {
                mess.Status = true;
                mess.Title += caption.ASSET_VALIDATE_ASSET_NAME.replace("{0}", caption.ASSET_CURD_LBL_ASSET_NAME)//"Yêu cầu tên tài sản có ít nhất một ký tự là chữ cái hoặc số và không bao gồm ký tự đặc biệt!"
            }
            return mess;
        }

        $rootScope.validationOptions = {
            rules: {
                WorkFlowCode: {
                    required: true,
                    maxlength: 100
                },
                Name: {
                    required: true,
                    maxlength: 100
                },
                Duration: {
                    regx: /^[+]?\d+(\.\d+)?$/
                }
            },
            messages: {
                WorkFlowCode: {
                    required: caption.ACT_VALIDATE_ACTIVITY_CODE_NOT_NULL,
                    maxlength: caption.ACT_VALIDATE_ACTIVITY_CODE_SIZE
                },
                Name: {
                    required: caption.ACT_VALIDATE_ACTIVITY_NAME_NOT_NULL,
                    maxlength: caption.ACT_VALIDATE_ACTIVITY_NAME_SIZE
                },
                Duration: {
                    regx: caption.WFAI_VALIDATE_REGX_DURATION
                }
            }
        }

        $rootScope.validationOptionsWF = {
            rules: {
                WfInstName: {
                    required: true,
                    maxlength: 255,
                    regx: /^[^\s].*/
                }
            },
            messages: {
                WfInstName: {
                    required: caption.WFAI_VALIDATE_TITLE_WF_INST,
                    maxlength: caption.WFAI_VALIDATE_MAX_LENGTH_255,
                    regx: caption.WFAI_VALIDATE_REGX_WF_NAME
                }
            }
        }

        $rootScope.validationOptionsActivity = {
            rules: {
                Title: {
                    required: true,
                    regx: /^[^\s].*/,
                    maxlength: 100
                },
                Duration: {
                    required: true,
                    regx: /^[+]?\d+(\.\d+)?$/
                },
                ActivityCode: {
                    required: true,
                },
                Located: {
                    maxlength: 255
                }
            },
            messages: {
                Title: {
                    required: caption.WFAI_VALIDATE_ACT_TITLE,
                    regx: caption.WFAI_VALIDATE_REGX_ACT_TITLE,
                    maxlength: caption.WFAI_VALIDATE_MAX_LENGTH_255,
                },
                Duration: {
                    required: caption.WFAI_VALIDATE_DURATION,
                    regx: caption.WFAI_VALIDATE_REGX_DURATION_TIME
                },
                Located: {
                    maxlength: caption.WFAI_VALIDATE_MAX_LENGTH_255,
                }
            }
        }

        $rootScope.validationOptionsCardLogger = {
            rules: {
                DtCode: {
                    required: true,
                },
                DtTitle: {
                    required: true,
                }
            },
            messages: {
                DtCode: {
                    required: caption.WFAI_VALIDATE_ATTRT_CODE
                },
                DtTitle: {
                    required: caption.WFAI_VALIDATE_ATTR_NAME,
                }
            }
        }
    });
});

app.config(function ($routeProvider, $validatorProvider, $translateProvider) {
    $translateProvider.useUrlLoader('/Admin/WorkflowActivity/Translation');
    caption = $translateProvider.translations();
    $routeProvider
        .when('/', {
            templateUrl: ctxfolder + '/index.html',
            controller: 'index'
        })
        .when('/map', {
            templateUrl: ctxfolder + '/google-map.html',
            controller: 'google-map'
        })
        .when('/editProject', {
            templateUrl: ctxfolderProject + '/edit.html',
            controller: 'editProject'
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

app.controller('index', function ($scope, $timeout, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, $filter, myService, $location) {

    $(".content-wrapper").removeClass("padding-right-80");
    $(".content-wrapper").addClass("padding-right-90");
    $("#breadcrumb").appendTo("#breadcrumb-container");
    $('.main-menu').removeClass('hidden');

    var itemmmm;
    var canvas2;
    var dataweb = "";
    var check = 0;
    var checkconn = 0;
    var checkdell = [];
    var checkdell2 = [];
    var timer;
    var time;
    var arr = [];
    var cu = 0;
    $scope.isShowDiagram = false;
    $scope.isShowCard = false;
    $scope.isShowListWf = true;
    $scope.checkHiddenFileWfActivity = false;

    $scope.showDiagram = function () {
        $scope.isShowDiagram = true;
        $scope.isShowCard = false;
        $scope.isShowListWf = false;
    }
    $scope.showGrid = function () {
        $scope.isShowDiagram = false;
        $scope.isShowCard = false;
        $scope.isShowListWf = true;
    }

    $scope.groupSelect = null;

    $scope.showCard = function () {
        $scope.isShowDiagram = false;
        $scope.isShowCard = true;
        $scope.isShowListWf = false;
    }
    var interval = [];

    $scope.model = {
        WfInst: "",
        WfCode: "",
        checkHiddenFileWfActivity: false
    };
    $scope.modelSearch = {
        WfInst: "",
        WfCode: "",
        WfInstName: '',
        Status: '',
        WfGroup: ''
    }
    var LabelConnection = draw2d.Connection.extend({
        init: function () {
            this._super();
            var auto = new Connection_Label({

            });
            auto.attr({
                text: "Auto",
                width: 20,
                height: 20,
                bgColor: "white",
                cssClass: "auto",
                radius: 3
            });
            this.add(auto, new draw2d.layout.locator.PolylineMidpointLocator(), 1000000);
            var dell = new draw2d.shape.basic.Image({
                path: "/images/workflowActivity/delete.png",
                color: "#27ae60",
                fontColor: "#0d0d0d",
                bgColor: "#ffffff",
                stroke: 1,
                height: 25,
                width: 25,
                y: -30,
                x: 20,
                visible: false
            });
            auto.add(dell, new draw2d.layout.locator.Locator());
            var setting = new draw2d.shape.basic.Image({ path: "/images/workflowActivity/setting.png", height: 25, width: 25, stroke: 1, x: -10, y: -30, visible: false, cssClass: "settinglabel" });
            auto.add(setting, new draw2d.layout.locator.Locator());
            var that = this;
            that.setCssClass("connect");
            auto.installEditor(new draw2d.ui.LabelInplaceEditor({ width: 20 }));
            dell.on("click", function () {
                $scope.deleteSettingWF();
                canvas2.remove(that);
            });
            auto.on("click", function () {
                if (dell.isVisible() == false) {
                    dell.attr({
                        visible: true
                    });
                    setting.attr({
                        visible: true
                    });
                } else {
                    dell.attr({
                        visible: false
                    });
                    setting.attr({
                        visible: false
                    });
                }
            });
            this.attr({
                cssClass: "path",
                router: new draw2d.layout.connection.InteractiveManhattanConnectionRouter(),
                outlineStroke: 1,
                outlineColor: "#303030",
                stroke: 2,
                color: "gray",
                radius: 4,
            });
            setting.on("click", function () {
                $scope.settingTransition();
            })
        },
        getPersistentAttributes: function () {
            var memento = this._super();

            // add all decorations to the memento 
            //
            memento.labels = [];
            this.children.each(function (i, e) {
                var labelJSON = e.figure.getPersistentAttributes();
                labelJSON.locator = e.locator.NAME;
                memento.labels.push(labelJSON);
            });

            return memento;
        },
        setPersistentAttributes: function (memento) {
            this._super(memento);

            // remove all decorations created in the constructor of this element
            //
            this.resetChildren();

            // and add all children of the JSON document.
            //
            $.each(memento.labels, $.proxy(function (i, json) {
                // create the figure stored in the JSON
                var figure = eval("new " + json.type + "()");

                // apply all attributes
                figure.attr(json);

                // instantiate the locator
                var locator = eval("new " + json.locator + "()");

                // add the new figure as child to this figure
                this.add(figure, locator);
            }, this));
        }
    });
    draw2d.shape.basic.Label.inject({
        clearCache: function () {
            this.portRelayoutRequired = true;
            this.cachedMinWidth = null;
            this.cachedMinHeight = null;
            this.cachedWidth = null;
            this.cachedHeight = null;
            this.lastAppliedTextAttributes = {};
            return this;
        }
    });
    var canvas = new draw2d.Canvas("gfx_holder");
    canvas.getCommandStack().addEventListener(function (e) {
        if (e.isPostChangeEvent()) {
            displayJSON(canvas);
        }
    });
    canvas.installEditPolicy(new draw2d.policy.canvas.FadeoutDecorationPolicy());
    canvas.installEditPolicy(new draw2d.policy.canvas.ExtendedKeyboardPolicy());
    canvas.installEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy({
        createConnection: function (sourcePort, targetPort) {
            itemmmm = new LabelConnection();
            itemmmm.setSourceDecorator(new draw2d.decoration.connection.BarDecorator());
            itemmmm.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator());
            canvas.add(new draw2d.shape.basic.Oval({
                cssClass: "ball" + cu,
                id: "ball",
                width: 10,
                height: 10,
                y: -5

            }));
            cu++;
            checkconn = 1;
            arr.push(itemmmm);
            console.log(arr);
            return itemmmm;

        }
    }));
    canvas2 = canvas;
    $rootScope.canvas2 = canvas;

    //Init data
    $scope.initData = function () {
        dataservice.getWorkflow(function (rs) {
            rs = rs.data;
            $scope.lstWorkflow = rs;
        })
        dataservice.getWorkflowInstance($scope.modelSearch.WfInst, function (rs) {
            rs = rs.data;
            $scope.lstWfInst = rs;
        })
        dataservice.getWflow(function (rs) {
            rs = rs.data;
            $scope.listWF = rs;
        })
        dataservice.getFormCat(function (rs) {
            rs = rs.data;
            $scope.lstFormcat = rs;
        })

        dataservice.getSharpLibraryImage(function (rs) {
            rs = rs.data;
            $scope.lstLibSharp = rs;
        })

        dataservice.statiscalWf(function (rs) {
            rs = rs.data;
            $scope.statiscalWf = rs;
        })

        dataservice.getWfGroup(function (rs) {
            rs = rs.data;
            $scope.lstWfGroup = rs;
        })

        dataservice.getStatusWF(function (rs) {
            rs = rs.data;
            $scope.listStatusWF = rs;
        })

        dataservice.getWorkFlow(function (rs) {
            rs = rs.data;
            $scope.lstWF = rs;
        })

        dataservice.statisWfByGroup(function (rs) {
            rs = rs.data;
            $scope.infoGroupWf = rs;
        })

        //get líst for edit 
        dataservice.getObjTypeJC(function (rs) {
            rs = rs.data;
            $scope.lstObjectType = rs;
        });
        dataservice.getWorkFlow(function (rs) {
            rs = rs.data;
            $scope.lstWF = rs;
        });
        dataservice.getStatusCommand(function (rs) {
            rs = rs.data;
            $scope.lstCommandStatus = rs;
        })
        dataservice.getApprove(function (rs) {
            rs = rs.data;
            $scope.lstApprove = rs;

        })
        dataservice.getCommand(function (rs) {
            rs = rs.data;
            $scope.lstCommandCommon = rs;
        })
        dataservice.getConfirm(function (rs) {
            rs = rs.data;
            $scope.lstConfirm = rs;
        })

        //Assign
        dataservice.getGroupAct(function (rs) {
            rs = rs.data;
            $scope.lstGroup = rs;
        })
        dataservice.getTypeAct(function (rs) {
            rs = rs.data;
            $scope.lstType = rs;
        })
        dataservice.getBranch(function (rs) {
            rs = rs.data;
            $scope.lstBranch = rs;
        })
        dataservice.getListRoleAssign(function (rs) {
            rs = rs.data;
            $scope.lstRole = rs;
        })
        dataservice.getStatusAssign(function (rs) {
            rs = rs.data;
            $scope.lstStatusAssign = rs;
        })


        //Object operation
        dataservice.getObjTypeJC(function (rs) {
            rs = rs.data;
            $scope.lstObjType = rs;
        })

        //Group
        dataservice.getStatusWF(function (rs) {
            rs = rs.data;
            $scope.listStatusWF = rs;
        })
        dataservice.getWfGroup(function (rs) {
            rs = rs.data;
            $scope.listWfGroup = rs;
        })
    }
    $scope.initData();

    //Zoom canvas
    $scope.zoomIn = function () {
        canvas.setZoom(canvas.getZoom() * 0.9, true);
    }
    $scope.zoomDefault = function () {
        canvas.setZoom(1.0, true);
    }
    $scope.zoomOut = function () {
        canvas.setZoom(canvas.getZoom() * 1.1, true);
    }

    //Region WorkFlow
    $scope.checkDraw = {
        ActCode: "",
        CntDraw: 0
    };

    $scope.wfInstanceClick = function (code) {
        $scope.model.WfInst = code;
        $rootScope.WfInstCode = code;
        $scope.model.WfCode = "";
        $scope.model.Code = code;
        $scope.isShowDiagram = true;
        $scope.isShowCard = false;
        $scope.isShowListWf = false;

        drawWfInstance(code);
    };

    // view help detail
    $scope.viewCmsDetail = function (helpId) {
        //item, bookMark
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderDashBoard + '/viewItem.html',
            controller: 'viewItemHelp',
            backdrop: 'static',
            windowClass: 'message-avoid-header',
            size: '65',
            resolve: {
                para: function () {
                    return {
                        helpId
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {

        }, function () {
        });
    };



    //Edit card
    $scope.editCardJob = function (code) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCardJob + '/add-card-buffer.html',
            controller: 'edit-cardCardJob',
            size: '80',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                para: function () {
                    return code;
                }
            }
        });
        modalInstance.result.then(function (d) {
            $rootScope.reloadGridCard();
        }, function () { });
    }

    //Draw diagram wf instance

    function drawWfInstance(wfInstCode) {
        if ($scope.checkDraw.CntDraw === 0) {
            dataservice.getActivityInstance(wfInstCode, function (rs) {
                $rootScope.canvas2.clear();
                canvas.clear();
                canvas2.clear();

                rs = rs.data;
                var data_json = [];
                for (var i = 0; i < rs.length; i++) {
                    if (rs[i].shapJson != null) {
                        var shapeAct = JSON.parse(rs[i].shapJson);

                        clearInterval(interval[rs[i].ActInstCode]);

                        shapeAct.labels[0].text = rs[i].Title;
                        shapeAct.labels[2].text = rs[i].Status;
                        shapeAct.id = rs[i].ActInstCode;
                        shapeAct.labels[12].text = caption.WFAI_LBL_COMMAND + ": " + rs[i].CommandText;

                        if (rs[i].StatusCode == "STATUS_ACTIVITY_LOCK" || rs[i].StatusCode == "STATUS_ACTIVITY_NOT_DOING") {
                            shapeAct.bgColor = "rgba(128,128,128,1)"
                        }
                        else if (rs[i].StatusCode == "STATUS_ACTIVITY_END") {
                            shapeAct.bgColor = "rgba(0,128,128,1)";
                            if (rs[i].IsValid) {
                                shapeAct.labels[11].text = rs[i].EndTimeTxt;
                            } else {
                                shapeAct.labels[11].text = rs[i].EndTimeTxt + ", " + rs[i].LogCountDown;
                                shapeAct.labels[11].bgColor = "#FF9966";

                            }
                        }
                        else if ((rs[i].StatusCode == "STATUS_ACTIVITY_CANCELD" || rs[i].StatusCode == "STATUS_ACTIVITY_STOP") && !rs[i].IsLock) {
                            shapeAct.bgColor = "rgba(255,0,0,1)"
                        }
                        else {
                            shapeAct.bgColor = "rgba(0,128,0,1)"
                        }

                        data_json.push(shapeAct);
                    }
                }
                dataservice.getTransitionInstance(wfInstCode, function (res) {
                    $scope.lisTrs = res.data;
                    if ($scope.lisTrs.length > 0) {
                        for (var k = 0; k < $scope.lisTrs.length; k++) {
                            var shapeTransition = JSON.parse($scope.lisTrs[k].tranShapJson);
                            shapeTransition.source.node = $scope.lisTrs[k].actintial;
                            shapeTransition.target.node = $scope.lisTrs[k].actdes;
                            shapeTransition.id = $scope.lisTrs[k].IdAutoGen;
                            data_json.push(shapeTransition);
                        }
                    }
                    var reader = new draw2d.io.json.Reader();
                    reader.unmarshal(canvas, data_json);
                    displayJSON(canvas);
                    for (var i = 0; i < rs.length; i++) {
                        if (rs[i].StatusCode != "STATUS_ACTIVITY_NOT_DOING"
                            && rs[i].StatusCode != "STATUS_ACTIVITY_LOCK"
                            && rs[i].StatusCode != "STATUS_ACTIVITY_STOPPED"
                            && rs[i].StatusCode != "STATUS_ACTIVITY_END"
                            && rs[i].StatusCode != "STATUS_ACTIVITY_CANCEL")
                            $rootScope.downTime(rs[i].StartTime, rs[i].ActInstCode, rs[i].Timer, rs[i].Unit);
                    }
                });
                setTimeout(function () {
                    $(".setting").on('click', function () {

                        var node = $rootScope.canvas2.getPrimarySelection();
                        var actInstCode = node.id;
                        dataservice.checkPermissionEditActivity(actInstCode, function (rs1) {

                            rs1 = rs1.data;
                            if (!rs1) {
                                return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
                            }
                            for (var i = 0; i < rs.length; i++) {
                                if (rs[i].ActInstCode == actInstCode) {
                                    var objCode = rs[i].ObjCode;
                                    dataservice.getItemActInstByCode(actInstCode, function (rs) {
                                        $rootScope.IsLock = rs.data.IsLock;
                                        $rootScope.ActCatCode = rs.data.DataActInst.ActivityCode
                                        var modalInstance = $uibModal.open({
                                            animation: true,
                                            templateUrl: ctxfolder + '/add-activity-instance.html',
                                            controller: 'edit-activity-instance',
                                            backdrop: 'static',
                                            keyboard: false,
                                            size: '50',
                                            resolve: {
                                                para: function () {
                                                    return {
                                                        Data: rs.data,
                                                        ObjCode: objCode
                                                    }
                                                }
                                            }
                                        });
                                        modalInstance.result.then(function (d) {
                                            dataservice.getInstance($rootScope.WfInstCode, function (rs) {
                                                rs = rs.data;
                                                $scope.lstActInst = rs;
                                            })
                                            afterEditActInst(d);
                                            $scope.search();
                                        }, function () {
                                        });
                                    })

                                    //for (var i = 0; i < $scope.lstActInst.length; i++) {
                                    //    if ($scope.lstActInst[i].ActInstCode == actInstCode) {
                                    //        $scope.lstActInst[i].IsSelected = true;
                                    //    } else {
                                    //        $scope.lstActInst[i].IsSelected = false;
                                    //    }
                                    //}

                                    break;
                                }
                            }
                        })
                    });
                }, 500)
            })
        }
    }

    $scope.saveDiagram = function () {

        if ($scope.model.WfInst == "") {
            App.toastrError(caption.WFAI_MSG_WF_HAS_NOT_ACT);
        }
        var data = [];
        var json = JSON.parse(dataweb);
        for (var i = 0; i < json.length; i++) {
            var obj = {
                ActInst: json[i].id,
                Shape: JSON.stringify(json[i]),
                WfInstCode: $scope.model.WfInst
            };
            data.push(obj);
        }
        dataservice.saveDiagram(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
            }
        })
    }

    $scope.isSearch = false;
    $scope.showSearch = function () {
        if ($scope.isSearch) {
            $scope.isSearch = false;
        } else {
            $scope.isSearch = true;
        }
    }
    $scope.isShowJson = false;
    $scope.showJson = function () {
        if ($scope.isShowJson) {
            $scope.isShowJson = false;
        } else {
            $scope.isShowJson = true;
        }
    }

    $scope.searchWfInst = function (data) {

        setTimeout(function () {
            dataservice.getWorkflowInstance(data, function (rs) {
                rs = rs.data;
                $scope.lstWfInst = rs;
            })
        }, 700);
    }


    function afterEditActInst(obj) {
        dataservice.getDetailActInst(obj.ActInstCode, function (rs) {
            rs = rs.data;
            var allFigure = $rootScope.canvas2.getFigures();
            if (allFigure.data.length > 0) {
                for (var i = 0; i < allFigure.data.length; i++) {
                    if (allFigure.data[i].id == rs.ActInstCode) {
                        var fTitle = allFigure.data[i].children.data[0].figure;
                        var fStatus = allFigure.data[i].children.data[2].figure;
                        var fTime = allFigure.data[i].children.data[11].figure;

                        if (rs.StatusCode == "STATUS_ACTIVITY_LOCK"
                            || rs.StatusCode == "STATUS_ACTIVITY_NOT_DOING") {
                            clearInterval(interval[rs.ActInstCode]);
                            allFigure.data[i].bgColor.alpha = 1;
                            allFigure.data[i].bgColor.blue = 128;
                            allFigure.data[i].bgColor.green = 128;
                            allFigure.data[i].bgColor.hashString = "#808080";
                            allFigure.data[i].bgColor.red = 128;
                            fTime.attr({
                                text: "",
                            });
                        }
                        else if (rs.StatusCode == "STATUS_ACTIVITY_END") {
                            clearInterval(interval[rs.ActInstCode]);
                            allFigure.data[i].bgColor.alpha = 1;
                            allFigure.data[i].bgColor.blue = 128;
                            allFigure.data[i].bgColor.green = 128;
                            allFigure.data[i].bgColor.hashString = "#008080";
                            allFigure.data[i].bgColor.red = 0;
                            if (rs.IsValid) {
                                fTime.attr({
                                    text: rs.EndTimeTxt,
                                });
                            } else {
                                fTime.attr({
                                    text: rs.EndTimeTxt + ", " + rs.LogCountDown,
                                });
                            }
                            if (rs.StatusCode == "STATUS_ACTIVITY_END") {
                                dataservice.getWorkflowInstance($scope.modelSearch.WfInst, function (rs) {
                                    rs = rs.data;
                                    $scope.lstWfInst = rs;
                                })
                            }
                        }
                        else if ((rs.StatusCode == "STATUS_ACTIVITY_CANCEL" || rs.StatusCode == "STATUS_ACTIVITY_STOPPED")) {
                            clearInterval(interval[rs.ActInstCode]);
                            allFigure.data[i].bgColor.alpha = 1;
                            allFigure.data[i].bgColor.blue = 0;
                            allFigure.data[i].bgColor.green = 0;
                            allFigure.data[i].bgColor.hashString = "#FF0000";
                            allFigure.data[i].bgColor.red = 255;
                            fTime.attr({
                                text: "",
                            });
                        }
                        else {
                            clearInterval(interval[rs.ActInstCode]);
                            $rootScope.downTime(rs.StartTime, rs.ActInstCode, rs.Timer, rs.Unit)
                            allFigure.data[i].bgColor.alpha = 1;
                            allFigure.data[i].bgColor.blue = 0;
                            allFigure.data[i].bgColor.green = 128;
                            allFigure.data[i].bgColor.hashString = "#008000";
                            allFigure.data[i].bgColor.red = 0;
                        }

                        fTitle.attr({
                            text: rs.Title
                        });
                        fStatus.attr({
                            text: rs.Status
                        });
                    }
                    if (obj.LstActInst.length > 0) {
                        for (var k = 0; k < obj.LstActInst.length; k++) {
                            if (allFigure.data[i].id == obj.LstActInst[k].ActivityInstCode) {
                                //Downtime
                                clearInterval(interval[obj.LstActInst[k].ActivityInstCode]);
                                $rootScope.downTime(obj.LstActInst[k].StartTime, obj.LstActInst[k].ActivityInstCode, obj.LstActInst[k].Duration, obj.LstActInst[k].Unit)


                                var fTitle = allFigure.data[i].children.data[0].figure;
                                var fStatus = allFigure.data[i].children.data[2].figure;
                                var fTime = allFigure.data[i].children.data[11].figure;

                                //Set back ground
                                allFigure.data[i].bgColor.alpha = 1;
                                allFigure.data[i].bgColor.blue = 0;
                                allFigure.data[i].bgColor.green = 128;
                                allFigure.data[i].bgColor.hashString = "#008000";
                                allFigure.data[i].bgColor.red = 0;

                                fTitle.attr({
                                    text: obj.LstActInst[k].Title
                                });
                                fStatus.attr({
                                    text: "Đang xử lý"
                                });
                                fTime.attr({
                                    text: ""
                                });
                            }
                        }
                    }
                }
            }
        });
        $scope.search();
    }

    $rootScope.downTime = function (startTime, actInst, duration, unit) {
        var countDownDate = new Date(startTime).getTime();
        var cntOut = 0;
        var totalTimeOut = 0;
        var unitTimeOut = "";
        interval[actInst] = setInterval(function () {
            var allFigure = $rootScope.canvas2.getFigures();
            if (allFigure.data.length > 0) {
                for (var i = 0; i < allFigure.data.length; i++) {
                    if (allFigure.data[i].id === actInst) {
                        // Update the count down every 1 second
                        var now = new Date().getTime();
                        // Find the distance between now and the count down date
                        var distance = countDownDate - now;
                        var figure = allFigure.data[i].children.data[11].figure;
                        if (distance < 0) {
                            //Log time
                            dataservice.getStartXLast(actInst, function (rs) {
                                rs = rs.data;
                                var cnt = 0;
                                if (rs.StartX != null) {
                                    var checkTime = 0;
                                    var startX = new Date(rs.StartX).getTime();
                                    var timeOut = now - startX;

                                    if (unit == "Ngày" || unit == "DURATION_UNIT20200904094128") {
                                        cnt = timeOut / (duration * 24 * 60 * 60 * 1000);
                                        checkTime = new Date(rs.StartX).getTime() + (duration * 24 * 60 * 60 * 1000)
                                        unitTimeOut = "ngày"
                                    }
                                    if (unit == "Giờ" || unit == "DURATION_UNIT20200904094132") {
                                        cnt = timeOut / (duration * 60 * 60 * 1000);
                                        checkTime = new Date(rs.StartX).getTime() + (duration * 60 * 60 * 1000);
                                        unitTimeOut = "giờ"
                                    }
                                    if (unit == "Phút" || unit == "DURATION_UNIT20200904094135") {
                                        cnt = timeOut / (duration * 60 * 1000)
                                        checkTime = new Date(rs.StartX).getTime() + (duration * 60 * 1000);
                                        unitTimeOut = "phút"
                                    }
                                    if (unit == "Giây" || unit == "DURATION_UNIT20200904094139") {
                                        cnt = timeOut / (duration * 1000)
                                        checkTime = new Date(rs.StartX).getTime() + (duration * 1000);
                                        unitTimeOut = "giây"
                                    }

                                    if (checkTime - now > 0) {
                                        distance = checkTime - now;
                                        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                                        // Output the result in an element with id="demo"
                                        var time = days + "d " + hours + "h "
                                            + minutes + "m " + seconds + "s" + ", lần: " + rs.Cnt + ", tổng: " + rs.Total + " " + unitTimeOut;
                                        figure.attr({
                                            text: time,
                                            bgColor: "#FF9966"
                                        });
                                    } else {
                                        cnt = Math.round(cnt);
                                        dataservice.insertLogCountDown(actInst, cnt, function (rs) {
                                            rs = rs.data;
                                            $scope.logTime = rs.Object;
                                            if ($scope.logTime.UnitTime == "Ngày" || $scope.logTime.UnitTime == "DURATION_UNIT20200904094128") {
                                                countDownDate = new Date($scope.logTime.StartTimeX).getTime() + (duration * 24 * 60 * 60 * 1000)
                                                unitTimeOut = "ngày"
                                            }
                                            if ($scope.logTime.UnitTime == "Giờ" || $scope.logTime.UnitTime == "DURATION_UNIT20200904094132") {
                                                countDownDate = new Date($scope.logTime.StartTimeX).getTime() + (duration * 60 * 60 * 1000)
                                                unitTimeOut = "giờ"
                                            }
                                            if ($scope.logTime.UnitTime == "Phút" || $scope.logTime.UnitTime == "DURATION_UNIT20200904094135") {
                                                countDownDate = new Date($scope.logTime.StartTimeX).getTime() + (duration * 60 * 1000)
                                                unitTimeOut = "phút"
                                            }
                                            if ($scope.logTime.UnitTime == "Giây" || $scope.logTime.UnitTime == "DURATION_UNIT20200904094139") {
                                                countDownDate = new Date($scope.logTime.StartTimeX).getTime() + (duration * 1000)
                                                unitTimeOut = "giây"
                                            }
                                            //Set time back
                                            distance = countDownDate - new Date().getTime();

                                            cntOut = $scope.logTime.Cnt;
                                            totalTimeOut = $scope.logTime.Total;

                                            figure.attr({
                                                text: "",
                                                bgColor: "#FF9966"
                                            });
                                        })
                                    }
                                }
                                else {
                                    var startX = new Date(startTime).getTime();
                                    var timeOut = now - startX;

                                    if (unit == "Ngày" || unit == "DURATION_UNIT20200904094128") {
                                        cnt = timeOut / (duration * 24 * 60 * 60 * 1000)
                                    }
                                    if (unit == "Giờ" || unit == "DURATION_UNIT20200904094132") {
                                        cnt = timeOut / (duration * 60 * 60 * 1000)
                                    }
                                    if (unit == "Phút" || unit == "DURATION_UNIT20200904094135") {
                                        cnt = timeOut / (duration * 60 * 1000)
                                    }
                                    if (unit == "Giây" || unit == "DURATION_UNIT20200904094139") {
                                        cnt = timeOut / (duration * 1000)
                                    }
                                    cnt = Math.round(cnt);
                                    dataservice.insertLogCountDown(actInst, cnt, function (rs) {
                                        rs = rs.data;
                                        $scope.logTime = rs.Object;
                                        if ($scope.logTime.UnitTime == "Ngày" || $scope.logTime.UnitTime == "DURATION_UNIT20200904094128") {
                                            countDownDate = new Date($scope.logTime.StartTimeX).getTime() + (duration * 24 * 60 * 60 * 1000)
                                            unitTimeOut = "ngày"
                                        }
                                        if ($scope.logTime.UnitTime == "Giờ" || $scope.logTime.UnitTime == "DURATION_UNIT20200904094132") {
                                            countDownDate = new Date($scope.logTime.StartTimeX).getTime() + (duration * 60 * 60 * 1000)
                                            unitTimeOut = "giờ"
                                        }
                                        if ($scope.logTime.UnitTime == "Phút" || $scope.logTime.UnitTime == "DURATION_UNIT20200904094135") {
                                            countDownDate = new Date($scope.logTime.StartTimeX).getTime() + (duration * 60 * 1000)
                                            unitTimeOut = "phút"
                                        }
                                        if ($scope.logTime.UnitTime == "Giây" || $scope.logTime.UnitTime == "DURATION_UNIT20200904094139") {
                                            countDownDate = new Date($scope.logTime.StartTimeX).getTime() + (duration * 1000)
                                            unitTimeOut = "giây"
                                        }
                                        //Set time back
                                        distance = countDownDate - new Date().getTime();

                                        cntOut = $scope.logTime.Cnt;
                                        totalTimeOut = $scope.logTime.Total;

                                        figure.attr({
                                            text: "",
                                            bgColor: "#FF9966"
                                        });
                                    })
                                }
                            })
                        }
                        else {
                            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                            // Output the result in an element with id="demo"
                            var time = days + "d " + hours + "h "
                                + minutes + "m " + seconds + "s" + ", lần: " + cntOut + ", tổng: " + totalTimeOut + " " + unitTimeOut;
                            figure.attr({
                                text: time
                            });
                        }
                    }
                }
            }
        }, 1000);
    }

    $scope.updateLast = function () {
        setInterval(function () {
            $(".setting").on('click', function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: ctxfolder + '/edit-activity.html',
                    controller: 'edit-activity',
                    backdrop: 'static',
                    size: '50',
                    resolve: {
                        para: function () {
                            return;
                        }
                    }
                });
                modalInstance.result.then(function (d) {

                }, function () {
                });
            });
            $('.delll').on('click', function () {
                $scope.deleteAct = function () {
                    var node = $rootScope.canvas2.getPrimarySelection();

                    dataservice.deleteActivity(node.id, function (rs) {
                        rs = rs.data;
                        if (rs.Error) {
                            App.toastrError(rs.Title);
                        }
                        else {
                            App.toastrSuccess(rs.Title);
                        }
                    })
                    // xoa  transiton theo act
                    dataservice.deleteTransAct(node.id, function (rs) {
                        rs = rs.data;
                        if (rs.Error) {
                            App.toastrError(rs.Title);
                        }
                        else {
                            App.toastrSuccess(rs.Title);
                        }
                    })
                    dataservice.deleteMileStone(node.id, function (rs) {
                        rs = rs.data;
                        if (rs.Error) {
                            App.toastrError(rs.Title);
                        }
                        else {
                            App.toastrSuccess(rs.Title);
                        }
                    })
                }
                $scope.deleteAct();
                var node = $rootScope.canvas2.getPrimarySelection();
                var command = new draw2d.command.CommandDelete(node);
                $rootScope.canvas2.getCommandStack().execute(command);
            });
            if (screen.width < 1000) {
                $(".txt1").css("width", "150px");
                $(".txt1").css("height", "60px");

                $(".txt1 ").click(function () {
                    var node = canvas2.getPrimarySelection();
                    $(document).on("mousemove", function (event) {
                        node.attr({
                            x: event.pageX,
                            y: event.pageY
                        });
                        $(document).off("mousemove");


                    });
                });
            }
        }, 3000);
        $('.btn-save2').on('click', function (e) {
            var node = canvas2.getPrimarySelection();
            //node.children.data[0].figure// trỏ đến label
            var text11 = document.getElementById("activity-name2").value;
            if (text11 == "") {

            } else {
                node.children.data[0].figure.attr({
                    text: text11
                });
            }
            document.getElementById("activity-name2").value = "";
            var text22 = document.getElementById("state-name2").value;
            timer = text22;

            node.children.data[1].figure.attr({

                text: timer
            });
            if (!Date.parse(timer)) {
                node.children.data[3].figure.attr({
                    text: ""
                });
            } else {
                var countDownDate = new Date(timer).getTime();
                // Update the count down every 1 second
                var x = setInterval(function () {
                    // Get today's date and time
                    var now = new Date().getTime();
                    // Find the distance between now and the count down date
                    var distance = countDownDate - now;
                    // Time calculations for days, hours, minutes and seconds
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    // Output the result in an element with id="demo"
                    if (days >= 1) {
                        time = days + "d " + hours + "h " +
                            minutes + "m " + seconds + "s ";
                    } else {
                        time = hours + "h " +
                            minutes + "m " + seconds + "s ";
                    }
                    node.children.data[3].figure.attr({
                        text: time,
                        stroke: 0.2,
                        radius: 2,
                        bgColor: "#fff"
                    });

                    displayJSON(canvas2);
                    // If the count down is over, write some text 

                }, 1000);
                document.getElementById("state-name2").value = "";
            }
            var ActStatus = $("#status2").val();
            console.log(ActStatus);
            if (ActStatus == 1) {

                if (node.children.data.length == 11) {
                    node.children.data[10].figure.attr({
                        path: "greenclock.svg",
                        id: "clock1"
                    });
                } else {
                    var clock1 = new draw2d.shape.basic.Image({ path: "greenclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                    node.add(clock1, new draw2d.layout.locator.Locator());
                    clock1.setId("clock1");
                }
            }
            if (ActStatus == 2) {


                if (node.children.data.length == 11) {
                    node.children.data[10].figure.attr({
                        path: "redclock.svg",
                        id: "clock2"
                    });
                } else {
                    var clock2 = new draw2d.shape.basic.Image({ path: "redclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                    node.add(clock2, new draw2d.layout.locator.Locator());
                    clock2.setId("clock2");
                }

            }
            if (ActStatus == 3) {
                if (node.children.data.length == 11) {
                    node.children.data[10].figure.attr({
                        path: "blackclock.svg",
                        id: "clock3"
                    });
                } else {
                    var clock3 = new draw2d.shape.basic.Image({ path: "blackclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                    node.add(clock3, new draw2d.layout.locator.Locator());
                    clock3.setId("clock3");
                }
            }
            if (ActStatus == 4) {
                if (node.children.data.length == 11) {
                    node.children.data[10].figure.attr({
                        path: "yellowclock.svg",
                        id: "clock4"
                    });
                } else {
                    var clock4 = new draw2d.shape.basic.Image({ path: "yellowclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                    node.add(clock4, new draw2d.layout.locator.Locator());
                    clock4.setId("clock4");
                }
            }

            $('.modal2').css('display', 'none');
            $('.overlay').removeClass('overlay-show');
            $('.fade2').removeClass('show');
            displayJSON(canvas2);
        });
    }

    //Sharp lib
    $scope.creatActByLib = function (code) {
        dataservice.getSharpLibraryItem(code, function (rs) {
            rs = rs.data;
            var data_json = [];
            data_json.push(JSON.parse(rs.SharpData));
            var reader = new draw2d.io.json.Reader();
            reader.unmarshal(canvas, data_json);
            displayJSON(canvas);
            $scope.updateLast();

        })
    }

    $scope.library = function () {
        var data = {
            WorkflowCode: $scope.model.WfCode,
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/add-wf-sharp-library.html',
            controller: 'add-wf-sharp-library',
            backdrop: 'static',
            size: '50',
            resolve: {
                para: function () {
                    return data;
                }
            }
        });
        modalInstance.result.then(function (d) {

        }, function () {
        });
    }

    //Create instance
    $scope.createWfInstance = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/add-wf-instance.html',
            controller: 'add-wf-instance',
            backdrop: 'static',
            size: '40'
        });
        modalInstance.result.then(function (d) {
            //dataservice.insertInstRunning(d.WfInstCode, d.WfCode, function (rs) {
            //    reloadDataList();
            //})
            reloadDataList();
            dataservice.getWorkflowInstance("", function (rs) {
                rs = rs.data;
                $scope.lstWfInst = rs;
            })
            dataservice.statiscalWf(function (rs) {
                rs = rs.data;
                $scope.statiscalWf = rs;
            })
            dataservice.statisWfByGroup(function (rs) {
                rs = rs.data;
                $scope.infoGroupWf = rs;
            })
        }, function () {
            reloadDataList();
        });
    }

    $scope.deleteWfInstance = function (code) {

        dataservice.deleteWfInstance(code, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                reloadDataList();
                dataservice.statiscalWf(function (rs) {
                    rs = rs.data;
                    $scope.statiscalWf = rs;
                })
            }
        });
    };

    $scope.modelEditWf = {
        WorkflowCode: "",
        ObjectType: "",
        ObjectInst: "",
        Status: ""
    };

    $scope.editWfInst = function (code) {
        dataservice.checkPermisstionEditWF(code, function (rs) {
            rs = rs.data;
            if (!rs) {
                return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
            }
            myService.setCode(code);
            $rootScope.ObjCode = code;
            dataservice.getItemWfInst(code, function (rs) {
                rs = rs.data;
                $scope.modelEditWf = rs.ObjData;
                $scope.modelEditWf.StartTime = rs.StartTime;
                $scope.modelEditWf.EndTime = rs.EndTime;
                if ($scope.modelEditWf.ObjectType != "" && $scope.modelEditWf.ObjectType != null && $scope.modelEditWf.ObjectType != undefined) {
                    dataservice.getObjFromObjType($scope.modelEditWf.ObjectType, function (rs) {
                        rs = rs.data;
                        $scope.lstObjectInst = rs;
                    });
                }
            });
            dataservice.getLstActInst(code, function (rs) {
                rs = rs.data;
                $scope.lstActInstCmd = rs;
            })
            dataservice.getCommandSendByLeader(code, function (rs) {
                rs = rs.data;
                $scope.lstCmdResult = rs;
            })
            dataservice.checkPermissionAssignWF(code, function (rs) {
                rs = rs.data;
                $scope.isPerAssignWF = rs;
            })
            dataservice.getMemberAssignWF(code, function (rs) {
                rs = rs.data;
                $scope.lstMemberAssign = rs;
            })
            dataservice.getAllMemberAssignWF(code, function (rs) {
                rs = rs.data;
                $scope.lstAssignWF = rs;
            })
            dataservice.getObjectProcessWF(code, function (rs) {
                rs = rs.data
                $rootScope.lstObjectProcess = rs;
            })
            dataservice.getInstance(code, function (rs) {
                rs = rs.data;
                $scope.lstActInst = rs;
            })
            $scope.editWorkflow();
            // var modalInstance = $uibModal.open({
            //     animation: true,
            //     templateUrl: ctxfolder + '/edit-wf-instance.html',
            //     controller: 'edit-wf-instance',
            //     backdrop: 'static',
            //     size: '50',
            //     resolve: {
            //         para: function () {
            //             return code;
            //         }
            //     }
            // });
            // modalInstance.result.then(function (d) {
            //     dataservice.getWorkflowInstance($scope.modelSearch.WfInst, function (rs) {
            //         rs = rs.data;
            //         $scope.lstWfInst = rs;
            //     });
            //     dataservice.statisWfByGroup(function (rs) {
            //         rs = rs.data;
            //         $scope.infoGroupWf = rs;
            //     })
            //     $scope.search();
            // }, function () {
            // });
        })
    };

    function readdata() {
        nameee = $('.chosen').val();
        var settings = {
            "url": "http://117.6.131.222:6789//api/ApiActivityWorkFlow",
            "method": "get",
            "datatype": json
        };
        $.ajax(settings).done(function (response) {

            var acti = [];
            if ($('.chosen').val() != 0) {
                canvas2.clear();
                var sum = [];
                var string;
                for (var i = 0; i < response.length; i++) {
                    if (response[i].ActParent == $('.chosen').val()) {
                        var jsons = JSON.parse(response[i].ActAttributeGraph);
                        acti.push(jsons);
                        sum.push(jsons);
                        ////add data vào bảng//
                        // string += '<tr class = "acti"><th>' + response[i].Id + '</th><th>' + response[i].ActName + '</th><th>' + response[i].ActStatus + '</th><th>' + "2 Days" + '</th></tr>';

                    }

                }




                var settings2 = {
                    "url": "http://117.6.131.222:6789//api/ApiTransition",
                    "method": "get",
                    "datatype": json
                };
                $.ajax(settings2).done(function (data) {
                    var jss = [];
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].TrsParent == $('.chosen').val()) {
                            var jsons = JSON.parse(data[i].TrsAttrGraph);

                            jss.push(jsons);
                            sum.push(jsons);



                        }
                    }



                    var reader = new draw2d.io.json.Reader();

                    reader.unmarshal(canvas2, sum);
                    displayJSON(canvas2);
                    updateLast();

                    ////tạo node khi đọc thấy connection//
                    for (var js = 0; js < jss.length; js++) {
                        canvas2.add(new draw2d.shape.basic.Oval({
                            cssClass: "ball" + js,
                            id: "ball",
                            width: 10,
                            height: 10,
                            y: -5

                        }));
                        newdata = JSON.parse(dataweb);
                        for (var dt = 0; dt < newdata.length; dt++) {

                            if (jss[js].id == newdata[dt].id && newdata[dt].vertex.length <= 4) {
                                var path = "M" + "" + newdata[dt].vertex[0].x + " " + newdata[dt].vertex[0].y + "L" + "" + (newdata[dt].vertex[1].x - 4) + "," + newdata[dt].vertex[1].y + "Q" + "" + newdata[dt].vertex[1].x + "," + newdata[dt].vertex[1].y + " " + newdata[dt].vertex[1].x + " ," + (newdata[dt].vertex[1].y - 4) + "L" + "" + newdata[dt].vertex[2].x + "," + (newdata[dt].vertex[2].y - 4) + "Q" + "" + newdata[dt].vertex[2].x + "," + (newdata[dt].vertex[2].y) + " " + (newdata[dt].vertex[2].x + 4) + " ," + (newdata[dt].vertex[2].y) + "L" + "" + newdata[dt].vertex[3].x + "," + (newdata[dt].vertex[3].y);
                                $('.ball' + js).css('offset-path', "path('" + path + "')");
                                $('.ball' + js).css("width", "10px", "height", "10px", "background", "#f33a58", "border-radius", "50%", "offset-distance", "0%");
                                // $('.ball' + js).css("animation", "red-ball1 2s linear infinite");
                                for (var t = 0; t < newdata.length; t++) {
                                    if (newdata[dt].source.node == newdata[t].id) {

                                        if (newdata[t].labels.length > 10) {
                                            if (newdata[t].labels[10].id == "clock1") {
                                                $('.ball' + js).css("animation", "red-ball1 2s linear infinite");
                                            }
                                            // if (newdata[t].labels[10].id == "clock2") {
                                            //     // $('.ball' + i).css("animation", "red-ball 2s linear infinite");
                                            // }
                                            // if (newdata[t].labels[10].id == "clock3") {
                                            //     $('.ball' + i).css("animation", "red-ball2 2s linear infinite");
                                            // }
                                            // if (newdata[t].labels[10].id == "clock4") {
                                            //     // $('.ball' + i).css("animation", "red-ball 2s linear infinite");
                                            // }
                                        }
                                    }
                                    if (newdata[dt].target.node == newdata[t].id) {

                                        if (newdata[t].labels.length > 10) {
                                            // if (newdata[t].labels[10].id == "clock1") {
                                            //     $('.ball' + js).css("animation", "red-ball1 2s linear infinite");
                                            // }
                                            // if (newdata[t].labels[10].id == "clock2") {
                                            //     // $('.ball' + js).css("animation", "red-ball 2s linear infinite");
                                            // }
                                            if (newdata[t].labels[10].id == "clock3") {
                                                $('.ball' + js).css("animation", "red-ball2 2s linear infinite");
                                            }
                                            // if (newdata[t].labels[10].id == "clock4") {
                                            //     // $('.ball' + js).css("animation", "red-ball 2s linear infinite");
                                        }
                                    }

                                }


                            }
                            if (jss[js].id == newdata[dt].id && newdata[dt].vertex.length >= 5) {
                                var path = "M" + "" + newdata[dt].vertex[0].x + " " + newdata[dt].vertex[0].y + "L" + "" + (newdata[dt].vertex[1].x - 4) + "," + newdata[dt].vertex[1].y + "Q" + "" + newdata[dt].vertex[1].x + "," + newdata[dt].vertex[1].y + " " + newdata[dt].vertex[1].x + " ," + (newdata[dt].vertex[1].y - 4) + "L" + "" + newdata[dt].vertex[2].x + "," + (newdata[dt].vertex[2].y + 4) + "Q" + "" + newdata[dt].vertex[2].x + "," + newdata[dt].vertex[2].y + " " + (newdata[dt].vertex[2].x + 4) + " ," + newdata[dt].vertex[2].y + "L" + "" + (newdata[dt].vertex[3].x - 4) + "," + newdata[dt].vertex[3].y + "Q" + "" + newdata[dt].vertex[3].x + "," + newdata[dt].vertex[3].y + " " + newdata[dt].vertex[3].x + "," + (newdata[dt].vertex[3].y + 4) + "L" + "" + newdata[dt].vertex[4].x + "," + (newdata[dt].vertex[4].y - 4) + "Q" + "" + newdata[dt].vertex[4].x + "," + newdata[dt].vertex[4].y + " " + (newdata[dt].vertex[4].x + 4) + "," + newdata[dt].vertex[4].y + "L" + "" + newdata[dt].vertex[5].x + "," + newdata[dt].vertex[5].y;
                                $('.ball' + js).css('offset-path', "path('" + path + "')");
                                $('.ball' + js).css("width", "10px", "height", "10px", "background", "#f33a58", "border-radius", "50%", "offset-distance", "0%");
                                // $('.ball' + js).css("animation", "red-ball1 2s linear infinite");
                                for (var t = 0; t < newdata.length; t++) {
                                    if (newdata[dt].source.node == newdata[t].id) {

                                        if (newdata[t].labels.length > 10) {
                                            if (newdata[t].labels[10].id == "clock1") {
                                                $('.ball' + js).css("animation", "red-ball1 2s linear infinite");
                                            }
                                            // if (newdata[t].labels[10].id == "clock2") {
                                            //     // $('.ball' + i).css("animation", "red-ball 2s linear infinite");
                                            // }
                                            // if (newdata[t].labels[10].id == "clock3") {
                                            //     $('.ball' + i).css("animation", "red-ball2 2s linear infinite");
                                            // }
                                            // if (newdata[t].labels[10].id == "clock4") {
                                            //     // $('.ball' + i).css("animation", "red-ball 2s linear infinite");
                                            // }
                                        }
                                    }
                                    if (newdata[dt].target.node == newdata[t].id) {

                                        if (newdata[t].labels.length > 10) {
                                            // if (newdata[t].labels[10].id == "clock1") {
                                            //     $('.ball' + js).css("animation", "red-ball1 2s linear infinite");
                                            // }
                                            // if (newdata[t].labels[10].id == "clock2") {
                                            //     // $('.ball' + js).css("animation", "red-ball 2s linear infinite");
                                            // }
                                            if (newdata[t].labels[10].id == "clock3") {
                                                $('.ball' + js).css("animation", "red-ball2 2s linear infinite");
                                            }
                                            // if (newdata[t].labels[10].id == "clock4") {
                                            //     // $('.ball' + js).css("animation", "red-ball 2s linear infinite");
                                        }
                                    }

                                }


                            }



                        }

                    }
                    /// cập nhật lại path khi có sự kiện change///
                    canvas2.getCommandStack().addEventListener(function (e) {
                        if (e.isPostChangeEvent()) {
                            displayJSON(canvas2);
                            for (var js = 0; js < jss.length; js++) {

                                newdata = JSON.parse(dataweb);
                                for (var dt = 0; dt < newdata.length; dt++) {

                                    if (jss[js].id == newdata[dt].id && newdata[dt].vertex.length <= 4) {
                                        var path = "M" + "" + newdata[dt].vertex[0].x + " " + newdata[dt].vertex[0].y + "L" + "" + (newdata[dt].vertex[1].x - 4) + "," + newdata[dt].vertex[1].y + "Q" + "" + newdata[dt].vertex[1].x + "," + newdata[dt].vertex[1].y + " " + newdata[dt].vertex[1].x + " ," + (newdata[dt].vertex[1].y - 4) + "L" + "" + newdata[dt].vertex[2].x + "," + (newdata[dt].vertex[2].y - 4) + "Q" + "" + newdata[dt].vertex[2].x + "," + (newdata[dt].vertex[2].y) + " " + (newdata[dt].vertex[2].x + 4) + " ," + (newdata[dt].vertex[2].y) + "L" + "" + newdata[dt].vertex[3].x + "," + (newdata[dt].vertex[3].y);
                                        $('.ball' + js).css('offset-path', "path('" + path + "')");
                                        $('.ball' + js).css("width", "10px", "height", "10px", "background", "#f33a58", "border-radius", "50%", "offset-distance", "0%");
                                        // $('.ball' + js).css("animation", "red-ball1 2s linear infinite");
                                        for (var t = 0; t < newdata.length; t++) {
                                            if (newdata[dt].source.node == newdata[t].id) {

                                                if (newdata[t].labels.length > 10) {
                                                    if (newdata[t].labels[10].id == "clock1") {
                                                        $('.ball' + js).css("animation", "red-ball1 2s linear infinite");
                                                    }
                                                    // if (newdata[t].labels[10].id == "clock2") {
                                                    //     // $('.ball' + js).css("animation", "red-ball 2s linear infinite");
                                                    // }
                                                    // if (newdata[t].labels[10].id == "clock3") {
                                                    //     $('.ball' + i).css("animation", "red-ball2 2s linear infinite");
                                                    // }
                                                    // if (newdata[t].labels[10].id == "clock4") {
                                                    //     // $('.ball' + js).css("animation", "red-ball 2s linear infinite");
                                                    // }
                                                }

                                            }
                                            if (newdata[dt].target.node == newdata[t].id) {

                                                if (newdata[t].labels.length > 10) {
                                                    // if (newdata[t].labels[10].id == "clock1") {
                                                    //     $('.ball' + js).css("animation", "red-ball1 2s linear infinite");
                                                    // }
                                                    // if (newdata[t].labels[10].id == "clock2") {
                                                    //     // $('.ball' + js).css("animation", "red-ball 2s linear infinite");
                                                    // }
                                                    if (newdata[t].labels[10].id == "clock3") {
                                                        $('.ball' + js).css("animation", "red-ball2 2s linear infinite");
                                                    }
                                                    // if (newdata[t].labels[10].id == "clock4") {
                                                    //     // $('.ball' + js).css("animation", "red-ball 2s linear infinite");
                                                }
                                            }

                                        }


                                    }
                                    if (jss[js].id == newdata[dt].id && newdata[dt].vertex.length >= 5) {
                                        var path = "M" + "" + newdata[dt].vertex[0].x + " " + newdata[dt].vertex[0].y + "L" + "" + (newdata[dt].vertex[1].x - 4) + "," + newdata[dt].vertex[1].y + "Q" + "" + newdata[dt].vertex[1].x + "," + newdata[dt].vertex[1].y + " " + newdata[dt].vertex[1].x + " ," + (newdata[dt].vertex[1].y - 4) + "L" + "" + newdata[dt].vertex[2].x + "," + (newdata[dt].vertex[2].y + 4) + "Q" + "" + newdata[dt].vertex[2].x + "," + newdata[dt].vertex[2].y + " " + (newdata[dt].vertex[2].x + 4) + " ," + newdata[dt].vertex[2].y + "L" + "" + (newdata[dt].vertex[3].x - 4) + "," + newdata[dt].vertex[3].y + "Q" + "" + newdata[dt].vertex[3].x + "," + newdata[dt].vertex[3].y + " " + newdata[dt].vertex[3].x + "," + (newdata[dt].vertex[3].y + 4) + "L" + "" + newdata[dt].vertex[4].x + "," + (newdata[dt].vertex[4].y - 4) + "Q" + "" + newdata[dt].vertex[4].x + "," + newdata[dt].vertex[4].y + " " + (newdata[dt].vertex[4].x + 4) + "," + newdata[dt].vertex[4].y + "L" + "" + newdata[dt].vertex[5].x + "," + newdata[dt].vertex[5].y;
                                        $('.ball' + js).css('offset-path', "path('" + path + "')");
                                        $('.ball' + js).css("width", "10px", "height", "10px", "background", "#f33a58", "border-radius", "50%", "offset-distance", "0%");
                                        // $('.ball' + js).css("animation", "red-ball1 2s linear infinite");
                                        for (var t = 0; t < newdata.length; t++) {
                                            if (newdata[dt].source.node == newdata[t].id) {

                                                if (newdata[t].labels.length > 10) {
                                                    if (newdata[t].labels[10].id == "clock1") {
                                                        $('.ball' + js).css("animation", "red-ball1 2s linear infinite");
                                                    }
                                                    // if (newdata[t].labels[10].id == "clock2") {
                                                    //     // $('.ball' + js).css("animation", "red-ball 2s linear infinite");
                                                    // }
                                                    // if (newdata[t].labels[10].id == "clock3") {
                                                    //     $('.ball' + js).css("animation", "red-ball2 2s linear infinite");
                                                    // }
                                                    // if (newdata[t].labels[10].id == "clock4") {
                                                    //     // $('.ball' + js).css("animation", "red-ball 2s linear infinite");
                                                }
                                            }
                                            if (newdata[dt].target.node == newdata[t].id) {

                                                if (newdata[t].labels.length > 10) {
                                                    // if (newdata[t].labels[10].id == "clock1") {
                                                    //     $('.ball' + js).css("animation", "red-ball1 2s linear infinite");
                                                    // }
                                                    // if (newdata[t].labels[10].id == "clock2") {
                                                    //     // $('.ball' + js).css("animation", "red-ball 2s linear infinite");
                                                    // }
                                                    if (newdata[t].labels[10].id == "clock3") {
                                                        $('.ball' + js).css("animation", "red-ball2 2s linear infinite");
                                                    }
                                                    // if (newdata[t].labels[10].id == "clock4") {
                                                    //     // $('.ball' + js).css("animation", "red-ball 2s linear infinite");
                                                }
                                            }


                                        }



                                    }

                                }


                            }



                        }





                    });


                    $(".auto").on("click", function () {

                        var node = canvas2.getPrimarySelection();
                        var del = new draw2d.shape.basic.Image({ path: "delete.png", height: 25, width: 25, stroke: 1, x: 17, y: -35, visible: true });

                        if (!node.children.data[0].figure.children.data.length) {
                            node.children.data[0].figure.add(del, new draw2d.layout.locator.Locator());
                            node.children.data[0].figure.children.data[0].figure.attr({
                                cssClass: "dell2",
                                visible: true
                            });

                            $(".dell2").on("click", function () {
                                canvas2.remove(canvas2.getPrimarySelection());
                                checkdell2.push(node.id);
                                displayJSON(canvas2);

                            });
                        }

                    });
                    var getWF = {
                        "url": "http://117.6.131.222:6789//api/ApiWorkFlow",
                        "method": "get",
                        "datatype": json
                    }
                    $.ajax(getWF).done(function (data) {

                        for (var i = 0; i < data.Data.length; i++) {

                            if (data.Data[i].WfName === nameee) {

                                wfcode = (data.Data[i].WfCode);
                                var gettime = {
                                    "url": "http://117.6.131.222:6789//api/ActivityTransition",
                                    "method": "get",
                                    "datatype": json
                                }
                                $.ajax(gettime).done(function (data1) {
                                    timerr();
                                    // Update the count down every 1 second
                                    function timerr() {
                                        for (var j = 0; j < data1.length; j++) {
                                            if (data1[j].WfCode == wfcode) {
                                                var figurearr = canvas2.getFigures();
                                                for (var t = 0; t < figurearr.data.length; t++) {
                                                    if (figurearr.data[t].id == data1[j].ActInitial) {
                                                        ti = figurearr.data[t].children.data[1].figure.text;
                                                        var teo = figurearr.data[t].children.data[3].figure;
                                                        if (ti != "") {
                                                            var countDownDate = new Date(ti).getTime();
                                                            // Get today's date and time
                                                            var now = new Date().getTime();
                                                            // Find the distance between now and the count down date
                                                            var distance = countDownDate - now;
                                                            // Time calculations for days, hours, minutes and seconds
                                                            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                                                            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                                            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                                            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                                                            // Output the result in an element with id="demo"
                                                            if (days >= 1) {
                                                                time = days + "d " + hours + "h " +
                                                                    minutes + "m " + seconds + "s ";
                                                            } else {
                                                                time = hours + "h " +
                                                                    minutes + "m " + seconds + "s ";
                                                            }
                                                            teo.attr({
                                                                text: time
                                                            });

                                                            displayJSON(canvas2);
                                                            // If the count down is over, write some text 
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        setTimeout(timerr, 1000);
                                    }
                                });
                            }
                        }

                    });
                });
            }
        });
    }
    //Khai báo số lượng
    $rootScope.status_all = 0;
    $rootScope.status_pending = 0;
    $rootScope.status_new = 0;
    $rootScope.status_complete = 0;
    $rootScope.status_cancel = 0;
    $rootScope.status_trash = 0;

    var vm = $scope;

    //Grid work flow instance
    $scope.modelSearch = {

    };
    vm.dt = {};
    $scope.selectedWF = [];
    $scope.selectAllWF = false;
    $scope.toggleAllWF = toggleAllWF;
    $scope.toggleOneWF = toggleOneWF;
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAllWF" ng-click="toggleAllWF(selectAllWF, selectedWF)"/><span></span></label>';
    vm.dtOptionsList = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/WorkflowActivity/JTable",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.FromDate = $scope.modelSearch.FromDate;
                d.ToDate = $scope.modelSearch.ToDate;
                d.Workflow = 'PARTY_ADMISSION_PROFILE'
                d.Status = $scope.modelSearch.Status;
                d.WfInstName = $scope.modelSearch.WfInstName;
                d.WfGroup = $scope.modelSearch.WfGroup;
            },
            complete: function (d) {
                App.unblockUI("#contentMain");
                $(".dataTables_scrollBody").addClass('scroller-sm-fade');
                heightTableAuto();
                if ($rootScope.isReloadAct) {
                    reloadWfAct();
                }
                $rootScope.isReloadAct = false;
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(pageLength)
        .withOption('order', [0, 'asc'])
        .withOption('serverSide', true)
        .withOption('headerCallback', function (header) {
            if (!$scope.headerCompiled) {
                $scope.headerCompiled = true;
                $compile(angular.element(header).contents())($scope);
            }
        })
        .withOption('initComplete', function (settings, json) {
        })
        .withOption('rowCallback', function (tabRow, data) {

        })
        .withOption('createdRow', function (row, data, dataIndex) {
            $compile(angular.element(row))($scope);
            $(row).find('td:not(.listaction):not(:has(label.mt-checkbox))').on('click', function (evt) {
                // Xóa lớp active khỏi tất cả các hàng
                $(this).closest('table').find('tr').removeClass('active');

                // Thêm lớp active vào hàng đã được click
                $(this).closest('tr').addClass('active');

                var rowData = $scope.dt.dtInstanceList.DataTable.row($(this).closest('tr')).data(); // Lấy dữ liệu của hàng
                var childRow = $scope.dt.dtInstanceList.DataTable.row($(this).closest('tr')).child; // Lấy child của hàng

                formatRow(rowData);
                $scope.editWorkflow();
            });
        });
    vm.dtColumnsList = [];
    vm.dtColumnsList.push(DTColumnBuilder.newColumn("Id").withTitle(titleHtml).notSortable().renderWith(function (data, type, full, meta) {
        $scope.selectedWF[full.id] = false;
        return '<label class="mt-checkbox"><input type="checkbox" ng-model="selectedWF[' + full.Id + ']" ng-click="toggleOneWF(selected)"/><span></span></label>';
    }).withOption('sClass', 'hidden'));
    vm.dtColumnsList.push(DTColumnBuilder.newColumn('WfName').withTitle('{{"WFAI_LIST_COL_WF_INSTANCE" | translate}}').renderWith(function (data, type, full) {
        var createdTime = '<span class="fs10 mr10">Ngày tạo: ' + $filter('date')(new Date(full.CreatedTime), 'dd/MM/yyyy HH:mm') + '</span>';
        var status = '';
        var objectType = full.ObjectTypeName != "" ? '<a ng-click="reidrectToObject(\'' + full.ObjectType + '\', \'' + full.ObjectCode + '\')" class="fs12 mt5">' + full.ObjectTypeName : "";
        var objectName = full.ObjectName != "" ? ': ' + full.ObjectName + '</a>' : "";

        if (full.Status != "Dừng lại")
            status = '<div class="d-inline mr10"><p class="badge-customer badge-customer-success">' + full.Status + '</p></div>';
        else
            status = '<div class="d-inline mr10"><span class="badge-customer badge-customer-orange">' + full.Status + '</span></div>';
        var wfName = data;
        return '<div title="' + data + '" class="fs14 d-inline mr10"><a class="text-underline" ng-click="editWfInst(\'' + full.WfCode + '\')"><span class="text-underline" style="color:#ab7474">#' + full.WfCode + '</span>: ' + wfName + '</a></div><div class="d-inline">' + createdTime + status + '<div class="d-inline">' + objectType + objectName + '</div></div>';
    }).withOption('sClass', ''));
    // vm.dtColumnsList.push(DTColumnBuilder.newColumn('ListFile').withTitle('{{"WFAI_TAB_FILE" | translate}}').withOption('sClass', '').renderWith(function (data, type, full) {
    //     if (data == "") {
    //         return;
    //     }
    //     var lstFile = JSON.parse(data);
    //     var domFiles = "";
    //     if (lstFile.length > 5) {
    //         for (var i = 0; i < 5; i++) {
    //             var fileName = lstFile[i].FileName;
    //             var dataView = fileName.length > 20 ? fileName.substr(0, 20) + " ..." : fileName;
    //             if (fileName.length > 0) {
    //                 dataView = '<span href="javascript:;" role="button" title=\'' + fileName + '\'>' + dataView + '</span>';
    //             } else {
    //                 return dataView;
    //             }

    //             domFiles += '<div class="mt5"><span class="fa fa-file"><a class="text-underline text-wrap ml5">' + dataView + '</a></span></div>';
    //         }
    //         var more = '<a class="text-underline pull-right" ng-click="moreFile(' + full.WfCode + ')">More...</a>'
    //         return domFiles + more;
    //     }
    //     else {
    //         for (var i = 0; i < lstFile.length; i++) {
    //             var fileName = lstFile[i].FileName;
    //             var dataView = fileName.length > 20 ? fileName.substr(0, 20) + " ..." : fileName;
    //             if (fileName.length > 0) {
    //                 dataView = '<span href="javascript:;" role="button" title=\'' + fileName + '\'>' + dataView + '</span>';
    //             }
    //             if (lstFile[i].Type == "SHARE") {
    //                 domFiles += '<div class="mt5"> <span class="fa fa-file pr5"></span> <a class="text-underline text-wrap ml5">' + dataView + '</a></div>'
    //             } else {
    //                 domFiles += '<div class="mt5"> <span class="fa fa-file pr5"><a class="text-underline text-wrap ml5">' + dataView + '</a></span>'
    //             }
    //         }
    //         return domFiles;
    //     }
    // }));
    vm.dtColumnsList.push(DTColumnBuilder.newColumn('ListCard').withTitle('{{"WFAI_BTN_JOB_CARD" | translate}}').withOption('sClass', 'w20 nowrap text-center').renderWith(function (data, type, full) {
        try {
            var lstAct = JSON.parse(full.ListAct);
            return lstAct.length > 0 ? '<button title="Xem danh sách hoạt động" ng-click="showActivityList(\'' + full.WfCode + '\')" style = "width: 32px; height: 32px; padding: 0px; border: none;color: #183153; background: transparent" class1="btn btn-icon-only primary btn-circle btn-outline blue"><i class="fas fa-tasks-alt fs25" style="line-height:32px"></i></button>' : '';
        } catch (e) {
            console.log(e);
            return '';
        }
    }));
    vm.dtColumnsList.push(DTColumnBuilder.newColumn('action').withTitle("{{'COM_LIST_COL_ACTION' | translate}}").withOption('sClass', 'w20 nowrap listaction').renderWith(function (data, type, full) {
        return '<button title="Sửa" ng-click="editWfInst(\'' + full.WfCode + '\')" style = "width: 25px; height: 25px; padding: 0px; border: none; color: #183153; background: transparent; margin-right: 10px" class1="btn btn-icon-only btn-circle btn-outline blue"><i class="fas fa-edit fs20"></i></button>' +
            '<button title="Xem sơ đồ" ng-click="wfInstanceClick(\'' + full.WfCode + '\')" style = "width: 25px; height: 25px; padding: 0px; border: none; color: #183153; background: transparent; margin-right: 10px" class1="btn btn-icon-only btn-circle btn-outline green"><i class="fas fa-project-diagram fs20"></i></button>' +
            '<button title="Xoá" ng-click="deleteWfInstance(\'' + full.WfCode + '\')" style="width: 25px; height: 25px; padding: 0px; border: none; color: #183153; background: transparent; margin-right: 10px" class1="btn btn-icon-only btn-circle btn-outline red"><i class="fas fa-trash-alt fs20"></i></button>';
    }));
    vm.reloadDataList = reloadDataList;
    vm.dt.dtInstanceList = {};

    function reloadDataList(resetPaging, reloadAct = false) {
        $rootScope.isReloadAct = reloadAct;
        vm.dt.dtInstanceList.reloadData(callback, resetPaging);
    }

    function callback(json) {

    }

    function toggleAllWF(selectAll, selectedItems) {
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                selectedItems[id] = selectAll;
            }
        }
    }

    function toggleOneWF(selectedItems) {
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
    $rootScope.reloadActWf = function () {
        reloadDataList(false, true);
    };
    function reloadWfAct() {
        var listdata = $('#tblDataWfInstance').DataTable().data();
        var userModel = {};
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id === $rootScope.wfListActId) {
                userModel = listdata[i];
                break;
            }
        }
        formatRow(userModel);
    }
    $rootScope.wfListActId = '';
    function formatRow(full) {
        $rootScope.wfListActId = full.Id;
        try {
            var lstAct = JSON.parse(full.ListAct);
        } catch (e) {
            console.log(e);
            return;
        }
        $scope.listActs = lstAct;
        $scope.isEditWorkflow = true;
        $scope.model.checkHiddenFileWfActivity = false;
        //console.log($scope.isEditWorkflow,$scope.listActs);
        $scope.full = full;
        $timeout(function () {
            $scope.$apply();
        });
    }

    $scope.search = function () {
        reloadDataList(false);
    }

    $scope.searchByGroup = function (group) {
        $scope.groupSelect = group;
        $scope.modelSearch.WfGroup = group;
        reloadDataList(false);
    }

    $scope.isApproved = false;
    $scope.approve = function (actInstCode, status) {
        dataservice.getPermission(actInstCode, function (obj) {
            obj = obj.data;
            if (!obj.PermisstionApprove) {
                return App.toastrError(caption.COM_MSG_NO_PERMISSION);
            }
            if (status == "Đang xử lý") {
                dataservice.approve(actInstCode, function (rs) {
                    rs = rs.data;
                    if (rs.Error) {
                        App.toastrError(rs.Title);
                    }
                    else {
                        App.toastrSuccess(rs.Title);
                        dataservice.updateStatusActInst(actInstCode, "STATUS_ACTIVITY_END", function (rs1) {
                            rs1 = rs1.data;
                            if (rs1.Error) {
                                App.toastrError(rs1.Title);
                            } else {
                                reloadDataList(true);
                            }
                        })
                    }
                });
            }
            else {
                var actStatus = "";
                if (status == "Kích hoạt") {
                    actStatus = "STATUS_ACTIVITY_CANCEL";
                }
                else if (status == "Đã xử lý") {
                    actStatus = "STATUS_ACTIVITY_STOPPED";
                }
                else if (status == "Hủy") {
                    actStatus = "STATUS_ACTIVITY_ACTIVE";
                }
                else if (status == "Dừng lại") {
                    actStatus = "STATUS_ACTIVITY_DOING";
                }
                if (actStatus != "") {
                    dataservice.unapprove(actInstCode, actStatus, function (rs) {
                        rs = rs.data;
                        if (rs.Error) {
                            App.toastrError(rs.Title);
                        }
                        else {
                            App.toastrSuccess(rs.Title);
                            dataservice.updateStatusActInst(actInstCode, actStatus, function (rs1) {
                                rs1 = rs1.data;
                                if (rs1.Error) {
                                    App.toastrError(rs1.Title);
                                } else {
                                    reloadDataList(true);
                                }
                            })
                        }
                    });
                }
            }
        });
    }

    // show search
    //$scope.isSearch = false;

    $scope.showSearch = function () {
        if (!$scope.isSearch) {
            $scope.isSearch = true;
        } else {
            $scope.isSearch = false;
        }
    }

    $scope.editCard = function (cardCode) {
        $rootScope.CardCode = cardCode;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCardJob + '/add-card-buffer.html',
            controller: 'edit-cardCardJob',
            size: '80',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                para: function () {
                    return cardCode;
                }
            }
        });
        modalInstance.result.then(function (d) {

        }, function () { });
    }

    $scope.showActivityList = function (wfCode) {
        var url = "/Admin/ActivityList?wfInstCode=" + wfCode;
        window.open(url, '_blank');
    }

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

        }, function () {

        });
    }

    $scope.reidrectToObject = function (objectType, objectCode) {
        if (objectCode != "") {
            if (objectType === "NOT_WORK") {
                dataservice.getItemStaffLate(parseInt(objectCode), function (rs) {
                    rs = rs.data;
                    var url = '/Admin/StaffLate#!/edit?id=' + parseInt(objectCode) + '&userId=' + rs.Object.UserId
                    window.open(url, '_blank')
                })
            }
            else {
                dataservice.redirectToObject(objectType, objectCode, function (rs) {
                    rs = rs.data;
                    if (rs != 0) {
                        var url = "";
                        switch (objectType) {
                            case "CONTRACT":
                                url = '/Admin/Contract#!/edit?id=' + rs
                                break;

                            case "PROJECT":
                                url = '/Admin/Project#!/edit?id=' + rs
                                break;

                            case "CONTRACT_PO":
                                url = '/Admin/ContractPo#!/edit?id=' + rs
                                break;

                            case "SUPPLIER":
                                url = '/Admin/Supplier#!/edit?id=' + rs
                                break;

                            case "PRODUCT":

                                break;

                            case "IMPORT_STORE":
                                url = '/Admin/MaterialImpStore#!/edit?id=' + rs
                                break;

                            case "PAY_DECISION":

                                break;

                            case "EXPORT_STORE":
                                url = '/Admin/MaterialExpStore#!/edit?id=' + rs
                                break;

                            case "ASSET_MAINTENANCE":
                                url = '/Admin/AssetMaintenance#!/edit?id=' + rs
                                break;

                            case "ASSET_BUY":
                                url = '/Admin/AssetBuy#!/edit?id=' + rs
                                break;

                            case "RQ_IMPORT_PROD":
                                url = '/Admin/SendRequestImportProduct#!/edit?id=' + rs
                                break;

                            case "DECISION_MOVEMENT":

                                break;

                            case "DECISION_END_CONTRACT":

                                break;

                            case "PLAN_RECRUITMENT":

                                break;

                            case "FUND_ACC_ENTRY":
                                url = '/Admin/FundAccEntry#!/edit?id=' + rs
                                break;

                            case "ASSET_INVENTORY":
                                url = '/Admin/AssetInventory#!/edit?id=' + rs
                                break;

                            case "ASSET_ALLOCATE":
                                url = '/Admin/AssetAllocation#!/edit?id=' + rs
                                break;

                            case "ASSET_TRANSFER":
                                url = '/Admin/AssetTransfer#!/edit?id=' + rs
                                break;

                            case "ASSET_LIQUIDATION":
                                url = '/Admin/AssetLiquidation#!/edit?id=' + rs
                                break;

                            case "ASSET_RECALL":
                                url = '/Admin/AssetRecalled#!/edit?id=' + rs
                                break;

                            case "ASSET_RQ_REPAIR":
                                url = '/Admin/AssetRqMaintenanceRepair#!/edit?id=' + rs
                                break;

                            case "ASSET_IMPROVE":
                                url = '/Admin/AssetImprovement#!/edit?id=' + rs
                                break;

                            case "ASSET_CANCEL":
                                url = '/Admin/AssetCancel#!/edit?id=' + rs
                                break;

                            case "ASSET_RPT":
                                url = '/Admin/AssetRPTBroken#!/edit?id=' + rs
                                break;
                        }

                        if (url != "") {
                            window.open(url, '_blank')
                        }
                    }
                })
            }
        }
    }

    function displayJSON(canvas) {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(canvas, function (json) {
            $("#json").text(JSON.stringify(json, null, 2));
            dataweb = JSON.stringify(json, null, 2);
        });
    }

    $(".btn-save4").click(function () {
        if (nameee != "") {
            if (check == 1 || checkconn == 1) {
                var settings = {
                    "url": "http://117.6.131.222:6789//api/ApiActivityWorkFlow",
                    "method": "get",
                    "datatype": json
                };
                $.ajax(settings).done(function (response) {
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].ActParent == nameee) {
                            id = response[i].Id;
                            var settings2 = {
                                "url": "http://117.6.131.222:6789//api/ApiActivityWorkFlow/" + id + "",
                                "method": "DELETE",
                                "timeout": 0,
                                "headers": {
                                    "Content-Type": "application/json"
                                }
                            };

                            $.ajax(settings2).done(function (response) {

                            });


                        }
                    }
                    LoadActivity();

                    function LoadActivity() {
                        newdata = JSON.parse(dataweb);
                        for (var i = 0; i < newdata.length; i++) {

                            if (newdata[i].type == "draw2d.shape.node.Hub") {
                                console.log("dsafadsf");
                                var ActCode = newdata[i].id;
                                var ActName = newdata[i].labels[0].text;
                                var ActParent = nameee;
                                var dt = JSON.stringify(newdata[i]);

                                var ActAttributrGraph = dt.toString();


                                var IsDeleted = true;
                                var settings5 = {
                                    "url": "http://117.6.131.222:6789//api/ApiActivityWorkFlow",
                                    "method": "POST",
                                    "timeout": 0,
                                    "headers": {
                                        "Content-Type": "application/json"
                                    },
                                    "data": JSON.stringify({ "ActCode": "" + ActCode + "", "ActName": "" + ActName + "", "ActParent": "" + ActParent + "", "ActNoted": "", "ActAttributeGraph": "" + ActAttributrGraph + "" }),
                                };

                                $.ajax(settings5).done(function (response) {
                                    console.log(response);
                                });
                            }

                        }
                    }
                });
                var settings3 = {
                    "url": "http://117.6.131.222:6789//api/ApiTransition",
                    "method": "get",
                    "datatype": json
                };
                $.ajax(settings3).done(function (response2) {
                    for (var k = 0; k < response2.length; k++) {
                        if (response2[k].TrsParent == nameee) {
                            id2 = response2[k].Id;
                            var settings4 = {
                                "url": "http://117.6.131.222:6789//api/ApiTransition/" + id2 + "",
                                "method": "DELETE",
                                "timeout": 0,
                                "headers": {
                                    "Content-Type": "application/json"
                                }
                            };

                            $.ajax(settings4).done(function (response) {

                            });


                        }
                    }
                    LoadTransiton();

                    function LoadTransiton() {
                        newdata = JSON.parse(dataweb);
                        for (var i = 0; i < newdata.length; i++) {

                            if (newdata[i].type == "draw2d.Connection") {
                                var TrsCode = newdata[i].id;
                                var TrsType = newdata[i].type;
                                var TrsTitle = newdata[i].labels[0].text;
                                var TrsParent = nameee;
                                var dt = JSON.stringify(newdata[i]);

                                var TrsAttrGraph = dt.toString();

                                var IsDeleted = true;
                                var settings6 = {
                                    "url": "http://117.6.131.222:6789//api/ApiTransition",
                                    "method": "POST",
                                    "timeout": 0,
                                    "headers": {
                                        "Content-Type": "application/json"
                                    },
                                    "data": JSON.stringify({ "TrsCode": "" + TrsCode + "", "TrsType": "" + TrsType + "", "TrsTitle": "" + TrsTitle + "", "TrsParent": "" + TrsParent + "", "TrsAttrGraph": "" + TrsAttrGraph + "" }),
                                };

                                $.ajax(settings6).done(function (response) {
                                    console.log(response);
                                });
                            }
                        }
                    }
                });

                var getWFL = {
                    "url": "http://117.6.131.222:6789//api/ApiWorkFlow",
                    "method": "get",
                    "datatype": json
                }
                $.ajax(getWFL).done(function (data) {

                    for (var i = 0; i < data.Data.length; i++) {

                        if (data.Data[i].WfName == nameee) {

                            wfcode = (data.Data[i].WfCode);

                            var trs = {
                                "url": "http://117.6.131.222:6789//api/ActivityTransition",
                                "method": "get",
                                "datatype": json
                            }
                            $.ajax(trs).done(function (data1) {
                                for (var j = 0; j < data1.length; j++) {
                                    if (data1[j].WfCode == wfcode) {
                                        var id = data1[j].Id;
                                        var settings2 = {
                                            "url": "http://117.6.131.222:6789//api/ActivityTransition/" + id + "",
                                            "method": "DELETE",
                                            "timeout": 0,
                                            "headers": {
                                                "Content-Type": "application/json"
                                            }
                                        };

                                        $.ajax(settings2).done(function (response) {

                                        });
                                    }
                                }
                                transition();

                                function transition() {
                                    newdata = JSON.parse(dataweb);
                                    var ActInitial1 = [];
                                    var ActDestination1 = [];

                                    for (var i = 0; i < newdata.length; i++) {

                                        if (newdata[i].type == "draw2d.Connection") {
                                            var ActInitial = newdata[i].source.node;
                                            ActInitial1.push(ActInitial);
                                            var ActDestination = newdata[i].target.node;
                                            ActDestination1.push(ActDestination);

                                        }

                                    }


                                    for (var i = 0; i < newdata.length; i++) {
                                        if (newdata[i].type == "draw2d.shape.basic.Rectangle") {
                                            var WfCode = wfcode;
                                            for (var j = 0; j < ActInitial1.length; j++) {
                                                if (newdata[i].id == ActInitial1[j]) {

                                                    var Condition = newdata[i].labels[1].text;
                                                    var settings6 = {
                                                        "url": "http://117.6.131.222:6789//api/ActivityTransition",
                                                        "method": "POST",
                                                        "timeout": 0,
                                                        "headers": {
                                                            "Content-Type": "application/json"
                                                        },
                                                        "data": JSON.stringify({ "WfCode": "" + WfCode + "", "ActInitial": "" + ActInitial1[j] + "", "Condition": "" + Condition + "", "ActDestination": "" + ActDestination1[j] + "" }),
                                                    };

                                                    $.ajax(settings6).done(function (response) { });
                                                }
                                            }
                                        }
                                    }

                                }




                            });

                        }

                    }

                });






            } else {
                var settings = {
                    "url": "http://117.6.131.222:6789//api/ApiActivityWorkFlow",
                    "method": "get",
                    "datatype": json
                };
                $.ajax(settings).done(function (response) {
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].ActParent == nameee) {
                            LoadActivity();

                            function LoadActivity() {
                                newdata = JSON.parse(dataweb);

                                if (checkdell.length == 0 && checkdell2.length == 0) {

                                    for (var j = 0; j < newdata.length; j++) {

                                        if (response[i].ActCode == newdata[j].id) {
                                            var id = response[i].Id;
                                            var ActCode = newdata[j].id;
                                            var ActName = newdata[j].labels[0].text;
                                            var ActParent = nameee;
                                            var dt = JSON.stringify(newdata[j]);

                                            var ActAttributrGraph = dt.toString();

                                            var IsDeleted = true;
                                            var settings = {
                                                "url": "http://117.6.131.222:6789//api/ApiActivityWorkFlow/" + id + "",
                                                "method": "PUT",
                                                "timeout": 0,
                                                "headers": {
                                                    "Content-Type": "application/json"
                                                },
                                                "data": JSON.stringify({ "ActCode": "" + ActCode + "", "ActName": "" + ActName + "", "ActParent": "" + ActParent + "", "ActNoted": "", "ActAttributeGraph": "" + ActAttributrGraph + "" }),
                                            };

                                            $.ajax(settings).done(function (response) { });
                                        }
                                    }

                                } else {
                                    if (checkdell.length > 0) {
                                        for (var j = 0; j < checkdell.length; j++) {
                                            if (response[i].ActCode == checkdell[j]) {
                                                var id = response[i].Id;
                                                var settings = {
                                                    "url": "http://117.6.131.222:6789//api/ApiActivityWorkFlow/" + id + "",
                                                    "method": "DELETE",
                                                    "timeout": 0,
                                                    "headers": {
                                                        "Content-Type": "application/json"
                                                    }
                                                };

                                                $.ajax(settings).done(function (response) { });
                                                var settings2 = {
                                                    "url": "http://117.6.131.222:6789//api/ApiTransition",
                                                    "method": "get",
                                                    "datatype": json
                                                };
                                                $.ajax(settings2).done(function (response2) {

                                                    for (var k = 0; k < response2.length; k++) {
                                                        if (response2[k].TrsParent == nameee) {
                                                            id2 = response2[k].Id;
                                                            var settings3 = {
                                                                "url": "http://117.6.131.222:6789//api/ApiTransition/" + id2 + "",
                                                                "method": "DELETE",
                                                                "timeout": 0,
                                                                "headers": {
                                                                    "Content-Type": "application/json"
                                                                }
                                                            };

                                                            $.ajax(settings3).done(function (response) {

                                                            });


                                                        }
                                                    }
                                                    LoadTransiton();

                                                    function LoadTransiton() {
                                                        newdata = JSON.parse(dataweb);
                                                        for (var i = 0; i < newdata.length; i++) {
                                                            if (newdata[i].type == "draw2d.Connection") {
                                                                var TrsCode = newdata[i].id;
                                                                var TrsType = newdata[i].type;
                                                                var TrsTitle = newdata[i].labels[0].text;
                                                                var TrsParent = nameee;
                                                                var dt = JSON.stringify(newdata[i]);

                                                                var TrsAttrGraph = dt.toString();

                                                                var IsDeleted = true;
                                                                var settings = {
                                                                    "url": "http://117.6.131.222:6789//api/ApiTransition",
                                                                    "method": "POST",
                                                                    "timeout": 0,
                                                                    "headers": {
                                                                        "Content-Type": "application/json"
                                                                    },
                                                                    "data": JSON.stringify({ "TrsCode": "" + TrsCode + "", "TrsType": "" + TrsType + "", "TrsTitle": "" + TrsTitle + "", "TrsParent": "" + TrsParent + "", "TrsAttrGraph": "" + TrsAttrGraph + "" }),
                                                                };

                                                                $.ajax(settings).done(function (response) { });
                                                            }
                                                        }
                                                    }

                                                });

                                            }
                                        }
                                    }

                                }
                            }
                        }
                    }
                    if (checkdell2.length > 0) {
                        console.log(checkdell2);
                        var settings3 = {
                            "url": "http://117.6.131.222:6789//api/ApiTransition",
                            "method": "get",
                            "datatype": json
                        };
                        $.ajax(settings3).done(function (response2) {
                            for (var k = 0; k < response2.length; k++) {
                                if (response2[k].TrsParent == nameee) {
                                    id2 = response2[k].Id;
                                    var settings4 = {
                                        "url": "http://117.6.131.222:6789//api/ApiTransition/" + id2 + "",
                                        "method": "DELETE",
                                        "timeout": 0,
                                        "headers": {
                                            "Content-Type": "application/json"
                                        }
                                    };

                                    $.ajax(settings4).done(function (response) {

                                    });


                                }
                            }
                            LoadTransiton();

                            function LoadTransiton() {
                                newdata = JSON.parse(dataweb);
                                for (var i = 0; i < newdata.length; i++) {

                                    if (newdata[i].type == "draw2d.Connection") {
                                        var TrsCode = newdata[i].id;
                                        var TrsType = newdata[i].type;
                                        var TrsTitle = newdata[i].labels[0].text;
                                        var TrsParent = nameee;
                                        var dt = JSON.stringify(newdata[i]);

                                        var TrsAttrGraph = dt.toString();

                                        var IsDeleted = true;
                                        var settings10 = {
                                            "url": "http://117.6.131.222:6789//api/ApiTransition",
                                            "method": "POST",
                                            "timeout": 0,
                                            "headers": {
                                                "Content-Type": "application/json"
                                            },
                                            "data": JSON.stringify({ "TrsCode": "" + TrsCode + "", "TrsType": "" + TrsType + "", "TrsTitle": "" + TrsTitle + "", "TrsParent": "" + TrsParent + "", "TrsAttrGraph": "" + TrsAttrGraph + "" }),
                                        };

                                        $.ajax(settings10).done(function (response) {
                                            console.log(response);
                                        });
                                    }
                                }
                            }

                        });


                    }
                });
            }
            check = 0;
            alert("Đã lưu");
        } else if (nameee == "") {
            $('.fade3').toggleClass('show');
            $('.modal3').css('display', 'block');
            if ($('.fade3').hasClass('show')) {
                $('.overlay').addClass('overlay-show');
            }
        }
    });
    //hiện danh sách loại activity/
    $('.list-activity').on('click', function () {
        $('.act-sidebar').toggleClass('act-sidebar__show-hidd');
        $('.act-sidebar__buger').addClass('buger__last');
    });
    $('.act-sidebar__close').on('click', function () {
        $('.act-sidebar').removeClass('act-sidebar__show-hidd');
    });
    // close json
    $('.json_span').on('click', function () {
        $('.json_div').toggleClass('turn_on_of')
    });
    //hiện thông tin wf
    $('.close_serach').on('click', function () {
        $('.wfl-instance').toggleClass('wfl-instance__hiden');
    });
    // fullscreen click
    $('.fullscreen').on('click', () => {
        $('.main-menu').toggleClass('fullscreen_none');
        $('svg').toggleClass('fullscreensvg');
    });
    // move click
    $('.move').on('click', () => {
        $('.parent_svg').toggleClass('drap_drop');
        if ($('.parent_svg').hasClass('drap_drop')) {
            $('.drap_drop').draggable({
                disable: true

            });
        } else {
            $('.drap_drop').draggable({
                disable: false
            });
        }
    });
    //move
    function updateLast() {
        $('.setting').on('click', function () {
            var node = canvas2.getPrimarySelection();
            $('.fade2').toggleClass('show');
            $('.modal2').css('display', 'block');
        });

        $('.delll').on('click', function () {
            var node = canvas2.getPrimarySelection();
            var command = new draw2d.command.CommandDelete(node);
            canvas2.getCommandStack().execute(command);
            checkdell.push(node.id);
        });
        if (screen.width < 1000) {
            $(".txt1").css("width", "150px");
            $(".txt1").css("height", "60px");

            $(".txt1 ").click(function () {
                var node = canvas2.getPrimarySelection();
                $(document).on("mousemove", function (event) {
                    node.attr({
                        x: event.pageX,
                        y: event.pageY
                    });
                    $(document).off("mousemove");


                });
            });
        }
        $('.btn-save2').on('click', function (e) {
            var node = canvas2.getPrimarySelection();
            //node.children.data[0].figure// trỏ đến label
            var text11 = document.getElementById("activity-name2").value;
            if (text11 == "") {

            } else {
                node.children.data[0].figure.attr({
                    text: text11
                });
            }
            document.getElementById("activity-name2").value = "";
            var text22 = document.getElementById("state-name2").value;
            timer = text22;

            node.children.data[1].figure.attr({

                text: timer
            });
            if (!Date.parse(timer)) {
                node.children.data[3].figure.attr({
                    text: ""
                });
            } else {
                var countDownDate = new Date(timer).getTime();
                // Update the count down every 1 second
                var x = setInterval(function () {
                    // Get today's date and time
                    var now = new Date().getTime();
                    // Find the distance between now and the count down date
                    var distance = countDownDate - now;
                    // Time calculations for days, hours, minutes and seconds
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    // Output the result in an element with id="demo"
                    if (days >= 1) {
                        time = days + "d " + hours + "h " +
                            minutes + "m " + seconds + "s ";
                    } else {
                        time = hours + "h " +
                            minutes + "m " + seconds + "s ";
                    }
                    node.children.data[3].figure.attr({
                        text: time,
                        stroke: 0.2,
                        radius: 2,
                        bgColor: "#fff"
                    });

                    displayJSON(canvas2);
                    // If the count down is over, write some text 

                }, 1000);
                document.getElementById("state-name2").value = "";
            }
            var ActStatus = $("#status2").val();
            console.log(ActStatus);
            if (ActStatus == 1) {

                if (node.children.data.length == 11) {
                    node.children.data[10].figure.attr({
                        path: "greenclock.svg",
                        id: "clock1"
                    });
                } else {
                    var clock1 = new draw2d.shape.basic.Image({ path: "greenclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                    node.add(clock1, new draw2d.layout.locator.Locator());
                    clock1.setId("clock1");
                }
            }
            if (ActStatus == 2) {


                if (node.children.data.length == 11) {
                    node.children.data[10].figure.attr({
                        path: "redclock.svg",
                        id: "clock2"
                    });
                } else {
                    var clock2 = new draw2d.shape.basic.Image({ path: "redclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                    node.add(clock2, new draw2d.layout.locator.Locator());
                    clock2.setId("clock2");
                }

            }
            if (ActStatus == 3) {
                if (node.children.data.length == 11) {
                    node.children.data[10].figure.attr({
                        path: "blackclock.svg",
                        id: "clock3"
                    });
                } else {
                    var clock3 = new draw2d.shape.basic.Image({ path: "blackclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                    node.add(clock3, new draw2d.layout.locator.Locator());
                    clock3.setId("clock3");
                }
            }
            if (ActStatus == 4) {
                if (node.children.data.length == 11) {
                    node.children.data[10].figure.attr({
                        path: "yellowclock.svg",
                        id: "clock4"
                    });
                } else {
                    var clock4 = new draw2d.shape.basic.Image({ path: "yellowclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                    node.add(clock4, new draw2d.layout.locator.Locator());
                    clock4.setId("clock4");
                }
            }

            $('.modal2').css('display', 'none');
            $('.overlay').removeClass('overlay-show');
            $('.fade2').removeClass('show');
            displayJSON(canvas2);
        });
    }
    $('.btn-save3').on('click', function () {

        if ($('#activity-name3').val() == "" || $('#state-name3').val() == "") {
            $(".form-message").html("Vui Lòng Nhập Trường Này");
            $(".form-message").css("color", "red");
        } else {
            load();
            LoadActivity();
            function load() {

                var WfCode = $('#activity-name3').val();
                var WfName = $('#state-name3').val();
                var WfNote = $('#exampleFormControlTextarea5').val();
                var CreatedBy = "anhphi";
                var CreatedTime = "";
                var UpdatedBy = "anhphi";
                var UpdatedTime = "";
                var DeletedBy = "anhphi";
                var DeletedTime = "";
                var IsDeleted = true;
                var settings = {
                    "url": "http://117.6.131.222:6789//api/ApiWorkFlow",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json",
                    },
                    "data": "{\r\n\r\n\"WfCode\":\"" + WfCode + "\",\r\n\"WfName\": \"" + WfName + "\",\r\n\"WfNote\": \"" + WfNote + "\"\r\n// \"CreatedBy\": \"" + CreatedBy + "\",\r\n// \"CreatedTime\": " + CreatedTime + ",\r\n// \"UpdatedBy\": \"" + UpdatedBy + "\",\r\n// \"UpdatedTime\": " + UpdatedTime + ",\r\n// \"DeletedBy\": \"" + DeletedBy + "\",\r\n// \"DeletedTime\": " + DeletedTime + ",\r\n// \"IsDeleted\": " + IsDeleted + "\r\n}",
                };
                $.ajax(settings).done(function (response) {
                    alert("thành công");
                });
                $('.chosen').append('<option value ="' + WfName + '">' + WfName + '</option>');



            }
            function LoadActivity() {
                newdata = JSON.parse(dataweb);
                for (var i = 0; i < newdata.length; i++) {

                    if (newdata[i].type == "draw2d.shape.node.Hub") {
                        var ActCode = newdata[i].id;
                        var ActName = newdata[i].labels[0].text;
                        var ActParent = $('#state-name3').val();
                        var dt = JSON.stringify(newdata[i]);
                        var ActStatus;
                        var ActAttributeGraph = dt.toString();
                        if (newdata[i].labels.length > 10) {

                            if (newdata[i].labels[10].id == "clock1") {
                                ActStatus = 1;
                            }
                            if (newdata[i].labels[10].id == "clock2") {
                                ActStatus = 2;
                            }
                            if (newdata[i].labels[10].id == "clock3") {
                                ActStatus = 3;
                            }
                            if (newdata[i].labels[10].id == "clock4") {
                                ActStatus = 4;
                            }
                        } else {
                            ActStatus = "";
                        }



                        var IsDeleted = true;
                        var settings = {
                            "url": "http://117.6.131.222:6789//api/ApiActivityWorkFlow",
                            "method": "POST",
                            "timeout": 0,
                            "headers": {
                                "Content-Type": "application/json"
                            },
                            "data": JSON.stringify({ "ActCode": "" + ActCode + "", "ActName": "" + ActName + "", "ActParent": "" + ActParent + "", "ActNoted": "", "ActAttributeGraph": "" + ActAttributeGraph + "", "ActStatus": "" + ActStatus + "" }),
                        };

                        $.ajax(settings).done(function (response) {
                            console.log(response);
                        });
                    }
                    if (newdata[i].type == "draw2d.Connection") {
                        var TrsCode = newdata[i].id;
                        var TrsType = newdata[i].type;
                        var TrsTitle = newdata[i].labels[0].text;
                        var TrsParent = $('#state-name3').val();
                        var dt = JSON.stringify(newdata[i]);

                        var TrsAttrGraph = dt.toString();

                        var IsDeleted = true;
                        var settings = {
                            "url": "http://117.6.131.222:6789//api/ApiTransition",
                            "method": "POST",
                            "timeout": 0,
                            "headers": {
                                "Content-Type": "application/json"
                            },
                            "data": JSON.stringify({ "TrsCode": "" + TrsCode + "", "TrsType": "" + TrsType + "", "TrsTitle": "" + TrsTitle + "", "TrsParent": "" + TrsParent + "", "TrsAttrGraph": "" + TrsAttrGraph + "" }),
                        };

                        $.ajax(settings).done(function (response) {
                            console.log(response);
                        });
                    }
                }
            }
            transition();
            function transition() {
                newdata = JSON.parse(dataweb);
                var ActInitial1 = [];
                var ActDestination1 = [];

                for (var i = 0; i < newdata.length; i++) {

                    if (newdata[i].type == "draw2d.Connection") {
                        var ActInitial = newdata[i].source.node;
                        ActInitial1.push(ActInitial);
                        var ActDestination = newdata[i].target.node;
                        ActDestination1.push(ActDestination);

                    }

                }
                for (var i = 0; i < newdata.length; i++) {
                    if (newdata[i].type == "draw2d.shape.node.Hub") {
                        var WfCode = $('#activity-name3').val();
                        for (var j = 0; j < ActInitial1.length; j++) {
                            if (newdata[i].id == ActInitial1[j]) {

                                var Condition = newdata[i].labels[1].text;
                                var settings6 = {
                                    "url": "http://117.6.131.222:6789//api/ActivityTransition",
                                    "method": "POST",
                                    "timeout": 0,
                                    "headers": {
                                        "Content-Type": "application/json"
                                    },
                                    "data": JSON.stringify({ "WfCode": "" + WfCode + "", "ActInitial": "" + ActInitial1[j] + "", "Condition": "" + Condition + "", "ActDestination": "" + ActDestination1[j] + "" }),
                                };

                                $.ajax(settings6).done(function (response) {
                                    console.log("adsfdsaf");
                                });
                            }
                        }
                    }
                }
            }
            $('.modal3').css('display', 'none');
            $('.overlay').removeClass('overlay-show');
            $('.fade3').removeClass('show');
        }
    });
    // get value input form newWFL
    var nameee = "";
    var wfcode = "";
    var ti = "";
    $(".autoarange").click(function () {
        var newdata = JSON.parse(dataweb);
        nameee = $('.chosen').val();
        var settings = {
            "url": "http://117.6.131.222:6789//api/ApiActivityWorkFlow",
            "method": "get",
            "datatype": json
        };
        $.ajax(settings).done(function (response) {


            if ($('.chosen').val() != 0) {
                canvas2.clear();
                var sum = [];
                for (var i = 0; i < response.length; i++) {
                    if (response[i].ActParent == $('.chosen').val()) {
                        var jsons = JSON.parse(response[i].ActAttributeGraph);

                        sum.push(jsons);
                    }
                }
                var settings2 = {
                    "url": "http://117.6.131.222:6789//api/ApiTransition",
                    "method": "get",
                    "datatype": json
                };
                $.ajax(settings2).done(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].TrsParent == $('.chosen').val()) {
                            var jsons = JSON.parse(data[i].TrsAttrGraph);
                            sum.push(jsons);
                        }
                    }


                    var s = 150;
                    var yh = 150;
                    var count = 0;

                    for (var t = 0; t < newdata.length; t++) {
                        if (newdata[t].type == "draw2d.shape.node.Hub") {

                            newdata[t].x = s;
                            newdata[t].y = yh;
                            s = s + 350;
                            if (s > 850) {
                                s = 150;
                                yh = yh + 200;

                            }
                            count++;
                        }
                    }
                    var reader = new draw2d.io.json.Reader();

                    reader.unmarshal(canvas2, newdata);

                    displayJSON(canvas2);
                    updateLast();

                    $(".auto").on("click", function () {

                        var node = canvas2.getPrimarySelection();
                        var del = new draw2d.shape.basic.Image({ path: "delete.png", height: 25, width: 25, stroke: 1, x: 17, y: -35, visible: true });

                        if (!node.children.data[0].figure.children.data.length) {
                            node.children.data[0].figure.add(del, new draw2d.layout.locator.Locator());
                            node.children.data[0].figure.children.data[0].figure.attr({
                                cssClass: "dell2",
                                visible: true
                            });

                            $(".dell2").on("click", function () {
                                canvas2.remove(canvas2.getPrimarySelection());
                                checkdell2.push(node.id);
                                displayJSON(canvas2);

                            });
                        }

                    });
                    var getWF = {
                        "url": "http://117.6.131.222:6789//api/ApiWorkFlow",
                        "method": "get",
                        "datatype": json
                    }
                    $.ajax(getWF).done(function (data) {

                        for (var i = 0; i < data.Data.length; i++) {

                            if (data.Data[i].WfName === nameee) {

                                wfcode = (data.Data[i].WfCode);
                                var gettime = {
                                    "url": "http://117.6.131.222:6789//api/ActivityTransition",
                                    "method": "get",
                                    "datatype": json
                                }
                                $.ajax(gettime).done(function (data1) {
                                    timerr();
                                    // Update the count down every 1 second

                                    function timerr() {
                                        for (var j = 0; j < data1.length; j++) {
                                            if (data1[j].WfCode == wfcode) {
                                                var figurearr = canvas2.getFigures();
                                                for (var t = 0; t < figurearr.data.length; t++) {
                                                    if (figurearr.data[t].id == data1[j].ActInitial) {
                                                        ti = figurearr.data[t].children.data[1].figure.text;
                                                        var teo = figurearr.data[t].children.data[3].figure;
                                                        if (ti != "") {
                                                            var countDownDate = new Date(ti).getTime();
                                                            // Get today's date and time
                                                            var now = new Date().getTime();
                                                            // Find the distance between now and the count down date
                                                            var distance = countDownDate - now;
                                                            // Time calculations for days, hours, minutes and seconds
                                                            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                                                            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                                            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                                            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                                                            // Output the result in an element with id="demo"
                                                            if (days >= 1) {
                                                                time = days + "d " + hours + "h " +
                                                                    minutes + "m " + seconds + "s ";
                                                            } else {
                                                                time = hours + "h " +
                                                                    minutes + "m " + seconds + "s ";
                                                            }
                                                            teo.attr({
                                                                text: time
                                                            });

                                                            displayJSON(canvas2);
                                                            // If the count down is over, write some text 
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        setTimeout(timerr, 1000);
                                    }


                                });

                            }

                        }

                    });


                });
            }
        });
    });

    $scope.closePanelWf = function () {
        $(".wfl-instance").removeClass("wfl-instance__hiden");
        $(".main-menu-top").removeClass("panel-padding-left ");
        $(".parent_svg").removeClass("svg-margin-left");
    }

    function initDateTime() {
        $("#fromDate").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
            $('#toDate').datepicker('setStartDate', maxDate);
        });
        $("#toDate").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
            $('#fromDate').datepicker('setEndDate', maxDate);
        });
    }

    $scope.isEditWorkflow = false;
    $scope.editWorkflow = function () {
        if ($scope.isEditWorkflow) {
            if ($(window).width() < 600) {
                $('#main-table').css('opacity', '0.2');
            }
            $('#main-table').css('width', '50%');
        } else {
            $('#main-table').css('opacity', '');
            $('#main-table').css('width', ''); // Reset the width to its default value
        }
    }



    $scope.checkHiddenInforWf = false;
    $scope.checkHiddenFileWfActivityHistory = false;
    $scope.checkHiddenCmdTo = false;
    $scope.checkHiddenEmployee = false;
    $scope.checkHiddenObject = false;

    // document.getElementById("toggleActWf").addEventListener("click", function() {
    //     $scope.$apply(function() {
    //         $scope.checkHiddenActWf = !$scope.checkHiddenActWf;
    //         toggleContent("ActWf");
    //     });
    // });

    // document.getElementById("toggleInforWf").addEventListener("click", function() {
    //     $scope.$apply(function() {
    //         $scope.checkHiddenInforWf = !$scope.checkHiddenInforWf;
    //         toggleContent("InforWf");
    //     });
    // });

    // document.getElementById("toggleFileHistory").addEventListener("click", function() {
    //     $scope.$apply(function() {
    //         $scope.checkHiddenFileWfActivityHistory = !$scope.checkHiddenFileWfActivityHistory;
    //         toggleContent("FileHistory");
    //     });
    // });

    // document.getElementById("toggleCmdTo").addEventListener("click", function() {
    //     $scope.$apply(function() {
    //         $scope.checkHiddenCmdTo = !$scope.checkHiddenCmdTo;
    //         toggleContent("CmdTo");
    //     });
    // });

    // document.getElementById("toggleEmployee").addEventListener("click", function() {
    //     $scope.$apply(function() {
    //         $scope.checkHiddenEmployee = !$scope.checkHiddenEmployee;
    //         toggleContent("Employee");
    //     });
    // });

    // document.getElementById("toggleObject").addEventListener("click", function() {
    //     $scope.$apply(function() {
    //         $scope.checkHiddenObject = !$scope.checkHiddenObject;
    //         toggleContent("Object");
    //     });
    // });

    function toggleContent(contentId) {
        var content = document.getElementById(contentId);
        content.style.display = content.style.display == "none" || content.style.display == "" ? "block" : "none";
    }

    $scope.modelCmd = {
        CommandSymbol: "",
        Approve: "APPROVE_COMMAND_Y",
        Message: "",
        LstAct: []
    }

    $scope.modelAssign = {
        Branch: "",
        Object: "",
        UserId: ""
    }

    $scope.modelObj = {
        ObjectType: "",
        ObjectInst: "",
        ActInstCode: ""
    };

    $scope.submit = function () {
        validationSelect($scope.modelEditWf);
        if ($scope.addwfinstance.validate() && !validationSelect($scope.modelEditWf).Status) {
            dataservice.updateWfInstance($scope.modelEditWf, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    //$uibModalInstance.close();
                }
            })
        }
    }

    $scope.lockWfInstance = function (isLock) {
        var para = myService.getCode();
        dataservice.lockOrUnLockWfInst(para, isLock, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getItemWfInst(para, function (rs) {
                    rs = rs.data;
                    $scope.model = rs.ObjData;
                    $scope.model.StartTime = rs.StartTime;
                    $scope.model.EndTime = rs.EndTime;
                });
            }
        })
    }

    $scope.changeSelect = function (selectType) {
        if (selectType == "WorkflowCode" && $scope.model.WorkflowCode != "") {
            $scope.errorWorkflowCode = false;
        }

        if (selectType == "Status" && $scope.model.Status != "") {
            $scope.errorObjectInst = false;
        }
    }

    //Object operation
    $scope.objTypeChange = function (code) {
        dataservice.getObjFromObjType(code, function (rs) {
            rs = rs.data;
            $scope.lstObj = rs;

            $scope.modelObj.ObjectInst = '';
        })
    }

    $scope.addObject = function () {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if ($scope.modelObj.ObjEntry) {
            $scope.modelObj.Beshare = false;
        }
        else {
            $scope.modelObj.Beshare = true;
        }

        if ($scope.modelObj.ObjectType == "" || $scope.modelObj.ObjectInst == "" || $scope.modelObj.ActInstCode == "") {
            return App.toastrError(caption.WFAI_MSG_PLS_ENTER_FULL_INFO);
        }
        var para = myService.getCode();
        $scope.modelObj.WfInstCode = para;
        dataservice.insertObjectProcessWF($scope.modelObj, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getObjectProcessWF(para, function (rs) {
                    rs = rs.data
                    $rootScope.lstObjectProcess = rs;
                })
                $rootScope.reloadGridCard();
            }
        })
    }

    //Share object
    $scope.lstObjShare = [];
    $scope.shareObj = function () {
        if ($scope.lstObjShare.length === 0) {
            return App.toastrError(caption.WFAI_MSG_PLS_SELECT_OBJECT);
        }
        var para = myService.getCode();
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/share-object-to-activity.html',
            controller: 'share-object',
            size: '30',
            resolve: {
                para: function () {
                    return {
                        WfInstCode: para,
                        LstObj: $scope.lstObjShare
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
        });
    }

    $scope.viewShareObj = function (objCode, objType, actInst) {
        var para = myService.getCode();
        $scope.lstObjShare = [];
        for (var i = 0; i < $rootScope.lstObjectProcess.length; i++) {
            if ($rootScope.lstObjectProcess[i].ObjectCode === objCode && $rootScope.lstObjectProcess[i].ObjType === objType && $rootScope.lstObjectProcess[i].ActInst === actInst) {
                $rootScope.lstObjectProcess[i].IsCheck = true;
                $scope.lstObjShare.push($rootScope.lstObjectProcess[i]);
            }
        }

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/view-share-object-to-activity.html',
            controller: 'view-share-object',
            size: '30',
            resolve: {
                para: function () {
                    return {
                        ObjCode: objCode,
                        Type: objType,
                        WfInstCode: para,
                        LstObj: $scope.lstObjShare
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
        });
    }

    $scope.checkObject = function (isCheck, objCode, objType, actInst) {
        var para = myService.getCode();
        for (var i = 0; i < $rootScope.lstObjectProcess.length; i++) {
            if ($rootScope.lstObjectProcess[i].ObjectCode === objCode && $rootScope.lstObjectProcess[i].ObjType === objType && $rootScope.lstObjectProcess[i].ActInst === actInst) {
                $rootScope.lstObjectProcess[i].IsCheck = isCheck;
                if (isCheck) {
                    $scope.lstObjShare.push($rootScope.lstObjectProcess[i]);
                } else {
                    for (var k = 0; k < $scope.lstObjShare.length; k++) {
                        if ($scope.lstObjShare[k].ObjectCode === objCode && $scope.lstObjShare[k].ObjType === objType && $rootScope.lstObjectProcess[i].ActInst === actInst) {
                            $scope.lstObjShare.splice(k, 1);
                            break;
                        }
                    }
                }
            }
        }
    }

    $scope.deleteObject = function (id) {
        var para = myService.getCode();
        dataservice.deleteObjectShare(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getObjectProcessWF(para, function (rs) {
                    rs = rs.data
                    $rootScope.lstObjectProcess = rs;
                })
            }
        })
    }

    //Assign

    $scope.changeSelectAssign = function (SelectType, code) {
        if (SelectType == "Branch" && $scope.modelAssign.Branch != "") {
            $scope.errorBranch = false;
            $scope.listGroupUserAndDepartment = [];

            dataservice.getListUserOfBranch(code, function (rs) {
                rs = rs.data;
                var all = {
                    Code: 'All',
                    Name: 'Tất cả người dùng',
                    Type: 3,
                    Group: 'Người dùng',
                    CountUser: rs.length
                }
                $scope.listGroupUserAndDepartment.unshift(all);
            });
        }
        if (SelectType == "UserId" && $scope.modelAssign.UserId != "") {
            $scope.errorUserId = false;
        }

        if (SelectType == "Role" && $scope.modelAssign.Role != "") {
            $scope.errorRole = false;
        }
    }

    $scope.departmentOrGroupSelect = function (obj) {
        $scope.errorObject = false;
        $scope.departmentAssignCode = "";
        $scope.groupAssignCode = "";
        if (obj.Type == 1) {
            $scope.groupAssignCode = obj.Code;
            dataservice.getMemberInGroupUser(obj.Code, $scope.modelAssign.Branch, function (rs) {
                rs = rs.data;
                $scope.listUser = rs;
            });
        }
        else if (obj.Type == 2) {
            $scope.departmentAssignCode = obj.Code;
            dataservice.getListUserInDepartment(obj.Code, $scope.modelAssign.Branch, function (rs) {
                rs = rs.data;
                $scope.listUser = rs;
            });
        } else {
            dataservice.getListUserOfBranch($scope.modelAssign.Branch, function (rs) {
                rs = rs.data;
                $scope.listUser = rs;
            });
        }
    };

    $scope.changeRole = function (role, userId) {
        var para = myService.getCode();
        dataservice.updateRoleAssign(para, userId, role, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
            }
        })
    }

    $scope.changeRoleAct = function (id, role) {
        dataservice.updateRole(id, role, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
            }
        })
    }

    $scope.assign = function () {
        var para = myService.getCode();
        $scope.modelAssign.Role = "ROLE_ACT_PROCESSING";
        validationSelectAssign($scope.modelAssign);
        if (!validationSelectAssign($scope.modelAssign).Status) {
            $scope.modelAssign.WfInstCode = para;
            $scope.modelAssign.Department = $scope.departmentAssignCode;
            $scope.modelAssign.Group = $scope.groupAssignCode;
            dataservice.assignWF($scope.modelAssign, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    dataservice.getMemberAssignWF(para, function (rs) {
                        rs = rs.data;
                        $scope.lstMemberAssign = rs;
                    })
                }
            })
        }
    }

    $scope.delete = function (userId) {
        var para = myService.getCode();
        dataservice.deleteAssignWF(para, userId, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getMemberAssignWF(para, function (rs) {
                    rs = rs.data;
                    $scope.lstMemberAssign = rs;
                })
            }
        })
    }

    $scope.deleteAssignAct = function (id) {
        var para = myService.getCode();
        dataservice.deleteAssign(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getAllMemberAssignWF(para, function (rs) {
                    rs = rs.data;
                    $scope.lstAssignWF = rs;
                })
            }
        })
    }

    //Lock activity Instance
    $scope.lockAct = function () {
        var value = false;
        if ($scope.model.IsLock) {
            value = false;
            $scope.model.IsLock = false;
        } else {
            value = true;
            $scope.model.IsLock = true;
        }
        dataservice.lockActivity($rootScope.ActInstCode, value, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                $rootScope.IsLock = value;
                setBackgroundColor(value, $rootScope.ActInstCode);

                if ($rootScope.IsLock) {
                    clearTime();
                } else {
                    if (rs.Object !== null) {
                        $rootScope.downTime(rs.Object, $rootScope.ActInstCode);
                    }
                }
            }
        });
    };

    //SendCommand
    $scope.sendCommand = function () {
        var para = myService.getCode();
        if ($scope.modelCmd.LstAct.length == 0) {
            return App.toastrError(caption.WFAI_MSG_PLS_SELECT_ACT_INST);
        }
        else if ($scope.modelCmd.CommandSymbol == "") {
            return App.toastrError("Vui lòng chọn lệnh");
        }
        dataservice.sendCommandFromLeader($scope.modelCmd, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getCommandSendByLeader(para, function (rs) {
                    rs = rs.data;
                    $scope.lstCmdResult = rs;
                })
            }
        })
    }

    $scope.deleteCmdLeader = function (id) {
        var para = myService.getCode();
        dataservice.deleteCmdLeader(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getCommandSendByLeader(para, function (rs) {
                    rs = rs.data;
                    $scope.lstCmdResult = rs;
                })
            }
        })
    }

    function setBackgroundColor(lstActInst) {

        //Get all figure in canvas
        var arrFigure = $rootScope.canvas2.getFigures();
        if (arrFigure.data.length > 0) {
            for (var i = 0; i < arrFigure.data.length; i++) {
                for (var k = 0; k < lstActInst.length; k++) {
                    if (arrFigure.data[i].id === lstActInst[k].Code) {
                        if (lstActInst[k].Command.CommandSymbol === "COMMAND_WF_INSTANCE_BACK" || lstActInst[k].Command.CommandSymbol === "COMMAND_WF_INSTANCE_STOP") {
                            arrFigure.data[i].bgColor.hashString = "#FF0000";
                            arrFigure.data[i].bgColor.alpha = 1;
                            arrFigure.data[i].bgColor.blue = 0;
                            arrFigure.data[i].bgColor.green = 0;
                            arrFigure.data[i].bgColor.red = 255;
                        }
                        if (lstActInst[k].Command.CommandSymbol === "COMMAND_WF_INSTANCE_DO" || lstActInst[k].Command.CommandSymbol === "COMMAND_WF_INSTANCE_NEXT") {
                            arrFigure.data[i].bgColor.hashString = "#008000";
                            arrFigure.data[i].bgColor.alpha = 1;
                            arrFigure.data[i].bgColor.blue = 0;
                            arrFigure.data[i].bgColor.green = 128;
                            arrFigure.data[i].bgColor.red = 0;
                        }
                    }
                }
            }
        }
    }

    function clearTime(actInstCode) {

        var allFigure = $rootScope.canvas2.getFigures();
        if (allFigure.data.length > 0) {
            for (var i = 0; i < allFigure.data.length; i++) {
                if (allFigure.data[i].id == actInstCode) {
                    var figure = allFigure.data[i].children.data[11].figure;
                    figure.attr({
                        text: ""
                    });
                    clearInterval($rootScope.downTimeIndex);
                    break;
                }
            }
        }
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        //Check null 
        if (data.WorkflowCode == "") {
            $scope.errorWorkflowCode = true;
            mess.Status = true;
        } else {
            $scope.errorWorkflowCode = false;
        }

        if (data.Status == "") {
            $scope.errorStatus = true;
            mess.Status = true;
        } else {
            $scope.errorStatus = false;
        }

        return mess;
    };

    function validationSelectAssign(data) {
        var mess = { Status: false, Title: "" }
        if (data.Branch == "") {
            $scope.errorBranch = true;
            mess.Status = true;
        } else {
            $scope.errorBranch = false;
        }

        if (data.Object == "" || data.Object == null || data.Object == undefined) {
            $scope.errorObject = true;
            mess.Status = true;
        } else {
            $scope.errorObject = false;
        }

        if (data.UserId == "") {
            $scope.errorUserId = true;
            mess.Status = true;
        } else {
            $scope.errorUserId = false;
        }

        if (data.Role == "") {
            $scope.errorRole = true;
            mess.Status = true;
        } else {
            $scope.errorRole = false;
        }

        return mess;
    };
    $scope.CloseAll = function (act1) {
        if (!act1.IsApprovable && !window.isAllData) {
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
    setTimeout(function () {
        initDateTime();
    }, 200);
});

app.controller('add', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice, $translate, para) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    }

    $scope.model = {
        ActName: para.Title.text,
        Date: para.Date.text
    };

    $scope.saveActivity = function () {
        var node = $rootScope.canvas2.getPrimarySelection();
        $rootScope.ActName.text = $scope.model.ActName;
        $rootScope.ActDate.text = $scope.model.Date;
        var timer = $scope.model.Date;

        node.children.data[1].figure.attr({
            text: timer
        });
        if (!Date.parse(timer)) {
            node.children.data[3].figure.attr({
                text: ""
            });
        } else {
            var countDownDate = new Date(timer).getTime();
            // Update the count down every 1 second
            var x = setInterval(function () {
                // Get today's date and time
                var now = new Date().getTime();
                // Find the distance between now and the count down date
                var distance = countDownDate - now;
                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                // Output the result in an element with id="demo"
                if (days >= 1) {
                    time = days + "d " + hours + "h " +
                        minutes + "m " + seconds + "s ";
                } else {
                    time = hours + "h " +
                        minutes + "m " + seconds + "s ";
                }
                node.children.data[3].figure.attr({
                    text: time,
                    stroke: 0.2,
                    radius: 2,
                    bgColor: "#fff"
                });

                displayJSON($rootScope.canvas2);
                // If the count down is over, write some text 

            }, 1000);
        }

        ////////////////

        var ActStatus = $("#status").val();
        if (ActStatus == 1) {

            if (node.children.data.length == 11) {
                node.children.data[10].figure.attr({
                    path: "greenclock.svg",
                    id: "clock1"
                });
            } else {
                var clock1 = new draw2d.shape.basic.Image({ path: "greenclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                node.add(clock1, new draw2d.layout.locator.Locator());
                clock1.setId("clock1");
            }
        }
        if (ActStatus == 2) {


            if (node.children.data.length == 11) {
                node.children.data[10].figure.attr({
                    path: "redclock.svg",
                    id: "clock2"
                });
            } else {
                var clock2 = new draw2d.shape.basic.Image({ path: "redclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                node.add(clock2, new draw2d.layout.locator.Locator());
                clock2.setId("clock2");
            }


        }
        if (ActStatus == 3) {
            if (node.children.data.length == 11) {
                node.children.data[10].figure.attr({
                    path: "blackclock.svg",
                    id: "clock3"
                });
            } else {
                var clock3 = new draw2d.shape.basic.Image({ path: "blackclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                node.add(clock3, new draw2d.layout.locator.Locator());
                clock3.setId("clock3");
            }
        }
        if (ActStatus == 4) {
            if (node.children.data.length == 11) {
                node.children.data[10].figure.attr({
                    path: "yellowclock.svg",
                    id: "clock4"
                });
            } else {
                var clock4 = new draw2d.shape.basic.Image({ path: "yellowclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                node.add(clock4, new draw2d.layout.locator.Locator());
                clock4.setId("clock4");
            }
        }
        $('.modal').css('display', 'none');
        $('.overlay').removeClass('overlay-show');
        $('.fade').removeClass('show');
        displayJSON($rootScope.canvas2);
        $uibModalInstance.close();
    }

    $scope.submit = function () {
        App.blockUI({
            target: "#contentMain",
            boxed: true,
            message: 'loading...'
        });
        validationSelect($scope.model);
        if ($scope.addform.validate() && !validationSelect($scope.model).Status) {
            var dataJson = JSON.parse($rootScope.dataweb)
            for (var i = 0; i < dataJson.length; i++) {
                if (dataJson[i].id == node.id) {
                    var Json = JSON.stringify(dataJson[i]);
                    $scope.model.ShapeJson = Json.toString();
                }
            }
            dataservice.insertActivity($scope.model, function (rs) {
                rs = rs.data;
                try {
                    if (rs.Error) {
                        App.toastrError(rs.Title);
                    }
                    else {
                        dataservice.getUnitName($scope.model.Unit, function (rs) {
                            rs = rs.data;
                            var timer;
                            if (rs[0].Name == "Ngày") {
                                timer = $scope.model.Duration * 86400000;
                            }
                            if (rs[0].Name == "Giờ") {
                                timer = $scope.model.Duration * 3600000;
                            }
                            if (rs[0].Name == "Phút") {
                                timer = $scope.model.Duration * 60000;
                            }
                            if (rs[0].Name == "Giây") {
                                timer = $scope.model.Duration * 1000;
                            }
                            var x = setInterval(function () {

                                timer;
                                // Time calculations for days, hours, minutes and seconds
                                var days = Math.floor(timer / (1000 * 60 * 60 * 24));
                                var hours = Math.floor((timer % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                var minutes = Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60));
                                var seconds = Math.floor((timer % (1000 * 60)) / 1000);
                                // Output the result in an element with id="demo"
                                if (days >= 1) {
                                    time = days + "d " + hours + "h " +
                                        minutes + "m " + seconds + "s ";
                                } else {
                                    time = hours + "h " +
                                        minutes + "m " + seconds + "s ";
                                }
                                node.children.data[11].figure.attr({
                                    text: time,
                                    stroke: 0,
                                    radius: 2
                                });
                                timer = timer - 1000;

                                displayJSON($rootScope.canvas2);
                                // If the count down is over, write some text 

                            }, 1000);

                        })
                        node.children.data[0].figure.attr({
                            text: $scope.model.Title
                        });
                        App.toastrSuccess(rs.Title);
                        $uibModalInstance.close();
                    }
                } catch (e) {
                    console.log(e);
                }
                App.unblockUI("#contentMain");
            })
            dataservice.insertActMileStone($scope.modelmile, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {

                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.close();
                }
            })
        }
        else {
            App.unblockUI("#contentMain");
        }
    }

    function loadDate() {
        $("#actDate").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            dateFormat: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
        });
    }
    function displayJSON(canvas) {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(canvas, function (json) {
            $("#json").text(JSON.stringify(json, null, 2));
            dataweb = JSON.stringify(json, null, 2);
        });
    }
    setTimeout(function () {
        loadDate();
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('add-transition', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice, $translate) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    }

    $scope.saveActivity = function () {
        var node = $rootScope.canvas2.getPrimarySelection();
        $rootScope.ActName.text = $scope.model.ActName;
        $rootScope.ActDate.text = $scope.model.Date;
        var timer = $scope.model.Date;

        node.children.data[1].figure.attr({
            text: timer
        });
        if (!Date.parse(timer)) {
            node.children.data[3].figure.attr({
                text: ""
            });
        } else {
            var countDownDate = new Date(timer).getTime();
            // Update the count down every 1 second
            var x = setInterval(function () {
                // Get today's date and time
                var now = new Date().getTime();
                // Find the distance between now and the count down date
                var distance = countDownDate - now;
                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                // Output the result in an element with id="demo"
                if (days >= 1) {
                    time = days + "d " + hours + "h " +
                        minutes + "m " + seconds + "s ";
                } else {
                    time = hours + "h " +
                        minutes + "m " + seconds + "s ";
                }
                node.children.data[3].figure.attr({
                    text: time,
                    stroke: 0.2,
                    radius: 2,
                    bgColor: "#fff"
                });

                displayJSON($rootScope.canvas2);
                // If the count down is over, write some text 

            }, 1000);
        }

        ////////////////

        var ActStatus = $("#status").val();
        if (ActStatus == 1) {

            if (node.children.data.length == 11) {
                node.children.data[10].figure.attr({
                    path: "greenclock.svg",
                    id: "clock1"
                });
            } else {
                var clock1 = new draw2d.shape.basic.Image({ path: "greenclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                node.add(clock1, new draw2d.layout.locator.Locator());
                clock1.setId("clock1");
            }
        }
        if (ActStatus == 2) {


            if (node.children.data.length == 11) {
                node.children.data[10].figure.attr({
                    path: "redclock.svg",
                    id: "clock2"
                });
            } else {
                var clock2 = new draw2d.shape.basic.Image({ path: "redclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                node.add(clock2, new draw2d.layout.locator.Locator());
                clock2.setId("clock2");
            }


        }
        if (ActStatus == 3) {
            if (node.children.data.length == 11) {
                node.children.data[10].figure.attr({
                    path: "blackclock.svg",
                    id: "clock3"
                });
            } else {
                var clock3 = new draw2d.shape.basic.Image({ path: "blackclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                node.add(clock3, new draw2d.layout.locator.Locator());
                clock3.setId("clock3");
            }
        }
        if (ActStatus == 4) {
            if (node.children.data.length == 11) {
                node.children.data[10].figure.attr({
                    path: "yellowclock.svg",
                    id: "clock4"
                });
            } else {
                var clock4 = new draw2d.shape.basic.Image({ path: "yellowclock.svg", height: 30, width: 30, stroke: 1, x: 240, y: -31 });
                node.add(clock4, new draw2d.layout.locator.Locator());
                clock4.setId("clock4");
            }
        }
        $('.modal').css('display', 'none');
        $('.overlay').removeClass('overlay-show');
        $('.fade').removeClass('show');
        displayJSON($rootScope.canvas2);
        $uibModalInstance.close();
    }

    function loadDate() {
        $("#actDate").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            dateFormat: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
        });
    }
    function displayJSON(canvas) {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(canvas, function (json) {
            $("#json").text(JSON.stringify(json, null, 2));
            dataweb = JSON.stringify(json, null, 2);
        });
    }
    setTimeout(function () {
        loadDate();
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('add-workflow', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice, $translate) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    }
    $scope.model = {
        WfCode: "",
        WfName: "",
        WfGroup: "",
        WfType: "",
        WfNote: ""
    };

    $scope.initData = function () {
        dataservice.getWfGroup(function (rs) {
            rs = rs.data;
            $scope.lstWfGroup = rs;
        })
        dataservice.getWfType(function (rs) {
            rs = rs.data;
            $scope.lstWfType = rs;
        })
    }

    $scope.initData();

    $scope.submit = function () {
        validationSelect($scope.model);
        if ($scope.addform.validate() && !validationSelect($scope.model).Status) {
            dataservice.insertWorkFlow($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.close();
                }
            })
        }
    }

    $scope.changeSelect = function (selectType) {
        if (selectType == "WfGroup" && $scope.model.WfGroup != "") {
            $scope.errorWfGroup = false;
        }

        if (selectType == "WfType" && $scope.model.WfType != "") {
            $scope.errorWfType = false;
        }
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        //Check null 
        if (data.WfGroup == "") {
            $scope.errorWfGroup = true;
            mess.Status = true;
        } else {
            $scope.errorWfGroup = false;
        }

        if (data.WfType == "") {
            $scope.errorWfType = true;
            mess.Status = true;
        } else {
            $scope.errorWfType = false;
        }

        return mess;
    };

    function loadDate() {
        $("#actDate").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            dateFormat: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
        });
    }
    function displayJSON(canvas) {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(canvas, function (json) {
            $("#json").text(JSON.stringify(json, null, 2));
            dataweb = JSON.stringify(json, null, 2);
        });
    }
    setTimeout(function () {
        loadDate();
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('edit-workflow', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice, $translate, para) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    }
    $scope.model = {
        WfCode: "",
        WfName: "",
        WfGroup: "",
        WfType: "",
        WfNote: ""
    };

    $scope.initData = function () {
        dataservice.getWfGroup(function (rs) {
            rs = rs.data;
            $scope.lstWfGroup = rs;
        })
        dataservice.getWfType(function (rs) {
            rs = rs.data;
            $scope.lstWfType = rs;
        })
        dataservice.getItemWf(para, function (rs) {
            rs = rs.data;
            $scope.model = rs;
        })
    }
    $scope.initData();

    $scope.submit = function () {
        validationSelect($scope.model);
        if ($scope.addform.validate() && !validationSelect($scope.model).Status) {
            dataservice.updateWf($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.close();
                }
            })
        }
    }

    $scope.changeSelect = function (selectType) {
        if (selectType == "WfGroup" && $scope.model.WfGroup != "") {
            $scope.errorWfGroup = false;
        }

        if (selectType == "WfType" && $scope.model.WfType != "") {
            $scope.errorWfType = false;
        }
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        //Check null 
        if (data.WfGroup == "") {
            $scope.errorWfGroup = true;
            mess.Status = true;
        } else {
            $scope.errorWfGroup = false;
        }

        if (data.WfType == "") {
            $scope.errorWfType = true;
            mess.Status = true;
        } else {
            $scope.errorWfType = false;
        }

        return mess;
    };

    function loadDate() {
        $("#actDate").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            dateFormat: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
        });
    }
    function displayJSON(canvas) {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(canvas, function (json) {
            $("#json").text(JSON.stringify(json, null, 2));
            dataweb = JSON.stringify(json, null, 2);
        });
    }
    setTimeout(function () {
        loadDate();
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('setting-transition', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice, $translate, para) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    }
    $scope.model = {
        WorkflowCode: para.WorkflowCode,
        TransitionCode: para.TransitionCode,
        ActivityInitial: para.ActivityInitial,
        ActivityDestination: para.ActivityDestination,
        Command: ""
    };
    $scope.initData = function () {
    }
    $scope.initData();
    $scope.submit = function () {
        dataservice.settingWF($scope.model, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                $uibModalInstance.close();
            }
        })
    }
    function loadDate() {
        $("#actDate").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            dateFormat: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
        });
    }
    function displayJSON(canvas) {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(canvas, function (json) {
            $("#json").text(JSON.stringify(json, null, 2));
            dataweb = JSON.stringify(json, null, 2);
        });
    }
    setTimeout(function () {
        loadDate();
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('edit-activity-instance', function ($scope, $rootScope, $compile, $uibModal, $confirm, dataservice, $translate, $filter) {
    $scope.tabnav = 'Section3'; // Initialize tabnav variable
    $scope.isAllData = window.isAllData;
    $scope.saveTabNav = function (href) {
        $scope.tabnav = href; // Save href to tabnav variable
    };

    $scope.model = {
        Template: "",
        Status: ""
    };

    $scope.modelFile = {
        ActShare: []
    }

    $scope.modelFileAdd = {
        SignatureRequire: false
    }

    $scope.isAll = true;



    $rootScope.isAccepted = true;

    $rootScope.countCommand = function () {
        dataservice.getDesActivity($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.lstActFrom = rs.LstActFrom;
            $rootScope.lstActTo = rs.LstActTo;
            dataservice.getCommandFromLeader($rootScope.ActInstCode, function (rs1) {
                rs1 = rs1.data;
                $rootScope.lstActFrom = $rootScope.lstActFrom.concat(rs1);
            })
        })
        dataservice.getCommandTo($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.lstCommandToExtra = rs;
        })

        dataservice.getCommandFrom($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.lstCommandFromExtra = rs;
        })
    }
    $scope.initEdit = function (id, ObjCode) {

        dataservice.getItemActInst(id, function (rs) {
            $rootScope.IsLock = rs.data.IsLock;
            $scope.ActCatCode = rs.data.DataActInst.ActivityCode
            $scope.Data = rs.data;
            $scope.ObjectCode = ObjCode;
            $scope.initData();
        });
    }
    $scope.initData = function () {
        $scope.model = $scope.Data.DataActInst;
        $rootScope.ActInstCode = $scope.model.ActivityInstCode;
        $scope.model.sStartTime = $scope.model.StartTime != '' ? $filter('date')($scope.model.StartTime, 'dd/MM/yyyy') : '';
        $scope.model.sEndTime = $scope.model.EndTime != '' ? $filter('date')($scope.model.EndTime, 'dd/MM/yyyy') : '';

        $scope.isBack = $scope.Data.IsBack;
        $rootScope.IsLock = $scope.model.Status == "STATUS_ACTIVITY_LOCK" ? true : false;
        $scope.statusOld = angular.copy($scope.model.Status);
        $rootScope.ActivityCode = $scope.model.ActivityCode;
        $rootScope.WorkFlowCode = $scope.model.WorkflowCode;

        $rootScope.WfInstCode = $scope.model.WorkflowCode;

        $rootScope.ActInstCode = $scope.model.ActivityInstCode;

        dataservice.checkLockStatus($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $scope.isLockStatus = rs;
        })

        dataservice.autoUpdateLockShareJson($rootScope.ActInstCode, function (rs) { })

        $rootScope.isLock = $scope.model.Status == "STATUS_ACTIVITY_LOCK" ? true : false;

        dataservice.getDurationUnit(function (rs) {
            rs = rs.data;
            $scope.lstUnit = rs;
        })

        dataservice.getGroupAct(function (rs) {
            rs = rs.data;
            $scope.lstGroup = rs;
        })

        dataservice.getTypeAct(function (rs) {
            rs = rs.data;
            $scope.lstType = rs;
        })

        dataservice.blink($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.blink = rs;
        })

        //dataservice.getStatusAct(function (rs) {
        //    rs = rs.data;
        //    $scope.lstStatus = rs;
        //})

        dataservice.getStatusByGroupSetting($scope.model.ActivityInstCode, function (rs) {
            rs = rs.data;
            $scope.lstStatus = rs;
        })

        dataservice.getMilesStone(function (rs) {
            rs = rs.data;
            $scope.lstMileStone = rs;
        })

        dataservice.getTemplate(function (rs) {
            rs = rs.data;
            $scope.lstTemplate = rs;
        })

        //dataservice.getActivityByUser($scope.model.ActivityInstCode, function (rs) {
        //    rs = rs.data;

        //    $scope.activity = rs;
        //    var isAccept = false;
        //    for (var i = 0; i < $scope.activity.length; i++) {
        //        if ($scope.activity[i].Value == 2 && $scope.activity[i].IsCheck) {
        //            $rootScope.isAccepted = true;
        //            isAccept = true;
        //        }
        //    }
        //    if (!isAccept) {
        //        $rootScope.isAccepted = false;
        //    }
        //})

        dataservice.getPermission($scope.model.ActivityInstCode, function (rs) {
            rs = rs.data;
            $rootScope.permisstionApprove = rs.PermisstionApprove;
            $rootScope.permissionChangeRoleAssign = rs.PermissionChangeRole;
            console.log(rs);
        });

        $rootScope.countCommand();

        setTimeout(function () {
            validateDefaultDate($scope.model.sStartTime, $scope.model.sEndTime);
        }, 400);

        //$scope.interval = setInterval(sessionAct, 3000);
    }



    $rootScope.reloadHeader = function () {
        dataservice.getItemActInstByCode($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $scope.model = rs.DataActInst;
            $scope.isBack = rs.IsBack;

            $rootScope.IsLock = $scope.model.Status == "STATUS_ACTIVITY_LOCK" ? true : false;
        });
        $rootScope.infoLog();
    }

    $scope.updateActivity = function (value, isCheck) {
        if (isCheck) {
            var activity = $scope.activity.find(function (element) {
                if (element.Value != value && element.Value != 0) return true;
            });
            if (activity) {
                activity.IsCheck = false;
            }
            if (value == 2 && isCheck) {
                $scope.isAceptCard = true;
            }
            else {
                $scope.isAceptCard = false;
            }
        }
        dataservice.updateActivity($scope.model.ActivityInstCode, value, isCheck, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                var activity = $scope.activity.find(function (element) {
                    if (element.Value == value) return true;
                });
                if (activity) {
                    activity.Date = rs.Object.Date;
                    activity.Time = rs.Object.Time;
                }
                App.toastrSuccess(rs.Title);
                isChange = true;
                dataservice.getActivityByUser($scope.model.ActivityInstCode, function (rs) {
                    rs = rs.data;
                    $scope.activity = rs;
                    var isAccept = false;
                    for (var i = 0; i < $scope.activity.length; i++) {
                        if ($scope.activity[i].Value == 2 && $scope.activity[i].IsCheck) {
                            $rootScope.isAccepted = true;
                            isAccept = true;
                        }
                    }
                    if (!isAccept) {
                        $rootScope.isAccepted = false;
                    }
                })
            }
        });
    }

    $scope.showLogActivity = function () {
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/log-user-activity.html',
            controller: 'log-user-activity',
            size: '30',
            resolve: {
                para: function () {
                    return $scope.model.ActivityInstCode;
                }
            }
        });
        modalInstance.result.then(function (d) {

        });
    }

    $scope.submit = function () {

        if (!validationSelect($scope.model).Status) {
            if ($rootScope.IsLock) {
                return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
            }
            if (!$rootScope.isAccepted) {
                return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
            }
            //var data = CKEDITOR.instances['description'].getData();
            //$scope.model.Desc = data;

            $scope.model.StartTime = null;
            $scope.model.EndTime = null;
            dataservice.updateActInst($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    if ($rootScope.reloadAct) {
                        $rootScope.reloadAct();
                    }
                    else {
                        $rootScope.reloadActWf();
                    }
                    if ($scope.statusOld != $scope.model.Status) {
                        dataservice.updateStatusActInst($scope.model.ActivityInstCode, $scope.model.Status, function (rs1) {
                            rs1 = rs1.data;
                            if (rs1.Error) {
                                App.toastrError(rs1.Title);
                            } else {
                                var lstActInst = rs1.Object;
                                if (lstActInst != null) {
                                    if (lstActInst.length > 0) {
                                        setBackgroundColor(lstActInst);
                                    }
                                } else {
                                    lstActInst = [];
                                }
                                var obj = {
                                    ActInstCode: $rootScope.ActInstCode,
                                    LstActInst: lstActInst
                                }
                            }
                        })
                    }
                    $rootScope.infoLog();
                }
            })
        }
    }

    $scope.fileManage = function () {
        if ($scope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/fileManage.html',
            controller: 'fileManage',
            backdrop: 'static',
            size: '60',
            resolve: {
                para: function () {
                    return $scope.model.ActivityInstCode;
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataservice.getAttachment($scope.model.ActivityInstCode, function (rs) {
                rs = rs.data;
                $scope.attachments = rs;
            })
        }, function () {
        });
    }

    $scope.fileAttachment = {
        FileName: "",
        FilePath: "",
        ActivityInstCode: $scope.model.ActivityInstCode,
        FileType: "",
        FileSize: 0,
        ParentFile: ""
    }

    $scope.addAttachment = function () {

        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }

        $("#fileAttachment").trigger("click");
    }

    $scope.isAddFile = false;

    $scope.loadAttachment = function (event) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var file = event.target.files[0];
        if (file != undefined) {
            var size = file.size;;
            var data = new FormData();
            data.append("FileUpload", file);
            data.append("ActivityInstCode", $scope.model.ActivityInstCode)
            dataservice.uploadAttachment(data, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                    return;
                }
                else {

                    var fileName = $('#fileAttachment').val();
                    var idxDot = fileName.lastIndexOf(".") + 1;
                    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
                    var file = fileName.split('\\');
                    $scope.fileAttachment = {
                        FileName: file[file.length - 1],
                        FilePath: '/uploads/files/' + rs.Object,
                        ActivityInstCode: $scope.model.ActivityInstCode,
                        FileType: "." + extFile,
                        FileSize: size,
                        SignatureRequire: false
                    }
                    $scope.isAddFile = true;
                    //$('#fileAttachment').replaceWith($('#fileAttachment').val('').clone(true));
                }
            });
        }
    }

    $scope.insertFile = function () {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if (!$scope.isAddFile) {
            return App.toastrError(caption.WFAI_MSG_PLS_SELECT_FILE);
        }
        $scope.fileAttachment.SignatureRequire = $scope.modelFileAdd.SignatureRequire;
        dataservice.addAttachment($scope.fileAttachment, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getAttachment($scope.model.ActivityInstCode, function (rs) {
                    rs = rs.data;
                    $scope.attachments = rs;
                })
            }
        })
    }

    $scope.deleteAttachment = function (fileCode, type) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var data = {
            FileCode: fileCode,
            Type: type,
            ActInstCode: $scope.model.ActivityInstCode
        };
        dataservice.deleteAttachment(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getAttachment($scope.model.ActivityInstCode, function (rs) {
                    rs = rs.data;
                    $scope.attachments = rs;
                })
            }
        })
    }

    $scope.downloadAttach = function (url, code, type) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if (type == 1) {
            window.target = "_blank";
            location.href = url;
        }
        else if (type == 2) {
            dataservice.isFileEdms(code, url, function (rs) {
                rs = rs.data;
                if (rs) {
                    location.href = "/WorkflowActivity/Download?"
                        + "fileCode=" + code + "&url=" + url;
                }
                else {
                    window.target = "_blank";
                    location.href = url;
                }
            })
        }
    }

    $scope.viewFile = function (fileCode, url, isSign) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var data = {
            ActInstCode: $scope.model.ActivityInstCode,
            FileCode: fileCode,
            Url: url,
            IsSign: isSign,
            Mode: 2
        };

        var extension = url.substr(url.lastIndexOf('.') + 1);
        var word = ['DOCX', 'DOC'];
        var pdf = ['PDF'];
        var excel = ['XLS', 'XLSX'];
        if (word.indexOf(extension.toUpperCase()) !== -1) {
            if (isSign) {
                dataservice.isFileSign($scope.model.ActivityInstCode, function (rs) {
                    rs = rs.data;
                    if (rs) {
                        return App.toastrError(caption.WFAI_MSG_SIGNED_FILE);
                    }
                    var modalInstance = $uibModal.open({
                        templateUrl: ctxfolderMessage + '/messageConfirmSign.html',
                        windowClass: "message-center",
                        controller: function ($scope, $uibModalInstance) {
                            $scope.message = caption.WFAI_MSG_U_SURE_SIGN;
                            $scope.ok = function () {
                                dataservice.viewFileOnline(data, function (rs) {
                                    rs = rs.data;
                                    if (rs.Error) {
                                        App.toastrError(rs.Title);
                                        $uibModalInstance.close('cancel');
                                    } else {
                                        window.open('/Admin/Docman#', '_blank');
                                        $uibModalInstance.close('cancel');
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
                        dataservice.getAttachment($scope.model.ActivityInstCode, function (rs) {
                            rs = rs.data;
                            $scope.attachments = rs;
                        })
                    }, function () {
                    });
                })
            }
            else {
                dataservice.viewFileOnline(data, function (rs) {
                    window.open('/Admin/Docman#', '_blank');
                    dataservice.getAttachment($scope.model.ActivityInstCode, function (rs) {
                        rs = rs.data;
                        $scope.attachments = rs;
                    })
                });
            }
        }
        else if (pdf.indexOf(extension.toUpperCase()) !== -1) {
            dataservice.viewFileOnline(data, function (rs) {
                window.open('/Admin/PDF#', '_blank');
            });
        }
        else if (excel.indexOf(extension.toUpperCase()) !== -1) {
            dataservice.viewFileOnline(data, function (rs) {
                window.open('/Admin/Excel#', '_blank');
            });
        }
        else {
            window.open(url, '_blank');
        }
    }

    $scope.fileSelected = "";

    $scope.isSelectAllFile = false;

    $scope.selectAllFile = function () {
        if ($scope.attachments.length > 0) {
            for (var i = 0; i < $scope.attachments.length; i++) {
                $scope.attachments[i].IsSelect = true;
                $scope.isSelectAllFile = true;
            }
        }
    }

    $scope.unSelectAllFile = function () {
        if ($scope.attachments.length > 0) {
            for (var i = 0; i < $scope.attachments.length; i++) {
                $scope.attachments[i].IsSelect = false;
                $scope.isSelectAllFile = false;
            }
        }
    }

    //Real-time

    function sessionAct() {
        //dataservice.isUpdateNewData($rootScope.ActInstCode, function (rs) {
        //    rs = rs.data;
        //    if (rs) {
        //        loadNewData();
        //    }
        //})
    }

    function loadNewData() {
        dataservice.getItemActInstByCode($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $scope.model = rs.DataActInst;
            $rootScope.IsLock = $scope.model.Status == "STATUS_ACTIVITY_LOCK" ? true : false;
            editor.setData($scope.model.Desc);
        });

        dataservice.getActivityByUser($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $scope.activity = rs;
            var isAccept = false;
            for (var i = 0; i < $scope.activity.length; i++) {
                if ($scope.activity[i].Value == 2 && $scope.activity[i].IsCheck) {
                    $rootScope.isAccepted = true;
                    isAccept = true;
                }
            }
            if (!isAccept) {
                $rootScope.isAccepted = false;
            }
        });

        dataservice.getPermission($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.permisstionApprove = rs.PermisstionApprove;
            $rootScope.permissionChangeRoleAssign = rs.PermissionChangeRole;
        });

        var data = {
            ActivityCode: $rootScope.ActInstCode
        }
        dataservice.getMemberAssign(data, function (rs) {
            rs = rs.data;
            $scope.lstMemberAssign = rs;
            console.log($scope.lstMemberAssign)
        });

        dataservice.getObjectProcess($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.lstObjectProcess = rs;
        })

        dataservice.getCommandTo($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.lstCommandToExtra = rs;
        })

        dataservice.getCommandFrom($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.lstCommandFromExtra = rs;
        })

        dataservice.getDesActivity($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.lstActFrom = rs.LstActFrom;
            $rootScope.lstActTo = rs.LstActTo;
        })

        $rootScope.reloadFile();
    }

    $rootScope.infoLog = function () {
        dataservice.getLastActionUser($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            if (rs.Object != null) {
                $rootScope.infoLogActionUser = rs.Object;
            }
        })
    }
    //End real-time

    //Validate

    $scope.changeSelect = function (selectType) {
        if (selectType == "Status") {
            if ($scope.model.Status == "STATUS_ACTIVITY_APPROVED" && $scope.model.Type != "TYPE_ACTIVITY_END") {
                if (!$rootScope.permisstionApprove) {
                    $scope.model.Status = $scope.statusOld;
                    return App.toastrError(caption.WFAI_MSG_U_NOT_PER_APPROVE_ACT);
                }
                dataservice.checkSignFileWithStatus($scope.model.ActivityInstCode, function (rs) {
                    rs = rs.data;
                    if (!rs) {
                        $scope.model.Status = $scope.statusOld;
                        App.toastrError(caption.WFAI_MSG_PLS_SIGN_FILE_AND_GO);
                    }
                })
            }
            if ($scope.model.Status == "STATUS_ACTIVITY_APPROVE_END" && $scope.model.Type == "TYPE_ACTIVITY_END") {
                if (!$rootScope.permisstionApprove) {
                    $scope.model.Status = $scope.statusOld;
                    return App.toastrError(caption.WFAI_MSG_U_NOT_PER_APPROVE_ACT);
                }

                dataservice.checkSignFileWithStatus($scope.model.ActivityInstCode, function (rs) {
                    rs = rs.data;
                    if (!rs) {
                        $scope.model.Status = $scope.statusOld;
                        App.toastrError(caption.WFAI_MSG_PLS_SIGN_AND_END);
                    }
                })
            }
            if ($scope.model.Status == "STATUS_ACTIVITY_APPROVE_END" && $scope.model.Type != "TYPE_ACTIVITY_END") {
                $scope.model.Status = $scope.statusOld;
                App.toastrError(caption.WFAI_MSG_STATUS_FOR_END_ACT);
            }
            if ($scope.model.Status == "STATUS_ACTIVITY_APPROVED" && $scope.model.Type == "TYPE_ACTIVITY_END") {
                $scope.model.Status = $scope.statusOld;
                App.toastrError(caption.WFAI_MSG_ACT_END_CANT_GO);
            }
        }
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }

        // angular.forEach($rootScope.validationOptionsActivity.rules, function(rule, fieldName) {
        //     if (rule.required && !data[fieldName]) {
        //         // Nếu trường bắt buộc mà không có giá trị
        //         $scope["error" + fieldName] = true;
        //         mess.Status = true;
        //     } else {
        //         $scope["error" + fieldName] = false;
        //     }
        // });

        if (data.Unit == "") {
            $scope.errorUnit = true;
            mess.Status = true;
        } else {
            $scope.errorUnit = false;
        }

        if (data.Group == "") {
            $scope.errorGroup = true;
            mess.Status = true;
        } else {
            $scope.errorGroup = false;
        }

        if (data.Type == "") {
            $scope.errorType = true;
            mess.Status = true;
        } else {
            $scope.errorType = false;
        }

        if (data.Status == "") {
            $scope.errorStatus = true;
            mess.Status = true;
        } else {
            $scope.errorStatus = false;
        }
        return mess;
    };

    //Lock activity Instance
    $scope.lockAct = function () {
        var value = false;
        if ($scope.model.IsLock) {
            value = false;
            $scope.model.IsLock = false;
        } else {
            value = true;
            $scope.model.IsLock = true;
        }
        dataservice.lockActivity($rootScope.ActInstCode, value, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                $rootScope.IsLock = value;
                setBackgroundColor(value, $rootScope.ActInstCode);

                if ($rootScope.IsLock) {
                    clearTime();
                } else {
                    if (rs.Object != null) {
                        $rootScope.downTime(rs.Object, $rootScope.ActInstCode);
                    }
                }
            }
        })
    }

    //Add common
    $scope.addUnit = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCommonSetting + "/detail.html",
            controller: 'detail',
            size: '50',
            backdrop: 'static',
            resolve: {
                para: function () {
                    return {
                        Group: 'DURATION_UNIT',
                        GroupNote: 'Đơn vị thời lượng',
                        AssetCode: 'DURATION_UNIT'
                    }
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataservice.getDurationUnit(function (rs) {
                rs = rs.data;
                $scope.lstUnit = rs;
            })
        }, function () { });
    }

    $scope.addGroup = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCommonSetting + "/detail.html",
            controller: 'detail',
            size: '50',
            backdrop: 'static',
            resolve: {
                para: function () {
                    return {
                        Group: 'GROUP_ACTIVITY',
                        GroupNote: 'Nhóm hoạt động',
                        AssetCode: 'GROUP_ACTIVITY'
                    }
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataservice.getGroupAct(function (rs) {
                rs = rs.data;
                $scope.lstGroup = rs;
            })
        }, function () { });
    }

    $scope.addType = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCommonSetting + "/detail.html",
            controller: 'detail',
            size: '50',
            backdrop: 'static',
            resolve: {
                para: function () {
                    return {
                        Group: 'TYPE_ACTIVITY',
                        GroupNote: 'Loại hoạt động',
                        AssetCode: 'TYPE_ACTIVITY'
                    }
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataservice.getTypeAct(function (rs) {
                rs = rs.data;
                $scope.lstType = rs;
            })
        }, function () { });
    }

    $scope.addStatus = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCommonSetting + "/detail.html",
            controller: 'detail',
            size: '50',
            backdrop: 'static',
            resolve: {
                para: function () {
                    return {
                        Group: 'STATUS_ACTIVITY',
                        GroupNote: 'Trạng thái hoạt động',
                        AssetCode: 'STATUS_ACTIVITY'
                    }
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataservice.getStatusAct(function (rs) {
                rs = rs.data;
                $scope.lstStatus = rs;
            })
        }, function () { });
    }

    $scope.openLog = function (fileCode) {
        var objCode = $rootScope.ActInstCode;
        var objType = 'FILE_ACT_INST';
        dataservice.getLogContent(fileCode, objCode, objType, function (rs) {
            rs = rs.data;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: ctxfolder + '/showLog.html',
                controller: 'showLog',
                backdrop: 'static',
                size: '70',
                resolve: {
                    para: function () {
                        return rs;
                    }
                }
            });
            modalInstance.result.then(function (d) {
            }, function () { });
        });
    }

    //Notify
    $scope.sendNotifi = function () {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/send-notifi-card.html',
            controller: 'send-notifi-act',
            size: '30',
            resolve: {
                para: function () {
                    return $scope.model.ActivityInstCode;
                }
            }
        });
        modalInstance.result.then(function (d) {
        });
    }

    function setBackgroundColor(lstActInst) {

        //Get all figure in canvas
        var arrFigure = $rootScope.canvas2.getFigures();
        if (arrFigure.data.length > 0) {
            for (var i = 0; i < arrFigure.data.length; i++) {
                for (var k = 0; k < lstActInst.length; k++) {
                    if (arrFigure.data[i].id == lstActInst[k].ActivityInstCode) {
                        arrFigure.data[i].bgColor.hashString = "#008000";
                        arrFigure.data[i].bgColor.alpha = 1;
                        arrFigure.data[i].bgColor.blue = 0;
                        arrFigure.data[i].bgColor.green = 128;
                        arrFigure.data[i].bgColor.red = 0;
                    }
                }
            }
        }
    }

    function clearTime() {
        if ($rootScope.IsLock) {
            var allFigure = $rootScope.canvas2.getFigures();
            if (allFigure.data.length > 0) {
                for (var i = 0; i < allFigure.data.length; i++) {
                    if (allFigure.data[i].id == $rootScope.ActInstCode) {
                        var figure = allFigure.data[i].children.data[11].figure;
                        figure.attr({
                            text: ""
                        });
                        clearInterval($rootScope.downTimeIndex);
                    }
                }
            }
        }
    }

    function clearTimeAct(actInstCode) {

        var allFigure = $rootScope.canvas2.getFigures();
        if (allFigure.data.length > 0) {
            for (var i = 0; i < allFigure.data.length; i++) {
                if (allFigure.data[i].id == actInstCode) {
                    var figure = allFigure.data[i].children.data[11].figure;
                    figure.attr({
                        text: ""
                    });
                    clearInterval($rootScope.downTimeIndex);
                    break;
                }
            }
        }
    }

    //var editor;
    //function ckEditer() {
    //    editor = CKEDITOR.replace('description', {
    //        cloudServices_tokenUrl: '/MobileApp/Token',
    //        cloudServices_uploadUrl: '/MobileApp/UploadFile',
    //        filebrowserBrowseUrl: '',
    //        filebrowserUploadUrl: '/MobileApp/Upload',
    //        embed_provider: '/uploader/upload.php'
    //    });
    //}

    function displayJSON(canvas) {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(canvas, function (json) {
            $("#json").text(JSON.stringify(json, null, 2));
            dataweb = JSON.stringify(json, null, 2);
        });
    }

    function loadDate() {
        $("#startDate").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            dateFormat: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
            $('#deadline').datepicker('setStartDate', maxDate);
            $('#endDate').datepicker('setStartDate', maxDate);
        });
        $("#endDate").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
            $('#startDate').datepicker('setEndDate', maxDate);
        });
    }

    function validateDefaultDate(startDate, endDate) {

        if (startDate != "") {
            setStartDate("#endDate", startDate);
        }
        if (endDate != "") {
            setEndDate("#startDate", endDate)
        }
    }

    setTimeout(function () {
        loadDate();
        /*ckEditer();*/
        setModalDraggable('.modal-dialog');
    }, 200);

    //Show, hide info
    $scope.showHideInfo = function () {
        if ($scope.isAll)
            $scope.isAll = false;
        else
            $scope.isAll = true;
    }
    //End show, hide header

    //Log Status
    $scope.viewLogStatus = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/view-status-log.html',
            controller: 'log-status-wf',
            size: '40',
            resolve: {
                para: function () {
                    return $rootScope.ActInstCode;
                }
            }
        });
        modalInstance.result.then(function (d) {
        });
    }
    //End log status
});

app.controller('nested-wf', function ($scope, $rootScope, $uibModal, $confirm, $compile, dataservice, $filter, $translate) {
    $scope.listWfNestedAct = [];

    $scope.model = {

    }

    $scope.initData = function () {
        dataservice.getNestedActCat($rootScope.ActCatCode, $rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $scope.listWfNestedAct = rs;
        })

        dataservice.getObjTypeJC(function (rs) {
            rs = rs.data;
            $scope.lstObjectType = rs;
        })
    }

    $scope.initData();

    $scope.$watch(function () {
        return $rootScope.ActInstCode;
    }, function (newVal, oldVal) {
        // Check if the value has changed
        if (newVal !== oldVal) {
            // If the value has changed, call init function
            $scope.initData();
        }
    });
    var lastObjectType = "";

    $scope.changeSelect = function (selectType, item, wfCode) {
        if (selectType == "ObjectType") {
            for (var i = 0; i < $scope.listWfNestedAct.length; i++) {
                if ($scope.listWfNestedAct[i].WfCode == wfCode) {
                    $scope.listWfNestedAct[i].ObjectInst = "";
                    break;
                }
            }

            lastObjectType = item;
            dataservice.getObjFromObjType(item, function (rs) {
                rs = rs.data;
                $scope.lstObjectInst = rs;
            })
        }
        else if (selectType == "ObjectInst") {
            for (var i = 0; i < $scope.listWfNestedAct.length; i++) {
                if ($scope.listWfNestedAct[i].WfCode == wfCode) {
                    $scope.listWfNestedAct[i].ObjectType = lastObjectType;
                    break;
                }
            }
        }
    }

    $scope.initWF = function (wfCode) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        for (var i = 0; i < $scope.listWfNestedAct.length; i++) {
            if ($scope.listWfNestedAct[i].WfCode == wfCode) {
                $scope.model.WfInstName = $scope.listWfNestedAct[i].WfInstName;

                $scope.model.WorkflowCode = $scope.listWfNestedAct[i].WfCode;

                $scope.model.ObjectInst = $scope.listWfNestedAct[i].ObjectInst;

                $scope.model.ActInstInitial = $rootScope.ActInstCode;

                $scope.model.WfGroup = $scope.listWfNestedAct[i].WfGroupCode;

                $scope.model.ObjectType = $scope.listWfNestedAct[i].ObjectType;
                break;
            }
        }
        if ($scope.model.WfInstName == "") {
            return App.toastrError("Vui lòng nhập tên thể hiện luồng");
        }

        dataservice.createWfInstance($scope.model, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                //dataservice.insertInstRunning(rs.Object.WfInstCode, wfCode, function (rs) {
                //})
                dataservice.getNestedActCat($rootScope.ActCatCode, $rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $scope.listWfNestedAct = rs;
                })
            }
        })
    }
});

app.controller('assign-member', function ($scope, $rootScope, $uibModal, $confirm, $compile, dataservice, $filter, $translate) {
    $scope.model = {
        Branch: "",
        Object: "",
        UserId: "",
        Role: ""
    }

    $scope.$watch(function () {
        return $rootScope.ActInstCode;
    }, function (newVal, oldVal) {
        // Check if the value has changed
        if (newVal !== oldVal) {
            // If the value has changed, call init function
            $scope.initLoad();
        }
    });

    $scope.initLoad = function () {
        dataservice.getGroupAct(function (rs) {
            rs = rs.data;
            $scope.lstGroup = rs;
        })
        dataservice.getTypeAct(function (rs) {
            rs = rs.data;
            $scope.lstType = rs;
        })
        //dataservice.getStatusAct(function (rs) {
        //    rs = rs.data;
        //    $scope.lstStatus = rs;
        //})
        dataservice.getBranch(function (rs) {
            rs = rs.data;
            $scope.lstBranch = rs;
        })
        dataservice.getListRoleAssign(function (rs) {
            rs = rs.data;
            $scope.lstRole = rs;
        })
        dataservice.getStatusAssign(function (rs) {
            rs = rs.data;
            $scope.lstStatusAssign = rs;
        })
        dataservice.getMemberAssign({
            ActivityCode: $rootScope.ActInstCode
        }, function (rs) {
            rs = rs.data;
            $scope.lstMemberAssign = rs;
            console.log($scope.lstMemberAssign)
        })
    }

    $scope.initLoad();

    $scope.changeSelect = function (SelectType, code) {
        if (SelectType == "Branch" && $scope.model.Branch != "") {
            $scope.errorBranch = false;
            $scope.listGroupUserAndDepartment = [];

            dataservice.getDepartmentInBranch(code, function (department) {
                department = department.data;
                dataservice.getListGroupUser(code, function (groupUser) {
                    groupUser = groupUser.data;
                    $scope.lstGroup = groupUser;
                    dataservice.getListUserOfBranch(code, function (rs) {
                        rs = rs.data;
                        var all = {
                            Code: 'All',
                            Name: 'Tất cả người dùng',
                            Type: 3,
                            Group: 'Người dùng',
                            CountUser: rs.length
                        }
                        $scope.listGroupUserAndDepartment = department.concat($scope.lstGroup);
                        $scope.listGroupUserAndDepartment.unshift(all);
                    });
                });
            })
        }
        if (SelectType == "UserId" && $scope.model.UserId != "") {
            $scope.errorUserId = false;
        }

        if (SelectType == "Role" && $scope.model.Role != "") {
            $scope.errorRole = false;
        }
    }

    $scope.departmentOrGroupSelect = function (obj) {
        $scope.errorObject = false;
        $scope.departmentAssignCode = "";
        $scope.groupAssignCode = "";
        if (obj.Type == 1) {
            $scope.groupAssignCode = obj.Code;
            dataservice.getMemberInGroupUser(obj.Code, $scope.model.Branch, function (rs) {
                rs = rs.data;
                $scope.listUser = rs;
            });
        }
        else if (obj.Type == 2) {
            $scope.departmentAssignCode = obj.Code;
            dataservice.getListUserInDepartment(obj.Code, $scope.model.Branch, function (rs) {
                rs = rs.data;
                $scope.listUser = rs;
            });
        } else {
            dataservice.getListUserOfBranch($scope.model.Branch, function (rs) {
                rs = rs.data;
                $scope.listUser = rs;
            });
        }
    };

    $scope.changeRole = function (id, role) {
        dataservice.updateRole(id, role, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getPermission($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.permisstionApprove = rs.PermisstionApprove;
                    $rootScope.permissionChangeRoleAssign = rs.PermissionChangeRole;
                })
                $rootScope.infoLog();
            }
        })
    }

    $scope.changeStatus = function (id, status) {
        dataservice.updateStatus(id, status, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                $rootScope.infoLog();
            }
        })
    }

    $scope.delete = function (id) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        dataservice.deleteAssign(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getMemberAssign(data, function (rs) {
                    rs = rs.data;
                    $scope.lstMemberAssign = rs;
                })
            }
        })
    }

    $scope.submit = function () {
        $scope.model.Role = "ROLE_ACT_STAFF";
        validationSelect($scope.model);
        if (!validationSelect($scope.model).Status) {
            $scope.model.ActivityCodeInst = $rootScope.ActInstCode;
            $scope.model.DepartmentCode = $scope.departmentAssignCode;
            $scope.model.GroupCode = $scope.groupAssignCode;

            dataservice.assign($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    dataservice.getMemberAssign(data, function (rs) {
                        rs = rs.data;
                        $scope.lstMemberAssign = rs;
                    })
                    $rootScope.infoLog();
                }
            })
        }
    }

    $scope.addRoleAssign = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCommonSetting + "/detail.html",
            controller: 'detail',
            size: '50',
            backdrop: 'static',
            resolve: {
                para: function () {
                    return {
                        Group: 'ROLE_ACT_ASSIGN',
                        GroupNote: 'Vai trò của nhân viên trong activity',
                        AssetCode: 'ROLE_ACT_ASSIGN'
                    }
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataservice.getListRoleAssign(function (rs) {
                rs = rs.data;
                $scope.lstRole = rs;
            })
        }, function () { });
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        if (data.Branch == "") {
            $scope.errorBranch = true;
            mess.Status = true;
        } else {
            $scope.errorBranch = false;
        }

        if (data.Object == "" || data.Object == null || data.Object == undefined) {
            $scope.errorObject = true;
            mess.Status = true;
        } else {
            $scope.errorObject = false;
        }

        if (data.UserId == "") {
            $scope.errorUserId = true;
            mess.Status = true;
        } else {
            $scope.errorUserId = false;
        }

        if (data.Role == "") {
            $scope.errorRole = true;
            mess.Status = true;
        } else {
            $scope.errorRole = false;
        }

        return mess;
    };

    setTimeout(function () {


    }, 200);
});

app.controller('attr-data', function ($scope, $rootScope, $uibModal, $confirm, $compile, $document, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, Fullscreen, dataserviceCardJob, $filter, $translate) {
    $scope.modelAttr = {
        WorkFlowCode: "",
        AttrCode: "",
        ActCode: "",
        ObjCode: "",
        UserName: userName,
        DtGroup: ""
    }

    $scope.addMoreAttr = {
        AttrUnit: '',
        AttrGroup: '',
        AttrName: '',
        Value: ''
    }

    $scope.listAttrGroupOfWf = [];
    $scope.listAttrOfGroup = [];

    $scope.tabTypeLogger = 0;

    $scope.initLoad = function () {
        dataservice.getGroupAttrOfWf($rootScope.WorkFlowCode, $rootScope.ActivityCode, function (rs) {
            rs = rs.data;
            $scope.listAttrGroupOfWf = rs;
        })

        dataservice.getAttrOfAct($rootScope.ActivityCode, function (rs) {
            rs = rs.data;
            $scope.lstAttrAct = rs;
        })

        var data = {
            WfCode: $rootScope.WorkFlowCode,
            ActCode: $rootScope.ActivityCode,
            ObjectCode: $rootScope.ObjectCode
        }

        dataservice.getAttrData(data, function (rs) {
            rs = rs.data;
            $scope.lstAttrData = rs;
        })

        var paramResult = {
            WfCode: $rootScope.WorkFlowCode,
            ActCode: $rootScope.ActInstCode,
            ObjectCode: $rootScope.ObjectCode
        };

        dataservice.getLstResultAttrData(paramResult, function (rs) {
            rs = rs.data;
            $scope.lstResult = rs;
        })

        dataservice.getUnitAttr(function (rs) {
            rs = rs.data;
            $scope.lstUnitAttr = rs;
        })

        dataservice.getListATTRUNIT(function (rs) {
            rs = rs.data;
            $scope.listAttrUnit = rs.Object;
        })

        $scope.modelAttr.WfInstCode = $rootScope.WorkFlowCode

        dataservice.getListUser(function (rs) {
            rs = rs.data;
            $scope.lstUser = rs.Object;
        })

        var actData = {
            ActInstCode: $rootScope.ActInstCode
        };

        dataservice.getAttrDataLogger(actData, function (rs) {
            rs = rs.data;

            $scope.listData = rs;
            $scope.tabTypeLogger = 1;
        });

        dataserviceCardJob.getAttrGroup("", function (rs) {
            rs = rs.data;
            $scope.lstAttrGroup = rs;
        })
    }

    $scope.initLoad()

    $scope.changeAttrGroup = function () {
        $scope.lstLoggerDataCard = [];
        dataservice.getAttrByGroup($scope.modelAttr.DtGroup, $rootScope.ActivityCode, function (rs) {
            rs = rs.data;
            $scope.listAttrTemp = rs;

            if ($scope.cardLogger.validate()) {
                //$scope.modelAttr.JobcardCode = para;

                $scope.modelAttr.WfInstCode = $rootScope.WorkFlowCode;
                $scope.modelAttr.ActInstCode = $rootScope.ActInstCode;
                for (var j = 0; j < $scope.listAttrTemp.length; j++) {
                    var objAttr = {
                        ID: $scope.listAttrTemp[j].ID,
                        Code: $scope.listAttrTemp[j].Code,
                        Title: $scope.listAttrTemp[j].Name,
                        Value: $scope.modelAttr.DtValue,
                        Unit: $scope.listAttrTemp[j].Unit,
                        Type: $scope.listAttrTemp[j].Type,
                        CreatedBy: $scope.listAttrTemp[j].CreatedBy,
                        CreatedTime: $scope.listAttrTemp[j].CreatedTime,
                        WfInstCode: $scope.WfInstCode,
                        ActInstCode: $rootScope.ActInstCode,
                        UserName: $scope.modelAttr.UserName,
                        IsDataTypeFile: $scope.listAttrTemp[j].IsTypeFile,
                        FileName: "",
                        FilePath: ""
                    };

                    $scope.lstLoggerDataCard.push(objAttr);
                };
            }
        });
    };

    $scope.addAttributeGroup = function (code) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/add-attribute-group.html',
            controller: 'add-attribute-group',
            size: '60',
            backdrop: 'static',
            windowClass: "message-center",
            appendTo: angular.element(document).find('#attr-data-tab'),
            resolve: {
                para: function () {
                    return code;
                }
            }
        });
        modalInstance.rendered.then(function () {
            angular.element(document).find('.modal-backdrop').addClass('z-index-1049');
            //$document.find('#attr-data-tab')
        }, function () { });
        modalInstance.result.then(function (d) {
            $scope.listAttrOfGroup = angular.copy(d);
        }, function () { });
    }

    $scope.loadAttrData = function (groupCode) {
        $scope.markGroup = groupCode;
        dataservice.getGroupAttrOfWf($rootScope.WorkFlowCode, $rootScope.ActivityCode, function (rs) {
            rs = rs.data;
            $scope.listAttrGroupOfWf = rs;
            for (var i = 0; i < $scope.listAttrGroupOfWf.length; i++) {
                if ($scope.listAttrGroupOfWf[i].Code == groupCode) {
                    $scope.listAttrOfGroup = $scope.listAttrGroupOfWf[i].ListAttr;
                    break;
                }
            }
        })
    }

    $scope.submitAttr = function () {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        $scope.modelListAttr = [];
        if ($scope.listAttrOfGroup.length === 0) {
            App.toastrError(caption.WFAI_MSG_GROUP_HAS_NOT_ATTR);
            return;
        };
        for (var j = 0; j < $scope.listAttrOfGroup.length; j++) {
            var data = {
                ObjCode: $rootScope.ObjectCode,
                WorkFlowCode: $rootScope.WorkFlowCode,
                ActCode: $rootScope.ActInstCode,
                Value: $scope.listAttrOfGroup[j].Value,
                AttrCode: $scope.listAttrOfGroup[j].AttrCode,
                UserName: $scope.listAttrOfGroup[j].UserName,
                FilePath: $scope.listAttrOfGroup[j].FilePath,
                FileName: $scope.listAttrOfGroup[j].FileName,
                IsTypeFile: $scope.listAttrOfGroup[j].IsDataTypeFile
            };
            $scope.modelListAttr.push(data);
        };
        for (var i = 0; i < $scope.listNewAttr.length; i++) {
            $scope.listNewAttr[i].AttrGroup = $scope.markGroup;
        }

        var dataAttr = {
            ListAttrStandard: $scope.modelListAttr,
            ListAttrMore: $scope.listNewAttr
        }

        dataservice.insertAttrData(dataAttr, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                var data = {
                    ActInstCode: $rootScope.ActInstCode
                };
                dataservice.getAttrDataLogger(data, function (rs) {
                    rs = rs.data;

                    $scope.listData = rs;
                    $scope.tabTypeLogger = 1;
                });
                dataservice.getGroupAttrOfWf($rootScope.WorkFlowCode, $rootScope.ActivityCode, function (rs) {
                    rs = rs.data;
                    $scope.listAttrGroupOfWf = rs;
                })
            }
        })
    }

    $scope.deleteDataLogger = function (sessionId) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            resolve: {
                para: function () {
                    return sessionId;
                }
            },
            controller: function ($scope, $uibModalInstance, para) {
                $scope.message = caption.COM_MSG_DELETE_CONFIRM_COM;
                $scope.ok = function () {
                    dataservice.deleteAttrDataLogger(para, function (rs) {
                        rs = rs.data;
                        if (rs.Error) {
                            App.toastrError(rs.Title);
                        }
                        else {
                            App.toastrSuccess(rs.Title);
                            $uibModalInstance.close('cancel');
                        }
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: '50',
            appendTo: angular.element(document).find('#attr-data-tab'),
        });
        modalInstance.rendered.then(function () {
            angular.element(document).find('.modal-backdrop').addClass('z-index-1049');
            //$document.find('#attr-data-tab')
        }, function () { });
        modalInstance.result.then(function (d) {
            var actData = {
                ActInstCode: $rootScope.ActInstCode
            };
            dataservice.getAttrDataLogger(actData, function (rs) {
                rs = rs.data;
                $scope.listData = rs;
            });
            dataservice.getGroupAttrOfWf($rootScope.WorkFlowCode, $rootScope.ActivityCode, function (rs) {
                rs = rs.data;
                $scope.listAttrGroupOfWf = rs;
            })
        }, function () {
        });
    };

    $scope.fileAttachment = {
        FileName: "",
        FilePath: "",
        AttrCode: ""
    }

    $scope.addAttachmentAttr = function (code) {
        $scope.AttrCodeAttachFile = code;
        $("#fileAttachmentAttr").trigger("click");
    }

    $scope.loadAttachmentAttr = function (event) {
        var file = event.target.files[0];
        if (file != undefined) {
            var size = file.size;;
            var data = new FormData();
            data.append("FileUpload", file);
            dataservice.uploadAttachment(data, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                    return;
                }
                else {

                    var fileName = $('#fileAttachmentAttr').val();
                    var idxDot = fileName.lastIndexOf(".") + 1;
                    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
                    var file = fileName.split('\\');
                    for (var j = 0; j < $scope.lstLoggerDataCard.length; j++) {
                        if ($scope.lstLoggerDataCard[j].Code == $scope.AttrCodeAttachFile) {
                            $scope.lstLoggerDataCard[j].FileName = file[file.length - 1];
                            $scope.lstLoggerDataCard[j].FilePath = '/uploads/files/' + rs.Object;
                            break;
                        }
                    }

                    //$('#fileAttachment').replaceWith($('#fileAttachment').val('').clone(true));
                }
            });
        }
    }

    $scope.viewFile = function (fileCode, url, isSign) {

        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        var data = {
            ActInstCode: $rootScope.ActInstCode,
            FileCode: fileCode,
            Url: url,
            IsSign: isSign
        };

        var extension = url.substr(url.lastIndexOf('.') + 1);
        var word = ['DOCX', 'DOC'];
        var pdf = ['PDF'];
        var excel = ['XLS', 'XLSX'];
        if (word.indexOf(extension.toUpperCase()) !== -1) {
            if (isSign) {
                var modalInstance = $uibModal.open({
                    templateUrl: ctxfolderMessage + '/messageConfirmSign.html',
                    windowClass: "message-center",
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = "Bạn có chắc chắn muốn ký không?";
                        $scope.ok = function () {
                            dataservice.viewFileOnline(data, function (rs) {
                                rs = rs.data;
                                if (rs.Error) {
                                    App.toastrError(rs.Title);
                                    $uibModalInstance.dismiss('cancel');
                                } else {
                                    window.open('/Admin/Docman#', '_blank');
                                    $uibModalInstance.dismiss('cancel');
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
                }, function () {
                });
            } else {
                dataservice.viewFileOnline(data, function (rs) {
                    window.open('/Admin/Docman#', '_blank');
                });
            }
        }
        else if (pdf.indexOf(extension.toUpperCase()) !== -1) {
            dataservice.viewFileOnline(data, function (rs) {
                window.open('/Admin/PDF#', '_blank');
            });
        }
        else if (excel.indexOf(extension.toUpperCase()) !== -1) {
            dataservice.viewFileOnline(data, function (rs) {
                window.open('/Admin/Excel#', '_blank');
            });
        }
        else {
            window.open(url, '_blank');
        }
    }
    $scope.isFullScreen = false;
    $scope.goFullscreen = function () {
        $scope.isFullScreen = !$scope.isFullScreen;
        //if ($scope.isFullScreen)
        //    $scope.isFullScreen = true;
        //else
        //    $scope.isFullScreen = false;

        // Set Fullscreen to a specific element (bad practice)
        // Fullscreen.enable( document.getElementById('img') )

    }
    //Add new attributes
    $scope.listNewAttr = [];
    $scope.currentId = 0;

    //$rootScope.ActivityCode = $scope.model.ActivityCode;
    //$rootScope.WorkFlowCode = $scope.model.WorkflowCode;
    //$rootScope.WfInstCode = $scope.model.WorkflowCode;
    //$rootScope.ActInstCode = $scope.model.ActivityInstCode;

    $scope.addNewAttr = function () {
        var newAttr = {
            Id: $scope.currentId,
            AttrUnit: '',
            AttrGroup: $scope.markGroup,
            AttrName: '',
            Value: '',
            ActCode: $rootScope.ActivityCode,
            WfCode: $rootScope.WorkFlowCode,
            ActInstCode: $rootScope.ActInstCode
        };
        $scope.listNewAttr.push(newAttr);
        $scope.currentId = $scope.currentId + 1;
    }

    $scope.deleteNewAtt = function (id) {
        for (var i = 0; i < $scope.listNewAttr.length; i++) {
            if ($scope.listNewAttr[i].Id == id) {
                $scope.listNewAttr.splice(i, 1);
                break;
            }
        }
    }

    setTimeout(function () {
        $scope.initLoad();
    }, 400);
});

app.controller('add-attribute-group', function ($scope, $rootScope, $uibModal, $confirm, $compile, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataservice, dataserviceCardJob, $filter, $translate) {
    $scope.modelAttr = {
        DtGroup: ""
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.listAttrGroupOfWf = [];
    $scope.listAttrOfGroup = [];

    $scope.tabTypeLogger = 0;

    $scope.initLoad = function () {

        dataserviceCardJob.getAttrGroup("", function (rs) {
            rs = rs.data;
            $scope.lstAttrGroup = rs;
        })
    }

    $scope.initLoad()

    $scope.changeAttrGroupAll = function (groupCode) {
        $scope.markGroup = groupCode;
        $scope.listAttrOfGroup = [];
        dataserviceCardJob.getAttrByGroup($scope.modelAttr.DtGroup, function (rs) {
            rs = rs.data;
            $scope.listAttrTemp = rs;
            for (var j = 0; j < $scope.listAttrTemp.length; j++) {
                var objAttr = {
                    AttrUnit: $scope.listAttrTemp[j].UnitRaw,
                    AttrGroup: $scope.markGroup,
                    AttrCode: $scope.listAttrTemp[j].Code,
                    AttrDataType: $scope.listAttrTemp[j].TypeRaw,
                    Value: $scope.modelAttr.DtValue,
                    SessionId: "",
                    AttrNote: "",
                    AttrName: $scope.listAttrTemp[j].Name,
                    UnitName: $scope.listAttrTemp[j].Unit,
                    CreatedBy: $scope.listAttrTemp[j].CreatedBy,
                    CreatedTime: $scope.listAttrTemp[j].CreatedTime,
                    FilePath: ""
                };

                $scope.listAttrOfGroup.push(objAttr);
            };
            $uibModalInstance.close($scope.listAttrOfGroup);
        });
    }
});

app.controller('object-operation', function ($scope, $rootScope, $uibModal, $cookies, DTOptionsBuilder, DTColumnBuilder, DTInstances, $compile, dataservice) {
    $scope.model = {
        ObjectType: "",
        ObjectInst: "",
        WorkflowCode: ""
    };

    $scope.initData = function () {
        dataservice.getObjTypeJC(function (rs) {

            rs = rs.data;
            $scope.lstObjType = rs;
        })
        dataservice.getObjectProcess($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.lstObjectProcess = rs;
        })
    }

    $scope.initData();

    //Share object
    $scope.objTypeChange = function (code) {
        $scope.model.ObjectInst = "";
        dataservice.getObjFromObjType(code, function (rs) {
            rs = rs.data;
            $scope.lstObj = rs;
        })
    }

    $scope.addObject = function () {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        $scope.model.ActInstCode = $rootScope.ActInstCode;
        $scope.model.WfInstCode = $rootScope.WorkFlowCode;
        if ($scope.model.ObjEntry) {
            $scope.model.Beshare = false;
        }
        else {
            $scope.model.Beshare = true;
        }

        if ($scope.model.ObjectType == "" || $scope.model.ObjectInst == "") {
            return App.toastrError(caption.WFAI_MSG_PLS_ENTER_FULL_INFO);
        }

        dataservice.insertObjectProcess($scope.model, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getObjectProcess($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstObjectProcess = rs;
                })
            }
        })
    }

    $scope.openCard = function (cardCode) {
        $rootScope.CardCode = cardCode;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCardJob + '/add-card-buffer.html',
            controller: 'edit-cardCardJob',
            size: '80',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                para: function () {
                    return cardCode;
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataservice.getObjectProcess($rootScope.ActInstCode, function (rs) {
                rs = rs.data;
                $rootScope.lstObjectProcess = rs;
            })
        }, function () { });
    }

    $scope.lstObjShare = [];
    $scope.shareObj = function () {

        if ($scope.lstObjShare.length === 0) {
            return App.toastrError(caption.WFAI_MSG_PLS_SELECT_OBJECT);
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/share-object-to-activity.html',
            controller: 'share-object',
            size: '30',
            resolve: {
                para: function () {
                    return {
                        WfInstCode: $rootScope.WfInstCode,
                        LstObj: $scope.lstObjShare
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
        });
    }

    $scope.viewShareObj = function (objCode, objType, actInst) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        $scope.lstObjShare = [];
        for (var i = 0; i < $rootScope.lstObjectProcess.length; i++) {
            if ($rootScope.lstObjectProcess[i].ObjectCode === objCode && $rootScope.lstObjectProcess[i].ObjType === objType && $rootScope.lstObjectProcess[i].ActInst === actInst) {
                $rootScope.lstObjectProcess[i].IsCheck = true;
                $scope.lstObjShare.push($rootScope.lstObjectProcess[i]);
            }
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/view-share-object-to-activity.html',
            controller: 'view-share-object',
            size: '30',
            resolve: {
                para: function () {
                    return {
                        ObjCode: objCode,
                        Type: objType,
                        WfInstCode: $rootScope.WfInstCode,
                        LstObj: $scope.lstObjShare
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
        });
    }

    $scope.checkObject = function (isCheck, objCode, objType, actInst) {
        for (var i = 0; i < $rootScope.lstObjectProcess.length; i++) {
            if ($rootScope.lstObjectProcess[i] != null) {
                if ($rootScope.lstObjectProcess[i].ObjectCode === objCode && $rootScope.lstObjectProcess[i].ObjType === objType && $rootScope.lstObjectProcess[i].ActInst === actInst) {
                    $rootScope.lstObjectProcess[i].IsCheck = isCheck;
                    if (isCheck) {
                        $scope.lstObjShare.push($rootScope.lstObjectProcess[i]);
                    } else {
                        for (var k = 0; k < $scope.lstObjShare.length; k++) {
                            if ($scope.lstObjShare[k].ObjectCode === objCode && $scope.lstObjShare[k].ObjType === objType && $rootScope.lstObjectProcess[i].ActInst === actInst) {
                                $scope.lstObjShare.splice(k, 1);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    $scope.deleteObject = function (id) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        dataservice.deleteObjectShare(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getObjectProcess($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstObjectProcess = rs;
                })
            }
        })
    }

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 100);
});

app.controller('command-to', function ($scope, $rootScope, $confirm, $compile, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, $filter, $translate) {
    $scope.model = {
        Status: ""
    }

    $scope.initData = function () {
        dataservice.getStatusCommand(function (rs) {
            rs = rs.data;
            $scope.lstCommandStatus = rs;
        })
        dataservice.getCommand($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $scope.lstCommand = rs;
        })
        dataservice.getConfirm(function (rs) {
            rs = rs.data;
            $scope.lstConfirm = rs;
        })
        dataservice.getApprove(function (rs) {
            rs = rs.data;
            $scope.lstApprove = rs;

        })
        dataservice.getDesActivity($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.lstActFrom = rs.LstActFrom;
            $rootScope.lstActTo = rs.LstActTo;
        })
        dataservice.getCommand(function (rs) {
            rs = rs.data;
            $scope.lstCommandCommon = rs;
        })
        dataservice.roleUpdateCommand($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $scope.isUpdateCommand = rs;
        })

        dataservice.getLstActInst($rootScope.WorkFlowCode, function (rs) {
            rs = rs.data;
            $scope.lstActInst = rs;
            for (var i = 0; i < $scope.lstActInst.length; i++) {
                if ($scope.lstActInst[i].Code == $rootScope.ActInstCode) {
                    $scope.lstActInst.splice(i, 1);
                    break;
                }
            }
        })

        dataservice.getCommandTo($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.lstCommandToExtra = rs;
        })

        dataservice.getCommandFrom($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.lstCommandFromExtra = rs;
        })
    }

    $scope.initData();

    $scope.runCommand = function () {
        if (!$scope.isUpdateCommand) {
            return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
        }
        //if ($rootScope.IsLock) {
        //    return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        //}
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var isCommandNull = false;
        for (var i = 0; i < $rootScope.lstActTo.length; i++) {

            if ($rootScope.lstActTo[i].Command == null) {
                isCommandNull = true;
                break;
            }
        }
        if (isCommandNull) {
            return App.toastrError("Vui lòng chọn lệnh");
        }

        var data = {
            ActInstCode: $rootScope.ActInstCode,
            ListCommand: $rootScope.lstActTo
        }
        dataservice.runningCommand(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getDesActivity($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstActFrom = rs.LstActFrom;
                    $rootScope.lstActTo = rs.LstActTo;
                    var allFigure = $rootScope.canvas2.getFigures();
                    if ($rootScope.lstActTo.length > 0) {
                        for (var i = 0; i < $rootScope.lstActTo.length; i++) {
                            for (k = 0; k < allFigure.data.length; k++) {
                                if ($rootScope.lstActTo[i].Code == allFigure.data[k].id) {

                                    var figure = allFigure.data[k].children.data[12].figure;
                                    figure.attr({
                                        text: $rootScope.lstActTo[i].CommandText
                                    });
                                }
                            }
                        }
                    }
                })

            }
        })
    }

    $scope.confirmCommand = function () {
        //if ($rootScope.IsLock) {
        //    return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        //}
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if (!$scope.isUpdateCommand) {
            return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
        }

        var isConfirmNull = false;
        for (var i = 0; i < $rootScope.lstActFrom.length; i++) {
            if ($rootScope.lstActFrom[i].Command.Confirmed == null) {
                isConfirmNull = true;
                break;
            }
        }
        if (isConfirmNull) {
            return App.toastrError("Vui lòng xác nhận lệnh");
        }
        var data = {
            ActInstCode: $rootScope.ActInstCode,
            ListCommand: $rootScope.lstActFrom
        }
        dataservice.confirmCommand(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.setCommandRepeat($rootScope.ActInstCode, function (rs1) {
                    rs1 = rs1.data;
                    var allFigure = $rootScope.canvas2.getFigures();
                    for (var i = 0; i < rs1.length; i++) {
                        for (k = 0; k < allFigure.data.length; k++) {
                            if (rs1[i].ActInst == allFigure.data[k].id) {
                                var figure = allFigure.data[k].children.data[13].figure;
                                var imgBack = allFigure.data[k].children.data[14].figure;
                                if (rs1[i].Check) {

                                    figure.attr({
                                        text: "Làm lại",
                                        cssClass: "draw2d_shape_basic_Image"
                                    });

                                    imgBack.attr({
                                        cssClass: "draw2d_shape_basic_Image"
                                    });

                                } else {
                                    figure.attr({
                                        text: "",

                                    });
                                    imgBack.attr({
                                        cssClass: "draw2d_shape_basic_Image hidden"
                                    });
                                }
                            }
                        }
                    }
                })
            }
        })
    }

    $scope.runOneCommand = function (actTo) {
        //if ($rootScope.IsLock) {
        //    return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        //}
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if (!$scope.isUpdateCommand) {
            return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
        }
        var data = {
            ActTo: actTo,
            ActInst: $rootScope.ActInstCode,
            Command: "",
            Approve: ""
        };
        for (var i = 0; i < $rootScope.lstActTo.length; i++) {
            if ($rootScope.lstActTo[i].Code == actTo) {

                if ($rootScope.lstActTo[i].Command != null) {
                    data.Command = $rootScope.lstActTo[i].Command.CommandSymbol;
                    data.Approve = $rootScope.lstActTo[i].Command.Approved;
                    break;
                }
            }
        }
        if (data.Command == "") {
            return App.toastrError("Vui lòng chọn lệnh");
        }
        dataservice.runningOneCommand(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getDesActivity($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstActFrom = rs.LstActFrom;
                    $rootScope.lstActTo = rs.LstActTo;
                })
                $rootScope.infoLog();
                dataservice.blink($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.blink = rs;
                })
            }
        })
    }

    $scope.confirmOneCommand = function (actFrom) {
        //if ($rootScope.IsLock) {
        //    return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        //}
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if (!$scope.isUpdateCommand) {
            return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
        }
        var data = {
            ActFrom: actFrom,
            ActInst: $rootScope.ActInstCode,
            Confirm: "",
            IsLeader: false,
            WfInstCode: "",
            ApproveBy: ""
        };
        for (var i = 0; i < $rootScope.lstActFrom.length; i++) {
            if ($rootScope.lstActFrom[i].Code == actFrom) {

                if ($rootScope.lstActFrom[i].Command.Confirmed != null) {
                    data.Confirm = $rootScope.lstActFrom[i].Command.Confirmed;
                    data.IsLeader = $rootScope.lstActFrom[i].Command.IsLeader;
                    data.ApproveBy = $rootScope.lstActFrom[i].Command.ApprovedBy;
                    data.WfInstCode = $rootScope.lstActFrom[i].WfInstCode;
                    break;
                }
            }
        }
        if (data.Confirm == "") {
            return App.toastrError("Vui lòng xác nhận lệnh");
        }
        dataservice.confirmOneCommand(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getDesActivity($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstActFrom = rs.LstActFrom;
                    $rootScope.lstActTo = rs.LstActTo;
                })
                dataservice.setCommandRepeat($rootScope.ActInstCode, function (rs1) {
                    rs1 = rs1.data;
                    var allFigure = $rootScope.canvas2.getFigures();

                    for (var i = 0; i < rs1.length; i++) {

                        for (k = 0; k < allFigure.data.length; k++) {

                            if (rs1[i].ActInst == allFigure.data[k].id) {
                                var figure = allFigure.data[k].children.data[13].figure;
                                var imgBack = allFigure.data[k].children.data[14].figure;
                                if (rs1[i].Check) {
                                    figure.attr({
                                        text: "Làm lại",
                                        cssClass: "draw2d_shape_basic_Image"
                                    });

                                    imgBack.attr({
                                        cssClass: "draw2d_shape_basic_Image"
                                    });
                                } else {
                                    figure.attr({
                                        text: "",
                                        cssClass: "draw2d_shape_basic_Image hidden"
                                    });
                                    imgBack.attr({
                                        cssClass: "draw2d_shape_basic_Image hidden"
                                    });
                                }
                            }
                        }
                    }
                })
                $rootScope.reloadHeader();
            }
        })
    }

    $scope.deleteCommand = function (code) {
        //if ($rootScope.IsLock) {
        //    return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        //}
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if (!$scope.isUpdateCommand) {
            return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
        }
        dataservice.deleteCommand(code, $rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getDesActivity($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstActFrom = rs.LstActFrom;
                    $rootScope.lstActTo = rs.LstActTo;
                })
                $rootScope.infoLog();
            }
        })
    }

    $scope.commandFrom = 0;

    $scope.commandTo = 0;

    $scope.showCommandFrom = function () {
        $scope.commandFrom = 0;
        $scope.commandTo = 0;
    }

    $scope.showCommandTo = function () {
        $scope.commandFrom = 1;
        $scope.commandTo = 1;
    }

    //Command extra

    $scope.cmdModel = {
        ActTo: '',
        User: '',
        ActFrom: '',
        Command: '',
        Note: ''
    };

    $scope.addCommandExtra = function () {

        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if (!$scope.isUpdateCommand) {
            return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
        }
        if ($scope.cmdModel.Command == "" || $scope.cmdModel.ActTo == "") {
            return App.toastrError("Vui lòng điền đầy đủ thông tin bắt buộc");
        }
        $scope.cmdModel.ActFrom = $rootScope.ActInstCode;
        dataservice.insertCommandExtra($scope.cmdModel, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getCommandTo($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstCommandToExtra = rs;
                })
                $rootScope.infoLog();
            }
        })
    }

    $scope.deleteCommandExtra = function (id) {
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if (!$scope.isUpdateCommand) {
            return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
        }
        dataservice.deleteCommandExtra(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getCommandTo($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstCommandToExtra = rs;
                })
                $rootScope.infoLog();
            }
        })
    }

    $scope.confirmCommandExtra = function (id, confirm) {

        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if (!$scope.isUpdateCommand) {
            return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
        }
        if (confirm == undefined || confirm == "" || confirm == null) {
            return App.toastrError("Vui lòng xác nhận lệnh");
        }
        dataservice.confirmCommandExtra(id, confirm, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getCommandFrom($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstCommandFromExtra = rs;
                })
                $rootScope.reloadHeader();
            }
        })
    }
    //End command extra

    setTimeout(function () {
    }, 400);
});

app.controller('command-from', function ($scope, $rootScope, $confirm, $compile, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, $filter, $translate) {
    $scope.model = {
        Status: ""
    }
    $rootScope.blinkTabActFrom = false;
    $scope.initData = function () {
        dataservice.getStatusCommand(function (rs) {
            rs = rs.data;
            $scope.lstCommandStatus = rs;
        })
        dataservice.getCommand($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $scope.lstCommand = rs;
        })
        dataservice.getConfirm(function (rs) {
            rs = rs.data;
            $scope.lstConfirm = rs;
        })
        dataservice.getApprove(function (rs) {
            rs = rs.data;
            $scope.lstApprove = rs;

        })
        dataservice.getDesActivity($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.lstActFrom = rs.LstActFrom;
            $rootScope.lstActTo = rs.LstActTo;
        })
        dataservice.getCommand(function (rs) {
            rs = rs.data;
            $scope.lstCommandCommon = rs;
        })
        dataservice.roleUpdateCommand($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $scope.isUpdateCommand = rs;
        })

        dataservice.getLstActInst($rootScope.WorkFlowCode, function (rs) {
            rs = rs.data;
            $scope.lstActInst = rs;
            for (var i = 0; i < $scope.lstActInst.length; i++) {
                if ($scope.lstActInst[i].Code == $rootScope.ActInstCode) {
                    $scope.lstActInst.splice(i, 1);
                    break;
                }
            }
        })

        dataservice.getCommandTo($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.lstCommandToExtra = rs;
        })

        dataservice.getCommandFrom($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $rootScope.lstCommandFromExtra = rs;
        })
    }

    $scope.initData();

    $scope.runCommand = function () {
        if (!$scope.isUpdateCommand) {
            return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
        }
        //if ($rootScope.IsLock) {
        //    return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        //}
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var isCommandNull = false;
        for (var i = 0; i < $rootScope.lstActTo.length; i++) {

            if ($rootScope.lstActTo[i].Command == null) {
                isCommandNull = true;
                break;
            }
        }
        if (isCommandNull) {
            return App.toastrError("Vui lòng chọn lệnh");
        }

        var data = {
            ActInstCode: $rootScope.ActInstCode,
            ListCommand: $rootScope.lstActTo
        }
        dataservice.runningCommand(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getDesActivity($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstActFrom = rs.LstActFrom;
                    $rootScope.lstActTo = rs.LstActTo;
                    var allFigure = $rootScope.canvas2.getFigures();
                    if ($rootScope.lstActTo.length > 0) {
                        for (var i = 0; i < $rootScope.lstActTo.length; i++) {
                            for (k = 0; k < allFigure.data.length; k++) {
                                if ($rootScope.lstActTo[i].Code == allFigure.data[k].id) {

                                    var figure = allFigure.data[k].children.data[12].figure;
                                    figure.attr({
                                        text: $rootScope.lstActTo[i].CommandText
                                    });
                                }
                            }
                        }
                    }
                })

            }
        })
    }

    $scope.confirmCommand = function () {
        //if ($rootScope.IsLock) {
        //    return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        //}
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if (!$scope.isUpdateCommand) {
            return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
        }

        var isConfirmNull = false;
        for (var i = 0; i < $rootScope.lstActFrom.length; i++) {
            if ($rootScope.lstActFrom[i].Command.Confirmed == null) {
                isConfirmNull = true;
                break;
            }
        }
        if (isConfirmNull) {
            return App.toastrError("Vui lòng xác nhận lệnh");
        }
        var data = {
            ActInstCode: $rootScope.ActInstCode,
            ListCommand: $rootScope.lstActFrom
        }
        dataservice.confirmCommand(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.setCommandRepeat($rootScope.ActInstCode, function (rs1) {
                    rs1 = rs1.data;
                    var allFigure = $rootScope.canvas2.getFigures();
                    for (var i = 0; i < rs1.length; i++) {
                        for (k = 0; k < allFigure.data.length; k++) {
                            if (rs1[i].ActInst == allFigure.data[k].id) {
                                var figure = allFigure.data[k].children.data[13].figure;
                                var imgBack = allFigure.data[k].children.data[14].figure;
                                if (rs1[i].Check) {

                                    figure.attr({
                                        text: "Làm lại",
                                        cssClass: "draw2d_shape_basic_Image"
                                    });

                                    imgBack.attr({
                                        cssClass: "draw2d_shape_basic_Image"
                                    });

                                } else {
                                    figure.attr({
                                        text: "",

                                    });
                                    imgBack.attr({
                                        cssClass: "draw2d_shape_basic_Image hidden"
                                    });
                                }
                            }
                        }
                    }
                })
            }
        })
    }

    $scope.runOneCommand = function (actTo) {
        //if ($rootScope.IsLock) {
        //    return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        //}
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if (!$scope.isUpdateCommand) {
            return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
        }
        var data = {
            ActTo: actTo,
            ActInst: $rootScope.ActInstCode,
            Command: "",
            Approve: ""
        };
        for (var i = 0; i < $rootScope.lstActTo.length; i++) {
            if ($rootScope.lstActTo[i].Code == actTo) {

                if ($rootScope.lstActTo[i].Command != null) {
                    data.Command = $rootScope.lstActTo[i].Command.CommandSymbol;
                    data.Approve = $rootScope.lstActTo[i].Command.Approved;
                    break;
                }
            }
        }
        if (data.Command == "") {
            return App.toastrError("Vui lòng chọn lệnh");
        }
        dataservice.runningOneCommand(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.setCommandRepeat($rootScope.ActInstCode, function (rs1) {
                    rs1 = rs1.data;
                    var allFigure = $rootScope.canvas2.getFigures();
                    for (var i = 0; i < rs1.LstActInst.length; i++) {
                        for (k = 0; k < allFigure.data.length; k++) {
                            if (rs1.LstActInst[i].ActivityInstCode == allFigure.data[k].id) {
                                var figure = allFigure.data[k].children.data[13].figure;
                                if (rs1.Check) {
                                    figure.attr({
                                        text: "Làm lại"
                                    });
                                } else {
                                    figure.attr({
                                        text: "Làm lại"
                                    });
                                }
                            }
                        }
                    }
                })
                dataservice.getDesActivity($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstActFrom = rs.LstActFrom;
                    $rootScope.lstActTo = rs.LstActTo;
                })
                $rootScope.infoLog();
            }
        })
    }

    $scope.confirmOneCommand = function (actFrom) {
        //if ($rootScope.IsLock) {
        //    return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        //}
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if (!$scope.isUpdateCommand) {
            return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
        }
        var data = {
            ActFrom: actFrom,
            ActInst: $rootScope.ActInstCode,
            Confirm: "",
            IsLeader: false,
            WfInstCode: "",
            ApproveBy: ""
        };
        for (var i = 0; i < $rootScope.lstActFrom.length; i++) {
            if ($rootScope.lstActFrom[i].Code == actFrom) {

                if ($rootScope.lstActFrom[i].Command.Confirmed != null) {
                    data.Confirm = $rootScope.lstActFrom[i].Command.Confirmed;
                    data.IsLeader = $rootScope.lstActFrom[i].Command.IsLeader;
                    data.ApproveBy = $rootScope.lstActFrom[i].Command.ApprovedBy;
                    data.WfInstCode = $rootScope.lstActFrom[i].WfInstCode;
                    break;
                }
            }
        }
        if (data.Confirm == "") {
            return App.toastrError("Vui lòng xác nhận lệnh");
        }
        dataservice.confirmOneCommand(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getDesActivity($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstActFrom = rs.LstActFrom;
                    $rootScope.lstActTo = rs.LstActTo;
                })
                dataservice.setCommandRepeat($rootScope.ActInstCode, function (rs1) {
                    rs1 = rs1.data;
                    var allFigure = $rootScope.canvas2.getFigures();

                    for (var i = 0; i < rs1.length; i++) {

                        for (k = 0; k < allFigure.data.length; k++) {

                            if (rs1[i].ActInst == allFigure.data[k].id) {
                                var figure = allFigure.data[k].children.data[13].figure;
                                var imgBack = allFigure.data[k].children.data[14].figure;
                                if (rs1[i].Check) {
                                    figure.attr({
                                        text: "Làm lại",
                                        cssClass: "draw2d_shape_basic_Image"
                                    });

                                    imgBack.attr({
                                        cssClass: "draw2d_shape_basic_Image"
                                    });
                                } else {
                                    figure.attr({
                                        text: "",
                                        cssClass: "draw2d_shape_basic_Image hidden"
                                    });
                                    imgBack.attr({
                                        cssClass: "draw2d_shape_basic_Image hidden"
                                    });
                                }
                            }
                        }
                    }
                })
                $rootScope.reloadHeader();
                dataservice.blink($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.blink = rs;
                })
            }
        })
    }

    $scope.deleteCommand = function (code) {
        //if ($rootScope.IsLock) {
        //    return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        //}
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        dataservice.deleteCommand(code, $rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getDesActivity($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstActFrom = rs.LstActFrom;
                    $rootScope.lstActTo = rs.LstActTo;
                })
                $rootScope.infoLog();
            }
        })
    }

    $scope.commandFrom = 0;

    $scope.commandTo = 0;

    $scope.showCommandFrom = function () {
        $scope.commandFrom = 0;
        $scope.commandTo = 0;
    }

    $scope.showCommandTo = function () {
        $scope.commandFrom = 1;
        $scope.commandTo = 1;
    }

    //Command extra

    $scope.cmdModel = {
        ActTo: '',
        User: '',
        ActFrom: '',
        Command: '',
        Note: ''
    };

    $scope.addCommandExtra = function () {

        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if (!$scope.isUpdateCommand) {
            return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
        }
        if ($scope.cmdModel.Command == "" || $scope.cmdModel.ActTo == "") {
            return App.toastrError("Vui lòng điền đầy đủ thông tin bắt buộc");
        }
        $scope.cmdModel.ActFrom = $rootScope.ActInstCode;
        dataservice.insertCommandExtra($scope.cmdModel, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getCommandTo($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstCommandToExtra = rs;
                })
                $rootScope.infoLog();
            }
        })
    }

    $scope.deleteCommandExtra = function (id) {
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        dataservice.deleteCommandExtra(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getCommandTo($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstCommandToExtra = rs;
                })
                $rootScope.infoLog();
            }
        })
    }

    $scope.confirmCommandExtra = function (id, confirm) {

        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if (!$scope.isUpdateCommand) {
            return App.toastrError(caption.WFAI_MSG_U_NOT_PERMISSION);
        }
        if (confirm == undefined || confirm == "" || confirm == null) {
            return App.toastrError("Vui lòng xác nhận lệnh");
        }
        dataservice.confirmCommandExtra(id, confirm, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getCommandFrom($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    $rootScope.lstCommandFromExtra = rs;
                })
                $rootScope.reloadHeader();
            }
        })
    }
    //End command extra

    setTimeout(function () {
    }, 400);
});

app.controller('assign-job-to-activity', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, dataservice, para) {
    $scope.model = {
        ActInstCode: ""
    }
    $scope.cancel = function () {
        $uibModalInstance.close(true);
    }
    $scope.initData = function () {
        dataservice.getAllActInstance(function (rs) {
            rs = rs.data;
            $scope.lstActInstance = rs;
        })

        dataservice.getActRelaObject(para.ObjType, para.ObjCode, function (rs) {
            rs = rs.data;
            $scope.lstActInst = rs;
        })
    }
    $scope.initData();

    $scope.submit = function () {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if ($scope.model.ActInstCode == "") {
            return App.toastrError(caption.WFAI_MSG_PLS_SELECT_ACT);
        }
        var data = {
            ActInstCode: $scope.model.ActInstCode,
            ObjectType: para.ObjType,
            ObjectInst: para.ObjCode,
            Beshare: true,
            ObjEntry: false
        };
        dataservice.insertObjectProcess(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getActRelaObject(para.ObjType, para.ObjCode, function (rs) {
                    rs = rs.data;
                    $scope.lstActInst = rs;
                })
            }
        })
    }

    $scope.delete = function (id) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        dataservice.deleteObjectProcessingShare(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getActRelaObject(para.ObjType, para.ObjCode, function (rs) {
                    rs = rs.data;
                    $scope.lstActInst = rs;
                })
            }
        })
    }

    setTimeout(function () {
        setModalDraggable(".modal-dialog");
    }, 400);
});

app.controller('add-wf-sharp-library', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice, $translate) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    }
    $scope.model = {
        SharpCode: "",
        SharpName: "",
        SharpType: "",
        SharpData: "",
        SharpDesc: "",
        SharpPath: ""
    };

    $scope.loadfile = function (e) {

        $("#upload").trigger('click');
    }
    $scope.attrfile = function (event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function () {
            document.getElementById('imageId').src = reader.result;
        };
        reader.readAsDataURL(file);
        if (file != undefined) {
            var data = new FormData();
            data.append("FileUpload", file);
            dataservice.uploadAttachment(data, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                    return;
                }
                else {
                    $scope.model.SharpPath = 'uploads/files/' + rs.Object;
                }
            })
        }
    }

    $scope.SharpDataChange = function () {
        if ($(".JsonData").val() == "") {
            $(".ShowImage").html('');
        }
        else {
            var type = JSON.parse($(".JsonData").val());

            /* if (typeof (type) == "object") {
                 if (type.type == "draw2d.shape.node.Hub") {
                     $(".ShowImage").html('<div class="item__act2 item1"><i class="fas fa-clock"></i><span>Process</span></div>');
                 }
                 if (type.type == "draw2d.shape.node.Oval_Hub") {
                     $(".ShowImage").html('<div class="item__act2 item2"><i class="fas fa-clock"></i><span>Connector</span></div>');
                 }
                 if (type.type == "draw2d.shape.node.Document_Hub") {
                     $(".ShowImage").html('<div class="item__act2 item3"><i class="fas fa-clock"></i><span>Activty</span></div>');
                 }
                 if (type.type == "draw2d.shape.node.Teminator_Hub") {
                     $(".ShowImage").html('<div class="item__act2 item4"><i class="fas fa-clock"></i><span>Termiator</span></div>');
                 }
                 if (type.type == "draw2d.shape.node.Process_Hub") {
                     $(".ShowImage").html('<div class="item__act2 item5"><i class="fas fa-clock"></i><span>Alternate/Process</span></div>');
                 }
                 if (type.type == "draw2d.shape.node.Delay_Hub") {
                     $(".ShowImage").html('<div class="item__act2 item6"><i class="fas fa-clock"></i><span>Delay</span></div>');
                 }
             }*/


        }
        $scope.model.SharpData = (JSON.stringify(type)).toString();

    }


    $scope.initData = function () {
        dataservice.getTypeLibrary(function (rs) {
            rs = rs.data;
            $scope.lstTypeLib = rs;
        })

    }

    $scope.initData();

    $scope.submit = function () {
        validationSelect($scope.model);
        if ($scope.addform.validate() && !validationSelect($scope.model).Status) {

            dataservice.insertSharpLibrary($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.close();
                }

            })

        }
    }

    $scope.changeSelect = function (selectType) {

    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        //Check null 
        if ($scope.model.SharpCode == "") {
            $scope.errorSharpCode = true;
            mess.Status = true;
        } else {
            $scope.errorSharpCode = false;
        }

        if ($scope.model.SharpName == "") {
            $scope.errorSharpName = true;
            mess.Status = true;
        } else {
            $scope.errorSharpName = false;
        }
        if (data.SharpType == "") {
            $scope.errorType = true;
            mess.Status = true;
        } else {
            $scope.errorType = false;
        }
        if ($scope.model.SharpData == "") {
            $scope.errorJson = true;
            mess.Status = true;
        } else {
            $scope.errorJson = false;
        }


        return mess;

    };

    function loadDate() {
        $("#actDate").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            dateFormat: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
        });
    }
    function displayJSON(canvas) {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(canvas, function (json) {
            $("#json").text(JSON.stringify(json, null, 2));
            dataweb = JSON.stringify(json, null, 2);
        });
    }
    setTimeout(function () {
        loadDate();
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('add-formbiulder', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice, $translate) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    }
    $scope.model = {
        FormCode: "",
        FormName: "",
        FormGroup: "",
        FormType: "",
        FormNote: ""
    };
    $scope.initData = function () {

        dataservice.getTypeLibrary(function (rs) {
            rs = rs.data;
            $scope.lstTypeLib = rs;
        })
    }

    $scope.initData();

    $scope.submit = function () {
        validationSelect($scope.model);
        if ($scope.addform.validate() && !validationSelect($scope.model).Status) {

            dataservice.insertFormCat($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.close();
                }
            })

        }
    }

    $scope.changeSelect = function (selectType) {

    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        //Check null 
        if ($scope.model.FormCode == "") {
            $scope.errorFormCode = true;
            mess.Status = true;
        } else {
            $scope.errorFormCode = false;
        }

        if ($scope.model.FormName == "") {
            $scope.errorFormName = true;
            mess.Status = true;
        } else {
            $scope.errorFormName = false;
        }
        if (data.FormType == "") {
            $scope.errorType = true;
            mess.Status = true;
        } else {
            $scope.errorType = false;
        }
        if (data.FormGroup == "") {
            $scope.errorGroup = true;
            mess.Status = true;
        } else {
            $scope.errorGroup = false;
        }


        return mess;

    };

    function loadDate() {
        $("#actDate").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            dateFormat: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
        });
    }
    function displayJSON(canvas) {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(canvas, function (json) {
            $("#json").text(JSON.stringify(json, null, 2));
            dataweb = JSON.stringify(json, null, 2);
        });
    }
    setTimeout(function () {

        loadDate();
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('add-wf-instance', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice, $translate) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    }
    $scope.model = {
        WorkflowCode: "",
        ObjectType: "",
        ObjectInst: "",
        Command: "",
        WfInstName: "",
        WfDesc: "",
        WfType: ""
    };

    $scope.tempWfName = "";
    $scope.tempObjectName = "";

    $scope.initData = function () {
        dataservice.getObjTypeJC(function (rs) {
            rs = rs.data;
            $scope.lstObjectType = rs;
        })
        dataservice.getWorkFlow(function (rs) {
            rs = rs.data;
            $scope.lstWF = rs;
        })
        dataservice.getWfGroup(function (rs) {
            rs = rs.data;
            $scope.lstWfGroup = rs;
        })

        dataservice.getWfType(function (rs) {
            rs = rs.data;
            $scope.lstWfType = rs;
        })
    }

    $scope.initData();

    $scope.submit = function () {
        App.blockUI({
            target: "#addwfinstance",
            boxed: true,
            message: 'loading...'
        });
        validationSelect($scope.model);
        if ($scope.addwfinstance.validate() && !validationSelect($scope.model).Status) {
            dataservice.createWfInstance($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.close();
                }
                App.unblockUI("#contentMain");
            })
        }
    }

    $scope.changeSelect = function (selectType, item) {
        if (selectType == "WorkflowCode" && $scope.model.WorkflowCode != "") {

            $scope.errorWorkflowCode = false;
            $scope.model.WfGroup = item.Group;
            $scope.model.WfType = item.Type;
            $scope.model.ObjectType = item.ObjectType;
            $scope.model.WfInstName = item.Name;
            if ($scope.model.ObjectType != "" && $scope.model.ObjectType != null && $scope.model.ObjectType != undefined) {
                dataservice.getObjFromObjType($scope.model.ObjectType, function (rs) {
                    rs = rs.data;
                    $scope.lstObjectInst = rs;
                })
            }
        }
        if (selectType == "ObjectType" && $scope.model.ObjectType != "") {
            $scope.model.ObjectInst = "";
            dataservice.getObjFromObjType($scope.model.ObjectType, function (rs) {
                rs = rs.data;
                $scope.lstObjectInst = rs;
            })
        }
        if (selectType == "ObjectInst" && $scope.model.ObjectInst != "") {

        }
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        //Check null 
        if (data.WorkflowCode == "") {
            $scope.errorWorkflowCode = true;
            mess.Status = true;
        } else {
            $scope.errorWorkflowCode = false;
        }

        //if (data.ObjectType == "") {
        //    $scope.errorObjectType = true;
        //    mess.Status = true;
        //} else {
        //    $scope.errorObjectType = false;
        //}

        //if (data.ObjectInst == "") {
        //    $scope.errorObjectInst = true;
        //    mess.Status = true;
        //} else {
        //    $scope.errorObjectInst = false;
        //}
        return mess;
    };

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('edit-wf-instance', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice, $translate, para) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    }

    $scope.model = {
        WorkflowCode: "",
        ObjectType: "",
        ObjectInst: "",
        Status: ""
    };

    $scope.modelCmd = {
        CommandSymbol: "",
        Approve: "APPROVE_COMMAND_Y",
        Message: "",
        LstAct: []
    }

    $scope.modelAssign = {
        Branch: "",
        Object: "",
        UserId: ""
    }

    $scope.modelObj = {
        ObjectType: "",
        ObjectInst: "",
        ActInstCode: ""
    };

    $scope.initData = function () {
        dataservice.getItemWfInst(para, function (rs) {
            rs = rs.data;
            $scope.model = rs.ObjData;
            $scope.model.StartTime = rs.StartTime;
            $scope.model.EndTime = rs.EndTime;
            if ($scope.model.ObjectType != "" && $scope.model.ObjectType != null && $scope.model.ObjectType != undefined) {
                dataservice.getObjFromObjType($scope.model.ObjectType, function (rs) {
                    rs = rs.data;
                    $scope.lstObjectInst = rs;
                });
            }
        });
        dataservice.getObjTypeJC(function (rs) {
            rs = rs.data;
            $scope.lstObjectType = rs;
        });
        dataservice.getWorkFlow(function (rs) {
            rs = rs.data;
            $scope.lstWF = rs;
        });
        dataservice.getLstActInst(para, function (rs) {
            rs = rs.data;
            $scope.lstActInstCmd = rs;
        })
        dataservice.getStatusCommand(function (rs) {
            rs = rs.data;
            $scope.lstCommandStatus = rs;
        })
        dataservice.getApprove(function (rs) {
            rs = rs.data;
            $scope.lstApprove = rs;

        })
        dataservice.getCommand(function (rs) {
            rs = rs.data;
            $scope.lstCommandCommon = rs;
        })
        dataservice.getCommandSendByLeader(para, function (rs) {
            rs = rs.data;
            $scope.lstCmdResult = rs;
        })
        dataservice.getConfirm(function (rs) {
            rs = rs.data;
            $scope.lstConfirm = rs;
        })
        dataservice.checkPermissionAssignWF(para, function (rs) {
            rs = rs.data;
            $scope.isPerAssignWF = rs;
        })


        //Assign
        dataservice.getGroupAct(function (rs) {
            rs = rs.data;
            $scope.lstGroup = rs;
        })
        dataservice.getTypeAct(function (rs) {
            rs = rs.data;
            $scope.lstType = rs;
        })
        //dataservice.getStatusAct(function (rs) {
        //    rs = rs.data;
        //    $scope.lstStatus = rs;
        //})
        dataservice.getBranch(function (rs) {
            rs = rs.data;
            $scope.lstBranch = rs;
        })
        dataservice.getListRoleAssign(function (rs) {
            rs = rs.data;
            $scope.lstRole = rs;
        })
        dataservice.getStatusAssign(function (rs) {
            rs = rs.data;
            $scope.lstStatusAssign = rs;
        })
        dataservice.getMemberAssignWF(para, function (rs) {
            rs = rs.data;
            $scope.lstMemberAssign = rs;
        })
        dataservice.getAllMemberAssignWF(para, function (rs) {
            rs = rs.data;
            $scope.lstAssignWF = rs;
        })

        //Object operation
        dataservice.getObjTypeJC(function (rs) {
            rs = rs.data;
            $scope.lstObjType = rs;
        })
        dataservice.getObjectProcessWF(para, function (rs) {
            rs = rs.data
            $rootScope.lstObjectProcess = rs;
        })
        dataservice.getInstance(para, function (rs) {
            rs = rs.data;
            $scope.lstActInst = rs;
        })

        //Group
        dataservice.getStatusWF(function (rs) {
            rs = rs.data;
            $scope.listStatusWF = rs;
        })
        dataservice.getWfGroup(function (rs) {
            rs = rs.data;
            $scope.listWfGroup = rs;
        })
    };

    $scope.initData();

    $scope.submit = function () {
        validationSelect($scope.model);
        if ($scope.addwfinstance.validate() && !validationSelect($scope.model).Status) {
            dataservice.updateWfInstance($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.close();
                }
            })
        }
    }

    $scope.lockWfInstance = function (isLock) {
        dataservice.lockOrUnLockWfInst(para, isLock, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getItemWfInst(para, function (rs) {
                    rs = rs.data;
                    $scope.model = rs.ObjData;
                    $scope.model.StartTime = rs.StartTime;
                    $scope.model.EndTime = rs.EndTime;
                });
            }
        })
    }

    $scope.changeSelect = function (selectType) {
        if (selectType == "WorkflowCode" && $scope.model.WorkflowCode != "") {
            $scope.errorWorkflowCode = false;
        }

        //if (selectType == "ObjectType" && $scope.model.ObjectType != "") {
        //    $scope.errorObjectType = false;
        //    $scope.model.ObjectInst = "";
        //    dataservice.getObjFromObjType($scope.model.ObjectType, function (rs) {
        //        rs = rs.data;
        //        $scope.lstObjectInst = rs;
        //    })
        //}
        //if (selectType == "ObjectInst" && $scope.model.ObjectInst != "") {
        //    $scope.errorObjectInst = false;
        //}

        if (selectType == "Status" && $scope.model.Status != "") {
            $scope.errorObjectInst = false;
        }
    }

    //Object operation
    $scope.objTypeChange = function (code) {
        dataservice.getObjFromObjType(code, function (rs) {
            rs = rs.data;
            $scope.lstObj = rs;

            $scope.modelObj.ObjectInst = '';
        })
    }

    $scope.addObject = function () {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if ($scope.modelObj.ObjEntry) {
            $scope.modelObj.Beshare = false;
        }
        else {
            $scope.modelObj.Beshare = true;
        }

        if ($scope.modelObj.ObjectType == "" || $scope.modelObj.ObjectInst == "" || $scope.modelObj.ActInstCode == "") {
            return App.toastrError(caption.WFAI_MSG_PLS_ENTER_FULL_INFO);
        }

        $scope.modelObj.WfInstCode = para;
        dataservice.insertObjectProcessWF($scope.modelObj, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getObjectProcessWF(para, function (rs) {
                    rs = rs.data
                    $rootScope.lstObjectProcess = rs;
                })
                $rootScope.reloadGridCard();
            }
        })
    }

    //Share object
    $scope.lstObjShare = [];
    $scope.shareObj = function () {
        if ($scope.lstObjShare.length === 0) {
            return App.toastrError(caption.WFAI_MSG_PLS_SELECT_OBJECT);
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/share-object-to-activity.html',
            controller: 'share-object',
            size: '30',
            resolve: {
                para: function () {
                    return {
                        WfInstCode: para,
                        LstObj: $scope.lstObjShare
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
        });
    }

    $scope.viewShareObj = function (objCode, objType, actInst) {
        $scope.lstObjShare = [];
        for (var i = 0; i < $rootScope.lstObjectProcess.length; i++) {
            if ($rootScope.lstObjectProcess[i].ObjectCode === objCode && $rootScope.lstObjectProcess[i].ObjType === objType && $rootScope.lstObjectProcess[i].ActInst === actInst) {
                $rootScope.lstObjectProcess[i].IsCheck = true;
                $scope.lstObjShare.push($rootScope.lstObjectProcess[i]);
            }
        }

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/view-share-object-to-activity.html',
            controller: 'view-share-object',
            size: '30',
            resolve: {
                para: function () {
                    return {
                        ObjCode: objCode,
                        Type: objType,
                        WfInstCode: para,
                        LstObj: $scope.lstObjShare
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
        });
    }

    $scope.checkObject = function (isCheck, objCode, objType, actInst) {

        for (var i = 0; i < $rootScope.lstObjectProcess.length; i++) {
            if ($rootScope.lstObjectProcess[i].ObjectCode === objCode && $rootScope.lstObjectProcess[i].ObjType === objType && $rootScope.lstObjectProcess[i].ActInst === actInst) {
                $rootScope.lstObjectProcess[i].IsCheck = isCheck;
                if (isCheck) {
                    $scope.lstObjShare.push($rootScope.lstObjectProcess[i]);
                } else {
                    for (var k = 0; k < $scope.lstObjShare.length; k++) {
                        if ($scope.lstObjShare[k].ObjectCode === objCode && $scope.lstObjShare[k].ObjType === objType && $rootScope.lstObjectProcess[i].ActInst === actInst) {
                            $scope.lstObjShare.splice(k, 1);
                            break;
                        }
                    }
                }
            }
        }
    }

    $scope.deleteObject = function (id) {
        dataservice.deleteObjectShare(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getObjectProcessWF(para, function (rs) {
                    rs = rs.data
                    $rootScope.lstObjectProcess = rs;
                })
            }
        })
    }

    //Assign

    $scope.changeSelectAssign = function (SelectType, code) {
        if (SelectType == "Branch" && $scope.modelAssign.Branch != "") {
            $scope.errorBranch = false;
            $scope.listGroupUserAndDepartment = [];

            dataservice.getListUserOfBranch(code, function (rs) {
                rs = rs.data;
                var all = {
                    Code: 'All',
                    Name: 'Tất cả người dùng',
                    Type: 3,
                    Group: 'Người dùng',
                    CountUser: rs.length
                }
                $scope.listGroupUserAndDepartment.unshift(all);
            });
        }
        if (SelectType == "UserId" && $scope.modelAssign.UserId != "") {
            $scope.errorUserId = false;
        }

        if (SelectType == "Role" && $scope.modelAssign.Role != "") {
            $scope.errorRole = false;
        }
    }

    $scope.departmentOrGroupSelect = function (obj) {
        $scope.errorObject = false;
        $scope.departmentAssignCode = "";
        $scope.groupAssignCode = "";
        if (obj.Type == 1) {
            $scope.groupAssignCode = obj.Code;
            dataservice.getMemberInGroupUser(obj.Code, $scope.modelAssign.Branch, function (rs) {
                rs = rs.data;
                $scope.listUser = rs;
            });
        }
        else if (obj.Type == 2) {
            $scope.departmentAssignCode = obj.Code;
            dataservice.getListUserInDepartment(obj.Code, $scope.modelAssign.Branch, function (rs) {
                rs = rs.data;
                $scope.listUser = rs;
            });
        } else {
            dataservice.getListUserOfBranch($scope.modelAssign.Branch, function (rs) {
                rs = rs.data;
                $scope.listUser = rs;
            });
        }
    };

    $scope.changeRole = function (role, userId) {
        dataservice.updateRoleAssign(para, userId, role, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
            }
        })
    }

    $scope.changeRoleAct = function (id, role) {
        dataservice.updateRole(id, role, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
            }
        })
    }

    $scope.assign = function () {
        $scope.modelAssign.Role = "ROLE_ACT_PROCESSING";
        validationSelectAssign($scope.modelAssign);
        if (!validationSelectAssign($scope.modelAssign).Status) {
            $scope.modelAssign.WfInstCode = para;
            $scope.modelAssign.Department = $scope.departmentAssignCode;
            $scope.modelAssign.Group = $scope.groupAssignCode;
            dataservice.assignWF($scope.modelAssign, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    dataservice.getMemberAssignWF(para, function (rs) {
                        rs = rs.data;
                        $scope.lstMemberAssign = rs;
                    })
                }
            })
        }
    }

    $scope.delete = function (userId) {
        dataservice.deleteAssignWF(para, userId, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getMemberAssignWF(para, function (rs) {
                    rs = rs.data;
                    $scope.lstMemberAssign = rs;
                })
            }
        })
    }

    $scope.deleteAssignAct = function (id) {
        dataservice.deleteAssign(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getAllMemberAssignWF(para, function (rs) {
                    rs = rs.data;
                    $scope.lstAssignWF = rs;
                })
            }
        })
    }

    //Lock activity Instance
    $scope.lockAct = function () {
        var value = false;
        if ($scope.model.IsLock) {
            value = false;
            $scope.model.IsLock = false;
        } else {
            value = true;
            $scope.model.IsLock = true;
        }
        dataservice.lockActivity($rootScope.ActInstCode, value, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                $rootScope.IsLock = value;
                setBackgroundColor(value, $rootScope.ActInstCode);

                if ($rootScope.IsLock) {
                    clearTime();
                } else {
                    if (rs.Object !== null) {
                        $rootScope.downTime(rs.Object, $rootScope.ActInstCode);
                    }
                }
            }
        });
    };

    //SendCommand
    $scope.sendCommand = function () {
        if ($scope.modelCmd.LstAct.length == 0) {
            return App.toastrError(caption.WFAI_MSG_PLS_SELECT_ACT_INST);
        }
        else if ($scope.modelCmd.CommandSymbol == "") {
            return App.toastrError("Vui lòng chọn lệnh");
        }
        dataservice.sendCommandFromLeader($scope.modelCmd, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getCommandSendByLeader(para, function (rs) {
                    rs = rs.data;
                    $scope.lstCmdResult = rs;
                })
            }
        })
    }

    $scope.deleteCmdLeader = function (id) {
        dataservice.deleteCmdLeader(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getCommandSendByLeader(para, function (rs) {
                    rs = rs.data;
                    $scope.lstCmdResult = rs;
                })
            }
        })
    }

    function setBackgroundColor(lstActInst) {

        //Get all figure in canvas
        var arrFigure = $rootScope.canvas2.getFigures();
        if (arrFigure.data.length > 0) {
            for (var i = 0; i < arrFigure.data.length; i++) {
                for (var k = 0; k < lstActInst.length; k++) {
                    if (arrFigure.data[i].id === lstActInst[k].Code) {
                        if (lstActInst[k].Command.CommandSymbol === "COMMAND_WF_INSTANCE_BACK" || lstActInst[k].Command.CommandSymbol === "COMMAND_WF_INSTANCE_STOP") {
                            arrFigure.data[i].bgColor.hashString = "#FF0000";
                            arrFigure.data[i].bgColor.alpha = 1;
                            arrFigure.data[i].bgColor.blue = 0;
                            arrFigure.data[i].bgColor.green = 0;
                            arrFigure.data[i].bgColor.red = 255;
                        }
                        if (lstActInst[k].Command.CommandSymbol === "COMMAND_WF_INSTANCE_DO" || lstActInst[k].Command.CommandSymbol === "COMMAND_WF_INSTANCE_NEXT") {
                            arrFigure.data[i].bgColor.hashString = "#008000";
                            arrFigure.data[i].bgColor.alpha = 1;
                            arrFigure.data[i].bgColor.blue = 0;
                            arrFigure.data[i].bgColor.green = 128;
                            arrFigure.data[i].bgColor.red = 0;
                        }
                    }
                }
            }
        }
    }

    function clearTime(actInstCode) {
        var allFigure = $rootScope.canvas2.getFigures();
        if (allFigure.data.length > 0) {
            for (var i = 0; i < allFigure.data.length; i++) {
                if (allFigure.data[i].id == actInstCode) {
                    var figure = allFigure.data[i].children.data[11].figure;
                    figure.attr({
                        text: ""
                    });
                    clearInterval($rootScope.downTimeIndex);
                    break;
                }
            }
        }
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        //Check null 
        if (data.WorkflowCode == "") {
            $scope.errorWorkflowCode = true;
            mess.Status = true;
        } else {
            $scope.errorWorkflowCode = false;
        }

        //if (data.ObjectType == "") {
        //    $scope.errorObjectType = true;
        //    mess.Status = true;
        //} else {
        //    $scope.errorObjectType = false;
        //}

        //if (data.ObjectInst == "") {
        //    $scope.errorObjectInst = true;
        //    mess.Status = true;
        //} else {
        //    $scope.errorObjectInst = false;
        //}

        if (data.Status == "") {
            $scope.errorStatus = true;
            mess.Status = true;
        } else {
            $scope.errorStatus = false;
        }

        return mess;
    };

    function validationSelectAssign(data) {
        var mess = { Status: false, Title: "" }
        if (data.Branch == "") {
            $scope.errorBranch = true;
            mess.Status = true;
        } else {
            $scope.errorBranch = false;
        }

        if (data.Object == "" || data.Object == null || data.Object == undefined) {
            $scope.errorObject = true;
            mess.Status = true;
        } else {
            $scope.errorObject = false;
        }

        if (data.UserId == "") {
            $scope.errorUserId = true;
            mess.Status = true;
        } else {
            $scope.errorUserId = false;
        }

        if (data.Role == "") {
            $scope.errorRole = true;
            mess.Status = true;
        } else {
            $scope.errorRole = false;
        }

        return mess;
    };

    //Show, hide header
    $scope.isShowHeader = true;
    $scope.showHeaderCard = function () {
        $scope.isShowHeader = true;
    }
    $scope.hideHeader = function () {
        $scope.isShowHeader = false;
    }

    //End show, hide header

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('detail', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, $filter, para) {
    var vm = $scope;
    $scope.model = {
        CodeSet: '',
        ValueSet: '',
        AssetCode: para.AssetCode,
        Group: para.Group,
        GroupNote: para.GroupNote
    }
    $scope.listDataType = [];
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/CommonSetting/JTableDetail/",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.SettingGroup = para.Group;
            },
            complete: function () {
                App.unblockUI("#contentMain");
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(pageLength)
        .withOption('order', [2, 'asc'])
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
            $(row).find('td:not(:has(label.mt-checkbox))').on('click', function (evt) {
                var self = $(this).parent();
                if ($(self).hasClass('selected')) {
                    $(self).removeClass('selected');
                    resetInput();
                } else {
                    $('#tblDataDetail').DataTable().$('tr.selected').removeClass('selected');
                    $(self).addClass('selected');
                    $scope.model.CodeSet = data.CodeSet;
                    $scope.model.ValueSet = data.ValueSet;
                    $scope.model.Type = data.Type;
                }
                $scope.$apply();
            });
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("SettingID").withTitle(titleHtml).notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full.SettingID] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.SettingID + ']" ng-click="toggleOne(selected)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', 'tcenter hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('_STT').withTitle('{{"WFAI_LIST_COL_INDEX" | translate}}').notSortable().withOption('sWidth', '30px').withOption('sClass', 'tcenter w50').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ValueSet').withTitle('{{"WFAI_LIST_COL_VALUE_SET" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('TypeName').withTitle('{{"WFAI_LIST_COL_DATA_TYPE" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedTime').withTitle('{{"WFAI_LIST_COL_DATE" | translate}}').renderWith(function (data, type) {
        return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy') : null;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedBy').withTitle('{{"WFAI_LIST_COL_USER_CREATED" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').notSortable().withOption('sClass', 'nowrap').withTitle('{{"COM_LIST_COL_ACTION" | translate}}').renderWith(function (data, type, full) {
        return '<button title="Xoá" ng-click="delete(' + full.SettingID + ')" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline red"><i class="fa fa-trash"></i></button>';
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
    function resetInput() {
        $scope.model.CodeSet = '';
        $scope.model.ValueSet = ''
    }
    $scope.reload = function () {
        reloadData(true);
    }
    $scope.reloadNoResetPage = function () {
        reloadData(false);
    }
    $scope.init = function () {
        dataservice.getDataTypeCommon(function (rs) {
            rs = rs.data;
            $scope.listDataType = rs;
        });
    }
    $scope.init();
    $scope.add = function () {
        if ($scope.model.ValueSet == '') {
            App.toastrError(caption.WFAI_MSG_VALUE_SET);
        } else if ($scope.model.ValueSet.length > 50) {
            App.toastrError("Vui lòng nhập giá trị cài đặt nhỏ hơn 50 ký tự");
        } else {
            dataservice.insertCommonSetting($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    reloadData(true);
                }
            })
        }
    }
    $scope.edit = function () {
        if ($scope.model.CodeSet == '') {
            App.toastrError(caption.WFAI_MSG_VALUE_SET);
        } else if ($scope.model.ValueSet.length > 50) {
            App.toastrError("Vui lòng nhập giá trị cài đặt nhỏ hơn 50 ký tự");
        } else {
            dataservice.updateCommonSetting($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
                    App.toastrSuccess(rs.Title);
                    reloadData(true);
                    resetInput();
                }
            })
        }
    }
    $scope.delete = function (id) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = caption.COM_MSG_DELETE_CONFIRM_COM;
                $scope.ok = function () {
                    dataservice.deleteCommonSetting(id, function (rs) {
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
    $scope.cancel = function () {
        //$uibModalInstance.dismiss('cancel');
        $uibModalInstance.close();
    }
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('file-version', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, $filter) {
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

    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/WorkFlowActivity/JTableFileVersion",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.ObjCode = $scope.ObjCode;
                d.ObjType = 'FILE_ACT_INST';
            },
            complete: function () {
                heightTableManual(250);
                App.unblockUI("#contentMain");
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(5)
        .withOption('order', [3, 'asc'])
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
    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("ID").withTitle(titleHtml).notSortable().renderWith(function (data, type, full, meta) {
        $scope.selected[full.ID] = false;
        return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.ID + ']" ng-click="toggleOne(selected)"/><span></span></label>';
    }).withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileName').withTitle('{{"WFAI_FILE_NAME" | translate}}').renderWith(function (data, type, full) {
        return '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o" aria-hidden="true"></i>&nbsp;' + data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Version').withTitle('{{"WFAI_LIST_COL_VERSION" | translate}}').withOption('sClass', 'w75 text-center nowrap').renderWith(function (data, type, full) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedBy').withTitle('{{"WFAI_LIST_COL_USER_EDIT" | translate}}').withOption('sClass', 'w75 text-center nowrap').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedTime').withTitle('{{"WFAI_LIST_COL_TIME_EDIT" | translate}}').withOption('sClass', 'w75 text-center nowrap').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('').withOption('sClass', 'nowrap dataTable-w80 text-center').withOption('sClass', 'w75 text-center nowrap').withTitle("{{'COM_LIST_COL_ACTION' | translate}}").notSortable().renderWith(function (data, type, full) {
        return '<a ng-click="viewFile(' + full.ID + ')" title="{{&quot; Chỉnh sửa &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-eye pt5"></i></a>';
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
    };
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
                dataserviceContract.getItemFile(id, true, mode, function (rs) {
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
            dataservice.viewFileOnline(data, function (rs) {
                window.open('/Admin/Docman#', '_blank');
            });
        }
        else if (pdf.indexOf(extension.toUpperCase()) !== -1) {
            dataservice.viewFileOnline(data, function (rs) {
                window.open('/Admin/PDF#', '_blank');
            });
        }
        else if (excel.indexOf(extension.toUpperCase()) !== -1) {
            dataservice.viewFileOnline(data, function (rs) {
                window.open('/Admin/Excel#', '_blank');
            });
        }
        else {
            window.open(url, '_blank');
        }
    };
});

app.controller('showLog', function ($scope, $rootScope, $compile, $uibModal, $location, $filter, $uibModalInstance, dataservice, $timeout, para) {
    //var data = JSON.parse(para);
    var data = para;
    $scope.obj = { data: data, options: { mode: 'code' } };
    $scope.onLoad = function (instance) {
        instance.expandAll();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    setTimeout(function () {
        setModalMaxHeight('.modal');
        setModalDraggable('.modal-dialog');
    }, 1);
});

app.controller('log-user-sign', function ($scope, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModal, $uibModalInstance, dataservice, para) {
    $scope.initload = function () {
        dataservice.getLogSignFile(para.FileCode, para.ActInstCode, function (rs) {
            rs = rs.data;
            $scope.lstLogSign = rs;
        });
    }
    $scope.initload();
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});

app.controller('share-object', function ($scope, $rootScope, $uibModal, $cookies, $compile, $uibModalInstance, dataservice, para) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
    $scope.model = {
        ActShare: []
    };

    $scope.lstObj = para.LstObj;

    $scope.initData = function () {
        dataservice.getInstance(para.WfInstCode, function (rs) {
            rs = rs.data;
            $scope.lstActInst = rs;
        })
    };

    $scope.initData();

    $scope.shareObj = function () {

        if ($scope.model.ActShare.length === 0) {
            return App.toastrError(caption.WFAI_MSG_PLS_SELECT_ACT_INST);
        }

        var data = {
            WfInstCode: para.WfInstCode,
            LstAct: $scope.model.ActShare,
            LstObj: $scope.lstObj
        };

        dataservice.shareObject(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
            }
        })
    }
});

app.controller('view-share-object', function ($scope, $rootScope, $uibModal, $cookies, $compile, $uibModalInstance, dataservice, para) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
    $scope.model = {
        ActShare: []
    };

    $scope.lstObj = para.LstObj

    $scope.initData = function () {
        dataservice.getInstance(para.WfInstCode, function (rs) {
            rs = rs.data;
            $scope.lstActInst = rs;
            dataservice.getActInstByObj(para.ObjCode, para.Type, function (rs) {
                rs = rs.data;
                $scope.model.ActShare = rs;
            });
        })
    };

    $scope.initData();

    $scope.shareObj = function () {
        if ($scope.model.ActShare.length === 0) {
            return App.toastrError(caption.WFAI_MSG_PLS_SELECT_ACT_INST);
        }
        var data = {
            WfInstCode: para.WfInstCode,
            LstAct: $scope.model.ActShare,
            LstObj: $scope.lstObj
        };
        dataservice.shareObject(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
            }
        })
    }
});

app.controller('fileActivity', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, $filter, $translate, dataserviceSupplier, Upload, $window) {
    var vm = $scope;
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;

    $scope.model = {
        FromDate: '',
        ToDate: '',
        SignatureRequire: false
    }
    $scope.modelFile = {
        ActShare: []
    }

    //progress obj = { name: 'file X', uuid: '', progress: '50%', style: { 'width': '50%' } }
    $rootScope.progress = [];
    $scope.progressModal = {};
    $scope.isProgressModelOpen = false;
    $scope.lstAttach = [];
    $scope.$watch('$rootScope.ActInstCode', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            // Thực hiện các thao tác khi giá trị thay đổi
            $rootScope.reloadFile()
        }
    });

    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-change="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/WorkflowActivity/JTableFile",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#tblDataWorkflowFile",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.ActInstCode = $rootScope.ActInstCode;
                d.FromDate = $scope.model.FromDate;
                d.ToDate = $scope.model.ToDate;
            },
            complete: function () {
                App.unblockUI("#tblDataWorkflowFile");
                heightTableManual(250, "#tblDataWorkflowFile");
                $scope.selectAll = false;
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(5)
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
        .withOption('rowCallback', function (row, data) {
            if (!$scope.selectAll) {
                for (var i = 0; i < $scope.lstAttach.length; i++) {
                    if ($scope.lstAttach[i].Id === data.Id) {
                        $(row).find('input[type="checkbox"]').prop('checked', true);
                        $scope.selected[data.Id] = true;
                    }
                }
            }
        })
        .withOption('createdRow', function (row, data, dataIndex) {
            const contextScope = $scope.$new(true);
            contextScope.data = data;
            contextScope.contextMenu = $scope.contextMenu;
            $compile(angular.element(row))($scope);
            $compile(angular.element(row).attr('context-menu', 'contextMenu'))(contextScope);
        });
    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle(titleHtml).notSortable().renderWith(function (data, type, full, meta) {
        $scope.selected[data] = false;
        var dataRs = '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.Id + ']" ng-change="toggleOne(selected)"/><span></span></label>';
        return dataRs;
    }).withOption('sClass', ''));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileName').withTitle($translate("WFAI_LIST_COL_TITLE")).renderWith(function (data, type, full) {
        var excel = ['.XLSM', '.XLSX', '.XLS'];
        var document = ['.TXT'];
        var word = ['.DOCX', '.DOC'];
        var pdf = ['.PDF'];
        var powerPoint = ['.PPS', '.PPTX', '.PPT'];
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        var icon = "";
        var signText = "";
        var showSign = "";
        if (excel.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(106,170,89);font-size: 15px;" class="fa fa-file-excel-o" aria-hidden="true"></i>&nbsp;';
        } else if (word.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o" aria-hidden="true"></i>&nbsp;';
        } else if (document.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(0,0,0);font-size: 15px;" class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;';
        } else if (pdf.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;';
        } else if (powerPoint.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-powerpoint-o" aria-hidden="true"></i>&nbsp;';
        } else if (image.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(42,42,42);font-size: 15px;" class="fa fa-picture-o" aria-hidden="true"></i>&nbsp;';
        } else {
            icon = '<i style="color: rgb(42,42,42);font-size: 15px;" class="fas fa-align-justify" aria-hidden="true"></i>&nbsp;';
        }
        if (full.SignatureRequire == 'True' && (full.FileTypePhysic == '.docx' || full.FileTypePhysic == '.doc')) {
            signText = '<br /><a class="text-success text-underline fs14 pt5" ng-click="viewFile(\'' + full.FileCode + '\', \'' + full.Url + '\', \'' + true + '\')" >Ký điện tử</a>'
                + ' -- <a class="text-green text-underline fs14 pt5" ng-click="openLog(\'' + full.FileCode + '\')">Log thay đổi</a>';
        }
        if (full.SignatureJson != "") {
            var logSign = JSON.parse(full.SignatureJson);
            if (logSign.length > 0) {
                showSign = '<br /><span class="text-success fs13">Đã ký, lúc ' + $filter('date')(logSign[logSign.length - 1].SignTime, 'HH:mm dd/MM/yyyy') + '</span>'
                    + ' -- <a ng-click="showLogSign(\'' + full.FileCode + '\')" class="text-underline fs13">Log ký điện tử</a>';
            }
        }
        return icon + data + signText + showSign;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ReposName').withTitle($translate("WFAI_LBL_CAT")).renderWith(function (data, type, full) {
        return '<i class="fa fa-folder-open icon-state-warning"></i>&nbsp' + data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileID').withOption('sClass', 'nowrap dataTable-w80 text-center').withTitle($translate("WFAI_LIST_COL_VIEW_CONTENT")).notSortable().renderWith(function (data, type, full) {
        var excel = ['.XLSM', '.XLSX', '.XLS'];
        var document = ['.TXT'];
        var word = ['.DOCX', '.DOC'];
        var pdf = ['.PDF'];
        var powerPoint = ['.PPS', '.PPTX', '.PPT'];
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];

        var mode = 2;
        if (full.ListUserShare != "" && full.ListUserShare != null && full.ListUserShare != undefined) {
            var lstShare = JSON.parse(full.ListUserShare);
            if (lstShare.length > 0) {
                for (var i = 0; i < lstShare.length; i++) {
                    if (lstShare[i].Code == userName) {
                        if (lstShare[i].Permission != null) {
                            if (!lstShare[i].Permission.Write) {
                                mode = 0;
                                break;
                            }
                        }
                    }
                }
            }
        }

        if (excel.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            typefile = 'excel';
            return '<a ng-click="viewExcel(' + full.Id + ', ' + mode + '' + ')" title="{{&quot; Chỉnh sửa &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit pt5"></i></a>';
        } else if (word.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            typefile = 'Syncfusion';
            return '<a ng-click="viewWord(' + full.Id + ', ' + mode + '' + ')" title="{{&quot; Chỉnh sửa &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit pt5"></i></a>';
        } else if (pdf.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            typefile = 'pdf';
            return '<a ng-click="viewPDF(' + full.Id + ', ' + mode + '' + ')" title="{{&quot; Chỉnh sửa &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit pt5"></i></a>';
        } else if (document.indexOf(full.FileTypePhysic.toUpperCase()) !== -1 || image.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            return '<a ng-click="view(' + full.Id + ')" title="{{&quot; Chỉnh sửa &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit pt5"></i></a>';
        } else {
            return '<a ng-click="getObjectFile(0)" title="{{&quot; Chỉnh sửa &quot; | translate}}" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit pt5"></i></a>';
        }
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('').withTitle($translate('WFAI_TAB_DES')).notSortable().renderWith(function (data, type, full) {
        return '<button title="Mô tả" ng-click="extension(' + full.FileID + ')" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-info-circle"></i></button>';
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedTime').withTitle($translate("WFAI_LIST_COL_DATE")).renderWith(function (data, type) {
        return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy') : null;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').withTitle($translate('COM_LIST_COL_ACTION')).withOption('sClass', 'w75 nowrap').renderWith(function (data, type, full) {
        if (full.TypeFile == "SHARE") {
            return '<a ng-click="dowload(\'' + full.FileCode + '\')" target="_blank" style="width: 25px; height: 25px; padding: 0px" title="Tải xuống - ' + full.FileName + '" class="btn btn-icon-only btn-circle btn-outline green " download><i class="fa fa-download pt5"></i></a>';
        } else {
            return '<a ng-click="share(' + full.Id + ')" style="width: 25px; height: 25px; padding: 0px" title="Chia sẻ - ' + full.FileName + '" class="btn btn-icon-only btn-circle btn-outline blue "><i class="fa fa-share-alt pt5"></i></a>' +
                '<a ng-click="dowload(\'' + full.FileCode + '\')" style="width: 25px; height: 25px; padding: 0px" title="Tải xuống - ' + full.FileName + '" class="btn btn-icon-only btn-circle btn-outline green"><i class="fa fa-download pt5"></i></a>' +
                '<button title="Xoá" ng-click="delete(' + full.Id + ')" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline red"><i class="fa fa-trash"></i></button>';
        }
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
        var listdata = $('#tblDataWorkflowFile').DataTable().data();
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                if (!selectedItems[id]) {
                    for (var i = 0; i < $scope.lstAttach.length; i++) {
                        if ($scope.lstAttach[i].Id === id) {
                            $scope.lstAttach.splice($scope.lstAttach[i], 1);
                        }
                    }
                } else {
                    for (var i = 0; i < listdata.length; i++) {
                        if ($scope.selected[listdata[i].Id]) {
                            var obj = {
                                Id: listdata[i].Id,
                                FileCode: listdata[i].FileCode,
                                FileName: listdata[i].FileName,
                                Type: "",
                                FilePath: "",
                                SignatureRequire: listdata[i].SignatureRequire,
                            };

                            var check = $scope.lstAttach.find(function (element) {
                                if (element.Id === obj.Id) return true;
                            });

                            if (check == undefined || check == null || check == '') {
                                $scope.lstAttach.push(obj);
                            }
                        }
                    }
                }
            }
        }
    }

    function toggleOne(selectedItems) {
        var listdata = $('#tblDataWorkflowFile').DataTable().data();
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                if (!selectedItems[id]) {
                    vm.selectAll = false;
                    for (var i = 0; i < $scope.lstAttach.length; i++) {
                        if ($scope.lstAttach[i].Id === id) {
                            $scope.lstAttach.splice($scope.lstAttach[i], 1);
                        }
                    }
                } else {
                    for (var i = 0; i < listdata.length; i++) {
                        if ($scope.selected[listdata[i].Id]) {
                            var obj = {
                                Id: listdata[i].Id,
                                FileCode: listdata[i].FileCode,
                                FileName: listdata[i].FileName,
                                Type: "",
                                FilePath: "",
                                SignatureRequire: listdata[i].SignatureRequire,
                            };

                            var check = $scope.lstAttach.find(function (element) {
                                if (element.Id === obj.Id) return true;
                            });

                            if (check == undefined || check == null || check == '') {
                                $scope.lstAttach.push(obj);
                            }
                        }
                    }
                }
            }
        }

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

    $rootScope.reloadFile = function () {

        $scope.reload();
    }

    $scope.search = function () {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderCustomer + '/file_search.html',
            windowClass: 'modal-file',
            backdrop: 'static',
            controller: function ($scope, $uibModalInstance) {
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: '30',
        });
        modalInstance.result.then(function (d) {
            reloadData()
        }, function () { });
    }

    $scope.init = function () {
        //File new design
        dataservice.getActInstTo($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $scope.shareFileTo = rs;
        })
    }

    $scope.init();

    $scope.add = function () {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if ($scope.file == '' || $scope.file == undefined) {
            App.toastrError(caption.COM_MSG_CHOSE_FILE);
        }
        else {
            var fileSize = $scope.file.size;
            var extension = $scope.file.name.split('.').pop();
            var word = ['DOCX', 'DOC'];
            if ($scope.model.SignatureRequire && word.indexOf(extension.toUpperCase()) !== -1 && fileSize > 5242880) {
                return App.toastrError("Vui lòng chọn tệp tin ký có kích thước nhỏ hơn 5MB");
            }

            var data = new FormData();
            data.append("FileUpload", $scope.file);
            data.append("ActInstCode", $rootScope.ActInstCode);
            data.append("IsMore", false);
            dataservice.insertActInstFile(data, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    $scope.file = null;
                    $('.inputFile').val('');
                    $rootScope.reloadFile();
                    App.toastrSuccess(result.Title);
                    defaultShareFile(result.ID);
                    AddToFileInst(result.ID);
                }
            });
        }
    }

    $scope.edit = function (fileName, id) {
        dataservice.getActCatFile(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: ctxfolder + '/file_edit.html',
                    controller: 'fileEditActInst',
                    windowClass: "modal-file",
                    backdrop: 'static',
                    size: '60',
                    resolve: {
                        para: function () {
                            return {
                                data: rs.Object,
                                FileName: fileName
                            };
                        }
                    }
                });
                modalInstance.result.then(function (d) {
                    reloadData()
                }, function () { });
            }
        })
    }

    $scope.delete = function (id) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }

        var userModel = {};
        var listdata = $('#tblDataWorkflowFile').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }

        if (userModel.ListUserShare != "" && userModel.ListUserShare != null && userModel.ListUserShare != undefined) {
            var lstShare = JSON.parse(userModel.ListUserShare);
            var isDelete = true;
            if (lstShare.length > 0) {
                for (var i = 0; i < lstShare.length; i++) {
                    if (lstShare[i].Code == userName) {
                        if (!lstShare[i].Permission.Delete) {
                            isDelete = false;
                            break;
                        }
                    }
                }
                if (!isDelete) {
                    return App.toastrError("Bạn không có quyền xóa tệp tin");
                }
            }
        }

        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = caption.COM_MSG_DELETE_CONFIRM_COM;
                $scope.ok = function () {
                    dataservice.deleteActInstFile(id, function (result) {
                        result = result.data;
                        if (result.Error) {
                            App.toastrError(result.Title);
                        } else {
                            App.toastrSuccess(result.Title);
                            $uibModalInstance.close();
                            $rootScope.reloadFile();
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
            $scope.reload();
        }, function () {
        });
    }

    $scope.dowload = function (fileCode) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }

        var userModel = {};
        var listdata = $('#tblDataWorkflowFile').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].FileCode == fileCode) {
                userModel = listdata[i];
                break;
            }
        }

        if (userModel.ListUserShare != "" && userModel.ListUserShare != null && userModel.ListUserShare != undefined) {
            var lstShare = JSON.parse(userModel.ListUserShare);
            var isDownload = true;
            if (lstShare.length > 0) {
                for (var i = 0; i < lstShare.length; i++) {
                    if (lstShare[i].Code == userName) {
                        if (!lstShare[i].Permission.Write && !lstShare[i].Permission.Read) {
                            isDownload = false;
                            break;
                        }
                    }
                }
                if (!isDownload) {
                    return App.toastrError("Bạn không có quyền tải tệp tin");
                }
            }
        }

        location.href = "/Admin/EDMSRepository/DownloadFile?fileCode="
            + fileCode;
    }

    $scope.extend = function () {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        //dataservice.getSuggestionsActInstFile($rootScope.ActInstCode, function (rs) {
        //    rs = rs.data;
        //    var data = rs !== '' ? rs : { CatCode: '', ObjectCode: $rootScope.ActInstCode, ObjectType: 'ACT_INST' };
        //    var modalInstance = $uibModal.open({
        //        templateUrl: ctxfolderRepository + '/addFile.html',
        //        controller: 'addFile',
        //        windowClass: 'modal-file',
        //        backdrop: 'static',
        //        size: '60',
        //        resolve: {
        //            para: function () {
        //                return data;
        //            }
        //        }
        //    });
        //    modalInstance.result.then(function (d) {
        //        
        //        AddToFileInst(d);
        //        defaultShareFile(d);
        //    }, function () { });
        //})

        dataserviceSupplier.getDefaultRepo($rootScope.ActInstCode, 'ACT_INST', function (rs) {
            rs = rs.data;
            var data = rs !== null ? rs : { CatCode: '', ObjectCode: $rootScope.ActInstCode, ObjectType: 'ACT_INST' };
            var modalInstance = $uibModal.open({
                templateUrl: ctxfolderSupplier + '/addFile.html',
                controller: 'setupRepoDefault',
                windowClass: 'modal-file',
                backdrop: 'static',
                size: '60',
                resolve: {
                    para: function () {
                        return data;
                    }
                }
            });
            modalInstance.result.then(function (d) {
                reloadData();
            }, function () { });
        })
    }

    $scope.loadFile = function (event) {
        $scope.file = event.target.files[0];
    }

    $scope.getObjectFile = function (id) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            dataservice.getItemFile(id, true, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                    return null;
                }
            });
        }
    };

    $scope.viewExcel = function (id, mode) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var userModel = {};
        var listdata = $('#tblDataWorkflowFile').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }

        if (userModel.ListUserShare != "" && userModel.ListUserShare != null && userModel.ListUserShare != undefined) {
            var lstShare = JSON.parse(userModel.ListUserShare);
            var isView = true;
            if (lstShare.length > 0) {
                for (var i = 0; i < lstShare.length; i++) {
                    if (lstShare[i].Code == userName) {
                        if (!lstShare[i].Permission.Write && !lstShare[i].Permission.Read) {
                            isView = false;
                            break;
                        }
                    }
                }
                if (!isView) {
                    return App.toastrError("Bạn không có quyền xem tệp tin");
                }
            }
        }

        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            if (userModel.SizeOfFile < 20971520) {
                dataservice.getItemFile(id, true, mode, function (rs) {
                    rs = rs.data;
                    if (rs.Error) {
                        if (rs.ID === -1) {
                            App.toastrError(rs.Title);
                            var object = rs.Object;
                            if (object != null && object.Type == "DRIVER") {
                                console.log(object.Link);
                                $window.open(object.Link, '_blank');
                            } else {
                                setTimeout(function () {
                                    window.open('/Admin/Excel#', '_blank');
                                }, 2000);
                            }
                        } else {
                            App.toastrError(rs.Title);
                        }
                        return null;
                    } else {
                        var object = rs.Object;
                        if (object != null && object.Type == "DRIVER") {
                            $window.open(object.Link, '_blank');
                        } else {
                            window.open('/Admin/Excel#', '_blank');
                        }
                    }
                });
            } else {
                App.toastrError("Vui lòng chọn tệp tin có kích thước nhỏ hơn 20MB");
            }

        }
    };

    $scope.viewWord = function (id, mode) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var userModel = {};
        var listdata = $('#tblDataWorkflowFile').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }

        if (userModel.ListUserShare != "" && userModel.ListUserShare != null && userModel.ListUserShare != undefined) {
            var lstShare = JSON.parse(userModel.ListUserShare);
            var isView = true;
            if (lstShare.length > 0) {
                for (var i = 0; i < lstShare.length; i++) {
                    if (lstShare[i].Code == userName) {
                        if (!lstShare[i].Permission.Write && !lstShare[i].Permission.Read) {
                            isView = false;
                            break;
                        }
                    }
                }
                if (!isView) {
                    return App.toastrError("Bạn không có quyền xem tệp tin");
                }
            }
        }

        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            if (userModel.SizeOfFile < 20971520) {
                dataservice.getItemFile(id, true, mode, function (rs) {
                    rs = rs.data;
                    if (rs.Error) {
                        if (rs.ID === -1) {
                            App.toastrError(rs.Title);
                            var object = rs.Object;
                            if (object != null && object.Type == "DRIVER") {
                                console.log(object.Link);
                                $window.open(object.Link, '_blank');
                            } else {
                                setTimeout(function () {
                                    window.open('/Admin/Docman#', '_blank');
                                }, 2000);
                            }
                        } else {
                            App.toastrError(rs.Title);
                        }
                        return null;
                    } else {
                        var object = rs.Object;
                        if (object != null && object.Type == "DRIVER") {
                            $window.open(object.Link, '_blank');
                        } else {
                            window.open('/Admin/Docman#', '_blank');
                        }
                    }
                });
            } else {
                App.toastrError("Vui lòng chọn tệp tin có kích thước nhỏ hơn 20MB");
            }
        }
    };

    $scope.viewPDF = function (id, mode) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var userModel = {};
        var listdata = $('#tblDataWorkflowFile').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }

        if (userModel.ListUserShare != "" && userModel.ListUserShare != null && userModel.ListUserShare != undefined) {
            var lstShare = JSON.parse(userModel.ListUserShare);
            var isView = true;
            if (lstShare.length > 0) {
                for (var i = 0; i < lstShare.length; i++) {
                    if (lstShare[i].Code == userName) {
                        if (!lstShare[i].Permission.Write && !lstShare[i].Permission.Read) {
                            isView = false;
                            break;
                        }
                    }
                }
                if (!isView) {
                    return App.toastrError("Bạn không có quyền xem tệp tin");
                }
            }
        }

        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            if (userModel.SizeOfFile < 20971520) {
                dataservice.getItemFile(id, true, mode, function (rs) {
                    rs = rs.data;
                    if (rs.Error) {
                        if (rs.ID === -1) {
                            App.toastrError(rs.Title);
                            var object = rs.Object;
                            if (object != null && object.Type == "DRIVER") {
                                console.log(object.Link);
                                $window.open(object.Link, '_blank');
                            } else {
                                setTimeout(function () {
                                    window.open('/Admin/PDF#', '_blank');
                                }, 2000);
                            }
                        } else {
                            App.toastrError(rs.Title);
                        }
                        return null;
                    } else {
                        var object = rs.Object;
                        if (object != null && object.Type == "DRIVER") {
                            $window.open(object.Link, '_blank');
                        } else {
                            window.open('/Admin/PDF#', '_blank');
                        }
                    }
                });
            } else {
                App.toastrError("Vui lòng chọn tệp tin có kích thước nhỏ hơn 20MB");
            }
        }
    };

    $scope.view = function (id) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var isImage = false;
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        var userModel = {};
        var listdata = $('#tblDataWorkflowFile').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
            }
        }


        if (userModel.ListUserShare != "" && userModel.ListUserShare != null && userModel.ListUserShare != undefined) {
            var lstShare = JSON.parse(userModel.ListUserShare);
            var isView = true;
            if (lstShare.length > 0) {
                for (var i = 0; i < lstShare.length; i++) {
                    if (lstShare[i].Code == userName) {
                        if (!lstShare[i].Permission.Write && !lstShare[i].Permission.Read) {
                            isView = false;
                            break;
                        }
                    }
                }
                if (!isView) {
                    return App.toastrError("Bạn không có quyền xem tệp tin");
                }
            }
        }


        if (image.indexOf(userModel.FileTypePhysic.toUpperCase()) !== -1) {
            isImage = true;
        }
        if (userModel.CloudFileId != null && userModel.CloudFileId != "") {
            //SHOW LÊN MÀN HÌNH LUÔN
            // window.open(" https://drive.google.com/file/d/" + userModel.CloudFileId + "/view", "_blank");
            //$scope.openViewer("https://drive.google.com/file/d/"+userModel.CloudFileId + "/view");3
            dataservice.createTempFile(id, false, "", function (rs) {
                rs = rs.data;
                rs.Object = encodeURI(rs.Object);
                if (rs.Error == false) {
                    if (isImage == false) {
                        window.open(rs.Object, '_blank')
                        //$scope.openViewer("https://docs.google.com/gview?url=" + window.location.origin + '/' + rs.Object + '&embedded=true', isImage);
                    } else
                        $scope.openViewer(rs.Object, isImage);
                    //window.open('https://docs.google.com/gview?url=' + window.location.origin + '/' + rs.Object + '&embedded=true', '_blank');
                }
                else {

                }
            });
        }
        else {
            dataservice.createTempFile(id, false, "", function (rs) {
                rs = rs.data;
                rs.Object = encodeURI(rs.Object);
                if (rs.Error == false) {
                    if (isImage == false) {
                        var url = window.location.origin + '/' + rs.Object;
                        window.open(url, '_blank')
                        //$scope.openViewer("https://docs.google.com/gview?url=" + window.location.origin + '/' + rs.Object + '&embedded=true', isImage);
                    }
                    else
                        $scope.openViewer(rs.Object, isImage);
                    //window.open('https://docs.google.com/gview?url=' + window.location.origin + '/' + rs.Object + '&embedded=true', '_blank');
                }
                else {

                }
            });
        }
    }

    $scope.openViewer = function (url, isImage) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var data = {};
        data.url = url;
        data.isImage = isImage;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/viewer.html',
            controller: 'viewer',
            backdrop: 'false',
            size: '60',
            resolve: {
                para: function () {
                    return data;
                }
            }
        });
    }

    $scope.extension = function (item) {

        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderRepository + '/extension.html',
            controller: 'extension',
            backdrop: 'static',
            size: '40',
            resolve: {
                para: function () {
                    return {
                        Type: 'LIST',
                        Object: item
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {

        }, function () {
        });
    };

    $scope.addActShareOfFile = function () {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        if ($scope.selected.length == 0) {
            return App.toastrError(caption.WFAI_MSG_PLS_SELECT_FILE);
        }
        if ($scope.modelFile.ActShare.length == 0) {
            return App.toastrError(caption.WFAI_MSG_PLS_SELECT_ACT_INST);
        }
        $scope.lstAttach = [];
        if ($scope.selected.length > 0) {
            var listdata = $('#tblDataWorkflowFile').DataTable().data();
            for (var i = 0; i < listdata.length; i++) {
                if ($scope.selected[listdata[i].Id]) {
                    var obj = {
                        FileCode: listdata[i].FileCode,
                        FileName: listdata[i].FileName,
                        Type: "",
                        FilePath: "",
                        SignatureRequire: listdata[i].SignatureRequire,
                    };
                    $scope.lstAttach.push(obj);
                }
            }
        }

        var data = {
            ActInstCode: $rootScope.ActInstCode,
            LstFile: $scope.lstAttach,
            LstActTo: $scope.modelFile.ActShare
        }
        dataservice.addActShareOfFile(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
            }
        })
    }

    $scope.share = function (id) {
        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/shareFile.html',
            controller: 'shareFileAct',
            backdrop: 'static',
            size: '40',
            resolve: {
                para: function () {
                    return {
                        Id: id,
                        ActInstCode: $rootScope.ActInstCode
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
            $rootScope.reloadFile();
        }, function () {
        });
    };

    $scope.openLog = function (fileCode) {
        var objCode = $rootScope.ActInstCode;
        var objType = 'FILE_ACT_INST';
        dataservice.getLogContent(fileCode, objCode, objType, function (rs) {
            rs = rs.data;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: ctxfolder + '/showLog.html',
                controller: 'showLog',
                backdrop: 'static',
                size: '70',
                resolve: {
                    para: function () {
                        return rs;
                    }
                }
            });
            modalInstance.result.then(function (d) {
            }, function () { });
        });
    }

    $scope.viewFile = function (fileCode, url, isSign) {

        if ($rootScope.IsLock) {
            return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
        }
        if (!$rootScope.isAccepted) {
            return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
        }
        var data = {
            ActInstCode: $rootScope.ActInstCode,
            FileCode: fileCode,
            Url: url,
            IsSign: isSign,
            Mode: 2
        };

        var extension = url.substr(url.lastIndexOf('.') + 1);
        var word = ['DOCX', 'DOC'];
        var pdf = ['PDF'];
        var excel = ['XLS', 'XLSX'];
        if (word.indexOf(extension.toUpperCase()) !== -1) {
            if (isSign) {
                dataservice.isFileSign($rootScope.ActInstCode, function (rs) {
                    rs = rs.data;
                    if (rs) {
                        return App.toastrError(caption.WFAI_MSG_SIGNED_FILE);
                    }
                    var modalInstance = $uibModal.open({
                        templateUrl: ctxfolderMessage + '/messageConfirmSign.html',
                        windowClass: "message-center",
                        controller: function ($scope, $uibModalInstance) {
                            $scope.message = caption.WFAI_MSG_U_SURE_SIGN;
                            $scope.ok = function () {
                                dataservice.viewFileOnline(data, function (rs) {
                                    rs = rs.data;
                                    if (rs.Error) {
                                        App.toastrError(rs.Title);
                                        $uibModalInstance.close('cancel');
                                    } else {
                                        window.open('/Admin/Docman#', '_blank');
                                        $uibModalInstance.close('cancel');
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
                        $scope.reload();
                    }, function () {
                    });
                })
            }
            else {
                dataservice.viewFileOnline(data, function (rs) {
                    window.open('/Admin/Docman#', '_blank');
                });
            }
        }
        else if (pdf.indexOf(extension.toUpperCase()) !== -1) {
            dataservice.viewFileOnline(data, function (rs) {
                window.open('/Admin/PDF#', '_blank');
            });
        }
        else if (excel.indexOf(extension.toUpperCase()) !== -1) {
            dataservice.viewFileOnline(data, function (rs) {
                window.open('/Admin/Excel#', '_blank');
            });
        }
        else {
            window.open(url, '_blank');
        }
    }

    $scope.showLogSign = function (fileCode) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/log-user-sign.html',
            controller: 'log-user-sign',
            backdrop: 'static',
            size: '30',
            resolve: {
                para: function () {
                    return {
                        FileCode: fileCode,
                        ActInstCode: $rootScope.ActInstCode
                    }
                }
            }
        });
        modalInstance.result.then(function (d) {
        }, function () {
        });
    }

    function loadDate() {
        $("#FromTo").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
            $('#DateTo').datepicker('setStartDate', maxDate);
        });
        $("#DateTo").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
            $('#FromTo').datepicker('setEndDate', maxDate);
        });
        $('.end-date').click(function () {
            $('#FromTo').datepicker('setEndDate', null);
        });
        $('.start-date').click(function () {
            $('#DateTo').datepicker('setStartDate', null);
        });
    }

    $scope.modelShare = {
        Id: '',
        LstShare: ''
    };

    $scope.permission = {
        Read: true,
        Write: true,
        Delete: true
    };

    function defaultShareFile(id) {
        dataservice.getListUserShareAct($rootScope.ActInstCode, function (rs) {
            rs = rs.data;
            $scope.listUser = rs;
            $scope.lstUserShare = [];
            if ($scope.listUser.length > 0) {
                for (var i = 0; i < $scope.listUser.length; i++) {
                    var item = {
                        Code: $scope.listUser[i].Code,
                        Name: $scope.listUser[i].Name,
                        DepartmentName: $scope.listUser[i].DepartmentName,
                        Permission: $scope.permission
                    }
                    $scope.lstUserShare.push(item);
                }
                $scope.modelShare.Id = id;
                $scope.modelShare.LstShare = JSON.stringify($scope.lstUserShare);
                dataservice.autoShareFilePermission($scope.modelShare, function (rs) { })
            }
        });
    }

    function AddToFileInst(id) {
        dataservice.addFileActInst(id, $rootScope.ActInstCode, $scope.model.SignatureRequire, function (rs) {
            rs = rs.data;
            $scope.reload();
        })
    }

    function create_UUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    $scope.uploadFile = function (files) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if ($rootScope.IsLock) {
                return App.toastrError(caption.WFAI_MSG_ACT_IS_LOCKED);
            }
            if (!$rootScope.isAccepted) {
                return App.toastrError(caption.WFAI_MSG_PLS_ACCEPT_ACT);
            }
            if (file == '' || file == undefined) {
                App.toastrError(caption.COM_MSG_CHOSE_FILE);
            }
            else {
                var fileSize = file.size;
                var extension = file.name.split('.').pop();
                var word = ['DOCX', 'DOC'];
                if ($scope.model.SignatureRequire && word.indexOf(extension.toUpperCase()) !== -1 && fileSize > 5242880) {
                    return App.toastrError("Vui lòng chọn tệp tin ký có kích thước nhỏ hơn 5MB");
                }

                var data = {};
                data.FileUpload = file;
                data.ActInstCode = $rootScope.ActInstCode;
                data.IsMore = false;
                data.uuid = create_UUID();

                if (!$scope.isProgressModelOpen) {
                    $scope.viewProgress();
                }
                $rootScope.progress.push({ name: data.FileUpload.name, uuid: data.uuid, progress: '0%', style: { 'width': '0%' } });

                Upload.upload({
                    url: '/Admin/WorkflowActivity/InsertActInstFile',
                    data: data
                }).then(function (result) {
                    result = result.data;
                    if (result.Error) {
                        App.toastrError(result.Title);
                    } else {
                        App.toastrSuccess(result.Title);
                        $rootScope.reloadFile();
                        defaultShareFile(result.ID);
                        AddToFileInst(result.ID);
                    }
                    var index = $rootScope.progress.findIndex(x => x.uuid == result.Object);
                    $rootScope.progress.splice(index, 1);
                    if ($rootScope.progress.length == 0) {
                        $scope.progressModal.close("End uploading");
                        $scope.isProgressModelOpen = false;
                    }
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    var data = evt.config.data;
                    var index = $rootScope.progress.findIndex(x => x.uuid == data.uuid);
                    $rootScope.progress[index].progress = progressPercentage + '% ';
                    $rootScope.progress[index].style.width = progressPercentage + '% ';
                });
            }
        }
    }

    $scope.viewProgress = function () {
        $scope.progressModal = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageProgressUpload.html',
            backdrop: false,
            windowClass: "progress-modal",
            appendTo: angular.element(document).find('#dropzone'),
            controller: function ($scope, $uibModalInstance) {
                $scope.cancelUpload = function () {

                };

                //$scope.cancel = function () {
                //    $uibModalInstance.dismiss('cancel');
                //};
            },
            size: '100',
        });
        $scope.progressModal.opened.then(function (d) {
            $scope.isProgressModelOpen = true;
        }, function () {
        });
        $scope.progressModal.result.then(function (d) {
        }, function () {
        });
    }

    setTimeout(function () {
        loadDate();
    }, 200);
});

app.controller('fileEditActInst', function ($scope, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModal, $uibModalInstance, dataservice, para) {
    $scope.treeDataCategory = [];
    $scope.catCode = para.data.CateRepoSettingCode;
    $scope.model = {
        NumberDocument: '',
        Tags: '',
        Desc: '',
        FileName: ''
    };
    var vm = $scope;
    vm.dt = {};
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/EDMSRepository/JtableFolderSettingWithCategory",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.CatCode = $scope.catCode;
                $scope.selected = [];
            },
            complete: function () {
                App.unblockUI("#contentMain");
                $(".dataTables_scrollBody").addClass('scroller-sm-fade');
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(30)
        .withOption('order', [0, 'desc'])
        .withOption('serverSide', true)
        .withOption('scrollY', "340px")
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
            if (para.Path != null && para.Path != "") {
                if (para.Path == data.Path) {
                    angular.element(row).addClass('selected');
                }
            } else {
                if (para.FolderId == data.FolderId) {
                    angular.element(row).addClass('selected');
                }
            }
            $(row).find('td:not(:has(label.mt-checkbox))').on('click', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {
                } else {
                    var self = $(this).parent();
                    if ($(self).hasClass('selected')) {
                        $(self).removeClass('selected');
                        $scope.selected[data.Id] = false;
                    } else {
                        $('#tblDataFolder').DataTable().$('tr.selected').removeClass('selected');
                        $scope.selected.forEach(function (obj, index) {
                            if ($scope.selected[index])
                                $scope.selected[index] = false;
                        });
                        $(self).addClass('selected');
                        $scope.selected[data.Id] = true;
                    }
                }
                $scope.$apply();
            });
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle('').notSortable()
        .renderWith(function (data, type, full, meta) {
            if (para.Path != null && para.Path != "") {
                if (para.Path == full.Path) {
                    $scope.selected[full.Id] = true;
                } else {
                    $scope.selected[full.Id] = false;
                }
            }
            else {
                if (para.FolderId == full.FolderId) {
                    $scope.selected[full.Id] = true;
                } else {
                    $scope.selected[full.Id] = false;
                }
            }
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.Id + ']" ng-click="toggleOne(selected,$event,' + full.Id + ')"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', ''));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FolderName').withOption('sClass', '').withTitle('{{"WFAI_LBL_CAT" | translate}}').withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
        return '<i class="jstree-icon jstree-themeicon fa fa-folder icon-state-warning jstree-themeicon-custom" aria-hidden="true"></i>&nbsp;' + data;
    }));
    vm.reloadData = reloadData;
    vm.dt.dtInstance = {};
    function reloadData(resetPaging) {
        vm.dt.dtInstance.reloadData(callback, resetPaging);
    }
    function callback(json) {

    }
    function toggleAll(selectAll, selectedItems) {
        if (selectAll)
            $('#tblDataDetailRepository').DataTable().$('tr:not(.selected)').addClass('selected');
        else
            $('#tblDataDetailRepository').DataTable().$('tr.selected').removeClass('selected');
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                selectedItems[id] = selectAll;
            }
        }
    }
    function toggleOne(selectedItems, evt, itemId) {
        $('#tblDataFolder').DataTable().$('tr.selected').removeClass('selected');
        for (var id in selectedItems) {
            if (id != itemId) {
                selectedItems[id] = false;
            } else {
                if (selectedItems[id]) {
                    $(evt.target).closest('tr').toggleClass('selected');
                }
            }
        }
    }

    $scope.init = function () {
        $scope.model.FileName = para.FileName;
        $scope.model.NumberDocument = para.data.NumberDocument;
        $scope.model.Tags = (para.data.Tags != '' && para.data.Tags != null) ? para.data.Tags.split(',') : [];
        $scope.model.Desc = para.data.Desc;
    }
    $scope.init();
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.submit = function () {
        var itemSelect = [];
        for (var id in $scope.selected) {
            if ($scope.selected.hasOwnProperty(id)) {
                if ($scope.selected[id]) {
                    itemSelect.push(id);
                }
            }
        }
        if (itemSelect.length == 0) {
            App.toastrError(caption.HR_HR_MAN_MSG_SELECT_FORDER);
        } else if (itemSelect.length > 1) {
            App.toastrError(caption.HR_HR_MAN_MSG_SELECT_FORDER);
        } else {
            if ($scope.editformfile.validate()) {
                var data = new FormData();
                data.append("CateRepoSettingId", itemSelect[0]);
                data.append("FileCode", para.data.FileCode);
                data.append("Desc", $scope.model.Desc);
                data.append("Tags", $scope.model.Tags);
                data.append("NumberDocument", $scope.model.NumberDocument);
                data.append("ActInstCode", $rootScope.ActInstCode);
                dataservice.updateActCatFile(data, function (result) {
                    result = result.data;
                    if (result.Error) {
                        App.toastrError(result.Title);
                    } else {
                        App.toastrSuccess(result.Title);
                        $uibModalInstance.close();
                    }
                });
            }
        }
    };
    //treeview
    $scope.ctr = {};
    $scope.readyCB = function () {
        if ($scope.treeDataCategory.length == 0) {
            App.blockUI({
                target: "#contentMainRepository",
                boxed: true,
                message: 'loading...'
            });
            dataservice.getTreeCategoryActFile(function (result) {
                result = result.data;
                if (!result.Error) {
                    var root = {
                        id: 'root',
                        parent: "#",
                        text: "Tất cả danh mục",//"Tất cả kho dữ liệu"
                        state: { selected: false, opened: true, checkbox_disabled: true, disabled: true }
                    }
                    $scope.treeDataCategory.push(root);
                    var index = 0;
                    $scope.ListParent = result.filter(function (item) {
                        return (item.ParentCode == '#');
                    });
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].ParentCode == '#') {
                            var stt = $scope.ListParent.length - index;
                            if (stt.toString().length == 1) {
                                stt = "0" + stt;
                            }
                            index = index + 1;
                            var data = {
                                id: result[i].Code,
                                parent: 'root',
                                text: stt + ' - ' + result[i].Title,
                                catId: result[i].Id,
                                catCode: result[i].Code,
                                catName: result[i].Title,
                                catParent: result[i].ParentCode,
                                listRepository: result[i].ListRepository,
                                state: { selected: result[i].Code == para.data.CateRepoSettingCode ? true : false, opened: true }
                            }
                            $scope.treeDataCategory.push(data);
                        } else {
                            var data = {
                                id: result[i].Code,
                                parent: result[i].ParentCode,
                                text: result[i].Code + ' - ' + result[i].Title,
                                catId: result[i].Id,
                                catCode: result[i].Code,
                                catName: result[i].Title,
                                catParent: result[i].ParentCode,
                                listRepository: result[i].ListRepository,
                                state: { selected: result[i].Code == para.data.CateRepoSettingCode ? true : false, opened: true }
                            }
                            $scope.treeDataCategory.push(data);
                        }
                    }
                    App.unblockUI("#contentMainRepository");
                    console.log($scope.treeDataCategory);
                }
            });
        }
    }
    $scope.selectNodeCategory = function () {
        var listNoteSelect = $scope.ctr.treeInstance.jstree(true).get_checked(true);
        $scope.catCode = listNoteSelect[0].id;
        reloadData(true);
    }
    $scope.deselectNodeCategory = function () {
        $scope.catCode = "";
        reloadData(true);
    }
    $scope.treeConfig = {
        core: {
            multiple: false,
            animation: true,
            error: function (error) {
                $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
            },
            check_callback: true,
            worker: true,

        },
        types: {
            default: {
                icon: 'fa fa-folder icon-state-warning'
            }
        },
        version: 1,
        plugins: ['checkbox', 'types', 'sort'],
        checkbox: {
            "three_state": false,
            "whole_node": true,
            "keep_selected_style": true,
            "cascade": "undetermined",
        }
    };
    $scope.treeEvents = {
        'ready': $scope.readyCB,
        'select_node': $scope.selectNodeCategory,
        'deselect_node': $scope.deselectNodeCategory,
    }
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
        //setModalMaxHeight('.modal-file');
    }, 200);
});

app.controller('viewer', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, para, $sce) {
    var data = para;
    $scope.url = data.url;
    $scope.isImage = data.isImage;
    if ($scope.isImage)
        $scope.url = "/" + $scope.url;
    $scope.currentProjectUrl = $sce.trustAsResourceUrl($scope.url);
    console.log($scope.currentProjectUrl);
    console.log(data);
});

app.controller('shareFileAct', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataservice, para) {
    $scope.cancel = function () {
        $uibModalInstance.close('cancel');
    };

    $scope.model = {
        UserName: ''
    };

    $scope.model1 = {
        Code: '',
        Name: '',
        DepartmentName: '',
        Id: para.Id
    };

    $scope.permission = {
        Read: true,
        Write: true,
        Delete: true
    };

    $scope.init = function () {
        $scope.model.Id = para.Id;

        dataservice.getListUserShareAct(para.ActInstCode, function (rs) {
            rs = rs.data;
            $scope.listUser = rs;
        });

        dataservice.getUserShareFilePermission($scope.model.Id, function (rs) {
            rs = rs.data;
            $scope.lstUserSharePermission = rs;
        })
    };

    $scope.init();

    $scope.share = function () {
        if ($scope.model.UserName == '') {
            return App.toastrError("Vui lòng chọn nhân viên");
        }

        $scope.model1.Permission = $scope.permission;

        dataservice.insertFileShareActInst($scope.model1, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getUserShareFilePermission($scope.model.Id, function (rs) {
                    rs = rs.data;
                    $scope.lstUserSharePermission = rs;
                })
            }
        });
    };

    $scope.updatePermission = function (item, position, value) {
        item.Id = para.Id;
        if (position == 0) {
            if (value) {
                item.Permission.Read = false;
                item.Permission.Write = false;
                item.Permission.Delete = false;
            }
            else {
                item.Permission.Read = true;
            }
        }
        else if (position == 1) {
            if (value) {
                item.Permission.Write = false;
                item.Permission.Delete = false;
            }
            else {
                item.Permission.Write = true;
                item.Permission.Read = true;
            }
        }
        else {
            if (value) {
                item.Permission.Delete = false;
            }
            else {
                item.Permission.Delete = true;
                item.Permission.Read = true;
                item.Permission.Write = true;
            }
        }
        dataservice.insertFileShareActInst(item, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getUserShareFilePermission($scope.model.Id, function (rs) {
                    rs = rs.data;
                    $scope.lstUserSharePermission = rs;
                })
            }
        })
    }

    $scope.deleteShare = function (userName) {
        dataservice.deleteShareFile(para.Id, userName, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title)
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getUserShareFilePermission($scope.model.Id, function (rs) {
                    rs = rs.data;
                    $scope.lstUserSharePermission = rs;
                })
            }
        })
    }

    $scope.changeUser = function (item) {

        $scope.model1.Name = item.Name;
        $scope.model1.Code = item.Code;
        $scope.model1.DepartmentName = item.DepartmentName;
    }

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('log-user-activity', function ($scope, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModal, $uibModalInstance, dataservice, para) {
    $scope.initload = function () {
        dataservice.logActivityUser(para, function (rs) {
            rs = rs.data;
            $scope.ActivityData = rs.Log;
            $scope.countView = rs.CountView
            $scope.countReject = rs.CountReject
            $scope.countAccept = rs.CountAccept
        });
        //dataserviceCardJob.insertCardAuto(function (rs) {
        //    rs = rs.data;
        //    App.toastrSuccess(rs.Title);
        //})
    }
    $scope.initload();
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
});

app.controller('send-notifi-act', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, dataservice, para) {
    $scope.cancel = function () {
        $uibModalInstance.close(true);
    }
    $scope.initData = function () {
        dataservice.getMemberSendNotification(para, function (rs) {
            rs = rs.data;
            $scope.listUsers = rs;
        });
    }
    $scope.initData();

    $scope.approve = function (uId, isCheck) {
        for (var i = 0; i < $scope.listUsers.length; i++) {
            if ($scope.listUsers[i].UserId == uId) {
                if (!isCheck) {
                    $scope.listUsers[i].IsCheck = true;
                }
                else {
                    $scope.listUsers[i].IsCheck = false;
                }
                break;
            }
        }
    }

    $scope.lstData = [];

    $scope.submit = function () {
        if ($scope.listUsers.length > 0) {
            for (var i = 0; i < $scope.listUsers.length; i++) {
                if ($scope.listUsers[i].IsCheck) {
                    $scope.lstData.push($scope.listUsers[i]);
                }
            }
            var data = { ActInstCode: para, LstUser: $scope.lstData };
            dataservice.sendNotify(data, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                    $uibModalInstance.close();
                } else {
                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.close();
                }
            })
        }
    }
    setTimeout(function () {
        setModalDraggable(".modal-dialog");
    }, 400);
});

app.controller('more-file', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, dataservice, para) {
    $scope.cancel = function () {
        $rootScope.IsOpenModal = false;
        $uibModalInstance.close(true);
    }
    var excel = ['.XLSM', '.XLSX', '.XLS'];
    var document = ['.TXT'];
    var word = ['.DOCX', '.DOC'];
    var pdf = ['.PDF'];
    var powerPoint = ['.PPS', '.PPTX', '.PPT'];
    var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];

    $scope.IsOpenModal = true;
    $scope.initData = function () {
        dataservice.getFileWfInst(para, function (rs) {
            rs = rs.data;
            $scope.lstFile = rs;
            $scope.lstFile.forEach(element => {
                var icon = '<i style="color: rgb(42,42,42);font-size: 15px;" class="fas fa-align-justify pr5" aria-hidden="true"></i>';

                if (excel.indexOf(element.FileTypePhysic.toUpperCase()) !== -1) {
                    icon = '<i style="color: rgb(106,170,89);font-size: 15px;" class="fa fa-file-excel-o pr5" aria-hidden="true"></i>';
                } else if (word.indexOf(element.FileTypePhysic.toUpperCase()) !== -1) {
                    icon = '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o pr5" aria-hidden="true"></i>';
                } else if (document.indexOf(element.FileTypePhysic.toUpperCase()) !== -1) {
                    icon = '<i style="color: rgb(0,0,0);font-size: 15px;" class="fa fa-file-text-o pr5" aria-hidden="true"></i>';
                } else if (pdf.indexOf(element.FileTypePhysic.toUpperCase()) !== -1) {
                    icon = '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-pdf-o pr5" aria-hidden="true"></i>';
                } else if (powerPoint.indexOf(element.FileTypePhysic.toUpperCase()) !== -1) {
                    icon = '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-powerpoint-o pr5" aria-hidden="true"></i>';
                } else if (image.indexOf(element.FileTypePhysic.toUpperCase()) !== -1) {
                    icon = '<i style="color: rgb(42,42,42);font-size: 15px;" class="fa fa-picture-o pr5" aria-hidden="true"></i>';
                }

                element.icon = icon;
            });
            console.log(rs)
        })
    }

    $scope.initData();

    $scope.viewFile = function (id, fileType, cloudId) {
        var excel = ['.XLSM', '.XLSX', '.XLS'];
        var document = ['.TXT'];
        var word = ['.DOCX', '.DOC'];
        var pdf = ['.PDF'];
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        if (excel.indexOf(fileType.toUpperCase()) !== -1) {
            $scope.viewExcel(id, 2);
        }
        else if (word.indexOf(fileType.toUpperCase()) !== -1) {
            $scope.viewWord(id, 2);
        }
        else if (pdf.indexOf(fileType.toUpperCase()) !== -1) {
            $scope.viewPDF(id, 2);
        }
        else if (document.indexOf(fileType.toUpperCase()) !== -1 || image.indexOf(fileType.toUpperCase()) !== -1) {
            $scope.view(id, fileType, cloudId);
        }
        else {
            $scope.getObjectFile(0);
        }
    }

    $scope.viewExcel = function (id, mode) {
        dataservice.getItemFile(id, true, mode, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                if (rs.ID === -1) {
                    //App.toastrError(rs.Title);
                    setTimeout(function () {
                        window.open('/Admin/Excel#', '_blank');
                    }, 2000);
                } else {
                    App.toastrError(rs.Title);
                }
                return null;
            } else {
                window.open('/Admin/Excel#', '_blank');
            }
        });
    };

    $scope.viewWord = function (id, mode) {
        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            dataservice.getItemFile(id, true, mode, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    if (rs.ID === -1) {
                        //App.toastrError(rs.Title);
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
        }
    };

    $scope.viewPDF = function (id, mode) {
        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            dataservice.getItemFile(id, true, mode, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    if (rs.ID === -1) {
                        //App.toastrError(rs.Title);
                        setTimeout(function () {
                            window.open('/Admin/PDF#', '_blank');
                        }, 2000);
                    } else {
                        App.toastrError(rs.Title);
                    }
                    return null;
                } else {
                    window.open('/Admin/PDF#', '_blank');
                }
            });
        }
    };

    $scope.view = function (id, fileType, cloudId) {
        var isImage = false;
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        if (image.indexOf(fileType.toUpperCase()) !== -1) {
            isImage = true;
        }
        if (cloudId != null && cloudId != "") {
            //SHOW LÊN MÀN HÌNH LUÔN
            // window.open(" https://drive.google.com/file/d/" + userModel.CloudFileId + "/view", "_blank");
            //$scope.openViewer("https://drive.google.com/file/d/"+userModel.CloudFileId + "/view");3
            dataservice.createTempFile(id, false, "", function (rs) {
                rs = rs.data;
                rs.Object = encodeURI(rs.Object);
                if (rs.Error == false) {
                    if (isImage == false) {
                        window.open(rs.Object, '_blank')
                        //$scope.openViewer("https://docs.google.com/gview?url=" + window.location.origin + '/' + rs.Object + '&embedded=true', isImage);
                    } else
                        $scope.openViewer(rs.Object, isImage);
                    //window.open('https://docs.google.com/gview?url=' + window.location.origin + '/' + rs.Object + '&embedded=true', '_blank');
                }
                else {

                }
            });
        }
        else {
            dataservice.createTempFile(id, false, "", function (rs) {
                rs = rs.data;
                rs.Object = encodeURI(rs.Object);
                if (rs.Error == false) {
                    if (isImage == false) {
                        var url = window.location.origin + '/' + rs.Object;
                        window.open(url, '_blank')
                        //$scope.openViewer("https://docs.google.com/gview?url=" + window.location.origin + '/' + rs.Object + '&embedded=true', isImage);
                    }
                    else
                        $scope.openViewer(rs.Object, isImage);
                    //window.open('https://docs.google.com/gview?url=' + window.location.origin + '/' + rs.Object + '&embedded=true', '_blank');
                }
                else {

                }
            });
        }
    }

    $scope.getObjectFile = function (id) {
        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            dataservice.getItemFile(id, true, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                    return null;
                }
            });
        }
    };

    $scope.openViewer = function (url, isImage) {
        var data = {};
        data.url = url;
        data.isImage = isImage;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/viewer.html',
            controller: 'viewer',
            backdrop: 'false',
            size: '60',
            resolve: {
                para: function () {
                    return data;
                }
            }
        });
    }

    setTimeout(function () {
        setModalDraggable(".modal-dialog");
    }, 400);
});
app.controller('more-file-wf', function ($scope, $rootScope, $compile, dataservice) {
    $scope.IsOpenModal = false;
    var excel = ['.XLSM', '.XLSX', '.XLS'];
    var document = ['.TXT'];
    var word = ['.DOCX', '.DOC'];
    var pdf = ['.PDF'];
    var powerPoint = ['.PPS', '.PPTX', '.PPT'];
    var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];

    $scope.InitNotModal = function (WfCode) {
        var model = {
            wfInstCode: WfCode
        }
        dataservice.getFileWfInst(model, function (rs) {
            rs = rs.data;
            $scope.lstFile = rs;
            $scope.lstFile.forEach(element => {
                element.iconClass = 'fas fa-align-justify pr5'; // Default icon class
                element.iconColor = 'rgb(42,42,42)'; // Default icon color

                if (excel.indexOf(element.FileTypePhysic.toUpperCase()) !== -1) {
                    element.iconClass = 'fa fa-file-excel-o pr5';
                    element.iconColor = 'rgb(106,170,89)';
                } else if (word.indexOf(element.FileTypePhysic.toUpperCase()) !== -1) {
                    element.iconClass = 'fa fa-file-word-o pr5';
                    element.iconColor = 'rgb(13,118,206)';
                } else if (document.indexOf(element.FileTypePhysic.toUpperCase()) !== -1) {
                    element.iconClass = 'fa fa-file-text-o pr5';
                    element.iconColor = 'rgb(0,0,0)';
                } else if (pdf.indexOf(element.FileTypePhysic.toUpperCase()) !== -1) {
                    element.iconClass = 'fa fa-file-pdf-o pr5';
                    element.iconColor = 'rgb(226,165,139)';
                } else if (powerPoint.indexOf(element.FileTypePhysic.toUpperCase()) !== -1) {
                    element.iconClass = 'fa fa-file-powerpoint-o pr5';
                    element.iconColor = 'rgb(226,165,139)';
                } else if (image.indexOf(element.FileTypePhysic.toUpperCase()) !== -1) {
                    element.iconClass = 'fa fa-picture-o pr5';
                    element.iconColor = 'rgb(42,42,42)';
                }
            });

        })
    }

    $scope.viewFile = function (id, fileType, cloudId) {
        var excel = ['.XLSM', '.XLSX', '.XLS'];
        var document = ['.TXT'];
        var word = ['.DOCX', '.DOC'];
        var pdf = ['.PDF'];
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        if (excel.indexOf(fileType.toUpperCase()) !== -1) {
            $scope.viewExcel(id, 2);
        }
        else if (word.indexOf(fileType.toUpperCase()) !== -1) {
            $scope.viewWord(id, 2);
        }
        else if (pdf.indexOf(fileType.toUpperCase()) !== -1) {
            $scope.viewPDF(id, 2);
        }
        else if (document.indexOf(fileType.toUpperCase()) !== -1 || image.indexOf(fileType.toUpperCase()) !== -1) {
            $scope.view(id, fileType, cloudId);
        }
        else {
            $scope.getObjectFile(0);
        }
    }

    $scope.viewExcel = function (id, mode) {
        dataservice.getItemFile(id, true, mode, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                if (rs.ID === -1) {
                    //App.toastrError(rs.Title);
                    setTimeout(function () {
                        window.open('/Admin/Excel#', '_blank');
                    }, 2000);
                } else {
                    App.toastrError(rs.Title);
                }
                return null;
            } else {
                window.open('/Admin/Excel#', '_blank');
            }
        });
    };

    $scope.viewWord = function (id, mode) {
        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            dataservice.getItemFile(id, true, mode, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    if (rs.ID === -1) {
                        //App.toastrError(rs.Title);
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
        }
    };

    $scope.viewPDF = function (id, mode) {
        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            dataservice.getItemFile(id, true, mode, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    if (rs.ID === -1) {
                        // App.toastrError(rs.Title);
                        setTimeout(function () {
                            window.open('/Admin/PDF#', '_blank');
                        }, 2000);
                    } else {
                        App.toastrError(rs.Title);
                    }
                    return null;
                } else {
                    window.open('/Admin/PDF#', '_blank');
                }
            });
        }
    };

    $scope.view = function (id, fileType, cloudId) {
        var isImage = false;
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        if (image.indexOf(fileType.toUpperCase()) !== -1) {
            isImage = true;
        }
        if (cloudId != null && cloudId != "") {
            //SHOW LÊN MÀN HÌNH LUÔN
            // window.open(" https://drive.google.com/file/d/" + userModel.CloudFileId + "/view", "_blank");
            //$scope.openViewer("https://drive.google.com/file/d/"+userModel.CloudFileId + "/view");3
            dataservice.createTempFile(id, false, "", function (rs) {
                rs = rs.data;
                rs.Object = encodeURI(rs.Object);
                if (rs.Error == false) {
                    if (isImage == false) {
                        window.open(rs.Object, '_blank')
                        //$scope.openViewer("https://docs.google.com/gview?url=" + window.location.origin + '/' + rs.Object + '&embedded=true', isImage);
                    } else
                        $scope.openViewer(rs.Object, isImage);
                    //window.open('https://docs.google.com/gview?url=' + window.location.origin + '/' + rs.Object + '&embedded=true', '_blank');
                }
                else {

                }
            });
        }
        else {
            dataservice.createTempFile(id, false, "", function (rs) {
                rs = rs.data;
                rs.Object = encodeURI(rs.Object);
                if (rs.Error == false) {
                    if (isImage == false) {
                        var url = window.location.origin + '/' + rs.Object;
                        window.open(url, '_blank')
                        //$scope.openViewer("https://docs.google.com/gview?url=" + window.location.origin + '/' + rs.Object + '&embedded=true', isImage);
                    }
                    else
                        $scope.openViewer(rs.Object, isImage);
                    //window.open('https://docs.google.com/gview?url=' + window.location.origin + '/' + rs.Object + '&embedded=true', '_blank');
                }
                else {

                }
            });
        }
    }

    $scope.getObjectFile = function (id) {
        if (id === 0) {
            App.toastrError(caption.COM_MSG_NOT_SUPPORT);
            return null;
        } else {
            dataservice.getItemFile(id, true, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                    return null;
                }
            });
        }
    };

    $scope.openViewer = function (url, isImage) {
        var data = {};
        data.url = url;
        data.isImage = isImage;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/viewer.html',
            controller: 'viewer',
            backdrop: 'false',
            size: '60',
            resolve: {
                para: function () {
                    return data;
                }
            }
        });
    }

    setTimeout(function () {
        setModalDraggable(".modal-dialog");
    }, 400);
});

app.controller('log-status-wf', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, dataservice, para) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    }
    $scope.initData = function () {
        dataservice.getLogStatusInst(para, function (rs) {
            rs = rs.data;
            $scope.lstStatus = rs;
        });
    }
    $scope.initData();
    setTimeout(function () {
        setModalDraggable(".modal-dialog");
    }, 400);
});


app.directive("myFormEditInstance", function () {
    return {
        restrict: "E",
        templateUrl: ctxfolder + "edit-activity-instance.html",
        scope: {
            para: '='
        }
    };
});
