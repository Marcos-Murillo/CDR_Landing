# Informe profesional de cambios - Ecosistema CDR Landing

**Fecha de corte:** 16 de noviembre de 2026, 14:00 UTC  
**Ventana revisada:** 9 de noviembre de 2026, 14:03 UTC - 16 de noviembre de 2026, 14:00 UTC  
**Fuente de revisión:** historial Git en `origin/main` de las aplicaciones integradas en CDR Landing y repositorios relacionados disponibles en el workspace.

## 1. Resumen ejecutivo

Durante la semana evaluada se detectaron cambios nuevos en **Control de Accesos CDU** (`gym_cdu`), una de las plataformas formales integradas desde CDR Landing para el área de Deporte. El resto de aplicaciones integradas no presentó commits nuevos en `origin/main` dentro de la ventana.

El trabajo de la semana se concentró en fortalecer el control operativo de monitores: ahora la asistencia del monitor exige ubicación dentro del CDU, limita el tiempo diario contabilizado a cuatro horas y bloquea el registro de entradas de usuarios si el monitor no ha marcado primero su propia asistencia. También se ajustó el radio operativo de validación geográfica de 40 m a 100 m para reducir falsos rechazos causados por baja precisión del GPS en campus.

| Indicador | Resultado |
| --- | ---: |
| Repositorios formales revisados | 12 |
| Repositorios relacionados no integrados revisados | 1 |
| Aplicaciones con cambios en la ventana | 1 |
| Commits detectados en la ventana | 2 |
| Archivos modificados en la app con cambios | 10 |
| Balance de cambios | 480 inserciones / 72 eliminaciones |

## 2. Alcance de aplicaciones revisadas

Las aplicaciones formales se tomaron de la configuración `PLATFORM_ACCESS` de CDR Landing. `seguimiento_cont` se revisó como repositorio relacionado presente en el workspace, aunque no aparece como plataforma integrada formalmente en CDR Landing.

| Plataforma en CDR Landing | Repositorio | Área | Estado semanal | Último commit en `origin/main` |
| --- | --- | --- | --- | --- |
| CDR Landing | `CDR_Landing` | Cultura y Deporte | Sin cambios en la ventana | `c86db89` - 2026-09-12 - Renombrar GymControl CDU a Control de Accesos CDU. |
| Bitácora AC | `BitacoraAC` | Cultura y Deporte | Sin cambios en la ventana | `9f70a41` - 2025-03-25 - Mensaje de confirmación |
| Bitácora COM | `bit_com` | Cultura | Sin cambios en la ventana | `f87b8b3` - 2026-05-07 - Agregar sistema de estados con colores personalizados |
| Stock Cultura | `stock_cultura` | Cultura | Sin cambios en la ventana | `3f6d315` - 2026-03-23 - fix missing Navigation imports |
| Horarios Cultura | `Horarios_Cultura` | Cultura | Sin cambios en la ventana | `ec5481d` - 2026-04-21 - feat: formulario multi-horario con boton + para agregar slots |
| Asistencias Cultura / Deporte | `Asistencia_cultura` | Cultura y Deporte | Sin cambios en la ventana | `2d0b68e` - 2026-11-05 - Quitar la sección de entrega en campo y pintar los datos del formato CRD en negro. |
| Canal Comunicaciones | `CanalComunicaciones` | Cultura y Deporte | Sin cambios en la ventana | `44df84f` - 2026-06-16 - Restrict managers to submit and my-requests only. |
| Stock CDU Meléndez | `stock-cdu` | Deporte | Sin cambios en la ventana | `05cdd3f` - 2026-06-16 - feat: columnas opcionales en Excel (correo, telefono, etnia, edad) |
| Stock CDU San Fernando | `stock-cdu-sanfer` | Deporte | Sin cambios en la ventana | `bb6d6f5` - 2026-06-16 - chore: ignorar carpeta .vercel en git |
| Horarios CDU | `Horarios_CDU` | Deporte | Sin cambios en la ventana | `0c6d7e1` - 2026-06-16 - Update group page view |
| Control de Accesos CDU | `gym_cdu` | Deporte | **Con cambios** | `cd1678c` - 2026-11-11 - feat: ampliar el radio de asistencia del CDU a 100 metros |
| Préstamos Escenarios | `Prestamo_Escenarios` | Deporte | Sin cambios en la ventana | `0dfc3ce` - 2026-11-05 - Mostrar el formato CRD en cada petición y dejar los datos legibles. |
| Seguimiento Contratistas | `seguimiento_cont` | Relacionado, no integrado formalmente | Sin cambios en la ventana | `6223c6a` - 2026-10-06 - Permitir un contrato nuevo al terminar el anterior y elegir entre varios. |

