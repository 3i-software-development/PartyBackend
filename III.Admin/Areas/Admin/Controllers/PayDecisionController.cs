﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using ESEIM;
using ESEIM.Models;
using ESEIM.Utils;
using FTU.Utils.HelperNet;
using III.Domain.Enums;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Hosting.Internal;
using Newtonsoft.Json;
using DocumentFormat.OpenXml.Office.CustomUI;
using System.Text.RegularExpressions;
using SmartBreadcrumbs.Attributes;
using Syncfusion.XlsIO;

namespace III.Admin.Controllers
{
    [Area("Admin")]
    public class PayDecisionController : BaseController
    {
        private readonly EIMDBContext _context;
        private readonly IUploadService _upload;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IStringLocalizer<HrEmployeeMobilizationController> _stringLocalizer;
        private readonly IStringLocalizer<SharedResources> _sharedResources;
        private readonly IStringLocalizer<PayDecisionController> _stringLocalizerPayD;
        private readonly IWorkflowService _workflowService;
        private readonly IStringLocalizer<WorkflowActivityController> _workflowActivityController;
        public PayDecisionController(EIMDBContext context, IUploadService upload,
            IHostingEnvironment hostingEnvironment,
            IStringLocalizer<HrEmployeeMobilizationController> stringLocalizer,
            IStringLocalizer<PayDecisionController> stringLocalizerPayD,
        IStringLocalizer<SharedResources> sharedResources, IWorkflowService workflowService,
            IStringLocalizer<WorkflowActivityController> workflowActivityController)
        {
            _context = context;
            _upload = upload;
            _hostingEnvironment = hostingEnvironment;
            _stringLocalizer = stringLocalizer;
            _stringLocalizerPayD = stringLocalizerPayD;
            _sharedResources = sharedResources;
            _workflowService = workflowService;
            _workflowActivityController = workflowActivityController;
        }
        [Breadcrumb("ViewData.CrumbPayDecision", AreaName = "Admin", FromAction = "Index", FromController = typeof(EmployeeHomeController))]
        public IActionResult Index()
        {
            ViewData["CrumbDashBoard"] = _sharedResources["COM_CRUMB_DASH_BOARD"];
            ViewData["CrumbMenuCenter"] = _sharedResources["COM_CRUMB_MENU_CENTER"];
            ViewData["CrumbEmployeeHome"] = _sharedResources["COM_CRUMB_EMPLOYEE_HOME"];
            ViewData["CrumbPayDecision"] = _sharedResources["COM_CRUMB_PAY_DEC"];
            return View();
        }

        #region JTable
        [HttpPost]
        public object JTable([FromBody] JTableModelPayDecision jTablePara)
        {
            var toDay = DateTime.Now;
            var fromDate = !string.IsNullOrEmpty(jTablePara.FromDate) ? DateTime.ParseExact(jTablePara.FromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
            var toDate = !string.IsNullOrEmpty(jTablePara.ToDate) ? DateTime.ParseExact(jTablePara.ToDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
            int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;
            var query = (from a in _context.PayDecisionHeaders.Where(x => !x.IsDeleted)
                             //join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                             //from b in b1.DefaultIfEmpty()
                         let listStatus = !string.IsNullOrEmpty(a.Status) ? JsonConvert.DeserializeObject<List<JsonLog>>(a.Status) : new List<JsonLog>()
                         let completeStatus = listStatus.Where(x => !string.IsNullOrEmpty(x.Code) && x.Code.Equals("STATUS_ACTIVITY_APPROVE_END")).OrderByDescending(p => p.CreatedTime).FirstOrDefault()
                         let signer = completeStatus != null ? completeStatus.CreatedBy : ""
                         let signTime = completeStatus != null ? completeStatus.CreatedTime : (DateTime?)null
                         where (string.IsNullOrEmpty(jTablePara.DecisionNum) || a.DecisionNum.ToLower().Contains(jTablePara.DecisionNum.ToLower()) || a.Title.ToLower().Contains(jTablePara.DecisionNum.ToLower()))
                             && (string.IsNullOrEmpty(jTablePara.Signer) || signer.Equals(jTablePara.Signer))
                             && (string.IsNullOrEmpty(jTablePara.Status) || a.Status.Equals(jTablePara.Status))
                             && (fromDate == null || a.CreatedTime >= fromDate)
                             && (toDate == null || a.CreatedTime <= toDate)
                         select new
                         {
                             a.Id,
                             a.DecisionNum,
                             a.Title,
                             Full = a.DecisionNum + "_" + a.Title,
                             a.CreatedTime,
                             Status = listStatus.Count > 0 ? listStatus[listStatus.Count - 1].Name : "",
                             Signer = signer,
                             SignTime = signTime,
                         }).OrderByDescending(x => x.CreatedTime);
            var count = query.Count();
            var data = query.Skip(intBeginFor).Take(jTablePara.Length);
            var jdata = JTableHelper.JObjectTable(data.ToList(), jTablePara.Draw, count, "Id", "DecisionNum", "Full", "Title", "Status", "Signer", "SignTime", "CreatedTime");
            return Json(jdata);
        }

        [HttpPost]
        public object JTableDetail([FromBody] JTableModelPayDecisionDetail jTablePara)
        {
            var toDay = DateTime.Now;
            int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;
            var query = (from a in _context.PayDecisionDetails
                         where a.IsDeleted == false
                         && (a.DecisionNum.Equals(jTablePara.DecisionNum))
                         select new
                         {
                             a.Id,
                             a.DecisionNum,
                             UserName = _context.HREmployees.FirstOrDefault(x => x.flag == 1 && x.employee_code.Equals(a.EmployeeCode)).fullname,
                             CodeName = _context.HREmployees.FirstOrDefault(x => x.flag == 1 && x.employee_code.Equals(a.EmployeeCode)).employee_code != null ? _context.HREmployees.FirstOrDefault(x => x.flag == 1 && x.employee_code.Equals(a.EmployeeCode)).employee_code : "",
                             Position = _context.AdDepartments.FirstOrDefault(x => !x.IsDeleted && x.DepartmentCode.Equals(_context.HREmployees.FirstOrDefault(b => b.flag == 1 && b.employee_code.Equals(a.EmployeeCode)).unit)).Title,
                             a.CreatedTime,
                             TitleName = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.Group == EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.PayTitle) && x.CodeSet.Equals(a.CareerTitle)).ValueSet,
                             CareerCode = _context.CategoryCareers.FirstOrDefault(x => !x.IsDeleted && x.CareerCode.Equals(a.CareerCode)).CareerName,
                             a.PayRange,
                             a.PayScale,
                             a.Salary
                         }).OrderByDescending(x => x.CreatedTime);
            var count = query.Count();
            var data = query.Skip(intBeginFor).Take(jTablePara.Length);
            var jdata = JTableHelper.JObjectTable(data.ToList(), jTablePara.Draw, count, "Id", "UserName", "CodeName", "Position", "TitleName", "CareerCode", "PayScale", "PayRange", "Salary", "CreatedTime");
            return Json(jdata);
        }
        #endregion

        #region Header
        [HttpPost]
        public JsonResult Insert([FromBody] PayDecisionHeader data)
        {
            var msg = new JMessage { Title = "", Error = false };
            try
            {
                var decisionDate = !string.IsNullOrEmpty(data.DecisionDate) ? DateTime.ParseExact(data.DecisionDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : DateTime.Now;
                var model = _context.PayDecisionHeaders.FirstOrDefault(x => !x.IsDeleted && x.DecisionNum.Equals(data.DecisionNum));
                if (model == null)
                {
                    var status = new JsonLog
                    {
                        Code = data.Status,
                        CreatedBy = _context.Users.FirstOrDefault(x => x.UserName.Equals(ESEIM.AppContext.UserName)).GivenName,
                        Name = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(data.Status)) != null ? _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(data.Status)).ValueSet : "",
                        CreatedTime = DateTime.Now,
                    };

                    data.ListStatus.Add(status);
                    data.Status = JsonConvert.SerializeObject(data.ListStatus);

                    data.CreatedBy = User.Identity.Name;
                    data.CreatedTime = decisionDate;
                    _context.PayDecisionHeaders.Add(data);
                    _context.SaveChanges();
                    msg.Title = "Thêm thành công";
                }
                else
                {
                    DeleteWorkFlowInstance(data.DecisionNum);

                    msg.Error = true;
                    msg.Title = "Số quyết định đã tồn tại";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Thêm thất bại !";
            }
            return Json(msg);
        }

        [HttpPost]
        public object GetItemHeader(int id)
        {
            var session = HttpContext.GetSessionUser();
            var data = _context.PayDecisionHeaders.FirstOrDefault(x => x.Id == id && !x.IsDeleted);

