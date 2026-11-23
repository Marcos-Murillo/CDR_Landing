# Informe profesional de cambios - Ecosistema CDR Landing

**Fecha de elaboracion:** 23 de noviembre de 2026  
**Periodo analizado:** 16 de noviembre de 2026 14:00 UTC - 23 de noviembre de 2026 14:01 UTC  
**Fuente tecnica:** historial Git de `origin/main` en los repositorios del ecosistema CDR disponibles en el workspace.  
**Repositorio central:** `CDR_Landing`

---

## 1. Resumen ejecutivo

Durante la semana analizada se identifico actividad nueva en una sola aplicacion formalmente conectada al ecosistema CDR Landing: **Control de Accesos CDU (`gym_cdu`)**. El cambio se enfoca en mejorar la precision operativa del registro de asistencia de monitores, especialmente para el espacio de **tenis de mesa**, permitiendo que esa asistencia se marque en su punto real de trabajo y no necesariamente dentro del radio general del CDU.

El resto de aplicaciones formales del ecosistema no registro commits nuevos en `origin/main` durante esta ventana. Esto no implica que esten inactivas funcionalmente, sino que no hubo cambios versionados en la rama principal durante el periodo revisado.

### Hallazgos principales

| Categoria | Resultado |
| --- | --- |
| Apps formales revisadas | 12 plataformas conectadas a CDR Landing, mas el repositorio central |
| Repositorios relacionados revisados | 1 repositorio adicional: `seguimiento_cont` |
| Apps con cambios en el periodo | 1: Control de Accesos CDU (`gym_cdu`) |
| Commits nuevos detectados | 1 commit en `gym_cdu` |
| Enfoque principal del cambio | Georreferenciacion diferenciada para asistencia de tenis de mesa |
| Impacto operativo | Mayor coherencia entre el lugar real de trabajo del monitor y el punto donde puede registrar entrada/salida |
| Riesgo principal | Dependencia de coordenadas fijas y de exactitud GPS del navegador |

---

## 2. Alcance del informe

El informe cubre las aplicaciones declaradas en la configuracion formal de CDR Landing, principalmente en `lib/platform-access-config.ts` y `lib/superadmin-platforms.ts`, junto con un repositorio relacionado que ha sido monitoreado historicamente.

| Area | Plataforma en CDR Landing | Repositorio revisado | Estado en la semana |
| --- | --- | --- | --- |
| Central | CDR Landing | `CDR_Landing` | Sin commits nuevos |
| Cultura y Deporte | Bitacora AC | `BitacoraAC` | Sin commits nuevos |
| Cultura | Bitacora COM | `bit_com` | Sin commits nuevos |
| Cultura | Stock Cultura | `stock_cultura` | Sin commits nuevos |
| Cultura | Horarios Cultura | `Horarios_Cultura` | Sin commits nuevos |
| Cultura | Asistencias Cultura | `Asistencia_cultura` | Sin commits nuevos |
| Cultura y Deporte | Canal Comunicaciones | `CanalComunicaciones` | Sin commits nuevos |
| Deporte | Stock CDU Melendez | `stock-cdu` | Sin commits nuevos |
| Deporte | Stock CDU San Fernando | `stock-cdu-sanfer` | Sin commits nuevos |
| Deporte | Horarios CDU | `Horarios_CDU` | Sin commits nuevos |
| Deporte | Control de Accesos CDU | `gym_cdu` | **Con cambios** |
| Deporte | Asistencias Deporte | `Asistencia_cultura` | Sin commits nuevos |
| Deporte | Prestamos Escenarios | `Prestamo_Escenarios` | Sin commits nuevos |
| Relacionado no integrado formalmente | Seguimiento de contratos | `seguimiento_cont` | Sin commits nuevos |

---

## 3. Cambios detectados durante el periodo

### 3.1 Resumen por repositorio

