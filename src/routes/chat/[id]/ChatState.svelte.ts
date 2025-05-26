import type { Message, ChatState } from '$lib/types';

export class ChatStateClass implements ChatState {
	chat_messages = $state<Message[]>([]);
	conversation_id = ''

	constructor(conv_id: string) {
		this.conversation_id = conv_id
		this.chat_messages = [
			{
				"role": "assistant",
				"content": "Hello! How can I help you today?",
				"id": "d7f913f4-6732-4ae6-88c1-386d2002769d",
				"created_at": "2025-05-25T18:41:06.263Z",
				"conversation_id": "nice"
			},
			{
				"role": "user",
				"content": "asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ ",
				"id": "403076a0-d9ac-4404-9b30-9a238f681a1c",
				"created_at": "2025-05-25T18:41:11.352Z",
				"conversation_id": "nice"
			},
			{
				"role": "assistant",
				"content": "asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ ",
				"id": "72a20c2d-ef10-49bb-9652-f704c34ddd1a",
				"created_at": "2025-05-25T18:41:12.711Z",
				"conversation_id": "nice"
			},
			{
				"role": "user",
				"content": "asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ ",
				"id": "0c6680dd-ec23-49b4-88dc-d0ff5e4c1f96",
				"created_at": "2025-05-25T18:41:14.008Z",
				"conversation_id": "nice"
			},
			{
				"role": "user",
				"content": "asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ ",
				"id": "bf2810a2-ce3d-40d7-8597-64793f2f2d45",
				"created_at": "2025-05-25T18:41:15.216Z",
				"conversation_id": "nice"
			},
			{
				"role": "user",
				"content": "asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ asdlñkf ñaskdfj ñalskjdf ñlaskjd fñlakjsdf ñlakjsdf ñlaksjdf ñlaksdjf ñlaskdjfñ v",
				"id": "6b293a90-0147-4843-8142-9af21901b6c4",
				"created_at": "2025-05-25T18:41:18.402Z",
				"conversation_id": "nice"
			}
		]
	}

	isLoading = $state(false);

	sendMessage = (message: string) => {
		this.isLoading = true;

		//here we would send to database?
		this.chat_messages.push({
			role: 'user',
			content: message,
			id: crypto.randomUUID(),
			created_at: new Date(),
			conversation_id: this.conversation_id
		});

		// TODO: this should be called from api
		// db.insert(messages).values({
		// 	conversation_id: this.chat_messages[this.chat_messages.length - 1].id,
		// 	role: 'user',
		// 	content: message,
		// 	created_at: new Date()
		// });


	};

	fetchMessages = () => {
		// we would sync the data back ?
		//TODO: this should be called from api
		// db.select().from(messages).where(eq(messages.conversation_id, this.conversation_id))
	};
}
