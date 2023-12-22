using System.Text.RegularExpressions;
using System.Web;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class SendController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly UserManager<AppUser> _userManager;
    private readonly ApplicationDbContext _db;

    private readonly IConfiguration _config;


    public SendController(ILogger<HomeController> logger, UserManager<AppUser> usermanger, ApplicationDbContext db, IConfiguration config)
    {
        _logger = logger;
        _userManager = usermanger;
        _db = db;
        _config = config;
    }

    List<string> emailAddressesToSendTo = new List<string>();
    string? QueryErrorMessage = null;
    bool SendingQuotaExceeded = false;

    [HttpPost]
    public async Task<JsonResult> Index()
    {

        try
        {
            var query = Request.QueryString.ToString();
            _logger.LogInformation(query);

            if (!IsValidQuery(query))
            {
                Response.StatusCode = 400;
                BadApiResonse badQuery = new BadApiResonse
                {
                    status = 400,
                    message = QueryErrorMessage
                };

                return new JsonResult(badQuery);
            }

            var user = await _db.Users.FirstOrDefaultAsync(u => u.ApiKey == Request.Query["key"].ToString());
            //this api key must exist with a users account
            if (user == null)
            {
                Response.StatusCode = 400;
                BadApiResonse r1 = new BadApiResonse
                {
                    status = 400,
                    message = "Invalid API key"
                };

                return new JsonResult(r1);
            }

            //user must have comfirmed account before sending emails
            if (!user.EmailConfirmed)
            {
                Response.StatusCode = 400;
                BadApiResonse r2 = new BadApiResonse
                {
                    status = 400,
                    message = "You must verify your account before you start sending emails. Check your inbox for the verification link."
                };
                return new JsonResult(r2);
            }

            //must have enough api calls left to send email
            if (user.RemainingApiCalls == 0 || user.RemainingApiCalls - emailAddressesToSendTo.Count <= 0)
            {
                Response.StatusCode = 500;
                BadApiResonse r3 = new BadApiResonse
                {
                    status = 500,
                    message = "No remaining API calls left. Your API calls will refresh again within the next 24hrs. Check back soon!"
                };

                return new JsonResult(r3);
            }


            if (!await SendEmail(user))
            {
                Response.StatusCode = 500;
                BadApiResonse r4 = new BadApiResonse
                {
                    status = 500,
                    message = SendingQuotaExceeded ? "Our systems are not able to send any more emails for the next few hours. Please try again at another time." : "There was an error while sending email"
                };

                return new JsonResult(r4);
            }

            //update remaining calls in users account
            user.RemainingApiCalls = user.RemainingApiCalls - emailAddressesToSendTo.Count;
            await _userManager.UpdateAsync(user);

            //SUCCESS
            SuccessfulApiResponse r = new SuccessfulApiResponse
            {
                status = 200,
                email_body = Request.Query["msg"].ToString().Trim(),
                remaining_calls = user.RemainingApiCalls,
                sent_to = emailAddressesToSendTo.ToArray()
            };

            return new JsonResult(r);

        }
        catch (Exception ex)
        {
            Response.StatusCode = 500;
            BadApiResonse r = new BadApiResonse
            {
                status = 500,
                message = ex.ToString()
            };

            return new JsonResult(r);
        }
    }

    // makes sure query is formatted correctly
    private bool IsValidQuery(string u)
    {
        string q = HttpUtility.UrlDecode(u);

        if (q == "" || q == "?")
        {
            return false;
        }

        if (!Request.Query.ContainsKey("to") || !Request.Query.ContainsKey("msg") || !Request.Query.ContainsKey("key"))
        {
            QueryErrorMessage = "Missing url quries";
            return false;
        }

        //make sure email strings are valid
        string pattern = @"^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$";
        string[] emailsAddresses = Request.Query["to"].ToString().Split(",");

        foreach (var x in emailsAddresses)
        {
            if (!Regex.IsMatch(x, pattern))
            {
                QueryErrorMessage = "One or more emails have incorrect format";
                return false;
            }
        }

        //make sure not more than 3 emails are included in request
        if (Request.Query["to"].ToString().Split(",").Length > 1)
        {
            string[] a = Request.Query["to"].ToString().Split(",");
            if (a.Length > 3)
            {
                QueryErrorMessage = "Too many emails supplied, can have max of 3";
                return false;
            }
        }

        return true;
    }



    //sends email using AWS SES
    private async Task<bool> SendEmail(AppUser userSendingMail)
    {
        try
        {
            using (var client = new AmazonSimpleEmailServiceClient(_config["aws_key"], _config["aws_secret_key"], Amazon.RegionEndpoint.USEast1))
            {


                if (Request.Query["to"].ToString().Split(",").Length > 1)
                {
                    // there are multiple recipients
                    string[] a = Request.Query["to"].ToString().Split(",");
                    foreach (string x in a)
                    {
                        emailAddressesToSendTo.Add(x);
                    }
                }
                else
                {
                    //only 1 recipient
                    emailAddressesToSendTo.Add(Request.Query["to"].ToString());
                }

                // make sure sending quota is not exceeded with the amount of reciepients getting this email
                var quota = await client.GetSendQuotaAsync();

                if (quota.SentLast24Hours + emailAddressesToSendTo.Count > quota.Max24HourSend)
                {
                    SendingQuotaExceeded = true;
                    return false;
                }

                var destination = new Destination(emailAddressesToSendTo);

                var subject = new Content(!Request.Query.ContainsKey("subject") ? "DevMail" : Request.Query["subject"].ToString().Trim());

                var msgTrimmed = Request.Query["msg"].ToString().Trim();
                var body = new Body(new Content(msgTrimmed));

                var message = new Message(subject, body);
                var emailRequest = new SendEmailRequest($"{userSendingMail.UserName}@devmailapi.com", destination, message);

                await client.SendEmailAsync(emailRequest);

                //save email details to db
                EmailDetails d = new EmailDetails
                {
                    SentByUserId = userSendingMail.Id,
                    EmailBody = msgTrimmed,
                    SentOn = DateTime.Now.ToUniversalTime()
                };
                await _db.EmailDetails.AddAsync(d);
                await _db.SaveChangesAsync();

                //save recipients that got emails sent to inbox
                foreach (var x in emailAddressesToSendTo)
                {
                    Recipients r = new Recipients
                    {
                        EmailId = d.Id,
                        EmailAddress = x
                    };
                    await _db.Recipients.AddAsync(r);
                    await _db.SaveChangesAsync();
                }

                return true;
            }



        }
        catch (Exception ex)
        {
            _logger.LogError(ex.ToString());
            return false;
        }
    }
}

//structure of the json response
class SuccessfulApiResponse
{
    public int status { get; set; }
    public string email_body { get; set; }
    public int remaining_calls { get; set; }
    public string[] sent_to { get; set; }

}
class BadApiResonse
{
    public int status { get; set; }
    public string message { get; set; }
}