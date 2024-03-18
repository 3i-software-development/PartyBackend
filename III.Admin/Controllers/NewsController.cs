using ESEIM.Models;
using ESEIM.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;
using System;
using Microsoft.AspNetCore.Authorization;
using FTU.Utils.HelperNet;
using System.Collections.Generic;
using System.Globalization;
using static Dropbox.Api.Files.SearchMatchType;

namespace III.Admin.Controllers
{

    [AllowAnonymous]
    public class NewsController : Controller
    {

        private readonly EIMDBContext _context;

        public NewsController(EIMDBContext context)
        {
            _context = context;
        }

        public object JTable([FromBody] CMSItemsJTableModel jTablePara)
        {
            var PostFromDate = !string.IsNullOrEmpty(jTablePara.PostFromDate) ? DateTime.ParseExact(jTablePara.PostFromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
            var PostToDate = !string.IsNullOrEmpty(jTablePara.PostToDate) ? DateTime.ParseExact(jTablePara.PostToDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
            var CreFromDate = !string.IsNullOrEmpty(jTablePara.CreFromDate) ? DateTime.ParseExact(jTablePara.CreFromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
            var CreToDate = !string.IsNullOrEmpty(jTablePara.CreToDate) ? DateTime.ParseExact(jTablePara.CreToDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;

            int intBegin = (jTablePara.CurrentPage - 1) * jTablePara.Length;
            var query = from a in _context.cms_items.Where(x=>x.published==true)
                        join b in _context.cms_categories on a.cat_id equals b.id
                        orderby a.created descending
                        where
                        (PostFromDate == null || (PostFromDate <= a.date_post))
                        && (PostToDate == null || (PostToDate >= a.date_post))
                        && (CreFromDate == null || (a.created.HasValue && CreFromDate <= a.created.Value.Date))
                        && (CreToDate == null || (a.created.HasValue && CreToDate >= a.created.Value.Date))
                        && (jTablePara.Category == null || (jTablePara.Category != null && a.cat_id.Equals(jTablePara.Category)))
                        && (string.IsNullOrEmpty(jTablePara.Title) || (!string.IsNullOrEmpty(a.title) &&
                                                                     a.title.ToLower().Contains(jTablePara.Title))
                                                                 || (!string.IsNullOrEmpty(a.hash_tag) &&
                                                                     a.hash_tag.ToLower().Contains(jTablePara.Title)))
                        //&& (jTablePara.Status == null || jTablePara.Status.Equals(a.published))
                        //&& (jTablePara.TypeItem == null || jTablePara.TypeItem.Equals(a.featured_ordering))
                        && (jTablePara.Category == null || a.cat_id.Equals(jTablePara.Category))
                        select new CMSItemModelUser
                        {
                            Id = a.id,
                            Title = a.title,
                            Alias = a.alias,
                            Name = b.name,
                            Published = a.published,
                            Created = a.created,
                            Modified = a.modified,
                            DatePost = a.date_post,
                            Ordering = a.ordering,
                            Galery=a.gallery,
                            image_caption = a.image_caption,
                            image_credits = a.image_credits
                        };

            int count = query.Count();
            var data = new List<CMSItemModelUser>();

            data = query.OrderBy(x => x.Ordering).Skip(intBegin).Take(jTablePara.Length).ToList();

            var jdata = new
            {
                data = data,
                count = count,
                Length = jTablePara.Length,
                CurrentPage = jTablePara.CurrentPage,
            };
            return jdata;

        }

        public async Task<IActionResult> Index(int id)
        {
            var obj = (from a in _context.cms_items
                       where a.id == id &&
                            a.published == true

                       select new ModelViewPost
                       {
                           title = a.title,
                           id = a.id,
                           hits = a.hits,
                           full_text = a.cat_id == 1421?a.json_editor: a.full_text,
                           extra_fields = a.extra_fields,
                           featured_ordering = a.featured_ordering,
                           cat_id = a.cat_id,
                           alias = a.alias,
                           created = a.created.HasValue ? a.created.Value.ToString("dd/MM/yyyy HH:mm:ss") : "",
                           checked_out = a.checked_out,
                           date_post = a.date_post,
                           intro_text = a.intro_text,
                           published = a.published,
                           @params = a.@params,
                           extra_fields_search = a.extra_fields_search,
                           template = a.template,
                           language = a.language,
                           checked_out_time = a.checked_out_time,
                           gallery = a.gallery,
                           image_caption = a.image_caption,
                           image_credits = a.image_credits,
                           hash_tag=a.hash_tag,
                           multiple_language = a.multiple_language,
                           ordering=a.ordering
                       }).FirstOrDefault();
            if (obj == null)
            {
                return RedirectToAction("NotFound");
            }
            if(obj.cat_id== 1421)
            {
                return View("Page", obj);
            }
            return View(obj);
        }

        //public async Task<IActionResult> Page()
        //{
        //    return View();
        //}


        [AllowAnonymous]
        public async Task<IActionResult> NotFound()
        {
            ViewData["Content"] = "Không tìm thấy bài viết";
            return View();
        }

    }

    public class CMSItemModelUser
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Alias { get; set; }
        public string Name { get; set; }
        public bool Published { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Modified { get; set; }
        public DateTime? DatePost { get; set; }
        public int? Ordering { get; set; }
        public string Galery { get; set; }
        public string image_caption { get;  set; }
        public string image_credits { get; set; }
    }

    public class CMSItemsJTableModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string PostFromDate { get; set; }
        public string PostToDate { get; set; }
        public string CreFromDate { get; set; }
        public string CreToDate { get; set; }
        public int? Category { get; set; }
        public int Length { get; set; }
        public int CurrentPage { get; set; }
    }

    public class ModelViewPost
    {
        public string title { get; set; }
        public int id { get; set; }
        public int? hits { get; set; }
        public string full_text { get; set; }
        public string extra_fields { get; set; }
        public int? featured_ordering { get; set; }
        public int? cat_id { get; set; }
        public string alias { get; set; }
        public string created { get; set; }
        public int? checked_out { get; set; }
        public DateTime? date_post { get; set; }
        public string intro_text { get; set; }
        public bool published { get; set; }
        public string @params { get; set; }
        public string extra_fields_search { get; set; }
        public string template { get; set; }
        public string language { get; set; }
        public DateTime? checked_out_time { get; set; }
        public string gallery { get; set; }
        public string image_caption { get; set; }
        public string image_credits { get; set; }
        public string multiple_language { get; set; }
        public int? ordering { get; set; }
        public string hash_tag { get; set; }
    }
}
