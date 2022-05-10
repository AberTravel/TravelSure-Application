<!-- Client-side -->
<script lang="ts">
	export let modalTitle = '';
	export let inputModalActive = false;
	export let onSubmit = () => {};
</script>

<input
	type="checkbox"
	id={modalTitle}
	bind:checked={inputModalActive}
	class="modal-toggle"
	style="display: none;"
/>
<div class="modal">
	<div class="modal-box text-primary-content bg-secondary border-2 border-primary">
		<!-- Close -->
		<label
			for={modalTitle}
			class="btn btn-sm btn-circle absolute btn-primary border border-accent right-4 top-4">✕</label
		>

		<!-- Content -->
		<h2 class="font-bold text-center text-2xl md:text-4xl py-5">{modalTitle}</h2>
		<form class="justify-center space-x-5 space-y-5 py-10" on:submit|preventDefault={onSubmit}>
			<slot />
		</form>
	</div>
</div>
