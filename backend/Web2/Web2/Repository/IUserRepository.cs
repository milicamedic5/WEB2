using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web2.Models;

namespace Web2.Repository
{
	public interface IUserRepository: IGenericRepository<User>
	{
		Task<IEnumerable<User>> GetAllUsers();
		Task<IdentityResult> SendConfirmationMail(User user);
	}
}
