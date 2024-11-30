using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tiner.Data;
using Tiner.Entities;

namespace Tiner.Controllers;

public class BugController(ApplicationDbContext context) : BaseApiController
{
    [Authorize]
    [HttpGet("auth")]
    public ActionResult<string> GetAuth()
    {
        return "text";
    }

    [HttpGet("not-found")]
    public ActionResult<AppUser> GetNotFound()
    {
        var thing = context.Users.Find(-1);

        if (thing == null) return NotFound();

        return thing;
    }

    [HttpGet("server-error")]
    public ActionResult<AppUser> GetServerError()
    {
        var thing = context.Users.Find(-1) ?? throw new Exception("Server Error");

        return thing;
    }

    [HttpGet("bad-request")]
    public ActionResult<string> GetBadReq()
    {
        return BadRequest("This was not a good request");
    }
}