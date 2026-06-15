# Informe de Cambios del Ecosistema CDR Landing

**Fecha de corte:** 15 de junio de 2026  
**Repositorio central:** `CDR_Landing`  
**Periodo revisado:** commits disponibles entre el 1 de mayo y el 15 de junio de 2026, mas el estado actual de integracion declarado en CDR Landing.  
**Objetivo:** consolidar de forma profesional los cambios realizados en las aplicaciones relacionadas con CDR Landing, identificar funcionalidades agregadas y proponer mejoras para fortalecer el ecosistema.

---

## 1. Resumen Ejecutivo

CDR Landing opera como el hub central del ecosistema digital de Cultura y Deporte. Desde este portal se autentican usuarios, se administran permisos, se lanzan sesiones SSO hacia plataformas externas y se consultan indicadores operativos de varias aplicaciones.

Durante el periodo revisado, los cambios mas relevantes se concentraron en cinco frentes: centralizacion de accesos en CDR Landing, fortalecimiento del SSO, soporte multi-sede con San Fernando, ampliacion de reportes/exportaciones y mejoras de operacion en aplicaciones deportivas y culturales.

| Frente de trabajo | Cambios principales | Impacto operativo |
|---|---|---|
| Gobierno de plataformas | Reorganizacion de accesos, roles, areas y reglas por plataforma desde CDR Landing | Mayor control centralizado para administradores y superadministradores |
| SSO entre aplicaciones | Conexion y ajuste de tokens para apps como Canal Comunicaciones, GymControl, Stock, Horarios, Asistencias y Prestamos | Menos friccion de ingreso y mejor consistencia de permisos |
| Sede San Fernando | Integracion de `stock_cdu_sanfer`, sede en perfiles, URL canonica y scripts de provision | Soporte formal para operacion deportiva en San Fernando |
| Reportes y trazabilidad | Excel, PDF, estadisticas por espacio, reportes de asistentes, historiales de prestamos | Mejor seguimiento administrativo y toma de decisiones |
| Experiencia de usuario | Cards moviles, formularios mas claros, paneles separados, selector de sede/espacio | Operacion mas sencilla para monitores, administradores y usuarios internos |

---

## 2. Alcance y Fuentes Revisadas

El alcance se definio a partir de las plataformas registradas en `CDR_Landing`, especialmente en `lib/platform-access-config.ts` y `lib/superadmin-platforms.ts`, y se contrasto con los repositorios disponibles en el workspace.

| Repositorio | Relacion con CDR Landing | Estado en este informe |
|---|---|---|
| `CDR_Landing` | Portal central, SSO, dashboard y superadmin | Incluido como eje principal |
| `Asistencia_cultura` | Asistencias Cultura y Asistencias Deporte | Incluido |
| `BitacoraAC` | Bitacora AC Cultura | Incluido, sin cambios recientes en el periodo |
| `bit_com` | Bitacora Comunicaciones | Incluido |
| `CanalComunicaciones` | Canal de eventos/comunicaciones | Incluido |
| `gym_cdu` | GymControl/CDUControl CDU | Incluido |
| `Horarios_Cultura` | Horarios Cultura | Incluido, sin cambios recientes en el periodo |
| `Horarios_CDU` | Horarios CDU | Incluido, sin cambios recientes en el periodo |
| `Prestamo_Escenarios` | Prestamos de escenarios deportivos | Incluido |
| `stock_cultura` | Inventario Cultura | Incluido, sin cambios recientes en el periodo |
| `stock-cdu` | Inventario Deportivo Melendez | Incluido |
| `stock-cdu-sanfer` | Inventario Deportivo San Fernando | Incluido |
| `seguimiento_cont` | Seguimiento de contratistas | Referenciado como no integrado formalmente |

