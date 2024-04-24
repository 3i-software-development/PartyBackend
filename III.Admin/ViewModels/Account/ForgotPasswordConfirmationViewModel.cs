using System.ComponentModel.DataAnnotations;

namespace III.Admin.ViewModels.Account
{
    public class ForgotPasswordConfirmationViewModel
    {
        [Required]
        public string Otp { get; set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public string UserName { get; set; }
    }
}
