# Informe profesional de cambios - Ecosistema CDR Landing

**Fecha de corte:** 12 de octubre de 2026, 14:01 UTC  
**Ventana analizada:** 05 de octubre de 2026, 14:02 UTC -> 12 de octubre de 2026, 14:01 UTC  
**Repositorio base del informe:** `CDR_Landing`  
**Fuente de integracion:** `lib/platform-access-config.ts`

## 1. Resumen ejecutivo

Durante la semana analizada se identifico actividad en **1 repositorio formalmente integrado con CDR Landing**: `Asistencia_cultura`. Este repositorio respalda flujos de asistencias por area activa, por lo que el cambio puede impactar tanto la plataforma `asistencias_cultura` como la plataforma `asistencias_deporte`, aunque el commit se registro en el repositorio `Asistencia_cultura`.

Tambien se detecto actividad en `seguimiento_cont`, repositorio presente en el workspace y relacionado con procesos administrativos del ecosistema, pero **no registrado actualmente como plataforma formal en CDR Landing**. Por esa razon se reporta como sistema relacionado y no como integracion oficial.

| Indicador | Resultado |
|---|---:|
| Plataformas formales revisadas | 12 |
| Repositorios formales con commits en la ventana | 1 |
| Plataformas formales potencialmente impactadas | 2 |
| Repositorios relacionados no integrados con commits | 1 |
| Commits formales detectados | 1 |
| Commits relacionados no integrados detectados | 1 |
| Impacto principal | Mejor experiencia de consulta y gestion de usuarios en Asistencias Cultura |

## 2. Alcance revisado

La revision tomo como fuente las plataformas declaradas en CDR Landing. Estas son las apps que hoy se consideran integraciones formales para asignacion manual, roles y SSO.

| ID en CDR Landing | App / Plataforma | Area | Repositorio revisado | Estado semanal |
|---|---|---|---|---|
| `bitacoraac` | Bitacora AC | Cultura y Deporte | `BitacoraAC` | Sin cambios |
| `bitacora_comunicaciones` | Bitacora COM | Cultura | `bit_com` | Sin cambios |
| `stock_cultura` | Stock Cultura | Cultura | `stock_cultura` | Sin cambios |
| `horarios` | Horarios Cultura | Cultura | `Horarios_Cultura` | Sin cambios |
| `asistencias_cultura` | Asistencias Cultura | Cultura | `Asistencia_cultura` | **Con cambios** |
| `canal_comunicaciones` | Canal Comunicaciones | Cultura y Deporte | `CanalComunicaciones` | Sin cambios |
| `stock_cdu` | Stock CDU Melendez | Deporte | `stock-cdu` | Sin cambios |
| `stock_cdu_sanfer` | Stock CDU San Fernando | Deporte | `stock-cdu-sanfer` | Sin cambios |
| `horarios_cdu` | Horarios CDU | Deporte | `Horarios_CDU` | Sin cambios |
| `gym_cdu` | Control de Accesos CDU | Deporte | `gym_cdu` | Sin cambios |
| `asistencias_deporte` | Asistencias Deporte | Deporte | `Asistencia_cultura` | Cambio compartido en repo area-aware |
| `prestamos_escenarios` | Prestamos Escenarios | Deporte | `Prestamo_Escenarios` | Sin cambios |

### Repositorio relacionado fuera de la configuracion formal

| Repositorio | Relacion operativa | Estado en CDR Landing | Estado semanal |
|---|---|---|---|
| `seguimiento_cont` | Seguimiento de contratistas, contratos y pagos | No declarado en `PLATFORM_ACCESS` | **Con cambios** |

## 3. Cambios detectados por app formal

### 3.1 Asistencias Cultura / Asistencias Deporte (`Asistencia_cultura`)

| Campo | Detalle |
|---|---|
| Commit | `fdc40d7` |
| Fecha | 08 de octubre de 2026 |
| Mensaje | `Cargar inscripciones del area activa y rediseñar la ficha de usuario.` |
| Archivos modificados | `app/usuarios/page.tsx`, `lib/db-router.ts` |
| Volumen del cambio | 364 inserciones, 186 eliminaciones |
| Tipo de cambio | Mejora funcional, redisenio de interfaz y ajuste de acceso a datos por area |
| Plataformas CDR asociadas | `asistencias_cultura`, `asistencias_deporte` |

#### Que se cambio

