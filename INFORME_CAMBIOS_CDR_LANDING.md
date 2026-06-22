# Informe de Cambios del Ecosistema CDR Landing

**Fecha de corte:** 11 de junio de 2026  
**Repositorio central:** `CDR_Landing`  
**Objetivo:** consolidar, de forma ejecutiva y técnica, los cambios realizados en las aplicaciones relacionadas con CDR Landing, las funcionalidades agregadas y las oportunidades de mejora para el ecosistema.

---

## 1. Resumen Ejecutivo

CDR Landing funciona como el hub central del ecosistema CDR: autentica usuarios, emite accesos SSO hacia las plataformas conectadas, concentra dashboards operativos y permite la gestión de usuarios desde un módulo superadmin. Durante los últimos cambios revisados, el foco principal fue fortalecer la integración entre aplicaciones, ampliar el alcance multi-área Cultura/Deporte, incorporar nuevas plataformas al flujo central y mejorar la trazabilidad operativa con reportes, exportaciones y vistas agregadas.

| Frente | Resultado principal | Impacto operativo |
|---|---|---|
| Portal CDR Landing | Reorganización de accesos por plataforma, SSO y superadmin | Mayor control centralizado sobre usuarios, roles, áreas y plataformas |
| SSO entre apps | Integración de JWT hacia apps como Canal, Gym, Stock, Horarios, Asistencias y Préstamos | Menos fricción de ingreso y mejor gobernanza de permisos |
| San Fernando | Integración de `stock_cdu_sanfer`, plantilla de usuarios, sede y scripts de provisión | Soporte formal a operación deportiva en sede San Fernando |
| Dashboards | KPIs para asistencias, inventarios y GymControl | Mejor visibilidad para administradores desde el hub |
| Reportes y exportaciones | Excel/PDF en asistencias, gym y stock | Mejor seguimiento, auditoría y toma de decisiones |
| Multi-área | Avances en Cultura/Deporte, roles por área y accesos automáticos | Permite operar con usuarios diferenciados por responsabilidad |

---

## 2. Alcance y Fuentes Revisadas

El informe considera las plataformas declaradas en la configuración de CDR Landing (`lib/platform-access-config.ts` y `lib/superadmin-platforms.ts`) y los historiales recientes de los repositorios del workspace.

| Repositorio | Relación con CDR Landing | Estado en el alcance |
|---|---|---|
| `CDR_Landing` | Portal central, SSO, dashboard y superadmin | Incluido como eje principal |
| `Asistencia_cultura` | Asistencias Cultura y Deporte | Incluido |
| `BitacoraAC` | Bitácora AC Cultura | Incluido, con observaciones de deuda técnica |
| `bit_com` | Bitácora Comunicaciones | Incluido |
| `CanalComunicaciones` | Canal de eventos/comunicaciones | Incluido |
| `gym_cdu` | GymControl CDU | Incluido |
| `Horarios_Cultura` | Horarios Cultura | Incluido |
| `Horarios_CDU` | Horarios Deporte | Incluido |
| `Prestamo_Escenarios` | Préstamos de escenarios deportivos | Incluido |
| `stock_cultura` | Inventario Cultura | Incluido |
| `stock-cdu` | Inventario Deportivo Meléndez | Incluido |
| `stock-cdu-sanfer` | Inventario Deportivo San Fernando | Incluido |
| `seguimiento_cont` | Seguimiento de contratistas | Referenciado como no integrado formalmente |

> Nota: `seguimiento_cont` aparece en el workspace, pero no está registrado como plataforma formal en la configuración de CDR Landing, no tiene ID de plataforma, SSO ni dashboard conectado al hub. Por eso se documenta como referencia externa y no como aplicación integrada.

---

## 3. Arquitectura Actual de Integración

| Componente | Función dentro del ecosistema | Evidencia técnica |
|---|---|---|
| Autenticación CDR | Inicio de sesión central para usuarios del portal | Firebase Auth en `CDR_Landing` |
| Perfil de usuario | Guarda rol, área, plataformas, cédula, sede y configuración por app | Colección `users` del proyecto central |
| SSO | Emisión de token JWT temporal hacia plataformas externas | Endpoint `/api/auth/sso-token` |
| Control de acceso | Define si una app se asigna manualmente o por área | `PLATFORM_ACCESS` |
| Superadmin | Crea, actualiza, elimina y asigna plataformas a usuarios | Rutas `/superadmin` y `/api/users/*` |
| Dashboards | Muestra indicadores de plataformas operativas | APIs `/api/platforms/*` |
| Vista 360 grados | Consulta transversal de personas en varios sistemas | Rutas `/superadmin/personas` y APIs de `person-registry` |

