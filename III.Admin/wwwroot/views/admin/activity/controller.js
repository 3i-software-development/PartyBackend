var ctxfolder = "/views/admin/activity";
var ctxfolderMessage = "/views/message-box";
var ctxfolderCommonSetting = "/views/admin/commonSetting";

var app = angular.module('App_ESEIM', ['App_ESEIM_REPOSITORY', 'App_ESEIM_SUPPLIER', 'App_ESEIM_FILE_PLUGIN', "ui.bootstrap", "ngRoute", "ngValidate", "datatables", "datatables.bootstrap", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', "ngJsTree", "treeGrid", "ui.select", "ngCookies", "pascalprecht.translate", 'dynamicNumber']).
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
    var id;
    this.setId = function (d) {
        id = d;
    }
    this.getId = function () {
        return id;
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

        insert: function (data, callback) {
            $http.post('/Admin/Activity/Insert', data).then(callback);
        },
        getItem: function (data, callback) {
            $http.post('/Admin/Activity/GetItem?id=' + data).then(callback);
        },
        update: function (data, callback) {
            $http.post('/Admin/Activity/Update', data).then(callback);
        },
        delete: function (data, callback) {
            $http.post('/Admin/Activity/Delete?id=' + data).then(callback);
        },
        //getActivity: function (callback) {
        //    $http.post('/Admin/Activity/GetActivity').then(callback);
        //},
        deleteActivity: function (data, callback) {
            $http.post('/Admin/Activity/DeleteActivity?id=' + data).then(callback);
        },
        getRolesWorkFlow: function (callback) {
            $http.post('/Admin/WorkflowActivityRole/GetRoles').then(callback);
        },
        getDepartmentWorkFlow: function (callback) {
            $http.post('/Admin/WorkflowActivityRole/GetDepartment').then(callback);
        },
        getBranchWorkFlow: function (callback) {
            $http.post('/Admin/WorkflowActivityRole/GetBranch').then(callback);
        },
        //getBranchWorkFlow: function (callback) {
        //    $http.post('/Admin/WorkflowActivityRole/GetBranch').then(callback);
        //},
        insertWorkFlow: function (data, callback) {
            $http.post('/Admin/Activity/InsertWorkflowActRole', data).then(callback);
        },
        getWorkFlow: function (data, callback) {
            $http.post('/Admin/Activity/GetWorkFlow?code=' + data).then(callback);
        },
        deleteWorkflowActRole: function (data, callback) {
            $http.post('/Admin/Activity/DeleteWorkflowActRole?id=' + data).then(callback);
        },
        getProperties: function (data, callback) {
            $http.post('/Admin/Activity/GetProperties?ActCode=' + data).then(callback);
        },
        getUnit: function (callback) {
            $http.post('/Admin/Activity/GetUnit').then(callback);
        },
        updateWfUserList: function (data, callback) {
            $http.post('/Admin/Activity/UpdateWfUserList', data).then(callback)
        },

        //file
        insertActivityFile: function (data, callback) {
            submitFormUpload1('/Admin/Activity/InsertActivityFile/', data, callback);
        },
        getSuggestionsAssetFile: function (data, callback) {
            $http.get('/Admin/Activity/GetSuggestionsWfFile?wfCode=' + data).then(callback);
        },
        getTreeCategory: function (callback) {
            $http.post('/Admin/EDMSRepository/GetTreeCategory').then(callback);
        },
        getAssetFile: function (data, callback) {
            $http.post('/Admin/Activity/GetActivityFile/' + data).then(callback);
        },
        updateAssetFile: function (data, callback) {
            submitFormUpload('/Admin/Activity/UpdateAssetFile/', data, callback);
        },
        deleteAssetFile: function (data, callback) {
            $http.post('/Admin/Activity/DeleteActivityFile/' + data).then(callback);
        },
        getListObjectTypeShare: function (callback) {
            $http.get('/Admin/FileObjectShare/GetListObjectTypeShare/').then(callback);
        },
        getListFileWithObject: function (objectCode, objectType, callback) {
            $http.get('/Admin/FileObjectShare/GetListFileWithObject?objectCode=' + objectCode + '&objectType=' + objectType).then(callback);
        },
        getListObjectShare: function (objectCodeShared, objectTypeShared, objectCode, objectType, fileCode, callback) {
            $http.get('/Admin/FileObjectShare/GetListObjectShare?objectCodeShared=' + objectCodeShared + '&objectTypeShared=' + objectTypeShared + '&objectCode=' + objectCode + '&objectType=' + objectType + '&fileCode=' + fileCode).then(callback);
        },
        getListObjectCode: function (objectCode, objectType, callback) {
            $http.get('/Admin/FileObjectShare/GetListObjectCode?objectCode=' + objectCode + '&objectType=' + objectType).then(callback);
        },
        deleteObjectShare: function (data, callback) {
            $http.get('/Admin/FileObjectShare/DeleteObjectShare?id=' + data).then(callback);
        },
        getItemFile: function (data, data1, data2, callback) {
            $http.get('/Admin/EDMSRepository/GetItemFile?id=' + data + '&&IsEdit=' + data1 + '&mode=' + data2).then(callback);
        },
        getTypeWorkFlow: function (callback) {
            $http.post('/Admin/Activity/GetTypeWorkFlow').then(callback);
        },

        //Design new Work flow
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
        updateWf: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/UpdateWf', data).then(callback)
        },
        getItemWf: function (data, callback) {
            $http.post('/Admin/Activity/GetItemWf?id=' + data).then(callback)
        },
        deleteWF: function (data, callback) {
            $http.post('/Admin/Activity/DeleteWF?id=' + data).then(callback)
        },
        //Canvas
        getWfGroup: function (callback) {
            $http.get('/Admin/WorkflowActivity/GetWfGroup').then(callback)
        },
        insertWorkFlow: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/InsertWorkFlow', data).then(callback)
        },
        getWorkflow: function (callback) {
            $http.get('/Admin/WorkflowActivity/GetWorkflow').then(callback)
        },
        deleteWf: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/DeleteWf?wfCode=' + data).then(callback)
        },
        settingWF: function (data, callback) {
            $http.post('/Admin/WorkflowActivity/SettingWF', data).then(callback)
        },
        deleteSettingWF: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivityCat/DeleteSettingWF?actSrc=' + data + '&actDes=' + data1).then(callback)
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
            $http.post('/Admin/CatActivity/GetListUserOfBranch?branch=' + data).then(callback);
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
            $http.post('/Admin/CatActivity/Assign', data).then(callback);
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
            $http.post('/Admin/WorkflowActivityCat/GetMemberAssign', data).then(callback);
        },
        updateRole: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivityCat/UpdateRole?id=' + data + '&role=' + data1).then(callback);
        },
        updateStatus: function (data, data1, callback) {
            $http.post('/Admin/WorkflowActivityCat/UpdateStatus?id=' + data + '&status=' + data1).then(callback);
        },
        getStatusAssign: function (callback) {
            $http.get('/Admin/WorkflowActivity/GetStatusAssign').then(callback);
        },
        deleteAssign: function (data, callback) {
            $http.post('/Admin/WorkflowActivityCat/DeleteAssign?id=' + data).then(callback);
        },
        //File object share
        getTreeCategory: function (callback) {
            $http.post('/Admin/EDMSRepository/GetTreeCategory').then(callback);
        },
        getObjFileShare: function (callback) {
            $http.post('/Admin/WorkflowActivity/GetObjFileShare').then(callback);
        },
        insertFileShare: function (data, callback) {
            $http.post('/Admin/Activity/InsertFileShare', data).then(callback);
        },
        uploadAttachment: function (data, callback) {
            submitFormUpload('/Admin/Activity/UploadFile/', data, callback);
        },
        addAttachment: function (data, callback) {
            $http.post('/Admin/Activity/AddAttachment', data).then(callback);
        },
        getAttachment: function (data, callback) {
            $http.post('/Admin/Activity/GetAttachment?actCode=' + data).then(callback);
        },
        deleteAttachment: function (data, callback) {
            $http.post('/Admin/Activity/DeleteAttachment', data).then(callback);
        },
        isFileEdms: function (data1, data2, callback) {
            $http.get('/Admin/WorkflowActivity/IsFileEdms?fileCode=' + data1 + '&url=' + data2).then(callback);
        },
        viewFileOnline: function (data, callback) {
            $http.post('/Admin/Activity/ViewFileOnline', data).then(callback);
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

        // Work flow instance
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
            $http.post('/Admin/CatActivity/InsertActivity', data).then(callback)
        },
        updateActivity: function (data, callback) {
            $http.post('/Admin/CatActivity/UpdateActivity', data).then(callback);
        },
        updateGroupDataActivity: function (data, callback) {
            $http.post('/Admin/CatActivity/UpdateGroupDataActivity', data).then(callback);
        },

        getUnitName: function (data, callback) {
            $http.get('/Admin/WorkflowActivity/GetUnitName?Code=' + data).then(callback)
        },
        getAllActInstance: function (callback) {
            $http.post('/Admin/WorkflowActivity/GetActInstance').then(callback)
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


        //Activity
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
        getMilesStone: function (callback) {
            $http.post('/Admin/CatActivity/GetMilesStone').then(callback);
        },
        getListATTRUNIT: function (callback) {
            $http.post('/Admin/CatActivity/GetListATTRUNIT').then(callback);
        },
        getListATTRTYPE: function (callback) {
            $http.post('/Admin/CatActivity/GetListATTRTYPE').then(callback);
        },
        getAct: function (data, callback) {
            $http.post('/Admin/WorkflowActivityCat/GetAct?wfCode=' + data).then(callback);
        },
        getTransitionType: function (callback) {
            $http.post('/Admin/WorkflowActivityCat/GetTransitionType').then(callback);
        },
        getItemActivity: function (data, callback) {
            $http.post('/Admin/Activity/GetItemActivity', data).then(callback);
        },
        delCatActivity: function (data, callback) {
            $http.post('/Admin/CatActivity/DeleteActivity?actCode=' + data).then(callback);
        },
        checkActExist: function (data, callback) {
            $http.post('/Admin/CatActivity/CheckActExist?actCode=' + data).then(callback);
        },
        checkWfSetting: function (data, data1, callback) {
            $http.post('/Admin/CatActivity/CheckWfSetting?actSrc=' + data + '&actDes=' + data1).then(callback);
        },
        updateSettingWF: function (data, callback) {
            $http.post('/Admin/WorkflowActivityCat/UpdateSettingWF', data).then(callback);
        },
        getGroupAttr: function (callback) {
            $http.post('/Admin/Activity/GetGroupAttr').then(callback);
        },
        insertActAttrSetup: function (data, callback) {
            $http.post('/Admin/Activity/InsertActAttrSetup', data).then(callback);
        },
        deleteActAttrSetup: function (data, callback) {
            $http.post('/Admin/CatActivity/DeleteActAttrSetup?id=' + data).then(callback);
        },
        checkTypeInitial: function (data, callback) {
            $http.post('/Admin/CatActivity/CheckTypeInitial?wfCode=' + data).then(callback);
        },
        getCommand: function (callback) {
            $http.post('/Admin/WorkflowActivity/GetCommand').then(callback);
        },
        checkTypeEndAct: function (data, callback) {
            $http.post('/Admin/CatActivity/CheckTypeEndAct?wfCode=' + data).then(callback);
        },
        saveDiagram: function (data, callback) {
            $http.post('/Admin/Activity/SaveDiagram', data).then(callback);
        },
        getMileStoneAct: function (data, callback) {
            $http.post('/Admin/Activity/GetMileStoneAct?actCode=' + data).then(callback);
        },

        publicWF: function (data, callback) {
            $http.post('/Admin/Activity/PublicWF?wfCode=' + data).then(callback);
        },

        //File in edms
        insertActCatFile: function (data, callback) {
            submitFormUpload('/Admin/Activity/InsertActCatFile', data, callback);
        },
        getListUserShare: function (data, callback) {
            $http.post('/Admin/Activity/GetListUserShare?actCode=' + data).then(callback);
        },
        insertFileShareActCat: function (data, callback) {
            $http.post('/Admin/Activity/InsertFileShareActCat', data).then(callback);
        },
        getSuggestionsActCatFile: function (data, callback) {
            $http.get('/Admin/Activity/GetSuggestionsActCatFile?actCode=' + data).then(callback);
        },
        deleteActCatFile: function (data, callback) {
            $http.post('/Admin/CardJob/DeleteCardFile?id=' + data).then(callback);
        },
        getItemFile: function (data, data1, data2, callback) {
            $http.get('/Admin/EDMSRepository/GetItemFile?id=' + data + '&&IsEdit=' + data1 + '&mode=' + data2).then(callback);
        },
        createTempFile: function (data, data1, data2, callback) {
            $http.post('/Admin/EDMSRepository/CreateTempFile?Id=' + data + "&isSearch=" + data1 + "&content=" + data2).then(callback);
        },
        getActCatFile: function (data, callback) {
            $http.post('/Admin/CardJob/GetCardFile?id=' + data).then(callback);
        },
        getTreeCategoryActFile: function (callback) {
            $http.post('/Admin/EDMSRepository/GetTreeCategory').then(callback);
        },
        updateActCatFile: function (data, callback) {
            submitFormUpload('/Admin/Activity/UpdateActCatFile', data, callback);
        },
        getFileShare: function (data, callback) {
            $http.post('/Admin/EDMSRepository/GetFileShare?id=' + data).then(callback);
        },

        //Creator Manager
        assignCreatorManager: function (data, data1, data2, callback) {
            $http.post('/Admin/Activity/AssignCreatorManager?check=' + data + '&actCode=' + data1 + '&id=' + data2).then(callback);
        },
        getCreatorManager: function (data, callback) {
            $http.post('/Admin/Activity/GetCreatorManager?actCode=' + data).then(callback);
        },

        //Creator new design
        getCreatorAssign: function (data, callback) {
            $http.post('/Admin/WorkflowActivityCat/GetCreatorAssign?actCode=' + data).then(callback);
        },

        //Nested Workflow
        getNestedWF: function (data, callback) {
            $http.post('/Admin/Activity/GetNestedWF?wfCode=' + data).then(callback);
        },
        addNestedWF: function (data, callback) {
            $http.post('/Admin/Activity/AddNestedWF', data).then(callback);
        },
        getNestedActCat: function (data, callback) {
            $http.post('/Admin/Activity/GetNestedActCat?actCode=' + data).then(callback);
        },
        deleteNestedWf: function (data, callback) {
            $http.post('/Admin/Activity/DeleteNestedWf', data).then(callback);
        },

        getListUser: function (callback) {
            $http.post('/Admin/CardJob/GetListUser').then(callback);
        },

        //Role default
        getRoleDefault: function (callback) {
            $http.get('/Admin/Activity/GetRoleDefault').then(callback);
        },
        insertRoleDefault: function (data, data1, callback) {
            $http.post('/Admin/Activity/InsertRoleDefault?actCode=' + data + '&role=' + data1).then(callback);
        },
        deleteRoleDefault: function (data, data1, callback) {
            $http.post('/Admin/Activity/DeleteRoleDefault?actCode=' + data + '&role=' + data1).then(callback);
        },
        getRoleDefaultOfAct: function (data, callback) {
            $http.get('/Admin/Activity/GetRoleDefaultOfAct?actCode=' + data).then(callback);
        },


        //new Design status object
        getGroupStatus: function (callback) {
            $http.get('/Admin/SettingStatusObject/GetGroupStatus').then(callback);
        },
    }
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
            //max: 'Max some message {0}'
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
                    maxlength: 100,

                },
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
                    regx: /^[+]?\d+(\.\d+)?$/,
                    maxlength: 4
                },
                ActLevel: {
                    required: true,
                    regx: /^[+]?\d+(\.\d+)?$/,
                    maxlength: 4
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
                    required: caption.ACT_VALIDATE_NAME_ACT,
                    regx: caption.ACT_VALIDATE_REGX_TITLE,
                    maxlength: caption.ACT_VALIDATE_MAX_LENGTH_100
                },
                Duration: {
                    required: caption.ACT_VALIDATE_DURATION_ACT,
                    regx: caption.ACT_VALIDATE_DURATION_REGX,
                    maxlength: caption.ACT_VALIDATE_MAX_LENGTH_4
                },
                Duration: {
                    required: caption.ACT_VALIDATE_LEVEL_ACT,
                    regx: caption.ACT_VALIDATE_LEVEL_REGX,
                    maxlength: caption.ACT_VALIDATE_MAX_LENGTH_4
                },
                ActivityCode: {
                    required: caption.ACT_VALIDATE_CODE_ACT
                },
                Located: {
                    maxlength: caption.ACT_VALIDATE_MAX_LENGTH_255
                }
            }
        }

        $rootScope.validationOptionsWF = {
            rules: {
                WfCode: {
                    required: true,
                    regx: /^[a-zA-Z0-9_äöüÄÖÜ]*$/,
                    maxlength: 255
                },
                WfName: {
                    required: true,
                    maxlength: 255,
                    regx: /^[^\s].*/
                },
                WfNote: {
                    maxlength: 1000
                }
            },
            messages: {
                WfCode: {
                    required: caption.ACT_VALIDATE_WF_CODE,
                    regx: caption.COM_REGX_CODE_BLANK,
                    maxlength: caption.ACT_VALIDATE_MAX_LENGTH_255
                },
                WfName: {
                    required: caption.ACT_VALIDATE_WF_NAME,
                    maxlength: caption.ACT_VALIDATE_MAX_LENGTH_255,
                    regx: "Tên luồng không bắt đầu bằng khoảng trắng"
                },
                WfNote: {
                    maxlength: caption.ACT_VALIDATE_MAX_LENGTH_1000
                }
            }
        }

        $rootScope.validationOptionsAttr = {
            rules: {
                AttrCode: {
                    required: true,
                    regx: /^[a-zA-Z0-9_äöüÄÖÜ]*$/,
                    maxlength: 100
                },
                AttrName: {
                    required: true,
                    regx: /^[^\s].*/,
                    maxlength: 255
                },
                Note: {
                    maxlength: 1000
                }
            },
            messages: {
                AttrCode: {
                    required: caption.ACT_VALIDATE_ATTR_CODE,
                    regx: caption.ACT_VALIDATE_REGX_ATTR_CODE,
                    maxlength: caption.ACT_VALIDATE_MAX_LENGTH_100
                },
                AttrName: {
                    required: caption.ACT_VALIDATE_ATTR_NAME,
                    regx: caption.ACT_VALIDATE_REGX_ATTR_NAME,
                    maxlength: caption.ACT_VALIDATE_MAX_LENGTH_255
                },
                Note: {
                    maxlength: caption.ACT_VALIDATE_MAX_LENGTH_1000
                }
            }
        }

        $rootScope.IsAdd = false;
    });
    $rootScope.WorkFlowCode = '';
    $rootScope.ObjectTypeFile = "ACT_CAT";
    $rootScope.moduleName = "ACTIVITY"
    dataservice.getGroupAttr(function (rs) {
        rs = rs.data;
        $rootScope.lstAttrGroup = rs;
    });
});

