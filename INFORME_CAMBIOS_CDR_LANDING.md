# Informe semanal de cambios - Ecosistema CDR Landing

**Periodo auditado:** 2026-11-02 14:03 UTC - 2026-11-09 14:03 UTC  
**Fecha de elaboracion:** 2026-11-09  
**Fuente de revision:** historial `origin/main` de los repositorios relacionados con CDR Landing.  
**Alcance:** CDR Landing, las plataformas formales configuradas en `lib/platform-access-config.ts` y `seguimiento_cont` como repositorio relacionado no integrado formalmente.

## 1. Resumen ejecutivo

Durante la semana auditada se revisaron los repositorios que conforman el ecosistema de CDR Landing. La actividad se concentro en **Asistencia_cultura** y **Prestamo_Escenarios**. El eje principal de los cambios fue la integracion operativa entre Asistencias y Prestamos de Escenarios: las solicitudes de escenarios pasan a originarse desde Asistencias, mientras que Prestamo_Escenarios conserva el flujo administrativo de aprobacion, gestion documental y generacion del formato institucional CRD.

Tambien se incorporo un flujo robusto para informes de entrenadores, mejoras en Google Drive OAuth, generacion del formato CRD en ambas aplicaciones, nuevos componentes de experiencia de usuario y ajustes de build para despliegues en Vercel.

| Indicador | Resultado |
| --- | ---: |
| Repositorios revisados | 13 |
| Plataformas formales CDR revisadas | 12 |
| Repositorios con cambios en la ventana | 2 |
| Commits detectados en apps activas | 13 |
| Archivos modificados o agregados en apps activas | 71 |
| Principal foco funcional | Integracion Asistencias -> Prestamos de Escenarios |

## 2. Estado general por aplicacion

| Aplicacion / repositorio | Relacion con CDR Landing | Estado semanal | Commits | Archivos impactados | Lectura ejecutiva |
| --- | --- | --- | ---: | ---: | --- |
| `CDR_Landing` | Portal central y SSO | Sin cambios en `origin/main` | 0 | 0 | La configuracion de plataformas permanece estable. |
| `Asistencia_cultura` | Asistencias Cultura y Asistencias Deporte | Con cambios relevantes | 11 | 42 | Se agrego la solicitud de escenarios desde Asistencias, informes de entrenadores, mejoras de Drive y ajustes de torneos. |
| `Prestamo_Escenarios` | Gestion administrativa de escenarios | Con cambios relevantes | 2 | 29 | La app se reorienta como back-office: administra peticiones, Drive y formato CRD; el usuario final se redirige a Asistencias. |
| `BitacoraAC` | Bitacora AC | Sin cambios | 0 | 0 | Sin variaciones funcionales detectadas. |
| `bit_com` | Bitacora Comunicaciones | Sin cambios | 0 | 0 | Sin variaciones funcionales detectadas. |
| `CanalComunicaciones` | Canal Comunicaciones | Sin cambios | 0 | 0 | Sin variaciones funcionales detectadas. |
| `gym_cdu` | Control de Accesos CDU | Sin cambios | 0 | 0 | Sin variaciones funcionales detectadas. |
| `Horarios_CDU` | Horarios CDU | Sin cambios | 0 | 0 | Sin variaciones funcionales detectadas. |
| `Horarios_Cultura` | Horarios Cultura | Sin cambios | 0 | 0 | Sin variaciones funcionales detectadas. |
| `stock_cultura` | Stock Cultura | Sin cambios | 0 | 0 | Sin variaciones funcionales detectadas. |
| `stock-cdu` | Stock CDU Melendez | Sin cambios | 0 | 0 | Sin variaciones funcionales detectadas. |
| `stock-cdu-sanfer` | Stock CDU San Fernando | Sin cambios | 0 | 0 | Sin variaciones funcionales detectadas. |
| `seguimiento_cont` | Relacionado, no integrado formalmente | Sin cambios | 0 | 0 | No se detecto actividad semanal. |

## 3. Cambios principales detectados

### 3.1 Asistencia_cultura

