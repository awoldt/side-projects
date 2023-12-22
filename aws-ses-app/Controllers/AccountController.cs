using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using gettmail_final.services.acctSession;

public class AccountController : Controller
{

    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;
    private readonly ApplicationDbContext _db;
    private readonly ILogger<AccountController> _log;

    public AccountController(ILogger<AccountController> logger, SignInManager<AppUser> signin, UserManager<AppUser> usermanger, ApplicationDbContext db)
    {
        _signInManager = signin;
        _userManager = usermanger;
        _db = db;
        _log = logger;
    }

    public async Task<IActionResult> Index()
    {
        try
        {
            AccountSession acctSession = new AccountSession();
            AppUser? userData = await acctSession.IsUserSignedIn(User, _signInManager, _userManager);

            if (userData == null)
            {
                return Redirect("/register");
            }

            EmailHistory[]? history = await GetEmailHistory(_db, userData);
            if (history != null)
            {
                if (history.Length > 5)
                {
                    Array.Resize(ref history, 5);
                }
            }

            AccountViewModel viewM = new AccountViewModel(userData, _db, history);
            
            return View(viewM);
        }
        catch (Exception ex)
        {
            _log.LogError(ex.ToString());
            return Redirect("/register");
        }
    }

    private async Task<EmailHistory[]?> GetEmailHistory(ApplicationDbContext db, AppUser? user)
    {
        if (user == null)
        {
            return null;
        }

        try
        {
            var emailHistory = await db.EmailDetails
            .Where(e => e.SentByUserId == user.Id)
            .Join(
                db.Recipients,
                email => email.Id,
                recipient => recipient.EmailId,
                (email, recipients) => new
                {
                    Email = email,
                    Recipient = recipients
                })
            .GroupBy(x => x.Email)
            .Select(group => new EmailHistory
            {
                EmailBody = group.Key.EmailBody,
                SentOn = group.Key.SentOn.ToString(),
                SentTo = group.Select(x => x.Recipient.EmailAddress).ToArray()
            })
            .ToArrayAsync();

            Array.Reverse(emailHistory);


            return emailHistory;

        }
        catch (Exception ex)
        {
            _log.LogError(ex.ToString());
            return null;
        }
    }

}
public class EmailHistory
{
    public string EmailBody { get; set; }
    public string SentOn { get; set; }
    //all the recipients each email was sent to
    public string[] SentTo { get; set; }
}



