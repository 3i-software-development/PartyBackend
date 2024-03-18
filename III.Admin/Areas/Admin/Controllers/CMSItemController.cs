using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ESEIM.Models;
using ESEIM.Utils;
using Microsoft.EntityFrameworkCore;
using FTU.Utils.HelperNet;
using System.Data;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json.Linq;
using SmartBreadcrumbs.Attributes;
using III.Domain.Enums;
using Microsoft.AspNetCore.Authorization;

namespace III.Admin.Controllers
{
    [Area("Admin")]

    public class CMSItemController : BaseController
    {
        private readonly EIMDBContext _context;
        private readonly IUploadService _upload;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IStringLocalizer<CMSItemController> _stringLocalizer;
        private readonly IStringLocalizer<SharedResources> _sharedResources;
        private readonly IStringLocalizer<EDMSRepositoryController> _stringLocalizerEdms;
        public CMSItemController(EIMDBContext context, IUploadService upload, IHostingEnvironment hostingEnvironment,
            IStringLocalizer<CMSItemController> stringLocalizer, IStringLocalizer<EDMSRepositoryController> stringLocalizerEdms,
            IStringLocalizer<SharedResources> sharedResources)
        {
            _context = context;
            _upload = upload;
            _hostingEnvironment = hostingEnvironment;
            _stringLocalizer = stringLocalizer;
            _sharedResources = sharedResources;
            _stringLocalizerEdms = stringLocalizerEdms;
        }
        [Breadcrumb("ViewData.CrumbCmsItem", AreaName = "Admin", FromAction = "Index", FromController = typeof(ContentManageHomeController))]

        public IActionResult Index()
        {
            ViewData["CrumbDashBoard"] = _sharedResources["COM_CRUMB_DASH_BOARD"];
            ViewData["CrumbMenuSystemSett"] = _sharedResources["COM_CRUMB_SYSTEM"];
            ViewData["CrumbContentManage"] = _sharedResources["COM_CRUMB_CONTENT_MANAGE_HOME"];
            ViewData["CrumbCmsItem"] = _sharedResources["COM_CRUMB_CMS_ITEM"];
            return View();
        }

