import type { User } from '@supabase/supabase-js';

interface GlobalStateType {
	user: User | null;
}

export class GlobalState {
	user_data: User | null = $state(null)

	set user(user: User) {
		this.user_data = user
	}
	get user(): User | null {
		if (this.user_data)
			return this.user_data
		else return null
	}
}

export const globalState = new GlobalState()
