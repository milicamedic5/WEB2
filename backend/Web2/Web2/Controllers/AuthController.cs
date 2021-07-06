using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Web2.DTOs;
using Web2.Models;
using Web2.Repository;

namespace Web2
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : Controller
	{
		private readonly IConfiguration configuration;
		private readonly SignInManager<User> _signInManager;
		private IUnitOfWork unitOfWork;

		public AuthController(SignInManager<User> signInManager, IConfiguration config, IUnitOfWork _unitOfWork)
		{
			this._signInManager = signInManager;
			this.configuration = config;
			this.unitOfWork = _unitOfWork;
		}

		[HttpPost("signup")]
		public async Task<IActionResult> SignUp([FromForm] SignUpDto userDto)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			User createUser;

			try
			{
				if ((await unitOfWork.AuthRepository.GetUserByEmail(userDto.Email)) != null)
				{
					return BadRequest(new { message = "User with that email already exists!" });
				}

				if (!unitOfWork.AuthRepository.CheckPasswordMatch(userDto.Password, userDto.ConfirmPassword))
				{
					return BadRequest(new { message = "Passwords dont match" });
				}

				createUser = new User()
				{
					Email = userDto.Email,
					Role = userDto.Role,
					FirstName = userDto.FirstName,
					LastName = userDto.LastName,
					UserName = userDto.Email,
					Birthday = Convert.ToDateTime(userDto.Birthday),
					Address = userDto.Address,
					Status = "Waiting"
				};
			}
			catch (Exception e)
			{
				return StatusCode(500, "Registration failed.");
			}

			if (userDto.Email == "admin@gmail.com")
			{
				try
				{
					await unitOfWork.AuthRepository.RegisterUser(createUser, userDto.Password);
					await unitOfWork.AuthRepository.AddToRole(createUser, "Admin");

					await unitOfWork.Commit();
				}
				catch (Exception e)
				{
					return StatusCode(500, "Registration failed.");
				}
			} else
			{
				try
				{
					await unitOfWork.AuthRepository.RegisterUser(createUser, userDto.Password);
					await unitOfWork.AuthRepository.AddToRole(createUser, "RegularUser");

					await unitOfWork.Commit();
				}
				catch (Exception e)
				{
					return StatusCode(500, "Registration failed.");
				}
			}
			//try
			//{
			//	var emailSent = await unitOfWork.AuthRepository.SendConfirmationMail(createUser, "user");
			//}
			//catch (Exception)
			//{
			//	return StatusCode(500, "Sending email failed.");
			//}
			return Ok(new { createUser});
		}

		[HttpPost]
		[Route("login")]
		public async Task<IActionResult> Login([FromBody] LogInDto loginUser)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				var user = await this.unitOfWork.AuthRepository.GetUser(loginUser.Email);

				if (user == null)
				{
					return NotFound(new { message = "Email doesn't exist" });
				}

				var isPasswordCorrect = await this.unitOfWork.AuthRepository.CheckPassword(user, loginUser.Password);

				if (!isPasswordCorrect)
				{
					return BadRequest(new { message = "Email or password is incorrect" });
				}

				var role = (await unitOfWork.AuthRepository.GetRoles(user)).FirstOrDefault();

				if (user.Status == "Waiting" && role != "Admin")
				{
					return BadRequest(new { message = "You are not approved by admin yet. Soon you will be notified about your status changes." });
				}

				if (user.Status == "Denied" && role != "Admin")
				{
					return BadRequest(new { message = "Sorry, your account was denied from access to application." });
				}

				var tokenDescriptor = new SecurityTokenDescriptor
				{
					Subject = new ClaimsIdentity(new Claim[]
					{
						new Claim("UserID",user.Id.ToString()),
						new Claim("Roles", role)
						//new Claim("PasswordChanged", user.PasswordChanged.ToString())
		                //new Claim("EmailConfirmed", user.EmailConfirmed.ToString())
		            }),
					Expires = DateTime.UtcNow.AddDays(1),
					SigningCredentials = new SigningCredentials(
						new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("AppSettings:Token").Value)),
							SecurityAlgorithms.HmacSha256Signature)
				};

				var tokenHandler = new JwtSecurityTokenHandler();
				var securityToken = tokenHandler.CreateToken(tokenDescriptor);
				var token = tokenHandler.WriteToken(securityToken);

				var userId = user.Id.ToString();

				return Ok(new { userId, token, role });
			}
			catch (Exception)
			{
				return StatusCode(500, "Login failed.");
			}
		}
	}
}
