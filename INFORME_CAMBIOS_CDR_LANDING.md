# Informe semanal de cambios - Ecosistema CDR Landing

**Fecha de corte:** 2 de noviembre de 2026, 14:03 UTC  
**Ventana revisada:** 26 de octubre de 2026, 14:00 UTC - 2 de noviembre de 2026, 14:03 UTC  
**Fuente:** historial de `origin/main` en los repositorios vinculados a CDR Landing y configuracion vigente de plataformas en `CDR_Landing/lib/platform-access-config.ts`.

## 1. Resumen ejecutivo

Durante la ventana semanal revisada no se detectaron commits nuevos en `origin/main` para CDR Landing ni para las aplicaciones formalmente integradas en su matriz de acceso. Por lo tanto, el estado funcional del ecosistema se mantiene estable frente al informe anterior.

El principal hallazgo no es una entrega nueva, sino una oportunidad operativa: mantener trazabilidad periodica de cambios aunque no haya actividad permite confirmar que las integraciones criticas permanecen sin modificaciones y ayuda a priorizar mejoras de monitoreo, pruebas de SSO y documentacion de dependencias entre aplicaciones.

| Indicador | Resultado |
| --- | --- |
| Repositorios formales revisados | 12 |
| Repositorios relacionados no integrados formalmente revisados | 1 |
| Commits detectados en la ventana | 0 |
| Apps con cambios en la semana | 0 |
| Riesgo inmediato por despliegues recientes | Bajo |
| Prioridad recomendada | Fortalecer verificacion automatizada, monitoreo y documentacion de integraciones |

## 2. Alcance revisado

La seleccion de aplicaciones se basa en las plataformas declaradas en CDR Landing para asignacion manual de accesos, roles y SSO. Adicionalmente se reviso `seguimiento_cont` como repositorio relacionado historicamente, aunque no aparece como plataforma formal dentro de CDR Landing.

| Plataforma en CDR Landing | Repositorio revisado | Area | Estado de integracion |
| --- | --- | --- | --- |
| CDR Landing | `CDR_Landing` | Cultura / Deporte | Portal central, login, SSO, paneles y administracion de accesos |
| Bitacora AC | `BitacoraAC` | Cultura / Deporte | Integrada formalmente con asignacion manual |
| Bitacora COM | `bit_com` | Cultura | Integrada formalmente con asignacion manual |
| Stock Cultura | `stock_cultura` | Cultura | Integrada formalmente con asignacion manual |
| Horarios Cultura | `Horarios_Cultura` | Cultura | Integrada formalmente con asignacion manual |
| Asistencias Cultura | `Asistencia_cultura` | Cultura | Integrada formalmente; comparte repositorio con flujos de asistencias |
| Canal Comunicaciones | `CanalComunicaciones` | Cultura / Deporte | Integrada formalmente con rol nativo obligatorio |
| Stock CDU Melendez | `stock-cdu` | Deporte | Integrada formalmente con permisos deportivos |
| Stock CDU San Fernando | `stock-cdu-sanfer` | Deporte | Integrada formalmente con configuracion por sede |
| Horarios CDU | `Horarios_CDU` | Deporte | Integrada formalmente con asignacion manual |
| Control de Accesos CDU | `gym_cdu` | Deporte | Integrada formalmente; requiere cedula para SSO |
| Asistencias Deporte | `Asistencia_cultura` | Deporte | Integrada formalmente; comparte repositorio con asistencias |
| Prestamos Escenarios | `Prestamo_Escenarios` | Deporte | Integrada formalmente con asignacion manual |
| Seguimiento Contratos | `seguimiento_cont` | Relacionado | Revisado como app relacionada, no formalizada en `PLATFORM_ACCESS` |

## 3. Cambios detectados en la semana

No se identificaron cambios de codigo, configuracion o documentacion publicados en `origin/main` durante la ventana analizada.

