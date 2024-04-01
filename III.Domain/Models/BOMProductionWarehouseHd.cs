using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace III.Domain.Models
{
    [Table("BOM_PRODUCTION_WAREHOUSE_HD")]
    public class BOMProductionWarehouseHd
    {
        [Key]
        public int Id { get; set; }
        public string TicketCode { get; set; }
        public string Status { get; set; }
        public string DeliverId { get; set; }
        public string ReceiverId { get; set; }
        public string ActivityCode { get; set; }
        public string TypeImpExp { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedTime { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedTime { get; set; }
        public string DeletedBy { get; set; }
        public DateTime? DeletedTime { get; set; }
        public string DeletionToken { get; set; }
        public bool IsDeleted { get; set; }
        public string Flag { get; set; }
    }

}
