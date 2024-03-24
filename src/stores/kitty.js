import { defineStore } from 'pinia';

export const kittyStore = defineStore('kitty', {
	state: () => {
		return {
			amount: {},
		}
	}
});