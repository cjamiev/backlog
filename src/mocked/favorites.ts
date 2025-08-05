import { type Favorite } from '../model/entertainment';

export const mockedFavorites: Favorite[] = [
  {
    name: 'React Documentation',
    link: 'https://react.dev',
    type: 'Programming',
    tags: 'code, ui, doc',
    notes: 'Official React documentation with tutorials and API reference'
  },
  {
    name: 'Spotify',
    link: 'https://open.spotify.com',
    type: 'Music',
    tags: 'music',
    notes: 'Music streaming service with personalized playlists'
  },
  {
    name: 'GitHub',
    link: 'https://github.com',
    type: 'Programming',
    tags: 'code',
    notes: 'Code hosting platform for version control and collaboration'
  },
  {
    name: 'DeviantArt',
    link: 'https://deviantart.com',
    type: 'Art',
    tags: 'inspiration',
    notes: 'Online art community for artists and art enthusiasts'
  },
  {
    name: 'Steam',
    link: 'https://store.steampowered.com',
    type: 'Game',
    tags: 'gaming',
    notes: 'Digital distribution platform for PC games'
  },
  {
    name: 'Stack Overflow',
    link: 'https://stackoverflow.com',
    type: 'Programming',
    tags: 'programming',
    notes: 'Q&A platform for programmers and developers'
  },
  {
    name: 'Behance',
    link: 'https://behance.net',
    type: 'Art',
    tags: 'inspiration',
    notes: 'Creative portfolio platform for designers and artists'
  },
  {
    name: 'MDN Web Docs',
    link: 'https://developer.mozilla.org',
    type: 'Programming',
    tags: 'code, doc',
    notes: 'Comprehensive web development documentation'
  },
  {
    name: 'ArtStation',
    link: 'https://artstation.com',
    type: 'Art',
    tags: 'inspiration',
    notes: 'Professional portfolio platform for digital artists'
  },
  {
    name: 'CodePen',
    link: 'https://codepen.io',
    type: 'Programming',
    tags: 'code',
    notes: 'Online code editor for front-end development'
  },
  {
    name: 'Pinterest',
    link: 'https://pinterest.com',
    type: 'Art',
    tags: 'inspiration',
    notes: 'Visual discovery engine for finding ideas and inspiration'
  },
  {
    name: 'Dribbble',
    link: 'https://dribbble.com',
    type: 'Art',
    tags: 'code, inspiration',
    notes: 'Design community for UI/UX designers'
  },
  {
    name: 'itch.io',
    link: 'https://itch.io',
    type: 'Game',
    tags: 'game',
    notes: 'Platform for indie game developers and players'
  },
  {
    name: 'CSS-Tricks',
    link: 'https://css-tricks.com',
    type: 'Programming',
    tags: 'doc, code, inspiration',
    notes: 'Web development blog focused on CSS and front-end'
  },
  {
    name: 'Figma',
    link: 'https://figma.com',
    type: 'Art',
    tags: 'code, inspiration',
    notes: 'Collaborative interface design tool'
  },
];

export const mockedFavoriteTypes: string[] = ['Art', 'Programming', 'Music', 'Game'];