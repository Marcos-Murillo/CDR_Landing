# Informe profesional de cambios - Ecosistema CDR Landing

**Periodo revisado:** 2026-10-12 14:01 UTC a 2026-10-19 14:01 UTC  
**Fecha de elaboracion:** 2026-10-19  
**Fuente tecnica:** historial `origin/main` de los repositorios relacionados con CDR Landing  
**Alcance:** CDR Landing, plataformas formales configuradas en `lib/platform-access-config.ts` y repositorios relacionados presentes en el workspace.

## 1. Resumen ejecutivo

Durante la semana revisada se detectaron cambios funcionales en **Asistencia Cultura**, repositorio que soporta las plataformas **Asistencias Cultura** y **Asistencias Deporte** dentro del ecosistema CDR Landing. El resto de aplicaciones formales no presento commits nuevos en `origin/main` dentro del periodo.

Los cambios se concentraron en dos frentes:

1. **Torneos deportivos por equipos:** se habilito un flujo mas completo para que usuarios creen equipos, se unan mediante codigo, gestionen integrantes y consulten el seguimiento del torneo.
2. **Indicadores y reportes de participacion:** se ajustaron conteos de personas unicas tanto en reportes PDF como en la vista de grupos, buscando consistencia con los indicadores principales.

| Indicador | Resultado semanal |
| --- | ---: |
| Repositorios formales revisados | 12 |
| Repositorios relacionados adicionales revisados | 1 |
| Repositorios con cambios | 1 |
| Commits detectados | 3 |
| Archivos unicos modificados o agregados | 10 |
| Lineas agregadas reportadas por Git | 1.625 |
| Lineas eliminadas reportadas por Git | 242 |

## 2. Apps revisadas y estado de cambios

| App / Plataforma CDR | Repositorio | Area | Estado en el periodo | Observacion |
| --- | --- | --- | --- | --- |
| CDR Landing | `CDR_Landing` | Cultura / Deporte | Sin cambios | Portal central y configuracion de accesos sin commits nuevos. |
| Bitacora AC | `BitacoraAC` | Cultura / Deporte | Sin cambios | Sin actividad nueva en `origin/main`. |
| Bitacora Comunicaciones | `bit_com` | Cultura | Sin cambios | Sin actividad nueva en `origin/main`. |
| Stock Cultura | `stock_cultura` | Cultura | Sin cambios | Sin actividad nueva en `origin/main`. |
| Horarios Cultura | `Horarios_Cultura` | Cultura | Sin cambios | Sin actividad nueva en `origin/main`. |
| Asistencias Cultura | `Asistencia_cultura` | Cultura | **Con cambios** | Cambios en reportes, grupos y componentes compartidos de perfil. |
| Canal Comunicaciones | `CanalComunicaciones` | Cultura / Deporte | Sin cambios | Sin actividad nueva en `origin/main`. |
| Stock CDU Melendez | `stock-cdu` | Deporte | Sin cambios | Sin actividad nueva en `origin/main`. |
| Stock CDU San Fernando | `stock-cdu-sanfer` | Deporte | Sin cambios | Sin actividad nueva en `origin/main`. |
| Horarios CDU | `Horarios_CDU` | Deporte | Sin cambios | Sin actividad nueva en `origin/main`. |
| Control de Accesos CDU | `gym_cdu` | Deporte | Sin cambios | Sin actividad nueva en `origin/main`. |
| Asistencias Deporte | `Asistencia_cultura` | Deporte | **Con cambios** | Principal beneficiada por el nuevo flujo de torneos. |
| Prestamos Escenarios | `Prestamo_Escenarios` | Deporte | Sin cambios | Sin actividad nueva en `origin/main`. |
| Seguimiento Cont. | `seguimiento_cont` | Relacionada, no formal en CDR Landing | Sin cambios | Repositorio relacionado historicamente, pero no listado como plataforma formal en CDR Landing. |

## 3. Detalle de commits detectados

| Fecha | Repositorio | Commit | Cambio principal | Tipo de impacto |
| --- | --- | --- | --- | --- |
| 2026-10-14 | `Asistencia_cultura` | `7b7a991` | Mostrar en el resumen del PDF el total de participantes unicos por grupo. | Reporteria / indicadores |
| 2026-10-14 | `Asistencia_cultura` | `031277e` | Permitir inscripcion a torneos por equipo y descargar listas separadas por equipo. | Funcionalidad nueva |
| 2026-10-16 | `Asistencia_cultura` | `4e909c3` | Contar en Grupos las mismas personas distintas que el indicador 1. | Consistencia de datos |

