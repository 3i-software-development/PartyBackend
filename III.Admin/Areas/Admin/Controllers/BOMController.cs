﻿using ESEIM.Models;
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
        #region BOM_hs

        [HttpPost]
        public async Task<IActionResult> PostBomRt([FromBody] BomDataModel data)
        {
            var msg = new JMessage() { Error = false };
            {
                try
                {
                    var listBomRt = data.ListBom.Select(x => new BomRt
                    {
                        ItemCode = x.ItemCode,
                        ItemName = x.ItemName,
                        Quantity = x.Quantity,
                        Unit = x.Unit,
                        Specification = x.Specification,
                        Io = x.Io,
                        ActivityCode = x.ActivityCode,
                        ShiftCode = x.ShiftCode,
                        WordOrderCode = x.WordOrderCode,
                        ObjectCode = x.ObjectCode,
                        ObjectType = x.ObjectType,
                        ParentId = x.ParentId,
                        IsDeleted = false,
                        CreatedBy = data.UserName,
                        CreatedTime = DateTime.Now,
                    });
                    var listOnChannel = new List<BomRt>();
                    foreach (var item in listBomRt)
                    {
                        var bomItem = _context.BomItemOnChannels
                            .FirstOrDefault(x => !x.IsDeleted && x.ItemCode == item.ItemCode);
                        if (bomItem != null)
                        {
                            msg.Title = "Đã nhập liệu ở bước này, vui lòng cập nhật";
                            msg.Error = true;
                            return Json(msg);
                        }
                        _context.BomRts.Add(item);
                        await _context.SaveChangesAsync();
                        Console.WriteLine(item.Id);
                        listOnChannel.Add(item);
                        //_context.BomRts.AddRange(listBomRt);
                    }
                    foreach (var item in listOnChannel)
                    {
                        _context.BomItemOnChannels.Add(new BomItemOnChannel
                        {
                            BomRtId = item.Id.ToString(),
                            ItemCode = item.ItemCode,
                            Quantity = item.Quantity,
                            Unit = item.Unit,
                            Specification = item.Specification,
                            ActivityCode = item.ActivityCode,
                            ShiftCode = item.ShiftCode,
                            Io = item.Io,
                            IsDeleted = false,
                            CreatedBy = data.UserName,
                            CreatedTime = DateTime.Now,
                        });
                    }
                    await _context.SaveChangesAsync();
                    msg.Title = "Thêm thành công";
                    return Json(msg);

                }
                catch (Exception ex)
                {
                    msg.Error = true;
                    msg.Title = "Có lỗi xảy ra khi xóa";
                    return Json(msg);
                }

            }

        }

        [HttpGet]
        public async Task<IActionResult> GetBomItem(string io, string activityCode)
        {
            var listBomItem = await (from a in _context.BomItemOnChannels
                .Where(x => !x.IsDeleted && x.ActivityCode == activityCode && x.Io == io)
                                     join b in _context.AttrSetups.Where(x => !x.IsDeleted) on a.ItemCode equals b.AttrCode
                                     join c in _context.BomRts on a.BomRtId equals c.Id.ToString()
                                     orderby a.ShiftCode
                                     select new
                                     {
                                         c.Id,
                                         a.ItemCode,
                                         ItemName = b.AttrName,
                                         a.ShiftCode,
                                         a.Quantity,
                                         a.Unit
                                     }).ToListAsync();
            return Ok(listBomItem);
        }

        [HttpPut]
        public async Task<IActionResult> PutBomRt([FromBody] BomDataModel data)
        {
            var msg = new JMessage() { Error = false };
            {
                try
                {
                    foreach (var item in data.ListBom)
                    {
                        var bomRt = _context.BomRts
                            .FirstOrDefault(x => !x.IsDeleted && x.Id == item.Id);
                        bomRt.Quantity = item.Quantity;
                        bomRt.UpdatedBy = data.UserName;
                        bomRt.UpdatedTime = DateTime.Now;
                        _context.BomRts.Update(bomRt);
                        var bomItem = _context.BomItemOnChannels
                            .FirstOrDefault(x => !x.IsDeleted && x.ItemCode == item.ItemCode);
                        bomItem.Quantity = item.Quantity;
                        bomItem.UpdatedBy = data.UserName;
                        bomItem.UpdatedTime = DateTime.Now;
                        _context.BomItemOnChannels.Update(bomItem);
                    }
                    await _context.SaveChangesAsync();
                    msg.Title = "Cập nhật thành công";
                    return Json(msg);

                }
                catch (Exception ex)
                {
                    msg.Error = true;
                    msg.Title = "Có lỗi xảy ra khi xóa";
                    return Json(msg);
                }

            }
        }

        [HttpPut]
        public async Task<IActionResult> PutBomInChannel([FromBody] BomDataModel data)
        {
            var msg = new JMessage() { Error = false };
            {
                try
                {
                    foreach (var item in data.ListBom)
                    {
                        var bomItem = _context.BomItemOnChannels
                            .FirstOrDefault(x => !x.IsDeleted && x.ItemCode == item.ItemCode);
                        bomItem.Quantity = item.QuantityRemain ?? 0;
                        bomItem.UpdatedBy = data.UserName;
                        bomItem.UpdatedTime = DateTime.Now;
                        _context.BomItemOnChannels.Update(bomItem);
                    }
                    await _context.SaveChangesAsync();
                    msg.Title = "Cập nhật thành công";
                    return Json(msg);

                }
                catch (Exception ex)
                {
                    msg.Error = true;
                    msg.Title = "Có lỗi xảy ra khi xóa";
                    return Json(msg);
                }

            }
        }

        [HttpPut]
        public async Task<IActionResult> PutBomHistory(string activityCode, string userName)
        {
            var msg = new JMessage() { Error = false };
            {
                try
                {
                    var bomInChannel = _context.BomItemOnChannels.Where(x => !x.IsDeleted && x.ActivityCode == activityCode);
                    foreach (var item in bomInChannel)
                    {
                        item.IsDeleted = true;
                        item.DeletedBy = userName;
                        item.DeletedTime = DateTime.Now;
                        _context.BomItemOnChannels.Update(item);
                        var bomRt = _context.BomRts.FirstOrDefault(x => !x.IsDeleted && x.Id.ToString() == item.BomRtId);
                        var bomHistory = new BomHs
                        {
                            ItemCode = bomRt.ItemCode,
                            ItemName = bomRt.ItemName,
                            Quantity = bomRt.Quantity,
                            Unit = bomRt.Unit,
                            Specification = bomRt.Specification,
                            Io = bomRt.Io,
                            ActivityCode = bomRt.ActivityCode,
                            ShiftCode = bomRt.ShiftCode,
                            WordOrderCode = bomRt.WordOrderCode,
                            ObjectCode = bomRt.ObjectCode,
                            ObjectType = bomRt.ObjectType,
                            ParentId = bomRt.ParentId,
                            IsDeleted = false,
                            CreatedBy = userName,
                            CreatedTime = DateTime.Now,
                        };
                        _context.BomHs.Add(bomHistory);
                    }
                    await _context.SaveChangesAsync();
                    msg.Title = "Cập nhật thành công";
                    return Json(msg);

                }
                catch (Exception ex)
                {
                    msg.Error = true;
                    msg.Title = "Có lỗi xảy ra khi xóa";
                    return Json(msg);
                }

            }
        }

        public class BomRtModel
        {
            public int? Id { get; set; }
            public string ItemCode { get; set; }
            public string ItemName { get; set; }
            public decimal Quantity { get; set; }
            public decimal? QuantityRemain { get; set; }
            public string Unit { get; set; }
            public string Specification { get; set; }
            public string Io { get; set; }
            public string ActivityCode { get; set; }
            public string ShiftCode { get; set; }
            public string WordOrderCode { get; set; }
            public string ObjectType { get; set; }
            public string ObjectCode { get; set; }
            public string ParentId { get; set; }
        }

        public class BomDataModel
        {
            public List<BomRtModel> ListBom { get; set; }
            public string UserName { get; set; }
        }
        #endregion

        #region BOM_PRODUCTION_WAREHOUSE

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
        [HttpGet]
        public object GetWarehouseListHdByCode()
        {
            return _context.BOMProductionWarehouseHds.Where(w => !w.IsDeleted);
        }
        [AllowAnonymous]
        [HttpGet]
        public object GetWarehouseListDtByCode(string code)
        {
            return _context.BOMProductionWarehouseDts.Where(w =>!w.IsDeleted && w.TicketCode == code);
        }

        [AllowAnonymous]
        [HttpGet]
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
