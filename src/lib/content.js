import { compile } from 'mdsvex';
import { dev } from '$app/env';
import grayMatter from 'gray-matter';
import fetch from 'node-fetch';
import { GH_USER_REPO } from './siteConfig';
import parse from 'parse-link-header';
import slugify from 'slugify';
// import { parse as nodehtmlparse } from 'node-html-parser';

import remarkToc from 'remark-toc';
// import remarkRehype from 'remark-rehype'
// import rehypeDocument from 'rehype-document'
// import rehypeFormat from 'rehype-format'
import remarkGithub from 'remark-github';
import remarkGfm from 'remark-gfm';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutoLink from 'rehype-autolink-headings';

const remarkPlugins = [
	remarkToc,
	[remarkGithub, { repository: 'https://github.com/kealanparr/developer-forge-io' }],
	[remarkGfm, { repository: 'https://github.com/kealanparr/developer-forge-io' }],
];
const rehypePlugins = [
	rehypeStringify,
	rehypeSlug,
	[
		rehypeAutoLink,
		{
			behavior: 'wrap',
			properties: { class: 'hover:text-yellow-100 no-underline' }
		}
	]
];

const allowedPosters = ['kealanparr'];
const publishedTags = ['Published'];
let allBlogposts = [];
// let etag = null // todo - implmement etag header

export async function listBlogposts() {
	// TODO: make sure to handle this better when doing etags or cache restore
	let _allBlogposts = [];
	let next = null;
	let limit = 0; // just a failsafe against infinite loop - feel free to remove
	const authheader = process.env.GH_TOKEN && {
		Authorization: `token ${process.env.GH_TOKEN}`
	};
	do {
		const res = await fetch(
			next?.url ?? `https://api.github.com/repos/${GH_USER_REPO}/issues?state=all&per_page=100`,
			{
				headers: authheader
			}
		);

		const issues = await res.json();
		if (res.status > 400)
			throw new Error(res.status + ' ' + res.statusText + '\n' + (issues && issues.message));
		issues.forEach((issue) => {
			if (
				issue.labels.some((label) => publishedTags.includes(label.name)) &&
				allowedPosters.includes(issue.user.login)
			) {
				_allBlogposts.push(parseIssue(issue));
			}
		});
		const headers = parse(res.headers.get('Link'));
		next = headers && headers.next;
		// } while (limit++ < 1) // just for development
	} while (next && limit++ < 1000); // just a failsafe against infinite loop - feel free to remove
	// _allBlogposts.sort((a, b) => b.date - a.date)
	allBlogposts = _allBlogposts;
	return _allBlogposts;
}

export async function getBlogpost(slug) {
	// get all blogposts if not already done - or in development
	if (dev || allBlogposts.length === 0) {
		console.log('loading allBlogposts');
		allBlogposts = await listBlogposts();
		console.log('loaded ' + allBlogposts.length + ' blogposts');
		if (!allBlogposts.length)
			throw new Error(
				'failed to load blogposts for some reason. check token' + process.env.GH_TOKEN
			);
	}
	if (!allBlogposts.length) throw new Error('no blogposts');
	// find the blogpost that matches this slug
	const blogpost = allBlogposts.find((post) => post.slug === slug);
	if (blogpost) {

		const blogbody = blogpost.content
			.replace(
				// /\n{% youtube (.*?) %}/g,
				/{% youtube (.*?) %}/g,
				(_, x) => {

					// https://stackoverflow.com/a/27728417/1106414
					function youtube_parser(url) {
						var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
						return url.match(rx)[1]
					}
					const videoId = x.startsWith('https://') ? youtube_parser(x) : x;
					return `<iframe
			class="w-full object-contain"
			src="https://www.youtube.com/embed/${videoId}"
			title="video123"
			name="video123"
			allow="accelerometer; autoplay; encrypted-media; gyroscope;
			picture-in-picture"
			frameBorder="0"
			webkitallowfullscreen="true"
			mozallowfullscreen="true"
			width="600"
			height="400"
			allowFullScreen
			aria-hidden="true"></iframe>`}
			)
			.replace(
				// /\n{% (tweet|twitter) (.*?) %}/g,
				/{% (tweet|twitter) (.*?) %}/g,
				(_, _2, x) => {
					const url = x.startsWith('https://twitter.com/') ? x : `https://twitter.com/x/status/${x}`;
					return `
					<blockquote class="twitter-tweet" data-lang="en" data-dnt="true" data-theme="dark">
					<a href="${url}"></a></blockquote> 
					<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
					`
				}
			);

		// compile it with mdsvex
		const content = (
			await compile(blogbody, {
				remarkPlugins,
				rehypePlugins
			})
		).code
			// https://github.com/pngwn/MDsveX/issues/392
			.replace(/>{@html `<code class="language-/g, '><code class="language-')
			.replace(/<\/code>`}<\/pre>/g, '</code></pre>')

		return { ...blogpost, content };
	} else {
		throw new Error('Blogpost not found for slug: ' + slug);
	}
}

function parseIssue(issue) {
	const src = issue.body;
	try {
		const { content, data } = grayMatter(src);
		let title = data.title ?? issue.title;
		let slug;
		if (data.slug) {
			slug = data.slug;
		} else if (data.devToUrl) {
			slug = data.devToUrl.split('/')[4] // if from devto, but no slug, it used the devto slug
		} else {
			slug = slugify(title);
		}
		// let description = data.description ?? nodehtmlparse(content.trim().split('\n')[0]).text;
		let description = data.description ?? content.trim().split('\n')[0];
		// let description = data.description ?? nodehtmlparse('<div id="abc">' +  + '</div>').textContent;
		// (data.content.length > 300) ? data.content.slice(0, 300) + '...' : data.content

		let tags = [];
		if (data.tags)
			tags = Array.isArray(data.tags)
				? data.tags
				: [...data.tags.split(',').map((tag) => tag.trim())];
		else if (data.categories) {
			tags = Array.isArray(data.categories)
				? data.categories
				: [...data.categories.split(',').map((tag) => tag.trim())];
			console.log(`${slug} is still using the categories field`);
		} else {
			// console.log(`WARN: ${slug} has no tags`) // todo: go thru and check thru old content
		}
		tags = tags.map((tag) => tag.toLowerCase());
		// console.log(slug, tags)

		return {
			type: data.category?.toLowerCase() || 'essay',
			content,
			data,
			title,
			subtitle: data.subtitle,
			description,
			tags,
			image: data.image ?? data.cover_image,
			canonical: data.canonical || data.canonical_url, // for canonical URLs of something published elsewhere
			slug: `${slug}`.toLowerCase(),
			date: new Date(data.date ?? data.devToPublishedAt ?? issue.created_at),
			ghMetadata: {
				issueUrl: issue.html_url,
				commentsUrl: issue.comments_url,
				title: issue.title,
				created_at: issue.created_at,
				updated_at: issue.updated_at,
				reactions: issue.reactions
			}
		};
	} catch (err) {
		console.log(issue.title, err);
		throw err;
	}
}
