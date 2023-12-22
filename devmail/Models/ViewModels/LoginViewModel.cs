public class LoginViewModel : BaseViewModel
{
    public LoginViewModel(AppUser? u)
    {
        IsSignedIn = u == null ? false : true;
        CanonicalUrl = "https://devmailapi.com/login";
    }
}