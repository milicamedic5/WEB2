using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web2.Models
{
	public class StateChange
	{
		public int StateChangeId { get; set; }
		public DateTime ChangeDate { get; set; }
		public string State { get; set; }
		public WorkRequest WorkRequest { get; set; }
	}
}
