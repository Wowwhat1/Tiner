using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tiner.Data;
using Tiner.DTOs;
using Tiner.Entities;
using Tiner.Interfaces;

namespace Tiner.Controllers;

[Authorize]
public class UserController(IUserRepository userRepository, IMapper mapper) : BaseApiController {
    [HttpGet] // /api/user
    public async Task<ActionResult<IEnumerable<TinerDto>>> GetUsers() {
        var users = await userRepository.GetTinerAsync();

        return Ok(users);
    }

    [HttpGet("{username}")] // /api/user/{id}
    public async Task<ActionResult<TinerDto>> GetUser(string username)
    {
        var user = await userRepository.GetTinerByNameAsync(username);

        if (user == null)
        {
            return NotFound();
        }

        return user;
    }

    [HttpPut] // /api/update
    public async Task<ActionResult> UpdateUser(TinerUpdateDto tinerUpdateDto)
    {
        var userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userName == null)
        {
            return BadRequest("User not found");
        }

        var user = await userRepository.GetUserByUsernameAsync(userName);
        if (user == null)
        {
            return BadRequest("User not found");
        }

        mapper.Map(tinerUpdateDto, user);

        if (await userRepository.SaveAsync())
        {
            return NoContent();
        }

        return BadRequest("Failed to update user");
    }
}