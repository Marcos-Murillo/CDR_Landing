# Informe profesional de cambios - Ecosistema CDR Landing

**Fecha de emision:** 5 de octubre de 2026  
**Ventana analizada:** 28 de septiembre de 2026 14:03 UTC - 5 de octubre de 2026 14:02 UTC  
**Repositorio base del informe:** `CDR_Landing`  
**Fuente de relacion entre apps:** `lib/platform-access-config.ts` y `lib/superadmin-platforms.ts` en CDR Landing  
**Metodo de revision:** actualizacion de referencias remotas con `git fetch origin --prune`, revision de historial Git en `origin/main` y contraste contra las plataformas configuradas en CDR Landing.

---

## 1. Resumen ejecutivo

Durante la semana analizada se detecto actividad nueva en **Control de Accesos CDU** (`gym_cdu`), una de las aplicaciones formales del ecosistema CDR Landing. El cambio principal habilita una operacion mas clara por sede para administradores y superadministradores, permite consultar/generar reportes por Melendez, San Fernando o ambas sedes, y agrega una pantalla especifica para revisar entradas del gimnasio con filtros por fecha, nombre y hora.

El resto de aplicaciones formales conectadas a CDR Landing no presento commits nuevos en `origin/main` durante la ventana revisada. Por lo tanto, la lectura ejecutiva es de **avance focalizado en operacion deportiva multisede**, sin cambios directos en el portal central CDR Landing ni en las plataformas de Cultura durante esta semana.

| Indicador | Resultado |
|---|---:|
| Plataformas formales revisadas desde CDR Landing | 12 |
| Repositorios formales observados | 11 |
| Repositorio base observado | 1 |
| Repositorios adicionales observados fuera de la integracion formal | 1 |
| Repositorios formales con cambios en la semana | 1 |
| Repositorios formales sin cambios en la semana | 10 |
| Commits nuevos detectados en la ventana | 1 |
| Archivos nuevos detectados en la ventana | 2 |
| Archivos modificados detectados en la ventana | 14 |
| Archivos eliminados detectados en la ventana | 0 |
| App con mayor actividad semanal | `gym_cdu` - Control de Accesos CDU |

---

## 2. Alcance de aplicaciones revisadas

La siguiente matriz cruza las plataformas declaradas en CDR Landing con el repositorio observado y el resultado de la revision semanal.

| Plataforma en CDR Landing | Area | Repositorio / app | Estado semanal | Observacion ejecutiva |
|---|---|---|---|---|
| Bitacora AC | Cultura y Deporte | `BitacoraAC` | Sin cambios | No se detectaron commits nuevos en `origin/main`. |
| Bitacora COM | Cultura | `bit_com` | Sin cambios | Permanece como plataforma formal sin actividad semanal. |
| Stock Cultura | Cultura | `stock_cultura` | Sin cambios | Sin cambios funcionales o tecnicos en la ventana. |
| Horarios Cultura | Cultura | `Horarios_Cultura` | Sin cambios | Sin commits nuevos en la semana. |
| Asistencias Cultura | Cultura | `Asistencia_cultura` | Sin cambios | Mantiene el estado posterior a los cambios de formularios, Drive y fisioterapia reportados en ciclos anteriores. |
| Canal Comunicaciones | Cultura y Deporte | `CanalComunicaciones` | Sin cambios | Sin actividad semanal detectada. |
| Stock CDU Melendez | Deporte | `stock-cdu` | Sin cambios | Sin cambios en `origin/main`. |
| Stock CDU San Fernando | Deporte | `stock-cdu-sanfer` | Sin cambios | Sin cambios en `origin/main`. |
| Horarios CDU | Deporte | `Horarios_CDU` | Sin cambios | Sin actividad semanal detectada. |
| Control de Accesos CDU | Deporte | `gym_cdu` | Con cambios | Se agrego operacion multisede para admins/superadmins y una vista de entradas del gimnasio. |
| Asistencias Deporte | Deporte | `Asistencia_cultura` | Sin cambios | Comparte repositorio con Asistencias Cultura; no hubo actividad nueva en la ventana. |
| Prestamos Escenarios | Deporte | `Prestamo_Escenarios` | Sin cambios | Sin actividad semanal detectada. |

### Repositorios observados fuera de la integracion formal

| Repositorio | Relacion observada | Estado semanal | Recomendacion |
|---|---|---|---|
| `seguimiento_cont` | Presente en el workspace, pero no aparece como plataforma formal en la configuracion actual de CDR Landing. | Sin cambios | Definir si debe integrarse al catalogo CDR o mantenerse como aplicacion independiente. |

---

