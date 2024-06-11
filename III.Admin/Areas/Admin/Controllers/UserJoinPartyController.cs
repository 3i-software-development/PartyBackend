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
using Microsoft.AspNetCore.Rewrite.Internal.UrlActions;
using III.Admin.Utils;
using Syncfusion.EJ2.Charts;
using System.ComponentModel.DataAnnotations;

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
        public class converJsonPartyAdmission
        {
            public ModelViewPAMP Profile { get; set; }
            public List<PersonalHistory> PersonalHistories { get; set; }
            public List<TrainingCertificatedPass> TrainingCertificatedPasses { get; set; }
            public List<WarningDisciplined> WarningDisciplineds { get; set; }
            public List<Award> Awards { get; set; }
            public List<Family> Families { get; set; }
            public List<GoAboard> GoAboards { get; set; }
            public List<HistorySpecialist> HistorySpecialist { get; set; }
            public IntroducerOfParty IntroducerOfParty { get; set; }
            public List<WorkingTracking> WorkingTracking { get; set; }
        }
        public class SelectedParty
        {
            public string[] Profile { get; set; }
            public string[] PersonalHistories { get; set; }
            public string[] TrainingCertificatedPasses { get; set; }
            public string[] WarningDisciplineds { get; set; }
            public string[] Awards { get; set; }
            public string[] Families { get; set; }
            public string[] GoAboards { get; set; }
            public string[] HistorySpecialist { get; set; }
            public string[] IntroducerOfParty { get; set; }
            public string[] WorkingTracking { get; set; }
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
                System.IO.File.WriteAllText(_hostingEnvironment.WebRootPath + filePath, content);
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
            public string AddressText { get; set; }
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
                var session2 = HttpContext.GetSessionUser();
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
                                    && (session2.ListGroupUser != null && session2.ListGroupUser.Contains(a.GroupUserCode) || session2.IsAllData)
                                    && (toDate == null || (toDate >= a.Birthday))
                                    && (jTablePara.FromAge == null || (jTablePara.FromAge <= (getYear - a.Birthday.Value.Year)))
                                    && (jTablePara.ToAge == null || (jTablePara.ToAge >= (getYear - a.Birthday.Value.Year)))
                                    && (string.IsNullOrEmpty(jTablePara.Name) || a.CurrentName.ToLower().Contains(jTablePara.Name.ToLower()))
                                    && (string.IsNullOrEmpty(jTablePara.Status) || a.Status != null && a.Status.Contains(jTablePara.Status))
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
                                 Nation = a.Nation,
                                 CreatedBy = b != null ? b.GivenName : "",
                                 ProfileLink = a.ProfileLink,
                                 resumeNumber = a.ResumeNumber,
                                 WfInstCode = wf != null ? wf.WfInstCode : "",
                                 BirthYear = a.Birthday.HasValue ? a.Birthday.Value.Year.ToString() : "",
                                 TemporaryAddress = a.TemporaryAddress,
                                 UnderPostGraduateEducation = a.UnderPostGraduateEducation,
                                 Degree = a.Degree,
                                 GeneralEducation = a.GeneralEducation,
                                 Gender = a.Gender,
                                 AddressText = a.AddressText,
                                 PermanentResidenceValue = $"{a.PermanentResidenceVillage}, {a.PermanentResidenceValue}",
                                 LastTimeReport = a.LastTimeReport.HasValue ? a.LastTimeReport.Value.ToString("dd/MM/yyyy HH:mm") : "",
                             })
                             .OrderByDescending(x => x.Id); // Sắp xếp giảm dần theo Id

                int total = _context.PartyAdmissionProfiles.Count();
                var query_row_number = query.AsEnumerable().Select((x, index) => new
                {
                    stt = index + 1,
                    x.Id,
                    x.CurrentName,
                    x.Nation,
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
                    x.AddressText,
                    x.PermanentResidenceValue,
                    x.BirthYear,
                    x.Gender,
                    x.LastTimeReport
                }).ToList();
                int count = query_row_number.Count();
                var data = query_row_number.AsQueryable().OrderBy(x => x.stt).Skip(intBegin).Take(jTablePara.Length);

                var jdata = JTableHelper.JObjectTable(Enumerable.ToList(data), jTablePara.Draw, count, "stt", "Id", "CurrentName", "Nation", "UserCode", "Status", "Username", "AddressText", "PermanentResidenceValue",
                    "CreatedBy", "ProfileLink", "resumeNumber", "WfInstCode", "UnderPostGraduateEducation", "Degree", "GeneralEducation", "TemporaryAddress", "BirthYear", "Gender", "LastTimeReport");
                return Json(jdata);
            }
            catch (Exception err)
            {
                var jdata = JTableHelper.JObjectTable(null, jTablePara.Draw, 0, "stt", "Id", "CurrentName", "UserCode", "Status", "Username", "Nation", "CreatedBy",
                    "ProfileLink", "resumeNumber", "WfInstCode", "UnderPostGraduateEducation", "Degree", "GeneralEducation", "TemporaryAddress", "BirthYear", "Gender", "LastTimeReport");
                return Json(jdata);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public object GetAllProfile()
        {
            return _context.PartyAdmissionProfiles.Where(x => !x.IsDeleted).Select(x => new
            {
                Name = x.CurrentName,
                Code = x.ResumeNumber
            }).ToList();
        }
        [NonAction]
        private string GetPlaceWorking(string Place)
        {
            var result = "";
            try
            {
                if (!string.IsNullOrEmpty(Place))
                {
                    var list = Place.Split("_").Select(x => x != "undefined" ? int.Parse(x) : -1).ToList();
                    var listAdress = new List<string>();
                    var a = _context.Provinces.FirstOrDefault(x => x.provinceId == list[0]);
                    if (a != null)
                        listAdress.Add(a.name);
                    var b = _context.Districts.FirstOrDefault(x => x.districtId == list[1]);
                    if (b != null)
                        listAdress.Add(b.name);
                    var c = _context.Wards.FirstOrDefault(x => x.wardsId == list[2]);
                    if (c != null)
                        listAdress.Add(c.name);
                    result = string.Join(", ", listAdress.Where(x => !string.IsNullOrEmpty(x)).ToList());
                }
            }
            catch (Exception ex)
            {

            }
            return result;

        }

        [NonAction]
        private string ReplaceCreatedPlace(string CreatedPlace)
        {
            try {
                var Place = CreatedPlace.Split("_");
                if (Place.Length >= 2)
                {
                    CreatedPlace = Place[1] + " tại " + Place[0];
                }
                else
                {
                    CreatedPlace = CreatedPlace ?? "";
                }
            } catch (Exception ex)
            {
                CreatedPlace =  "";
            }

            return CreatedPlace;
        }
        [HttpPost]
        [AllowAnonymous]
        public object GetReportProfile([FromBody] DataModel data)
        {
            var msg = new JMessage { Error = false, Title = "" };
            var ListProfile = new List<SelectedParty>();
            List<JMessage> filePath = new List<JMessage>();
            foreach (var ressumeNumber in data.ListData)
            {
                string Place = "";
                var profileParty = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.ResumeNumber == ressumeNumber);
                if (profileParty != null)
                {
                    Place = GetPlaceWorking(profileParty.PlaceWorking);
                }
                List<string> ProfileSelected = GetTrueProperties(data.Profile);

                var query = _context.PartyAdmissionProfiles.Select(x => new ModelViewPAMP
                {
                    CurrentName = x.CurrentName,
                    Nation = x.Nation,
                    BirthName = x.BirthName,
                    Gender = x.Gender == 0 ? "Nam" : "Nữ",
                    Religion = x.Religion,
                    Birthday = x.Birthday.Value.ToShortDateString(),
                    PermanentResidence = x.PermanentResidence,
                    Phone = x.Phone,
                    Picture = x.Picture,
                    HomeTown = x.HomeTown,
                    PlaceBirth = x.PermanentResidence,
                    Job = x.Job,
                    TemporaryAddress = x.TemporaryAddress,
                    GeneralEducation = x.GeneralEducation,
                    JobEducation = x.JobEducation,
                    UnderPostGraduateEducation = x.UnderPostGraduateEducation,
                    Degree = x.Degree,
                    PoliticalTheory = x.PoliticalTheory,
                    ForeignLanguage = x.ForeignLanguage,
                    ItDegree = x.ItDegree,
                    MinorityLanguages = x.MinorityLanguages,
                    ResumeNumber = x.ResumeNumber,
                    SelfComment = x.SelfComment,
                    CreatedPlace = ReplaceCreatedPlace(x.CreatedPlace),
                    WfInstCode = x.WfInstCode,
                    Username = x.Username,
                    Status = x.Status,
                    GroupUserCode = x.GroupUserCode,
                    PlaceWorking = Place,
                    MarriedStatus = x.MarriedStatus,
                    AddressText = x.AddressText,
                    TemporaryAddressValue = $"{x.TemporaryAddressVillage}, {x.TemporaryAddressValue}",
                    TemporaryAddressVillage = x.TemporaryAddressVillage,
                    PermanentResidenceVillage = x.PermanentResidenceVillage,
                    PermanentResidenceValue = $"{x.PermanentResidenceVillage}, {x.PermanentResidenceValue}",
                    HomeTownVillage = x.HomeTownVillage,
                    HomeTownValue = $"{x.HomeTownVillage}, {x.HomeTownValue}",
                    BirthPlaceValue = $"{x.BirthPlaceVillage}, {x.BirthPlaceValue}",
                }).Where(x => x.ResumeNumber == ressumeNumber);


                //Thông tin cá nhân Ok
                var profile = SelectProperties(query,
                    ProfileSelected).ToArray();

                var jsonParty = new SelectedParty();

                if (profile != null)
                {
                    jsonParty.Profile = (string[])profile;
                }

                // Người giới thiệu Ok
                ProfileSelected = GetTrueProperties(data.Introducer);

                profile = SelectProperties(_context.IntroducerOfParties.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false),
                    ProfileSelected).ToArray();

                if (profile != null)
                {
                    jsonParty.IntroducerOfParty = (string[])profile;
                }

                //Công tác và chức vụ Ok
                ProfileSelected = GetTrueProperties(data.WorkingTracking);

                if (ProfileSelected.Count != 0)
                {

                    profile = SelectProperties(_context.WorkingTrackings.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false),
                        ProfileSelected).ToArray();

                    if (profile != null)
                    {
                        jsonParty.WorkingTracking = profile;
                    }

                }

                //Lịch sử bản thân
                ProfileSelected = GetTrueProperties(data.PersonHistory);

                if (ProfileSelected.Count != 0)
                {
                    profile = SelectProperties(_context.PersonalHistories.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false),
                    ProfileSelected).ToArray();

                    if (profile != null)
                    {
                        jsonParty.PersonalHistories = profile;
                    }
                }
                //Đặc điểm lịch sử
                ProfileSelected = GetTrueProperties(data.HistorySpecialist);

                if (ProfileSelected.Count != 0)
                {
                    profile = SelectProperties(_context.HistorySpecialists.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false),
                    ProfileSelected).ToArray();

                    if (profile != null)
                    {
                        jsonParty.HistorySpecialist = profile;
                    }
                }

                //Lớp đào tạo bồi dưỡng Ok
                ProfileSelected = GetTrueProperties(data.TrainingCertificatedPass);

                if (ProfileSelected.Count != 0)
                {
                    profile = SelectProperties(_context.TrainingCertificatedPasses.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false),
                    ProfileSelected).ToArray();

                    if (profile != null)
                    {
                        jsonParty.TrainingCertificatedPasses = profile;
                    }
                }
                //Đi nước ngoài
                ProfileSelected = GetTrueProperties(data.GoAboard);

                if (ProfileSelected.Count != 0)
                {
                    profile = SelectProperties(_context.GoAboards.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false),
                    ProfileSelected).ToArray();

                    if (profile != null)
                    {
                        jsonParty.GoAboards = profile;
                    }
                }

                //Khen thưởng Ok
                ProfileSelected = GetTrueProperties(data.Laudatory);

                if (ProfileSelected.Count != 0)
                {
                    profile = SelectProperties(_context.Awards.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false),
                    ProfileSelected).ToArray();

                    if (profile != null)
                    {
                        jsonParty.Awards = profile;
                    }
                }
                //Kỉ luật Ok
                ProfileSelected = GetTrueProperties(data.WarningDisciplined);

                if (ProfileSelected.Count != 0)
                {
                    profile = SelectProperties(_context.WarningDisciplineds.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false),
                    ProfileSelected).ToArray();

                    if (profile != null)
                    {
                        jsonParty.WarningDisciplineds = profile;
                    }
                }
                //Gia đình Ok
                ProfileSelected = GetTrueProperties(data.Family);

                if (ProfileSelected.Count != 0)
                {
                    var familes = _context.Families.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false)
                        .Select(delegate (Family x)
                        {
                            x.HomeTownValue = $"{x.HomeTownVillage}, {x.HomeTownValue}";
                            return x;
                        });
                    profile = SelectProperties(familes,
                    ProfileSelected).ToArray();

                    if (profile != null)
                    {
                        jsonParty.Families = profile;
                    }
                }

                msg = GenergatePesonnal(jsonParty);
                if (!msg.Error)
                {
                    try
                    {
                        profileParty.LastTimeReport = DateTime.Now;
                        _context.Update(profileParty);
                        _context.SaveChanges();
                    }
                    catch (Exception ex)
                    {

                    }
                    msg.Title = ressumeNumber;
                    filePath.Add(msg);
                }

            }

            return filePath;
        }

        static IEnumerable<string> SelectProperties<T>(IEnumerable<T> items, List<string> propertiesToSelect, bool isNote = true)
        {
            PropertyInfo[] propertyInfos = typeof(T).GetProperties();

            foreach (var item in items)
            {
                foreach (var propertyName in propertiesToSelect)
                {
                    PropertyInfo property = typeof(T).GetProperty(propertyName);
                    if (property != null)
                    {

                        object value = property.GetValue(item);
                        string note = GetNote(property);
                        note = note == "" ? property.Name : note;
                        yield return $"{note}: {value}";
                    }
                }
            }
        }

        private static string GetNote(PropertyInfo property)
        {
            NoteAttribute attribute = (NoteAttribute)Attribute.GetCustomAttribute(property, typeof(NoteAttribute));
            return attribute != null ? attribute.Note : "";
        }

        public static List<string> GetTrueProperties<T>(T obj)
        {
            Type type = typeof(T);
            PropertyInfo[] properties = type.GetProperties();

            List<string> trueProperties = new List<string>();

            foreach (PropertyInfo property in properties)
            {
                bool value = (bool)property.GetValue(obj);
                if (value)
                {
                    trueProperties.Add(property.Name);
                }
            }
            return trueProperties;
        }

        [HttpGet]
        [AllowAnonymous]
        public object GetMemberPartyProfile(string ressumeNumber)
        {
            var msg = new JMessage { Error = false, Title = "" };

            List<JMessage> filePath = new List<JMessage>();
            //truy vấn
            var jsonData = new converJsonPartyAdmission();
            var profile = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.ResumeNumber == ressumeNumber);
            jsonData.Profile = _context.PartyAdmissionProfiles.Where(x => x.ResumeNumber == ressumeNumber && x.IsDeleted == false)
                .Select(x => new ModelViewPAMP
                {
                    CurrentName = x.CurrentName,
                    Nation = x.Nation,
                    BirthName = x.BirthName,
                    Gender = x.Gender == 0 ? "Nam" : "Nữ",
                    Religion = x.Religion,
                    Birthday = x.Birthday.Value.ToShortDateString(),
                    PermanentResidence = x.PermanentResidence,
                    Phone = x.Phone,
                    Picture = x.Picture,
                    HomeTown = x.HomeTown,
                    PlaceBirth = x.PlaceBirth,
                    Job = x.Job,
                    TemporaryAddress = x.TemporaryAddress,
                    GeneralEducation = x.GeneralEducation,
                    JobEducation = x.JobEducation,
                    UnderPostGraduateEducation = x.UnderPostGraduateEducation,
                    Degree = x.Degree,
                    PoliticalTheory = x.PoliticalTheory,
                    ForeignLanguage = x.ForeignLanguage,
                    ItDegree = x.ItDegree,
                    MinorityLanguages = x.MinorityLanguages,
                    ResumeNumber = x.ResumeNumber,
                    SelfComment = x.SelfComment,
                    CreatedPlace = x.CreatedPlace,
                    WfInstCode = x.WfInstCode,
                    Username = x.Username,
                    Status = x.Status,
                    GroupUserCode = x.GroupUserCode,
                    PlaceWorking = x.PlaceWorking,
                    MarriedStatus = x.MarriedStatus,
                    AddressText = x.AddressText,
                    TemporaryAddressValue = $"{x.TemporaryAddressVillage}, {x.TemporaryAddressValue}",
                    TemporaryAddressVillage = x.TemporaryAddressVillage,
                    PermanentResidenceVillage = x.PermanentResidenceVillage,
                    PermanentResidenceValue = $"{x.PermanentResidenceVillage}, {x.PermanentResidenceValue}",
                    HomeTownVillage = x.HomeTownVillage,
                    HomeTownValue = $"{x.HomeTownVillage}, {x.HomeTownValue}",
                    BirthPlaceValue = $"{x.BirthPlaceVillage}, {x.BirthPlaceValue}",

                }).FirstOrDefault();

            jsonData.IntroducerOfParty = _context.IntroducerOfParties.FirstOrDefault(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false);
            jsonData.WorkingTracking = _context.WorkingTrackings.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false).ToList();
            jsonData.TrainingCertificatedPasses = _context.TrainingCertificatedPasses.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false).ToList();
            jsonData.Families = _context.Families.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false).ToList();
            jsonData.Awards = _context.Awards.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false).ToList();
            jsonData.WarningDisciplineds = _context.WarningDisciplineds.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false).ToList();
            jsonData.GoAboards = _context.GoAboards.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false).ToList();
            jsonData.PersonalHistories = _context.PersonalHistories.Where(x => x.ProfileCode == ressumeNumber && x.IsDeleted == false).ToList();


            // Process BirthYear for each family member
            foreach (var familyMember in jsonData.Families)
            {
                string[] parts = familyMember.BirthYear.Split('_'); // Assuming parts are separated by semicolon
                string[] partParty = familyMember.PartyMember.Split('_'); // Assuming parts are separated by semicolon

                familyMember.BirthYear = parts.Length > 1 ? parts[1] : familyMember.BirthYear;
                if (parts[0] == "true")
                {
                    familyMember.BirthYear = parts[1];
                    familyMember.Name += "\n" + "(Đã mất - " + "mất tại: " + parts[2] + "- mất do:" + parts[3] + ")";
                }
                else
                {
                    familyMember.BirthYear = parts[1];
                };
                if (partParty[1] == "true")
                {
                    familyMember.PartyMember = "Có \n" + "+ Công tác tại: " + partParty[0] + "\n" + "+ Thuộc chi bộ: " + partParty[2];
                }
                else
                {
                    familyMember.PartyMember = "không";
                }
                if (familyMember.Relation.ToLower() == "vợ" || familyMember.Relation.ToLower() == "chồng" || familyMember.Relation.ToLower() == "vợ (chồng)")
                {
                    string[] marriedParts = jsonData.Profile.MarriedStatus.Split('_');
                    if (marriedParts[0] == "2")
                    {
                        familyMember.Name += $" (Đã Ly hôn theo quyết định số: {marriedParts[1]}, Ngày: {marriedParts[2]}, Địa điểm: {marriedParts[3]})";
                    }
                }

            }

            //tạo file
            msg = CreatePartyMemberProfile(jsonData);
            if (!msg.Error)
            {
                //lấy đường dẫn file
                msg.Title = ressumeNumber;
                filePath.Add(msg);
            }
            return filePath;
        }


        [NonAction]
        private JMessage CreatePartyMemberProfile(converJsonPartyAdmission jsonParty)
        {
            var msg = new JMessage { Title = _sharedResources["COM_MSG_SUCCES_SAVE"], Error = false };

            string path = "/files/Template/phieu-dang-vien.docx";
            string rootPath = _hostingEnvironment.WebRootPath;
            var filePath = string.Concat(rootPath, path);
            var fileStream = new FileStream(filePath, FileMode.Open);

            try
            {
                WordDocument document = new WordDocument(fileStream, Syncfusion.DocIO.FormatType.Docx);
                IWSection section = document.Sections[0];

                //binding file
                BinddingPartyMemberProfile.BiddingPatyProfile(section, jsonParty);

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
                msg.Title = "Có lỗi xảy ra";
                msg.Object = path;
                //signBytes.Close();
            }

            fileStream.Dispose();
            return msg;
        }
        [NonAction]
        private JMessage GenergatePesonnal(SelectedParty jsonParty)
        {
            var msg = new JMessage { Title = _sharedResources["COM_MSG_SUCCES_SAVE"], Error = false };

            string path = "/files/Template/ReportKnd.docx";
            string rootPath = _hostingEnvironment.WebRootPath;
            var filePath = string.Concat(rootPath, path);
            var fileStream = new FileStream(filePath, FileMode.Open);

            try
            {
                WordDocument document = new WordDocument(fileStream, Syncfusion.DocIO.FormatType.Docx);
                IWSection section = document.Sections[0];

                WTable table = section.Tables[0] as WTable;
                BindingReportKND.BinddingPesonal(table, section, jsonParty.Profile, jsonParty.IntroducerOfParty);

                if (jsonParty.WorkingTracking != null)
                {
                    var p = section.AddParagraph() as WParagraph;
                    p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Center;
                    WTextRange text = p.AppendText("Công tác và chức vụ đã qua") as WTextRange;
                    SetStyleHeader(text);

                    table = AddTable(section, 1, 2, "Thời gian", "Công việc, chức vụ");

                    SetStyleHeader(text);

                    BindingReportKND.BinđingPersonalHistory(table, jsonParty.WorkingTracking);
                }
                if (jsonParty.TrainingCertificatedPasses != null)
                {
                    var p = section.AddParagraph() as WParagraph;
                    p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Center;
                    WTextRange text = p.AppendText("Lớp đào tạo và bồi dưỡng đã qua") as WTextRange;
                    SetStyleHeader(text);

                    table = AddTable(section, 1, 4, "Tên trường", "Ngành học hoặc tên lớp học", "Từ tháng/năm đến tháng/năm", "Văn bằng, chứng chỉ, trình độ gì", "Văn bằng, chứng chỉ, trình độ gì");

                    SetStyleHeader(text);

                    BindingReportKND.BinddingTrainingCertificatedPass(table, jsonParty.TrainingCertificatedPasses);
                }
                if (jsonParty.Families != null)
                {
                    var p = section.AddParagraph() as WParagraph;
                    p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Center;
                    WTextRange text = p.AppendText("Gia đình") as WTextRange;

                    SetStyleHeader(text);

                    table = section.AddTable() as WTable;
                    table.ResetCells(1, 4);

                    text = table[0, 0].AddParagraph().AppendText("Quan hệ") as WTextRange;
                    var cell = table[0, 0] as WTableCell;
                    cell.Width = 60;
                    SetStyleHeader(text);

                    text = table[0, 1].AddParagraph().AppendText("Họ và tên") as WTextRange;
                    cell = table[0, 1] as WTableCell;
                    cell.Width = 60;
                    SetStyleHeader(text);

                    text = table[0, 2].AddParagraph().AppendText("Năm sinh") as WTextRange;
                    cell = table[0, 2] as WTableCell;
                    cell.Width = 60;
                    SetStyleHeader(text);

                    text = table[0, 3].AddParagraph().AppendText("Quê quán, nơi ở hiện nay (trong, ngoài nước), nghề nghiệp, chức danh, chức vụ, đơn vị công tác") as WTextRange;

                    cell = table[0, 3] as WTableCell;
                    cell.Width = 170;
                    SetStyleHeader(text);
                    BindingReportKND.BinddingFamily(table, jsonParty.Families);
                }

                if (jsonParty.PersonalHistories != null)
                {
                    var p = section.AddParagraph() as WParagraph;
                    p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Center;
                    WTextRange text = p.AppendText("Lịch sử bản thân") as WTextRange;
                    SetStyleHeader(text);

                    table = AddTable(section, 1, 2, "Từ ngày đến ngày", "Nội dung");

                    BindingReportKND.BinddingPersonalHistoriesAndSpecialHistory(table, jsonParty.PersonalHistories);
                }

                if (jsonParty.Awards != null)
                {
                    var p = section.AddParagraph() as WParagraph;
                    p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Center;
                    WTextRange text = p.AppendText("Khen thưởng") as WTextRange;
                    SetStyleHeader(text);

                    table = AddTable(section, 1, 3, "Tháng, năm", "Quyết định", "Lý do, hình thức");

                    BindingReportKND.BinddingAwards(table, jsonParty.Awards);
                }


                if (jsonParty.WarningDisciplineds != null)
                {
                    var p = section.AddParagraph() as WParagraph;
                    p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Center;
                    WTextRange text = p.AppendText("Kỷ luật") as WTextRange;
                    SetStyleHeader(text);

                    table = AddTable(section, 1, 3, "Tháng, năm", "Cấp quyết định", "Lý do, hình thức");

                    BindingReportKND.BinddingAwards(table, jsonParty.WarningDisciplineds);
                }


                if (jsonParty.GoAboards != null)
                {
                    var p = section.AddParagraph() as WParagraph;
                    p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Center;
                    WTextRange text = p.AppendText("Đi nước ngoài") as WTextRange;
                    SetStyleHeader(text);

                    table = AddTable(section, 1, 3, "Tháng, năm", "Nội dung đi", "Nước nào");

                    BindingReportKND.BinddingGoAboards(table, jsonParty.GoAboards);
                }

                if (jsonParty.HistorySpecialist != null)
                {
                    var p = section.AddParagraph() as WParagraph;
                    p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Center;
                    WTextRange text = p.AppendText("Đặc điểm lịch sử") as WTextRange;
                    SetStyleHeader(text);

                    table = AddTable(section, 1, 2, "Thời gian", "Nội dung");

                    BindingReportKND.BinddingPersonalHistoriesAndSpecialHistory(table, jsonParty.HistorySpecialist);
                }
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
                msg.Title = "Có lỗi xảy ra";
                msg.Object = path;
                //signBytes.Close();
            }

            fileStream.Dispose();
            return msg;
        }


        private WTable AddTable(IWSection section, int row, int cell, params string[] listTitle)
        {
            WTable table = section.AddTable() as WTable;
            table.ResetCells(row, cell);
            for (int i = 0; i < cell; i++)
            {
                WTextRange text = table[0, i].AddParagraph().AppendText(listTitle[i]) as WTextRange;
                SetStyleHeader(text);
            }
            return table;
        }

        private void SetStyleHeader(WTextRange text)
        {
            text.CharacterFormat.FontName = "Times New Roman";
            text.CharacterFormat.FontSize = 14;
            text.CharacterFormat.Bold = true;
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
                if (check != null || x.ProfileCode == null)
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

        [HttpPut]
        [AllowAnonymous]
        public IActionResult UpdatePartyFamilyTime([FromBody] PartyFamilyTimeModel model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                if (!string.IsNullOrEmpty(model.ResumeCode) && !string.IsNullOrEmpty(model.Relationship))
                {
                    var data = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.ResumeNumber == model.ResumeCode);
                    if (data == null)
                    {
                        msg.Error = true;
                        msg.Title = "Mã hồ sơ không tồn tại";
                        return Ok(msg);
                    }
                    var a = _context.PartyFamilyTimes.FirstOrDefault(x => !x.IsDeleted && x.ResumeCode == model.ResumeCode
                    && x.Relationship == model.Relationship);
                    if (a != null)
                    {
                        a.LastTime = model.LastTime;
                        a.UpdatedDate = DateTime.Now;
                        a.UpdatedBy = ESEIM.AppContext.UserName;
                        _context.PartyFamilyTimes.Update(a);
                        _context.SaveChanges();
                        msg.Title = "Cập nhật thời gian liền kề thành công";
                    }
                    else
                    {
                        _context.PartyFamilyTimes.Add(new PartyFamilyTime
                        {
                            ResumeCode = model.ResumeCode,
                            Relationship = model.Relationship,
                            LastTime = model.LastTime,
                            CreatedBy = ESEIM.AppContext.UserName,
                            CreatedDate = DateTime.Now,
                            IsDeleted = false
                        });
                        _context.SaveChanges();
                        msg.Title = "Thêm mới thời gian liền kề thành công";
                    }
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Lý lịch gia đình chưa hợp lệ";
                }

            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Cập nhật thời gian liền kề thất bại";
            }
            return Ok(msg);
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetPartyFamilyTime(string resumeCode, string relationship)
        {
            var obj = _context.PartyFamilyTimes.FirstOrDefault(x => !x.IsDeleted && x.ResumeCode == resumeCode && x.Relationship == relationship);
            return Ok(obj);
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
        public string LastTimeReport { get; set; }
        public string Nation { get; set; }
        public string AddressText { get; set; }
        public string PermanentResidenceValue { get; set; }
    }

    public class ResumeNumber
    {
        public string ResumeNumberstring { get; set; }
    }
    public class ProfileBool
    {
        public bool CurrentName { get; set; }
        public bool Birthday { get; set; }
        public bool Gender { get; set; }
        public bool Phone { get; set; }
        /* public bool PlaceBirth { get; set; }*/
        public bool BirthPlaceValue { get; set; }
        /*public bool HomeTown { get; set; }*/
        public bool HomeTownValue { get; set; }
        /*public bool PermanentResidence { get; set; }*/
        public bool PermanentResidenceValue { get; set; }
        /*public bool TemporaryAddress { get; set; }*/
        public bool TemporaryAddressValue { get; set; }
        public bool Job { get; set; }
        public bool Nation { get; set; }
        public bool Religion { get; set; }
        public bool SelfComment { get; set; }
        public bool BirthName { get; set; }
        public bool GeneralEducation { get; set; }
        public bool UnderPostGraduateEducation { get; set; }
        public bool Degree { get; set; }
        public bool JobEducation { get; set; }
        public bool ForeignLanguage { get; set; }
        public bool MinorityLanguages { get; set; }
        public bool PoliticalTheory { get; set; }
        public bool ItDegree { get; set; }
        public bool CreatedPlace { get; set; }
        public bool GroupUser { get; set; }
        /* public bool PlaceWorking { get; set; }*/
    }

    public class FamilyBool
    {
        public bool Relation { get; set; }
        public bool Name { get; set; }
        public bool BirthYear { get; set; }
        public bool PartyMember { get; set; }
        public bool PoliticalAttitude { get; set; }
        public bool HomeTownValue { get; set; }
        public bool Residence { get; set; }
        public bool Job { get; set; }
        public bool WorkingProgress { get; set; }
        public bool ClassComposition { get; set; }
        public bool BirthPlace { get; set; }

    }

    public class PersonHistoryBool
    {
        public bool Begin { get; set; }
        public bool End { get; set; }
        public bool Content { get; set; }
    }

    public class WorkingTrackingBool
    {
        public bool From { get; set; }
        public bool To { get; set; }
        public bool Work { get; set; }
        public bool Role { get; set; }
    }

    public class HistorySpecialistBool
    {
        public bool MonthYear { get; set; }
        public bool Content { get; set; }

    }

    public class LaudatoryBool
    {
        public bool MonthYear { get; set; }
        public bool GrantOfDecision { get; set; }
        public bool Reason { get; set; }

    }

    public class WarningDisciplinedBool
    {
        public bool MonthYear { get; set; }
        public bool GrantOfDecision { get; set; }
        public bool Reason { get; set; }

    }

    public class TrainingCertificatedPassBool
    {
        public bool From { get; set; }
        public bool Certificate { get; set; }
        public bool To { get; set; }
        public bool SchoolName { get; set; }
        public bool Class { get; set; }
    }

    public class GoAboardBool
    {
        public bool From { get; set; }
        public bool To { get; set; }
        public bool Contact { get; set; }
        public bool Country { get; set; }

    }

    public class IntroducerBool
    {
        public bool PersonIntroduced { get; set; }
        public bool PlaceTimeRecognize { get; set; }
        public bool PlaceTimeJoinUnion { get; set; }
        public bool PlaceTimeJoinParty { get; set; }

    }

    public class DataModel
    {
        public List<String> ListData { get; set; }
        public ProfileBool Profile { get; set; }
        public FamilyBool Family { get; set; }
        public PersonHistoryBool PersonHistory { get; set; }
        public WorkingTrackingBool WorkingTracking { get; set; }
        public HistorySpecialistBool HistorySpecialist { get; set; }
        public LaudatoryBool Laudatory { get; set; }
        public WarningDisciplinedBool WarningDisciplined { get; set; }
        public TrainingCertificatedPassBool TrainingCertificatedPass { get; set; }
        public GoAboardBool GoAboard { get; set; }
        public IntroducerBool Introducer { get; set; }
    }
}