> Nota de alcance: `seguimiento_cont` tiene actividad reciente, pero no esta registrado como plataforma formal en CDR Landing. No aparece como `PlatformId`, no tiene URL configurada en el launcher, no tiene SSO declarado y no participa del dashboard central. Por eso se documenta como sistema externo al alcance formal del ecosistema CDR Landing.

---

## 3. Matriz Actual de Integracion

| Plataforma | Repositorio | Area | Tipo de acceso en CDR | SSO desde CDR | Dashboard/KPI en CDR | Estado general |
|---|---|---|---|---|---|---|
| CDR Landing | `CDR_Landing` | Cultura/Deporte | Login central | Emisor SSO | Si | Hub operativo |
| Bitacora AC | `BitacoraAC` | Cultura | Manual | Parcial o pendiente en app destino | No | Requiere modernizacion |
| Bitacora COM | `bit_com` | Cultura | Manual | Parcial o pendiente en app destino | No | Operativa, falta cierre SSO |
| Stock Cultura | `stock_cultura` | Cultura | Manual | Si | Si | Operativa |
| Horarios Cultura | `Horarios_Cultura` | Cultura | Automatico por area | Si, hacia `/adofi` | No | Operativa |
| Asistencias Cultura | `Asistencia_cultura` | Cultura | Automatico por area | Si | Si | Operativa y en expansion |
| Canal Comunicaciones | `CanalComunicaciones` | Cultura/Deporte | Manual | Si | No | Integrada con SSO por rol/area |
| Stock CDU Melendez | `stock-cdu` | Deporte | Manual | Si | Si | Operativa |
| Stock CDU San Fernando | `stock-cdu-sanfer` | Deporte | Manual | Si | Parcial | Nueva integracion operativa |
| Horarios CDU | `Horarios_CDU` | Deporte | Automatico por area | Si, hacia `/adofi` | No | Operativa |
| GymControl CDU | `gym_cdu` | Deporte | Manual | Si | Si | Operativa multi-sede |
| Asistencias Deporte | `Asistencia_cultura` | Deporte | Automatico por area | Si | Si | Operativa |
| Prestamos Escenarios | `Prestamo_Escenarios` | Deporte | Automatico por area | Si | Parcial/Vista 360 | Operativa e integrada con Gym |

---

## 4. Cambios Realizados por Aplicacion

### 4.1 CDR Landing

| Categoria | Que se cambio | Que se agrego | Valor generado |
|---|---|---|---|
| Control de acceso | Se reorganizo la logica de plataformas en una configuracion central (`PLATFORM_ACCESS`) | Definicion unica de plataformas, roles, areas, campos requeridos y reglas manuales/automaticas | Reduce duplicidad y hace mas gobernable la asignacion de permisos |
| Superadmin | Se separo el formulario de acceso por plataforma y se mejoro la UI administrativa | Componente especializado para gestionar permisos, roles, cedula, sede y configuraciones por app | Facilita la creacion y edicion de usuarios con menos errores |
| SSO | Se ajusto el endpoint de token SSO y se conecto Canal Comunicaciones | Mapeo de roles por plataforma y envio de datos relevantes para cada app | Mejora la interoperabilidad entre el hub y las aplicaciones destino |
| San Fernando | Se incorporo `stock_cdu_sanfer` en enlaces, sidebar, superadmin y URL canonica | Base URL `stock-cdu-sanfer.vercel.app`, sede y script de provision de admin San Fernando | Habilita una operacion separada y trazable para la sede San Fernando |
| Prestamos Escenarios | Se mostro como plataforma administrable desde superadmin | Acceso automatico por area Deporte/Multi-area y redirect administrativo | Integra una app clave de reservas dentro del flujo central |
| Dashboard y Vista 360 | Se consolidaron consultas a Asistencias, Stock, Gym y Prestamos | APIs de resumen y busqueda transversal de personas con reporte PDF | Da visibilidad centralizada sobre actividad y participantes |
| Despliegue | Se corrigieron errores TypeScript, lockfiles y configuraciones de URL | Scripts de sincronizacion de variables y ajustes para Vercel | Reduce fallos de build y despliegue |

