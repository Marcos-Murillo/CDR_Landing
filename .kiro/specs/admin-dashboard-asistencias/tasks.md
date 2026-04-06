# Implementation Plan: admin-dashboard-asistencias

## Overview

Implementación incremental en 6 bloques: primero la función pura de agregación con sus tests, luego las APIs (asistencias_area y cdr-landing), después el sidebar reutilizable, el rediseño del dashboard con gráficas, y finalmente la página de plataformas.

## Tasks

- [x] 1. Función pura de agregación y tipos compartidos
  - Crear `asistencias_area/lib/dashboard-summary.ts` con la interfaz `DashboardSummary` y la función pura `computeDashboardSummary(records, groups, now?)`.
  - La función debe computar todos los campos del `DashboardSummary` según la lógica del diseño (totalAsistencias, participantesUnicos, gruposActivos, asistenciasMesActual, asistenciasMesAnterior, porGenero, porEstamento, top5Grupos, gruposBajos, tendencia6Meses).
  - _Requirements: 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14, 1.15_

  - [ ]* 1.1 Escribir property tests para `computeDashboardSummary` con fast-check
    - Instalar `fast-check` como devDependency en `asistencias_area`.
    - **Property 1: Unicidad de participantes** — para cualquier array de AttendanceRecord, `participantesUnicos === new Set(records.map(r => r.numeroDocumento)).size`. **Validates: Requirements 1.7**
    - **Property 2: Consistencia totales por género** — `porGenero.mujer + porGenero.hombre + porGenero.otro === totalAsistencias`. **Validates: Requirements 1.6, 1.11**
    - **Property 3: Consistencia totales por estamento** — `sum(Object.values(porEstamento)) === totalAsistencias`. **Validates: Requirements 1.12**
    - **Property 4: Top 5 grupos ordenados desc** — `top5Grupos` ordenado descendente por `total` y `length <= 5`. **Validates: Requirements 1.13**
    - **Property 5: Grupos bajos ordenados asc** — `gruposBajos` ordenado ascendente por `total` y `length <= 5`. **Validates: Requirements 1.14**
    - **Property 6: Tendencia cubre 6 meses** — `tendencia6Meses.length === 6` y meses en orden cronológico. **Validates: Requirements 1.15**
    - **Property 7: Mes actual + anterior ≤ total** — `asistenciasMesActual + asistenciasMesAnterior <= totalAsistencias`. **Validates: Requirements 1.9, 1.10**
    - Mínimo 100 iteraciones por propiedad (configuración por defecto de fast-check).
    - _Requirements: 1.6, 1.7, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14, 1.15_

  - [ ]* 1.2 Escribir unit tests para casos borde de `computeDashboardSummary`
    - Array vacío → todos los campos en 0 o arrays vacíos.
    - Registros de un solo género → los otros géneros en 0.
    - Mes anterior sin registros → `asistenciasMesAnterior === 0` (sin división por cero en variación).
    - _Requirements: 1.6, 1.9, 1.10, 1.11_

- [x] 2. Summary_API en `asistencias_area`
  - Crear `asistencias_area/app/api/dashboard-summary/route.ts`.
  - Extraer el Bearer token del header `Authorization`.
  - Verificar el JWT con `jose` (`jwtVerify`) usando `SSO_SECRET`.
  - Validar que `payload.role` sea `'ADMIN'` o `'SUPER_ADMIN'`; retornar 403 si no.
  - Llamar a `getAttendanceRecords('cultura')` y `getAllCulturalGroups('cultura')`.
  - Llamar a `computeDashboardSummary` y retornar el resultado como JSON con `Response.json()`.
  - Manejar errores de JWT (ausente → 401, inválido → 401, expirado → 401) y errores de Firestore (→ 500).
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.16_

  - [ ]* 2.1 Escribir unit tests para la Summary_API
    - Mock de `jose.jwtVerify`: token ausente → 401, token inválido → 401, token expirado → 401.
    - **Property 8: JWT con rol no autorizado → 403** — para cualquier rol que no sea ADMIN/SUPER_ADMIN, retorna 403. **Validates: Requirements 1.3**
    - **Property 9: JWT inválido/expirado → 401** — para cualquier string que no sea un JWT válido firmado con SSO_SECRET, retorna 401. **Validates: Requirements 1.2, 1.4**
    - Mock de `getAttendanceRecords` y `getAllCulturalGroups`: happy path → retorna DashboardSummary con HTTP 200.
    - Mock de Firestore error → retorna 500.
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 3. Checkpoint — Verificar que todos los tests de asistencias_area pasen
  - Asegurarse de que todos los tests pasen. Consultar al usuario si surgen dudas.

- [x] 4. Aggregator_API en `cdr-landing`
  - Crear `cdr-landing/app/api/platforms/asistencias-summary/route.ts`.
  - Extraer el Firebase ID Token del header `Authorization`.
  - Verificar con `adminAuth.verifyIdToken()` de `cdr-landing/lib/firebase-admin.ts`; retornar 401 si falla.
  - Generar SSO_JWT con `jsonwebtoken` (`jwt.sign`) con `role: 'SUPER_ADMIN'` y `expiresIn: '30s'`, firmado con `SSO_SECRET`.
  - Hacer `fetch` a `${process.env.NEXT_PUBLIC_URL_ASISTENCIAS}/api/dashboard-summary` con el SSO_JWT en el header `Authorization: Bearer`.
  - Propagar el status y body de la respuesta de la Summary_API al cliente.
  - En caso de error de red, retornar 502.
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 4.1 Escribir unit tests para la Aggregator_API
    - Mock de `adminAuth.verifyIdToken`: token inválido → 401.
    - Happy path: mock de `adminAuth.verifyIdToken` exitoso + mock de `fetch` → retorna DashboardSummary.
    - **Property: propagación de errores** — para cualquier status de error (4xx, 5xx) retornado por el mock de Summary_API, el Aggregator_API debe propagar ese mismo status. **Validates: Requirements 2.6**
    - Error de red (fetch lanza) → 502.
    - _Requirements: 2.1, 2.2, 2.6_

