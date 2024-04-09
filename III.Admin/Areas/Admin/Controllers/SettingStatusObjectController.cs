using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using ESEIM.Models;
using ESEIM.Utils;
using FTU.Utils.HelperNet;
using III.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using QRCoder;
using SmartBreadcrumbs.Attributes;

namespace III.Admin.Controllers
{
    [Area("Admin")]
    public class SettingStatusObjectController : BaseController
    {
        private readonly EIMDBContext _context;
        private readonly IUploadService _upload;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IStringLocalizer<SettingStatusObjectController> _stringLocalizer;
        private readonly IStringLocalizer<SharedResources> _sharedResources;

        public SettingStatusObjectController(EIMDBContext context, IUploadService upload, IHostingEnvironment hostingEnvironment,
            IStringLocalizer<SharedResources> sharedResources, IStringLocalizer<SettingStatusObjectController> stringLocalizer)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
            _upload = upload;
            _sharedResources = sharedResources;
            _stringLocalizer = stringLocalizer;
        }
        [Breadcrumb("ViewData.CrumbStatusSet", AreaName = "Admin", FromAction = "Index",
            FromController = typeof(SysTemSettingHomeController))]
        [AdminAuthorize]
        public IActionResult Index()
        {
            ViewData["CrumbDashBoard"] = _sharedResources["COM_CRUMB_DASH_BOARD"];
            ViewData["CrumbMenuSystemSett"] = _sharedResources["COM_CRUMB_SYSTEM"];
            ViewData["CrumbSystemSettHome"] = _sharedResources["COM_CRUMB_SYSTEM_SETTING"];
            ViewData["CrumbStatusSet"] = "Thiết lập trạng thái";
            return View();
        }

        #region Setting status
        [HttpGet]
        public JsonResult GetGroupStatus()
        {
            var data = _context.StatusGroups.Where(x => !x.IsDeleted)
                .Select(x => new { Code = x.GroupCode, Name = x.GroupName });
            return Json(data);
        }