### 4.2 Asistencias Cultura / Deporte (`Asistencia_cultura`)

| Categoria | Que se cambio | Que se agrego | Oportunidades de mejora |
|---|---|---|---|
| Cineclub | Se incorporo un modulo especifico para actividades de cineclub | Flujo de asistencia, componente `cineclu-tab`, reglas de Firestore y estadisticas PDF | Integrar esta informacion a la Vista 360 si se requiere trazabilidad por participante |
| Reportes | Se mejoraron exportaciones y reportes de asistentes | Columna de codigo, nombres normalizados en mayuscula e informe de grupo | Homologar formatos Excel/PDF con Gym y Stock |
| Gestion de grupos | Se agrego modo de seleccion, orden alfabetico y pestaña para ver asistentes | Componente reutilizable de reporte de asistencia por grupo | Agregar pruebas de permisos por rol y area |
| Convocatorias y torneos | Se corrigieron errores y se agrego funcionalidad de equipos | Soporte para convocatorias deportivas y torneos con datos asociados | Documentar el modelo de equipos y fases para operacion |
| Programas academicos | Se actualizo el sistema de programas con filtros por sede y facultad | Selector de programas y compatibilidad con nombres reales de facultades | Mantener catalogos sincronizados con fuentes institucionales |

### 4.3 Bitacora Comunicaciones (`bit_com`)

| Categoria | Que se cambio | Que se agrego | Oportunidades de mejora |
|---|---|---|---|
| Estados de tareas | Se incorporo un sistema de estados con colores personalizados | Servicio de estados, tipos nuevos y UI administrativa para gestionarlos | Convertir estados en catalogo gobernado y auditable |
| Experiencia movil | Se rediseño la vista movil de tareas | Cards completas para lectura y gestion desde telefono | Revisar accesibilidad, contraste y consistencia visual con CDR |
| Administracion | Se reforzo la tabla y formulario de bitacora | Mejor separacion de datos de estado y presentacion | Completar SSO real con CDR para eliminar login aislado |

### 4.4 Canal Comunicaciones (`CanalComunicaciones`)

| Categoria | Que se cambio | Que se agrego | Oportunidades de mejora |
|---|---|---|---|
| SSO | Se propago el area del usuario desde la sesion SSO emitida por CDR Landing | Contexto de autenticacion con rol y area | Documentar formalmente el contrato JWT esperado |
| Enrutamiento | Se mantiene el enrutamiento interno segun rol de la aplicacion | Redireccion compatible con admin, manager y superadmin | Centralizar reglas para evitar diferencias entre CDR y Canal |
| Gobierno de permisos | Se alinea mejor con la asignacion manual desde CDR | Uso del rol nativo de la plataforma dentro del flujo SSO | Agregar pruebas de roles y rutas protegidas |

### 4.5 GymControl CDU (`gym_cdu`)

| Categoria | Que se cambio | Que se agrego | Oportunidades de mejora |
|---|---|---|---|
| Multi-sede | Se incorporo flujo San Fernando y segmentacion por sede | Reglas de sede, acceso publico y operaciones diferenciadas | Estandarizar nomenclatura de sedes con CDR, Stock y Prestamos |
| Tenis de mesa | Se amplio el modulo de tenis de mesa | Acceso publico, historial, estadisticas, inventario y prestamos de mesas/raquetas | Consolidar metricas por espacio en una API estable para CDR |
| Reportes | Se agregaron exportaciones Excel y PDF con filtros | Excel de usuarios e ingresos por espacio, dialogo de rango de fechas | Unificar plantillas de reporte con el resto del ecosistema |
| Estadisticas | Se mejoraron indicadores de usuarios unicos y servicios | Cards por espacio y resumen general en PDF | Validar consistencia de datos ante registros incompletos |
| SSO y roles | Se ajusto verificacion SSO y datos de sede/espacio para monitores | Acceso diferenciado por rol, sede y espacio | Reducir valores hardcodeados y documentar reglas de acceso |

