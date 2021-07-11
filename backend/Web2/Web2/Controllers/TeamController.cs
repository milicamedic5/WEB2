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
	public class TeamController : Controller
	{
		private IUnitOfWork unitOfWork;
		public TeamController(IUnitOfWork _unitOfWork)
		{
			unitOfWork = _unitOfWork;
		}

        [HttpPost]
        [Route("add")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AddTeam(TeamDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;

                string userRole = User.Claims.First(c => c.Type == "Roles").Value;

                if (!userRole.Equals("Admin"))
                {
                    return Unauthorized();
                }

                var user = await unitOfWork.UserManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found"});
                }

                List<User> members = new List<User>();
				foreach (var memberId in dto.MembersIds)
				{
                    var member = (await unitOfWork.UserRepository.Get(u => u.Id == memberId)).FirstOrDefault();

                    if (member == null)
					{
                        return BadRequest(new { message = "Couldn't add user to team" });
					}

                    if (member.Team != null)
					{
                        return BadRequest(new { message = "Selected user already has team" });
                    }

                    members.Add(member);
				}

                var team = new Team()
                {
                    Name = dto.Name,
                    Members = members
                };

                try
				{
                    await unitOfWork.TeamRepository.Insert(team);
					foreach (var member in members)
					{
                        unitOfWork.UserRepository.Update(member);
					}

                    await unitOfWork.Commit();
				} catch(Exception)
				{
                    return StatusCode(500, "Failed to add team. One of transactions failed.");
                }

                return Ok(new { team});
            }
            catch (Exception)
            {
                return StatusCode(500, "Failed to add team");
            }
        }

		[HttpGet]
		[Route("get-all")]
		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> GetAll()
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

				var allTeams = await unitOfWork.TeamRepository.Get(null, null, "Members");
				var teamsToReturn = new List<object>();

				foreach (var item in allTeams)
				{
					var teamMembers = new List<object>();
					foreach (var teamMember in item.Members)
					{
						teamMembers.Add(new
						{ 
                            id = teamMember.Id,
							firstname = teamMember.FirstName,
							lastname = teamMember.LastName,
							email = teamMember.Email
						});
					}
					teamsToReturn.Add(new
					{
						id = item.TeamId,
						name = item.Name,
						members = teamMembers
					});
				}
				return Ok(teamsToReturn);
			}
			catch (Exception)
			{
				return StatusCode(500, "Failed to return all teams");
			}
		}

		[HttpGet]
		[Route("get/{id}")]
		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> Get(int id)
		{
			if (String.IsNullOrEmpty(id.ToString()))
			{
				return BadRequest();
			}
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

				var team = (await unitOfWork.TeamRepository.Get(team => team.TeamId == id, null, "Members")).FirstOrDefault();
				var teamMembers = new List<object>();
				foreach (var teamMember in team.Members)
				{
					teamMembers.Add(new
					{
						id = teamMember.Id,
						firstname = teamMember.FirstName,
						lastname = teamMember.LastName,
						email = teamMember.Email
					});
				}
				var retVal = new
				{
					id = team.TeamId,
					name = team.Name,
					members = teamMembers
				};
				return Ok(retVal);
			}
			catch (Exception)
			{
				return StatusCode(500, "Failed to return all teams");
			}
		}

		[HttpGet]
		[Route("get-other/{id}")]
		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> GetOther(int id)
		{
			if (String.IsNullOrEmpty(id.ToString()))
			{
				return BadRequest();
			}
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

				var team = (await unitOfWork.TeamRepository.Get(team => team.TeamId == id, null, "Members")).FirstOrDefault();
				var allUsers = await unitOfWork.UserRepository.Get(null, null, "Team");
				var users = new List<object>();
				foreach (var item in allUsers)
				{
					if (!team.Members.Contains(item) && item.Role == "Clan ekipe" && item.Team == null && item.Status == "Approved")
					{
						users.Add(new
						{
							id = item.Id,
							firstname = item.FirstName,
							lastname = item.LastName,
							email = item.Email
						});
					}
				}
				return Ok(users);
			}
			catch (Exception)
			{
				return StatusCode(500, "Failed to return all users");
			}
		}

		[HttpDelete]
        [Route("delete/{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeleteTeam(int id)
        {
            if (String.IsNullOrEmpty(id.ToString()))
            {
                return BadRequest();
            }
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;

                string userRole = User.Claims.First(c => c.Type == "Roles").Value;

                if (!userRole.Equals("Admin"))
                {
                    return Unauthorized();
                }

                var user = await unitOfWork.UserManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var users = await unitOfWork.UserRepository.Get(x => x.Team.TeamId == id);
				foreach (var item in users)
				{
                    item.Team = null;
				}
                var team = await unitOfWork.TeamRepository.GetByID(id);
                if (team == null)
				{
                    return NotFound(new { message = "Team not found" });
                }
                try
                {
					foreach (var item in users)
					{
                        unitOfWork.UserRepository.Update(item);
                    }
                    unitOfWork.TeamRepository.Delete(team);
                    await unitOfWork.Commit();
                }
                catch (Exception)
                {

                    return StatusCode(500, "Failed to delete team. One of transaction failed");

                }

                return Ok(new { message = "Success"});
            }
            catch (Exception)
            {
                return StatusCode(500, "Failed to delete team");
            }

        }

        [HttpPatch]
        [Route("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UpdateTeam(int id, TeamDto dto)
        {
            if (String.IsNullOrEmpty(id.ToString()))
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;

                string userRole = User.Claims.First(c => c.Type == "Roles").Value;

                if (!userRole.Equals("Admin"))
                {
                    return Unauthorized();
                }

                var user = await unitOfWork.UserManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var team = (await unitOfWork.TeamRepository.Get(t => t.TeamId == id, null, "Members")).FirstOrDefault();
                team.Name = dto.Name;
                var newMembers = new List<User>();
				foreach (var item in dto.MembersIds)
				{
                    var newMember = (await unitOfWork.UserRepository.Get(u => u.Id == item)).FirstOrDefault();
                    newMembers.Add(newMember);
				}

                var oldTeamMembers = new List<User>();
                foreach (var item in team.Members)
                {
                    if (!newMembers.Contains(item))
                    {
                        oldTeamMembers.Add(item);
                    }
                }
				foreach (var item in oldTeamMembers)
				{
                    item.Team = null;
				}
                foreach (var item in newMembers)
                {
                    item.Team = team;
                }

                try
                {
                    foreach (var item in oldTeamMembers)
                    {
                        unitOfWork.UserRepository.Update(item);
                    }
					foreach (var item in newMembers)
					{
                        unitOfWork.UserRepository.Update(item);
					}
                    team.Members = newMembers;
                    unitOfWork.TeamRepository.Update(team);
                    await unitOfWork.Commit();
                }
                catch (Exception)
                {

                    return StatusCode(500, "Failed to update team. One of transaction failed");

                }

                return Ok(new { message = "Success" });
            }
            catch (Exception)
            {
                return StatusCode(500, "Failed to update team");
            }

        }

    }
}
