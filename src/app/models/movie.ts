export default interface Movie {
    id: number; 
    title: string;
    releaseDate: string; 
    runtime: number;
    originalLanguage: string;
    genres: string[];
    voteAverage: number; 
    voteCount: number;
    posterUrl: string;
    bannerUrl: string;
    overview: string; 
    imdbId?: string; 
    adult: Boolean; 
}
