<script context="module">
	import { MY_TWITTER_HANDLE, MY_YOUTUBE, REPO_URL } from '$lib/siteConfig';
</script>

<script>
	import '../tailwind.css';
	import Nav from '../components/Nav.svelte';
</script>

<link rel="webmention" href="https://webmention.io/www.swyx.io/webmention" />
<link rel="pingback" href="https://webmention.io/www.swyx.io/xmlrpc" />
<div class="flex flex-col justify-center bg-gray-50 px-4 dark:bg-gray-900 sm:px-8">
	<Nav />
</div>
<main class="flex flex-col justify-center bg-gray-50 px-4 dark:bg-gray-900 sm:px-8">
	<slot />
</main>

<footer class="mx-auto mb-8 flex w-full max-w-4xl flex-col items-start justify-center">
	<hr class="border-1 mb-8 w-full border-gray-200 dark:border-gray-800" />
	<!-- <div class="w-full max-w-4xl grid grid-cols-1 gap-4 pb-16 sm:grid-cols-3"> -->
	<div class="grid w-full max-w-4xl grid-cols-1  gap-4 px-4 pb-16 sm:grid-cols-2 sm:px-8">
		<div class="flex flex-col space-y-4">
			<a class="text-gray-500 transition hover:text-gray-300" href="/">Home</a><a
				class="text-gray-500 transition hover:text-gray-300"
				href="/about">About</a
			>
		</div>
		<div class="flex flex-col space-y-4">
			<a
				class="text-gray-500 transition hover:text-gray-300"
				target="_blank"
				rel="noopener noreferrer"
				href={'https://twitter.com/intent/follow?screen_name=' + MY_TWITTER_HANDLE}>Twitter</a
			><a
				class="text-gray-500 transition hover:text-gray-300"
				target="_blank"
				rel="noopener noreferrer"
				href="https://github.com/kealanparr">GitHub</a
			>
		</div>
		<!-- <div class="flex flex-col space-y-4">
			<a class="text-gray-500 hover:text-gray-600 transition" href="/uses">Uses</a><a
				class="text-gray-500 hover:text-gray-600 transition"
				href="/guestbook">Guestbook</a
			><a class="text-gray-500 hover:text-gray-600 transition" href="/snippets">Snippets</a><a
				class="text-gray-500 hover:text-gray-600 transition"
				href="/tweets">Tweets</a
			>
		</div> -->
	</div>
</footer>
