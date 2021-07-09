using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web2.Models
{
	public class User : IdentityUser
	{
        //public byte[] ImageUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Role { get; set; }
        public string Status { get; set; }
        public DateTime Birthday { get; set; }
        public Team Team { get; set; }
        public virtual ICollection<WorkRequest> WorkRequests { get; set; }
        public User() 
        {
            WorkRequests = new HashSet<WorkRequest>();
        }
    }
}
