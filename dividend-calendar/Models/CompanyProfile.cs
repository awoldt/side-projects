using MongoDB.Bson.Serialization.Attributes;

public class CompanyProfile
{
    public string CompanyName { get; set; }
    public string CompanySymbol { get; set; }
    public string[]? CompanyDescription { get; set; }
    public CompanyDividendHistory? CompanyDividends { get; set; }
    public DateTime UpdatedOn { get; set; }
    public RelatedStocksData[]? RelatedStocks { get; set; }
    public string? CompanyLogo { get; set; }

    public CompanyProfile(CompanyData data)
    {
        CompanyName = data.Name;
        CompanySymbol = data.Symbol;

        if (data.Description != null)
        {
            CompanyDescription = data.Description;
        }
        if (data.Dividends != null)
        {
            CompanyDividends = new CompanyDividendHistory(data.Dividends);
        }
        if (data.RelatedStocks != null)
        {
            RelatedStocks = data.RelatedStocks;
        }
        if (data.Logo != null)
        {
            CompanyLogo = data.Logo;
        }
        UpdatedOn = data.UpdatedOn;
    }
}

public class CompanyDividendHistory
{
    public List<CompanyDividendData>? PastDividends { get; set; }
    public List<CompanyDividendData>? UpcomingDividends { get; set; }
    public bool HasDividendToday { get; set; } = false; // defaults to false
    public CompanyDividendData? TodaysDividend { get; set; }
    public int NumOfDividends { get; set; } // if 0, stock does not have dividends
    public int? NextPaymentInDays { get; set; } // represents the number of days before the next upcoming dividend
    public int? LastPaymentInDays { get; set; } // represents the number of days since the last dividend paid
    public CompanyDividendHistory(CompanyDividendData[]? data)
    {
        if (data != null)
        {
            PastDividends = new List<CompanyDividendData>();
            UpcomingDividends = new List<CompanyDividendData>();
            DateTime currentDate = DateTime.Now.Date;

            foreach (var x in data)
            {
                DateTime paymentDate = DateTime.Parse(x.PaymentDate).Date;

                if (currentDate < paymentDate)
                {
                    UpcomingDividends.Add(x);
                    NumOfDividends += 1;
                }
                else if (currentDate == paymentDate)
                {
                    HasDividendToday = true;
                    TodaysDividend = x;
                    NumOfDividends += 1;
                }
                else
                {
                    PastDividends.Add(x);
                    NumOfDividends += 1;
                }
            }


            if (PastDividends.Count > 0)
            {
                // order the dates in cron order
                PastDividends = PastDividends.OrderBy(d => d.PaymentDate).ToList();

                //calculate the LastPaymentInDays number
                TimeSpan n = DateTime.Now - DateTime.Parse(PastDividends[PastDividends.Count - 1].PaymentDate);
                LastPaymentInDays = (int)n.TotalDays;
            }
            if (UpcomingDividends.Count > 0)
            {
                // order the dates in cron order
                UpcomingDividends = UpcomingDividends.OrderBy(d => d.PaymentDate).ToList();

                //calculate the NextPaymentInDays number
                TimeSpan n = DateTime.Parse(UpcomingDividends[0].PaymentDate) - DateTime.Now;
                NextPaymentInDays = (int)n.TotalDays + 1;
            }
        }
        else
        {
            NumOfDividends = 0;
        }
    }
}

// represents the company data stored in mongodb
[BsonIgnoreExtraElements]
public class CompanyData
{
    [BsonElement("name")]
    public string Name { get; set; }
    [BsonElement("symbol")]
    public string Symbol { get; set; }
    [BsonElement("description")]
    public string[]? Description { get; set; }
    [BsonElement("logoUrl")]
    public string? Logo { get; set; }
    [BsonElement("dividends")]
    public CompanyDividendData[]? Dividends { get; set; }
    [BsonElement("relatedStocks")]
    public RelatedStocksData[]? RelatedStocks { get; set; }
    [BsonElement("updatedOn")]
    public DateTime UpdatedOn { get; set; }
}

// represents the company data stored in mongodb
public class CompanyDividendData
{
    [BsonElement("dividend")]
    public decimal Amount { get; set; }
    [BsonElement("recordDate")]
    public string? RecordDate { get; set; }
    [BsonElement("declarationDate")]
    public string? DeclarationDate { get; set; }
    [BsonElement("paymentDate")]
    public string PaymentDate { get; set; }
}

// represents the company data stored in mongodb
public class RelatedStocksData
{
    [BsonElement("symbol")]
    public string Symbol { get; set; }
    [BsonElement("name")]
    public string Name { get; set; }
}