| Repositorio | Commits en el periodo | Ultimo commit revisado | Fecha del ultimo commit | Lectura ejecutiva |
| --- | ---: | --- | --- | --- |
| `gym_cdu` | 1 | `2efa7b0` - `feat: marcar la asistencia de tenis de mesa en su propio punto` | 2026-11-20 | Unico cambio semanal; ajusta la validacion geografica de asistencia para monitores de tenis de mesa. |
| `CDR_Landing` | 0 | `c86db89` - Renombrar GymControl CDU a Control de Accesos CDU. | 2026-09-12 | Sin cambios recientes en la puerta de entrada central. |
| `Asistencia_cultura` | 0 | `2d0b68e` - Quitar la seccion de entrega en campo y pintar los datos del formato CRD en negro. | 2026-11-05 | Sin nuevos cambios esta semana. |
| `Prestamo_Escenarios` | 0 | `0dfc3ce` - Mostrar el formato CRD en cada peticion y dejar los datos legibles. | 2026-11-05 | Sin nuevos cambios esta semana. |
| `seguimiento_cont` | 0 | `6223c6a` - Permitir un contrato nuevo al terminar el anterior y elegir entre varios. | 2026-10-06 | Repositorio relacionado, no integrado formalmente a CDR Landing; sin cambios esta semana. |
| `CanalComunicaciones` | 0 | `44df84f` - Restrict managers to submit and my-requests only. | 2026-06-16 | Sin cambios recientes en la ventana semanal. |
| `stock-cdu` | 0 | `05cdd3f` - feat: columnas opcionales en Excel (correo, telefono, etnia, edad) | 2026-06-16 | Sin cambios recientes en la ventana semanal. |
| `stock-cdu-sanfer` | 0 | `bb6d6f5` - chore: ignorar carpeta .vercel en git | 2026-06-16 | Sin cambios recientes en la ventana semanal. |
| `Horarios_CDU` | 0 | `0c6d7e1` - Update group page view | 2026-06-16 | Sin cambios recientes en la ventana semanal. |
| `bit_com` | 0 | `f87b8b3` - Agregar sistema de estados con colores personalizados | 2026-05-07 | Sin cambios recientes en la ventana semanal. |
| `Horarios_Cultura` | 0 | `ec5481d` - feat: formulario multi-horario con boton + para agregar slots | 2026-04-21 | Sin cambios recientes en la ventana semanal. |
| `stock_cultura` | 0 | `3f6d315` - fix missing Navigation imports | 2026-03-23 | Sin cambios recientes en la ventana semanal. |
| `BitacoraAC` | 0 | `9f70a41` - Mensaje de confirmacion | 2025-03-25 | Sin cambios recientes en la ventana semanal. |

---

## 4. Detalle del cambio principal: Control de Accesos CDU (`gym_cdu`)

### 4.1 Commit revisado

| Dato | Informacion |
| --- | --- |
| Commit | `2efa7b0` |
| Fecha | 20 de noviembre de 2026 |
| Mensaje | `feat: marcar la asistencia de tenis de mesa en su propio punto` |
| Archivos modificados | `app/asistencia/page.tsx`, `lib/cdu-geofence.ts`, `lib/storage.ts` |
| Volumen del cambio | 56 inserciones, 15 eliminaciones |
| Objetivo funcional | Permitir que los monitores de tenis de mesa registren asistencia dentro de un radio propio de su mesa, mientras los demas espacios mantienen la regla del CDU. |

### 4.2 Que se cambio

| Modulo | Cambio realizado | Impacto funcional |
| --- | --- | --- |
| `lib/cdu-geofence.ts` | Se agrego una abstraccion de sitio de asistencia (`AttendanceSite`) para representar ubicacion, nombre y radio permitido. | La validacion geografica deja de estar limitada a un unico punto CDU y puede adaptarse por espacio. |
| `lib/cdu-geofence.ts` | Se definio un sitio especifico para tenis de mesa con coordenadas propias y radio de 30 metros. | Los monitores de tenis de mesa pueden registrar asistencia en el punto donde realmente prestan el servicio. |
| `lib/cdu-geofence.ts` | Se agrego `attendanceSiteForEspacio(espacio)` para resolver si aplica CDU o tenis de mesa. | Centraliza la logica de seleccion del punto geografico y evita duplicarla en UI o almacenamiento. |
| `lib/cdu-geofence.ts` | Se reemplazo la validacion fija `assertInsideCdu` por `assertInsideAttendanceSite`, manteniendo compatibilidad con `assertInsideCdu`. | Reduce riesgo de romper llamadas existentes y prepara el sistema para futuros espacios con geocerca propia. |
| `app/asistencia/page.tsx` | La entrada y salida ahora usan `requirePositionForEspacio(...)` en vez de validar siempre contra CDU. | El registro desde la interfaz respeta el espacio asignado al monitor. |
| `app/asistencia/page.tsx` | El texto informativo ahora muestra dinamicamente el radio y el nombre del sitio aplicable. | Mejora claridad para el usuario final antes de permitir la marcacion. |
| `lib/storage.ts` | La entrada valida la ubicacion segun el `espacio` recibido. | La capa de datos refuerza la misma regla que la interfaz y evita registros inconsistentes. |
| `lib/storage.ts` | La salida valida la ubicacion usando el `espacio` guardado en el registro existente. | Evita que una salida se valide contra un espacio distinto al de la entrada registrada. |

### 4.3 Que se anadio