| Frente | Antes | Ahora | Beneficio |
|---|---|---|---|
| Carga de detalles del usuario | La vista consultaba datos de eventos y asistencias con servicios menos alineados al area activa. | La ficha consulta grupos, convocatorias, eventos reales y asistencias mediante rutas area-aware desde `db-router`. | Reduce cruces entre areas y mejora la coherencia de los datos mostrados. |
| Ficha de usuario | Presentacion tipo tarjeta clasica, con menos jerarquia visual y datos limitados. | Ficha redisenada como modal compacto con secciones de perfil, contacto, grupos, convocatorias, eventos y asistencia. | Facilita la lectura operativa y mejora la experiencia de administradores. |
| Convocatorias y eventos | Se mostraban eventos como identificadores genericos. | Se resuelven nombres de convocatorias y eventos reales a partir de sus IDs. | Los administradores ven informacion entendible sin tener que interpretar IDs. |
| Estados de carga | No habia una separacion clara entre carga, error y datos vacios en la ficha. | Se agregan estados de carga y error para los detalles del usuario. | Mejora la trazabilidad cuando la base de datos no responde o no hay informacion. |
| Gestion de grupos | La ficha era principalmente consultiva. | Se agrega la capacidad de retirar al usuario de un grupo desde la ficha, validando permisos de administrador. | Reduce pasos operativos para corregir inscripciones. |
| Sincronizacion con edicion/eliminacion | La ficha podia quedar abierta con datos desactualizados si se editaba o eliminaba el usuario. | Se actualiza el usuario seleccionado al editar y se cierra la ficha al eliminar. | Evita inconsistencias visibles en pantalla. |

#### Que se anadio

| Nuevo elemento | Archivo | Descripcion |
|---|---|---|
| `getUserEventEnrollmentsRouter` en la vista | `app/usuarios/page.tsx` | Carga convocatorias asociadas al usuario segun el area activa. |
| `getUserRealEventEnrollments` | `app/usuarios/page.tsx` | Permite diferenciar eventos reales de convocatorias. |
| `getEventByIdRouter` y `getRealEventByIdRouter` | `app/usuarios/page.tsx` | Resuelven nombres legibles para convocatorias y eventos. |
| `getAttendanceRecordsRouter(area)` | `app/usuarios/page.tsx` | Consulta asistencias desde la base correspondiente al area seleccionada. |
| `removeUserFromGroup(area, userId, grupoCultural)` | `lib/db-router.ts` | Funcion area-aware para eliminar inscripciones de grupo. |
| Estados `detailsLoading`, `detailsError`, `removingGroupId` | `app/usuarios/page.tsx` | Controlan carga, errores y acciones en progreso dentro de la ficha. |
| Secciones visuales para grupos, convocatorias, eventos y asistencia | `app/usuarios/page.tsx` | Mejoran la lectura y separan informacion academica, operativa y de asistencia. |

#### Impacto esperado

| Perfil impactado | Impacto |
|---|---|
| Administradores de Cultura | Mayor rapidez para auditar datos del usuario y corregir grupos. |
| Monitores / operadores autorizados | Mejor visibilidad sobre inscripciones, eventos y asistencia. |
| Usuarios finales | Menos riesgo de que su informacion sea vista o gestionada desde el area equivocada. |
| Soporte tecnico | Mas puntos de diagnostico por mensajes de error y carga diferenciados. |

## 4. Cambios en repositorio relacionado no integrado formalmente

### 4.1 Seguimiento de contratistas (`seguimiento_cont`)

> Este repositorio no aparece en la lista formal de plataformas de CDR Landing. Se incluye por su relacion operativa con procesos administrativos que pueden ser relevantes para el ecosistema CDR.

| Campo | Detalle |
|---|---|
| Commit | `6223c6a` |
| Fecha | 06 de octubre de 2026 |
| Mensaje | `Permitir un contrato nuevo al terminar el anterior y elegir entre varios.` |
| Archivos modificados | 8 archivos |
| Volumen del cambio | 478 inserciones, 53 eliminaciones |
| Tipo de cambio | Mejora funcional para contratos, pagos y experiencia de contratistas |

#### Que se cambio

