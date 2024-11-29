namespace Tiner.Entities;

public class Message {
    public int Id { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReadAt { get; set; }
    public required string SenderUsername { get; set; }
    public required string ReceiverUsername { get; set; }
    public bool IsSenderDeleted { get; set; }
    public bool IsReceiverDeleted { get; set; }

    // Navigation properties
    public int SenderId { get; set; }
    public AppUser Sender { get; set; } = null!;
    public int ReceiverId { get; set; }
    public AppUser Receiver { get; set; } = null!;
}