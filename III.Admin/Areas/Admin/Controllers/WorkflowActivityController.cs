using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;
using Aspose.Pdf;
using DocumentFormat.OpenXml.Spreadsheet;
using ESEIM.Models;
using ESEIM.Utils;
using FTU.Utils.HelperNet;
using III.Admin.Utils;
using III.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OpenXmlPowerTools;
using Remotion.Linq.Parsing.ExpressionVisitors.Transformation.PredefinedTransformations;
using SmartBreadcrumbs.Attributes;
using Syncfusion.DocIO.DLS;
using Syncfusion.Presentation;
using static III.Admin.Controllers.RMCommandOrderTruckController;
using ActGrid = ESEIM.Utils.ActGrid;

namespace III.Admin.Controllers
{
    [Area("Admin")]
    public class WorkflowActivityController : BaseController
    {
        private readonly EIMDBContext _context;
        private readonly IUploadService _upload;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IStringLocalizer<WorkflowActivityController> _stringLocalizer;
        private readonly IStringLocalizer<SharedResources> _sharedResources;
        private readonly IStringLocalizer<CustomerController> _stringLocalizerCus;
        private readonly IStringLocalizer<CardJobController> _stringLocalizerCard;
        private readonly IStringLocalizer<EDMSRepositoryController> _stringLocalizerEdms;
        private readonly IStringLocalizer<HrEmployeeController> _stringLocalizerHr;
        private readonly IStringLocalizer<ProjectController> _projectController;
        private readonly IFCMPushNotification _notification;
        private static AsyncLocker<string> objLock = new AsyncLocker<string>();
        private readonly IRepositoryService _repositoryService;
        private readonly IWorkflowService _workflowService;
        public readonly string module_name = "WORKFLOW";
        public string path_upload_file = "";
        public string repos_code = "";
        public string cat_code = "";
        public int host_type = 1;
        public WorkflowActivityController(EIMDBContext context, IUploadService upload, IHostingEnvironment hostingEnvironment,
            IStringLocalizer<WorkflowActivityController> stringLocalizer, IStringLocalizer<SharedResources> sharedResources,
            IStringLocalizer<CustomerController> stringLocalizerCus, IStringLocalizer<CardJobController> stringLocalizerCard,
            IFCMPushNotification notification, IStringLocalizer<EDMSRepositoryController> stringLocalizerEdms,
            IStringLocalizer<HrEmployeeController> stringLocalizerHr, IRepositoryService repositoryService,
            IWorkflowService workflowService,
            IStringLocalizer<ProjectController> projectController)
        {
            _context = context;
            _upload = upload;
            _hostingEnvironment = hostingEnvironment;
            _stringLocalizer = stringLocalizer;
            _sharedResources = sharedResources;
            _stringLocalizerCus = stringLocalizerCus;
            _stringLocalizerCard = stringLocalizerCard;
            _notification = notification;
            _stringLocalizerEdms = stringLocalizerEdms;
            _stringLocalizerHr = stringLocalizerHr;
            _repositoryService = repositoryService;
            _projectController = projectController;
            _workflowService = workflowService;
            var obj = (EDMSCatRepoSetting)_upload.GetPathByModule(module_name).Object;
            repos_code = obj.ReposCode;
            cat_code = obj.CatCode;
            if (obj.Path == "")
            {
                host_type = 1;
                path_upload_file = obj.FolderId;
            }
            else
            {
                host_type = 0;
                path_upload_file = obj.Path;
            }

        }
        [Breadcrumb("ViewData.CrumbWfActivity", AreaName = "Admin", FromAction = "Index", FromController = typeof(CardWorkHomeController))]
        public IActionResult Index()
        {
            ViewData["CrumbDashBoard"] = _sharedResources["COM_CRUMB_DASH_BOARD"];
            ViewData["CrumbMenuCenter"] = _sharedResources["COM_CRUMB_MENU_CENTER"];
            ViewData["CrumbCardWorkHome"] = _sharedResources["COM_CRUMB_CARD_WORK_HOME"];
            ViewData["CrumbWfActivity"] = _sharedResources["COM_CRUMB_WF_ACTIVITY"];
            return View();
        }

        public object Import(string ressumeNumber)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                msg = GenergatePesonnal(ressumeNumber);
                if (!msg.Error)
                {
                    var filePath = msg.Object.ToString();
                }
            }
            catch (Exception ex)
            {

            }

            return msg;
        }


        [NonAction]
        private JMessage GenergatePesonnal(string ressumeNumber)
        {
            var msg = new JMessage { Title = _sharedResources["COM_MSG_SUCCES_SAVE"], Error = false };

            string path = "/files/Template/templateKNĐ.docx";
            string rootPath = _hostingEnvironment.WebRootPath;
            var filePath = string.Concat(rootPath, path);
            var fileStream = new FileStream(filePath, FileMode.Open);
            PartyAdmissionProfile Pap = _context.PartyAdmissionProfiles.FirstOrDefault(y => y.ResumeNumber == ressumeNumber && y.IsDeleted == false);
            if (Pap == null)
            {
                fileStream.Dispose();
                msg.Error = true;
                msg.Title = _stringLocalizer["WFAI_MSG_USER_NO_SIGNATURE"];
                return msg;
            }
            IntroducerOfParty Iop = _context.IntroducerOfParties.FirstOrDefault(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false);

            var Wt = _context.WorkingTrackings.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false).ToList();
            var Ph = _context.PersonalHistories.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false).ToList();
            var Hs = _context.HistorySpecialists.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false).ToList();
            var Tcp = _context.TrainingCertificatedPasses.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false).ToList();
            var GA = _context.GoAboards.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false).ToList();
            var Aw = _context.Awards.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false).ToList();
            var Wd = _context.WarningDisciplineds.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false).ToList();
            var F = _context.Families.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false).ToList();

            try
            {
                WordDocument document = new WordDocument(fileStream, Syncfusion.DocIO.FormatType.Docx);
                IWSection section = document.Sections[0];

                WTable table = section.Tables[0] as WTable;
                BindingFileKNĐ.BinddingPesonal(table, Pap, Iop);

                table = section.Tables[1] as WTable;
                BindingFileKNĐ.BinđingPersonalHistory(table,Ph);


                table = section.Tables[2] as WTable;
                BindingFileKNĐ.BinddingWorkingTracking(table, Wt);

                table = section.Tables[3] as WTable;
                BindingFileKNĐ.BinddingHistorySpecialist(table, Hs);

                table = section.Tables[4] as WTable;
                BindingFileKNĐ.BinddingTrainingCertificatedPass(table, Tcp);

                table = section.Tables[5] as WTable;
                BindingFileKNĐ.BinddingGoAboard(table, GA);

                table = section.Tables[6] as WTable;
                BindingFileKNĐ.BinddingAward(table, Aw);

                table = section.Tables[7] as WTable;
                BindingFileKNĐ.BinddingWarningDisciplined(table, Wd);

                table = section.Tables[8] as WTable;
                BindingFileKNĐ.BinddingFamily(table, F);

                table = section.Tables[9] as WTable;
                WTableCell cell = table[0, 0] as WTableCell;
                IWParagraph p = cell.AddParagraph();
                p.AppendText(Pap.SelfComment);


                #region Saving document
                MemoryStream memoryStream = new MemoryStream();
                //Save the document into memory stream
                document.Save(memoryStream, Syncfusion.DocIO.FormatType.Docx);
                //Closes the Word document instance
                document.Close();

                //Lưu 1 file sinh chữ ký
                var pathVersion = "/uploads/files/fileVersion/";
                var pathFileVersion = string.Concat(rootPath, pathVersion);
                if (!Directory.Exists(pathFileVersion)) Directory.CreateDirectory(pathFileVersion);
                var fileName = "FILE_VERSION_"
                          + Guid.NewGuid().ToString().Substring(0, 8)
                          + Path.GetExtension(path);
                var fileVersionPath = string.Concat(pathFileVersion, fileName);
                FileStream fileVersion = new FileStream(fileVersionPath, FileMode.Create, FileAccess.Write);
                memoryStream.WriteTo(fileVersion);
                fileVersion.Close();

                //FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.Write);
                //memoryStream.WriteTo(file);
                //file.Close();

                //signBytes.Close();
                memoryStream.Position = 0;

                msg.Object = string.Concat(pathVersion, fileName);
                msg.Title = fileVersionPath;

                #endregion
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _stringLocalizer["WFAI_MSG_SIGN_FAILED"];
                msg.Object = path;
                //signBytes.Close();
            }

            fileStream.Dispose();
            return msg;
        }
        #region Combo box
        [HttpGet]
        public JsonResult GetWfGroup()
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals("WF_GROUP"))
                .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
            return Json(data);
        }
        [HttpGet]
        public JsonResult GetWfType()
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals("WF_TYPE"))
                .Select(x => new { Code = x.CodeSet, Name = x.ValueSet }); ;
            return Json(data);
        }

        [HttpGet]
        public JsonResult GetWorkflow()
        {
            var data = (from a in _context.WorkFlows.Where(x => !x.IsDeleted.Value)
                        join b in _context.WorkflowInstances.Where(x => !x.IsDeleted.Value) on a.WfCode equals b.WorkflowCode
                        select new
                        {
                            Code = b.WfInstCode,
                            Name = a.WfName
                        });
            return Json(data);
        }

        [HttpGet]
        public JsonResult GetAttrOfAct(string actCode)
        {
            var activity = _context.Activitys.FirstOrDefault(x => !x.IsDeleted && x.ActivityCode.Equals(actCode));
            if (activity != null && !string.IsNullOrEmpty(activity.ListGroupData))
            {
                var listGroupData = activity.ListGroupData.Split(',');

                var data = _context.AttrSetups.Where(x => !x.IsDeleted && listGroupData.Any(p => p.Equals(x.AttrGroup)))
                .Select(x => new { Code = x.AttrCode, Name = x.AttrName });
                return Json(data);
            }
            else
            {
                return Json(new { });
            }
        }

        [HttpGet]
        public JsonResult GetUnitName(string Code)
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.CodeSet.Equals(Code))
               .Select(x => new { Name = x.ValueSet });
            return Json(data);
        }

        [HttpPost]
        public JsonResult GetUnitAttr()
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == "ATTR_UNIT")
                .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
            return Json(data);
        }

        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetStatusWF()
        {
            var common = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals("STATUS_WF"))
                         .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
            return Json(common);
        }

        [HttpGet]
        public JsonResult GetStatusByGroupSetting(string actCode)
        {
            var data = (from a in _context.ActivityInstances.Where(x => !x.IsDeleted)
                        join b in _context.Activitys.Where(x => !x.IsDeleted) on a.ActivityCode equals b.ActivityCode
                        where a.ActivityInstCode.Equals(actCode)
                        select a).FirstOrDefault();

            var listStatus = data.Type == "TYPE_ACTIVITY_INITIAL" ?
                _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == "STATUS_ACTIVITY_INITIAL").Select(x => new
                {
                    Code = x.CodeSet,
                    Name = x.ValueSet
                })
                : _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == "STATUS_ACTIVITY").Select(x => new
                {
                    Code = x.CodeSet,
                    Name = x.ValueSet
                });
            //if (data != null)
            //{
            //    if (!string.IsNullOrEmpty(data.StatusCode))
            //        listStatus = JsonConvert.DeserializeObject<List<ModelStatus>>(data.StatusCode);
            //}
            return Json(listStatus);
        }
        public class ModelStatus
        {
            public string Code { get; set; }
            public string Name { get; set; }
            public bool IsCheck { get; set; }
            public int Priority { get; set; }
        }
        #endregion

        #region Create, update, delete Work flow
        [HttpPost]
        public JsonResult InsertWorkFlow([FromBody] WorkFlow obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var check = _context.WorkFlows.FirstOrDefault(x => !x.IsDeleted.Value && x.WfCode.Equals(obj.WfCode));
                if (check == null)
                {
                    var wf = new WorkFlow
                    {
                        WfCode = obj.WfCode,
                        WfName = obj.WfName,
                        WfGroup = obj.WfGroup,
                        WfType = obj.WfType,
                        WfNote = obj.WfNote,
                        ObjectType = obj.ObjectType,
                        CreatedBy = ESEIM.AppContext.UserName,
                        CreatedTime = DateTime.Now,
                        IsDeleted = false,
                        IsPublic = false
                    };
                    _context.WorkFlows.Add(wf);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_ADD_SUCCESS"];
                }
                else
                {
                    msg.Title = _stringLocalizer["WFAI_MSG_WF_CODE_EXIST"];
                    msg.Error = true;
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult GetItemWf(string wfCode)
        {
            var data = _context.WorkFlows.FirstOrDefault(x => !x.IsDeleted.Value && x.WfCode.Equals(wfCode));
            return Json(data);
        }

        [HttpPost]
        public JsonResult UpdateWf([FromBody] WorkFlow obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.WorkFlows.FirstOrDefault(x => !x.IsDeleted.Value && x.WfCode.Equals(obj.WfCode));
                if (data != null)
                {
                    data.WfName = obj.WfName;
                    data.WfGroup = obj.WfGroup;
                    data.WfType = obj.WfType;
                    data.WfNote = obj.WfNote;
                    data.ObjectType = obj.ObjectType;
                    data.UpdatedBy = ESEIM.AppContext.UserName;
                    data.UpdatedTime = DateTime.Now;
                    _context.WorkFlows.Update(data);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_UPDATE_SUCCESS"];
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["WFAI_MSG_RECORD_NO_EXIST"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult DeleteWf(string wfCode)
        {
            var msg = new JMessage { Error = false, Title = "" };
            var data = _context.WorkFlows.FirstOrDefault(x => !x.IsDeleted.Value && x.WfCode.Equals(wfCode));
            if (data != null)
            {
                data.IsDeleted = true;
                data.DeletedBy = ESEIM.AppContext.UserName;
                data.DeletedTime = DateTime.Now;
                _context.WorkFlows.Update(data);
                _context.SaveChanges();
                msg.Title = _sharedResources["COM_DELETE_SUCCESS"];
            }
            else
            {
                msg.Error = true;
                msg.Title = _stringLocalizer["WFAI_MSG_RECORD_NO_EXIST"];
            }
            return Json(msg);
        }

        [HttpGet]
        public JsonResult GetWflow()
        {
            var data = (from a in _context.WorkFlows.Where(x => !x.IsDeleted.Value)
                        select new
                        {
                            Code = a.WfCode,
                            Name = a.WfName,
                            Time = a.CreatedTime
                        }).OrderByDescending(x => x.Time);
            return Json(data);
        }

        [HttpPost]
        public JsonResult InsertActivity([FromBody] Activity obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var check = _context.Activitys.FirstOrDefault(x => !x.IsDeleted && x.ActivityCode.Equals(obj.ActivityCode));
                if (check == null)
                {
                    var activity = new Activity
                    {
                        ActivityCode = obj.ActivityCode,
                        Title = obj.Title,
                        WorkflowCode = obj.WorkflowCode,
                        Duration = obj.Duration,
                        Unit = obj.Unit,
                        Group = obj.Group,
                        Type = obj.Type,
                        Status = obj.Status,
                        ShapeJson = obj.ShapeJson,
                        Located = obj.Located,
                        Desc = obj.Desc,
                        CreatedBy = ESEIM.AppContext.UserName,
                        CreatedTime = DateTime.Now
                    };
                    _context.Activitys.Add(activity);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_ADD_SUCCESS"];
                }
                else
                {
                    msg.Title = _stringLocalizer["WFAI_MSG_ACT_EXISTED"];
                    msg.Error = true;
                }
            }
            catch (Exception ex)
            {
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Error = true;
            }
            return Json(msg);
        }

        #endregion

        #region Workflow setting

        [HttpPost]
        public JsonResult SettingWF([FromBody] WorkflowSetting obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var check = _context.WorkflowSettings.FirstOrDefault(x => !x.IsDeleted && x.ActivityInitial.Equals(obj.ActivityInitial) && x.ActivityDestination.Equals(obj.ActivityDestination));
                var jsonCommand = new JsonCommand
                {
                    Approved = "",
                    ApprovedBy = "",
                    ApprovedTime = "",
                    CommandSymbol = obj.Command,
                    ConfirmedBy = "",
                    ConfirmedTime = "",
                    Id = 0,
                    Message = "",
                    ActA = obj.ActivityInitial,
                    ActB = obj.ActivityDestination,
                    IsLeader = false
                };
                var listCommand = new List<JsonCommand>();
                listCommand.Add(jsonCommand);
                if (check == null)
                {
                    var setting = new WorkflowSetting
                    {
                        WorkflowCode = obj.WorkflowCode,
                        TransitionCode = obj.TransitionCode,
                        ActivityInitial = obj.ActivityInitial,
                        ActivityDestination = obj.ActivityDestination,
                        Command = JsonConvert.SerializeObject(listCommand),
                        CreatedBy = ESEIM.AppContext.UserName,
                        CreatedTime = DateTime.Now
                    };
                    _context.WorkflowSettings.Add(setting);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_ADD_SUCCESS"];
                }
                else
                {
                    check.Command = JsonConvert.SerializeObject(listCommand);
                    check.UpdatedBy = ESEIM.AppContext.UserName;
                    check.UpdatedTime = DateTime.Now;
                    _context.WorkflowSettings.Update(check);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_UPDATE_SUCCESS"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult DeleteSettingWF(string transitionCode)
        {
            var msg = new JMessage();
            var data = _context.WorkflowSettings.FirstOrDefault(x => x.TransitionCode.Equals(transitionCode) && !x.IsDeleted);
            if (data != null)
            {
                data.IsDeleted = true;
                data.DeletedBy = ESEIM.AppContext.UserName;
                data.DeletedTime = DateTime.Now;
                _context.WorkflowSettings.Update(data);
                _context.SaveChanges();
                msg.Title = _sharedResources["COM_DELETE_SUCCESS"];
            }
            else
            {
                msg.Title = _stringLocalizer["WFAI_MSG_RECORD_NO_EXIST"];
                msg.Error = true;
            }
            return Json(msg);
        }

        #endregion

        #region Workflow Instance
        [HttpPost]
        public JsonResult JTable([FromBody] JtableWfInstance jTablePara)
        {
            var session = HttpContext.GetSessionUser();
            var fromDate = !string.IsNullOrEmpty(jTablePara.FromDate) ? DateTime.ParseExact(jTablePara.FromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
            var toDate = !string.IsNullOrEmpty(jTablePara.ToDate) ? DateTime.ParseExact(jTablePara.ToDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
            var fromDatePara = fromDate.HasValue ? fromDate.Value.ToString("yyyy-MM-dd") : "";
            var toDatePara = toDate.HasValue ? toDate.Value.ToString("yyyy-MM-dd") : "";

            string[] param = new string[] { "@PageNo", "@PageSize", "@IsAllData", "@UserName", "@UserId", "@Status",
                    "@Workflow", "@FromDate", "@ToDate", "@WfInstName", "@WfGroup"};
            object[] val = new object[] { jTablePara.CurrentPage, jTablePara.Length, session.IsAllData, session.UserName,
                        session.UserId, !string.IsNullOrEmpty(jTablePara.Status) ? jTablePara.Status : "",
                        !string.IsNullOrEmpty(jTablePara.Workflow) ? jTablePara.Workflow : "", fromDatePara, toDatePara,
                        !string.IsNullOrEmpty(jTablePara.WfInstName) ? jTablePara.WfInstName : "", !string.IsNullOrEmpty(jTablePara.WfGroup) ? jTablePara.WfGroup : ""};
            // the code that you want to measure comes here
            DataTable rs = _repositoryService.GetDataTableProcedureSql("P_GET_ALL_WF", param, val);
            var query = CommonUtil.ConvertDataTable<GridWfInst>(rs);

            var commonActStatus = _context.CommonSettings.Where(x => !x.IsDeleted && !String.IsNullOrEmpty(x.Group) && x.Group.Contains("STATUS_ACTIVITY")).ToList();
            var commonActType = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == "TYPE_ACTIVITY").ToList();
            var commonJcStatus = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == "STATUS").ToList();
            var commonConfirmCmd = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == "CONFIRM_COMMAND").ToList();
            var jcs = _context.JcObjectTypes.Where(x => !x.IsDeleted);

            //var running = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted);
            //var instActs = _context.ActivityInstances.Where(x => !x.IsDeleted);
            //var messActs = _context.MessageActivitys;

            long elapsedJsonToObjectLoop = 0;
            //long elapsedPermissionLoop = 0;
            long elapsedObjectToJsonLoop = 0;
            //long elapsedCardLoop = 0;
            long elapsedFileLoop = 0;
            try
            {
                if (query.Count > 0)
                {
                    var workflowCodeSequence = string.Join(";", query.Select(x => x.WfCode));
                    string[] paramAct = new string[] { "@WorkflowCodeSequence" };
                    object[] valAct = new object[] { workflowCodeSequence };
                    rs = _repositoryService.GetDataTableProcedureSql("P_GET_ASSIGNEE_WORKFLOW", paramAct, valAct);
                    var assigns = CommonUtil.ConvertDataTable<ExcuterControlRoleInst>(rs);
                    rs = _repositoryService.GetDataTableProcedureSql("P_GET_COMMAND_WORKFLOW", paramAct, valAct);
                    var commandFromExtra = CommonUtil.ConvertDataTable<CommandExtra>(rs);
                    rs = _repositoryService.GetDataTableProcedureSql("P_GET_ACT_FROM_WORKFLOW", paramAct, valAct);
                    var actFrom = CommonUtil.ConvertDataTable<CommandFrom>(rs);
                    rs = _repositoryService.GetDataTableProcedureSql("P_GET_FILE_WORKFLOW", paramAct, valAct);
                    var files = CommonUtil.ConvertDataTable<FileGrid>(rs);
                    string[] paramActs = new string[] { "@WorkflowCodeSequence", "@UserId" };
                    object[] valActs = new object[] { workflowCodeSequence, session.UserId };
                    rs = _repositoryService.GetDataTableProcedureSql("P_GET_ACT_WORKFLOW", paramActs, valActs);
                    var actGrids = CommonUtil.ConvertDataTable<ActGrid>(rs);
                    rs = _repositoryService.GetDataTableProcedureSql("P_GET_NOTI_WORKFLOW", param, val);
                    var managers = CommonUtil.ConvertDataTable<NotificationManager>(rs);
                    foreach (var item in query)
                    {
                        item.ListActGrids = actGrids.Where(x => x.WorkflowInstCode == item.WfCode).OrderBy(x => x.Level).ToList();
                        if (actGrids != null && actGrids.Count > 0)
                        {
                            var watchJsonMakeLoop = System.Diagnostics.Stopwatch.StartNew();
                            var actInitial = item.ListActGrids.FirstOrDefault(x => x.ActType.Equals(EnumHelper<TypeActivity>.GetDisplayValue(TypeActivity.Initial)));

                            watchJsonMakeLoop.Stop();
                            elapsedJsonToObjectLoop += watchJsonMakeLoop.ElapsedMilliseconds;

                            var watchObjectToJsonLoop = System.Diagnostics.Stopwatch.StartNew();
                            var listActInfo = new List<ActInstInfo>();
                            item.ListAct = JsonConvert.SerializeObject(/*ArrangeAct(lstAct, 1, actInitial, listActInfo)*/item.ListActGrids.SetLockAndStatus(commonActStatus, commonActType, commandFromExtra,
                                actFrom, assigns));
                            watchObjectToJsonLoop.Stop();
                            elapsedObjectToJsonLoop += watchObjectToJsonLoop.ElapsedMilliseconds;
                        }
                        else
                        {
                            item.ListAct = JsonConvert.SerializeObject(new List<ActGrid>());
                        }
                        //var watchCardLoop = System.Diagnostics.Stopwatch.StartNew();
                        var lstCard = new List<CardGrid>();
                        if (!string.IsNullOrEmpty(item.ListCard))
                        {
                            lstCard = JsonConvert.DeserializeObject<List<CardGrid>>(item.ListCard);
                            foreach (var card in lstCard)
                            {
                                card.Status = commonJcStatus.FirstOrDefault(x => x.CodeSet.Equals(card.Status)).ValueSet ?? "";
                            }
                        }
                        item.ListCard = JsonConvert.SerializeObject(lstCard);
                        //watchCardLoop.Stop();
                        //elapsedCardLoop += watchCardLoop.ElapsedMilliseconds;

                        var watchFileLoop = System.Diagnostics.Stopwatch.StartNew();
                        item.ListFile = files.Any() ? JsonConvert.SerializeObject(files
                            .Where(x => item.ListActGrids.Any(y => y.ActivityInstCode == x.ActivityInstCode)).DistinctBy(x => x.FileCode)) : "";
                        item.IsRead = GetIsReadNotification(item.WfCode, managers);
                        if (!string.IsNullOrEmpty(item.ObjectType))
                        {
                            var jc = jcs.FirstOrDefault(x => x.ObjTypeCode.Equals(item.ObjectType));
                            item.ObjectTypeName = jc != null ? jc.ObjTypeName : "";
                        }
                        //if (!string.IsNullOrEmpty(item.ObjectCode) && !string.IsNullOrEmpty(item.ObjectType))
                        //{
                        //    item.ObjectName = GetObjectRelative(item.ObjectCode, item.ObjectType);
                        //}
                        watchFileLoop.Stop();
                        elapsedFileLoop += watchFileLoop.ElapsedMilliseconds;
                    }
                }
            }
            catch (Exception ex)
            {
                int count = 0;
                var jdata = JTableHelper.JObjectTable(query, jTablePara.Draw, count, "Id", "WfCode", "WfName",
                    "CreatedTime", "Status", "ObjectCode", "ObjectName", "ListAct", "ListCard", "ListFile",
                    "IsRead", "ObjectTypeName", "ObjectType");
                return Json(jdata);
            }
            if (query.Count > 0)
            {
                int count = int.Parse(query.FirstOrDefault().TotalRow);
                //int count = _context.WorkflowInstances.Count(x => x.IsDeleted != true);
                var jdata = JTableHelper.JObjectTable(query, jTablePara.Draw, count, "Id", "WfCode", "WfName",
                    "CreatedTime", "Status", "ObjectCode", "ObjectName", "ListAct", "ListCard", "ListFile",
                    "IsRead", "ObjectTypeName", "ObjectType");
                return Json(jdata);
            }
            else
            {
                int count = 0;
                var jdata = JTableHelper.JObjectTable(query, jTablePara.Draw, count, "Id", "WfCode", "WfName",
                    "CreatedTime", "Status", "ObjectCode", "ObjectName", "ListAct", "ListCard", "ListFile",
                    "IsRead", "ObjectTypeName", "ObjectType");
                return Json(jdata);
            }
        }

        [NonAction]
        private List<ActGrid> ArrangeAct(List<ActGrid> listInst, int level,
            ActGrid instInitial, List<ActInstInfo> listActInfo)
        {
            try
            {
                if (instInitial != null)
                {
                    instInitial.Level = level;
                    var runnings = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityInitial.Equals(instInitial.ActivityInstCode));
                    foreach (var item in runnings)
                    {
                        var actRunning = listInst.FirstOrDefault(x => x.ActivityInstCode.Equals(item.ActivityDestination));
                        if (actRunning != null)
                        {
                            if (!listActInfo.Any(x => x.ActInstCode.Equals(actRunning.ActivityInstCode)))
                            {
                                actRunning.Level = instInitial.Level + 1;

                                var info = new ActInstInfo
                                {
                                    ActInstCode = actRunning.ActivityInstCode
                                };

                                listActInfo.Add(info);
                                listInst = ArrangeAct(listInst, actRunning.Level, actRunning, listActInfo);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {

            }

            return listInst.OrderBy(x => x.Level).ToList();
        }

        [HttpGet]
        public object StatiscalWf()
        {
            var data = from a in _context.WorkflowInstances.Where(x => !x.IsDeleted.Value)
                       join b in _context.WorkFlows.Where(x => !x.IsDeleted.Value) on a.WorkflowCode equals b.WfCode
                       select new
                       {
                           a.WfInstCode,
                           a.Status,
                           a.UserManager,
                           a.CreatedBy,
                           a.UserList,
                           a.WfGroup
                       };
            var session = HttpContext.GetSessionUser();
            if (session.IsAllData)
            {
                return new
                {
                    SumWf = data.Count(),
                    PendingWf = data.Where(x => x.Status == "STATUS_WF_PENDING").Count(),
                    SuccedWf = data.Where(x => x.Status == "STATUS_WF_SUCCESS").Count()
                };
            }
            else
            {
                var sumWf = 0;
                var pendingWf = 0;
                var succedWf = 0;
                foreach (var wf in data)
                {
                    var userManager = !string.IsNullOrEmpty(wf.UserManager) ? JsonConvert.DeserializeObject<List<UserManagerWF>>(wf.UserManager) : new List<UserManagerWF>();
                    var userList = !string.IsNullOrEmpty(wf.UserList) ? JsonConvert.DeserializeObject<List<string>>(wf.UserList) : new List<string>();
                    if (userList.Any(x => x == session.UserId) || wf.CreatedBy.Equals(session.UserName) || userManager.Any(x => x.UserId == session.UserId))
                    {
                        sumWf = sumWf + 1;

                        if (wf.Status.Equals("STATUS_WF_PENDING"))
                        {
                            pendingWf = pendingWf + 1;
                        }
                        else
                        {
                            succedWf = succedWf + 1;
                        }
                    }

                    //if (assigns.Any() || item.CreatedBy.Equals(user.UserName) ||
                    //    userManager.Any(x => x.UserId == userId))
                    //{
                    //    sumWf = sumWf + 1;
                    //    if (item.Status == "STATUS_WF_PENDING")
                    //    {
                    //        pendingWf = pendingWf + 1;
                    //    }
                    //    else
                    //    {
                    //        succedWf = succedWf + 1;
                    //    }
                    //}
                }
                return new
                {
                    SumWf = sumWf,
                    PendingWf = pendingWf,
                    SuccedWf = succedWf
                };
            }
        }

        [HttpPost]
        public JsonResult StatisWfByGroup()
        {
            var session = HttpContext.GetSessionUser();
            var data = (from a in _context.WorkflowInstances.Where(x => !x.IsDeleted.Value)
                        join b in _context.WorkFlows.Where(x => !x.IsDeleted.Value) on a.WorkflowCode equals b.WfCode
                        select new
                        {
                            a.WfInstCode,
                            a.Status,
                            a.UserManager,
                            a.CreatedBy,
                            a.UserList,
                            a.WfGroup
                        }).GroupBy(x => x.WfGroup);

            var listGroupWf = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals("WF_GROUP"))
                .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });

            var listStatis = new List<StatiscalWfGroup>();
            if (session.IsAllData)
            {
                foreach (var group in listGroupWf)
                {
                    var statis = new StatiscalWfGroup
                    {
                        Code = group.Code,
                        Name = group.Name,
                        CountPending = 0,
                        Total = 0
                    };
                    foreach (var item in data)
                    {
                        if (!string.IsNullOrEmpty(item.Key))
                        {
                            if (group.Code.Equals(item.Key))
                            {
                                statis.CountPending = item.Where(x => x.Status.Equals("STATUS_WF_PENDING")).Count();
                                statis.Total = item.Count();
                                break;
                            }
                        }
                    }
                    listStatis.Add(statis);
                }
            }
            else
            {
                foreach (var group in listGroupWf)
                {
                    var count = 0;
                    var total = 0;
                    var statis = new StatiscalWfGroup
                    {
                        Code = group.Code,
                        Name = group.Name,
                        CountPending = 0,
                        Total = 0,
                    };
                    foreach (var item in data.ToList())
                    {
                        if (!string.IsNullOrEmpty(item.Key))
                        {
                            if (group.Code.Equals(item.Key))
                            {
                                foreach (var wf in item)
                                {
                                    //var acts = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(wf.WfInstCode));
                                    //var assigns = _context.ExcuterControlRoleInsts.Where(x => acts.Any(k => k.ActivityInstCode.Equals(x.ActivityCodeInst))
                                    //        && !x.IsDeleted && x.UserId.Equals(ESEIM.AppContext.UserId));
                                    var userManager = !string.IsNullOrEmpty(wf.UserManager) ? JsonConvert.DeserializeObject<List<UserManagerWF>>(wf.UserManager) : new List<UserManagerWF>();
                                    var userList = !string.IsNullOrEmpty(wf.UserList) ? JsonConvert.DeserializeObject<List<string>>(wf.UserList) : new List<string>();
                                    if (userList.Any(x => x == ESEIM.AppContext.UserId) || wf.CreatedBy.Equals(ESEIM.AppContext.UserName) || userManager.Any(x => x.UserId == ESEIM.AppContext.UserId))
                                    {
                                        total = total + 1;

                                        if (wf.Status.Equals("STATUS_WF_PENDING"))
                                        {
                                            count = count + 1;
                                        }
                                    }
                                }
                                statis.CountPending = count;
                                statis.Total = total;
                                break;
                            }
                        }
                    }
                    listStatis.Add(statis);
                }
            }
            return Json(listStatis);
        }

        [HttpPost]
        public async Task<JsonResult> CreateWfInstance([FromBody] WorkflowInstance obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            var wfInstCode = string.Empty;
            try
            {
                using (await objLock.LockAsync(obj.WorkflowCode))
                {
                    using (await objLock.LockAsync(string.Concat(obj.ObjectInst, obj.ObjectType)))
                    {
                        try
                        {
                            var userId = !string.IsNullOrEmpty(obj.UserId) ? obj.UserId : ESEIM.AppContext.UserId;
                            var user = _context.Users.FirstOrDefault(x => x.Id.Equals(userId));
                            var check = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value &&
                            !string.IsNullOrEmpty(x.ObjectInst) && !string.IsNullOrEmpty(x.ObjectType) && x.ObjectInst == obj.ObjectInst && x.ObjectType == obj.ObjectType);

                            var processing = _context.WfActivityObjectProccessings.Where(x => !x.IsDeleted && x.ObjectType.Equals(obj.ObjectType)
                                                && x.ObjectInst.Equals(obj.ObjectInst));

                            if (check == null && !processing.Any())
                            {
                                var wf = _context.WorkFlows.FirstOrDefault(x => !x.IsDeleted.Value && x.WfCode.Equals(obj.WorkflowCode));

                                if (string.IsNullOrEmpty(obj.WfInstName))
                                {
                                    obj.WfInstName = obj.ObjectName + " - " + (wf != null ? wf.WfName : "");
                                }

                                var activities = _context.Activitys.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(obj.WorkflowCode));
                                //Get attr 
                                var dataAttrs = GetAttrSetup(activities);

                                var wfInstance = new WorkflowInstance
                                {
                                    ObjectType = obj.ObjectType,
                                    ObjectInst = obj.ObjectInst,
                                    WorkflowCode = obj.WorkflowCode,
                                    WfInstName = obj.WfInstName,
                                    WfGroup = wf != null ? wf.WfGroup : obj.WfGroup,
                                    WfInstCode = "" + (_context.WorkflowInstances.Count() > 0 ? _context.WorkflowInstances.Max(x => x.Id) + 1 : 1),
                                    CreatedBy = ESEIM.AppContext.UserName,
                                    CreatedTime = DateTime.Now,
                                    IsDeleted = false,
                                    StartTime = DateTime.Now,
                                    ActInstInitial = obj.ActInstInitial,
                                    Status = "STATUS_WF_PENDING",
                                    DataAttr = JsonConvert.SerializeObject(dataAttrs),
                                    WfType = obj.WfType,
                                    WfDesc = obj.WfDesc
                                };
                                _context.WorkflowInstances.Add(wfInstance);
                                _context.SaveChanges();

                                if (!wfInstance.WfInstCode.Equals(wfInstance.Id.ToString()))
                                {
                                    wfInstance.WfInstCode = wfInstance.Id.ToString();
                                    _context.WorkflowInstances.Update(wfInstance);
                                    _context.SaveChanges();
                                }

                                wfInstCode = wfInstance.WfInstCode;

                                //Update ActInstInitial
                                if (!string.IsNullOrEmpty(obj.ActInstInitial))
                                {
                                    AddSubWfInstance(wfInstance.WfInstCode, obj.ObjectType, obj.ObjectInst, obj.ActInstInitial);
                                }

                                //Instance Activity

                                var countAct = _context.ActivityInstances.Count();

                                if (activities.Any())
                                {
                                    var session = HttpContext.GetSessionUser();
                                    var listUserNotify = new List<UserNotify>();

                                    if (obj.ObjectType == EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.TypeInstCard))
                                    {
                                        var card = _context.WORKOSCards.FirstOrDefault(x => x.CardCode == obj.ObjectInst && !x.IsDeleted);
                                        var list = _context.WORKOSLists.FirstOrDefault(x => x.ListCode.Equals(card.ListCode) && !x.IsDeleted);
                                        var board = _context.WORKOSBoards.FirstOrDefault(x => x.BoardCode.Equals(list.BoardCode) && !x.IsDeleted);
                                        var lstAssign = _context.JobCardAssignees.Where(x => x.CardCode.Equals(obj.ObjectInst) && !string.IsNullOrEmpty(x.UserId) && !x.IsDeleted).ToList();
                                        if (card != null)
                                        {
                                            card.WorkflowCode = obj.WorkflowCode;

                                            //Rollback
                                            var itemStaff = _context.WorkItemAssignStaffs.Where(x => !x.IsDeleted && x.CardCode.Equals(card.CardCode));
                                            var attachments = _context.CardAttachments.Where(x => !x.Flag && x.CardCode.Equals(obj.ObjectInst));
                                            if (itemStaff.Any())
                                            {
                                                foreach (var item in itemStaff)
                                                {
                                                    item.IsDeleted = true;
                                                    item.DeletedBy = ESEIM.AppContext.UserName;
                                                    item.DeletedTime = DateTime.Now;
                                                    _context.WorkItemAssignStaffs.Update(item);
                                                }
                                            }
                                        }
                                        foreach (var item in activities)
                                        {
                                            countAct++;
                                            var actInst = new ActivityInstance
                                            {
                                                WorkflowCode = wfInstance.WfInstCode,
                                                ActivityCode = item.ActivityCode,
                                                ActivityInstCode = item.ActivityCode + "_A_" + countAct,
                                                CreatedBy = ESEIM.AppContext.UserName,
                                                CreatedTime = DateTime.Now,
                                                Desc = item.Desc,
                                                Duration = item.Duration,
                                                Group = item.Group,
                                                Located = item.Located,
                                                ShapeJson = item.ShapeJson,
                                                Status = item.Type == "TYPE_ACTIVITY_INITIAL"
                                                            ? "STATUS_ACTIVITY_ACTIVE" : "STATUS_ACTIVITY_NOT_DOING",
                                                Title = item.Title,
                                                Type = item.Type,
                                                Unit = item.Unit,
                                                IsDeleted = false,
                                                //IsLock = item.Type == "TYPE_ACTIVITY_INITIAL" ? false : true,
                                                StartTime = item.Type == "TYPE_ACTIVITY_INITIAL" ? DateTime.Now : (DateTime?)null
                                            };

                                            if (item.Type == "TYPE_ACTIVITY_INITIAL")
                                            {
                                                //Object processing
                                                if (!string.IsNullOrEmpty(obj.ObjectType) && !string.IsNullOrEmpty(obj.ObjectInst))
                                                {
                                                    var process = new WfActivityObjectProccessing
                                                    {
                                                        ObjectType = obj.ObjectType,
                                                        ObjectInst = obj.ObjectInst,
                                                        ObjEntry = true,
                                                        WfInstCode = wfInstance.WfInstCode,
                                                        ActInstCode = actInst.ActivityInstCode,
                                                        CreatedBy = ESEIM.AppContext.UserName,
                                                        CreatedTime = DateTime.Now
                                                    };
                                                    _context.WfActivityObjectProccessings.Add(process);
                                                    //AddLogStatus(obj.ObjectType, obj.ObjectInst, item.Status, item.Title);
                                                    //_workflowService.AddLogStatusAll(wfInfo.ObjectType, wfInfo.ObjectInst, Status, inst.Title, inst.Type, userName);
                                                }
                                            }

                                            _context.ActivityInstances.Add(actInst);

                                            //Add user assign

                                            var assigns = _context.ExcuterControlRoles.Where(x => !x.IsDeleted && x.ActivityCode == item.ActivityCode);
                                            var listManager = new List<CreatorManager>(); //AddCreatorManager(userId);
                                            var listManagerUserName = !String.IsNullOrEmpty(user.LeadersOfUser) ? user.LeadersOfUser.Split(",", StringSplitOptions.None).ToList() : new List<string>();
                                            foreach (var managerUserName in listManagerUserName)
                                            {
                                                var manager = _context.Users.FirstOrDefault(x => x.UserName == managerUserName);
                                                if (manager != null)
                                                {
                                                    var creatorManager = new CreatorManager()
                                                    {
                                                        BranchId = manager.BranchId,
                                                        DepartmentId = manager.DepartmentId,
                                                        UserId = manager.Id
                                                    };
                                                    listManager.Add(creatorManager);
                                                }
                                            }
                                            var listShareCreator = new List<ShareFileDefault>();
                                            if (assigns.Any())
                                            {
                                                foreach (var assign in assigns)
                                                {
                                                    if ((assign.UserId.Equals(EnumHelper<CreatorAssign>.GetDisplayValue(CreatorAssign.Creator))
                                                        || assign.UserId.Equals(EnumHelper<CreatorAssign>.GetDisplayValue(CreatorAssign.CreatorManager))))
                                                    {
                                                        if (assign.UserId.Equals(EnumHelper<CreatorAssign>.GetDisplayValue(CreatorAssign.CreatorManager)))
                                                        {
                                                            foreach (var manager in listManager)
                                                            {
                                                                if (!assigns.Any(x => x.UserId.Equals(manager.UserId)))
                                                                {
                                                                    var assignInst = new ExcuterControlRoleInst
                                                                    {
                                                                        UserId = manager.UserId,
                                                                        ActivityCodeInst = actInst.ActivityInstCode,
                                                                        Approve = false,
                                                                        ApproveTime = (DateTime?)null,
                                                                        Branch = manager.BranchId,
                                                                        DepartmentCode = "",
                                                                        GroupCode = "",
                                                                        CreatedTime = DateTime.Now,
                                                                        CreatedBy = ESEIM.AppContext.UserName,
                                                                        Status = "ASSIGN_STATUS_WORK",
                                                                        Role = assign.Role
                                                                    };
                                                                    _context.ExcuterControlRoleInsts.Add(assignInst);
                                                                    var userNotify = new UserNotify
                                                                    {
                                                                        UserId = assignInst.UserId
                                                                    };

                                                                    if (!listUserNotify.Any(p => p.UserId.Equals(userNotify.UserId)) && !userNotify.UserId.Equals(ESEIM.AppContext.UserId))
                                                                        listUserNotify.Add(userNotify);
                                                                }
                                                            }
                                                        }
                                                        else
                                                        {
                                                            if (!assigns.Any(x => x.UserId.Equals(userId)) && !listManager.Any(x => x.UserId.Equals(userId)))
                                                            {
                                                                var assignInst = new ExcuterControlRoleInst
                                                                {
                                                                    UserId = userId,
                                                                    ActivityCodeInst = actInst.ActivityInstCode,
                                                                    Approve = false,
                                                                    ApproveTime = (DateTime?)null,
                                                                    Branch = "",
                                                                    DepartmentCode = "",
                                                                    GroupCode = "",
                                                                    CreatedTime = DateTime.Now,
                                                                    CreatedBy = ESEIM.AppContext.UserName,
                                                                    Status = "ASSIGN_STATUS_WORK",
                                                                    Role = assign.Role
                                                                };
                                                                _context.ExcuterControlRoleInsts.Add(assignInst);
                                                                var userNotify = new UserNotify
                                                                {
                                                                    UserId = assignInst.UserId
                                                                };

                                                                if (!listUserNotify.Any(p => p.UserId.Equals(userNotify.UserId)) && !userNotify.UserId.Equals(ESEIM.AppContext.UserId))
                                                                    listUserNotify.Add(userNotify);
                                                            }
                                                        }
                                                    }
                                                    else
                                                    {
                                                        var assignInst = new ExcuterControlRoleInst
                                                        {
                                                            UserId = assign.UserId,
                                                            ActivityCodeInst = actInst.ActivityInstCode,
                                                            Approve = assign.Approve,
                                                            ApproveTime = assign.ApproveTime,
                                                            Branch = assign.Branch,
                                                            DepartmentCode = assign.DepartmentCode,
                                                            GroupCode = assign.GroupCode,
                                                            CreatedTime = DateTime.Now,
                                                            CreatedBy = ESEIM.AppContext.UserName,
                                                            Status = assign.Status,
                                                            Role = assign.Role
                                                        };
                                                        _context.ExcuterControlRoleInsts.Add(assignInst);
                                                        //Add user to Notification
                                                        var userNotify = new UserNotify
                                                        {
                                                            UserId = assign.UserId
                                                        };

                                                        if (!listUserNotify.Any(p => p.UserId.Equals(userNotify.UserId)) && !userNotify.UserId.Equals(ESEIM.AppContext.UserId))
                                                            listUserNotify.Add(userNotify);
                                                    }
                                                }
                                            }

                                            //Add attachment
                                            var fileRepos = _context.EDMSRepoCatFiles.Where(x => x.ObjectType.Equals(EnumHelper<ActivityCat>.GetDisplayValue(ActivityCat.ActivityCat))
                                                            && x.ObjectCode.Equals(item.ActivityCode));
                                            foreach (var fileRepo in fileRepos)
                                            {
                                                var edmsReposCatFile = new EDMSRepoCatFile
                                                {
                                                    FileCode = string.Concat("ActInst_", Guid.NewGuid().ToString()),
                                                    ReposCode = fileRepo.ReposCode,
                                                    CatCode = fileRepo.CatCode,
                                                    ObjectCode = actInst.ActivityInstCode,
                                                    ObjectType = EnumHelper<ActivityInst>.GetDisplayValue(ActivityInst.ActivityInst),
                                                    Path = fileRepo.Path,
                                                    FolderId = fileRepo.FolderId
                                                };
                                                _context.EDMSRepoCatFiles.Add(edmsReposCatFile);

                                                var edmsReposCard = new EDMSRepoCatFile
                                                {
                                                    FileCode = string.Concat("CARDJOB_", Guid.NewGuid().ToString()),
                                                    ReposCode = fileRepo.ReposCode,
                                                    CatCode = fileRepo.CatCode,
                                                    ObjectCode = card.CardCode,
                                                    ObjectType = EnumHelper<CardEnum>.GetDisplayValue(CardEnum.CardJob),
                                                    Path = fileRepo.Path,
                                                    FolderId = fileRepo.FolderId
                                                };
                                                _context.EDMSRepoCatFiles.Add(edmsReposCard);

                                                var edmsFile = _context.EDMSFiles.FirstOrDefault(x => !x.IsDeleted && x.FileCode.Equals(fileRepo.FileCode) && (x.IsFileMaster == true || x.IsFileMaster == null));
                                                if (edmsFile != null)
                                                {
                                                    var fileNew = string.Concat(Path.GetFileNameWithoutExtension(edmsFile.FileName), "_", Guid.NewGuid().ToString().Substring(0, 8), Path.GetExtension(edmsFile.FileName));
                                                    //var byteData = DownloadFileFromServer(fileRepo.Id);
                                                    //var urlUpload = UploadFileToServer(byteData, fileRepo.ReposCode, fileRepo.CatCode, fileNew, edmsFile.MimeType);

                                                    //if (urlUpload.Error)
                                                    //{
                                                    //    msg = urlUpload;
                                                    //    return Json(msg);
                                                    //}

                                                    var edms = new EDMSFile
                                                    {
                                                        FileCode = edmsReposCatFile.FileCode,
                                                        FileName = edmsFile.FileName,
                                                        Desc = edmsFile.Desc,
                                                        ReposCode = fileRepo.ReposCode,
                                                        Tags = edmsFile.Tags,
                                                        FileSize = edmsFile.FileSize,
                                                        FileTypePhysic = edmsFile.FileTypePhysic,
                                                        NumberDocument = edmsFile.NumberDocument,
                                                        CreatedBy = ESEIM.AppContext.UserName,
                                                        CreatedTime = DateTime.Now,
                                                        IsFileOrigin = false,
                                                        FileParentId = edmsFile.FileID,
                                                        MimeType = edmsFile.MimeType,
                                                        CloudFileId = edmsFile.CloudFileId,
                                                    };
                                                    _context.EDMSFiles.Add(edms);

                                                    var edmsCard = new EDMSFile
                                                    {
                                                        FileCode = edmsReposCard.FileCode,
                                                        FileName = edmsFile.FileName,
                                                        Desc = edmsFile.Desc,
                                                        ReposCode = fileRepo.ReposCode,
                                                        Tags = edmsFile.Tags,
                                                        FileSize = edmsFile.FileSize,
                                                        FileTypePhysic = edmsFile.FileTypePhysic,
                                                        NumberDocument = edmsFile.NumberDocument,
                                                        CreatedBy = ESEIM.AppContext.UserName,
                                                        CreatedTime = DateTime.Now,
                                                        IsFileOrigin = false,
                                                        FileParentId = edmsFile.FileID,
                                                        MimeType = edmsFile.MimeType,
                                                        CloudFileId = edmsFile.CloudFileId,
                                                    };
                                                    _context.EDMSFiles.Add(edmsCard);

                                                    var actInstFile = new ActivityInstFile
                                                    {
                                                        FileID = edmsReposCatFile.FileCode,
                                                        ActivityInstCode = actInst.ActivityInstCode,
                                                        CreatedBy = ESEIM.AppContext.UserName,
                                                        CreatedTime = DateTime.Now,
                                                        IsSign = false,
                                                        SignatureRequire = false,
                                                    };
                                                    _context.ActivityInstFiles.Add(actInstFile);

                                                    //File share by default

                                                    var listUserShare = from a in assigns
                                                                        join b in _context.Users on a.UserId equals b.Id
                                                                        join c in _context.AdDepartments.Where(x => !x.IsDeleted && x.IsEnabled) on b.DepartmentId equals c.DepartmentCode into c1
                                                                        from c in c1.DefaultIfEmpty()
                                                                        select new
                                                                        {
                                                                            Code = b.UserName,
                                                                            Name = b.GivenName,
                                                                            DepartmentName = c != null ? c.Title : "",
                                                                            Permission = new PermissionFile()
                                                                        };
                                                    var rela = new
                                                    {
                                                        ObjectType = EnumHelper<ActivityInst>.GetDisplayValue(ActivityInst.ActivityInst),
                                                        ObjectInstance = actInst.ActivityInstCode
                                                    };
                                                    var files = new FilesShareObjectUser
                                                    {
                                                        CreatedBy = ESEIM.AppContext.UserName,
                                                        CreatedTime = DateTime.Now,
                                                        FileID = edms.FileCode,
                                                        FileCreated = User.Identity.Name,
                                                        FileUrl = edms.Url,
                                                        FileName = edmsFile.FileName,
                                                        ObjectRelative = JsonConvert.SerializeObject(rela),
                                                        ListUserShare = JsonConvert.SerializeObject(listUserShare)
                                                    };
                                                    _context.FilesShareObjectUsers.Add(files);
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        foreach (var item in activities)
                                        {
                                            countAct++;
                                            var actInst = new ActivityInstance
                                            {
                                                WorkflowCode = wfInstance.WfInstCode,
                                                ActivityCode = item.ActivityCode,
                                                ActivityInstCode = item.ActivityCode + "_A_" + countAct,
                                                CreatedBy = ESEIM.AppContext.UserName,
                                                CreatedTime = DateTime.Now,
                                                Desc = item.Desc,
                                                Duration = item.Duration,
                                                Group = item.Group,
                                                Located = item.Located,
                                                ShapeJson = item.ShapeJson,
                                                Status = item.Type == "TYPE_ACTIVITY_INITIAL"
                                                            ? "STATUS_ACTIVITY_ACTIVE" : "STATUS_ACTIVITY_NOT_DOING",
                                                Title = item.Title,
                                                Type = item.Type,
                                                Unit = item.Unit,
                                                IsDeleted = false,
                                                //IsLock = item.Type == "TYPE_ACTIVITY_INITIAL" ? false : true,
                                                StartTime = item.Type == "TYPE_ACTIVITY_INITIAL" ? DateTime.Now : (DateTime?)null
                                            };
                                            _context.ActivityInstances.Add(actInst);

                                            if (item.Type == "TYPE_ACTIVITY_INITIAL")
                                            {
                                                //Object processing
                                                if (!string.IsNullOrEmpty(obj.ObjectType) && !string.IsNullOrEmpty(obj.ObjectInst))
                                                {
                                                    var process = new WfActivityObjectProccessing
                                                    {
                                                        ObjectType = obj.ObjectType,
                                                        ObjectInst = obj.ObjectInst,
                                                        ObjEntry = true,
                                                        WfInstCode = wfInstance.WfInstCode,
                                                        ActInstCode = actInst.ActivityInstCode,
                                                        CreatedBy = ESEIM.AppContext.UserName,
                                                        CreatedTime = DateTime.Now
                                                    };
                                                    _context.WfActivityObjectProccessings.Add(process);
                                                    //AddLogStatus(obj.ObjectType, obj.ObjectInst, item.Status, item.Title);
                                                }
                                                wfInstance.MarkActCurrent = actInst.ActivityInstCode;
                                            }

                                            var assigns = _context.ExcuterControlRoles.Where(x => !x.IsDeleted && x.ActivityCode == item.ActivityCode);
                                            var listManager = new List<CreatorManager>(); //AddCreatorManager(userId);
                                            var listManagerUserName = !String.IsNullOrEmpty(user.LeadersOfUser) ? user.LeadersOfUser.Split(",", StringSplitOptions.None).ToList() : new List<string>();
                                            foreach (var managerUserName in listManagerUserName)
                                            {
                                                var manager = _context.Users.FirstOrDefault(x => x.UserName == managerUserName);
                                                if (manager != null)
                                                {
                                                    var creatorManager = new CreatorManager()
                                                    {
                                                        BranchId = manager.BranchId,
                                                        DepartmentId = manager.DepartmentId,
                                                        UserId = manager.Id
                                                    };
                                                    listManager.Add(creatorManager);
                                                }
                                            }
                                            if (assigns.Any())
                                            {
                                                foreach (var assign in assigns)
                                                {
                                                    if ((assign.UserId.Equals(EnumHelper<CreatorAssign>.GetDisplayValue(CreatorAssign.Creator))
                                                        || assign.UserId.Equals(EnumHelper<CreatorAssign>.GetDisplayValue(CreatorAssign.CreatorManager))))
                                                    {
                                                        if (assign.UserId.Equals(EnumHelper<CreatorAssign>.GetDisplayValue(CreatorAssign.CreatorManager)))
                                                        {
                                                            foreach (var manager in listManager)
                                                            {
                                                                if (!assigns.Any(x => x.UserId.Equals(manager.UserId)))
                                                                {
                                                                    var assignInst = new ExcuterControlRoleInst
                                                                    {
                                                                        UserId = manager.UserId,
                                                                        ActivityCodeInst = actInst.ActivityInstCode,
                                                                        Approve = false,
                                                                        ApproveTime = (DateTime?)null,
                                                                        Branch = manager.BranchId,
                                                                        DepartmentCode = "",
                                                                        GroupCode = "",
                                                                        CreatedTime = DateTime.Now,
                                                                        CreatedBy = ESEIM.AppContext.UserName,
                                                                        Status = "ASSIGN_STATUS_WORK",
                                                                        Role = assign.Role
                                                                    };
                                                                    _context.ExcuterControlRoleInsts.Add(assignInst);
                                                                    var userNotify = new UserNotify
                                                                    {
                                                                        UserId = assignInst.UserId
                                                                    };

                                                                    if (!listUserNotify.Any(p => p.UserId.Equals(userNotify.UserId)) && !userNotify.UserId.Equals(ESEIM.AppContext.UserId))
                                                                        listUserNotify.Add(userNotify);
                                                                }
                                                            }
                                                        }
                                                        else
                                                        {
                                                            if (!assigns.Any(x => x.UserId.Equals(userId)) && !listManager.Any(x => x.UserId.Equals(userId)))
                                                            {
                                                                var assignInst = new ExcuterControlRoleInst
                                                                {
                                                                    UserId = userId,
                                                                    ActivityCodeInst = actInst.ActivityInstCode,
                                                                    Approve = false,
                                                                    ApproveTime = (DateTime?)null,
                                                                    Branch = "",
                                                                    DepartmentCode = "",
                                                                    GroupCode = "",
                                                                    CreatedTime = DateTime.Now,
                                                                    CreatedBy = ESEIM.AppContext.UserName,
                                                                    Status = "ASSIGN_STATUS_WORK",
                                                                    Role = assign.Role
                                                                };
                                                                _context.ExcuterControlRoleInsts.Add(assignInst);
                                                                var userNotify = new UserNotify
                                                                {
                                                                    UserId = assignInst.UserId
                                                                };

                                                                if (!listUserNotify.Any(p => p.UserId.Equals(userNotify.UserId)) && !userNotify.UserId.Equals(ESEIM.AppContext.UserId))
                                                                    listUserNotify.Add(userNotify);
                                                            }
                                                        }
                                                    }
                                                    else
                                                    {
                                                        var assignInst = new ExcuterControlRoleInst
                                                        {
                                                            UserId = assign.UserId,
                                                            ActivityCodeInst = actInst.ActivityInstCode,
                                                            Approve = assign.Approve,
                                                            ApproveTime = assign.ApproveTime,
                                                            Branch = assign.Branch,
                                                            DepartmentCode = assign.DepartmentCode,
                                                            GroupCode = assign.GroupCode,
                                                            CreatedTime = DateTime.Now,
                                                            CreatedBy = ESEIM.AppContext.UserName,
                                                            Status = assign.Status,
                                                            Role = assign.Role
                                                        };
                                                        _context.ExcuterControlRoleInsts.Add(assignInst);
                                                        //Add user to Notification
                                                        var userNotify = new UserNotify
                                                        {
                                                            UserId = assign.UserId
                                                        };

                                                        if (!listUserNotify.Any(p => p.UserId.Equals(userNotify.UserId)) && !userNotify.UserId.Equals(ESEIM.AppContext.UserId))
                                                            listUserNotify.Add(userNotify);
                                                    }
                                                }
                                            }

                                            //Add attachment
                                            var fileRepos = _context.EDMSRepoCatFiles.Where(x => x.ObjectType.Equals(EnumHelper<ActivityCat>.GetDisplayValue(ActivityCat.ActivityCat))
                                                            && x.ObjectCode.Equals(item.ActivityCode));
                                            foreach (var fileRepo in fileRepos)
                                            {
                                                var edmsReposCatFile = new EDMSRepoCatFile
                                                {
                                                    FileCode = string.Concat("ActInst_", Guid.NewGuid().ToString()),
                                                    ReposCode = fileRepo.ReposCode,
                                                    CatCode = fileRepo.CatCode,
                                                    ObjectCode = actInst.ActivityInstCode,
                                                    ObjectType = EnumHelper<ActivityInst>.GetDisplayValue(ActivityInst.ActivityInst),
                                                    Path = fileRepo.Path,
                                                    FolderId = fileRepo.FolderId
                                                };
                                                _context.EDMSRepoCatFiles.Add(edmsReposCatFile);

                                                var edmsFile = _context.EDMSFiles.FirstOrDefault(x => !x.IsDeleted && x.FileCode.Equals(fileRepo.FileCode) && (x.IsFileMaster == true || x.IsFileMaster == null));
                                                if (edmsFile != null)
                                                {
                                                    var fileNew = string.Concat(Path.GetFileNameWithoutExtension(edmsFile.FileName), "_", Guid.NewGuid().ToString().Substring(0, 8), Path.GetExtension(edmsFile.FileName));
                                                    //var byteData = DownloadFileFromServer(fileRepo.Id);
                                                    //var urlUpload = UploadFileToServer(byteData, fileRepo.ReposCode, fileRepo.CatCode, fileNew, edmsFile.MimeType);

                                                    //if (urlUpload.Error)
                                                    //{
                                                    //    msg = urlUpload;
                                                    //    return Json(msg);
                                                    //}

                                                    var edms = new EDMSFile
                                                    {
                                                        FileCode = edmsReposCatFile.FileCode,
                                                        FileName = edmsFile.FileName,
                                                        Desc = edmsFile.Desc,
                                                        ReposCode = fileRepo.ReposCode,
                                                        Tags = edmsFile.Tags,
                                                        FileSize = edmsFile.FileSize,
                                                        FileTypePhysic = edmsFile.FileTypePhysic,
                                                        NumberDocument = edmsFile.NumberDocument,
                                                        CreatedBy = ESEIM.AppContext.UserName,
                                                        CreatedTime = DateTime.Now,
                                                        IsFileOrigin = false,
                                                        FileParentId = edmsFile.FileID,
                                                        MimeType = edmsFile.MimeType,
                                                        CloudFileId = edmsFile.CloudFileId,
                                                    };
                                                    _context.EDMSFiles.Add(edms);

                                                    var actInstFile = new ActivityInstFile
                                                    {
                                                        FileID = edmsReposCatFile.FileCode,
                                                        ActivityInstCode = actInst.ActivityInstCode,
                                                        CreatedBy = ESEIM.AppContext.UserName,
                                                        CreatedTime = DateTime.Now,
                                                        IsSign = false,
                                                        SignatureRequire = false,
                                                    };
                                                    _context.ActivityInstFiles.Add(actInstFile);

                                                    //File share by default
                                                    var permission = new PermissionFile();
                                                    var listUserShare = (from a in assigns
                                                                         join b in _context.Users on a.UserId equals b.Id
                                                                         join c in _context.AdDepartments.Where(x => !x.IsDeleted && x.IsEnabled) on b.DepartmentId equals c.DepartmentCode into c1
                                                                         from c in c1.DefaultIfEmpty()
                                                                         select new ShareFileDefault
                                                                         {
                                                                             Code = b.UserName,
                                                                             Name = b.GivenName,
                                                                             DepartmentName = c != null ? c.Title : "",
                                                                             Permission = permission
                                                                         }).ToList();
                                                    var listUserShareManager = (from a in listManager
                                                                                join b in _context.Users on a.UserId equals b.Id
                                                                                join c in _context.AdDepartments.Where(x => !x.IsDeleted && x.IsEnabled) on b.DepartmentId equals c.DepartmentCode into c1
                                                                                from c in c1.DefaultIfEmpty()
                                                                                select new ShareFileDefault
                                                                                {
                                                                                    Code = b.UserName,
                                                                                    Name = b.GivenName,
                                                                                    DepartmentName = c != null ? c.Title : "",
                                                                                    Permission = permission
                                                                                }).ToList();

                                                    var rela = new
                                                    {
                                                        ObjectType = EnumHelper<ActivityInst>.GetDisplayValue(ActivityInst.ActivityInst),
                                                        ObjectInstance = actInst.ActivityInstCode
                                                    };
                                                    var files = new FilesShareObjectUser
                                                    {
                                                        CreatedBy = ESEIM.AppContext.UserName,
                                                        CreatedTime = DateTime.Now,
                                                        FileID = edms.FileCode,
                                                        FileCreated = User.Identity.Name,
                                                        FileUrl = edms.Url,
                                                        FileName = edmsFile.FileName,
                                                        ObjectRelative = JsonConvert.SerializeObject(rela),
                                                        ListUserShare = JsonConvert.SerializeObject(listUserShare.Concat(listUserShareManager))
                                                    };
                                                    _context.FilesShareObjectUsers.Add(files);
                                                }
                                            }
                                        }
                                    }

                                    if (listUserNotify.Count > 0)
                                    {
                                        var notification = new NotificationManager
                                        {
                                            ListUser = listUserNotify,
                                            Title = string.Format("{0} đã tạo 1 luồng việc mới: {1}", session.FullName, wfInstance.WfInstName),
                                            ObjCode = wfInstance.WfInstCode,
                                            ObjType = EnumHelper<NotificationType>.GetDisplayValue(NotificationType.WorkFlow),
                                        };

                                        InsertNotification(notification);
                                    }

                                    var userList = listUserNotify.Select(x => x.UserId);
                                    wfInstance.UserList = JsonConvert.SerializeObject(userList);
                                    _context.WorkflowInstances.Update(wfInstance);
                                }
                                msg.Object = wfInstance;
                                _context.SaveChanges();
                                msg.Title = _sharedResources["COM_ADD_SUCCESS"];
                                msg.Code = wfInstance.WfInstCode;
                                InsertInstRunning(wfInstance.WfInstCode, obj.WorkflowCode);
                            }
                            else
                            {
                                msg.Error = true;
                                msg.Title = _stringLocalizer["WFAI_MSG_OBJECT_HAD_WF"];
                            }
                        }
                        catch (Exception)
                        {
                            if (!string.IsNullOrEmpty(wfInstCode))
                                DeleteWfInstance(wfInstCode);

                            msg.Error = true;
                            msg.Title = _sharedResources["COM_MSG_ERR"];
                            msg.Object = "Ex1";
                            return Json(msg);
                        }
                    }
                }
            }
            catch (Exception)
            {
                //Rollback wfInstace
                //if (!string.IsNullOrEmpty(wfInstCode))
                //    DeleteWfInstance(wfInstCode);

                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Object = "Ex2";
                return Json(msg);
            }
            return Json(msg);
        }
        [NonAction]
        private List<DataAtt> GetAttrSetup(IQueryable<Activity> activities)
        {
            var listData = new List<DataAtt>();

            foreach (var item in activities)
            {
                if (!string.IsNullOrEmpty(item.ListGroupData))
                {
                    var listGroupData = item.ListGroupData.Split(',');

                    var data = (from a in _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == "CARD_DATA_LOGGER")
                                join b in _context.AttrSetups.Where(x => !x.IsDeleted && listGroupData.Any(p => p.Equals(x.AttrGroup)))
                                    on a.CodeSet equals b.AttrGroup
                                select new DataAttrWf
                                {
                                    AttrCode = b != null ? b.AttrCode : "",
                                    AttrName = b != null ? b.AttrName : "",
                                    AttrGroup = a.CodeSet,
                                    AttrDataType = b != null ? b.AttrDataType : "",
                                    AttrNote = b != null ? b.Note : "",
                                    AttrUnit = b != null ? b.AttrUnit : "",
                                    SessionId = "",
                                    Value = "",
                                    ActCode = item.ActivityCode
                                }).GroupBy(x => new { x.AttrGroup, x.ActCode }).ToList();

                    var rs = data.Select(x => new DataAtt
                    {
                        AttrGroup = x.Key.AttrGroup,
                        ActCode = x.Key.ActCode,
                        DataAttrWf = x.ToList()
                    }).ToList();

                    if (rs.Count > 0)
                        listData.AddRange(rs);
                }
            }

            return listData;
        }

        [NonAction]
        private void AddSubWfInstance(string wfInstCode, string objType, string objCode, string actInit)
        {
            var subWf = new SubWorkflowInstance
            {
                ActInstInitial = actInit,
                ObjectType = objType,
                ObjectCode = objCode,
                WfInstCode = wfInstCode,
                CreatedBy = ESEIM.AppContext.UserName,
                CreatedTime = DateTime.Now,
                IsMain = false
            };
            _context.SubWorkflowInstances.Add(subWf);
        }

        [NonAction]
        public List<CreatorManager> AddCreatorManager(string userId)
        {
            var user = _context.Users.FirstOrDefault(x => x.Id.Equals(userId));
            var lstUser = new List<CreatorManager>();
            if (user != null)
            {
                if (!string.IsNullOrEmpty(user.DepartmentId))
                {
                    lstUser = (from a in _context.AdUserDepartments.Where(x => !x.IsDeleted && x.DepartmentCode.Equals(user.DepartmentId))
                               where a.RoleId.Equals("49b018ad-68af-4625-91fd-2273bb5cf749") || a.RoleId.Equals("4fdd7913-cb36-4621-bf4b-c9359138881c") // role is manager or sub-manager
                               select new CreatorManager
                               {
                                   UserId = a.UserId,
                                   BranchId = user.BranchId,
                                   DepartmentId = user.DepartmentId
                               }).DistinctBy(x => x.UserId).ToList();
                }
            }
            return lstUser;
        }

        [HttpPost]
        public void InsertInstRunning(string wfInstCode, string wfCode)
        {
            var setting = (_context.WorkflowSettings.Where(x => !x.IsDeleted && x.WorkflowCode == wfCode)
                .Select(x => new SettingWf
                {
                    ActSrc = x.ActivityInitial,
                    ActDes = x.ActivityDestination,
                    Command = x.Command,
                    TransCode = x.TransitionCode
                })).ToList();

            var actInst = (from a in _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode == wfInstCode)
                           join b in _context.Activitys.Where(x => !x.IsDeleted && x.WorkflowCode == wfCode) on a.ActivityCode equals b.ActivityCode
                           select new
                           {
                               ActInstCode = a.ActivityInstCode,
                               ActCode = b.ActivityCode,
                               Type = b.Type
                           }).ToList();

            var lstSetting = new List<SettingWf>();

            foreach (var item in setting)
            {
                var obj = new SettingWf();
                obj.TransCode = item.TransCode;

                var lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(item.Command);
                foreach (var command in lstCommand)
                {
                    command.Approved = "APPROVE_COMMAND_Y";
                }

                item.Command = JsonConvert.SerializeObject(lstCommand);
                obj.Command = item.Command;

                foreach (var k in actInst)
                {
                    if (item.ActSrc == k.ActCode)
                    {
                        obj.ActSrc = k.ActInstCode;
                        break;
                    }
                }
                foreach (var k in actInst)
                {
                    if (item.ActDes == k.ActCode)
                    {
                        obj.ActDes = k.ActInstCode;
                        break;
                    }
                }
                lstSetting.Add(obj);
            }
            foreach (var item in lstSetting)
            {
                var running = new WorkflowInstanceRunning
                {
                    ActivityInitial = item.ActSrc,
                    ActivityDestination = item.ActDes,
                    Command = item.Command,
                    TransitionCode = item.TransCode,
                    WfInstCode = wfInstCode,
                    WorkflowCode = wfCode,
                    CreatedBy = ESEIM.AppContext.UserName,
                    CreatedTime = DateTime.Now
                };
                _context.WorkflowInstanceRunnings.Add(running);
            }
            _context.SaveChanges();
            foreach (var item in lstSetting)
            {
                foreach (var act in actInst)
                {
                    if (act.Type == "TYPE_ACTIVITY_INITIAL" && item.ActSrc == act.ActInstCode)
                    {
                        var obj = new RunningOneCommandModel()
                        {
                            ActInst = item.ActSrc,
                            ActTo = item.ActDes,
                            Approve = "APPROVE_COMMAND_Y",
                            Command = "COMMAND_WF_INSTANCE_DO"
                        };
                        RunningOneCommand(obj);
                    }
                }
            }
        }

        [HttpGet]
        public JsonResult DeleteWfInstance(string wfInstCode)
        {
            var msg = new JMessage { Error = false, Title = "" };
            var session = HttpContext.GetSessionUser();
            var data = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.WfInstCode == wfInstCode);
            if (data != null)
            {
                var actInst = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode == wfInstCode);
                var isApproved = actInst.Any(x => x.Status == "STATUS_ACTIVITY_END");
                if ((data.CreatedBy == session.UserName && !isApproved) || session.IsAllData)
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
                    var runnings = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.WfInstCode == wfInstCode);
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

                    if (data.ObjectType == "NOT_WORK" || data.ObjectType == "GOLATE" || data.ObjectType == "QUITWORK" ||
                        data.ObjectType == "PLAN_SCHEDULE" || data.ObjectType == "OVERTIME")
                    {
                        var wfObject = _context.WorkShiftCheckInOuts.FirstOrDefault(x =>
                            !x.IsDeleted && x.Action == data.ObjectType && x.Id.ToString() == data.ObjectInst);
                        if (wfObject != null)
                        {
                            wfObject.IsDeleted = true;
                            wfObject.DeletedBy = ESEIM.AppContext.UserName;
                            wfObject.DeletedTime = DateTime.Now;
                            _context.WorkShiftCheckInOuts.Update(wfObject);
                        }
                    }

                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_DELETE_SUCCESS"];

                    RemoveUserInNotify(wfInstCode, EnumHelper<NotificationType>.GetDisplayValue(NotificationType.WorkFlow), true);
                }
                else
                {
                    msg.Error = true;
                    msg.Title = isApproved ? _stringLocalizer["WFAI_MSG_NO_PERMISSION_DELETE_APPROVED_WFI"] : _stringLocalizer["WFAI_MSG_U_NOT_PERMISSION_DELETE"];
                }
            }
            else
            {
                msg.Error = true;
                msg.Title = _stringLocalizer["WFAI_MSG_RECORD_NO_EXIST"];
            }
            return Json(msg);
        }

        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetItemWfInst(string wfInsCode)
        {
            var data = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.WfInstCode == wfInsCode);
            var dataExt = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(wfInsCode));
            var actInitial = dataExt.FirstOrDefault(x => x.Type.Equals("TYPE_ACTIVITY_INITIAL"));
            var actEnd = dataExt.FirstOrDefault(x => x.Type.Equals("TYPE_ACTIVITY_END"));
            var obj = new
            {
                ObjData = data,
                StartTime = actInitial != null ? actInitial.StartTime.HasValue ? actInitial.StartTime.Value.ToString("dd/MM/yyyy HH:mm") : "" : "",
                EndTime = actEnd != null ? actEnd.EndTime.HasValue ? actEnd.EndTime.Value.ToString("dd/MM/yyyy HH:mm") : "" : "",
            };
            return Json(obj);
        }

        [HttpPost]
        public JsonResult LockOrUnLockWfInst(string wfInstCode, bool isLock)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var wfInst = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.WfInstCode.Equals(wfInstCode));
                if (wfInst != null)
                {
                    wfInst.IsLock = isLock;
                    wfInst.UpdatedBy = ESEIM.AppContext.UserName;
                    wfInst.UpdatedTime = DateTime.Now;
                    _context.WorkflowInstances.Update(wfInst);
                    _context.SaveChanges();
                    if (isLock)
                    {
                        msg.Title = _stringLocalizer["WFAI_MSG_LOCK_WF_SUCCESS"];
                    }
                    else
                    {
                        msg.Title = _stringLocalizer["WFAI_MSG_UNLOCK_SUCCESS"];
                    }
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["WFAI_MSG_WF_INST_NO_EXISTS"];
                }
            }
            catch (Exception)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetInstanceAct(string wfCode)
        {
            var data = (from a in _context.WorkflowInstances.Where(x => !x.IsDeleted.Value && x.WfInstCode.Equals(wfCode))
                        join b in _context.ActivityInstances.Where(x => !x.IsDeleted) on a.WfInstCode equals b.WorkflowCode
                        select new LstActInst
                        {
                            ID = b.ID,
                            Title = b.Title,
                            Status = _context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals(b.Status) && !x.IsDeleted).ValueSet ?? "",
                            Timer = b.Duration + " " + _context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals(b.Unit) && !x.IsDeleted).ValueSet ?? "",
                            ObjCode = a.ObjectInst,
                            IsRela = false,
                            ActInstCode = b.ActivityInstCode,
                            //IsLock = b.IsLock
                        }).ToList();
            foreach (var item in data)
            {
                if (!item.IsLock)
                {
                    item.IsRela = IsEmpRela(item.ActInstCode);
                }
                var files = from a in _context.EDMSRepoCatFiles.Where(x => x.ObjectCode.Equals(item.ActInstCode) && x.ObjectType.Equals(EnumHelper<ActivityInst>.GetDisplayValue(ActivityInst.ActivityInst)))
                            join b in _context.EDMSFiles.Where(x => !x.IsDeleted) on a.FileCode equals b.FileCode
                            join c in _context.ActivityInstFiles.Where(x => !x.IsDeleted) on a.FileCode equals c.FileID
                            select new
                            {
                                b.FileName
                            };
                item.AttachFile = string.Join(", ", files.Select(x => x.FileName));
            }
            return Json(data);
        }

        [NonAction]
        public bool IsEmpRela(string actInst)
        {
            var data = _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst == actInst);
            if (data.Any(x => x.UserId == ESEIM.AppContext.UserId))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        [HttpPost]
        public JsonResult GetWorkflowInstance(string wfInst)
        {
            var session = HttpContext.GetSessionUser();
            var data = (from a in _context.WorkflowInstances.Where(x => !x.IsDeleted.Value)
                        join b in _context.WorkFlows.Where(x => !x.IsDeleted.Value) on a.WorkflowCode equals b.WfCode
                        join c in _context.Users on a.CreatedBy equals c.UserName
                        join d in _context.ActivityInstances.Where(x => !x.IsDeleted) on a.WfInstCode equals d.WorkflowCode into d1
                        from d2 in d1.DefaultIfEmpty()
                        join e in _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted) on d2.ActivityInstCode equals e.ActivityCodeInst into e1
                        from e2 in e1.DefaultIfEmpty()
                        where (string.IsNullOrEmpty(wfInst) || a.WfInstCode.Contains(wfInst) || b.WfName.Contains(wfInst))
                        && (session.IsAllData || a.CreatedBy == session.UserName || (e2 != null && e2.UserId == session.UserId))
                        select new ModelWfInst
                        {
                            Code = a.WfInstCode,
                            WfName = a.WfInstName,
                            CreatedBy = c.GivenName,
                            CreatedTime = a.CreatedTime.Value.ToString("HH:mm dd/MM/yyyy"),
                            TimeCreated = a.CreatedTime.Value,
                            ObjName = "",
                            ObjType = a.ObjectType,
                            ObjCode = a.ObjectInst,
                            IsSuccess = false,
                            IsSelected = false
                        }).OrderByDescending(x => x.TimeCreated).DistinctBy(x => x.Code).ToList();
            foreach (var item in data)
            {
                if (!string.IsNullOrEmpty(item.ObjCode) && !string.IsNullOrEmpty(item.ObjType))
                    item.ObjName = GetObjectRelative(item.ObjCode, item.ObjType);
                item.IsSuccess = CheckActEnd(item.Code);
            }
            return Json(data);
        }

        [NonAction]
        public bool CheckActEnd(string wfInstCode)
        {
            var data = _context.ActivityInstances.FirstOrDefault(x => x.Type == "TYPE_ACTIVITY_END" && x.WorkflowCode == wfInstCode);
            var check = false;
            if (data != null)
            {
                if (data.Status == "STATUS_ACTIVITY_END")
                    check = true;
            }
            return check;
        }

        [HttpGet]
        public object GetItemActInst(int id)
        {
            var check = false;
            var data = _context.ActivityInstances.FirstOrDefault(x => x.ID == id);
            if (data != null)
            {
                var act = _context.Activitys.FirstOrDefault(x => !x.IsDeleted && x.ActivityCode == data.ActivityCode);
                if (act != null)
                {
                    var transtions = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityInitial == data.ActivityInstCode);
                    foreach (var item in transtions)
                    {
                        var lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(item.Command);
                        if (lstCommand.Count > 0)
                        {
                            if (lstCommand[lstCommand.Count - 1].Confirmed == "CONFIRM_COMMAND_N")
                            {
                                check = true;
                                break;
                            }
                        }
                    }

                    AutoAcceptAct(data.ActivityInstCode);
                }

                RemoveUserInNotify(data.WorkflowCode, EnumHelper<NotificationType>.GetDisplayValue(NotificationType.WorkFlow), false);
            }
            return new
            {
                DataActInst = data,
                IsBack = check
            };
        }

        [NonAction]
        private void AutoAcceptAct(string actInstCode)
        {
            var check = _context.ActInstanceUserActivitys.FirstOrDefault(x => x.ActInstCode.Equals(actInstCode)
                        && x.UserId.Equals(ESEIM.AppContext.UserId) && x.Action != EnumHelper<CardAction>.GetDisplayValue(CardAction.Review));
            if (check == null)
            {
                var actionText = EnumHelper<CardAction>.GetDisplayValue(CardAction.Accept);

                var activity = new ActInstanceUserActivity
                {
                    UserId = ESEIM.AppContext.UserId,
                    ActInstCode = actInstCode,
                    Action = actionText,
                    IsCheck = true,
                    FromDevice = "Laptop/Desktop",
                    CreatedTime = DateTime.Now
                };
                _context.ActInstanceUserActivitys.Add(activity);
                _context.SaveChanges();
            }
        }

        [HttpGet]
        public object GetItemActInstByCode(string code)
        {
            var check = false;
            var data = _context.ActivityInstances.FirstOrDefault(x => x.ActivityInstCode == code && !x.IsDeleted);
            if (data != null)
            {
                AutoAcceptAct(data.ActivityInstCode);
                var transtions = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityInitial == data.ActivityInstCode);
                foreach (var item in transtions)
                {
                    var lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(item.Command);
                    if (lstCommand.Count > 0)
                    {
                        if (lstCommand[lstCommand.Count - 1].Confirmed == "CONFIRM_COMMAND_N")
                        {
                            check = true;
                            break;
                        }
                    }

                }
            }

            return new
            {
                DataActInst = data,
                IsBack = check
            };
        }

        [HttpPost]
        public JsonResult UpdateActInst([FromBody] ActivityInstance data)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var startTime = !string.IsNullOrEmpty(data.sStartTime) ? DateTime.ParseExact(data.sStartTime, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
                var endTime = !string.IsNullOrEmpty(data.sEndTime) ? DateTime.ParseExact(data.sEndTime, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;

                var check = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(data.ActivityInstCode));

                if (check != null)
                {
                    //Log change activity instance
                    if (check.Desc != data.Desc)
                    {
                        var action = new ActInstanceUserActivity
                        {
                            ActInstCode = data.ActivityInstCode,
                            Action = "Đã cập nhật",
                            UserId = ESEIM.AppContext.UserId,
                            FromDevice = "Desktop/Laptop",
                            IdObject = "Header",
                            ChangeDetails = "mô tả từ [" + check.Desc + "] sang [" + data.Desc + "]",
                            CreatedTime = DateTime.Now
                        };
                        _context.ActInstanceUserActivitys.Add(action);
                    }

                    if (check.Duration != data.Duration)
                    {
                        var action = new ActInstanceUserActivity
                        {
                            ActInstCode = data.ActivityInstCode,
                            Action = "Đã cập nhật",
                            UserId = ESEIM.AppContext.UserId,
                            FromDevice = "Desktop/Laptop",
                            IdObject = "Header",
                            ChangeDetails = "thời lượng từ [" + check.Duration + "] sang [" + data.Duration + "]",
                            CreatedTime = DateTime.Now
                        };
                        _context.ActInstanceUserActivitys.Add(action);
                    }

                    if (check.Group != data.Group)
                    {
                        var currentGroup = "";
                        var newGroup = "";
                        var common = _context.CommonSettings.Where(x => !x.IsDeleted);

                        var group = common.FirstOrDefault(x => x.CodeSet.Equals(check.Group));
                        if (group != null)
                        {
                            currentGroup = group.ValueSet;
                        }

                        var groupNew = common.FirstOrDefault(x => x.CodeSet.Equals(data.Group));
                        if (groupNew != null)
                        {
                            newGroup = groupNew.ValueSet;
                        }

                        var action = new ActInstanceUserActivity
                        {
                            ActInstCode = data.ActivityInstCode,
                            Action = "Cập nhật",
                            UserId = ESEIM.AppContext.UserId,
                            FromDevice = "Desktop/Laptop",
                            IdObject = "Header",
                            ChangeDetails = "nhóm từ [" + currentGroup + "] sang [" + newGroup + "]",
                            CreatedTime = DateTime.Now
                        };
                        _context.ActInstanceUserActivitys.Add(action);
                    }

                    if (check.Title != data.Title)
                    {
                        var action = new ActInstanceUserActivity
                        {
                            ActInstCode = data.ActivityInstCode,
                            Action = "Cập nhật",
                            UserId = ESEIM.AppContext.UserId,
                            FromDevice = "Desktop/Laptop",
                            IdObject = "Header",
                            ChangeDetails = "tiêu đề từ [" + check.Title + "] sang [" + data.Title + "]",
                            CreatedTime = DateTime.Now
                        };
                        _context.ActInstanceUserActivitys.Add(action);
                    }

                    if (check.Located != data.Located)
                    {
                        var action = new ActInstanceUserActivity
                        {
                            ActInstCode = data.ActivityInstCode,
                            Action = "Cập nhật",
                            UserId = ESEIM.AppContext.UserId,
                            FromDevice = "Desktop/Laptop",
                            IdObject = "Header",
                            ChangeDetails = "địa điểm từ [" + check.Located + "] sang [" + data.Located + "]",
                            CreatedTime = DateTime.Now
                        };
                        _context.ActInstanceUserActivitys.Add(action);
                    }

                    if (check.Status != data.Status)
                    {
                        var currentGroup = "";
                        var newGroup = "";
                        var common = _context.CommonSettings.Where(x => !x.IsDeleted);

                        var group = common.FirstOrDefault(x => x.CodeSet.Equals(check.Status));
                        if (group != null)
                        {
                            currentGroup = group.ValueSet;
                        }

                        var groupNew = common.FirstOrDefault(x => x.CodeSet.Equals(data.Status));
                        if (groupNew != null)
                        {
                            newGroup = groupNew.ValueSet;
                        }

                        var action = new ActInstanceUserActivity
                        {
                            ActInstCode = data.ActivityInstCode,
                            Action = "Cập nhật",
                            UserId = ESEIM.AppContext.UserId,
                            FromDevice = "Desktop/Laptop",
                            IdObject = "Header",
                            ChangeDetails = "trạng thái từ [" + currentGroup + "] sang [" + newGroup + "]",
                            CreatedTime = DateTime.Now
                        };
                        _context.ActInstanceUserActivitys.Add(action);
                    }
                    //End log change activity instance

                    check.Desc = data.Desc;
                    check.Duration = data.Duration;
                    check.Unit = data.Unit;
                    check.Group = data.Group;
                    check.Type = data.Type;
                    check.ShapeJson = data.ShapeJson;
                    check.Title = data.Title;
                    check.Located = data.Located;
                    check.Status = data.Status;
                    check.StartTime = startTime;
                    check.EndTime = endTime;
                    check.UpdatedBy = ESEIM.AppContext.UserName;
                    check.UpdatedTime = DateTime.Now;

                    _context.ActivityInstances.Update(check);

                    UpdateChangeActInst(check.ActivityInstCode);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_UPDATE_SUCCESS"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetAttachmentWfInstance(string wfInstCode)
        {
            var actInst = from a in _context.WorkflowInstances.Where(x => !x.IsDeleted.Value && x.WfInstCode.Equals(wfInstCode))
                          join b in _context.ActivityInstances.Where(x => !x.IsDeleted) on a.WfInstCode equals b.WorkflowCode
                          select new
                          {
                              b.ActivityInstCode,
                              b.Title
                          };

            var lstAttachment = new List<LstAttachmentWf>();
            if (actInst.Any())
            {
                foreach (var item in actInst)
                {
                    var data = ((from a in _context.ActivityInstFiles.Where(x => x.ActivityInstCode.Equals(item.ActivityInstCode) && !x.IsDeleted)
                                 select new LstAttachment
                                 {
                                     Id = a.ID,
                                     FileName = a.FileName,
                                     FileUrl = a.FilePath,
                                     MemberId = a.CreatedBy,
                                     FileCode = a.FileID,
                                     CreatedTime = a.CreatedTime.Value,
                                     Type = 1,
                                     Icon = "",
                                     Color = ""
                                 }).Union(
                    from a in _context.FilesShareObjectUsers.Where(x => !x.IsDeleted
                     && JsonConvert.DeserializeObject<ObjRelative>(x.ObjectRelative).ObjectType.Equals("ACT_INST")
                     && JsonConvert.DeserializeObject<ObjRelative>(x.ObjectRelative).ObjectInstance.Equals(item.ActivityInstCode))
                    select new LstAttachment
                    {
                        Id = a.ID,
                        FileName = a.FileName,
                        FileUrl = a.FileUrl,
                        MemberId = a.CreatedBy,
                        FileCode = a.FileID,
                        CreatedTime = a.CreatedTime,
                        Type = 2,
                        Icon = "",
                        Color = ""
                    })).ToList();

                    foreach (var file in data)
                    {
                        var extension = Path.GetExtension(file.FileUrl);
                        if (extension.Equals(".doc") || extension.Equals(".docx"))
                        {
                            file.Icon = "fa fa-file-word-o";
                            file.Color = "rgb(13,118,206);font-size: 15px;";
                        }
                        else if (extension.Equals(".xls") || extension.Equals(".xlsx"))
                        {
                            file.Icon = "fa fa-file-excel-o";
                            file.Color = "rgb(106,170,89);font-size: 15px;";
                        }
                        else if (extension.Equals(".pdf"))
                        {
                            file.Icon = "fa fa-file-pdf-o";
                            file.Color = "rgb(226,165,139);font-size: 15px;";
                        }
                        //'.JPG', '.PNG', '.TIF', '.TIFF'
                        else if (extension.ToUpper().Equals(".JPG") || extension.ToUpper().Equals(".PNG")
                            || extension.ToUpper().Equals(".TIF") || extension.ToUpper().Equals(".TIFF"))
                        {
                            file.Icon = "fa fa-picture-o";
                            file.Color = "rgb(42,42,42);font-size: 15px;";
                        }
                        else
                        {
                            file.Icon = "fa fa-file-o";
                            file.Color = "rgb(42,42,42);font-size: 15px;";
                        }
                    }

                    if (data.Any())
                    {
                        var attach = new LstAttachmentWf
                        {
                            ActivityInstCode = item.ActivityInstCode,
                            Title = item.Title,
                            LstAttachment = data
                        };

                        lstAttachment.Add(attach);
                    }
                }
            }
            return Json(lstAttachment);
        }

        [HttpPost]
        public JsonResult GetResultAttrData(string wfInstCode)
        {
            var query = (from a in _context.ActivityAttrDatas.Where(x => !x.IsDeleted && x.WorkFlowCode.Equals(wfInstCode))
                         join b in _context.AttrSetups.Where(x => !x.IsDeleted) on a.AttrCode equals b.AttrCode
                         join c in _context.ActivityInstances.Where(x => !x.IsDeleted) on a.ActCode equals c.ActivityInstCode
                         join d in _context.Users on a.CreatedBy equals d.UserName
                         select new
                         {
                             ActInstCode = a.ActCode,
                             Title = c.Title,
                             Value = a.Value,
                             a.AttrCode,
                             CreatedBy = d.GivenName,
                             CreatedTime = a.CreatedTime.Value.ToString("HH:mm dd/MM/yyyy"),
                             b.AttrName,
                             Unit = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(b.AttrUnit)).ValueSet,
                             AttrTypeData = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(b.AttrDataType)).ValueSet
                         }).OrderByDescending(x => x.ActInstCode);
            return Json(query);
        }

        [HttpPost]
        public JsonResult UpdateStatusActInst(string actInst, string status)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var listUser = new List<CardMemberCustom>();

                var inst = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == actInst);
                if (inst != null)
                {
                    //Log Status Activity Instance
                    var listLogStatus = new List<LogStatus>();
                    if (!string.IsNullOrEmpty(inst.JsonStatusLog))
                    {
                        listLogStatus = JsonConvert.DeserializeObject<List<LogStatus>>(inst.JsonStatusLog);
                    }
                    var log = new LogStatus
                    {
                        Status = status,
                        CreatedBy = ESEIM.AppContext.UserName,
                        CreatedTime = DateTime.Now,
                        Lock = false
                    };
                    listLogStatus.Add(log);
                    inst.JsonStatusLog = JsonConvert.SerializeObject(listLogStatus);
                    _context.ActivityInstances.Update(inst);
                    //End add log status Activity instance

                    var wfInfo = (from a in _context.WorkflowInstances.Where(x =>
                            !x.IsDeleted.Value && x.WfInstCode == inst.WorkflowCode)
                                  join b in _context.WorkFlows.Where(x => !x.IsDeleted.Value) on a.WorkflowCode equals b
                                      .WfCode
                                  select new
                                  {
                                      a.ObjectInst,
                                      b.WfName,
                                      a.ObjectType,
                                  }).FirstOrDefault();
                    if (!string.IsNullOrEmpty(wfInfo.ObjectInst) && !string.IsNullOrEmpty(wfInfo.ObjectType))
                    {
                        //AddLogStatus(wfInfo.ObjectType, wfInfo.ObjectInst, status, inst.Title);
                        _workflowService.AddLogStatusAll(wfInfo.ObjectType, wfInfo.ObjectInst, status, inst.Title, inst.Type, ESEIM.AppContext.UserName);
                    }

                    var assignInst = (_context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst == inst.ActivityInstCode)
                            .Select(x => new CardMemberCustom
                            {
                                Id = x.ID,
                                UserId = x.UserId,
                                Responsibility = x.Role,
                                CreatedTime = x.CreatedTime.ToString("HH:mm dd/MM/yyyy")
                            })).ToList();
                    listUser.AddRange(assignInst);

                    var acts = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(inst.WorkflowCode));
                    var checkSuccess = true;
                    checkSuccess = acts.Any(x => x.Type == "TYPE_ACTIVITY_END" && x.Status == "STATUS_ACTIVITY_END");
                    //foreach (var item in acts)
                    //{
                    //    if (item.Status != "STATUS_ACTIVITY_END" && item.Status != "STATUS_ACTIVITY_ACTIVE")
                    //    {
                    //        checkSuccess = false;
                    //        break;
                    //    }
                    //}
                    if (checkSuccess)
                    {
                        var wfInst = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.WfInstCode == inst.WorkflowCode);
                        if (wfInst != null)
                        {
                            wfInst.EndTime = DateTime.Now;
                            wfInst.Status = "STATUS_WF_SUCCESS";
                            _context.WorkflowInstances.Update(wfInst);
                        }
                    }
                    else
                    {
                        var wfInst = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.WfInstCode == inst.WorkflowCode);
                        if (wfInst != null && wfInst.Status == "STATUS_WF_SUCCESS")
                        {
                            wfInst.EndTime = null;
                            wfInst.Status = "STATUS_WF_PENDING";
                            _context.WorkflowInstances.Update(wfInst);
                        }
                    }
                    _context.SaveChanges();
                    //Send notify
                    var timer = (DateTime?)null;
                    if (inst.Unit == "DURATION_UNIT20200904094128")
                    {
                        timer = inst.StartTime.HasValue ? inst.StartTime.Value.AddDays(Convert.ToDouble(inst.Duration)) : (DateTime?)null;
                    }
                    if (inst.Unit == "DURATION_UNIT20200904094132")
                    {
                        timer = inst.StartTime.HasValue ? inst.StartTime.Value.AddHours(Convert.ToDouble(inst.Duration)) : (DateTime?)null;
                    }
                    if (inst.Unit == "DURATION_UNIT20200904094135")
                    {
                        timer = inst.StartTime.HasValue ? inst.StartTime.Value.AddMinutes(Convert.ToDouble(inst.Duration)) : (DateTime?)null;
                    }
                    if (inst.Unit == "DURATION_UNIT20200904094139")
                    {
                        timer = inst.StartTime.HasValue ? inst.StartTime.Value.AddSeconds(Convert.ToDouble(inst.Duration)) : (DateTime?)null;
                    }

                    var session = HttpContext.GetSessionUser();
                    var message = "Hoạt động " + inst.Title + " thuộc luồng " + wfInfo.WfName + " đã được cập nhật trạng thái bởi " + session.FullName;
                    SendPushNotification(listUser, message,
                        new
                        {
                            ActivityCode = inst.ActivityCode,
                            ActivityInstCode = inst.ActivityInstCode,
                            Desc = inst.Desc,
                            Duration = inst.Duration,
                            Group = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == inst.Group).ValueSet ?? "",
                            ID = inst.ID,
                            Located = inst.Located,
                            ObjCode = wfInfo != null ? wfInfo.ObjectInst : "",
                            StatusCode = inst.Status,
                            Timer = timer,
                            Title = inst.Title,
                            Type = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == inst.Type).ValueSet ?? "",
                            Unit = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == inst.Unit).ValueSet ?? "",
                            WorkflowCode = inst.WorkflowCode,
                            WfName = wfInfo != null ? wfInfo.WfName : ""
                        },
                        EnumHelper<FromSrcSendNotify>.GetDisplayValue(FromSrcSendNotify.FromActInst));
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpGet]
        public JsonResult GetLogStatusInst(string actCode)
        {
            var lstStatus = new List<LogStatus>();
            var inst = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted
                    && x.ActivityInstCode.Equals(actCode));
            if (inst != null)
            {
                if (!string.IsNullOrEmpty(inst.JsonStatusLog))
                {
                    lstStatus = JsonConvert.DeserializeObject<List<LogStatus>>(inst.JsonStatusLog);
                }
            }
            var data = (from a in lstStatus
                        join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet
                        join c in _context.Users on a.CreatedBy equals c.UserName
                        select new
                        {
                            Status = b.ValueSet,
                            CreatedBy = c.GivenName,
                            CreatedTime = a.CreatedTime.ToString("HH:mm dd/MM/yyyy")
                        });
            return Json(data);
        }

        [HttpGet]
        public JsonResult GetLogStatusOfWFInst(string wfCode)
        {
            var lstStatus = new List<LogStatus>();
            var list = _context.ActivityInstances.Where(x => !x.IsDeleted
                    && x.WorkflowCode.Equals(wfCode)).ToList();
            foreach(var inst in list)
            if (inst != null)
            {
                if (!string.IsNullOrEmpty(inst.JsonStatusLog))
                {
                      lstStatus.AddRange(JsonConvert.DeserializeObject<List<LogStatus>>(inst.JsonStatusLog));
                }
            }
            var data = (from a in lstStatus
                        join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet
                        join c in _context.Users on a.CreatedBy equals c.UserName
                        select new
                        {
                            Status = b.ValueSet,
                            CreatedBy = c.GivenName,
                            CreatedTime = a.CreatedTime.ToString("HH:mm dd/MM/yyyy")
                        });
            return Json(data);
        }
        //[NonAction]
        //private void AddLogStatus(string objType, string objInst, string status, string actName)
        //{
        //    /* 
        //    1.CONTRACT.Hợp đồng bán (v)
        //    2.CONTRACT_PO.Hợp đồng mua (v)
        //    3.PROJECT.Dự án/ đấu thầu  (v)

        //    3.REQUEST_IMPORT_PRODUCT.Y/C đặt hàng
        //    5.ASSET_INVENTORY.Kiểm kê tài sản
        //    6.ASSET_ALLOCATE.Cấp phát tài sản
        //    7.ASSET_BUY.Mua sắm tài sản
        //    8.ASSET_TRANSFER.Điều chuyển tài sản
        //    9.ASSET_LIQUIDATION.Thanh lý tài sản
        //    10.ASSET_RECALL.Thu hồi tài sản
        //    11.ASSET_RQ_REPAIR.Yêu cầu sửa chữa bảo dưỡng tài sản
        //    12.ASSET_MAINTENACE.Sửa chữa tài sản
        //    13.ASSET_IMPROVE.Bảo dưỡng tài sản
        //    14.ASSET_CANCEL.Hủy tài sản
        //    15.ASSET_RPT.Báo hỏng/mất tài sản

        //    16.FUND_ACC_ENTRY.Phiếu thu/chi
        //    17.IMPORT_STORE.Phiếu nhập
        //    18.EXPORT_STORE.Phiếu xuất

        //    19.NOT_WORK.Phiếu báo nghỉ
        //    20. Quyết định lương
        //    21. Quyết định điều động
        //    22. Quyết định chấm dứt
        //    23. Quyết định khen thưởng
        //    24. Quyết định kỷ luật
        //     */

        //    var common = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(status));

        //    var log = new JsonLog
        //    {
        //        Code = status,
        //        CreatedBy = ESEIM.AppContext.UserName,
        //        CreatedTime = DateTime.Now,
        //        Name = common != null ? common.ValueSet : "",
        //        ObjectRelative = actName

        //    };

        //    switch (objType)
        //    {
        //        case "RQ_IMPORT_PROD":
        //            var rqImpProd = _context.RequestImpProductHeaders.FirstOrDefault(x => !x.IsDeleted && x.ReqCode.Equals(objInst));
        //            if (rqImpProd != null)
        //            {
        //                var listJson = new List<JsonLog>();

        //                var listStatus = string.IsNullOrEmpty(rqImpProd.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(rqImpProd.Status);
        //                listStatus.Add(log);

        //                rqImpProd.Status = JsonConvert.SerializeObject(listStatus);

        //                _context.RequestImpProductHeaders.Update(rqImpProd);
        //            }
        //            break;

        //        case "PROJECT":
        //            var project = _context.Projects.FirstOrDefault(x => !x.FlagDeleted && x.ProjectCode.Equals(objInst));
        //            if (project != null)
        //            {
        //                var listJson = new List<JsonLog>();

        //                var listStatus = string.IsNullOrEmpty(project.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(project.Status);
        //                listStatus.Add(log);

        //                project.Status = JsonConvert.SerializeObject(listStatus);

        //                _context.Projects.Update(project);
        //            }
        //            break;

        //        case "CONTRACT":
        //            var saleHeader = _context.PoSaleHeaders.FirstOrDefault(x => !x.IsDeleted && x.ContractCode.Equals(objInst));
        //            if (saleHeader != null)
        //            {
        //                var listJson = new List<JsonLog>();

        //                var listStatus = string.IsNullOrEmpty(saleHeader.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(saleHeader.Status);
        //                listStatus.Add(log);

        //                saleHeader.Status = JsonConvert.SerializeObject(listStatus);

        //                _context.PoSaleHeaders.Update(saleHeader);
        //            }
        //            break;

        //        case "CONTRACT_PO":
        //            var buyerHeader = _context.PoBuyerHeaders.FirstOrDefault(x => !x.IsDeleted && x.PoSupCode.ToString().Equals(objInst));
        //            if (buyerHeader != null)
        //            {
        //                var listJson = new List<JsonLog>();

        //                var listStatus = string.IsNullOrEmpty(buyerHeader.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(buyerHeader.Status);
        //                listStatus.Add(log);

        //                buyerHeader.Status = JsonConvert.SerializeObject(listStatus);

        //                _context.PoBuyerHeaders.Update(buyerHeader);
        //            }
        //            break;

        //        case "ASSET_INVENTORY":
        //            var assetInvent = _context.AssetInventoryHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
        //            if (assetInvent != null)
        //            {
        //                var listJson = new List<JsonLog>();

        //                var listStatus = string.IsNullOrEmpty(assetInvent.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(assetInvent.Status);
        //                listStatus.Add(log);

        //                assetInvent.Status = JsonConvert.SerializeObject(listStatus);

        //                _context.AssetInventoryHeaders.Update(assetInvent);
        //            }
        //            break;

        //        case "ASSET_ALLOCATE":
        //            var assetAllo = _context.AssetAllocateHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
        //            if (assetAllo != null)
        //            {
        //                var listJson = new List<JsonLog>();

        //                var listStatus = string.IsNullOrEmpty(assetAllo.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(assetAllo.Status);
        //                listStatus.Add(log);

        //                assetAllo.Status = JsonConvert.SerializeObject(listStatus);

        //                _context.AssetAllocateHeaders.Update(assetAllo);
        //            }
        //            break;
        //        case "ASSET_BUY":
        //            var assetBuy = _context.AssetBuyHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
        //            if (assetBuy != null)
        //            {
        //                var listJson = new List<JsonLog>();

        //                var listStatus = string.IsNullOrEmpty(assetBuy.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(assetBuy.Status);
        //                listStatus.Add(log);

        //                assetBuy.Status = JsonConvert.SerializeObject(listStatus);

        //                _context.AssetBuyHeaders.Update(assetBuy);
        //            }
        //            break;
        //        case "ASSET_TRANSFER":
        //            var assetTrans = _context.AssetTransferHeaders.FirstOrDefault(x => !x.IsDeleted && x.Ticketcode.Equals(objInst));
        //            if (assetTrans != null)
        //            {
        //                var listJson = new List<JsonLog>();

        //                var listStatus = string.IsNullOrEmpty(assetTrans.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(assetTrans.Status);
        //                listStatus.Add(log);

        //                assetTrans.Status = JsonConvert.SerializeObject(listStatus);

        //                _context.AssetTransferHeaders.Update(assetTrans);
        //            }
        //            break;
        //        case "ASSET_LIQUIDATION":
        //            var assetLiqui = _context.AssetLiquidationHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
        //            if (assetLiqui != null)
        //            {
        //                var listJson = new List<JsonLog>();

        //                var listStatus = string.IsNullOrEmpty(assetLiqui.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(assetLiqui.Status);
        //                listStatus.Add(log);

        //                assetLiqui.Status = JsonConvert.SerializeObject(listStatus);

        //                _context.AssetLiquidationHeaders.Update(assetLiqui);
        //            }
        //            break;
        //        case "ASSET_RECALL":
        //            var assetRecall = _context.AssetRecalledHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
        //            if (assetRecall != null)
        //            {
        //                var listJson = new List<JsonLog>();

        //                var listStatus = string.IsNullOrEmpty(assetRecall.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(assetRecall.Status);
        //                listStatus.Add(log);

        //                assetRecall.Status = JsonConvert.SerializeObject(listStatus);

        //                _context.AssetRecalledHeaders.Update(assetRecall);
        //            }
        //            break;
        //        case "ASSET_RQ_REPAIR":
        //            var assetRq = _context.AssetRqMaintenanceRepairHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
        //            if (assetRq != null)
        //            {
        //                var listJson = new List<JsonLog>();

        //                var listStatus = string.IsNullOrEmpty(assetRq.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(assetRq.Status);
        //                listStatus.Add(log);

        //                assetRq.Status = JsonConvert.SerializeObject(listStatus);

        //                _context.AssetRqMaintenanceRepairHeaders.Update(assetRq);
        //            }
        //            break;
        //        case "ASSET_MAINTENANCE":
        //            var assetmaint = _context.AssetMaintenanceHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
        //            if (assetmaint != null)
        //            {
        //                var listJson = new List<JsonLog>();

        //                var listStatus = string.IsNullOrEmpty(assetmaint.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(assetmaint.Status);
        //                listStatus.Add(log);

        //                assetmaint.Status = JsonConvert.SerializeObject(listStatus);

        //                _context.AssetMaintenanceHeaders.Update(assetmaint);
        //            }
        //            break;
        //        case "ASSET_IMPROVE":
        //            var assetImpro = _context.AssetImprovementHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
        //            if (assetImpro != null)
        //            {
        //                var listJson = new List<JsonLog>();

        //                var listStatus = string.IsNullOrEmpty(assetImpro.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(assetImpro.Status);
        //                listStatus.Add(log);

        //                assetImpro.Status = JsonConvert.SerializeObject(listStatus);

        //                _context.AssetImprovementHeaders.Update(assetImpro);
        //            }
        //            break;
        //        case "ASSET_CANCEL":
        //            var assetCancel = _context.AssetCancelHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
        //            if (assetCancel != null)
        //            {
        //                var listJson = new List<JsonLog>();

        //                var listStatus = string.IsNullOrEmpty(assetCancel.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(assetCancel.Status);
        //                listStatus.Add(log);

        //                assetCancel.Status = JsonConvert.SerializeObject(listStatus);

        //                _context.AssetCancelHeaders.Update(assetCancel);
        //            }
        //            break;
        //        case "ASSET_RPT":
        //            var assetRpt = _context.AssetRPTBrokenHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
        //            if (assetRpt != null)
        //            {
        //                var listJson = new List<JsonLog>();

        //                var listStatus = string.IsNullOrEmpty(assetRpt.AssetStatus) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(assetRpt.AssetStatus);
        //                listStatus.Add(log);

        //                assetRpt.AssetStatus = JsonConvert.SerializeObject(listStatus);

        //                _context.AssetRPTBrokenHeaders.Update(assetRpt);
        //            }
        //            break;
        //        case "FUND_ACC_ENTRY":
        //            var accEntry = _context.FundAccEntrys.FirstOrDefault(x => !x.IsDeleted && x.AetCode.Equals(objInst));
        //            if (accEntry != null)
        //            {
        //                var listJson = new List<JsonLog>();
        //                var listStatus = string.IsNullOrEmpty(accEntry.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(accEntry.Status);
        //                listStatus.Add(log);
        //                accEntry.Status = JsonConvert.SerializeObject(listStatus);
        //                _context.FundAccEntrys.Update(accEntry);
        //            }
        //            break;
        //        case "IMPORT_STORE":
        //            var import = _context.ProdReceivedHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
        //            if (import != null)
        //            {
        //                var listJson = new List<JsonLog>();
        //                var listStatus = string.IsNullOrEmpty(import.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(import.Status);
        //                listStatus.Add(log);
        //                import.Status = JsonConvert.SerializeObject(listStatus);
        //                _context.ProdReceivedHeaders.Update(import);
        //            }
        //            break;
        //        case "EXPORT_STORE":
        //            var export = _context.ProdDeliveryHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
        //            if (export != null)
        //            {
        //                var listJson = new List<JsonLog>();
        //                var listStatus = string.IsNullOrEmpty(export.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(export.Status);
        //                listStatus.Add(log);
        //                export.Status = JsonConvert.SerializeObject(listStatus);
        //                _context.ProdDeliveryHeaders.Update(export);
        //            }
        //            break;
        //        case "NOT_WORK":
        //            var notWork = _context.WorkShiftCheckInOuts.FirstOrDefault(x => !x.IsDeleted && x.Id.ToString().Equals(objInst));
        //            if (notWork != null)
        //            {
        //                var listJson = new List<JsonLog>();
        //                var listStatus = string.IsNullOrEmpty(notWork.Status) ? new List<JsonLog>() : JsonConvert.DeserializeObject<List<JsonLog>>(notWork.Status);
        //                listStatus.Add(log);
        //                notWork.Status = JsonConvert.SerializeObject(listStatus);
        //                _context.WorkShiftCheckInOuts.Update(notWork);
        //            }
        //            break;

        //        case "PAY_DECISION":
        //            var payDecision = _context.PayDecisionHeaders.FirstOrDefault(x => !x.IsDeleted && x.DecisionNum.Equals(objInst));
        //            if (payDecision != null)
        //            {
        //                var listJson = new List<JsonLog>();
        //                if (!string.IsNullOrEmpty(payDecision.Status))
        //                {
        //                    listJson = JsonConvert.DeserializeObject<List<JsonLog>>(payDecision.Status);
        //                }

        //                listJson.Add(log);

        //                payDecision.Status = JsonConvert.SerializeObject(listJson);
        //                _context.PayDecisionHeaders.Update(payDecision);
        //            }
        //            break;

        //        case "DECISION_MOVEMENT":
        //            var moveDecision = _context.DecisionMovementHeaders.FirstOrDefault(x => !x.IsDeleted && x.DecisionNum.Equals(objInst));
        //            if (moveDecision != null)
        //            {
        //                var listJson = new List<JsonLog>();
        //                if (!string.IsNullOrEmpty(moveDecision.Status))
        //                {
        //                    listJson = JsonConvert.DeserializeObject<List<JsonLog>>(moveDecision.Status);
        //                }

        //                listJson.Add(log);

        //                moveDecision.Status = JsonConvert.SerializeObject(listJson);
        //                _context.DecisionMovementHeaders.Update(moveDecision);
        //            }
        //            break;

        //        case "DECISION_END_CONTRACT":
        //            var endContract = _context.StopContractHeaders.FirstOrDefault(x => !x.IsDeleted && x.DecisionNum.Equals(objInst));
        //            if (endContract != null)
        //            {
        //                var listJson = new List<JsonLog>();
        //                if (!string.IsNullOrEmpty(endContract.Status))
        //                {
        //                    listJson = JsonConvert.DeserializeObject<List<JsonLog>>(endContract.Status);
        //                }

        //                listJson.Add(log);

        //                endContract.Status = JsonConvert.SerializeObject(listJson);
        //                _context.StopContractHeaders.Update(endContract);
        //            }
        //            break;
        //        case "DISCIPLINE_DECISION":
        //            var disciplineDecision = _context.DecisionBonusDisciplineHeaders.FirstOrDefault(x => !x.IsDeleted && x.DecisionNum.Equals(objInst) && x.Type.Equals(EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.DisciplineDecision)));
        //            if (disciplineDecision != null)
        //            {
        //                var listJson = new List<JsonLog>();
        //                if (!string.IsNullOrEmpty(disciplineDecision.Status))
        //                {
        //                    listJson = JsonConvert.DeserializeObject<List<JsonLog>>(disciplineDecision.Status);
        //                }

        //                listJson.Add(log);

        //                disciplineDecision.Status = JsonConvert.SerializeObject(listJson);
        //                _context.DecisionBonusDisciplineHeaders.Update(disciplineDecision);
        //            }
        //            break;

        //        case "BONUS_DECISION":
        //            var bonusDecision = _context.DecisionBonusDisciplineHeaders.FirstOrDefault(x => !x.IsDeleted && x.DecisionNum.Equals(objInst) && x.Type.Equals(EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.BonusDecision)));
        //            if (bonusDecision != null)
        //            {
        //                var listJson = new List<JsonLog>();
        //                if (!string.IsNullOrEmpty(bonusDecision.Status))
        //                {
        //                    listJson = JsonConvert.DeserializeObject<List<JsonLog>>(bonusDecision.Status);
        //                }

        //                listJson.Add(log);

        //                bonusDecision.Status = JsonConvert.SerializeObject(listJson);
        //                _context.DecisionBonusDisciplineHeaders.Update(bonusDecision);
        //            }
        //            break;
        //    }
        //}

        [HttpPost]
        public object UpdatePayDecision(string code)
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

        [HttpPost]
        public object UpdateEndContract(string code)
        {
            var msg = new JMessage { Title = "", Error = false };
            try
            {
                var data = _context.StopContractHeaders.FirstOrDefault(x => !x.IsDeleted && x.DecisionNum.Equals(code));
                if (data != null)
                {
                    var detail = _context.StopContractDetails.Where(x => !x.IsDeleted && x.DecisionNum.Equals(data.DecisionNum));
                    if (detail != null)
                    {
                        foreach (var item in detail)
                        {
                            var user = _context.HREmployees.FirstOrDefault(x => x.flag == 1 && x.employee_code.Equals(item.EmployeeCode));
                            if (user != null)
                            {
                                user.status = "END_CONTRACT";
                                var logStatus = new JsonLog
                                {
                                    Code = user.status,
                                    Name = _context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals(user.status)) != null ? _context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals(user.status)).ValueSet : "",
                                    CreatedBy = _context.Users.FirstOrDefault(x => x.UserName.Equals(ESEIM.AppContext.UserName)).GivenName,
                                    ObjectRelative = item.DecisionNum,
                                    ObjectType = EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.DecisionEndContract),
                                    CreatedTime = DateTime.Now,
                                };
                                user.ListStatus.Add(logStatus);

                                var employeeStatusTracking = new EmployeeStatusTracking
                                {
                                    EmployeeCode = user.employee_code,
                                    StatusCode = logStatus.Code,
                                    StartTime = DateTime.Now.Date,
                                    ObjectType = logStatus.ObjectType,
                                    ObjectRelative = item.DecisionNum,
                                };
                                _context.EmployeeStatusTrackings.Add(employeeStatusTracking);
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

        [HttpPost]
        public object UpdateMobiDecision(string code)
        {
            var msg = new JMessage { Title = "", Error = false };
            try
            {
                var data = from a in _context.DecisionMovementDetails.Where(x => !x.IsDeleted && x.DecisionNum.Equals(code))
                           join b in _context.HREmployees.Where(x => x.flag == 1) on a.EmployeesCode equals b.employee_code
                           select new { b, a };
                foreach (var emp in data)
                {
                    emp.b.status = "MOBILIZATION";
                    emp.b.payScale = emp.a.PayScaleCode;
                    emp.b.payRange = emp.a.PayRanges.ToString();
                    emp.b.salary = emp.a.Salary;
                    emp.b.position = emp.a.NewRole;
                    _context.HREmployees.Update(emp.b);
                    var logStatus = new JsonLog
                    {
                        Code = emp.b.status,
                        Name = _context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals(emp.b.status))?.ValueSet,
                        ObjectRelative = emp.a.DecisionNum,
                        ObjectType = EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.DecisionMovement),
                        CreatedBy = _context.Users.FirstOrDefault(x => x.UserName.Equals(ESEIM.AppContext.UserName)).GivenName,
                        CreatedTime = DateTime.Now,
                    };
                    emp.b.ListStatus.Add(logStatus);
                    var logPayScale = new JsonLog
                    {
                        Code = emp.b.payScale,
                        Name = emp.b.payScale,
                        CreatedBy = _context.Users.FirstOrDefault(x => x.UserName.Equals(ESEIM.AppContext.UserName)).GivenName,
                        ObjectRelative = emp.a.DecisionNum,
                        ObjectType = EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.DecisionMovement),
                        CreatedTime = DateTime.Now,
                    };
                    emp.b.ListPayScale.Add(logPayScale);
                    var logPayRange = new JsonLog
                    {
                        Code = emp.b.payRange,
                        Name = emp.b.payRange,
                        CreatedBy = _context.Users.FirstOrDefault(x => x.UserName.Equals(ESEIM.AppContext.UserName)).GivenName,
                        ObjectRelative = emp.a.DecisionNum,
                        ObjectType = EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.DecisionMovement),
                        CreatedTime = DateTime.Now,
                    };
                    emp.b.ListPayRange.Add(logPayRange);
                    var employeeStatusTracking = new EmployeeStatusTracking
                    {
                        EmployeeCode = emp.b.employee_code,
                        StatusCode = logStatus.Code,
                        StartTime = emp.a.FromTime,
                        EndTime = emp.a.ToTime,
                        ObjectType = logStatus.ObjectType,
                    };
                    var logDepartment = new JsonLog
                    {
                        Code = emp.a.NewDepartCode,
                        Name = _context.AdDepartments.FirstOrDefault(x => x.DepartmentCode.Equals(emp.a.NewDepartCode)).Title,
                        CreatedBy = _context.Users.FirstOrDefault(x => x.UserName.Equals(ESEIM.AppContext.UserName)).GivenName,
                        ObjectRelative = emp.a.DecisionNum,
                        ObjectType = EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.DecisionMovement),
                        CreatedTime = DateTime.Now,
                    };
                    emp.b.ListDepartment.Add(logDepartment);
                    var logPosition = new JsonLog
                    {
                        Code = emp.a.NewRole,
                        Name = _context.Roles.FirstOrDefault(x => x.Id.Equals(emp.a.NewRole)).Title,
                        CreatedBy = _context.Users.FirstOrDefault(x => x.UserName.Equals(ESEIM.AppContext.UserName)).GivenName,
                        ObjectRelative = emp.a.DecisionNum,
                        ObjectType = EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.DecisionMovement),
                        CreatedTime = DateTime.Now,
                    };
                    emp.b.ListPosition.Add(logPosition);
                    _context.EmployeeStatusTrackings.Add(employeeStatusTracking);
                    _context.HREmployees.Update(emp.b);
                }

                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Cập nhật thất bại !";
            }

            return msg;
        }

        [HttpPost]
        public JsonResult GetCardOfWf(string wfInst)
        {
            var data = from a in _context.WfActivityObjectProccessings.Where(x => !x.IsDeleted && x.WfInstCode.Equals(wfInst)
                       && x.ObjectType.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.TypeInstCard)))
                       join b in _context.WORKOSCards.Where(x => !x.IsDeleted) on a.ObjectInst equals b.CardCode
                       join c in _context.ActivityInstances.Where(x => !x.IsDeleted) on a.ActInstCode equals c.ActivityInstCode
                       join d in _context.CommonSettings.Where(x => !x.IsDeleted) on b.Status equals d.CodeSet into d1
                       from d in d1.DefaultIfEmpty()
                       select new
                       {
                           b.CardCode,
                           b.CardName,
                           c.Title,
                           Status = d != null ? d.ValueSet : ""
                       };
            return Json(data);
        }

        [AllowAnonymous]
        [HttpPost]
        public object JTableFileVersion([FromBody] JtableFileVersion jTablePara)
        {
            var session = HttpContext.GetSessionUser();

            int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;

            var lstActInstCode = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode == jTablePara.ObjCode)
                                                           .Select(x => x.ActivityInstCode).ToList();
            var query = from a in _context.FileVersions.Where(x => !x.IsDeleted)
                            //join b in _context.ActivityInstFiles.Where(x => !x.IsDeleted) on a.FileCode equals b.FileID
                        join c in _context.Users.Where(x => x.Active) on a.CreatedBy equals c.UserName
                        where a.ObjType.Equals(jTablePara.ObjType) && lstActInstCode.Any(x => x == a.ObjCode)
                        select new
                        {
                            a.ID,
                            FileID = a.FileCode,
                            FileName = Path.GetFileName(a.Url),
                            a.Url,
                            a.Version,
                            CreatedBy = c.GivenName,
                            CreatedTime = a.CreatedTime.Value.ToString("hh:mm dd/MM/yyyy"),
                            FileSize = "",
                            FileType = ""
                        };
            var count = query.Count();
            var data = query.OrderUsingSortExpression(jTablePara.QueryOrderBy).Skip(intBeginFor).Take(jTablePara.Length).AsNoTracking().ToList();
            var jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, count, "ID", "FileID", "FileName", "Url", "Version", "CreatedBy", "CreatedTime", "FileSize", "FileType");
            return Json(jdata);
        }

        [HttpPost]
        public JsonResult GetFileWfInst(string wfInstCode,string ActInsCode)
        {
            var listFile = (from act in _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(wfInstCode))
                            join repoCat in _context.EDMSRepoCatFiles.Where(x => x.ObjectType == EnumHelper<ActivityInst>.GetDisplayValue(ActivityInst.ActivityInst)) on act.ActivityInstCode equals repoCat.ObjectCode
                            join file in _context.EDMSFiles.Where(x => !x.IsDeleted && (x.IsFileMaster == true || x.IsFileMaster == null)) on repoCat.FileCode equals file.FileCode
                            join repo in _context.EDMSRepositorys on repoCat.ReposCode equals repo.ReposCode into repo1
                            from repo in repo1.DefaultIfEmpty()
                            where (string.IsNullOrEmpty(ActInsCode)||act.ActivityInstCode==ActInsCode)
                            select new
                            {
                                FileCode = file.FileCode,
                                FileName = file.FileName,
                                Type = "NO_SHARE",
                                ActName = act.Title,
                                FileTypePhysic = file.FileTypePhysic,
                                Id = repoCat.Id,
                                CloudFileId = file.CloudFileId
                            }).Union(
                                        from fileShare in _context.FilesShareObjectUsers.Where(x => !x.IsDeleted)
                                        join repoCat in _context.EDMSRepoCatFiles on fileShare.FileID equals repoCat.FileCode
                                        join file in _context.EDMSFiles.Where(x => !x.IsDeleted && (x.IsFileMaster == true || x.IsFileMaster == null)) on repoCat.FileCode equals file.FileCode
                                        join f in _context.EDMSRepositorys on file.ReposCode equals f.ReposCode into f1
                                        from f in f1.DefaultIfEmpty()
                                        let rela = JsonConvert.DeserializeObject<ObjRelative>(fileShare.ObjectRelative)
                                        join act in _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(wfInstCode)) on rela.ObjectInstance equals act.ActivityInstCode
                                        where rela.ObjectType.Equals("ACT_INST") && act.ActivityInstCode.Equals(rela.ObjectInstance) &&
                                            (string.IsNullOrEmpty(ActInsCode) || act.ActivityInstCode == ActInsCode)
                                        select new
                                        {
                                            FileCode = file.FileCode,
                                            FileName = file.FileName,
                                            Type = "SHARE",
                                            ActName = act.Title,
                                            FileTypePhysic = file.FileTypePhysic,
                                            Id = repoCat.Id,
                                            CloudFileId = file.CloudFileId
                                        });
            return Json(listFile);
        }

        public class ActInstInfo
        {
            public string ActInstCode { get; set; }
        }
        public class StatiscalWfGroup
        {
            public string Code { get; set; }
            public string Name { get; set; }
            public int CountPending { get; set; }
            public int Total { get; set; }
        }
        public class DataAtt
        {
            public string ActCode { get; set; }
            public string AttrGroup { get; set; }
            public List<DataAttrWf> DataAttrWf { get; set; }
        }
        public class DataAttrWf
        {
            public string ActCode { get; set; }
            public string AttrCode { get; set; }
            public string AttrName { get; set; }
            public string AttrGroup { get; set; }
            public string AttrNote { get; set; }
            public string AttrDataType { get; set; }
            public string AttrUnit { get; set; }
            public string SessionId { get; set; }
            public string Value { get; set; }
        }
        public class ShareFileDefault
        {
            public string Code { get; set; }
            public string Name { get; set; }
            public string DepartmentName { get; set; }
            public PermissionFile Permission { get; set; }
        }
        public class ModelWfInst
        {
            public string Code { get; set; }
            public string WfName { get; set; }
            public string CreatedBy { get; set; }
            public string CreatedTime { get; set; }
            public string ObjName { get; set; }
            public string ObjType { get; set; }
            public string ObjCode { get; set; }
            public DateTime TimeCreated { get; set; }
            public bool IsSuccess { get; set; }
            public bool IsSelected { get; set; }
        }
        public class SettingWf
        {
            public string ActSrc { get; set; }
            public string ActDes { get; set; }
            public string Command { get; set; }
            public string TransCode { get; set; }
        }
        public class LstAttachmentWf
        {
            public LstAttachmentWf()
            {
                LstAttachment = new List<LstAttachment>();
            }
            public string ActivityInstCode { get; set; }
            public string Title { get; set; }
            public List<LstAttachment> LstAttachment { get; set; }
        }
        public class LstActInst
        {
            public int ID { get; set; }
            public string Title { get; set; }
            public string Status { get; set; }
            public string Timer { get; set; }
            public string ObjCode { get; set; }
            public string ActInstCode { get; set; }
            public bool IsRela { get; set; }
            public bool IsLock { get; set; }
            public bool IsSelected { get; set; }
            public string AttachFile { get; set; }
        }
        public class JtableFileVersion : JTableModel
        {
            public string ObjCode { get; set; }
            public string ObjType { get; set; }
        }
        public class JtableWfInstance : JTableModel
        {
            public string FromDate { get; set; }
            public string ToDate { get; set; }
            public string Status { get; set; }
            public string UserId { get; set; }
            public string Workflow { get; set; }
            public string WfGroup { get; set; }
            public string WfInstName { get; set; }
        }
        public class ModelGridWf
        {
            public int Id { get; set; }
            public string WfName { get; set; }
            public string WfCode { get; set; }
            public string Status { get; set; }
            public string ObjectCode { get; set; }
            public string ObjectType { get; set; }
            public DateTime CreatedTime { get; set; }
            public List<ActGrid> ListAct { get; set; }
            public List<CardGrid> ListCard { get; set; }
            public List<FileGrid> ListFile { get; set; }
        }
        public class CardGrid
        {
            public string CardCode { get; set; }
            public string CardName { get; set; }
            public string Status { get; set; }
        }
        public class FileGrid
        {
            public string FileName { get; set; }
            public string Type { get; set; }
            public string FileCode { get; set; }
            public string ActivityInstCode { get; set; }
        }
        public class CreatorManager
        {
            public string UserId { get; set; }
            public string BranchId { get; set; }
            public string DepartmentId { get; set; }
        }
        public class LogStatus
        {
            public string Status { get; set; }
            public string CreatedBy { get; set; }
            public bool Lock { get; set; }
            public DateTime CreatedTime
            {
                get
                {
                    return !String.IsNullOrEmpty(sCreatedTime) ? DateTime.ParseExact(sCreatedTime, "HH:mm dd/MM/yyyy", CultureInfo.InvariantCulture) : new DateTime();
                }
                set
                {
                    sCreatedTime = value.ToString("HH:mm dd/MM/yyyy");
                }
            }
            public string sCreatedTime { get; set; }
        }
        #endregion

        #region Attr data
        [HttpPost]
        public JsonResult GetAttrData([FromBody] AttrDataModel jTablepara)
        {
            var query = (from a in _context.AttrSetups.Where(x => !x.IsDeleted)
                         where a.ActCode.Equals(jTablepara.ActCode)
                         select new
                         {
                             a.ID,
                             a.AttrCode,
                             Value = "",
                             a.AttrName,
                             Unit = a.AttrUnit,
                             AttrTypeData = a.AttrDataType
                         });
            return Json(query);
        }

        [HttpPost]
        public JsonResult GetLstResultAttrData([FromBody] AttrDataModel data)
        {
            var query = (from a in _context.ActivityAttrDatas.Where(x => !x.IsDeleted && x.WorkFlowCode.Equals(data.WfCode))
                         join b in _context.AttrSetups.Where(x => !x.IsDeleted) on a.AttrCode equals b.AttrCode
                         join c in _context.Users on a.CreatedBy equals c.UserName
                         where a.ActCode.Equals(data.ActCode)
                         select new
                         {
                             Value = a.Value,
                             a.AttrCode,
                             CreatedBy = c.GivenName,
                             a.CreatedTime,
                             b.AttrName,
                             Unit = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(b.AttrUnit)).ValueSet,
                             AttrTypeData = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(b.AttrDataType)).ValueSet
                         }).GroupBy(x => x.CreatedBy);

            var lstResult = new List<AttrData>();
            var index = 0;
            foreach (var item in query)
            {
                foreach (var i in item)
                {
                    var attrData = new AttrData();
                    attrData.AttrCode = i.AttrCode;
                    attrData.AttrName = i.AttrName;
                    attrData.Value = i.Value;
                    attrData.CreatedBy = i.CreatedBy;
                    attrData.Unit = i.Unit;
                    attrData.CreatedTime = i.CreatedTime.Value.ToString("HH:mm dd/MM/yyyy");
                    attrData.Background = index % 2 == 0 ? "aliceblue" : "white";
                    lstResult.Add(attrData);
                }
                index++;
            }
            return Json(lstResult);
        }

        [HttpPost]
        public object InsertAttrData([FromBody] ModelDataLoggerAttrAct data)
        {
            var msg = new JMessage() { Error = false, Title = "" };
            try
            {
                var date = DateTime.Now.ToString("ddMMyyyy_hhmmss");

                var countAttrVal = data.ListAttrMore.Count(x => !string.IsNullOrEmpty(x.Value));
                var countStandardVal = data.ListAttrStandard.Count(x => !string.IsNullOrEmpty(x.Value));

                if (countAttrVal == 0 && countStandardVal == 0)
                {
                    msg.Error = true;
                    msg.Title = "Không có thuộc tính";
                    return msg;
                };

                foreach (var obj in data.ListAttrStandard)
                {
                    if (!string.IsNullOrEmpty(obj.Value))
                    {
                        if (obj.IsTypeFile)
                        {
                            var actAttrData = new ActivityAttrData()
                            {
                                AttrCode = obj.AttrCode,
                                ObjCode = obj.ObjCode,
                                WorkFlowCode = obj.WorkFlowCode,
                                ActCode = obj.ActCode,
                                Value = obj.FileName,
                                Note = "",
                                CreatedBy = ESEIM.AppContext.UserName,
                                CreatedTime = DateTime.Now,
                                SessionId = string.Format("{0}_{1}", date, ESEIM.AppContext.UserName),
                                FilePath = obj.FilePath
                            };
                            _context.ActivityAttrDatas.Add(actAttrData);
                        }
                        else
                        {
                            var actAttrData = new ActivityAttrData()
                            {
                                AttrCode = obj.AttrCode,
                                ObjCode = obj.ObjCode,
                                WorkFlowCode = obj.WorkFlowCode,
                                ActCode = obj.ActCode,
                                Value = obj.Value,
                                Note = "",
                                CreatedBy = ESEIM.AppContext.UserName,
                                CreatedTime = DateTime.Now,
                                SessionId = string.Format("{0}_{1}", date, ESEIM.AppContext.UserName),
                                FilePath = ""
                            };
                            _context.ActivityAttrDatas.Add(actAttrData);
                        }
                    }
                }

                foreach (var item in data.ListAttrMore)
                {
                    if (!string.IsNullOrEmpty(item.AttrGroup) && !string.IsNullOrEmpty(item.AttrName)
                        && !string.IsNullOrEmpty(item.Value))
                    {
                        var attrSetUp = new AttrSetup
                        {
                            AttrName = item.AttrName,
                            AttrGroup = item.AttrGroup,
                            ActCode = item.ActCode,
                            AttrUnit = item.AttrUnit,
                            CreatedBy = ESEIM.AppContext.UserName,
                            CreatedTime = DateTime.Now,
                            AttrCode = Guid.NewGuid().ToString()
                        };
                        _context.AttrSetups.Add(attrSetUp);

                        var actAttrData = new ActivityAttrData()
                        {
                            AttrCode = attrSetUp.AttrCode,
                            ObjCode = "",
                            WorkFlowCode = item.WfCode,
                            ActCode = item.ActInstCode,
                            Value = item.Value,
                            Note = "",
                            CreatedBy = ESEIM.AppContext.UserName,
                            CreatedTime = DateTime.Now,
                            SessionId = string.Format("{0}_{1}", date, attrSetUp.CreatedBy),
                            FilePath = ""
                        };
                        _context.ActivityAttrDatas.Add(actAttrData);
                    }
                }

                _context.SaveChanges();
                msg.Title = _stringLocalizer["WFAI_MSG_SAVE_RESULT_SUCCESS"];
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult GetAttrByGroup(string attrGroup, string actCode)
        {
            var data = from a in _context.AttrSetups.Where(x => !x.IsDeleted && x.AttrGroup == attrGroup && x.ActCode == actCode)
                       join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.AttrUnit equals b.CodeSet into b1
                       from b in b1.DefaultIfEmpty()
                       join c in _context.CommonSettings.Where(x => !x.IsDeleted) on a.AttrDataType equals c.CodeSet into c1
                       from c2 in b1.DefaultIfEmpty()
                       let user = _context.Users.FirstOrDefault(x => x.Active && x.UserName.Equals(User.Identity.Name))
                       select new
                       {
                           ID = 0,
                           Code = a.AttrCode,
                           Name = a.AttrName,
                           Unit = b != null ? b.ValueSet : "",
                           Type = c2 != null ? c2.ValueSet : "",
                           Group = a.AttrGroup,
                           GroupNote = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.Group == attrGroup).GroupNote,
                           CreatedBy = user != null ? user.GivenName : "",
                           CreatedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy"),
                           IsTypeFile = a.AttrDataType == "ATTR_DATA_TYPE_FILE" ? true : false
                       };
            return Json(data);
        }

        [HttpPost]
        public JsonResult GetAttrDataLogger([FromBody] ModelDataLogger obj)
        {
            var random = new Random();
            var groupSession = _context.ActivityAttrDatas.Where(x => !x.IsDeleted && x.ActCode == obj.ActInstCode).GroupBy(x => x.SessionId).Select(p => new
            SessionLogger
            {
                SessionId = p.Key,
                Color = "",
                Index = 0
            }).ToList();

            var index = 1;
            foreach (var item in groupSession)
            {
                item.Index = index;
                item.Color = index % 2 == 0 ? "" : "#eceeef";
                index++;
            }

            var data = (from a in _context.ActivityAttrDatas.Where(x => !x.IsDeleted && x.ActCode == obj.ActInstCode)
                        join c in _context.Users on a.CreatedBy equals c.UserName
                        join e in _context.AttrSetups.Where(x => !x.IsDeleted) on a.AttrCode equals e.AttrCode
                        join d in groupSession on a.SessionId equals d.SessionId
                        orderby d.Index
                        select new DataLoggerCardModel
                        {
                            ID = a.ID,
                            Code = a.AttrCode,
                            Title = e.AttrName,
                            Value = a.Value,
                            Unit = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == e.AttrUnit).ValueSet ?? "",
                            CreatedBy = c.GivenName,
                            CreatedTime = a.CreatedTime.Value.ToString("HH:mm dd/MM/yyyy"),
                            DataTypeAttr = e.AttrDataType,
                            SessionId = a.SessionId,
                            Color = d.Color,
                            IsTypeFile = e.AttrDataType == "ATTR_DATA_TYPE_FILE" ? true : false,
                            FilePath = !string.IsNullOrEmpty(a.FilePath) ? a.FilePath : "",
                            Group = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(e.AttrGroup)).ValueSet ?? ""
                        }).OrderByDescending(x => x.ID).GroupBy(x => x.SessionId).Select(x => x.DistinctBy(y => y.ID)).ToList();
            return Json(data);
        }

        [HttpPost]
        public JsonResult DeleteAttrDataLogger(string sessionId)
        {
            var msg = new JMessage();
            try
            {
                var data = _context.ActivityAttrDatas.Where(x => !x.IsDeleted && x.SessionId == sessionId);
                if (!data.Any(x => x.CreatedBy.Equals(ESEIM.AppContext.UserName)))
                {
                    msg.Error = true;
                    msg.Title = "Bạn không có quyền xóa";
                    return Json(msg);
                }
                if (data.Any())
                {
                    foreach (var item in data)
                    {
                        item.IsDeleted = true;
                        item.DeletedBy = ESEIM.AppContext.UserName;
                        item.DeletedTime = DateTime.Now;
                        _context.ActivityAttrDatas.Update(item);
                    }
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_DELETE_SUCCESS"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public object GetListUser()
        {
            JMessage msg = new JMessage { Error = false };
            try
            {
                msg.Object = _context.Users.Where(x => x.Active == true)
                    .Select(x => new { x.GivenName, x.UserName });
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        public class ModelDataLoggerAttrAct
        {
            public ModelDataLoggerAttrAct()
            {
                ListAttrStandard = new List<ActivityAttrDataModel>();
                ListAttrMore = new List<NewAttrData>();
            }
            public List<ActivityAttrDataModel> ListAttrStandard { get; set; }
            public List<NewAttrData> ListAttrMore { get; set; }
        }

        public class NewAttrData
        {
            public int Id { get; set; }
            public string AttrUnit { get; set; }
            public string AttrGroup { get; set; }
            public string AttrName { get; set; }
            public string Value { get; set; }
            public string ActCode { get; set; }
            public string WfCode { get; set; }
            public string ActInstCode { get; set; }
        }
        public class DataLoggerCardModel
        {
            public int ID { get; set; }
            public string Code { get; set; }
            public string Title { get; set; }
            public string Value { get; set; }
            public string Unit { get; set; }
            public string CreatedBy { get; set; }
            public string CreatedTime { get; set; }
            public string DataTypeAttr { get; set; }
            public FileAttr FileAttr { get; set; }
            public string SessionId { get; set; }
            public string Color { get; set; }
            public bool IsTypeFile { get; set; }
            public string FilePath { get; set; }
            public string Group { get; set; }
        }
        public class FileAttr
        {
            public string FileName { get; set; }
            public string FileUrl { get; set; }
            public string AttrCode { get; set; }
        }
        public class SessionLogger
        {
            public string Color { get; set; }
            public string SessionId { get; set; }
            public int Index { get; set; }
        }
        public class AttrDataModel : JTableModel
        {
            public string ObjectCode { get; set; }
            public string ActCode { get; set; }
            public string WfCode { get; set; }
        }
        public class ActivityAttrDataModel
        {
            public string ObjCode { get; set; }
            public string WorkFlowCode { get; set; }
            public string ActCode { get; set; }
            public string Value { get; set; }
            public string AttrCode { get; set; }
            public string UserName { get; set; }
            public bool IsTypeFile { get; set; }
            public string FilePath { get; set; }
            public string FileName { get; set; }
        }
        public class AttrData
        {
            public int ID { get; set; }
            public string AttrCode { get; set; }
            public string Value { get; set; }
            public string AttrName { get; set; }
            public string Unit { get; set; }
            public string CreatedBy { get; set; }
            public string CreatedTime { get; set; }
            public string Background { get; set; }
        }
        public class ModelDataLogger
        {
            public string ActInstCode { get; set; }
        }
        #endregion

        #region Object instance
        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetObjTypeJC()
        {
            var data = _context.JcObjectTypes.Where(x => !x.IsDeleted).Select(x => new { Code = x.ObjTypeCode, Name = x.ObjTypeName });
            return Json(data);
        }

        [NonAction]
        public string GetObjectRelative(string objCode, string objType)
        {
            var data = _context.JcObjectTypes.FirstOrDefault(x => !x.IsDeleted && x.ObjTypeCode == objType);
            if (data != null)
            {
                List<ObjTempRela> listTemp = new List<ObjTempRela>();

                using (var command = _context.Database.GetDbConnection().CreateCommand())
                {
                    _context.Database.OpenConnection();
                    command.CommandText = data.ScriptSQL;
                    using (var result = command.ExecuteReader())
                    {
                        while (result.Read())
                        {
                            if (result != null)
                            {
                                if (data.ObjTypeCode == "CONTRACT_PO")
                                {
                                    if (!result.IsDBNull(4) && !result.IsDBNull(3))
                                    {
                                        var objTemp = new ObjTempRela
                                        {
                                            ID = result.GetInt32(0),
                                            Code = result.GetString(4),
                                            Name = result.GetString(3)
                                        };
                                        if (objTemp != null)
                                        {
                                            listTemp.Add(objTemp);
                                        }
                                    }
                                }

                                else if (data.ObjTypeCode == "NOT_WORK" || data.ObjTypeCode == "GOLATE" || data.ObjTypeCode == "QUITWORK" || data.ObjTypeCode == "PLAN_SCHEDULE" || data.ObjTypeCode == "OVERTIME")
                                {
                                    if (!result.IsDBNull(1) && !result.IsDBNull(8))
                                    {
                                        var user = _context.Users.FirstOrDefault(x => x.Id.Equals(result.GetString(8)));
                                        var objTemp = new ObjTempRela
                                        {
                                            ID = result.GetInt32(0),
                                            Code = result.GetString(1),
                                            Name = user != null ? user.GivenName + " báo nghỉ" : ""
                                        };
                                        if (objTemp != null)
                                        {
                                            listTemp.Add(objTemp);
                                        }
                                    }
                                }

                                else
                                {
                                    if (!result.IsDBNull(1) && !result.IsDBNull(2))
                                    {
                                        var objTemp = new ObjTempRela
                                        {
                                            ID = result.GetInt32(0),
                                            Code = result.GetString(1),
                                            Name = result.GetString(2)
                                        };
                                        if (objTemp != null)
                                        {
                                            listTemp.Add(objTemp);
                                        }
                                    }
                                }

                            }

                        }
                    }
                    _context.Database.CloseConnection();
                }
                var name = listTemp.FirstOrDefault(x => x.Code == objCode) != null ? listTemp.FirstOrDefault(x => x.Code == objCode).Name : "";
                return name;
            }
            else
            {
                return "";
            }
        }

        [HttpPost]
        public JsonResult InsertObjectProcess([FromBody] WfActivityObjectProccessing data)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var process = _context.WfActivityObjectProccessings.FirstOrDefault(x => !x.IsDeleted && x.ObjectType == data.ObjectType
                    && x.ObjectInst == data.ObjectInst && x.WfInstCode != data.WfInstCode);
                if (process != null)
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["WFAI_MSG_OBJ_EXIST_IN_OTHER_WF"];
                    return Json(msg);
                }
                var checkActInst = _context.WfActivityObjectProccessings.FirstOrDefault(x => !x.IsDeleted && x.ObjectType == data.ObjectType
                    && x.ObjectInst == data.ObjectInst && x.ActInstCode.Equals(data.ActInstCode));
                if (checkActInst != null)
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["WFAI_MSG_OBJECT_EXIST"];
                    return Json(msg);
                }
                var objProcess = new WfActivityObjectProccessing
                {
                    ActInstCode = data.ActInstCode,
                    WfInstCode = data.WfInstCode,
                    ObjectInst = data.ObjectInst,
                    ObjectType = data.ObjectType,
                    ObjEntry = false,
                    CreatedBy = ESEIM.AppContext.UserName,
                    CreatedTime = DateTime.Now
                };
                _context.WfActivityObjectProccessings.Add(objProcess);

                //Real-time
                UpdateChangeActInst(data.ActInstCode);

                _context.SaveChanges();
                if (objProcess.ObjectType != "CARD_JOB")
                {
                    msg.Title = _sharedResources["COM_ADD_SUCCESS"];
                }
                else
                {
                    msg.Title = _sharedResources["COM_UPDATE_SUCCESS"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult GetObjectProcess(string actInstCode)
        {
            var data = _context.WfActivityObjectProccessings.Where(x => !x.IsDeleted && x.ActInstCode == actInstCode);
            var lst = new List<ObjectProcessModel>();
            if (data.Any())
            {
                foreach (var item in data)
                {
                    switch (item.ObjectType)
                    {
                        case "CONTRACT":
                            var contract = (from a in _context.PoSaleHeaders.Where(x => !x.IsDeleted && x.ContractCode == item.ObjectInst)
                                            join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                            from b in b1.DefaultIfEmpty()
                                            select new ObjectProcessModel
                                            {
                                                Id = item.ID,
                                                Beshare = item.Beshare,
                                                CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                Status = b != null ? b.ValueSet : "",
                                                ObjectCode = item.ObjectInst,
                                                ObjectName = a.Title,
                                                CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                ObjEntry = item.ObjEntry,
                                                ObjType = item.ObjectType,
                                                ObjTypeText = "Hợp đồng",
                                                IsCheck = false,
                                                ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                            }).FirstOrDefault();
                            lst.Add(contract);
                            break;

                        case "PROJECT":
                            var project = (from a in _context.Projects.Where(x => !x.FlagDeleted && x.ProjectCode == item.ObjectInst)
                                           join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                           from b in b1.DefaultIfEmpty()
                                           select new ObjectProcessModel
                                           {
                                               Id = item.ID,
                                               Beshare = item.Beshare,
                                               CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                               Status = b != null ? b.ValueSet : "",
                                               ObjectCode = item.ObjectInst,
                                               ObjectName = a.ProjectTitle,
                                               CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                               ObjEntry = item.ObjEntry,
                                               ObjType = item.ObjectType,
                                               ObjTypeText = "Dự án",
                                               IsCheck = false,
                                               ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                               ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                           }).FirstOrDefault();
                            lst.Add(project);
                            break;
                        case "CONTRACT_PO":
                            var po = (from a in _context.PoBuyerHeaders.Where(x => !x.IsDeleted && x.PoSupCode == item.ObjectInst)
                                      join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                      from b in b1.DefaultIfEmpty()
                                      select new ObjectProcessModel
                                      {
                                          Id = item.ID,
                                          Beshare = item.Beshare,
                                          CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                          Status = b != null ? b.ValueSet : "",
                                          ObjectCode = item.ObjectInst,
                                          ObjectName = a.PoTitle,
                                          CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                          ObjEntry = item.ObjEntry,
                                          ObjType = item.ObjectType,
                                          ObjTypeText = "Hợp đồng mua",
                                          IsCheck = false,
                                          ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                          ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                      }).FirstOrDefault();
                            lst.Add(po);
                            break;
                        case "SUPPLIER":
                            var supp = (from a in _context.Suppliers.Where(x => !x.IsDeleted && x.SupCode == item.ObjectInst)
                                        join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                        from b in b1.DefaultIfEmpty()
                                        select new ObjectProcessModel
                                        {
                                            Id = item.ID,
                                            Beshare = item.Beshare,
                                            CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                            Status = b != null ? b.ValueSet : "",
                                            ObjectCode = item.ObjectInst,
                                            ObjectName = a.SupName,
                                            CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                            ObjEntry = item.ObjEntry,
                                            ObjType = item.ObjectType,
                                            ObjTypeText = "Nhà cung cấp",
                                            IsCheck = false,
                                            ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                            ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                        }).FirstOrDefault();
                            lst.Add(supp);
                            break;
                        case "CUSTOMER":
                            var cus = (from a in _context.Customerss.Where(x => !x.IsDeleted && x.CusCode == item.ObjectInst)
                                       join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                       from b in b1.DefaultIfEmpty()
                                       select new ObjectProcessModel
                                       {
                                           Id = item.ID,
                                           Beshare = item.Beshare,
                                           CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                           Status = b != null ? b.ValueSet : "",
                                           ObjectCode = item.ObjectInst,
                                           ObjectName = a.CusName,
                                           CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                           ObjEntry = item.ObjEntry,
                                           ObjType = item.ObjectType,
                                           ObjTypeText = "Khách hàng",
                                           IsCheck = false,
                                           ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                           ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                       }).FirstOrDefault();
                            lst.Add(cus);
                            break;
                        case "REQUEST_PRICE":
                            var rqPrice = (from a in _context.RequestPriceHeaders.Where(x => !x.IsDeleted && x.ReqCode == item.ObjectInst)
                                           join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                           from b in b1.DefaultIfEmpty()
                                           select new ObjectProcessModel
                                           {
                                               Id = item.ID,
                                               Beshare = item.Beshare,
                                               CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                               Status = b != null ? b.ValueSet : "",
                                               ObjectCode = item.ObjectInst,
                                               ObjectName = a.Title,
                                               CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                               ObjEntry = item.ObjEntry,
                                               ObjType = item.ObjectType,
                                               ObjTypeText = "Yêu cầu hỏi giá",
                                               IsCheck = false,
                                               ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                               ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                           }).FirstOrDefault();
                            lst.Add(rqPrice);
                            break;
                        case "ORDER_REQUEST":
                            var orderRQ = (from a in _context.OrderRequestRaws.Where(x => x.ReqCode == item.ObjectInst)
                                           join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                           from b in b1.DefaultIfEmpty()
                                           select new ObjectProcessModel
                                           {
                                               Id = item.ID,
                                               Beshare = item.Beshare,
                                               CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                               Status = b != null ? b.ValueSet : "",
                                               ObjectCode = item.ObjectInst,
                                               ObjectName = a.Title,
                                               CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                               ObjEntry = item.ObjEntry,
                                               ObjType = item.ObjectType,
                                               ObjTypeText = "Thông tin cơ hội",
                                               IsCheck = false,
                                               ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                               ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                           }).FirstOrDefault();
                            lst.Add(orderRQ);
                            break;
                        case "SERVICECAT":
                            var serCat = (from a in _context.ServiceCategorys.Where(x => x.ServiceCode == item.ObjectInst && !x.IsDeleted)
                                          select new ObjectProcessModel
                                          {
                                              Id = item.ID,
                                              Beshare = item.Beshare,
                                              CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                              Status = "",
                                              ObjectCode = item.ObjectInst,
                                              ObjectName = a.ServiceName,
                                              CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                              ObjEntry = item.ObjEntry,
                                              ObjType = item.ObjectType,
                                              ObjTypeText = "Dịch vụ",
                                              IsCheck = false,
                                              ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                              ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                          }).FirstOrDefault();
                            lst.Add(serCat);
                            break;
                        case "PRODUCT":
                            var prod = (from a in _context.MaterialProducts.Where(x => x.ProductCode == item.ObjectInst && !x.IsDeleted)
                                        join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                        from b in b1.DefaultIfEmpty()
                                        select new ObjectProcessModel
                                        {
                                            Id = item.ID,
                                            Beshare = item.Beshare,
                                            CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                            Status = b != null ? b.ValueSet : "",
                                            ObjectCode = item.ObjectInst,
                                            ObjectName = a.ProductName,
                                            CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                            ObjEntry = item.ObjEntry,
                                            ObjType = item.ObjectType,
                                            ObjTypeText = "Sản phẩm",
                                            IsCheck = false,
                                            ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                            ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                        }).FirstOrDefault();
                            lst.Add(prod);
                            break;
                        case "CARD_JOB":
                            var card = (from a in _context.WORKOSCards.Where(x => x.CardCode == item.ObjectInst && !x.IsDeleted && x.Status != "TRASH")
                                        join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                        from b in b1.DefaultIfEmpty()
                                        select new ObjectProcessModel
                                        {
                                            Id = item.ID,
                                            Beshare = item.Beshare,
                                            CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                            Status = b != null ? b.ValueSet : "",
                                            ObjectCode = item.ObjectInst,
                                            ObjectName = a.CardName,
                                            CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                            ObjEntry = item.ObjEntry,
                                            ObjType = item.ObjectType,
                                            ObjTypeText = "Thẻ việc",
                                            IsCheck = false,
                                            ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                            ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                        }).FirstOrDefault();
                            lst.Add(card);
                            break;
                        case "RQ_IMPORT_PROD":
                            var rqImpProd = (from a in _context.RequestImpProductHeaders.Where(x => x.ReqCode.Equals(item.ObjectInst) && !x.IsDeleted && x.Status != "TRASH")
                                             join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                             from b in b1.DefaultIfEmpty()
                                             select new ObjectProcessModel
                                             {
                                                 Id = item.ID,
                                                 Beshare = item.Beshare,
                                                 CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                 Status = b != null ? b.ValueSet : "",
                                                 ObjectCode = item.ObjectInst,
                                                 ObjectName = a.Title,
                                                 CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                 ObjEntry = item.ObjEntry,
                                                 ObjType = item.ObjectType,
                                                 ObjTypeText = "Yêu cầu đặt hàng",
                                                 IsCheck = false,
                                                 ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                 ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                             }).FirstOrDefault();
                            lst.Add(rqImpProd);
                            break;
                        case "IMPORT_STORE":
                            var importStore = (from a in _context.ProdReceivedHeaders.Where(x => x.TicketCode.Equals(item.ObjectInst) && !x.IsDeleted)
                                               join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                               from b in b1.DefaultIfEmpty()
                                               select new ObjectProcessModel
                                               {
                                                   Id = item.ID,
                                                   Beshare = item.Beshare,
                                                   CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                   Status = b != null ? b.ValueSet : "",
                                                   ObjectCode = item.ObjectInst,
                                                   ObjectName = a.Title,
                                                   CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                   ObjEntry = item.ObjEntry,
                                                   ObjType = item.ObjectType,
                                                   ObjTypeText = "Phiếu nhập kho",
                                                   IsCheck = false,
                                                   ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                   ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                               }).FirstOrDefault();
                            lst.Add(importStore);
                            break;
                        case "PAY_DECISION":
                            var payDecision = (from a in _context.PayDecisionHeaders.Where(x => x.DecisionNum.Equals(item.ObjectInst) && !x.IsDeleted)
                                               join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                               from b in b1.DefaultIfEmpty()
                                               select new ObjectProcessModel
                                               {
                                                   Id = item.ID,
                                                   Beshare = item.Beshare,
                                                   CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                   Status = b != null ? b.ValueSet : "",
                                                   ObjectCode = item.ObjectInst,
                                                   ObjectName = a.Title,
                                                   CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                   ObjEntry = item.ObjEntry,
                                                   ObjType = item.ObjectType,
                                                   ObjTypeText = "Quyết định lương",
                                                   IsCheck = false,
                                                   ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                   ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                               }).FirstOrDefault();
                            lst.Add(payDecision);
                            break;
                        case "EXPORT_STORE":
                            var exportStore = (from a in _context.ProdDeliveryHeaders.Where(x => x.TicketCode.Equals(item.ObjectInst) && !x.IsDeleted)
                                               join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                               from b in b1.DefaultIfEmpty()
                                               select new ObjectProcessModel
                                               {
                                                   Id = item.ID,
                                                   Beshare = item.Beshare,
                                                   CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                   Status = b != null ? b.ValueSet : "",
                                                   ObjectCode = item.ObjectInst,
                                                   ObjectName = a.Title,
                                                   CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                   ObjEntry = item.ObjEntry,
                                                   ObjType = item.ObjectType,
                                                   ObjTypeText = "Phiếu xuất kho",
                                                   IsCheck = false,
                                                   ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                   ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                               }).FirstOrDefault();
                            lst.Add(exportStore);
                            break;
                        case "ASSET_MAINTENANCE":
                            var assetMaintenance = (from a in _context.AssetMaintenanceHeaders.Where(x => x.TicketCode.Equals(item.ObjectInst) && !x.IsDeleted)
                                                    join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                                    from b in b1.DefaultIfEmpty()
                                                    select new ObjectProcessModel
                                                    {
                                                        Id = item.ID,
                                                        Beshare = item.Beshare,
                                                        CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                        Status = b != null ? b.ValueSet : "",
                                                        ObjectCode = item.ObjectInst,
                                                        ObjectName = a.Title,
                                                        CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                        ObjEntry = item.ObjEntry,
                                                        ObjType = item.ObjectType,
                                                        ObjTypeText = "Phiếu sửa chữa tài sản",
                                                        IsCheck = false,
                                                        ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                        ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                                    }).FirstOrDefault();
                            lst.Add(assetMaintenance);
                            break;
                        case "ASSET_BUY":
                            var assetBuy = (from a in _context.AssetBuyHeaders.Where(x => x.TicketCode.Equals(item.ObjectInst) && !x.IsDeleted)
                                            join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                            from b in b1.DefaultIfEmpty()
                                            select new ObjectProcessModel
                                            {
                                                Id = item.ID,
                                                Beshare = item.Beshare,
                                                CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                Status = b != null ? b.ValueSet : "",
                                                ObjectCode = item.ObjectInst,
                                                ObjectName = a.Title,
                                                CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                ObjEntry = item.ObjEntry,
                                                ObjType = item.ObjectType,
                                                ObjTypeText = "Phiếu mua sắm tài sản",
                                                IsCheck = false,
                                                ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                            }).FirstOrDefault();
                            lst.Add(assetBuy);
                            break;
                        case "DECISION_MOVEMENT":
                            var decNum = (from a in _context.DecisionMovementHeaders.Where(x => x.DecisionNum.Equals(item.ObjectInst) && !x.IsDeleted)
                                          join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                          from b in b1.DefaultIfEmpty()
                                          select new ObjectProcessModel
                                          {
                                              Id = item.ID,
                                              Beshare = item.Beshare,
                                              CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                              Status = b != null ? b.ValueSet : "",
                                              ObjectCode = item.ObjectInst,
                                              ObjectName = a.Title,
                                              CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                              ObjEntry = item.ObjEntry,
                                              ObjType = item.ObjectType,
                                              ObjTypeText = "Quyết định điều chuyển nhân sự",
                                              IsCheck = false,
                                              ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                              ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                          }).FirstOrDefault();
                            lst.Add(decNum);
                            break;
                        case "DECISION_END_CONTRACT":
                            var endContract = (from a in _context.StopContractHeaders.Where(x => x.DecisionNum.Equals(item.ObjectInst) && !x.IsDeleted)
                                               join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                               from b in b1.DefaultIfEmpty()
                                               select new ObjectProcessModel
                                               {
                                                   Id = item.ID,
                                                   Beshare = item.Beshare,
                                                   CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                   Status = b != null ? b.ValueSet : "",
                                                   ObjectCode = item.ObjectInst,
                                                   ObjectName = a.Title,
                                                   CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                   ObjEntry = item.ObjEntry,
                                                   ObjType = item.ObjectType,
                                                   ObjTypeText = "Chấm dứt hợp đồng",
                                                   IsCheck = false,
                                                   ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                   ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                               }).FirstOrDefault();
                            lst.Add(endContract);
                            break;
                        case "PLAN_RECRUITMENT":
                            var planRecrui = (from a in _context.PlanRecruitmentHeaders.Where(x => x.PlanNumber.Equals(item.ObjectInst) && !x.IsDeleted)
                                              join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                              from b in b1.DefaultIfEmpty()
                                              select new ObjectProcessModel
                                              {
                                                  Id = item.ID,
                                                  Beshare = item.Beshare,
                                                  CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                  Status = b != null ? b.ValueSet : "",
                                                  ObjectCode = item.ObjectInst,
                                                  ObjectName = a.Title,
                                                  CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                  ObjEntry = item.ObjEntry,
                                                  ObjType = item.ObjectType,
                                                  ObjTypeText = "Kế hoạch tuyển dụng",
                                                  IsCheck = false,
                                                  ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                  ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                              }).FirstOrDefault();
                            lst.Add(planRecrui);
                            break;
                        case "FUND_ACC_ENTRY":
                            var fund = (from a in _context.FundAccEntrys.Where(x => x.AetCode.Equals(item.ObjectInst) && !x.IsDeleted)
                                        join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                        from b in b1.DefaultIfEmpty()
                                        select new ObjectProcessModel
                                        {
                                            Id = item.ID,
                                            Beshare = item.Beshare,
                                            CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                            Status = b != null ? b.ValueSet : "",
                                            ObjectCode = item.ObjectInst,
                                            ObjectName = a.Title,
                                            CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                            ObjEntry = item.ObjEntry,
                                            ObjType = item.ObjectType,
                                            ObjTypeText = "Phiếu thu chi",
                                            IsCheck = false,
                                            ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                            ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                        }).FirstOrDefault();
                            lst.Add(fund);
                            break;
                        case "ASSET_INVENTORY":
                            var assetInventory = (from a in _context.AssetInventoryHeaders.Where(x => x.TicketCode.Equals(item.ObjectInst) && !x.IsDeleted)
                                                  join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                                  from b in b1.DefaultIfEmpty()
                                                  select new ObjectProcessModel
                                                  {
                                                      Id = item.ID,
                                                      Beshare = item.Beshare,
                                                      CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                      Status = b != null ? b.ValueSet : "",
                                                      ObjectCode = item.ObjectInst,
                                                      ObjectName = a.Title,
                                                      CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                      ObjEntry = item.ObjEntry,
                                                      ObjType = item.ObjectType,
                                                      ObjTypeText = "Phiếu kiểm kê tài sản",
                                                      IsCheck = false,
                                                      ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                      ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                                  }).FirstOrDefault();
                            lst.Add(assetInventory);
                            break;
                        case "ASSET_ALLOCATE":
                            var assetAllocate = (from a in _context.AssetAllocateHeaders.Where(x => x.TicketCode.Equals(item.ObjectInst) && !x.IsDeleted)
                                                 join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                                 from b in b1.DefaultIfEmpty()
                                                 select new ObjectProcessModel
                                                 {
                                                     Id = item.ID,
                                                     Beshare = item.Beshare,
                                                     CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                     Status = b != null ? b.ValueSet : "",
                                                     ObjectCode = item.ObjectInst,
                                                     ObjectName = a.Title,
                                                     CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                     ObjEntry = item.ObjEntry,
                                                     ObjType = item.ObjectType,
                                                     ObjTypeText = "Phiếu cấp phát tài sản",
                                                     IsCheck = false,
                                                     ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                     ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                                 }).FirstOrDefault();
                            lst.Add(assetAllocate);
                            break;
                        case "ASSET_TRANSFER":
                            var assetTrans = (from a in _context.AssetTransferHeaders.Where(x => x.Ticketcode.Equals(item.ObjectInst) && !x.IsDeleted)
                                              join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                              from b in b1.DefaultIfEmpty()
                                              select new ObjectProcessModel
                                              {
                                                  Id = item.ID,
                                                  Beshare = item.Beshare,
                                                  CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                  Status = b != null ? b.ValueSet : "",
                                                  ObjectCode = item.ObjectInst,
                                                  ObjectName = a.Ticket,
                                                  CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                  ObjEntry = item.ObjEntry,
                                                  ObjType = item.ObjectType,
                                                  ObjTypeText = "Phiếu điều chuyển tài sản",
                                                  IsCheck = false,
                                                  ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                  ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                              }).FirstOrDefault();
                            lst.Add(assetTrans);
                            break;
                        case "ASSET_LIQUIDATION":
                            var assetLiqui = (from a in _context.AssetLiquidationHeaders.Where(x => x.TicketCode.Equals(item.ObjectInst) && !x.IsDeleted)
                                              join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                              from b in b1.DefaultIfEmpty()
                                              select new ObjectProcessModel
                                              {
                                                  Id = item.ID,
                                                  Beshare = item.Beshare,
                                                  CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                  Status = b != null ? b.ValueSet : "",
                                                  ObjectCode = item.ObjectInst,
                                                  ObjectName = a.Title,
                                                  CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                  ObjEntry = item.ObjEntry,
                                                  ObjType = item.ObjectType,
                                                  ObjTypeText = "Phiếu thanh lý tài sản",
                                                  IsCheck = false,
                                                  ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                  ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                              }).FirstOrDefault();
                            lst.Add(assetLiqui);
                            break;
                        case "ASSET_RECALL":
                            var assetRecall = (from a in _context.AssetRecalledHeaders.Where(x => x.TicketCode.Equals(item.ObjectInst) && !x.IsDeleted)
                                               join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                               from b in b1.DefaultIfEmpty()
                                               select new ObjectProcessModel
                                               {
                                                   Id = item.ID,
                                                   Beshare = item.Beshare,
                                                   CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                   Status = b != null ? b.ValueSet : "",
                                                   ObjectCode = item.ObjectInst,
                                                   ObjectName = a.Title,
                                                   CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                   ObjEntry = item.ObjEntry,
                                                   ObjType = item.ObjectType,
                                                   ObjTypeText = "Phiếu thu hồi tài sản",
                                                   IsCheck = false,
                                                   ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                   ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                               }).FirstOrDefault();
                            lst.Add(assetRecall);
                            break;
                        case "ASSET_RQ_REPAIR":
                            var assetRqRepair = (from a in _context.AssetRqMaintenanceRepairHeaders.Where(x => x.TicketCode.Equals(item.ObjectInst) && !x.IsDeleted)
                                                 join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                                 from b in b1.DefaultIfEmpty()
                                                 select new ObjectProcessModel
                                                 {
                                                     Id = item.ID,
                                                     Beshare = item.Beshare,
                                                     CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                     Status = b != null ? b.ValueSet : "",
                                                     ObjectCode = item.ObjectInst,
                                                     ObjectName = a.Title,
                                                     CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                     ObjEntry = item.ObjEntry,
                                                     ObjType = item.ObjectType,
                                                     ObjTypeText = "Yêu cầu sửa chữa bảo dưỡng",
                                                     IsCheck = false,
                                                     ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                     ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                                 }).FirstOrDefault();
                            lst.Add(assetRqRepair);
                            break;
                        case "ASSET_IMPROVE":
                            var assetImprove = (from a in _context.AssetImprovementHeaders.Where(x => x.TicketCode.Equals(item.ObjectInst) && !x.IsDeleted)
                                                join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                                from b in b1.DefaultIfEmpty()
                                                select new ObjectProcessModel
                                                {
                                                    Id = item.ID,
                                                    Beshare = item.Beshare,
                                                    CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                    Status = b != null ? b.ValueSet : "",
                                                    ObjectCode = item.ObjectInst,
                                                    ObjectName = a.Title,
                                                    CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                    ObjEntry = item.ObjEntry,
                                                    ObjType = item.ObjectType,
                                                    ObjTypeText = "Bảo dưỡng tài sản",
                                                    IsCheck = false,
                                                    ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                    ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                                }).FirstOrDefault();
                            lst.Add(assetImprove);
                            break;
                        case "ASSET_CANCEL":
                            var assetCancel = (from a in _context.AssetCancelHeaders.Where(x => x.TicketCode.Equals(item.ObjectInst) && !x.IsDeleted)
                                               join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                               from b in b1.DefaultIfEmpty()
                                               select new ObjectProcessModel
                                               {
                                                   Id = item.ID,
                                                   Beshare = item.Beshare,
                                                   CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                   Status = b != null ? b.ValueSet : "",
                                                   ObjectCode = item.ObjectInst,
                                                   ObjectName = a.Title,
                                                   CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                   ObjEntry = item.ObjEntry,
                                                   ObjType = item.ObjectType,
                                                   ObjTypeText = "Hủy tài sản",
                                                   IsCheck = false,
                                                   ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                   ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                               }).FirstOrDefault();
                            lst.Add(assetCancel);
                            break;
                        case "ASSET_RPT":
                            var assetRpt = (from a in _context.AssetRPTBrokenHeaders.Where(x => x.TicketCode.Equals(item.ObjectInst) && !x.IsDeleted)
                                            join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.AssetStatus equals b.CodeSet into b1
                                            from b in b1.DefaultIfEmpty()
                                            select new ObjectProcessModel
                                            {
                                                Id = item.ID,
                                                Beshare = item.Beshare,
                                                CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                Status = b != null ? b.ValueSet : "",
                                                ObjectCode = item.ObjectInst,
                                                ObjectName = a.Ticket,
                                                CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                ObjEntry = item.ObjEntry,
                                                ObjType = item.ObjectType,
                                                ObjTypeText = "Báo hỏng/mất tài sản",
                                                IsCheck = false,
                                                ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                            }).FirstOrDefault();
                            lst.Add(assetRpt);
                            break;
                        case "BONUS_DECISION":
                            var decBonus = (from a in _context.DecisionBonusDisciplineHeaders.Where(x => x.DecisionNum.Equals(item.ObjectInst) && !x.IsDeleted)
                                            join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                            from b in b1.DefaultIfEmpty()
                                            select new ObjectProcessModel
                                            {
                                                Id = item.ID,
                                                Beshare = item.Beshare,
                                                CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                Status = b != null ? b.ValueSet : "",
                                                ObjectCode = item.ObjectInst,
                                                ObjectName = a.Title,
                                                CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                ObjEntry = item.ObjEntry,
                                                ObjType = item.ObjectType,
                                                ObjTypeText = "Quyết định khen thưởng",
                                                IsCheck = false,
                                                ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                            }).FirstOrDefault();
                            lst.Add(decBonus);
                            break;
                        case "DISCIPLINE_DECISION":
                            var decDis = (from a in _context.DecisionBonusDisciplineHeaders.Where(x => x.DecisionNum.Equals(item.ObjectInst) && !x.IsDeleted)
                                          join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                          from b in b1.DefaultIfEmpty()
                                          select new ObjectProcessModel
                                          {
                                              Id = item.ID,
                                              Beshare = item.Beshare,
                                              CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                              Status = b != null ? b.ValueSet : "",
                                              ObjectCode = item.ObjectInst,
                                              ObjectName = a.Title,
                                              CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                              ObjEntry = item.ObjEntry,
                                              ObjType = item.ObjectType,
                                              ObjTypeText = "Quyết định kỷ luật",
                                              IsCheck = false,
                                              ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                              ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                          }).FirstOrDefault();
                            lst.Add(decDis);
                            break;
                        case "NOT_WORK":
                            var notWork = (from a in _context.WorkShiftCheckInOuts.Where(x => x.Id.ToString().Equals(item.ObjectInst) && !x.IsDeleted)
                                           join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                           from b in b1.DefaultIfEmpty()
                                           join c in _context.Users on a.UserId equals c.Id
                                           select new ObjectProcessModel
                                           {
                                               Id = item.ID,
                                               Beshare = item.Beshare,
                                               CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                               Status = b != null ? b.ValueSet : "",
                                               ObjectCode = item.ObjectInst,
                                               ObjectName = c.GivenName + " báo nghỉ",
                                               CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                               ObjEntry = item.ObjEntry,
                                               ObjType = item.ObjectType,
                                               ObjTypeText = "Báo nghỉ",
                                               IsCheck = false,
                                               ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                               ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                           }).FirstOrDefault();
                            lst.Add(notWork);
                            break;
                    }
                }
            }
            return Json(lst);
        }

        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetActInstance()
        {
            var data = _context.ActivityInstances.Where(x => !x.IsDeleted)
                .Select(x => new { Code = x.ActivityInstCode, Name = x.Title });
            return Json(data);
        }

        [HttpPost]
        public JsonResult GetActRelaObject(string objType, string objCode)
        {
            var data = from a in _context.WfActivityObjectProccessings.Where(x => !x.IsDeleted && x.ObjectType == objType && x.ObjectInst == objCode && x.Beshare)
                       join b in _context.ActivityInstances.Where(x => !x.IsDeleted) on a.ActInstCode equals b.ActivityInstCode
                       select new
                       {
                           a.ID,
                           b.Title
                       };
            return Json(data);
        }

        [HttpPost]
        public JsonResult DeleteObjectProcessingShare(int id)
        {
            var msg = new JMessage();
            try
            {
                var data = _context.WfActivityObjectProccessings.FirstOrDefault(x => x.ID == id);
                if (data != null)
                {
                    data.IsDeleted = true;
                    data.DeletedBy = ESEIM.AppContext.UserName;
                    data.DeletedTime = DateTime.Now;
                    _context.WfActivityObjectProccessings.Update(data);

                    //Real-time
                    UpdateChangeActInst(data.ActInstCode);

                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_DELETE_SUCCESS"];
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["WFAI_MSG_RECORD_NO_EXIST"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult InsertObjectProcessWF([FromBody] WfActivityObjectProccessing data)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var process = _context.WfActivityObjectProccessings.FirstOrDefault(x => !x.IsDeleted && x.ObjectType == data.ObjectType
                    && x.ObjectInst == data.ObjectInst && x.WfInstCode != data.WfInstCode);
                if (process != null)
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["WFAI_MSG_OBJ_EXIST_IN_OTHER_WF"];
                    return Json(msg);
                }

                var checkWf = _context.WfActivityObjectProccessings.FirstOrDefault(x => !x.IsDeleted && x.ObjectType == data.ObjectType
                    && x.ObjectInst == data.ObjectInst && x.ActInstCode == data.ActInstCode);
                if (checkWf != null)
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["WFAI_MSG_OBJECT_EXIST"];
                    return Json(msg);
                }

                var objProcess = new WfActivityObjectProccessing
                {
                    ActInstCode = data.ActInstCode,
                    WfInstCode = data.WfInstCode,
                    ObjectInst = data.ObjectInst,
                    ObjectType = data.ObjectType,
                    ObjEntry = false,
                    IsLeader = true,
                    CreatedBy = ESEIM.AppContext.UserName,
                    CreatedTime = DateTime.Now
                };
                _context.WfActivityObjectProccessings.Add(objProcess);
                _context.SaveChanges();
                msg.Title = _sharedResources["COM_ADD_SUCCESS"];
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetObjectProcessWF(string wfInstCode)
        {
            var data = _context.WfActivityObjectProccessings.Where(x => !x.IsDeleted && x.WfInstCode.Equals(wfInstCode));
            var lst = new List<ObjectProcessModel>();
            if (data.Any())
            {
                foreach (var item in data)
                {
                    switch (item.ObjectType)
                    {
                        case "CONTRACT":
                            var contract = (from a in _context.PoSaleHeaders.Where(x => !x.IsDeleted && x.ContractCode == item.ObjectInst)
                                            join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                            from b in b1.DefaultIfEmpty()
                                            select new ObjectProcessModel
                                            {
                                                Id = item.ID,
                                                Beshare = item.Beshare,
                                                CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                                Status = b != null ? b.ValueSet : "",
                                                ObjectCode = item.ObjectInst,
                                                ObjectName = a.Title,
                                                CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                                ObjEntry = item.ObjEntry,
                                                ObjType = item.ObjectType,
                                                ObjTypeText = "Hợp đồng",
                                                IsCheck = false,
                                                ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                                ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                            }).FirstOrDefault();
                            lst.Add(contract);
                            break;

                        case "PROJECT":
                            var project = (from a in _context.Projects.Where(x => !x.FlagDeleted && x.ProjectCode == item.ObjectInst)
                                           join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                           from b in b1.DefaultIfEmpty()
                                           select new ObjectProcessModel
                                           {
                                               Id = item.ID,
                                               Beshare = item.Beshare,
                                               CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                               Status = b != null ? b.ValueSet : "",
                                               ObjectCode = item.ObjectInst,
                                               ObjectName = a.ProjectTitle,
                                               CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                               ObjEntry = item.ObjEntry,
                                               ObjType = item.ObjectType,
                                               ObjTypeText = "Dự án",
                                               IsCheck = false,
                                               ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                               ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                           }).FirstOrDefault();
                            lst.Add(project);
                            break;
                        case "CONTRACT_PO":
                            var po = (from a in _context.PoBuyerHeaders.Where(x => !x.IsDeleted && x.PoSupCode == item.ObjectInst)
                                      join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                      from b in b1.DefaultIfEmpty()
                                      select new ObjectProcessModel
                                      {
                                          Id = item.ID,
                                          Beshare = item.Beshare,
                                          CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                          Status = b != null ? b.ValueSet : "",
                                          ObjectCode = item.ObjectInst,
                                          ObjectName = a.PoTitle,
                                          CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                          ObjEntry = item.ObjEntry,
                                          ObjType = item.ObjectType,
                                          ObjTypeText = "Hợp đồng mua",
                                          IsCheck = false,
                                          ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                          ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                      }).FirstOrDefault();
                            lst.Add(po);
                            break;
                        case "SUPPLIER":
                            var supp = (from a in _context.Suppliers.Where(x => !x.IsDeleted && x.SupCode == item.ObjectInst)
                                        join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                        from b in b1.DefaultIfEmpty()
                                        select new ObjectProcessModel
                                        {
                                            Id = item.ID,
                                            Beshare = item.Beshare,
                                            CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                            Status = b != null ? b.ValueSet : "",
                                            ObjectCode = item.ObjectInst,
                                            ObjectName = a.SupName,
                                            CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                            ObjEntry = item.ObjEntry,
                                            ObjType = item.ObjectType,
                                            ObjTypeText = "Nhà cung cấp",
                                            IsCheck = false,
                                            ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                            ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                        }).FirstOrDefault();
                            lst.Add(supp);
                            break;
                        case "CUSTOMER":
                            var cus = (from a in _context.Customerss.Where(x => !x.IsDeleted && x.CusCode == item.ObjectInst)
                                       join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                       from b in b1.DefaultIfEmpty()
                                       select new ObjectProcessModel
                                       {
                                           Id = item.ID,
                                           Beshare = item.Beshare,
                                           CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                           Status = b != null ? b.ValueSet : "",
                                           ObjectCode = item.ObjectInst,
                                           ObjectName = a.CusName,
                                           CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                           ObjEntry = item.ObjEntry,
                                           ObjType = item.ObjectType,
                                           ObjTypeText = "Khách hàng",
                                           IsCheck = false,
                                           ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                           ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                       }).FirstOrDefault();
                            lst.Add(cus);
                            break;
                        case "REQUEST_PRICE":
                            var rqPrice = (from a in _context.RequestPriceHeaders.Where(x => !x.IsDeleted && x.ReqCode == item.ObjectInst)
                                           join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                           from b in b1.DefaultIfEmpty()
                                           select new ObjectProcessModel
                                           {
                                               Id = item.ID,
                                               Beshare = item.Beshare,
                                               CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                               Status = b != null ? b.ValueSet : "",
                                               ObjectCode = item.ObjectInst,
                                               ObjectName = a.Title,
                                               CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                               ObjEntry = item.ObjEntry,
                                               ObjType = item.ObjectType,
                                               ObjTypeText = "Yêu cầu hỏi giá",
                                               IsCheck = false,
                                               ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                               ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                           }).FirstOrDefault();
                            lst.Add(rqPrice);
                            break;
                        case "ORDER_REQUEST":
                            var orderRQ = (from a in _context.OrderRequestRaws.Where(x => x.ReqCode == item.ObjectInst)
                                           join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                           from b in b1.DefaultIfEmpty()
                                           select new ObjectProcessModel
                                           {
                                               Id = item.ID,
                                               Beshare = item.Beshare,
                                               CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                               Status = b != null ? b.ValueSet : "",
                                               ObjectCode = item.ObjectInst,
                                               ObjectName = a.Title,
                                               CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                               ObjEntry = item.ObjEntry,
                                               ObjType = item.ObjectType,
                                               ObjTypeText = "Thông tin cơ hội",
                                               IsCheck = false,
                                               ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                               ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                           }).FirstOrDefault();
                            lst.Add(orderRQ);
                            break;
                        case "SERVICECAT":
                            var serCat = (from a in _context.ServiceCategorys.Where(x => x.ServiceCode == item.ObjectInst && !x.IsDeleted)
                                          select new ObjectProcessModel
                                          {
                                              Id = item.ID,
                                              Beshare = item.Beshare,
                                              CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                              Status = "",
                                              ObjectCode = item.ObjectInst,
                                              ObjectName = a.ServiceName,
                                              CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                              ObjEntry = item.ObjEntry,
                                              ObjType = item.ObjectType,
                                              ObjTypeText = "Danh mục dịch vụ",
                                              IsCheck = false,
                                              ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                              ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                          }).FirstOrDefault();
                            lst.Add(serCat);
                            break;
                        case "PRODUCT":
                            var prod = (from a in _context.MaterialProducts.Where(x => x.ProductCode == item.ObjectInst && !x.IsDeleted)
                                        join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                        from b in b1.DefaultIfEmpty()
                                        select new ObjectProcessModel
                                        {
                                            Id = item.ID,
                                            Beshare = item.Beshare,
                                            CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                            Status = b != null ? b.ValueSet : "",
                                            ObjectCode = item.ObjectInst,
                                            ObjectName = a.ProductName,
                                            CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                            ObjEntry = item.ObjEntry,
                                            ObjType = item.ObjectType,
                                            ObjTypeText = "Sản phẩm",
                                            IsCheck = false,
                                            ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                            ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                        }).FirstOrDefault();
                            lst.Add(prod);
                            break;
                        case "CARD_JOB":
                            var card = (from a in _context.WORKOSCards.Where(x => x.CardCode == item.ObjectInst && !x.IsDeleted && x.Status != "TRASH")
                                        join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                                        from b in b1.DefaultIfEmpty()
                                        select new ObjectProcessModel
                                        {
                                            Id = item.ID,
                                            Beshare = item.Beshare,
                                            CreatedBy = _context.Users.FirstOrDefault(x => x.UserName == item.CreatedBy).GivenName,
                                            Status = b != null ? b.ValueSet : "",
                                            ObjectCode = item.ObjectInst,
                                            ObjectName = a.CardName,
                                            CreatedTime = item.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                            ObjEntry = item.ObjEntry,
                                            ObjType = item.ObjectType,
                                            ObjTypeText = "Thẻ việc",
                                            IsCheck = false,
                                            ActInst = !string.IsNullOrEmpty(item.ActInstCode) ? item.ActInstCode : "",
                                            ActTitle = !string.IsNullOrEmpty(item.ActInstCode) ? _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(item.ActInstCode)).Title ?? "" : ""
                                        }).FirstOrDefault();
                            lst.Add(card);
                            break;
                    }
                }
            }
            return Json(lst);
        }

        [HttpPost]
        public JsonResult ShareObject([FromBody] ModelShareObj data)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var check = false;
                foreach (var item in data.LstObj)
                {
                    if (item.IsCheck)
                    {
                        check = true;
                    }
                }
                if (!check)
                {
                    msg.Error = true;
                    msg.Title = "Vui lòng tích chọn đối tượng";
                    return Json(msg);
                }
                if (data.LstObj.Any(x => x.IsCheck))
                    foreach (var item in data.LstAct)
                    {
                        var process = _context.WfActivityObjectProccessings.Where(x => !x.IsDeleted && x.ActInstCode.Equals(item.ActInstCode));
                        foreach (var obj in data.LstObj)
                        {
                            if (!process.Any(x => x.ObjectInst.Equals(obj.ObjectCode) && x.ObjectType.Equals(obj.ObjType)))
                            {
                                var wfProcess = new WfActivityObjectProccessing
                                {
                                    ObjectType = obj.ObjType,
                                    ObjectInst = obj.ObjectCode,
                                    ActInstCode = item.ActInstCode,
                                    Beshare = true,
                                    CreatedBy = ESEIM.AppContext.UserName,
                                    CreatedTime = DateTime.Now,
                                    WfInstCode = data.WfInstCode,
                                    ObjEntry = false,
                                };
                                _context.WfActivityObjectProccessings.Add(wfProcess);
                            }
                        }
                    }
                _context.SaveChanges();
                msg.Title = _stringLocalizer["WFAI_MSG_SAVE_SUCCESS"];
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult GetActInstByObj(string code, string type)
        {
            var data = (from a in _context.WfActivityObjectProccessings.Where(x => !x.IsDeleted && x.ObjectInst.Equals(code) && x.ObjectType.Equals(type))
                        join b in _context.ActivityInstances.Where(x => !x.IsDeleted) on a.ActInstCode equals b.ActivityInstCode
                        select new LstActInst
                        {
                            ActInstCode = b.ActivityInstCode,
                            ID = b.ID,
                            //IsLock = b.IsLock,
                            IsRela = false,
                            ObjCode = "",
                            Status = b.Status,
                            Timer = "",
                            Title = b.Title
                        }).DistinctBy(x => x.ActInstCode);
            return Json(data);
        }

        [HttpPost]
        public JsonResult DeleteObjectShare(int id)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.WfActivityObjectProccessings.FirstOrDefault(x => x.ID == id);
                if (data != null)
                {
                    if (data.ObjEntry)
                    {
                        msg.Error = true;
                        msg.Title = _stringLocalizer["WFAI_MSG_OBJECT_CANT_DEL"];
                        return Json(msg);
                    }
                    data.IsDeleted = true;
                    data.DeletedBy = ESEIM.AppContext.UserName;
                    data.DeletedTime = DateTime.Now;
                    _context.WfActivityObjectProccessings.Update(data);

                    UpdateChangeActInst(data.ActInstCode);

                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_DELETE_SUCCESS"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        public class ModelShareObj
        {
            public ModelShareObj()
            {
                LstAct = new List<LstActInst>();
                LstObj = new List<ObjectProcessModel>();
            }
            public string WfInstCode { get; set; }
            public List<LstActInst> LstAct { get; set; }
            public List<ObjectProcessModel> LstObj { get; set; }
        }
        public class ObjTempRela
        {
            public int ID { get; set; }
            public string Code { get; set; }
            public string Name { get; set; }
        }
        public class ObjectProcessModel
        {
            public int Id { get; set; }
            public string ObjectCode { get; set; }
            public string ObjectName { get; set; }
            public bool Beshare { get; set; }
            public string Status { get; set; }
            public string CreatedBy { get; set; }
            public string CreatedTime { get; set; }
            public bool ObjEntry { get; set; }
            public string ObjType { get; set; }
            public string ActTitle { get; set; }
            public string ObjTypeText { get; set; }
            public bool IsCheck { get; set; }
            public string ActInst { get; set; }
        }
        #endregion

        #region Assign member Activity instance

        [AllowAnonymous]
        [HttpGet]
        public JsonResult GetStatusAssign()
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals("ASSIGN_STATUS"))
                .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
            return Json(data);
        }

        [HttpPost]
        public JsonResult GetMemberAssign([FromBody] AssignModel jTablepara)
        {
            var session = HttpContext.GetSessionUser();
            var query = (from a in _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted)
                         join b in _context.Users on a.UserId equals b.Id
                         join c in _context.AdDepartments.Where(x => !x.IsDeleted && x.IsEnabled) on b.DepartmentId equals c.DepartmentCode into c1
                         from c2 in c1.DefaultIfEmpty()
                         where a.ActivityCodeInst.Equals(jTablepara.ActivityCode)
                         select new
                         {
                             Id = a.ID,
                             UserId = b.Id,
                             GivenName = b.GivenName,
                             Role = a.Role,
                             Department = !string.IsNullOrEmpty(b.DepartmentId) ? b.DepartmentId : "",
                             DepartmentName = c2 != null ? c2.Title : "",
                             Status = a.Status,
                             RoleSys = (from m in _context.UserRoles.Where(x => x.UserId.Equals(b.Id))
                                        join n in _context.Roles on m.RoleId equals n.Id
                                        select n).FirstOrDefault() != null ? (from m in _context.UserRoles.Where(x => x.UserId.Equals(b.Id))
                                                                              join n in _context.Roles on m.RoleId equals n.Id
                                                                              select n).FirstOrDefault().Title : "Nhân viên"
                         }).ToList();
            return Json(query);
        }

        [HttpPost]
        public JsonResult Assign([FromBody] ExcuterControlRoleInst obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var check = _context.ExcuterControlRoleInsts.FirstOrDefault(x => x.UserId.Equals(obj.UserId) && !x.IsDeleted
                    && x.ActivityCodeInst.Equals(obj.ActivityCodeInst));
                if (check == null)
                {
                    var assign = new ExcuterControlRoleInst
                    {
                        ActivityCodeInst = obj.ActivityCodeInst,
                        UserId = obj.UserId,
                        GroupCode = obj.GroupCode,
                        DepartmentCode = obj.DepartmentCode,
                        Branch = obj.Branch,
                        Role = obj.Role,
                        CreatedBy = ESEIM.AppContext.UserName,
                        CreatedTime = DateTime.Now,
                        Approve = false,
                        Status = "ASSIGN_STATUS_WORK"
                    };
                    _context.ExcuterControlRoleInsts.Add(assign);

                    //Real-time
                    UpdateChangeActInst(obj.ActivityCodeInst);

                    //Log action user
                    var common = _context.Users.FirstOrDefault(x => x.Id.Equals(assign.UserId));
                    if (common != null)
                    {
                        var action = new ActInstanceUserActivity
                        {
                            CreatedTime = DateTime.Now,
                            UserId = ESEIM.AppContext.UserId,
                            ActInstCode = assign.ActivityCodeInst,
                            Action = "Đã thêm nhân viên",
                            FromDevice = "Desktop/Laptop",
                            IdObject = "Command",
                            ChangeDetails = common != null ? common.GivenName : ""
                        };
                        _context.ActInstanceUserActivitys.Add(action);
                    }
                    //End


                    var wfInstRuning = _context.WorkflowInstanceRunnings.FirstOrDefault(x => x.ActivityInitial.Equals(obj.ActivityCodeInst));
                    if (wfInstRuning != null)
                    {
                        //update Assign User to Notification
                        var notiManager = _context.NotificationManagers.FirstOrDefault(x => !x.IsDeleted && x.ObjCode.Equals(wfInstRuning.WfInstCode) && x.ObjType.Equals(EnumHelper<NotificationType>.GetDisplayValue(NotificationType.WorkFlow)));
                        if (notiManager != null)
                        {
                            //Add user to Notification
                            var userNotify = new UserNotify
                            {
                                UserId = assign.UserId
                            };

                            if (!notiManager.ListUser.Any(p => p.UserId.Equals(userNotify.UserId)) && !userNotify.UserId.Equals(ESEIM.AppContext.UserId))
                                notiManager.ListUser.Add(userNotify);

                            _context.NotificationManagers.Update(notiManager);
                        }
                    }


                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_ADD_SUCCESS"];
                    var act = _context.ActivityInstances.FirstOrDefault(x => x.ActivityInstCode == obj.ActivityCodeInst);
                    if (act != null)
                    {
                        GetAllMemberAssignWF(act.WorkflowCode);
                    }
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["WFAI_MSG_EMPLOYEE_EXIST"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult UpdateRole(int id, string role)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.ExcuterControlRoleInsts.FirstOrDefault(x => !x.IsDeleted && x.ID == id);
                if (data != null)
                {
                    var currentRole = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(data.Role));
                    data.Role = role;
                    _context.ExcuterControlRoleInsts.Update(data);

                    //Real-time
                    UpdateChangeActInst(data.ActivityCodeInst);

                    //Log action user
                    var common = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(role));
                    var user = _context.Users.FirstOrDefault(x => x.Id.Equals(data.UserId));
                    if (common != null)
                    {
                        var action = new ActInstanceUserActivity
                        {
                            CreatedTime = DateTime.Now,
                            UserId = ESEIM.AppContext.UserId,
                            ActInstCode = data.ActivityCodeInst,
                            Action = "Đã cập nhật vai trò nhân viên",
                            FromDevice = "Desktop/Laptop",
                            IdObject = "Command",
                            ChangeDetails = (user != null ? user.GivenName : "") + " từ [" + (currentRole != null ? currentRole.ValueSet : "") +
                                "] sang [" + common.ValueSet + "]"
                        };
                        _context.ActInstanceUserActivitys.Add(action);
                    }
                    //End

                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_UPDATE_SUCCESS"];
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["WFAI_MSG_RECORD_NO_EXIST"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult UpdateStatus(int id, string status)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.ExcuterControlRoleInsts.FirstOrDefault(x => !x.IsDeleted && x.ID == id);
                if (data != null)
                {
                    var currentRole = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(data.Status));
                    data.Status = status;
                    _context.ExcuterControlRoleInsts.Update(data);
                    //Real-time
                    UpdateChangeActInst(data.ActivityCodeInst);

                    //Log action user
                    var common = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(status));
                    var user = _context.Users.FirstOrDefault(x => x.Id.Equals(data.UserId));
                    if (common != null)
                    {
                        var action = new ActInstanceUserActivity
                        {
                            CreatedTime = DateTime.Now,
                            UserId = ESEIM.AppContext.UserId,
                            ActInstCode = data.ActivityCodeInst,
                            Action = "Đã cập nhật trạng thái nhân viên",
                            FromDevice = "Desktop/Laptop",
                            IdObject = "Command",
                            ChangeDetails = (user != null ? user.GivenName : "") + " từ [" + (currentRole != null ? currentRole.ValueSet : "") +
                                "] sang [" + common.ValueSet + "]"
                        };
                        _context.ActInstanceUserActivitys.Add(action);
                    }
                    //End

                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_UPDATE_SUCCESS"];
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["WFAI_MSG_RECORD_NO_EXIST"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult DeleteAssign(int id)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.ExcuterControlRoleInsts.FirstOrDefault(x => x.ID == id);
                if (data != null)
                {
                    data.IsDeleted = true;
                    data.DeletedBy = ESEIM.AppContext.UserName;
                    data.DeletedTime = DateTime.Now;
                    _context.ExcuterControlRoleInsts.Update(data);
                    //Real-time
                    UpdateChangeActInst(data.ActivityCodeInst);

                    //Log action user
                    var common = _context.Users.FirstOrDefault(x => x.Id.Equals(data.UserId));
                    if (common != null)
                    {
                        var action = new ActInstanceUserActivity
                        {
                            CreatedTime = DateTime.Now,
                            UserId = ESEIM.AppContext.UserId,
                            ActInstCode = data.ActivityCodeInst,
                            Action = "Đã xóa nhân viên",
                            FromDevice = "Desktop/Laptop",
                            IdObject = "Command",
                            ChangeDetails = common != null ? common.GivenName : ""
                        };
                        _context.ActInstanceUserActivitys.Add(action);
                    }
                    //End

                    //Xóa người khỏi bảng Notification khi người đó không được Assign vào hoạt động nào
                    var actInst = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(data.ActivityCodeInst));
                    if (actInst != null)
                    {
                        var listWfInstAssign = from a in _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(actInst.WorkflowCode))
                                               join b in _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && !x.ActivityCodeInst.Equals(data.ActivityCodeInst) && x.UserId.Equals(data.UserId)) on a.ActivityInstCode equals b.ActivityCodeInst
                                               select new
                                               {
                                                   b.ID
                                               };

                        //Nếu người đó chỉ được Assign vào 1 hoạt động thì xóa được trong bảng NotificationManager
                        if (listWfInstAssign.Count() == 0)
                        {
                            //remove Assign User to Notification
                            var notiManager = _context.NotificationManagers.FirstOrDefault(x => !x.IsDeleted && x.ObjCode.Equals(actInst.WorkflowCode) && x.ObjType.Equals(EnumHelper<NotificationType>.GetDisplayValue(NotificationType.WorkFlow)));
                            if (notiManager != null)
                            {
                                var userRemoves = notiManager.ListUser.Where(x => x.UserId.Equals(data.UserId)).ToList();
                                foreach (var item in userRemoves)
                                {
                                    notiManager.ListUser.Remove(item);
                                }

                                _context.NotificationManagers.Update(notiManager);
                            }
                        }
                    }

                    _context.SaveChanges();

                    msg.Title = _sharedResources["COM_DELETE_SUCCESS"];
                    var act = _context.ActivityInstances.FirstOrDefault(x => x.ActivityInstCode == data.ActivityCodeInst);
                    if (act != null)
                    {
                        GetAllMemberAssignWF(act.WorkflowCode);
                    }
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["WFAI_MSG_RECORD_NO_EXIST"];
                }

            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public object RoleUpdateCommand(string actInstCode)
        {
            var data = _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst == actInstCode);
            var actInst = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == actInstCode);
            var session = HttpContext.GetSessionUser();
            var isUpdate = false;

            if (session.IsAllData)
            {
                isUpdate = true;
            }
            else
            {
                if (actInst != null && actInst.CreatedBy == session.UserName)
                {
                    isUpdate = true;
                }
                else
                {
                    if (data.Any())
                    {
                        foreach (var item in data)
                        {
                            if (item.UserId == session.UserId && item.Role == "ROLE_ACT_REPOSITIVE")
                            {
                                isUpdate = true;
                                break;
                            }
                        }
                    }
                }
            }
            return isUpdate;
        }

        [HttpPost]
        public object CheckPermissionEditActivity(string actInstCode)
        {
            var check = false;
            var session = HttpContext.GetSessionUser();
            var data = _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst.Equals(actInstCode));
            var act = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(actInstCode));
            //if (session.IsAllData || (act != null && act.CreatedBy.Equals(ESEIM.AppContext.UserName)))
            //{
            //    check = true;
            //}
            //else
            if (data.Any())
            {
                if (data.Any(x => x.UserId.Equals(session.UserId)))
                {
                    check = true;
                }
            }
            return check;
        }

        [HttpPost]
        public object CheckPermissionEditActivityById(int id)
        {
            var check = false;
            var act = _context.ActivityInstances.FirstOrDefault(x => x.ID == id);
            if (act != null)
            {
                var session = HttpContext.GetSessionUser();

                var data = _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst.Equals(act.ActivityInstCode));
                if (data.Any())
                {
                    if (data.Any(x => x.UserId.Equals(session.UserId)))
                    {
                        check = true;
                    }
                }
            }

            return check;
        }

        [HttpGet]
        public PermissionModel GetPermission(string actInstCode)
        {
            var session = HttpContext.GetSessionUser();
            var data = _context.ExcuterControlRoleInsts.Where(x => x.ActivityCodeInst.Equals(actInstCode) && !x.IsDeleted);
            var act = _context.ActivityInstances.FirstOrDefault(x => x.ActivityInstCode.Equals(actInstCode) && !x.IsDeleted);
            var permissionApprove = false;
            var perUpdateRoleAssign = false;
            if (data.Any(x => x.UserId.Equals(ESEIM.AppContext.UserId)))
            {
                var assigned = data.FirstOrDefault(x => x.UserId.Equals(ESEIM.AppContext.UserId));
                if (assigned.Role.Equals("ROLE_ACT_REPOSITIVE"))
                {
                    permissionApprove = true;
                    perUpdateRoleAssign = true;
                }
                if (assigned.Role.Equals("ROLE_ACT_LEADER") || session.IsAllData || (act != null && act.CreatedBy.Equals(session.UserName)))
                {
                    perUpdateRoleAssign = true;
                }
            }
            else
            {
                if (session.IsAllData || (act != null && act.CreatedBy.Equals(session.UserName)))
                {
                    perUpdateRoleAssign = true;
                }
            }
            return new PermissionModel()
            {
                PermisstionApprove = permissionApprove,
                PermissionChangeRole = perUpdateRoleAssign
            };
        }

        public class AssignModel
        {
            public string ActivityCode { get; set; }
        }

        public class PermissionModel
        {
            public bool PermisstionApprove { get; set; }
            public bool PermissionChangeRole { get; set; }
        }

        #endregion

        #region Assign member Workflow instance

        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetMemberAssignWF(string wfInstCode)
        {
            var session = HttpContext.GetSessionUser();
            var lstUser = new List<UserManagerWF>();
            var wfInst = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.WfInstCode.Equals(wfInstCode));
            if (wfInst != null)
            {
                if (!string.IsNullOrEmpty(wfInst.UserManager))
                {
                    lstUser = JsonConvert.DeserializeObject<List<UserManagerWF>>(wfInst.UserManager);
                }
            }

            var query = (from a in lstUser
                         join b in _context.Users on a.UserId equals b.Id
                         join c in _context.AdDepartments.Where(x => !x.IsDeleted && x.IsEnabled) on b.DepartmentId equals c.DepartmentCode into c1
                         from c2 in c1.DefaultIfEmpty()
                         select new
                         {
                             UserId = b.Id,
                             GivenName = b.GivenName,
                             Role = a.Role,
                             Department = !string.IsNullOrEmpty(b.DepartmentId) ? b.DepartmentId : "",
                             DepartmentName = c2 != null ? c2.Title : "",
                             RoleSys = (from m in _context.UserRoles.Where(x => x.UserId.Equals(b.Id))
                                        join n in _context.Roles on m.RoleId equals n.Id
                                        select n).FirstOrDefault() != null ? (from m in _context.UserRoles.Where(x => x.UserId.Equals(b.Id))
                                                                              join n in _context.Roles on m.RoleId equals n.Id
                                                                              select n).FirstOrDefault().Title : "Nhân viên"
                         }).ToList();
            return Json(query);
        }

        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetAllMemberAssignWF(string wfInstCode)
        {
            var actInsts = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(wfInstCode));
            var lst = new List<LstAssign>();
            if (actInsts.Any())
            {
                foreach (var item in actInsts)
                {
                    var query = (from a in _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted)
                                 join b in _context.Users on a.UserId equals b.Id
                                 join c in _context.AdDepartments.Where(x => !x.IsDeleted && x.IsEnabled) on b.DepartmentId equals c.DepartmentCode into c1
                                 from c2 in c1.DefaultIfEmpty()
                                 where a.ActivityCodeInst.Equals(item.ActivityInstCode)
                                 select new LstAssign
                                 {
                                     Id = a.ID,
                                     ActInstName = item.Title,
                                     UserId = b.Id,
                                     GivenName = b.GivenName,
                                     Role = a.Role,
                                     Department = !string.IsNullOrEmpty(b.DepartmentId) ? b.DepartmentId : "",
                                     DepartmentName = c2 != null ? c2.Title : "",
                                     Status = a.Status,
                                     RoleSys = (from m in _context.UserRoles.Where(x => x.UserId.Equals(b.Id))
                                                join n in _context.Roles on m.RoleId equals n.Id
                                                select n).FirstOrDefault() != null ? (from m in _context.UserRoles.Where(x => x.UserId.Equals(b.Id))
                                                                                      join n in _context.Roles on m.RoleId equals n.Id
                                                                                      select n).FirstOrDefault().Title : "Nhân viên"
                                 }).ToList();
                    lst.AddRange(query);
                }
            }
            var groupUser = lst.GroupBy(x => x.UserId).Select(
                g => new
                {
                    UserId = g.Key,
                    ActivityRole = g.Select(x => new
                    {
                        x.GivenName,
                        x.Department,
                        x.DepartmentName,
                        x.RoleSys,
                        x.Id,
                        x.ActInstName,
                        x.Role,
                        x.Status
                    })
                }
                );
            var wfInstance = _context.WorkflowInstances.FirstOrDefault(x => x.WfInstCode == wfInstCode);
            var userList = lst.DistinctBy(x => x.UserId).Select(x => x.UserId);
            if (wfInstance != null)
            {
                wfInstance.UserList = JsonConvert.SerializeObject(userList);
                _context.WorkflowInstances.Update(wfInstance);

                _context.SaveChanges();
            }
            return Json(groupUser);
        }

        [HttpPost]
        public JsonResult AssignWF([FromBody] AssignWfModel obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var wfInstance = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.WfInstCode.Equals(obj.WfInstCode));
                if (wfInstance != null)
                {
                    var lstUser = new List<UserManagerWF>();
                    if (!string.IsNullOrEmpty(wfInstance.UserManager))
                    {
                        lstUser = JsonConvert.DeserializeObject<List<UserManagerWF>>(wfInstance.UserManager);
                    }
                    if (!lstUser.Any(x => x.UserId == obj.UserId))
                    {
                        var userManager = new UserManagerWF
                        {
                            UserId = obj.UserId,
                            Department = obj.Department,
                            Group = obj.Group,
                            Role = obj.Role
                        };
                        lstUser.Add(userManager);
                        wfInstance.UserManager = JsonConvert.SerializeObject(lstUser);
                        _context.WorkflowInstances.Update(wfInstance);
                        _context.SaveChanges();
                        msg.Title = _sharedResources["COM_ADD_SUCCESS"];
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = _stringLocalizer["WFAI_MSG_EMPLOYEE_EXIST"];
                    }

                    var listUserNotify = new List<UserNotify>();
                    foreach (var item in lstUser)
                    {
                        //Add user to Notification
                        var userNotify = new UserNotify
                        {
                            UserId = item.UserId
                        };

                        if (!listUserNotify.Any(p => p.UserId.Equals(userNotify.UserId)) && !userNotify.UserId.Equals(ESEIM.AppContext.UserId))
                            listUserNotify.Add(userNotify);
                    }

                    if (listUserNotify.Count > 0)
                    {
                        var session = HttpContext.GetSessionUser();

                        var notification = new NotificationManager
                        {
                            ListUser = listUserNotify,
                            Title = string.Format("{0} đã tạo 1 luồng việc mới: {1}", session.FullName, wfInstance.WfInstName),
                            ObjCode = wfInstance.WfInstCode,
                            ObjType = EnumHelper<NotificationType>.GetDisplayValue(NotificationType.WorkFlow),
                        };

                        UpdateNotification(notification);
                    }
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult DeleteAssignWF(string wfInstCode, string userId)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var wfInstance = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.WfInstCode.Equals(wfInstCode));
                if (wfInstance != null)
                {
                    var lstUser = new List<UserManagerWF>();
                    var lst = new List<UserManagerWF>();
                    if (!string.IsNullOrEmpty(wfInstance.UserManager))
                    {
                        lstUser = JsonConvert.DeserializeObject<List<UserManagerWF>>(wfInstance.UserManager);
                    }
                    foreach (var item in lstUser)
                    {
                        if (!item.UserId.Equals(userId))
                        {
                            lst.Add(item);
                        }
                    }
                    wfInstance.UserManager = JsonConvert.SerializeObject(lst);
                    _context.WorkflowInstances.Update(wfInstance);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_DELETE_SUCCESS"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult UpdateRoleAssign(string wfInstCode, string userId, string role)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var wfInstance = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.WfInstCode.Equals(wfInstCode));
                if (wfInstance != null)
                {
                    var lstUser = new List<UserManagerWF>();
                    if (!string.IsNullOrEmpty(wfInstance.UserManager))
                    {
                        lstUser = JsonConvert.DeserializeObject<List<UserManagerWF>>(wfInstance.UserManager);
                    }
                    foreach (var item in lstUser)
                    {
                        if (item.UserId.Equals(userId))
                        {
                            item.Role = role;
                            break;
                        }
                    }
                    wfInstance.UserManager = JsonConvert.SerializeObject(lstUser);
                    _context.WorkflowInstances.Update(wfInstance);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_UPDATE_SUCCESS"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [AllowAnonymous]
        [HttpPost]
        public object CheckPermisstionEditWF(string wfInstCode)
        {
            var lstUser = new List<UserManagerWF>();
            var wfInst = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.WfInstCode.Equals(wfInstCode));
            if (wfInst != null)
            {
                if (!string.IsNullOrEmpty(wfInst.UserManager))
                {
                    lstUser = JsonConvert.DeserializeObject<List<UserManagerWF>>(wfInst.UserManager);
                }
            }
            var checkPermission = false;
            var session = HttpContext.GetSessionUser();
            if (session.IsAllData)
            {
                checkPermission = true;
            }
            else if (wfInst.CreatedBy.Equals(session.UserName) || lstUser.Any(x => x.UserId.Equals(session.UserId)))
            {
                checkPermission = true;
            }
            return checkPermission;
        }

        [AllowAnonymous]
        [HttpPost]
        public object CheckPermissionAssignWF(string wfInstCode)
        {
            var lstUser = new List<UserManagerWF>();
            var wfInst = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.WfInstCode.Equals(wfInstCode));
            if (wfInst != null)
            {
                if (!string.IsNullOrEmpty(wfInst.UserManager))
                {
                    lstUser = JsonConvert.DeserializeObject<List<UserManagerWF>>(wfInst.UserManager);
                }
            }
            var isPermissionAssign = false;
            var session = HttpContext.GetSessionUser();

            if (session.IsAllData || wfInst.CreatedBy == ESEIM.AppContext.UserName)
            {
                isPermissionAssign = true;
                return isPermissionAssign;
            }

            if (lstUser.Any(x => x.UserId.Equals(session.UserId)))
            {
                isPermissionAssign = true;
            }

            return isPermissionAssign;
        }

        public class AssignWfModel
        {
            public string UserId { get; set; }
            public string Role { get; set; }
            public string Group { get; set; }
            public string Department { get; set; }
            public string WfInstCode { get; set; }
        }
        public class UserManagerWF
        {
            public string UserId { get; set; }
            public string Role { get; set; }
            public string Group { get; set; }
            public string Department { get; set; }
        }
        public class LstAssign
        {
            public int Id { get; set; }
            public string UserId { get; set; }
            public string GivenName { get; set; }
            public string Role { get; set; }
            public string Department { get; set; }
            public string DepartmentName { get; set; }
            public string Status { get; set; }
            public string RoleSys { get; set; }
            public string ActInstName { get; set; }
        }

        #endregion

        #region Share file

        [HttpPost]
        public JsonResult GetObjFileShare()
        {
            var data = new List<ObjFileShare>();
            var contract = new ObjFileShare
            {
                Code = "CONTRACT",
                Name = "Hợp đồng bán"
            };
            data.Add(contract);

            var contractPO = new ObjFileShare
            {
                Code = "CONTRACT_PO",
                Name = "Hợp đồng mua"
            };
            data.Add(contractPO);

            var project = new ObjFileShare
            {
                Code = "PROJECT",
                Name = "Dự án/đấu thầu"
            };
            data.Add(project);

            var customer = new ObjFileShare
            {
                Code = "CUSTOMER",
                Name = "Khách hàng"
            };
            data.Add(customer);

            var supp = new ObjFileShare
            {
                Code = "SUPPLIER",
                Name = "Nhà cung cấp"
            };
            data.Add(supp);

            var product = new ObjFileShare
            {
                Code = "PRODUCT",
                Name = "Hàng hóa và vật tư"
            };
            data.Add(product);

            var jobCard = new ObjFileShare
            {
                Code = "JOBCARD",
                Name = "Thẻ việc"
            };
            data.Add(jobCard);

            var asset = new ObjFileShare
            {
                Code = "ASSET",
                Name = "Tài sản"
            };
            data.Add(asset);

            var fund = new ObjFileShare
            {
                Code = "FUND",
                Name = "Quỹ"
            };
            data.Add(fund);

            var user = new ObjFileShare
            {
                Code = "USER",
                Name = "Tệp tin đã tải lên"
            };
            data.Add(user);

            var cms = new ObjFileShare
            {
                Code = "CMS",
                Name = "Bài viết"
            };
            data.Add(cms);

            return Json(data);
        }

        [HttpPost]
        public JsonResult GetFileByObjShare([FromBody] FileShareModel jTablePara)
        {
            int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;
            IQueryable<GridFileShare> query = null;

            if (string.IsNullOrEmpty(jTablePara.ObjCode))
            {
                var query2 = (from a in _context.EDMSFiles.Where(x => !x.IsDeleted && (x.IsFileMaster == null || x.IsFileMaster == true))
                              join b in _context.EDMSRepoCatFiles on a.FileCode equals b.FileCode
                              join d in _context.EDMSRepositorys on a.ReposCode equals d.ReposCode into d2
                              from d in d2.DefaultIfEmpty()
                              join e in _context.EDMSCategorys.Where(x => !x.IsDeleted) on b.CatCode equals e.CatCode into e1
                              from e in e1.DefaultIfEmpty()
                              where (jTablePara.LstObjCode.Count() != 0 && (jTablePara.LstObjCode.Any(x => x == b.CatCode)))
                              select new { a, b, d, e });
                var query3 = query2.AsNoTracking().Skip(intBeginFor).Take(jTablePara.Length);
                var count = (from a in _context.EDMSFiles.Where(x => !x.IsDeleted && (x.IsFileMaster == null || x.IsFileMaster == true))
                             join b in _context.EDMSRepoCatFiles on a.FileCode equals b.FileCode
                             select a).AsNoTracking().Count();

                query = query3.Select(x => new GridFileShare
                {
                    Id = x.b != null ? x.b.Id : -1,
                    FileCode = x.a.FileCode,
                    FileName = x.a.FileName,
                    FileCreated = x.a.CreatedBy,
                    FileUrl = x.a.Url,
                });
            }
            else
            {
                switch (jTablePara.ObjCode)
                {
                    case "CONTRACT":
                        query = GetFileContract();
                        break;

                    case "CONTRACT_PO":
                        query = GetFileContractPO();
                        break;

                    case "PROJECT":
                        query = GetFileProject();
                        break;

                    case "CUSTOMER":
                        query = GetFileCustomer();
                        break;

                    case "SUPPLIER":
                        query = GetFileSupplier();
                        break;

                    case "PRODUCT":
                        query = GetFileProduct();
                        break;

                    case "JOBCARD":
                        query = GetFileCardJob();
                        break;

                    case "ASSET":
                        query = GetFileAsset();
                        break;

                    case "FUND":
                        query = GetFileFund();
                        break;

                    case "CMS":
                        query = GetFileCms();
                        break;

                    case "USER":
                        query = GetFileUser();
                        break;
                }
            }
            if (query != null && query.Any())
            {
                var count = query.Count();
                var data = query.OrderUsingSortExpression(jTablePara.QueryOrderBy).Skip(intBeginFor).Take(jTablePara.Length).AsNoTracking().ToList();
                var jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, count, "Id", "FileName", "FileCode", "FileUrl", "FileCreated");
                return Json(jdata);
            }
            else
            {
                var jdata = JTableHelper.JObjectTable(new List<GridFileShare>(), jTablePara.Draw, 0, "Id", "FileName", "FileCode", "FileUrl", "FileCreated");
                return Json(jdata);
            }
        }

        [NonAction]
        public IQueryable<GridFileShare> GetFileContract()
        {
            var query = from a in _context.EDMSRepoCatFiles.Where(x => x.ObjectType == EnumHelper<ContractEnum>.GetDisplayValue(ContractEnum.Contract))
                        join b in _context.EDMSFiles.Where(x => !x.IsDeleted) on a.FileCode equals b.FileCode
                        join f in _context.EDMSRepositorys on a.ReposCode equals f.ReposCode into f1
                        from f in f1.DefaultIfEmpty()
                        select new GridFileShare
                        {
                            Id = a.Id,
                            FileCode = b.FileCode,
                            FileName = b.FileName,
                            FileUrl = b.Url,
                            FileCreated = b.CreatedBy
                        };
            return query;
        }

        [NonAction]
        public IQueryable<GridFileShare> GetFileContractPO()
        {
            var query = from a in _context.EDMSRepoCatFiles.Where(x => x.ObjectType == EnumHelper<PoSupplierEnum>.GetDisplayValue(PoSupplierEnum.PoSupplier))
                        join b in _context.EDMSFiles.Where(x => !x.IsDeleted) on a.FileCode equals b.FileCode
                        join f in _context.EDMSRepositorys on a.ReposCode equals f.ReposCode into f1
                        from f in f1.DefaultIfEmpty()
                        select new GridFileShare
                        {
                            Id = a.Id,
                            FileCode = b.FileCode,
                            FileName = b.FileName,
                            FileUrl = b.Url,
                            FileCreated = b.CreatedBy
                        };
            return query;
        }

        [NonAction]
        public IQueryable<GridFileShare> GetFileProject()
        {
            var query = from a in _context.EDMSRepoCatFiles.Where(x => x.ObjectType == EnumHelper<ProjectEnum>.GetDisplayValue(ProjectEnum.Project))
                        join b in _context.EDMSFiles on a.FileCode equals b.FileCode
                        join f in _context.EDMSRepositorys on a.ReposCode equals f.ReposCode into f1
                        from f in f1.DefaultIfEmpty()
                        select new GridFileShare
                        {
                            Id = a.Id,
                            FileCode = b.FileCode,
                            FileName = b.FileName,
                            FileUrl = b.Url,
                            FileCreated = b.CreatedBy
                        };
            return query;
        }

        [NonAction]
        public IQueryable<GridFileShare> GetFileCustomer()
        {
            var query = from a in _context.EDMSRepoCatFiles.Where(x => x.ObjectType == EnumHelper<CustomerEnum>.GetDisplayValue(CustomerEnum.Customer))
                        join b in _context.EDMSFiles on a.FileCode equals b.FileCode
                        join f in _context.EDMSRepositorys on a.ReposCode equals f.ReposCode into f1
                        from f in f1.DefaultIfEmpty()
                        select new GridFileShare
                        {
                            Id = a.Id,
                            FileCode = b.FileCode,
                            FileName = b.FileName,
                            FileUrl = b.Url,
                            FileCreated = b.CreatedBy
                        };
            return query;
        }

        [NonAction]
        public IQueryable<GridFileShare> GetFileSupplier()
        {
            var query = from a in _context.EDMSRepoCatFiles.Where(x => x.ObjectType == EnumHelper<SupplierEnum>.GetDisplayValue(SupplierEnum.Supplier))
                        join b in _context.EDMSFiles on a.FileCode equals b.FileCode
                        join f in _context.EDMSRepositorys on a.ReposCode equals f.ReposCode into f1
                        from f in f1.DefaultIfEmpty()
                        select new GridFileShare
                        {
                            Id = a.Id,
                            FileCode = b.FileCode,
                            FileName = b.FileName,
                            FileUrl = b.Url,
                            FileCreated = b.CreatedBy
                        };
            return query;
        }

        [NonAction]
        public IQueryable<GridFileShare> GetFileProduct()
        {
            var query = ((from a in _context.EDMSRepoCatFiles.Where(x => x.ObjectType == EnumHelper<WarehouseEnum>.GetDisplayValue(WarehouseEnum.Warehouse))
                          join b in _context.EDMSFiles on a.FileCode equals b.FileCode
                          join f in _context.EDMSRepositorys on a.ReposCode equals f.ReposCode into f1
                          from f in f1.DefaultIfEmpty()
                          select new GridFileShare
                          {
                              Id = a.Id,
                              FileCode = b.FileCode,
                              FileName = b.FileName,
                              FileUrl = b.Url,
                              FileCreated = b.CreatedBy
                          }).Union(
                          from a in _context.EDMSRepoCatFiles.Where(x => x.ObjectType == EnumHelper<EnumMaterialProduct>.GetDisplayValue(EnumMaterialProduct.Product))
                          join b in _context.EDMSFiles on a.FileCode equals b.FileCode
                          join f in _context.EDMSRepositorys on a.ReposCode equals f.ReposCode into f1
                          from f in f1.DefaultIfEmpty()
                          select new GridFileShare
                          {
                              Id = a.Id,
                              FileCode = b.FileCode,
                              FileName = b.FileName,
                              FileUrl = b.Url,
                              FileCreated = b.CreatedBy
                          })).AsNoTracking();
            return query;
        }

        [NonAction]
        public IQueryable<GridFileShare> GetFileCardJob()
        {
            var query = from a in _context.CardAttachments.Where(x => !x.Flag)
                        select new GridFileShare
                        {
                            Id = a.Id,
                            FileCode = a.FileCode,
                            FileName = a.FileName,
                            FileUrl = a.FileUrl,
                            FileCreated = a.MemberId
                        };
            return query;
        }

        [NonAction]
        public IQueryable<GridFileShare> GetFileAsset()
        {
            var query = from a in _context.EDMSRepoCatFiles.Where(x => x.ObjectType == EnumHelper<AssetEnum>.GetDisplayValue(AssetEnum.Asset))
                        join b in _context.EDMSFiles.Where(x => !x.IsDeleted && x.IsFileMaster == null || x.IsFileMaster == true) on a.FileCode equals b.FileCode
                        join f in _context.EDMSRepositorys on a.ReposCode equals f.ReposCode into f1
                        from f in f1.DefaultIfEmpty()
                        select new GridFileShare
                        {
                            Id = a.Id,
                            FileCode = b.FileCode,
                            FileName = b.FileName,
                            FileUrl = b.Url,
                            FileCreated = b.CreatedBy
                        };
            return query;
        }

        [NonAction]
        public IQueryable<GridFileShare> GetFileFund()
        {
            var query = _context.FundFiless.Where(x => !x.IsDeleted).Select(x => new GridFileShare
            {
                Id = x.Id,
                FileCode = x.FileCode,
                FileName = x.FileName,
                FileUrl = x.FilePath,
                FileCreated = x.CreatedBy
            });
            return query;
        }

        [NonAction]
        public IQueryable<GridFileShare> GetFileCms()
        {
            var query = from a in _context.cms_attachments
                        select new GridFileShare
                        {
                            Id = a.id,
                            FileCode = "",
                            FileName = a.file_name,
                            FileUrl = a.file_url,
                            FileCreated = ""
                        };
            return query;
        }

        [NonAction]
        public IQueryable<GridFileShare> GetFileUser()
        {
            var query = (from a in _context.EDMSRepoCatFiles
                         join b in _context.EDMSFiles.Where(x => !x.IsDeleted && x.CreatedBy.Equals(ESEIM.AppContext.UserName) && x.IsFileMaster == null || x.IsFileMaster == true) on a.FileCode equals b.FileCode
                         join f in _context.EDMSRepositorys on a.ReposCode equals f.ReposCode into f1
                         from f in f1.DefaultIfEmpty()
                         select new GridFileShare
                         {
                             Id = a.Id,
                             FileCode = b.FileCode,
                             FileName = b.FileName,
                             FileUrl = b.Url,
                             FileCreated = b.CreatedBy
                         }).Union(
                  from a in _context.FundFiless.Where(x => !x.IsDeleted && x.CreatedBy.Equals(ESEIM.AppContext.UserName))
                  select new GridFileShare
                  {
                      Id = a.Id,
                      FileCode = a.FileCode,
                      FileName = a.FileName,
                      FileUrl = a.FilePath,
                      FileCreated = a.CreatedBy
                  }).Union(
                from a in _context.CardAttachments.Where(x => !x.Flag && x.MemberId.Equals(ESEIM.AppContext.UserName))
                select new GridFileShare
                {
                    Id = a.Id,
                    FileCode = a.FileCode,
                    FileName = a.FileName,
                    FileUrl = a.FileUrl,
                    FileCreated = a.MemberId
                }).Union(
                from a in _context.cms_attachments
                select new GridFileShare
                {
                    Id = a.id,
                    FileCode = "",
                    FileName = a.file_name,
                    FileUrl = a.file_url,
                    FileCreated = ""
                });
            return query;
        }

        [HttpPost]
        public JsonResult InsertFileShare([FromBody] List<FilesShareObjectUserModel> obj)
        {
            var msg = new JMessage { Title = "", Error = false };
            try
            {
                if (obj.Any())
                {
                    foreach (var item in obj)
                    {
                        var check = _context.FilesShareObjectUsers.FirstOrDefault(x => !x.IsDeleted && x.FileID.Equals(item.FileID)
                            && JsonConvert.DeserializeObject<ObjRelative>(x.ObjectRelative).ObjectInstance.Equals(item.ObjectInstance));
                        if (check == null)
                        {
                            var rela = new ObjRelative
                            {
                                ObjectType = "ACT_INST",
                                ObjectInstance = item.ObjectInstance
                            };
                            var files = new FilesShareObjectUser
                            {
                                CreatedBy = ESEIM.AppContext.UserName,
                                CreatedTime = DateTime.Now,
                                FileID = item.FileID,
                                FileCreated = item.FileCreated,
                                FileUrl = item.FileUrl,
                                FileName = item.FileName,
                                ObjectRelative = JsonConvert.SerializeObject(rela),
                                ListUserShare = string.Empty
                            };
                            _context.FilesShareObjectUsers.Add(files);

                        }
                    }
                    _context.SaveChanges();
                    msg.Title = _stringLocalizer["WFAI_MSG_SELECT_FILE_SUCCESS"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult GetTemplate()
        {
            var data = _context.ActivityFiles.Where(x => !x.IsDeleted)
                .Select(x => new { Code = x.FileID, Name = x.FileName });
            return Json(data);
        }

        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
        [RequestSizeLimit(long.MaxValue)]
        public object UploadFile(IFormFile fileUpload)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var upload = _upload.UploadFile(fileUpload, Path.Combine(_hostingEnvironment.WebRootPath, "uploads\\files"));
                if (upload.Error)
                {
                    msg.Error = true;
                    msg.Title = upload.Title;
                }
                else
                {
                    var mimeType = fileUpload.ContentType;
                    var extension = Path.GetExtension(fileUpload.FileName);
                    msg.Object = upload.Object;
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex.Message;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult AddAttachment([FromBody] ActivityInstFile data)
        {
            var msg = new JMessage() { Error = true };
            try
            {
                string code = "ATTACHMENT_" + data.ActivityInstCode + (_context.ActivityInstFiles.Count() > 0 ? _context.ActivityInstFiles.Last().ID + 1 : 0);
                data.FileID = code;
                data.CreatedTime = DateTime.Now;
                data.CreatedBy = ESEIM.AppContext.UserName;
                _context.ActivityInstFiles.Add(data);
                _context.SaveChanges();

                msg.Title = _sharedResources["COM_MSG_DOWLOAD_SUCCESS"];
                msg.Error = false;
                return Json(msg);
            }
            catch (Exception ex)
            {
                msg.Object = ex;
                msg.Title = _sharedResources["COM_MSG_ERR"];
                return Json(msg);
            }
        }

        [HttpPost]
        public JsonResult GetAttachment(string actInstCode)
        {
            var data = ((from a in _context.ActivityInstFiles.Where(x => x.ActivityInstCode.Equals(actInstCode) && !x.IsDeleted)
                         select new LstAttachment
                         {
                             Id = a.ID,
                             FileName = a.FileName,
                             FileUrl = a.FilePath,
                             MemberId = a.CreatedBy,
                             FileCode = a.FileID,
                             CreatedTime = a.CreatedTime.Value,
                             Type = 1,
                             Icon = "",
                             Color = "",
                             RequireSign = a.SignatureRequire,
                             JsonSign = !string.IsNullOrEmpty(a.SignatureJson) ? a.SignatureJson : "",
                             SignTime = "",
                             IsSigned = false,
                             IsSelect = false
                         }).Union(
                from a in _context.FilesShareObjectUsers.Where(x => !x.IsDeleted
                     && JsonConvert.DeserializeObject<ObjRelative>(x.ObjectRelative).ObjectType.Equals("ACT_INST")
                     && JsonConvert.DeserializeObject<ObjRelative>(x.ObjectRelative).ObjectInstance.Equals(actInstCode))
                select new LstAttachment
                {
                    Id = a.ID,
                    FileName = a.FileName,
                    FileUrl = a.FileUrl,
                    MemberId = a.CreatedBy,
                    FileCode = a.FileID,
                    CreatedTime = a.CreatedTime,
                    Type = 2,
                    Icon = "",
                    Color = "",
                    RequireSign = false,
                    JsonSign = "",
                    SignTime = "",
                    IsSigned = false,
                    IsSelect = false
                })).ToList();
            foreach (var item in data)
            {
                var extension = Path.GetExtension(item.FileUrl);
                if (extension.Equals(".doc") || extension.Equals(".docx"))
                {
                    item.Icon = "fa fa-file-word-o";
                    item.Color = "rgb(13,118,206);font-size: 15px;";
                }
                else if (extension.Equals(".xls") || extension.Equals(".xlsx"))
                {
                    item.Icon = "fa fa-file-excel-o";
                    item.Color = "rgb(106,170,89);font-size: 15px;";
                }
                else if (extension.Equals(".pdf"))
                {
                    item.Icon = "fa fa-file-pdf-o";
                    item.Color = "rgb(226,165,139);font-size: 15px;";
                }
                //'.JPG', '.PNG', '.TIF', '.TIFF'
                else if (extension.ToUpper().Equals(".JPG") || extension.ToUpper().Equals(".PNG")
                    || extension.ToUpper().Equals(".TIF") || extension.ToUpper().Equals(".TIFF"))
                {
                    item.Icon = "fa fa-picture-o";
                    item.Color = "rgb(42,42,42);font-size: 15px;";
                }
                else
                {
                    item.Icon = "fa fa-file-o";
                    item.Color = "rgb(42,42,42);font-size: 15px;";
                }

                if (!string.IsNullOrEmpty(item.JsonSign))
                {
                    var signJson = JsonConvert.DeserializeObject<List<JsonSignature>>(item.JsonSign);
                    foreach (var i in signJson.OrderByDescending(x => x.SignTime))
                    {
                        if (i.Signer == ESEIM.AppContext.UserName)
                        {
                            item.IsSigned = true;
                            item.SignTime = i.SignTime.ToString("HH:mm dd/MM/yyyy");
                            break;
                        }
                    }
                }
            }
            return Json(data);
        }

        [HttpPost]
        public JsonResult DeleteAttachment([FromBody] DelAttachment obj)
        {
            var msg = new JMessage() { Error = true };
            var currentUser = ESEIM.AppContext.UserName;
            try
            {
                if (obj.Type == 1)
                {
                    var data = _context.ActivityInstFiles.FirstOrDefault(x => x.FileID.Equals(obj.FileCode) && x.ActivityInstCode == obj.ActInstCode && !x.IsDeleted);
                    if (data != null)
                    {
                        if (data.CreatedBy == currentUser)
                        {
                            data.IsDeleted = true;
                            data.DeletedBy = currentUser;
                            data.DeletedTime = DateTime.Now;
                            _context.ActivityInstFiles.Update(data);
                            _context.SaveChanges();

                            msg.Error = false;
                            msg.Title = _sharedResources["COM_DELETE_SUCCESS"];
                        }
                        else
                        {
                            msg.Error = true;
                            msg.Title = _stringLocalizer["WFAI_MSG_U_NOT_CREATOR"];
                        }
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = _stringLocalizer["WFAI_MSG_NOT_FOUND_FILE"];
                    }
                }
                else if (obj.Type == 2)
                {
                    var data = _context.FilesShareObjectUsers.FirstOrDefault(x => !x.IsDeleted && x.FileID.Equals(obj.FileCode)
                    && JsonConvert.DeserializeObject<ObjRelative>(x.ObjectRelative).ObjectType.Equals("ACT_INST")
                    && JsonConvert.DeserializeObject<ObjRelative>(x.ObjectRelative).ObjectInstance.Equals(obj.ActInstCode));
                    if (data != null)
                    {
                        if (data.CreatedBy == ESEIM.AppContext.UserName)
                        {
                            data.IsDeleted = true;
                            data.DeletedBy = ESEIM.AppContext.UserName;
                            data.DeletedTime = DateTime.Now;
                            _context.FilesShareObjectUsers.Update(data);
                            _context.SaveChanges();
                            msg.Error = false;
                            msg.Title = _sharedResources["COM_DELETE_SUCCESS"];
                        }
                        else
                        {
                            msg.Error = true;
                            msg.Title = _stringLocalizer["CJ_MSG_CANNOT_DELETE"];
                        }
                    }
                }
                return Json(msg);
            }
            catch (Exception ex)
            {
                msg.Object = ex;
                msg.Title = _sharedResources["COM_MSG_ERR"];
                return Json(msg);
            }
        }

        [HttpGet]
        public object IsFileEdms(string fileCode, string url)
        {
            var data = (from a in _context.EDMSRepoCatFiles.Where(x => x.FileCode.Equals(fileCode))
                        join b in _context.EDMSRepositorys on a.ReposCode equals b.ReposCode into b2
                        from b in b2.DefaultIfEmpty()
                        join c in _context.EDMSFiles on a.FileCode equals c.FileCode into c2
                        from c in c2.DefaultIfEmpty()
                        where c.Url.Equals(url)
                        select new
                        {
                            a.Id,
                            Server = (b != null ? b.Server : null),
                            Type = (b != null ? b.Type : null),
                            Url = (c != null ? c.Url : null),
                            FileId = (c != null ? c.CloudFileId : null),
                            FileTypePhysic = c.FileTypePhysic,
                            c.FileName,
                            c.MimeType,
                            b.Account,
                            b.PassWord,
                            c.FileCode,
                            c.IsEdit,
                            c.IsFileMaster,
                            c.FileParentId,
                            c.FileID,
                            c.ListUserView
                        }).FirstOrDefault();
            if (data != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        [HttpGet]
        public IActionResult Download(string fileCode, string url)
        {
            try
            {
                var data = (from a in _context.EDMSRepoCatFiles.Where(x => x.FileCode.Equals(fileCode))
                            join b in _context.EDMSRepositorys on a.ReposCode equals b.ReposCode into b2
                            from b in b2.DefaultIfEmpty()
                            join c in _context.EDMSFiles on a.FileCode equals c.FileCode into c2
                            from c in c2.DefaultIfEmpty()
                            where c.Url.Equals(url)
                            select new
                            {
                                a.Id,
                                Server = (b != null ? b.Server : null),
                                Type = (b != null ? b.Type : null),
                                Url = (c != null ? c.Url : null),
                                FileId = (c != null ? c.CloudFileId : null),
                                FileTypePhysic = c.FileTypePhysic,
                                c.FileName,
                                c.MimeType,
                                b.Account,
                                b.PassWord,
                                c.FileCode,
                                c.IsEdit,
                                c.IsFileMaster,
                                c.FileParentId,
                                c.FileID,
                                c.ListUserView
                            }).FirstOrDefault();
                if (data != null)
                {
                    if (data.Type == "SERVER")
                    {
                        if (!string.IsNullOrEmpty(data.Server))
                        {
                            string ftphost = data.Server;
                            string ftpfilepath = data.Url;
                            var urlEnd = System.Web.HttpUtility.UrlPathEncode("ftp://" + ftphost + ftpfilepath);
                            using (WebClient request = new WebClient())
                            {
                                request.Credentials = new NetworkCredential(data.Account, data.PassWord);
                                byte[] fileData = request.DownloadData(urlEnd);
                                return File(fileData, data.MimeType, string.Concat(data.FileName, data.FileTypePhysic));
                            }
                        }
                    }
                    else
                    {
                        var fileData = FileExtensions.DownloadFileGoogle(_hostingEnvironment.WebRootPath + "\\files\\credentials.json", _hostingEnvironment.WebRootPath + "\\files\\token.json", data.FileId);
                        return File(fileData, data.MimeType, string.Concat(data.FileName, data.FileTypePhysic));
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return null;
        }

        [HttpPost]
        public JsonResult ViewFileOnline([FromBody] ViewFileObj obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                

                DocmanController.pathFile = string.Empty;
                DocmanController.pathFileFTP = string.Empty;

                ExcelController.pathFile = string.Empty;
                ExcelController.pathFileFTP = string.Empty;

                PDFController.pathFile = string.Empty;
                PDFController.pathFileFTP = string.Empty;

                var aseanDoc = new AseanDocument();
                

                var edms = (from a in _context.EDMSRepoCatFiles.Where(x => x.FileCode.Equals(obj.FileCode))
                            join b in _context.EDMSRepositorys on a.ReposCode equals b.ReposCode into b2
                            from b in b2.DefaultIfEmpty()
                            join c in _context.EDMSFiles on a.FileCode equals c.FileCode into c2
                            from c in c2.DefaultIfEmpty()
                            where c.Url.Equals(obj.Url)
                            select new
                            {
                                a.Id,
                                Server = (b != null ? b.Server : null),
                                Type = (b != null ? b.Type : null),
                                Url = (c != null ? c.Url : null),
                                FileId = (c != null ? c.CloudFileId : null),
                                FileTypePhysic = c.FileTypePhysic,
                                c.FileName,
                                c.MimeType,
                                b.Account,
                                b.PassWord,
                                c.FileCode,
                                c.IsEdit,
                                c.IsFileMaster,
                                c.FileParentId,
                                c.FileID,
                                c.ListUserView
                            }).FirstOrDefault();

                var actInst = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == obj.ActInstCode);
                if (actInst != null)
                {
                    aseanDoc.ObjCode = obj.ActInstCode;
                    aseanDoc.WfInstCode = actInst.WorkflowCode;
                    SignSendNotify(actInst);
                }

                if (edms == null)
                {
                    var extension = Path.GetExtension(obj.Url);
                    var filePath = "";
                    aseanDoc.File_Code = obj.FileCode;
                    aseanDoc.Mode = obj.Mode;
                    aseanDoc.FirstPage = "/Admin/CardJob";
                    aseanDoc.IsSign = obj.IsSign;
                    aseanDoc.File_Name = Path.GetFileName(obj.Url);
                    aseanDoc.File_Type = extension;

                    aseanDoc.ObjType = EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.FileVersionActInst);

                    if (extension.ToLower().Equals(".doc") || extension.ToLower().Equals(".docx"))
                    {
                        if (obj.IsSign)
                        {
                            IsSigne IsSigned = IsSign(obj.FileCode, obj.ActInstCode);

                            var listSig = IsSigned.IsNotFrist;
                            if (IsSigned.IsSigned)
                            {
                                msg.Error = true;
                                msg.Title = "Bạn đã ký tài liệu này rồi";
                                return Json(msg);
                            }

                            var jMess = GenerateSign(obj.Url, listSig, actInst.Title);
                            if (jMess.Error)
                            {
                                msg.Error = true;
                                msg.Title = jMess.Title;
                                return Json(msg);
                            }

                            filePath = jMess.Object.ToString();

                            if (actInst != null)
                            {
                                var lstActInst = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode == actInst.WorkflowCode)
                                                .Select(x => x.ActivityInstCode);

                                var fileVersions = _context.FileVersions.Where(x => !x.IsDeleted &&
                                                              !string.IsNullOrEmpty(x.ObjCode) && lstActInst.Any(p => p.Equals(x.ObjCode)) &&
                                                              !string.IsNullOrEmpty(x.ObjCode) && x.ObjType.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.FileVersionActInst))).ToList();

                                var version = fileVersions.Count > 0 ? fileVersions.Max(x => x.Version + 1) : 1;

                                var fVersion = new ESEIM.Models.FileVersion
                                {
                                    Version = version,
                                    CreatedBy = ESEIM.AppContext.UserName,
                                    CreatedTime = DateTime.Now,
                                    FileCode = obj.FileCode,
                                    ObjCode = obj.ActInstCode,
                                    ObjType = EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.FileVersionActInst),
                                    Url = filePath,
                                };
                                _context.FileVersions.Add(fVersion);
                            }

                            var fileInst = _context.ActivityInstFiles.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == obj.ActInstCode
                                            && x.FileID == obj.FileCode);
                            if (fileInst != null)
                            {
                                var lstJsonSign = new List<JsonSignature>();
                                if (!string.IsNullOrEmpty(fileInst.SignatureJson))
                                {
                                    lstJsonSign = JsonConvert.DeserializeObject<List<JsonSignature>>(fileInst.SignatureJson);
                                }
                                var jsonSign = new JsonSignature
                                {
                                    Signer = ESEIM.AppContext.UserName,
                                    SignTime = DateTime.Now
                                };
                                lstJsonSign.Add(jsonSign);

                                fileInst.SignatureJson = JsonConvert.SerializeObject(lstJsonSign);
                                fileInst.FilePath = filePath;
                                fileInst.IsSign = true;
                                fileInst.LstUserSign += string.Join(",", ESEIM.AppContext.UserId);
                                _context.ActivityInstFiles.Update(fileInst);
                            }
                            _context.SaveChanges();

                            DocmanController.docmodel = aseanDoc;
                            DocmanController.pathFile = filePath;
                            //DocmanController.cardCode = obj.ActInstCode;
                        }
                        else
                        {
                            string rootPath = _hostingEnvironment.WebRootPath;
                            var pathSrc = string.Concat(rootPath, obj.Url);

                            //Lưu 1 file mới
                            var fileStream = new FileStream(pathSrc, FileMode.Open);
                            var pathNew = "/uploads/files/tempFile/";
                            var pathFileNew = string.Concat(rootPath, pathNew);
                            if (!Directory.Exists(pathFileNew)) Directory.CreateDirectory(pathFileNew);

                            var fileName = "FILE_TEMP"
                              + Guid.NewGuid().ToString().Substring(0, 8)
                              + Path.GetExtension(obj.Url);
                            var fileVersionPath = string.Concat(pathFileNew, fileName);

                            //var fileName = Path.GetFileName(obj.Url);
                            var fileNewPath = string.Concat(pathFileNew, fileName);

                            MemoryStream memoryStream = new MemoryStream();
                            fileStream.CopyTo(memoryStream);

                            FileStream fileVersion = new FileStream(fileNewPath, FileMode.Create, FileAccess.Write);
                            memoryStream.WriteTo(fileVersion);
                            memoryStream.Position = 0;
                            fileStream.Close();
                            fileVersion.Close();
                            memoryStream.Close();
                            DocmanController.docmodel = aseanDoc;
                            DocmanController.pathFile = string.Concat(pathNew, fileName);

                            var fileInst = _context.ActivityInstFiles.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == obj.ActInstCode
                                           && x.FileID == obj.FileCode);
                            if (fileInst != null)
                            {
                                fileInst.FilePath = string.Concat(pathNew, fileName);
                                _context.ActivityInstFiles.Update(fileInst);
                                _context.SaveChanges();
                            }
                        }
                    }
                    else if (extension.Equals(".xls") || extension.Equals(".xlsx"))
                    {
                        ExcelController.pathFileFTP = "";
                        ExcelController.docmodel = aseanDoc;
                        ExcelController.fileCode = obj.FileCode;
                        ExcelController.pathFile = obj.Url;
                        ExcelController.cardCode = obj.ActInstCode;
                    }
                    else if (extension.Equals(".pdf"))
                    {
                        PDFController.docmodel = aseanDoc;
                        PDFController.pathFile = obj.Url;
                    }
                }
                else
                {
                    if (!string.IsNullOrEmpty(edms.Server))
                    {
                        string ftphost = edms.Server;
                        string ftpfilepath = edms.Url;
                        var urlEnd = System.Web.HttpUtility.UrlPathEncode("ftp://" + ftphost + ftpfilepath);
                        var fileTempName = edms.FileName + Path.GetExtension(edms.FileName);
                        using (WebClient request = new WebClient())
                        {
                            request.Credentials = new NetworkCredential(edms.Account, edms.PassWord);
                            byte[] fileData = request.DownloadData(urlEnd);
                            JMessage msg1 = _upload.UploadFileByBytes(fileData, fileTempName, _hostingEnvironment.WebRootPath, "uploads\\files");
                            string path = msg1.Object.ToString();
                            string pathConvert = "/" + path.Replace("\\", "/");

                            var extension = Path.GetExtension(path);
                            aseanDoc.Mode = obj.Mode;
                            aseanDoc.FirstPage = "/Admin/CardJob";

                            if (extension.ToLower().Equals(".doc") || extension.ToLower().Equals(".docx"))
                            {
                                if (obj.IsSign)
                                {
                                    IsSigne IsSigned = IsSign(obj.FileCode, obj.ActInstCode);

                                    var listSig = IsSigned.IsNotFrist;
                                    if (IsSigned.IsSigned)
                                    {
                                        msg.Error = true;
                                        msg.Title = "Bạn đã ký tài liệu này rồi";
                                        return Json(msg);
                                    }
                                    var filePath = string.Empty;
                                    var jMess = GenerateSign(pathConvert, listSig, actInst.Title);
                                    if (jMess.Error)
                                    {
                                        msg.Error = true;
                                        msg.Title = jMess.Title;
                                        return Json(msg);
                                    }
                                    filePath = jMess.Object.ToString();

                                    if (actInst != null)
                                    {
                                        var lstActInst = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode == actInst.WorkflowCode)
                                                        .Select(x => x.ActivityInstCode);

                                        var fileVersions = _context.FileVersions.Where(x => !x.IsDeleted &&
                                                                      !string.IsNullOrEmpty(x.ObjCode) && lstActInst.Any(p => p.Equals(x.ObjCode)) &&
                                                                      !string.IsNullOrEmpty(x.ObjCode) && x.ObjType.Equals(EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.FileVersionActInst))).ToList();

                                        var version = fileVersions.Count > 0 ? fileVersions.Max(x => x.Version + 1) : 1;

                                        var fVersion = new ESEIM.Models.FileVersion
                                        {
                                            Version = version,
                                            CreatedBy = ESEIM.AppContext.UserName,
                                            CreatedTime = DateTime.Now,
                                            FileCode = obj.FileCode,
                                            ObjCode = obj.ActInstCode,
                                            ObjType = EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.FileVersionActInst),
                                            Url = filePath,
                                        };
                                        _context.FileVersions.Add(fVersion);
                                    }

                                    
                                    _context.SaveChanges();

                                    aseanDoc.ObjType = EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.FileVersionActInst);
                                    aseanDoc.File_Code = obj.FileCode;
                                    aseanDoc.File_Path = pathConvert;
                                    aseanDoc.FullPathView = ftpfilepath;
                                    aseanDoc.IsSign = true;

                                    DocmanController.docmodel = aseanDoc;
                                    DocmanController.pathFile = filePath;
                                    //DocmanController.cardCode = obj.ActInstCode;
                                }
                                else
                                {
                                    string rootPath = _hostingEnvironment.WebRootPath;
                                    var pathSrc = string.Concat(rootPath, pathConvert);

                                    //Lưu 1 file mới
                                    var fileStream = new FileStream(pathSrc, FileMode.Open);
                                    var pathNew = "/uploads/files/tempFile/";
                                    var pathFileNew = string.Concat(rootPath, pathNew);
                                    if (!Directory.Exists(pathFileNew)) Directory.CreateDirectory(pathFileNew);
                                    var fileName = Path.GetFileName(obj.Url);
                                    var fileNewPath = string.Concat(pathFileNew, fileName);

                                    MemoryStream memoryStream = new MemoryStream();
                                    fileStream.CopyTo(memoryStream);

                                    FileStream fileVersion = new FileStream(fileNewPath, FileMode.Create, FileAccess.Write);
                                    memoryStream.WriteTo(fileVersion);
                                    fileVersion.Close();
                                    memoryStream.Position = 0;

                                    fileStream.Close();
                                    DocmanController.docmodel = aseanDoc;
                                    DocmanController.pathFile = string.Concat(pathNew, fileName);

                                    var fileInst = _context.ActivityInstFiles.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == obj.ActInstCode
                                                   && x.FileID == obj.FileCode);
                                    if (fileInst != null)
                                    {
                                        fileInst.FilePath = string.Concat(pathNew, fileName);
                                        _context.ActivityInstFiles.Update(fileInst);
                                        _context.SaveChanges();
                                    }

                                    DocmanController.docmodel = aseanDoc;
                                    DocmanController.pathFile = string.Concat(pathNew, fileName);
                                }
                            }
                            else if (extension.Equals(".xls") || extension.Equals(".xlsx"))
                            {
                                ExcelController.pathFileFTP = "";
                                ExcelController.docmodel = aseanDoc;
                                ExcelController.fileCode = obj.FileCode;
                                ExcelController.pathFile = pathConvert;
                                ExcelController.cardCode = obj.ActInstCode;
                            }
                            else if (extension.Equals(".pdf"))
                            {
                                PDFController.docmodel = aseanDoc;
                                PDFController.pathFile = pathConvert;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult GetFileSign(string actInst)
        {
            var file = _context.ActivityInstFiles.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == actInst);
            return Json(file);
        }

        [HttpPost]
        public bool IsFileSign(string actInst)
        {
            var sign = false;
            var fileInst = _context.ActivityInstFiles.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == actInst);
            if (fileInst != null)
            {
                if (fileInst.IsSign)
                {
                    if (!string.IsNullOrEmpty(fileInst.LstUserSign))
                    {
                        var lstUsr = fileInst.LstUserSign.Split(",", StringSplitOptions.None);
                        if (lstUsr.Any(x => x == ESEIM.AppContext.UserName))
                        {
                            sign = true;
                        }
                    }
                }
            }
            return sign;
        }

        [NonAction]
        public JMessage GenerateSign(string path,bool isSign,string WhoSign)
        {
            var msg = new JMessage { Title = _sharedResources["COM_MSG_SUCCES_SAVE"], Error = false };

            string rootPath = _hostingEnvironment.WebRootPath;
            var filePath = string.Concat(rootPath, path);
            var fileStream = new FileStream(filePath, FileMode.Open);
            var user = _context.Users.FirstOrDefault(x => x.UserName.Equals(User.Identity.Name));
            var userSignImage = !string.IsNullOrEmpty(user.SignImage) ? string.Concat(rootPath, user.SignImage) : "";
            if (string.IsNullOrEmpty(userSignImage))
            {
                fileStream.Dispose();
                msg.Error = true;
                msg.Title = _stringLocalizer["WFAI_MSG_USER_NO_SIGNATURE"];
                return msg;

            }
            try
            {
                WordDocument document = new WordDocument(fileStream, Syncfusion.DocIO.FormatType.Docx);
                if (!string.IsNullOrEmpty(userSignImage))
                {
                    var textQrCode = string.Concat(user.GivenName, " đã ký ", DateTime.Now.ToString("HH:mm dd/MM/yyyy"));
                    //Add Bookmark  
                    IWSection section = document.Sections[0];
                    if (!isSign)
                    {
                        using (FileStream stream = new FileStream(userSignImage, FileMode.Open))
                        {
                            // Đọc dữ liệu từ FileStream và chuyển đổi thành mảng byte
                            byte[] signBytes = new byte[stream.Length];
                            stream.Read(signBytes, 0, (int)stream.Length);

                            byte[] resizedSignature = CommonUtil.ResizeImage(signBytes, 100, 100);
                            IWParagraph paragraph = section.AddParagraph();
                            //Adds new text to the paragraph
                            paragraph.AppendText(WhoSign);
                            paragraph.ApplyStyle(BuiltinStyle.Heading5);

                            // Tạo một bảng trong lần ký đầu tiên
                            IWTable table = section.AddTable();
                            table.TableFormat.Borders.BorderType = BorderStyle.None;

                            table.ResetCells(1, 2); // Tạo một hàng và hai ô cho bảng

                            // Thêm hình ảnh chữ ký vào ô đầu tiên
                            IWParagraph cell1Paragraph = table[0,0].AddParagraph();

                            cell1Paragraph.AppendPicture(resizedSignature); // Chèn hình ảnh chữ ký

                            cell1Paragraph.AppendPicture(CommonUtil.ResizeImage(CommonUtil.GeneratorQRCode(textQrCode), 100, 100));
                            cell1Paragraph.AppendText("\n");
                            cell1Paragraph.AppendText(textQrCode);
                            // Điều chỉnh căn chỉnh của các phần tử trong ô để chúng được căn giữa
                            cell1Paragraph.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Center;
                        }
                    }
                    else
                    {
                        WTable table = section.Tables[section.Tables.Count-1] as WTable;
                        WTableRow LastRow = table.LastRow as WTableRow;
                        WTableCell LastCell = LastRow.Cells[LastRow.Cells.Count - 1] as WTableCell;
                        bool foundEmptyCell = LastCell.Paragraphs.Count > 1;

                        if (foundEmptyCell)
                        {
                            WTableRow row = table.AddRow();
                            using (FileStream stream = new FileStream(userSignImage, FileMode.Open))
                            {
                                // Đọc dữ liệu từ FileStream và chuyển đổi thành mảng byte
                                byte[] signBytes = new byte[stream.Length];
                                stream.Read(signBytes, 0, (int)stream.Length);

                                byte[] resizedSignature = CommonUtil.ResizeImage(signBytes, 100, 100);

                                LastRow = table.LastRow as WTableRow;

                                WTableCell FristCell = LastRow.Cells[0] as WTableCell;

                                IWParagraph cell1Paragraph = FristCell.AddParagraph();

                                cell1Paragraph.AppendPicture(resizedSignature); // Chèn hình ảnh chữ ký

                                cell1Paragraph.AppendPicture(CommonUtil.ResizeImage(CommonUtil.GeneratorQRCode(textQrCode), 100, 100));
                                cell1Paragraph.AppendText("\n");
                                cell1Paragraph.AppendText(textQrCode);
                                // Điều chỉnh căn chỉnh của các phần tử trong ô để chúng được căn giữa
                                cell1Paragraph.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Center;
                            }
                        }
                        else
                        {
                            using (FileStream stream = new FileStream(userSignImage, FileMode.Open))
                            {
                                // Đọc dữ liệu từ FileStream và chuyển đổi thành mảng byte
                                byte[] signBytes = new byte[stream.Length];
                                stream.Read(signBytes, 0, (int)stream.Length);

                                byte[] resizedSignature = CommonUtil.ResizeImage(signBytes, 100, 100);

                                // Thêm hình ảnh chữ ký vào ô đầu tiên
                                IWParagraph cell1Paragraph = LastCell.Paragraphs[0];
                                // Thêm hình ảnh chữ ký vào ô đầu tiên

                                cell1Paragraph.AppendPicture(resizedSignature); // Chèn hình ảnh chữ ký

                                cell1Paragraph.AppendPicture(CommonUtil.ResizeImage(CommonUtil.GeneratorQRCode(textQrCode), 100, 100));
                                cell1Paragraph.AppendText("\n");
                                cell1Paragraph.AppendText(textQrCode);
                                // Điều chỉnh căn chỉnh của các phần tử trong ô để chúng được căn giữa
                                cell1Paragraph.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Center;
                            }

                        }
                        
                    }

                    //IWSection section1 = document.AddSection();


                    
                    // Mở FileStream

                    //section.Paragraphs[section.Paragraphs.Count - 1].AppendPicture(CommonUtil.ResizeImage(CommonUtil.GeneratorQRCode(textQrCode), 100, 100));
                    //section.Paragraphs[section.Paragraphs.Count - 1].AppendText("\n");
                    //section.Paragraphs[section.Paragraphs.Count - 1].AppendText(textQrCode);
                    //bookmarkNavigator.InsertText(string.Concat(User.Identity.Name, "_", DateTime.Now.ToString("ddMMyyyy_HH:mm")));
                    #region Saving document
                    MemoryStream memoryStream = new MemoryStream();
                    //Save the document into memory stream
                    document.Save(memoryStream, Syncfusion.DocIO.FormatType.Docx);
                    //Closes the Word document instance
                    document.Close();

                    //Lưu 1 file sinh chữ ký
                    var pathVersion = "/uploads/files/fileVersion/";
                    var pathFileVersion = string.Concat(rootPath, pathVersion);
                    if (!Directory.Exists(pathFileVersion)) Directory.CreateDirectory(pathFileVersion);
                    var fileName = "FILE_VERSION_"
                              + Guid.NewGuid().ToString().Substring(0, 8)
                              + Path.GetExtension(path);
                    var fileVersionPath = string.Concat(pathFileVersion, fileName);
                    FileStream fileVersion = new FileStream(fileVersionPath, FileMode.Create, FileAccess.Write);
                    memoryStream.WriteTo(fileVersion);
                    fileVersion.Close();

                    //FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.Write);
                    //memoryStream.WriteTo(file);
                    //file.Close();

                    //signBytes.Close();
                    memoryStream.Position = 0;

                    msg.Object = string.Concat(pathVersion, fileName);
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["WFAI_MSG_PLS_ADD_SIGNATURE"];
                    msg.Object = path;
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _stringLocalizer["WFAI_MSG_SIGN_FAILED"];
                msg.Object = path;
                //signBytes.Close();
            }

            fileStream.Dispose();
            return msg;
            #endregion
        }

        [NonAction]
        public void SignSendNotify(ActivityInstance actInst)
        {
            //Send notify
            var listUser = new List<CardMemberCustom>();

            var assignInst = (_context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst == actInst.ActivityInstCode)
                    .Select(x => new CardMemberCustom
                    {
                        Id = x.ID,
                        UserId = x.UserId,
                        Responsibility = x.Role,
                        CreatedTime = x.CreatedTime.ToString("HH:mm dd/MM/yyyy")
                    })).ToList();
            listUser.AddRange(assignInst);

            var runnings = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityInitial == actInst.ActivityInstCode);
            foreach (var item in runnings)
            {
                var assignDes = (_context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst == item.ActivityDestination)
                                .Select(x => new CardMemberCustom
                                {
                                    Id = x.ID,
                                    UserId = x.UserId,
                                    Responsibility = x.Role,
                                    CreatedTime = x.CreatedTime.ToString("HH:mm dd/MM/yyyy")
                                })).ToList();
                listUser.AddRange(assignDes);
            }

            var timer = (DateTime?)null;
            if (actInst.Unit == "DURATION_UNIT20200904094128")
            {
                timer = actInst.StartTime.HasValue ? actInst.StartTime.Value.AddDays(Convert.ToDouble(actInst.Duration)) : (DateTime?)null;
            }
            if (actInst.Unit == "DURATION_UNIT20200904094132")
            {
                timer = actInst.StartTime.HasValue ? actInst.StartTime.Value.AddHours(Convert.ToDouble(actInst.Duration)) : (DateTime?)null;
            }
            if (actInst.Unit == "DURATION_UNIT20200904094135")
            {
                timer = actInst.StartTime.HasValue ? actInst.StartTime.Value.AddMinutes(Convert.ToDouble(actInst.Duration)) : (DateTime?)null;
            }
            if (actInst.Unit == "DURATION_UNIT20200904094139")
            {
                timer = actInst.StartTime.HasValue ? actInst.StartTime.Value.AddSeconds(Convert.ToDouble(actInst.Duration)) : (DateTime?)null;
            }

            var wfInfo = (from a in _context.WorkflowInstances.Where(x => !x.IsDeleted.Value && x.WfInstCode == actInst.WorkflowCode)
                          join b in _context.WorkFlows.Where(x => !x.IsDeleted.Value) on a.WorkflowCode equals b.WfCode
                          select new
                          {
                              a.ObjectInst,
                              b.WfName
                          }).FirstOrDefault();

            var session = HttpContext.GetSessionUser();
            var message = "Hoạt động " + actInst.Title + " thuộc luồng " + wfInfo.WfName + " đã được ký bởi " + session.FullName;
            SendPushNotification(listUser, message,
                new
                {
                    ActivityCode = actInst.ActivityCode,
                    ActivityInstCode = actInst.ActivityInstCode,
                    Desc = actInst.Desc,
                    Duration = actInst.Duration,
                    Group = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == actInst.Group).ValueSet ?? "",
                    ID = actInst.ID,
                    Located = actInst.Located,
                    ObjCode = wfInfo != null ? wfInfo.ObjectInst : "",
                    StatusCode = actInst.Status,
                    Timer = timer,
                    Title = actInst.Title,
                    Type = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == actInst.Type).ValueSet ?? "",
                    Unit = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == actInst.Unit).ValueSet ?? "",
                    WorkflowCode = actInst.WorkflowCode,
                    WfName = wfInfo != null ? wfInfo.WfName : ""
                },
                EnumHelper<FromSrcSendNotify>.GetDisplayValue(FromSrcSendNotify.FromActInst));
        }

        [HttpPost]
        public JsonResult GetActInstTo(string actInst)
        {
            var data = from a in _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityInitial == actInst)
                       join b in _context.ActivityInstances.Where(x => !x.IsDeleted) on a.ActivityDestination equals b.ActivityInstCode
                       select new ModelActTo
                       {
                           Id = b.ID,
                           Title = b.Title,
                           Code = b.ActivityInstCode
                       };
            return Json(data);
        }

        [HttpPost]
        public JsonResult AddActShareOfFile([FromBody] ModelAddActShare data)
        {
            var msg = new JMessage { Error = false, Title = "" };
            var lstFileCode = new List<string>();
            try
            {
                if (data.LstFile.Count == 0)
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["WFAI_MSG_PLS_SELECT_FILE"];
                    return Json(msg);
                }
                foreach (var file in data.LstFile)
                {
                    foreach (var act in data.LstActTo)
                    {
                        var fileActs = _context.ActivityInstFiles.Where(x => !x.IsDeleted && x.ActivityInstCode == act.Code);
                        if (!fileActs.Any(x => x.FileID == file.FileCode))
                        {
                            var fileRepoCat = _context.EDMSRepoCatFiles.FirstOrDefault(x => x.FileCode.Equals(file.FileCode));
                            if (fileRepoCat != null)
                            {
                                var edmsReposCatFile = new EDMSRepoCatFile
                                {
                                    FileCode = string.Concat("ActInst_", Guid.NewGuid().ToString()),
                                    ReposCode = fileRepoCat.ReposCode,
                                    CatCode = fileRepoCat.CatCode,
                                    ObjectCode = act.Code,
                                    ObjectType = EnumHelper<ActivityInst>.GetDisplayValue(ActivityInst.ActivityInst),
                                    Path = fileRepoCat.Path,
                                    FolderId = fileRepoCat.FolderId
                                };
                                _context.EDMSRepoCatFiles.Add(edmsReposCatFile);
                                lstFileCode.Add(edmsReposCatFile.FileCode);
                                var edmsFile = _context.EDMSFiles.FirstOrDefault(x => !x.IsDeleted && x.FileCode.Equals(file.FileCode));
                                if (edmsFile != null)
                                {
                                    var fileNew = string.Concat(Path.GetFileNameWithoutExtension(edmsFile.FileName), "_", Guid.NewGuid().ToString().Substring(0, 8), Path.GetExtension(edmsFile.FileName));
                                    var byteData = DownloadFileFromServer(fileRepoCat.Id);
                                    var urlUpload = UploadFileToServer(byteData, fileRepoCat.ReposCode, fileRepoCat.CatCode, fileNew, edmsFile.MimeType);
                                    if (!urlUpload.Error)
                                    {
                                        var edms = new EDMSFile
                                        {
                                            FileCode = edmsReposCatFile.FileCode,
                                            FileName = edmsFile.FileName,
                                            Desc = edmsFile.Desc,
                                            ReposCode = fileRepoCat.ReposCode,
                                            Tags = edmsFile.Tags,
                                            FileSize = edmsFile.FileSize,
                                            FileTypePhysic = edmsFile.FileTypePhysic,
                                            NumberDocument = edmsFile.NumberDocument,
                                            CreatedBy = ESEIM.AppContext.UserName,
                                            CreatedTime = DateTime.Now,
                                            Url = urlUpload.Object.ToString(),
                                            MimeType = edmsFile.MimeType,
                                            CloudFileId = edmsFile.CloudFileId,
                                        };
                                        _context.EDMSFiles.Add(edms);

                                        var actInstFile = new ActivityInstFile
                                        {
                                            FileID = edmsReposCatFile.FileCode,
                                            ActivityInstCode = act.Code,
                                            CreatedBy = ESEIM.AppContext.UserName,
                                            CreatedTime = DateTime.Now,
                                            IsSign = false,
                                            SignatureRequire = file.SignatureRequire
                                        };
                                        
                                        _context.ActivityInstFiles.Add(actInstFile);
                                    }
                                }
                            }
                        }
                    }
                }
                _context.SaveChanges();

                var files = from a in _context.EDMSRepoCatFiles.Where(x => lstFileCode.Any(k => k.Equals(x.FileCode)))
                            join b in _context.EDMSFiles.Where(x => !x.IsDeleted) on a.FileCode equals b.FileCode
                            select new { a, b };

                foreach (var item in data.LstActTo)
                {
                    var assigns = (from a in _context.Users.Select(x => new { Code = x.UserName, Name = x.GivenName, x.DepartmentId, UserId = x.Id })
                                   join b in _context.AdDepartments.Where(x => !x.IsDeleted && x.IsEnabled) on a.DepartmentId equals b.DepartmentCode into b1
                                   from b in b1.DefaultIfEmpty()
                                   join c in _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst.Equals(item.Code)) on a.UserId equals c.UserId
                                   select new
                                   {
                                       a.Code,
                                       a.Name,
                                       DepartmentName = b != null ? b.Title : "",
                                       Permission = new PermissionFile()
                                   }).ToList();
                    foreach (var file in files)
                    {
                        var rela = new
                        {
                            ObjectType = EnumHelper<ActivityInst>.GetDisplayValue(ActivityInst.ActivityInst),
                            ObjectInstance = file.a.Id
                        };
                        var share = new FilesShareObjectUser
                        {
                            CreatedBy = ESEIM.AppContext.UserName,
                            CreatedTime = DateTime.Now,
                            FileID = file.a.FileCode,
                            FileCreated = User.Identity.Name,
                            FileUrl = file.b.Url,
                            FileName = file.b.FileName,
                            ObjectRelative = JsonConvert.SerializeObject(rela),
                            ListUserShare = JsonConvert.SerializeObject(assigns)
                        };
                        _context.FilesShareObjectUsers.Add(share);
                    }
                }
                _context.SaveChanges();
                msg.Title = _sharedResources["COM_MSG_SUCCES_SAVE"];
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [NonAction]
        public IsSigne IsSign(string fileCode, string actInst)
        {
            var file = _context.ActivityInstFiles.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == actInst
                        && x.FileID == fileCode);
            var lstLogSign = new List<JsonSignature>();
            bool IsSigned = false;
            if (file != null)
            {
                var session = HttpContext.GetSessionUser();
                if (file.SignatureJson != null)
                {
                    lstLogSign = JsonConvert.DeserializeObject<List<JsonSignature>>(file.SignatureJson);
                    foreach(JsonSignature sign in lstLogSign)
                    {
                        if (sign.Signer == session.UserName && sign.Actins== actInst)
                        {
                            IsSigned = true;
                            break;
                        }
                    }
                }
            }
            return new IsSigne {
                IsNotFrist = lstLogSign.Count() > 0
                , IsSigned = IsSigned
            };
        }
        public class IsSigne
        {
            public bool IsSigned { get; set; }
            public bool IsNotFrist { get; set; }
        }
        [HttpPost]
        public JsonResult GetLogSignFile(string fileCode, string actInst)
        {
            var file = _context.ActivityInstFiles.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == actInst
                        && x.FileID == fileCode);
            var lstLogSign = new List<LogSignUser>();
            if (file != null)
            {
                if (!string.IsNullOrEmpty(file.SignatureJson))
                {
                    var json = JsonConvert.DeserializeObject<List<JsonSignature>>(file.SignatureJson);
                    lstLogSign = (from a in json
                                  join b in _context.Users on a.Signer equals b.UserName
                                  select new LogSignUser
                                  {
                                      GivenName = b.GivenName,
                                      CreatedTime = a.SignTime.ToString("HH:mm dd/MM/yyyy"),
                                      Picture = b.Picture
                                  }).ToList();
                }
            }
            return Json(lstLogSign);
        }

        [HttpPost]
        public bool CheckSignFileWithStatus(string actInstCode)
        {
            var isSignAll = true;
            var files = _context.ActivityInstFiles.Where(x => !x.IsDeleted && x.ActivityInstCode == actInstCode);
            foreach (var file in files)
            {
                if (file.SignatureRequire)
                {
                    if (string.IsNullOrEmpty(file.SignatureJson) && !file.IsSign)
                    {
                        isSignAll = false;
                    }
                    else
                    {
                        var lstSigner = JsonConvert.DeserializeObject<List<JsonSignature>>(file.SignatureJson);
                        if (!lstSigner.Any(x => x.Signer == ESEIM.AppContext.UserName))
                        {
                            isSignAll = false;
                        }
                    }
                }
            }
            return isSignAll;
        }

        public class LogSignUser
        {
            public string GivenName { get; set; }
            public string CreatedTime { get; set; }
            public string Picture { get; set; }
        }
        public class JsonSignature
        {
            public string Signer { get; set; }
            public DateTime SignTime { get; set; }
            public string Actins { get; set; }

        }
        public class ModelAddActShare
        {
            public ModelAddActShare()
            {
                LstActTo = new List<ModelActTo>();
                LstFile = new List<FileSelectModel>();
            }
            public string ActInstCode { get; set; }
            public List<FileSelectModel> LstFile { get; set; }
            public List<ModelActTo> LstActTo { get; set; }
        }
        public class FileSelectModel
        {
            public string FileCode { get; set; }
            public string FileName { get; set; }
            public string Type { get; set; }
            public string FilePath { get; set; }
            public bool SignatureRequire { get; set; }
            public decimal FileSize { get; set; }
        }
        public class ModelActTo
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Code { get; set; }
        }
        public class ObjFileShare
        {
            public string Code { get; set; }
            public string Name { get; set; }
        }
        public class FileShareModel : JTableModel
        {
            public string ObjCode { get; set; }
            public List<string> LstObjCode { get; set; }
        }
        public class GridFileShare
        {
            public int Id { get; set; }
            public string FileCode { get; set; }
            public string FileName { get; set; }
            public string FileUrl { get; set; }
            public string FileCreated { get; set; }
        }
        public class FilesShareObjectUserModel
        {
            public string FileID { get; set; }
            public string ObjectType { get; set; }
            public string ObjectInstance { get; set; }
            public string FileCreated { get; set; }
            public string FileUrl { get; set; }
            public string FileName { get; set; }
        }
        public class ObjRelative
        {
            public string ObjectType { get; set; }
            public string ObjectInstance { get; set; }
        }
        public class LstAttachment
        {
            public int Id { get; set; }
            public string FileName { get; set; }
            public string FileUrl { get; set; }
            public string MemberId { get; set; }
            public string FileCode { get; set; }
            public string Icon { get; set; }
            public string Color { get; set; }
            public DateTime CreatedTime { get; set; }
            public int Type { get; set; }
            public bool RequireSign { get; set; }
            public string JsonSign { get; set; }
            public string SignTime { get; set; }
            public bool IsSigned { get; set; }
            public bool IsSelect { get; set; }
        }
        public class DelAttachment
        {
            public int Type { get; set; }
            public string FileCode { get; set; }
            public string ActInstCode { get; set; }
        }
        public class ViewFileObj
        {
            public string FileCode { get; set; }
            public string Url { get; set; }
            public string ActInstCode { get; set; }
            public bool IsSign { get; set; }
            public int Mode { get; set; }
        }
        #endregion

        #region Command
        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetConfirm()
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == "CONFIRM_COMMAND")
                .Select(x => new { Code = x.CodeSet, Name = x.ValueSet, Color = x.Logo });
            return Json(data);
        }

        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetCommand()
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == "COMMAND_WF_INSTANCE")
                .OrderBy(x => x.Priority).Select(x => new { Code = x.CodeSet, Name = x.ValueSet, Color = x.Logo });
            return Json(data);
        }

        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetApprove()
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == "APPROVE_COMMAND")
                .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
            return Json(data);
        }

        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetStatusCommand()
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals("STATUS_COMMAND"))
                .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
            return Json(data);
        }

        [HttpGet]
        public object GetDesActivity(string actInstCode)
        {
            var actTo = (from a in _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityInitial == actInstCode)
                         join b in _context.ActivityInstances.Where(x => !x.IsDeleted) on a.ActivityDestination equals b.ActivityInstCode
                         select new ModelCommand
                         {
                             Code = a.ActivityDestination,
                             Name = b.Title,
                             CommandStr = a.Command,
                             StartTime = b.StartTime,
                             Duration = b.Duration,
                             Unit = b.Unit,
                             CommandText = "",
                             IsLeader = false,
                             WfInstCode = a.WfInstCode
                         }).DistinctBy(x => x.Code).ToList();

            var actFrom = (from a in _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityDestination == actInstCode)
                           join b in _context.ActivityInstances.Where(x => !x.IsDeleted) on a.ActivityInitial equals b.ActivityInstCode
                           select new ModelCommand
                           {
                               Code = a.ActivityInitial,
                               Name = b.Title,
                               CommandStr = a.Command,
                               StartTime = b.StartTime,
                               Duration = b.Duration,
                               Unit = b.Unit,
                               CommandText = "",
                               IsLeader = false,
                               WfInstCode = a.WfInstCode
                           }).DistinctBy(x => x.Code).ToList();

            var actInst = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == actInstCode);
            foreach (var act in actTo)
            {
                if (!string.IsNullOrEmpty(act.CommandStr))
                {
                    var command = JsonConvert.DeserializeObject<List<JsonCommand>>(act.CommandStr);
                    var cmd = command.Count > 0 ? _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == command.LastOrDefault().CommandSymbol) : null;
                    if (cmd != null)
                    {
                        act.CommandText = "Lệnh: " + cmd.ValueSet;
                    }
                    act.Command = command.LastOrDefault();
                }
                if (act.Unit == "DURATION_UNIT20200904094128")
                {
                    act.StartTime = act.StartTime.HasValue ? act.StartTime.Value.AddDays(Convert.ToDouble(act.Duration)) : (DateTime?)null;
                }
                if (act.Unit == "DURATION_UNIT20200904094132")
                {
                    act.StartTime = act.StartTime.HasValue ? act.StartTime.Value.AddHours(Convert.ToDouble(act.Duration)) : (DateTime?)null;
                }
                if (act.Unit == "DURATION_UNIT20200904094135")
                {
                    act.StartTime = act.StartTime.HasValue ? act.StartTime.Value.AddMinutes(Convert.ToDouble(act.Duration)) : (DateTime?)null;
                }
                if (act.Unit == "DURATION_UNIT20200904094139")
                {
                    act.StartTime = act.StartTime.HasValue ? act.StartTime.Value.AddSeconds(Convert.ToDouble(act.Duration)) : (DateTime?)null;
                }
            }

            foreach (var act in actFrom)
            {
                if (!string.IsNullOrEmpty(act.CommandStr))
                {
                    var command = JsonConvert.DeserializeObject<List<JsonCommand>>(act.CommandStr);
                    if (command.Count > 1)
                    {
                        var cmd = command.Count > 0 ? _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == command.LastOrDefault().CommandSymbol) : new CommonSetting();
                        if (cmd != null)
                        {
                            act.CommandText = "Lệnh: " + cmd.ValueSet;
                        }
                        act.Command = command.LastOrDefault();
                    }
                }
            }
            return new
            {
                LstActTo = actTo,
                LstActFrom = actFrom.Where(x => !string.IsNullOrEmpty(x.CommandText))
            };
        }

        [HttpPost]
        public JsonResult GetCommandFromLeader(string actInstCode)
        {
            var actInst = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == actInstCode);
            var lstActFrom = new List<ModelCommand>();
            if (actInst != null)
            {
                var running = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.WfInstCode == actInst.WorkflowCode);
                foreach (var item in running)
                {
                    if (!string.IsNullOrEmpty(item.Command))
                    {
                        var lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(item.Command);
                        if (lstCommand.Count > 0)
                        {
                            var command = lstCommand.LastOrDefault(x => x.ActB.Equals(actInstCode) && x.IsLeader);
                            if (command != null)
                            {
                                var actFrom = new ModelCommand
                                {
                                    Code = actInstCode,
                                    Name = "Lãnh đạo gửi lệnh",
                                    CommandStr = item.Command,
                                    StartTime = actInst.StartTime,
                                    Duration = actInst.Duration,
                                    Unit = actInst.Unit,
                                    CommandText = "",
                                    IsLeader = true,
                                    WfInstCode = actInst.WorkflowCode,
                                    Command = command,
                                };
                                lstActFrom.Add(actFrom);
                            }
                        }
                    }
                }
            }
            return Json(lstActFrom.DistinctBy(x => x.Code));
        }

        [HttpPost]
        public JsonResult SetCommandRepeat(string actInst)
        {
            var lstCmdRepeat = new List<CmdRepeat>();
            var runningFrom = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityDestination == actInst);
            foreach (var item in runningFrom)
            {
                var check = false;
                var runningTo = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityInitial == item.ActivityInitial);
                foreach (var to in runningTo)
                {
                    var lstCmd = JsonConvert.DeserializeObject<List<JsonCommand>>(to.Command);
                    if (lstCmd.Count > 0)
                    {
                        if (lstCmd.LastOrDefault().Confirmed == "CONFIRM_COMMAND_N")
                        {
                            check = true;
                            break;
                        }
                    }
                }

                var act = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == item.ActivityInitial);
                if (act != null)
                {
                    var cmd = new CmdRepeat
                    {
                        Check = check,
                        ActInst = act.ActivityInstCode
                    };
                    lstCmdRepeat.Add(cmd);
                }
            }
            return Json(lstCmdRepeat);
        }

        [HttpPost]
        public JsonResult RunningCommand([FromBody] ModelCommandRunning data)
        {
            var msg = new JMessage();
            try
            {
                var lstAssign = new List<CardMemberCustom>();

                var files = _context.ActivityInstFiles.Where(x => !x.IsDeleted && x.ActivityInstCode == data.ActInstCode);

                foreach (var item in data.ListCommand)
                {
                    var running = _context.WorkflowInstanceRunnings.FirstOrDefault(x => x.ActivityInitial == data.ActInstCode
                        && x.ActivityDestination == item.Code);
                    if (running != null)
                    {
                        var lstCommand = new List<JsonCommand>();

                        if (!string.IsNullOrEmpty(running.Command))
                        {
                            lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(running.Command);
                        }
                        if (item.Command != null)
                        {
                            var command = new JsonCommand
                            {
                                Approved = item.Command.Approved,
                                ApprovedBy = ESEIM.AppContext.UserName,
                                ApprovedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy"),
                                CommandSymbol = item.Command.CommandSymbol,
                                Id = lstCommand.Count == 0 ? 1 : (lstCommand.LastOrDefault().Id + 1),
                                Confirmed = "",
                                ConfirmedBy = "",
                                ConfirmedTime = "",
                                IsLeader = false,
                                ActA = data.ActInstCode,
                                ActB = item.Code,
                                Message = ""
                            };
                            lstCommand.Add(command);

                            running.Command = JsonConvert.SerializeObject(lstCommand);
                            if (item.Command.CommandSymbol != "COMMAND_WF_INSTANCE_BACK")
                            {
                                running.StartTime = DateTime.Now;
                            }
                            _context.WorkflowInstanceRunnings.Update(running);

                            //Unlock
                            var actInst = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == item.Code);
                            if (actInst != null)
                            {
                                //actInst.IsLock = false;
                                actInst.StartTime = DateTime.Now;
                                _context.ActivityInstances.Update(actInst);
                            }

                            var fileDes = _context.ActivityInstFiles.Where(x => !x.IsDeleted && x.ActivityInstCode == item.Code);
                            foreach (var file in files)
                            {
                                if (!fileDes.Any(x => x.FileID == file.FileID))
                                {
                                    var fileInst = new ActivityInstFile
                                    {
                                        ActivityInstCode = item.Code,
                                        CreatedBy = ESEIM.AppContext.UserName,
                                        CreatedTime = DateTime.Now,
                                        FileID = file.FileID,
                                        FileName = file.FileName,
                                        FilePath = file.FilePath,
                                        IsSign = false,
                                        SignatureRequire = true,
                                    };
                                    _context.ActivityInstFiles.Add(fileInst);
                                }
                            }
                        }
                    }
                    var assign = _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst == item.Code)
                        .Select(x => new CardMemberCustom
                        {
                            CreatedTime = "",
                            Id = x.ID,
                            Responsibility = "",
                            UserId = x.UserId
                        }).ToList();
                    lstAssign.AddRange(assign);
                }
                _context.SaveChanges();
                msg.Title = _stringLocalizer["WFAI_MSG_RUN_COMMAND_SUCCES"];
                SendNotifyCommand(lstAssign, data.ActInstCode, " đã được chạy lệnh bởi ");
            }
            catch (Exception ex)
            {
                msg.Object = ex;
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Error = true;
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult RunningOneCommand([FromBody] RunningOneCommandModel obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var lstAssign = new List<CardMemberCustom>();
                var running = _context.WorkflowInstanceRunnings.FirstOrDefault(x => !x.IsDeleted && x.ActivityInitial == obj.ActInst
                && x.ActivityDestination == obj.ActTo);
                if (running != null)
                {
                    var lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(running.Command);
                    var command = new JsonCommand
                    {
                        Approved = obj.Approve,
                        ApprovedBy = ESEIM.AppContext.UserName,
                        ApprovedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy"),
                        CommandSymbol = obj.Command,
                        Id = lstCommand.Count == 0 ? 1 : (lstCommand.LastOrDefault().Id + 1),
                        Confirmed = "",
                        ConfirmedBy = "",
                        ConfirmedTime = "",
                        IsLeader = false,
                        ActA = running.ActivityInitial,
                        ActB = running.ActivityDestination,
                        Message = ""
                    };
                    lstCommand.Add(command);
                    running.Command = JsonConvert.SerializeObject(lstCommand);
                    _context.WorkflowInstanceRunnings.Update(running);

                    //Unlock next activity
                    var actNext = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted
                                    && x.ActivityInstCode.Equals(obj.ActTo));
                    if (actNext != null)
                    {
                        if (actNext.Status.Equals("STATUS_ACTIVITY_NOT_DOING"))
                        {
                            actNext.StartTime = DateTime.Now;
                            actNext.Status = "STATUS_ACTIVITY_DOING";
                            _context.ActivityInstances.Update(actNext);

                            var wfInfo =
                                (from a in _context.WorkflowInstances.Where(x =>
                                        !x.IsDeleted.Value && x.WfInstCode == actNext.WorkflowCode)
                                 join b in _context.WorkFlows.Where(x => !x.IsDeleted.Value) on a.WorkflowCode equals b
                                     .WfCode
                                 select new
                                 {
                                     a.ObjectInst,
                                     b.WfName,
                                     a.ObjectType,
                                 }).FirstOrDefault();
                            // Log Object Status
                            _workflowService.AddLogStatusAll(wfInfo.ObjectType, wfInfo.ObjectInst,
                                "STATUS_ACTIVITY_DOING", actNext.Title, actNext.Type, ESEIM.AppContext.UserName);
                        }
                    }

                    //Real-time
                    UpdateChangeActInst(obj.ActInst);

                    //Log action user
                    var common = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(obj.Command));
                    if (common != null)
                    {
                        var action = new ActInstanceUserActivity
                        {
                            CreatedTime = DateTime.Now,
                            UserId = ESEIM.AppContext.UserId,
                            ActInstCode = obj.ActInst,
                            Action = "Đã thêm lệnh",
                            FromDevice = "Desktop/Laptop",
                            IdObject = "Command",
                            ChangeDetails = "[" + common.ValueSet + "]"
                        };
                        _context.ActInstanceUserActivitys.Add(action);
                    }
                    //End

                    _context.SaveChanges();
                    msg.Title = _stringLocalizer["WFAI_MSG_RUN_COMMAND_SUCCES"];

                    var assign = _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst == running.ActivityDestination)
                        .Select(x => new CardMemberCustom
                        {
                            CreatedTime = "",
                            Id = x.ID,
                            Responsibility = "",
                            UserId = x.UserId
                        }).ToList();
                    lstAssign.AddRange(assign);

                    SendNotifyCommand(lstAssign, obj.ActInst, " đã được chạy lệnh bởi ");
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult Approve(string actInstCode)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == actInstCode);

                if (data != null)
                {
                    data.Status = "STATUS_ACTIVITY_END";
                    _context.ActivityInstances.Update(data);
                    var act = (from a in _context.ActivityInstances.Where(x => !x.IsDeleted && x.ActivityInstCode == actInstCode)
                               join b in _context.Activitys.Where(x => !x.IsDeleted) on a.ActivityCode equals b.ActivityCode
                               select new
                               {
                                   ActInstCode = a.ActivityInstCode,
                                   ActCode = b.ActivityCode,
                                   Type = b.Type,
                                   WfCode = b.WorkflowCode,
                                   WfInstCode = a.WorkflowCode,
                               }).FirstOrDefault();

                    var actInst = (from a in _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode == act.WfInstCode)
                                   join b in _context.Activitys.Where(x => !x.IsDeleted && x.WorkflowCode == act.WfCode) on a.ActivityCode equals b.ActivityCode
                                   select new
                                   {
                                       ActInstCode = a.ActivityInstCode,
                                       ActCode = b.ActivityCode,
                                       Type = b.Type
                                   }).ToList();
                    var wfInst = _context.WorkflowInstances.FirstOrDefault(x => x.WfInstCode == act.WfInstCode);
                    if (wfInst != null && (wfInst.ObjectType == "NOT_WORK" || wfInst.ObjectType == "GOLATE" || wfInst.ObjectType == "QUITWORK"
                        || wfInst.ObjectType == "PLAN_SCHEDULE" || wfInst.ObjectType == "OVERTIME"))
                    {
                        if (act.ActCode == "3dbf8ea1-657f-4241-8cd1-f0f8937d90b1")
                        {
                            var obj = _context.WorkShiftCheckInOuts.FirstOrDefault(x => x.Id.ToString() == wfInst.ObjectInst);
                            if (obj != null)
                            {
                                obj.Approve = true;
                                _context.WorkShiftCheckInOuts.Update(obj);
                            }
                        }
                    }

                    var setting = (_context.WorkflowSettings.Where(x => !x.IsDeleted && x.WorkflowCode == act.WfCode)
                        .Select(x => new SettingWf
                        {
                            ActSrc = x.ActivityInitial,
                            ActDes = x.ActivityDestination,
                            Command = x.Command,
                            TransCode = x.TransitionCode
                        })).ToList();

                    var lstSetting = new List<SettingWf>();

                    foreach (var item in setting)
                    {
                        var obj = new SettingWf();
                        foreach (var k in actInst)
                        {
                            if (item.ActSrc == k.ActCode)
                            {
                                obj.ActSrc = k.ActInstCode;
                                break;
                            }
                        }
                        foreach (var k in actInst)
                        {
                            if (item.ActDes == k.ActCode)
                            {
                                obj.ActDes = k.ActInstCode;
                                break;
                            }
                        }
                        lstSetting.Add(obj);
                    }
                    _context.SaveChanges();
                    msg.Title = _sharedResources["Duyệt hoạt động thành công"]; // WFAI_MSG_APPROVE_ACTIVITY_SUCCES
                    foreach (var item in lstSetting)
                    {
                        if (item.ActSrc == act.ActInstCode)
                        {
                            var obj = new RunningOneCommandModel()
                            {
                                ActInst = item.ActSrc,
                                ActTo = item.ActDes,
                                Approve = "APPROVE_COMMAND_Y",
                                Command = "COMMAND_WF_INSTANCE_DO"
                            };
                            RunningOneCommand(obj);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult Unapprove(string actInstCode, string status)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == actInstCode);

                if (data != null)
                {
                    var wfInst = _context.WorkflowInstances.FirstOrDefault(x => x.WfInstCode == data.WorkflowCode);
                    if (wfInst != null && (wfInst.ObjectType == "NOT_WORK" || wfInst.ObjectType == "GOLATE" || wfInst.ObjectType == "QUITWORK"
                        || wfInst.ObjectType == "PLAN_SCHEDULE" || wfInst.ObjectType == "OVERTIME"))
                    {
                        if (data.ActivityCode == "3dbf8ea1-657f-4241-8cd1-f0f8937d90b1")
                        {
                            var obj = _context.WorkShiftCheckInOuts.FirstOrDefault(x => x.Id.ToString() == wfInst.ObjectInst);
                            if (obj != null)
                            {
                                obj.Approve = false;
                                _context.WorkShiftCheckInOuts.Update(obj);
                            }
                        }
                    }
                    data.Status = status;
                    _context.ActivityInstances.Update(data);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["Dừng hoạt động thành công"]; // WFAI_MSG_UNAPPROVE_ACTIVITY_SUCCES
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult ConfirmCommand([FromBody] ModelCommandRunning data)
        {
            var msg = new JMessage();
            try
            {
                var lstAssign = new List<CardMemberCustom>();
                foreach (var item in data.ListCommand)
                {
                    if (!item.IsLeader)
                    {
                        var running = _context.WorkflowInstanceRunnings.FirstOrDefault(x => x.ActivityInitial == item.Code
                            && x.ActivityDestination == data.ActInstCode);
                        if (running != null)
                        {
                            var lstCommand = new List<JsonCommand>();
                            if (!string.IsNullOrEmpty(running.Command))
                            {
                                lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(running.Command);
                            }

                            if (lstCommand.Count > 0)
                            {
                                lstCommand[lstCommand.Count - 1].Confirmed = item.Command.Confirmed;
                                lstCommand[lstCommand.Count - 1].ConfirmedBy = ESEIM.AppContext.UserName;
                                lstCommand[lstCommand.Count - 1].ConfirmedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy");
                                if (item.Command.Confirmed == "CONFIRM_COMMAND_Y")
                                {
                                    var act = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(data.ActInstCode));
                                    if (act != null)
                                    {
                                        if (lstCommand[lstCommand.Count - 1].CommandSymbol == "COMMAND_WF_INSTANCE_DO")
                                        {
                                            act.Status = "STATUS_ACTIVITY_DO";
                                            //act.IsLock = false;
                                        }
                                        else if (lstCommand[lstCommand.Count - 1].CommandSymbol == "COMMAND_WF_INSTANCE_NEXT")
                                        {
                                            if (act.Type != "TYPE_ACTIVITY_END")
                                            {
                                                act.Status = "STATUS_ACTIVITY_APPROVED";
                                                //act.IsLock = false;
                                                var wfInst = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.WfInstCode.Equals(act.WorkflowCode));
                                                if (wfInst != null)
                                                {
                                                    wfInst.EndTime = DateTime.Now;
                                                    wfInst.Status = "STATUS_WF_SUCCESS";
                                                    _context.WorkflowInstances.Update(wfInst);
                                                }
                                            }
                                            else
                                            {
                                                act.Status = "STATUS_ACTIVITY_APPROVE_END";
                                                //act.IsLock = false;
                                            }
                                        }
                                        else if (lstCommand[lstCommand.Count - 1].CommandSymbol == "COMMAND_WF_INSTANCE_STOP")
                                        {
                                            act.Status = "STATUS_ACTIVITY_STOP";
                                            //act.IsLock = false;
                                        }
                                        else if (lstCommand[lstCommand.Count - 1].CommandSymbol == "COMMAND_WF_INSTANCE_BACK")
                                        {
                                            act.Status = "STATUS_ACTIVITY_DO";
                                            //act.IsLock = false;
                                        }
                                        _context.ActivityInstances.Update(act);
                                    }
                                }

                                running.Command = JsonConvert.SerializeObject(lstCommand);
                            }
                            else
                            {
                                var command = new JsonCommand
                                {
                                    Approved = item.Command.Approved,
                                    ApprovedBy = item.Command.ApprovedBy,
                                    ApprovedTime = item.Command.ApprovedTime,
                                    CommandSymbol = item.Command.CommandSymbol,
                                    Id = 0,
                                    Confirmed = item.Command.Confirmed,
                                    ConfirmedBy = ESEIM.AppContext.UserName,
                                    ConfirmedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy"),
                                    IsLeader = false,
                                    ActA = running.ActivityInitial,
                                    ActB = running.ActivityDestination,
                                    Message = ""
                                };
                                lstCommand.Add(command);
                            }
                            running.Command = JsonConvert.SerializeObject(lstCommand);
                            _context.WorkflowInstanceRunnings.Update(running);
                        }

                        var assign = _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst == item.Code)
                            .Select(x => new CardMemberCustom
                            {
                                CreatedTime = x.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                Id = x.ID,
                                Responsibility = x.Role,
                                UserId = x.UserId
                            }).ToList();
                        lstAssign.AddRange(assign);
                    }
                    else
                    {
                        var running = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.WfInstCode == item.WfInstCode);
                        foreach (var run in running)
                        {

                            if (!string.IsNullOrEmpty(run.Command))
                            {
                                var lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(run.Command);
                                var command = lstCommand.LastOrDefault(x => x.ActB.Equals(data.ActInstCode) && x.IsLeader);
                                if (command != null)
                                {
                                    command.Confirmed = item.Command.Confirmed;
                                    command.ConfirmedBy = ESEIM.AppContext.UserName;
                                    command.ConfirmedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy");
                                    run.Command = JsonConvert.SerializeObject(lstCommand);
                                    _context.WorkflowInstanceRunnings.Update(run);
                                }
                            }
                        }
                    }
                }
                _context.SaveChanges();
                msg.Title = _stringLocalizer["WFAI_MSG_CONFIRM_COMMAND_SUCCES"];

                SendNotifyCommand(lstAssign, data.ActInstCode, " đã được xác nhận lệnh bởi ");
            }
            catch (Exception ex)
            {
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Error = true;
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult ConfirmOneCommand([FromBody] ConfirmOneCommandModel data)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var lstAssign = new List<CardMemberCustom>();

                if (!data.IsLeader)
                {
                    var running = _context.WorkflowInstanceRunnings.FirstOrDefault(x => x.ActivityInitial == data.ActFrom
                            && x.ActivityDestination == data.ActInst);
                    if (running != null)
                    {
                        var lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(running.Command);
                        lstCommand[lstCommand.Count - 1].Confirmed = data.Confirm;
                        lstCommand[lstCommand.Count - 1].ConfirmedBy = ESEIM.AppContext.UserName;
                        lstCommand[lstCommand.Count - 1].ConfirmedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy");

                        //if (data.Confirm == "CONFIRM_COMMAND_Y")
                        //{
                        //    var act = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(data.ActInst));
                        //    if (act != null)
                        //    {
                        //        if (lstCommand[lstCommand.Count - 1].CommandSymbol == "COMMAND_WF_INSTANCE_DO")
                        //        {
                        //            act.Status = "STATUS_ACTIVITY_DO";
                        //            act.IsLock = false;
                        //        }
                        //        else if (lstCommand[lstCommand.Count - 1].CommandSymbol == "COMMAND_WF_INSTANCE_NEXT")
                        //        {
                        //            if (act.Type != "TYPE_ACTIVITY_END")
                        //            {
                        //                ConfirmYCommandNext(data.ActInst);
                        //            }
                        //        }
                        //        else if (lstCommand[lstCommand.Count - 1].CommandSymbol == "COMMAND_WF_INSTANCE_STOP")
                        //        {
                        //            act.Status = "STATUS_ACTIVITY_STOP";
                        //            act.IsLock = false;
                        //        }
                        //        else if (lstCommand[lstCommand.Count - 1].CommandSymbol == "COMMAND_WF_INSTANCE_BACK")
                        //        {

                        //        }
                        //        _context.ActivityInstances.Update(act);
                        //    }
                        //}

                        running.Command = JsonConvert.SerializeObject(lstCommand);
                        _context.WorkflowInstanceRunnings.Update(running);

                        //Real-time
                        UpdateChangeActInst(data.ActInst);

                        //Log action user
                        var common = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(data.Confirm));
                        var commonCommand = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(lstCommand[lstCommand.Count - 1].CommandSymbol));
                        if (common != null && commonCommand != null)
                        {
                            var action = new ActInstanceUserActivity
                            {
                                CreatedTime = DateTime.Now,
                                UserId = ESEIM.AppContext.UserId,
                                ActInstCode = data.ActInst,
                                Action = "Đã xác nhận",
                                FromDevice = "Desktop/Laptop",
                                IdObject = "Command",
                                ChangeDetails = " [" + common.ValueSet + "] lệnh [" + commonCommand.ValueSet + "]"
                            };
                            _context.ActInstanceUserActivitys.Add(action);
                        }
                        //End

                        _context.SaveChanges();
                        msg.Title = _stringLocalizer["WFAI_MSG_CONFIRM_COMMAND_SUCCES"];

                        var assign = _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst == data.ActFrom)
                            .Select(x => new CardMemberCustom
                            {
                                CreatedTime = x.CreatedTime.ToString("HH:mm dd/MM/yyyy"),
                                Id = x.ID,
                                Responsibility = x.Role,
                                UserId = x.UserId
                            }).ToList();
                        lstAssign.AddRange(assign);
                        SendNotifyCommand(lstAssign, data.ActInst, " đã được xác nhận lệnh bởi ");
                    }
                }
                else
                {
                    var running = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.WfInstCode == data.WfInstCode);
                    foreach (var run in running)
                    {
                        if (!string.IsNullOrEmpty(run.Command))
                        {
                            var lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(run.Command);
                            var command = lstCommand.LastOrDefault(x => x.ActB.Equals(data.ActInst) && x.IsLeader);
                            if (command != null)
                            {
                                command.Confirmed = data.Confirm;
                                command.ConfirmedBy = ESEIM.AppContext.UserName;
                                command.ConfirmedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy");
                                run.Command = JsonConvert.SerializeObject(lstCommand);
                                _context.WorkflowInstanceRunnings.Update(run);
                            }
                        }
                    }
                    _context.SaveChanges();
                    msg.Title = _stringLocalizer["WFAI_MSG_CONFIRM_COMMAND_SUCCES"];
                    var assign = new CardMemberCustom
                    {
                        CreatedTime = "",
                        Id = 0,
                        Responsibility = "",
                        UserId = _context.Users.FirstOrDefault(x => x.UserName == data.ApproveBy).Id
                    };
                    lstAssign.Add(assign);
                    SendNotifyCommand(lstAssign.DistinctBy(x => x.UserId).ToList(), data.ActInst, " đã được xác nhận lệnh bởi ");
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [NonAction]
        public void SendNotifyCommand(List<CardMemberCustom> lstUser, string actInstCode, string commandMsg)
        {
            var actInst = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == actInstCode);
            if (actInst != null)
            {
                var assignInst = (_context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst == actInst.ActivityInstCode)
                    .Select(x => new CardMemberCustom
                    {
                        Id = x.ID,
                        UserId = x.UserId,
                        Responsibility = x.Role,
                        CreatedTime = x.CreatedTime.ToString("HH:mm dd/MM/yyyy")
                    })).ToList();
                lstUser.AddRange(assignInst);

                var timer = (DateTime?)null;
                if (actInst.Unit == "DURATION_UNIT20200904094128")
                {
                    timer = actInst.StartTime.HasValue ? actInst.StartTime.Value.AddDays(Convert.ToDouble(actInst.Duration)) : (DateTime?)null;
                }
                if (actInst.Unit == "DURATION_UNIT20200904094132")
                {
                    timer = actInst.StartTime.HasValue ? actInst.StartTime.Value.AddHours(Convert.ToDouble(actInst.Duration)) : (DateTime?)null;
                }
                if (actInst.Unit == "DURATION_UNIT20200904094135")
                {
                    timer = actInst.StartTime.HasValue ? actInst.StartTime.Value.AddMinutes(Convert.ToDouble(actInst.Duration)) : (DateTime?)null;
                }
                if (actInst.Unit == "DURATION_UNIT20200904094139")
                {
                    timer = actInst.StartTime.HasValue ? actInst.StartTime.Value.AddSeconds(Convert.ToDouble(actInst.Duration)) : (DateTime?)null;
                }

                var wfInfo = (from a in _context.WorkflowInstances.Where(x => !x.IsDeleted.Value && x.WfInstCode == actInst.WorkflowCode)
                              join b in _context.WorkFlows.Where(x => !x.IsDeleted.Value) on a.WorkflowCode equals b.WfCode
                              select new
                              {
                                  a.ObjectInst,
                                  b.WfName
                              }).FirstOrDefault();

                var session = HttpContext.GetSessionUser();
                var message = "Hoạt động " + actInst.Title + " thuộc luồng " + wfInfo.WfName + commandMsg + session.FullName;
                SendPushNotification(lstUser, message,
                    new
                    {
                        ActivityCode = actInst.ActivityCode,
                        ActivityInstCode = actInst.ActivityInstCode,
                        Desc = actInst.Desc,
                        Duration = actInst.Duration,
                        Group = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == actInst.Group).ValueSet ?? "",
                        ID = actInst.ID,
                        Located = actInst.Located,
                        ObjCode = wfInfo != null ? wfInfo.ObjectInst : "",
                        StatusCode = actInst.Status,
                        Timer = timer,
                        Title = actInst.Title,
                        Type = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == actInst.Type).ValueSet ?? "",
                        Unit = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == actInst.Unit).ValueSet ?? "",
                        WorkflowCode = actInst.WorkflowCode,
                        WfName = wfInfo != null ? wfInfo.WfName : ""
                    },
                    EnumHelper<FromSrcSendNotify>.GetDisplayValue(FromSrcSendNotify.FromActInst));
            }

        }

        [HttpPost]
        public JsonResult DeleteCommand(string actDes, string actSrc)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.WorkflowInstanceRunnings.FirstOrDefault(x => !x.IsDeleted && x.ActivityInitial.Equals(actSrc)
                        && x.ActivityDestination.Equals(actDes));
                if (data != null)
                {
                    if (!string.IsNullOrEmpty(data.Command))
                    {
                        var lst = JsonConvert.DeserializeObject<List<JsonCommand>>(data.Command);
                        if (lst.Count > 0)
                        {
                            lst.Remove(lst[lst.Count - 1]);
                            var common = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(lst[lst.Count - 1].CommandSymbol));
                            data.Command = JsonConvert.SerializeObject(lst);
                            _context.WorkflowInstanceRunnings.Update(data);

                            //Real-time
                            UpdateChangeActInst(actSrc);

                            //Log action user

                            if (common != null)
                            {
                                var action = new ActInstanceUserActivity
                                {
                                    CreatedTime = DateTime.Now,
                                    UserId = ESEIM.AppContext.UserId,
                                    ActInstCode = actSrc,
                                    Action = "Đã xóa lệnh",
                                    FromDevice = "Desktop/Laptop",
                                    IdObject = "Command",
                                    ChangeDetails = "[" + common.ValueSet + "]"
                                };
                                _context.ActInstanceUserActivitys.Add(action);
                            }
                            //End

                            _context.SaveChanges();
                            msg.Title = _stringLocalizer["WFAI_MSG_DEL_COMMAND_SUCCESS"];
                        }
                        else
                        {
                            msg.Error = true;
                            msg.Title = _stringLocalizer["WFAI_MSG_COMMAND_NO_EXISTS"];
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        public class ConfirmOneCommandModel
        {
            public string ActFrom { get; set; }
            public string ActInst { get; set; }
            public string Confirm { get; set; }
            public string WfInstCode { get; set; }
            public bool IsLeader { get; set; }
            public string ApproveBy { get; set; }
        }

        public class RunningOneCommandModel
        {
            public string ActInst { get; set; }
            public string ActTo { get; set; }
            public string Command { get; set; }
            public string Approve { get; set; }
        }

        public class ModelCommandRunning
        {
            public ModelCommandRunning()
            {
                ListCommand = new List<ModelCommand>();
            }
            public string ActInstCode { get; set; }
            public List<ModelCommand> ListCommand { get; set; }
        }

        public class ModelCommand
        {
            public ModelCommand()
            {
                Command = new JsonCommand();
            }
            public string Code { get; set; }
            public string Name { get; set; }
            public decimal Duration { get; set; }
            public DateTime? StartTime { get; set; }
            public JsonCommand Command { get; set; }
            public string Unit { get; set; }
            public string CommandText { get; set; }
            public string CommandStr { get; set; }
            public string WfInstCode { get; set; }
            public bool IsLeader { get; set; }
        }

        public class CmdRepeat
        {
            public bool Check { get; set; }
            public string ActInst { get; set; }
        }

        public class Command
        {
            public int Id { get; set; }
            public string CommandSend { get; set; }
            public string SendBy { get; set; }
            public DateTime? SendTime { get; set; }
            public string ConfirmedBy { get; set; }
            public DateTime? ConfirmedTime { get; set; }
            public string Confirmed { get; set; }
            public string Message { get; set; }
            public string FromAct { get; set; }
            public string ToAct { get; set; }
            public bool IsLeader { get; set; }
        }

        #endregion

        #region Mile stone
        [HttpGet]
        public JsonResult CountMilestone(string wfCode)
        {
            var data = (from a in _context.WorkFlows.Where(x => !x.IsDeleted.Value && x.WfCode.Equals(wfCode))
                        join b in _context.Activitys.Where(x => !x.IsDeleted) on a.WfCode equals b.WorkflowCode
                        join c in _context.WorkflowMilestones.Where(x => !x.IsDeleted) on b.WorkflowCode equals c.WorkflowCode
                        select new
                        {
                            c.MilestoneCode,
                            MileStone = _context.CommonSettings.Any(x => !x.IsDeleted && x.CodeSet == c.MilestoneCode)
                                ? _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == c.MilestoneCode).ValueSet : "",
                            Level = b.Level
                        }).GroupBy(x => x.MilestoneCode);
            var lstMile = new List<MileStoneModel>();
            foreach (var item in data)
            {
                var miles = new MileStoneModel
                {
                    CountMileStone = data.Count(),
                    MileStoneName = item.First().MileStone,
                    MileStoneCode = item.First().MilestoneCode,
                    Level = item.Min(x => x.Level),
                };
                lstMile.Add(miles);
            }
            return Json(lstMile.OrderBy(x => x.Level));
        }

        [HttpGet]
        public JsonResult GetActivity(string wfCode)
        {
            var data = (from a in _context.WorkFlows.Where(x => !x.IsDeleted.Value && x.WfCode.Equals(wfCode))
                        join b in _context.Activitys.Where(x => !x.IsDeleted) on a.WfCode equals b.WorkflowCode
                        join c in _context.WorkflowMilestones.Where(x => !x.IsDeleted) on b.ActivityCode equals c.ActivityCode
                        select new
                        {
                            ID = b.ID,
                            Title = b.Title,
                            Status = _context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals(b.Status) && !x.IsDeleted).ValueSet ?? "",
                            Timer = b.Duration,
                            Unit = _context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals(b.Unit) && !x.IsDeleted).ValueSet ?? "",
                            shapJson = b.ShapeJson,
                            wf = a.WfCode,
                            MilestoneCode = c.MilestoneCode,
                            MileStone = _context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals(c.MilestoneCode) && !x.IsDeleted).ValueSet ?? "",
                        });
            return Json(data);
        }

        [HttpGet]
        public JsonResult GetTransition(string WfCode)
        {
            var data = (from c in _context.WorkflowSettings.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(WfCode))
                        join d in _context.Transitions.Where(x => !x.IsDeleted) on c.TransitionCode equals d.TrsCode
                        select new
                        {
                            ID = c.Id,
                            IdAutoGen = Guid.NewGuid().ToString().ToLower(),
                            actintial = c.ActivityInitial,
                            actdes = c.ActivityDestination,
                            tranShapJson = d.TrsAttrGraph
                        });
            return Json(data);
        }

        public class MileStoneModel
        {
            public int CountMileStone { get; set; }
            public string MileStoneName { get; set; }
            public string MileStoneCode { get; set; }
            public int? Level { get; internal set; }
        }

        #endregion

        #region Library

        [HttpGet]
        public JsonResult GetSharpLibraryImage()
        {
            var data = from a in _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == "SHARP_LIBRARY")
                       select new
                       {
                           TypeName = a.ValueSet,
                           ListSharpLib = from b in _context.WFSharpLibrarys.Where(x => !x.IsDeleted && x.SharpType == a.CodeSet)
                                          select new
                                          {
                                              SharpCode = b.SharpCode,
                                              SharpName = b.SharpName,
                                              SharpData = b.SharpData,
                                              SharpType = b.SharpType,
                                              SharpPath = b.SharpPath,
                                          }
                       };

            //var data = (from a in _context.WFSharpLibrarys.Where(x => !x.IsDeleted)
            //            select new
            //            {
            //                SharpCode = a.SharpCode,
            //                SharpName = a.SharpName,
            //                SharpData = a.SharpData,
            //                SharpType = a.SharpType,
            //                SharpPath = a.SharpPath,
            //                TypeText = _context.CommonSettings.FirstOrDefault(x => x.CodeSet == a.SharpType).ValueSet ?? ""
            //            }).GroupBy(x => x.SharpType);
            return Json(data);
        }

        [HttpPost]
        public JsonResult InsertSharpLibrary([FromBody] WFSharpLibrary obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var check = _context.WFSharpLibrarys.FirstOrDefault(x => !x.IsDeleted && x.SharpCode.Equals(obj.SharpCode));
                if (check == null)
                {
                    var library = new WFSharpLibrary
                    {
                        SharpCode = obj.SharpCode,
                        SharpName = obj.SharpName,
                        SharpData = obj.SharpData,
                        SharpType = obj.SharpType,
                        SharpDesc = obj.SharpDesc,
                        SharpPath = obj.SharpPath,
                        CreatedBy = ESEIM.AppContext.UserName,
                        CreatedTime = DateTime.Now
                    };
                    _context.WFSharpLibrarys.Add(library);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_ADD_SUCCESS"];
                }

            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }
        [HttpGet]
        public JsonResult GetSharpLibraryItem(String SharpCode)
        {
            var id = Guid.NewGuid().ToString();
            var data = _context.WFSharpLibrarys.FirstOrDefault(x => !x.IsDeleted && x.SharpCode.Equals(SharpCode));
            var json = JsonConvert.DeserializeObject<ObjectActivity>(data.SharpData);
            json.id = id;
            data.SharpData = JsonConvert.SerializeObject(json);
            return Json(data);
        }

        public class Label
        {
            public string type { get; set; }
            public string id { get; set; }
            public string x { get; set; }
            public string y { get; set; }
            public string width { get; set; }
            public string height { get; set; }
            public string alpha { get; set; }
            public bool selectable { get; set; }
            public bool draggable { get; set; }
            public int angle { get; set; }
            public string cssClass { get; set; }
            public object userData { get; set; }
            public List<Port> ports { get; set; }
            public string bgColor { get; set; }
            public string color { get; set; }
            public string stroke { get; set; }
            public string radius { get; set; }
            public string dasharray { get; set; }
            public string text { get; set; }
            public string outlineStroke { get; set; }
            public string outlineColor { get; set; }
            public int fontSize { get; set; }
            public string fontColor { get; set; }
            public string fontFamily { get; set; }
            public string locator { get; set; }
            public string path { get; set; }
        }

        public class Port
        {
            public string type { get; set; }
            public string id { get; set; }
            public string width { get; set; }
            public string height { get; set; }
            public string alpha { get; set; }
            public bool selectable { get; set; }
            public bool draggable { get; set; }
            public int angle { get; set; }
            public object userData { get; set; }
            public string cssClass { get; set; }
            public string bgColor { get; set; }
            public string color { get; set; }
            public string stroke { get; set; }
            public string dasharray { get; set; }
            public decimal maxFanOut { get; set; }
            public string name { get; set; }
            public string semanticGroup { get; set; }
            public string port { get; set; }
            public string locator { get; set; }
            public object locatorAttr { get; set; }
        }

        public class ObjectActivity
        {
            public string type { get; set; }
            public string id { get; set; }
            public string x { get; set; }
            public string y { get; set; }
            public string width { get; set; }
            public string height { get; set; }
            public string alpha { get; set; }
            public bool selectable { get; set; }
            public bool draggable { get; set; }
            public string angle { get; set; }
            public object userData { get; set; }
            public string cssClass { get; set; }
            public List<Port> ports { get; set; }
            public string bgColor { get; set; }
            public string color { get; set; }
            public string stroke { get; set; }
            public string radius { get; set; }
            public string dasharray { get; set; }
            public string dirStrategy { get; set; }
            public List<Label> labels { get; set; }
        }

        #endregion

        #region FormBiulder
        public JsonResult GetTypeLibrary()
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals("SHARP_LIBRARY"))
                .Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
            return Json(data);
        }

        [HttpPost]
        public JsonResult InsertFormCat([FromBody] FormBiulderCat obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var check = _context.FormBiulderCats.FirstOrDefault(x => !x.IsDeleted && x.FormCode.Equals(obj.FormCode));
                if (check == null)
                {
                    var form = new FormBiulderCat
                    {
                        FormCode = obj.FormCode,
                        FormName = obj.FormName,
                        FormGroup = obj.FormGroup,
                        FormType = obj.FormType,
                        FormNote = obj.FormNote,
                        CreatedBy = ESEIM.AppContext.UserName,
                        CreatedTime = DateTime.Now
                    };
                    _context.FormBiulderCats.Add(form);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_ADD_SUCCESS"];
                }
                else
                {
                    msg.Title = _stringLocalizer["WFAI_MSG_FORM_EXIST"];
                    msg.Error = true;
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult GetItemFormCat(string FormCode)
        {
            var data = _context.FormBiulderCats.FirstOrDefault(x => !x.IsDeleted && x.FormCode.Equals(FormCode));
            return Json(data);
        }

        [HttpPost]
        public JsonResult UpdateFormCat([FromBody] FormBiulderCat obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.FormBiulderCats.FirstOrDefault(x => !x.IsDeleted && x.FormCode.Equals(obj.FormCode));
                if (data != null)
                {
                    data.FormName = obj.FormName;
                    data.FormGroup = obj.FormGroup;
                    data.FormType = obj.FormType;
                    data.FormNote = obj.FormNote;
                    data.UpdatedBy = ESEIM.AppContext.UserName;
                    data.UpdatedTime = DateTime.Now;
                    _context.FormBiulderCats.Update(data);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_UPDATE_SUCCESS"];
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["WFAI_MSG_RECORD_NO_EXIST"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult DeleteFormCat(string FormCode)
        {
            var msg = new JMessage { Error = false, Title = "" };
            var data = _context.FormBiulderCats.FirstOrDefault(x => !x.IsDeleted && x.FormCode.Equals(FormCode));
            if (data != null)
            {
                data.IsDeleted = true;
                data.DeletedBy = ESEIM.AppContext.UserName;
                data.DeletedTime = DateTime.Now;
                _context.FormBiulderCats.Update(data);
                _context.SaveChanges();
                msg.Title = _sharedResources["COM_DELETE_SUCCESS"];
            }
            else
            {
                msg.Error = true;
                msg.Title = _stringLocalizer["WFAI_MSG_NO_RECORD_FOUND"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult InsertFormControl([FromBody] FormControl obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var check = _context.FormControls.FirstOrDefault(x => !x.IsDeleted && x.FcCode.Equals(obj.FcCode));
                if (check == null)
                {
                    var formcontrol = new FormControl
                    {
                        FcCode = obj.FcCode,
                        FcName = obj.FcName,
                        FcParent = obj.FcParent,
                        FcAttribute = obj.FcAttribute,
                        CreatedBy = ESEIM.AppContext.UserName,
                        CreatedTime = DateTime.Now
                    };
                    _context.FormControls.Add(formcontrol);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_ADD_SUCCESS"];
                }
                else
                {
                    msg.Title = _stringLocalizer["COM_UPDATE_SUCCESS"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpGet]
        public JsonResult GetFormBuilder(string FormCode)
        {
            var data = (from a in _context.FormBiulderCats.Where(x => !x.IsDeleted && x.FormCode.Equals(FormCode))
                        join b in _context.FormControls.Where(x => !x.IsDeleted) on a.FormCode equals b.FcParent
                        select new
                        {
                            ID = b.Id,
                            Name = b.FcName,
                            shapJson = b.FcAttribute,
                            FormCode = a.FormCode
                        });
            return Json(data);
        }

        #endregion

        #region Draw workflow Instance
        [HttpGet]
        public JsonResult GetTransitionInstance(string WfInstCode)
        {
            var data = (from c in _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.WfInstCode.Equals(WfInstCode))
                        join d in _context.Transitions.Where(x => !x.IsDeleted) on c.TransitionCode equals d.TrsCode
                        select new
                        {
                            ID = c.Id,
                            IdAutoGen = Guid.NewGuid().ToString().ToLower(),
                            actintial = c.ActivityInitial,
                            actdes = c.ActivityDestination,
                            tranShapJson = d.TrsAttrGraph
                        });
            return Json(data);
        }

        [HttpGet]
        public JsonResult GetActivityInstance(string wfInstCode)
        {
            var data = (from a in _context.WorkflowInstances.Where(x => !x.IsDeleted.Value && x.WfInstCode.Equals(wfInstCode))
                        join b in _context.ActivityInstances.Where(x => !x.IsDeleted) on a.WfInstCode equals b.WorkflowCode
                        join c in _context.WorkflowMilestones.Where(x => !x.IsDeleted) on b.ActivityCode equals c.ActivityCode
                        join d in _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted) on b.ActivityInstCode equals d.ActivityDestination into d1
                        from d2 in d1.DefaultIfEmpty()
                        select new ModelDrawInstance
                        {
                            ID = b.ID,
                            ActInstCode = b.ActivityInstCode,
                            Title = b.Title,
                            Status = _context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals(b.Status) && !x.IsDeleted).ValueSet ?? "",
                            Timer = b.Duration,
                            Unit = _context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals(b.Unit) && !x.IsDeleted).ValueSet ?? "",
                            shapJson = b.ShapeJson,
                            wf = a.WfInstCode,
                            MilestoneCode = c.MilestoneCode,
                            //IsLock = b.IsLock,
                            MileStone = _context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals(c.MilestoneCode) && !x.IsDeleted).ValueSet ?? "",
                            StartTime = b.StartTime,
                            CommandSymbol = d2 != null ? d2.Command : "",
                            CommandText = "",
                            ObjCode = a.ObjectInst,
                            StatusCode = b.Status,
                            ConfirmedN = false,
                            EndTimeTxt = b.EndTime.HasValue ? b.EndTime.Value.ToString("HH:mm dd/MM/yyyy") : "",
                            EndTime = b.EndTime,
                            IsValid = true,
                            LogCountDown = !string.IsNullOrEmpty(b.LogCountDown) ? b.LogCountDown : ""
                        }).DistinctBy(x => x.ActInstCode).ToList();
            foreach (var item in data)
            {
                if (!string.IsNullOrEmpty(item.CommandSymbol))
                {
                    var command = JsonConvert.DeserializeObject<List<JsonCommand>>(item.CommandSymbol).LastOrDefault();
                    item.CommandSymbol = command != null ? command.CommandSymbol : "";
                    var cmd = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == item.CommandSymbol);
                    item.CommandText = cmd != null ? cmd.ValueSet : "";
                }

                item.ConfirmedN = RepeatCommandDraw(item.ActInstCode);

                if (item.Unit == "Ngày")
                {
                    item.StartTime = item.StartTime.HasValue ? item.StartTime.Value.AddDays(Convert.ToDouble(item.Timer)) : (DateTime?)null;
                }
                if (item.Unit == "Giờ")
                {
                    item.StartTime = item.StartTime.HasValue ? item.StartTime.Value.AddHours(Convert.ToDouble(item.Timer)) : (DateTime?)null;
                }
                if (item.Unit == "Phút")
                {
                    item.StartTime = item.StartTime.HasValue ? item.StartTime.Value.AddMinutes(Convert.ToDouble(item.Timer)) : (DateTime?)null;
                }
                if (item.Unit == "Giây")
                {
                    item.StartTime = item.StartTime.HasValue ? item.StartTime.Value.AddSeconds(Convert.ToDouble(item.Timer)) : (DateTime?)null;
                }

                if (item.EndTime.HasValue)
                {
                    if (item.EndTime.Value > item.StartTime && item.StatusCode == "STATUS_ACTIVITY_END")
                    {
                        item.IsValid = false;
                    }
                }
                if (!string.IsNullOrEmpty(item.LogCountDown))
                {
                    var lstLog = JsonConvert.DeserializeObject<List<LogCountDown>>(item.LogCountDown);
                    item.LogCountDown = "lần: " + lstLog.LastOrDefault().Cnt + " , quá hạn: " + Convert.ToInt32(lstLog.LastOrDefault().Total) + " " + item.Unit;
                }
            }

            RemoveUserInNotify(wfInstCode, EnumHelper<NotificationType>.GetDisplayValue(NotificationType.WorkFlow), false);

            return Json(data);
        }

        [HttpPost]
        public JsonResult InsertLogCountDown(string actInst, int cnt)
        {
            var msg = new JMessage();
            var data = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == actInst);
            if (data != null)
            {
                var logCntDown = new LogCountDown
                {
                    User = "",
                    Time = DateTime.Now,
                    Cnt = 1,
                    Total = data.Duration,
                    UnitTime = data.Unit,
                    StartTimeX = DateTime.Now
                };
                var lstLog = new List<LogCountDown>();
                if (!string.IsNullOrEmpty(data.LogCountDown))
                {
                    lstLog = JsonConvert.DeserializeObject<List<LogCountDown>>(data.LogCountDown);
                    logCntDown.Cnt = lstLog.LastOrDefault().Cnt + (cnt != 0 ? cnt : 1);
                    logCntDown.Total = lstLog.LastOrDefault().Total + (cnt != 0 ? (cnt * data.Duration) : data.Duration);
                }
                lstLog.Add(logCntDown);
                data.LogCountDown = JsonConvert.SerializeObject(lstLog);
                _context.ActivityInstances.Update(data);
                _context.SaveChanges();
                msg.Object = logCntDown;
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult GetDetailActInst(string actInst)
        {
            var data = (from b in _context.ActivityInstances.Where(x => !x.IsDeleted && x.ActivityInstCode == actInst)
                        select new ModelDrawInstance
                        {
                            ID = b.ID,
                            ActInstCode = b.ActivityInstCode,
                            Title = b.Title,
                            Status = _context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals(b.Status) && !x.IsDeleted).ValueSet ?? "",
                            Timer = b.Duration,
                            Unit = _context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals(b.Unit) && !x.IsDeleted).ValueSet ?? "",
                            shapJson = b.ShapeJson,
                            //IsLock = b.IsLock,
                            StartTime = b.StartTime,
                            CommandText = "",
                            StatusCode = b.Status,
                            EndTimeTxt = b.EndTime.HasValue ? b.EndTime.Value.ToString("HH:mm dd/MM/yyyy") : "",
                            EndTime = b.EndTime,
                            IsValid = true,
                            LogCountDown = !string.IsNullOrEmpty(b.LogCountDown) ? b.LogCountDown : "",
                        }).FirstOrDefault();

            if (data.Unit == "Ngày")
            {
                data.StartTime = data.StartTime.HasValue ? data.StartTime.Value.AddDays(Convert.ToDouble(data.Timer)) : (DateTime?)null;
            }
            if (data.Unit == "Giờ")
            {
                data.StartTime = data.StartTime.HasValue ? data.StartTime.Value.AddHours(Convert.ToDouble(data.Timer)) : (DateTime?)null;
            }
            if (data.Unit == "Phút")
            {
                data.StartTime = data.StartTime.HasValue ? data.StartTime.Value.AddMinutes(Convert.ToDouble(data.Timer)) : (DateTime?)null;
            }
            if (data.Unit == "Giây")
            {
                data.StartTime = data.StartTime.HasValue ? data.StartTime.Value.AddSeconds(Convert.ToDouble(data.Timer)) : (DateTime?)null;
            }

            if (data.EndTime > data.StartTime && data.StatusCode == "STATUS_ACTIVITY_END")
            {
                data.IsValid = false;
                var lstLog = JsonConvert.DeserializeObject<List<LogCountDown>>(data.LogCountDown);
                data.LogCountDown = "lần: " + lstLog.LastOrDefault().Cnt + " , quá hạn: " + Convert.ToInt32(lstLog.LastOrDefault().Total) + " " + data.Unit;
            }
            return Json(data);
        }

        [HttpPost]
        public object GetStartXLast(string actInst)
        {
            var data = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == actInst);
            var startX = (DateTime?)null;
            var cnt = 0;
            decimal total = 0;
            if (data != null)
            {
                if (!string.IsNullOrEmpty(data.LogCountDown))
                {
                    var lstLog = JsonConvert.DeserializeObject<List<LogCountDown>>(data.LogCountDown);
                    startX = lstLog.LastOrDefault().StartTimeX;
                    cnt = lstLog.LastOrDefault().Cnt;
                    total = lstLog.LastOrDefault().Total;
                }
            }
            return new
            {
                StartX = startX,
                Cnt = cnt,
                Total = total
            };
        }

        [NonAction]
        public bool RepeatCommandDraw(string actInst)
        {
            var check = false;
            var runningTo = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityInitial == actInst);
            foreach (var to in runningTo)
            {
                var lstCmd = JsonConvert.DeserializeObject<List<JsonCommand>>(to.Command);
                if (lstCmd.Count > 0)
                {
                    if (lstCmd.LastOrDefault().Confirmed == "CONFIRM_COMMAND_N")
                    {
                        check = true;
                        break;
                    }
                }
            }
            return check;
        }

        [HttpPost]
        public JsonResult SaveDiagram([FromBody] List<Diagram> data)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                if (data.Count > 0)
                {
                    var wfInstCode = data[0].WfInstCode;
                    var actInsts = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode == wfInstCode);
                    foreach (var item in actInsts)
                    {
                        foreach (var k in data)
                        {
                            if (item.ActivityInstCode == k.ActInst)
                            {
                                item.ShapeJson = k.Shape;
                                _context.ActivityInstances.Update(item);
                            }
                        }
                    }
                    _context.SaveChanges();
                    msg.Title = _stringLocalizer["WFAI_MSG_SAVE_DIAGRAM_SUCCES"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        public class Diagram
        {
            public string ActInst { get; set; }
            public string Shape { get; set; }
            public string WfInstCode { get; set; }
        }

        public class LogCountDown
        {
            public string User { get; set; }
            public DateTime Time { get; set; }
            public int Cnt { get; set; }
            public decimal Total { get; set; }
            public string UnitTime { get; set; }
            public DateTime StartTimeX { get; set; }
        }

        public class ModelDrawInstance
        {
            public int ID { get; set; }
            public string ActInstCode { get; set; }
            public string Title { get; set; }
            public string Status { get; set; }
            public string Unit { get; set; }
            public string shapJson { get; set; }
            public string wf { get; set; }
            public string MilestoneCode { get; set; }
            public bool IsLock { get; set; }
            public string MileStone { get; set; }
            public string CommandSymbol { get; set; }
            public DateTime? StartTime { get; set; }
            public decimal Timer { get; set; }
            public string CommandText { get; set; }
            public string ObjCode { get; set; }
            public string StatusCode { get; set; }
            public bool ConfirmedN { get; set; }
            public DateTime? EndTime { get; set; }
            public string EndTimeTxt { get; set; }
            public bool IsValid { get; set; }
            public string LogCountDown { get; set; }
        }

        #endregion

        #region Lock Activity
        [HttpPost]
        public JsonResult LockActivity(string actInst, bool value)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var session = HttpContext.GetSessionUser();
                if (!session.IsAllData)
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["WFAI_MSG_U_NOT_PERMISSION"];
                    return Json(msg);
                }
                var act = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == actInst);
                if (act != null)
                {
                    //act.IsLock = value;
                    _context.ActivityInstances.Update(act);
                    UpdateChangeActInst(act.ActivityInstCode);

                    _context.SaveChanges();
                    if (value)
                    {
                        msg.Title = _stringLocalizer["WFAI_MSG_LOCK_ACT_SUCCESS"];
                    }
                    else
                    {
                        msg.Title = _stringLocalizer["WFAI_MSG_UNLOCK_ACT_SUCCESS"];
                    }

                    if (act.Unit == "DURATION_UNIT20200904094128")
                    {
                        msg.Object = act.StartTime.HasValue ? act.StartTime.Value.AddDays(Convert.ToDouble(act.Duration)) : (DateTime?)null;
                    }
                    if (act.Unit == "DURATION_UNIT20200904094132")
                    {
                        msg.Object = act.StartTime.HasValue ? act.StartTime.Value.AddHours(Convert.ToDouble(act.Duration)) : (DateTime?)null;
                    }
                    if (act.Unit == "DURATION_UNIT20200904094135")
                    {
                        msg.Object = act.StartTime.HasValue ? act.StartTime.Value.AddMinutes(Convert.ToDouble(act.Duration)) : (DateTime?)null;
                    }
                    if (act.Unit == "DURATION_UNIT20200904094139")
                    {
                        msg.Object = act.StartTime.HasValue ? act.StartTime.Value.AddSeconds(Convert.ToDouble(act.Duration)) : (DateTime?)null;
                    }
                }
            }
            catch (Exception ex)
            {
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Error = true;
            }
            return Json(msg);
        }
        #endregion

        #region Send notification

        [NonAction]
        public async Task<int> SendPushNotification(List<CardMemberCustom> listUserId, string message, object data, string fromSrc)
        {
            if (listUserId != null && listUserId.Any())
            {
                var query = (from a in listUserId
                             join b in _context.FcmTokens on a.UserId equals b.UserId
                             join c in _context.Users on a.UserId equals c.Id
                             where c.Active == true && b.AppCode == "SMARTWORK"
                             select new DeviceFcm
                             {
                                 Token = b.Token,
                                 Device = b.Device,
                                 UserId = a.UserId
                             }).Select(y => new DeviceFcm { Token = y.Token, Device = y.Device, UserId = y.UserId });
                if (query.Any())
                {
                    var countToken = query.Count();
                    if (countToken > 100000)
                    {
                        int countPush = (query.Count() / 100000) + 1;
                        for (int i = 0; i < countPush; i++)
                        {
                            List<DeviceFcm> listDevices = query.Skip(i * 1000).Take(100000).ToList();

                            var sendNotication = _notification.SendNotification("Thông báo", message, listDevices, data, fromSrc, ESEIM.AppContext.UserName);
                        }
                    }
                    else
                    {
                        var sendNotication = _notification.SendNotification("Thông báo", message, query.ToList(), data, fromSrc, ESEIM.AppContext.UserName);
                    }
                }
            }
            return 1;
        }

        #endregion

        #region Command Workflow
        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetLstActInst(string wfInst)
        {
            var data = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode == wfInst)
                        .Select(x => new { Code = x.ActivityInstCode, Name = x.Title, Type = x.Type });
            return Json(data);
        }

        [HttpPost]
        public JsonResult SendCommandFromLeader([FromBody] ModelCommandWf data)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                foreach (var item in data.LstAct)
                {
                    var message = new MessageActivity
                    {
                        Command = data.CommandSymbol,
                        ActFrom = "",
                        ActTo = item.Code,
                        CommandTime = DateTime.Now,
                        Note = data.Message,
                        User = ESEIM.AppContext.UserName,
                    };
                    _context.MessageActivitys.Add(message);
                }
                _context.SaveChanges();
                msg.Title = _stringLocalizer["WFAI_MSG_RUN_COMMAND_SUCCES"];
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetCommandSendByLeader(string wfInst)
        {
            var comm = _context.CommonSettings.Where(x => !x.IsDeleted);
            var commands = from a in _context.MessageActivitys.Where(x => string.IsNullOrEmpty(x.ActFrom))
                           join b in _context.ActivityInstances.Where(x => x.WorkflowCode.Equals(wfInst)) on a.ActTo equals b.ActivityInstCode
                           join c in _context.Users on a.User equals c.UserName
                           select new
                           {
                               Id = a.ID,
                               ActName = b.Title,
                               UserSend = _context.Users.FirstOrDefault(x => x.UserName.Equals(a.User)).GivenName ?? "",
                               UserConfirm = !string.IsNullOrEmpty(a.ConfirmedBy) ? _context.Users.FirstOrDefault(x => x.UserName.Equals(a.ConfirmedBy)).GivenName ?? "" : "",
                               Command = comm.FirstOrDefault(x => x.CodeSet.Equals(a.Command)).ValueSet ?? "",
                               Confirm = !string.IsNullOrEmpty(a.Confirm) ? comm.FirstOrDefault(x => x.CodeSet.Equals(a.Confirm)).ValueSet ?? "" : "",
                               CmdTime = a.CommandTime.ToString("HH:mm dd/MM/yyyy"),
                               ConfirmTime = a.ConfirmTime.HasValue ? a.ConfirmTime.Value.ToString("HH:mm dd/MM/yyyy") : "",
                               Note = a.Note
                           };
            return Json(commands);
        }

        [HttpPost]
        public JsonResult DeleteCmdLeader(int id)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var command = _context.MessageActivitys.FirstOrDefault(x => x.ID == id);
                if (command != null)
                {
                    _context.MessageActivitys.Remove(command);
                    _context.SaveChanges();
                    msg.Title = _stringLocalizer["WFAI_MSG_DEL_COMMAND_SUCCESS"];
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Lệnh không tồn tại";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        public class ViewCmdLeader
        {
            public string GivenName { get; set; }
            public string CommandSymbol { get; set; }
            public string Approve { get; set; }
            public string ApproveTime { get; set; }
            public string Confirm { get; set; }
            public string ConfrimBy { get; set; }
            public string ConfirmTime { get; set; }
            public string Message { get; set; }
            public string ActTitle { get; set; }
            public string ActInstCode { get; set; }
        }
        public class ModelCommandWf
        {
            public ModelCommandWf()
            {
                LstAct = new List<ModelActInstWf>();
            }
            public string CommandSymbol { get; set; }
            public string Approve { get; set; }
            public string Message { get; set; }
            public List<ModelActInstWf> LstAct { get; set; }
        }
        public class ModelActInstWf
        {
            public string Code { get; set; }
            public string Name { get; set; }
            public string Type { get; set; }
        }
        #endregion

        #region File to act instance
        [HttpPost]
        public object JTableFile([FromBody] JTableModelFile jTablePara)
        {
            try
            {
                if (string.IsNullOrEmpty(jTablePara.ActInstCode))
                {
                    return JTableHelper.JObjectTable(new List<object>(), jTablePara.Draw, 0, "Id", "FileName", "FileTypePhysic", "Desc", "Url", "CreatedTime", "UpdatedTime", "ReposName", "TypeFile", "FileID", "SizeOfFile");
                }
                int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;
                var fromDate = !string.IsNullOrEmpty(jTablePara.FromDate) ? DateTime.ParseExact(jTablePara.FromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
                var toDate = !string.IsNullOrEmpty(jTablePara.ToDate) ? DateTime.ParseExact(jTablePara.ToDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;

                var listFileByUser = _context.FilesShareObjectUsers.Where(x => !x.IsDeleted && x.UserShares.Any(p => p.Code.Equals(User.Identity.Name)))
                                                               .Select(p => new
                                                               {
                                                                   p.FileID,
                                                                   p.ListUserShare,
                                                                   p.UserShares
                                                               }).ToList();
                var session = HttpContext.GetSessionUser();

                var query = (from a in _context.EDMSRepoCatFiles.Where(x => x.ObjectCode == jTablePara.ActInstCode && x.ObjectType == EnumHelper<ActivityInst>.GetDisplayValue(ActivityInst.ActivityInst))
                             join b in _context.EDMSFiles.Where(x => !x.IsDeleted && x.IsFileMaster == null || x.IsFileMaster == true) on a.FileCode equals b.FileCode
                             join f in _context.EDMSRepositorys on a.ReposCode equals f.ReposCode into f1
                             from f in f1.DefaultIfEmpty()
                             join g in listFileByUser on b.FileCode equals g.FileID into g1
                             from g in g1.DefaultIfEmpty()
                             join c in _context.ActivityInstFiles.Where(x => !x.IsDeleted) on a.FileCode equals c.FileID
                             where (listFileByUser.Any(x => x.FileID.Equals(b.FileCode)) || b.CreatedBy.Equals(ESEIM.AppContext.UserName) || session.IsAllData)
                             select new ListFile
                             {
                                 Id = a.Id,
                                 FileCode = b.FileCode,
                                 FileName = b.FileName,
                                 FileTypePhysic = b.FileTypePhysic,
                                 Desc = b.Desc,
                                 CreatedTime = b.CreatedTime.Value,
                                 CloudFileId = b.CloudFileId,
                                 ReposName = f != null ? f.ReposName : "",
                                 FileID = b.FileID,
                                 SizeOfFile = b.FileSize.HasValue ? b.FileSize.Value : 0,
                                 Type = "NO_SHARE",
                                 SignatureRequire = c.SignatureRequire,
                                 Url = b.Url,
                                 IsSign = c.IsSign,
                                 SignatureJson = c.SignatureJson,
                                 ListUserShare = g.ListUserShare
                             })
                             .Union(
                            from a in _context.FilesShareObjectUsers.Where(x => !x.IsDeleted)
                            join c in _context.EDMSRepoCatFiles on a.FileID equals c.FileCode
                            join b in _context.EDMSFiles on c.FileCode equals b.FileCode
                            join f in _context.EDMSRepositorys on c.ReposCode equals f.ReposCode into f1
                            from f in f1.DefaultIfEmpty()
                            let rela = JsonConvert.DeserializeObject<ObjRelative>(a.ObjectRelative)
                            where rela.ObjectInstance.Equals(jTablePara.ActInstCode) && rela.ObjectType.Equals("ACT_INST")
                            select new ListFile
                            {
                                Id = c.Id,
                                FileCode = b.FileCode,
                                FileName = b.FileName,
                                FileTypePhysic = b.FileTypePhysic,
                                Desc = b.Desc,
                                CreatedTime = b.CreatedTime.Value,
                                CloudFileId = b.CloudFileId,
                                ReposName = f != null ? f.ReposName : "",
                                FileID = b.FileID,
                                SizeOfFile = b.FileSize.HasValue ? b.FileSize.Value : 0,
                                Type = "SHARE",
                                SignatureRequire = false,
                                Url = b.Url,
                                IsSign = false,
                                SignatureJson = "",
                                ListUserShare = a.ListUserShare
                            }).DistinctBy(x=>x.Id);

                int count = query.Count();
                var data = query.Skip(intBeginFor).Take(jTablePara.Length).ToList();
                var jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, count, "Id", "FileCode", "FileName", "FileTypePhysic",
                    "Desc", "CreatedTime", "CloudFileId", "ReposName", "TypeFile", "FileID", "SizeOfFile", "SignatureRequire", "Url",
                    "IsSign", "SignatureJson", "ListUserShare");
                return jdata;
            }
            catch (Exception ex)
            {
                var data = new List<object>();
                var jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, 0, "Id", "FileCode", "FileName", "FileTypePhysic",
                    "Desc", "CreatedTime", "CloudFileId", "ReposName", "TypeFile", "FileID", "SizeOfFile", "SignatureRequire", "Url",
                    "IsSign", "SignatureJson", "ListUserShare");
                return jdata;
            }
        }

        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
        [RequestSizeLimit(long.MaxValue)]
        public JsonResult InsertActInstFile(EDMSRepoCatFileModel obj, IFormFile fileUpload)
        {
            var msg = new JMessage() { Error = false, Title = "" };
            try
            {
                var mimeType = fileUpload.ContentType;
                string extension = Path.GetExtension(fileUpload.FileName);
                string urlFile = "";
                string fileId = "";
                if (Array.IndexOf(LuceneExtension.fileMimetypes, mimeType) >= 0 && (Array.IndexOf(LuceneExtension.fileExt, extension.ToUpper()) >= 0))
                {
                    string reposCode = "";
                    string catCode = "";
                    string path = "";
                    string folderId = "";
                    //Chọn file ngắn gọn
                    if (!obj.IsMore)
                    {
                        //var suggesstion = GetSuggestionsActInstFile(obj.ActInstCode);
                        //if (suggesstion != null)
                        //{
                        //    reposCode = suggesstion.ReposCode;
                        //    path = suggesstion.Path;
                        //    folderId = suggesstion.FolderId;
                        //    catCode = suggesstion.CatCode;
                        //}
                        //else
                        //{
                        //    msg.Error = true;
                        //    msg.Title = _stringLocalizer["WFAI_MSG_ENTER_ATTR_EXTEND"];
                        //    return Json(msg);
                        //}

                        var repoDefault = _context.EDMSRepoDefaultObjects.FirstOrDefault(x => !x.IsDeleted
                                && x.ObjectCode.Equals(obj.ActInstCode) && x.ObjectType.Equals(EnumHelper<ObjectType>.GetDisplayValue(ObjectType.ActInst)));
                        if (repoDefault != null)
                        {
                            reposCode = repoDefault.ReposCode;
                            path = repoDefault.Path;
                            folderId = repoDefault.FolderId;
                            catCode = repoDefault.CatCode;
                        }
                        else
                        {
                            reposCode = repos_code;
                            path = host_type == 0 ? path_upload_file : "";
                            folderId = host_type == 1 ? path_upload_file : "";
                            catCode = cat_code;
                            /*msg.Error = true;
                            msg.Title = _sharedResources["COM_MSG_PLS_SETUP_FOLDER_DEFAULT"];
                            return Json(msg);*/
                        }
                    }
                    //Hiển file mở rộng
                    else
                    {
                        var setting = _context.EDMSCatRepoSettings.FirstOrDefault(x => x.Id == obj.CateRepoSettingId);
                        if (setting != null)
                        {
                            reposCode = setting.ReposCode;
                            path = setting.Path;
                            folderId = setting.FolderId;
                            catCode = setting.CatCode;
                        }
                        else
                        {
                            reposCode = repos_code;
                            path = host_type == 0 ? path_upload_file : "";
                            folderId = host_type == 1 ? path_upload_file : "";
                            catCode = cat_code;
                            /*msg.Error = true;
                            msg.Title = _stringLocalizer["WFAI_MSG_SELECT_FORDER"];
                            return Json(msg);*/
                        }
                    }
                    var getRepository = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == reposCode);
                    if (getRepository.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server))
                    {
                        using (var ms = new MemoryStream())
                        {
                            fileUpload.CopyTo(ms);
                            var fileBytes = ms.ToArray();
                            urlFile = path + Path.Combine("/", fileUpload.FileName);
                            var urlFilePreventive = path + Path.Combine("/", Guid.NewGuid().ToString().Substring(0, 8) + fileUpload.FileName);
                            var urlEnd = System.Web.HttpUtility.UrlPathEncode("ftp://" + getRepository.Server + urlFile);
                            var urlEndPreventive = System.Web.HttpUtility.UrlPathEncode("ftp://" + getRepository.Server + urlFilePreventive);
                            var result = FileExtensions.UploadFileToFtpServer(urlEnd, urlEndPreventive, fileBytes, getRepository.Account, getRepository.PassWord);
                            if (result.Status == WebExceptionStatus.ConnectFailure || result.Status == WebExceptionStatus.ProtocolError)
                            {
                                msg.Error = true;
                                msg.Title = _sharedResources["COM_CONNECT_FAILURE"];
                                return Json(msg);
                            }
                            else if (result.Status == WebExceptionStatus.Success)
                            {
                                if (result.IsSaveUrlPreventive)
                                {
                                    urlFile = urlFilePreventive;
                                }
                            }
                            else
                            {
                                msg.Error = true;
                                msg.Title = _sharedResources["COM_MSG_ERR"];
                                return Json(msg);
                            }
                        }
                    }
                    else if (getRepository.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.GooglerDriver))
                    {
                        var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == getRepository.Token);
                        var json = apiTokenService.CredentialsJson;
                        var user = apiTokenService.Email;
                        var token = apiTokenService.RefreshToken;
                        fileId = FileExtensions.UploadFileToDrive(json, token, fileUpload.FileName, fileUpload.OpenReadStream(), fileUpload.ContentType, folderId, user);
                    }
                    var edmsReposCatFile = new EDMSRepoCatFile
                    {
                        FileCode = string.Concat("ActInst_", Guid.NewGuid().ToString()),
                        ReposCode = reposCode,
                        CatCode = catCode,
                        ObjectCode = obj.ActInstCode,
                        ObjectType = EnumHelper<ActivityInst>.GetDisplayValue(ActivityInst.ActivityInst),
                        Path = path,
                        FolderId = folderId
                    };
                    _context.EDMSRepoCatFiles.Add(edmsReposCatFile);

                    /// created Index lucene
                    var moduleObj = (EDMSCatRepoSetting)_upload.GetPathByModule("DB_LUCENE_INDEX").Object;
                    var luceneCategory = _context.EDMSCategorys.FirstOrDefault(x => x.CatCode == moduleObj.CatCode);
                    LuceneExtension.IndexFile(edmsReposCatFile.FileCode, fileUpload, luceneCategory.PathServerPhysic);
                    //LuceneExtension.IndexFile(edmsReposCatFile.FileCode, fileUpload, string.Concat(_hostingEnvironment.WebRootPath, "\\uploads\\luceneIndex"));

                    //add File
                    var file = new EDMSFile
                    {
                        FileCode = edmsReposCatFile.FileCode,
                        FileName = fileUpload.FileName,
                        Desc = obj.Desc,
                        ReposCode = reposCode,
                        Tags = obj.Tags,
                        FileSize = fileUpload.Length,
                        FileTypePhysic = Path.GetExtension(fileUpload.FileName),
                        NumberDocument = obj.NumberDocument,
                        CreatedBy = ESEIM.AppContext.UserName,
                        CreatedTime = DateTime.Now,
                        Url = urlFile,
                        MimeType = mimeType,
                        CloudFileId = fileId,
                    };
                    _context.EDMSFiles.Add(file);

                    //Real-time
                    UpdateChangeActInst(obj.ActInstCode);

                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_ADD_SUCCESS"];
                    msg.ID = edmsReposCatFile.Id;
                    msg.Object = obj.UUID;
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _sharedResources["COM_MSG_INVALID_FORMAT"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpGet]
        public EDMSRepoCatFile GetSuggestionsActInstFile(string actInstCode)
        {
            var query = _context.EDMSRepoCatFiles.Where(x => x.ObjectCode == actInstCode && x.ObjectType == EnumHelper<ActivityInst>.GetDisplayValue(ActivityInst.ActivityInst)).MaxBy(x => x.Id);
            return query;
        }

        [HttpPost]
        public object GetListUserShareAct(string actInstCode)
        {
            var data = from a in _context.Users.Select(x => new { Code = x.UserName, Name = x.GivenName, x.DepartmentId, UserId = x.Id })
                       join b in _context.AdDepartments.Where(x => !x.IsDeleted && x.IsEnabled) on a.DepartmentId equals b.DepartmentCode into b1
                       from b in b1.DefaultIfEmpty()
                       join c in _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst.Equals(actInstCode)) on a.UserId equals c.UserId
                       select new
                       {
                           a.Code,
                           a.Name,
                           DepartmentName = b != null ? b.Title : ""
                       };
            return data;
        }

        [HttpPost]
        public JsonResult InsertFileShareActInst([FromBody] ShareFilePermission obj)
        {
            var msg = new JMessage { Title = "", Error = false };
            try
            {
                var data = (from a in _context.EDMSRepoCatFiles.Where(x => x.Id == obj.Id)
                            join b in _context.EDMSRepositorys on a.ReposCode equals b.ReposCode into b2
                            from b in b2.DefaultIfEmpty()
                            join c in _context.EDMSFiles on a.FileCode equals c.FileCode into c2
                            from c in c2.DefaultIfEmpty()
                            select new
                            {
                                a.Id,
                                Server = (b != null ? b.Server : null),
                                Type = (b != null ? b.Type : null),
                                Url = (c != null ? c.Url : null),
                                FileId = (c != null ? c.CloudFileId : null),
                                FileTypePhysic = c.FileTypePhysic,
                                c.FileName,
                                c.MimeType,
                                b.Account,
                                b.PassWord,
                                c.FileCode,
                                c.IsEdit,
                                c.IsFileMaster,
                                c.FileParentId
                            }).FirstOrDefault();

                if (data != null)
                {
                    var check = _context.FilesShareObjectUsers.FirstOrDefault(x => !x.IsDeleted && x.FileID.Equals(data.FileCode));
                    var share = new UserShare
                    {
                        Code = obj.Code,
                        Name = obj.Name,
                        DepartmentName = obj.DepartmentName,
                        Permission = obj.Permission
                    };
                    var lstUserShare = new List<UserShare>();
                    if (check == null)
                    {
                        lstUserShare.Add(share);
                        var rela = new
                        {
                            ObjectType = EnumHelper<ActivityInst>.GetDisplayValue(ActivityInst.ActivityInst),
                            ObjectInstance = data.Id
                        };
                        var files = new FilesShareObjectUser
                        {
                            CreatedBy = ESEIM.AppContext.UserName,
                            CreatedTime = DateTime.Now,
                            FileID = data.FileCode,
                            FileCreated = User.Identity.Name,
                            FileUrl = data.Url,
                            FileName = data.FileName,
                            ObjectRelative = JsonConvert.SerializeObject(rela),
                            ListUserShare = JsonConvert.SerializeObject(lstUserShare)
                        };
                        _context.FilesShareObjectUsers.Add(files);
                        _context.SaveChanges();
                        msg.Title = "Chia sẻ thành công";
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(check.ListUserShare))
                        {
                            lstUserShare = JsonConvert.DeserializeObject<List<UserShare>>(check.ListUserShare);
                            var isAdded = false;
                            foreach (var item in lstUserShare)
                            {
                                if (item.Code == obj.Code)
                                {
                                    item.Permission = obj.Permission;
                                    isAdded = true;
                                    break;
                                }
                            }
                            if (isAdded)
                            {
                                check.ListUserShare = JsonConvert.SerializeObject(lstUserShare);
                                check.UpdatedBy = ESEIM.AppContext.UserName;
                                check.UpdatedTime = DateTime.Now;
                                _context.FilesShareObjectUsers.Update(check);
                                _context.SaveChanges();
                                msg.Title = "Cập nhật thành công";
                            }
                            else
                            {
                                lstUserShare.Add(share);
                                check.ListUserShare = JsonConvert.SerializeObject(lstUserShare);
                                check.UpdatedBy = ESEIM.AppContext.UserName;
                                check.UpdatedTime = DateTime.Now;
                                _context.FilesShareObjectUsers.Update(check);
                                _context.SaveChanges();
                                msg.Title = "Chia sẻ thành công";
                            }
                        }
                        else
                        {
                            lstUserShare.Add(share);
                            check.ListUserShare = JsonConvert.SerializeObject(lstUserShare);
                            check.UpdatedBy = ESEIM.AppContext.UserName;
                            check.UpdatedTime = DateTime.Now;
                            _context.FilesShareObjectUsers.Update(check);
                            _context.SaveChanges();
                            msg.Title = "Chia sẻ thành công";
                        }
                    }
                }

                msg.Title = _stringLocalizer["WFAI_MSG_SHARE_SUCCESS"];
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult GetUserShareFilePermission(int id)
        {
            var data = (from a in _context.EDMSRepoCatFiles.Where(x => x.Id == id)
                        join b in _context.EDMSRepositorys on a.ReposCode equals b.ReposCode into b2
                        from b in b2.DefaultIfEmpty()
                        join c in _context.EDMSFiles on a.FileCode equals c.FileCode into c2
                        from c in c2.DefaultIfEmpty()
                        select new
                        {
                            a.Id,
                            Server = (b != null ? b.Server : null),
                            Type = (b != null ? b.Type : null),
                            Url = (c != null ? c.Url : null),
                            FileId = (c != null ? c.CloudFileId : null),
                            FileTypePhysic = c.FileTypePhysic,
                            c.FileName,
                            c.MimeType,
                            b.Account,
                            b.PassWord,
                            c.FileCode,
                            c.IsEdit,
                            c.IsFileMaster,
                            c.FileParentId
                        }).FirstOrDefault();
            var lstUserShare = new List<UserShare>();
            if (data != null)
            {
                var check = _context.FilesShareObjectUsers.FirstOrDefault(x => !x.IsDeleted && x.FileID.Equals(data.FileCode));
                if (check != null)
                {
                    if (!string.IsNullOrEmpty(check.ListUserShare))
                    {
                        lstUserShare = JsonConvert.DeserializeObject<List<UserShare>>(check.ListUserShare);
                    }
                }
            }
            return Json(lstUserShare);
        }

        [HttpPost]
        public JsonResult DeleteShareFile(int id, string userName)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = (from a in _context.EDMSRepoCatFiles.Where(x => x.Id == id)
                            join b in _context.EDMSRepositorys on a.ReposCode equals b.ReposCode into b2
                            from b in b2.DefaultIfEmpty()
                            join c in _context.EDMSFiles on a.FileCode equals c.FileCode into c2
                            from c in c2.DefaultIfEmpty()
                            select new
                            {
                                a.Id,
                                Server = (b != null ? b.Server : null),
                                Type = (b != null ? b.Type : null),
                                Url = (c != null ? c.Url : null),
                                FileId = (c != null ? c.CloudFileId : null),
                                FileTypePhysic = c.FileTypePhysic,
                                c.FileName,
                                c.MimeType,
                                b.Account,
                                b.PassWord,
                                c.FileCode,
                                c.IsEdit,
                                c.IsFileMaster,
                                c.FileParentId
                            }).FirstOrDefault();
                var lstUserShare = new List<UserShare>();
                if (data != null)
                {
                    var check = _context.FilesShareObjectUsers.FirstOrDefault(x => !x.IsDeleted && x.FileID.Equals(data.FileCode));
                    if (check != null)
                    {
                        if (!string.IsNullOrEmpty(check.ListUserShare))
                        {
                            lstUserShare = JsonConvert.DeserializeObject<List<UserShare>>(check.ListUserShare);
                            foreach (var item in lstUserShare)
                            {
                                if (item.Code.Equals(userName))
                                {
                                    lstUserShare.Remove(item);
                                    break;
                                }
                            }
                            check.ListUserShare = JsonConvert.SerializeObject(lstUserShare);
                            _context.FilesShareObjectUsers.Update(check);
                            _context.SaveChanges();
                            msg.Title = "Xóa thành công";
                        }
                        else
                        {
                            msg.Error = true;
                            msg.Title = "Không tìm thấy bản ghi";
                        }
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Không tìm thấy bản ghi";
                    }
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy bản ghi";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public void AutoShareFilePermission([FromBody] AutoShareFileModel obj)
        {
            var data = (from a in _context.EDMSRepoCatFiles.Where(x => x.Id == obj.Id)
                        join b in _context.EDMSRepositorys on a.ReposCode equals b.ReposCode into b2
                        from b in b2.DefaultIfEmpty()
                        join c in _context.EDMSFiles on a.FileCode equals c.FileCode into c2
                        from c in c2.DefaultIfEmpty()
                        select new
                        {
                            a.Id,
                            Server = (b != null ? b.Server : null),
                            Type = (b != null ? b.Type : null),
                            Url = (c != null ? c.Url : null),
                            FileId = (c != null ? c.CloudFileId : null),
                            FileTypePhysic = c.FileTypePhysic,
                            c.FileName,
                            c.MimeType,
                            b.Account,
                            b.PassWord,
                            c.FileCode,
                            c.IsEdit,
                            c.IsFileMaster,
                            c.FileParentId
                        }).FirstOrDefault();

            if (data != null)
            {
                var check = _context.FilesShareObjectUsers.FirstOrDefault(x => !x.IsDeleted && x.FileID.Equals(data.FileCode));
                if (check == null)
                {
                    var rela = new
                    {
                        ObjectType = EnumHelper<ActivityInst>.GetDisplayValue(ActivityInst.ActivityInst),
                        ObjectInstance = data.Id
                    };
                    var files = new FilesShareObjectUser
                    {
                        CreatedBy = ESEIM.AppContext.UserName,
                        CreatedTime = DateTime.Now,
                        FileID = data.FileCode,
                        FileCreated = User.Identity.Name,
                        FileUrl = data.Url,
                        FileName = data.FileName,
                        ObjectRelative = JsonConvert.SerializeObject(rela),
                        ListUserShare = obj.LstShare
                    };
                    _context.FilesShareObjectUsers.Add(files);
                    _context.SaveChanges();
                }
            }
        }

        [HttpPost]
        public JsonResult UpdateActInstFile(EDMSRepoCatFileModel obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                string path = "";
                string fileId = "";
                var oldSetting = _context.EDMSRepoCatFiles.FirstOrDefault(x => x.FileCode == obj.FileCode);
                if (oldSetting != null)
                {
                    var newSetting = _context.EDMSCatRepoSettings.FirstOrDefault(x => x.Id == obj.CateRepoSettingId);
                    if (newSetting != null)
                    {
                        var file = _context.EDMSFiles.FirstOrDefault(x => x.FileCode == oldSetting.FileCode);
                        //change folder
                        if ((string.IsNullOrEmpty(oldSetting.Path) && oldSetting.FolderId != newSetting.FolderId) || (string.IsNullOrEmpty(oldSetting.FolderId) && oldSetting.Path != newSetting.Path))
                        {
                            //dowload file old
                            var oldRepo = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == oldSetting.ReposCode);
                            byte[] fileData = null;
                            if (oldRepo.Type == "SERVER")
                            {
                                string ftphost = oldRepo.Server;
                                string ftpfilepath = file.Url;
                                var urlEnd = System.Web.HttpUtility.UrlPathEncode("ftp://" + ftphost + ftpfilepath);
                                using (WebClient request = new WebClient())
                                {
                                    request.Credentials = new NetworkCredential(oldRepo.Account, oldRepo.PassWord);
                                    fileData = request.DownloadData(urlEnd);
                                }
                            }
                            else
                            {
                                fileData = FileExtensions.DownloadFileGoogle(_hostingEnvironment.WebRootPath + "\\files\\credentials.json", _hostingEnvironment.WebRootPath + "\\files\\token.json", file.CloudFileId);
                            }
                            //delete folder old
                            if (oldRepo.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server))
                            {
                                var urlEnd = System.Web.HttpUtility.UrlPathEncode("ftp://" + oldRepo.Server + file.Url);
                                FileExtensions.DeleteFileFtpServer(urlEnd, oldRepo.Account, oldRepo.PassWord);
                            }
                            else if (oldRepo.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.GooglerDriver))
                            {
                                FileExtensions.DeleteFileGoogleServer(_hostingEnvironment.WebRootPath + "\\files\\credentials.json", _hostingEnvironment.WebRootPath + "\\files\\token.json", file.CloudFileId);
                            }

                            //insert folder new
                            var newRepo = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == newSetting.ReposCode);
                            if (newRepo.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server))
                            {
                                path = newSetting.Path + Path.Combine("/", file.FileName);
                                var pathPreventive = path + Path.Combine("/", Guid.NewGuid().ToString().Substring(0, 8) + file.FileName);
                                var urlEnd = System.Web.HttpUtility.UrlPathEncode("ftp://" + newRepo.Server + path);
                                var urlEndPreventive = System.Web.HttpUtility.UrlPathEncode("ftp://" + newRepo.Server + pathPreventive);
                                var result = FileExtensions.UploadFileToFtpServer(urlEnd, urlEndPreventive, fileData, newRepo.Account, newRepo.PassWord);
                                if (result.Status == WebExceptionStatus.ConnectFailure || result.Status == WebExceptionStatus.ProtocolError)
                                {
                                    msg.Error = true;
                                    msg.Title = _sharedResources["COM_CONNECT_FAILURE"];
                                    return Json(msg);
                                }
                                else if (result.Status == WebExceptionStatus.Success)
                                {
                                    if (result.IsSaveUrlPreventive)
                                    {
                                        path = pathPreventive;
                                    }
                                }
                                else
                                {
                                    msg.Error = true;
                                    msg.Title = _sharedResources["COM_MSG_ERR"];
                                    return Json(msg);
                                }
                            }
                            else if (newRepo.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.GooglerDriver))
                            {
                                fileId = FileExtensions.UploadFileToDrive(_hostingEnvironment.WebRootPath + "\\files\\credentials.json", _hostingEnvironment.WebRootPath + "\\files\\token.json", file.FileName, new MemoryStream(fileData), file.MimeType, newSetting.FolderId);
                            }
                            file.CloudFileId = fileId;
                            file.Url = path;

                            //update setting new
                            oldSetting.CatCode = newSetting.CatCode;
                            oldSetting.ReposCode = newSetting.ReposCode;
                            oldSetting.Path = newSetting.Path;
                            oldSetting.FolderId = newSetting.FolderId;
                            _context.EDMSRepoCatFiles.Update(oldSetting);
                        }
                        //update header
                        file.Desc = obj.Desc;
                        file.Tags = obj.Tags;
                        file.NumberDocument = obj.NumberDocument;
                        _context.EDMSFiles.Update(file);
                        _context.SaveChanges();
                        msg.Title = _stringLocalizer["HR_HR_MSG_UPDATE_SUCCESS"];
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = _stringLocalizer["HR_HR_MAN_MSG_SELECT_FORDER"];
                    }
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["HR_HR_MSG_FILE_NOT_EXIST"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = String.Format(_sharedResources["COM_MSG_UPDATE_FAILED"], _stringLocalizer[""]);// "Có lỗi xảy ra khi cập nhật!";
                msg.Object = ex;
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult AddFileActInst(int id, string actInstCode, bool isRequireSign)
        {
            var msg = new JMessage();
            try
            {
                var query = (from a in _context.EDMSRepoCatFiles.Where(x => x.Id == id)
                             join b in _context.EDMSFiles.Where(x => !x.IsDeleted && (x.IsFileMaster == true || x.IsFileMaster == null)) on a.FileCode equals b.FileCode
                             select new
                             {
                                 a.FileCode,
                                 b.FileTypePhysic
                             }).FirstOrDefault();
                if (query != null)
                {
                    var file = new ActivityInstFile
                    {
                        ActivityInstCode = actInstCode,
                        SignatureRequire = (query.FileTypePhysic.Equals(".docx") || query.FileTypePhysic.Equals(".doc")) ? isRequireSign : false,
                        FileID = query.FileCode,
                        CreatedBy = ESEIM.AppContext.UserName,
                        CreatedTime = DateTime.Now
                    };
                    _context.ActivityInstFiles.Add(file);
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {

            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult DeleteActInstFile(int id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.EDMSRepoCatFiles.FirstOrDefault(x => x.Id == id);

                var fileActInst = _context.ActivityInstFiles.FirstOrDefault(x => x.FileID.Equals(data.FileCode) && !x.IsDeleted);
                if (fileActInst != null)
                {
                    fileActInst.IsDeleted = true;
                    fileActInst.DeletedBy = ESEIM.AppContext.UserName;
                    fileActInst.DeletedTime = DateTime.Now;
                    _context.ActivityInstFiles.Update(fileActInst);
                }

                _context.EDMSRepoCatFiles.Remove(data);

                var file = _context.EDMSFiles.FirstOrDefault(x => x.FileCode == data.FileCode);
                _context.EDMSFiles.Remove(file);

                LuceneExtension.DeleteIndexFile(file.FileCode, _hostingEnvironment.WebRootPath + "\\uploads\\luceneIndex");
                var getRepository = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == data.ReposCode);
                if (getRepository != null)
                {
                    if (getRepository.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server))
                    {
                        var urlEnd = System.Web.HttpUtility.UrlPathEncode("ftp://" + getRepository.Server + file.Url);
                        FileExtensions.DeleteFileFtpServer(urlEnd, getRepository.Account, getRepository.PassWord);
                    }
                    else if (getRepository.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.GooglerDriver))
                    {
                        FileExtensions.DeleteFileGoogleServer(_hostingEnvironment.WebRootPath + "\\files\\credentials.json", _hostingEnvironment.WebRootPath + "\\files\\token.json", file.CloudFileId);
                    }
                }

                //Real-time
                UpdateChangeActInst(data.ObjectCode);

                _context.SaveChanges();
                msg.Title = String.Format(_sharedResources["COM_MSG_DELETE_SUCCESS"], _stringLocalizer[""]);// "Xóa thành công";
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = String.Format(_sharedResources["COM_MSG_DELETE_FAIL"], _stringLocalizer[""]);//"Có lỗi xảy ra khi xóa!";
                msg.Object = ex;
            }
            return Json(msg);
        }

        [NonAction]
        public JMessage CopyFile(int idRepoCatFile, string urlFile, string repoCodeTo, string catCodeTo, string contentType)
        {
            var msg = new JMessage() { Error = false, Title = "Sao chép thành công" };
            try
            {
                var data = (from a in _context.EDMSRepoCatFiles.Where(x => x.Id == idRepoCatFile)
                            join b in _context.EDMSRepositorys on a.ReposCode equals b.ReposCode into b2
                            from b in b2.DefaultIfEmpty()
                            join c in _context.EDMSFiles on a.FileCode equals c.FileCode into c2
                            from c in c2.DefaultIfEmpty()
                            select new
                            {
                                a.Id,
                                Server = (b != null ? b.Server : null),
                                Type = (b != null ? b.Type : null),
                                ReposCode = (b != null ? b.ReposCode : null),
                                Url = (c != null ? c.Url : null),
                                FileId = (c != null ? c.CloudFileId : null),
                                FileTypePhysic = c.FileTypePhysic,
                                c.FileName,
                                c.MimeType,
                                b.Account,
                                b.PassWord,
                                c.FileCode,
                                c.IsEdit,
                                c.IsFileMaster,
                                c.FileParentId,
                            }).FirstOrDefault();

                if (data != null)
                {
                    var fileNameUpload = Path.GetFileName(urlFile);
                    var fileBytes = DownloadFileFromServer(idRepoCatFile);
                    msg = UploadFileToServer(fileBytes, repoCodeTo, catCodeTo, fileNameUpload, contentType);
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
                return msg;
            }
            return msg;
        }
        [NonAction]
        public byte[] DownloadFileFromServer(int idRepoCatFile)
        {
            byte[] fileStream = new byte[0];

            var data = (from a in _context.EDMSRepoCatFiles.Where(x => x.Id == idRepoCatFile)
                        join b in _context.EDMSRepositorys on a.ReposCode equals b.ReposCode into b2
                        from b in b2.DefaultIfEmpty()
                        join c in _context.EDMSFiles on a.FileCode equals c.FileCode into c2
                        from c in c2.DefaultIfEmpty()
                        select new
                        {
                            a.Id,
                            Server = (b != null ? b.Server : null),
                            Type = (b != null ? b.Type : null),
                            Token = (b != null ? b.Token : null),
                            ReposCode = (b != null ? b.ReposCode : null),
                            Url = (c != null ? c.Url : null),
                            FileId = (c != null ? c.CloudFileId : null),
                            FileTypePhysic = c.FileTypePhysic,
                            c.FileName,
                            c.MimeType,
                            b.Account,
                            b.PassWord,
                            c.FileCode,
                            c.IsEdit,
                            c.IsFileMaster,
                            c.FileParentId
                        }).FirstOrDefault();

            var getRepository = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == data.ReposCode);
            if (getRepository.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server))
            {
                using (var ms = new MemoryStream())
                {
                    string ftphost = data.Server;
                    string ftpfilepath = data.Url;
                    var urlEnd = System.Web.HttpUtility.UrlPathEncode("ftp://" + ftphost + ftpfilepath);
                    using (WebClient request = new WebClient())
                    {
                        request.Credentials = new NetworkCredential(data.Account, data.PassWord);
                        fileStream = request.DownloadData(urlEnd);
                    }
                }
            }
            else if (getRepository.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.GooglerDriver))
            {
                var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == data.Token);
                var json = apiTokenService.CredentialsJson;
                var user = apiTokenService.Email;
                var token = apiTokenService.RefreshToken;
                fileStream = FileExtensions.DownloadFileGoogle(json, token, data.FileId, user);
            }

            return fileStream;
        }

        [NonAction]
        public JMessage UploadFileToServer(byte[] fileByteArr, string repoCode, string catCode, string fileName, string contentType)
        {
            var msg = new JMessage() { Error = false, Title = "Tải tệp thành công" };
            try
            {
                var data = (from a in _context.EDMSCatRepoSettings.Where(x => x.ReposCode.Equals(repoCode) && x.CatCode.Equals(catCode))
                            join b in _context.EDMSRepositorys on a.ReposCode equals b.ReposCode into b2
                            from b in b2.DefaultIfEmpty()
                            select new
                            {
                                Server = (b != null ? b.Server : null),
                                Type = (b != null ? b.Type : null),
                                a.Path,
                                a.FolderId,
                                b.Account,
                                b.PassWord,
                            }).FirstOrDefault();

                var getRepository = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == repoCode);
                if (getRepository.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server))
                {
                    var fileBytes = fileByteArr;
                    var urlFile = string.Concat(data.Path, "/", fileName);
                    var urlFileServer = System.Web.HttpUtility.UrlPathEncode("ftp://" + data.Server + urlFile);
                    var result = FileExtensions.UploadFileToFtpServer(urlFileServer, urlFileServer, fileBytes, data.Account, data.PassWord);
                    if (result.Status == WebExceptionStatus.ConnectFailure || result.Status == WebExceptionStatus.ProtocolError)
                    {
                        msg.Error = true;
                        msg.Title = _sharedResources["COM_CONNECT_FAILURE"];

                        return msg;
                    }
                    else if (result.Status == WebExceptionStatus.Success)
                    {
                        msg.Object = urlFile;
                        if (result.IsSaveUrlPreventive)
                        {
                            //urlFile = urlFilePreventive;
                        }
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = _sharedResources["COM_MSG_ERR"];
                        return msg;
                    }
                }
                else if (getRepository.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.GooglerDriver))
                {
                    Stream stream = new MemoryStream(fileByteArr);
                    var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == getRepository.Token);
                    var json = apiTokenService.CredentialsJson;
                    var user = apiTokenService.Email;
                    var token = apiTokenService.RefreshToken;
                    msg.Object = FileExtensions.UploadFileToDrive(json, token, fileName, stream, contentType, data.FolderId, user);
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = "Ex Upload Func" + ex.Message;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }

            return msg;
        }

        public class JTableModelFile : JTableModel
        {
            public string ActInstCode { get; set; }
            public string FromDate { get; set; }
            public string ToDate { get; set; }
            public string CatCode { get; set; }
        }
        public class ActInstFileShareModel
        {
            public int? Id { get; set; }
            public string ListUserShare { get; set; }
        }

        public class ShareFilePermission
        {
            public string Code { get; set; }
            public string Name { get; set; }
            public string DepartmentName { get; set; }
            public PermissionFile Permission { get; set; }
            public int Id { get; set; }
        }
        public class UserShare
        {
            public string Code { get; set; }
            public string Name { get; set; }
            public string DepartmentName { get; set; }
            public PermissionFile Permission { get; set; }
        }

        public class AutoShareFileModel
        {
            public int Id { get; set; }
            public string LstShare { get; set; }
        }
        #endregion

        #region Language
        [HttpGet]
        public IActionResult Translation(string lang)
        {
            var resourceObject = new JObject();
            var query = _stringLocalizer.GetAllStrings().Select(x => new { x.Name, x.Value })
                .Union(_stringLocalizerCus.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_stringLocalizerCard.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_stringLocalizerEdms.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_stringLocalizerHr.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_projectController.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_sharedResources.GetAllStrings().Select(x => new { x.Name, x.Value }));
            foreach (var item in query)
            {
                resourceObject.Add(item.Name, item.Value);
            }
            return Ok(resourceObject);
        }
        #endregion

        #region Activity user
        [HttpGet]
        public object GetActivityByUser(string actInstCode)
        {
            var userId = ESEIM.AppContext.UserId;
            var actionView = _context.ActInstanceUserActivitys.FirstOrDefault(x => x.UserId == userId
                && x.ActInstCode == actInstCode && x.Action == EnumHelper<CardAction>.GetDisplayValue(CardAction.Review));
            if (actionView == null)
            {
                var activity = new ActInstanceUserActivity
                {
                    UserId = userId,
                    ActInstCode = actInstCode,
                    Action = EnumHelper<CardAction>.GetDisplayValue(CardAction.Review),
                    IsCheck = true,
                    FromDevice = "Mobile",
                    CreatedTime = DateTime.Now
                };
                _context.ActInstanceUserActivitys.Add(activity);
                _context.SaveChanges();
            }
            var actionReject = _context.ActInstanceUserActivitys.Where(x => x.UserId == userId && x.ActInstCode == actInstCode
                && x.Action == EnumHelper<CardAction>.GetDisplayValue(CardAction.Reject)).MaxBy(x => x.CreatedTime);
            var actionAcceipt = _context.ActInstanceUserActivitys.Where(x => x.UserId == userId && x.ActInstCode == actInstCode
                && x.Action == EnumHelper<CardAction>.GetDisplayValue(CardAction.Accept)).MaxBy(x => x.CreatedTime);

            var isReject = false;
            var isAccept = false;
            if (actionReject != null && actionAcceipt != null)
            {
                if (actionReject.CreatedTime > actionAcceipt.CreatedTime)
                {
                    if (actionReject.IsCheck)
                    {
                        isReject = true;
                        isAccept = false;
                    }
                }
                else
                {
                    if (actionAcceipt.IsCheck)
                    {
                        isReject = false;
                        isAccept = true;
                    }
                }
            }
            else if (actionReject == null && actionAcceipt != null)

            {
                if (actionAcceipt.IsCheck)
                {
                    isReject = false;
                    isAccept = true;
                }
                else
                {
                    isReject = false;
                    isAccept = false;
                }

            }
            else if (actionReject != null && actionAcceipt == null)
            {
                if (actionReject.IsCheck)
                {
                    isReject = true;
                    isAccept = false;
                }
                else
                {
                    isReject = false;
                    isAccept = false;
                }
            }

            return new[]
            {
                new
                {
                    Name= CardAction.Review.DescriptionAttr(),
                    Value= CardAction.Review.GetHashCode(),
                    Date = actionView != null ? actionView.CreatedTime.ToString("dd/MM/yyyy") : DateTime.Now.ToString("dd/MM/yyyy"),
                    Time = actionView != null ? actionView.CreatedTime.ToString("hh:mm:ssy") : DateTime.Now.ToString("hh:mm:ss"),
                    IsCheck = true,
                },
                 new
                {
                    Name= CardAction.Reject.DescriptionAttr(),
                    Value = CardAction.Reject.GetHashCode(),
                    Date = actionReject != null ? actionReject.CreatedTime.ToString("dd/MM/yyyy") : DateTime.Now.ToString("dd/MM/yyyy"),
                    Time = actionReject != null ? actionReject.CreatedTime.ToString("hh:mm:ss") : DateTime.Now.ToString("hh:mm:ss"),
                    IsCheck = isReject,
                },
                new
                {
                    Name= actionAcceipt != null? CardAction.Accept.DescriptionAttr() : "Hãy đồng ý!",
                    Value = CardAction.Accept.GetHashCode(),
                    Date = actionAcceipt != null ? actionAcceipt.CreatedTime.ToString("dd/MM/yyyy") : DateTime.Now.ToString("dd/MM/yyyy"),
                    Time = actionAcceipt != null ? actionAcceipt.CreatedTime.ToString("hh:mm:ss") : DateTime.Now.ToString("hh:mm:ss"),
                    IsCheck = isAccept,
                },
            };
        }

        [HttpGet]
        public JsonResult UpdateActivity(string actInstCode, int Value, bool IsCheck)
        {
            var msg = new JMessage() { Error = false, Title = "" };
            try
            {
                var actionText = "";
                var userId = ESEIM.AppContext.UserId;
                if (Value == CardAction.Review.GetHashCode())
                {
                    actionText = EnumHelper<CardAction>.GetDisplayValue(CardAction.Review);
                }
                else if (Value == CardAction.Reject.GetHashCode())
                {
                    actionText = EnumHelper<CardAction>.GetDisplayValue(CardAction.Reject);
                }
                else if (Value == CardAction.Accept.GetHashCode())
                {
                    actionText = EnumHelper<CardAction>.GetDisplayValue(CardAction.Accept);
                }
                if (actionText == EnumHelper<CardAction>.GetDisplayValue(CardAction.Review))
                {
                    var existActivity = _context.ActInstanceUserActivitys.FirstOrDefault(x => x.ActInstCode == actInstCode && x.UserId == userId && x.Action == EnumHelper<CardAction>.GetDisplayValue(CardAction.Review));
                    if (existActivity != null)
                    {
                        msg.Error = true;
                        msg.Title = _stringLocalizer["WFAI_MSG_VIEWED"];
                        return Json(msg);
                    }
                }
                if (IsCheck)
                {
                    var maxActionOther = _context.ActInstanceUserActivitys.Where(x => x.UserId == userId && x.ActInstCode == actInstCode && x.Action != EnumHelper<CardAction>.GetDisplayValue(CardAction.Review) && x.Action != actionText).MaxBy(x => x.CreatedTime);
                    if (maxActionOther != null)
                    {
                        maxActionOther.IsCheck = false;
                    }
                }
                var activity = new ActInstanceUserActivity
                {
                    UserId = ESEIM.AppContext.UserId,
                    ActInstCode = actInstCode,
                    Action = actionText,
                    IsCheck = IsCheck,
                    FromDevice = "Laptop/Desktop",
                    CreatedTime = DateTime.Now
                };
                _context.ActInstanceUserActivitys.Add(activity);
                _context.SaveChanges();
                msg.Object = new
                {
                    Date = activity.CreatedTime.ToString("dd/MM/yyyy"),
                    Time = activity.CreatedTime.ToString("hh:mm:ss"),
                    TimeActivity = DateTime.Now
                };
                msg.Title = _sharedResources["COM_UPDATE_SUCCESS"];
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpGet]
        public object LogActivityUser(string actInstCode)
        {
            var userId = ESEIM.AppContext.UserId;
            var activityExceptUser = (from a in _context.ActInstanceUserActivitys
                                      join b in _context.Users on a.UserId equals b.Id
                                      where a.ActInstCode == actInstCode && (a.Action == "REVIEW" || a.Action == "REJECT" || a.Action == "ACCEPT")
                                      && a.UserId != userId
                                      select new
                                      {
                                          a.Id,
                                          a.UserId,
                                          b.GivenName,
                                          b.Picture,
                                          a.Action,
                                          a.IdObject,
                                          CreatedTime = a.CreatedTime.ToString("dd/MM/yyyy HH:mm:ss"),
                                          a.IsCheck,
                                          a.ChangeDetails
                                      }).OrderByDescending(x => x.Id);
            var activityCurrentUser = (from a in _context.ActInstanceUserActivitys
                                       join b in _context.Users on a.UserId equals b.Id
                                       where a.ActInstCode == actInstCode && (a.Action == "REVIEW" || a.Action == "REJECT" || a.Action == "ACCEPT")
                                       && a.UserId == userId
                                       select new
                                       {
                                           a.Id,
                                           a.UserId,
                                           b.GivenName,
                                           b.Picture,
                                           a.Action,
                                           a.IdObject,
                                           CreatedTime = a.CreatedTime.ToString("dd/MM/yyyy HH:mm:ss"),
                                           a.IsCheck,
                                           a.ChangeDetails
                                       }).OrderByDescending(x => x.Id);
            var query = activityCurrentUser.Concat(activityExceptUser);

            var allActivity = (from a in _context.ActInstanceUserActivitys
                               join b in _context.Users on a.UserId equals b.Id
                               where a.ActInstCode == actInstCode && (a.Action == "REVIEW" || a.Action == "REJECT" || a.Action == "ACCEPT")
                               select new
                               {
                                   a.Id,
                                   a.UserId,
                                   b.GivenName,
                                   b.Picture,
                                   a.Action,
                                   a.IdObject,
                                   CreatedTime = a.CreatedTime.ToString("dd/MM/yyyy HH:mm:ss"),
                                   a.IsCheck,
                                   a.ChangeDetails
                               }).DistinctBy(x => new { x.Action, x.UserId });


            var countView = allActivity.Where(x => x.Action == "REVIEW");
            var countReject = allActivity.Where(x => x.Action == "REJECT");
            var countAccept = allActivity.Where(x => x.Action == "ACCEPT");
            return new
            {
                Log = query,
                CountView = countView.Count(),
                CountReject = countReject.Count(),
                CountAccept = countAccept.Count(),
            };
        }

        [HttpPost]
        public JsonResult GetLastActionUser(string actCode)
        {
            var msg = new JMessage();
            var query = _context.ActInstanceUserActivitys.OrderByDescending(x => x.CreatedTime);
            if (query.Any())
            {
                var obj = query.FirstOrDefault();

                var user = _context.Users.FirstOrDefault(x => x.Id.Equals(obj.UserId));
                if (user != null)
                {
                    obj.UserId = user.GivenName;
                }

                if (obj.Action == "REJECT")
                {
                    obj.Action = "Đã từ chối";
                }
                else if (obj.Action == "ACCEPT")
                {
                    obj.Action = "Đã đồng ý";
                }

                msg.Object = obj;
            }
            return Json(msg);
        }

        #endregion

        #region Send notifycation
        [HttpPost]
        public JsonResult GetMemberSendNotification(string actInstCode)
        {
            var listUsers = from a in _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst.Equals(actInstCode)
                            && x.Status.Equals("ASSIGN_STATUS_WORK"))
                            join b in _context.Users.Where(x => x.Active) on a.UserId equals b.Id
                            select new
                            {
                                a.UserId,
                                b.GivenName,
                                IsCheck = true
                            };
            return Json(listUsers);
        }

        [HttpPost]
        public JsonResult SendNotify([FromBody] ActNotify obj)
        {
            var msg = new JMessage();
            try
            {
                var session = HttpContext.GetSessionUser();
                var actInst = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(obj.ActInstCode));
                var wfInfo = (from a in _context.WorkflowInstances.Where(x => !x.IsDeleted.Value && x.WfInstCode.Equals(actInst.WorkflowCode))
                              join b in _context.WorkFlows.Where(x => !x.IsDeleted.Value) on a.WorkflowCode equals b.WfCode
                              select new
                              {
                                  a.WfInstCode,
                                  b.WfName,
                                  a.ObjectInst
                              }).FirstOrDefault();


                string message = session.FullName + " đã gửi thông báo";
                var timer = (DateTime?)null;
                if (actInst.Unit == "DURATION_UNIT20200904094128")
                {
                    timer = actInst.StartTime.HasValue ? actInst.StartTime.Value.AddDays(Convert.ToDouble(actInst.Duration)) : (DateTime?)null;
                }
                if (actInst.Unit == "DURATION_UNIT20200904094132")
                {
                    timer = actInst.StartTime.HasValue ? actInst.StartTime.Value.AddHours(Convert.ToDouble(actInst.Duration)) : (DateTime?)null;
                }
                if (actInst.Unit == "DURATION_UNIT20200904094135")
                {
                    timer = actInst.StartTime.HasValue ? actInst.StartTime.Value.AddMinutes(Convert.ToDouble(actInst.Duration)) : (DateTime?)null;
                }
                if (actInst.Unit == "DURATION_UNIT20200904094139")
                {
                    timer = actInst.StartTime.HasValue ? actInst.StartTime.Value.AddSeconds(Convert.ToDouble(actInst.Duration)) : (DateTime?)null;
                }
                SendPushNotification(obj.LstUser, message,
                        new
                        {
                            ActivityCode = actInst.ActivityCode,
                            ActivityInstCode = actInst.ActivityInstCode,
                            Desc = actInst.Desc,
                            Duration = actInst.Duration,
                            Group = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == actInst.Group).ValueSet ?? "",
                            ID = actInst.ID,
                            Located = actInst.Located,
                            ObjCode = wfInfo != null ? wfInfo.ObjectInst : "",
                            StatusCode = actInst.Status,
                            Timer = timer,
                            Title = actInst.Title,
                            Type = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == actInst.Type).ValueSet ?? "",
                            Unit = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet == actInst.Unit).ValueSet ?? "",
                            WorkflowCode = actInst.WorkflowCode,
                            WfName = wfInfo != null ? wfInfo.WfName : ""
                        },
                        EnumHelper<FromSrcSendNotify>.GetDisplayValue(FromSrcSendNotify.FromActInst));
                msg.Title = _stringLocalizer["WFAI_MSG_SEND_NOTIFY_SUCCESS"];
            }
            catch (Exception ex)
            {
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Error = true;
            }
            return Json(msg);
        }
        public class ActNotify
        {
            public string ActInstCode { get; set; }
            public List<CardMemberCustom> LstUser { get; set; }
        }
        #endregion

        #region Update status workflow in ticket, decisition, ..
        [AllowAnonymous]
        [HttpPost]
        public void UpdateStatusWF(string objType, string objCode, string status, string actRepeat)
        {
            var session = HttpContext.GetSessionUser();
            var wfInstance = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.ObjectInst.Equals(objCode)
                        && x.ObjectType.Equals(objType));
            if (wfInstance != null)
            {
                var acts = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(wfInstance.WfInstCode));
                if (!string.IsNullOrEmpty(wfInstance.MarkActCurrent))
                {
                    var currentAct = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(wfInstance.MarkActCurrent));
                    if (currentAct != null)
                    {
                        var running = _context.WorkflowInstanceRunnings.FirstOrDefault(x => !x.IsDeleted && x.ActivityInitial.Equals(currentAct.ActivityInstCode));
                        if (running != null)
                        {
                            var nextAct = acts.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(running.ActivityDestination));
                            var assigns = _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst.Equals(currentAct.ActivityInstCode));
                            if (assigns.Any(x => x.UserId.Equals(session.UserId)) || session.IsAllData || session.UserName.Equals(currentAct.CreatedBy))
                            {
                                if (status.Equals("INITIAL_DONE") || status.Equals("REPEAT_DONE") || status.Equals("FINAL_DONE"))
                                {
                                    if (status != "FINAL_DONE")
                                    {
                                        currentAct.Status = "STATUS_ACTIVITY_APPROVED";
                                        currentAct.UpdatedBy = ESEIM.AppContext.UserName;
                                        currentAct.UpdatedTime = DateTime.Now;
                                        wfInstance.MarkActCurrent = nextAct != null ? nextAct.ActivityInstCode : "";
                                        var runnings = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityInitial == currentAct.ActivityInstCode);
                                        var lstActInst = new List<ActivityInstance>();
                                        if (runnings.Any())
                                        {
                                            foreach (var item in runnings)
                                            {
                                                var lstCommand = new List<JsonCommand>();
                                                if (!string.IsNullOrEmpty(item.Command))
                                                {
                                                    lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(item.Command);
                                                }
                                                lstCommand[lstCommand.Count - 1].Approved = "APPROVE_COMMAND_Y";
                                                lstCommand[lstCommand.Count - 1].ApprovedBy = ESEIM.AppContext.UserName;
                                                lstCommand[lstCommand.Count - 1].ApprovedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy");

                                                item.Command = JsonConvert.SerializeObject(lstCommand);
                                                _context.WorkflowInstanceRunnings.Update(item);

                                                var actDes = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == item.ActivityDestination);
                                                if (actDes != null)
                                                {
                                                    //actDes.IsLock = false;
                                                    actDes.Status = EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.DoActInst);
                                                    actDes.StartTime = DateTime.Now;
                                                    _context.ActivityInstances.Update(actDes);
                                                    lstActInst.Add(actDes);
                                                }
                                            }
                                            var confirms = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityDestination == currentAct.ActivityInstCode);
                                            if (confirms.Any())
                                            {
                                                foreach (var item in confirms)
                                                {
                                                    var lstCommand = new List<JsonCommand>();

                                                    lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(item.Command);
                                                    lstCommand[lstCommand.Count - 1].Confirmed = "CONFIRM_COMMAND_Y";
                                                    lstCommand[lstCommand.Count - 1].ConfirmedBy = ESEIM.AppContext.UserName;
                                                    lstCommand[lstCommand.Count - 1].ConfirmedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy");

                                                    item.Command = JsonConvert.SerializeObject(lstCommand);
                                                    _context.WorkflowInstanceRunnings.Update(item);
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        if (currentAct.Type.Equals("TYPE_ACTIVITY_END"))
                                        {
                                            currentAct.Status = "STATUS_ACTIVITY_END";
                                            currentAct.UpdatedBy = ESEIM.AppContext.UserName;
                                            currentAct.UpdatedTime = DateTime.Now;

                                            wfInstance.EndTime = DateTime.Now;
                                            wfInstance.Status = "STATUS_WF_SUCCESS";
                                        }
                                    }
                                    _context.ActivityInstances.Update(currentAct);
                                    _context.WorkflowInstances.Update(wfInstance);
                                }
                                else if (status.Equals("INITIAL_WORKING") || status.Equals("REPEAT_WORKING") || status.Equals("FINAL_WORKING"))
                                {
                                    currentAct.Status = "STATUS_ACTIVITY_DO";
                                }
                                else if (status.Equals("REPEAT_REQUIRE_REWORK") || status.Equals("FINAL_REQUIRE_REWORK"))
                                {
                                    if (!string.IsNullOrEmpty(actRepeat))
                                    {
                                        var repeat = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(actRepeat));
                                        if (repeat != null)
                                        {
                                            repeat.Status = "STATUS_ACTIVITY_DO";
                                            wfInstance.MarkActCurrent = repeat.ActivityInstCode;
                                            _context.ActivityInstances.Update(repeat);
                                            _context.WorkflowInstances.Update(wfInstance);
                                        }
                                    }
                                }
                                _context.SaveChanges();
                            }
                        }
                    }
                }
            }
        }
        #endregion

        #region Command extra
        [HttpPost]
        public JsonResult InsertCommandExtra([FromBody] MessageActivity obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                obj.User = ESEIM.AppContext.UserName;
                obj.CommandTime = DateTime.Now;
                _context.MessageActivitys.Add(obj);
                //Unlock Activity instance
                var actNext = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted
                                && x.ActivityInstCode.Equals(obj.ActTo));
                if (actNext != null)
                {
                    if (actNext.Status.Equals("STATUS_ACTIVITY_NOT_DOING"))
                    {
                        actNext.StartTime = DateTime.Now;
                        actNext.Status = "STATUS_ACTIVITY_DOING";
                        _context.ActivityInstances.Update(actNext);
                    }
                }

                //Real-time
                UpdateChangeActInst(obj.ActFrom);

                //Log action user
                var common = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(obj.Command));
                if (common != null)
                {
                    var action = new ActInstanceUserActivity
                    {
                        CreatedTime = DateTime.Now,
                        UserId = ESEIM.AppContext.UserId,
                        ActInstCode = obj.ActFrom,
                        Action = "Đã thêm lệnh",
                        FromDevice = "Desktop/Laptop",
                        IdObject = "Command",
                        ChangeDetails = "[" + common.ValueSet + "]"
                    };
                    _context.ActInstanceUserActivitys.Add(action);
                }
                //End
                _context.SaveChanges();
                msg.Title = "Thêm lệnh thành công";

                var lstAssign = new List<CardMemberCustom>();
                var assign = _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst.Equals(obj.ActTo))
                        .Select(x => new CardMemberCustom
                        {
                            CreatedTime = "",
                            Id = x.ID,
                            Responsibility = "",
                            UserId = x.UserId
                        }).ToList();
                lstAssign.AddRange(assign);

                SendNotifyCommand(lstAssign, obj.ActTo, " đã được chạy lệnh bởi ");
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult GetCommandTo(string actInst)
        {
            var comm = _context.CommonSettings.Where(x => !x.IsDeleted);
            var data = from a in _context.MessageActivitys.Where(x => x.ActFrom.Equals(actInst))
                       join b in _context.ActivityInstances on a.ActTo equals b.ActivityInstCode
                       join c in _context.Users on a.User equals c.UserName
                       select new
                       {
                           Id = a.ID,
                           ActName = b.Title,
                           UserSend = _context.Users.FirstOrDefault(x => x.UserName.Equals(a.User)).GivenName ?? "",
                           UserConfirm = !string.IsNullOrEmpty(a.ConfirmedBy) ? _context.Users.FirstOrDefault(x => x.UserName.Equals(a.ConfirmedBy)).GivenName ?? "" : "",
                           Command = comm.FirstOrDefault(x => x.CodeSet.Equals(a.Command)).ValueSet ?? "",
                           Confirm = !string.IsNullOrEmpty(a.Confirm) ? comm.FirstOrDefault(x => x.CodeSet.Equals(a.Confirm)).ValueSet ?? "" : "",
                           CmdTime = a.CommandTime.ToString("HH:mm dd/MM/yyyy"),
                           ConfirmTime = a.ConfirmTime.HasValue ? a.ConfirmTime.Value.ToString("HH:mm dd/MM/yyyy") : "",
                           Note = a.Note
                       };
            return Json(data);
        }

        [HttpPost]
        public JsonResult GetCommandFrom(string actInst)
        {
            var comm = _context.CommonSettings.Where(x => !x.IsDeleted);
            var data = from a in _context.MessageActivitys.Where(x => x.ActTo.Equals(actInst))
                       join b in _context.ActivityInstances on a.ActFrom equals b.ActivityInstCode into b1
                       from b in b1.DefaultIfEmpty()
                       join c in _context.Users on a.User equals c.UserName
                       select new
                       {
                           Id = a.ID,
                           ActName = b != null ? b.Title : "Lệnh được gửi từ lãnh đạo",
                           UserSend = _context.Users.FirstOrDefault(x => x.UserName.Equals(a.User)).GivenName ?? "",
                           UserConfirm = !string.IsNullOrEmpty(a.ConfirmedBy) ? _context.Users.FirstOrDefault(x => x.UserName.Equals(a.ConfirmedBy)).GivenName ?? "" : "",
                           Command = comm.FirstOrDefault(x => x.CodeSet.Equals(a.Command)).ValueSet ?? "",
                           CommandSymbol = a.Command,
                           Confirm = !string.IsNullOrEmpty(a.Confirm) ? comm.FirstOrDefault(x => x.CodeSet.Equals(a.Confirm)).ValueSet ?? "" : "",
                           ConfirmCommand = !string.IsNullOrEmpty(a.Confirm) ? a.Confirm : "",
                           CmdTime = a.CommandTime.ToString("HH:mm dd/MM/yyyy"),
                           ConfirmTime = a.ConfirmTime.HasValue ? a.ConfirmTime.Value.ToString("HH:mm dd/MM/yyyy") : "",
                           Note = a.Note
                       };
            return Json(data);
        }

        [HttpPost]
        public JsonResult DeleteCommandExtra(int id)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.MessageActivitys.FirstOrDefault(x => x.ID == id);
                if (data != null)
                {
                    _context.MessageActivitys.Remove(data);

                    //Real-time
                    UpdateChangeActInst(data.ActFrom);

                    //Log action user
                    var common = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(data.Command));
                    if (common != null)
                    {
                        var action = new ActInstanceUserActivity
                        {
                            CreatedTime = DateTime.Now,
                            UserId = ESEIM.AppContext.UserId,
                            ActInstCode = data.ActFrom,
                            Action = "Đã xóa lệnh",
                            FromDevice = "Desktop/Laptop",
                            IdObject = "Command",
                            ChangeDetails = "[" + common.ValueSet + "]"
                        };
                        _context.ActInstanceUserActivitys.Add(action);
                    }
                    //End

                    _context.SaveChanges();
                    msg.Title = "Xóa lệnh thành công";
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy lệnh";
                }
            }
            catch (Exception ex)
            {
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Error = true;
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult ConfirmCommandExtra(int id, string confirm)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var command = _context.MessageActivitys.FirstOrDefault(x => x.ID == id);
                if (command != null)
                {
                    command.Confirm = confirm;
                    command.ConfirmedBy = ESEIM.AppContext.UserName;
                    command.ConfirmTime = DateTime.Now;
                    _context.MessageActivitys.Update(command);

                    //Real-time
                    UpdateChangeActInst(command.ActTo);

                    //Log action user
                    var common = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(confirm));
                    var commandCommon = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(command.Command));
                    if (common != null && commandCommon != null)
                    {
                        var action = new ActInstanceUserActivity
                        {
                            CreatedTime = DateTime.Now,
                            UserId = ESEIM.AppContext.UserId,
                            ActInstCode = command.ActTo,
                            Action = "Đã xác nhận",
                            FromDevice = "Desktop/Laptop",
                            IdObject = "Command",
                            ChangeDetails = "[" + common.ValueSet + "] lệnh [" + commandCommon.ValueSet + "]"
                        };
                        _context.ActInstanceUserActivitys.Add(action);
                    }

                    _context.SaveChanges();
                    msg.Title = "Xác nhận lệnh thành công";

                    var lstAssign = new List<CardMemberCustom>();
                    var assign = _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst.Equals(command.ActFrom))
                        .Select(x => new CardMemberCustom
                        {
                            CreatedTime = "",
                            Id = x.ID,
                            Responsibility = "",
                            UserId = x.UserId
                        }).ToList();
                    lstAssign.AddRange(assign);

                    SendNotifyCommand(lstAssign, command.ActFrom, " đã được xác nhận lệnh bởi ");
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy lệnh";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [NonAction]
        private void ConfirmYCommandNext(string actTo)
        {
            var running = _context.WorkflowInstanceRunnings.Where(x => x.ActivityInitial.Equals(actTo));
            foreach (var item in running)
            {
                if (!string.IsNullOrEmpty(item.ActivityDestination))
                {
                    var mess = new MessageActivity
                    {
                        User = ESEIM.AppContext.UserName,
                        ActFrom = actTo,
                        ActTo = item.ActivityDestination,
                        Command = "COMMAND_WF_INSTANCE_DO",
                        CommandTime = DateTime.Now,
                        Note = ""
                    };
                    _context.MessageActivitys.Add(mess);
                }
            }
        }
        #endregion

        #region Realtime activity instance
        [NonAction]
        private void UpdateChangeActInst(string actCode)
        {
            var actInst = _context.ActivityInstances.FirstOrDefault(x => x.ActivityInstCode.Equals(actCode) && !x.IsDeleted);
            if (actInst != null)
            {
                var lstSession = new List<ActSessionUser>();
                if (!string.IsNullOrEmpty(actInst.LockShare))
                {
                    lstSession = JsonConvert.DeserializeObject<List<ActSessionUser>>(actInst.LockShare);
                    var isExist = false;
                    foreach (var item in lstSession)
                    {
                        if (item.User == ESEIM.AppContext.UserName)
                        {
                            item.NewDataUpdate = false;
                            isExist = true;
                        }
                        else
                        {
                            item.NewDataUpdate = true;
                        }
                    }
                    if (!isExist)
                    {
                        var cardSession = new ActSessionUser
                        {
                            User = ESEIM.AppContext.UserName,
                            TimeStamp = DateTime.Now,
                            NewDataUpdate = false
                        };
                        lstSession.Add(cardSession);
                    }
                }
                else
                {
                    var cardSession = new ActSessionUser
                    {
                        User = ESEIM.AppContext.UserName,
                        TimeStamp = DateTime.Now,
                        NewDataUpdate = false
                    };
                    lstSession.Add(cardSession);
                }
                actInst.LockShare = JsonConvert.SerializeObject(lstSession);
                _context.ActivityInstances.Update(actInst);
            }
        }

        [HttpPost]
        public bool IsUpdateNewData(string actCode)
        {
            bool isUpdate = false;
            var card = _context.ActivityInstances.FirstOrDefault(x => x.ActivityInstCode.Equals(actCode) && !x.IsDeleted);
            if (card != null)
            {
                if (!string.IsNullOrEmpty(card.LockShare))
                {
                    var lst = JsonConvert.DeserializeObject<List<ActSessionUser>>(card.LockShare);
                    foreach (var item in lst)
                    {
                        if (item.User.Equals(ESEIM.AppContext.UserName))
                        {
                            isUpdate = item.NewDataUpdate;
                            if (isUpdate)
                            {
                                item.NewDataUpdate = false;
                                card.LockShare = JsonConvert.SerializeObject(lst);
                                _context.SaveChanges();
                            }
                            break;
                        }
                    }
                }
            }
            return isUpdate;
        }

        [HttpPost]
        public void AutoUpdateLockShareJson(string actCode)
        {
            var card = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(actCode));
            if (card != null)
            {
                var lstSession = new List<ActSessionUser>();
                if (!string.IsNullOrEmpty(card.LockShare))
                {
                    lstSession = JsonConvert.DeserializeObject<List<ActSessionUser>>(card.LockShare);
                    var isExist = false;
                    foreach (var item in lstSession)
                    {
                        if (item.User == ESEIM.AppContext.UserName)
                        {
                            item.NewDataUpdate = false;
                            isExist = true;
                        }
                    }
                    if (!isExist)
                    {
                        var cardSession = new ActSessionUser
                        {
                            User = ESEIM.AppContext.UserName,
                            TimeStamp = DateTime.Now,
                            NewDataUpdate = false
                        };
                        lstSession.Add(cardSession);
                    }
                }
                else
                {
                    var cardSession = new ActSessionUser
                    {
                        User = ESEIM.AppContext.UserName,
                        TimeStamp = DateTime.Now,
                        NewDataUpdate = false
                    };
                    lstSession.Add(cardSession);
                }
                card.LockShare = JsonConvert.SerializeObject(lstSession);
                _context.ActivityInstances.Update(card);
            }
            _context.SaveChanges();
        }

        public class ActSessionUser
        {
            public string User { get; set; }
            public bool NewDataUpdate { get; set; }
            public DateTime TimeStamp { get; set; }
        }

        #endregion End realtime activity instance

        #region Manager notification
        [NonAction]
        public JsonResult InsertNotification([FromBody] NotificationManager obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var check = _context.NotificationManagers.Any(x => !x.IsDeleted && x.ObjCode.Equals(obj.ObjCode) && x.ObjType.Equals(obj.ObjType));
                if (!check)
                {
                    obj.NotifyCode = string.Format("NOTIFI_{0}", DateTime.Now.ToString("ddMMyyyyHHmmss"));
                    obj.CreatedBy = User.Identity.Name;
                    obj.CreatedTime = DateTime.Now;
                    _context.NotificationManagers.Add(obj);
                    _context.SaveChanges();
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Thông báo đã tồn tại";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [NonAction]
        public JsonResult UpdateNotification([FromBody] NotificationManager obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var notifiManager = _context.NotificationManagers.FirstOrDefault(x => !x.IsDeleted && x.ObjCode.Equals(obj.ObjCode) && x.ObjType.Equals(obj.ObjType));
                if (notifiManager != null)
                {
                    var listDelete = notifiManager.ListUser.Where(x => !obj.ListUser.Any(p => p.UserId.Equals(x.UserId))).ToList();
                    var listInsert = obj.ListUser.Where(x => !notifiManager.ListUser.Any(p => p.UserId.Equals(x.UserId))).ToList();
                    if (listInsert.Count > 0)
                        notifiManager.ListUser.AddRange(listInsert);

                    foreach (var item in listDelete)
                    {
                        notifiManager.ListUser.Remove(item);
                    }

                    notifiManager.UpdatedBy = User.Identity.Name;
                    notifiManager.UpdatedTime = DateTime.Now;
                    _context.NotificationManagers.Update(notifiManager);
                    _context.SaveChanges();
                }
                else
                {
                    InsertNotification(obj);
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [NonAction]
        public JsonResult RemoveUserInNotify(string objCode, string objType, bool delete)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var notifiManager = _context.NotificationManagers.FirstOrDefault(x => !x.IsDeleted && x.ObjCode.Equals(objCode) && x.ObjType.Equals(objType));
                if (notifiManager != null)
                {
                    var listDelete = notifiManager.ListUser.Where(x => x.UserId.Equals(ESEIM.AppContext.UserId)).ToList();
                    foreach (var item in listDelete)
                    {
                        notifiManager.ListUser.Remove(item);
                    }

                    if (notifiManager.ListUser.Count == 0 || delete)
                    {
                        notifiManager.IsDeleted = true;
                        notifiManager.DeletedBy = User.Identity.Name;
                        notifiManager.DeletedTime = DateTime.Now;
                    }

                    notifiManager.UpdatedBy = User.Identity.Name;
                    notifiManager.UpdatedTime = DateTime.Now;
                    _context.NotificationManagers.Update(notifiManager);
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [NonAction]
        public bool GetIsReadNotification(string objCode, List<NotificationManager> managers)
        {
            var isRead = true;
            try
            {
                var notifiManager = managers.FirstOrDefault(x => x.ObjCode.Equals(objCode));
                if (notifiManager != null)
                {
                    if (notifiManager.ListUser.Any(p => p.UserId.Equals(ESEIM.AppContext.UserId)))
                        isRead = false;
                }
            }
            catch (Exception ex)
            {
            }
            return isRead;
        }
        #endregion

        #region Nested Workflow
        [HttpPost]
        public JsonResult GetNestedActCat(string actCode, string actInstCode)
        {
            var common = _context.CommonSettings.Where(x => !x.IsDeleted);
            var listInstNested = (from a in _context.SubWorkflowInstances.Where(x => !x.IsDeleted && x.ActInstInitial.Equals(actInstCode))
                                  join b in _context.WorkflowInstances.Where(x => !x.IsDeleted.Value) on a.WfInstCode equals b.WfInstCode
                                  join c in _context.WorkFlows.Where(x => !x.IsDeleted.Value) on b.WorkflowCode equals c.WfCode
                                  join d in common on b.Status equals d.CodeSet into d1
                                  from d in d1.DefaultIfEmpty()
                                  join e in common on b.WfGroup equals e.CodeSet into e1
                                  from e in e1.DefaultIfEmpty()
                                  select new ModelNested
                                  {
                                      WfCode = c.WfCode,
                                      WfName = c.WfName,
                                      WfGroup = d != null ? d.ValueSet : "",
                                      ObjectType = b.ObjectType,
                                      ObjectInst = b.ObjectInst,
                                      WfInstName = b.WfInstName,
                                      WfGroupCode = b.WfGroup,
                                      IsInit = true,
                                      WfInstStatus = d != null ? d.ValueSet : ""
                                  }).ToList();

            foreach (var item in listInstNested)
            {
                if (!string.IsNullOrEmpty(item.ObjectInst))
                {
                    item.ObjectInst = GetObjectRelative(item.ObjectInst, item.ObjectType);
                }
            }

            var listNested = new List<NestedWF>();
            var actCat = _context.Activitys.FirstOrDefault(x => !x.IsDeleted && x.ActivityCode.Equals(actCode));
            if (actCat != null)
            {
                if (!string.IsNullOrEmpty(actCat.NestedWF))
                {
                    listNested = JsonConvert.DeserializeObject<List<NestedWF>>(actCat.NestedWF);
                }
            }
            var query = (from a in listNested
                         join b in _context.WorkFlows.Where(x => !x.IsDeleted.Value) on a.WfCode equals b.WfCode
                         join c in _context.CommonSettings.Where(x => !x.IsDeleted) on b.WfGroup equals c.CodeSet into c1
                         from c in c1.DefaultIfEmpty()
                         select new ModelNested
                         {
                             WfCode = a.WfCode,
                             WfName = b.WfName,
                             WfGroup = c != null ? c.ValueSet : "",
                             ObjectType = "",
                             ObjectInst = "",
                             WfInstName = "",
                             WfGroupCode = a.WfGroup,
                             IsInit = false
                         }).ToList();
            return Json(listInstNested.Concat(query));
        }
        public class ModelNested
        {
            public string WfCode { get; set; }
            public string WfName { get; set; }
            public string WfGroup { get; set; }
            public string ObjectType { get; set; }
            public string ObjectInst { get; set; }
            public string WfInstName { get; set; }
            public string WfGroupCode { get; set; }
            public bool IsInit { get; set; }
            public string WfInstStatus { get; set; }
        }
        public class NestedWF
        {
            public string WfCode { get; set; }
            public string WfGroup { get; set; }
        }

        public class WfRelative
        {
            public string WfInstCode { get; set; }
        }
        #endregion

        #region Update Workflow instance
        [AllowAnonymous]
        [HttpPost]
        public JsonResult UpdateWfInstance([FromBody] ModelWfInstance obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var wf = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.WfInstCode.Equals(obj.WfInstCode));
                if (wf != null)
                {
                    wf.WfInstName = obj.WfInstName;
                    wf.WfGroup = obj.WfGroup;
                    wf.Status = obj.Status;
                    _context.WorkflowInstances.Update(wf);
                    _context.SaveChanges();
                    msg.Title = "Cập nhật thành công";
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Luồng không tồn tại";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        public class ModelWfInstance
        {
            public string WfInstCode { get; set; }
            public string WfInstName { get; set; }
            public string Status { get; set; }
            public string WfGroup { get; set; }
        }
        #endregion

        #region Step Workflow
        [HttpPost]
        public JsonResult GetActivityArranged(string wfCode)
        {
            var activities = (_context.Activitys.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(wfCode))
                .Select(x => new ActGrid
                {
                    ActivityInstCode = x.ActivityCode,
                    ActName = x.Title,
                    ActStatus = x.Status,
                    ActType = x.Type,
                    Id = x.ID,
                    IsLock = false,
                    Level = 0,
                    IsInstance = false
                })).ToList();

            var actInit = activities.FirstOrDefault(x => x.ActType.Equals(EnumHelper<TypeActivity>.GetDisplayValue(TypeActivity.Initial)));

            var actArranged = ArrangeActCat(activities, 1, actInit).GroupBy(x => x.Level);

            return Json(actArranged);
        }
        [HttpGet]
        public JsonResult GetActivityInsGrid(string wfCode)
        {
            var activities = (from x in _context.ActivityInstances.Where(a => !a.IsDeleted && a.WorkflowCode.Equals(wfCode))
                              join y in _context.CommonSettings.Where(a => a.IsDeleted == false) on x.Status equals y.CodeSet
                              join Acti in _context.Activitys.Where(a => a.IsDeleted == false) on x.ActivityCode equals Acti.ActivityCode
                              select new ActGrid
                                {
                                    ActivityInstCode = x.ActivityInstCode,
                                    ActName = x.Title,
                                    ActStatus = y.ValueSet,
                                    ActType = x.Type,
                                    Id = x.ID,
                                    IsLock = (x.Status.Equals("STATUS_ACTIVITY_NOT_DOING") || x.Status.Equals("STATUS_ACTIVITY_LOCK")) ? true : false,
                                    Level = Acti.Level.Value,
                                    IsInstance = false
                                }).ToList().OrderBy(x=>x.Level);

            return Json(activities);
        }
        [HttpPost]
        public object GetActInstArranged(string objInst, string objType)
        {
            var wfInstance = _context.WorkflowInstances
                .FirstOrDefault(x => !x.IsDeleted.Value && x.ObjectInst.Equals(objInst)
                    && x.ObjectType.Equals(objType));

            var wfInstCode = "";
            if (wfInstance != null)
            {
                wfInstCode = wfInstance.WfInstCode;
            }
            var activities = (from a in _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(wfInstCode))
                              join c in _context.WorkflowInstances.Where(x => !x.IsDeleted.Value) on a.WorkflowCode equals c.WfInstCode
                              join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                              from b in b1.DefaultIfEmpty()
                              select new ActGrid
                              {
                                  ActivityInstCode = a.ActivityInstCode,
                                  ActName = a.Title,
                                  ActStatus = b != null ? b.ValueSet : "",
                                  ActType = a.Type,
                                  Id = a.ID,
                                  IsLock = (a.Status.Equals("STATUS_ACTIVITY_NOT_DOING") || a.Status.Equals("STATUS_ACTIVITY_LOCK")) ? true : false,
                                  Level = 0,
                                  IsInstance = true,
                                  ObjectCode = c.ObjectInst
                              }).ToList();
            foreach (var item in activities)
            {
                item.IsApprovable = GetPermission(item.ActivityInstCode).PermisstionApprove;
            }
            var actInit = activities.FirstOrDefault(x => x.ActType.Equals(EnumHelper<TypeActivity>.GetDisplayValue(TypeActivity.Initial)));

            var actArranged = ArrangeActInst(activities, 1, actInit, new List<ActInstInfo>());

            var listActInstRela = (from a in actArranged
                                   join b in _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.UserId.Equals(ESEIM.AppContext.UserId))
                                     on a.ActivityInstCode equals b.ActivityCodeInst
                                   select a).DistinctBy(x => x.ActivityInstCode);
            return new
            {
                ActArranged = actArranged.GroupBy(x => x.Level),
                ActRela = listActInstRela
            };
        }

        [HttpPost]
        public JsonResult GetActInstArrangedRelaCurrentUser(int id, string objType)
        {
            var session = HttpContext.GetSessionUser();
            var wfInstance = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value
                                                                          && x.Id.Equals(id)
                                                                          && x.ObjectType.Equals(objType));
            var wfInstCode = "";
            if (wfInstance != null)
            {
                wfInstCode = wfInstance.WfInstCode;
            }
            var activities = (from a in _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(wfInstCode))
                              join d in _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted) on a.ActivityInstCode equals d.ActivityCodeInst into d1
                              from d in d1.DefaultIfEmpty()
                              join c in _context.WorkflowInstances.Where(x => !x.IsDeleted.Value) on a.WorkflowCode equals c.WfInstCode
                              join b in _context.CommonSettings.Where(x => !x.IsDeleted) on a.Status equals b.CodeSet into b1
                              from b in b1.DefaultIfEmpty()
                              where session.IsAllData || c.CreatedBy.Equals(session.UserName) || d.UserId.Equals(ESEIM.AppContext.UserId)
                              select new ActGrid
                              {
                                  ActivityInstCode = a.ActivityInstCode,
                                  ActName = a.Title,
                                  ActStatus = b != null ? b.ValueSet : "",
                                  ActType = a.Type,
                                  Id = a.ID,
                                  //IsLock = a.IsLock,
                                  Level = 0,
                                  IsInstance = true,
                                  ObjectCode = c.ObjectInst
                              }).ToList();

            var actInit = activities.FirstOrDefault(x => x.ActType.Equals(EnumHelper<TypeActivity>.GetDisplayValue(TypeActivity.Initial)));

            var actArranged = ArrangeActInst(activities, 1, actInit, new List<ActInstInfo>()).GroupBy(x => x.Level);

            return Json(actArranged);
        }

        [NonAction]
        private List<ActGrid> ArrangeActCat(List<ActGrid> listInst, int level, ActGrid instInitial)
        {
            try
            {
                if (instInitial != null)
                {
                    instInitial.Level = level;
                    var runnings = _context.WorkflowSettings.Where(x => !x.IsDeleted && x.ActivityInitial.Equals(instInitial.ActivityInstCode));
                    foreach (var item in runnings)
                    {
                        var actRunning = listInst.FirstOrDefault(x => x.ActivityInstCode.Equals(item.ActivityDestination));
                        if (actRunning != null)
                        {
                            actRunning.Level = instInitial.Level + 1;
                            listInst = ArrangeActCat(listInst, actRunning.Level, actRunning);
                        }
                    }
                }
            }
            catch (Exception ex)
            {

            }

            return listInst.OrderBy(x => x.Level).ToList();
        }

        [NonAction]
        private List<ActGrid> ArrangeActInst(List<ActGrid> listInst, int level,
                ActGrid instInitial, List<ActInstInfo> listActInfo)
        {
            try
            {
                if (instInitial != null)
                {
                    instInitial.Level = level;
                    var runnings = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityInitial.Equals(instInitial.ActivityInstCode));
                    foreach (var item in runnings)
                    {
                        var actRunning = listInst.FirstOrDefault(x => x.ActivityInstCode.Equals(item.ActivityDestination));
                        if (actRunning != null)
                        {
                            if (!listActInfo.Any(x => x.ActInstCode.Equals(actRunning.ActivityInstCode)))
                            {
                                actRunning.Level = instInitial.Level + 1;

                                var info = new ActInstInfo
                                {
                                    ActInstCode = actRunning.ActivityInstCode
                                };

                                listActInfo.Add(info);
                                listInst = ArrangeActInst(listInst, actRunning.Level, actRunning, listActInfo);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {

            }

            return listInst.OrderBy(x => x.Level).ToList();
        }
        #endregion

        #region Update Attr Data
        [HttpGet]
        public JsonResult GetGroupAttrOfWf(string wfCode, string actCode)
        {
            var wfInst = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value
                        && x.WfInstCode.Equals(wfCode));

            var listAttr = new List<DataAtt>();
            if (wfInst != null && !string.IsNullOrEmpty(wfInst.DataAttr))
            {
                listAttr = JsonConvert.DeserializeObject<List<DataAtt>>(wfInst.DataAttr);
                listAttr = listAttr.Where(p => !string.IsNullOrEmpty(p.ActCode) && p.ActCode.Equals(actCode)).ToList();
            }
            listAttr = FilterByObjType(listAttr, wfInst.ObjectType);
            var acts = _context.ActivityInstances.Where(x => !x.IsDeleted
                        && x.WorkflowCode.Equals(wfInst.WfInstCode)).ToList();

            var groupSession = _context.ActivityAttrDatas
                .Where(x => !x.IsDeleted && acts.Any(k => k.ActivityInstCode.Equals(x.ActCode)))
                .GroupBy(x => x.SessionId)
                .Select(p => new SessionLogger
                {
                    SessionId = p.Key,
                    Color = "",
                    Index = 0
                }).ToList();
            var attrData = _context.ActivityAttrDatas.Where(x => !x.IsDeleted);
            var attrSetUp = _context.AttrSetups.Where(x => !x.IsDeleted);

            var groups = (from a in _context.CommonSettings.Where(x => !x.IsDeleted)
                          join b in listAttr on a.CodeSet equals b.AttrGroup
                          select new GroupAttrWF
                          {
                              Code = a.CodeSet,
                              Name = a.ValueSet,
                              Count = 0,
                              ListAttr = (from c in b.DataAttrWf
                                          join d in _context.CommonSettings.Where(x => !x.IsDeleted) on c.AttrUnit equals d.CodeSet
                                          into d1
                                          from d in d1.DefaultIfEmpty()
                                          let user = _context.Users.FirstOrDefault(x => x.Active && x.UserName.Equals(User.Identity.Name))
                                          select new ListAttr
                                          {
                                              AttrUnit = c.AttrUnit,
                                              AttrGroup = c.AttrGroup,
                                              AttrCode = c.AttrCode,
                                              AttrDataType = c.AttrDataType,
                                              Value = c.Value,
                                              SessionId = c.SessionId,
                                              AttrNote = c.AttrNote,
                                              AttrName = c.AttrName,
                                              UnitName = d != null ? d.ValueSet : "",
                                              CreatedBy = user != null ? user.GivenName : "",
                                              CreatedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy"),
                                          }).ToList()
                          }).ToList();
            foreach (var item in groups)
            {
                item.Count = GetCountAttr(acts, item.Code, attrData, attrSetUp, groupSession);
            }

            return Json(groups);
        }
        [NonAction]
        private List<DataAtt> FilterByObjType(List<DataAtt> listAttribute, string objectType)
        {
            if (objectType == EnumHelper<StaffStatus>.GetDisplayValue(StaffStatus.GoLate))
            {
                var result = listAttribute.Where(x => x.AttrGroup == "CARD_DATA_LOGGER20220111094752"); // Go Late Attr Group
                return result.ToList();
            }
            else if (objectType == EnumHelper<StaffStatus>.GetDisplayValue(StaffStatus.NoWork))
            {
                var result = listAttribute.Where(x => x.AttrGroup == "CARD_DATA_LOGGER20210413114510"); // No Work Attr Group
                return result.ToList();
            }
            else if (objectType == EnumHelper<StaffStatus>.GetDisplayValue(StaffStatus.QuitWork))
            {
                var result = listAttribute.Where(x => x.AttrGroup == "CARD_DATA_LOGGER20220111102933"); // Quit Work Attr Group
                return result.ToList();
            }
            else if (objectType == EnumHelper<StaffStatus>.GetDisplayValue(StaffStatus.PlanSchedule))
            {
                var result = listAttribute.Where(x => x.AttrGroup == "CARD_DATA_LOGGER20220111101440" || x.AttrGroup == "CARD_DATA_LOGGER20230322201959"); // Plan Schedule Attr Group
                return result.ToList();
            }
            else if (objectType == EnumHelper<StaffStatus>.GetDisplayValue(StaffStatus.Overtime))
            {
                var result = listAttribute.Where(x => x.AttrGroup == "CARD_DATA_LOGGER20220111102436"); // Overtime Attr Group
                return result.ToList();
            }
            else
            {
                return listAttribute;
            }
        }

        [NonAction]
        public int GetCountAttr(List<ActivityInstance> acts, string groupCode,
            IQueryable<ActivityAttrData> attrData, IQueryable<AttrSetup> attrSetUp,
            List<SessionLogger> groupSession)
        {
            var data = (from a in attrData.Where(x => acts.Any(k => k.ActivityInstCode.Equals(x.ActCode))
                            && x.CreatedTime.Value.Date == DateTime.Now.Date)
                        join e in attrSetUp.Where(x => x.AttrGroup.Equals(groupCode)) on a.AttrCode equals e.AttrCode
                        join d in groupSession on a.SessionId equals d.SessionId
                        orderby d.Index
                        select new DataLoggerCardModel
                        {
                            SessionId = a.SessionId,
                        }).GroupBy(x => x.SessionId);
            return data.Count();
        }

        public class GroupAttrWF
        {
            public GroupAttrWF()
            {
                ListAttr = new List<ListAttr>();
            }
            public string Code { get; set; }
            public string Name { get; set; }
            public int Count { get; set; }
            public List<ListAttr> ListAttr { get; set; }
        }
        public class ListAttr
        {
            public string AttrUnit { get; set; }
            public string AttrGroup { get; set; }
            public string AttrCode { get; set; }
            public string AttrDataType { get; set; }
            public string Value { get; set; }
            public string SessionId { get; set; }
            public string AttrNote { get; set; }
            public string AttrName { get; set; }
            public string UnitName { get; set; }
            public string CreatedBy { get; set; }
            public string CreatedTime { get; set; }
        }
        #endregion

        #region Blink
        [HttpGet]
        public object Blink(string actCode)
        {
            var blinkCmdFrom = false;
            var blinkCmdTo = false;
            var blinkStatus = false;

            var running = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted);
            var instActs = _context.ActivityInstances.Where(x => !x.IsDeleted);
            var comm = _context.CommonSettings.Where(x => !x.IsDeleted);
            var messActs = _context.MessageActivitys;
            var users = _context.Users;

            var commandFromExtra = from a in messActs.Where(x => x.ActTo.Equals(actCode))
                                   join b in instActs on a.ActFrom equals b.ActivityInstCode into b1
                                   from b in b1.DefaultIfEmpty()
                                   join c in users on a.User equals c.UserName
                                   select new
                                   {
                                       Id = a.ID,
                                       Confirm = !string.IsNullOrEmpty(a.Confirm) ? comm.FirstOrDefault(x => x.CodeSet.Equals(a.Confirm)).ValueSet ?? "" : "",
                                   };

            foreach (var item in commandFromExtra)
            {
                if (string.IsNullOrEmpty(item.Confirm))
                {
                    blinkCmdFrom = true;
                    break;
                }
            }
            if (!blinkCmdFrom)
            {
                var actFrom = (from a in running.Where(x => x.ActivityDestination.Equals(actCode))
                               join b in instActs on a.ActivityInitial equals b.ActivityInstCode
                               let command = JsonConvert.DeserializeObject<List<JsonCommand>>(a.Command)
                               select new BlickCommandFrom
                               {
                                   Command = command.LastOrDefault(),
                                   ListCommand = command
                               }).ToList();

                foreach (var item in actFrom)
                {
                    if (item.ListCommand.Count > 1)
                    {
                        if (string.IsNullOrEmpty(item.Command.Confirmed))
                        {
                            blinkCmdFrom = true;
                            break;
                        }
                    }
                }
            }

            var act = instActs.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(actCode));
            if (act != null)
            {
                if (act.Status.Equals("STATUS_ACTIVITY_END"))
                {
                    var actTo = (from a in running.Where(x => x.ActivityInitial.Equals(actCode))
                                 join b in instActs on a.ActivityDestination equals b.ActivityInstCode
                                 let command = JsonConvert.DeserializeObject<List<JsonCommand>>(a.Command)
                                 select new ModelCommand
                                 {
                                     Command = command.LastOrDefault()
                                 }).ToList();

                    foreach (var item in actTo)
                    {
                        if (item.Command.Id == 0)
                        {
                            blinkCmdTo = true;
                            break;
                        }
                    }

                    if (blinkCmdTo)
                    {
                        var commandToExtra = from a in messActs.Where(x => x.ActFrom.Equals(actCode))
                                             join b in instActs on a.ActTo equals b.ActivityInstCode
                                             join c in users on a.User equals c.UserName
                                             select new
                                             {
                                                 Id = a.ID,
                                             };
                        if (commandToExtra.Count() == 0)
                        {
                            blinkCmdTo = true;
                        }
                        else
                        {
                            blinkCmdTo = false;
                        }
                    }
                }
                else
                {
                    if (!blinkCmdFrom)
                    {
                        blinkStatus = true;
                    }
                }
            }

            return new
            {
                CmdFrom = blinkCmdFrom,
                CmdTo = blinkCmdTo,
                Status = blinkStatus
            };
        }

        public class BlickCommandFrom
        {
            public JsonCommand Command { get; set; }
            public List<JsonCommand> ListCommand { get; set; }
        }
        #endregion

        #region Detail Object WF
        [HttpGet]
        public int RedirectToObject(string objectType, string objectCode)
        {
            int id = 0;
            switch (objectType)
            {
                case "CONTRACT":
                    var contract = _context.PoSaleHeaders.FirstOrDefault(x => !x.IsDeleted && x.ContractCode.Equals(objectCode));
                    id = contract != null ? contract.ContractHeaderID : 0;
                    break;

                case "PROJECT":
                    var project = _context.Projects.FirstOrDefault(x => !x.FlagDeleted && x.ProjectCode.Equals(objectCode));
                    id = project != null ? project.Id : 0;
                    break;

                case "CONTRACT_PO":
                    var contractPO = _context.PoBuyerHeaders.FirstOrDefault(x => !x.IsDeleted && x.PoSupCode.Equals(objectCode));
                    id = contractPO != null ? contractPO.Id : 0;
                    break;

                case "SUPPLIER":
                    var supp = _context.Suppliers.FirstOrDefault(x => !x.IsDeleted && x.SupCode.Equals(objectCode));
                    id = supp != null ? supp.SupID : 0;
                    break;

                case "PRODUCT":
                    break;

                case "IMPORT_STORE":
                    var impStore = _context.ProdReceivedHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objectCode));
                    id = impStore != null ? impStore.Id : 0;
                    break;

                case "PAY_DECISION":
                    break;

                case "EXPORT_STORE":
                    var expStore = _context.ProdDeliveryHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objectCode));
                    id = expStore != null ? expStore.Id : 0;
                    break;

                case "ASSET_MAINTENANCE":
                    var assetMaintenance = _context.AssetMaintenanceHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objectCode));
                    id = assetMaintenance != null ? assetMaintenance.TicketID : 0;
                    break;

                case "ASSET_BUY":
                    var assetBuy = _context.AssetBuyHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objectCode));
                    id = assetBuy != null ? assetBuy.ID : 0;
                    break;

                case "RQ_IMPORT_PROD":
                    var rqImport = _context.RequestImpProductHeaders.FirstOrDefault(x => !x.IsDeleted && x.ReqCode.Equals(objectCode));
                    id = rqImport != null ? rqImport.Id : 0;
                    break;

                case "DECISION_MOVEMENT":
                    break;

                case "DECISION_END_CONTRACT":
                    break;

                case "PLAN_RECRUITMENT":
                    break;

                case "FUND_ACC_ENTRY":
                    var fundAccEntry = _context.FundAccEntrys.FirstOrDefault(x => !x.IsDeleted && x.AetCode.Equals(objectCode));
                    id = fundAccEntry != null ? fundAccEntry.Id : 0;
                    break;

                case "ASSET_INVENTORY":
                    var assetInventory = _context.AssetInventoryHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objectCode));
                    id = assetInventory != null ? assetInventory.AssetID : 0;
                    break;

                case "ASSET_ALLOCATE":
                    var assetAllocation = _context.AssetAllocateHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objectCode));
                    id = assetAllocation != null ? assetAllocation.ID : 0;
                    break;

                case "ASSET_TRANSFER":
                    var assetTransfer = _context.AssetTransferHeaders.FirstOrDefault(x => !x.IsDeleted && x.Ticketcode.Equals(objectCode));
                    id = assetTransfer != null ? assetTransfer.AssetID : 0;
                    break;

                case "ASSET_LIQUIDATION":
                    var assetLiquidation = _context.AssetLiquidationHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objectCode));
                    id = assetLiquidation != null ? assetLiquidation.ID : 0;
                    break;

                case "ASSET_RECALL":
                    var assetRecalled = _context.AssetRecalledHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objectCode));
                    id = assetRecalled != null ? assetRecalled.ID : 0;
                    break;

                case "ASSET_RQ_REPAIR":
                    var assetRqMaintenanceRepair = _context.AssetRqMaintenanceRepairHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objectCode));
                    id = assetRqMaintenanceRepair != null ? assetRqMaintenanceRepair.ID : 0;
                    break;

                case "ASSET_IMPROVE":
                    var assetImprovement = _context.AssetImprovementHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objectCode));
                    id = assetImprovement != null ? assetImprovement.TicketID : 0;
                    break;

                case "ASSET_CANCEL":
                    var assetCancel = _context.AssetCancelHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objectCode));
                    id = assetCancel != null ? assetCancel.AssetID : 0;
                    break;

                case "ASSET_RPT":
                    var assetRPTBroken = _context.AssetRPTBrokenHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objectCode));
                    id = assetRPTBroken != null ? assetRPTBroken.AssetID : 0;
                    break;
            }
            return id;
        }
        #endregion

        #region Check lock Status
        [HttpGet]
        public bool CheckLockStatus(string actCode)
        {
            var check = false;

            var actInst = _context.ActivityInstances
                            .FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(actCode));
            if (actInst.Type.Equals("TYPE_ACTIVITY_INITIAL"))
            {
                check = true;
                return check;
            }

            var commandFromExtra = from a in _context.MessageActivitys.Where(x => x.ActTo.Equals(actCode))
                                   join b in _context.ActivityInstances.Where(x => !x.IsDeleted) on a.ActFrom equals b.ActivityInstCode into b1
                                   from b in b1.DefaultIfEmpty()
                                   join c in _context.Users on a.User equals c.UserName
                                   select new
                                   {
                                       Id = a.ID,
                                       Confirm = !string.IsNullOrEmpty(a.Confirm) ? _context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals(a.Confirm) && !x.IsDeleted).ValueSet ?? "" : "",
                                   };

            if (commandFromExtra.Count() > 0)
            {
                check = true;
            }
            if (!check)
            {
                var actFrom = (from a in _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted &&
                                x.ActivityDestination.Equals(actCode))
                               join b in _context.ActivityInstances.Where(x => !x.IsDeleted) on a.ActivityInitial equals b.ActivityInstCode
                               let command = JsonConvert.DeserializeObject<List<JsonCommand>>(a.Command)
                               select new
                               {
                                   Command = command,

                               }).ToList();
                foreach (var cmd in actFrom)
                {
                    if (cmd.Command.Count() > 1)
                    {
                        check = true;
                        break;
                    }
                }
            }
            return check;
        }
        #endregion

        #region Suggest WF for object
        [HttpPost]
        public string SuggestWF(string type)
        {
            var wfInst = (from a in _context.WorkflowInstances
                            .Where(x => !x.IsDeleted.Value && x.ObjectType.Equals(type))
                          join b in _context.WorkFlows.Where(x => !x.IsDeleted.Value) on a.WorkflowCode equals b.WfCode
                          select new
                          {
                              a.Id,
                              b.WfCode
                          }).OrderByDescending(x => x.Id).FirstOrDefault();
            return wfInst != null ? wfInst.WfCode : "";
        }
        #endregion
    }

    public class ListFile
    {
        public int Id { get; set; }
        public string FileCode { get; set; }
        public string FileName { get; set; }
        public string FileTypePhysic { get; set; }
        public string Desc { get; set; }
        public DateTime CreatedTime { get; set; }
        public string CloudFileId { get; set; }
        public string ReposName { get; set; }
        public int FileID { get; set; }
        public decimal SizeOfFile { get; set; }
        public string Type { get; set; }
        public bool SignatureRequire { get; set; }
        public string Url { get; set; }
        public bool IsSign { get; set; }
        public string SignatureJson { get; set; }
        public string ListUserShare { get; set; }
    }
}