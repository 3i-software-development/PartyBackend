using III.Admin.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using SmartBreadcrumbs.Attributes;

namespace III.Admin.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Route("/Admin/MenuBOM")]
    public class MenuBOMController : BaseController
    {
        private readonly IStringLocalizer<SharedResources> _sharedResources;

        public MenuBOMController(IStringLocalizer<SharedResources> sharedResources)
        {
            _sharedResources = sharedResources;
        }

        [Breadcrumb("ViewData.CrumbMenuBOM", AreaName = "Admin", FromAction = "Index", FromController = typeof(DashBoardController))]
        [AdminAuthorize]
        public IActionResult Index()
        {
            ViewData["CrumbDashBoard"] = _sharedResources["COM_CRUMB_DASH_BOARD"];
            ViewData["CrumbMenuBOM"] = "MENU BOM";
            return View();
        }
    }
}
