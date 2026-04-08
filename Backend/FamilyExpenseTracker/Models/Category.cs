using System;
using System.Collections.Generic;

namespace FamilyExpenseTracker.Models;

public partial class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Type { get; set; } = null!;

    public string? Icon { get; set; }

    public bool? IsDefault { get; set; }

    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
