using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using StudentRegistrationApp.Server.Data;
using StudentRegistrationApp.Server.Models;
using System.Linq;


namespace StudentRegistrationApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null || string.IsNullOrWhiteSpace(loginRequest.Username) || string.IsNullOrWhiteSpace(loginRequest.Password))
            {
                return BadRequest("Usuario o contraseña no pueden estar vacíos.");
            }

            var user = _context.Students.SingleOrDefault(u => u.DocumentNumber == loginRequest.Username);

            if (user == null)
            {
                return Unauthorized("Usuario no encontrado.");
            }

            if (user.Password != loginRequest.Password)
            {
                return Unauthorized("Contraseña incorrecta.");
            }


            return Ok(new { Message = "Inicio de sesión exitoso", Cedula = user.DocumentNumber });
        }
    }
}
