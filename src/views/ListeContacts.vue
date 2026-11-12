<script setup>
import { useRouter } from 'vue-router'
import { useContacts } from '../stores/contacts'
import ContactPhoto from '../components/ContactPhoto.vue'

const router = useRouter()
const { state } = useContacts()
</script>

<template>
  <section>
    <div class="entete">
      <h2>Liste des contacts</h2>
      <button class="btn vert" @click="router.push({ name: 'ajout' })">+ Ajouter</button>
    </div>

    <p v-if="state.contacts.length === 0" class="vide">
      Aucun contact. Cliquez sur « Ajouter » pour en créer un.
    </p>

    <ul class="liste">
      <li v-for="c in state.contacts" :key="c.id" class="ligne">
        <ContactPhoto :src="c.photo" :alt="`Photo de ${c.prenom} ${c.nom}`" />
        <div class="infos">
          <strong>{{ c.nom }} {{ c.prenom }}</strong>
          <span>{{ c.telephone }}</span>
        </div>
        <button class="btn clair" @click="router.push({ name: 'detail', params: { id: c.id } })">
          Modifier
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.entete { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
h2 { margin: 0; font-size: 1.3rem; }
.liste { list-style: none; margin: 0; padding: 0; display: grid; gap: .6rem; }
.ligne { display: flex; align-items: center; gap: .9rem; padding: .6rem .8rem; border: 1px solid #dfe3ee; border-radius: 10px; background: #f7f8fc; }
.infos { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.infos span { color: #667; font-size: .85rem; }
.vide { color: #667; }
</style>