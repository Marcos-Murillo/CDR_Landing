# Informe profesional de cambios del ecosistema CDR Landing

**Fecha de corte:** 14 de septiembre de 2026  
**Repositorio central:** `CDR_Landing`  
**Rama de trabajo:** `cursor/informe-de-cambios-cdr-landing-8aee`  
**Alcance revisado:** CDR Landing y las aplicaciones registradas o relacionadas con el hub de Cultura y Deporte.  
**Fuentes revisadas:** configuración vigente de plataformas en `lib/platform-access-config.ts`, `lib/superadmin-platforms.ts`, manual de uso del sistema y últimos commits disponibles en los repositorios del workspace.

---

## 1. Resumen ejecutivo

CDR Landing funciona como el punto central de acceso, administración y consulta para las plataformas digitales asociadas a Cultura y Deporte. El ecosistema evolucionó hacia un modelo más gobernado: las plataformas se asignan manualmente desde el superadministrador, se fortaleció el SSO entre aplicaciones, se incorporó operación multi-sede y se ampliaron reportes ejecutivos en módulos clave.

| Frente de trabajo | Cambios principales identificados | Impacto operativo |
|---|---|---|
| Gobierno de accesos | Todas las plataformas formales se administran mediante asignación manual desde CDR Landing. | Mayor control sobre qué usuario ve cada aplicación, reduciendo accesos automáticos por área. |
| Integración SSO | CDR Landing actúa como emisor de tokens y enruta hacia plataformas como Asistencias, Canal, Horarios, Stock, Control de Accesos CDU y Préstamos. | Menos fricción para usuarios administradores y monitores; mejor trazabilidad de roles. |
| Operación multi-sede | Se consolidaron flujos para Meléndez y San Fernando en Control de Accesos CDU, Stock CDU San Fernando y Préstamos Escenarios. | Permite separar operación, reportes y préstamos por sede. |
| Reportería | Se añadieron PDF, Excel, gráficas, reportes de asistencia, arqueo de inventario e indicadores. | Mejora la toma de decisiones y la rendición de cuentas. |
| Experiencia de usuario | Mejoras en cards, dashboards, formularios, navegación por rol, restricciones para managers y vistas móviles. | Reduce errores de operación diaria y mejora la adopción del sistema. |
| Calidad de despliegue | Correcciones TypeScript, ajustes de lockfiles, URLs canónicas y plantillas de variables. | Disminuye fallos en Vercel y hace más reproducibles los despliegues. |

---

## 2. Alcance de aplicaciones revisadas

El alcance principal se definió desde las plataformas declaradas en CDR Landing. También se identificó un sistema relacionado que no está formalmente integrado.

| App / Plataforma | Repositorio | Área | Estado frente a CDR Landing | Observación |
|---|---|---|---|---|
| CDR Landing | `CDR_Landing` | Cultura y Deporte | Hub central | Emite SSO, administra usuarios, permisos y paneles. |
| Asistencias Cultura | `Asistencia_cultura` | Cultura | Integrada | Comparte repositorio con Asistencias Deporte. |
| Asistencias Deporte | `Asistencia_cultura` | Deporte | Integrada | Incluye reportes y flujos específicos para deporte. |
| Control de Accesos CDU | `gym_cdu` | Deporte | Integrada | Antes referida como GymControl/CDUControl; nombre vigente: Control de Accesos CDU. |
| Stock CDU Meléndez | `stock-cdu` | Deporte | Integrada | Inventario y préstamos deportivos. |
| Stock CDU San Fernando | `stock-cdu-sanfer` | Deporte | Integrada | Operación separada para sede San Fernando. |
| Préstamos Escenarios | `Prestamo_Escenarios` | Deporte | Integrada | Reservas de escenarios y búsqueda de usuarios desde Gym/CDU. |
| Horarios CDU | `Horarios_CDU` | Deporte | Integrada | Consulta y administración de grupos deportivos. |
| Horarios Cultura | `Horarios_Cultura` | Cultura | Integrada | Consulta y administración de grupos culturales. |
| Stock Cultura | `stock_cultura` | Cultura | Integrada | Inventario cultural con acceso desde CDR. |
| Canal Comunicaciones | `CanalComunicaciones` | Cultura y Deporte | Integrada | SSO con rol/área y restricciones por tipo de usuario. |
| Bitácora COM | `bit_com` | Cultura | Registrada en CDR | Requiere validar cierre completo de SSO en app destino. |
| Bitácora AC | `BitacoraAC` | Cultura y Deporte | Registrada en CDR | CDR la habilita para ambas áreas; app destino tiene poca actividad reciente. |
| Seguimiento Contratistas | `seguimiento_cont` | Administrativo | No integrada formalmente | No aparece como `PlatformId`, no tiene launcher ni contrato SSO en CDR. |

