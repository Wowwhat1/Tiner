using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tiner.Data.Migrations
{
    /// <inheritdoc />
    public partial class MatchedByUserAndUsersMatchedAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MatchedUsers",
                columns: table => new
                {
                    SrcUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    TargetUserId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchedUsers", x => new { x.SrcUserId, x.TargetUserId });
                    table.ForeignKey(
                        name: "FK_MatchedUsers_AppUsers_SrcUserId",
                        column: x => x.SrcUserId,
                        principalTable: "AppUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatchedUsers_AppUsers_TargetUserId",
                        column: x => x.TargetUserId,
                        principalTable: "AppUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MatchedUsers_TargetUserId",
                table: "MatchedUsers",
                column: "TargetUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MatchedUsers");
        }
    }
}
