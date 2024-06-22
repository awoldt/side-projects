using dividend_calendar.ApplicationServices;
using MongoDB.Bson.Serialization.Attributes;


// all the properties needed to render the home page view
public class HomepageDividendCalendarData
{
    public string TodaysDate { get; set; } //formatted as "Month Day'(st|nd|th|rd), Year"
    public BsonDividendData[]? TodaysDividends { get; set; }

    public int CurrentMonth { get; set; }
    public int? NextMonth { get; set; }

    public HomepageDividendCalendarData(BsonDividendData[]? dividendData)
    {
        if (dividendData != null)
        {
            foreach (var x in dividendData)
            {
                if (x.DeclarationDate != null)
                {
                    x.DeclarationDate = DateTime.Parse(x.DeclarationDate).ToString("M/d/yyyy");
                }
                if (x.RecordDate != null)
                {
                    x.RecordDate = DateTime.Parse(x.RecordDate).ToString("M/d/yyyy");
                }
                x.PaymentDate = DateTime.Parse(x.PaymentDate).ToString("M/d/yyyy"); //dont need to check for null bc dividend MUST have payment date
            }
            TodaysDividends = dividendData;
        }

        TodaysDate = Services.FormatDate(DateTime.UtcNow, DateTime.Parse(DateTime.UtcNow.ToString()).ToString("MMMM"));
    }
}

[BsonIgnoreExtraElements]
public class BsonDividendData
{
    [BsonElement("symbol")]
    public string Symbol { get; set; }
    [BsonElement("dividend")]
    public decimal Amount { get; set; }
    [BsonElement("recordDate")]
    public string? RecordDate { get; set; }
    [BsonElement("paymentDate")]
    public string PaymentDate { get; set; }
    [BsonElement("declarationDate")]
    public string? DeclarationDate { get; set; }
}