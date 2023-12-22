using Microsoft.EntityFrameworkCore;

public class AccountViewModel : BaseViewModel
{
    public AccountViewModel(AppUser? u, ApplicationDbContext db, EmailHistory[]? emailHistory)
    {
        userData = u;
        EmailHistory = emailHistory;
        IsSignedIn = u == null ? false : true;
        CanonicalUrl = "https://devmailapi.com/account";
    }

    public AppUser? userData { get; set; } = null;
    public EmailHistory[]? EmailHistory { get; set; } = null;
}
