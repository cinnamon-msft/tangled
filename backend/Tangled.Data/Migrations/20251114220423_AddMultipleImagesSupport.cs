using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tangled.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMultipleImagesSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MaterialImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MaterialId = table.Column<int>(type: "INTEGER", nullable: false),
                    FileName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    FilePath = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaterialImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MaterialImages_Materials_MaterialId",
                        column: x => x.MaterialId,
                        principalTable: "Materials",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectIdeaImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProjectIdeaId = table.Column<int>(type: "INTEGER", nullable: false),
                    FileName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    FilePath = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectIdeaImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectIdeaImages_ProjectIdeas_ProjectIdeaId",
                        column: x => x.ProjectIdeaId,
                        principalTable: "ProjectIdeas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MaterialImages_MaterialId",
                table: "MaterialImages",
                column: "MaterialId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectIdeaImages_ProjectIdeaId",
                table: "ProjectIdeaImages",
                column: "ProjectIdeaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MaterialImages");

            migrationBuilder.DropTable(
                name: "ProjectIdeaImages");
        }
    }
}
