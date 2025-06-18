<script lang="ts">
	import { createBlurFade } from './animations.js';
	import Icon from '@iconify/svelte';
</script>

<!-- How It Works Section -->
<section class="bg-base-200 py-20">
	<div class="container mx-auto max-w-6xl px-4">
		<div class="mb-16 text-center">
			<div use:createBlurFade={{ delay: 0.1 }}>
				<h2 class="text-base-content mb-6 text-4xl font-bold">How conversation branching works</h2>
			</div>
		</div>

		<div class="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
			<div use:createBlurFade={{ delay: 0.1 }} class="group text-center">
				<div
					class="bg-primary text-primary-content mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold transition-transform duration-300 group-hover:scale-110"
				>
					1
				</div>
				<h3 class="text-base-content mb-4 text-xl font-semibold">Select Text</h3>
				<p class="text-base-content/80 text-balance">
					Highlight any text in the AI's response that sparks your curiosity or needs deeper
					exploration.
				</p>
			</div>

			<div use:createBlurFade={{ delay: 0.2 }} class="group text-center">
				<div
					class="bg-primary text-primary-content mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold transition-transform duration-300 group-hover:scale-110"
				>
					2
				</div>
				<h3 class="text-base-content mb-4 text-xl font-semibold">Create Branch</h3>
				<p class="text-base-content/80 text-balance">
					Click the branch button to start a new conversation thread with that selected text as
					context.
				</p>
			</div>

			<div use:createBlurFade={{ delay: 0.3 }} class="group text-center">
				<div
					class="bg-primary text-primary-content mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold transition-transform duration-300 group-hover:scale-110"
				>
					3
				</div>
				<h3 class="text-base-content mb-4 text-xl font-semibold">Explore Freely</h3>
				<p class="text-base-content/80 text-balance">
					Dive deep into tangent topics while keeping your original conversation clean and
					accessible.
				</p>
			</div>
		</div>

		<!-- Visual Example -->
		<div use:createBlurFade={{ delay: 0.4 }} class="mx-auto max-w-5xl">
			<div class="card bg-base-100 border-primary/20 border shadow-2xl">
				<div class="card-body p-8">
					<div class="mb-6 flex items-center gap-3">
						<Icon icon="solar:branch-bold" class="text-primary text-2xl" />
						<h3 class="text-xl font-semibold">Example: Learning WebGL</h3>
					</div>

					<div class="flex gap-4">
						<div class="w-1/2">
							<div class="chat chat-end">
								<div
									class="bg-primary/15 border-primary/30 prose prose-sm max-w-3/4
				self-end rounded-2xl rounded-br-xs border px-4 py-2"
								>
									what's webgl?
								</div>
							</div>
							<div class="chat chat-start">
								<div class="prose prose-sm">
									WebGL Web Graphics Library is a JavaScript API that allows developers to render
									interactive 2D and 3D graphics within web browsers without the need for additional
									plugins. It is based on
									<mark class="font-bold">OpenGL ES (Embedded Systems)</mark>, a subset of the
									OpenGL API designed for embedded devices.
									<br /><br />
									WebGL is widely used for creating games, data visualizations, interactive art, and
									other graphics-intensive web applications. It enables developers to harness the power
									of the {' '}<mark>GPU</mark> (Graphics Processing Unit) for high-performance graphics
									rendering directly within web pages.
								</div>
							</div>
						</div>

						<div
							class="border-subtle bg-base-200/50 w-1/2
							rounded-3xl border py-5
							pl-5"
						>
							<div class="text-muted mb-5">Branch from OpenGL ES (Embedded Systems)</div>
							<div class="chat chat-end">
								<div
									class="bg-primary/15 border-primary/30 prose prose-sm max-w-3/4
				self-end rounded-2xl rounded-br-xs border px-4 py-2"
								>
									> OpenGL ES (Embedded Systems ?
								</div>
							</div>
							<div class="chat chat-start">
								<div class="prose prose-sm">
									OpenGL ES (OpenGL for Embedded Systems) is a subset of the full OpenGL graphics
									API designed specifically for embedded devices such as smartphones, tablets,
									gaming consoles, and other hardware with limited resources. It provides a
									streamlined, efficient set of features optimized for these environments, enabling
									high-performance 3D graphics on devices with constrained processing power and
									memory.
								</div>
							</div>
						</div>
					</div>

					<div class="divider my-1"></div>
					<div class="text-base-content/70 mt-6 max-w-xl text-sm">
						The left conversation talks about WebGL. To the right, a pane explains the concept of
						OpenGL ES (Embedded Systems). AI is great for learning purposes. Sometimes, technical or
						foreign terms can appear. You shouldn't leave any questions unanswered.
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
