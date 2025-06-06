using System;
using System.Collections.Generic;

namespace ArchivistaApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; }
        
        // Navigation properties
        public ICollection<UserRole> UserRoles { get; set; }
    }
} 