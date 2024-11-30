using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tiner.DTOs;
using Tiner.Entities;
using Tiner.Extensions;
using Tiner.Helpers;
using Tiner.Interfaces;

namespace Tiner.Controllers;

[Authorize]
public class MessagesController(IUnitOfWork unitOfWork, IMapper mapper) : BaseApiController {
    [HttpPost] 
    public async Task<ActionResult<MessageDto>> CreateMes (CreateMessDto createMessDto) {
        var username = User.GetUsername();

        if (username == createMessDto.ReceiverUsername.ToLower()) return BadRequest("You cannot send messages to yourself");

        var sender = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
        var receiver = await unitOfWork.UserRepository.GetUserByUsernameAsync(createMessDto.ReceiverUsername);

        if (receiver == null || sender == null || sender.UserName == null || receiver.UserName == null) 
            return BadRequest("Cannot send message now");

        var message = new Message {
            Sender = sender,
            Receiver = receiver,
            SenderUsername = sender.UserName,
            ReceiverUsername = receiver.UserName,
            Content = createMessDto.Content
        };

        unitOfWork.MessageRepository.AddMessage(message);

        if (await unitOfWork.Complete()) return Ok(mapper.Map<MessageDto>(message));

        return BadRequest("Failed to send message");
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams) {
        messageParams.Username = User.GetUsername();

        var messages = await unitOfWork.MessageRepository.GetMessagesForUser(messageParams);

        Response.AddPaginationHeader(messages);

        return messages;
    }

    [HttpGet("thread/{receiverUsername}")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string receiverUsername) {
        var curUsername = User.GetUsername();

        var messages = await unitOfWork.MessageRepository.GetMessageThread(curUsername, receiverUsername);

        return Ok(messages);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(int id) {
        var username = User.GetUsername();

        var message = await unitOfWork.MessageRepository.GetMessage(id);

        if (message == null) return BadRequest("Message not found");
        if (message.SenderUsername != username && message.ReceiverUsername != username) return Forbid();
        if(message.SenderUsername == username) message.IsSenderDeleted = true;
        if(message.ReceiverUsername == username) message.IsReceiverDeleted = true;

        if (message is {IsSenderDeleted: true, IsReceiverDeleted: true}) unitOfWork.MessageRepository.DelMessage(message);

        if (await unitOfWork.Complete()) return Ok();

        return BadRequest("Cannot delete message!");
    }
}