            var list = new List<ComboxModel>();
            var check = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.ObjectInst.Equals(data.DecisionNum) && x.ObjectType.Equals(EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.PayDecision)));
            if (check != null)
            {
                data.WfInstId = check.Id;
                var acts = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(check.WfInstCode));
                var current = check.MarkActCurrent;
                if (!string.IsNullOrEmpty(current))
                {
                    var initial = acts.FirstOrDefault(x => x.Type.Equals("TYPE_ACTIVITY_INITIAL"));
                    if (initial != null)
                    {
                        var infoActInitial = new ComboxModel
                        {
                            IntsCode = initial.ActivityInstCode,
                            Code = initial.ActivityCode,
                            Name = initial.Title,
                            Status = initial.Status,
                            UpdateBy = !string.IsNullOrEmpty(initial.UpdatedBy) ? _context.Users.FirstOrDefault(x => x.UserName.Equals(initial.UpdatedBy)).GivenName ?? "" : "",
                            UpdateTime = initial.UpdatedTime.HasValue ? initial.UpdatedTime.ToString() : ""
                        };
                        list.Add(infoActInitial);

                        var runningNext = _context.WorkflowInstanceRunnings.FirstOrDefault(x => x.ActivityInitial.Equals(initial.ActivityInstCode));
                        if (runningNext != null)
                        {
                            var nextActRunning = !string.IsNullOrEmpty(runningNext.ActivityDestination) ? runningNext.ActivityDestination : "";
                            var count = 1;
                            foreach (var item in acts)
                            {
                                var inti = acts.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(nextActRunning));
                                if (inti != null && count < acts.Count())
                                {
                                    var name2 = new ComboxModel
                                    {
                                        IntsCode = inti.ActivityInstCode,
                                        Code = inti.ActivityCode,
                                        Name = inti.Title,
                                        Status = inti.Status,
                                        UpdateBy = !string.IsNullOrEmpty(inti.UpdatedBy) ? _context.Users.FirstOrDefault(x => x.UserName.Equals(inti.UpdatedBy)).GivenName ?? "" : "",
                                        UpdateTime = inti.UpdatedTime.HasValue ? inti.UpdatedTime.ToString() : ""
                                    };
                                    list.Add(name2);
                                    var location2 = _context.WorkflowInstanceRunnings.FirstOrDefault(x => !x.IsDeleted && x.ActivityInitial.Equals(inti.ActivityInstCode));
                                    if (location2 != null)
                                    {
                                        nextActRunning = location2.ActivityDestination;
                                    }
                                }
                                count++;
                            }
                        }
                        else
                        {
                            return data;
                        }
                    }
                    else
                    {
                        return data;
                    }

