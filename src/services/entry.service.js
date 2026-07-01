/**
 * services/entry.service.js
 * local storage persisted diary entry service prefilled with 26+ rich developer logs.
 */

const defaultEntries = [
  {
    id: 1,
    title: 'Understanding React Server Components',
    description: 'Explored the architectural differences between Client Components and Server Components in React 19. RSCs render exclusively on the server, producing a serialized JSON stream instead of HTML. This avoids sending hydration code to the client and dramatically reduces bundle sizes. Client components can be nested inside server components using the children pattern, maintaining interactivity where needed.',
    tech: 'React',
    difficulty: 'Advanced',
    date: '2026-06-30',
    tags: ['React', 'Next.js', 'SSR', 'Performance'],
    takeaways: 'Server components do not hydrate, reducing client bundles.\nUse Server Actions to handle form mutations and direct database queries securely.\nImport Client Components at the leaves of your component tree to maximize server-side performance.',
    resource: 'https://react.dev/reference/react/components',
    pinned: true,
    favorite: true,
    lastEdited: '2026-06-30T10:14:00.000Z',
    readingTime: 3
  },
  {
    id: 2,
    title: 'CSS Grid Subgrid Layouts',
    description: 'Subgrid allows a nested grid to inherit the track definitions (columns and rows) of its parent grid. This solves the long-standing alignment issue where items within sibling cards could not easily align to each other because card content heights varied. By setting grid-template-columns: subgrid, nested grids can stretch to match parent tracks.',
    tech: 'CSS',
    difficulty: 'Intermediate',
    date: '2026-06-29',
    tags: ['CSS', 'Layout', 'Grid', 'Subgrid'],
    takeaways: 'Subgrid aligns nested cells to parent grid columns directly.\nRequires setting grid-column or grid-row line coordinates explicitly.\nFully supported in modern major engines including Chromium and Firefox.',
    resource: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid',
    pinned: true,
    favorite: false,
    lastEdited: '2026-06-29T14:22:00.000Z',
    readingTime: 2
  },
  {
    id: 3,
    title: 'Prisma Client Custom Extensions',
    description: 'Investigated Prisma client extensions to add custom helper models and calculated fields. Instead of writing custom helper util functions to format a full user name, we can extend the Prisma user model directly to return a calculated full name computed from firstName and lastName variables.',
    tech: 'Database',
    difficulty: 'Intermediate',
    date: '2026-06-28',
    tags: ['Prisma', 'Database', 'ORM', 'Node.js'],
    takeaways: 'Client extensions extend models or introduce custom queries cleanly.\nAvoids boilerplate query wrappers on raw clients.\nSimplifies computed model attributes.',
    resource: 'https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions',
    pinned: false,
    favorite: true,
    lastEdited: '2026-06-28T09:12:00.000Z',
    readingTime: 2
  },
  {
    id: 4,
    title: 'Vite Rollup Hook Lifecycle Transforms',
    description: 'Analyzed Vite plugins to inject dynamic meta headers. Vite uses Rollup plugin build hooks (such as options, buildStart, resolveId, and load) and transform hooks to alter HTML index files. Using transformIndexHtml permits clean script injection before files are shipped to the client.',
    tech: 'Build Tools',
    difficulty: 'Advanced',
    date: '2026-06-27',
    tags: ['Vite', 'Build', 'Rollup', 'Developer-Experience'],
    takeaways: 'Vite shares Rollup hooks interface for compilation.\ntransformIndexHtml lets plugins inject dynamic meta scripts.\nUse configResolved hook to retrieve final computed config parameters.',
    resource: 'https://vite.dev/guide/api-plugin.html',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-27T16:40:00.000Z',
    readingTime: 3
  },
  {
    id: 5,
    title: 'JWT Access and Refresh Token Security',
    description: 'Implemented access and refresh token authentication flows in Express. The best practice is storing the short-lived access token in memory (React state) and the long-lived refresh token in a HttpOnly, Secure, SameSite=Strict cookie to guard against XSS and CSRF attacks.',
    tech: 'Security',
    difficulty: 'Advanced',
    date: '2026-06-26',
    tags: ['Security', 'JWT', 'Auth', 'Express.js'],
    takeaways: 'Access tokens should be short-lived (e.g., 15 minutes) and memory-only.\nRefresh tokens belong in secure, HTTP-only cookies and map to DB sessions.\nRevoking refresh sessions on logouts prevents token reuse.',
    resource: 'https://jwt.io/introduction',
    pinned: false,
    favorite: true,
    lastEdited: '2026-06-26T18:05:00.000Z',
    readingTime: 4
  },
  {
    id: 6,
    title: 'TypeScript Utility Types Mastery',
    description: 'Practiced TypeScript built-in utility types. Pick creates a type by picking selected keys from an existing interface; Omit removes keys; and Partial converts all attributes to optional types which is extremely useful for database PATCH payloads.',
    tech: 'TypeScript',
    difficulty: 'Beginner',
    date: '2026-06-25',
    tags: ['TypeScript', 'Types', 'Developer-Experience'],
    takeaways: 'Pick helps construct cleaner subtype objects.\nOmit extracts unwanted properties from large DTOs.\nPartial simplifies optional updates payloads validation schemas.',
    resource: 'https://www.typescriptlang.org/docs/handbook/utility-types.html',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-25T11:30:00.000Z',
    readingTime: 2
  },
  {
    id: 7,
    title: 'Dockerizing Fullstack React/Express Applications',
    description: 'Created container profiles for development and production environments. Utilizing multi-stage Docker builds allowed setting up lightweight containers that only bundle dependencies and compiled code, reducing raw image sizes from 1GB to less than 150MB.',
    tech: 'DevOps',
    difficulty: 'Intermediate',
    date: '2026-06-24',
    tags: ['Docker', 'DevOps', 'Containers', 'Setup'],
    takeaways: 'Multi-stage builds separate development steps from production outputs.\nUsing node:alpine packages results in lightweight outputs.\nBind mounts facilitate real-time source syncing in development.',
    resource: 'https://docs.docker.com/get-started/',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-24T15:20:00.000Z',
    readingTime: 3
  },
  {
    id: 8,
    title: 'Git Rebase vs Merge Trade-offs',
    description: 'Studied VCS branch alignment workflows. Rebasing rewrites the commit history by applying your branch commits on top of the parent branch, keeping the tree linear. Merging preserves actual commit sequences but creates cluttering merge loops in shared histories.',
    tech: 'Git',
    difficulty: 'Beginner',
    date: '2026-06-23',
    tags: ['Git', 'VCS', 'Workflow'],
    takeaways: 'Rebase creates a clean, linear git commit history.\nNever rebase shared public branches as it alters commit hashes.\nUse merge commits for final production releases audits.',
    resource: 'https://git-scm.com/book/en/v2/Git-Branching-Rebasing',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-23T10:00:00.000Z',
    readingTime: 2
  },
  {
    id: 9,
    title: 'JavaScript Event Loop & Async Microtasks',
    description: 'Explored JavaScript single-threaded concurrency execution. Microtasks (Promises, QueueMicrotask) execute before Macrotasks (setTimeout, setInterval, postMessage). Understanding this order prevents rendering blocking issues and sluggish web app responses.',
    tech: 'JavaScript',
    difficulty: 'Advanced',
    date: '2026-06-22',
    tags: ['JavaScript', 'Async', 'Event-Loop'],
    takeaways: 'Promises and mutation observers compile in the Microtask queue.\nMacrotasks run after microtask queues are completely cleared.\nBlocking main threads prevents browser paint updates cycles.',
    resource: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-22T12:00:00.000Z',
    readingTime: 3
  },
  {
    id: 10,
    title: 'RTK Query Integration in React apps',
    description: 'Configured Redux Toolkit Query to manage server states. RTK Query handles query cache invalidations, polling intervals, duplicate request avoidance, loading statuses, and mutations, completely eliminating manual useEffect API calling code.',
    tech: 'React',
    difficulty: 'Intermediate',
    date: '2026-06-21',
    tags: ['React', 'Redux', 'State-Management', 'API'],
    takeaways: 'RTK Query handles loading, caching, and error statuses natively.\nUse cache tags list configuration to trigger automatic mutations refetches.\nImproves performance by avoiding duplicate background requests.',
    resource: 'https://redux-toolkit.js.org/rtk-query/overview',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-21T09:45:00.000Z',
    readingTime: 3
  },
  {
    id: 11,
    title: 'Tailwind CSS Custom Theme Extensions',
    description: 'Configured custom screen break ranges, brand colors, and animations inside tailwind.config.js. Utilizing arbitrary values (e.g. w-[342px]) simplifies fine-tuning styles without leaving HTML templates markup.',
    tech: 'CSS',
    difficulty: 'Beginner',
    date: '2026-06-20',
    tags: ['CSS', 'Tailwind', 'Responsive'],
    takeaways: 'Extend tailwind config files to reuse theme elements.\nUse arbitrary values only for exceptional structural modifications.\nPreflight overrides reset standard browser layout margins.',
    resource: 'https://tailwindcss.com/docs/configuration',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-20T11:15:00.000Z',
    readingTime: 2
  },
  {
    id: 12,
    title: 'Node.js Streams and Large File Uploads',
    description: 'Learned to parse heavy file arrays in Node server controllers. Standard fs.readFile parses files entirely into memory buffers, which can crash server memory allocation blocks. Utilizing pipeline streams resolves this memory overhead by processing chunks sequentially.',
    tech: 'Node.js',
    difficulty: 'Advanced',
    date: '2026-06-19',
    tags: ['Node.js', 'Streams', 'Backend'],
    takeaways: 'Streams avoid reading huge files entirely into memory buffers.\nUse stream.pipeline to handle errors cleanly.\nWrite custom Writable streams to process payloads sequentially.',
    resource: 'https://nodejs.org/api/stream.html',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-19T14:50:00.000Z',
    readingTime: 4
  },
  {
    id: 13,
    title: 'Accessible WAI-ARIA Modal Components',
    description: 'Built a React overlay modal focusing on screen-reader accessibility. Implemented tab key traps, keyboard escape listener hooks, role=dialog tags, and aria-describedby bindings to ensure keyboard users navigate the dialog cleanly.',
    tech: 'HTML',
    difficulty: 'Intermediate',
    date: '2026-06-18',
    tags: ['HTML', 'Accessibility', 'React', 'ARIA'],
    takeaways: 'Accessible modals must trap user tab focus inside dialog panels.\nPressing Escape key must trigger dialog exit callbacks.\nRender overlay background content using aria-hidden tags.',
    resource: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-18T17:30:00.000Z',
    readingTime: 3
  },
  {
    id: 14,
    title: 'Redis Caching for Express Endpoints',
    description: 'Optimized server routes using Redis memory caching. Storing DB outputs inside Redis keyed by URI parameters reduces response speeds from 250ms to 4ms for subsequent identical queries.',
    tech: 'Other',
    difficulty: 'Intermediate',
    date: '2026-06-17',
    tags: ['Redis', 'Caching', 'Performance', 'Backend'],
    takeaways: 'Cache DB outputs for routes with high-read frequencies.\nEnsure cache invalidations occur during database updates.\nMemory caches significantly lower load requirements on core DB servers.',
    resource: 'https://redis.io/docs/',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-17T11:00:00.000Z',
    readingTime: 3
  },
  {
    id: 15,
    title: 'PostgreSQL Database Index Strategy',
    description: 'Studied index architectures in relational engines. PostgreSQL utilizes B-Tree indexes for standard range queries; GIN indexes for array lookups; and Hash indexes for exact matches. Adding indexes speeds up reads but incurs write performance costs.',
    tech: 'Database',
    difficulty: 'Advanced',
    date: '2026-06-16',
    tags: ['Database', 'SQL', 'Postgres', 'Optimization'],
    takeaways: 'B-Tree is the default index type covering standard sorting lookups.\nGIN indexes are highly efficient for multi-value arrays fields.\nAvoid over-indexing tables to preserve write performance speeds.',
    resource: 'https://www.postgresql.org/docs/current/indexes.html',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-16T15:10:00.000Z',
    readingTime: 4
  },
  {
    id: 16,
    title: 'Zustand Global State Management',
    description: 'Migrated a component state architecture to Zustand. Unlike Redux, Zustand does not require verbose action dispatches, boilerplate configurations, or Context provider wrappers. It offers clean, React hook-based global stores.',
    tech: 'React',
    difficulty: 'Beginner',
    date: '2026-06-15',
    tags: ['React', 'Zustand', 'State-Management'],
    takeaways: 'Zustand provides a minimal, boilerplate-free state manager.\nRetrieves slices using selectors to avoid unnecessary renders.\nEasy to configure offline storage sync with middleware.',
    resource: 'https://zustand-demo.pmnd.rs/',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-15T10:30:00.000Z',
    readingTime: 2
  },
  {
    id: 17,
    title: 'Express Route Input Validations',
    description: 'Configured request parameters checking using Express-Validator. Intercepting inputs inside route middlewares stops invalid JSON parameters from reaching business logic layers, protecting databases from injection or formatting errors.',
    tech: 'Node.js',
    difficulty: 'Intermediate',
    date: '2026-06-14',
    tags: ['Express.js', 'Node.js', 'Security', 'Validation'],
    takeaways: 'Sanitize query and body inputs before passing them to DB queries.\nMiddlewares block invalid formats and return 400 Bad Request.\nKeeps validation rules decoupled from database controllers.',
    resource: 'https://express-validator.github.io/docs/',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-14T11:40:00.000Z',
    readingTime: 2
  },
  {
    id: 18,
    title: 'Flexbox Layout: grow, shrink, basis',
    description: 'Cleared up CSS flex alignment properties. Flex-basis specifies initial component dimensions before space allocation; flex-grow sets how items expand to fill extra space; and flex-shrink details how elements shrink to fit containers.',
    tech: 'CSS',
    difficulty: 'Beginner',
    date: '2026-06-13',
    tags: ['CSS', 'Layout', 'Flexbox'],
    takeaways: 'Flex-basis sets initial sizing boundaries before calculations.\nFlex-grow controls relative space allocation on larger grids.\nFlex-shrink defaults to 1, causing items to contract by default.',
    resource: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-13T09:15:00.000Z',
    readingTime: 2
  },
  {
    id: 19,
    title: 'Socket.io WebSockets for Real-Time Apps',
    description: 'Built a real-time messaging server using WebSockets. Compared to standard HTTP polling, WebSockets open persistent TCP connections, enabling instantaneous client-server updates with minimal header overhead.',
    tech: 'Node.js',
    difficulty: 'Intermediate',
    date: '2026-06-12',
    tags: ['WebSockets', 'Real-Time', 'Node.js'],
    takeaways: 'WebSockets maintain full-duplex channels over single TCP sockets.\nSocket.io provides fallback mechanisms when sockets fail.\nUseful for real-time applications like chats and live notifications.',
    resource: 'https://socket.io/docs/v4/',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-12T16:00:00.000Z',
    readingTime: 3
  },
  {
    id: 20,
    title: 'ESLint and Prettier Setup Guide',
    description: 'Configured lint checking rules to enforce styling consistency. Combined ESLint formatting errors with Prettier syntax cleanups, ensuring clean codes commit into repositories automatically.',
    tech: 'Build Tools',
    difficulty: 'Beginner',
    date: '2026-06-11',
    tags: ['ESLint', 'Prettier', 'Linting', 'Setup'],
    takeaways: 'ESLint focuses on code quality and patterns errors.\nPrettier handles file formatting rules (indentation, semicolons).\nConfigure pre-commit hooks using Husky to block lint errors.',
    resource: 'https://prettier.io/docs/en/comparison.html',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-11T10:10:00.000Z',
    readingTime: 2
  },
  {
    id: 21,
    title: 'React Window Resize Debounce Hook',
    description: 'Created a reusable custom hook, useWindowSize, that returns screen dimensions. Integrated requestAnimationFrame and debouncing functions to prevent expensive state triggers on every pixel adjustment.',
    tech: 'React',
    difficulty: 'Intermediate',
    date: '2026-06-10',
    tags: ['React', 'Hooks', 'JavaScript', 'Performance'],
    takeaways: 'Debounce window resize actions to save CPU cycles.\nRemove event listeners in hooks return blocks to prevent memory leaks.\nImproves layout calculation performance.',
    resource: 'https://react.dev/learn/reusing-logic-with-custom-hooks',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-10T14:30:00.000Z',
    readingTime: 2
  },
  {
    id: 22,
    title: 'Unit Testing with Vitest and RTL',
    description: 'Wrote unit tests for React components using Vitest. Used React Testing Library to query DOM elements by user accessibility labels rather than raw CSS selectors, producing robust test cases.',
    tech: 'Build Tools',
    difficulty: 'Intermediate',
    date: '2026-06-09',
    tags: ['Testing', 'Vitest', 'React', 'QA'],
    takeaways: 'Vitest provides a fast Jest alternative that shares Vite config files.\nReact Testing Library queries elements using accessibility roles.\nMock external APIs using MSW to preserve offline unit tests.',
    resource: 'https://vitest.dev/guide/',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-09T11:20:00.000Z',
    readingTime: 3
  },
  {
    id: 23,
    title: 'Express App Security with Helmet.js',
    description: 'Secured HTTP headers on Express nodes using Helmet. Helmet automatically configures X-Frame-Options to block clickjacking, resets X-Powered-By variables to obscure server architecture, and maps Content Security Policies.',
    tech: 'Security',
    difficulty: 'Beginner',
    date: '2026-06-08',
    tags: ['Express.js', 'Security', 'Helmet', 'Node.js'],
    takeaways: 'Helmet configures HTTP headers to protect against common web attacks.\nRestricts frames permissions to prevent clickjacking injections.\nConfigure explicit Content Security Policies (CSP) to block malicious scripts.',
    resource: 'https://helmetjs.github.io/',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-08T09:40:00.000Z',
    readingTime: 2
  },
  {
    id: 24,
    title: 'CSS Container Queries Deep Dive',
    description: 'Investigated CSS Container Queries (`@container`) which query the parent components sizing bounds directly rather than browser windows widths. This allows layout blocks to format themselves differently depending on where they reside.',
    tech: 'CSS',
    difficulty: 'Advanced',
    date: '2026-06-07',
    tags: ['CSS', 'Container-Queries', 'Responsive'],
    takeaways: 'Container queries enable component-relative styling controls.\nRequires setting container-type: inline-size on target containers.\nHighly useful for modular components like lists.',
    resource: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-07T15:55:00.000Z',
    readingTime: 3
  },
  {
    id: 25,
    title: 'MongoDB Aggregation Query Pipeline',
    description: 'Practiced advanced NoSQL queries inside MongoDB aggregation controllers. Chained $match, $group, $sort, and $project steps to filter, group, and calculate total entries on databases.',
    tech: 'Database',
    difficulty: 'Advanced',
    date: '2026-06-06',
    tags: ['MongoDB', 'Database', 'NoSQL', 'Queries'],
    takeaways: 'Aggregation pipelines compose sequential stages to transform records.\nUse $match early in the chain to utilize database indexes.\n$project maps final outputs fields, reducing network sizes.',
    resource: 'https://www.mongodb.com/docs/manual/aggregation/',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-06T13:10:00.000Z',
    readingTime: 3
  },
  {
    id: 26,
    title: 'CSS Variables Custom Themes Dynamic Setup',
    description: 'Implemented multi-theme layouts utilizing global CSS Custom Properties. Binding themes styles to data attributes (e.g. data-theme="dark") allows real-time theming adjustments via simple JavaScript selectors edits.',
    tech: 'CSS',
    difficulty: 'Beginner',
    date: '2026-06-05',
    tags: ['CSS', 'Variables', 'Theming'],
    takeaways: 'CSS variables compute dynamically, allowing real-time CSS changes.\nBind theme values to :root variables to handle styles globally.\nDefine fallback overrides values to prevent style breakages.',
    resource: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties',
    pinned: false,
    favorite: false,
    lastEdited: '2026-06-05T10:00:00.000Z',
    readingTime: 2
  }
]

