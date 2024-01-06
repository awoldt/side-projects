import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "..", ".env") });
import express from "express";
import compression from "compression";
import { engine } from "express-handlebars";
import CustomHelpers from "./helpers";
import routes from "./routes";

const app = express();
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    layoutsDir: path.join(__dirname, "..", "views", "layouts"),
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "..", "views", "partials"),
    helpers: CustomHelpers.helpers,
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "..", "views"));

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(compression());
app.use(routes);

app.listen(process.env.PORT || 8080, () => {
  console.log(`\nServer listening on port ${process.env.PORT || 8080}`);
});
