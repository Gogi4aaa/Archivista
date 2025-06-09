using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchivistaApi.Migrations
{
    /// <inheritdoc />
    public partial class StoreImagesInDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhotoUrl",
                table: "Artifacts");

            migrationBuilder.AddColumn<string>(
                name: "ImageContentType",
                table: "Artifacts",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "Artifacts",
                type: "bytea",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageContentType",
                table: "Artifacts");

            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "Artifacts");

            migrationBuilder.AddColumn<string>(
                name: "PhotoUrl",
                table: "Artifacts",
                type: "text",
                nullable: true);
        }
    }
}
