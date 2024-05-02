using Amazon.Runtime;
using Aspose.Pdf;
using ESEIM.Models;
using ESEIM.Utils;
using III.Admin.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.TeamFoundation.Common;
using OpenXmlPowerTools;
using Syncfusion.DocIO.DLS;
using System;
using System.Collections.Generic;
using System.Linq;
using static III.Admin.Controllers.MobileLoginController;

namespace III.Admin.Utils
{
    public static class BindingFileKNĐ
    {
        public static void BinddingPesonal(WTable table, PartyAdmissionProfile Pap, IntroducerOfParty Iop)
        {

            WTableCell cell = table[0, 0] as WTableCell;
            foreach (IWParagraph p in cell.Paragraphs)
            {
                var a = p.Text.Trim();

                IWTextRange text;
                switch (a)
                {
                    case "Họ và tên đang dùng:":
                        text=p.AppendText(Pap.CurrentName);
                        break;

                    case ("Họ và tên khai sinh:"):
                        text=p.AppendText(Pap.BirthName);
                        break;

                    case ("Số điện thoại:"):
                        text=p.AppendText(Pap.Phone);
                        break;

                    case ("Quê quán:"):
                        text=p.AppendText(Pap.HomeTown);
                        break;

                    case ("Số LL:"):
                        text=p.AppendText(Pap.ResumeNumber);
                        break;
                        // Thêm các trường hợp khác tùy thuộc vào yêu cầu của bạn
                }
            }
            WTableCell cell2 = table[1, 0] as WTableCell;
            foreach (IWParagraph p in cell2.Paragraphs)
            {
                var a = p.Text.Trim();

                IWTextRange text;
                switch (a)
                {
                    case ("Họ và tên khai sinh:"):
                        text=p.AppendText(Pap.BirthName);
                        break;

                    case ("Nam, nữ:"):
                        text=p.AppendText(Pap.Gender==0?"Nam":"Nữ");
                        break;

                    case ("Họ và tên đang dùng:"):
                        text=p.AppendText(Pap.CurrentName);
                        break;

                    case "Ngày, tháng, năm sinh :":
                        text=p.AppendText(Pap.Birthday.Value.ToString("dd-MM-yyyy"));
                        break;

                    case ("Nơi sinh:"):
                        text=p.AppendText(Pap.PlaceBirth);
                        break;

                    case ("Quê quán:"):
                        text=p.AppendText(Pap.HomeTown);
                        break;

                    case ("- Nơi thường trú :"):
                        text=p.AppendText(Pap.PermanentResidence);
                        break;

                    case ("- Nơi tạm trú :"):
                        text=p.AppendText(Pap.TemporaryAddress);
                        break;

                    case ("Dân tộc:"):
                        text=p.AppendText(Pap.Nation);
                        break;

                    case ("Tôn giáo:"):
                        text=p.AppendText(Pap.Religion);
                        break;

                    case ("Nghề nghiệp hiện nay:"):
                        text=p.AppendText(Pap.Job);
                        break;

                    case ("- Giáo dục phổ thông:"):
                        text=p.AppendText(Pap.GeneralEducation);
                        break;

                    case ("- Giáo dục nghề nghiệp :"):
                        text=p.AppendText(Pap.JobEducation);
                        break;

                    case ("- Giáo dục đại học và sau đại học:"):
                        text=p.AppendText(Pap.Degree);
                        break;

                    case ("- Học hàm:"):
                        text=p.AppendText(Pap.UnderPostGraduateEducation);
                        break;

                    case ("- Lý luận chính trị:"):
                        text=p.AppendText(Pap.PoliticalTheory);
                        break;

                    case ("- Ngoại ngữ:"):
                        text=p.AppendText(Pap.ForeignLanguage);
                        break;

                    case ("- Tin học:"):
                        text=p.AppendText(Pap.ItDegree);
                        break;

                    case ("- Tiếng dân tộc thiểu số:"):
                        text=p.AppendText(Pap.MinorityLanguages);
                        break;
                    case ("- Tình trạng hôn nhân :"):
                        string[] parts = Pap.MarriedStatus.Split('_');

                        string maritalStatus = parts[0]; // Trạng thái hôn nhân
                        if (parts[0] == "1")
                        {
                            maritalStatus = "DOC_THAN";
                        }
                        else if (parts[0] == "2")
                        {
                            maritalStatus = "LY_HON (Số quyết định: "+ parts[1]+", Ngày quyết định: "+ parts[2] +", địa điểm: " + parts[3]+")";
                        }
                        else if (parts[0] == "3")
                        {
                            maritalStatus = "KET_HON";
                        }
                        else {
                            maritalStatus = "DOC_THAN";
                        }

                        Pap.MarriedStatus = maritalStatus;

                        text = p.AppendText(Pap.MarriedStatus);
                        break;
                    case ("Ngày và nơi vào Đoàn TNCSHCM:"):
                        if (Iop != null)
                        {
                            text=p.AppendText(Iop.PlaceTimeJoinUnion);
                        }
                        break;
                    case ("Ngày và nơi vào Đảng CSVN lần thứ nhất (nếu có):"):
                        if (Iop != null)
                        {
                            text=p.AppendText(Iop.PlaceTimeJoinParty);
                        }
                        break;
                    case ("Ngày và nơi công nhận chính thức lần thứ nhất (nếu có):"):
                        if (Iop != null)
                        {
                            text=p.AppendText(Iop.PlaceTimeRecognize);
                        }
                        break;

                    case ("Người giới thiệu vào Đảng lần thứ nhất (nếu có):"):
                        if (Iop != null)
                        {
                            text=p.AppendText(Iop.PersonIntroduced);
                        }
                        break;
                }
            }
        }

