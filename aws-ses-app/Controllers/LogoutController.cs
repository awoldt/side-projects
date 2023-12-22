using gettmail_final.Models.FormModels;
using gettmail_final.services.acctSession;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

public class LogoutController : Controller
{
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;
    private readonly ILogger<LoginController> _logger;

    public LogoutController(SignInManager<AppUser> signin, UserManager<AppUser> userManger, ILogger<LoginController> log)
    {
        _signInManager = signin;
        _userManager = userManger;
        _logger = log;
    }

    public async Task<IActionResult> Index()
    {
        AccountSession acctSession = new AccountSession();
        AppUser? userData = await acctSession.IsUserSignedIn(User, _signInManager, _userManager);

        if (userData == null)
        {
            return Redirect("/login");
        }

        await _signInManager.SignOutAsync();

        return Redirect("/");
    }

}