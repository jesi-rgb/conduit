<script lang="ts">
	import { onMount } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/client/supabase';
	import type { User } from '@supabase/supabase-js';
	import { globalState } from '../stores/stores.svelte';
	import Icon from '@iconify/svelte';

	let user: User | null = $state(null);
	let loading = $state(false);

	let error = $state();

	async function checkUser() {
		const { data } = await supabase.auth.getUser();
		if (data.user) {
			globalState.user = data.user;
			user = data.user;
		}
		loading = false;
		if (user) goto('/chat');
	}

	async function handleAnonymousLogin() {
		loading = true;

		try {
			const { error } = await supabase.auth.signInAnonymously();

			if (error) throw error;

			goto('/chat');
		} catch (e) {
			console.error('Anonymous login error:', e);
			goto('/chat');
		}
	}

	async function handleGoogleLogin() {
		loading = true;
		error = '';

		const { data: userData } = await supabase.auth.getUser();

		if (userData.user) {
			goto('/chat');
		}

		try {
			const { error: authError } = await supabase.auth.signInWithOAuth({
				provider: 'google'
			});

			if (authError) throw authError;

			// No need to redirect, as Supabase OAuth will handle it
		} catch (e: any) {
			console.error('Google login error:', e);
			error = e.message || 'Failed to log in with Google';
			loading = false; // Only set loading false on error, otherwise we're redirecting
		}
	}

	onMount(() => {
		checkUser();
	});
</script>

<MetaTags
	title="Conduit | AI conversations and branches "
	titleTemplate="%s | Conduit"
	description="Conduit is a chat app that allows you to interact with an LLM
	in a non linear way."
	canonical="https://conduitchat.app/"
	openGraph={{
		url: 'https://conduitchat.app/',
		title: 'Conduit',
		description:
			'Conduit is a chat app that allows you to interact with an LLM in a non linear way.',
		images: [
			{
				url: 'https://www.example.ie/og-image-01.jpg',
				width: 800,
				height: 600,
				alt: 'Og Image Alt'
			},
			{
				url: 'https://www.example.ie/og-image-02.jpg',
				width: 900,
				height: 800,
				alt: 'Og Image Alt Second'
			},
			{ url: 'https://www.example.ie/og-image-03.jpg' },
			{ url: 'https://www.example.ie/og-image-04.jpg' }
		],
		siteName: 'SiteName'
	}}
	twitter={{
		creator: '@jesi_rgb',
		cardType: 'summary_large_image',
		title: 'Conduit | Non-Linear Chat App',
		description:
			'Conduit is a chat app that allows you to interact with an LLM in a non linear way.'
	}}
/>