| Elemento nuevo | Descripcion | Beneficio |
| --- | --- | --- |
| `PING_PONG_LAT` / `PING_PONG_LNG` | Coordenadas especificas para el punto de tenis de mesa. | Permite georreferenciar correctamente esa actividad. |
| `PING_PONG_RADIUS_METERS` | Radio permitido de 30 metros para tenis de mesa. | Mayor precision que el radio general del CDU. |
| `AttendanceSite` | Tipo comun para representar sitios de asistencia. | Mejora legibilidad, mantenibilidad y extensibilidad. |
| `CDU_SITE` y `PING_PONG_SITE` | Objetos configurados para cada sitio de asistencia. | Evita depender de constantes sueltas en la logica principal. |
| `attendanceSiteForEspacio` | Funcion que decide el sitio segun el espacio del monitor. | Facilita agregar nuevos espacios en el futuro. |
| `assertInsideAttendanceSite` | Validacion geografica parametrizada por espacio. | Reduce acoplamiento a una unica ubicacion. |
| `requirePositionForEspacio` | Lectura de ubicacion mas validacion por sitio. | Simplifica el uso desde la pantalla de asistencia. |

### 4.4 Flujo funcional actualizado

| Paso | Antes | Ahora |
| --- | --- | --- |
| Monitor abre "Mi Asistencia" | El sistema indicaba que solo podia marcar dentro del radio del CDU. | El sistema muestra el radio y sitio que corresponden al espacio del usuario. |
| Monitor registra entrada | La ubicacion se validaba siempre contra el CDU. | Si el espacio es `tenis_mesa`, se valida contra el punto de tenis de mesa; otros espacios siguen usando CDU. |
| Monitor registra salida | La ubicacion se validaba siempre contra el CDU. | La salida se valida contra el espacio guardado en el registro de entrada. |
| Mensaje de error por distancia | Siempre referia al CDU. | El mensaje informa la distancia respecto al sitio aplicable. |

---

## 5. Estado por aplicacion del ecosistema

| Aplicacion | Estado semanal | Comentario profesional |
| --- | --- | --- |
| CDR Landing | Sin cambios | La plataforma central no tuvo ajustes en esta ventana; mantiene la matriz de plataformas y SSO existente. |
| Control de Accesos CDU | **Con cambios** | Avanza en reglas de asistencia mas precisas por ubicacion real de trabajo. |
| Asistencias Cultura / Deporte | Sin cambios | Continua siendo una plataforma clave para inscripciones, reportes y datos CRD, pero no tuvo commits nuevos esta semana. |
| Prestamos Escenarios | Sin cambios | Sin actividad nueva en `origin/main`; conserva los ajustes previos relacionados con formato CRD. |
| Canal Comunicaciones | Sin cambios | Sin cambios nuevos; mantiene restricciones de rol incorporadas anteriormente. |
| Stock CDU Melendez | Sin cambios | Sin cambios nuevos en inventario deportivo. |
| Stock CDU San Fernando | Sin cambios | Sin cambios nuevos; sigue integrado como plataforma deportiva diferenciada. |
| Horarios CDU | Sin cambios | Sin cambios nuevos en consulta o gestion de horarios deportivos. |
| Horarios Cultura | Sin cambios | Sin cambios nuevos en horarios culturales. |
| Stock Cultura | Sin cambios | Sin cambios nuevos en inventario cultural. |
| Bitacora AC | Sin cambios | Sin cambios nuevos; ultima actividad versionada es antigua frente al resto del ecosistema. |
| Bitacora COM | Sin cambios | Sin cambios nuevos; mantiene el sistema de estados agregado previamente. |
| Seguimiento de contratos | Sin cambios | Repositorio relacionado, no declarado como plataforma formal en CDR Landing. |

---

## 6. Riesgos y puntos de atencion

| Riesgo | Nivel | Evidencia | Recomendacion |
| --- | --- | --- | --- |
| Coordenadas fijas en codigo | Medio | Las coordenadas de tenis de mesa quedaron definidas como constantes en `lib/cdu-geofence.ts`. | Mover la configuracion de sitios a una fuente administrable o, como minimo, a una tabla/configuracion central versionada. |
| Exactitud variable del GPS | Medio | La validacion depende de `navigator.geolocation` y del margen reportado por el navegador. | Registrar metricas de precision y evaluar tolerancias especiales cuando el margen del dispositivo sea alto. |
| Cobertura limitada a `tenis_mesa` | Bajo/Medio | Solo se agrego una ubicacion especial; los demas espacios siguen en CDU. | Revisar si piscina, guardarropas u otros puntos requieren geocerca propia. |
| Falta de pruebas automatizadas visibles en el cambio | Medio | El commit modifica reglas de validacion, pero no se observo adicion de tests en el diff revisado. | Agregar pruebas unitarias para seleccion de sitio, distancia, mensajes de error y validacion de entrada/salida. |
| Dependencia del valor exacto del campo `espacio` | Medio | La seleccion especial depende de que el valor sea exactamente `tenis_mesa`. | Centralizar los identificadores de espacios en un enum/tipo compartido para evitar errores por strings. |
| Documentacion operativa pendiente | Bajo | El cambio altera donde pueden marcar asistencia ciertos monitores. | Actualizar manuales internos y mensajes de soporte para explicar el nuevo punto de marcacion. |

