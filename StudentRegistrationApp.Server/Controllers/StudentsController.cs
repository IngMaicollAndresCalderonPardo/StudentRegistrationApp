using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using StudentRegistrationApp.Server.Data;
using StudentRegistrationApp.Server.Models;

namespace StudentRegistrationApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            var students = await _context.Students.ToListAsync();
            return Ok(students);
        }

        [HttpGet("{documentNumber}")]
        public async Task<ActionResult<Student>> GetStudent(string documentNumber)
        {
            var student = await _context.Students.FirstOrDefaultAsync(e => e.DocumentNumber == documentNumber);

            if (student == null) return NotFound();
            return Ok(student);
        }

        [HttpPost]
        public async Task<ActionResult<Student>> PostStudent([FromBody] Student student)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _context.Students.AnyAsync(s => s.DocumentNumber == student.DocumentNumber))
            {
                return Conflict(new { Message = "Ya existe un usuario con ese documento." });
            }

            try
            {
                _context.Students.Add(student);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    student.StudentId,
                    student.Name,
                    student.Lastname,
                    student.DocumentNumber,
                    student.Email
                });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { Message = "Hubo un error al guardar el estudiante.", Error = ex.Message });
            }

        }


        [HttpPut("{documentNumber}")]
        public async Task<IActionResult> PutStudent(string documentNumber, StudentUpdateDto student)
        {
            var estudiante = await _context.Students.FirstOrDefaultAsync(e => e.DocumentNumber == documentNumber);
            if (estudiante == null)
                return NotFound("Estudiante no encontrado.");

            // Actualizar campos permitidos
            estudiante.Name = student.Name;
            estudiante.Lastname = student.Lastname;
            estudiante.Email = student.Email;
            estudiante.CellPhone = student.CellPhone;
            estudiante.Address = student.Address;

            await _context.SaveChangesAsync();

            return NoContent(); // 204
        }



        [HttpDelete("{documentNumber}")]
        public async Task<IActionResult> DeleteStudent(string documentNumber)
        {
            var student = await _context.Students
                                .Include(s => s.StudentSubjects)
                                .FirstOrDefaultAsync(e => e.DocumentNumber == documentNumber);
            if (student == null)
                return NotFound();

            // Elimina relaciones con materias si las hay
            _context.StudentSubjects.RemoveRange(student.StudentSubjects);

            // Elimina al estudiante
            _context.Students.Remove(student);

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

}