app.config(function ($routeProvider, $validatorProvider, $translateProvider) {
    $translateProvider.useUrlLoader('/Admin/Activity/Translation');
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

app.controller('index', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, $filter, myService) {
    $scope.model = {
        WorkFlowCode: '',
        Name: '',
        WfInst: "",
        WfCode: ""
    }
    $scope.showListAct = function () {
        $('.act-sidebar').toggleClass('act-sidebar__show-hidd');
        $('.act-sidebar__buger').addClass('buger__last');
        $('.act-sidebar__close').on('click', function () {
            $('.act-sidebar').removeClass('act-sidebar__show-hidd');

        });
    }
    $scope.isShowJson = false;
    $scope.showJson = function () {
        if ($scope.isShowJson) {
            $scope.isShowJson = false;
        } else {
            $scope.isShowJson = true;
        }
    }
    var vm = $scope;
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/Activity/JTableActivity",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.WorkFlowCode = $scope.model.WorkFlowCode;
                d.Name = $scope.model.Name;

            },
            complete: function () {
                App.unblockUI("#contentMain");
                heightTableAuto();
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(pageLength)
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
            $(row).find('td:not(:has(label.mt-checkbox))').on('dblclick', function (evt) {
                if (evt.target.localName == 'input' && evt.target.type == 'checkbox') {

                } else {
                    var Id = data.ID;
                    $scope.edit(Id);
                }
            });
        });
    vm.dtColumns = [];

    vm.dtColumns.push(DTColumnBuilder.newColumn("ID").withTitle(titleHtml).notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full.ID] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.ID + ']" ng-click="toggleOne(selected)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Id').withTitle('{{"Id" | translate}}').withOption('sClass', 'w20').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('WfCode').withTitle('{{"ACT_LBL_CATEGORY_CODE" | translate}}').withOption('sClass', 'w20').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('WfName').withTitle('{{"ACT_LBL_CATEGORY_NAME" | translate}}').renderWith(function (data, type, full) {
        return '<a class="bold text-underline" ng-click="editWorkflow(' + full.Id + ')">' + data + '</a>';
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Group').withTitle('{{"ACT_LIST_COL_GROUP" | translate}}').withOption('sClass', 'w20 nowrap').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Type').withTitle('{{"ACT_LIST_COL_TYPE" | translate}}').withOption('sClass', 'w20 nowrap').renderWith(function (data, type) {
        return data;
    }))
    //vm.dtColumns.push(DTColumnBuilder.newColumn('Note').withTitle('{{"ACT_TAB_DESCRIPTION" | translate}}').renderWith(function (data, type) {
    //    return data;
    //}));

    vm.dtColumns.push(DTColumnBuilder.newColumn('action').withTitle('{{"ACT_LIST_COL_VIEW_WF" | translate}}').withOption('sClass', 'w20').renderWith(function (data, type, full) {
        return '<button title="Xem sơ đồ" ng-click="showWorkflowCat(\'' + full.WfCode + '\',' + full.Id + ')" style = "width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline white"><img src="../../../images/workflowActivity/icon-wf-black.png" style = "width: 12px;" /></button>';
    }));

    vm.dtColumns.push(DTColumnBuilder.newColumn('IsPublic').withOption('sClass', 'tcenter').withTitle('{{"ACT_LIST_COL_PUBLIC_WF" | translate}}').withOption('sClass', 'w20').renderWith(function (data, type, full) {

        if (data == "True") {
            return '<span class="cursor glyphicon glyphicon-ok-sign text-success fs24 pl-2 pTip-right btn-publish-inline" ng-click="publicWF(\'' + full.WfCode + '\', 1)" ></span> '
        }
        else {
            return '<span class="cursor glyphicon glyphicon-ban-circle text-danger fs24 pl-2 pTip-right btn-publish-inline" ng-click="publicWF(\'' + full.WfCode + '\', 2)"></span> '
        }
    }));

    vm.dtColumns.push(DTColumnBuilder.newColumn('action').withTitle('{{"ACT_COL_CATEGORY_ACTION" | translate}}').withOption('sClass', 'w20').renderWith(function (data, type, full) {
        return '<a title="Sửa" ng-click="editWorkflow(' + full.Id + ')" style1= "width: 25px; height: 25px; padding: 0px" class1="btn btn-icon-only btn-circle btn-outline blue"><i class="fas fa-edit fs25 pr20"></i></a>' +
            '<a title="Xoá" ng-click="delete(' + full.Id + ')" style1="width: 25px; height: 25px; padding: 0px" class1="btn btn-icon-only btn-circle btn-outline red"><i class="fas fa-trash-alt fs25 text-danger"></i></a>';
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

    $rootScope.reloadActivity = function () {
        reloadData(false);
    }

    $scope.reload = function () {
        reloadData(false);
    }

    $scope.initLoad = function () {

    }
    $scope.initLoad();
    $scope.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/add.html',
            controller: 'add',
            backdrop: true,
            size: '50'
        });
        modalInstance.result.then(function (d) {
            $rootScope.reloadActivity();
        }, function () { });
    }
    $scope.addcatactivity = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/addCatActivity.html',
            controller: 'addCatActivity',
            backdrop: true,
            size: '60'
        });
        modalInstance.result.then(function (d) {
            $scope.reloadNoResetPage();
        }, function () { });
    }
    $scope.edit = function (id) {
        dataservice.getItem(id, function (rs) {
            rs = rs.data;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: ctxfolder + '/edit.html',
                controller: 'edit',
                backdrop: 'static',
                size: '50',
                resolve: {
                    para: function () {
                        return rs.Object;
                    }
                }
            });
            modalInstance.result.then(function (d) {
                $rootScope.reloadActivity();
            }, function () {
            });
        });
    }
    $scope.delete = function (id) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            resolve: {
                para: function () {
                    return id;
                }
            },
            controller: function ($scope, $uibModalInstance, para) {
                $scope.message = caption.COM_MSG_DELETE_CONFIRM_COM;
                $scope.ok = function () {
                    dataservice.deleteWF(para, function (rs) {
                        if (rs.data.Error) {
                            App.toastrError(rs.data.Title);
                        } else {
                            App.toastrSuccess(rs.data.Title);
                            $uibModalInstance.close();
                        }
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: '30',
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
            dataservice.getWflow(function (rs) {
                rs = rs.data;
                $scope.listWF = rs;
            })
        }, function () {
        });
    }

    $scope.addWorkflow = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/add-workflow.html',
            controller: 'add-workflow',
            backdrop: 'static',
            size: '50'
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
            dataservice.getWflow(function (rs) {
                rs = rs.data;
                $scope.listWF = rs;
            })
        }, function () {
        });
    }

    $scope.editWorkflow = function (id) {
        if (id == null || id == '' || id == undefined) {
            return App.toastrError(caption.ACT_MSG_ACTIVITY_DELETED_ERR)
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/edit-workflow.html',
            controller: 'edit-workflow',
            backdrop: 'static',
            size: '50',
            resolve: {
                para: function () {
                    return id;
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    }

    $scope.isGrid = true;
    $scope.isDiagram = false;
    $scope.showDiagram = function () {
        $scope.isDiagram = true;
        $scope.isGrid = false;
        $rootScope.WorkflowId = null;
    }

    $scope.showGrid = function () {
        $scope.isDiagram = false;
        $scope.isGrid = true;
    }

    $scope.showMileStone = function () {

        if (!$(".milestone").hasClass("hidden")) {
            $(".milestone").addClass('hidden');
        } else {
            $(".milestone").removeClass('hidden');
        }
    }

    $scope.showWorkflowCat = function (code, id) {
        $rootScope.WorkflowId = id;
        $scope.isGrid = false;
        $scope.isDiagram = true;
        $scope.model.WfCode = code;
        setTimeout(function () {
            $scope.changeWf(code, id);
        }, 200);
    }

    $scope.publicWF = function (code, value) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmUpdate.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                if (value == 1) {
                    $scope.message = "Bạn có chắc chẳn bỏ duyệt luồng này?";
                }
                else {
                    $scope.message = caption.ACT_MSG_SURE_APPROVE_WF_CAT;
                }

                $scope.ok = function () {
                    dataservice.publicWF(code, function (rs) {
                        rs = rs.data;
                        if (rs.Error) {
                            App.toastrError(rs.Title);
                            $uibModalInstance.dismiss('cancel');
                        } else {
                            App.toastrSuccess(rs.Title);
                            $uibModalInstance.close();
                        }
                    })
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: '30',
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    }

    $scope.saveDiagram = function () {

        if ($scope.model.WfCode == "") {
            return App.toastrError(caption.ACT_MSG_PLS_SELECT_WF);
        }
        var data = [];
        var json = JSON.parse(dataweb);
        for (var i = 0; i < json.length; i++) {
            var obj = {
                ActCode: json[i].id,
                Shape: JSON.stringify(json[i]),
                WfCode: $scope.model.WfCode
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

    function loadDate() {
        $("#fromDate").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
        });
        $("#toDate").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {

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

    //Canvas
    var itemmmm;
    var canvas2;
    var dataweb = "";
    var checkdell = [];
    var timer;
    var time;
    var arr = [];
    var cu = 0;

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

        //get list for edit activity
        dataservice.getGroupStatus(function (rs) {
            rs = rs.data;
            $scope.lstStatus = rs;
        });
        dataservice.getMilesStone(function (rs) {
            rs = rs.data;
            $scope.lstMileStone = rs;
        });
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

    // region Activity
    var i = 1;
    $scope.createActivity = function () {
        if ($scope.model.WfCode == "") {
            return App.toastrError(caption.ACT_MSG_PLS_SELECT_WF);
        }
        check = 1;
        /////////add activity///////////
        var figure = new Activity_Label({});
        canvas.add(figure, 200, 150);
        // figure.setId(i);
        figure.setHeight(80);
        figure.setWidth(210);
        figure.setRadius(5);
        figure.attr({
            "bgColor": "#27AE60",
            "color": "#27AE60",
            "stroke": 0,
            "minHeight": 80,
            "minWidth": 230
        });

        figure.addCssClass("abc");

        /////////////////////////
        var lblTitleAct = new draw2d.shape.basic.Label({ text: "Activity " + i, height: 10, x: 10, y: 0, stroke: 0 });
        lblTitleAct.setWidth(150);

        lblTitleAct.setId(i);
        lblTitleAct.addCssClass("txt1");
        $rootScope.ActName = lblTitleAct;

        var txt2 = new draw2d.shape.basic.Label({ text: "", height: 10, x: 120, y: 80, stroke: 0, visible: false });
        txt2.setWidth(150);

        txt2.addCssClass("txt2");
        txt2.setId(i);
        $rootScope.ActDate = txt2;


        var lblStatusAct = new draw2d.shape.basic.Label({ text: "Initial", height: 10, x: 10, y: 60, stroke: 0 });
        lblStatusAct.setWidth(150);

        lblStatusAct.addCssClass("txt3");
        lblStatusAct.setId(i);

        var txt5 = new draw2d.shape.basic.Label({ text: "", height: 10, x: 25, y: 80, stroke: 0 });
        txt5.setWidth(150);

        txt5.addCssClass("txt5");
        txt5.setId(i);

        var labelCommand = new draw2d.shape.basic.Label({ text: "Lệnh", height: 10, x: 10, y: 20, stroke: 0 });
        labelCommand.setWidth(150);
        labelCommand.addCssClass("txt1");
        labelCommand.setId(i);

        var lblBack = new draw2d.shape.basic.Label({ text: "", height: 10, x: 170, y: -27, stroke: 0 });
        lblBack.setWidth(150);
        lblBack.setId(i);
        lblBack.addCssClass("txtCmd");

        var imgCmdBack = new draw2d.shape.basic.Image({ path: "/images/workflowActivity/refesh.svg", height: 23, width: 19, stroke: 1, x: 150, y: -28, visible: false });
        imgCmdBack.setId("imgBack");

        ////////////add text in activity///////////

        figure.add(lblTitleAct, new draw2d.layout.locator.Locator());
        figure.add(txt2, new draw2d.layout.locator.Locator());
        figure.add(lblStatusAct, new draw2d.layout.locator.Locator());

        var label = new draw2d.shape.basic.Label({ height: 22, stroke: 0.2, x: 0, y: -27, color: "#F2F5F5", bgColor: "#F2F5F5", visible: false });
        figure.add(label, new draw2d.layout.locator.Locator());
        label.addCssClass("lbicon");
        var label2 = new draw2d.shape.basic.Label({ height: 22, stroke: 0.2, x: 20, y: 81, color: "#F2F5F5", bgColor: "#F2F5F5", visible: false });
        figure.add(label2, new draw2d.layout.locator.Locator());
        label2.addCssClass("lbicon");

        var setting = new draw2d.shape.basic.Image({ path: "/images/workflowActivity/setting.png", height: 20, width: 20, stroke: 1, x: 0, y: -27, visible: false });
        figure.add(setting, new draw2d.layout.locator.Locator());
        setting.addCssClass("setting");
        var next = new draw2d.shape.basic.Image({ path: "/images/workflowActivity/next.svg", height: 20, width: 20, stroke: 1, x: 30, y: -27, visible: false });
        figure.add(next, new draw2d.layout.locator.Locator());
        next.addCssClass("next");
        var nextpage = new draw2d.shape.basic.Image({ path: "/images/workflowActivity/nextpage.svg", height: 20, width: 20, stroke: 1, x: 60, y: -27, visible: false });
        figure.add(nextpage, new draw2d.layout.locator.Locator());
        nextpage.addCssClass("nextpage");
        var coppy = new draw2d.shape.basic.Image({ path: "/images/workflowActivity/coppy.svg", height: 20, width: 20, stroke: 1, x: 90, y: -27, visible: false });
        figure.add(coppy, new draw2d.layout.locator.Locator());
        coppy.addCssClass("coppy");
        var del = new draw2d.shape.basic.Image({ path: "/images/workflowActivity/delete.png", height: 20, width: 20, stroke: 1, x: 120, y: -27, visible: false });
        figure.add(del, new draw2d.layout.locator.Locator());
        del.addCssClass("delll");
        var clock1 = new draw2d.shape.basic.Image({ path: "/images/workflowActivity/greenclock.svg", height: 30, width: 30, stroke: 1, x: -5, y: 80, visible: false });
        figure.add(clock1, new draw2d.layout.locator.Locator());
        clock1.setId("clock1");
        figure.add(txt5, new draw2d.layout.locator.Locator());
        figure.add(labelCommand, new draw2d.layout.locator.Locator());
        figure.add(lblBack, new draw2d.layout.locator.Locator());
        figure.add(imgCmdBack, new draw2d.layout.locator.Locator());
        var dem = 1;
        var c1;

        if (dem == 1) {
            c1 = figure.createPort("output");
            c1.attr({
                visible: false
            });

            c1.setHeight(17);
            c1.setWidth(17);

            dem++;
        }
        // figure db click//

        figure.on('dblclick', function () {

            var act = canvas.getPrimarySelection();
            var parseDataWeb = JSON.parse(dataweb);
            var jsonAct = "";
            for (var k = 0; k < parseDataWeb.length; k++) {
                if (parseDataWeb[k].id == act.id) {
                    jsonAct = JSON.stringify(parseDataWeb[k]);
                }
            }
            dataservice.checkActExist(act.id, function (rs) {
                rs = rs.data;
                if (rs) {
                    $rootScope.WfCatCode = $scope.model.WfCode;
                    var actCode = act.id;
                    $rootScope.ActivityCode = actCode;
                    $rootScope.ObjCode = actCode;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: ctxfolder + '/edit-activity.html',
                        controller: 'edit-activity',
                        backdrop: 'static',
                        size: '60',
                        resolve: {
                            para: function () {
                                return actCode;
                            }
                        }
                    });
                    modalInstance.result.then(function (d) {
                        $scope.changeWf($rootScope.WfCatCode);
                    }, function () {
                    });
                }
                else {
                    var data = {
                        IdAct: act.id,
                        WfCode: $scope.model.WfCode,
                        Json: jsonAct
                    }
                    $rootScope.WfCatCode = $scope.model.WfCode;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: ctxfolder + '/add-activity.html',
                        controller: 'addCatActivity',
                        backdrop: 'static',
                        size: '60',
                        resolve: {
                            para: function () {
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (d) {
                        //lblTitleAct.text = d.Name;
                        dataservice.getUnitName(d.Status, function (rs) {
                            rs = rs.data;
                            lblStatusAct.text = rs[0].Name;
                        })
                        $scope.changeWf($rootScope.WfCatCode);
                    }, function () {
                    });
                }
            })
        });

        ///acti click icon///
        figure.on("click", function () {
            //hiện icon
            if (setting.isVisible() == false && next.isVisible() == false && nextpage.isVisible() == false) {
                label.attr({
                    visible: true
                });
                setting.attr({
                    visible: true
                });
                next.attr({
                    visible: true
                });
                nextpage.attr({
                    visible: true
                });
                coppy.attr({
                    visible: true
                });
                del.attr({
                    visible: true
                });

            }
            if (setting.isVisible() == true && next.isVisible() == true && nextpage.isVisible() == true) {
                figure.on("dblclick", function () {
                    label.attr({
                        visible: false
                    });
                    setting.attr({
                        visible: false
                    });
                    next.attr({
                        visible: false
                    });
                    nextpage.attr({
                        visible: false
                    });
                    coppy.attr({
                        visible: false
                    });
                    del.attr({
                        visible: false
                    });
                });
            }
            ////////create connecttion button/////////
            next.on('click', function () {
                c1.attr({
                    visible: true
                });
                // c2.attr({
                //     visible: true
                // });

            });
            coppy.on('click', function (e) {
                clone = figure.clone(figure);
                x = figure.getX();
                y = figure.getY();

                canvas.add(clone, x, y + 100);
                updateLast();
            });
            nextpage.on("click", function () {
                var node = canvas.getPrimarySelection();
                node.setX(300);
                node.setY(300);



            });
            /////delete button////////
            del.on('click', function () {
                var node = canvas.getPrimarySelection();
                var command = new draw2d.command.CommandDelete(node);
                canvas.getCommandStack().execute(command);
            });

        });
        displayJSON(canvas);
        i++;
    }

    $scope.settingTransition = function () {
        if ($scope.model.WfCode == "") {
            return App.toastrError(caption.ACT_MSG_PLS_CREATE_WF_FIRST);
        }
        var data = {
            WorkflowCode: "",
            TransitionCode: "",
            ActivityInitial: "",
            ActivityDestination: ""
        };
        var node = null;
        node = canvas.getPrimarySelection();

        var parseDataweb = JSON.parse(dataweb);
        for (var k = 0; k < parseDataweb.length; k++) {
            if (parseDataweb[k].id == node.id) {

                data = {
                    WorkflowCode: $scope.model.WfCode,
                    TransitionCode: node.id,
                    ActivityInitial: parseDataweb[k].source.node,
                    ActivityDestination: parseDataweb[k].target.node
                };
                break;
            }
        }

        dataservice.checkWfSetting(data.ActivityInitial, data.ActivityDestination, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                if (rs.Object == null) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: ctxfolder + '/add-setting-transition.html',
                        controller: 'add-setting-transition',
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
                } else {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: ctxfolder + '/edit-setting-transition.html',
                        controller: 'edit-setting-transition',
                        backdrop: 'static',
                        size: '50',
                        resolve: {
                            para: function () {
                                return rs.Object;
                            }
                        }
                    });
                    modalInstance.result.then(function (d) {

                    }, function () {
                    });
                }
            }
        })
    }

    $scope.deleteSettingWF = function () {

        var node = canvas.getPrimarySelection();
        var data = {
            WorkflowCode: "",
            TransitionCode: "",
            ActivityInitial: "",
            ActivityDestination: ""
        };
        var parseDataweb = JSON.parse(dataweb);
        for (var k = 0; k < parseDataweb.length; k++) {
            if (parseDataweb[k].id == node.id) {

                data = {
                    WorkflowCode: $scope.model.WfCode,
                    TransitionCode: node.id,
                    ActivityInitial: parseDataweb[k].source.node,
                    ActivityDestination: parseDataweb[k].target.node
                };
                break;
            }
        }

        dataservice.deleteSettingWF(data.ActivityInitial, data.ActivityDestination, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                canvas2.remove(node);
            }
        })
    }

    $scope.changeWf = function (code, id) {
        $scope.model.WfInst = "";
        $rootScope.canvas2.clear();
        canvas2.clear();
        canvas.clear();
        $rootScope.WorkflowId = id;
        if (id != undefined) {
            dataservice.getItemWf(id, function (rs) {
                rs = rs.data;
                var wf = rs;
                if (wf.UserList != null && wf.UserList != '') {
                    $rootScope.ListUser = JSON.parse(wf.UserList);
                }
                else {
                    $rootScope.ListUser = [];
                }
            })
        }
        dataservice.countMilestone($scope.model.WfCode, function (rs) {
            rs = rs.data;
            var div = "";
            if (rs.length > 0) {
                for (var i = 0; i < rs.length; i++) {
                    div += '<div class ="' + rs[i].MileStoneCode + '" style="text-align:center;height: 1500px;  border: 1px solid red; margin:10px ;width:' + 1450 / rs[i].CountMileStone + 'px"><label style = "z-index: 2000;font-weight: 600;font-size:15px; margin-top: 50px; z-index: 999;">' + rs[i].MileStoneName + '</label></div>';
                    $(".milestone").html(div);
                }
            }
            else {
                $(".milestone").html("");
            }
            dataservice.getActivity($scope.model.WfCode, function (rs) {
                rs = rs.data;
                $scope.lstActivity = rs;
                var data_json = [];
                for (var i = 0; i < rs.length; i++) {
                    if (rs[i].shapJson != null) {
                        var jsons1 = JSON.parse(rs[i].shapJson);

                        data_json.push(jsons1);
                        jsons1.labels[0].text = rs[i].Title;
                        jsons1.labels[2].text = rs[i].Status;

                        var x = ($('.' + rs[i].MilestoneCode + '').position()).left;
                        var y = ($('.' + rs[i].MilestoneCode + '').position()).top;
                        //jsons1.x = x + 20;
                        //jsons1.y = 80 * (i + 1) + y;
                    }
                }
                dataservice.getTransition(code, function (res) {
                    $scope.lisTrs = res.data;
                    for (var k = 0; k < $scope.lisTrs.length; k++) {
                        var jsons2 = JSON.parse($scope.lisTrs[k].tranShapJson);
                        data_json.push(jsons2);
                        jsons2.source.node = $scope.lisTrs[k].actintial;
                        jsons2.target.node = $scope.lisTrs[k].actdes;
                        jsons2.id = $scope.lisTrs[k].IdAutoGen;
                    }
                    var reader = new draw2d.io.json.Reader();
                    reader.unmarshal(canvas, data_json);
                    displayJSON(canvas);

                    $scope.updateLast();
                });
            })
        })
    }

    $scope.viewFile = function (fileCode, url) {
        var data = {
            ActInstCode: $scope.model.ActivityInstCode,
            FileCode: fileCode,
            Url: url
        };

        var extension = url.substr(url.lastIndexOf('.') + 1);
        var word = ['DOCX', 'DOC'];
        var pdf = ['PDF'];
        var excel = ['XLS', 'XLSX'];
        if (word.indexOf(extension.toUpperCase()) !== -1) {
            dataservice.viewFileOnline(data, function (rs) {
                window.open('/Docman#', '_blank');
            });
        }
        else if (pdf.indexOf(extension.toUpperCase()) !== -1) {
            dataservice.viewFileOnline(data, function (rs) {
                window.open('/PDF#', '_blank');
            });
        }
        else if (excel.indexOf(extension.toUpperCase()) !== -1) {
            dataservice.viewFileOnline(data, function (rs) {
                window.open('/Excel#', '_blank');
            });
        }
        else {
            window.open(url, '_blank');
        }
    }

    //Show canvas or Card job
    $scope.isWF = true;
    $scope.changeTypeView = function () {
        if ($scope.isWF) {
            $scope.isWF = false;
            document.getElementById("main-content-vatco").style.paddingLeft = "0px !important";
        }
        else {
            $scope.isWF = true;
        }
    }

    $scope.modelEditActivity = {
        ActivityCode: "",
        Title: "",
        Duration: "",
        Unit: "",
        Group: "",
        Type: "",
        Status: "",
        Located: "",
        MileStone: "",
        WorkflowCode: "",
        ShapeJson: "",
        Desc: ""
    }

    $scope.updateLast = function () {
        setTimeout(function () {
            $(".setting").on('click', function () {
                var act = $rootScope.canvas2.getPrimarySelection();
                myService.setId(act.id);
                var obj = {
                    ActCode: act.id
                }
                dataservice.getItemActivity(obj, function (rs) {
                    rs = rs.data;
                    var listGroup=rs.ListGroupData;
                    $scope.modelEditActivity = rs;
                    $rootScope.ActivityCode=$scope.modelEditActivity.ActivityCode;

                    if (listGroup != '' && listGroup != null && listGroup != undefined)
                        $scope.modelEditActivity.ListGroupData = listGroup.split(',');
                    else  $scope.modelEditActivity.ListGroupData=[];

                    $rootScope.ActivityName = $scope.modelEditActivity.Title;
                    
                    $scope.$apply()
                    
                    dataservice.getMileStoneAct(para, function (rs) {
                        rs = rs.data;
                        $scope.modelEditActivity.MileStone = rs;
                    })
                    $scope.oldType = angular.copy($scope.modelEditActivity.Type);
                })
                $scope.editActivity();
                // dataservice.checkActExist(act.id, function (rs) {
                //     rs = rs.data;
                //     if (rs) {
                //         var actCode = act.id;
                //         $rootScope.ActivityCode = actCode;
                //         $rootScope.ObjCode = actCode;
                //         $rootScope.WfCatCode = $scope.model.WfCode;
                //         var modalInstance = $uibModal.open({
                //             animation: true,
                //             templateUrl: ctxfolder + '/edit-activity.html',
                //             controller: 'edit-activity',
                //             backdrop: 'static',
                //             size: '60',
                //             resolve: {
                //                 para: function () {
                //                     return actCode;
                //                 }
                //             }
                //         });
                //         modalInstance.result.then(function (d) {
                //             $scope.changeWf($rootScope.WfCatCode, $rootScope.WorkflowId);
                //         }, function () {
                //         });
                //     }
                //     else {
                //         var parseDataWeb = JSON.parse(dataweb);
                //         var jsonAct = "";
                //         for (var k = 0; k < parseDataWeb.length; k++) {
                //             if (parseDataWeb[k].id == act.id) {
                //                 jsonAct = JSON.stringify(parseDataWeb[k]);
                //             }
                //         }
                //         var data = {
                //             IdAct: act.id,
                //             WfCode: $scope.model.WfCode,
                //             Json: jsonAct
                //         }
                //         $rootScope.WfCatCode = $scope.model.WfCode;
                //         var modalInstance = $uibModal.open({
                //             animation: true,
                //             templateUrl: ctxfolder + '/add-activity.html',
                //             controller: 'addCatActivity',
                //             backdrop: 'static',
                //             size: '60',
                //             resolve: {
                //                 para: function () {
                //                     return data;
                //                 }
                //             }
                //         });
                //         modalInstance.result.then(function (d) {
                //             $scope.changeWf($rootScope.WfCatCode, $rootScope.WorkflowId);
                //         }, function () {
                //         });
                //     }
                // })
            })
            $('.delll').on('click', function () {
                $scope.deleteAct = function () {
                    var node = $rootScope.canvas2.getPrimarySelection();
                    console.log(node);
                    for (var userIndex in $rootScope.ListUser) {
                        if (userIndex != -1) {
                            actIndex = $rootScope.ListUser[userIndex].activity_role.findIndex(x => x.activity_code == node.id);
                            if (actIndex != -1) {
                                $rootScope.ListUser[userIndex].activity_role.splice(actIndex, 1);
                                if ($rootScope.ListUser[userIndex].activity_role.length == 0) {
                                    $rootScope.ListUser.splice(userIndex, 1);
                                }
                            }
                        }
                    }
                    var wfData = {
                        WfCode: $scope.model.WfCode,
                        UserList: JSON.stringify($rootScope.ListUser)
                    }
                    dataservice.updateWfUserList(wfData, function (rs) {
                        rs = rs.data;
                        if (rs.Error) {
                            App.toastrError(rs.Title);
                        }
                        else {

                        }
                    })
                    dataservice.delCatActivity(node.id, function (rs) {
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
            $(".auto").click(function () {
                var node = $rootScope.canvas2.getPrimarySelection();
                var del = new draw2d.shape.basic.Image({ path: "/images/workflowActivity/delete.png", height: 25, width: 25, stroke: 1, x: 23, y: -30, visible: true });
                var settting2 = new draw2d.shape.basic.Image({ path: "/images/workflowActivity/setting.png", height: 25, width: 25, stroke: 1, x: -8, y: -30, visible: true });

                if (!node.children.data[0].figure.children.data.length) {
                    node.children.data[0].figure.add(del, new draw2d.layout.locator.Locator());
                    node.children.data[0].figure.children.data[0].figure.attr({
                        cssClass: "dell2",
                        visible: true
                    });
                    node.children.data[0].figure.add(settting2, new draw2d.layout.locator.Locator());
                    node.children.data[0].figure.children.data[1].figure.attr({
                        cssClass: "setting2",
                        visible: true
                    });
                    settting2.on("click", function () {
                        $scope.settingTransition();
                    })
                    del.on("click", function () {
                        $scope.deleteSettingWF();
                    })
                }
            });
        }, 2000);
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

    function displayJSON(canvas) {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(canvas, function (json) {
            $("#json").text(JSON.stringify(json, null, 2));
            dataweb = JSON.stringify(json, null, 2);
        });
    }

    $scope.isEditActivity = false;
    $scope.editActivity = function(){
        $scope.isEditActivity = !$scope.isEditActivity;
        if ($scope.isEditActivity == true) {
            $('.parent_svg').css('width', '1000px');
            $('.milestone').css('width', '1000px');
            $('.menu-3').css('width', '500px');
            $('.menu-3').css('height', 'auto');
            $('.menu-right').css('left', '1050px');
            $('.menu-bottom').css('left', '800px');
        }else{
            $('.parent_svg').css('width', '2000px');
            $('.milestone').css('width', '2000px');
            $('.menu-3').removeAttr('style');
            $('.menu-right').removeAttr('style');
            $('.menu-bottom').removeAttr('style');
        }
        
        setTimeout(() => $scope.$apply());
    }

    $scope.checkHiddenInfo = false;
    $scope.checkHiddenAssign = false;
    $scope.checkHiddenSettingValue = false;
    $scope.checkHiddenFile = false;
    $scope.checkHiddenDescription = false;
    $scope.checkHiddenChild = false;
    $scope.checkHiddenDefault = false;

    document.getElementById("toggleInfo").addEventListener("click", function() {
        $scope.$apply(function() {
            $scope.checkHiddenInfo = !$scope.checkHiddenInfo;
            toggleContent("Info");
        });
    });

    document.getElementById("toggleAssign").addEventListener("click", function() {
        $scope.$apply(function() {
            $scope.checkHiddenAssign = !$scope.checkHiddenAssign;
            toggleContent("Assign");
        });
    });
    
    document.getElementById("toggleSettingValue").addEventListener("click", function() {
        $scope.$apply(function() {
            $scope.checkHiddenSettingValue = !$scope.checkHiddenSettingValue;
            toggleContent("SettingValue");
        });
    });

    document.getElementById("toggleFile").addEventListener("click", function() {
        $scope.$apply(function() {
            $scope.checkHiddenFile = !$scope.checkHiddenFile;
            toggleContent("File");
        });
    });

    document.getElementById("toggleDescription").addEventListener("click", function() {
        $scope.$apply(function() {
            $scope.checkHiddenDescription = !$scope.checkHiddenDescription;
            toggleContent("Description");
        });
    });

    document.getElementById("toggleChild").addEventListener("click", function() {
        $scope.$apply(function() {
            $scope.checkHiddenChild = !$scope.checkHiddenChild;
            toggleContent("Child");
        });
    });

    document.getElementById("toggleDefault").addEventListener("click", function() {
        $scope.$apply(function() {
            $scope.checkHiddenDefault = !$scope.checkHiddenDefault;
            toggleContent("Default");
        });
    });
    
    function toggleContent(contentId) {
        var content = document.getElementById(contentId);
        content.style.display = content.style.display == "none" || content.style.display == "" ? "block" : "none";
    }

    $scope.oldType = "";
    var node = $rootScope.canvas2.getPrimarySelection();

    $rootScope.isAdded = true;

    $scope.submit = function () {
        // var data = CKEDITOR.instances['description'].getData();
        // $scope.modelEditActivity.Desc = data;
        validationSelect($scope.modelEditActivity);
        console.log("Activity Update",$scope.modelEditActivity)
        if ($scope.addform.validate() && !validationSelect($scope.modelEditActivity).Status) {
            var temp = $rootScope.checkData($scope.modelEditActivity);
            if (temp.Status) {
                App.toastrError(temp.Title);
                return;
            }
            var parseJsonData = JSON.parse($scope.modelEditActivity.ShapeJson);
            if ($scope.modelEditActivity.Type == "TYPE_ACTIVITY_INITIAL") {
                parseJsonData.bgColor = "rgba(0,99,177,1)";
                parseJsonData.color = "rgba(0,99,177,1)";
            }
            else if ($scope.modelEditActivity.Type == "TYPE_ACTIVITY_END") {
                parseJsonData.bgColor = "rgba(165,42,42,1)";
                parseJsonData.color = "rgba(165,42,42,1)";
            }
            else {
                parseJsonData.bgColor = "rgba(60, 179, 113, 1)";
                parseJsonData.color = "rgba(60, 179, 113, 1)";
            }
            $scope.modelEditActivity.ShapeJson=JSON.stringify(parseJsonData);
            
            dataservice.updateActivity($scope.modelEditActivity, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    //$uibModalInstance.close();
                    var node = $rootScope.canvas2.getPrimarySelection();
                    node.children.data[0].figure.attr({
                        text: $scope.modelEditActivity.Title
                    });
                    if ($scope.modelEditActivity.Type == "TYPE_ACTIVITY_INITIAL") {
                        node.bgColor.alpha = 1;
                        node.bgColor.blue = 177;
                        node.bgColor.green = 99;
                        node.bgColor.hashString = "#0063B1";
                        node.bgColor.red = 0;
                    }
                    else if ($scope.modelEditActivity.Type == "TYPE_ACTIVITY_END") {
                        node.bgColor.alpha = 1;
                        node.bgColor.blue = 42;
                        node.bgColor.green = 42;
                        node.bgColor.hashString = "#A52A2A";
                        node.bgColor.red = 165;
                    }
                    else {
                        node.bgColor.alpha = 1;
                        node.bgColor.blue = 113;
                        node.bgColor.green = 179;
                        node.bgColor.hashString = "#3CB371";
                        node.bgColor.red = 60;
                    }
                    node.repaint(); 
                }
            });
        }
    }

    $scope.save = function () {
        var obj = {
            ActivityCode: $scope.modelEditActivity.ActivityCode,
            ListGroupData: $scope.modelEditActivity.ListGroupData.join(",")
        };

        dataservice.updateGroupDataActivity(obj, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
            }
        });
    }

    $scope.changeName = function () {
        $rootScope.ActivityName = $scope.model.Title;
    }

    $scope.changeSelect = function (SelectType) {
        if (SelectType == "Unit" && $scope.model.Unit != "") {
            $scope.errorUnit = false;
        }
        if (SelectType == "Group" && $scope.model.Group != "") {
            $scope.errorGroup = false;
        }
        if (SelectType == "Type" && $scope.model.Type != "") {
            $scope.errorType = false;
            if ($scope.oldType !== "TYPE_ACTIVITY_INITIAL" && $scope.model.Type === "TYPE_ACTIVITY_INITIAL") {
                dataservice.checkTypeInitial($scope.model.WorkflowCode, function (rs) {
                    rs = rs.data;
                    if (rs) {
                        $scope.model.Type = "";
                        App.toastrError(caption.ACT_MSG_WF_STATUS_INITIAL_EXIST);
                    }
                })
            }

            if ($scope.model.Type === "TYPE_ACTIVITY_END") {
                dataservice.checkTypeEndAct($scope.model.WorkflowCode
                    , function (rs) {
                        rs = rs.data;
                        if (rs) {
                            $scope.model.Type = "";
                            App.toastrError(caption.ACT_MSG_WF_STATUS_END_EXIST);
                        }
                    })
            }
        }
        if (SelectType == "Status" && $scope.model.Status != "") {
            $scope.errorStatus = false;
        }
        if (SelectType == "MileStone" && $scope.model.MileStone != "") {
            $scope.errorMileStone = false;
        }

    }

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

    $scope.addMileStone = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCommonSetting + "/detail.html",
            controller: 'detail',
            size: '50',
            backdrop: 'static',
            resolve: {
                para: function () {
                    return {
                        Group: 'MILE_STONE',
                        GroupNote: 'Mốc',
                        AssetCode: 'MILE_STONE'
                    }
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataservice.getMilesStone(function (rs) {
                rs = rs.data;
                $scope.lstMileStone = rs;
            })
        }, function () { });
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }

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

        if (data.MileStone == "") {
            $scope.errorMileStone = true;
            mess.Status = true;
        } else {
            $scope.errorMileStone = false;
        }

        return mess;
    };

    //File
    $scope.fileManage = function () {
        var para = myService.getId();
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/fileManage.html',
            controller: 'fileManage',
            backdrop: 'static',
            size: '60',
            resolve: {
                para: function () {
                    return para;
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataservice.getAttachment(para, function (rs) {
                rs = rs.data;
                $scope.attachments = rs;
            })
        }, function () {
        });
    }

    $scope.fileAttachment = {
        
        FileName: "",
        FilePath: "",
        ActivityCode: myService.getId(),
        FileType: "",
        FileSize: 0,
        ParentFile: ""
    }

    $scope.addAttachment = function () {
        $("#fileAttachment").trigger("click");
    }

    $scope.loadAttachment = function (event) {
        var para = myService.getId();
        var file = event.target.files[0];
        if (file != undefined) {
            var size = file.size;;
            var data = new FormData();
            data.append("FileUpload", file);
            data.append("ActivityCode", para)
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
                        ActivityCode: para,
                        FileType: "." + extFile,
                        FileSize: size
                    }
                    $('#fileAttachment').replaceWith($('#fileAttachment').val('').clone(true));
                }
            });
        }
    }

    $scope.insertFile = function () {
        var para = myService.getId();
        dataservice.addAttachment($scope.fileAttachment, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getAttachment(para, function (rs) {
                    rs = rs.data;
                    $scope.attachments = rs;
                })
            }
        })
    }

    $scope.deleteAttachment = function (fileCode, type) {
        var para = myService.getId();
        var data = {
            FileCode: fileCode,
            Type: type,
            ActCode: para
        };
        dataservice.deleteAttachment(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getAttachment(para, function (rs) {
                    rs = rs.data;
                    $scope.attachments = rs;
                })
            }
        })
    }

    $scope.downloadAttach = function (url, code, type) {
        
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

    $scope.viewFile = function (fileCode, url) {
        var para = myService.getId();
        var data = {
            ActCode: para,
            FileCode: fileCode,
            Url: url
        };

        var extension = url.substr(url.lastIndexOf('.') + 1);
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
    }

    var editor;
    function ckEditer() {
        editor = CKEDITOR.replace('description', {
            cloudServices_tokenUrl: '/MobileApp/Token',
            cloudServices_uploadUrl: '/MobileApp/UploadFile',
            filebrowserBrowseUrl: '',
            filebrowserUploadUrl: '/MobileApp/Upload',
            embed_provider: '/uploader/upload.php'
        });
    }

    setTimeout(function () {
        ckEditer();
    }, 1000);
    setTimeout(function () {

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
        WfNote: "",
        ObjectType: ""
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
        dataservice.getObjTypeJC(function (rs) {
            rs = rs.data;
            $scope.listObjType = rs;
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

    $scope.changeObj = function (item) {
        $scope.model.WfName = item.Name;
        $scope.errorObjectType = false;
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

        if (data.ObjectType == "") {
            $scope.errorObjectType = true;
            mess.Status = true;
        } else {
            $scope.errorObjectType = false;
        }

        return mess;
    };

    setTimeout(function () {
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
        WfNote: "",
        ObjectType: ""
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
            if ($scope.model.UserList != null && $scope.model.UserList != '') {
                $scope.listUser = JSON.parse($scope.model.UserList);
            }
        })
        dataservice.getObjTypeJC(function (rs) {
            rs = rs.data;
            $scope.listObjType = rs;
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

    $scope.changeObj = function (item) {
        $scope.errorObjectType = false;
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

        if (data.ObjectType == "") {
            $scope.errorObjectType = true;
            mess.Status = true;
        } else {
            $scope.errorObjectType = false;
        }

        return mess;
    };

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('add-wf-design-old', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, DTColumnBuilder, DTInstances, dataservice, $filter) {
    $scope.model = {
        Type: '',
        Note: ''
    }
    $scope.modelFolw = {
        ActCode: '',
        Role: '',
        DepartCode: '',
        BranchCode: '',
    }
    $scope.modelObj = {
        ActCode: '',
        Priority: '',
        LimitTime: '',
        UnitTime: ''
    }
    $scope.listWorkFlow = [];
    $scope.initLoad = function () {
        dataservice.getActivity(function (rs) {
            $scope.listAct = rs.data;
        });
        dataservice.getPriority(function (rs) {
            $scope.listPrio = rs.data;
        });
        dataservice.getRolesWorkFlow(function (rs) {
            $scope.listRoles = rs.data;
        });
        dataservice.getDepartmentWorkFlow(function (rs) {
            $rootScope.listDepartment = rs.data;
        });
        dataservice.getBranchWorkFlow(function (rs) {
            $rootScope.listBranch = rs.data;
        });
        dataservice.getProperties(function (rs) {
            $scope.listWorkFlowProperty = rs.data;
        });
        dataservice.getUnit(function (rs) {
            $scope.listUnit = rs.data;
        });
        dataservice.getTypeWorkFlow(function (rs) {
            rs = rs.data;
            $scope.lstType = rs;
        })
    }
    $scope.initLoad();
    $scope.cancel = function () {
        $rootScope.WorkFlowCode = '';
        $uibModalInstance.close('cancel');
    };
    $scope.submit = function () {
        if ($scope.addform.validate()) {
            dataservice.insert($scope.model, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                    $rootScope.WorkFlowCode = $scope.model.WorkFlowCode;
                    $rootScope.reloadActivity();
                }
            });
        }
    }
    $scope.addWorkFlow = function () {
        validationSelectFlow($scope.modelFolw);
        if (!validationSelectFlow($scope.modelFolw).Status) {
            var temp = $rootScope.checkData($scope.modelFolw);
            if (temp.Status) {
                App.toastrError(temp.Title);
                return;
            }
            $scope.modelFolw.WorkFlowCode = $rootScope.WorkFlowCode;
            dataservice.insertWorkFlow($scope.modelFolw, function (result) {
                var rs = result.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    dataservice.getWorkFlow($scope.modelFolw.WorkFlowCode, function (rs) {
                        rs = rs.data;
                        $scope.listWorkFlow = rs;
                    });
                }
            });
        }
    }
    $scope.addActiviy = function () {
        validationSelect($scope.modelObj);
        $scope.modelObj.WorkFlowCode = $rootScope.WorkFlowCode;
        if ($scope.activity.validate() && !validationSelect($scope.modelObj).Status) {
            dataservice.insertActivity($scope.modelObj, function (result) {
                if (result.data.Error) {
                    App.toastrError(result.data.Title);
                } else {
                    App.toastrSuccess(result.data.Title);
                    dataservice.getObjActivity($rootScope.WorkFlowCode, function (rs) {
                        $scope.listObjAct = rs.data;
                    });
                }
            });
        }
    }
    $scope.delete = function (id) {
        dataservice.deleteActivity(id, function (rs) {
            console.log('delete Act');
            if (rs.data.Error) {
                App.toastrError(rs.data.Title);
            } else {
                App.toastrSuccess(rs.data.Title);
                dataservice.getObjActivity($rootScope.WorkFlowCode, function (rs) {
                    rs = rs.data;
                    $scope.modelAct.listObjAct = rs;
                });
            }
        });
    }
    $scope.deleteWorkFlow = function (id) {
        dataservice.deleteWorkflowActRole(id, function (rs) {
            if (rs.data.Error) {
                App.toastrError(rs.data.Title);
            } else {
                App.toastrSuccess(rs.data.Title);
                dataservice.getWorkFlow($rootScope.WorkFlowCode, function (rs) {
                    rs = rs.data;
                    $scope.listWorkFlow = rs;
                });
            }
        });
    }
    $scope.changeSelect = function (SelectType) {
        if (SelectType == "ActCode" && $scope.modelAct.ActCode != "") {
            $scope.errorActCode = false;
        }
        if (SelectType == "Priority" && $scope.modelAct.Priority != "") {
            $scope.errorPriority = false;
        }


        if (SelectType == "ActCodeFlow" && $scope.modelFolw.ActCode != "") {
            $scope.errorActCodeFlow = false;
        }
        if (SelectType == "BranchCode" && $scope.modelFolw.BranchCode != "") {
            $scope.errorBranchCode = false;
        }
        if (SelectType == "DepartCode" && $scope.modelFolw.DepartCode != "") {
            $scope.errorDepartCode = false;
        }
        if (SelectType == "Role" && $scope.modelFolw.Role != "") {
            $scope.errorRole = false;
        }
    }
    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        //Check null 
        if (data.ActCode == "") {
            $scope.errorActCode = true;
            mess.Status = true;
        } else {
            $scope.errorActCode = false;
        }
        return mess;
    };
    function validationSelectFlow(data) {
        var mess = { Status: false, Title: "" }
        //Check null 


        if (data.ActCode == "") {
            $scope.errorActCodeFlow = true;
            mess.Status = true;
        } else {
            $scope.errorActCodeFlow = false;
        }

        if (data.BranchCode == "") {
            $scope.errorBranchCode = true;
            mess.Status = true;
        } else {
            $scope.errorBranchCode = false;
        }

        if (data.DepartCode == "") {
            $scope.errorDepartCode = true;
            mess.Status = true;
        } else {
            $scope.errorDepartCode = false;
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
        initDateTime();
        setModalDraggable('.modal-dialog');
        setModalMaxHeight('.modal');
    }, 200);
});

app.controller('edit', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, dataservice, $filter, para) {
    $scope.model = {

    }
    $scope.modelFolw = {
        ActCode: '',
        Role: '',
        DepartCode: '',
        BranchCode: '',
    }
    $scope.modelObj = {
        ActCode: '',
        Priority: '',
        LimitTime: '',
        UnitTime: ''
    }
    $scope.cancel = function () {
        $rootScope.WorkFlowCode = '';
        $uibModalInstance.dismiss('cancel');
    };
    $scope.initData = function () {
        $scope.model = para;
        $rootScope.WorkFlowCode = $scope.model.WorkFlowCode;
        dataservice.getObjActivity($scope.model.WorkFlowCode, function (rs) {
            $scope.listObjAct = rs.data;
        });
        dataservice.getWorkFlow($scope.model.WorkFlowCode, function (rs) {
            $scope.listWorkFlow = rs.data;
        });
        dataservice.getActivity(function (rs) {
            rs = rs.data;
            $scope.listAct = rs;
        });
        dataservice.getPriority(function (rs) {
            $scope.listPrio = rs.data;
        });
        dataservice.getRolesWorkFlow(function (rs) {
            $scope.listRoles = rs.data;
        });
        dataservice.getDepartmentWorkFlow(function (rs) {
            $rootScope.listDepartment = rs.data;
        });
        dataservice.getBranchWorkFlow(function (rs) {
            $rootScope.listBranch = rs.data;
        });
        dataservice.getProperties(function (rs) {
            $scope.listWorkFlowProperty = rs.data;
        });
        dataservice.getUnit(function (rs) {
            $scope.listUnit = rs.data;
        });
        dataservice.getTypeWorkFlow(function (rs) {
            rs = rs.data;
            $scope.lstType = rs;
        })
    };
    $scope.initData();
    $scope.submit = function () {
        validationSelect($scope.model);
        if ($scope.editform.validate() && !validationSelect($scope.model).Status) {
            var temp = $rootScope.checkData($scope.model);
            if (temp.Status) {
                App.toastrError(temp.Title);
                return;
            }
            dataservice.update($scope.model, function (result) {
                //rs = rs.data;
                if (result.Error) {
                    App.toastrError(result.data.Title);
                } else {
                    App.toastrSuccess(result.data.Title);
                    $uibModalInstance.close();
                    $rootScope.reloadActivity();
                }
            });
        }
    }

    $scope.addWorkFlow = function () {
        validationSelectFlow($scope.modelFolw);

        if (!validationSelectFlow($scope.modelFolw).Status) {
            var temp = $rootScope.checkData($scope.modelFolw);
            if (temp.Status) {
                App.toastrError(temp.Title);
                return;
            }
            $scope.modelFolw.WorkFlowCode = $rootScope.WorkFlowCode;
            dataservice.insertWorkFlow($scope.modelFolw, function (result) {
                var rs = result.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    dataservice.getWorkFlow($scope.modelFolw.WorkFlowCode, function (rs) {
                        rs = rs.data;
                        $scope.listWorkFlow = rs;
                    });
                }
            });
        }
    }
    $scope.addActiviy = function () {
        validationSelect($scope.modelObj);
        $scope.modelObj.WorkFlowCode = $rootScope.WorkFlowCode;

        if ($scope.activity.validate() && !validationSelect($scope.modelObj).Status) {
            dataservice.insertActivity($scope.modelObj, function (result) {
                //rs = rs.data;
                if (result.data.Error) {
                    App.toastrError(result.data.Title);
                } else {
                    App.toastrSuccess(result.data.Title);
                    dataservice.getObjActivity($scope.model.WorkFlowCode, function (rs) {
                        rs = rs.data;
                        $scope.listObjAct = rs;
                    });
                }
            });
        }
    }
    $scope.delete = function (id) {
        dataservice.deleteActivity(id, function (rs) {
            if (rs.data.Error) {
                App.toastrError(rs.data.Title);
            } else {
                App.toastrSuccess(rs.data.Title);
                dataservice.getObjActivity($rootScope.WorkFlowCode, function (rs) {
                    rs = rs.data;
                    $scope.listObjAct = rs;
                });
            }
        });
    }
    $scope.deleteWorkFlow = function (id) {
        dataservice.deleteWorkflowActRole(id, function (rs) {
            if (rs.data.Error) {
                App.toastrError(rs.data.Title);
            } else {
                App.toastrSuccess(rs.data.Title);
                dataservice.getWorkFlow($rootScope.WorkFlowCode, function (rs) {
                    rs = rs.data;
                    $scope.listWorkFlow = rs;
                });
            }
        });
    }
    $scope.changeSelect = function (SelectType) {
        if (SelectType == "ActCode" && $scope.modelAct.ActCode != "") {
            $scope.errorActCode = false;
        }
        if (SelectType == "Priority" && $scope.modelAct.Priority != "") {
            $scope.errorPriority = false;
        }

        if (SelectType == "ActCodeFlow" && $scope.modelFolw.ActCode != "") {
            $scope.errorActCodeFlow = false;
        }
        if (SelectType == "BranchCode" && $scope.modelFolw.BranchCode != "") {
            $scope.errorBranchCode = false;
        }
        if (SelectType == "DepartCode" && $scope.modelFolw.DepartCode != "") {
            $scope.errorDepartCode = false;
        }
        if (SelectType == "Role" && $scope.modelFolw.Role != "") {
            $scope.errorRole = false;
        }
    }
    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        //Check null 
        if (data.ActCode == "") {
            $scope.errorActCode = true;
            mess.Status = true;
        } else {
            $scope.errorActCode = false;
        }
        return mess;
    };
    function validationSelectFlow(data) {
        var mess = { Status: false, Title: "" }
        //Check null 


        if (data.ActCode == "") {
            $scope.errorActCodeFlow = true;
            mess.Status = true;
        } else {
            $scope.errorActCodeFlow = false;
        }

        if (data.BranchCode == "") {
            $scope.errorBranchCode = true;
            mess.Status = true;
        } else {
            $scope.errorBranchCode = false;
        }

        if (data.DepartCode == "") {
            $scope.errorDepartCode = true;
            mess.Status = true;
        } else {
            $scope.errorDepartCode = false;
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
        $("#datefrom").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
            $('#dateto').datepicker('setStartDate', maxDate);
        });
        $("#dateto").datepicker({
            inline: false,
            autoclose: true,
            format: "dd/mm/yyyy",
            fontAwesome: true,
        }).on('changeDate', function (selected) {
            //var maxDate = new Date(selected.date.valueOf());
            //$('#datefrom').datepicker('setEndDate', maxDate);
        });
        setModalDraggable('.modal-dialog');
        setModalMaxHeight('.modal');
    }, 100);
});

