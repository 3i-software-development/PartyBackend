﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Caching.Memory;
using System.IO;
using Syncfusion.EJ2.PdfViewer;
using Newtonsoft.Json;
using System.Drawing;
//using SautinSoft;
using Syncfusion.EJ2.Spreadsheet;
using Syncfusion.XlsIO;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Cors;
using ESEIM.Models;
using ESEIM.Utils;
using ESEIM;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using SmartBreadcrumbs.Attributes;
using Microsoft.Extensions.Localization;
using FTU.Utils.HelperNet;
using III.Domain.Enums;
using System.Net;
using Newtonsoft.Json.Linq;
using System.Data;

namespace III.Admin.Controllers
{
    [Area("Admin")]
    public class TiktokSocialConfigController : BaseController
    {
        private readonly EIMDBContext _context;
        private readonly IUploadService _upload;
        private readonly IStringLocalizer<ExamHomeController> _stringLocalizer;
        private readonly IStringLocalizer<CrawlerMenuController> _stringLocalizerCRAW;
        private readonly IStringLocalizer<QuoraSocialConfigController> _stringLocalizerQsc;
        private readonly IStringLocalizer<SharedResources> _sharedResources;
        private readonly IStringLocalizer<LmsDashBoardController> _stringLocalizerLms;
        private readonly IStringLocalizer<LmsSubjectManagementController> _stringLocalizerLmsSM;
        private readonly IHostingEnvironment _hostingEnvironment;
        public readonly string module_name = "COMMENT";
        public string path_upload_file = "";
        public string repos_code = "";
        public string cat_code = "";
        public int host_type = 1;
        public TiktokSocialConfigController(EIMDBContext context, IStringLocalizer<ExamHomeController> stringLocalizer,
            IStringLocalizer<LmsDashBoardController> stringLocalizerLms,
            IStringLocalizer<QuoraSocialConfigController> stringLocalizerQsc,
        IStringLocalizer<CrawlerMenuController> stringLocalizerCRAW,
            IStringLocalizer<LmsSubjectManagementController> stringLocalizerLmsSM,
            IHostingEnvironment hostingEnvironment, IUploadService upload,
            IStringLocalizer<SharedResources> sharedResources)
        {
            _context = context;
            _stringLocalizer = stringLocalizer;
            _stringLocalizerLms = stringLocalizerLms;
            _stringLocalizerCRAW = stringLocalizerCRAW;
            _stringLocalizerQsc = stringLocalizerQsc;
            _stringLocalizerLmsSM = stringLocalizerLmsSM;
            _sharedResources = sharedResources;
            _hostingEnvironment = hostingEnvironment;
            _upload = upload;
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

        [Breadcrumb("ViewData.CrumbTiktokSocialConfig", AreaName = "Admin", FromAction = "Index", FromController = typeof(LmsDashBoardController))]
        public IActionResult Index()
        {
            ViewData["CrumbDashBoard"] = _sharedResources["COM_CRUMB_DASH_BOARD"];
            ViewData["CrumbMenuCenter"] = _sharedResources["COM_CRUMB_MENU_CENTER"];
            ViewData["CrumbLMSDashBoard"] = _sharedResources["COM_CRUMB_LMS_DASH_BOARD"];
            ViewData["CrumbTiktokSocialConfig"] = _sharedResources["COM_BOT_TIKTOK_CONFIG"];
            return View();
        }
        public class getbotsocial
        {
            public int Id { get; set; }
            public string BotSocialName { get; set; }
        }
        [HttpPost]
        public List<getbotsocial> GetBotSocial(string bottype)
        {
            string[] param = new string[] { "@Botsocialtype" };
            object[] val = new object[] { bottype };
            DataTable rs = RepositoryService.GetDataTableProcedureSql("[P_GET_BOT_SOCIAL]", param, val);
            var query = CommonUtil.ConvertDataTable<getbotsocial>(rs);
            return query;
        }
        public class getcondition
        {
            public string ConditionStatement { get; set; }
        }
        [HttpPost]
        public List<getcondition> GetCondition(int id)
        {
            string[] param = new string[] { "@Id" };
            object[] val = new object[] { id };
            DataTable rs = RepositoryService.GetDataTableProcedureSql("[P_GET_CONDITION_STATEMENT]", param, val);
            var query = CommonUtil.ConvertDataTable<getcondition>(rs);
            return query;
        }
        #region Language
        [HttpGet]
        public IActionResult Translation(string lang)
        {
            var resourceObject = new JObject();
            var query = _stringLocalizer.GetAllStrings().Select(x => new { x.Name, x.Value })
                .Union(_sharedResources.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_stringLocalizerQsc.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_stringLocalizerLms.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_stringLocalizerCRAW.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_stringLocalizerLmsSM.GetAllStrings().Select(x => new { x.Name, x.Value }));
            foreach (var item in query)
            {
                resourceObject.Add(item.Name, item.Value);
            }
            return Ok(resourceObject);
        }
        #endregion
    }
}
