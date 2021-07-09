using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web2.Data;
using Web2.Models;

namespace Web2.Repository
{
	public class WorkRequestRepository : GenericRepository<WorkRequest>, IWorkRequestRepository
	{
		public WorkRequestRepository(DataContext context) : base(context) { }
	}
}