---

## 7. Oportunidades de mejora priorizadas

| Prioridad | Mejora propuesta | Aplicacion impactada | Beneficio esperado |
| --- | --- | --- | --- |
| Alta | Agregar pruebas automatizadas para `attendanceSiteForEspacio`, `assertInsideAttendanceSite` y registro de entrada/salida por espacio. | `gym_cdu` | Disminuye riesgo de errores en asistencia y geocercas. |
| Alta | Centralizar los identificadores de espacios (`tenis_mesa`, `gimnasio`, `piscina`, etc.) en un tipo compartido. | `gym_cdu` y CDR Landing si comparte configuraciones | Reduce errores por valores escritos manualmente. |
| Media | Convertir las geocercas en configuracion administrable por sede/espacio. | `gym_cdu` | Permite ajustar coordenadas sin tocar codigo cuando cambien puntos fisicos. |
| Media | Crear una vista administrativa de geocercas con mapa, radio y ultima actualizacion. | `gym_cdu` | Mejora trazabilidad y validacion operativa por administradores. |
| Media | Registrar en auditoria el sitio usado para validar cada asistencia. | `gym_cdu` | Facilita resolver reclamaciones o inconsistencias de marcacion. |
| Media | Actualizar el manual de uso del ecosistema CDR con Préstamos Escenarios, Stock CDU San Fernando y reglas de asistencia por espacio. | `CDR_Landing` | Mantiene alineada la documentacion con el alcance real actual. |
| Baja | Generar una matriz periodica de apps sin actividad reciente y deuda potencial. | Ecosistema CDR | Ayuda a identificar aplicaciones que requieren mantenimiento preventivo. |

---

## 8. Recomendaciones para seguimiento

| Horizonte | Accion recomendada | Responsable sugerido | Resultado esperado |
| --- | --- | --- | --- |
| Corto plazo | Validar en campo que las coordenadas y el radio de 30 m para tenis de mesa cubren adecuadamente el punto real de marcacion. | Equipo CDU / Administracion deportiva | Confirmacion operativa antes de ampliar el modelo a otros espacios. |
| Corto plazo | Agregar pruebas unitarias del nuevo modulo de geocerca por espacio. | Desarrollo | Mayor confianza en cambios futuros de asistencia. |
| Mediano plazo | Revisar si otros espacios requieren puntos propios de asistencia. | Equipo CDU / Desarrollo | Modelo de asistencia mas preciso por actividad. |
| Mediano plazo | Documentar el proceso de actualizacion de geocercas. | Desarrollo / Operaciones | Menor dependencia de conocimiento informal. |
| Largo plazo | Integrar salud de plataformas, ultima actividad y estado de enlaces en un panel CDR Landing. | Desarrollo CDR | Mejor gobierno tecnico del ecosistema completo. |

---

## 9. Conclusiones

1. **El unico cambio tecnico de la semana dentro del ecosistema CDR fue en Control de Accesos CDU (`gym_cdu`).**
2. **La mejora es funcionalmente relevante**, porque adapta la asistencia de monitores de tenis de mesa a su ubicacion real de trabajo.
3. **El cambio esta bien orientado a extensibilidad**, ya que introduce una abstraccion de sitio de asistencia que podria soportar mas espacios en el futuro.
4. **La principal oportunidad de mejora es fortalecer calidad y administrabilidad**, especialmente mediante pruebas automatizadas, centralizacion de identificadores y configuracion administrable de geocercas.
5. **Las demas aplicaciones no presentaron cambios nuevos en `origin/main` durante la ventana analizada**, por lo que se recomienda mantener monitoreo semanal y revisar deuda tecnica en aplicaciones con baja actividad reciente.

---

## 10. Anexo tecnico: comandos de referencia

Los datos de este informe se obtuvieron revisando el historial Git de los repositorios del workspace, con una ventana temporal entre el 16 de noviembre de 2026 14:00 UTC y el 23 de noviembre de 2026 14:01 UTC, usando `origin/main` como referencia para cada aplicacion.

| Tipo de revision | Referencia |
| --- | --- |
| Conteo de commits por repo | `git rev-list --count --since ... --until ... origin/main` |
| Detalle de commits | `git log origin/main --since ... --until ... --name-status` |
| Diff del cambio principal | `git show 2efa7b0 -- app/asistencia/page.tsx lib/cdu-geofence.ts lib/storage.ts` |

