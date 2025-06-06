using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ArchivistaApi.Data;
using ArchivistaApi.Models;
using ArchivistaApi.Models.Auth;
using ArchivistaApi.Services.Interfaces;

namespace ArchivistaApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly ArchivistaContext _context;
        private readonly JwtService _jwtService;

        public AuthService(ArchivistaContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                throw new UnauthorizedAccessException("Invalid email or password");

            if (!VerifyPassword(request.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid email or password");

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return await GenerateAuthResponseAsync(user);
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email || u.Username == request.Username))
                throw new InvalidOperationException("User with this email or username already exists");

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = HashPassword(request.Password),
                FirstName = request.FirstName,
                LastName = request.LastName,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            // Add user to database
            _context.Users.Add(user);

            // Assign default "User" role
            var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "User");
            if (defaultRole != null)
            {
                _context.UserRoles.Add(new UserRole
                {
                    User = user,
                    RoleId = defaultRole.Id
                });
            }

            await _context.SaveChangesAsync();

            return await GenerateAuthResponseAsync(user);
        }

        private async Task<AuthResponse> GenerateAuthResponseAsync(User user)
        {
            var roles = await _context.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Include(ur => ur.Role)
                .Select(ur => ur.Role.Name)
                .ToListAsync();

            var token = _jwtService.GenerateToken(user, roles);

            return new AuthResponse
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                Roles = roles,
                ExpiresIn = _jwtService.GetExpirationInSeconds()
            };
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private static bool VerifyPassword(string password, string hash)
        {
            var hashedPassword = HashPassword(password);
            return hashedPassword == hash;
        }
    }
} 