import { useCallback, useState } from "react";

import type { DraftParticipant, ParticipantAttributes } from "../types";

function createParticipantId(): string {
  return crypto.randomUUID();
}

export function useDraftParticipants() {
  const [participants, setParticipants] = useState<DraftParticipant[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addParticipant = useCallback((attributes: ParticipantAttributes) => {
    const participant: DraftParticipant = {
      clientId: createParticipantId(),
      ...attributes,
      categoryIds: [],
    };
    setParticipants((prev) => [...prev, participant]);
    setEditingId(null);
  }, []);

  const updateParticipant = useCallback(
    (clientId: string, attributes: ParticipantAttributes) => {
      setParticipants((prev) =>
        prev.map((participant) =>
          participant.clientId === clientId
            ? { ...participant, ...attributes, categoryIds: [] }
            : participant,
        ),
      );
      setEditingId(null);
    },
    [],
  );

  const removeParticipant = useCallback((clientId: string) => {
    setParticipants((prev) =>
      prev.filter((participant) => participant.clientId !== clientId),
    );
    setEditingId((current) => (current === clientId ? null : current));
  }, []);

  const setParticipantsDirect = useCallback(
    (next: DraftParticipant[] | ((prev: DraftParticipant[]) => DraftParticipant[])) => {
      setParticipants(next);
    },
    [],
  );

  const startEditing = useCallback((clientId: string) => {
    setEditingId(clientId);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
  }, []);

  const editingParticipant = participants.find(
    (participant) => participant.clientId === editingId,
  );

  return {
    participants,
    setParticipants: setParticipantsDirect,
    editingId,
    editingParticipant,
    addParticipant,
    updateParticipant,
    removeParticipant,
    startEditing,
    cancelEditing,
  };
}

export type UseDraftParticipantsReturn = ReturnType<typeof useDraftParticipants>;