| Frente | Que se cambio o agrego | Archivos representativos | Impacto esperado |
| --- | --- | --- | --- |
| Solicitud de escenarios desde Asistencias | Se agrego un panel para reservar escenarios, buscar usuarios de Asistencias, seleccionar sede, escenario, fecha, hora y participantes, cargar carta firmada cuando aplica y crear la reserva en Firebase de Prestamos. | `components/reservar-escenario-panel.tsx`, `lib/prestamos-reservas.ts`, `lib/prestamos-firebase.ts`, `app/api/prestamos/carta/route.ts` | Centraliza la experiencia del solicitante en Asistencias y conecta directamente con la operacion administrativa de escenarios. |
| Historial y formato CRD para reservas | Se permite ver reservas del usuario y descargar el formato CRD-IC-01 desde el historial de Asistencias. | `components/reservar-escenario-panel.tsx`, `lib/formato-crd.ts` | Mejora trazabilidad para el usuario y reduce reprocesos administrativos. |
| Informes de entrenadores | Se incorporo un panel para crear informes por rango de fechas, adjuntar soportes, registrar evidencias fotograficas, generar documento Word y preparar paquetes descargables. | `components/trainer-informe-panel.tsx`, `lib/trainer-reports.ts`, `lib/trainer-report-docx.ts`, `lib/trainer-report-template.ts`, `lib/image-links.ts` | Formaliza la entrega de informes y soportes de entrenadores dentro del mismo flujo de grupos/asistencias. |
| PDF de asistencias | Se agrego soporte para construir y guardar informes PDF de asistencia asociados al paquete de entrenador. | `lib/attendance-pdf.ts`, `components/group-attendance-report.tsx` | Facilita consolidar evidencia operativa en documentos estandarizados. |
| Google Drive OAuth | Se corrigieron URIs de retorno, estado OAuth, manejo de refresh token y mensajes de error para despliegues en Vercel. | `lib/google-drive.ts`, `app/api/drive/oauth/*`, `app/conectar-drive/page.tsx` | Disminuye errores de autorizacion y evita depender de cuenta de servicio sin cuota de Drive personal. |
| Torneos | Se ajusto el calculo de tablas por torneo con puntos, sets y diferencias segun deporte; se agrego archivo Excel de referencia. | `app/torneos/[id]/page.tsx`, `components/torneos-usuario-section.tsx`, `lib/torneo-utils.ts`, `public/Tablas_Vol_Bal_Fut_Torneos.xlsx` | Mejora la exactitud de clasificaciones y seguimiento deportivo. |
| Experiencia de carga | Se agrego `CallChip` para visualizar progreso en el envio del formulario de inscripcion. | `components/CallChip.jsx`, `components/CallChip.css`, `components/cultura-user-profile.tsx` | Da retroalimentacion visual mas clara durante operaciones de carga. |
| Compatibilidad de build | Se hicieron ajustes para que Vercel acepte tipos y estilos opcionales en componentes nuevos. | `components/CallChip.jsx`, `components/trainer-informe-panel.tsx`, `components/cultura-user-profile.tsx` | Reduce fallos de compilacion y estabiliza despliegues. |

**Commits relevantes**

| Commit | Fecha local | Resumen |
| --- | --- | --- |
| `6fcd797` | 2026-11-03 10:49 | Calculo de tablas de torneos con puntos, sets y diferencia. |
| `572e65d` | 2026-11-04 23:24 | Cambio de cuenta de servicio a OAuth de Gmail para Drive. |
| `8d8fe62` | 2026-11-04 23:55 | Uso de URI OAuth configurada. |
| `f7d78f0` | 2026-11-05 00:01 | Evita retorno a localhost en Vercel y muestra URI real. |
| `b1196ff` | 2026-11-05 00:29 | Manejo de token de Drive para entornos Vercel. |
| `44e2c9b` | 2026-11-05 01:00 | Uso de CallChip en progreso de formulario. |
| `7dafa69` | 2026-11-05 11:55 | Solicitudes de escenarios desde Deporte y formato CRD en historial. |
| `2d0b68e` | 2026-11-05 12:18 | Ajuste final del formato CRD: datos legibles en negro y retiro de seccion de entrega en campo. |

### 3.2 Prestamo_Escenarios

