# Manual de Uso — Sistema de Gestión CDR
### Universidad del Valle · Área de Cultura y Deporte

---

## ¿Qué es este sistema?

El sistema CDR es un conjunto de plataformas digitales que trabajan juntas para gestionar todas las actividades del área de Cultura y del Centro Deportivo Universitario (CDU). Hay una plataforma central llamada **CDR Landing** que actúa como puerta de entrada para los administradores, y desde allí se puede acceder a todas las demás sin necesidad de iniciar sesión nuevamente en cada una.

Las plataformas están organizadas en dos grandes áreas:

- **Área de Cultura:** Bitácora AC, Bitácora COM, Stock Cultura, Horarios Cultura, Asistencias Cultura
- **Área de Deporte (CDU):** GymControl CDU, Stock CDU, Horarios CDU, Asistencias Deporte

---

## Tipos de usuarios y cómo ingresan

Antes de explicar cada plataforma, es importante entender quiénes usan el sistema y cómo entran.

### Superadministrador
Tiene acceso total a todas las plataformas de ambas áreas. Ingresa por el CDR Landing con su correo y contraseña. Puede ver estadísticas de todas las plataformas desde un solo lugar y crear nuevos usuarios administradores o monitores.

### Administrador
Tiene acceso completo a las plataformas de su área (Cultura o Deporte). Ingresa por el CDR Landing con su correo y contraseña. Desde allí navega a las plataformas que le corresponden.

### Monitor
Tiene acceso limitado a las plataformas que le fueron asignadas. Ingresa por el CDR Landing con su correo y contraseña. Solo ve las plataformas de su área y dentro de ellas solo puede hacer las acciones propias de su rol.

### Usuarios con acceso directo (sin CDR Landing)
Algunas plataformas tienen su propio sistema de ingreso independiente:
- **GymControl CDU:** Los monitores, encargados y administradores del gimnasio ingresan directamente por la página de login de esa plataforma usando su número de cédula y contraseña.
- **Asistencias (Cultura y Deporte):** Los monitores, entrenadores y directores pueden ingresar directamente por el login de Asistencias con su correo y contraseña, sin pasar por el CDR Landing.

---

## CDR Landing — La plataforma central

**¿Para qué sirve?**
Es el punto de entrada principal para administradores y monitores. Desde aquí se accede a todas las demás plataformas con un solo clic, sin necesidad de volver a iniciar sesión en cada una (esto se llama inicio de sesión único o SSO).

**¿Cómo ingresar?**
1. Ir a la dirección web del CDR Landing.
2. Hacer clic en "Iniciar sesión".
3. Ingresar con correo y contraseña, o con cuenta de Google si está habilitado.
4. Según el rol asignado, el sistema redirige automáticamente al panel correspondiente.

**Paneles según rol:**

- **Superadministrador:** Ve el panel completo con estadísticas de todas las plataformas, puede crear usuarios nuevos, asignar roles y áreas, y acceder a cualquier plataforma.
- **Administrador:** Ve el panel de su área con estadísticas y acceso a las plataformas que le corresponden.
- **Monitor:** Ve un panel simplificado con acceso solo a las plataformas que le fueron asignadas.

**¿Qué se puede ver en el dashboard?**
El dashboard del CDR Landing muestra en tiempo real:
- Total de asistencias registradas en el área de Cultura y Deporte
- Personas únicas que han asistido
- Grupos activos
- Gráficas de tendencia de asistencia por semana o mes
- Distribución por género y por estamento (estudiante, docente, administrativo, etc.)
- Ranking de grupos con más y menos asistencia
- Estadísticas del gimnasio (accesos, usuarios registrados)
- Estado del inventario de Stock CDU y Stock Cultura (ítems disponibles, préstamos activos)

**Navegación entre plataformas:**
Desde la sección "Plataformas" del dashboard, se puede hacer clic en cualquier plataforma y el sistema abre esa plataforma en una nueva pestaña, ya con la sesión iniciada automáticamente.

---

## Asistencias — Sistema de inscripciones y asistencia

**¿Para qué sirve?**
Gestiona las inscripciones de estudiantes y el registro de asistencia a grupos culturales y deportivos. Es la plataforma más completa en cuanto a datos de personas.

**¿Cómo ingresan los administradores?**
Desde el CDR Landing, haciendo clic en "Asistencias Cultura" o "Asistencias Deporte". El sistema los lleva directamente sin pedir contraseña de nuevo.

**¿Cómo ingresan los monitores, entrenadores y directores?**
Pueden ingresar directamente por la página de login de Asistencias con su correo y contraseña. No necesitan pasar por el CDR Landing.

**Roles dentro de Asistencias:**

| Rol | Qué puede hacer |
|-----|----------------|
| Superadministrador | Todo: ver ambas áreas, gestionar usuarios, generar reportes combinados |
| Administrador | Todo dentro de su área (Cultura o Deporte) |
| Director | Solo ve y gestiona su grupo cultural asignado |
| Monitor (Cultura) | Solo ve y registra asistencia de su grupo asignado |
| Monitor (Deporte) | Puede tener varios grupos asignados |
| Entrenador | Varios grupos deportivos, registra asistencia |
| Estudiante | Se inscribe en grupos y ve su propia información |

