using System;

namespace FamilyExpenseTracker.Dtos;

public class UserProfileDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? AvatarUrl { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class UpdateProfileRequest
{
    public string FullName { get; set; } = null!;
}
