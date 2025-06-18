<script lang="ts">
	import { onMount } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/client/supabase';
	import type { User } from '@supabase/supabase-js';
	import { globalState } from '../stores/stores.svelte';

	// Landing Page Components
	import HeroSection from '$lib/components/landing/HeroSection.svelte';
	import FeaturesSection from '$lib/components/landing/FeaturesSection.svelte';
	import HowItWorksSection from '$lib/components/landing/HowItWorksSection.svelte';
	import BenefitsSection from '$lib/components/landing/BenefitsSection.svelte';
	import CTASection from '$lib/components/landing/CTASection.svelte';
	import FooterSection from '$lib/components/landing/FooterSection.svelte';

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
		} catch (e: any) {
			console.error('Google login error:', e);
			error = e.message || 'Failed to log in with Google';
			loading = false;
		}
	}

	function handleContinueChat() {
		goto('/chat');
	}

	onMount(() => {
		checkUser();
	});
</script>

<MetaTags
	title="Conduit | Free Open Source AI Chat with Branching"
	titleTemplate="%s | Conduit"
	description="Free and open source AI chat app with conversation branching. Access 50+ models via OpenRouter with your own API key. Explore tangents without losing context."
	canonical="https://conduitchat.app/"
	openGraph={{
		url: 'https://conduitchat.app/',
		title: 'Conduit | Free Open Source AI Chat with Branching',
		description:
			'Free and open source AI chat app with conversation branching. Access 50+ models via OpenRouter with your own API key. Explore tangents without losing context.',
		images: [
			{
				url: 'https://conduitchat.app/og-image.jpg',
				width: 1200,
				height: 630,
				alt: 'Conduit - Free Open Source AI Chat App with Branching'
			}
		],
		siteName: 'Conduit'
	}}
	twitter={{
		creator: '@jesi_rgb',
		cardType: 'summary_large_image',
		title: 'Conduit | Free Open Source AI Chat with Branching',
		description:
			'Free and open source AI chat app with conversation branching. Access 50+ models via OpenRouter with your own API key. Explore tangents without losing context.'
	}}
/>

<HeroSection
	{loading}
	{user}
	onGoogleLogin={handleGoogleLogin}
	onContinueChat={handleContinueChat}
/>

<FeaturesSection />

<HowItWorksSection />

<CTASection
	{loading}
	{user}
	onGoogleLogin={handleGoogleLogin}
	onContinueChat={handleContinueChat}
/>
