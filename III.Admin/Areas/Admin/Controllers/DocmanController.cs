using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using Aspose.Pdf.Operators;
using Dropbox.Api.TeamLog;
using ESEIM.Models;
using ESEIM.Utils;
using FTU.Utils.HelperNet;
using III.Domain.Enums;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OpenXmlPowerTools;
using Quartz.Util;
using Syncfusion.DocIO.DLS;
using static III.Admin.Controllers.WorkflowActivityController;
using AppContext = ESEIM.AppContext;

namespace III.Admin.Controllers
{
    [Area("Admin")]
    public class DocmanController : BaseController
    {
        private readonly EIMDBContext _context;
        private readonly IUploadService _upload;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IStringLocalizer<DocmanController> _stringLocalizer;
        private readonly IStringLocalizer<SharedResources> _sharedResources;

        public DocmanController(EIMDBContext context, IUploadService upload, IHostingEnvironment hostingEnvironment,
            IStringLocalizer<DocmanController> stringLocalizer, IStringLocalizer<SharedResources> sharedResources)
        {
            _hostingEnvironment = hostingEnvironment;
            _context = context;
            _upload = upload;
            _stringLocalizer = stringLocalizer;
            _sharedResources = sharedResources;

            //this.filepath = FilePathEdit;
        }

        public static AseanDocument docmodel = new AseanDocument();
        public static string pathFile = new string("");
        public static string cardCode = new string("");
        public static string pathFileFTP = new string("");
        public IActionResult Index()
        {
            return View(docmodel);
        }

        #region Editfile
        public ActionResult Default()
        {
            List<object> exportItems = new List<object>();
            exportItems.Add(new { text = "Microsoft Word (.docx)", id = "word" });
            exportItems.Add(new { text = "Syncfusion Document Text (.sfdt)", id = "sfdt" });
            ViewBag.ExportItems = exportItems;
            return View();
        }

