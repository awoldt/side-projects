using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Text;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using Supabase;
using Supabase.Gotrue;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

class Utils
{
    private static StorageClient _googleStorageClient;

    static Utils()
    {
        _googleStorageClient = StorageClient.Create(GoogleCredential.FromFile(Path.Combine(AppContext.BaseDirectory, "gcloud-key.json")));
    }

    static public string GenerateRandomFilename()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder str = new StringBuilder();
        Random r = new Random();

        for (int i = 0; i < 16; i++)
        {
            str.Append(chars[r.Next(chars.Length)]);
        }

        string timestamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");
        return str.ToString() + "_" + timestamp + ".png";
    }

    static public async Task<string?> UploadToGoogleCloud(string filepath, string filename)
    {
        try
        {
            using var fileStream = File.OpenRead(filepath);
            var imageObject = await _googleStorageClient.UploadObjectAsync("screenshot_uploads", filename, "image/png", fileStream);

            return imageObject.MediaLink;
        }
        catch (System.Exception err)
        {
            Console.WriteLine($"error: {err}");
            return null;
        }
    }
}

class SupabaseService
{
    private static Supabase.Client _supabaseClient;

    static SupabaseService()
    {
        _supabaseClient = new Supabase.Client("https://mvrhhjxkjwltjefgwecx.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cmhoanhrandsdGplZmd3ZWN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjY5MTc5MCwiZXhwIjoyMDM4MjY3NzkwfQ.g8V-ZQwUdszdyl8WwlXWYIn1VEhxX2Tuc9FXVnYrpQc", new SupabaseOptions { AutoConnectRealtime = true });
    }

    static public async Task<Supabase.Postgrest.Responses.ModeledResponse<Users>?> GetUser(string apiKey)
    {
        try
        {
            var user = await _supabaseClient.From<Users>().Where(x => x.ApiKey == apiKey).Get();
            if (user.Models == null || user.Models.Count == 0)
            {
                Console.WriteLine($"Could not find user with api_key of {apiKey}");
                return null;
            }

            return user;
        }
        catch (System.Exception err)
        {
            Console.WriteLine(err);
            return null;
        }
    }

    static public async Task<bool> InsertScreenshotRecord(int userID, string screenshotURL, string siteUrl, string createdAt, long timeToScreenshot, long fileSize)
    {
        Console.WriteLine(fileSize);
        try
        {
            await _supabaseClient.From<Screenshots>().Insert(new Screenshots
            {
                Fk_User_ID = userID,
                ScreenshotUrl = screenshotURL,
                DeleteAt = null,
                CreatedAt = createdAt,
                SiteUrl = siteUrl,
                TimeToScreenshot = timeToScreenshot,
                FileSize = fileSize / 1000 // get in kb
            });

            return true;
        }
        catch (System.Exception err)
        {
            Console.WriteLine(err);
            return false;
        }
    }

    public static async Task<Supabase.Postgrest.Responses.ModeledResponse<Users>?> UpdateRemainingScreenshots(int userId, int CurrentCount)
    {
        try
        {
            var updatedRecord = await _supabaseClient.From<Users>()
            .Where(x => x.Id == userId)
            .Set(x => x.ScreenshotsRemaining, CurrentCount - 1)
            .Update();

            return updatedRecord;
        }
        catch (System.Exception err)
        {
            Console.WriteLine(err);
            return null;
        }
    }
}

/// TABLES
///////////////////////////////////////////////////////////////////
/// TABLES

[Supabase.Postgrest.Attributes.Table("users")]
class Users : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }

    [Supabase.Postgrest.Attributes.Column("fk_authuser_id")]
    public string FK_AuthUser_ID { get; set; }

    [Supabase.Postgrest.Attributes.Column("api_key")]
    public string ApiKey { get; set; }

    [Supabase.Postgrest.Attributes.Column("screenshots_remaining")]
    public int ScreenshotsRemaining { get; set; }
}

[Supabase.Postgrest.Attributes.Table("screenshots")]
class Screenshots : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }

    [Supabase.Postgrest.Attributes.Column("fk_user_id")]
    public int Fk_User_ID { get; set; }

    [Supabase.Postgrest.Attributes.Column("created_at")]
    public string CreatedAt { get; set; }

    [Supabase.Postgrest.Attributes.Column("screenshot_url")]
    public string ScreenshotUrl { get; set; }

    [Supabase.Postgrest.Attributes.Column("delete_at")]
    public string? DeleteAt { get; set; }

    [Supabase.Postgrest.Attributes.Column("site_url")]
    public string SiteUrl { get; set; }

    [Supabase.Postgrest.Attributes.Column("time_to_screenshot_ms")]
    public long TimeToScreenshot { get; set; }

    [Supabase.Postgrest.Attributes.Column("file_size_kb")]
    public long FileSize { get; set; }
}