        #region JTable
        [HttpPost]
        public object JTable([FromBody]CMSItemsJTableModel jTablePara)
        {
            var PostFromDate = !string.IsNullOrEmpty(jTablePara.PostFromDate) ? DateTime.ParseExact(jTablePara.PostFromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
            var PostToDate = !string.IsNullOrEmpty(jTablePara.PostToDate) ? DateTime.ParseExact(jTablePara.PostToDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
            var CreFromDate = !string.IsNullOrEmpty(jTablePara.CreFromDate) ? DateTime.ParseExact(jTablePara.CreFromDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
            var CreToDate = !string.IsNullOrEmpty(jTablePara.CreToDate) ? DateTime.ParseExact(jTablePara.CreToDate, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;

            int intBegin = (jTablePara.CurrentPage - 1) * jTablePara.Length;
            var query = from a in _context.cms_items
                        join b in _context.cms_categories on a.cat_id equals b.id
                        where
                        (PostFromDate == null || (PostFromDate <= a.date_post))
                        && (PostToDate == null || (PostToDate >= a.date_post))
                        && (CreFromDate == null || (a.created.HasValue && CreFromDate <= a.created.Value.Date))
                        && (CreToDate == null || (a.created.HasValue && CreToDate >= a.created.Value.Date))
                        && (jTablePara.Category == null || (jTablePara.Category != null && a.cat_id.Equals(jTablePara.Category)))
                        && (string.IsNullOrEmpty(jTablePara.Title) || a.title.Contains(jTablePara.Title))
                        && (jTablePara.Status == null || jTablePara.Status.Equals(a.published))
                        && (jTablePara.TypeItem == null || jTablePara.TypeItem.Equals(a.featured_ordering))
                        && (jTablePara.Category == null || a.cat_id.Equals(jTablePara.Category))
                        select new CMSItemModel
                        {
                            Id = a.id,
                            Title = a.title,
                            Alias = a.alias,
                            Name = b.name,
                            Published = a.published,
                            Created = a.created,
                            Modified = a.modified,
                            DatePost = a.date_post,
                            Ordering = a.ordering
                        };

            int count = query.Count();
            var data = new List<CMSItemModel>();
            if (!jTablePara.QueryOrderBy.ToLower().Contains("id"))
            {
                data = query.AsQueryable().OrderUsingSortExpression(jTablePara.QueryOrderBy).Skip(intBegin).Take(jTablePara.Length).ToList(); 
            }
            else
            {
                data = query.OrderBy(x => x.Ordering).Skip(intBegin).Take(jTablePara.Length).ToList();
            }
            foreach (var item in data)
            {
                item.IsRead = GetIsReadNotification(item.Id.ToString(), EnumHelper<NotificationType>.GetDisplayValue(NotificationType.Cms));
            }

            var jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, count, "Id", "Title", "Alias", "Name", "Published", "Created", "Modified", "DatePost", "IsRead");
            return Json(jdata);
        }
        public object JTableFile([FromBody]CMSItemsJTableModel jTablePara)
        {
            int intBegin = (jTablePara.CurrentPage - 1) * jTablePara.Length;
            var query = from a in _context.cms_attachments
                        join b in _context.cms_items
                        on a.item_id equals b.id
                        where b.id == jTablePara.Id
                        select new
                        {
                            id = a.id,
                            item_id = a.item_id,
                            file_name = a.file_name,
                            title = a.title,
                            title_attribute = a.title_attribute,
                            hits = b.hits,
                            file_url = a.file_url,
                            file_path = a.file_path,
                            file_type = a.file_type,


                        };

            int count = query.Count();
            var data = query.AsQueryable().OrderUsingSortExpression(jTablePara.QueryOrderBy).Skip(intBegin).Take(jTablePara.Length);
            var jdata = JTableHelper.JObjectTable(data.ToList(), jTablePara.Draw, count, "id", "file_name", "title", "title_attribute", "hits", "file_url", "file_path", "file_type", "item_id");
            return Json(jdata);
        }
        [HttpPost]
        public object JTableCSA([FromBody]CSAJTableModel jTablePara)
        {

            int intBegin = (jTablePara.CurrentPage - 1) * jTablePara.Length;
            var query = from a in _context.CommonSettingArticles
                        where (!a.IsDeleted && a.ArticleCode.Equals(jTablePara.ArticleCode))
                        select new
                        {
                            a.SettingID,
                            a.ValueSet,
                            a.CodeSet,
                            a.Group,
                            a.GroupNote,
                            a.Title,
                            a.ArticleCode,
                        };

            int count = query.Count();
            var data = query.AsQueryable().OrderUsingSortExpression(jTablePara.QueryOrderBy).Skip(intBegin).Take(jTablePara.Length);
            var jdata = JTableHelper.JObjectTable(data.ToList(), jTablePara.Draw, count, "SettingID", "ValueSet", "CodeSet", "Group", "Title", "GroupNote", "ArticleCode");
            return Json(jdata);
        }
        #endregion

        #region Function
        [HttpPost]
        public object Insert([FromBody]CMSItemsModel data)
        {
            var msg = new JMessage() { Error = false, ID = 0 };
            try
            {
                var session = HttpContext.GetSessionUser();

                var createdTime = !string.IsNullOrEmpty(data.created) ? DateTime.ParseExact(data.created, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture) : (DateTime?)null;
                var model = _context.cms_items.FirstOrDefault(x => x.title.Equals(data.title) && x.cat_id == data.cat_id);

                if (model == null)
                {
                    var obj = new cms_items
                    {
                        title = data.title,
                        alias = data.alias,
                        cat_id = data.cat_id,
                        intro_text = data.intro_text,
                        created = DateTime.Now,
                        template = data.template,
                        featured_ordering = data.featured_ordering,
                        language = data.language,
                        created_by_alias = ESEIM.AppContext.UserName,
                        date_post = data.date_post,
                        full_text = data.full_text,
                        ordering = data.ordering,
                        gallery = "",
                        published = data.published.HasValue ? data.published.Value : true,
                        multiple_language = data.multiple_language,
                        json_editor = data.json_editor
                };

                    _context.cms_items.Add(obj);
                    _context.SaveChanges();

                    var listUserNotify = new List<UserNotify>();

                    var listUser = _context.Users.Where(x => x.Active).Select(x => x.Id);
                    foreach (var item in listUser)
                    {
                        //Add user to Notification
                        var userNotify = new UserNotify
                        {
                            UserId = item
                        };

                        if (!listUserNotify.Any(p => p.UserId.Equals(userNotify.UserId)) && !userNotify.UserId.Equals(ESEIM.AppContext.UserId))
                            listUserNotify.Add(userNotify);
                    }

                    if (listUserNotify.Count > 0)
                    {
                        var notification = new NotificationManager
                        {
                            ListUser = listUserNotify,
                            Title = string.Format("{0} đã tạo 1 tin mới: {1}", session.FullName, data.title),
                            ObjCode = obj.id.ToString(),
                            ObjType = EnumHelper<NotificationType>.GetDisplayValue(NotificationType.Cms),
                        };

                        InsertNotification(notification);
                    }

                    // msg.Title = "Thêm mới thành công";
                    msg.Title = _stringLocalizer["CMS_ITEM_MSG_ADD_SUCCESS"];
                    msg.ID = obj.id;

                }
                else
                {
                    //msg.Title = "Bài viết đã tồn tại";
                    msg.Title = _stringLocalizer["CMS_ITEM_MSG_EXITS"];
                    msg.Error = true;
                }
                return msg;
            }
            catch (Exception ex)
            {
                msg.Error = true;
                //msg.Title = "Có lỗi xảy ra khi thêm";
                msg.Title = _sharedResources["COM_ERR_ADD"];
                return msg;
            }
        }
        [HttpPost]
        public object Update([FromBody]CMSItemsModel data)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var datePost = !string.IsNullOrEmpty(data.created) ? DateTime.ParseExact(data.created, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture) : (DateTime?)null;
                var model = _context.cms_items.FirstOrDefault(x => x.id.Equals(data.id));
                if (model != null)
                {
                    model.language = data.language;
                    model.title = data.title;
                    model.template = data.template;
                    model.featured_ordering = data.featured_ordering;
                    //model.created = createdTime;
                    model.alias = data.alias;
                    model.date_post = data.date_post;
                    model.intro_text = data.intro_text;
                    model.cat_id = data.cat_id;
                    model.full_text = data.full_text;
                    model.published = data.published.HasValue ? data.published.Value : model.published;
                    model.modified = DateTime.Now;
                    model.ordering = data.ordering;
                    model.json_editor = data.json_editor;
                    if (data.language != "CMS_LANGUAGE20211027001")
                    {
                        model.multiple_language = data.multiple_language;
                    }
                    _context.cms_items.Update(model);
                    _context.SaveChanges();
                    //msg.Title = "Cập nhật thành công";
                    msg.Title = _stringLocalizer["CMS_ITEM_UPDATE_SUCCESS"];
                }
                else
                {
                    msg.Error = true;
                    //msg.Title = "Bài viết không tồn tại";
                    msg.Title = _stringLocalizer["CMS_ITEM_MSG_ARC_NOT_EXITS"];

                }
                return msg;
            }
            catch (Exception ex)
            {
                msg.Error = true;
                //msg.Title = "Có lỗi khi cập nhật";
                msg.Title = _sharedResources["COM_UPDATE_FAIL"];
                return msg;
            }
        }
        [HttpPost]
        public object UpdateHashTag([FromBody]CMSItemsModel data)
        {