---

## 4. Matriz de Plataformas Conectadas

| Plataforma | Repositorio | Área | Tipo de acceso | SSO | Dashboard en CDR | Observaciones |
|---|---|---:|---|---|---|---|
| Bitácora AC | `BitacoraAC` | Cultura | Manual | Parcial/no implementado en repo actual | No | Registrada en CDR, pero la app requiere modernización técnica |
| Bitácora COM | `bit_com` | Cultura | Manual | Parcial/no implementado en repo actual | No | App operativa con login propio; falta cerrar integración SSO |
| Stock Cultura | `stock_cultura` | Cultura | Manual | Sí | Sí | Inventario con roles y protección de rutas |
| Horarios Cultura | `Horarios_Cultura` | Cultura | Automático por área | Sí | No | Acceso administrativo hacia `/adofi` |
| Asistencias Cultura | `Asistencia_cultura` | Cultura | Automático por área | Sí | Sí | Comparte app con Deporte usando configuración multi-área |
| Canal Comunicaciones | `CanalComunicaciones` | Cultura/Deporte | Manual | Sí | No | Enruta por rol dentro de la app destino |
| Stock CDU Meléndez | `stock-cdu` | Deporte | Manual | Sí | Sí | Inventario deportivo con reportes y control de préstamos |
| Stock CDU San Fernando | `stock-cdu-sanfer` | Deporte | Manual | Sí | API/resumen disponible | Integración reciente con sede San Fernando |
| Horarios CDU | `Horarios_CDU` | Deporte | Automático por área | Sí | No | Versión deportiva de horarios con acceso a `/adofi` |
| GymControl CDU | `gym_cdu` | Deporte | Manual | Sí | Sí | Maneja sede y espacio para monitores |
| Asistencias Deporte | `Asistencia_cultura` | Deporte | Automático por área | Sí | Sí | Usa el mismo frontend de asistencias con contexto deportivo |
| Préstamos Escenarios | `Prestamo_Escenarios` | Deporte | Automático por área | Sí | Parcial en Vista 360 | Integrado con usuarios de GymControl |

---

## 5. Cambios Realizados por Aplicación

### 5.1 CDR Landing

| Categoría | Cambios realizados | Funcionalidades agregadas | Valor generado |
|---|---|---|---|
| Gestión de plataformas | Reorganización de accesos en superadmin y conexión de Canal Comunicaciones al SSO | Configuración centralizada por `PLATFORM_ACCESS` | Mejora el control de permisos y reduce configuraciones duplicadas |
| San Fernando | Integración de `stock_cdu_sanfer`, URL canónica, sede y plantilla de administrador | Scripts de provisión y asignación para usuarios San Fernando | Facilita el despliegue operativo de una nueva sede |
| Superadmin | Incorporación de formularios para Préstamos Escenarios y Stock San Fernando | Asignación manual/automática según área y plataforma | Permite administrar permisos desde un solo lugar |
| Dashboards | APIs de resumen para Stock, Gym y Asistencias | KPIs agregados en el dashboard administrativo | Centraliza indicadores clave sin entrar a cada app |
| Vista 360 grados | Consulta transversal de personas en varios sistemas | Reporte PDF y búsqueda consolidada | Apoya seguimiento integral de participantes |
| Calidad de despliegue | Correcciones TypeScript, lockfiles y dependencias para Vercel | Build más estable | Reduce fallos de despliegue |

### 5.2 Asistencias Cultura / Deporte (`Asistencia_cultura`)

