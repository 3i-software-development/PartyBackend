using ESEIM.Models;
using ESEIM.Utils;
using FTU.Utils.HelperNet;
using III.Admin.Controllers;
using Lucene.Net.Search;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json.Linq;
using SmartBreadcrumbs.Attributes;
using Syncfusion.EJ2.Linq;
using System;
using System.Globalization;
using System.Linq;
using ESEIM.Models;
using Microsoft.AspNetCore.Authorization;
using static III.Admin.Controllers.MobileProductController;
using III.Domain.Enums;
using III.Domain.Common;
using System.Collections.Generic;
using Xfinium.Pdf.Forms;
using Microsoft.AspNetCore.Http;
using static III.Admin.Controllers.MobileLoginController;
using Syncfusion.EJ2.Spreadsheet;
using DocumentFormat.OpenXml.InkML;
using OpenXmlPowerTools;
using DocumentFormat.OpenXml.Bibliography;
using System.Text;
using static Dropbox.Api.Files.SearchMatchType;
using PdfSharp.Charting;
using Microsoft.EntityFrameworkCore;
using DocumentFormat.OpenXml.VariantTypes;
using log4net;
using System.Reflection;
using System.Data;
using static III.Admin.Controllers.WorkflowActivityController;
using Syncfusion.DocIO.DLS;
using System.IO;
using Microsoft.SqlServer.Management.Smo;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Hosting;
using Amazon.SimpleNotificationService.Util;
using static III.Admin.Controllers.UserProfileController;

namespace III.Admin.Controllers
{
    [Area("Admin")]
    public class UserJoinPartyController : BaseController
    {
        private readonly EIMDBContext _context;
        private readonly IUploadService _upload;
        private readonly ILuceneService _luceneService;
        private readonly IRepositoryService _repositoryService;
        private readonly IStringLocalizer<SharedResources> _sharedResources;
        private static readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod()?.DeclaringType);
        private readonly IHostingEnvironment _hostingEnvironment;

        public UserJoinPartyController(EIMDBContext context, IStringLocalizer<SharedResources> sharedResources, IUploadService upload, ILuceneService luceneService, IRepositoryService repositoryService, IHostingEnvironment hostingEnvironment)
        {
            _context = context;
            _sharedResources = sharedResources;
            _upload = upload;
            _luceneService = luceneService;
            _repositoryService = repositoryService;
            _hostingEnvironment = hostingEnvironment;
        }

        [Breadcrumb("ViewData.UserJoinParty", AreaName = "Admin", FromAction = "Index", FromController = typeof(DashBoardController))]
        public IActionResult Index()
        {
            ViewData["CrumbDashBoard"] = _sharedResources["COM_CRUMB_DASH_BOARD"];
            ViewData["UserJoinParty"] = "Hồ sơ lý lịch đảng viên";
            return View();
        }
        public class converJsonPartyAdmission{
            public ModelViewPAMP Profile { get; set; }
            public PersonalHistory[] PersonalHistories { get; set; }
            public TrainingCertificatedPass[] TrainingCertificatedPasses { get; set; }
            public WarningDisciplined[] WarningDisciplineds { get; set; }
            public Award[] Awards { get; set; }
            public Family[] Families { get; set; }
            public GoAboard[] GoAboards { get; set; }
            public HistorySpecialist[] HistorySpecialist { get; set; }
            public IntroducerOfParty IntroducerOfParty { get; set; }
            public WorkingTracking[] WorkingTracking { get; set; }
        }
        [HttpPost]
        public JMessage UpdateOrCreateUserfileJson([FromBody] converJsonPartyAdmission jsonData)
        {
            var rs = new JMessage { Error = false, };
            try
            {
                string folderPath = "/uploads/json/";
                string fileName = "UserProfile_" + DateTime.Now.ToString("ddMMyyyyHHmmss") + ".json";
                string filePath = folderPath + fileName;

                // Kiểm tra xem thư mục chứa file có tồn tại không
                if (!Directory.Exists(_hostingEnvironment.WebRootPath + folderPath))
                {
                    // Nếu không tồn tại, tạo thư mục mới
                    Directory.CreateDirectory(_hostingEnvironment.WebRootPath + folderPath);
                }

                string content = JsonConvert.SerializeObject(jsonData);
                System.IO.File.WriteAllText(_hostingEnvironment.WebRootPath + filePath,content );
                rs.Title = filePath;
            }
            catch (Exception ex)
            {
                rs.Error = true;
                rs.Title = "Không thể tạo file";
            }
            return rs;
        }

