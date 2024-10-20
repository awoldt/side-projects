export default function ThumbnailInputs() {
  function DisplayImage(
    e: React.ChangeEvent<HTMLInputElement>,
    elementId: string,
    nextImgInput: string | null
  ) {
    /* 
            After user selects image, will display in img tag inside 
            label

            The next image input element will be disabled = false
        */

    const fileInput = e.target;
    if (fileInput.files && fileInput.files[0]) {
      if (fileInput.files[0].size > 5000000) {
        alert("File too large");
      } else {
        const reader = new FileReader();

        reader.readAsDataURL(fileInput.files[0]);

        reader.onload = (r) => {
          document
            .getElementById(elementId)
            ?.setAttribute("src", String(r.target!.result));

          // make the next thumbnail input disabled = false
          if (nextImgInput !== null) {
            (
              document.getElementById(
                `uploaded_app_icon_input_${nextImgInput}`
              ) as HTMLInputElement
            ).disabled = false;
          }
        };
      }
    }
  }

  return (
    <div className="imageHolder">
      <label className="file-label">
        <div>
          <img
            id="uploaded_app_icon_1"
            alt=""
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        </div>
        <p>Image&ensp;</p>

        <img src="/imgs/icons/plus.svg" alt="plus" style={{ width: "8px" }} />

        <input
          accept=".png, .jpeg, .jpg, .webp, .avif, .tiff, .tif"
          className="inputFile"
          type="file"
          name="thumbnail_1"
          onChange={(e) => {
            DisplayImage(e, "uploaded_app_icon_1", "2");
          }}
        />
      </label>

      <label className="file-label-inactive">
        <div>
          <img
            id="uploaded_app_icon_2"
            alt=""
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        </div>
        <p>Image&ensp;</p>
        <img src="/imgs/icons/plus.svg" alt="plus" style={{ width: "8px" }} />
        <img
          id="uploaded_app_icon_2"
          alt=""
          style={{ width: "5px", objectFit: "cover" }}
        />
        <input
          accept=".png, .jpeg, .jpg, .webp, .avif, .tiff, .tif"
          disabled
          className="inputFile"
          type="file"
          id="uploaded_app_icon_input_2"
          name="thumbnail_2"
          onChange={(e) => {
            DisplayImage(e, "uploaded_app_icon_2", "3");
          }}
        />
      </label>

      <label className="file-label-inactive">
        <div>
          <img
            id="uploaded_app_icon_3"
            alt=""
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        </div>
        <p>Image&ensp;</p>
        <img src="/imgs/icons/plus.svg" alt="plus" style={{ width: "8px" }} />
        <img
          id="uploaded_app_icon_3"
          alt=""
          style={{ width: "5px", objectFit: "cover" }}
        />
        <input
          accept=".png, .jpeg, .jpg, .webp, .avif, .tiff, .tif"
          disabled
          className="inputFile"
          type="file"
          id="uploaded_app_icon_input_3"
          name="thumbnail_3"
          onChange={(e) => {
            DisplayImage(e, "uploaded_app_icon_3", "4");
          }}
        />
      </label>

      <label className="file-label-inactive">
        <div>
          <img
            id="uploaded_app_icon_4"
            alt=""
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        </div>
        <p>Image&ensp;</p>
        <img src="/imgs/icons/plus.svg" alt="plus" style={{ width: "8px" }} />
        <img
          id="uploaded_app_icon_4"
          alt=""
          style={{ width: "5px", objectFit: "cover" }}
        />
        <input
          accept=".png, .jpeg, .jpg, .webp, .avif, .tiff, .tif"
          disabled
          className="inputFile"
          type="file"
          id="uploaded_app_icon_input_4"
          name="thumbnail_4"
          onChange={(e) => {
            DisplayImage(e, "uploaded_app_icon_4", null);
          }}
        />
      </label>
    </div>
  );
}