| Frente | Cambio | Beneficio |
|---|---|---|
| Contratos finalizados | Se detectan contratos terminados por fecha de fin o por cuotas completadas y pagadas. | Permite diferenciar claramente contratos activos y cerrados. |
| Nuevo contrato para una misma persona | Se agrega flujo para crear un contrato nuevo cuando el anterior ya termino, conservando datos basicos del contratista. | Evita sobrescribir historial y mantiene continuidad administrativa. |
| Seleccion entre varios contratos | Se agrega selector de contratos para contratistas con mas de un contrato asociado a la misma cedula. | El contratista y el administrador pueden consultar el contrato correcto. |
| Estado de pago | El estado de pago pasa a una tarjeta/panel dedicado. | Reduce complejidad en la vista general y focaliza la gestion de cuotas. |
| Edicion del contrato | La vista de informacion conserva la posibilidad de editar el contrato. | Recupera flexibilidad operativa sin mezclarla con el panel de pago. |

#### Que se anadio

| Nuevo elemento | Archivo | Descripcion |
|---|---|---|
| `ContractSwitcher` | `components/contratistas/contract-switcher.tsx` | Selector reutilizable para alternar entre contratos de una misma cedula. |
| `PaymentStatusPanel` | `components/contratistas/payment-status-panel.tsx` | Panel dedicado para revisar y actualizar estado de cuotas, cuenta, revision e historial. |
| `isContractFinished` | `lib/contractor-utils.ts` | Identifica contratos terminados por fecha o por ultima cuota pagada. |
| `contractsForCedula` | `lib/contractor-utils.ts` | Lista contratos de una cedula priorizando vigentes sobre finalizados. |
| `pickCurrentContract` | `lib/contractor-utils.ts` | Devuelve el contrato vigente o mas relevante para una cedula. |
| Preset de nuevo contrato | `components/contratistas/new-contract-dialog.tsx` | Prellena nombre y cedula al crear un contrato nuevo desde uno terminado. |

## 5. Apps sin cambios detectados en la ventana

Las siguientes apps fueron revisadas y no registraron commits en `origin/main` durante el periodo analizado:

| App | Repositorio | Observacion |
|---|---|---|
| CDR Landing | `CDR_Landing` | No hubo cambios funcionales en la landing durante la ventana. |
| Bitacora AC | `BitacoraAC` | Sin actividad semanal detectada. |
| Bitacora COM | `bit_com` | Sin actividad semanal detectada. |
| Stock Cultura | `stock_cultura` | Sin actividad semanal detectada. |
| Horarios Cultura | `Horarios_Cultura` | Sin actividad semanal detectada. |
| Canal Comunicaciones | `CanalComunicaciones` | Sin actividad semanal detectada. |
| Stock CDU Melendez | `stock-cdu` | Sin actividad semanal detectada. |
| Stock CDU San Fernando | `stock-cdu-sanfer` | Sin actividad semanal detectada. |
| Horarios CDU | `Horarios_CDU` | Sin actividad semanal detectada. |
| Control de Accesos CDU | `gym_cdu` | Sin actividad semanal detectada. |
| Prestamos Escenarios | `Prestamo_Escenarios` | Sin actividad semanal detectada. |

## 6. Analisis profesional de impacto

| Dimension | Evaluacion | Comentario |
|---|---|---|
| Continuidad operativa | Positiva | Los cambios mejoran procesos existentes sin modificar la lista de plataformas ni el esquema de acceso de CDR Landing. |
| Experiencia de usuario interno | Positiva | La ficha de usuario de Asistencias Cultura queda mas clara y accionable. |
| Gobernanza de datos | Positiva con seguimiento | El uso de rutas por area reduce riesgos de consultar datos de otra base; conviene reforzarlo con pruebas automatizadas. |
| Riesgo tecnico | Medio-bajo | Los cambios son acotados, pero tocan vistas administrativas sensibles y eliminacion de inscripciones. |
| Trazabilidad | Mejorada | Hay mas estados visibles de carga/error y mas separacion entre informacion de perfil, eventos y asistencias. |
| Integracion con CDR Landing | Sin cambio directo | No se agregaron nuevas plataformas ni cambios al mapa de roles/SSO esta semana. |

## 7. Oportunidades de mejora