const defaultProfile = {
  name: 'John Doe',
  email: 'john@example.com',
  bio: 'Full-stack developer passionate about building clean, accessible user interfaces and exploring new JavaScript frameworks.',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=2563EB',
  joined: 'Oct 01, 2025',
  skills: ['React', 'TypeScript', 'Node.js', 'CSS Grid', 'Express.js', 'Docker', 'Git'],
  interests: ['Open Source', 'Web Performance', 'System Architecture', 'Design Systems'],
  targetEntriesMonth: 12
}

// Helper to initialize database in localStorage
const initStorage = () => {
  if (!localStorage.getItem('devdiary_entries')) {
    localStorage.setItem('devdiary_entries', JSON.stringify(defaultEntries))
  }
  if (!localStorage.getItem('devdiary_profile')) {
    localStorage.setItem('devdiary_profile', JSON.stringify(defaultProfile))
  }
}

export const entryService = {
  getAll: async () => {
    initStorage()
    const entries = JSON.parse(localStorage.getItem('devdiary_entries'))
    // Sort pinned entries first, then newest date first
    return entries.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.date) - new Date(a.date)
    })
  },

  getById: async (id) => {
    initStorage()
    const entries = JSON.parse(localStorage.getItem('devdiary_entries'))
    return entries.find(e => e.id === parseInt(id) || e.id === id) || null
  },

  create: async (entryData) => {
    initStorage()
    const entries = JSON.parse(localStorage.getItem('devdiary_entries'))
    const newEntry = {
      ...entryData,
      id: Date.now(),
      pinned: entryData.pinned || false,
      favorite: entryData.favorite || false,
      lastEdited: new Date().toISOString(),
      readingTime: Math.max(1, Math.ceil(entryData.description.split(/\s+/).length / 200))
    }
    entries.push(newEntry)
    localStorage.setItem('devdiary_entries', JSON.stringify(entries))
    return newEntry
  },

  update: async (id, data) => {
    initStorage()
    const entries = JSON.parse(localStorage.getItem('devdiary_entries'))
    const index = entries.findIndex(e => e.id === parseInt(id) || e.id === id)
    if (index === -1) throw new Error('Entry not found')
    
    // Recalculate reading time if description changes
    const updatedDescription = data.description !== undefined ? data.description : entries[index].description
    const readingTime = Math.max(1, Math.ceil(updatedDescription.split(/\s+/).length / 200))

    entries[index] = {
      ...entries[index],
      ...data,
      lastEdited: new Date().toISOString(),
      readingTime
    }
    localStorage.setItem('devdiary_entries', JSON.stringify(entries))
    return entries[index]
  },

  delete: async (id) => {
    initStorage()
    let entries = JSON.parse(localStorage.getItem('devdiary_entries'))
    entries = entries.filter(e => e.id !== parseInt(id) && e.id !== id)
    localStorage.setItem('devdiary_entries', JSON.stringify(entries))
    return true
  },

  getProfile: async () => {
    initStorage()
    return JSON.parse(localStorage.getItem('devdiary_profile'))
  },

  updateProfile: async (data) => {
    initStorage()
    const profile = JSON.parse(localStorage.getItem('devdiary_profile'))
    const updated = { ...profile, ...data }
    localStorage.setItem('devdiary_profile', JSON.stringify(updated))
    return updated
  },

  getDashboardStats: async () => {
    initStorage()
    const entries = JSON.parse(localStorage.getItem('devdiary_entries'))
    const profile = JSON.parse(localStorage.getItem('devdiary_profile'))
    
    const totalEntries = entries.length
    
    // Entries added this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const entriesThisWeek = entries.filter(e => new Date(e.date) >= oneWeekAgo).length
    
    // Technology distribution counts
    const techDistribution = {}
    entries.forEach(e => {
      techDistribution[e.tech] = (techDistribution[e.tech] || 0) + 1
    })
    
    // Favorite technology
    let favoriteTech = 'None'
    let maxCount = 0
    Object.keys(techDistribution).forEach(t => {
      if (techDistribution[t] > maxCount) {
        maxCount = techDistribution[t]
        favoriteTech = t
      }
    })

    // Calculate learning streak
    // Check consecutive days of entries up to today
    const uniqueDates = [...new Set(entries.map(e => e.date))].sort().reverse()
    let currentStreak = 0
    let todayStr = new Date().toISOString().split('T')[0]
    let yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    
    // If today or yesterday has entries, we count consecutive days going back
    if (uniqueDates.includes(todayStr) || uniqueDates.includes(yesterdayStr)) {
      let checkDate = uniqueDates.includes(todayStr) ? new Date() : new Date(Date.now() - 86400000)
      while (true) {
        const checkStr = checkDate.toISOString().split('T')[0]
        if (uniqueDates.includes(checkStr)) {
          currentStreak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }
    }

    // Weekly activity progress (entries per day of the current week: Mon-Sun)
    // Map to last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().split('T')[0]
    })
    
    const weeklyChartData = last7Days.map(dateStr => {
      const count = entries.filter(e => e.date === dateStr).length
      const options = { weekday: 'short' }
      const label = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', options)
      return { label, count }
    })

    // Monthly learning goal completion (entries logged in this calendar month)
    const thisMonth = new Date().getMonth()
    const thisYear = new Date().getFullYear()
    const monthlyLogged = entries.filter(e => {
      const d = new Date(e.date + 'T00:00:00')
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear
    }).length

    return {
      totalEntries,
      entriesThisWeek,
      favoriteTech,
      currentStreak,
      monthlyLogged,
      monthlyGoal: profile.targetEntriesMonth,
      weeklyChartData,
      techDistribution
    }
  }
}

export default entryService
