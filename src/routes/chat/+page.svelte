<script>
	import { globalState } from '../../stores/stores.svelte';

	globalState.currentBranches = [];
	globalState.currentMessages = [];
</script>

<main class="prose mx-auto my-10 h-[90vh] w-fit overflow-y-scroll">
	<h2>Welcome to Conduit!</h2>
	<p>
		First of all, make sure to head to <a href="/settings">Settings</a> to setup your OpenRouter key
		to start chatting!
	</p>
	<p>Have fun!</p>

	<h2>A primer on Conduit</h2>
	<p>This chat app is my sumbission to Cloneathon.</p>
	<p>
		It has all the features you would expect: auth and DB setup, markdown rendering, a beautiful
		theme and some animations here and there.
	</p>
	<p>What sets Conduit apart is its <b>branching functionality</b>.</p>
	<p>
		Conversations are rarely linear. If I am trying to learn how WebGL works, and the LLM mentions <i
			>uniforms</i
		>, I will want to dive into that concept. But this is <i>tangent</i> to the concept of WebGL.
		Conduit helps you manage all this context with <b class="text-primary">branches</b>.
	</p>

	<p>
		I engineered branches just as you would expect: the conversation flows linearly until you want
		to branch off from somewhere. Then, an alternative path follows from there. You could still come
		back to the original "parent" conversation and keep going.
	</p>
	<p>
		When sending the messages to the LLM for it to keep up with context, we follow this process:
	</p>
	<ul>
		<li>
			If we are in a branch, we send all the messages of the branch <b>plus</b> all the messages from
			the original conversation up until the message we branched from
		</li>
		<li>
			If we are in a parent conversation, we only send the messages of the parent conversation
		</li>
	</ul>

	<p>
		This keeps the main conversation free of tangent digressions, and helps keep the context clean.
	</p>
	<p>
		Right now, branching is limited to one level, since it made the process easier to think through,
		and helps test if this is really a useful feature or a gimmick.
	</p>
	<p>As a bonus, this comes with some git style visualizations.</p>
	<p>I hope you as much fun using it as I had building it.</p>
	<blockquote>Yours truly, <a href="https://jesirgb.com">Jesús</a></blockquote>
</main>