### 4.6 Prestamos Escenarios (`Prestamo_Escenarios`)

| Categoria | Que se cambio | Que se agrego | Oportunidades de mejora |
|---|---|---|---|
| Integracion con Gym | Se conecto la busqueda de usuarios con GymControl y luego se optimizo para evitar lecturas masivas | API de busqueda, cliente de lookup y reglas de sede | Mantener indices por cedula/codigo y monitorear rendimiento |
| Multi-sede | Se adapto la operacion de reservas y administracion por sede | Selector de sede, reglas de sede y contexto para escenarios | Exponer KPIs por sede hacia el dashboard CDR |
| SSO | Se ajusto el flujo de autenticacion con CDR | Verificacion SSO y staff administrado desde el hub | Documentar roles esperados y redirects |
| Despliegue | Se agrego plantilla de variables de entorno y se alinearon dependencias para Vercel | `.env.example`, uso de npm y eliminacion de lockfile desactualizado | Crear checklist operativo para variables y credenciales |

### 4.7 Stock CDU Melendez (`stock-cdu`)

| Categoria | Que se cambio | Que se agrego | Oportunidades de mejora |
|---|---|---|---|
| Prestamos | Se amplio el historial de prestamos y devoluciones | Registro de hora, devolucion de faltantes y dialogo especializado | Agregar auditoria de cambios por usuario |
| Reportes | Se incorporo exportacion Excel | Prestamos por persona y elementos usados | Homologar columnas con Stock Cultura y Stock San Fernando |
| Acceso | Se corrigio acceso total para superadmin | Navegacion y guardas de ruta compatibles con superadmin | Hacer configurable el alcance del superadmin |
| Calidad de build | Se corrigieron errores TypeScript y utilidades de Firebase/prestamos | Build mas estable en Vercel | Agregar pruebas de rutas protegidas y operaciones de inventario |

### 4.8 Stock CDU San Fernando (`stock-cdu-sanfer`)

| Categoria | Que se cambio | Que se agrego | Oportunidades de mejora |
|---|---|---|---|
| Nueva operacion | Se adapto la app de prestamos para San Fernando | Firebase propio `stockcdusanfer`, URL de produccion y flujo de prestamos | Crear dashboard dedicado o resumen equivalente en CDR |
| Integracion con Gym | Se agrego lookup de usuarios desde GymControl | Busqueda de usuarios deportivos antes de prestar elementos | Unificar estrategia de busqueda con Prestamos Escenarios |
| Acceso publico | Se quito acceso personal de la pagina publica de prestamos | Flujo mas controlado desde la aplicacion | Revisar mensajes y estados para usuarios finales |
| Superadmin | Se corrigio acceso total para superadmin | Guardas de ruta y navegacion actualizadas | Documentar flujo de provision desde CDR Landing |
| Reportes | Hereda mejoras de exportacion de prestamos | Excel por persona y elementos usados | Mantener compatibilidad con Stock CDU Melendez |

### 4.9 Horarios Cultura (`Horarios_Cultura`)

| Categoria | Estado observado | Funcionalidades existentes o recientes | Oportunidades de mejora |
|---|---|---|---|
| Actividad reciente | No registra commits dentro del periodo revisado | Ultimos cambios previos: formulario multi-horario con boton para agregar slots | Validar si requiere nuevas reglas de disponibilidad |
| Integracion CDR | Registrado con acceso automatico por area Cultura | Redirect administrativo hacia `/adofi` | Agregar auditoria de ingresos administrativos |
| Gestion de horarios | Maneja franjas y grupos culturales | Mayor flexibilidad para actividades con varios horarios | Revisar solapamientos y conflictos de espacio |

### 4.10 Horarios CDU (`Horarios_CDU`)

