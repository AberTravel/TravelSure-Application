<!-- Client-side -->
<script lang="ts">
	export let modalTitle = '';
	export let modalMessage = '';
	export let messageModalActive = false;
</script>

<input
	type="checkbox"
	id="messageModal"
	bind:checked={messageModalActive}
	class="modal-toggle"
	style="display: none;"
/>
<div class="modal">
	<div class="modal-box text-primary-content bg-secondary border-2 border-primary">
		<!-- Close -->
		<label
			for="messageModal"
			class="btn btn-sm btn-circle absolute btn-primary border border-accent right-4 top-4">✕</label
		>

		<!-- Content -->
		<h2 class="font-bold text-center text-2xl md:text-4xl py-10">{modalTitle}</h2>
		<form class="flex justify-center space-x-10 py-10">
			<div class="md:px-4 text-base xs:text-lg md:text-xl space-y-5 pb-14">
				<p>
					{modalMessage}
				</p>
			</div>
		</form>
	</div>
</div>
