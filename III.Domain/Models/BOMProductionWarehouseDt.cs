using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace III.Domain.Models
{
    [Table("BOM_PRODUCTION_WAREHOUSE_DT")]
    public class BOMProductionWarehouseDt
    {
        [Key]
        public int Id { get; set; }
        public string ItemCode { get; set; }
        public decimal? Quantity { get; set; }
        public string Unit { get; set; }
        public string Specification { get; set; }
        public string IO { get; set; }
        public string TicketCode { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedTime { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedTime { get; set; }
        public string DeletedBy { get; set; }
        public DateTime? DeletedTime { get; set; }
        public bool IsDeleted { get; set; }
    }

}
