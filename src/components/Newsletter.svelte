<script>
	import { onMount } from 'svelte';

	let isNewsletterOpen = true;
	let isSubscribed = 'no';
	onMount(() => {
		isSubscribed = localStorage.getItem('isSubscribed');
		if (isSubscribed === 'subscribed') isNewsletterOpen = false;
	});
	function toggleNewsletter() {
		isNewsletterOpen = !isNewsletterOpen;
	}
	function toggleSubscribe() {
		isSubscribed = 'subscribed';
		localStorage.setItem('isSubscribed', 'subscribed');
	}
</script>