---

## 3. Matriz actual de integración CDR

| Plataforma | Asignación desde CDR | SSO desde CDR | Datos especiales enviados / requeridos | KPI o resumen en CDR | Nivel de integración |
|---|---|---|---|---|---|
| Asistencias Cultura / Deporte | Manual | Sí | Rol, área, usuario; redirect a vistas internas. | Sí | Alto |
| Control de Accesos CDU | Manual | Sí | Cédula, sede y espacio cuando aplica. | Sí | Alto |
| Stock CDU Meléndez | Manual | Sí | Rol de inventario. | Sí | Alto |
| Stock CDU San Fernando | Manual | Sí | Sede asociada y URL canónica. | Parcial | Medio / Alto |
| Préstamos Escenarios | Manual | Sí | Rol administrativo y contexto de sede. | Parcial / Vista 360 | Medio / Alto |
| Horarios Cultura | Manual | Sí | Redirect administrativo hacia `/adofi`. | No | Medio |
| Horarios CDU | Manual | Sí | Redirect administrativo hacia `/adofi`. | No | Medio |
| Stock Cultura | Manual | Sí | Rol de inventario cultural. | Sí | Medio / Alto |
| Canal Comunicaciones | Manual | Sí | Rol nativo de Canal y área del usuario. | No | Alto |
| Bitácora COM | Manual | Declarado desde CDR | Rol CDR mapeado a rol de plataforma. | No | Medio / Bajo |
| Bitácora AC | Manual | Declarado desde CDR | Área Cultura/Deporte para redirección. | No | Medio / Bajo |

---

## 4. Cambios realizados por aplicación

### 4.1 CDR Landing

| Categoría | Qué se cambió | Qué se añadió | Resultado |
|---|---|---|---|
| Administración de plataformas | Se eliminó el acceso automático por área y se consolidó la asignación manual. | `PLATFORM_ACCESS` como fuente única para plataformas, roles, áreas, campos y validaciones. | Mayor control operativo para superadministradores. |
| SSO | Se ajustó la emisión de tokens y el mapeo de roles por plataforma. | Redirecciones específicas para Canal, Bitácora, Asistencias, Horarios, Stock, Control de Accesos y Préstamos. | Acceso más consistente entre apps. |
| Bitácora AC | Se habilitó como plataforma de Cultura y Deporte. | Lógica de redirección por área mediante helper específico. | Permite usar una misma plataforma desde ambos contextos. |
| Superadmin | Se fortaleció el formulario de usuarios y asignación de plataformas. | Campos por app como sede, cédula, rol nativo y espacio para monitores. | Disminuye errores al crear perfiles operativos. |
| Dashboard | Se conectaron resúmenes de Asistencias, Stock y Control de Accesos. | APIs de resumen y vistas por plataforma. | Mayor visibilidad centralizada. |
| Vista 360 / Personas | Se incorporó consulta transversal por documento o código. | Estadísticas, búsqueda de historial y reporte PDF por persona. | Facilita seguimiento integral de participantes. |
| Nomenclatura | Se renombró GymControl/CDUControl a **Control de Accesos CDU**. | Actualización de textos en manual, landing, dashboard, login, API y configuración. | Lenguaje más institucional y claro. |

### 4.2 Asistencias Cultura / Asistencias Deporte (`Asistencia_cultura`)

