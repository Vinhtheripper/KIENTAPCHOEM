import { create } from 'zustand'
import { adminApi } from '../api/adminApi.js'
import { petApi } from '../api/petApi.js'
import useToastStore from './toastStore.js'

const usePetStore = create((set, get) => ({
  pets: [],
  selectedPetId: null,
  loading: false,
  fetchPets: async () => {
    set({ loading: true })
    const pets = await petApi.list()
    set({ pets, selectedPetId: get().selectedPetId || pets[0]?._id || null, loading: false })
  },
  fetchAdminPets: async () => {
    set({ loading: true })
    const pets = await adminApi.pets()
    set({ pets, selectedPetId: get().selectedPetId || pets[0]?._id || null, loading: false })
  },
  createPet: async (payload) => {
    const pet = await petApi.create(payload)
    set((state) => ({ pets: [pet, ...state.pets], selectedPetId: pet._id }))
    useToastStore.getState().push('Pet profile created.')
    return pet
  },
  uploadAvatar: async (petId, file) => {
    const pet = await petApi.uploadAvatar(petId, file)
    set((state) => ({
      pets: state.pets.map((item) => (item._id === petId ? pet : item)),
      selectedPetId: pet._id,
    }))
    return pet
  },
  updatePet: async (petId, payload) => {
    const pet = await petApi.update(petId, payload)
    set((state) => ({ pets: state.pets.map((item) => (item._id === petId ? pet : item)) }))
    useToastStore.getState().push('Pet profile updated.')
    return pet
  },
  deletePet: async (petId) => {
    await petApi.remove(petId)
    set((state) => {
      const pets = state.pets.filter((pet) => pet._id !== petId)
      const selectedPetId = state.selectedPetId === petId ? pets[0]?._id || null : state.selectedPetId
      return { pets, selectedPetId }
    })
    useToastStore.getState().push('Pet deleted.', 'warning')
  },
  selectPet: (petId) => set({ selectedPetId: petId }),
}))

export default usePetStore
