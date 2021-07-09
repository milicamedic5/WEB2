using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web2.Data;
using Web2.Models;

namespace Web2.Repository
{
	public class UnitOfWork : IDisposable, IUnitOfWork
	{
		private DataContext context;
		private readonly UserManager<User> userManager;
		private readonly RoleManager<IdentityRole> roleManager;
		private readonly SignInManager<User> signInManager;

		private IAuthRepository authRepository;
		private IUserRepository userRepository;
		private ITeamRepository teamRepository;
		private IWorkRequestRepository workRequestRepository;

		public UnitOfWork(DataContext _context, RoleManager<IdentityRole> _roleManager,
			UserManager<User> _userManager, SignInManager<User> _signInManager)
		{
			this.context = _context;
			this.roleManager = _roleManager;
			this.userManager = _userManager;
			this.signInManager = _signInManager;
		}

		public IAuthRepository AuthRepository
		{
			get
			{
				return authRepository = authRepository ??
					new AuthRepository(this.userManager, this.roleManager);
			}
		}

		public IUserRepository UserRepository
		{
			get
			{
				return userRepository = userRepository ??
					new UserRepository(this.context);
			}
		}

		public ITeamRepository TeamRepository
		{
			get
			{
				return teamRepository = teamRepository ??
					new TeamRepository(this.context);
			}
		}

		public IWorkRequestRepository WorkRequestRepository
		{
			get
			{
				return workRequestRepository = workRequestRepository ??
					new WorkRequestRepository(this.context);
			}
		}

		public UserManager<User> UserManager
		{
			get => this.userManager;
		}

		public RoleManager<IdentityRole> RoleManager
		{
			get => this.roleManager;
		}

		public async Task Commit()
		{
			await context.SaveChangesAsync();
		}

		private bool disposed = false;

		protected virtual void Dispose(bool disposing)
		{
			if (!this.disposed)
			{
				if (disposing)
				{
					context.Dispose();
				}
			}
			this.disposed = true;
		}

		public void Dispose()
		{
			Dispose(true);
			GC.SuppressFinalize(this);
		}

		public void Rollback()
		{
			this.Dispose();
		}
	}
}
