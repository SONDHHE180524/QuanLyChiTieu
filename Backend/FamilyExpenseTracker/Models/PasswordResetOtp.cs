namespace FamilyExpenseTracker.Models;

public class PasswordResetOtp
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string OtpCode { get; set; } = string.Empty;
    public DateTime ExpiryTime { get; set; }
    public bool IsUsed { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual User User { get; set; } = null!;
}