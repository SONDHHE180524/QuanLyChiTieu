using Microsoft.AspNetCore.Mvc;
using FamilyExpenseTracker.Services;
using FamilyExpenseTracker.Dtos;
using System.IO;

namespace FamilyExpenseTracker.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NguoiDungController : ControllerBase
{
    private readonly INguoiDungService _service;
    private readonly IWebHostEnvironment _environment;

    public NguoiDungController(INguoiDungService service, IWebHostEnvironment environment)
    {
        _service = service;
        _environment = environment;
    }

    [HttpPost("dangky")]
    public async Task<IActionResult> DangKy([FromBody] DangKyRequest request)
    {
        var success = await _service.DangKyAsync(request.FullName, request.Email, request.Password);
        if (success)
            return Ok(new { message = "Đăng ký thành công!" });

        return BadRequest("Email đã tồn tại hoặc có lỗi xảy ra.");
    }

    [HttpPost("dangnhap")]
    public async Task<IActionResult> DangNhap([FromBody] DangNhapRequest request)
    {
        var response = await _service.DangNhapAsync(request.Email, request.Password);
        if (response != null)
            return Ok(response);

        return Unauthorized("Email hoặc mật khẩu không đúng.");
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var success = await _service.GeneratePasswordResetOtpAsync(request.Email);
        if (success)
            return Ok(new { message = "Mã OTP đã được gửi đến email của bạn." });

        return BadRequest("Email không tồn tại hoặc có lỗi khi gửi email.");
    }


    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var success = await _service.ResetPasswordAsync(request.Email, request.OtpCode, request.NewPassword);
        if (success)
            return Ok(new { message = "Đặt lại mật khẩu thành công." });

        return BadRequest("Có lỗi xảy ra. Vui lòng kiểm tra lại mã OTP hoặc thử lại sau.");
    }

    [HttpGet("profile/{id}")]
    public async Task<IActionResult> GetProfile(int id)
    {
        var profile = await _service.GetProfileAsync(id);
        if (profile != null)
            return Ok(profile);

        return NotFound(new { message = "Không tìm thấy người dùng." });
    }

    [HttpPut("profile/{id}")]
    public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileRequest request)
    {
        var success = await _service.UpdateProfileAsync(id, request);
        if (success)
            return Ok(new { message = "Cập nhật hồ sơ thành công!" });

        return BadRequest(new { message = "Không thể cập nhật hồ sơ." });
    }

    [HttpPost("upload-avatar/{id}")]
    public async Task<IActionResult> UploadAvatar(int id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Không có file nào được chọn.");

        var user = await _service.GetByIdAsync(id);
        if (user == null)
            return NotFound("Không tìm thấy người dùng.");

        // Xác định đường dẫn gốc (wwwroot)
        string webRootPath = _environment.WebRootPath;
        if (string.IsNullOrEmpty(webRootPath))
        {
            // Nếu wwwroot chưa tồn tại, lấy đường dẫn tuyệt đối dựa trên ContentRoot
            webRootPath = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        // Tạo cấu trúc thư mục nếu chưa có
        string uploadsFolder = Path.Combine(webRootPath, "uploads", "avatars");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        // Tên file duy nhất
        string fileName = $"{Guid.NewGuid()}_{file.FileName}";
        string filePath = Path.Combine(uploadsFolder, fileName);

        // Lưu file vật lý
        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        // Cập nhật URL trong DB
        string avatarUrl = $"/uploads/avatars/{fileName}";
        var success = await _service.SetAvatarAsync(id, avatarUrl);
        
        if (success)
            return Ok(new { avatarUrl = avatarUrl, message = "Tải ảnh lên thành công!" });

        return BadRequest("Lưu file thành công nhưng không thể cập nhật DB.");
    }
}