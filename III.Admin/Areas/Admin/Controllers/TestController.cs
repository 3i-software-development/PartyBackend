using Microsoft.AspNetCore.Mvc;

namespace III.Admin.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class TestController : Controller
    {
        public IActionResult Index()
        {
            ViewData["ServiceRegist"] = "Test";
            return View();
        }
    }
}
