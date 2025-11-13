using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Tangled.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Materials",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Brand = table.Column<string>(type: "TEXT", nullable: true),
                    Color = table.Column<string>(type: "TEXT", nullable: true),
                    Weight = table.Column<int>(type: "INTEGER", nullable: true),
                    FiberContent = table.Column<string>(type: "TEXT", nullable: true),
                    Yardage = table.Column<int>(type: "INTEGER", nullable: true),
                    RemainingYardage = table.Column<int>(type: "INTEGER", nullable: true),
                    SkeinQuantity = table.Column<int>(type: "INTEGER", nullable: true),
                    DyeLot = table.Column<string>(type: "TEXT", nullable: true),
                    PurchaseDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    PurchasedAt = table.Column<string>(type: "TEXT", nullable: true),
                    PurchasePrice = table.Column<decimal>(type: "TEXT", precision: 10, scale: 2, nullable: true),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: true),
                    Notes = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Materials", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProjectIdeas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    InspirationLinks = table.Column<string>(type: "TEXT", nullable: true),
                    EstimatedDifficulty = table.Column<string>(type: "TEXT", nullable: true),
                    Notes = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectIdeas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    CraftType = table.Column<int>(type: "INTEGER", nullable: false),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    PatternName = table.Column<string>(type: "TEXT", nullable: true),
                    PatternLink = table.Column<string>(type: "TEXT", nullable: true),
                    HookOrNeedleSize = table.Column<string>(type: "TEXT", nullable: true),
                    Notes = table.Column<string>(type: "TEXT", nullable: true),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CompletionDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    IsFavorite = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProjectImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProjectId = table.Column<int>(type: "INTEGER", nullable: false),
                    FileName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    FilePath = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectImages_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectMaterials",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProjectId = table.Column<int>(type: "INTEGER", nullable: false),
                    MaterialId = table.Column<int>(type: "INTEGER", nullable: false),
                    YardsUsed = table.Column<int>(type: "INTEGER", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectMaterials", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectMaterials_Materials_MaterialId",
                        column: x => x.MaterialId,
                        principalTable: "Materials",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectMaterials_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Materials",
                columns: new[] { "Id", "Brand", "Color", "CreatedAt", "DyeLot", "FiberContent", "ImageUrl", "Name", "Notes", "PurchaseDate", "PurchasePrice", "PurchasedAt", "RemainingYardage", "SkeinQuantity", "UpdatedAt", "Weight", "Yardage" },
                values: new object[,]
                {
                    { 1, "Lion Brand", "Navy", new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "80% Acrylic, 20% Wool", null, "Wool-Ease Yarn", null, null, null, null, 197, 3, new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), 4, 197 },
                    { 2, "Lily Sugar'n Cream", "Hot Pink", new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "100% Cotton", null, "Cotton Yarn", null, null, null, null, 60, 2, new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), 4, 120 },
                    { 3, "Cascade Yarns", "Sage Green", new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "100% Baby Alpaca", null, "Baby Alpaca Fingering", null, null, null, null, 437, 2, new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, 437 }
                });

            migrationBuilder.InsertData(
                table: "ProjectIdeas",
                columns: new[] { "Id", "CreatedAt", "Description", "EstimatedDifficulty", "InspirationLinks", "Name", "Notes", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Delicate triangular shawl with intricate lace pattern", "Advanced", null, "Lace Shawl", "Want to use the sage green alpaca yarn for this", new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Cute stuffed octopus toy", "Intermediate", null, "Amigurumi Octopus", null, new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "CompletionDate", "CraftType", "CreatedAt", "HookOrNeedleSize", "IsFavorite", "Name", "Notes", "PatternLink", "PatternName", "StartDate", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 10, 17, 0, 0, 0, 0, DateTimeKind.Utc), 0, new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "US 8", true, "Cozy Winter Scarf", "Made as a gift for mom. She loved it!", null, "Simple Garter Stitch Scarf", new DateTime(2025, 10, 2, 0, 0, 0, 0, DateTimeKind.Utc), 2, new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, null, 1, new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "5.5mm", false, "Granny Square Blanket", "Working on this during my commute. 45 squares done, need 64 total.", null, "Classic Granny Square", new DateTime(2025, 9, 2, 0, 0, 0, 0, DateTimeKind.Utc), 1, new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2025, 10, 27, 0, 0, 0, 0, DateTimeKind.Utc), 2, new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, "Floral Embroidery Hoop", "Used DMC floss in various colors. Framed in 8-inch hoop.", null, "Wildflower Bouquet", new DateTime(2025, 10, 12, 0, 0, 0, 0, DateTimeKind.Utc), 2, new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "ProjectMaterials",
                columns: new[] { "Id", "CreatedAt", "MaterialId", "ProjectId", "YardsUsed" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, 1, 250 },
                    { 2, new DateTime(2025, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), 2, 2, 60 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectImages_ProjectId",
                table: "ProjectImages",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMaterials_MaterialId",
                table: "ProjectMaterials",
                column: "MaterialId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMaterials_ProjectId",
                table: "ProjectMaterials",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectIdeas");

            migrationBuilder.DropTable(
                name: "ProjectImages");

            migrationBuilder.DropTable(
                name: "ProjectMaterials");

            migrationBuilder.DropTable(
                name: "Materials");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
