
type Movie = {
  id: number;
  slug: string;
  title: string;
  description: string;
  image_url: string;
  release_date: string;
  duration: number;
  created: string;
  updated: string;
  genres: Genre[];
  crew: MovieCrew[];
}

type Genre = {
  id: number;
  name: string;
  created: string;
  updated: string;
}

type CrewMember = {
  id: number;
  name: string;
  gender: string;
  type: string;
  image_url: string;
  created: string;
  updated: string;
}

type MovieCrew = {
  crew_member: CrewMember;
  order: number;
  role: string;
  character: string;
}

type Review = {
  id: number;
  user: number;
  username: string;
  movie: number;
  rating: number;
  text: string;
  created: string;
  updated: string;
}

type LibraryEntry = {
  id: number;
  movie: Movie;
  status: string;
  created: string;
  updated: string;
}