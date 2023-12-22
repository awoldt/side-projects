using gettmail_final.Models.FormModels;
using gettmail_final.services.acctSession;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

public class LoginController : Controller
{
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;
    private readonly ILogger<LoginController> _logger;

    public LoginController(SignInManager<AppUser> signin, UserManager<AppUser> userManger, ILogger<LoginController> log)
    {
        _signInManager = signin;
        _userManager = userManger;
        _logger = log;
    }


    public async Task<IActionResult> Index()
    {
        AccountSession acctSession = new AccountSession();
        AppUser? userData = await acctSession.IsUserSignedIn(User, _signInManager, _userManager);

        //if user is already logged in, redirect to account page
        if (userData != null)
        {
            return Redirect("/account");
        }

        LoginViewModel viewM = new LoginViewModel(userData);

        return View(viewM);
    }

    [HttpPost]
    public async Task<IActionResult> Index(LoginForm form)
    {
        try
        {

            if (!ModelState.IsValid)
            {
                Response.StatusCode = 400;
                TempData["status"] = "error";
                TempData["message"] = "Form submission not valid";
                return View(new LoginViewModel(null));
            }

            AppUser? u = null;

            //first check if email exists
            var emailExists = await _userManager.FindByEmailAsync(form.EmailorUsername.Trim());
            if (emailExists == null)
            {
                //now check to see if username exists
                var usernameExists = await _userManager.FindByNameAsync(form.EmailorUsername.Trim());
                if (usernameExists == null)
                {
                    Response.StatusCode = 400;
                    TempData["status"] = "error";
                    TempData["message"] = "Account does not exist";
                    return View(new LoginViewModel(null));
                }
                else
                {
                    u = usernameExists;
                }
            }
            else
            {
                u = emailExists;
            }

            //account must have email verified for successful login
            if (!u.EmailConfirmed)
            {
                Response.StatusCode = 400;
                TempData["status"] = "error";
                TempData["message"] = "You must verify your account before logging in";
                return View(new LoginViewModel(null));
            }

            var signinAttempt = await _signInManager.PasswordSignInAsync(u, form.Password.Trim(), true, false);
            if (!signinAttempt.Succeeded)
            {
                Response.StatusCode = 400;
                TempData["status"] = "error";
                TempData["message"] = "Credentials invalid";
                return View(new LoginViewModel(null));
            }

            return Redirect("/account");
        }
        catch (Exception ex)
        {
            Response.StatusCode = 500;
            TempData["status"] = "error";
            TempData["message"] = ex.ToString();
            return View(new LoginViewModel(null));
        }
    }
}