using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Web2.Migrations
{
    public partial class addedWorkRequests : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WorkRequests",
                columns: table => new
                {
                    WorkRequestId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(nullable: true),
                    Status = table.Column<string>(nullable: true),
                    Incident = table.Column<string>(nullable: true),
                    StartDate = table.Column<DateTime>(nullable: false),
                    EndDate = table.Column<DateTime>(nullable: false),
                    CreatedById = table.Column<string>(nullable: true),
                    Purpose = table.Column<string>(nullable: true),
                    Details = table.Column<string>(nullable: true),
                    Notes = table.Column<string>(nullable: true),
                    EmergencyWork = table.Column<bool>(nullable: false),
                    Company = table.Column<string>(nullable: true),
                    Phone = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkRequests", x => x.WorkRequestId);
                    table.ForeignKey(
                        name: "FK_WorkRequests_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkRequests_CreatedById",
                table: "WorkRequests",
                column: "CreatedById");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorkRequests");
        }
    }
}
