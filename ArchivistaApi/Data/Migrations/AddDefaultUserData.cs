using Microsoft.EntityFrameworkCore.Migrations;

namespace ArchivistaApi.Data.Migrations
{
    public partial class AddDefaultUserData : Migration
    {
        private static readonly Guid DefaultUserId = Guid.Parse("11111111-1111-1111-1111-111111111111");

        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add default roles if they don't exist
            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name", "Description" },
                values: new object[,]
                {
                    { 1, "Admin", "Administrator role with full access" },
                    { 2, "User", "Standard user role" }
                }
            );

            // Add default user
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { 
                    "Id", 
                    "Username", 
                    "Email", 
                    "PasswordHash", 
                    "FirstName",
                    "LastName",
                    "CreatedAt",
                    "IsActive"
                },
                values: new object[] { 
                    DefaultUserId,
                    "system",
                    "system@archivista.local",
                    "AQAAAAIAAYagAAAAELPkgKoqz3wMcc9dKrNxH+b2UxwJKxf6dYZnHhqZ8EZF9zj+0oMAXYHgfGKppXQpqg==", // hashed value of "password123"
                    "System",
                    "User",
                    DateTime.UtcNow,
                    true
                }
            );

            // Assign admin role to default user
            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "UserId", "RoleId" },
                values: new object[] { DefaultUserId, 1 } // RoleId 1 is Admin
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumns: new[] { "UserId", "RoleId" },
                keyValues: new object[] { DefaultUserId, 1 }
            );

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: DefaultUserId
            );

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValues: new object[] { 1, 2 }
            );
        }
    }
} 