| Frente | Que se cambio o agrego | Archivos representativos | Impacto esperado |
| --- | --- | --- | --- |
| Redireccion del usuario final hacia Asistencias | Paginas como login, perfil, reservas y mis reservas dejan de concentrar el flujo del solicitante y redirigen al sitio de Asistencias en produccion, con alternativa local para desarrollo. | `components/ir-a-asistencia.tsx`, `components/local-prestamos-home.tsx`, `lib/asistencia-url.ts`, `app/login/page.tsx`, `app/(app)/mis-reservas/page.tsx`, `app/(app)/perfil/page.tsx` | Evita duplicidad de experiencia y define Asistencias como entrada principal para usuarios. |
| Back-office de peticiones | Se mantiene y mejora la gestion administrativa de reservas, con filtros, aprobacion/rechazo y descarga del formato CRD por peticion. | `app/(app)/admin/peticiones/page.tsx`, `lib/formato-crd.ts`, `lib/types.ts` | Refuerza el rol de Prestamo_Escenarios como herramienta de operacion interna. |
| Formato CRD institucional | Se agrego generacion de PDF CRD-IC-01 con datos del solicitante, escenario, horario, estado y observaciones. | `lib/formato-crd.ts` | Estandariza soporte documental para solicitudes aprobadas, rechazadas o pendientes. |
| Google Drive para cartas firmadas | Se agregaron rutas OAuth, pantalla de conexion y subida de PDF al Drive propio de Prestamos. | `app/api/drive/oauth/*`, `app/api/upload/route.ts`, `app/conectar-drive/page.tsx`, `lib/google-drive.ts` | Permite almacenar cartas firmadas en el Drive correcto y exponer enlace publico cuando corresponda. |
| Lectura de usuarios desde Asistencias | Se agrego busqueda de usuarios en proyectos de Asistencias Cultura y Deporte por documento o codigo. | `lib/asistencia-user-lookup.ts`, `.env.example` | Alinea participantes y solicitantes con el registro central de Asistencias. |
| Navegacion administrativa | Se agregaron enlaces y ajustes visuales para conectar el admin con el nuevo enfoque de flujo. | `components/sidebar.tsx`, `components/gym-register-prompt.tsx`, `app/page.tsx` | Reduce confusion entre flujo publico y administracion. |

**Commits relevantes**

| Commit | Fecha local | Resumen |
| --- | --- | --- |
| `8a28e17` | 2026-11-05 11:54 | Solicitudes quedan en Asistencias y PDF institucional en Escenarios. |
| `0dfc3ce` | 2026-11-05 12:18 | Muestra formato CRD en cada peticion y deja los datos legibles. |

## 4. Nuevas dependencias y activos agregados

| Repositorio | Elemento | Proposito | Observacion |
| --- | --- | --- | --- |
| `Asistencia_cultura` | `docx` | Generacion de informes Word para entrenadores. | Dependencia funcional para reportes. |
| `Asistencia_cultura` | `jszip` | Empaquetado/descarga de soportes de informes. | Util para consolidar evidencias. |
| `Asistencia_cultura` | `@hugeicons/core-free-icons`, `@hugeicons/react` | Iconografia para `CallChip`. | Aumenta superficie de dependencias UI. |
| `Asistencia_cultura` | `public/Formato Informe Entrenadores Septiembre - Octubre 2026.docx` | Plantilla/base documental de informe. | Archivo binario grande dentro del repositorio. |
| `Asistencia_cultura` | `public/informe-logo-univalle.jpeg` | Logo para informes. | Activo institucional. |
| `Asistencia_cultura` | `public/Tablas_Vol_Bal_Fut_Torneos.xlsx` | Referencia de tablas deportivas. | Activo de soporte operativo. |
| `Prestamo_Escenarios` | `secrets.drive-oauth.json` en `.gitignore` | Evitar versionar token OAuth local. | Correcto para seguridad de credenciales. |

## 5. Integracion CDR Landing y flujo operativo resultante

