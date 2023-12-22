using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Microsoft.AspNetCore.Identity.UI.Services;

public class AmazonEmailSender : IEmailSender
{

    private readonly IConfiguration _config;
    public AmazonEmailSender(IConfiguration config)
    {
        _config = config;
    }



    //OVERRIDE
    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        var destination = new Destination(new List<string>() { email });
        var emailSubject = new Content(subject);
        var emailBody = new Body(new Content(htmlMessage));
        var emailMessage = new Message(emailSubject, emailBody);

        var emailRequest = new SendEmailRequest("Accounts@devmailapi.com", destination, emailMessage);

        using (var client = new AmazonSimpleEmailServiceClient(_config["aws_key"], _config["aws_secret_key"], Amazon.RegionEndpoint.USEast1))
        {
            await client.SendEmailAsync(emailRequest);
        }
    }


}