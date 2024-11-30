using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Tiner.DTOs;
using Tiner.Entities;
using Tiner.Extensions;
using Tiner.Helpers;
using Tiner.Interfaces;

namespace Tiner.Controllers;

public class MatchController(IUnitOfWork unitOfWork) : BaseApiController {
    [HttpPost("{targetUserId:int}")]
    public async Task<ActionResult> ToggleMatch(int targetUserId)
    {
        var srcUserId = User.GetUserId();
        
        if (srcUserId == targetUserId) return BadRequest("You cannot match with yourself");

        var existMatch = await unitOfWork.MatchedRepository.GetMatchedUser(srcUserId, targetUserId);

        if (existMatch == null)
        {
            var matchedUser = new MatchedUser
            {
                SrcUserId = srcUserId,
                TargetUserId = targetUserId
            };

            unitOfWork.MatchedRepository.AddMatch(matchedUser);
        } else {
            unitOfWork.MatchedRepository.DeleteMatch(existMatch);
        }

        if (await unitOfWork.Complete())
        {
            return Ok();
        }

        return BadRequest("Failed to toggle match");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<int>>> GetCurUserMatchIds()
    {
        return Ok(await unitOfWork.MatchedRepository.GetCurrentUserMatchedIds(User.GetUserId()));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TinerDto>>> GetMatchedUsers([FromQuery]MatchParams matchParams)
    {
        matchParams.UserId = User.GetUserId();
        var users = await unitOfWork.MatchedRepository.GetMatchedUsers(matchParams);

        Response.AddPaginationHeader(users);

        return Ok(users);
    }
}