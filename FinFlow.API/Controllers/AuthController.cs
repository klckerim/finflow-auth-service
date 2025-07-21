using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpGet("hello")]
    public IActionResult Hello() => Ok("Hello from AuthController!");
}

