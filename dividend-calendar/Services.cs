namespace dividend_calendar.ApplicationServices;

public class Services
{
    static public string? GetMongodbMonthCollection(int month)
    {
        if (month == 1)
        {
            return "jan-dividends";
        }
        if (month == 2)
        {
            return "feb-dividends";
        }
        if (month == 3)
        {
            return "march-dividends";
        }
        if (month == 4)
        {
            return "apr-dividends";
        }
        if (month == 5)
        {
            return "may-dividends";
        }
        if (month == 6)
        {
            return "jun-dividends";
        }
        if (month == 7)
        {
            return "july-dividends";
        }
        if (month == 8)
        {
            return "aug-dividends";
        }
        if (month == 9)
        {
            return "sep-dividends";
        }
        if (month == 10)
        {
            return "oct-dividends";
        }
        if (month == 11)
        {
            return "nov-dividends";
        }
        if (month == 12)
        {
            return "dec-dividends";
        }
        return null;
    }

    static public string FormatDate(DateTime date, string monthString)
    {
        if (date.Day >= 11 && date.Day <= 13)
        {
            return monthString + " " + date.Day + "th, " + date.Year;
        }

        switch (date.Day % 10)
        {
            case 1:
                return monthString + " " + date.Day + "st, " + date.Year;
            case 2:
                return monthString + " " + date.Day + "nd, " + date.Year;
            case 3:
                return monthString + " " + date.Day + "rd, " + date.Year;
            default:
                return monthString + " " + date.Day + "th, " + date.Year;
        }
    }

    static public HeadTagMetadata GenerateCompanyProfilePageHeaderTags(string companyName, string companySymbol, bool hasDividend, int numOfDividends)
    {
        string description = hasDividend ? $"{companyName} ({companySymbol.ToUpper()}) has paid out {numOfDividends} dividends this year. Find dates and amounts payed out to shareholders along with related stocks." : $"{companyName} ({companySymbol.ToUpper()}) does not pay dividends. Check out reltated stocks that pay dividends.";

        return new HeadTagMetadata(companyName, companySymbol, description);
    }
}

public class DividendData
{
    public decimal dividend { get; set; }
    public string recordDate { get; set; }
    public string paymentDate { get; set; }
    public string declarationDate { get; set; }
}

public class OpenGraphProperties
{
    public string Title { get; set; }
    public string Image { get; set; }
    public string Url { get; set; }
}

public class TwitterOpenGraphProperties
{
    public string Title { get; set; }
    public string Image { get; set; }
    public string Description { get; set; }
}


public class HeadTagMetadata
{
    public HeadTagMetadata(string companyName, string companySymbol, string metaDescription)
    {
        Title = $"{companyName} ({companySymbol}) - Dividend Calendar";
        CanonicalTag = $"https://dividome.com/{companySymbol.ToLower()}";
        Description = metaDescription;

        OgMetaTags = new OpenGraphProperties
        {
            Title = $"Discover {companyName}'s dividend payouts for the current year, including details such as payment dates and dividend amounts",
            Image = "https://dividome.com/favicon-16x16.png",
            Url = $"https://dividome.com/{companySymbol.ToLower()}"
        };

        TwitterOgMetaTags = new TwitterOpenGraphProperties
        {
            Title = $"{companyName}'s ({companySymbol}) dividend payouts",
            Image = "https://dividome.com/favicon-16x16.png",
            Description = $"{companyName}'s dividend payouts for the current calendar year, including past and upcoming dividend payments"
        };
    }


    public string Title { get; set; }
    public string Description { get; set; }
    public string CanonicalTag { get; set; }
    public OpenGraphProperties OgMetaTags { get; set; }
    public TwitterOpenGraphProperties TwitterOgMetaTags { get; set; }
}