        //Lịch sử bản thân
        public static void BinđingPersonalHistory(WTable table,List<PersonalHistory> Ph)
        {
            WTableCell cell = table[0, 0] as WTableCell;
            foreach (PersonalHistory ph in Ph)
            {
                IWTextRange text;
                IWParagraph p = cell.AddParagraph();
                text=p.AppendText("+ Tháng "+ph.Begin+" - "+ ph.End +": "+ph.Content);
            }
        }

        //NHỮNG CÔNG TÁC VÀ CHỨC VỤ ĐÃ QUA
        public static void BinddingWorkingTracking(WTable table, List<WorkingTracking> TrCP)
        {
            for (int i = 0; i < TrCP.Count; i++)
            {
                WTableRow row = null;
                if (i != 0)
                {
                    row = table.AddRow();
                }
                else
                {
                    row = table.Rows[i + 1];
                }

                IWTextRange text;
                WTableCell cell = row.Cells[0] as WTableCell;
                IWParagraph p = cell.AddParagraph();
                text=p.AppendText("Từ "+TrCP[i].From + " đến " + TrCP[i].To);


                cell = row.Cells[1] as WTableCell;
                p = cell.AddParagraph();
                text=p.AppendText(TrCP[i].Work);

                cell = row.Cells[2] as WTableCell;
                p = cell.AddParagraph();
                text=p.AppendText(TrCP[i].Role);

            }
        }


        //ĐẶC ĐIỂM LỊCH SỬ
        public static void BinddingHistorySpecialist(WTable table, List<HistorySpecialist> Ph)
        {
            WTableCell cell = table[0, 0] as WTableCell;
            foreach (HistorySpecialist ph in Ph)
            {
                try
                {
                    IWTextRange text;
                    IWParagraph p = cell.AddParagraph();
                    DateTime date = DateTime.Parse(ph.MonthYear);
                    text=p.AppendText(date.ToString("'Ngày' dd 'tháng' MM 'năm' yyyy"));

                    p = cell.AddParagraph();
                    text=p.AppendText(ph.Content);

                }catch (Exception ex)
                {

                }
            }
        }


        //Những lớp đào tạo đã qua
        public static void BinddingTrainingCertificatedPass(WTable table, List<TrainingCertificatedPass> TrCP)
        {
            for (int i = 0; i < TrCP.Count; i++)
            {
                WTableRow row = null;
                if (i != 0)
                {
                    row = table.AddRow();
                }
                else
                {
                    row = table.Rows[i + 1];
                }
                WTableCell cell = row.Cells[0] as WTableCell;

                IWParagraph p = cell.AddParagraph();

                IWTextRange text;

                text =p.AppendText(TrCP[i].SchoolName);


                cell = row.Cells[1] as WTableCell;
                p = cell.AddParagraph();
                text=p.AppendText(TrCP[i].Class);

                cell = row.Cells[2] as WTableCell;
                p = cell.AddParagraph();
                text=p.AppendText(TrCP[i].From + " đến " + TrCP[i].To);

                cell = row.Cells[3] as WTableCell;
                p = cell.AddParagraph();
                text=p.AppendText(TrCP[i].Certificate);
            }
        }


        //ĐI NƯỚC NGOÀI
        public static void BinddingGoAboard(WTable table, List<GoAboard> TrCP)
        {
            for (int i = 0; i < TrCP.Count; i++)
            {
                WTableRow row = null;
                if (i != 0)
                {
                    row = table.AddRow();
                }
                else
                {
                    row = table.Rows[i + 1];
                }
                WTableCell cell = row.Cells[0] as WTableCell;
                IWTextRange text;

                IWParagraph p = cell.AddParagraph();
                text=p.AppendText("Từ " + TrCP[i].From + " đến " + TrCP[i].To);


                cell = row.Cells[1] as WTableCell;
                p = cell.AddParagraph();
                text=p.AppendText(TrCP[i].Contact);

                cell = row.Cells[2] as WTableCell;
                p = cell.AddParagraph();
                text=p.AppendText(TrCP[i].Country);

            }
        }


        //Khen thưởng
        public static void BinddingAward(WTable table, List<Award> TrCP)
        {
            for (int i = 0; i < TrCP.Count; i++)
            {
                WTableRow row = null;
                if (i != 0)
                {
                    row = table.AddRow();
                }
                else
                {
                    row = table.Rows[i + 1];
                }
                WTableCell cell = row.Cells[0] as WTableCell;
                IWTextRange text;

                IWParagraph p = cell.AddParagraph();
                text=p.AppendText(TrCP[i].MonthYear);


                cell = row.Cells[1] as WTableCell;
                p = cell.AddParagraph();
                text=p.AppendText(TrCP[i].Reason);

                cell = row.Cells[2] as WTableCell;
                p = cell.AddParagraph();
                text=p.AppendText(TrCP[i].GrantOfDecision);

            }
        }