**Flujo de uso típico:**

1. Un estudiante llega a inscribirse. El administrador o monitor abre el formulario de inscripción y registra sus datos (nombre, cédula, programa, etc.).
2. El estudiante queda inscrito en un grupo.
3. Cada vez que el estudiante asiste a una sesión, el monitor escanea un código QR o registra la asistencia manualmente.
4. El sistema acumula los registros y genera estadísticas automáticamente.

**Estadísticas disponibles:**
- Total de asistencias por grupo, por fecha, por período
- Personas únicas que han asistido
- Distribución por género, estamento, facultad
- Comparativo entre grupos
- Reportes exportables

**Nota importante:** Asistencias maneja por separado los datos de Cultura y los de Deporte. Un administrador de Cultura no ve los datos de Deporte y viceversa. Solo el Superadministrador puede ver ambas áreas al mismo tiempo.

---

## GymControl CDU — Control de acceso al gimnasio

**¿Para qué sirve?**
Registra y controla el acceso de personas a las instalaciones del Centro Deportivo: gimnasio, guardarropas y piscina.

**¿Cómo ingresan los usuarios?**
Esta plataforma tiene su propio login independiente. Se ingresa con número de cédula y contraseña. No se usa correo electrónico.

**Roles dentro de GymControl:**

| Rol | Qué puede hacer |
|-----|----------------|
| Superadministrador | Acceso total, gestión de usuarios del sistema |
| Administrador | Gestión de usuarios y reportes |
| Encargado | Ve estadísticas generales |
| Monitor Gimnasio | Registra accesos al gimnasio |
| Monitor Guardarropas | Registra accesos al guardarropas |
| Monitor Piscina | Registra accesos a la piscina |

Cuando un monitor inicia sesión, el sistema lo lleva automáticamente a la sección que le corresponde según su espacio asignado.

**Flujo de uso típico:**

1. Una persona llega al gimnasio. El monitor en la entrada busca a esa persona en el sistema.
2. Si ya está registrada, se registra su acceso con un clic.
3. Si es nueva, se hace el registro con sus datos (nombre, cédula, programa, etc.) en un proceso de 4 pasos.
4. El sistema guarda el historial de accesos.

**Estadísticas disponibles:**
- Total de accesos por día, semana, mes
- Distribución por género y estamento
- Usuarios más frecuentes
- Reportes de uso de instalaciones

**¿Cómo se conecta con el CDR Landing?**
Los administradores del CDR Landing pueden ver un resumen de las estadísticas del gimnasio directamente en su dashboard, sin necesidad de entrar a GymControl.

---

## Stock CDU — Inventario deportivo y préstamos

**¿Para qué sirve?**
Gestiona el inventario de equipos deportivos del CDU y controla los préstamos que se hacen a estudiantes y usuarios.

**¿Cómo ingresan?**
Desde el CDR Landing, haciendo clic en "Stock CDU". El sistema abre la plataforma con la sesión ya iniciada.

**Flujo de uso típico:**

1. Un usuario llega a pedir prestado un equipo (balón, raqueta, etc.).
2. El encargado busca al usuario en el sistema por nombre, cédula o código.
3. Si el usuario no está registrado, se hace el registro en 4 pasos: identificación, contacto, datos institucionales y datos demográficos.
4. Se selecciona el equipo a prestar y se registra el préstamo.
5. Cuando el usuario devuelve el equipo, se registra la devolución (puede ser total o parcial si son varios ítems).
6. Si el equipo llega con daños, se puede registrar un reporte de daño.

**Secciones de la plataforma:**
- Inventario: lista de todos los equipos, cantidades disponibles y estado
- Préstamos: registro de préstamos activos y devoluciones
- Registro de usuarios: formulario para nuevos usuarios
- Estadísticas: análisis por facultad, programa, género
- Reportes: generación de reportes en PDF

**Estadísticas disponibles:**
- Equipos más prestados
- Usuarios más frecuentes
- Distribución por facultad y programa
- Tasa de devolución
- Reportes completos exportables en PDF

---

## Stock Cultura — Inventario de instrumentos y materiales

**¿Para qué sirve?**
Funciona igual que Stock CDU pero para el área de Cultura. Gestiona el inventario de instrumentos musicales, materiales de teatro, danza y demás recursos culturales.

**¿Cómo ingresan?**
Desde el CDR Landing, haciendo clic en "Stock Cultura". El sistema abre la plataforma con la sesión ya iniciada.

**Flujo de uso típico:**
El flujo es idéntico al de Stock CDU: búsqueda de usuario, registro si es nuevo, selección del ítem, registro del préstamo y devolución posterior.

**Secciones de la plataforma:**
- Inventario de instrumentos y materiales
- Préstamos activos
- Registro de usuarios
- Estadísticas por grupo cultural
- Reportes exportables

