using APILogin.Models;
using JWT.Algorithms;
using JWT.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System.Security.Cryptography;
using static System.Runtime.InteropServices.JavaScript.JSType;
using BC = BCrypt.Net.BCrypt;

namespace APILogin.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {
        [HttpPost]
        public IActionResult login(User user)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("http://localhost:8080/users");


            QueryString queryString = QueryString.Create("email", user.email);

            JObject? fullUser = null;

            Console.WriteLine(client.BaseAddress.ToString());
            Console.WriteLine(queryString.Value);

            HttpResponseMessage response = client.GetAsync(queryString.Value).Result;
            if (response.IsSuccessStatusCode)
            {
                fullUser = JObject.Parse(response.Content.ReadAsStringAsync().Result);
            }
            else
            {
                return StatusCode(StatusCodes.Status408RequestTimeout);
            }

            string hashedPassword = fullUser.GetValue("password").ToString();


            bool verify = BC.Verify(user.password, hashedPassword);

            if (!verify)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            string privateKey = System.IO.File.ReadAllText("./Keys/private.key");
            var privateKeySign = RSA.Create();
            privateKeySign.ImportFromPem(privateKey);

            string publicKey = System.IO.File.ReadAllText("./Keys/public.key");
            var publicKeySign = RSA.Create();
            privateKeySign.ImportFromPem(privateKey);

            var token = JwtBuilder.Create()
                                  .WithAlgorithm(new RS256Algorithm(publicKeySign, privateKeySign))
                                  .AddClaim("name", fullUser.GetValue("name"))
                                  .AddClaim("sub", fullUser.GetValue("email"))
                                  .AddClaim("role", fullUser.GetValue("role"))
                                  .IssuedAt(DateTime.UtcNow)
                                  .ExpirationTime(DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeMilliseconds())
                                  .Encode();

            HttpResponseMessage responseSendMessage = new HttpResponseMessage();
            responseSendMessage.Headers.Add("access_token", "Bearer " + token.ToString());

            return StatusCode(StatusCodes.Status200OK, responseSendMessage);


        }
    }
}