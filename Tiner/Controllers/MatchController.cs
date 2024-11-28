using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Tiner.DTOs;
using Tiner.Entities;
using Tiner.Extensions;
using Tiner.Helpers;
using Tiner.Interfaces;

namespace Tiner.Controllers;

public class MatchController(IMatchedRepository matchedRepository) : BaseApiController {
    [HttpPost("{targetUserId:int}")]
    public async Task<ActionResult> ToggleMatch(int targetUserId)
    {
        var srcUserId = User.GetUserId();
        
        if (srcUserId == targetUserId) return BadRequest("You cannot match with yourself");

        var existMatch = await matchedRepository.GetMatchedUser(srcUserId, targetUserId);

        if (existMatch == null)
        {
            var matchedUser = new MatchedUser
            {
                SrcUserId = srcUserId,
                TargetUserId = targetUserId
            };

            matchedRepository.AddMatch(matchedUser);
        } else {
            matchedRepository.DeleteMatch(existMatch);
        }

        if (await matchedRepository.SaveChanges())
        {
            return Ok();
        }

        return BadRequest("Failed to toggle match");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<int>>> GetCurUserMatchIds()
    {
        return Ok(await matchedRepository.GetCurrentUserMatchedIds(User.GetUserId()));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TinerDto>>> GetMatchedUsers([FromQuery]MatchParams matchParams)
    {
        matchParams.UserId = User.GetUserId();
        var users = await matchedRepository.GetMatchedUsers(matchParams);

        Response.AddPaginationHeader(users);

        return Ok(users);
    }
}