using III.Admin.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;

namespace III.Admin.Areas.Admin.Controllers
{
    [Area("Admin")]
    [AllowAnonymous]
    public class GuilineManagerController : BaseController
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public GuilineManagerController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        public IActionResult Index()
        {
            ViewData["CrumbGuilineManager"] = "Quản lý gợi ý";
            return View();
        }
        private string _jsonFilePath = "/views/front-end/user/Guide.json"; // Đường dẫn đến tệp JSON

        [HttpGet]
        public IActionResult GetGuidelines()
        {
            var guidelines = GetGuidelinesFromJson();
            return Ok(guidelines);
        }

        [HttpPost]
        public IActionResult AddGuideline([FromBody] Guideline guideline)
        {
            var guidelines = GetGuidelinesFromJson();
            guidelines.Add(guideline);
            SaveGuidelinesToJson(guidelines);
            return Ok();
        }

        [HttpDelete]
        public IActionResult DeleteGuideline(string id)
        {
            var guidelines = GetGuidelinesFromJson();
            var guidelineToRemove = guidelines.FirstOrDefault(g => g.Id == id);
            if (guidelineToRemove != null)
            {
                guidelines.Remove(guidelineToRemove);
                SaveGuidelinesToJson(guidelines);
                return Ok();
            }
            return NotFound();
        }

        [HttpPut]
        public IActionResult UpdateGuideline([FromBody] Guideline guideline)
        {
            var guidelines = GetGuidelinesFromJson();
            var existingGuideline = guidelines.FirstOrDefault(g => g.Id == guideline.Id);
            if (existingGuideline != null)
            {
                existingGuideline.Guide = guideline.Guide;
                SaveGuidelinesToJson(guidelines);
                return Ok();
            }
            return NotFound();
        }

        private List<Guideline> GetGuidelinesFromJson()
        {
            if (!System.IO.File.Exists(_hostingEnvironment.WebRootPath + _jsonFilePath))
            {
                // Nếu tệp không tồn tại, trả về danh sách rỗng
                return new List<Guideline>();
            }

            string json = System.IO.File.ReadAllText(_hostingEnvironment.WebRootPath + _jsonFilePath);
            return JsonConvert.DeserializeObject<List<Guideline>>(json);
        }

        private void SaveGuidelinesToJson(List<Guideline> guidelines)
        {
            string json = JsonConvert.SerializeObject(guidelines, Formatting.Indented);
            System.IO.File.WriteAllText(_hostingEnvironment.WebRootPath + _jsonFilePath, json);
        }
    }
    public class Guideline
    {
        public string Id { get; set; }
        public string Guide { get; set; }
    }
}
