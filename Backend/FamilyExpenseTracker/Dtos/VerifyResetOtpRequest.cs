namespace FamilyExpenseTracker.Dtos;

public class VerifyResetOtpRequest
{
    public string Email { get; set; } = string.Empty;
    public string OtpCode { get; set; } = string.Empty;
}