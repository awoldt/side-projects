using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using gettmail_final.Models;
using Microsoft.AspNetCore.Identity;
using gettmail_final.services.acctSession;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;

    public HomeController(ILogger<HomeController> logger, SignInManager<AppUser> signin, UserManager<AppUser> usermanger)
    {
        _logger = logger;
        _signInManager = signin;
        _userManager = usermanger;
    }

    public async Task<IActionResult> Index()
    {
        AccountSession acctSession = new AccountSession();
        AppUser? userData = await acctSession.IsUserSignedIn(User, _signInManager, _userManager);

        HomeViewModel viewM = new HomeViewModel(userData);

        return View(viewM);
    }

    [Route("/privacy")]
    public async Task<IActionResult> Privacy()
    {
        AccountSession acctSession = new AccountSession();
        AppUser? userData = await acctSession.IsUserSignedIn(User, _signInManager, _userManager);

        HomeViewModel viewM = new HomeViewModel(userData);
        return View(viewM);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