| Punto de integracion | Estado actual | Beneficio | Riesgo a vigilar |
| --- | --- | --- | --- |
| CDR Landing -> Asistencias | Sin cambios esta semana; la plataforma ya existe como acceso formal. | Mantiene entrada central para usuarios autorizados. | Verificar que los roles SSO sigan llevando al panel correcto tras los nuevos modulos. |
| Asistencias -> Prestamos | Nuevo flujo de creacion de reservas desde Asistencias hacia Firebase de Prestamos. | Reduce duplicidad y concentra solicitudes donde ya estan los perfiles de usuarios. | Validar reglas Firestore, indices y concurrencia de reservas. |
| Prestamos -> Asistencias | Redireccion del usuario publico hacia Asistencias. | Define Prestamos como back-office administrativo. | Comunicar el cambio para evitar confusion de usuarios acostumbrados a entrar por Prestamos. |
| Google Drive | Ambas apps avanzan hacia OAuth de usuario y carpetas especificas. | Disminuye errores por cuota de cuentas de servicio. | Estandarizar nombres de variables y paneles de diagnostico para soporte. |
| Formato CRD | Disponible en Asistencias e internamente en Prestamos. | Mayor consistencia documental. | Evitar divergencia por duplicacion del generador en dos repositorios. |

## 6. Oportunidades de mejora priorizadas

| Prioridad | Mejora recomendada | Motivo | Accion sugerida |
| --- | --- | --- | --- |
| Alta | Centralizar `formato-crd.ts` como modulo compartido o contrato versionado. | El generador CRD existe en Asistencias y Prestamos; cualquier ajuste institucional debe replicarse dos veces. | Crear paquete compartido, submodulo o proceso de sincronizacion con pruebas de snapshot PDF. |
| Alta | Validar concurrencia al reservar escenarios. | El flujo consulta reservas activas y luego crea documento; dos usuarios podrian competir por el mismo horario/unidad. | Usar transaccion Firestore o validacion server-side antes de confirmar reserva. |
| Alta | Agregar prueba end-to-end Asistencias -> Prestamos. | Es el cambio de mayor impacto operativo. | Probar: buscar usuario, crear solicitud, adjuntar carta, verla en admin, aprobar/rechazar y descargar CRD. |
| Alta | Revisar reglas Firestore multi-proyecto. | Prestamos lee usuarios de Asistencias y Asistencias escribe reservas de Prestamos. | Documentar permisos minimos, indices requeridos y colecciones expuestas. |
| Media | Crear pantalla de diagnostico de integraciones. | Drive, Prestamos Firebase, Imagenes Firebase y Asistencias tienen variables de entorno interdependientes. | Mostrar estado de conexion, callback OAuth efectivo y carpeta configurada para admins. |
| Media | Externalizar plantillas binarias grandes. | La plantilla Word de mas de 7 MB aumenta el peso del repositorio. | Mover a Drive/Blob con versionado controlado o documentar criterio para mantenerla en `public`. |
| Media | Normalizar nombres de variables OAuth entre apps. | Asistencia usa `GOOGLE_DRIVE_REFRESH_TOKEN`; Prestamos usa `GOOGLE_OAUTH_REFRESH_TOKEN`. | Documentar convencion o alinear nombres para soporte operativo. |
| Media | Definir comunicacion de cambio para usuarios. | Prestamos redirige hacia Asistencias en produccion. | Incluir aviso en CDR Landing o en Asistencias explicando que las reservas se realizan desde el nuevo punto. |
| Baja | Reducir dependencia UI si `CallChip` es puntual. | Se agregan dos dependencias de iconos para un componente especifico. | Evaluar si lucide-react existente cubre la necesidad visual. |
| Baja | Documentar matriz de sedes y requisitos de carta. | Melendez requiere carta y San Fernando no necesariamente. | Agregar tabla de reglas visibles para administradores y solicitantes. |

## 7. Conclusiones

La semana presenta un avance importante en la consolidacion del ecosistema CDR: **Asistencias se convierte en el punto principal para solicitudes de escenarios y Prestamos queda enfocado en administracion y control documental**. Esto simplifica la experiencia del usuario final y aprovecha la informacion ya disponible en los perfiles de Asistencias.

El cambio tiene impacto positivo, pero requiere una ronda de estabilizacion orientada a permisos, concurrencia, pruebas integrales y documentacion de variables de entorno. La recomendacion principal es validar el flujo completo con datos reales o de staging antes de comunicarlo masivamente a usuarios finales.
