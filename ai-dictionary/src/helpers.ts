import { create } from "express-handlebars";

export default create({
  helpers: {
    //capitalized the first letter of any string
    capitalize(word: string): string {
      return word.charAt(0).toUpperCase() + word.slice(1);
    },
  },
});
