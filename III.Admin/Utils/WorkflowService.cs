using ESEIM.Models;
using III.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ESEIM.Utils
{
    public interface IWorkflowService
    {
        void UpdateStatusWF(string objType, string objCode, string status, string actRepeat, SessionUserLogin session);

        Task AddLogStatusAllAsync(string objType, string objInst, string status, string actName, string actType, string userName);

        void AddLogStatusAll(string objType, string objInst, string status, string actName, string actType, string userName, string content = "");
    }

    public class WorkflowService : IWorkflowService
    {
        private EIMDBContext _context;

        public WorkflowService(EIMDBContext context)
        {
            _context = context;
        }

        #region Update status workflow in ticket, decisition, ..
        public void UpdateStatusWF(string objType, string objCode, string status, string actRepeat, SessionUserLogin session)
        {
            var wfInstance = _context.WorkflowInstances.FirstOrDefault(x => !x.IsDeleted.Value && x.ObjectInst.Equals(objCode)
                        && x.ObjectType.Equals(objType));
            if (wfInstance != null)
            {
                var acts = _context.ActivityInstances.Where(x => !x.IsDeleted && x.WorkflowCode.Equals(wfInstance.WfInstCode));
                if (!string.IsNullOrEmpty(wfInstance.MarkActCurrent))
                {
                    var currentAct = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(wfInstance.MarkActCurrent));
                    if (currentAct != null)
                    {
                        var assigns = _context.ExcuterControlRoleInsts.Where(x => !x.IsDeleted && x.ActivityCodeInst.Equals(currentAct.ActivityInstCode));
                        var running = _context.WorkflowInstanceRunnings.FirstOrDefault(x => !x.IsDeleted && x.ActivityInitial.Equals(currentAct.ActivityInstCode));
                        if (running != null)
                        {
                            var nextAct = acts.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(running.ActivityDestination));
                            if (assigns.Any(x => x.UserId.Equals(session.UserId)) || session.IsAllData || session.UserName.Equals(currentAct.CreatedBy))
                            {
                                if (status.Equals("INITIAL_DONE") || status.Equals("REPEAT_DONE") || status.Equals("FINAL_DONE"))
                                {
                                    if (status != "FINAL_DONE")
                                    {
                                        currentAct.Status = "STATUS_ACTIVITY_APPROVED";
                                        currentAct.UpdatedBy = ESEIM.AppContext.UserName;
                                        currentAct.UpdatedTime = DateTime.Now;
                                        wfInstance.MarkActCurrent = nextAct != null ? nextAct.ActivityInstCode : "";
                                        var runnings = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityInitial == currentAct.ActivityInstCode);
                                        var lstActInst = new List<ActivityInstance>();
                                        if (runnings.Any())
                                        {
                                            foreach (var item in runnings)
                                            {
                                                var lstCommand = new List<JsonCommand>();
                                                if (!string.IsNullOrEmpty(item.Command))
                                                {
                                                    lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(item.Command);
                                                }
                                                lstCommand[lstCommand.Count - 1].Approved = "APPROVE_COMMAND_Y";
                                                lstCommand[lstCommand.Count - 1].ApprovedBy = ESEIM.AppContext.UserName;
                                                lstCommand[lstCommand.Count - 1].ApprovedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy");

                                                item.Command = JsonConvert.SerializeObject(lstCommand);
                                                _context.WorkflowInstanceRunnings.Update(item);

                                                var actDes = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == item.ActivityDestination);
                                                if (actDes != null)
                                                {
                                                    //actDes.IsLock = false;
                                                    actDes.Status = EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.DoActInst);
                                                    actDes.StartTime = DateTime.Now;
                                                    _context.ActivityInstances.Update(actDes);
                                                    lstActInst.Add(actDes);
                                                }
                                            }
                                            var confirms = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityDestination == currentAct.ActivityInstCode);
                                            if (confirms.Any())
                                            {
                                                foreach (var item in confirms)
                                                {
                                                    var lstCommand = new List<JsonCommand>();

                                                    lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(item.Command);
                                                    lstCommand[lstCommand.Count - 1].Confirmed = "CONFIRM_COMMAND_Y";
                                                    lstCommand[lstCommand.Count - 1].ConfirmedBy = ESEIM.AppContext.UserName;
                                                    lstCommand[lstCommand.Count - 1].ConfirmedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy");

                                                    item.Command = JsonConvert.SerializeObject(lstCommand);
                                                    _context.WorkflowInstanceRunnings.Update(item);
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        if (currentAct.Type.Equals("TYPE_ACTIVITY_END"))
                                        {
                                            currentAct.Status = "STATUS_ACTIVITY_APPROVE_END";
                                            currentAct.UpdatedBy = ESEIM.AppContext.UserName;
                                            currentAct.UpdatedTime = DateTime.Now;

                                            wfInstance.EndTime = DateTime.Now;
                                            wfInstance.Status = "Hoàn thành";
                                        }
                                    }
                                    _context.ActivityInstances.Update(currentAct);
                                    _context.WorkflowInstances.Update(wfInstance);
                                }
                                else if (status.Equals("INITIAL_WORKING") || status.Equals("REPEAT_WORKING") || status.Equals("FINAL_WORKING"))
                                {
                                    currentAct.Status = "STATUS_ACTIVITY_DO";
                                }
                                else if (status.Equals("END_REQUIRE_REWORK") || status.Equals("REPEAT_REQUIRE_REWORK") || status.Equals("FINAL_REQUIRE_REWORK"))
                                {
                                    if (!string.IsNullOrEmpty(actRepeat))
                                    {
                                        var repeat = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(actRepeat));
                                        if (repeat != null)
                                        {
                                            repeat.Status = "STATUS_ACTIVITY_DO";

                                            //currentAct.IsLock = true;
                                            currentAct.StartTime = DateTime.Now;
                                            currentAct.Status = "STATUS_ACTIVITY_DO";

                                            wfInstance.MarkActCurrent = repeat.ActivityInstCode;
                                            _context.ActivityInstances.Update(repeat);
                                            _context.ActivityInstances.Update(currentAct);
                                            _context.WorkflowInstances.Update(wfInstance);
                                        }
                                    }
                                }
                                else if (status.Equals("END_DONE") || status.Equals("END_WORKING"))
                                {
                                    if (status.Equals("END_DONE"))
                                    {
                                        if (currentAct.Type.Equals("TYPE_ACTIVITY_REPEAT"))
                                        {
                                            currentAct.Status = "STATUS_ACTIVITY_APPROVED";
                                            currentAct.UpdatedBy = session.UserName;
                                            currentAct.UpdatedTime = DateTime.Now;
                                            wfInstance.MarkActCurrent = nextAct != null ? nextAct.ActivityInstCode : "";
                                            var runnings = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityInitial == currentAct.ActivityInstCode);
                                            var lstActInst = new List<ActivityInstance>();
                                            if (runnings.Any())
                                            {
                                                var files = _context.ActivityInstFiles.Where(x => !x.IsDeleted && x.ActivityInstCode == currentAct.ActivityInstCode);
                                                foreach (var item in runnings)
                                                {
                                                    var lstCommand = new List<JsonCommand>();
                                                    if (!string.IsNullOrEmpty(item.Command))
                                                    {
                                                        lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(item.Command);
                                                    }
                                                    lstCommand[lstCommand.Count - 1].Approved = "APPROVE_COMMAND_Y";
                                                    lstCommand[lstCommand.Count - 1].ApprovedBy = ESEIM.AppContext.UserName;
                                                    lstCommand[lstCommand.Count - 1].ApprovedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy");

                                                    item.Command = JsonConvert.SerializeObject(lstCommand);
                                                    _context.WorkflowInstanceRunnings.Update(item);

                                                    var actDes = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == item.ActivityDestination);
                                                    if (actDes != null)
                                                    {
                                                        //actDes.IsLock = false;
                                                        actDes.Status = EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.DoActInst);
                                                        actDes.StartTime = DateTime.Now;
                                                        _context.ActivityInstances.Update(actDes);
                                                        lstActInst.Add(actDes);
                                                    }
                                                }
                                                var confirms = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityDestination == currentAct.ActivityInstCode);
                                                if (confirms.Any())
                                                {
                                                    foreach (var item in confirms)
                                                    {
                                                        var lstCommand = new List<JsonCommand>();

                                                        lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(item.Command);
                                                        lstCommand[lstCommand.Count - 1].Confirmed = "CONFIRM_COMMAND_Y";
                                                        lstCommand[lstCommand.Count - 1].ConfirmedBy = ESEIM.AppContext.UserName;
                                                        lstCommand[lstCommand.Count - 1].ConfirmedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy");

                                                        item.Command = JsonConvert.SerializeObject(lstCommand);
                                                        _context.WorkflowInstanceRunnings.Update(item);
                                                    }
                                                }
                                            }
                                            else
                                            {

                                            }
                                        }

                                    }
                                    else if (status.Equals("END_WORKING"))
                                    {
                                        currentAct.Status = "STATUS_ACTIVITY_DO";
                                    }
                                    _context.ActivityInstances.Update(currentAct);
                                }
                                else if (status.Equals("FINAL_REWORK") || status.Equals("REPEAT_REWORK"))
                                {
                                    currentAct.StartTime = DateTime.Now;
                                    currentAct.Status = "STATUS_ACTIVITY_DO";
                                    _context.ActivityInstances.Update(currentAct);
                                }
                                _context.SaveChanges();
                            }
                        }
                        else
                        {
                            if (status.Equals("INITIAL_DONE") || status.Equals("REPEAT_DONE") || status.Equals("FINAL_DONE"))
                            {
                                if (status != "FINAL_DONE")
                                {
                                    currentAct.Status = "STATUS_ACTIVITY_APPROVED";
                                    currentAct.UpdatedBy = ESEIM.AppContext.UserName;
                                    currentAct.UpdatedTime = DateTime.Now;
                                    var runnings = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityInitial == currentAct.ActivityInstCode);
                                    var lstActInst = new List<ActivityInstance>();
                                    if (runnings.Any())
                                    {
                                        foreach (var item in runnings)
                                        {
                                            var lstCommand = new List<JsonCommand>();
                                            if (!string.IsNullOrEmpty(item.Command))
                                            {
                                                lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(item.Command);
                                            }
                                            lstCommand[lstCommand.Count - 1].Approved = "APPROVE_COMMAND_Y";
                                            lstCommand[lstCommand.Count - 1].ApprovedBy = ESEIM.AppContext.UserName;
                                            lstCommand[lstCommand.Count - 1].ApprovedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy");

                                            item.Command = JsonConvert.SerializeObject(lstCommand);
                                            _context.WorkflowInstanceRunnings.Update(item);

                                            var actDes = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode == item.ActivityDestination);
                                            if (actDes != null)
                                            {
                                                //actDes.IsLock = false;
                                                actDes.Status = EnumHelper<PublishEnum>.GetDisplayValue(PublishEnum.DoActInst);
                                                actDes.StartTime = DateTime.Now;
                                                _context.ActivityInstances.Update(actDes);
                                                lstActInst.Add(actDes);
                                            }
                                        }
                                        var confirms = _context.WorkflowInstanceRunnings.Where(x => !x.IsDeleted && x.ActivityDestination == currentAct.ActivityInstCode);
                                        if (confirms.Any())
                                        {
                                            foreach (var item in confirms)
                                            {
                                                var lstCommand = new List<JsonCommand>();

                                                lstCommand = JsonConvert.DeserializeObject<List<JsonCommand>>(item.Command);
                                                lstCommand[lstCommand.Count - 1].Confirmed = "CONFIRM_COMMAND_Y";
                                                lstCommand[lstCommand.Count - 1].ConfirmedBy = ESEIM.AppContext.UserName;
                                                lstCommand[lstCommand.Count - 1].ConfirmedTime = DateTime.Now.ToString("HH:mm dd/MM/yyyy");

                                                item.Command = JsonConvert.SerializeObject(lstCommand);
                                                _context.WorkflowInstanceRunnings.Update(item);
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    if (currentAct.Type.Equals("TYPE_ACTIVITY_END"))
                                    {
                                        currentAct.Status = "STATUS_ACTIVITY_APPROVE_END";
                                        currentAct.UpdatedBy = ESEIM.AppContext.UserName;
                                        currentAct.EndTime = DateTime.Now;
                                        currentAct.UpdatedTime = DateTime.Now;

                                        //wfInstance.MarkActCurrent = "";
                                        wfInstance.EndTime = DateTime.Now;
                                        wfInstance.Status = "Hoàn thành";
                                    }
                                }
                                _context.ActivityInstances.Update(currentAct);
                                _context.WorkflowInstances.Update(wfInstance);
                            }
                            else if (status.Equals("INITIAL_WORKING") || status.Equals("REPEAT_WORKING") || status.Equals("FINAL_WORKING"))
                            {
                                currentAct.Status = "STATUS_ACTIVITY_DO";
                            }
                            else if (status.Equals("REPEAT_REQUIRE_REWORK") || status.Equals("FINAL_REQUIRE_REWORK"))
                            {
                                if (!string.IsNullOrEmpty(actRepeat))
                                {
                                    var repeat = _context.ActivityInstances.FirstOrDefault(x => !x.IsDeleted && x.ActivityInstCode.Equals(actRepeat));
                                    if (repeat != null)
                                    {
                                        repeat.Status = "STATUS_ACTIVITY_DO";

                                        //currentAct.IsLock = true;
                                        currentAct.StartTime = DateTime.Now;
                                        currentAct.Status = "STATUS_ACTIVITY_DO";

                                        wfInstance.MarkActCurrent = repeat.ActivityInstCode;
                                        _context.ActivityInstances.Update(repeat);
                                        _context.ActivityInstances.Update(currentAct);
                                        _context.WorkflowInstances.Update(wfInstance);
                                    }
                                }
                            }
                            else if (status.Equals("FINAL_REWORK") || status.Equals("REPEAT_REWORK"))
                            {
                                currentAct.StartTime = DateTime.Now;
                                currentAct.Status = "STATUS_ACTIVITY_DO";
                                _context.ActivityInstances.Update(currentAct);
                            }
                            _context.SaveChanges();
                        }
                    }
                }
            }
        }
        public async Task AddLogStatusAllAsync(string objType, string objInst, string status, string actName, string actType, string userName)
        {
            AddLogStatusPrivate(objType, objInst, status, actName, actType, userName);

            await _context.SaveChangesAsync();
        }

        public void AddLogStatusAll(string objType, string objInst, string status, string actName, string actType, string userName, string content)
        {
            AddLogStatusPrivate(objType, objInst, status, actName, actType, userName, content);
            // Save all change
            _context.SaveChanges();
        }
        private void AddLogStatusPrivate(string objType, string objInst, string status, string actName, string actType, string userName, string content = "")
        {
            /* 
            1.CONTRACT.Hợp đồng bán (v)
            2.CONTRACT_PO.Hợp đồng mua (v)
            3.PROJECT.Dự án/ đấu thầu  (v)

            3.REQUEST_IMPORT_PRODUCT.Y/C đặt hàng
            5.ASSET_INVENTORY.Kiểm kê tài sản
            6.ASSET_ALLOCATE.Cấp phát tài sản
            7.ASSET_BUY.Mua sắm tài sản
            8.ASSET_TRANSFER.Điều chuyển tài sản
            9.ASSET_LIQUIDATION.Thanh lý tài sản
            10.ASSET_RECALL.Thu hồi tài sản
            11.ASSET_RQ_REPAIR.Yêu cầu sửa chữa bảo dưỡng tài sản
            12.ASSET_MAINTENACE.Sửa chữa tài sản
            13.ASSET_IMPROVE.Bảo dưỡng tài sản
            14.ASSET_CANCEL.Hủy tài sản
            15.ASSET_RPT.Báo hỏng/mất tài sản

            16.FUND_ACC_ENTRY.Phiếu thu/chi
            17.IMPORT_STORE.Phiếu nhập
            18.EXPORT_STORE.Phiếu xuất

            19.NOT_WORK.Phiếu báo nghỉ
            GOLATE -- Đi muộn
            PLAN_SCHEDULE -- Lịch công tác
            OVERTIME -- Làm việc ngoài giờ
            QUITWORK -- Nghỉ việc
            20. Quyết định lương
            21. Quyết định điều động
            22. Quyết định chấm dứt
            23. Quyết định khen thưởng
            24. Quyết định kỷ luật
            25. PROJECT_PRODUCT Hàng hóa & vật tư (Dự án)
             */

            var common = _context.CommonSettings.FirstOrDefault(x => !x.IsDeleted && x.CodeSet.Equals(status));

            var log = new JsonLog
            {
                Code = status,
                CreatedBy = userName,
                CreatedTime = DateTime.Now,
                Name = common != null ? common.ValueSet : "",
                ObjectType = actType,
                ObjectRelative = actName,
                Content = content
            };

            switch (objType)
            {
                case "RQ_IMPORT_PROD":
                    var rqImpProd =
                        _context.RequestImpProductHeaders.FirstOrDefault(x =>
                            !x.IsDeleted && x.ReqCode.Equals(objInst));
                    if (rqImpProd != null)
                    {
                        var listJson = new List<JsonLog>();

                        var listStatus = string.IsNullOrEmpty(rqImpProd.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(rqImpProd.Status);
                        listStatus.Add(log);

                        rqImpProd.Status = JsonConvert.SerializeObject(listStatus);

                        _context.RequestImpProductHeaders.Update(rqImpProd);
                    }

                    break;

                case "PROJECT":
                    var project =
                        _context.Projects.FirstOrDefault(x => !x.FlagDeleted && x.ProjectCode.Equals(objInst));
                    if (project != null)
                    {
                        var listJson = new List<JsonLog>();

                        var listStatus = string.IsNullOrEmpty(project.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(project.Status);
                        listStatus.Add(log);

                        project.Status = JsonConvert.SerializeObject(listStatus);

                        _context.Projects.Update(project);
                    }

                    break;

                case "CONTRACT":
                    var saleHeader =
                        _context.PoSaleHeaders.FirstOrDefault(x => !x.IsDeleted && x.ContractCode.Equals(objInst));
                    if (saleHeader != null)
                    {
                        var listJson = new List<JsonLog>();

                        var listStatus = string.IsNullOrEmpty(saleHeader.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(saleHeader.Status);
                        listStatus.Add(log);

                        saleHeader.Status = JsonConvert.SerializeObject(listStatus);

                        _context.PoSaleHeaders.Update(saleHeader);
                    }

                    break;

                case "CONTRACT_PO":
                    var buyerHeader =
                        _context.PoBuyerHeaders.FirstOrDefault(x =>
                            !x.IsDeleted && x.PoSupCode.ToString().Equals(objInst));
                    if (buyerHeader != null)
                    {
                        var listJson = new List<JsonLog>();

                        var listStatus = string.IsNullOrEmpty(buyerHeader.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(buyerHeader.Status);
                        listStatus.Add(log);

                        buyerHeader.Status = JsonConvert.SerializeObject(listStatus);

                        _context.PoBuyerHeaders.Update(buyerHeader);
                    }

                    break;

                case "ASSET_INVENTORY":
                    var assetInvent =
                        _context.AssetInventoryHeaders.FirstOrDefault(x =>
                            !x.IsDeleted && x.TicketCode.Equals(objInst));
                    if (assetInvent != null)
                    {
                        var listJson = new List<JsonLog>();

                        var listStatus = string.IsNullOrEmpty(assetInvent.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(assetInvent.Status);
                        listStatus.Add(log);

                        assetInvent.Status = JsonConvert.SerializeObject(listStatus);

                        _context.AssetInventoryHeaders.Update(assetInvent);
                    }

                    break;

                case "ASSET_ALLOCATE":
                    var assetAllo =
                        _context.AssetAllocateHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
                    if (assetAllo != null)
                    {
                        var listJson = new List<JsonLog>();

                        var listStatus = string.IsNullOrEmpty(assetAllo.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(assetAllo.Status);
                        listStatus.Add(log);

                        assetAllo.Status = JsonConvert.SerializeObject(listStatus);

                        _context.AssetAllocateHeaders.Update(assetAllo);
                    }

                    break;
                case "ASSET_BUY":
                    var assetBuy =
                        _context.AssetBuyHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
                    if (assetBuy != null)
                    {
                        var listJson = new List<JsonLog>();

                        var listStatus = string.IsNullOrEmpty(assetBuy.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(assetBuy.Status);
                        listStatus.Add(log);

                        assetBuy.Status = JsonConvert.SerializeObject(listStatus);

                        _context.AssetBuyHeaders.Update(assetBuy);
                    }

                    break;
                case "ASSET_TRANSFER":
                    var assetTrans =
                        _context.AssetTransferHeaders.FirstOrDefault(x => !x.IsDeleted && x.Ticketcode.Equals(objInst));
                    if (assetTrans != null)
                    {
                        var listJson = new List<JsonLog>();

                        var listStatus = string.IsNullOrEmpty(assetTrans.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(assetTrans.Status);
                        listStatus.Add(log);

                        assetTrans.Status = JsonConvert.SerializeObject(listStatus);

                        _context.AssetTransferHeaders.Update(assetTrans);
                    }

                    break;
                case "ASSET_LIQUIDATION":
                    var assetLiqui =
                        _context.AssetLiquidationHeaders.FirstOrDefault(x =>
                            !x.IsDeleted && x.TicketCode.Equals(objInst));
                    if (assetLiqui != null)
                    {
                        var listJson = new List<JsonLog>();

                        var listStatus = string.IsNullOrEmpty(assetLiqui.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(assetLiqui.Status);
                        listStatus.Add(log);

                        assetLiqui.Status = JsonConvert.SerializeObject(listStatus);

                        _context.AssetLiquidationHeaders.Update(assetLiqui);
                    }

                    break;
                case "ASSET_RECALL":
                    var assetRecall =
                        _context.AssetRecalledHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
                    if (assetRecall != null)
                    {
                        var listJson = new List<JsonLog>();

                        var listStatus = string.IsNullOrEmpty(assetRecall.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(assetRecall.Status);
                        listStatus.Add(log);

                        assetRecall.Status = JsonConvert.SerializeObject(listStatus);

                        _context.AssetRecalledHeaders.Update(assetRecall);
                    }

                    break;
                case "ASSET_RQ_REPAIR":
                    var assetRq =
                        _context.AssetRqMaintenanceRepairHeaders.FirstOrDefault(x =>
                            !x.IsDeleted && x.TicketCode.Equals(objInst));
                    if (assetRq != null)
                    {
                        var listJson = new List<JsonLog>();

                        var listStatus = string.IsNullOrEmpty(assetRq.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(assetRq.Status);
                        listStatus.Add(log);

                        assetRq.Status = JsonConvert.SerializeObject(listStatus);

                        _context.AssetRqMaintenanceRepairHeaders.Update(assetRq);
                    }

                    break;
                case "ASSET_MAINTENANCE":
                    var assetmaint =
                        _context.AssetMaintenanceHeaders.FirstOrDefault(x =>
                            !x.IsDeleted && x.TicketCode.Equals(objInst));
                    if (assetmaint != null)
                    {
                        var listJson = new List<JsonLog>();

                        var listStatus = string.IsNullOrEmpty(assetmaint.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(assetmaint.Status);
                        listStatus.Add(log);

                        assetmaint.Status = JsonConvert.SerializeObject(listStatus);

                        _context.AssetMaintenanceHeaders.Update(assetmaint);
                    }

                    break;
                case "ASSET_IMPROVE":
                    var assetImpro =
                        _context.AssetImprovementHeaders.FirstOrDefault(x =>
                            !x.IsDeleted && x.TicketCode.Equals(objInst));
                    if (assetImpro != null)
                    {
                        var listJson = new List<JsonLog>();

                        var listStatus = string.IsNullOrEmpty(assetImpro.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(assetImpro.Status);
                        listStatus.Add(log);

                        assetImpro.Status = JsonConvert.SerializeObject(listStatus);

                        _context.AssetImprovementHeaders.Update(assetImpro);
                    }

                    break;
                case "ASSET_CANCEL":
                    var assetCancel =
                        _context.AssetCancelHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
                    if (assetCancel != null)
                    {
                        var listJson = new List<JsonLog>();

                        var listStatus = string.IsNullOrEmpty(assetCancel.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(assetCancel.Status);
                        listStatus.Add(log);

                        assetCancel.Status = JsonConvert.SerializeObject(listStatus);

                        _context.AssetCancelHeaders.Update(assetCancel);
                    }

                    break;
                case "ASSET_RPT":
                    var assetRpt =
                        _context.AssetRPTBrokenHeaders.FirstOrDefault(x =>
                            !x.IsDeleted && x.TicketCode.Equals(objInst));
                    if (assetRpt != null)
                    {
                        var listJson = new List<JsonLog>();

                        var listStatus = string.IsNullOrEmpty(assetRpt.AssetStatus)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(assetRpt.AssetStatus);
                        listStatus.Add(log);

                        assetRpt.AssetStatus = JsonConvert.SerializeObject(listStatus);

                        _context.AssetRPTBrokenHeaders.Update(assetRpt);
                    }

                    break;
                case "FUND_ACC_ENTRY":
                    var accEntry =
                        _context.FundAccEntrys.FirstOrDefault(x => !x.IsDeleted && x.AetCode.Equals(objInst));
                    if (accEntry != null)
                    {
                        // var listJson = new List<JsonLog>();
                        // var listStatus = string.IsNullOrEmpty(accEntry.Status)
                        //     ? new List<JsonLog>()
                        //     : JsonConvert.DeserializeObject<List<JsonLog>>(accEntry.Status);
                        // listStatus.Add(log);
                        // accEntry.Status = JsonConvert.SerializeObject(listStatus);
                        accEntry.ListStatusObjectLog.Add(log);
                        _context.FundAccEntrys.Update(accEntry);
                    }

                    break;
                case "IMPORT_STORE":
                    var import =
                        _context.ProdReceivedHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
                    if (import != null)
                    {
                        var listJson = new List<JsonLog>();
                        var listStatus = string.IsNullOrEmpty(import.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(import.Status);
                        listStatus.Add(log);
                        import.Status = JsonConvert.SerializeObject(listStatus);
                        _context.ProdReceivedHeaders.Update(import);
                    }

                    break;
                case "EXPORT_STORE":
                    var export =
                        _context.ProdDeliveryHeaders.FirstOrDefault(x => !x.IsDeleted && x.TicketCode.Equals(objInst));
                    if (export != null)
                    {
                        var listJson = new List<JsonLog>();
                        var listStatus = string.IsNullOrEmpty(export.Status)
                            ? new List<JsonLog>()
                            : JsonConvert.DeserializeObject<List<JsonLog>>(export.Status);
                        listStatus.Add(log);
                        export.Status = JsonConvert.SerializeObject(listStatus);
                        _context.ProdDeliveryHeaders.Update(export);
                    }

                    break;
                case "NOT_WORK":
                    var notWork =
                        _context.WorkShiftCheckInOuts.FirstOrDefault(x =>
                            !x.IsDeleted && x.Id.ToString().Equals(objInst));
                    if (notWork != null)
                    {
                        // var listJson = new List<JsonLog>();
                        // var listStatus = string.IsNullOrEmpty(notWork.Status)
                        //     ? new List<JsonLog>()
                        //     : JsonConvert.DeserializeObject<List<JsonLog>>(notWork.Status);
                        // listStatus.Add(log);
                        // notWork.Status = JsonConvert.SerializeObject(listStatus);
                        notWork.ListStatus.Add(log);
                        _context.WorkShiftCheckInOuts.Update(notWork);
                    }

                    break;
                case "GOLATE":
                    var goLate =
                        _context.WorkShiftCheckInOuts.FirstOrDefault(x =>
                            !x.IsDeleted && x.Id.ToString().Equals(objInst));
                    if (goLate != null)
                    {
                        goLate.ListStatus.Add(log);
                        _context.WorkShiftCheckInOuts.Update(goLate);
                    }

                    break;
                case "PLAN_SCHEDULE":
                    var planSchedule =
                        _context.WorkShiftCheckInOuts.FirstOrDefault(x =>
                            !x.IsDeleted && x.Id.ToString().Equals(objInst));
                    if (planSchedule != null)
                    {
                        planSchedule.ListStatus.Add(log);
                        _context.WorkShiftCheckInOuts.Update(planSchedule);
                    }

                    break;
                case "OVERTIME":
                    var overTime =
                        _context.WorkShiftCheckInOuts.FirstOrDefault(x =>
                            !x.IsDeleted && x.Id.ToString().Equals(objInst));
                    if (overTime != null)
                    {
                        overTime.ListStatus.Add(log);
                        _context.WorkShiftCheckInOuts.Update(overTime);
                    }

                    break;
                case "QUITWORK":
                    var quitWork =
                        _context.WorkShiftCheckInOuts.FirstOrDefault(x =>
                            !x.IsDeleted && x.Id.ToString().Equals(objInst));
                    if (quitWork != null)
                    {
                        quitWork.ListStatus.Add(log);
                        _context.WorkShiftCheckInOuts.Update(quitWork);
                    }

                    break;

                case "PAY_DECISION":
                    var payDecision =
                        _context.PayDecisionHeaders.FirstOrDefault(x => !x.IsDeleted && x.DecisionNum.Equals(objInst));
                    if (payDecision != null)
                    {
                        var listJson = new List<JsonLog>();
                        if (!string.IsNullOrEmpty(payDecision.Status))
                        {
                            listJson = JsonConvert.DeserializeObject<List<JsonLog>>(payDecision.Status);
                        }

                        listJson.Add(log);

                        payDecision.Status = JsonConvert.SerializeObject(listJson);
                        _context.PayDecisionHeaders.Update(payDecision);
                    }

                    break;

                case "DECISION_MOVEMENT":
                    var moveDecision =
                        _context.DecisionMovementHeaders.FirstOrDefault(x =>
                            !x.IsDeleted && x.DecisionNum.Equals(objInst));
                    if (moveDecision != null)
                    {
                        var listJson = new List<JsonLog>();
                        if (!string.IsNullOrEmpty(moveDecision.Status))
                        {
                            listJson = JsonConvert.DeserializeObject<List<JsonLog>>(moveDecision.Status);
                        }

                        listJson.Add(log);

                        moveDecision.Status = JsonConvert.SerializeObject(listJson);
                        _context.DecisionMovementHeaders.Update(moveDecision);
                    }

                    break;

                case "DECISION_END_CONTRACT":
                    var endContract =
                        _context.StopContractHeaders.FirstOrDefault(x => !x.IsDeleted && x.DecisionNum.Equals(objInst));
                    if (endContract != null)
                    {
                        var listJson = new List<JsonLog>();
                        if (!string.IsNullOrEmpty(endContract.Status))
                        {
                            listJson = JsonConvert.DeserializeObject<List<JsonLog>>(endContract.Status);
                        }

                        listJson.Add(log);

                        endContract.Status = JsonConvert.SerializeObject(listJson);
                        _context.StopContractHeaders.Update(endContract);
                    }

                    break;
                case "DISCIPLINE_DECISION":
                    var disciplineDecision = _context.DecisionBonusDisciplineHeaders.FirstOrDefault(x =>
                        !x.IsDeleted && x.DecisionNum.Equals(objInst) &&
                        x.Type.Equals(EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.DisciplineDecision)));
                    if (disciplineDecision != null)
                    {
                        var listJson = new List<JsonLog>();
                        if (!string.IsNullOrEmpty(disciplineDecision.Status))
                        {
                            listJson = JsonConvert.DeserializeObject<List<JsonLog>>(disciplineDecision.Status);
                        }

                        listJson.Add(log);

                        disciplineDecision.Status = JsonConvert.SerializeObject(listJson);
                        _context.DecisionBonusDisciplineHeaders.Update(disciplineDecision);
                    }

                    break;

                case "BONUS_DECISION":
                    var bonusDecision = _context.DecisionBonusDisciplineHeaders.FirstOrDefault(x =>
                        !x.IsDeleted && x.DecisionNum.Equals(objInst) &&
                        x.Type.Equals(EnumHelper<WfObjectType>.GetDisplayValue(WfObjectType.BonusDecision)));
                    if (bonusDecision != null)
                    {
                        var listJson = new List<JsonLog>();
                        if (!string.IsNullOrEmpty(bonusDecision.Status))
                        {
                            listJson = JsonConvert.DeserializeObject<List<JsonLog>>(bonusDecision.Status);
                        }

                        listJson.Add(log);

                        bonusDecision.Status = JsonConvert.SerializeObject(listJson);
                        _context.DecisionBonusDisciplineHeaders.Update(bonusDecision);
                    }

                    break;
                case "PROJECT_PRODUCT":
                    var projectProduct =
                        _context.ProjectProductHeaders.FirstOrDefault(x =>
                            /*!x.IsDeleted &&*/ x.Id.ToString().Equals(objInst));
                    if (projectProduct != null)
                    {
                        projectProduct.ListStatusObjectLog.Add(log);
                        _context.ProjectProductHeaders.Update(projectProduct);
                    }

                    break;
                case "TEST_JOIN_PARTY":
                    var party_profile =
                        _context.PartyAdmissionProfiles.FirstOrDefault(x =>
                            /*!x.IsDeleted &&*/ x.ResumeNumber.ToString().Equals(objInst));
                    if (party_profile != null)
                    {
                        party_profile.JsonStaus.Add(log);
                        _context.PartyAdmissionProfiles.Update(party_profile);
                    }
                    break;
            }
        }
        #endregion

        #region Model
        public class JsonCommand
        {
            public int Id { get; set; }
            public string CommandSymbol { get; set; }
            public string ConfirmedBy { get; set; }
            public string Confirmed { get; set; }
            public string ConfirmedTime { get; set; }
            public string Approved { get; set; }
            public string ApprovedBy { get; set; }
            public string ApprovedTime { get; set; }
            public string Message { get; set; }
            public string ActA { get; set; }
            public string ActB { get; set; }
            public bool IsLeader { get; set; }
        }

        public class ComboxModel
        {
            public string IntsCode { get; set; }
            public string Code { get; set; }
            public string Name { get; set; }
            public string Status { get; set; }
            public string UpdateBy { get; set; }
            public string UpdateTime { get; set; }
        }
        #endregion
    }
    public static class WorkflowStaticService
    {

        public static List<ActGrid> SetLockAndStatus(this List<ActGrid> source, List<CommonSetting> commonActStatus, List<CommonSetting> commonActType,
            List<CommandExtra> commandFromExtra, List<CommandFrom> actFrom, List<ExcuterControlRoleInst> assigns)
        {
            long elapsedLockLoop = 0;
            long elapsedStatusLoop = 0;
            foreach (var item in source)
            {
                var watchLockLoop = System.Diagnostics.Stopwatch.StartNew();
                if (assigns.Any(x => x.ActivityCodeInst.Equals(item.ActivityInstCode)
                    && x.UserId.Equals(ESEIM.AppContext.UserId)))
                {
                    item.IsLock = false;

                    foreach (var cmd in commandFromExtra)
                    {
                        if (string.IsNullOrEmpty(cmd.Confirm))
                        {
                            item.IsLock = true;
                            break;
                        }
                    }
                    if (!item.IsLock)
                    {
                        foreach (var cmd in actFrom)
                        {
                            if (cmd.Confirmed == "")
                            {
                                item.IsLock = true;
                                break;
                            }
                        }
                    }
                }

                watchLockLoop.Stop();
                elapsedLockLoop += watchLockLoop.ElapsedMilliseconds;


                var watchStatusLoop = System.Diagnostics.Stopwatch.StartNew();
                if (!string.IsNullOrEmpty(item.ActStatus))
                    item.ActStatus = commonActStatus.FirstOrDefault(x => x.CodeSet.Equals(item.ActStatus)) != null ? commonActStatus.FirstOrDefault(x => x.CodeSet.Equals(item.ActStatus))?.ValueSet ?? "" : "";
                item.ActType = commonActType.FirstOrDefault(x => x.CodeSet.Equals(item.ActType)) != null ? commonActType.FirstOrDefault(x => x.CodeSet.Equals(item.ActType))?.ValueSet ?? "" : "";
                watchStatusLoop.Stop();
                elapsedStatusLoop += watchStatusLoop.ElapsedMilliseconds;
            }
            return source;
        }
        private static (int LastIndex, List<string> Result) FetchInRange(IEnumerable<string> collection, int characterLimit, int separationLength)
        {

            int i = -separationLength;
            int count = 0;
            var result = new List<string>();

            foreach (var value in collection)
            {
                int length = value.Length + separationLength;
                i += length;
                count++;
                if (i > characterLimit)
                {
                    break;
                }
                result.Add(value);
            }
            return (count, result);

        }
        public static (int LastIndex, string Result) Join(IEnumerable<string> collection, int characterLimit, string separator = ", ")
        {
            var obj = FetchInRange(collection, characterLimit, separator.Length);
            return (obj.LastIndex, string.Join(separator, obj.Result));
            //return string.Join(separator, FetchInRange(collection, characterLimit, separator.Length));
        }
    }

    public class CommandExtra
    {
        public int Id { get; set; }
        public string Confirm { get; set; }
        public string ActFrom { get; set; }
    }

    public class CommandFrom
    {
        public int Id { get; set; }
        public string Confirmed { get; set; }
        public string ActivityDestination { get; set; }
    }
    public class GridWfInst
    {
        public GridWfInst()
        {
            ListActGrids = new List<ActGrid>();
        }
        public int Id { get; set; }
        public string WfName { get; set; }
        public string WfCode { get; set; }
        public string Status { get; set; }
        public string ObjectCode { get; set; }
        public string ObjectType { get; set; }
        public DateTime CreatedTime { get; set; }
        public string ListAct { get; set; }
        public string ActInstCodeSequence { get; set; }
        public List<ActGrid> ListActGrids { get; set; }
        public string ListCard { get; set; }
        public string ListFile { get; set; }
        public string TotalRow { get; set; }
        public bool IsRead { get; set; }
        public string ObjectName { get; set; }
        public string ObjectTypeName { get; set; }
    }
    public class ActGrid
    {
        public string ActName { get; set; }
        public string ActStatus { get; set; }
        public int Id { get; set; }
        public bool IsLock { get; set; }
        public int Level { get; set; }
        public string ActivityInstCode { get; set; }
        public string ActType { get; set; }
        public string WorkflowInstCode { get; set; }
        public bool IsInstance { get; set; }
        //public bool PermisstionApprove { get; set; }
        public string ObjectCode { get; set; }
        public string JsonLog
        {
            get
            {
                return JsonConvert.SerializeObject(Log);
            }
            set
            {
                Log = string.IsNullOrEmpty(value)
                    ? new LogStatus()
                    : JsonConvert.DeserializeObject<LogStatus>(value);
            }
        }
        public LogStatus Log { get; set; }
        public bool IsApprovable { get; set; }
        public bool IsLastUpdated { get; set; }
        public string JsonStatusLog { get; set; }
        public List<LogStatus> ListLogStatus { get; set; }
    }

    public class JsonCommand
    {
        public int Id { get; set; }
        public string CommandSymbol { get; set; }
        public string ConfirmedBy { get; set; }
        public string Confirmed { get; set; }
        public string ConfirmedTime { get; set; }
        public string Approved { get; set; }
        public string ApprovedBy { get; set; }
        public string ApprovedTime { get; set; }
        public string Message { get; set; }
        public string ActA { get; set; }
        public string ActB { get; set; }
        public bool IsLeader { get; set; }
    }
}
