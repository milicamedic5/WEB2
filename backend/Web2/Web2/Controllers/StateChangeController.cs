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
	public class StateChangeController : Controller
	{
        private IUnitOfWork unitOfWork;
        public StateChangeController(IUnitOfWork _unitOfWork)
        {
            unitOfWork = _unitOfWork;
        }

        [HttpPost]
        [Route("add")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Add(StateChangeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;

                string userRole = User.Claims.First(c => c.Type == "Roles").Value;

                var workRequest = (await unitOfWork.WorkRequestRepository.Get(w => w.WorkRequestId == dto.WorkRequestId, null, "StateChanges,CreatedBy")).FirstOrDefault();
                if (workRequest.CreatedBy.Id != userId)
                {
                    return Unauthorized();
                }

                var stateChange = new StateChange()
                {
                    ChangeDate = Convert.ToDateTime(dto.ChangeDate),
                    State = dto.State,
                    WorkRequest = workRequest,
                };

                workRequest.StateChanges.Add(stateChange);

                try
                {
                    unitOfWork.WorkRequestRepository.Update(workRequest);
                    await unitOfWork.StateChangeRepository.Insert(stateChange);

                    await unitOfWork.Commit();
                }
                catch (Exception)
                {
                    return StatusCode(500, "Failed to add state change. One of transactions failed.");
                }

                return Ok(new { stateChange });
            }
            catch (Exception)
            {
                return StatusCode(500, "Failed to add state change");
            }
        }

        [HttpGet]
        [Route("get-mine/{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetMine(int id)
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

                var allStateChanges = await unitOfWork.StateChangeRepository.Get(x => x.WorkRequest.WorkRequestId == id);
                var stateChangesToReturn = new List<object>();

                foreach (var item in allStateChanges)
                {
                    stateChangesToReturn.Add(new
                    {
                        id = item.StateChangeId,
                        startdate = item.ChangeDate.ToString("d"),
                        state = item.State
                    });
                }
                return Ok(stateChangesToReturn);
            }
            catch (Exception)
            {
                return StatusCode(500, "Failed to return all state changes");
            }
        }
    }
}
