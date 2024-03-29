using APILogin.Models;
using JWT.Algorithms;
using JWT.Builder;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Security.Cryptography;
using System.Text.Json.Nodes;
using BC = BCrypt.Net.BCrypt;

namespace APILogin.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {

        const string URI_DOCKER = "http://host.docker.internal:8080/users";
        const string URI_STANDAR = "http://localhost:8080/users";

        [HttpPost]
        public IActionResult login(User user)
        {
            HttpClient client = new HttpClient();

            if (Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true")
            {
                Console.WriteLine("Ejecutando en docker");
                client.BaseAddress = new Uri(URI_DOCKER);
            }
            else
            {
                Console.WriteLine("Ejecutando en otra cosa");
                client.BaseAddress = new Uri(URI_STANDAR);
            }

            QueryString queryString = QueryString.Create("email", user.email);

            JObject? fullUser = null;

            HttpResponseMessage response = client.GetAsync(queryString.Value).Result;
            if (response.IsSuccessStatusCode)
            {
                fullUser = JObject.Parse(response.Content.ReadAsStringAsync().Result);
            }
            else
            {
                return StatusCode(StatusCodes.Status403Forbidden);
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
                                  .AddClaim("kid", "S12q4zYfzyWBwOAJymR7q4BANULcJEAZ")
                                  .AddClaim("id", fullUser.GetValue("id"))
                                  .IssuedAt(DateTime.UtcNow)
                                  .ExpirationTime(DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds())
                                  .Encode();

            JsonObject respuesta = new JsonObject();
            respuesta.Add("access_token", token.ToString());

            return Ok(respuesta.ToString());

        }
    }
}