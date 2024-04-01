using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ESEIM.Models
{
    [Table("ACTIVITY")]
    public class Activity
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        public string ActivityCode { get; set; }

        public string Title { get; set; }

        public decimal Duration { get; set; }

        public string Unit { get; set; }

        public string Located { get; set; }

        public string Status { get; set; }

        public string Desc { get; set; }

        public string ShapeJson { get; set; }

        public string Group { get; set; }

        public string Type { get; set; }

        public string WorkflowCode { get; set; }

        [StringLength(100)]
        public string CreatedBy { get; set; }

        public DateTime? CreatedTime { get; set; }

        [StringLength(100)]
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedTime { get; set; }

        [StringLength(100)]
        public string DeletedBy { get; set; }

        public DateTime? DeletedTime { get; set; }

        public bool IsDeleted { get; set; }
        public int? Level { get; set; }

        public string NestedWF { get; set; }
        public string RoleDefault { get; set; }
        public string ListGroupData { get; set; }
        public string Image { get; set; }
    }
}