        //Kỷ Luật
        public static void BinddingWarningDisciplined(WTable table, List<WarningDisciplined> TrCP)
        {
            for (int i = 0; i < TrCP.Count; i++)
            {
                WTableRow row = null;
                if (i != 0)
                {
                    row = table.AddRow();
                }
                else
                {
                    row = table.Rows[i + 1];
                }
                WTableCell cell = row.Cells[0] as WTableCell;

                IWTextRange text;
                IWParagraph p = cell.AddParagraph();
                text=p.AppendText(TrCP[i].MonthYear);


                cell = row.Cells[1] as WTableCell;
                p = cell.AddParagraph();
                text=p.AppendText(TrCP[i].Reason);

                cell = row.Cells[2] as WTableCell;
                p = cell.AddParagraph();
                text=p.AppendText(TrCP[i].GrantOfDecision);

            }
        }

        //Hoàn cảnh gia đinh
        public static void BinddingFamily(WTable table, List<Family> Ph)
        {
            WTableCell cell = table[0, 0] as WTableCell;
            foreach (Family ph in Ph)
            {
                try
                {
                    IWTextRange text;
                    IWParagraph p = cell.AddParagraph();
                    text=p.AppendText("*"+ ph.Relation+" :");
                    p = cell.AddParagraph();
                    text=p.AppendText("- Họ và tên: " + ph.Name);

                    p = cell.AddParagraph();
                    string[] parts = ph.BirthYear.Split('_');

                    string BirthYear = parts[0]; 
                    if (parts.Length >1 && parts[0] == "true" )
                    {
                        ph.BirthYear = "Đã mất (" + parts[1] + ")";
                    }
                    else
                    {
                        ph.BirthYear =  parts[1];
                    }

                    text =p.AppendText("- Năm sinh: " + ph.BirthYear);

                    p = cell.AddParagraph();
                    text=p.AppendText("- Quê quán: " + ph.HomeTown);

                    p = cell.AddParagraph();
                    text=p.AppendText("- Nơi cư trú: " + ph.Residence);

                    p = cell.AddParagraph();
                    var ismember = ph.PartyMember;
                    string[] partsMember = ph.PartyMember.Split('_');

                    string PartyMember = partsMember[0];
                    if (partsMember.Length > 1 && partsMember[1] == "true")
                    {
                        ph.PartyMember = "Có (Sinh hoạt tại: " + partsMember[0] + ")";
                    }
                    else
                    {
                        ph.PartyMember = "Không";
                    }
                    text =p.AppendText("- Đảng viên: " + ph.PartyMember);

                    p = cell.AddParagraph();
                    text=p.AppendText("- Nghề nghiệp: " + ph.Job);

                    p = cell.AddParagraph();
                    text=p.AppendText("- Quá trình công tác: ");
                    if (!ph.WorkingProgress.IsNullOrEmpty())
                    {
                        p = cell.AddParagraph();
                        text = p.AppendText(ph.WorkingProgress);
                    }
                    p = cell.AddParagraph();
                    text = p.AppendText("- Thái độ chính trị: ");
                    if (!ph.PoliticalAttitude.IsNullOrEmpty())
                    {
                        /*p = cell.AddParagraph();*/
                        text = p.AppendText(ph.PoliticalAttitude);
                    }
                    p = cell.AddParagraph();
                    
                }
                catch (Exception ex)
                {

                }
            }
        }

    }

