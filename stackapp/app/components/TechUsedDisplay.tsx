export default function TechUsedDisplay({ t }: { t: string[] }) {
  return (
    <>
      <div style={{ display: "flex", gap: "0.4rem", flexDirection: "row" }}>
        {t.map((y, index2) => {
          return (
            <img
              src={y}
              key={index2}
              alt={y.split("/")[3].split(".")[0] + " icon"}
              style={{ width: "25px", marginRight: "10px" }}
            />
          );
        })}
      </div>
    </>
  );
}
