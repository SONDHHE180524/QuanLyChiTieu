using FamilyExpenseTracker.Services;
using FamilyExpenseTracker.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace FamilyExpenseTracker.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GiaoDichController(IGiaoDichService service) : ControllerBase
{
    [HttpGet("{userId}")]
    public async Task<IActionResult> LayLichSuGiaoDich(int userId)
    {
        var result = await service.LayLichSuGiaoDichAsync(userId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> TaoGiaoDich(TaoGiaoDichRequest request)
    {
        var success = await service.TaoGiaoDichAsync(request);
        if (success) return Ok(new { message = "Thêm giao dịch thành công!" });
        return BadRequest(new { message = "Không thể lưu giao dịch." });
    }

    [HttpGet("dashboard/{userId}")]
    public async Task<IActionResult> LayThongKeDashboard(int userId)
    {
        var result = await service.LayThongKeDashboardAsync(userId);
        return Ok(result);
    }
}
