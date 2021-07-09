using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web2.Models
{
	public class WorkRequest
	{
		public int WorkRequestId { get; set; }
		public string Type { get; set; }
		public string Status { get; set; }
		public string Incident { get; set; }
		public DateTime StartDate { get; set; }
		public DateTime EndDate { get; set; }
		public User CreatedBy { get; set; }
		public string Purpose { get; set; }
		public string Details { get; set; }
		public string Notes { get; set; }
		public bool EmergencyWork { get; set; }
		public string Company { get; set; }
		public string Phone { get; set; }
		public DateTime CreatedDate { get; set; }
	}
}
