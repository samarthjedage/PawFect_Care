using System;
using System.Collections.Generic;

namespace PawFect_Care.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int Billld { get; set; }

    public int Cvvno { get; set; }

    public long Cardno { get; set; }

    public string Status { get; set; } = null!;
}
