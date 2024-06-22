using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

public class CompanyProfileController : Controller
{
    private readonly ILogger<CompanyProfileController> _logger;
    private MongoClient _client;
    private readonly IConfiguration _config;

    public CompanyProfileController(IConfiguration config, ILogger<CompanyProfileController> logger)
    {
        _logger = logger;
        _config = config;
        _client = new MongoClient(_config["mongodb_connection_key"]);
    }

    [Route("/{companySymbol}")]
    public async Task<IActionResult> Index(string companySymbol)
    {
        try
        {
            // get company data stored in mongodb
            var companyRequest = await _client.GetDatabase("dividend-calendar-PROD").GetCollection<CompanyData>("company-dividends").FindAsync(Builders<CompanyData>.Filter.Eq(x => x.Symbol, companySymbol.ToUpper()));
            CompanyData company = await companyRequest.FirstOrDefaultAsync();
            if (company == null)
            {
                Response.StatusCode = 404;
                return View("NotFound");
            }

            return View(new CompanyProfile(company));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.ToString());
            return View("Error");
        }
    }
}