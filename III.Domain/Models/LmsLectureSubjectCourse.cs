//------------------------------------------------------------------------------
// <auto-generated>
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace ESEIM.Models
{
    [Table("LMS_LECTURE_SUBJECT_COURSE")]
    public class LmsLectureSubjectCourse
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string LectureCode { get; set; }
        public string SubjectCode { get; set; }
        public string CourseCode { get; set; }
    }
}

