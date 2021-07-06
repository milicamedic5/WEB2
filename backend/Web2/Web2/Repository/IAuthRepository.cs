using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web2.Models;

namespace Web2.Repository
{
	public interface IAuthRepository
	{
		Task<IdentityResult> RegisterUser(User user, string password);
		Task<IList<string>> GetRoles(User user);
		Task<IdentityResult> AddToRole(User user, string roleName);
		Task<User> GetUser(string email);
		Task<bool> CheckPassword(User user, string password);
		bool CheckPasswordMatch(string password, string confirmPassword);
		Task<User> GetUserById(string id);
		Task<User> GetUserByUserName(string username);
		Task<User> GetUserByEmail(string email);
	}
}
