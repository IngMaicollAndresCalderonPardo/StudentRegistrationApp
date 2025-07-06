using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace StudentRegistrationApp.Server.Models
{
    public class Student
    {
        
        public int StudentId { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres.")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "El apellido es obligatorio.")]
        [StringLength(100, ErrorMessage = "El apellido no puede exceder los 100 caracteres.")]
        public string Lastname { get; set; } = null!;

        [Required(ErrorMessage = "El tipo de documento es obligatorio.")]
        public string? DocumentType { get; set; }

        [Required(ErrorMessage = "El número de documento es obligatorio.")]
        [StringLength(50, ErrorMessage = "El número de documento no puede exceder los 50 caracteres.")]
        public string? DocumentNumber { get; set; }

        [Required(ErrorMessage = "El correo es obligatorio.")]
        [EmailAddress(ErrorMessage = "El correo no tiene un formato válido.")]
        public string? Email { get; set; }


        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        [StringLength(100, ErrorMessage = "La contraseña no puede exceder los 100 caracteres.")]
        public string? Password { get; set; }

        [Required(ErrorMessage = "El teléfono es obligatorio.")]
        [StringLength(15, ErrorMessage = "El teléfono no puede exceder los 15 caracteres.")]
        [JsonPropertyName("cellphone")]
        public string? CellPhone { get; set; }

        [Required(ErrorMessage = "La dirección es obligatoria.")]
        [StringLength(200, ErrorMessage = "La dirección no puede exceder los 200 caracteres.")]
        public string? Address { get; set; }

        [Required(ErrorMessage = "La fecha de nacimiento es obligatoria.")]
        public DateTime Birthdate { get; set; }

        public ICollection<StudentSubject> StudentSubjects { get; set; } = new List<StudentSubject>();
    }
}
