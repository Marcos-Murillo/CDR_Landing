# Requirements Document

## Introduction

Este feature transforma el dashboard de administrador (`/dashboard`) de `cdr-landing` en un panel analítico con sidebar fijo, añade una API de resumen de asistencias en `asistencias_area`, un aggregator seguro en `cdr-landing`, y una página de plataformas separada. El objetivo es que los administradores puedan visualizar KPIs, gráficas y tendencias de asistencia cultural directamente desde el hub central, sin salir de la aplicación.

## Glossary

- **Dashboard_Page**: Página Next.js en `cdr-landing/app/dashboard/page.tsx` accesible solo para usuarios con `role === 'admin'`.
- **Sidebar**: Componente React fijo en el lado izquierdo (240 px, fondo #0A2540) reutilizable entre rutas del dashboard.
- **Summary_API**: Endpoint `GET /api/dashboard-summary` en `asistencias_area` que agrega datos de Firestore.
- **Aggregator_API**: Endpoint `GET /api/platforms/asistencias-summary` en `cdr-landing` que actúa como proxy seguro hacia la Summary_API.
- **SSO_JWT**: JSON Web Token firmado con `SSO_SECRET` usado para autenticación server-to-server.
- **Firebase_ID_Token**: Token de identidad Firebase emitido por Firebase Auth del cliente.
- **KPI_Card**: Tarjeta de indicador clave de rendimiento que muestra un número y metadatos.
- **Attendance_Record**: Documento en la colección `attendance_records` de Firestore en `asistencias_area`.
- **Cultural_Group**: Documento en la colección `cultural_groups` de Firestore en `asistencias_area`.
- **Platforms_Page**: Página Next.js en `cdr-landing/app/dashboard/plataformas/page.tsx`.
- **DashboardSummary**: Objeto JSON con métricas agregadas retornado por la Summary_API.
- **Skeleton**: Placeholder visual animado mostrado mientras los datos se cargan.

---

## Requirements

### Requirement 1: API de resumen en asistencias_area

**User Story:** Como administrador, quiero que `asistencias_area` exponga un endpoint seguro con métricas agregadas, para que `cdr-landing` pueda consumirlas sin exponer credenciales de Firestore al cliente.

#### Acceptance Criteria

1. WHEN a `GET` request is received at `/api/dashboard-summary` with a valid `Authorization: Bearer <SSO_JWT>` header, THE Summary_API SHALL return a `DashboardSummary` JSON object with HTTP 200.
2. WHEN the JWT is missing or malformed, THE Summary_API SHALL return HTTP 401 with a descriptive error message.
3. WHEN the JWT is valid but the `role` claim is neither `ADMIN` nor `SUPER_ADMIN`, THE Summary_API SHALL return HTTP 403.
4. WHEN the JWT has expired, THE Summary_API SHALL return HTTP 401 with a message indicating expiration.
5. THE Summary_API SHALL verify the JWT using `jose` with the `SSO_SECRET` environment variable.
6. THE Summary_API SHALL compute `totalAsistencias` as the total count of documents in `attendance_records` for area `'cultura'`.
7. THE Summary_API SHALL compute `participantesUnicos` as the count of distinct `numeroDocumento` values across all `attendance_records` for area `'cultura'`.
8. THE Summary_API SHALL compute `gruposActivos` as the total count of documents returned by `getAllCulturalGroups('cultura')`.
9. THE Summary_API SHALL compute `asistenciasMesActual` as the count of `attendance_records` whose `timestamp` falls within the current calendar month.
10. THE Summary_API SHALL compute `asistenciasMesAnterior` as the count of `attendance_records` whose `timestamp` falls within the immediately preceding calendar month.
11. THE Summary_API SHALL compute `porGenero` by counting `attendance_records` grouped by the `genero` field of the associated user, mapping values to `{ mujer, hombre, otro }`.
12. THE Summary_API SHALL compute `porEstamento` by counting `attendance_records` grouped by the `estamento` field of the associated user, producing a `Record<string, number>`.
13. THE Summary_API SHALL compute `top5Grupos` as the 5 cultural groups with the highest total attendance count, sorted descending.
14. THE Summary_API SHALL compute `gruposBajos` as the 5 cultural groups with the lowest attendance count in the current month (excluding groups with zero records only if all groups have zero), sorted ascending.
15. THE Summary_API SHALL compute `tendencia6Meses` as an array of 6 objects `{ mes: string, total: number }` where `mes` is in `YYYY-MM` format, covering the 6 most recent calendar months including the current one, sorted chronologically.
16. THE Summary_API SHALL use `getAttendanceRecords('cultura')` and `getAllCulturalGroups('cultura')` from `asistencias_area/lib/db-router.ts` to read data.

---

### Requirement 2: API aggregator en cdr-landing

**User Story:** Como administrador, quiero que `cdr-landing` actúe como proxy seguro hacia la Summary_API, para que el cliente nunca maneje el `SSO_SECRET` ni credenciales de Firestore.

#### Acceptance Criteria

1. WHEN a `GET` request is received at `/api/platforms/asistencias-summary` with a valid Firebase ID Token in the `Authorization: Bearer` header, THE Aggregator_API SHALL return the `DashboardSummary` JSON with HTTP 200.
2. WHEN the Firebase ID Token is missing or invalid, THE Aggregator_API SHALL return HTTP 401.
3. THE Aggregator_API SHALL verify the Firebase ID Token using `adminAuth` from `cdr-landing/lib/firebase-admin.ts`.
4. THE Aggregator_API SHALL generate a server-to-server SSO_JWT signed with `SSO_SECRET`, with `role: 'SUPER_ADMIN'` and expiration of 30 seconds.
5. THE Aggregator_API SHALL call `${NEXT_PUBLIC_URL_ASISTENCIAS}/api/dashboard-summary` with the generated SSO_JWT in the `Authorization: Bearer` header.
6. WHEN the Summary_API returns an error, THE Aggregator_API SHALL propagate the error status and message to the client.
7. THE Aggregator_API SHALL NOT expose `SSO_SECRET` or Firebase Admin credentials to the client.

---

### Requirement 3: Sidebar reutilizable

**User Story:** Como administrador, quiero un sidebar fijo con navegación clara, para que pueda moverse entre secciones del dashboard sin perder contexto.

#### Acceptance Criteria

1. THE Sidebar SHALL be implemented as a React component in `cdr-landing/components/dashboard-sidebar.tsx` using CSS Modules.
2. THE Sidebar SHALL have a fixed position on the left side with width 240 px and background color `#0A2540`.
3. THE Sidebar SHALL display the CampusFlow logo and hexagon icon at the top.
4. THE Sidebar SHALL display a navigation section labeled "Dashboards" containing an item "Asistencias" with a chart icon that navigates to `/dashboard`.
5. THE Sidebar SHALL display a navigation section labeled "Plataformas" containing an item "Ver todas" that navigates to `/dashboard/plataformas`.
6. THE Sidebar SHALL visually highlight the currently active navigation item.
7. THE Sidebar SHALL display a user chip at the bottom showing the user's initials, display name, and role label.
8. THE Sidebar SHALL display a logout button at the bottom that calls Firebase `signOut` and redirects to `/login`.
9. WHEN the viewport width is 900 px or less, THE Sidebar SHALL be hidden.

---

### Requirement 4: Rediseño del Dashboard_Page

**User Story:** Como administrador, quiero que `/dashboard` muestre el resumen de asistencias con el nuevo layout de sidebar, para tener una vista analítica centralizada.

#### Acceptance Criteria

1. THE Dashboard_Page SHALL render the Sidebar component on the left and a main content area with `margin-left: 240px`.
2. THE Dashboard_Page SHALL display a topbar with the title "Asistencias" and a button "Abrir Asistencias" on the right.
3. WHEN the "Abrir Asistencias" button is clicked, THE Dashboard_Page SHALL open the `asistencias_cultura` platform via SSO using the existing `handleModuleClick` pattern.
4. THE Dashboard_Page SHALL fetch data from `/api/platforms/asistencias-summary` using the Firebase ID Token obtained from `auth.currentUser.getIdToken()`.
5. WHILE data is loading, THE Dashboard_Page SHALL display Skeleton placeholders for all KPI cards and charts.
6. WHEN the fetch fails, THE Dashboard_Page SHALL display an error message and a "Reintentar" button that re-triggers the fetch.
7. THE Dashboard_Page SHALL display 4 KPI_Cards in a row: "Total asistencias", "Participantes únicos", "Grupos activos", and "Asistencias este mes".
8. THE KPI_Card for "Asistencias este mes" SHALL display a variation badge showing the percentage change versus the previous month (e.g., "+12%"), colored green for positive and red for negative.
9. THE Dashboard_Page SHALL display a pie chart showing attendance distribution by gender using colors: pink (`#ec4899`) for mujer, blue (`#3b82f6`) for hombre, purple (`#8b5cf6`) for otro.
10. THE Dashboard_Page SHALL display a pie chart showing attendance distribution by estamento.
11. THE Dashboard_Page SHALL display a horizontal bar chart showing the top 5 cultural groups by total attendance, using color `#2563EB`.
12. THE Dashboard_Page SHALL display a horizontal bar chart showing the 5 cultural groups with the lowest attendance this month, using color `#f97316`.
13. THE Dashboard_Page SHALL display a full-width line chart showing attendance trend over the last 6 months.
14. THE Dashboard_Page SHALL use only Recharts for all charts (no additional charting libraries).
15. THE Dashboard_Page SHALL use CSS Modules exclusively for styling (no Tailwind, no inline styles).
16. WHEN the user is not authenticated or has a role other than `'admin'`, THE Dashboard_Page SHALL redirect to the appropriate route (existing auth guard behavior).

---

### Requirement 5: Página de Plataformas

**User Story:** Como administrador, quiero una página dedicada que liste todas mis plataformas asignadas, para acceder a ellas con SSO desde el mismo layout con sidebar.

#### Acceptance Criteria

1. THE Platforms_Page SHALL be created at `cdr-landing/app/dashboard/plataformas/page.tsx` and render the Sidebar component.
2. THE Platforms_Page SHALL display a topbar with the title "Plataformas".
3. THE Platforms_Page SHALL display the module cards filtered by `user.platforms` (same logic as the current `availableModules` filter in `dashboard/page.tsx`).
4. WHEN a module card is clicked, THE Platforms_Page SHALL open the platform via SSO using the same `handleModuleClick` logic as the current dashboard.
5. THE Platforms_Page SHALL use CSS Modules exclusively for styling.
6. WHEN the user is not authenticated or has a role other than `'admin'`, THE Platforms_Page SHALL redirect to the appropriate route.