## 4. Cambios funcionales realizados

| Frente | Que se cambio | Que se agrego | Beneficio operativo |
| --- | --- | --- | --- |
| Reporte PDF de asistencias | El resumen ahora calcula participantes unicos por grupo y suma esos valores por grupo. | Nueva fila de resumen: `Participantes unicos en grupos`. | Hace mas claro el alcance real de participacion por grupo, especialmente cuando una misma persona participa en mas de un grupo. |
| Vista de grupos | El total de inscritos dejo de sumar inscripciones brutas y ahora usa personas distintas por `userId`. | Indicador visual `Personas distintas` en el panel de grupos. | Evita inflar cifras por duplicados y alinea la vista con el indicador principal. |
| Conteo por grupo | Se ajusto la consulta para contar usuarios unicos por grupo, tolerando inscripciones sin perfil y duplicados. | Diagnosticos de consola para inscripciones sin perfil, grupos desconocidos y duplicados. | Mejora la trazabilidad de datos inconsistentes sin romper la visualizacion. |
| Torneos por equipos | Los equipos pasan a ser creados por delegados durante la etapa de inscripcion. | Flujo de creacion de equipo, codigo de acceso, delegado, escudo e integrantes. | Reduce carga manual del administrador y permite que los participantes gestionen la conformacion del equipo. |
| Inscripcion de jugadores | Se agrego busqueda por cedula para que el delegado inscriba integrantes. | Validacion de identidad entre Cultura y Deporte, manejo de conflictos y alta del usuario en area deporte si aplica. | Facilita inscripciones operativas sin duplicar registros de personas. |
| Union a equipo | Los jugadores pueden unirse con codigo de 4 caracteres entregado por el delegado. | Modal de seleccion de torneo, equipo y codigo. | Da autonomia al usuario final y mantiene control basico por codigo. |
| Seguimiento de torneos para usuarios | El perfil de usuario ahora muestra los torneos en los que participa. | Seccion `Torneos` con detalle de fase, equipo, tabla de puntos y partidos. | Mejora transparencia para participantes y reduce consultas manuales al equipo administrativo. |
| Administracion de torneo | La vista administrativa incorpora exportaciones por equipo y control de inicio de torneo. | Descarga Excel, descarga PDF, grupos por cantidad definida y generacion de partidos de fase de grupos. | Entrega insumos listos para operacion y planificacion del torneo. |
| Modelo de datos de torneos | Se ampliaron estructuras de torneo, equipo e inscripcion. | `inscripcionInicio`, `inscripcionFin`, `delegadoId`, `escudoUrl`, rol de inscripcion `delegado` / `jugador`. | Soporta reglas mas claras de apertura, cierre, pertenencia y representacion visual de equipos. |
| Utilidades compartidas | Se centralizaron funciones de torneos. | `lib/torneo-utils.ts` con fechas, estado de inscripcion, labels y calculo de posiciones. | Reduce duplicacion y facilita mantener reglas consistentes entre admin y usuario. |

## 5. Archivos modificados o agregados

| Archivo | Tipo | Descripcion del cambio |
| --- | --- | --- |
| `lib/pdf-generator.ts` | Modificado | Ajusta el resumen PDF para mostrar participantes unicos por grupo. |
| `app/grupos/page.tsx` | Modificado | Recalcula el total de inscritos como personas distintas, no como suma bruta de inscripciones. |
| `lib/db-router.ts` | Modificado | Agrega soporte de torneos por equipo, roles, busquedas, inscripciones, export data y conteos unicos. |
| `lib/types.ts` | Modificado | Amplia tipos de torneos, equipos e inscripciones. |
| `app/torneos/page.tsx` | Modificado | Incorpora fechas de inscripcion y nuevas reglas de gestion de torneos. |
| `app/torneos/[id]/page.tsx` | Modificado | Agrega exportacion Excel/PDF, listado por equipo, inicio de torneo y mejoras visuales. |
| `components/cultura-user-profile.tsx` | Modificado | Integra acceso al flujo de inscripcion y visualizacion de torneos del usuario. |
| `components/torneo-inscripcion-dialog.tsx` | Agregado | Nuevo modal completo para crear equipo, unirse por codigo e inscribir integrantes. |
| `components/torneos-usuario-section.tsx` | Agregado | Nueva seccion de perfil para seguimiento de torneos del usuario. |
| `lib/torneo-utils.ts` | Agregado | Utilidades compartidas para fechas, estados, labels y tabla de posiciones. |

## 6. Impacto por tipo de usuario

