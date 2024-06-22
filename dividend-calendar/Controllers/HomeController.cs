using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using dividend_calendar.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using dividend_calendar.ApplicationServices;
using System.Text.Json;

namespace dividend_calendar.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly IConfiguration _config;
    private MongoClient _client;

    public HomeController(ILogger<HomeController> logger, IConfiguration config)
    {
        _logger = logger;
        _config = config;
        _client = new MongoClient(_config["mongodb_connection_key"]);
    }

    public async Task<IActionResult> Index()
    {
        var d = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);
        try
        {
            // get todays dividends
            var results = await _client.GetDatabase("dividend-calendar-PROD").GetCollection<BsonDividendData>("todays-dividends").Find(new BsonDocument()).ToListAsync();
            return View(new HomepageDividendCalendarData(results.ToArray()));
        }
        catch (Exception ex)
        {
            _logger.LogError("\n\nIndex action catch\n" + ex.ToString());
            return View("Error");
        }
    }

    [Route("/about")]
    public IActionResult About()
    {
        return View();
    }

    [Route("/search")]
    [HttpPost]
    public async Task<JsonResult?> Search()
    {
        try
        {
            string? query = Request.Query["q"];

            if (query == null || query == "")
            {
                return null;
            }

            // first check for symbol matches
            var symbolMatches = await _client.GetDatabase("dividend-calendar-PROD").GetCollection<CompanyData>("company-dividends").Find(Builders<CompanyData>.Filter.Eq(x => x.Symbol, $"{query.ToUpper()}")).Limit(10).ToListAsync();
            if (symbolMatches != null)
            {
                return new JsonResult(new { data = symbolMatches.ToArray() });
            }

            return new JsonResult(null);
        }
        catch (Exception err)
        {
            _logger.LogError(err.ToString());
            return null;
        }
    }

    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}