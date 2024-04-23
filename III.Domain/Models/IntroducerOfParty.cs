using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ESEIM.Models
{
	[Table("INTRODUCER_OF_PARTY")]
	public class IntroducerOfParty
	{
		[Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		[Note("Người giới thiệu")]
		[StringLength(maximumLength: 150)]
		public string PersonIntroduced { get; set; }
		[Note("Ngày và nơi vào Đoàn")]
		[StringLength(maximumLength: 150)]
		public string PlaceTimeJoinUnion { get; set; }

        [Note("Ngày và nơi vào Đảng lần thứ nhất")]
        [StringLength(maximumLength: 150)]
		public string PlaceTimeJoinParty { get; set; }
		
		[StringLength(maximumLength: 150)]

        [Note("Ngày và nơi công nhận chính thức lần đầu")]
        public string PlaceTimeRecognize { get; set; }

		public string ProfileCode {  get; set; }
		public bool IsDeleted { get; set; }


	}
}