| Prioridad | Mejora recomendada | App / Repositorio | Justificacion | Resultado esperado |
|---|---|---|---|---|
| Alta | Agregar pruebas para `removeUserFromGroup` y carga area-aware de usuarios | `Asistencia_cultura` | La eliminacion de inscripciones es una accion sensible y debe validarse por area y permisos. | Menos riesgo de borrar inscripciones incorrectas. |
| Alta | Confirmar si `seguimiento_cont` debe integrarse formalmente en CDR Landing | `CDR_Landing` / `seguimiento_cont` | El repositorio tiene relacion operativa, pero no existe en `PLATFORM_ACCESS`. | Decision clara: integrarlo con roles/SSO o mantenerlo fuera del alcance CDR. |
| Media | Registrar auditoria de retiros de grupos | `Asistencia_cultura` | Actualmente se elimina la inscripcion; una bitacora permitiria saber quien retiro a quien y cuando. | Mayor trazabilidad administrativa. |
| Media | Normalizar componentes de ficha/perfil entre apps de Cultura y Deporte | Apps de asistencias | Las fichas de usuarios son flujos recurrentes en el ecosistema. | Experiencia mas consistente y menor mantenimiento duplicado. |
| Media | Documentar criterios de contrato finalizado | `seguimiento_cont` | La logica combina fecha de fin y cuotas pagadas. | Menos ambiguedad para administradores y soporte. |
| Baja | Incluir contador semanal de cambios en el dashboard de CDR Landing | `CDR_Landing` | Hoy el informe es documental; podria convertirse en vista operativa. | Seguimiento visual y permanente del estado de apps. |

## 8. Riesgos y controles sugeridos

| Riesgo | Nivel | Control sugerido |
|---|---|---|
| Retirar por error a un usuario de un grupo | Medio | Confirmacion explicita, auditoria y prueba automatizada por area. |
| Mostrar informacion incompleta si falla la carga de eventos o asistencias | Bajo-medio | Mantener mensajes de error por seccion y permitir reintento en la ficha. |
| Confusion entre convocatorias y eventos reales | Bajo | Mantener etiquetas separadas y nombres legibles como se implemento en la ficha. |
| Contratos duplicados o mal seleccionados en `seguimiento_cont` | Medio | Validar ordenamiento, contrato vigente y estados finalizados con casos de prueba. |
| Brecha entre apps relacionadas y plataformas formales | Medio | Revisar periodicamente `PLATFORM_ACCESS` contra repositorios activos del ecosistema. |

## 9. Recomendaciones para la siguiente semana

| Orden | Accion recomendada | Responsable sugerido | Resultado |
|---:|---|---|---|
| 1 | Validar manualmente la nueva ficha de usuario en Asistencias Cultura con usuarios de Cultura y Deporte. | Equipo funcional / QA | Confirmar que los datos corresponden al area activa. |
| 2 | Probar retiro de usuario de grupo con admin y con usuario sin permisos. | Desarrollo / QA | Confirmar permisos y mensajes de error. |
| 3 | Decidir estado de `seguimiento_cont` dentro del ecosistema CDR Landing. | Coordinacion CDR / Desarrollo | Definir si requiere tarjeta, SSO y roles en Landing. |
| 4 | Agregar pruebas unitarias o de integracion para funciones nuevas. | Desarrollo | Reducir regresiones en flujos administrativos. |
| 5 | Mantener informe semanal con la misma ventana horaria. | Automatizacion | Facilitar comparacion historica. |

## 10. Metodologia

| Paso | Descripcion |
|---|---|
| 1 | Se reviso la configuracion formal de plataformas en `CDR_Landing/lib/platform-access-config.ts`. |
| 2 | Se consulto el historial de `origin/main` en los repositorios asociados a cada plataforma. |
| 3 | Se compararon commits dentro de la ventana semanal definida. |
| 4 | Se revisaron archivos modificados y diffs de los commits detectados. |
| 5 | Se separaron apps formales de repositorios relacionados no integrados. |
| 6 | Se consolidaron cambios, adiciones, impactos, riesgos y oportunidades de mejora en tablas. |

## 11. Conclusiones

| Conclusion | Detalle |
|---|---|
| Principal avance formal | El repositorio `Asistencia_cultura`, asociado a Asistencias Cultura y Asistencias Deporte, fortalecio la ficha de usuario con datos por area activa, mejor interfaz y gestion directa de grupos. |
| Cambio relacionado relevante | `seguimiento_cont` avanzo en manejo de multiples contratos, contratos finalizados y gestion separada de pagos. |
| Estado de CDR Landing | No tuvo cambios directos en la ventana; su mapa formal de plataformas se mantiene igual. |
| Foco recomendado | Probar los flujos administrativos sensibles y decidir si `seguimiento_cont` debe pasar a ser una plataforma formal de CDR Landing. |

