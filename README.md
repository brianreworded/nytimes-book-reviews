URL: https://nytimes-book-reviews.vercel.app/


Tech stack used: Next.js, Prisma, Supabase, NodeJS, Vercel


Username for website: username

Password: password



How I approached the project:


- I decided to use the New York Times books API, and I focused on the section dedicated to book reviews. Due to my tech stack, and given that the pages are password protected, I didn't include a username/password for the API. If I did add the feature, I could add a necessary username/password in the search engine form to access results.

- I focused on trying to get everything to work properly, rather than the design. If you want to see more of my website design intuition, you can see reworded.io or reduction.ai

- I thought it made sense to format results from the NY Times API in a table. This concept made it turn into a project that was made mostly for one person than in a social media type of setting. For these reasons, you can add comments or a rating, but updates for both will occur at once, and you cannot add more than one comment -- that comment will update or override the previous comment. 

- The Create and Update functions are accessible via the homepage (Prisma's upsert function -- /pages/api/add_item.js) . The Delete function is found in the other past reviews page, a place where you can look at your own feedback (accessible at /pages/api/delete_item.js).

- The primary ID system for the NY Times Books did not work for me (all entries were 0s). So, I used the first ISBN code for the books as the ID. In the cases I tried with, it worked well. However, because it is not a normal ID system, there may be circumstances that the code may break.

