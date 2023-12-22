using Microsoft.AspNetCore.Razor.TagHelpers;

public class HomeViewModel : BaseViewModel
{
    public HomeViewModel(AppUser? u)
    {
        IsSignedIn = u == null ? false : true;
        CanonicalUrl = "https://devmailapi.com";
    }
}