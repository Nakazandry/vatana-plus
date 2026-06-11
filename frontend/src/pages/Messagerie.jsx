import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiCheck,
  FiInbox,
  FiMessageSquare,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import api from "../services/api";
import AlertMessage from "../components/feedback/AlertMessage";

function lireUtilisateurConnecte() {
  try {
    return JSON.parse(localStorage.getItem("utilisateur") || "{}");
  } catch {
    return {};
  }
}

function getNomComplet(utilisateur) {
  return [utilisateur?.nom, utilisateur?.prenom].filter(Boolean).join(" ");
}

function getInitiale(utilisateur) {
  return (utilisateur?.nom || utilisateur?.prenom || "U").charAt(0).toUpperCase();
}

function formatDateMessage(date) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getContactDepuisMessage(message, utilisateurId) {
  const estExpediteur = Number(message.expediteur_id) === Number(utilisateurId);

  return {
    id: estExpediteur ? message.destinataire_id : message.expediteur_id,
    nom: estExpediteur ? message.destinataire_nom : message.expediteur_nom,
    prenom: estExpediteur
      ? message.destinataire_prenom
      : message.expediteur_prenom,
  };
}

function construireConversations(messages, contacts, utilisateurId) {
  const conversations = new Map();

  contacts.forEach((contact) => {
    conversations.set(Number(contact.id), {
      contact,
      dernierMessage: null,
      nonLus: 0,
      total: 0,
    });
  });

  messages.forEach((message) => {
    const contact = getContactDepuisMessage(message, utilisateurId);
    const contactId = Number(contact.id);
    const conversation = conversations.get(contactId) || {
      contact,
      dernierMessage: null,
      nonLus: 0,
      total: 0,
    };

    conversation.total += 1;

    if (
      !conversation.dernierMessage ||
      new Date(message.date_message) > new Date(conversation.dernierMessage.date_message)
    ) {
      conversation.dernierMessage = message;
    }

    if (
      Number(message.destinataire_id) === Number(utilisateurId) &&
      message.statut !== "lu"
    ) {
      conversation.nonLus += 1;
    }

    conversations.set(contactId, conversation);
  });

  return [...conversations.values()].sort((a, b) => {
    if (!a.dernierMessage && !b.dernierMessage) {
      return getNomComplet(a.contact).localeCompare(getNomComplet(b.contact));
    }

    if (!a.dernierMessage) return 1;
    if (!b.dernierMessage) return -1;

    return (
      new Date(b.dernierMessage.date_message) -
      new Date(a.dernierMessage.date_message)
    );
  });
}

