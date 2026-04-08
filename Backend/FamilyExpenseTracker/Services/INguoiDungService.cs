using FamilyExpenseTracker.Models;
using FamilyExpenseTracker.Dtos;

namespace FamilyExpenseTracker.Services;

public interface INguoiDungService
{
    Task<LoginResponse?> DangNhapAsync(string email, string password);
    Task<bool> DangKyAsync(string fullName, string email, string password);
    Task<User?> GetByIdAsync(int id);
    Task<UserProfileDto?> GetProfileAsync(int userId);
    Task<bool> UpdateProfileAsync(int userId, UpdateProfileRequest request);
    Task<bool> SetAvatarAsync(int userId, string avatarUrl);
    Task<bool> GeneratePasswordResetOtpAsync(string email);
    Task<bool> ResetPasswordAsync(string email, string otp, string newPassword);
}