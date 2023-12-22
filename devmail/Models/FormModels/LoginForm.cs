using System.ComponentModel.DataAnnotations;

namespace gettmail_final.Models.FormModels
{
    public class LoginForm
    {
        [Required]
        public string EmailorUsername { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
