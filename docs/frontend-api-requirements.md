# Frontend API requirements

Copy this file into the backend repo and implement against it. Source: karate tournament frontend (`karate-tournament-fe`). Auth is **Auth0 JWT** on every endpoint unless marked **public**. After each change, keep OpenAPI (`/docs-json`) in sync — the frontend regenerates its client from that.

## Roles

`UserResponseDto.roles` values:

`admin` | `club_owner` | `club_coach` | `club_member` | `free_member` | `judge`

Frontend resolves the dashboard from the first match: admin → club_owner / club_coach → club_member → judge → free_member.

## Implementation order

| Priority | Work | Why |
| --- | --- | --- |
| **P0** | [§1 First login upsert + invite profile data](#1-p0-first-login-user-upsert-and-invitation-profile-data) | New users infinite-load after Auth0 until they refresh; invitee name/email never appear on the profile modal |
| **P1** | [§2 Club-scoped invitation list](#2-p1-club-scoped-invitation-list) | Club owner/coach dashboards error if `GET /invitations` is admin-only |
| **P1** | [§3 Registrations / tournaments for free members](#3-p1-tournaments-the-user-registered-for) | Free-member dashboard currently lists **all** tournaments |
| **P2** | [§4 Club-scoped categories](#4-p2-club-scoped-categories) | Club staff see the global category catalog |
| **P2** | [§5 Invite to an existing club + accept-by-role](#5-p2-invite-to-an-existing-club--accept-by-role) | Invites exist only as a side-effect of `POST /clubs` |
| **P2** | [§6 Team registrations](#6-p2-team-registrations-kata-team--kumite-team) | Public bulk register already sends `teams[]`; API may ignore it today |
| **P3** | [§7 Auth tightening](#7-p3-authorization-tightening) | Club staff hitting admin-only or global lists |

Existing endpoints the frontend already calls must keep working. Confirm they are allowed for the roles that now hit them, not only `admin` — see [§8](#8-what-the-frontend-already-uses).

---

## 1. P0 — First login, user upsert, and invitation profile data

### Problem

Signup is Auth0. Immediately after the callback the frontend:

1. `GET /users/me`
2. If there is a pending invite token: `POST /invitations/:token/accept`
3. Opens a complete-profile modal that **prefills `firstName`, `lastName`, `email` from those responses**

Today:

- First `GET /users/me` often `404` / `401` because the app user does not exist yet → user must **refresh**.
- Invitation `firstName` / `lastName` / `email` (set when the club/invite was created) are not copied onto the user → modal is empty.

### 1.1 Upsert on first authenticated `GET /users/me` (required)

The first authenticated `GET /users/me` **must create the user from the Auth0 JWT** if none exists (lazy upsert).

A dedicated `POST /users/sync` is acceptable **only if** the frontend would not need a second round-trip after Auth0. Prefer upsert inside `GET /users/me`.

On create:

- `auth0Id` ← JWT `sub`
- `email` ← JWT email claim. **Must be returned on `GET /users/me`.** Must not be null after first login.
- `firstName` / `lastName` ← JWT `given_name` / `family_name` when present and the user fields are empty

| Status | When |
| --- | --- |
| `200` | User found **or just created**. Body: `UserResponseDto` including `email` |
| `401` | Missing/invalid JWT only — **not** “user not in our DB yet” |

Do **not** return `404` for a valid JWT whose user row has not been inserted.

`PUT /users/me` (`UpdateUserDto`, all fields optional) stays the save path for the complete-profile modal:

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "gender": "female",
  "dateOfBirth": "2000-07-07T00:00:00.000Z",
  "weight": 62.5,
  "beltLevel": "1-kyu"
}
```

`gender`: `male` | `female` | `other`  
`beltLevel`: `10-kyu` … `1-kyu`, `1-dan` … `10-dan`  
`dateOfBirth`: ISO-8601 datetime with offset (same as `UserResponseDto`)

Optional modal fields are **omitted** when empty; do not require them.

`UserResponseDto` (keep existing shape; `email` must be populated after upsert):

| Field | Type |
| --- | --- |
| `id` | string |
| `auth0Id` | string |
| `clubId` | string \| null |
| `firstName` | string \| null |
| `lastName` | string \| null |
| `email` | string \| null |
| `gender` | `male` \| `female` \| `other` \| null |
| `dateOfBirth` | ISO-8601 datetime \| null |
| `weight` | number \| null |
| `beltLevel` | belt enum \| null |
| `roles` | role enum[] |
| `club` | `ClubResponseDto` \| null |
| `createdAt` / `updatedAt` | ISO-8601 datetime |

### 1.2 Copy invitation identity on accept (required)

```
POST /invitations/:token/accept
```

Authenticated. After linking club + role, copy invitation fields onto the user **only when the user field is empty**:

| Invitation | User |
| --- | --- |
| `firstName` | `firstName` |
| `lastName` | `lastName` |
| `email` | `email` |

Do not overwrite values already set by the JWT upsert or by the user.

Response already includes `{ user: UserResponseDto, club: ClubResponseDto }`. `user` **must** contain the copied fields. A following `GET /users/me` must return the same.

Also: assign the **invitation’s role**, not always `club_owner`. (Club-create invites may still be owner; member/coach invites must not promote to owner.) See [§5](#5-p2-invite-to-an-existing-club--accept-by-role).

### 1.3 Public by-token preview includes invitee identity (required)

```
GET /invitations/by-token/:token
```

**Public.** The token in the URL is the secret.

Extend `InvitationByTokenResponseDto`:

| Field | Type | Notes |
| --- | --- | --- |
| `clubName` | string | Unchanged |
| `expiresAt` | ISO-8601 datetime | Unchanged |
| `status` | `pending` \| `accepted` \| `expired` \| `cancelled` | Unchanged |
| `email` | string | Invitee email. Frontend uses this as Auth0 `login_hint` and shows it on the invite page |
| `firstName` | string \| null | From create-invite / `POST /clubs` `ownerFirstName` |
| `lastName` | string \| null | From create-invite / `POST /clubs` `ownerLastName` |

`404` only if the token is unknown. Expired / cancelled / accepted invites still return `200` with `status` so the frontend can show “no longer valid”.

### P0 acceptance

- Sign up in Auth0 → land in the app → `GET /users/me` is `200` on the **first** request. No refresh.
- Response includes `email` from the Auth0 account.
- Open `/invite/{token}` for a pending invite created with name+email → preview shows those fields.
- After accept, `user.firstName` / `lastName` / `email` match the invitation when the user had them empty.
- `PUT /users/me` with only name+email (optional athlete fields omitted) returns `200` and persists.

Keep working: `POST /clubs` with `ownerEmail` (+ optional `ownerFirstName` / `ownerLastName`) still creates an invitation and returns `inviteUrl` on `ClubResponseDto`.

---

## 2. P1 — Club-scoped invitation list

### Problem

Club owner/coach dashboards list invitations for `user.clubId`. The only list endpoint is:

```
GET /invitations
```

Client description: all invitations, newest first. If this is admin-only, the club dashboard section errors.

`/invitations/` in the UI stays admin-only. Club staff must list **their club’s** invitations from `/dashboard/` and my-club.

### Required: list for a club

**Option A (preferred)** — same path, optional filter:

```
GET /invitations
GET /invitations?clubId={uuid}
```

| Caller | `clubId` query | Result |
| --- | --- | --- |
| `admin` | omitted | All invitations, newest first (today) |
| `admin` | present | That club |
| `club_owner` / `club_coach` | omitted | Caller’s club (`user.clubId`) |
| `club_owner` / `club_coach` | own club | Same |
| `club_owner` / `club_coach` | other club | `403` |
| Other roles | any | `403` |

**Option B:** `GET /clubs/:id/invitations` with the same auth as `GET /clubs/:id/members`.

Response: `InvitationListItemDto[]` (newest first):

| Field | Type |
| --- | --- |
| `id` | uuid |
| `clubId` | uuid |
| `clubName` | string |
| `token` | string (frontend copies `{origin}/invite/{token}/`) |
| `email` | string |
| `firstName` | string \| null |
| `lastName` | string \| null |
| `status` | `pending` \| `accepted` \| `expired` \| `cancelled` |
| `createdAt` | ISO-8601 datetime |
| `expiresAt` | ISO-8601 datetime |
| `acceptedAt` | ISO-8601 datetime \| null |

Empty list: `200` `[]`, not `404`.

---

## 3. P1 — Tournaments the user registered for

### Problem

Free-member dashboard should show **tournaments they signed up for**. There is no registrations-by-user query. Frontend currently shows **all** tournaments via `GET /tournaments`.

Judge dashboard can keep `GET /tournaments` (all).

### Required: current user’s registrations

```
GET /registrations/me
```

Any authenticated user. Never another user’s rows.

Optional query: `tournamentId` (uuid), `status` (`pending` | `approved` | `rejected`).

Response `200`: `RegistrationResponseDto[]` (newest first), including nested `user` / `club` as today.

### Required: tournament list for the free-member dashboard

**Option A (preferred)**

```
GET /tournaments/registered
```

`TournamentResponseDto[]` — distinct tournaments where the caller has at least one registration (any status). Sort: `startDate` descending (or same as `GET /tournaments`).

**Option B** (do not pick unless A is delayed): FE would N+1 `GET /tournaments/:id` from `GET /registrations/me`.

| Role | `GET /tournaments` | `GET /tournaments/registered` |
| --- | --- | --- |
| `admin` | All | Optional |
| `club_owner` / `club_coach` | All or own club | Not used by dashboard |
| `judge` | All | Not used |
| `free_member` | Should not be required for dashboard once `/registered` exists | **Used** |
| `club_member` | Not used on dashboard | Optional later |

---

## 4. P2 — Club-scoped categories

### Problem

`CategoryResponseDto` has **no `clubId`**. Club owner/coach load `GET /categories` (global catalog). Product intent: clubs own their catalog; admins keep a global/shared catalog.

### Model

Add nullable ownership:

| Field | Type | Meaning |
| --- | --- | --- |
| `clubId` | uuid \| null | `null` = global. Set = owned by that club |

Include `clubId` on **`CategoryResponseDto`**. Frontend will regenerate the client.

Existing fields stay (`name`, `discipline`, `subDiscipline`, `gender`, age/weight/belt limits, `teamSize`, `teamReservesSize`, timestamps).

### List

```
GET /categories
GET /categories?clubId={uuid}
```

| Caller | Query | Result |
| --- | --- | --- |
| `admin` | omitted | All (global + every club). Preferred. |
| `admin` | `clubId` | That club only |
| `admin` | `clubId` empty / `global=true` | Global (`clubId` null) |
| `club_owner` / `club_coach` | omitted or own club | **Only** `clubId` = caller’s club |
| `club_owner` / `club_coach` | other club | `403` |
| Other roles | — | `403` |

Do not mix another club’s categories into a club user’s list.

### Create / update / delete / duplicate

```
POST /categories
PUT /categories/:id
POST /categories/create-and-assign
POST /categories/duplicate
```

Create body: existing `CreateCategoryDto` plus optional `clubId`.

| Caller | `clubId` on create |
| --- | --- |
| `admin` | Optional. Omit/null → global. Set → that club |
| `club_owner` | Must be caller’s club (or omit and set from `user.clubId`). **Must not** create global categories |
| `club_coach` | `403` on mutations until product asks otherwise. Coaches may `GET` |

- Admin: any category
- `club_owner`: only `clubId` = their club
- `403` if a club user targets a global category or another club’s category
- `409` on delete if the category is assigned to a tournament (keep current rollback for bulk delete)

`create-and-assign` must persist `clubId` the same way as `POST /categories`, then assign to the tournament.

### Assign to tournament

```
PUT /tournaments/:id/categories
Body: { "categoryIds": ["..."] }
```

A tournament of club A may only be assigned **global** categories or categories owned by club A. `400` if any `categoryId` belongs to another club. Array order remains display order.

---

## 5. P2 — Invite to an existing club + accept-by-role

Invitations are created today only via `POST /clubs` (`ownerEmail`). Club staff cannot invite someone to a club that already exists.

```
POST /clubs/:id/invitations
```

**Auth:** `admin`, or `club_owner` / `club_coach` of `:id`.

```json
{
  "email": "member@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "club_member"
}
```

| Field | Required | Notes |
| --- | --- | --- |
| `email` | yes | Invitee email |
| `firstName` | no | Copied onto the user on accept (see §1.2) |
| `lastName` | no | Same |
| `role` | no | Default `club_member`. Allowed: `club_owner`, `club_coach`, `club_member` |

**Response `201`:** `InvitationListItemDto` **plus** `inviteUrl` (absolute or path), same idea as `ClubResponseDto.inviteUrl`.

`POST /invitations/:token/accept` must assign the role stored on the invitation (not always `club_owner`).

Conflicts:

- `409` if a **pending** invitation already exists for that email + club
- `409` if the email is already a member of that club

### Optional: cancel

```
POST /invitations/:id/cancel
```

or `DELETE /invitations/:id`

Admin, or owner/coach of the invitation’s club. Sets `status` to `cancelled`. `400` if not `pending`.

---

## 6. P2 — Team registrations (kata-team / kumite-team)

Public bulk register currently sent only `participants[].registrations: [{ categoryId }]`. That cannot express teams, starters vs reserves, or duplicate rosters.

The frontend **already sends** optional `teams` on `POST /registrations/public/bulk`. Prefer accepting and validating it. Do not 400 on unknown `teams` by treating it as an illegal property.

### Request

Keep `participants[]` for identity (and for **individual** category registrations). Add:

```json
{
  "email": "coach@club.com",
  "firstName": "Jane",
  "lastName": "Coach",
  "clubName": "Dragon Karate Club",
  "tournamentId": "…",
  "participants": [
    {
      "firstName": "A",
      "lastName": "One",
      "weight": 40,
      "dateOfBirth": "2018-02-02T00:00:00.000Z",
      "gender": "male",
      "beltLevel": "10-kyu",
      "registrations": []
    }
  ],
  "teams": [
    {
      "categoryId": "…",
      "starters": [{ "participantIndex": 0 }, { "participantIndex": 1 }, { "participantIndex": 2 }],
      "reserves": [{ "participantIndex": 3 }]
    }
  ]
}
```

| Field | Rules |
| --- | --- |
| `participants[].registrations` | Individual categories only (`kata`, `yako-soku-kumite`, `yiju-kumite`, …). May be `[]` when the person is **only** on teams |
| `teams[].categoryId` | Must belong to the tournament. Discipline `kata-team` or `kumite-team`, with `teamSize` set |
| `teams[].starters` | Length **must equal** `category.teamSize`. `participantIndex` indexes `participants` in this request |
| `teams[].reserves` | Length `0..teamReservesSize` (`0` if `teamReservesSize` is null). Optional |
| Team membership | Comes **only** from `teams`. Do not also require those people in `participants[].registrations` for that category |

Shared members across teams are allowed (`[A B C]`, `[A D E]`). The same **set** of people twice in the same category is not.

### Validation

- Category exists on the tournament and is a team discipline with `teamSize > 0`
- No duplicate person on the same team (starter or reserve)
- Unique roster in the same category: same set of participants (starters ∪ reserves, order-independent). Compare this request **plus** already stored teams for this tournament
- Each member eligible (same rules as suitable-participants: age, and gender when the category has one)
- `400` with a clear message for duplicate roster, roster size, or ineligible member

### Persistence and reads

- Store a **team** entity per category: starters, reserves, linked registrations
- `RegistrationResponseDto` should include optional `teamId` and `teamRole`: `"starter" | "reserve"`
- `GET /registrations/by-tournament` (and similar lists) should expose team grouping so UIs can show Team 1 / Team 2, not only a flat attendee list

Keep per-registration `results` (partial success). When a row belongs to a team, include `teamId` / `teamRole` on the created `registration`. Bulk result items may stay indexed by `participantIndex`; add `teamIndex` if useful.

---

## 7. P3 — Authorization tightening

| Endpoint | admin | club_owner | club_coach | club_member | free_member | judge |
| --- | --- | --- | --- | --- | --- | --- |
| `GET /clubs` | yes | no | no | no | no | no |
| `GET /clubs/:id` | yes | own club | own club | own club | no | no |
| `GET/POST /clubs/:id/members` | yes | own club | own club | no | no | no |
| `GET /clubs/:id/tournaments` | yes | own club | own club | own club | no | no |
| `GET /invitations` | all / filter | own club | own club | no | no | no |
| `POST /clubs/:id/invitations` | yes | own club | own club | no | no | no |
| `GET /categories` | all / filter | own club | own club (read) | no | no | no |
| `POST/PUT/DELETE /categories` | yes | own club | no (see §4) | no | no | no |
| `GET /tournaments` | all | all or own club | all or own club | no | no (use registered) | all |
| `GET /tournaments/registered` | yes | yes | yes | yes | **yes** | yes |
| `GET /registrations/me` | yes | yes | yes | yes | **yes** | yes |
| `GET /registrations/by-tournament` | yes | own tournament/club | own tournament/club | no | no | TBD |

`GET /registrations/by-tournament` is used on the tournament detail page. Club staff managing their tournament must be allowed; do not leave it admin-only.

Create tournament (`POST /tournaments`): frontend shows create for `admin` and `club_owner` only.

- `admin`: `clubId` optional
- `club_owner`: force `clubId` to caller’s club (ignore or `403` a different id)
- `club_coach` / others: `403`

Navbar still sends owners/coaches to `/tournaments/` (`GET /tournaments`). If product wants “only my club’s tournaments” there, reuse `GET /clubs/:id/tournaments` (already used on my-club). Not required to unblock dashboards.

---

## 8. What the frontend already uses

Confirm these are allowed for the roles that now hit them:

| Surface | Roles | Call | Expected |
| --- | --- | --- | --- |
| Admin dashboard — clubs | `admin` | `GET /clubs` | Unchanged. Admin-only |
| Admin dashboard — tournaments | `admin` | `GET /tournaments` | Unchanged. All |
| Club staff dashboard — members | `club_owner`, `club_coach` | `GET /clubs/:id/members` | Owner/coach of that club (and admin). `403` otherwise |
| Club staff — add member | `club_owner`, `club_coach` | `POST /clubs/:id/members` | Same |
| Club profile | `club_member` (also owner/coach on my-club) | `GET /clubs/:id` | Any member of that club (and admin) |
| Club tournaments (my-club) | club users | `GET /clubs/:id/tournaments` | Members of that club (and admin) |
| Categories page | `admin`, `club_owner`, `club_coach` | `GET /categories` (+ mutate) | Today all categories → [§4](#4-p2-club-scoped-categories) |
| Tournaments page | `admin`, `club_owner`, `club_coach`; judge/free_member via dashboard | `GET /tournaments` | Today all → [§3](#3-p1-tournaments-the-user-registered-for) for free members |
| Invitations (dashboard + my-club) | `club_owner`, `club_coach`; admin via `/invitations/` | `GET /invitations` | Today all → [§2](#2-p1-club-scoped-invitation-list) |

---

## 9. Error conventions

Same JSON error shape as the rest of the API.

| Status | When |
| --- | --- |
| `400` | Validation (missing email, category from another club assigned to a tournament, cancel non-pending invite, team roster/duplicate) |
| `401` | Missing/invalid JWT |
| `403` | Authenticated but wrong role or another club’s resource |
| `404` | Unknown club / category / invitation / tournament / unknown invite token |
| `409` | Duplicate pending invite, user already in club, category in use on delete |

Empty lists are `200` with `[]`, not `404`.

---

## 10. Out of scope for this spec

- Category-by-category registration wizard (frontend-only; uses existing suitable-participants APIs)
- Pagination (lists are unbounded today)
- New UI for creating invitations (frontend will follow once `POST /clubs/:id/invitations` exists)
