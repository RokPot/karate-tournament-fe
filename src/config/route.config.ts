// make sure that every path has a trailing slash! Consult docs/code/routing.md for more information
export const RouteConfig = {
  home: "/",
  dashboard: "/dashboard/",
  signin: "/sign-in/",
  signup: "/sign-up/",
  bugReport: "/bug-report/",
  categories: "/categories/",
  tournaments: "/tournaments/",
  clubs: "/clubs/",
  invitations: "/invitations/",
  invite: "/invite/",
  myClub: "/clubs/my-club/",
  profile: "/profile/",
  profileClub: "/profile/club/",
  profileAccount: "/profile/account/",
  profilePreferences: "/profile/preferences/",
};

export const getTournamentDetailRoute = (id: string) => `/tournament/${id}/`;
export const getClubDetailRoute = (id: string) => `/clubs/${id}/`;
export const getInviteRoute = (token: string) => `/invite/${token}/`;
