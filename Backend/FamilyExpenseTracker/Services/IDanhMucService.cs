using FamilyExpenseTracker.Models;

namespace FamilyExpenseTracker.Services;

public interface IDanhMucService
{
    Task<List<Category>> GetAllCategoriesAsync();
    Task<Category?> GetByIdAsync(int id);
    Task<Category> CreateCategoryAsync(Category category);
    Task<bool> DeleteCategoryAsync(int id);
}