| Usuario / Rol | Impacto positivo | Cambio visible |
| --- | --- | --- |
| Superadmin / administrador CDR | Menos carga manual al permitir que delegados creen equipos e inscriban integrantes. | Puede exportar listados por equipo y arrancar torneo cuando cierre la inscripcion. |
| Monitor / operador | Datos de grupos mas consistentes para seguimiento y reportes. | Total de personas distintas visible en grupos. |
| Delegado de equipo | Puede crear su equipo, compartir codigo, subir escudo e inscribir jugadores por cedula. | Nuevo modal de inscripcion con pasos guiados. |
| Jugador / participante | Puede unirse a un equipo con codigo y revisar su torneo desde el perfil. | Nueva seccion `Torneos` con tabla, partidos y estado. |
| Direccion / reporting | Cifras de participacion menos propensas a duplicidad. | PDF con resumen ampliado y conteos alineados. |

## 7. Riesgos y puntos de atencion

| Riesgo | Severidad | Motivo | Recomendacion |
| --- | --- | --- | --- |
| Falta de pruebas automatizadas para torneos | Alta | El flujo nuevo toca creacion de equipos, inscripciones, roles, exportaciones y generacion de partidos. | Agregar pruebas unitarias para utilidades y pruebas de integracion para inscripcion, delegado, union por codigo y cierre de inscripciones. |
| Exportaciones con datos personales | Alta | Los archivos Excel/PDF incluyen cedula, codigo estudiantil, facultad y programa. | Validar permisos estrictos antes de exportar, registrar auditoria de descargas y confirmar si todos los campos son necesarios. |
| Posibles indices faltantes en Firestore | Media | Nuevas consultas por `torneoId`, `codigo`, `userId` y documentos por lotes pueden requerir indices o reglas actualizadas. | Revisar consola de Firestore y documentar indices obligatorios por coleccion. |
| Codigo de equipo con baja probabilidad de colision | Media | El generador intenta evitar duplicados, pero conviene manejar fallo explicito tras varios intentos. | Lanzar error si no se logra codigo unico despues del maximo de intentos. |
| Rendimiento en torneos grandes | Media | Algunas vistas cargan equipos, inscripciones, partidos y nombres de usuario en cliente. | Incorporar paginacion, agregados o consultas optimizadas si crece el volumen de participantes. |
| Compatibilidad de datos historicos | Media | Equipos antiguos pueden no tener `delegadoId`, `escudoUrl` o roles de inscripcion. | Preparar migracion o fallback visual/operativo para torneos existentes. |
| Conteos con perfil faltante | Baja | El sistema ahora cuenta usuarios por inscripcion aunque no encuentre perfil para genero. | Crear rutina de limpieza para inscripciones huerfanas y perfiles incompletos. |

## 8. Oportunidades de mejora priorizadas

| Prioridad | Mejora propuesta | Valor esperado | Esfuerzo estimado |
| --- | --- | --- | --- |
| P1 | Crear suite de pruebas para el flujo de torneos por equipos. | Reduce riesgo de regresiones en una funcionalidad nueva y de alto uso. | Medio |
| P1 | Endurecer permisos y auditoria de exportaciones Excel/PDF. | Protege datos personales y mejora trazabilidad administrativa. | Medio |
| P2 | Documentar indices y reglas Firestore necesarias para torneos. | Disminuye fallos en produccion por consultas no indexadas o permisos incompletos. | Bajo |
| P2 | Agregar validaciones de capacidad por equipo y reglas de torneo. | Evita equipos incompletos, sobrecupos o inscripciones fuera de reglas. | Medio |
| P2 | Mejorar manejo de colisiones de codigos de equipo. | Asegura unicidad operacional aun en escenarios improbables. | Bajo |
| P3 | Incorporar panel de metricas de torneos. | Permite ver inscritos, equipos, pendientes y avance por torneo sin exportar. | Medio |
| P3 | Optimizar carga de seguimiento del usuario. | Mejora experiencia en perfiles con varios torneos o torneos con muchos partidos. | Medio |

## 9. Conclusiones

La semana tuvo un foco claro en **fortalecer Asistencias Deporte** con capacidades de torneos por equipos y en **mejorar la calidad de los indicadores de participacion**. Aunque solo un repositorio tuvo actividad, el impacto funcional es relevante porque amplifica el autoservicio de participantes, delegados y administradores.

La recomendacion principal es acompañar estos cambios con pruebas, validacion de permisos sobre exportaciones y revision de indices/reglas de Firestore antes de escalar el uso de torneos a eventos masivos.

