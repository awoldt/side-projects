import { Dispatch } from "react";

export default function QuizOptions({
  allowIndex,
  setAllowIndex,
}: {
  allowIndex: boolean;
  setAllowIndex: Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="mt-5">
      <input
        type="checkbox"
        id="indexable_checkbox"
        value="true"
        checked={allowIndex}
        onChange={(e) => {
          setAllowIndex(e.target.checked);
        }}
      />
      <label htmlFor="indexable_checkbox" style={{ marginLeft: "5px" }}>
        Allow indexing
      </label>{" "}
      <p className="text-muted" style={{ display: "inline", fontSize: "14px" }}>
        <i>
          (This will allow your quiz to appear in search like Google and Bing)
        </i>
      </p>
    </div>
  );
}
