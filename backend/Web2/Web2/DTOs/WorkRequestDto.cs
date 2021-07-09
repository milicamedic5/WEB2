using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Web2.DTOs
{
	public class WorkRequestDto
	{
		[Required]
		public string Type { get; set; }
		[Required]
		public string Status { get; set; }
		[Required]
		public string Incident { get; set; }
		[Required]
		public string StartDate { get; set; }
		[Required]
		public string EndDate { get; set; }
		[Required]
		public string CreatedBy { get; set; }
		[Required]
		public string Purpose { get; set; }
		[Required]
		public string Details { get; set; }
		[Required]
		public string Notes { get; set; }
		[Required]
		public bool EmergencyWork { get; set; }
		[Required]
		public string Company { get; set; }
		[Required]
		public string Phone { get; set; }
		[Required]
		public string CreatedDate { get; set; }
	}
}
