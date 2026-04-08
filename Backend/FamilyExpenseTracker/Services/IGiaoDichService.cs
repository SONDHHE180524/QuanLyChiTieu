using FamilyExpenseTracker.Dtos;

namespace FamilyExpenseTracker.Services;

public interface IGiaoDichService
{
    Task<List<GiaoDichDto>> LayLichSuGiaoDichAsync(int userId);
    Task<bool> TaoGiaoDichAsync(TaoGiaoDichRequest request);
    Task<ThongKeDashboardDto> LayThongKeDashboardAsync(int userId);
}