## 3. Cambios realizados durante la semana

| App / repositorio | Commit | Fecha | Tipo de cambio | Resumen profesional | Impacto esperado |
|---|---|---|---|---|---|
| Control de Accesos CDU (`gym_cdu`) | `1e39010` | 2026-10-02 | Funcional / operativo | Permite que administradores y superadministradores cambien de sede operativa, consulten datos por Melendez o San Fernando y generen informes consolidados. | Mejora la administracion multisede y reduce dependencia de cuentas separadas o filtros manuales. |

### Detalle tecnico del cambio en `gym_cdu`

| Frente modificado | Archivos principales | Que cambio | Resultado para usuarios |
|---|---|---|---|
| Contexto de sede operativa | `lib/sede-context.tsx`, `app/layout.tsx` | Se agrego un proveedor global de sede activa, persistido en `localStorage`, disponible para las pantallas operativas. | Admins y superadmins pueden cambiar entre Melendez y San Fernando desde la navegacion. |
| Reglas y normalizacion de sede | `lib/sede.ts` | Se consolido la resolucion de sedes activas, alias y permisos para operar varias sedes. | Menor riesgo de inconsistencias por nombres como "San Fernando", `san_fernando` o variantes de Melendez. |
| Registro de entradas | `components/gimnasio-content.tsx`, `app/piscina/page.tsx`, `lib/storage.ts` | Las nuevas entradas se guardan con la sede activa y se usa fecha local para evitar desfases por UTC. | El conteo diario queda alineado con el dia operativo local y con la sede correcta. |
| Vista de entradas del gimnasio | `app/gimnasio/entradas/page.tsx` | Se agrego una pantalla para consultar entradas por fecha, sede activa, nombre y hora, con actualizacion automatica cada 20 segundos. | Monitores/admins pueden revisar el flujo de entradas del gimnasio de forma mas rapida. |
| Estadisticas y reportes | `app/estadisticas/page.tsx` | Se agregaron filtros de sede, opcion de reporte conjunto y generacion PDF por sede o sumatoria. | Direccion y administracion pueden comparar o consolidar informacion de ambas sedes. |
| Navegacion | `components/navigation.tsx`, `components/ui/floating-dock.tsx` | Se agrego selector de sede, nueva ruta de entradas y ajustes de visibilidad por sede/espacio. | La interfaz guia al usuario hacia pantallas compatibles con la sede seleccionada. |
| Tenis de mesa e inventario | `app/tenis-mesa/page.tsx`, `app/tenis-mesa/inventario/page.tsx` | Se adapto el uso de sede activa y se amplio capacidad de gestion para administradores. | La operacion de tenis de mesa queda alineada con el nuevo modelo multisede. |
| Scripts de ejecucion | `package.json` | Los scripts usan rutas explicitas a binarios de Next.js y ESLint bajo `node_modules`. | Mayor estabilidad en entornos donde los binarios no se resuelven automaticamente. |

---

## 4. Elementos anadidos

| Categoria | Elemento anadido | Repositorio | Valor aportado |
|---|---|---|---|
| Nueva pantalla / ruta | `app/gimnasio/entradas/page.tsx` | `gym_cdu` | Consulta operativa de entradas de gimnasio con filtros por fecha, nombre y hora. |
| Nuevo contexto compartido | `lib/sede-context.tsx` | `gym_cdu` | Centraliza la sede activa y habilita cambio de sede para roles autorizados. |
| Nueva consulta de datos | `getEntriesByDate(fecha)` en `lib/storage.ts` | `gym_cdu` | Reduce carga al consultar entradas de un dia especifico para la nueva vista. |
| Nueva utilidad de fecha | `localDateISO()` en `lib/utils.ts` | `gym_cdu` | Evita desfases de dia operativo causados por fechas UTC. |
| Nuevo documento operativo | `INFORME_CAMBIOS_CDR_LANDING.md` | `CDR_Landing` | Consolida el seguimiento semanal del ecosistema para lectura directiva y tecnica. |

---

## 5. Estado reciente por repositorio

La tabla siguiente muestra el ultimo commit conocido de cada repositorio observado para dar contexto sobre la antiguedad relativa de la actividad.

