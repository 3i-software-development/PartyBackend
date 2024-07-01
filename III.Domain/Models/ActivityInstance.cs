using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;
using System.Text;

namespace ESEIM.Models
{
    [Table("ACTIVITY_INSTANCE")]
    public class ActivityInstance
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        public string ActivityCode { get; set; }

        public string ActivityInstCode { get; set; }

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

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public string LogCountDown { get; set; }
        public string LockShare { get; set; }
        public string WfInstRelative { get; set; }
        public string JsonStatusLog { get; set; }

        [NotMapped]
        public string sStartTime { get; set; }

        [NotMapped]
        public string sEndTime { get; set; }
    }
    
    public class ActGrid
    {
        public string ActName { get; set; }
        public string ActStatus { get; set; }
        public int Id { get; set; }
        public bool IsLock { get; set; }
        public bool IsApprovable { get; set; }
        public int Level { get; set; }
        public string ActivityInstCode { get; set; }
        public string ActType { get; set; }
        public bool IsInstance { get; set; }
        public string ObjectCode { get; set; }
        public string JsonStatusLog { get; set; }
        public LogStatus Log { get; set; }
        public string StatusCode { get; set; }
    }
    public class LogStatus
    {
        public string Content { get; set; }
        public string Status { get; set; }
        public string CreatedBy { get; set; }
        public bool Lock { get; set; }
        public DateTime CreatedTime
        {
            get
            {
                return !String.IsNullOrEmpty(sCreatedTime) ? DateTime.ParseExact(sCreatedTime, "HH:mm dd/MM/yyyy", CultureInfo.InvariantCulture) : new DateTime();
            }
            set
            {
                sCreatedTime = value.ToString("HH:mm dd/MM/yyyy");
            }
        }
        public string sCreatedTime { get; set; }
    }
}