        [AcceptVerbs("Post")]
        public string Import(IFormCollection data)
        {
            if (data.Files.Count == 0)
                return null;
            Stream stream = new MemoryStream();
            IFormFile file = data.Files[0];
            int index = file.FileName.LastIndexOf('.');
            string type = index > -1 && index < file.FileName.Length - 1 ?
                file.FileName.Substring(index) : ".docx";
            file.CopyTo(stream);
            stream.Position = 0;

            Syncfusion.EJ2.DocumentEditor.WordDocument document = Syncfusion.EJ2.DocumentEditor.WordDocument.Load(stream, GetFormatType(type.ToLower()));
            string sfdt = Newtonsoft.Json.JsonConvert.SerializeObject(document);
            document.Dispose();

            return sfdt;
        }
        [HttpPost]
        //đã truyền dữ liệu
        public JsonResult Open(IFormFile fileUpload, AseanDocument obj)
        {
            var msg = new JMessage { Title = "", Error = false };
            try
            {
                if (obj.IsEdited == true && obj.IsDeleted == false)//check is_edit
                {
                    msg.Error = true;
                    msg.Title = _sharedResources["File không tồn tại hoặc đang được sửa chữa"];
                    return Json(msg);
                }
                else
                {
                    if (pathFile != "")
                    {
                        var path = _hostingEnvironment.WebRootPath + "/" + pathFile;
                        int index = pathFile.LastIndexOf('.');
                        string type = index > -1 && index < pathFile.Length - 1 ?
                            pathFile.Substring(index) : ".docx";
                        FileStream fileStreamPath = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                        Syncfusion.EJ2.DocumentEditor.WordDocument document1 = Syncfusion.EJ2.DocumentEditor.WordDocument.Load(fileStreamPath, GetFormatType(type.ToLower()));
                        string s = Newtonsoft.Json.JsonConvert.SerializeObject(document1);
                        document1.Dispose();
                        return Json(s);
                    }
                    else
                    {
                        var path = _hostingEnvironment.WebRootPath + "/" + docmodel.File_Path;
                        int index = docmodel.File_Path.LastIndexOf('.');
                        string type = index > -1 && index < docmodel.File_Path.Length - 1 ?
                            docmodel.File_Path.Substring(index) : ".docx";
                        FileStream fileStreamPath = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                        Syncfusion.EJ2.DocumentEditor.WordDocument document1 = Syncfusion.EJ2.DocumentEditor.WordDocument.Load(fileStreamPath, GetFormatType(type.ToLower()));
                        string s = Newtonsoft.Json.JsonConvert.SerializeObject(document1);
                        document1.Dispose();
                        return Json(s);
                    }

                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
            };

            return Json(msg);
        }

        internal static Syncfusion.EJ2.DocumentEditor.FormatType GetFormatType(string format)
        {
            if (string.IsNullOrEmpty(format))
                throw new NotSupportedException("EJ2 DocumentEditor does not support this file format.");
            switch (format.ToLower())
            {
                case ".dotx":
                case ".docx":
                case ".docm":
                case ".dotm":
                    return Syncfusion.EJ2.DocumentEditor.FormatType.Docx;
                case ".dot":
                case ".doc":
                    return Syncfusion.EJ2.DocumentEditor.FormatType.Doc;
                case ".rtf":
                    return Syncfusion.EJ2.DocumentEditor.FormatType.Rtf;
                case ".txt":
                    return Syncfusion.EJ2.DocumentEditor.FormatType.Txt;
                case ".xml":
                    return Syncfusion.EJ2.DocumentEditor.FormatType.WordML;
                default:
                    throw new NotSupportedException("EJ2 DocumentEditor does not support this file format.");
            }
        }

        [HttpPost]
        public JsonResult Save(IFormFile fileUpload)
        {
            var msg = new JMessage { Title = _sharedResources["COM_MSG_SUCCES_SAVE"], Error = false };
            try
            {
                var session = HttpContext.GetSessionUser();

                var edmsFile = _context.EDMSFiles.FirstOrDefault(x => x.FileCode.Equals(docmodel.File_Code));
                var pathVersion = "/uploads/files/fileVersion/";
                var pathUpload = string.Concat(_hostingEnvironment.WebRootPath, pathVersion);
                if (!Directory.Exists(pathUpload)) Directory.CreateDirectory(pathUpload);
                var filePath = Path.GetTempFileName();

                if (edmsFile != null)
                {
                    var edmsRepoCatFiles = _context.EDMSRepoCatFiles.FirstOrDefault(x => x.FileCode.Equals(edmsFile.FileCode));
                    if (edmsFile.IsFileMaster == false)
                    {
                        msg.Error = true;
                        msg.Title = _sharedResources["COM_MSG_NOT_EDIT_FILE_HISTORY"];
                        msg.ID = edmsFile.FileID;
                        return Json(msg);
                    }
                    if (edmsFile.IsEdit == false && !User.Identity.Name.Equals(edmsFile.EditedFileBy) && !edmsFile.IsDeleted)
                    {
                        msg.Error = true;
                        msg.Title = _sharedResources["COM_MSG_EDITED_PEOPLE_OTHER"];
                        return Json(msg);
                    }
                    else
                    {
                        var pathTempFile = "/" + docmodel.File_Path;
                        var fullPath = Path.Combine(pathUpload, Path.GetFileName(pathTempFile));
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            fileUpload.CopyTo(stream);
                            stream.Close();
                        }
                        if (docmodel.IsSign)
                        {
                            //Xóa file trên ftp
                            var msg2 = DeleteFile(edmsRepoCatFiles.Id);
                            if (msg2.Error == true)
                            {
                                return Json(msg2);
                            }
                            EDMSRepoCatFileModel model = new EDMSRepoCatFileModel();

                            //Update to server and update to database
                            msg2 = InsertFile(edmsFile, fileUpload);
                            if (msg2.Error == true)
                            {
                                return Json(msg2);
                            }
                        }

                        var path = _hostingEnvironment.WebRootPath + "/" + docmodel.File_Path;
                        var filePathsaved = Path.GetTempFileName();
                        using (var stream1 = new FileStream(path, FileMode.Create))
                        {
                            fileUpload.CopyTo(stream1);
                            stream1.Close();
                        }

                        var pathSaveToFtp = _hostingEnvironment.WebRootPath + "/uploads/repository/" + docmodel.FullPathView;
                        System.IO.File.Copy(path, pathSaveToFtp, true);

                        //Xử lý log file sửa theo từng phiên bản ở đây
                        //Bước 1: Lấy file temp đã sửa copy qua thư mục của nó và đổi tên, thêm 1 bản ghi vào bảng EDMS_FILES, EDMS_REPO_CAT_FILE

                        var edmsRepoCatFile = _context.EDMSRepoCatFiles.FirstOrDefault(x => x.FileCode.Equals(docmodel.File_Code));
                        if (edmsFile != null && edmsRepoCatFile != null)
                        {
                            var url = string.Concat(edmsRepoCatFile.Path, "/", docmodel.File_Path.Split("/").Last());
                            var pathEditSaveToFtp = _hostingEnvironment.WebRootPath + "/uploads/repository/" + url;
                            System.IO.File.Copy(path, pathEditSaveToFtp, true);

                            var fileName = FileExtensions.CleanFileName(Path.GetFileName(edmsFile.FileName));
                            fileName = Path.GetFileNameWithoutExtension(fileName)
                                      + "_"
                                      + DateTime.Now.ToString("ddMMyyyy_HHmmss")
                                      + Path.GetExtension(fileName);

                            var check = _context.EDMSFiles.Any(x => x.FileParentId.Equals(edmsFile.FileID) && x.IsFileMaster == false && x.Url.Equals(url));
                            if (!check)
                            {
                                var emdsFileEdit = new EDMSFile
                                {
                                    FileCode = string.Concat("FILE_EDIT", Guid.NewGuid().ToString()),
                                    FileName = fileName,
                                    FileSize = edmsFile.FileSize,
                                    FileTypePhysic = edmsFile.FileTypePhysic,
                                    ReposCode = edmsFile.ReposCode,
                                    CreatedBy = edmsFile.CreatedBy,
                                    CreatedTime = edmsFile.CreatedTime,
                                    UpdatedBy = edmsFile.UpdatedBy,
                                    UpdatedTime = edmsFile.UpdatedTime,
                                    NumberDocument = edmsFile.NumberDocument,
                                    MimeType = edmsFile.MimeType,
                                    IsEdit = false,
                                    IsFileMaster = false,
                                    FileParentId = edmsFile.FileID,
                                    EditedFileBy = User.Identity.Name,
                                    EditedFileTime = DateTime.Now,
                                    Url = url
                                };

                                _context.EDMSFiles.Add(emdsFileEdit);

                                var emdsRepoCatFileEdit = new EDMSRepoCatFile
                                {
                                    FileCode = emdsFileEdit.FileCode,
                                    CatCode = edmsRepoCatFile.CatCode,
                                    ObjectCode = edmsRepoCatFile.ObjectCode,
                                    ObjectType = edmsRepoCatFile.ObjectType,
                                    Path = edmsRepoCatFile.Path,
                                    FolderId = edmsRepoCatFile.FolderId,
                                    ReposCode = edmsFile.ReposCode,
                                };

                                _context.EDMSRepoCatFiles.Add(emdsRepoCatFileEdit);
                                var listUserView = !string.IsNullOrEmpty(edmsFile.ListUserView) ? JsonConvert.DeserializeObject<List<string>>(edmsFile.ListUserView) : new List<string>();
                                var userRemove = listUserView.FirstOrDefault(x => x.Equals(session.FullName));
                                if (userRemove != null)
                                    listUserView.Remove(userRemove);

                                //edmsFile.IsEdit = true;
                                edmsFile.EditedFileBy = User.Identity.Name;
                                edmsFile.EditedFileTime = DateTime.Now;
                                edmsFile.ListUserView = JsonConvert.SerializeObject(listUserView);

                                if (listUserView.Count == 0)
                                    edmsFile.ListUserView = string.Empty;

                                _context.EDMSFiles.Update(edmsFile);

                                _context.SaveChanges();

                                //Xử lý phần file theo version
                                if (!string.IsNullOrEmpty(docmodel.ObjCode) && !string.IsNullOrEmpty(docmodel.ObjType))
                                {
                                    msg = LogFileByVersion(docmodel.File_Path);
                                }
                            }
                        }
                    }
                }
                else
                {
                    var attachment = _context.CardAttachments.FirstOrDefault(x => x.FileCode == docmodel.File_Code && x.CardCode == cardCode);
                    if (attachment != null)
                    {
                        var fullPath = Path.Combine(pathUpload, Path.GetFileName(pathFile));
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            fileUpload.CopyTo(stream);
                            stream.Close();
                        }
                        var path = _hostingEnvironment.WebRootPath + pathFile;
                        var filePathsaved = Path.GetTempFileName();
                        using (var stream1 = new FileStream(path, FileMode.Create))
                        {
                            fileUpload.CopyTo(stream1);
                            stream1.Close();
                        }

                        var listUserView = !string.IsNullOrEmpty(attachment.ListUserView) ? JsonConvert.DeserializeObject<List<string>>(attachment.ListUserView) : new List<string>();
                        var userRemove = listUserView.FirstOrDefault(x => x.Equals(session.FullName));
                        if (userRemove != null)
                            listUserView.Remove(userRemove);

                        attachment.ListUserView = JsonConvert.SerializeObject(listUserView);
                        attachment.IsEdit = true;

                        _context.CardAttachments.Update(attachment);
                        _context.SaveChanges();
                    }
                    else
                    {
                        //Tạo file theo version và gọi hàm LogChangeDocument
                        var fileNameVersion = "FILE_VERSION_"
                             + Guid.NewGuid().ToString().Substring(0, 8)
                             + Path.GetExtension(pathFile);
                        var fullPathVersion = Path.Combine(pathUpload, fileNameVersion);

                        using (var stream = new FileStream(fullPathVersion, FileMode.Create))
                        {
                            fileUpload.CopyTo(stream);
                            stream.Close();
                        }

                        //Xử lý phần file theo version
                        if (!string.IsNullOrEmpty(docmodel.ObjCode) && !string.IsNullOrEmpty(docmodel.ObjType))
                        {
                            var filePathVersion = string.Concat(pathVersion, fileNameVersion);
                            msg = LogFileByVersion(filePathVersion);
                        }


                        //Lưu lại ghi đè file gốc
                        var path = _hostingEnvironment.WebRootPath + pathFile;
                        var filePathsaved = Path.GetTempFileName();
                        using (var stream1 = new FileStream(path, FileMode.Create))
                        {
                            fileUpload.CopyTo(stream1);
                            stream1.Close();
                        }
                    }
                }

                //Xử lý log change theo file doc hoặc docx
                if (!string.IsNullOrEmpty(pathFile) &&
                   (Path.GetExtension(pathFile).ToUpper().Equals(".DOC") ||
                    Path.GetExtension(pathFile).ToUpper().Equals(".DOCX")))
                {
                    msg = LogChangeDocument(fileUpload);
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"] + ": " + ex.Message;
            }

            return Json(msg);
        }
        [NonAction]
        public JMessage InsertFile(EDMSFile obj, IFormFile fileUpload)
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
                    return msg;
                }

