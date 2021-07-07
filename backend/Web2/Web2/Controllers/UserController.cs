using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web2.DTOs;
using Web2.Models;
using Web2.Repository;

namespace Web2.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UserController : ControllerBase
	{
		private IUnitOfWork unitOfWork;
		public UserController(IUnitOfWork _unitOfWork)
		{
			unitOfWork = _unitOfWork;
		}

		[HttpGet]
		[Route("get-all")]
		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> GetAllUsers()
		{
			try
			{
				string userId = User.Claims.First(c => c.Type == "UserID").Value;
				var user = (User)await unitOfWork.UserManager.FindByIdAsync(userId);

				string userRole = User.Claims.First(c => c.Type == "Roles").Value;

				if (!userRole.Equals("Admin"))
				{
					return Unauthorized();
				}

				if (user == null)
				{
					return NotFound(new { message = "User not found" });
				}

				var allUsers = await unitOfWork.UserRepository.GetAllUsers();
				var usersToReturn = new List<object>();

				foreach (var item in allUsers)
				{
					var role = await unitOfWork.AuthRepository.GetRoles(item);
					if (role.Count == 0)
					{
						continue;
					}
					if (role.FirstOrDefault().Equals("Admin"))
					{
						continue;
					}

					usersToReturn.Add(new
					{
						email = item.Email,
						firstname = item.FirstName,
						lastname = item.LastName,
						id = item.Id,
						role = item.Role,
						status = item.Status
					});
				}
				return Ok(usersToReturn);
			}
			catch (Exception)
			{
				return StatusCode(500, "Failed to return all users");
			}
		}

		[HttpGet]
		[Route("get-team-members")]
		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> GetTeamMembers()
		{
			try
			{
				string userId = User.Claims.First(c => c.Type == "UserID").Value;
				var user = (User)await unitOfWork.UserManager.FindByIdAsync(userId);

				string userRole = User.Claims.First(c => c.Type == "Roles").Value;

				if (!userRole.Equals("Admin"))
				{
					return Unauthorized();
				}

				if (user == null)
				{
					return NotFound(new { message = "User not found" });
				}

				var allUsers = await unitOfWork.UserRepository.Get(x => x.Role == "Clan ekipe" && x.Team == null && x.Status == "Approved");
				var usersToReturn = new List<object>();

				foreach (var item in allUsers)
				{
					usersToReturn.Add(new
					{
						email = item.Email,
						firstname = item.FirstName,
						lastname = item.LastName,
						id = item.Id,
						role = item.Role,
						status = item.Status
					});
				}
				return Ok(usersToReturn);
			}
			catch (Exception)
			{
				return StatusCode(500, "Failed to return all users");
			}
		}

		[HttpPost]
		[Route("set-status")]
		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> SetUserStatus([FromBody] SetStatusDto dto)
		{

			try
			{
				string userId = User.Claims.First(c => c.Type == "UserID").Value;
				var user = (User)await unitOfWork.UserManager.FindByIdAsync(userId);

				string userRole = User.Claims.First(c => c.Type == "Roles").Value;

				if (!userRole.Equals("Admin"))
				{
					return Unauthorized();
				}

				if (user == null)
				{
					return NotFound(new { message = "User not found" });
				}

				var userToUpdate = await unitOfWork.UserRepository.GetByID(dto.UserId);
				if (userToUpdate == null)
				{
					return NotFound(new { message = "User not found." });
				}

				userToUpdate.Status = dto.Status;

				try
				{
					unitOfWork.UserRepository.Update(userToUpdate);
					await unitOfWork.Commit();
				} catch(Exception)
				{
					return StatusCode(500, "Failed to change status. One of transactions failed");
				}

				try
				{
					var emailSent = await unitOfWork.UserRepository.SendConfirmationMail(userToUpdate);
				}
				catch (Exception)
				{
					return StatusCode(500, "Sending email failed.");
				}

				return Ok(new { userToUpdate});
			}
			catch (Exception)
			{
				return StatusCode(500, "Failed to update users status");
			}
		}
	}
}