| Categoría | Cambios realizados | Funcionalidades agregadas | Oportunidades de mejora |
|---|---|---|---|
| Multi-área | Avance en separación Cultura/Deporte, admins por área y persistencia de contexto | Uso de una sola app para asistencias culturales y deportivas | Documentar con mayor claridad las reglas de área y permisos |
| Asistencia y reportes | Mejoras en listados, exportaciones Excel y reportes PDF | Informes de asistentes, columnas de código y nombres normalizados | Homologar formatos de exportación con las demás apps |
| Convocatorias y torneos | Módulos deportivos con equipos, códigos, fases y brackets | Inscripción a torneos individuales/grupales | Consolidar pruebas de permisos por rol y área |
| Cineclub | Nuevo módulo para Cultura con flujo de asistencia y estadísticas PDF | Control especializado para actividades de cineclub | Integrarlo en la Vista 360 si aplica al seguimiento de participantes |

### 5.3 Bitácora COM (`bit_com`)

| Categoría | Cambios realizados | Funcionalidades agregadas | Oportunidades de mejora |
|---|---|---|---|
| Operación de tareas | Sistema de estados con colores personalizados | Mejor visualización del avance de tareas | Estandarizar estados con un catálogo administrable |
| Experiencia móvil | Vista móvil de tareas convertida a cards completos | Lectura más clara en teléfonos | Revisar accesibilidad y consistencia visual con CDR |
| Administración | Panel propio de superadmin y usuarios | Gestión local de roles | Implementar SSO real con CDR para eliminar login aislado |

### 5.4 Bitácora AC (`BitacoraAC`)

| Categoría | Cambios realizados | Funcionalidades agregadas | Oportunidades de mejora |
|---|---|---|---|
| Base funcional | Formulario, tabla y estadísticas de bitácora cultural | Registro operativo básico | Resolver conflictos de merge y actualizar dependencias |
| Persistencia | Uso aparente de almacenamiento local en la versión actual | Prototipo funcional sin backend robusto | Migrar a Firebase/Firestore y enlazar SSO CDR |
| Integración CDR | Registrada como plataforma en CDR Landing | Acceso previsto desde el hub | Implementar ruta `/auth/sso` y protección por rol |

### 5.5 Canal Comunicaciones (`CanalComunicaciones`)

| Categoría | Cambios realizados | Funcionalidades agregadas | Oportunidades de mejora |
|---|---|---|---|
| SSO | Propagación del área de usuario desde CDR Landing | Sesión con datos de área y rol | Documentar contrato JWT esperado |
| Rutas por rol | Correcciones para enrutar según admin, manager o superadmin | Ignora redirect externo cuando corresponde y decide dentro de la app | Centralizar reglas de redirección para evitar divergencias |
| Gestión de eventos | Tabla de eventos, detalle en sheet, imágenes via ImgBB | Flujo más completo para solicitudes y revisión | Validar almacenamiento de imágenes y políticas de retención |
| UI administrativa | Mejoras en sidebar, botones de credenciales y detalles visuales | Experiencia de administración más completa | Homologar componentes con el sistema visual de CDR |

### 5.6 GymControl CDU (`gym_cdu`)

| Categoría | Cambios realizados | Funcionalidades agregadas | Oportunidades de mejora |
|---|---|---|---|
| Multi-sede | Soporte Meléndez/San Fernando y rebranding a CDUControl | Segmentación por sede | Alinear nomenclatura de sedes entre Gym, Stock y CDR |
| Espacios deportivos | Gimnasio, guardarropas, piscina y tenis de mesa | Préstamo de mesas/raquetas e inventario de tenis | Consolidar estadísticas por espacio en un contrato API estable |
| Reportes | Exportación Excel y generación PDF con rango de fechas | Reportes de usuarios e ingresos por espacio | Automatizar validaciones de consistencia de datos |
| SSO | Integración con CDR usando cédula, sede y espacio para monitores | Acceso diferenciado para monitores | Reducir dependencias en valores hardcodeados de superadmin |

### 5.7 Horarios Cultura (`Horarios_Cultura`)

| Categoría | Cambios realizados | Funcionalidades agregadas | Oportunidades de mejora |
|---|---|---|---|
| SSO | Protección de ruta administrativa `/adofi` | Acceso desde CDR por área Cultura | Agregar auditoría de ingresos administrativos |
| Gestión de horarios | Formulario multi-horario con botón para agregar slots | Mayor flexibilidad para grupos con varios horarios | Validar solapamientos y reglas de disponibilidad |
| Experiencia pública | Sección de equipo, descripciones, modal de textos largos | Mejor presentación de grupos culturales | Medir rendimiento de imágenes y carga inicial |

