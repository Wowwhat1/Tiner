using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tiner.Data;
using Tiner.Entities;

namespace Tiner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase {

    private readonly ApplicationDbContext _context;

    public UserController(ApplicationDbContext context) {
        _context = context;
    }

    [HttpGet] // /api/user
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers() {
        var users = await _context.AppUsers.ToListAsync();

        return users;
    }

    [HttpGet("{id:int}")] // /api/user/{id}
    public async Task<ActionResult<AppUser>> GetUser(int id)
    {
        var user = await _context.AppUsers.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return user;
    }
}