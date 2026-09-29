/**
 * Who publishes the application, who hosts it, and who answers for personal data.
 *
 * A store submission asks for facts the code cannot know: the publisher's legal
 * name, its registered office, the company serving the files, and a contact for
 * data protection requests. Keeping them in one module means the privacy notice
 * and the terms of use name the same publisher in the same words, in both
 * languages, and that `npm run check:legal` can list whatever is still missing.
 *
 * An empty value is a value the publisher has yet to provide. The pages then
 * show "To be completed before release" instead of a made up address, because a
 * false registered office on a published app is worse than a visible gap.
 *
 * Plain module: no JSX, no React, so the test runner and the check script can
 * read it directly.
 */
import { CONTACT_EMAIL } from "./contact.js";

/** Everything needed to identify the publisher in both legal documents. */
export const PUBLISHER = {
  /** Trade name shown to the reader. */
  name: "",
  /** Registered company name, when it differs from the trade name. */
  legalName: "",
  /** Legal form, for example "Société par actions simplifiée". */
  legalForm: "",
  /** Full postal address of the registered office. */
  address: "",
  /** Registration number, SIREN or RCS entry. */
  registration: "",
  /** Address that receives legal notices and data protection requests. */
  email: CONTACT_EMAIL,
};

/**
 * Company that serves the application files. Even a game with no server of its
 * own is hosted somewhere, and the law asks for that company to be named.
 */
export const HOST = {
  name: "",
  address: "",
  phone: "",
};

/** Data protection officer, when the publisher has appointed one. */
export const DPO = {
  /** Whether a data protection officer exists and has to be named. */
  required: false,
  /** Address that answers data protection requests. */
  email: "",
};

const LABELS = {
  en: {
    name: "Publisher",
    legalName: "Registered name",
    legalForm: "Legal form",
    address: "Registered office",
    registration: "Registration",
    email: "Contact",
    dpo: "Data protection",
    hostName: "Host",
    hostAddress: "Host address",
    hostPhone: "Host phone",
    placeholder: "To be completed before release",
    noDpo:
      "No data protection officer has been appointed, this processing does not call for one.",
    dpoLine: (email) => `Data protection requests go to ${email}.`,
  },
  fr: {
    name: "Éditeur",
    legalName: "Raison sociale",
    legalForm: "Forme juridique",
    address: "Siège social",
    registration: "Immatriculation",
    email: "Contact",
    dpo: "Données personnelles",
    hostName: "Hébergeur",
    hostAddress: "Adresse de l'hébergeur",
    hostPhone: "Téléphone de l'hébergeur",
    placeholder: "À compléter avant publication",
    noDpo:
      "Aucun délégué à la protection des données n'a été désigné, ce traitement n'en nécessitant pas.",
    dpoLine: (email) => `Les demandes relatives aux données personnelles sont à adresser à ${email}.`,
  },
};

/** Labels of the language asked for, falling back to English. */
function labelsFor(lang) {
  return LABELS[lang] || LABELS.en;
}

/**
 * A labelled row of the identity block. `missing` tells the page to show the
 * value as a gap rather than as settled copy, which is what makes an unfilled
 * field impossible to overlook in the interface itself.
 */
function rowBuilder(labels) {
  const rows = [];
  const add = (label, raw) => {
    const value = typeof raw === "string" ? raw.trim() : "";
    rows.push({ label, value: value || labels.placeholder, missing: value === "" });
  };
  return { rows, add };
}

/** Identity of the publisher, ready to render as a label and value list. */
export function publisherFacts(lang = "en", { includeDpo = true } = {}) {
  const labels = labelsFor(lang);
  const { rows, add } = rowBuilder(labels);
  add(labels.name, PUBLISHER.name);
  add(labels.legalName, PUBLISHER.legalName);
  add(labels.legalForm, PUBLISHER.legalForm);
  add(labels.address, PUBLISHER.address);
  add(labels.registration, PUBLISHER.registration);
  add(labels.email, PUBLISHER.email);
  if (includeDpo) {
    rows.push(
      DPO.required
        ? { label: labels.dpo, value: labels.dpoLine(DPO.email), missing: DPO.email.trim() === "" }
        : { label: labels.dpo, value: labels.noDpo, missing: false }
    );
  }
  return rows;
}

/** Identity of the host, for the mentions legales section of the terms. */
export function hostFacts(lang = "en") {
  const labels = labelsFor(lang);
  const { rows, add } = rowBuilder(labels);
  add(labels.hostName, HOST.name);
  add(labels.hostAddress, HOST.address);
  add(labels.hostPhone, HOST.phone);
  return rows;
}

/** How to reach the publisher, for the closing contact section. */
export function contactFacts(lang = "en") {
  const labels = labelsFor(lang);
  const { rows, add } = rowBuilder(labels);
  add(labels.address, PUBLISHER.address);
  add(labels.email, PUBLISHER.email);
  rows.push(
    DPO.required
      ? { label: labels.dpo, value: labels.dpoLine(DPO.email), missing: DPO.email.trim() === "" }
      : { label: labels.dpo, value: labels.noDpo, missing: false }
  );
  return rows;
}
