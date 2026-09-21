# Informe profesional de cambios - Ecosistema CDR Landing

**Fecha de emisión:** 21 de septiembre de 2026  
**Ventana analizada:** 14 de septiembre de 2026 14:00 UTC - 21 de septiembre de 2026 14:00 UTC  
**Repositorio base del informe:** `CDR_Landing`  
**Fuente de relación entre apps:** `lib/platform-access-config.ts` y `lib/superadmin-platforms.ts` en CDR Landing  
**Método de revisión:** historial Git de `origin/main` en las aplicaciones relacionadas, revisión de archivos impactados y clasificación funcional de cambios.

---

## 1. Resumen ejecutivo

Durante la semana analizada, el ecosistema formalmente conectado a CDR Landing registró actividad relevante en la aplicación **Asistencia_cultura**, que actualmente cubre tanto **Asistencias Cultura** como **Asistencias Deporte** dentro del panel CDR. El resto de plataformas formales no presentó commits nuevos en `origin/main` durante la ventana del informe.

El bloque de trabajo más importante fue una ampliación funcional de Asistencia_cultura: se incorporó un módulo de fisioterapia, se unificó el portal de participantes entre Cultura y Deporte, se añadieron formularios de inscripción con carga de archivos a Google Drive y se corrigieron varios puntos para asegurar compilación en Vercel.

| Indicador | Resultado |
|---|---:|
| Plataformas formales revisadas | 12 |
| Repositorios formales con cambios en la semana | 1 |
| Repositorios formales sin cambios en la semana | 11 |
| Commits nuevos detectados en la ventana | 14 |
| Archivos añadidos | 53 |
| Archivos modificados | 34 |
| Inserciones aproximadas | 9.948 |
| Eliminaciones aproximadas | 1.568 |
| App con mayor impacto | `Asistencia_cultura` |

---

## 2. Alcance de aplicaciones revisadas

La siguiente matriz cruza las plataformas configuradas en CDR Landing con el repositorio observado y su estado semanal.

| Plataforma en CDR Landing | Área | Repositorio / app | Estado semanal | Observación |
|---|---|---|---|---|
| Bitácora AC | Cultura y Deporte | `BitacoraAC` | Sin cambios | No se detectaron commits nuevos en `origin/main`. |
| Bitácora COM | Cultura | `bit_com` | Sin cambios | Permanece como plataforma formal, sin actividad semanal. |
| Stock Cultura | Cultura | `stock_cultura` | Sin cambios | Sin cambios funcionales detectados en la ventana. |
| Horarios Cultura | Cultura | `Horarios_Cultura` | Sin cambios | Sin commits nuevos en la semana. |
| Asistencias Cultura | Cultura | `Asistencia_cultura` | Con cambios | Cambios mayores en formularios, portal, Drive, fisioterapia y build. |
| Canal Comunicaciones | Cultura y Deporte | `CanalComunicaciones` | Sin cambios | Sin actividad semanal detectada. |
| Stock CDU Meléndez | Deporte | `stock-cdu` | Sin cambios | Sin cambios en `origin/main`. |
| Stock CDU San Fernando | Deporte | `stock-cdu-sanfer` | Sin cambios | Sin cambios en `origin/main`. |
| Horarios CDU | Deporte | `Horarios_CDU` | Sin cambios | Sin actividad semanal detectada. |
| Control de Accesos CDU | Deporte | `gym_cdu` | Sin cambios | Sin commits nuevos en la ventana. |
| Asistencias Deporte | Deporte | `Asistencia_cultura` | Con cambios | Comparte repositorio con Asistencias Cultura; recibe el impacto del portal unificado y fisioterapia. |
| Préstamos Escenarios | Deporte | `Prestamo_Escenarios` | Sin cambios | Sin actividad semanal detectada. |

### Repositorios observados fuera de la integración formal

| Repositorio | Relación observada | Estado semanal | Recomendación |
|---|---|---|---|
| `seguimiento_cont` | Presente en el workspace, pero no aparece como plataforma formal en la configuración actual de CDR Landing. | Sin cambios | Definir si debe integrarse al catálogo CDR o mantenerse como aplicación independiente. |

---

## 3. Cambios principales detectados

