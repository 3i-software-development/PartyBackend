using Microsoft.AspNetCore.Mvc;

namespace III.Admin.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class BOMController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
