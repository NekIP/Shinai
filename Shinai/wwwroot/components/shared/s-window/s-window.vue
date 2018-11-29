<template>
	<transition name="window">
		<div class="window-mask">
			<div class="window-wrapper">
				<div v-bind:class="{ 'window-container': true, 'is-expanded': isExpanded }">
					<div class="window-top-bar">
						<h3 class="window-header">Window header</h3>
						<ul class="window-actions">
							<li @click="isExpanded = !isExpanded">
								<i class="fa fa-window-maximize" aria-hidden="true"></i>
							</li>
							<li @click="$emit('close')">
								 <i 
									class="fa fa-window-close" 
									aria-hidden="true"></i>
							</li>         
						</ul>
					</div>

					<div class="window-body">
						<slot>
						</slot>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script src="./s-window.js"></script>
<style lang="scss" src="./s-window.scss" scoped></style>
<style lang="scss" src="./s-window.material.scss" scoped></style>