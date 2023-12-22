using gettmail_final.services.acctSession;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

public class DocsController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;

    public DocsController(ILogger<HomeController> logger, SignInManager<AppUser> signin, UserManager<AppUser> usermanger)
    {
        _logger = logger;
        _signInManager = signin;
        _userManager = usermanger;
    }

    public async Task<IActionResult> Index()
    {

        AccountSession acctSession = new AccountSession();
        AppUser? userData = await acctSession.IsUserSignedIn(User, _signInManager, _userManager);

        DocsViewModel viewM = new DocsViewModel(userData);

        return View(viewM);

    }
}