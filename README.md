
# StudentRegistrationApp

Aplicación web completa para el registro y gestión de estudiantes, desarrollada como parte de una prueba técnica.

---

## 🧾 Requisitos de la prueba técnica

La aplicación cumple con los siguientes requisitos:

- [x] CRUD para registro de estudiantes.
- [x] Asociación de estudiantes a un programa de créditos.
- [x] Catálogo de 10 materias disponibles.
- [x] Cada materia equivale a 3 créditos.
- [x] El estudiante puede inscribirse solo a 3 materias.
- [x] Existen 5 profesores, cada uno dicta 2 materias.
- [x] Un estudiante no puede tener clases con el mismo profesor.
- [x] El estudiante puede ver el nombre de los compañeros con los que comparte materias.
- [x] Sistema de login y registro con validaciones.
- [x] Actualización del perfil del estudiante.

---

## 🛠️ Tecnologías utilizadas

### Frontend
- Angular 17
- Angular Material
- Reactive Forms
- HTTPS local con mkcert

### Backend
- .NET 8 Web API
- Entity Framework Core
- MySQL

---

## 🧪 Funcionalidades destacadas

- Validaciones de formularios (nombre, correo, teléfono, contraseña, etc.)
- Registro y login con validaciones robustas
- Control de materias por estudiante (máximo 3 y sin repetir profesor)
- Visualización de compañeros por materia
- Actualización de datos personales desde el perfil
- Separación de proyectos frontend y backend

---

## 🚀 Instrucciones de instalación

### 🔁 Clonar el repositorio

```bash
git clone https://github.com/IngMaicollAndresCalderonPardo/StudentRegistrationApp.git
```

---

### 🖥️ Backend (.NET)

1. Ir a la carpeta del backend (por ejemplo, `StudentRegistrationApp.Server`).
2. Verificar que la cadena de conexión a MySQL esté correcta en `appsettings.json`.
3. Ejecutar las migraciones (ya incluidas):

```bash
dotnet ef database update
```

4. Iniciar el backend:

```bash
dotnet run
```

---

### 🌐 Frontend (Angular)

1. Ir a la carpeta `studentregistrationapp.client`.
2. Instalar dependencias:

```bash
npm install
```

3. (Solo una vez) generar certificados SSL para localhost:

```bash
mkcert -install
mkcert localhost
```

4. Correr Angular con HTTPS:

```bash
ng serve --ssl true --ssl-key ../localhost-key.pem --ssl-cert ../localhost.pem
```

---

## 🧪 Ejecución del proyecto

- El servidor (`.NET`) se ejecuta desde consola con `dotnet run`.
- El cliente (`Angular`) se ejecuta en navegador desde `https://localhost:<puerto>`.

---

## 🧑‍💻 Autor

**Maicoll Andrés Calderón Pardo**  
GitHub: [@IngMaicollAndresCalderonPardo](https://github.com/IngMaicollAndresCalderonPardo)

---

## 📝 Licencia

Proyecto desarrollado con fines técnicos y educativos.