        public class ItemNoteJson
        {
            public string id { get; set; }
            public string comment { get; set; }
        }

        [HttpPost]
        public JMessage UpdateOrCreateJson([FromBody] ItemNoteJson jsonData, string ResumeNumber)
        {
            var rs = new JMessage { Error = false, };
            try
            {
                string folderPath = "/uploads/json/";
                string fileName = "reviewprofile_" + ResumeNumber + ".json";
                string filePath = _hostingEnvironment.WebRootPath + folderPath + fileName;

                // Kiểm tra xem thư mục chứa file có tồn tại không
                if (!Directory.Exists(_hostingEnvironment.WebRootPath + folderPath))
                {
                    // Nếu không tồn tại, tạo thư mục mới
                    Directory.CreateDirectory(_hostingEnvironment.WebRootPath + folderPath);
                }
                if (System.IO.File.Exists(filePath))
                {
                    // Đọc dữ liệu từ file JSON
                    string existingData = System.IO.File.ReadAllText(filePath);

                    // Chuyển đổi dữ liệu JSON từ file thành đối tượng C#
                    List<ItemNoteJson> existingObject = JsonConvert.DeserializeObject<List<ItemNoteJson>>(existingData);

                    var Object = existingObject.FirstOrDefault(x => x.id == jsonData.id);
                    if (Object == null)
                    {
                        existingObject.Add(jsonData);
                    }
                    else
                    {
                        existingObject.ForEach(x =>
                        {
                            if (x.id == jsonData.id)
                            {
                                x.comment = jsonData.comment;
                            }
                        });
                        Object = jsonData;
                    }

                    // Chuyển đối tượng đã cập nhật thành JSON
                    string updatedJsonData = JsonConvert.SerializeObject(existingObject);

                    // Ghi lại vào file JSON
                    System.IO.File.WriteAllText(filePath, updatedJsonData);

                    rs.Title = "Cập nhật thành công";
                    return rs;
                }
                else
                {
                    List<ItemNoteJson> existingObject = new List<ItemNoteJson> { };
                    existingObject.Add(jsonData);
                    string updatedJsonData = JsonConvert.SerializeObject(existingObject);
                    // Tạo mới file JSON nếu không tồn tại
                    System.IO.File.WriteAllText(filePath, updatedJsonData);

                    rs.Title = "Thêm file thành công";
                    return rs;
                }
            }
            catch (Exception ex)
            {
                rs.Error = true;
                rs.Title = "Không thể tạo file";
            }
            return rs;
        }
        public class JTableModelFile : JTableModel
        {
            public string FromDate { get; set; }
            public string ToDate { get; set; }
            public string Name { get; set; }
            public string Username { get; set; }
            public string Status { get; set; }
            public string Nation { get; set; }
            public string Religion { get; set; }
            public string ItDegree { get; set; }
            public string Job { get; set; }
            public string ForeignLanguage { get; set; }
            public string UnderPostGraduateEducation { get; set; }
            public string MinorityLanguages { get; set; }
            public int? Gender { get; set; }
            public string KeyWord { get; set; }
            public int? FromAge { get; set; }
            public int? ToAge { get; set; }
            public string HomeTown { get; set; }
            public string JobEducation { get; set; }
            public string Degree { get; set; }
            public string PoliticalTheory { get; set; }
            public string GeneralEducation { get; set; }
        }

