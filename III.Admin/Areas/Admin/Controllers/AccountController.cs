using System;
using System.Security.Claims;
using System.Threading.Tasks;
using ESEIM.Controllers;
using ESEIM.Models;
using Hot.Models.AccountViewModels;
using IdentityDemo.Models.AccountViewModels;
using III.Admin.Controllers;
using Localization.StarterWeb.ViewModels.Account;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ESEIM.Utils;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Host.DbContexts;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;

namespace III.Admin.Controllers
{
    [Area("Admin")]
    public class AccountController : Controller
    {
        private readonly UserManager<AspNetUser> _userManager;
        private readonly SignInManager<AspNetUser> _signInManager;
        private readonly EIMDBContext _context;
        private readonly IParameterService _parameterService;
        private readonly ILogger _logger;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ILanguageService _languageService;
        private readonly IStringLocalizer<AccountLoginController> _stringLocalizer;
        private readonly IEmailConfiguration _emailConfiguration;


        public AccountController(
            UserManager<AspNetUser> userManager,
            SignInManager<AspNetUser> signInManager,
            EIMDBContext context,
            IParameterService parameterService,
            IHostingEnvironment hostingEnvironment,
            ILogger<AccountController> logger,
            ILanguageService languageService,
            IStringLocalizer<AccountLoginController> stringLocalizer,
            IEmailConfiguration emailConfiguration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _parameterService = parameterService;
            _hostingEnvironment = hostingEnvironment;
            _languageService = languageService;
            _logger = logger;
            _stringLocalizer = stringLocalizer;
            _emailConfiguration = emailConfiguration;
        }