### 5.8 Horarios CDU (`Horarios_CDU`)

| Categoría | Cambios realizados | Funcionalidades agregadas | Oportunidades de mejora |
|---|---|---|---|
| Consulta pública | Filtros por categoría y nombres completos | Búsqueda más clara de grupos deportivos | Unificar filtros con Horarios Cultura |
| Gestión de grupos | Sección de equipo, descripciones y backgrounds por grupo | Presentación enriquecida de monitores/directores | Crear modelo compartido para Cultura y CDU |
| Administración | Formulario multi-horario | Manejo de múltiples franjas | Agregar validaciones de disponibilidad y conflictos |

### 5.9 Préstamos Escenarios (`Prestamo_Escenarios`)

| Categoría | Cambios realizados | Funcionalidades agregadas | Oportunidades de mejora |
|---|---|---|---|
| Integración Gym | Búsqueda de usuarios desde GymControl sin lectura masiva | Menor carga y mejor respuesta en consultas | Mantener índices optimizados para cédula/código |
| Multi-sede | Soporte de usuarios y escenarios asociados a sede | Operación alineada con CDUControl | Extender métricas hacia dashboard CDR |
| SSO | Staff administrado desde CDR; se elimina dependencia de superadmin interno | Control central de usuarios | Documentar roles esperados por CDR |
| Configuración | Plantilla de variables de entorno Vercel | Mejor reproducibilidad de despliegues | Incorporar checklist operativo de env vars |

### 5.10 Stock Cultura (`stock_cultura`)

| Categoría | Cambios realizados | Funcionalidades agregadas | Oportunidades de mejora |
|---|---|---|---|
| SSO | Implementación de autenticación SSO y protección por rol | Acceso desde CDR para admin/monitor | Validar expiración y renovación de sesión |
| Inventario | Gestión de items, préstamos, daños y reportes | Flujo completo de inventario cultural | Homologar dashboard con Stock CDU |
| Calidad | Corrección de imports faltantes y ajustes de navegación | Build más estable | Aumentar pruebas de rutas protegidas |

### 5.11 Stock CDU Meléndez (`stock-cdu`)

| Categoría | Cambios realizados | Funcionalidades agregadas | Oportunidades de mejora |
|---|---|---|---|
| Acceso | Superadmin con acceso total a páginas | Mejor soporte administrativo | Revisar si superadmin debe ser configurable |
| Préstamos | Historial de préstamos, devolución de faltantes y hora en registros | Trazabilidad más detallada del préstamo | Agregar auditoría de cambios por usuario |
| Exportaciones | Excel de préstamos por persona y elementos usados | Reportes operativos para seguimiento | Unificar formatos con Stock Cultura y San Fernando |
| Rendimiento | Batch writes para préstamos e inventario | Operaciones más eficientes | Medir límites y tiempos en cargas altas |

### 5.12 Stock CDU San Fernando (`stock-cdu-sanfer`)

| Categoría | Cambios realizados | Funcionalidades agregadas | Oportunidades de mejora |
|---|---|---|---|
| Nueva sede | App de préstamos San Fernando con Firebase propio | Operación separada para `stockcdusanfer` | Completar dashboard visual dedicado en CDR |
| Integración Gym | Lookup de usuarios desde GymControl | Valida usuarios deportivos antes de préstamos | Unificar estrategia de búsqueda con Préstamos Escenarios |
| SSO y accesos | URL de producción y acceso superadmin | Integración con CDR Landing | Documentar flujo de provisión de usuarios |
| Experiencia pública | Ajustes en página pública de préstamos | Menor exposición de acceso personal | Revisar mensajes y estados para usuarios finales |

---

## 6. Mejoras Transversales Recomendadas

