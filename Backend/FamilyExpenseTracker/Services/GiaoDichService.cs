using Microsoft.EntityFrameworkCore;
using FamilyExpenseTracker.Models;
using FamilyExpenseTracker.Dtos;

namespace FamilyExpenseTracker.Services;

public class GiaoDichService : IGiaoDichService
{
    private readonly QuanLyChiTieuDbContext _context;

    public GiaoDichService(QuanLyChiTieuDbContext context)
    {
        _context = context;
    }

    // Lấy lịch sử giao dịch (Chỉ lấy trong năm hiện tại)
    public async Task<List<GiaoDichDto>> LayLichSuGiaoDichAsync(int userId)
    {
        var currentYear = DateTime.Now.Year;
        return await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId && t.TransactionDate.Year == currentYear)
            .OrderByDescending(t => t.TransactionDate)
            .ThenByDescending(t => t.Id)
            .Select(t => new GiaoDichDto
            {
                Id = t.Id,
                Amount = t.Amount,
                TransactionDate = t.TransactionDate,
                Note = t.Note,
                TenDanhMuc = t.Category.Name,
                Loai = t.Category.Type
            })
            .ToListAsync();
    }

    // Thêm giao dịch mới
    public async Task<bool> TaoGiaoDichAsync(TaoGiaoDichRequest request)
    {
        var currentYear = DateTime.Now.Year;

        // 1. Chỉ cho phép chọn trong năm hiện tại
        if (request.TransactionDate.Year != currentYear)
            return false;

        if (request.Amount <= 0 || request.CategoryId <= 0 || request.UserId <= 0)
            return false;

        // 2. Tự động xóa các giao dịch năm cũ nếu tồn tại
        var oldTransactions = await _context.Transactions
            .Where(t => t.UserId == request.UserId && t.TransactionDate.Year < currentYear)
            .ToListAsync();

        if (oldTransactions.Any())
        {
            _context.Transactions.RemoveRange(oldTransactions);
        }

        var entity = new Transaction
        {
            UserId = request.UserId,
            CategoryId = request.CategoryId,
            Amount = request.Amount,
            TransactionDate = request.TransactionDate,
            Note = request.Note?.Trim()
        };

        _context.Transactions.Add(entity);
        return await _context.SaveChangesAsync() > 0;
    }

    // Lấy số liệu thống kê Dashboard (Chỉ tính trong năm hiện tại)
    public async Task<ThongKeDashboardDto> LayThongKeDashboardAsync(int userId)
    {
        var currentYear = DateTime.Now.Year;
        var transactions = await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId && t.TransactionDate.Year == currentYear)
            .ToListAsync();

        var tongThu = transactions
            .Where(t => t.Category.Type == "Thu")
            .Sum(t => t.Amount);

        var tongChi = transactions
            .Where(t => t.Category.Type == "Chi")
            .Sum(t => t.Amount);

        // 1. Phân phối chi tiêu theo danh mục
        var colors = new[] { "#FFB6C1", "#B0E0E6", "#FFE4B5", "#98FB98", "#DDA0DD", "#F0E68C", "#AFEEEE" };
        var phanBo = transactions
            .Where(t => t.Category.Type == "Chi")
            .GroupBy(t => t.Category.Name)
            .Select((g, index) => new CategoryStatDto
            {
                TenDanhMuc = g.Key,
                Amount = g.Sum(t => t.Amount),
                Color = colors[index % colors.Length]
            })
            .OrderByDescending(x => x.Amount)
            .ToList();

        // 2. Xu hướng thu chi theo từng tháng
        var xuHuong = Enumerable.Range(1, 12).Select(m => new MonthlyStatDto
        {
            MonthName = $"T{m}",
            Income = 0,
            Expense = 0
        }).ToList();

        var monthlyData = transactions
            .GroupBy(t => new { t.TransactionDate.Month, t.Category.Type })
            .Select(g => new
            {
                Month = g.Key.Month,
                Type = g.Key.Type,
                Total = g.Sum(t => t.Amount)
            })
            .ToList();

        foreach (var data in monthlyData)
        {
            var target = xuHuong[data.Month - 1];
            if (data.Type == "Thu") target.Income = data.Total;
            else target.Expense = data.Total;
        }

        return new ThongKeDashboardDto
        {
            TongThu = tongThu,
            TongChi = tongChi,
            SoDu = tongThu - tongChi,
            PhanBoChiTieu = phanBo,
            XuHuongHangThang = xuHuong
        };
    }
}