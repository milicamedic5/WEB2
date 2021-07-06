using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Web2.Data;
using Web2.Models;

namespace Web2.Repository
{
	public class UserRepository : GenericRepository<User>, IUserRepository
	{

		public UserRepository(DataContext context) : base(context) {}
		public async Task<IEnumerable<User>> GetAllUsers()
		{
			return await context.Users.ToListAsync();
		}

        public async Task<IdentityResult> SendConfirmationMail(User user)
        {
            var fromMail = new MailAddress("medic998.mil@gmail.com");
            var frontEmailPassowrd = "tastatura12";

            var toMail = new MailAddress(user.Email);
            string subject;
            string body;

            //if (usertype == "user")
            //{

            //    string confirmationToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
            //    string confirmationTokenHtmlVersion = HttpUtility.UrlEncode(confirmationToken);

            //    var varifyUrl = "http://localhost:4200/signin/" + user.Id + "/" +
            //        confirmationTokenHtmlVersion;

            //    subject = "Your account is successfull created. Please confirm your email.";
            //    body = "<br/><br/>We are excited to tell you that your account is" +
            //                    " successfully created. Please click on the below link to verify your account" +
            //                    " <br/><br/><a href='" + varifyUrl + "'> Click here</a> ";
            //}
            //else
            //{
            //    var loginurl = "http://localhost:4200/signin";

            //    subject = "Your account is successfull created.";
            //    body = "<br/>Your username is: " + user.UserName + "<br/>Password for your account is" + password + "<br/>" +
            //        "Please change your password when you log in. <br/>" +
            //        "Login to SkyRoads by clicking on this link: <a href='" + loginurl + "'> Login</a>";
            //}

            var loginurl = "http://localhost:3000/login";

            subject = "Your account is successfull created.";
            body = "<br/>Log in here: <a href='" + loginurl + "'> Login</a><br/>";

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromMail.Address, frontEmailPassowrd)
            };

            using (var message = new MailMessage(fromMail, toMail)
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            })
                smtp.Send(message);

            return IdentityResult.Success;
        }
    }
}
