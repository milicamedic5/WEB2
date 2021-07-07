using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web2.Data;
using Web2.Models;

namespace Web2.Repository
{
	public class TeamRepository : GenericRepository<Team>, ITeamRepository
	{
		public TeamRepository(DataContext context) : base(context) { }
	}
}