    public static class BindingReportKND
    {
        public static async void BinddingPesonal(WTable table, IWSection section, string[] Pap, string[] Itroducer)
        {
            WTableRow row = table.Rows[1];
            WTableCell cell = row.Cells[0] as WTableCell;

            IWParagraph p;
            IWTextRange text;
            foreach (var Item in Pap)
            {
                p = cell.AddParagraph();
                text = p.AppendText(Item);
                SetStyle(text);
            }
            foreach (var Item in Itroducer)
            {
                p = cell.AddParagraph();
                text = p.AppendText(Item);
                SetStyle(text);
            }
        }
        private static void SetStyle(IWTextRange text)
        {
            text.CharacterFormat.FontName = "Times New Roman";
            text.CharacterFormat.FontSize = 12.5F;
        }
        public static void BinđingPersonalHistory(WTable table, string[] workingTracking)
        {
            int count = table.Rows.Count; int countNow = 0;
            if (workingTracking.Where(item=> item.StartsWith("Từ")).Count() > 0)
            {
                countNow++;
            }
            if(workingTracking.Where(item => item.StartsWith("Đến")).Count() > 0)
            {
                countNow++;
            }
            if(workingTracking.Where(item => item.StartsWith("Công việc")).Count() > 0)
            {
                countNow++;
            }
            if(workingTracking.Where(item => item.StartsWith("Chức vụ")).Count() > 0)
            {
                countNow++;
            }
            int countObject = 0;
            int selectRow = 1;
            WTableRow row=null;
            foreach (var item in workingTracking)
            {
                if (countObject < countNow)
                {
                    countObject++;
                }
                else
                {
                    countObject = 1;
                    selectRow++;
                }

                if (selectRow < count)
                {
                    row = table.Rows[selectRow];
                }
                else
                {
                    row= table.AddRow();
                    count++;
                }
                IWTextRange text;

                if (item.StartsWith("Từ") || item.StartsWith("Đến"))
                {
                    WTableCell cell = row.Cells[0] as WTableCell;
                    IWParagraph p = cell.AddParagraph();
                    text = p.AppendText(item);
                    SetStyle(text); 
                }
                else if (item.StartsWith("Công việc") || item.StartsWith("Chức vụ"))
                {
                    WTableCell cell = row.Cells[1] as WTableCell;
                    IWParagraph p = cell.AddParagraph();
                    text = p.AppendText(item);
                    SetStyle(text);
                }
            }
            
        }
        public static void BinddingTrainingCertificatedPass(WTable table, string[] TrCP)
        {
            int count = table.Rows.Count; int countNow = 0;
            if (TrCP.Where(item => item.StartsWith("Từ")).Count() > 0)
            {
                countNow++;
            }
            if (TrCP.Where(item => item.StartsWith("Đến")).Count() > 0)
            {
                countNow++;
            }
            if (TrCP.Where(item => item.StartsWith("Certificate")).Count() > 0)
            {
                countNow++;
            }
            if (TrCP.Where(item => item.StartsWith("Class")).Count() > 0)
            {
                countNow++;
            }
            if (TrCP.Where(item => item.StartsWith("SchoolName")).Count() > 0)
            {
                countNow++;
            }
            int countObject = 0;
            int selectRow = 1;
            WTableRow row = null;
            foreach (var item in TrCP)
            {
                if (countObject < countNow)
                {
                    countObject++;
                }
                else
                {
                    countObject = 1;
                    selectRow++;
                }

                if (selectRow < count)
                {
                    row = table.Rows[selectRow];
                }
                else
                {
                    row = table.AddRow();
                    count++;
                }

                IWTextRange text;
                if (item.StartsWith("SchoolName"))
                {
                    setCellParagraph(row, 0, item, true);
                }
                if (item.StartsWith("Class"))
                {
                    setCellParagraph(row, 1, item, true);
                }
                if (item.StartsWith("Từ") || item.StartsWith("Đến"))
                {
                    setCellParagraph(row, 2, item);
                }
                if (item.StartsWith("Certificate"))
                {
                    setCellParagraph(row, 3, item, true);
                }
            }
        }

        private static void setCellParagraph(WTableRow row, int v, string item,bool IsSplit=false)
        {
            if (IsSplit)
            {
                int colonIndex = item.IndexOf(':');
                if (colonIndex != -1 && colonIndex < item.Length - 1)
                {
                    // Trả về phần chuỗi sau dấu ":"
                    item= item.Substring(colonIndex + 1).Trim();
                }
            }

            WTableCell cell = row.Cells[v] as WTableCell;
            IWParagraph p = cell.AddParagraph();
            IWTextRange text = p.AppendText(" "+item);
            SetStyle(text);
        }

        public static void BinddingFamily(WTable table,string[] TrCP)
        {
            int count = table.Rows.Count; int countNow = 0;
            if (TrCP.Where(item => item.StartsWith("Thái độ chính trị")).Count() > 0)
            {
                countNow++;
            }
            if (TrCP.Where(item => item.StartsWith("Quê quán")).Count() > 0)
            {
                countNow++;
            }
            if (TrCP.Where(item => item.StartsWith("Nơi ở hiện nay")).Count() > 0)
            {
                countNow++;
            }
            if (TrCP.Where(item => item.StartsWith("Nghề nghiệp")).Count() > 0)
            {
                countNow++;
            }
            if (TrCP.Where(item => item.StartsWith("Quá trình công tác")).Count() > 0)
            {
                countNow++;
            }
            if (TrCP.Where(item => item.StartsWith("Relation")).Count() > 0)
            {
                countNow++;
            }

            if (TrCP.Where(item => item.StartsWith("Đảng viên")).Count() > 0)
            {
                countNow++;
            }

            if (TrCP.Where(item => item.StartsWith("BirthYear")).Count() > 0)
            {
                countNow++;
            }
            if (TrCP.Where(item => item.StartsWith("Name")).Count() > 0)
            {
                countNow++;
            }

            int countObject = 0;
            int selectRow = 1;
            WTableRow row = null;
            foreach (var item in TrCP)
            {
                if (countObject < countNow)
                {
                    countObject++;
                }
                else
                {
                    countObject = 1;
                    selectRow++;
                }

                if (selectRow < count)
                {
                    row = table.Rows[selectRow];
                }
                else
                {
                    row = table.AddRow();
                    count++;
                }
                IWTextRange text;
                if (item.StartsWith("Relation"))
                {
                    setCellParagraph(row, 0, item, true);
                }
                if (item.StartsWith("Name"))
                {
                    setCellParagraph(row, 1, item,true);
                }
                if (item.StartsWith("BirthYear"))
                {
                    setCellParagraph(row, 2, item,true);
                }
                if (item.StartsWith("Thái độ chính trị")|| item.StartsWith("Quê quán")|| item.StartsWith("Nơi ở hiện nay")|| 
                    item.StartsWith("Nghề nghiệp")|| item.StartsWith("Quá trình công tác"))
                {
                    setCellParagraph(row, 3, item);
                }
                if (item.StartsWith("Đảng viên"))
                {
                    var a = "";
                    if (item.Split(":")[1]==" True")
                    {
                        a = "Đảng viên: đúng";
                    }
                    else
                    {
                        a = "Đảng viên: sai";
                    }
                    setCellParagraph(row, 3, a);
                }
                
            }
        }

