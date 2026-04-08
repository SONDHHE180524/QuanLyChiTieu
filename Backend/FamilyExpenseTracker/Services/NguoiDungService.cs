using Microsoft.EntityFrameworkCore;
using FamilyExpenseTracker.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using FamilyExpenseTracker.Dtos;

namespace FamilyExpenseTracker.Services;

public class NguoiDungService : INguoiDungService
{
    private readonly QuanLyChiTieuDbContext _context;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;

    public NguoiDungService(QuanLyChiTieuDbContext context, IEmailService emailService, IConfiguration configuration)
    {
        _context = context;
        _emailService = emailService;
        _configuration = configuration;
    }

    public async Task<LoginResponse?> DangNhapAsync(string email, string password)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null) return null;

        string hashedInput = HashPassword(password);
        if (user.PasswordHash == hashedInput)
        {
            var token = GenerateJwtToken(user);
            return new LoginResponse
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                AvatarUrl = user.AvatarUrl,
                Token = token
            };
        }

        return null;
    }

    public async Task<bool> DangKyAsync(string fullName, string email, string password)
    {
        if (await _context.Users.AnyAsync(u => u.Email == email))
            return false; // Email đã tồn tại

        var user = new User
        {
            FullName = fullName,
            Email = email,
            PasswordHash = HashPassword(password)
        };

        _context.Users.Add(user);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<UserProfileDto?> GetProfileAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        return new UserProfileDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<bool> UpdateProfileAsync(int userId, UpdateProfileRequest request)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        user.FullName = request.FullName;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SetAvatarAsync(int userId, string avatarUrl)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        user.AvatarUrl = avatarUrl;
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> GeneratePasswordResetOtpAsync(string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null) return false;

        // Vô hiệu hóa các OTP cũ
        var currentOtps = await _context.PasswordResetOtps
            .Where(o => o.UserId == user.Id && !o.IsUsed)
            .ToListAsync();
        foreach (var otp in currentOtps)
        {
            otp.IsUsed = true;
        }

        // Tạo mã OTP ngẫu nhiên 6 chữ số
        string otpCode = new Random().Next(100000, 999999).ToString();
        var expiryTime = DateTime.UtcNow.AddMinutes(5); // Có hiệu lực 5 phút

        var resetOtp = new PasswordResetOtp
        {
            UserId = user.Id,
            Email = email,
            OtpCode = otpCode,
            ExpiryTime = expiryTime,
            IsUsed = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.PasswordResetOtps.Add(resetOtp);
        await _context.SaveChangesAsync();

        // Gửi email với giao diện đẹp hơn
        string subject = "🛡️ " + otpCode + " là mã xác thực (OTP) của bạn";
        string body = $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;'>
                <div style='text-align: center; margin-bottom: 20px;'>
                    <h2 style='color: #3b82f6;'>Family Expense Tracker</h2>
                    <p style='color: #64748b; font-size: 16px;'>Khôi phục mật khẩu tài khoản</p>
                </div>
                <div style='background-color: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;'>
                    <p style='color: #334155; margin-bottom: 10px;'>Mã OTP của bạn là:</p>
                    <div style='font-size: 32px; font-weight: bold; color: #1e293b; letter-spacing: 5px; margin: 10px 0;'>{otpCode}</div>
                    <p style='color: #ef4444; font-size: 14px; margin-top: 10px;'>Mã này có hiệu lực trong 5 phút.</p>
                </div>
                <p style='color: #64748b; font-size: 14px; line-height: 1.5; margin-top: 20px;'>
                    Vui lòng không chia sẻ mã này cho bất kỳ ai. Nếu bạn không yêu cầu dịch vụ này, hãy bỏ qua email này.
                </p>
                <div style='border-top: 1px solid #e2e8f0; margin-top: 20px; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 12px;'>
                    &copy; 2026 Family Expense Tracker. All rights reserved.
                </div>
            </div>";

        try {
            await _emailService.SendEmailAsync(email, subject, body);
            return true;
        } catch {
            return false;
        }
    }


    public async Task<bool> ResetPasswordAsync(string email, string otp, string newPassword)
    {
        var resetOtp = await _context.PasswordResetOtps
            .FirstOrDefaultAsync(o => o.Email == email && o.OtpCode == otp && !o.IsUsed && o.ExpiryTime > DateTime.UtcNow);

        if (resetOtp == null) return false;

        var user = await _context.Users.FindAsync(resetOtp.UserId);
        if (user == null) return false;

        user.PasswordHash = HashPassword(newPassword);
        resetOtp.IsUsed = true;

        await _context.SaveChangesAsync();
        return true;
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToHexString(bytes).ToLower();
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["Key"]!;
        var key = Encoding.ASCII.GetBytes(secretKey);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email)
            }),
            Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["DurationInMinutes"]!)),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"]
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}