using System.Threading.Tasks;
using ArchivistaApi.Models.Auth;

namespace ArchivistaApi.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
    }
} 