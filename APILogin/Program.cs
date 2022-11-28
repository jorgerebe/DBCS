using APILogin.User;
using JWT.Algorithms;
using JWT.Builder;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Security.Cryptography;
using BC = BCrypt.Net.BCrypt;

var MyAllowSpecificOrigins = "_MyAllowSubdomainPolicy";


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();
app.UseCors(MyAllowSpecificOrigins);


HttpClient client = new HttpClient
{
    BaseAddress = new Uri(builder.Configuration[key: "APIUsers"])
};

app.MapGet("/", () => "Hello World!");
app.MapPost("/login", login);

app.Run();


HttpResponseMessage login([FromBody] User user)
{
    QueryString queryString = QueryString.Create("email", user.email);

    JObject? fullUser = null;

    HttpResponseMessage response = client.GetAsync(queryString.Value).Result;
    if (response.IsSuccessStatusCode)
    {
        fullUser = JObject.Parse(response.Content.ReadAsStringAsync().Result);
    }
    else
    {
        HttpResponseMessage bad = new HttpResponseMessage();

        bad.Content = new StringContent("Failed Login");
        bad.StatusCode = (System.Net.HttpStatusCode)StatusCodes.Status408RequestTimeout;

        return bad;
    }

    string hashedPassword = fullUser.GetValue("password").ToString();


    bool verify = BC.Verify(user.password, hashedPassword);

    if (!verify)
    {
        HttpResponseMessage bad = new HttpResponseMessage();

        bad.Content = new StringContent("Wrong Login");
        bad.StatusCode = (System.Net.HttpStatusCode)StatusCodes.Status403Forbidden;

        return bad;

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
                          .AddClaim("sub", fullUser.GetValue("email"))
                          .AddClaim("role", fullUser.GetValue("role"))
                          .IssuedAt(DateTime.UtcNow)
                          .ExpirationTime(DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeMilliseconds())
                          .Encode();

    HttpResponseMessage responseSend = new HttpResponseMessage();

    responseSend.Headers.Add("access_token", "Bearer " + token.ToString());

    return responseSend;


}