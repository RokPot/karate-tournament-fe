# Backend specifications — role-specific dashboards

Frontend plan: **Role-specific dashboard views** (`role_dashboard_views_aa86ea8c`). The frontend already ships those views; this spec is only the backend work that was left out of scope.

The frontend already ships role-aware `/dashboard/` views and navbar links. Missing APIs currently **fall back** (all invitations, all categories, all tournaments). This document specifies the backend support needed to remove those fallbacks.

Auth is Auth0 JWT on all endpoints unless marked **public**. Role values match `UserResponseDto.roles`:

`admin` | `club_owner` | `club_coach` | `club_member` | `free_member` | `judge`

Role resolution on the frontend (first match): admin → club_owner/club_coach → club_member → judge → free_member.

---

## 1. What the frontend already uses (keep working)

These endpoints exist in the generated FE client. Confirm they are allowed for the roles that now hit them, not only `admin`.

| Surface | Roles | Current call | Expected BE behaviour |
| --- | --- | --- | --- |
| Admin dashboard — clubs | `admin` | `GET /clubs` | Unchanged. Admin-only. |
| Admin dashboard — tournaments | `admin` | `GET /tournaments` | Unchanged. All tournaments. |
| Club staff dashboard — members | `club_owner`, `club_coach` | `GET /clubs/:id/members` | **Must allow** owner/coach of that club (and admin). `403` if `id` is not the caller’s club. |
| Club staff — add member | `club_owner`, `club_coach` | `POST /clubs/:id/members` | Same as members list. |
| Club profile | `club_member` (also owner/coach on my-club) | `GET /clubs/:id` | **Must allow** any member of that club (and admin). |
| Club tournaments (my-club) | club users | `GET /clubs/:id/tournaments` | **Must allow** members of that club (and admin). |
| Categories page | `admin`, `club_owner`, `club_coach` | `GET /categories` (+ create/update/delete/duplicate) | Today returns **all** categories. See [§3](#3-club-scoped-categories). |
| Tournaments page | `admin`, `club_owner`, `club_coach`; judge/free_member via dashboard | `GET /tournaments` | Today returns **all** tournaments. See [§4](#4-tournaments-the-user-registered-for) for free members. |
| Invitations (dashboard + my-club) | `club_owner`, `club_coach`; admin via `/invitations/` | `GET /invitations` | Today “all invitations, newest first”. Likely admin-only. See [§2](#2-club-scoped-invitations). |

Existing invitation flows to keep:

- `POST /clubs` with `ownerEmail` → creates invitation, returns `inviteUrl` on `ClubResponseDto`
- `GET /invitations/by-token/:token` — **public** (must also return invitee identity — see [§10](#10-first-login-user-provisioning-and-invitation-profile-data))
- `POST /invitations/:token/accept` — authenticated; links user to club **and** copies invitation name/email onto the user (see [§10](#10-first-login-user-provisioning-and-invitation-profile-data))

---

## 2. Club-scoped invitations

### Problem

Club owner/coach dashboards render invitations for `authUser.clubId`. The only list endpoint is:

```
GET /invitations
```

Description in the FE client: *Retrieves a list of all invitations, newest first. Requires Auth0 JWT.*

The FE filters the full list client-side by `clubId`. If this endpoint is admin-only, the club dashboard section errors while members still load.

`/invitations/` stays **admin-gated in the UI**. Club staff must be able to list **their club’s** invitations from `/dashboard/` and my-club.

### Required: list invitations for a club

Prefer extending the existing list rather than a one-off shape.

**Option A (preferred)** — same path, optional filter:

```
GET /invitations
GET /invitations?clubId={uuid}
```

| Caller | `clubId` query | Result |
| --- | --- | --- |
| `admin` | omitted | All invitations, newest first (today’s behaviour) |
| `admin` | present | Invitations for that club |
| `club_owner` / `club_coach` | omitted | Invitations for **the caller’s club** (`user.clubId`) |
| `club_owner` / `club_coach` | present and equals caller’s club | Same as omitted |
| `club_owner` / `club_coach` | present and **other** club | `403` |
| Other roles | any | `403` |

**Option B** — nested resource (also acceptable):

```
GET /clubs/:id/invitations
```

Same authorization as `GET /clubs/:id/members`. Admin may call any `:id`.

### Response

Reuse `InvitationListItemDto[]` (newest first):

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` (uuid) | |
| `clubId` | `string` (uuid) | |
| `clubName` | `string` | |
| `token` | `string` | Used by FE to copy `{origin}/invite/{token}/` |
| `email` | `string` | |
| `firstName` | `string \| null` | |
| `lastName` | `string \| null` | |
| `status` | `pending` \| `accepted` \| `expired` \| `cancelled` | |
| `createdAt` | ISO-8601 datetime | |
| `expiresAt` | ISO-8601 datetime | |
| `acceptedAt` | ISO-8601 datetime \| null | |

Status codes: `200`, `401`, `403`, `404` (unknown club on option B).

### Strongly recommended: create invitation for an existing club

Invitations are created today only via `POST /clubs` (`ownerEmail`). Club staff have no way to invite someone to a club that already exists.

```
POST /clubs/:id/invitations
```

**Auth:** `admin`, or `club_owner` / `club_coach` of `:id`.

**Body:**

```json
{
  "email": "owner@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "club_member"
}
```

| Field | Required | Notes |
| --- | --- | --- |
| `email` | yes | Invitee email |
| `firstName` | no | |
| `lastName` | no | |
| `role` | no | Default `club_member`. Allowed: `club_owner`, `club_coach`, `club_member`. |

**Response `201`:** `InvitationListItemDto` **plus** `inviteUrl` (absolute or path the FE can show/copy), same idea as `ClubResponseDto.inviteUrl`.

Accept behaviour: `POST /invitations/:token/accept` must assign the role from the invitation (not always `club_owner`). Today the generated client says accept “assigns club owner role” — that is wrong for member/coach invites.

Conflicts:

- `409` if a **pending** invitation already exists for that email + club
- `409` if the email is already a member of that club

### Optional: cancel invitation

```
POST /invitations/:id/cancel
```

or `DELETE /invitations/:id`

**Auth:** admin, or owner/coach of the invitation’s club. Sets `status` to `cancelled`. `400` if not `pending`.

---

## 3. Club-scoped categories

### Problem

`CategoryResponseDto` has **no `clubId`**. Club owner/coach now have Categories in the navbar and load `GET /categories` (global catalog).

Product intent: clubs have **their own** category catalog (custom categories bound to the club). Admins keep a global/shared catalog (or can see all clubs).

### Model

Add nullable ownership to the category:

| Field | Type | Meaning |
| --- | --- | --- |
| `clubId` | `string` (uuid) \| `null` | `null` = global/admin catalog. Set = owned by that club. |

Include `clubId` on **`CategoryResponseDto`** so list/create/update responses stay consistent. Frontend will regenerate the client from OpenAPI.

Existing category fields stay as they are (`name`, `discipline`, `subDiscipline`, `gender`, age/weight/belt limits, `teamSize`, `teamReservesSize`, timestamps).

### List

```
GET /categories
GET /categories?clubId={uuid}
```

| Caller | Query | Result |
| --- | --- | --- |
| `admin` | omitted | All categories (global + every club), or global-only — pick one and document it. **Preferred:** all, newest / name order as today. |
| `admin` | `clubId` | That club’s categories only |
| `admin` | `clubId` empty / `global=true` | Global categories (`clubId` null) |
| `club_owner` / `club_coach` | omitted | **Only** categories where `clubId` = caller’s club |
| `club_owner` / `club_coach` | `clubId` of own club | Same |
| `club_owner` / `club_coach` | other club | `403` |
| Other roles | — | `403` (categories UI is not shown to them) |

Do **not** mix another club’s categories into a club user’s list.

### Create / update

```
POST /categories
PUT /categories/:id
POST /categories/create-and-assign
POST /categories/duplicate
```

**Create body:** existing `CreateCategoryDto` plus:

```json
{
  "clubId": "123e4567-e89b-12d3-a456-426614174000"
}
```

| Caller | `clubId` on create |
| --- | --- |
| `admin` | Optional. Omit/`null` → global category. Set → that club. |
| `club_owner` | Must be the caller’s club (or omit and BE sets it from `user.clubId`). **Must not** create global categories. |
| `club_coach` | Same as owner for create **if** you want coaches to manage the catalog. Frontend **create/edit/delete** buttons are currently **admin + club_owner only**; coaches can **view**. Either: (a) coaches get `GET` only, or (b) FE is updated later to let coaches mutate. BE should still **reject** coach mutations with `403` until product asks otherwise. |

**Update / delete / duplicate:**

- Admin: any category
- `club_owner`: only categories with `clubId` = their club
- `403` if a club user targets a global category or another club’s category
- `409` on delete if the category is assigned to a tournament (keep current rollback behaviour for `DELETE /categories` bulk)

`create-and-assign` must persist `clubId` the same way as `POST /categories`, then assign to the tournament.

### Assigning categories to a tournament

Existing:

```
PUT /tournaments/:id/categories
Body: { "categoryIds": ["..."] }
```

Rules:

- A tournament belonging to club A may only be assigned categories that are **global** (`clubId` null) **or** owned by club A.
- `400` if any `categoryId` belongs to another club.
- Array order remains display order (`categoryIds` on `TournamentResponseDto`).

When club users open the add-category modal they will list `GET /categories` (their club catalog). After this change they will no longer see every club’s categories.

---

## 4. Tournaments the user registered for

### Problem

Free-member dashboard should show **tournaments they signed up for**. There is no registrations-by-user query. FE currently shows **all** tournaments via `GET /tournaments` (`TournamentsList` / `TournamentResponseDto[]`).

Judge dashboard can keep **all** tournaments (`GET /tournaments`) — they need the full list to officiate.

### Required: current user’s registrations

```
GET /registrations/me
```

**Auth:** any authenticated user. Never returns another user’s rows.

**Query (optional):**

| Param | Type | Notes |
| --- | --- | --- |
| `tournamentId` | uuid | Filter to one tournament |
| `status` | `pending` \| `approved` \| `rejected` | |

**Response `200`:** `RegistrationResponseDto[]` (newest first), including nested `user` / `club` as today.

`RegistrationResponseDto` already has `tournamentId`, `categoryId`, `status`, `finalWeight`. That is enough for a later “my registrations” detail view.

### Required: tournaments derived for the free-member dashboard

The dashboard table is a **tournament** list, not a registration list. Add one of:

**Option A (preferred for current UI)**

```
GET /tournaments/registered
```

Returns `TournamentResponseDto[]` — distinct tournaments where the caller has at least one registration (any status). Sort: `startDate` descending (or same as `GET /tournaments`).

**Option B**

FE derives unique `tournamentId`s from `GET /registrations/me` and then `GET /tournaments/:id` per id. Do **not** choose this unless A is delayed; N+1 is worse for the dashboard.

### Authorization notes

| Role | `GET /tournaments` | `GET /tournaments/registered` |
| --- | --- | --- |
| `admin` | All | Optional; not used by FE |
| `club_owner` / `club_coach` | All **or** tournaments for their club — see note | Not used |
| `judge` | All (dashboard) | Not used |
| `free_member` | Should **not** be required for dashboard once `/registered` exists | **Used by dashboard** |
| `club_member` | Not used on dashboard | Optional later |

**Note (club staff tournaments page):** navbar sends owners/coaches to `/tournaments/`, which still calls `GET /tournaments` (all). If product wants “only my club’s tournaments” there, reuse existing `GET /clubs/:id/tournaments` (already on my-club). Not required to ship the dashboard fallbacks, but worth aligning: club staff list = club tournaments; admin = all.

Create tournament (`POST /tournaments`): FE shows create for `admin` and `club_owner` only. BE should:

- `admin`: `clubId` optional
- `club_owner`: force `clubId` to caller’s club (ignore or `403` a different id)
- `club_coach` / others: `403`

---

## 5. Authorization matrix (target)

| Endpoint | admin | club_owner | club_coach | club_member | free_member | judge |
| --- | --- | --- | --- | --- | --- | --- |
| `GET /clubs` | yes | no | no | no | no | no |
| `GET /clubs/:id` | yes | own club | own club | own club | no | no |
| `GET/POST /clubs/:id/members` | yes | own club | own club | no | no | no |
| `GET /clubs/:id/tournaments` | yes | own club | own club | own club | no | no |
| `GET /invitations` | all / filter | own club | own club | no | no | no |
| `POST /clubs/:id/invitations` | yes | own club | own club | no | no | no |
| `GET /categories` | all / filter | own club | own club (read) | no | no | no |
| `POST/PUT/DELETE /categories` | yes | own club | no (see §3) | no | no | no |
| `GET /tournaments` | all | all or own club | all or own club | no | no (use registered) | all |
| `GET /tournaments/registered` | yes | yes | yes | yes | **yes** | yes |
| `GET /registrations/me` | yes | yes | yes | yes | **yes** | yes |
| `GET /registrations/by-tournament` | yes | own tournament/club | own tournament/club | no | no | TBD |

`GET /registrations/by-tournament` is used on the tournament detail page. Club staff managing their tournament must be allowed; do not leave it admin-only.

---

## 6. Error conventions

Use the same JSON error shape as the rest of the API.

| Status | When |
| --- | --- |
| `400` | Validation (missing email, category from another club assigned to tournament, cancel non-pending invite, team roster/duplicate) |
| `401` | Missing/invalid JWT |
| `403` | Authenticated but wrong role or another club’s resource |
| `404` | Unknown club / category / invitation / tournament |
| `409` | Duplicate pending invite, user already in club, category in use on delete |

Empty lists are `200` with `[]`, not `404`.

---

## 7. Out of scope for this spec

- Category-by-category registration wizard (frontend-only; uses existing suitable-participants APIs)
- Pagination (lists are unbounded today; keep the same unless you already paginate elsewhere)
- New UI for creating invitations (FE can follow once `POST /clubs/:id/invitations` exists)

---

## 8. Suggested implementation order

1. **First-login user upsert + invitation profile copy** — see [§10](#10-first-login-user-provisioning-and-invitation-profile-data). Without this, new users spin forever after Auth0 and must refresh; invitee name/email never appear on the profile.
2. **Invitations list auth + club filter** — unblocks club staff dashboard (currently errors if `GET /invitations` is admin-only).
3. **`GET /registrations/me` + `GET /tournaments/registered`** — unblocks free-member dashboard.
4. **Category `clubId` + filtered `GET /categories` + create rules** — unblocks club category catalogs (largest model change).
5. **`POST /clubs/:id/invitations` + accept-by-role** — club staff can invite without creating a new club.
6. Tighten `GET /tournaments` / registrations-by-tournament for club staff vs admin.
7. **Team registrations on `POST /registrations/public/bulk`** — see [§9](#9-team-registrations-kata-team--kumite-team).

After each endpoint is available, the frontend will add query params / new hooks and drop the fallbacks.

---

## 9. Team registrations (kata-team / kumite-team)

Public bulk register currently sends only `participants[].registrations: [{ categoryId }]`. That cannot express teams, starters vs reserves, or duplicate rosters.

The frontend now sends an optional `teams` array on the same `POST /registrations/public/bulk` body. Until this is implemented, the API may ignore `teams` or reject unknown properties — prefer accepting and validating the field.

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
| `participants[].registrations` | Individual categories only (`kata`, `yako-soku-kumite`, `yiju-kumite`, …). May be `[]` when the person is **only** on teams. |
| `teams[].categoryId` | Must belong to the tournament. Discipline must be `kata-team` or `kumite-team`, with `teamSize` set. |
| `teams[].starters` | Length **must equal** `category.teamSize`. `participantIndex` indexes `participants` in this request. |
| `teams[].reserves` | Length **0..teamReservesSize** (`0` if `teamReservesSize` is null). Optional. |
| Team membership | Comes **only** from `teams`. Do not also require those people in `participants[].registrations` for that category. |

Example: `[A B C]`, `[A D E]`, `[D B F]` are all allowed (shared members are fine). `[A B C]` twice is not.

### Validation

- Category exists on the tournament and is a team discipline with `teamSize > 0`.
- No duplicate person on the same team (starter or reserve).
- Unique roster: no two teams in the **same category** may have the same **set** of participants (starters ∪ reserves, order-independent; starter vs reserve roles do not distinguish). Compare this request **plus** already stored teams for this tournament as applicable.
- Each member must be eligible for the category (same rules as suitable-participants: age, and gender when the category has one).
- `400` with a clear message for duplicate roster, roster size, or ineligible member.

### Persistence and reads

- Store a **team** entity per category: starters, reserves, linked registrations.
- `RegistrationResponseDto` should include optional `teamId` and `teamRole`: `"starter" \| "reserve"`.
- `GET /registrations/by-tournament` (and similar lists) should expose team grouping so admin/club UIs can show Team 1 / Team 2, not only a flat attendee list.

### Response

Keep per-registration `results` (partial success). When a row belongs to a team, include `teamId` / `teamRole` on the created `registration` object.

Bulk result items may stay indexed by `participantIndex`; add `teamIndex` if useful.

---

## 10. First login, user provisioning, and invitation profile data

The frontend signs users up through Auth0, then immediately calls `GET /users/me` and (for invite links) `POST /invitations/:token/accept`. After that it opens a complete-profile modal that **prefills name and email from the API**. Two backend gaps currently break this:

1. The first `GET /users/me` after Auth0 signup often `404`/`401` because the app user does not exist yet. The client then spins until a **manual refresh**.
2. Invitation `firstName` / `lastName` / `email` (set when the club/invite was created) never appear on the new user, so the modal is empty.

### Required: upsert the user on first authenticated request (no refresh)

The first authenticated `GET /users/me` **must create the user from the Auth0 JWT** if none exists (lazy upsert). A dedicated `POST /users/sync` that the frontend would call first is also acceptable, as long as the **first** profile fetch after the Auth0 callback returns `200`.

On create:

- Persist `auth0Id` from the JWT `sub`.
- Persist **`email` from the JWT** and return it on `GET /users/me`. The complete-profile modal prefills this field; it must not be null after first login.
- Copy `given_name` / `family_name` from JWT claims onto `firstName` / `lastName` when present and those user fields are empty.

Status codes:

| Status | When |
| --- | --- |
| `200` | User found **or just created**. Body is `UserResponseDto` including `email`. |
| `401` | Missing/invalid JWT only — **not** “user not in our DB yet”. |

Do **not** return `404` for a valid JWT whose user has not been inserted. That is what forces a refresh today.

`PUT /users/me` (`UpdateUserDto`) stays the save path for the complete-profile modal (`firstName`, `lastName`, `email`, optional `gender`, `dateOfBirth`, `weight`, `beltLevel`).

### Required: copy invitation identity onto the user on accept

```
POST /invitations/:token/accept
```

After linking club + role, copy invitation fields onto the authenticated user **only when the user field is empty**:

| Invitation field | User field |
| --- | --- |
| `firstName` | `firstName` |
| `lastName` | `lastName` |
| `email` | `email` |

Do not overwrite values the user (or Auth0 upsert) already set. The accept response already includes `user: UserResponseDto` — that object **must** contain the copied fields. A following `GET /users/me` must return the same.

### Required: public by-token preview includes invitee identity

```
GET /invitations/by-token/:token
```

**Public.** The token in the URL is the secret. Extend `InvitationByTokenResponseDto`:

| Field | Type | Notes |
| --- | --- | --- |
| `clubName` | `string` | Unchanged |
| `expiresAt` | ISO-8601 datetime | Unchanged |
| `status` | `pending` \| `accepted` \| `expired` \| `cancelled` | Unchanged |
| `email` | `string` | Invitee email (used as Auth0 `login_hint` and shown on the invite page) |
| `firstName` | `string \| null` | Invitee first name from create-invite |
| `lastName` | `string \| null` | Invitee last name from create-invite |

`404` if the token is unknown. Expired/cancelled/accepted invites still return `200` with `status` so the frontend can show “no longer valid”.