app.controller('fileAddActivity', function ($scope, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataservice, para) {
    $scope.treeDataCategory = [];
    $scope.catCode = para.CatCode;
    $scope.model = {
        NumberDocument: '',
        Tags: '',
        Desc: ''
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
            if (data.FolderId == '' || data.FolderId == null) {
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
            if (full.FolderId == '' || full.FolderId == null) {
                if (para.Path == full.Path) {
                    $scope.selected[full.Id] = true;
                } else {
                    $scope.selected[full.Id] = false;
                }
            } else {
                if (para.FolderId == full.FolderId) {
                    $scope.selected[full.Id] = true;
                } else {
                    $scope.selected[full.Id] = false;
                }
            }

            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.Id + ']" ng-click="toggleOne(selected,$event,' + full.Id + ')"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass', ''));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FolderName').notSortable().withTitle('{{"ACT_LIST_COL_FODER_SAVE" | translate}}').withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
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

    $scope.loadFile = function (event) {
        $scope.file = event.target.files[0];
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.submit = function () {
        if ($scope.file == '' || $scope.file == undefined) {
            App.toastrError(caption.COM_MSG_CHOSE_FILE);
        } else {
            var itemSelect = [];
            for (var id in $scope.selected) {
                if ($scope.selected.hasOwnProperty(id)) {
                    if ($scope.selected[id]) {
                        itemSelect.push(id);
                    }
                }
            }
            if (itemSelect.length == 0) {
                App.toastrError(caption.CUS_ERROR_CHOOSE_FILE);
                return;
            } else if (itemSelect.length > 1) {
                App.toastrError(caption.CUS_ERROR_CHOOSE_ONE_FILE);
                return;
            }
            var data = new FormData();
            data.append("CateRepoSettingId", itemSelect.length != 0 ? itemSelect[0] : "");
            data.append("FileUpload", $scope.file);
            data.append("FileName", $scope.file.name);
            data.append("Desc", $scope.model.Desc);
            data.append("Tags", $scope.model.Tags);
            data.append("NumberDocument", $scope.model.NumberDocument);
            data.append("AssetCode", $rootScope.WorkFlowCode);
            data.append("IsMore", true);
            dataservice.insertActivityFile(data, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                    $uibModalInstance.close();
                }
            });
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
            dataservice.getTreeCategory(function (result) {
                result = result.data;
                if (!result.Error) {
                    var root = {
                        id: 'root',
                        parent: "#",
                        text: caption.ASSET_ALLO_ALL_CATEGORY,//"Tất cả kho dữ liệu"
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
                                state: { selected: result[i].Code == para.CatCode ? true : false, opened: true }
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
                                state: { selected: result[i].Code == para.CatCode ? true : false, opened: true }
                            }
                            $scope.treeDataCategory.push(data);
                        }
                    }
                    App.unblockUI("#contentMainRepository");
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
    }, 200);
});

