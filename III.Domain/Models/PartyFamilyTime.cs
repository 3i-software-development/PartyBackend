using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESEIM.Models
{
    [Table("PARTY_FAMILY_TIME")]
    public class PartyFamilyTime
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string ResumeCode { get; set; }

        public string Relationship { get; set; }

        public string LastTime { get; set; }

        public DateTime? CreatedDate { get; set; }
        [StringLength(50)]
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        [StringLength(50)]
        public string UpdatedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        [StringLength(50)]
        public string DeletedBy { get; set; }
        public bool IsDeleted { get; set; }
    }
    
    public class PartyFamilyTimeModel
    {
        public int? Id { get; set; }

        public string ResumeCode { get; set; }

        public string Relationship { get; set; }

        public string LastTime { get; set; }
    }
}