| Prioridad | Mejora recomendada | Apps afectadas | Beneficio esperado |
|---:|---|---|---|
| Alta | Implementar SSO completo en `BitacoraAC` y `bit_com` | Bitácoras, CDR Landing | Cierra la brecha de login aislado y alinea permisos |
| Alta | Resolver conflictos/deuda técnica en `BitacoraAC` | Bitácora AC | Evita fallos de build y facilita mantenimiento |
| Alta | Centralizar contrato de SSO en una documentación compartida | Todas las apps SSO | Reduce errores en payload, roles, redirect y expiración |
| Alta | Eliminar o parametrizar superadmins hardcodeados | CDR, Gym, Bitácoras y apps con bypass | Mejora seguridad y gobierno de accesos |
| Media | Unificar formatos de exportación Excel/PDF | Asistencias, Gym, Stock | Facilita lectura gerencial y comparación entre áreas |
| Media | Crear dashboard visual para Stock San Fernando | CDR Landing, Stock Sanfer | Da visibilidad equivalente a Meléndez |
| Media | Ampliar Vista 360 a más fuentes | CDR Landing, Bitácoras, Canal, Horarios, Sanfer | Aumenta trazabilidad completa de participantes |
| Media | Estandarizar nombres de sede, área, rol y espacio | CDR, Gym, Stock, Préstamos | Evita inconsistencias en filtros y permisos |
| Media | Agregar pruebas de rutas protegidas y roles | Todas las apps SSO | Reduce regresiones de seguridad |
| Baja | Homologar diseño visual de cards, tablas y sidebars | Apps administrativas | Experiencia más consistente para usuarios internos |

---

## 7. Riesgos y Observaciones

| Riesgo | Descripción | Recomendación |
|---|---|---|
| SSO inconsistente | Algunas apps implementan `/auth/sso`, otras mantienen login propio o integración parcial | Definir contrato único de SSO y checklist por app |
| Roles divergentes | Cada plataforma usa nombres de rol distintos (`admin`, `manager`, `SUPER_ADMIN`, `monitor`) | Mantener mapa de roles versionado y documentado |
| Dependencia de variables de entorno | Las URLs y credenciales Firebase dependen de env vars por app | Mantener plantillas `.env` y validadores de configuración |
| Superadmin hardcodeado | Existen accesos especiales por UID/cédula en algunas apps | Migrar a configuración administrada y auditable |
| Cobertura parcial de dashboard | No todas las apps tienen resumen o KPI en CDR | Priorizar APIs de resumen para apps de mayor uso operativo |
| Duplicación Cultura/Deporte | Algunas apps comparten patrones casi idénticos con variaciones por área | Extraer convenciones compartidas sin sobre-refactorizar |

---

## 8. Estado General por App

| App | Nivel de integración con CDR | Estado funcional | Siguiente paso sugerido |
|---|---|---|---|
| CDR Landing | Alto | Hub central operativo | Documentar contrato SSO y completar dashboard Sanfer |
| Asistencias Cultura/Deporte | Alto | Operativa y en expansión | Reforzar pruebas por área/rol |
| Canal Comunicaciones | Alto | Operativa con SSO | Consolidar documentación de roles y área |
| GymControl CDU | Alto | Operativa multi-sede | Estandarizar sede/espacio y métricas API |
| Stock CDU Meléndez | Alto | Operativa | Agregar auditoría y mejorar reportes comparables |
| Stock CDU San Fernando | Medio/alto | Nueva integración operativa | Crear vista dashboard dedicada en CDR |
| Stock Cultura | Medio/alto | Operativa con SSO | Homologar reportes y pruebas de acceso |
| Préstamos Escenarios | Medio/alto | Integrada con Gym y CDR | Exponer KPIs hacia CDR |
| Horarios Cultura | Medio | Operativa con admin SSO | Validar solapamientos y auditar cambios |
| Horarios CDU | Medio | Operativa con admin SSO | Unificar modelo con Cultura |
| Bitácora COM | Medio/bajo | Operativa con login propio | Implementar SSO CDR |
| Bitácora AC | Bajo | Prototipo/desactualizada | Resolver deuda técnica e implementar backend/SSO |

---

## 9. Conclusión

El ecosistema CDR Landing ha avanzado de forma significativa hacia una arquitectura centralizada: CDR Landing ya opera como punto de entrada, administrador de permisos y tablero de control para varias aplicaciones de Cultura y Deporte. Los cambios más relevantes se concentran en SSO, multi-área, soporte San Fernando, dashboards, reportes y administración de usuarios.

La principal oportunidad ahora es cerrar brechas de integración: llevar las bitácoras al mismo nivel de SSO, documentar formalmente el contrato entre CDR y cada app, reducir accesos hardcodeados y ampliar los indicadores del dashboard central. Con estas mejoras, el ecosistema quedaría más seguro, más consistente y más fácil de mantener.
