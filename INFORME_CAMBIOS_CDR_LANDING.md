# Informe semanal de cambios - CDR Landing y aplicaciones relacionadas

**Fecha de emisión:** 26 de octubre de 2026  
**Ventana analizada:** 19 de octubre de 2026 14:01 UTC - 26 de octubre de 2026 14:00 UTC  
**Fuente de análisis:** ramas `origin/main` actualizadas con `git fetch --all --prune`  
**Alcance:** CDR Landing, sus plataformas formales configuradas en `lib/platform-access-config.ts` y el repositorio relacionado `seguimiento_cont`.

---

## 1. Resumen ejecutivo

Durante la semana analizada se revisaron **13 repositorios** del ecosistema CDR: el portal **CDR Landing**, las **12 plataformas formales** expuestas desde el portal y un repositorio relacionado que se ha seguido en informes anteriores. La actividad de desarrollo estuvo concentrada en **Asistencia_cultura**, repositorio que respalda los accesos de **Asistencias Cultura** y **Asistencias Deporte** dentro de CDR Landing.

| Indicador | Resultado |
| --- | ---: |
| Repositorios revisados | 13 |
| Plataformas formales de CDR Landing revisadas | 12 |
| Repositorios con cambios en la ventana | 1 |
| Commits detectados | 7 |
| Archivos modificados | 6 |
| Líneas añadidas | 340 |
| Líneas eliminadas | 143 |

**Lectura general:** no hubo cambios directos en `CDR_Landing` ni en la configuración de accesos del portal. Los cambios sí fortalecen una plataforma integrada al portal: **Asistencias**, especialmente en generación de reportes, consistencia de indicadores, exportación a Excel y experiencia de inscripción a eventos/formularios.

---

## 2. Alcance de aplicaciones revisadas

| Aplicación / acceso en CDR Landing | Repositorio | Área | Relación con CDR Landing | Commits en la semana | Estado |
| --- | --- | --- | --- | ---: | --- |
| CDR Landing | `CDR_Landing` | Transversal | Portal de acceso, SSO y administración de plataformas | 0 | Sin cambios |
| Bitácora AC | `BitacoraAC` | Cultura y Deporte | Plataforma formal con asignación manual | 0 | Sin cambios |
| Bitácora COM | `bit_com` | Cultura | Plataforma formal con asignación manual | 0 | Sin cambios |
| Stock Cultura | `stock_cultura` | Cultura | Plataforma formal con URL externa | 0 | Sin cambios |
| Horarios Cultura | `Horarios_Cultura` | Cultura | Plataforma formal con URL externa | 0 | Sin cambios |
| Asistencias Cultura | `Asistencia_cultura` | Cultura | Plataforma formal; comparte repo con Asistencias Deporte | 7 | Con cambios |
| Canal Comunicaciones | `CanalComunicaciones` | Cultura y Deporte | Plataforma formal con roles nativos | 0 | Sin cambios |
| Stock CDU Meléndez | `stock-cdu` | Deporte | Plataforma formal con URL externa | 0 | Sin cambios |
| Stock CDU San Fernando | `stock-cdu-sanfer` | Deporte | Plataforma formal con configuración de sede | 0 | Sin cambios |
| Horarios CDU | `Horarios_CDU` | Deporte | Plataforma formal con URL externa | 0 | Sin cambios |
| Control de Accesos CDU | `gym_cdu` | Deporte | Plataforma formal con sede y espacio por monitor | 0 | Sin cambios |
| Asistencias Deporte | `Asistencia_cultura` | Deporte | Plataforma formal; comparte repo con Asistencias Cultura | 7 | Con cambios por repo compartido |
| Préstamos Escenarios | `Prestamo_Escenarios` | Deporte | Plataforma formal con asignación manual | 0 | Sin cambios |
| Seguimiento Cont. | `seguimiento_cont` | Relacionado | Repositorio observado en informes previos; no aparece como plataforma formal en CDR Landing | 0 | Sin cambios |

---

## 3. Cambios detectados por aplicación

### 3.1 Asistencias Cultura / Asistencias Deporte

