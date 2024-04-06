using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Aspose.Pdf;
using Aspose.Pdf.Annotations;
using Aspose.Pdf.Text;
using ESEIM.Models;
using ESEIM.Utils;
using FTU.Utils.HelperNet;
using III.Domain.Enums;
using LanguageDetection;
using log4net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SmartBreadcrumbs.Attributes;
using Syncfusion.DocIO.DLS;
using Syncfusion.OCRProcessor;
using Syncfusion.Pdf;
using Syncfusion.Pdf.Graphics;
using Syncfusion.Pdf.Parsing;
using Syncfusion.Presentation;
using Syncfusion.XlsIO;
using VersOne.Epub;
using static System.Threading.Thread;
using AppContext = ESEIM.AppContext;
using Color = Syncfusion.Drawing.Color;
using FormatType = Syncfusion.DocIO.FormatType;
using Image = System.Drawing.Image;
using IShape = Syncfusion.Presentation.IShape;
using IStyle = Syncfusion.XlsIO.IStyle;
using Page = Aspose.Pdf.Page;
using Point = Aspose.Pdf.Point;
using WordDocument = Syncfusion.EJ2.DocumentEditor.WordDocument;

namespace III.Admin.Controllers
{
    [Area("Admin")]
    public class EDMSRepositoryController : BaseController
    {
        private readonly EIMDBContext _context;
        private readonly IUploadService _upload;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ILuceneService _luceneService;
        private readonly IRepositoryService _repositoryService;
        private readonly IStringLocalizer<EDMSRepositoryController> _stringLocalizer;
        private readonly IStringLocalizer<ContractController> _contractController;
        private readonly IStringLocalizer<CommonSettingController> _stringLocalizerCommon;
        private readonly IStringLocalizer<SharedResources> _sharedResources;
        private static readonly ILog Log = LogManager.GetLogger(MethodBase.GetCurrentMethod()?.DeclaringType);
        string[] word = { ".DOC", ".DOCX" };
        string[] pdf = { ".PDF" };
        string[] excel = { ".XLSX", ".XLS" };
        public EDMSRepositoryController(EIMDBContext context, IUploadService upload,
            IHostingEnvironment hostingEnvironment,
            IStringLocalizer<EDMSRepositoryController> stringLocalizer,
            IStringLocalizer<ContractController> contractController,
            IStringLocalizer<SharedResources> sharedResources,
            IStringLocalizer<CommonSettingController> stringLocalizerCommon, ILuceneService luceneService,
            IRepositoryService repositoryService)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
            _upload = upload;
            _stringLocalizer = stringLocalizer;
            _contractController = contractController;
            _sharedResources = sharedResources;
            _stringLocalizerCommon = stringLocalizerCommon;
            _luceneService = luceneService;
            _repositoryService = repositoryService;
        }
        [Breadcrumb("ViewData.Title", AreaName = "Admin", FromAction = "Index", FromController = typeof(WarehouseDigitalHomeController))]
        public IActionResult Index()
        {
            ViewData["CrumbDashBoard"] = _sharedResources["COM_CRUMB_DASH_BOARD"];
            ViewData["CrumbMenuCenter"] = _sharedResources["COM_CRUMB_MENU_CENTER"];
            ViewData["CrumbWHDHome"] = _sharedResources["COM_CRUMB_WH_DIGITAL_HOME"];
            ViewData["CrumbEdmsRepo"] = _sharedResources["COM_CRUMB_EDMS_REPOSITORY"];
            return View();
        }

        #region Category
        public class CategoryModel
        {
            public EDMSCategory Category { get; set; }
            [Required]
            public string ReposCode { get; set; }
            public string TypeRepos { get; set; }
            public List<Repository> ListRepository { get; set; }
        }
        public class Repository
        {
            public string FolderName { get; set; }
            public string Path { get; set; }
            public string FolderId { get; set; }
        }
        [HttpPost]
        public List<TreeViewResource> GetTreeCategory()
        {
            var data = _context.EDMSCategorys.Where(x => x.IsDeleted == false).OrderByDescending(x => x.Id).AsNoTracking();
            var dataOrder = GetSubTreeCategoryData(data.ToList(), null, new List<TreeViewResource>(), 0, 2);
            return dataOrder;
        }

