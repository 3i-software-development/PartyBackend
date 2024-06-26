﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ESEIM.Models
{
    public class ApiScope
    {
        public ApiScope()
        {
            ApiScopeClaims = new HashSet<ApiScopeClaim>();
        }

        public int Id { get; set; }
        public int? ApiResourceId { get; set; }
        public string Description { get; set; }
        public string DisplayName { get; set; }
        public bool? Emphasize { get; set; }
        public string Name { get; set; }
        public bool? Required { get; set; }
        public bool? ShowInDiscoveryDocument { get; set; }

        public virtual ICollection<ApiScopeClaim> ApiScopeClaims { get; set; }
        public virtual ApiResource ApiResources { get; set; }
    }
}