Repositorio: `Asistencia_cultura`  
Commits detectados: **7**  
Archivos modificados: `app/estadisticas/page.tsx`, `lib/pdf-generator.ts`, `lib/inscription-form.ts`, `components/inscription-form-builder.tsx`, `components/inscription-form-fields.tsx`, `components/cultura-user-profile.tsx`

| Frente de cambio | Qué se cambió | Qué se añadió | Impacto operativo |
| --- | --- | --- | --- |
| Reportes PDF e indicadores | Se ajustó el cálculo de indicadores para respetar el rango de fechas seleccionado por el usuario. También se alineó el conteo de representaciones con el criterio de "plazas" usado en el indicador 2. | Helper `isWithinReportRange`, notas explicativas dentro del PDF, tabla "Cómo leer este informe", totales por tabla y desglose por género de usuarios únicos por grupo. | Los reportes son más coherentes: las metas alcanzadas, las representaciones y los totales responden al mismo corte temporal. Esto reduce diferencias entre pantalla, PDF y análisis institucional. |
| Exportación a Excel | Se reemplazó el filtrado manual por fechas con la misma lógica de rango usada para el PDF. | Reutilización de `isWithinReportRange` para que el Excel use el mismo corte del informe. | Evita inconsistencias entre el PDF y el archivo Excel cuando se generan con un rango de fechas. |
| Usuarios únicos por grupo | Se dejó de depender de inscripciones globales sin filtro de fecha para el indicador 1. | Cálculo de usuarios únicos con asistencia por grupo dentro del período, más desglose Mujer / Hombre / Otro. | El indicador de inscritos queda ligado a evidencia de actividad dentro del período, facilitando auditoría y lectura de resultados. |
| Formularios de inscripción | Se mejoró la creación de preguntas de opción múltiple. Antes las opciones se limitaban a 20 y debían gestionarse de forma más manual. | Función `parseMultipleChoiceList`, caja para pegar listas completas y deduplicación case-insensitive de opciones. | Los administradores pueden cargar listas extensas de opciones más rápido, por ejemplo programas, dependencias o categorías. |
| Experiencia del usuario en formularios | Se ajustó el contraste de campos y opciones sobre fondo oscuro. El botón de envío ya no queda antes del formulario activo. | Propiedad `tone="dark"` para renderizar formularios en contexto oscuro y botón de envío al final del formulario. | Mejora la legibilidad y reduce errores de inscripción porque el usuario completa el formulario antes de encontrar la acción final. |

### 3.2 Commits incluidos

| Commit | Fecha | Descripción funcional |
| --- | --- | --- |
| `54fdf1a` | 2026-10-19 | Contar representaciones del resumen por plazas, igual que el indicador 2. |
| `6f8fbd4` | 2026-10-19 | Limitar informe e indicador 1 al período de fechas elegido. |
| `9956c71` | 2026-10-19 | Agregar total y desglose por género de usuarios únicos por grupo. |
| `cc8914b` | 2026-10-19 | Usar en Excel el mismo corte de fechas del informe para que las asistencias coincidan. |
| `43bd77c` | 2026-10-22 | Permitir pegar listas en opción múltiple sin tope de respuestas. |
| `44998f2` | 2026-10-22 | Subir contraste del formulario de inscripción para lectura en fondo oscuro. |
| `daeea44` | 2026-10-22 | Dejar el botón de enviar inscripción al final del formulario de usuario. |

---

## 4. Aplicaciones sin cambios detectados

| Aplicación | Repositorio | Observación |
| --- | --- | --- |
| CDR Landing | `CDR_Landing` | No hubo cambios en el portal, SSO, asignación de plataformas ni dashboard. |
| Bitácora AC | `BitacoraAC` | Sin actividad en `origin/main` durante la ventana. |
| Bitácora COM | `bit_com` | Sin actividad en `origin/main` durante la ventana. |
| Canal Comunicaciones | `CanalComunicaciones` | Sin actividad en `origin/main` durante la ventana. |
| Control de Accesos CDU | `gym_cdu` | Sin actividad en `origin/main` durante la ventana. |
| Horarios CDU | `Horarios_CDU` | Sin actividad en `origin/main` durante la ventana. |
| Horarios Cultura | `Horarios_Cultura` | Sin actividad en `origin/main` durante la ventana. |
| Préstamos Escenarios | `Prestamo_Escenarios` | Sin actividad en `origin/main` durante la ventana. |
| Seguimiento Cont. | `seguimiento_cont` | Sin actividad; sigue sin aparecer como acceso formal en la configuración de CDR Landing. |
| Stock Cultura | `stock_cultura` | Sin actividad en `origin/main` durante la ventana. |
| Stock CDU Meléndez | `stock-cdu` | Sin actividad en `origin/main` durante la ventana. |
| Stock CDU San Fernando | `stock-cdu-sanfer` | Sin actividad en `origin/main` durante la ventana. |

