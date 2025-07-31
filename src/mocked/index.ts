import { mockedBooks } from "./books"
import { mockedContacts } from "./contacts";
import { mockedCountdowns } from "./countdowns";
import { mockedFavorites } from "./favorites";
import { mockedFilms } from "./films";
import { mockedGames } from "./games";
import { mockedNotes } from "./notes";
import { mockedProjects } from "./projects";
import { mockedShows } from "./shows";
import { mockedSongs } from "./songs";


export const mockedData = [{
  type: 'games',
  data: mockedGames,
},
{
  type: 'songs',
  data: mockedSongs,
},
{
  type: 'films',
  data: mockedFilms,
},
{
  type: 'shows',
  data: mockedShows,
},
{
  type: 'favorites',
  data: mockedFavorites,
},
{
  type: 'books',
  data: mockedBooks,
},
{
  type: 'projects',
  data: mockedProjects,
},
{
  type: 'countdowns',
  data: mockedCountdowns,
},
{
  type: 'contacts',
  data: mockedContacts,
},
{
  type: 'notes',
  data: mockedNotes,
}
]