        [AllowAnonymous]
        [HttpGet]
        public JsonResult GetStatus()
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals("STATUS_ACTIVITY"))
                .Select(x => new
                {
                    Code = x.CodeSet,
                    Name = x.ValueSet,
                    IsCheck = false,
                    Priority = x.Priority
                });
            return Json(data);
        }

        [HttpPost]
        public JsonResult InsertGroupStatus([FromBody] StatusGroup obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var check = _context.StatusGroups.FirstOrDefault(x => !x.IsDeleted
                            && x.GroupCode.Equals(obj.GroupCode));
                if (check != null)
                {
                    msg.Error = true;
                    msg.Title = "Mã bộ dữ liệu trạng thái đã tồn tại";
                    return Json(msg);
                }
                obj.CreatedBy = ESEIM.AppContext.UserName;
                obj.CreatedTime = DateTime.Now;
                _context.StatusGroups.Add(obj);
                _context.SaveChanges();
                msg.Title = "Thêm bộ dữ liệu trạng thái thành công";
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpGet]
        public JsonResult GetStatusInGroup(string groupCode)
        {
            var data = _context.CommonSettings
                .Where(x => !x.IsDeleted && x.Group.Equals("STATUS_ACTIVITY"))
                .Select(x => new ModelStatus { Code = x.CodeSet, Name = x.ValueSet, IsCheck = false })
                .ToList();
            var statusGroup = _context.StatusGroups.FirstOrDefault(x => !x.IsDeleted
                                && x.GroupCode.Equals(groupCode));
            if (statusGroup != null)
            {
                if (!string.IsNullOrEmpty(statusGroup.StatusCode))
                {
                    var listStatusOfGroup = JsonConvert.DeserializeObject<List<ModelStatus>>(statusGroup.StatusCode);
                    foreach (var item in data)
                    {
                        if (listStatusOfGroup.Any(x => x.Code.Equals(item.Code)))
                            item.IsCheck = true;
                    }
                }
            }
            return Json(data);
        }

        [HttpPost]
        public JsonResult UpdateStatusCode([FromBody] ModelUpdateStatus obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var group = _context.StatusGroups.FirstOrDefault(x => !x.IsDeleted
                        && x.GroupCode.Equals(obj.GroupCode));
                if (group != null)
                {
                    var listStatus = new List<ModelStatus>();
                    if (!string.IsNullOrEmpty(group.StatusCode))
                    {
                        listStatus = JsonConvert.DeserializeObject<List<ModelStatus>>(group.StatusCode);
                    }

                    if (obj.Status.IsCheck)
                    {
                        listStatus.Add(obj.Status);
                    }
                    else
                    {
                        foreach (var item in listStatus)
                        {
                            if (item.Code.Equals(obj.Status.Code))
                            {
                                listStatus.Remove(item);
                                break;
                            }
                        }
                    }
                    group.StatusCode = JsonConvert.SerializeObject(listStatus.OrderBy(x => x.Priority));

                    _context.StatusGroups.Update(group);
                    _context.SaveChanges();
                    msg.Title = "Cập nhật thành công";
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Vui lòng chọn bộ dữ liệu trạng thái";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        public class ModelStatus
        {
            public string Code { get; set; }
            public string Name { get; set; }
            public bool IsCheck { get; set; }
            public int Priority { get; set; }
        }

        public class ModelUpdateStatus
        {
            public string GroupCode { get; set; }
            public ModelStatus Status { get; set; }
        }
        #endregion

        #region Setting status to object type
        [HttpPost]
        public JsonResult SettingStatusObjectType([FromBody] ObjectTypeStatusGroup obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var check = _context.ObjectTypeStatusGroups.FirstOrDefault(x => x.ObjectTypeCode.Equals(obj.ObjectTypeCode));
                if (check != null)
                {
                    msg.Error = true;
                    msg.Title = "Loại đối tượng đã thiết lập bộ dữ liệu trạng thái";
                    return Json(msg);
                }
                var setting = new ObjectTypeStatusGroup
                {
                    ObjectTypeCode = obj.ObjectTypeCode,
                    StatusGroupCode = obj.StatusGroupCode
                };
                _context.ObjectTypeStatusGroups.Add(setting);
                _context.SaveChanges();
                msg.Title = "Thiết lập bộ dữ liệu trạng thái thành công";
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpGet]
        public JsonResult GetSettingStatusObject()
        {
            var objTypeStatusGroup = _context.ObjectTypeStatusGroups;
            var statusGroup = _context.StatusGroups.Where(x => !x.IsDeleted);

            var query = from a in objTypeStatusGroup
                        join b in _context.JcObjectTypes.Where(x => !x.IsDeleted) on a.ObjectTypeCode equals b.ObjTypeCode
                        join c in statusGroup on a.StatusGroupCode equals c.GroupCode
                        let listStatus = JsonConvert.DeserializeObject<List<ModelStatus>>(c.StatusCode)
                        select new SettingStatusObjType
                        {
                            ID = a.ID,
                            ObjectName = b.ObjTypeName,
                            GroupName = c.GroupName,
                            ListStatus = string.Join(", ", listStatus.Select(x => x.Name))
                        };

            var wfCats = from a in objTypeStatusGroup
                         join b in _context.WorkFlows.Where(x => !x.IsDeleted.Value) on a.ObjectTypeCode equals b.WfCode
                         join c in statusGroup on a.StatusGroupCode equals c.GroupCode
                         let listStatus = JsonConvert.DeserializeObject<List<ModelStatus>>(c.StatusCode)
                         select new SettingStatusObjType
                         {
                             ID = a.ID,
                             ObjectName = b.WfName,
                             GroupName = c.GroupName,
                             ListStatus = string.Join(", ", listStatus.Select(x => x.Name))
                         };

            var acts = from a in objTypeStatusGroup
                       join b in _context.Activitys.Where(x => !x.IsDeleted) on a.ObjectTypeCode equals b.ActivityCode
                       join c in statusGroup on a.StatusGroupCode equals c.GroupCode
                       let listStatus = JsonConvert.DeserializeObject<List<ModelStatus>>(c.StatusCode)
                       select new SettingStatusObjType
                       {
                           ID = a.ID,
                           ObjectName = b.Title,
                           GroupName = c.GroupName,
                           ListStatus = string.Join(", ", listStatus.Select(x => x.Name))
                       };

            return Json(query.Concat(wfCats.Concat(acts)));
        }

        public JsonResult GetObjType()
        {
            var data = _context.JcObjectTypes.Where(x => !x.IsDeleted).Select(x =>
                new ObjectTypePrefix { Code = x.ObjTypeCode, Name = x.ObjTypeName, Prefix = "" });

            var wfCats = _context.WorkFlows.Where(x => !x.IsDeleted.Value)
                .Select(x => new ObjectTypePrefix { Code = x.WfCode, Name = x.WfName, Prefix = "WF" });

            var acts = _context.Activitys.Where(x => !x.IsDeleted)
                .Select(x => new ObjectTypePrefix { Code = x.ActivityCode, Name = x.Title, Prefix = "ACT" });
            return Json(data.Concat(wfCats.Concat(acts)));
        }

        public class ObjectTypePrefix
        {
            public string Code { get; set; }
            public string Name { get; set; }
            public string Prefix { get; set; }
        }
        public class SettingStatusObjType
        {
            public int ID { get; set; }
            public string ObjectName { get; set; }
            public string GroupName { get; set; }
            public string ListStatus { get; set; }
        }
        #endregion

        #region Language
        [HttpGet]
        public IActionResult Translation(string lang)
        {
            var resourceObject = new JObject();
            var query = (_sharedResources.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_stringLocalizer.GetAllStrings().Select(x => new { x.Name, x.Value }));
            foreach (var item in query)
            {
                resourceObject.Add(item.Name, item.Value);
            }
            return Ok(resourceObject);
        }
        #endregion
    }
}