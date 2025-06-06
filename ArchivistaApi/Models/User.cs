using System;
using System.Collections.Generic;

namespace ArchivistaApi.Models
{
    public class User
    {
        public User()
        {
            Id = Guid.NewGuid(); // Initialize with a new GUID
            Artifacts = new List<Artifact>();
            UserRoles = new List<UserRole>();
        }

        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; }
        
        // Navigation properties
        public ICollection<Artifact> Artifacts { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }
    }
} 