app.controller('fileEditActivity', function ($scope, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModal, $uibModalInstance, dataservice, para) {
    $scope.treeDataCategory = [];
    $scope.catCode = para.CateRepoSettingCode;
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
    vm.dtColumns.push(DTColumnBuilder.newColumn('FolderName').withOption('sClass', '').withTitle('{{ "CUS_TITLE_FOLDER" | translate }}').withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
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
        $scope.model.NumberDocument = para.NumberDocument;
        $scope.model.Tags = (para.Tags != '' && para.Tags != null) ? para.Tags.split(',') : [];
        $scope.model.Desc = para.Desc;
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
            App.toastrError(caption.CUS_ERROR_CHOOSE_FILE);
        } else if (itemSelect.length > 1) {
            App.toastrError(caption.CUS_ERROR_CHOOSE_ONE_FILE);
        } else {
            if ($scope.editformfile.validate()) {
                var data = new FormData();
                data.append("CateRepoSettingId", itemSelect[0]);
                data.append("FileCode", para.FileCode);
                data.append("Desc", $scope.model.Desc);
                data.append("Tags", $scope.model.Tags);
                data.append("NumberDocument", $scope.model.NumberDocument);
                data.append("AssetCode", $rootScope.WorkFlowCode);
                dataservice.updateAssetFile(data, function (result) {
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
            dataservice.getTreeCategory(function (result) {
                result = result.data;
                if (!result.Error) {
                    var root = {
                        id: 'root',
                        parent: "#",
                        text: caption.ASSET_ALLO_ALL_CATEGORY,//"Tất cả kho dữ liệu"
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
                                state: { selected: result[i].Code == para.CateRepoSettingCode ? true : false, opened: true }
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
                                state: { selected: result[i].Code == para.CateRepoSettingCode ? true : false, opened: true }
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

app.controller('fileShareActivity', function ($scope, $rootScope, $compile, $uibModalInstance, dataservice) {
    $scope.model = {
        ObjectCodeShared: $rootScope.WorkFlowCode,
        ObjectTypeShared: 'ASSET',
        ObjectType: '',
        ObjectCode: '',
        FileCode: '',
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.init = function () {
        dataservice.getListObjectTypeShare(function (rs) {
            rs = rs.data;
            $scope.listObjType = rs;
        });
        dataservice.getListFileWithObject($scope.model.ObjectCodeShared, $scope.model.ObjectTypeShared, function (rs) {
            rs = rs.data;
            $scope.listFileObject = rs;
        });
        reloadListObjectShare($scope.model.ObjectCodeShared, $scope.model.ObjectTypeShared, $scope.model.ObjectCode, $scope.model.ObjectType, $scope.model.FileCode);
    }
    $scope.init();
    $scope.changeObjType = function (ObjType) {
        dataservice.getListObjectCode($rootScope.WorkFlowCode, ObjType, function (rs) {
            rs = rs.data;
            $scope.listObjCode = rs;
        });
        reloadListObjectShare($scope.model.ObjectCodeShared, $scope.model.ObjectTypeShared, $scope.model.ObjectCode, ObjType, $scope.model.FileCode);
    }
    $scope.changeObjCode = function (objectCode) {
        reloadListObjectShare($scope.model.ObjectCodeShared, $scope.model.ObjectTypeShared, objectCode, $scope.model.ObjectType, $scope.model.FileCode);
    }
    $scope.selectFile = function (fileCode) {
        reloadListObjectShare($scope.model.ObjectCodeShared, $scope.model.ObjectTypeShared, $scope.model.ObjectCode, $scope.model.ObjectType, fileCode);
    }
    $scope.reloadListObjectShare = function () {
        reloadListObjectShare($scope.model.ObjectCodeShared, $scope.model.ObjectTypeShared, $scope.model.ObjectCode, $scope.model.ObjectType, $scope.model.FileCode);
    }
    $scope.removeObjectShare = function (id) {
        dataservice.deleteObjectShare(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                reloadListObjectShare($scope.model.ObjectCodeShared, $scope.model.ObjectTypeShared, $scope.model.ObjectCode, $scope.model.ObjectType, $scope.model.FileCode);
            }
        });
    }
    $scope.share = function () {
        if (!$scope.validate()) {
            dataservice.insertFileShare($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    reloadListObjectShare($scope.model.ObjectCodeShared, $scope.model.ObjectTypeShared, $scope.model.ObjectCode, $scope.model.ObjectType, $scope.model.FileCode);
                }
            });
        }
    }
    $scope.validate = function () {
        var error = false;
        if (($scope.model.ObjectType == "" || $scope.model.ObjectType == undefined)) {
            App.toastrError(caption.CUS_ERROR_CHOOSE_OBJECT)
            error = true;
            return error;
        }
        if (($scope.model.ObjectCode == "" || $scope.model.ObjectCode == undefined)) {
            App.toastrError(caption.CUS_ERROR_CHOOSE_OBJECT_CODE)
            error = true;
            return error;
        }
        if (($scope.model.FileCode == "" || $scope.model.FileCode == undefined)) {
            App.toastrError(caption.CUS_ERROR_SELECT_FILE)
            error = true;
            return error;
        }
    }
    function reloadListObjectShare(objectCodeShared, objectTypeShared, objectCode, objectType, fileCode) {
        dataservice.getListObjectShare(objectCodeShared, objectTypeShared, objectCode, objectType, fileCode, function (rs) {
            rs = rs.data;
            $scope.listObjectShare = rs;
        })
    }
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('tabFileHistory', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, $filter, para) {
    var vm = $scope;
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    $scope.model = {
        FromDate: '',
        ToDate: '',
    };
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/AssetAllocation/JTableFileHistory",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.FileId = para;
                d.AssetCode = $rootScope.WorkFlowCode;
                d.FromDate = $scope.model.FromDate;
                d.ToDate = $scope.model.ToDate;
            },
            complete: function () {
                App.unblockUI("#contentMain");
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(5)
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
        .withOption('createdRow', function (row, data, dataIndex) {
            const contextScope = $scope.$new(true);
            contextScope.data = data;
            contextScope.contextMenu = $scope.contextMenu;
            $compile(angular.element(row))($scope);
            $compile(angular.element(row).attr('context-menu', 'contextMenu'))(contextScope);
        });
    //end option table
    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle(titleHtml).notSortable().renderWith(function (data, type, full, meta) {
        $scope.selected[full.id] = false;
        return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.ContractFileID + ']" ng-click="toggleOne(selected)"/><span></span></label>';
    }).withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileName').withOption('sClass', 'w75').withTitle('{{"CONTRACT_CURD_TAB_FILE_LIST_COL_NAME" | translate}}').renderWith(function (data, type, full) {
        var excel = ['.XLSM', '.XLSX', '.XLS'];
        var document = ['.TXT'];
        var word = ['.DOCX', '.DOC'];
        var pdf = ['.PDF'];
        var powerPoint = ['.PPS', '.PPTX', '.PPT'];
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        var icon = "";
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

        if (full.IsFileMaster == "False") {
            data = '<span class="text-warning">' + data + '<span>';
        } else {
            data = '<span class="text-primary">' + data + '<span>';
        }

        return icon + data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ReposName').withTitle('{{"CONTRACT_CURD_TAB_FILE_LIST_COL_CATEGORY_NAME" | translate}}').renderWith(function (data, type, full) {
        return '<i class="fa fa-folder-open icon-state-warning"></i>&nbsp' + data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('Desc').withTitle('{{"CONTRACT_CURD_TAB_FILE_LIST_COL_DESCRIPTION" | translate}}').notSortable().renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('EditedFileTime').withTitle('{{"CONTRACT_CURD_TAB_FILE_LIST_COL_EDITED_TIME" | translate}}').renderWith(function (data, type, full) {
        return data != "" ? $filter('date')(new Date(data), 'HH:mm dd/MM/yyyy') : null;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('EditedFileBy').withTitle('{{"CONTRACT_CURD_TAB_FILE_COL_ACTION" | translate}}').renderWith(function (data, type, full) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').withTitle('{{"CONTRACT_CURD_TAB_FILE_COL_ACTION" | translate}}').withOption('sClass', 'w75 nowrap text-center').renderWith(function (data, type, full) {
        var excel = ['.XLSM', '.XLSX', '.XLS'];
        var document = ['.TXT'];
        var word = ['.DOCX', '.DOC'];
        var pdf = ['.PDF'];
        var powerPoint = ['.PPS', '.PPTX', '.PPT'];
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        var icon = "";
        var typefile = "#";
        if (excel.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            typefile = 'excel';
        } else if (word.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            typefile = 'Docman';
        } else if (pdf.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            typefile = 'pdf';
        }

        if (full.TypeFile == "SHARE") {
            return '<a ng-click="dowload(\'' + full.FileCode + '\')" target="_blank" style1="width: 25px; height: 25px; padding: 0px" title="Tải xuống - ' + full.FileName + '" class1="btn btn-icon-only btn-circle btn-outline green " download><i class="fas fa-download pt5 fs25"></i></a>';
        } else {
            return '<a ng-click="getObjectFile(' + full.Id + ', 1' + ')" target="_blank" href=' + typefile + ' title="{{&quot; Xem &quot; | translate}}" style1="width: 25px; height: 25px; padding: 0px" class1="btn btn-icon-only btn-circle btn-outline blue"><i class="fas fa-eye fs25 pr20 pt5"></i></a>' +
                '<a ng-click="dowload(\'' + full.FileCode + '\')"  style1="width: 25px; height: 25px; padding: 0px" title="Tải xuống - ' + full.FileName + '" class1="btn btn-icon-only btn-circle btn-outline green"><i class="fas fa-edit fs25 pr20"></i></a>' +
                '<a title="Xoá" ng-click="delete(' + full.Id + ')" style1="width: 25px; height: 25px; padding: 0px" class1="btn btn-icon-only btn-circle btn-outline red"><i class="fas fa-trash-alt fs25 text-danger"></i></a>';
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
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
    $scope.reload = function () {
        reloadData(true);
    }
    $rootScope.reloadFile = function () {
        $scope.reload();
    }

    $scope.search = function () {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolder + '/contractTabFileSearch.html',
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
    $scope.add = function () {
        if ($scope.file == '' || $scope.file == undefined) {
            App.toastrError(caption.COM_MSG_CHOSE_FILE);
        } else {
            var data = new FormData();
            data.append("FileUpload", $scope.file);
            data.append("RequestCode", $rootScope.RequestCode);
            data.append("IsMore", false);
            dataservice.insertContractFile(data, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                    $scope.reload();
                }
            });
        }
    }
    $scope.edit = function (fileName, id) {
        dataservice.getContractFile(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                rs.Object.FileName = fileName;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: ctxfolder + '/tabFileEdit.html',
                    controller: 'tabFileEdit',
                    windowClass: "modal-file",
                    backdrop: 'static',
                    size: '55',
                    resolve: {
                        para: function () {
                            return rs.Object;
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
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = caption.COM_MSG_DELETE_CONFIRM_COM;
                $scope.ok = function () {
                    dataservice.deleteAssetFile(id, function (result) {
                        result = result.data;
                        if (result.Error) {
                            App.toastrError(result.Title);
                        } else {
                            App.toastrSuccess(result.Title);
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
            $scope.reload();
        }, function () {
        });
    }
    $scope.share = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderFileShare + '/fileShare.html',
            controller: 'tabFileShare',
            windowClass: 'modal-center',
            backdrop: 'static',
            size: '60',
        });
        modalInstance.result.then(function (d) {
            reloadData()
        }, function () { });
    }
    $scope.viewFile = function (id) {
        //dataservice.getByteFile(id, function (rs) {rs=rs.data;
        //    
        //    var blob = new Blob([rs.Object], { type: "application/msword;charset=utf-8" });
        //    var blobUrl = URL.createObjectURL(blob);
        //    var url = window.encodeURIComponent(blobUrl);
        //    window.open('https://docs.google.com/gview?url=' + "https://facco.s-work.vn" + '' + url + '&embedded=true', '_blank');
        //})
        //var userModel = {};
        //var listdata = $('#tblDataFile').DataTable().data();
        //for (var i = 0; i < listdata.length; i++) {
        //    if (listdata[i].Id == id) {
        //        userModel = listdata[i];
        //        break;
        //    }
        //}
        //
        //var dt = userModel.Url;
        //dt = dt.replace("\/", "\\");
        //var url1 = "upload\\repository" + dt;
        //url1 = "\\uploads\\repository\\3.THÔNG TIN CHUNG\\mail vib.docx";
        //var url = window.encodeURIComponent(url1);
        //window.open('https://docs.google.com/gview?url=' + "https://facco.s-work.vn" + '' + url + '&embedded=true', '_blank');
    }
    $scope.viewImage = function (id) {
        //var userModel = {};
        //var listdata = $('#tblDataFile').DataTable().data();
        //for (var i = 0; i < listdata.length; i++) {
        //    if (listdata[i].Id == id) {
        //        userModel = listdata[i];
        //        break;
        //    }
        //}
        //toDataUrl(window.location.origin + userModel.Url, function (myBase64) {
        //    var modalInstance = $uibModal.open({
        //        templateUrl: '/views/admin/edmsRepository/imageViewer.html',
        //        controller: 'contractTabFileImageViewer',
        //        backdrop: 'static',
        //        size: '40',
        //        resolve: {
        //            para: function () {
        //                return myBase64;
        //            }
        //        }
        //    });
        //    modalInstance.result.then(function (d) {
        //    }, function () {
        //    });
        //});
    }
    $scope.dowload = function (fileCode) {
        location.href = "/Admin/EDMSRepository/DownloadFile?fileCode="
            + fileCode;
    }
    $scope.extend = function (id) {
        dataservice.getSuggestionsContractFile($rootScope.RequestCode, function (rs) {
            rs = rs.data;
            var data = rs != '' ? rs : {};
            var modalInstance = $uibModal.open({
                templateUrl: ctxfolder + '/tabFileAdd.html',
                controller: 'tabFileAdd',
                windowClass: 'modal-file',
                backdrop: 'static',
                size: '55',
                resolve: {
                    para: function () {
                        return data;
                    }
                }
            });
            modalInstance.result.then(function (d) {
                reloadData()
            }, function () { });
        })
    }
    $scope.loadFile = function (event) {
        $scope.file = event.target.files[0];
    }
    $scope.getObjectFile = function (id, mode) {
        dataservice.getItemFile(id, true, mode);
    };

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
    setTimeout(function () {
        loadDate();
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

app.controller('addCatActivity', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, DTColumnBuilder, DTInstances, dataservice, $filter, para) {
    $scope.model = {
        ActivityCode: para.IdAct,
        Title: "",
        Duration: "",
        Unit: "",
        Group: "",
        Type: "",
        Status: "",
        Located: "",
        MileStone: "",
        WorkflowCode: para.WfCode,
        ShapeJson: para.Json
    };
    $rootScope.ObjCode = para.IdAct;
    $rootScope.isAdded = false;

    var node = $rootScope.canvas2.getPrimarySelection();

    $rootScope.isAdded = false;
    $rootScope.ActivityCode = "";

    $scope.initData = function () {
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
        dataservice.getStatusAct(function (rs) {
            rs = rs.data;
            $scope.lstStatus = rs;
        })
        dataservice.getMilesStone(function (rs) {
            rs = rs.data;
            $scope.lstMileStone = rs;
        })
        dataservice.getGroupStatus(function (rs) {
            rs = rs.data;
            $scope.lstStatus = rs;
        })
    }
    $scope.initData();

    $scope.cancel = function () {
        $uibModalInstance.close('cancel');
    };

    $scope.submit = function () {
        var data = CKEDITOR.instances['description'].getData();
        $scope.model.Desc = data;
        validationSelect($scope.model);
        if ($scope.addform.validate() && !validationSelect($scope.model).Status) {
            var temp = $rootScope.checkData($scope.model);
            if (temp.Status) {
                App.toastrError(temp.Title);
                return;
            }
            if (!$rootScope.isAdded) {
                var parseJsonData = JSON.parse($scope.model.ShapeJson);
                if ($scope.model.Type == "TYPE_ACTIVITY_INITIAL") {
                    parseJsonData.bgColor = "rgba(0,99,177,1)";
                    parseJsonData.color = "rgba(0,99,177,1)";
                }
                else if ($scope.model.Type == "TYPE_ACTIVITY_END") {
                    parseJsonData.bgColor = "rgba(165,42,42,1)";
                    parseJsonData.color = "rgba(165,42,42,1)";
                }
                else {
                    parseJsonData.bgColor = "rgba(60, 179, 113, 1)";
                    parseJsonData.color = "rgba(60, 179, 113, 1)";
                }
                $scope.model.ShapeJson = JSON.stringify(parseJsonData);
                dataservice.insertActivity($scope.model, function (rs) {
                    rs = rs.data;
                    if (rs.Error) {
                        App.toastrError(rs.Title);
                    } else {
                        App.toastrSuccess(rs.Title);
                        $rootScope.isAdded = true;

                        $rootScope.ActivityCode = $scope.model.ActivityCode;
                        node.children.data[0].figure.attr({
                            text: $scope.model.Title
                        });
                        setTimeout(function () {
                            $rootScope.reloadCreator();
                        })
                    }
                });
            }
            else {
                dataservice.updateActivity($scope.model, function (rs) {
                    rs = rs.data;
                    if (rs.Error) {
                        App.toastrError(rs.Title);
                    } else {
                        App.toastrSuccess(rs.Title);
                        var obj = {
                            Name: $scope.model.Title,
                            Status: $scope.model.Status
                        }
                        $uibModalInstance.close(obj);
                        debugger
                        node.children.data[0].figure.attr({
                            text: $scope.model.Title,
                        });

                        if ($scope.model.Type == "TYPE_ACTIVITY_INITIAL") {
                            node.bgColor.alpha = 1;
                            node.bgColor.blue = 177;
                            node.bgColor.green = 99;
                            node.bgColor.hashString = "#0063B1";
                            node.bgColor.red = 0;
                        }
                        else if ($scope.model.Type == "TYPE_ACTIVITY_END") {
                            node.bgColor.alpha = 1;
                            node.bgColor.blue = 42;
                            node.bgColor.green = 42;
                            node.bgColor.hashString = "#A52A2A";
                            node.bgColor.red = 165;
                        }
                        else {
                            node.bgColor.alpha = 1;
                            node.bgColor.blue = 113;
                            node.bgColor.green = 179;
                            node.bgColor.hashString = "#3CB371";
                            node.bgColor.red = 60;
                        }
                    }
                });
            }
        }
    }

    $scope.save = function () {
        if (!$rootScope.isAdded) {
            return App.toastrError(caption.ACT_MSG_PLS_ADD_ACT_FIRST);
        }

        var obj = {
            ActivityCode: $rootScope.ActivityCode,
            ListGroupData: $scope.model.ListGroupData.join(",")
        };

        dataservice.updateGroupDataActivity(obj, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
            }
        });
    }

    $scope.changeSelect = function (SelectType) {
        if (SelectType == "Unit" && $scope.model.Unit != "") {
            $scope.errorUnit = false;
        }
        if (SelectType == "Group" && $scope.model.Group != "") {
            $scope.errorGroup = false;
        }
        if (SelectType == "Type" && $scope.model.Type != "") {
            $scope.errorType = false;
            if ($scope.model.Type === "TYPE_ACTIVITY_INITIAL") {
                dataservice.checkTypeInitial(para.WfCode, function (rs) {
                    rs = rs.data;
                    if (rs) {
                        $scope.model.Type = "";
                        App.toastrError(caption.ACT_MSG_WF_STATUS_INITIAL_EXIST);
                    }
                })
            }

            if ($scope.model.Type === "TYPE_ACTIVITY_END") {
                dataservice.checkTypeEndAct(para.WfCode, function (rs) {
                    rs = rs.data;
                    if (rs) {
                        $scope.model.Type = "";
                        App.toastrError(caption.ACT_MSG_WF_STATUS_END_EXIST);
                    }
                })
            }
        }
        if (SelectType == "Status" && $scope.model.Status != "") {
            $scope.errorStatus = false;
        }
        if (SelectType == "MileStone" && $scope.model.MileStone != "") {
            $scope.errorMileStone = false;
        }
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }

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

        if (data.MileStone == "") {
            $scope.errorMileStone = true;
            mess.Status = true;
        } else {
            $scope.errorMileStone = false;
        }

        return mess;
    };

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

    $scope.addMileStone = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCommonSetting + "/detail.html",
            controller: 'detail',
            size: '50',
            backdrop: 'static',
            resolve: {
                para: function () {
                    return {
                        Group: 'MILE_STONE',
                        GroupNote: 'Mốc',
                        AssetCode: 'MILE_STONE'
                    }
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataservice.getMilesStone(function (rs) {
                rs = rs.data;
                $scope.lstMileStone = rs;
            })
        }, function () { });
    }

    //File
    $scope.fileManage = function () {
        if (!$rootScope.isAdded) {
            return App.toastrError(caption.ACT_MSG_PLS_ADD_ACT_FIRST);
        }

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/fileManage.html',
            controller: 'fileManage',
            backdrop: 'static',
            size: '60',
            resolve: {
                para: function () {
                    return $scope.model.ActivityCode;
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataservice.getAttachment($rootScope.ActivityCode, function (rs) {
                rs = rs.data;
                $scope.attachments = rs;
            })
        }, function () {
        });
    }

    $scope.fileAttachment = {
        FileName: "",
        FilePath: "",
        ActivityCode: $scope.model.ActivityCode,
        FileType: "",
        FileSize: 0,
        ParentFile: ""
    }

    $scope.addAttachment = function () {
        $("#fileAttachment").trigger("click");
    }

    $scope.loadAttachment = function (event) {
        var file = event.target.files[0];
        if (file != undefined) {
            var size = file.size;;
            var data = new FormData();
            data.append("FileUpload", file);
            data.append("ActivityCode", $scope.model.ActivityCode)
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
                        ActivityCode: $scope.model.ActivityCode,
                        FileType: "." + extFile,
                        FileSize: size
                    }
                    $('#fileAttachment').replaceWith($('#fileAttachment').val('').clone(true));
                }
            });
        }
    }

    $scope.insertFile = function () {
        if (!$rootScope.isAdded) {
            return App.toastrError(caption.ACT_MSG_PLS_ADD_ACT_FIRST);
        }
        dataservice.addAttachment($scope.fileAttachment, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getAttachment($scope.model.ActivityCode, function (rs) {
                    rs = rs.data;
                    $scope.attachments = rs;
                })
            }
        })
    }

    $scope.deleteAttachment = function (fileCode, type) {
        var data = {
            FileCode: fileCode,
            Type: type,
            ActCode: $scope.model.ActivityCode
        };
        dataservice.deleteAttachment(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getAttachment($scope.model.ActivityCode, function (rs) {
                    rs = rs.data;
                    $scope.attachments = rs;
                })
            }
        })
    }

    $scope.downloadAttach = function (url, code, type) {

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

    $scope.viewFile = function (fileCode, url) {
        var data = {
            ActCode: $scope.model.ActivityCode,
            FileCode: fileCode,
            Url: url
        };

        var extension = url.substr(url.lastIndexOf('.') + 1);
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
    }

    var editor;
    function ckEditer() {
        editor = CKEDITOR.replace('description', {
            cloudServices_tokenUrl: '/MobileApp/Token',
            cloudServices_uploadUrl: '/MobileApp/UploadFile',
            filebrowserBrowseUrl: '',
            filebrowserUploadUrl: '/MobileApp/Upload',
            embed_provider: '/uploader/upload.php'
        });
    }
    setTimeout(function () {
        ckEditer();
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('edit-activity', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, DTColumnBuilder, DTInstances, dataservice, $filter, para) {
    $scope.model = {
        ActivityCode: "",
        Title: "",
        Duration: "",
        Unit: "",
        Group: "",
        Type: "",
        Status: "",
        Located: "",
        MileStone: "",
        WorkflowCode: "",
        ShapeJson: "",
        Desc: ""
    }
    $scope.oldType = "";
    var node = $rootScope.canvas2.getPrimarySelection();

    $rootScope.isAdded = true;

    $scope.initData = function () {
        var obj = {
            ActCode: para
        }
        dataservice.getItemActivity(obj, function (rs) {
            rs = rs.data;
            $scope.model = rs;
            if ($scope.model.ListGroupData != '' && $scope.model.ListGroupData != null && $scope.model.ListGroupData != undefined)
                $scope.model.ListGroupData = $scope.model.ListGroupData.split(',');
            $rootScope.ActivityName = $scope.model.Title;
            dataservice.getMileStoneAct(para, function (rs) {
                rs = rs.data;
                $scope.model.MileStone = rs;
            })
            $scope.oldType = angular.copy($scope.model.Type);
        })
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
        //dataservice.getStatusAct(function (rs) {
        //    rs = rs.data;
        //    $scope.lstStatus = rs;
        //})
        dataservice.getMilesStone(function (rs) {
            rs = rs.data;
            $scope.lstMileStone = rs;
        });

        //dataservice.getAttachment(para, function (rs) {
        //    rs = rs.data;
        //    $scope.attachments = rs;
        //});

        dataservice.getGroupStatus(function (rs) {
            rs = rs.data;
            $scope.lstStatus = rs;
        });


    }

    $scope.initData();

    $scope.cancel = function () {
        $uibModalInstance.close('cancel');
    };

    $scope.submit = function () {
        var data = CKEDITOR.instances['description'].getData();
        $scope.model.Desc = data;
        validationSelect($scope.model);
        if ($scope.addform.validate() && !validationSelect($scope.model).Status) {
            var temp = $rootScope.checkData($scope.model);
            if (temp.Status) {
                App.toastrError(temp.Title);
                return;
            }
            var parseJsonData = JSON.parse($scope.model.ShapeJson);
            if ($scope.model.Type == "TYPE_ACTIVITY_INITIAL") {
                parseJsonData.bgColor = "rgba(0,99,177,1)";
                parseJsonData.color = "rgba(0,99,177,1)";
            }
            else if ($scope.model.Type == "TYPE_ACTIVITY_END") {
                parseJsonData.bgColor = "rgba(165,42,42,1)";
                parseJsonData.color = "rgba(165,42,42,1)";
            }
            else {
                parseJsonData.bgColor = "rgba(60, 179, 113, 1)";
                parseJsonData.color = "rgba(60, 179, 113, 1)";
            }

            dataservice.updateActivity($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    $uibModalInstance.close();
                    node.children.data[0].figure.attr({
                        text: $scope.model.Title
                    });
                    if ($scope.model.Type == "TYPE_ACTIVITY_INITIAL") {
                        node.bgColor.alpha = 1;
                        node.bgColor.blue = 177;
                        node.bgColor.green = 99;
                        node.bgColor.hashString = "#0063B1";
                        node.bgColor.red = 0;
                    }
                    else if ($scope.model.Type == "TYPE_ACTIVITY_END") {
                        node.bgColor.alpha = 1;
                        node.bgColor.blue = 42;
                        node.bgColor.green = 42;
                        node.bgColor.hashString = "#A52A2A";
                        node.bgColor.red = 165;
                    }
                    else {
                        node.bgColor.alpha = 1;
                        node.bgColor.blue = 113;
                        node.bgColor.green = 179;
                        node.bgColor.hashString = "#3CB371";
                        node.bgColor.red = 60;
                    }
                }
            });
        }
    }

    $scope.save = function () {
        var obj = {
            ActivityCode: $rootScope.ActivityCode,
            ListGroupData: $scope.model.ListGroupData.join(",")
        };

        dataservice.updateGroupDataActivity(obj, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
            }
        });
    }

    $scope.changeName = function () {
        $rootScope.ActivityName = $scope.model.Title;
    }

    $scope.changeSelect = function (SelectType) {
        if (SelectType == "Unit" && $scope.model.Unit != "") {
            $scope.errorUnit = false;
        }
        if (SelectType == "Group" && $scope.model.Group != "") {
            $scope.errorGroup = false;
        }
        if (SelectType == "Type" && $scope.model.Type != "") {
            $scope.errorType = false;
            if ($scope.oldType !== "TYPE_ACTIVITY_INITIAL" && $scope.model.Type === "TYPE_ACTIVITY_INITIAL") {
                dataservice.checkTypeInitial($scope.model.WorkflowCode, function (rs) {
                    rs = rs.data;
                    if (rs) {
                        $scope.model.Type = "";
                        App.toastrError(caption.ACT_MSG_WF_STATUS_INITIAL_EXIST);
                    }
                })
            }

            if ($scope.model.Type === "TYPE_ACTIVITY_END") {
                dataservice.checkTypeEndAct($scope.model.WorkflowCode
                    , function (rs) {
                        rs = rs.data;
                        if (rs) {
                            $scope.model.Type = "";
                            App.toastrError(caption.ACT_MSG_WF_STATUS_END_EXIST);
                        }
                    })
            }
        }
        if (SelectType == "Status" && $scope.model.Status != "") {
            $scope.errorStatus = false;
        }
        if (SelectType == "MileStone" && $scope.model.MileStone != "") {
            $scope.errorMileStone = false;
        }

    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }

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

        if (data.MileStone == "") {
            $scope.errorMileStone = true;
            mess.Status = true;
        } else {
            $scope.errorMileStone = false;
        }

        return mess;
    };

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

    $scope.addMileStone = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCommonSetting + "/detail.html",
            controller: 'detail',
            size: '50',
            backdrop: 'static',
            resolve: {
                para: function () {
                    return {
                        Group: 'MILE_STONE',
                        GroupNote: 'Mốc',
                        AssetCode: 'MILE_STONE'
                    }
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataservice.getMilesStone(function (rs) {
                rs = rs.data;
                $scope.lstMileStone = rs;
            })
        }, function () { });
    }

    //File
    $scope.fileManage = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/fileManage.html',
            controller: 'fileManage',
            backdrop: 'static',
            size: '60',
            resolve: {
                para: function () {
                    return para;
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataservice.getAttachment(para, function (rs) {
                rs = rs.data;
                $scope.attachments = rs;
            })
        }, function () {
        });
    }

    $scope.fileAttachment = {
        FileName: "",
        FilePath: "",
        ActivityCode: para,
        FileType: "",
        FileSize: 0,
        ParentFile: ""
    }

    $scope.addAttachment = function () {
        $("#fileAttachment").trigger("click");
    }

    $scope.loadAttachment = function (event) {

        var file = event.target.files[0];
        if (file != undefined) {
            var size = file.size;;
            var data = new FormData();
            data.append("FileUpload", file);
            data.append("ActivityCode", para)
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
                        ActivityCode: para,
                        FileType: "." + extFile,
                        FileSize: size
                    }
                    $('#fileAttachment').replaceWith($('#fileAttachment').val('').clone(true));
                }
            });
        }
    }

    $scope.insertFile = function () {
        dataservice.addAttachment($scope.fileAttachment, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getAttachment(para, function (rs) {
                    rs = rs.data;
                    $scope.attachments = rs;
                })
            }
        })
    }

    $scope.deleteAttachment = function (fileCode, type) {
        var data = {
            FileCode: fileCode,
            Type: type,
            ActCode: para
        };
        dataservice.deleteAttachment(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                dataservice.getAttachment(para, function (rs) {
                    rs = rs.data;
                    $scope.attachments = rs;
                })
            }
        })
    }

    $scope.downloadAttach = function (url, code, type) {

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

    $scope.viewFile = function (fileCode, url) {
        var data = {
            ActCode: para,
            FileCode: fileCode,
            Url: url
        };

        var extension = url.substr(url.lastIndexOf('.') + 1);
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
    }

    var editor;
    function ckEditer() {
        editor = CKEDITOR.replace('description', {
            cloudServices_tokenUrl: '/MobileApp/Token',
            cloudServices_uploadUrl: '/MobileApp/UploadFile',
            filebrowserBrowseUrl: '',
            filebrowserUploadUrl: '/MobileApp/Upload',
            embed_provider: '/uploader/upload.php'
        });
    }
    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
    setTimeout(function () {
        ckEditer();
    }, 1000);
});

