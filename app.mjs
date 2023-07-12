import { default as express } from "express";
import { default as hbs } from "hbs";
import * as path from "path";
import { default as logger } from "morgan";
import { default as cookieParser } from "cookie-parser";
import * as http from "http";
import { approotdir } from "./approotdir.mjs";
import {
  normalizePort,
  onError,
  onListening,
  handle404,
  basicErrorHandler,
} from "./appsupport.mjs";

import { InMemoryNotesStore } from "./src/models/notes-memory.mjs";
import { router as indexRouter } from "./src/routes/index.mjs";
import { router as notesRouter } from './src/routes/notes.mjs'

export const NotesStore = new InMemoryNotesStore();
export const app = express();

const __dirname = approotdir;

// view engine setup
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "src/views/partials"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use('/notes', notesRouter);


// error handler
app.use(handle404);
app.use(basicErrorHandler);

export const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

export const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);


