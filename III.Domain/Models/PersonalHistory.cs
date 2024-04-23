using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ESEIM.Models
{
    [Table("PERSONAL_HISTORY")]
    public class PersonalHistory
    {
		[Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
        [Note("Từ")]
		public string Begin { get; set; }

        [Note("Đến")]
        public string End { get; set; }
        
        public string Content { get; set; }
        public string ProfileCode { get; set; }
        public string Place { get; set; }
        public string Type { get; set; }
        public bool IsDeleted { get; set; }
	}
}