### 3.1 Asistencia_cultura / Asistencias Cultura y Deporte

| Línea de trabajo | Qué se añadió o cambió | Impacto operativo |
|---|---|---|
| Módulo de fisioterapia | Se añadieron rutas para solicitudes, bitácora, seguimientos, deportistas, equipo, fisioterapeutas, actividades, reportes y resumen de fisioterapia. | Amplía la app de asistencias hacia seguimiento deportivo y gestión clínica/operativa de fisioterapia. |
| Interfaz móvil compacta | Se agregaron componentes de shell, filtros compactos, drawers, badges y ajustes visuales para escritorio y móvil. | Mejora la operación desde teléfonos y reduce fricción para monitores o personal en campo. |
| Portal unificado de participantes | Se consolidó la experiencia entre Cultura y Deporte y se redujo la duplicación en `app/inscripcion-deporte/page.tsx`. | Da una experiencia más consistente y facilita mantenimiento futuro. |
| Formularios de inscripción configurables | Se añadieron builder de formularios, campos dinámicos, reglas de visibilidad y soporte para respuestas. | Permite adaptar convocatorias/eventos sin tocar código para cada formulario. |
| Subida de archivos a Google Drive | Se incorporaron rutas API de OAuth, subida resumible por chunks, creación de carpetas y conexión Drive. | Habilita recepción de PDFs, fotos, videos y audios vinculados a inscripciones. |
| Vista de inscritos y filtros | Se mejoraron pantallas de convocatorias, asistentes y notificaciones con nuevos filtros y vistas. | Facilita seguimiento y segmentación de participantes inscritos. |
| Login de managers/directores | Se robusteció el login, se agregó explicación del motivo de fallo y se corrigieron tipos asociados. | Mejora la trazabilidad de errores de acceso y reduce soporte manual. |
| Ajustes de build | Se corrigieron tipos de fisioterapia, Drive, `eventoId`, iteración de `Map.entries`, exports y compatibilidad TypeScript. | Disminuye riesgo de fallos en build de Vercel y estabiliza despliegues. |
| Reglas Firestore | Se agregaron colecciones relacionadas con fisioterapia y formularios. | Permite operar las nuevas colecciones, aunque requiere endurecimiento de seguridad. |
| Pruebas y scripts | Se añadieron o ajustaron pruebas de permisos/roles y scripts de validación/auditoría. | Mejora capacidad de detección temprana, pero conviene ampliar cobertura de flujos críticos. |

### 3.2 Commits relevantes en la ventana

| Fecha | Commit | Resumen | Clasificación |
|---|---|---|---|
| 2026-09-15 | `d5cea01` | Login de directores más robusto y explicación del motivo de fallo. | Corrección / UX operativa |
| 2026-09-15 | `7370db0` | Corrección de tipos para compilar login de manager en Vercel. | Estabilidad de build |
| 2026-09-17 | `d52e623` | Módulo de fisioterapia e interfaz móvil compacta. | Funcionalidad nueva |
| 2026-09-17 | `5e3d7cf` | Corrección de tipo en defaults de solicitud. | Estabilidad de build |
| 2026-09-17 | `5f160a3` | Ajuste de comparación de rol que rompía build. | Estabilidad de build |
| 2026-09-17 | `2ee8471` | Corrección de nulabilidad en solicitud de drawer. | Estabilidad / TypeScript |
| 2026-09-17 | `b84fbc6` | Separación de drawer de escritorio y drawer móvil. | UX / responsive |
| 2026-09-17 | `e225064` | Unificación del portal del participante entre Cultura y Deporte. | Arquitectura / UX |
| 2026-09-17 | `fc0ae39` | Ajuste de export en layout de fisioterapia para compilar. | Estabilidad de build |
| 2026-09-18 | `ffdbc0b` | Formularios de inscripción con Drive, vista de inscritos y filtros de notificaciones. | Funcionalidad nueva |
| 2026-09-18 | `de5a6bd` | Corrección de tipo de `eventoId`. | Estabilidad de build |
| 2026-09-18 | `ea14658` | Evita iterar `Map.entries` para compatibilidad de build. | Estabilidad de build |
| 2026-09-18 | `d5437da` | Ajuste de tipos de subida de archivos. | Estabilidad de build |
| 2026-09-18 | `5ee662a` | Corrección de tipos de fisioterapia y Drive. | Estabilidad de build |

