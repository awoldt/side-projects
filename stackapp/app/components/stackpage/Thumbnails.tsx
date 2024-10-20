import { useRef } from "react";

export default function StackImages({
  thumbnails,
}: {
  thumbnails: string[] | undefined;
}) {
  const imgMainRef = useRef<HTMLImageElement>(null);

  return (
    <>
      <div className="content">
        <img
          ref={imgMainRef}
          className="imageMain"
          src={thumbnails![0]}
          width={0}
          height={0}
          sizes="100vw"
          alt="profile-img"
        />

        {thumbnails!.length > 1 && (
          <div className="imageThumbnailHolder">
            {thumbnails?.map((x, index) => {
              return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                <img
                  key={index}
                  className="img-thumbnail"
                  src={`${x}`}
                  width="150"
                  height="100"
                  alt="profile-img"
                  onClick={() => {
                    imgMainRef.current!.src = `${x}`;
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