        public static void BinddingPersonalHistoriesAndSpecialHistory(WTable table, string[] personalHistories)
        {
            int count = table.Rows.Count; int countNow = 0;
            if (personalHistories.Where(item => item.StartsWith("Từ")).Count() > 0)
            {
                countNow++;
            }
            if (personalHistories.Where(item => item.StartsWith("Đến")).Count() > 0)
            {
                countNow++;
            }
            if (personalHistories.Where(item => item.StartsWith("Content")).Count() > 0)
            {
                countNow++;
            }
            if (personalHistories.Where(item => item.StartsWith("MonthYear")).Count() > 0)
            {
                countNow++;
            }
            int countObject = 0;
            int selectRow = 1;
            WTableRow row = null;
            foreach (var item in personalHistories)
            {
                if (countObject < countNow)
                {
                    countObject++;
                }
                else
                {
                    countObject = 1;
                    selectRow++;
                }

                if (selectRow < count)
                {
                    row = table.Rows[selectRow];
                }
                else
                {
                    row = table.AddRow();
                    count++;
                }
                IWTextRange text;
                if (item.StartsWith("Từ") || item.StartsWith("Đến"))
                {
                    setCellParagraph(row, 0, item);
                }
                else if (item.StartsWith("Content"))
                {
                    setCellParagraph(row, 1, item, true);
                }
                else if(item.StartsWith("MonthYear"))
                {
                    setCellParagraph(row, 0, item, true);
                }
            }
        }

        public static void BinddingAwards(WTable table, string[] awards)
        {
            int count = table.Rows.Count; int countNow = 0;
            if (awards.Where(item => item.StartsWith("MonthYear")).Count() > 0)
            {
                countNow++;
            }
            if (awards.Where(item => item.StartsWith("Reason")).Count() > 0)
            {
                countNow++;
            }
            if (awards.Where(item => item.StartsWith("GrantOfDecision")).Count() > 0)
            {
                countNow++;
            }
            int countObject = 0;
            int selectRow = 1;
            WTableRow row = null;
            foreach (var item in awards)
            {
                if (countObject < countNow)
                {
                    countObject++;
                }
                else
                {
                    countObject = 1;
                    selectRow++;
                }

                if (selectRow < count)
                {
                    row = table.Rows[selectRow];
                }
                else
                {
                    row = table.AddRow();
                    count++;
                }
                IWTextRange text;

                if (item.StartsWith("MonthYear"))
                {
                    setCellParagraph(row, 0, item,true);
                }
                else if (item.StartsWith("Reason"))
                {
                    setCellParagraph(row, 1, item, true);
                }
                else if (item.StartsWith("GrantOfDecision"))
                {
                    setCellParagraph(row, 2, item, true);
                }
            }
        }

        public static void BinddingGoAboards(WTable table, string[] goAboards)
        {
            int count = table.Rows.Count; int countNow = 0;
            if (goAboards.Where(item => item.StartsWith("Từ")).Count() > 0)
            {
                countNow++;
            }
            if (goAboards.Where(item => item.StartsWith("Đến")).Count() > 0)
            {
                countNow++;
            }
            if (goAboards.Where(item => item.StartsWith("Contact")).Count() > 0)
            {
                countNow++;
            }
            if (goAboards.Where(item => item.StartsWith("Country")).Count() > 0)
            {
                countNow++;
            }
            int countObject = 0;
            int selectRow = 1;
            WTableRow row = null;
            foreach (var item in goAboards)
            {
                if (countObject < countNow)
                {
                    countObject++;
                }
                else
                {
                    countObject = 1;
                    selectRow++;
                }

                if (selectRow < count)
                {
                    row = table.Rows[selectRow];
                }
                else
                {
                    row = table.AddRow();
                    count++;
                }
                IWTextRange text;

                if (item.StartsWith("Từ")|| item.StartsWith("Đến"))
                {
                    setCellParagraph(row, 0, item, true);
                }
                else if (item.StartsWith("Contact"))
                {
                    setCellParagraph(row, 1, item, true);
                }
                else if (item.StartsWith("Country"))
                {
                    setCellParagraph(row, 2, item, true);
                }
            }
        }
    }

