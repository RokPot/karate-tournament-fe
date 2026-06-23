// make sure that every path has a trailing slash! Consult docs/code/routing.md for more information
export const RouteConfig = {
  home: "/",
  signin: "/sign-in/",
  signup: "/sign-up/",
  bugReport: "/bug-report/",
  categories: "/categories/",
  tournaments: "/tournaments/",
  clubs: "/clubs/",
  invitations: "/invitations/",
  invite: "/invite/",
  myClub: "/clubs/my-club/",
};

export const getTournamentDetailRoute = (id: string) => `/tournament/${id}/`;
export const getInviteRoute = (token: string) => `/invite/${token}/`;
