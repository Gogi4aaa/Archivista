using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchivistaApi.Migrations
{
    /// <inheritdoc />
    public partial class RelationshipBetweenArtifactsAndUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Culture",
                table: "Artifacts",
                newName: "Type");

            migrationBuilder.AddColumn<int>(
                name: "CreatorId",
                table: "Artifacts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Artifacts_CreatorId",
                table: "Artifacts",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Artifacts_Users_CreatorId",
                table: "Artifacts",
                column: "CreatorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Artifacts_Users_CreatorId",
                table: "Artifacts");

            migrationBuilder.DropIndex(
                name: "IX_Artifacts_CreatorId",
                table: "Artifacts");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Artifacts");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Artifacts",
                newName: "Culture");
        }
    }
}
