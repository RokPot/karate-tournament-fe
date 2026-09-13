import { z } from "zod";

export namespace SchedulesModels {
  /**
   * CompetitorRefKindEnumSchema
   * @type { enum }
   * @description E,x,a,m,p,l,e,:, ,`,r,e,g,i,s,t,r,a,t,i,o,n,`
   */
  export const CompetitorRefKindEnumSchema = z.enum(["registration", "team"]);
  export type CompetitorRefKindEnum = z.infer<
    typeof CompetitorRefKindEnumSchema
  >;
  export const CompetitorRefKindEnum = CompetitorRefKindEnumSchema.enum;

  /**
   * WinnerSideEnumSchema
   * @type { enum }
   */
  export const WinnerSideEnumSchema = z.enum(["item", "item2"]);
  export type WinnerSideEnum = z.infer<typeof WinnerSideEnumSchema>;
  export const WinnerSideEnum = WinnerSideEnumSchema.enum;

  /**
   * GameSlotAKindEnumSchema
   * @type { enum }
   */
  export const GameSlotAKindEnumSchema = z.enum(["item", "bye", "tbd"]);
  export type GameSlotAKindEnum = z.infer<typeof GameSlotAKindEnumSchema>;
  export const GameSlotAKindEnum = GameSlotAKindEnumSchema.enum;

  /**
   * GameSlotAOutcomeEnumSchema
   * @type { enum }
   */
  export const GameSlotAOutcomeEnumSchema = z.enum(["winner", "loser"]);
  export type GameSlotAOutcomeEnum = z.infer<typeof GameSlotAOutcomeEnumSchema>;
  export const GameSlotAOutcomeEnum = GameSlotAOutcomeEnumSchema.enum;

  /**
   * ScheduleKindEnumSchema
   * @type { enum }
   * @description E,x,a,m,p,l,e,:, ,`,s,i,n,g,l,e,_,e,l,i,m,i,n,a,t,i,o,n,`
   */
  export const ScheduleKindEnumSchema = z.enum(["single_elimination"]);
  export type ScheduleKindEnum = z.infer<typeof ScheduleKindEnumSchema>;
  export const ScheduleKindEnum = ScheduleKindEnumSchema.enum;

  /**
   * CompetitorRefDtoSchema
   * @type { object }
   * @property { string } id Registration or team ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } kind Example: `registration`
   * @property { string } displayName Display name. Example: `Jane Doe`
   */
  export const CompetitorRefDtoSchema = z.object({
    id: z.string(),
    kind: CompetitorRefKindEnumSchema,
    displayName: z.string().nullish(),
  });
  export type CompetitorRefDto = z.infer<typeof CompetitorRefDtoSchema>;

  /**
   * MatchResponseDtoSchema
   * @type { object }
   * @property { string } id Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } gameId Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } competitorKind Example: `registration`
   * @property { string } competitorAId Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } competitorBId Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { CompetitorRefDto } competitorA
   * @property { CompetitorRefDto } competitorB
   * @property { string } winnerId
   * @property { string } startTime
   * @property { string } endTime
   */
  export const MatchResponseDtoSchema = z.object({
    id: z.string(),
    gameId: z.string(),
    competitorKind: CompetitorRefKindEnumSchema,
    competitorAId: z.string().nullish(),
    competitorBId: z.string().nullish(),
    competitorA: CompetitorRefDtoSchema.nullish(),
    competitorB: CompetitorRefDtoSchema.nullish(),
    winnerId: z.string().nullish(),
    startTime: z.string().datetime({ offset: true }).nullish(),
    endTime: z.string().datetime({ offset: true }).nullish(),
  });
  export type MatchResponseDto = z.infer<typeof MatchResponseDtoSchema>;

  /**
   * GameResponseDtoSchema
   * @type { object }
   * @property { string } id Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } key Example: `r0-m0`
   * @property { boolean } isThirdPlace
   * @property { boolean } isBye
   * @property { string } winnerSide
   * @property { string } slotAKind
   * @property { string } slotBKind
   * @property { string } slotACompetitorId
   * @property { string } slotBCompetitorId
   * @property { CompetitorRefDto } slotACompetitor
   * @property { CompetitorRefDto } slotBCompetitor
   * @property { string } slotAFromGameId
   * @property { string } slotBFromGameId
   * @property { string } slotAOutcome
   * @property { string } slotBOutcome
   * @property { MatchResponseDto[] } matches
   */
  export const GameResponseDtoSchema = z.object({
    id: z.string(),
    key: z.string(),
    isThirdPlace: z.boolean(),
    isBye: z.boolean(),
    winnerSide: WinnerSideEnumSchema.nullish(),
    slotAKind: GameSlotAKindEnumSchema,
    slotBKind: GameSlotAKindEnumSchema,
    slotACompetitorId: z.string().nullish(),
    slotBCompetitorId: z.string().nullish(),
    slotACompetitor: CompetitorRefDtoSchema.nullish(),
    slotBCompetitor: CompetitorRefDtoSchema.nullish(),
    slotAFromGameId: z.string().nullish(),
    slotBFromGameId: z.string().nullish(),
    slotAOutcome: GameSlotAOutcomeEnumSchema.nullish(),
    slotBOutcome: GameSlotAOutcomeEnumSchema.nullish(),
    matches: z.array(MatchResponseDtoSchema),
  });
  export type GameResponseDto = z.infer<typeof GameResponseDtoSchema>;

  /**
   * ScheduleResponseDtoSchema
   * @type { object }
   * @property { string } id Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } tournamentId Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } categoryId Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } kind Example: `single_elimination`
   * @property { number } size Number of real participants (not padded). Example: `5`
   * @property { GameResponseDto[] } games
   * @property { string } createdAt
   * @property { string } updatedAt
   */
  export const ScheduleResponseDtoSchema = z.object({
    id: z.string(),
    tournamentId: z.string(),
    categoryId: z.string(),
    kind: ScheduleKindEnumSchema,
    size: z.number(),
    games: z.array(GameResponseDtoSchema),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  });
  export type ScheduleResponseDto = z.infer<typeof ScheduleResponseDtoSchema>;
}