        [HttpPost]
        public object JTable2([FromBody] JTableModelFile jTablePara)
        {
            try
            {
                List<string> fileCodes = new List<string>();
                if (!string.IsNullOrEmpty(jTablePara.KeyWord))
                {
                    string[] keywords = { "PROFILE_JOIN_PARTY" };
                    var session = HttpContext.GetSessionUser();
                    JtableFileModel jTable = new JtableFileModel()
                    {
                        Content = jTablePara.KeyWord,
                        ListRepository = keywords,
                        ObjectType = "All",
                        Length = jTablePara.Length,
                    };
                    var listType = new string[] { };
                    listType = new[] { ".docx", ".doc" };
                    var actintCodes = JtableWithContent(jTable, null, null, session, listType, 0);
                    fileCodes = actintCodes.Split(';').ToList();
                }
                List<string> codes = new List<string>();
                if (fileCodes.Count > 0)
                {
                    codes = _context.EDMSRepoCatFiles.Where(x => fileCodes.Contains(x.FileCode)).Select(x => x.ObjectCode).ToList();
                }
                int intBegin = (jTablePara.CurrentPage - 1) * jTablePara.Length;
                var fromDate = !string.IsNullOrEmpty(jTablePara.FromDate) ? DateTime.ParseExact(jTablePara.FromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
                var toDate = !string.IsNullOrEmpty(jTablePara.ToDate) ? DateTime.ParseExact(jTablePara.ToDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
                var getYear = DateTime.Now.Year;
                var query = (from a in _context.PartyAdmissionProfiles.Where(x => x.IsDeleted == false)
                             join b in _context.Users on a.CreatedBy equals b.UserName into b1
                             from b in b1.DefaultIfEmpty()
                             join wf in _context.WorkflowInstances.Where(x => x.IsDeleted == false && x.ObjectType == "TEST_JOIN_PARTY")
                                .Select(wfa => new
                                {
                                    actCode = _context.ActivityInstances.Where(x => x.IsDeleted == false && wfa.WfInstCode == x.WorkflowCode).Select(a => a.ActivityInstCode).ToList(),
                                    wfa.WfInstCode,
                                    wfa.ObjectInst,
                                })
                                on a.ResumeNumber equals wf.ObjectInst into wf1
                             from wf in wf1.DefaultIfEmpty()

                             where (fromDate == null || (fromDate <= a.Birthday))
                                    && (toDate == null || (toDate >= a.Birthday))
                                    && (jTablePara.FromAge == null || (jTablePara.FromAge <= (getYear - a.Birthday.Value.Year)))
                                    && (jTablePara.ToAge == null || (jTablePara.ToAge >= (getYear - a.Birthday.Value.Year)))
                                    && (string.IsNullOrEmpty(jTablePara.Name) || a.CurrentName.ToLower().Contains(jTablePara.Name.ToLower()))
                                    && (string.IsNullOrEmpty(jTablePara.Status) || a.Status == jTablePara.Status)
                                    && (string.IsNullOrEmpty(jTablePara.Username) || a.Username.ToLower().Contains(jTablePara.Username.ToLower()) || a.ResumeNumber.ToLower().Contains(jTablePara.Username.ToLower()))

                                    && (string.IsNullOrEmpty(jTablePara.Nation) || a.Nation.ToLower().Contains(jTablePara.Nation.ToLower()))

                                    && (string.IsNullOrEmpty(jTablePara.Religion) || a.Religion.ToLower().Contains(jTablePara.Religion.ToLower()))
                                    && (string.IsNullOrEmpty(jTablePara.ItDegree) || a.ItDegree.ToLower().Contains(jTablePara.ItDegree.ToLower()))
                                    && (string.IsNullOrEmpty(jTablePara.Job) || a.Job.ToLower().Contains(jTablePara.Job.ToLower()))
                                    && (string.IsNullOrEmpty(jTablePara.ForeignLanguage) || a.ForeignLanguage.ToLower().Contains(jTablePara.ForeignLanguage.ToLower()))
                                    && (string.IsNullOrEmpty(jTablePara.UnderPostGraduateEducation) || a.UnderPostGraduateEducation.ToLower().Contains(jTablePara.UnderPostGraduateEducation.ToLower()))
                                    && (string.IsNullOrEmpty(jTablePara.MinorityLanguages) || a.MinorityLanguages.ToLower().Contains(jTablePara.MinorityLanguages.ToLower()))
                                    && (string.IsNullOrEmpty(jTablePara.HomeTown) || a.HomeTown.ToLower().Contains(jTablePara.HomeTown.ToLower()))
                                    && (string.IsNullOrEmpty(jTablePara.JobEducation) || a.JobEducation.ToLower().Contains(jTablePara.JobEducation.ToLower()))
                                    && (string.IsNullOrEmpty(jTablePara.Degree) || a.Degree.ToLower().Contains(jTablePara.Degree.ToLower()))
                                    && (string.IsNullOrEmpty(jTablePara.PoliticalTheory) || a.PoliticalTheory.ToLower().Contains(jTablePara.PoliticalTheory.ToLower()))
                                    && (string.IsNullOrEmpty(jTablePara.GeneralEducation) || a.GeneralEducation.ToLower().Contains(jTablePara.GeneralEducation.ToLower()))
                                    && (jTablePara.Gender == null || a.Gender == jTablePara.Gender)
                                    && (string.IsNullOrEmpty(jTablePara.KeyWord) || codes.Count != 0 && wf != null && wf.actCode.Intersect(codes).Any())
                             // Thêm điều kiện sắp xếp giảm dần theo Id
                             select new ModelUserJoinPartyTable
                             {
                                 Id = a.Id,
                                 CurrentName = a.CurrentName,
                                 UserCode = a.UserCode,
                                 Status = a.Status,
                                 Username = a.Username,
                                 CreatedBy = b != null ? b.GivenName : "",
                                 ProfileLink = a.ProfileLink,
                                 resumeNumber = a.ResumeNumber,
                                 WfInstCode = wf != null ? wf.WfInstCode : "",
                                 BirthYear = a.Birthday.HasValue ? a.Birthday.Value.Year.ToString() : "",
                                 TemporaryAddress = a.TemporaryAddress,
                                 UnderPostGraduateEducation = a.UnderPostGraduateEducation,
                                 Degree = a.Degree,
                                 GeneralEducation = a.GeneralEducation,
                                 Gender = a.Gender
                             })
                             .OrderByDescending(x => x.Id); // Sắp xếp giảm dần theo Id

                int total = _context.PartyAdmissionProfiles.Count();
                var query_row_number = query.AsEnumerable().Select((x, index) => new
                {
                    stt = index + 1,
                    x.Id,
                    x.CurrentName,
                    x.UserCode,
                    x.Status,
                    x.Username,
                    x.CreatedBy,
                    x.ProfileLink,
                    x.resumeNumber,
                    x.WfInstCode,
                    x.UnderPostGraduateEducation,
                    x.Degree,
                    x.GeneralEducation,
                    x.TemporaryAddress,
                    x.BirthYear,
                    x.Gender
                }).ToList();
                int count = query_row_number.Count();
                var data = query_row_number.AsQueryable().OrderBy(x => x.stt).Skip(intBegin).Take(jTablePara.Length);

                var jdata = JTableHelper.JObjectTable(Enumerable.ToList(data), jTablePara.Draw, count, "stt", "Id", "CurrentName", "UserCode", "Status", "Username",
                    "CreatedBy", "ProfileLink", "resumeNumber", "WfInstCode", "UnderPostGraduateEducation", "Degree", "GeneralEducation", "TemporaryAddress", "BirthYear", "Gender");
                return Json(jdata);
            }
            catch (Exception err)
            {
                var jdata = JTableHelper.JObjectTable(null, jTablePara.Draw, 0, "stt", "Id", "CurrentName", "UserCode", "Status", "Username", "CreatedBy",
                    "ProfileLink", "resumeNumber", "WfInstCode", "UnderPostGraduateEducation", "Degree", "GeneralEducation", "TemporaryAddress", "BirthYear", "Gender");
                return Json(jdata);
            }
        }


        #region search


        [NonAction]
        private string JtableWithContent(JtableFileModel jTablePara, DateTime? fromDate, DateTime? toDate, SessionUserLogin session, string[] listType, int intBeginFor)
        {
            var queryLucene = SearchLuceneFile(jTablePara.Content, intBeginFor, jTablePara.Length);
            Console.WriteLine(queryLucene);
            Console.WriteLine(queryLucene.listLucene);
            var fileCodeSequence = string.Join(";", queryLucene.listLucene.Select(x => x.FileCode));
            //var listTypeSequence = string.Join(";", listType.Select(x => x));

            //Log.Info($"countQueryLucene: ${queryLucene.listLucene.Count()}");
            //Log.Info(fileCodeSequence);
            //string[] param = { "@PageNo", "@PageSize", "@fromDate", "@toDate", "@Name", "@Tags",
            //    "@ObjectType", "@ObjectCode", "@UserUpload", "@FileCodeSequence", "@ListTypeSequence"};
            //object[] val = { jTablePara.CurrentPage, jTablePara.Length,
            //    fromDate != null ? (object)fromDate : "", toDate != null ? (object)toDate : "",
            //    !string.IsNullOrEmpty(jTablePara.Name) ? jTablePara.Name : "",
            //    !string.IsNullOrEmpty(jTablePara.Tags) ? jTablePara.Tags : "",
            //    !string.IsNullOrEmpty(jTablePara.ObjectType) ? jTablePara.ObjectType : "",
            //    !string.IsNullOrEmpty(jTablePara.ObjectCode) ? jTablePara.ObjectCode : "",
            //    !string.IsNullOrEmpty(jTablePara.UserUpload) ? jTablePara.UserUpload : "",
            //    fileCodeSequence, listTypeSequence};
            //// the code that you want to measure comes here
            //DataTable rs = _repositoryService.GetDataTableProcedureSql("P_GET_FILE_EDMS_LUCENE", param, val);
            //var queryDataLucene = CommonUtil.ConvertDataTable<EDMSJtableFileModel>(rs);
            //var capacity = decimal.Parse(queryDataLucene.FirstOrDefault()?.TotalCapacity ?? "0");
            ////var paggingLucene = queryDataLucene.Skip(intBeginFor).Take(jTablePara.Length).ToList();

            //var listRecordsPack = _context.RecordsPacks.Where(x => !x.IsDeleted).ToList();
            //foreach (var item in queryDataLucene)
            //{
            //    item.FileSize = capacity;
            //    item.Content = queryLucene.listLucene.FirstOrDefault(x => x.FileCode == item.FileCode)?.Content;
            //    if (item.IsScan.HasValue && item.IsScan.Value)
            //    {
            //        item.PackHierarchy =
            //                    !string.IsNullOrEmpty(item.PackCode) ? GetHierarchyPack(listRecordsPack, item.PackCode, "") : "Chưa đóng gói";
            //        item.ZoneHierarchy = !string.IsNullOrEmpty(item.PackZoneLocation) ? item.PackZoneLocation : "Chưa xếp";
            //    }
            //}

            return fileCodeSequence;
        }

        [NonAction]
        private (IEnumerable<EDMSJtableFileModel> listLucene, int total) SearchLuceneFile(string content, int page, int length)
        {
            try
            {
                var moduleObj = (EDMSCatRepoSetting)_upload.GetPathByModule("DB_LUCENE_INDEX").Object;
                var luceneCategory = _context.EDMSCategorys.FirstOrDefault(x => x.CatCode == moduleObj.CatCode);


                //LuceneExtension.SearchHighligh(content, luceneCategory.PathServerPhysic, page, length, "Content");
                return LuceneExtension.SearchHighligh(content, luceneCategory.PathServerPhysic, page, length, "Content");

            }
            catch (Exception ex)
            {
                return (new List<EDMSJtableFileModel>(), 0);
            }
        }

        [NonAction]
        private string GetHierarchyPack(List<RecordsPack> recordsPacks, string packCode, string hierarchy)
        {
            var obj = recordsPacks.FirstOrDefault(x => !x.IsDeleted && x.PackCode.Equals(packCode));
            if (obj != null)
            {
                if (!string.IsNullOrEmpty(obj.PackParent))
                {
                    hierarchy = obj.PackCode + (!string.IsNullOrEmpty(hierarchy) ? ("/" + hierarchy) : "");
                    var packParent = recordsPacks.FirstOrDefault(x => !x.IsDeleted && x.PackCode.Equals(obj.PackParent));
                    if (packParent != null)
                    {
                        hierarchy = packParent.PackCode + "/" + hierarchy;
                        if (!string.IsNullOrEmpty(packParent.PackParent))
                        {
                            var record = recordsPacks.FirstOrDefault(x => !x.IsDeleted && x.PackCode.Equals(packParent.PackParent));
                            hierarchy = GetHierarchyPack(recordsPacks, packParent.PackParent, hierarchy);
                        }
                    }
                }
                else
                {
                    hierarchy = obj.PackCode + (!string.IsNullOrEmpty(hierarchy) ? ("/" + hierarchy) : "");
                }
            }
            else
            {
                return "";
            }

            return hierarchy;
        }

        //public List<ResumeNumber> SearchPersonalHistory(string keyword, IQueryable<ModelUserJoinPartyTable> list)
        //{
        //   var papList = list.Select(p => p.resumeNumber).ToList();

        //    var phList = _context.PersonalHistories
        //        .Where(ph => !ph.IsDeleted)
        //        .ToList();

        //    var aList = _context.Awards
        //        .Where(a => !a.IsDeleted)
        //        .ToList();

        //    var fList = _context.Families
        //        .Where(f => !f.IsDeleted)
        //        .ToList();

        //    var iopList = _context.IntroducerOfParties
        //        .Where(iop => !iop.IsDeleted)
        //        .ToList();

        //    var hsList = _context.HistorySpecialists
        //        .Where(hs => !hs.IsDeleted)
        //        .ToList();

        //    var tcList = _context.TrainingCertificatedPasses
        //        .Where(tc => !tc.IsDeleted)
        //        .ToList();

        //    var wdList = _context.WarningDisciplineds
        //        .Where(wd => !wd.IsDeleted)
        //        .ToList();

        //    var wtList = _context.WorkingTrackings
        //        .Where(wt => !wt.IsDeleted)
        //        .ToList();

        //    var gaList = _context.GoAboards
        //        .Where(ga => !ga.IsDeleted)
        //        .ToList();

        //    var query = from pap in list
        //                select new
        //                {
        //                    pap,
        //                    ph = phList.FirstOrDefault(ph => ph.ProfileCode == pap.resumeNumber),
        //                    a = aList.FirstOrDefault(a => a.ProfileCode == pap.resumeNumber),
        //                    f = fList.FirstOrDefault(f => f.ProfileCode == pap.resumeNumber),
        //                    iop = iopList.FirstOrDefault(iop => iop.ProfileCode == pap.resumeNumber),
        //                    hs = hsList.FirstOrDefault(hs => hs.ProfileCode == pap.resumeNumber),
        //                    tc = tcList.FirstOrDefault(tc => tc.ProfileCode == pap.resumeNumber),
        //                    wd = wdList.FirstOrDefault(wd => wd.ProfileCode == pap.resumeNumber),
        //                    wt = wtList.FirstOrDefault(wt => wt.ProfileCode == pap.resumeNumber),
        //                    ga = gaList.FirstOrDefault(ga => ga.ProfileCode == pap.resumeNumber)
        //                };


        //    var result = query.AsEnumerable()
        //        .Where(item => item.GetType().GetProperties()
        //            .Any(prop => prop.PropertyType.GetInterface(nameof(IEnumerable)) != null && prop.GetValue(item) != null &&
        //                (prop.GetValue(item) as IEnumerable)?.OfType<object>().Any(listItem =>
        //                    listItem.GetType().GetProperties().Any(subProp =>
        //                        subProp.PropertyType == typeof(string) &&
        //                        subProp.GetValue(listItem) != null &&
        //                        subProp.GetValue(listItem).ToString().Contains(keyword)
        //                    )
        //                ) == true
        //            )
        //        )
        //        .Select(item => new ResumeNumber
        //        {
        //            ResumeNumberstring = item.pap.resumeNumber
        //        }).ToList();

        //    return result;
        //}


        #endregion

        [HttpPost]
        [AllowAnonymous]
        public object InsertPersonalHistory([FromBody] PersonalHistory model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                if (!string.IsNullOrEmpty(model.Content) || model.Begin != null || model.End != null)
                {
                    var data = _context.PartyAdmissionProfiles.FirstOrDefault(a => a.ResumeNumber == model.ProfileCode);
                    if (data == null)
                    {
                        msg.Error = true;
                        msg.Title = "Mã hồ sơ không tồn tại";
                        return msg;
                    }
                    var obj = new PersonalHistory();
                    obj.Begin = model.Begin;
                    obj.End = model.End;
                    obj.Content = model.Content;
                    obj.ProfileCode = model.ProfileCode;
                    _context.PersonalHistories.Add(obj);
                    _context.SaveChanges();
                    msg.Title = "Thêm mới Lịch sử bản thân thành công";
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Lịch sử bản thân chưa hợp lệ";
                }

            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Thêm Lịch sử bản thân thất bại";
            }
            return msg;
        }
        [HttpPost]
        [AllowAnonymous]
        public object UpdatePersonalHistory([FromBody] PersonalHistory model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                if (!string.IsNullOrEmpty(model.Content) || model.Begin != null || model.End != null)
                {

                    var data = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.ResumeNumber == model.ProfileCode);
                    if (data == null)
                    {
                        msg.Error = true;
                        msg.Title = "Mã hồ sơ không tồn tại";
                        return msg;
                    }
                    var a = _context.PersonalHistories.Find(model.Id);
                    if (a != null)
                    {
                        a.Begin = model.Begin;
                        a.End = model.End;
                        a.Content = model.Content;
                        a.IsDeleted = false;
                        _context.PersonalHistories.Update(a);
                        _context.SaveChanges();
                        msg.Title = "Thêm mới Lịch sử bản thân thành công";
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Lịch sử bản thân chưa hợp lệ";
                        return msg;
                    }
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Lịch sử bản thân chưa hợp lệ";
                }

            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Thêm Lịch sử bản thân thất bại";
            }
            return msg;
        }

        [HttpPost]
        public object InsertAwardOnly([FromBody] Award x)
        {
            var msg = new JMessage() { Error = false };

            try
            {
                var check = _context.PartyAdmissionProfiles.FirstOrDefault(y => y.ResumeNumber == x.ProfileCode && y.IsDeleted == false);
                if(check != null || x.ProfileCode==null)
                {
                    msg.Error = true;
                    msg.Title = "Mã hồ sơ không tồn tại";
                    return msg;
                }

                if (!string.IsNullOrEmpty(x.MonthYear) || x.Reason != null || x.GrantOfDecision != null)
                {
                    if (x.Id == 0)
                    {
                        _context.Awards.Add(x);
                    }
                    else
                    {
                        var a = _context.Awards.Find(x.Id);
                        if (a != null)
                        {
                            a.MonthYear = x.MonthYear;
                            a.Reason = x.Reason;
                            a.GrantOfDecision = x.GrantOfDecision;
                            a.IsDeleted = false;
                            _context.Awards.Update(a);
                        }
                        else
                        {
                            msg.Error = true;
                            msg.Title = "Khen thưởng chưa hợp lệ";
                            return msg;
                        }
                    }


                }
                _context.SaveChanges();
                msg.Title = "Thêm mới Khen thưởng thành công";

            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Thêm mới Khen thưởng thất bại";
            }
            return msg;
        }
        #region Import

       

        #endregion
    }

    public class ModelUserJoinPartyTable
    {
        public int Id { get; set; }
        public string CurrentName { get; set; }
        public int UserCode { get; set; }
        public string Status { get; set; }
        public string Username { get; set; }
        public string CreatedBy { get; set; }
        public string ProfileLink { get; set; }
        public string resumeNumber { get; set; }
        public string WfInstCode { get; set; }
        public string BirthYear { get; set; }
        public string TemporaryAddress { get; set; }
        public string UnderPostGraduateEducation { get; set; }
        public string Degree { get; set; }
        public string GeneralEducation { get; set; }
        public int Gender { get; set; }
    }

    public class ResumeNumber
    {
        public string ResumeNumberstring { get; set; }
    }
}