---

## 4. Qué se añadió

| Categoría | Elementos añadidos | Valor para CDR |
|---|---|---|
| Fisioterapia | Nuevas rutas `app/fisioterapia/*`, resumen de fisioterapia, componentes especializados y lógica en `lib/fisioterapia.ts`. | Incorpora gestión de solicitudes, bitácora, seguimientos y reportes deportivos dentro del ecosistema de asistencias. |
| Gestión documental | Integración Google Drive con OAuth, subida por chunks y validación de sesiones Drive. | Permite manejar documentos pesados sin cargar la base de datos con archivos binarios. |
| Formularios dinámicos | Constructor de formularios, tipos de preguntas, reglas de visibilidad y límites de archivos. | Da flexibilidad para eventos y convocatorias con requisitos variables. |
| Perfil/portal participante | Identidad de participante, perfil unificado y auditoría de documentos. | Reduce duplicidad entre Cultura y Deporte y mejora trazabilidad. |
| UI reutilizable | Componentes de drawer, hover card, tooltip, textarea, questionnaire, file card y filtros compactos. | Mejora experiencia y acelera nuevas pantallas. |
| Validación técnica | Tests de permisos/roles, scripts de auditoría y ajustes TypeScript. | Refuerza control de calidad en áreas críticas. |

---

## 5. Qué se cambió o mejoró

| Área | Cambio realizado | Beneficio |
|---|---|---|
| Autenticación | Login de managers/directores con manejo de errores más explícito. | Menos fallos silenciosos y mejor diagnóstico. |
| Experiencia responsive | Drawers diferenciados para escritorio y móvil. | Mejor usabilidad en operación diaria desde celular. |
| Convocatorias y eventos | Ajustes en páginas de convocatorias, asistentes y notificaciones. | Mejor administración de inscritos y filtros. |
| Arquitectura de portal | Reducción de duplicidad en inscripción deportiva y consolidación de perfil. | Menor costo de mantenimiento. |
| Build y tipos | Correcciones de TypeScript y compatibilidad de iteraciones. | Mayor probabilidad de despliegues exitosos en Vercel. |
| Firestore | Nuevas colecciones y reglas para fisioterapia/formularios. | Soporte para nuevas capacidades de datos. |

---

## 6. Oportunidades de mejora priorizadas

| Prioridad | Mejora recomendada | Motivo | Acción sugerida |
|---|---|---|---|
| Alta | Endurecer reglas de Firestore | El archivo `firestore.rules.txt` permite `read, write: if true`, incluyendo un comodín para cualquier colección. Esto habilita operación rápida, pero deja una superficie de riesgo muy amplia. | Diseñar reglas por rol, área y colección; separar formularios públicos de paneles administrativos; validar acceso con autenticación o tokens acotados. |
| Alta | Revisar manejo de secretos de Google Drive | La integración usa OAuth/Service Account y archivo local `secrets.drive-oauth.json`. | Asegurar que tokens solo vivan en variables de entorno o almacenamiento seguro; documentar rotación y permisos mínimos de Drive. |
| Alta | Validar flujo completo de inscripción con archivos | La subida de archivos incluye chunks, sesiones y límites por tipo. | Probar PDF/foto/video/audio en producción o staging, incluyendo fallos por cuota, cancelación y reintentos. |
| Media | Aumentar cobertura automatizada de fisioterapia | El módulo nuevo es amplio y toca permisos, Firestore, UI y reportes. | Agregar pruebas de permisos por rol, creación/edición de solicitudes, bitácora y seguimiento. |
| Media | Documentar modelo de datos nuevo | Se agregaron colecciones de fisioterapia, formularios y respuestas. | Crear una guía de colecciones, campos obligatorios y relaciones para soporte y mantenimiento. |
| Media | Definir integración formal de `seguimiento_cont` | Está presente en el workspace, pero no figura en CDR Landing. | Decidir si será plataforma del superadmin CDR o app independiente fuera del catálogo. |
| Media | Normalizar nomenclatura Asistencias Cultura/Deporte | Ambas plataformas apuntan al mismo repositorio y URL base. | Documentar claramente cómo se separan datos, roles y áreas dentro de la misma app. |
| Baja | Crear reporte semanal acumulativo | Actualmente el informe queda como archivo estático. | Mantener un historial por fecha en carpeta `docs/informes/` para trazabilidad mensual. |

