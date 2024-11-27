using System.ComponentModel.DataAnnotations;

namespace Tiner.DTOs;

public class RegisterDto
{
    [Required]
    public required string Username { get; set; }
    [Required]
    public required string KnownAs { get; set; }
    [Required]
    public required string Gender { get; set; }
    [Required]
    public required DateOnly Dob { get; set; }
    [Required]
    public required string City { get; set; }
    [Required]
    public required string Country { get; set; }
    [Required]
    [StringLength(8, MinimumLength = 4)]
    public required string Password { get; set; }
}