| Categoria | Estado observado | Funcionalidades existentes o recientes | Oportunidades de mejora |
|---|---|---|---|
| Actividad reciente | No registra commits dentro del periodo revisado | Ultimos cambios previos: filtros por categoria y nombres completos | Unificar filtros con Horarios Cultura |
| Integracion CDR | Registrado con acceso automatico por area Deporte | Redirect administrativo hacia `/adofi` | Agregar pruebas de acceso por rol/area |
| Experiencia publica | Consulta de grupos deportivos con mejor filtrado | Lectura mas clara para usuarios finales | Medir rendimiento de carga y busqueda |

### 4.11 Stock Cultura (`stock_cultura`)

| Categoria | Estado observado | Funcionalidades existentes o recientes | Oportunidades de mejora |
|---|---|---|---|
| Actividad reciente | No registra commits dentro del periodo revisado | Ultimos cambios previos relacionados con navegacion/imports | Actualizar pruebas de build y rutas protegidas |
| Integracion CDR | Registrado como plataforma manual de Cultura | Dashboard de resumen en CDR Landing | Homologar KPIs con Stock CDU y San Fernando |
| Operacion de inventario | Gestion de items, prestamos y reportes | Flujo de inventario cultural | Revisar consistencia de roles admin/monitor |

### 4.12 Bitacora AC (`BitacoraAC`)

| Categoria | Estado observado | Funcionalidades existentes | Oportunidades de mejora |
|---|---|---|---|
| Actividad reciente | No registra commits dentro del periodo revisado | Base funcional de bitacora cultural | Priorizar modernizacion tecnica |
| Integracion CDR | Registrada como plataforma manual de Cultura | Acceso previsto desde el hub | Implementar `/auth/sso` y proteccion por rol |
| Persistencia y mantenimiento | Requiere revision frente al resto del ecosistema | Registro operativo basico | Migrar a backend consistente y resolver deuda de dependencias |

---

## 5. Sistemas Relacionados No Integrados Formalmente

| Sistema | Repositorio | Cambios observados | Motivo para excluirlo del alcance formal | Recomendacion |
|---|---|---|---|---|
| Seguimiento de contratistas | `seguimiento_cont` | Validaciones de cuotas, estados, responsive, campos editables y panel de historial de pagos | No aparece en `PLATFORM_ACCESS`, no tiene launcher ni SSO desde CDR Landing | Definir si debe integrarse; si aplica, agregar ID de plataforma, URL, contrato SSO y reglas de acceso |
| Bitacora CDU | Sin repo formal identificado en el workspace | Mencionada en UI publica de CDR Landing mediante URL de entorno | No esta registrada como plataforma formal en superadmin ni en acceso SSO | Decidir si sera plataforma oficial o solo enlace informativo |

---

## 6. Mejoras Transversales Recomendadas

| Prioridad | Mejora recomendada | Apps afectadas | Beneficio esperado |
|---:|---|---|---|
| Alta | Documentar un contrato SSO unico: payload, expiracion, roles, redirect, sede, area y cedula | Todas las apps con SSO | Reduce errores de integracion y facilita nuevas conexiones |
| Alta | Completar SSO real en `BitacoraAC` y `bit_com` | Bitacoras y CDR Landing | Elimina logins aislados y mejora gobierno de permisos |
| Alta | Estandarizar roles entre apps (`admin`, `monitor`, `superadmin`, `manager`, `SUPER_ADMIN`) | CDR, Asistencias, Canal, Gym, Stock, Prestamos | Evita inconsistencias al mapear permisos desde CDR |
| Alta | Agregar pruebas de rutas protegidas y permisos por rol/area | Todas las apps administrativas | Reduce regresiones de seguridad |
| Media | Homologar formatos de Excel/PDF | Asistencias, Gym, Stock, Prestamos | Facilita lectura gerencial y comparacion entre areas |
| Media | Crear KPIs o resumen visual para Stock CDU San Fernando y Prestamos Escenarios en CDR | CDR Landing, Stock Sanfer, Prestamos | Da visibilidad equivalente a Melendez y al flujo de reservas |
| Media | Ampliar Vista 360 a fuentes aun no consultadas | Bitacoras, Horarios, Canal, Stock Sanfer | Mejora trazabilidad de participantes y actividad |
| Media | Unificar nomenclatura de sede, area y espacio | CDR, Gym, Stock, Prestamos | Reduce errores en filtros, busquedas y SSO |
| Baja | Homologar sistema visual de tablas, cards, sidebars y estados | Apps administrativas | Mejora experiencia y reconocimiento de ecosistema unico |