| Repositorio | Plataforma asociada | Ultimo commit en `origin/main` | Fecha | Lectura ejecutiva |
|---|---|---|---|---|
| `CDR_Landing` | Portal central / panel CDR | `c86db89` - Renombrar GymControl CDU a Control de Accesos CDU. | 2026-09-12 | Portal central estable; sin cambios directos en la semana. |
| `Asistencia_cultura` | Asistencias Cultura y Deporte | `5ee662a` - Corregir tipos de fisioterapia y Drive para el build de Vercel. | 2026-09-18 | App con evolucion reciente previa; sin actividad nueva en esta ventana. |
| `CanalComunicaciones` | Canal Comunicaciones | `44df84f` - Restrict managers to submit and my-requests only. | 2026-06-16 | Mantiene restricciones de rol introducidas previamente. |
| `stock-cdu` | Stock CDU Melendez | `05cdd3f` - feat: columnas opcionales en Excel. | 2026-06-16 | Sin novedades recientes; ultima actividad enfocada en reportes/exportacion. |
| `stock-cdu-sanfer` | Stock CDU San Fernando | `bb6d6f5` - chore: ignorar carpeta .vercel en git. | 2026-06-16 | Repositorio estable; ultima actividad operativa menor. |
| `Horarios_CDU` | Horarios CDU | `0c6d7e1` - Update group page view. | 2026-06-16 | Sin cambios recientes en calendario o vista de grupos. |
| `gym_cdu` | Control de Accesos CDU | `1e39010` - feat: admin y super admin cambian de sede y monitores ven las entradas del gimnasio. | 2026-10-02 | Plataforma con actividad semanal; foco en operacion multisede y reportes. |
| `Prestamo_Escenarios` | Prestamos Escenarios | `bb73da4` - Alinear busqueda gym con stock Sanfer y enlace CDUControl. | 2026-06-01 | Sin cambios desde la integracion con flujos CDU/gimnasio. |
| `bit_com` | Bitacora COM | `f87b8b3` - Agregar sistema de estados con colores personalizados. | 2026-05-07 | Sin actividad reciente; mantiene sistema de estados. |
| `Horarios_Cultura` | Horarios Cultura | `ec5481d` - feat: formulario multi-horario con boton + para agregar slots. | 2026-04-21 | Sin cambios recientes; ultima actividad fue de gestion de horarios. |
| `stock_cultura` | Stock Cultura | `3f6d315` - fix missing Navigation imports. | 2026-03-23 | Sin actividad reciente; conviene revisar deuda tecnica y dependencias. |
| `BitacoraAC` | Bitacora AC | `9f70a41` - Mensaje de confirmacion. | 2025-03-25 | Es la app formal con actividad mas antigua en el historial observado. |
| `seguimiento_cont` | No integrada formalmente | `f61ff4b` - Refactor contratistas: validaciones cuotas, estados, panel historial pagos. | 2026-05-15 | App presente en workspace, pendiente de decision de integracion CDR. |

---

## 6. Lectura ejecutiva por area

| Area | Apps revisadas | Estado semanal | Comentario |
|---|---:|---|---|
| Cultura | 4 plataformas formales | Sin cambios | No hubo actividad nueva en bitacoras, stock, horarios ni asistencias de Cultura. |
| Deporte | 6 plataformas formales | Cambio focalizado | La novedad corresponde a Control de Accesos CDU, con mejoras multisede y de reporte. |
| Cultura y Deporte | 2 plataformas compartidas | Sin cambios | Bitacora AC y Canal Comunicaciones permanecen sin commits nuevos. |
| Portal central | 1 repositorio base | Sin cambios | CDR Landing no recibio cambios directos esta semana. |

---

## 7. Riesgos identificados

| Riesgo | Nivel | Evidencia | Control recomendado |
|---|---|---|---|
| Persistencia de sede activa en navegador | Medio | La sede activa se guarda en `localStorage` para usuarios que pueden cambiar de sede. | Validar que el backend/reglas de datos sigan controlando permisos y que la sede visual no otorgue acceso no autorizado. |
| Reportes consolidados sin pruebas automatizadas visibles | Medio | El cambio agrega reportes por sede y sumatoria en `gym_cdu`. | Crear pruebas de contrato para Melendez, San Fernando y "todas" antes de nuevos despliegues. |
| Divergencia entre CDR Landing y permisos internos de `gym_cdu` | Medio | CDR Landing define roles/sedes para SSO y la app ahora permite operacion multisede a admin/superadmin. | Documentar y probar payload SSO esperado: rol, sede, espacio y plataforma. |
| Apps formales con baja actividad reciente | Medio | Varias plataformas no presentan commits recientes en meses. | Ejecutar mantenimiento preventivo mensual de dependencias, build y seguridad. |
| `seguimiento_cont` sin definicion formal dentro de CDR | Bajo | Esta presente en el workspace, pero no en la matriz de plataformas de CDR Landing. | Decidir si se integra, se excluye o se reporta como app relacionada independiente. |

---

## 8. Oportunidades de mejora priorizadas