        [TempData]
        public string ErrorMessage { get; set; }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Login(string returnUrl = null)
        {
            // Clear the existing external cookie to ensure a clean login process
            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
            await _userManager.FindByNameAsync("Admin3i");
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
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
                    else if (user.Active == false)
                    {
                        ModelState.AddModelError(string.Empty, _stringLocalizer["LN_ACCOUNT_DISABLED"]);
                    }
                    else
                    {
                        var sendOTP = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals("SEND_OTP"));
                        if (sendOTP != null && sendOTP.ValueSet.Equals("YES"))
                        {
                            if (string.IsNullOrEmpty(model.OTP))
                            {
                                ModelState.AddModelError(string.Empty, _stringLocalizer["LN_OTP_NOT_EMPTY"]);
                                return View(model);
                            }

                            var checkOTP = _context.OTPManagers.FirstOrDefault(x => !x.IsDeleted && x.UserName.Equals(model.Username) && x.OTP.Equals(model.OTP));
                            if (checkOTP == null)
                            {
                                ModelState.AddModelError(string.Empty, _stringLocalizer["LN_OTP_INCORRECT"]);

                                user.LoginFailCount = user.LoginFailCount != null ? user.LoginFailCount + 1 : 1;

                                if (user.LoginFailCount > 3)
                                {
                                    ModelState.AddModelError(string.Empty, _stringLocalizer["LN_OTP_OVER_COUNT"]);
                                    user.Active = false;
                                }
                                _context.Users.Update(user);

                                _context.SaveChanges();

                                return View(model);
                            }
                        }

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

                            if (sendOTP != null && sendOTP.ValueSet.Equals("YES"))
                            {
                                var checkOTP = _context.OTPManagers.FirstOrDefault(x => !x.IsDeleted && x.UserName.Equals(model.Username) && x.OTP.Equals(model.OTP));
                                if (checkOTP != null)
                                {
                                    checkOTP.IsDeleted = true;
                                    checkOTP.DeletedBy = model.Username;
                                    checkOTP.DeletedTime = DateTime.Now;
                                    _context.OTPManagers.Update(checkOTP);
                                }
                            }


                            _context.SaveChanges();

                            return RedirectToLocal(returnUrl);
                        }
                        if (result.IsLockedOut)
                        {
                            _logger.LogWarning(_stringLocalizer["LN_ACCOUNT_LOCKED"]);
                            return RedirectToAction(nameof(Lockout));
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

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Lockout()
        {
            return View();
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Register(string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        public async Task<IActionResult> Logout()
        {
            var session = HttpContext.GetSessionUser();
            var user = _context.Users.FirstOrDefault(x => x.Active && x.UserName == session.UserName);
            if (user != null)
            {
                user.IsOnline = 0;
                user.LogoutTime = DateTime.Now;

                var lstSessionLogin = new List<JsonSessionLogin>();

                if (!string.IsNullOrEmpty(user.SessionLogin))
                {
                    lstSessionLogin = JsonConvert.DeserializeObject<List<JsonSessionLogin>>(user.SessionLogin);
                    foreach (var item in lstSessionLogin)
                    {
                        if (item.TimeStamp.ToString("dd/MM/yyyy HH:mm:ss")
                            .Equals(session.TimeStamp.ToString("dd/MM/yyyy HH:mm:ss")))
                        {
                            lstSessionLogin.Remove(item);
                            break;
                        }
                    }
                }

                user.SessionLogin = JsonConvert.SerializeObject(lstSessionLogin);
                _context.Users.Update(user);
            }

            _context.SaveChanges();

            await _signInManager.SignOutAsync();
            foreach (var cookie in Request.Cookies.Keys)
            {
                HttpContext.Response.Cookies.Delete(cookie);
            }
            _logger.LogInformation("User logged out.");
            return RedirectToAction(nameof(AccountController.Login), "/Admin/Account");
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public IActionResult ExternalLogin(string provider, string returnUrl = null)
        {
            // Request a redirect to the external login provider.
            var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Account", new { returnUrl });
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
            return Challenge(properties, provider);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null)
        {
            if (remoteError != null)
            {
                ErrorMessage = $"Error from external provider: {remoteError}";
                return RedirectToAction(nameof(Login));
            }
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                return RedirectToAction(nameof(Login));
            }

            // Sign in the user with this external login provider if the user already has a login.
            var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);
            if (result.Succeeded)
            {
                _logger.LogInformation("User logged in with {Name} provider.", info.LoginProvider);
                return RedirectToLocal(returnUrl);
            }
            if (result.IsLockedOut)
            {
                return RedirectToAction(nameof(Lockout));
            }
            else
            {
                // If the user does not have an account, then ask the user to create an account.
                ViewData["ReturnUrl"] = returnUrl;
                ViewData["LoginProvider"] = info.LoginProvider;
                var email = info.Principal.FindFirstValue(ClaimTypes.Email);
                return View("ExternalLogin", new ExternalLoginViewModel { Email = email });
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ExternalLoginConfirmation(ExternalLoginViewModel model, string returnUrl = null)
        {
            if (ModelState.IsValid)
            {
                // Get the information about the user from the external login provider
                var info = await _signInManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    throw new ApplicationException("Error loading external login information during confirmation.");
                }
                var user = new AspNetUser { UserName = model.Email, Email = model.Email };
                var result = await _userManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await _userManager.AddLoginAsync(user, info);
                    if (result.Succeeded)
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        _logger.LogInformation("User created an account using {Name} provider.", info.LoginProvider);
                        return RedirectToLocal(returnUrl);
                    }
                }
                AddErrors(result);
            }

            ViewData["ReturnUrl"] = returnUrl;
            return View(nameof(ExternalLogin), model);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string userName, string code)
        {
            if (_userManager == null || code == null)
            {
                return View("ConfirmEmailFailed");
            }
            var user = await _userManager.FindByNameAsync(userName);
            if (user != null)
            {
                IdentityResult result;
                try
                {
                    var token = code.Replace(" ", "+");
                    result = await _userManager.ConfirmEmailAsync(user, token);
                    if (result.Succeeded)
                    {
                        user.Active = true;
                        _context.Users.Update(user);
                        await _context.SaveChangesAsync();
                    }
                }
                catch (InvalidOperationException ioe)
                {
                    // ConfirmEmailAsync throws when the userId is not found.
                    ViewBag.errorMessage = ioe.Message;
                    return View("ConfirmEmailFailed");
                }

                if (result.Succeeded)
                {
                    return View();
                } 
            }

            // If we got this far, something failed.
            // AddErrors(result);
            ViewBag.errorMessage = "ConfirmEmail failed";
            return Redirect("ConfirmEmailFailed");
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult ConfirmEmailFailed()
        {
            return View();
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                //if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
                if (user == null)
                {
                    // Don't reveal that the user does not exist or is not confirmed
                    //return RedirectToAction(nameof(ForgotPasswordConfirmation));
                    //return Redirect("ForgotPasswordConfirmation");
                    ModelState.AddModelError(string.Empty, "Email không có trong hệ thống");
                    return View(model);
                }

                // For more information on how to enable account confirmation and password reset please
                // visit https://go.microsoft.com/fwlink/?LinkID=532713
                var code = await _userManager.GeneratePasswordResetTokenAsync(user);
                var callbackUrl = Url.ResetPasswordCallbackLink(user.Id, code, Request.Scheme);
                var email = _emailConfiguration.SmtpUsername;
                var pass= _emailConfiguration.SmtpPassword;
                var port = _emailConfiguration.SmtpPort;
                var server = _emailConfiguration.SmtpServer;
                var msg = CommonUtil.SendMail(email, user.Email, "Forgot password", callbackUrl, server, port, email, pass);
                if (!msg.Error)
                    //return RedirectToAction(nameof(ForgotPasswordConfirmation));
                    return Redirect("ForgotPasswordConfirmation");
                else
                    return View();
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult ForgotPasswordConfirmation()
        {
            return View();
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult ResetPassword(string code = null)
        {
            if (code == null)
            {
                throw new ApplicationException("A code must be supplied for password reset.");
            }
            var model = new ResetPasswordViewModel { Code = code };
            return View(model);
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToAction(nameof(ResetPasswordConfirmation));
            }
            var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);
            if (result.Succeeded)
            {
                //return RedirectToAction(nameof(ResetPasswordConfirmation));
                return Redirect("ResetPasswordConfirmation");
            }
            AddErrors(result);
            return View();
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult ResetPasswordConfirmation()
        {
            return View();
        }


        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }

        [HttpGet]
        public ActionResult DowloadApp()
        {
            string filePath = _hostingEnvironment.WebRootPath + "\\app\\";
            string fileName = "app-debug.apk";

            byte[] fileBytes = System.IO.File.ReadAllBytes(filePath + fileName);

            return File(fileBytes, "application/force-download", fileName);
        }

        [HttpPost]
        public JsonResult GetVersionApp()
        {
            var common = _context.CommonSettings.Where(x => !x.IsDeleted && x.Group.Equals("VERSION_APP"));
            return Json(common);
        }

        #region Helpers

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
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

        #endregion
    }
}