---

## 5. Riesgos y puntos de atención

| Riesgo / punto de atención | Nivel | Motivo | Recomendación |
| --- | --- | --- | --- |
| Cambio en la definición de "inscritos" para indicador 1 | Medio | Ahora se calcula con usuarios únicos con asistencia en el período, no con inscripciones globales sin fecha. Esto puede cambiar cifras frente a reportes históricos. | Documentar formalmente la definición usada y validar con un conjunto de datos conocido antes de comparar contra informes antiguos. |
| Comparación por día calendario en rangos de reporte | Medio | La nueva lógica compara por clave `YYYY-MM-DD`, lo que mejora la inclusión del día completo, pero debe validarse con zonas horarias y fechas almacenadas como `Date` o string. | Agregar pruebas unitarias para límites de fecha: desde, hasta, ambos campos, fechas inválidas y registros al final del día. |
| Opciones múltiples sin límite de cantidad | Medio | Quitar el tope de 20 opciones mejora la operación, pero formularios con listas muy extensas pueden afectar usabilidad o rendimiento. | Definir un límite funcional razonable o advertencias visuales cuando la lista sea muy grande. |
| Reportes PDF con mayor densidad de contenido | Bajo | Se añadieron notas, tablas y totales; el PDF será más explicativo, pero también más extenso. | Revisar paginación con datos reales grandes y asegurar que tablas largas no corten información. |
| Cambios visuales en formularios oscuros | Bajo | Se ajustaron colores y ubicación del botón. Aunque mejora la experiencia, conviene verificar en dispositivos móviles. | Realizar una prueba visual rápida en móvil y escritorio para formularios con texto, opción múltiple y adjuntos. |

---

## 6. Oportunidades de mejora recomendadas

| Prioridad | Mejora propuesta | Beneficio esperado |
| --- | --- | --- |
| Alta | Crear pruebas automatizadas para `isWithinReportRange` y para la paridad PDF/Excel. | Reduce regresiones en reportes institucionales y evita diferencias entre formatos. |
| Alta | Documentar en la interfaz del módulo de estadísticas la definición exacta de participación, usuario único, plaza e inscrito a grupo. | Disminuye dudas al interpretar indicadores y facilita la revisión por áreas administrativas. |
| Media | Agregar pruebas end-to-end del flujo de inscripción de usuario: completar formulario, adjuntar archivo, enviar y editar. | Asegura que el cambio de botón y contraste no rompa el flujo real de inscripción. |
| Media | Implementar una validación o aviso para preguntas de opción múltiple con muchas opciones. | Mantiene la mejora de carga masiva sin degradar formularios largos. |
| Media | Incorporar un chequeo semanal automatizado de enlaces y SSO de todas las plataformas expuestas por CDR Landing. | Detecta temprano URLs caídas, variables de entorno faltantes o fallos de redirección. |
| Baja | Convertir este informe semanal en un generador automatizado con salida estructurada. | Ahorra tiempo y deja trazabilidad homogénea entre semanas. |

---

## 7. Conclusión

La semana no tuvo cambios en el portal `CDR_Landing`, pero sí en una plataforma central del ecosistema: **Asistencias**. Los cambios son relevantes porque corrigen y aclaran la forma en que se calculan los indicadores institucionales, hacen más consistente la relación entre PDF y Excel, y mejoran la experiencia de inscripción tanto para administradores como para usuarios finales.

La recomendación principal es **validar con pruebas automatizadas los rangos de fechas y la paridad entre PDF y Excel**, porque esa lógica ahora concentra decisiones críticas de reporte. Como segunda prioridad, conviene formalizar la definición de cada métrica para evitar comparaciones incorrectas con informes históricos.
