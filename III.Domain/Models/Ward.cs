using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace III.Domain.Models
{
    [Table("wards")]
    public class Ward
    {
        [Key]
        public int wardsId { get; set; }
        public int districtId { get; set; }
        public string name { get; set; }
    }
}
