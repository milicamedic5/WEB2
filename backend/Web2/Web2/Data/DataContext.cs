using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web2.Models;

namespace Web2.Data
{
	public class DataContext : IdentityDbContext
	{
		public DataContext(DbContextOptions<DataContext> options) : base(options) { }
		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<Team>().HasMany(t => t.Members).WithOne(u => u.Team);
			modelBuilder.Entity<User>().HasMany(u => u.WorkRequests).WithOne(w => w.CreatedBy);
			base.OnModelCreating(modelBuilder);
		}
		public DbSet<User> Users { get; set; }
		public DbSet<Team> Teams { get; set; }
		public DbSet<WorkRequest> WorkRequests { get; set; }
	}
}
