using System.Text;
using gettmail_final.services.acctSession;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using RandomStringCreator;


public class RegisterController : Controller
{
    private readonly UserManager<AppUser> _userManager;
    private readonly ApplicationDbContext _db;
    private readonly ILogger<RegisterController> _log;
    private readonly IEmailSender _emailSender;
    private readonly SignInManager<AppUser> _signinManager;


    public RegisterController(UserManager<AppUser> manager, SignInManager<AppUser> signinManager, ApplicationDbContext db, ILogger<RegisterController> log, IEmailSender emailSender, SignInManager<AppUser> signin)
    {
        _userManager = manager;
        _db = db;
        _log = log;
        _emailSender = emailSender;
        _signinManager = signin;
    }

    public async Task<IActionResult> Index()
    {
        AccountSession acctSession = new AccountSession();
        AppUser? userData = await acctSession.IsUserSignedIn(User, _signinManager, _userManager);

        if (userData != null)
        {
            return Redirect("/account");
        }
        else
        {
            RegisterViewModel viewM = new RegisterViewModel(userData);
            return View(viewM);
        }

    }

    [HttpPost]
    public async Task<IActionResult> Index(RegisterFormModel form)
    {


        if (!ModelState.IsValid)
        {
            TempData["status"] = "error";
            TempData["message"] = "Form invalid";

            return View(new RegisterViewModel(null));
        }


        try
        {
            AccountSession acctSession = new AccountSession();
            AppUser? userData = await acctSession.IsUserSignedIn(User, _signinManager, _userManager);


            //see if email is already confirmed in database
            var emailsInUse = await _db.Users.Where(u => u.Email == form.Email.Trim()).ToArrayAsync();
            if (emailsInUse.Length > 0)
            {
                foreach (var x in emailsInUse)
                {
                    if (x.EmailConfirmed)
                    {
                        TempData["status"] = "error";
                        TempData["message"] = "Email already in use";

                        return View(new RegisterViewModel(null));
                    }
                }
            }

            //generate unqiue api key
            bool l = true;
            string apiKey = "";
            while (l)
            {
                string key = new StringCreator().Get(20);
                bool exists = await _db.Users.AnyAsync(u => u.ApiKey == key);
                if (!exists)
                {
                    l = false;
                    apiKey = key;
                }
            }

            AppUser newUser = new AppUser
            {
                UserName = form.Username.Trim(),
                Email = form.Email.Trim(),
                AccountCreatedOn = DateTime.Now.ToUniversalTime(),
                ApiKey = apiKey,
                RemainingApiCalls = 100 //default value
            };
            var newUserResult = await _userManager.CreateAsync(newUser, form.Password.Trim());
            if (!newUserResult.Succeeded)
            {
                TempData["status"] = "error";
                TempData["message"] = "There was an error while creating new user";

                return View(new RegisterViewModel(null));
            }

            var userId = await _userManager.GetUserIdAsync(newUser);
            var code = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
            var callbackUrl = Url.Action("ConfirmEmail", "Register", new { userId = userId, code = code, returnUrl = "/register/confirmemail" }, protocol: Request.Scheme);
            await _emailSender.SendEmailAsync(form.Email.Trim(), "Confirm your account", $"Please confirm your account by clicking this link - {callbackUrl}");

            TempData["status"] = "success";
            TempData["message"] = "A confirmation email was sent to your inbox";

            return View(new RegisterViewModel(null));

        }
        catch (Exception ex)
        {
            TempData["status"] = "error";
            TempData["message"] = ex.ToString();

            return View(new RegisterViewModel(null));
        }
    }


    [HttpGet]
    public async Task<IActionResult> ConfirmEmail(string userId, string code)
    {
        if (userId == null || code == null)
        {

            return RedirectToPage("/register");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound($"Unable to load user with ID '{userId}'.");
        }

        code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
        var result = await _userManager.ConfirmEmailAsync(user, code);
        if (!result.Succeeded)
        {
            TempData["message"] = "Error while confirming account";
            return View(new RegisterViewModel(null));
        }

        //if there are any email addresses that match the one just confirmed
        //delete from database
        //...this will prevent error while user is attempting to log in and linq query finds
        //multiple records with same email address (throws error, wont let user log in)

        var sameEmailAddresses = _db.Users.Where(e => e.Email == user.Email && !e.EmailConfirmed);
        if (sameEmailAddresses.Any())
        {
            _db.RemoveRange(sameEmailAddresses);

            await _db.SaveChangesAsync();
        }

        TempData["message"] = "Successfully confirmed account!";
        await _signinManager.SignInAsync(user, true);

        return View(new RegisterViewModel(new AppUser()));
    }
}