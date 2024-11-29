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
public class MessagesController(IMessageRepository messageRepository, IUserRepository userRepository, IMapper mapper) : BaseApiController {
    [HttpPost] 
    public async Task<ActionResult<MessageDto>> CreateMes (CreateMessDto createMessDto) {
        var username = User.GetUsername();

        if (username == createMessDto.ReceiverUsername.ToLower()) return BadRequest("You cannot send messages to yourself");

        var sender = await userRepository.GetUserByUsernameAsync(username);
        var receiver = await userRepository.GetUserByUsernameAsync(createMessDto.ReceiverUsername);

        if (receiver == null || sender == null) return BadRequest("Cannot send message now");

        var message = new Message {
            Sender = sender,
            Receiver = receiver,
            SenderUsername = sender.UserName,
            ReceiverUsername = receiver.UserName,
            Content = createMessDto.Content
        };

        messageRepository.AddMessage(message);

        if (await messageRepository.SaveAllAsync()) return Ok(mapper.Map<MessageDto>(message));

        return BadRequest("Failed to send message");
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams) {
        messageParams.Username = User.GetUsername();

        var messages = await messageRepository.GetMessagesForUser(messageParams);

        Response.AddPaginationHeader(messages);

        return messages;
    }

    [HttpGet("thread/{receiverUsername}")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string receiverUsername) {
        var curUsername = User.GetUsername();

        var messages = await messageRepository.GetMessageThread(curUsername, receiverUsername);

        return Ok(messages);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(int id) {
        var username = User.GetUsername();

        var message = await messageRepository.GetMessage(id);

        if (message == null) return BadRequest("Message not found");
        if (message.SenderUsername != username && message.ReceiverUsername != username) return Forbid();
        if(message.SenderUsername == username) message.IsSenderDeleted = true;
        if(message.ReceiverUsername == username) message.IsReceiverDeleted = true;

        if (message is {IsSenderDeleted: true, IsReceiverDeleted: true}) messageRepository.DelMessage(message);

        if (await messageRepository.SaveAllAsync()) return Ok();

        return BadRequest("Cannot delete message!");
    }
}