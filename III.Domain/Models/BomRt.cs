using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ESEIM.Models
{
    [Table("BOM_RT")]
    public class BomRt
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [StringLength(255)]
        public string ItemCode { get; set; }

        [StringLength(255)]
        public string ItemName { get; set; }

        public decimal Quantity { get; set; }

        [StringLength(255)]
        public string Unit { get; set; }

        [StringLength(255)]
        public string Specification { get; set; }

        [StringLength(255)]
        public string Io { get; set; }

        [StringLength(255)]
        public string ActivityCode { get; set; }

        [StringLength(255)]
        public string ShiftCode { get; set; }

        [StringLength(255)]
        public string WordOrderCode { get; set; }

        [StringLength(255)]
        public string ObjectType { get; set; }

        [StringLength(255)]
        public string ObjectCode { get; set; }

        [StringLength(255)]
        public string ParentId { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        public DateTime? CreatedTime { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedTime { get; set; }

        [StringLength(50)]
        public string DeletedBy { get; set; }

        public DateTime? DeletedTime { get; set; }

        public bool IsDeleted { get; set; }

    }
}
