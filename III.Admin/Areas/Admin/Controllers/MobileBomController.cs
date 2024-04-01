using ESEIM.Models;
using ESEIM.Utils;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System;
using III.Domain.Common;
using System.Collections.Generic;
using OpenXmlPowerTools;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace III.Admin.Areas.Admin.Controllers
{
    public class MobileBomController : Controller
    {
        private readonly EIMDBContext _context;

        public MobileBomController(EIMDBContext context)
        {
            _context = context;
        }

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
    }
}
