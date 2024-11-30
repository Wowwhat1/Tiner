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
using Tiner.Helpers;
using Tiner.Interfaces;

namespace Tiner.Controllers;

[Authorize]
public class UserController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService) : BaseApiController {
    [HttpGet] // /api/user
    public async Task<ActionResult<IEnumerable<TinerDto>>> GetUsers([FromQuery]UserParams userParams) {
        userParams.CurrentUsername = User.GetUsername();
        var users = await unitOfWork.UserRepository.GetTinerAsync(userParams);

        Response.AddPaginationHeader(users);

        return Ok(users);
    }

    [HttpGet("{username}")] // /api/user/{id}
    public async Task<ActionResult<TinerDto>> GetUser(string username)
    {
        var user = await unitOfWork.UserRepository.GetTinerByNameAsync(username);

        if (user == null)
        {
            return NotFound();
        }

        return user;
    }

    [HttpPut] // /api/update
    public async Task<ActionResult> UpdateUser(TinerUpdateDto tinerUpdateDto)
    {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null)
        {
            return BadRequest("User not found");
        }

        mapper.Map(tinerUpdateDto, user);

        if (await unitOfWork.Complete())
        {
            return NoContent();
        }

        return BadRequest("Failed to update user");
    }

    [HttpPost("add-photo")] // /api/user/add-photo
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile formFile) {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

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

        if (user.Photos.Count == 0)
        {
            photo.IsMain = true;
        }

        user.Photos.Add(photo);

        if (await unitOfWork.Complete())
        {
            return CreatedAtAction("GetUser", new { username = user.UserName }, mapper.Map<PhotoDto>(photo));
        }

        return BadRequest("Problem adding photo");
    }

    [HttpPut("set-main-photo/{photoId:int}")] // /api/user/set-main-photo/{photoId}
    public async Task<ActionResult> SetMainPhoto(int photoId) {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user == null)
        {
            return BadRequest("Cannot find images");
        }

        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

        if (photo == null || photo.IsMain)
        {
            return BadRequest("This is already your main photo");
        }

        var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
        if (currentMain != null)
        {
            currentMain.IsMain = false;
        }
        photo.IsMain = true;

        if (await unitOfWork.Complete())
        {
            return NoContent();
        }

        return BadRequest("Failed to set main photo");
    }

    [HttpDelete("delete-photo/{photoId:int}")] // /api/user/delete-photo/{photoId}
    public async Task<ActionResult> DeletePhoto(int photoId) {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user == null)
        {
            return BadRequest("Cannot find images");
        }

        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

        if (photo == null)
        {
            return NotFound();
        }

        if (photo.IsMain)
        {
            return BadRequest("You cannot delete your main photo");
        }

        if (photo.PublicId != null)
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }
        }

        user.Photos.Remove(photo);

        if (await unitOfWork.Complete())
        {
            return Ok();
        }

        return BadRequest("Failed to delete photo");
    }
}