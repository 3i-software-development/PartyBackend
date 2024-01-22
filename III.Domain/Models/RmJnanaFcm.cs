﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace ESEIM.Models
{
    [Table("RM_JNANA_FCM")]
    public class RmJnanaFcm
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int UserId { get; set; }
        [StringLength(maximumLength: 250)]
        public string Token { get; set; }
    }
}