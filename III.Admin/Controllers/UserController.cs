using ESEIM;
using ESEIM.Models;
using ESEIM.Utils;
using Hot.Models.AccountViewModels;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Syncfusion.EJ2.DocumentEditor;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace III.Admin.Controllers
{
    public class UserProfileController : Controller
    {

        private readonly EIMDBContext _context;
        private readonly UserManager<AspNetUser> _userManager;
        private readonly SignInManager<AspNetUser> _signInManager;
        private readonly IStringLocalizer<AccountLoginController> _stringLocalizer;
        private readonly IParameterService _parameterService;
        private readonly IStringLocalizer<SharedResources> _sharedResources;
        private readonly IUploadService _upload;
        private readonly AppSettings _appSettings;
        private readonly IHttpClientFactory _httpClientFactory;

        public UserProfileController(EIMDBContext context,
            UserManager<AspNetUser> userManager,
            SignInManager<AspNetUser> signInManager,
            IStringLocalizer<AccountLoginController> stringLocalizer,
            IParameterService parameterService,
            IStringLocalizer<SharedResources> sharedResources,
            IOptions<AppSettings> appSettings,
            IUploadService upload,
            IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _stringLocalizer = stringLocalizer;
            _parameterService = parameterService;
            _sharedResources = sharedResources;
            _upload = upload;
            _appSettings = appSettings.Value;
            _httpClientFactory = httpClientFactory;
        }

        [Authorize]
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Login()
        {
            return View();
        }
        public IActionResult Register()
        {
            return View();
        }

        [Authorize]
        public IActionResult Admin()
        {
            return View();
        }

        [Authorize]
        public IActionResult UserInfo()
        {
            return View();
        }


        //[AllowAnonymous]
        //public async Task<IActionResult> CreateAccount()
        //{
        //    var msg = new JMessage() { Error = false };
        //    for (int i=0; i<20; i++)
        //    {
        //        var user = new AspNetUser
        //        {
        //            UserName = "truongchibo" + i,
        //            Email = "truongchibo"+i+"@gmail.com",
        //            GivenName = "Trưởng chi bộ" + i,
        //            Area = "User",
        //            Active = true,
        //        };
        //        var result = await _userManager.CreateAsync(user,"123456");
        //    }
        //    return Ok(msg);
        //}

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Register2([FromBody] RegisterDto model)
        {
            var msg = new JMessage() { Error = false };
            //if (ModelState.IsValid)
            {
                var check = _userManager.FindByNameAsync(model.UserName).Result;
                if (check != null)
                {
                    msg.Error = true;
                    msg.Title = "Tài khoản đã tồn tại";
                    return Ok(msg);
                }
                var user = new AspNetUser();
                if (!string.IsNullOrEmpty(model.Email))
                {
                    user = await _userManager.FindByEmailAsync(model.Email);
                    //if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
                    if (user != null)
                    {
                        msg.Error = true;
                        msg.Title = "Email đã tồn tại";
                        return Ok(msg);
                    }
                }
                user = new AspNetUser
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    GivenName = model.GivenName,
                    PhoneNumber = model.PhoneNumber,
                    Gender = model.Gender,
                    Area = "User",
                    Active = true,
                    RegisterJoinGroupCode = model.RegisterJoinGroupCode
                };
                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    // Tùy chọn: Đăng nhập người dùng sau khi đăng ký
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    msg.Title = "Đăng ký thành công ! bạn có thể quay lại trang đăng nhập";
                    // Trả về mã thông báo, thông tin người dùng, hoặc thông tin khác tùy thuộc vào yêu cầu của ứng dụng di động
                    return Ok(msg);
                }
                msg.Error = true;
                msg.Title = "Đăng ký thất bại";
                return Ok(msg);
            }

            msg.Error = true;
            msg.Title = "Bạn chưa nhập đủ thông tin";
            return Ok(msg);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            HttpContext.Session.Remove("UserSession");
            // Nếu bạn muốn chuyển hướng sau khi đăng xuất
            return RedirectToAction("Index", "Home");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, set lockoutOnFailure: true
                if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
                {
                    ModelState.AddModelError(string.Empty, _stringLocalizer["LN_USR_PASS_NOT_EMPTY"]);
                    return View(model);
                }
                Regex rx = new Regex(@"\p{Cs}");
                MatchCollection matches = rx.Matches(model.Username);
                if (matches.Count() > 0)
                {
                    ModelState.AddModelError(string.Empty, _stringLocalizer["LN_INCORRECT_USR_PASS"]);
                }
                else
                {
                    var user = await _userManager.FindByNameAsync(model.Username);
                    if (user == null)
                    {
                        ModelState.AddModelError(string.Empty, _stringLocalizer["LN_INCORRECT_USR_PASS"]);
                    }
                    else
                    {
                        var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberLogin, lockoutOnFailure: false);
                        //if (result.RequiresTwoFactor)
                        //{
                        //    result = await _signInManager.SignInOrTwoFactorAsync()
                        //}
                        if (result.Succeeded || result.RequiresTwoFactor)
                        {
                            var authenProps = new AuthenticationProperties
                            {
                                IsPersistent = model.RememberLogin,
                                ExpiresUtc = DateTimeOffset.UtcNow.Add(AccountOptions.RememberMeLoginDuration)
                                //ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(model.RememberLogin ? (15 * 24 * 60) : _parameterService.GetSessionTimeoutAdmin()),
                            };
                            var timeStamp = DateTime.Now;

                            user.IsOnline = 1;
                            user.LoginTime = DateTime.Now;
                            user.LoginFailCount = 0;


                            await _signInManager.SignInAsync(user, authenProps);

                            var session = new SessionUserLogin();
                            session.UserId = user.Id;
                            session.UserName = user.UserName;
                            session.FullName = user.GivenName;
                            session.Email = user.Email;
                            session.EmployeeCode = user.EmployeeCode;
                            session.SessionTimeOut = _parameterService.GetSessionTimeout();
                            session.ExpireTimeSpan = DateTime.Now.AddMinutes(session.SessionTimeOut);
                            session.Picture = user.Picture;
                            session.BranchId = user.BranchId != null ? user.BranchId : null;
                            session.TimeStamp = timeStamp;

                            HttpContext.Session.Set("UserSession", session);

                            return RedirectToAction("Index", "Home");
                        }
                        if (result.IsLockedOut)
                        {
                            return RedirectToAction(nameof(Logout));
                        }
                        else
                        {
                            ModelState.AddModelError(string.Empty, _stringLocalizer["LN_INVALID_LOGIN"]);
                            return View(model);
                        }
                    }
                }
            }
            // If we got this far, something failed, redisplay form
            return View(model);
        }

        private IActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return Redirect("/admin");
            }
        }

        #region Profile doc

        [HttpPost]
        public async Task<object> fileUpload(IFormFile file, string ResumeNumber)
        {
            var msg = new JMessage() { Error = false };

            if (file == null || file.Length == 0 || ResumeNumber == null || ResumeNumber == "")
            {
                msg.Error = true;
                msg.Title = "Bạn chưa chọn file";
                return msg;
            }

            try
            {
                var user = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.ResumeNumber == ResumeNumber);
                if (user == null)
                {
                    msg.Error = true;
                    msg.Title = "Bạn chưa có hồ sơ vui lòng nhập hồ sơ";
                    return msg;
                }

                string uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                string newFileName = $"{user.Username}_{user.CurrentName}_{DateTime.Now.ToString("ddMMyyyyHHmmss")}_{file.FileName}";
                string filePath = Path.Combine(uploadPath, newFileName);
                var fileUpload = file;
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                user.JsonProfileLinks.Add(new JsonFile()
                {
                    FileName = newFileName,
                    FileSize = file.Length
                });
                _context.PartyAdmissionProfiles.Update(user);

                _context.SaveChanges();
                msg.Title = "Tải file lên thành công";

                return msg;
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = $"Internal server error: {ex.Message}";
                return msg;
            }
        }
        [HttpGet]
        public object GetListProfile(string ResumeNumber)
        {
            var user = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.ResumeNumber == ResumeNumber);
            return user;
        }
        public object DeleteFile(string fileName, string ResumeNumber)
        {
            var msg = new JMessage() { Error = false };
            try
            {

                var user = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.ResumeNumber == ResumeNumber);

                var files = user.JsonProfileLinks;
                if (files.Count > 0)
                {
                    var file = files.FirstOrDefault(x => x.FileName == fileName);
                    if (file != null)
                    {
                        user.JsonProfileLinks.Remove(file);
                        _context.PartyAdmissionProfiles.Update(user);
                        _context.SaveChanges();
                        msg.Title = "Xóa file thành công";
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = $"Không tìm thấy file trong danh sách";
                    }
                }
                else
                {
                    msg.Error = true;
                    msg.Title = $"Không tìm thấy danh sách tải lên";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = $"Internal server error: {ex.Message}";
            }

            return msg;
        }
        #endregion

        #region get

        public object GetPartyAdmissionProfile()
        {
            var user = _context.PartyAdmissionProfiles.ToList();
            return user;
        }

        public object GetGroupUser()
        {
            var query = (from x in _context.AdGroupUsers
                         where (x.ParentCode.Equals("NHOM_CHI_BO")
                                  && x.IsDeleted == false)
                         select new
                         {
                             Code = x.GroupUserCode,
                             x.Title
                         });

            return query.ToList();
        }

        public async Task<object> GetPartyAdmissionProfileByResumeNumber(string resumeNumber)
        {
            var user = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.IsDeleted == false && x.ResumeNumber == resumeNumber);
            if (user != null)
            {
                foreach (var a in user.JsonStaus)
                {
                    var userCreatedBy = await _userManager.FindByNameAsync(a.CreatedBy);
                    if (userCreatedBy != null)
                    {
                        a.CreatedBy = userCreatedBy.GivenName;
                    }
                }

            }

            return user;
        }
        /*public object GetPartyAdmissionProfileByUserCode([FromBody] int userCode)
        {
            var user = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.UserCode == userCode);
            return user;
        }*/
        public async Task<object> GetPartyAdmissionProfileByUsername(string Username)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var user = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.IsDeleted == false && x.Username == Username);
                if (user == null)
                {
                    msg.Error = true;
                    msg.Title = "Bạn chưa có hồ sơ vui lòng nhập hồ sơ";
                }
                else
                {
                    foreach (var a in user.JsonStaus)
                    {
                        var userCreatedBy = await _userManager.FindByNameAsync(a.CreatedBy);
                        if (userCreatedBy != null)
                        {
                            a.CreatedBy = userCreatedBy.GivenName;
                        }
                    }
                }
                msg.Object = user;
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Có lỗi xảy ra";
            }

            return msg;
        }
        public object GetPartyAdmissionProfileById(int Id)
        {
            var user = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.Id == Id);
            return user;
        }
        public object GetFamily()
        {
            var rs = _context.Families.ToList();
            return rs;
        }
        public object GetFamilyById(int id)
        {
            var rs = _context.Families.FirstOrDefault(p => p.IsDeleted == false && p.Id == id);
            return rs;
        }
        public object GetFamilyByProfileCode(string profileCode)
        {
            var rs = _context.Families.Where(p => p.IsDeleted == false && p.ProfileCode == profileCode).ToList();
            return rs;
        }

        public object GetIntroducerOfParty()
        {
            var rs = _context.IntroducerOfParties.ToList();
            return rs;
        }
        public object GetIntroducerOfPartyById(int id)
        {
            var rs = _context.IntroducerOfParties.FirstOrDefault(p => p.IsDeleted == false && p.Id == id);
            return rs;
        }
        public object GetIntroducerOfPartyByProfileCode(string profileCode)
        {
            var rs = _context.IntroducerOfParties.FirstOrDefault(p => p.IsDeleted == false && p.ProfileCode == profileCode);
            return rs;
        }

        public object GetAward()
        {
            var rs = _context.Awards.ToList();
            return rs;
        }
        public object GetAwardById(int id)
        {
            var rs = _context.Awards.FirstOrDefault(p => p.IsDeleted == false && p.Id == id);
            return rs;
        }
        public object GetAwardByProfileCode(string profileCode)
        {
            var rs = _context.Awards.Where(p => p.IsDeleted == false && p.ProfileCode == profileCode).ToList();
            return rs;
        }
        public object GetGoAboard()
        {
            var rs = _context.GoAboards.ToList();
            return rs;
        }
        public object GetGoAboardById(int id)
        {
            var rs = _context.GoAboards.FirstOrDefault(p => p.IsDeleted == false && p.Id == id);
            return rs;
        }
        public object GetGoAboardByProfileCode(string profileCode)
        {
            var rs = _context.GoAboards.Where(p => p.IsDeleted == false && p.ProfileCode == profileCode).ToList();
            return rs;
        }

        public object GetPersonalHistory()
        {
            var rs = _context.PersonalHistories.ToList();
            return rs;
        }

        public object GetPersonalHistoryById(int id)
        {
            var rs = _context.PersonalHistories.FirstOrDefault(p => p.IsDeleted == false && p.Id == id);
            return rs;
        }
        public object GetPersonalHistoryByProfileCode(string profileCode)
        {
            var rs = _context.PersonalHistories.Where(p => p.IsDeleted == false && p.ProfileCode == profileCode).ToList();
            return rs;
        }
        public object GetTrainingCertificatedPass()
        {
            var rs = _context.TrainingCertificatedPasses.ToList();
            return rs;
        }
        public object GetTrainingCertificatedPassById(int id)
        {
            var rs = _context.TrainingCertificatedPasses.FirstOrDefault(p => p.IsDeleted == false && p.Id == id);
            return rs;
        }
        public object GetTrainingCertificatedPassByProfileCode(string profileCode)
        {
            var rs = _context.TrainingCertificatedPasses.Where(p => p.IsDeleted == false && p.ProfileCode == profileCode).ToList();
            return rs;
        }

        public object GetWorkingTracking()
        {
            var rs = _context.WorkingTrackings.ToList();
            return rs;
        }
        public object GetWorkingTrackingById(int id)
        {
            var rs = _context.WorkingTrackings.FirstOrDefault(p => p.IsDeleted == false && p.Id == id);
            return rs;
        }
        public object GetWorkingTrackingByProfileCode(string profileCode)
        {
            var rs = _context.WorkingTrackings.Where(p => p.IsDeleted == false && p.ProfileCode == profileCode).ToList();
            return rs;
        }

        public object GetHistorySpecialist()
        {
            var rs = _context.HistorySpecialists.ToList();
            return rs;
        }
        public object GetHistorySpecialistById(int id)
        {
            var rs = _context.HistorySpecialists.FirstOrDefault(p => p.IsDeleted == false && p.Id == id);
            return rs;
        }
        public object GetHistorySpecialistByProfileCode(string profileCode)
        {
            var rs = _context.HistorySpecialists.Where(p => p.IsDeleted == false && p.ProfileCode == profileCode).ToList();
            return rs;
        }

        public object GetWarningDisciplined()
        {
            var rs = _context.WarningDisciplineds.ToList();
            return rs;
        }
        public object GetWarningDisciplinedById(int id)
        {
            var rs = _context.WarningDisciplineds.FirstOrDefault(p => p.IsDeleted == false && p.Id == id);
            return rs;
        }
        public object GetWarningDisciplinedByProfileCode(string profileCode)
        {
            var rs = _context.WarningDisciplineds.Where(p => p.IsDeleted == false && p.ProfileCode == profileCode).ToList();
            return rs;
        }
        public object GetProvince()
        {
            var rs = _context.Provinces.ToList();
            return rs;
        }
        public object GetDistrictByProvinceId(int provinceId)
        {
            var rs = _context.Districts.Where(p => p.provinceId == provinceId).ToList();
            return rs;
        }
        public object GetWardByDistrictId(int districtId)
        {
            var rs = _context.Wards.Where(p => p.districtId == districtId).ToList();
            return rs;
        }


        public object GetTinh(int id)
        {
            var rs = _context.Provinces.Where(p => p.provinceId == id).ToList();
            return rs;
        }

        public object GetHuyen(int id)
        {
            var rs = _context.Districts.Where(p => p.districtId == id).ToList();
            return rs;
        }
        public object GetXa(int id)
        {
            var rs = _context.Wards.Where(p => p.wardsId == id).ToList();
            return rs;
        }

        [HttpGet]
        public object GetTinhName(string name)
        {
            var rs = _context.Provinces.Where(p => p.name.Trim() == name.Trim()).ToList();
            return Json(rs);
        }

        public object GetHuyenName(string name)
        {
            var rs = _context.Districts.Where(p => p.name.Trim() == name.Trim()).ToList();
            return Json(rs);

        }
        public object GetXaName(string name)
        {
            var rs = _context.Wards.Where(p => p.name.Trim() == name.Trim()).ToList();
            return Json(rs);
        }


        public object GetDistrictsName(string name, string ProvincesName)
        {
            /*            var rs = _context.Districts.Where(p => p.name.Trim() == name.Trim() && ).ToList();
                        return Json(rs);*/

            var query = from a in _context.Districts
                        join b in _context.Provinces on a.provinceId equals b.provinceId
                        where (ProvincesName.Trim() == b.name.Trim() && a.name.Trim() == name.Trim())
                        select new
                        {
                            a.name,
                            a.provinceId,
                            a.districtId
                        };
            return Ok(query);

        }
        public object GetWardsName(string name, string DistrictsName, string ProvincesName)
        {
            /* var rs = _context.Wards.Where(p => p.name.Trim() == name.Trim()).ToList();
             return Json(rs);*/
            var query = from a in _context.Wards
                        join b in _context.Districts on a.districtId equals b.districtId
                        join c in _context.Provinces on b.provinceId equals c.provinceId

                        where (ProvincesName.Trim() == c.name.Trim() && DistrictsName.Trim() == b.name.Trim() && a.name.Trim() == name.Trim())
                        select new
                        {
                            a.name,
                            a.wardsId,
                            a.districtId
                        };
            return Ok(query);
        }
        #endregion

        #region Update

        [HttpPost]
        public object PartyRegist()
        {
            var msg = new JMessage() { Error = false };
            try
            {

            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Cập nhật Hoàn cảnh gia đình thất bại";
            }
            return msg;
        }
        [HttpPost]
        public object UpdateFamily([FromBody] Family model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var obj = _context.Families.Find(model.Id);

                obj.Name = model.Name;
                obj.WorkingProgress = model.WorkingProgress;
                obj.Relation = model.Relation;
                obj.ClassComposition = model.ClassComposition;
                obj.PartyMember = model.PartyMember;
                obj.BirthYear = model.BirthYear;
                obj.DeathYear = model.DeathYear;
                obj.HomeTown = model.HomeTown;
                obj.Residence = model.Residence;
                obj.Job = model.Job;
                obj.WorkingProgress = model.WorkingProgress;
                obj.Name = model.Name;
                _context.Families.Update(obj);
                _context.SaveChanges();
                msg.Title = "Cập nhật Hoàn cảnh gia đình thành công";
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Cập nhật Hoàn cảnh gia đình thất bại";
            }
            return msg;
        }
        [NonAction]
        public string GetPlaceWorking(string Place)
        {
            var result = "";
            try
            {
                if (!string.IsNullOrEmpty(Place))
                {
                    var list = Place.Split("_").Select(x => int.Parse(x)).ToList();
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
                    result = string.Join(',', listAdress.Select(x => !string.IsNullOrEmpty(x)));
                }
            }
            catch (Exception ex)
            {

            }
            return result;
        }
        public class ModelViewPAMP
        {
            [Note("Họ và tên")]
            [StringLength(maximumLength: 50)]
            public string CurrentName { get; set; }

            [Note("Tên khai sinh")]
            [StringLength(maximumLength: 50)]
            public string BirthName { get; set; }

            [Note("Giới tính")]
            public string Gender { get; set; }

            [Note("Dân tộc")]
            [StringLength(maximumLength: 50)]
            public string Nation { get; set; }

            [Note("Tôn giáo")]
            [StringLength(maximumLength: 50)]
            public string Religion { get; set; }

            [Note("Ngày sinh")]
            public string Birthday { get; set; }

            [Note("Địa chỉ thường trú")]
            [StringLength(maximumLength: 200)]
            public string PermanentResidence { get; set; }

            [Note("Số điện thoại")]
            [StringLength(maximumLength: 50)]
            public string Phone { get; set; }

            [StringLength(maximumLength: 255)]
            public string Picture { get; set; }

            [Note("Quê quán")]
            [StringLength(maximumLength: 100)]
            public string HomeTown { get; set; }

            [Note("Nơi sinh")]
            public string BirthPlaceValue { get; set; }

            [Note("Nghề nghiệp hiện nay")]
            [StringLength(maximumLength: 50)]
            public string Job { get; set; }

            [Note("Địa chỉ tạm trú")]
            [StringLength(maximumLength: 250)]
            public string TemporaryAddress { get; set; }

            [Note("Giáo dục phổ thông")]
            [StringLength(maximumLength: 50)]
            public string GeneralEducation { get; set; }

            [Note("Giáo dục nghề nghiệp")]
            [StringLength(maximumLength: 50)]
            public string JobEducation { get; set; }

            [Note("Giáo dục đại học")]
            [StringLength(maximumLength: 50)]
            public string UnderPostGraduateEducation { get; set; }

            [Note("Học hàm")]
            [StringLength(maximumLength: 50)]
            public string Degree { get; set; }

            [Note("Lý luận chính trị")]
            [StringLength(maximumLength: 50)]
            public string PoliticalTheory { get; set; }

            [Note("Ngoại ngữ")]
            [StringLength(maximumLength: 50)]
            public string ForeignLanguage { get; set; }

            [Note("Tin học")]
            [StringLength(maximumLength: 50)]
            public string ItDegree { get; set; }

            [Note("Tiếng dân tộc thiểu số")]
            [StringLength(maximumLength: 50)]
            public string MinorityLanguages { get; set; }

            [Note("Số LL")]
            [StringLength(maximumLength: 50)]
            public string ResumeNumber { get; set; }

            [Note("Tự nhận sét")]
            //public DateTime CreatedTime { get; set; }
            public string SelfComment { get; set; }

            [Note("Ngày và nơi vào Đoàn TNCSHCM")]
            public string CreatedPlace { get; set; }

            public string WfInstCode { get; set; }
            [Note("Nhóm chi bộ")]
            public string GroupUserCode { get; set; }
            [Note("Địa giới hành chính")]
            public string PlaceWorking { get; set; }
            public string Username { get; set; }
            public string Status { get; set; }
            public string MarriedStatus { get; set; }
            public string AddressText { get; set; }
            [StringLength(maximumLength: 100)]
            public string PlaceBirth { get; set; }
            public string BirthPlaceVillage { get; set; }
            [Note("Quê quán")]
            public string HomeTownValue { get; set; }
            public string HomeTownVillage { get; set; }
            [Note("Địa chỉ thường trú")]
            public string PermanentResidenceValue { get; set; }
            public string PermanentResidenceVillage { get; set; }
            [Note("Địa chỉ tạm trú")]
            public string TemporaryAddressValue { get; set; }
            public string TemporaryAddressVillage { get; set; }
        }
        [HttpPut]
        public async Task<JMessage> UpdatePartyAdmissionProfile([FromBody] ModelViewPAMP model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                if (model == null)
                {
                    msg.Error = true;
                    msg.Title = "không có dữ liệu";
                    return msg;
                }
                var user = await _userManager.FindByNameAsync(model.Username);
                if (user == null)
                {
                    msg.Error = true;
                    msg.Title = "không tìm thấy người dùng";
                    return msg;
                }
                var obj = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.IsDeleted == false &&
                x.ResumeNumber == model.ResumeNumber && x.Username == model.Username);

                if (obj == null)
                {
                    msg.Error = true;
                    msg.Title = "không tìm thấy hồ sơ";
                    return msg;
                }
                //    obj.CurrentName = currentName;
                obj.CurrentName = model.CurrentName;
                obj.Birthday = !string.IsNullOrEmpty(model.Birthday) ? DateTime.ParseExact(model.Birthday, "dd-MM-yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
                obj.BirthName = model.BirthName;
                obj.Gender = model.Gender == "Nam" ? 0 : 1;
                obj.Nation = model.Nation;
                obj.Religion = model.Religion;
                obj.PermanentResidence = model.PermanentResidence;
                obj.Phone = model.Phone;
                obj.Picture = model.Picture;
                obj.HomeTown = model.HomeTown;
                obj.PlaceBirth = model.PlaceBirth;
                obj.Job = model.Job;
                obj.TemporaryAddress = model.TemporaryAddress;
                obj.GeneralEducation = model.GeneralEducation;
                obj.JobEducation = model.JobEducation;
                obj.ItDegree = model.ItDegree;
                obj.Degree = model.Degree;
                obj.PoliticalTheory = model.PoliticalTheory;
                obj.ForeignLanguage = model.ForeignLanguage;
                obj.ItDegree = model.ItDegree;
                obj.MinorityLanguages = model.MinorityLanguages;
                obj.SelfComment = model.SelfComment;
                obj.CreatedPlace = model.CreatedPlace;
                obj.UnderPostGraduateEducation = model.UnderPostGraduateEducation;
                obj.WfInstCode = model.WfInstCode;
                obj.GroupUserCode = model.GroupUserCode;
                obj.PlaceWorking = model.PlaceWorking;
                obj.MarriedStatus = model.MarriedStatus;
                obj.AddressText = model.AddressText;
                obj.BirthPlaceValue = model.BirthPlaceValue;
                obj.BirthPlaceVillage = model.BirthPlaceVillage;
                obj.HomeTownValue = model.HomeTownValue;
                obj.HomeTownVillage = model.HomeTownVillage;
                obj.PermanentResidenceValue = model.PermanentResidenceValue;
                obj.PermanentResidenceVillage = model.PermanentResidenceVillage;
                obj.TemporaryAddressValue = model.TemporaryAddressValue;
                obj.TemporaryAddressVillage = model.TemporaryAddressVillage;

                _context.PartyAdmissionProfiles.Update(obj);
                await _context.SaveChangesAsync();

                var actInst = GetActInstanceCode(model.ResumeNumber, "6158ccd2-8312-59bc-6ec3-e7955d722e57");
                var url = $"/Admin/WorkflowActivity/UpdateStatusActInst?actInst=${actInst}&status=STATUS_ACTIVITY_DOING&userName=${ESEIM.AppContext.UserName}";
                var client = _httpClientFactory.CreateClient();
                client.BaseAddress = new Uri(_appSettings.UrlProd);
                var response = await client.PostAsync(url, null);

                msg.Title = "Cập nhật Sơ yếu lí lịch thành công";
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Cập nhật Sơ yếu lí lịch thất bại";
            }
            return msg;
        }
        private string GetActInstanceCode(string resumeNumber, string actCode)
        {
            var wfInst = _context.WorkflowInstances.FirstOrDefault(x => x.IsDeleted == false && x.ObjectType == "TEST_JOIN_PARTY" && x.ObjectInst == resumeNumber);
            if (wfInst == null)
            {
                return "";
            }
            var actInst = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.WorkflowCode == wfInst.WfInstCode && x.ActivityCode == actCode);
            return actInst?.ActivityInstCode ?? "";
        }

        [HttpPost]
        public object UpdateIntroduceOfParty([FromBody] IntroducerOfParty model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var ptm = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.IsDeleted == false && x.ResumeNumber == model.ProfileCode);
                if (ptm == null)
                {
                    msg.Error = true;
                    msg.Title = "không tìm thấy mã hồ sơ";
                    return msg;
                }
                var obj = _context.IntroducerOfParties.FirstOrDefault(x => x.Id == model.Id);
                if (obj == null)
                {
                    msg.Error = true;
                    msg.Title = "không tìm thấy Người giới thiệu";
                    return msg;
                }
                obj.PersonIntroduced = model.PersonIntroduced;
                obj.PlaceTimeJoinParty = model.PlaceTimeJoinParty;
                obj.PlaceTimeJoinUnion = model.PlaceTimeJoinUnion;
                obj.PlaceTimeRecognize = model.PlaceTimeRecognize;

                _context.IntroducerOfParties.Update(obj);
                _context.SaveChanges();

                msg.Title = "Cập nhật Người giới thiệu thành công";

            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Cập nhật Người giới thiệu thất bại";
            }
            return msg;
        }
        [HttpPost]
        public object UpdatePersonalHistories([FromBody] PersonalHistory[] model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                if (model != null && model.Length > 0)
                {
                    foreach (var x in model)
                    {
                        if (x.End != null || x.Begin != null || !string.IsNullOrEmpty(x.Content))
                        {
                            var obj = _context.PersonalHistories.FirstOrDefault(y => y.ProfileCode == x.ProfileCode);

                            obj.Begin = x.Begin;
                            obj.End = x.End;
                            obj.Content = x.Content;

                            _context.PersonalHistories.Update(obj);
                            _context.SaveChanges();
                        }

                    }
                    msg.Title = "Cập nhật Lịch sử cá nhân thành công";
                    return msg;
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Cập nhật Lịch sử cá nhân thành công";
                    return msg;
                }


            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Cập nhật Lịch sử cá nhân thất bại";
            }
            return msg;
        }

        [HttpPost]
        public object UpdatePersonalHistory([FromBody] PersonalHistory model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var pm = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.IsDeleted == false && x.ResumeNumber == model.ProfileCode);
                if (pm == null)
                {
                    msg.Error = true;
                    msg.Title = "không tìm thấy mã hồ sơ";
                    return msg;
                }
                if (model != null)
                {
                    var obj = _context.PersonalHistories.FirstOrDefault(y => y.Id == model.Id);

                    obj.Begin = model.Begin;
                    obj.End = model.End;
                    obj.Content = model.Content;

                    _context.PersonalHistories.Update(obj);
                    _context.SaveChanges();
                    msg.Title = "Cập nhật Lịch sử cá nhân thành công";
                    return msg;
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Cập nhật Lịch sử cá nhân thành công";
                    return msg;
                }


            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Cập nhật Lịch sử cá nhân thất bại";
            }
            return msg;
        }

        [HttpPost]
        public object UpdateGoAboard([FromBody] GoAboard model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var pm = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.IsDeleted == false && x.ResumeNumber == model.ProfileCode);
                if (pm == null)
                {
                    msg.Error = true;
                    msg.Title = "không tìm thấy mã hồ sơ";
                    return msg;
                }
                var obj = _context.GoAboards.Find(model.Id);

                obj.From = model.From;
                obj.To = model.To;
                obj.Contact = model.Contact;
                obj.Country = model.Country;

                _context.GoAboards.Update(obj);
                _context.SaveChanges();

                msg.Title = "Cập nhật Đi nước ngoài thành công";
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Cập nhật Đi nước ngoài thất bại";
            }
            return msg;
        }
        [HttpPost]
        public object UpdateTrainingCertificatedPass([FromBody] TrainingCertificatedPass model)
        {
            var msg = new JMessage() { Error = false };

            try
            {
                var pm = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.IsDeleted == false && x.ResumeNumber == model.ProfileCode);
                if (pm == null)
                {
                    msg.Error = true;
                    msg.Title = "không tìm thấy mã hồ sơ";
                    return msg;
                }
                var obj = _context.TrainingCertificatedPasses.Find(model.Id);

                obj.SchoolName = model.SchoolName;
                obj.From = model.From;
                obj.To = model.To;
                obj.Class = model.Class;
                obj.Certificate = model.Certificate;

                _context.TrainingCertificatedPasses.Update(obj);
                _context.SaveChanges();
                msg.Title = "Cập nhật Những lớp đào tạo bồi dưỡng đã qua thành công";
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Cập nhật Những lớp đào tạo bồi dưỡng đã qua thất bại";
            }
            return msg;
        }

        [HttpPost]
        public object UpdateHistorySpecialist([FromBody] HistorySpecialist model)
        {
            var msg = new JMessage() { Error = false };

            try
            {

                var pm = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.IsDeleted == false && x.ResumeNumber == model.ProfileCode);
                if (pm == null)
                {
                    msg.Error = true;
                    msg.Title = "không tìm thấy mã hồ sơ";
                    return msg;
                }
                var obj = _context.HistorySpecialists.Find(model.Id);

                obj.MonthYear = model.MonthYear;
                obj.Content = model.Content;

                _context.HistorySpecialists.Update(obj);
                _context.SaveChanges();
                msg.Title = "Cập nhật Đặc điểm lịch sử thành công";
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Cập nhật Đặc điểm lịch sử thất bại";
            }
            return msg;
        }

        [HttpPost]
        public object UpdateWarningDisciplined([FromBody] WarningDisciplined model)
        {
            var msg = new JMessage() { Error = false };

            try
            {

                var pm = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.IsDeleted == false && x.ResumeNumber == model.ProfileCode);
                if (pm == null)
                {
                    msg.Error = true;
                    msg.Title = "không tìm thấy mã hồ sơ";
                    return msg;
                }
                var obj = _context.WarningDisciplineds.Find(model.Id);

                obj.MonthYear = model.MonthYear;
                obj.Reason = model.Reason;
                obj.GrantOfDecision = model.GrantOfDecision;

                _context.WarningDisciplineds.Update(obj);
                _context.SaveChanges();
                msg.Title = "Cập nhật Kỷ luật thành công";
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Cập nhật Kỷ luật thất bại";
            }
            return msg;
        }
        [HttpPost]
        public object UpdateAward([FromBody] Award model)
        {
            var msg = new JMessage() { Error = false };

            try
            {
                var data = _context.PartyAdmissionProfiles.FirstOrDefault(a => a.IsDeleted == false && a.ResumeNumber == model.ProfileCode);
                if (data == null)
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy mã hồ sơ";
                    return msg;
                }
                var obj = _context.Awards.Find(model.Id);

                obj.MonthYear = model.MonthYear;
                obj.Reason = model.Reason;
                obj.GrantOfDecision = model.GrantOfDecision;

                _context.Awards.Update(obj);
                _context.SaveChanges();
                msg.Title = "Cập nhật Khen thưởng thành công";
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Cập nhật Khen thưởng thất bại";
            }
            return msg;
        }
        [HttpPost]
        public object UpdateWorkingTracking([FromBody] WorkingTracking model)
        {
            var msg = new JMessage() { Error = false };
            var data = _context.PartyAdmissionProfiles.FirstOrDefault(a => a.IsDeleted == false && a.ResumeNumber == model.ProfileCode);
            if (data == null)
            {
                msg.Error = true;
                msg.Title = "Không tìm thấy mã hồ sơ";
                return msg;
            }
            try
            {
                var obj = _context.WorkingTrackings.Find(model.Id);

                obj.From = model.From;
                obj.To = model.To;
                obj.Work = model.Work;
                obj.Role = model.Role;

                _context.WorkingTrackings.Update(obj);
                _context.SaveChanges();
                msg.Title = "Cập nhật Những công tác và chức vụ đã qua thành công";
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Cập nhật Những công tác và chức vụ đã qua thất bại";
            }
            return msg;
        }

        #endregion

        #region insert

        [HttpPost]
        public object InsertFamily([FromBody] FamilyModel[] model)
        {
            var msg = new JMessage() { Error = false };
            try
            {

                foreach (var x in model)
                {
                    var data = _context.PartyAdmissionProfiles.FirstOrDefault(a => a.IsDeleted == false && a.ResumeNumber == x.ProfileCode);
                    if (data == null)
                    {
                        msg.Error = true;
                        msg.Title = "Không tìm thấy mã hồ sơ";
                        return msg;
                    }
                    if (!string.IsNullOrEmpty(x.Relation) || !string.IsNullOrEmpty(x.ClassComposition)
                    || !string.IsNullOrEmpty(x.HomeTown)
                    || !string.IsNullOrEmpty(x.Residence) || !string.IsNullOrEmpty(x.Job)
                    || !string.IsNullOrEmpty(x.WorkingProgress)
                    || !string.IsNullOrEmpty(x.PartyMember)
                    || !string.IsNullOrEmpty(x.BirthYear))

                    {
                        if (x.Id == 0)
                        {
                            var family = new Family
                            {
                                PoliticalAttitude = x.PoliticalAttitude,
                                Relation = x.Relation,
                                ClassComposition = x.ClassComposition,
                                PartyMember = x.PartyMember,
                                BirthYear = x.BirthYear,
                                DeathYear = x.DeathYear,
                                HomeTown = x.HomeTown,
                                HomeTownVillage = x.HomeTownVillage,
                                HomeTownValue = x.HomeTownValue,
                                HomeTownJson = x.HomeTownJson,
                                BirthPlace = x.BirthPlace,
                                Residence = x.Residence,
                                Job = x.Job,
                                WorkingProgress = x.WorkingProgress,
                                Name = x.Name,
                                ProfileCode = x.ProfileCode,
                                IsDeleted = false
                            };
                            _context.Families.Add(family);
                        }
                        else
                        {
                            var a = _context.Families.FirstOrDefault(y => y.Id == x.Id);
                            if (a != null)
                            {
                                a.Name = x.Name;
                                a.Relation = x.Relation;
                                a.BirthYear = x.BirthYear;
                                a.HomeTown = x.HomeTown;
                                a.HomeTownVillage = x.HomeTownVillage;
                                a.HomeTownValue = x.HomeTownValue;
                                a.HomeTownJson = x.HomeTownJson;
                                a.Residence = x.Residence;
                                a.Job = x.Job;
                                a.PartyMember = x.PartyMember;
                                a.ClassComposition = x.ClassComposition;
                                a.PoliticalAttitude = x.PoliticalAttitude;
                                a.WorkingProgress = x.WorkingProgress;
                                a.BirthPlace = x.BirthPlace;

                                a.IsDeleted = false;
                                _context.Families.Update(a);
                            }
                            else
                            {
                                msg.Error = true;
                                msg.Title = "Lý lịch gia đình chưa hợp lệ";
                                return msg;
                            }
                        }

                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Lý lịch gia đình chưa hợp lệ";
                        return msg;
                    }
                }
                _context.SaveChanges();
                msg.Title = "Thêm mới lý lịch gia đình thành công";
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Thêm Lý lịch gia đình thất bại";
            }
            return msg;
        }

        [HttpPost]
        public object InsertFamily2([FromBody] Family model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.PartyAdmissionProfiles.FirstOrDefault(a => a.IsDeleted == false && a.ResumeNumber == model.ProfileCode);
                if (data == null)
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy mã hồ sơ";
                    return msg;
                }
                if (!(!string.IsNullOrEmpty(model.Relation) || !string.IsNullOrEmpty(model.ClassComposition)
                || !string.IsNullOrEmpty(model.BirthYear) || !string.IsNullOrEmpty(model.HomeTown)
                || !string.IsNullOrEmpty(model.Residence) || !string.IsNullOrEmpty(model.Job)
                || !string.IsNullOrEmpty(model.WorkingProgress) || model.PartyMember != null))
                {
                    msg.Error = true;
                    msg.Title = "Hoàn cảnh gia đình chưa hợp lệ";
                    return msg;
                }
                else
                {
                    _context.Families.Add(model);
                    _context.SaveChanges();
                    msg.Title = "Thêm mới Lịch sử bản thân thành công";
                }
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Thêm Hoàn cảnh gia đình thất bại";
            }
            return msg;
        }
        [HttpPost]
        public object InsertPartyAdmissionProfile([FromBody] ModelViewPAMP model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                if (model != null)
                {
                    if (string.IsNullOrEmpty(model.Username))
                    {
                        msg.Error = true;
                        msg.Title = "Chưa có tài khoản";
                        return msg;
                    }
                    var user = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.IsDeleted == false && x.Username == model.Username);
                    if (user != null)
                    {
                        msg.Error = true;
                        msg.Title = "Tài khoản này đã có hồ sơ";
                        return msg;
                    }
                    string ResumeCode = "Profile_" + DateTime.Now.ToString("ddMMyyyy") + '_';
                    var obj = new PartyAdmissionProfile();
                    //    obj.CurrentName = currentName;
                    obj.CurrentName = model.CurrentName;
                    obj.Birthday = !string.IsNullOrEmpty(model.Birthday) ? DateTime.ParseExact(model.Birthday, "dd-MM-yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
                    obj.BirthName = model.BirthName;
                    obj.Gender = model.Gender == "Nam" ? 0 : 1;
                    obj.Nation = model.Nation;
                    obj.Religion = model.Religion;
                    obj.PermanentResidenceValue = model.PermanentResidenceValue;
                    obj.PermanentResidence = model.PermanentResidence;
                    obj.Phone = model.Phone;
                    obj.Picture = model.Picture;
                    obj.Username = model.Username;
                    obj.HomeTown = model.HomeTown;
                    obj.PlaceBirth = model.PlaceBirth;
                    obj.Job = model.Job;
                    obj.TemporaryAddress = model.TemporaryAddress;
                    obj.GeneralEducation = model.GeneralEducation;
                    obj.JobEducation = model.JobEducation;
                    obj.ItDegree = model.ItDegree;
                    obj.Degree = model.Degree;
                    obj.PoliticalTheory = model.PoliticalTheory;
                    obj.ForeignLanguage = model.ForeignLanguage;
                    obj.ItDegree = model.ItDegree;
                    obj.MinorityLanguages = model.MinorityLanguages;
                    obj.SelfComment = model.SelfComment;
                    obj.CreatedPlace = model.CreatedPlace;
                    obj.UnderPostGraduateEducation = model.UnderPostGraduateEducation;
                    obj.ResumeNumber = ResumeCode
                        + _context.PartyAdmissionProfiles.Count(x => x.ResumeNumber.Contains(ResumeCode));
                    obj.JsonStaus = new List<JsonLog>();
                    obj.JsonProfileLinks = new List<JsonFile>();
                    obj.GroupUserCode = model.GroupUserCode;
                    obj.PlaceWorking = model.PlaceWorking;
                    obj.MarriedStatus = model.MarriedStatus;
                    obj.AddressText = model.AddressText;
                    obj.BirthPlaceValue = model.BirthPlaceValue;
                    obj.BirthPlaceVillage = model.BirthPlaceVillage;
                    obj.HomeTownValue = model.HomeTownValue;
                    obj.HomeTownVillage = model.HomeTownVillage;
                    obj.PermanentResidenceValue = model.PermanentResidenceValue;
                    obj.PermanentResidenceVillage = model.PermanentResidenceVillage;
                    obj.TemporaryAddressValue = model.TemporaryAddressValue;
                    obj.TemporaryAddressVillage = model.TemporaryAddressVillage;

                    _context.PartyAdmissionProfiles.Add(obj);
                    _context.SaveChanges();
                    msg.Object = obj;
                    msg.Title = "Thêm mới Sơ yêu lí lịch thành công";
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Sơ yêu lí lịch chưa hợp lệ";
                }
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Thêm mới Sơ yêu lí lịch thất bại";
            }
            return msg;
        }

        [HttpPost]
        public object InsertIntroduceOfParty([FromBody] IntroducerOfParty model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.PartyAdmissionProfiles.FirstOrDefault(a => a.ResumeNumber == model.ProfileCode);
                if (data == null)
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy mã hồ sơ";
                    return msg;
                }
                if (!string.IsNullOrEmpty(model.PersonIntroduced) || !string.IsNullOrEmpty(model.PlaceTimeJoinUnion) || !string.IsNullOrEmpty(model.PlaceTimeJoinParty) || model.PlaceTimeRecognize != null)
                {

                    var a = _context.IntroducerOfParties.FirstOrDefault(x => x.ProfileCode == model.ProfileCode);
                    if (a != null)
                    {
                        a.PersonIntroduced = model.PersonIntroduced;
                        a.PlaceTimeJoinUnion = model.PlaceTimeJoinUnion;
                        a.PlaceTimeJoinParty = model.PlaceTimeJoinParty;
                        a.PlaceTimeRecognize = model.PlaceTimeRecognize;

                        a.IsDeleted = false;
                        _context.IntroducerOfParties.Update(a);
                    }
                    else
                    {
                        _context.IntroducerOfParties.Add(model);

                    }

                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Giới thiệu vào đảng chưa hợp lệ";
                    return msg;
                }
                _context.SaveChanges();

                msg.Title = "Thêm mới Giới thiệu vào đảng thành công";
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Cập nhật Giới thiệu vào đảng thất bại";
            }
            return msg;
        }
        [HttpPost]
        public object InsertPersonalHistory([FromBody] PersonalHistory[] model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                foreach (var x in model)
                {
                    var data = _context.PartyAdmissionProfiles.FirstOrDefault(a => a.ResumeNumber == x.ProfileCode);
                    if (data == null)
                    {
                        msg.Error = true;
                        msg.Title = "Không tìm thấy mã hồ sơ";
                        return msg;
                    }
                    if (!string.IsNullOrEmpty(x.Content) || x.Begin != null || x.End != null)
                    {
                        if (x.Id == 0)
                        {
                            _context.PersonalHistories.Add(x);
                        }
                        else
                        {
                            var a = _context.PersonalHistories.FirstOrDefault(y => y.Id == x.Id);
                            if (a != null)
                            {
                                a.Begin = x.Begin;
                                a.End = x.End;
                                a.Content = x.Content;
                                a.ProfileCode = x.ProfileCode;
                                a.IsDeleted = false;
                                if (!string.IsNullOrEmpty(x.Type))
                                    a.Type = x.Type;
                                _context.PersonalHistories.Update(a);
                            }
                            else
                            {
                                msg.Error = true;
                                msg.Title = "Lịch sử bản thân chưa hợp lệ";
                                return msg;
                            }
                        }
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Lịch sử bản thân chưa hợp lệ";
                        return msg;
                    }
                }

                _context.SaveChanges();

                msg.Title = "Thêm mới Lịch sử bản thân thành công";

            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Thêm Lịch sử bản thân thất bại";
            }
            return msg;
        }





        [HttpPost]
        public object InsertGoAboardOnly([FromBody] GoAboard x)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var check = _context.PartyAdmissionProfiles.FirstOrDefault(y => y.IsDeleted == false && y.ResumeNumber.Equals(x.ProfileCode));
                if (check == null || x.ProfileCode == null)
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy hồ sơ";
                    return msg;
                }
                if (!string.IsNullOrEmpty(x.From) || !string.IsNullOrEmpty(x.To) || !string.IsNullOrEmpty(x.Contact) || x.Country != null)
                {
                    _context.GoAboards.Add(x);

                    _context.SaveChanges();

                    msg.Title = "Thêm Đi nước ngoài thành công";
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Đi nước ngoài chưa hợp lệ";
                    return msg;
                }
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Thêm Đi nước ngoài thất bại";
            }
            return msg;
        }



        [HttpPost]
        public object InsertGoAboard([FromBody] GoAboard[] model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                foreach (var x in model)
                {
                    var data = _context.PartyAdmissionProfiles.FirstOrDefault(a => a.ResumeNumber == x.ProfileCode);
                    if (data == null)
                    {
                        msg.Error = true;
                        msg.Title = "Không tìm thấy mã hồ sơ";
                        return msg;
                    }
                    if (!string.IsNullOrEmpty(x.From) || !string.IsNullOrEmpty(x.To) || !string.IsNullOrEmpty(x.Contact) || x.Country != null)
                    {
                        if (x.Id == 0)
                        {
                            _context.GoAboards.Add(x);
                        }
                        else
                        {
                            var a = _context.GoAboards.FirstOrDefault(y => y.Id == x.Id);
                            if (a != null)
                            {
                                a.From = x.From;
                                a.To = x.To;
                                a.Contact = x.Contact;
                                a.Country = x.Country;
                                a.IsDeleted = false;
                                _context.GoAboards.Update(a);
                            }
                            else
                            {
                                msg.Error = true;
                                msg.Title = "Đi nước ngoài chưa hợp lệ";
                                return msg;
                            }
                        }
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Đi nước ngoài chưa hợp lệ";
                        return msg;
                    }

                }
                _context.SaveChanges();

                msg.Title = "Thêm Đi nước ngoài thành công";
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Thêm Đi nước ngoài thất bại";
            }
            return msg;
        }
        [HttpPost]
        public object InsertTrainingCertificatedPass([FromBody] TrainingCertificatedPass[] model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                foreach (var x in model)
                {
                    var data = _context.PartyAdmissionProfiles.FirstOrDefault(a => a.ResumeNumber == x.ProfileCode);
                    if (data == null)
                    {
                        msg.Error = true;
                        msg.Title = "Không tìm thấy mã hồ sơ";
                        return msg;
                    }
                    if (!string.IsNullOrEmpty(x.From) || !string.IsNullOrEmpty(x.To) || !string.IsNullOrEmpty(x.SchoolName) || x.Class != null || string.IsNullOrEmpty(x.Certificate))
                    {
                        if (x.Id == 0)
                        {
                            _context.TrainingCertificatedPasses.Add(x);
                        }
                        else
                        {
                            var a = _context.TrainingCertificatedPasses.FirstOrDefault(y => y.Id == x.Id);
                            if (a != null)
                            {
                                a.From = x.From;
                                a.To = x.To;
                                a.SchoolName = x.SchoolName;
                                a.Certificate = x.Certificate;
                                a.Class = x.Class;
                                a.IsDeleted = false;
                                _context.TrainingCertificatedPasses.Update(a);
                            }
                            else
                            {
                                msg.Error = true;
                                msg.Title = "Những lớp đào tạo đã qua chưa hợp lệ";
                                return msg;
                            }
                        }
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Những lớp đào tạo đã qua chưa hợp lệ";
                        return msg;
                    }


                }
                _context.SaveChanges();

                msg.Title = "Thêm những lớp đào tạo đã qua thành công";
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Cập nhật Những lớp đào tạo đã qua thất bại";
            }
            return msg;
        }
        [HttpPost]
        public object InsertHistorysSpecialist([FromBody] HistorySpecialist[] model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                foreach (var x in model)
                {
                    var data = _context.PartyAdmissionProfiles.FirstOrDefault(a => a.ResumeNumber == x.ProfileCode);
                    if (data == null)
                    {
                        msg.Error = true;
                        msg.Title = "Không tìm thấy mã hồ sơ";
                        return msg;
                    }
                    if (!string.IsNullOrEmpty(x.MonthYear) || !string.IsNullOrEmpty(x.Content))
                    {
                        if (x.Id == 0)
                        {
                            _context.HistorySpecialists.Add(x);
                        }
                        else
                        {
                            var a = _context.HistorySpecialists.FirstOrDefault(y => y.Id == x.Id);
                            if (a != null)
                            {
                                a.MonthYear = x.MonthYear;
                                a.Content = x.Content;

                                a.IsDeleted = false;
                                _context.HistorySpecialists.Update(a);
                            }
                            else
                            {
                                msg.Error = true;
                                msg.Title = "Đặc điểm lịch sử chưa hợp lệ";
                                return msg;
                            }
                        }
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Đặc điểm lịch sử chưa hợp lệ";
                        return msg;
                    }

                }
                _context.SaveChanges();
                msg.Title = "Thêm Đặc điểm lịch sử thành công";
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Thêm Đặc điểm lịch sử thất bại";
            }
            return msg;
        }
        [HttpPost]
        public object InsertWarningDisciplined([FromBody] WarningDisciplined[] model)
        {
            var msg = new JMessage() { Error = false };
            try
            {

                foreach (var x in model)
                {
                    var data = _context.PartyAdmissionProfiles.FirstOrDefault(a => a.ResumeNumber == x.ProfileCode);
                    if (data == null)
                    {
                        msg.Error = true;
                        msg.Title = "Không tìm thấy mã hồ sơ";
                        return msg;
                    }
                    if (!string.IsNullOrEmpty(x.MonthYear) || x.Reason != null || x.GrantOfDecision != null)
                    {
                        if (x.Id == 0)
                        {
                            _context.WarningDisciplineds.Add(x);
                        }
                        else
                        {
                            var a = _context.WarningDisciplineds.FirstOrDefault(y => y.Id == x.Id);
                            if (a != null)
                            {
                                a.MonthYear = x.MonthYear;
                                a.Reason = x.Reason;
                                a.GrantOfDecision = x.GrantOfDecision;
                                a.IsDeleted = false;
                                _context.WarningDisciplineds.Update(a);
                            }
                            else
                            {
                                msg.Error = true;
                                msg.Title = "Kỷ luật chưa hợp lệ";
                                return msg;
                            }
                        }
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Kỷ luật chưa hợp lệ";
                        return msg;
                    }

                }
                _context.SaveChanges();

                msg.Title = "Thêm kỷ luật thành công";
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Thêm kỷ luật thất bại";
            }
            return msg;
        }
        [HttpPost]
        public object InsertAward([FromBody] Award[] model)
        {
            var msg = new JMessage() { Error = false };

            try
            {
                foreach (var x in model)
                {
                    var data = _context.PartyAdmissionProfiles.FirstOrDefault(a => a.ResumeNumber == x.ProfileCode);
                    if (data == null)
                    {
                        msg.Error = true;
                        msg.Title = "Không tìm thấy mã hồ sơ";
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
                            var a = _context.Awards.FirstOrDefault(y => y.Id == x.Id);
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
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Khen thưởng chưa hợp lệ";
                        return msg;
                    }

                }
                _context.SaveChanges();
                msg.Title = "Thêm khen thưởng thành công";

            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Thêm khen thưởng thất bại";
            }
            return msg;
        }
        [HttpPost]
        public object InsertWorkingTracking([FromBody] WorkingTracking[] model)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                foreach (var x in model)
                {
                    var data = _context.PartyAdmissionProfiles.FirstOrDefault(a => a.ResumeNumber == x.ProfileCode);
                    if (data == null)
                    {
                        msg.Error = true;
                        msg.Title = "Không tìm thấy mã hồ sơ";
                        return msg;
                    }
                    if (!string.IsNullOrEmpty(x.From) || x.To != null || x.Work != null || !string.IsNullOrEmpty(x.From))
                    {
                        if (x.Id == 0)
                        {
                            _context.WorkingTrackings.Add(x);
                        }
                        else
                        {
                            var a = _context.WorkingTrackings.FirstOrDefault(y => y.Id == x.Id);
                            if (a != null)
                            {
                                a.From = x.From;
                                a.To = x.To;
                                a.Work = x.Work;
                                a.Role = x.Role;
                                a.IsDeleted = false;
                                _context.WorkingTrackings.Update(a);
                            }
                            else
                            {
                                msg.Error = true;
                                msg.Title = "Quá trình công tác chưa hợp lệ";
                                return msg;
                            }
                        }
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Quá trình công tác chưa hợp lệ";
                        return msg;
                    }

                }
                _context.SaveChanges();
                msg.Title = "Thêm quá trình công tác thành công";
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Thêm quá trình công tác thất bại";
            }
            return msg;
        }

        #endregion

        #region delete
        [HttpDelete]
        public object DeleteAllFamily(String profileCode)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.Families.Where(p => p.ProfileCode == profileCode).ToList();
                if (data == null)
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy mã hồ sơ";
                    return msg;
                }
                foreach (var record in data)
                {
                    record.IsDeleted = true;

                    _context.Families.Update(record);
                }
                _context.SaveChanges();
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Xóa Hoàn cảnh gia đình thất bại";
            }
            return msg;
        }

        [HttpDelete]
        public object DeleteAllWorkingTracking(String profileCode)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.WorkingTrackings.Where(p => p.ProfileCode == profileCode).ToList();
                if (data == null)
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy mã hồ sơ";
                    return msg;
                }
                foreach (var record in data)
                {
                    record.IsDeleted = true;

                    _context.WorkingTrackings.Update(record);
                }
                _context.SaveChanges();
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Xóa thất bại";
            }
            return msg;
        }

        [HttpDelete]
        public object DeleteAllHistorySpecialist(String profileCode)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.HistorySpecialists.Where(p => p.ProfileCode == profileCode).ToList();
                if (data == null)
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy mã hồ sơ";
                    return msg;
                }
                foreach (var record in data)
                {
                    record.IsDeleted = true;

                    _context.HistorySpecialists.Update(record);
                }
                _context.SaveChanges();
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Xóa thất bại";
            }
            return msg;
        }

        [HttpDelete]
        public object DeleteAllAward(String profileCode)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.Awards.Where(p => p.ProfileCode == profileCode).ToList();
                if (data == null)
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy mã hồ sơ";
                    return msg;
                }
                foreach (var record in data)
                {
                    record.IsDeleted = true;

                    _context.Awards.Update(record);
                }
                _context.SaveChanges();
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Xóa thất bại";
            }
            return msg;
        }

        [HttpDelete]
        public object DeleteAllWarningDisciplined(String profileCode)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.WarningDisciplineds.Where(p => p.ProfileCode == profileCode).ToList();
                if (data == null)
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy mã hồ sơ";
                    return msg;
                }
                foreach (var record in data)
                {
                    record.IsDeleted = true;

                    _context.WarningDisciplineds.Update(record);
                }
                _context.SaveChanges();
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Xóa thất bại";
            }
            return msg;
        }

        [HttpDelete]
        public object DeleteAllTrainingCertificatedPasse(String profileCode)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.TrainingCertificatedPasses.Where(p => p.ProfileCode == profileCode).ToList();
                if (data == null)
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy mã hồ sơ";
                    return msg;
                }
                foreach (var record in data)
                {
                    record.IsDeleted = true;

                    _context.TrainingCertificatedPasses.Update(record);
                }
                _context.SaveChanges();
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Xóa thất bại";
            }
            return msg;
        }

        [HttpDelete]
        public object DeleteAllGoAboard(String profileCode)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.GoAboards.Where(p => p.ProfileCode == profileCode).ToList();
                if (data == null)
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy mã hồ sơ";
                    return msg;
                }
                foreach (var record in data)
                {
                    record.IsDeleted = true;

                    _context.GoAboards.Update(record);
                }
                _context.SaveChanges();
            }
            catch (Exception err)
            {
                msg.Error = true;
                msg.Title = "Xóa thất bại";
            }
            return msg;
        }


        [HttpDelete]
        public object DeleteFamily(int Id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.Families.Find(Id);
                if (data != null)
                {
                    data.IsDeleted = true;
                    _context.Families.Update(data);
                    _context.SaveChanges();
                    msg.Title = "Xóa hoàn cảnh gia đình thành công";
                }
                else
                {
                    msg.Title = "Không tìm thấy hoàn cảnh gia đình";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Xóa không thành công";
            }
            return msg;
        }
        [HttpDelete]
        public object DeleteIntroducerOfParty(int Id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.IntroducerOfParties.Find(Id);
                if (data != null)
                {
                    data.IsDeleted = true;
                    _context.IntroducerOfParties.Update(data);
                    _context.SaveChanges();
                    msg.Title = "Xóa người giới thiệu thành công";
                }
                else
                {
                    msg.Title = "Không tìm thấy người giới thiệu";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Xóa không thành công";
            }
            return msg;
        }
        [HttpDelete]
        public object DeletePartyAdmissionProfile(int Id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.PartyAdmissionProfiles.Find(Id);
                if (data != null)
                {
                    data.IsDeleted = true;
                    _context.PartyAdmissionProfiles.Update(data);
                    _context.SaveChanges();
                    msg.Title = "Xóa Hồ sơ lý lịch thành công";
                }
                else
                {
                    msg.Title = "Không tìm thấy Hồ sơ lí lịch";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Xóa không thành công";
            }
            return msg;
        }
        [HttpDelete]
        public object DeleteAward(int Id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.Awards.Find(Id);
                if (data != null)
                {
                    data.IsDeleted = true;
                    _context.Awards.Update(data);
                    _context.SaveChanges();
                    msg.Title = "Xóa Khen thưởng thành công";
                }
                else
                {
                    msg.Title = "Không tìm thấy Khen thưởng";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Xóa không thành công";
            }
            return msg;
        }

        [HttpDelete]
        public object DeleteGoAboard(int Id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.GoAboards.Find(Id);
                if (data != null)
                {
                    data.IsDeleted = true;
                    _context.GoAboards.Update(data);
                    _context.SaveChanges();
                    msg.Title = "Xóa Đi nước ngoài thành công";
                }
                else
                {
                    msg.Title = "Không tìm thấy Đi nước ngoài";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Xóa không thành công";
            }
            return msg;
        }
        [HttpDelete]
        public object DeletePersonalHistory(int Id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.PersonalHistories.Find(Id);
                if (data != null)
                {
                    data.IsDeleted = true;
                    _context.PersonalHistories.Update(data);
                    _context.SaveChanges();
                    msg.Title = "Xóa Lịch sử cá nhân thành công";
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy Lịch sử cá nhân";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Xóa không thành công";
            }
            return msg;
        }
        [HttpDelete]
        public object DeleteWorkingTracking(int Id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.WorkingTrackings.Find(Id);
                if (data != null)
                {
                    data.IsDeleted = true;
                    _context.WorkingTrackings.Update(data);
                    _context.SaveChanges();
                    msg.Title = "Xóa Công tác thành công";
                }
                else
                {
                    msg.Title = "Không tìm thấy Công tác";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Xóa không thành công";
            }
            return msg;
        }
        [HttpDelete]
        public object DeleteTrainingCertificatedPass(int Id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.TrainingCertificatedPasses.Find(Id);
                if (data != null)
                {
                    data.IsDeleted = true;
                    _context.TrainingCertificatedPasses.Update(data);
                    _context.SaveChanges();
                    msg.Title = "Xóa Những lớp đào tạo bồi dưỡng đã qua thành công";
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Không tìm thấy Những lớp đào tạo bồi dưỡng đã qua";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Xóa không thành công";
            }
            return msg;
        }
        [HttpDelete]
        public object DeleteWarningDisciplined(int Id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.WarningDisciplineds.Find(Id);
                if (data != null)
                {
                    data.IsDeleted = true;
                    _context.WarningDisciplineds.Update(data);
                    _context.SaveChanges();
                    msg.Title = "Xóa Cảnh cáo kỉ luật thành công";
                }
                else
                {
                    msg.Title = "Không tìm thấy Cảnh cáo kỉ luật";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Xóa không thành công";
            }
            return msg;
        }
        [HttpDelete]
        public object DeleteHistorySpecialist(int Id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.HistorySpecialists.Find(Id);
                if (data != null)
                {
                    data.IsDeleted = true;
                    _context.HistorySpecialists.Update(data);
                    _context.SaveChanges();
                    msg.Title = "Xóa Đặc điểm lịch sử thành công";
                }
                else
                {
                    msg.Title = "Không tìm thấy Đặc điểm lịch sử";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Xóa không thành công";
            }
            return msg;
        }
        #endregion
        public class JTableModelFile : JTableModel
        {
            public string Name { get; set; }
            public bool Gender { get; set; }
            public string Nation { get; set; }
            public string Religion { get; set; }
            public string GeneralEducation { get; set; }
            public string JobEducation { get; set; }
            public string Degree { get; set; }
            public string ForeignLanguage { get; set; }
            public string ItDegree { get; set; }
            public string MinorityLanguage { get; set; }
            public string PermanentResidence { get; set; }
            public string Job { get; set; }
            public string TemporaryAddress { get; set; }
            public string HomeTown { get; set; }
            public string FromDate { get; set; }
            public string ToDate { get; set; }
            public int UserCode { get; set; }
        }

        [HttpPost]
        public object JTable([FromBody] JTableModelFile jTablePara)
        {
            try
            {
                /*var session = HttpContext.GetSessionUser();*/
                int intBegin = (jTablePara.CurrentPage - 1) * jTablePara.Length;
                var fromDate = !string.IsNullOrEmpty(jTablePara.FromDate) ? DateTime.ParseExact(jTablePara.FromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
                var toDate = !string.IsNullOrEmpty(jTablePara.ToDate) ? DateTime.ParseExact(jTablePara.ToDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
                var query = from a in _context.PartyAdmissionProfiles

                            where (fromDate == null || (fromDate <= a.Birthday))
                                   && (toDate == null || (toDate >= a.Birthday))
                                   /*&& session.ListGroupUser != null && session.ListGroupUser.Contains(a.GroupUserCode)*/
                                   && (string.IsNullOrEmpty(jTablePara.Name) || a.CurrentName.ToLower().Contains(jTablePara.Name.ToLower()))
                                   && (string.IsNullOrEmpty(jTablePara.Nation) || a.Nation.ToLower().Contains(jTablePara.Nation.ToLower()))
                                   && (string.IsNullOrEmpty(jTablePara.Religion) || a.Religion.ToLower().Contains(jTablePara.Religion.ToLower()))
                                   && (string.IsNullOrEmpty(jTablePara.JobEducation) || a.JobEducation.ToLower().Contains(jTablePara.JobEducation.ToLower()))
                                   && (string.IsNullOrEmpty(jTablePara.GeneralEducation) || a.GeneralEducation.ToLower().Contains(jTablePara.GeneralEducation.ToLower()))

                                   && (string.IsNullOrEmpty(jTablePara.Degree) || a.Degree.ToLower().Contains(jTablePara.Degree.ToLower()))

                                   && (string.IsNullOrEmpty(jTablePara.ForeignLanguage) || a.ForeignLanguage.ToLower().Contains(jTablePara.ForeignLanguage.ToLower()))
                                   && (string.IsNullOrEmpty(jTablePara.ItDegree) || a.ItDegree.ToLower().Contains(jTablePara.ItDegree.ToLower()))
                                   && (string.IsNullOrEmpty(jTablePara.MinorityLanguage) || a.MinorityLanguages.ToLower().Contains(jTablePara.MinorityLanguage.ToLower()))
                                   && (string.IsNullOrEmpty(jTablePara.PermanentResidence) || a.PermanentResidence.ToLower().Contains(jTablePara.PermanentResidence.ToLower()))
                                   && (string.IsNullOrEmpty(jTablePara.Job) || a.Job.ToLower().Contains(jTablePara.Job.ToLower()))
                                   && (string.IsNullOrEmpty(jTablePara.TemporaryAddress) || a.TemporaryAddress.ToLower().Contains(jTablePara.TemporaryAddress.ToLower()))
                                   && (string.IsNullOrEmpty(jTablePara.HomeTown) || a.HomeTown.ToLower().Contains(jTablePara.HomeTown.ToLower()))

                            select new
                            {
                                a.Id,
                                a.CurrentName,
                                a.BirthName,
                                a.Birthday,
                                a.Gender,
                                a.Nation,
                                a.Religion,
                                a.Phone,
                                a.JobEducation,
                                a.Degree,
                                a.ForeignLanguage,
                                a.ItDegree,
                                a.MinorityLanguages,
                                a.PermanentResidence,
                                a.Job,
                                a.Picture,
                                a.TemporaryAddress,
                                a.HomeTown,
                                a.UnderPostGraduateEducation,
                                a.GeneralEducation,
                                a.PoliticalTheory,
                                a.PlaceBirth,
                                a.SelfComment,
                                a.CreatedPlace,
                                a.ResumeNumber
                                //ModuleCount = (a != null) ? _context.CustomerModuleRequests.Count(x => x.ReqCode == b.ReqCode) : 0
                            };

                //int total = _context.PartyAdmissionProfiles.Count();
                var query_row_number = query.AsEnumerable().Select((x, index) => new
                {
                    stt = index + 1,
                    x.Id,
                    x.CurrentName,
                    x.BirthName,
                    x.Birthday,
                    x.Gender,
                    x.Nation,
                    x.Religion,
                    x.Phone,
                    x.JobEducation,
                    x.Degree,
                    x.ForeignLanguage,
                    x.ItDegree,
                    x.MinorityLanguages,
                    x.PermanentResidence,
                    x.Job,
                    x.Picture,
                    x.TemporaryAddress,
                    x.HomeTown,
                    x.UnderPostGraduateEducation,
                    x.GeneralEducation,
                    x.PoliticalTheory,
                    x.PlaceBirth,
                    x.SelfComment,
                    x.CreatedPlace,
                    x.ResumeNumber
                }).ToList();
                int count = query_row_number.Count();
                var data = query_row_number.AsQueryable().OrderBy(x => x.stt);

                return Json(data);
            }
            catch (Exception err)
            {
                return Json(null);
            }
        }

        [HttpGet]
        public object UpdateWfInstByResumeCode(string WfInstCode, string ResumeNumber)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var user = _context.PartyAdmissionProfiles.FirstOrDefault(x => x.ResumeNumber == ResumeNumber);
                if (user == null)
                {
                    msg.Error = true;
                    msg.Title = "Bạn chưa có hồ sơ vui lòng nhập hồ sơ";
                    return msg;
                }

                var wfInst = _context.WorkflowInstances.FirstOrDefault(x => x.WfInstCode == WfInstCode);
                if (wfInst == null)
                {
                    msg.Error = true;
                    msg.Title = "Bạn chưa có luồng";
                    return msg;
                }

                user.WfInstCode = wfInst.WfInstCode;

                _context.PartyAdmissionProfiles.Update(user);
                _context.SaveChanges();
                msg.Title = "Cập nhật luồng cho hồ sơ thành công";

            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "Có lỗi xảy ra";
            }

            return msg;
        }

        [HttpGet]
        public object GetFileList()
        {
            string uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");

            if (Directory.Exists(uploadPath))
            {
                var files = Directory.GetFiles(uploadPath).Select(f => new FileInfo(f));

                var fileList = files.Select(file => new
                {
                    FilePath = file.FullName,
                    FileExtension = file.Extension,
                    FileName = file.Name,
                    FileSize = file.Length,
                    FileIconBase64 = GetFileIconBase64(file.FullName),
                }).ToList();

                return fileList;
            }
            else
            {
                return NotFound("Upload folder not found");
            }
        }
        private string GetFileIconBase64(string filePath)
        {
            try
            {
                System.Drawing.Icon icon = System.Drawing.Icon.ExtractAssociatedIcon(filePath);

                using (MemoryStream ms = new MemoryStream())
                {
                    icon.ToBitmap().Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                    byte[] byteImage = ms.ToArray();
                    return "data:image/png;base64," + Convert.ToBase64String(byteImage);
                }
            }
            catch (Exception ex)
            {
                // Handle exception (e.g., file not found, no associated icon)
                return null;
            }
        }
        [HttpDelete]
        public IActionResult DeleteFile(string FileName)
        {
            try
            {
                string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads", FileName);

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    return Json(new { success = true, message = "File deleted successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "File not found" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }


        public string Import(IFormCollection data)
        {
            try
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

                WordDocument document = WordDocument.Load(stream, GetFormatType(type.ToLower()));
                //document.Save(streamSave);

                string sfdt = JsonConvert.SerializeObject(document);

                var outputStream = WordDocument.Save(sfdt, FormatType.Html);
                outputStream.Position = 0;
                StreamReader reader = new StreamReader(outputStream);
                string value = reader.ReadToEnd().ToString();
                return value;
            }
            catch (Exception ex)
            {
                // Log or handle the exception
                Console.WriteLine("An error occurred while loading the Word document: " + ex.Message);
                return null; // Or return an error message
            }
        }

        static FormatType GetFormatType(string format)
        {
            if (string.IsNullOrEmpty(format))
                throw new System.NotSupportedException("EJ2 DocumentEditor does not support this file format.");
            switch (format.ToLower())
            {
                case ".dotx":
                case ".docx":
                case ".docm":
                case ".dotm":
                    return FormatType.Docx;
                case ".dot":
                case ".doc":
                    return FormatType.Doc;
                case ".rtf":
                    return FormatType.Rtf;
                case ".txt":
                    return FormatType.Txt;
                case ".xml":
                    return FormatType.WordML;
                default:
                    throw new System.NotSupportedException("EJ2 DocumentEditor does not support this file format.");
            }
        }

    }

    public class RegisterDto
    {
        [Required]
        [RegularExpression(@"^[0-9]{12}$", ErrorMessage = "Số căn cước phải có đúng 12 chữ số.")]
        public string UserName { get; set; }

        [Required]
        public bool Gender { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        //[Required]
        //[EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string ConfrimPassword { get; set; }

        [Required]
        public string GivenName { get; set; }
        [Required]
        public string RegisterJoinGroupCode { get; set; }
    }




}
