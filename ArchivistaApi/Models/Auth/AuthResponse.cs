using System.Collections.Generic;

namespace ArchivistaApi.Models.Auth
{
    public class AuthResponse
    {
        public string Token { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public IList<string> Roles { get; set; }
        public long ExpiresIn { get; set; }
    }
} 