        [HttpGet]
        public JsonResult GetItemCategory(int id)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var model = new CategoryModel();
                var category = _context.EDMSCategorys.FirstOrDefault(x => x.Id == id);
                if (category != null)
                {
                    model.Category = category;
                    var repository = _context.EDMSCatRepoSettings.Where(x => x.CatCode == category.CatCode);
                    var listRepository = _context.EDMSCatRepoSettings.Where(x => x.CatCode == category.CatCode);
                    model.ReposCode = repository.GroupBy(x => x.ReposCode).Select(x => x.Key).FirstOrDefault();
                    model.ListRepository = listRepository.Select(x => new Repository { Path = x.Path, FolderId = x.FolderId, FolderName = x.FolderName }).ToList();
                    model.TypeRepos = repository.FirstOrDefault(x => string.IsNullOrEmpty(x.FolderId)) != null ? EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server) : EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.GooglerDriver);
                    msg.Object = model;
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _sharedResources["COM_MSG_ERR"];//"Xóa file lỗi";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex.Message;
                msg.Title = _sharedResources["COM_MSG_ERR"];//"Xóa file lỗi";
            }
            return Json(msg);
        }

        [HttpPost]
        public object GetParentCategory([FromBody] TempSub obj)
        {
            if (obj.IdI == null)
            {
                var data = _context.EDMSCategorys.Where(x => x.IsDeleted == false).OrderBy(x => x.Id).AsNoTracking();
                var dataOrder = GetSubTreeCategoryData(data.ToList(), null, new List<TreeViewResource>(), 0, 1);
                return dataOrder;
            }
            else
            {
                string reposCode = _context.EDMSCategorys.Where(x => x.Id == obj.IdI[0]).Select(x => x.CatCode).FirstOrDefault();
                var data = _context.EDMSCategorys.Where(x => (x.CatCode != reposCode && x.CatParent != reposCode)).OrderByDescending(x => x.Id).AsNoTracking();
                var dataOrder = GetSubTreeCategoryData(data.ToList(), null, new List<TreeViewResource>(), 0, 1);
                return dataOrder;
            }
        }

        [HttpPost]
        public JsonResult InsertCategory([FromBody] CategoryModel obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                //check exist code
                var checkExistCode = _context.EDMSCategorys.FirstOrDefault(x => x.CatCode == obj.Category.CatCode && x.IsDeleted == false);
                if (checkExistCode != null)
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["EDMSR_MSG_CATEGORY_CODE_EXIST"];//"Mã kho dữ liệu đã tồn tại";
                }
                else
                {
                    //check if module upload file default is registered
                    var checkModuleUploadFileDefault = _context.EDMSCategorys.FirstOrDefault(x => x.ModuleFileUploadDefault == obj.Category.ModuleFileUploadDefault && !x.IsDeleted);
                    if (checkModuleUploadFileDefault != null && !String.IsNullOrEmpty(obj.Category.ModuleFileUploadDefault))
                    {
                        msg.Error = true;
                        msg.Title = _stringLocalizer["EDMSR_MSG_CATEGORY_MODULE_FILE_UPLOAD_DEFAULT_EXIST"];//"Module upload file default đã được đăng ký";
                        return Json(msg);
                    }
                    //add category
                    obj.Category.CatParent = string.IsNullOrEmpty(obj.Category.CatParent) ? "#" : obj.Category.CatParent;
                    obj.Category.CreatedBy = AppContext.UserName;
                    obj.Category.CreatedTime = DateTime.Now;
                    _context.EDMSCategorys.Add(obj.Category);

                    //add repository
                    foreach (var item in obj.ListRepository)
                    {
                        var reposSetting = new EDMSCatRepoSetting
                        {
                            CatCode = obj.Category.CatCode,
                            ReposCode = obj.ReposCode,
                            Path = obj.TypeRepos == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server) ? item.Path : "",
                            FolderId = obj.TypeRepos == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.GooglerDriver) ? item.FolderId : "",
                            FolderName = item.FolderName
                        };
                        _context.EDMSCatRepoSettings.Add(reposSetting);
                    }
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_ADD_SUCCESS"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex.Message;
                msg.Title = _sharedResources["COM_MSG_ERR"];//"Xóa file lỗi";
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult UpdateCategory([FromBody] CategoryModel obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.EDMSCategorys.FirstOrDefault(x => x.Id == obj.Category.Id);
                if (data != null)
                {
                    //check if module upload file default is registered
                    var checkModuleUploadFileDefault = _context.EDMSCategorys.FirstOrDefault(x => x.ModuleFileUploadDefault == obj.Category.ModuleFileUploadDefault && !x.IsDeleted && x.CatCode != obj.Category.CatCode);
                    if (checkModuleUploadFileDefault != null && !String.IsNullOrEmpty(obj.Category.ModuleFileUploadDefault))
                    {
                        msg.Error = true;
                        msg.Title = _stringLocalizer["EDMSR_MSG_CATEGORY_MODULE_FILE_UPLOAD_DEFAULT_EXIST"];//"Module upload file default đã được đăng ký";
                        return Json(msg);
                    }
                    data.CatName = obj.Category.CatName;
                    data.ModuleFileUploadDefault = obj.Category.ModuleFileUploadDefault;
                    data.PathServerPhysic = obj.Category.PathServerPhysic;
                    if (data.CatParent != obj.Category.CatParent)
                    {
                        data.CatParent = string.IsNullOrEmpty(obj.Category.CatParent) ? "#" : obj.Category.CatParent;
                    }
                    _context.EDMSCategorys.Update(data);

                    //remove repository
                    var category = _context.EDMSCatRepoSettings.Where(x => x.CatCode == obj.Category.CatCode);
                    if (category.Any())
                    {
                        _context.EDMSCatRepoSettings.RemoveRange(category);
                    }

                    //add repository
                    foreach (var item in obj.ListRepository)
                    {
                        var reposSetting = new EDMSCatRepoSetting
                        {
                            CatCode = obj.Category.CatCode,
                            ReposCode = obj.ReposCode,
                            Path = obj.TypeRepos == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server) ? item.Path : "",
                            FolderId = obj.TypeRepos == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.GooglerDriver) ? item.FolderId : "",
                            FolderName = item.FolderName
                        };
                        _context.EDMSCatRepoSettings.Add(reposSetting);
                    }
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_UPDATE_SUCCESS"];
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["EDMSR_MSG_DATA_NOT_EXIST"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex.Message;
                msg.Title = _sharedResources["COM_MSG_ERR"];//"Xóa file lỗi";
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult DeleteCategory(string catCode)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var cat = _context.EDMSCategorys.FirstOrDefault(x => x.CatCode == catCode && x.IsDeleted == false);
                var getListChild = _context.EDMSCategorys.Where(x => x.CatParent == cat.CatCode && !x.IsDeleted);
                var listFile = _context.EDMSRepoCatFiles.Where(x => x.CatCode.Equals(cat.CatCode));
                if (getListChild.Any())
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["EDMSR_MSG_NO_DELETE_CHILD"];
                }
                else if (listFile.Any())
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["EDMSR_MSG_PLS_DELETE_FILES"];
                }
                else
                {
                    cat.IsDeleted = true;
                    _context.EDMSCategorys.Update(cat);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_DELETE_SUCCESS"];
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

        [NonAction]
        private List<TreeViewResource> GetSubTreeCategoryData(List<EDMSCategory> data, string parentid, List<TreeViewResource> lstCategories, int tab, int typeOrder)
        {
            //tab += "- ";
            var contents = string.IsNullOrEmpty(parentid)
                ? (typeOrder == 1 ? data.Where(x => x.CatParent == "#").OrderBy(x => x.Id).AsParallel() : data.Where(x => x.CatParent == "#").OrderByDescending(x => x.Id).AsParallel())
                : data.Where(x => x.CatParent == parentid).OrderByDescending(x => x.Id).AsParallel();
            foreach (var item in contents)
            {
                var category = new TreeViewResource
                {
                    Id = item.Id,
                    Code = item.CatCode,
                    Title = item.CatName,
                    Level = tab,
                    HasChild = data.Any(x => x.CatParent == item.CatCode),
                    ParentCode = item.CatParent,
                };
                lstCategories.Add(category);
                if (category.HasChild) GetSubTreeCategoryData(data, item.CatCode, lstCategories, tab + 1, 1);
            }
            return lstCategories;
        }

        [HttpPost]
        public List<TreeViewResource> GetTreeInNode(string parentId)
        {
            var data = _context.EDMSCategorys.Where(x => x.IsDeleted == false).OrderByDescending(x => x.Id).AsNoTracking();
            var tree = GetSubTreeCategoryData(data.ToList(), parentId, new List<TreeViewResource>(), 0, 2);
            return tree;
        }
        #endregion

        #region Repository
        [HttpPost]
        public List<TreeViewResource> GetTreeRepository()
        {
            //var data = from a in _context.EDMSRepositorys
            //           join b in _context.TokenManagers on a.Token equals b.UserId into b1
            //           from b2 in b1.DefaultIfEmpty()
            //           where (!a.IsDeleted)
            //           select new EDMSRepository
            //           {
            //               ReposID = a.ReposID,
            //               ReposCode = a.ReposCode,
            //               ReposName = a.Type == "SERVER" ? a.ReposName + " (" + a.Server + ")" : a.Type == "DRIVER" ? a.ReposName + " (" + b2.Description + ")" : a.ReposName,
            //               Parent = a.Parent,
            //               Type = a.Type,
            //           };
            var data = _context.EDMSRepositorys.Where(x => x.IsDeleted == false).OrderByDescending(x => x.ReposID).AsNoTracking();
            var dataOrder = GetSubTreeRepositoryData(data.ToList(), null, new List<TreeViewResource>(), 0, 2);
            return dataOrder;
        }

        [HttpPost]
        public JsonResult GetGoogleApiTokens()
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.TokenManagers.Where(x => x.ServiceType == "GOOGLE_ACCOUNT")
                        .Select(x => new
                        {
                            Code = x.AccountCode,
                            Name = x.AccountName,
                        });
                msg.Object = data;
            }
            catch (Exception ex)
            {
                msg.Title = ex.Message;
                msg.Error = true;
            }
            return Json(msg);
        }

        [HttpGet]
        public JsonResult GetItemRepository(string reposCode)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == reposCode);
                if (data != null)
                {
                    var model = new EDMSRepository
                    {
                        ReposID = data.ReposID,
                        ReposName = data.ReposName,
                        Server = data.Server,
                        Account = data.Account,
                        PassWord = data.PassWord,
                        //PathPhysic = data.PathPhysic,
                        Token = data.Token,
                        Type = data.Type,
                        Desc = data.Desc,
                    };
                    msg.Object = model;
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["EDMSR_MSG_SERVER_NOT_EXIST"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex.Message;
                msg.Title = _sharedResources["COM_MSG_ERR"];//"Xóa file lỗi";
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult InsertRepository([FromBody] EDMSRepository obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                obj.Parent = "#";
                obj.ReposCode = string.Concat("RES", DateTime.Now.ToString("ddMMyyyhhmmss"));
                obj.CreatedBy = AppContext.UserName;
                obj.CreatedTime = DateTime.Now;
                _context.EDMSRepositorys.Add(obj);
                _context.SaveChanges();
                msg.Title = _sharedResources["COM_ADD_SUCCESS"];
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
        public JsonResult UpdateRepository([FromBody] EDMSRepository obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposID == obj.ReposID);
                if (data != null)
                {
                    data.ReposName = obj.ReposName;
                    data.Server = obj.Server;
                    data.Account = obj.Account;
                    data.PassWord = obj.PassWord;
                    data.Desc = obj.Desc;
                    //data.PathPhysic = obj.PathPhysic;
                    data.Token = obj.Token;
                    data.Type = obj.Type;
                    data.UpdatedBy = AppContext.UserName;
                    data.UpdatedTime = DateTime.Now;
                    _context.EDMSRepositorys.Update(data);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_UPDATE_SUCCESS"];
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["EDMSR_MSG_SERVER_NOT_EXIST"];
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
        public JsonResult DeleteRepository(string respos)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var res = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == respos && x.IsDeleted == false);
                res.IsDeleted = true;
                _context.EDMSRepositorys.Update(res);
                _context.SaveChanges();
                msg.Title = _sharedResources["COM_DELETE_SUCCESS"];
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex.Message;
                msg.Title = _sharedResources["COM_MSG_ERR"];//"Xóa file lỗi";
            }
            return Json(msg);
        }

        [NonAction]
        private List<TreeViewResource> GetSubTreeRepositoryData(List<EDMSRepository> data, string parentid, List<TreeViewResource> lstCategories, int tab, int typeOrder)
        {
            var contents = string.IsNullOrEmpty(parentid)
                ? (typeOrder == 1 ? data.Where(x => x.Parent == "#").OrderBy(x => x.ReposID).AsParallel() : data.Where(x => x.Parent == "#").OrderByDescending(x => x.ReposID).AsParallel())
                : data.Where(x => x.Parent == parentid).OrderByDescending(x => x.ReposID).AsParallel();
            foreach (var item in contents)
            {
                var category = new TreeViewResource
                {
                    Id = item.ReposID,
                    Code = item.ReposCode,
                    Title = item.ReposName,
                    Level = tab,
                    HasChild = data.Any(x => x.Parent == item.ReposCode),
                    ParentCode = item.Parent,
                    TypeRepos = item.Type,
                };
                lstCategories.Add(category);
                if (category.HasChild) GetSubTreeRepositoryData(data, item.ReposCode, lstCategories, tab + 1, 1);
            }
            return lstCategories;
        }
        #endregion

        #region File
        [HttpPost]
        public object GetContract()
        {
            var contract = _context.PoSaleHeaders.AsParallel().Where(x => !x.IsDeleted).Select(x => new { Code = x.ContractCode, Name = x.Title });
            return contract;
        }

        [HttpGet]
        public JsonResult GetFileImage(int id)
        {
            var msg = new JMessage { Error = false, Title = "" };
            var file = _context.EDMSFiles.FirstOrDefault(x => x.FileID == id);
            if (file != null)
            {
                using (Image image = Image.FromFile(_hostingEnvironment.WebRootPath + file.Url))
                {
                    using (MemoryStream m = new MemoryStream())
                    {
                        image.Save(m, ImageFormat.Png);
                        byte[] imageBytes = m.ToArray();
                        // Convert byte[] to Base64 String
                        string base64String = Convert.ToBase64String(imageBytes);
                        msg.Object = base64String;
                    }
                }
            }
            return Json(msg);
        }

        [HttpPost]
        public object JTableFile([FromBody] JtableFileModel jTablePara)
        {
            int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;
            var listType = new string[] { };
            try
            {
                if (jTablePara.FileType == 1)
                {
                    listType = new[] { ".jpg", ".png", ".tif", ".tiff" };
                }
                else if (jTablePara.FileType == 2)
                {
                    listType = new[] { ".docx", ".doc" };
                }
                else if (jTablePara.FileType == 3)
                {
                    listType = new[] { ".xlsm", ".xlsx", ".xlsb", ".xltx", ".xltm", ".xls", ".xlt", ".xls", ".xml", ".xml", ".xlam", ".xla", ".xlw", ".xlr" };
                }
                else if (jTablePara.FileType == 4)
                {
                    listType = new[] { ".pps", "ppt", ".pptx" };
                }
                else if (jTablePara.FileType == 5)
                {
                    listType = new[] { ".pdf" };
                }
                else if (jTablePara.FileType == 6)
                {
                    listType = new[] { ".txt" };
                }
                var fromDate = !string.IsNullOrEmpty(jTablePara.FromDate) ? DateTime.ParseExact(jTablePara.FromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
                var toDate = !string.IsNullOrEmpty(jTablePara.ToDate) ? DateTime.ParseExact(jTablePara.ToDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;

                //var listFileByUser = _context.FilesShareObjectUsers.Where(x => !x.IsDeleted && x.UserShares.Any(p => p.Code.Equals(User.Identity.Name)))
                //                                                   .Select(p => new FileByUser()
                //                                                   {
                //                                                       FileID = p.FileID,
                //                                                       ListUserShare = p.ListUserShare,
                //                                                       UserShares = p.UserShares
                //                                                   }).ToList();
                //var listFileByUser = new List<FileByUser>();

                var session = HttpContext.GetSessionUser();

                if (!string.IsNullOrEmpty(jTablePara.Content))
                {

                    return JtableWithContent(jTablePara, fromDate, toDate, session, listType, intBeginFor);
                }

                if (!jTablePara.RecentFile)
                {
                    return JTableNotRecent(jTablePara, fromDate, toDate, session, listType, intBeginFor);
                }

                return JTableRecent(jTablePara, fromDate, toDate, session, listType, intBeginFor);
            }
            catch (Exception ex)
            {
                var list = new List<object>();
                var jdata = JTableHelper.JObjectTable(list, jTablePara.Draw, 0, "FileID", "FileName", "FileCode", "FileTypePhysic", "CreatedBy",
                    "CreatedTime", "Tags", "Url", "MimeType", "Id", "ReposName", "CloudFileId", "ServerAddress", "Category", "FolderName",
                    "FileSize", "SizeOfFile", "CatName", "UpdateTime", "MetaDataExt", "FileType", "PackHierarchy", "ZoneHierarchy");
                jdata.Add("err", ex.Message);
                return Json(jdata);
            }
        }
        public class FileByUser
        {
            public string FileID { get; set; }
            public string ListUserShare { get; set; }

            public List<ESEIM.Models.UserShare> UserShares
            {
                get;
                set;
            }
        }


        [NonAction]
        private object JtableWithContent(JtableFileModel jTablePara, DateTime? fromDate, DateTime? toDate, SessionUserLogin session, string[] listType, int intBeginFor)
        {
            var queryLucene = SearchLuceneFile(jTablePara.Content, intBeginFor, jTablePara.Length);
            Console.WriteLine(queryLucene);
            Console.WriteLine(queryLucene.listLucene);
            var fileCodeSequence = string.Join(";", queryLucene.listLucene.Select(x => x.FileCode));
            var listTypeSequence = string.Join(";", listType.Select(x => x));
            Log.Info($"countQueryLucene: ${queryLucene.listLucene.Count()}");
            Log.Info(fileCodeSequence);
            string[] param = { "@PageNo", "@PageSize", "@fromDate", "@toDate", "@Name", "@Tags",
                "@ObjectType", "@ObjectCode", "@UserUpload", "@FileCodeSequence", "@ListTypeSequence"};
            object[] val = { jTablePara.CurrentPage, jTablePara.Length,
                fromDate != null ? (object)fromDate : "", toDate != null ? (object)toDate : "",
                !string.IsNullOrEmpty(jTablePara.Name) ? jTablePara.Name : "",
                !string.IsNullOrEmpty(jTablePara.Tags) ? jTablePara.Tags : "",
                !string.IsNullOrEmpty(jTablePara.ObjectType) ? jTablePara.ObjectType : "",
                !string.IsNullOrEmpty(jTablePara.ObjectCode) ? jTablePara.ObjectCode : "",
                !string.IsNullOrEmpty(jTablePara.UserUpload) ? jTablePara.UserUpload : "",
                fileCodeSequence, listTypeSequence};
            // the code that you want to measure comes here
            DataTable rs = _repositoryService.GetDataTableProcedureSql("P_GET_FILE_EDMS_LUCENE", param, val);
            var queryDataLucene = CommonUtil.ConvertDataTable<EDMSJtableFileModel>(rs);
            var capacity = decimal.Parse(queryDataLucene.FirstOrDefault()?.TotalCapacity ?? "0");
            //var paggingLucene = queryDataLucene.Skip(intBeginFor).Take(jTablePara.Length).ToList();

            var listRecordsPack = _context.RecordsPacks.Where(x => !x.IsDeleted).ToList();
            foreach (var item in queryDataLucene)
            {
                item.FileSize = capacity;
                item.Content = queryLucene.listLucene.FirstOrDefault(x => x.FileCode == item.FileCode)?.Content;
                if (item.IsScan.HasValue && item.IsScan.Value)
                {
                    item.PackHierarchy =
                                !string.IsNullOrEmpty(item.PackCode) ? GetHierarchyPack(listRecordsPack, item.PackCode, "") : "Chưa đóng gói";
                    item.ZoneHierarchy = !string.IsNullOrEmpty(item.PackZoneLocation) ? item.PackZoneLocation : "Chưa xếp"; 
                }
            }

            var totalRow = int.Parse(queryDataLucene.FirstOrDefault()?.TotalRow ?? "0");
            var countLucene = totalRow >= queryLucene.total ? queryLucene.total : totalRow;
            var jData = JTableHelper.JObjectTable(queryDataLucene, jTablePara.Draw, countLucene, "FileID", "FileName", "FileTypePhysic",
                "CreatedBy", "CreatedTime", "Tags", "Url", "Content", "MimeType", "Id", "ReposName", "CloudFileId", "ServerAddress",
                "Category", "FolderName", "FileSize", "SizeOfFile", "CatName", "MetaDataExt", "PackHierarchy", "ZoneHierarchy");
            return Json(jData);
        }

        [NonAction]
        private object JTableNotRecent(JtableFileModel jTablePara, DateTime? fromDate, DateTime? toDate,
            SessionUserLogin session, string[] listType, int intBeginFor)
        {
            var query2 = (from a in _context.EDMSFiles.Where(x => !x.IsDeleted && (x.IsFileMaster == null || x.IsFileMaster == true))
                          join b in _context.EDMSRepoCatFiles on a.FileCode equals b.FileCode
                          join d in _context.EDMSRepositorys on a.ReposCode equals d.ReposCode into d2
                          from d in d2.DefaultIfEmpty()
                          join e in _context.EDMSCategorys.Where(x => !x.IsDeleted) on b.CatCode equals e.CatCode into e1
                          from e in e1.DefaultIfEmpty()
                          join f in _context.RecordsPackFiles.Where(x => !x.IsDeleted) on a.FileCode equals f.FileCode into f1
                          from f in f1.DefaultIfEmpty()
                          join g in _context.RecordsPacks.Where(x => !x.IsDeleted) on f.PackCode equals g.PackCode into g1
                          from g in g1.DefaultIfEmpty()
                          where ((fromDate == null) || (a.CreatedTime.HasValue && a.CreatedTime.Value.Date >= fromDate))
                              && (string.IsNullOrEmpty(jTablePara.UserUpload) || (a.CreatedBy == jTablePara.UserUpload))
                              && ((toDate == null) || (a.CreatedTime.HasValue && a.CreatedTime.Value.Date <= toDate))
                              && (string.IsNullOrEmpty(jTablePara.Name) || a.FileName.ToLower().Contains(jTablePara.Name.ToLower()))
                              && (string.IsNullOrEmpty(jTablePara.Tags) || a.Tags.ToLower().Contains(jTablePara.Tags.ToLower()))
                              && (listType.Length == 0 || (listType.Any(x => x == a.FileTypePhysic)))
                              && (jTablePara.ListRepository.Length != 0 && (jTablePara.ListRepository.Any(x => x == b.CatCode)))
                              && (string.IsNullOrEmpty(jTablePara.ObjectType) || (jTablePara.ObjectType == EnumHelper<All>.GetDisplayValue(All.All)) || b.ObjectType == jTablePara.ObjectType)
                              && (string.IsNullOrEmpty(jTablePara.ObjectCode) || b.ObjectCode == jTablePara.ObjectCode)
                          //&& (listFileByUser.Any(x => x.FileID.Equals(a.FileCode)) || (!string.IsNullOrEmpty(a.CreatedBy) && a.CreatedBy.Equals(User.Identity.Name)) || session.IsAllData)
                          select new { a, b, d, e, f, g });
            var capacity = query2.Sum(x => x.a.FileSize.HasValue ? x.a.FileSize.Value : 0);
            var query = query2.OrderByDescending(x => x.a.FileID).AsNoTracking().Skip(intBeginFor).Take(jTablePara.Length).ToList();

            var count = (from a in _context.EDMSFiles.Where(x => !x.IsDeleted && (x.IsFileMaster == null || x.IsFileMaster == true))
                         join b in _context.EDMSRepoCatFiles on a.FileCode equals b.FileCode
                         where ((fromDate == null) || (a.CreatedTime.HasValue && a.CreatedTime.Value.Date >= fromDate))
                             && (string.IsNullOrEmpty(jTablePara.UserUpload) || (a.CreatedBy == jTablePara.UserUpload))
                             && ((toDate == null) || (a.CreatedTime.HasValue && a.CreatedTime.Value.Date <= toDate))
                             && (string.IsNullOrEmpty(jTablePara.Name) || a.FileName.ToLower().Contains(jTablePara.Name.ToLower()))
                             && (string.IsNullOrEmpty(jTablePara.Tags) || a.Tags.ToLower().Contains(jTablePara.Tags.ToLower()))
                             && (listType.Length == 0 || (listType.Any(x => x == a.FileTypePhysic)))
                             && (jTablePara.ListRepository.Length != 0 && (jTablePara.ListRepository.Any(x => x == b.CatCode)))
                             && (string.IsNullOrEmpty(jTablePara.ObjectType) || (jTablePara.ObjectType == EnumHelper<All>.GetDisplayValue(All.All)) || b.ObjectType == jTablePara.ObjectType)
                             && (string.IsNullOrEmpty(jTablePara.ObjectCode) || b.ObjectCode == jTablePara.ObjectCode)
                         //&& (listFileByUser.Any(x => x.FileID.Equals(a.FileCode)) || (!string.IsNullOrEmpty(a.CreatedBy) && a.CreatedBy.Equals(User.Identity.Name)) || session.IsAllData)
                         select a).AsNoTracking().Count();

            var listRecordsPack = _context.RecordsPacks.Where(x => !x.IsDeleted).ToList();
            //var listRecordsZone = _context.ZoneStructs.Where(x => !x.IsDeleted).ToList();

            var list = query.Select(x => new
            {
                Id = x.b != null ? x.b.Id : -1,
                x.a.FileID,
                x.a.FileCode,
                x.a.FileName,
                x.a.FileTypePhysic,
                x.a.CreatedBy,
                x.a.CreatedTime,
                x.a.Tags,
                x.a.Url,
                x.a.MimeType,
                ReposName = x.d != null ? x.d.ReposName : "",
                x.a.CloudFileId,
                ServerAddress = x.d != null ? x.d.Server : "",
                Category = x.b != null ? x.b.CatCode : "",
                FileSize = capacity,
                SizeOfFile = x.a.FileSize.HasValue ? x.a.FileSize.Value : 0,
                CatName = GetFullPathCategory(x.b.CatCode, "", new List<string>(), false, ""),
                UpdateTime = x.a.EditedFileTime.HasValue ? x.a.EditedFileTime.Value.ToString("dd/MM/yyyy HH:mm:ss") : "",
                x.a.MetaDataExt,
                FileType = x.a.IsScan.HasValue ? (x.a.IsScan.Value ? "Y" : "N") : "N",
                PackHierarchy = x.g != null ? GetHierarchyPack(listRecordsPack, x.g.PackCode, "") : "Chưa đóng gói",
                ZoneHierarchy = x.g != null ? (!string.IsNullOrEmpty(x.g.PackZoneLocation) ? x.g.PackZoneLocation : "Chưa xếp") : "Chưa xếp"
            }).ToList();
            var jdata = JTableHelper.JObjectTable(list, jTablePara.Draw, count, "FileID", "FileName", "FileCode", "FileTypePhysic", "CreatedBy",
                "CreatedTime", "Tags", "Url", "MimeType", "Id", "ReposName", "CloudFileId", "ServerAddress", "Category", "FolderName",
                "FileSize", "SizeOfFile", "CatName", "UpdateTime", "MetaDataExt", "FileType", "PackHierarchy", "ZoneHierarchy");
            return Json(jdata);
        }

        [NonAction]
        private object JTableRecent(JtableFileModel jTablePara, DateTime? fromDate, DateTime? toDate,
            SessionUserLogin session, string[] listType, int intBeginFor)
        {
            var query2 = (from a in _context.EDMSFiles.Where(x => !x.IsDeleted && (x.IsFileMaster == null || x.IsFileMaster == true))
                          join b in _context.EDMSRepoCatFiles on a.FileCode equals b.FileCode
                          join d in _context.EDMSRepositorys on a.ReposCode equals d.ReposCode into d2
                          from d in d2.DefaultIfEmpty()
                          join e in _context.EDMSCategorys.Where(x => !x.IsDeleted) on b.CatCode equals e.CatCode into e1
                          from e in e1.DefaultIfEmpty()
                          join f in _context.RecordsPackFiles.Where(x => !x.IsDeleted) on a.FileCode equals f.FileCode into f1
                          from f in f1.DefaultIfEmpty()
                          join g in _context.RecordsPacks.Where(x => !x.IsDeleted) on f.PackCode equals g.PackCode into g1
                          from g in g1.DefaultIfEmpty()
                          where ((fromDate == null) || (a.CreatedTime.HasValue && a.CreatedTime.Value.Date >= fromDate))
                              && (string.IsNullOrEmpty(jTablePara.UserUpload) || (a.CreatedBy == jTablePara.UserUpload))
                              && ((toDate == null) || (a.CreatedTime.HasValue && a.CreatedTime.Value.Date <= toDate))
                              && (string.IsNullOrEmpty(jTablePara.Name) || a.FileName.ToLower().Contains(jTablePara.Name.ToLower()))
                              && (string.IsNullOrEmpty(jTablePara.Tags) || a.Tags.ToLower().Contains(jTablePara.Tags.ToLower()))
                              && (listType.Length == 0 || (listType.Any(x => x == a.FileTypePhysic)))
                              && ((jTablePara.ListRepository.Length == 0 && a.EditedFileTime >= DateTime.Now.AddDays(-3)) || (jTablePara.ListRepository.Any(x => x == b.CatCode) && a.EditedFileTime >= DateTime.Now.AddDays(-3)))
                              //&& (jTablePara.ListRepository.Length != 0 && (jTablePara.ListRepository.Any(x => x == b.CatCode)))
                              && (string.IsNullOrEmpty(jTablePara.ObjectType) || (jTablePara.ObjectType == EnumHelper<All>.GetDisplayValue(All.All)) || b.ObjectType == jTablePara.ObjectType)
                              && (string.IsNullOrEmpty(jTablePara.ObjectCode) || b.ObjectCode == jTablePara.ObjectCode)
                          //&& (listFileByUser.Any(x => x.FileID.Equals(a.FileCode)) || (!string.IsNullOrEmpty(a.CreatedBy) && a.CreatedBy.Equals(User.Identity.Name)) || session.IsAllData)
                          select new { a, b, d, e, f, g });
            var capacity = query2.Sum(x => x.a.FileSize.Value);
            var query = query2.OrderByDescending(x => x.a.FileID).AsNoTracking().Skip(intBeginFor).Take(jTablePara.Length).ToList();
            var count = (from a in _context.EDMSFiles.Where(x => !x.IsDeleted && (x.IsFileMaster == null || x.IsFileMaster == true))
                         join b in _context.EDMSRepoCatFiles on a.FileCode equals b.FileCode
                         where ((fromDate == null) || (a.CreatedTime.HasValue && a.CreatedTime.Value.Date >= fromDate))
                             && (string.IsNullOrEmpty(jTablePara.UserUpload) || (a.CreatedBy == jTablePara.UserUpload))
                             && ((toDate == null) || (a.CreatedTime.HasValue && a.CreatedTime.Value.Date <= toDate))
                             && (string.IsNullOrEmpty(jTablePara.Name) || a.FileName.ToLower().Contains(jTablePara.Name.ToLower()))
                             && (string.IsNullOrEmpty(jTablePara.Tags) || a.Tags.ToLower().Contains(jTablePara.Tags.ToLower()))
                             && (listType.Length == 0 || (listType.Any(x => x == a.FileTypePhysic)))
                             && ((jTablePara.ListRepository.Length == 0 && a.EditedFileTime >= DateTime.Now.AddDays(-3)) || (jTablePara.ListRepository.Any(x => x == b.CatCode)))
                             //&& (jTablePara.ListRepository.Length != 0 && (jTablePara.ListRepository.Any(x => x == b.CatCode)))
                             && (string.IsNullOrEmpty(jTablePara.ObjectType) || (jTablePara.ObjectType == EnumHelper<All>.GetDisplayValue(All.All)) || b.ObjectType == jTablePara.ObjectType)
                             && (string.IsNullOrEmpty(jTablePara.ObjectCode) || b.ObjectCode == jTablePara.ObjectCode)
                         //&& (listFileByUser.Any(x => x.FileID.Equals(a.FileCode)) || (!string.IsNullOrEmpty(a.CreatedBy) && a.CreatedBy.Equals(User.Identity.Name)) || session.IsAllData)
                         select a).AsNoTracking().Count();
            var listRecordsPack = _context.RecordsPacks.Where(x => !x.IsDeleted).ToList();
            //var listRecordsZone = _context.ZoneStructs.Where(x => !x.IsDeleted).ToList();

            var list = query.Select(x => new
            {
                Id = x.b != null ? x.b.Id : -1,
                x.a.FileID,
                x.a.FileCode,
                x.a.FileName,
                x.a.FileTypePhysic,
                x.a.CreatedBy,
                x.a.CreatedTime,
                x.a.Tags,
                x.a.Url,
                x.a.MimeType,
                ReposName = x.d != null ? x.d.ReposName : "",
                x.a.CloudFileId,
                ServerAddress = x.d != null ? x.d.Server : "",
                Category = x.b != null ? x.b.CatCode : "",
                FileSize = capacity,
                SizeOfFile = x.a.FileSize.HasValue ? x.a.FileSize.Value : 0,
                CatName = x.e != null ? x.e.CatName : "",
                UpdateTime = x.a.EditedFileTime.HasValue ? x.a.EditedFileTime.Value.ToString("dd/MM/yyyy HH:mm:ss") : "",
                x.a.MetaDataExt,
                FileType = x.a.IsScan.HasValue ? (x.a.IsScan.Value ? "Y" : "N") : "N",
                PackHierarchy = x.g != null ? GetHierarchyPack(listRecordsPack, x.g.PackCode, "") : "Chưa đóng gói",
                ZoneHierarchy = x.g != null ? (!string.IsNullOrEmpty(x.g.PackZoneLocation) ? x.g.PackZoneLocation : "Chưa xếp") : "Chưa xếp"
            }).ToList();
            var jdata = JTableHelper.JObjectTable(list, jTablePara.Draw, count, "FileID", "FileName", "FileCode", "FileTypePhysic", "CreatedBy",
                "CreatedTime", "Tags", "Url", "MimeType", "Id", "ReposName", "CloudFileId", "ServerAddress", "Category", "FolderName",
                "FileSize", "SizeOfFile", "CatName", "UpdateTime", "MetaDataExt", "FileType", "PackHierarchy", "ZoneHierarchy");
            return Json(jdata);
        }

        [AllowAnonymous]
        [HttpPost]
        public object CheckPermissionFileNoShare(string fileCode)
        {
            var session = HttpContext.GetSessionUser();
            var listFileByUser = _context.FilesShareObjectUsers
                .Where(x => !x.IsDeleted && x.FileID == fileCode
                                         && x.UserShares.Any(p => p.Code.Equals(User.Identity.Name)))
                .Select(p => new
                {
                    p.FileID,
                    p.ListUserShare,
                    p.UserShares
                }).ToList();
            var file = _context.EDMSFiles.FirstOrDefault(x => !x.IsDeleted && x.FileCode == fileCode);
            return listFileByUser.Any()
                   || (file?.CreatedBy == User.Identity.Name) ||
                   session.IsAllData;
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

        [NonAction]
        private string GetHierarchyZone(List<ZoneStruct> listData, string zoneCode, string hierarchy)
        {
            var obj = listData.FirstOrDefault(x => !x.IsDeleted && x.ZoneCode.Equals(zoneCode));
            if (obj != null)
            {
                if (obj.ZoneParent != null)
                {
                    hierarchy = obj.ZoneCode + (!string.IsNullOrEmpty(hierarchy) ? ("/" + hierarchy) : "");
                    var zoneParent = listData.FirstOrDefault(x => !x.IsDeleted && x.ZoneCode.Equals(obj.ZoneParent));
                    if (zoneParent != null)
                    {
                        hierarchy = zoneParent.ZoneCode + "/" + hierarchy;
                        if (zoneParent.ZoneParent != null)
                        {
                            var child = listData.FirstOrDefault(x => !x.IsDeleted && x.ZoneCode.Equals(zoneParent.ZoneParent));
                            hierarchy = GetHierarchyZone(listData, zoneParent.ZoneParent, hierarchy);
                        }
                    }
                }
                else
                {
                    hierarchy = obj.ZoneCode + (!string.IsNullOrEmpty(hierarchy) ? ("/" + hierarchy) : "");
                }
            }
            else
            {
                return "";
            }

            return hierarchy;
        }

        [NonAction]
        public string GetFullPathCategory(string catCode, string path, List<string> list, bool check, string realPath)
        {
            var category = _context.EDMSCategorys.FirstOrDefault(x => !x.IsDeleted && x.CatCode == catCode);
            if (category != null)
            {
                list.Add(category.CatCode);
                if (!string.IsNullOrEmpty(category.CatParent) && category.CatParent != "#")
                {
                    foreach (var item in list)
                    {
                        if (item == category.CatParent)
                            check = true;
                    }

                    if (!check)
                    {
                        GetFullPathCategory(category.CatParent, path, list, check, "");
                        foreach (var item in list)
                        {
                            var cat = _context.EDMSCategorys.FirstOrDefault(x => !x.IsDeleted && x.CatCode == item);
                            realPath = cat.CatName + "/" + realPath;
                        }
                    }
                }
                else
                {
                    foreach (var item in list)
                    {
                        var cat = _context.EDMSCategorys.FirstOrDefault(x => !x.IsDeleted && x.CatCode == item);
                        realPath = cat.CatName + "/" + realPath;
                    }
                }
            }
            return realPath;
        }

        [HttpGet]
        public object GetTotal()
        {
            var textByte = "";
            var query2 = (from a in _context.EDMSFiles.Where(x => !x.IsDeleted && (x.IsFileMaster == null || x.IsFileMaster == true))
                          join b in _context.EDMSRepoCatFiles on a.FileCode equals b.FileCode
                          join d in _context.EDMSRepositorys on a.ReposCode equals d.ReposCode
                          join e in _context.EDMSCategorys.Where(x => !x.IsDeleted) on b.CatCode equals e.CatCode
                          select new { a });
            var totalFile = query2.Distinct().Count();
            var totalByte = query2.Sum(x => x.a.FileSize.HasValue ? x.a.FileSize.Value : 0);
            var kb = 1024;
            var mb = 1024 * kb;
            var gb = 1024 * mb;
            if (totalByte / gb > 1)
            {
                textByte = Math.Round(totalByte / gb) + " GB";
            }
            else if (totalByte / mb > 1)
            {
                textByte = Math.Round(totalByte / mb) + " MB";
            }
            else if (totalByte / kb > 1)
            {
                textByte = Math.Round(totalByte / kb) + " KB";
            }
            else
            {
                textByte = totalByte + " Byte";
            }
            return new
            {
                TotalFile = totalFile,
                TotalSize = textByte
            };
        }

        [HttpPost]
        public object JTableFileHistory([FromBody] JTableModelFile jTablePara)
        {
            if (jTablePara.FileID == null)
            {
                return JTableHelper.JObjectTable(new List<object>(), jTablePara.Draw, 0, "Id", "FileName", "FileTypePhysic", "Desc", "Url", "CreatedTime", "UpdatedTime", "ReposName", "TypeFile", "IsFileMaster", "EditedFileBy", "EditedFileTime", "FileID");
            }
            int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;
            var fromDate = !string.IsNullOrEmpty(jTablePara.FromDate) ? DateTime.ParseExact(jTablePara.FromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
            var toDate = !string.IsNullOrEmpty(jTablePara.ToDate) ? DateTime.ParseExact(jTablePara.ToDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
            var query = (from a in _context.EDMSRepoCatFiles
                         join b in _context.EDMSFiles.Where(x => !x.IsDeleted && x.FileParentId.Equals(jTablePara.FileID) && (x.IsFileMaster == null || x.IsFileMaster == false)) on a.FileCode equals b.FileCode
                         join f in _context.EDMSRepositorys on a.ReposCode equals f.ReposCode into f1
                         from f in f1.DefaultIfEmpty()
                         select new
                         {
                             a.Id,
                             b.FileCode,
                             b.FileName,
                             b.FileTypePhysic,
                             b.Desc,
                             b.CreatedTime,
                             b.CloudFileId,
                             TypeFile = "NO_SHARE",
                             ReposName = f != null ? f.ReposName : "",
                             b.IsFileMaster,
                             EditedFileBy = _context.Users.FirstOrDefault(x => x.UserName.Equals(b.EditedFileBy)) != null ? _context.Users.FirstOrDefault(x => x.UserName.Equals(b.EditedFileBy)).GivenName : "",
                             b.EditedFileTime,
                         }).AsNoTracking();
            int count = query.Count();
            var data = query.OrderUsingSortExpression(jTablePara.QueryOrderBy).Skip(intBeginFor).Take(jTablePara.Length).AsNoTracking().ToList();
            var jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, count, "Id", "FileCode", "FileName", "FileTypePhysic", "Desc", "CreatedTime", "CloudFileId", "ReposName", "TypeFile", "IsFileMaster", "EditedFileBy", "EditedFileTime");
            return jdata;
        }

        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
        [RequestSizeLimit(long.MaxValue)]
        public JsonResult InsertFile(EDMSRepoCatFileModel obj, IFormFile fileUpload)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var mimeType = fileUpload.ContentType;
                string extension = Path.GetExtension(fileUpload.FileName);
                string urlFile = "";
                string fileId = "";
                var fileSize = fileUpload.Length;
                if ((fileSize / 1048576.0) > 1000)
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["EDMSR_MSG_FILE_SIZE_LIMIT_UPLOAD"];
                    return Json(msg);
                }

                string reposCode = "";
                string catCode = "";
                string path = "";
                string folderId = "";

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
                    msg.Error = true;
                    msg.Title = _stringLocalizer["EDMSR_MSG_CHOOSE_DOC_SAVE"];
                    return Json(msg);
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
                        var urlEnd = HttpUtility.UrlPathEncode("ftp://" + getRepository.Server + urlFile);
                        var urlEndPreventive = HttpUtility.UrlPathEncode("ftp://" + getRepository.Server + urlFilePreventive);
                        var result = FileExtensions.UploadFileToFtpServer(urlEnd, urlEndPreventive, fileBytes, getRepository.Account, getRepository.PassWord);
                        if (result.Status == WebExceptionStatus.ConnectFailure || result.Status == WebExceptionStatus.ProtocolError)
                        {
                            msg.Error = true;
                            msg.Title = _sharedResources["COM_CONNECT_FAILURE"];
                            return Json(msg);
                        }

                        if (result.Status == WebExceptionStatus.Success)
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
                    FileCode = string.Concat("REPOSITORY", Guid.NewGuid().ToString()),
                    ReposCode = reposCode,
                    CatCode = catCode,
                    ObjectCode = obj.ObjectCode,
                    ObjectType = obj.ObjectType,
                    Path = path,
                    FolderId = folderId
                };
                _context.EDMSRepoCatFiles.Add(edmsReposCatFile);

                /// created Index lucene
                if (Array.IndexOf(LuceneExtension.fileMimetypes, mimeType) >= 0 && (Array.IndexOf(LuceneExtension.fileExt, extension.ToUpper()) >= 0))
                {
                    if (!extension.ToUpper().Equals(".ZIP") && !extension.ToUpper().Equals(".RAR"))
                    {
                        var moduleObj = (EDMSCatRepoSetting)_upload.GetPathByModule("DB_LUCENE_INDEX").Object;
                        var luceneCategory = _context.EDMSCategorys.FirstOrDefault(x => x.CatCode == moduleObj.CatCode);

                        LuceneExtension.IndexFile(edmsReposCatFile.FileCode, fileUpload, luceneCategory.PathServerPhysic);
                        //LuceneExtension.PythonIndexFile(PythonFileCode, content, Pathserver);
                    }
                }
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
                    CreatedBy = AppContext.UserName,
                    CreatedTime = DateTime.Now,
                    Url = urlFile,
                    MimeType = mimeType,
                    CloudFileId = fileId,
                    IsScan = obj.IsScan,
                    MetaDataExt = obj.MetaDataExt,
                };
                _context.EDMSFiles.Add(file);

                if (!string.IsNullOrEmpty(obj.RackCode) && obj.IsScan)
                {
                    var filePackCover = new EDMSFilePackCover
                    {
                        FileCode = edmsReposCatFile.FileCode,
                        ObjPackCode = obj.ObjPackCode,
                        RackCode = obj.RackCode,
                        RackPosition = obj.RackPosition,
                        CreatedBy = User.Identity.Name,
                        CreatedTime = DateTime.Now
                    };

                    _context.EDMSFilePackCovers.Add(filePackCover);
                }
                else if(obj.IsScan)
                {
                    var recordPack = new RecordsPack
                    {
                        PackCode = edmsReposCatFile.FileCode,
                        QrCode = edmsReposCatFile.FileCode,
                        PackName = fileUpload.FileName,
                        PackLabel = fileUpload.FileName,
                        PackLevel = "0",
                        PackParent = "",
                        PackHierarchyPath = edmsReposCatFile.FileCode,
                        PackZoneLocation = "",
                        PackType = "PACK_TYPE20221212212424",
                        PackGroup = null,
                        PackStatus = "",
                        PackQuantity = 1,
                        CreatedBy = User.Identity.Name,
                        CreatedTime = DateTime.Now,
                        IsDeleted = false
                    };
                    _context.RecordsPacks.Add(recordPack);
                    var recordPackFile = new RecordsPackFile
                    {
                        FileCode = edmsReposCatFile.FileCode,
                        PackCode = edmsReposCatFile.FileCode,
                        CreatedBy = User.Identity.Name,
                        CreatedTime = DateTime.Now,
                        IsDeleted = false
                    };
                    _context.RecordsPackFiles.Add(recordPackFile);
                }

                _context.SaveChanges();
                msg.Title = _sharedResources["COM_ADD_FILE_SUCCESS"];
                msg.Object = edmsReposCatFile.Id;
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        public class DriveDatas
        {
            public string ListObjString { get; set; }
            public string RepoCode { get; set; }
        }
        [HttpPost]
        public JsonResult InsertDriveFileToDb([FromBody] DriveDatas data)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var listObjString = data.ListObjString;
                var reposCode = data.RepoCode;
                var listObj = JsonConvert.DeserializeObject<List<EDMSRepoCatFileModel>>(listObjString);
                for (int i = 0; i < listObj.Count(); i++)
                {
                    var obj = listObj[i];
                    string catCode = "";
                    string path = "";
                    string folderId = "";

                    var setting = _context.EDMSCatRepoSettings.FirstOrDefault(x => x.Id == obj.CateRepoSettingId);
                    if (setting != null)
                    {
                        path = setting.Path;
                        folderId = setting.FolderId;
                        catCode = setting.CatCode;
                    }
                    else
                    {
                        var category = _context.EDMSCategorys.FirstOrDefault(x => x.Id == obj.CatId);
                        setting = _context.EDMSCatRepoSettings.FirstOrDefault(x => x.CatCode == category.CatCode);
                        path = setting.Path;
                        folderId = setting.FolderId;
                        catCode = setting.CatCode;
                    }
                    var getRepository = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == reposCode);
                    var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == getRepository.Token);
                    if (apiTokenService != null)
                    {
                        var json = apiTokenService.CredentialsJson;
                        var user = apiTokenService.Email;
                        var token = apiTokenService.RefreshToken;
                        var bytes = FileExtensions.DownloadFileGoogle(json, token, obj.FileId, user);
                        string extension = Path.GetExtension(obj.FileName);
                        var edmsReposCatFile = new EDMSRepoCatFile
                        {
                            FileCode = string.Concat("REPOSITORY", Guid.NewGuid().ToString()),
                            ReposCode = reposCode,
                            CatCode = catCode,
                            ObjectCode = obj.ObjectCode,
                            ObjectType = obj.ObjectType,
                            Path = path,
                            FolderId = folderId
                        };
                        _context.EDMSRepoCatFiles.Add(edmsReposCatFile);
                        Stream fileStream = new MemoryStream(bytes);
                        var name = Path.GetFileNameWithoutExtension(obj.FileName);
                        var fileUpload = new FormFile(fileStream, 0, fileStream.Length, name, obj.FileName);
                        if (Array.IndexOf(LuceneExtension.fileMimetypes, obj.MimeType) >= 0 && (Array.IndexOf(LuceneExtension.fileExt, extension.ToUpper()) >= 0))
                        {
                            if (!extension.ToUpper().Equals(".ZIP") && !extension.ToUpper().Equals(".RAR"))
                            {
                                var moduleObj = (EDMSCatRepoSetting)_upload.GetPathByModule("DB_LUCENE_INDEX").Object;
                                var luceneCategory = _context.EDMSCategorys.FirstOrDefault(x => x.CatCode == moduleObj.CatCode);
                                if (luceneCategory != null)
                                    LuceneExtension.IndexFile(edmsReposCatFile.FileCode, fileUpload,
                                        luceneCategory.PathServerPhysic);
                            }
                        }
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
                            CreatedBy = AppContext.UserName,
                            CreatedTime = DateTime.Now,
                            Url = "",
                            MimeType = obj.MimeType,
                            CloudFileId = obj.FileId,
                            IsScan = obj.IsScan,
                            MetaDataExt = obj.MetaDataExt,
                        };
                        _context.EDMSFiles.Add(file);
                    }
                }
                _context.SaveChanges();
                msg.Title = _sharedResources["COM_ADD_FILE_SUCCESS"];
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        [RequestSizeLimit(long.MaxValue)]
        public JsonResult InsertFilePythonFtp(EDMSRepoCatFileModel obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var mimeType = obj.ContentType;
                string extension = Path.GetExtension(obj.FileName);
                string urlFile = "";
                string fileId = "";
                var fileSize = obj.FileLength;
                //if ((fileSize / 1048576.0) > 1000)
                //{
                //    msg.Error = true;
                //    msg.Title = _stringLocalizer["EDMSR_MSG_FILE_SIZE_LIMIT_UPLOAD"];
                //    return Json(msg);
                //}

                if (Array.IndexOf(LuceneExtension.fileMimetypes, mimeType) >= 0 && (Array.IndexOf(LuceneExtension.fileExt, extension.ToUpper()) >= 0))
                {
                    string reposCode = "";
                    string catCode = "";
                    string path = "";
                    string folderId = "";

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
                        msg.Error = true;
                        msg.Title = _stringLocalizer["EDMSR_MSG_CHOOSE_DOC_SAVE"];
                        return Json(msg);
                    }
                    var edmsReposCatFile = new EDMSRepoCatFile
                    {
                        FileCode = string.Concat("REPOSITORY", Guid.NewGuid().ToString()),
                        ReposCode = reposCode,
                        CatCode = catCode,
                        ObjectCode = obj.ObjectCode,
                        ObjectType = obj.ObjectType,
                        Path = path,
                        FolderId = folderId
                    };
                    _context.EDMSRepoCatFiles.Add(edmsReposCatFile);

                    /// created Index lucene
                    //if (!extension.ToUpper().Equals(".ZIP") && !extension.ToUpper().Equals(".RAR"))
                    //{
                    //    var moduleObj = (EDMSCatRepoSetting)_upload.GetPathByModule("DB_LUCENE_INDEX").Object;
                    //    var luceneCategory = _context.EDMSCategorys.FirstOrDefault(x => x.CatCode == moduleObj.CatCode);
                    //    LuceneExtension.IndexFile(edmsReposCatFile.FileCode, fileUpload, luceneCategory.PathServerPhysic);
                    //}
                    //add File
                    var file = new EDMSFile
                    {
                        FileCode = edmsReposCatFile.FileCode,
                        FileName = obj.FileName,
                        Desc = obj.Desc,
                        ReposCode = reposCode,
                        Tags = obj.Tags,
                        FileSize = obj.FileLength,
                        FileTypePhysic = Path.GetExtension(obj.FileName),
                        NumberDocument = obj.NumberDocument,
                        CreatedBy = AppContext.UserName,
                        CreatedTime = DateTime.Now,
                        Url = urlFile,
                        MimeType = mimeType,
                        CloudFileId = fileId,
                        IsScan = obj.IsScan,
                        MetaDataExt = obj.MetaDataExt,
                    };
                    _context.EDMSFiles.Add(file);

                    _context.SaveChanges();
                    //msg.Title = _sharedResources["COM_ADD_FILE_SUCCESS"];
                    //msg.Object = edmsReposCatFile.Id;
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

        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
        [RequestSizeLimit(long.MaxValue)]
        public JsonResult DropFile(EDMSRepoCatFileModel obj, IFormFile fileUpload)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var mimeType = fileUpload.ContentType;
                string extension = Path.GetExtension(fileUpload.FileName);
                string urlFile = "";
                string fileId = "";
                var fileSize = fileUpload.Length;
                if ((fileSize / 1048576.0) > 1000)
                {
                    msg.Error = true;
                    msg.Title = _stringLocalizer["EDMSR_MSG_FILE_SIZE_LIMIT_UPLOAD"];
                    return Json(msg);
                }
                string reposCode = "";
                string catCode = "";
                string path = "";
                string folderId = "";

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
                    var category = _context.EDMSCategorys.FirstOrDefault(x => x.Id == obj.CatId);
                    setting = _context.EDMSCatRepoSettings.FirstOrDefault(x => x.CatCode == category.CatCode);
                    reposCode = setting.ReposCode;
                    path = setting.Path;
                    folderId = setting.FolderId;
                    catCode = setting.CatCode;
                    //msg.Error = true;
                    //msg.Title = _stringLocalizer["EDMSR_MSG_CHOOSE_DOC_SAVE"];
                    //return Json(msg);
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
                        var urlEnd = HttpUtility.UrlPathEncode("ftp://" + getRepository.Server + urlFile);
                        var urlEndPreventive = HttpUtility.UrlPathEncode("ftp://" + getRepository.Server + urlFilePreventive);
                        var result = FileExtensions.UploadFileToFtpServer(urlEnd, urlEndPreventive, fileBytes, getRepository.Account, getRepository.PassWord);
                        if (result.Status == WebExceptionStatus.ConnectFailure || result.Status == WebExceptionStatus.ProtocolError)
                        {
                            msg.Error = true;
                            msg.Title = _sharedResources["COM_CONNECT_FAILURE"];
                            return Json(msg);
                        }

                        if (result.Status == WebExceptionStatus.Success)
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
                    FileCode = string.Concat("REPOSITORY", Guid.NewGuid().ToString()),
                    ReposCode = reposCode,
                    CatCode = catCode,
                    ObjectCode = obj.ObjectCode,
                    ObjectType = obj.ObjectType,
                    Path = path,
                    FolderId = folderId
                };
                _context.EDMSRepoCatFiles.Add(edmsReposCatFile);
                Log.Info("Start Lucene Index");
                /// created Index lucene
                if (Array.IndexOf(LuceneExtension.fileMimetypes, mimeType) >= 0 && (Array.IndexOf(LuceneExtension.fileExt, extension.ToUpper()) >= 0))
                {
                    if (!extension.ToUpper().Equals(".ZIP") && !extension.ToUpper().Equals(".RAR"))
                    {
                        Log.Info("Condition meet");
                        var moduleObj = (EDMSCatRepoSetting)_upload.GetPathByModule("DB_LUCENE_INDEX").Object;
                        var luceneCategory = _context.EDMSCategorys.FirstOrDefault(x => x.CatCode == moduleObj.CatCode);
                        LuceneExtension.IndexFile(edmsReposCatFile.FileCode, fileUpload, luceneCategory.PathServerPhysic);
                    }
                }

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
                    CreatedBy = AppContext.UserName,
                    CreatedTime = DateTime.Now,
                    Url = urlFile,
                    MimeType = mimeType,
                    CloudFileId = fileId,
                    IsScan = obj.IsScan,
                    MetaDataExt = obj.MetaDataExt,
                };
                _context.EDMSFiles.Add(file);

                if (!string.IsNullOrEmpty(obj.RackCode) && obj.IsScan)
                {
                    var filePackCover = new EDMSFilePackCover
                    {
                        FileCode = edmsReposCatFile.FileCode,
                        ObjPackCode = obj.ObjPackCode,
                        RackCode = obj.RackCode,
                        RackPosition = obj.RackPosition,
                        CreatedBy = User.Identity.Name,
                        CreatedTime = DateTime.Now
                    };

                    _context.EDMSFilePackCovers.Add(filePackCover);
                }

                _context.SaveChanges();
                msg.Title = _sharedResources["COM_ADD_FILE_SUCCESS"];
                msg.Object = obj.UUID;
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public object DeleteFile([FromBody] int id)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.EDMSRepoCatFiles.FirstOrDefault(x => x.Id == id);
                _context.EDMSRepoCatFiles.Remove(data);

                var file = _context.EDMSFiles.FirstOrDefault(x => x.FileCode == data.FileCode);
                _context.EDMSFiles.Remove(file);

                LuceneExtension.DeleteIndexFile(file.FileCode, _hostingEnvironment.WebRootPath + "\\uploads\\luceneIndex");
                var getRepository = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == data.ReposCode);
                if (getRepository != null)
                {
                    if (getRepository.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server))
                    {
                        var urlEnd = HttpUtility.UrlPathEncode("ftp://" + getRepository.Server + file.Url);
                        FileExtensions.DeleteFileFtpServer(urlEnd, getRepository.Account, getRepository.PassWord);
                    }
                    else if (getRepository.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.GooglerDriver))
                    {
                        var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == getRepository.Token);
                        var json = apiTokenService.CredentialsJson;
                        var user = apiTokenService.Email;
                        var token = apiTokenService.RefreshToken;
                        FileExtensions.DeleteFileGoogleServer(json, token, file.CloudFileId, user);
                    }
                }
                _context.SaveChanges();
                msg.Title = String.Format(_sharedResources["COM_MSG_DELETE_SUCCESS"], _stringLocalizer[""]);// "Xóa thành công";
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex.Message;
                msg.Title = _sharedResources["COM_MSG_ERR"];//"Xóa file lỗi";
            }
            return msg;
        }

        [HttpGet]
        public IActionResult DownloadFile(string fileCode)
        {
            var obj = _context.EDMSRepoCatFiles.FirstOrDefault(x => x.FileCode == fileCode);
            var file = _context.EDMSFiles.FirstOrDefault(x => x.FileCode == fileCode && !x.IsDeleted);
            if (obj != null)
            {
                var repository = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == obj.ReposCode);
                if (repository != null)
                {
                    if (repository.Type == "SERVER")
                    {
                        string ftphost = repository.Server;
                        string ftpfilepath = file.Url;
                        var urlEnd = HttpUtility.UrlPathEncode("ftp://" + ftphost + ftpfilepath);
                        using (WebClient request = new WebClient())
                        {
                            request.Credentials = new NetworkCredential(repository.Account, repository.PassWord);
                            byte[] fileData = request.DownloadData(urlEnd);
                            return File(fileData, file.MimeType, string.Concat(file.FileName, file.FileTypePhysic));
                        }
                    }

                    {
                        var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == repository.Token);
                        var json = apiTokenService.CredentialsJson;
                        var user = apiTokenService.Email;
                        var token = apiTokenService.RefreshToken;
                        var fileData = FileExtensions.DownloadFileGoogle(json, token, file.CloudFileId, user);
                        return File(fileData, file.MimeType, string.Concat(file.FileName, file.FileTypePhysic));
                    }
                }

                return null;
            }

            return null;
        }

        [HttpPost]
        public JsonResult CreateTempFile(int Id, bool isSearch, string content)
        {
            JMessage msg = new JMessage { Error = false };
            var data = (from a in _context.EDMSRepoCatFiles.Where(x => x.Id == Id)
                        join b in _context.EDMSRepositorys on a.ReposCode equals b.ReposCode into b2
                        from b in b2.DefaultIfEmpty()
                        join c in _context.EDMSFiles on a.FileCode equals c.FileCode into c2
                        from c in c2.DefaultIfEmpty()
                        select new
                        {
                            a.Id,
                            Server = (b != null ? b.Server : null),
                            Token = (b != null ? b.Token : null),
                            Type = (b != null ? b.Type : null),
                            Url = (c != null ? c.Url : null),
                            FileId = (c != null ? c.CloudFileId : null),
                            c.FileTypePhysic,
                            c.FileName,
                            c.MimeType,
                            b.Account,
                            b.PassWord,
                            c.FileCode
                        }
                        ).FirstOrDefault();
            if (data != null)
            {
                var fileTempName = "File_temp" + Path.GetExtension(data.FileName);

                if (!string.IsNullOrEmpty(data.Server))
                {
                    string ftphost = data.Server;
                    string ftpfilepath = data.Url;
                    var urlEnd = HttpUtility.UrlPathEncode("ftp://" + ftphost + ftpfilepath);
                    using (WebClient request = new WebClient())
                    {
                        request.Credentials = new NetworkCredential(data.Account, data.PassWord);
                        byte[] fileData = request.DownloadData(urlEnd);
                        JMessage msg1 = _upload.UploadFileByBytes(fileData, fileTempName, _hostingEnvironment.WebRootPath, "uploads\\tempFile");
                        string path = msg1.Object.ToString();
                        //if (Array.IndexOf(excel, data.FileTypePhysic.ToUpper()) >= 0 || Array.IndexOf(word, data.FileTypePhysic.ToUpper()) >= 0)
                        //    path = ConvertToPdf(path, data.FileTypePhysic);
                        if (isSearch)
                        {
                            List<string> arr = new List<string>();
                            arr.Add(content);
                            if (Array.IndexOf(word, data.FileTypePhysic.ToUpper()) >= 0)
                            {
                                UpdateFileWord(path, arr, data.FileTypePhysic);
                            }
                            else if (Array.IndexOf(excel, data.FileTypePhysic.ToUpper()) >= 0)
                            {
                                UpdateFileExcel(path, arr, data.FileTypePhysic.ToUpper());
                            }
                            else if (Array.IndexOf(pdf, data.FileTypePhysic.ToUpper()) >= 0)
                            {
                                UpdateFilePdf(path, arr, data.FileTypePhysic.ToUpper());
                            }
                        }

                        msg1.Object = path.Replace("\\", "/");
                        return Json(msg1);
                    }
                }

                {
                    var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == data.Token);
                    var json = apiTokenService.CredentialsJson;
                    var user = apiTokenService.Email;
                    var token = apiTokenService.RefreshToken;
                    byte[] fileData = FileExtensions.DownloadFileGoogle(json, token, data.FileId, user);
                    JMessage msg1 = _upload.UploadFileByBytes(fileData, fileTempName, _hostingEnvironment.WebRootPath, "uploads\\tempFile");
                    string path = msg1.Object.ToString();
                    if (isSearch)
                    {
                        List<string> arr = new List<string>();
                        arr.Add(content);
                        if (Array.IndexOf(word, data.FileTypePhysic.ToUpper()) >= 0)
                        {
                            UpdateFileWord(path, arr, data.FileTypePhysic);
                        }
                        else if (Array.IndexOf(excel, data.FileTypePhysic.ToUpper()) >= 0)
                        {
                            UpdateFileExcel(path, arr, data.FileTypePhysic.ToUpper());
                        }
                        else if (Array.IndexOf(pdf, data.FileTypePhysic.ToUpper()) >= 0)
                        {
                            UpdateFilePdf(path, arr, data.FileTypePhysic.ToUpper());
                        }
                    }

                    msg1.Object = path.Replace("\\", "/");
                    return Json(msg1);
                }
            }
            return Json(msg);
        }

        [NonAction]
        private string ConvertToPdf(string pathFile, string type)
        {
            if (Array.IndexOf(excel, type.ToUpper()) >= 0)
                return ConvertExcelToPdf(pathFile);
            if (Array.IndexOf(word, type.ToUpper()) >= 0)
                return ConvertWordToPdf(pathFile);
            return null;
        }

        [NonAction]
        private string ConvertExcelToPdf(string pathFile)
        {
            var path = Path.Combine(_hostingEnvironment.WebRootPath, pathFile);
            //using (ExcelEngine excelEngine = new ExcelEngine())
            //{
            //    IApplication application = excelEngine.Excel;
            //    FileStream excelStream = new FileStream(path, FileMode.Open, FileAccess.Read);
            //    IWorkbook workbook = application.Workbooks.Open(excelStream);
            //    //Initialize XlsIO renderer.
            //    XlsIORenderer renderer = new XlsIORenderer();
            //    //Convert Excel document into PDF document 
            //    PdfDocument pdfDocument = renderer.ConvertToPDF(workbook);
            //    Stream stream = new FileStream(path + ".pdf", FileMode.Create, FileAccess.ReadWrite);
            //    pdfDocument.Save(stream);
            //    excelStream.Dispose();
            //    stream.Dispose();
            //}
            return pathFile + ".pdf";
        }

        [NonAction]
        private string ConvertWordToPdf(string pathFile)
        {
            try
            {
                //var path = Path.Combine(_hostingEnvironment.WebRootPath, pathFile);
                //FileStream docStream = new FileStream(path, FileMode.Open, FileAccess.Read);
                //WordDocument wordDocument = new WordDocument(docStream, Syncfusion.DocIO.FormatType.Automatic);
                //DocIORenderer render = new DocIORenderer();
                //render.Settings.ChartRenderingOptions.ImageFormat = Syncfusion.OfficeChart.ExportImageFormat.Jpeg;
                //PdfDocument pdfDocument = render.ConvertToPDF(wordDocument);
                //render.Dispose();
                //wordDocument.Dispose();
                ////Saves the PDF file
                //FileStream pdfStream = new FileStream(path + ".pdf", FileMode.Create, FileAccess.Write);
                ////MemoryStream outputStream = new MemoryStream();
                //pdfDocument.Save(pdfStream);
                //pdfStream.Close();
                //docStream.Close();
                //pdfDocument.Close();
                return pathFile + ".pdf";
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }

        [NonAction]
        private void UpdateFileWord(string pathFile, List<string> words, string type)
        {
            WordDocument document1 = new WordDocument();


            FileStream fileStream = null;
            Syncfusion.DocIO.DLS.WordDocument document = null;
            try
            {
                var path = Path.Combine(_hostingEnvironment.WebRootPath, pathFile);
                fileStream = new FileStream(path, FileMode.Open, FileAccess.ReadWrite);



                document = new Syncfusion.DocIO.DLS.WordDocument(fileStream, FormatType.Automatic);
                foreach (var item in words)
                {

                    TextSelection[] textSelections = document.FindAll(item, false, true);
                    foreach (TextSelection textSelection in textSelections)
                    {
                        WTextRange textRange = textSelection.GetAsOneRange();
                        Console.WriteLine(textSelection.SelectedText);
                        Console.WriteLine(textSelection.Count);
                        //textSelection Info data Non_public Member . 
                        var allProps = textSelection.GetType().GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).OrderBy(pi => pi.Name).ToList();
                        var allFields = textSelection.GetType().GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).OrderBy(pi => pi.Name).ToList();

                        // TextRange Info data Non_public Member . Position_Index
                        var RangeAllProps = textRange.GetType().GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).OrderBy(pi => pi.Name).ToList();
                        var RangeAllFields = textRange.GetType().GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).OrderBy(pi => pi.Name).ToList();
                        var EndPos = RangeAllProps[5].GetValue(textRange);
                        var StartPos = RangeAllProps[25].GetValue(textRange);
                        var TextLength = RangeAllProps[27].GetValue(textRange);
                        var StringText = RangeAllProps[26].GetValue(textRange);
                        var Index = RangeAllFields[0].GetValue(textRange);

                        //end posision 
                        textRange.CharacterFormat.HighlightColor = Color.Yellow;
                    }
                }
                if (type.ToLower().Contains(".docx"))
                    document.Save(fileStream, FormatType.Docx);
                else
                    document.Save(fileStream, FormatType.Doc);
                fileStream.Flush();
                fileStream.Close();
                document.Close();
            }
            catch (Exception ex)
            {
                if (fileStream != null)
                    fileStream.Close();
                if (document != null)
                {
                    document.Close();
                }
            }
        }
        [NonAction]
        private void UpdateFileWord1(string Stringtext, List<string> words, string type)
        {
            var pathFile = "uploads\\tempFile\\Finaldemo_1eaff62d.docx";
            FileStream fileStream = null;
            Syncfusion.DocIO.DLS.WordDocument document = null;
            try
            {
                var path = Path.Combine(_hostingEnvironment.WebRootPath, pathFile);
                fileStream = new FileStream(path, FileMode.Open, FileAccess.ReadWrite);



                document = new Syncfusion.DocIO.DLS.WordDocument(fileStream, FormatType.Automatic);
                foreach (var item in words)
                {

                    TextSelection[] textSelections1 = document.FindAll(item, false, true);
                    foreach (TextSelection textSelection1 in textSelections1)
                    {
                        WTextRange textRange = textSelection1.GetAsOneRange();
                        WTextRange[] textRange1 = textSelection1.GetRanges();
                        var allProps1 = textSelection1.GetType().GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).OrderBy(pi => pi.Name).ToList();
                        var allFields1 = textSelection1.GetType().GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).OrderBy(pi => pi.Name).ToList();



                        var allProps2 = textRange.GetType().GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).OrderBy(pi => pi.Name).ToList();
                        var allFields2 = textRange.GetType().GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).OrderBy(pi => pi.Name).ToList();
                        //var allProps3 = textRange.GetType().Get(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).OrderBy(pi => pi.Name).ToList();
                        var EndPos = allProps2[5].GetValue(textRange);
                        var StartPos = allProps2[25].GetValue(textRange);
                        var TextLength = allProps2[27].GetValue(textRange);
                        var StringText = allProps2[26].GetValue(textRange);
                        var Index = allFields2[0].GetValue(textRange);
                        textRange.CharacterFormat.HighlightColor = Color.Yellow;
                    }
                }
                if (type.ToLower().Contains(".docx"))
                    document.Save(fileStream, FormatType.Docx);
                else
                    document.Save(fileStream, FormatType.Doc);
                fileStream.Flush();
                fileStream.Close();
                document.Close();
            }
            catch (Exception ex)
            {
                if (fileStream != null)
                    fileStream.Close();
                if (document != null)
                {
                    document.Close();
                }
            }
        }
        [NonAction]
        private void UpdateFilePdf1(string pathFile, List<string> words, string type)
        {

        }

        [NonAction]
        private void UpdateFilePdf(string pathFile, List<string> words, string type)
        {

            var path = Path.Combine(_hostingEnvironment.WebRootPath, pathFile);
            var document = new Document(path);
            var pages = document.Pages;
            for (var i = 1; i <= pages.Count(); ++i)
            {
                try
                {
                    var item = pages[i];
                    var tfa = new TextFragmentAbsorber(words[0], new Aspose.Pdf.Text.TextSearchOptions(false));
                    tfa.Visit(item);

                    foreach (var textFragment in tfa.TextFragments)
                    {

                        var highlightAnnotation = HighLightTextFragment(item, textFragment);
                        item.Annotations.Add(highlightAnnotation);

                    }
                }
                catch (Exception ex)
                {

                }

            }
            //foreach (var item in pages)
            //{
            //    try
            //    {
            //        var tfa = new TextFragmentAbsorber(words[0], new Aspose.Pdf.Text.TextSearchOptions(false));
            //        tfa.Visit(item);

            //        foreach (var textFragment in tfa.TextFragments)
            //        {

            //            var highlightAnnotation = HighLightTextFragment(item, textFragment);
            //            item.Annotations.Add(highlightAnnotation);

            //        }
            //    }
            //    catch (Exception ex)
            //    {

            //    }
            //}
            document.Save(path);
        }

        [NonAction]
        private void UpdateFileExcel(string pathFile, List<string> words, string type)
        {
            var path = Path.Combine(_hostingEnvironment.WebRootPath, pathFile);
            using (ExcelEngine excelEngine = new ExcelEngine())
            {
                IApplication application = excelEngine.Excel;
                FileStream fileStream = new FileStream(path, FileMode.Open, FileAccess.ReadWrite);
                IWorkbook workbook = application.Workbooks.Open(fileStream);
                IStyle tableHeader = workbook.Styles.Add("" + DateTime.Now.Ticks);
                tableHeader.Font.Color = ExcelKnownColors.Black;
                tableHeader.Font.Bold = true;
                //tableHeader.Font.Size = 11;
                //tableHeader.Font.FontName = "Calibri";
                //tableHeader.HorizontalAlignment = ExcelHAlign.HAlignCenter;
                //tableHeader.VerticalAlignment = ExcelVAlign.VAlignCenter;
                tableHeader.Color = Color.Yellow;
                //tableHeader.Borders[ExcelBordersIndex.EdgeLeft].LineStyle = ExcelLineStyle.None;
                //tableHeader.Borders[ExcelBordersIndex.EdgeRight].LineStyle = ExcelLineStyle.None;
                //tableHeader.Borders[ExcelBordersIndex.EdgeTop].LineStyle = ExcelLineStyle.None;
                //tableHeader.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.None;
                //tableHeader.Borders[ExcelBordersIndex.EdgeBottom].LineStyle = ExcelLineStyle.None;

                try
                {
                    foreach (var worksheet in workbook.Worksheets)
                    {
                        IRange[] result1 = worksheet.FindAll(words[0], ExcelFindType.Text);
                        if (result1 != null && result1.Length > 0)
                            foreach (var item in result1)
                            {
                                try
                                {
                                    if (item.DisplayText.ToLower() == words[0].ToLower())
                                    {
                                        IStyle style = item.CellStyle;
                                        if (style == null)
                                        {
                                            style = tableHeader;
                                        }
                                        else
                                        {
                                            style.Font.Color = ExcelKnownColors.Black;
                                            style.Color = Color.Yellow;
                                        }
                                        worksheet.Range[item.AddressLocal].CellStyle = style;
                                    }
                                }
                                catch (Exception exex)
                                {
                                    var bug = "";
                                }
                            }
                    }
                    fileStream.Close();
                    fileStream = null;
                    fileStream = new FileStream(path, FileMode.Open, FileAccess.ReadWrite);
                    workbook.SaveAs(fileStream);
                    fileStream.Dispose();
                    workbook.Close();
                }
                catch (Exception ex)
                {
                    fileStream.Close();
                    workbook.Close();
                    throw ex;
                }
            }
        }

        [NonAction]
        private HighlightAnnotation HighLightTextFragment(Page page, TextFragment textFragment)
        {
            if (textFragment.Segments.Count == 1)
                return new HighlightAnnotation(page, textFragment.Segments[1].Rectangle);

            var offset = 0;
            var quadPoints = new Point[textFragment.Segments.Count * 4];
            foreach (var segment in textFragment.Segments)
            {
                quadPoints[offset + 0] = new Point(segment.Rectangle.LLX, segment.Rectangle.URY);
                quadPoints[offset + 1] = new Point(segment.Rectangle.URX, segment.Rectangle.URY);
                quadPoints[offset + 2] = new Point(segment.Rectangle.LLX, segment.Rectangle.LLY);
                quadPoints[offset + 3] = new Point(segment.Rectangle.URX, segment.Rectangle.LLY);
                offset += 4;
            }

            var llx = quadPoints.Min(pt => pt.X);
            var lly = quadPoints.Min(pt => pt.Y);
            var urx = quadPoints.Max(pt => pt.X);
            var ury = quadPoints.Max(pt => pt.Y);
            return new HighlightAnnotation(page, new Rectangle(llx, lly, urx, ury))
            {
                Modified = DateTime.Now,
                QuadPoints = quadPoints
            };
        }

        [HttpPost]
        public JsonResult GetSupportCategory(string CatCode)
        {
            JMessage msg = new JMessage { Error = false };
            try
            {
                var data = _context.EDMSRepoCatFiles.Where(x => x.ObjectCode == null && x.ObjectType == null && x.CatCode == CatCode).MaxBy(x => x.Id);
                if (data != null)
                {
                    var dt = _context.EDMSCatRepoSettings.FirstOrDefault(x => x.Path == data.Path && x.ReposCode == data.ReposCode && x.CatCode == CatCode);
                    msg.Object = dt;
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
        public object GetItem(int Id)
        {
            var data = (from a in _context.EDMSRepoCatFiles.Where(x => x.Id == Id)
                        join b in _context.EDMSRepositorys on a.ReposCode equals b.ReposCode into b2
                        from b in b2.DefaultIfEmpty()
                        join c in _context.EDMSFiles on a.FileCode equals c.FileCode into c2
                        from c in c2.DefaultIfEmpty()
                        select new
                        {
                            a.Id,
                            Server = (b != null ? b.Server : null),
                            Token = (b != null ? b.Token : null),
                            Type = (b != null ? b.Type : null),
                            Url = (c != null ? c.Url : null),
                            FileId = (c != null ? c.CloudFileId : null),
                            c.FileTypePhysic,
                            c.FileName,
                            c.MimeType,
                            b.Account,
                            b.PassWord,
                            c.FileCode,
                            c.IsEdit,
                            c.IsFileMaster,
                            c.FileParentId
                        }).FirstOrDefault();

            var aseanDoc = new AseanDocument();
            if (data != null)
            {
                if (!string.IsNullOrEmpty(data.Server))
                {
                    string ftphost = data.Server;
                    string ftpfilepath = data.Url;
                    var urlEnd = HttpUtility.UrlPathEncode("ftp://" + ftphost + ftpfilepath);
                    using (WebClient request = new WebClient())
                    {
                        request.Credentials = new NetworkCredential(data.Account, data.PassWord);
                        byte[] fileData = request.DownloadData(urlEnd);
                        JMessage msg1 = _upload.UploadFileByBytes(fileData, data.FileName, _hostingEnvironment.WebRootPath, "uploads\\tempFile");
                        string path = msg1.Object.ToString();
                        string pathConvert = "/" + path.Replace("\\", "/");
                        var extension = Path.GetExtension(path);
                        aseanDoc.File_Code = data.FileCode;
                        aseanDoc.File_Name = data.FileName;
                        aseanDoc.File_Type = data.FileTypePhysic;
                        aseanDoc.File_Path = path;
                        aseanDoc.FullPathView = ftpfilepath;
                        aseanDoc.IsEdit = data.IsEdit;
                        aseanDoc.IsFileMaster = data.IsFileMaster;
                        aseanDoc.FileParentId = data.FileParentId;

                        if (extension.Equals(".doc") || extension.Equals(".docx"))
                        {
                            DocmanController.docmodel = aseanDoc;
                        }
                        else if (extension.Equals(".xls") || extension.Equals(".xlsx"))
                        {
                            ExcelController.pathFileFTP = pathConvert;
                            ExcelController.docmodel = aseanDoc;
                        }
                        else if (extension.Equals(".pdf"))
                        {
                            PDFController.docmodel = aseanDoc;
                        }
                    }
                }
                else
                {
                    var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == data.Token);
                    var json = apiTokenService.CredentialsJson;
                    var user = apiTokenService.Email;
                    var token = apiTokenService.RefreshToken;
                    byte[] fileData = FileExtensions.DownloadFileGoogle(json, token, data.FileId, user);
                    JMessage msg1 = _upload.UploadFileByBytes(fileData, data.FileName, _hostingEnvironment.WebRootPath, "uploads\\tempFile");
                    string path = msg1.Object.ToString();
                    aseanDoc.File_Code = data.FileCode;
                    aseanDoc.File_Name = data.FileName;
                    aseanDoc.File_Type = data.FileTypePhysic;
                    aseanDoc.File_Path = path;
                    aseanDoc.IsEdit = data.IsEdit;
                    aseanDoc.IsFileMaster = data.IsFileMaster;
                    aseanDoc.FileParentId = data.FileParentId;
                    //DocmanController.docmodel = aseanDoc;
                    //ExcelController.docmodel = aseanDoc;
                    //PDFController.docmodel = aseanDoc;
                    var extension = Path.GetExtension(path);
                    if (extension.Equals(".doc") || extension.Equals(".docx"))
                    {
                        DocmanController.docmodel = aseanDoc;
                    }
                    else if (extension.Equals(".xls") || extension.Equals(".xlsx"))
                    {
                        ExcelController.docmodel = aseanDoc;
                    }
                    else if (extension.Equals(".pdf"))
                    {
                        PDFController.docmodel = aseanDoc;
                    }
                }
            }
            return aseanDoc;
        }

        [HttpGet]
        public object GetItemFile(int Id, bool? IsEdit, int mode)
        {
            //Kiểm tra trạng thái của file đang mở
            //TH1: Nếu đang ở trạng thái bị lock(IsEdit=false) thì thông báo cho người dùng là không được phép sửa file
            //TH2: Nếu trạng thái không bị lock(IsEdit=null hoặc IsEdit=true) thì cập nhật IsEdit=false và EditedFileTime, EditedFileBy
            var msg = new JMessage { Error = false };
            try
            {
                var data = (from a in _context.EDMSRepoCatFiles.Where(x => x.Id == Id)
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
                                Url = (c != null ? c.Url : null),
                                FileId = (c != null ? c.CloudFileId : null),
                                c.FileTypePhysic,
                                c.FileName,
                                c.MimeType,
                                b.Account,
                                b.PassWord,
                                c.FileCode,
                                c.IsEdit,
                                c.IsFileMaster,
                                c.IsFileOrigin,
                                c.FileParentId,
                                c.FileID,
                                c.ListUserView
                            }).FirstOrDefault();

                var aseanDoc = new AseanDocument();
                if (data != null)
                {
                    var edmsFile = _context.EDMSFiles.FirstOrDefault(x => x.FileID.Equals(data.FileID));
                    if (edmsFile.IsFileOrigin == false)
                    {
                        var originFile = _context.EDMSFiles.FirstOrDefault(x => x.FileID.Equals(edmsFile.FileParentId));
                        var fileRepo = _context.EDMSRepoCatFiles.FirstOrDefault(x => x.FileCode == originFile.FileCode);
                        var fileNew = string.Concat(Path.GetFileNameWithoutExtension(edmsFile.FileName), "_", Guid.NewGuid().ToString().Substring(0, 8), Path.GetExtension(edmsFile.FileName));
                        var byteData = DownloadFileFromServer(fileRepo.Id);
                        var urlUpload = UploadFileToServer(byteData, fileRepo.ReposCode, fileRepo.CatCode, fileNew, edmsFile.MimeType);

                        if (urlUpload.Error)
                        {
                            msg = urlUpload;
                            return Json(msg);
                        }

                        if (data.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server))
                        {
                            edmsFile.Url = urlUpload.Object.ToString();
                        }
                        else
                        {
                            edmsFile.CloudFileId = urlUpload.Object.ToString();
                        }
                        edmsFile.IsFileOrigin = true;
                    }
                    var session = HttpContext.GetSessionUser();
                    var listUserEdit = new List<string>();
                    if (string.IsNullOrEmpty(data.ListUserView) && (data.IsFileMaster == true || data.IsFileMaster == null))
                    {
                        listUserEdit.Add(session.FullName);
                        edmsFile.ListUserView = JsonConvert.SerializeObject(listUserEdit);
                        edmsFile.EditedFileBy = User.Identity.Name;
                        edmsFile.EditedFileTime = DateTime.Now;
                        _context.EDMSFiles.Update(edmsFile);
                        _context.SaveChanges();
                    }
                    else if (!string.IsNullOrEmpty(data.ListUserView) && (data.IsFileMaster == true || data.IsFileMaster == null))
                    {
                        var check = JsonConvert.DeserializeObject<List<string>>(data.ListUserView);
                        if (data.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server))
                        {
                            msg.ID = -1;
                            msg.Error = true;
                            msg.Title = string.Format(_stringLocalizer["EDMSR_MSG_FILE_IS_EDITING_BY"], string.Join(",", check));
                        }
                        if (!check.Any(x => x.Equals(session.FullName)))
                        {
                            check.Add(session.FullName);
                            edmsFile.ListUserView = JsonConvert.SerializeObject(check);
                            edmsFile.EditedFileBy = User.Identity.Name;
                            edmsFile.EditedFileTime = DateTime.Now;
                            _context.EDMSFiles.Update(edmsFile);
                            _context.SaveChanges();
                        }
                    }
                    else
                    {
                        _context.EDMSFiles.Update(edmsFile);
                        _context.SaveChanges();
                    }

                    var fileTempName = "File_temp" + Path.GetExtension(data.FileName);

                    if (data.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server))
                    {
                        string ftphost = data.Server;
                        string ftpfilepath = data.Url;
                        var urlEnd = HttpUtility.UrlPathEncode("ftp://" + ftphost + ftpfilepath);
                        using (WebClient request = new WebClient())
                        {
                            request.Credentials = new NetworkCredential(data.Account, data.PassWord);
                            byte[] fileData = request.DownloadData(urlEnd);
                            JMessage msg1 = _upload.UploadFileByBytes(fileData, fileTempName, _hostingEnvironment.WebRootPath, "uploads\\tempFile");
                            string path = msg1.Object.ToString();
                            string pathConvert = "/" + path.Replace("\\", "/");
                            var extension = Path.GetExtension(path);
                            aseanDoc.File_Code = data.FileCode;
                            aseanDoc.File_Name = data.FileName;
                            aseanDoc.File_Type = data.FileTypePhysic;
                            aseanDoc.File_Path = pathConvert;
                            aseanDoc.FullPathView = ftpfilepath;
                            aseanDoc.IsEdit = data.IsEdit;
                            aseanDoc.IsFileMaster = data.IsFileMaster;
                            aseanDoc.FileParentId = data.FileParentId;
                            aseanDoc.Mode = mode;
                            aseanDoc.FirstPage = "/Admin/EDMSRepository";

                            if (extension.Equals(".doc") || extension.Equals(".docx"))
                            {
                                DocmanController.docmodel = aseanDoc;
                                DocmanController.pathFile = "";
                            }
                            else if (extension.Equals(".xls") || extension.Equals(".xlsx"))
                            {
                                ExcelController.pathFileFTP = pathConvert;
                                ExcelController.docmodel = aseanDoc;
                                ExcelController.fileCode = data.FileCode;
                                ExcelController.pathFile = "";
                            }
                            else if (extension.Equals(".pdf"))
                            {
                                PDFController.docmodel = aseanDoc;
                                PDFController.pathFile = "";
                            }
                        }
                    }
                    else
                    {
                        var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == data.Token);
                        var json = apiTokenService.CredentialsJson;
                        var user = apiTokenService.Email;
                        var token = apiTokenService.RefreshToken;
                        var link = FileExtensions.OpenFileGoogle(json, token, edmsFile.CloudFileId, user);
                        msg.Object = new
                        {
                            Type = "DRIVER",
                            Link = link,
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _stringLocalizer["EDMSR_MSG_FILE_NOT_EXIST"];
                return Json(msg);
            }

            return Json(msg);
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

        //[HttpPost]
        //public JsonResult GetAllContract()
        //{
        //    JMessage msg = new JMessage() { Error = false };
        //    try
        //    {
        //        var queryCus = from a in _context.PoSaleHeaders.Where(x => x.IsDeleted == false)
        //                       select new
        //                       {
        //                           Id = a.ContractHeaderID,
        //                           ContractCode = a.ContractCode,
        //                           Code = a.ContractCode,
        //                           Name = a.Title,
        //                           Type = "Customer",
        //                           a.CreatedTime
        //                       };
        //        //var querySup = from a in _context.PoBuyerHeaders.Where(x => x.IsDeleted == false)
        //        //               select new
        //        //               {
        //        //                   Id = a.Id,
        //        //                   ContractCode = a.PoSupCode,
        //        //                   Code = a.PoSupCode,
        //        //                   Name = a.PoSupCode,
        //        //                   Type = "Suppiler",
        //        //                   a.CreatedTime
        //        //               };
        //        //var list = queryCus.Union(querySup).OrderByDescending(x => x.CreatedTime).ToList();
        //        msg.Object = queryCus.ToList();
        //    }
        //    catch (Exception ex)
        //    {
        //        msg.Object = ex.Message;
        //        msg.Error = true;
        //        msg.Title = "Có lỗi khi lấy dữ liệu";
        //    }
        //    return Json(msg);
        //}

        //[HttpPost]
        //public JsonResult GetAllCustomer()
        //{
        //    JMessage msg = new JMessage() { Error = false };
        //    try
        //    {
        //        var queryCus = from a in _context.Customerss.Where(x => x.IsDeleted == false)
        //                       select new
        //                       {
        //                           Id = a.CusID,
        //                           CustomerCode = a.CusCode,
        //                           Code = a.CusCode,
        //                           Name = a.CusName
        //                       };
        //        var list = queryCus.OrderByDescending(x => x.Id).ToList();
        //        msg.Object = list;
        //    }
        //    catch (Exception ex)
        //    {
        //        msg.Object = ex.Message;
        //        msg.Error = true;
        //        msg.Title = "Có lỗi khi lấy dữ liệu";
        //    }
        //    return Json(msg);
        //}

        //[HttpPost]
        //public JsonResult GetAllSupplier()
        //{
        //    JMessage msg = new JMessage() { Error = false };
        //    try
        //    {
        //        var queryCus = from a in _context.Suppliers.Where(x => x.IsDeleted == false)
        //                       select new
        //                       {
        //                           Id = a.SupID,
        //                           SupplierCode = a.SupCode,
        //                           Code = a.SupCode,
        //                           Name = a.SupName
        //                       };
        //        var list = queryCus.OrderByDescending(x => x.Id).ToList();
        //        msg.Object = list;
        //    }
        //    catch (Exception ex)
        //    {
        //        msg.Object = ex.Message;
        //        msg.Error = true;
        //        msg.Title = "Có lỗi khi lấy dữ liệu";
        //    }
        //    return Json(msg);
        //}

        //[HttpPost]
        //public JsonResult GetAllProject()
        //{
        //    JMessage msg = new JMessage() { Error = false };
        //    try
        //    {
        //        var queryCus = from a in _context.Projects.Where(x => x.FlagDeleted == false)
        //                       select new
        //                       {
        //                           Id = a.Id,
        //                           ProjectCode = a.ProjectCode,
        //                           Code = a.ProjectCode,
        //                           Name = a.ProjectCode
        //                       };
        //        var list = queryCus.OrderByDescending(x => x.Id).ToList();
        //        msg.Object = list;
        //    }
        //    catch (Exception ex)
        //    {
        //        msg.Object = ex.Message;
        //        msg.Error = true;
        //        msg.Title = "Có lỗi khi lấy dữ liệu";
        //    }
        //    return Json(msg);
        //}
        [AllowAnonymous]
        [HttpGet]
        public object GetListObject(string objectType)
        {
            return (from a in _context.VAllObjects
                    where (string.IsNullOrEmpty(objectType) || (objectType == EnumHelper<All>.GetDisplayValue(All.All)) || a.ObjectType == objectType)
                    select a).AsNoTracking();
        }

        [HttpPost]
        public JsonResult PasteFile([FromBody] EDMSPasteFileModel obj)
        {
            var msg = new JMessage { Error = false, Title = "Dán thành công" };
            try
            {
                if (obj.Action == "Copy" || obj.Action == "Move")
                {
                    //Lấy thông tin file cũ dựa vào fileId
                    var edmsFileOld = _context.EDMSFiles.FirstOrDefault(x => !x.IsDeleted && x.FileID.Equals(obj.FileIdFrom));
                    if (edmsFileOld != null)
                    {
                        //Lấy danh mục và đường dẫn của thư mục mới
                        var edmsCategoryNew = (from a in _context.EDMSCategorys.Where(x => !x.IsDeleted && x.Id.Equals(obj.CatIdTo))
                                               join b in _context.EDMSCatRepoSettings on a.CatCode equals b.CatCode
                                               select new { a.CatCode, b.ReposCode }).FirstOrDefault();

                        if (edmsCategoryNew != null)
                        {
                            var edmsCatRepoSettingNew = _context.EDMSCatRepoSettings.FirstOrDefault(x => x.CatCode.Equals(edmsCategoryNew.CatCode) && x.ReposCode.Equals(edmsCategoryNew.ReposCode));

                            //Lấy bản ghi của file cũ
                            var edmsRepoCatFileOld = _context.EDMSRepoCatFiles.FirstOrDefault(x => x.FileCode.Equals(edmsFileOld.FileCode));

                            switch (obj.Action)
                            {
                                case "Copy":
                                    var pathFileNewCopy = edmsCatRepoSettingNew.Path + string.Concat("/", Path.GetFileNameWithoutExtension(edmsFileOld.FileName), "_", Guid.NewGuid().ToString().Substring(0, 8) + Path.GetExtension(edmsFileOld.FileName));
                                    //Thực hiện copy bản file cứng
                                    msg = CopyFile(edmsRepoCatFileOld.Id, pathFileNewCopy, edmsCategoryNew.ReposCode, edmsCategoryNew.CatCode, edmsFileOld.MimeType);
                                    if (!msg.Error)
                                    {
                                        var fileCodeOld = edmsFileOld.FileCode;
                                        //Nhân bản tệp ở bảng EDMS_FILE , EDMS_REPO_CAT_FILE dựa vào fileCode
                                        var edmsFileCopy = new EDMSFile
                                        {
                                            FileCode = string.Concat("REPOSITORY", Guid.NewGuid().ToString()),
                                            Url = msg.Object == null ? pathFileNewCopy : null,
                                            CreatedBy = User.Identity.Name,
                                            CreatedTime = DateTime.Now,
                                            CloudFileId = msg.Object != null ? msg.Object.ToString() : null,
                                            ReposCode = edmsCatRepoSettingNew.ReposCode,

                                            DeletedBy = edmsFileOld.DeletedBy,
                                            DeletedTime = edmsFileOld.DeletedTime,
                                            Desc = edmsFileOld.Desc,
                                            EditedFileBy = edmsFileOld.EditedFileBy,
                                            EditedFileTime = edmsFileOld.EditedFileTime,
                                            FileName = edmsFileOld.FileName,
                                            FileParentId = edmsFileOld.FileParentId,
                                            FileSize = edmsFileOld.FileSize,
                                            FileTypePhysic = edmsFileOld.FileTypePhysic,
                                            FileTypeWork = edmsFileOld.FileTypeWork,
                                            IsDeleted = edmsFileOld.IsDeleted,
                                            IsEdit = edmsFileOld.IsEdit,
                                            IsFileMaster = edmsFileOld.IsFileMaster,
                                            IsScan = edmsFileOld.IsScan,
                                            ListUserView = edmsFileOld.ListUserView,
                                            MetaDataExt = edmsFileOld.MetaDataExt,
                                            MimeType = edmsFileOld.MimeType,
                                            NumberDocument = edmsFileOld.NumberDocument,
                                            Tags = edmsFileOld.Tags,
                                            UpdatedBy = edmsFileOld.UpdatedBy,
                                            UpdatedTime = edmsFileOld.UpdatedTime,
                                        };

                                        var edmsRepoCatFileCopy = new EDMSRepoCatFile
                                        {
                                            CatCode = edmsCatRepoSettingNew.CatCode,
                                            FileCode = edmsFileCopy.FileCode,
                                            ReposCode = edmsCatRepoSettingNew.ReposCode,
                                            FolderId = edmsCatRepoSettingNew.FolderId,
                                            ObjectCode = null,
                                            ObjectType = null,
                                            Path = edmsCatRepoSettingNew.Path,
                                        };

                                        _context.EDMSFiles.Add(edmsFileCopy);
                                        _context.EDMSRepoCatFiles.Add(edmsRepoCatFileCopy);
                                        _context.SaveChanges();
                                    }
                                    else
                                    {
                                        return Json(msg);
                                    }
                                    break;

                                case "Move":
                                    var pathFileNew = edmsCatRepoSettingNew.Path + string.Concat("/", Path.GetFileNameWithoutExtension(edmsFileOld.FileName), "_", Guid.NewGuid().ToString().Substring(0, 8) + Path.GetExtension(edmsFileOld.FileName));

                                    //Thực hiện copy bản file cứng
                                    msg = CopyFile(edmsRepoCatFileOld.Id, pathFileNew, edmsCategoryNew.ReposCode, edmsCategoryNew.CatCode, edmsFileOld.MimeType);
                                    msg = MoveFile(edmsRepoCatFileOld.Id);

                                    if (!msg.Error)
                                    {
                                        //Nhân bản tệp ở bảng EDMS_FILE , EDMS_REPO_CAT_FILE dựa vào fileCode
                                        edmsFileOld.Url = pathFileNew;

                                        edmsRepoCatFileOld.ReposCode = edmsCatRepoSettingNew.ReposCode;
                                        edmsRepoCatFileOld.CatCode = edmsCatRepoSettingNew.CatCode;
                                        edmsRepoCatFileOld.Path = edmsCatRepoSettingNew.Path;

                                        _context.EDMSFiles.Update(edmsFileOld);
                                        _context.EDMSRepoCatFiles.Update(edmsRepoCatFileOld);
                                        _context.SaveChanges();
                                    }

                                    break;
                            }
                        }
                        else
                        {
                            msg.Error = true;
                            msg.Title = "Không tìm thấy thư mục";
                        }
                    }
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

        [NonAction]
        public JMessage CopyFile(int idRepoCatFile, string urlFile, string repoCodeTo, string catCodeTo, string contentType)
        {
            var msg = new JMessage { Error = false, Title = "Sao chép thành công" };
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
                                c.FileTypePhysic,
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
        public JMessage MoveFile(int idRepoCatFile)
        {
            var msg = new JMessage { Error = false, Title = "Di chuyển thành công" };
            try
            {
                var data = _context.EDMSRepoCatFiles.FirstOrDefault(x => x.Id == idRepoCatFile);
                var file = _context.EDMSFiles.FirstOrDefault(x => x.FileCode == data.FileCode);

                //LuceneExtension.DeleteIndexFile(file.FileCode, _hostingEnvironment.WebRootPath + "\\uploads\\luceneIndex");
                var getRepository = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == data.ReposCode);
                if (getRepository != null)
                {
                    if (getRepository.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server))
                    {
                        var urlEnd = HttpUtility.UrlPathEncode("ftp://" + getRepository.Server + file.Url);
                        FileExtensions.DeleteFileFtpServer(urlEnd, getRepository.Account, getRepository.PassWord);
                    }
                    else if (getRepository.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.GooglerDriver))
                    {
                        var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == getRepository.Token);
                        var json = apiTokenService.CredentialsJson;
                        var user = apiTokenService.Email;
                        var token = apiTokenService.RefreshToken;
                        FileExtensions.DeleteFileGoogleServer(json, token, file.CloudFileId, user);
                    }
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
                            ReposCode = (b != null ? b.ReposCode : null),
                            Url = (c != null ? c.Url : null),
                            FileId = (c != null ? c.CloudFileId : null),
                            c.FileTypePhysic,
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
                    var urlEnd = HttpUtility.UrlPathEncode("ftp://" + ftphost + ftpfilepath);
                    using (WebClient request = new WebClient())
                    {
                        request.Credentials = new NetworkCredential(data.Account, data.PassWord);
                        fileStream = request.DownloadData(urlEnd);
                    }
                }
            }
            else if (getRepository.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.GooglerDriver))
            {
                var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == getRepository.Token);
                var json = apiTokenService.CredentialsJson;
                var user = apiTokenService.Email;
                var token = apiTokenService.RefreshToken;
                fileStream = FileExtensions.DownloadFileGoogle(json, token, data.FileId, user);
                //fileStream = FileExtensions.DownloadFileGoogle(_hostingEnvironment.WebRootPath + "\\files\\credentials.json", _hostingEnvironment.WebRootPath + "\\files\\token.json", data.FileId);
            }

            return fileStream;
        }

        [NonAction]
        public JMessage UploadFileToServer(byte[] fileByteArr, string repoCode, string catCode, string fileName, string contentType)
        {
            var msg = new JMessage { Error = false, Title = "Tải tệp thành công" };
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
                    var urlFileServer = HttpUtility.UrlPathEncode("ftp://" + data.Server + urlFile);
                    var result = FileExtensions.UploadFileToFtpServer(urlFileServer, urlFileServer, fileBytes, data.Account, data.PassWord);
                    if (result.Status == WebExceptionStatus.ConnectFailure || result.Status == WebExceptionStatus.ProtocolError)
                    {
                        msg.Error = true;
                        msg.Title = _sharedResources["COM_CONNECT_FAILURE"];
                        return msg;
                    }

                    if (result.Status == WebExceptionStatus.Success)
                    {
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
                msg.Object = ex;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }

            return msg;
        }

        [HttpPost]
        public object GetListUser()
        {
            var data = from a in _context.Users.Where(x => x.Active).Select(x => new { Code = x.UserName, Name = x.GivenName, x.DepartmentId })
                       join b in _context.AdDepartments.Where(x => !x.IsDeleted && x.IsEnabled) on a.DepartmentId equals b.DepartmentCode
                       select new
                       {
                           a.Code,
                           a.Name,
                           DepartmentName = b.Title
                       };
            return data;
        }

        [HttpPost]
        public JsonResult InsertFileShare([FromBody] FileShareModel obj)
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
                                c.FileTypePhysic,
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
                            ObjectType = "REPOSITORY",
                            ObjectInstance = data.Id
                        };
                        var files = new FilesShareObjectUser
                        {
                            CreatedBy = AppContext.UserName,
                            CreatedTime = DateTime.Now,
                            FileID = data.FileCode,
                            FileCreated = User.Identity.Name,
                            FileUrl = data.Url,
                            FileName = data.FileName,
                            ObjectRelative = JsonConvert.SerializeObject(rela),
                            ListUserShare = obj.ListUserShare
                        };
                        _context.FilesShareObjectUsers.Add(files);
                    }
                    else
                    {
                        check.ListUserShare = obj.ListUserShare;

                        _context.FilesShareObjectUsers.Update(check);
                    }
                    _context.SaveChanges();
                }

                msg.Title = "Chia sẻ thành công";
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [HttpPost]
        public JsonResult GetFileShare(int id)
        {
            var msg = new JMessage { Title = "", Error = false };
            try
            {
                var file = _context.EDMSRepoCatFiles.FirstOrDefault(x => x.Id.Equals(id));
                if (file != null)
                {
                    var filesShare = _context.FilesShareObjectUsers.FirstOrDefault(x => !x.IsDeleted && x.FileID.Equals(file.FileCode));

                    msg.Object = filesShare;
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        public class AudioBookRequestBody
        {
            public int id { get; set; }
            public string contents { get; set; }
        }
        [HttpPost]
        public async Task<JsonResult> GenerateAudioBookUrls([FromBody] AudioBookRequestBody body)
        {
            var id = body.id;
            var contents = body.contents;
            var msg = new JMessage { Title = "", Error = false };
            try
            {
                var lString = JsonConvert.DeserializeObject<List<string>>(contents);
                var obj = _context.EDMSFiles.FirstOrDefault(x => !x.IsDeleted && x.FileID == id);
                if (obj != null)
                {
                    var listAudioBooks = new List<AudioBookItem>();
                    foreach (var set in lString.Select((value, i) => new { i, value }))
                    {
                        var item = set.value;
                        var msg1 = await CallApiTtsFpt(item, "DEK9NM0nqlgiBEYXJr88EPSybDnP3Huq");
                        var isFileExist = false;
                        do
                        {
                            var obj1 = await CommonUtil.CheckResourceExist(msg1.Async);
                            if (obj1.Error == false)
                            {
                                isFileExist = true;
                            }
                            Sleep(1000);
                        } while (!isFileExist);

                        var fileName = Guid.NewGuid() + ".mp3";
                        //Uri uri = new Uri(item);
                        //if (uri.IsFile) {
                        //    fileName = System.IO.Path.GetFileName(uri.LocalPath);
                        //}
                        var msg2 = await DownloadResourceMp3(msg1.Async, fileName);
                        var audioBookItem = new AudioBookItem
                        {
                            Index = set.i,
                            AudioPath = msg2.Object.ToString()
                        };
                        listAudioBooks.Add(audioBookItem);
                    }
                    await ConcatenateAudioBook(listAudioBooks, id);
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
        public async Task<JMessage> ConcatenateAudioBook(List<AudioBookItem> listAudioBooks, int fileId)
        {
            var msg = new JMessage { Title = "", Error = false };
            try
            {
                List<Byte[]> files = new List<byte[]>();
                foreach (var item in listAudioBooks)
                {
                    var memoryStream = new MemoryStream();
                    var fileStream = new FileStream(_hostingEnvironment.WebRootPath + "/" + item.AudioPath, FileMode.Open);
                    await fileStream.CopyToAsync(memoryStream);
                    var fileBytes = memoryStream.ToArray();
                    files.Add(fileBytes);
                    fileStream.Dispose();
                    memoryStream.Dispose();
                }
                Byte[] destinationArray = new Byte[files.Sum(x => x.Length)];
                var destinationIndex = 0;
                for (int i = 0; i < files.Count(); i++)
                {
                    Array.Copy(files[i], 0, destinationArray, destinationIndex, files[i].Length);
                    destinationIndex += files[i].Length;
                }
                var obj = _context.EDMSFiles.FirstOrDefault(x => !x.IsDeleted && x.FileID == fileId);
                if (obj != null)
                {
                    var fileName = Path.GetFileNameWithoutExtension(obj.FileName) + ".mp3";
                    JMessage msg1 = _upload.UploadFileByBytes(destinationArray, fileName, _hostingEnvironment.WebRootPath,
                        "uploads\\audioBook");
                    string path = msg1.Object.ToString();

                    obj.AudioBook = path;
                    _context.EDMSFiles.Update(obj);
                    await _context.SaveChangesAsync();
                }
                foreach (var item in listAudioBooks)
                {
                    DeleteFileTemp(item.AudioPath);
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return msg;
        }
        public class FptAiResult
        {
            public int Error { get; set; }
            public string Async { get; set; }
            public string Message { get; set; }
            public string RequestId { get; set; }
        }

        public async Task<JMessage> DownloadResourceMp3(string url, string fileName)
        {
            var msg = new JMessage { Error = false };
            HttpWebResponse response = null;
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";

            try
            {
                response = await request.GetResponseAsync() as HttpWebResponse;
                if (response != null)
                {
                    var fileStream = response.GetResponseStream();
                    MemoryStream memoryStream = new MemoryStream();
                    if (fileStream != null) await fileStream.CopyToAsync(memoryStream);
                    var fileBytes = memoryStream.ToArray();
                    JMessage msg1 = _upload.UploadFileByBytes(fileBytes, fileName, _hostingEnvironment.WebRootPath,
                        "uploads\\audioBook");
                    string path = msg1.Object.ToString();
                    msg.Object = path;
                }
            }
            catch (WebException ex)
            {
                msg.Error = true;
            }
            finally
            {
                if (response != null)
                {
                    response.Close();
                }
            }

            return msg;
        }

        private async Task<FptAiResult> CallApiTtsFpt(string content, string apiKey)
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("api-key", apiKey);
            client.DefaultRequestHeaders.Add("speed", "");
            client.DefaultRequestHeaders.Add("voice", "banmai");
            var response = await client.PostAsync("https://api.fpt.ai/hmi/tts/v5", new StringContent(content));
            var resultString = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<FptAiResult>(resultString);
        }

        public class ContentString
        {
            public string content { get; set; }
            public string languageCode { get; set; }
        }
        [HttpPost]
        public object GetTextContentReading(string filePath)
        {
            try
            {
                var path = _hostingEnvironment.WebRootPath + "/" + filePath;
                FileStream fileStreamPath = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                LanguageDetector detector = new LanguageDetector();
                detector.AddAllLanguages();
                string fileContents;
                string[] lStrings;
                var listContent = new List<ContentString>();
                using (StreamReader reader = new StreamReader(fileStreamPath))
                {
                    fileContents = reader.ReadToEnd();
                    lStrings = fileContents.Split(
                        new[] { "\r\n", "\r", "\n" },
                        StringSplitOptions.None
                    );
                }

                foreach (var item in lStrings)
                {
                    var detectResult = detector.Detect(item);
                    var contentString = new ContentString
                    {
                        content = item,
                        languageCode = detectResult
                    };
                    listContent.Add(contentString);
                }
                fileStreamPath.Dispose();
                return Json(listContent);
            }
            catch (Exception ex)
            {
                var listContent = new List<string>();
                return Json(listContent);
            }
        }

        [HttpPost]
        public object GetWordContentReading(string filePath)
        {
            try
            {
                var path = _hostingEnvironment.WebRootPath + "/" + filePath;
                FileStream fileStreamPath = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                LanguageDetector detector = new LanguageDetector();
                detector.AddAllLanguages();
                var listContent = new List<ContentString>();
                string[] lStrings;
                var document =
                    new Syncfusion.DocIO.DLS.WordDocument(fileStreamPath, FormatType.Automatic);
                var content = document.GetText();

                lStrings = content.Split(
                    new[] { "\r\n", "\r", "\n" },
                    StringSplitOptions.None
                );

                foreach (var item in lStrings)
                {
                    var detectResult = detector.Detect(item);
                    var contentString = new ContentString
                    {
                        content = item,
                        languageCode = detectResult
                    };
                    listContent.Add(contentString);
                }

                document.Dispose();
                fileStreamPath.Dispose();
                return Json(listContent);
            }
            catch (Exception ex)
            {
                return new List<ContentString>();
            }
        }

        [HttpPost]
        public object GetExcelContentReading(string filePath)
        {
            var path = _hostingEnvironment.WebRootPath + "/" + filePath;
            FileStream fileStreamPath = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            ExcelEngine excelEngine = new ExcelEngine();

            IApplication application = excelEngine.Excel;

            IWorkbook workbook = application.Workbooks.Open(fileStreamPath);
            LanguageDetector detector = new LanguageDetector();
            detector.AddAllLanguages();

            var sheets = workbook.Worksheets;
            var listContent = new List<ContentString>();

            foreach (var sheet in sheets)
            {
                var text = GetAllText(sheet);
                var detectResult = detector.Detect(text);
                var contentString = new ContentString
                {
                    content = text,
                    languageCode = detectResult
                };
                listContent.Add(contentString);
            }

            workbook.Close();
            excelEngine.Dispose();
            fileStreamPath.Dispose();
            return Json(listContent);
        }
        private static string GetAllText(IWorksheet sheet)

        {

            int lastRow = sheet.UsedRange.LastRow;

            int lastColumn = sheet.UsedRange.LastColumn;

            StringBuilder builder = new StringBuilder();

            IMigrantRange range = sheet.MigrantRange;

            for (int iRow = 1; iRow <= lastRow; iRow++)

            {

                for (int iColumn = 1; iColumn <= lastColumn; iColumn++)

                {

                    range.ResetRowColumn(iRow, iColumn);

                    builder.Append(range.DisplayText);

                    builder.Append(" ");

                }

            }

            return builder.ToString();

        }

        [HttpPost]
        public object GetPdfContentReading(string filePath)
        {
            var path = _hostingEnvironment.WebRootPath + "/" + filePath;
            FileStream fileStreamPath = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            PdfLoadedDocument loadedDocument = new PdfLoadedDocument(fileStreamPath);
            LanguageDetector detector = new LanguageDetector();
            detector.AddAllLanguages();

            // Loading page collections
            PdfLoadedPageCollection loadedPages = loadedDocument.Pages;

            var listContent = new List<MobileLoginController.ContentString>();

            // Extract text from existing PDF document pages
            foreach (PdfLoadedPage loadedPage in loadedPages)
            {
                var text = loadedPage.ExtractText();
                var detectResult = detector.Detect(text);
                var contentString = new MobileLoginController.ContentString
                {
                    content = text,
                    languageCode = detectResult
                };
                listContent.Add(contentString);
            }

            loadedDocument.Dispose();
            fileStreamPath.Dispose();
            return Json(listContent);
        }
        [HttpPost]
        public object GetPptxContentReading(string filePath)
        {
            var path = _hostingEnvironment.WebRootPath + "/" + filePath;
            FileStream fileStreamPath = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            IPresentation presentation = Presentation.Open(fileStreamPath);
            var listContent = new List<MobileLoginController.ContentString>();
            LanguageDetector detector = new LanguageDetector();
            detector.AddAllLanguages();
            //Iterate each slide in a presentation 
            foreach (ISlide slide in presentation.Slides)
            {
                //Iterate all the shapes in the slide to get the text
                foreach (IShape shape in slide.Shapes)
                {
                    //Check the shape is table 
                    if (shape is ITable)
                    {
                        ITable table = shape as ITable;
                        //Iterate all the cells in the table and gets the text 
                        foreach (IRow row in table.Rows)
                        {
                            foreach (ICell cell in row.Cells)
                            {
                                //Get the text from the cell body 
                                string text = cell.TextBody.Text;
                                //Add the extracted text into string collection. 
                                var detectResult = detector.Detect(text);
                                var contentString = new MobileLoginController.ContentString
                                {
                                    content = text,
                                    languageCode = detectResult
                                };
                                listContent.Add(contentString);
                            }
                        }
                    }
                    else
                    {
                        //Iterate all the paragraphs in the shape and gets the text 
                        foreach (IParagraph paragraph in shape.TextBody.Paragraphs)
                        {
                            foreach (ITextPart textpart in paragraph.TextParts)
                            {
                                //Get the text from the paragraph 
                                string text = textpart.Text;
                                //Add the extracted text into string collection 
                                var detectResult = detector.Detect(text);
                                var contentString = new MobileLoginController.ContentString
                                {
                                    content = text,
                                    languageCode = detectResult
                                };
                                listContent.Add(contentString);
                            }
                        }
                    }
                }
            }

            presentation.Dispose();
            fileStreamPath.Dispose();
            return Json(listContent);
        }

        [HttpPost]
        public object GetEpubContentReading(string filePath)
        {
            var path = _hostingEnvironment.WebRootPath + "/" + filePath;
            FileStream fileStreamPath = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            EpubBook epubBook = EpubReader.ReadBook(fileStreamPath);
            LanguageDetector detector = new LanguageDetector();
            detector.AddAllLanguages();
            var listContent = new List<MobileLoginController.ContentString>();
            foreach (EpubTextContentFile textContentFile in epubBook.ReadingOrder)
            {
                // HTML of current text content file
                string htmlContent = textContentFile.Content;

                var detectResult = detector.Detect(htmlContent);
                var contentString = new MobileLoginController.ContentString
                {
                    content = htmlContent,
                    languageCode = detectResult
                };
                listContent.Add(contentString);
            }
            fileStreamPath.Dispose();
            return Json(listContent);
        }

        [HttpPost]
        public JMessage DeleteFileTemp(string filePath)
        {
            var msg = new JMessage { Title = "Xóa file temp thành công!", Error = false };
            try
            {
                var path = _hostingEnvironment.WebRootPath + "/" + filePath;
                if (System.IO.File.Exists(path))
                {
                    System.IO.File.Delete(path);
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Có lỗi xảy ra!";
            }

            return msg;
        }

        [AllowAnonymous]
        [HttpPost]
        public List<MappingInfo> GetTreeZone()
        {
            var data = (from a in _context.PAreaMappings
                    .Where(x => x.IsDeleted == false)
                        join b in _context.PAreaCategories
                            on new { a.CategoryCode, a.ObjectType } equals new
                            { CategoryCode = b.Code, ObjectType = b.PAreaType }
                        select new MappingInfo
                        {
                            Code = b.PAreaCode,
                            Name = b.PAreaDescription,
                            Parent = b.PAreaParent,
                            Type = a.ObjectType,
                            Id = b.Id,
                            Mapping = a.ObjectCode,
                        }).ToList();
            //var dataOrder = GetSubTreeZone(data, null, new List<TreeView>(), 0);
            return data;
        }

        public class MappingInfo
        {
            public string Code { get; set; }
            public string Name { get; set; }
            public string Parent { get; set; }
            public string Type { get; set; }
            public int Id { get; set; }
            public string Mapping { get; set; }
        }

        //private List<TreeView> GetSubTreeZone(List<MappingInfo> data, string catParent, List<TreeView> lstCategories, int tab)
        //{
        //    var contents = (catParent == null)
        //        ? data.Where(x => string.IsNullOrEmpty(x.Parent) && x.Type == "AREA").OrderBy(x => x.Name).ToList()
        //        : data.Where(x => x.Parent == catParent && x.Type == "AREA").OrderBy(x => x.Name).ToList();
        //    foreach (var item in contents)
        //    {
        //        var category = new TreeView
        //        {
        //            Id = item.Id,
        //            Code = item.Code,
        //            Title = item.Name,
        //            Level = tab,
        //            HasChild = data.Any(x => !string.IsNullOrEmpty(x.Parent) && x.Parent.Equals(item.Code))
        //        };
        //        lstCategories.Add(category);
        //        GetSubTreeZoneItems(data, item.Mapping, lstCategories, 1);
        //        if (category.HasChild) GetSubTreeZone(data, item.Code, lstCategories, tab + 1);
        //    }
        //    return lstCategories;
        //}

        //private List<TreeView> GetSubTreeZoneItems(List<MappingInfo> data, string catParent, List<TreeView> lstCategories, int tab)
        //{
        //    //var contents = (catParent == null)
        //    //    ? data.Where(x => string.IsNullOrEmpty(x.Parent)).OrderBy(x => x.Name).ToList()
        //    //    : data.Where(x => x.Parent == catParent).OrderBy(x => x.Name).ToList();
        //    string[] map = new[] { "AREA", "FLOOR", "LINE", "RACK", "POSITION" };
        //    var contents = (from a in data
        //            join b in map.Select((x, i) => new {Index = i, Value = x}) on a.Type equals b.Value
        //            where b.Index == tab
        //            select a)
        //        .Where(x => x.Mapping.StartsWith(catParent)).ToList();
        //    foreach (var item in contents)
        //    {
        //        var category = new TreeView
        //        {
        //            Id = item.Id,
        //            Code = item.Code,
        //            Title = item.Name,
        //            Level = tab,
        //            HasChild = (from a in data
        //                join b in map.Select((x, i) => new {Index = i, Value = x}) on a.Type equals b.Value
        //                where b.Index == tab + 1
        //                select a).Any(x => x.Mapping.StartsWith(item.Mapping))
        //        };
        //        lstCategories.Add(category);
        //        if (category.HasChild) GetSubTreeZoneItems(data, item.Mapping, lstCategories, tab + 1);
        //    }
        //    return lstCategories;
        //}
        #endregion

        #region ui-select
        [AllowAnonymous]
        [HttpPost]
        public object GetObjectsType()
        {
            var list = new List<Properties>();
            var all = new Properties
            {
                Code = EnumHelper<All>.GetDisplayValue(All.All),
                Name = All.All.DescriptionAttr()
            };
            list.Add(all);

            var project = new Properties
            {
                Code = EnumHelper<ProjectEnum>.GetDisplayValue(ProjectEnum.Project),
                Name = ProjectEnum.Project.DescriptionAttr()
            };
            list.Add(project);

            var contract = new Properties
            {
                Code = EnumHelper<ContractEnum>.GetDisplayValue(ContractEnum.Contract),
                Name = ContractEnum.Contract.DescriptionAttr()
            };
            list.Add(contract);

            var Customer = new Properties
            {
                Code = EnumHelper<CustomerEnum>.GetDisplayValue(CustomerEnum.Customer),
                Name = CustomerEnum.Customer.DescriptionAttr()
            };
            list.Add(Customer);

            var Supplier = new Properties
            {
                Code = EnumHelper<SupplierEnum>.GetDisplayValue(SupplierEnum.Supplier),
                Name = SupplierEnum.Supplier.DescriptionAttr()
            };
            list.Add(Supplier);
            return Json(list);
        }
        [AllowAnonymous]
        [HttpPost]
        public object GetUsers()
        {
            var query = from a in _context.Users
                        select new
                        {
                            a.UserName,
                            Name = a.GivenName
                        };
            var list = query.ToList();
            return list;
        }

        [HttpGet]
        public IActionResult Download(int Id)
        {
            try
            {
                var data = (from a in _context.EDMSRepoCatFiles.Where(x => x.Id == Id)
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
                                Url = (c != null ? c.Url : null),
                                FileId = (c != null ? c.CloudFileId : null),
                                c.FileTypePhysic,
                                c.FileName,
                                c.MimeType,
                                b.Account,
                                b.PassWord
                            }
                        ).FirstOrDefault();
                if (data != null)
                {
                    var extension = Path.GetExtension(data.FileName);
                    var fileName = "";
                    if (extension.ToLower().Equals(data.FileTypePhysic.ToLower()))
                    {
                        fileName = data.FileName;
                    }
                    else
                    {
                        fileName = string.Concat(data.FileName, data.FileTypePhysic);
                    }
                    if (data.Type == "SERVER")
                    {
                        if (!string.IsNullOrEmpty(data.Server))
                        {
                            string ftphost = data.Server;
                            string ftpfilepath = data.Url;
                            var urlEnd = HttpUtility.UrlPathEncode("ftp://" + ftphost + ftpfilepath);
                            using (WebClient request = new WebClient())
                            {
                                request.Credentials = new NetworkCredential(data.Account, data.PassWord);
                                byte[] fileData = request.DownloadData(urlEnd);
                                return File(fileData, data.MimeType, fileName);
                            }
                        }
                    }
                    else
                    {
                        var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == data.Token);
                        var json = apiTokenService.CredentialsJson;
                        var user = apiTokenService.Email;
                        var token = apiTokenService.RefreshToken;
                        var fileData = FileExtensions.DownloadFileGoogle(json, token, data.FileId, user);
                        return File(fileData, data.MimeType, fileName);
                    }
                }
            }
            catch (Exception ex)
            {

            }
            return null;
        }

        [HttpGet]
        public IActionResult DownloadSearch(int Id, string content)
        {
            try
            {
                var data = (from a in _context.EDMSRepoCatFiles.Where(x => x.Id == Id)
                            join b in _context.EDMSRepositorys on a.ReposCode equals b.ReposCode into b2
                            from b in b2.DefaultIfEmpty()
                            join c in _context.EDMSFiles on a.FileCode equals c.FileCode into c2
                            from c in c2.DefaultIfEmpty()
                            select new
                            {
                                a.Id,
                                Server = (b != null ? b.Server : null),
                                Token = (b != null ? b.Token : null),
                                Type = (b != null ? b.Type : null),
                                Url = (c != null ? c.Url : null),
                                FileId = (c != null ? c.CloudFileId : null),
                                c.FileTypePhysic,
                                c.FileName,
                                c.MimeType,
                                b.Account,
                                b.PassWord,
                                c.FileCode
                            }
                        ).FirstOrDefault();
                if (data != null)
                {
                    if (data.Type == "SERVER")
                    {
                        if (!string.IsNullOrEmpty(data.Server))
                        {
                            string ftphost = data.Server;
                            string ftpfilepath = data.Url;
                            var urlEnd = HttpUtility.UrlPathEncode("ftp://" + ftphost + ftpfilepath);
                            using (WebClient request = new WebClient())
                            {
                                request.Credentials = new NetworkCredential(data.Account, data.PassWord);
                                byte[] fileData = request.DownloadData(urlEnd);
                                JMessage msg1 = _upload.UploadFileByBytes(fileData, data.FileName, _hostingEnvironment.WebRootPath, "uploads\\tempFile");
                                string path = msg1.Object.ToString();
                                List<string> arr = new List<string>();
                                arr.Add(content);
                                if (!string.IsNullOrEmpty(content) && Array.IndexOf(word, data.FileTypePhysic.ToUpper()) >= 0)
                                {
                                    try
                                    {
                                        var path1 = "Lucid dream is dream Nguyen van huy xử lý dữ liệu bằng tay.";

                                        List<string> optionList = new List<string> { "dream" };
                                        UpdateFileWord1(path1, arr, ".docx");
                                        UpdateFileWord(path, arr, data.FileTypePhysic);
                                    }
                                    catch (Exception ex) { }
                                }
                                else if (!string.IsNullOrEmpty(content) && Array.IndexOf(pdf, data.FileTypePhysic.ToUpper()) >= 0)
                                {
                                    UpdateFilePdf(path, arr, data.FileTypePhysic);
                                }
                                else if (!string.IsNullOrEmpty(content) && Array.IndexOf(excel, data.FileTypePhysic.ToUpper()) >= 0)
                                {
                                    UpdateFileExcel(path, arr, data.FileTypePhysic);
                                }
                                byte[] bytes = System.IO.File.ReadAllBytes(Path.Combine(_hostingEnvironment.WebRootPath, path));
                                return File(bytes, data.MimeType, data.FileName);
                            }
                        }
                    }
                    else
                    {
                        var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == data.Token);
                        var json = apiTokenService.CredentialsJson;
                        var user = apiTokenService.Email;
                        var token = apiTokenService.RefreshToken;
                        var fileData = FileExtensions.DownloadFileGoogle(json, token, data.FileId, user);
                        //byte[] fileData = FileExtensions.DownloadFileGoogle(_hostingEnvironment.WebRootPath + "\\files\\credentials.json", _hostingEnvironment.WebRootPath + "\\files\\token.json", data.FileId);
                        JMessage msg1 = _upload.UploadFileByBytes(fileData, data.FileName, _hostingEnvironment.WebRootPath, "uploads\\tempFile");
                        string path = msg1.Object.ToString();
                        List<string> arr = new List<string>();
                        arr.Add(content);
                        if (!string.IsNullOrEmpty(content) && Array.IndexOf(word, data.FileTypePhysic.ToUpper()) >= 0)
                        {
                            try
                            {
                                UpdateFileWord(path, arr, data.FileTypePhysic);
                            }
                            catch (Exception ex) { }
                        }
                        else if (!string.IsNullOrEmpty(content) && Array.IndexOf(pdf, data.FileTypePhysic.ToUpper()) >= 0)
                        {
                            UpdateFilePdf(path, arr, data.FileTypePhysic);
                        }
                        else if (!string.IsNullOrEmpty(content) && Array.IndexOf(excel, data.FileTypePhysic.ToUpper()) >= 0)
                        {
                            UpdateFileExcel(path, arr, data.FileTypePhysic);
                        }
                        byte[] bytes = System.IO.File.ReadAllBytes(Path.Combine(_hostingEnvironment.WebRootPath, path));
                        return File(bytes, data.MimeType, data.FileName);
                    }
                }
            }
            catch (Exception ex)
            {

            }
            return null;
        }
        #endregion

        #region Connection ftp,google driver
        public class JtableDirectoryModel : JTableModel
        {
            public string ReposCode { get; set; }
            public string Folder { get; set; }
            public string ParentId { get; set; }
            public string CatCode { get; set; }
        }

        [HttpPost]
        public object JtableFileWithRepository([FromBody] JtableDirectoryModel jTablePara)
        {
            var msg = new JMessage { Error = false };
            try
            {
                int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;
                var repos = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == jTablePara.ReposCode);
                if (repos != null)
                {
                    if (repos.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server))
                    {
                        var urlEnd = HttpUtility.UrlPathEncode("ftp://" + repos.Server + jTablePara.Folder);
                        var list = FileExtensions.GetFileFtpServer(urlEnd, repos.Account, repos.PassWord);
                        var count = list.Count();
                        var data = list.Skip(intBeginFor).Take(jTablePara.Length).ToList();
                        var jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, count, "Id", "FileName", "FileSize", "IsDirectory", "LastModifiedDate");
                        return Json(jdata);
                    }

                    if (repos.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.GooglerDriver))
                    {
                        var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == repos.Token);
                        var jdata = new JObject();
                        if (apiTokenService != null && !String.IsNullOrEmpty(apiTokenService.RefreshToken))
                        {
                            var json = apiTokenService.CredentialsJson;
                            var user = apiTokenService.Email;
                            var token = apiTokenService.RefreshToken;
                            var list = FileExtensions.GetFileGoogleFile(json, token, jTablePara.ParentId, user);
                            var count = list.Count();
                            var data = list.Skip(intBeginFor).Take(jTablePara.Length).ToList();
                            jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, count, "Id", "FileName", "FileSize", "IsDirectory", "LastModifiedDate", "MimeType");
                            return Json(jdata);
                        }

                        jdata = JTableHelper.JObjectTable(new List<FtpFileInfo>(), jTablePara.Draw, 0, "Id", "FileName", "FileSize", "IsDirectory", "LastModifiedDate");
                        return Json(jdata);
                    }
                    else
                    {
                        var jdata = JTableHelper.JObjectTable(new List<FtpFileInfo>(), jTablePara.Draw, 0, "Id", "FileName", "FileSize", "IsDirectory", "LastModifiedDate");
                        return Json(jdata);
                    }
                }

                {
                    var jdata = JTableHelper.JObjectTable(new List<FtpFileInfo>(), jTablePara.Draw, 0, "Id", "FileName", "FileSize", "IsDirectory", "LastModifiedDate");
                    return Json(jdata);
                }
            }
            catch (Exception ex)
            {
                //msg.Error = true;
                //msg.Object = ex.Message;
                //msg.Title = _sharedResources["COM_MSG_ERR"];
                var jdata = JTableHelper.JObjectTable(new List<FtpFileInfo>(), jTablePara.Draw, 0, "Id", "FileName", "FileSize", "IsDirectory", "LastModifiedDate");
                return Json(jdata);
            }
        }

        [HttpPost]
        public object JtableFolderWithRepository([FromBody] JtableDirectoryModel jTablePara)
        {
            var msg = new JMessage { Error = false };
            try
            {
                int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;
                var repos = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == jTablePara.ReposCode);
                if (repos != null)
                {
                    if (repos.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.Server))
                    {
                        var urlEnd = HttpUtility.UrlPathEncode("ftp://" + repos.Server + jTablePara.Folder);
                        var list = FileExtensions.GetFileFtpServer(urlEnd, repos.Account, repos.PassWord).Where(x => x.IsDirectory);
                        var count = list.Count();
                        var data = list.Skip(intBeginFor).Take(jTablePara.Length).ToList();
                        var jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, count, "Id", "FileName", "FileSize", "IsDirectory", "LastModifiedDate");
                        return Json(jdata);
                    }

                    if (repos.Type == EnumHelper<TypeConnection>.GetDisplayValue(TypeConnection.GooglerDriver))
                    {
                        var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == repos.Token);
                        var jdata = new JObject();
                        if (apiTokenService != null && !String.IsNullOrEmpty(apiTokenService.RefreshToken))
                        {
                            var credential = apiTokenService.CredentialsJson;
                            var user = apiTokenService.Email;
                            var token = apiTokenService.RefreshToken;
                            var list = FileExtensions.GetFolderGoogleFile(credential, token, jTablePara.ParentId, user);
                            var count = list.Count();
                            var data = list.Skip(intBeginFor).Take(jTablePara.Length).ToList();
                            jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, count, "Id", "FileName", "FileSize", "IsDirectory", "LastModifiedDate", "MimeType");
                            return Json(jdata);
                        }

                        jdata = JTableHelper.JObjectTable(new List<FtpFileInfo>(), jTablePara.Draw, 0, "Id", "FileName", "FileSize", "IsDirectory", "LastModifiedDate");
                        return Json(jdata);
                    }
                    else
                    {
                        var jdata = JTableHelper.JObjectTable(new List<FtpFileInfo>(), jTablePara.Draw, 0, "Id", "FileName", "FileSize", "IsDirectory", "LastModifiedDate");
                        return Json(jdata);
                    }
                }

                {
                    var jdata = JTableHelper.JObjectTable(new List<FtpFileInfo>(), jTablePara.Draw, 0, "Id", "FileName", "FileSize", "IsDirectory", "LastModifiedDate");
                    return Json(jdata);
                }
            }
            catch (Exception ex)
            {
                //msg.Error = true;
                //msg.Object = ex.Message;
                //msg.Title = _sharedResources["COM_MSG_ERR"];
                var jdata = JTableHelper.JObjectTable(new List<FtpFileInfo>(), jTablePara.Draw, 0, "Id", "FileName", "FileSize", "IsDirectory", "LastModifiedDate");
                return Json(jdata);
            }
        }
        #region python
        [HttpPost]
        public object JtableFolderWithRepositoryPython([FromBody] JtableDirectoryModel jTablePara)
        {
            var msg = new JMessage { Error = false };
            try
            {
                int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;
                var repos = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == jTablePara.ReposCode);
                var apiTokenService = _context.TokenManagers.FirstOrDefault(x => x.AccountCode == repos.Token);
                var jdata = new JObject();
                if (apiTokenService != null && !String.IsNullOrEmpty(apiTokenService.RefreshToken))
                {
                    var credential = apiTokenService.CredentialsJson;
                    var user = apiTokenService.Email;
                    var token = apiTokenService.RefreshToken;
                    var list = FileExtensions.GetFolderGoogleFile(credential, token, jTablePara.ParentId, user);
                    var count = list.Count();
                    var data = list.Skip(intBeginFor).Take(jTablePara.Length).ToList();
                    jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, count, "Id", "FileName", "FileSize", "IsDirectory", "LastModifiedDate", "MimeType");
                    return Json(jdata);
                }

                jdata = JTableHelper.JObjectTable(new List<FtpFileInfo>(), jTablePara.Draw, 0, "Id", "FileName", "FileSize", "IsDirectory", "LastModifiedDate");
                return Json(jdata);

            }
            catch (Exception ex)
            {
                var jdata = JTableHelper.JObjectTable(new List<FtpFileInfo>(), jTablePara.Draw, 0, "Id", "FileName", "FileSize", "IsDirectory", "LastModifiedDate");
                return Json(jdata);
            }
        }
        #endregion

        [HttpPost]
        public object JtableFolderSettingWithCategory([FromBody] JtableDirectoryModel jTablePara)
        {
            int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;
            var query = from a in _context.EDMSCatRepoSettings
                        where a.CatCode == jTablePara.CatCode
                        select new
                        {
                            a.Id,
                            a.ReposCode,
                            a.FolderName,
                            a.Path,
                            a.FolderId
                        };
            int count = query.Count();
            var data = query.OrderUsingSortExpression(jTablePara.QueryOrderBy).Skip(intBeginFor).Take(jTablePara.Length).AsNoTracking().ToList();
            var jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, count, "Id", "ReposCode", "FolderName", "Path", "FolderId");
            return jdata;
        }
        #endregion

        #region Ordering Document
        [HttpPost]
        public object GetListRack()
        {
            var data = (from a in _context.EDMSRackDocuments
                        join b in _context.EDMSLineDocuments on a.LineCode equals b.LineCode
                        join c in _context.EDMSFloorDocuments on b.FloorCode equals c.FloorCode
                        join d in _context.EDMSWareHouseDocuments on c.WHS_Code equals d.WHS_Code
                        where d.WHS_Flag == false
                        select new
                        {
                            Code = a.RackCode,
                            Name = string.Format("{0} ({1}) : {2} --> {3} --> {4}", a.RackName, a.RackCode, d.WHS_Name, c.FloorName, b.L_Text),
                            a.RackName,
                            b.L_Text,
                            c.FloorName,
                            d.WHS_Name
                        }).ToList();
            return data;
        }
        #endregion

        #region ObjectPackCover
        [HttpPost]
        public object JTablePack([FromBody] JTableModel jTablePara)
        {
            var msg = new JMessage { Error = false };
            try
            {
                int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;
                var list = _context.ObjectiverPackCovers.Where(x => !x.IsDeleted).Select(p => new
                {
                    p.Id,
                    p.ObjPackCode,
                    p.Name,
                    p.SpecSize,
                    p.Weight,
                    p.Unit,
                    CreatedBy = _context.Users.First(i => i.Active && i.UserName.Equals(p.CreatedBy)).GivenName ?? "",
                    CreatedTime = p.CreatedTime.ToString("dd/MM/yyyy"),
                });
                var count = list.Count();
                var data = list.Skip(intBeginFor).Take(jTablePara.Length).ToList();
                var jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, count, "Id", "ObjPackCode", "Name", "SpecSize", "Weight", "Unit", "CreatedBy", "CreatedTime");
                return Json(jdata);
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Object = ex;
                var data = new List<object>();
                var jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, 0, "Id", "ObjPackCode", "Name", "SpecSize", "Weight", "Unit", "CreatedBy", "CreatedTime");
                jdata.Add("msg", JsonConvert.SerializeObject(msg));
                return Json(jdata);
            }
            return Json(msg);
        }

        [HttpPost]
        public object GetListPack(string rackCode)
        {
            var msg = new JMessage { Error = false };
            try
            {
                var list = _context.ObjectiverPackCovers.Where(x => !x.IsDeleted && !string.IsNullOrEmpty(x.Located) && x.Located.Equals(rackCode));
                return Json(list);
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Object = ex;
            }
            return Json(msg);
        }

        [HttpPost]
        public object InsertPack([FromBody] ObjectiverPackCover data)
        {
            var msg = new JMessage { Error = false };
            try
            {
                var check = _context.ObjectiverPackCovers.FirstOrDefault(x => x.ObjPackCode == data.ObjPackCode && !x.IsDeleted);
                if (check == null)
                {
                    data.CreatedBy = AppContext.UserName;
                    data.CreatedTime = DateTime.Now;

                    _context.ObjectiverPackCovers.Add(data);
                    _context.SaveChanges();

                    msg.Title = String.Format(_sharedResources["COM_ADD_SUCCESS"], "");
                }
                else
                {
                    msg.Error = true;
                    msg.Title = String.Format(_stringLocalizer["Mã đã tồn tại"], "");
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Object = ex;
            }
            return Json(msg);
        }

        [HttpPost]
        public object GetItemPack(int id)
        {
            var msg = new JMessage { Error = false };
            try
            {
                var check = _context.ObjectiverPackCovers.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
                if (check != null)
                {
                    msg.Object = check;
                    msg.Title = String.Format(_sharedResources["COM_DELETE_SUCCESS"], "");
                }
                else
                {
                    msg.Error = true;
                    msg.Title = String.Format(_stringLocalizer["Mã không tồn tại"], "");
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Object = ex;
            }
            return Json(msg);
        }

        [HttpPost]
        public object UpdatePack([FromBody] ObjectiverPackCover data)
        {
            var msg = new JMessage { Error = false };
            try
            {
                var check = _context.ObjectiverPackCovers.FirstOrDefault(x => x.ObjPackCode == data.ObjPackCode && !x.IsDeleted);
                if (check != null)
                {
                    check.Name = data.Name;
                    check.ParentCode = data.ParentCode;
                    check.SpecSize = data.SpecSize;
                    check.Weight = data.Weight;
                    check.Unit = data.Unit;
                    check.Description = data.Description;

                    check.UpdatedBy = AppContext.UserName;
                    check.UpdatedTime = DateTime.Now;

                    _context.ObjectiverPackCovers.Update(check);
                    _context.SaveChanges();

                    msg.Title = String.Format(_sharedResources["COM_UPDATE_SUCCESS"], "");
                }
                else
                {
                    msg.Error = true;
                    msg.Title = String.Format(_stringLocalizer["Mã không tồn tại"], "");
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Object = ex;
            }
            return Json(msg);
        }

        [HttpPost]
        public object DeletePack(int id)
        {
            var msg = new JMessage { Error = false };
            try
            {
                var check = _context.ObjectiverPackCovers.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
                if (check != null)
                {
                    check.IsDeleted = true;
                    check.DeletedBy = AppContext.UserName;
                    check.DeletedTime = DateTime.Now;

                    _context.ObjectiverPackCovers.Update(check);
                    _context.SaveChanges();

                    msg.Title = String.Format(_sharedResources["COM_DELETE_SUCCESS"], "");
                }
                else
                {
                    msg.Error = true;
                    msg.Title = String.Format(_stringLocalizer["Mã không tồn tại"], "");
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Object = ex;
            }
            return Json(msg);
        }
        #endregion

        #region MetaData
        [HttpPost]
        public JsonResult GetListMetaType()
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == "META_TYPE").Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                if (data != null)
                {
                    msg.Object = data;
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Không tồn tại dữ liệu!";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Có lỗi khi lấy dữ liệu!";
            }
            return Json(msg);
        }
        [HttpPost]
        public JsonResult GetListMetaGroup()
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group == "META_GROUP").Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
                if (data != null)
                {
                    msg.Object = data;
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Không tồn tại dữ liệu!";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Có lỗi khi lấy dữ liệu!";
            }
            return Json(msg);
        }

        [HttpPost]
        public object UpdateMetaData(int? fileId, string metaDataExt)
        {
            var msg = new JMessage { Error = false };
            try
            {
                var check = _context.EDMSFiles.FirstOrDefault(x => !x.IsDeleted && x.FileID == fileId);
                if (check != null)
                {
                    check.MetaDataExt = metaDataExt;

                    check.UpdatedBy = AppContext.UserName;
                    check.UpdatedTime = DateTime.Now;

                    _context.EDMSFiles.Update(check);
                    _context.SaveChanges();

                    msg.Title = String.Format(_sharedResources["COM_UPDATE_SUCCESS"], "");
                }
                else
                {
                    msg.Error = true;
                    msg.Title = String.Format(_stringLocalizer["Tệp tin không tồn tại"], "");
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Object = ex;
            }
            return Json(msg);
        }

        [HttpPost]
        public object GetMetaData(int? fileId)
        {
            var msg = new JMessage { Error = false };
            try
            {
                var check = _context.EDMSFiles.FirstOrDefault(x => !x.IsDeleted && x.FileID == fileId);
                if (check != null)
                {
                    msg.Object = check;
                    msg.Title = String.Format(_sharedResources["COM_UPDATE_SUCCESS"], "");
                }
                else
                {
                    msg.Error = true;
                    msg.Title = String.Format(_stringLocalizer["Tệp tin không tồn tại"], "");
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Object = ex;
            }
            return Json(msg);
        }
        #endregion

        #region OCR Pdf
        public IActionResult PerformOCR()
        {
            string binaries = Path.Combine(_hostingEnvironment.ContentRootPath, "OCR/TesseractBinaries", "Windows");

            //Initialize OCR processor with tesseract binaries.
            OCRProcessor processor = new OCRProcessor(binaries);
            //Set language to the OCR processor.
            processor.Settings.Language = "vie";

            string path = Path.Combine(_hostingEnvironment.ContentRootPath, "OCR/Data", "times.ttf");
            FileStream fontStream = new FileStream(path, FileMode.Open);

            //Create a true type font to support unicode characters in PDF.
            processor.UnicodeFont = new PdfTrueTypeFont(fontStream, 8);

            //Set temporary folder to save intermediate files.
            processor.Settings.TempFolder = Path.Combine(_hostingEnvironment.ContentRootPath, "OCR/Data");

            //Load a PDF document.
            FileStream inputDocument = new FileStream(Path.Combine(_hostingEnvironment.ContentRootPath, "OCR/Data", "PDF_succinctly.pdf"), FileMode.Open);
            PdfLoadedDocument loadedDocument = new PdfLoadedDocument(inputDocument);

            //Perform OCR with language data.
            string tessdataPath = Path.Combine(_hostingEnvironment.ContentRootPath, "OCR/Tessdata");
            processor.PerformOCR(loadedDocument, tessdataPath);

            //Save the PDF document.
            MemoryStream outputDocument = new MemoryStream();
            loadedDocument.Save(outputDocument);
            outputDocument.Position = 0;

            //Dispose OCR processor and PDF document.
            processor.Dispose();
            loadedDocument.Close(true);

            //Download the PDF document in the browser.
            FileStreamResult fileStreamResult = new FileStreamResult(outputDocument, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            fileStreamResult.FileDownloadName = "OCRed_PDF_document.docx";

            return fileStreamResult;
        }

        #endregion

        #region Index
        [AllowAnonymous]
        [HttpPost]
        public object ResetIndexManual()
        {
            var msg = new JMessage { Title = "Reset index thành công!", Error = false };
            try
            {
                _luceneService.RebuildIndex();
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Có lỗi xảy ra!";
            }

            return msg;
        }
        #endregion

        #region Language
        [HttpGet]
        public IActionResult Translation(string lang)
        {
            var resourceObject = new JObject();
            var query = _stringLocalizer.GetAllStrings().Select(x => new { x.Name, x.Value })
                .Union(_contractController.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_stringLocalizerCommon.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_sharedResources.GetAllStrings().Select(x => new { x.Name, x.Value }));
            foreach (var item in query)
            {
                resourceObject.Add(item.Name, item.Value);
            }
            return Ok(resourceObject);
        }
        #endregion
    }
}
public class EDMSRepositoryUserModel
{
    public string Id { get; set; }
    public string UserName { get; set; }
}
public class EDMSRepositoryFileModel
{
    public string FileCode { get; set; }
    public string FileName { get; set; }
    public string FileType { get; set; }
    public string Tags { get; set; }
    public string Desc { get; set; }
    public string ReposCode { get; set; }
    public string FilePath { get; set; }
}
public class JtableFileModel : JTableModel
{
    public string ObjectType { get; set; }
    public string ObjectCode { get; set; }
    public string FromDate { get; set; }
    public string ToDate { get; set; }
    public string Name { get; set; }
    public int? FileType { get; set; }
    public string Content { get; set; }
    public string Tags { get; set; }
    public string[] ListRepository { get; set; }
    public string TypeTab { get; set; }
    public string ContractCode { get; set; }
    public string CustomerCode { get; set; }
    public string SupplierCode { get; set; }
    public string ProjectCode { get; set; }
    public string UserUpload { get; set; }
    public bool RecentFile { get; set; }
}
public class EDMSJtableFileModel
{
    //Id bảng 
    public int Id { get; set; }
    public int FileID { get; set; }
    public string FileCode { get; set; }
    public string FileName { get; set; }
    public string FileType { get; set; }
    public string FileTypePhysic { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? CreatedTime { get; set; }
    public string Tags { get; set; }
    public string Url { get; set; }
    public string Content { get; set; }
    public string MimeType { get; set; }
    public string ReposName { get; set; }
    public string CloudFileId { get; set; }
    public string ServerAddress { get; set; }
    public string Category { get; set; }
    public string FolderName { get; set; }
    public decimal FileSize { get; set; }
    public decimal SizeOfFile { get; set; }
    public string Line { get; set; }
    public string Page { get; set; }
    public string CatName { get; set; }
    public string MetaDataExt { get; set; }
    public string FreqCount { get; set; }
    public string UrlPost { get; set; }
    public string IdentifierCode { get; set; }
    public string PackHierarchy { get; set; }
    public string ZoneHierarchy { get; set; }
    public string PackCode { get; set; }
    public string PackZoneLocation { get; set; }
    public string TotalRow { get; set; }
    public string TotalCapacity { get; set; }
    public bool? IsScan { get; set; }
}

public class JTableModelFile : JTableModel
{
    public int? FileID { get; set; }
    public string RequestCode { get; set; }
    public string FromDate { get; set; }
    public string ToDate { get; set; }
    public string CatCode { get; set; }
}

public class FileShareModel
{
    public int? Id { get; set; }
    public string ListUserShare { get; set; }
}

public class UserShare
{
    public string Code { get; set; }
    public string Name { get; set; }
    public string DepartmentName { get; set; }
    public PermissionFile Permission { get; set; }
}

public class UserShareModel
{
    public string FileId { get; set; }
    public string ListUserShare { get; set; }
    public List<UserShare> UserShares { get; set; }
}

//Category
//[HttpPost]
//public object JtreeRepository()
//{
//    var getRepository = _context.EDMSRepositorys.Where(x => !x.IsDeleted).OrderByDescending(x => x.ReposID).AsNoTracking();
//    return getRepository;
//}

//[HttpPost]
//public List<TreeViewResource> GetTreeRepository()
//{
//    var data = _context.EDMSRepositorys.Where(x => x.IsDeleted == false).OrderByDescending(x => x.ReposID).AsNoTracking();
//    var dataOrder = GetSubTreeData(data.ToList(), null, new List<TreeViewResource>(), 0);
//    return dataOrder;
//}




//[HttpGet]
//public JsonResult GetItemRepository(string reposCode)
//{
//    var msg = new JMessage { Error = false, Title = "" };
//    try
//    {
//        var data = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == reposCode);
//        if (data != null)
//        {
//            var model = new EDMSRepository
//            {
//                ReposID = data.ReposID,
//                ReposCode = data.ReposCode,
//                ReposName = data.ReposName,
//                Account = data.Account,
//                Parent = data.Parent,
//                Token = data.Token,
//                PathPhysic = data.PathPhysic
//            };
//            msg.Object = model;
//        }
//        else
//        {
//            msg.Error = true;
//            msg.Title = String.Format(_stringLocalizer["EDMSR_MSG_REPOSITORY_NOT_EXIST"));//"Kho dữ liệu không tồn tại";
//        }
//    }
//    catch (Exception ex)
//    {
//        msg.Error = true;
//        msg.Object = ex.Message;
//        msg.Title = String.Format(_stringLocalizer["EDMSR_MSG_ERROR_REPOSITORY"));//"Có lỗi khi lấy kho dữ liệu!";
//    }
//    return Json(msg);
//}

//[HttpPost]
//public JsonResult InsertRepository([FromBody]EDMSRepository obj)
//{
//    var msg = new JMessage { Error = false, Title = "" };
//    try
//    {
//        if (obj == null)
//        {
//            msg.Error = true;
//            msg.Title = String.Format(_stringLocalizer["EDMSR_MSG_ADD_REPOSITORY_ERROR"));//"Có lỗi khi thêm kho dữ liệu!";
//        }
//        else
//        {
//            //check exist code
//            var checkExistCode = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == obj.ReposCode);
//            if (checkExistCode != null)
//            {
//                msg.Error = true;
//                msg.Title = String.Format(_stringLocalizer["EDMSR_MSG_REPOSITORY_CODE_EXISTED"));//"Mã kho dữ liệu đã tồn tại";
//            }
//            else
//            {
//                if (string.IsNullOrEmpty(obj.Parent))
//                {
//                    string pathUpload = _hostingEnvironment.WebRootPath + Path.Combine("\\uploads\\repository", obj.ReposName);
//                    if (System.IO.Directory.Exists(pathUpload))
//                    {
//                        msg.Error = true;
//                        msg.Title = String.Format(_stringLocalizer["EDMSR_MSG_REPOSITORY_NAME_EXISTED"));//"Tên kho dữ liệu đã tồn tại";
//                    }
//                    else
//                    {
//                        System.IO.Directory.CreateDirectory(pathUpload);
//                        obj.Parent = "#";
//                        obj.CreatedBy = ESEIM.AppContext.UserName;
//                        obj.CreatedTime = DateTime.Now;
//                        obj.PathPhysic = Path.Combine("\\uploads\\repository", obj.ReposName);
//                        _context.EDMSRepositorys.Add(obj);
//                        _context.SaveChanges();
//                        msg.Title = String.Format(_stringLocalizer["EDMSR_MSG_CREATE_SUCCESS_REPOSITORY"));//"Tạo kho dữ liệu thành công";
//                    }
//                }
//                else
//                {
//                    var getParent = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == obj.Parent);
//                    string pathUpload = _hostingEnvironment.WebRootPath + Path.Combine(getParent.PathPhysic, obj.ReposName);
//                    if (System.IO.Directory.Exists(pathUpload))
//                    {
//                        msg.Error = true;
//                        msg.Title = String.Format(_stringLocalizer["EDMSR_MSG_REPOSITORY_NAME_EXISTED"));//"Tên kho dữ liệu đã tồn tại";
//                    }
//                    else
//                    {
//                        System.IO.Directory.CreateDirectory(pathUpload);
//                        obj.Parent = obj.Parent;
//                        obj.CreatedBy = ESEIM.AppContext.UserName;
//                        obj.CreatedTime = DateTime.Now;
//                        obj.PathPhysic = Path.Combine(getParent.PathPhysic, obj.ReposName);
//                        _context.EDMSRepositorys.Add(obj);
//                        _context.SaveChanges();
//                        msg.Title = String.Format(_stringLocalizer["EDMSR_MSG_CREATE_SUCCESS_REPOSITORY"));//"Tạo kho dữ liệu thành công";
//                    }
//                }
//            }
//        }
//    }
//    catch (Exception ex)
//    {
//        msg.Error = true;
//        msg.Object = ex.Message;
//        msg.Title = String.Format(_stringLocalizer["EDMSR_MSG_ADD_REPOSITORY_FALSE"));// "Thêm kho dữ liệu sai!";
//    }
//    return Json(msg);
//}

//[HttpPost]
//public JsonResult UpdateRepository([FromBody]EDMSRepository obj)
//{
//    var msg = new JMessage { Error = false, Title = "" };
//    try
//    {
//        if (obj == null)
//        {
//            msg.Error = true;
//            msg.Title = String.Format(_stringLocalizer["EDMSR_MSG_UPDATE_REPOSITORY_FALSE"));//"Cập nhập kho dữ liệu sai!";
//        }
//        else
//        {
//            var data = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == obj.ReposCode);
//            if (data != null)
//            {
//                data.ReposName = obj.ReposName;
//                data.Account = obj.Account;
//                data.Desc = obj.Desc;
//                data.Server = obj.Server;
//                data.Token = obj.Token;
//                data.UpdatedBy = ESEIM.AppContext.UserName;
//                data.UpdatedTime = DateTime.Now;
//                if (data.Parent != obj.Parent)
//                {
//                    var parent = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == obj.Parent);
//                    if (parent == null)
//                    {
//                        if (data.Parent != "#")
//                        {
//                            var soure = _hostingEnvironment.WebRootPath + data.PathPhysic;
//                            var des = _hostingEnvironment.WebRootPath + "\\uploads\\repository";
//                            Directory.Move(soure, Path.Combine(des, data.ReposName));
//                            data.Parent = "#";
//                            data.PathPhysic = Path.Combine("\\uploads\\repository", data.ReposName);
//                            var listChild = _context.EDMSRepositorys.Where(x => x.ReposCode == data.ReposCode).Traverse(y => _context.EDMSRepositorys.Where(child => y.ReposCode == child.Parent)).Where(z => z.ReposCode != data.ReposCode).ToList();
//                            UpdatePathChild(listChild, data.ReposCode, data.PathPhysic);
//                        }
//                    }
//                    else
//                    {
//                        var soure = _hostingEnvironment.WebRootPath + data.PathPhysic;
//                        var des = _hostingEnvironment.WebRootPath + parent.PathPhysic;
//                        if (System.IO.Directory.Exists(Path.Combine(des, data.ReposName)))
//                        {
//                            msg.Error = true;
//                            msg.Title = "Tên kho dữ liệu chuyển tới đã tồn tại!";//"Cập nhập kho dữ liệu thành công";
//                            return Json(msg);
//                        }
//                        Directory.Move(soure, Path.Combine(des, data.ReposName));
//                        data.Parent = obj.Parent;
//                        data.PathPhysic = Path.Combine(parent.PathPhysic, data.ReposName);
//                        var listChild = _context.EDMSRepositorys.Where(x => x.ReposCode == data.ReposCode).Traverse(y => _context.EDMSRepositorys.Where(child => y.ReposCode == child.Parent)).Where(z => z.ReposCode != data.ReposCode).ToList();
//                        UpdatePathChild(listChild, data.ReposCode, data.PathPhysic);
//                    }
//                }
//                else
//                {
//                    if (data.ReposName != obj.ReposName)
//                    {
//                        var soure = _hostingEnvironment.WebRootPath + data.PathPhysic;
//                        var des = soure.Replace(data.ReposName, obj.ReposName);
//                        Directory.Move(soure, Path.Combine(des, data.ReposName));
//                        data.PathPhysic = des;
//                        var listChild = _context.EDMSRepositorys.Where(x => x.ReposCode == data.ReposCode).Traverse(y => _context.EDMSRepositorys.Where(child => y.ReposCode == child.Parent)).Where(z => z.ReposCode != data.ReposCode).ToList();
//                        UpdatePathChild(listChild, data.ReposCode, data.PathPhysic);
//                    }
//                }
//                _context.EDMSRepositorys.Update(data);
//                _context.SaveChanges();
//                msg.Title = String.Format(_stringLocalizer["EDMSR_MSG_UPDATE_REPOSITORY_SUCCESS"));//"Cập nhập kho dữ liệu thành công";
//            }
//            else
//            {
//                msg.Error = true;
//                msg.Title = String.Format(_stringLocalizer["EDMSR_MSG_REPOSITORY_NOT_EXIST"));//"Kho dữ liệu không tồn tại!";
//            }
//        }
//    }
//    catch (Exception ex)
//    {
//        msg.Error = true;
//        msg.Object = ex.Message;
//        msg.Title = String.Format(_stringLocalizer["EDMSR_MSG_UPDATE_REPOSITORY_ERROR"));// "Cập nhập kho dữ liệu lỗi!";
//    }
//    return Json(msg);
//}

//[HttpPost]
//public JsonResult DeleteRepository(string reposCode)
//{
//    var msg = new JMessage { Error = false, Title = "" };
//    try
//    {
//        var repository = _context.EDMSRepositorys.FirstOrDefault(x => x.ReposCode == reposCode);
//        var listFile = _context.EDMSFiles.Where(x => x.ReposCode == reposCode);
//        if (System.IO.Directory.Exists(_hostingEnvironment.WebRootPath + repository.PathPhysic))
//            System.IO.Directory.Delete(_hostingEnvironment.WebRootPath + repository.PathPhysic, true);
//        _context.EDMSRepositorys.Remove(repository);
//        _context.EDMSFiles.RemoveRange(listFile);
//        _context.SaveChanges();
//        msg.Title = String.Format(_stringLocalizer["EDMSR_MSG_DELETE_REPOSITORY_SUCCESS"));//"Xóa thành công kho dữ liệu";
//    }
//    catch (Exception ex)
//    {
//        msg.Error = true;
//        msg.Object = ex.Message;
//        msg.Title = String.Format(_stringLocalizer["EDMSR_MSG_DELETE_REPOSITORY_ERROR"));//"Xóa kho dữ liệu lỗi";
//    }
//    return Json(msg);
//}
//[NonAction]
//public void UpdatePathChild(List<EDMSRepository> data, string parentCode, string pathParent)
//{
//    var contents = data.Where(x => x.Parent == parentCode).OrderByDescending(x => x.ReposCode).AsParallel();
//    foreach (var item in contents)
//    {
//        item.PathPhysic = Path.Combine(pathParent, item.ReposName);
//        _context.EDMSRepositorys.Update(item);
//        var hasChild = data.Any(x => x.Parent == item.ReposCode);
//        if (hasChild) UpdatePathChild(data, item.ReposCode, item.PathPhysic);
//    }
//}
//End category