    public static class BinddingPartyMemberProfile
    {
        public static void BiddingPatyProfile(IWSection section, UserJoinPartyController.converJsonPartyAdmission jsonParty)
        {
            foreach (IWParagraph p in section.Paragraphs)
            {
                string a = p.Text.Trim();

                switch (a)
                {
                    case "01) Họ và tên đang dùng:………………………………………… 02) Nam, nữ…………………….":
                        p.Replace("01) Họ và tên đang dùng:………………………………………", "01) Họ và tên đang dùng:" + jsonParty.Profile.CurrentName,true, true);
                        p.Replace("02) Nam, nữ……………………", "02) Nam, nữ: " + jsonParty.Profile.Gender, true, true);
                        break;
                    case "03) Họ và tên khai sinh:…………………………………………... 04) Sinh ngày.../…/……….……":
                        p.Replace("03) Họ và tên khai sinh:…………………………………………..", "03) Họ và tên khai sinh:" + jsonParty.Profile.BirthName, true, true);
                        p.Replace("04) Sinh ngày.../…/……….……", "04) Sinh ngày: " + jsonParty.Profile.Birthday, true, true);
                        break;
                    case "05) Nơi sinh:……………………………………………………………………………………………..":
                        p.Replace("05) Nơi sinh:……………………………………………………………………………………………..", "05) Nơi sinh:" + jsonParty.Profile.PlaceBirth, true, true);
                        break;
                    case "06) Quê quán:……………………………………………………………………………………………":
                        p.Replace("06) Quê quán:…………………………………………………………………………………………", "06) Quê quán:" + jsonParty.Profile.HomeTown, true, true);
                        break;
                    case "07) Nơi thường trú:……………………………………………………………………………………...":
                        p.Replace("07) Nơi thường trú:……………………………………………………………………………………..", "07) Nơi thường trú:" + jsonParty.Profile.PermanentResidence, true, true);
                        break;
                    case "Nơi tạm trú:………………………………………………………………………………………….":
                        if (!string.IsNullOrEmpty(jsonParty.Profile.TemporaryAddress))
                            p.Replace("Nơi tạm trú:………………………………………………………………………………………….", "Nơi tạm trú:" + jsonParty.Profile.TemporaryAddress, true, true);
                        break;
                    case "08) Dân tộc:………………………………………… 09) Tôn giáo:…………………………………..":
                        p.Replace("08) Dân tộc:………………………………………", "08) Dân tộc:" + jsonParty.Profile.Nation, true, true);
                        if (!string.IsNullOrEmpty(jsonParty.Profile.Religion))
                            p.Replace("09) Tôn giáo:………………………………….", "09) Tôn giáo: " + jsonParty.Profile.Religion, true, true);
                        break;
                    case "10) Thành phần gia đình:……………………….11) Nghề nghiệp hiện nay:………………………\v…………………………………………………………………………………………………………….":
                        p.Replace("………………………\v…………………………………………………………………………………………………………….", jsonParty.Profile.Job, true, true);
                        break;
                    case "12) Ngày vào Đảng:…/…/…… Tại Chi bộ:…………………………………………………………..":
                        if (jsonParty.IntroducerOfParty != null) 
                            p.Replace("12) Ngày vào Đảng:…/…/…… Tại Chi bộ:………………………………………………………….",
                            "12) Ngày vào Đảng: "+jsonParty.IntroducerOfParty.PlaceTimeJoinParty, true, true);
                        break;
                    case "Người giới thiệu thứ 1:…………………………….. Chức vụ, đơn vị:……………………………...\v…………………………………………………………………………………………………………….":
                        if (jsonParty.IntroducerOfParty != null)
                            p.Replace("…………………………….. Chức vụ, đơn vị:……………………………...\v…………………………………………………………………………………………………………….",
                            jsonParty.IntroducerOfParty.PersonIntroduced, true, true);
                        break;
                    case "Ngày chính thức:…/…/…… Tại Chi bộ:………………………………………………………………":
                        if (jsonParty.IntroducerOfParty != null)
                            p.Replace("…/…/…… Tại Chi bộ:………………………………………………………………",
                            jsonParty.IntroducerOfParty.PlaceTimeRecognize, true, true);
                        break;
                    case "14) Ngày vào Đoàn TNCS Hồ Chí Minh:…/…/……………………………………………..............":
                        if (jsonParty.IntroducerOfParty != null)
                            p.Replace("…/…/……………………………………………..............",
                            jsonParty.IntroducerOfParty.PlaceTimeJoinUnion, true, true);
                        break;
                    case "- Giáo dục phổ thông:…………….…… - Giáo dục nghề nghiệp:………………………………….":
                        if (!string.IsNullOrEmpty(jsonParty.Profile.GeneralEducation))
                            p.Replace("Giáo dục phổ thông:…………….…", "Giáo dục phổ thông: " + jsonParty.Profile.GeneralEducation, true, true);
                        if (!string.IsNullOrEmpty(jsonParty.Profile.JobEducation))
                            p.Replace("Giáo dục nghề nghiệp:…………………………………", "Giáo dục nghề nghiệp: " + jsonParty.Profile.JobEducation, true, true);
                        break;
                    case "- Giáo dục đại học và sau đại học: ………………………………":
                        if (!string.IsNullOrEmpty(jsonParty.Profile.UnderPostGraduateEducation))
                            p.Replace("……………………………", jsonParty.Profile.UnderPostGraduateEducation, true, true);
                        break;
                    case "Học vị: …………………………………. - Học hàm: ………………………………………………….":
                        if(!string.IsNullOrEmpty(jsonParty.Profile.Degree))
                            p.Replace("…………………………………………………", jsonParty.Profile.Degree, true, true);
                        break;
                    case "- Lý luận chính trị: ……………………. - Ngoại ngữ: ………………………………………………..":
                        if (!string.IsNullOrEmpty(jsonParty.Profile.ForeignLanguage))
                            p.Replace("………………………………………………..", jsonParty.Profile.ForeignLanguage, true, true);
                        break;
                    case "- Tin học: ………………………………………………………………………………………………...":
                        if (!string.IsNullOrEmpty(jsonParty.Profile.ItDegree))
                            p.Replace("………………………………………………………………………………………………..", jsonParty.Profile.ItDegree, true, true);
                        break;
                    case "23) Khen thưởng : (Huân chương, huy chương, bằng khen)……………………………………\v…………………………………………………………………………………………………………\v…………………………………………………………………………………………………………":
                        BindingAward(p, jsonParty.Awards);
                        break;
                    case "26) Kỷ luật (Đảng, chính quyền, pháp luật): ……………………………………………………\v………………………………………………………………………………………………………":
                        BindingWarning(p, jsonParty.WarningDisciplineds);
                        break;
                    case "a) Đã đi nước ngoài (nước nào, lý do, thời gian ra nước ngoài...): …………………………\v………………………………………………………………………………………………………\v………………………………………………………………………………………………………":
                        BindingGoAboards(p, jsonParty.GoAboards);
                        break;
                    case "Thời gian: …………………………………\tTại Chi bộ: ……………………………":
                        BindingPersonalHistories1(p, jsonParty.PersonalHistories);
                        break;
                    case "- Ngày vào Đảng lần thứ 2: …/…/…… Tại chi bộ: …………………………………………….":
                        BindingPersonalHistories2(p, jsonParty.PersonalHistories);
                        break;
                    case "d) Bị xử lý theo pháp luật (ngày, tháng, năm; chính quyền nào xử lý; hình thức xử lý, nơi thi hành án...): ……………………………………………………………………………………………….\v………………………………………………………………………………………………………\v………………………………………………………………………………………………………":
                        BindingPersonalHistories4(p, jsonParty.PersonalHistories);
                        break;
                    case "e) Bản thân có làm việc trong chế độ cũ (ngày, tháng, năm; chức vụ; nơi làm việc...): ….\v………………………………………………………………………………………………………\v………………………………………………………………………………………………………":
                        BindingPersonalHistories5(p, jsonParty.PersonalHistories);
                        break;
                    case "c) Ngày được khôi phục đảng tịch: …/…/…… Tại chi bộ: ……………………………………\v……………………………………………………………………………………………………….":
                        BindingPersonalHistories3(p, jsonParty.PersonalHistories);
                        break;
                }
            }

            var table = section.Tables[1] as WTable;
            BindingWorkingTracking(table, jsonParty.WorkingTracking);

            table = section.Tables[2] as WTable;
            BindingTrainingCertificatedPasses(table, jsonParty.TrainingCertificatedPasses);
            
            table = section.Tables[3] as WTable;
            BindingFamily(table, jsonParty.Families);
        }
        //Được kết nạp lại vào Đảng
        private static void BindingPersonalHistories2(IWParagraph p, List<PersonalHistory> personalHistories)
        {
            var item = personalHistories.FirstOrDefault(x => x.Type == "2");

            if (item != null)
            {
                p.Replace("…/…/……", item.Begin + "-" + item.End, true, true);
                if (!string.IsNullOrEmpty(item.Content))
                    p.Replace("……………………………………………", item.Content, true, true);
            }
        }

