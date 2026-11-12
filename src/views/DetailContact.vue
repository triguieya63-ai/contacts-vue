<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useContacts } from '../stores/contacts'
import ContactPhoto from '../components/ContactPhoto.vue'

const props = defineProps({ id: { type: String, default: null } })
const router = useRouter()
const { getById, enregistrer, nouvelId, avatar } = useContacts()

const existant = props.id ? getById(props.id) : null
const estAjout = !existant

// Copie de travail : "Retour" sans enregistrer ne modifie donc pas la liste
const form = reactive(
  existant
    ? { ...existant }
    : { id: nouvelId(), nom: '', prenom: '', telephone: '', email: '', photo: avatar('?', '#e8ecf8') },
)

const erreurs = reactive({})
const messagePhoto = ref('')
const inputGalerie = ref(null)
const inputCamera = ref(null)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function valider() {
  erreurs.nom = form.nom.trim() ? '' : 'Le nom est obligatoire.'
  erreurs.prenom = form.prenom.trim() ? '' : 'Le prénom est obligatoire.'
  erreurs.telephone = form.telephone.trim() ? '' : 'Le téléphone est obligatoire.'
  erreurs.email = !form.email.trim()
    ? "L'e-mail est obligatoire."
    : emailRegex.test(form.email.trim()) ? '' : "L'adresse e-mail n'est pas valide."
  return !Object.values(erreurs).some(Boolean)
}

function sauvegarder() {
  if (!valider()) return
  enregistrer({ ...form, nom: form.nom.trim(), prenom: form.prenom.trim(), email: form.email.trim() })
  router.push({ name: 'liste' })
}

// Réduit l'image (max 300 px) pour que l'aperçu et le stockage restent légers
function reduire(fichier) {
  return new Promise((resolve, reject) => {
    const lecteur = new FileReader()
    lecteur.onerror = reject
    lecteur.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const max = 300
        const ratio = Math.min(1, max / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * ratio)
        canvas.height = Math.round(img.height * ratio)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = lecteur.result
    }
    lecteur.readAsDataURL(fichier)
  })
}

async function choisirPhoto(event) {
  const fichier = event.target.files?.[0]
  event.target.value = '' // permet de re-choisir le même fichier
  if (!fichier) return
  if (!fichier.type.startsWith('image/')) {
    messagePhoto.value = 'Le fichier choisi n’est pas une image.'
    return
  }
  try {
    form.photo = await reduire(fichier) // aperçu immédiat
    messagePhoto.value = ''
  } catch {
    messagePhoto.value = 'Impossible de lire cette image.'
  }
}

// Caméra : "capture" ouvre l'appareil photo sur mobile ; sur ordinateur on propose le repli (galerie)
function ouvrirCamera() {
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  if (!mobile) {
    messagePhoto.value = 'Caméra indisponible sur cet appareil : choisissez une photo depuis la galerie.'
    inputGalerie.value.click()
    return
  }
  messagePhoto.value = ''
  inputCamera.value.click()
}

const lienTel = computed(() => 'tel:' + form.telephone.replace(/\s+/g, ''))
const lienMail = computed(() => 'mailto:' + form.email.trim())
const peutAppeler = computed(() => form.telephone.trim().length > 0)
const peutMailer = computed(() => emailRegex.test(form.email.trim()))
</script>

<template>
  <section>
    <h2>{{ estAjout ? 'Nouveau contact' : 'Fiche contact — Modification' }}</h2>

    <div class="photo-zone">
      <ContactPhoto :src="form.photo" :taille="110" alt="Photo du contact" />
      <p v-if="messagePhoto" class="erreur" role="alert">{{ messagePhoto }}</p>
    </div>

    <div class="grille">
      <label>Nom
        <input v-model="form.nom" :class="{ invalide: erreurs.nom }" />
        <small v-if="erreurs.nom" class="erreur">{{ erreurs.nom }}</small>
      </label>
      <label>Prénom
        <input v-model="form.prenom" :class="{ invalide: erreurs.prenom }" />
        <small v-if="erreurs.prenom" class="erreur">{{ erreurs.prenom }}</small>
      </label>
      <label>Téléphone
        <input v-model="form.telephone" type="tel" :class="{ invalide: erreurs.telephone }" />
        <small v-if="erreurs.telephone" class="erreur">{{ erreurs.telephone }}</small>
      </label>
      <label>E-mail
        <input v-model="form.email" type="email" :class="{ invalide: erreurs.email }" />
        <small v-if="erreurs.email" class="erreur">{{ erreurs.email }}</small>
      </label>
    </div>

    <div class="actions">
      <a class="btn vert" :class="{ off: !peutAppeler }" :href="peutAppeler ? lienTel : undefined">Appeler</a>
      <a class="btn bleu" :class="{ off: !peutMailer }" :href="peutMailer ? lienMail : undefined">E-mail</a>
      <button type="button" class="btn violet" @click="inputGalerie.click()">Galerie</button>
      <button type="button" class="btn violet" @click="ouvrirCamera">Caméra</button>
    </div>

    <input ref="inputGalerie" type="file" accept="image/*" hidden @change="choisirPhoto" />
    <input ref="inputCamera" type="file" accept="image/*" capture="environment" hidden @change="choisirPhoto" />

    <div class="bas">
      <button type="button" class="btn clair" @click="router.push({ name: 'liste' })">Retour</button>
      <button type="button" class="btn vert" @click="sauvegarder">Enregistrer</button>
    </div>
  </section>
</template>

<style scoped>
h2 { margin: 0 0 1rem; font-size: 1.3rem; }
.photo-zone { display: flex; flex-direction: column; align-items: center; gap: .5rem; margin-bottom: 1rem; }
.grille { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: .9rem; }
label { display: flex; flex-direction: column; gap: .25rem; font-size: .8rem; font-weight: 600; color: #445; }
input { padding: .5rem .6rem; border: 1px solid #c6cde0; border-radius: 6px; font: inherit; font-weight: 400; }
input.invalide { border-color: #c0392b; }
.erreur { color: #c0392b; font-weight: 400; }
.actions { display: flex; flex-wrap: wrap; gap: .6rem; margin: 1.2rem 0; }
.actions .btn { flex: 1; text-align: center; }
.bas { display: flex; justify-content: space-between; }
.off { opacity: .45; pointer-events: none; }
</style>