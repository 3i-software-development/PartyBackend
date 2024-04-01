using ESEIM.Models;
using ESEIM.Utils;
using FTU.Utils.HelperNet;
using III.Admin.Controllers;
using III.Domain.Common;
using III.Domain.Enums;
using III.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using SmartBreadcrumbs.Attributes;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace III.Admin.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class BOMController : BaseController
    {
        private readonly IStringLocalizer<SharedResources> _sharedResources;
        private readonly EIMDBContext _context;

        public BOMController(IStringLocalizer<SharedResources> sharedResources,
            EIMDBContext context)
        {
            _sharedResources = sharedResources;
            _context = context;
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


        #region Header

        [HttpPost]
        public JsonResult JTableDetail([FromBody] JTableHeaders jTablePara, int userType = 0)
        {
            try
            {
                int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;
                var session = HttpContext.GetSessionUser();

                var fromDate = !string.IsNullOrEmpty(jTablePara.StartTime) ? DateTime.ParseExact(jTablePara.StartTime, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
                var toDate = !string.IsNullOrEmpty(jTablePara.EndTime) ? DateTime.ParseExact(jTablePara.EndTime, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;

                var query = from a in _context.BOMProductionWarehouseHds.Where(x=>!x.IsDeleted)
                            where (userType == 10
                                    || (userType == 2 && session.ListUserOfBranch.Any(x => x == a.CreatedBy))
                                    || (userType == 0 && session.UserName == a.CreatedBy)
                                )
                            select a;

                var count = query.Count();
                var data = query.OrderUsingSortExpression(jTablePara.QueryOrderBy).Skip(intBeginFor).Take(jTablePara.Length).AsNoTracking().ToList();
                
                var jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, count,
                    "Id", "TicketCode", "Status", "DeliverId", "ReceiverId", "ActivityCode", "TypeImpExp", "CreatedBy", "CreatedTime", "UpdatedBy", "UpdatedTime", "DeletedBy", "DeletedTime", "DeletionToken", "IsDeleted", "Flag"
                    );
                return Json(jdata);
            }
            catch (Exception ex)
            {
                var jdata = JTableHelper.JObjectTable(new List<BOMProductionWarehouseHd>(), jTablePara.Draw, 0,
                    "Id", "TicketCode", "Status", "DeliverId", "ReceiverId", "ActivityCode", "TypeImpExp", "CreatedBy", "CreatedTime", "UpdatedBy", "UpdatedTime", "DeletedBy", "DeletedTime", "DeletionToken", "IsDeleted", "Flag"
                    );
                return Json(jdata);
            }
        }
        [HttpPost]
        public JsonResult JTable([FromBody] JTableHeaders jTablePara, int userType = 0)
        {
            try
            {
                int intBeginFor = (jTablePara.CurrentPage - 1) * jTablePara.Length;
                var session = HttpContext.GetSessionUser();

                var fromDate = !string.IsNullOrEmpty(jTablePara.StartTime) ? DateTime.ParseExact(jTablePara.StartTime, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;
                var toDate = !string.IsNullOrEmpty(jTablePara.EndTime) ? DateTime.ParseExact(jTablePara.EndTime, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null;

                var query = from a in _context.BOMProductionWarehouseDts.Where(x => !x.IsDeleted)
                            where (userType == 10
                                    || (userType == 2 && session.ListUserOfBranch.Any(x => x == a.CreatedBy))
                                    || (userType == 0 && session.UserName == a.CreatedBy)
                                )
                            select a;

                var count = query.Count();
                var data = query.OrderUsingSortExpression(jTablePara.QueryOrderBy).Skip(intBeginFor).Take(jTablePara.Length).AsNoTracking().ToList();

                var jdata = JTableHelper.JObjectTable(data, jTablePara.Draw, count,
                    "Id", "ItemCode", "Quantity", "Unit", "Specification", "IO", "TicketCode", "CreatedBy", "CreatedTime", "UpdatedBy", "UpdatedTime", "DeletedBy", "DeletedTime", "IsDeleted"
                    );
                return Json(jdata);
            }
            catch (Exception ex)
            {
                var jdata = JTableHelper.JObjectTable(new List<BOMProductionWarehouseHd>(), jTablePara.Draw, 0,
                    "Id", "ItemCode", "Quantity", "Unit", "Specification", "IO", "TicketCode", "CreatedBy", "CreatedTime", "UpdatedBy", "UpdatedTime", "DeletedBy", "DeletedTime", "IsDeleted"
                    );
                return Json(jdata);
            }
        }

        // CREATE operation for BOM_PRODUCTION_WAREHOUSE_DT
        [AllowAnonymous]
        [HttpPost]
        public async Task<JMessage> InsertHeader([FromBody] BOMProductionWarehouseHd obj)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                _context.BOMProductionWarehouseHds.Add(obj);
                _context.SaveChanges();
                msg.Title = _sharedResources["COM_ADD_SUCCESS"];
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Object = ex;
            }
            return msg;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<JMessage> InsertDetail([FromBody] BOMProductionWarehouseDt obj) {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                _context.BOMProductionWarehouseDts.Add(obj);
                _context.SaveChanges();
                msg.Title = _sharedResources["COM_ADD_SUCCESS"];
            }
            catch(Exception ex)
            {
                msg.Error = true;
                msg.Title = _sharedResources["COM_MSG_ERR"];
                msg.Object = ex;
            }
            return msg;
        }

        [AllowAnonymous]
        [HttpPost]
        public BOMProductionWarehouseDt GetWarehouseDtById(int id)
        {
            return _context.BOMProductionWarehouseDts.FirstOrDefault(w => w.Id == id);
        }

        [AllowAnonymous]
        [HttpPost]
        public BOMProductionWarehouseHd GetWarehouseHdById(int id)
        {
            return _context.BOMProductionWarehouseHds.FirstOrDefault(w => w.Id == id);
        }

        [AllowAnonymous]
        [HttpPost]
        // UPDATE operation for BOM_PRODUCTION_WAREHOUSE_DT
        public void UpdateWarehouseDt(BOMProductionWarehouseDt warehouseDt)
        {
            var existingWarehouseDt = _context.BOMProductionWarehouseDts.Find(warehouseDt.Id);
            if (existingWarehouseDt != null)
            {
                _context.Entry(existingWarehouseDt).CurrentValues.SetValues(warehouseDt);
                _context.SaveChanges();
            }
        }
        
        [AllowAnonymous]
        [HttpPost]
        public JsonResult Update([FromBody] BOMWareHouseImpModelInsert obj)
        {
            var msg = new JMessage() { Error = false, Title = "" };
            try
            {
                var poOldTime = DateTime.Now;
                var objUpdate = _context.BOMProductionWarehouseHds.FirstOrDefault(x => x.TicketCode.Equals(obj.TicketCode));
                if (objUpdate != null)
                {
                    var lstStatus = new List<JsonStatus>();

                    //Check xem sản phẩm đã được đưa vào phiếu xuất kho chưa
                    var chkUsing = (from a in _context.BOMProductionWarehouseDts.Where(x => !x.IsDeleted && x.TicketCode == obj.TicketCode)
                                    select a.Id).Any();

                    //Check xem sản phẩm đã được xếp kho thì không cho sửa kho nhập
                    var chkOrdering = (from a in _context.BOMProductionWarehouseDts.Where(x => !x.IsDeleted && x.TicketCode == obj.TicketCode)
                                       select a.Id).Any();
                    if (chkUsing)
                    {
                        msg.Error = true;
                        msg.Title = "MIS_MSG_ERRO_ADD_IMPORT_WARE_HOURE_EXPORT";
                    }
                    else
                    {
                        //var oldTimeTicketCreate = objUpdate.TimeTicketCreate;

                        //Update bảng header
                        objUpdate.TicketCode = obj.TicketCode;
                        objUpdate.DeliverId = obj.DeliverId;
                        objUpdate.ReceiverId = obj.ReceiverId;
                        objUpdate.TypeImpExp = obj.TypeImpExp;
                        objUpdate.UpdatedBy = ESEIM.AppContext.UserName;
                        objUpdate.UpdatedTime = DateTime.Now;
                        var session = HttpContext.GetSessionUser();
                        if (!string.IsNullOrEmpty(objUpdate.Status))
                        {
                            lstStatus = JsonConvert.DeserializeObject<List<JsonStatus>>(objUpdate.Status);
                        }
                        //objUpdate.JsonData = CommonUtil.JsonData(objUpdate, obj, objUpdate.JsonData, session.FullName);
                        _context.BOMProductionWarehouseHds.Update(objUpdate);
                        _context.SaveChanges();
                        msg.Title = string.Format(_sharedResources["COM_MSG_UPDATE_SUCCESS"], "");
                    }
                }
                else
                {
                    msg.Error = true;
                    msg.Title = "MIS_MSG_CODE_EXITS";
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "MIS_MSG_ERRO_EDIT_IMPORT_WARE_HOURE";
            }
            return Json(msg);
        }
        
        [AllowAnonymous]
        [HttpPost]
        public JsonResult UpdateDetail([FromBody] BOMWareHouseDetailImpModelInsert obj)
        {
            var msg = new JMessage() { Error = false, Title = "" };
            try
            {
                var detail = _context.BOMProductionWarehouseDts.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(obj.TicketCode)
               && x.ItemCode.Equals(obj.ItemCode));

                if (detail != null)
                {
                    detail.Unit = obj.Unit;
                    detail.Quantity = obj.Quantity;
                    detail.Specification = obj.Specification;
                    _context.BOMProductionWarehouseDts.Update(detail);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_UPDATE_SUCCESS"];
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _sharedResources["COM_MSG_ERR"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "MIS_MSG_ERRO_EDIT_IMPORT_WARE_HOURE";
            }
            return Json(msg);
        }

        [AllowAnonymous]
        [HttpDelete]
        // DELETE operation for BOM_PRODUCTION_WAREHOUSE_DT
        public JsonResult DeleteWarehouseDt(int id)
        {
            var msg = new JMessage() { Error = false, Title = "" };
            try
            {
                var detail = _context.BOMProductionWarehouseDts.FirstOrDefault(x => x.Id == id);

                if (detail != null)
                {
                    detail.IsDeleted = true;
                    detail.DeletedTime = DateTime.Now;
                    _context.BOMProductionWarehouseDts.Update(detail);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_UPDATE_SUCCESS"];
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _sharedResources["COM_MSG_ERR"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "MIS_MSG_ERRO_EDIT_IMPORT_WARE_HOURE";
            }
            return Json(msg);
        }

        [AllowAnonymous]
        [HttpDelete]
        // DELETE operation for BOM_PRODUCTION_WAREHOUSE_HD
        public JsonResult DeleteWarehouseHd(int id)
        {
            var msg = new JMessage() { Error = false, Title = "" };
            try
            {
                var detail = _context.BOMProductionWarehouseHds.FirstOrDefault(x => x.Id == id);

                if (detail != null)
                {
                    detail.IsDeleted = true;
                    detail.DeletedTime = DateTime.Now;
                    _context.BOMProductionWarehouseHds.Update(detail);
                    _context.SaveChanges();
                    msg.Title = _sharedResources["COM_UPDATE_SUCCESS"];
                }
                else
                {
                    msg.Error = true;
                    msg.Title = _sharedResources["COM_MSG_ERR"];
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = "MIS_MSG_ERRO_EDIT_IMPORT_WARE_HOURE";
            }
            return Json(msg);
        }

        #endregion

    }

    public class BOMWareHouseDetailImpModelInsert
    {
        public string ItemCode { get;  set; }
        public string Unit { get;  set; }
        public decimal Quantity { get;  set; }
        public string Specification { get;  set; }
        public string TicketCode { get;  set; }
    }

    public class BOMWareHouseImpModelInsert
    {
        public string TicketCode { get; set; }
        public string DeliverId { get;  set; }
        public string ReceiverId { get;  set; }
        public string TypeImpExp { get;  set; }
    }

    public class JTableHeaders: JTableModel
    {
    }
}