app.controller('add-setting-transition', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice, $translate, para) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    }
    $scope.model = {
        WorkflowCode: para.WorkflowCode,
        TransitionCode: "",
        ActivityInitial: para.ActivityInitial,
        ActivityDestination: para.ActivityDestination,
        Command: ""
    };

    $scope.initData = function () {
        dataservice.getCommand(function (rs) {
            rs = rs.data;
            $scope.lstCommand = rs;
            if ($scope.lstCommand.length > 0) {
                $scope.model.Command = $scope.lstCommand[0].Code;
            }
        })
        dataservice.getTransitionType(function (rs) {
            rs = rs.data;
            $scope.lstTransition = rs;
        })
        dataservice.getAct(para.WorkflowCode, function (rs) {
            rs = rs.data;
            $scope.lstAct = rs;
        })
    }

    $scope.initData();

    $scope.submit = function () {
        validationSelect($scope.model);
        if (!validationSelect($scope.model).Status) {
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

    $scope.selectChange = function (selectType) {
        if (selectType == "TransitionCode" && $scope.model.TransitionCode == "") {
            $scope.errorTransitionCode = true;
        }
        else {
            $scope.errorTransitionCode = false;
        }

        if (selectType == "Command" && $scope.model.Command == "") {
            $scope.errorCommand = true;
        }
        else {
            $scope.errorCommand = false;
        }
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }

        if (data.TransitionCode == "") {
            $scope.errorTransitionCode = true;
            mess.Status = true;
        } else {
            $scope.errorTransitionCode = false;
        }

        if (data.Command == "") {
            $scope.errorCommand = true;
            mess.Status = true;
        } else {
            $scope.errorCommand = false;
        }

        return mess;
    }

    setTimeout(function () {
        loadDate();
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('edit-setting-transition', function ($scope, $rootScope, $compile, $uibModal, $confirm, $uibModalInstance, dataservice, $translate, para) {
    $scope.cancel = function () {
        $uibModalInstance.close();
    }

    $scope.model = {
        WorkflowCode: "",
        TransitionCode: "",
        ActivityInitial: "",
        ActivityDestination: "",
        Command: ""
    };

    $scope.initData = function () {
        dataservice.getCommand(function (rs) {
            rs = rs.data;
            $scope.lstCommand = rs;
        })
        $scope.model = para;
        dataservice.getTransitionType(function (rs) {
            rs = rs.data;
            $scope.lstTransition = rs;
        })
        dataservice.getAct(para.WorkflowCode, function (rs) {
            rs = rs.data;
            $scope.lstAct = rs;
        })
        debugger
        if (para.Command != "" && para.Command != null) {
            var json = JSON.parse(para.Command);
            $scope.model.Command = json[json.length - 1].CommandSymbol;
        }
    }

    $scope.initData();

    $scope.submit = function () {
        validationSelect($scope.model);
        if (!validationSelect($scope.model).Status) {
            dataservice.updateSettingWF($scope.model, function (rs) {
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

    $scope.selectChange = function (selectType) {
        if (selectType == "TransitionCode" && $scope.model.TransitionCode == "") {
            $scope.errorTransitionCode = true;
        }
        else {
            $scope.errorTransitionCode = false;
        }

        if (selectType == "Command" && $scope.model.Command == "") {
            $scope.errorCommand = true;
        }
        else {
            $scope.errorCommand = false;
        }
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }

        if (data.TransitionCode == "") {
            $scope.errorTransitionCode = true;
            mess.Status = true;
        } else {
            $scope.errorTransitionCode = false;
        }

        if (data.Command == "") {
            $scope.errorCommand = true;
            mess.Status = true;
        } else {
            $scope.errorCommand = false;
        }

        return mess;
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

    setTimeout(function () {
        loadDate();
        setModalDraggable('.modal-dialog');
    }, 200);
});

//Tab of Activity
app.controller('nested-wfCat', function ($scope, $rootScope, $uibModal, $confirm, $compile, dataservice, $filter, $translate) {
    $scope.model = {
        NestedWF: ''
    }

    $scope.listWfNestedAct = [];

    $scope.initData = function () {
        //$rootScope.ActivityCode
        dataservice.getNestedWF($rootScope.WfCatCode, function (rs) {
            rs = rs.data;
            $scope.listNestedWF = rs;
        })
        dataservice.getNestedActCat($rootScope.ActivityCode, function (rs) {
            rs = rs.data;
            $scope.listWfNestedAct = rs;
        })
    }

    $scope.initData();

    $scope.addNestedWF = function () {
        if ($scope.model.NestedWF == '') {
            return App.toastrError(caption.ACT_MSG_ADD_NESTED_WF_NOT_EXIST);
        }
        var data = {
            ActCode: $rootScope.ActivityCode,
            WfCode: $scope.model.NestedWF
        };
        dataservice.addNestedWF(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title)
            }
            else {
                App.toastrSuccess(rs.Title)
                dataservice.getNestedActCat($rootScope.ActivityCode, function (rs) {
                    rs = rs.data;
                    $scope.listWfNestedAct = rs;
                })
            }
        })
    }

    $scope.delete = function (wfCode) {
        var data = {
            ActCode: $rootScope.ActivityCode,
            WfCode: wfCode
        };
        dataservice.deleteNestedWf(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title)
            }
            else {
                App.toastrSuccess(rs.Title)
                dataservice.getNestedActCat($rootScope.ActivityCode, function (rs) {
                    rs = rs.data;
                    $scope.listWfNestedAct = rs;
                })
            }
        })
    }

    setTimeout(function () {
    }, 200);
});

app.controller('role-default', function ($scope, $rootScope, $uibModal, $confirm, $compile, dataservice, $filter, $translate) {
    $scope.model = {
        RoleDefault: ''
    }

    $scope.listRoleDefault = [];
    $scope.noPermission = false;
    $scope.initData = function () {
        //$rootScope.ActivityCode
        dataservice.getRoleDefault(function (rs) {
            rs = rs.data;
            $scope.listRole = rs;
        })
        dataservice.getRoleDefaultOfAct($rootScope.ActivityCode, function (rs) {
            rs = rs.data;
            if (rs.Title) {
                $scope.noPermission = true;
                $scope.listRoleDefault = [{ RoleName: rs.Title }];
                //App.toastrError(rs.Title);
            }
            else {
                $scope.listRoleDefault = rs;
            }
        })
    }

    $scope.initData();

    $scope.addRoleDefault = function () {
        if ($scope.model.RoleDefault == '') {
            return App.toastrError(caption.ACT_MSG_ADD_ROLE_DEFAULT_NOT_EXIST);
        }
        dataservice.insertRoleDefault($rootScope.ActivityCode, $scope.model.RoleDefault, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title)
            }
            else {
                App.toastrSuccess(rs.Title)
                dataservice.getRoleDefaultOfAct($rootScope.ActivityCode, function (rs) {
                    rs = rs.data;
                    $scope.listRoleDefault = rs;
                })
            }
        })
    }

    $scope.delete = function (roleCode) {
        dataservice.deleteRoleDefault($rootScope.ActivityCode, roleCode, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title)
            }
            else {
                App.toastrSuccess(rs.Title)
                dataservice.getRoleDefaultOfAct($rootScope.ActivityCode, function (rs) {
                    rs = rs.data;
                    $scope.listRoleDefault = rs;
                })
            }
        })
    }

    $scope.addCommonRoleDefault = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderCommonSetting + "/detail.html",
            controller: 'detail',
            size: '50',
            backdrop: 'static',
            resolve: {
                para: function () {
                    return {
                        Group: 'ROLE_ACT_DEFAULT',
                        GroupNote: 'Vai trò mặc định',
                        AssetCode: 'ROLE_ACT_DEFAULT'
                    }
                }
            }
        });
        modalInstance.result.then(function (d) {
            dataservice.getRoleDefault(function (rs) {
                rs = rs.data;
                $scope.listRole = rs;
            })
        }, function () { });
    }
});

