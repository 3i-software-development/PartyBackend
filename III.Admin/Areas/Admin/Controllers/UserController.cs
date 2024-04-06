using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.ServiceModel;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using ESEIM.Models;
using ESEIM.Utils;
using Microsoft.EntityFrameworkCore;
using FTU.Utils.HelperNet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.EntityFrameworkCore.Storage;
using Remotion.Linq.Parsing.Structure;
using Microsoft.Extensions.Logging;
using ESEIM;
using III.Domain.Enums;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Globalization;
using Microsoft.AspNetCore.Identity.UI.V3.Pages.Account.Manage.Internal;
using SmartBreadcrumbs.Attributes;
using Syncfusion.EJ2.FileManager.Base;

namespace III.Admin.Controllers
{
    public class JTableModelCustom : JTableModel
    {
        public string GroupUser { set; get; }
        public string Role { set; get; }
        public string UserName { set; get; }
        public string GivenName { set; get; }
        public string Email { set; get; }
        public string EmployeeCode { set; get; }
        public string Status { set; get; }
        public string DepartmentCode { set; get; }
        public string BranchId { set; get; }
        public string RoleId { set; get; }
        public int Page { set; get; }
        public int Row { set; get; }
        public int ExportType { set; get; }
    }
    public class ChangeStatusUserModel : JTableModel
    {
        public List<string> ListId { set; get; }
        public string Reason { set; get; }
    }
    [Area("Admin")]
    public class UserController : BaseController
    {
        private readonly UserManager<AspNetUser> _userManager;
        private readonly UserManager<AspNetUser> _roleManager;
        private readonly EIMDBContext _context;
        private readonly AppSettings _appSettings;
        private readonly ILogger _logger;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IActionLogService _actionLog;
        private readonly IStringLocalizer<UserController> _stringLocalizer;
        private readonly IStringLocalizer<GroupUserController> _stringLocalizerGu;
        private readonly IStringLocalizer<SharedResources> _sharedResources;
        private readonly IRepositoryService _repositoryService;

        public UserController(
            IOptions<AppSettings> appSettings,
            EIMDBContext context,
            UserManager<AspNetUser> userManager,
            UserManager<AspNetUser> roleManager,
            ILogger<UserController> logger,
            IHostingEnvironment hostingEnvironment,
            IActionLogService actionLog,
            IStringLocalizer<UserController> stringLocalizer,
            IStringLocalizer<SharedResources> sharedResources,
            IRepositoryService repositoryService,
            IStringLocalizer<GroupUserController> stringLocalizerGu)
        {
            _userManager = userManager;
            _context = context;
            _roleManager = roleManager;
            _appSettings = appSettings.Value;
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
            _actionLog = actionLog;
            _stringLocalizer = stringLocalizer;
            _sharedResources = sharedResources;
            _repositoryService = repositoryService;
            _stringLocalizerGu = stringLocalizerGu;
        }

        [Breadcrumb("ViewData.CrumbUser", AreaName = "Admin", FromAction = "Index", FromController = typeof(UserManageHomeController))]
        [AdminAuthorize]
        public IActionResult Index()
        {
            ViewData["CrumbDashBoard"] = _sharedResources["COM_CRUMB_DASH_BOARD"];
            ViewData["CrumbMenuSystemSett"] = _sharedResources["COM_CRUMB_SYSTEM"];
            ViewData["CrumbUserManageHome"] = _sharedResources["COM_CRUMB_USER_MANAGE"];
            ViewData["CrumbUser"] = _stringLocalizer["ADM_USER_TITLE_USER"];
            return View();
        }

        [HttpPost]
        public object GetGroupResource()
        {
            var rs = _context.AdGroupUsers.OrderBy(x => x.GroupUserId).Select(x => new { Id = x.GroupUserId, Title = x.Title, Code = x.GroupUserCode }).AsNoTracking().ToList();
            return Json(rs);
        }

        [HttpPost]
        public object GetRole()
        {
            var data = _context.Roles.Where(x => x.Code != "ROOT" && x.Status).OrderBy(x => x.Ord);

            var session = HttpContext.GetSessionUser();
            if (session.IsSubAdmin)
            {
                var data1 = data.Where(x => (x.CreatedBy.Equals(session.UserName) && !string.IsNullOrEmpty(x.Type) && x.Type.Equals("SUB_ADMIN")) || session.ListRoleGroupUser.Any(p => !p.GroupUserCode.Equals("SUB_ADMIN") && p.RoleId.Equals(x.Id))).Select(x => new { x.Id, x.Title });
                return Json(data1);
            }

            return Json(data);
        }

        [HttpPost]
        public object GetOrganization()
        {
            var rs = GetTreeData(0);
            return Json(rs);
        }

        [HttpPost]
        public object GetDepartment()
        {
            var query = _context.AdDepartments
                .Where(x => x.IsEnabled && !x.IsDeleted)
                .OrderBy(o => o.DepartmentCode)
                .Select(x => new
                {
                    Code = x.DepartmentCode,
                    Name = x.Title,
                }).AsNoTracking().ToList();

            return Json(query);
        }

        [HttpPost]
        public object GetBranch()
        {
            //var BranId = _context.VIBOrganizations.Where(x => x.Code == "Branch").Select(x => new { x.Id }).AsNoTracking().SingleOrDefault();
            var rs = GetTreeData(2);
            return Json(rs);
        }

        [HttpPost]
        public JsonResult GetShift()
        {
            var data = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals("SHIFT"))
                .Select(x => new { Code = x.CodeSet, Value = x.ValueSet, Name = x.Title, Unit = x.Unit, IsChecked = false });
            return Json(data);
        }

        [HttpPost]
        public object GetProfitCenter()
        {
            //var ProfitCenterId = _context.VIBOrganizations.Where(x => x.Code == "PC").Select(x => new { x.Id }).AsNoTracking().SingleOrDefault();
            //var rs = GetTreeData(3);
            //return Json(rs);

            var query = _context.AdGroupUsers
                .Where(x => x.ParentCode == "P000" && x.IsEnabled)
                .OrderBy(o => o.GroupUserCode)
                .Select(x => new
                {
                    Code = x.GroupUserCode,
                    Name = x.Title,
                }).ToList();

            return Json(query);
        }

        [HttpPost]
        public object GetListRoleCombination()
        {
            return _context.CommonSettings.Where(x => x.Group == EnumHelper<UserEnum>.GetDisplayValue(UserEnum.Combination)).Select(x => new
            {
                Id = x.SettingID,
                Code = x.CodeSet,
                Name = x.ValueSet,
                Check = false
            }).OrderBy(x => x.Id);
        }

        [HttpGet]
        public object GetListGroupRole(string id)
        {
            if (!string.IsNullOrEmpty(id))
            {
                var query = from a in _context.AdUserInGroups
                            join b in _context.AdGroupUsers on a.GroupUserCode equals b.GroupUserCode
                            join c in _context.Roles on a.RoleId equals c.Id
                            where (a.UserId == id && a.IsMain == false)
                            select new
                            {
                                a.GroupUserCode,
                                GroupUser = b.Title,
                                Role = c.Title,
                                AppCode = a.ApplicationCode,
                                AppName = a.Application.Title,
                            };
                var rs = query.AsNoTracking().ToList();
                return Json(rs);
            }
            return null;
        }

        [HttpPost]
        public object JTable([FromBody] JTableModelCustom jTablePara)
        {
            var session = HttpContext.GetSessionUser();

            var query = new List<UserModelProceduce>();

