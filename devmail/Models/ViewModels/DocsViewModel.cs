public class DocsViewModel : BaseViewModel
{
    public DocsViewModel(AppUser? u)
    {
        UserData = u;
        IsSignedIn = u == null ? false : true;
        CanonicalUrl = "https://devmailapi.com/docs";
    }

    public AppUser? UserData { get; set; } = null;
}