function Messagerie({ contexte = "admin" }) {
  const utilisateur = lireUtilisateurConnecte();
  const utilisateurId = utilisateur.id;
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contactActifId, setContactActifId] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [contenu, setContenu] = useState("");
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");

  const chargerMessagerie = useCallback(async () => {
    if (!utilisateurId) {
      setErreur("Utilisateur connecté introuvable.");
      setChargement(false);
      return;
    }

    try {
      setChargement(true);
      setErreur("");

      const [messagesResponse, utilisateursResponse] = await Promise.all([
        api.get(`/messages/${utilisateurId}`),
        api.get("/utilisateurs"),
      ]);

      const utilisateursDisponibles = utilisateursResponse.data
        .filter((item) => Number(item.id) !== Number(utilisateurId))
        .filter((item) => {
          if (contexte === "client") {
            return item.role === "admin";
          }

          return true;
        });

      setMessages(messagesResponse.data);
      setContacts(utilisateursDisponibles);

      setContactActifId((contactActuel) => {
        if (contactActuel) {
          return contactActuel;
        }

        const premierMessage = messagesResponse.data[0];
        if (premierMessage) {
          return Number(getContactDepuisMessage(premierMessage, utilisateurId).id);
        }

        return utilisateursDisponibles[0]?.id || null;
      });
    } catch (error) {
      console.log(error);
      setErreur("Impossible de charger la messagerie.");
    } finally {
      setChargement(false);
    }
  }, [contexte, utilisateurId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      chargerMessagerie();
    }, 0);

    return () => clearTimeout(timer);
  }, [chargerMessagerie]);

  useEffect(() => {
    if (!succes && !erreur) {
      return;
    }

    const timer = setTimeout(() => {
      setSucces("");
      setErreur("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [succes, erreur]);

  const conversations = useMemo(
    () => construireConversations(messages, contacts, utilisateurId),
    [contacts, messages, utilisateurId]
  );

  const conversationsFiltrees = useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    if (!terme) {
      return conversations;
    }

    return conversations.filter(({ contact, dernierMessage }) =>
      [getNomComplet(contact), contact.email, dernierMessage?.contenu]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(terme)
    );
  }, [conversations, recherche]);

  const contactActif = useMemo(() => {
    return (
      contacts.find((contact) => Number(contact.id) === Number(contactActifId)) ||
      conversations.find(
        (conversation) => Number(conversation.contact.id) === Number(contactActifId)
      )?.contact ||
      null
    );
  }, [contactActifId, contacts, conversations]);

  const messagesConversation = useMemo(() => {
    if (!contactActifId) {
      return [];
    }

    return messages
      .filter((message) => {
        const expediteur = Number(message.expediteur_id);
        const destinataire = Number(message.destinataire_id);
        const contact = Number(contactActifId);
        const courant = Number(utilisateurId);

        return (
          (expediteur === courant && destinataire === contact) ||
          (expediteur === contact && destinataire === courant)
        );
      })
      .sort((a, b) => new Date(a.date_message) - new Date(b.date_message));
  }, [contactActifId, messages, utilisateurId]);

  useEffect(() => {
    const messagesNonLus = messagesConversation.filter(
      (message) =>
        Number(message.destinataire_id) === Number(utilisateurId) &&
        message.statut !== "lu"
    );

    if (!messagesNonLus.length) {
      return;
    }

    const timer = setTimeout(() => {
      messagesNonLus.forEach((message) => {
        api
          .put(`/messages/${message.id}/lu`)
          .catch((error) => console.log(error));
      });

      setMessages((messagesActuels) =>
        messagesActuels.map((message) =>
          messagesNonLus.some((messageLu) => messageLu.id === message.id)
            ? { ...message, statut: "lu" }
            : message
        )
      );
      window.dispatchEvent(new Event("vatana-messages-change"));
    }, 0);

    return () => clearTimeout(timer);
  }, [messagesConversation, utilisateurId]);

  const envoyerMessage = async (event) => {
    event.preventDefault();

    if (!contenu.trim() || !contactActifId) {
      return;
    }

    try {
      setEnvoi(true);
      setErreur("");

      const response = await api.post("/messages", {
        expediteur_id: utilisateurId,
        destinataire_id: contactActifId,
        contenu: contenu.trim(),
      });

      const nouveauMessage = {
        ...response.data,
        expediteur_nom: utilisateur.nom,
        expediteur_prenom: utilisateur.prenom,
        destinataire_nom: contactActif?.nom,
        destinataire_prenom: contactActif?.prenom,
      };

      setMessages((messagesActuels) => [nouveauMessage, ...messagesActuels]);
      setContenu("");
      setSucces("Message envoyé.");
      window.dispatchEvent(new Event("vatana-messages-change"));
    } catch (error) {
      console.log(error);
      setErreur("Impossible d'envoyer le message.");
    } finally {
      setEnvoi(false);
    }
  };

  const supprimerMessage = async (messageId) => {
    try {
      await api.delete(`/messages/${messageId}`);
      setMessages((messagesActuels) =>
        messagesActuels.filter((message) => message.id !== messageId)
      );
      setSucces("Message supprimé.");
      window.dispatchEvent(new Event("vatana-messages-change"));
    } catch (error) {
      console.log(error);
      setErreur("Impossible de supprimer ce message.");
    }
  };

  const totalNonLus = conversations.reduce(
    (total, conversation) => total + conversation.nonLus,
    0
  );

  return (
    <div className="space-y-6">
      <AlertMessage
        type="succes"
        message={succes}
        onFermer={() => setSucces("")}
        flottant
      />
      <AlertMessage
        type="erreur"
        message={erreur}
        onFermer={() => setErreur("")}
        flottant
      />

      {contexte === "admin" && (
        <section className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_20%,rgba(34,197,94,0.22),transparent_18rem)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-green-300 via-cyan-300 to-transparent" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="w-fit rounded-full border border-green-300/20 bg-green-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-200">
                Communication
              </p>
              <h1 className="mt-4 text-3xl font-black">Messagerie</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Echangez avec les sportifs et gardez le suivi coach au meme
                endroit que les programmes.
              </p>
            </div>

            <button
              type="button"
              onClick={chargerMessagerie}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-green-500 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-green-950/30 transition hover:-translate-y-0.5 hover:bg-green-300"
            >
              <FiRefreshCw />
              Actualiser
            </button>
          </div>
        </section>
      )}

      <section className="grid min-h-[640px] overflow-hidden rounded-lg border border-white/70 bg-white/90 shadow-lg shadow-slate-200/50 backdrop-blur lg:grid-cols-[360px_1fr]">
        <aside className="border-b border-gray-100 lg:border-b-0 lg:border-r">
          <div className="border-b border-gray-100 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Conversations
                </h2>
                <p className="text-sm text-gray-500">
                  {totalNonLus} message{totalNonLus > 1 ? "s" : ""} non lu
                  {totalNonLus > 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-xl text-green-700">
                <FiMessageSquare />
              </div>
            </div>

            <div className="relative">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={recherche}
                onChange={(event) => setRecherche(event.target.value)}
                placeholder="Rechercher un contact..."
                className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>
          </div>

          <div className="max-h-[320px] overflow-y-auto lg:max-h-[560px]">
            {chargement ? (
              <div className="p-5 text-center text-sm text-gray-500">
                Chargement des messages...
              </div>
            ) : conversationsFiltrees.length ? (
              conversationsFiltrees.map(({ contact, dernierMessage, nonLus }) => {
                const actif = Number(contact.id) === Number(contactActifId);

                return (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => setContactActifId(contact.id)}
                    className={`flex w-full items-center gap-3 border-b border-gray-100 p-4 text-left transition ${
                      actif
                        ? "bg-green-50"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-950 font-bold text-white">
                      {getInitiale(contact)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-bold text-slate-950">
                          {getNomComplet(contact) || `Utilisateur #${contact.id}`}
                        </span>
                        {nonLus > 0 && (
                          <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs font-bold text-white">
                            {nonLus}
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block truncate text-sm text-gray-500">
                        {dernierMessage?.contenu || "Aucun message pour le moment"}
                      </span>
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <FiInbox />
                </div>
                <p className="mt-3 font-semibold text-slate-900">
                  Aucune conversation
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Aucun contact ne correspond a votre recherche.
                </p>
              </div>
            )}
          </div>
        </aside>

        <div className="flex min-h-[560px] flex-col">
          {contactActif ? (
            <>
              <header className="flex items-center justify-between gap-4 border-b border-gray-100 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-600 font-bold text-white">
                    {getInitiale(contactActif)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-black text-slate-950">
                      {getNomComplet(contactActif) ||
                        `Utilisateur #${contactActif.id}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Conversation privee
                    </p>
                  </div>
                </div>
                <span className="hidden items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 sm:inline-flex">
                  <FiCheck />
                  Synchronise
                </span>
              </header>

              <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-4 sm:p-6">
                {messagesConversation.length ? (
                  messagesConversation.map((message) => {
                    const estMoi =
                      Number(message.expediteur_id) === Number(utilisateurId);

                    return (
                      <div
                        key={message.id}
                        className={`flex ${estMoi ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`group max-w-[min(82%,680px)] rounded-lg px-4 py-3 shadow-sm ${
                            estMoi
                              ? "bg-slate-950 text-white"
                              : "border border-gray-200 bg-white text-slate-800"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm leading-6">
                            {message.contenu}
                          </p>
                          <div
                            className={`mt-2 flex items-center gap-2 text-xs ${
                              estMoi ? "text-slate-300" : "text-gray-500"
                            }`}
                          >
                            <span>{formatDateMessage(message.date_message)}</span>
                            {estMoi && <span>{message.statut || "envoye"}</span>}
                            <button
                              type="button"
                              onClick={() => supprimerMessage(message.id)}
                              className={`ml-auto opacity-0 transition group-hover:opacity-100 ${
                                estMoi
                                  ? "text-slate-300 hover:text-red-200"
                                  : "text-gray-400 hover:text-red-600"
                              }`}
                              title="Supprimer"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="grid h-full min-h-[320px] place-items-center text-center">
                    <div>
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-gray-400 shadow-sm">
                        <FiMessageSquare />
                      </div>
                      <p className="mt-4 font-bold text-slate-950">
                        Demarrez la conversation
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Envoyez le premier message a ce contact.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <form
                onSubmit={envoyerMessage}
                className="border-t border-gray-100 bg-white p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <textarea
                    value={contenu}
                    onChange={(event) => setContenu(event.target.value)}
                    rows="2"
                    placeholder="Ecrire un message..."
                    className="min-h-12 flex-1 resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                  <button
                    type="submit"
                    disabled={envoi || !contenu.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-bold text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    <FiSend />
                    {envoi ? "Envoi..." : "Envoyer"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-8 text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-500">
                  <FiUser />
                </div>
                <p className="mt-4 font-bold text-slate-950">
                  Aucun contact disponible
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Ajoutez des utilisateurs pour utiliser la messagerie.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Messagerie;