---

## Horarios CDU — Consulta de horarios deportivos

**¿Para qué sirve?**
Permite consultar los horarios de todos los grupos y disciplinas deportivas del CDU. Es una plataforma de consulta pública, no requiere iniciar sesión.

**¿Cómo ingresan?**
Cualquier persona puede entrar directamente a la dirección web de la plataforma sin necesidad de usuario ni contraseña.

**¿Cómo se usa?**
1. Al entrar, se ven todos los grupos deportivos disponibles.
2. Se puede buscar un grupo específico por nombre.
3. Al hacer clic en un grupo, aparece su horario semanal con días, horas y lugar.
4. También se puede ver información adicional del grupo como redes sociales y sitio web.

**¿Cómo se conecta con el CDR Landing?**
Los administradores pueden acceder a la gestión de horarios desde el CDR Landing. La parte pública (consulta) no requiere autenticación.

---

## Horarios Cultura — Consulta de horarios culturales

**¿Para qué sirve?**
Igual que Horarios CDU pero para los grupos culturales: danza, música, teatro y demás. También es de acceso público.

**¿Cómo ingresan?**
Cualquier persona puede entrar directamente sin usuario ni contraseña.

**¿Cómo se usa?**
El funcionamiento es idéntico a Horarios CDU: se busca el grupo, se ve el horario y la información del grupo.

---

## Bitácora AC — Registro de actividades del área cultural

**¿Para qué sirve?**
Permite a los monitores del área cultural registrar sus actividades, tareas y asistencia. Es una herramienta de seguimiento interno del trabajo de los monitores.

**¿Cómo ingresan?**
Desde el CDR Landing, haciendo clic en "Bitácora AC". El sistema abre la plataforma con la sesión ya iniciada.

**Roles dentro de Bitácora AC:**
- Administrador: puede ver todos los registros, gestionar monitores
- Monitor: registra sus propias actividades y asistencia
- Invitado: acceso de solo lectura

**Flujo de uso típico:**
1. El monitor inicia sesión (a través del CDR Landing).
2. Registra las actividades realizadas durante su jornada.
3. Marca su asistencia.
4. El administrador puede revisar los registros de todos los monitores.

---

## Bitácora COM — Registro del área de comunicaciones

**¿Para qué sirve?**
Funciona igual que Bitácora AC pero para el área de comunicaciones. Permite hacer seguimiento de las actividades y tareas del equipo de comunicaciones.

**¿Cómo ingresan?**
Desde el CDR Landing, haciendo clic en "Bitácora COM".

---

## Cómo se complementan las plataformas

Todas las plataformas están conectadas entre sí a través del CDR Landing. Aquí se explica cómo fluye la información:

```
CDR Landing (centro de control)
    │
    ├── Asistencias ──────── Envía estadísticas de asistencia al dashboard
    │
    ├── GymControl CDU ───── Envía estadísticas de accesos al dashboard
    │
    ├── Stock CDU ────────── Envía estado del inventario al dashboard
    │
    ├── Stock Cultura ────── Envía estado del inventario al dashboard
    │
    ├── Horarios CDU ─────── Acceso de gestión desde el landing
    │
    ├── Horarios Cultura ─── Acceso de gestión desde el landing
    │
    ├── Bitácora AC ──────── Acceso con sesión automática
    │
    └── Bitácora COM ─────── Acceso con sesión automática
```

**El inicio de sesión único (SSO)** es la tecnología que permite que al iniciar sesión en el CDR Landing, no sea necesario volver a ingresar usuario y contraseña en cada plataforma. Cuando se hace clic en una plataforma desde el CDR Landing, el sistema genera automáticamente un pase temporal que abre esa plataforma ya autenticado.

**El dashboard central** del CDR Landing recoge datos de Asistencias, GymControl, Stock CDU y Stock Cultura para mostrar un resumen ejecutivo en tiempo real. Esto permite que un administrador o superadministrador tenga una visión completa de todo lo que está pasando en ambas áreas sin necesidad de entrar a cada plataforma por separado.

---

## Resumen rápido de acceso por tipo de usuario

| Plataforma | Administrador | Monitor | Público |
|------------|--------------|---------|---------|
| CDR Landing | Login con correo | Login con correo | No aplica |
| Asistencias | Desde CDR Landing o login directo | Login directo | No aplica |
| GymControl CDU | Login con cédula | Login con cédula | No aplica |
| Stock CDU | Desde CDR Landing | Desde CDR Landing | No aplica |
| Stock Cultura | Desde CDR Landing | Desde CDR Landing | No aplica |
| Horarios CDU | Desde CDR Landing | Desde CDR Landing | Acceso libre |
| Horarios Cultura | Desde CDR Landing | Desde CDR Landing | Acceso libre |
| Bitácora AC | Desde CDR Landing | Desde CDR Landing | No aplica |
| Bitácora COM | Desde CDR Landing | Desde CDR Landing | No aplica |

---

*Manual elaborado para el personal del área de Cultura y Deporte de la Universidad del Valle.*
