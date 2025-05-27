type SidebarState = {
	conversations: string[];
}

export class SidebarStateClass implements SidebarState {

	conversations = $state<string[]>([])

	constructor() {
		this.conversation_ids = []
	}

}

