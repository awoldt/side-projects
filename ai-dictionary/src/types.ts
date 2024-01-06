//ALL DATA STORED FOR EACH WORD
export interface Word {
  name: string;
  definition: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  history: string[] | null;
  lastUpdated: string;
  createdOn: number;
  model: string;
  referenceLinks?: string[]; //optional, added this property late, some documents will not have this stored in db
}

export interface SearchResults {
  name: string;
}

export interface BrowseList {
  _id: { letter: string };
  words: string[];
}
