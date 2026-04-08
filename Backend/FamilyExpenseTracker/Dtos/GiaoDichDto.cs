namespace FamilyExpenseTracker.Dtos
{
    public class GiaoDichDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime TransactionDate { get; set; }
        public string? Note { get; set; }

        //thêm thông tin hiển thị cho người dùng
        public string TenDanhMuc { get; set; } = null!;
        public string Loai { get; set; } = null!;//Thu hoặc chi
    }
}
