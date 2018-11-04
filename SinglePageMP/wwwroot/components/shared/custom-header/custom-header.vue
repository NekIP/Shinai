<template>
	<div class="custom-header">
		<header>
			<div class="logo-container">
				<div class="logo">
					<a class="logo-link" href="#"></a>
				</div>
			</div>
			<div class="header-items-container">
				<custom-header-dropdown :data="headerItems.performanceReporting">
					<span 	slot="header-name" 
							slot-scope="{ headerName }" 
							class="icon-performance-reporting">
						{{headerName}}
					</span>
				</custom-header-dropdown>
				<custom-header-dropdown :data="headerItems.myWebsites">
					<span 	slot="header-name" 
							slot-scope="{ headerName }" 
							class="icon-my-websites">
						{{headerName}}
					</span>
				</custom-header-dropdown>
				<custom-header-dropdown :data="headerItems.financialDetails">
					<span 	slot="header-name" 
							slot-scope="{ headerName }" 
							class="icon-financial-details">
						{{headerName}}
					</span>
				</custom-header-dropdown>
				<custom-header-dropdown :data="headerItems.myConsumers">
					<span 	slot="header-name" 
							slot-scope="{ headerName }" 
							class="icon-my-consumers">
						{{headerName}}
					</span>
				</custom-header-dropdown>
			</div>
		</header>
		<side-navigation-menu :items="headerItems.performanceReporting.children"></side-navigation-menu>
	</div>
</template>
<script src="./custom-header.js"></script>
<style src="./custom-header.scss" lang="scss"></style>