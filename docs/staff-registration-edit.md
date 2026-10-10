# Staff registration edit (BE requirements)

Frontend needs staff APIs to manage tournament registrations from the tournament detail **Registrations** tab. Until these exist, the FE uses mocked mutations in `src/data/registrations/registrations.staff.ts`.

## Authorization

Allowed callers:

- platform `admin`
- owning club `club_owner` (`tournament.clubId` matches the caller's club)

Everyone else (including owning club `club_coach`) must receive **403**.

## Endpoints

### Create (add participant to a category)

`POST` staff create for a tournament category (exact path TBD; e.g. `POST /tournaments/:tournamentId/registrations` or extend authenticated create).

Request body (minimum):

- `tournamentId`
- `categoryId` (chosen in participant view, or implied when adding from a category accordion)
- Participant identity: `firstName`, `lastName`, `gender`, `dateOfBirth`, `weight`, `beltLevel`
- Optional: `clubId`, `finalWeight`, `email` (if create-or-attach user by email)

Behavior:

- Create or attach a user, then create one registration for that category
- **409** if the person is already registered in that category
- **400** if ineligible for the category (age / weight / belt / gender)
- Team roster add/remove is **out of FE v1**; reject or document separately if staff try to add into team categories without a roster API

### Update participant identity

`PATCH /registrations/:id`

Updatable fields:

- `firstName`, `lastName`, `gender`, `dateOfBirth`, `weight`, `beltLevel`
- optional `finalWeight`

Notes:

- Updating identity should apply to the underlying user/profile so other registrations for the same person in this tournament stay consistent
- **404** if missing; **403** if caller is not admin / owning club owner

### Remove one category registration

`DELETE /registrations/:id`

- Removes **only** that category registration
- Other categories for the same person remain
- **404** / **403** as usual

## Locking (please decide)

Document whether create / update / delete are allowed when:

- tournament status is `in_progress` or `ended`
- a schedule already exists for the category

Recommended default for FE: allow while `approved` or `in_progress`; block when `ended`. Confirm with product.

## Participants view (no new list API)

`GET /registrations/by-tournament?tournamentId=` (no `categoryId`) is enough. The FE groups by `userId` and shows category pills / per-registration remove.

## Teams

Roster composition (starters / reserves) is out of FE v1. Document a follow-up if staff should manage team rosters from this tab later.
