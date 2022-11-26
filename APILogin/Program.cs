using APILogin.User;
using JWT.Algorithms;
using JWT.Builder;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Security.Cryptography;
using BC = BCrypt.Net.BCrypt;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

HttpClient client = new HttpClient
{
    BaseAddress = new Uri(builder.Configuration[key: "APIUsers"])
};

app.MapGet("/", () => "Hello World!");
app.MapPost("/login", login);

app.Run();


string login([FromBody] User user)
{
    QueryString queryString = QueryString.Create("email", user.email);

    JObject fullUser = null;

    HttpResponseMessage response = client.GetAsync(queryString.Value).Result;
    if (response.IsSuccessStatusCode)
    {
        fullUser = JObject.Parse(response.Content.ReadAsStringAsync().Result);
    }
    else
    {
        return "Fail";
    }

    string hashedPassword = fullUser.GetValue("password").ToString();


    bool verify = BC.Verify(user.password, hashedPassword);

    if (!verify)
    {
        return "False";
    }

    string privateKey = File.ReadAllText("./Keys/private.key");
    var privateKeySign = RSA.Create();
    privateKeySign.ImportFromPem(privateKey);

    string publicKey = File.ReadAllText("./Keys/public.key");
    var publicKeySign = RSA.Create();
    privateKeySign.ImportFromPem(privateKey);

    var token = JwtBuilder.Create()
                          .WithAlgorithm(new RS256Algorithm(publicKeySign, privateKeySign))
                          .AddClaim("name", fullUser.GetValue("name"))
                          .AddClaim("email", fullUser.GetValue("email"))
                          .AddClaim("role", fullUser.GetValue("role"))
                          .Encode();

    return token.ToString();


}