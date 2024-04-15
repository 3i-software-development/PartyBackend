using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ESEIM.Models
{
    [Table("PARTY_ADMISSION_PROFILE")]
    public class PartyAdmissionProfile
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Note("Họ và tên")]
        [StringLength(maximumLength: 50)]
        public string CurrentName { get; set; }

        [Note("Tên khai sinh")]
        [StringLength(maximumLength: 50)]
        public string BirthName { get; set; }

        [Note("Giới tính")]
        public int Gender { get; set; }

        [Note("Dân tộc")]
        [StringLength(maximumLength: 50)]
        public string Nation { get; set; }

        [Note("Tôn giáo")]
        [StringLength(maximumLength: 50)]
        public string Religion { get; set; }

        [Note("Ngày sinh")]
        public DateTime? Birthday { get; set; }

        [Note("Địa chỉ thường trú")]
        [StringLength(maximumLength: 200)]
        public string PermanentResidence { get; set; }

        [Note("Số điện thoại")]
        [StringLength(maximumLength: 50)]
        public string Phone { get; set; }

        [StringLength(maximumLength: 255)]
        public string Picture { get; set; }

        [Note("Quê quán")]
        [StringLength(maximumLength: 100)]
        public string HomeTown { get; set; }

        [Note("Nơi sinh")]
        [StringLength(maximumLength: 100)]
        public string PlaceBirth { get; set; }

        [Note("Nghề nghiệp hiện nay")]
        [StringLength(maximumLength: 50)]
        public string Job { get; set; }

        [Note("Địa chỉ tạm trú")]
        [StringLength(maximumLength: 250)]
        public string TemporaryAddress { get; set; }

        [Note("Giáo dục phổ thông")]
        [StringLength(maximumLength: 50)]
        public string GeneralEducation { get; set; }

        [Note("Giáo dục nghề nghiệp")]
        [StringLength(maximumLength: 50)]
        public string JobEducation { get; set; }

        [Note("Giáo dục đại học")]
        [StringLength(maximumLength: 50)]
        public string UnderPostGraduateEducation { get; set; }

        [Note("Học hàm")]
        [StringLength(maximumLength: 50)]
        public string Degree { get; set; }

        [Note("Lý luận chính trị")]
        [StringLength(maximumLength: 50)]
        public string PoliticalTheory { get; set; }

        [Note("Ngoại ngữ")]
        [StringLength(maximumLength: 50)]
        public string ForeignLanguage { get; set; }

        [Note("Tin học")]
        [StringLength(maximumLength: 50)]
        public string ItDegree { get; set; }

        [Note("Tiếng dân tộc thiểu số")]
        [StringLength(maximumLength: 50)]
        public string MinorityLanguages { get; set; }

        [Note("Số LL")]
        [StringLength(maximumLength: 50)]
        public string ResumeNumber { get; set; }

        [Note("Tự nhận sét")]
        //public DateTime CreatedTime { get; set; }
        public string SelfComment { get; set; }

        [Note("Nơi tạo")]
        public string CreatedPlace { get; set; }

        public int UserCode { get; set; }
        public bool IsDeleted { get; set; }
        public string CreatedBy { get; set; }
        public string Username { get; set; }
        public string Status
        {
            get
            {
                return JsonConvert.SerializeObject(JsonStaus);
            }
            set
            {
                JsonStaus = string.IsNullOrEmpty(value)
                ? new List<JsonLog>()
                : JsonConvert.DeserializeObject<List<JsonLog>>(value);
            }
        }

        public string ProfileLink {
            get
            {
                return JsonConvert.SerializeObject(JsonProfileLinks);
            }
            set
            {
                JsonProfileLinks = string.IsNullOrEmpty(value)
                ? new List<JsonFile>()
                : JsonConvert.DeserializeObject<List<JsonFile>>(value);
            }
        }
        [NotMapped]
        public List<JsonFile> JsonProfileLinks { get; set; }
        [NotMapped]
        public List<JsonLog> JsonStaus { get; set; }
        public string WfInstCode { get; set; }
        [Note("Nhóm chi bộ")]
        public string GroupUserCode { get; set; }
        [Note("Địa giới hành chính")]
        public string PlaceWorking { get; set; }

       
    }

    public class JsonFile
    {
        public string FileName { get; set; }
        public long FileSize { get; set; }
    }
    public class PartyStatus
    {
        public string Title { get; set; }
        public string Status { get; set; }
        public string CtreateTime { get; set; }
        public string ActInst { get; set; }
        public string UserName { get; set; }
    }
}
