using Microsoft.AspNetCore.Identity;

public class AppUser : IdentityUser
{
    public DateTime AccountCreatedOn { get; set; }
    public string ApiKey { get; set; }
    public int RemainingApiCalls { get; set; }

    // Define a navigation property to represent the relationship
    public ICollection<EmailDetails> SentEmails { get; set; }
}