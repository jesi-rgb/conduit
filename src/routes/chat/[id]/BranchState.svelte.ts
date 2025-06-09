
import { fetchWithAuth } from '$lib/client/auth';
import type { Message, ChatState, Branch } from '$lib/types';
import { globalState } from '../../../stores/stores.svelte';

type BranchStateType = {
	branch_id: string;
	conversation_id: string;
}

export class BranchState implements BranchStateType {

	branch_id = $state('');
	conversation_id = $state('');
	branches = $state(<Branch[]>[])

	constructor(conv_id: string, branch_id: string) {
		this.conversation_id = conv_id
		this.branch_id = branch_id
	}

	fetchBranches = async () => {
		const branchesResponse = await fetchWithAuth({ url: `/api/branches/${this.conversation_id}` });
		this.branches = (await branchesResponse.json()).branches;
	}
}