- [x] 5. Componente `DashboardSidebar`
  - Crear `cdr-landing/components/dashboard-sidebar.tsx` como Client Component (`'use client'`).
  - Implementar las props `{ activeSection, user, onSignOut }`.
  - Replicar el estilo del sidebar de `/superadmin` (fondo `#0A2540`, ancho 240px, posición fija).
  - Sección "Dashboards": item "Asistencias" con ícono de gráfica → `href="/dashboard"`.
  - Sección "Plataformas": item "Ver todas" → `href="/dashboard/plataformas"`.
  - Resaltar el item activo según `activeSection`.
  - Chip de usuario (iniciales, nombre, rol) y botón logout en la parte inferior.
  - Crear `cdr-landing/components/dashboard-sidebar.module.css` con los estilos (ocultar en ≤ 900px).
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

- [x] 6. Rediseño de `cdr-landing/app/dashboard/page.tsx`
  - [x] 6.1 Reemplazar el layout actual por el layout con sidebar
    - Eliminar el `<header>` y `<footer>` actuales.
    - Renderizar `DashboardSidebar` con `activeSection="asistencias"` y los datos del usuario.
    - Crear un área de contenido principal con `margin-left: 240px`.
    - Topbar con título "Asistencias" y botón "Abrir Asistencias" (SSO hacia `asistencias_cultura`).
    - Actualizar `cdr-landing/app/dashboard/dashboard.module.css` con los nuevos estilos de layout.
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 6.2 Implementar fetch de datos desde el Aggregator_API
    - Al montar el componente, obtener el Firebase ID Token con `auth.currentUser?.getIdToken()`.
    - Llamar a `/api/platforms/asistencias-summary` con el token en el header `Authorization`.
    - Gestionar estados `loading`, `error` y `data` con `useState`/`useEffect`.
    - _Requirements: 4.4, 4.5, 4.6_

  - [x] 6.3 Implementar `SkeletonDashboard` y estado de error
    - Crear placeholders animados (CSS `@keyframes pulse`) para KPI cards y gráficas.
    - Estado de error: mensaje descriptivo + botón "Reintentar" que re-ejecuta el fetch.
    - _Requirements: 4.5, 4.6_

  - [x] 6.4 Implementar las 4 KPI cards
    - Crear componente `KpiCard` (puede ser interno al archivo o en `components/`).
    - Cards: "Total asistencias", "Participantes únicos", "Grupos activos", "Asistencias este mes".
    - La card de "Asistencias este mes" incluye badge de variación porcentual (verde/rojo).
    - _Requirements: 4.7, 4.8_

  - [x] 6.5 Implementar las gráficas de torta (Recharts)
    - Torta de género: `PieChart` con colores `#ec4899` (mujer), `#3b82f6` (hombre), `#8b5cf6` (otro).
    - Torta de estamento: `PieChart` con colores automáticos.
    - Usar `ResponsiveContainer` para adaptarse al ancho del contenedor.
    - _Requirements: 4.9, 4.10, 4.14_

  - [x] 6.6 Implementar las gráficas de barras horizontales (Recharts)
    - Top 5 grupos: `BarChart` con `layout="vertical"`, color `#2563EB`.
    - 5 grupos bajos: `BarChart` con `layout="vertical"`, color `#f97316`.
    - Usar `ResponsiveContainer`.
    - _Requirements: 4.11, 4.12, 4.14_

  - [x] 6.7 Implementar la gráfica de tendencia (Recharts)
    - `LineChart` full-width con `ResponsiveContainer`.
    - Datos de `tendencia6Meses` (eje X: `mes`, eje Y: `total`).
    - _Requirements: 4.13, 4.14_

- [ ] 7. Checkpoint — Verificar que el dashboard carga y muestra datos correctamente
  - Asegurarse de que todos los tests pasen. Consultar al usuario si surgen dudas.

- [x] 8. Página de Plataformas
  - Crear `cdr-landing/app/dashboard/plataformas/page.tsx`.
  - Renderizar `DashboardSidebar` con `activeSection="plataformas"`.
  - Topbar con título "Plataformas".
  - Reutilizar la lógica de `availableModules` y `handleModuleClick` del dashboard actual.
  - Mostrar las tarjetas de módulos con botón SSO.
  - Crear `cdr-landing/app/dashboard/plataformas/plataformas.module.css` con los estilos.
  - Mantener el guard de autenticación (`role !== 'admin'` → redirect).
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 9. Checkpoint final — Verificar integración completa
  - Asegurarse de que todos los tests pasen. Consultar al usuario si surgen dudas.

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido.
- Cada tarea referencia los requisitos específicos para trazabilidad.
- Los property tests usan `fast-check` con mínimo 100 iteraciones.
- Los unit tests validan ejemplos concretos y casos borde.
- La función `computeDashboardSummary` es pura (sin efectos secundarios), lo que facilita el testing.
