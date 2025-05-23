type SidebarState = {
	conversation_ids: string[];
}

export class SidebarStateClass implements SidebarState {

	conversation_ids = $state<string[]>([])

	constructor() {
		this.conversation_ids = []
	}

}