| Categoría | Qué se cambió | Qué se añadió | Resultado |
|---|---|---|---|
| Reportes PDF | Se corrigió el área mostrada en reportes descargados por managers de deporte. | Etiqueta correcta de Área de Deporte. | Reportes más confiables para gestión deportiva. |
| Rangos de fecha | Se quitó el límite al mes actual en descargas PDF de deporte. | Selector de rango libre. | Permite informes históricos y comparativos. |
| Gráficas de inscritos | Se incorporaron visualizaciones en eventos, convocatorias, Cineclú y listas. | Componente de gráficas y descarga PDF. | Análisis más visual para asistencia e inscripción. |
| Registro de asistencia | Se permitió registrar asistencia deportiva en una fecha elegida. | Utilidades de fecha y ajustes en manager de grupo. | Corrige casos de registro retroactivo o fuera del día actual. |
| Gestión de usuarios | Se agregó edición de perfiles para admin y superadmin. | Función `updateUserProfile`. | Mejora mantenimiento de datos personales. |
| Indicadores | Se agregaron metas planeadas e indicadores en PDF. | Barras de progreso, tabla consolidada y corrección de usuarios únicos. | Aporta métricas gerenciales para Cultura. |
| Cineclú y convocatorias | Se ampliaron módulos de cultura y deporte. | Flujos de asistentes, equipos y estadísticas. | Cubre más tipos de actividades institucionales. |

### 4.3 Canal Comunicaciones (`CanalComunicaciones`)

| Categoría | Qué se cambió | Qué se añadió | Resultado |
|---|---|---|---|
| Permisos por rol | Se restringió a managers para que solo accedan a enviar solicitudes y ver sus solicitudes. | `role-gate`, reglas de roles y ajustes de layouts. | Reduce exposición de secciones administrativas. |
| SSO | Se propagó el área del usuario desde CDR Landing. | Área en el contexto de autenticación. | Permite decisiones internas por Cultura/Deporte. |
| Navegación | Se ajustaron shells, layouts y páginas según rol. | Separación más clara entre admin, manager y superadmin. | Mejora seguridad y experiencia. |
| Eventos | Se mantuvieron mejoras de tabla, detalle y carga de imágenes. | Vista con hoja lateral, íconos, fechas y descarga para admins. | Facilita operación de solicitudes de comunicación. |

### 4.4 Control de Accesos CDU (`gym_cdu`)

| Categoría | Qué se cambió | Qué se añadió | Resultado |
|---|---|---|---|
| Identidad de producto | Se consolidó el nombre **Control de Accesos CDU**. | Actualización progresiva de textos y rutas relacionadas en CDR. | Evita confusión entre GymControl, CDUControl y el nombre institucional. |
| Multi-sede | Se incorporó operación Meléndez/San Fernando. | Reglas de sede, filtros, acceso público por sede y datos en SSO. | Mejor separación operacional. |
| Tenis de mesa | Se amplió el módulo de tenis de mesa. | Inventario, préstamos de mesas/raquetas, historial y estadísticas. | Cubre una operación deportiva específica con trazabilidad. |
| Exportaciones | Se agregaron Excel de usuarios e ingresos por espacio. | Columna opcional de sede. | Facilita reportes administrativos. |
| Estadísticas | Se mejoraron usuarios únicos y métricas por servicio. | Cards, PDFs y filtros por rango. | Métricas más útiles para gestión de instalaciones. |
| Acceso | Se ajustó SSO y redirección a secciones por rol/espacio. | Verificación SSO y datos de monitor. | Menos pasos manuales al ingresar desde CDR. |

### 4.5 Stock CDU Meléndez (`stock-cdu`)

| Categoría | Qué se cambió | Qué se añadió | Resultado |
|---|---|---|---|
| Reportes de inventario | Se agregó reporte PDF de arqueo. | Generador de PDF de inventario y mejoras en página de inventario. | Mejora control físico y conciliación. |
| Excel | Se agregaron columnas opcionales. | Selector de columnas para correo, teléfono, etnia y edad. | Exportaciones más flexibles. |
| Préstamos | Se amplió historial y devolución de faltantes. | Registro de hora, faltantes por elemento y utilidades de préstamo. | Más trazabilidad ante devoluciones parciales. |
| Acceso | Se corrigió acceso total para superadmin. | Ajustes de navegación y route guard. | Menos bloqueos para administración central. |
| Rendimiento | Se implementaron mejoras de escrituras por lotes y límites ampliados. | Batch writes y cantidades mayores de inventario. | Operación más estable en volumen. |

