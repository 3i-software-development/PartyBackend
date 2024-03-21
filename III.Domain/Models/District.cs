using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace III.Domain.Models
{
    [Table("district")]
    public class District
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int districtId { get; set; }
        public int provinceId { get; set; }
        public string name { get; set; }
    }
}