            var msg = new JMessage() { Error = false };
            try
            {
                var datePost = !string.IsNullOrEmpty(data.created) ? DateTime.ParseExact(data.created, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture) : (DateTime?)null;
                var model = _context.cms_items.FirstOrDefault(x => x.id.Equals(data.id));
                if (model != null)
                {
                    model.hash_tag = data.hash_tag;
                    model.modified = DateTime.Now;
                    _context.cms_items.Update(model);
                    _context.SaveChanges();
                    //msg.Title = "Cập nhật thành công";
                    msg.Title = _stringLocalizer["CMS_ITEM_UPDATE_SUCCESS"];
                }
                else
                {
                    msg.Error = true;
                    //msg.Title = "Bài viết không tồn tại";
                    msg.Title = _stringLocalizer["CMS_ITEM_MSG_ARC_NOT_EXITS"];

                }
                return msg;
            }
            catch (Exception ex)
            {
                msg.Error = true;
                //msg.Title = "Có lỗi khi cập nhật";
                msg.Title = _sharedResources["COM_UPDATE_FAIL"];
                return msg;
            }
        }
        [HttpPost]
        [AllowAnonymous]
        public object GetItem([FromBody] int id)
        {
            var obj = (from a in _context.cms_items
                       where a.id == id
                       select new
                       {
                           title = a.title,
                           id = a.id,
                           hits = a.hits,
                           full_text = a.full_text,
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
                           a.hash_tag,
                           multiple_language = a.multiple_language,
                           a.ordering,
                           a.json_editor
                       }).FirstOrDefault();

