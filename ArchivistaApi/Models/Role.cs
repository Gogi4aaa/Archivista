using System.Collections.Generic;

namespace ArchivistaApi.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        // Navigation properties
        public ICollection<UserRole> UserRoles { get; set; }
    }
} 