### 4.6 Stock CDU San Fernando (`stock-cdu-sanfer`)

| Categoría | Qué se cambió | Qué se añadió | Resultado |
|---|---|---|---|
| Nueva operación | Se adaptó una app de préstamos para San Fernando. | Firebase propio `stockcdusanfer`, URL de producción y flujo específico de préstamos. | Se habilita una sede con operación separada. |
| Búsqueda de usuarios | Se conectó lookup con Control de Accesos CDU. | Componentes y utilidades de búsqueda Gym/CDU. | Evita duplicar registros de usuarios deportivos. |
| Página pública | Se retiró acceso personal en préstamos públicos. | Flujo más controlado desde la app. | Reduce acciones no deseadas por usuarios finales. |
| Superadmin | Se corrigió acceso total a todas las páginas. | Ajustes de route guard y navegación. | Administración central consistente. |
| Despliegue | Se estabilizó configuración de producción. | `.env.example`, `vercel.json`, URL canónica e ignorado de `.vercel`. | Menos errores de configuración. |

### 4.7 Préstamos Escenarios (`Prestamo_Escenarios`)

| Categoría | Qué se cambió | Qué se añadió | Resultado |
|---|---|---|---|
| Integración con usuarios CDU | Se alineó la búsqueda con Control de Accesos CDU y Stock San Fernando. | Cliente y lookup optimizado por documento/código. | Evita lecturas masivas y mejora rendimiento. |
| Multi-sede | Se incorporó soporte por sede en reservas y administración. | Selector de sede, reglas y datos en perfil. | Reservas más coherentes con operación real. |
| SSO | Se ajustó verificación y entrada desde CDR. | Contexto de rol/sede para usuarios administrativos. | Mejor interoperabilidad con el hub. |
| Despliegue | Se añadió documentación de variables y se alineó el uso de npm. | `.env.example` y eliminación de lockfile desactualizado. | Despliegues más reproducibles en Vercel. |

### 4.8 Horarios CDU (`Horarios_CDU`)

| Categoría | Qué se cambió | Qué se añadió | Resultado |
|---|---|---|---|
| Página de grupos | Se actualizó la vista de grupo. | Mejor estructura visual y contenido. | Información más clara para usuarios finales. |
| Filtros | Se agregaron filtros por categoría y nombres completos. | Búsqueda y navegación más precisa. | Facilita encontrar disciplinas deportivas. |
| Horarios | Se agregó formulario multi-horario. | Botón para añadir múltiples franjas. | Soporta grupos con varias sesiones. |
| Contenido institucional | Se agregó sección de equipo/monitores/directores. | Descripciones, backgrounds y carruseles. | Mayor contexto para cada grupo. |

### 4.9 Horarios Cultura (`Horarios_Cultura`)

| Categoría | Qué se cambió | Qué se añadió | Resultado |
|---|---|---|---|
| SSO | Se agregó autenticación SSO y guardas de ruta para `/adofi`. | RouteGuard y entrada administrativa. | Permite acceso más alineado con CDR. |
| Horarios | Se agregó formulario multi-horario. | Múltiples slots por grupo. | Mayor flexibilidad para programación cultural. |
| Presentación | Se mejoró la sección de equipo. | Descripciones, roles, testimonios y modal de texto largo. | Experiencia pública más completa. |

### 4.10 Stock Cultura (`stock_cultura`)

| Categoría | Qué se cambió | Qué se añadió | Resultado |
|---|---|---|---|
| SSO y roles | Se agregó autenticación SSO y protección por rol. | Guardas de navegación y acceso desde CDR. | Integración básica con el hub. |
| Navegación | Se corrigieron imports faltantes. | Ajustes de build. | Mayor estabilidad en despliegue. |
| Inventario | Se mantiene operación de préstamos e inventario cultural. | Acceso desde dashboard CDR y resumen. | Plataforma operativa, con oportunidad de homologar reportes. |

### 4.11 Bitácora COM (`bit_com`)