---

## 7. Riesgos y Observaciones

| Riesgo | Descripcion | Recomendacion |
|---|---|---|
| Integracion SSO desigual | Algunas apps estan integradas; otras parecen mantener login propio o integracion parcial | Usar checklist de SSO por app antes de considerar una plataforma como conectada |
| Dependencia fuerte de variables de entorno | URLs y credenciales Firebase dependen de configuracion externa | Mantener `.env.example`, validadores y documentacion de despliegue por app |
| Roles divergentes | Cada aplicacion usa sus propios nombres de rol | Mantener un mapa de roles central y documentado en CDR Landing |
| Dashboards parciales | No todas las plataformas exponen KPIs al hub central | Priorizar APIs de resumen para las apps de mayor valor operativo |
| Superadmin hardcodeado | Algunas apps pueden tener accesos especiales por UID, cedula o reglas locales | Migrar a permisos gestionados desde CDR y auditables |
| Duplicacion entre apps similares | Horarios, Stock y flujos por sede comparten patrones repetidos | Extraer convenciones y documentacion compartida sin introducir refactors innecesarios |

---

## 8. Estado General por App

| App | Nivel de integracion con CDR | Estado funcional | Siguiente paso sugerido |
|---|---|---|---|
| CDR Landing | Alto | Hub central operativo | Documentar contrato SSO y reforzar KPIs faltantes |
| Asistencias Cultura/Deporte | Alto | Operativa y en expansion | Integrar Cineclub a Vista 360 si aplica |
| Canal Comunicaciones | Alto | Operativa con SSO por rol/area | Formalizar contrato JWT y pruebas |
| GymControl CDU | Alto | Operativa multi-sede y multi-espacio | Exponer metricas estables para CDR |
| Stock CDU Melendez | Alto | Operativa con reportes | Agregar auditoria de prestamos |
| Stock CDU San Fernando | Medio/alto | Nueva integracion operativa | Completar dashboard/resumen en CDR |
| Stock Cultura | Medio/alto | Operativa | Homologar KPIs y reportes con Stock CDU |
| Prestamos Escenarios | Medio/alto | Operativa e integrada con Gym | Publicar KPIs por sede hacia CDR |
| Horarios Cultura | Medio | Operativa | Validar solapamientos y auditar cambios |
| Horarios CDU | Medio | Operativa | Unificar filtros y reglas con Cultura |
| Bitacora COM | Medio/bajo | Operativa con mejoras de UI | Completar SSO CDR |
| Bitacora AC | Bajo | Requiere modernizacion | Implementar backend/SSO y actualizar dependencias |

---

## 9. Conclusiones

El ecosistema CDR Landing ha avanzado hacia una arquitectura mas centralizada y gobernable. Los cambios mas importantes fortalecen el control de accesos, la interoperabilidad SSO, la operacion multi-sede, la trazabilidad mediante reportes y la visibilidad administrativa desde el portal central.

La mayor oportunidad ahora es cerrar las brechas de integracion: llevar las bitacoras al mismo nivel de SSO, documentar formalmente el contrato entre CDR y cada app, exponer KPIs faltantes hacia el dashboard y estandarizar roles, sedes y formatos de reporte. Con estas acciones, el ecosistema quedara mas seguro, consistente y facil de mantener.
