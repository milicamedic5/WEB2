using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Web2.DTOs
{
	public class StateChangeDto
	{
		[Required]
		public string ChangeDate { get; set; }
		[Required]
		public string State { get; set; }
		[Required]
		public int WorkRequestId { get; set; }
	}
}
