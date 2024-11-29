namespace Tiner.DTOs;

public class MessageDto {
    public int Id { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ReadAt { get; set; }
    public required string SenderUsername { get; set; }
    public required string SenderPhotoUrl { get; set; }
    public int SenderId { get; set; }
    public required string ReceiverUsername { get; set; }
    public required string ReceiverPhotoUrl { get; set; }
    public int ReceiverId { get; set; }
}