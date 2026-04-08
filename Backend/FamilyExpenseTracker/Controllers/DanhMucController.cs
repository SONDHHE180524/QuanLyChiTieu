using FamilyExpenseTracker.Models;
using FamilyExpenseTracker.Services;
using Microsoft.AspNetCore.Mvc;

namespace FamilyExpenseTracker.Controllers;

public class CategoryCreateRequest
{
    public string Name { get; set; } = null!;
    public string Type { get; set; } = null!;
}

[Route("api/[controller]")]
[ApiController]
public class DanhMucController : ControllerBase
{
    private readonly IDanhMucService _service;

    public DanhMucController(IDanhMucService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _service.GetAllCategoriesAsync();
        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CategoryCreateRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new { message = "Tên danh mục không được để trống rùi nha!" });
        }

        var category = new Category
        {
            Name = request.Name,
            Type = request.Type,
            IsDefault = false
        };

        try
        {
            var created = await _service.CreateCategoryAsync(category);
            return Ok(created);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Lỗi Database: {ex.Message}" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var success = await _service.DeleteCategoryAsync(id);
            if (success)
            {
                return Ok(new { message = "Đã xóa danh mục thành công!" });
            }
            return BadRequest(new { message = "Không thể xóa danh mục mặc định hoặc không tìm thấy danh mục." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
