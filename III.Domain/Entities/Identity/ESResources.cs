﻿using System;
using System.Collections.Generic;

namespace Host.Entities
{
    public partial class ESResource
    {
        public ESResource()
        { 
            ESPrivileges = new HashSet<ESPrivilege>();
            ESResAttributes = new HashSet<ESResAttribute>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string Code { get; set; }
        public int? ParentId { get; set; }
        public string GroupResourceId { get; set; }
        public int? Ord { get; set; }
         
        public virtual ICollection<ESPrivilege> ESPrivileges { get; set; }
        public virtual ICollection<ESResAttribute> ESResAttributes { get; set; }
        public virtual ESResource Parent { get; set; }
        public virtual ICollection<ESResource> InverseParent { get; set; }
        public virtual ESGroupResource TypeNavigation { get; set; }
    }
}
