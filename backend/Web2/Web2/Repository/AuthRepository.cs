using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using Web2.Models;

namespace Web2.Repository
{
	public class AuthRepository : IAuthRepository
	{
        private readonly UserManager<User> userManager;
        private readonly RoleManager<IdentityRole> roleManager;

        public AuthRepository(UserManager<User> _userManager,
            RoleManager<IdentityRole> _roleManager = null)
        {
            userManager = _userManager;
            roleManager = _roleManager;
        }

        public async Task<User> GetUserById(string id)
        {
            return await userManager.FindByIdAsync(id);
        }
        public async Task<User> GetUser(string email)
        {
            var user = await userManager.FindByEmailAsync(email);

            return user;
        }

        public async Task<bool> CheckPassword(User user, string password)
        {
            return await userManager.CheckPasswordAsync(user, password);
        }

        public bool CheckPasswordMatch(string password, string confirmPassword)
        {
            return password.Equals(confirmPassword);
        }

        public async Task<User> GetUserByUserName(string username)
        {
            return await userManager.FindByNameAsync(username);
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await userManager.FindByEmailAsync(email);
        }

        public async Task<IList<string>> GetRoles(User user)
        {
            return await userManager.GetRolesAsync(user);
        }
        public async Task<IdentityResult> AddToRole(User user, string roleName)
        {
            IdentityResult createRoleRes = IdentityResult.Success;

            if (!await roleManager.RoleExistsAsync(roleName))
            {
                createRoleRes = await roleManager.CreateAsync(new IdentityRole(roleName));
            }

            if (!createRoleRes.Succeeded)
            {
                return IdentityResult.Failed(new IdentityError() { Code = "Cant create role" });
            }

            await userManager.AddToRoleAsync(user, roleName);

            return IdentityResult.Success;
        }

        public async Task<IdentityResult> RegisterUser(User user, string password)
        {
            return await userManager.CreateAsync(user, password);
        }

        private const string GoogleApiTokenInfoUrl = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={0}";

        public bool VerifyToken(string providerToken)
        {
            var httpClient = new HttpClient();
            var requestUri = new Uri(string.Format(GoogleApiTokenInfoUrl, providerToken));

            HttpResponseMessage httpResponseMessage;

            try
            {
                httpResponseMessage = httpClient.GetAsync(requestUri).Result;
            }
            catch (Exception ex)
            {
                return false;
            }

            if (httpResponseMessage.StatusCode != HttpStatusCode.OK)
            {
                return false;
            }

            var response = httpResponseMessage.Content.ReadAsStringAsync().Result;
            var googleApiTokenInfo = JsonConvert.DeserializeObject<GoogleApiTokenInfo>(response);

            return true;
        }
    }
}
