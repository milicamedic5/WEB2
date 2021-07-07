using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web2.Models
{
	public class Team
	{
		public int TeamId { get; set; }
		public string Name { get; set; }
		public virtual ICollection<User> Members { get; set; }
		public Team() 
		{
			Members = new HashSet<User>();
		}
	}
}
