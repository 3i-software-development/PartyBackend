using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ESEIM.Models
{
	[Table("FAMILY")]
	public class Family
	{
		[Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		[Note("Thái độ chính trị")]
		[StringLength(maximumLength: 200)]
		public string PoliticalAttitude { get; set; }

		
		public string Relation { get; set; }

		
		public string ClassComposition { get; set; }

		[Note("Đảng viên")]
		public string PartyMember { get; set; }

		
		public string BirthYear { get; set; }

		[Note("Quê quán")]
		public string HomeTown { get; set; }

		[Note("Nơi ở hiện nay")]
		public string Residence { get; set; }

		[Note("Nghề nghiệp")]
		public string Job { get; set; }

		[Note("Quá trình công tác")]
		public string WorkingProgress { get; set; }


		public string Name { get; set; }

		public string ProfileCode { get; set; }
		public bool IsDeleted {  get; set; }

		[NotMapped]
		public bool die { get; set; }
        [NotMapped]
        public string wordAt { get; set; }
        [NotMapped]
        public string AddressDie { get; set; }
        [NotMapped]
        public string Party { get; set; }
        [NotMapped]
        public string Reason { get; set; }
        [NotMapped]
        public string MarriedStatus { get; set; }
        public string HomeTownVillage { get; set; }
        public string HomeTownValue { get; set; }
        public string HomeTownJson { get; set; }
        public string BirthPlace { get; set; }
    }
    public class FamilyModel 
    {
        public int Id { get; set; }

        [Note("Thái độ chính trị")]
        [StringLength(maximumLength: 200)]
        public string PoliticalAttitude { get; set; }


        public string Relation { get; set; }


        public string ClassComposition { get; set; }

        [Note("Đảng viên")]
        public string PartyMember { get; set; }


        public string BirthYear { get; set; }

        [Note("Quê quán")]
        public string HomeTown { get; set; }

        [Note("Nơi ở hiện nay")]
        public string Residence { get; set; }

        [Note("Nghề nghiệp")]
        public string Job { get; set; }

        [Note("Quá trình công tác")]
        public string WorkingProgress { get; set; }


        public string Name { get; set; }

        public string ProfileCode { get; set; }
        public string HomeTownVillage { get; set; }
        public string HomeTownValue { get; set; }
        public string HomeTownJson { get; set; }
        public string BirthPlace { get; set; }
    }
}

