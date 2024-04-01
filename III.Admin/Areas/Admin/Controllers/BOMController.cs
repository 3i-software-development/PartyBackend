using III.Admin.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using SmartBreadcrumbs.Attributes;

namespace III.Admin.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class BOMController : BaseController
    {
        private readonly IStringLocalizer<SharedResources> _sharedResources;

        public BOMController(IStringLocalizer<SharedResources> sharedResources)
        {
            _sharedResources = sharedResources;
        }

        [Breadcrumb("ViewData.CrumbBOM", AreaName = "Admin", FromAction = "Index", FromController = typeof(MenuBOMController))]
        [AdminAuthorize]
        public IActionResult Index()
        {
            ViewData["CrumbDashBoard"] = _sharedResources["COM_CRUMB_DASH_BOARD"];
            ViewData["CrumbMenuBOM"] = "Menu Quản lý BOM";
            ViewData["CrumbBOM"] = "Quản lý BOM";

            return View();
        }
    }
}
