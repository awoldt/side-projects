import Poll from "../model/poll";
import FreeReponsePoll from "../model/freeReponseModel";
import validator from "validator";
import badWordFilter from "bad-words";
const filter = new badWordFilter();

//THIS FUNCTION IS FOR CREATING NEW MONGO DOCUMENTS ON THE BACKEND
//THE Y PARAMETER IS ALL THE REQ.BODY DATA

module.exports = async (y, poll_type) => {
  console.log("Creating new " + poll_type + " poll");

  if (poll_type === "multiple_choice") {
    //passes all validator measures
    if (validator.isLength(y.poll_data.description, { max: 700 })) {
      const filteredChoices = y.poll_data.response_choices.map((x) => {
        return filter.isProfane(x.text);
      });

      //cannot create poll with any of the response choices having cuss words
      if (filteredChoices.indexOf(true) !== -1) {
        console.log(
          "could not save poll - one or more of responce choices contains curse words"
        );
        return false;
      } else {
        const x = new Poll({
          title: y.poll_data.title,
          tag: y.poll_data.tag,
          tagDisplay: y.poll_data.tagDisplay,
          description: filter.clean(y.poll_data.description),
          type: y.type,
          responseChoices: y.poll_data.response_choices,
          private: y.private_poll,
          private_password: y.private_poll_password,
        });

        try {
          await x.save();
          console.log("poll saved successfully :)");
          return [true, x._id];
        } catch (err) {
          console.log("could not save poll :(");
          console.log(err);
          return false;
        }
      }
    } else {
      console.log(
        "poll data does not pass validator :( (length is more than 700 chars)"
      );
      return false;
    }
  } else if (poll_type === "free_response") {
    const x = new FreeReponsePoll({
      title: y.poll_data.title,
      tag: y.poll_data.tag,
      description: y.poll_data.description,
      type: y.type,
      responses: new Array(),
    });

    try {
      await x.save();
      console.log("poll saved successfully :)");
      return [true, x._id];
    } catch (err) {
      console.log("could not save poll :(");
      console.log(err);
      return false;
    }
  }
};
