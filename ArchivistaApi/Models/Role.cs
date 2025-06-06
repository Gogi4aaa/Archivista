using System.Collections.Generic;

namespace ArchivistaApi.Models
{
    public class Role
    {
        public Role()
        {
            this.UserRoles = new List<UserRole>();
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        // Navigation properties
        public ICollection<UserRole> UserRoles { get; set; }
    }
} 