| Prioridad | Mejora recomendada | Motivo | Accion sugerida |
|---|---|---|---|
| Alta | Agregar pruebas para cambio de sede en `gym_cdu` | El nuevo comportamiento afecta varias pantallas: gimnasio, piscina, biometrico, estadisticas y tenis de mesa. | Cubrir casos admin/superadmin/monitor, sede Melendez, sede San Fernando y rutas no disponibles por sede. |
| Alta | Formalizar contrato SSO entre CDR Landing y Control de Accesos CDU | La operacion multisede depende de rol, sede y espacio asignados desde el portal. | Documentar payload, expiracion, redirects, defaults de sede y validaciones esperadas. |
| Alta | Validar reglas de Firestore para sedes | El selector de sede mejora la UX, pero la seguridad no debe depender solo del cliente. | Revisar reglas/consultas para impedir lecturas o escrituras de sedes no autorizadas. |
| Media | Crear historial permanente de informes | El informe semanal como archivo unico puede sobrescribirse o perder trazabilidad temporal. | Migrar a `docs/informes/AAAA-MM-DD-cdr-landing.md` y mantener un indice mensual. |
| Media | Automatizar build semanal de apps conectadas | Varias apps no tuvieron cambios recientes y pueden acumular incompatibilidades. | Crear workflow o script que ejecute install/lint/build por repositorio y entregue resumen. |
| Media | Normalizar nombres y alias de sedes | Existen variantes de escritura para Melendez, San Fernando y `san_fernando`. | Mantener una tabla unica de display name, slug, alias y reglas por app. |
| Media | Definir el futuro de `seguimiento_cont` | Sigue apareciendo como app relacionada en workspace, pero no esta formalmente conectada. | Tomar decision de producto y reflejarla en CDR Landing o en la documentacion. |
| Baja | Complementar informes Git con metricas operativas | El historial de commits no mide uso real, errores SSO ni adopcion. | Incorporar metricas de accesos, entradas registradas, reportes generados y errores por app. |

---

## 9. Recomendaciones para el proximo ciclo

| Horizonte | Recomendacion | Resultado esperado |
|---|---|---|
| Proximos 7 dias | Probar manualmente el flujo multisede de `gym_cdu` para admin, superadmin y monitor. | Confirmar que cada rol ve y registra informacion solo donde corresponde. |
| Proximos 7 dias | Ejecutar build de `gym_cdu` y `CDR_Landing`. | Reducir riesgo de fallos por cambios en Next.js, rutas o dependencias. |
| Proximos 15 dias | Documentar matriz SSO completa por plataforma. | Menor riesgo de errores de acceso por rol, area, sede o redirect. |
| Proximos 30 dias | Crear historial de informes en `docs/informes/`. | Trazabilidad clara para direccion, soporte y mantenimiento. |
| Proximos 30 dias | Decidir integracion de `seguimiento_cont`. | Alcance CDR formal sin ambiguedades. |
| Proximos 60 dias | Revisar dependencias y deuda tecnica de apps sin actividad reciente. | Reduccion de riesgo de vulnerabilidades, builds rotos o incompatibilidades. |

---

## 10. Validacion realizada

| Validacion | Resultado |
|---|---|
| Actualizacion de referencias remotas con `git fetch origin --prune` | Completada en repos revisados. |
| Revision de `origin/main` por app formal | Completada. |
| Confirmacion de ventana semanal del cron | 28 sep 2026 14:03 UTC - 5 oct 2026 14:02 UTC. |
| Revision de configuracion CDR para plataformas formales | Completada con `platform-access-config.ts` y `superadmin-platforms.ts`. |
| Revision de repositorio relacionado no integrado (`seguimiento_cont`) | Completada. |
| Revision detallada del commit activo de la semana | Completada para `gym_cdu` commit `1e39010`. |
| Ejecucion de build/test | No aplica: este cambio agrega documentacion y no modifica codigo ejecutable. |

---

## 11. Conclusion

La semana del 28 de septiembre al 5 de octubre de 2026 registra un cambio relevante y focalizado en **Control de Accesos CDU**. El ecosistema avanza en operacion deportiva multisede, especialmente para administradores y superadministradores que necesitan alternar entre Melendez y San Fernando, consultar entradas y generar reportes individuales o consolidados.

No se observaron cambios en las demas aplicaciones formales conectadas a CDR Landing. Para el siguiente ciclo, la prioridad recomendada es verificar el nuevo flujo multisede con pruebas funcionales y de permisos, documentar el contrato SSO con `gym_cdu` y continuar fortaleciendo la trazabilidad tecnica del ecosistema mediante builds automatizados e historial formal de informes.