| Repositorio | Commits en la ventana | Archivos modificados | Resultado |
| --- | ---: | ---: | --- |
| `CDR_Landing` | 0 | 0 | Sin cambios nuevos |
| `Asistencia_cultura` | 0 | 0 | Sin cambios nuevos |
| `BitacoraAC` | 0 | 0 | Sin cambios nuevos |
| `bit_com` | 0 | 0 | Sin cambios nuevos |
| `CanalComunicaciones` | 0 | 0 | Sin cambios nuevos |
| `stock_cultura` | 0 | 0 | Sin cambios nuevos |
| `Horarios_Cultura` | 0 | 0 | Sin cambios nuevos |
| `stock-cdu` | 0 | 0 | Sin cambios nuevos |
| `stock-cdu-sanfer` | 0 | 0 | Sin cambios nuevos |
| `Horarios_CDU` | 0 | 0 | Sin cambios nuevos |
| `gym_cdu` | 0 | 0 | Sin cambios nuevos |
| `Prestamo_Escenarios` | 0 | 0 | Sin cambios nuevos |
| `seguimiento_cont` | 0 | 0 | Sin cambios nuevos en app relacionada |

## 4. Ultima actividad conocida por aplicacion

Aunque no hubo cambios en la semana, se consolida la ultima actividad conocida para facilitar seguimiento ejecutivo y tecnico.

| Repositorio | Ultimo commit en `origin/main` | Fecha local del commit | Descripcion |
| --- | --- | --- | --- |
| `CDR_Landing` | `c86db89` | 2026-09-12 | Renombrar GymControl CDU a Control de Accesos CDU |
| `Asistencia_cultura` | `daeea44` | 2026-10-22 | Dejar el boton de enviar inscripcion al final del formulario de usuario |
| `BitacoraAC` | `9f70a41` | 2025-03-25 | Mensaje de confirmacion |
| `bit_com` | `f87b8b3` | 2026-05-07 | Agregar sistema de estados con colores personalizados |
| `CanalComunicaciones` | `44df84f` | 2026-06-16 | Restringir managers a envio y consulta de sus solicitudes |
| `stock_cultura` | `3f6d315` | 2026-03-23 | Corregir imports faltantes de navegacion |
| `Horarios_Cultura` | `ec5481d` | 2026-04-21 | Formulario multi-horario con boton para agregar slots |
| `stock-cdu` | `05cdd3f` | 2026-06-16 | Columnas opcionales en Excel: correo, telefono, etnia y edad |
| `stock-cdu-sanfer` | `bb6d6f5` | 2026-06-16 | Ignorar carpeta `.vercel` en git |
| `Horarios_CDU` | `0c6d7e1` | 2026-06-16 | Actualizar vista de pagina de grupo |
| `gym_cdu` | `1e39010` | 2026-10-02 | Admin y super admin cambian sede; monitores ven entradas de gimnasio |
| `Prestamo_Escenarios` | `bb73da4` | 2026-06-01 | Alinear busqueda gym con Stock Sanfer y enlace CDUControl |
| `seguimiento_cont` | `6223c6a` | 2026-10-06 | Permitir contrato nuevo al terminar el anterior y elegir entre varios |

## 5. Que se cambio y que se anadio

### 5.1 Cambios realizados durante la ventana

| Categoria | Detalle | Impacto |
| --- | --- | --- |
| Codigo | No hubo commits nuevos en los repositorios revisados. | No cambia el comportamiento visible para usuarios finales. |
| Configuracion | No se detectaron cambios en integraciones, roles o SSO durante la semana. | Se conserva la matriz de acceso vigente. |
| Documentacion | No se detectaron documentos nuevos o actualizados en `origin/main`. | No hay nueva guia operativa publicada esta semana. |
| Despliegue | No se infieren despliegues nuevos desde cambios de repositorio en la ventana. | Riesgo operativo bajo por ausencia de entregas recientes. |

### 5.2 Adiciones realizadas durante la ventana

