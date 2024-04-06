using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using ESEIM.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Http;
using ESEIM.Utils;
using System.IO;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc.Razor;
using System.Globalization;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.ResponseCompression;
using III.Admin.Utils;
using Host.DbContexts;
using log4net;
using log4net.Extensions.AspNetCore;
using Microsoft.AspNetCore.Cors.Infrastructure;
using SmartBreadcrumbs.Extensions;
using Microsoft.AspNetCore.Internal;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.OpenApi.Models;
using Quartz;
using DalSoft.Hosting.BackgroundQueue.DependencyInjection;
using Microsoft.IdentityModel.Logging;

namespace ESEIM
{
    public class Startup
    {
        public static IHostingEnvironment _env;
        public Startup(IHostingEnvironment env)
        {
            _env = env;
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
            Environment = env;
        }

        public IConfigurationRoot Configuration { get; }
        public IHostingEnvironment Environment { get; }
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHttpContextAccessor();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc(name: "V1", new OpenApiInfo() { Title = "Mobile API", Version = "v1" });
            });
            // Add CORS:
            var envName = Environment.EnvironmentName;
            Console.Write(envName);
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigin",
                    builder => builder.WithOrigins("*")
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
                options.AddPolicy("CorsPolicy", policyBuilder => policyBuilder
                    .WithOrigins("http://localhost", "http://127.0.0.1:3000", "http://localhost:4200", "ionic://localhost", "http://localhost:8080", "https://notepad.iktutor.com", "https://notepad.888tutor.com")
                    .SetIsOriginAllowedToAllowWildcardSubdomains()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });
            //if (envName == "Development")
            //{
            //}
            //else
            //{
            //    services.AddCors(options =>
            //    {
            //    });
            //}
            var appSettings = Configuration.GetSection("AppSettings");
            //var connStr = Configuration.GetSection("ConnectionStrings");
            //var url = "server=192.168.1.68,1437;database=SmartWork_Vatco_Test;uid=user_swork_vatco;password=Vietnam@3i2020;multipleactiveresultsets=true";
            //var endCodeConnectionString = EncodeConnectString.EncryptString(url, "14/11/2020");
            //var deCodeConnectionString = EncodeConnectString.DecryptString(Configuration.GetConnectionString("EIMConnection"));
            services.Configure<AppSettings>(appSettings);
            //services.Configure<ConnectionStrings>(connStr);
            services.AddDbContext<EIMDBContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("EIMConnection"), opt => opt.UseRowNumberForPaging());
                options.EnableSensitiveDataLogging();
            });
            services.AddIdentity<AspNetUser, AspNetRole>(options =>
            options.Password = new PasswordOptions
            {
                RequiredLength = 6,
                RequireDigit = false,
                RequireLowercase = false,
                RequireUppercase = false,
                RequireNonAlphanumeric = false
            }).AddEntityFrameworkStores<EIMDBContext>().AddDefaultTokenProviders();
            services.AddLocalization(options => options.ResourcesPath = "Resources");
            services.AddResponseCaching();
            services.AddMvc()
           .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
           .AddDataAnnotationsLocalization();
            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
            });

            var dtf = new DateTimeFormatInfo
            {
                ShortDatePattern = "MM/dd/yyyy",
            };
            var numberFormart = new NumberFormatInfo
            {
                NumberDecimalSeparator = ".",
                CurrencyDecimalSeparator = "."
            };

            //Bread crumd
            services.AddBreadcrumbs(GetType().Assembly, options =>
            {
                options.DontLookForDefaultNode = true;
            });

            var cultureInfo = new CultureInfo("vi-VN");
            CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
            CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;
            cultureInfo.DateTimeFormat = dtf;
            cultureInfo.NumberFormat = numberFormart;
            services.Configure<RequestLocalizationOptions>(options =>
            {
                var supportedCultures = new[]
                {
                       new CultureInfo("vi-VN") {DateTimeFormat=dtf,NumberFormat = numberFormart  },
                       new CultureInfo("en-US"){DateTimeFormat=dtf,NumberFormat = numberFormart },
                       new CultureInfo("ja-JA"){DateTimeFormat=dtf,NumberFormat = numberFormart },
                       new CultureInfo("zh-TW"){DateTimeFormat=dtf,NumberFormat = numberFormart },
                       new CultureInfo("ko-KR"){DateTimeFormat=dtf,NumberFormat = numberFormart },
                       new CultureInfo("lo-LA"){DateTimeFormat=dtf,NumberFormat = numberFormart },
                       new CultureInfo("km-KH"){DateTimeFormat=dtf,NumberFormat = numberFormart },
                       new CultureInfo("my-MM"){DateTimeFormat=dtf,NumberFormat = numberFormart },
                       new CultureInfo("fr-FR"){DateTimeFormat=dtf,NumberFormat = numberFormart },
                       new CultureInfo("de-DE"){DateTimeFormat=dtf,NumberFormat = numberFormart },
                    };
                options.DefaultRequestCulture = new RequestCulture(cultureInfo);
                options.SupportedCultures = supportedCultures;
                options.SupportedUICultures = supportedCultures;
                options.RequestCultureProviders = new List<IRequestCultureProvider>
                    {
                        new QueryStringRequestCultureProvider(),
                        new CookieRequestCultureProvider()
                    };
            });
            services.Configure<FormOptions>(x =>
            {
                x.MultipartBodyLengthLimit = long.MaxValue;
            });
            services.Configure<MailSettings>(Configuration.GetSection("MailSettings"));
            services.Configure<CheckoutConfig>(Configuration.GetSection("CheckoutConfig"));

            services.AddSession();
            //services.AddCors();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddScoped<ILanguageService, LanguageService>();
            services.AddScoped<IUserLoginService, UserLoginService>();
            services.AddScoped<IParameterService, ParameterService>();
            services.AddScoped<IActionLogService, ActionLogService>();
            services.AddScoped<IUploadService, UploadService>();
            services.AddScoped<ICardJobService, CardJobService>();
            services.AddScoped<IFCMPushNotification, FCMPushNotification>();
            services.AddScoped<IGoogleApiService, GoogleApiService>();
            services.AddScoped<IRepositoryService, RepositoryService>();
            services.AddScoped<IWorkflowService, WorkflowService>();
            services.AddTransient<IMailService, MailService>();
            services.AddTransient<IPaymentService, PaymentService>();
            services.AddTransient<ILuceneService, LuceneService>();
            services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo(Environment.WebRootPath + "\\tempKeys"));
            services.AddSignalR();
            services.AddSingleton<IEmailConfiguration>(Configuration.GetSection("EmailConfiguration").Get<EmailConfiguration>());
            services.AddTransient<IMailKitService, MailKitService>();

            #region Config Session
            services.AddDistributedMemoryCache();

            services.AddSession(options =>
            {
                // Set a short timeout for easy testing.
                //options.IdleTimeout = TimeSpan.FromDays(30);
                options.Cookie.HttpOnly = true;
            });
            services.ConfigureApplicationCookie(options =>
            {
                // Cookie settings
                options.Cookie.HttpOnly = true;
                //options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
                // Địa chỉ trả về khi chưa đăng nhập /Admin/Account/Login.
                options.LoginPath = "/Admin/Account/Login";
                // Địa chỉ trả về khi không cho phép truy cập /Admin/Account/AccessDenied.
                options.AccessDeniedPath = "/Account/AccessDenied";
                //options.SlidingExpiration = true;
            });
            services.AddAuthentication("LoginSecurityScheme")
                .AddCookie("LoginSecurityScheme", options =>
                {
                    options.AccessDeniedPath = new PathString("/Account/Access");
                    options.Cookie = new CookieBuilder
                    {
                        //Domain = "",
                        HttpOnly = true,
                        Name = ".swork.Security.Cookie",
                        Path = "/",
                        SameSite = SameSiteMode.Lax,
                        SecurePolicy = CookieSecurePolicy.SameAsRequest
                    };
                    options.Events = new CookieAuthenticationEvents
                    {
                        OnSignedIn = context =>
                        {
                            Console.WriteLine("{0} - {1}: {2}", DateTime.Now,
                                "OnSignedIn", context.Principal.Identity.Name);
                            return Task.CompletedTask;
                        },
                        OnSigningOut = context =>
                        {
                            Console.WriteLine("{0} - {1}: {2}", DateTime.Now,
                                "OnSigningOut", context.HttpContext.User.Identity.Name);
                            return Task.CompletedTask;
                        },
                        OnValidatePrincipal = context =>
                        {
                            Console.WriteLine("{0} - {1}: {2}", DateTime.Now,
                                "OnValidatePrincipal", context.Principal.Identity.Name);
                            return Task.CompletedTask;
                        }
                    };
                    //options.ExpireTimeSpan = TimeSpan.FromMinutes(10);
                    options.LoginPath = new PathString("/Admin/Account/Login");
                    options.ReturnUrlParameter = "returnUrl";
                });
            #endregion

            // Add the required Quartz.NET services
            services.AddQuartz(q =>
            {
                // Use a Scoped container to create jobs. I'll touch on this later
                q.UseMicrosoftDependencyInjectionJobFactory();
                // Create a "key" for the job
                var jobKey = new JobKey("SendNotiJob");
                var meetingKey = new JobKey("CreateMeeting");
                var checkAppStatusJobKey = new JobKey("CheckAppStatusJob");

                // Register the job with the DI container
                q.AddJob<SendNotiJob>(opts => opts.WithIdentity(jobKey));
                q.AddJob<AutoCreateMeeting>(opts => opts.WithIdentity(meetingKey));
                q.AddJob<CheckAppStatusJob>(opts => opts.WithIdentity(checkAppStatusJobKey));

                // Create a trigger for the job
                q.AddTrigger(opts => opts
                    .ForJob(jobKey) // link to the SendNotiJob
                    .WithIdentity("SendNotiJob-trigger") // give the trigger a unique name
                    .WithCronSchedule("0 0/3 * * * ?")); // run every 3 minutes

                q.AddTrigger(opts => opts
                   .ForJob(meetingKey) // link to the SendNotiJob
                   .WithIdentity("Auto-Create-Meeting") // give the trigger a unique name
                   .WithCronSchedule("0 0 7 ? * MON-SAT *")); // run every week at 7pm  ""  

                q.AddTrigger(opts => opts
                    .ForJob(checkAppStatusJobKey) // link to the CheckAppStatusJob
                    .WithIdentity("CheckAppStatusJob-trigger") // give the trigger a unique name
                    .WithCronSchedule("0 0/30 * * * ?")); // run every 30 minutes
            });
            // Add the Quartz.NET hosted service

            services.AddQuartzHostedService(
                q => q.WaitForJobsToComplete = true);
            services.AddBackgroundQueue(onException: exception =>
            {

            });
        }
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IParameterService parameterService, ICorsService corsService, ICorsPolicyProvider corsPolicyProvider)
        {
            var appSettings = Configuration.GetSection("AppSettings");
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            Syncfusion.Licensing.SyncfusionLicenseProvider.RegisterLicense("Mgo+DSMBMAY9C3t2VVhjQlFaclhJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRd0VjWH9dcnJRTmZbWUE=");

            //loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            //loggerFactory.AddDebug();
            //loggerFactory.AddContext(LogLevel.Information, app.ApplicationServices.GetService<IHttpContextAccessor>());
            loggerFactory.AddLog4Net();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Error/Exception");
            }
            IdentityModelEventSource.ShowPII = true;
            app.UseStatusCodePagesWithReExecute("/Error/{0}");

            AppContext.Configure(app.ApplicationServices.
                GetRequiredService<IHttpContextAccessor>(), appSettings
            );
            var localizationOptions = app.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
            app.UseRequestLocalization(localizationOptions.Value);
            var provider = new FileExtensionContentTypeProvider();
            // Add new mappings
            provider.Mappings[".epub"] = "application/epub+zip";
            provider.Mappings[".mp3"] = "audio/mpeg";
            provider.Mappings[".mp4"] = "video/mp4";
            provider.Mappings[".webm"] = "video/webm";
            provider.Mappings[".wav"] = "audio/x-wav";

            if (env.IsDevelopment())
            {
                app.UseCors("AllowAllOrigin");
                app.UseStaticFiles(new StaticFileOptions
                {
                    ContentTypeProvider = provider,
                    OnPrepareResponse = (ctx) =>
                    {
                        var policy = corsPolicyProvider.GetPolicyAsync(ctx.Context, "AllowAllOrigin")
                            .ConfigureAwait(false)
                            .GetAwaiter().GetResult();

                        var corsResult = corsService.EvaluatePolicy(ctx.Context, policy);

                        corsService.ApplyResult(corsResult, ctx.Context.Response);
                    }
                });
            }
            else
            {
                app.UseCors("AllowAllOrigin");
                app.UseStaticFiles(new StaticFileOptions
                {
                    ContentTypeProvider = provider,
                    OnPrepareResponse = (ctx) =>
                    {
                        var policy = corsPolicyProvider.GetPolicyAsync(ctx.Context, "CorsPolicy")
                            .ConfigureAwait(false)
                            .GetAwaiter().GetResult();

                        var corsResult = corsService.EvaluatePolicy(ctx.Context, policy);

                        corsService.ApplyResult(corsResult, ctx.Context.Response);
                    }
                });
            }

            //app.UseCors("CorsPolicy");
            app.UseAuthentication();
            app.UseResponseCaching();
            app.UseSession();
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/mobile/v1/swagger.json", "My Mobile API v1");
                c.SwaggerEndpoint("/swagger/python/v1/swagger.json", "My Python API v1");
            });

            app.UseStaticFiles(new StaticFileOptions()
            {
                OnPrepareResponse = context =>
                {
                    context.Context.Response.Headers.Add("Cache-Control", "no-cache, no-store");
                    context.Context.Response.Headers.Add("Expires", "-1");
                }
            });
            app.UseSignalR(routes =>  // <-- SignalR 
            {
                routes.MapHub<ScheduleHub>("/scheduleHub");
            });
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                   name: "default",
                   template: "{controller=Home}/{action=Index}/{id?}");
                routes.MapRoute(
                    name: "admin",
                    template: "{area:exists}/{controller=WorkflowActivity}/{action=Index}/{id?}");
                routes.MapRoute(
                 name: "angular",
                 template: "{*url}",
                 defaults: new { controller = "CalendarRegistration", action = "Index" });
            });
        }
    }

    public class AppSettings
    {
        public string Authority { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string Host { get; set; }
        public string Api { get; set; }
        public string ClientScope { get; set; }
        public ADConfigs ADConfigs { get; set; }
        public OMSConfigs OMSConfigs { get; set; }
        public string UrlBase { get; set; }
        public string UrlEnterprise { get; set; }
        public string ServerCode { get; set; }
        public string UrlMain { get; set; }
        public string UrlProd { get; set; }
        public string DbName { get; set; }
        public bool AutoPermission { get; set; }
    }

    public class ADConfigs
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string LoginDN { get; set; }
        public string Password { get; set; }
        public string ObjectDN { get; set; }
    }

    public class OMSConfigs
    {
        public string Url { get; set; }
        public string Domain { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class ConnectionStrings
    {
        public string EIMConnection { get; set; }
    }

    public class FormOptions
    {
        public long? ValueLengthLimit { get; set; }
        public long? MultipartBodyLengthLimit { get; set; }
    }
}