---

## 7. Riesgos y controles sugeridos

| Riesgo | Nivel | Evidencia | Control recomendado |
|---|---|---|---|
| Reglas Firestore demasiado permisivas | Alto | `allow read, write: if true` y comodín global en `firestore.rules.txt`. | Restringir por autenticación, rol CDR, área y tipo de operación. |
| Complejidad nueva concentrada en una sola semana | Medio | 87 archivos impactados y casi 10.000 inserciones. | Validación funcional por flujo antes de promover a producción. |
| Dependencia operativa de Google Drive | Medio | Nuevas rutas OAuth y carga resumible. | Monitorear cuotas, permisos de carpetas y expiración/rotación de credenciales. |
| Divergencia entre Cultura y Deporte dentro de una misma app | Medio | Portal unificado y uso compartido del repo `Asistencia_cultura`. | Asegurar filtros por área y pruebas de separación de datos. |
| Plataformas sin cambios recientes | Bajo | 11 repos formales sin commits en la ventana. | Mantener monitoreo; no implica problema, pero conviene revisar deuda técnica periódicamente. |

---

## 8. Estado por repositorio

| Repositorio | Commits nuevos | Archivos impactados | Estado | Lectura ejecutiva |
|---|---:|---:|---|---|
| `Asistencia_cultura` | 14 | 87 | Activo | Evolución fuerte: fisioterapia, Drive, formularios, portal unificado y correcciones de build. |
| `CDR_Landing` | 0 | 0 | Sin cambios | No hubo ajustes directos al portal CDR en la ventana. |
| `BitacoraAC` | 0 | 0 | Sin cambios | Sin novedades semanales. |
| `bit_com` | 0 | 0 | Sin cambios | Sin novedades semanales. |
| `stock_cultura` | 0 | 0 | Sin cambios | Sin novedades semanales. |
| `Horarios_Cultura` | 0 | 0 | Sin cambios | Sin novedades semanales. |
| `CanalComunicaciones` | 0 | 0 | Sin cambios | Sin novedades semanales. |
| `stock-cdu` | 0 | 0 | Sin cambios | Sin novedades semanales. |
| `stock-cdu-sanfer` | 0 | 0 | Sin cambios | Sin novedades semanales. |
| `Horarios_CDU` | 0 | 0 | Sin cambios | Sin novedades semanales. |
| `gym_cdu` | 0 | 0 | Sin cambios | Sin novedades semanales. |
| `Prestamo_Escenarios` | 0 | 0 | Sin cambios | Sin novedades semanales. |
| `seguimiento_cont` | 0 | 0 | No integrado formalmente | Presente en workspace; no listado en configuración CDR. |

---

## 9. Conclusión

La semana estuvo concentrada en **Asistencia_cultura**, con una evolución significativa que convierte la app en un componente más amplio para Cultura y Deporte: formularios dinámicos, carga documental, fisioterapia y portal unificado. El cambio es valioso para CDR porque incrementa la capacidad operativa desde una plataforma ya conectada al panel central.

El principal punto a atender antes de considerar el flujo completamente maduro es **seguridad y control de acceso**, especialmente en Firestore y Google Drive. También conviene reforzar pruebas end-to-end de inscripción, archivos y fisioterapia, ya que son flujos nuevos y de alto impacto para usuarios finales y administradores.

---

## 10. Validación realizada

| Validación | Resultado |
|---|---|
| Actualización de referencias remotas con `git fetch --all --prune` | Completada en repos revisados. |
| Revisión de `origin/main` por app formal | Completada. |
| Confirmación de ventana semanal del cron | 14 sep 2026 14:00 UTC - 21 sep 2026 14:00 UTC. |
| Revisión de configuración CDR para plataformas formales | Completada con `platform-access-config.ts` y `superadmin-platforms.ts`. |
| Ejecución de build/test | No aplica: este cambio agrega documentación y no modifica código ejecutable. |
