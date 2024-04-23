using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESEIM.Models
{
    [Table("WORKING_TRACKING")]
    public class WorkingTracking
    {
		[Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
        [Note("Từ")]
		public string From { get; set; }
        [Note("Đến")]
        public string To { get; set; }
        [Note("Công việc")]
        [MaxLength(200)]
        public string Work { get; set; }
        [Note("Chức vụ")]
        [MaxLength(50)]
        public string Role { get; set; }
		public string ProfileCode { get; set; }
        public bool IsDeleted { get; set; }
	}
}