| Categoría | Qué se cambió | Qué se añadió | Resultado |
|---|---|---|---|
| Estados | Se agregó sistema de estados con colores personalizados. | Servicios, tipos y UI para estados. | Seguimiento de tareas más expresivo. |
| Móvil | Se actualizó la vista móvil de tareas. | Cards completas para teléfonos. | Mejor operación desde dispositivos móviles. |
| Integración | CDR la registra como plataforma manual de Cultura. | Mapeo de rol desde CDR. | Falta validar implementación completa de receptor SSO en la app destino. |

### 4.12 Bitácora AC (`BitacoraAC`)

| Categoría | Qué se cambió | Qué se añadió | Resultado |
|---|---|---|---|
| Integración desde CDR | CDR la habilitó para Cultura y Deporte. | Redirección por área y mapeo de roles. | Puede operar como bitácora multiárea desde el hub. |
| Actividad del repo destino | No se observaron cambios recientes relevantes en el historial disponible. | Base funcional existente. | Requiere modernización y validación técnica. |
| SSO destino | Integración declarada desde CDR. | Pendiente validar endpoint receptor en la app destino. | Riesgo de experiencia desigual frente a apps más recientes. |

### 4.13 Seguimiento de Contratistas (`seguimiento_cont`)

| Categoría | Qué se cambió | Qué se añadió | Resultado |
|---|---|---|---|
| Gestión de contratistas | Se agregaron validaciones de cuotas, estados y campos editables. | Panel de historial de pagos y usuarios aprobados. | App administrativa con evolución propia. |
| Integración con CDR | No aparece como plataforma formal en CDR Landing. | No se identificó launcher, SSO ni `PlatformId`. | Debe tratarse como sistema externo hasta que se defina integración. |

---

## 5. Elementos añadidos más relevantes

| Elemento añadido | Aplicaciones impactadas | Valor aportado |
|---|---|---|
| Asignación manual de plataformas | CDR Landing y todas las apps integradas | Gobierno más preciso de accesos por usuario. |
| Mapa central de roles y campos por plataforma | CDR Landing | Reduce duplicidad y errores de permisos. |
| Reportes PDF con indicadores y gráficas | Asistencias, Stock CDU, Control de Accesos CDU | Mejora seguimiento gerencial y operativo. |
| Exportaciones Excel configurables | Stock CDU, Control de Accesos CDU, Asistencias | Facilita análisis externo y reportes institucionales. |
| Búsqueda transversal de personas / Vista 360 | CDR Landing, Asistencias, Gym, Stock, Préstamos | Permite seguimiento integral por documento o código. |
| Flujos San Fernando | Control de Accesos CDU, Stock San Fernando, Préstamos Escenarios | Soporta operación multi-sede real. |
| Restricciones de rol para managers | Canal Comunicaciones | Aumenta seguridad funcional. |
| Formularios multi-horario | Horarios Cultura, Horarios CDU | Permite registrar actividades con varias franjas. |

---

## 6. Oportunidades de mejora priorizadas

| Prioridad | Mejora recomendada | Apps afectadas | Beneficio esperado |
|---:|---|---|---|
| Alta | Documentar un contrato SSO único: payload, expiración, firma, roles, área, sede, cédula y redirect. | Todas las apps con SSO | Reduce fallos de integración y facilita mantenimiento. |
| Alta | Validar e implementar receptores SSO completos en Bitácora AC y Bitácora COM. | `BitacoraAC`, `bit_com`, CDR Landing | Evita experiencias parciales o login duplicado. |
| Alta | Agregar pruebas de permisos por rol, área, sede y plataforma asignada. | CDR, Canal, Asistencias, Stock, Gym, Préstamos | Disminuye regresiones de seguridad. |
| Alta | Crear checklist de despliegue por app con variables obligatorias y URLs canónicas. | Todas | Reduce errores al publicar en Vercel. |
| Media | Homologar formatos PDF/Excel y nombres de columnas. | Asistencias, Stock, Gym, Préstamos | Facilita comparación institucional. |
| Media | Exponer KPIs faltantes hacia CDR Landing. | Horarios, Canal, Bitácoras, Stock San Fernando, Préstamos | Dashboard central más completo. |
| Media | Unificar catálogos de sede, área, espacio, facultad y programa. | CDR, Asistencias, Gym, Stock, Préstamos | Mejora consistencia de filtros y búsquedas. |
| Media | Ampliar Vista 360 con más fuentes. | Bitácoras, Horarios, Canal, Stock San Fernando | Mayor trazabilidad de actividad por persona. |
| Baja | Homologar lenguaje visual entre apps: sidebars, cards, tablas, estados y botones. | Todas | Percepción de ecosistema único y más profesional. |