app.controller('assign-member', function ($scope, $rootScope, $confirm, $compile, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, $filter, $translate) {
    $scope.model = {
        Branch: "b_HN",
        Object: "",
        UserId: "",
        Role: ""
    }

    var allMember = {
        UserId: "ALL",
        GivenName: "Tất cả",
        UserName: "All",
        RoleSys: "",
        Branch: "",
        DepartmentName: ""
    }

    var data = {
        ActivityCode: $rootScope.ActivityCode
    }

    $scope.lstMemberAssign = [];

    $scope.initLoad = function () {
        dataservice.getGroupAct(function (rs) {
            rs = rs.data;
            $scope.lstGroup = rs;
        })
        dataservice.getTypeAct(function (rs) {
            rs = rs.data;
            $scope.lstType = rs;
        })
        dataservice.getStatusAct(function (rs) {
            rs = rs.data;
            $scope.lstStatus = rs;
        })
        dataservice.getBranch(function (rs) {
            rs = rs.data;
            $scope.lstBranch = rs;
        })

        dataservice.getDepartmentInBranch($scope.model.Branch, function (department) {
            department = department.data;
            dataservice.getListGroupUser($scope.model.Branch, function (groupUser) {
                groupUser = groupUser.data;
                $scope.lstGroup = groupUser;
                dataservice.getListUserOfBranch($scope.model.Branch, function (rs) {
                    rs = rs.data;
                    var all = {
                        Code: 'All',
                        Name: 'Tất cả người dùng',
                        Type: 3,
                        Group: 'Người dùng',
                        CountUser: rs.length
                    }
                    $scope.model.Object = all;
                    $scope.listGroupUserAndDepartment = department.concat($scope.lstGroup);
                    $scope.listGroupUserAndDepartment.unshift(all);
                });

            });
        })

        dataservice.getListRoleAssign(function (rs) {
            rs = rs.data;
            $scope.lstRole = rs;
        })
        dataservice.getStatusAssign(function (rs) {
            rs = rs.data;
            $scope.lstStatusAssign = rs;
        })
        dataservice.getMemberAssign(data, function (rs) {
            rs = rs.data;
            $scope.lstMemberAssign = rs;
        })

        dataservice.getCreatorAssign($rootScope.ActivityCode, function (rs) {
            rs = rs.data;
            $rootScope.listCreator = rs;
        })

        dataservice.getListUser(function (rs) {
            rs = rs.data;
            $scope.listUser = rs;
        })
    }

    $scope.initLoad();

    $rootScope.reloadCreator = function () {
        dataservice.getCreatorAssign($rootScope.ActivityCode, function (rs) {
            rs = rs.data;
            $rootScope.listCreator = rs;
        })
    }

    $scope.updateCreatorManager = function (id, approve) {
        $scope.model.ActivityCode = $rootScope.ActivityCode;
        dataservice.assignCreatorManager(approve, $scope.model.ActivityCode, id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
                dataservice.getCreatorAssign($rootScope.ActivityCode, function (rs) {
                    rs = rs.data;
                    $rootScope.listCreator = rs;
                })
            }
        })
    }

    $scope.changeSelect = function (SelectType, code) {
        if (SelectType == "Branch" && $scope.model.Branch != "") {
            $scope.errorBranch = false;
            $scope.listGroupUserAndDepartment = [];

            dataservice.getDepartmentInBranch(code, function (department) {
                department = department.data;
                dataservice.getListGroupUser(code, function (groupUser) {
                    groupUser = groupUser.data;
                    $scope.lstGroup = groupUser;
                    dataservice.getListUserOfBranch($scope.model.Branch, function (rs) {
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
                $scope.countUser = rs.length;
                //$scope.listUser.unshift(allMember);
            });
        }
        else if (obj.Type == 2) {
            $scope.departmentAssignCode = obj.Code;
            dataservice.getListUserInDepartment(obj.Code, $scope.model.Branch, function (rs) {
                rs = rs.data;
                $scope.listUser = rs;
                $scope.countUser = rs.length;
                //$scope.listUser.unshift(allMember);
            });
        } else {
            dataservice.getListUserOfBranch($scope.model.Branch, function (rs) {
                rs = rs.data;
                $scope.listUser = rs;
                $scope.countUser = rs.length;
                //$scope.listUser.unshift(allMember);
            });
        }
    };

    $scope.addCreator = function (item) {
        if (!$rootScope.isAdded) {
            $scope.model.UserId = "";
            return App.toastrError(caption.ACT_MSG_PLS_ADD_ACT_FIRST);
        }
        // if there user exist, find that user

        // if user have the activity do nothing

        // else add object act_code, act_name
        userIndex = $rootScope.ListUser.findIndex(x => x.Username == item.ID);
        if (userIndex != -1) {
            actIndex = $rootScope.ListUser[userIndex].activity_role.findIndex(x => x.activity_code == $rootScope.ActivityCode);
            if (actIndex == -1) {
                var act_role = {
                    activity_code: $rootScope.ActivityCode,
                    activity_name: $rootScope.ActivityName,
                    role: "ROLE_ACT_REPOSITIVE"
                }
                $rootScope.ListUser[userIndex].activity_role.push(act_role);
            }
        }
        else {
            var user_role = {
                Username: item.ID,
                activity_role: [{
                    activity_code: $rootScope.ActivityCode,
                    activity_name: $rootScope.ActivityName,
                    role: "ROLE_ACT_REPOSITIVE"
                }]
            }
            $rootScope.ListUser.push(user_role);
        }

        var wfData = {
            WfCode: $rootScope.WfCatCode,
            UserList: JSON.stringify($rootScope.ListUser)
        }
        dataservice.updateWfUserList(wfData, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {

            }
        })

        var creator = {
            UserId: $scope.model.Creator,
            ActivityCode: $rootScope.ActivityCode,
            Role: "ROLE_ACT_REPOSITIVE"
        }
        dataservice.assign(creator, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                $scope.resetTable()
            }
        })
    }

    $scope.SaveCreator=function(){
        if($scope.model.Creator!=''){
            var wfData = {
                WfCode: $rootScope.WfCatCode,
                UserList: JSON.stringify($rootScope.ListUser)
            }
            dataservice.updateWfUserList(wfData, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {
    
                }
            })
    
            var creator = {
                UserId: $scope.model.Creator,
                ActivityCode: $rootScope.ActivityCode,
                Role: "ROLE_ACT_REPOSITIVE"
            }
            dataservice.assign(creator, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    $scope.resetTable()
                }
            })
        }
        else{
           
        }
    }

    $scope.changeRole = function (id, role, userName) {
        // if there user exist, find that user

        // if user have the activity change role
        userIndex = $rootScope.ListUser.findIndex(x => x.Username == userName);
        if (userIndex != -1) {
            actIndex = $rootScope.ListUser[userIndex].activity_role.findIndex(x => x.activity_code == $rootScope.ActivityCode);
            if (actIndex != -1) {
                $rootScope.ListUser[userIndex].activity_role[actIndex].role = role;
            }
        }

        var wfData = {
            WfCode: $rootScope.WfCatCode,
            UserList: JSON.stringify($rootScope.ListUser)
        }
        dataservice.updateWfUserList(wfData, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {

            }
        })
        dataservice.updateRole(id, role, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
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
            }
        })
    }

    $scope.delete = function (id, userName) {
        // if there user exist, find that user

        // if user have the activity delete
        userIndex = $rootScope.ListUser.findIndex(x => x.Username == userName);
        if (userIndex != -1) {
            actIndex = $rootScope.ListUser[userIndex].activity_role.findIndex(x => x.activity_code == $rootScope.ActivityCode);
            if (actIndex != -1) {
                $rootScope.ListUser[userIndex].activity_role.splice(actIndex, 1);
                if ($rootScope.ListUser[userIndex].activity_role.length == 0) {
                    $rootScope.ListUser.splice(userIndex, 1);
                }
            }
        }

        var wfData = {
            WfCode: $rootScope.WfCatCode,
            UserList: JSON.stringify($rootScope.ListUser)
        }
        dataservice.updateWfUserList(wfData, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {

            }
        })
        dataservice.deleteAssign(id, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                $scope.data = {
                    ActivityCode: $rootScope.ActivityCode
                }
                dataservice.getMemberAssign($scope.data, function (rs) {
                    rs = rs.data;
                    $scope.lstMemberAssign = rs;
                })
            }
        })
    }

    $scope.submit = function (item) {
        if (!$rootScope.isAdded) {
            $scope.model.UserId = "";
            return App.toastrError(caption.ACT_MSG_PLS_ADD_ACT_FIRST);
        }

        $scope.model.Role = "ROLE_ACT_STAFF";
        validationSelect($scope.model);
        if (!validationSelect($scope.model).Status) {
            $scope.model.ActivityCode = $rootScope.ActivityCode;
            $scope.model.DepartmentCode = $scope.departmentAssignCode;
            $scope.model.GroupCode = $scope.groupAssignCode;

            // if there user exist, find that user

            // if user have the activity do nothing

            // else add object act_code, act_name
            userIndex = $rootScope.ListUser.findIndex(x => x.Username == item.UserName);
            if (userIndex != -1) {
                actIndex = $rootScope.ListUser[userIndex].activity_role.findIndex(x => x.activity_code == $rootScope.ActivityCode);
                if (actIndex == -1) {
                    var act_role = {
                        activity_code: $rootScope.ActivityCode,
                        activity_name: $rootScope.ActivityName,
                        role: $scope.model.Role
                    }
                    $rootScope.ListUser[userIndex].activity_role.push(act_role);
                }
            }
            else {
                var user_role = {
                    Username: item.UserName,
                    activity_role: [{
                        activity_code: $rootScope.ActivityCode,
                        activity_name: $rootScope.ActivityName,
                        role: $scope.model.Role
                    }]
                }
                $rootScope.ListUser.push(user_role);
            }

            var wfData = {
                WfCode: $rootScope.WfCatCode,
                UserList: JSON.stringify($rootScope.ListUser)
            }
            dataservice.updateWfUserList(wfData, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                }
                else {

                }
            })

            dataservice.assign($scope.model, function (rs) {
                rs = rs.data;
                if (rs.Error) {
                    App.toastrError(rs.Title);
                } else {
                    App.toastrSuccess(rs.Title);
                    $scope.resetTable()
                }
            })
        }
    }
    
    $scope.resetTable=function(){
        var data = {
            ActivityCode: $rootScope.ActivityCode,
        };
        dataservice.getMemberAssign(data, function (rs) {
            rs = rs.data;
            $scope.lstMemberAssign = rs;
        })
    }

    function validationSelect(data) {
        var mess = { Status: false, Title: "" }
        //if (data.Branch == "") {
        //    $scope.errorBranch = true;
        //    mess.Status = true;
        //} else {
        //    $scope.errorBranch = false;
        //}

        //if (data.Object == "" || data.Object == null || data.Object == undefined) {
        //    $scope.errorObject = true;
        //    mess.Status = true;
        //} else {
        //    $scope.errorObject = false;
        //}

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
    vm.dtColumns.push(DTColumnBuilder.newColumn('_STT').withTitle('{{"ACT_LIST_COL_INDEX" | translate}}').notSortable().withOption('sWidth', '30px').withOption('sClass', 'tcenter w50').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ValueSet').withTitle('{{"ACT_LIST_COL_VALUE_SETTING" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('TypeName').withTitle('{{"ACT_LIST_COL_TYPE_DATA" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedTime').withTitle('{{"ACT_LIST_COL_CREATE_DATE" | translate}}').renderWith(function (data, type) {
        return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy') : null;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedBy').withTitle('{{"ACT_LIST_COL_CREATOR" | translate}}').renderWith(function (data, type) {
        return data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').notSortable().withOption('sClass', 'nowrap').withTitle('{{"COM_LIST_COL_ACTION" | translate}}').renderWith(function (data, type, full) {
        return '<a title="Xoá" ng-click="delete(' + full.SettingID + ')" style1="width: 25px; height: 25px; padding: 0px" class1="btn btn-icon-only btn-circle btn-outline red"><i class="fas fa-trash-alt fs25 text-danger"></i></a>';
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
            App.toastrError(caption.ACT_MSG_VALUE_SET);
        } else if ($scope.model.ValueSet.length > 255) {
            App.toastrError(caption.ACT_MSG_VALUE_SET_TOO_BIG);
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
        if ($scope.model.ValueSet == '') {
            App.toastrError(caption.ACT_MSG_VALUE_SET)
        } else if ($scope.model.ValueSet.length > 255) {
            App.toastrError(caption.ACT_MSG_VALUE_SET_TOO_BIG);
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

app.controller('fileManage', function ($scope, $rootScope, $compile, $uibModal, $uibModalInstance, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, $filter, $translate, para) {
    var vm = $scope;
    $scope.selected = [];
    $scope.treeData = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-change="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/WorkflowActivity/GetFileByObjShare",
            beforeSend: function (jqXHR, settings) {
                resetCheckbox();
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.ObjCode = $scope.model.ObjFileShare;
                d.LstObjCode = $scope.model.ListRepository
            },
            complete: function () {
                App.unblockUI("#contentMain");
                $(".dataTables_scrollBody").addClass('scroller-sm-fade');
            }
        })
        .withPaginationType('full_numbers').withDOM("<'table-scrollable't>ip")
        .withDataProp('data').withDisplayLength(15)
        .withOption('order', [1, 'desc'])
        .withOption('serverSide', true)
        .withOption('scrollY', "290px")
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
        });

    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle(titleHtml).notSortable()
        .renderWith(function (data, type, full, meta) {
            $scope.selected[full.Id] = false;
            return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.Id + ']" ng-change="toggleOne(selected)"/><span></span></label>';
        }).withOption('sWidth', '30px').withOption('sClass'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileName').withOption('sClass', '').withTitle("{{'ACT_LIST_COL_FILE_NAME' | translate}}").withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
        var dataSubstr = data.length > 80 ? data.substr(0, 80) + " ..." : data;
        var excel = ['XLSM', 'XLSX', 'XLS'];
        var document = ['TXT'];
        var word = ['DOCX', 'DOC'];
        var pdf = ['PDF'];
        var powerPoint = ['PPS', 'PPTX', 'PPT'];
        var image = ['JPG', 'PNG', 'TIF', 'TIFF'];
        var icon = "";
        var idxDot = full.FileUrl.lastIndexOf(".") + 1;
        var extFile = full.FileUrl.substr(idxDot, full.FileUrl.length).toUpperCase();

        if (excel.indexOf(extFile.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(106,170,89);font-size: 15px;" class="fa fa-file-excel-o pr5" aria-hidden="true"></i>';
        } else if (word.indexOf(extFile.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(13,118,206);font-size: 15px;" class="fa fa-file-word-o pr5" aria-hidden="true"></i>';
        } else if (document.indexOf(extFile.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(0,0,0);font-size: 15px;" class="fa fa-file-text-o pr5" aria-hidden="true"></i>';
        } else if (pdf.indexOf(extFile.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-pdf-o pr5" aria-hidden="true"></i>';
        } else if (powerPoint.indexOf(extFile.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(226,165,139);font-size: 15px;" class="fa fa-file-powerpoint-o pr5" aria-hidden="true"></i>';
        } else if (image.indexOf(extFile.toUpperCase()) !== -1) {
            icon = '<i style="color: rgb(42,42,42);font-size: 15px;" class="fa fa-picture-o pr5" aria-hidden="true"></i>';
        } else {
            icon = '<i style="color: rgb(42,42,42);font-size: 15px;" class="fas fa-align-justify pr5" aria-hidden="true"></i>';
        }
        return icon + dataSubstr;
    }));
    vm.reloadData = reloadData;

    vm.dtInstance = {};

    function reloadData(resetPaging) {
        vm.dtInstance.reloadData(callback, resetPaging);
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

    function resetCheckbox() {
        $scope.selected = [];
        vm.selectAll = false;
    }

    $scope.reload = function () {
        reloadData(true);
    }

    $scope.cancel = function () {
        $uibModalInstance.close('cancel');
    }

    $scope.initData = function () {
        dataservice.getObjFileShare(function (rs) {
            rs = rs.data;
            $scope.lstObjFileShare = rs;
        })
    }

    $scope.initData();

    //treeview
    $scope.model = {
        ListRepository: []
    }

    var nodeBefore = "";

    $scope.readyCB = function () {
        App.blockUI({
            target: "#contentMainRepository",
            boxed: true,
            message: 'loading...'
        });
        dataservice.getTreeCategory(function (result) {
            result = result.data;

            if (!result.Error) {
                var root = {
                    id: 'root',
                    parent: "#",
                    text: "Tất cả kho dữ liệu",//"Tất cả kho dữ liệu"
                    state: { selected: false, opened: true, checkbox_disabled: true, disabled: true }
                }
                $scope.treeData.push(root);
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
                            state: { selected: false, opened: true }
                        }
                        $scope.treeData.push(data);
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
                            state: { selected: false, opened: true }
                        }
                        $scope.treeData.push(data);
                    }
                }
                App.unblockUI("#contentMainRepository");
            }
        });
    }

    $scope.selectNodeRepository = function (e, data) {

        var listSelect = [];
        $scope.model.ObjFileShare = "";
        var idCurrentNode = data.node.id;
        if (nodeBefore != idCurrentNode) {
            $("#" + nodeBefore + "_anchor").removeClass('bold');

            nodeBefore = idCurrentNode;
            $scope.recentFile = false;
            var listNoteSelect = $scope.treeInstance.jstree(true).get_checked(true);
            for (var i = 0; i < listNoteSelect.length; i++) {
                listSelect.push(listNoteSelect[i].id);
            }
            $scope.model.ListRepository = listSelect;
            $scope.reload();
        }
        else {
            $scope.recentFile = false;
            listSelect = [];
            $("#" + idCurrentNode + "_anchor").addClass('bold');
            listSelect.push(idCurrentNode);
            $scope.model.ListRepository = listSelect;
            $scope.reload();
        }
    }

    $scope.deselectNodeRepository = function (e, data) {
        $scope.recentFile = false;
        var listSelect = [];
        var listNoteSelect = $scope.treeInstance.jstree(true).get_checked(true);
        if (listNoteSelect.length > 0) {
            for (var i = 0; i < listNoteSelect.length; i++) {
                listSelect.push(listNoteSelect[i].id);
                dataserviceCardJob.getTreeInNode(listNoteSelect[i].id, function (rs) {
                    rs = rs.data;
                    if (rs.length > 0) {
                        for (var i = 0; i < rs.length; i++) {
                            listSelect.push(rs[i].Code);
                        }
                    }
                    $scope.model.ListRepository = listSelect;
                    $scope.reload();
                })
            }
        } else {
            $scope.model.ListRepository = listSelect;
            $scope.reload();
        }


    }

    $scope.treeConfig = {
        core: {
            multiple: true,
            animation: true,
            error: function (error) {
                //$log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
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
        plugins: ['checkbox', 'types', 'contextmenu'],
        checkbox: {
            "three_state": false,
            "whole_node": false,
            "keep_selected_style": false,
            "cascade": "undetermined",
        },
        contextmenu: {
            items: customMenu
        }
    };

    $scope.treeEvents = {
        'ready': $scope.readyCB,
        'select_node': $scope.selectNodeRepository,
        'deselect_node': $scope.deselectNodeRepository,
    }

    $scope.ac = function () {
        return true;
    }

    function customMenu(node) {
        var items = {
            'item1': {
                'label': caption.COM_BTN_EDIT,
                'icon': "fa fa-edit",
                'action': function (data) {
                    dataservice.getItemCategory(node.original.catId, function (rs) {
                        rs = rs.data;
                        if (rs.Error) {
                            App.toastrError(rs.Title);
                        } else {
                            var modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: ctxfolder + '/editCategory.html',
                                controller: 'editCategory',
                                backdrop: 'static',
                                size: '70',
                                resolve: {
                                    para: function () {
                                        return rs.Object;
                                    }
                                }
                            });
                            modalInstance.result.then(function (d) {
                                $('#treeDiv').jstree(true).refresh();
                                setTimeout(function () {
                                    $scope.readyCB();
                                }, 200);
                            }, function () {
                            });
                        }
                    })
                }
            },
            'item2': {
                'label': caption.COM_BTN_DELETE,
                'icon': "fa fa-trash",
                'action': function (data) {
                    var modalInstance = $uibModal.open({
                        templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
                        windowClass: "message-center",
                        resolve: {
                            para: function () {
                                return node.original.catCode;
                            }
                        },
                        controller: function ($scope, $uibModalInstance, para) {
                            $scope.message = caption.EDMSR_MSG_DELETE_CATEGORIES;
                            $scope.ok = function () {

                                dataservice.deleteCategory(para, function (rs) {
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
                        $('#treeDiv').jstree(true).refresh();
                        setTimeout(function () {
                            $scope.readyCB();
                            $scope.reload();
                        }, 200);
                    }, function () {
                    });
                }
            }
        }
        return items;
    }

    $scope.changeObj = function () {
        $scope.treeInstance.jstree(true).uncheck_all();
        $scope.model.ListRepository = [];
        $scope.reload();
    }

    $scope.addFile = function () {
        var data = [];
        var listdata = $('#tblDataFileShare').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            for (var id in $scope.selected) {
                if ($scope.selected.hasOwnProperty(id)) {
                    if ($scope.selected[id] && listdata[i].Id == id) {
                        if (listdata[i].Id == id) {
                            var obj = {
                                FileID: listdata[i].FileCode,
                                ObjectType: "",
                                ObjectInstance: para,
                                FileCreated: listdata[i].FileCreated,
                                FileUrl: listdata[i].FileUrl,
                                FileName: listdata[i].FileName
                            };
                            data.push(obj);
                            break;
                        }
                    }
                }
            }
        }
        dataservice.insertFileShare(data, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            }
            else {
                App.toastrSuccess(rs.Title);
            }
        })
    }

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});

app.controller('fileActivity', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, dataservice, $filter, $translate, dataserviceSupplier) {
    var vm = $scope;
    $scope.selected = [];
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
    $scope.model = {
        FromDate: '',
        ToDate: '',
    }
    var titleHtml = '<label class="mt-checkbox"><input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)"/><span></span></label>';
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: "/Admin/Activity/JTableFile",
            beforeSend: function (jqXHR, settings) {
                App.blockUI({
                    target: "#contentMain",
                    boxed: true,
                    message: 'loading...'
                });
            },
            type: 'POST',
            data: function (d) {
                d.ActCode = $rootScope.ActivityCode;
                d.FromDate = $scope.model.FromDate;
                d.ToDate = $scope.model.ToDate;
            },
            complete: function () {
                App.unblockUI("#contentMain");
                heightTableManual(250, "#tblDataCustomerFile");
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
        .withOption('createdRow', function (row, data, dataIndex) {
            const contextScope = $scope.$new(true);
            contextScope.data = data;
            contextScope.contextMenu = $scope.contextMenu;
            $compile(angular.element(row))($scope);
            $compile(angular.element(row).attr('context-menu', 'contextMenu'))(contextScope);
        });
    vm.dtColumns = [];
    vm.dtColumns.push(DTColumnBuilder.newColumn("Id").withTitle(titleHtml).notSortable().renderWith(function (data, type, full, meta) {
        $scope.selected[full.Id] = false;
        return '<label class="mt-checkbox"><input type="checkbox" ng-model="selected[' + full.Id + ']" ng-click="toggleOne(selected)"/><span></span></label>';
    }).withOption('sClass', 'hidden'));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileName').withTitle("{{'ACT_LIST_COL_FILE_NAME' | translate}}").renderWith(function (data, type, full) {
        var excel = ['.XLSM', '.XLSX', '.XLS'];
        var document = ['.TXT'];
        var word = ['.DOCX', '.DOC'];
        var pdf = ['.PDF'];
        var powerPoint = ['.PPS', '.PPTX', '.PPT'];
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        var icon = "";
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
        return icon + data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('ReposName').withTitle("{{'ACT_LBL_CAT' | translate}}").renderWith(function (data, type, full) {
        return '<i class="fa fa-folder-open icon-state-warning"></i>&nbsp' + data;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('FileID').withOption('sClass', 'nowrap dataTable-w80 text-center').withTitle("{{'ACT_LIST_COL_EDIT_FILE' | translate}}").notSortable().renderWith(function (data, type, full) {
        var excel = ['.XLSM', '.XLSX', '.XLS'];
        var document = ['.TXT'];
        var word = ['.DOCX', '.DOC'];
        var pdf = ['.PDF'];
        var powerPoint = ['.PPS', '.PPTX', '.PPT'];
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        var icon = "";
        var typefile = "#";
        if (excel.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            typefile = 'excel';
            return '<a ng-click="viewExcel(' + full.Id + ', 2' + ')" title="{{&quot; Chỉnh sửa &quot; | translate}}" style1="width: 25px; height: 25px; padding: 0px" class1="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit fs25 pt5"></i></a>';
        } else if (word.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            typefile = 'Syncfusion';
            return '<a ng-click="viewWord(' + full.Id + ', 2' + ')" title="{{&quot; Chỉnh sửa &quot; | translate}}" style1="width: 25px; height: 25px; padding: 0px" class1="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit fs25 pt5"></i></a>';
        } else if (pdf.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            typefile = 'pdf';
            return '<a ng-click="viewPDF(' + full.Id + ', 2' + ')" title="{{&quot; Chỉnh sửa &quot; | translate}}" style1="width: 25px; height: 25px; padding: 0px" class1="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit fs25 pt5"></i></a>';
        } else if (document.indexOf(full.FileTypePhysic.toUpperCase()) !== -1 || image.indexOf(full.FileTypePhysic.toUpperCase()) !== -1) {
            return '<a ng-click="view(' + full.Id + ')" title="{{&quot; Chỉnh sửa &quot; | translate}}" style1="width: 25px; height: 25px; padding: 0px" class1="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit fs25 pt5"></i></a>';
        } else {
            return '<a ng-click="getObjectFile(0)" title="{{&quot; Chỉnh sửa &quot; | translate}}" style1="width: 25px; height: 25px; padding: 0px" class1="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-edit fs25 pt5"></i></a>';
        }
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('').withTitle('{{"ACT_CRUD_DES" | translate}}').notSortable().renderWith(function (data, type, full) {
        return '<button title="Mô tả" ng-click="extension(' + full.FileID + ')" style="width: 25px; height: 25px; padding: 0px" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa fa-info-circle"></i></button>';
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('CreatedTime').withTitle("{{'ACT_LIST_COL_CREATE_DATE' | translate}}").renderWith(function (data, type) {
        return data != "" ? $filter('date')(new Date(data), 'dd/MM/yyyy') : null;
    }));
    vm.dtColumns.push(DTColumnBuilder.newColumn('action').withTitle($translate('COM_LIST_COL_ACTION')).withOption('sClass', 'w75').renderWith(function (data, type, full) {
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

    $scope.add = function () {
        if ($scope.file == '' || $scope.file == undefined) {
            App.toastrError(caption.COM_MSG_CHOSE_FILE);
        } else {
            var data = new FormData();
            data.append("FileUpload", $scope.file);
            data.append("ActCode", $rootScope.ActivityCode);
            data.append("IsMore", false);
            dataservice.insertActCatFile(data, function (result) {
                result = result.data;
                if (result.Error) {
                    App.toastrError(result.Title);
                } else {
                    App.toastrSuccess(result.Title);
                    defaultShareFile(result.Object);
                    $scope.reload();
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
                    controller: 'fileEditActCat',
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
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = caption.COM_MSG_DELETE_CONFIRM_COM;
                $scope.ok = function () {
                    dataservice.deleteActCatFile(id, function (result) {
                        result = result.data;
                        if (result.Error) {
                            App.toastrError(result.Title);
                        } else {
                            App.toastrSuccess(result.Title);
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
            $scope.reload();
        }, function () {
        });
    }

    $scope.share = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolderFileShare + '/fileShare.html',
            controller: 'fileShare',
            windowClass: 'modal-center',
            backdrop: 'static',
            size: '60',
        });
        modalInstance.result.then(function (d) {
            reloadData()
        }, function () { });
    }

    $scope.dowload = function (fileCode) {
        location.href = "/Admin/EDMSRepository/DownloadFile?fileCode="
            + fileCode;
    }

    $scope.extend = function () {

        if ($rootScope.ActivityCode == "" || $rootScope.ActivityCode == undefined || $rootScope.ActivityCode == null) {
            return App.toastrError(caption.ACT_MSG_PLS_ADD_ACT_FIRST);
        }

        dataserviceSupplier.getDefaultRepo($rootScope.ActivityCode, 'ACT_CAT', function (rs) {
            rs = rs.data;
            var data = rs !== null ? rs : { CatCode: '', ObjectCode: $rootScope.ActivityCode, ObjectType: 'ACT_CAT' };
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
        var userModel = {};
        var listdata = $('#tblDataCustomerFile').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
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
            } else {
                App.toastrError(caption.HR_HR_FILE_SIZE_LIMIT);
            }

        }
    };

    $scope.viewWord = function (id, mode) {
        var userModel = {};
        var listdata = $('#tblDataCustomerFile').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
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
                App.toastrError(caption.HR_HR_FILE_SIZE_LIMIT);
            }
        }
    };

    $scope.viewPDF = function (id, mode) {
        var userModel = {};
        var listdata = $('#tblDataCustomerFile').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
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
            } else {
                App.toastrError(caption.HR_HR_FILE_SIZE_LIMIT);
            }
        }
    };

    $scope.view = function (id) {
        var isImage = false;
        var image = ['.JPG', '.PNG', '.TIF', '.TIFF'];
        var userModel = {};
        var listdata = $('#tblDataCustomerFile').DataTable().data();
        for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].Id == id) {
                userModel = listdata[i];
                break;
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

    $scope.share = function (id) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/shareFile.html',
            controller: 'shareFile',
            backdrop: 'static',
            size: '40',
            resolve: {
                para: function () {
                    return {
                        Id: id,
                        ActCode: $rootScope.ActivityCode
                    };
                }
            }
        });
        modalInstance.result.then(function (d) {
            $scope.reload();
        }, function () {
        });
    };

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
        ListUserShare: ''
    };

    function defaultShareFile(id) {
        dataservice.getListUserShare($rootScope.ActivityCode, function (rs) {
            rs = rs.data;
            $scope.listUser = rs;
            if ($scope.listUser.length > 0) {
                $scope.modelShare.ListUserShare = JSON.stringify($scope.listUser);
                $scope.modelShare.Id = id;
                dataservice.insertFileShareActCat($scope.modelShare, function (rs) {
                    rs = rs.data;
                });
            }
        });
    }

    setTimeout(function () {
        loadDate();
    }, 200);
});

app.controller('fileEditActCat', function ($scope, $rootScope, $compile, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModal, $uibModalInstance, dataservice, para) {
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
    vm.dtColumns.push(DTColumnBuilder.newColumn('FolderName').withOption('sClass', '').withTitle('{{"HR_HR_FORDER" | translate}}').withOption('sClass', 'nowrap').renderWith(function (data, type, full) {
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
                data.append("ActCode", $rootScope.ActivityCode);
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

app.controller('shareFile', function ($scope, $rootScope, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstances, $uibModalInstance, dataservice, para) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.model = {
        Id: '',
        ListUserShare: ''
    };

    $scope.model1 = {
        ListUserShare: []
    };

    $scope.init = function () {
        $scope.model.Id = para.Id;

        dataservice.getListUserShare(para.ActCode, function (rs) {
            rs = rs.data;
            $scope.listUser = rs;
        });

        dataservice.getFileShare(para.Id, function (rs) {
            rs = rs.data;
            if (!rs.Error && rs.Object !== undefined && rs.Object !== null && rs.Object !== '') {
                $scope.model1.ListUserShare = JSON.parse(rs.Object.ListUserShare);
            }
        });
    };

    $scope.init();

    $scope.share = function () {
        if ($scope.model1.ListUserShare.length === 0)
            return App.toastrError(caption.ACT_MSG_LIST_ASSIGN_EMPTY);

        $scope.model.ListUserShare = JSON.stringify($scope.model1.ListUserShare);

        dataservice.insertFileShareActCat($scope.model, function (rs) {
            rs = rs.data;
            if (rs.Error) {
                App.toastrError(rs.Title);
            } else {
                App.toastrSuccess(rs.Title);
                $uibModalInstance.close();
            }
        });
    };

    setTimeout(function () {
        setModalDraggable('.modal-dialog');
    }, 200);
});
