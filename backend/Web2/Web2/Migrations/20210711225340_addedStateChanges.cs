using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Web2.Migrations
{
    public partial class addedStateChanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StateChanges",
                columns: table => new
                {
                    StateChangeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChangeDate = table.Column<DateTime>(nullable: false),
                    State = table.Column<string>(nullable: true),
                    WorkRequestId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StateChanges", x => x.StateChangeId);
                    table.ForeignKey(
                        name: "FK_StateChanges_WorkRequests_WorkRequestId",
                        column: x => x.WorkRequestId,
                        principalTable: "WorkRequests",
                        principalColumn: "WorkRequestId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StateChanges_WorkRequestId",
                table: "StateChanges",
                column: "WorkRequestId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StateChanges");
        }
    }
}
