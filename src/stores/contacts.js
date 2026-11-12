import { reactive, watch } from 'vue'

const CLE = 'contacts-tp'

function avatar(texte, couleur) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">` +
    `<rect width="200" height="200" fill="${couleur}"/>` +
    `<text x="100" y="125" font-size="80" font-family="Arial" font-weight="bold" ` +
    `text-anchor="middle" fill="#2b3a67">${texte}</text></svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

const initiaux = [
  { id: 1, nom: 'Ben Ali', prenom: 'Ahmed', telephone: '22 345 678', email: 'ahmed.benali@example.com', photo: avatar('AB', '#cfe3ff') },
  { id: 2, nom: 'Trabelsi', prenom: 'Sarra', telephone: '98 765 432', email: 'sarra.trabelsi@example.com', photo: avatar('ST', '#ffd9de') },
  { id: 3, nom: 'Gharbi', prenom: 'Mohamed', telephone: '55 234 567', email: 'mohamed.gharbi@example.com', photo: avatar('MG', '#d5eedd') },
  { id: 4, nom: 'Jaziri', prenom: 'Ines', telephone: '29 456 123', email: 'ines.jaziri@example.com', photo: avatar('IJ', '#ffefc2') },
  { id: 5, nom: 'Mansour', prenom: 'Yassine', telephone: '50 111 222', email: 'yassine.mansour@example.com', photo: avatar('YM', '#e4d9ff') },
]

function charger() {
  try {
    const sauvegarde = localStorage.getItem(CLE)
    if (sauvegarde) return JSON.parse(sauvegarde)
  } catch (e) { /* stockage indisponible ou corrompu : on repart des données initiales */ }
  return initiaux
}

const state = reactive({ contacts: charger() })

watch(
  () => state.contacts,
  (v) => {
    try { localStorage.setItem(CLE, JSON.stringify(v)) } catch (e) { /* quota dépassé : on ignore */ }
  },
  { deep: true },
)

export function useContacts() {
  const getById = (id) => state.contacts.find((c) => c.id === Number(id))

  const enregistrer = (contact) => {
    const i = state.contacts.findIndex((c) => c.id === contact.id)
    if (i === -1) state.contacts.push({ ...contact })
    else state.contacts[i] = { ...contact }
  }

  const nouvelId = () => Date.now()

  return { state, getById, enregistrer, nouvelId, avatar }
}