---

## 7. Riesgos y observaciones

| Riesgo | Descripción | Recomendación |
|---|---|---|
| SSO desigual entre plataformas | Algunas apps tienen integración madura y otras solo están declaradas desde CDR. | Auditar app por app con una matriz de emisor/receptor SSO. |
| Roles divergentes | Se usan roles como `admin`, `monitor`, `superadmin`, `manager`, `ADMIN`, `MONITOR` y `SUPER_ADMIN`. | Mantener un diccionario oficial de roles por plataforma. |
| Dependencia de variables de entorno | URLs y credenciales dependen de configuración externa. | Mantener `.env.example` actualizado y validaciones al iniciar. |
| KPIs parciales | No todas las apps publican métricas hacia CDR Landing. | Priorizar APIs de resumen en apps con valor gerencial. |
| Duplicidad funcional | Stock, Horarios y reportes comparten patrones similares en repos separados. | Definir convenciones compartidas sin introducir refactors innecesarios. |
| Datos históricos incompletos | Algunos commits antiguos tienen mensajes genéricos. | Mejorar disciplina de commits y documentación de cambios. |

---

## 8. Estado general por aplicación

| App | Estado funcional | Nivel de integración | Siguiente paso sugerido |
|---|---|---|---|
| CDR Landing | Operativo como hub central | Alto | Documentar contrato SSO y ampliar KPIs. |
| Asistencias Cultura / Deporte | Operativa y en expansión | Alto | Homologar reportes y sumar más fuentes a Vista 360. |
| Canal Comunicaciones | Operativa con permisos reforzados | Alto | Añadir pruebas de rutas por rol y documentar JWT. |
| Control de Accesos CDU | Operativa multi-sede | Alto | Consolidar métricas por sede/espacio para CDR. |
| Stock CDU Meléndez | Operativa con reportes avanzados | Alto | Agregar auditoría de préstamos y cambios de inventario. |
| Stock CDU San Fernando | Operativa para sede San Fernando | Medio / Alto | Completar KPIs equivalentes en CDR Landing. |
| Préstamos Escenarios | Operativa e integrada con usuarios CDU | Medio / Alto | Publicar resumen gerencial por sede y estado. |
| Horarios CDU | Operativa | Medio | Agregar métricas de uso y pruebas de acceso. |
| Horarios Cultura | Operativa | Medio | Validar solapamientos y mejorar trazabilidad administrativa. |
| Stock Cultura | Operativa | Medio / Alto | Homologar reportes con Stock CDU. |
| Bitácora COM | Operativa con mejoras de UI | Medio / Bajo | Completar y probar receptor SSO. |
| Bitácora AC | Funcional, con baja actividad reciente | Medio / Bajo | Modernizar dependencias y validar SSO destino. |
| Seguimiento Contratistas | Operativa como sistema aparte | No integrado | Definir si debe incorporarse al ecosistema CDR. |

---

## 9. Conclusión

El ecosistema CDR Landing muestra avances importantes en centralización, seguridad operativa, reportes y soporte multi-sede. Las mejoras más relevantes están en la administración manual de plataformas, la consolidación de SSO, la ampliación de reportes en Asistencias/Stock/Control de Accesos y la integración de San Fernando dentro de los flujos deportivos.

La prioridad recomendada es cerrar brechas de integración: documentar el contrato SSO, validar los receptores de Bitácora AC y Bitácora COM, ampliar KPIs hacia el dashboard central y estandarizar roles, sedes y reportes. Con esto, CDR Landing puede consolidarse como un hub institucional más seguro, auditable y fácil de mantener.
