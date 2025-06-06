using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ArchivistaApi.Migrations
{
    /// <inheritdoc />
    public partial class ConvertArtifactIdToUuid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the primary key constraint
            migrationBuilder.DropPrimaryKey(
                name: "PK_Artifacts",
                table: "Artifacts");

            // Add a temporary column for the new UUID
            migrationBuilder.AddColumn<Guid>(
                name: "NewId",
                table: "Artifacts",
                type: "uuid",
                nullable: false,
                defaultValueSql: "uuid_generate_v4()");

            // Drop the old ID column
            migrationBuilder.DropColumn(
                name: "Id",
                table: "Artifacts");

            // Rename the new UUID column to Id
            migrationBuilder.RenameColumn(
                name: "NewId",
                table: "Artifacts",
                newName: "Id");

            // Add the primary key constraint back
            migrationBuilder.AddPrimaryKey(
                name: "PK_Artifacts",
                table: "Artifacts",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            throw new NotSupportedException("This migration cannot be reverted.");
        }
    }
}
