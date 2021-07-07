using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Web2.DTOs
{
	public class TeamDto
	{
		[Required]
		public string Name { get; set; }
		[Required]
		public List<string> MembersIds { get; set; }
	}
}