## 3. Cambios detectados por aplicación

### 3.1 Control de Accesos CDU (`gym_cdu`)

| Commit | Fecha | Cambio principal | Impacto operativo |
| --- | --- | --- | --- |
| `7c80667` | 2026-11-10 | Limita la asistencia del monitor al turno diario y al radio del CDU. | Refuerza que la operación de registro de usuarios sea realizada por monitores presentes físicamente y con asistencia marcada. |
| `cd1678c` | 2026-11-11 | Amplía el radio permitido de asistencia del CDU a 100 m. | Reduce bloqueos por imprecisión de GPS sin retirar el control geográfico. |

| Archivo | Tipo de cambio | Descripción profesional |
| --- | --- | --- |
| `lib/cdu-geofence.ts` | Nuevo / ajustado | Centraliza coordenadas del CDU, cálculo de distancia WGS84, lectura de geolocalización del navegador y errores claros para permisos, tiempo de espera o ubicación fuera de rango. El radio final queda en 100 m. |
| `lib/attendance-time.ts` | Nuevo | Define utilidades de fecha/hora local, cálculo de duración, tope diario de 4 horas, formato de minutos e inicio de semana/mes local. |
| `components/monitor-attendance-gate.tsx` | Nuevo | Agrega un gate reutilizable que verifica si el monitor marcó asistencia del día antes de permitir registros de usuarios. |
| `app/asistencia/page.tsx` | Modificado | La pantalla de asistencia ahora solicita ubicación, registra coordenadas de entrada/salida, muestra el límite de 4 horas y notifica cuando el tope diario se aplica. |
| `components/gimnasio-content.tsx` | Modificado | El registro de entradas al gimnasio se bloquea para monitores que no hayan marcado asistencia; se muestra alerta y enlace hacia "Mi Asistencia". |
| `app/piscina/page.tsx` | Modificado | Replica la validación previa de asistencia del monitor para entradas de piscina. |
| `lib/storage.ts` | Modificado | Agrega `saveEntryAsStaff`, valida asistencia previa del monitor, guarda ubicación de asistencia y aplica el tope diario al registrar salida. |
| `lib/types.ts` | Modificado | Extiende `AttendanceRecord` con duración y coordenadas/precisión de entrada y salida. |
| `lib/utils.ts` | Modificado | Incorpora helpers locales para fecha `YYYY-MM-DD` y hora `HH:MM`, evitando depender de UTC en jornadas operativas. |
| `app/asistencia/seguimiento/page.tsx` | Modificado | Actualiza métricas de seguimiento para sumar minutos reales, semana y mes locales, y visibilizar registros sin salida. |

#### Principales mejoras funcionales añadidas

| Categoría | Antes | Ahora | Beneficio |
| --- | --- | --- | --- |
| Control geográfico | La asistencia no tenía una validación centralizada de presencia en el CDU. | Entrada y salida exigen ubicación dentro de 100 m del CDU. | Mayor trazabilidad y reducción de marcaciones remotas. |
| Jornada del monitor | No había tope técnico consistente para la duración diaria. | La duración contabilizada se limita a 4 horas por día. | Mejora consistencia de reportes y control de turnos. |
| Orden operativo | Un monitor podía registrar usuarios sin haber marcado su asistencia. | El sistema bloquea registros de gimnasio/piscina hasta que el monitor marque entrada. | Alinea la operación diaria con la responsabilidad del monitor en turno. |
| Reportes | El seguimiento dependía de rangos y duraciones menos normalizados. | Se calculan minutos por rango, semana y mes usando fechas locales. | Reportes más confiables para coordinación y administración. |
| Experiencia de usuario | El rechazo por ubicación podía resultar poco claro. | Hay mensajes específicos para permisos, timeout, GPS desactivado y distancia fuera de radio. | Disminuye fricción para monitores y facilita soporte. |

## 4. Aplicaciones sin cambios en la ventana

| Grupo | Aplicaciones | Lectura ejecutiva |
| --- | --- | --- |
| Cultura | Bitácora COM, Stock Cultura, Horarios Cultura | No se detectaron cambios nuevos. Permanecen estables respecto a la semana anterior. |
| Cultura y Deporte | CDR Landing, Bitácora AC, Asistencias Cultura/Deporte, Canal Comunicaciones | No hubo commits nuevos en la ventana. El último movimiento relevante sigue concentrado en Asistencias y Préstamos antes del corte anterior. |
| Deporte | Stock CDU Meléndez, Stock CDU San Fernando, Horarios CDU, Préstamos Escenarios | No presentaron nuevos cambios esta semana. |
| Relacionado no integrado | Seguimiento Contratistas | Sin cambios en la ventana y sin integración formal registrada en `PLATFORM_ACCESS`. |

