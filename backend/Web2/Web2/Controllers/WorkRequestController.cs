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
	public class WorkRequestController : Controller
	{
        private IUnitOfWork unitOfWork;
        public WorkRequestController(IUnitOfWork _unitOfWork)
        {
            unitOfWork = _unitOfWork;
        }

        [HttpPost]
        [Route("add")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AddWorkRequest(WorkRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;

                var user = await unitOfWork.UserManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                WorkRequest workRequest = new WorkRequest() { 
                    Type = dto.Type,
                    Status = dto.Status,
                    Incident = dto.Incident,
                    StartDate = Convert.ToDateTime(dto.StartDate),
                    EndDate = Convert.ToDateTime(dto.EndDate),
                    CreatedBy = user,
                    Purpose = dto.Purpose,
                    Details = dto.Details,
                    Notes = dto.Notes,
                    EmergencyWork = dto.EmergencyWork,
                    Company = dto.Company,
                    Phone = dto.Phone,
                    CreatedDate = Convert.ToDateTime(dto.CreatedDate)
                };

                user.WorkRequests.Add(workRequest);

                try
                {
                    await unitOfWork.WorkRequestRepository.Insert(workRequest);
                    unitOfWork.UserRepository.Update(user);

                    await unitOfWork.Commit();
                }
                catch (Exception)
                {
                    return StatusCode(500, "Failed to add work request. One of transactions failed.");
                }

                return Ok(new { workRequest});
            }
            catch (Exception)
            {
                return StatusCode(500, "Failed to add work request");
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

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var allWorkRequests = await unitOfWork.WorkRequestRepository.Get(null,null,"CreatedBy");
                var workRequestsToReturn = new List<object>();

                foreach (var item in allWorkRequests)
                {
                    workRequestsToReturn.Add(new
                    {
                        id = item.WorkRequestId,
                        startdate = item.StartDate.ToString("yyyy-mm-dd"),
                        phone = item.Phone,
                        status = item.Status,
                        address = item.CreatedBy.Address
                    });
                }
                return Ok(workRequestsToReturn);
            }
            catch (Exception)
            {
                return StatusCode(500, "Failed to return all work requests");
            }
        }
    }
}
