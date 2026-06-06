import { create } from 'zustand'
import { petApi } from '../api/petApi.js'

const usePetStore = create((set, get) => ({
  pets: [],
  selectedPetId: null,
  loading: false,
  fetchPets: async () => {
    set({ loading: true })
    const pets = await petApi.list()
    set({ pets, selectedPetId: get().selectedPetId || pets[0]?._id || null, loading: false })
  },
  createPet: async (payload) => {
    const pet = await petApi.create(payload)
    set((state) => ({ pets: [pet, ...state.pets], selectedPetId: pet._id }))
    return pet
  },
  deletePet: async (petId) => {
    await petApi.remove(petId)
    set((state) => {
      const pets = state.pets.filter((pet) => pet._id !== petId)
      const selectedPetId = state.selectedPetId === petId ? pets[0]?._id || null : state.selectedPetId
      return { pets, selectedPetId }
    })
  },
  selectPet: (petId) => set({ selectedPetId: petId }),
}))

export default usePetStore
