<template>
	<div class="s-nav-menu" :class="styleClass">
		<header>
			<div class="logo-container">
				<div class="logo">
					<a class="logo-link" href="#"></a>
				</div>
			</div>
			<div class="header-items-container">
				<s-nav-menu-item class="performance-reporting" :data="headerItems.performanceReporting">
					<span 	slot="header-name" 
							slot-scope="{ headerName }" 
							class="icon-performance-reporting">
						{{headerName}}
					</span>
				</s-nav-menu-item>
				<s-nav-menu-item class="my-websites" :data="headerItems.myWebsites">
					<span 	slot="header-name" 
							slot-scope="{ headerName }" 
							class="icon-my-websites">
						{{headerName}}
					</span>
				</s-nav-menu-item>
				<s-nav-menu-item class="financial-details" :data="headerItems.financialDetails">
					<span 	slot="header-name" 
							slot-scope="{ headerName }" 
							class="icon-financial-details">
						{{headerName}}
					</span>
				</s-nav-menu-item>
				<s-nav-menu-item class="my-consumers" :data="headerItems.myConsumers">
					<span 	slot="header-name" 
							slot-scope="{ headerName }" 
							class="icon-my-consumers">
						{{headerName}}
					</span>
				</s-nav-menu-item>
			</div>
		</header>
		<s-side-nav-menu :items="headerItems.performanceReporting.children">
		</s-side-nav-menu>
	</div>
</template>
<script src="./s-nav-menu.js"></script>
<style src="./s-nav-menu.scss" lang="scss"></style>
<style src="./s-nav-menu.material.scss" lang="scss"></style>