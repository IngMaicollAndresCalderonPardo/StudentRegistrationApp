using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentRegistrationApp.Server.Data;
using StudentRegistrationApp.Server.Models;

namespace StudentRegistrationApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SubjectsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Subject>>> GetMaterias()
        {
            return await _context.Subjects.ToListAsync();
        }

        [HttpGet("HasRegisteredCourses/{documentNumber}")]
        public IActionResult HasRegisteredCourses(string documentNumber)
        {
            var estudiante = _context.Students
                .Include(e => e.StudentSubjects)
                .FirstOrDefault(e => e.DocumentNumber == documentNumber);

            if (estudiante == null)
            {
                return NotFound("Estudiante no encontrado.");
            }

            bool hasCourses = estudiante.StudentSubjects.Any();
            return Ok(hasCourses);
        }

        [HttpPost("RegisterCourses")]
        public async Task<IActionResult> RegisterCourses([FromBody] EnrollSubjectRequest request)
        {

            if (request == null || string.IsNullOrEmpty(request.DocumentNumber) || request.Subjects == null || !request.Subjects.Any())
            {
                return BadRequest(new { Message = "Datos inválidos para registrar materias." });
            }

            var estudiante = await _context.Students.FirstOrDefaultAsync(e => e.DocumentNumber == request.DocumentNumber);
            if (estudiante == null)
            {
                return NotFound(new { Message = "Estudiante no encontrado." });
            }
            var currentCount = await _context.StudentSubjects.CountAsync(ss => ss.StudentId == estudiante.StudentId);

            if (currentCount >= 3)
            {
                return BadRequest(new { Message = "Ya has inscrito el total permitido de materias (3)." });
            }

            foreach (var SubjectId in request.Subjects)
            {
                var materia = await _context.Subjects.FindAsync(SubjectId);
                if (materia == null)
                {
                    return NotFound(new { Message = $"Materia con ID {SubjectId} no encontrada." });
                }

                var estudianteMateria = new StudentSubject
                {
                    StudentId = estudiante.StudentId,
                    SubjectId = materia.SubjectId
                };
                _context.StudentSubjects.Add(estudianteMateria);
            }

            await _context.SaveChangesAsync();


            return Ok(new { Message = "Materias registradas exitosamente." });
        }

        [HttpGet("CoursesofStudents/{documentNumber}")]
        public IActionResult GetCoursesOfStudents(string documentNumber)
        {

            var estudiante = _context.Students
                .Include(e => e.StudentSubjects)
                .ThenInclude(em => em.Subject)
                .ThenInclude(m => m.Professor)
                .FirstOrDefault(e => e.DocumentNumber == documentNumber);

            if (estudiante == null)
            {
                return NotFound("Estudiante no encontrado.");
            }


            var materias = estudiante.StudentSubjects.Select(em => new
            {
                MateriaId = em.Subject.SubjectId,
                MateriaNombre = em.Subject.Name,
                EstudianteNombre = estudiante.Name,
                EstudianteApellido = estudiante.Lastname,
                ProfesorId = em.Subject.ProfessorId,
                ProfesorNombre = em.Subject.Professor.Name
            });

            return Ok(materias);
        }

        [HttpGet("StudentforCourses/{subjectId}")]
        public IActionResult GetStudentsForCourse(int subjectId)
        {

            var materia = _context.Subjects
                .Include(m => m.StudentSubjects)
                .ThenInclude(em => em.Student)
                .FirstOrDefault(m => m.SubjectId == subjectId);

            if (materia == null)
            {
                return NotFound("Materia no encontrada.");
            }


            var estudiantes = materia.StudentSubjects.Select(em => new
            {
                EstudianteNombre = em.Student.Name,
                EstudianteApellido = em.Student.Lastname
            });

            return Ok(estudiantes);
        }


        [HttpGet("GetSubjectsForStudent/{documentNumber}")]
        public IActionResult GetSubjectsForStudent(string documentNumber)
        {
            var estudiante = _context.Students
                .Include(e => e.StudentSubjects)
                .ThenInclude(ss => ss.Subject)
                .FirstOrDefault(e => e.DocumentNumber == documentNumber);

            if (estudiante == null)
            {
                return NotFound(new { Message = "Estudiante no encontrado." });
            }

            var materias = estudiante.StudentSubjects.Select(ss => new
            {
                SubjectId = ss.Subject.SubjectId,
                Name = ss.Subject.Name,
                ProfessorId = ss.Subject.ProfessorId
            });

            return Ok(materias);
        }


        [HttpDelete("DeleteSubject/{documentNumber}/{subjectId}")]
        public async Task<IActionResult> DeleteSubjectFromStudent(string documentNumber, int subjectId)
        {
            var estudiante = await _context.Students
                .Include(e => e.StudentSubjects)
                .FirstOrDefaultAsync(e => e.DocumentNumber == documentNumber);

            if (estudiante == null)
                return NotFound("Estudiante no encontrado.");

            var studentSubject = estudiante.StudentSubjects
                .FirstOrDefault(ss => ss.SubjectId == subjectId);

            if (studentSubject == null)
                return NotFound("La materia no está inscrita por este estudiante.");

            _context.StudentSubjects.Remove(studentSubject);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Materia eliminada correctamente." });
        }

    }
}
