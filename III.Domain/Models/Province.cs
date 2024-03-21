using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace III.Domain.Models
{
    [Table("PROVINCE")]
    public class Province
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int provinceId { get; set; }

        public string name { get; set; }


    }
}
