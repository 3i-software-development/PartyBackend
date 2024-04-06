using Amazon.Runtime;
using ESEIM.Models;
using ESEIM.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.TeamFoundation.Common;
using OpenXmlPowerTools;
using Syncfusion.DocIO.DLS;
using System;
using System.Collections.Generic;
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
                    text=p.AppendText("- Năm sinh: " + ph.BirthYear);

                    p = cell.AddParagraph();
                    text=p.AppendText("- Quê quán: " + ph.HomeTown);

                    p = cell.AddParagraph();
                    text=p.AppendText("- Nơi cư trú: " + ph.Residence);

                    p = cell.AddParagraph();
                    var ismember = ph.PartyMember == true ? "Có" : "Không";
                    text=p.AppendText("- Đảng viên: " + ismember);

                    p = cell.AddParagraph();
                    text=p.AppendText("- Nghề nghiệp: " + ph.Job);

                    p = cell.AddParagraph();
                    text=p.AppendText("- Quá trình công tác: ");

                    if (!ph.PoliticalAttitude.IsNullOrEmpty())
                    {
                        p = cell.AddParagraph();
                        text=p.AppendText(ph.PoliticalAttitude);
                    }
                    p = cell.AddParagraph();
                    text=p.AppendText("- Thái độ chính trị: "); 

                    if (!ph.WorkingProgress.IsNullOrEmpty())
                    {
                        p = cell.AddParagraph();
                        text=p.AppendText(ph.WorkingProgress);
                    }
                }
                catch (Exception ex)
                {

                }
            }
        }

    }
}
