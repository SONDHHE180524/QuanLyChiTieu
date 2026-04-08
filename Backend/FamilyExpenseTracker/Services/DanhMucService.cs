using Microsoft.EntityFrameworkCore;
using FamilyExpenseTracker.Models;

namespace FamilyExpenseTracker.Services;

public class DanhMucService : IDanhMucService
{
    private readonly QuanLyChiTieuDbContext _context;

    public DanhMucService(QuanLyChiTieuDbContext context)
    {
        _context = context;
    }

    public async Task<List<Category>> GetAllCategoriesAsync()
    {
        return await _context.Categories
            .OrderBy(c => c.Type)
            .ThenBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<Category?> GetByIdAsync(int id)
    {
        return await _context.Categories.FindAsync(id);
    }

    public async Task<Category> CreateCategoryAsync(Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<bool> DeleteCategoryAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return false;

        // Bảo vệ danh mục mặc định (Sửa lỗi kiểu dữ liệu bool? sang bool)
        if (category.IsDefault == true) return false;

        // Nếu danh mục đã có giao dịch, lỗi 
        var hasTransactions = await _context.Transactions.AnyAsync(t => t.CategoryId == id);
        if (hasTransactions)
        {
            throw new Exception("Không thể xóa danh mục đang có giao dịch phát sinh. Hãy xóa các giao dịch đó trước nhé!");
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return true;
    }
}