<div class="hero bg-base-200 min-h-screen">
	<div class="hero-content max-w-6xl flex-col gap-8 lg:flex-row-reverse">
		<div class="text-center lg:w-1/2 lg:text-left">
			<h1 class="text-5xl font-bold">Conduit</h1>
			<p class="py-6 text-xl">
				A better way to have conversations with AI. Select any text to branch the conversation and
				explore new ideas without losing context.
			</p>
			<div class="flex flex-col gap-4">
				<div class="flex items-start gap-2">
					<div class="bg-primary text-primary-content rounded-full p-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold">Branching Conversations</h3>
						<p>Select any text to create a new conversation branch, just like Git branches.</p>
					</div>
				</div>

				<div class="flex items-start gap-2">
					<div class="bg-secondary text-secondary-content rounded-full p-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold">Clean Context</h3>
						<p>Prevent conversation "poisoning" by keeping tangent topics separate.</p>
					</div>
				</div>

				<div class="flex items-start gap-2">
					<div class="bg-accent text-accent-content rounded-full p-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
							/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold">Visual Conversation History</h3>
						<p>
							See your conversation history with a visual timeline. Navigate your chats quickly.
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl lg:w-1/2">
			<div class="card-body">
				<div class="mockup-browser border-base-300 border">
					<div class="mockup-browser-toolbar">
						<div class="input border-base-300 w-full border">conduit.app/chat</div>
					</div>
					<div class="bg-base-200 flex flex-col gap-4 px-4 py-8">
						<div class="chat chat-end group">
							<p
								class="bg-primary/15 border-primary/30 self-end rounded-2xl rounded-br-xs border px-4 py-2"
							>
								Tell me about machine learning algorithms.
							</p>
							<div
								class="chat-footer font-mono opacity-0 transition-opacity duration-100 group-hover:opacity-50"
							>
								{new Date().toLocaleString('es-ES')}
							</div>
						</div>

						<div class="chat chat-start group">
							<div class="flex flex-col p-3">
								<div class="prose prose-code:px-0">
									<p>Machine learning algorithms can be categorized into several types:</p>
									<ol>
										<li>
											<span class="bg-secondary/20 border-secondary/30 rounded border px-1"
												>Supervised Learning</span
											>
										</li>
										<li>
											<span class="bg-secondary/20 border-secondary/30 rounded border px-1"
												>Unsupervised Learning</span
											>
										</li>
										<li>Reinforcement Learning</li>
										<li>Deep Learning</li>
									</ol>
								</div>

								<div
									class="mt-3 flex h-max items-center gap-4 place-self-start font-mono text-xs opacity-0 transition-opacity duration-100 group-hover:opacity-100"
								>
									<span class="opacity-50">
										{new Date().toLocaleString('es-ES')}
									</span>
									<button
										class="btn btn-xs btn-ghost btn-primary btn-circle relative size-7 opacity-100"
										aria-label="Copy message"
									>
										<span>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="1em"
												height="1em"
												viewBox="0 0 24 24"
												class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg"
											>
												<g fill="currentColor">
													<path
														d="M8.75 6.5h6.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-6.5a.75.75 0 0 1-.75-.75v-.5a.75.75 0 0 1 .75-.75Z"
													></path>
													<path
														fill-rule="evenodd"
														d="M5.25 3.5h13.5a1.75 1.75 0 0 1 1.75 1.75v13.5a1.75 1.75 0 0 1-1.75 1.75H5.25a1.75 1.75 0 0 1-1.75-1.75V5.25a1.75 1.75 0 0 1 1.75-1.75Zm.25 2v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.5a.25.25 0 0 0-.25-.25H5.75a.25.25 0 0 0-.25.25Z"
														clip-rule="evenodd"
													></path>
													<path
														d="M8.75 10h6.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-6.5a.75.75 0 0 1-.75-.75v-.5a.75.75 0 0 1 .75-.75Z"
													></path>
													<path
														d="M8.75 13.5h6.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-6.5a.75.75 0 0 1-.75-.75v-.5a.75.75 0 0 1 .75-.75Z"
													></path>
												</g>
											</svg>
										</span>
									</button>

									<button
										class="btn btn-xs btn-ghost btn-primary btn-circle size-7 opacity-100"
										aria-label="Branch conversation"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="1em"
											height="1em"
											viewBox="0 0 24 24"
											class="text-lg"
										>
											<g fill="currentColor">
												<path
													d="M2.75 19.25a.75.75 0 0 1 .75-.75h17a.75.75 0 0 1 0 1.5h-17a.75.75 0 0 1-.75-.75Z"
												></path>
												<path
													d="M6.75 3.25a1.75 1.75 0 0 0-1.75 1.75v11a1.75 1.75 0 0 0 1.75 1.75h10.5a1.75 1.75 0 0 0 1.75-1.75v-11a1.75 1.75 0 0 0-1.75-1.75h-10.5Zm5.97 6.06-1.97-1.97v6.88a.75.75 0 0 1-1.5 0V7.34l-1.97 1.97a.75.75 0 1 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 1 1-1.06 1.06Z"
												></path>
											</g>
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{#if loading}
					<div class="mt-4 flex justify-center">
						<span class="loading loading-spinner loading-lg"></span>
					</div>
				{:else if user}
					<!-- User is already logged in -->
					<button class="btn btn-primary mt-4 w-full" onclick={() => goto('/chat')}>
						Continue Chatting, {user?.user_metadata?.full_name || 'User'}
					</button>
				{:else}
					<!-- User is not logged in -->
					<div class="mt-4 flex flex-col gap-4">
						<button class="btn btn-primary w-full" onclick={handleGoogleLogin}>
							<Icon icon="simple-icons:google" />
							Sign In with Google
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
