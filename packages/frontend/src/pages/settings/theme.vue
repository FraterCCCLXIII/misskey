<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<SearchMarker path="/settings/theme" :label="i18n.ts.theme" :keywords="['theme']" icon="ti ti-palette">
	<div class="_gaps_m">
		<div v-adaptive-border class="rfqxtzch _panel">
			<div class="toggle">
				<div class="toggleWrapper">
					<div class="toggle" :class="store.r.darkMode.value ? 'checked' : null" @click="toggleDarkMode()">
						<span class="before">{{ i18n.ts.light }}</span>
						<span class="after">{{ i18n.ts.dark }}</span>
						<span class="toggle__handler">
							<span class="crater crater--1"></span>
							<span class="crater crater--2"></span>
							<span class="crater crater--3"></span>
						</span>
						<span class="star star--1"></span>
						<span class="star star--2"></span>
						<span class="star star--3"></span>
						<span class="star star--4"></span>
						<span class="star star--5"></span>
						<span class="star star--6"></span>
					</div>
				</div>
			</div>
			<div class="sync">
				<SearchMarker :keywords="['sync', 'device', 'dark', 'light', 'mode']">
					<MkSwitch v-model="syncDeviceDarkMode">
						<template #label><SearchLabel>{{ i18n.ts.syncDeviceDarkMode }}</SearchLabel></template>
					</MkSwitch>
				</SearchMarker>
			</div>
		</div>

		<MkInfo v-if="isSafeMode" warn>{{ i18n.ts.themeIsDefaultBecauseSafeMode }}</MkInfo>

		<div v-else class="_gaps">
			<MkInfo>
				<template #icon><i class="ti ti-palette"></i></template>
				Monochrome themes are automatically applied based on your light/dark mode preference.
			</MkInfo>
		</div>



	</div>
</SearchMarker>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { isSafeMode } from '@@/js/config.js';
import * as os from '@/os.js';
import MkSwitch from '@/components/MkSwitch.vue';
import MkInfo from '@/components/MkInfo.vue';
import { isDeviceDarkmode } from '@/utility/is-device-darkmode.js';
import { store } from '@/store.js';
import { i18n } from '@/i18n.js';
import { definePage } from '@/page.js';
import { prefer } from '@/preferences.js';

const syncDeviceDarkMode = prefer.model('syncDeviceDarkMode');

watch(syncDeviceDarkMode, () => {
	if (syncDeviceDarkMode.value) {
		store.set('darkMode', isDeviceDarkmode());
	}
});

async function toggleDarkMode() {
	const value = !store.r.darkMode.value;
	if (syncDeviceDarkMode.value) {
		const { canceled } = await os.confirm({
			text: i18n.tsx.switchDarkModeManuallyWhenSyncEnabledConfirm({ x: i18n.ts.syncDeviceDarkMode }),
		});
		if (canceled) return;

		syncDeviceDarkMode.value = false;
		store.set('darkMode', value);
	} else {
		store.set('darkMode', value);
	}
}



const headerActions = computed(() => []);

const headerTabs = computed(() => []);

definePage(() => ({
	title: i18n.ts.theme,
	icon: 'ti ti-palette',
}));
</script>



<style lang="scss" scoped>
.rfqxtzch {
	border-radius: 6px;

	> .toggle {
		position: relative;
		padding: 26px 0;
		text-align: center;

		&.disabled {
			opacity: 0.7;

			&, * {
				cursor: not-allowed !important;
			}
		}

		> .toggleWrapper {
			display: inline-block;
			text-align: left;
			overflow: clip;
			padding: 0 100px;
			vertical-align: bottom;
		}

		.toggle {
			cursor: pointer;
			display: inline-block;
			position: relative;
			width: 90px;
			height: 50px;
			margin: 4px; // focus用のアウトライン
			background-color: #83D8FF;
			border-radius: 90px - 6;
			transition: background-color 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95) !important;

			> .before, > .after {
				position: absolute;
				top: 15px;
				transition: color 1s ease;
			}

			> .before {
				left: -70px;
				color: var(--MI_THEME-accent);
			}

			> .after {
				right: -68px;
				color: var(--MI_THEME-fg);
			}

			&.checked {
				background-color: #749DD6;

				> .before {
					color: var(--MI_THEME-fg);
				}

				> .after {
					color: var(--MI_THEME-accent);
				}

				.toggle__handler {
					background-color: #FFE5B5;
					transform: translate3d(40px, 0, 0) rotate(0);

					.crater { opacity: 1; }
				}

				.star--1 {
					width: 2px;
					height: 2px;
				}

				.star--2 {
					width: 4px;
					height: 4px;
					transform: translate3d(-5px, 0, 0);
				}

				.star--3 {
					width: 2px;
					height: 2px;
					transform: translate3d(-7px, 0, 0);
				}

				.star--4,
				.star--5,
				.star--6 {
					opacity: 1;
					transform: translate3d(0,0,0);
				}

				.star--4 {
					transition: all 300ms 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95) !important;
				}

				.star--5 {
					transition: all 300ms 300ms cubic-bezier(0.445, 0.05, 0.55, 0.95) !important;
				}

				.star--6 {
					transition: all 300ms 400ms cubic-bezier(0.445, 0.05, 0.55, 0.95) !important;
				}
			}
		}

		.toggle__handler {
			display: inline-block;
			position: relative;
			z-index: 1;
			top: 3px;
			left: 3px;
			width: 50px - 6;
			height: 50px - 6;
			background-color: #FFCF96;
			border-radius: 50px;
			box-shadow: 0 2px 6px rgba(0,0,0,.3);
			transition: all 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
			transform:  rotate(-45deg);

			.crater {
				position: absolute;
				background-color: #E8CDA5;
				opacity: 0;
				transition: opacity 200ms ease-in-out !important;
				border-radius: 100%;
			}

			.crater--1 {
				top: 18px;
				left: 10px;
				width: 4px;
				height: 4px;
			}

			.crater--2 {
				top: 28px;
				left: 22px;
				width: 6px;
				height: 6px;
			}

			.crater--3 {
				top: 10px;
				left: 25px;
				width: 8px;
				height: 8px;
			}
		}

		.star {
			position: absolute;
			background-color: #ffffff;
			transition: all 300ms cubic-bezier(0.445, 0.05, 0.55, 0.95) !important;
			border-radius: 50%;
		}

		.star--1 {
			top: 10px;
			left: 35px;
			z-index: 0;
			width: 30px;
			height: 3px;
		}

		.star--2 {
			top: 18px;
			left: 28px;
			z-index: 1;
			width: 30px;
			height: 3px;
		}

		.star--3 {
			top: 27px;
			left: 40px;
			z-index: 0;
			width: 30px;
			height: 3px;
		}

		.star--4,
		.star--5,
		.star--6 {
			opacity: 0;
			transition: all 300ms 0 cubic-bezier(0.445, 0.05, 0.55, 0.95) !important;
		}

		.star--4 {
			top: 16px;
			left: 11px;
			z-index: 0;
			width: 2px;
			height: 2px;
			transform: translate3d(3px,0,0);
		}

		.star--5 {
			top: 32px;
			left: 17px;
			z-index: 0;
			width: 3px;
			height: 3px;
			transform: translate3d(3px,0,0);
		}

		.star--6 {
			top: 36px;
			left: 28px;
			z-index: 0;
			width: 2px;
			height: 2px;
			transform: translate3d(3px,0,0);
		}
	}

	> .sync {
		padding: 14px 16px;
		border-top: solid 0.5px var(--MI_THEME-divider);
	}
}
</style>
