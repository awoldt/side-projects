public class RegisterViewModel : BaseViewModel
{
    public RegisterViewModel(AppUser? u)
    {
        IsSignedIn = u == null ? false : true;
        CanonicalUrl = "https://devmailapi.com/register";
    }
}