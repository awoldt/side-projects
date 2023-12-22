//checks if user is signed in on each controller action
//user for rendering user data on frontend

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace gettmail_final.services.acctSession;

public class AccountSession
{
    public async Task<AppUser?> IsUserSignedIn(System.Security.Claims.ClaimsPrincipal user, SignInManager<AppUser> _signInManager, UserManager<AppUser> _userManager)
    {
        try
        {
            if (_signInManager.IsSignedIn(user))
            {
                var u = await _userManager.GetUserAsync(user);
                if (u == null)
                {
                    await _signInManager.SignOutAsync();
                    return null;
                }

                return u;
            }

            return null;

        }
        catch (Exception ex)
        {
            return null;
        }
    }


}