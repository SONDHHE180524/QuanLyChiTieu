namespace FamilyExpenseTracker.Dtos
{
    public class TaoGiaoDichRequest
    {
        public int UserId { get; set; }
        public int CategoryId { get; set; }
        public decimal Amount { get; set; }
        public DateTime TransactionDate { get; set; }
        public string? Note { get; set; }
    }
}