| Elemento anadido | Estado |
| --- | --- |
| Nuevas plataformas en CDR Landing | No detectadas |
| Nuevos roles o permisos | No detectados |
| Nuevos paneles o reportes | No detectados |
| Nuevas rutas o APIs | No detectadas |
| Nuevas dependencias | No detectadas |

## 6. Lectura tecnica del estado actual

| Frente | Estado actual | Observacion |
| --- | --- | --- |
| Gobierno de accesos | Estable | Todas las plataformas formales se mantienen bajo asignacion manual desde CDR Landing. |
| SSO y roles | Estable | La configuracion central sigue dependiendo de `PLATFORM_ACCESS`, `SSO_ROLE_MAP` y reglas especificas por app. |
| Apps con mayor actividad reciente | Asistencias y Control de Accesos CDU | Son las areas que concentraron los ultimos cambios relevantes antes de esta semana. |
| Apps con baja actividad historica | Bitacora AC, Stock Cultura, Horarios Cultura | Conviene revisar deuda tecnica y compatibilidad de dependencias si se planean cambios. |
| Repos relacionados no formalizados | `seguimiento_cont` | Sigue fuera de la matriz formal de plataformas de CDR Landing; cualquier integracion debe definirse explicitamente. |

## 7. Oportunidades de mejora recomendadas

| Prioridad | Mejora recomendada | Justificacion | Resultado esperado |
| --- | --- | --- | --- |
| Alta | Crear una verificacion automatizada semanal de SSO por plataforma | La matriz de roles es central para el acceso; una regresion puede bloquear operaciones en varias apps. | Detectar fallos de login, cedula, sede o rol antes de que afecten usuarios. |
| Alta | Documentar contrato de integracion por app | Varias apps dependen de roles, sedes o identificadores especificos. | Menos riesgo al modificar permisos, rutas de SSO o nombres de plataforma. |
| Media | Agregar tabla de ownership y criticidad operacional | No todas las apps tienen la misma frecuencia de uso ni el mismo impacto. | Priorizar soporte y pruebas segun criticidad real. |
| Media | Unificar checklist de despliegue para apps CDR | Hay multiples repos con tecnologias y ritmos distintos. | Reducir errores de configuracion y facilitar auditorias. |
| Media | Definir si `seguimiento_cont` debe integrarse formalmente | El repositorio aparece relacionado, pero no en `PLATFORM_ACCESS`. | Evitar ambiguedad entre app relacionada y plataforma administrada desde CDR Landing. |
| Baja | Mantener historial de informes en una carpeta dedicada | El informe semanal puede crecer como evidencia ejecutiva. | Mejor trazabilidad y comparacion entre semanas. |

## 8. Riesgos y controles sugeridos

| Riesgo | Nivel | Control sugerido |
| --- | --- | --- |
| Cambios futuros en roles sin actualizar CDR Landing | Medio | Pruebas de contrato entre `PLATFORM_ACCESS` y roles nativos de cada app. |
| Apps poco modificadas con dependencias antiguas | Medio | Revision trimestral de dependencias, build y rutas criticas. |
| Ausencia de evidencia automatizada de salud | Medio | Smoke tests semanales para login, SSO y carga de dashboard. |
| Ambiguedad de apps relacionadas no formalizadas | Bajo / Medio | Decision documentada sobre integrar o excluir formalmente cada app. |

## 9. Conclusiones

1. No hubo cambios nuevos en la semana para CDR Landing ni para sus apps formales.
2. El ecosistema se mantiene estable y sin evidencia de regresiones introducidas por commits recientes.
3. La recomendacion principal es aprovechar la estabilidad para fortalecer pruebas automatizadas, documentacion de integraciones y monitoreo de SSO.
4. `seguimiento_cont` debe seguir tratandose como relacionado, no como app administrada por CDR Landing, hasta que se agregue explicitamente a la configuracion de plataformas.