            try
            {
                var listRoleUser = (from a in _context.AdUserInGroups.Where(x => !x.IsDeleted)
                                    join b in _context.AdGroupUsers.Where(x => !x.IsDeleted && x.IsEnabled) on a.GroupUserCode equals b.GroupUserCode
                                    join c in _context.Roles on a.RoleId equals c.Id
                                    select new
                                    {
                                        UserId = a.UserId,
                                        RoleCode = c.Code,
                                        RoleName = c.Title,
                                        GroupCode = b.GroupUserCode,
                                        GroupName = b.Title
                                    }).ToList();

                if (session.IsSubAdmin)
                {
                    jTablePara.DepartmentCode = session.DepartmentCode;
                }

                int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;
                string[] param = new string[] { "@pageNo", "@pageSize", "@UserName", "@GroupUser", "@GivenName", "@Email", "@Status", "@BranchId", "@DepartmentId", "@IsSubAdmin", "@IsAllData", "@CurrentUserName" };
                object[] val = new object[] { jTablePara.CurrentPage, jTablePara.Length, jTablePara.UserName, jTablePara.GroupUser,
                    jTablePara.GivenName, jTablePara.Email, string.IsNullOrEmpty(jTablePara.Status) ? "" : jTablePara.Status,
                    jTablePara.BranchId, jTablePara.DepartmentCode, session.IsSubAdmin, session.IsAllData, session.UserName };
                DataTable rs = _repositoryService.GetDataTableProcedureSql("P_GET_LIST_USER", param, val);
                query = CommonUtil.ConvertDataTable<UserModelProceduce>(rs);

                foreach (var item in query)
                {
                    var listRoleGroup = listRoleUser.Where(x => x.UserId == item.Id).ToList();
                    if (listRoleGroup != null)
                    {
                        item.ListRoleGroup = listRoleGroup.Count() > 0 ? JsonConvert.SerializeObject(listRoleGroup) : "";
                    }
                    else
                    {
                        item.ListRoleGroup = "";
                    }
                }

                var count = query.FirstOrDefault().TotalRow;
                var data = query.AsQueryable().OrderUsingSortExpression(jTablePara.QueryOrderBy).AsNoTracking().ToList();
                var jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, count, "Id", "UserName", "Email", "FullName", "EmployeeCode", "CreatedDate", "Department", "Branch", "Description", "Active", "TypeStaff", "Role", "Picture", "ListRoleGroup", "Ord", "Color");
                return Json(jdata);
            }
            catch (Exception ex)
            {
                var jdata = JTableHelper.JObjectTable(query, jTablePara.Draw, 0, "Id", "UserName", "Email", "FullName", "EmployeeCode", "CreatedDate", "Department", "Branch", "Description", "Active", "TypeStaff", "Role", "Picture", "ListRoleGroup", "Ord", "Color");
                return Json(jdata);
            }
        }
        [HttpPost]
        public async Task<IActionResult> Insert(AspNetUserCustom obj, IFormFile image, IFormFile imageSign)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var us = await _context.Users.FirstOrDefaultAsync(x => x.UserName == obj.UserName);
                if (us == null)
                {
                    if (image != null && image.Length > 0)
                    {
                        var url = string.Empty;
                        var pathUpload = Path.Combine(_hostingEnvironment.WebRootPath, "uploads\\images");
                        if (!Directory.Exists(pathUpload)) Directory.CreateDirectory(pathUpload);
                        var fileName = Path.GetFileName(image.FileName);
                        fileName = Path.GetFileNameWithoutExtension(fileName)
                         + "_"
                         + Guid.NewGuid().ToString().Substring(0, 8)
                         + Path.GetExtension(fileName);
                        var filePath = Path.Combine(pathUpload, fileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await image.CopyToAsync(stream);
                        }
                        url = "/uploads/images/" + fileName;
                        obj.Picture = url;
                    }
                    else
                    {
                        obj.Picture = "/images/default/no_user.png";
                    }

                    if (imageSign != null && imageSign.Length > 0)
                    {
                        var url = string.Empty;
                        var pathUpload = Path.Combine(_hostingEnvironment.WebRootPath, "uploads\\images");
                        if (!Directory.Exists(pathUpload)) Directory.CreateDirectory(pathUpload);
                        var fileName = Path.GetFileName(imageSign.FileName);
                        fileName = Path.GetFileNameWithoutExtension(fileName)
                         + "_"
                         + Guid.NewGuid().ToString().Substring(0, 8)
                         + Path.GetExtension(fileName);
                        var filePath = Path.Combine(pathUpload, fileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await imageSign.CopyToAsync(stream);
                        }
                        url = "/uploads/images/" + fileName;
                        obj.SignImage = url;
                    }

                    AspNetUser objtemp = new AspNetUser()
                    {
                        UserName = obj.UserName.ToLower(),
                        Email = obj.Email,
                        PhoneNumber = obj.PhoneNumber,
                        OfficeNumber = obj.OfficeNumber,
                        FamilyName = obj.FamilyName,
                        MiddleName = obj.MiddleName,
                        GivenName = obj.GivenName,
                        EmployeeCode = obj.EmployeeCode,
                        DepartmentId = obj.DepartmentId,
                        BranchId = obj.BranchId,
                        //ProfitCenterId = obj.ProfitCenterId,
                        AccountExecutiveId = obj.AccountExecutiveId,
                        Active = obj.Active,
                        Note = obj.Note,
                        UserType = obj.UserType,
                        Description = obj.Description,
                        CreatedDate = DateTime.Now,
                        CreatedBy = ESEIM.AppContext.UserName,
                        NormalizedEmail = !string.IsNullOrEmpty(obj.Email) ? obj.Email.ToUpper() : null,
                        NormalizedUserName = obj.UserName.ToUpper(),
                        LockoutEnabled = true,
                        Picture = obj.Picture,
                        SecurityStamp = Guid.NewGuid().ToString(),
                        Area = obj.Area,
                        TypeStaff = obj.TypeStaff,
                        RoleCombination = obj.RoleCombination,
                        SignImage = obj.SignImage,
                        LeadersOfUser = obj.LeadersOfUser,
                        Balance = 10000
                    };
                    await _userManager.CreateAsync(objtemp, obj.Password);
                    //_context.Users.Add(objtemp);
                    //await _context.SaveChangesAsync();

                    // Add or update main role
                    if (!string.IsNullOrEmpty(obj.RoleId))
                    {
                        var userRole = await _context.UserRoles.FirstOrDefaultAsync(x => x.UserId == objtemp.Id);
                        if (userRole != null)
                        {
                            if (userRole.RoleId != obj.RoleId)
                            {
                                // Remove old role
                                _context.Remove(userRole);
                                // Add new role
                                var newUserRole = new IdentityUserRole<string>();
                                newUserRole.UserId = objtemp.Id;
                                newUserRole.RoleId = obj.RoleId;
                                _context.Add(newUserRole);
                            }
                        }
                        else
                        {
                            userRole = new IdentityUserRole<string>();
                            userRole.UserId = objtemp.Id;
                            userRole.RoleId = obj.RoleId;
                            _context.Add(userRole);
                        }

                        //if (string.IsNullOrEmpty(obj.ApplicationCode)) obj.ApplicationCode = "ADMIN";

                        // Add or update main group user

                        if (!string.IsNullOrEmpty(obj.GroupUserCode))
                        {
                            var listGroupUser = obj.GroupUserCode.Split(";");
                            foreach (var itemGroupUser in listGroupUser)
                            {
                                var userInGroup = await _context.AdUserInGroups.FirstOrDefaultAsync(x => x.UserId == objtemp.Id && x.GroupUserCode == itemGroupUser && x.IsMain);
                                if (userInGroup == null && !string.IsNullOrEmpty(itemGroupUser))
                                {
                                    userInGroup = new AdUserInGroup();
                                    userInGroup.GroupUserCode = itemGroupUser;
                                    //userInGroup.ApplicationCode = obj.ApplicationCode;
                                    userInGroup.ApplicationCode = "ADMIN";
                                    userInGroup.UserId = objtemp.Id;
                                    userInGroup.RoleId = obj.RoleId;
                                    userInGroup.GrantAll = true;
                                    userInGroup.IsMain = true;
                                    _context.Add(userInGroup); // Add entity
                                }
                                //// Add/Update user permission for department
                                //UpdatePermissionUserByGroup(_context, userInGroup.GroupUserCode, userInGroup.UserId, userInGroup.RoleId, "ADMIN", null, null, null);/* obj.ApplicationCode*/
                            }
                        }

                        // Add or update main profit center
                        var profitCenter = await _context.AdUserInGroups.FirstOrDefaultAsync(x => x.UserId == objtemp.Id && x.GroupUserCode == obj.ProfitCenterId && x.IsMain);
                        if (profitCenter == null && !string.IsNullOrEmpty(obj.ProfitCenterId))
                        {
                            profitCenter = new AdUserInGroup();
                            profitCenter.GroupUserCode = obj.ProfitCenterId;
                            //profitCenter.ApplicationCode = obj.ApplicationCode;
                            profitCenter.ApplicationCode = "ADMIN";
                            profitCenter.UserId = objtemp.Id;
                            profitCenter.RoleId = obj.RoleId;
                            profitCenter.GrantAll = true;
                            profitCenter.IsMain = true;
                            _context.Add(profitCenter); // Add entity
                            //                            // Add/Update user permission for profit center
                            //UpdatePermissionUserByGroup(_context, profitCenter.GroupUserCode, profitCenter.UserId, profitCenter.RoleId, "ADMIN", null, null, null); /*obj.ApplicationCode*/
                        }
                    }

                    var result = await _context.SaveChangesAsync();

                    //// Update permission
                    //UpdatePermissionUser(obj.UserType, objtemp.Id, obj.RoleId, obj.DepartmentId);
                    msg.Object = objtemp.Id;
                    msg.Title = String.Format(_sharedResources["COM_MSG_ADD_SUCCESS"], _stringLocalizer["ADM_USER_LBL_USER"].Value.ToLower());
                    ////_logger.LogInformation(LoggingEvents.LogDb, "Insert user successfully");

                }
                else
                {
                    msg.Error = true;
                    //msg.Title = "Nhân Viên Đã Tồn Tại";
                    msg.Title = String.Format(_sharedResources["COM_MSG_EXITS"], _stringLocalizer["ADM_USER_LBL_USER"]);
                    //_logger.LogError(LoggingEvents.LogDb, "Insert User Fail");
                    ////_actionLog.InsertActionLog("AspNetUsers", "Insert User Fail", null, null, "Error");
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex;
                //msg.Title = "Nhân Viên Thêm Thất Bại";
                msg.Title = String.Format(_sharedResources["COM_MSG_ADD_FAILED"], _stringLocalizer["ADM_USER_LBL_USER"]);
                //_logger.LogError(LoggingEvents.LogDb, "Insert User Fail");
                ////_actionLog.InsertActionLog("AspNetUsers", "An error occurred while Insert user", null, null, "Error");

            }
            return Json(msg);
        }
        public class ImageDataModel
        {
            public string Base64Data { get; set; }
            public string Id { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> UploadImageAsync([FromBody] ImageDataModel imageDataModel)
        {
            try
            {
                // Kiểm tra xem dữ liệu có tồn tại không

                var url = string.Empty;

                if (string.IsNullOrEmpty(imageDataModel?.Base64Data))
                {
                    return BadRequest("Dữ liệu hình ảnh không hợp lệ");
                }
                var us = await _context.Users.FirstOrDefaultAsync(x => x.Id == imageDataModel.Id);
                string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                // Tạo thư mục nếu nó không tồn tại
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Tạo tên tệp duy nhất dựa trên thời gian hiện tại
                string fileName = $"Signature"
                 + "_"
                 + Guid.NewGuid().ToString().Substring(0, 8)
                 + ".png" ;

                // Chuyển đổi dữ liệu base64 thành mảng byte của hình ảnh PNG
                byte[] imageBytes = Convert.FromBase64String(imageDataModel.Base64Data.Replace("data:image/png;base64,", ""));

                var pathUpload = Path.Combine(_hostingEnvironment.WebRootPath, "uploads\\images");
                if (!Directory.Exists(pathUpload)) Directory.CreateDirectory(pathUpload);


                // Trả về URL của hình ảnh đã tải lên
                string imageUrl = Url.Content($"~/uploads/{fileName}");

                var filePath = Path.Combine(pathUpload, fileName);

                System.IO.File.WriteAllBytes(filePath, imageBytes);
                
                url = "/uploads/images/" + fileName;
                us.SignImage = url;
                _context.Update(us);
                _context.SaveChanges();
                return Ok(imageUrl);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Update(AspNetUserCustom obj, IFormFile image, IFormFile imageSign, string base64Data)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var us = await _context.Users.FirstOrDefaultAsync(x => x.Id == obj.Id);
                var objOld = CommonUtil.Clone(us);
                if (us != null)
                {
                    if (obj.Active == false)
                    {
                        var isHasVcWorkPlan = _context.VcWorkPlans.Any(x => !x.IsDeleted && (x.UserName == us.UserName || x.CreatedBy == us.UserName));
                        if (isHasVcWorkPlan)
                        {
                            msg.Error = true;
                            msg.Title = String.Format(_sharedResources["COM_ERR_OBJ_USER"], _stringLocalizer["ADM_USER_TITLE_USER"]);
                            return Json(msg);
                        }
                    }
                    if (!string.IsNullOrEmpty(obj.Password))
                    {
                        string codeToken = await _userManager.GeneratePasswordResetTokenAsync(us);
                        var resultReset = await _userManager.ResetPasswordAsync(us, codeToken, obj.Password);
                    }

                    //us.UserName = obj.UserName.ToLower();
                    us.Email = obj.Email;
                    us.PhoneNumber = obj.PhoneNumber;
                    us.OfficeNumber = obj.OfficeNumber;
                    us.FamilyName = obj.FamilyName;
                    us.GivenName = obj.GivenName;
                    us.EmployeeCode = obj.EmployeeCode;
                    us.DepartmentId = obj.DepartmentId;
                    us.BranchId = obj.BranchId;
                    // us.ProfitCenterId = obj.ProfitCenterId;
                    us.AccountExecutiveId = obj.AccountExecutiveId;
                    us.Active = obj.Active;
                    us.UserType = obj.UserType;
                    us.Note = obj.Note;
                    us.Description = obj.Description;
                    us.Reason = obj.Reason;
                    us.UpdatedDate = DateTime.Now;
                    us.UpdatedBy = ESEIM.AppContext.UserName;
                    us.NormalizedEmail = !string.IsNullOrEmpty(obj.Email) ? obj.Email.ToUpper() : null;
                    us.NormalizedUserName = obj.UserName.ToUpper();
                    us.LockoutEnabled = true;
                    us.Area = obj.Area;
                    us.TypeStaff = obj.TypeStaff;
                    us.RoleCombination = obj.RoleCombination;
                    us.ShiftList = obj.ShiftList;
                    us.LeadersOfUser = obj.LeadersOfUser;

                    //Update shift HR employee
                    var employee = _context.HREmployees.FirstOrDefault(x => x.flag == 1 && x.Id.ToString() == us.EmployeeCode);
                    if (employee != null)
                    {
                        employee.ShiftList = obj.ShiftList;
                        _context.HREmployees.Update(employee);
                    }

                    if (image != null && image.Length > 0)
                    {
                        var url = string.Empty;
                        var pathUpload = Path.Combine(_hostingEnvironment.WebRootPath, "uploads\\images");
                        if (!Directory.Exists(pathUpload)) Directory.CreateDirectory(pathUpload);
                        var fileName = Path.GetFileName(image.FileName);
                        fileName = Path.GetFileNameWithoutExtension(fileName)
                         + "_"
                         + Guid.NewGuid().ToString().Substring(0, 8)
                         + Path.GetExtension(fileName);
                        var filePath = Path.Combine(pathUpload, fileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await image.CopyToAsync(stream);
                        }
                        url = "/uploads/images/" + fileName;
                        obj.Picture = url;
                        us.Picture = obj.Picture;
                    }

                    if (imageSign != null && imageSign.Length > 0)
                    {
                        var url = string.Empty;
                        var pathUpload = Path.Combine(_hostingEnvironment.WebRootPath, "uploads\\images");
                        if (!Directory.Exists(pathUpload)) Directory.CreateDirectory(pathUpload);
                        var fileName = Path.GetFileName(imageSign.FileName);
                        fileName = Path.GetFileNameWithoutExtension(fileName)
                         + "_"
                         + Guid.NewGuid().ToString().Substring(0, 8)
                         + Path.GetExtension(fileName);
                        var filePath = Path.Combine(pathUpload, fileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await imageSign.CopyToAsync(stream);
                        }
                        url = "/uploads/images/" + fileName;
                        us.SignImage = url;
                    }

                    var checkDepartmentMain = _context.AdUserDepartments.FirstOrDefault(x => !x.IsDeleted && x.IsMain && x.UserId.Equals(obj.Id));
                    if (checkDepartmentMain != null)
                        _context.AdUserDepartments.Remove(checkDepartmentMain);
                    var userInDepartment = new AdUserDepartment()
                    {
                        DepartmentCode = obj.DepartmentId,
                        UserId = obj.Id,
                        RoleId = obj.RoleId,
                        IsDeleted = false,
                        Branch = obj.BranchId,
                        IsMain = true
                    };
                    _context.AdUserDepartments.Add(userInDepartment);
                    _context.Update(us);
                    // Update main role
                    if (!string.IsNullOrEmpty(obj.RoleId))
                    {
                        var userRole = await _context.UserRoles.FirstOrDefaultAsync(x => x.UserId == us.Id);
                        if (userRole != null)
                        {
                            if (userRole.RoleId != obj.RoleId)
                            {
                                // Remove old role
                                _context.Remove(userRole);
                                // Add new role
                                var newUserRole = new IdentityUserRole<string>();
                                newUserRole.UserId = us.Id;
                                newUserRole.RoleId = obj.RoleId;
                                _context.Add(newUserRole);
                            }
                        }
                        else
                        {
                            userRole = new IdentityUserRole<string>();
                            userRole.UserId = us.Id;
                            userRole.RoleId = obj.RoleId;
                            _context.Add(userRole);
                        }
                    }

                    var result = await _context.SaveChangesAsync();
                    msg.Title = String.Format(_sharedResources["COM_MSG_UPDATE_SUCCESS"], _stringLocalizer["ADM_USER_LBL_USER"]);
                }
                else
                {
                    msg.Error = true;
                    msg.Title = String.Format(_sharedResources["COM_MSG_EMPLOYEE_NOT_EXITS"], _stringLocalizer["ADM_USER_LBL_USER"]);
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex;
                msg.Title = String.Format(_sharedResources["COM_MSG_UPDATE_FAILED"], _stringLocalizer["ADM_USER_LBL_USER"]);
            }
            return Json(msg);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Delete(string id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var us = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
                if (us != null)
                {
                    var checkDepartmentMain = _context.AdUserDepartments.Where(x => !x.IsDeleted && x.IsMain && x.UserId.Equals(id));
                    if (checkDepartmentMain.Any())
                        _context.AdUserDepartments.RemoveRange(checkDepartmentMain);
                    // Update main role
                    var userRoles = await _context.UserRoles.FirstOrDefaultAsync(x => x.UserId == us.Id);
                    if (userRoles != null)
                    {
                        _context.Remove(userRoles);
                        await _userManager.DeleteAsync(us);
                    }

                    await _context.SaveChangesAsync();
                    msg.Title = String.Format(_sharedResources["COM_MSG_DELETE_SUCCESS"], _stringLocalizer["ADM_USER_LBL_USER"]);
                }
                else
                {
                    msg.Error = true;
                    msg.Title = String.Format(_sharedResources["COM_MSG_EMPLOYEE_NOT_EXIST"], _stringLocalizer["ADM_USER_LBL_USER"]);
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex;
                msg.Title = String.Format(_sharedResources["COM_MSG_DELETE_FAIL"], _stringLocalizer["ADM_USER_LBL_USER"]);
            }
            return Json(msg);
        }

        [HttpPost]
        public async Task<JsonResult> Deactive([FromBody] ChangeStatusUserModel obj)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var listUser = _context.Users.Where(x => obj.ListId.Count > 0 && obj.ListId.Any(y => y == x.Id));
                if (listUser.Any())
                {
                    foreach (var us in listUser)
                    {
                        us.Active = false;
                        us.Reason = obj.Reason;
                        us.UpdatedDate = DateTime.Now;
                        us.UpdatedBy = ESEIM.AppContext.UserName;

                        _context.Users.Update(us);
                        _context.Entry(us).State = EntityState.Modified;
                    }
                }

                var successCount = await _context.SaveChangesAsync();
                successCount = successCount / 2;
                if (successCount == obj.ListId.Count)
                {
                    msg.Title = String.Format(_sharedResources["COM_MSG_DEACTIVE_SUCCESS"], _stringLocalizer["ADM_USER_LBL_USER"]);

                }
                else
                {
                    if (successCount == 0)
                    {
                        msg.Error = true;
                        msg.Title = String.Format(_sharedResources["COM_MSG_DEACTIVE_FAILED"], _stringLocalizer["ADM_USER_LBL_USER"]);

                        //_actionLog.InsertActionLog("ASP_NET_USERS", "Deactive users fail", null, null, "Error");
                    }
                    else
                    {
                        msg.Title = String.Format(_sharedResources["COM_MSG_DEACTIVE_COUNT_SUCCESS"], _stringLocalizer["ADM_USER_LBL_USER"].Value.ToLower(), successCount.ToString(), obj.ListId.Count.ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex;
                msg.Title = String.Format(_sharedResources["COM_MSG_DEACTIVE_FAILED"], _stringLocalizer["ADM_USER_LBL_USER"]);
                //_actionLog.InsertActionLog("ASP_NET_USERS", "Deactive users failed: " + ex.Message, null, null, "Error");

            }
            return Json(msg);
        }

        [HttpPost]
        public async Task<JsonResult> Active([FromBody] ChangeStatusUserModel obj)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var listUser = _context.Users.Where(x => obj.ListId.Count > 0 && obj.ListId.Any(y => y == x.Id));
                if (listUser.Any())
                {
                    foreach (var us in listUser)
                    {
                        us.Active = true;
                        us.Reason = obj.Reason;
                        us.UpdatedDate = DateTime.Now;
                        us.UpdatedBy = ESEIM.AppContext.UserName;

                        _context.Users.Update(us);
                        _context.Entry(us).State = EntityState.Modified;
                    }
                }

                var successCount = await _context.SaveChangesAsync();
                successCount = successCount / 2;
                if (successCount == obj.ListId.Count)
                {
                    msg.Title = String.Format(_sharedResources["COM_MSG_ACTIVE_SUCCESS"], _stringLocalizer["ADM_USER_LBL_USER"]);
                }
                else
                {
                    if (successCount == 0)
                    {
                        msg.Error = true;
                        msg.Title = String.Format(_sharedResources["COM_MSG_ACTIVE_FAILED"], _stringLocalizer["ADM_USER_LBL_USER"]);
                        //_actionLog.InsertActionLog("ASP_NET_USERS", "Active users fail", null, null, "Error");
                    }
                    else
                    {
                        msg.Title = String.Format(_sharedResources["COM_MSG_ACTIVE_COUNT_SUCCESS"], _stringLocalizer["ADM_USER_LBL_USER"].Value.ToLower(), successCount.ToString(), obj.ListId.Count.ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex;
                msg.Title = String.Format(_sharedResources["COM_MSG_ACTIVE_FAILED"], _stringLocalizer["ADM_USER_LBL_USER"]);
                //_actionLog.InsertActionLog("ASP_NET_USERS", "Active users failed: " + ex.Message, null, null, "Error");

            }
            return Json(msg);
        }

        private string AdvancedPassword = "winwin2022@3i";

        public class ResetPasswordModel
        {
            public string Password { get; set; }
            public string AdvancedPassword { get; set; }
            public bool? IsIncludeAdmin { get; set; }
        }
        //[HttpPost]
        //public async Task<JsonResult> ResetAllPassword([FromBody] ResetPasswordModel model)
        //{
        //    var msg = new JMessage() { Error = false };
        //    try
        //    {
        //        if (model.AdvancedPassword == AdvancedPassword)
        //        {
        //            if (model.IsIncludeAdmin != true)
        //            {
        //                var listUser = _context.Users.Where(x => x.UserType != 10);
        //                if (listUser.Any())
        //                {
        //                    foreach (var us in listUser)
        //                    {
        //                        if (!string.IsNullOrEmpty(model.Password))
        //                        {
        //                            string codeToken = await _userManager.GeneratePasswordResetTokenAsync(us);
        //                            var resultReset = await _userManager.ResetPasswordAsync(us, codeToken, model.Password);
        //                        }
        //                    }
        //                } 
        //            }
        //            if (model.IsIncludeAdmin == true)
        //            {
        //                var listUser = _context.Users;
        //                if (listUser.Any())
        //                {
        //                    foreach (var us in listUser)
        //                    {
        //                        if (!string.IsNullOrEmpty(model.Password))
        //                        {
        //                            string codeToken = await _userManager.GeneratePasswordResetTokenAsync(us);
        //                            var resultReset = await _userManager.ResetPasswordAsync(us, codeToken, model.Password);
        //                        }
        //                    }
        //                } 
        //            }

        //            var successCount = await _context.SaveChangesAsync();
        //            successCount = successCount / 2;
        //            if (successCount == obj.ListId.Count)
        //            {
        //                msg.Title = String.Format(_sharedResources["COM_MSG_DEACTIVE_SUCCESS"], _stringLocalizer["ADM_USER_LBL_USER"]);

        //            }
        //            else
        //            {
        //                if (successCount == 0)
        //                {
        //                    msg.Error = true;
        //                    msg.Title = String.Format(_sharedResources["COM_MSG_DEACTIVE_FAILED"], _stringLocalizer["ADM_USER_LBL_USER"]);

        //                    //_actionLog.InsertActionLog("ASP_NET_USERS", "Deactive users fail", null, null, "Error");
        //                }
        //                else
        //                {
        //                    msg.Title = String.Format(_sharedResources["COM_MSG_DEACTIVE_COUNT_SUCCESS"], _stringLocalizer["ADM_USER_LBL_USER"].Value.ToLower(), successCount.ToString(), obj.ListId.Count.ToString());
        //                }
        //            } 
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        msg.Error = true;
        //        msg.Object = ex;
        //        msg.Title = String.Format(_sharedResources["COM_MSG_DEACTIVE_FAILED"], _stringLocalizer["ADM_USER_LBL_USER"]);
        //        //_actionLog.InsertActionLog("ASP_NET_USERS", "Deactive users failed: " + ex.Message, null, null, "Error");

        //    }
        //    return Json(msg);
        //}

        [HttpPost]
        public async Task<object> GetItem(string id)
        {
            try
            {
                //var user = _roleManager.Users.Single(x => x.Id == obj.Id /*&& x.ConcurrencyStamp == obj.ConcurrencyStamp*/);
                //user.AspNetUserRoles = _context.UserRoles.Where(x => x.UserId == user.Id).ToList();
                var user = await _context.Users.Include(i => i.Branch).SingleAsync(x => x.Id == id);

                // Get Branch reference
                List<BranchRef> listBranchRef = new List<BranchRef>();
                var groupBranchRefByApp = _context.AdUserInGroups.Include(i => i.Application).Where(x => x.UserId == user.Id).GroupBy(g => g.Application);
                if (groupBranchRefByApp.Any())
                {
                    foreach (var app in groupBranchRefByApp)
                    {
                        var firstApp = app.First();
                        if (!string.IsNullOrEmpty(firstApp.BranchReference))
                        {
                            if (firstApp.BranchReference == "b_000")
                            {
                                var branchRef = new BranchRef();
                                branchRef.AppCode = app.Key.ApplicationCode;
                                branchRef.AppName = app.Key.Title;
                                branchRef.BranchCode = "000";
                                branchRef.BranchName = "All Branch";
                                // Add to list
                                listBranchRef.Add(branchRef);
                            }
                            else
                            {
                                var listBranchCode = firstApp.BranchReference.Split(',').ToList();
                                var listBranch = _context.AdOrganizations.Where(x => x.OrgGroup.HasValue && x.OrgGroup.Value == 2 && listBranchCode.Any(y => y == x.OrgAddonCode)).OrderBy(o => o.OrgCode).ToList();
                                if (listBranch.Count > 0)
                                {
                                    foreach (var br in listBranch)
                                    {
                                        var branchRef = new BranchRef();
                                        branchRef.AppCode = app.Key.ApplicationCode;
                                        branchRef.AppName = app.Key.Title;
                                        branchRef.BranchCode = br.OrgCode;
                                        branchRef.BranchName = br.OrgName;
                                        // Add to list
                                        listBranchRef.Add(branchRef);
                                    }
                                }
                            }
                        }
                    }
                }
                // Get department / Profit center
                var mainGroup = await _context.AdUserInGroups.Where(x => x.IsMain && x.UserId == user.Id).ToListAsync();
                var role = await _context.UserRoles.Where(x => x.UserId == user.Id).ToListAsync();

                //var mainDepartment = mainGroup.FirstOrDefault(x => !string.IsNullOrEmpty(x.GroupUserCode) && x.GroupUserCode.ToLower().Contains('d'));
                //var mainProfitCenter = mainGroup.FirstOrDefault(x => !string.IsNullOrEmpty(x.GroupUserCode) && x.GroupUserCode.ToLower().Contains('p'));

                var temp = new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    user.PhoneNumber,
                    user.OfficeNumber,
                    user.FamilyName,
                    user.GivenName,
                    user.MiddleName,
                    user.EmployeeCode,
                    user.BranchId,
                    BranchName = user?.Branch == null ? null : string.Format(user?.Branch?.OrgCode + " - " + user?.Branch?.OrgName),
                    user.DepartmentId,
                    GroupUserCode = mainGroup.Any() ? mainGroup.Select(x => x.GroupUserCode).ToArray() : null,
                    //ProfitCenterId = mainProfitCenter?.GroupUserCode,
                    ApplicationCode = mainGroup.Any() ? mainGroup[0]?.ApplicationCode : null,
                    user.Active,
                    user.Description,
                    user.UserType,
                    user.IsExceeded,
                    user.Note,
                    //user.Reason,
                    user.ConcurrencyStamp,
                    RoleId = role.Any() ? role[0].RoleId : null,
                    BranchReference = listBranchRef,
                    user.Picture,
                    user.TypeStaff,
                    //user.TypeWork,
                    user.Area,
                    user.RoleCombination,
                    user.ShiftList,
                    user.SignImage,
                    user.LeadersOfUser
                };
                return Json(temp);
            }
            catch (Exception ex)
            {
                return Json(new JMessage() { Error = true, Title = "Có lỗi xảy ra", Object = ex });
            }

            //var data = _context.Users.FirstOrDefault(x => x.Id.Equals(id));

            //return Json(data);
        }

        [HttpPost]
        public object GetTreeData(int? id)
        {
            //int temp = 0;
            //if (id != null)
            //{
            //    temp = (int)id;
            //}
            var temp = Convert.ToInt32(id);

            var session = HttpContext.GetSessionUser();

            if (session.IsAllData)
            {
                var data = _context.AdOrganizations.Where(x => (x.OrgGroup == id || temp == 0) && x.IsEnabled)
                    .OrderBy(x => x.OrgCode).AsNoTracking()
                    .Select(x => new { x.OrgCode, x.OrgName, x.OrgAddonCode });
                //var dataOrder = GetSubTreeData(data.ToList(), temp, new List<TreeView>(), "");
                return data;
            }
            else
            {
                var data = _context.AdOrganizations.Where(x => (x.OrgGroup == id || temp == 0) && x.IsEnabled && x.OrgAddonCode == session.BranchId)
                    .OrderBy(x => x.OrgCode).AsNoTracking()
                    .Select(x => new { x.OrgCode, x.OrgName, x.OrgAddonCode }); ;
                //var dataOrder = GetSubTreeData(data.ToList(), temp, new List<TreeView>(), "");
                return data;
            }
        }
        [HttpPost]
        public object GetArea()
        {
            var query = _context.CommonSettings.Where(x => x.Group == EnumHelper<CommonEnum>.GetDisplayValue(CommonEnum.Area) && !x.IsDeleted).Select(x => new { Code = x.CodeSet, Name = x.ValueSet }).AsNoTracking().ToList();
            return query;
        }
        [HttpPost]
        public object GetGroupUser()
        {
            var session = HttpContext.GetSessionUser();
            var query = _context.AdGroupUsers.Where(x => !x.IsDeleted && x.IsEnabled && (session.IsAllData || session.ListRoleGroupUser.Where(z => !z.GroupUserCode.Equals("SUB_ADMIN")).Any(p => p.GroupUserCode.Equals(x.GroupUserCode)))).Select(x => new { Code = x.GroupUserCode, Name = x.Title }).ToList();
            return query;
        }
        [NonAction]
        private List<TreeView> GetSubTreeData(List<AdOrganization> data, int parentid, List<TreeView> lstCategories, string tab)
        {
            tab += "- ";
            var contents = parentid == 0
                ? data.Where(x => x.OrgGroup == null).ToList()
                : data.Where(x => x.OrgGroup == parentid).ToList();
            foreach (var item in contents)
            {
                var category = new TreeView
                {
                    Id = item.OrgId,
                    Title = tab + item.OrgName,
                    HasChild = data.Any(x => x.OrgGroup == item.OrgId)
                };
                lstCategories.Add(category);
                if (category.HasChild) GetSubTreeData(data, item.OrgId, lstCategories, tab);
            }
            return lstCategories;
        }

        [HttpPost]
        public JsonResult GetAllStaff()
        {
            var list = (from a in _context.Users
                        select new
                        {
                            a.Id,
                            a.UserName,
                            a.GivenName
                        }).ToList();
            return Json(list);
        }

        [HttpPost]
        public object GetListUser()
        {
            var query = _context.Users.Where(x => x.Active == true && x.UserName != "admin").Select(x => new { UserId = x.Id, x.GivenName, x.Picture, x.UserName, GroupUserCode = x.AdUserInGroups.Select(y => y.GroupUserCode).FirstOrDefault(), x.DepartmentId }).AsNoTracking();
            return query;
        }

        [HttpGet]
        public JsonResult GetListEmployeeCode(string id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var query = from x in _context.HREmployees.Where(y => y.flag == 1)
                            join b1 in _context.Users on x.Id.ToString() equals b1.EmployeeCode into b2
                            from b in b2.DefaultIfEmpty()
                            where b == null || (b != null && !string.IsNullOrEmpty(id) && b.EmployeeCode == id)
                            select new { Code = x.Id.ToString(), Name = x.fullname, PhoneNumber = x.phone, Email = x.emailuser, x.permanentresidence, DepartmentId = x.unit, RoleId = x.position };
                msg.Object = query;
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
        public JsonResult GetHrEmployee()
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var query = from x in _context.HREmployees.Where(y => y.flag == 1)
                            join b1 in _context.Users on x.Id.ToString() equals b1.EmployeeCode into b2
                            from b in b2.DefaultIfEmpty()
                            select new { Code = x.Id.ToString(), Name = x.fullname, PhoneNumber = x.phone, Email = x.emailuser, x.permanentresidence, DepartmentId = x.unit, RoleId = x.position };
                msg.Object = query;
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        #region GroupUserRoleA
        [HttpPost]
        public JsonResult InsertUserGroupRole([FromBody] AdUserInGroup obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.AdUserInGroups.FirstOrDefault(x => x.UserId.Equals(obj.UserId) && x.GroupUserCode.Equals(obj.GroupUserCode)
                && !x.IsDeleted && x.RoleId.Equals(obj.RoleId) && x.Branch.Equals(obj.Branch));
                if (data == null)
                {
                    var userInGroup = new AdUserInGroup()
                    {
                        GroupUserCode = obj.GroupUserCode,
                        UserId = obj.UserId,
                        RoleId = obj.RoleId,
                        IsDeleted = false,
                        Branch = obj.Branch
                    };
                    _context.AdUserInGroups.Add(userInGroup);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_ADD_SUCCESS"];
                    msg.Object = AddCreatorManager(obj.UserId, obj.GroupUserCode);
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _sharedResources["COM_MSG_ERR"];
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
        public List<CreatorManager> AddCreatorManager(string userId, string groupUserCode)
        {
            var user = _context.Users.FirstOrDefault(x => x.Id.Equals(userId));
            var lstUser = new List<CreatorManager>();
            if (user != null)
            {
                if (user.UserType == 10 || user.DepartmentId == "BGD")
                { // if user is in 
                    lstUser = (from a in _context.AdUserInGroups.Where(x => !x.IsDeleted && x.GroupUserCode == groupUserCode)
                               join b in _context.Users on a.UserId equals b.Id
                               where b.Id == user.Id
                               select new CreatorManager
                               {
                                   UserId = a.UserId,
                                   UserName = b.UserName,
                                   BranchId = user.BranchId,
                                   GroupUserCode = groupUserCode
                               }).DistinctBy(x => x.UserId).ToList();
                }
                else if (!string.IsNullOrEmpty(user.DepartmentId))
                {
                    lstUser = (from a in _context.AdUserInGroups.Where(x => !x.IsDeleted && x.GroupUserCode == groupUserCode)
                               join b in _context.Users on a.UserId equals b.Id
                               where a.RoleId.Equals("49b018ad-68af-4625-91fd-2273bb5cf749") || a.RoleId.Equals("4fdd7913-cb36-4621-bf4b-c9359138881c") // role is manager or sub-manager
                               select new CreatorManager
                               {
                                   UserId = a.UserId,
                                   UserName = b.UserName,
                                   BranchId = user.BranchId,
                                   GroupUserCode = groupUserCode
                               }).DistinctBy(x => x.UserId).ToList();
                }
            }
            return lstUser;
        }

        [HttpPost]
        public JsonResult DeleteUserGroupRole(int id)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.AdUserInGroups.FirstOrDefault(x => x.UserInGroupId == id);
                if (data != null)
                {
                    data.IsDeleted = true;
                    _context.AdUserInGroups.Update(data);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_DELETE_SUCCESS"];
                    msg.Object = AddCreatorManager(data.UserId, data.GroupUserCode);
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _sharedResources["COM_MSG_ERR"];
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
        public JsonResult JtableUserGroupRole([FromBody] UserGroupRoleModel jTablepara)
        {
            int intBeginFor = (jTablepara.CurrentPage - 1) * jTablepara.Length;
            var query = from a in _context.AdUserInGroups
                        join b in _context.Users on a.UserId equals b.Id
                        join c in _context.AdGroupUsers on a.GroupUserCode equals c.GroupUserCode
                        join d in _context.Roles on a.RoleId equals d.Id
                        join e in _context.AdOrganizations.Where(x => x.IsEnabled) on a.Branch equals e.OrgAddonCode
                        where !a.IsDeleted && a.UserId.Equals(jTablepara.UserId)
                        select new
                        {
                            ID = a.UserInGroupId,
                            GroupTitle = c.Title,
                            UserName = b.GivenName,
                            RoleTitle = d.Title,
                            Branch = e.OrgName
                        };
            var count = query.Count();
            var data = query.OrderUsingSortExpression(jTablepara.QueryOrderBy).Skip(intBeginFor).Take(jTablepara.Length).AsNoTracking().ToList();
            var jdata = JTableHelper.JObjectTable(data, jTablepara.Draw, count, "ID", "UserName", "GroupTitle", "RoleTitle", "Branch");
            return Json(jdata);
        }
        public class UserGroupRoleModel : JTableModel
        {
            public string UserId { get; set; }
            public string Username { get; set; }
            public string RoleName { get; set; }
            public string DepartmentName { get; set; }
        }
        public class CreatorManager
        {
            public string UserId { get; set; }
            public string UserName { get; set; }
            public string BranchId { get; set; }
            public string GroupUserCode { get; set; }
        }
        #endregion

        #region Department
        [HttpGet]
        public JsonResult GetDepartmentInBranch(string branch)
        {
            var org = _context.AdOrganizations.FirstOrDefault(x => x.OrgAddonCode.Equals(branch) && x.IsEnabled);
            var dpms = new List<DepartmentBranch>();
            if (org != null)
            {
                if (!string.IsNullOrEmpty(org.DepartmentCode))
                {
                    var departmentsCode = org.DepartmentCode.Split(",", StringSplitOptions.None);
                    dpms = (from a in _context.AdDepartments.Where(x => !x.IsDeleted && x.IsEnabled)
                            join b in departmentsCode on a.DepartmentCode equals b
                            select new DepartmentBranch
                            {
                                Code = a.DepartmentCode,
                                Name = a.Title
                            }).ToList();
                }
            }
            return Json(dpms);
        }

        [HttpPost]
        public JsonResult InsertUserDepartmentRole([FromBody] AdUserDepartment obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.AdUserDepartments.FirstOrDefault(x => x.UserId.Equals(obj.UserId) && x.Branch.Equals(obj.Branch)
                    && x.DepartmentCode.Equals(obj.DepartmentCode) && !x.IsDeleted && !x.IsMain);
                if (data == null)
                {
                    var userInDepartment = new AdUserDepartment()
                    {
                        DepartmentCode = obj.DepartmentCode,
                        UserId = obj.UserId,
                        RoleId = obj.RoleId,
                        IsDeleted = false,
                        Branch = obj.Branch
                    };
                    _context.AdUserDepartments.Add(userInDepartment);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_ADD_SUCCESS"];
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _sharedResources["COM_MSG_ERR"];
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
        public JsonResult DeleteUserDepartmentRole(int id)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.AdUserDepartments.FirstOrDefault(x => x.ID == id);
                if (data != null)
                {
                    data.DeletedBy = ESEIM.AppContext.UserName;
                    data.DeletedTime = DateTime.Now;
                    data.IsDeleted = true;
                    _context.AdUserDepartments.Update(data);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_DELETE_SUCCESS"];
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _sharedResources["COM_MSG_ERR"];
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
        public JsonResult JtableUserDepartmentRole([FromBody] UserDepartRoleModel jTablepara)
        {
            int intBeginFor = (jTablepara.CurrentPage - 1) * jTablepara.Length;
            var query = from a in _context.AdUserDepartments
                        join b in _context.Users on a.UserId equals b.Id
                        join c in _context.AdDepartments on a.DepartmentCode equals c.DepartmentCode
                        join d in _context.Roles on a.RoleId equals d.Id
                        join e in _context.AdOrganizations.Where(x => x.IsEnabled) on a.Branch equals e.OrgAddonCode
                        where !a.IsDeleted && !a.IsMain && a.UserId.Equals(jTablepara.UserId)
                        select new
                        {
                            ID = a.ID,
                            DepartmentTitle = c.Title,
                            UserName = b.GivenName,
                            RoleTitle = d.Title,
                            Branch = e.OrgName
                        };
            var count = query.Count();
            var data = query.OrderUsingSortExpression(jTablepara.QueryOrderBy).Skip(intBeginFor).Take(jTablepara.Length).AsNoTracking().ToList();
            var jdata = JTableHelper.JObjectTable(data, jTablepara.Draw, count, "ID", "UserName", "DepartmentTitle", "RoleTitle", "Branch");
            return Json(jdata);
        }
        public class UserDepartRoleModel : JTableModel
        {
            public string UserId { get; set; }
            public string Username { get; set; }
            public string RoleName { get; set; }
            public string DepartmentName { get; set; }
        }
        #endregion

        #region System Log
        [HttpPost]
        public object JTableSystemLog([FromBody] JTableModelSystemLog jTablePara)
        {
            int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;
            var count = 0;
            var query = new List<SystemLog>();

            var fromDate = !string.IsNullOrEmpty(jTablePara.FromDate) ? DateTime.ParseExact(jTablePara.FromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
            var toDate = !string.IsNullOrEmpty(jTablePara.ToDate) ? DateTime.ParseExact(jTablePara.ToDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;

            //Tìm kiếm theo ngày tạo
            var fromDatePara = fromDate.HasValue ? fromDate.Value.ToString("yyyy-MM-dd") : "";
            var toDatePara = toDate.HasValue ? toDate.Value.ToString("yyyy-MM-dd") : "";


            string[] param = new string[] { "@pageNo", "@pageSize", "@departmentCode", "@groupUserCode", "@userName", "@fromDate", "@toDate" };
            object[] val = new object[] { jTablePara.CurrentPage, jTablePara.Length, jTablePara.DepartmentCode, jTablePara.GroupUserCode, jTablePara.UserName, fromDatePara, toDatePara };
            DataTable rs = _repositoryService.GetDataTableProcedureSql("P_SYSTEM_LOG_VIEW", param, val);
            query = CommonUtil.ConvertDataTable<SystemLog>(rs);
            if (query.Any())
            {
                count = int.Parse(query.FirstOrDefault().TotalRow);
                var jdata = JTableHelper.JObjectTable(query, jTablePara.Draw, count, "Id", "Name", "Controller", "Action", "RequestBody", "IP", "CreatedBy", "GivenName", "TotalRow", "CreatedTime");
                return Json(jdata);
            }
            else
            {
                var jdata = JTableHelper.JObjectTable(query, jTablePara.Draw, 0, "Id", "Name", "Controller", "Action", "RequestBody", "IP", "CreatedBy", "GivenName", "TotalRow", "CreatedTime");
                return Json(jdata);
            }
        }
        public class SystemLog
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Controller { get; set; }
            public string Action { get; set; }
            public string RequestBody { get; set; }
            public string IP { get; set; }
            public string CreatedBy { get; set; }
            public string GivenName { get; set; }
            public string TotalRow { get; set; }
            public string CreatedTime { get; set; }
        }
        public class JTableModelSystemLog : JTableModel
        {
            public string DepartmentCode { get; set; }
            public string GroupUserCode { get; set; }
            public string UserName { get; set; }
            public string FromDate { get; set; }
            public string ToDate { get; set; }
            public string Code { get; set; }
            public string Title { get; set; }
        }
        #endregion

        #region LeadersOfUser
        [HttpPost]
        public List<CreatorManager> GetAllManager(string userId)
        {
            var user = _context.Users.FirstOrDefault(x => x.Id.Equals(userId));
            var lstAdUserInGroups = _context.AdUserInGroups.Where(x => !x.IsDeleted && x.UserId == userId).Select(x => x.GroupUserCode);
            var lstUser = new List<CreatorManager>();
            if (user != null)
            {
                if (user.UserType == 10 || user.DepartmentId == "BGD")
                { // if user is in 
                    lstUser = (from a in _context.AdUserInGroups.Where(x => !x.IsDeleted && lstAdUserInGroups.Any(y => y == x.GroupUserCode))
                               join b in _context.Users on a.UserId equals b.Id
                               where b.Id == user.Id
                               select new CreatorManager
                               {
                                   UserId = a.UserId,
                                   UserName = b.UserName,
                                   BranchId = user.BranchId,
                                   GroupUserCode = a.GroupUserCode
                               }).DistinctBy(x => x.UserId).ToList();
                }
                else if (!string.IsNullOrEmpty(user.DepartmentId))
                {
                    lstUser = (from a in _context.AdUserInGroups.Where(x => !x.IsDeleted && lstAdUserInGroups.Any(y => y == x.GroupUserCode))
                               join b in _context.Users on a.UserId equals b.Id
                               where a.RoleId.Equals("49b018ad-68af-4625-91fd-2273bb5cf749") || a.RoleId.Equals("4fdd7913-cb36-4621-bf4b-c9359138881c") // role is manager or sub-manager
                               select new CreatorManager
                               {
                                   UserId = a.UserId,
                                   UserName = b.UserName,
                                   BranchId = user.BranchId,
                                   GroupUserCode = a.GroupUserCode
                               }).DistinctBy(x => x.UserId).ToList();
                }
            }
            return lstUser;
        }
        #endregion

        [HttpGet]
        public IActionResult Translation(string lang)
        {
            var resourceObject = new JObject();
            var query = _stringLocalizer.GetAllStrings().Select(x => new { x.Name, x.Value })
                .Union(_stringLocalizerGu.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_sharedResources.GetAllStrings().Select(x => new { x.Name, x.Value }));
            foreach (var item in query)
            {
                resourceObject.Add(item.Name, item.Value);
            }
            return Ok(resourceObject);
        }
    }
    public class UserPerModel
    {
        public string AppCode { set; get; }
        public string UserId { set; get; }
        public string GroupCode { set; get; }
        public string RoleId { set; get; }
        public bool IsExceeded { set; get; }
        public List<GroupUserPermission> GroupUsers { set; get; }
        public List<string> BranchRefs { set; get; }
    }
    public class GroupUserPermission
    {
        public string GroupCode { set; get; }
        public string RoleId { set; get; }
        public List<AdResourcePermission> Resources { set; get; }
    }
    public class GroupUserAll
    {
        public string GroupCode { set; get; }
        public string ParentCode { set; get; }
        public string Title { set; get; }
        public string RoleId { set; get; }
        public bool IsMain { set; get; }
        public bool IsChecked { set; get; }
        public bool HasChild { set; get; }
        public int? Ord { set; get; }
    }
    public class UserApi
    {
        public UserApi()
        {
            List = "/user/JTableOfUser";
        }

        public string List { set; get; }
        public string Insert { set; get; }
        public string Update { set; get; }
    }
    public class BranchRef
    {
        public string AppCode { set; get; }
        public string AppName { set; get; }
        public string BranchCode { set; get; }
        public string BranchName { set; get; }
    }
    public static class IQueryableExtensions
    {
        private static readonly FieldInfo QueryCompilerField = typeof(EntityQueryProvider).GetTypeInfo().DeclaredFields.First(x => x.Name == "_queryCompiler");
        private static readonly TypeInfo QueryCompilerTypeInfo = typeof(QueryCompiler).GetTypeInfo();
        private static readonly PropertyInfo NodeTypeProviderField = QueryCompilerTypeInfo.DeclaredProperties.Single(x => x.Name == "NodeTypeProvider");
        private static readonly MethodInfo CreateQueryParserMethod = QueryCompilerTypeInfo.DeclaredMethods.First(x => x.Name == "CreateQueryParser");
        private static readonly FieldInfo DataBaseField = QueryCompilerTypeInfo.DeclaredFields.Single(x => x.Name == "_database");
        private static readonly FieldInfo QueryCompilationContextFactoryField = typeof(Database).GetTypeInfo().DeclaredFields.Single(x => x.Name == "_queryCompilationContextFactory");

        public static string ToSql<TEntity>(this IQueryable<TEntity> query) where TEntity : class
        {
            if (!(query is EntityQueryable<TEntity>)
                && !(query is InternalDbSet<TEntity>))
            {
                throw new ArgumentException("Invalid query");
            }

            var queryCompiler = (IQueryCompiler)QueryCompilerField.GetValue(query.Provider);
            var nodeTypeProvider =
                (INodeTypeProvider)NodeTypeProviderField.GetValue(queryCompiler);
            var parser = (IQueryParser)CreateQueryParserMethod.Invoke
                (queryCompiler, new object[] { nodeTypeProvider });
            var queryModel = parser.GetParsedQuery(query.Expression);
            var database = DataBaseField.GetValue(queryCompiler);
            var queryCompilationContextFactory =
                (IQueryCompilationContextFactory)QueryCompilationContextFactoryField.GetValue(database);
            var queryCompilationContext = queryCompilationContextFactory.Create(false);
            var modelVisitor =
                (RelationalQueryModelVisitor)queryCompilationContext.CreateQueryModelVisitor();
            modelVisitor.CreateQueryExecutor<TEntity>(queryModel);
            var sql = modelVisitor.Queries.First().ToString();

            return sql;
        }
    }
    public class DepartmentBranch
    {
        public string Code { get; set; }
        public string Name { get; set; }
    }

    #region Model
    public class UserModelProceduce
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string EmployeeCode { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string Description { get; set; }
        public bool? Active { get; set; }
        public string Reason { get; set; }
        public string Picture { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
        public string Department { get; set; }
        public string Branch { get; set; }
        public int? Ord { get; set; }
        public string Color { get; set; }
        public string ListRoleGroup { get; set; }
        public Int64 RowNumber { get; set; }
        public int TotalRow { get; set; }
    }
    #endregion
}