            RemoveUserInNotify(id.ToString(), EnumHelper<NotificationType>.GetDisplayValue(NotificationType.Cms), false);

            return obj;
        }
        [HttpGet]
        [AllowAnonymous]
        public object GetListItemByCateId(int catId)
        {
            var obj = (from a in _context.cms_items
                       where a.cat_id == catId && a.published == true
                       orderby a.created descending
                       select new
                       {
                           title = a.title,
                           id = a.id,
                           hits = a.hits,
                           full_text = a.full_text,
                           extra_fields = a.extra_fields,
                           featured_ordering = a.featured_ordering,
                           cat_id = a.cat_id,
                           alias = a.alias,
                           created = a.created.HasValue ? a.created.Value.ToString("dd/MM/yyyy") : "",
                           
                       }).ToList();

            RemoveUserInNotify(catId.ToString(), EnumHelper<NotificationType>.GetDisplayValue(NotificationType.Cms), false);

            return obj;
        }
        [HttpPost]
        public JsonResult InsertFile(cms_attachments obj, IFormFile fileUpload)
        {
            var msg = new JMessage() { Error = false, Title = "" };
            try
            {
                var mimeType = fileUpload.ContentType;
                string extension = Path.GetExtension(fileUpload.FileName);
                string fileCode = string.Concat("REPOSITORY", Guid.NewGuid().ToString());
                var upload = _upload.UploadFile(fileUpload, _hostingEnvironment.WebRootPath + "/uploads/files/");

                var data = new cms_attachments
                {
                    item_id = obj.item_id,
                    file_name = fileUpload.FileName,
                    file_type = Path.GetExtension(fileUpload.FileName),
                    title = obj.title == "undefined" ? "" : obj.title,
                    title_attribute = obj.title_attribute == "undefined" ? "" : obj.title_attribute,
                    file_url = "/uploads/files/" + upload.Object.ToString(),

                };
                _context.cms_attachments.Add(data);

                _context.SaveChanges();
                msg.Title = _stringLocalizer["EDMSR_MSG_UPLOAD_FILE_SUCCESS"];//"Tải tệp tin thành công";
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex.Message;
                msg.Title = _stringLocalizer["EDMSR_MSG_UPLOAD_FILE_ERROR"];//"Tải tệp tin lỗi";
            }
            return Json(msg);
        }
        [HttpPost]
        public JsonResult InsertImage(cms_items obj, IFormFile images)
        {
            var msg = new JMessage() { Error = false, Title = "" };
            try
            {
                var data = _context.cms_items.FirstOrDefault(x => x.id == obj.id);
                if (data != null)
                {
                    if (images != null)
                    {
                        var upload = _upload.UploadImage(images);
                        if (upload.Error)
                        {
                            msg.Error = true;
                            msg.Title = upload.Title;
                            return Json(msg);
                        }
                        else
                        {
                            data.gallery = "/uploads/Images/" + upload.Object.ToString();
                            data.image_caption = obj.image_caption;
                            data.image_credits = obj.image_credits;
                        }
                    }
                    else
                    {
                        msg.Error = true;
                        //msg.Title = "Có lỗi khi thêm ảnh";
                        msg.Title = _stringLocalizer["EDMSR_MSG_UPLOAD_FILE_NULL"];
                        return Json(msg);
                    }

                    _context.cms_items.Update(data);
                    _context.SaveChanges();
                    //msg.Title = "Tải ảnh thành công";
                    msg.Title = _stringLocalizer["CMS_ITEM_MSG_SUCCESS_DOWLOAD"];
                }
                return Json(msg);
            }
            catch
            {
                msg.Error = true;
                //msg.Title = "Có lỗi khi thêm ảnh";
                msg.Title = _stringLocalizer["CMS_ITEM_MSG_ERR_ADD_IMG"];
                return Json(msg);
            }
        }
        [HttpPost]
        public object DeleteFile(int id)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                //remove file
                var file = _context.cms_attachments.FirstOrDefault(x => x.id == id);
                _context.cms_attachments.Remove(file);
                //delete index
                _context.SaveChanges();
                msg.Title = _stringLocalizer["EDMSR_MSG_DELETE_SUCCESS"];//"Xóa file thành công";
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Object = ex.Message;
                msg.Title = _sharedResources["COM_ERR_DELETE"];//"Xóa file lỗi";
            }
            return Json(msg);
        }
        [HttpPost]
        public object Delete(int id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.cms_items.FirstOrDefault(x => x.id.Equals(id));
                if (data == null)
                {
                    msg.Error = true;
                    //msg.Title = "Bài viết không tồn tại";
                    msg.Title = _stringLocalizer["CMS_ITEM_MSG_ARC_NOT_EXITS"];
                }
                else
                {
                    _context.cms_items.Remove(data);

                    RemoveUserInNotify(id.ToString(), EnumHelper<NotificationType>.GetDisplayValue(NotificationType.Cms), true);

                    _context.SaveChanges();
                    //msg.Title = "Xóa bài viết thành công";
                    msg.Title = _stringLocalizer["CMS_ITEM_MSG_DELETE_ARC_SUCCESS"];
                }
                return msg;

            }
            catch (Exception ex)
            {
                msg.Error = true;
                //msg.Title = "Có lỗi khi xóa";
                msg.Title = _sharedResources["COM_ERR_DELETE"];
                return msg;
            }
        }
        [HttpPost]
        public object Approve(int id)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var data = _context.cms_items.FirstOrDefault(x => x.id.Equals(id));
                if (data == null)
                {
                    msg.Error = true;
                    //msg.Title = "Bài viết không tồn tại";
                    msg.Title = _stringLocalizer["CMS_ITEM_MSG_ARC_NOT_EXITS"];

                }
                else
                {
                    data.published = !data.published;
                    _context.cms_items.Update(data);
                    _context.SaveChanges();
                    //msg.Title = "Thay đổi bài viết thành công";
                    msg.Title = _stringLocalizer["CMS_ITEM_MSG_UPDATE_ARC_SUCCESS"];
                }
                return msg;

            }
            catch (Exception ex)
            {
                msg.Error = true;
                //msg.Title = "Có lỗi khi thay đổi";
                msg.Title = _stringLocalizer["CMS_ITEM_MSG_UPDATE_FAIL"];
                return msg;
            }
        }
        [HttpPost]
        public JsonResult DeleteCSA(int Id)
        {


            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var data = _context.CommonSettingArticles.FirstOrDefault(x => x.SettingID == Id);
                data.DeletedTime = DateTime.Now.Date;
                data.DeletedBy = ESEIM.AppContext.UserName;
                data.IsDeleted = true;

                _context.CommonSettingArticles.Update(data);
                _context.SaveChanges();
                //msg.Title = "Xóa phiếu mua tài sản thành công!";
                msg.Title = _stringLocalizer["CMS_ITEM_MSG_DELETE_EXT_ARC_SUCCESS"];
            }
            catch (Exception)
            {
                msg.Error = true;
                //msg.Title = "Có lỗi xảy ra khi xóa!";
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }
        [HttpPost]
        public object GetItemCSA([FromBody] int id)
        {
            var msg = new JMessage() { Error = false, Title = "" };
            var data = _context.CommonSettingArticles.FirstOrDefault(x => x.SettingID == id);
            if (data != null)
            {
                msg.Object = data;
            }
            return Json(msg);

        }

        [HttpPost]
        public object InsertCSA([FromBody]CommonSettingArticleModel data)
        {
            var msg = new JMessage() { Error = false, ID = 0 };
            try
            {
                // var createdTime = !string.IsNullOrEmpty(data.CreatedTime) ? DateTime.ParseExact(data.CreatedTime, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture) : (DateTime?)null;
                var model = _context.CommonSettingArticles.FirstOrDefault(x => x.CodeSet.Equals(data.CodeSet));

                if (model == null)
                {
                    var obj = new CommonSettingArticle
                    {
                        CodeSet = data.CodeSet,
                        ValueSet = data.ValueSet,
                        Group = data.Group,
                        Priority = data.Priority,
                        Type = data.Type,
                        GroupNote = data.GroupNote,
                        ArticleCode = data.alias,
                        Title = data.Title,
                        CreatedTime = DateTime.Now,
                        CreatedBy = ESEIM.AppContext.UserName,
                    };

                    _context.CommonSettingArticles.Add(obj);
                    _context.SaveChanges();
                    // msg.Title = "Thêm mới thành công";
                    msg.Title = _stringLocalizer["CMS_ITEM_MSG_ADD_SUCCESS"];
                    msg.ID = obj.SettingID;

                }
                else
                {
                    //msg.Title = "Bài viết đã tồn tại";
                    msg.Title = _stringLocalizer["CMS_ITEM_MSG_EXITS"];
                    msg.Error = true;
                }
                return msg;
            }
            catch (Exception ex)
            {
                msg.Error = true;
                //msg.Title = "Có lỗi xảy ra khi thêm";
                msg.Title = _sharedResources["COM_ERR_ADD"];
                return msg;
            }
        }
        public JsonResult UpdateCSA([FromBody] CommonSettingArticleModel obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {


                var data = _context.CommonSettingArticles.FirstOrDefault(x => x.SettingID == obj.SettingID);

                data.UpdatedTime = DateTime.Now.Date;
                data.UpdatedBy = ESEIM.AppContext.UserName;
                data.CodeSet = obj.CodeSet;
                data.ValueSet = obj.ValueSet;
                data.GroupNote = obj.GroupNote;
                data.Group = obj.Group;
                data.Priority = obj.Priority;
                data.Type = obj.Type;
                data.ArticleCode = obj.alias;
                data.Title = obj.Title;
                _context.CommonSettingArticles.Update(data);
                _context.SaveChanges();
                msg.Title = _stringLocalizer["CMS_ITEM_UPDATE_SUCCESS"];
            }
            catch (Exception ex)
            {
                msg.Error = true;
                // msg.Title = "Có lỗi khi cập nhật phiếu mua tài sản";
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }

            return Json(msg);
        }
        #endregion

        #region Combobox
        [HttpPost]
        public object GetCatID(int catId = 0)
        {
            var data = _context.cms_categories.Where(x => x.published == true && (catId == 0 || x.id == catId)).Select(x => new { Id = x.id, Name = x.name });
            return data.ToList();
        }
        [HttpPost]
        public object GetTypeCMA()
        {
            var data = _context.CommonSettings.Where(x => x.Group.Equals("CMA_TYPE")).Select(x => new { Code = x.CodeSet, Name = x.ValueSet });
            return data.ToList();
        }
        #endregion

        #region Manager notification
        [NonAction]
        public JsonResult InsertNotification([FromBody] NotificationManager obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var check = _context.NotificationManagers.Any(x => !x.IsDeleted && x.ObjCode.Equals(obj.ObjCode) && x.ObjType.Equals(obj.ObjType));
                if (!check)
                {
                    obj.NotifyCode = string.Format("NOTIFI_{0}", DateTime.Now.ToString("ddMMyyyyHHmmss"));
                    obj.CreatedBy = User.Identity.Name;
                    obj.CreatedTime = DateTime.Now;
                    _context.NotificationManagers.Add(obj);
                    _context.SaveChanges();
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "Thông báo đã tồn tại";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [NonAction]
        public JsonResult UpdateNotification([FromBody] NotificationManager obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var notifiManager = _context.NotificationManagers.FirstOrDefault(x => !x.IsDeleted && x.ObjCode.Equals(obj.ObjCode) && x.ObjType.Equals(obj.ObjType));
                if (notifiManager != null)
                {
                    var listDelete = notifiManager.ListUser.Where(x => !obj.ListUser.Any(p => p.UserId.Equals(x.UserId))).ToList();
                    var listInsert = obj.ListUser.Where(x => !notifiManager.ListUser.Any(p => p.UserId.Equals(x.UserId))).ToList();
                    if (listInsert.Count > 0)
                        notifiManager.ListUser.AddRange(listInsert);

                    foreach (var item in listDelete)
                    {
                        notifiManager.ListUser.Remove(item);
                    }

                    notifiManager.UpdatedBy = User.Identity.Name;
                    notifiManager.UpdatedTime = DateTime.Now;
                    _context.NotificationManagers.Update(notifiManager);
                    _context.SaveChanges();
                }
                else
                {
                    InsertNotification(obj);
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [NonAction]
        public JsonResult RemoveUserInNotify(string objCode, string objType, bool delete)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var notifiManager = _context.NotificationManagers.FirstOrDefault(x => !x.IsDeleted && x.ObjCode.Equals(objCode) && x.ObjType.Equals(objType));
                if (notifiManager != null)
                {
                    var listDelete = notifiManager.ListUser.Where(x => x.UserId.Equals(ESEIM.AppContext.UserId)).ToList();
                    foreach (var item in listDelete)
                    {
                        notifiManager.ListUser.Remove(item);
                    }

                    if (notifiManager.ListUser.Count == 0 || delete)
                    {
                        notifiManager.IsDeleted = true;
                        notifiManager.DeletedBy = User.Identity.Name;
                        notifiManager.DeletedTime = DateTime.Now;
                    }

                    notifiManager.UpdatedBy = User.Identity.Name;
                    notifiManager.UpdatedTime = DateTime.Now;
                    _context.NotificationManagers.Update(notifiManager);
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
            }
            return Json(msg);
        }

        [NonAction]
        public bool GetIsReadNotification(string objCode, string objType)
        {
            var isRead = true;
            try
            {
                var notifiManager = _context.NotificationManagers.FirstOrDefault(x => !x.IsDeleted && x.ObjCode.Equals(objCode) && x.ObjType.Equals(objType));
                if (notifiManager != null)
                {
                    if (notifiManager.ListUser.Any(p => p.UserId.Equals(ESEIM.AppContext.UserId)))
                        isRead = false;
                }
            }
            catch (Exception ex)
            {
            }
            return isRead;
        }
        #endregion

        #region Model
        public class CMSItemsModel
        {
            public int id { get; set; }
            public string title { get; set; }
            public string alias { get; set; }
            public int? cat_id { get; set; }
            public bool? published { get; set; }
            public string intro_text { get; set; }
            public string full_text { get; set; }
            public string video { get; set; }
            public string gallery { get; set; }
            public string extra_fields { get; set; }
            public string extra_fields_search { get; set; }
            public string created { get; set; }
            public int? created_by { get; set; }
            public string created_by_alias { get; set; }
            public int? checked_out { get; set; }
            public DateTime? checked_out_time { get; set; }
            public DateTime? modified { get; set; }
            public int? modified_by { get; set; }
            public DateTime? publish_up { get; set; }
            public DateTime? publish_down { get; set; }
            public bool? trash { get; set; }
            public int? access { get; set; }
            public int? ordering { get; set; }
            public short? featured { get; set; }
            public int? featured_ordering { get; set; }
            public string image_caption { get; set; }
            public string image_credits { get; set; }
            public string video_caption { get; set; }
            public string video_credits { get; set; }
            public int? hits { get; set; }
            public string @params { get; set; }
            public string meta_desc { get; set; }
            public string meta_data { get; set; }
            public string meta_key { get; set; }
            public string plugins { get; set; }
            public string language { get; set; }
            public string template { get; set; }
            public DateTime? date_post { get; set; }
            public string Category { get; set; }
            public string hash_tag { get; set; }
            public string multiple_language { get; set; }

            public string json_editor { get; set; }
        }

        public class CMSItemsJTableModel : JTableModel
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string PostFromDate { get; set; }
            public string PostToDate { get; set; }
            public string CreFromDate { get; set; }
            public string CreToDate { get; set; }
            public int? Category { get; set; }
            public bool? Status { get; set; }
            public int? TypeItem { get; set; }
            public int? CatId { get; set; }
        }

        public class CommonSettingArticleModel : JTableModel
        {
            public int SettingID { get; set; }
            public string CodeSet { get; set; }
            public string ArticleCode { get; set; }
            public string ValueSet { get; set; }
            public string Group { get; set; }
            public int Priority { get; set; }
            public int Id { get; set; }
            public string Logo { get; set; }
            public string Title { get; set; }
            public string GroupNote { get; set; }
            public bool IsDeleted { get; set; }
            public string Type { get; set; }
            public string alias { get; set; }
        }

        public class CSAJTableModel : JTableModel
        {
            public int SettingID { get; set; }
            public string CodeSet { get; set; }
            public string ArticleCode { get; set; }
            public string ValueSet { get; set; }
            public string Group { get; set; }
            public int Priority { get; set; }
            public int Id { get; set; }
            public string Logo { get; set; }
            public string GroupNote { get; set; }
            public bool IsDeleted { get; set; }
            public string Type { get; set; }
            public string alias { get; set; }
        }
        #endregion


        #region Language
        [AllowAnonymous]
        [HttpPost]
        public JsonResult GetListLanguage()
        {
            var data = _context.CommonSettings.Where(x => x.IsDeleted == false && x.Group == "CMS_LANGUAGE")
                .Select(x => new { Code = x.CodeSet, Name = x.Title }).ToList();
            return Json(data);
        }
        [HttpGet]
        public IActionResult Translation(string lang)
        {
            var resourceObject = new JObject();
            var query = _stringLocalizer.GetAllStrings().Select(x => new { x.Name, x.Value })
                .Union(_stringLocalizerEdms.GetAllStrings().Select(x => new { x.Name, x.Value }))
                .Union(_sharedResources.GetAllStrings().Select(x => new { x.Name, x.Value })).DistinctBy(x => x.Name);
            foreach (var item in query)
            {
                resourceObject.Add(item.Name, item.Value);
            }
            return Ok(resourceObject);
        }
        #endregion
    }
}