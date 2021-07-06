using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Web2.DTOs
{
	public class LogInDto
	{
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public string IdToken { get; set; }

        public string UserId { get; set; }
        public string Token { get; set; }
    }
}