        //khôi phục đảng tịch
        private static void BindingPersonalHistories3(IWParagraph p, List<PersonalHistory> personalHistories)
        {
            var item = personalHistories.FirstOrDefault(x => x.Type == "3");

            if (item != null)
            {
                p.Replace("…/…/……", item.Begin + "-" + item.End, true, true);
                if (!string.IsNullOrEmpty(item.Content))
                    p.Replace("……………………………………\v……………………………………………………………………………………………………….", item.Content, true, true);
            }
        }

        //Làm việc trong chế độ cũ
        private static void BindingPersonalHistories5(IWParagraph p, List<PersonalHistory> personalHistories)
        {
            string text = "";
            personalHistories = personalHistories.Where(x => x.Type == "5").ToList();

            foreach (var item in personalHistories)
            {
                text += $"{item.Content}(Thời gian: {item.Begin}-{item.End}),";
            }
            if (text != "")
                p.Replace("….\v………………………………………………………………………………………………………\v………………………………………………………………………………………………………", text, true, true);
        }
        //Bị xử lý theo pháp luật
        private static void BindingPersonalHistories4(IWParagraph p, List<ESEIM.Models.PersonalHistory> personalHistories)
        {
            string text = "";
            personalHistories = personalHistories.Where(x => x.Type == "4").ToList();

            foreach (var item in personalHistories)
            {
                text += $"{item.Content}(Thời gian: {item.Begin}-{item.End}),";
            }
            if (text != "")
                p.Replace(" ……………………………………………………………………………………………….\v………………………………………………………………………………………………………\v………………………………………………………………………………………………………", text, true, true);
        }
        //Bị xóa tên trong danh sách đảng viên
        private static void BindingPersonalHistories1(IWParagraph p, List<ESEIM.Models.PersonalHistory> personalHistories)
        {
            var item = personalHistories.FirstOrDefault(x => x.Type == "1");
            
            if (item != null)
            {
                p.Replace("Thời gian: …………………………………", "Thời gian: " + item.Begin + "-" + item.End, true, true);
                if (!string.IsNullOrEmpty(item.Content))
                    p.Replace("Tại Chi bộ: ……………………………", "Tại Chi bộ: " + item.Content, true, true);
            }
        }

        private static void BindingGoAboards(IWParagraph p, List<ESEIM.Models.GoAboard> goAboards)
        {
            string text = "";
            foreach (var item in goAboards)
            {
                text += $"{item.Country}(Thời gian: {item.From}-{item.To}, Nội dung: {item.Contact}),";
            }
            if(text!="")
                p.Replace(" …………………………\v………………………………………………………………………………………………………\v………………………………………………………………………………………………………", text, true, true);
        }

