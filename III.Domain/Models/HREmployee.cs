using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace ESEIM.Models
{
    [Table("HR_EMPLOYEE")]
    public class HREmployee
    {
        public HREmployee()
        {
            ListStatus = new List<JsonLog>();
            ListPayRange = new List<JsonLog>();
            ListPayScale = new List<JsonLog>();
            ListDepartment = new List<JsonLog>();
            ListPosition = new List<JsonLog>();
        }

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }


        [StringLength(maximumLength: 50)]
        public string fullname { get; set; }


        [StringLength(maximumLength: 50)]
        public string nickname { get; set; }


        public int? gender { get; set; }


        [StringLength(maximumLength: 50)]
        public string nation { get; set; }



        [StringLength(maximumLength: 50)]
        public string religion { get; set; }


        public DateTime? birthday { get; set; }

        [NotMapped]
        public string birthdayView { get; set; }

        [StringLength(maximumLength: 200)]
        public string birthofplace { get; set; }


        [StringLength(maximumLength: 200)]
        public string permanentresidence { get; set; }



        [StringLength(maximumLength: 50)]
        public string phone { get; set; }


        public DateTime? factiondate { get; set; }


        [StringLength(maximumLength: 50)]
        public string educationallevel { get; set; }


        [StringLength(maximumLength: 50)]
        public string languagelevel { get; set; }


        [StringLength(maximumLength: 50)]
        public string health { get; set; }


        [StringLength(maximumLength: 12)]
        public string identitycard { get; set; }


        [StringLength(maximumLength: 255)]
        public string company_Code { get; set; }

        public DateTime? identitycarddate { get; set; }

        [NotMapped]
        public string identitycarddateView { get; set; }
        [StringLength(maximumLength: 100)]
        public string identitycardplace { get; set; }
        public string socialinsurance { get; set; }
        public DateTime? socialinsurancedate { get; set; }
        [NotMapped]
        public string socialinsurancedateText { get; set; }

        [StringLength(maximumLength: 20)]
        public string socialinsuranceplace { get; set; }
        [StringLength(maximumLength: 100)]
        public string identification { get; set; }
        [StringLength(maximumLength: 50)]
        public string unit { get; set; }
        [StringLength(maximumLength: 20)]
        public string wage { get; set; }

        [StringLength(maximumLength: 50)]
        public string salarytype { get; set; }

        [StringLength(maximumLength: 12)]
        public string salarygroup { get; set; }
        public double? salaryfactor { get; set; }

        [StringLength(maximumLength: 250)]
        public string trainingschool { get; set; }

        [StringLength(maximumLength: 200)]
        public string trainingtime { get; set; }

        [StringLength(maximumLength: 50)]
        public string trainingtype { get; set; }

        [StringLength(maximumLength: 50)]
        public string disciplines { get; set; }

        [StringLength(maximumLength: 50)]
        public string specialized { get; set; }

        [StringLength(maximumLength: 255)]
        public string picture { get; set; }

        [StringLength(maximumLength: 50)]
        public string taxcode { get; set; }

        [StringLength(maximumLength: 255)]
        public string position { get; set; }

        [StringLength(50)]
        public string employeekind { get; set; }

        [StringLength(maximumLength: 100)]
        public string emailuser { get; set; }

        [StringLength(maximumLength: 100)]
        public string emailpassword { get; set; }

        [StringLength(maximumLength: 100)]
        public string nationlaty { get; set; }
        public string status { get; set; }

        [StringLength(50)]
        public string employeetype { get; set; }

        [StringLength(maximumLength: 100)]
        public string bank { get; set; }

        [StringLength(maximumLength: 50)]
        public string accountholder { get; set; }

        [StringLength(maximumLength: 100)]
        public string accountopenplace { get; set; }

        [StringLength(maximumLength: 50)]
        public string accountnumber { get; set; }

        public int? maritalstatus { get; set; }

        public int? id_driver { get; set; }

        [StringLength(maximumLength: 250)]
        public string computerskill { get; set; }


        [StringLength(50)]
        public string employeegroup { get; set; }

        public DateTime? createtime { get; set; }

        public DateTime? updatetime { get; set; }

        [StringLength(maximumLength: 10)]
        public string language { get; set; }

        public int? flag { get; set; }

        public string create_by { get; set; }

        public string updated_by { get; set; }

        [StringLength(25)]
        public string employee_code { get; set; }

        public DateTime? work_from { get; set; }

        public DateTime? work_to { get; set; }

        [StringLength(50)]
        public string work_type { get; set; }
        public decimal? years_of_exp { get; set; }

        public decimal? salary { get; set; }

        public string ShiftList { get; set; }

        public string payScale { get; set; }

        public string payRange { get; set; }

        public string payCoef { get; set; }

        public string payCareer { get; set; }

        public string payTitle { get; set; }

        public string payCertificate { get; set; }

        public string payMajor { get; set; }

        public string insuranceBookNumber { get; set; }

        public string salaryBookNumber { get; set; }
        public string notWorkDay { get; set; }

        public string QrCodePayment { get; set; }

        [NotMapped]
        public List<JsonLog> ListPayScale { get; set; }

        public string logPayScale
        {
            get
            {
                return JsonConvert.SerializeObject(ListPayScale);
            }
            set
            {
                ListPayScale = string.IsNullOrEmpty(value)
                ? new List<JsonLog>()
                : JsonConvert.DeserializeObject<List<JsonLog>>(value);
            }
        }

        [NotMapped]
        public List<JsonLog> ListPayRange { get; set; }

        public string logPayRange
        {
            get
            {
                return JsonConvert.SerializeObject(ListPayRange);
            }
            set
            {
                ListPayRange = string.IsNullOrEmpty(value)
                ? new List<JsonLog>()
                : JsonConvert.DeserializeObject<List<JsonLog>>(value);
            }
        }
        [NotMapped]
        public List<JsonLog> ListEndContarct { get; set; }

        public string logEndContract
        {
            get
            {
                return JsonConvert.SerializeObject(ListEndContarct);
            }
            set
            {
                ListEndContarct = string.IsNullOrEmpty(value)
                ? new List<JsonLog>()
                : JsonConvert.DeserializeObject<List<JsonLog>>(value);
            }
        }
        [NotMapped]
        public List<JsonLog> ListMovement { get; set; }

        public string logMovement
        {
            get
            {
                return JsonConvert.SerializeObject(ListMovement);
            }
            set
            {
                ListMovement = string.IsNullOrEmpty(value)
                ? new List<JsonLog>()
                : JsonConvert.DeserializeObject<List<JsonLog>>(value);
            }
        }

        [NotMapped]
        public List<JsonLog> ListStatus { get; set; }

        public string logStatus
        {
            get
            {
                return JsonConvert.SerializeObject(ListStatus);
            }
            set
            {
                ListStatus = string.IsNullOrEmpty(value)
                ? new List<JsonLog>()
                : JsonConvert.DeserializeObject<List<JsonLog>>(value);
            }
        }

        [NotMapped]
        public List<JsonLog> ListPosition { get; set; }

        public string logPosition
        {
            get
            {
                return JsonConvert.SerializeObject(ListPosition);
            }
            set
            {
                ListPosition = string.IsNullOrEmpty(value)
                ? new List<JsonLog>()
                : JsonConvert.DeserializeObject<List<JsonLog>>(value);
            }
        }
        [NotMapped]
        public List<JsonLog> ListDepartment { get; set; }

        public string logDepartment
        {
            get
            {
                return JsonConvert.SerializeObject(ListDepartment);
            }
            set
            {
                ListDepartment = string.IsNullOrEmpty(value)
                ? new List<JsonLog>()
                : JsonConvert.DeserializeObject<List<JsonLog>>(value);
            }
        }
        public int? order { get; set; }
        public string MarkedBy { get; set; }
        public DateTime? MarkedTime { get; set; }
    }

    public class JsonLog
    {
        public JsonLog()
        {
            CreatedTime = DateTime.Now;
        }

        public int? No { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }
        //public string Type { get; set; }
        public string ObjectRelative { get; set; }
        public string ObjectType { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedTime { get; set; }

        public string SCreatedTime => CreatedTime.ToString("HH:mm dd/MM/yyyy");
    }
}