                string reposCode = "";
                string catCode = "";
                string path = "";
                string folderId = "";

                var setting = _context.EDMSCatRepoSettings.FirstOrDefault(x => x.Id == 3484);
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
                    return msg;
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
                            return msg;
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
                            return msg;
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

                var edmsReposCatFile = _context.EDMSRepoCatFiles.FirstOrDefault(x => x.FileCode.Equals(obj.FileCode));

                //{
                //    FileCode = string.Concat("REPOSITORY", Guid.NewGuid().ToString()),
                //    ReposCode = reposCode,
                //    CatCode = catCode,
                //    ObjectCode = obj.ObjectCode,
                //    ObjectType = obj.ObjectType,
                //    Path = path,
                //    FolderId = folderId
                //};
                //_context.EDMSRepoCatFiles.Add(edmsReposCatFile);

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
                var file = _context.EDMSFiles.FirstOrDefault(x => x.Id == obj.Id);
                if(file!=null)
                {
                    file.FileSize = fileUpload.Length;
                    file.FileName = fileUpload.FileName;
                    file.Url = urlFile;
                    file.MimeType = mimeType;
                    file.CloudFileId = fileId;
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _sharedResources["COM_MSG_ERR"];
                }
                _context.EDMSFiles.Update(file);

                if (docmodel.IsSign)
                {
                    var fileInst = _context.ActivityInstFiles.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == edmsReposCatFile.ObjectCode && x.FileID == obj.FileCode);
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
                            SignTime = DateTime.Now,
                            Actins = edmsReposCatFile.ObjectCode
                        };
                        lstJsonSign.Add(jsonSign);

                        fileInst.SignatureJson = JsonConvert.SerializeObject(lstJsonSign);
                        fileInst.FilePath = "";
                        fileInst.IsSign = true;
                        fileInst.LstUserSign += string.Join(",", ESEIM.AppContext.UserId);
                        _context.ActivityInstFiles.Update(fileInst);
                    }
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
            return msg;
        }
        [NonAction]
        public JMessage DeleteFile(int id)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.EDMSRepoCatFiles.FirstOrDefault(x => x.Id == id);

                var file = _context.EDMSFiles.FirstOrDefault(x => x.FileCode == data.FileCode);

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
        [NonAction]
        public JMessage LogFileByVersion(string path)
        {
            var msg = new JMessage { Title = "Log thành công", Error = false };

            try
            {
                var lstActInstCode = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode == docmodel.WfInstCode)
                                                               .Select(x => x.ActivityInstCode).ToList();

                var fileVersions = _context.FileVersions.Where(x => !x.IsDeleted &&
                                                                    !string.IsNullOrEmpty(x.ObjCode) && lstActInstCode.Any(p => p == x.ObjCode) &&
                                                                    !string.IsNullOrEmpty(x.ObjCode) && x.ObjType.Equals(docmodel.ObjType)).ToList();

                var version = fileVersions.Count > 0 ? fileVersions.Max(x => x.Version + 1) : 1;

                var fileVersion = new FileVersion
                {
                    FileCode = docmodel.File_Code,
                    Url = path,
                    Version = version,
                    ObjCode = docmodel.ObjCode,
                    ObjType = docmodel.ObjType,
                    CreatedBy = User.Identity.Name,
                    CreatedTime = DateTime.Now
                };

                _context.FileVersions.Add(fileVersion);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }

            return msg;
        }

        [NonAction]
        public JMessage LogChangeDocument(IFormFile fileUpload)
        {
            var msg = new JMessage { Title = _sharedResources["COM_MSG_SUCCES_SAVE"], Error = false };
            try
            {
                var fileNameOld = docmodel.File_Name;
                var fileNameNew = fileUpload.FileName;

                var fileByteOlds = System.IO.File.ReadAllBytes(_hostingEnvironment.WebRootPath + pathFile);
                byte[] fileByteNews;
                using (var ms = new MemoryStream())
                {
                    fileUpload.CopyTo(ms);
                    fileByteNews = ms.ToArray();
                }

                var contentOld = new WmlDocument(fileNameOld, fileByteOlds);
                var contentNew = new WmlDocument(fileNameNew, fileByteNews);

                var setting = new WmlComparerSettings();
                var compareRs = WmlComparer.Compare(contentOld, contentNew, setting);
                var listRevision = WmlComparer.GetRevisions(compareRs, setting);

                string strRev = JsonConvert.SerializeObject(listRevision);

                //Insert Log Change
                var jsonArr = JArray.Parse(strRev);
                var textChange = jsonArr.AsEnumerable()
                    .Select(x => new
                    {
                        Status = x["RevisionType"].ToString().Equals("0") ? "Thêm mới" : "Xóa",
                        Text = x["Text"].ToString()
                    }).ToList();

                if (textChange.Where(x => string.IsNullOrEmpty(x.Text)).Count() != textChange.Count())
                {
                    string textlog = JsonConvert.SerializeObject(textChange);

                    var dt = new LogChangeDocument();
                    dt.UserID = ESEIM.AppContext.UserId;
                    dt.FileCode = docmodel.File_Code;
                    dt.FileType = docmodel.File_Type;
                    dt.FileName = docmodel.File_Name;
                    dt.LogText = textlog;
                    dt.CreatedBy = ESEIM.AppContext.UserName;
                    dt.CreatedTime = DateTime.Now;
                    dt.LogContent = strRev;
                    dt.ObjCode = docmodel.ObjCode;
                    dt.ObjType = docmodel.ObjType;
                    _context.LogChangeDocuments.Add(dt);
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }

            return msg;
        }

        [HttpPost]
        public object GetLogContent(string fileCode, string objCode, string objType)
        {
            var listData = _context.LogChangeDocuments.Where(x => x.FileCode.Equals(fileCode) &&
                                                                  (!string.IsNullOrEmpty(x.ObjCode) && x.ObjCode.Equals(objCode)) &&
                                                                  (!string.IsNullOrEmpty(x.ObjType) && x.ObjType.Equals(objType))).ToList();

            var listTextChange = new List<object>();
            var no = 1;
            foreach (var data in listData)
            {
                var obj = new
                {
                    No = "Lần sửa: " + no,
                    DataChange = JsonConvert.DeserializeObject<List<object>>(data.LogText)
                };

                listTextChange.Add(obj);

                no++;
            }

            return listTextChange;
        }

        [HttpPost]
        public object UnlockFile()
        {
            var msg = new JMessage { Title = "Mở khóa tệp thành công", Error = false };
            try
            {
                var timeNow = DateTime.Now;
                var timeMax = _context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals("TIME_UNLOCK_FILE")) != null ? int.Parse(_context.CommonSettings.FirstOrDefault(x => x.CodeSet.Equals("TIME_UNLOCK_FILE")).ValueSet) : 30;

                var fileLocks = _context.EDMSFiles.Where(x => !x.IsDeleted && x.EditedFileBy.Equals(User.Identity.Name) && x.IsFileMaster == true && x.IsEdit == false && x.EditedFileTime.HasValue && ((timeNow - x.EditedFileTime).Value.TotalMinutes) > timeMax).ToList();
                if (fileLocks.Count > 0)
                {
                    fileLocks.ForEach(x => { x.IsEdit = true; x.ListUserView = string.Empty; });
                    _context.EDMSFiles.UpdateRange(fileLocks);
                    _context.SaveChanges();
                }
                var fileCardLocks = _context.CardAttachments.Where(x => !x.Flag && x.IsEdit == true && x.UpdatedTime.HasValue && ((timeNow - x.UpdatedTime).Value.TotalMinutes > timeMax)).ToList();
                if (fileCardLocks.Count > 0)
                {
                    fileCardLocks.ForEach(x => { x.IsEdit = true; x.ListUserView = string.Empty; });
                    _context.CardAttachments.UpdateRange(fileCardLocks);
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {

                throw;
            }

            return msg;
        }
        #endregion

        #region Generate Word document
        [HttpPost]
        public JMessage GenerateSign(string path)
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
                msg.Title = "Người dùng chưa được khai báo chữ ký. Vui lòng cập nhật chữ ký";
                return msg;

            }
            var signBytes = new FileStream(userSignImage, FileMode.Open);
            try
            {
                WordDocument document = new WordDocument(fileStream, Syncfusion.DocIO.FormatType.Docx);
                if (!string.IsNullOrEmpty(userSignImage))
                {
                    //Add Bookmark  
                    IWSection section = document.Sections[0];
                    //section.Paragraphs[section.Paragraphs.Count-1].AppendBookmarkStart("signature");

                    ////Creates the bookmark navigator instance to access the bookmark
                    //BookmarksNavigator bookmarkNavigator = new BookmarksNavigator(document);
                    ////Moves the virtual cursor to the location before the end of the bookmark "signature"
                    //bookmarkNavigator.MoveToBookmark("signature");
                    //WPicture picture = bookmarkNavigator.InsertParagraphItem(ParagraphItemType.Picture) as WPicture;
                    //picture.LoadImage(signBytes);

                    var textQrCode = string.Concat(user.GivenName, " đã ký ", DateTime.Now.ToString("HH:mm dd/MM/yyyy"));

                    section.Paragraphs[section.Paragraphs.Count - 1].AppendText("\n");
                    section.Paragraphs[section.Paragraphs.Count - 1].AppendPicture(signBytes);
                    section.Paragraphs[section.Paragraphs.Count - 1].AppendText("\n");
                    section.Paragraphs[section.Paragraphs.Count - 1].AppendText(textQrCode);
                    section.Paragraphs[section.Paragraphs.Count - 1].AppendText("\n");
                    section.Paragraphs[section.Paragraphs.Count - 1].AppendPicture(CommonUtil.ResizeImage(CommonUtil.GeneratorQRCode(textQrCode), 100, 100));
                    //bookmarkNavigator.InsertText(string.Concat(User.Identity.Name, "_", DateTime.Now.ToString("ddMMyyyy_HH:mm")));
                    #region Saving document
                    MemoryStream memoryStream = new MemoryStream();
                    //Save the document into memory stream
                    document.Save(memoryStream, Syncfusion.DocIO.FormatType.Docx);
                    //Closes the Word document instance
                    document.Close();
                    fileStream.Dispose();

                    //Lưu 1 file sinh chữ ký
                    var pathVersion = "/uploads/files/fileVersion/";
                    var pathFileVersion = string.Concat(rootPath, pathVersion);
                    if (!Directory.Exists(pathFileVersion)) Directory.CreateDirectory(pathFileVersion);
                    var fileName = "FILE_VERSION_"
                              + Guid.NewGuid().ToString().Substring(0, 8)
                              + Path.GetExtension(path);
                    var fileVersionPath = string.Concat(pathFileVersion, fileName);
                    FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.Write);
                    FileStream fileVersion = new FileStream(fileVersionPath, FileMode.Create, FileAccess.Write);
                    memoryStream.WriteTo(file);
                    memoryStream.WriteTo(fileVersion);

                    file.Close();
                    fileVersion.Close();

                    signBytes.Close();
                    memoryStream.Position = 0;

                    msg.Object = string.Concat(pathVersion, fileName);
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Vui lòng thêm chữ ký số";
                    msg.Object = path;
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Ký thất bại";
                msg.Object = path;
                signBytes.Close();
                fileStream.Dispose();
            }

            return msg;
            #endregion
        }
        #endregion

        #region Language
        [HttpGet]
        public IActionResult Translation(string lang)
        {
            var resourceObject = new JObject();
            var query = _stringLocalizer.GetAllStrings().Select(x => new { x.Name, x.Value }).Union(_sharedResources.GetAllStrings().Select(x => new { x.Name, x.Value }));
            foreach (var item in query)
            {
                resourceObject.Add(item.Name, item.Value);
            }
            return Ok(resourceObject);
        }
        #endregion
    }
}
