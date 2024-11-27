using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tiner.Data;
using Tiner.DTOs;
using Tiner.Entities;
using Tiner.Extensions;
using Tiner.Interfaces;

namespace Tiner.Controllers;

[Authorize]
public class UserController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService) : BaseApiController {
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
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
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

    [HttpPost("add-photo")] // /api/user/add-photo
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile formFile) {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user == null)
        {
            return BadRequest("Cannot update profile");
        }

        var result = await photoService.AddPhotoAsync(formFile);

        if (result.Error != null)
        {
            return BadRequest(result.Error.Message);
        }   

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };

        user.Photos.Add(photo);

        if (await userRepository.SaveAsync())
        {
            return CreatedAtAction("GetUser", new { username = user.UserName }, mapper.Map<PhotoDto>(photo));
        }

        return BadRequest("Problem adding photo");
    }
}