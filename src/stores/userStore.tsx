import { create } from "zustand";

const useUserStore = create((set) => ({
    user: [],
}));

export default useUserStore;
