using Microsoft.AspNetCore.Mvc;

namespace III.Admin.Areas.Admin.Controllers
{
    public class BOMController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