## 5. Riesgos y puntos de atención

| Riesgo / punto de atención | Severidad | Observación | Acción recomendada |
| --- | --- | --- | --- |
| Precisión variable de GPS en campus | Media | El radio se amplió a 100 m para mitigar rechazos por precisión deficiente. Aun así, navegadores y dispositivos pueden reportar ubicaciones con márgenes altos. | Registrar métricas de distancia y precisión para revisar si 100 m es suficiente o excesivo. |
| Dependencia de permisos del navegador | Media | Si el usuario bloquea ubicación, no podrá marcar asistencia. | Preparar una guía breve de soporte para activar permisos de ubicación en navegadores móviles y de escritorio. |
| Control solo en cliente para lectura GPS | Media | La lectura se realiza desde navegador y luego se valida en funciones de almacenamiento de la app. | Complementar con reglas/validaciones de backend o Cloud Functions cuando el flujo requiera mayor garantía antifraude. |
| Registros sin salida | Baja / Media | La vista de seguimiento los expone, pero siguen requiriendo gestión operativa. | Definir procedimiento de cierre administrativo y auditoría para asistencias sin salida. |
| Reglas de Firestore y concurrencia | Media | El gate evita errores de flujo, pero conviene asegurar que reglas y escrituras concurrentes no permitan duplicados o saltos de validación. | Auditar reglas de Firestore y considerar transacciones para entrada/salida de monitor. |

## 6. Oportunidades de mejora priorizadas

| Prioridad | Mejora recomendada | Aplicación afectada | Justificación | Resultado esperado |
| --- | --- | --- | --- | --- |
| Alta | Agregar pruebas unitarias para `attendance-time` y `cdu-geofence`. | `gym_cdu` | Son utilidades críticas para horas, límites diarios y geocerca. | Menos riesgo de regresiones en cálculos de jornada o distancia. |
| Alta | Validar con reglas de Firestore que un monitor no pueda crear entradas si no tiene asistencia activa del día. | `gym_cdu` | El bloqueo visual mejora la UX, pero debe reforzarse en capa de datos. | Mayor seguridad e integridad operativa. |
| Media | Crear panel de auditoría de ubicación con distancia, precisión y errores frecuentes. | `gym_cdu` | Permitiría ajustar el radio con datos reales y detectar problemas por dispositivo. | Decisiones operativas basadas en evidencia. |
| Media | Documentar el flujo de asistencia de monitores dentro de CDR Landing o en una guía operativa. | CDR Landing / `gym_cdu` | El cambio afecta la rutina diaria de monitores. | Menos dudas durante adopción y soporte. |
| Media | Unificar convenciones de fecha local entre apps CDR. | Apps deportivas y de asistencias | Varias apps dependen de reportes diarios/mensuales. | Reportes comparables y menor riesgo por diferencias UTC/locales. |
| Baja | Mostrar en CDR Landing el estado o última actividad de cada plataforma integrada. | CDR Landing | Facilitaría seguimiento ejecutivo sin revisar repositorio por repositorio. | Mayor visibilidad para administración. |

## 7. Verificación realizada

| Verificación | Resultado |
| --- | --- |
| Revisión de historial Git en `origin/main` para apps formales | Completada |
| Revisión de repositorio relacionado `seguimiento_cont` | Completada |
| Revisión de archivos modificados en `gym_cdu` | Completada |
| Ejecución local de lint/build | No ejecutada: `gym_cdu` no tiene `node_modules` instalado en este entorno y el alcance de este entregable es documental. |

## 8. Conclusiones

La semana tuvo un foco claro en **madurar el control de asistencia de monitores dentro de Control de Accesos CDU**. El avance es relevante porque fortalece tres aspectos operativos: presencia física, trazabilidad de jornada y bloqueo preventivo antes de registrar usuarios.

La mejora más importante a priorizar después de este cambio es reforzar la integridad desde la capa de datos: pruebas automatizadas para cálculos de tiempo/geocerca, reglas de Firestore o transacciones para evitar inconsistencias, y monitoreo de errores de ubicación para calibrar el radio de 100 m con evidencia real.
