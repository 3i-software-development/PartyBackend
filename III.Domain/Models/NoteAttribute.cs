using System;
using System.Reflection;

namespace ESEIM.Models
{
    [AttributeUsage(AttributeTargets.Property)]
    public class NoteAttribute : Attribute
    {
        public string Note { get; }

        public NoteAttribute(string note)
        {
            Note = note;
        }
    }

}