        private static void BindingAward(IWParagraph p, List<Award> awards)
        {
            string text = "";
            foreach (var item in awards)
            {
                text += $"{item.Reason}(Thời gian: {item.MonthYear}, Cấp quyết định: {item.GrantOfDecision}),";
            }
            if (text != "")
                p.Replace("……………………………………\v…………………………………………………………………………………………………………\v…………………………………………………………………………………………………………",text,true,true);
        }

        private static void BindingWarning(IWParagraph p, List<WarningDisciplined> awards)
        {
            string text = "";
            foreach (var item in awards)
            {
                text += $"{item.Reason}(Thời gian: {item.MonthYear}, Cấp quyết định: {item.GrantOfDecision}),";
            }
            if (text != "")
                p.Replace("……………………………………………………\v………………………………………………………………………………………………………", text, true, true);
        }
        private static void BindingFamily(WTable table, List<Family> families)
        {
            int countRow = table.Rows.Count;
            int selectRow = 1;
            WTableRow row;
            foreach (var item in families)
            {
                if (selectRow < countRow)
                {
                    row = table.Rows[selectRow];
                }
                else
                {
                    row = table.AddRow();
                    countRow++;
                }

                var cell = row.Cells[0];
                IWTextRange text;

                var p = cell.Paragraphs[0];
                p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Left;
                text = p.AppendText(item.Relation);
                SetStyle(text);

                cell = row.Cells[1];

                p = cell.Paragraphs[0];
                p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Left;
                text = p.AppendText(item.Name);
                SetStyle(text);

                cell = row.Cells[2];

                p = cell.Paragraphs[0];
                p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Left;
                text = p.AppendText(item.BirthYear);
                SetStyle(text);

                cell = row.Cells[3];

                p = cell.Paragraphs[0] as WParagraph;
                text = p.AppendText("-Quê quán:" + item.HomeTown);
                p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Left;
                SetStyle(text);


                p = cell.AddParagraph() as WParagraph;
                text = p.AppendText("-Nơi cư trú:" + item.Residence);
                SetStyle(text);


                p = cell.AddParagraph() as WParagraph;
                text = p.AppendText("-Nghề nghiệp:" + item.Job);
                SetStyle(text);


                p = cell.AddParagraph() as WParagraph;
                text = p.AppendText("-Quá trình công tác:" + item.WorkingProgress);
                SetStyle(text);

                p = cell.AddParagraph() as WParagraph;
                text = p.AppendText("-Thái độ chính trị:" + item.PoliticalAttitude);
                SetStyle(text);

                p = cell.AddParagraph() as WParagraph;
                text = p.AppendText("-Là đảng viên:" + item.PartyMember);
                SetStyle(text);
                selectRow++;
            }
        }

        private static void BindingTrainingCertificatedPasses(WTable table, List<TrainingCertificatedPass> trainingCertificatedPasses)
        {
            int countRow = table.Rows.Count;
            int selectRow = 1;
            WTableRow row;
            foreach (var item in trainingCertificatedPasses)
            {
                if (selectRow < countRow)
                {
                    row = table.Rows[selectRow];
                }
                else
                {
                    row = table.AddRow();
                    countRow++;
                }

                var cell = row.Cells[0];
                IWTextRange text;

                var p = cell.Paragraphs[0];
                p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Left;
                text = p.AppendText(item.SchoolName);
                SetStyle(text);

                cell = row.Cells[1];

                p = cell.Paragraphs[0];
                p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Left;
                text = p.AppendText(item.Class);
                SetStyle(text);

                cell = row.Cells[2];

                p = cell.Paragraphs[0];
                p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Left;
                text = p.AppendText("Từ:" + item.From);
                SetStyle(text);

                p = cell.AddParagraph() as WParagraph;
                text = p.AppendText("Đến:" + item.To);
                SetStyle(text);

                cell = row.Cells[4];

                p = cell.Paragraphs[0];
                p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Left;
                text = p.AppendText(item.Certificate);
                SetStyle(text);
                selectRow++;
            }
        }

        private static void SetStyle(IWTextRange text)
        {
            text.CharacterFormat.FontName = "Arial";
            text.CharacterFormat.FontSize = 10;
        }
        private static void BindingWorkingTracking(WTable table, List<WorkingTracking> workingTracking)
        {
            int countRow = table.Rows.Count;
            int selectRow = 1;
            WTableRow row;
            foreach (var item in workingTracking)
            {
                if (selectRow < countRow)
                {
                    row = table.Rows[selectRow];
                }
                else
                {
                    row = table.AddRow();
                    countRow++;
                }

                var cell = row.Cells[0];
                IWTextRange text;

                var p = cell.Paragraphs[0];
                p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Left;
                text = p.AppendText("Từ:" + item.From);
                SetStyle(text);

                p = cell.AddParagraph() as WParagraph;
                text = p.AppendText("Đến:" + item.To);
                SetStyle(text);

                cell = row.Cells[1];
                
                p = cell.Paragraphs[0];
                p.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Left;
                text = p.AppendText("Công việc:" + item.Work);
                SetStyle(text);

                p = cell.AddParagraph() as WParagraph;
                text = p.AppendText("Chức vụ:" + item.Role);
                SetStyle(text);
                selectRow++;
            }
        }
    }

}
