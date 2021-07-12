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
        [Route("get/{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Get(int id)
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

                var workRequest = (await unitOfWork.WorkRequestRepository.Get(w => w.WorkRequestId == id, null, "CreatedBy,StateChanges")).FirstOrDefault();

                if (user.Id != workRequest.CreatedBy.Id)
                {
                    return Unauthorized();
                }

                var stateChanges = new List<object>();
				foreach (var item in workRequest.StateChanges)
				{
                    stateChanges.Add(new { 
                        id = item.StateChangeId,
                        changedate = item.ChangeDate,
                        state = item.State
                    });
				}

                return Ok(new { 
                    id = workRequest.WorkRequestId,
                    type = workRequest.Type,
                    status = workRequest.Status,
                    incident = workRequest.Incident,
                    startdate = workRequest.StartDate.ToString(),
                    enddate = workRequest.EndDate.ToString(),
                    phone = workRequest.Phone,
                    createdby = workRequest.CreatedBy.Id,
                    purpose = workRequest.Purpose,
                    details = workRequest.Details,
                    notes = workRequest.Notes,
                    company = workRequest.Company,
                    createddate = workRequest.CreatedDate,
                    emergency = workRequest.EmergencyWork.ToString(),
                    statechanges = stateChanges
                });
            }
            catch (Exception)
            {
                return StatusCode(500, "Failed to return work request");
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
                        startdate = item.StartDate.ToString("d"),
                        phone = item.Phone,
                        status = item.Status,
                        address = item.CreatedBy.Address,
                        createdby = item.CreatedBy.Id
                    });
                }
                return Ok(workRequestsToReturn);
            }
            catch (Exception)
            {
                return StatusCode(500, "Failed to return all work requests");
            }
        }

        [HttpGet]
        [Route("get-mine")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetMine()
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

                var allWorkRequests = await unitOfWork.WorkRequestRepository.Get(x => x.CreatedBy.Id == userId, null, "CreatedBy");
                var workRequestsToReturn = new List<object>();

                foreach (var item in allWorkRequests)
                {
                    workRequestsToReturn.Add(new
                    {
                        id = item.WorkRequestId,
                        startdate = item.StartDate.ToString("d"),
                        phone = item.Phone,
                        status = item.Status,
                        address = item.CreatedBy.Address,
                        createdby = item.CreatedBy.Id
                    });
                }
                return Ok(workRequestsToReturn);
            }
            catch (Exception)
            {
                return StatusCode(500, "Failed to return all work requests");
            }
        }

        [HttpDelete]
        [Route("delete/{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Delete(int id)
        {
            if (String.IsNullOrEmpty(id.ToString()))
            {
                return BadRequest();
            }
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;

                string userRole = User.Claims.First(c => c.Type == "Roles").Value;

                var user = await unitOfWork.UserManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var workRequest = await unitOfWork.WorkRequestRepository.GetByID(id);
                user.WorkRequests.Remove(workRequest);

                if (user.Id != workRequest.CreatedBy.Id)
				{
                    return Unauthorized();
				}

                var stateChanges = await unitOfWork.StateChangeRepository.Get(x => x.WorkRequest.WorkRequestId == id);

                try
                {
                    unitOfWork.UserRepository.Update(user);
                    unitOfWork.WorkRequestRepository.Delete(workRequest);
					foreach (var item in stateChanges)
					{
                        unitOfWork.StateChangeRepository.Delete(item);
					}
                    await unitOfWork.Commit();
                }
                catch (Exception)
                {

                    return StatusCode(500, "Failed to delete work request. One of transaction failed");

                }

                return Ok(new { message = "Success" });
            }
            catch (Exception)
            {
                return StatusCode(500, "Failed to delete work request");
            }

        }

        [HttpPatch]
        [Route("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Update(int id, WorkRequest dto)
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

                var user = await unitOfWork.UserManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var workRequest = (await unitOfWork.WorkRequestRepository.Get(w => w.WorkRequestId == id, null, "CreatedBy")).FirstOrDefault();

                if (userId != workRequest.CreatedBy.Id)
				{
                    return Unauthorized();
				}

                workRequest.Type = dto.Type;
                workRequest.Status = dto.Status;
                workRequest.Incident = dto.Incident;
                workRequest.StartDate = dto.StartDate;
                workRequest.EndDate = dto.EndDate;
                workRequest.Purpose = dto.Purpose;
                workRequest.Notes = dto.Notes;
                workRequest.Details = dto.Details;
                workRequest.Phone = dto.Phone;
                workRequest.EmergencyWork = dto.EmergencyWork;
                workRequest.Company = dto.Company;

                try
                {
                    unitOfWork.UserRepository.Update(user);
                    unitOfWork.WorkRequestRepository.Update(workRequest);
                    await unitOfWork.Commit();
                }
                catch (Exception)
                {

                    return StatusCode(500, "Failed to update work request. One of transaction failed");

                }

                return Ok(new { message = "Success" });
            }
            catch (Exception)
            {
                return StatusCode(500, "Failed to update work request");
            }

        }
    }
}
