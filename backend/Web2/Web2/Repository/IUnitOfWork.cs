using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web2.Models;

namespace Web2.Repository
{
	public interface IUnitOfWork
	{
		UserManager<User> UserManager { get; }
		RoleManager<IdentityRole> RoleManager { get; }
		IAuthRepository AuthRepository { get; }
		IUserRepository UserRepository { get; }
		Task Commit();
		void Rollback();
	}
}
