using Microsoft.EntityFrameworkCore.Migrations;

namespace ArchivistaApi.Data.Migrations
{
    public partial class UpdateDefaultUser : Migration
    {
        private static readonly Guid DefaultUserId = Guid.Parse("11111111-1111-1111-1111-111111111111");

        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Update default user with required fields
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: DefaultUserId,
                columns: new[] { 
                    "FirstName",
                    "LastName",
                    "IsActive"
                },
                values: new object[] {
                    "System",
                    "User",
                    true
                }
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reset default user fields
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: DefaultUserId,
                columns: new[] { 
                    "FirstName",
                    "LastName",
                    "IsActive"
                },
                values: new object[] {
                    "",
                    "",
                    false
                }
            );
        }
    }
} 