                    var assign = _context.ExcuterControlRoleInsts.FirstOrDefault(x => !x.IsDeleted && x.ActivityCodeInst.Equals(current) && x.UserId.Equals(ESEIM.AppContext.UserId));
                    var typeAct = "";
                    var nextAct = "";
                    var checkEnd = "";
                    if (acts.FirstOrDefault(x => !x.Status.Equals("STATUS_ACTIVITY_APPROVED") && x.Type.Equals("TYPE_ACTIVITY_INITIAL")) != null)
                    {
                        typeAct = "TYPE_ACTIVITY_INITIAL";
                    }
                    else if (acts.FirstOrDefault(x => !x.Status.Equals("STATUS_ACTIVITY_APPROVED") && x.Type.Equals("TYPE_ACTIVITY_REPEAT")) != null)
                    {
                        typeAct = "TYPE_ACTIVITY_REPEAT";
                        nextAct = _context.WorkflowInstanceRunnings.FirstOrDefault(x => !x.IsDeleted && x.ActivityInitial.Equals(current)).ActivityDestination;
                        checkEnd = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(nextAct)).Type;
                    }
                    else if (acts.FirstOrDefault(x => !x.Status.Equals("STATUS_ACTIVITY_APPROVED") && x.Type.Equals("TYPE_ACTIVITY_END")) != null)
                    {
                        typeAct = "TYPE_ACTIVITY_END";
                    }

                    if (assign != null || session.IsAllData)
                    {
                        if (typeAct.Equals("TYPE_ACTIVITY_INITIAL"))
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.StatusActWF)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = true, editdetail = true, list, current };
                        }
                        if (typeAct.Equals("TYPE_ACTIVITY_REPEAT") && checkEnd != "TYPE_ACTIVITY_END")
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.StatusActWFREPEAT)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = true, editdetail = false, list, current };
                        }
                        if (typeAct.Equals("TYPE_ACTIVITY_REPEAT") && checkEnd == "TYPE_ACTIVITY_END")
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.DecisionEnd)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = true, editdetail = false, list, current };
                        }
                        if (typeAct.Equals("TYPE_ACTIVITY_END"))
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.StatusActWFFINAL)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = true, editdetail = false, list, current };
                        }
                        else { return data; }
                    }
                    else
                    {
                        if (typeAct.Equals("TYPE_ACTIVITY_INITIAL"))
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.StatusActWF)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = false, editdetail = false, list, current };
                        }
                        if (typeAct.Equals("TYPE_ACTIVITY_REPEAT") && (data.Status.Equals("INITIAL_DONE") || data.Status.Equals("REPEAT_STOP") || data.Status.Equals("REPEAT_REWORK") || data.Status.Equals("REPEAT_REQUIRE_REWORK") || data.Status.Equals("REPEAT_WORKING")))
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.StatusActWFREPEAT)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = false, editdetail = false, list, current };
                        }
                        if (typeAct.Equals("TYPE_ACTIVITY_REPEAT") && (data.Status.Equals("REPEAT_DONE") || data.Status.Equals("END_REQUIRE_REWORK") || data.Status.Equals("END_REWORK") || data.Status.Equals("END_STOP") || data.Status.Equals("END_WORKING")))
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.DecisionEnd)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = false, editdetail = false, list, current };
                        }
                        if (typeAct.Equals("TYPE_ACTIVITY_END"))
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.StatusActWFFINAL)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = false, editdetail = false, list, current };
                        }
                        else { return data; }
                    }
                }
                else
                {
                    return data;
                }
            }
            else
            {
                return data;
            }
        }

        [HttpPost]
        public object GetItemHeaderWithCode(string code)
        {
            var session = HttpContext.GetSessionUser();
            var data = _context.PayDecisionHeaders.FirstOrDefault(x => x.DecisionNum == code && !x.IsDeleted);

            var list = new List<ComboxModel>();
            var check = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.ObjectInst.Equals(data.DecisionNum) && x.ObjectType.Equals(EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.PayDecision)));
            if (check != null)
            {
                data.WfInstId = check.Id;
                var acts = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(check.WfInstCode));
                var current = check.MarkActCurrent;
                if (!string.IsNullOrEmpty(current))
                {
                    var initial = acts.FirstOrDefault(x => x.Type.Equals("TYPE_ACTIVITY_INITIAL"));
                    if (initial != null)
                    {
                        var infoActInitial = new ComboxModel
                        {
                            IntsCode = initial.ActivityInstCode,
                            Code = initial.ActivityCode,
                            Name = initial.Title,
                            Status = initial.Status,
                            UpdateBy = !string.IsNullOrEmpty(initial.UpdatedBy) ? _context.Users.FirstOrDefault(x => x.UserName.Equals(initial.UpdatedBy)).GivenName ?? "" : "",
                            UpdateTime = initial.UpdatedTime.HasValue ? initial.UpdatedTime.ToString() : ""
                        };
                        list.Add(infoActInitial);

                        var runningNext = _context.WorkflowInstanceRunnings.FirstOrDefault(x => x.ActivityInitial.Equals(initial.ActivityInstCode));
                        if (runningNext != null)
                        {
                            var nextActRunning = !string.IsNullOrEmpty(runningNext.ActivityDestination) ? runningNext.ActivityDestination : "";
                            var count = 1;
                            foreach (var item in acts)
                            {
                                var inti = acts.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(nextActRunning));
                                if (inti != null && count < acts.Count())
                                {
                                    var name2 = new ComboxModel
                                    {
                                        IntsCode = inti.ActivityInstCode,
                                        Code = inti.ActivityCode,
                                        Name = inti.Title,
                                        Status = inti.Status,
                                        UpdateBy = !string.IsNullOrEmpty(inti.UpdatedBy) ? _context.Users.FirstOrDefault(x => x.UserName.Equals(inti.UpdatedBy)).GivenName ?? "" : "",
                                        UpdateTime = inti.UpdatedTime.HasValue ? inti.UpdatedTime.ToString() : ""
                                    };
                                    list.Add(name2);
                                    var location2 = _context.WorkflowInstanceRunnings.FirstOrDefault(x => !x.IsDeleted && x.ActivityInitial.Equals(inti.ActivityInstCode));
                                    if (location2 != null)
                                    {
                                        nextActRunning = location2.ActivityDestination;
                                    }
                                }
                                count++;
                            }
                        }
                        else
                        {
                            return data;
                        }
                    }
                    else
                    {
                        return data;
                    }

                    var assign = _context.ExcuterControlRoleInsts.FirstOrDefault(x => !x.IsDeleted && x.ActivityCodeInst.Equals(current) && x.UserId.Equals(ESEIM.AppContext.UserId));
                    var typeAct = "";
                    var nextAct = "";
                    var checkEnd = "";
                    if (acts.FirstOrDefault(x => !x.Status.Equals("STATUS_ACTIVITY_APPROVED") && x.Type.Equals("TYPE_ACTIVITY_INITIAL")) != null)
                    {
                        typeAct = "TYPE_ACTIVITY_INITIAL";
                    }
                    else if (acts.FirstOrDefault(x => !x.Status.Equals("STATUS_ACTIVITY_APPROVED") && x.Type.Equals("TYPE_ACTIVITY_REPEAT")) != null)
                    {
                        typeAct = "TYPE_ACTIVITY_REPEAT";
                        nextAct = _context.WorkflowInstanceRunnings.FirstOrDefault(x => !x.IsDeleted && x.ActivityInitial.Equals(current)).ActivityDestination;
                        checkEnd = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(nextAct)).Type;
                    }
                    else if (acts.FirstOrDefault(x => !x.Status.Equals("STATUS_ACTIVITY_APPROVED") && x.Type.Equals("TYPE_ACTIVITY_END")) != null)
                    {
                        typeAct = "TYPE_ACTIVITY_END";
                    }

                    if (assign != null || session.IsAllData)
                    {
                        if (typeAct.Equals("TYPE_ACTIVITY_INITIAL"))
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.StatusActWF)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = true, editdetail = true, list, current };
                        }
                        if (typeAct.Equals("TYPE_ACTIVITY_REPEAT") && checkEnd != "TYPE_ACTIVITY_END")
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.StatusActWFREPEAT)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = true, editdetail = false, list, current };
                        }
                        if (typeAct.Equals("TYPE_ACTIVITY_REPEAT") && checkEnd == "TYPE_ACTIVITY_END")
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.DecisionEnd)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = true, editdetail = false, list, current };
                        }
                        if (typeAct.Equals("TYPE_ACTIVITY_END"))
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.StatusActWFFINAL)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = true, editdetail = false, list, current };
                        }
                        else { return data; }
                    }
                    else
                    {
                        if (typeAct.Equals("TYPE_ACTIVITY_INITIAL"))
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.StatusActWF)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = false, editdetail = false, list, current };
                        }
                        if (typeAct.Equals("TYPE_ACTIVITY_REPEAT") && (data.Status.Equals("INITIAL_DONE") || data.Status.Equals("REPEAT_STOP") || data.Status.Equals("REPEAT_REWORK") || data.Status.Equals("REPEAT_REQUIRE_REWORK") || data.Status.Equals("REPEAT_WORKING")))
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.StatusActWFREPEAT)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = false, editdetail = false, list, current };
                        }
                        if (typeAct.Equals("TYPE_ACTIVITY_REPEAT") && (data.Status.Equals("REPEAT_DONE") || data.Status.Equals("END_REQUIRE_REWORK") || data.Status.Equals("END_REWORK") || data.Status.Equals("END_STOP") || data.Status.Equals("END_WORKING")))
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.DecisionEnd)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = false, editdetail = false, list, current };
                        }
                        if (typeAct.Equals("TYPE_ACTIVITY_END"))
                        {
                            var com = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.StatusActWFFINAL)))
                               .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                            return new { data, com, editrole = false, editdetail = false, list, current };
                        }
                        else { return data; }
                    }
                }
                else
                {
                    return data;
                }
            }
            else
            {
                return data;
            }
        }

        [HttpPost]
        public object GetStepWorkFlow(string code)
        {
            List<ComboxModel> list = new List<ComboxModel>();
            var value = _context.Activitys.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(code));
            if (value.Count() == 1)
            {
                var stepComplete = new ComboxModel
                {
                    Code = value.FirstOrDefault().ActivityCode,
                    Name = value.FirstOrDefault().Title,
                    Status = value.FirstOrDefault().Status,
                };
                list.Add(stepComplete);
            }
            else
            {
                var initial = value.FirstOrDefault(x => !x.IsDeleted && x.Type.Equals("TYPE_ACTIVITY_INITIAL"));
                if (initial != null)
                {
                    var name = new ComboxModel
                    {
                        Code = initial.ActivityCode,
                        Name = initial.Title,
                        Status = initial.Status,
                    };
                    list.Add(name);
                    var location = _context.WorkflowSettings.FirstOrDefault(x => !x.IsDeleted && x.ActivityInitial.Equals(initial.ActivityCode));
                    if (location != null)
                    {
                        var next = location.ActivityDestination;
                        var count = 1;
                        foreach (var item in value)
                        {
                            var inti = value.FirstOrDefault(x => !x.IsDeleted && x.ActivityCode.Equals(next));
                            if (inti != null && count < value.Count())
                            {
                                var name2 = new ComboxModel
                                {
                                    Code = inti.ActivityCode,
                                    Name = inti.Title,
                                    Status = inti.Status,
                                };
                                list.Add(name2);
                                var location2 = _context.WorkflowSettings.FirstOrDefault(x => !x.IsDeleted && x.ActivityInitial.Equals(inti.ActivityCode));
                                if (location2 != null)
                                {
                                    next = location2.ActivityDestination;
                                }
                            }
                            count++;
                        }
                    }
                }
            }
            return new { list };
        }

        [HttpPost]
        public object GetListRepeat(string code)
        {
            List<ComboxModel> list = new List<ComboxModel>();
            var data = _context.PayDecisionHeaders.FirstOrDefault(x => x.DecisionNum.Equals(code) && !x.IsDeleted);
            var check = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.ObjectInst.Equals(data.DecisionNum) && x.ObjectType.Equals(EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.PayDecision)));
            var value = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(check.WfInstCode));
            var current = check.MarkActCurrent;
            var initial = value.FirstOrDefault(x => !x.IsDeleted && x.Type.Equals("TYPE_ACTIVITY_INITIAL"));
            var name = new ComboxModel
            {
                IntsCode = initial.ActivityInstCode,
                Code = initial.ActivityCode,
                Name = initial.Title,
                Status = initial.Status,
            };
            list.Add(name);
            var location = _context.WorkflowSettings.FirstOrDefault(x => !x.IsDeleted && x.ActivityInitial.Equals(initial.ActivityCode));
            var next = location.ActivityDestination;
            var count = 1;
            foreach (var item in value)
            {
                var inti = value.FirstOrDefault(x => !x.IsDeleted && x.ActivityCode.Equals(next));
                if (inti != null && count < value.Count())
                {
                    var name2 = new ComboxModel
                    {
                        IntsCode = inti.ActivityInstCode,
                        Code = inti.ActivityCode,
                        Name = inti.Title,
                        Status = inti.Status,
                    };
                    list.Add(name2);
                    var location2 = _context.WorkflowSettings.FirstOrDefault(x => !x.IsDeleted && x.ActivityInitial.Equals(inti.ActivityCode));
                    if (location2 != null)
                    {
                        next = location2.ActivityDestination;
                    }
                }
                count++;
            }
            return new { list, current };
        }

        [HttpPost]
        public JsonResult Update([FromBody] PayDecisionHeader obj)
        {
            var msg = new JMessage { Title = "", Error = false };

            try
            {
                var updatedBy = _context.Users.FirstOrDefault(x => x.UserName.Equals(ESEIM.AppContext.UserName)).GivenName;

                var data = _context.PayDecisionHeaders.FirstOrDefault(x => !x.IsDeleted && x.DecisionNum.Equals(obj.DecisionNum));
                if (data != null)
                {
                    if (data.Status == "FINAL_DONE" && obj.Status == "FINAL_DONE")
                    {
                        msg.Error = true;
                        msg.Title = "Quyết định đã được hoàn thành  !";
                        return Json(msg);
                    }

                    var countDetail = _context.PayDecisionDetails.Count(x => !x.IsDeleted && x.DecisionNum.Equals(obj.DecisionNum));
                    if (countDetail == 0)
                    {
                        msg.Error = true;
                        msg.Title = "Vui lòng nhập chi tiết  !";
                        return Json(msg);
                    }

                    //if (obj.Status != data.Status)
                    //{
                    //    var status = new JsonLog
                    //    {
                    //        Code = obj.Status,
                    //        CreatedBy = _context.Users.FirstOrDefault(x => x.UserName.Equals(ESEIM.AppContext.UserName)).GivenName,
                    //        Name = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(obj.Status)).ValueSet,
                    //        CreatedTime = DateTime.Now,
                    //    };

                    //    data.ListStatus.Add(status);
                    //    data.Status = obj.Status;
                    //}

                    data.JsonData = CommonUtil.JsonData(data, obj, data.JsonData, updatedBy);

                    data.Title = obj.Title;
                    data.Noted = obj.Noted;
                    data.UpdatedBy = ESEIM.AppContext.UserName;
                    data.UpdatedTime = DateTime.Now;

                    _context.PayDecisionHeaders.Update(data);
                    _workflowService.UpdateStatusWF(EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.PayDecision), obj.DecisionNum, obj.Status, obj.ActRepeat, HttpContext.GetSessionUser());
                    _context.SaveChanges();
                    msg.Title = _stringLocalizer["Cập nhật thành công"];
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Bản ghi không tồn tại";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Thêm thất bại !";
            }
            return Json(msg);
        }

        [HttpPost]
        public object Delete([FromBody]int Id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.PayDecisionHeaders.FirstOrDefault(x => x.Id == Id && x.IsDeleted == false);
                if (data == null)
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["Quyết định không tồn tại"];
                }
                else
                {
                    data.IsDeleted = true;
                    data.DeletedBy = User.Identity.Name;
                    data.DeletedTime = DateTime.Now;
                    _context.PayDecisionHeaders.Update(data);

                    var session = HttpContext.GetSessionUser();
                    var data1 = _context.PayDecisionDetails.Where(x => !x.IsDeleted && x.DecisionNum.Equals(data.DecisionNum));

                    foreach (var item in data1)
                    {
                        item.DeletedBy = ESEIM.AppContext.UserName;
                        item.DeletedTime = DateTime.Now;
                        item.IsDeleted = true;
                        _context.PayDecisionDetails.Update(item);
                    }

                    _context.SaveChanges();
                    msg.Title = _stringLocalizer["Xóa quyết định thành công"];

                    DeleteWorkFlowInstance(data.DecisionNum);
                }
                return msg;

            }
            catch (Exception ex)
            {
                msg.Error = true;
                //msg.Title = "Có lỗi khi xóa";
                msg.Title = _sharedResources["COM_ERR_DELETE"];
                return msg;
            }
        }

        [NonAction]
        public void DeleteWorkFlowInstance(string objCode)
        {
            var data = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.ObjectInst.Equals(objCode) && x.ObjectType.Equals(EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.PayDecision)));
            if (data != null)
            {
                data.IsDeleted = true;
                data.DeletedBy = ESEIM.AppContext.UserName;
                data.DeletedTime = DateTime.Now;
                _context.WorkflowInstances.Update(data);

                var processing = _context.WfActivityObjectProccessings.Where(x => !x.IsDeleted && x.WfInstCode.Equals(data.WfInstCode));
                foreach (var item in processing)
                {
                    item.IsDeleted = true;
                    item.DeletedBy = ESEIM.AppContext.UserName;
                    item.DeletedTime = DateTime.Now;
                    _context.WfActivityObjectProccessings.Update(item);
                }

                var actInst = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(data.WfInstCode));
                if (actInst.Any())
                {
                    foreach (var item in actInst)
                    {
                        item.IsDeleted = true;
                        item.DeletedBy = ESEIM.AppContext.UserName;
                        item.DeletedTime = DateTime.Now;
                        _context.ActivityInstances.Update(item);

                        var assigns = _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst.Equals(item.ActivityInstCode));
                        foreach (var assign in assigns)
                        {
                            assign.IsDeleted = true;
                            assign.DeletedBy = ESEIM.AppContext.UserName;
                            assign.DeletedTime = DateTime.Now;
                            _context.ExcuterControlRoleInsts.Update(assign);
                        }

                        var files = _context.ActivityInstFiles.Where(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActivityInstCode));
                        foreach (var file in files)
                        {
                            file.IsDeleted = true;
                            file.DeletedBy = ESEIM.AppContext.UserName;
                            file.DeletedTime = DateTime.Now;
                            _context.ActivityInstFiles.Update(file);
                        }

                        var attrData = _context.ActivityAttrDatas.Where(x => !x.IsDeleted && x.ActCode.Equals(item.ActivityInstCode));
                        foreach (var attr in attrData)
                        {
                            attr.IsDeleted = true;
                            attr.DeletedBy = ESEIM.AppContext.UserName;
                            attr.DeletedTime = DateTime.Now;
                            _context.ActivityAttrDatas.Update(attr);
                        }
                    }
                }
                var runnings = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.WfInstCode == data.WfInstCode);
                if (runnings.Any())
                {
                    foreach (var item in runnings)
                    {
                        item.IsDeleted = true;
                        item.DeletedBy = ESEIM.AppContext.UserName;
                        item.DeletedTime = DateTime.Now;
                        _context.WorkflowInstanceRunnings.Update(item);
                    }
                }

                _context.SaveChanges();
            }
        }

        [HttpPost]
        public object GetJsonData(string decisionNum)
        {
            var msg = new JMessage { Title = "", Error = false };

            var header = _context.PayDecisionHeaders.FirstOrDefault(x => !x.IsDeleted && x.DecisionNum.Equals(decisionNum));
            if (header != null)
            {
                var listLog = new List<object>();
                var logHeader = new
                {
                    Type = "Theo dõi thay đổi phiếu",
                    Data = !string.IsNullOrEmpty(header.JsonData) ? JsonConvert.DeserializeObject<List<object>>(header.JsonData) : new List<object>()
                };

                var logStatus = new
                {
                    Type = "Theo dõi thay đổi trạng thái",
                    Data = !string.IsNullOrEmpty(header.Status) ? JsonConvert.DeserializeObject<List<object>>(header.Status) : new List<object>()
                };

                listLog.Add(logHeader);
                listLog.Add(logStatus);

                msg.Object = JsonConvert.SerializeObject(listLog);
            }
            else
            {
                msg.Error = true;
                msg.Title = "Không lấy được thông tin quyết định";
            }

            return msg;
        }

        [HttpPost]
        public object GetStep(string decisionNum)
        {
            var msg = new JMessage { Title = "", Error = false };

            var data = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.ObjectInst.Equals(decisionNum));
            if (data != null)
            {
                return _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(data.WfInstCode));
            }
            else
            {
                msg.Error = true;
                msg.Title = "Không lấy được thông tin quyết định";
                return msg;
            }


        }

        #endregion

        #region Detail
        [HttpPost]
        public JMessage InsertDetail([FromBody] ModelDetail obj)
        {
            var msg = new JMessage { Title = "", Error = false };
            try
            {
                var data = _context.HREmployees.Where(x => x.flag == 1 && x.unit.Equals(obj.Unit));
                if (data.Count() > 0)
                {
                    var header = _context.PayDecisionHeaders.FirstOrDefault(x => !x.IsDeleted && x.DecisionNum.Equals(obj.DecisionNum));
                    if (header != null)
                    {
                        var listDetail = new List<PayDecisionDetail>();
                        if (obj.UserinDepart == "")
                        {
                            foreach (var item in data)
                            {
                                var loop = _context.PayDecisionDetails.FirstOrDefault(x => !x.IsDeleted
                                    && x.DecisionNum.Equals(header.DecisionNum) && x.EmployeeCode.Equals(item.employee_code));
                                if (loop == null)
                                {
                                    var check = _context.PayScales.Any(x => !x.IsDeleted && x.CareerCode.Equals(obj.Career) && x.PayScaleCode.Equals(obj.PayScale));
                                    if (!check)
                                    {
                                        msg.Error = true;
                                        msg.Title = "Thang lương không khớp với nghề nghiệp";
                                        return msg;
                                    }
                                    var detail = new PayDecisionDetail
                                    {
                                        DecisionNum = obj.DecisionNum,
                                        EmployeeCode = item.employee_code,
                                        PayScale = obj.PayScale,
                                        PayRange = obj.PayRanges,
                                        Salary = Convert.ToDecimal(obj.Salary),
                                        CareerCode = obj.Career,
                                        CareerTitle = obj.ChucDanh,
                                        CreatedBy = ESEIM.AppContext.UserName,
                                        CreatedTime = DateTime.Now,
                                    };

                                    listDetail.Add(detail);
                                    _context.PayDecisionDetails.Add(detail);
                                }

                            }

                            _context.SaveChanges();
                            msg.Title = "Thêm thành công";
                        }
                        else
                        {
                            var loop = _context.PayDecisionDetails.FirstOrDefault(x => !x.IsDeleted
                                    && x.DecisionNum.Equals(header.DecisionNum) && x.EmployeeCode.Equals(obj.UserinDepart));
                            if (loop == null)
                            {
                                var check = _context.PayScales.Any(x => !x.IsDeleted && x.CareerCode.Equals(obj.Career) && x.PayScaleCode.Equals(obj.PayScale));
                                if (!check)
                                {
                                    msg.Error = true;
                                    msg.Title = "Thang lương không khớp với nghề nghiệp";
                                    return msg;
                                }
                                var detail = new PayDecisionDetail
                                {
                                    DecisionNum = obj.DecisionNum,
                                    EmployeeCode = obj.UserinDepart,
                                    PayScale = obj.PayScale,
                                    PayRange = obj.PayRanges,
                                    Salary = Convert.ToDecimal(obj.Salary),
                                    CareerCode = obj.Career,
                                    CareerTitle = obj.ChucDanh,
                                    CreatedBy = ESEIM.AppContext.UserName,
                                    CreatedTime = DateTime.Now,
                                };

                                listDetail.Add(detail);
                                _context.PayDecisionDetails.Add(detail);
                                _context.SaveChanges();

                                msg.Title = "Thêm thành công";
                            }
                            else
                            {
                                msg.Error = true;

                                msg.Title = "Nhân viên đã được thêm";
                            }


                        }


                        if (listDetail.Count > 0)
                        {
                            var logData = new LogData
                            {
                                Header = JsonConvert.SerializeObject(header),
                                Details = JsonConvert.SerializeObject(listDetail)
                            };

                            /*header.ListLogData.Add(logData);*/

                            _context.PayDecisionHeaders.Update(header);
                            _context.SaveChanges();
                        }
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Không lấy được thông tin quyết định";
                    }
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Phòng ban không có nhân viên  !";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Thêm thất bại !";
            }
            return msg;
        }

        [HttpPost]
        public object DeleteDetail([FromBody] List<int> arr)
        {
            var msg = new JMessage { Title = "", Error = false };
            try
            {
                var data = _context.PayDecisionDetails.Where(x => !x.IsDeleted && arr.Any(p => p.Equals(x.Id)));
                if (data.Count() > 0)
                {
                    var header = _context.PayDecisionHeaders.FirstOrDefault(x => !x.IsDeleted && x.DecisionNum.Equals(data.FirstOrDefault().DecisionNum));
                    if (header != null)
                    {
                        var listDetail = new List<PayDecisionDetail>();
                        foreach (var item in data)
                        {
                            item.IsDeleted = true;
                            item.DeletedTime = DateTime.Now;
                            item.DeletedBy = ESEIM.AppContext.UserName;
                            _context.PayDecisionDetails.Update(item);

                            listDetail.Add(item);
                        }
                        _context.SaveChanges();

                        if (listDetail.Count > 0)
                        {
                            var logData = new LogData
                            {
                                Header = JsonConvert.SerializeObject(header),
                                Details = JsonConvert.SerializeObject(listDetail)
                            };

                            /* header.ListLogData.Add(logData);*/

                            _context.PayDecisionHeaders.Update(header);
                            _context.SaveChanges();
                        }

                        msg.Title = "Cập nhật thành công";
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Không lấy được thông tin quyết định";
                    }
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Bản ghi không tồn tại !";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Xóa thất bại !";
            }
            return Json(msg);
        }



        [HttpPost]
        public object UpdateDetailEmployee(string code)
        {
            var msg = new JMessage { Title = "", Error = false };
            try
            {
                var data = _context.PayDecisionHeaders.FirstOrDefault(x => !x.IsDeleted && x.DecisionNum.Equals(code));
                if (data != null)
                {
                    var detail = _context.PayDecisionDetails.Where(x => !x.IsDeleted && x.DecisionNum.Equals(data.DecisionNum));
                    if (detail != null)
                    {
                        foreach (var item in detail)
                        {
                            var user = _context.HREmployees.FirstOrDefault(x => x.flag == 1 && x.employee_code.Equals(item.EmployeeCode) && !x.status.Equals("END_CONTRACT"));
                            if (user != null)
                            {
                                var logPayScale = new JsonLog
                                {
                                    Code = item.PayScale,
                                    Name = "",
                                    CreatedBy = _context.Users.FirstOrDefault(x => x.UserName.Equals(ESEIM.AppContext.UserName)).GivenName,
                                    ObjectRelative = item.DecisionNum,
                                    ObjectType = EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.PayDecision),
                                    CreatedTime = DateTime.Now,
                                };
                                user.ListPayScale.Add(logPayScale);
                                var logPayRange = new JsonLog
                                {
                                    Name = "",
                                    Code = item.PayRange.ToString(),
                                    CreatedBy = _context.Users.FirstOrDefault(x => x.UserName.Equals(ESEIM.AppContext.UserName)).GivenName,
                                    ObjectRelative = item.DecisionNum,
                                    ObjectType = EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.PayDecision),
                                    CreatedTime = DateTime.Now,
                                };
                                user.ListPayRange.Add(logPayRange);

                                user.payScale = item.PayScale;
                                user.payRange = item.PayRange.ToString();
                                user.payCareer = item.CareerCode;
                                user.payTitle = item.CareerTitle;
                                user.salary = item.Salary;
                                _context.HREmployees.Update(user);
                            }
                        }
                        _context.SaveChanges();
                        msg.Title = "Cập nhật thành công !";

                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Chưa có nhân viên được chọn !";
                    }
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Bản ghi không tồn tại";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Cập nhật thất bại !";
            }
            return Json(msg);
        }
        #endregion

        #region Combobox
        [HttpPost]
        public object GetStatusDe()
        {
            var query = (from a in _context.PayDecisionHeaders
                         join b in _context.CommonSettings on a.Status equals b.CodeSet
                         where a.IsDeleted == false
                         select new { a, b });
            var data = query.Select(x => new
            {
                Code = x.a.Status,
                Name = x.b.ValueSet,

            }).DistinctBy(x => x.Code);
            return data;
        }


        [HttpGet]
        public object GetliSigner()
        {
            var data = _context.PayDecisionHeaders.Where(x => !x.IsDeleted && x.Status.Equals("FINAL_DONE")).Select(x => new
            {
                signer = x.ListStatus.Count > 0 && x.ListStatus.OrderByDescending(a => a.CreatedTime).FirstOrDefault().Code.Equals("FINAL_DONE") ? x.ListStatus.OrderByDescending(a => a.CreatedTime).FirstOrDefault().CreatedBy : ""
            }).Distinct();
            return data;
        }


        [HttpGet]
        public object GetlistDecision()
        {
            var data = _context.PayDecisionHeaders.Where(x => !x.IsDeleted).Select(x => new
            {
                Code = x.DecisionNum,
                Name = x.Title

            });
            return data;
        }

        [HttpPost]
        public JsonResult GetWorkFlow()
        {
            var data = _context.WorkFlows.Where(x => !x.IsDeleted.Value)
                .Select(x => new { Code = x.WfCode, Name = x.WfName });
            return Json(data);
        }
        [HttpGet]
        public object GetActionStatus(string code)
        {
            var data = _context.PayDecisionHeaders.Where(x => !x.IsDeleted && x.DecisionNum.Equals(code)).Select(x => new
            {
                x.Status
            });
            return data;
        }
        [HttpPost]
        public JsonResult GetStatusAct()
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.StatusActivity)))
                        .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
            return Json(data);
        }

        [HttpGet]
        public object GetListPayScale()
        {
            var data = _context.PayScales.Where(x => !x.IsDeleted).DistinctBy(x => x.PayScaleCode)
                        .Select(x => new { Code = x.PayScaleCode });
            return data;
        }
        [HttpGet]
        public object GetPaySalary(string career, string code, string ranges)
        {
            var data = "";
            if (_context.PayScaleDetails.Any(x => !x.IsDeleted && x.CareerCode.Equals(career) && x.ScaleCode.Equals(code) && x.Ranges.Equals(ranges)))
            {
                data = _context.PayScaleDetails.FirstOrDefault(x => !x.IsDeleted && x.CareerCode.Equals(career) && x.ScaleCode.Equals(code) && x.Ranges.Equals(ranges)).Salary.ToString();
            }
            return data;
        }
        [HttpGet]
        public object GetListCareer()
        {
            var data = _context.CategoryCareers.Where(x => !x.IsDeleted)
                        .Select(x => new { Code = x.CareerCode, Name = x.CareerName });
            return data;
        }
        [HttpGet]
        public object GetListActivityRepeat(string decisionNum)
        {
            var data = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.ObjectInst.Equals(decisionNum));
            var lstAct = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(data.WfInstCode) && x.Status.Equals("STATUS_ACTIVITY_APPROVED"))
                        .Select(x => new
                        {
                            IntsCode = x.ActivityInstCode,
                            Code = x.ActivityCode,
                            Name = x.Title
                        });
            return lstAct;
        }

        [HttpGet]
        public object GetUserDepartment(string code)
        {
            var data = _context.HREmployees.Where(x => x.flag == 1 && x.unit.Equals(code) && x.status != "END_CONTRACT").Select(x => new
            {
                Code = x.Id,
                CodeName = x.employee_code,
                Name = x.fullname,
                Job = x.payCareer,
                payTitle = x.payTitle,
                payScale = x.payScale,
                range = x.payRange,
            });
            return data;
        }
        [HttpGet]
        public object GetUserDetail(string code)
        {
            var data = _context.HREmployees.Where(x => x.flag == 1 && x.employee_code.Equals(code) && x.status != "END_CONTRACT").Select(x => new
            {
                Code = x.Id,
                CodeName = x.employee_code,
                Name = x.fullname,
                Career = x.payCareer,
                ChucDanh = x.payTitle,
                PayScale = x.payScale,
                PayRanges = x.payRange,
            });
            return data;
        }
        [HttpGet]
        public object GetListPayScaleDetail(string career, string code)
        {
            var data = _context.PayScaleDetails.Where(x => !x.IsDeleted && x.CareerCode.Equals(career) && x.ScaleCode.Equals(code))
                        .Select(x => new { Code = x.ScaleCode, Ranges = x.Ranges, Salary = x.Salary });
            return data;
        }

        #region Nghề nghiệp, Chức danh, Chuyên môn, Bằng cấp
        [HttpPost]
        public JsonResult GetListPayCareer()
        {
            var data = _context.CategoryCareers.Where(x => !x.IsDeleted)
                                              .Select(x => new { Code = x.CareerCode, Name = x.CareerName }).DistinctBy(x => x.Code);
            return Json(data);
        }

        [HttpPost]
        public JsonResult GetListPayTitle()
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.PayTitle))
                                              .Select(x => new { Code = x.CodeSet, Name = x.ValueSet }).DistinctBy(x => x.Code);
            return Json(data);
        }

        [HttpPost]
        public JsonResult GetListPayCertificate()
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.PayCertificate))
                                              .Select(x => new { Code = x.CodeSet, Name = x.ValueSet }).DistinctBy(x => x.Code);
            return Json(data);
        }

        [HttpPost]
        public JsonResult GetListPayMajor()
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.PayMajor))
                                              .Select(x => new { Code = x.CodeSet, Name = x.ValueSet }).DistinctBy(x => x.Code);
            return Json(data);
        }
        #endregion
        #endregion

        #region Export File
        [HttpGet]
        public ActionResult ExportReport(string code)
        {
            string sourcePath = string.Concat(_hostingEnvironment.WebRootPath, "/files/Template/TCLD/quyetdinhluong/download");
            try
            {
                var query = _context.PayDecisionHeaders.FirstOrDefault(x => !x.IsDeleted && x.DecisionNum.Equals(code));
                var data = from b in _context.PayDecisionDetails.Where(x => !x.IsDeleted && x.DecisionNum.Equals(code))
                           join c in _context.HREmployees.Where(x => x.flag == 1) on b.EmployeeCode equals c.employee_code
                           select new
                           {
                               Code = c.Id,
                               Name = c.fullname,
                               Department = _context.AdDepartments.FirstOrDefault(x => !x.IsDeleted && x.IsEnabled && x.DepartmentCode.Equals(c.unit)).Title,
                               CareerTitle = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.Group == EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.PayTitle) && x.CodeSet.Equals(b.CareerTitle)).ValueSet,
                               CareerCode = _context.CategoryCareers.FirstOrDefault(x => !x.IsDeleted && x.CareerCode.Equals(b.CareerCode)).CareerName,
                               b.Salary,
                               b.PayScale,
                           };
                string[] filePaths = Directory.GetFiles(sourcePath);
                foreach (string file in filePaths)
                {
                    System.IO.File.Delete(file);
                }
                string fileName = string.Concat(_hostingEnvironment.WebRootPath, "/files/Template/TCLD/quyetdinhluong/nhieunguoi/quyetdinhluong-template.docx");
                byte[] byteArray = System.IO.File.ReadAllBytes(fileName);
                using (MemoryStream stream = new MemoryStream())
                {

                    stream.Write(byteArray, 0, byteArray.Length);
                    using (var doc = WordprocessingDocument.Open(stream, true))
                    {
                        string savePath = "";
                        string docText = null;
                        using (StreamReader sr = new StreamReader(doc.MainDocumentPart.GetStream()))
                        {
                            docText = sr.ReadToEnd();
                        }

                        string Flocation = "/files/Template/TCLD/quyetdinhluong/download/quyet-dinh-luong";


                        Regex regexText = new Regex("%soquyetdinh%");
                        docText = regexText.Replace(docText, query.DecisionNum);

                        regexText = new Regex("%ngayquyetdinh%");
                        docText = regexText.Replace(docText, query.UpdatedTime.Value.ToString("dd/MM/yyyy"));
                        using (StreamWriter sw = new StreamWriter(doc.MainDocumentPart.GetStream(FileMode.Create)))
                        {
                            sw.Write(docText);
                        }
                        Table table = doc.MainDocumentPart.Document.Body.Elements<Table>().ElementAt(2);
                        int i = 1;
                        foreach (var ix in data)
                        {

                            TableRow tr = new TableRow();

                            TableCell tc1 = new TableCell();
                            tc1.Append(new Paragraph(new Run(new Text(i.ToString()))));
                            tr.Append(tc1);

                            TableCell tc2 = new TableCell();
                            tc2.Append(new Paragraph(new Run(new Text(ix.Name))));
                            tr.Append(tc2);

                            TableCell tc3 = new TableCell();
                            tc3.Append(new Paragraph(new Run(new Text(ix.Department))));
                            tr.Append(tc3);

                            TableCell tc4 = new TableCell();
                            tc4.Append(new Paragraph(new Run(new Text(ix.CareerCode))));
                            tr.Append(tc4);

                            TableCell tc5 = new TableCell();
                            tc5.Append(new Paragraph(new Run(new Text(ix.CareerTitle))));
                            tr.Append(tc5);

                            TableCell tc6 = new TableCell();
                            tc6.Append(new Paragraph(new Run(new Text(ix.PayScale))));
                            tr.Append(tc6);

                            TableCell tc7 = new TableCell();
                            tc7.Append(new Paragraph(new Run(new Text(ix.Salary.Value.ToString("N0")))));
                            tr.Append(tc7);
                            table.Append(tr);
                            doc.MainDocumentPart.Document.Save();
                            i++;
                        }
                        Flocation += ".docx";
                        savePath = string.Concat(_hostingEnvironment.WebRootPath, Flocation);
                        stream.Position = 0;
                        doc.Close();
                        System.IO.File.WriteAllBytes(savePath, stream.ToArray());
                    }
                }
                var memory = new MemoryStream();
                using (var stream = new FileStream(sourcePath + "/quyet-dinh-luong.docx", FileMode.Open))
                {
                    stream.CopyTo(memory);
                }
                memory.Position = 0;
                var ext = System.IO.Path.GetExtension(sourcePath).ToLowerInvariant();
                return File(memory, "application/vnd.ms-excel", System.IO.Path.GetFileName(sourcePath + "/quyet-dinh-luong.docx"));
            }
            catch (Exception e)
            {
                return null;
            }
        }
        #endregion

        #region Language
        [HttpGet]
        public IActionResult Translation(string lang)
        {
            var resourceObject = new JObject();
            var query = _stringLocalizer.GetAllStrings().Select(x => new { x.Name, x.Value })
                .Union(_workflowActivityController.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_stringLocalizerPayD.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_sharedResources.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .DistinctBy(x => x.Name);
            foreach (var item in query)
            {
                resourceObject.Add(item.Name, item.Value);
            }
            return Ok(resourceObject);
        }
        #endregion

        #region Upload File
        public class HrModel
        {
            public string PlanNumber { get; set; }
            public string EmployeeCode { get; set; }

            public string EmployeeName { get; set; }
            public string sBirthdate { get; set; }
            public int Gender { get; set; }
            public string DepartmentCode { get; set; }
            public string PhoneNumber { get; set; }
            public string IdentityCard { get; set; }
            public string ExpYears { get; set; }

        }
        public class ListHr
        {
            public List<MovementDetail> ListEmp { get; set; }
        }
        public JsonResult CheckData([FromBody] ListHr data)
        {
            var msg = new JMessage() { Error = false, Title = "", Object = "" };
            try
            {
                foreach (var temp in data.ListEmp)
                {
                    var rec = _context.HREmployees.FirstOrDefault(x => x.flag == 1 && x.employee_code.Equals(temp.EmployeeCode) && x.unit.Equals(temp.DepartmentCode));
                    var checkdetail = _context.DecisionMovementDetails.FirstOrDefault(x => !x.IsDeleted && x.EmployeesCode.Equals(temp.EmployeeCode));
                    if (rec != null && checkdetail == null)
                    {

                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Nhân viên mã" + temp.EmployeeCode + " Không tồn tại hoặc không có trong phòng ban !";
                        return Json(msg);
                    }
                }
                msg.Title = "Dữ liệu hợp lệ";


            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Lỗi thêm file" + ex.Message;
            }
            return Json(msg);
        }
        public JsonResult LogInfomation([FromBody] MovementDetail data)
        {
            var msg = new JMessage() { Error = false, Title = "", Object = "" };
            try
            {
                data.DepartmentName = _context.AdDepartments.FirstOrDefault(x => !x.IsDeleted && x.IsEnabled && x.DepartmentCode.Equals(data.DepartmentCode)).Title;
                var career = _context.CategoryCareers.FirstOrDefault(x => !x.IsDeleted && x.CareerCode.Equals(data.CareerCode));
                data.CareerName = career.CareerName;
                data.EmployeeName = _context.HREmployees.FirstOrDefault(x => x.flag == 1 && x.employee_code.Equals(data.EmployeeCode)).fullname;
                data.TitleName = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.Group.Equals("CAREER_TYPE") && x.CodeSet.Equals(career.CareerType)).ValueSet;

                msg.Object = data;
                msg.Title = "Cập nhật thành công";
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Lỗi thêm file" + ex.Message;
            }
            return Json(msg);
        }

        public JsonResult InsertFromExcel([FromBody] ListHr data)
        {
            var msg = new JMessage() { Error = false, Title = "", Object = "" };
            try
            {
                foreach (var tem in data.ListEmp)
                {
                    var rec = _context.HREmployees.FirstOrDefault(x => x.flag == 1 && x.employee_code.Equals(tem.EmployeeCode));
                    var checkdetail = _context.PayDecisionDetails.FirstOrDefault(x => !x.IsDeleted && x.EmployeeCode.Equals(tem.EmployeeCode) && x.DecisionNum.Equals(tem.DecisionNum));
                    if (rec != null && checkdetail == null)
                    {
                        var move = new ModelDetail()
                        {
                            DecisionNum = tem.DecisionNum,
                            UserinDepart = tem.EmployeeCode,
                            Unit = tem.DepartmentCode,
                            Career = tem.CareerCode,
                            ChucDanh = tem.CareerTitle,
                            PayScale = tem.PayScaleCode,
                            PayRanges = tem.PayRanges,
                            Salary = tem.Salary
                        };
                        msg = InsertDetail(move);
                        if (msg.Error)
                        {
                            return Json(msg);
                        }
                    }
                    else if (rec == null)
                    {
                        msg.Error = true;
                        msg.Title = "Mã nhân viên " + tem.EmployeeCode + " không tồn tại  !";
                        return Json(msg);
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Mã nhân viên " + tem.EmployeeCode + " đã ở trong quyết định  !";
                        return Json(msg);
                    }
                    msg.Title = "Thêm thành công";
                }

            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Lỗi thêm file" + ex.Message;
            }
            return Json(msg);
        }

        public class UltraData
        {
            public string DecisionNum { get; set; }
        }

        public class ValidateObject
        {
            public string EmployeeName { get; set; }
            public string EmployeeCode { get; set; }
            public string DepartmentCode { get; set; }
            public string CareerName { get; set; }
            public string TitleName { get; set; }
            public string PayScaleCode { get; set; }
            public string PayRanges { get; set; }
            public string Salary { get; set; }
        }
        public JsonResult UploadFile(IFormFile fileUpload)
        {
            var msg = new JMessage() { Error = false, Title = "" };
            try
            {
                List<MovementDetail> list = new List<MovementDetail>();
                if (fileUpload != null && fileUpload.Length > 0)
                {
                    ExcelEngine excelEngine = new ExcelEngine();
                    IApplication application = excelEngine.Excel;
                    IWorkbook workbook = application.Workbooks.Create();
                    workbook = application.Workbooks.Open(fileUpload.OpenReadStream());
                    if (!string.IsNullOrEmpty(ExcelController.docmodel.File_Path))
                    {
                        var pathTo = _hostingEnvironment.WebRootPath + ExcelController.docmodel.File_Path;
                        var fileStream = new FileStream(pathTo, FileMode.Open);
                        workbook = application.Workbooks.Open(fileStream);
                        fileStream.Close();
                    }
                    IWorksheet worksheet = workbook.Worksheets[0];
                    var user = _context.Users.FirstOrDefault(x => x.UserName.Equals(User.Identity.Name));
                    if (worksheet.Rows.Length > 1)
                    {
                        var title = worksheet.Rows[3].Cells;
                        if (
                            title[2].DisplayText.Trim() == "Số thẻ" &&
                            title[1].DisplayText.Trim() == "Họ và tên" &&
                            title[3].DisplayText.Trim() == "Đơn vị" &&
                            title[4].DisplayText.Trim() == "Loại nghề" &&
                            title[5].DisplayText.Trim() == "Chức danh" &&
                            title[6].DisplayText.Trim() == "Thang lương" &&
                            title[7].DisplayText.Trim() == "Bậc lương" &&
                            title[8].DisplayText.Trim() == "Mức lương"
                            )
                        {
                            var length = worksheet.Rows.Where(x => !string.IsNullOrEmpty(x.Cells[1].DisplayText)).Count();
                            var id = 0;

                            var decisionNumber = worksheet.GetValueRowCol(2, 6).ToString().Replace("\"", "").Trim();
                            var date = worksheet.GetValueRowCol(3, 4).ToString().Replace("\"", "").Trim();
                            if (date.Length == 1)
                                date = "0" + date;
                            var month = worksheet.GetValueRowCol(3, 6).ToString().Replace("\"", "").Trim();
                            if (month.Length == 1)
                                month = "0" + month;
                            var year = worksheet.GetValueRowCol(3, 8).ToString().Replace("\"", "").Trim();
                            if (string.IsNullOrEmpty(decisionNumber) || string.IsNullOrEmpty(date) || string.IsNullOrEmpty(month) || string.IsNullOrEmpty(year))
                            {
                                msg.Error = true;
                                msg.Title = "Vui lòng nhập đầy đủ số quyết định và ngày, tháng, năm  !";
                                return Json(msg);
                            }

                            var header = new
                            {
                                DecisionNumber = decisionNumber,
                                DecisionDate = string.Format("{0}/{1}/{2}", date, month, year)
                            };

                            for (int i = 5; i <= length + 3; i++)
                            {
                                id++;

                                var validateObj = new ValidateObject();
                                validateObj.EmployeeName = worksheet.GetValueRowCol(i, 2).ToString().Replace("\"", "").Trim();
                                validateObj.EmployeeCode = worksheet.GetValueRowCol(i, 3).ToString().Replace("\"", "").Trim();
                                validateObj.DepartmentCode = worksheet.GetValueRowCol(i, 4).ToString().Replace("\"", "").Trim();
                                validateObj.CareerName = worksheet.GetValueRowCol(i, 5).ToString().Replace("\"", "").Trim();
                                validateObj.TitleName = worksheet.GetValueRowCol(i, 6).ToString().Replace("\"", "").Trim();
                                validateObj.PayScaleCode = worksheet.GetValueRowCol(i, 7).ToString().Replace("\"", "").Trim();
                                validateObj.PayRanges = worksheet.GetValueRowCol(i, 8).ToString().Replace("\"", "").Replace("'", "").Trim();
                                validateObj.Salary = worksheet.GetValueRowCol(i, 9).ToString().Trim('.');
                                msg = ValidateData(validateObj);
                                if (msg.Error)
                                {
                                    return Json(msg);
                                }

                                MovementDetail obj = new MovementDetail();
                                obj.Id = id;
                                obj.DecisionNum = decisionNumber;
                                obj.DepartmentCode = _context.AdDepartments.FirstOrDefault(x => !x.IsDeleted && x.IsEnabled && (x.DepartmentCode.Equals(worksheet.GetValueRowCol(i, 4).ToString().Replace("\"", "").Trim()) || x.Title.Contains(worksheet.GetValueRowCol(i, 4).ToString().Replace("\"", "").Trim()))).DepartmentCode;
                                obj.DepartmentName = _context.AdDepartments.FirstOrDefault(x => !x.IsDeleted && x.IsEnabled && (x.DepartmentCode.Equals(worksheet.GetValueRowCol(i, 4).ToString().Replace("\"", "").Trim()) || x.Title.Contains(worksheet.GetValueRowCol(i, 4).ToString().Replace("\"", "").Trim()))).Title;
                                obj.EmployeeCode = worksheet.GetValueRowCol(i, 3).ToString().Replace("\"", "").Trim();
                                obj.EmployeeName = worksheet.GetValueRowCol(i, 2).ToString().Replace("\"", "").Trim();
                                obj.CareerCode = _context.CategoryCareers.FirstOrDefault(x => x.CareerName.ToLower().Equals(worksheet.GetValueRowCol(i, 5).ToString().Replace("\"", "").Trim().ToLower())).CareerCode;
                                obj.CareerName = worksheet.GetValueRowCol(i, 5).ToString().Replace("\"", "").Trim();
                                obj.CareerTitle = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.Group.Equals("PAY_TITLE") && x.ValueSet.Contains(worksheet.GetValueRowCol(i, 6).ToString().Replace("\"", "").Trim())).CodeSet;
                                obj.TitleName = worksheet.GetValueRowCol(i, 6).ToString().Replace("\"", "").Trim();
                                obj.PayScaleCode = worksheet.GetValueRowCol(i, 7).ToString().Replace("\"", "").Trim();
                                obj.PayRanges = validateObj.PayRanges;
                                obj.Salary = Convert.ToDecimal(worksheet.GetValueRowCol(i, 9).ToString().Trim('.'));
                                list.Add(obj);
                            }
                            msg.Object = new
                            {
                                Header = header,
                                Detail = list
                            };
                            msg.Title = "Đọc dữ liệu từ file Excel thành công! !";
                        }
                        else
                        {
                            msg.Error = true;
                            msg.Title = "File excel không phù hợp !";
                        }
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "File excel không có dữ liệu !";
                    }
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "File excel không có dữ liệu !";
                }
                return Json(msg);
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Lỗi thêm file" + ex.Message;
            }
            return Json(msg);
        }
        public JMessage ValidateData(ValidateObject validateObj)
        {
            var msg = new JMessage() { };
            var checkEmployeeCode = _context.HREmployees.Any(x => x.flag == 1 && x.employee_code.Equals(validateObj.EmployeeCode));
            var checkEmployeeName = true;
            if (checkEmployeeCode)
            {
                checkEmployeeName = (_context.HREmployees.FirstOrDefault(x => x.flag == 1 && x.employee_code.Equals(validateObj.EmployeeCode)).fullname.Equals(validateObj.EmployeeName));
            }
            var checkDepartmentCode = _context.AdDepartments.Any(x => !x.IsDeleted && x.IsEnabled && x.DepartmentCode.Equals(validateObj.DepartmentCode));
            var checkCareerName = _context.CategoryCareers.Any(x => !x.IsDeleted && x.CareerName.Contains(validateObj.CareerName));
            var careerCode = _context.CategoryCareers.FirstOrDefault(x => !x.IsDeleted && x.CareerName.Contains(validateObj.CareerName)).CareerCode;
            var checkTitleName = _context.CommonSettings.Any(x => !x.IsDeleted && x.Group.Equals("PAY_TITLE") && x.ValueSet.Contains(validateObj.TitleName));
            /*if (!checkCareerName)
            {
                var career = _context.CategoryCareers.FirstOrDefault(x => !x.IsDeleted && x.CareerName.ToLower().Equals(validateObj.CareerName.ToLower()));
                checkTitleName = !(_context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.Group.Equals("CAREER_TYPE") && x.CodeSet.Equals(career.CareerType)).ValueSet.ToLower().Equals(validateObj.TitleName.ToLower()));
            }*/
            var checkPayScaleCode = (_context.PayScales.Any(x => !x.IsDeleted && x.PayScaleCode.Equals(validateObj.PayScaleCode) && x.CareerCode.Equals(careerCode)));
            var checkPayRanges = false;
            var checkPaySalary = true;
            if (checkPayScaleCode)
            {
                var listPayScaleDetail = _context.PayScaleDetails.Where(x => !x.IsDeleted && x.ScaleCode.Equals(validateObj.PayScaleCode) && x.CareerCode.Equals(careerCode));
                checkPayRanges = listPayScaleDetail.Any(x => x.Ranges.Equals(validateObj.PayRanges));
                if (checkPayRanges)
                {
                    checkPaySalary = listPayScaleDetail.FirstOrDefault(x => x.Ranges.Equals(validateObj.PayRanges)).Salary.ToString().Equals(validateObj.Salary);
                }
            }

            if (!checkEmployeeCode)
            {
                msg.Title = "Mã nhân viên " + validateObj.EmployeeCode + " không tồn tại trong hệ thống";
                msg.Error = true;
                return msg;
            }
            if (!checkEmployeeName)
            {
                msg.Title = "Tên nhân viên " + validateObj.EmployeeName + " không khớp với mã nhân viên " + validateObj.EmployeeCode;
                msg.Error = true;
                return msg;
            }
            if (!checkDepartmentCode)
            {
                msg.Title = "Mã phòng ban " + validateObj.DepartmentCode + " không tồn tại trong hệ thống";
                msg.Error = true;
                return msg;
            }
            if (!checkCareerName)
            {
                msg.Title = "Nghề nghiệp " + validateObj.CareerName + " không tồn tại trong hệ thống";
                msg.Error = true;
                return msg;
            }
            if (!checkTitleName)
            {
                msg.Title = "Chức danh " + validateObj.TitleName + " không tồn tại trong hệ thống";
                msg.Error = true;
                return msg;
            }
            if (!checkPayScaleCode)
            {
                msg.Title = "Thang lương " + validateObj.PayScaleCode + " không khớp với nghề nghiệp " + validateObj.CareerName;
                msg.Error = true;
                return msg;
            }
            if (!checkPayRanges)
            {
                msg.Title = "Bậc lương \"" + validateObj.PayRanges + "\" không tồn tại trong thang lương " + validateObj.PayScaleCode;
                msg.Error = true;
                return msg;
            }
            decimal result;
            if (!Decimal.TryParse(validateObj.Salary, out result))
            {
                msg.Title = "Mức lương " + validateObj.Salary + " không hợp lệ";
                msg.Error = true;
                return msg;
            }
            if (!checkPaySalary)
            {
                msg.Title = "Mức lương " + validateObj.Salary + " không khớp với thang lương \"" + validateObj.PayRanges + "\" của bậc lương " + validateObj.PayScaleCode + " và nghề nghiệp " + validateObj.CareerName;
                msg.Error = true;
                return msg;
            }

            return msg;
        }
        #endregion

        #region Model
        public class JTableModelPayDecision : JTableModel
        {
            public string DecisionNum { get; set; }
            public string Title { get; set; }
            public string Noted { get; set; }
            public string Status { get; set; }
            public string FromDate { get; set; }
            public string ToDate { get; set; }
            public string CreatedTime { get; set; }
            public string Signer { get; set; }
        }
        public class JTableModelPayDecisionDetail : JTableModel
        {
            public string DecisionNum { get; set; }
            public string EmloyeeCode { get; set; }
            public string CarerrCode { get; set; }
            public string CarerrTitle { get; set; }
            public string PayScaleCode { get; set; }
            public string PayRanges { get; set; }
        }

        public class JsonCommand
        {
            public int Id { get; set; }
            public string CommandSymbol { get; set; }
            public string ConfirmedBy { get; set; }
            public string Confirmed { get; set; }
            public string ConfirmedTime { get; set; }
            public string Approved { get; set; }
            public string ApprovedBy { get; set; }
            public string ApprovedTime { get; set; }
            public string Message { get; set; }
            public string ActA { get; set; }
            public string ActB { get; set; }
            public bool IsLeader { get; set; }
        }
        public class ModelPayDecisionHeader
        {
            public string DecisionNum { get; set; }
            public string Title { get; set; }
            public string Noted { get; set; }
            public string Status { get; set; }
            public string WorkflowCat { get; set; }
            public string ActRepeat { get; set; }
        }

        public class ModelDetail
        {
            public string DecisionNum { get; set; }
            public string Unit { get; set; }
            public string UserinDepart { get; set; }
            public string Career { get; set; }
            public string ChucDanh { get; set; }
            public string PayScale { get; set; }
            public string PayRanges { get; set; }
            public decimal Salary { get; set; }
        }

        public class ComboxModel
        {
            public string IntsCode { get; set; }
            public string Code { get; set; }
            public string Name { get; set; }
            public string Status { get; set; }
            public string UpdateTime { get; set; }
            public string UpdateBy { get; set; }
        }

        public class JsonLogPayScale
        {
            public JsonLogPayScale()
            {
                CreatedTime = DateTime.Now;
            }

            public int? No { get; set; }
            public string PayScaleCode { get; set; }
            public string ObjectRelative { get; set; }
            public string ObjectType { get; set; }
            public string CreatedBy { get; set; }
            public DateTime CreatedTime { get; set; }
        }

        public class MovementDetail
        {
            public int Id { get; set; }
            public string DecisionNum { get; set; }
            public string DepartmentCode { get; set; }
            public string DepartmentName { get; set; }
            public string EmployeeCode { get; set; }
            public string EmployeeName { get; set; }
            public string CareerCode { get; set; }
            public string CareerName { get; set; }
            public string CareerTitle { get; set; }
            public string TitleName { get; set; }
            public string PayScaleCode { get; set; }
            public string PayRanges { get; set; }
            public decimal Salary { get; set; }
        }
        #endregion
    }
}