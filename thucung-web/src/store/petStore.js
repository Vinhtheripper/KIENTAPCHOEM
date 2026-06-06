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
  selectPet: (petId) => set({ selectedPetId: petId }),
}))

export default usePetStore
