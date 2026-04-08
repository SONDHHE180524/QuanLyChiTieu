namespace FamilyExpenseTracker.Dtos
{
    public class ThongKeDashboardDto
    {
        public decimal TongThu { get; set; }
        public decimal TongChi { get; set; }
        public decimal SoDu { get; set; }
        public List<CategoryStatDto> PhanBoChiTieu { get; set; } = new();
        public List<MonthlyStatDto> XuHuongHangThang { get; set; } = new();
    }

    public class CategoryStatDto
    {
        public string TenDanhMuc { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Color { get; set; } = string.Empty; 
    }

    public class MonthlyStatDto
    {
        public string MonthName { get; set; } = string.Empty; 
        public decimal Income { get; set; }
        public decimal Expense { get; set; }
    }
}
